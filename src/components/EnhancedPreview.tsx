// src/components/EnhancedPreview.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  Code, 
  FileText, 
  Folder, 
  ChevronRight, 
  ChevronDown, 
  Download,
  ExternalLink,
  Play,
  Settings,
  Zap,
  Shield,
  Database,
  Palette
} from 'lucide-react';
import { TreeNode } from '@/types/fileTree';
import { ProjectSettings } from '@/types/project';
import { Template } from '@/lib/template-manager';
import { DeploymentPlatform } from '@/lib/deployment-manager';

interface EnhancedPreviewProps {
  tree: TreeNode;
  files: Record<string, string>;
  settings: ProjectSettings;
  template?: Template;
  onDeploy: (platform: DeploymentPlatform['id']) => void;
  onDownload: () => void;
}

export const EnhancedPreview: React.FC<EnhancedPreviewProps> = ({
  tree,
  files,
  settings,
  template,
  onDeploy,
  onDownload
}) => {
  const [activeTab, setActiveTab] = useState<'structure' | 'files' | 'preview' | 'deploy'>('structure');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  useEffect(() => {
    // Auto-expand first level folders
    const firstLevelFolders = tree.children?.filter(child => child.type === 'folder').map(child => child.name) || [];
    setExpandedFolders(new Set(firstLevelFolders));
  }, [tree]);

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
    const isSelected = selectedFile === currentPath;

    return (
      <div key={currentPath} className="select-none">
        <div
          className={`flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-50 cursor-pointer transition-colors ${
            isSelected ? 'bg-blue-50 border-l-2 border-blue-500' : ''
          }`}
          style={{ paddingLeft: `${depth * 20 + 8}px` }}
          onClick={() => {
            if (node.type === 'folder') {
              toggleFolder(currentPath);
            } else {
              setSelectedFile(currentPath);
              setActiveTab('files');
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
            <FileText size={16} className={getFileIconColor(node.name)} />
          )}
          
          <span className="text-sm font-medium">{node.name}</span>
          
          {node.type === 'file' && files[currentPath] && (
            <span className="text-xs text-gray-500 ml-auto">
              {Math.round(files[currentPath].length / 1024)}kb
            </span>
          )}
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

  const getFileIconColor = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'tsx':
      case 'jsx':
        return 'text-blue-600';
      case 'ts':
      case 'js':
        return 'text-yellow-600';
      case 'css':
      case 'scss':
        return 'text-pink-600';
      case 'json':
        return 'text-green-600';
      case 'md':
        return 'text-gray-600';
      default:
        return 'text-gray-500';
    }
  };

  const renderFileContent = () => {
    if (!selectedFile || !files[selectedFile]) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center">
            <FileText size={48} className="mx-auto mb-4 opacity-50" />
            <p>Select a file to view its content</p>
          </div>
        </div>
      );
    }

    const content = files[selectedFile];
    const isCode = selectedFile.match(/\.(tsx?|jsx?|css|scss|json|md|py|go|rs)$/i);

    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <FileText size={16} className={getFileIconColor(selectedFile)} />
            <span className="font-medium">{selectedFile}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              {content.split('\n').length} lines
            </span>
            <button
              onClick={() => navigator.clipboard.writeText(content)}
              className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
            >
              Copy
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto">
          {isCode ? (
            <pre className="p-4 text-sm font-mono bg-gray-50 min-h-full">
              <code className="language-typescript">{content}</code>
            </pre>
          ) : (
            <div className="p-4 whitespace-pre-wrap text-sm">
              {content}
            </div>
          )}
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.totalFiles}</div>
            <div className="text-sm opacity-90">Files</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.totalLines.toLocaleString()}</div>
            <div className="text-sm opacity-90">Lines</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{Math.round(stats.totalSize / 1024)}kb</div>
            <div className="text-sm opacity-90">Size</div>
          </div>
        </div>
      </div>

      {/* Template Features */}
      {template && (
        <div className="border-b bg-gray-50 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Template Features</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              template.complexity === 'starter' ? 'bg-green-100 text-green-800' :
              template.complexity === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {template.complexity}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {template.features.map((feature, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-white border rounded-full text-sm"
              >
                {getFeatureIcon(feature)}
                {feature}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex">
          {[
            { id: 'structure', label: 'Project Structure', icon: Folder },
            { id: 'files', label: 'File Contents', icon: Code },
            { id: 'preview', label: 'Live Preview', icon: Eye },
            { id: 'deploy', label: 'Deploy', icon: Settings }
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <IconComponent size={16} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="h-96">
        {activeTab === 'structure' && (
          <div className="h-full overflow-auto p-4">
            <div className="space-y-1">
              {renderTreeNode(tree)}
            </div>
          </div>
        )}

        {activeTab === 'files' && (
          <div className="h-full flex">
            <div className="w-1/3 border-r overflow-auto">
              <div className="p-2">
                <h4 className="font-medium text-gray-900 mb-2">Files</h4>
                <div className="space-y-1">
                  {Object.keys(files).map((filePath) => (
                    <button
                      key={filePath}
                      onClick={() => setSelectedFile(filePath)}
                      className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                        selectedFile === filePath
                          ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-500'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <FileText size={14} className={getFileIconColor(filePath)} />
                        <span className="truncate">{filePath}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex-1">
              {renderFileContent()}
            </div>
          </div>
        )}

        {activeTab === 'preview' && renderPreview()}
        {activeTab === 'deploy' && renderDeployment()}
      </div>

      {/* Footer */}
      <div className="border-t bg-gray-50 px-6 py-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <span>Generated with File Tree Generator</span>
            {template && (
              <span>• Template: {template.name}</span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <span>Ready for production</span>
            <Shield size={14} className="text-green-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to get feature icons
const getFeatureIcon = (feature: string) => {
  if (feature.toLowerCase().includes('auth')) return <Shield size={12} />;
  if (feature.toLowerCase().includes('database')) return <Database size={12} />;
  if (feature.toLowerCase().includes('payment')) return <Zap size={12} />;
  if (feature.toLowerCase().includes('ui') || feature.toLowerCase().includes('styling')) return <Palette size={12} />;
  return <Settings size={12} />;
};
    );
  };

  const renderPreview = () => {
    const previewUrl = template?.category === 'saas' ? 
      'https://saas-preview.example.com' : 
      'https://app-preview.example.com';
    
    const deviceStyles = {
      desktop: 'w-full h-96',
      tablet: 'w-3/4 h-96 mx-auto',
      mobile: 'w-96 h-96 mx-auto'
    };

    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Eye size={16} />
            <span className="font-medium">Live Preview</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border">
              {(['desktop', 'tablet', 'mobile'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setPreviewMode(mode)}
                  className={`px-3 py-1 text-xs rounded ${
                    previewMode === mode 
                      ? 'bg-blue-500 text-white' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => window.open(previewUrl, '_blank')}
              className="flex items-center gap-1 text-xs bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
            >
              <ExternalLink size={12} />
              Open
            </button>
          </div>
        </div>
        
        <div className="flex-1 p-4 bg-gray-100 flex items-center justify-center">
          <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${deviceStyles[previewMode]}`}>
            <iframe
              src="/api/preview"
              className="w-full h-full"
              title="App Preview"
            />
          </div>
        </div>
      </div>
    );
  };

  const renderDeployment = () => {
    const platforms = [
      {
        id: 'vercel' as const,
        name: 'Vercel',
        icon: '▲',
        color: 'from-black to-gray-800',
        recommended: template?.stack.framework === 'nextjs'
      },
      {
        id: 'netlify' as const,
        name: 'Netlify',
        icon: '◆',
        color: 'from-teal-500 to-cyan-600',
        recommended: false
      },
      {
        id: 'railway' as const,
        name: 'Railway',
        icon: '🚂',
        color: 'from-purple-500 to-pink-600',
        recommended: false
      }
    ];

    return (
      <div className="p-6 space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">Choose Deployment Platform</h3>
          <p className="text-gray-600">Deploy your application with one click</p>
        </div>
        
        <div className="grid gap-4">
          {platforms.map((platform) => (
            <div
              key={platform.id}
              onClick={() => onDeploy(platform.id)}
              className={`
                relative p-6 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg
                bg-gradient-to-r ${platform.color} text-white group
              `}
            >
              {platform.recommended && (
                <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
                  Recommended
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{platform.icon}</div>
                  <div>
                    <h4 className="text-lg font-semibold">{platform.name}</h4>
                    <p className="text-sm opacity-90">
                      {platform.name === 'Vercel' ? 'Optimal for Next.js applications' :
                       platform.name === 'Netlify' ? 'Great for JAMstack and static sites' :
                       'Simple deployment for full-stack apps'}
                    </p>
                  </div>
                </div>
                
                <Play className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Zap className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">Ready for Production</h4>
              <p className="text-sm text-blue-700 mt-1">
                Your project includes production-ready configurations, security headers, 
                and performance optimizations.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getProjectStats = () => {
    const totalFiles = Object.keys(files).length;
    const totalLines = Object.values(files).reduce((acc, content) => 
      acc + content.split('\n').length, 0
    );
    const totalSize = Object.values(files).reduce((acc, content) => 
      acc + content.length, 0
    );

    return { totalFiles, totalLines, totalSize };
  };

  const stats = getProjectStats();

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{settings.name || 'My Project'}</h2>
            <p className="opacity-90">{settings.description || 'Generated with File Tree Generator'}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={onDownload}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
            >
              <Download size={16} />
              Download
            </button>
          </div>
        </div>
