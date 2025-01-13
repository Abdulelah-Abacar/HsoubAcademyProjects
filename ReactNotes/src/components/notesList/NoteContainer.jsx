import React from "react";
const NotesList = ({ notes, setSelectedNote, selectedNote }) => {
  return (
    <ul className="notes-list">
      {notes?.map((note) => (
        <li
          key={note?.id}
          className={`note-item ${selectedNote === note?.id && "active"}`}
          onClick={() => setSelectedNote(note?.id)}
        >
          {note?.title}
        </li>
      ))}
    </ul>
  );
};
export default NotesList;
