// src/components/FileTreeGenerator.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { TreeNode as TreeNodeType } from '@/types/fileTree';
import { ProjectSettings } from '@/types/project';
import { LanguagePlugin } from '@/types/plugin';
import { FileTreeInput } from './FileTreeInput';
import { TreePreview } from './TreePreview';
import { ProjectConfiguration } from './ProjectConfiguration';
import { ProjectActions } from './ProjectActions';
import { Instructions } from './Instructions';
import { PluginSelector } from './PluginSelector';
import { parseFileTree } from '@/lib/fileTreeParser';
import { pluginManager } from '@/lib/pluginManager';

const FileTreeGenerator = () => {
  const [treeInput, setTreeInput] = useState('');
  const [parsedTree, setParsedTree] = useState<TreeNodeType | null>(null);
  const [selectedPlugin, setSelectedPlugin] = useState<string>('nextjs');
  const [availablePlugins, setAvailablePlugins] = useState<LanguagePlugin[]>([]);
  const [projectSettings, setProjectSettings] = useState<ProjectSettings>({
    name: '',
    description: '',
    private: false,
    gitignore: 'node',
    license: 'MIT',
    readme: true,
    includeVercelConfig: true,
    includeVercelIgnore: true,
    projectType: 'nextjs'
  });
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingPlugins, setIsLoadingPlugins] = useState(true);

  // Initialize plugins on component mount
  useEffect(() => {
    const initializePlugins = async () => {
      try {
        await pluginManager.initialize();
        const plugins = pluginManager.getAllPlugins();
        setAvailablePlugins(plugins);
        
        // Set default sample tree based on selected plugin
        const defaultPlugin = plugins.find(p => p.id === selectedPlugin);
        if (defaultPlugin && !treeInput) {
          setTreeInput(defaultPlugin.sampleTree);
        }
      } catch (error) {
        console.error('Failed to initialize plugins:', error);
      } finally {
        setIsLoadingPlugins(false);
      }
    };

    initializePlugins();
  }, []);

  // Update sample tree when plugin changes
  useEffect(() => {
    const plugin = availablePlugins.find(p => p.id === selectedPlugin);
    if (plugin) {
      setTreeInput(plugin.sampleTree);
      setProjectSettings(prev => ({
        ...prev,
        projectType: plugin.id
      }));
    }
  }, [selectedPlugin, availablePlugins]);

  const handleParseTree = async () => {
    if (!treeInput.trim()) return;
    
    try {
      const parsed = parseFileTree(treeInput);
      
      // Apply plugin preprocessing hooks
      const processedTree = pluginManager.processTree(parsed, projectSettings);
      
      setParsedTree(processedTree);
    } catch (error) {
      console.error('Error parsing file tree:', error);
      alert('Error parsing file tree. Please check the format.');
    }
  };

  const handlePluginChange = (pluginId: string) => {
    setSelectedPlugin(pluginId);
  };

  if (isLoadingPlugins) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading plugins...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          File Tree Generator
        </h1>
        <p className="text-gray-600 text-lg">
          Transform your file structure into a complete project with intelligent content generation
        </p>
      </div>

      {/* Plugin Selector */}
      <PluginSelector
        plugins={availablePlugins}
        selectedPlugin={selectedPlugin}
        onPluginChange={handlePluginChange}
      />

      <div className="grid lg:grid-cols-2 gap-8">
        <FileTreeInput
          treeInput={treeInput}
          setTreeInput={setTreeInput}
          onParseTree={handleParseTree}
          selectedPlugin={selectedPlugin}
          availablePlugins={availablePlugins}
        />
        
        <TreePreview parsedTree={parsedTree} />
      </div>

      {parsedTree && (
        <>
          <ProjectConfiguration
            settings={projectSettings}
            onSettingsChange={setProjectSettings}
            showAdvanced={showAdvancedOptions}
            onToggleAdvanced={() => setShowAdvancedOptions(!showAdvancedOptions)}
            selectedPlugin={selectedPlugin}
            availablePlugins={availablePlugins}
          />

          <ProjectActions
            parsedTree={parsedTree}
            settings={projectSettings}
            isGenerating={isGenerating}
            onGeneratingChange={setIsGenerating}
          />
        </>
      )}

      <Instructions />
    </div>
  );
};

export default FileTreeGenerator;
