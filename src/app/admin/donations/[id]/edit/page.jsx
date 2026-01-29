'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/services/api';
import Link from 'next/link';

export default function EditDonationPage() {
    const params = useParams();
    const router = useRouter();
    const [formData, setFormData] = useState({
        bookTitle: '',
        authorName: '',
        category: '',
        condition: '',
        copies: 1,
        status: 'unpublished'
    });
    const [donation, setDonation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchDonation();
    }, []);

    const fetchDonation = async () => {
        try {
            const response = await api.get(`/donations/admin/${params.id}`);
            const data = response.data;
            setDonation(data);
            setFormData({
                bookTitle: data.bookTitle,
                authorName: data.authorName,
                category: data.category,
                condition: data.condition,
                copies: data.copies,
                status: data.status
            });
        } catch (error) {
            console.error('Failed to fetch donation:', error);
            alert('Failed to load donation');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            await api.put(`/donations/admin/${params.id}`, formData);
            alert('Donation updated successfully');
            router.push('/admin/donations');
        } catch (error) {
            console.error('Failed to update donation:', error);
            alert('Failed to update donation');
        } finally {
            setSaving(false);
        }
    };

    const categories = ['Finance', 'Business', 'Economics', 'Personal Development', 'Marketing', 'Technology', 'Other'];
    const conditions = ['New', 'Like New', 'Good', 'Fair'];

    if (loading) {
        return (
            <div style={{ padding: '40px', textAlign: 'center' }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    border: '3px solid #e5e7eb',
                    borderTop: '3px solid #2563eb',
                    borderRadius: '50%',
                    margin: '0 auto',
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

    return (
        <div>
            {/* Header */}
            <div style={{
                background: 'white',
                padding: '24px',
                borderRadius: '12px',
                marginBottom: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <Link href="/admin/donations">
                        <button style={{
                            padding: '8px',
                            background: '#f3f4f6',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            <svg width="20" height="20" fill="#374151" viewBox="0 0 24 24">
                                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                            </svg>
                        </button>
                    </Link>
                    <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1f2937', margin: 0 }}>
                        Edit Donation
                    </h1>
                </div>
                <p style={{ color: '#6b7280', fontSize: '14px', marginLeft: '60px' }}>
                    Update book donation details
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '32px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    marginBottom: '24px'
                }}>
                    <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>
                        Book Details
                    </h2>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        {/* Book Title */}
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: '600',
                                marginBottom: '8px',
                                color: '#374151'
                            }}>
                                Book Title <span style={{ color: '#dc2626' }}>*</span>
                            </label>
                            <input
                                type="text"
                                name="bookTitle"
                                required
                                value={formData.bookTitle}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    outline: 'none'
                                }}
                            />
                        </div>

                        {/* Author Name */}
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: '600',
                                marginBottom: '8px',
                                color: '#374151'
                            }}>
                                Author Name <span style={{ color: '#dc2626' }}>*</span>
                            </label>
                            <input
                                type="text"
                                name="authorName"
                                required
                                value={formData.authorName}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    outline: 'none'
                                }}
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: '600',
                                marginBottom: '8px',
                                color: '#374151'
                            }}>
                                Category <span style={{ color: '#dc2626' }}>*</span>
                            </label>
                            <select
                                name="category"
                                required
                                value={formData.category}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    outline: 'none',
                                    background: 'white'
                                }}
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        {/* Condition */}
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: '600',
                                marginBottom: '8px',
                                color: '#374151'
                            }}>
                                Condition <span style={{ color: '#dc2626' }}>*</span>
                            </label>
                            <select
                                name="condition"
                                required
                                value={formData.condition}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    outline: 'none',
                                    background: 'white'
                                }}
                            >
                                {conditions.map(cond => (
                                    <option key={cond} value={cond}>{cond}</option>
                                ))}
                            </select>
                        </div>

                        {/* Number of Copies */}
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: '600',
                                marginBottom: '8px',
                                color: '#374151'
                            }}>
                                Number of Copies
                            </label>
                            <input
                                type="number"
                                name="copies"
                                min="1"
                                value={formData.copies}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    outline: 'none'
                                }}
                            />
                        </div>

                        {/* Status */}
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: '600',
                                marginBottom: '8px',
                                color: '#374151'
                            }}>
                                Status
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    outline: 'none',
                                    background: 'white'
                                }}
                            >
                                <option value="published">Published</option>
                                <option value="unpublished">Unpublished</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Donor Information (Read Only) */}
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '32px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    marginBottom: '24px'
                }}>
                    <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>
                        Donor Information
                    </h2>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: '600',
                                marginBottom: '8px',
                                color: '#374151'
                            }}>
                                Donor Name
                            </label>
                            <input
                                type="text"
                                value={donation?.donorName || ''}
                                readOnly
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    background: '#f9fafb',
                                    color: '#6b7280'
                                }}
                            />
                        </div>

                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: '600',
                                marginBottom: '8px',
                                color: '#374151'
                            }}>
                                Email
                            </label>
                            <input
                                type="email"
                                value={donation?.donorEmail || ''}
                                readOnly
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    background: '#f9fafb',
                                    color: '#6b7280'
                                }}
                            />
                        </div>

                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: '600',
                                marginBottom: '8px',
                                color: '#374151'
                            }}>
                                Phone
                            </label>
                            <input
                                type="text"
                                value={donation?.phone || 'Not provided'}
                                readOnly
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    background: '#f9fafb',
                                    color: '#6b7280'
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    <Link href="/admin/donations">
                        <button
                            type="button"
                            style={{
                                padding: '12px 24px',
                                background: '#f3f4f6',
                                color: '#374151',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            Cancel
                        </button>
                    </Link>
                    <button
                        type="submit"
                        disabled={saving}
                        style={{
                            padding: '12px 24px',
                            background: '#2563eb',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: saving ? 'not-allowed' : 'pointer',
                            opacity: saving ? 0.7 : 1
                        }}
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}
