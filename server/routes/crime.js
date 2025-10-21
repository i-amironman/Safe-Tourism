const express = require('express');
const router = express.Router();

// GET /crime?lat=&lng=&radius=
// Returns crime statistics from UK Police API
// NOTE: This API only covers England, Wales, and Northern Ireland
router.get('/', async (req, res) => {
  try {
    const { lat, lng, radius = 2000 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        error: 'Latitude and longitude are required'
      });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid latitude or longitude'
      });
    }

    // UK Police API endpoint for street-level crimes
    // Note: This API has rate limits (15 requests per second, 1000 per hour per IP)
    const apiUrl = `https://data.police.uk/api/crimes-street/all-crime?lat=${latitude}&lng=${longitude}&date=2023-01`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      // If outside UK coverage or API error
      if (response.status === 404) {
        return res.json({
          success: true,
          coverage: 'uk_only',
          message: 'Crime data is only available for England, Wales, and Northern Ireland',
          total: 0,
          byCategory: {},
          crimeScore: 0,
          lastUpdated: null
        });
      }
      throw new Error(`Police API error: ${response.status}`);
    }

    const crimes = await response.json();

    // Aggregate by category
    const byCategory = {};
    crimes.forEach(crime => {
      const category = crime.category || 'unknown';
      byCategory[category] = (byCategory[category] || 0) + 1;
    });

    // Calculate naive crime score (0-100, where 100 is highest risk)
    // This is a simplified calculation based on crime count
    // In production, this would use more sophisticated risk models
    const total = crimes.length;
    const crimeScore = Math.min(100, Math.round((total / 50) * 100));

    // Get the latest crime date
    const lastUpdated = crimes.length > 0
      ? crimes.reduce((latest, crime) => {
          const crimeDate = new Date(crime.month);
          return crimeDate > latest ? crimeDate : latest;
        }, new Date(0))
      : null;

    res.json({
      success: true,
      coverage: 'uk_only',
      message: 'Data covers England, Wales, and Northern Ireland only. Shows crimes from most recent month available.',
      total,
      byCategory,
      crimeScore,
      lastUpdated: lastUpdated ? lastUpdated.toISOString() : null,
      limitations: [
        'UK coverage only (England, Wales, Northern Ireland)',
        'Data shows single month snapshot (most recent available)',
        'Crime score is simplified calculation',
        'API rate limited: 15 req/sec, 1000 req/hour',
        'Full risk analysis would require historical data aggregation'
      ]
    });

  } catch (error) {
    console.error('Error fetching crime data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch crime data',
      message: error.message
    });
  }
});

module.exports = router;