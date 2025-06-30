import { useState } from "react";
import { Business } from "@shared/schema";
import StarRating from "@/components/star-rating";
import { Button } from "@/components/ui/button";
import { Navigation, Phone, Globe, MapPin, ZoomIn, ZoomOut, Maximize } from "lucide-react";
import { cn } from "@/lib/utils";

// Category icons and colors
const getCategoryIcon = (category: string): string => {
  const icons: Record<string, string> = {
    "Restaurants": "🍽️",
    "Cafés": "☕",
    "Shopping": "🛍️",
    "Attractions": "🎭",
    "Dessert": "🍦",
  };
  return icons[category] || "📍";
};

const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    "Restaurants": "#ef4444",
    "Cafés": "#f97316", 
    "Shopping": "#8b5cf6",
    "Attractions": "#10b981",
    "Dessert": "#ec4899",
  };
  return colors[category] || "#3b82f6";
};

interface InteractiveMapProps {
  businesses: Business[];
  selectedBusiness: Business | null;
  onBusinessSelect: (business: Business) => void;
}

export default function InteractiveMap({ 
  businesses, 
  selectedBusiness, 
  onBusinessSelect 
}: InteractiveMapProps) {
  const [selectedMarker, setSelectedMarker] = useState<Business | null>(null);

  const handleGetDirections = (business: Business, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const coords = `${business.latitude},${business.longitude}`;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    
    let mapsUrl: string;
    
    if (isIOS) {
      mapsUrl = `maps://maps.apple.com/maps?daddr=${coords}&dirflg=d`;
    } else if (isAndroid) {
      mapsUrl = `google.navigation:q=${coords}`;
    } else {
      mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coords}`;
    }
    
    try {
      window.open(mapsUrl, '_blank');
    } catch (error) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${coords}`, '_blank');
    }
  };

  const handleCall = (business: Business, e: React.MouseEvent) => {
    e.stopPropagation();
    if (business.phone) {
      window.location.href = `tel:${business.phone}`;
    }
  };

  const handleMarkerClick = (business: Business) => {
    setSelectedMarker(selectedMarker?.id === business.id ? null : business);
    onBusinessSelect(business);
  };

  const handleOpenGoogleMaps = () => {
    const center = businesses.length > 0 
      ? `${businesses[0].latitude},${businesses[0].longitude}`
      : '37.6619,-121.8752';
    window.open(`https://www.google.com/maps/@${center},15z`, '_blank');
  };

  // Calculate bounds for businesses
  const bounds = businesses.reduce(
    (acc, business) => ({
      minLat: Math.min(acc.minLat, business.latitude),
      maxLat: Math.max(acc.maxLat, business.latitude),
      minLng: Math.min(acc.minLng, business.longitude),
      maxLng: Math.max(acc.maxLng, business.longitude),
    }),
    {
      minLat: Infinity,
      maxLat: -Infinity,
      minLng: Infinity,
      maxLng: -Infinity,
    }
  );

  // Convert lat/lng to relative positions within the map container
  const getMarkerPosition = (business: Business) => {
    if (businesses.length === 0) return { x: 50, y: 50 };
    
    // Use Pleasanton downtown center as reference
    const centerLat = 37.6619;
    const centerLng = -121.8752;
    
    // Calculate relative position from center with proper scaling
    const latOffset = (business.latitude - centerLat) * 1000; // Scale up for visibility
    const lngOffset = (business.longitude - centerLng) * 1000;
    
    // Convert to percentages with center at 50%, 50%
    const x = Math.max(10, Math.min(90, 50 + lngOffset * 20)); // Constrain to 10-90%
    const y = Math.max(10, Math.min(90, 50 - latOffset * 20)); // Inverted Y, constrain to 10-90%
    
    return { x, y };
  };

  return (
    <div className="h-full w-full relative bg-green-100 dark:bg-green-950/20">
      {/* Map Background - Pleasanton Downtown Style */}
      <div className="absolute inset-0">
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            {/* Street grid pattern */}
            <pattern id="streetGrid" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
              <rect width="120" height="120" fill="#f0f9ff" className="dark:fill-gray-900"/>
              {/* Main streets */}
              <rect x="55" y="0" width="10" height="120" fill="#e2e8f0" className="dark:fill-gray-700"/>
              <rect x="0" y="55" width="120" height="10" fill="#e2e8f0" className="dark:fill-gray-700"/>
              {/* Side streets */}
              <rect x="20" y="0" width="4" height="120" fill="#f1f5f9" className="dark:fill-gray-800"/>
              <rect x="96" y="0" width="4" height="120" fill="#f1f5f9" className="dark:fill-gray-800"/>
              <rect x="0" y="20" width="120" height="4" fill="#f1f5f9" className="dark:fill-gray-800"/>
              <rect x="0" y="96" width="120" height="4" fill="#f1f5f9" className="dark:fill-gray-800"/>
            </pattern>
            
            {/* Parks/green spaces */}
            <pattern id="parkPattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <rect width="60" height="60" fill="#dcfce7" className="dark:fill-green-950/30"/>
              <circle cx="30" cy="30" r="15" fill="#bbf7d0" className="dark:fill-green-900/50"/>
            </pattern>
          </defs>
          
          {/* Base map */}
          <rect width="100%" height="100%" fill="url(#streetGrid)"/>
          
          {/* Green spaces */}
          <rect x="10%" y="15%" width="25%" height="20%" fill="url(#parkPattern)" rx="8"/>
          <rect x="70%" y="60%" width="20%" height="25%" fill="url(#parkPattern)" rx="8"/>
          
          {/* Main Street representation */}
          <rect x="0" y="48%" width="100%" height="4%" fill="#cbd5e1" className="dark:fill-gray-600"/>
          <text x="50%" y="52%" textAnchor="middle" className="text-xs fill-gray-600 dark:fill-gray-400" fontSize="10">
            Main Street
          </text>
        </svg>
      </div>

      {/* Pleasanton Downtown Label */}
      <div className="absolute top-4 left-4 bg-background/95 backdrop-blur-sm border rounded-xl shadow-lg px-4 py-3 z-10">
        <div className="flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-primary" />
          <div>
            <h3 className="font-semibold text-foreground">Pleasanton Downtown</h3>
            <p className="text-xs text-muted-foreground">{businesses.length} businesses</p>
          </div>
        </div>
      </div>

      {/* Map Instructions */}
      {businesses.length > 0 && !selectedMarker && (
        <div className="absolute top-4 right-4 bg-background/95 backdrop-blur-sm border rounded-xl shadow-lg px-4 py-3 z-10 max-w-xs">
          <p className="text-xs text-muted-foreground">
            Click on markers to view business details
          </p>
        </div>
      )}

      {/* Business Markers */}
      {businesses.map((business) => {
        const position = getMarkerPosition(business);
        const isSelected = selectedBusiness?.id === business.id;
        const isPopupOpen = selectedMarker?.id === business.id;
        
        return (
          <div key={business.id} className="absolute" style={{ 
            left: `${position.x}%`, 
            top: `${position.y}%`,
            transform: 'translate(-50%, -100%)',
            zIndex: isSelected ? 30 : 20
          }}>
            {/* Marker */}
            <button
              onClick={() => handleMarkerClick(business)}
              className={cn(
                "w-12 h-12 rounded-full border-4 border-white dark:border-gray-800 shadow-xl transition-all duration-300 flex items-center justify-center text-white font-bold text-lg hover:scale-110 relative",
                isSelected ? "scale-125 ring-4 ring-primary/50 ring-offset-2" : "hover:scale-110"
              )}
              style={{ backgroundColor: getCategoryColor(business.category) }}
            >
              {/* Pulsing animation for selected */}
              {isSelected && (
                <div className="absolute inset-0 rounded-full animate-ping bg-primary/20"></div>
              )}
              <span className="relative z-10">{getCategoryIcon(business.category)}</span>
            </button>

            {/* Popup */}
            {isPopupOpen && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-80 bg-white rounded-xl shadow-xl border p-4 z-40">
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                  <div className="w-3 h-3 bg-white border-r border-b transform rotate-45"></div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-gray-900 text-lg mb-1">
                      {business.name}
                    </h4>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                        {business.category}
                      </span>
                      <div className="flex items-center space-x-1">
                        <StarRating rating={business.rating || 0} size="sm" />
                        <span className="text-sm text-gray-600">
                          {business.rating?.toFixed(1) || 'No rating'} ({business.reviewCount || 0})
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {business.description}
                    </p>
                  </div>
                  
                  {/* Contact Info */}
                  <div className="space-y-2 text-sm">
                    {business.address && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{business.address}</span>
                      </div>
                    )}
                    {business.phone && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{business.phone}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <Button
                      size="sm"
                      onClick={(e) => handleGetDirections(business, e)}
                      className="flex-1 bg-primary text-white hover:bg-blue-700"
                    >
                      <Navigation className="w-4 h-4 mr-1" />
                      Directions
                    </Button>
                    {business.phone && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => handleCall(business, e)}
                      >
                        <Phone className="w-4 h-4 mr-1" />
                        Call
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Map Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col space-y-2 z-30">
        <Button
          size="icon"
          variant="secondary"
          className="bg-white shadow-lg hover:bg-gray-50"
          onClick={handleOpenGoogleMaps}
          title="Open in Google Maps"
        >
          <Maximize className="w-4 h-4" />
        </Button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 z-10">
        <h4 className="font-semibold text-sm text-gray-900 mb-2">Categories</h4>
        <div className="space-y-1">
          {Array.from(new Set(businesses.map(b => b.category))).map(category => (
            <div key={category} className="flex items-center space-x-2 text-xs">
              <div 
                className="w-4 h-4 rounded-full flex items-center justify-center text-white text-xs"
                style={{ backgroundColor: getCategoryColor(category) }}
              >
                {getCategoryIcon(category)}
              </div>
              <span className="text-gray-600">{category}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {businesses.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">No businesses to show on map</p>
          </div>
        </div>
      )}
    </div>
  );
}