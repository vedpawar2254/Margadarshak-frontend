'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';

export default function AdminUsersPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

    // Delete confirmation modal
    const [deleteModal, setDeleteModal] = useState({ open: false, student: null });
    const [deleting, setDeleting] = useState(false);

    // Toast notification
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    // Fetch students with retry for cold start
    const fetchStudents = useCallback(async (page = 1, search = '', retryCount = 0) => {
        try {
            setLoading(true);
            setError(null); // Clear previous errors
            const params = new URLSearchParams({ page, limit: 20 });
            if (search.trim()) params.append('search', search.trim());

            const response = await api.get(`/admin/users?${params.toString()}`);
            setStudents(response.data || []);
            setPagination(response.pagination || { page: 1, totalPages: 1, total: 0 });
            setError(null); // Clear error on success
        } catch (err) {
            // Retry up to 2 times for connection timeouts
            if (retryCount < 2 && err.message?.includes('timeout')) {
                setTimeout(() => fetchStudents(page, search, retryCount + 1), 1000);
                return;
            }
            setError(err.message || 'Failed to load students');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!authLoading && user) {
            fetchStudents(1, searchQuery);
        }
    }, [authLoading, user, fetchStudents]);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (user) fetchStudents(1, searchQuery);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery, user, fetchStudents]);

    // Handle delete
    const handleDeleteClick = (student) => {
        setDeleteModal({ open: true, student });
    };

    const handleDeleteConfirm = async () => {
        if (!deleteModal.student) return;

        setDeleting(true);
        try {
            await api.delete(`/admin/users/${deleteModal.student.id}`);

            // Remove from list
            setStudents(prev => prev.filter(s => s.id !== deleteModal.student.id));
            setPagination(prev => ({ ...prev, total: prev.total - 1 }));

            showToast('Student deleted successfully', 'success');
            setDeleteModal({ open: false, student: null });
        } catch (err) {
            showToast(err.message || 'Failed to delete student', 'error');
        } finally {
            setDeleting(false);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteModal({ open: false, student: null });
    };

    const showToast = (message, type) => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric'
        });
    };

    if (authLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
                <div style={{ width: '40px', height: '40px', border: '4px solid #e5e7eb', borderTop: '4px solid #3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            </div>
        );
    }

    return (
        <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1f2937', marginBottom: '8px' }}>
                    Manage Users
                </h1>
                <p style={{ color: '#6b7280', fontSize: '15px' }}>
                    View and manage all users in the system
                </p>
            </div>

            {/* Search */}
            <div style={{ marginBottom: '24px' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    gap: '12px'
                }}>
                    <svg width="20" height="20" fill="none" stroke="#9ca3af" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search users by name, email, or role..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            flex: 1,
                            border: 'none',
                            outline: 'none',
                            fontSize: '15px',
                            color: '#374151'
                        }}
                    />
                </div>
            </div>

            {/* Error */}
            {error && (
                <div style={{
                    padding: '16px',
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '8px',
                    color: '#dc2626',
                    marginBottom: '24px'
                }}>
                    {error}
                </div>
            )}

            {/* Table */}
            <div style={{
                background: '#fff',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                overflow: 'hidden'
            }}>
                {/* Table Header */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 2fr 1fr 1fr 100px',
                    padding: '16px 24px',
                    borderBottom: '1px solid #e5e7eb',
                    background: '#f9fafb'
                }}>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>User</span>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Email</span>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Role</span>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Status</span>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', textAlign: 'center' }}>Actions</span>
                </div>

                {/* Loading */}
                {loading && (
                    <div style={{ padding: '60px', textAlign: 'center', color: '#6b7280' }}>
                        Loading students...
                    </div>
                )}

                {/* Empty */}
                {!loading && students.length === 0 && (
                    <div style={{ padding: '60px', textAlign: 'center', color: '#6b7280' }}>
                        No students found
                    </div>
                )}

                {/* Rows */}
                {!loading && students.map((student) => (
                    <div
                        key={student.id}
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '2fr 2fr 1fr 1fr 100px',
                            padding: '16px 24px',
                            borderBottom: '1px solid #f3f4f6',
                            alignItems: 'center'
                        }}
                    >
                        {/* User */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: '#dbeafe',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {student.avatar ? (
                                    <img src={student.avatar} alt={student.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                                ) : (
                                    <svg width="20" height="20" fill="#3b82f6" viewBox="0 0 24 24">
                                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                    </svg>
                                )}
                            </div>
                            <div>
                                <div style={{ fontWeight: '500', color: '#1f2937' }}>{student.name}</div>
                                <div style={{ fontSize: '13px', color: '#9ca3af' }}>Joined {formatDate(student.createdAt)}</div>
                            </div>
                        </div>

                        {/* Email */}
                        <div style={{ color: '#374151', fontSize: '14px' }}>
                            {student.email || 'N/A'}
                        </div>

                        {/* Role */}
                        <div>
                            <span style={{
                                padding: '4px 12px',
                                borderRadius: '9999px',
                                fontSize: '12px',
                                fontWeight: '500',
                                background: student.email === 'namanjainpy@gmail.com' ? '#fce7f3' : '#dbeafe',
                                color: student.email === 'namanjainpy@gmail.com' ? '#be185d' : '#1d4ed8'
                            }}>
                                {student.email === 'namanjainpy@gmail.com' ? 'Admin' : 'Student'}
                            </span>
                        </div>

                        {/* Status */}
                        <div>
                            <span style={{
                                padding: '4px 12px',
                                borderRadius: '9999px',
                                fontSize: '12px',
                                fontWeight: '500',
                                background: student.isVerified ? '#dcfce7' : '#fef3c7',
                                color: student.isVerified ? '#16a34a' : '#d97706'
                            }}>
                                {student.isVerified ? 'Active' : 'Inactive'}
                            </span>
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                            {!student.email?.toLowerCase().includes('namanjainpy@gmail.com') && (
                                <button
                                    onClick={() => handleDeleteClick(student)}
                                    style={{
                                        width: '32px',
                                        height: '32px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: '#fee2e2',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer'
                                    }}
                                    title="Delete Student"
                                >
                                    <svg width="16" height="16" fill="#dc2626" viewBox="0 0 24 24">
                                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>
                ))
                }
            </div >

            {/* Pagination */}
            {
                pagination.totalPages > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '24px' }}>
                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => fetchStudents(page, searchQuery)}
                                style={{
                                    padding: '8px 14px',
                                    borderRadius: '8px',
                                    border: page === pagination.page ? 'none' : '1px solid #e5e7eb',
                                    background: page === pagination.page ? '#3b82f6' : '#fff',
                                    color: page === pagination.page ? '#fff' : '#374151',
                                    cursor: 'pointer',
                                    fontWeight: '500'
                                }}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                )
            }

            {/* Delete Confirmation Modal */}
            {
                deleteModal.open && (
                    <div style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000
                    }}>
                        <div style={{
                            background: '#fff',
                            borderRadius: '16px',
                            padding: '32px',
                            maxWidth: '400px',
                            width: '90%',
                            textAlign: 'center'
                        }}>
                            <div style={{
                                width: '60px',
                                height: '60px',
                                background: '#fee2e2',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 20px'
                            }}>
                                <svg width="28" height="28" fill="#dc2626" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                                </svg>
                            </div>

                            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '12px' }}>
                                Delete Student?
                            </h3>

                            <p style={{ color: '#6b7280', marginBottom: '8px', fontSize: '15px' }}>
                                You are about to delete <strong>{deleteModal.student?.name}</strong>.
                            </p>

                            <p style={{
                                color: '#dc2626',
                                fontSize: '14px',
                                background: '#fef2f2',
                                padding: '12px',
                                borderRadius: '8px',
                                marginBottom: '24px'
                            }}>
                                ⚠️ This student's data will be permanently deleted. This action cannot be undone.
                            </p>

                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                                <button
                                    onClick={handleDeleteCancel}
                                    disabled={deleting}
                                    style={{
                                        padding: '12px 24px',
                                        borderRadius: '8px',
                                        border: '1px solid #e5e7eb',
                                        background: '#fff',
                                        color: '#374151',
                                        fontWeight: '500',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteConfirm}
                                    disabled={deleting}
                                    style={{
                                        padding: '12px 24px',
                                        borderRadius: '8px',
                                        border: 'none',
                                        background: '#dc2626',
                                        color: '#fff',
                                        fontWeight: '500',
                                        cursor: deleting ? 'not-allowed' : 'pointer',
                                        opacity: deleting ? 0.7 : 1
                                    }}
                                >
                                    {deleting ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Toast Notification */}
            {
                toast.show && (
                    <div style={{
                        position: 'fixed',
                        bottom: '24px',
                        right: '24px',
                        padding: '16px 24px',
                        borderRadius: '8px',
                        background: toast.type === 'success' ? '#dcfce7' : '#fee2e2',
                        color: toast.type === 'success' ? '#16a34a' : '#dc2626',
                        fontWeight: '500',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        zIndex: 1001
                    }}>
                        {toast.message}
                    </div>
                )
            }

            <style jsx>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div >
    );
}
