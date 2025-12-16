import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/home/Home";
import Login from "./components/login/Login";
import Inscription from "./components/inscription/Inscription";
import Map from "./components/map/Map";

function App() {
  const location = useLocation();

  return (
    <div className="app">
      <Navbar />
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/map" element={<Map />} />
      </Routes>
    </div>
  );
}

export default App;
