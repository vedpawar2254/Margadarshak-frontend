'use client';

import Link from 'next/link';
import Image from 'next/image';

import { useAuth } from '@/hooks/useAuth';

const HeroSection = () => {
    const { user } = useAuth();
    return (
        <section className="bg-[#004880] text-white py-8 md:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col-reverse md:grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                    {/* Text Content */}
                    <div className="space-y-6 text-center md:text-left">
                        <div className="inline-block bg-white/20 px-4 py-1 rounded-full text-xs md:text-sm font-medium backdrop-blur-sm">
                            🌟Transforming Education in Tier 2 & 3 Cities
                        </div>
                        <h1 className="text-2xl md:text-4xl font-bold leading-tight">
                            Empowering Students to <br />
                            <span className="text-[#8cc0ed]">Achieve Their Dreams</span>
                        </h1>
                        <p className="text-sm md:text-base text-gray-200 max-w-lg mx-auto md:mx-0">
                            We empower students from Tier 2 and Tier 3 cities to become confident, skilled, and career-ready individuals by bridging the gap between education and employability through simplified, inclusive, and practical learning.</p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center md:justify-start">
                            <Link
                                href="/courses"
                                className="bg-[#22c55e] hover:bg-[#16a34a] text-white px-6 py-2.5 rounded-full font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
                            >
                                Explore Courses
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                            </Link>
                            {user ? (
                                <Link
                                    href="/courses"
                                    className="bg-white text-[#0f52ba] hover:bg-gray-100 px-6 py-2.5 rounded-full font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                    </svg>
                                    Go to Courses
                                </Link>
                            ) : (
                                <Link
                                    href="/register"
                                    className="bg-white text-[#0f52ba] hover:bg-gray-100 px-6 py-2.5 rounded-full font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                                    </svg>
                                    Join Now
                                </Link>
                            )}
                        </div>

                        <div className="grid grid-cols-3 gap-4 md:gap-8 pt-8 border-t border-white/20 mt-8">
                            <div>
                                <div className="text-lg md:text-xl font-bold">500+</div>
                                <div className="text-xs text-gray-300">Students Guided</div>
                            </div>
                            <div>
                                <div className="text-lg md:text-xl font-bold">15+</div>
                                <div className="text-xs text-gray-300">Certified Tutors</div>
                            </div>
                            <div>
                                <div className="text-lg md:text-xl font-bold">95%</div>
                                <div className="text-xs text-gray-300">Success Rate</div>
                            </div>
                        </div>
                    </div>

                    {/* Image Content */}
                    <div className="relative h-[200px] md:h-[350px] w-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10">
                        {/* Placeholder for Hero Image */}
                        <div className="absolute inset-0 bg-gray-300 flex items-center justify-center text-gray-500">
                            <span className="text-lg">Student Group Image Placeholder</span>
                        </div>
                        <Image
                            src="/homehero.png"
                            alt="Students learning together"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
