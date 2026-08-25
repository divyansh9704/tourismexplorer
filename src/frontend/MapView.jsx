import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet marker icons in React bundling
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const userIconHtml = `
  <div class="animate-bounce" style="filter: drop-shadow(0 4px 6px rgba(79, 70, 229, 0.4));">
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="pinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#a855f7" /> <!-- Purple 500 -->
          <stop offset="100%" stop-color="#4f46e5" /> <!-- Indigo 600 -->
        </linearGradient>
      </defs>
      <path d="M12 21.5C16 17 19 12.5 19 9C19 5.13401 15.866 2 12 2C8.13401 2 5 5.13401 5 9C5 12.5 8 17 12 21.5Z" fill="url(#pinGrad)" stroke="#ffffff" stroke-width="1.5" />
      <circle cx="12" cy="9" r="3" fill="#ffffff" />
    </svg>
  </div>
`;

const userIcon = new L.DivIcon({
  html: userIconHtml,
  className: 'bg-transparent border-none',
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36]
});

const getHoverIcon = () => new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function MapEventHandler({ onMapMove }) {
  const map = useMapEvents({
    dragend: () => {
      if (onMapMove) {
        const center = map.getCenter();
        onMapMove({ lat: center.lat, lon: center.lng });
      }
    }
  });
  return null;
}

export default function MapView({ places, center, hoveredPlaceId, isUsingGPS, onMapMove }) {
  const mapCenter = center?.[0] && center?.[1] ? center : [40.7128, -74.0060];
  const markerRefs = useRef({});

  useEffect(() => {
    if (hoveredPlaceId && markerRefs.current[hoveredPlaceId]) {
      const marker = markerRefs.current[hoveredPlaceId];
      if (marker && !marker.isPopupOpen()) {
        marker.openPopup();
      }
    }
  }, [hoveredPlaceId]);

  return (
    <MapContainer
      center={mapCenter}
      zoom={13}
      scrollWheelZoom={false}
      className="w-full h-full min-h-[400px] z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {onMapMove && <MapEventHandler onMapMove={onMapMove} />}

      {/* Exciting User Location Marker (Only if Using GPS) */}
      {isUsingGPS && (
        <Marker position={mapCenter} icon={userIcon}>
          <Popup>
            <div className="font-sans text-xs text-center p-1">
              <strong className="text-pink-600 text-base block mb-1">You Are Here! 🌟</strong>
              <p className="text-slate-500 m-0">This is your active location.</p>
            </div>
          </Popup>
        </Marker>
      )}
      
      {places.map((place, idx) => {
        const props = place.properties || {};
        const coords = place.geometry?.coordinates || [props.lon, props.lat];
        const lat = coords[1];
        const lon = coords[0];
        const id = props.place_id || idx;

        if (!lat || !lon) return null;

        const isHovered = id === hoveredPlaceId;

        return (
          <Marker 
            key={id} 
            position={[lat, lon]}
            icon={isHovered ? getHoverIcon() : new L.Icon.Default()}
            ref={(ref) => {
              if (ref) markerRefs.current[id] = ref;
            }}
          >
            <Popup>
              <div className="font-sans text-xs">
                <strong className="text-slate-800 text-sm block mb-1">{props.name}</strong>
                <p className="text-slate-500 m-0">{props.formatted}</p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
