'use client';

import Link from 'next/link';
import { useState } from 'react';
import PartnerCarousel from '@/components/PartnerCarousel';
import PlacementCareerSection from '@/components/placement/PlacementCareerSection';

export default function PlacementPage() {
    const [showResumeModal, setShowResumeModal] = useState(false);

    return (
        <div style={{
            padding: '0',
            minHeight: '100vh',
            background: '#f8fafc',
            width: '100%'
        }}>
            {/* New Placement & Career Guidance Section */}
            <PlacementCareerSection onResumeClick={() => setShowResumeModal(true)} />

            {/* Partner Companies Carousel */}
            <PartnerCarousel />

            {/* Resume Type Selection Modal */}
            {showResumeModal && (
                <div onClick={() => setShowResumeModal(false)} style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '24px'
                }}>
                    <div onClick={(e) => e.stopPropagation()} style={{
                        background: 'white',
                        borderRadius: '24px',
                        padding: '48px',
                        maxWidth: '900px',
                        width: '100%',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                            <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a' }}>
                                Select Your Experience Level
                            </h2>
                            <button onClick={() => setShowResumeModal(false)} style={{
                                background: '#f1f5f9',
                                border: 'none',
                                borderRadius: '50%',
                                width: '36px',
                                height: '36px',
                                cursor: 'pointer',
                                fontSize: '18px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#64748b'
                            }}>
                                ×
                            </button>
                        </div>
                        <p style={{ fontSize: '16px', color: '#64748b', marginBottom: '40px' }}>
                            We'll tailor the resume structure to highlight your strengths perfectly.
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                            {/* Beginner Option */}
                            <Link href="/placement/resume-builder/beginner" style={{ textDecoration: 'none' }}>
                                <div className="selection-card" style={{
                                    background: 'linear-gradient(to bottom, #f0f9ff, #e0f2fe)',
                                    borderRadius: '16px',
                                    padding: '32px',
                                    cursor: 'pointer',
                                    border: '2px solid #bae6fd',
                                    transition: 'all 0.3s ease',
                                    height: '100%'
                                }}>
                                    <div style={{
                                        width: '64px',
                                        height: '64px',
                                        background: '#dcfce7',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '32px',
                                        marginBottom: '20px',
                                        color: '#166534'
                                    }}>
                                        🎓
                                    </div>
                                    <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#1e293b', marginBottom: '12px' }}>
                                        Student / Fresher
                                    </h3>
                                    <ul style={{ textAlign: 'left', color: '#64748b', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px', listStyle: 'disc', paddingLeft: '20px' }}>
                                        <li>Academic-focused layout</li>
                                        <li>Highlights Projects & Skills</li>
                                        <li>Objective-driven introduction</li>
                                        <li>Certifications section</li>
                                    </ul>
                                    <div style={{ color: '#2563eb', fontWeight: '600', fontSize: '15px' }}>
                                        Create Beginner Resume →
                                    </div>
                                </div>
                            </Link>

                            {/* Experienced Option */}
                            <Link href="/placement/resume-builder/experienced" style={{ textDecoration: 'none' }}>
                                <div className="selection-card" style={{
                                    background: 'linear-gradient(to bottom, #eff6ff, #dbeafe)',
                                    borderRadius: '16px',
                                    padding: '32px',
                                    cursor: 'pointer',
                                    border: '2px solid #93c5fd',
                                    transition: 'all 0.3s ease',
                                    height: '100%'
                                }}>
                                    <div style={{
                                        width: '64px',
                                        height: '64px',
                                        background: '#dbeafe',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '32px',
                                        marginBottom: '20px',
                                        color: '#1e40af'
                                    }}>
                                        💼
                                    </div>
                                    <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#1e293b', marginBottom: '12px' }}>
                                        Working Professional
                                    </h3>
                                    <ul style={{ textAlign: 'left', color: '#64748b', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px', listStyle: 'disc', paddingLeft: '20px' }}>
                                        <li>Experience-focused layout</li>
                                        <li>Highlights Role & Expertise</li>
                                        <li>Professional Summary</li>
                                        <li>Advanced certifications</li>
                                    </ul>
                                    <div style={{ color: '#2563eb', fontWeight: '600', fontSize: '15px' }}>
                                        Create Pro Resume →
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


