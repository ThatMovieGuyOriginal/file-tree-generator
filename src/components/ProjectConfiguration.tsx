// src/components/ProjectConfiguration.tsx
'use client';

import React from 'react';
import { ProjectSettings } from '@/types/project';

interface ProjectConfigurationProps {
  settings: ProjectSettings;
  onSettingsChange: (settings: ProjectSettings) => void;
  showAdvanced: boolean;
  onToggleAdvanced: () => void;
}

export const ProjectConfiguration: React.FC<ProjectConfigurationProps> = ({
  settings,
  onSettingsChange,
  showAdvanced,
  onToggleAdvanced
}) => {
  const updateSetting = (key: keyof ProjectSettings, value: any) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <div className="space-y-6 border-t pt-8">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold">Project Settings</h2>
        <button
          onClick={onToggleAdvanced}
          className="text-blue-600 hover:text-blue-800 text-sm underline"
        >
          {showAdvanced ? 'Hide' : 'Show'} Advanced Options
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Project Name
          </label>
          <input
            type="text"
            value={settings.name}
            onChange={(e) => updateSetting('name', e.target.value)}
            placeholder="my-awesome-project"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <input
            type="text"
            value={settings.description}
            onChange={(e) => updateSetting('description', e.target.value)}
            placeholder="A brief description of your project"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {showAdvanced && (
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Type
              </label>
              <select
                value={settings.projectType}
                onChange={(e) => updateSetting('projectType', e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="nextjs">Next.js</option>
                <option value="react">React</option>
                <option value="vue">Vue.js</option>
                <option value="node">Node.js</option>
                <option value="static">Static Site</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                .gitignore Template
              </label>
              <select
                value={settings.gitignore}
                onChange={(e) => updateSetting('gitignore', e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="node">Node.js</option>
                <option value="react">React</option>
                <option value="next">Next.js</option>
                <option value="python">Python</option>
                <option value="none">None</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                License
              </label>
              <select
                value={settings.license}
                onChange={(e) => updateSetting('license', e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="MIT">MIT</option>
                <option value="Apache-2.0">Apache 2.0</option>
                <option value="GPL-3.0">GPL 3.0</option>
                <option value="BSD-3-Clause">BSD 3-Clause</option>
                <option value="none">None</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700">Project Files</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.readme}
                    onChange={(e) => updateSetting('readme', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm">Include .vercelignore</span>
                </label>
              </div>
              
              {(settings.includeVercelConfig || settings.includeVercelIgnore) && (
                <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                  ✓ Optimized for Vercel deployment with proper build configuration
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};-sm">Include README.md</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.private}
                    onChange={(e) => updateSetting('private', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm">Private Repository</span>
                </label>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700">Deployment</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.includeVercelConfig}
                    onChange={(e) => updateSetting('includeVercelConfig', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm">Include vercel.json</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.includeVercelIgnore}
                    onChange={(e) => updateSetting('includeVercelIgnore', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text
