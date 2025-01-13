const { ipcRenderer } = require("electron");
const connection = require("./connestion");
const fs = require("fs");

let newImaged = document.querySelector(".todo--imaged .add-new-task");

newImaged.addEventListener("click", () => {
  ipcRenderer.send("new-imaged");
})

ipcRenderer.on("add-imaged-task", function (e, note, imgURI){
  addImagedTask(note, imgURI);
});

function addImagedTask(note, imgURI){
  connection.insert({
    into: "imaged",
    values: [{ note: note, img_uri: imgURI }]
  }).then(() => showImaged());
};

function deleteImageTask(taskId, imgURI) {
  if(imgURI) {
    fs.unlink(imgURI, (err) => {
      if(err){
        console.log(err);
        return;
      }
    });
  }

  return connection.remove({
    from: "imaged",
    where: { id: taskId }
  }).then(() => showImaged());
}

function updateIMagedTask(taskId, taskValue) {
  connection.update({
    in: "imaged",
    where: { id: taskId },
    set: { note: taskValue }
  }).then(() => showImaged());
}

function showImaged() {
  let clearImagedBtn = document.querySelector(".todo--imaged .clear-all");
  let imagedTasksList = document.querySelector(".todo--imaged__list");
  imagedTasksList.innerHTML = "";

  connection.select ({ from: "imaged" }).then((tasks) => {
    if (tasks.length === 0) {
      imagedTasksList.innerHTML = "<li class='empty-list'>لا يوجد مهام</li>";
      clearImagedBtn.classList.remove('clear-all--show')
    } 
    else {
      clearImagedBtn.classList.add('clear-all--show')
      clearImagedBtn.addEventListener("click", () => {
        return connection.remove({
          from: "imaged"
        }).then(() => showImaged())
      })
      for (let task of tasks){
        clearImagedBtn.addEventListener("click", () => {
          fs.unlink(task.img_uri, (err) => {
            if(err){
              console.log(err);
              return;
            }
          });
        })
        let lisItem = document.createElement("li");
        let taskInput = document.createElement("input");
        let deleteBTN = document.createElement("button");
        let updateBTN = document.createElement("button");
        let exportBTN = document.createElement("button");
        let btnsHolder = document.createElement("div");
        let imgHolder = document.createElement("div");
        let noteContentHolder = document.createElement("div");
        let taskImg = document.createElement("img");

        btnsHolder.classList.add("buttons-holder");

        taskImg.setAttribute('src', task.img_uri);

        deleteBTN.innerHTML = 'حذف';
        updateBTN.innerHTML = 'تحديث';
        exportBTN.innerHTML = 'تصدير';

        deleteBTN.addEventListener("click", () => {
          deleteImageTask(task.id, task.img_uri);
        });
        updateBTN.addEventListener("click", () => {
          updateIMagedTask(task.id, taskInput.value)
        });
        exportBTN.addEventListener("click", () => {
          ipcRenderer.send("create-txt", task.note)
        });

        taskInput.value = task.note;
        
        btnsHolder.appendChild(deleteBTN);
        btnsHolder.appendChild(updateBTN);
        btnsHolder.appendChild(exportBTN);
        
        noteContentHolder.appendChild(taskInput)
        noteContentHolder.appendChild(btnsHolder)
        
        imgHolder.appendChild(taskImg);

        lisItem.appendChild(noteContentHolder);
        lisItem.appendChild(imgHolder);

        imagedTasksList.appendChild(lisItem);
      }
    }
  });
}

showImaged()