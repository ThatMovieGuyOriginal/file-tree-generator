// src/steps/step-3-preview/components/EnhancedPreview.tsx
'use client';

import React, { useState } from 'react';
import { TreeNode } from '@/types/fileTree';
import { ProjectSettings } from '@/types/project';
import { Template } from '@/lib/template-manager';
import { DeploymentPlatform } from '@/lib/deployment-manager';
import { PreviewHeader } from './PreviewHeader';
import { StructureView } from './StructureView';
import { FilesView } from './FilesView';
import { LivePreview } from './LivePreview';
import { DeploymentView } from './DeploymentView';
import { PreviewFooter } from './PreviewFooter';
import { Monitor, Code, FolderTree, Rocket, Eye, Maximize2, Minimize2 } from 'lucide-react';

interface EnhancedPreviewProps {
  tree: TreeNode;
  files: Record<string, string>;
  settings: ProjectSettings;
  template?: Template;
  onDeploy: (platform: DeploymentPlatform['id']) => void;
  onDownload: () => void;
}

export type PreviewTab = 'structure' | 'files' | 'preview' | 'deploy';

const tabs = [
  { 
    id: 'structure' as const, 
    label: 'Project Structure', 
    icon: FolderTree,
    description: 'Explore your project hierarchy'
  },
  { 
    id: 'files' as const, 
    label: 'Generated Files', 
    icon: Code,
    description: 'View all generated code and configs'
  },
  { 
    id: 'preview' as const, 
    label: 'Live Preview', 
    icon: Monitor,
    description: 'See your app in action'
  },
  { 
    id: 'deploy' as const, 
    label: 'Deploy Now', 
    icon: Rocket,
    description: 'Deploy to production platforms'
  }
];

