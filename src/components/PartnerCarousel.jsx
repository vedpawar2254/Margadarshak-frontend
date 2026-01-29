'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { api } from '@/services/api';

import Link from 'next/link';
import Image from 'next/image';

/**
 * Partner Companies Carousel
 * Premium infinite-scroll carousel for displaying partner logos
 * Features: auto-scroll, pause on hover, navigation arrows, responsive design
 */
export default function PartnerCarousel() {
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isPaused, setIsPaused] = useState(false);
    const [showArrows, setShowArrows] = useState(false);
    const scrollRef = useRef(null);
    const animationRef = useRef(null);
    const positionRef = useRef(0);

    useEffect(() => {
        const fetchPartners = async () => {
            try {
                const response = await api.get('/partners');
                const fetchedPartners = response.data || [];
                setPartners(fetchedPartners);
            } catch (err) {
                console.error('Failed to fetch partners:', err);
                setPartners([]);
            } finally {
                setLoading(false);
            }
        };
        fetchPartners();
    }, []);

    // Calculate item width based on viewport
    const getItemWidth = useCallback(() => {
        if (typeof window === 'undefined') return 200;
        const width = window.innerWidth;
        if (width < 640) return 160; // Mobile: 2 logos visible
        if (width < 1024) return 180; // Tablet: 3-4 logos visible
        return 200; // Desktop: 5-7 logos visible
    }, []);

    // Manual scroll handlers
    const scrollLeft = useCallback(() => {
        if (scrollRef.current) {
            const itemWidth = getItemWidth();
            scrollRef.current.scrollBy({ left: -itemWidth * 2, behavior: 'smooth' });
        }
    }, [getItemWidth]);

    const scrollRight = useCallback(() => {
        if (scrollRef.current) {
            const itemWidth = getItemWidth();
            scrollRef.current.scrollBy({ left: itemWidth * 2, behavior: 'smooth' });
        }
    }, [getItemWidth]);

    // Keyboard navigation
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'ArrowLeft') {
            scrollLeft();
        } else if (e.key === 'ArrowRight') {
            scrollRight();
        }
    }, [scrollLeft, scrollRight]);

    // Measure content width for seamless scrolling
    useEffect(() => {
        if (!scrollRef.current || partners.length === 0) return;

        const measureWidth = () => {
            if (scrollRef.current) {
                // Total width / 3 gives us the width of one original set
                const totalWidth = scrollRef.current.scrollWidth;
                const oneSetWidth = totalWidth / 3;
                scrollRef.current.style.setProperty('--scroll-width', `${oneSetWidth}px`);

                // Force restart animation
                const animationName = scrollRef.current.style.animationName;
                scrollRef.current.style.animation = 'none';
                scrollRef.current.offsetHeight; /* trigger reflow */
                scrollRef.current.style.animation = `scroll ${partners.length * 4}s linear infinite`; // Slowed down slightly for variable widths
            }
        };

        // Measure immediately and on resize
        measureWidth();
        window.addEventListener('resize', measureWidth);

        // Small timeout to ensure layout is stable
        const timer = setTimeout(measureWidth, 100);

        return () => {
            window.removeEventListener('resize', measureWidth);
            clearTimeout(timer);
        };
    }, [partners]);

    // Show loading state or render carousel
    if (loading) {
        return (
            <section style={{
                padding: '60px 0',
                background: 'white',
                marginTop: '48px',
                borderRadius: '24px',
                overflow: 'hidden',
                position: 'relative',
                textAlign: 'center'
            }}>
                <h2 style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    letterSpacing: '3px',
                    textTransform: 'uppercase',
                    color: '#9ca3af',
                    marginBottom: '40px'
                }}>
                    Our Partners
                </h2>
                <div style={{ color: '#9ca3af', fontSize: '14px' }}>Loading partners...</div>
            </section>
        );
    }

    // Triple the partners for seamless infinite scroll effect
    const displayPartners = [...partners, ...partners, ...partners];

    return (
        <section
            style={{
                padding: '60px 0',
                background: 'white',
                marginTop: '48px',
                borderRadius: '24px',
                overflow: 'hidden',
                position: 'relative'
            }}
            onMouseEnter={() => setShowArrows(true)}
            onMouseLeave={() => setShowArrows(false)}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="region"
            aria-label="Partner companies carousel"
        >
            {/* Section Title */}
            <h2 style={{
                textAlign: 'center',
                fontSize: '14px',
                fontWeight: '700',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                color: '#9ca3af',
                marginBottom: '40px'
            }}>
                Our Partners
            </h2>

            {/* Carousel Container */}
            <div
                style={{
                    position: 'relative',
                    overflow: 'hidden',
                    padding: '20px 0'
                }}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                {/* Left Navigation Arrow */}
                <button
                    onClick={scrollLeft}
                    aria-label="Scroll left"
                    style={{
                        position: 'absolute',
                        left: '20px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        cursor: 'pointer',
                        zIndex: 20,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                        color: '#374151',
                        opacity: showArrows ? 1 : 0,
                        transition: 'opacity 0.3s ease, transform 0.2s ease',
                        pointerEvents: showArrows ? 'auto' : 'none'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1)'}
                >
                    ←
                </button>

                {/* Right Navigation Arrow */}
                <button
                    onClick={scrollRight}
                    aria-label="Scroll right"
                    style={{
                        position: 'absolute',
                        right: '20px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        cursor: 'pointer',
                        zIndex: 20,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                        color: '#374151',
                        opacity: showArrows ? 1 : 0,
                        transition: 'opacity 0.3s ease, transform 0.2s ease',
                        pointerEvents: showArrows ? 'auto' : 'none'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1)'}
                >
                    →
                </button>

                {/* Gradient Overlays */}
                <div style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: '120px',
                    background: 'linear-gradient(to right, white, transparent)',
                    zIndex: 10,
                    pointerEvents: 'none'
                }} />
                <div style={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    bottom: 0,
                    width: '120px',
                    background: 'linear-gradient(to left, white, transparent)',
                    zIndex: 10,
                    pointerEvents: 'none'
                }} />

                {/* Scrolling Track */}
                <div
                    ref={scrollRef}
                    className="carousel-track"
                    style={{
                        display: 'flex',
                        alignItems: 'center', // Align varying heights
                        gap: '80px', // Increased space
                        width: 'max-content', // Allow calculating full width
                        paddingLeft: '80px',
                        paddingRight: '80px'
                    }}
                >
                    {displayPartners.map((partner, index) => {
                        // Calculate dimensions based on size percentage
                        // Base size: 120px width x 60px height (approx 2:1 aspect ratio preserved)
                        const scale = (partner.size || 100) / 100;
                        const baseWidth = 120;
                        const width = Math.round(baseWidth * scale);
                        const height = Math.round(width * 0.5); // Maintain 2:1 container ratio

                        return (
                            <div
                                key={`${partner.id}-${index}`}
                                className="partner-logo-item"
                                style={{
                                    flexShrink: 0,
                                    width: `${width}px`,
                                    height: `${height}px`, // Adjusted height to match scale
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'filter 0.3s ease, opacity 0.3s ease, transform 0.3s ease',
                                    filter: 'grayscale(40%)',
                                    opacity: 0.75,
                                    position: 'relative'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.filter = 'grayscale(0%)';
                                    e.currentTarget.style.opacity = '1';
                                    e.currentTarget.style.transform = 'scale(1.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.filter = 'grayscale(40%)';
                                    e.currentTarget.style.opacity = '0.75';
                                    e.currentTarget.style.transform = 'scale(1)';
                                }}
                            >
                                <Image
                                    src={partner.logoUrl}
                                    alt={`Partner company logo`}
                                    fill
                                    style={{
                                        objectFit: 'contain',
                                        userSelect: 'none',
                                        pointerEvents: 'none'
                                    }}
                                    draggable={false}
                                    sizes={`${width}px`}
                                />
                            </div>
                        );
                    })}
                </div>

                {/* CSS Animation */}
                <style jsx>{`
                    @keyframes scroll {
                        0% {
                            transform: translateX(0);
                        }
                        100% {
                            transform: translateX(calc(-1 * var(--scroll-width, 100%)));
                        }
                    }
                    
                    .carousel-track {
                        animation: scroll 20s linear infinite; /* Fallback duration, JS overrides */
                        -webkit-overflow-scrolling: touch;
                        scroll-behavior: smooth;
                    }

                    .carousel-track:hover {
                        animation-play-state: paused;
                    }
                    
                    /* Responsive gap adjustments */
                    @media (max-width: 1024px) {
                        .carousel-track {
                            gap: 60px !important;
                            padding-left: 60px !important;
                            padding-right: 60px !important;
                        }
                    }
                    
                    @media (max-width: 768px) {
                        .carousel-track {
                            gap: 40px !important;
                            padding-left: 40px !important;
                            padding-right: 40px !important;
                        }
                    }
                    
                    @media (max-width: 480px) {
                        .carousel-track {
                            gap: 30px !important;
                            padding-left: 30px !important;
                            padding-right: 30px !important;
                        }
                    }
                    
                    section:focus, button:focus {
                        outline: none; /* Removed focus ring for cleaner UI */
                    }
                `}</style>
            </div>
        </section>
    );
}
