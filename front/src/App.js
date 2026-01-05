import "./App.css";
import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/sidebar/Sidebar";
import Home from "./components/home/Home";
import Login from "./components/login/Login";
import Inscription from "./components/inscription/Inscription";
import Map from "./components/map/Map";
import SearchPage from "./components/recherche/SearchPage";
import AddSpotModal from "./components/AddSpotModal/AddSpotModal";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showAddSpotModal, setShowAddSpotModal] = useState(false);
  const [isMarkingMode, setIsMarkingMode] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState(null);
  const navigate = useNavigate();

  const handleToggle = (open) => setSidebarOpen(Boolean(open));
  const handleSearch = (query) => {
    // Navigue vers la page de recherche avec la requête
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleAddSpot = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      // D'abord naviguer vers /search pour voir la map
      navigate('/search');
      // Puis activer le mode marquage
      setTimeout(() => {
        setIsMarkingMode(true);
      }, 100);
    }
  };

  const handleSpotCreated = (spot) => {
    // Récupérer tous les spots de la map après en avoir créé un
    setIsMarkingMode(false);
    // On peut ici émettre un événement pour recharger les spots
    window.dispatchEvent(new CustomEvent('spotCreated', {
      detail: { spot }
    }));
  };

  // Écouter quand l'utilisateur clique sur la map en mode marquage
  React.useEffect(() => {
    const handleMapClick = (e) => {
      if (!isMarkingMode) return;
      
      const { lat, lng } = e.detail;
      setSelectedCoords({ lat, lng });
      setShowAddSpotModal(true);
      setIsMarkingMode(false); // Éteindre le mode marquage
    };

    window.addEventListener('mapPointSelected', handleMapClick);
    return () => window.removeEventListener('mapPointSelected', handleMapClick);
  }, [isMarkingMode]);

  return (
    <div className={`app layout-with-sidebar ${!sidebarOpen ? "sidebar-hidden" : ""}`}>
      <Sidebar open={sidebarOpen} onToggle={handleToggle} onSearch={handleSearch} onAddSpot={handleAddSpot} />
      <Navbar />
      <main className="app-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/inscription" element={<Inscription />} />
          <Route 
            path="/search" 
            element={<SearchPage isMarkingMode={isMarkingMode} />} 
          />
        </Routes>
      </main>
      
      <AddSpotModal 
        isOpen={showAddSpotModal} 
        onClose={() => {
          setShowAddSpotModal(false);
          setSelectedCoords(null);
          setIsMarkingMode(false);
        }}
        initialLat={selectedCoords?.lat}
        initialLng={selectedCoords?.lng}
        onSpotCreated={handleSpotCreated}
      />
    </div>
  );
}

export default App;
