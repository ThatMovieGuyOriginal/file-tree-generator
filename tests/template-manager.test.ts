// tests/template-manager.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { templateManager } from '@/lib/template-manager';
import { ProjectSettings } from '@/types/project';

describe('TemplateManager', () => {
  let defaultSettings: ProjectSettings;

  beforeEach(() => {
    defaultSettings = {
      name: 'test-project',
      description: 'Test project for template generation',
      private: false,
      gitignore: 'node',
      license: 'MIT',
      readme: true,
      includeVercelConfig: true,
      includeVercelIgnore: true,
      projectType: 'nextjs'
    };
  });

  describe('Template Loading', () => {
    it('should load all default templates', () => {
      const templates = templateManager.getAllTemplates();
      expect(templates.length).toBeGreaterThan(0);
      
      const templateIds = templates.map(t => t.id);
      expect(templateIds).toContain('nextjs-saas-complete');
      expect(templateIds).toContain('nextjs-ecommerce-advanced');
      expect(templateIds).toContain('react-dashboard-pro');
      expect(templateIds).toContain('nextjs-blog-cms');
    });

    it('should categorize templates correctly', () => {
      const saasTemplates = templateManager.getTemplatesByCategory('saas');
      const ecommerceTemplates = templateManager.getTemplatesByCategory('ecommerce');
      
      expect(saasTemplates.length).toBeGreaterThan(0);
      expect(ecommerceTemplates.length).toBeGreaterThan(0);
      
      saasTemplates.forEach(template => {
        expect(template.category).toBe('saas');
      });
    });
  });

  describe('SaaS Template Generation', () => {
    it('should generate complete SaaS project structure', () => {
      const { tree, files } = templateManager.generateProjectFromTemplate(
        'nextjs-saas-complete',
        defaultSettings
      );

      expect(tree.name).toBe('test-project');
      expect(tree.type).toBe('folder');
      expect(tree.children).toBeDefined();

      // Check for essential SaaS files
      expect(files['package.json']).toBeDefined();
      expect(files['src/app/page.tsx']).toBeDefined();
      expect(files['src/app/dashboard/page.tsx']).toBeDefined();
      expect(files['.env.local']).toBeDefined();
    });

    it('should include authentication features in SaaS template', () => {
      const { files } = templateManager.generateProjectFromTemplate(
        'nextjs-saas-complete',
        defaultSettings
      );

      const packageJson = JSON.parse(files['package.json']);
      expect(packageJson.dependencies['next-auth']).toBeDefined();
      
      const envFile = files['.env.local'];
      expect(envFile).toContain('NEXTAUTH_URL');
      expect(envFile).toContain('NEXTAUTH_SECRET');
    });

    it('should include Stripe integration for SaaS template', () => {
      const { files } = templateManager.generateProjectFromTemplate(
        'nextjs-saas-complete',
        defaultSettings
      );

      const packageJson = JSON.parse(files['package.json']);
      expect(packageJson.dependencies['stripe']).toBeDefined();
      expect(packageJson.dependencies['@stripe/stripe-js']).toBeDefined();
      
      const envFile = files['.env.local'];
      expect(envFile).toContain('STRIPE_PUBLISHABLE_KEY');
      expect(envFile).toContain('STRIPE_SECRET_KEY');
    });

    it('should generate working dashboard component', () => {
      const { files } = templateManager.generateProjectFromTemplate(
        'nextjs-saas-complete',
        defaultSettings
      );

      const dashboardPage = files['src/app/dashboard/page.tsx'];
      expect(dashboardPage).toContain('Dashboard');
      expect(dashboardPage).toContain('getServerSession');
      expect(dashboardPage).toContain('redirect(\'/login\')');
    });
  });

  describe('E-commerce Template Generation', () => {
    it('should generate complete e-commerce project structure', () => {
      const { tree, files } = templateManager.generateProjectFromTemplate(
        'nextjs-ecommerce-advanced',
        defaultSettings
      );

      expect(tree.name).toBe('test-project');
      
      // Check for e-commerce specific structure
      expect(files['src/app/products/page.tsx']).toBeDefined();
      expect(files['src/app/cart/page.tsx']).toBeDefined();
      expect(files['src/app/checkout/page.tsx']).toBeDefined();
    });

    it('should include payment processing capabilities', () => {
      const { files } = templateManager.generateProjectFromTemplate(
        'nextjs-ecommerce-advanced',
        defaultSettings
      );

      const packageJson = JSON.parse(files['package.json']);
      expect(packageJson.dependencies['stripe']).toBeDefined();
    });
  });

  describe('Blog Template Generation', () => {
    it('should generate blog project with CMS features', () => {
      const { tree, files } = templateManager.generateProjectFromTemplate(
        'nextjs-blog-cms',
        defaultSettings
      );

      expect(files['src/app/blog/page.tsx']).toBeDefined();
      expect(files['src/app/admin/page.tsx']).toBeDefined();
    });
  });

  describe('Configuration Files', () => {
    it('should generate valid package.json for all templates', () => {
      const templates = templateManager.getAllTemplates();
      
      templates.forEach(template => {
        const { files } = templateManager.generateProjectFromTemplate(
          template.id,
          defaultSettings
        );
        
        const packageJson = JSON.parse(files['package.json']);
        expect(packageJson.name).toBe('test-project');
        expect(packageJson.version).toBeDefined();
        expect(packageJson.scripts).toBeDefined();
        expect(packageJson.dependencies).toBeDefined();
      });
    });

    it('should generate valid TypeScript configuration', () => {
      const { files } = templateManager.generateProjectFromTemplate(
        'nextjs-saas-complete',
        defaultSettings
      );

      const tsConfig = JSON.parse(files['tsconfig.json']);
      expect(tsConfig.compilerOptions).toBeDefined();
      expect(tsConfig.compilerOptions.strict).toBe(true);
      expect(tsConfig.compilerOptions.jsx).toBe('preserve');
    });

    it('should generate environment files with correct variables', () => {
      const { files } = templateManager.generateProjectFromTemplate(
        'nextjs-saas-complete',
        defaultSettings
      );

      const envFile = files['.env.local'];
      expect(envFile).toContain('NEXT_PUBLIC_APP_NAME');
      expect(envFile).toContain(defaultSettings.name);
    });
  });

  describe('Template Customization', () => {
    it('should apply custom configurations', () => {
      const customConfigs = {
        database: 'supabase',
        auth: 'clerk'
      };

      const { files } = templateManager.generateProjectFromTemplate(
        'nextjs-saas-complete',
        defaultSettings,
        customConfigs
      );

      // This would check for custom configuration application
      // Implementation depends on how customConfigs are used
      expect(files['package.json']).toBeDefined();
    });
  });
});
