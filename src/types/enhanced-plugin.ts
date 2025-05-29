// src/types/enhanced-plugin.ts
import { LanguagePlugin } from './plugin';
import { ProjectSettings } from './project';
import { TreeNode } from './fileTree';

export interface EnhancedLanguagePlugin extends LanguagePlugin {
  configurations: PluginConfiguration[];
  dependencyOptions: DependencyOption[];
  templates: TemplateVariant[];
  configurationUI?: ConfigurationUIComponent[];
}

export interface PluginConfiguration {
  id: string;
  name: string;
  description: string;
  type: 'boolean' | 'select' | 'multiselect' | 'text' | 'number';
  default: any;
  options?: ConfigOption[];
  conditional?: string;
  category: 'features' | 'database' | 'auth' | 'deployment' | 'styling' | 'testing';
}

export interface DependencyOption {
  id: string;
  name: string;
  description: string;
  package: string;
  version: string;
  category: 'ui' | 'state' | 'routing' | 'forms' | 'testing' | 'database' | 'auth' | 'utils';
  required: boolean;
  conflicts?: string[];
  requires?: string[];
  devDependency: boolean;
}

export interface TemplateVariant {
  id: string;
  name: string;
  description: string;
  features: string[];
  complexity: 'starter' | 'intermediate' | 'advanced';
  structure: string;
  configurations: Record<string, any>;
}

export interface ConfigOption {
  value: string;
  label: string;
  description?: string;
}

export interface ConfigurationUIComponent {
  type: 'card' | 'section' | 'tabs' | 'accordion';
  title: string;
  configurations: string[];
}
