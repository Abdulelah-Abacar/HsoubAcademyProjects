const { ipcRenderer } = require("electron");
const form = document. querySelector ("form");
const path = require("path");
const fs = require("fs");
const { log } = require("console");

let fileName;
let filePath;
let imagePath;

let imgUrl = document.querySelector(".url-img__input")
let btn = document.querySelector(".img-upload");

btn.addEventListener("click", () => {
  if(imgUrl.value.length === 0) {
    ipcRenderer.send("upload-image");
  }
});

ipcRenderer.on("open-file", (event, arg, appPath) => {
  if(imgUrl.value.length === 0) {
    imagePath = arg[0];
    fileName = path.basename(imagePath);
    filePath = process.platform === "win32" ? appPath + "\\" + fileName : appPath + fileName;
  }
});

form.addEventListener("submit", function(e){
  e.preventDefault ();

  const input = document.querySelector(".note").value;
  const urlImgPath = imgUrl.value;

  if (imgUrl.value.length === 0){
    fs.copyFile(imagePath, filePath, (err) => {
      if(err) throw err;
    });
    ipcRenderer.send("add-imaged-task", input, filePath);
  } 
  else if(imgUrl.value.length !== 0){
    ipcRenderer.send("add-imaged-task", input, urlImgPath);
  }
});