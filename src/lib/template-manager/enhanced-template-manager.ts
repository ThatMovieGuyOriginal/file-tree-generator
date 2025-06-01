// src/lib/template-manager/enhanced-template-manager.ts
import { ProjectSettings } from '@/types/project';
import { TreeNode } from '@/types/fileTree';
import { Template } from '@/lib/template-manager';
import { reportError } from '@/lib/analytics/error-tracker';
import { trackEvent } from '@/lib/analytics/event-tracker';
import { measureTime } from '@/lib/performance/performance-monitor';
import { sanitizeProjectName, validateInput } from '@/lib/utils/input-sanitizer';
import { templateSchemas } from './template-schemas';
import { TemplateValidator } from './template-validator';

interface GenerationResult {
  tree: TreeNode;
  files: Record<string, string>;
  warnings: string[];
  performance: {
    totalTime: number;
    fileCount: number;
    linesOfCode: number;
  };
}

export class EnhancedTemplateManager {
  private validator: TemplateValidator;

  constructor() {
    this.validator = new TemplateValidator();
  }

  async generateProjectFromTemplate(
    templateId: string,
    settings: ProjectSettings,
    configurations: Record<string, any> = {}
  ): Promise<GenerationResult> {
    const stopTimer = measureTime('template_generation_total');
    let warnings: string[] = [];

    try {
      // Validate inputs
      this.validateInputs(templateId, settings);

      // Sanitize project settings
      const sanitizedSettings = this.sanitizeSettings(settings);

      // Get and validate template
      const template = this.getValidatedTemplate(templateId);

      // Generate project structure
      const tree = this.parseStructureToTree(template.structure, sanitizedSettings.name);

      // Generate files with error handling
      const files = await this.generateTemplateFiles(template, sanitizedSettings, configurations);

      // Validate generated files
      const validationResult = this.validator.validateGeneratedFiles(files, template);
      warnings = validationResult.warnings;

      // Calculate performance metrics
      const performance = this.calculatePerformanceMetrics(files);

      // Track successful generation
      trackEvent('template_generation_success', {
        template_id: templateId,
        file_count: Object.keys(files).length,
        generation_time: stopTimer(),
        warnings_count: warnings.length
      });

      return {
        tree,
        files,
        warnings,
        performance: {
          ...performance,
          totalTime: stopTimer()
        }
      };

    } catch (error) {
      const generationTime = stopTimer();
      const errorMessage = error instanceof Error ? error.message : 'Unknown generation error';
      
      reportError(error instanceof Error ? error : new Error(errorMessage), {
        context: {
          template_id: templateId,
          project_name: settings.name,
          configurations,
          generation_time: generationTime
        },
        severity: 'high'
      });

      trackEvent('template_generation_error', {
        template_id: templateId,
        error_message: errorMessage,
        generation_time: generationTime
      });

      throw new Error(`Template generation failed: ${errorMessage}`);
    }
  }

  private validateInputs(templateId: string, settings: ProjectSettings): void {
    if (!templateId) {
      throw new Error('Template ID is required');
    }

    const nameValidation = validateInput(settings.name, {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-Z0-9-_\s]+$/
    });

    if (!nameValidation.isValid) {
      throw new Error(`Invalid project name: ${nameValidation.errors.join(', ')}`);
    }

