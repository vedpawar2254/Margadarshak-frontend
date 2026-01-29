"use client";
import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useAnimate, useMotionValueEvent, animate } from 'framer-motion';
import Image from 'next/image';

const successStories = [
    {
        id: 1,
        name: "Neha Malhotra",
        role: "MBA Student",
        university: "Ahmedabad University",
        quote: "Thanks to Margdarshak's assessments, I discovered my strengths and interests. The guidance I received was spot-on!",
        image: "/images/mentors/mentor-test-image1.png"
    },
    {
        id: 2,
        name: "Rahul Sharma",
        role: "Software Engineer",
        university: "Accenture",
        quote: "The personalized mentoring sessions helped me gain clarity and confidence in choosing the right career path.",
        image: "/images/mentors/mentor-test-image2.png"
    },
    {
        id: 3,
        name: "Priya Verma",
        role: "Marketing Analyst",
        university: "Tata Consultancy Services",
        quote: "I was unsure about my future after graduation, but Margdarshak's career counseling set me on the right track to success.",
        image: "/images/mentors/mentor-test-image1.png"
    }
];

const SuccessStoriesSection = () => {
    // Duplicate items to create infinite effect (Buffer: 3 sets)
    const items = [...successStories, ...successStories, ...successStories];
    const [scope, animateScope] = useAnimate();
    const x = useMotionValue(0);
    const [containerWidth, setContainerWidth] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(3);
    const dragging = useRef(false);

    // Responsive Logic
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width >= 1024) {
                setItemsPerPage(3);
            } else if (width >= 768) {
                setItemsPerPage(2);
            } else {
                setItemsPerPage(1);
            }
            // Update container width for calculations
            const el = document.querySelector('.carousel-container');
            if (el) setContainerWidth(el.offsetWidth);
        };

        handleResize(); // Init
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // ONE SET WIDTH (Pixel Value)
    // The total width of the track is (items.length / itemsPerPage) * containerWidth.
    // One set (successStories.length items) width is:
    // (successStories.length / itemsPerPage) * containerWidth
    const getOneSetWidth = () => {
        if (!containerWidth) return 0;
        return (successStories.length / itemsPerPage) * containerWidth;
    }

    // Effect to reset x when it reaches boundaries (Infinite Loop)
    useMotionValueEvent(x, "change", (latest) => {
        const oneSetWidth = getOneSetWidth();
        if (!oneSetWidth || dragging.current) return;

        if (latest <= -oneSetWidth * 2) {
            // If scrolled past 2 sets, jump back to 1 set
            x.set(latest + oneSetWidth);
        } else if (latest >= -0.01) { // Close to 0
            // If scrolled past 0 (start), jump forward to 1 set
            x.set(latest - oneSetWidth);
        }
    });

    // Initialize X to show the first set (offset 0 is fine if we start with set 1, 
    // but usually infinite loop starts in middle set to allow bi-directional scroll immediately).
    // Let's start at -oneSetWidth.
    useEffect(() => {
        if (containerWidth && x.get() === 0) {
            const oneSetWidth = getOneSetWidth();
            if (oneSetWidth) x.set(-oneSetWidth);
        }
    }, [containerWidth]);


    const slide = (direction) => {
        const oneItemWidth = containerWidth / itemsPerPage;
        const currentX = x.get();
        // Snap to nearest item
        // Target: currentX +/- oneItemWidth
        // But better to round to nearest item to avoid drift
        const targetX = direction === 'next'
            ? Math.round(currentX / oneItemWidth) * oneItemWidth - oneItemWidth
            : Math.round(currentX / oneItemWidth) * oneItemWidth + oneItemWidth;

        animateScope(x, targetX, { duration: 0.5, ease: "easeOut" });
    };

    return (
        <section className="py-24 bg-white overflow-hidden select-none">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                        Success Stories
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
                        <span className="font-bold text-gray-800">Margdarshak</span> has empowered countless students to achieve their career dreams through personalized mentoring and assessments. Here are some <span className="font-bold text-gray-800">of our top</span> success stories from our learners:
                    </p>
                </div>

                {/* Carousel Container */}
                <div className="group relative">
                    {/* BUTTONS - Visible on Group Hover */}
                    <button
                        onClick={() => slide('prev')}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-[#0f52ba] hover:bg-[#0f52ba] hover:text-white transition-all opacity-0 group-hover:opacity-100 -ml-4 md:-ml-8"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                    </button>
                    <button
                        onClick={() => slide('next')}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-[#0f52ba] hover:bg-[#0f52ba] hover:text-white transition-all opacity-0 group-hover:opacity-100 -mr-4 md:-mr-8"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                    </button>

                    <div className="carousel-container overflow-hidden cursor-grab active:cursor-grabbing">
                        <motion.div
                            ref={scope}
                            className="flex"
                            style={{ x }}
                            drag="x"
                            dragConstraints={{ left: -10000, right: 10000 }}
                            onDragStart={() => dragging.current = true}
                            onDragEnd={() => dragging.current = false}
                        >
                            {items.map((story, index) => (
                                <div
                                    key={`${story.id}-${index}`}
                                    className="px-4 box-border flex-shrink-0"
                                    style={{ width: `${100 / itemsPerPage}%` }}
                                >
                                    <div className="bg-white rounded-xl border border-gray-100 p-8 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300 h-full">
                                        {/* Avatar */}
                                        <div className="w-24 h-24 rounded-full overflow-hidden mb-6 border-4 border-white shadow-sm flex-shrink-0 pointer-events-none">
                                            <Image
                                                src={story.image}
                                                alt={story.name}
                                                width={96}
                                                height={96}
                                                className="object-cover w-full h-full"
                                            />
                                        </div>

                                        {/* Quote Icon */}
                                        <div className="mb-4 flex-shrink-0 pointer-events-none">
                                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M14.017 21L14.017 18C14.017 16.8954 14.8738 16 15.9306 16H19.0069C19.4673 16 19.9277 15.6328 19.9277 15.147C19.9277 14.8817 19.6826 14.6667 19.3762 14.6667H16.035C14.3649 14.6667 13.0105 13.4143 13.0105 11.8714V6.87143C13.0105 5.32857 14.3649 4.07619 16.035 4.07619H19.5699C21.2401 4.07619 22.5945 5.32857 22.5945 6.87143V11.2381C22.5945 16.6381 18.7505 21 14.017 21ZM5.00652 21L5.00652 18C5.00652 16.8954 5.86337 16 6.92015 16H9.99645C10.4568 16 10.9172 15.6328 10.9172 15.147C10.9172 14.8817 10.6721 14.6667 10.3657 14.6667H7.02452C5.35436 14.6667 4 13.4143 4 11.8714V6.87143C4 5.32857 5.35436 4.07619 7.02452 4.07619H10.5594C12.2296 4.07619 13.584 5.32857 13.584 6.87143V11.2381C13.584 16.6381 9.73996 21 5.00652 21Z" fill="#3B82F6" opacity="0.6" />
                                            </svg>
                                        </div>

                                        {/* Quote Text */}
                                        <p className="text-gray-600 mb-8 leading-relaxed text-sm md:text-base flex-grow pointer-events-none">
                                            "{story.quote}"
                                        </p>

                                        {/* Info */}
                                        <div className="mt-auto pointer-events-none">
                                            <h4 className="text-[#0f52ba] font-bold text-lg mb-1">{story.name}</h4>
                                            <p className="text-gray-600 text-sm font-medium">{story.role}</p>
                                            <p className="text-gray-500 text-xs">{story.university}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SuccessStoriesSection;
