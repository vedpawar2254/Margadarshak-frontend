"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { api } from "@/services/api";

export default function MentorsClient() {
    const scrollRef = React.useRef(null);
    const [mentors, setMentors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMentors = async () => {
            try {
                const data = await api.get('/mentors');
                setMentors(data || []);
            } catch (err) {
                console.error("Failed to fetch mentors", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMentors();
    }, []);

    return (
        <div className="min-h-screen bg-white font-sans text-[#1a1a1a]">
            <style jsx global>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>

            {/* 1. Hero Section */}
            <section className="bg-[#004880] text-white pt-8 pb-8 md:pt-12 md:pb-10 px-4 md:px-8">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
                    <div className="lg:w-1/2 space-y-8 text-center lg:text-left">
                        <h1 className="text-2xl md:text-5xl font-extrabold leading-tight">
                            Find Your Path to <br />
                            <span className="text-[#64b5f6]">Career Success</span>
                        </h1>
                        <p className="text-sm md:text-lg text-blue-100 leading-relaxed max-w-xl">
                            Start with our comprehensive self-assessment, connect with experienced mentors, join peer groups, and get inspired by real success stories from students just like you.
                        </p>
                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 pt-4">
                            <div className="flex items-center gap-3">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-[#004880] bg-blue-400"></div>
                                    ))}
                                </div>
                                <div>
                                    <p className="font-semibold text-sm">10,000+ Students</p>
                                    <p className="text-xs text-blue-200 uppercase tracking-wider">Guided Successfully</p>
                                </div>
                            </div>
                            <div className="h-10 w-px bg-blue-400/30 hidden md:block"></div>
                            <div>
                                <p className="font-bold text-lg uppercase">4.8/5 Rating</p>
                                <p className="text-xs text-blue-200 uppercase tracking-wider">From 2,500+ Reviews</p>
                            </div>
                        </div>
                    </div>
                    <div className="w-full lg:w-1/2 relative">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl h-[250px] md:h-[400px] w-full border-4 border-white/10">
                            <Image
                                src="/images/mentors/mentor-test-hero.png"
                                alt="Students learning with mentor"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Discover Yourself Section */}
            <section className="py-8 px-4 bg-white">
                <div className="max-w-7xl mx-auto text-center mb-10">
                    <h2 className="text-xl md:text-4xl font-extrabold text-[#1a1a1a] mb-4">
                        Discover Yourself Before Choosing <br className="hidden md:block" />
                        <span className="text-[#004880]">Your Direction</span>
                    </h2>
                    <div className="w-20 h-1 bg-gray-100 mx-auto rounded-full mt-6"></div>
                </div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-4">
                    {/* Persona Test Card */}
                    <div className="bg-[#f0f7ff] rounded-3xl p-4 md:p-6 border border-blue-50 relative overflow-hidden flex flex-col shadow-sm transition-all hover:shadow-md">
                        <div className="absolute top-4 right-4 bg-[#fff3e0] text-[#e65100] px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 border border-[#ffe0b2]">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                            Premium Assessment
                        </div>
                        <div className="mt-6 mb-3">
                            <h3 className="text-lg lg:text-2xl font-extrabold text-[#1a1a1a] mb-1 leading-tight">Persona Test</h3>
                            <p className="text-gray-500 italic text-xs">"Understand How You Think & Work"</p>
                        </div>
                        <p className="text-gray-600 text-xs leading-relaxed mb-4 bg-white/50 p-4 rounded-xl border border-white">
                            Identify your natural personality traits, decision-making style, and learning preferences. Choose career paths that align with who you truly are.
                        </p>
                        <div className="space-y-3 mb-6 flex-grow">
                            <p className="font-bold text-xs text-[#1a1a1a]">What you'll discover:</p>
                            <ul className="space-y-1 text-xs text-gray-600 leading-tight">
                                <li className="flex gap-2"><span>•</span> Core personality type & styles</li>
                                <li className="flex gap-2"><span>•</span> Strengths & work preferences</li>
                                <li className="flex gap-2"><span>•</span> Suitable roles & environments</li>
                            </ul>
                            <div className="pt-2 border-t border-blue-100/50 mt-2">
                                <p className="text-xs text-gray-500 leading-tight">
                                    <span className="font-bold text-[#1a1a1a]">Best for:</span> Self-awareness before career choices.
                                </p>
                            </div>
                        </div>
                        <div className="space-y-2.5">
                            <div className="w-full bg-[#e3f2fd] text-blue-600 py-2.5 rounded-xl font-bold text-xs border border-blue-100 flex items-center justify-center gap-2">
                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                                fee: ₹299+ 🛡️ Secure Payment
                            </div>
                            <Button
                                onClick={() => window.location.href = '/tests/persona'}
                                className="w-full py-3 rounded-2xl text-base font-bold bg-[#004880] hover:bg-blue-800"
                            >
                                Start Persona Test
                            </Button>
                        </div>
                    </div>

                    {/* Psychometric Test Card */}
                    <div className="bg-[#f0f7ff] rounded-3xl p-4 md:p-6 border border-blue-50 relative overflow-hidden flex flex-col shadow-sm transition-all hover:shadow-md">
                        <div className="absolute top-4 right-4 bg-[#fff9c4] text-[#827717] px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 border border-[#fbc02d]">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                            Premium Assessment
                        </div>
                        <div className="mt-6 mb-3">
                            <h3 className="text-lg lg:text-2xl font-extrabold text-[#1a1a1a] mb-1 leading-tight">Psychometric Test</h3>
                            <p className="text-gray-500 italic text-xs">"Analyze Your Psychological Profile"</p>
                        </div>
                        <p className="text-gray-600 text-xs leading-relaxed mb-4 bg-white/50 p-4 rounded-xl border border-white">
                            A scientific assessment of your cognitive abilities, personality traits, and behavioral style. Used by employers to predict job performance.
                        </p>
                        <div className="space-y-3 mb-6 flex-grow">
                            <p className="font-bold text-xs text-[#1a1a1a]">What you'll gain:</p>
                            <ul className="space-y-1 text-xs text-gray-600 leading-tight">
                                <li className="flex gap-2"><span>•</span> Cognitive ability score</li>
                                <li className="flex gap-2"><span>•</span> Behavioral traits analysis</li>
                                <li className="flex gap-2"><span>•</span> Emotional intelligence insights</li>
                            </ul>
                            <div className="pt-2 border-t border-blue-100/50 mt-2">
                                <p className="text-xs text-gray-500 leading-tight">
                                    <span className="font-bold text-[#1a1a1a]">Best for:</span> Job seekers & interview preparation.
                                </p>
                            </div>
                        </div>
                        <div className="space-y-2.5">
                            <div className="w-full bg-[#e3f2fd] text-blue-600 py-2.5 rounded-xl font-bold text-xs border border-blue-100 flex items-center justify-center gap-2">
                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                                fee: ₹499+ 🛡️ Secure Payment
                            </div>
                            <Button
                                onClick={() => window.location.href = '/tests/psychometric'}
                                className="w-full py-3 rounded-2xl text-base font-bold bg-[#004880] hover:bg-blue-800"
                            >
                                Start Psychometric Test
                            </Button>
                        </div>
                    </div>

                    {/* Learning Type Test Card */}
                    <div className="bg-[#f0f7ff] rounded-3xl p-4 md:p-6 border border-blue-50 relative overflow-hidden flex flex-col shadow-sm transition-all hover:shadow-md">
                        <div className="absolute top-4 right-4 bg-[#e8f5e9] text-[#2e7d32] px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 border border-[#c8e6c9]">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.9L10 1.554L17.834 4.9c.452.194.75.64.75 1.126v4.387c0 4.117-2.61 7.82-6.52 9.24a1.233 1.233 0 0 1-.94 0c-3.91-1.42-6.52-5.123-6.52-9.24V6.026c0-.486.297-.932.75-1.126zM10 3.125L4.5 5.483v4.29c0 3.336 2.052 6.36 5.21 7.551a.208.208 0 0 0 .14 0c3.16-1.192 5.21-4.215 5.21-7.551v-4.29L10 3.125z" clipRule="evenodd" /></svg>
                            Skill Assessment
                        </div>
                        <div className="mt-6 mb-3">
                            <h3 className="text-lg lg:text-2xl font-extrabold text-[#1a1a1a] mb-1 leading-tight">Learning Type Test</h3>
                            <p className="text-gray-500 italic text-xs">"Discover Your Learning Style"</p>
                        </div>
                        <p className="text-gray-600 text-xs leading-relaxed mb-4 bg-white/50 p-4 rounded-xl border border-white">
                            Are you a Visual, Auditory, Read/Write, or Kinesthetic learner? Optimise your study habits and learn faster by knowing your style.
                        </p>
                        <div className="space-y-3 mb-6 flex-grow">
                            <p className="font-bold text-xs text-[#1a1a1a]">What you'll discover:</p>
                            <ul className="space-y-1 text-xs text-gray-600 leading-tight">
                                <li className="flex gap-2"><span>•</span> Your primary learning style</li>
                                <li className="flex gap-2"><span>•</span> Best study techniques for you</li>
                                <li className="flex gap-2"><span>•</span> How to improve memory & retention</li>
                            </ul>
                            <div className="pt-2 border-t border-blue-100/50 mt-2">
                                <p className="text-xs text-gray-500 leading-tight">
                                    <span className="font-bold text-[#1a1a1a]">Best for:</span> Students wanting to improve grades & study efficiency.
                                </p>
                            </div>
                        </div>
                        <div className="space-y-2.5">
                            <div className="w-full bg-[#e3f2fd] text-blue-600 py-2.5 rounded-xl font-bold text-xs border border-blue-100 flex items-center justify-center gap-2">
                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                                fee: ₹149+ 🛡️ Secure Payment
                            </div>
                            <Button
                                onClick={() => window.location.href = '/tests/learning-type'}
                                className="w-full py-3 rounded-2xl text-base font-bold bg-[#004880] hover:bg-blue-800"
                            >
                                Start Learning Test
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Group Mentorship Section */}
            <section className="py-16 px-4 bg-[#f8fbff] text-center">
                <div className="max-w-4xl mx-auto space-y-8">
                    <h2 className="text-2xl md:text-4xl font-extrabold text-[#004880] mb-6">
                        Request a Group Mentorship Session
                    </h2>
                    <p className="text-lg md:text-xl text-gray-500 font-medium tracking-tight">
                        request a topic you want experts to cover
                    </p>
                    <div className="pt-4 flex justify-center">
                        <a href="https://docs.google.com/forms/d/1Ck1KOWIMLH05PDk3nDg4I1RwNjl5HUEdYncahs-pdAg/preview" target="_blank" rel="noopener noreferrer">
                            <Button className="px-6 py-2.5 md:px-8 md:py-3 rounded-2xl text-base md:text-lg font-bold flex items-center gap-3 bg-[#007edb] hover:bg-blue-600 shadow-lg group">
                                Request New Topic
                                <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </Button>
                        </a>
                    </div>
                    <p className="text-gray-400 font-medium max-w-2xl mx-auto leading-relaxed pt-4">
                        Topics are finalized based on learner demand. Scheduled group sessions will be listed under the Events section.
                    </p>
                </div>
            </section>

            {/* 4. Mentors Showcase */}
            <section className="py-6 md:py-10 px-4 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-4 lg:gap-8">
                    {/* Mentors Carousel (Left side) - Now 50% width */}
                    <div className="lg:w-1/2 w-full relative order-2 lg:order-1">
                        {/* Smooth right shade to indicate more content */}
                        <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-white via-white/40 to-transparent z-10 pointer-events-none hidden lg:block"></div>

                        <div
                            ref={scrollRef}
                            className="flex gap-2 md:gap-4 overflow-x-auto pb-8 scrollbar-hide snap-x snap-mandatory items-stretch pr-4 md:pr-20"
                        >
                            {loading ? (
                                <div className="w-full h-40 flex items-center justify-center text-gray-400 text-sm">
                                    Loading mentors...
                                </div>
                            ) : mentors.length === 0 ? (
                                <div className="w-full h-40 flex items-center justify-center text-gray-400 text-sm italic">
                                    Mentors coming soon...
                                </div>
                            ) : (
                                mentors.map((mentor) => (
                                    <div
                                        key={mentor.id}
                                        className="min-w-[150px] md:min-w-[200px] bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 flex flex-col snap-start hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                                    >
                                        <div className="relative h-28 md:h-40 bg-gray-100">
                                            {mentor.imageUrl ? (
                                                <Image
                                                    src={mentor.imageUrl}
                                                    alt={mentor.name}
                                                    fill
                                                    className="object-cover"
                                                    unoptimized
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-gray-300">
                                                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-2.5 md:p-3 flex flex-col flex-grow">
                                            <h4 className="text-xs md:text-base font-extrabold text-[#1a1a1a] mb-0.5 line-clamp-1">{mentor.name}</h4>
                                            <p className="text-blue-600 font-bold text-[8px] md:text-[9px] mb-2 uppercase tracking-wider line-clamp-1">{mentor.role}</p>
                                            <div className="space-y-2 text-[9px] md:text-[10px] font-medium text-gray-500">
                                                <p className="bg-gray-50 p-0.5 md:p-1 rounded-lg border-l-2 border-blue-400 line-clamp-2">
                                                    {mentor.skills.join(" • ")}
                                                </p>
                                                <p className="leading-relaxed line-clamp-3">{mentor.bio}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Circular Navigation Buttons */}
                        <div className="flex justify-start gap-2 mt-6 lg:ml-2">
                            <button
                                onClick={() => {
                                    if (scrollRef.current) {
                                        scrollRef.current.scrollBy({ left: -400, behavior: 'smooth' });
                                    }
                                }}
                                className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:border-[#004880] hover:text-[#004880] transition-all bg-white shadow-sm hover:shadow-md group"
                                aria-label="Previous Mentor"
                            >
                                <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                            </button>
                            <button
                                onClick={() => {
                                    if (scrollRef.current) {
                                        scrollRef.current.scrollBy({ left: 400, behavior: 'smooth' });
                                    }
                                }}
                                className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:border-[#004880] hover:text-[#004880] transition-all bg-white shadow-sm hover:shadow-md group"
                                aria-label="Next Mentor"
                            >
                                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                            </button>
                        </div>
                    </div>

                    {/* Section Text (Right side) - Now 50% width */}
                    <div className="lg:w-1/2 space-y-8 order-1 lg:order-2 text-center lg:text-left lg:pl-8">
                        <div className="space-y-4">
                            <h2 className="text-lg md:text-3xl font-extrabold text-[#1a1a1a] leading-tight">
                                Learn From <br />
                                <span className="text-[#004880]">Those Who've Walked the Path</span>
                            </h2>
                            <div className="w-20 h-1.5 bg-blue-600 rounded-full mx-auto lg:mx-0"></div>
                        </div>
                        <p className="text-xs md:text-sm text-gray-600 font-medium leading-relaxed italic border-l-4 border-blue-500 pl-6 bg-blue-50/30 py-6 rounded-r-2xl">
                            "Our mentors bring real-world experience, practical insights, and a genuine passion for guiding students and early professionals toward the right career direction."
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
