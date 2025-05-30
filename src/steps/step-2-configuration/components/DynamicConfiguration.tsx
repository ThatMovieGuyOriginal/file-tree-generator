// src/steps/step-2-configuration/components/DynamicConfiguration.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { ProjectSettings } from '@/types/project';
import { EnhancedLanguagePlugin } from '@/types/enhanced-plugin';
import { PluginConfiguration, DependencyOption } from '@/types/enhanced-plugin';
import { Check } from 'lucide-react';

interface DynamicConfigurationProps {
  plugin: EnhancedLanguagePlugin;
  settings: ProjectSettings;
  onSettingsChange: (settings: ProjectSettings) => void;
  configurations: Record<string, any>;
  onConfigurationChange: (configurations: Record<string, any>) => void;
}

export const DynamicConfiguration: React.FC<DynamicConfigurationProps> = ({
  plugin,
  settings,
  onSettingsChange,
  configurations,
  onConfigurationChange
}) => {
  const [selectedDependencies, setSelectedDependencies] = useState<string[]>([]);
  const [estimatedSize, setEstimatedSize] = useState<string>('~50MB');

  useEffect(() => {
    const defaultConfigs: Record<string, any> = {};
    plugin.configurations?.forEach(config => {
      defaultConfigs[config.id] = config.default;
    });
    onConfigurationChange(defaultConfigs);
  }, [plugin.id]);

  useEffect(() => {
    const baseSize = 45;
    const dependencySize = selectedDependencies.length * 8;
    const totalSize = baseSize + dependencySize;
    setEstimatedSize(`~${totalSize}MB`);
  }, [selectedDependencies]);

  const handleConfigurationChange = (configId: string, value: any) => {
    const newConfigurations = { ...configurations, [configId]: value };
    onConfigurationChange(newConfigurations);

    if (configId === 'database' && value === 'prisma') {
      setSelectedDependencies(prev => [...prev.filter(d => d !== 'drizzle-orm'), 'prisma', '@prisma/client']);
    }
  };

  const toggleDependency = (depId: string) => {
    setSelectedDependencies(prev => 
      prev.includes(depId) 
        ? prev.filter(id => id !== depId)
        : [...prev, depId]
    );
  };

  const groupedConfigurations = plugin.configurations?.reduce((acc, config) => {
    if (!acc[config.category]) acc[config.category] = [];
    acc[config.category].push(config);
    return acc;
  }, {} as Record<string, PluginConfiguration[]>) || {};

  const groupedDependencies = plugin.dependencyOptions?.reduce((acc, dep) => {
    if (!acc[dep.category]) acc[dep.category] = [];
    acc[dep.category].push(dep);
    return acc;
  }, {} as Record<string, DependencyOption[]>) || {};

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Project Name
          </label>
          <input
            type="text"
            value={settings.name}
            onChange={(e) => onSettingsChange({ ...settings, name: e.target.value })}
            placeholder="my-awesome-project"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <input
            type="text"
            value={settings.description}
            onChange={(e) => onSettingsChange({ ...settings, description: e.target.value })}
            placeholder="A brief description of your project"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      {Object.entries(groupedConfigurations).map(([category, configs]) => (
        <div key={category} className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 capitalize">
            {category} Configuration
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {configs.map((config) => (
              <ConfigurationField
                key={config.id}
                config={config}
                value={configurations[config.id]}
                onChange={(value) => handleConfigurationChange(config.id, value)}
                allConfigurations={configurations}
              />
            ))}
          </div>
        </div>
      ))}

      {Object.keys(groupedDependencies).length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Optional Dependencies
            </h3>
            <div className="text-sm text-gray-500">
              Estimated size: {estimatedSize}
            </div>
          </div>
          
          {Object.entries(groupedDependencies).map(([category, deps]) => (
            <div key={category} className="mb-6 last:mb-0">
              <h4 className="text-md font-medium text-gray-800 mb-3 capitalize">
                {category} Libraries
              </h4>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {deps.map((dep) => (
                  <DependencyCard
                    key={dep.id}
                    dependency={dep}
                    isSelected={selectedDependencies.includes(dep.id)}
                    onToggle={() => toggleDependency(dep.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-indigo-900 mb-4">
          Configuration Summary
        </h3>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">
              {Object.keys(configurations).length}
            </div>
            <div className="text-sm text-indigo-700">Features Configured</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">
              {selectedDependencies.length}
            </div>
            <div className="text-sm text-indigo-700">Dependencies Selected</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">
              {estimatedSize}
            </div>
            <div className="text-sm text-indigo-700">Estimated Size</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ConfigurationField: React.FC<{
  config: PluginConfiguration;
  value: any;
  onChange: (value: any) => void;
  allConfigurations: Record<string, any>;
}> = ({ config, value, onChange, allConfigurations }) => {
  const shouldShow = !config.conditional || 
    allConfigurations[config.conditional.split('=')[0]] === config.conditional.split('=')[1];

  if (!shouldShow) return null;

  switch (config.type) {
    case 'boolean':
      return (
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={value || false}
            onChange={(e) => onChange(e.target.checked)}
            className="rounded"
          />
          <div>
            <span className="font-medium text-gray-900">{config.name}</span>
            <p className="text-sm text-gray-600">{config.description}</p>
          </div>
        </label>
      );

    case 'select':
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {config.name}
          </label>
          <select
            value={value || config.default}
            onChange={(e) => onChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            {config.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="text-sm text-gray-600 mt-1">{config.description}</p>
        </div>
      );

    case 'text':
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {config.name}
          </label>
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={config.description}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      );

    default:
      return null;
  }
};

const DependencyCard: React.FC<{
  dependency: DependencyOption;
  isSelected: boolean;
  onToggle: () => void;
}> = ({ dependency, isSelected, onToggle }) => {
  return (
    <div
      onClick={onToggle}
      className={`
        p-4 border rounded-lg cursor-pointer transition-all duration-200
        ${isSelected 
          ? 'border-indigo-500 bg-indigo-50' 
          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
        }
      `}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-gray-900">{dependency.name}</h4>
        <div className={`
          w-5 h-5 rounded border-2 flex items-center justify-center
          ${isSelected ? 'border-indigo-500 bg-indigo-500' : 'border-gray-300'}
        `}>
          {isSelected && (
            <Check className="w-3 h-3 text-white" />
          )}
        </div>
      </div>
      
      <p className="text-sm text-gray-600 mb-2">{dependency.description}</p>
      
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{dependency.version}</span>
        <span className={`px-2 py-1 rounded-full ${
          dependency.required ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600'
        }`}>
          {dependency.required ? 'Required' : 'Optional'}
        </span>
      </div>
    </div>
  );
};
