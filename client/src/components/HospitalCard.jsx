
/**
 * Calculate Haversine distance between two coordinates
 * Returns distance in kilometers
 */
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function HospitalCard({ hospital, userLat, userLng }) {
  const distance = userLat && userLng 
    ? haversineDistance(userLat, userLng, hospital.lat, hospital.lng)
    : null;

  // Extract hospital type from tags
  const getHospitalType = (tags) => {
    const types = [];
    if (tags.amenity) types.push(tags.amenity);
    if (tags.healthcare) types.push(tags.healthcare);
    if (tags.emergency) types.push('emergency');
    return types.length > 0 ? types : ['medical facility'];
  };

  const types = getHospitalType(hospital.tags);

  // Generate OSRM directions link
  const getDirectionsUrl = () => {
    if (!userLat || !userLng) return null;
    return `https://router.project-osrm.org/?z=13&loc=${userLat},${userLng}&loc=${hospital.lat},${hospital.lng}`;
  };

  const directionsUrl = getDirectionsUrl();

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Placeholder Image */}
      <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
        <svg 
          className="w-16 h-16 text-blue-600" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
          />
        </svg>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {hospital.name}
        </h3>

        {/* Type Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          {types.map((type, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
            >
              {type.replace('_', ' ')}
            </span>
          ))}
        </div>

        {/* Distance */}
        {distance !== null && (
          <p className="text-sm text-gray-600 mb-3">
            <span className="font-medium">Distance:</span>{' '}
            {distance < 1 
              ? `${(distance * 1000).toFixed(0)}m` 
              : `${distance.toFixed(2)}km`}
          </p>
        )}

        {/* Additional Info */}
        {hospital.tags.phone && (
          <p className="text-sm text-gray-600 mb-2">
            <span className="font-medium">Phone:</span> {hospital.tags.phone}
          </p>
        )}

        {hospital.tags.opening_hours && (
          <p className="text-sm text-gray-600 mb-3">
            <span className="font-medium">Hours:</span> {hospital.tags.opening_hours}
          </p>
        )}

        {/* Directions Link */}
        {directionsUrl && (
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" 
              />
            </svg>
            Get Directions
          </a>
        )}
      </div>
    </div>
  );
}
