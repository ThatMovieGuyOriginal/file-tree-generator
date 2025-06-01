// src/components/wizard/ConfigurationSummary.tsx
'use client';

import React from 'react';
import { CheckCircle } from 'lucide-react';
import { ConfigCategory } from '@/types/configuration';

interface ConfigurationSummaryProps {
  configurations: Record<string, any>;
  configCategories: ConfigCategory[];
}

export const ConfigurationSummary: React.FC<ConfigurationSummaryProps> = ({
  configurations,
  configCategories
}) => {
  const getSelectedOptionName = (categoryId: string, optionId: string): string => {
    const category = configCategories.find(c => c.id === categoryId);
    const option = category?.options.find(o => o.id === optionId);
    return option?.name || 'Unknown';
  };

  const getSelectedOptions = () => {
    return Object.entries(configurations)
      .filter(([_, value]) => value !== 'none')
      .map(([categoryId, optionId]) => {
        const category = configCategories.find(c => c.id === categoryId);
        const option = category?.options.find(o => o.id === optionId);
        return { category, option };
      })
      .filter(({ category, option }) => category && option);
  };

  const selectedOptions = getSelectedOptions();
  const activeIntegrations = Object.values(configurations).filter(v => v !== 'none').length;

  return (
    <>
      {/* Configuration Summary */}
      <div className="mt-12 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-200">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-white">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-indigo-900">Configuration Summary</h3>
            <p className="text-indigo-700">Your selected stack configuration</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-600">
              {Object.keys(configurations).length}
            </div>
            <div className="text-sm text-indigo-700 font-medium">Components Configured</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {activeIntegrations}
            </div>
            <div className="text-sm text-green-700 font-medium">Active Integrations</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">
              {configurations.database !== 'none' && configurations.auth !== 'none' ? 'Full-Stack' : 
               configurations.database !== 'none' || configurations.auth !== 'none' ? 'Enhanced' : 'Frontend'}
            </div>
            <div className="text-sm text-purple-700 font-medium">Application Type</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">100%</div>
            <div className="text-sm text-orange-700 font-medium">Production Ready</div>
          </div>
        </div>

        {/* Selected Technologies */}
        <div className="bg-white rounded-xl p-6 border border-indigo-200">
          <h4 className="font-bold text-gray-900 mb-4">Selected Technologies:</h4>
          <div className="flex flex-wrap gap-3">
            {selectedOptions.map(({ category, option }) => {
              if (!category || !option) return null;
              
              return (
                <div key={`${category.id}-${option.id}`} className={`px-4 py-2 bg-gradient-to-r ${category.color} text-white rounded-lg font-medium text-sm shadow-lg`}>
                  {option.name}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Ready to Generate */}
      <div className="mt-12 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-green-800 mb-4">
            <CheckCircle className="w-6 h-6" />
            <span className="text-xl font-bold">Configuration Complete!</span>
          </div>
          <p className="text-green-700 mb-6">
            Your project is configured and ready for generation. Click "Next" to preview your setup.
          </p>
          <div className="flex items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-700 font-medium">All components selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-700 font-medium">Production optimized</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-700 font-medium">Best practices included</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
