
import React, { useState } from 'react';
import DirectionsModal from './DirectionsModal';

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
  const [isDirectionsOpen, setIsDirectionsOpen] = useState(false);
  
  const distance = userLat && userLng 
    ? haversineDistance(userLat, userLng, hospital.lat, hospital.lng)
    : null;

  const userLocation = userLat && userLng ? { lat: userLat, lng: userLng } : null;

  // Extract hospital type from tags
  const getHospitalType = (tags) => {
    const types = [];
    if (tags.amenity) types.push(tags.amenity);
    if (tags.healthcare) types.push(tags.healthcare);
    if (tags.emergency) types.push('emergency');
    return types.length > 0 ? types : ['medical facility'];
  };

  const types = getHospitalType(hospital.tags);

  const handleGetDirections = () => {
    setIsDirectionsOpen(true);
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        {/* Hospital Image */}
        <div className="w-full h-48 relative">
          <img 
            src={hospital.image || 'https://source.unsplash.com/400x300/?hospital,medical'}
            alt={`${hospital.name} - Medical Facility`}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to default image if the main image fails to load
              e.target.src = 'https://source.unsplash.com/400x300/?hospital,medical';
            }}
          />
          <div className="absolute top-2 right-2">
            <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
              <svg 
                className="w-4 h-4 text-red-600" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path 
                  fillRule="evenodd" 
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" 
                  clipRule="evenodd" 
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900 flex-1">
              {hospital.name}
            </h3>
            {distance !== null && (
              <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full ml-2">
                {distance < 1 
                  ? `${(distance * 1000).toFixed(0)}m` 
                  : `${distance.toFixed(2)}km`}
              </span>
            )}
          </div>

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

          {/* Additional Info */}
          {hospital.tags.phone && (
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>{hospital.tags.phone}</span>
            </div>
          )}

          {hospital.tags.opening_hours && (
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{hospital.tags.opening_hours}</span>
            </div>
          )}

          {/* Directions Button */}
          <button
            onClick={handleGetDirections}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium w-full justify-center"
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
          </button>
        </div>
      </div>

      {/* Directions Modal */}
      <DirectionsModal
        isOpen={isDirectionsOpen}
        onClose={() => setIsDirectionsOpen(false)}
        hospital={hospital}
        userLocation={userLocation}
      />
    </>
  );
}
