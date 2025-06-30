import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Business } from "@shared/schema";
import { Button } from "@/components/ui/button";
import StarRating from "@/components/star-rating";
import { Phone, Globe, MapPin, Clock, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";

interface BusinessCardProps {
  business: Business;
  onClick: () => void;
  isSelected?: boolean;
}

export default function BusinessCard({ business, onClick, isSelected }: BusinessCardProps) {
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Fetch recent reviews for this business
  const { data: reviews = [] } = useQuery({
    queryKey: ['/api/businesses', business.id, 'reviews'],
    queryFn: async () => {
      const response = await fetch(`/api/businesses/${business.id}/reviews`);
      if (!response.ok) throw new Error('Failed to fetch reviews');
      return response.json();
    },
  });

  const recentReview = reviews[0];

  const handleGetDirections = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Detect device and launch appropriate maps app
    const coords = `${business.latitude},${business.longitude}`;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    
    let mapsUrl: string;
    
    if (isIOS) {
      // Use Apple Maps on iOS
      mapsUrl = `maps://maps.apple.com/maps?daddr=${coords}&dirflg=d`;
    } else if (isAndroid) {
      // Use Google Maps on Android
      mapsUrl = `google.navigation:q=${coords}`;
    } else {
      // Use Google Maps web on desktop
      mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coords}`;
    }
    
    // Try to open the native app, fallback to web
    try {
      window.open(mapsUrl, '_blank');
    } catch (error) {
      // Fallback to Google Maps web
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${coords}`, '_blank');
    }
  };

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (business.phone) {
      window.location.href = `tel:${business.phone}`;
    }
  };

  const handleWebsite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (business.website) {
      window.open(business.website, '_blank');
    }
  };

  const getCurrentDay = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
  };

  const getCurrentHours = () => {
    if (!business.hours) return null;
    const today = getCurrentDay();
    return business.hours[today] || null;
  };

  const truncatedDescription = business.description.length > 120 
    ? business.description.substring(0, 120) + "..."
    : business.description;

  return (
    <div 
      className={cn(
        "group cursor-pointer transition-all duration-300 hover:bg-muted/50",
        isSelected && "bg-primary/5 border-l-4 border-l-primary"
      )}
      onClick={onClick}
    >
      <div className="p-6">
        {/* Business Image */}
        {business.imageUrl && (
          <div className="mb-4 overflow-hidden rounded-xl">
            <img
              src={business.imageUrl}
              alt={business.name}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        )}

        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-foreground mb-1 truncate">
                {business.name}
              </h3>
              <div className="flex items-center space-x-2 mb-2">
                <span className="inline-block px-2 py-1 bg-secondary text-secondary-foreground text-xs font-medium rounded-md">
                  {business.category}
                </span>
                <div className="flex items-center space-x-1">
                  <StarRating rating={business.rating || 0} size="sm" />
                  <span className="text-sm text-muted-foreground">{business.rating?.toFixed(1) || '—'}</span>
                  <span className="text-xs text-muted-foreground">({business.reviewCount || 0})</span>
                </div>
              </div>
            </div>
            <div className="ml-3 flex-shrink-0">
              <span className={cn(
                "inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full",
                business.isOpen
                  ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                  : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
              )}>
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full mr-1.5",
                  business.isOpen ? "bg-green-500" : "bg-red-500"
                )} />
                {business.isOpen ? "Open" : "Closed"}
              </span>
            </div>
          </div>
          
          {/* Description */}
          <div className="mb-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {showFullDescription ? business.description : truncatedDescription}
            </p>
            {business.description.length > 120 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFullDescription(!showFullDescription);
                }}
                className="text-primary text-xs hover:underline mt-1"
              >
                {showFullDescription ? "Show less" : "Show more"}
              </button>
            )}
          </div>
          
          {/* Contact Information */}
          <div className="space-y-2 mb-4">
            {business.address && (
              <div className="flex items-start space-x-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span className="leading-5">{business.address}</span>
              </div>
            )}
            {business.phone && (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>{business.phone}</span>
              </div>
            )}
            {getCurrentHours() && (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span>{getCurrentHours()}</span>
              </div>
            )}
          </div>

          {/* Recent Review */}
          {recentReview && (
            <div className="bg-muted/50 rounded-lg p-3 mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex-shrink-0 flex items-center justify-center">
                  <span className="text-xs font-medium text-primary">
                    {recentReview.author[0]}
                  </span>
                </div>
                <span className="text-sm font-medium text-foreground">{recentReview.author}</span>
                <StarRating rating={recentReview.rating} size="xs" />
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{recentReview.text}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button
              onClick={handleGetDirections}
              className="flex-1 h-9"
              size="sm"
            >
              <Navigation className="w-4 h-4 mr-2" />
              Directions
            </Button>
            {business.phone && (
              <Button
                onClick={handleCall}
                variant="outline"
                size="sm"
                className="h-9 w-9 p-0"
              >
                <Phone className="w-4 h-4" />
              </Button>
            )}
            {business.website && (
              <Button
                onClick={handleWebsite}
                variant="outline"
                size="sm"
                className="h-9 w-9 p-0"
              >
                <Globe className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}