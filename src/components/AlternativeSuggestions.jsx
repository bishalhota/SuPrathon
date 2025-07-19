import React, { useState, useEffect } from 'react';
import { X, Leaf, ArrowRight, Star } from 'lucide-react';
import { CarbonRating } from './CarbonRating';
import { CustomerRating } from './CustomerRating';
import { useCart } from '../contexts/CartContext';
import { getProducts } from '../lib/database';

export const AlternativeSuggestions = ({ 
  product, 
  isOpen, 
  onClose, 
  onAddAlternative 
}) => {
  const [alternatives, setAlternatives] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  // Mock alternatives for fallback
  const mockAlternatives = {
    'Beauty': [
      {
        id: 'alt-beauty-1',
        name: 'Premium Organic Skincare Set',
        description: 'Advanced organic skincare with certified sustainable ingredients',
        price: 94.99,
        image_url: 'https://images.pexels.com/photos/4465831/pexels-photo-4465831.jpeg?auto=compress&cs=tinysrgb&w=500',
        category: 'Beauty',
        carbon_rating: 4.8,
        stock_quantity: 20
      },
      {
        id: 'alt-beauty-2',
        name: 'Zero-Waste Beauty Bundle',
        description: 'Complete zero-waste beauty routine with refillable containers',
        price: 79.99,
        image_url: 'https://images.pexels.com/photos/6621337/pexels-photo-6621337.jpeg?auto=compress&cs=tinysrgb&w=500',
        category: 'Beauty',
        carbon_rating: 4.9,
        stock_quantity: 15
      }
    ],
    'Electronics': [
      {
        id: 'alt-electronics-1',
        name: 'Solar LED Smart Bulb Pro',
        description: 'Advanced LED bulb with solar charging capability',
        price: 34.99,
        image_url: 'https://images.pexels.com/photos/159397/solar-panel-array-power-sun-electricity-159397.jpeg?auto=compress&cs=tinysrgb&w=500',
        category: 'Electronics',
        carbon_rating: 4.6,
        stock_quantity: 25
      },
      {
        id: 'alt-electronics-2',
        name: 'Eco-Friendly Wireless Charger',
        description: 'Bamboo wireless charger with energy-efficient technology',
        price: 44.99,
        image_url: 'https://images.pexels.com/photos/4210614/pexels-photo-4210614.jpeg?auto=compress&cs=tinysrgb&w=500',
        category: 'Electronics',
        carbon_rating: 4.4,
        stock_quantity: 30
      }
    ],
    'Kitchen': [
      {
        id: 'alt-kitchen-1',
        name: 'Premium Glass Container Set',
        description: 'High-quality borosilicate glass containers with bamboo lids',
        price: 42.99,
        image_url: 'https://images.pexels.com/photos/6489663/pexels-photo-6489663.jpeg?auto=compress&cs=tinysrgb&w=500',
        category: 'Kitchen',
        carbon_rating: 4.7,
        stock_quantity: 35
      }
    ],
    'Office': [
      {
        id: 'alt-office-1',
        name: 'Solar-Powered Calculator Pro',
        description: 'Advanced solar calculator with recycled materials and long battery life',
        price: 28.99,
        image_url: 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=500',
        category: 'Office',
        carbon_rating: 4.5,
        stock_quantity: 20
      }
    ]
  };

  useEffect(() => {
    if (isOpen && product && product.carbon_rating < 4.0) {
      fetchAlternatives();
    }
  }, [isOpen, product]);

  const fetchAlternatives = async () => {
    try {
      setLoading(true);
      
      // Try to fetch from database
      try {
        const allProducts = await getProducts({
          category: product.category
        });
        
        const betterAlternatives = allProducts
          .filter(p => 
            p.id !== product.id && 
            p.carbon_rating > product.carbon_rating &&
            p.carbon_rating >= 4.0
          )
          .sort((a, b) => b.carbon_rating - a.carbon_rating)
          .slice(0, 3);
        
        setAlternatives(betterAlternatives);
      } catch (error) {
        // Fallback to mock data
        console.log('Using mock alternatives - Supabase not connected');
        const categoryAlternatives = mockAlternatives[product.category] || [];
        const betterAlternatives = categoryAlternatives
          .filter(p => p.carbon_rating > product.carbon_rating)
          .slice(0, 3);
        
        setAlternatives(betterAlternatives);
      }
    } catch (error) {
      console.error('Error fetching alternatives:', error);
      setAlternatives([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAlternative = (alternative) => {
    // Add the alternative to cart (original product is already in cart)
    addToCart(alternative);
    
    if (onAddAlternative) {
      onAddAlternative(alternative);
    }
    
    // Don't close immediately, show success message
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const carbonImprovementPercentage = alternatives.length > 0 
    ? Math.round(((alternatives[0].carbon_rating - product.carbon_rating) / 5) * 100)
    : 0;

  if (!isOpen || !product || product.carbon_rating >= 4.0) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-green-50 to-emerald-50">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-2 rounded-full">
                <Leaf className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-green-800">
                  Consider These Eco-Friendly Alternatives
                </h2>
                <p className="text-green-600 text-sm">
                  Better for the planet, better for you
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-green-100 rounded-full">
              <X className="w-5 h-5 text-green-600" />
            </button>
          </div>

          <div className="p-6">
            {/* Current Product Info */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-4">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
                  <div className="flex items-center space-x-3 mb-2">
                    <CarbonRating rating={product.carbon_rating} size="sm" />
                    <span className="text-orange-600 text-sm font-medium">
                      Lower carbon efficiency
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Carbon Footprint</div>
                      <CarbonRating rating={product.carbon_rating} size="sm" />
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">
                    This product has a carbon rating of {product.carbon_rating}/5.0
                  </p>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            ) : alternatives.length > 0 ? (
              <>
                {/* Impact Message */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <Star className="w-5 h-5 text-green-600" />
                    <span className="text-green-800 font-medium">
                      Environmental Impact
                    </span>
                  </div>
                  <p className="text-green-700 text-sm">
                    Choosing a higher-rated alternative could improve your carbon footprint by up to{' '}
                    <span className="font-semibold">{carbonImprovementPercentage}%</span> for this purchase.
                  </p>
                </div>

                {/* Alternatives */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Recommended Eco-Friendly Alternatives:
                  </h3>
                  
                  {alternatives.map((alternative, index) => (
                    <div key={alternative.id} className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors">
                      <div className="flex items-start space-x-4">
                        <img
                          src={alternative.image_url}
                          alt={alternative.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-gray-900">{alternative.name}</h4>
                            {index === 0 && (
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                                Best Choice
                              </span>
                            )}
                          </div>
                          
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {alternative.description}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <div>
                                <div className="text-xs text-gray-500 mb-1">Carbon Footprint</div>
                                <CarbonRating rating={alternative.carbon_rating} size="sm" />
                              </div>
                              <div>
                                <div className="text-xs text-gray-500 mb-1">Customer Reviews</div>
                                <CustomerRating 
                                  rating={Math.min(5, Math.max(3.5, alternative.carbon_rating + (Math.random() * 1.5 - 0.5)))} 
                                  reviewCount={Math.floor(Math.random() * 300) + 50}
                                  size="sm"
                                />
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-lg font-bold text-gray-900">
                                  ₹{alternative.price.toFixed(2)}
                                </span>
                                <div className="flex items-center space-x-1 text-green-600 text-sm">
                                  <ArrowRight className="w-3 h-3" />
                                  <span>Eco-Friendly Choice</span>
                                </div>
                              </div>
                            </div>
                            
                            <button
                              onClick={() => handleAddAlternative(alternative)}
                              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                            >
                              <span>Choose This</span>
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Improvement Indicator */}
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Carbon Rating Improvement:</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-orange-600">
                              {product.carbon_rating.toFixed(1)}
                            </span>
                            <ArrowRight className="w-3 h-3 text-gray-400" />
                            <span className="text-green-600 font-medium">
                              {alternative.carbon_rating.toFixed(1)}
                            </span>
                            <span className="text-green-600 text-xs bg-green-100 px-2 py-1 rounded-full">
                              +{((alternative.carbon_rating - product.carbon_rating) / 5 * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Continue with Original */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-700 font-medium">
                        Prefer to stick with your original choice?
                      </p>
                      <p className="text-gray-500 text-sm">
                        No problem! Your item is already in the cart.
                      </p>
                    </div>
                    <button
                      onClick={onClose}
                      className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Continue with Original
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <Leaf className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">No alternatives found</p>
                <p className="text-gray-400 text-sm">
                  We couldn't find better eco-friendly alternatives in this category right now.
                </p>
                <button
                  onClick={onClose}
                  className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Continue with Original
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

