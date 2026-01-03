import "./App.css";
import React, { useState, useRef } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/sidebar/Sidebar";
import Home from "./components/home/Home";
import Login from "./components/login/Login";
import Inscription from "./components/inscription/Inscription";
import Map from "./components/map/Map";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const mapRef = useRef(null);
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ category: "Tous", radius: 5, radiusEnabled: true });

  const handleToggle = (open) => setSidebarOpen(Boolean(open));
  
  const handleSearch = (query) => {
    setSearchQuery(query);
    // Navigate to map if not already there
    navigate("/map");
    // The Map component will handle the search
  };

  const handleAddSpotClick = () => {
    // Navigate to map and enable marking mode on the Map component
    navigate('/map');
    // small delay to ensure the Map mounted and ref is available
    setTimeout(() => {
      if (mapRef.current && typeof mapRef.current.enableMarkingMode === 'function') {
        mapRef.current.enableMarkingMode();
      }
    }, 250);
  };

  const handleFilterChange = (next) => {
    setFilters((prev) => ({ ...prev, ...next }));
    console.log("Filters updated:", { ...filters, ...next });
  };

  return (
    <div className={`app layout-with-sidebar ${!sidebarOpen ? "sidebar-hidden" : ""}`}>
      <Sidebar open={sidebarOpen} onToggle={handleToggle} onSearch={handleSearch} onFilterChange={handleFilterChange} onAddSpot={handleAddSpotClick} />
      <Navbar />
      <main className="app-content">
        <Routes>
          <Route path="/" element={<Home filters={filters} />} />
          <Route path="/home" element={<Home filters={filters} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/inscription" element={<Inscription />} />
          <Route path="/map" element={<Map ref={mapRef} searchQuery={searchQuery} filters={filters} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
