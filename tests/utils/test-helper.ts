// tests/utils/test-helpers.ts
import { ProjectSettings } from '@/types/project';
import { TreeNode } from '@/types/fileTree';

export const createMockProjectSettings = (overrides?: Partial<ProjectSettings>): ProjectSettings => ({
  name: 'test-project',
  description: 'Test project description',
  private: false,
  gitignore: 'node',
  license: 'MIT',
  readme: true,
  includeVercelConfig: true,
  includeVercelIgnore: true,
  projectType: 'nextjs',
  ...overrides
});

export const createMockTreeNode = (overrides?: Partial<TreeNode>): TreeNode => ({
  name: 'test-project',
  type: 'folder',
  level: 0,
  children: [
    { name: 'package.json', type: 'file', level: 1 },
    { name: 'src', type: 'folder', level: 1, children: [] }
  ],
  ...overrides
});

export const validatePackageJson = (content: string): boolean => {
  try {
    const parsed = JSON.parse(content);
    return !!(parsed.name && parsed.version && parsed.scripts && parsed.dependencies);
  } catch {
    return false;
  }
};

export const validateTsConfig = (content: string): boolean => {
  try {
    const parsed = JSON.parse(content);
    return !!(parsed.compilerOptions && parsed.include);
  } catch {
    return false;
  }
};
