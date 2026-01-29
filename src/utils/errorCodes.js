/**
 * Error Code Mapping
 * 
 * Maps backend error messages to user-friendly messages.
 * Centralizes error handling to ensure consistent UX.
 */

// Backend error patterns → User-friendly messages
const ERROR_MAP = {
    // Authentication errors
    'Invalid credentials': 'The email or password you entered is incorrect.',
    'Invalid or expired token': 'Your session has expired. Please sign in again.',
    'Access token is required': 'Please sign in to continue.',
    'Authentication required': 'Please sign in to access this feature.',

    // Registration errors
    'Email or phone number already exists': 'An account with this email or phone already exists. Try signing in instead.',
    'Email already exists': 'An account with this email already exists.',
    'Phone number already exists': 'This phone number is already registered.',
    'Phone number is already in use': 'This phone number is already in use by another account.',

    // OTP errors
    'Invalid or expired OTP': 'The code you entered is invalid or has expired. Please request a new one.',
    'OTP expired': 'This verification code has expired. Please request a new one.',
    'Too many OTP requests': 'Too many verification attempts. Please wait a few minutes before trying again.',
    'OTP already sent': 'A verification code was already sent. Please check your email or wait before requesting again.',
    'Failed to send OTP': 'Unable to send verification code. Please try again.',
    'OTP request already in progress': 'A verification request is already in progress. Please wait.',

    // Profile errors
    'Student not found': 'Account not found. Please sign in again.',
    'User not found': 'Account not found.',
    'No fields to update': 'Please provide at least one field to update.',
    'Please provide at least one field to update': 'Please update at least your name or phone number.',
    'Update already in progress': 'Your profile is being updated. Please wait.',

    // Password reset errors
    'Invalid reset token': 'This password reset link is invalid or has expired.',
    'Reset token expired': 'This password reset link has expired. Please request a new one.',

    // Network errors
    'Network error': 'Unable to connect. Please check your internet connection.',
    'fetch failed': 'Unable to connect to the server. Please try again.',
    'Failed to fetch': 'Network error. Please check your connection and try again.',

    // Request tracking
    'Login already in progress': 'Please wait while we sign you in.',
    'Registration already in progress': 'Please wait while we create your account.',
    'Verification already in progress': 'Please wait while we verify your code.',

    // Generic
    'Something went wrong': 'Something went wrong. Please try again.',
};

// Error codes for programmatic handling
export const ERROR_CODES = {
    INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
    TOKEN_EXPIRED: 'TOKEN_EXPIRED',
    EMAIL_EXISTS: 'EMAIL_EXISTS',
    PHONE_EXISTS: 'PHONE_EXISTS',
    OTP_INVALID: 'OTP_INVALID',
    OTP_EXPIRED: 'OTP_EXPIRED',
    RATE_LIMITED: 'RATE_LIMITED',
    NETWORK_ERROR: 'NETWORK_ERROR',
    UNKNOWN: 'UNKNOWN',
};

/**
 * Maps a backend error to a user-friendly message
 * @param {Error|string} error - Error object or message string
 * @returns {string} User-friendly error message
 */
export function mapError(error) {
    const message = typeof error === 'string' ? error : error?.message || '';

    // Check for exact match first
    if (ERROR_MAP[message]) {
        return ERROR_MAP[message];
    }

    // Check for partial matches
    for (const [pattern, friendlyMessage] of Object.entries(ERROR_MAP)) {
        if (message.toLowerCase().includes(pattern.toLowerCase())) {
            return friendlyMessage;
        }
    }

    // Check for HTTP status codes in message
    if (message.includes('401')) {
        return 'Your session has expired. Please sign in again.';
    }
    if (message.includes('403')) {
        return 'You don\'t have permission to perform this action.';
    }
    if (message.includes('404')) {
        return 'The requested resource was not found.';
    }
    if (message.includes('429')) {
        return 'Too many requests. Please wait a moment before trying again.';
    }
    if (message.includes('500') || message.includes('502') || message.includes('503')) {
        return 'Server error. Please try again later.';
    }

    // Default: return original message (but sanitized)
    // Don't expose raw technical errors to users
    if (message.includes('Error:') || message.includes('error')) {
        return 'Something went wrong. Please try again.';
    }

    return message || 'An unexpected error occurred.';
}

/**
 * Extracts error code from error for programmatic handling
 * @param {Error|string} error - Error object or message
 * @returns {string} Error code
 */
export function getErrorCode(error) {
    const message = typeof error === 'string' ? error : error?.message || '';
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('invalid credentials')) return ERROR_CODES.INVALID_CREDENTIALS;
    if (lowerMessage.includes('expired token') || lowerMessage.includes('session')) return ERROR_CODES.TOKEN_EXPIRED;
    if (lowerMessage.includes('email') && lowerMessage.includes('exists')) return ERROR_CODES.EMAIL_EXISTS;
    if (lowerMessage.includes('phone') && lowerMessage.includes('exists')) return ERROR_CODES.PHONE_EXISTS;
    if (lowerMessage.includes('otp') && lowerMessage.includes('invalid')) return ERROR_CODES.OTP_INVALID;
    if (lowerMessage.includes('otp') && lowerMessage.includes('expired')) return ERROR_CODES.OTP_EXPIRED;
    if (lowerMessage.includes('too many') || lowerMessage.includes('rate')) return ERROR_CODES.RATE_LIMITED;
    if (lowerMessage.includes('network') || lowerMessage.includes('fetch')) return ERROR_CODES.NETWORK_ERROR;

    return ERROR_CODES.UNKNOWN;
}

export default { mapError, getErrorCode, ERROR_CODES };
