import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Recorder } from "./components/recording/Recorder";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Recorder />
    </>
  );
}

export default App;
