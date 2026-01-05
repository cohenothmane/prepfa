import React, { useEffect, useMemo, useRef, useState, useImperativeHandle } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Circle, Tooltip } from "react-leaflet";
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

const createCategoryIcon = (category, label) => {
  const colors = {
    "café": "#8B4513",
    "pâtisserie": "#FFB6C1",
    "restaurant": "#FF6347",
    "bar": "#9370DB",
    "pizzeria": "#FFD700",
    "glacier": "#87CEEB",
  };

  const iconEmojis = {
    "café": "☕",
    "pâtisserie": "🧁",
    "restaurant": "🍽️",
    "bar": "🍸",
    "pizzeria": "🍕",
    "glacier": "🍦",
  };

  const color = colors[category] || "#666";
  const emoji = iconEmojis[category] || "📍";
  const shortLabel = label && label.length > 15 ? `${label.substring(0, 12)}...` : (label || category || "Spot");

  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        background-color: ${color};
        border: 2px solid white;
        border-radius: 8px;
        padding: 4px 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        color: white;
        font-size: 14px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        cursor: pointer;
        white-space: nowrap;
        font-weight: bold;
        font-family: Arial, sans-serif;
      ">
        <span style="font-size: 16px;">${emoji}</span>
        <span style="font-size: 11px; max-width: 60px; overflow: hidden; text-overflow: ellipsis;">${shortLabel}</span>
      </div>
    `,
    iconSize: [120, 28],
    iconAnchor: [60, 28],
    popupAnchor: [0, -28],
  });
};

const MapClickHandler = ({ onMapClick, isMarkingMode }) => {
  useMapEvents({
    click: (e) => {
      if (isMarkingMode) onMapClick(e.latlng);
    },
  });
  return null;
};

const MAP_CATEGORIES = [
  { value: "café", label: "☕ Café" },
  { value: "restaurant", label: "🍽️ Restaurant" },
  { value: "pâtisserie", label: "🧁 Pâtisserie" },
  { value: "bar", label: "🍸 Bar" },
  { value: "pizzeria", label: "🍕 Pizzeria" },
  { value: "glacier", label: "🍦 Glacier" },
];

const Map = React.forwardRef(({
  filteredSpots = [],
  isMarkingMode: externalMarkingMode = false,
  allSpots = [],
  searchQuery = "",
  filters = {},
}, ref) => {
  const [userPosition, setUserPosition] = useState(null);
  const [geoError, setGeoError] = useState(null);
  const [geoStatus, setGeoStatus] = useState("pending");
  const [spots, setSpots] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [formData, setFormData] = useState({ nom: "", description: "", category: MAP_CATEGORIES[0]?.value || "café", location: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [isMarkingMode, setIsMarkingMode] = useState(externalMarkingMode);
  const mapRef = useRef(null);
  const markersRef = useRef({});

  useImperativeHandle(ref, () => ({
    enableMarkingMode: () => setIsMarkingMode(true),
    disableMarkingMode: () => setIsMarkingMode(false),
  }));

  useEffect(() => {
    setIsMarkingMode(externalMarkingMode);
  }, [externalMarkingMode]);

  const getSpotId = (spot) => spot?.id || spot?._id || `${spot?.lat}-${spot?.lng}`;

  const resolvedSpots = useMemo(() => {
    if (filteredSpots && filteredSpots.length > 0) return filteredSpots;
    if (allSpots && allSpots.length > 0) return allSpots;
    return spots;
  }, [filteredSpots, allSpots, spots]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoError("La géolocalisation n'est pas supportée par ce navigateur.");
      setGeoStatus("error");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGeoStatus("ok");
      },
      (err) => {
        let errorMsg = "Impossible de récupérer la position.";
        if (err.code === 1) errorMsg = "Veuillez autoriser la géolocalisation pour centrer la carte sur vous.";
        else if (err.code === 2) errorMsg = "Position non disponible. Vérifiez votre connexion réseau.";
        else if (err.code === 3) errorMsg = "Délai d'attente dépassé. Veuillez réessayer.";
        setGeoError(errorMsg);
        setGeoStatus("error");
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 300000 }
    );
  }, []);

  const fetchSpots = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = token 
        ? { "Authorization": `Bearer ${token}` }
        : {};
        
      const response = await fetch("http://localhost:4000/api/spots", { headers });
      const data = await response.json();
      if (response.ok && Array.isArray(data?.data)) {
        setSpots(data.data);
      } else if (response.ok && Array.isArray(data)) {
        setSpots(data);
      } else {
        console.error("Échec du chargement des spots:", response.status, response.statusText);
      }
    } catch (err) {
      console.error("Erreur lors du chargement des spots:", err);
    }
  };

  useEffect(() => {
    fetchSpots();
  }, []);

  useEffect(() => {
    const handleCenterMap = (event) => {
      const { lat, lng } = event.detail || {};
      if (lat === undefined || lng === undefined) return;
      if (mapRef.current) {
        mapRef.current.setView([lat, lng], 14);
      }
    };

    window.addEventListener("centerMap", handleCenterMap);
    return () => window.removeEventListener("centerMap", handleCenterMap);
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setSelectedSpot(null);
      return;
    }

    const query = searchQuery.toLowerCase();
    const matchedSpots = resolvedSpots.filter((spot) => {
      const name = (spot?.nom || spot?.name || "").toLowerCase();
      const desc = (spot?.description || "").toLowerCase();
      const category = (spot?.category || "").toLowerCase();
      const location = (spot?.location || "").toLowerCase();
      return name.includes(query) || desc.includes(query) || category.includes(query) || location.includes(query);
    });

    if (matchedSpots.length === 0) {
      setSelectedSpot(null);
      return;
    }

    let spotToShow = matchedSpots[0];
    if (userPosition && matchedSpots.length > 1) {
      spotToShow = matchedSpots.reduce((closest, spot) => {
        const distToClosest = Math.pow((closest?.lat || 0) - userPosition.lat, 2) + Math.pow((closest?.lng || 0) - userPosition.lng, 2);
        const distToSpot = Math.pow((spot?.lat || 0) - userPosition.lat, 2) + Math.pow((spot?.lng || 0) - userPosition.lng, 2);
        return distToSpot < distToClosest ? spot : closest;
      });
    }

    setSelectedSpot(spotToShow);
    if (mapRef.current && spotToShow?.lat !== undefined && spotToShow?.lng !== undefined) {
      mapRef.current.setView([spotToShow.lat, spotToShow.lng], 14);
      const markerId = getSpotId(spotToShow);
      setTimeout(() => {
        if (markerId && markersRef.current[markerId]) {
          markersRef.current[markerId].openPopup();
        }
      }, 400);
    }
  }, [searchQuery, resolvedSpots, userPosition]);

  const handleMapClick = (latlng) => {
    setSelectedLocation({ lat: latlng.lat, lng: latlng.lng });
    setShowForm(true);
    setError(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSpot = async (e) => {
    e.preventDefault();

    if (!selectedLocation) {
      setError("Cliquez sur la carte pour sélectionner l'emplacement.");
      return;
    }
    if (!formData.nom.trim()) {
      setError("Le nom du spot est requis");
      return;
    }
    if (!formData.location.trim()) {
      setError("La localisation est requise");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Vous devez être connecté pour ajouter un spot");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:4000/api/spots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nom: formData.nom.trim(),
          description: formData.description.trim(),
          category: formData.category,
          location: formData.location.trim(),
          lat: selectedLocation.lat,
          lng: selectedLocation.lng,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        const createdSpot = data?.data || data?.spot || data;
        setSpots((prev) => [...prev, createdSpot]);
        setFormData({ nom: "", description: "", category: MAP_CATEGORIES[0]?.value || "café", location: "" });
        setSelectedLocation(null);
        setShowForm(false);
        setError(null);
        setIsMarkingMode(false);
        window.dispatchEvent(new Event("spotCreated"));
      } else {
        setError(data?.message || data?.error || "Erreur lors de l'ajout du spot");
      }
    } catch (err) {
      setError(`Erreur: ${err.message || "Impossible de contacter le serveur"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedLocation(null);
    setFormData({ nom: "", description: "", category: MAP_CATEGORIES[0]?.value || "café", location: "" });
    setError(null);
    setIsMarkingMode(false);
  };

  const handleDeleteSpot = async (spotId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce spot ?")) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vous devez être connecté");
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/api/spots/${spotId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setSpots((prev) => prev.filter((spot) => getSpotId(spot) !== spotId));
      }
    } catch (err) {
      console.error("Erreur lors de la suppression du spot:", err);
    }
  };

  const center = userPosition ? [userPosition.lat, userPosition.lng] : [31.7917, -7.0926];

  return (
    <div className="map-screen">
      <MapContainer
        ref={mapRef}
        center={center}
        zoom={6}
        minZoom={2}
        worldCopyJump
        scrollWheelZoom
        className="map-canvas"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapClickHandler onMapClick={handleMapClick} isMarkingMode={isMarkingMode} />

        {userPosition && (
          <>
            <Marker position={[userPosition.lat, userPosition.lng]}>
              <Popup>Votre position actuelle</Popup>
            </Marker>
            {filters && filters.radiusEnabled !== false && typeof filters.radius === "number" && (
              <Circle
                center={[userPosition.lat, userPosition.lng]}
                radius={filters.radius * 1000}
                pathOptions={{ color: "#2b7cff", fillOpacity: 0.08 }}
              />
            )}
          </>
        )}

        {resolvedSpots.map((spot) => {
          const markerId = getSpotId(spot);
          const label = spot?.nom || spot?.name || spot?.location || spot?.category || "Spot";
          if (spot?.lat === undefined || spot?.lng === undefined) return null;

          return (
            <Marker
              key={markerId}
              position={[spot.lat, spot.lng]}
              icon={createCategoryIcon(spot.category, label)}
              ref={(el) => {
                if (el && markerId) markersRef.current[markerId] = el;
              }}
            >
              <Popup>
                <div className="spot-popup">
                  <h3>{label}</h3>
                  {spot?.createdByName && <p className="spot-creator">👤 {spot.createdByName}</p>}
                  {spot?.description && <p>{spot.description}</p>}
                  <p><strong>Catégorie:</strong> {spot?.category || "N/A"}</p>
                  <p><strong>Localisation:</strong> {spot?.location || "Non renseignée"}</p>
                  <button onClick={() => handleDeleteSpot(markerId)} className="delete-spot-btn">
                    Supprimer
                  </button>
                </div>
              </Popup>
              <Tooltip permanent={false} direction="top">
                {label}
              </Tooltip>
            </Marker>
          );
        })}
      </MapContainer>

      <div className="zoom-controls">
        <button
          className="zoom-btn zoom-in"
          onClick={() => mapRef.current?.zoomIn()}
          title="Zoom in"
        >
          +
        </button>
        <button
          className="zoom-btn zoom-out"
          onClick={() => mapRef.current?.zoomOut()}
          title="Zoom out"
        >
          −
        </button>
      </div>

      {geoError && <div className="map-geo-error">{geoError}</div>}

      {!geoError && geoStatus === "pending" && (
        <div className="map-geo-info">Autorisez la géolocalisation pour centrer la carte sur vous.</div>
      )}

      {searchQuery && selectedSpot && (
        <div className="search-result-found">✓ Spot trouvé: {selectedSpot?.nom || selectedSpot?.name || selectedSpot?.location}</div>
      )}

      {searchQuery && !selectedSpot && resolvedSpots.length > 0 && (
        <div className="search-result-not-found">✗ Aucun spot trouvé pour "{searchQuery}"</div>
      )}

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
                 <label htmlFor="category">Catégorie *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleFormChange}
                  className="category-select"
                  disabled={isLoading}
                >
                  {MAP_CATEGORIES.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="nom">Nom du spot *</label>
                <input
                  type="text"
                  id="nom"
                  name="nom"
                  value={formData.nom}
                  onChange={handleFormChange}
                  placeholder="Nom du spot"
                  disabled={isLoading}
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label htmlFor="location">Localisation *</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleFormChange}
                  placeholder="Ville ou quartier"
                  disabled={isLoading}
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
                <button type="button" onClick={handleCloseForm} className="btn-cancel" disabled={isLoading}>
                  Annuler
                </button>
                <button type="submit" className="btn-submit" disabled={isLoading}>
                  {isLoading ? "Ajout en cours..." : "Ajouter le spot"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {!showForm && isMarkingMode && (
        <div className="map-instructions">
          💡 Cliquez sur la carte pour ajouter un spot
          <button className="cancel-marking" onClick={() => setIsMarkingMode(false)} aria-label="Annuler">
            Annuler
          </button>
        </div>
      )}
    </div>
  );
});

Map.displayName = "Map";

export default Map;
