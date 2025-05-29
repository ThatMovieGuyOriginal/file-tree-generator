// src/components/FileTreeInput.tsx
'use client';

import React from 'react';
import { sampleFileTree } from '@/lib/sampleData';

interface FileTreeInputProps {
  treeInput: string;
  setTreeInput: (value: string) => void;
  onParseTree: () => void;
}

export const FileTreeInput: React.FC<FileTreeInputProps> = ({
  treeInput,
  setTreeInput,
  onParseTree
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">File Tree Input</h2>
        <button
          onClick={() => setTreeInput(sampleFileTree)}
          className="text-sm text-blue-600 hover:text-blue-800 underline"
        >
          Load Sample
        </button>
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
