// src/steps/step-3-preview/components/TemplateFeatures.tsx
import React from 'react';
import { Shield, Database, Palette, Zap } from 'lucide-react';
import { Template } from '@/lib/template-manager';

interface TemplateFeaturesProps {
  template: Template;
}

const getFeatureIcon = (feature: string) => {
  const lower = feature.toLowerCase();
  if (lower.includes('auth')) return <Shield size={12} />;
  if (lower.includes('database')) return <Database size={12} />;
  if (lower.includes('payment')) return <Zap size={12} />;
  if (lower.includes('ui') || lower.includes('styling')) return <Palette size={12} />;
  return <Zap size={12} />;
};

export const TemplateFeatures: React.FC<TemplateFeaturesProps> = ({
  template
}) => {
  return (
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
  );
};
