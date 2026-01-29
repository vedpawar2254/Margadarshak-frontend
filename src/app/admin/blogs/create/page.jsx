'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';

export default function CreateBlogPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        shortDescription: '',
        content: '',
        coverImage: '',
        author: '',
        status: 'draft'
    });

    if (authLoading) {
        return <div style={{ padding: '60px', textAlign: 'center' }}>Loading...</div>;
    }

    if (!user || user.email !== 'namanjainpy@gmail.com') {
        router.push('/');
        return null;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim() || !formData.content.trim()) {
            setError('Title and content are required');
            return;
        }

        try {
            setSaving(true);
            setError(null);

            const response = await api.post('/blogs', formData);

            if (response.success) {
                router.push('/admin/blogs');
            } else {
                setError(response.message || 'Failed to create blog');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const inputStyle = {
        width: '100%',
        padding: '12px 16px',
        border: '2px solid #e5e7eb',
        borderRadius: '8px',
        fontSize: '16px',
        outline: 'none',
        transition: 'border-color 0.2s',
        color: '#000000',
        backgroundColor: '#ffffff'
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '8px',
        fontWeight: '600',
        color: '#374151'
    };

    return (
        <div style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
            <Link
                href="/admin/blogs"
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#6b7280',
                    textDecoration: 'none',
                    marginBottom: '24px'
                }}
            >
                ← Back to Blogs
            </Link>

            <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1f2937', marginBottom: '32px' }}>
                Create New Blog
            </h1>

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

            <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gap: '24px' }}>
                    {/* Title */}
                    <div>
                        <label style={labelStyle}>Title *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            style={inputStyle}
                            placeholder="Enter blog title"
                        />
                    </div>

                    {/* Short Description */}
                    <div>
                        <label style={labelStyle}>Short Description</label>
                        <textarea
                            name="shortDescription"
                            value={formData.shortDescription}
                            onChange={handleChange}
                            rows={3}
                            style={inputStyle}
                            placeholder="Brief description for preview cards"
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <label style={labelStyle}>Content *</label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            rows={15}
                            style={inputStyle}
                            placeholder="Write your blog content here..."
                        />
                    </div>

                    {/* Cover Image */}
                    <div>
                        <label style={labelStyle}>Cover Image URL</label>
                        <input
                            type="text"
                            name="coverImage"
                            value={formData.coverImage}
                            onChange={handleChange}
                            style={inputStyle}
                            placeholder="https://example.com/image.jpg"
                        />
                        {formData.coverImage && (
                            <div style={{
                                marginTop: '12px',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                height: '200px',
                                background: `url(${formData.coverImage}) center/cover`
                            }} />
                        )}
                    </div>

                    {/* Author */}
                    <div>
                        <label style={labelStyle}>Author Name</label>
                        <input
                            type="text"
                            name="author"
                            value={formData.author}
                            onChange={handleChange}
                            style={inputStyle}
                            placeholder="Author name"
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label style={labelStyle}>Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            style={inputStyle}
                        >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                        </select>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '12px', paddingTop: '16px' }}>
                        <button
                            type="submit"
                            disabled={saving}
                            style={{
                                padding: '14px 28px',
                                background: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: saving ? 'not-allowed' : 'pointer',
                                opacity: saving ? 0.6 : 1
                            }}
                        >
                            {saving ? 'Creating...' : 'Create Blog'}
                        </button>
                        <Link
                            href="/admin/blogs"
                            style={{
                                padding: '14px 28px',
                                background: '#f3f4f6',
                                color: '#1f2937',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '16px',
                                textDecoration: 'none'
                            }}
                        >
                            Cancel
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    );
}
