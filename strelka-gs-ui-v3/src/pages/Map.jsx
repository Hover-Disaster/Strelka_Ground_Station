import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useMap } from "react-leaflet/hooks";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useSystemState } from "../hooks/systemState";

export const ChangeView = ({ center }) => {
  const map = useMap();
  map.flyTo(center, map.getZoom());
  return null;
};

export const createIcon = (url) => {
  return new L.Icon({
    iconUrl: url,
    iconAnchor: [30, 70],
  });
};

const MapLeaflet = ({ center, zoom, region, position }) => {
  const { systemState, updateSystemState } = useSystemState();
  let marker_lat =
    systemState.gps1_latitude !== null ? systemState.gps1_latitude : 0;
  let marker_lng =
    systemState.gps1_longitude !== null ? systemState.gps1_longitude : 0;

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={true}
      className="h-[calc(80vh)] z-30"
    >
      <ChangeView center={center} zoom={zoom} />
      <TileLayer
        attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      />
      <Marker
        position={[marker_lat, marker_lng]}
        icon={createIcon("/images/icon-location.png")}
      >
        <Popup>Rocket {region}</Popup>
      </Marker>
    </MapContainer>
  );
};

// Map Pages
export default function Map() {
  return (
    <main id="map">
      <MapLeaflet
        center={[-36.482564, 144.0161759]}
        position={[-36.482564, 144.0161759]}
        zoom={15}
        region={"Serpentine"}
      />
    </main>
  );
}