export const EnhancedPreview: React.FC<EnhancedPreviewProps> = ({
  tree,
  files,
  settings,
  template,
  onDeploy,
  onDownload
}) => {
  const [activeTab, setActiveTab] = useState<PreviewTab>('preview');
  const [isExpanded, setIsExpanded] = useState(false);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'structure':
        return <StructureView tree={tree} />;
      case 'files':
        return <FilesView files={files} />;
      case 'preview':
        return <LivePreview template={template} />;
      case 'deploy':
        return <DeploymentView template={template} onDeploy={onDeploy} />;
      default:
        return <StructureView tree={tree} />;
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        {/* Enhanced Header */}
        <div className="mb-8">
          <PreviewHeader 
            settings={settings} 
            template={template}
            onDownload={onDownload} 
          />
        </div>

        {/* Main Preview Card */}
        <div className={`bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden transition-all duration-500 ${
          isExpanded ? 'fixed inset-4 z-50' : 'relative'
        }`}>
          
          {/* Tab Navigation */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
            <div className="flex items-center justify-between p-6">
              <nav className="flex space-x-1">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  const isActive = activeTab === tab.id;
                  
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        relative flex items-center gap-3 px-6 py-4 rounded-xl font-medium transition-all duration-200
                        ${isActive 
                          ? 'bg-white text-indigo-700 shadow-lg ring-2 ring-indigo-500/20' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                        }
                      `}
                    >
                      <IconComponent className={`w-5 h-5 ${isActive ? 'text-indigo-600' : ''}`} />
                      <div className="text-left">
                        <div className="font-semibold">{tab.label}</div>
                        <div className="text-xs opacity-75">{tab.description}</div>
                      </div>
                      
                      {isActive && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-t-full" />
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* Expand/Collapse Button */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-3 text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-xl transition-all duration-200"
                title={isExpanded ? 'Exit fullscreen' : 'Enter fullscreen'}
              >
                {isExpanded ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </button>
            </div>
          </div>
          
          {/* Content Area */}
          <div className={`${isExpanded ? 'h-[calc(100vh-200px)]' : 'h-[600px]'} overflow-hidden`}>
            {renderTabContent()}
          </div>
          
          {/* Footer */}
          <PreviewFooter 
            files={files}
            template={template}
            settings={settings}
          />
        </div>

        {/* Additional Info Cards */}
        {!isExpanded && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Performance Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg text-white">
                  <Eye className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-gray-900">Performance</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Lighthouse Score</span>
                  <span className="font-bold text-green-600">100/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Build Time</span>
                  <span className="font-bold text-blue-600">~30s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bundle Size</span>
                  <span className="font-bold text-purple-600">Optimized</span>
                </div>
              </div>
            </div>

            {/* Security Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg text-white">
                  <Monitor className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-gray-900">Security</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Security Headers</span>
                  <span className="font-bold text-green-600">✓ Enabled</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">HTTPS Ready</span>
                  <span className="font-bold text-green-600">✓ Yes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Security Grade</span>
                  <span className="font-bold text-green-600">A+</span>
                </div>
              </div>
            </div>

            {/* Features Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg text-white">
                  <Code className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-gray-900">Tech Stack</h3>
              </div>
              <div className="space-y-2">
                {template && (
                  <>
                    <div className="px-3 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium">
                      {template.stack.framework.toUpperCase()}
                    </div>
                    <div className="px-3 py-2 bg-purple-100 text-purple-800 rounded-lg text-sm font-medium">
                      {template.stack.styling}
                    </div>
                    {template.stack.database && (
                      <div className="px-3 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-medium">
                        {template.stack.database}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Overlay for expanded mode */}
        {isExpanded && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setIsExpanded(false)}
          />
        )}
      </div>
    </div>
  );
};

// Enhanced Structure View with better styling
export const EnhancedStructureView: React.FC<{ tree: TreeNode }> = ({ tree }) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set([tree.name]));

  const toggleFolder = (folderPath: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderPath)) {
      newExpanded.delete(folderPath);
    } else {
      newExpanded.add(folderPath);
    }
    setExpandedFolders(newExpanded);
  };

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    const iconMap: Record<string, string> = {
      'tsx': '⚛️', 'jsx': '⚛️', 'ts': '📘', 'js': '📜',
      'css': '🎨', 'scss': '🎨', 'json': '📋', 'md': '📝',
      'png': '🖼️', 'jpg': '🖼️', 'svg': '🖼️', 'ico': '🖼️'
    };
    return iconMap[ext || ''] || '📄';
  };

  const renderTreeNode = (node: TreeNode, path: string = '', depth: number = 0) => {
    const currentPath = path ? `${path}/${node.name}` : node.name;
    const isExpanded = expandedFolders.has(currentPath);

    return (
      <div key={currentPath}>
        <div
          className={`
            flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200
            hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 group
          `}
          style={{ paddingLeft: `${depth * 24 + 16}px` }}
          onClick={() => {
            if (node.type === 'folder') {
              toggleFolder(currentPath);
            }
          }}
        >
          {/* Expand/Collapse Button */}
          {node.type === 'folder' && (
            <button className="p-1 rounded transition-transform duration-200">
              <svg 
                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                  isExpanded ? 'rotate-90' : ''
                }`}
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          )}
          
          {/* File/Folder Icon */}
          <div className="text-lg">
            {node.type === 'folder' ? '📁' : getFileIcon(node.name)}
          </div>
          
          {/* Name */}
          <span className={`font-medium transition-colors duration-200 ${
            node.type === 'folder' ? 'text-blue-700 group-hover:text-blue-800' : 'text-gray-700 group-hover:text-gray-900'
          }`}>
            {node.name}
          </span>
          
          {/* File type badge */}
          {node.type === 'file' && (
            <span className="ml-auto px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
              {node.name.split('.').pop()?.toUpperCase()}
            </span>
          )}
        </div>
        
        {/* Children */}
        {node.type === 'folder' && isExpanded && node.children && (
          <div className="ml-2">
            {node.children.map((child, index) => 
              renderTreeNode(child, currentPath, depth + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full bg-gradient-to-br from-gray-50 to-blue-50/30 p-6 overflow-auto">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 h-full">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg text-white">
            <FolderTree className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Project Structure</h3>
            <p className="text-gray-600 text-sm">Explore your generated file hierarchy</p>
          </div>
        </div>
        
        <div className="space-y-1 max-h-full overflow-auto">
          {renderTreeNode(tree)}
        </div>
      </div>
    </div>
  );
};
