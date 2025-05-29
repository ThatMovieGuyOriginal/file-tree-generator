// src/components/preview/PreviewHeader.tsx
import React from 'react';
import { Download } from 'lucide-react';
import { ProjectSettings } from '@/types/project';
import { Template } from '@/lib/template-manager';
import { TemplateFeatures } from './TemplateFeatures';

interface PreviewHeaderProps {
  settings: ProjectSettings;
  template?: Template;
  onDownload: () => void;
}

export const PreviewHeader: React.FC<PreviewHeaderProps> = ({
  settings,
  template,
  onDownload
}) => {
  return (
    <>
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
      </div>

      {template && <TemplateFeatures template={template} />}
    </>
  );
};
