import { Row } from "reactstrap";
import Avatar from "../Avater";

const ContactHeader = (props) => {
  return (
    <Row className="heading">
      <Avatar src={props.user?.avatar} />
      <div>جهات الاتصال</div>
      <div className="mr-auto nav-link" onClick={props.toggle}>
        <i className="fa fa-bars" />
      </div>
    </Row>
  );
};

export default ContactHeader;
