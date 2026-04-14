// Old Money Aesthetic Theme
export const THEME = {
  colors: {
    // Primary palette
    navy: '#1B263B',           // Deep navy blue - primary brand color
    forestGreen: '#2D4A3E',    // Rich forest green
    burgundy: '#6B1C2F',       // Deep burgundy red
    cream: '#F5F1E8',          // Warm cream (backgrounds)
    gold: '#C5A880',           // Muted gold (accents)
    charcoal: '#3C3C3C',       // Charcoal gray (text)

    // Supporting colors
    ivory: '#FFFFF0',          // Ivory (cards)
    leather: '#8B4513',        // Leather brown (warm accents)
    slate: '#708090',          // Slate gray (secondary text)
    white: '#FFFFFF',

    // Functional
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FF9800',
  },
  gradients: {
    hero: 'linear-gradient(135deg, #1B263B 0%, #2D4A3E 100%)',
    card: 'linear-gradient(135deg, #F5F1E8 0%, #FFFFF0 100%)',
    cardHover: 'linear-gradient(135deg, #FFFFF0 0%, #F5F1E8 100%)',
    button: 'linear-gradient(135deg, #1B263B 0%, #3C3C3C 100%)',
    buttonHover: 'linear-gradient(135deg, #2D4A3E 0%, #1B263B 100%)',
    bgGradient: 'linear-gradient(180deg, #F5F1E8 0%, #E8E4DC 100%)',
    accentGradient: 'linear-gradient(135deg, #6B1C2F 0%, #8B4513 100%)',
    progressGradient: 'linear-gradient(90deg, #C5A880 0%, #8B4513 100%)',
    textGradient: 'linear-gradient(135deg, #1B263B 0%, #2D4A3E 100%)',
    borderGradient: 'linear-gradient(135deg, #C5A880 0%, #8B4513 100%)',
  },
  shadows: {
    glow: '0 4px 12px rgba(27, 38, 59, 0.15)',
    heavyGlow: '0 8px 24px rgba(27, 38, 59, 0.2)',
    card: '0 2px 8px rgba(27, 38, 59, 0.08)',
    goldShadow: '0 4px 16px rgba(197, 168, 128, 0.3)',
  },
  transitions: {
    smooth: '0.3s ease-in-out',
    fast: '0.15s ease-in-out',
    slow: '0.6s ease-in-out',
  },
};

// Validation Rules
export const VALIDATION = {
  password: {
    minLength: 8,
    requireNumbers: true,
    requireSpecialChars: true,
    requireUpperCase: false,
  },
  username: {
    minLength: 3,
    maxLength: 30,
    pattern: /^[a-zA-Z0-9_-]+$/,
  },
  idea: {
    titleMaxLength: 100,
    descriptionMaxLength: 5000,
    categoryMaxLength: 50,
  },
  comment: {
    maxLength: 500,
  },
};

// Rate Limiting
export const RATE_LIMITS = {
  loginAttempts: 5,
  loginLockoutMinutes: 15,
  emailVerificationResends: 3,
  ideaCreationPerMinute: 1,
};

// Progress Stages
export const PROGRESS_STAGES = ['concept', 'validation', 'mvp', 'beta', 'live'] as const;

// Error Messages
export const ERROR_MESSAGES = {
  auth: {
    invalidEmail: 'Invalid email address',
    weakPassword: 'Password must be 8+ characters with numbers and special characters',
    emailExists: 'Email already registered',
    invalidCredentials: 'Invalid email or password',
    accountLocked: 'Account locked. Try again in 15 minutes',
    twoFARequired: '2FA code required',
    invalidTwoFACode: 'Invalid 2FA code',
    sessionExpired: 'Your session has expired. Please login again',
    emailNotVerified: 'Please verify your email before logging in',
  },
  collaboration: {
    notAuthorized: "You don't have permission to perform this action",
    ownerRemovalNotAllowed: 'You cannot remove yourself as owner. Transfer ownership first.',
    duplicateInvite: 'User is already a collaborator on this idea',
    inviteExpired: 'This invite link has expired',
  },
  idea: {
    notFound: 'Idea not found',
    ownershipRequired: 'Only the idea owner can edit this',
    deleteConfirm: 'Are you sure you want to delete this idea? This action cannot be undone.',
  },
  network: {
    offline: 'You are offline. Changes will sync when you reconnect.',
    timeout: 'Request timeout. Please try again.',
    error: 'Something went wrong. Please try again.',
  },
};
