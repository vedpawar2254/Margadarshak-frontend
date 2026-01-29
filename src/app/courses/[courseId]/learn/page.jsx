'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import DOMPurify from 'dompurify';

import { api } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import VideoPlayerSecure from '@/components/common/VideoPlayerSecure';
import PDFSecureViewer from '@/components/common/PDFSecureViewer';

// Secure HTML sanitization using DOMPurify
// Allows safe formatting tags while removing all potentially dangerous content
const sanitizeAndFormatText = (text) => {
    if (!text) return '';

    // If it's plain text with newlines, convert to HTML paragraphs
    if (!text.includes('<')) {
        return text
            .split('\n\n')
            .map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`)
            .join('');
    }

    // Use DOMPurify for proper XSS protection
    // Only allow safe formatting tags
    const clean = DOMPurify.sanitize(text, {
        ALLOWED_TAGS: ['p', 'br', 'b', 'strong', 'i', 'em', 'u', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre', 'code', 'a', 'span', 'div'],
        ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'style'],
        FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input'],
        FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover']
    });

    return clean;
};

export default function CourseLearnPage() {
    const params = useParams();
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeModuleIndex, setActiveModuleIndex] = useState(0);
    const [activeTab, setActiveTab] = useState('lesson');
    const [moduleProgress, setModuleProgress] = useState({});
    const [moduleQuizzes, setModuleQuizzes] = useState({}); // Track which modules have quizzes
    const [checkingQuiz, setCheckingQuiz] = useState(false);
    const [certificateEligibility, setCertificateEligibility] = useState(null);
    const [certificate, setCertificate] = useState(null);
    const [generatingCertificate, setGeneratingCertificate] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (params.courseId && user) {
            fetchCourseProgress();
        }
    }, [params.courseId, user]);

    const fetchCourseProgress = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/courses/${params.courseId}/my-progress`);
            setCourse(response.data?.course);

            // Build progress map
            const progressMap = {};
            response.data?.course?.modules?.forEach(m => {
                if (m.progress) {
                    progressMap[m.id] = m.progress;
                }
            });
            setModuleProgress(progressMap);

            // Check certificate eligibility and existing certificate
            checkCertificateStatus();
        } catch (err) {
            // Fallback to regular course fetch
            try {
                const courseResp = await api.get(`/courses/${params.courseId}`);
                setCourse(courseResp.data);
            } catch (e) {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const checkCertificateStatus = async () => {
        try {
            // Check if certificate already exists
            const certResponse = await api.get(`/courses/courses/${params.courseId}/certificates`);
            setCertificate(certResponse.data);
        } catch (err) {
            // No certificate yet, check eligibility
            try {
                const eligibilityResponse = await api.get(`/courses/courses/${params.courseId}/certificate-eligibility`);
                setCertificateEligibility(eligibilityResponse.data);
            } catch (e) {
                // Not eligible yet
                setCertificateEligibility({ isEligible: false });
            }
        }
    };

    const handleGenerateCertificate = async () => {
        try {
            setGeneratingCertificate(true);
            const response = await api.post(`/courses/courses/${params.courseId}/certificates`);
            setCertificate(response.data);
            setCertificateEligibility(null);
        } catch (err) {
            alert('Error generating certificate: ' + err.message);
        } finally {
            setGeneratingCertificate(false);
        }
    };

    const handleVideoWatched = async (moduleId) => {
        try {
            await api.patch(`/courses/modules/${moduleId}/progress`, {
                isVideoWatched: true
            });
            setModuleProgress(prev => ({
                ...prev,
                [moduleId]: { ...prev[moduleId], isVideoWatched: true }
            }));
        } catch (err) {
            console.error('Error updating progress:', err);
        }
    };

    // Check if a module has a quiz
    const checkModuleQuiz = async (moduleId, force = false) => {
        // Skip if we already checked this module and not forcing retry
        if (!force && moduleQuizzes[moduleId] !== undefined && moduleQuizzes[moduleId] !== 'error') return;

        try {
            setCheckingQuiz(true);

            const response = await api.get(`/courses/quizzes?moduleId=${moduleId}`);


            // Handle different API response structures
            // Some APIs return array directly, others wrap in data object
            let quizzes = [];
            if (Array.isArray(response)) {
                quizzes = response;
            } else if (Array.isArray(response.data)) {
                quizzes = response.data;
            } else if (response.data && Array.isArray(response.data.data)) {
                // Handle nested data property if API wraps it
                quizzes = response.data.data;
            }


            setModuleQuizzes(prev => ({
                ...prev,
                [moduleId]: quizzes.length > 0 ? quizzes[0] : null
            }));
        } catch (err) {
            console.error('Error checking quiz:', err);
            // Mark as error so we can retry
            setModuleQuizzes(prev => ({ ...prev, [moduleId]: 'error' }));
        } finally {
            setCheckingQuiz(false);
        }
    };

    // Check quiz when active module changes
    useEffect(() => {
        const currentModule = course?.modules?.[activeModuleIndex];
        if (currentModule?.id && !loading) {
            checkModuleQuiz(currentModule.id);
        }
    }, [activeModuleIndex, course?.modules, loading]);

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

    if (!course) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f3f4f6'
            }}>
                <p style={{ color: '#ef4444' }}>Course not found</p>
                <Link href="/courses" style={{ color: '#3b82f6', marginTop: '16px' }}>
                    Back to Courses
                </Link>
            </div>
        );
    }

    const activeModule = course.modules?.[activeModuleIndex];
    const completedModules = Object.values(moduleProgress).filter(p => p.isQuizCompleted).length;
    const totalModules = course.modules?.length || 0;
    const progressPercent = totalModules > 0 ? (completedModules / totalModules) * 100 : 0;

    // Extract video embed URL
    const getVideoEmbedUrl = (url) => {
        if (!url) return null;
        // YouTube
        const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
        if (youtubeMatch) {
            return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
        }
        // Vimeo
        const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
        if (vimeoMatch) {
            return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
        }
        // Direct video URL (fallback)
        return url;
    };

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

    const renderModuleContent = () => {
        if (!activeModule) return null;

        // 1. DOCUMENT CONTENT
        // All documents are now converted to PDF on the backend
        if (activeModule.contentType === 'DOCUMENT') {
            let docUrl = activeModule.documentUrl;

            // Handle local files - ensure URL is correct for proxy
            // The backend now converts all Office docs to PDF, so we expect .pdf extension
            const isLocalFile = activeModule.documentSource === 'LOCAL' ||
                (!activeModule.documentSource && docUrl && docUrl.includes('/uploads/'));

            if (!docUrl) return (
                <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                    No document attached.
                </div>
            );

            // Check for Google Drive URLs - render via iframe (PDF.js can't load due to CORS)
            const isGoogleDriveUrl = docUrl.includes('drive.google.com');
            if (isGoogleDriveUrl) {
                // Convert to preview URL format
                const previewUrl = docUrl.includes('/preview')
                    ? docUrl
                    : docUrl.replace('/view', '/preview');
                return (
                    <div style={{ position: 'relative', width: '100%', height: '80vh', overflow: 'hidden', borderRadius: '8px' }}>
                        <iframe
                            src={previewUrl}
                            style={{
                                width: '100%',
                                height: '100%',
                                border: 'none'
                            }}
                            allow="autoplay"
                            allowFullScreen
                        />
                        {/* Overlay to block the popup icon in top-right corner */}
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            width: '60px',
                            height: '60px',
                            background: 'transparent',
                            zIndex: 10,
                            cursor: 'default'
                        }} />
                    </div>
                );
            }

            // Check for Google Docs URLs - render via iframe
            const isGoogleDocsUrl = docUrl.includes('docs.google.com');
            if (isGoogleDocsUrl) {
                const embedUrl = docUrl.includes('/embed') || docUrl.includes('/preview')
                    ? docUrl
                    : docUrl.replace('/edit', '/preview').replace('/view', '/embed');
                return (
                    <div style={{ position: 'relative', width: '100%', height: '80vh', overflow: 'hidden', borderRadius: '8px' }}>
                        <iframe
                            src={embedUrl}
                            style={{
                                width: '100%',
                                height: '100%',
                                border: 'none'
                            }}
                            allowFullScreen
                        />
                        {/* Overlay to block the popup icon in top-right corner */}
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            width: '60px',
                            height: '60px',
                            background: 'transparent',
                            zIndex: 10,
                            cursor: 'default'
                        }} />
                    </div>
                );
            }

            // Local files - use the secure PDF.js viewer
            return <PDFSecureViewer url={docUrl} watermarkText="Margdarshak - Protected Content" />;
        }

        // 2. VIDEO CONTENT (Default)
        // Handle Local Video (either explicitly marked or detected from URL)
        const isLocalVideo = activeModule.videoSource === 'LOCAL' ||
            (!activeModule.videoSource && activeModule.videoUrl && activeModule.videoUrl.includes('/uploads/'));

        if (isLocalVideo && activeModule.videoUrl) {
            // For local videos, use the direct URL (proxy handles it)
            return (
                <video
                    src={activeModule.videoUrl}
                    controls
                    controlsList="nodownload"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%'
                    }}
                    onEnded={() => handleVideoWatched(activeModule.id)}
                />
            );
        }

        // Handle External Video (YouTube, Vimeo, Drive)
        if (activeModule.videoUrl) {
            // Google Drive
            if (getVideoEmbedUrl(activeModule.videoUrl)?.includes('drive.google.com')) {
                return (
                    <>
                        <iframe
                            src={activeModule.videoUrl.includes('/preview')
                                ? activeModule.videoUrl
                                : activeModule.videoUrl.replace('/view', '/preview')}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                border: 'none'
                            }}
                            allow="autoplay"
                            allowFullScreen
                            onLoad={() => handleVideoWatched(activeModule.id)}
                        />
                        {/* Overlay to block the popup icon in top-right corner */}
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            width: '80px',
                            height: '80px',
                            background: 'transparent',
                            zIndex: 10,
                            cursor: 'default'
                        }} />
                    </>
                );
            }
            // Google Slides/Docs
            if (getVideoEmbedUrl(activeModule.videoUrl)?.includes('docs.google.com')) {
                return (
                    <iframe
                        src={activeModule.videoUrl.includes('/embed') || activeModule.videoUrl.includes('/preview')
                            ? activeModule.videoUrl
                            : activeModule.videoUrl.replace('/edit', '/preview').replace('/view', '/embed')}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            border: 'none'
                        }}
                        allowFullScreen
                    />
                );
            }

            // Standard Embeds (YouTube/Vimeo) or Direct URL fallback
            const embedUrl = getVideoEmbedUrl(activeModule.videoUrl);
            const isEmbeddable = embedUrl.includes('youtube') || embedUrl.includes('vimeo');

            if (isEmbeddable) {
                return (
                    <iframe
                        src={embedUrl}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            border: 'none'
                        }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        onLoad={() => handleVideoWatched(activeModule.id)}
                    />
                );
            }

            // Fallback for direct URLs that aren't local (e.g., S3 direct link)
            return (
                <video
                    src={activeModule.videoUrl}
                    controls
                    controlsList="nodownload"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%'
                    }}
                    onEnded={() => handleVideoWatched(activeModule.id)}
                />
            );
        }

        // No Content Fallback
        return (
            <div style={{
                padding: '60px 20px',
                textAlign: 'center',
                color: '#9ca3af',
                background: '#f3f4f6'
            }}>
                <span style={{ fontSize: '48px' }}>📖</span>
                <p style={{ marginTop: '8px' }}>This module is text-based. See the content below.</p>
            </div>
        );
    };

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
            {/* Left Sidebar */}
            <aside className="w-full lg:w-[280px] bg-white border-r border-gray-200 p-6 flex-shrink-0 order-2 lg:order-1 overflow-y-auto h-auto lg:h-screen lg:sticky lg:top-0">
                {/* Course Title */}
                <div style={{
                    background: '#0c5696',
                    color: 'white',
                    padding: '20px',
                    borderRadius: '12px',
                    marginBottom: '20px'
                }}>
                    <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
                        {course.title}
                    </h2>

                    {/* Progress Bar */}
                    <p style={{ fontSize: '12px', color: '#bfdbfe', marginBottom: '8px' }}>
                        Course Progress
                    </p>
                    <div style={{
                        background: 'rgba(255,255,255,0.2)',
                        borderRadius: '4px',
                        height: '6px',
                        marginBottom: '8px'
                    }}>
                        <div style={{
                            background: '#10b981',
                            height: '100%',
                            borderRadius: '4px',
                            width: `${progressPercent}%`,
                            transition: 'width 0.3s ease'
                        }} />
                    </div>
                    <p style={{ fontSize: '12px', color: '#bfdbfe' }}>
                        {completedModules} of {totalModules} modules completed
                    </p>
                </div>

                {/* Instructor */}
                <div style={{ marginBottom: '24px' }}>
                    <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Instructor:</p>
                    <p style={{ fontWeight: '500', color: '#1f2937' }}>{course.instructorName}</p>
                </div>

                {/* Modules List */}
                <div>
                    <h3 style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#1f2937',
                        marginBottom: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        Modules <span style={{ transform: 'rotate(180deg)', display: 'inline-block' }}>▲</span>
                    </h3>

                    {course.modules?.map((module, index) => {
                        const progress = moduleProgress[module.id] || {};
                        const isCompleted = progress.isQuizCompleted;
                        const isActive = index === activeModuleIndex;

                        return (
                            <div
                                key={module.id}
                                onClick={() => setActiveModuleIndex(index)}
                                style={{
                                    padding: '12px',
                                    marginBottom: '8px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    background: isActive ? '#3b82f6' : 'transparent',
                                    color: isActive ? 'white' : '#1f2937',
                                    border: isActive ? 'none' : '1px solid #e5e7eb',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'start',
                                    marginBottom: '4px'
                                }}>
                                    <span style={{ fontSize: '13px', fontWeight: '600' }}>
                                        Module {index + 1}
                                    </span>
                                    {isCompleted && (
                                        <span style={{
                                            background: '#10b981',
                                            color: 'white',
                                            padding: '2px 8px',
                                            borderRadius: '10px',
                                            fontSize: '10px',
                                            fontWeight: '600'
                                        }}>
                                            Done
                                        </span>
                                    )}
                                </div>
                                <p style={{
                                    fontSize: '12px',
                                    color: isActive ? 'rgba(255,255,255,0.8)' : '#6b7280'
                                }}>
                                    {module.title}
                                </p>
                                {progress.quizScore !== null && progress.quizScore !== undefined && (
                                    <p style={{
                                        fontSize: '11px',
                                        color: isActive ? 'rgba(255,255,255,0.7)' : '#10b981',
                                        marginTop: '4px'
                                    }}>
                                        Quiz: {progress.quizScore}%
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Certificate Section */}
                {(certificate || certificateEligibility?.isEligible) && (
                    <div style={{
                        marginTop: '24px',
                        paddingTop: '24px',
                        borderTop: '1px solid #e5e7eb'
                    }}>
                        {certificate ? (
                            <div style={{
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                borderRadius: '12px',
                                padding: '16px',
                                textAlign: 'center'
                            }}>
                                <p style={{ fontSize: '32px', marginBottom: '8px' }}>&#127942;</p>
                                <p style={{
                                    color: 'white',
                                    fontWeight: '600',
                                    marginBottom: '12px'
                                }}>
                                    Certificate Earned!
                                </p>
                                <a
                                    href={`${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1').replace('/api/v1', '')}${certificate.certificateUrl}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'inline-block',
                                        background: 'white',
                                        color: '#059669',
                                        padding: '8px 16px',
                                        borderRadius: '6px',
                                        textDecoration: 'none',
                                        fontWeight: '600',
                                        fontSize: '14px'
                                    }}
                                >
                                    Download
                                </a>
                            </div>
                        ) : certificateEligibility?.isEligible ? (
                            <div style={{
                                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                                borderRadius: '12px',
                                padding: '16px',
                                textAlign: 'center'
                            }}>
                                <p style={{ fontSize: '32px', marginBottom: '8px' }}>&#127881;</p>
                                <p style={{
                                    color: 'white',
                                    fontWeight: '600',
                                    marginBottom: '4px'
                                }}>
                                    Congratulations!
                                </p>
                                <p style={{
                                    color: '#bfdbfe',
                                    fontSize: '12px',
                                    marginBottom: '12px'
                                }}>
                                    Score: {Math.round(certificateEligibility.percentage)}%
                                </p>
                                <button
                                    onClick={handleGenerateCertificate}
                                    disabled={generatingCertificate}
                                    style={{
                                        background: 'white',
                                        color: '#1d4ed8',
                                        padding: '8px 16px',
                                        borderRadius: '6px',
                                        border: 'none',
                                        fontWeight: '600',
                                        fontSize: '14px',
                                        cursor: generatingCertificate ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    {generatingCertificate ? 'Generating...' : 'Get Certificate'}
                                </button>
                            </div>
                        ) : null}
                    </div>
                )}

                {/* User Info */}
                <div style={{
                    marginTop: '24px',
                    paddingTop: '24px',
                    borderTop: '1px solid #e5e7eb'
                }}>
                    <p style={{ fontSize: '12px', color: '#6b7280' }}>Logged in as:</p>
                    <p style={{ fontWeight: '500', color: '#1f2937' }}>{user?.name}</p>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 lg:p-6 overflow-y-auto order-1 lg:order-2">
                {activeModule ? (
                    <>
                        {/* Module Header */}
                        <div style={{ marginBottom: '24px' }}>
                            <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
                                {activeModule.title}
                            </h1>
                            <p style={{ color: '#6b7280', marginTop: '4px' }}>
                                Module {activeModuleIndex + 1} of {totalModules}
                            </p>
                            {moduleProgress[activeModule.id]?.isQuizCompleted && (
                                <span style={{
                                    display: 'inline-block',
                                    marginTop: '8px',
                                    background: '#10b981',
                                    color: 'white',
                                    padding: '4px 12px',
                                    borderRadius: '20px',
                                    fontSize: '12px',
                                    fontWeight: '600'
                                }}>
                                    Completed
                                </span>
                            )}
                        </div>

                        {/* Tabs */}
                        <div style={{
                            display: 'flex',
                            gap: '4px',
                            marginBottom: '24px',
                            background: '#f3f4f6',
                            padding: '4px',
                            borderRadius: '8px',
                            width: 'fit-content'
                        }}>
                            {['lesson', 'quiz'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    style={{
                                        padding: '10px 24px',
                                        border: 'none',
                                        borderRadius: '6px',
                                        background: activeTab === tab ? 'white' : 'transparent',
                                        color: activeTab === tab ? '#1f2937' : '#6b7280',
                                        fontWeight: '500',
                                        cursor: 'pointer',
                                        textTransform: 'capitalize',
                                        boxShadow: activeTab === tab ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                                    }}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        {activeTab === 'lesson' && (
                            <div>
                                {/* Content Section - supports multiple types */}
                                <div style={{
                                    background: 'white',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    marginBottom: '24px'
                                }}>
                                    <h3 style={{
                                        fontSize: '18px',
                                        fontWeight: '600',
                                        padding: '20px 20px 0',
                                        color: '#1f2937'
                                    }}>
                                        {activeModule.title}
                                    </h3>

                                    {/* Multi-type Content Renderer */}
                                    <div style={{
                                        position: 'relative',
                                        background: '#1f2937',
                                        margin: '20px'
                                    }}>
                                        {/* Content Render */}
                                        {activeModule.contentType === 'VIDEO' || activeModule.videoUrl ? (
                                            <div style={{ paddingTop: '56.25%', position: 'relative' }}>
                                                {renderModuleContent()}
                                            </div>
                                        ) : (
                                            <div style={{ height: '80vh' }}>
                                                {renderModuleContent()}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Theory / Rich Text Content */}
                                <div style={{
                                    background: 'white',
                                    borderRadius: '12px',
                                    padding: '24px',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                    marginBottom: '24px'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e5e7eb', paddingBottom: '12px' }}>
                                        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
                                            Theory / Learning Content
                                        </h3>

                                        {/* Download Option & Admin Badge */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <span style={{ fontSize: '12px', color: '#6b7280', background: '#f3f4f6', padding: '4px 8px', borderRadius: '4px' }}>
                                                Created by Admin
                                            </span>

                                            {activeModule.documentUrl && (
                                                <a
                                                    href={activeModule.documentUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{
                                                        fontSize: '13px',
                                                        fontWeight: '600',
                                                        color: 'white',
                                                        background: '#3b82f6',
                                                        padding: '6px 14px',
                                                        borderRadius: '6px',
                                                        textDecoration: 'none',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '6px',
                                                        boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                                                    }}
                                                >
                                                    <span>📄</span> Download the doc
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    <div
                                        className="prose max-w-none"
                                        style={{
                                            lineHeight: '1.7',
                                            color: '#374151',
                                            fontSize: '16px',
                                            fontWeight: '400'
                                        }}
                                        dangerouslySetInnerHTML={{
                                            __html: sanitizeAndFormatText(activeModule.theoryContent || '')
                                        }}
                                    />

                                    {/* Force List Styles for Rendered Content */}
                                    <style jsx global>{`
                                        .prose ul {
                                            list-style-type: disc !important;
                                            padding-left: 1.5em !important;
                                            margin-top: 1em;
                                            margin-bottom: 1em;
                                        }
                                        .prose ol {
                                            list-style-type: decimal !important;
                                            padding-left: 1.5em !important;
                                            margin-top: 1em;
                                            margin-bottom: 1em;
                                        }
                                        .prose li {
                                            margin-bottom: 0.5em;
                                        }
                                        .prose p {
                                            margin-bottom: 1em;
                                        }
                                        .prose strong, .prose b {
                                            font-weight: 700;
                                            color: #111827;
                                        }
                                        .prose a {
                                            color: #2563eb;
                                            text-decoration: underline;
                                        }
                                    `}</style>

                                    {!activeModule.theoryContent && !activeModule.documentUrl && (
                                        <p style={{ color: '#9ca3af', fontStyle: 'italic' }}>
                                            No additional theory content provided for this module.
                                        </p>
                                    )}
                                </div>

                                {/* Go to Quiz Button */}
                                <button
                                    onClick={() => setActiveTab('quiz')}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        width: '100%',
                                        maxWidth: '400px',
                                        margin: '0 auto',
                                        padding: '16px 32px',
                                        background: '#3b82f6',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontSize: '18px',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Go To Assignment →
                                </button>
                            </div>
                        )}

                        {activeTab === 'quiz' && (
                            <div style={{
                                background: 'white',
                                borderRadius: '12px',
                                padding: '24px'
                            }}>
                                {checkingQuiz ? (
                                    <p style={{ color: '#6b7280' }}>Checking for quiz...</p>
                                ) : moduleQuizzes[activeModule?.id] === null ? (
                                    <div style={{ textAlign: 'center' }}>
                                        <p style={{ fontSize: '48px', marginBottom: '16px' }}>📝</p>
                                        <p style={{ color: '#6b7280', marginBottom: '8px' }}>
                                            No quiz has been created for this module yet.
                                        </p>
                                        <p style={{ color: '#9ca3af', fontSize: '14px' }}>
                                            Continue with the next module or check back later.
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        {moduleQuizzes[activeModule?.id] === 'error' ? (
                                            <div style={{ textAlign: 'center' }}>
                                                <p style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</p>
                                                <p style={{ color: '#ef4444', marginBottom: '16px' }}>
                                                    Failed to load quiz status.
                                                </p>
                                                <button
                                                    onClick={() => checkModuleQuiz(activeModule.id, true)}
                                                    style={{
                                                        padding: '10px 20px',
                                                        background: '#3b82f6',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '6px',
                                                        cursor: 'pointer',
                                                        fontWeight: '500'
                                                    }}
                                                >
                                                    Retry
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <p style={{ color: '#6b7280', marginBottom: '16px' }}>
                                                    Complete the quiz to mark this module as done.
                                                </p>
                                                <Link
                                                    href={`/courses/${params.courseId}/modules/${activeModule.id}/quiz`}
                                                    style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '8px',
                                                        padding: '14px 28px',
                                                        background: '#3b82f6',
                                                        color: 'white',
                                                        borderRadius: '8px',
                                                        textDecoration: 'none',
                                                        fontWeight: '600'
                                                    }}
                                                >
                                                    📝 Start Quiz
                                                </Link>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        )
                        }

                        {
                            activeTab === 'assignment' && (
                                <div style={{
                                    background: 'white',
                                    borderRadius: '12px',
                                    padding: '24px',
                                    textAlign: 'center'
                                }}>
                                    <p style={{ color: '#6b7280' }}>
                                        No assignments for this module yet.
                                    </p>
                                </div>
                            )
                        }
                    </>
                ) : (
                    <div style={{ textAlign: 'center', padding: '60px' }}>
                        <p style={{ color: '#6b7280' }}>No modules available</p>
                    </div>
                )}
            </main >
        </div >
    );
}
