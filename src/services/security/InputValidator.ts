// src/services/security/InputValidator.ts
import DOMPurify from 'isomorphic-dompurify';
import { z } from 'zod';

interface SanitizeOptions {
  maxLength?: number;
  minLength?: number;
  allowedChars?: RegExp;
  stripHtml?: boolean;
  allowedTags?: string[];
  trim?: boolean;
}

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => boolean;
  sanitize?: boolean;
}

interface ValidationResult {
  isValid: boolean;
  sanitizedValue: string;
  errors: string[];
  warnings: string[];
}

export class InputValidator {
  private readonly reservedNames = new Set([
    'con', 'prn', 'aux', 'nul', 'com1', 'com2', 'com3', 'com4', 'com5', 
    'com6', 'com7', 'com8', 'com9', 'lpt1', 'lpt2', 'lpt3', 'lpt4', 
    'lpt5', 'lpt6', 'lpt7', 'lpt8', 'lpt9', 'api', 'www', 'admin',
    'root', 'system', 'config', 'node_modules', '.git'
  ]);

  private readonly dangerousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /data:text\/html/gi,
    /vbscript:/gi,
    /expression\s*\(/gi,
    /@import/gi,
    /binding\s*:/gi,
  ];

  private readonly sqlInjectionPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/gi,
    /((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))/gi,
    /((\%27)|(\'))(\s)*((\%6F)|o|(\%4F))((\%72)|r|(\%52))/gi,
    /((\%3D)|(=))[^\n]*((\%27)|(\')|((\%3B)|(;)))/gi,
    /\w*((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))/gi,
  ];

  public validateAndSanitize(value: string, rules: ValidationRule): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    let sanitizedValue = value;

    try {
      // Basic validation
      if (rules.required && (!value || value.trim().length === 0)) {
        errors.push('This field is required');
        return { isValid: false, sanitizedValue: '', errors, warnings };
      }

      // Sanitize if requested
      if (rules.sanitize) {
        sanitizedValue = this.sanitizeGeneral(value, {
          maxLength: rules.maxLength,
          minLength: rules.minLength,
          stripHtml: true,
          trim: true,
        });
      }

      // Length validation
      if (rules.minLength && sanitizedValue.length < rules.minLength) {
        errors.push(`Minimum length is ${rules.minLength} characters`);
      }

      if (rules.maxLength && sanitizedValue.length > rules.maxLength) {
        errors.push(`Maximum length is ${rules.maxLength} characters`);
      }

      // Pattern validation
      if (rules.pattern && !rules.pattern.test(sanitizedValue)) {
        errors.push('Invalid format');
      }

      // Custom validation
      if (rules.custom && !rules.custom(sanitizedValue)) {
        errors.push('Invalid value');
      }

      // Security scans
      this.performSecurityScans(sanitizedValue, warnings);

      return {
        isValid: errors.length === 0,
        sanitizedValue,
        errors,
        warnings,
      };

    } catch (error) {
      errors.push('Validation failed');
      return { isValid: false, sanitizedValue: value, errors, warnings };
    }
  }

  public sanitizeProjectName(name: string): string {
    if (!name) return '';

    // Remove dangerous characters and normalize
    let sanitized = name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-_\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Ensure it doesn't start with a number or special char
    if (/^[0-9-_]/.test(sanitized)) {
      sanitized = 'project-' + sanitized;
    }

    // Check against reserved names
    if (this.reservedNames.has(sanitized)) {
      sanitized = 'my-' + sanitized;
    }

    // Ensure minimum length
    if (sanitized.length < 2) {
      sanitized = 'my-project';
    }

    // Ensure maximum length
    if (sanitized.length > 50) {
      sanitized = sanitized.substring(0, 50).replace(/-+$/, '');
    }

    return sanitized;
  }

  public sanitizeFileName(filename: string): string {
    if (!filename) return '';

    // Remove path traversal attempts and dangerous characters
    let sanitized = filename
      .replace(/\.\./g, '')
      .replace(/[<>:"|?*]/g, '')
      .replace(/^[.\-\s]+|[.\-\s]+$/g, '')
      .trim();

    // Prevent extremely long filenames
    if (sanitized.length > 255) {
      const ext = sanitized.substring(sanitized.lastIndexOf('.'));
      const name = sanitized.substring(0, sanitized.lastIndexOf('.'));
      sanitized = name.substring(0, 255 - ext.length) + ext;
    }

    // Ensure it's not empty or just dots
    if (!sanitized || /^\.+$/.test(sanitized)) {
      sanitized = 'file';
    }

    return sanitized;
  }

  public sanitizePackageName(name: string): string {
    if (!name) return 'my-package';

    // NPM package name rules
    let sanitized = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-_.]/g, '')
      .replace(/^[._]/, '')
      .replace(/[._]$/, '');

    // Ensure it doesn't start with a dot or underscore
    if (/^[._]/.test(sanitized)) {
      sanitized = sanitized.replace(/^[._]+/, '');
    }

    // Ensure minimum length
    if (sanitized.length < 1) {
      sanitized = 'my-package';
    }

    // Ensure maximum length (NPM limit is 214)
    if (sanitized.length > 214) {
      sanitized = sanitized.substring(0, 214);
    }

    return sanitized;
  }

  public sanitizeHtml(html: string): string {
    if (!html) return '';

    try {
      return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
        ALLOWED_ATTR: ['href'],
        ALLOW_DATA_ATTR: false,
        ALLOW_UNKNOWN_PROTOCOLS: false,
      });
    } catch (error) {
      // Fallback: strip all HTML
      return html.replace(/<[^>]*>/g, '');
    }
  }

