// tests/security/security.test.ts
import { describe, it, expect } from 'vitest';
import { templateManager } from '@/lib/template-manager';
import { createMockProjectSettings } from '../utils/test-helpers';

describe('Security Tests', () => {
  const settings = createMockProjectSettings();

  it('should include security headers in Next.js templates', () => {
    const { files } = templateManager.generateProjectFromTemplate(
      'nextjs-saas-complete',
      settings
    );

    const nextConfig = files['next.config.js'];
    expect(nextConfig).toContain('X-Frame-Options');
    expect(nextConfig).toContain('X-Content-Type-Options');
    expect(nextConfig).toContain('Referrer-Policy');
    expect(nextConfig).toContain('X-XSS-Protection');
  });

  it('should not expose sensitive information in generated files', () => {
    const { files } = templateManager.generateProjectFromTemplate(
      'nextjs-saas-complete',
      settings
    );

    Object.entries(files).forEach(([path, content]) => {
      // Check for common sensitive patterns
      expect(content).not.toMatch(/password.*=.*[^"']\w+/i);
      expect(content).not.toMatch(/secret.*=.*[^"']\w+/i);
      expect(content).not.toMatch(/api[_-]?key.*=.*[^"']\w+/i);
      
      // Ensure environment variables are properly templated
      if (path.includes('.env')) {
        const secretVars = content.match(/SECRET.*=/g) || [];
        secretVars.forEach(secretVar => {
          expect(content).toContain(`${secretVar}"your-secret-key-here"`);
        });
      }
    });
  });

  it('should use secure dependencies versions', () => {
    const { files } = templateManager.generateProjectFromTemplate(
      'nextjs-saas-complete',
      settings
    );

    const packageJson = JSON.parse(files['package.json']);
    
    // Check for known vulnerable versions
    expect(packageJson.dependencies.next).toMatch(/^\^14\./);
    expect(packageJson.dependencies.react).toMatch(/^\^18\./);
    
    // Ensure no development dependencies in production
    const devDeps = Object.keys(packageJson.devDependencies || {});
    const prodDeps = Object.keys(packageJson.dependencies || {});
    
    const developmentOnlyPackages = ['@types/', 'eslint', 'prettier', 'vitest', 'jest'];
    developmentOnlyPackages.forEach(devPackage => {
      const devPackagesInProd = prodDeps.filter(dep => dep.includes(devPackage));
      expect(devPackagesInProd).toHaveLength(0);
    });
  });
});
