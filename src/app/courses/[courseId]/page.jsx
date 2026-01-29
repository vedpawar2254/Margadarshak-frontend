'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';

export default function CourseDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [enrollment, setEnrollment] = useState(null);
    const [enrolling, setEnrolling] = useState(false);
    const [expandedModules, setExpandedModules] = useState({});

    useEffect(() => {
        if (params.courseId) {
            fetchCourse();
        }
    }, [params.courseId]);

    useEffect(() => {
        if (user && params.courseId) {
            checkEnrollment();
        }
    }, [user, params.courseId]);

    const fetchCourse = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/courses/${params.courseId}`);
            setCourse(response.data);
            // Expand first module by default
            if (response.data.modules && response.data.modules.length > 0) {
                setExpandedModules({ 0: true });
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const checkEnrollment = async () => {
        try {
            const response = await api.get(`/courses/courses/${params.courseId}/enrollment`);
            setEnrollment(response.data);
        } catch (err) {
            setEnrollment(null);
        }
    };

    const handleEnroll = async () => {
        if (!user) {
            alert("Please login first to enroll in this course.");
            router.push('/login');
            return;
        }

        try {
            setEnrolling(true);
            await api.post(`/courses/courses/${params.courseId}/enroll`);
            await checkEnrollment();
            router.push(`/courses/${params.courseId}/learn`);
        } catch (err) {
            alert('Error enrolling: ' + err.message);
        } finally {
            setEnrolling(false);
        }
    };

    const toggleModule = (index) => {
        setExpandedModules(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    if (loading) {
        return (
            <div className="flex-center-full">
                <div className="loading-spinner" />
                <style jsx>{`
                    .flex-center-full {
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: #f3f4f6;
                    }
                    .loading-spinner {
                        width: 48px;
                        height: 48px;
                        border: 4px solid #e5e7eb;
                        border-top: 4px solid #3b82f6;
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                    }
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="error-container">
                <p style={{ fontSize: '48px', marginBottom: '16px' }}>😕</p>
                <h2>Course not found</h2>
                <p>{error || 'The course you are looking for does not exist.'}</p>
                <Link href="/courses" className="btn-primary">Browse Courses</Link>
                <style jsx>{`
                    .error-container {
                        min-height: 100vh;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        background: #f3f4f6;
                        text-align: center;
                    }
                    h2 { font-size: 24px; color: #1f2937; margin-bottom: 8px; }
                    p { color: #6b7280; margin-bottom: 24px; }
                    .btn-primary {
                        background: #3b82f6;
                        color: white;
                        padding: 12px 24px;
                        border-radius: 8px;
                        text-decoration: none;
                        font-weight: 600;
                    }
                `}</style>
            </div>
        );
    }

    const learningPoints = Array.isArray(course.whatYouWillLearn) ? course.whatYouWillLearn : [];
    const requirements = Array.isArray(course.requirements) ? course.requirements : [];
    const whoIsThisFor = Array.isArray(course.whoIsThisFor) ? course.whoIsThisFor : [];

    return (
        <div className="page-container">
            {/* Hero Section */}
            <div className="hero-section">
                <div className="content-wrapper hero-grid">
                    {/* Left Column: Info */}
                    <div>
                        <div style={{ display: 'flex', gap: '8px', fontSize: '14px', color: '#4b5563', marginBottom: '16px', fontWeight: 'bold' }}>
                            <Link href="/courses" style={{ color: '#4f46e5', textDecoration: 'none' }}>Courses</Link>
                            <span>{'>'}</span>
                            <span style={{ color: '#4f46e5' }}>{course.category || 'General'}</span>
                        </div>

                        <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '16px', lineHeight: '1.2' }}>
                            {course.title}
                        </h1>

                        {course.subtitle && (
                            <p style={{ fontSize: '19px', marginBottom: '24px', lineHeight: '1.4' }}>
                                {course.subtitle}
                            </p>
                        )}

                        <div style={{ fontSize: '14px', marginBottom: '32px' }}>
                            Created by <Link href="#" style={{ color: '#4f46e5', textDecoration: 'underline' }}>{course.instructorName}</Link>
                        </div>

                        <div style={{ display: 'flex', gap: '24px', fontSize: '14px', color: '#374151' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>📅</span> Last updated {new Date(course.updatedAt).toLocaleDateString()}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Placeholder for desktop layout */}
                    <div className="hero-placeholder"></div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="content-wrapper main-grid">

                {/* Left Content Column */}
                <div className="main-content">

                    {/* What You'll Learn Box */}
                    {learningPoints.length > 0 && (
                        <div style={{ border: '1px solid #d1d7dc', padding: '24px', marginBottom: '32px' }}>
                            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', color: '#2d2f31' }}>
                                What you'll learn
                            </h2>
                            <div className="learning-grid">
                                {learningPoints.map((point, i) => (
                                    <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'start', fontSize: '14px', color: '#2d2f31' }}>
                                        <span style={{ color: '#2d2f31', minWidth: '16px' }}>✓</span>
                                        <span>{point}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Course Content */}
                    <div style={{ marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', color: '#2d2f31' }}>
                            Course content
                        </h2>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', color: '#2d2f31' }}>
                            <span>{course.modules?.length || 0} modules • {course.duration || 0}h total length</span>
                            <button
                                onClick={() => {
                                    const allExpanded = Object.keys(expandedModules).length === course.modules?.length;
                                    setExpandedModules(allExpanded ? {} : course.modules.reduce((acc, _, i) => ({ ...acc, [i]: true }), {}));
                                }}
                                style={{ background: 'none', border: 'none', color: '#5624d0', fontWeight: '700', cursor: 'pointer', padding: 0 }}
                            >
                                {Object.keys(expandedModules).length === course.modules?.length ? 'Collapse all' : 'Expand all'}
                            </button>
                        </div>

                        <div style={{ border: '1px solid #d1d7dc', borderBottom: 'none' }}>
                            {course.modules?.map((module, index) => (
                                <div key={module.id} style={{ borderBottom: '1px solid #d1d7dc' }}>
                                    {/* Module Header */}
                                    <div
                                        onClick={() => toggleModule(index)}
                                        style={{
                                            padding: '16px 24px',
                                            background: '#f7f9fa',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            userSelect: 'none'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <span style={{ transform: expandedModules[index] ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s', fontSize: '12px' }}>▼</span>
                                            <span style={{ fontWeight: '700', color: '#2d2f31', fontSize: '16px' }}>{module.title}</span>
                                        </div>
                                        <span style={{ fontSize: '14px', color: '#6a6f73' }}>
                                            {module.videoDuration ? `${module.videoDuration}m` : '1 lesson'}
                                        </span>
                                    </div>

                                    {/* Module Description (Expanded) */}
                                    {expandedModules[index] && (
                                        <div style={{ padding: '16px 24px', fontSize: '14px', color: '#2d2f31', background: 'white' }}>
                                            <div style={{ display: 'flex', gap: '12px', alignItems: 'start', marginBottom: '8px' }}>
                                                <span style={{ fontSize: '16px' }}>🎥</span>
                                                <div style={{ flex: 1 }}>
                                                    <span style={{ display: 'block', color: '#5624d0', textDecoration: 'underline', cursor: 'pointer' }}>
                                                        {module.title} - Video Lesson
                                                    </span>
                                                    {module.description && (
                                                        <p style={{ marginTop: '4px', color: '#6a6f73' }}>{module.description}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Requirements */}
                    {requirements.length > 0 && (
                        <div style={{ marginBottom: '32px' }}>
                            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: '#2d2f31' }}>
                                Requirements
                            </h2>
                            <ul style={{ listStyle: 'disc', paddingLeft: '20px', fontSize: '14px', color: '#2d2f31', lineHeight: '1.6' }}>
                                {requirements.map((req, i) => (
                                    <li key={i} style={{ marginBottom: '8px' }}>{req}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Description */}
                    <div style={{ marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: '#2d2f31' }}>
                            Description
                        </h2>
                        <div style={{ fontSize: '14px', color: '#2d2f31', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                            {course.description}
                        </div>
                    </div>

                    {/* Who is this for */}
                    {whoIsThisFor.length > 0 && (
                        <div style={{ marginBottom: '32px' }}>
                            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: '#2d2f31' }}>
                                Who this course is for:
                            </h2>
                            <ul style={{ listStyle: 'disc', paddingLeft: '20px', fontSize: '14px', color: '#2d2f31', lineHeight: '1.6' }}>
                                {whoIsThisFor.map((item, i) => (
                                    <li key={i} style={{ marginBottom: '8px' }}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Right Sticky Sidebar */}
                <div className="sidebar-container">
                    <div className="sidebar-card">
                        {/* Video Preview Image */}
                        <div style={{ position: 'relative', height: '200px', background: 'black', overflow: 'hidden' }}>
                            {course.coverImage ? (
                                <img src={course.coverImage} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
                            ) : (
                                <div style={{ width: '100%', height: '100%', background: '#333' }} />
                            )}
                            <div style={{
                                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                                width: '64px', height: '64px', background: 'white', borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                                boxShadow: '0 2px 4px rgba(249, 252, 255, 0.2)'
                            }}>
                                <div style={{
                                    width: 0, height: 0,
                                    borderTop: '10px solid transparent',
                                    borderBottom: '10px solid transparent',
                                    borderLeft: '16px solid black',
                                    marginLeft: '4px'
                                }} />
                            </div>
                            <div style={{
                                position: 'absolute', bottom: '16px', width: '100%', textAlign: 'center',
                                color: 'white', fontWeight: '700', textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                            }}>
                                Preview this course
                            </div>
                        </div>

                        <div style={{ padding: '24px' }}>
                            <div style={{ fontSize: '32px', fontWeight: '800', color: '#2d2f31', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                ₹{course.price}
                            </div>

                            {enrollment ? (
                                <Link
                                    href={`/courses/${course.id}/learn`}
                                    style={{
                                        display: 'block', width: '100%', padding: '14px',
                                        background: '#2d2f31', color: 'white',
                                        textAlign: 'center', fontWeight: '700', textDecoration: 'none',
                                        marginBottom: '12px'
                                    }}
                                >
                                    Go to Course
                                </Link>
                            ) : (
                                <>
                                    <button
                                        onClick={handleEnroll}
                                        disabled={enrolling}
                                        style={{
                                            width: '100%', padding: '14px',
                                            background: 'white', color: '#2d2f31', border: '1px solid #2d2f31',
                                            fontWeight: '700', fontSize: '16px', cursor: 'pointer'
                                        }}
                                    >
                                        Buy now
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .page-container {
                    background: white;
                    min-height: 100vh;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }
                .hero-section {
                    background: #f0f6ff;
                    color: #1f2937;
                    padding: 32px 0 48px;
                }
                .content-wrapper {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 24px;
                    position: relative;
                }
                .hero-grid {
                    display: grid;
                    grid-template-columns: 1fr 380px;
                    gap: 48px;
                }
                .main-grid {
                    display: grid;
                    grid-template-columns: 1fr 380px;
                    gap: 48px;
                }
                .main-content {
                    padding-top: 32px;
                    padding-bottom: 64px;
                }
                .learning-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 16px;
                }
                .sidebar-container {
                    position: relative;
                }
                .sidebar-card {
                    position: sticky;
                    top: 20px;
                    margin-top: -150px; /* Reduced specific negative margin */
                    background: white;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                    border: 1px solid #d1d7dc;
                    z-index: 10;
                }

                @media (max-width: 960px) {
                    .hero-grid {
                        display: flex;
                        flex-direction: column;
                        gap: 24px;
                    }
                    .hero-placeholder {
                        display: none;
                    }
                    .main-grid {
                        display: flex;
                        flex-direction: column-reverse; /* Sidebar on top or bottom? Standard is bottom for mobile, or static top. Let's stack naturally: main content then sidebar? No, usually 'Buy' is important. */
                        /* Let's try standard column: Content then Sidebar? Or Sidebar at top?
                           Udemy often floats a bottom bar.
                           For simplicity here: Sidebar becomes static flow. 
                        */
                        flex-direction: column;
                        gap: 24px;
                    }
                    /* Move Sidebar to top for visibility? Or keep at bottom? */
                    /* Let's keep specific order: Sidebar first in main grid on mobile? */
                    .main-grid {
                        display: flex;
                        flex-direction: column;
                    }
                    /* Actually we need sidebar to be visible. Let's just stack standard. */
                    .sidebar-container {
                        order: -1; /* Move sidebar to top on mobile */
                        position: static;
                    }
                    .sidebar-card {
                        position: static;
                        margin-top: 24px; /* Normal margin */
                        width: 100%;
                        z-index: 1;
                    }
                    .main-content {
                        padding-top: 0;
                    }
                    .learning-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
}
