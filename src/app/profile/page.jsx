'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Avatar from '@/components/ui/Avatar';

/**
 * Profile Page - User account management
 * 
 * Features:
 * - View profile info (name, email, avatar)
 * - Edit name and phone
 * - Protected route (redirects to /login if not authenticated)
 * - Optimistic updates with error rollback
 */
export default function ProfilePage() {
    const router = useRouter();
    const { user, loading, isAuthenticated, updateProfile, logout } = useAuth();

    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
    });

    // Redirect if not authenticated
    useEffect(() => {
        if (!loading && !isAuthenticated) {
            // Store intent to return after login
            sessionStorage.setItem('redirectAfterLogin', '/profile');
            router.push('/login');
        }
    }, [loading, isAuthenticated, router]);

    // Populate form when user data loads
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                phone: user.phone || '',
            });
        }
    }, [user]);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError(null);
        setSuccess(false);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        setIsSaving(true);

        try {
            // Use AuthContext's updateProfile which handles:
            // - API call to /auth/profile
            // - Optimistic updates
            // - Error rollback
            // - State synchronization
            await updateProfile(formData);
            setSuccess(true);
            setIsEditing(false);
        } catch (err) {
            setError(err.message || 'Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    // Cancel editing
    const handleCancel = () => {
        setFormData({
            name: user?.name || '',
            phone: user?.phone || '',
        });
        setIsEditing(false);
        setError(null);
    };

    // Handle logout
    const handleLogout = () => {
        logout();
        router.push('/');
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
            </div>
        );
    }

    // Not authenticated
    if (!isAuthenticated) {
        return null; // Will redirect
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
                    <p className="text-gray-600 mt-2">Manage your profile and preferences</p>
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Avatar Section */}
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-8">
                        <div className="flex items-center gap-6">
                            <Avatar user={user} size="xl" />
                            <div className="text-white">
                                <h2 className="text-2xl font-bold">{user?.name || 'User'}</h2>
                                <p className="text-blue-100">{user?.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Form Section */}
                    <form onSubmit={handleSubmit} className="p-6">
                        {/* Success Message */}
                        {success && (
                            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                                ✓ Profile updated successfully
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                                {error}
                            </div>
                        )}

                        {/* Form Fields */}
                        <div className="space-y-6">
                            {/* Email (read-only) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={user?.email || ''}
                                    disabled
                                    className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
                                />
                                <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                            </div>

                            {/* Name */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className={`w-full px-4 py-3 border rounded-lg transition-colors
                                        ${isEditing
                                            ? 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                                            : 'bg-gray-50 border-gray-200 text-gray-700'
                                        }`}
                                    placeholder="Enter your full name"
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className={`w-full px-4 py-3 border rounded-lg transition-colors
                                        ${isEditing
                                            ? 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                                            : 'bg-gray-50 border-gray-200 text-gray-700'
                                        }`}
                                    placeholder="Enter your phone number"
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-8 flex gap-4">
                            {isEditing && (
                                <>
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSaving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        disabled={isSaving}
                                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </>
                            )}
                        </div>
                    </form>

                    {/* Danger Zone */}
                    <div className="border-t border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Actions</h3>
                        <button
                            onClick={handleLogout}
                            className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-3 px-6 rounded-lg transition-colors border border-red-200"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
