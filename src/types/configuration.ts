// src/types/configuration.ts
import { LucideIcon } from 'lucide-react';

export interface ConfigOption {
  id: string;
  name: string;
  description: string;
  popular?: boolean;
  setup: 'Simple' | 'Intermediate' | 'Advanced' | 'Expert';
  features: string[];
}

export interface ConfigCategory {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  color: string;
  options: ConfigOption[];
}

export interface ProjectConfiguration {
  [categoryId: string]: string;
}

export interface ConfigurationState {
  configurations: ProjectConfiguration;
  isValid: boolean;
  errors: string[];
  warnings: string[];
}
