// src/steps/step-3-preview/components/TreePreview.tsx
'use client';

import React, { useState } from 'react';
import { ChevronRight, ChevronDown, FileText, Folder, Edit3, Save, X } from 'lucide-react';
import { TreeNode as TreeNodeType } from '@/types/fileTree';
import { countNodes } from '@/lib/fileTreeParser';

interface TreePreviewProps {
  parsedTree: TreeNodeType | null;
}

interface TreeNodeProps {
  node: TreeNodeType;
  depth?: number;
}

const TreeNodeComponent: React.FC<TreeNodeProps> = ({ node, depth = 0 }) => {
  const [expanded, setExpanded] = useState(node.expanded !== false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(node.name);

  const handleSave = () => {
    node.name = editValue;
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(node.name);
    setIsEditing(false);
  };

  return (
    <div className="select-none">
      <div 
        className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer group"
        style={{ paddingLeft: `${depth * 20 + 8}px` }}
      >
        {node.type === 'folder' && (
          <button onClick={() => setExpanded(!expanded)} className="p-1">
            {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        )}
        
        {node.type === 'folder' ? 
          <Folder size={16} className="text-blue-500" /> : 
          <FileText size={16} className="text-gray-500" />
        }
        
        {isEditing ? (
          <div className="flex items-center gap-2 flex-1">
            <input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="px-2 py-1 border rounded text-sm flex-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') handleCancel();
              }}
              autoFocus
            />
            <button onClick={handleSave} className="p-1 text-green-600 hover:bg-green-50 rounded">
              <Save size={12} />
            </button>
            <button onClick={handleCancel} className="p-1 text-red-600 hover:bg-red-50 rounded">
              <X size={12} />
            </button>
          </div>
        ) : (
          <span className="flex-1 text-sm">{node.name}</span>
        )}
        
        <button 
          onClick={() => setIsEditing(true)}
          className="hidden group-hover:block p-1 text-gray-500 hover:text-blue-500"
        >
          <Edit3 size={12} />
        </button>
      </div>
      
      {node.type === 'folder' && expanded && node.children && (
        <div>
          {node.children.map((child, index) => (
            <TreeNodeComponent key={index} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export const TreePreview: React.FC<TreePreviewProps> = ({ parsedTree }) => {
  if (!parsedTree) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Project Structure</h2>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
          Parse a file tree to see the structure preview
        </div>
      </div>
    );
  }

  const { files, folders } = countNodes(parsedTree);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Project Structure</h2>
        <div className="text-sm text-gray-500">
          {files} files, {folders} folders
        </div>
      </div>
      
      <div className="border rounded-lg bg-white max-h-64 overflow-y-auto custom-scrollbar">
        <TreeNodeComponent node={parsedTree} />
      </div>
    </div>
  );
};
