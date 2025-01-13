import { Link } from "react-router-dom";
import { Card, Form, Input, Button } from "reactstrap";
import { Error } from "../components";
import Logo from "../assets/logo.png";
import { useState } from "react";
import Auth from "../Auth";
import axios from "axios";

const Register = () => {
  Auth.init();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  const onSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3000/api/auth/register", formData)
      .then((res) => {
        Auth.login(res?.data);
        location.reload();
      })
      .catch((err) => {
        setError(err.response?.data.message);
      });
  };

  return (
    <Card className="auth col-lg-3 col-sm-6">
      <Form onSubmit={onSubmit}>
        <img src={Logo} alt="" width="200" />
        <h5 className="mb-4">إنشاء حساب جديد</h5>
        <Error error={error} />
        <Input
          value={formData.name}
          name="name"
          onChange={onChange}
          placeholder="الاسم"
          required
          autoFocus
        />
        <Input
          value={formData.username}
          name="username"
          onChange={onChange}
          placeholder="اسم المستخدم"
          required
        />
        <Input
          type="password"
          value={formData.password}
          name="password"
          onChange={onChange}
          placeholder="كلمة المرور"
          required
        />
        <Button color="primary" block className="mb-3">
          {" "}
          إنشاء{" "}
        </Button>
        <small>
          <Link to="/login">تسجيل الدخول</Link>
        </small>
        <p className="m-3 text-muted">&copy; {new Date().getFullYear()}</p>
      </Form>
    </Card>
  );
};

export default Register;
