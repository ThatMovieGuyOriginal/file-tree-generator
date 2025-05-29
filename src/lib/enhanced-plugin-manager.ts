// src/lib/enhanced-plugin-manager.ts
import { pluginManager } from './pluginManager';
import { EnhancedLanguagePlugin } from '@/types/enhanced-plugin';
import { ProjectSettings } from '@/types/project';

export class EnhancedPluginManager {
  private enhancedPlugins: Map<string, EnhancedLanguagePlugin> = new Map();

  async initialize() {
    await pluginManager.initialize();
    await this.loadEnhancedPlugins();
  }

  private async loadEnhancedPlugins() {
    const enhancedNextjs = await this.createEnhancedNextjsPlugin();
    this.enhancedPlugins.set('nextjs', enhancedNextjs);
  }

  private async createEnhancedNextjsPlugin(): Promise<EnhancedLanguagePlugin> {
    const basePlugin = pluginManager.getPlugin('nextjs');
    if (!basePlugin) throw new Error('Base NextJS plugin not found');

    return {
      ...basePlugin,
      configurations: [
        {
          id: 'app_router',
          name: 'App Router',
          description: 'Use Next.js 13+ App Router (recommended)',
          type: 'boolean',
          default: true,
          category: 'features'
        },
        {
          id: 'database',
          name: 'Database',
          description: 'Choose your database solution',
          type: 'select',
          default: 'none',
          options: [
            { value: 'none', label: 'No Database' },
            { value: 'prisma', label: 'Prisma ORM', description: 'Type-safe database client' },
            { value: 'supabase', label: 'Supabase', description: 'Backend as a Service' },
            { value: 'mongodb', label: 'MongoDB', description: 'NoSQL database' }
          ],
          category: 'database'
        },
        {
          id: 'auth_provider',
          name: 'Authentication',
          description: 'Choose authentication solution',
          type: 'select',
          default: 'none',
          options: [
            { value: 'none', label: 'No Authentication' },
            { value: 'nextauth', label: 'NextAuth.js', description: 'Complete auth solution' },
            { value: 'clerk', label: 'Clerk', description: 'Drop-in auth components' },
            { value: 'supabase-auth', label: 'Supabase Auth', description: 'Built-in auth system' }
          ],
          category: 'auth'
        },
        {
          id: 'ui_library',
          name: 'UI Library',
          description: 'Choose your component library',
          type: 'select',
          default: 'shadcn',
          options: [
            { value: 'shadcn', label: 'shadcn/ui', description: 'Copy-paste components' },
            { value: 'chakra', label: 'Chakra UI', description: 'Simple component library' },
            { value: 'mantine', label: 'Mantine', description: 'Full-featured components' }
          ],
          category: 'styling'
        },
        {
          id: 'testing',
          name: 'Testing Framework',
          description: 'Choose testing setup',
          type: 'multiselect',
          default: ['vitest'],
          options: [
            { value: 'vitest', label: 'Vitest', description: 'Fast unit testing' },
            { value: 'playwright', label: 'Playwright', description: 'E2E testing' },
            { value: 'cypress', label: 'Cypress', description: 'E2E testing' }
          ],
          category: 'testing'
        }
      ],
      dependencyOptions: [
        {
          id: 'framer-motion',
          name: 'Framer Motion',
          description: 'Animation library for React',
          package: 'framer-motion',
          version: '^10.16.0',
          category: 'ui',
          required: false,
          devDependency: false
        },
        {
          id: 'react-hook-form',
          name: 'React Hook Form',
          description: 'Performant forms with easy validation',
          package: 'react-hook-form',
          version: '^7.45.0',
          category: 'forms',
          required: false,
          devDependency: false
        }
      ],
      templates: [
        {
          id: 'starter',
          name: 'Starter Template',
          description: 'Basic Next.js setup with essential features',
          complexity: 'starter',
          features: ['App Router', 'TypeScript', 'Tailwind CSS'],
          structure: 'basic-nextjs-structure',
          configurations: {
            app_router: true,
            ui_library: 'shadcn',
            database: 'none'
          }
        },
        {
          id: 'saas',
          name: 'SaaS Template',
          description: 'Full-featured SaaS application template',
          complexity: 'advanced',
          features: ['Authentication', 'Database', 'Dashboard'],
          structure: 'saas-nextjs-structure',
          configurations: {
            app_router: true,
            database: 'prisma',
            auth_provider: 'nextauth'
          }
        }
      ]
    };
  }

  getEnhancedPlugin(id: string): EnhancedLanguagePlugin | undefined {
    return this.enhancedPlugins.get(id);
  }

  generateDynamicContent(
    filename: string,
    settings: ProjectSettings,
    configurations: Record<string, any>
  ): string {
    const plugin = this.enhancedPlugins.get(settings.projectType);
    if (!plugin) return pluginManager.generateContent(filename, settings);

    return this.generateConfigurableContent(filename, settings, configurations, plugin);
  }

  private generateConfigurableContent(
    filename: string,
    settings: ProjectSettings,
    configurations: Record<string, any>,
    plugin: EnhancedLanguagePlugin
  ): string {
    if (filename === 'package.json') {
      return this.generatePackageJson(settings, configurations);
    }
    
    return plugin.generateContent(filename, settings);
  }

  private generatePackageJson(
    settings: ProjectSettings,
    configurations: Record<string, any>
  ): string {
    const baseDependencies = {
      next: '^14.2.29',
      react: '^18.2.0',
      'react-dom': '^18.2.0'
    };

    const conditionalDependencies: Record<string, string> = {};
    
    if (configurations.ui_library === 'shadcn') {
      conditionalDependencies['@radix-ui/react-dialog'] = '^1.0.0';
      conditionalDependencies['class-variance-authority'] = '^0.7.0';
    }

    if (configurations.database === 'prisma') {
      conditionalDependencies['@prisma/client'] = '^5.0.0';
    }

    if (configurations.auth_provider === 'nextauth') {
      conditionalDependencies['next-auth'] = '^4.24.0';
    }

    return JSON.stringify({
      name: settings.name || 'my-nextjs-app',
      version: '0.1.0',
      private: true,
      scripts: {
        dev: 'next dev',
        build: 'next build',
        start: 'next start',
        lint: 'next lint',
        ...(configurations.database === 'prisma' && {
          'db:generate': 'prisma generate',
          'db:push': 'prisma db push'
        })
      },
      dependencies: { ...baseDependencies, ...conditionalDependencies },
      devDependencies: {
        '@types/node': '^20.5.0',
        '@types/react': '^18.2.0',
        '@types/react-dom': '^18.2.0',
        typescript: '^5.2.0',
        tailwindcss: '^3.4.0',
        eslint: '^8.50.0',
        'eslint-config-next': '^14.0.0',
        ...(configurations.database === 'prisma' && { prisma: '^5.0.0' }),
        ...(configurations.testing?.includes('vitest') && { vitest: '^0.34.0' })
      }
    }, null, 2);
  }
}

export const enhancedPluginManager = new EnhancedPluginManager();
