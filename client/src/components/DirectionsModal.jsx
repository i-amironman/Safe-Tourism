import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Navigation, MapPin, Clock, AlertCircle } from 'lucide-react';

export default function DirectionsModal({ isOpen, onClose, hospital, userLocation }) {
  const [startingPoint, setStartingPoint] = useState('');
  const [directions, setDirections] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGetDirections = async () => {
    if (!startingPoint.trim()) {
      setError('Please enter a starting point');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // First, geocode the starting point
      const geocodeResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(startingPoint)}&limit=1`
      );
      const geocodeData = await geocodeResponse.json();

      if (geocodeData.length === 0) {
        throw new Error('Starting point not found. Please try a more specific location.');
      }

      const startCoords = {
        lat: parseFloat(geocodeData[0].lat),
        lng: parseFloat(geocodeData[0].lon)
      };

      // Get directions from our route API
      const routeResponse = await fetch('/route', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          waypoints: [
            startCoords,
            { lat: hospital.lat, lng: hospital.lng }
          ],
          mode: 'car',
          pathType: 'shortest'
        })
      });

      const routeData = await routeResponse.json();

      if (!routeData.success) {
        throw new Error(routeData.error || 'Failed to get directions');
      }

      setDirections({
        ...routeData.route,
        startAddress: geocodeData[0].display_name,
        endAddress: hospital.name
      });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUseCurrentLocation = () => {
    if (userLocation) {
      setStartingPoint(`${userLocation.lat}, ${userLocation.lng}`);
    } else {
      setError('Your current location is not available');
    }
  };

  const resetDirections = () => {
    setDirections(null);
    setError(null);
    setStartingPoint('');
  };

  const handleClose = () => {
    resetDirections();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            Get Directions to {hospital.name}
          </DialogTitle>
        </DialogHeader>

        {!directions ? (
          <div className="space-y-4">
            {/* Hospital Info */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">{hospital.name}</h3>
                    <p className="text-sm text-gray-600">
                      {hospital.tags?.['addr:street'] && `${hospital.tags['addr:street']}, `}
                      {hospital.tags?.['addr:city'] || 'Location not specified'}
                    </p>
                    {hospital.tags?.phone && (
                      <p className="text-sm text-gray-600 mt-1">
                        📞 {hospital.tags.phone}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Starting Point Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Starting Point</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter address, landmark, or coordinates"
                  value={startingPoint}
                  onChange={(e) => setStartingPoint(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleGetDirections()}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  onClick={handleUseCurrentLocation}
                  disabled={!userLocation}
                  title="Use current location"
                >
                  <MapPin className="h-4 w-4" />
                </Button>
              </div>
              {userLocation && (
                <p className="text-xs text-gray-500">
                  Or use your current location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                </p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-red-700">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">{error}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleGetDirections} 
                disabled={loading || !startingPoint.trim()}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Getting Directions...
                  </>
                ) : (
                  <>
                    <Navigation className="h-4 w-4 mr-2" />
                    Get Directions
                  </>
                )}
              </Button>
            </DialogFooter>
          </div>
        ) : (
          /* Directions Results */
          <div className="space-y-4">
            {/* Route Summary */}
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">From</p>
                    <p className="font-medium text-sm">{directions.startAddress}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">To</p>
                    <p className="font-medium text-sm">{directions.endAddress}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-4 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">{directions.durationMin} min</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-green-500" />
                    <span className="font-medium">{directions.distanceKm} km</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Map Preview */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-3">Route Map</h3>
                <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center relative overflow-hidden">
                  {/* Simple map visualization */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
                    <div className="relative h-full">
                      {/* Start point */}
                      <div className="absolute top-4 left-4">
                        <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                          Start
                        </div>
                      </div>
                      
                      {/* End point */}
                      <div className="absolute bottom-4 right-4">
                        <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          {hospital.name}
                        </div>
                      </div>
                      
                      {/* Route line visualization */}
                      <svg className="absolute inset-0 w-full h-full">
                        <path
                          d="M 40 40 Q 150 80, 280 200"
                          stroke="#3B82F6"
                          strokeWidth="3"
                          fill="none"
                          strokeDasharray="5,5"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="relative z-10 text-center">
                    <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Interactive map preview</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Route calculated via OpenStreetMap
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* External Map Link */}
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      Need turn-by-turn navigation?
                    </p>
                    <p className="text-xs text-blue-700">
                      Open in your preferred map app
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const url = `https://www.openstreetmap.org/directions?engine=osrm_car&route=${startingPoint};${hospital.lat},${hospital.lng}`;
                      window.open(url, '_blank');
                    }}
                  >
                    Open in Maps
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <DialogFooter>
              <Button variant="outline" onClick={resetDirections}>
                New Route
              </Button>
              <Button onClick={handleClose}>
                Done
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}