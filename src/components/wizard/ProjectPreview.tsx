// src/components/wizard/ProjectPreview.tsx
import React from 'react';
import { Template } from '@/lib/template-manager';
import { ProjectSettings } from '@/types/project';

interface ProjectPreviewProps {
  selectedTemplate?: Template;
  settings: ProjectSettings;
  configurations: Record<string, any>;
}

export const ProjectPreview: React.FC<ProjectPreviewProps> = ({
  selectedTemplate,
  settings,
  configurations
}) => {
  if (!selectedTemplate) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">No template selected</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Review Your Configuration</h2>
        <p className="text-gray-600">Verify your project setup before generation</p>
      </div>

      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className={`p-3 rounded-lg bg-gradient-to-r ${selectedTemplate.color} text-white`}>
            <span className="text-2xl">{selectedTemplate.icon}</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{selectedTemplate.name}</h3>
            <p className="text-gray-600">{selectedTemplate.description}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">
              {selectedTemplate.features.length}
            </div>
            <div className="text-sm text-indigo-700">Features</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {selectedTemplate.complexity}
            </div>
            <div className="text-sm text-green-700">Complexity</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {selectedTemplate.estimatedTime}
            </div>
            <div className="text-sm text-purple-700">Setup Time</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              ✨
            </div>
            <div className="text-sm text-orange-700">Production Ready</div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Project Details</h4>
          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-500">Name:</span>
              <p className="font-medium">{settings.name || 'Untitled Project'}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Description:</span>
              <p className="font-medium">{settings.description || 'No description provided'}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">License:</span>
              <p className="font-medium">{settings.license}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Stack Configuration</h4>
          <div className="space-y-3">
            {Object.entries(configurations).map(([key, value]) => (
              <div key={key}>
                <span className="text-sm text-gray-500 capitalize">{key}:</span>
                <p className="font-medium capitalize">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
