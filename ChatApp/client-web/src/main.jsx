import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { Chat, NotFound, Login, Register, Password } from "./views";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Auth from "./Auth";

const router = createBrowserRouter([
  {
    path: "/",
    element: Auth.auth() ? <Chat /> : <Navigate to={"/login"} />,
    errorElement: <NotFound />,
  },
  {
    path: "password",
    element: Auth.auth() ? <Password /> : <Navigate to={"/login"} />,
  },
  {
    path: "login",
    element: Auth.guest() ? <Login /> : <Navigate to={"/"} />,
  },
  {
    path: "register",
    element: Auth.guest() ? <Register /> : <Navigate to={"/"} />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
  // <React.StrictMode>
  // </React.StrictMode>
);
