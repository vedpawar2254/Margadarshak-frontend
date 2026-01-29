"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { api } from '@/services/api';

export default function HighlightsCarousel() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef(null);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const data = await api.get('/events');
            setEvents(data || []);
        } catch (err) {
            console.error('Failed to fetch highlights:', err);
        } finally {
            setLoading(false);
        }
    };

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = 350;
            if (direction === 'left') {
                scrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    if (loading) return null;
    if (events.length === 0) return null;

    return (
        <div className="mb-20">
            {/* Minimal Header */}
            <div className="mb-10 px-4 md:px-0">
                <h2 className="text-[32px] md:text-[40px] font-[800] text-[#003B5C] mb-2 leading-tight">Past Highlights</h2>
                <p className="text-gray-500 text-lg font-medium opacity-80">Celebrating our memorable events and experiences</p>
            </div>

            {/* Scroll Container with Arrows */}
            <div className="relative group px-4 md:px-0">
                {/* Horizontal Scroll Area */}
                <div
                    ref={scrollRef}
                    className="flex gap-5 overflow-x-auto pb-6 scroll-smooth hide-scrollbar snap-x snap-mandatory"
                >
                    {events.map((event) => (
                        <div
                            key={event.id}
                            className="bg-white rounded-2xl border border-gray-100 flex-shrink-0 w-[60vw] sm:w-[220px] snap-start overflow-hidden group/card hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                        >
                            {/* Image with overlay */}
                            <div className="aspect-[4/3] relative bg-gray-50 overflow-hidden">
                                {event.imageUrl ? (
                                    <Image
                                        src={event.imageUrl}
                                        alt={event.title}
                                        fill
                                        className="object-cover group-hover/card:scale-105 transition-transform duration-700"
                                        unoptimized
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-3xl">
                                        📸
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity" />
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <h3 className="text-sm font-[800] text-[#003B5C] mb-1.5 truncate group-hover/card:text-blue-700 transition-colors" title={event.title}>
                                    {event.title}
                                </h3>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-[9px] font-black text-pink-500 uppercase tracking-[0.1em]">
                                        {new Date(event.date || event.eventDate).toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>
                                <p className="text-gray-500 text-[11px] line-clamp-2 h-8 leading-relaxed font-medium opacity-80">
                                    {event.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Dots indicator at the bottom if many items */}
                {events.length > 1 && (
                    <div className="flex gap-2 justify-center mt-6">
                        {[...Array(Math.min(4, events.length))].map((_, i) => (
                            <div key={i} className={`h-1.5 rounded-full transition-all ${i === 0 ? 'w-6 bg-pink-400' : 'w-1.5 bg-gray-200'}`} />
                        ))}
                    </div>
                )}
            </div>

            <style jsx global>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
}
