import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from "react-leaflet";
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

// Catégories à exclure de l'affichage sur la map
const EXCLUDED_CATEGORIES = ['bar', 'glacier', 'pâtisserie'];

// Données UNIQUES - source de vérité - Maroc
export const allSpots = [
  { id: 1, category: 'café', location: 'Fès', lat: 34.0626, lng: -5.0063 },
  { id: 2, category: 'café', location: 'Fès', lat: 34.0639, lng: -5.0052 },
  { id: 3, category: 'café', location: 'Fès', lat: 34.0632, lng: -5.0065 },
  { id: 4, category: 'café', location: 'Fès', lat: 34.0645, lng: -5.0058 },
  { id: 5, category: 'café', location: 'Fès', lat: 34.0656, lng: -5.0072 },
  { id: 6, category: 'café', location: 'Fès', lat: 34.0620, lng: -5.0075 },
  { id: 7, category: 'café', location: 'Fès', lat: 34.0648, lng: -5.0048 },
  { id: 8, category: 'café', location: 'Fès', lat: 34.0633, lng: -5.0082 },
  { id: 9, category: 'café', location: 'Fès', lat: 34.0619, lng: -5.0059 },
  { id: 10, category: 'café', location: 'Fès', lat: 34.0644, lng: -5.0070 },
  { id: 11, category: 'café', location: 'Marrakech', lat: 31.6295, lng: -7.9811 },
  { id: 12, category: 'café', location: 'Marrakech', lat: 31.6263, lng: -7.9826 },
  { id: 13, category: 'café', location: 'Marrakech', lat: 31.6233, lng: -7.9809 },
  { id: 14, category: 'café', location: 'Marrakech', lat: 31.6282, lng: -7.9825 },
  { id: 15, category: 'café', location: 'Marrakech', lat: 31.6197, lng: -7.9724 },
  { id: 16, category: 'café', location: 'Casablanca', lat: 33.5731, lng: -7.5898 },
  { id: 17, category: 'café', location: 'Casablanca', lat: 33.5743, lng: -7.5921 },
  { id: 18, category: 'café', location: 'Casablanca', lat: 33.5783, lng: -7.6155 },
  { id: 19, category: 'café', location: 'Casablanca', lat: 33.5720, lng: -7.5875 },
  { id: 20, category: 'café', location: 'Casablanca', lat: 33.5750, lng: -7.5905 },
  { id: 21, category: 'restaurant', location: 'Fès', lat: 34.0605, lng: -5.0045 },
  { id: 22, category: 'restaurant', location: 'Fès', lat: 34.0618, lng: -5.0095 },
  { id: 23, category: 'restaurant', location: 'Fès', lat: 34.0640, lng: -5.0060 },
  { id: 24, category: 'restaurant', location: 'Fès', lat: 34.0611, lng: -5.0078 },
  { id: 25, category: 'restaurant', location: 'Marrakech', lat: 31.6255, lng: -7.9810 },
  { id: 26, category: 'restaurant', location: 'Marrakech', lat: 31.6275, lng: -7.9845 },
  { id: 27, category: 'restaurant', location: 'Marrakech', lat: 31.6350, lng: -7.9750 },
  { id: 28, category: 'restaurant', location: 'Casablanca', lat: 33.5814, lng: -7.6201 },
  { id: 29, category: 'restaurant', location: 'Casablanca', lat: 33.5760, lng: -7.5920 },
  { id: 30, category: 'pâtisserie', location: 'Fès', lat: 34.0652, lng: -5.0070 },
  { id: 31, category: 'pâtisserie', location: 'Fès', lat: 34.0628, lng: -5.0040 },
  { id: 32, category: 'pâtisserie', location: 'Fès', lat: 34.0615, lng: -5.0088 },
  { id: 33, category: 'pâtisserie', location: 'Marrakech', lat: 31.6300, lng: -7.9810 },
  { id: 34, category: 'pâtisserie', location: 'Marrakech', lat: 31.6360, lng: -7.9870 },
  { id: 35, category: 'pâtisserie', location: 'Casablanca', lat: 33.5745, lng: -7.5898 },
  { id: 36, category: 'pâtisserie', location: 'Casablanca', lat: 33.5790, lng: -7.6050 },
  { id: 37, category: 'bar', location: 'Fès', lat: 34.0660, lng: -5.0065 },
  { id: 38, category: 'bar', location: 'Fès', lat: 34.0635, lng: -5.0050 },
  { id: 39, category: 'bar', location: 'Marrakech', lat: 31.6330, lng: -7.9870 },
  { id: 40, category: 'bar', location: 'Marrakech', lat: 31.6250, lng: -7.9800 },
  { id: 41, category: 'bar', location: 'Casablanca', lat: 33.5800, lng: -7.6100 },
  { id: 42, category: 'bar', location: 'Casablanca', lat: 33.5850, lng: -7.5950 },
  { id: 43, category: 'pizzeria', location: 'Fès', lat: 34.0640, lng: -5.0075 },
  { id: 44, category: 'pizzeria', location: 'Marrakech', lat: 31.6320, lng: -7.9850 },
  { id: 45, category: 'pizzeria', location: 'Casablanca', lat: 33.5770, lng: -7.5900 },
  { id: 46, category: 'glacier', location: 'Fès', lat: 34.0625, lng: -5.0055 },
  { id: 47, category: 'glacier', location: 'Marrakech', lat: 31.6270, lng: -7.9820 },
  { id: 48, category: 'glacier', location: 'Casablanca', lat: 33.5820, lng: -7.6180 },
];

