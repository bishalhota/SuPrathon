import React, { useState, useEffect } from 'react';
import { X, Leaf, Award, Calendar, Package, TrendingUp } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { getUserCarbonSavings } from '../lib/database';

export const CarbonSavingsModal = ({ isOpen, onClose }) => {
  const { user } = useUser();
  const [savings, setSavings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalSaved, setTotalSaved] = useState(0);

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
    if (isOpen && user) {
      fetchCarbonSavings();
    }
  }, [isOpen, user]);

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-green-50 to-emerald-50">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-3 rounded-full">
                <Leaf className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-green-800">Your Carbon Savings</h2>
                <p className="text-green-600 text-sm">Environmental impact from your eco-friendly choices</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-green-100 rounded-full">
              <X className="w-5 h-5 text-green-600" />
            </button>
          </div>

          <div className="p-6">
            {/* Total Impact Summary */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 mb-6">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-3">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                  <span className="text-2xl font-bold text-green-800">Total Carbon Saved</span>
                </div>
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {totalSaved.toFixed(1)}g CO₂
                </div>
                <div className="text-green-700 text-sm mb-4">
                  Equivalent to {Math.floor(totalSaved / 20)} minutes of tree absorption
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{savings.length}</div>
                    <div className="text-xs text-green-700">Eco Purchases</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">
                      {savings.length > 0 ? (totalSaved / savings.length).toFixed(1) : 0}g
                    </div>
                    <div className="text-xs text-green-700">Avg per Purchase</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">
                      {Math.floor(totalSaved / 1000 * 365)}g
                    </div>
                    <div className="text-xs text-green-700">Annual Projection</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Savings History */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Award className="w-5 h-5 text-green-600" />
                <span>Your Eco-Friendly Purchase History</span>
              </h3>

              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                </div>
              ) : savings.length > 0 ? (
                <div className="space-y-4">
                  {savings.map((saving) => {
                    const impact = getImpactMessage(saving.carbon_saved_grams);
                    
                    return (
                      <div key={saving.id} className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors">
                        <div className="flex items-start space-x-4">
                          <img
                            src={saving.products?.image_url}
                            alt={saving.products?.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-medium text-gray-900">{saving.products?.name}</h4>
                              <div className={`px-2 py-1 rounded-full text-xs font-medium ${impact.bgColor} ${impact.color}`}>
                                {impact.message}
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <div className="text-gray-500 text-xs">Carbon Saved</div>
                                <div className="font-semibold text-green-600">
                                  {saving.carbon_saved_grams.toFixed(1)}g CO₂
                                </div>
                              </div>
                              
                              <div>
                                <div className="text-gray-500 text-xs">Carbon Rating</div>
                                <div className="font-semibold text-gray-900">
                                  {saving.product_carbon_rating}/5.0
                                </div>
                              </div>
                              
                              <div>
                                <div className="text-gray-500 text-xs">Quantity</div>
                                <div className="font-semibold text-gray-900">
                                  {saving.quantity}
                                </div>
                              </div>
                              
                              <div>
                                <div className="text-gray-500 text-xs">Date</div>
                                <div className="font-semibold text-gray-900">
                                  {formatDate(saving.created_at)}
                                </div>
                              </div>
                            </div>
                            
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <div className="flex items-center space-x-4 text-xs text-gray-600">
                                <div className="flex items-center space-x-1">
                                  <Leaf className="w-3 h-3 text-green-500" />
                                  <span>Eco-friendly choice</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Calendar className="w-3 h-3 text-blue-500" />
                                  <span>{formatDate(saving.created_at)}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Package className="w-3 h-3 text-purple-500" />
                                  <span>Qty: {saving.quantity}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Leaf className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg mb-2">No carbon savings yet</p>
                  <p className="text-gray-400 text-sm">
                    Start purchasing eco-friendly products (4.0+ carbon rating) to track your environmental impact!
                  </p>
                </div>
              )}
            </div>

            {/* Tips Section */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-800 mb-3">💡 Maximize Your Carbon Savings</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-blue-700">Choose products with 4.0+ carbon ratings</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-blue-700">Look for organic, recycled, and sustainable materials</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-blue-700">Consider carbon offsetting during checkout</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-blue-700">Share your impact with friends to inspire others</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};