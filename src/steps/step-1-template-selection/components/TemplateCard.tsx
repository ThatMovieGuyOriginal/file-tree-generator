// src/steps/step-1-template-selection/components/TemplateCard.tsx
import React from 'react';
import { Check } from 'lucide-react';
import { Template } from '@/lib/template-manager';

interface TemplateCardProps {
  template: Template;
  isSelected: boolean;
  onSelect: () => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  isSelected,
  onSelect
}) => {
  return (
    <div
      onClick={onSelect}
      className={`
        relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg group
        ${isSelected 
          ? 'border-indigo-500 bg-indigo-50 shadow-lg transform scale-105' 
          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
        }
      `}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg bg-gradient-to-r ${template.color} text-white`}>
          <span className="text-2xl">{template.icon}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            template.complexity === 'starter' ? 'bg-green-100 text-green-800' :
            template.complexity === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {template.complexity}
          </div>
          {isSelected && (
            <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
          )}
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-2">{template.name}</h3>
      <p className="text-gray-600 mb-4 line-clamp-2">{template.description}</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {template.features.slice(0, 3).map((feature) => (
          <span key={feature} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
            {feature}
          </span>
        ))}
        {template.features.length > 3 && (
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
            +{template.features.length - 3} more
          </span>
        )}
      </div>
      
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>{template.estimatedTime}</span>
        <div className="flex items-center text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-sm font-medium">Select Template</span>
        </div>
      </div>
    </div>
  );
};
