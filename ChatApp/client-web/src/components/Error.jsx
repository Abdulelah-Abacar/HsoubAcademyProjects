import { Alert } from "reactstrap";

const Error = ({ error }) => {
  return error ? <Alert color="danger">{error}</Alert> : "";
};

export default Error;
