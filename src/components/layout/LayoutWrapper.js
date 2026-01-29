'use client';

import { usePathname } from 'next/navigation';
import { AuthProvider } from '@/contexts/AuthContext';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

/**
 * LayoutWrapper - Wraps the app with providers and conditional layout
 * 
 * Responsibilities:
 * 1. Provide AuthContext to entire app (single source of truth)
 * 2. Conditionally render Header/Footer (hide on admin routes)
 */
export default function LayoutWrapper({ children }) {
    const pathname = usePathname();
    const isAdminRoute = pathname?.startsWith('/admin');

    return (
        <AuthProvider>
            {isAdminRoute ? (
                // Admin routes have their own layout
                <>{children}</>
            ) : (
                // Public routes get Header + Footer
                <>
                    <Header />
                    {children}
                    <Footer />
                </>
            )}
        </AuthProvider>
    );
}
