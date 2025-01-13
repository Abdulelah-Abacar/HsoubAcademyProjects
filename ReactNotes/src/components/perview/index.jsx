import React from "react";
import NoteForm from "../noteForm";
import { setToLocalStorge } from "../../utils/localStorge";
import { validate } from "../../utils/validate";

function Perview({
  notesList,
  selectedNote,
  edit,
  setEdit,
  setContent,
  setTitle,
  setCreate,
  setSelectedNote,
  setNotesList,
  title,
  content,
  setValidationErrors,
}) {
  const note = notesList.find((item) => item.id === selectedNote);

  const editNoteHandler = () => {
    const note = notesList.find((note) => note.id === selectedNote);
    setEdit(true);
    setContent(note.content);
    setTitle(note.title);
  };
  const updateNoteHandler = () => {
    if (!validate(title, content, setValidationErrors)) return;

    const updatedNotes = [...notesList];
    const noteIndex = notesList.findIndex((note) => note.id === selectedNote);
    updatedNotes[noteIndex] = {
      id: selectedNote,
      title,
      content,
    };

    setToLocalStorge("notes", updatedNotes);
    setNotesList(updatedNotes);
    setEdit(false);
    setTitle("");
    setContent("");
  };
  const deleteNoteHandler = () => {
    const updatedNotes = [...notesList];
    const noteIndex = notesList.findIndex((note) => note.id === selectedNote);
    notesList.splice(noteIndex, 1);
    setToLocalStorge("notes", notesList);
    setNotesList(notesList);
    setSelectedNote(null);
  };
  let noteDisplay = (
    <div>
      <h2>{note?.title}</h2>
      <p>{note?.content}</p>
    </div>
  );

  if (edit)
    noteDisplay = (
      <NoteForm
        formTitle={"تعديل ملاحظة"}
        btnText={"تعديل"}
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
        setCreate={setCreate}
        setEdit={setEdit}
        onSubmit={updateNoteHandler}
      />
    );

  if (!notesList.length) return <h2 className="center">لا يوجد ملاحظات</h2>;
  if (selectedNote === null)
    return <h2 className="center">الرجاء اختيار ملاحظة</h2>;
  return (
    <div>
      {!edit && (
        <div className="note-operations">
          <a href="#" onClick={editNoteHandler}>
            <i className="fa fa-pencil-alt" />
          </a>
          <a href="#" onClick={deleteNoteHandler}>
            <i className="fa fa-trash" />
          </a>
        </div>
      )}
      {noteDisplay}
    </div>
  );
}

export default Perview;
