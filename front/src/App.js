import "./App.css";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/home/Home";
import Login from "./components/login/Login";
import Inscription from "./components/inscription/Inscription";

function App() {
  return (
    <div className="app">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/inscription" element={<Inscription />} />
      </Routes>
    </div>
  );
}

export default App;
