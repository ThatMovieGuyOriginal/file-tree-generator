// ssrc/steps/step-3-preview/components/PreviewTabs.tsx
import React from 'react';
import { Folder, Code, Eye, Settings } from 'lucide-react';
import { PreviewTab } from './EnhancedPreview';

interface PreviewTabsProps {
  activeTab: PreviewTab;
  onTabChange: (tab: PreviewTab) => void;
}

const tabs = [
  { id: 'structure' as const, label: 'Project Structure', icon: Folder },
  { id: 'files' as const, label: 'File Contents', icon: Code },
  { id: 'preview' as const, label: 'Live Preview', icon: Eye },
  { id: 'deploy' as const, label: 'Deploy', icon: Settings }
];

export const PreviewTabs: React.FC<PreviewTabsProps> = ({
  activeTab,
  onTabChange
}) => {
  return (
    <div className="border-b">
      <nav className="flex">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
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
  );
};
