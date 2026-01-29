'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import DOMPurify from 'dompurify';
import { api } from '@/services/api';

// Secure HTML sanitization for blog content
const sanitizeBlogContent = (html) => {
    if (!html) return '';
    return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: ['p', 'br', 'b', 'strong', 'i', 'em', 'u', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre', 'code', 'a', 'span', 'div', 'img'],
        ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'style', 'src', 'alt'],
        FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input'],
        FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover']
    });
};

export default function BlogDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [blog, setBlog] = useState(null);
    const [relatedBlogs, setRelatedBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/blogs/${params.id}`);

                if (response.success) {
                    setBlog(response.data);
                    setRelatedBlogs(response.data.relatedBlogs || []);
                } else {
                    setError('Blog not found');
                }
            } catch (err) {
                console.error('Error fetching blog:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchBlog();
        }
    }, [params.id]);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getCategoryColor = (index) => {
        const colors = [
            { bg: '#dbeafe', text: '#1d4ed8' },
            { bg: '#fce7f3', text: '#be185d' },
            { bg: '#d1fae5', text: '#047857' }
        ];
        return colors[index % colors.length];
    };

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#ffffff'
            }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    border: '3px solid #e5e7eb',
                    borderTop: '3px solid #3b82f6',
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

    if (error || !blog) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#ffffff',
                padding: '20px'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', marginBottom: '8px' }}>
                        Blog Not Found
                    </h1>
                    <Link href="/blogs" style={{ color: '#3b82f6', textDecoration: 'none' }}>
                        ← Back to Blogs
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#ffffff', display: 'flex' }}>
            {/* Left Branding Sidebar */}
            <div style={{
                width: '120px',
                flexShrink: 0,
                borderRight: '1px solid #f3f4f6',
                display: 'none',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '40px 0',
                position: 'sticky',
                top: 0,
                height: '100vh',
                background: 'white',
                '@media (min-width: 1024px)': {
                    display: 'flex'
                }
            }}>
                {/* Vertical Text */}
                <h1 style={{
                    writingMode: 'vertical-rl',
                    textOrientation: 'mixed',
                    transform: 'rotate(180deg)',
                    color: '#93c5fd', // Light blue brand color
                    fontSize: '48px',
                    fontWeight: '800',
                    letterSpacing: '4px',
                    whiteSpace: 'nowrap',
                    margin: 'auto 0',
                    userSelect: 'none'
                }}>
                    Margdarshak
                </h1>

                {/* Logo at bottom */}
                <div style={{ marginTop: 'auto', paddingBottom: '20px' }}>
                    <img src="/Mbluelogo.png" alt="Logo" style={{ width: '50px', height: 'auto', opacity: 0.8 }} />
                </div>
            </div>

            {/* Stylized visible sidebar for responsive check (applies inline style logic for standard browsers) */}
            <style jsx>{`
                @media (max-width: 1024px) {
                    .sidebar-brand { display: none !important; }
                }
                @media (min-width: 1024px) {
                    .sidebar-brand { display: flex !important; }
                }
            `}</style>

            <div className="sidebar-brand" style={{
                width: '100px',
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '40px 0',
                position: 'sticky',
                top: 0,
                height: '100vh',
                borderRight: '1px solid #f3f4f6',
                background: 'white'
            }}>
                <Link href="/blogs" style={{ textDecoration: 'none' }}>
                    <div style={{
                        writingMode: 'vertical-rl',
                        textOrientation: 'mixed',
                        transform: 'rotate(180deg)',
                        color: '#93c5fd', // Lighter blue to match reference image 1
                        fontSize: '42px',
                        fontWeight: '800',
                        letterSpacing: '2px',
                        cursor: 'pointer',
                        margin: 'auto 0'
                    }}>
                        Margdarshak
                    </div>
                </Link>
                <div style={{ marginTop: 'auto' }}>
                    <img src="/Mbluelogo.png" alt="Logo" style={{ width: '60px', height: 'auto' }} />
                </div>
            </div>

            {/* Main Content Area */}
            <div style={{ flex: 1, position: 'relative' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 24px 100px' }}>

                    {/* Back Link */}
                    <Link
                        href="/blogs"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            color: '#9ca3af',
                            textDecoration: 'none',
                            fontSize: '14px',
                            marginBottom: '40px',
                            fontWeight: '500'
                        }}
                    >
                        ← Back to all blogs
                    </Link>

                    {/* Title */}
                    <h1 style={{
                        fontSize: '42px',
                        fontWeight: '800',
                        color: '#111827',
                        lineHeight: '1.2',
                        marginBottom: '24px',
                        letterSpacing: '-0.5px'
                    }}>
                        {blog.title}
                    </h1>

                    {/* Author Meta */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '40px'
                    }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: '#4f46e5', // Indigo avatar bg
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '600',
                            fontSize: '18px'
                        }}>
                            {blog.author ? blog.author.charAt(0).toUpperCase() : 'M'}
                        </div>
                        <div>
                            <div style={{ fontWeight: '600', color: '#1f2937', fontSize: '15px' }}>
                                {blog.author || 'Margdarshak Team'}
                            </div>
                            <div style={{ color: '#6b7280', fontSize: '13px' }}>
                                {formatDate(blog.publishedAt || blog.createdAt)}
                                {blog.readingTime && ` · ${blog.readingTime} min read`}
                            </div>
                        </div>
                    </div>

                    {/* Cover Image */}
                    {blog.coverImage && (
                        <div style={{
                            marginBottom: '48px',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                        }}>
                            <img
                                src={blog.coverImage}
                                alt={blog.title}
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    display: 'block'
                                }}
                            />
                        </div>
                    )}

                    {/* Content */}
                    <div className="blog-content">
                        {blog.shortDescription && (
                            <p style={{
                                fontSize: '20px',
                                color: '#374151',
                                lineHeight: '1.7',
                                marginBottom: '32px',
                                fontFamily: 'Georgia, serif'
                            }}>
                                {blog.shortDescription}
                            </p>
                        )}
                        <div
                            style={{
                                fontSize: '18px',
                                lineHeight: '1.8',
                                color: '#374151',
                                fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
                            }}
                            dangerouslySetInnerHTML={{
                                __html: sanitizeBlogContent(blog.content)
                                    .replace(/\n/g, '<br/>')
                                    .replace(/<h2>/g, '<h2 style="font-size: 24px; font-weight: 700; color: #111827; margin-top: 48px; margin-bottom: 24px;">')
                                    .replace(/<h3>/g, '<h3 style="font-size: 20px; font-weight: 600; color: #1f2937; margin-top: 32px; margin-bottom: 16px;">')
                                    .replace(/<ul>/g, '<ul style="padding-left: 24px; margin-bottom: 24px;">')
                                    .replace(/<li>/g, '<li style="margin-bottom: 8px;">')
                            }}
                        />
                    </div>
                </div>

                {/* Related Articles Footer */}
                {relatedBlogs.length > 0 && (
                    <div style={{
                        background: '#f9fafb',
                        padding: '80px 0',
                        borderTop: '1px solid #f3f4f6'
                    }}>
                        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>
                            <h2 style={{
                                fontSize: '24px',
                                fontWeight: '700',
                                color: '#111827',
                                marginBottom: '32px'
                            }}>
                                Related Articles
                            </h2>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                                gap: '32px'
                            }}>
                                {relatedBlogs.map((related, index) => (
                                    <Link
                                        key={related.id}
                                        href={`/blogs/${related.slug || related.id}`}
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <article style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                                            <div style={{
                                                height: '180px',
                                                background: related.coverImage
                                                    ? `url(${related.coverImage}) center/cover`
                                                    : 'linear-gradient(135deg, #e0e7ff 0%, #db2777 100%)'
                                            }} />
                                            <div style={{ padding: '20px' }}>
                                                <span style={{
                                                    fontSize: '12px',
                                                    fontWeight: '600',
                                                    color: getCategoryColor(index).text,
                                                    background: getCategoryColor(index).bg,
                                                    padding: '2px 8px',
                                                    borderRadius: '4px',
                                                    display: 'inline-block',
                                                    marginBottom: '12px'
                                                }}>
                                                    Insights
                                                </span>
                                                <h3 style={{
                                                    fontSize: '16px',
                                                    fontWeight: '700',
                                                    color: '#1f2937',
                                                    marginBottom: '8px',
                                                    lineHeight: '1.4'
                                                }}>
                                                    {related.title}
                                                </h3>
                                            </div>
                                        </article>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
