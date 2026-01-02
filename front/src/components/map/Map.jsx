import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Map.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Map click handler component
const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng);
    },
  });
  return null;
};

const Map = React.forwardRef(({ searchQuery = "" }, ref) => {
  const [userPosition, setUserPosition] = useState(null);
  const [geoError, setGeoError] = useState(null);
  const [geoStatus, setGeoStatus] = useState("pending"); // pending | ok | error
  const [spots, setSpots] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const mapRef = useRef(null);
  const markersRef = useRef({});

  // Récupère la position de l'utilisateur si autorisée
  useEffect(() => {
    alert("la position sur pc n'est pas très fiable !");

    if (!navigator.geolocation) {
      setGeoError("La géolocalisation n'est pas supportée par ce navigateur.");
      setGeoStatus("error");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setGeoStatus("ok");
      },
      (err) => {
        setGeoError(err.message || "Impossible de récupérer la position.");
        setGeoStatus("error");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  }, []);

  // Load spots from backend on mount
  useEffect(() => {
    fetchSpots();
  }, []);

  // Handle search query - auto navigate to spot
  useEffect(() => {
    if (searchQuery && spots.length > 0) {
      const matchedSpot = spots.find(spot => 
        spot.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      if (matchedSpot) {
        setSelectedSpot(matchedSpot);
        // Zoom to the spot and center map
        if (mapRef.current) {
          mapRef.current.setView([matchedSpot.lat, matchedSpot.lng], 14);
          // Open the popup after a short delay
          setTimeout(() => {
            if (markersRef.current[matchedSpot.id]) {
              markersRef.current[matchedSpot.id].openPopup();
            }
          }, 500);
        }
      }
    }
  }, [searchQuery, spots]);

  const fetchSpots = async () => {
    const token = localStorage.getItem('authToken');
    
    // Don't fetch if no token
    if (!token) {
      console.log('No auth token found');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/spots', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setSpots(data.spots || []);
      } else {
        console.error('Failed to fetch spots:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching spots:', error);
    }
  };

  const handleMapClick = (latlng) => {
    setSelectedLocation({ lat: latlng.lat, lng: latlng.lng });
    setShowForm(true);
    setError(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddSpot = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Le nom du spot est requis');
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('Vous devez être connecté pour ajouter un spot');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:4000/api/spots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          lat: selectedLocation.lat,
          lng: selectedLocation.lng
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Add new spot to local state
        setSpots(prev => [...prev, data.spot]);
        setFormData({ name: '', description: '' });
        setSelectedLocation(null);
        setShowForm(false);
        setError(null);
      } else {
        setError(data.error || 'Erreur lors de l\'ajout du spot');
      }
    } catch (error) {
      console.error('Error adding spot:', error);
      setError(`Erreur: ${error.message || 'Impossible de connecter au serveur'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedLocation(null);
    setFormData({ name: '', description: '' });
    setError(null);
  };

  const handleDeleteSpot = async (spotId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce spot ?')) return;

    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Vous devez être connecté');
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/api/spots/${spotId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setSpots(prev => prev.filter(s => s.id !== spotId));
      }
    } catch (error) {
      console.error('Error deleting spot:', error);
    }
  };

  // Centre par défaut global si pas de position utilisateur
  const center = userPosition ? [userPosition.lat, userPosition.lng] : [20, 0];

  return (
    <div className="map-screen">
      <MapContainer
        ref={mapRef}
        center={center}
        zoom={3}
        minZoom={2}
        worldCopyJump
        scrollWheelZoom
        className="map-canvas"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapClickHandler onMapClick={handleMapClick} />

        {userPosition && (
          <Marker position={[userPosition.lat, userPosition.lng]}>
            <Popup>Votre position actuelle</Popup>
          </Marker>
        )}

        {spots.map((spot) => (
          <Marker 
            key={spot.id} 
            position={[spot.lat, spot.lng]}
            ref={(el) => {
              if (el) markersRef.current[spot.id] = el;
            }}
          >
            <Popup>
              <div className="spot-popup">
                <h3>{spot.name}</h3>
                {spot.description && <p>{spot.description}</p>}
                <button 
                  onClick={() => handleDeleteSpot(spot.id)}
                  className="delete-spot-btn"
                >
                  Supprimer
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {geoError && (
        <div className="map-geo-error">
          {geoError}
        </div>
      )}

      {!geoError && geoStatus === "pending" && (
        <div className="map-geo-info">
          Autorisez la géolocalisation pour centrer la carte sur vous.
        </div>
      )}

      {/* Search Result Feedback */}
      {searchQuery && selectedSpot && (
        <div className="search-result-found">
          ✓ Spot trouvé: {selectedSpot.name}
        </div>
      )}
      
      {searchQuery && !selectedSpot && spots.length > 0 && (
        <div className="search-result-not-found">
          ✗ Aucun spot trouvé pour "{searchQuery}"
        </div>
      )}

      {/* Add Spot Form Modal */}
      {showForm && (
        <div className="spot-form-modal">
          <div className="spot-form-container">
            <div className="spot-form-header">
              <h2>Ajouter un spot</h2>
              <button className="close-btn" onClick={handleCloseForm}>✕</button>
            </div>

            {error && <div className="spot-form-error">{error}</div>}

            <form onSubmit={handleAddSpot} className="spot-form">
              <div className="form-group">
                <label htmlFor="name">Nom du spot *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="Nom du spot"
                  disabled={isLoading}
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Description optionnelle"
                  disabled={isLoading}
                  rows="3"
                />
              </div>

              <div className="form-location">
                <p>📍 Latitude: {selectedLocation?.lat.toFixed(4)}</p>
                <p>📍 Longitude: {selectedLocation?.lng.toFixed(4)}</p>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="btn-cancel"
                  disabled={isLoading}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={isLoading}
                >
                  {isLoading ? 'Ajout en cours...' : 'Ajouter le spot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Instructions */}
      {!showForm && (
        <div className="map-instructions">
          💡 Cliquez sur la carte pour ajouter un spot
        </div>
      )}
    </div>
  );
});

Map.displayName = "Map";

export default Map;
