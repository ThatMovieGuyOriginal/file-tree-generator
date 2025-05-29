// src/components/PluginSelector.tsx
'use client';

import React from 'react';
import { LanguagePlugin } from '@/types/plugin';
import { Code, Server, Globe, Smartphone, Monitor, Database } from 'lucide-react';

interface PluginSelectorProps {
  plugins: LanguagePlugin[];
  selectedPlugin: string;
  onPluginChange: (pluginId: string) => void;
}

const categoryIcons = {
  frontend: Globe,
  backend: Server,
  fullstack: Code,
  mobile: Smartphone,
  desktop: Monitor,
  data: Database,
};

const categoryColors = {
  frontend: 'from-blue-500 to-cyan-500',
  backend: 'from-green-500 to-emerald-500',
  fullstack: 'from-purple-500 to-pink-500',
  mobile: 'from-orange-500 to-red-500',
  desktop: 'from-gray-500 to-slate-500',
  data: 'from-yellow-500 to-amber-500',
};

const difficultyColors = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-yellow-100 text-yellow-800',
  advanced: 'bg-red-100 text-red-800',
};

export const PluginSelector: React.FC<PluginSelectorProps> = ({
  plugins,
  selectedPlugin,
  onPluginChange
}) => {
  const groupedPlugins = plugins.reduce((acc, plugin) => {
    if (!acc[plugin.category]) {
      acc[plugin.category] = [];
    }
    acc[plugin.category].push(plugin);
    return acc;
  }, {} as Record<string, LanguagePlugin[]>);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Choose Your Stack</h2>
        <p className="text-gray-600">Select a language or framework to get started</p>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedPlugins).map(([category, categoryPlugins]) => {
          const IconComponent = categoryIcons[category as keyof typeof categoryIcons] || Code;
          const gradientColor = categoryColors[category as keyof typeof categoryColors];
          
          return (
            <div key={category} className="space-y-3">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${gradientColor}`}>
                  <IconComponent className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 capitalize">
                  {category}
                </h3>
                <span className="text-sm text-gray-500">
                  ({categoryPlugins.length} {categoryPlugins.length === 1 ? 'option' : 'options'})
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryPlugins.map((plugin) => (
                  <div
                    key={plugin.id}
                    onClick={() => onPluginChange(plugin.id)}
                    className={`
                      relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md
                      ${selectedPlugin === plugin.id
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                      }
                    `}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{plugin.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{plugin.description}</p>
                      </div>
                      
                      {selectedPlugin === plugin.id && (
                        <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex flex-wrap gap-1">
                        {plugin.metadata?.tags?.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      {plugin.metadata?.difficulty && (
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            difficultyColors[plugin.metadata.difficulty]
                          }`}
                        >
                          {plugin.metadata.difficulty}
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>v{plugin.version}</span>
                        <span>{plugin.extensions.length} file types</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Plugin Info */}
      {selectedPlugin && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
          {(() => {
            const plugin = plugins.find(p => p.id === selectedPlugin);
            if (!plugin) return null;
            
            return (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${categoryColors[plugin.category]}`}>
                    {(() => {
                      const IconComponent = categoryIcons[plugin.category] || Code;
                      return <IconComponent className="h-5 w-5 text-white" />;
                    })()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{plugin.name} Selected</h3>
                    <p className="text-sm text-gray-600">{plugin.description}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {plugin.dependencies?.runtime?.length || 0}
                    </div>
                    <div className="text-xs text-gray-600">Dependencies</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {plugin.extensions.length}
                    </div>
                    <div className="text-xs text-gray-600">File Types</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {plugin.configFiles.length}
                    </div>
                    <div className="text-xs text-gray-600">Config Files</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {plugin.metadata?.difficulty === 'beginner' ? '⭐' : 
                       plugin.metadata?.difficulty === 'intermediate' ? '⭐⭐' : '⭐⭐⭐'}
                    </div>
                    <div className="text-xs text-gray-600">Difficulty</div>
                  </div>
                </div>
                
                {plugin.metadata?.documentation && (
                  <div className="pt-4 border-t border-blue-200">
                    <a
                      href={plugin.metadata.documentation}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      📚 View Documentation
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
