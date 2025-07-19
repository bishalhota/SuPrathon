import React from 'react';
import { Leaf } from 'lucide-react';

export const CarbonRating = ({ 
  rating, 
  size = 'md', 
  showNumber = true 
}) => {
  const clampedRating = Math.max(0, Math.min(5, rating));
  
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'w-3 h-3';
      case 'lg': return 'w-6 h-6';
      default: return 'w-4 h-4';
    }
  };

  const getLeafColor = (leafIndex) => {
    const fillLevel = clampedRating - leafIndex;
    
    if (fillLevel <= 0) {
      // Empty leaf - red for low eco-friendliness
      return 'text-red-400';
    } else if (fillLevel >= 1) {
      // Full leaf - gradient from red to green based on rating
      const greenIntensity = Math.min(clampedRating / 5, 1);
      if (greenIntensity < 0.4) return 'text-red-500';
      if (greenIntensity < 0.6) return 'text-orange-500';
      if (greenIntensity < 0.8) return 'text-yellow-500';
      return 'text-green-500';
    } else {
      // Partial leaf
      const greenIntensity = Math.min(clampedRating / 5, 1);
      if (greenIntensity < 0.4) return 'text-red-500';
      if (greenIntensity < 0.6) return 'text-orange-500';
      if (greenIntensity < 0.8) return 'text-yellow-500';
      return 'text-green-500';
    }
  };

  const getRatingColor = () => {
    const greenIntensity = Math.min(clampedRating / 5, 1);
    if (greenIntensity < 0.4) return 'text-red-600';
    if (greenIntensity < 0.6) return 'text-orange-600';
    if (greenIntensity < 0.8) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getEcoLabel = () => {
    if (clampedRating < 3.0) return 'Low Eco';
    if (clampedRating < 4.0) return 'Moderate';
    return 'Eco-Friendly';
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[...Array(5)].map((_, index) => (
          <Leaf
            key={index}
            className={`${getSizeClasses()} ${getLeafColor(index)} ${
              clampedRating > index ? 'fill-current' : ''
            }`}
          />
        ))}
      </div>
      {showNumber && (
        <div className="flex items-center space-x-1">
          <span className={`text-sm font-medium ${getRatingColor()}`}>
            {clampedRating.toFixed(1)}
          </span>
          <span className={`text-xs ${getRatingColor()}`}>
            {getEcoLabel()}
          </span>
        </div>
      )}
    </div>
  );
};