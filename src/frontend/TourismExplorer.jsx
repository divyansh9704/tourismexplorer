import React, { useState, useEffect, useMemo } from 'react';
import { 
  MapPin, Compass, List, Map as MapIcon, Bookmark, 
  Sparkles, ChevronUp, ChevronDown, Check, Share2, Search, Loader2, LocateFixed
} from 'lucide-react';
import AttractionCard from './AttractionCard';
import MapView from './MapView';
import SkeletonLoader from './SkeletonLoader';
import EmptyState from './EmptyState';
import AIAssistantModal from './AIAssistantModal';

const GEOAPIFY_KEY = 'bcf641da38744b899ab6d6a67e131be9'; 

export default function TourismExplorer({ searchData }) {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'map'
  const [activeCategory, setActiveCategory] = useState('All');
  const [savedTrips, setSavedTrips] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [hoveredPlaceId, setHoveredPlaceId] = useState(null);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  
  // Custom Search & GPS State
  const [customLocation, setCustomLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isUsingGPS, setIsUsingGPS] = useState(false);

  // Extract resolved entity from searchData payload
  const payload = Array.isArray(searchData) ? searchData[0] : (searchData || {});
  const firstEntity = payload?.entities?.[0];
  const entity = firstEntity?.entityInfo || firstEntity || {};
  
  // Try to get lat/lon from entity geo, fallback to userLocation
  const geo = entity?.geo || entity || {};
  const defaultLat = geo.lat || payload?.userLocation?.position?.coords?.latitude;
  const defaultLon = geo.long || geo.lon || payload?.userLocation?.position?.coords?.longitude;
  const defaultCity = geo.city || 'Requested Location';
  const defaultCountry = geo.country || '';

  // Use custom location if available, otherwise default
  const lat = customLocation ? customLocation.lat : defaultLat;
  const lon = customLocation ? customLocation.lon : defaultLon;
  const city = customLocation ? customLocation.city : defaultCity;
  const country = customLocation ? customLocation.country : defaultCountry;

  const locationName = country ? `${city}, ${country}` : city; 

  const handleSearch = async (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      setIsSearching(true);
      try {
        const res = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(searchQuery)}&limit=1&apiKey=${GEOAPIFY_KEY}`);
        const data = await res.json();
        if (data.features && data.features.length > 0) {
          const props = data.features[0].properties;
          setCustomLocation({
            lat: props.lat,
            lon: props.lon,
            city: props.city || props.name || searchQuery,
            country: props.country || ''
          });
          setSearchQuery('');
          setActiveCategory('All');
          setIsUsingGPS(false);
        }
      } catch (err) {
        console.error(err);
      }
      setIsSearching(false);
    }
  };

  const handleGPSLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${GEOAPIFY_KEY}`);
          const data = await res.json();
          let cityName = 'Current Location';
          let countryName = '';
          
          if (data.features && data.features.length > 0) {
            const props = data.features[0].properties;
            cityName = props.city || props.town || props.village || props.name || 'Current Location';
            countryName = props.country || '';
          }
          
          setCustomLocation({
            lat: latitude,
            lon: longitude,
            city: cityName,
            country: countryName
          });
          setSearchQuery('');
          setActiveCategory('All');
          setIsUsingGPS(true);
        } catch (err) {
          console.error(err);
          setCustomLocation({ lat: latitude, lon: longitude, city: 'Current Location', country: '' });
          setIsUsingGPS(true);
        }
        setIsLocating(false);
      },
      (error) => {
        console.error("Error getting location", error);
        alert("Unable to retrieve your location. Please check your browser permissions.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    );
  };

  useEffect(() => {
    setCustomLocation(null);
    setIsUsingGPS(false);
  }, [searchData]);

  useEffect(() => {
    if (!lat || !lon) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(false);

    // Broadened categories to ensure Museum, Park, Historic, and Landmarks are all fetched
    const apiCategories = 'tourism.sights,entertainment.museum,leisure.park,heritage,building.historic';
    const endpoint = `https://api.geoapify.com/v2/places?categories=${apiCategories}&filter=circle:${lon},${lat},5000&limit=50&details=details,details.contact,details.opening_hours&apiKey=${GEOAPIFY_KEY}`; 

    fetch(endpoint)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch sights');
        return res.json();
      })
      .then((data) => {
        const items = data?.features || []; 
        
        const uniqueNames = new Set();
        const tourismOnly = items.filter((item) => {
          const props = item.properties || {};
          const cats = props.categories || []; 
          const name = props.name;

          // Must have a valid name to display to users
          if (!name) return false;

          // Exclude hotels/restaurants
          if (cats.some((c) => c.includes('catering') || c.includes('accommodation'))) {
            return false;
          }

          // Deduplicate by exact name (case-insensitive)
          const normalizedName = name.toLowerCase().trim();
          if (uniqueNames.has(normalizedName)) return false;
          uniqueNames.add(normalizedName);

          return true;
        });
        
        setPlaces(tourismOnly);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [lat, lon]);

  const categoriesList = ['All', 'Landmark', 'Museum', 'Park', 'Historic'];

  const filteredPlaces = useMemo(() => {
    if (activeCategory === 'All') return places;
    return places.filter((p) => {
      const cats = (p.properties?.categories || []).join(' ').toLowerCase(); 
      if (activeCategory === 'Landmark') return cats.includes('monument') || cats.includes('landmark') || cats.includes('memorial') || cats.includes('statue');
      if (activeCategory === 'Historic') return cats.includes('historic') || cats.includes('castle') || cats.includes('ruins');
      if (activeCategory === 'Park') return cats.includes('park') || cats.includes('nature') || cats.includes('garden') || cats.includes('forest');
      if (activeCategory === 'Museum') return cats.includes('museum') || cats.includes('gallery') || cats.includes('art');
      return cats.includes(activeCategory.toLowerCase());
    });
  }, [places, activeCategory]);

  const toggleSaveTrip = (place) => {
    const id = place.properties?.place_id || place.properties?.name; 
    setSavedTrips((prev) => 
      prev.some((item) => (item.properties?.place_id || item.properties?.name) === id)
        ? prev.filter((item) => (item.properties?.place_id || item.properties?.name) !== id)
        : [...prev, place]
    );
  };

  const handleMapMove = async ({ lat, lon }) => {
    // Reverse geocode to find new city
    try {
      const res = await fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${GEOAPIFY_KEY}`);
      const data = await res.json();
      let cityName = 'Selected Location';
      let countryName = '';
      
      if (data.features && data.features.length > 0) {
        const props = data.features[0].properties;
        cityName = props.city || props.town || props.village || props.name || 'Selected Location';
        countryName = props.country || '';
      }
      
      setCustomLocation({
        lat,
        lon,
        city: cityName,
        country: countryName
      });
      setIsUsingGPS(false);
    } catch (err) {
      console.error("Map reverse geocode failed:", err);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-6 sm:my-10 bg-[#FFF9F5]/95 backdrop-blur-2xl border border-orange-200/60 rounded-[2rem] shadow-[0_20px_50px_rgba(234,88,12,0.07)] overflow-hidden flex flex-col h-[820px] font-sans text-stone-800">
      
      {/* Dynamic Header with World Map Background */}
      <div className="relative p-6 text-white overflow-hidden shrink-0 bg-stone-950/90">
        {/* World Map Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-[center_15%] opacity-100 transition-transform duration-700 hover:scale-105"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop')` }}
        ></div>
        
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-900/60 to-stone-900/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-orange-950/70 via-transparent to-amber-900/50 mix-blend-multiply"></div>
        
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-orange-400/30 via-transparent to-transparent"></div>
        
        <div className="relative z-10 flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold border border-white/10">
            <Compass className="w-4 h-4 animate-spin-slow text-orange-200" />
            <span className="tracking-wide">Tourism Explorer</span>
          </div>
          <span className="text-xs bg-black/20 px-3 py-1.5 rounded-full font-medium border border-black/10">
            {loading ? 'Searching...' : `${filteredPlaces.length} Places Found`}
          </span>
        </div>

        <h2 className="relative z-10 text-2xl font-extrabold tracking-tight flex items-center gap-2 mt-3">
          <MapPin className="w-6 h-6 text-orange-300 shrink-0" />
          <span className="truncate drop-shadow-sm">{locationName}</span>
        </h2>

        {/* Global Search Bar & GPS */}
        <div className="relative z-10 mt-5 flex items-end gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-white/70" />
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Search any city in the world..."
              disabled={isSearching || isLocating}
              className="w-full bg-black/20 text-white placeholder-white/60 border border-white/20 rounded-2xl py-3 pl-10 pr-10 text-sm outline-none focus:bg-black/40 focus:border-white/40 transition-all disabled:opacity-50 shadow-inner"
            />
            {isSearching && (
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                <Loader2 className="w-4 h-4 text-white/80 animate-spin" />
              </div>
            )}
          </div>
          
          <div className="flex flex-col gap-2 shrink-0">
            <button 
              onClick={() => setIsAIModalOpen(true)}
              title="Ask AI Travel Assistant"
              className="bg-indigo-500/20 hover:bg-indigo-500/40 text-white p-3 rounded-2xl border border-indigo-300/30 transition-all duration-300 flex items-center justify-center hover:shadow-lg"
            >
              <Sparkles className="w-5 h-5 text-indigo-200" />
            </button>
            <button 
              onClick={handleGPSLocation}
              disabled={isLocating || isSearching}
              title="Find attractions near my current location"
              className="bg-orange-500/20 hover:bg-orange-500/40 text-white p-3 rounded-2xl border border-orange-300/30 transition-all duration-300 disabled:opacity-50 flex items-center justify-center hover:shadow-lg"
            >
              {isLocating ? <Loader2 className="w-5 h-5 animate-spin text-white" /> : <LocateFixed className="w-5 h-5 text-white" />}
            </button>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="relative z-10 mt-5 flex bg-black/20 p-1.5 rounded-2xl backdrop-blur-md border border-white/5">
          <button
            onClick={() => setViewMode('list')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-xl transition-all duration-300 ${
              viewMode === 'list' ? 'bg-white text-orange-900 shadow-lg scale-[1.02]' : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <List className="w-4 h-4" /> List View
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-xl transition-all duration-300 ${
              viewMode === 'map' ? 'bg-white text-orange-900 shadow-lg scale-[1.02]' : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <MapIcon className="w-4 h-4" /> Map View
          </button>
        </div>
      </div>

      {/* Category Filter Bar */}
      <div className="flex gap-2.5 p-4 overflow-x-auto no-scrollbar bg-[#FFF9F5]/80 backdrop-blur-md border-b border-orange-200/50 shrink-0">
        {categoriesList.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 text-sm font-semibold rounded-full whitespace-nowrap transition-all duration-300 border ${
              activeCategory === cat
                ? 'bg-orange-600 text-white border-orange-600 shadow-md shadow-orange-600/20'
                : 'bg-white text-stone-600 border-stone-200 hover:bg-[#FFF4EC] hover:border-orange-300 hover:text-orange-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Content Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 relative bg-[#FFF4EC]/80">
        {loading ? (
          <SkeletonLoader />
        ) : error || filteredPlaces.length === 0 ? (
          <EmptyState onReset={() => setActiveCategory('All')} />
        ) : viewMode === 'list' ? (
          <div className="space-y-4">
            {filteredPlaces.map((place, idx) => (
              <AttractionCard
                key={place.properties?.place_id || idx} 
                place={place}
                isSaved={savedTrips.some(
                  (t) => (t.properties?.place_id || t.properties?.name) === (place.properties?.place_id || place.properties?.name) 
                )}
                onSave={() => toggleSaveTrip(place)}
                onHover={(isHovered) => 
                  setHoveredPlaceId(isHovered ? (place.properties?.place_id || idx) : null) 
                }
              />
            ))}
          </div>
        ) : (
          <div className="h-full rounded-2xl overflow-hidden border border-stone-200">
            <MapView 
              places={filteredPlaces} 
              center={[lat, lon]} 
              hoveredPlaceId={hoveredPlaceId}
              isUsingGPS={isUsingGPS}
              onMapMove={handleMapMove}
            />
          </div>
        )}
      </div>

      {/* Itinerary / Trip Planner Drawer */}
      {savedTrips.length > 0 && (
        <div className="bg-[#FFF9F5]/95 backdrop-blur-lg border-t border-orange-200/50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] shrink-0 rounded-b-[2rem]">
          <button
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            className="w-full px-5 py-4 flex items-center justify-between text-sm font-bold text-orange-950 bg-orange-50/50 hover:bg-orange-100/50 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Bookmark className="w-5 h-5 text-orange-600 fill-orange-600" />
              <span>Saved to Trip Itinerary ({savedTrips.length})</span>
            </div>
            {isDrawerOpen ? <ChevronDown className="w-5 h-5 text-orange-600" /> : <ChevronUp className="w-5 h-5 text-orange-600" />}
          </button>

          {isDrawerOpen && (
            <div className="p-4 max-h-48 overflow-y-auto space-y-2.5 bg-[#FFF4EC]/80 border-t border-orange-100">
              {savedTrips.map((item, i) => (
                <div key={i} className="flex items-center justify-between bg-white p-3 rounded-2xl text-sm border border-orange-200/60 shadow-sm transition-hover hover:border-orange-300 hover:shadow-md">
                  <span className="font-semibold text-stone-700 truncate pr-3 flex-1">
                    {item.properties?.name} 
                  </span>
                  <button 
                    onClick={() => toggleSaveTrip(item)}
                    className="text-rose-500 font-bold hover:text-rose-600 hover:bg-rose-50 px-2 py-1 rounded-lg transition-colors shrink-0"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* AI Travel Assistant Modal */}
      <AIAssistantModal 
        isOpen={isAIModalOpen} 
        onClose={() => setIsAIModalOpen(false)} 
        locationName={locationName} 
      />
    </div>
  );
}
