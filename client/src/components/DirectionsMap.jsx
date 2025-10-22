import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default icon issue with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

export default function DirectionsMap({ startCoords, endCoords, routeGeometry, hospitalName }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (!mapRef.current || !startCoords || !endCoords) return;

    // Initialize map only once
    if (!mapInstanceRef.current) {
      // Create map instance
      mapInstanceRef.current = L.map(mapRef.current).setView([
        (startCoords.lat + endCoords.lat) / 2,
        (startCoords.lng + endCoords.lng) / 2
      ], 13);

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(mapInstanceRef.current);

      setMapReady(true);
    }

    return () => {
      // Cleanup map instance when component unmounts
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        setMapReady(false);
      }
    };
  }, [startCoords, endCoords]);

  useEffect(() => {
    if (!mapInstanceRef.current || !mapReady) return;

    // Clear existing layers
    mapInstanceRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        mapInstanceRef.current.removeLayer(layer);
      }
    });

    // Create custom icons
    const startIcon = L.divIcon({
      html: '<div style="background-color: #10b981; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">S</div>',
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      className: 'custom-marker'
    });

    const endIcon = L.divIcon({
      html: '<div style="background-color: #ef4444; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">H</div>',
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      className: 'custom-marker'
    });

    // Add markers
    const startMarker = L.marker([startCoords.lat, startCoords.lng], { icon: startIcon })
      .addTo(mapInstanceRef.current)
      .bindPopup('<strong>Start Point</strong>');

    const endMarker = L.marker([endCoords.lat, endCoords.lng], { icon: endIcon })
      .addTo(mapInstanceRef.current)
      .bindPopup(`<strong>${hospitalName || 'Destination'}</strong>`);

    // Add route polyline if available
    if (routeGeometry && routeGeometry.length > 0) {
      const routeCoordinates = routeGeometry.map(coord => [coord[1], coord[0]]); // Convert [lng, lat] to [lat, lng]
      
      L.polyline(routeCoordinates, {
        color: '#3b82f6',
        weight: 4,
        opacity: 0.8,
        smoothFactor: 1
      }).addTo(mapInstanceRef.current);

      // Fit map to show the entire route
      const bounds = L.latLngBounds(routeCoordinates);
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
    } else {
      // If no route geometry, create a straight line and fit to both markers
      const bounds = L.latLngBounds([
        [startCoords.lat, startCoords.lng],
        [endCoords.lat, endCoords.lng]
      ]);
      
      // Draw straight line as fallback
      L.polyline([
        [startCoords.lat, startCoords.lng],
        [endCoords.lat, endCoords.lng]
      ], {
        color: '#3b82f6',
        weight: 4,
        opacity: 0.8,
        dashArray: '10, 10'
      }).addTo(mapInstanceRef.current);

      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
    }

    // Open popup for the destination marker
    endMarker.openPopup();

  }, [startCoords, endCoords, routeGeometry, hospitalName, mapReady]);

  return (
    <div className="relative">
      <div 
        ref={mapRef} 
        className="w-full h-96 rounded-lg border border-gray-200"
        style={{ minHeight: '400px' }}
      />
      <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded-lg p-2 text-xs text-gray-600 shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span>Start</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span>Hospital</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <div className="w-8 h-0.5 bg-blue-500"></div>
          <span>Route</span>
        </div>
      </div>
    </div>
  );
}