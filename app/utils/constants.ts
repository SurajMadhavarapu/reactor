// Cream & White Clean Theme
export const THEME = {
  colors: {
    gold: '#F5F5F0',           // Cream/off-white
    deepRed: '#E8E8E3',        // Light cream
    darkSteel: '#000000',      // Pure black text
    brightOrange: '#000000',   // Pure black text
    white: '#FFFFFF',          // Pure white
    darkBg: '#FAF9F6',         // Cream background
    cardBg: '#FFFFFF',         // White cards
    borderColor: '#E0DFD9',    // Light gray border
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FF9800',
  },
  gradients: {
    hero: 'linear-gradient(135deg, #2C2C2C 0%, #4A4A4A 100%)',
    card: 'linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(250, 249, 246, 0.5) 100%)',
    cardHover: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(240, 240, 235, 0.8) 100%)',
    button: 'linear-gradient(135deg, #2C2C2C 0%, #4A4A4A 100%)',
    buttonHover: 'linear-gradient(135deg, #1A1A1A 0%, #333333 100%)',
    bgGradient: 'linear-gradient(180deg, #FAF9F6 0%, #F5F5F0 100%)',
    accentGradient: 'linear-gradient(135deg, #2C2C2C 0%, #555555 100%)',
    progressGradient: 'linear-gradient(90deg, #333333 0%, #555555 100%)',
    textGradient: 'linear-gradient(135deg, #2C2C2C 0%, #4A4A4A 100%)',
    bordergradient: 'linear-gradient(135deg, #2C2C2C 0%, #4A4A4A 100%)',
  },
  shadows: {
    glow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    heavyGlow: '0 8px 24px rgba(0, 0, 0, 0.12)',
    card: '0 2px 8px rgba(0, 0, 0, 0.06)',
    goldShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
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
