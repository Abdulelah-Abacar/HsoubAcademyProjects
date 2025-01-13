const NoteForm = ({
  formTitle,
  title,
  content,
  btnText,
  onSubmit,
  setTitle,
  setContent,
  setCreate,
  setEdit,
}) => {
  return (
    <div>
      <h2>{formTitle}</h2>
      <div>
        <input
          type="text"
          name="title"
          className="form-input mb-30"
          placeholder="العنوان"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          rows="10"
          name="content"
          className="form-input"
          placeholder="النص"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <a
          href="#"
          className="button gray ml-5"
          onClick={() => {
            setCreate(false);
            setEdit(false);
          }}
        >
          الغاء
        </a>
        <a href="#" className="button green" onClick={onSubmit}>
          {btnText}
        </a>
      </div>
    </div>
  );
};

export default NoteForm;
