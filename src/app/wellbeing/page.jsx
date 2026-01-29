'use client';

import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import dynamic from 'next/dynamic';

// Lazy Load heavy sections
const ClubsSection = dynamic(() => import('@/components/wellbeing/ClubsSection'), {
    loading: () => <div className="h-96 flex items-center justify-center bg-gray-50"><div className="w-8 h-8 rounded-full border-2 border-blue-600 animate-spin border-t-transparent"></div></div>
});

const ResourcesSection = dynamic(() => import('@/components/wellbeing/ResourcesSection'), {
    loading: () => <div className="h-96 flex items-center justify-center bg-white"><div className="w-8 h-8 rounded-full border-2 border-blue-600 animate-spin border-t-transparent"></div></div>
});

export default function WellbeingPage() {
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        fetchTopics();
        setAnimate(true);
    }, []);

    const fetchTopics = async () => {
        try {
            const response = await api.get('/wellbeing/topics');
            setTopics(response.data || []);
            // Auto-expand first topic if exists
            if (response.data?.[0]) {
                setExpandedId(response.data[0].id);
            }
        } catch (err) {
            console.error('Failed to load wellness topics:', err);
        } finally {
            setLoading(false);
        }
    };

    const toggleTopic = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen bg-white font-jakarta text-[#1F2937] transition-opacity duration-700 ${animate ? 'opacity-100' : 'opacity-0'}`}>
            {/* 1. Hero Section (Static for LCP) */}
            <section className="pt-24 pb-20 px-4 text-center max-w-5xl mx-auto">
                <h1 className="text-[44px] md:text-[64px] font-[800] text-[#111827] mb-6 leading-[1.1] tracking-tight animate-fade-in-up">
                    Grow Beyond Your <br className="hidden md:block" />
                    <span className="text-[#0c5696] relative inline-block">
                        Mind
                        <svg className="absolute -bottom-2 left-0 w-full h-3 text-[#0c5696] opacity-20" viewBox="0 0 100 10" preserveAspectRatio="none">
                            <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
                        </svg>
                    </span>
                </h1>
                <p className="text-[#6B7280] text-lg md:text-[20px] max-w-3xl mx-auto leading-relaxed font-normal animate-fade-in-up delay-100">
                    Join a community dedicated to mental wellness, habit building, and sustainable growth. Balance your mind, build healthy habits, and thrive together.
                </p>
            </section>

            {/* 2. Clubs Section (Lazy Loaded) */}
            <div id="clubs-section">
                <ClubsSection />
            </div>

            {/* 3. Resources Accordion Section (Lazy Loaded) */}
            <div id="resources-section">
                <ResourcesSection
                    topics={topics}
                    expandedId={expandedId}
                    toggleTopic={toggleTopic}
                />
            </div>

            {/* 4. Footer CTA Section (Static) */}
            <section className="bg-gradient-to-b from-[#1D4ED8] to-[#1e40af] text-white py-24 px-4 text-center">
                <div className="max-w-5xl mx-auto flex flex-col items-center">
                    <div className="flex items-center gap-2.5 text-[#BFDBFE] mb-8 text-[13px] font-[700] uppercase tracking-[0.05em] animate-pulse">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                        Start Your Journey Today
                    </div>

                    <h2 className="text-[36px] md:text-[56px] font-[800] mb-8 leading-[1.15] tracking-tight">
                        Your mental well-being is the<br className="hidden md:block" />foundation of your success
                    </h2>

                    <p className="text-[#DBEAFE] text-lg md:text-xl max-w-3xl mb-12 leading-relaxed font-normal">
                        Join thousands of students who are transforming their lives through mindfulness, community, and intentional growth.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-5 w-full justify-center max-w-lg mx-auto mb-20">
                        <button
                            onClick={() => scrollToSection('clubs-section')}
                            className="bg-white text-[#1D4ED8] hover:bg-gray-50 text-[16px] font-[700] py-4 px-10 rounded-[14px] shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 transition-transform transform hover:-translate-y-1"
                        >
                            Join a Club Now <span aria-hidden="true">&rarr;</span>
                        </button>
                        <button
                            onClick={() => scrollToSection('resources-section')}
                            className="bg-transparent border-2 border-[#60A5FA] hover:bg-[#2563EB] text-white text-[16px] font-[700] py-4 px-10 rounded-[14px] transition-all flex items-center justify-center backdrop-blur-sm hover:border-[#2563EB]"
                        >
                            Explore Resources
                        </button>
                    </div>

                    <div className="grid grid-cols-3 gap-8 md:gap-24 border-t border-[#3B82F6] pt-12 w-full max-w-4xl px-4">
                        <div>
                            <div className="text-[36px] md:text-[44px] font-[800] mb-1">7K+</div>
                            <div className="text-[#BFDBFE] text-[13px] font-[600] uppercase tracking-wider">Active Members</div>
                        </div>
                        <div>
                            <div className="text-[36px] md:text-[44px] font-[800] mb-1">3</div>
                            <div className="text-[#BFDBFE] text-[13px] font-[600] uppercase tracking-wider">Active Clubs</div>
                        </div>
                        <div>
                            <div className="text-[36px] md:text-[44px] font-[800] mb-1">50+</div>
                            <div className="text-[#BFDBFE] text-[13px] font-[600] uppercase tracking-wider">Resources</div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
