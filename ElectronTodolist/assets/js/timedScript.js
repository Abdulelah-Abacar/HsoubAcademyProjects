const { ipcRenderer } = require("electron");
const form = document. querySelector ("form");

form.addEventListener("submit", function(e){
  e.preventDefault ();
  let note = document.querySelector(".note").value,
      pickedHoures = document.querySelector(".pick-hours").value * 3600000,
      pickedMinutes = document.querySelector(".pick-minutes").value * 60000,
      notificationDate = Date.now();

  notificationDate += (pickedHoures + pickedMinutes);
  notificationDate = new Date (notificationDate);
  ipcRenderer.send("add-timed-note", note, notificationDate);
});