import "./App.css";
import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/sidebar/Sidebar";
import Home from "./components/home/Home";
import Login from "./components/login/Login";
import Inscription from "./components/inscription/Inscription";
import Map from "./components/map/Map";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleToggle = (open) => setSidebarOpen(Boolean(open));
  const handleSearch = (query) => {
    // Placeholder: forward search to map component or perform lookup
    console.log("Search query:", query);
  };

  return (
    <div className={`app layout-with-sidebar ${!sidebarOpen ? "sidebar-hidden" : ""}`}>
      <Sidebar open={sidebarOpen} onToggle={handleToggle} onSearch={handleSearch} />
      <Navbar />
      <main className="app-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/inscription" element={<Inscription />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
