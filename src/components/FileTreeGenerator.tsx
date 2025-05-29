// src/components/FileTreeGenerator.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, 
  Sparkles, 
  Zap, 
  Shield, 
  Code, 
  Database, 
  Palette, 
  TestTube, 
  Cloud, 
  Check, 
  X, 
  Plus, 
  Minus, 
  Star, 
  ArrowRight, 
  Download, 
  GitBranch, 
  Rocket, 
  Eye, 
  Settings,
  Loader2
} from 'lucide-react';
import { TreeNode as TreeNodeType } from '@/types/fileTree';
import { ProjectSettings } from '@/types/project';
import { templateManager, Template } from '@/lib/template-manager';
import { deploymentManager, DeploymentPlatform } from '@/lib/deployment-manager';
import { EnhancedPreview } from './EnhancedPreview';

const FileTreeGenerator = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState('nextjs-saas-complete');
  const [configurations, setConfigurations] = useState<Record<string, any>>({});
  const [showPreview, setShowPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedProject, setGeneratedProject] = useState<{
    tree: TreeNodeType;
    files: Record<string, string>;
    template: Template;
  } | null>(null);
  const [projectSettings, setProjectSettings] = useState<ProjectSettings>({
    name: '',
    description: '',
    private: false,
    gitignore: 'node',
    license: 'MIT',
    readme: true,
    includeVercelConfig: true,
    includeVercelIgnore: true,
    projectType: 'nextjs'
  });

  const [templates, setTemplates] = useState<Template[]>([]);
  const [deploymentPlatforms, setDeploymentPlatforms] = useState<DeploymentPlatform[]>([]);

  useEffect(() => {
    // Load templates and platforms
    setTemplates(templateManager.getAllTemplates());
    setDeploymentPlatforms(deploymentManager.getAllPlatforms());
    
    // Set default configurations
    setConfigurations({
      database: 'prisma',
      auth: 'nextauth',
      ui: 'shadcn',
      testing: 'vitest'
    });
  }, []);

  const steps = [
    { id: 'template', name: 'Choose Template', icon: Sparkles },
    { id: 'configure', name: 'Configure', icon: Settings },
    { id: 'preview', name: 'Preview', icon: Eye },
    { id: 'generate', name: 'Generate', icon: Rocket }
  ];

  const configCategories = [
    {
      id: 'database',
      name: 'Database',
      icon: Database,
      options: [
        { id: 'prisma', name: 'Prisma + PostgreSQL', description: 'Type-safe ORM with migrations', popular: true },
        { id: 'supabase', name: 'Supabase', description: 'Backend-as-a-Service with real-time', popular: true },
        { id: 'mongodb', name: 'MongoDB', description: 'NoSQL document database' },
        { id: 'planetscale', name: 'PlanetScale', description: 'Serverless MySQL platform' },
        { id: 'none', name: 'No Database', description: 'Skip database setup' }
      ]
    },
    {
      id: 'auth',
      name: 'Authentication',
      icon: Shield,
      options: [
        { id: 'nextauth', name: 'NextAuth.js', description: 'Complete auth solution', popular: true },
        { id: 'clerk', name: 'Clerk', description: 'Drop-in auth components', popular: true },
        { id: 'supabase-auth', name: 'Supabase Auth', description: 'Built-in authentication' },
        { id: 'auth0', name: 'Auth0', description: 'Enterprise-grade auth' },
        { id: 'none', name: 'Custom Auth', description: 'Implement your own' }
      ]
    },
    {
      id: 'ui',
      name: 'UI Library',
      icon: Palette,
      options: [
        { id: 'shadcn', name: 'shadcn/ui', description: 'Copy-paste components', popular: true },
        { id: 'chakra', name: 'Chakra UI', description: 'Simple, modular components' },
        { id: 'mantine', name: 'Mantine', description: 'Full-featured UI library' },
        { id: 'headless', name: 'Headless UI', description: 'Unstyled, accessible' }
      ]
    },
    {
      id: 'testing',
      name: 'Testing',
      icon: TestTube,
      options: [
        { id: 'vitest', name: 'Vitest', description: 'Fast unit testing', popular: true },
        { id: 'playwright', name: 'Playwright', description: 'E2E browser testing' },
        { id: 'cypress', name: 'Cypress', description: 'Interactive E2E testing' },
        { id: 'jest', name: 'Jest', description: 'JavaScript testing framework' },
        { id: 'none', name: 'Skip Testing', description: 'Add testing later' }
      ]
    }
  ];

  const selectedTemplateData = templates.find(t => t.id === selectedTemplate);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGenerate = async () => {
    if (!selectedTemplateData) return;
    
    setIsGenerating(true);
    try {
      const { tree, files } = templateManager.generateProjectFromTemplate(
        selectedTemplate,
        projectSettings,
        configurations
      );
      
      setGeneratedProject({
        tree,
        files,
        template: selectedTemplateData
      });
      
      setShowPreview(true);
    } catch (error) {
      console.error('Error generating project:', error);
      alert('Error generating project. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeploy = async (platform: DeploymentPlatform['id']) => {
    if (!generatedProject) return;
    
    try {
      const config = deploymentManager.generateDeploymentConfig(
        platform,
        projectSettings,
        generatedProject.tree
      );
      
      // Add deployment config to files
      const updatedFiles = { ...generatedProject.files };
      
      switch (platform) {
        case 'vercel':
          updatedFiles['vercel.json'] = config;
          break;
        case 'netlify':
          updatedFiles['netlify.toml'] = config;
          break;
        case 'railway':
          updatedFiles['railway.json'] = config;
          break;
        case 'digitalocean':
          updatedFiles['.do/app.yaml'] = config;
          break;
      }
      
      setGeneratedProject({
        ...generatedProject,
        files: updatedFiles
      });
      
      // Generate deployment instructions
      const instructions = deploymentManager.generateDeploymentInstructions(
        platform,
        projectSettings
      );
      
      // Open deployment platform
      const platformData = deploymentManager.getPlatform(platform);
      if (platformData) {
        const deploymentUrl = getDeploymentUrl(platform, projectSettings.name || 'my-project');
        window.open(deploymentUrl, '_blank');
      }
      
    } catch (error) {
      console.error('Error setting up deployment:', error);
      alert('Error setting up deployment. Please try again.');
    }
  };

  const handleDownload = async () => {
    if (!generatedProject) return;
    
    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      
      // Add all files to zip
      Object.entries(generatedProject.files).forEach(([path, content]) => {
        zip.file(path, content);
      });
      
      // Generate enhanced documentation
      const deploymentGuide = generateDeploymentGuide(generatedProject.template, projectSettings);
      zip.file('DEPLOYMENT.md', deploymentGuide);
      
      const setupScript = generateSetupScript(projectSettings);
      zip.file('setup.sh', setupScript);
      
      // VS Code configuration
      zip.file('.vscode/settings.json', generateVSCodeSettings());
      zip.file('.vscode/extensions.json', generateVSCodeExtensions());
      
      const zipBlob = await zip.generateAsync({ 
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 9 }
      });
      
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${projectSettings.name || 'project'}-complete.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error generating download:', error);
      alert('Error generating download. Please try again.');
    }
  };

  const getDeploymentUrl = (platform: DeploymentPlatform['id'], projectName: string): string => {
    switch (platform) {
      case 'vercel':
        return `https://vercel.com/new/clone?repository-url=https://github.com/yourusername/${projectName}`;
      case 'netlify':
        return `https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/${projectName}`;
      case 'railway':
        return `https://railway.app/new/template?template=https://github.com/yourusername/${projectName}`;
      case 'digitalocean':
        return `https://cloud.digitalocean.com/apps/new?repo=https://github.com/yourusername/${projectName}`;
      default:
        return 'https://github.com';
    }
  };

  if (showPreview && generatedProject) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <button
              onClick={() => setShowPreview(false)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              Back to Generator
            </button>
          </div>
          
          <EnhancedPreview
            tree={generatedProject.tree}
            files={generatedProject.files}
            settings={projectSettings}
            template={generatedProject.template}
            onDeploy={handleDeploy}
            onDownload={handleDownload}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
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

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center space-x-8">
            {steps.map((step, index) => {
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              const IconComponent = step.icon;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`
                    flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300
                    ${isActive ? 'bg-gradient-to-r from-violet-500 to-indigo-600 text-white shadow-lg' :
                      isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}
                  `}>
                    {isCompleted ? <Check className="w-6 h-6" /> : <IconComponent className="w-6 h-6" />}
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${isActive ? 'text-indigo-600' : isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
                      Step {index + 1}
                    </p>
                    <p className={`text-lg ${isActive ? 'text-gray-900' : 'text-gray-600'}`}>
                      {step.name}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <ChevronRight className="w-5 h-5 text-gray-400 ml-8" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {currentStep === 0 && (
            <div className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Template</h2>
                <p className="text-gray-600">Start with a professionally crafted template</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template) => {
                  const isSelected = selectedTemplate === template.id;
                  
                  return (
                    <div
                      key={template.id}
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`
                        relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg
                        ${isSelected 
                          ? 'border-indigo-500 bg-indigo-50 shadow-lg' 
                          : 'border-gray-200 hover:border-gray-300'
                        }
                      `}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-lg bg-gradient-to-r ${template.color} text-white`}>
                          <span className="text-2xl">{template.icon}</span>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          template.complexity === 'starter' ? 'bg-green-100 text-green-800' :
                          template.complexity === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {template.complexity}
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{template.name}</h3>
                      <p className="text-gray-600 mb-4">{template.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {template.features.slice(0, 3).map((feature) => (
                          <span key={feature} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                            {feature}
                          </span>
                        ))}
                        {template.features.length > 3 && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                            +{template.features.length - 3} more
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{template.estimatedTime}</span>
                        {isSelected && (
                          <div className="flex items-center text-indigo-600">
                            <Check className="w-4 h-4 mr-1" />
                            Selected
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Configure Your Stack</h2>
                <p className="text-gray-600">Customize features and integrations</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={projectSettings.name}
                    onChange={(e) => setProjectSettings(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="my-awesome-project"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    value={projectSettings.description}
                    onChange={(e) => setProjectSettings(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="A brief description of your project"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="space-y-8">
                {configCategories.map((category) => {
                  const IconComponent = category.icon;
                  
                  return (
                    <div key={category.id} className="border border-gray-200 rounded-xl p-6">
                      <div className="flex items-center mb-4">
                        <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                          <IconComponent className="w-5 h-5 text-indigo-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">{category.name}</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {category.options.map((option) => {
                          const isSelected = configurations[category.id] === option.id;
                          
                          return (
                            <div
                              key={option.id}
                              onClick={() => setConfigurations(prev => ({
                                ...prev,
                                [category.id]: option.id
                              }))}
                              className={`
                                relative p-4 rounded-lg border cursor-pointer transition-all duration-200
                                ${isSelected 
                                  ? 'border-indigo-500 bg-indigo-50' 
                                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                }
                              `}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center">
                                    <h4 className="font-semibold text-gray-900">{option.name}</h4>
                                    {option.popular && (
                                      <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                                        Popular
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                                </div>
                                {isSelected && (
                                  <Check className="w-5 h-5 text-indigo-600" />
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Review Your Configuration</h2>
                <p className="text-gray-600">Verify your project setup before generation</p>
              </div>

              {selectedTemplateData && (
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${selectedTemplateData.color} text-white`}>
                      <span className="text-2xl">{selectedTemplateData.icon}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{selectedTemplateData.name}</h3>
                      <p className="text-gray-600">{selectedTemplateData.description}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-indigo-600">
                        {selectedTemplateData.features.length}
                      </div>
                      <div className="text-sm text-gray-600">Features</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {selectedTemplateData.complexity}
                      </div>
                      <div className="text-sm text-gray-600">Complexity</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {selectedTemplateData.estimatedTime}
                      </div>
                      <div className="text-sm text-gray-600">Setup Time</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        ✨
                      </div>
                      <div className="text-sm text-gray-600">Production Ready</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Project Details</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-500">Name:</span>
                      <p className="font-medium">{projectSettings.name || 'Untitled Project'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Description:</span>
                      <p className="font-medium">{projectSettings.description || 'No description provided'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">License:</span>
                      <p className="font-medium">{projectSettings.license}</p>
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
          )}

          {currentStep === 3 && (
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
                    onClick={handleGenerate}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-8 rounded-xl hover:from-indigo-700 hover:to-purple-700 font-semibold text-lg flex items-center justify-center gap-3 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <Sparkles className="w-6 h-6" />
                    Generate Complete Project
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="border-t border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <button 
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
                Previous
              </button>
              
              <div className="flex space-x-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      index === currentStep ? 'bg-indigo-600 w-8' : 
                      index < currentStep ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              
              <button 
                onClick={currentStep === steps.length - 1 ? handleGenerate : handleNext}
                disabled={currentStep === steps.length - 1 && isGenerating}
                className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {currentStep === steps.length - 1 ? (
                  isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      Generate
                      <Sparkles className="w-4 h-4 ml-2" />
                    </>
                  )
                ) : (
                  <>
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Lightning Fast</h3>
            <p className="text-gray-600">Generate complete projects in seconds, not hours. Pre-configured and optimized.</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Production Ready</h3>
            <p className="text-gray-600">Security headers, performance optimizations, and best practices built-in.</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Cloud className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Deploy Anywhere</h3>
            <p className="text-gray-600">Optimized for Vercel, Netlify, Railway, and other modern platforms.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions for file generation
const generateDeploymentGuide = (template: Template, settings: ProjectSettings): string => {
  return `# 🚀 Deployment Guide for ${settings.name || template.name}

## Quick Start

### 1. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 2. Start Development Server
\`\`\`bash
npm run dev
\`\`\`

### 3. Visit Your App
Open [http://localhost:3000](http://localhost:3000) in your browser.

## Template Features

${template.features.map(f => `- ✅ ${f}`).join('\n')}

## Tech Stack

- **Framework:** ${template.stack.framework.toUpperCase()}
- **Styling:** ${template.stack.styling}
- **Database:** ${template.stack.database || 'None'}
- **Authentication:** ${template.stack.auth || 'None'}
- **Deployment:** ${template.stack.deployment}

## Deployment Options

### Vercel (Recommended for Next.js)
\`\`\`bash
npm install -g vercel
vercel
\`\`\`

### Netlify
\`\`\`bash
npm run build
# Deploy dist/ folder to Netlify
\`\`\`

### Railway
\`\`\`bash
npm install -g @railway/cli
railway deploy
\`\`\`

## Environment Variables

Add these to your deployment platform:
- \`NEXT_PUBLIC_APP_NAME\`: ${settings.name || template.name}
- \`DATABASE_URL\`: Your database connection string (if applicable)
- \`NEXTAUTH_SECRET\`: Random secret for authentication (if applicable)

## License

${settings.license} License
`;
};

const generateSetupScript = (settings: ProjectSettings): string => {
  return `#!/bin/bash

# ${settings.name || 'Project'} Setup Script
echo "🚀 Setting up ${settings.name || 'your project'}..."

# Check Node.js version
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2)
if [ "$(printf '%s\n' "18.0.0" "$NODE_VERSION" | sort -V | head -n1)" = "18.0.0" ]; then 
    echo "✅ Node.js version $NODE_VERSION is compatible"
else
    echo "❌ Node.js version $NODE_VERSION is too old. Please update to 18+"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    echo "NEXT_PUBLIC_APP_NAME=\"${settings.name || 'My App'}\"" > .env.local
fi

# Run type check and linting
echo "🔍 Running type check..."
npm run type-check

echo "🧹 Running ESLint..."
npm run lint

echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "  1. Update .env.local with your environment variables"
echo "  2. Run 'npm run dev' to start the development server"
echo "  3. Open http://localhost:3000 in your browser"
echo ""
echo "Happy coding! 🎉"
`;
};

const generateVSCodeSettings = (): string => {
  return JSON.stringify({
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": true
    },
    "typescript.preferences.importModuleSpecifier": "relative",
    "emmet.includeLanguages": {
      "typescript": "html",
      "typescriptreact": "html"
    },
    "files.associations": {
      "*.css": "tailwindcss"
    },
    "editor.quickSuggestions": {
      "strings": true
    },
    "tailwindCSS.includeLanguages": {
      "typescript": "html",
      "typescriptreact": "html"
    },
    "css.validate": false,
    "less.validate": false,
    "scss.validate": false
  }, null, 2);
};

const generateVSCodeExtensions = (): string => {
  return JSON.stringify({
    "recommendations": [
      "bradlc.vscode-tailwindcss",
      "esbenp.prettier-vscode",
      "ms-vscode.vscode-typescript-next",
      "formulahendry.auto-rename-tag",
      "christian-kohler.path-intellisense",
      "ms-vscode.vscode-json",
      "dbaeumer.vscode-eslint"
    ]
  }, null, 2);
};

export default FileTreeGenerator;
