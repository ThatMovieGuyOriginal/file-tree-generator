// src/components/preview/DeviceSelector.tsx
import React from 'react';
import { Monitor, Tablet, Smartphone } from 'lucide-react';
import { DeviceMode } from './LivePreview';

interface DeviceSelectorProps {
  mode: DeviceMode;
  onModeChange: (mode: DeviceMode) => void;
}

const devices = [
  { id: 'desktop' as const, icon: Monitor, label: 'Desktop' },
  { id: 'tablet' as const, icon: Tablet, label: 'Tablet' },
  { id: 'mobile' as const, icon: Smartphone, label: 'Mobile' }
];

export const DeviceSelector: React.FC<DeviceSelectorProps> = ({
  mode,
  onModeChange
}) => {
  return (
    <div className="flex rounded-lg border">
      {devices.map((device) => {
        const IconComponent = device.icon;
        return (
          <button
            key={device.id}
            onClick={() => onModeChange(device.id)}
            className={`flex items-center gap-1 px-3 py-1 text-xs rounded ${
              mode === device.id 
                ? 'bg-blue-500 text-white' 
                : 'hover:bg-gray-100'
            }`}
          >
            <IconComponent size={12} />
            {device.label}
          </button>
        );
      })}
    </div>
  );
};
