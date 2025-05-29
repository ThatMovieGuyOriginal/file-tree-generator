// src/components/wizard/WizardHeader.tsx
import React from 'react';
import { Sparkles } from 'lucide-react';

export const WizardHeader: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-white border-b border-gray-200">
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600/5 to-indigo-600/5"></div>
      <div className="relative max-w-7xl mx-auto px-6 py-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-indigo-600 rounded-full text-white text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            AI-Powered Project Generator
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-violet-900 bg-clip-text text-transparent mb-4">
            Build. Deploy. Scale.
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Generate production-ready codebases in seconds. Choose your stack, configure features, and get a complete project.
          </p>
        </div>
      </div>
    </div>
  );
};
