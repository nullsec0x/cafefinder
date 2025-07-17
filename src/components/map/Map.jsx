import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Coffee, MapPin, Phone, Clock, Wifi, TreePine, ShoppingBag } from 'lucide-react';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const createCustomIcon = (color, icon) => {
  return L.divIcon({
    html: `
      <div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 14px;
      ">
        ${icon}
      </div>
    `,
    className: 'custom-div-icon',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15]
  });
};

const userLocationIcon = createCustomIcon('#2F4F4F', '📍');
const cafeIcon = createCustomIcon('#8B4513', '☕');

// Component to handle map updates
const MapUpdater = ({ center, zoom, cafes, onCafeClick }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [map, center, zoom]);

  return null;
};

const Map = ({ 
  userLocation, 
  searchLocation, 
  cafes = [], 
  selectedCafe, 
  onCafeClick,
  onPhoneClick 
}) => {
  const mapRef = useRef();
  const [mapCenter, setMapCenter] = useState([51.505, -0.09]); // Default to London
  const [mapZoom, setMapZoom] = useState(13);

  // Update map center when location changes
  useEffect(() => {
    if (searchLocation) {
      setMapCenter([searchLocation.lat, searchLocation.lng]);
      setMapZoom(14);
    } else if (userLocation) {
      setMapCenter([userLocation.lat, userLocation.lng]);
      setMapZoom(14);
    }
  }, [searchLocation, userLocation]);

  // Focus on selected café
  useEffect(() => {
    if (selectedCafe && mapRef.current) {
      const map = mapRef.current;
      map.setView([selectedCafe.lat, selectedCafe.lng], 16);
    }
  }, [selectedCafe]);

  const formatDistance = (dist) => {
    if (dist < 1000) {
      return `${Math.round(dist)}m`;
    }
    return `${(dist / 1000).toFixed(1)}km`;
  };

  const getAmenityIcon = (amenity) => {
    switch (amenity) {
      case 'wifi':
        return '📶';
      case 'outdoor_seating':
        return '🌳';
      case 'takeaway':
        return '🥤';
      default:
        return '';
    }
  };

  const handleCafeMarkerClick = (cafe) => {
    if (onCafeClick) {
      onCafeClick(cafe);
    }
  };

  const handlePhoneClick = (phone, e) => {
    e.stopPropagation();
    if (onPhoneClick) {
      onPhoneClick(phone);
    }
  };

  return (
    <div className="map-container">
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapUpdater 
          center={mapCenter} 
          zoom={mapZoom} 
          cafes={cafes}
          onCafeClick={onCafeClick}
        />

        {/* User location marker */}
        {userLocation && (
          <Marker 
            position={[userLocation.lat, userLocation.lng]} 
            icon={userLocationIcon}
          >
            <Popup>
              <div className="p-2">
                <div className="flex items-center space-x-2 mb-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="font-amatic text-lg font-bold">Your Location</span>
                </div>
                <p className="text-sm text-muted-foreground font-merriweather">
                  {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Search location marker (if different from user location) */}
        {searchLocation && (!userLocation || 
          (searchLocation.lat !== userLocation.lat || searchLocation.lng !== userLocation.lng)) && (
          <Marker 
            position={[searchLocation.lat, searchLocation.lng]} 
            icon={userLocationIcon}
          >
            <Popup>
              <div className="p-2">
                <div className="flex items-center space-x-2 mb-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="font-amatic text-lg font-bold">Search Location</span>
                </div>
                <p className="text-sm text-muted-foreground font-merriweather">
                  {searchLocation.displayName}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Café markers */}
        {cafes.map((cafe) => (
          <Marker
            key={cafe.id}
            position={[cafe.lat, cafe.lng]}
            icon={cafeIcon}
            eventHandlers={{
              click: () => handleCafeMarkerClick(cafe)
            }}
          >
            <Popup>
              <div className="p-3 min-w-[250px]">
                {/* Header */}
                <div className="mb-3">
                  <h3 className="font-amatic text-xl font-bold text-foreground mb-1">
                    {cafe.name}
                  </h3>
                  <div className="flex items-center space-x-2">
                    {cafe.distance && (
                      <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs font-merriweather">
                        {formatDistance(cafe.distance)}
                      </span>
                    )}
                    <span className={`px-2 py-1 rounded text-xs font-merriweather ${
                      cafe.isOpen === true 
                        ? 'bg-green-100 text-green-800' 
                        : cafe.isOpen === false 
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {cafe.isOpen === true ? 'Open' : cafe.isOpen === false ? 'Closed' : 'Unknown'}
                    </span>
                  </div>
                </div>

                {/* Address */}
                {cafe.address && (
                  <div className="flex items-start space-x-2 mb-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground font-merriweather">
                      {cafe.address}
                    </p>
                  </div>
                )}

                {/* Opening Hours */}
                {cafe.openingHours && (
                  <div className="flex items-start space-x-2 mb-2">
                    <Clock className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground font-merriweather">
                      {cafe.openingHours}
                    </p>
                  </div>
                )}

                {/* Phone */}
                {cafe.phone && (
                  <div className="flex items-center space-x-2 mb-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <button
                      onClick={(e) => handlePhoneClick(cafe.phone, e)}
                      className="text-sm text-primary hover:underline font-merriweather"
                    >
                      {cafe.phone}
                    </button>
                  </div>
                )}

                {/* Amenities */}
                {Object.keys(cafe.amenities || {}).some(key => cafe.amenities[key]) && (
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(cafe.amenities).map(([key, value]) => {
                        if (value) {
                          return (
                            <span
                              key={key}
                              className="inline-flex items-center space-x-1 bg-muted px-2 py-1 rounded text-xs font-merriweather"
                            >
                              <span>{getAmenityIcon(key)}</span>
                              <span className="capitalize">{key.replace('_', ' ')}</span>
                            </span>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {cafe.tags && cafe.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {cafe.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="bg-accent text-accent-foreground px-2 py-1 rounded text-xs font-merriweather"
                      >
                        {tag}
                      </span>
                    ))}
                    {cafe.tags.length > 3 && (
                      <span className="bg-accent text-accent-foreground px-2 py-1 rounded text-xs font-merriweather">
                        +{cafe.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;

