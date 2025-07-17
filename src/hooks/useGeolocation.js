import { useState, useCallback } from 'react';

const useGeolocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      return Promise.reject(new Error('Geolocation not supported'));
    }

    setLoading(true);
    setError(null);

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const locationData = { lat: latitude, lng: longitude };
          setLocation(locationData);
          setLoading(false);
          resolve(locationData);
        },
        (err) => {
          let errorMessage = 'Error getting your location.';
          
          switch (err.code) {
            case 1:
              errorMessage = 'Location access denied. Please allow location access.';
              break;
            case 2:
              errorMessage = 'Location unavailable. Please check your location settings.';
              break;
            case 3:
              errorMessage = 'Location request timed out.';
              break;
            default:
              errorMessage = 'An unknown error occurred while getting your location.';
          }
          
          setError(errorMessage);
          setLoading(false);
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    });
  }, []);

  return {
    location,
    error,
    loading,
    getCurrentLocation
  };
};

export default useGeolocation;

