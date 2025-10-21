
const express = require('express');
const router = express.Router();

/**
 * Places API using Overpass API (OpenStreetMap data)
 * 
 * RATE LIMITS & USAGE:
 * - Overpass API has rate limits and may block heavy usage
 * - Implement caching for production use
 * - Consider running your own Overpass instance for high traffic
 * 
 * GET /places?lat=&lng=&type=
 * 
 * Query params:
 * - lat: latitude (required)
 * - lng: longitude (required)
 * - type: tourist|hotel|hospital (required)
 */

// Helper function to build Overpass QL query based on type
function buildOverpassQuery(lat, lng, type, radius = 2000) {
  let filter = '';
  
  switch (type) {
    case 'hospital':
      // Query for hospitals, clinics, and medical facilities
      filter = `
        (
          node["amenity"="hospital"](around:${radius},${lat},${lng});
          way["amenity"="hospital"](around:${radius},${lat},${lng});
          node["amenity"="clinic"](around:${radius},${lat},${lng});
          way["amenity"="clinic"](around:${radius},${lat},${lng});
          node["amenity"="doctors"](around:${radius},${lat},${lng});
          way["amenity"="doctors"](around:${radius},${lat},${lng});
          node["healthcare"](around:${radius},${lat},${lng});
          way["healthcare"](around:${radius},${lat},${lng});
        );
      `;
      break;
      
    case 'hotel':
      // Query for hotels, motels, guest houses, and hostels
      filter = `
        (
          node["tourism"="hotel"](around:${radius},${lat},${lng});
          way["tourism"="hotel"](around:${radius},${lat},${lng});
          node["tourism"="motel"](around:${radius},${lat},${lng});
          way["tourism"="motel"](around:${radius},${lat},${lng});
          node["tourism"="guest_house"](around:${radius},${lat},${lng});
          way["tourism"="guest_house"](around:${radius},${lat},${lng});
          node["tourism"="hostel"](around:${radius},${lat},${lng});
          way["tourism"="hostel"](around:${radius},${lat},${lng});
        );
      `;
      break;
      
    case 'tourist':
      // Query for tourist attractions, museums, viewpoints
      filter = `
        (
          node["tourism"="attraction"](around:${radius},${lat},${lng});
          way["tourism"="attraction"](around:${radius},${lat},${lng});
          node["tourism"="museum"](around:${radius},${lat},${lng});
          way["tourism"="museum"](around:${radius},${lat},${lng});
          node["tourism"="viewpoint"](around:${radius},${lat},${lng});
          node["tourism"="gallery"](around:${radius},${lat},${lng});
          way["tourism"="gallery"](around:${radius},${lat},${lng});
          node["historic"](around:${radius},${lat},${lng});
          way["historic"](around:${radius},${lat},${lng});
        );
      `;
      break;
      
    default:
      throw new Error('Invalid type parameter');
  }
  
  return `[out:json][timeout:25];${filter}out center;`;
}

// Normalize Overpass API response
function normalizeOverpassData(elements) {
  return elements.map(element => {
    // Get coordinates (handle both nodes and ways)
    const lat = element.lat || (element.center && element.center.lat) || null;
    const lng = element.lon || (element.center && element.center.lon) || null;
    
    if (!lat || !lng) {
      return null; // Skip elements without coordinates
    }
    
    return {
      id: element.id,
      name: element.tags?.name || 'Unnamed',
      lat,
      lng,
      tags: element.tags || {},
      type: element.type, // 'node' or 'way'
    };
  }).filter(item => item !== null); // Remove null entries
}

router.get('/', async (req, res) => {
  try {
    const { lat, lng, type } = req.query;
    
    // Validate required parameters
    if (!lat || !lng || !type) {
      return res.status(400).json({ 
        error: 'Missing required parameters: lat, lng, type' 
      });
    }
    
    // Validate lat/lng are numbers
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    
    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({ 
        error: 'Invalid lat/lng values' 
      });
    }
    
    // Validate type
    const validTypes = ['tourist', 'hotel', 'hospital'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ 
        error: `Invalid type. Must be one of: ${validTypes.join(', ')}` 
      });
    }
    
    // Build Overpass query
    const query = buildOverpassQuery(latitude, longitude, type);
    
    // Fetch from Overpass API
    const overpassUrl = 'https://overpass-api.de/api/interpreter';
    const response = await fetch(overpassUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `data=${encodeURIComponent(query)}`,
    });
    
    if (!response.ok) {
      throw new Error(`Overpass API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Normalize and return results
    const places = normalizeOverpassData(data.elements || []);
    
    res.json({
      success: true,
      count: places.length,
      query: { lat: latitude, lng: longitude, type },
      places,
    });
    
  } catch (error) {
    console.error('Places API error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch places data',
      message: error.message 
    });
  }
});

module.exports = router;
