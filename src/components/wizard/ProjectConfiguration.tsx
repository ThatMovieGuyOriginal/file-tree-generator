// src/components/wizard/ProjectConfiguration.tsx
'use client';

import React from 'react';
import { Database, Shield, Palette, TestTube, CheckCircle, Sparkles } from 'lucide-react';
import { ProjectSettings } from '@/types/project';

interface ProjectConfigurationProps {
  settings: ProjectSettings;
  onSettingsChange: (settings: ProjectSettings) => void;
  configurations: Record<string, any>;
  onConfigurationChange: (configurations: Record<string, any>) => void;
}

const configCategories = [
  {
    id: 'database',
    name: 'Database',
    icon: Database,
    description: 'Choose your data persistence solution',
    color: 'from-emerald-500 to-teal-600',
    options: [
      { 
        id: 'prisma', 
        name: 'Prisma + PostgreSQL', 
        description: 'Type-safe ORM with migrations and introspection', 
        popular: true,
        features: ['Type Safety', 'Auto Migrations', 'Database Introspection'],
        setup: 'Advanced'
      },
      { 
        id: 'supabase', 
        name: 'Supabase', 
        description: 'Backend-as-a-Service with real-time capabilities', 
        popular: true,
        features: ['Real-time', 'Authentication', 'Edge Functions'],
        setup: 'Simple'
      },
      { 
        id: 'mongodb', 
        name: 'MongoDB', 
        description: 'NoSQL document database for flexible schemas',
        features: ['Document Store', 'Flexible Schema', 'Aggregation'],
        setup: 'Intermediate'
      },
      { 
        id: 'planetscale', 
        name: 'PlanetScale', 
        description: 'Serverless MySQL platform with branching',
        features: ['Database Branching', 'Serverless', 'Schema Changes'],
        setup: 'Intermediate'
      },
      { 
        id: 'none', 
        name: 'No Database', 
        description: 'Skip database setup for static applications',
        features: ['Static Only', 'Fast Deploy', 'No Complexity'],
        setup: 'None'
      }
    ]
  },
  {
    id: 'auth',
    name: 'Authentication',
    icon: Shield,
    description: 'Secure user authentication and authorization',
    color: 'from-blue-500 to-indigo-600',
    options: [
      { 
        id: 'nextauth', 
        name: 'NextAuth.js', 
        description: 'Complete authentication solution with multiple providers', 
        popular: true,
        features: ['OAuth Providers', 'JWT/Sessions', 'Database Adapters'],
        setup: 'Intermediate'
      },
      { 
        id: 'clerk', 
        name: 'Clerk', 
        description: 'Drop-in authentication with beautiful UI components', 
        popular: true,
        features: ['Pre-built UI', 'User Management', 'Organizations'],
        setup: 'Simple'
      },
      { 
        id: 'supabase-auth', 
        name: 'Supabase Auth', 
        description: 'Built-in authentication with row-level security',
        features: ['Row Level Security', 'Magic Links', 'Social OAuth'],
        setup: 'Simple'
      },
      { 
        id: 'auth0', 
        name: 'Auth0', 
        description: 'Enterprise-grade authentication and authorization',
        features: ['Enterprise SSO', 'Multi-factor Auth', 'Advanced Rules'],
        setup: 'Advanced'
      },
      { 
        id: 'none', 
        name: 'Custom Auth', 
        description: 'Implement your own authentication system',
        features: ['Full Control', 'Custom Logic', 'No Dependencies'],
        setup: 'Expert'
      }
    ]
  },
  {
    id: 'ui',
    name: 'UI Library',
    icon: Palette,
    description: 'Component library and design system',
    color: 'from-purple-500 to-pink-600',
    options: [
      { 
        id: 'shadcn', 
        name: 'shadcn/ui', 
        description: 'Copy-paste components built on Radix UI primitives', 
        popular: true,
        features: ['Radix Primitives', 'Customizable', 'Accessible'],
        setup: 'Simple'
      },
      { 
        id: 'chakra', 
        name: 'Chakra UI', 
        description: 'Simple, modular and accessible component library',
        features: ['Theme System', 'Dark Mode', 'Responsive'],
        setup: 'Simple'
      },
      { 
        id: 'mantine', 
        name: 'Mantine', 
        description: 'Full-featured React components and hooks library',
        features: ['Rich Components', 'Form Validation', 'Notifications'],
        setup: 'Intermediate'
      },
      { 
        id: 'headless', 
        name: 'Headless UI', 
        description: 'Unstyled, fully accessible UI components',
        features: ['Fully Accessible', 'Unstyled', 'Flexible'],
        setup: 'Intermediate'
      }
    ]
  },
  {
    id: 'testing',
    name: 'Testing',
    icon: TestTube,
    description: 'Testing framework and quality assurance',
    color: 'from-orange-500 to-red-600',
    options: [
      { 
        id: 'vitest', 
        name: 'Vitest', 
        description: 'Blazing fast unit testing framework', 
        popular: true,
        features: ['Fast Execution', 'ESM Support', 'TypeScript'],
        setup: 'Simple'
      },
      { 
        id: 'playwright', 
        name: 'Playwright', 
        description: 'End-to-end testing for modern web applications',
        features: ['Cross-browser', 'Auto-wait', 'Debugging'],
        setup: 'Intermediate'
      },
      { 
        id: 'cypress', 
        name: 'Cypress', 
        description: 'Interactive end-to-end testing with time travel',
        features: ['Time Travel', 'Real Browser', 'Network Stubbing'],
        setup: 'Intermediate'
      },
      { 
        id: 'jest', 
        name: 'Jest', 
        description: 'Delightful JavaScript testing framework',
        features: ['Snapshot Testing', 'Mocking', 'Code Coverage'],
        setup: 'Simple'
      },
      { 
        id: 'none', 
        name: 'Skip Testing', 
        description: 'Add testing setup later in development',
        features: ['Fast Setup', 'Manual QA', 'Add Later'],
        setup: 'None'
      }
    ]
  }
];

