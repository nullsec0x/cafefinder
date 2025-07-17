import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SearchBar from './components/search/SearchBar';
import FilterPanel from './components/filters/FilterPanel';
import CafeList from './components/cafe/CafeList';
import Map from './components/map/Map';
import LoadingSpinner from './components/LoadingSpinner';
import useGeolocation from './hooks/useGeolocation';
import useFavorites from './hooks/useFavorites';
import { geocodeLocation, reverseGeocode, searchCafes, searchCafesByName } from './lib/api';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cafes, setCafes] = useState([]);
  const [allCafes, setAllCafes] = useState([]); // Store all cafes for name search
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [filtersCollapsed, setFiltersCollapsed] = useState(true);
  const [searchLocation, setSearchLocation] = useState(null);
  const [selectedCafe, setSelectedCafe] = useState(null);
  
  const { getCurrentLocation } = useGeolocation();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  
  // Filter state
  const [filters, setFilters] = useState({
    distance: '2000',
    openNow: false,
    wifi: false,
    outdoor: false,
    takeaway: false
  });

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const searchCafesNearLocation = async (location) => {
    try {
      const radius = parseInt(filters.distance);
      const cafesData = await searchCafes(location.lat, location.lng, radius);
      
      // Store all cafes for name search
      setAllCafes(cafesData);
      
      // Apply filters
      let filteredCafes = cafesData;
      
      if (filters.openNow) {
        filteredCafes = filteredCafes.filter(cafe => cafe.isOpen === true);
      }
      
      if (filters.wifi) {
        filteredCafes = filteredCafes.filter(cafe => cafe.amenities.wifi);
      }
      
      if (filters.outdoor) {
        filteredCafes = filteredCafes.filter(cafe => cafe.amenities.outdoor_seating);
      }
      
      if (filters.takeaway) {
        filteredCafes = filteredCafes.filter(cafe => cafe.amenities.takeaway);
      }
      
      setCafes(filteredCafes);
    } catch (err) {
      throw new Error(`Failed to search cafés: ${err.message}`);
    }
  };

  const handleSearch = async (query) => {
    setIsLoading(true);
    setError(null);
    setSelectedCafe(null);
    
    try {
      // Geocode the search query
      const location = await geocodeLocation(query);
      setSearchLocation(location);
      
      // Search for cafés near the location
      await searchCafesNearLocation(location);
      
    } catch (err) {
      setError(err.message);
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCafeNameSearch = async (query) => {
    if (allCafes.length === 0) {
      setError('Please search for a location first to find cafes in that area.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setSelectedCafe(null);
    
    try {
      const filteredCafes = searchCafesByName(allCafes, query);
      setCafes(filteredCafes);
      
      if (filteredCafes.length === 0) {
        setError(`No cafes found matching "${query}"`);
      }
    } catch (err) {
      setError(err.message);
      console.error('Cafe name search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationRequest = async () => {
    setIsLoading(true);
    setError(null);
    setSelectedCafe(null);
    
    try {
      // Get user's current location
      const location = await getCurrentLocation();
      setUserLocation(location);
      
      // Get address for the location
      try {
        const addressData = await reverseGeocode(location.lat, location.lng);
        setSearchLocation({
          ...location,
          displayName: addressData.displayName,
          address: addressData.address
        });
      } catch (reverseError) {
        // If reverse geocoding fails, still use the location
        setSearchLocation({
          ...location,
          displayName: `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
        });
      }
      
      // Search for cafés near the user's location
      await searchCafesNearLocation(location);
      
    } catch (err) {
      setError(err.message);
      console.error('Geolocation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = async (filterName, value) => {
    const newFilters = {
      ...filters,
      [filterName]: value
    };
    setFilters(newFilters);
    
    // Re-search with new filters if we have a location
    if (searchLocation && !isLoading) {
      setIsLoading(true);
      try {
        // Temporarily update filters for the search
        const tempFilters = { ...filters, [filterName]: value };
        const radius = parseInt(tempFilters.distance);
        const cafesData = await searchCafes(searchLocation.lat, searchLocation.lng, radius);
        
        // Store all cafes for name search
        setAllCafes(cafesData);
        
        // Apply all filters
        let filteredCafes = cafesData;
        
        if (tempFilters.openNow) {
          filteredCafes = filteredCafes.filter(cafe => cafe.isOpen === true);
        }
        
        if (tempFilters.wifi) {
          filteredCafes = filteredCafes.filter(cafe => cafe.amenities.wifi);
        }
        
        if (tempFilters.outdoor) {
          filteredCafes = filteredCafes.filter(cafe => cafe.amenities.outdoor_seating);
        }
        
        if (tempFilters.takeaway) {
          filteredCafes = filteredCafes.filter(cafe => cafe.amenities.takeaway);
        }
        
        setCafes(filteredCafes);
      } catch (err) {
        console.error('Filter error:', err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleResetFilters = async () => {
    const newFilters = {
      distance: '2000',
      openNow: false,
      wifi: false,
      outdoor: false,
      takeaway: false
    };
    setFilters(newFilters);
    
    // Re-search with reset filters if we have a location
    if (searchLocation && !isLoading) {
      setIsLoading(true);
      try {
        const cafesData = await searchCafes(searchLocation.lat, searchLocation.lng, 2000);
        setAllCafes(cafesData);
        setCafes(cafesData);
      } catch (err) {
        console.error('Reset filters error:', err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCafeMapClick = (cafe) => {
    setSelectedCafe(cafe);
  };

  const handleCafePhoneClick = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  const toggleFiltersCollapse = () => {
    setFiltersCollapsed(!filtersCollapsed);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="space-y-6">
          {/* Search Section */}
          <div className="w-full">
            <SearchBar
              onSearch={handleSearch}
              onLocationRequest={handleLocationRequest}
              onCafeNameSearch={handleCafeNameSearch}
              isLoading={isLoading}
            />
          </div>

          {/* Current Location Display */}
          {searchLocation && (
            <div className="bg-card border border-border rounded-lg p-3 mobile-spacing">
              <p className="text-sm text-muted-foreground font-playwrite-de-grund">
                <span className="font-medium">Searching near:</span> {searchLocation.displayName}
              </p>
            </div>
          )}

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 main-grid">
            {/* Map Section - Shows first on mobile */}
            <div className="lg:col-span-2 map-section">
              <div className="bg-card border border-border rounded-lg p-4 mobile-spacing">
                <h2 className="font-faculty-glyphic text-2xl font-bold text-foreground mb-4">
                  Interactive Map
                </h2>
                <div className="map-container">
                  <Map
                    userLocation={userLocation}
                    searchLocation={searchLocation}
                    cafes={cafes}
                    selectedCafe={selectedCafe}
                    onCafeClick={handleCafeMapClick}
                    onPhoneClick={handleCafePhoneClick}
                  />
                </div>
              </div>
            </div>

            {/* Sidebar - Filters and Cafe List - Shows second on mobile */}
            <div className="lg:col-span-1 space-y-6 sidebar">
              <div className="mobile-spacing">
                <FilterPanel
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onResetFilters={handleResetFilters}
                  isCollapsed={filtersCollapsed}
                  onToggleCollapse={toggleFiltersCollapse}
                />
              </div>
              
              <div className="mobile-spacing">
                <CafeList
                  cafes={cafes}
                  isLoading={isLoading}
                  error={error}
                  onCafeMapClick={handleCafeMapClick}
                  onCafePhoneClick={handleCafePhoneClick}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                  isFavorite={isFavorite}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
