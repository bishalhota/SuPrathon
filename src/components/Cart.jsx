import React, { useState } from 'react';
import { X, Plus, Minus, Award } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { CarbonRating } from './CarbonRating';
import { CheckoutModal } from './CheckoutModal';

export const Cart = ({ isOpen, onClose }) => {
  const { items, updateQuantity, removeFromCart, total, clearCart } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  if (!isOpen) return null;

  const handleCheckout = () => {
    setIsCheckoutOpen(true);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
        
        <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">Shopping Cart</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                      <img
                        src={item.product?.image_url}
                        alt={item.product?.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.product?.name}</h3>
                        <div className="mt-1 space-y-1">
                          <div className="text-xs text-gray-500">Carbon Footprint</div>
                          <CarbonRating rating={item.product?.carbon_rating || 0} size="sm" />
                        </div>
                        <p className="text-green-600 font-semibold">
                          ₹{(item.product?.price || 0).toFixed(2)}
                        </p>
                      </div>

                      <div className="flex flex-col items-end space-y-2">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <button
                          onClick={() => removeFromCart(item.product_id)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t p-6 space-y-4">
                {/* Total */}
                <div className="flex items-center justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>

                {/* Carbon Credits Info */}
                <div className="flex items-center justify-between bg-emerald-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Award className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700 font-medium">Earn Credits:</span>
                  </div>
                  <span className="text-emerald-600 font-bold">1 credit per ₹10 offset</span>
                </div>

                {/* Buttons */}
                <div className="space-y-2">
                  <button 
                    onClick={handleCheckout}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors"
                  >
                    Checkout
                  </button>
                  <button
                    onClick={clearCart}
                    className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 rounded-lg transition-colors"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
      />
    </>
  );
};