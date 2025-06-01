// src/steps/step-4-generation/components/ProjectGeneration.tsx - ENHANCED VERSION
'use client';

import React, { useState, useEffect } from 'react';
import { 
  Loader2, Check, Sparkles, Download, GitBranch, Rocket, 
  ArrowRight, Shield, Zap, Clock, Star, ExternalLink,
  CheckCircle, AlertCircle, Globe, Code, Database
} from 'lucide-react';
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

const deploymentOptions = [
  {
    id: 'vercel' as const,
    name: 'Vercel',
    description: 'Deploy to Vercel in 60 seconds',
    icon: '▲',
    color: 'from-black to-gray-800',
    recommended: true,
    time: '~60s'
  },
  {
    id: 'netlify' as const,
    name: 'Netlify',
    description: 'Deploy to Netlify with drag & drop',
    icon: '◆',
    color: 'from-teal-500 to-cyan-600',
    recommended: false,
    time: '~2min'
  },
  {
    id: 'railway' as const,
    name: 'Railway',
    description: 'Deploy full-stack app to Railway',
    icon: '🚂',
    color: 'from-purple-500 to-pink-600',
    recommended: false,
    time: '~3min'
  }
];

const generationSteps = [
  { id: 1, name: 'Analyzing template', icon: Code, status: 'completed' },
  { id: 2, name: 'Generating project structure', icon: Sparkles, status: 'active' },
  { id: 3, name: 'Creating configuration files', icon: Database, status: 'pending' },
  { id: 4, name: 'Optimizing for production', icon: Zap, status: 'pending' },
  { id: 5, name: 'Finalizing project', icon: CheckCircle, status: 'pending' }
];

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
  const [currentStep, setCurrentStep] = useState(0);

  // Simulate generation progress
  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev < generationSteps.length - 1) {
            return prev + 1;
          }
          clearInterval(interval);
          return prev;
        });
      }, 800);

      return () => clearInterval(interval);
    } else {
      setCurrentStep(0);
    }
  }, [isGenerating]);

  const handleCreateRepository = () => {
    if (!generatedProject || !settings) return;
    
    const githubUrl = createGitHubUrl(generatedProject.tree, settings);
    window.open(githubUrl, '_blank', 'noopener,noreferrer');
    setShowInstructions(true);
  };

  const handleQuickDeploy = () => {
    setShowQuickDeploy(true);
  };

  // If project is generated, show success state
  if (generatedProject && settings) {
    if (showInstructions) {
      return (
        <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-50 p-8 overflow-auto">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl border border-blue-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-2xl">
                    <GitBranch className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">Repository Setup Instructions</h2>
                    <p className="text-blue-100 mt-2">Follow these steps to get your project running</p>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-8">
                {/* Step 1 */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-green-900 mb-3">Complete GitHub Setup</h3>
                      <p className="text-green-800 mb-4">
                        Complete the repository creation on GitHub (should be open in a new tab).
                      </p>
                      <div className="bg-white rounded-lg p-4 border border-green-200">
                        <p className="text-sm text-green-700">
                          ✅ Repository created: <code className="bg-green-100 px-2 py-1 rounded">{settings.name}</code>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-blue-900 mb-3">Initialize Your Project</h3>
                      <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm text-green-400 overflow-x-auto">
                        <div className="space-y-1">
                          <div><span className="text-gray-500"># Clone your repository</span></div>
                          <div>git clone https://github.com/yourusername/{settings.name || 'your-repo'}.git</div>
                          <div>cd {settings.name || 'your-repo'}</div>
                          <div></div>
                          <div><span className="text-gray-500"># Extract your downloaded ZIP here, then:</span></div>
                          <div>git add .</div>
                          <div>git commit -m "Initial project setup with File Tree Generator"</div>
                          <div>git push origin main</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-purple-900 mb-3">Start Development</h3>
                      <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm text-green-400 overflow-x-auto">
                        <div className="space-y-1">
                          <div><span className="text-gray-500"># Install dependencies</span></div>
                          <div>npm install</div>
                          <div></div>
                          <div><span className="text-gray-500"># Start development server</span></div>
                          <div>npm run dev</div>
                          <div></div>
                          <div><span className="text-gray-500"># Open http://localhost:3000</span></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowInstructions(false)}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-8 rounded-xl hover:from-indigo-700 hover:to-purple-700 font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Got it! Back to Actions
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (showQuickDeploy) {
      return (
        <div className="h-full bg-gradient-to-br from-green-50 to-emerald-50 p-8 overflow-auto">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full text-white text-sm font-medium mb-6">
                <Rocket className="w-4 h-4" />
                Quick Deploy
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Deployment Platform</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">Deploy your project with one click and go live in minutes</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {deploymentOptions.map((option) => (
                <div
                  key={option.id}
                  onClick={() => onDeploy?.(option.id)}
                  className={`
                    relative p-8 rounded-3xl cursor-pointer transition-all duration-300 hover:scale-105 overflow-hidden
                    bg-gradient-to-r ${option.color} text-white group shadow-2xl
                  `}
                >
                  {option.recommended && (
                    <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
                      Recommended
                    </div>
                  )}
                  
                  <div className="text-center relative z-10">
                    <div className="text-5xl mb-4">{option.icon}</div>
                    <h3 className="text-2xl font-bold mb-2">{option.name}</h3>
                    <p className="text-white/90 mb-4">{option.description}</p>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                      <div className="text-sm font-medium">Setup Time: {option.time}</div>
                    </div>
                  </div>
                  
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              ))}
            </div>
            
            <button
              onClick={() => setShowQuickDeploy(false)}
              className="w-full py-4 text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              ← Back to Project Actions
            </button>
          </div>
        </div>
      );
    }

    // Success state with action buttons
    return (
      <div className="h-full bg-gradient-to-br from-green-50 to-emerald-50 p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              🎉 Project Generated Successfully!
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your <strong>{generatedProject.template.name}</strong> is ready for deployment with all production features included
            </p>
          </div>

          {/* Project Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 text-center">
              <div className="text-3xl font-bold text-blue-600">{Object.keys(generatedProject.files).length}</div>
              <div className="text-sm text-gray-600 font-medium">Files Generated</div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 text-center">
              <div className="text-3xl font-bold text-green-600">{generatedProject.template.features.length}</div>
              <div className="text-sm text-gray-600 font-medium">Features Included</div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 text-center">
              <div className="text-3xl font-bold text-purple-600">
                {Math.round(Object.values(generatedProject.files).join('').length / 1024)}kb
              </div>
              <div className="text-sm text-gray-600 font-medium">Total Size</div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 text-center">
              <div className="text-3xl font-bold text-orange-600">100%</div>
              <div className="text-sm text-gray-600 font-medium">Production Ready</div>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <button
              onClick={onDownload}
              className="group bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-8 rounded-3xl hover:from-emerald-600 hover:to-teal-700 font-semibold text-lg transition-all duration-200 shadow-2xl hover:shadow-3xl hover:scale-105"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-white/20 rounded-2xl group-hover:scale-110 transition-transform duration-200">
                  <Download className="w-8 h-8" />
                </div>
                <div>
                  <div className="font-bold text-xl">Download Project</div>
                  <div className="text-emerald-100 text-sm">Complete ZIP file</div>
                </div>
              </div>
            </button>
            
            <button
              onClick={handleCreateRepository}
              className="group bg-gradient-to-r from-gray-900 to-gray-700 text-white p-8 rounded-3xl hover:from-gray-800 hover:to-gray-600 font-semibold text-lg transition-all duration-200 shadow-2xl hover:shadow-3xl hover:scale-105"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-white/20 rounded-2xl group-hover:scale-110 transition-transform duration-200">
                  <GitBranch className="w-8 h-8" />
                </div>
                <div>
                  <div className="font-bold text-xl">Create Repository</div>
                  <div className="text-gray-300 text-sm">GitHub integration</div>
                </div>
              </div>
            </button>

            <button
              onClick={handleQuickDeploy}
              className="group bg-gradient-to-r from-violet-500 to-purple-600 text-white p-8 rounded-3xl hover:from-violet-600 hover:to-purple-700 font-semibold text-lg transition-all duration-200 shadow-2xl hover:shadow-3xl hover:scale-105"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-white/20 rounded-2xl group-hover:scale-110 transition-transform duration-200">
                  <Rocket className="w-8 h-8" />
                </div>
                <div>
                  <div className="font-bold text-xl">Quick Deploy</div>
                  <div className="text-violet-100 text-sm">Live in minutes</div>
                </div>
              </div>
            </button>
          </div>

          {/* Production Features */}
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Production-Ready Features Included</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: Shield, title: 'Security Headers', description: 'CSRF, XSS protection' },
                { icon: Zap, title: 'Performance', description: 'Optimized bundles' },
                { icon: Globe, title: 'SEO Ready', description: 'Meta tags included' },
                { icon: Code, title: 'TypeScript', description: 'Type safety built-in' },
                { icon: CheckCircle, title: 'Testing Setup', description: 'Ready for tests' },
                { icon: Database, title: 'Database Ready', description: 'Schema configured' },
                { icon: Rocket, title: 'CI/CD Ready', description: 'GitHub Actions' },
                { icon: Star, title: 'Best Practices', description: 'Industry standards' }
              ].map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="p-3 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl w-fit mx-auto mb-3">
                    <feature.icon className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Generation in progress
  if (isGenerating) {
    return (
      <div className="h-full bg-gradient-to-br from-indigo-50 to-purple-50 p-8 flex items-center justify-center">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-10 h-10 text-white animate-spin" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Generating Your Project...</h2>
            <p className="text-xl text-gray-600">
              Creating a production-ready application with all the features you selected
            </p>
          </div>
          
          {/* Progress Steps */}
          <div className="space-y-4">
            {generationSteps.map((step, index) => {
              const IconComponent = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              
              return (
                <div key={step.id} className={`
                  flex items-center gap-4 p-4 rounded-xl transition-all duration-500
                  ${isActive ? 'bg-white shadow-lg scale-105' : 
                    isCompleted ? 'bg-green-50' : 'bg-white/50'}
                `}>
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500
                    ${isActive ? 'bg-indigo-500 animate-pulse' : 
                      isCompleted ? 'bg-green-500' : 'bg-gray-300'}
                  `}>
                    {isCompleted ? (
                      <Check className="w-5 h-5 text-white" />
                    ) : (
                      <IconComponent className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <div className={`font-semibold ${isActive ? 'text-indigo-700' : isCompleted ? 'text-green-700' : 'text-gray-600'}`}>
                      {step.name}
                    </div>
                    {isActive && (
                      <div className="text-sm text-indigo-600 mt-1">In progress...</div>
                    )}
                    {isCompleted && (
                      <div className="text-sm text-green-600 mt-1">✓ Completed</div>
                    )}
                  </div>
                  {isActive && (
                    <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Estimated time */}
          <div className="mt-8 p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-indigo-200">
            <div className="flex items-center justify-center gap-2 text-indigo-700">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">Estimated time: 10-15 seconds</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Initial state - ready to generate
  return (
    <div className="h-full bg-gradient-to-br from-violet-50 to-indigo-50 p-8 overflow-auto">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-12">
          <div className="w-20 h-20 bg-gradient-to-r from-violet-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-violet-900 to-indigo-900 bg-clip-text text-transparent mb-4">
            Ready to Generate Your Project
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Everything is configured and ready. Click the button below to generate your production-ready application 
            with all the features and optimizations you've selected.
          </p>
        </div>

        {/* Features Preview */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-8 mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">What You're Getting</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {[
              { icon: Code, title: 'Clean Code', description: 'Industry standards', color: 'blue' },
              { icon: Shield, title: 'Secure', description: 'Security headers', color: 'green' },
              { icon: Zap, title: 'Fast', description: 'Optimized builds', color: 'yellow' },
              { icon: Globe, title: 'SEO Ready', description: 'Meta tags', color: 'purple' },
              { icon: Database, title: 'Database', description: 'Schema ready', color: 'indigo' },
              { icon: CheckCircle, title: 'Tested', description: 'Test setup', color: 'emerald' },
              { icon: Rocket, title: 'Deployable', description: 'CI/CD ready', color: 'orange' },
              { icon: Star, title: 'Modern', description: 'Latest tech', color: 'pink' }
            ].map((feature, index) => {
              const colorClasses = {
                blue: 'from-blue-100 to-blue-200 text-blue-600',
                green: 'from-green-100 to-green-200 text-green-600',
                yellow: 'from-yellow-100 to-yellow-200 text-yellow-600',
                purple: 'from-purple-100 to-purple-200 text-purple-600',
                indigo: 'from-indigo-100 to-indigo-200 text-indigo-600',
                emerald: 'from-emerald-100 to-emerald-200 text-emerald-600',
                orange: 'from-orange-100 to-orange-200 text-orange-600',
                pink: 'from-pink-100 to-pink-200 text-pink-600'
              };
              
              return (
                <div key={index} className="text-center group">
                  <div className={`p-4 bg-gradient-to-r ${colorClasses[feature.color as keyof typeof colorClasses]} rounded-2xl w-fit mx-auto mb-3 group-hover:scale-110 transition-transform duration-200`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>

          {/* Generation Button */}
          <button
            onClick={onGenerate}
            disabled={isGenerating}
            className="group w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-6 px-12 rounded-2xl hover:from-violet-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-xl transition-all duration-200 shadow-2xl hover:shadow-3xl hover:scale-105"
          >
            <div className="flex items-center justify-center gap-4">
              <Sparkles className="w-8 h-8 group-hover:rotate-12 transition-transform duration-200" />
              <span>Generate Complete Project</span>
              <ArrowRight className="w-8 h-8 group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          </button>
        </div>

        {/* What happens next */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-200">
          <h4 className="text-xl font-bold text-indigo-900 mb-6">What Happens Next?</h4>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
              <div>
                <h5 className="font-semibold text-indigo-900">Generate</h5>
                <p className="text-indigo-700 text-sm">We'll create all your files with your chosen configuration</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
              <div>
                <h5 className="font-semibold text-indigo-900">Download</h5>
                <p className="text-indigo-700 text-sm">Get your complete project as a ZIP file</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
              <div>
                <h5 className="font-semibold text-indigo-900">Deploy</h5>
                <p className="text-indigo-700 text-sm">Go live with one-click deployment options</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="mt-8 grid grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-violet-600">~15s</div>
            <div className="text-sm text-gray-600 font-medium">Generation Time</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-600">100%</div>
            <div className="text-sm text-gray-600 font-medium">Production Ready</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">A+</div>
            <div className="text-sm text-gray-600 font-medium">Code Quality</div>
          </div>
        </div>
      </div>
    </div>
  );
};
