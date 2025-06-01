// src/components/wizard/ProjectConfiguration.tsx
'use client';

import React from 'react';
import { Database, Shield, Palette, TestTube, CheckCircle, Sparkles } from 'lucide-react';
import { ProjectSettings } from '@/types/project';
import { ConfigurationSummary } from './ConfigurationSummary';
import { ConfigurationSection } from './ConfigurationSection';
import { ProjectDetailsForm } from './ProjectDetailsForm';
import { configCategories } from '@/lib/configuration/config-categories';

interface ProjectConfigurationProps {
  settings: ProjectSettings;
  onSettingsChange: (settings: ProjectSettings) => void;
  configurations: Record<string, any>;
  onConfigurationChange: (configurations: Record<string, any>) => void;
}

export const ProjectConfiguration: React.FC<ProjectConfigurationProps> = ({
  settings,
  onSettingsChange,
  configurations,
  onConfigurationChange
}) => {
  const updateConfiguration = (categoryId: string, value: string) => {
    onConfigurationChange({
      ...configurations,
      [categoryId]: value
    });
  };

  return (
    <div className="p-8 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 min-h-screen">
      {/* Enhanced Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-indigo-600 rounded-full text-white text-sm font-medium mb-6">
          <Sparkles className="w-4 h-4" />
          Configure Your Stack
        </div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-violet-900 bg-clip-text text-transparent mb-4">
          Customize Features & Integrations
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Fine-tune your project with the exact technologies and features you need
        </p>
      </div>

      {/* Project Details */}
      <ProjectDetailsForm 
        settings={settings} 
        onSettingsChange={onSettingsChange} 
      />

      {/* Configuration Sections */}
      <div className="space-y-8">
        {configCategories.map((category) => (
          <ConfigurationSection
            key={category.id}
            category={category}
            selectedValue={configurations[category.id] || category.options[0].id}
            onSelectionChange={(value) => updateConfiguration(category.id, value)}
          />
        ))}
      </div>

      {/* Configuration Summary */}
      <ConfigurationSummary 
        configurations={configurations}
        configCategories={configCategories}
      />
    </div>
  );
};
