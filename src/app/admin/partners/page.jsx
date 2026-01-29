'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/services/api';

export default function AdminPartnersPage() {
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [draggedId, setDraggedId] = useState(null);

    // Fetch all partners
    const fetchPartners = useCallback(async () => {
        try {
            const response = await api.get('/partners/all');
            setPartners(response.data || []);
        } catch (err) {
            setError('Failed to fetch partners');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPartners();
    }, [fetchPartners]);

    // Handle file upload
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['image/png', 'image/svg+xml', 'image/jpeg'];
        if (!validTypes.includes(file.type)) {
            setError('Please upload a PNG, SVG, or JPG file');
            return;
        }

        setUploading(true);
        setError('');

        try {
            // Upload image first
            const formData = new FormData();
            formData.append('file', file);

            const uploadRes = await api.upload('/upload?type=partner', formData);

            const logoUrl = uploadRes.data.fileUrl;

            // Create partner with logo URL
            await api.post('/partners', { logoUrl, isPublished: true });

            setSuccess('Partner logo uploaded successfully');
            fetchPartners();

            // Reset file input
            e.target.value = '';
        } catch (err) {
            setError('Failed to upload partner logo');
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    // Toggle publish status
    const togglePublish = async (id) => {
        try {
            await api.put(`/partners/${id}/toggle`);
            fetchPartners();
        } catch (err) {
            setError('Failed to toggle status');
            console.error(err);
        }
    };

    // Delete partner
    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this partner logo?')) return;

        try {
            await api.delete(`/partners/${id}`);
            setSuccess('Partner deleted successfully');
            fetchPartners();
        } catch (err) {
            setError('Failed to delete partner');
            console.error(err);
        }
    };

    // Update Size
    const handleSizeUpdate = async (id, newSize) => {
        try {
            // Optimistic update
            setPartners(prev => prev.map(p =>
                p.id === id ? { ...p, size: newSize } : p
            ));

            await api.put(`/partners/${id}`, { size: newSize });
        } catch (err) {
            console.error('Failed to update size:', err);
            // Revert on failure (could refetch, but simple revert for now)
            fetchPartners();
        }
    };

    // Drag and drop handlers
    const handleDragStart = (id) => {
        setDraggedId(id);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = async (targetId) => {
        if (draggedId === targetId) return;

        const newPartners = [...partners];
        const draggedIndex = newPartners.findIndex(p => p.id === draggedId);
        const targetIndex = newPartners.findIndex(p => p.id === targetId);

        const [removed] = newPartners.splice(draggedIndex, 1);
        newPartners.splice(targetIndex, 0, removed);

        setPartners(newPartners);
        setDraggedId(null);

        // Save new order
        try {
            await api.put('/partners/reorder', {
                orderedIds: newPartners.map(p => p.id)
            });
        } catch (err) {
            setError('Failed to save order');
            fetchPartners(); // Revert
        }
    };

    // Clear messages after 3 seconds
    useEffect(() => {
        if (error || success) {
            const timer = setTimeout(() => {
                setError('');
                setSuccess('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [error, success]);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <div style={{
                    width: '40px',
                    height: '40px',
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

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1f2937', marginBottom: '8px' }}>
                    Partner Companies
                </h1>
                <p style={{ color: '#6b7280' }}>
                    Manage partner logos displayed on the Placement page carousel
                </p>
            </div>

            {/* Messages */}
            {error && (
                <div style={{
                    background: '#fee2e2',
                    color: '#dc2626',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    marginBottom: '16px'
                }}>
                    ⚠️ {error}
                </div>
            )}
            {success && (
                <div style={{
                    background: '#d1fae5',
                    color: '#059669',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    marginBottom: '16px'
                }}>
                    ✓ {success}
                </div>
            )}

            {/* Upload Section */}
            <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '24px',
                marginBottom: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
                <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#374151' }}>
                    Add Partner Logo
                </h2>
                <div style={{
                    border: '2px dashed #d1d5db',
                    borderRadius: '8px',
                    padding: '32px',
                    textAlign: 'center',
                    background: '#f9fafb',
                    cursor: uploading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s'
                }}>
                    <input
                        type="file"
                        id="logo-upload"
                        accept=".png,.svg,.jpg,.jpeg"
                        onChange={handleFileUpload}
                        disabled={uploading}
                        style={{ display: 'none' }}
                    />
                    <label htmlFor="logo-upload" style={{ cursor: uploading ? 'not-allowed' : 'pointer' }}>
                        {uploading ? (
                            <div style={{ color: '#6b7280' }}>
                                <span style={{ fontSize: '32px' }}>⏳</span>
                                <p style={{ marginTop: '8px' }}>Uploading...</p>
                            </div>
                        ) : (
                            <div>
                                <span style={{ fontSize: '48px' }}>🖼️</span>
                                <p style={{ marginTop: '12px', color: '#6b7280', fontSize: '14px' }}>
                                    Click to upload partner logo
                                </p>
                                <p style={{ color: '#9ca3af', fontSize: '12px', marginTop: '4px' }}>
                                    PNG, SVG, or JPG (recommended: transparent background)
                                </p>
                            </div>
                        )}
                    </label>
                </div>
            </div>

            {/* Partners List */}
            <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
                <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#374151' }}>
                    All Partners ({partners.length})
                </h2>

                {partners.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '48px', color: '#6b7280' }}>
                        <span style={{ fontSize: '48px' }}>🏢</span>
                        <p style={{ marginTop: '12px' }}>No partner logos yet. Upload one above!</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '12px' }}>
                        {partners.map((partner, index) => (
                            <div
                                key={partner.id}
                                draggable
                                onDragStart={() => handleDragStart(partner.id)}
                                onDragOver={handleDragOver}
                                onDrop={() => handleDrop(partner.id)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                    padding: '16px',
                                    background: draggedId === partner.id ? '#eff6ff' : '#f9fafb',
                                    borderRadius: '8px',
                                    border: '1px solid #e5e7eb',
                                    cursor: 'grab',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {/* Drag Handle */}
                                <div style={{ color: '#9ca3af', fontSize: '18px' }}>⋮⋮</div>

                                {/* Order Number */}
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    background: '#e5e7eb',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    color: '#4b5563'
                                }}>
                                    {index + 1}
                                </div>

                                {/* Logo Preview with Resizing */}
                                <div style={{
                                    width: '120px',
                                    height: '80px',
                                    background: 'white',
                                    borderRadius: '8px',
                                    border: '1px solid #e5e7eb',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    overflow: 'hidden',
                                    position: 'relative'
                                }}>
                                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <img
                                            src={partner.logoUrl}
                                            alt="Partner logo"
                                            style={{
                                                width: `${(partner.size || 100) / 2}px`, // Scaled for preview (approx)
                                                maxWidth: '100%',
                                                maxHeight: '100%',
                                                objectFit: 'contain',
                                                transition: 'width 0.2s'
                                            }}
                                        />
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        gap: '2px',
                                        background: '#f3f4f6',
                                        borderRadius: '4px',
                                        padding: '2px',
                                        position: 'absolute',
                                        bottom: '4px',
                                        right: '4px'
                                    }}>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const newSize = Math.max(10, (partner.size || 100) - 10);
                                                handleSizeUpdate(partner.id, newSize);
                                            }}
                                            style={{
                                                width: '20px',
                                                height: '20px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                border: '1px solid #d1d5db',
                                                background: 'white',
                                                borderRadius: '3px',
                                                cursor: 'pointer',
                                                fontSize: '12px',
                                                color: '#374151'
                                            }}
                                            title="Decrease size"
                                        >-</button>
                                        <span style={{ fontSize: '10px', padding: '0 4px', color: '#6b7280', alignSelf: 'center' }}>
                                            {partner.size || 100}%
                                        </span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const newSize = Math.min(200, (partner.size || 100) + 10);
                                                handleSizeUpdate(partner.id, newSize);
                                            }}
                                            style={{
                                                width: '20px',
                                                height: '20px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                border: '1px solid #d1d5db',
                                                background: 'white',
                                                borderRadius: '3px',
                                                cursor: 'pointer',
                                                fontSize: '12px',
                                                color: '#374151'
                                            }}
                                            title="Increase size"
                                        >+</button>
                                    </div>
                                </div>

                                {/* Status Badge */}
                                <div style={{ flex: 1 }}>
                                    <span style={{
                                        padding: '4px 12px',
                                        borderRadius: '20px',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        background: partner.isPublished ? '#d1fae5' : '#f3f4f6',
                                        color: partner.isPublished ? '#059669' : '#6b7280'
                                    }}>
                                        {partner.isPublished ? '✓ Published' : 'Draft'}
                                    </span>
                                </div>

                                {/* Actions */}
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                        onClick={() => togglePublish(partner.id)}
                                        style={{
                                            padding: '8px 16px',
                                            borderRadius: '6px',
                                            border: 'none',
                                            cursor: 'pointer',
                                            fontSize: '13px',
                                            fontWeight: '500',
                                            background: partner.isPublished ? '#fef3c7' : '#dbeafe',
                                            color: partner.isPublished ? '#d97706' : '#2563eb'
                                        }}
                                    >
                                        {partner.isPublished ? 'Unpublish' : 'Publish'}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(partner.id)}
                                        style={{
                                            padding: '8px 16px',
                                            borderRadius: '6px',
                                            border: 'none',
                                            cursor: 'pointer',
                                            fontSize: '13px',
                                            fontWeight: '500',
                                            background: '#fee2e2',
                                            color: '#dc2626'
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <p style={{ marginTop: '16px', fontSize: '13px', color: '#9ca3af' }}>
                    💡 Tip: Drag and drop to reorder. Only published logos appear on the placement page.
                </p>
            </div>
        </div>
    );
}
