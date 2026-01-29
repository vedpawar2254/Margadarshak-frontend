"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
    {
        id: 1,
        name: "Priya Sharma",
        location: "Jaipur, Rajasthan",
        role: "Class 12 Student",
        quote: "EduRise helped me score 95% in my boards! The tutors are amazing and always available to clear doubts. Being able to learn in Hindi made everything so much easier.",
        rating: 5,
    },
    {
        id: 2,
        name: "Rahul Kumar",
        location: "Patna, Bihar",
        role: "JEE Aspirant",
        quote: "The mentorship program changed my perspective. My mentor guided me through the entire JEE preparation process and helped me stay motivated.",
        rating: 5,
    },
    {
        id: 3,
        name: "Anjali Das",
        location: "Kolkata, West Bengal",
        role: "NEET Aspirant",
        quote: "I was struggling with Physics, but the visual learning modules here made it my favorite subject. The mock tests were very close to the actual exam pattern.",
        rating: 5,
    },
    {
        id: 4,
        name: "Vikram Singh",
        location: "Indore, MP",
        role: "Banking Aspirant",
        quote: "The flexible schedule allowed me to prepare for bank exams while working. The doubt clearing sessions are the best feature.",
        rating: 5,
    },
    {
        id: 5,
        name: "Sneha Gupta",
        location: "Lucknow, UP",
        role: "UPSC Aspirant",
        quote: "The daily current affairs updates and answer writing practice sessions were instrumental in my preparation journey.",
        rating: 5,
    }
];

const TestimonialsSection = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(1);

    // Update items per page based on window width
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setItemsPerPage(3);
            } else if (window.innerWidth >= 768) {
                setItemsPerPage(2);
            } else {
                setItemsPerPage(1);
            }
        };

        // Set initial value
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Auto-scroll logic
    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 5000);
        return () => clearInterval(interval);
    }, [currentIndex, itemsPerPage]);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) =>
            (prevIndex + 1) % (testimonials.length - (itemsPerPage - 1))
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? testimonials.length - itemsPerPage : prevIndex - 1
        );
    };

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    // Calculate total pages (dots)
    const totalDots = Math.max(0, testimonials.length - (itemsPerPage - 1));

    return (
        <section className="py-24 md:py-40 bg-[#f0f9ff] relative overflow-hidden">
            {/* Background gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#f0f9ff] to-white pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        What Our <span className="text-[#0f52ba]">Students Say</span>
                    </h2>
                    <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
                        Real stories from students and parents who transformed their learning journey
                    </p>
                </div>

                {/* Carousel */}
                <div className="relative px-0 md:px-8">
                    <div className="overflow-hidden pb-8">
                        <motion.div
                            className="flex"
                            animate={{ x: `-${currentIndex * (100 / itemsPerPage)}%` }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                            {testimonials.map((testimonial, idx) => (
                                <div
                                    key={testimonial.id}
                                    className={`flex-shrink-0 px-4 ${itemsPerPage === 3
                                            ? 'w-1/3'
                                            : itemsPerPage === 2
                                                ? 'w-1/2'
                                                : 'w-full'
                                        }`}
                                >
                                    <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 h-full flex flex-col relative">

                                        <div className="flex items-start gap-4 mb-6">
                                            {/* User Info - Icon removed */}
                                            <div className="pt-1">
                                                <h3 className="text-xl font-bold text-gray-900 leading-tight">
                                                    {testimonial.name}
                                                </h3>
                                                <p className="text-[#0f52ba] font-medium text-sm mt-0.5">
                                                    {testimonial.location}
                                                </p>
                                                <p className="text-gray-400 text-sm mt-0.5">
                                                    {testimonial.role}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Stars */}
                                        <div className="flex gap-1 mb-6 mt-2">
                                            {[...Array(testimonial.rating)].map((_, i) => (
                                                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-500" />
                                            ))}
                                        </div>

                                        {/* Quote Text */}
                                        <p className="text-gray-600 text-lg leading-relaxed font-normal">
                                            "{testimonial.quote}"
                                        </p>

                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Navigation Container at Bottom */}
                    <div className="flex items-center justify-between mt-4 px-4">
                        {/* Dots */}
                        <div className="flex gap-2">
                            {Array.from({ length: totalDots }).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={`transition-all duration-300 rounded-full h-2.5 ${currentIndex === index
                                            ? "w-8 bg-[#0f52ba]"
                                            : "w-2.5 bg-gray-300 hover:bg-gray-400"
                                        }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>

                        {/* Arrows */}
                        <div className="flex gap-3">
                            <button
                                onClick={prevSlide}
                                className="w-12 h-12 rounded-full bg-[#0f52ba] text-white flex items-center justify-center hover:bg-[#0a3d8c] transition-all duration-300 shadow-md"
                                aria-label="Previous testimonial"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                </svg>
                            </button>
                            <button
                                onClick={nextSlide}
                                className="w-12 h-12 rounded-full bg-[#0f52ba] text-white flex items-center justify-center hover:bg-[#0a3d8c] transition-all duration-300 shadow-md"
                                aria-label="Next testimonial"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;