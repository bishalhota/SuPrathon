import React, { useState } from 'react';
import { X, CreditCard, Truck, Shield, CheckCircle, Heart, Award, AlertTriangle, AlertCircle } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useUser } from '../contexts/UserContext';
import { CarbonOffsetBenefits } from './CarbonOffsetBenefits';

export const CheckoutModal = ({ isOpen, onClose }) => {
  const { items, total, clearCart } = useCart();
  const { addCarbonCredits } = useUser();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [earnedCarbonCredits, setEarnedCarbonCredits] = useState(0);
  const [carbonOffsetTip, setCarbonOffsetTip] = useState(0);
  const [showCarbonOffset, setShowCarbonOffset] = useState(false);
  const [formData, setFormData] = useState({
    email: 'demo@ecomart.com',
    fullName: 'Demo User',
    address: '123 Eco Street',
    city: 'Green City',
    zipCode: '12345',
    cardNumber: '4532 1234 5678 9012',
    expiryDate: '12/25',
    cvv: '123'
  });
  
  // Calculate total CO2 emissions for the order
  const totalCO2Emissions = items.reduce((sum, item) => {
    const co2 = item.product?.co2_emission_grams || (item.product?.weight_grams || 150) * 0.1;
    return sum + (co2 * item.quantity);
  }, 0);
  
  // Calculate carbon credits earned (10 credits per 100 Rs spent on offsetting)
  const carbonCreditsEarned = Math.floor(carbonOffsetTip / 10);

  // Analyze cart for carbon impact
  const cartAnalysis = items.reduce((analysis, item) => {
    const rating = item.product?.carbon_rating || 0;
    if (rating < 3.0) {
      analysis.highImpact.push(item);
    } else if (rating < 4.0) {
      analysis.moderateImpact.push(item);
    } else {
      analysis.lowImpact.push(item);
    }
    return analysis;
  }, { highImpact: [], moderateImpact: [], lowImpact: [] });

  const hasHighImpactItems = cartAnalysis.highImpact.length > 0;
  const hasModerateImpactItems = cartAnalysis.moderateImpact.length > 0;

  // Suggested tip amounts based on cart impact
  const getSuggestedTips = () => {
    if (hasHighImpactItems) {
      return [50, 100, 150, 200]; // Higher suggestions for high impact items
    } else if (hasModerateImpactItems) {
      return [30, 50, 70, 100]; // Moderate suggestions
    } else {
      return [10, 20, 30, 50]; // Lower suggestions for eco-friendly items
    }
  };

  const suggestedTips = getSuggestedTips();

const getOffsetUrgencyInfo = () => {
    if (hasHighImpactItems) {
      return {
        color: "red",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        textColor: "text-red-700",
        icon: AlertTriangle,
        title: "High Carbon Impact Items Detected It would help environment a lot for every small contribution u do towards offsetting",
        message: `Your order emits ${totalCO2Emissions.toFixed(
          1
        )}g of CO₂ due to high-emission items. We strongly recommend offsetting to neutralize this environmental impact.`,
        buttonColor: "bg-red-600 hover:bg-red-700",
      };
    } else if (hasModerateImpactItems) {
      return {
        color: "yellow",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
        textColor: "text-yellow-700",
        icon: AlertCircle,
        title: "Moderate Carbon Impact Let's Contribute to Offsetting",
        message: `Your order emits ${totalCO2Emissions.toFixed(
          1
        )}g of CO₂ from shipping and moderate-impact items. Consider offsetting to reduce your environmental footprint.`,
        buttonColor: "bg-yellow-600 hover:bg-yellow-700",
      };
    } else {
      return {
        color: "blue",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        textColor: "text-blue-700",
        icon: Heart,
        title: "Make This Delivery Carbon-Neutral",
        message: `Your order emits the actual carbon that it emits — in this case, it is ${totalCO2Emissions.toFixed(
          1
        )}g of CO₂. Offset that carbon through verified climate projects—real action toward a cleaner, safer planet.`,
        buttonColor: "bg-blue-600 hover:bg-blue-700",
      };
    }
  };

  const offsetInfo = getOffsetUrgencyInfo();
  const OffsetIcon = offsetInfo.icon;

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCarbonOffsetChange = (amount) => {
    setCarbonOffsetTip(amount);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Store the earned carbon credits amount BEFORE clearing the cart
    const creditsToEarn = carbonCreditsEarned;
    setEarnedCarbonCredits(creditsToEarn);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Add Carbon Credits if offset was paid
    if (creditsToEarn > 0) {
      addCarbonCredits(creditsToEarn);
    }
    
    // Clear cart and show success
    clearCart();
    setIsProcessing(false);
    setIsComplete(true);

    // Auto close after 5 seconds
    setTimeout(() => {
      setIsComplete(false);
      setCarbonOffsetTip(0);
      setShowCarbonOffset(false);
      onClose();
    }, 5000);
  };

  const handleClose = () => {
    setIsComplete(false);
    setEarnedCarbonCredits(0);
    setCarbonOffsetTip(0);
    setShowCarbonOffset(false);
    onClose();
  };

  const finalTotal = total + carbonOffsetTip;

  if (!isOpen) return null;

  if (isComplete) {
    return (
      <div className="fixed inset-0 z-50 overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full text-center animate-slide-in-right">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Complete!</h2>
            <p className="text-gray-600 mb-4">Thank you for your eco-conscious purchase!</p>

            {earnedCarbonCredits > 0 && (
              <div className="bg-emerald-50 p-4 rounded-lg mb-4 border border-emerald-200">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Award className="w-5 h-5 text-emerald-600" />
                  <span className="text-emerald-700 font-medium">Carbon Credits Earned!</span>
                </div>
                <span className="text-3xl font-bold text-emerald-600">+{earnedCarbonCredits}</span>
                <p className="text-sm text-emerald-600 mt-1">For carbon offsetting contribution</p>
              </div>
            )}

            {carbonOffsetTip > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-200">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Heart className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-700 font-medium">Carbon Offset Contribution</span>
                </div>
                <span className="text-2xl font-bold text-blue-600">₹{carbonOffsetTip.toFixed(2)}</span>
                <p className="text-sm text-blue-600 mt-1">Thank you for helping offset carbon emissions!</p>
              </div>
            )}
            
            <p className="text-sm text-gray-500 mb-4">
              Your order will be shipped within 2-3 business days.
            </p>

            <button
              onClick={handleClose}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold">Checkout</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Order Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3">Order Summary</h3>
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.product?.name} x{item.quantity}</span>
                    <span>₹{((item.product?.price || 0) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t pt-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                  {carbonOffsetTip > 0 && (
                    <div className="flex justify-between text-sm text-emerald-600">
                      <span>Carbon Offset Contribution</span>
                      <span>+₹{carbonOffsetTip.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold mt-2 pt-2 border-t">
                    <span>Total</span>
                    <span>₹{finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              {/* CO2 Emissions Info */}
              <div className="mt-4 bg-orange-50 p-3 rounded-lg border border-orange-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Truck className="w-4 h-4 text-orange-600" />
                    <span className="text-orange-700 font-medium">Total CO₂ Emissions:</span>
                  </div>
                  <span className="text-orange-600 font-bold">{totalCO2Emissions.toFixed(1)}g</span>
                </div>
                <p className="text-xs text-orange-600 mt-1">
                  From shipping and packaging
                </p>
              </div>
            </div>

            {/* Carbon Offset Section */}
            <div className={`${offsetInfo.bgColor} p-4 rounded-lg ${offsetInfo.borderColor} border`}>
              <div className="flex items-start space-x-3">
                <OffsetIcon className={`w-5 h-5 ${offsetInfo.textColor} mt-0.5`} />
                <div className="flex-1">
                  <h3 className={`font-semibold ${offsetInfo.textColor} mb-2`}>
                    {offsetInfo.title}
                  </h3>
                  <p className={`text-sm ${offsetInfo.textColor} mb-3`}>
                    {offsetInfo.message}
                  </p>
                  
                  {!showCarbonOffset ? (
                    <button
                      type="button"
                      onClick={() => setShowCarbonOffset(true)}
                      className={`${offsetInfo.buttonColor} text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors`}
                    >
                      {hasHighImpactItems ? 'Offset High Impact Items' : 
                       hasModerateImpactItems ? 'Offset Carbon Emissions' : 
                       'Contribute to Offsetting'}
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <p className={`text-sm ${offsetInfo.textColor} font-medium`}>Choose your contribution:</p>
                      <div className="grid grid-cols-2 gap-2">
                        {suggestedTips.map((amount) => (
                          <button
                            key={amount}
                            type="button"
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              carbonOffsetTip === amount
                                ? `${offsetInfo.buttonColor} text-white`
                                : `bg-white border ${offsetInfo.borderColor} ${offsetInfo.textColor} hover:bg-opacity-50`
                            }`}
                            onClick={() => handleCarbonOffsetChange(amount)}
                          >
                            ₹{amount}
                          </button>
                        ))}
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={carbonOffsetTip}
                          onChange={(e) => handleCarbonOffsetChange(parseFloat(e.target.value) || 0)}
                          className={`flex-1 p-2 border ${offsetInfo.borderColor} rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                          placeholder="Custom amount"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setCarbonOffsetTip(0);
                            setShowCarbonOffset(false);
                          }}
                          className={`${offsetInfo.textColor} hover:opacity-70 text-sm`}
                        >
                          Skip
                        </button>
                      </div>
                      {carbonOffsetTip > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <p className={`text-xs ${offsetInfo.textColor}`}>
                              Your ₹{carbonOffsetTip.toFixed(2)} contribution will support:
                            </p>
                            <div className="flex items-center space-x-1">
                              <Award className="w-3 h-3 text-emerald-600" />
                              <span className="text-xs text-emerald-600 font-medium">
                                +{carbonCreditsEarned} Credits
                              </span>
                            </div>
                          </div>
                          <CarbonOffsetBenefits offsetAmount={carbonOffsetTip} />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div>
              <h3 className="font-semibold mb-3">Shipping Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Address"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent md:col-span-2"
                  required
                />
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="City"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  placeholder="ZIP Code"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Payment Information */}
            <div>
              <h3 className="font-semibold mb-3">Payment Information</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  placeholder="Card Number"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    placeholder="MM/YY"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                  <input
                    type="text"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    placeholder="CVV"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Security Features */}
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Shield className="w-4 h-4" />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center space-x-1">
                <Truck className="w-4 h-4" />
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center space-x-1">
                <CreditCard className="w-4 h-4" />
                <span>Protected</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  <span>Complete Order - ₹{finalTotal.toFixed(2)}</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};