'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';

const CATEGORIES = [
    'Finance', 'Business', 'Personal Development', 'Career',
    'Leadership', 'Marketing', 'Technology', 'Self-Help', 'Productivity', 'Other'
];

export default function EditBookPage() {
    const router = useRouter();
    const params = useParams();
    const { user, loading: authLoading } = useAuth();
    const [formData, setFormData] = useState({
        title: '',
        authorName: '',
        category: '',
        shortDescription: '',
        coverImage: '',
        rating: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (params.id && user) {
            fetchBook();
        }
    }, [params.id, user]);

    const fetchBook = async () => {
        try {
            const response = await api.get(`/books/admin/${params.id}`);
            const book = response.data;
            setFormData({
                title: book.title || '',
                authorName: book.authorName || '',
                category: book.category || '',
                shortDescription: book.shortDescription || '',
                coverImage: book.coverImage || '',
                rating: book.rating?.toString() || ''
            });
        } catch (err) {
            setError('Failed to load book');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (error) setError('');
        if (success) setSuccess('');
    };

    const isValidUrl = (string) => {
        if (!string) return true; // Empty is ok
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            setError('Book title is required');
            return;
        }
        if (!formData.authorName.trim()) {
            setError('Author name is required');
            return;
        }
        if (!formData.category) {
            setError('Please select a category');
            return;
        }
        if (formData.coverImage && !isValidUrl(formData.coverImage)) {
            setError('Please enter a valid image URL');
            return;
        }

        setSaving(true);
        setError('');
        try {
            await api.put(`/books/admin/${params.id}`, {
                ...formData,
                rating: formData.rating ? parseFloat(formData.rating) : null
            });
            setSuccess('Book updated successfully!');
            setTimeout(() => router.push('/admin/books'), 1000);
        } catch (err) {
            setError(err.message || 'Failed to update book');
        } finally {
            setSaving(false);
        }
    };

    if (authLoading || loading) {
        return <div style={{ padding: '60px', textAlign: 'center' }}>Loading...</div>;
    }

    const inputStyle = {
        width: '100%',
        padding: '12px 16px',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        fontSize: '15px',
        outline: 'none'
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '8px',
        fontWeight: '500',
        color: '#374151'
    };

    return (
        <div style={{ padding: '32px', maxWidth: '700px', margin: '0 auto' }}>
            <Link
                href="/admin/books"
                style={{ color: '#6b7280', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '24px' }}
            >
                ← Back to Books
            </Link>

            <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
                Edit Book
            </h1>
            <p style={{ color: '#6b7280', marginBottom: '32px' }}>
                Update book recommendation details
            </p>

            {error && (
                <div style={{
                    padding: '12px 16px',
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '8px',
                    color: '#dc2626',
                    marginBottom: '24px',
                    fontSize: '14px'
                }}>
                    {error}
                </div>
            )}

            {success && (
                <div style={{
                    padding: '12px 16px',
                    background: '#dcfce7',
                    border: '1px solid #bbf7d0',
                    borderRadius: '8px',
                    color: '#16a34a',
                    marginBottom: '24px',
                    fontSize: '14px'
                }}>
                    ✓ {success}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Title */}
                <div>
                    <label style={labelStyle}>Book Title <span style={{ color: '#dc2626' }}>*</span></label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                        placeholder="e.g., The Intelligent Investor"
                        style={inputStyle}
                    />
                </div>

                {/* Author */}
                <div>
                    <label style={labelStyle}>Author Name <span style={{ color: '#dc2626' }}>*</span></label>
                    <input
                        type="text"
                        value={formData.authorName}
                        onChange={(e) => handleChange('authorName', e.target.value)}
                        placeholder="e.g., Benjamin Graham"
                        style={inputStyle}
                    />
                </div>

                {/* Category */}
                <div>
                    <label style={labelStyle}>Category <span style={{ color: '#dc2626' }}>*</span></label>
                    <select
                        value={formData.category}
                        onChange={(e) => handleChange('category', e.target.value)}
                        style={{ ...inputStyle, background: '#fff' }}
                    >
                        <option value="">Select category</option>
                        {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                {/* Short Description */}
                <div>
                    <label style={labelStyle}>Short Description</label>
                    <textarea
                        value={formData.shortDescription}
                        onChange={(e) => handleChange('shortDescription', e.target.value)}
                        placeholder="Brief description shown on the card (optional)"
                        rows={3}
                        style={{ ...inputStyle, resize: 'vertical' }}
                    />
                </div>

                {/* Cover Image URL */}
                <div>
                    <label style={labelStyle}>Cover Image URL</label>
                    <input
                        type="url"
                        value={formData.coverImage}
                        onChange={(e) => handleChange('coverImage', e.target.value)}
                        placeholder="https://example.com/book-cover.jpg"
                        style={inputStyle}
                    />
                    <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '6px' }}>
                        Paste a direct link to the book cover image
                    </p>
                    {formData.coverImage && isValidUrl(formData.coverImage) && (
                        <div style={{ marginTop: '12px' }}>
                            <img
                                src={formData.coverImage}
                                alt="Cover preview"
                                style={{
                                    width: '120px',
                                    height: '180px',
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                    border: '1px solid #e5e7eb'
                                }}
                                onError={(e) => e.target.style.display = 'none'}
                            />
                        </div>
                    )}
                </div>

                {/* Rating */}
                <div>
                    <label style={labelStyle}>Rating (optional)</label>
                    <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        value={formData.rating}
                        onChange={(e) => handleChange('rating', e.target.value)}
                        placeholder="e.g., 4.8"
                        style={{ ...inputStyle, width: '120px' }}
                    />
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                    <button
                        type="button"
                        onClick={() => router.push('/admin/books')}
                        style={{
                            padding: '12px 24px',
                            borderRadius: '8px',
                            border: '1px solid #e5e7eb',
                            background: '#fff',
                            cursor: 'pointer',
                            fontWeight: '500',
                            color: '#374151'
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        style={{
                            padding: '12px 24px',
                            borderRadius: '8px',
                            border: 'none',
                            background: '#2563eb',
                            color: '#fff',
                            cursor: saving ? 'not-allowed' : 'pointer',
                            fontWeight: '500',
                            opacity: saving ? 0.7 : 1
                        }}
                    >
                        {saving ? 'Saving...' : 'Update Book'}
                    </button>
                </div>
            </form>
        </div>
    );
}
