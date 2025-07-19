import React from 'react';
import { Award, Gift, ArrowRight, Leaf, TreePine, BarChart3 } from 'lucide-react';

export const EcoCoinsBanner = ({ onRewardsClick, onCarbonSavingsClick }) => {
  return (
    <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-lg p-6 mb-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-emerald-100 p-3 rounded-full">
              <Award className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-emerald-800">Earn Carbon Credits with Every Offset!</h2>
              <p className="text-emerald-700">
                Contribute to carbon offsetting and earn 1 credit for every ₹10 spent on offsetting for exclusive eco-friendly rewards.
              </p>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center space-x-6">
            <div className="text-center">
              <Leaf className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
              <p className="text-sm text-emerald-700">Offset Carbon</p>
            </div>
            <div className="text-center">
              <TreePine className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
              <p className="text-sm text-emerald-700">Plant Trees</p>
            </div>
            <button 
              onClick={onCarbonSavingsClick}
              className="text-center hover:bg-emerald-100 p-3 rounded-lg transition-colors group"
            >
              <BarChart3 className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
              <div className="flex items-center space-x-1">
                <p className="text-sm text-emerald-700 group-hover:text-emerald-800">Your Impact</p>
                <ArrowRight className="w-3 h-3 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </button>
            <button 
              onClick={onRewardsClick}
              className="text-center hover:bg-emerald-100 p-3 rounded-lg transition-colors group"
            >
              <Gift className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
              <div className="flex items-center space-x-1">
                <p className="text-sm text-emerald-700 group-hover:text-emerald-800">Redeem Rewards</p>
                <ArrowRight className="w-3 h-3 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};