// src/steps/step-2-configuration/components/ProjectConfiguration.tsx
'use client';

import React from 'react';
import { ProjectSettings } from '@/types/project';
import { LanguagePlugin } from '@/types/plugin';

interface ProjectConfigurationProps {
  settings: ProjectSettings;
  onSettingsChange: (settings: ProjectSettings) => void;
  showAdvanced: boolean;
  onToggleAdvanced: () => void;
  selectedPlugin?: string;
  availablePlugins?: LanguagePlugin[];
}

export const ProjectConfiguration: React.FC<ProjectConfigurationProps> = ({
  settings,
  onSettingsChange,
  showAdvanced,
  onToggleAdvanced,
  selectedPlugin,
  availablePlugins = []
}) => {
  const updateSetting = (key: keyof ProjectSettings, value: any) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const currentPlugin = availablePlugins.find(plugin => plugin.id === selectedPlugin);

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

      {/* Plugin-specific settings preview */}
      {currentPlugin && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">
            {currentPlugin.name} Configuration
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-blue-700 font-medium">Dependencies:</span>
              <div className="text-blue-600">
                {currentPlugin.dependencies?.runtime?.length || 0} runtime
              </div>
            </div>
            <div>
              <span className="text-blue-700 font-medium">Dev Dependencies:</span>
              <div className="text-blue-600">
                {currentPlugin.dependencies?.devDependencies?.length || 0} dev
              </div>
            </div>
            <div>
              <span className="text-blue-700 font-medium">File Types:</span>
              <div className="text-blue-600">
                {currentPlugin.extensions.length} types
              </div>
            </div>
            <div>
              <span className="text-blue-700 font-medium">Config Files:</span>
              <div className="text-blue-600">
                {currentPlugin.configFiles.length} files
              </div>
            </div>
          </div>
        </div>
      )}

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
                {availablePlugins.map(plugin => (
                  <option key={plugin.id} value={plugin.id}>
                    {plugin.name}
                  </option>
                ))}
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
                <option value="go">Go</option>
                <option value="rust">Rust</option>
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
                <option value="ISC">ISC</option>
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
                    className="mr-2 rounded"
                  />
                  <span className="text-sm">Include README.md</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.private}
                    onChange={(e) => updateSetting('private', e.target.checked)}
                    className="mr-2 rounded"
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
                    className="mr-2 rounded"
                  />
                  <span className="text-sm">Include vercel.json</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.includeVercelIgnore}
                    onChange={(e) => updateSetting('includeVercelIgnore', e.target.checked)}
                    className="mr-2 rounded"
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

          {/* Plugin-specific advanced options */}
          {currentPlugin && currentPlugin.metadata && (
            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                {currentPlugin.name} Specific Options
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded border">
                  <h5 className="text-sm font-medium text-gray-800 mb-2">Framework Info</h5>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div>Category: <span className="font-medium capitalize">{currentPlugin.category}</span></div>
                    <div>Difficulty: <span className="font-medium capitalize">{currentPlugin.metadata.difficulty}</span></div>
                    <div>Version: <span className="font-medium">v{currentPlugin.version}</span></div>
                  </div>
                </div>
                
                <div className="bg-white p-3 rounded border">
                  <h5 className="text-sm font-medium text-gray-800 mb-2">Supported Extensions</h5>
                  <div className="flex flex-wrap gap-1">
                    {currentPlugin.extensions.map(ext => (
                      <span 
                        key={ext} 
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                      >
                        {ext}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              {currentPlugin.metadata.documentation && (
                <div className="mt-3">
                  <a
                    href={currentPlugin.metadata.documentation}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    📚 View {currentPlugin.name} Documentation
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
