// src/lib/template-manager/template-validator.ts
import { Template } from '@/lib/template-manager';
import { trackEvent } from '@/lib/analytics/event-tracker';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export class TemplateValidator {
  validateTemplate(template: Template): boolean {
    const result = this.performTemplateValidation(template);
    
    if (!result.isValid) {
      trackEvent('template_validation_failed', {
        template_id: template.id,
        errors: result.errors.join(', ')
      });
    }

    return result.isValid;
  }

  validateGeneratedFiles(files: Record<string, string>, template: Template): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check for required files
    const requiredFiles = ['package.json', 'README.md'];
    for (const file of requiredFiles) {
      if (!files[file]) {
        errors.push(`Missing required file: ${file}`);
      }
    }

    // Validate package.json
    if (files['package.json']) {
      try {
        const packageJson = JSON.parse(files['package.json']);
        if (!packageJson.name) {
          errors.push('package.json missing name field');
        }
        if (!packageJson.scripts) {
          warnings.push('package.json missing scripts field');
        }
      } catch (error) {
        errors.push('Invalid package.json format');
      }
    }

    // Check for Next.js specific files if it's a Next.js template
    if (template.stack.framework === 'nextjs') {
      const nextjsFiles = ['next.config.js', 'tsconfig.json'];
      for (const file of nextjsFiles) {
        if (!files[file]) {
          warnings.push(`Missing recommended Next.js file: ${file}`);
        }
      }
    }

    // Validate TypeScript config
    if (files['tsconfig.json']) {
      try {
        const tsConfig = JSON.parse(files['tsconfig.json']);
        if (!tsConfig.compilerOptions) {
          warnings.push('tsconfig.json missing compilerOptions');
        }
      } catch (error) {
        errors.push('Invalid tsconfig.json format');
      }
    }

    // Check for empty files
    const emptyFiles = Object.entries(files)
      .filter(([_, content]) => !content.trim())
      .map(([path, _]) => path);
    
    if (emptyFiles.length > 0) {
      warnings.push(`Generated empty files: ${emptyFiles.join(', ')}`);
    }

    // Security checks
    this.performSecurityValidation(files, warnings);

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  private performTemplateValidation(template: Template): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Basic structure validation
    if (!template.id || !template.name) {
      errors.push('Template must have id and name');
    }

    if (!template.structure || !template.structure.trim()) {
      errors.push('Template must have a structure definition');
    }

    if (!template.features || template.features.length === 0) {
      warnings.push('Template has no features defined');
    }

    if (!template.stack) {
      errors.push('Template must define technology stack');
    }

    // Validate structure format
    if (template.structure) {
      try {
        this.validateStructureFormat(template.structure);
      } catch (error) {
        errors.push(`Invalid structure format: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  private validateStructureFormat(structure: string): void {
    const lines = structure.trim().split('\n');
    
    if (lines.length === 0) {
      throw new Error('Structure cannot be empty');
    }

    let previousLevel = -1;
    
    lines.forEach((line, index) => {
      if (!line.trim()) return;

      const cleaned = line.replace(/[│├└─\s]+/, '');
      const level = Math.floor((line.length - cleaned.length) / 2);
      
      if (level < 0) {
        throw new Error(`Invalid indentation at line ${index + 1}`);
      }

      if (level > previousLevel + 1) {
        throw new Error(`Indentation jump too large at line ${index + 1}`);
      }

      const name = cleaned.endsWith('/') ? cleaned.slice(0, -1) : cleaned;
      
      if (!name) {
        throw new Error(`Empty name at line ${index + 1}`);
      }

      if (name.includes('..') || name.includes('//')) {
        throw new Error(`Invalid file/folder name at line ${index + 1}: ${name}`);
      }

      previousLevel = level;
    });
  }

  private performSecurityValidation(files: Record<string, string>, warnings: string[]): void {
    // Check for potential security issues
    Object.entries(files).forEach(([path, content]) => {
      // Check for hardcoded secrets
      const secretPatterns = [
        /password\s*=\s*["'][^"']+["']/i,
        /secret\s*=\s*["'][^"']+["']/i,
        /api[_-]?key\s*=\s*["'][^"']+["']/i,
        /token\s*=\s*["'][^"']+["']/i
      ];

      secretPatterns.forEach(pattern => {
        if (pattern.test(content)) {
          warnings.push(`Potential hardcoded secret in ${path}`);
        }
      });

      // Check for dangerous eval usage
      if (content.includes('eval(') && !path.includes('test')) {
        warnings.push(`Dangerous eval() usage in ${path}`);
      }

      // Check for console.log in production files
      if (content.includes('console.log') && !path.includes('test') && !path.includes('dev')) {
        warnings.push(`Console.log found in production file: ${path}`);
      }
    });

    // Check environment file security
    if (files['.env.local'] || files['.env']) {
      const envContent = files['.env.local'] || files['.env'];
      if (!envContent.includes('# DO NOT COMMIT')) {
        warnings.push('Environment file should include security warning comment');
      }
    }
  }
}
