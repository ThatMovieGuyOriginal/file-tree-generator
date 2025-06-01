// src/lib/utils/input-sanitizer.ts
import DOMPurify from 'isomorphic-dompurify';

export interface SanitizeOptions {
  maxLength?: number;
  minLength?: number;
  allowedChars?: RegExp;
  stripHtml?: boolean;
  allowedTags?: string[];
  trim?: boolean;
}

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => boolean;
}

/**
 * Sanitizes user input based on provided options
 */
export const sanitizeInput = (
  input: string, 
  options: SanitizeOptions = {}
): string => {
  if (typeof input !== 'string') {
    return '';
  }

  let sanitized = input;

  // Trim whitespace if requested (default: true)
  if (options.trim !== false) {
    sanitized = sanitized.trim();
  }

  // Strip HTML if requested
  if (options.stripHtml) {
    sanitized = DOMPurify.sanitize(sanitized, { 
      ALLOWED_TAGS: options.allowedTags || [],
      ALLOWED_ATTR: []
    });
  }

  // Filter allowed characters
  if (options.allowedChars) {
    sanitized = sanitized.replace(options.allowedChars, '');
  }

  // Enforce length limits
  if (options.maxLength && sanitized.length > options.maxLength) {
    sanitized = sanitized.substring(0, options.maxLength);
  }

  return sanitized;
};

/**
 * Validates input against rules
 */
export const validateInput = (
  value: string, 
  rules: ValidationRule = {}
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (rules.required && (!value || value.trim().length === 0)) {
    errors.push('This field is required');
  }

  if (rules.minLength && value.length < rules.minLength) {
    errors.push(`Minimum length is ${rules.minLength} characters`);
  }

  if (rules.maxLength && value.length > rules.maxLength) {
    errors.push(`Maximum length is ${rules.maxLength} characters`);
  }

  if (rules.pattern && !rules.pattern.test(value)) {
    errors.push('Invalid format');
  }

  if (rules.custom && !rules.custom(value)) {
    errors.push('Invalid value');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Sanitizes project names specifically
 */
export const sanitizeProjectName = (name: string): string => {
  return sanitizeInput(name, {
    maxLength: 50,
    allowedChars: /[^a-zA-Z0-9-_]/g,
    stripHtml: true,
    trim: true
  }).toLowerCase().replace(/\s+/g, '-');
};

/**
 * Sanitizes file paths
 */
export const sanitizeFilePath = (path: string): string => {
  return sanitizeInput(path, {
    maxLength: 255,
    allowedChars: /[^a-zA-Z0-9-_./]/g,
    stripHtml: true,
    trim: true
  }).replace(/\.{2,}/g, '.').replace(/\/{2,}/g, '/');
};

/**
 * Rate limiting for input processing
 */
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number = 100, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < this.windowMs);
    
    if (validRequests.length >= this.maxRequests) {
      return false;
    }

    validRequests.push(now);
    this.requests.set(identifier, validRequests);
    return true;
  }

  reset(identifier: string): void {
    this.requests.delete(identifier);
  }
}

export const inputRateLimiter = new RateLimiter(50, 60000); // 50 requests per minute
