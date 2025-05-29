// tests/benchmarks/performance.test.ts
import { describe, it, expect } from 'vitest';
import { templateManager } from '@/lib/template-manager';
import { deploymentManager } from '@/lib/deployment-manager';
import { createMockProjectSettings, createMockTreeNode } from '../utils/test-helpers';

describe('Performance Benchmarks', () => {
  const settings = createMockProjectSettings();
  const tree = createMockTreeNode();

  it('should generate SaaS template in under 1 second', async () => {
    const start = performance.now();
    
    const { tree: generatedTree, files } = templateManager.generateProjectFromTemplate(
      'nextjs-saas-complete',
      settings
    );
    
    const end = performance.now();
    const duration = end - start;
    
    expect(duration).toBeLessThan(1000); // 1 second
    expect(Object.keys(files).length).toBeGreaterThan(10);
    expect(generatedTree.children).toBeDefined();
  });

  it('should generate deployment configs quickly', () => {
    const platforms = deploymentManager.getAllPlatforms();
    
    platforms.forEach(platform => {
      const start = performance.now();
      
      const config = deploymentManager.generateDeploymentConfig(
        platform.id,
        settings,
        tree
      );
      
      const end = performance.now();
      const duration = end - start;
      
      expect(duration).toBeLessThan(100); // 100ms
      expect(config.length).toBeGreaterThan(50);
    });
  });

  it('should handle large file trees efficiently', () => {
    // Create a large tree with 100+ files
    const largeTree: TreeNode = {
      name: 'large-project',
      type: 'folder',
      level: 0,
      children: Array.from({ length: 50 }, (_, i) => ({
        name: `folder-${i}`,
        type: 'folder' as const,
        level: 1,
        children: Array.from({ length: 10 }, (_, j) => ({
          name: `file-${i}-${j}.ts`,
          type: 'file' as const,
          level: 2
        }))
      }))
    };

    const start = performance.now();
    
    const config = deploymentManager.generateDeploymentConfig(
      'vercel',
      settings,
      largeTree
    );
    
    const end = performance.now();
    const duration = end - start;
    
    expect(duration).toBeLessThan(500); // 500ms even for large trees
    expect(config).toBeDefined();
  });
});
