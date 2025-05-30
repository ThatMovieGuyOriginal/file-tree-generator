// src/components/wizard/ProjectConfiguration.tsx
import React from 'react';
import { ProjectSettings } from '@/types/project';
import { ProjectConfiguration as ProjectConfigurationStep } from '@/steps/step-2-configuration/components/ProjectConfiguration';

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
            value={settings.name}
            onChange={(e) => onSettingsChange({ ...settings, name: e.target.value })}
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
            value={settings.description}
            onChange={(e) => onSettingsChange({ ...settings, description: e.target.value })}
            placeholder="A brief description of your project"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

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
    </div>
  );
};
