const { app, BrowserWindow, Menu, ipcMain, dialog, Notification, Tray } = require('electron');
const path = require("path");
const fs = require("fs");

const appPath = app.getPath("userData");

let mainWindow;
let addWindo;
let addTimedWindow;
let addImagedWindow;
let tray = null;

process.env.NODE_ENV = 'production';

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile("index.html");

  mainWindow.on("closed", () => app.quit())

  const mainMenu = Menu.buildFromTemplate(mainMenuTamplate);

  Menu.setApplicationMenu(mainMenu);

  mainWindow.on("minimize", function(event) {
    event.preventDefault();
    mainWindow.hide();
    tray = createTray() ;
  });

  mainWindow.on("restore", (event) => {
    mainWindow.show();
    tray.destroy();
  })
});

function createTray() {
  let iconPath = path. join(__dirname,"./assets/imgs/icon.png");
  let appIcon = new Tray (iconPath);
  const contextMenu = Menu. buildFromTemplate (iconMenuTemplate);

  appIcon.on("double-click", function (event){
    mainWindow.show();
  });

  appIcon.setToolTip("تطبيق ادارة المهام");
  appIcon.setContextMenu(contextMenu);
  return appIcon;
}

const iconMenuTemplate = [
  {
    label: "فتح",
    click() {
      mainWindow.show();
    }
  },
  {
    label: "اغلاق",
    click() {
      app.quit();
    }
  },
];

const mainMenuTamplate = [
  {
    label: 'القائمة',
    submenu: [
      {
        label: "اضافة مهمة",
        click() {
          initAddWindo()
        }
      },
      {
        label: "اضافة مهمة مؤقتة",
        click() {
          createTimedWindow()
        }
      },
      {
        label: "اضافة مهمة مع صورة",
        click() {
          createImagedWindow()
        }
      },
      {
        label: "خروج",
        accelerator: process.platform === 'darwin' ? "Cmd+Q" : "Ctrl+Q",
        click() {
          app.quit();
        }
      }
    ]
  },
]

if(process.platform === 'darwin') {
  mainMenuTamplate.unshift({})
}

if(process.env.NODE_ENV !== 'production') {
  mainMenuTamplate.push({
    label: "ادواة المطور",
    submenu: [
      {
        label: "فتح و اغلاق ادوات المطور",
        accelerator: process.platform === "darwin"? "Cmd+D" : "Ctrl+D",
        click() {
          mainWindow.toggleDevTools()
        }
      },
      {
        label: "اعادة تحميل الصفحة",
        role: "reload"
      }
    ]
  })
}

function initAddWindo() {
  addWindo=new BrowserWindow ({
    width:400,
    height:250,
    webPreferences: {
      nodeIntegration:true,
      contextIsolation: false
    }
  });
  addWindo.loadFile("./views/normalTask.html");

  addWindo.on("closed", (e) => {
    e.preventDefault();
    addWindo = null;
  })

  addWindo.removeMenu()
}

ipcMain.on('add-normal-task', (e, item) => {
  mainWindow.webContents.send("add-normal-task", item);
  addWindo.close()
});

ipcMain.on("new-normal", (e) => {
  initAddWindo();
});

ipcMain.on("create-txt", (e, note) => {
  let dest = Date.now() + "-task.txt";
  dialog.showSaveDialog({
    title: "اختار مكان حفظ الملف",
    defaultPath: path.join(__dirname, './' + dest),
    buttonLabel: "see",
    filters: [
      {
        name: "Text Files",
        extensions: ['txt']
      }
    ]
  }).then(file => {
    if(!file.canceled) {
      fs.writeFile(file.filePath.toString(), note, (err) => {
        if(err) throw err
      })
    }
  }).catch(err => console.log(err))
});

function createTimedWindow() {
  addTimedWindow = new BrowserWindow ({
    width:400,
    height:400,
    webPreferences: {
      nodeIntegration:true,
      contextIsolation: false
    }
  });

  addTimedWindow.loadFile("./views/timedTask.html");
  
  addTimedWindow.on("closed", (e) => {
    e.preventDefault();
    addTimedWindow = null;
  })

  addTimedWindow.removeMenu()
}

ipcMain.on("add-timed-note", function (e, note, notificationTime){
  mainWindow.webContents.send("add-timed-note", note, notificationTime);
  addTimedWindow.close();
});

ipcMain.on("notify", function(e, taskValue){
  new Notification({
    title: "لديك تنبية من مهاميك",
    body: taskValue,
    icon: path.join(__dirname,"./assets/imgs/icon.png")
  }).show();
});

ipcMain.on("new-timed", (e) => {
  createTimedWindow();
});

function createImagedWindow() {
  addImagedWindow = new BrowserWindow ({
    width:400,
    height:420,
    webPreferences: {
      nodeIntegration:true,
      contextIsolation: false
    }
  });

  addImagedWindow.loadFile("./views/imagedTask.html");
  
  addImagedWindow.on("closed", (e) => {
    e.preventDefault();
    addImagedWindow = null;
  })

  addImagedWindow.removeMenu()
}

ipcMain.on("upload-image", function(event){
  dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [
      {
        name: "images", 
        extentions: ["jpg", "png", "gif"]
      }
    ]
  }).then(result => {
    event.sender.send("open-file", result.filePaths, appPath)
  });
});

ipcMain.on("add-imaged-task", function(e, note, imgURI){
  mainWindow.webContents.send("add-imaged-task", note, imgURI);
  addImagedWindow.close();
});

ipcMain.on("new-imaged", function(e){
  createImagedWindow()
});