  public sanitizeEnvValue(value: string): string {
    if (!value) return '';

    // Remove dangerous characters for environment variables
    return value
      .replace(/["`$\\]/g, '')
      .replace(/\r?\n/g, ' ')
      .trim();
  }

  public sanitizeUrl(url: string): string {
    if (!url) return '';

    try {
      const urlObj = new URL(url);
      
      // Only allow http and https protocols
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        throw new Error('Invalid protocol');
      }

      // Remove dangerous query parameters
      const dangerousParams = ['callback', 'jsonp', 'redirect'];
      dangerousParams.forEach(param => {
        urlObj.searchParams.delete(param);
      });

      return urlObj.toString();
    } catch {
      return '';
    }
  }

  public validateEmail(email: string): boolean {
    const emailSchema = z.string().email();
    try {
      emailSchema.parse(email);
      return true;
    } catch {
      return false;
    }
  }

  public validateGitHubUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname === 'github.com' && 
             /^\/[a-zA-Z0-9-._]+\/[a-zA-Z0-9-._]+$/.test(urlObj.pathname);
    } catch {
      return false;
    }
  }

  public detectSqlInjection(input: string): boolean {
    return this.sqlInjectionPatterns.some(pattern => pattern.test(input));
  }

  public detectXss(input: string): boolean {
    return this.dangerousPatterns.some(pattern => pattern.test(input));
  }

  private sanitizeGeneral(input: string, options: SanitizeOptions = {}): string {
    const {
      maxLength = 1000,
      minLength = 0,
      allowedChars,
      stripHtml = false,
      trim = true,
    } = options;

    let sanitized = input;

    // Trim whitespace
    if (trim) {
      sanitized = sanitized.trim();
    }

    // Strip HTML if requested
    if (stripHtml) {
      sanitized = this.sanitizeHtml(sanitized);
    }

    // Filter allowed characters
    if (allowedChars) {
      sanitized = sanitized.replace(allowedChars, '');
    }

    // Enforce length limits
    if (sanitized.length > maxLength) {
      sanitized = sanitized.substring(0, maxLength);
    }

    return sanitized;
  }

  private performSecurityScans(value: string, warnings: string[]): void {
    // SQL injection detection
    if (this.detectSqlInjection(value)) {
      warnings.push('Potential SQL injection attempt detected');
    }

    // XSS detection
    if (this.detectXss(value)) {
      warnings.push('Potential XSS attempt detected');
    }

    // Path traversal detection
    if (value.includes('../') || value.includes('..\\')) {
      warnings.push('Path traversal attempt detected');
    }

    // Null byte detection
    if (value.includes('\0')) {
      warnings.push('Null byte detected');
    }

    // Excessive length detection
    if (value.length > 10000) {
      warnings.push('Unusually long input detected');
    }

    // Binary content detection
    const nonPrintableChars = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/;
    if (nonPrintableChars.test(value)) {
      warnings.push('Non-printable characters detected');
    }
  }

  public createSafeFilename(filename: string, extension?: string): string {
    let safe = this.sanitizeFileName(filename);
    
    // Add timestamp to prevent collisions
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    
    if (extension) {
      safe = `${safe}-${timestamp}-${randomSuffix}.${extension}`;
    } else {
      safe = `${safe}-${timestamp}-${randomSuffix}`;
    }

    return safe;
  }

  public validateProjectStructure(structure: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    try {
      const lines = structure.split('\n');
      let lineNumber = 0;

      for (const line of lines) {
        lineNumber++;
        
        if (!line.trim()) continue;

        // Check for suspicious patterns
        if (this.detectXss(line) || this.detectSqlInjection(line)) {
          errors.push(`Line ${lineNumber}: Suspicious content detected`);
        }

        // Validate file/folder names
        const cleaned = line.replace(/[│├└─\s]+/, '');
        const name = cleaned.endsWith('/') ? cleaned.slice(0, -1) : cleaned;
        
        if (name && (name.includes('..') || name.includes('/') || name.includes('\\'))) {
          errors.push(`Line ${lineNumber}: Invalid file/folder name: ${name}`);
        }
      }

    } catch (error) {
      errors.push('Invalid structure format');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

// Singleton instance
export const inputValidator = new InputValidator();
