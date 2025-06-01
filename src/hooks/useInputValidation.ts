// src/hooks/useInputValidation.ts
import { useState, useCallback } from 'react';
import { validateInput, ValidationRule } from '@/lib/utils/input-sanitizer';
import { trackEvent } from '@/lib/analytics/event-tracker';

interface ValidationErrors {
  [key: string]: string;
}

export const useInputValidation = () => {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateField = useCallback((
    fieldName: string, 
    value: string, 
    rules: ValidationRule
  ): boolean => {
    const { isValid, errors: fieldErrors } = validateInput(value, rules);
    
    setErrors(prev => ({
      ...prev,
      [fieldName]: fieldErrors.length > 0 ? fieldErrors[0] : ''
    }));

    // Track validation failures for analytics
    if (!isValid) {
      trackEvent('validation_error', {
        field: fieldName,
        error: fieldErrors[0],
        value_length: value.length
      });
    }

    return isValid;
  }, []);

  const clearError = useCallback((fieldName: string) => {
    setErrors(prev => ({
      ...prev,
      [fieldName]: ''
    }));
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  const hasErrors = Object.values(errors).some(error => error !== '');

  return {
    errors,
    validateField,
    clearError,
    clearAllErrors,
    hasErrors
  };
};
