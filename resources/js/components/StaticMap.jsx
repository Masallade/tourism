import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon issue
if (typeof window !== 'undefined') {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  });
}

const StaticMap = ({ lat, lng, height = 180, zoom = 13 }) => {
  if (!lat || !lng || isNaN(parseFloat(lat)) || isNaN(parseFloat(lng))) {
    return <div className="w-full bg-gray-100 text-gray-400 flex items-center justify-center" style={{ height }}>No location</div>;
  }
  const position = [parseFloat(lat), parseFloat(lng)];
  return (
    <div className="w-full rounded-md overflow-hidden border border-blue-200 mb-2" style={{ height }}>
      <MapContainer
        center={position}
        zoom={zoom}
        scrollWheelZoom={true}
        dragging={true}
        doubleClickZoom={true}
        zoomControl={true}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
        attributionControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <Marker position={position} />
      </MapContainer>
    </div>
  );
};

export default StaticMap;
