// src/components/preview/DeploymentView.tsx
import React from 'react';
import { Play, Zap } from 'lucide-react';
import { Template } from '@/lib/template-manager';
import { DeploymentPlatform } from '@/lib/deployment-manager';

interface DeploymentViewProps {
  template?: Template;
  onDeploy: (platform: DeploymentPlatform['id']) => void;
}

const platforms = [
  {
    id: 'vercel' as const,
    name: 'Vercel',
    icon: '▲',
    color: 'from-black to-gray-800',
    description: 'Optimal for Next.js applications',
    recommended: true
  },
  {
    id: 'netlify' as const,
    name: 'Netlify',
    icon: '◆',
    color: 'from-teal-500 to-cyan-600',
    description: 'Great for JAMstack and static sites',
    recommended: false
  },
  {
    id: 'railway' as const,
    name: 'Railway',
    icon: '🚂',
    color: 'from-purple-500 to-pink-600',
    description: 'Simple deployment for full-stack apps',
    recommended: false
  }
];

export const DeploymentView: React.FC<DeploymentViewProps> = ({
  template,
  onDeploy
}) => {
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
                  <p className="text-sm opacity-90">{platform.description}</p>
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
