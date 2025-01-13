const { ipcRenderer } = require("electron");
const connection = require("./connestion");

let newTimed = document.querySelector(".todo--timed .add-new-task");

newTimed.addEventListener("click", () => {
  ipcRenderer.send("new-timed");
})

ipcRenderer.on("add-timed-note", function(e, note, notificationTime){
  addTimedTask(note, notificationTime);
});

function addTimedTask(note, notificationTime){
  connection.insert ({
    into: "timed",
    values: [{
      note: note,
      pick_status: 0,
      pick_time: notificationTime
    }]
  }).then(() => showTimed());
}

function deleteTimedTask(taskId) {
  return connection.remove({
    from: "timed",
    where: { id: taskId },
  }).then(() => showTimed());
}

function updateTimedTask(taskId, taskValue) {
  connection.update({
    in: "timed",
    where: { id: taskId },
    set: { note: taskValue }
  }).then(() => showTimed());
}

function showTimed() {
  let clearTimedBtn = document.querySelector(".todo--timed .clear-all");
  let timedTasksList = document.querySelector(".todo--timed__list");
  timedTasksList.innerHTML = "";

  connection.select ({ from: "timed" }).then((tasks) => {
    if (tasks.length === 0) {
      timedTasksList.innerHTML = "<li class='empty-list'>لا يوجد مهام</li>";
      clearTimedBtn.classList.remove('clear-all--show')
    } 
    else {
      clearTimedBtn.classList.add('clear-all--show')
      clearTimedBtn.addEventListener("click", () => {
        return connection.remove({
          from: "timed"
        }).then(() => showTimed())
      })
      for (let task of tasks){
        let lisItem = document.createElement("li");
        let taskInput = document.createElement("input");
        let deleteBTN = document.createElement("button");
        let btnsHolder = document.createElement("div");
        let updateBTN = document.createElement("button");
        let exportBTN = document.createElement("button");
        let timeHolder = document.createElement("div");

        timeHolder.classList.add("time-holder");

        taskInput.value = task.note;

        if(task.pick_status === 1) {
          timeHolder.innerHTML = 'جرى التنبية في الساعة' + task.pick_time.toLocaleTimeString();
        } else {
          timeHolder.innerHTML = "يتم التنبية في الساعة" + task.pick_time.toLocaleTimeString();
        }

        let checkInterval = setInterval(function (){
          let currentDate = new Date();
          if(task.pick_time.toString() === currentDate.toString()){
            connection.update({
              in: "timed",
              where:{ id: task.id },
              set: { pick_status: 1 }
            }).then(() => showTimed());

            ipcRenderer.send("notify", task.note);

            clearInterval(checkInterval)
          };
        }, 1000);

        btnsHolder.classList.add("buttons-holder");

        deleteBTN.innerHTML = 'حذف';
        updateBTN.innerHTML = 'تحديث';
        exportBTN.innerHTML = 'تصدير';

        deleteBTN.addEventListener("click", () => {
          deleteTimedTask(task.id)
        });
        updateBTN.addEventListener("click", () => {
          updateTimedTask(task.id, taskInput.value)
        });
        exportBTN.addEventListener("click", () => {
          ipcRenderer.send("create-txt", task.note)
        });

        taskInput.value = task.note;
        btnsHolder.appendChild(deleteBTN);
        btnsHolder.appendChild(updateBTN);
        btnsHolder.appendChild(exportBTN);
        lisItem.appendChild(taskInput);
        lisItem.appendChild(timeHolder);
        lisItem.appendChild(btnsHolder);
        timedTasksList.appendChild(lisItem);
      }
    }
  });
}

showTimed();