
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Create custom marker icons
const createCustomIcon = (color = 'blue') => {
  const iconColors = {
    green: '#22c55e',
    red: '#dc2626', 
    blue: '#3b82f6',
    yellow: '#eab308'
  };
  
  // Use a simpler approach with emoji markers for reliability
  const iconEmojis = {
    green: '🟢',
    red: '🔴', 
    blue: '🔵',
    yellow: '🟡'
  };
  
  return L.divIcon({
    html: `
      <div style="
        background-color: ${iconColors[color] || iconColors.blue};
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        font-weight: bold;
        color: white;
        z-index: 1000;
      ">
        ${color === 'start' ? 'S' : color === 'end' ? 'E' : iconEmojis[color] || '📍'}
      </div>
    `,
    className: 'custom-marker',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
    shadowSize: [30, 30]
  });
};

export default function MapView({ 
  center = [51.505, -0.09], 
  zoom = 13, 
  markers = [], 
  route = null,
  crimeData = [],
  height = '500px' 
}) {
  console.log('MapView props:', { center, zoom, markersCount: markers.length, route, crimeDataCount: crimeData.length });
  
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const routeLayerRef = useRef(null);
  const crimeLayerRef = useRef(null);

  useEffect(() => {
    // Initialize map only once
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView(center, zoom);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);

      markersLayerRef.current = L.layerGroup().addTo(mapInstanceRef.current);
      routeLayerRef.current = L.layerGroup().addTo(mapInstanceRef.current);
      crimeLayerRef.current = L.layerGroup().addTo(mapInstanceRef.current);
    }

    return () => {
      // Cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update map center and zoom
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(center, zoom);
    }
  }, [center, zoom]);

  // Update markers
  useEffect(() => {
    if (markersLayerRef.current && mapInstanceRef.current) {
      markersLayerRef.current.clearLayers();
      console.log('Rendering markers:', markers);

      if (markers.length === 0) {
        console.log('No markers to render');
        return;
      }

      markers.forEach((marker, index) => {
        console.log(`Creating marker ${index}:`, marker);
        
        // Create custom icons based on marker type
        let iconColor = 'blue';
        
        if (marker.type === 'start') {
          iconColor = 'start';
        } else if (marker.type === 'end') {
          iconColor = 'end';
        } else if (marker.type === 'waypoint') {
          iconColor = 'yellow';
        }
        
        const customIcon = createCustomIcon(iconColor);
        const leafletMarker = L.marker([marker.lat, marker.lng], { icon: customIcon });
        
        if (marker.label) {
          const popupContent = `
            <div style="text-align: center; font-family: Arial, sans-serif;">
              <strong style="color: #333; font-size: 14px;">${marker.label}</strong>
              ${marker.type ? `<br><span style="color: #666; font-size: 12px; text-transform: capitalize;">${marker.type}</span>` : ''}
            </div>
          `;
          leafletMarker.bindPopup(popupContent);
        }
        
        // Add tooltip for better UX
        if (marker.label) {
          leafletMarker.bindTooltip(marker.label, {
            permanent: false,
            direction: 'top',
            offset: [0, -10],
            className: 'custom-tooltip'
          });
        }

        leafletMarker.addTo(markersLayerRef.current);
        console.log(`Marker ${index} added to map`);
      });

      // Auto-fit bounds if multiple markers
      if (markers.length > 1) {
        const bounds = L.latLngBounds(markers.map(m => [m.lat, m.lng]));
        mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
        console.log('Map fitted to marker bounds');
      }
    }
  }, [markers]);

  // Update route
  useEffect(() => {
    if (routeLayerRef.current) {
      routeLayerRef.current.clearLayers();

      if (route) {
        console.log('Rendering route:', route);
        let coordinates = route.coordinates || route.geometry || route;
        
        if (Array.isArray(coordinates) && coordinates.length > 0) {
          console.log(`Route coordinates count: ${coordinates.length}`);
          
          // Handle both GeoJSON format [lng, lat] and standard [lat, lng]
          const latlngs = coordinates.map(coord => {
            return Array.isArray(coord) && coord.length === 2
              ? [coord[1], coord[0]] // GeoJSON [lng, lat] -> Leaflet [lat, lng]
              : coord;
          });

          // Ensure we have valid coordinates
          const validLatlngs = latlngs.filter(coord => 
            Array.isArray(coord) && 
            coord.length === 2 && 
            typeof coord[0] === 'number' && 
            typeof coord[1] === 'number' &&
            !isNaN(coord[0]) && 
            !isNaN(coord[1])
          );

          console.log(`Valid coordinates count: ${validLatlngs.length}`);

          if (validLatlngs.length > 1) {
            const polyline = L.polyline(validLatlngs, {
              color: route.color || '#3b82f6',
              weight: route.weight || 4,
              opacity: route.opacity || 0.8,
              smoothFactor: 1
            }).addTo(routeLayerRef.current);
            
            console.log('Route polyline added to map');
            
            // Auto-fit bounds to show entire route
            if (mapInstanceRef.current && validLatlngs.length > 1) {
              const bounds = L.latLngBounds(validLatlngs);
              mapInstanceRef.current.fitBounds(bounds, { 
                padding: [50, 50],
                maxZoom: 16
              });
              console.log('Map fitted to route bounds');
            }
          } else {
            console.warn('Route coordinates are invalid:', coordinates);
          }
        } else {
          console.warn('Route data is invalid:', route);
        }
      } else {
        console.log('No route data to render');
      }
    }
  }, [route]);

  // Update crime data visualization
  useEffect(() => {
    if (crimeLayerRef.current) {
      crimeLayerRef.current.clearLayers();

      if (crimeData && crimeData.length > 0) {
        crimeData.forEach((crimePoint, index) => {
          const { lat, lng, crimeScore, label } = crimePoint;
          
          if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
            // Determine color based on crime score
            let color = '#22c55e'; // green for low crime
            let fillColor = '#22c55e';
            let radius = 150;
            let riskLevel = 'Low Risk';
            
            if (crimeScore >= 70) {
              color = '#dc2626'; // red for high crime
              fillColor = '#dc2626';
              radius = 250;
              riskLevel = 'High Risk';
            } else if (crimeScore >= 40) {
              color = '#f59e0b'; // amber for medium crime
              fillColor = '#f59e0b';
              radius = 200;
              riskLevel = 'Medium Risk';
            }
            
            // Create circle for crime visualization
            const circle = L.circle([lat, lng], {
              color: color,
              fillColor: fillColor,
              fillOpacity: 0.15,
              radius: radius,
              weight: 2,
              className: 'crime-circle'
            });
            
            // Add popup with crime information
            const popupContent = `
              <div style="
                text-align: center; 
                font-family: Arial, sans-serif; 
                min-width: 150px;
                padding: 8px;
              ">
                <div style="
                  background-color: ${color};
                  color: white;
                  padding: 4px 8px;
                  border-radius: 4px;
                  margin-bottom: 8px;
                  font-weight: bold;
                  font-size: 12px;
                ">
                  ${riskLevel}
                </div>
                <div style="font-size: 14px; font-weight: bold; color: #333; margin-bottom: 4px;">
                  ${label || `Crime Point ${index + 1}`}
                </div>
                <div style="font-size: 12px; color: #666; margin-bottom: 4px;">
                  Crime Score: <strong>${crimeScore || 'N/A'}/100</strong>
                </div>
                <div style="
                  font-size: 10px; 
                  color: #888;
                  border-top: 1px solid #eee;
                  padding-top: 4px;
                  margin-top: 4px;
                ">
                  ${crimeScore >= 70 ? '⚠️ High crime area - exercise caution' : 
                    crimeScore >= 40 ? '⚡ Moderate crime area - stay alert' : 
                    '✅ Low crime area - relatively safe'}
                </div>
              </div>
            `;
            circle.bindPopup(popupContent);
            
            // Add tooltip
            circle.bindTooltip(`${riskLevel}: ${crimeScore}/100`, {
              permanent: false,
              direction: 'center',
              className: 'crime-tooltip'
            });
            
            circle.addTo(crimeLayerRef.current);
          }
        });
      }
    }
  }, [crimeData]);

  return (
    <div className="w-full rounded-lg overflow-hidden shadow-lg border border-gray-200">
      <div ref={mapRef} style={{ height, width: '100%' }} />
      {(crimeData && crimeData.length > 0) && (
        <div className="text-xs text-gray-600 p-3 bg-blue-50 border-t border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <strong>Crime Data Visualization:</strong> Circles show crime risk levels along the route
            </div>
            <div class="flex gap-4">
              <span class="flex items-center gap-1">
                <span class="w-3 h-3 bg-green-500 rounded-full"></span> Low Risk
              </span>
              <span class="flex items-center gap-1">
                <span class="w-3 h-3 bg-amber-500 rounded-full"></span> Medium Risk
              </span>
              <span class="flex items-center gap-1">
                <span class="w-3 h-3 bg-red-500 rounded-full"></span> High Risk
              </span>
            </div>
          </div>
        </div>
      )}
      {(!crimeData || crimeData.length === 0) && (
        <div className="text-xs text-gray-500 p-2 bg-gray-50">
          Note: Make sure to include Leaflet CSS in your HTML: 
          <code className="ml-1 bg-gray-200 px-1 rounded">
            &lt;link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" /&gt;
          </code>
        </div>
      )}
    </div>
  );
}
