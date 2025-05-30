// src/components/wizard/ProjectGeneration.tsx
import React from 'react';
import { Loader2, Check, Sparkles } from 'lucide-react';

interface ProjectGenerationProps {
  isGenerating: boolean;
  onGenerate: () => void;
}

export const ProjectGeneration: React.FC<ProjectGenerationProps> = ({
  isGenerating,
  onGenerate
}) => {
  return (
    <div className="p-8 text-center">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Generate Your Project</h2>
        <p className="text-gray-600">Ready to create your production-ready application</p>
      </div>

      {isGenerating ? (
        <div className="py-12">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-indigo-600" />
          <p className="text-lg font-medium text-gray-900 mb-2">Generating your project...</p>
          <p className="text-gray-600">This may take a few seconds</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
            <h4 className="text-green-800 font-semibold text-lg mb-3 flex items-center justify-center gap-2">
              <Check className="w-5 h-5" />
              Production-Ready Features Included
            </h4>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                'TypeScript Configured',
                'Security Headers',
                'Performance Optimized',
                'SEO Ready',
                'Mobile Responsive',
                'Testing Setup',
                'CI/CD Ready',
                'Docker Support'
              ].map((feature) => (
                <div key={feature} className="flex items-center text-green-700">
                  <Check className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={onGenerate}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-8 rounded-xl hover:from-indigo-700 hover:to-purple-700 font-semibold text-lg flex items-center justify-center gap-3 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Sparkles className="w-6 h-6" />
            Generate Complete Project
          </button>
        </div>
      )}
    </div>
  );
};
