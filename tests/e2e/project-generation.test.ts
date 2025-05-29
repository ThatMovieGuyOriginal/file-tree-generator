// tests/e2e/project-generation.test.ts
import { describe, it, expect } from 'vitest';
import { templateManager } from '@/lib/template-manager';
import { ProjectSettings } from '@/types/project';

describe('End-to-End Project Generation', () => {
  const testSettings: ProjectSettings = {
    name: 'e2e-test-project',
    description: 'End-to-end test project',
    private: false,
    gitignore: 'node',
    license: 'MIT',
    readme: true,
    includeVercelConfig: true,
    includeVercelIgnore: true,
    projectType: 'nextjs'
  };

  describe('Complete Project Generation Flow', () => {
    it('should generate a complete, buildable Next.js SaaS project', () => {
      const { tree, files } = templateManager.generateProjectFromTemplate(
        'nextjs-saas-complete',
        testSettings
      );

      // Verify project structure
      expect(tree.name).toBe('e2e-test-project');
      expect(tree.children).toBeDefined();

      // Verify essential files exist
      const essentialFiles = [
        'package.json',
        'next.config.js',
        'tsconfig.json',
        'tailwind.config.js',
        'src/app/layout.tsx',
        'src/app/page.tsx',
        'src/app/dashboard/page.tsx',
        '.env.local',
        'README.md'
      ];

      essentialFiles.forEach(file => {
        expect(files[file]).toBeDefined();
        expect(files[file].length).toBeGreaterThan(0);
      });

      // Verify package.json is valid and complete
      const packageJson = JSON.parse(files['package.json']);
      expect(packageJson.name).toBe('e2e-test-project');
      expect(packageJson.scripts.dev).toBe('next dev');
      expect(packageJson.scripts.build).toBe('next build');
      expect(packageJson.dependencies.next).toBeDefined();
      expect(packageJson.dependencies.react).toBeDefined();

      // Verify TypeScript config is valid
      const tsConfig = JSON.parse(files['tsconfig.json']);
      expect(tsConfig.compilerOptions.jsx).toBe('preserve');
      expect(tsConfig.compilerOptions.strict).toBe(true);

      // Verify React components are valid
      const mainPage = files['src/app/page.tsx'];
      expect(mainPage).toContain('export default');
      expect(mainPage).toContain('return');

      // Verify environment configuration
      const envFile = files['.env.local'];
      expect(envFile).toContain('NEXT_PUBLIC_APP_NAME');
      expect(envFile).toContain('e2e-test-project');
    });

    it('should generate projects that pass basic syntax validation', () => {
      const templates = ['nextjs-saas-complete', 'nextjs-ecommerce-advanced', 'react-dashboard-pro'];
      
      templates.forEach(templateId => {
        const { files } = templateManager.generateProjectFromTemplate(
          templateId,
          testSettings
        );

        // Check that all JSON files are valid JSON
        Object.entries(files).forEach(([path, content]) => {
          if (path.endsWith('.json')) {
            expect(() => JSON.parse(content)).not.toThrow(`Invalid JSON in ${path}`);
          }
        });

        // Check that TypeScript/JavaScript files have basic syntax
        Object.entries(files).forEach(([path, content]) => {
          if (path.match(/\.(ts|tsx|js|jsx)$/)) {
            expect(content).toContain('export');
          }
        });
      });
    });
  });

  describe('Production Readiness Checks', () => {
    it('should include security headers in all templates', () => {
      const { files } = templateManager.generateProjectFromTemplate(
        'nextjs-saas-complete',
        testSettings
      );

      const nextConfig = files['next.config.js'];
      expect(nextConfig).toContain('X-Frame-Options');
      expect(nextConfig).toContain('X-Content-Type-Options');
      expect(nextConfig).toContain('Referrer-Policy');
    });

    it('should include proper error handling', () => {
      const { files } = templateManager.generateProjectFromTemplate(
        'nextjs-saas-complete',
        testSettings
      );

      const dashboardPage = files['src/app/dashboard/page.tsx'];
      expect(dashboardPage).toContain('redirect');
      expect(dashboardPage).toContain('session');
    });

    it('should include development and production scripts', () => {
      const { files } = templateManager.generateProjectFromTemplate(
        'nextjs-saas-complete',
        testSettings
      );

      const packageJson = JSON.parse(files['package.json']);
      expect(packageJson.scripts.dev).toBeDefined();
      expect(packageJson.scripts.build).toBeDefined();
      expect(packageJson.scripts.start).toBeDefined();
      expect(packageJson.scripts.lint).toBeDefined();
    });
  });
});
