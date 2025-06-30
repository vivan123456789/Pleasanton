import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "xs" | "sm" | "md" | "lg";
  showValue?: boolean;
}

export default function StarRating({ 
  rating, 
  maxRating = 5, 
  size = "sm", 
  showValue = false 
}: StarRatingProps) {
  const stars = [];
  
  const sizeClasses = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };

  for (let i = 1; i <= maxRating; i++) {
    const isFull = i <= Math.floor(rating);
    const isHalf = i === Math.ceil(rating) && rating % 1 !== 0;
    
    stars.push(
      <div key={i} className="relative">
        <Star
          className={cn(
            sizeClasses[size],
            isFull ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"
          )}
        />
        {isHalf && (
          <div className="absolute inset-0 overflow-hidden" style={{ width: `${(rating % 1) * 100}%` }}>
            <Star
              className={cn(
                sizeClasses[size],
                "fill-yellow-400 text-yellow-400"
              )}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-1">
      <div className="flex space-x-0.5">
        {stars}
      </div>
      {showValue && (
        <span className="text-sm text-gray-600 ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
