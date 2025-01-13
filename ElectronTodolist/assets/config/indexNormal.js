const { ipcRenderer } = require("electron");
const connection = require("./connestion");

let newNormal = document.querySelector(".todo--normal .add-new-task");

newNormal.addEventListener("click", () => {
  ipcRenderer.send("new-normal");
})

ipcRenderer.on("add-normal-task", (e, task) => {
  addNormalTask(task);
});

function addNormalTask(task){
  connection.insert ({
    into: "tasks",
    values: [{ note: task }]
  }).then(() => showNormal());
}

function deleteTask(taskId) {
  return connection.remove({
    from: "tasks",
    where: { id: taskId }
  }).then(() => showNormal());
}

function updateTask(taskId, taskValue) {
  connection.update({
    in: "tasks",
    where: { id: taskId },
    set: { note: taskValue }
  }).then(() => showNormal());
}

function showNormal() {
  let clearNormalBtn = document.querySelector(".todo--normal .clear-all");
  let normalTasksList = document.querySelector(".todo--normal__list");
  normalTasksList.innerHTML = "";

  connection.select ({ from: "tasks" }).then((tasks) => {
    if (tasks.length === 0) {
      normalTasksList.innerHTML = "<li class='empty-list'>لا يوجد مهام</li>";
      clearNormalBtn.classList.remove('clear-all--show')
    } 
    else {
      clearNormalBtn.classList.add('clear-all--show')
      clearNormalBtn.addEventListener("click", () => {
        return connection.remove({
          from: "tasks"
        }).then(() => showNormal())
      })
      for (let task of tasks){
        let lisItem = document.createElement("li");
        let taskInput = document.createElement("input");
        let deleteBTN = document.createElement("button");
        let btnsHolder = document.createElement("div");
        let updateBTN = document.createElement("button");
        let exportBTN = document.createElement("button");

        btnsHolder.classList.add("buttons-holder");

        deleteBTN.innerHTML = 'حذف';
        updateBTN.innerHTML = 'تحديث';
        exportBTN.innerHTML = 'تصدير';

        deleteBTN.addEventListener("click", () => {
          deleteTask(task.id)
        });
        updateBTN.addEventListener("click", () => {
          updateTask(task.id, taskInput.value)
        });
        exportBTN.addEventListener("click", () => {
          ipcRenderer.send("create-txt", task.note)
        });

        taskInput.value = task.note;
        btnsHolder.appendChild(deleteBTN);
        btnsHolder.appendChild(updateBTN);
        btnsHolder.appendChild(exportBTN);
        lisItem.appendChild(taskInput);
        lisItem.appendChild(btnsHolder);
        normalTasksList.appendChild(lisItem);
      }
    }
  });
}

showNormal();