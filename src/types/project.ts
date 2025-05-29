// src/types/project.ts
export interface ProjectSettings {
  name: string;
  description: string;
  private: boolean;
  gitignore: string;
  license: string;
  readme: boolean;
  includeVercelConfig: boolean;
  includeVercelIgnore: boolean;
  projectType: string;
}

export interface DeploymentConfig {
  vercel: boolean;
  netlify: boolean;
  railway: boolean;
}
