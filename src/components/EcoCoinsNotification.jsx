import React, { useState, useEffect } from 'react';
import { Leaf, X } from 'lucide-react';

export const EcoCoinsNotification = ({ 
  amount, 
  isVisible, 
  onClose 
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-20 right-4 z-50 animate-slide-in-right">
      <div className="bg-green-600 text-white p-4 rounded-lg shadow-lg max-w-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-green-500 p-2 rounded-full">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold">EcoCoins Earned!</p>
              <p className="text-green-100">+{amount} EcoCoins added to your account</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-green-200 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};