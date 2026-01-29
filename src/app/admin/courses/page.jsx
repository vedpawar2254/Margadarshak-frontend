'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/services/api';

export default function AdminCoursesPage() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchCourses();
    }, [page, searchQuery]);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/courses?page=${page}&limit=10&search=${searchQuery}`);
            setCourses(response.data?.courses || []);
            setTotalPages(response.data?.totalPages || 1);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePublish = async (courseId) => {
        try {
            await api.patch(`/courses/${courseId}/publish`);
            fetchCourses();
        } catch (err) {
            alert('Error publishing course: ' + err.message);
        }
    };

    const handleUnpublish = async (courseId) => {
        try {
            await api.patch(`/courses/${courseId}/unpublish`);
            fetchCourses();
        } catch (err) {
            alert('Error unpublishing course: ' + err.message);
        }
    };

    const handleDelete = async (courseId) => {
        if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
            return;
        }
        try {
            await api.delete(`/courses/${courseId}`);
            fetchCourses();
        } catch (err) {
            alert('Error deleting course: ' + err.message);
        }
    };

    return (
        <div>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px'
            }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1f2937' }}>
                        Courses Management
                    </h1>
                    <p style={{ color: '#6b7280', marginTop: '4px' }}>
                        Create, edit, and manage all courses
                    </p>
                </div>
                <Link
                    href="/admin/courses/create"
                    style={{
                        background: '#3b82f6',
                        color: 'white',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    ➕ Create New Course
                </Link>
            </div>

            {/* Search Bar */}
            <div style={{
                background: 'white',
                padding: '16px',
                borderRadius: '12px',
                marginBottom: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
                <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '16px',
                        outline: 'none'
                    }}
                />
            </div>

            {/* Courses Table */}
            <div style={{
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                overflow: 'hidden'
            }}>
                {loading ? (
                    <div style={{ padding: '60px', textAlign: 'center' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            border: '4px solid #e5e7eb',
                            borderTop: '4px solid #3b82f6',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            margin: '0 auto'
                        }} />
                        <style jsx>{`
                            @keyframes spin {
                                0% { transform: rotate(0deg); }
                                100% { transform: rotate(360deg); }
                            }
                        `}</style>
                    </div>
                ) : error ? (
                    <div style={{ padding: '60px', textAlign: 'center', color: '#ef4444' }}>
                        Error: {error}
                    </div>
                ) : courses.length === 0 ? (
                    <div style={{ padding: '60px', textAlign: 'center' }}>
                        <p style={{ color: '#6b7280', fontSize: '18px' }}>No courses found</p>
                        <Link
                            href="/admin/courses/create"
                            style={{
                                display: 'inline-block',
                                marginTop: '16px',
                                color: '#3b82f6',
                                textDecoration: 'none',
                                fontWeight: '600'
                            }}
                        >
                            Create your first course →
                        </Link>
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#4b5563' }}>
                                    Course
                                </th>
                                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#4b5563' }}>
                                    Status
                                </th>
                                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#4b5563' }}>
                                    Modules
                                </th>
                                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#4b5563' }}>
                                    Enrollments
                                </th>
                                <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600', color: '#4b5563' }}>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map((course) => (
                                <tr key={course.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <img
                                                src={course.coverImage || '/placeholder-course.png'}
                                                alt={course.title}
                                                style={{
                                                    width: '60px',
                                                    height: '40px',
                                                    objectFit: 'cover',
                                                    borderRadius: '6px',
                                                    background: '#f3f4f6'
                                                }}
                                            />
                                            <div>
                                                <p style={{ fontWeight: '600', color: '#1f2937' }}>{course.title}</p>
                                                <p style={{ fontSize: '12px', color: '#6b7280' }}>
                                                    by {course.instructorName}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <span style={{
                                            padding: '4px 12px',
                                            borderRadius: '20px',
                                            fontSize: '12px',
                                            fontWeight: '600',
                                            background: course.status === 'PUBLISHED' ? '#d1fae5' : '#fef3c7',
                                            color: course.status === 'PUBLISHED' ? '#059669' : '#d97706'
                                        }}>
                                            {course.status || 'DRAFT'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px', color: '#4b5563' }}>
                                        {course.modules?.length || 0} modules
                                    </td>
                                    <td style={{ padding: '16px', color: '#4b5563' }}>
                                        {course._count?.enrollments || 0} students
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                            <Link
                                                href={`/admin/courses/${course.id}/edit`}
                                                style={{
                                                    padding: '6px 12px',
                                                    background: '#f3f4f6',
                                                    borderRadius: '6px',
                                                    color: '#4b5563',
                                                    textDecoration: 'none',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                ✏️ Edit
                                            </Link>
                                            {course.status === 'PUBLISHED' ? (
                                                <button
                                                    onClick={() => handleUnpublish(course.id)}
                                                    style={{
                                                        padding: '6px 12px',
                                                        background: '#fef3c7',
                                                        border: 'none',
                                                        borderRadius: '6px',
                                                        color: '#d97706',
                                                        cursor: 'pointer',
                                                        fontSize: '14px'
                                                    }}
                                                >
                                                    ⏸️ Unpublish
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handlePublish(course.id)}
                                                    style={{
                                                        padding: '6px 12px',
                                                        background: '#d1fae5',
                                                        border: 'none',
                                                        borderRadius: '6px',
                                                        color: '#059669',
                                                        cursor: 'pointer',
                                                        fontSize: '14px'
                                                    }}
                                                >
                                                    🚀 Publish
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(course.id)}
                                                style={{
                                                    padding: '6px 12px',
                                                    background: '#fee2e2',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    color: '#dc2626',
                                                    cursor: 'pointer',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                🗑️ Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div style={{
                        padding: '16px',
                        borderTop: '1px solid #e5e7eb',
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '8px'
                    }}>
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            style={{
                                padding: '8px 16px',
                                border: '1px solid #e5e7eb',
                                borderRadius: '6px',
                                background: 'white',
                                cursor: page === 1 ? 'not-allowed' : 'pointer',
                                opacity: page === 1 ? 0.5 : 1
                            }}
                        >
                            Previous
                        </button>
                        <span style={{ padding: '8px 16px', color: '#4b5563' }}>
                            Page {page} of {totalPages}
                        </span>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            style={{
                                padding: '8px 16px',
                                border: '1px solid #e5e7eb',
                                borderRadius: '6px',
                                background: 'white',
                                cursor: page === totalPages ? 'not-allowed' : 'pointer',
                                opacity: page === totalPages ? 0.5 : 1
                            }}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
