// API endpoints
const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';
const OVERPASS_BASE_URL = 'https://overpass-api.de/api/interpreter';

/**
 * Geocode an address or place name to coordinates using Nominatim API
 * @param {string} query - The address or place name to geocode
 * @returns {Promise<Object>} - Promise resolving to location data
 */
export const geocodeLocation = async (query) => {
  try {
    const response = await fetch(
      `${NOMINATIM_BASE_URL}/search?format=json&q=${encodeURIComponent(query)}&limit=1&addressdetails=1`
    );
    
    if (!response.ok) {
      throw new Error(`Geocoding failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.length === 0) {
      throw new Error('Location not found');
    }
    
    const result = data[0];
    return {
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      displayName: result.display_name,
      address: result.address
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    throw new Error(`Failed to find location: ${error.message}`);
  }
};

/**
 * Reverse geocode coordinates to get address using Nominatim API
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<Object>} - Promise resolving to address data
 */
export const reverseGeocode = async (lat, lng) => {
  try {
    const response = await fetch(
      `${NOMINATIM_BASE_URL}/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
    );
    
    if (!response.ok) {
      throw new Error(`Reverse geocoding failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      displayName: data.display_name,
      address: data.address
    };
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    throw new Error(`Failed to get address: ${error.message}`);
  }
};

/**
 * Search for cafés near a location using Overpass API
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} radius - Search radius in meters (default: 2000)
 * @returns {Promise<Array>} - Promise resolving to array of café data
 */
export const searchCafes = async (lat, lng, radius = 2000) => {
  try {
    // Overpass QL query to find cafés, coffee shops, and restaurants with café amenities
    const query = `
      [out:json][timeout:25];
      (
        node["amenity"="cafe"](around:${radius},${lat},${lng});
        node["amenity"="restaurant"]["cuisine"~"coffee"](around:${radius},${lat},${lng});
        node["shop"="coffee"](around:${radius},${lat},${lng});
        node["amenity"="fast_food"]["cuisine"~"coffee"](around:${radius},${lat},${lng});
        node["amenity"="bar"]["bar"~"coffee"](around:${radius},${lat},${lng});
      );
      out body;
    `;
    
    const response = await fetch(OVERPASS_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `data=${encodeURIComponent(query)}`
    });
    
    if (!response.ok) {
      throw new Error(`Overpass API failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Process and format the café data
    const cafes = data.elements.map(element => {
      const tags = element.tags || {};
      
      // Calculate distance from search center
      const distance = calculateDistance(lat, lng, element.lat, element.lon);
      
      // Extract amenities from tags
      const amenities = {
        wifi: tags.internet_access === 'wlan' || tags.wifi === 'yes' || tags['internet_access:fee'] === 'no',
        outdoor_seating: tags.outdoor_seating === 'yes',
        takeaway: tags.takeaway === 'yes',
        wheelchair: tags.wheelchair === 'yes',
        smoking: tags.smoking === 'yes' || tags.smoking === 'outside',
        parking: tags.parking === 'yes' || tags['parking:fee'] === 'no',
        delivery: tags.delivery === 'yes',
        reservation: tags.reservation === 'yes'
      };
      
      // Extract opening hours and determine if open
      const openingHours = tags.opening_hours || null;
      const isOpen = openingHours ? isCurrentlyOpen(openingHours) : null;
      
      // Format address
      const address = formatAddress(tags);
      
      // Generate a mock description based on available data
      const description = generateDescription(tags, amenities);
      
      // Generate mock price range
      const priceRange = generatePriceRange(tags);
      
      return {
        id: element.id,
        name: tags.name || 'Unnamed Café',
        address,
        phone: tags.phone || generateMockPhone(),
        website: tags.website || null,
        email: tags.email || null,
        lat: element.lat,
        lng: element.lon,
        distance: Math.round(distance),
        openingHours,
        isOpen,
        amenities,
        tags: extractTags(tags),
        cuisine: tags.cuisine || 'coffee',
        rating: generateMockRating(),
        priceRange,
        description,
        specialties: generateSpecialties(tags),
        atmosphere: generateAtmosphere(tags, amenities)
      };
    });
    
    // Sort by distance
    return cafes.sort((a, b) => a.distance - b.distance);
    
  } catch (error) {
    console.error('Café search error:', error);
    throw new Error(`Failed to search for cafés: ${error.message}`);
  }
};

/**
 * Search cafes by name
 * @param {Array} cafes - Array of cafe objects
 * @param {string} searchTerm - Search term
 * @returns {Array} - Filtered cafes
 */
export const searchCafesByName = (cafes, searchTerm) => {
  if (!searchTerm || searchTerm.trim() === '') {
    return cafes;
  }
  
  const term = searchTerm.toLowerCase().trim();
  
  return cafes.filter(cafe => {
    return cafe.name.toLowerCase().includes(term) ||
           (cafe.description && cafe.description.toLowerCase().includes(term)) ||
           (cafe.specialties && cafe.specialties.some(specialty => 
             specialty.toLowerCase().includes(term)
           )) ||
           (cafe.tags && cafe.tags.some(tag => 
             tag.toLowerCase().includes(term)
           ));
  });
};

/**
 * Generate mock description based on cafe data
 * @param {Object} tags - OSM tags
 * @param {Object} amenities - Amenities object
 * @returns {string} - Generated description
 */
const generateDescription = (tags, amenities) => {
  const descriptions = [
    "A cozy neighborhood cafe perfect for coffee lovers and casual meetings.",
    "Charming coffee shop with artisanal brews and a warm, welcoming atmosphere.",
    "Local favorite serving exceptional coffee and light bites in a relaxed setting.",
    "Trendy cafe offering specialty coffee drinks and a comfortable workspace.",
    "Family-owned coffee house with homemade pastries and friendly service.",
    "Modern coffee bar featuring locally roasted beans and creative beverages.",
    "Intimate cafe with a focus on quality coffee and community connection.",
    "Stylish coffee shop perfect for both work and leisure, with great ambiance."
  ];
  
  let baseDescription = descriptions[Math.floor(Math.random() * descriptions.length)];
  
  // Add amenity-specific details
  const additions = [];
  if (amenities.wifi) additions.push("Free WiFi available");
  if (amenities.outdoor_seating) additions.push("outdoor seating");
  if (amenities.takeaway) additions.push("takeaway options");
  if (amenities.wheelchair) additions.push("wheelchair accessible");
  
  if (additions.length > 0) {
    baseDescription += ` Features include ${additions.join(', ')}.`;
  }
  
  return baseDescription;
};

/**
 * Generate mock price range
 * @param {Object} tags - OSM tags
 * @returns {string} - Price range
 */
const generatePriceRange = (tags) => {
  const ranges = ['$', '$$', '$$$'];
  return ranges[Math.floor(Math.random() * ranges.length)];
};

/**
 * Generate mock rating
 * @returns {number} - Rating between 3.5 and 5.0
 */
const generateMockRating = () => {
  return Math.round((3.5 + Math.random() * 1.5) * 10) / 10;
};

/**
 * Generate mock phone number
 * @returns {string} - Mock phone number
 */
const generateMockPhone = () => {
  const areaCodes = ['555', '123', '456', '789'];
  const areaCode = areaCodes[Math.floor(Math.random() * areaCodes.length)];
  const number = Math.floor(1000000 + Math.random() * 9000000);
  return `(${areaCode}) ${number.toString().slice(0, 3)}-${number.toString().slice(3)}`;
};

/**
 * Generate specialties based on tags
 * @param {Object} tags - OSM tags
 * @returns {Array} - Array of specialties
 */
const generateSpecialties = (tags) => {
  const allSpecialties = [
    'Espresso', 'Cappuccino', 'Latte', 'Americano', 'Macchiato',
    'Cold Brew', 'Iced Coffee', 'Frappé', 'Mocha', 'Flat White',
    'Croissants', 'Muffins', 'Scones', 'Bagels', 'Sandwiches',
    'Salads', 'Soups', 'Pastries', 'Cakes', 'Cookies'
  ];
  
  const count = Math.floor(Math.random() * 5) + 3; // 3-7 specialties
  const shuffled = allSpecialties.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

/**
 * Generate atmosphere description
 * @param {Object} tags - OSM tags
 * @param {Object} amenities - Amenities object
 * @returns {string} - Atmosphere description
 */
const generateAtmosphere = (tags, amenities) => {
  const atmospheres = [
    'Cozy and intimate', 'Modern and trendy', 'Rustic and charming',
    'Bright and airy', 'Quiet and peaceful', 'Lively and social',
    'Industrial chic', 'Bohemian and artistic', 'Classic and elegant',
    'Casual and relaxed'
  ];
  
  return atmospheres[Math.floor(Math.random() * atmospheres.length)];
};

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - First latitude
 * @param {number} lng1 - First longitude
 * @param {number} lat2 - Second latitude
 * @param {number} lng2 - Second longitude
 * @returns {number} - Distance in meters
 */
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lng2 - lng1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
};

/**
 * Format address from OSM tags
 * @param {Object} tags - OSM tags
 * @returns {string} - Formatted address
 */
const formatAddress = (tags) => {
  const parts = [];
  
  if (tags['addr:housenumber']) parts.push(tags['addr:housenumber']);
  if (tags['addr:street']) parts.push(tags['addr:street']);
  if (tags['addr:city']) parts.push(tags['addr:city']);
  if (tags['addr:postcode']) parts.push(tags['addr:postcode']);
  
  return parts.length > 0 ? parts.join(', ') : null;
};

/**
 * Extract relevant tags for display
 * @param {Object} tags - OSM tags
 * @returns {Array} - Array of relevant tags
 */
const extractTags = (tags) => {
  const relevantTags = [];
  
  if (tags.cuisine) relevantTags.push(tags.cuisine);
  if (tags.outdoor_seating === 'yes') relevantTags.push('outdoor seating');
  if (tags.internet_access === 'wlan' || tags.wifi === 'yes') relevantTags.push('wifi');
  if (tags.takeaway === 'yes') relevantTags.push('takeaway');
  if (tags.wheelchair === 'yes') relevantTags.push('wheelchair accessible');
  
  return relevantTags;
};

/**
 * Simple check if a place is currently open based on opening hours
 * Note: This is a simplified implementation. A full implementation would need
 * a proper opening hours parser library.
 * @param {string} openingHours - Opening hours string
 * @returns {boolean|null} - True if open, false if closed, null if unknown
 */
const isCurrentlyOpen = (openingHours) => {
  // This is a very basic implementation
  // In a real app, you'd want to use a library like opening_hours.js
  
  if (!openingHours || openingHours === '24/7') {
    return openingHours === '24/7';
  }
  
  // For now, return null (unknown) for complex opening hours
  // This would need proper parsing in a production app
  return null;
};

