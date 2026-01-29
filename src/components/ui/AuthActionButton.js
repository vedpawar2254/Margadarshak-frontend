'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

/**
 * AuthActionButton - Auth-aware CTA button
 * 
 * Behavior:
 * - If logged in → navigates to authenticatedRoute
 * - If not logged in → stores intent, navigates to login
 * - After login → automatically redirects to intended destination
 * 
 * Usage:
 * <AuthActionButton
 *   label="Enroll Now"
 *   authenticatedRoute="/courses/123/enroll"
 *   className="bg-blue-500 text-white px-6 py-3 rounded-lg"
 * />
 */
export default function AuthActionButton({
    label,
    authenticatedRoute,
    unauthenticatedRoute = '/login',
    className = '',
    onClick,
    disabled = false,
    type = 'button',
    children,
    ...props
}) {
    const router = useRouter();
    const { isAuthenticated, loading } = useAuth();

    const handleClick = (e) => {
        // Allow custom onClick to run first
        if (onClick) {
            onClick(e);
            if (e.defaultPrevented) return;
        }

        if (loading) {
            // Still checking auth state, wait
            return;
        }

        if (isAuthenticated) {
            // User is logged in - go to intended destination
            router.push(authenticatedRoute);
        } else {
            // User is not logged in - store intent and redirect to login
            sessionStorage.setItem('redirectAfterLogin', authenticatedRoute);
            router.push(unauthenticatedRoute);
        }
    };

    return (
        <button
            type={type}
            onClick={handleClick}
            disabled={disabled || loading}
            className={`${className} ${loading ? 'opacity-75 cursor-wait' : ''}`}
            {...props}
        >
            {children || label}
        </button>
    );
}

/**
 * AuthLink - Auth-aware link component (for anchor-style buttons)
 * 
 * Same behavior as AuthActionButton but styled as a link
 */
export function AuthLink({
    label,
    authenticatedRoute,
    unauthenticatedRoute = '/login',
    className = '',
    children,
    ...props
}) {
    const router = useRouter();
    const { isAuthenticated, loading } = useAuth();

    const handleClick = (e) => {
        e.preventDefault();

        if (loading) return;

        if (isAuthenticated) {
            router.push(authenticatedRoute);
        } else {
            sessionStorage.setItem('redirectAfterLogin', authenticatedRoute);
            router.push(unauthenticatedRoute);
        }
    };

    return (
        <a
            href={authenticatedRoute}
            onClick={handleClick}
            className={className}
            {...props}
        >
            {children || label}
        </a>
    );
}
