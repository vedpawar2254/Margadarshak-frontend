'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import Avatar from '@/components/ui/Avatar';

/**
 * ProfileDialog - Google-style account dialog
 * 
 * Features:
 * - User avatar with initials fallback
 * - User name & email display
 * - "Manage Account" button → /profile
 * - "Sign Out" button
 * - Closes on outside click / ESC
 * - Focus trap for accessibility
 */
export default function ProfileDialog({ isOpen, onClose }) {
    const { user, logout } = useAuth();
    const router = useRouter();
    const dialogRef = useRef(null);
    const firstFocusableRef = useRef(null);

    // Handle ESC key to close
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Escape') {
            onClose();
        }
        // Focus trap - keep focus within dialog
        if (e.key === 'Tab' && dialogRef.current) {
            const focusableElements = dialogRef.current.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement?.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement?.focus();
            }
        }
    }, [onClose]);

    // Handle outside click
    const handleOutsideClick = useCallback((e) => {
        if (dialogRef.current && !dialogRef.current.contains(e.target)) {
            onClose();
        }
    }, [onClose]);

    // Setup event listeners
    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.addEventListener('mousedown', handleOutsideClick);
            // Focus first element when opened
            setTimeout(() => firstFocusableRef.current?.focus(), 0);
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [isOpen, handleKeyDown, handleOutsideClick]);

    // Handle logout
    const handleLogout = () => {
        logout();
        onClose();
        router.push('/');
    };

    // Handle manage account click
    const handleManageAccount = () => {
        onClose();
        router.push('/profile');
    };

    if (!isOpen || !user) return null;

    return (
        <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-dialog-title"
            className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50"
            style={{
                animation: 'fadeIn 0.15s ease-out',
            }}
        >
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            {/* User Info Section */}
            <div className="p-5 text-center border-b border-gray-100">
                <div className="flex justify-center mb-3">
                    <Avatar user={user} size="xl" />
                </div>
                <h2
                    id="profile-dialog-title"
                    className="text-lg font-semibold text-gray-900"
                >
                    {user.name || 'User'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                    {user.email}
                </p>
            </div>

            {/* Actions Section */}
            <div className="p-3">
                <button
                    ref={firstFocusableRef}
                    onClick={handleManageAccount}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left
                               text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                >
                    <span className="text-xl">👤</span>
                    <span className="font-medium">Manage Account</span>
                </button>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left
                               text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-150"
                >
                    <span className="text-xl">🚪</span>
                    <span className="font-medium">Sign Out</span>
                </button>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
                <p className="text-xs text-gray-400 text-center">
                    <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
                    {' • '}
                </p>
            </div>
        </div>
    );
}
