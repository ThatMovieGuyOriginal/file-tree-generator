// src/components/preview/PreviewFooter.tsx
import React from 'react';
import { Shield } from 'lucide-react';
import { ProjectSettings } from '@/types/project';
import { Template } from '@/lib/template-manager';

interface PreviewFooterProps {
  files: Record<string, string>;
  template?: Template;
  settings: ProjectSettings;
}

export const PreviewFooter: React.FC<PreviewFooterProps> = ({
  files,
  template,
  settings
}) => {
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
    <div className="border-t bg-gray-50 px-6 py-4">
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-indigo-600">{stats.totalFiles}</div>
          <div className="text-sm text-gray-600">Files</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{stats.totalLines.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Lines</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{Math.round(stats.totalSize / 1024)}kb</div>
          <div className="text-sm text-gray-600">Size</div>
        </div>
      </div>

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
  );
};
