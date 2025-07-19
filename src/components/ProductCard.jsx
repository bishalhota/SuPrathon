import React from 'react';
import { ShoppingCart, Plus, Truck, AlertTriangle, AlertCircle } from 'lucide-react';
import { CarbonRating } from './CarbonRating';
import { CustomerRating } from './CustomerRating';
import { useCart } from '../contexts/CartContext';
import { AlternativeSuggestions } from './AlternativeSuggestions';

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [showAlternatives, setShowAlternatives] = React.useState(false);
  
  // Generate mock customer rating and review count for demo
  const customerRating = Math.min(5, Math.max(3.5, product.carbon_rating + (Math.random() * 1.5 - 0.5)));
  const reviewCount = Math.floor(Math.random() * 500) + 50;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
    
    // Show alternatives if product has low carbon rating
    if (product.carbon_rating < 4.0) {
      setShowAlternatives(true);
    }
  };

  const handleAlternativeAdded = (alternative) => {
    // Alternative was added to cart, close modal
    setShowAlternatives(false);
  };

  // Get carbon rating color and urgency
  const getCarbonRatingInfo = (rating) => {
    if (rating < 3.0) {
      return {
        color: 'red',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        textColor: 'text-red-700',
        icon: AlertTriangle,
        urgency: 'High Impact',
        message: 'Consider offsetting'
      };
    } else if (rating < 4.0) {
      return {
        color: 'yellow',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        textColor: 'text-yellow-700',
        icon: AlertCircle,
        urgency: 'Moderate Impact',
        message: 'Offset recommended'
      };
    } else {
      return {
        color: 'green',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        textColor: 'text-green-700',
        icon: null,
        urgency: 'Low Impact',
        message: 'Eco-friendly choice'
      };
    }
  };

  const carbonInfo = getCarbonRatingInfo(product.carbon_rating);
  const IconComponent = carbonInfo.icon;

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 group overflow-hidden">
        {/* Image */}
        <div className="relative overflow-hidden">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3">
            <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
              <CarbonRating rating={product.carbon_rating} size="sm" showNumber={false} />
            </div>
          </div>
          {product.stock_quantity < 10 && (
            <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
              Low Stock
            </div>
          )}
          
          {/* Carbon Impact Badge */}
          {product.carbon_rating < 4.0 && (
            <div className={`absolute bottom-3 left-3 ${carbonInfo.bgColor} ${carbonInfo.borderColor} border px-2 py-1 rounded-full flex items-center space-x-1`}>
              {IconComponent && <IconComponent className={`w-3 h-3 ${carbonInfo.textColor}`} />}
              <span className={`text-xs font-medium ${carbonInfo.textColor}`}>
                {carbonInfo.urgency}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="mb-2">
            <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-green-600 transition-colors">
              {product.name}
            </h3>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {product.description}
            </p>
          </div>

          {/* Carbon Rating (Eco-Friendliness) */}
          <div className="mb-3">
            <div className="mb-2">
              <div className="text-xs text-gray-500 mb-1">Carbon Footprint</div>
              <CarbonRating rating={product.carbon_rating} />
            </div>
            
            {/* Customer Rating */}
            <div className="mb-2">
              <div className="text-xs text-gray-500 mb-1">Customer Reviews</div>
              <CustomerRating 
                rating={customerRating} 
                reviewCount={reviewCount}
                size="sm"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {product.category}
              </span>
            </div>
            
            {/* CO2 Emission Info */}
            <div className="flex items-center space-x-2 mt-2">
              <Truck className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-500">
                {product.co2_emission_grams || (product.weight_grams || 150) * 0.1}g CO₂ shipping
              </span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-500">
                {product.weight_grams || 150}g
              </span>
            </div>
            
            {/* Carbon Impact Message */}
            <div className={`mt-2 p-2 rounded-lg ${carbonInfo.bgColor} ${carbonInfo.borderColor} border`}>
              <div className="flex items-center space-x-2">
                {IconComponent && <IconComponent className={`w-3 h-3 ${carbonInfo.textColor}`} />}
                <span className={`text-xs font-medium ${carbonInfo.textColor}`}>
                  {carbonInfo.message}
                </span>
              </div>
            </div>
          </div>

          {/* Price and Action */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-gray-900">
                ₹{product.price.toFixed(2)}
              </span>
            </div>
            <button
              onClick={handleAddToCart}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add</span>
            </button>
          </div>
        </div>
      </div>
      
      <AlternativeSuggestions
        product={product}
        isOpen={showAlternatives}
        onClose={() => setShowAlternatives(false)}
        onAddAlternative={handleAlternativeAdded}
      />
    </>
  );
};