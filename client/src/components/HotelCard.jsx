
import { useState } from 'react';

function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function HotelCard({ hotel, userLat, userLng }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAddingFavorite, setIsAddingFavorite] = useState(false);

  const distance = userLat && userLng 
    ? haversineDistance(userLat, userLng, hotel.lat, hotel.lng)
    : null;

  const getHotelType = (tags) => {
    const types = [];
    if (tags.tourism) types.push(tags.tourism);
    if (tags.amenity) types.push(tags.amenity);
    return types.length > 0 ? types : ['accommodation'];
  };

  const types = getHotelType(hotel.tags);

  const handleAddToFavorites = async () => {
    setIsAddingFavorite(true);
    try {
      const response = await fetch('http://localhost:5000/user/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          place: {
            name: hotel.name || 'Unnamed Hotel',
            latitude: hotel.lat,
            longitude: hotel.lng,
            tags: hotel.tags,
          }
        }),
      });

      if (response.status === 401) {
        alert('Please log in to add favorites');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to add favorite');
      }

      setIsFavorite(true);
      alert('Added to favorites!');
    } catch (error) {
      console.error('Error adding favorite:', error);
      alert('Failed to add favorite. Please try again.');
    } finally {
      setIsAddingFavorite(false);
    }
  };

  const getDirectionsUrl = () => {
    if (!userLat || !userLng) return null;
    return `https://router.project-osrm.org/?z=13&loc=${userLat},${userLng}&loc=${hotel.lat},${hotel.lng}`;
  };

  const directionsUrl = getDirectionsUrl();

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="w-full h-48 bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
        <svg 
          className="w-16 h-16 text-purple-600" 
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

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {hotel.name || 'Unnamed Hotel'}
        </h3>

        <div className="flex flex-wrap gap-2 mb-3">
          {types.map((type, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full"
            >
              {type.replace('_', ' ')}
            </span>
          ))}
        </div>

        {distance !== null && (
          <p className="text-sm text-gray-600 mb-3">
            <span className="font-medium">Distance:</span>{' '}
            {distance < 1 
              ? `${(distance * 1000).toFixed(0)}m` 
              : `${distance.toFixed(2)}km`}
          </p>
        )}

        {hotel.tags.stars && (
          <p className="text-sm text-gray-600 mb-2">
            <span className="font-medium">Rating:</span> {hotel.tags.stars} stars
          </p>
        )}

        {hotel.tags.phone && (
          <p className="text-sm text-gray-600 mb-2">
            <span className="font-medium">Phone:</span> {hotel.tags.phone}
          </p>
        )}

        {hotel.tags.website && (
          <p className="text-sm text-gray-600 mb-3">
            <a 
              href={hotel.tags.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Visit Website
            </a>
          </p>
        )}

        <div className="flex gap-2">
          {directionsUrl && (
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
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
              Directions
            </a>
          )}
          
          <button
            onClick={handleAddToFavorites}
            disabled={isFavorite || isAddingFavorite}
            className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm ${
              isFavorite 
                ? 'bg-green-100 text-green-800 cursor-not-allowed' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            <svg 
              className="w-4 h-4" 
              fill={isFavorite ? "currentColor" : "none"}
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
              />
            </svg>
            {isFavorite ? 'Favorited' : isAddingFavorite ? 'Adding...' : 'Favorite'}
          </button>
        </div>
      </div>
    </div>
  );
}
