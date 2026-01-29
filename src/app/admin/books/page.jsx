'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';

export default function AdminBooksPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState({ open: false, book: null });
    const [deleting, setDeleting] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const fetchBooks = async () => {
        try {
            setLoading(true);
            const response = await api.get('/books/admin');
            setBooks(response.data || []);
        } catch (err) {
            console.error('Failed to load books:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading && user) {
            fetchBooks();
        }
    }, [authLoading, user]);

    const handleDelete = async () => {
        if (!deleteModal.book) return;
        setDeleting(true);
        try {
            await api.delete(`/books/admin/${deleteModal.book.id}`);
            setBooks(prev => prev.filter(b => b.id !== deleteModal.book.id));
            showToast('Book deleted successfully', 'success');
            setDeleteModal({ open: false, book: null });
        } catch (err) {
            showToast(err.message || 'Failed to delete book', 'error');
        } finally {
            setDeleting(false);
        }
    };

    const showToast = (message, type) => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    if (authLoading) {
        return <div style={{ padding: '60px', textAlign: 'center' }}>Loading...</div>;
    }

    return (
        <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1f2937', marginBottom: '8px' }}>
                        Recommended Books
                    </h1>
                    <p style={{ color: '#6b7280', fontSize: '15px' }}>
                        Manage curated book recommendations for students
                    </p>
                </div>
                <Link href="/admin/books/create" style={{
                    padding: '12px 24px',
                    background: '#3b82f6',
                    color: '#fff',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: '500'
                }}>
                    + Add Book
                </Link>
            </div>

            {/* Table */}
            <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1.5fr 1fr 1fr 100px',
                    padding: '16px 24px',
                    borderBottom: '1px solid #e5e7eb',
                    background: '#f9fafb'
                }}>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Book</span>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Category</span>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Rating</span>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Added</span>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', textAlign: 'center' }}>Actions</span>
                </div>

                {loading && <div style={{ padding: '60px', textAlign: 'center', color: '#6b7280' }}>Loading books...</div>}

                {!loading && books.length === 0 && (
                    <div style={{ padding: '60px', textAlign: 'center', color: '#6b7280' }}>No books found. Add your first recommendation!</div>
                )}

                {!loading && books.map((book) => (
                    <div key={book.id} style={{
                        display: 'grid',
                        gridTemplateColumns: '2fr 1.5fr 1fr 1fr 100px',
                        padding: '16px 24px',
                        borderBottom: '1px solid #f3f4f6',
                        alignItems: 'center'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {book.coverImage ? (
                                <img src={book.coverImage} alt={book.title} style={{ width: '50px', height: '70px', borderRadius: '4px', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ width: '50px', height: '70px', background: '#f3f4f6', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    📚
                                </div>
                            )}
                            <div>
                                <div style={{ fontWeight: '500', color: '#1f2937' }}>{book.title}</div>
                                <div style={{ fontSize: '13px', color: '#6b7280' }}>by {book.authorName}</div>
                            </div>
                        </div>
                        <div>
                            <span style={{ padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: '500', background: '#dbeafe', color: '#1d4ed8' }}>
                                {book.category}
                            </span>
                        </div>
                        <div style={{ color: '#374151' }}>
                            {book.rating ? `⭐ ${book.rating}` : '-'}
                        </div>
                        <div style={{ color: '#6b7280', fontSize: '14px' }}>
                            {formatDate(book.createdAt)}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                            <Link href={`/admin/books/${book.id}/edit`} style={{
                                width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: '#dbeafe', border: 'none', borderRadius: '6px', cursor: 'pointer'
                            }}>
                                ✏️
                            </Link>
                            <button onClick={() => setDeleteModal({ open: true, book })} style={{
                                width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: '#fee2e2', border: 'none', borderRadius: '6px', cursor: 'pointer'
                            }}>
                                🗑️
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Delete Modal */}
            {deleteModal.open && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', maxWidth: '400px', width: '90%', textAlign: 'center' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>Delete Book?</h3>
                        <p style={{ color: '#6b7280', marginBottom: '24px' }}>
                            Are you sure you want to delete "{deleteModal.book?.title}"?
                        </p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                            <button onClick={() => setDeleteModal({ open: false, book: null })} style={{
                                padding: '12px 24px', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer'
                            }}>Cancel</button>
                            <button onClick={handleDelete} disabled={deleting} style={{
                                padding: '12px 24px', borderRadius: '8px', border: 'none', background: '#dc2626', color: '#fff', cursor: 'pointer'
                            }}>{deleting ? 'Deleting...' : 'Delete'}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast */}
            {toast.show && (
                <div style={{
                    position: 'fixed', bottom: '24px', right: '24px', padding: '16px 24px', borderRadius: '8px',
                    background: toast.type === 'success' ? '#dcfce7' : '#fee2e2',
                    color: toast.type === 'success' ? '#16a34a' : '#dc2626',
                    fontWeight: '500', zIndex: 1001
                }}>{toast.message}</div>
            )}
        </div>
    );
}
