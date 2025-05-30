// src/steps/step-1-template-selection/components/TemplateSelection.tsx
import React from 'react';
import { Template } from '@/lib/template-manager';
import { TemplateCard } from './TemplateCard';

interface TemplateSelectionProps {
  templates: Template[];
  selectedTemplate: string;
  onTemplateSelect: (templateId: string) => void;
}

export const TemplateSelection: React.FC<TemplateSelectionProps> = ({
  templates,
  selectedTemplate,
  onTemplateSelect
}) => {
  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Template</h2>
        <p className="text-gray-600">Start with a professionally crafted template</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            isSelected={selectedTemplate === template.id}
            onSelect={() => onTemplateSelect(template.id)}
          />
        ))}
      </div>
    </div>
  );
};
