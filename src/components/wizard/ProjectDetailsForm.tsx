// src/components/wizard/ProjectDetailsForm.tsx
'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import { ProjectSettings } from '@/types/project';
import { sanitizeInput } from '@/lib/utils/input-sanitizer';
import { useInputValidation } from '@/hooks/useInputValidation';

interface ProjectDetailsFormProps {
  settings: ProjectSettings;
  onSettingsChange: (settings: ProjectSettings) => void;
}

export const ProjectDetailsForm: React.FC<ProjectDetailsFormProps> = ({
  settings,
  onSettingsChange
}) => {
  const { errors, validateField } = useInputValidation();

  const handleNameChange = (value: string) => {
    const sanitized = sanitizeInput(value, { 
      allowedChars: /^[a-zA-Z0-9-_\s]*$/,
      maxLength: 50 
    });
    
    const isValid = validateField('name', sanitized, {
      required: true,
      minLength: 2,
      pattern: /^[a-zA-Z0-9-_\s]+$/
    });

    if (isValid) {
      onSettingsChange({ ...settings, name: sanitized });
    }
  };

  const handleDescriptionChange = (value: string) => {
    const sanitized = sanitizeInput(value, { 
      maxLength: 200,
      stripHtml: true 
    });
    
    onSettingsChange({ ...settings, description: sanitized });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
        <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg text-white">
          <Sparkles className="w-5 h-5" />
        </div>
        Project Details
      </h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-3">
            Project Name
          </label>
          <input
            type="text"
            value={settings.name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="my-awesome-project"
            className={`w-full p-4 border-2 rounded-xl focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 text-lg font-medium ${
              errors.name ? 'border-red-500' : 'border-gray-300 focus:border-indigo-500'
            }`}
            maxLength={50}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-2">{errors.name}</p>
          )}
          <p className="text-sm text-gray-600 mt-2">Choose a memorable name for your project</p>
        </div>
        
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-3">
            Description
          </label>
          <input
            type="text"
            value={settings.description}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            placeholder="A brief description of your project"
            className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 text-lg"
            maxLength={200}
          />
          <p className="text-sm text-gray-600 mt-2">Describe what your project does</p>
        </div>
      </div>
    </div>
  );
};
