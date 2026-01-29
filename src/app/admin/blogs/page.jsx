'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';

export default function AdminBlogsPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(null);

    useEffect(() => {
        if (!authLoading && (!user || user.email !== 'namanjainpy@gmail.com')) {
            router.push('/');
        }
    }, [user, authLoading, router]);

    const fetchBlogs = async (pageNum = 1) => {
        try {
            setLoading(true);
            const response = await api.get(`/blogs/admin/all?page=${pageNum}&limit=20`);

            if (response.success) {
                setBlogs(response.data || []);
                setPagination(response.pagination);
            }
        } catch (err) {
            console.error('Error fetching blogs:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.email === 'namanjainpy@gmail.com') {
            fetchBlogs(page);
        }
    }, [user, page]);

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this blog?')) return;

        try {
            await api.delete(`/blogs/${id}`);
            fetchBlogs(page);
        } catch (err) {
            alert('Failed to delete: ' + err.message);
        }
    };

    const handleTogglePublish = async (id) => {
        try {
            await api.patch(`/blogs/${id}/publish`);
            fetchBlogs(page);
        } catch (err) {
            alert('Failed to toggle publish: ' + err.message);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Not published';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    if (authLoading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '32px'
            }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1f2937' }}>
                        Blog Management
                    </h1>
                    <p style={{ color: '#6b7280' }}>Create, edit, and publish blog posts</p>
                </div>
                <Link
                    href="/admin/blogs/create"
                    style={{
                        padding: '12px 24px',
                        background: '#3b82f6',
                        color: 'white',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    + Create Blog
                </Link>
            </div>

            {error && (
                <div style={{
                    background: '#fee2e2',
                    color: '#dc2626',
                    padding: '16px',
                    borderRadius: '8px',
                    marginBottom: '24px'
                }}>
                    {error}
                </div>
            )}

            {loading ? (
                <div style={{ textAlign: 'center', padding: '60px' }}>
                    <p>Loading blogs...</p>
                </div>
            ) : blogs.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '60px',
                    background: '#f9fafb',
                    borderRadius: '12px'
                }}>
                    <p style={{ fontSize: '48px', marginBottom: '16px' }}>📝</p>
                    <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>No blogs yet</h2>
                    <p style={{ color: '#6b7280', marginBottom: '24px' }}>Create your first blog post to get started</p>
                    <Link
                        href="/admin/blogs/create"
                        style={{
                            padding: '12px 24px',
                            background: '#3b82f6',
                            color: 'white',
                            borderRadius: '8px',
                            textDecoration: 'none'
                        }}
                    >
                        Create Blog
                    </Link>
                </div>
            ) : (
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    overflow: 'hidden'
                }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Title</th>
                                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Status</th>
                                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Date</th>
                                <th style={{ padding: '16px', textAlign: 'right', fontWeight: '600', color: '#374151' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {blogs.map((blog) => (
                                <tr key={blog.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                    <td style={{ padding: '16px' }}>
                                        <div>
                                            <p style={{ fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>
                                                {blog.title}
                                            </p>
                                            <p style={{ fontSize: '14px', color: '#6b7280' }}>
                                                /{blog.slug}
                                            </p>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <span style={{
                                            padding: '4px 12px',
                                            borderRadius: '20px',
                                            fontSize: '14px',
                                            fontWeight: '500',
                                            background: blog.status === 'published' ? '#d1fae5' : '#fef3c7',
                                            color: blog.status === 'published' ? '#059669' : '#d97706'
                                        }}>
                                            {blog.status === 'published' ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px', color: '#6b7280', fontSize: '14px' }}>
                                        {formatDate(blog.publishedAt || blog.createdAt)}
                                    </td>
                                    <td style={{ padding: '16px', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                            <button
                                                onClick={() => handleTogglePublish(blog.id)}
                                                style={{
                                                    padding: '8px 12px',
                                                    background: blog.status === 'published' ? '#fef3c7' : '#d1fae5',
                                                    color: blog.status === 'published' ? '#d97706' : '#059669',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                {blog.status === 'published' ? 'Unpublish' : 'Publish'}
                                            </button>
                                            <Link
                                                href={`/admin/blogs/${blog.id}/edit`}
                                                style={{
                                                    padding: '8px 12px',
                                                    background: '#eff6ff',
                                                    color: '#3b82f6',
                                                    borderRadius: '6px',
                                                    textDecoration: 'none',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(blog.id)}
                                                style={{
                                                    padding: '8px 12px',
                                                    background: '#fee2e2',
                                                    color: '#dc2626',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '8px',
                    marginTop: '32px'
                }}>
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        style={{
                            padding: '8px 16px',
                            background: page === 1 ? '#f3f4f6' : '#3b82f6',
                            color: page === 1 ? '#9ca3af' : 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: page === 1 ? 'not-allowed' : 'pointer'
                        }}
                    >
                        Previous
                    </button>
                    <span style={{ padding: '8px 16px', color: '#6b7280' }}>
                        Page {page} of {pagination.totalPages}
                    </span>
                    <button
                        onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                        disabled={page === pagination.totalPages}
                        style={{
                            padding: '8px 16px',
                            background: page === pagination.totalPages ? '#f3f4f6' : '#3b82f6',
                            color: page === pagination.totalPages ? '#9ca3af' : 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: page === pagination.totalPages ? 'not-allowed' : 'pointer'
                        }}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
