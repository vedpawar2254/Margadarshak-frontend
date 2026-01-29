'use client';

import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Avatar from '@/components/ui/Avatar';
import ProfileDialog from '@/components/auth/ProfileDialog';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
    const pathname = usePathname();
    const { user, loading, isAuthenticated, logout } = useAuth();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Hide header on auth pages
    const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-otp'];
    if (authRoutes.includes(pathname)) {
        return null;
    }

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'About-Us', href: '/about-us' },
        { name: 'Courses', href: '/courses' },
        { name: 'Mentors/Self-Test', href: '/mentors' },
        { name: 'Placement', href: '/placement' },
        { name: 'Blogs', href: '/blogs' },
        { name: 'Well-Being', href: '/wellbeing' },
        { name: 'Events', href: '/events' },
        { name: 'Contact-Us', href: '/contact' },
    ];

    // Render auth buttons based on state
    const renderAuthSection = () => {
        // Show nothing while loading to prevent flicker
        if (loading) {
            return (
                <div className="w-10 h-10 rounded-full bg-white/20 animate-pulse" />
            );
        }

        // Logged in - show avatar
        if (isAuthenticated && user) {
            return (
                <div className="relative">
                    <Avatar
                        user={user}
                        size="md"
                        onClick={() => setIsProfileDialogOpen(!isProfileDialogOpen)}
                    />
                    <ProfileDialog
                        isOpen={isProfileDialogOpen}
                        onClose={() => setIsProfileDialogOpen(false)}
                    />
                </div>
            );
        }

        // Logged out - show login/register
        return (
            <div className="flex items-center gap-2">
                <Link
                    href="/login"
                    className="text-white hover:text-gray-200 px-4 py-2 text-sm font-medium transition-colors"
                >
                    Login
                </Link>
                <Link
                    href="/register"
                    className="bg-[#22c55e] hover:bg-[#16a34a] text-white px-5 py-2 rounded-full font-semibold transition-colors duration-200 shadow-sm text-sm"
                >
                    Register
                </Link>
            </div>
        );
    };

    // Render mobile auth section
    const renderMobileAuthSection = () => {
        if (loading) return null;

        if (isAuthenticated && user) {
            return (
                <div className="px-3 py-3 border-t border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                        <Avatar user={user} size="md" />
                        <div>
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                    </div>
                    <Link
                        href="/profile"
                        className="block w-full text-center py-2 px-4 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors mb-2"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Manage Account
                    </Link>
                    <button
                        onClick={() => {
                            logout();
                            setIsMenuOpen(false);
                        }}
                        className="block w-full text-center py-2 px-4 bg-red-50 text-red-600 rounded-md font-medium hover:bg-red-100 transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
            );
        }

        return (
            <>
                <Link
                    href="/login"
                    className="block w-full text-center mt-2 border border-gray-300 text-gray-700 px-5 py-3 rounded-md font-semibold transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                >
                    Login
                </Link>
                <Link
                    href="/register"
                    className="block w-full text-center mt-2 bg-[#22c55e] hover:bg-[#16a34a] text-white px-5 py-3 rounded-md font-semibold transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                >
                    Register
                </Link>
            </>
        );
    };

    return (
        <header className="bg-[#0c5696] text-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center text-white">
                        <Image
                            src="/Mwhitelogo.png"
                            alt="Margdarshak Logo - Empowering Students to Achieve Their Dreams"
                            width={43}
                            height={43}
                            className="w-13 h-15 mr-0"
                        />
                        <span className="text-2xl font-extrabold mt-2.5 tracking-tight">Margdarshak</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex space-x-5 items-center" aria-label="Main Navigation">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`text-sm font-medium transition-all duration-200 border-b-2 ${pathname === link.href
                                    ? 'border-white text-white'
                                    : 'border-transparent text-gray-100 hover:text-white hover:border-gray-300'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        {renderAuthSection()}
                    </nav>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center lg:hidden">
                        <button
                            onClick={toggleMenu}
                            type="button"
                            className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                            aria-controls="mobile-menu"
                            aria-expanded={isMenuOpen}
                            aria-label="Toggle mobile menu"
                        >
                            <span className="sr-only">Open main menu</span>
                            {!isMenuOpen ? (
                                <svg
                                    className="block h-6 w-6"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    className="block h-6 w-6"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="lg:hidden bg-white border-t border-gray-200" id="mobile-menu">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${pathname === link.href
                                    ? 'text-[#0f52ba] bg-gray-50'
                                    : 'text-gray-600 hover:text-[#0f52ba] hover:bg-gray-50'
                                    }`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        {renderMobileAuthSection()}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
