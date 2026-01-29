'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

/**
 * Google OAuth Callback Page
 * 
 * Handles the redirect from Google OAuth with token in URL params.
 * Stores token, verifies auth, and redirects to intended destination.
 */
export default function GoogleCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { verifyToken } = useAuth();
    const [status, setStatus] = useState('processing');
    const [error, setError] = useState(null);

    useEffect(() => {
        const handleCallback = async () => {
            const token = searchParams.get('token');
            const refreshToken = searchParams.get('refreshToken');
            const errorParam = searchParams.get('error');

            // Handle OAuth error
            if (errorParam) {
                setStatus('error');
                setError('Authentication failed. Please try again.');
                setTimeout(() => router.push('/login?error=oauth_failed'), 2000);
                return;
            }

            // No token received
            if (!token) {
                setStatus('error');
                setError('No authentication token received.');
                setTimeout(() => router.push('/login?error=no_token'), 2000);
                return;
            }

            try {
                // Store the token
                localStorage.setItem('token', token);
                if (refreshToken) {
                    localStorage.setItem('refreshToken', refreshToken);
                }

                // Verify and hydrate auth state
                await verifyToken();

                // Get redirect intent or default to dashboard
                const redirectPath = sessionStorage.getItem('redirectAfterLogin') || '/courses';
                sessionStorage.removeItem('redirectAfterLogin');

                setStatus('success');

                // Small delay to show success message
                setTimeout(() => {
                    router.push(redirectPath);
                }, 500);
            } catch (err) {
                console.error('OAuth callback error:', err);
                setStatus('error');
                setError('Failed to complete sign in. Please try again.');
                localStorage.removeItem('token');
                setTimeout(() => router.push('/login?error=verification_failed'), 2000);
            }
        };

        handleCallback();
    }, [searchParams, router, verifyToken]);

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f9fafb',
            padding: '20px'
        }}>
            {status === 'processing' && (
                <>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        border: '4px solid #e5e7eb',
                        borderTop: '4px solid #3b82f6',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        marginBottom: '24px'
                    }} />
                    <h2 style={{
                        fontSize: '20px',
                        fontWeight: '600',
                        color: '#1f2937',
                        marginBottom: '8px'
                    }}>
                        Completing sign in...
                    </h2>
                    <p style={{ color: '#6b7280', fontSize: '14px' }}>
                        Please wait while we verify your account.
                    </p>
                </>
            )}

            {status === 'success' && (
                <>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        backgroundColor: '#d1fae5',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '24px'
                    }}>
                        <span style={{ fontSize: '24px' }}>✓</span>
                    </div>
                    <h2 style={{
                        fontSize: '20px',
                        fontWeight: '600',
                        color: '#059669',
                        marginBottom: '8px'
                    }}>
                        Sign in successful!
                    </h2>
                    <p style={{ color: '#6b7280', fontSize: '14px' }}>
                        Redirecting you now...
                    </p>
                </>
            )}

            {status === 'error' && (
                <>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        backgroundColor: '#fee2e2',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '24px'
                    }}>
                        <span style={{ fontSize: '24px' }}>✕</span>
                    </div>
                    <h2 style={{
                        fontSize: '20px',
                        fontWeight: '600',
                        color: '#dc2626',
                        marginBottom: '8px'
                    }}>
                        Sign in failed
                    </h2>
                    <p style={{ color: '#6b7280', fontSize: '14px' }}>
                        {error}
                    </p>
                </>
            )}

            <style jsx>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
