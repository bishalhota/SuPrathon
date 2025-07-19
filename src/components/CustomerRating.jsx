import React from 'react';
import { Star } from 'lucide-react';

export const CustomerRating = ({ 
  rating, 
  reviewCount = 0,
  size = 'md', 
  showNumber = true,
  showReviewCount = true 
}) => {
  const clampedRating = Math.max(0, Math.min(5, rating));
  
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'w-3 h-3';
      case 'lg': return 'w-6 h-6';
      default: return 'w-4 h-4';
    }
  };

  const getStarColor = (starIndex) => {
    const fillLevel = clampedRating - starIndex;
    
    if (fillLevel <= 0) {
      return 'text-gray-300';
    } else if (fillLevel >= 1) {
      return 'text-yellow-400';
    } else {
      return 'text-yellow-400';
    }
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`${getSizeClasses()} ${getStarColor(index)} ${
              clampedRating > index ? 'fill-current' : ''
            }`}
          />
        ))}
      </div>
      {showNumber && (
        <span className="text-sm font-medium text-gray-700">
          {clampedRating.toFixed(1)}
        </span>
      )}
      {showReviewCount && reviewCount > 0 && (
        <span className="text-xs text-gray-500">
          ({reviewCount.toLocaleString()})
        </span>
      )}
    </div>
  );
};