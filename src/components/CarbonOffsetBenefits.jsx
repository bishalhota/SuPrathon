import React from 'react';
import { Leaf, Heart, Award, TreePine, Globe, Users } from 'lucide-react';

export const CarbonOffsetBenefits = ({ offsetAmount = 0 }) => {
  const benefits = [
    {
      icon: TreePine,
      title: 'Reforestation Projects',
      description: 'Support tree planting initiatives worldwide',
      impact: `${Math.floor(offsetAmount * 2)} trees planted`,
      color: 'green'
    },
    {
      icon: Globe,
      title: 'Renewable Energy',
      description: 'Fund solar and wind energy projects',
      impact: `${Math.floor(offsetAmount * 5)} kWh clean energy`,
      color: 'blue'
    },
    {
      icon: Heart,
      title: 'Community Support',
      description: 'Help local environmental communities',
      impact: `${Math.floor(offsetAmount * 0.5)} families supported`,
      color: 'red'
    },
    {
      icon: Leaf,
      title: 'Carbon Reduction',
      description: 'Direct CO₂ removal from atmosphere',
      impact: `${Math.floor(offsetAmount * 10)} kg CO₂ offset`,
      color: 'emerald'
    },
    {
      icon: Users,
      title: 'Environmental Education',
      description: 'Support climate awareness programs',
      impact: `${Math.floor(offsetAmount * 3)} people educated`,
      color: 'purple'
    },
    {
      icon: Award,
      title: 'Carbon Credits',
      description: 'Earn credits for future use',
      impact: `${Math.floor(offsetAmount / 10)} credits earned`,
      color: 'yellow'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      green: 'bg-green-100 text-green-800 border-green-200',
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      red: 'bg-red-100 text-red-800 border-red-200',
      emerald: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-200',
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    return colors[color] || colors.green;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {benefits.map((benefit, index) => {
        const IconComponent = benefit.icon;
        return (
          <div
            key={index}
            className={`p-4 rounded-lg border ${getColorClasses(benefit.color)} transition-all duration-200 hover:shadow-md`}
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-full ${getColorClasses(benefit.color)}`}>
                <IconComponent className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm mb-1">{benefit.title}</h4>
                <p className="text-xs opacity-80 mb-2">{benefit.description}</p>
                <div className="text-xs font-medium">
                  {benefit.impact}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};