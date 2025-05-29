// tests/deployment-manager.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { deploymentManager } from '@/lib/deployment-manager';
import { ProjectSettings } from '@/types/project';
import { TreeNode } from '@/types/fileTree';

describe('DeploymentManager', () => {
  let mockTree: TreeNode;
  let mockSettings: ProjectSettings;

  beforeEach(() => {
    mockTree = {
      name: 'test-project',
      type: 'folder',
      level: 0,
      children: [
        { name: 'package.json', type: 'file', level: 1 },
        { name: 'next.config.js', type: 'file', level: 1 },
        { name: 'src', type: 'folder', level: 1, children: [] }
      ]
    };

    mockSettings = {
      name: 'test-deployment',
      description: 'Test deployment project',
      private: false,
      gitignore: 'node',
      license: 'MIT',
      readme: true,
      includeVercelConfig: true,
      includeVercelIgnore: true,
      projectType: 'nextjs'
    };
  });

  describe('Platform Management', () => {
    it('should load all supported platforms', () => {
      const platforms = deploymentManager.getAllPlatforms();
      
      expect(platforms.length).toBe(4);
      
      const platformIds = platforms.map(p => p.id);
      expect(platformIds).toContain('vercel');
      expect(platformIds).toContain('netlify');
      expect(platformIds).toContain('railway');
      expect(platformIds).toContain('digitalocean');
    });

    it('should provide platform details', () => {
      const vercel = deploymentManager.getPlatform('vercel');
      
      expect(vercel).toBeDefined();
      expect(vercel!.name).toBe('Vercel');
      expect(vercel!.features).toContain('Edge Functions');
      expect(vercel!.supports).toContain('Next.js');
    });
  });

  describe('Configuration Generation', () => {
    it('should generate valid Vercel configuration', () => {
      const config = deploymentManager.generateDeploymentConfig(
        'vercel',
        mockSettings,
        mockTree
      );

      const parsed = JSON.parse(config);
      expect(parsed.framework).toBe('nextjs');
      expect(parsed.headers).toBeDefined();
      expect(parsed.env).toBeDefined();
      expect(parsed.env.NEXT_PUBLIC_APP_NAME).toBe('test-deployment');
    });

    it('should generate valid Netlify configuration', () => {
      const config = deploymentManager.generateDeploymentConfig(
        'netlify',
        mockSettings,
        mockTree
      );

      expect(config).toContain('[build]');
      expect(config).toContain('command = "npm run build"');
      expect(config).toContain('NODE_VERSION = "18"');
    });

    it('should generate valid Railway configuration', () => {
      const config = deploymentManager.generateDeploymentConfig(
        'railway',
        mockSettings,
        mockTree
      );

      const parsed = JSON.parse(config);
      expect(parsed.deploy).toBeDefined();
      expect(parsed.deploy.buildCommand).toBe('npm run build');
      expect(parsed.environments.production.variables.NODE_ENV).toBe('production');
    });

    it('should generate valid DigitalOcean configuration', () => {
      const config = deploymentManager.generateDeploymentConfig(
        'digitalocean',
        mockSettings,
        mockTree
      );

      expect(config).toContain('name: test-deployment');
      expect(config).toContain('build_command: npm run build');
      expect(config).toContain('run_command: npm start');
    });
  });

  describe('Framework Detection', () => {
    it('should detect Next.js projects', () => {
      const config = deploymentManager.generateDeploymentConfig(
        'vercel',
        mockSettings,
        mockTree
      );

      const parsed = JSON.parse(config);
      expect(parsed.framework).toBe('nextjs');
    });

    it('should detect Vite projects', () => {
      const viteTree: TreeNode = {
        ...mockTree,
        children: [
          { name: 'package.json', type: 'file', level: 1 },
          { name: 'vite.config.ts', type: 'file', level: 1 }
        ]
      };

      const config = deploymentManager.generateDeploymentConfig(
        'vercel',
        mockSettings,
        viteTree
      );

      const parsed = JSON.parse(config);
      expect(parsed.framework).toBe('vite');
    });
  });

  describe('Deployment Instructions', () => {
    it('should generate comprehensive Vercel instructions', () => {
      const instructions = deploymentManager.generateDeploymentInstructions(
        'vercel',
        mockSettings
      );

      expect(instructions).toContain('Deploy to Vercel');
      expect(instructions).toContain('vercel.com');
      expect(instructions).toContain('git push');
      expect(instructions).toContain('Environment Variables');
    });

    it('should generate Netlify instructions', () => {
      const instructions = deploymentManager.generateDeploymentInstructions(
        'netlify',
        mockSettings
      );

      expect(instructions).toContain('Deploy to Netlify');
      expect(instructions).toContain('netlify.com');
      expect(instructions).toContain('Drag & Drop');
    });

    it('should include security considerations', () => {
      const instructions = deploymentManager.generateDeploymentInstructions(
        'vercel',
        mockSettings
      );

      expect(instructions).toContain('Environment Variables');
      expect(instructions).toContain('Custom Domain');
    });
  });
});
