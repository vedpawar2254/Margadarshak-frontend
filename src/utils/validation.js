/**
 * Validation utilities for forms
 */

export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePassword = (password) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character
    const minLength = /.{8,}/;
    const hasUpperCase = /[A-Z]/;
    const hasLowerCase = /[a-z]/;
    const hasNumbers = /\d/;
    const hasSpecialChar = /[@$!%*?&#]/;

    return {
        isValid: minLength.test(password) &&
            hasUpperCase.test(password) &&
            hasLowerCase.test(password) &&
            hasNumbers.test(password) &&
            hasSpecialChar.test(password),
        requirements: {
            minLength: minLength.test(password),
            hasUpperCase: hasUpperCase.test(password),
            hasLowerCase: hasLowerCase.test(password),
            hasNumbers: hasNumbers.test(password),
            hasSpecialChar: hasSpecialChar.test(password),
        }
    };
};

export const validatePhone = (phone) => {
    // Simple phone validation - can be adjusted based on requirements
    const phoneRegex = /^\d{10,15}$/;
    return phoneRegex.test(phone);
};

export const validateName = (name) => {
    // Name should be at least 2 characters and contain only letters, spaces, hyphens, and apostrophes
    const nameRegex = /^[a-zA-Z\s'-]{2,}$/;
    return nameRegex.test(name.trim());
};