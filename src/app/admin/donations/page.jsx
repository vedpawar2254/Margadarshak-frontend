'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/services/api';

export default function AdminDonationsPage() {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedDonation, setSelectedDonation] = useState(null);

    useEffect(() => {
        fetchDonations();
    }, []);

    const fetchDonations = async () => {
        try {
            const response = await api.get('/donations/admin/all');
            setDonations(response.data || []);
        } catch (error) {
            console.error('Failed to fetch donations:', error);
            alert('Failed to load donations');
        } finally {
            setLoading(false);
        }
    };

    const handleTogglePublish = async (id) => {
        try {
            await api.patch(`/donations/admin/${id}/publish`);
            fetchDonations(); // Refresh list
        } catch (error) {
            console.error('Failed to toggle publish status:', error);
            alert('Failed to update status');
        }
    };

    const handleDeleteClick = (donation) => {
        setSelectedDonation(donation);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await api.delete(`/donations/admin/${selectedDonation.id}`);
            setDeleteModalOpen(false);
            setSelectedDonation(null);
            fetchDonations();
        } catch (error) {
            console.error('Failed to delete donation:', error);
            alert('Failed to delete donation');
        }
    };

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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1f2937', marginBottom: '8px' }}>
                            📚 Manage Donated Books
                        </h1>
                        <p style={{ color: '#6b7280', fontSize: '14px' }}>
                            Review and publish book donations from users
                        </p>
                    </div>
                    <div style={{
                        padding: '8px 16px',
                        background: '#dbeafe',
                        borderRadius: '8px',
                        fontWeight: '600',
                        color: '#1e40af'
                    }}>
                        {donations.length} Total Donations
                    </div>
                </div>
            </div>

            {/* Donations Table */}
            <div style={{
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                overflow: 'hidden'
            }}>
                {donations.length === 0 ? (
                    <div style={{
                        padding: '60px 20px',
                        textAlign: 'center',
                        color: '#9ca3af'
                    }}>
                        <p style={{ fontSize: '48px', marginBottom: '16px' }}>📖</p>
                        <p>No donations yet</p>
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                            <tr>
                                <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Book Details</th>
                                <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Category</th>
                                <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Condition</th>
                                <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Donor</th>
                                <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Status</th>
                                <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Date</th>
                                <th style={{ padding: '16px', textAlign: 'center', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {donations.map((donation) => (
                                <tr key={donation.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                    <td style={{ padding: '16px' }}>
                                        <div>
                                            <div style={{ fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
                                                {donation.bookTitle}
                                            </div>
                                            <div style={{ fontSize: '13px', color: '#6b7280' }}>
                                                by {donation.authorName}
                                            </div>
                                            <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>
                                                {donation.copies} {donation.copies > 1 ? 'copies' : 'copy'}
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <span style={{
                                            padding: '4px 10px',
                                            background: '#dbeafe',
                                            color: '#1e40af',
                                            borderRadius: '6px',
                                            fontSize: '12px',
                                            fontWeight: '600'
                                        }}>
                                            {donation.category}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <span style={{
                                            padding: '4px 10px',
                                            background: '#dcfce7',
                                            color: '#16a34a',
                                            borderRadius: '6px',
                                            fontSize: '12px',
                                            fontWeight: '600'
                                        }}>
                                            {donation.condition}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <div>
                                            <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                                                {donation.donorName}
                                            </div>
                                            <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                                                {donation.donorEmail}
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <span style={{
                                            padding: '4px 12px',
                                            borderRadius: '9999px',
                                            fontSize: '12px',
                                            fontWeight: '600',
                                            background: donation.status === 'published' ? '#dcfce7' : '#fef3c7',
                                            color: donation.status === 'published' ? '#16a34a' : '#d97706'
                                        }}>
                                            {donation.status === 'published' ? 'Published' : 'Unpublished'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px', fontSize: '13px', color: '#6b7280' }}>
                                        {new Date(donation.createdAt).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                                            {/* Toggle Publish Button */}
                                            <button
                                                onClick={() => handleTogglePublish(donation.id)}
                                                style={{
                                                    padding: '6px 12px',
                                                    background: donation.status === 'published' ? '#fef3c7' : '#dcfce7',
                                                    color: donation.status === 'published' ? '#d97706' : '#16a34a',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    fontSize: '12px',
                                                    fontWeight: '600',
                                                    cursor: 'pointer'
                                                }}
                                                title={donation.status === 'published' ? 'Unpublish' : 'Publish'}
                                            >
                                                {donation.status === 'published' ? 'Unpublish' : 'Publish'}
                                            </button>

                                            {/* Edit Button */}
                                            <Link href={`/admin/donations/${donation.id}/edit`}>
                                                <button style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    background: '#dbeafe',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer'
                                                }}
                                                    title="Edit Donation">
                                                    <svg width="16" height="16" fill="#2563eb" viewBox="0 0 24 24">
                                                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                                                    </svg>
                                                </button>
                                            </Link>

                                            {/* Delete Button */}
                                            <button
                                                onClick={() => handleDeleteClick(donation)}
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
                                                title="Delete Donation"
                                            >
                                                <svg width="16" height="16" fill="#dc2626" viewBox="0 0 24 24">
                                                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {deleteModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '24px',
                        maxWidth: '400px',
                        width: '90%'
                    }}>
                        <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '700' }}>
                            Delete Donation
                        </h3>
                        <p style={{ color: '#6b7280', marginBottom: ' 24px' }}>
                            Are you sure you want to delete "{selectedDonation?.bookTitle}"? This action cannot be undone.
                        </p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => setDeleteModalOpen(false)}
                                style={{
                                    padding: '8px 16px',
                                    background: '#f3f4f6',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontWeight: '600'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                style={{
                                    padding: '8px 16px',
                                    background: '#dc2626',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontWeight: '600'
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
