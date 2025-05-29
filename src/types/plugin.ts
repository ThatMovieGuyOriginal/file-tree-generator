// src/types/plugin.ts
export interface LanguagePlugin {
  id: string;
  name: string;
  description: string;
  version: string;
  category: 'frontend' | 'backend' | 'fullstack' | 'mobile' | 'desktop' | 'data';
  
  // File extensions this plugin handles
  extensions: string[];
  
  // Configuration files this plugin generates
  configFiles: string[];
  
  // Sample project structure
  sampleTree: string;
  
  // Content generation function
  generateContent: (filename: string, settings: ProjectSettings) => string;
  
  // Optional hooks
  hooks?: {
    beforeGeneration?: (tree: TreeNode, settings: ProjectSettings) => TreeNode;
    afterGeneration?: (files: FileMap, settings: ProjectSettings) => FileMap;
    customValidation?: (tree: TreeNode) => ValidationResult;
  };
  
  // Dependencies and requirements
  dependencies?: {
    runtime: string[];
    devDependencies: string[];
    peerDependencies?: string[];
  };
  
  // Additional metadata
  metadata?: {
    author: string;
    repository?: string;
    documentation?: string;
    tags: string[];
    difficulty: 'beginner' | 'intermediate' | 'advanced';
  };
}

export interface FileMap {
  [path: string]: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface PluginRegistry {
  [pluginId: string]: LanguagePlugin;
}

// Template variants for specific use cases
export interface TemplateVariant {
  id: string;
  name: string;
  description: string;
  structure: string;
  features: string[];
  complexity: 'starter' | 'intermediate' | 'advanced';
}
