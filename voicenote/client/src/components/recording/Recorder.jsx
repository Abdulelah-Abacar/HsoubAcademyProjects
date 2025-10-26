import { useState, useEffect } from "react";
import RecordRTC from "recordrtc";
import AllActions from "../database_actions/Dexie_Actions";
import DbActions from "../database_actions/MongoActions";
import SubscriptionButton from "../Subscribe";

export const Recorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [blob, setBlob] = useState(null);
  const [data, setData] = useState([]);
  const [voiceStream, setVoiceStream] = useState(null);
  const [recorder, setRecorder] = useState(null);

  useEffect(() => {
    async function getMedia() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        setVoiceStream(stream);
        const newRecorder = new RecordRTC(stream, { type: "audio" });
        setRecorder(newRecorder);
      } catch (error) {
        console.error("Error accessing microphone:", error);
      }
    }
    getMedia();
  }, []);

  function getData() {
    try {
      AllActions.DatabaseExists().then((db) => {
        if (db) {
          AllActions.ReadData()
            .then((res) => {
              setData(res);
            })
            .catch((err) => console.log(err));
        } else {
          console.log("Database not found..");
        }
      });
    } catch (ex) {
      console.log(ex);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  const startRecording = () => {
    if (recorder) {
      recorder.startRecording();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (recorder) {
      recorder.stopRecording(() => {
        const blob = recorder.getBlob();
        setBlob(blob);
        saveNote(blob);
      });
    }
  };

  async function registerSynch(tag) {
    if ("SyncManager" in window) {
      navigator.serviceWorker.ready.then((reg) => {
        reg.sync.register(tag).then(() => {
          console.log("Sync event waiting...");
        });
      });
    }
  }

  const saveNote = (voiceData) => {
    const newTitle = prompt(
      "من فضلك اكتب عنوان الملاحظة",
      "ملاحظة " + Date.now()
    );

    if (newTitle !== null) {
      voiceData.arrayBuffer().then((res) => {
        const uInt8 = new Uint8Array(res);
        const audioContents = JSON.stringify(uInt8);
        const savedObject = {
          _id: Date.now(),
          name: "n" + Date.now(),
          title: newTitle,
          audio: audioContents,
          status: "1",
        };

        DbActions.SaveToServer(savedObject)
          .then((response) => {
            if (response === null) {
              throw new Error("ُError while saving to server..");
            }
            DbActions.Push({
              title: "ملاحظات جديدة",
              message: "تم إضافة بعض الملاحظات الجديدة",
            });
          })
          .catch((err) => {
            console.log(err);
            savedObject.status = "w";
            registerSynch("Waiting...");
          })
          .finally(() => {
            AllActions.InsertBulk([savedObject]);
            getData();
          });
      });
    }
    setIsRecording(false);
  };

  async function Delete(id) {
    var result = window.confirm("هل أنت متأكد من حذف هذا العنصر؟");

    if (result) {
      id = Number(id);

      try {
        const noteToDelete = await AllActions.ReadDataByID(id);
        if (!noteToDelete || noteToDelete.length === 0) {
          console.error("Not found");
          return;
        }

        const status = noteToDelete[0].status;
        if (status === "w") {
          await AllActions.DeleteById(id);
        } else {
          const response = await DbActions.DeleteFromServer(id);
          if (response?.ok) {
            await AllActions.DeleteById(id);
            await DbActions.Push({
              title: "حذفت ملاحظات",
              message: "تم حذف بعض الملاحظات",
            });
          } else {
            await deleteOffline(id);
          }
        }
      } catch (error) {
        console.error("Error while deleting:", error);
        await deleteOffline(id);
      } finally {
        getData();
      }
    }
  }

  async function deleteOffline(id) {
    await AllActions.Update(Number(id), { status: "0" });
    registerSynch("Waiting...");
  }

  function Select(id) {
    AllActions.ReadDataByID(Number(id)).then((item) => {
      const obj = JSON.parse(item[0].audio);
      const data = Object.values(obj);
      const uint8Attay = new Uint8Array(data);
      const audioBlob = new Blob([uint8Attay], {
        type: "audio/ogg; codecs=opus",
      });
      setBlob(audioBlob);
    });
  }

  async function ManualSync() {
    try {
      const result = await DbActions.Sync();
      if (result) {
        alert("تمت المزامنة بنجاح!");
      }
    } catch (err) {
      alert("حدث خطأ أثناء المزامنة اليدوية: " + err);
    }
  }

  async function ImportNotes() {
    try {
      await DbActions.ImportFromServer();
      getData();

      alert("تم استيراد الملاحظات بنجاح!");
    } catch (err) {
      alert("حدث خطأ أثناء استيراد الملاحظات: " + err);
    }
  }

  return (
    <>
      <div>
        <h1>مسجل الملاحظات</h1>
        <SubscriptionButton />
        <div>
          <hr></hr>
          {data.map((item) => (
            <div className="item-row" key={item._id}>
              <div className="item-title">{item.title}</div>

              <div className="buttons-container">
                <button
                  className="selected-item"
                  value={item._id}
                  onClick={(event) => Select(event.target.value)}
                >
                  o
                </button>
                <button
                  className="delete-item"
                  value={item._id}
                  onClick={(event) => Delete(event.target.value)}
                >
                  X
                </button>
              </div>
            </div>
          ))}
          <hr></hr>
        </div>

        <main>
          <div className="voice-controls">
            <button onClick={startRecording} disabled={isRecording}>
              <i className="fa fa-microphone"></i>
              ابدأ التسجيل
            </button>
            <button onClick={stopRecording} disabled={!isRecording}>
              <i className="fa fa-stop"></i>
              أوقف التسجيل
            </button>
            <button onClick={ManualSync}>
              <i className="fa fa-paper-plane"></i>
              مزامنة يدوية
            </button>
            <button onClick={ImportNotes}>
              <i className="fa fa-download"></i>
              استيراد الملاحظات
            </button>
          </div>
          {blob && (
            <div className="voice-player">
              <h2>تشغيل التسجيل</h2>
              <audio controls src={URL.createObjectURL(blob)}></audio>
            </div>
          )}
        </main>
      </div>
    </>
  );
};
