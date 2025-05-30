// src/steps/step-3-preview/components/StructureView.tsx
import React, { useState } from 'react';
import { ChevronRight, ChevronDown, FileText, Folder } from 'lucide-react';
import { TreeNode } from '@/types/fileTree';

interface StructureViewProps {
  tree: TreeNode;
}

export const StructureView: React.FC<StructureViewProps> = ({ tree }) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const toggleFolder = (folderPath: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderPath)) {
      newExpanded.delete(folderPath);
    } else {
      newExpanded.add(folderPath);
    }
    setExpandedFolders(newExpanded);
  };

  const renderTreeNode = (node: TreeNode, path: string = '', depth: number = 0) => {
    const currentPath = path ? `${path}/${node.name}` : node.name;
    const isExpanded = expandedFolders.has(currentPath);

    return (
      <div key={currentPath} className="select-none">
        <div
          className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-50 cursor-pointer transition-colors"
          style={{ paddingLeft: `${depth * 20 + 8}px` }}
          onClick={() => {
            if (node.type === 'folder') {
              toggleFolder(currentPath);
            }
          }}
        >
          {node.type === 'folder' && (
            <button className="p-0.5">
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          )}
          
          {node.type === 'folder' ? (
            <Folder size={16} className="text-blue-500" />
          ) : (
            <FileText size={16} className="text-gray-500" />
          )}
          
          <span className="text-sm font-medium">{node.name}</span>
        </div>
        
        {node.type === 'folder' && isExpanded && node.children && (
          <div>
            {node.children.map((child, index) => 
              renderTreeNode(child, currentPath, depth + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full overflow-auto p-4">
      <div className="space-y-1">
        {renderTreeNode(tree)}
      </div>
    </div>
  );
};
