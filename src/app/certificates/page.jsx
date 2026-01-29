'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';

export default function CertificatesPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (user) {
            fetchCertificates();
        }
    }, [user]);

    const fetchCertificates = async () => {
        try {
            setLoading(true);
            const response = await api.get('/courses/certificates');
            setCertificates(response.data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
    const getDownloadUrl = (certificateUrl) => {
        // Remove /api/v1 from base URL for static files
        const baseUrl = API_BASE_URL.replace('/api/v1', '');
        return `${baseUrl}${certificateUrl}`;
    };

    if (loading || authLoading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f3f4f6'
            }}>
                <div style={{
                    width: '48px',
                    height: '48px',
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
        <div style={{ background: '#f3f4f6', minHeight: '100vh' }}>
            {/* Header */}
            <div style={{
                background: 'linear-gradient(135deg, #0c5696 0%, #1e40af 100%)',
                padding: '40px 20px'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <h1 style={{
                        fontSize: '32px',
                        fontWeight: '700',
                        color: 'white',
                        marginBottom: '8px'
                    }}>
                        My Certificates
                    </h1>
                    <p style={{ color: '#bfdbfe' }}>
                        View and download your earned certificates
                    </p>
                </div>
            </div>

            {/* Content */}
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
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

                {certificates.length === 0 ? (
                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '60px 20px',
                        textAlign: 'center'
                    }}>
                        <p style={{ fontSize: '64px', marginBottom: '16px' }}>
                            <span role="img" aria-label="certificate">&#127942;</span>
                        </p>
                        <h2 style={{
                            fontSize: '24px',
                            fontWeight: '600',
                            color: '#1f2937',
                            marginBottom: '8px'
                        }}>
                            No Certificates Yet
                        </h2>
                        <p style={{ color: '#6b7280', marginBottom: '24px' }}>
                            Complete courses with a score of 75% or higher to earn certificates.
                        </p>
                        <Link
                            href="/courses"
                            style={{
                                display: 'inline-block',
                                background: '#3b82f6',
                                color: 'white',
                                padding: '12px 24px',
                                borderRadius: '8px',
                                textDecoration: 'none',
                                fontWeight: '600'
                            }}
                        >
                            Browse Courses
                        </Link>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                        gap: '24px'
                    }}>
                        {certificates.map((cert) => (
                            <div
                                key={cert.id}
                                style={{
                                    background: 'white',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                }}
                            >
                                {/* Certificate Preview Header */}
                                <div style={{
                                    background: 'linear-gradient(135deg, #0c5696 0%, #1e40af 100%)',
                                    padding: '24px',
                                    textAlign: 'center'
                                }}>
                                    <p style={{ fontSize: '48px', marginBottom: '8px' }}>
                                        <span role="img" aria-label="certificate">&#127942;</span>
                                    </p>
                                    <p style={{
                                        color: '#bfdbfe',
                                        fontSize: '12px',
                                        textTransform: 'uppercase',
                                        letterSpacing: '2px'
                                    }}>
                                        Certificate of Completion
                                    </p>
                                </div>

                                {/* Certificate Details */}
                                <div style={{ padding: '24px' }}>
                                    <h3 style={{
                                        fontSize: '18px',
                                        fontWeight: '600',
                                        color: '#1f2937',
                                        marginBottom: '8px'
                                    }}>
                                        {cert.course?.title}
                                    </h3>
                                    <p style={{
                                        color: '#6b7280',
                                        fontSize: '14px',
                                        marginBottom: '16px'
                                    }}>
                                        Instructor: {cert.course?.instructorName}
                                    </p>

                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        paddingTop: '16px',
                                        borderTop: '1px solid #e5e7eb'
                                    }}>
                                        <div>
                                            <p style={{
                                                fontSize: '12px',
                                                color: '#6b7280'
                                            }}>
                                                Issued on
                                            </p>
                                            <p style={{
                                                fontSize: '14px',
                                                fontWeight: '500',
                                                color: '#1f2937'
                                            }}>
                                                {new Date(cert.issuedAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>

                                        <a
                                            href={getDownloadUrl(cert.certificateUrl)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                background: '#3b82f6',
                                                color: 'white',
                                                padding: '10px 16px',
                                                borderRadius: '8px',
                                                textDecoration: 'none',
                                                fontWeight: '500',
                                                fontSize: '14px'
                                            }}
                                        >
                                            <span>&#x1F4E5;</span> Download
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
