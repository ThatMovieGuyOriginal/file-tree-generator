// src/components/FileTreeInput.tsx (full refactor)
'use client';

import React from 'react';
import { LanguagePlugin } from '@/types/plugin';
import { getSampleByType } from '@/lib/sampleData';

interface FileTreeInputProps {
  treeInput: string;
  setTreeInput: (value: string) => void;
  onParseTree: () => void;
  selectedPlugin?: string;
  availablePlugins?: LanguagePlugin[];
}

export const FileTreeInput: React.FC<FileTreeInputProps> = ({
  treeInput,
  setTreeInput,
  onParseTree,
  selectedPlugin,
  availablePlugins = []
}) => {
  const currentPlugin = availablePlugins.find(plugin => plugin.id === selectedPlugin);
  
  const loadSampleTree = () => {
    if (currentPlugin) {
      setTreeInput(currentPlugin.sampleTree);
    } else {
      // Fallback to default sample
      setTreeInput(getSampleByType('nextjs'));
    }
  };
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">File Tree Input</h2>
        <div className="flex items-center gap-3">
          {currentPlugin && (
            <span className="text-sm text-gray-600">
              {currentPlugin.name} Template
            </span>
          )}
          <button
            onClick={loadSampleTree}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            Load Sample
          </button>
        </div>
      </div>
      
      <textarea
        value={treeInput}
        onChange={(e) => setTreeInput(e.target.value)}
        placeholder="Paste your file tree here..."
        className="w-full h-64 p-4 border rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      
      <button
        onClick={onParseTree}
        disabled={!treeInput.trim()}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      >
        Parse File Tree
      </button>
    </div>
  );
};