// Créer des icônes colorées avec la catégorie (les catégories exclues ne sont pas affichées)
const createCategoryIcon = (category) => {
  const colors = {
    café: '#8B4513',
    restaurant: '#FF6347',
    pizzeria: '#FFD700',
  };

  const iconEmojis = {
    café: '☕',
    restaurant: '🍽️',
    pizzeria: '🍕',
  };

  const color = colors[category] || '#666';
  const emoji = iconEmojis[category] || '📍';

  return L.divIcon({
    className: 'custom-marker',
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
        <span style="font-size: 11px;">${category}</span>
      </div>
    `,
    iconSize: [110, 28],
    iconAnchor: [55, 28],
    popupAnchor: [0, -28],
  });
};

// Composant pour gérer le zoom et afficher/cacher les marqueurs
const MapContent = ({ filteredSpots = [], spotsToDisplay, onMapReady, isMarkingMode }) => {
  const map = useMap();
  const [currentZoom, setCurrentZoom] = useState(6);

  useEffect(() => {
    const handleZoomChange = () => {
      setCurrentZoom(map.getZoom());
    };

    map.on('zoomend', handleZoomChange);
    return () => map.off('zoomend', handleZoomChange);
  }, [map]);

  // Handle map clicks in marking mode
  useEffect(() => {
    if (!isMarkingMode) return;

    const handleMapClick = (e) => {
      const { lat, lng } = e.latlng;
      // Emit custom event with coordinates
      window.dispatchEvent(
        new CustomEvent('mapPointSelected', {
          detail: { lat, lng }
        })
      );
    };

    map.on('click', handleMapClick);
    return () => map.off('click', handleMapClick);
  }, [map, isMarkingMode]);

  // Afficher les marqueurs SEULEMENT si zoom >= 10
  // Toujours afficher les marqueurs
  const shouldShowMarkers = true;

  return (
    <>
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Afficher les marqueurs */}
      {spotsToDisplay.map((spot) => (
        <Marker 
          key={spot.id} 
          position={[spot.lat, spot.lng]}
          icon={createCategoryIcon(spot.category)}
        >
          <Popup>
            <div className="popup-content">
              <p><strong>Catégorie:</strong> {spot.category}</p>
              <p><strong>Localisation:</strong> {spot.location}</p>
            </div>
          </Popup>
          <Tooltip permanent={false} direction="top">
            {spot.category} - {spot.location}
          </Tooltip>
        </Marker>
      ))}
      
    </>
  );
};

const Map = ({ filteredSpots = [], isMarkingMode = false, allSpots = [] }) => {
  const [userPosition, setUserPosition] = useState(null);
  const [geoError, setGeoError] = useState(null);
  const [center, setCenter] = useState([31.7917, -7.0926]);
  const [zoom, setZoom] = useState(6);
  const mapRef = useRef(null);

  // Afficher les spots depuis l'API si disponibles, sinon rien
  const spotsToDisplay = allSpots.length > 0 ? allSpots : [];
  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoError("La géolocalisation n'est pas supportée par ce navigateur.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setCenter([pos.coords.latitude, pos.coords.longitude]);
        setZoom(12);
        // géolocalisation OK
      },
      (err) => {
        setGeoError(err.message || "Impossible de récupérer la position.");
        // gérer l'erreur via setGeoError
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  }, []);

  // Écouter l'événement centerMap depuis la recherche
  useEffect(() => {
    const handleCenterMap = (event) => {
      const { lat, lng } = event.detail;
      setCenter([lat, lng]);
      setZoom(13);
    };

    window.addEventListener("centerMap", handleCenterMap);
    return () => window.removeEventListener("centerMap", handleCenterMap);
  }, []);

  return (
    <div className="map-screen">
      <MapContainer
        ref={mapRef}
        center={center}
        zoom={zoom}
        minZoom={2}
        maxZoom={18}
        worldCopyJump
        scrollWheelZoom
        className="map-canvas"
        key={`${center[0]}-${center[1]}-${zoom}`}
      >
        <MapContent 
          filteredSpots={filteredSpots}
          spotsToDisplay={spotsToDisplay}
          isMarkingMode={isMarkingMode}
        />
      </MapContainer>

      {geoError && (
        <div className="map-geo-error">
          {geoError}
        </div>
      )}

      {/* Légende toujours visible */}
      <div className="map-legend">
        <div className="legend-title">Catégories</div>
        <div className="legend-item"><span>☕</span> Café</div>
        <div className="legend-item"><span>🍽️</span> Restaurant</div>
        <div className="legend-item"><span>🍕</span> Pizzeria</div>
      </div>
    </div>
  );
};

export default Map;
