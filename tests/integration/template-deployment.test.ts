// tests/integration/template-deployment.test.ts
import { describe, it, expect } from 'vitest';
import { templateManager } from '@/lib/template-manager';
import { deploymentManager } from '@/lib/deployment-manager';
import { ProjectSettings } from '@/types/project';

describe('Template-Deployment Integration', () => {
  const mockSettings: ProjectSettings = {
    name: 'integration-test',
    description: 'Integration test project',
    private: false,
    gitignore: 'node',
    license: 'MIT',
    readme: true,
    includeVercelConfig: true,
    includeVercelIgnore: true,
    projectType: 'nextjs'
  };

  describe('Template-Platform Compatibility', () => {
    it('should generate compatible configurations for SaaS templates', () => {
      const { tree } = templateManager.generateProjectFromTemplate(
        'nextjs-saas-complete',
        mockSettings
      );

      // Test Vercel compatibility
      const vercelConfig = deploymentManager.generateDeploymentConfig(
        'vercel',
        mockSettings,
        tree
      );
      expect(() => JSON.parse(vercelConfig)).not.toThrow();

      // Test Netlify compatibility
      const netlifyConfig = deploymentManager.generateDeploymentConfig(
        'netlify',
        mockSettings,
        tree
      );
      expect(netlifyConfig).toContain('[build]');
    });

    it('should generate working build configurations', () => {
      const templates = templateManager.getAllTemplates();
      const platforms = deploymentManager.getAllPlatforms();

      templates.forEach(template => {
        const { tree } = templateManager.generateProjectFromTemplate(
          template.id,
          mockSettings
        );

        platforms.forEach(platform => {
          expect(() => {
            deploymentManager.generateDeploymentConfig(
              platform.id,
              mockSettings,
              tree
            );
          }).not.toThrow();
        });
      });
    });
  });
});
