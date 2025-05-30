// src/steps/step-3-preview/components/EnhancedPreview.tsx
'use client';

import React, { useState } from 'react';
import { TreeNode } from '@/types/fileTree';
import { ProjectSettings } from '@/types/project';
import { Template } from '@/lib/template-manager';
import { DeploymentPlatform } from '@/lib/deployment-manager';
import { PreviewHeader } from './PreviewHeader';
import { PreviewTabs } from './PreviewTabs';
import { StructureView } from './StructureView';
import { FilesView } from './FilesView';
import { LivePreview } from './LivePreview';
import { DeploymentView } from './DeploymentView';
import { PreviewFooter } from './PreviewFooter';

interface EnhancedPreviewProps {
  tree: TreeNode;
  files: Record<string, string>;
  settings: ProjectSettings;
  template?: Template;
  onDeploy: (platform: DeploymentPlatform['id']) => void;
  onDownload: () => void;
}

export type PreviewTab = 'structure' | 'files' | 'preview' | 'deploy';

export const EnhancedPreview: React.FC<EnhancedPreviewProps> = ({
  tree,
  files,
  settings,
  template,
  onDeploy,
  onDownload
}) => {
  const [activeTab, setActiveTab] = useState<PreviewTab>('structure');

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
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <PreviewHeader 
        settings={settings} 
        template={template}
        onDownload={onDownload} 
      />
      
      <PreviewTabs 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
      
      <div className="h-96">
        {renderTabContent()}
      </div>
      
      <PreviewFooter 
        files={files}
        template={template}
        settings={settings}
      />
    </div>
  );
};
