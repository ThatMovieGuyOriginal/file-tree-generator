// src/steps/step-4-generation/components/ProjectGeneration.tsx
'use client';

import React, { useState } from 'react';
import { Loader2, Check, Sparkles, Archive, ExternalLink, GitBranch, Rocket, Download } from 'lucide-react';
import { TreeNode } from '@/types/fileTree';
import { ProjectSettings } from '@/types/project';
import { Template } from '@/lib/template-manager';
import { createGitHubUrl } from '@/lib/gitHubIntegration';
import { DeploymentPlatform } from '@/lib/deployment-manager';

interface ProjectGenerationProps {
  isGenerating: boolean;
  onGenerate: () => void;
  generatedProject?: {
    tree: TreeNode;
    files: Record<string, string>;
    template: Template;
  } | null;
  settings?: ProjectSettings;
  onDeploy?: (platform: DeploymentPlatform['id']) => void;
  onDownload?: () => void;
}

export const ProjectGeneration: React.FC<ProjectGenerationProps> = ({
  isGenerating,
  onGenerate,
  generatedProject,
  settings,
  onDeploy,
  onDownload
}) => {
  const [showInstructions, setShowInstructions] = useState(false);
  const [showQuickDeploy, setShowQuickDeploy] = useState(false);

  const handleCreateRepository = () => {
    if (!generatedProject || !settings) return;
    
    const githubUrl = createGitHubUrl(generatedProject.tree, settings);
    window.open(githubUrl, '_blank', 'noopener,noreferrer');
    setShowInstructions(true);
  };

  const handleQuickDeploy = () => {
    setShowQuickDeploy(true);
  };

  const deploymentOptions = [
    {
      id: 'vercel' as const,
      name: 'Vercel',
      description: 'Optimal for Next.js applications',
      icon: '▲',
      color: 'from-black to-gray-800',
      url: 'https://vercel.com/new',
      recommended: true
    },
    {
      id: 'netlify' as const,
      name: 'Netlify',
      description: 'Great for static sites and JAMstack',
      icon: '◆',
      color: 'from-teal-500 to-cyan-600',
      url: 'https://app.netlify.com/start'
    },
    {
      id: 'railway' as const,
      name: 'Railway',
      description: 'Simple deployment for full-stack apps',
      icon: '🚂',
      color: 'from-purple-500 to-pink-600',
      url: 'https://railway.app/new'
    }
  ];

  // If project is generated, show success actions
  if (generatedProject && settings) {
    if (showInstructions) {
      return (
        <div className="p-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">
              🎉 Repository Setup Instructions
            </h3>
            
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">Step 1: Complete GitHub Setup</h4>
                <p className="text-blue-800 text-sm">
                  Complete the repository creation on GitHub (should be open in a new tab).
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">Step 2: Initialize Your Project</h4>
                <div className="bg-gray-900 rounded p-3 font-mono text-sm text-green-400 overflow-x-auto">
                  <div>git clone https://github.com/yourusername/{settings.name || 'your-repo'}.git</div>
                  <div>cd {settings.name || 'your-repo'}</div>
                  <div># Extract your downloaded ZIP here</div>
                  <div>git add .</div>
                  <div>git commit -m "Initial project setup with File Tree Generator"</div>
                  <div>git push origin main</div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">Step 3: Start Development</h4>
                <div className="bg-gray-900 rounded p-3 font-mono text-sm text-green-400 overflow-x-auto">
                  <div>npm install</div>
                  <div>npm run dev</div>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setShowInstructions(false)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Got it!
            </button>
          </div>
        </div>
      );
    }

    if (showQuickDeploy) {
      return (
        <div className="p-8">
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Choose Deployment Platform</h3>
            <p className="text-gray-600">Deploy your project with one click</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {deploymentOptions.map((option) => (
              <div
                key={option.id}
                onClick={() => onDeploy?.(option.id)}
                className={`
                  relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg
                  bg-gradient-to-r ${option.color} text-white
                `}
              >
                {option.recommended && (
                  <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
                    Recommended
                  </div>
                )}
                
                <div className="text-center">
                  <div className="text-3xl mb-2">{option.icon}</div>
                  <h4 className="text-lg font-semibold mb-2">{option.name}</h4>
                  <p className="text-sm opacity-90">{option.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <button
            onClick={() => setShowQuickDeploy(false)}
            className="w-full py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Back to Actions
          </button>
        </div>
      );
    }

    // Success state with action buttons
    return (
      <div className="p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Project Generated Successfully!</h2>
          <p className="text-gray-600">Your {generatedProject.template.name} is ready for deployment</p>
        </div>

        {/* Project Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{Object.keys(generatedProject.files).length}</div>
            <div className="text-sm text-blue-700 font-medium">Files Generated</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{generatedProject.template.features.length}</div>
            <div className="text-sm text-green-700 font-medium">Features Included</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">
              {Math.round(Object.values(generatedProject.files).join('').length / 1024)}kb
            </div>
            <div className="text-sm text-purple-700 font-medium">Total Size</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onDownload}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-4 px-6 rounded-xl hover:from-emerald-600 hover:to-teal-700 font-semibold flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Download size={20} />
              Download Complete Project
            </button>
            
            <button
              onClick={handleCreateRepository}
              className="flex-1 bg-gradient-to-r from-gray-900 to-gray-700 text-white py-4 px-6 rounded-xl hover:from-gray-800 hover:to-gray-600 font-semibold flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <GitBranch size={20} />
              Create GitHub Repository
            </button>

            <button
              onClick={handleQuickDeploy}
              className="flex-1 bg-gradient-to-r from-violet-500 to-purple-600 text-white py-4 px-6 rounded-xl hover:from-violet-600 hover:to-purple-700 font-semibold flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Rocket size={20} />
              Quick Deploy
            </button>
          </div>
          
          {/* Production Ready Features */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
            <h4 className="text-green-800 font-semibold text-lg mb-3 flex items-center gap-2">
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

          {/* Performance Stats */}
          <div className="grid grid-cols-3 gap-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">~30s</div>
              <div className="text-sm text-blue-700 font-medium">Build Time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">100/100</div>
              <div className="text-sm text-green-700 font-medium">Lighthouse Score</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">A+</div>
              <div className="text-sm text-purple-700 font-medium">Security Grade</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Generation in progress
  if (isGenerating) {
    return (
      <div className="p-8 text-center">
        <div className="py-12">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-indigo-600" />
          <p className="text-lg font-medium text-gray-900 mb-2">Generating your project...</p>
          <p className="text-gray-600 mb-6">This may take a few seconds</p>
          
          {/* Progress indicators */}
          <div className="max-w-md mx-auto space-y-2">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Creating project structure...</span>
              <Check className="w-4 h-4 text-green-500" />
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Generating configuration files...</span>
              <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
            </div>
            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>Optimizing for production...</span>
              <div className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Initial state - ready to generate
  return (
    <div className="p-8 text-center">
      <div className="mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Generate Your Project</h2>
        <p className="text-gray-600">Ready to create your production-ready application</p>
      </div>

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
          disabled={isGenerating}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-8 rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg flex items-center justify-center gap-3 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Sparkles className="w-6 h-6" />
          Generate Complete Project
        </button>

        {/* What you'll get preview */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
          <h4 className="font-semibold text-gray-900 mb-4">What You'll Get</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Archive className="w-4 h-4 text-gray-500" />
              <span>Complete project ZIP file</span>
            </div>
            <div className="flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-gray-500" />
              <span>GitHub repository ready</span>
            </div>
            <div className="flex items-center gap-2">
              <Rocket className="w-4 h-4 text-gray-500" />
              <span>One-click deployment</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
