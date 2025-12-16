import React from "react";
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

const FES_COORDS = [34.0181, -5.0078];

const Map = () => {
  return (
    <div className="map-screen">
      <MapContainer
        center={FES_COORDS}
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

        <Marker position={FES_COORDS}>
          <Popup>
            Fès, Maroc <br />
            Centre initial de la carte.
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default Map;
