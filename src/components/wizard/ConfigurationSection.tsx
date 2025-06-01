// src/components/wizard/ConfigurationSection.tsx
'use client';

import React from 'react';
import { CheckCircle, Sparkles } from 'lucide-react';
import { ConfigCategory } from '@/types/configuration';

interface ConfigurationSectionProps {
  category: ConfigCategory;
  selectedValue: string;
  onSelectionChange: (value: string) => void;
}

export const ConfigurationSection: React.FC<ConfigurationSectionProps> = ({
  category,
  selectedValue,
  onSelectionChange
}) => {
  const IconComponent = category.icon;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg">
      {/* Category Header */}
      <div className={`p-6 bg-gradient-to-r ${category.color} text-white`}>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-xl">
            <IconComponent className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold">{category.name}</h3>
            <p className="text-white/90 text-sm">{category.description}</p>
          </div>
        </div>
      </div>
      
      {/* Options Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 gap-4">
          {category.options.map((option) => {
            const isSelected = selectedValue === option.id;
            
            return (
              <div
                key={option.id}
                onClick={() => onSelectionChange(option.id)}
                className={`
                  relative p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 group
                  ${isSelected 
                    ? 'border-indigo-500 bg-gradient-to-r from-indigo-50 to-purple-50 shadow-lg ring-4 ring-indigo-500/20 scale-102' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-md'
                  }
                `}
              >
                {/* Selected Indicator */}
                {isSelected && (
                  <div className="absolute top-4 right-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                  </div>
                )}

                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className={`font-bold text-lg ${isSelected ? 'text-indigo-900' : 'text-gray-900'}`}>
                        {option.name}
                      </h4>
                      {option.popular && (
                        <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs rounded-full font-bold">
                          Popular
                        </span>
                      )}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        option.setup === 'Simple' ? 'bg-green-100 text-green-800' :
                        option.setup === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                        option.setup === 'Advanced' ? 'bg-orange-100 text-orange-800' :
                        option.setup === 'Expert' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {option.setup} Setup
                      </span>
                    </div>
                    <p className={`text-sm mb-3 ${isSelected ? 'text-indigo-700' : 'text-gray-600'}`}>
                      {option.description}
                    </p>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2">
                  <h5 className={`text-sm font-semibold ${isSelected ? 'text-indigo-800' : 'text-gray-700'}`}>
                    Key Features:
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {option.features.map((feature, index) => (
                      <span 
                        key={index}
                        className={`px-2 py-1 rounded-lg text-xs font-medium ${
                          isSelected 
                            ? 'bg-indigo-100 text-indigo-800' 
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Selection Indicator */}
                <div className={`
                  mt-4 pt-4 border-t transition-all duration-300
                  ${isSelected ? 'border-indigo-200' : 'border-gray-200'}
                `}>
                  <div className={`
                    flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300
                    ${isSelected 
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' 
                      : 'bg-gray-100 text-gray-700 group-hover:bg-indigo-50 group-hover:text-indigo-600'
                    }
                  `}>
                    {isSelected ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Selected
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Select
                      </>
                    )}
                  </div>
                </div>

                {/* Hover Effect */}
                {!isSelected && (
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
