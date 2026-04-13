import { VALIDATION } from './constants';

// Maximum payload sizes (in bytes)
const MAX_PAYLOAD_SIZES = {
  email: 254,
  password: 1000,
  username: 100,
  ideaTitle: 500,
  ideaDescription: 50000,
  comment: 5000,
  displayName: 500,
  general: 10000,
};

// Dangerous patterns that might indicate injection attacks
const DANGEROUS_PATTERNS = [
  /<script/gi,
  /javascript:/gi,
  /on\w+\s*=/gi, // Event handlers
  /eval\(/gi,
  /expression\(/gi,
  /vbscript:/gi,
  /data:text\/html/gi,
  /<!--/g, // HTML comments
  /-->/g,
];

/**
 * Validate email format and size
 */
export const validateEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;
  if (email.length > MAX_PAYLOAD_SIZES.email) return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate and check password strength
 */
export const validatePassword = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!password || typeof password !== 'string') {
    errors.push('Password is required');
    return { valid: false, errors };
  }

  if (password.length > MAX_PAYLOAD_SIZES.password) {
    errors.push('Password is too long');
    return { valid: false, errors };
  }

  if (password.length < VALIDATION.password.minLength) {
    errors.push(`Password must be at least ${VALIDATION.password.minLength} characters`);
  }

  if (VALIDATION.password.requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (VALIDATION.password.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Validate username format and size
 */
export const validateUsername = (username: string): boolean => {
  if (!username || typeof username !== 'string') return false;
  if (username.length > MAX_PAYLOAD_SIZES.username) return false;
  
  return (
    username.length >= VALIDATION.username.minLength &&
    username.length <= VALIDATION.username.maxLength &&
    VALIDATION.username.pattern.test(username)
  );
};

/**
 * Sanitize input by removing dangerous content
 * - Trims whitespace
 * - Removes HTML/script tags
 * - Removes dangerous patterns
 * - Enforces max length
 */
export const sanitizeInput = (input: string, maxLength: number = 1000): string => {
  if (!input || typeof input !== 'string') return '';
  
  // Enforce max length
  if (input.length > maxLength) {
    return '';
  }

  let sanitized = input.trim();

  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, '');

  // Remove HTML tags
  sanitized = sanitized
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '');

  // Remove dangerous patterns
  for (const pattern of DANGEROUS_PATTERNS) {
    sanitized = sanitized.replace(pattern, '');
  }

  // Remove control characters except newlines and tabs
  sanitized = sanitized.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');

  // Encode special characters
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');

  return sanitized;
};

/**
 * Validate idea title
 */
export const validateIdeaTitle = (title: string): boolean => {
  if (!title || typeof title !== 'string') return false;
  if (title.length > MAX_PAYLOAD_SIZES.ideaTitle) return false;
  
  return title.trim().length > 0 && title.length <= VALIDATION.idea.titleMaxLength;
};

/**
 * Validate idea description
 */
export const validateIdeaDescription = (description: string): boolean => {
  if (!description || typeof description !== 'string') return false;
  if (description.length > MAX_PAYLOAD_SIZES.ideaDescription) return false;
  
  return description.trim().length > 0 && description.length <= VALIDATION.idea.descriptionMaxLength;
};

/**
 * Validate comment
 */
export const validateComment = (comment: string): boolean => {
  if (!comment || typeof comment !== 'string') return false;
  if (comment.length > MAX_PAYLOAD_SIZES.comment) return false;
  
  return comment.trim().length > 0 && comment.length <= VALIDATION.comment.maxLength;
};

/**
 * Validate display name
 */
export const validateDisplayName = (name: string): boolean => {
  if (!name || typeof name !== 'string') return false;
  if (name.length > MAX_PAYLOAD_SIZES.displayName) return false;
  
  return name.trim().length > 0 && name.length <= 100;
};

/**
 * Check password strength
 */
export const checkPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
  if (!password || typeof password !== 'string') return 'weak';
  
  let strength = 0;

  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength++;

  if (strength <= 2) return 'weak';
  if (strength <= 4) return 'medium';
  return 'strong';
};

/**
 * Validate JSON payload size
 */
export const validatePayloadSize = (payload: any, maxBytes: number = MAX_PAYLOAD_SIZES.general): boolean => {
  try {
    const jsonString = JSON.stringify(payload);
    const bytes = new TextEncoder().encode(jsonString).length;
    return bytes <= maxBytes;
  } catch {
    return false;
  }
};

/**
 * Sanitize entire object recursively
 */
export const sanitizeObject = (obj: any, maxDepth: number = 10): any => {
  if (maxDepth <= 0) return null;
  
  if (typeof obj === 'string') {
    return sanitizeInput(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item, maxDepth - 1));
  }
  
  if (obj !== null && typeof obj === 'object') {
    const sanitized: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        sanitized[key] = sanitizeObject(obj[key], maxDepth - 1);
      }
    }
    return sanitized;
  }
  
  return obj;
};
