// src/components/FileTreeGenerator.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { ChevronRight, Sparkles, Zap, Shield, Code, Database, Palette, TestTube, Cloud, Check, X, Plus, Minus, Star, ArrowRight, Download, GitBranch, Rocket, Eye, Settings } from 'lucide-react';
import { TreeNode as TreeNodeType } from '@/types/fileTree';
import { ProjectSettings } from '@/types/project';
import { EnhancedLanguagePlugin } from '@/types/enhanced-plugin';
import { enhancedPluginManager } from '@/lib/enhanced-plugin-manager';

const FileTreeGenerator = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState('nextjs-saas');
  const [configurations, setConfigurations] = useState<Record<string, any>>({});
  const [showPreview, setShowPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [parsedTree, setParsedTree] = useState<TreeNodeType | null>(null);
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

  const templates = [
    {
      id: 'nextjs-saas',
      name: 'SaaS Starter',
      description: 'Full-featured SaaS with auth, payments, and dashboard',
      features: ['Next.js 14', 'Authentication', 'Database', 'Payments', 'Dashboard'],
      color: 'from-violet-500 to-purple-600',
      icon: Sparkles,
      complexity: 'advanced',
      estimatedTime: '2-3 hours setup'
    },
    {
      id: 'nextjs-ecommerce',
      name: 'E-commerce',
      description: 'Modern online store with cart and checkout',
      features: ['Next.js 14', 'Product Catalog', 'Shopping Cart', 'Payments'],
      color: 'from-emerald-500 to-teal-600',
      icon: Star,
      complexity: 'intermediate',
      estimatedTime: '1-2 hours setup'
    },
    {
      id: 'react-dashboard',
      name: 'Dashboard',
      description: 'Analytics dashboard with charts and data visualization',
      features: ['React 18', 'Charts', 'Real-time Data', 'Responsive'],
      color: 'from-blue-500 to-cyan-600',
      icon: Database,
      complexity: 'intermediate',
      estimatedTime: '1 hour setup'
    },
    {
      id: 'nextjs-blog',
      name: 'Blog/CMS',
      description: 'Content management system with markdown support',
      features: ['Next.js 14', 'MDX', 'SEO Optimized', 'Admin Panel'],
      color: 'from-orange-500 to-red-600',
      icon: Code,
      complexity: 'beginner',
      estimatedTime: '30 min setup'
    }
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
        { id: 'none', name: 'No Database', description: 'Skip database setup' }
      ]
    },
    {
      id: 'auth',
      name: 'Authentication',
      icon: Shield,
      options: [
        { id: 'clerk', name: 'Clerk', description: 'Drop-in auth components', popular: true },
        { id: 'nextauth', name: 'NextAuth.js', description: 'Complete auth solution' },
        { id: 'supabase-auth', name: 'Supabase Auth', description: 'Built-in authentication' },
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
        { id: 'none', name: 'Skip Testing', description: 'Add testing later' }
      ]
    }
  ];

  const steps = [
    { id: 'template', name: 'Choose Template', icon: Sparkles },
    { id: 'configure', name: 'Configure', icon: Settings },
    { id: 'preview', name: 'Preview', icon: Eye },
    { id: 'generate', name: 'Generate', icon: Rocket }
  ];

  const selectedTemplateData = templates.find(t => t.id === selectedTemplate);

  useEffect(() => {
    enhancedPluginManager.initialize();
  }, []);

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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {templates.map((template) => {
                  const IconComponent = template.icon;
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
                        <div className={`p-3 rounded-lg bg-gradient-to-r ${template.color}`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          template.complexity === 'beginner' ? 'bg-green-100 text-green-800' :
                          template.complexity === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {template.complexity}
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{template.name}</h3>
                      <p className="text-gray-600 mb-4">{template.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {template.features.map((feature) => (
                          <span key={feature} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                            {feature}
                          </span>
                        ))}
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

          {/* Navigation */}
          <div className="border-t border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <button 
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
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
                onClick={handleNext}
                disabled={currentStep === steps.length - 1}
                className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
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

export default FileTreeGenerator;