    if (settings.description && settings.description.length > 200) {
      throw new Error('Project description must be 200 characters or less');
    }
  }

  private sanitizeSettings(settings: ProjectSettings): ProjectSettings {
    return {
      ...settings,
      name: sanitizeProjectName(settings.name),
      description: settings.description?.substring(0, 200).trim() || '',
    };
  }

  private getValidatedTemplate(templateId: string): Template {
    const template = templateSchemas.get(templateId);
    if (!template) {
      const availableTemplates = Array.from(templateSchemas.keys()).join(', ');
      throw new Error(`Template '${templateId}' not found. Available: ${availableTemplates}`);
    }

    if (!this.validator.validateTemplate(template)) {
      throw new Error(`Invalid template configuration for '${templateId}'`);
    }

    return template;
  }

  private parseStructureToTree(structure: string, projectName: string): TreeNode {
    const stopTimer = measureTime('parse_structure_to_tree');
    
    try {
      const lines = structure.trim().split('\n');
      const root: TreeNode = { name: projectName, type: 'folder', children: [], level: 0 };
      const stack: TreeNode[] = [root];

      lines.forEach((line, lineIndex) => {
        try {
          if (!line.trim()) return;

          const cleaned = line.replace(/[│├└─\s]+/, '');
          const level = Math.floor((line.length - cleaned.length) / 2);
          const isFolder = cleaned.endsWith('/');
          const name = isFolder ? cleaned.slice(0, -1) : cleaned;

          // Validate node name
          if (!name || name.includes('..') || name.includes('/')) {
            throw new Error(`Invalid file/folder name: ${name}`);
          }

          const node: TreeNode = {
            name,
            type: isFolder ? 'folder' : 'file',
            children: isFolder ? [] : undefined,
            level,
            expanded: true
          };

          while (stack.length > 1 && stack[stack.length - 1].level >= level) {
            stack.pop();
          }

          const parent = stack[stack.length - 1];
          if (parent.children) {
            parent.children.push(node);
          }

          if (isFolder) {
            stack.push(node);
          }
        } catch (error) {
          throw new Error(`Error parsing line ${lineIndex + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      });

      return root;
    } finally {
      stopTimer();
    }
  }

  private async generateTemplateFiles(
    template: Template,
    settings: ProjectSettings,
    configurations: Record<string, any>
  ): Promise<Record<string, string>> {
    const stopTimer = measureTime('generate_template_files');
    const files: Record<string, string> = {};

    try {
      // Generate core configuration files
      files['package.json'] = await this.generatePackageJson(template, settings, configurations);
      
      if (template.stack.framework === 'nextjs') {
        files['next.config.js'] = this.generateNextConfig(template);
        files['tsconfig.json'] = this.generateTsConfig();
      }

      if (template.stack.styling === 'tailwind') {
        files['tailwind.config.js'] = this.generateTailwindConfig();
        files['postcss.config.js'] = this.generatePostCSSConfig();
      }

      // Generate template-specific files
      const templateFiles = await this.generateCoreApplicationFiles(template, settings, configurations);
      Object.assign(files, templateFiles);

      // Generate common files
      files['.env.local'] = this.generateEnvFile(template, settings);
      files['README.md'] = this.generateReadme(template, settings);
      files['.gitignore'] = this.generateGitignore();

      // Add security and deployment files
      files['.github/workflows/ci.yml'] = this.generateGitHubWorkflow();
      files['docker-compose.yml'] = this.generateDockerCompose(settings);

      return files;
    } finally {
      stopTimer();
    }
  }

  private async generatePackageJson(
    template: Template,
    settings: ProjectSettings,
    configurations: Record<string, any>
  ): Promise<string> {
    const stopTimer = measureTime('generate_package_json');

    try {
      const baseDependencies = {
        next: '^14.2.29',
        react: '^18.2.0',
        'react-dom': '^18.2.0'
      };

      const templateDeps: Record<string, string> = {};

      // Add dependencies based on template features
      if (template.features.includes('Authentication')) {
        templateDeps['next-auth'] = '^4.24.0';
      }
      if (template.features.includes('Stripe Payments')) {
        templateDeps['stripe'] = '^14.0.0';
        templateDeps['@stripe/stripe-js'] = '^2.0.0';
      }
      if (template.stack.database === 'prisma') {
        templateDeps['@prisma/client'] = '^5.0.0';
      }

      // Add configuration-based dependencies
      if (configurations.ui === 'shadcn') {
        templateDeps['@radix-ui/react-dialog'] = '^1.0.0';
        templateDeps['class-variance-authority'] = '^0.7.0';
      }

      const packageJson = {
        name: settings.name.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
        version: '0.1.0',
        private: true,
        description: settings.description || template.description,
        scripts: {
          dev: 'next dev',
          build: 'next build',
          start: 'next start',
          lint: 'next lint --fix',
          'type-check': 'tsc --noEmit',
          test: 'vitest',
          'test:watch': 'vitest --watch',
          'test:coverage': 'vitest --coverage',
          ...(configurations.database === 'prisma' && {
            'db:generate': 'prisma generate',
            'db:push': 'prisma db push',
            'db:migrate': 'prisma migrate dev'
          })
        },
        dependencies: { ...baseDependencies, ...templateDeps },
        devDependencies: {
          '@types/node': '^20.5.0',
          '@types/react': '^18.2.0',
          '@types/react-dom': '^18.2.0',
          'typescript': '^5.2.0',
          'tailwindcss': '^3.4.0',
          'autoprefixer': '^10.4.16',
          'postcss': '^8.4.32',
          'eslint': '^8.50.0',
          'eslint-config-next': '^14.0.0',
          'vitest': '^0.34.0',
          '@vitejs/plugin-react': '^4.0.0',
          ...(configurations.database === 'prisma' && { prisma: '^5.0.0' }),
          ...(configurations.testing?.includes('playwright') && { 
            '@playwright/test': '^1.40.0' 
          })
        },
        engines: {
          node: '>=18.0.0'
        }
      };

      return JSON.stringify(packageJson, null, 2);
    } finally {
      stopTimer();
    }
  }

  private async generateCoreApplicationFiles(
    template: Template,
    settings: ProjectSettings,
    configurations: Record<string, any>
  ): Promise<Record<string, string>> {
    const files: Record<string, string> = {};

    switch (template.category) {
      case 'saas':
        Object.assign(files, await this.generateSaaSFiles(settings, configurations));
        break;
      case 'ecommerce':
        Object.assign(files, await this.generateEcommerceFiles(settings, configurations));
        break;
      case 'dashboard':
        Object.assign(files, await this.generateDashboardFiles(settings, configurations));
        break;
      case 'blog':
        Object.assign(files, await this.generateBlogFiles(settings, configurations));
        break;
      default:
        Object.assign(files, await this.generateBasicNextJSFiles(settings));
    }

    return files;
  }

  // Placeholder methods for file generation (to be implemented)
  private async generateSaaSFiles(settings: ProjectSettings, config: any): Promise<Record<string, string>> {
    return {
      'src/app/page.tsx': this.generateSaaSHomePage(settings),
      'src/app/dashboard/page.tsx': this.generateDashboardPage(settings),
      'src/components/ui/button.tsx': this.generateButtonComponent()
    };
  }

  private calculatePerformanceMetrics(files: Record<string, string>) {
    return {
      fileCount: Object.keys(files).length,
      linesOfCode: Object.values(files).reduce((acc, content) => 
        acc + content.split('\n').length, 0
      )
    };
  }

  // Additional helper methods would go here...
  private generateNextConfig(template: Template): string { return '/** @type {import(\'next\').NextConfig} */\nmodule.exports = { reactStrictMode: true }'; }
  private generateTsConfig(): string { return JSON.stringify({ compilerOptions: { strict: true } }, null, 2); }
  private generateTailwindConfig(): string { return 'module.exports = { content: ["./src/**/*.{js,ts,jsx,tsx}"] }'; }
  private generatePostCSSConfig(): string { return 'module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } }'; }
  private generateEnvFile(template: Template, settings: ProjectSettings): string { return `NEXT_PUBLIC_APP_NAME="${settings.name}"`; }
  private generateReadme(template: Template, settings: ProjectSettings): string { return `# ${settings.name}\n\n${settings.description}`; }
  private generateGitignore(): string { return 'node_modules/\n.next/\n.env.local'; }
  private generateGitHubWorkflow(): string { return 'name: CI\non: [push, pull_request]\njobs:\n  test:\n    runs-on: ubuntu-latest'; }
  private generateDockerCompose(settings: ProjectSettings): string { return `version: '3.8'\nservices:\n  app:\n    build: .\n    ports:\n      - "3000:3000"`; }
  private generateSaaSHomePage(settings: ProjectSettings): string { return `export default function Home() {\n  return <h1>${settings.name}</h1>\n}`; }
  private generateDashboardPage(settings: ProjectSettings): string { return `export default function Dashboard() {\n  return <div>Dashboard</div>\n}`; }
  private generateButtonComponent(): string { return `export function Button({ children }: { children: React.ReactNode }) {\n  return <button>{children}</button>\n}`; }
}
