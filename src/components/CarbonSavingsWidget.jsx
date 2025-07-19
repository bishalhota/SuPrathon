import React, { useState, useEffect } from 'react';
import { Leaf, ChevronDown, ChevronUp, TrendingUp, Award, Calendar, Package } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { getUserCarbonSavings } from '../lib/database';

export const CarbonSavingsWidget = () => {
  const { user } = useUser();
  const [isExpanded, setIsExpanded] = useState(false);
  const [savings, setSavings] = useState([]);
  const [totalSaved, setTotalSaved] = useState(1247.5); // Demo data
  const [loading, setLoading] = useState(false);

  // Mock data for fallback
  const mockSavings = [
    {
      id: '1',
      carbon_saved_grams: 45.2,
      product_carbon_rating: 4.8,
      quantity: 1,
      created_at: '2024-01-15T10:30:00Z',
      products: {
        name: 'Organic Cotton T-Shirt',
        image_url: 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=500'
      }
    },
    {
      id: '2',
      carbon_saved_grams: 67.8,
      product_carbon_rating: 5.0,
      quantity: 2,
      created_at: '2024-01-12T14:20:00Z',
      products: {
        name: 'Bamboo Water Bottle',
        image_url: 'https://images.pexels.com/photos/4210614/pexels-photo-4210614.jpeg?auto=compress&cs=tinysrgb&w=500'
      }
    },
    {
      id: '3',
      carbon_saved_grams: 23.5,
      product_carbon_rating: 4.6,
      quantity: 1,
      created_at: '2024-01-10T09:15:00Z',
      products: {
        name: 'Recycled Notebook',
        image_url: 'https://images.pexels.com/photos/261763/pexels-photo-261763.jpeg?auto=compress&cs=tinysrgb&w=500'
      }
    }
  ];

  useEffect(() => {
    if (isExpanded && user) {
      fetchCarbonSavings();
    }
  }, [isExpanded, user]);

  const fetchCarbonSavings = async () => {
    try {
      setLoading(true);
      const data = await getUserCarbonSavings(user.id);
      setSavings(data);
      
      const total = data.reduce((sum, saving) => sum + parseFloat(saving.carbon_saved_grams), 0);
      setTotalSaved(total);
    } catch (error) {
      console.log('Using mock carbon savings data');
      setSavings(mockSavings);
      
      const total = mockSavings.reduce((sum, saving) => sum + parseFloat(saving.carbon_saved_grams), 0);
      setTotalSaved(total);
    } finally {
      setLoading(false);
    }
  };

  const formatCarbonAmount = (grams) => {
    if (grams >= 1000) {
      return `${(grams / 1000).toFixed(1)}kg`;
    }
    return `${grams.toFixed(0)}g`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getImpactMessage = (carbonSaved) => {
    if (carbonSaved > 50) {
      return { message: 'Excellent Impact!', color: 'text-green-600', bgColor: 'bg-green-50' };
    } else if (carbonSaved > 25) {
      return { message: 'Great Choice!', color: 'text-blue-600', bgColor: 'bg-blue-50' };
    } else {
      return { message: 'Good Start!', color: 'text-purple-600', bgColor: 'bg-purple-50' };
    }
  };

  return (
    <div className="relative">
      {/* Compact Display */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center space-x-2 bg-green-50 hover:bg-green-100 px-4 py-2 rounded-full transition-colors group border border-green-200"
      >
        <Leaf className="w-4 h-4 text-green-600" />
        <span className="text-green-700 font-medium">
          {formatCarbonAmount(totalSaved)} CO₂ Saved
        </span>
        {isExpanded ? (
          <ChevronUp className="w-3 h-3 text-green-600" />
        ) : (
          <ChevronDown className="w-3 h-3 text-green-600" />
        )}
      </button>

      {/* Expanded Dropdown */}
      {isExpanded && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 animate-slide-in-right">
          {/* Header */}
          <div className="p-4 border-b bg-gradient-to-r from-green-50 to-emerald-50">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-800">Your Carbon Impact</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {formatCarbonAmount(totalSaved)} CO₂ Saved
            </div>
            <div className="text-green-700 text-sm">
              From eco-friendly purchases
            </div>
          </div>

          {/* Stats */}
          <div className="p-4 border-b">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="text-lg font-bold text-green-600">{savings.length}</div>
                <div className="text-xs text-green-700">Eco Purchases</div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-600">
                  {savings.length > 0 ? formatCarbonAmount(totalSaved / savings.length) : '0g'}
                </div>
                <div className="text-xs text-green-700">Avg per Item</div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-600">
                  {Math.floor(totalSaved / 20)}
                </div>
                <div className="text-xs text-green-700">Tree Minutes</div>
              </div>
            </div>
          </div>

          {/* Recent Savings */}
          <div className="p-4 max-h-64 overflow-y-auto">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
              <Award className="w-4 h-4 text-green-600" />
              <span>Recent Eco Purchases</span>
            </h4>

            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
              </div>
            ) : savings.length > 0 ? (
              <div className="space-y-3">
                {savings.slice(0, 5).map((saving) => {
                  const impact = getImpactMessage(saving.carbon_saved_grams);
                  
                  return (
                    <div key={saving.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg">
                      <img
                        src={saving.products?.image_url}
                        alt={saving.products?.name}
                        className="w-10 h-10 object-cover rounded-lg"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h5 className="font-medium text-gray-900 text-sm truncate">
                            {saving.products?.name}
                          </h5>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${impact.bgColor} ${impact.color}`}>
                            {formatCarbonAmount(saving.carbon_saved_grams)}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(saving.created_at)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Package className="w-3 h-3" />
                            <span>Qty: {saving.quantity}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Leaf className="w-3 h-3 text-green-500" />
                            <span>{saving.product_carbon_rating}/5.0</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {savings.length > 5 && (
                  <div className="text-center pt-2">
                    <span className="text-xs text-gray-500">
                      +{savings.length - 5} more eco purchases
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <Leaf className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No carbon savings yet</p>
                <p className="text-gray-400 text-xs">
                  Buy eco-friendly products to start saving!
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t bg-gray-50">
            <div className="text-center">
              <p className="text-xs text-gray-600">
                Keep choosing eco-friendly products (4.0+ rating) to increase your impact!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};