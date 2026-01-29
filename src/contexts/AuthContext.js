'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { api } from '@/services/api';
import { mapError } from '@/utils/errorCodes';

// Auth states for explicit state machine
export const AUTH_STATES = {
    IDLE: 'idle',
    LOADING: 'loading',
    AUTHENTICATED: 'authenticated',
    UNAUTHENTICATED: 'unauthenticated',
    ERROR: 'error',
};

// OTP states
export const OTP_STATES = {
    IDLE: 'idle',
    SENDING: 'sending',
    SENT: 'sent',
    VERIFYING: 'verifying',
    VERIFIED: 'verified',
    ERROR: 'error',
};

// Create the Auth Context
const AuthContext = createContext(null);

// OTP cooldown duration in seconds
const OTP_COOLDOWN_SECONDS = 60;
// Max OTP retry attempts
const MAX_OTP_RETRIES = 3;

/**
 * AuthProvider - Global authentication state provider
 * 
 * This is the SINGLE SOURCE OF TRUTH for auth state.
 * All components reading auth state will reactively update when this changes.
 */
export function AuthProvider({ children }) {
    // Core auth state
    const [user, setUser] = useState(null);
    const [authState, setAuthState] = useState(AUTH_STATES.LOADING);
    const [error, setError] = useState(null);

    // OTP state management
    const [otpState, setOtpState] = useState(OTP_STATES.IDLE);
    const [otpCooldown, setOtpCooldown] = useState(0);
    const [otpRetries, setOtpRetries] = useState(MAX_OTP_RETRIES);
    const cooldownInterval = useRef(null);

    // Request tracking to prevent double-submits
    const pendingRequests = useRef(new Set());

    // Legacy compatibility
    const loading = authState === AUTH_STATES.LOADING;
    const isAuthenticated = authState === AUTH_STATES.AUTHENTICATED && !!user;

    /**
     * Start OTP cooldown timer
     */
    const startCooldown = useCallback(() => {
        setOtpCooldown(OTP_COOLDOWN_SECONDS);

        if (cooldownInterval.current) {
            clearInterval(cooldownInterval.current);
        }

        cooldownInterval.current = setInterval(() => {
            setOtpCooldown(prev => {
                if (prev <= 1) {
                    clearInterval(cooldownInterval.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }, []);

    // Cleanup cooldown interval on unmount
    useEffect(() => {
        return () => {
            if (cooldownInterval.current) {
                clearInterval(cooldownInterval.current);
            }
        };
    }, []);

    /**
     * Check if a request is already pending (prevent double-submit)
     */
    const isRequestPending = useCallback((key) => {
        return pendingRequests.current.has(key);
    }, []);

    /**
     * Track a pending request
     */
    const trackRequest = useCallback((key) => {
        pendingRequests.current.add(key);
        return () => pendingRequests.current.delete(key);
    }, []);

    /**
     * Verify token on mount and restore session
     */
    const verifyToken = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setAuthState(AUTH_STATES.UNAUTHENTICATED);
            return null;
        }

        try {
            setAuthState(AUTH_STATES.LOADING);
            const data = await api.get('/auth/verify-token');
            setUser(data.user);
            setAuthState(AUTH_STATES.AUTHENTICATED);
            setError(null);
            return data.user;
        } catch (err) {
            localStorage.removeItem('token');
            setUser(null);
            setAuthState(AUTH_STATES.UNAUTHENTICATED);
            setError(mapError(err));
            return null;
        }
    }, []);

    // Hydrate auth state on mount
    useEffect(() => {
        verifyToken();
    }, [verifyToken]);

    // Handle Google OAuth callback tokens in URL (legacy support)
    useEffect(() => {
        // Skip if we're on the dedicated callback page
        if (typeof window !== 'undefined' && window.location.pathname === '/auth/google/callback') {
            return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (token) {
            localStorage.setItem('token', token);
            window.history.replaceState({}, document.title, window.location.pathname);
            verifyToken();

            const redirectPath = sessionStorage.getItem('redirectAfterLogin') || '/courses';
            sessionStorage.removeItem('redirectAfterLogin');
            if (redirectPath !== window.location.pathname) {
                window.location.href = redirectPath;
            }
        }
    }, [verifyToken]);

    /**
     * Login with email/password credentials
     */
    const login = async (credentials) => {
        const requestKey = 'login';
        if (isRequestPending(requestKey)) {
            throw new Error('Login already in progress');
        }

        const cleanup = trackRequest(requestKey);
        try {
            setAuthState(AUTH_STATES.LOADING);
            setError(null);
            const data = await api.post('/auth/login', credentials);

            if (data.data?.accessToken) {
                localStorage.setItem('token', data.data.accessToken);
            }
            const loggedInUser = data.data?.student || data.data?.user;
            setUser(loggedInUser);
            setAuthState(AUTH_STATES.AUTHENTICATED);

            // Handle redirect intent after login
            const redirectPath = sessionStorage.getItem('redirectAfterLogin');
            if (redirectPath) {
                sessionStorage.removeItem('redirectAfterLogin');
            }

            return { ...data, redirectPath };
        } catch (err) {
            setAuthState(AUTH_STATES.ERROR);
            const friendlyError = mapError(err);
            setError(friendlyError);
            throw new Error(friendlyError);
        } finally {
            cleanup();
        }
    };

    /**
     * Register new user
     */
    const register = async (userData) => {
        const requestKey = 'register';
        if (isRequestPending(requestKey)) {
            throw new Error('Registration already in progress');
        }

        const cleanup = trackRequest(requestKey);
        try {
            setAuthState(AUTH_STATES.LOADING);
            setError(null);
            const data = await api.post('/auth/register', userData);

            if (data.data?.accessToken) {
                localStorage.setItem('token', data.data.accessToken);
                setUser(data.data.student);
                setAuthState(AUTH_STATES.AUTHENTICATED);
            }
            return data;
        } catch (err) {
            setAuthState(AUTH_STATES.ERROR);
            const friendlyError = mapError(err);
            setError(friendlyError);
            throw new Error(friendlyError);
        } finally {
            cleanup();
        }
    };

    /**
     * Logout - clears all auth state
     */
    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        setUser(null);
        setAuthState(AUTH_STATES.UNAUTHENTICATED);
        setError(null);
        // Reset OTP state
        setOtpState(OTP_STATES.IDLE);
        setOtpRetries(MAX_OTP_RETRIES);
        setOtpCooldown(0);
    }, []);

    /**
     * Update user profile
     */
    const updateProfile = async (profileData) => {
        const requestKey = 'updateProfile';
        if (isRequestPending(requestKey)) {
            throw new Error('Update already in progress');
        }

        const cleanup = trackRequest(requestKey);
        const previousUser = user;

        try {
            setError(null);
            // Optimistic update
            setUser(prev => ({ ...prev, ...profileData }));

            const data = await api.put('/auth/profile', profileData);
            const updatedUser = data.data?.user || data.user;
            setUser(updatedUser);
            return data;
        } catch (err) {
            // Rollback on error
            setUser(previousUser);
            const friendlyError = mapError(err);
            setError(friendlyError);
            throw new Error(friendlyError);
        } finally {
            cleanup();
        }
    };

    /**
     * Request OTP for registration
     */
    const requestOTP = async (data) => {
        // Check cooldown
        if (otpCooldown > 0) {
            throw new Error(`Please wait ${otpCooldown} seconds before requesting a new code`);
        }

        // Check retry limit
        if (otpRetries <= 0) {
            throw new Error('Too many OTP requests. Please try again later.');
        }

        const requestKey = 'requestOTP';
        if (isRequestPending(requestKey)) {
            throw new Error('OTP request already in progress');
        }

        const cleanup = trackRequest(requestKey);
        try {
            setOtpState(OTP_STATES.SENDING);
            setError(null);
            const result = await api.post('/auth/register-otp', data);

            setOtpState(OTP_STATES.SENT);
            setOtpRetries(prev => prev - 1);
            startCooldown();

            return result;
        } catch (err) {
            setOtpState(OTP_STATES.ERROR);
            const friendlyError = mapError(err);
            setError(friendlyError);
            throw new Error(friendlyError);
        } finally {
            cleanup();
        }
    };

    /**
     * Verify registration OTP
     */
    const verifyOTP = async (data) => {
        const requestKey = 'verifyOTP';
        if (isRequestPending(requestKey)) {
            throw new Error('Verification already in progress');
        }

        const cleanup = trackRequest(requestKey);
        try {
            setOtpState(OTP_STATES.VERIFYING);
            setError(null);
            const result = await api.post('/auth/verify-registration', data);

            if (result.data?.accessToken) {
                localStorage.setItem('token', result.data.accessToken);
                setUser(result.data.student);
                setAuthState(AUTH_STATES.AUTHENTICATED);
            }

            setOtpState(OTP_STATES.VERIFIED);
            // Reset OTP retries on success
            setOtpRetries(MAX_OTP_RETRIES);

            return result;
        } catch (err) {
            setOtpState(OTP_STATES.ERROR);
            const friendlyError = mapError(err);
            setError(friendlyError);
            throw new Error(friendlyError);
        } finally {
            cleanup();
        }
    };

    /**
     * Verify password reset OTP
     */
    const verifyResetOTP = async (data) => {
        const requestKey = 'verifyResetOTP';
        if (isRequestPending(requestKey)) {
            throw new Error('Verification already in progress');
        }

        const cleanup = trackRequest(requestKey);
        try {
            setOtpState(OTP_STATES.VERIFYING);
            setError(null);
            const result = await api.post('/auth/verify-reset-otp', data);
            setOtpState(OTP_STATES.VERIFIED);
            return result;
        } catch (err) {
            setOtpState(OTP_STATES.ERROR);
            const friendlyError = mapError(err);
            setError(friendlyError);
            throw new Error(friendlyError);
        } finally {
            cleanup();
        }
    };

    /**
     * Request password reset OTP
     */
    const requestPasswordReset = async (email) => {
        // Check cooldown
        if (otpCooldown > 0) {
            throw new Error(`Please wait ${otpCooldown} seconds before requesting a new code`);
        }

        const requestKey = 'requestPasswordReset';
        if (isRequestPending(requestKey)) {
            throw new Error('Request already in progress');
        }

        const cleanup = trackRequest(requestKey);
        try {
            setOtpState(OTP_STATES.SENDING);
            setError(null);
            const result = await api.post('/auth/forgot-password', { email });

            setOtpState(OTP_STATES.SENT);
            startCooldown();

            return result;
        } catch (err) {
            setOtpState(OTP_STATES.ERROR);
            const friendlyError = mapError(err);
            setError(friendlyError);
            throw new Error(friendlyError);
        } finally {
            cleanup();
        }
    };

    /**
     * Upload avatar image
     */
    const uploadAvatar = async (file) => {
        const requestKey = 'uploadAvatar';
        if (isRequestPending(requestKey)) {
            throw new Error('Avatar upload already in progress');
        }

        const cleanup = trackRequest(requestKey);
        try {
            const formData = new FormData();
            formData.append('avatar', file);

            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/avatar`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to upload avatar');
            }

            const result = await response.json();

            // Update user state with new avatar
            if (result.data?.user) {
                setUser(result.data.user);
            } else if (result.data?.avatar) {
                setUser(prev => ({ ...prev, avatar: result.data.avatar }));
            }

            return result;
        } catch (err) {
            const friendlyError = mapError(err);
            setError(friendlyError);
            throw new Error(friendlyError);
        } finally {
            cleanup();
        }
    };

    /**
     * Initiate Google OAuth login
     */
    const loginWithGoogle = () => {
        sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
    };

    /**
     * Clear error state
     */
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    /**
     * Reset OTP state (for when user navigates away)
     */
    const resetOtpState = useCallback(() => {
        setOtpState(OTP_STATES.IDLE);
        setOtpRetries(MAX_OTP_RETRIES);
    }, []);

    // Context value
    const value = {
        // Core state
        user,
        loading,
        error,
        isAuthenticated,
        authState,

        // OTP state
        otpState,
        otpCooldown,
        otpRetries,
        canResendOtp: otpCooldown === 0 && otpRetries > 0,

        // Core actions
        login,
        register,
        logout,
        updateProfile,
        uploadAvatar,
        verifyToken,

        // OTP actions
        requestOTP,
        verifyOTP,
        verifyResetOTP,
        requestPasswordReset,
        resetOtpState,

        // OAuth
        loginWithGoogle,

        // Utilities
        clearError,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

/**
 * useAuth hook - Access auth context from any component
 */
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default AuthContext;
