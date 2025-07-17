import React from 'react';
import { MapPin, Phone, Clock, Wifi, TreePine, ShoppingBag, Star, Heart, Globe, DollarSign } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

const CafeCard = ({ cafe, onMapClick, onPhoneClick, onToggleFavorite, isFavorite }) => {
  const {
    name,
    address,
    phone,
    website,
    distance,
    openingHours,
    isOpen,
    amenities = {},
    tags = [],
    rating,
    priceRange,
    description,
    specialties = [],
    atmosphere
  } = cafe;

  const formatDistance = (dist) => {
    if (dist < 1000) {
      return `${Math.round(dist)}m`;
    }
    return `${(dist / 1000).toFixed(1)}km`;
  };

  const getAmenityIcon = (amenity) => {
    switch (amenity) {
      case 'wifi':
        return <Wifi className="h-3 w-3" />;
      case 'outdoor_seating':
        return <TreePine className="h-3 w-3" />;
      case 'takeaway':
        return <ShoppingBag className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-3 w-3 fill-yellow-400/50 text-yellow-400" />);
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-3 w-3 text-gray-300" />);
    }

    return stars;
  };

  return (
    <div className="cafe-card p-4 rounded-lg border border-border bg-card hover:shadow-md transition-shadow">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-faculty-glyphic text-xl font-bold text-foreground line-clamp-1">
              {name}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              {distance && (
                <Badge variant="secondary" className="text-xs">
                  {formatDistance(distance)}
                </Badge>
              )}
              <Badge 
                variant={isOpen === true ? "default" : isOpen === false ? "destructive" : "secondary"} 
                className="text-xs"
              >
                {isOpen === true ? 'Open' : isOpen === false ? 'Closed' : 'Unknown'}
              </Badge>
              {priceRange && (
                <Badge variant="outline" className="text-xs">
                  {priceRange}
                </Badge>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleFavorite(cafe)}
            className="p-2 hover:bg-muted"
          >
            <Heart 
              className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} 
            />
          </Button>
        </div>

        {/* Rating */}
        {rating && (
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              {renderStars(rating)}
            </div>
            <span className="text-sm font-playwrite-de-grund text-muted-foreground">
              {rating}
            </span>
          </div>
        )}

        {/* Description */}
        {description && (
          <p className="text-sm text-muted-foreground font-playwrite-de-grund line-clamp-2">
            {description}
          </p>
        )}

        {/* Atmosphere */}
        {atmosphere && (
          <div className="text-xs text-muted-foreground font-playwrite-de-grund italic">
            Atmosphere: {atmosphere}
          </div>
        )}

        {/* Address */}
        {address && (
          <div className="flex items-start space-x-2">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <p className="text-sm text-muted-foreground font-playwrite-de-grund line-clamp-2">
              {address}
            </p>
          </div>
        )}

        {/* Opening Hours */}
        {openingHours && (
          <div className="flex items-start space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <p className="text-sm text-muted-foreground font-playwrite-de-grund">
              {openingHours}
            </p>
          </div>
        )}

        {/* Specialties */}
        {specialties.length > 0 && (
          <div>
            <p className="text-xs font-faculty-glyphic font-medium text-foreground mb-1">
              Specialties:
            </p>
            <div className="flex flex-wrap gap-1">
              {specialties.slice(0, 4).map((specialty, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {specialty}
                </Badge>
              ))}
              {specialties.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{specialties.length - 4}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Amenities */}
        {Object.keys(amenities).length > 0 && (
          <div className="flex flex-wrap gap-2">
            {Object.entries(amenities).map(([key, value]) => {
              if (value) {
                return (
                  <div
                    key={key}
                    className="flex items-center space-x-1 bg-muted px-2 py-1 rounded-md"
                  >
                    {getAmenityIcon(key)}
                    <span className="text-xs font-playwrite-de-grund capitalize">
                      {key.replace('_', ' ')}
                    </span>
                  </div>
                );
              }
              return null;
            })}
          </div>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onMapClick(cafe)}
            className="flex-1 btn-hover font-faculty-glyphic"
          >
            <MapPin className="h-4 w-4 mr-1" />
            View on map
          </Button>
          {phone && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPhoneClick(phone)}
              className="btn-hover"
              title={`Call ${phone}`}
            >
              <Phone className="h-4 w-4" />
            </Button>
          )}
          {website && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(website, '_blank')}
              className="btn-hover"
              title="Visit website"
            >
              <Globe className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CafeCard;

