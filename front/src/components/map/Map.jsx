import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
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

const Map = () => {
  const [userPosition, setUserPosition] = useState(null);
  const [geoError, setGeoError] = useState(null);
  const [geoStatus, setGeoStatus] = useState("pending"); // pending | ok | error

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
      }
      ,
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  }, []);

  // Centre par défaut global si pas de position utilisateur
  const center = userPosition ? [userPosition.lat, userPosition.lng] : [20, 0];

  return (
    <div className="map-screen">
      <MapContainer
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

        {userPosition && (
          <Marker position={[userPosition.lat, userPosition.lng]}>
            <Popup>Votre position actuelle</Popup>
          </Marker>
        )}
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
    </div>
  );
};

export default Map;
