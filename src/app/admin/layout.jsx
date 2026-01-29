'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

const ADMIN_EMAIL = 'namanjainpy@gmail.com';

export default function AdminLayout({ children }) {
    const router = useRouter();
    const { user, loading } = useAuth();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/login');
            } else if (user.email !== ADMIN_EMAIL) {
                router.push('/');
            } else {
                setTimeout(() => setIsAuthorized(true), 0);
            }
        }
    }, [loading, user, router]);

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f3f4f6'
            }}>
                <div style={{
                    width: '48px',
                    height: '48px',
                    border: '4px solid #e5e7eb',
                    borderTop: '4px solid #3b82f6',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }} />
                <style jsx>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    if (!isAuthorized) {
        return null;
    }

    const navItems = [
        { name: 'Dashboard', href: '/admin', icon: '📊' },
        { name: 'Courses', href: '/admin/courses', icon: '📚' },
        { name: 'Users', href: '/admin/users', icon: '👥' },
        { name: 'Blogs', href: '/admin/blogs', icon: '📝' },
        { name: 'Events', href: '/admin/events', icon: '📅' },
        { name: 'Workshops', href: '/admin/workshops', icon: '🛠️' },
        { name: 'Donations', href: '/admin/donations', icon: '🎁' },
        { name: 'Partners', href: '/admin/partners', icon: '🏢' },
        { name: 'Mentors', href: '/admin/mentors', icon: '👨‍🏫' },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f3f4f6' }}>
            {/* Sidebar */}
            <aside style={{
                width: sidebarOpen ? '256px' : '80px',
                background: 'white',
                borderRight: '1px solid #e5e7eb',
                transition: 'width 0.3s ease',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* Logo */}
                <div style={{
                    padding: '20px',
                    borderBottom: '1px solid #e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                }}>
                    <span style={{ fontSize: '24px' }}>⚙️</span>
                    {sidebarOpen && (
                        <span style={{ fontWeight: '700', fontSize: '18px', color: '#1f2937' }}>
                            Admin Dashboard
                        </span>
                    )}
                </div>

                {/* Navigation */}
                <nav style={{ flex: 1, padding: '16px 12px' }}>
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '12px 16px',
                                marginBottom: '8px',
                                borderRadius: '8px',
                                color: '#4b5563',
                                textDecoration: 'none',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.background = '#f3f4f6';
                                e.currentTarget.style.color = '#1f2937';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = '#4b5563';
                            }}
                        >
                            <span style={{ fontSize: '20px' }}>{item.icon}</span>
                            {sidebarOpen && <span style={{ fontWeight: '500' }}>{item.name}</span>}
                        </Link>
                    ))}
                </nav>

                {/* Toggle Button */}
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    style={{
                        margin: '16px',
                        padding: '12px',
                        background: '#f3f4f6',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    {sidebarOpen ? '◀️' : '▶️'}
                </button>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Top Bar */}
                <header style={{
                    background: 'white',
                    padding: '16px 24px',
                    borderBottom: '1px solid #e5e7eb',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div>
                        <span style={{ color: '#6b7280', fontSize: '14px' }}>Welcome,</span>
                        <span style={{ marginLeft: '8px', fontWeight: '600', color: '#1f2937' }}>
                            {user?.name || 'Admin'}
                        </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        
                        <button
                            onClick={() => {
                                localStorage.removeItem('token');
                                router.push('/login');
                            }}
                            style={{
                                background: '#ef4444',
                                color: 'white',
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontWeight: '500',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}
                        >
                            🚪 Logout
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
                    {children}
                </div>
            </main>
        </div>
    );
}
