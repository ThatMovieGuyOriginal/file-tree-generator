// src/steps/step-2-configuration/components/ConfigurationSection.tsx
import React from 'react';
import { Check } from 'lucide-react';

interface ConfigurationOption {
  id: string;
  name: string;
  description: string;
  popular?: boolean;
}

interface ConfigurationSectionProps {
  category: {
    id: string;
    name: string;
    icon: React.ComponentType<any>;
    options: ConfigurationOption[];
  };
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
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex items-center mb-4">
        <div className="p-2 bg-indigo-100 rounded-lg mr-3">
          <IconComponent className="w-5 h-5 text-indigo-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">{category.name}</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {category.options.map((option) => {
          const isSelected = selectedValue === option.id;
          
          return (
            <div
              key={option.id}
              onClick={() => onSelectionChange(option.id)}
              className={`
                relative p-4 rounded-lg border cursor-pointer transition-all duration-200 group
                ${isSelected 
                  ? 'border-indigo-500 bg-indigo-50 shadow-md' 
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }
              `}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h4 className="font-semibold text-gray-900">{option.name}</h4>
                    {option.popular && (
                      <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full font-medium">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{option.description}</p>
                </div>
                {isSelected && (
                  <div className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 ml-2">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
