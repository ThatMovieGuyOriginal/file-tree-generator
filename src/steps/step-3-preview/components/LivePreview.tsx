// src/steps/step-3-preview/components/LivePreview.tsx - ENHANCED WITH PREVIEW TEMPLATES
import React, { useState } from 'react';
import { Eye, ExternalLink } from 'lucide-react';
import { Template } from '@/lib/template-manager';
import { DeviceSelector } from './DeviceSelector';
import { getPreviewTemplate } from '@/lib/preview-templates';

interface LivePreviewProps {
  template?: Template;
}

export type DeviceMode = 'desktop' | 'tablet' | 'mobile';

export const LivePreview: React.FC<LivePreviewProps> = ({ template }) => {
  const [previewMode, setPreviewMode] = useState<DeviceMode>('desktop');
  const [previewContent, setPreviewContent] = useState<string>('');

  React.useEffect(() => {
    if (template) {
      try {
        // Use the preview templates system
        const content = getPreviewTemplate(template.id);
        setPreviewContent(content);
      } catch (error) {
        console.error('Failed to generate preview:', error);
        setPreviewContent(getPreviewTemplate('default'));
      }
    }
  }, [template]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Eye size={16} />
          <span className="font-medium">Live Preview</span>
          {template && (
            <span className="text-sm text-gray-500">({template.name})</span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <DeviceSelector 
            mode={previewMode}
            onModeChange={setPreviewMode}
          />
          
          <button
            onClick={() => {
              const blob = new Blob([previewContent], { type: 'text/html' });
              const url = URL.createObjectURL(blob);
              window.open(url, '_blank');
            }}
            className="flex items-center gap-1 text-xs bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
          >
            <ExternalLink size={12} />
            Open in New Tab
          </button>
        </div>
      </div>
      
      <div className="flex-1 p-4 bg-gray-100 flex items-center justify-center">
        <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${getDeviceStyles(previewMode)}`}>
          {previewContent ? (
            <iframe
              srcDoc={previewContent}
              className="w-full h-full border-0"
              title="App Preview"
              sandbox="allow-scripts allow-same-origin"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              Loading preview...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
