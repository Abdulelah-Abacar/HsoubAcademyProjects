import avatar from "../assets/avatar.png";

const Avatar = (props) => {
  let src = props.src ? `http://localhost:3000/uploads/${props.src}` : avatar;
  return (
    <div>
      <img
        src={props.file || src}
        onClick={props.onClick}
        className="img-fluid rounded-circle ml-3 avatar"
        alt=""
      />
    </div>
  );
};

export default Avatar;
