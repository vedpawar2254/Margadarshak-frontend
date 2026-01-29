'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';

export default function AdminWellbeingPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState({ open: false, topic: null });
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        if (!authLoading && user) {
            fetchTopics();
        }
    }, [authLoading, user]);

    const fetchTopics = async () => {
        try {
            const response = await api.get('/wellbeing/admin');
            setTopics(response.data || []);
        } catch (err) {
            console.error('Failed to load topics:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteModal.topic) return;
        setDeleting(true);
        try {
            await api.delete(`/wellbeing/admin/${deleteModal.topic.id}`);
            setTopics(prev => prev.filter(t => t.id !== deleteModal.topic.id));
            setDeleteModal({ open: false, topic: null });
        } catch (err) {
            alert(err.message || 'Failed to delete topic');
        } finally {
            setDeleting(false);
        }
    };

    if (authLoading) {
        return <div style={{ padding: '60px', textAlign: 'center' }}>Loading...</div>;
    }

    return (
        <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
                        Wellness Topics
                    </h1>
                    <p style={{ color: '#6b7280', fontSize: '15px' }}>
                        Manage wellness dimensions content
                    </p>
                </div>
                <Link href="/admin/wellbeing/create" style={{
                    padding: '12px 24px',
                    background: '#3b82f6',
                    color: '#fff',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: '500',
                    display: 'inline-block'
                }}>
                    + Add Topic
                </Link>
            </div>

            {/* Topics List */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>Loading topics...</div>
            ) : topics.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280', background: '#f9fafb', borderRadius: '12px' }}>
                    No topics yet. Create your first wellness topic!
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {topics.map((topic) => (
                        <div key={topic.id} style={{
                            background: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '12px',
                            padding: '20px 24px'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0 }}>
                                            {topic.title}
                                        </h3>
                                        <span style={{
                                            padding: '4px 10px',
                                            borderRadius: '12px',
                                            fontSize: '12px',
                                            fontWeight: '600',
                                            background: topic.isActive ? '#dcfce7' : '#fee2e2',
                                            color: topic.isActive ? '#16a34a' : '#dc2626'
                                        }}>
                                            {topic.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    {topic.shortDescription && (
                                        <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 12px' }}>
                                            {topic.shortDescription}
                                        </p>
                                    )}
                                    <div style={{ fontSize: '13px', color: '#9ca3af' }}>
                                        {topic.subtopics?.length || 0} subtopics, Order: {topic.order}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <Link href={`/admin/wellbeing/${topic.id}/edit`} style={{
                                        padding: '8px 16px',
                                        background: '#dbeafe',
                                        color: '#1d4ed8',
                                        borderRadius: '6px',
                                        textDecoration: 'none',
                                        fontSize: '14px',
                                        fontWeight: '500'
                                    }}>
                                        Edit
                                    </Link>
                                    <button onClick={() => setDeleteModal({ open: true, topic })} style={{
                                        padding: '8px 16px',
                                        background: '#fee2e2',
                                        color: '#dc2626',
                                        border: 'none',
                                        borderRadius: '6px',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        cursor: 'pointer'
                                    }}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Delete Modal */}
            {deleteModal.open && (
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
                        background: 'white',
                        borderRadius: '16px',
                        padding: '32px',
                        maxWidth: '400px',
                        width: '90%'
                    }}>
                        <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>Delete Topic?</h3>
                        <p style={{ color: '#6b7280', marginBottom: '24px' }}>
                            Are you sure you want to delete "{deleteModal.topic?.title}"? This will also delete all subtopics and points.
                        </p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <button onClick={() => setDeleteModal({ open: false, topic: null })} style={{
                                padding: '10px 20px',
                                borderRadius: '8px',
                                border: '1px solid #e5e7eb',
                                background: 'white',
                                cursor: 'pointer'
                            }}>
                                Cancel
                            </button>
                            <button onClick={handleDelete} disabled={deleting} style={{
                                padding: '10px 20px',
                                borderRadius: '8px',
                                border: 'none',
                                background: '#dc2626',
                                color: 'white',
                                cursor: deleting ? 'not-allowed' : 'pointer',
                                opacity: deleting ? 0.7 : 1
                            }}>
                                {deleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
