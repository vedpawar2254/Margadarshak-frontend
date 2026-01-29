"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import { api } from '@/services/api';
import { useRouter } from 'next/navigation';

const QUESTIONS = [
    "I remember information better when it’s shown as pictures or diagrams.",
    "I prefer using charts, mind maps, and flowcharts to study.",
    "I find it easier to understand lessons with videos or visuals.",
    "I like using color codes or highlights in my notes.",
    "When I imagine something, I can see it clearly in my mind.",
    "I get distracted when I can’t see what the teacher is explaining.",
    "I remember lessons better when someone explains them aloud.",
    "I enjoy group discussions and explaining topics to others.",
    "I like reading my notes out loud when revising.",
    "I can easily recall information I’ve heard in class or videos.",
    "I learn better when I listen to lectures or podcasts.",
    "I prefer oral instructions over written ones.",
    "I prefer reading textbooks over watching videos.",
    "I like making detailed notes when I study.",
    "Written instructions are clearer to me than spoken ones.",
    "I learn better when I rewrite or summarize my notes.",
    "I enjoy doing written exercises or written tests.",
    "I often read extra material to understand topics better.",
    "I learn best when I can try things myself.",
    "I enjoy labs, experiments, or practical activities.",
    "I understand concepts better through real-life examples.",
    "I like moving around or doing something while studying.",
    "I find it hard to sit still for long while learning.",
    "I prefer learning through field trips, projects, or hands-on work.",
    "I easily remember what I’ve done physically, not just read."
];

// Map question index to section title if needed (based on user logic)
// Visual: 1-6, Auditory: 7-12, Read/Write: 13-19, Kinesthetic: 20-25

