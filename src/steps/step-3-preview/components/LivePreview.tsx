// src/steps/step-3-preview/components/LivePreview.tsx
import React, { useState } from 'react';
import { Eye, ExternalLink } from 'lucide-react';
import { Template } from '@/lib/template-manager';
import { DeviceSelector } from './DeviceSelector';

interface LivePreviewProps {
  template?: Template;
}

export type DeviceMode = 'desktop' | 'tablet' | 'mobile';

export const LivePreview: React.FC<LivePreviewProps> = ({ template }) => {
  const [previewMode, setPreviewMode] = useState<DeviceMode>('desktop');

  const previewUrl = template?.category === 'saas' ? 
    '/api/preview?template=saas' : 
    '/api/preview?template=default';

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Eye size={16} />
          <span className="font-medium">Live Preview</span>
        </div>
        
        <div className="flex items-center gap-2">
          <DeviceSelector 
            mode={previewMode}
            onModeChange={setPreviewMode}
          />
          
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
        <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${getDeviceStyles(previewMode)}`}>
          <iframe
            src={previewUrl}
            className="w-full h-full"
            title="App Preview"
          />
        </div>
      </div>
    </div>
  );
};

const getDeviceStyles = (mode: DeviceMode): string => {
  switch (mode) {
    case 'desktop':
      return 'w-full h-96';
    case 'tablet':
      return 'w-3/4 h-96 mx-auto';
    case 'mobile':
      return 'w-96 h-96 mx-auto';
    default:
      return 'w-full h-96';
  }
};
