# Cozy Café Finder

A modern, responsive web application for finding cozy cafés near you. Built with React, TypeScript, and Tailwind CSS, featuring real-time location detection, interactive maps, and advanced filtering options.

![Cozy Café Finder Light Mode](./cozy_cafe_finder_light_mode_interface.webp)
![Cozy Café Finder Dark Mode](./cozy_cafe_finder_dark_mode_interface.webp)

## ✨ Features

### 🔍 Smart Search & Location
- **Location Detection**: Automatically detect your current location using the browser's geolocation API
- **Address Search**: Search for cafés in any city or address using the Nominatim geocoding API
- **Real-time Results**: Get instant results with live café data from OpenStreetMap

### 🗺️ Interactive Map
- **Leaflet.js Integration**: Beautiful, responsive interactive map
- **Custom Markers**: Distinct markers for your location and café locations
- **Rich Popups**: Detailed café information including address, hours, amenities, and contact info
- **Map Interactions**: Click on markers to view café details, zoom and pan controls

### 🎛️ Advanced Filtering
- **Distance Filter**: Search within 1km, 2km, 5km, or 10km radius
- **Opening Hours**: Filter by currently open cafés
- **Amenities**: Filter by WiFi availability, outdoor seating, and takeaway options
- **Real-time Updates**: Filters apply instantly without page reload

### 🎨 Beautiful Design
- **Earthy Color Palette**: Warm, cozy colors including sage green, terracotta, and warm browns
- **Dark Mode Support**: Toggle between light and dark themes
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Custom Typography**: Amatic SC for headings and Merriweather for body text

### 📱 User Experience
- **Loading States**: Smooth loading animations and spinners
- **Error Handling**: Graceful error messages and fallbacks
- **Accessibility**: Keyboard navigation and screen reader support
- **Performance**: Optimized for fast loading and smooth interactions

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or pnpm package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cozy-cafe-finder-app
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Start the development server**
   ```bash
   pnpm run dev
   # or
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application.

## 🏗️ Project Structure

```
cozy-cafe-finder-app/
├── public/
│   └── assets/
│       ├── favicon.png
│       └── loading_spinner.gif
├── src/
│   ├── components/
│   │   ├── cafe/
│   │   │   ├── CafeCard.jsx
│   │   │   └── CafeList.jsx
│   │   ├── filters/
│   │   │   └── FilterPanel.jsx
│   │   ├── map/
│   │   │   └── Map.jsx
│   │   ├── search/
│   │   │   └── SearchBar.jsx
│   │   ├── Header.jsx
│   │   └── LoadingSpinner.jsx
│   ├── hooks/
│   │   └── useGeolocation.js
│   ├── lib/
│   │   └── api.js
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── package.json
└── README.md
```

## 🔧 Technical Details

### APIs Used
- **Nominatim API**: For geocoding addresses and reverse geocoding coordinates
- **Overpass API**: For querying café data from OpenStreetMap
- **Browser Geolocation API**: For detecting user's current location

### Key Technologies
- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type-safe JavaScript for better development experience
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **Leaflet.js**: Open-source JavaScript library for interactive maps
- **React Leaflet**: React components for Leaflet maps
- **Vite**: Fast build tool and development server

### Color Palette
```css
/* Light Mode */
--sage-green: #87A96B
--terracotta: #D2691E
--warm-brown: #8B4513
--cream: #F5F5DC
--soft-beige: #F0E68C

/* Dark Mode */
--dark-sage: #5A6B47
--dark-terracotta: #A0471A
--dark-brown: #654321
--dark-background: #2F2F2F
--dark-surface: #3A3A3A
```

## 📖 Usage Guide

### Searching for Cafés

1. **By Location**: Click "Use my location" to find cafés near your current position
2. **By Address**: Type a city, address, or landmark in the search box and click "Search"
3. **View Results**: Browse the list of cafés or view them on the interactive map

### Using Filters

- **Distance**: Adjust the maximum search radius using the distance slider
- **Opening Hours**: Toggle "Open now" to show only currently open cafés
- **Amenities**: Filter by WiFi, outdoor seating, or takeaway availability
- **Reset**: Click "Reset" to clear all filters and show all results

### Map Interactions

- **Zoom**: Use the +/- buttons or mouse wheel to zoom in/out
- **Pan**: Click and drag to move around the map
- **Markers**: Click on café markers to view detailed information
- **Popups**: View café details including address, hours, phone, and amenities

### Dark Mode

Click the moon/sun icon in the top-right corner to toggle between light and dark themes.

## 🌐 API Configuration

The application uses public APIs that don't require API keys:

### Nominatim API
- **Base URL**: `https://nominatim.openstreetmap.org`
- **Usage**: Geocoding and reverse geocoding
- **Rate Limit**: 1 request per second
- **Documentation**: [Nominatim API Docs](https://nominatim.org/release-docs/develop/api/Overview/)

### Overpass API
- **Base URL**: `https://overpass-api.de/api/interpreter`
- **Usage**: Querying café data from OpenStreetMap
- **Rate Limit**: Reasonable use policy
- **Documentation**: [Overpass API Docs](https://wiki.openstreetmap.org/wiki/Overpass_API)

## 🚀 Deployment

### Build for Production

```bash
pnpm run build
# or
npm run build
```

This creates a `dist/` folder with optimized production files.

### Deploy to Static Hosting

The application can be deployed to any static hosting service:

- **Vercel**: Connect your GitHub repository for automatic deployments
- **Netlify**: Drag and drop the `dist/` folder or connect via Git
- **GitHub Pages**: Use GitHub Actions to deploy the `dist/` folder
- **AWS S3**: Upload the `dist/` contents to an S3 bucket with static hosting

### Environment Variables

No environment variables are required as the application uses public APIs.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenStreetMap**: For providing free, open geographic data
- **Leaflet**: For the excellent mapping library
- **Nominatim**: For geocoding services
- **Overpass API**: For querying OpenStreetMap data
- **React Team**: For the amazing React framework
- **Tailwind CSS**: For the utility-first CSS framework

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page for existing problems
2. Create a new issue with detailed information
3. Include screenshots and error messages if applicable

---

**Made with ❤️ and ☕ for café lovers everywhere!**

