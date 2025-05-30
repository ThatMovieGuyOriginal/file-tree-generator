
// src/components/wizard/TemplateSelection.tsx
import React from 'react';
import { Template } from '@/lib/template-manager';
import { TemplateSelection as TemplateSelectionStep } from '@/steps/step-1-template-selection/components/TemplateSelection';

interface TemplateSelectionProps {
  templates: Template[];
  selectedTemplate: string;
  onTemplateSelect: (templateId: string) => void;
}

export const TemplateSelection: React.FC<TemplateSelectionProps> = (props) => {
  return <TemplateSelectionStep {...props} />;
};
