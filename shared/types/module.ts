// shared/types/module.ts
export interface ModuleConfig {
  name: string;
  version: string;
  description: string;
  category: 'payment' | 'auth' | 'database' | 'ui' | 'analytics' | 'email' | 'storage' | 'deployment';
  
  dependencies: {
    required: string[];
    optional: string[];
    conflicts: string[];
  };
  
  envVariables: {
    required: string[];
    optional: string[];
  };
  
  files: ModuleFile[];
  apiRoutes?: string[];
  
  configuration?: ModuleConfiguration[];
}

export interface ModuleFile {
  path: string;
  content: string;
  type: 'component' | 'lib' | 'config' | 'api' | 'type';
}

export interface ModuleConfiguration {
  key: string;
  label: string;
  type: 'string' | 'boolean' | 'select' | 'multiselect';
  required: boolean;
  default?: any;
  options?: Array<{ label: string; value: any }>;
}