const ConfigurationSection: React.FC<{
  category: typeof configCategories[0];
  selectedValue: string;
  onSelectionChange: (value: string) => void;
}> = ({ category, selectedValue, onSelectionChange }) => {
  const IconComponent = category.icon;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg">
      {/* Category Header */}
      <div className={`p-6 bg-gradient-to-r ${category.color} text-white`}>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-xl">
            <IconComponent className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold">{category.name}</h3>
            <p className="text-white/90 text-sm">{category.description}</p>
          </div>
        </div>
      </div>
      
      {/* Options Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 gap-4">
          {category.options.map((option) => {
            const isSelected = selectedValue === option.id;
            
            return (
              <div
                key={option.id}
                onClick={() => onSelectionChange(option.id)}
                className={`
                  relative p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 group
                  ${isSelected 
                    ? 'border-indigo-500 bg-gradient-to-r from-indigo-50 to-purple-50 shadow-lg ring-4 ring-indigo-500/20 scale-102' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-md'
                  }
                `}
              >
                {/* Selected Indicator */}
                {isSelected && (
                  <div className="absolute top-4 right-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                  </div>
                )}

                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className={`font-bold text-lg ${isSelected ? 'text-indigo-900' : 'text-gray-900'}`}>
                        {option.name}
                      </h4>
                      {option.popular && (
                        <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs rounded-full font-bold">
                          Popular
                        </span>
                      )}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        option.setup === 'Simple' ? 'bg-green-100 text-green-800' :
                        option.setup === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                        option.setup === 'Advanced' ? 'bg-orange-100 text-orange-800' :
                        option.setup === 'Expert' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {option.setup} Setup
                      </span>
                    </div>
                    <p className={`text-sm mb-3 ${isSelected ? 'text-indigo-700' : 'text-gray-600'}`}>
                      {option.description}
                    </p>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2">
                  <h5 className={`text-sm font-semibold ${isSelected ? 'text-indigo-800' : 'text-gray-700'}`}>
                    Key Features:
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {option.features.map((feature, index) => (
                      <span 
                        key={index}
                        className={`px-2 py-1 rounded-lg text-xs font-medium ${
                          isSelected 
                            ? 'bg-indigo-100 text-indigo-800' 
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Selection Indicator */}
                <div className={`
                  mt-4 pt-4 border-t transition-all duration-300
                  ${isSelected ? 'border-indigo-200' : 'border-gray-200'}
                `}>
                  <div className={`
                    flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300
                    ${isSelected 
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' 
                      : 'bg-gray-100 text-gray-700 group-hover:bg-indigo-50 group-hover:text-indigo-600'
                    }
                  `}>
                    {isSelected ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Selected
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Select
                      </>
                    )}
                  </div>
                </div>

                {/* Hover Effect */}
                {!isSelected && (
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const ProjectConfiguration: React.FC<ProjectConfigurationProps> = ({
  settings,
  onSettingsChange,
  configurations,
  onConfigurationChange
}) => {
  const updateConfiguration = (categoryId: string, value: string) => {
    onConfigurationChange({
      ...configurations,
      [categoryId]: value
    });
  };

  return (
    <div className="p-8 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 min-h-screen">
      {/* Enhanced Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-indigo-600 rounded-full text-white text-sm font-medium mb-6">
          <Sparkles className="w-4 h-4" />
          Configure Your Stack
        </div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-violet-900 bg-clip-text text-transparent mb-4">
          Customize Features & Integrations
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Fine-tune your project with the exact technologies and features you need
        </p>
      </div>

      {/* Project Details */}
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
              onChange={(e) => onSettingsChange({ ...settings, name: e.target.value })}
              placeholder="my-awesome-project"
              className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 text-lg font-medium"
            />
            <p className="text-sm text-gray-600 mt-2">Choose a memorable name for your project</p>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3">
              Description
            </label>
            <input
              type="text"
              value={settings.description}
              onChange={(e) => onSettingsChange({ ...settings, description: e.target.value })}
              placeholder="A brief description of your project"
              className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 text-lg"
            />
            <p className="text-sm text-gray-600 mt-2">Describe what your project does</p>
          </div>
        </div>
      </div>

      {/* Configuration Sections */}
      <div className="space-y-8">
        {configCategories.map((category) => (
          <ConfigurationSection
            key={category.id}
            category={category}
            selectedValue={configurations[category.id] || category.options[0].id}
            onSelectionChange={(value) => updateConfiguration(category.id, value)}
          />
        ))}
      </div>

      {/* Configuration Summary */}
      <div className="mt-12 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-200">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-white">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-indigo-900">Configuration Summary</h3>
            <p className="text-indigo-700">Your selected stack configuration</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-600">
              {Object.keys(configurations).length}
            </div>
            <div className="text-sm text-indigo-700 font-medium">Components Configured</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {Object.values(configurations).filter(v => v !== 'none').length}
            </div>
            <div className="text-sm text-green-700 font-medium">Active Integrations</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">
              {configurations.database !== 'none' && configurations.auth !== 'none' ? 'Full-Stack' : 
               configurations.database !== 'none' || configurations.auth !== 'none' ? 'Enhanced' : 'Frontend'}
            </div>
            <div className="text-sm text-purple-700 font-medium">Application Type</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">100%</div>
            <div className="text-sm text-orange-700 font-medium">Production Ready</div>
          </div>
        </div>

        {/* Selected Technologies */}
        <div className="bg-white rounded-xl p-6 border border-indigo-200">
          <h4 className="font-bold text-gray-900 mb-4">Selected Technologies:</h4>
          <div className="flex flex-wrap gap-3">
            {Object.entries(configurations).map(([key, value]) => {
              if (value === 'none') return null;
              const category = configCategories.find(c => c.id === key);
              const option = category?.options.find(o => o.id === value);
              if (!option) return null;
              
              return (
                <div key={key} className={`px-4 py-2 bg-gradient-to-r ${category.color} text-white rounded-lg font-medium text-sm shadow-lg`}>
                  {option.name}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Ready to Generate */}
      <div className="mt-12 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-green-800 mb-4">
            <CheckCircle className="w-6 h-6" />
            <span className="text-xl font-bold">Configuration Complete!</span>
          </div>
          <p className="text-green-700 mb-6">
            Your project is configured and ready for generation. Click "Next" to preview your setup.
          </p>
          <div className="flex items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-700 font-medium">All components selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-700 font-medium">Production optimized</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-700 font-medium">Best practices included</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
