import { useState, useEffect } from "react";
import Perview from "./components/perview";
import NoteForm from "./components/noteForm";
import NotesList from "./components/notesList/NoteContainer";
import { getFromLocalStorge, setToLocalStorge } from "./utils/localStorge";
import { validate } from "./utils/validate";
import Alert from "./components/Alert";
import "./App.css";

function App() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [notesList, setNotesList] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [create, setCreate] = useState(false);
  const [edit, setEdit] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);

  useEffect(() => {
    getFromLocalStorge("notes")
      ? setNotesList(JSON.parse(getFromLocalStorge("notes")))
      : setToLocalStorge("notes", []);
  }, []);

  useEffect(() => {
    if (validationErrors.length !== 0) {
      setTimeout(() => {
        setValidationErrors([]);
      }, 5000);
    }
  }, [validationErrors]);

  const handleAddNote = () => {
    if (!validate(title, content, setValidationErrors)) return;

    const note = {
      id: Date.now(),
      title,
      content,
    };
    const updatedNotes = [...notesList, note];

    setToLocalStorge("notes", updatedNotes);
    setNotesList(updatedNotes);
    setCreate(false);
    setEdit(false);
    setSelectedNote(note.id);
    setTitle("");
    setContent("");
  };

  return (
    <div className="App">
      <div className="notes-section">
        <NotesList
          notes={notesList}
          setSelectedNote={setSelectedNote}
          selectedNote={selectedNote}
        />
        <button className="add-btn" onClick={() => setCreate(true)}>
          +
        </button>
      </div>
      <div className="preview-section">
        {!create ? (
          <Perview
            notesList={notesList}
            selectedNote={selectedNote}
            edit={edit}
            setEdit={setEdit}
            setCreate={setCreate}
            setContent={setContent}
            setTitle={setTitle}
            setSelectedNote={setSelectedNote}
            setNotesList={setNotesList}
            title={title}
            content={content}
            setValidationErrors={setValidationErrors}
          />
        ) : (
          <NoteForm
            formTitle={"ملاحظة جديدة"}
            btnText={"حفظ"}
            title={title}
            setTitle={setTitle}
            content={content}
            setContent={setContent}
            setCreate={setCreate}
            setEdit={setEdit}
            onSubmit={handleAddNote}
          />
        )}
      </div>
      {validationErrors.length !== 0 && (
        <Alert validationMessages={validationErrors} />
      )}
    </div>
  );
}

export default App;
