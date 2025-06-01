// src/steps/step-3-preview/components/LivePreview.tsx
import React, { useState, useEffect } from 'react';
import { Monitor, Tablet, Smartphone, ExternalLink, RotateCcw, Maximize2, Zap } from 'lucide-react';
import { Template } from '@/lib/template-manager';
import { getPreviewTemplate } from '@/lib/preview-templates';

interface LivePreviewProps {
  template?: Template;
}

export type DeviceMode = 'desktop' | 'tablet' | 'mobile';

const devices = [
  { 
    id: 'desktop' as const, 
    icon: Monitor, 
    label: 'Desktop',
    width: '100%',
    height: '100%',
    description: '1920x1080'
  },
  { 
    id: 'tablet' as const, 
    icon: Tablet, 
    label: 'Tablet',
    width: '768px',
    height: '1024px',
    description: '768x1024'
  },
  { 
    id: 'mobile' as const, 
    icon: Smartphone, 
    label: 'Mobile',
    width: '375px',
    height: '667px',
    description: '375x667'
  }
];

export const LivePreview: React.FC<LivePreviewProps> = ({ template }) => {
  const [previewMode, setPreviewMode] = useState<DeviceMode>('desktop');
  const [previewContent, setPreviewContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (template) {
      setIsLoading(true);
      try {
        const content = getPreviewTemplate(template.id);
        setPreviewContent(content);
      } catch (error) {
        console.error('Failed to generate preview:', error);
        setPreviewContent(getPreviewTemplate('default'));
      } finally {
        setTimeout(() => setIsLoading(false), 500); // Small delay for smooth loading
      }
    }
  }, [template, refreshKey]);

  const currentDevice = devices.find(d => d.id === previewMode) || devices[0];

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const openInNewTab = () => {
    if (previewContent) {
      const blob = new Blob([previewContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Enhanced Header */}
      <div className="p-6 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg text-white">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Live Preview</h3>
              <p className="text-gray-600">
                {template ? template.name : 'Interactive Preview'} • {currentDevice.description}
              </p>
            </div>
          </div>

          {/* Right Section - Controls */}
          <div className="flex items-center gap-4">
            {/* Device Selector */}
            <div className="flex bg-gray-100 rounded-xl p-1">
              {devices.map((device) => {
                const IconComponent = device.icon;
                const isActive = previewMode === device.id;
                
                return (
                  <button
                    key={device.id}
                    onClick={() => setPreviewMode(device.id)}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200
                      ${isActive 
                        ? 'bg-white text-indigo-700 shadow-lg' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                      }
                    `}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="hidden sm:inline">{device.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
                title="Refresh Preview"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              
              <button
                onClick={openInNewTab}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 font-medium"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="hidden sm:inline">Open in New Tab</span>
              </button>
            </div>
          </div>
        </div>

        {/* Template Info Banner */}
        {template && (
          <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{template.icon}</div>
                <div>
                  <h4 className="font-semibold text-indigo-900">{template.name}</h4>
                  <p className="text-sm text-indigo-700">{template.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium text-gray-700">Production Ready</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Preview Container */}
      <div className="flex-1 p-6 flex items-center justify-center relative">
        {/* Device Frame */}
        <div 
          className={`
            bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden relative transition-all duration-500
            ${previewMode === 'mobile' ? 'max-w-sm' : previewMode === 'tablet' ? 'max-w-3xl' : 'w-full h-full max-w-7xl'}
          `}
          style={{
            width: currentDevice.width,
            height: previewMode === 'desktop' ? '100%' : currentDevice.height,
            maxWidth: previewMode === 'desktop' ? '100%' : currentDevice.width,
            maxHeight: previewMode === 'desktop' ? '100%' : currentDevice.height
          }}
        >
          {/* Device Header (for mobile/tablet) */}
          {previewMode !== 'desktop' && (
            <div className="h-6 bg-gray-900 flex items-center justify-center">
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 bg-white rounded-full opacity-60"></div>
                <div className="w-12 h-1 bg-white rounded-full opacity-40"></div>
                <div className="w-1 h-1 bg-white rounded-full opacity-60"></div>
              </div>
            </div>
          )}
          
          {/* Loading State */}
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600 font-medium">Loading Preview...</p>
                <p className="text-sm text-gray-500 mt-1">Generating your application</p>
              </div>
            </div>
          ) : (
            /* Preview Content */
            <div className="w-full h-full">
              {previewContent ? (
                <iframe
                  key={refreshKey}
                  srcDoc={previewContent}
                  className="w-full h-full border-0"
                  title="App Preview"
                  sandbox="allow-scripts allow-same-origin allow-forms"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-50">
                  <div className="text-center max-w-md p-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Monitor className="w-8 h-8 text-gray-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Preview Not Available</h3>
                    <p className="text-gray-600">
                      Unable to generate preview for this template. 
                      The generated files will work perfectly when deployed.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Device Shadow */}
        <div className={`
          absolute inset-0 pointer-events-none
          ${previewMode !== 'desktop' ? 'bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-3xl' : ''}
        `} />
      </div>

      {/* Bottom Info Bar */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Live Preview Active</span>
            </div>
            <div className="text-gray-500">
              Viewing: {currentDevice.label} ({currentDevice.description})
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {template && (
              <div className="text-gray-500">
                Template: {template.name}
              </div>
            )}
            <div className="flex items-center gap-2 text-green-600">
              <Zap className="w-4 h-4" />
              <span className="font-medium">Responsive & Optimized</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
