// Input sanitization utilities
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return '';

  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// URL validation
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Phone number validation (basic)
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
};

// XSS prevention
export const escapeHtml = (text: string): string => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

// CSRF token validation
export const validateCSRFToken = (token: string): boolean => {
  // In a real application, you would validate against the server
  return Boolean(token && token.length > 0);
};

// Rate limiting utility
export class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map();

  constructor(
    private maxAttempts: number = 5,
    private windowMs: number = 15 * 60 * 1000 // 15 minutes
  ) { }

  isAllowed(key: string): boolean {
    const now = Date.now();
    const attempt = this.attempts.get(key);

    if (!attempt || now > attempt.resetTime) {
      this.attempts.set(key, { count: 1, resetTime: now + this.windowMs });
      return true;
    }

    if (attempt.count >= this.maxAttempts) {
      return false;
    }

    attempt.count++;
    return true;
  }

  reset(key: string): void {
    this.attempts.delete(key);
  }
}

// Form validation utilities
export const validateRequired = (value: any): boolean => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

export const validateMinLength = (value: string, minLength: number): boolean => {
  return value.length >= minLength;
};

export const validateMaxLength = (value: string, maxLength: number): boolean => {
  return value.length <= maxLength;
};

export const validatePattern = (value: string, pattern: RegExp): boolean => {
  return pattern.test(value);
};

// File validation
export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type);
};

export const validateFileSize = (file: File, maxSizeMB: number): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

// Date validation
export const isValidDate = (date: string): boolean => {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d.getTime());
};

export const isFutureDate = (date: string): boolean => {
  const d = new Date(date);
  const now = new Date();
  return d > now;
};

// Number validation
export const isValidNumber = (value: any): boolean => {
  return !isNaN(value) && isFinite(value);
};

export const validateRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

// Credit card validation (Luhn algorithm)
export const validateCreditCard = (cardNumber: string): boolean => {
  const digits = cardNumber.replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;

  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i]);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

// Social security number validation (US)
export const validateSSN = (ssn: string): boolean => {
  const ssnRegex = /^(?!000|666|9\d{2})\d{3}-(?!00)\d{2}-(?!0000)\d{4}$/;
  return ssnRegex.test(ssn);
};

// ZIP code validation (US)
export const validateZIPCode = (zip: string): boolean => {
  const zipRegex = /^\d{5}(-\d{4})?$/;
  return zipRegex.test(zip);
};

// Generic form validation
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean;
  message?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateField = (value: any, rules: ValidationRule[]): ValidationResult => {
  const errors: string[] = [];

  for (const rule of rules) {
    if (rule.required && !validateRequired(value)) {
      errors.push(rule.message || 'This field is required');
      continue;
    }

    if (value && typeof value === 'string') {
      if (rule.minLength && !validateMinLength(value, rule.minLength)) {
        errors.push(rule.message || `Minimum length is ${rule.minLength} characters`);
      }

      if (rule.maxLength && !validateMaxLength(value, rule.maxLength)) {
        errors.push(rule.message || `Maximum length is ${rule.maxLength} characters`);
      }

      if (rule.pattern && !validatePattern(value, rule.pattern)) {
        errors.push(rule.message || 'Invalid format');
      }
    }

    if (rule.custom && !rule.custom(value)) {
      errors.push(rule.message || 'Invalid value');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Export all validation functions
export default {
  sanitizeInput,
  isValidEmail,
  validatePassword,
  isValidUrl,
  isValidPhoneNumber,
  escapeHtml,
  validateCSRFToken,
  RateLimiter,
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validatePattern,
  validateFileType,
  validateFileSize,
  isValidDate,
  isFutureDate,
  isValidNumber,
  validateRange,
  validateCreditCard,
  validateSSN,
  validateZIPCode,
  validateField
};
