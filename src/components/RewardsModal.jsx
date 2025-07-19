import React, { useState } from 'react';
import {
  X,
  Gift,
  Percent,
  Truck,
  Star,
  Leaf,
  Check,
  Award,
  User,
  Shield,
  Users,
} from "lucide-react";
import { useUser } from '../contexts/UserContext';

export const RewardsModal = ({ isOpen, onClose, onRewardRedeemed }) => {
  const { carbonCredits, spendCarbonCredits } = useUser();
  const [redeemedRewards, setRedeemedRewards] = useState([]);

  const rewards = [
    {
      id: 'free-shipping',
      title: 'Free Premium Shipping',
      description: 'Free express shipping on your next 3 orders',
      cost: 300,
      type: 'shipping',
      value: 'free-express',
      icon: Truck,
      color: 'green'
    },
    {
      id: 'discount-10',
      title: '10% Off Next Purchase',
      description: 'Get 10% discount on your next order (up to ₹500 off)',
      cost: 1000,
      type: 'discount',
      value: 10,
      icon: Percent,
      color: 'purple'
    },
    {
      id: 'discount-20',
      title: '20% Off Next Purchase',
      description: 'Get 20% discount on your next order (up to ₹1000 off)',
      cost: 2000,
      type: 'discount',
      value: 20,
      icon: Percent,
      color: 'indigo'
    },
    {
      id: 'premium-membership',
      title: '3-Month Premium Membership',
      description: 'Free shipping, early access to sales, and exclusive products',
      cost: 3000,
      type: 'membership',
      value: 'premium-3m',
      icon: Star,
      color: 'yellow'
    },
    {
      id: 'cashback-25',
      title: '₹250 Store Credit',
      description: 'Get ₹250 credit to spend on any products',
      cost: 2500,
      type: 'cashback',
      value: 25,
      icon: Gift,
      color: 'emerald'
    },
    {
      id: 'cashback-50',
      title: '₹500 Store Credit',
      description: 'Get ₹500 credit to spend on any products',
      cost: 5000,
      type: 'cashback',
      value: 50,
      icon: Gift,
      color: 'emerald'
    },
    {
      id: 'priority-support',
      title: 'VIP Customer Support',
      description: '6 months of priority customer service and product consultation',
      cost: 1500,
      type: 'support',
      value: 'vip-6m',
      icon: Star,
      color: 'blue'
    },
    {
      id: 'early-access',
      title: 'Early Access Pass',
      description: '1 year early access to new products and exclusive sales',
      cost: 4000,
      type: 'access',
      value: 'early-1y',
      icon: Award,
      color: 'purple'
    },
    {
      id: 'bundle-starter',
      title: 'Eco-Starter Bundle',
      description: 'Free eco-friendly starter kit worth ₹750 (bamboo products, reusable bags)',
      cost: 3000,
      type: 'discount',
      value: 'bundle-75',
      icon: Gift,
      color: 'green'
    },
    {
      id: 'bundle-premium',
      title: 'Premium Eco Bundle',
      description: 'Free premium eco bundle worth ₹1500 (organic skincare, bamboo kitchenware)',
      cost: 6000,
      type: 'product',
      value: 'bundle-150',
      icon: Gift,
      color: 'emerald'
    },
    {
      id: 'personal-shopper',
      title: 'Personal Eco Shopper',
      description: '3 months of personalized eco-friendly product recommendations',
      cost: 2000,
      type: 'service',
      value: 'shopper-3m',
      icon: User,
      color: 'green'
    },
    {
      id: 'extended-warranty',
      title: 'Extended Warranty',
      description: '2-year extended warranty on electronics and appliances',
      cost: 2500,
      type: 'warranty',
      value: '2-year',
      icon: Shield,
      color: 'blue'
    },
    {
      id: 'birthday-special',
      title: 'Birthday Month Special',
      description: '30% off everything during your birthday month + free gift',
      cost: 3500,
      type: 'special',
      value: 'birthday',
      icon: Gift,
      color: 'purple'
    },
    {
      id: 'referral-bonus',
      title: 'Referral Bonus Multiplier',
      description: 'Double credits for every friend you refer for 6 months',
      cost: 1800,
      type: 'bonus',
      value: 'referral-2x',
      icon: Users,
      color: 'indigo'
    },
    {
      id: 'price-protection',
      title: 'Price Protection',
      description: 'If price drops within 30 days, get the difference back as credits',
      cost: 1200,
      type: 'product',
      value: 'price-protection',
      icon: Shield,
      color: 'blue'
    },
    {
      id: 'express-returns',
      title: 'Express Returns',
      description: 'Free express return shipping for 1 year + instant refunds',
      cost: 1500,
      type: 'service',
      value: 'express-returns',
      icon: Truck,
      color: 'green'
    },
    {
      id: 'exclusive-products',
      title: 'Exclusive Product Access',
      description: 'Access to limited edition and exclusive eco-friendly products',
      cost: 2800,
      type: 'access',
      value: 'exclusive',
      icon: Star,
      color: 'yellow'
    },
    {
      id: 'concierge-service',
      title: 'Concierge Service',
      description: 'Personal shopping assistant for 6 months - we find what you need',
      cost: 4500,
      type: 'service',
      value: 'concierge-6m',
      icon: Award,
      color: 'purple'
    }
  ];

  const handleRedeem = (reward) => {
    const canAfford = carbonCredits >= reward.cost;
      
    if (canAfford && !redeemedRewards.includes(reward.id)) {
      const success = spendCarbonCredits(reward.cost);
        
      if (success) {
        setRedeemedRewards([...redeemedRewards, reward.id]);
        if (onRewardRedeemed) {
          onRewardRedeemed(reward);
        }
        
        // Auto close after 2 seconds
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    }
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-200',
      indigo: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      green: 'bg-green-100 text-green-800 border-green-200',
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      emerald: 'bg-emerald-100 text-emerald-800 border-emerald-200'
    };
    return colors[color] || colors.emerald;
  };

  const getButtonClasses = (color, canAfford, isRedeemed) => {
    if (isRedeemed) {
      return 'bg-gray-100 text-gray-500 cursor-not-allowed';
    }
    if (!canAfford) {
      return 'bg-gray-200 text-gray-400 cursor-not-allowed';
    }
    
    const colors = {
      blue: 'bg-blue-600 hover:bg-blue-700 text-white',
      purple: 'bg-purple-600 hover:bg-purple-700 text-white',
      indigo: 'bg-indigo-600 hover:bg-indigo-700 text-white',
      green: 'bg-green-600 hover:bg-green-700 text-white',
      yellow: 'bg-yellow-600 hover:bg-yellow-700 text-white',
      emerald: 'bg-emerald-600 hover:bg-emerald-700 text-white'
    };
    return colors[color] || colors.emerald;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-emerald-50 to-green-50">
            <div className="flex items-center space-x-3">
              <div className="bg-emerald-100 p-3 rounded-full">
                <Award className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-emerald-800">Carbon Credits Rewards</h2>
                <p className="text-emerald-600 text-sm">Redeem your carbon credits for exclusive eco-friendly rewards</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-emerald-100 rounded-full">
              <X className="w-5 h-5 text-emerald-600" />
            </button>
          </div>

          <div className="p-6">
            {/* Balance */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-center space-x-3">
                <Award className="w-8 h-8 text-emerald-600" />
                <div className="text-center">
                  <p className="text-emerald-700 font-medium">Carbon Credits Balance</p>
                  <p className="text-4xl font-bold text-emerald-600">{carbonCredits.toLocaleString()}</p>
                  <p className="text-sm text-emerald-600 mt-1">Earned through carbon offsetting</p>
                </div>
              </div>
            </div>

            {/* Rewards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rewards.map((reward) => {
                const canAfford = carbonCredits >= reward.cost;
                const isRedeemed = redeemedRewards.includes(reward.id);
                const IconComponent = reward.icon;

                return (
                  <div
                    key={reward.id}
                    className={`border rounded-lg p-6 transition-all duration-200 ${
                      canAfford && !isRedeemed 
                        ? 'border-emerald-300 hover:shadow-md' 
                        : 'border-gray-200'
                    } ${isRedeemed ? 'bg-gray-50' : 'bg-white'}`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-full ${getColorClasses(reward.color)}`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      {isRedeemed && (
                        <div className="bg-emerald-100 text-emerald-800 p-1 rounded-full">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-2">{reward.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{reward.description}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Award className="w-4 h-4 text-emerald-600" />
                        <span className="font-bold text-emerald-600">
                          {reward.cost.toLocaleString()}
                        </span>
                        <span className="text-xs text-emerald-600">Credits</span>
                      </div>
                      
                      <button
                        onClick={() => handleRedeem(reward)}
                        disabled={!canAfford || isRedeemed}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${getButtonClasses(
                          reward.color,
                          canAfford,
                          isRedeemed
                        )}`}
                      >
                        {isRedeemed ? 'Redeemed' : canAfford ? 'Redeem' : 'Not Enough'}
                      </button>
                    </div>

                    {!canAfford && !isRedeemed && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-500">
                          Need {(reward.cost - carbonCredits).toLocaleString()} more Credits
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* How to Earn More */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-800 mb-3">How to Earn More Carbon Credits</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                  <span className="text-blue-700">Pay for carbon offsetting during checkout</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                  <span className="text-blue-700">Earn 1 credit for every ₹10 spent on offsetting</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                  <span className="text-blue-700">Bonus credits for offsetting high-impact items</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                  <span className="text-blue-700">Refer friends and earn 50 credits per successful referral</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};