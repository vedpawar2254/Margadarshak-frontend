'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';

export default function CoursesClient() {
    const { user, isAuthenticated } = useAuth();
    const [courses, setCourses] = useState([]);
    const [enrolledCourseIds, setEnrolledCourseIds] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLevel, setSelectedLevel] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [showMyCourses, setShowMyCourses] = useState(false);

    // FAQ Data
    const faqs = [
        {
            question: "How long does the MyPersona Test take?",
            answer: "The MyPersona Test typically takes about 30-45 minutes to complete. It's designed to be thorough yet efficient in analyzing your personality and career aptitude."
        },
        {
            question: "Are the test results scientifically validated?",
            answer: "Yes, our assessments are built on scientifically validated psychometric models and have been tested with thousands of students to ensure accuracy and reliability."
        },
        {
            question: "Can I retake the tests if my career evolves?",
            answer: "Absolutely! We recommend retaking the assessment every 6-12 months as your interests and skills develop. Your dashboard tracks your progress over time."
        },
        {
            question: "How does group mentoring work?",
            answer: "Group mentoring involves small cohorts of students with similar interests guided by an expert mentor. Sessions cover industry trends, doubt clearing, and collaborative learning."
        },
        {
            question: "Is personalized one-on-one mentoring available?",
            answer: "Yes, you can book dedicated 1-on-1 sessions with our mentors for personalized career guidance, resume reviews, and interview preparation."
        }
    ];

    const [openFaqIndex, setOpenFaqIndex] = useState(null);

    const toggleFaq = (index) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };

    // Fetch courses when filters change
    useEffect(() => {
        fetchCourses();
    }, [selectedLevel, selectedCategory]);

    // Fetch enrollments if user is logged in
    useEffect(() => {
        if (isAuthenticated && user?.id) {
            fetchUserEnrollments();
        }
    }, [isAuthenticated, user?.id]);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            let url = '/courses/published?limit=100';

            if (selectedLevel) url += `&level=${encodeURIComponent(selectedLevel)}`;
            if (selectedCategory) url += `&category=${encodeURIComponent(selectedCategory)}`;

            const response = await api.get(url);
            setCourses(response.data?.courses || []);
        } catch (err) {
            setCourses([]);
            console.error('Error fetching courses:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserEnrollments = async () => {
        try {
            // Fetch student enrollments
            // Endpoint: GET /api/v1/courses/students/:studentId/enrollments
            const response = await api.get(`/courses/students/${user.id}/enrollments`);

            if (response.success && response.data) {
                const ids = new Set(response.data.map(enrollment => enrollment.courseId));
                setEnrolledCourseIds(ids);
            }
        } catch (err) {
            console.error('Error fetching enrollments:', err);
        }
    };

    // Client-Side Filtering
    const filteredCourses = courses.filter(course => {
        // Filter by Search Query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            if (!course.title?.toLowerCase().startsWith(query)) return false;
        }

        // Filter by "My Courses"
        if (showMyCourses) {
            if (!isAuthenticated) return false; // Should not happen if UI is correct, but safety check
            if (!enrolledCourseIds.has(course.id)) return false;
        }

        return true;
    });

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="pt-16 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
                    Learn from the <span className="text-[#0c5696]">best</span>.
                </h1>
                <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-2">
                    Master high-demand skills with our structured paths and
                </p>
                <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
                    expert-led curriculum. <span className="text-[#0c5696] font-semibold cursor-pointer">Start your journey today.</span>
                </p>

                {/* Search Bar */}
                <div className="flex justify-center max-w-2xl mx-auto mb-8">
                    <div className="relative w-full sm:w-3/4 flex items-center shadow-sm rounded-full">
                        <div className="absolute left-4 text-gray-400 z-10">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="What do you want to learn?"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-32 py-3.5 rounded-full border border-gray-200 outline-none focus:ring-2 focus:ring-[#0c5696]/20 focus:border-[#0c5696] transition-all text-gray-700 bg-white"
                        />
                        <button
                            onClick={fetchCourses}
                            className="absolute right-1.5 top-1.5 bottom-1.5 bg-[#0c5696] hover:bg-[#0a4a82] text-white px-8 rounded-full font-semibold transition-colors shadow-sm"
                        >
                            Search
                        </button>
                    </div>
                </div>

                {/* Filters Row: Levels + My Courses */}
                <div className="flex flex-wrap gap-3 justify-center items-center">
                    {/* Level Filters */}
                    {['', 'Beginner', 'Intermediate', 'Advanced'].map((level) => (
                        <button
                            key={level}
                            onClick={() => {
                                setSelectedLevel(level);
                                // If clicking "All Levels", assuming user wants to see everything, so turn off "My Courses"
                                if (!level) setShowMyCourses(false);
                            }}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${selectedLevel === level && !showMyCourses
                                ? 'bg-[#0c5696] text-white shadow-md'
                                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            {level || 'All Courses'}
                        </button>
                    ))}

                    {/* My Courses Filter - Only visible when logged in */}
                    {isAuthenticated && (
                        <>
                            <div className="w-px h-8 bg-gray-200 mx-2 hidden sm:block"></div>
                            <button
                                onClick={() => setShowMyCourses(!showMyCourses)}
                                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${showMyCourses
                                    ? 'bg-[#0c5696] text-white shadow-md'
                                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                                </svg>
                                My Courses
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Courses Grid Background */}
            <div className="bg-[#eef2ff] py-16 px-4 sm:px-6 lg:px-8 min-h-[600px]">
                <div className="max-w-7xl mx-auto">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="w-12 h-12 border-4 border-blue-200 border-t-[#0c5696] rounded-full animate-spin"></div>
                        </div>
                    ) : filteredCourses.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-3xl shadow-sm max-w-2xl mx-auto">
                            <div className="text-6xl mb-4">📚</div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                {showMyCourses ? "You haven't enrolled in any courses yet" : "No courses found"}
                            </h3>
                            <p className="text-gray-500">
                                {showMyCourses
                                    ? "Browse our catalog to find your first course!"
                                    : searchQuery
                                        ? `No results starting with "${searchQuery}"`
                                        : "Try adjusting your filters to find what you're looking for."}
                            </p>
                            {showMyCourses && (
                                <button
                                    onClick={() => setShowMyCourses(false)}
                                    className="mt-6 px-6 py-2 bg-[#0c5696] text-white rounded-lg font-medium hover:bg-[#0a4a82] transition-colors"
                                >
                                    Browse All Courses
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredCourses.map((course) => (
                                <CourseCard
                                    key={course.id}
                                    course={course}
                                    isEnrolled={enrolledCourseIds.has(course.id)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row gap-16">
                        {/* FAQ Header */}
                        <div className="lg:w-1/3">
                            <h2 className="text-4xl font-bold text-[#1f2937] mb-8 leading-tight">
                                Frequently asked questions
                            </h2>
                            {/* Info Box */}
                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mt-8">
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm text-[#0c5696]">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Have more questions?</h3>
                                <p className="text-gray-500 text-sm mb-4 leading-relaxed">
                                    Can't find what you're looking for? feel free to reach out to us.
                                </p>
                                <a href="mailto:support@margdarshak.com" className="text-[#0c5696] font-semibold text-sm hover:underline">
                                    support@margdarshak.com
                                </a>
                            </div>
                        </div>

                        {/* FAQ Accordion & CTA */}
                        <div className="lg:w-2/3 flex flex-col gap-12">
                            {/* Accordion List */}
                            <div className="space-y-4">
                                {faqs.map((faq, index) => (
                                    <div
                                        key={index}
                                        className="border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 bg-white"
                                    >
                                        <button
                                            onClick={() => toggleFaq(index)}
                                            className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors focus:outline-none"
                                        >
                                            <span className="font-semibold text-gray-900 text-base pr-8">
                                                {faq.question}
                                            </span>
                                            <span className={`text-[#0c5696] transform transition-transform duration-300 ${openFaqIndex === index ? 'rotate-45' : ''}`}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                </svg>
                                            </span>
                                        </button>
                                        <div
                                            className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaqIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                                }`}
                                        >
                                            <div className="p-6 pt-0 text-gray-600 leading-relaxed">
                                                {faq.answer}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CourseCard({ course, isEnrolled }) {
    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.1)] transition-all duration-300 flex flex-col h-full border border-gray-100 group">
            {/* Image Container */}
            <div className="relative h-48 sm:h-52 bg-gray-100 overflow-hidden">
                <Image
                    src={course.coverImage || '/placeholder-course.png'}
                    alt={course.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Level Pill - Top Left */}
                {course.level && (
                    <div className="absolute top-4 left-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wide shadow-sm backdrop-blur-md ${course.level === 'Advanced' ? 'bg-blue-50/90 text-[#0c5696]' :
                            course.level === 'Intermediate' ? 'bg-amber-50/90 text-amber-700' :
                                'bg-green-50/90 text-green-700'
                            }`}>
                            {course.level}
                        </span>
                    </div>
                )}

                {/* Enrolled Badge - Top Right (Optional) */}
                {isEnrolled && (
                    <div className="absolute top-4 right-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wide shadow-sm backdrop-blur-md bg-white/90 text-[#0c5696] border border-[#0c5696]/20">
                            Enrolled
                        </span>
                    </div>
                )}
            </div>

            {/* Content Body */}
            <div className="p-6 flex flex-col flex-1">
                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 leading-tight group-hover:text-[#0c5696] transition-colors">
                    {course.title}
                </h3>

                {/* Description */}
                <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
                    {course.description}
                </p>

                {/* Meta / Spacer */}
                <div className="mt-auto pt-4 flex items-center justify-between text-xs text-gray-400 font-medium uppercase tracking-wider mb-6 border-t border-gray-50">
                    <span>{course._count?.modules || course.modules?.length || 0} Modules</span>
                    {course.duration && <span>{course.duration} Hours</span>}
                </div>

                {/* Action Button */}
                {isEnrolled ? (
                    <Link
                        href={`/courses/${course.id}/learn`}
                        className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-3 rounded-lg font-semibold transition-colors shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                    >
                        <span>Continue Learning</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                    </Link>
                ) : (
                    <Link
                        href={`/courses/${course.id}`}
                        className="block w-full bg-[#0c5696] hover:bg-[#0a4a82] text-white text-center py-3 rounded-lg font-semibold transition-colors shadow-sm hover:shadow-md"
                    >
                        Enroll Now
                    </Link>
                )}
            </div>
        </div>
    );
}