const LearningTypeTest = () => {
    const router = useRouter();
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(false);
    const [reportUrl, setReportUrl] = useState(null);

    const handleOptionChange = (questionIndex, value) => {
        setAnswers(prev => ({
            ...prev,
            [questionIndex]: value
        }));
    };

    const handleSubmit = async () => {
        if (Object.keys(answers).length < QUESTIONS.length) {
            alert('Please answer all questions before submitting.');
            return;
        }

        setLoading(true);
        try {
            const response = await api.post('/courses/quizzes/submit-learning-type', {
                answers: Object.entries(answers).map(([idx, score]) => ({
                    order: parseInt(idx) + 1,
                    score: parseInt(score)
                }))
            });

            // Check for reportUrl in response or nested in data
            const url = response.reportUrl || response.data?.reportUrl;

            if (url) {
                setReportUrl(url);
                // Auto-download the report
                const fullUrl = `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:3001'}${url}`;
                window.open(fullUrl, '_blank');
            } else {
                alert('Report generated successfully! Check your results.');
            }
        } catch (error) {
            console.error("Submission failed:", error);
            alert(error.message || "Failed to submit test. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (reportUrl) {
        return (
            <div className="min-h-screen bg-[#eaf4fc] flex justify-center py-10 px-4 font-sans">
                <div className="bg-white max-w-5xl w-full rounded-[40px] shadow-xl overflow-hidden flex min-h-[600px] flex-col items-center justify-center p-8 text-center space-y-10">

                    <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
                        We've analyzed your responses and generated your detailed learning style report.
                    </p>

                    {/* Result Card */}
                    <div className="bg-[#f0f7ff] rounded-3xl p-10 border border-blue-100 w-full max-w-md shadow-sm">
                        <p className="text-sm text-[#1a237e] font-bold uppercase tracking-widest mb-4">YOUR REPORT IS READY</p>
                        <div className="inline-block bg-[#bbdefb] px-6 py-2 rounded-lg">
                            <p className="text-2xl font-black text-[#0d47a1] tracking-wide">
                                Learning Style Analysis
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-6 pt-4 w-full justify-center">
                        <a
                            href={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:3001'}${reportUrl}`}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#2e7d32] text-white px-10 py-4 rounded-full font-bold text-lg shadow-md hover:bg-green-700 transition-transform hover:scale-105 flex items-center gap-3"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            Download Report
                        </a>
                        {/* <Button
                            onClick={() => router.push('/courses')}
                            className="bg-white text-black border border-gray-200 px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-50 transition-transform hover:scale-105 shadow-sm"
                        >
                            Go to Courses
                        </Button> */}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#eaf4fc] flex justify-center py-10 px-4 font-sans">
            <div className="bg-white max-w-5xl w-full rounded-[40px] shadow-xl overflow-hidden flex min-h-[800px]">
                {/* Sidebar */}
                <div className="hidden md:flex w-24 bg-white flex-col items-center py-8 border-r border-gray-100">
                    <div className="flex flex-col items-center gap-4 mb-auto">
                        <div className="relative w-[72px] h-[72px]">
                            <Image
                                src="/Mbluelogo.png"
                                alt="Margdarshak"
                                fill
                                className="object-contain"
                                loading="lazy"
                            />
                        </div>
                        <span className="text-[#004880] font-bold text-[40px] tracking-widest uppercase writing-vertical-rl" style={{ writingMode: 'vertical-rl' }}>
                            Margdarshak
                        </span>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-6 md:p-12 relative">
                    {/* Mobile Logo */}
                    <div className="md:hidden flex flex-col items-center justify-center mb-8 gap-2">
                        <div className="relative w-[72px] h-[72px]">
                            <Image
                                src="/Mbluelogo.png"
                                alt="Margdarshak"
                                fill
                                className="object-contain"
                                loading="lazy"
                            />
                        </div>
                        <span className="text-[#004880] font-bold text-xl tracking-widest uppercase">
                            Margdarshak
                        </span>
                    </div>

                    <h1 className="text-2xl md:text-4xl font-extrabold text-[#004880] mb-8 text-center uppercase tracking-wide">
                        Learning Type Test
                    </h1>

                    <div className="space-y-6">
                        {QUESTIONS.map((question, index) => (
                            <div key={index} className="bg-white p-5 md:p-8 rounded-2xl border border-blue-50 hover:shadow-lg transition-all duration-300">
                                <p className="text-[#1a1a1a] font-bold text-base md:text-lg mb-6">
                                    {index + 1}. {question}
                                </p>

                                {/* Rating Scale Container */}
                                <div className="mt-4">
                                    {/* Mobile Labels (Above) */}
                                    <div className="flex justify-between md:hidden text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-3 px-1">
                                        <span>Strongly Disagree</span>
                                        <span>Strongly Agree</span>
                                    </div>

                                    <div className="flex items-center justify-between md:gap-4 md:px-4">
                                        {/* Desktop Left Label */}
                                        <span className="hidden md:block text-gray-500 font-medium text-sm w-32 text-left">Strongly disagree</span>

                                        {/* Options */}
                                        <div className="flex justify-between w-full md:w-auto md:gap-6 bg-gray-50/50 md:bg-transparent p-2 md:p-0 rounded-xl">
                                            {[1, 2, 3, 4, 5].map((val) => (
                                                <button
                                                    key={val}
                                                    onClick={() => handleOptionChange(index, val)}
                                                    className={`group relative w-10 h-10 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center transition-all duration-200
                                                        ${answers[index] === val
                                                            ? 'border-[#004880] bg-[#004880] text-white shadow-md scale-110'
                                                            : 'border-gray-200 text-gray-400 hover:border-blue-300 hover:text-blue-500 bg-white'}`}
                                                >
                                                    <span className="text-sm font-bold">{val}</span>
                                                </button>
                                            ))}
                                        </div>

                                        {/* Desktop Right Label */}
                                        <span className="hidden md:block text-gray-500 font-medium text-sm w-32 text-right">Strongly agree</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 flex justify-center sticky bottom-8">
                        {reportUrl ? (
                            <a
                                href={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:3001'}${reportUrl}`}
                                download
                                className="bg-[#2e7d32] text-white px-8 py-4 rounded-full font-bold text-xl shadow-lg hover:bg-green-700 transition-transform hover:scale-105 flex items-center gap-2"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                Download Report
                            </a>
                        ) : (
                            <Button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="bg-[#007edb] text-white px-8 py-4 rounded-full font-bold text-xl shadow-lg hover:bg-[#0060a0] transition-transform hover:scale-105"
                            >
                                {loading ? 'Analyzing...' : 'Generate My Report'}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LearningTypeTest;
