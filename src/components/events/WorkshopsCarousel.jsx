"use client";

import React, { useState, useEffect, useRef } from 'react';
import { api } from '@/services/api';

export default function WorkshopsCarousel() {
    const [workshops, setWorkshops] = useState([]);
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef(null);

    useEffect(() => {
        fetchWorkshops();
    }, []);

    const fetchWorkshops = async () => {
        try {
            setLoading(true);
            const data = await api.get('/workshops');
            setWorkshops(data || []);
        } catch (err) {
            console.error('Failed to fetch workshops:', err);
        } finally {
            setLoading(false);
        }
    };

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = 400;
            if (direction === 'left') {
                scrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    if (loading) return null;
    if (workshops.length === 0) return null;

    return (
        <div className="mb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 px-4 md:px-0 gap-6">
                <div>
                    <h2 className="text-[32px] md:text-[40px] font-[800] text-[#003B5C] mb-3 leading-tight">Upcoming Workshops</h2>
                    <p className="text-gray-500 text-lg font-medium">Enhance your skills with our expert-led workshops</p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => scroll('left')}
                        className="w-12 h-12 rounded-full border-2 border-gray-100 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:border-blue-100 hover:bg-blue-50 transition-all shadow-sm"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="w-12 h-12 rounded-full border-2 border-gray-100 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:border-blue-100 hover:bg-blue-50 transition-all shadow-sm"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex gap-8 overflow-x-auto pb-10 -mx-4 px-4 md:mx-0 md:px-0 scroll-smooth hide-scrollbar snap-x snap-mandatory"
            >
                {workshops.map((workshop) => (
                    <div
                        key={workshop.id}
                        className="bg-white rounded-2xl border border-gray-100 p-5 flex-shrink-0 w-[80vw] sm:w-[260px] snap-start shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative group"
                    >
                        {/* Status Badge & Icon */}
                        <div className="flex justify-between items-center mb-5">
                            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <span className="bg-[#E0F2F1] text-[#00897B] text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
                                Upcoming
                            </span>
                        </div>

                        {/* Content */}
                        <h3 className="text-base font-[800] text-[#003B5C] mb-2 line-clamp-2 h-10 leading-snug">
                            {workshop.title}
                        </h3>

                        <div className="flex items-center gap-2 mb-3">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider
                                ${workshop.mode === 'Online' ? 'bg-green-50 text-green-700' :
                                    workshop.mode === 'Offline' ? 'bg-orange-50 text-orange-700' : 'bg-purple-50 text-purple-700'}`}>
                                {workshop.mode}
                            </span>
                        </div>

                        <p className="text-[11px] text-gray-400 mb-4 flex items-center gap-1.5 font-medium">
                            <svg className="w-3.5 h-3.5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {(workshop.startDate || workshop.eventDate) ? (
                                <span>
                                    {new Date(workshop.startDate || workshop.eventDate).toLocaleDateString()}
                                    {(workshop.endDate && workshop.endDate !== workshop.startDate) ?
                                        ` - ${new Date(workshop.endDate).toLocaleDateString()}` : ''}
                                </span>
                            ) : 'Date TBA'}
                        </p>

                        <p className="text-gray-500 text-[11px] mb-6 line-clamp-3 h-[45px] leading-relaxed font-medium">
                            {workshop.description}
                        </p>

                        {/* Actions */}
                        <div className="flex gap-2">
                            <a
                                href={workshop.registerUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 bg-[#003B5C] hover:bg-[#002a42] text-white text-center py-2.5 rounded-lg font-bold text-[11px] shadow-sm transition-all hover:scale-[1.02]"
                            >
                                Register
                            </a>
                            <button className="flex-1 bg-white border border-gray-200 text-gray-600 hover:border-blue-100 hover:text-blue-600 py-2.5 rounded-lg font-bold text-[11px] transition-all">
                                Know More
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <style jsx global>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
}
