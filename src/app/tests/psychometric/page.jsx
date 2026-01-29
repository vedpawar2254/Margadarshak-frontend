"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { api } from '@/services/api';
import Button from '@/components/ui/Button';

const PsychometricTestPage = () => {
    const router = useRouter();
    const [answers, setAnswers] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    // Questions provided by user
    const SECTIONS = [
        {
            title: "Realistic (Doers)",
            questions: [
                { id: 1, text: "I enjoy working with tools, machines, or physical tasks." },
                { id: 2, text: "I like fixing, building, or assembling things." },
                { id: 3, text: "I prefer outdoor or hands-on work over desk jobs." },
                { id: 4, text: "I like solving practical problems or using equipment." }
            ]
        },
        {
            title: "Investigative (Thinkers)",
            questions: [
                { id: 5, text: "I enjoy solving puzzles, experiments, or research questions." },
                { id: 6, text: "I like science, math, or logical problem-solving." },
                { id: 7, text: "I prefer analyzing data or understanding how things work." },
                { id: 8, text: "I often think about new ideas, discoveries, or innovations." }
            ]
        },
        {
            title: "Artistic (Creators)",
            questions: [
                { id: 9, text: "I love expressing myself through art, writing, or design." },
                { id: 10, text: "I prefer open-ended, creative tasks to routine work." },
                { id: 11, text: "I enjoy music, drawing, or performing arts." },
                { id: 12, text: "I like coming up with new ideas or designs." }
            ]
        },
        {
            title: "Social (Helpers)",
            questions: [
                { id: 13, text: "I enjoy helping others solve problems or feel better." },
                { id: 14, text: "I like working in teams or group projects." },
                { id: 15, text: "People say I’m empathetic and a good listener." },
                { id: 16, text: "I like teaching, guiding, or motivating others." }
            ]
        },
        {
            title: "Enterprising (Leaders)",
            questions: [
                { id: 17, text: "I like taking charge and influencing people." },
                { id: 18, text: "I enjoy debating or presenting ideas." },
                { id: 19, text: "I’m confident in convincing or motivating others." },
                { id: 20, text: "I prefer leadership or business-related challenges." }
            ]
        },
        {
            title: "Conventional (Organizers)",
            questions: [
                { id: 21, text: "I’m organized and like structured tasks." },
                { id: 22, text: "I enjoy working with numbers, data, or accounts." },
                { id: 23, text: "I follow rules, deadlines, and instructions carefully." },
                { id: 24, text: "I prefer planning and managing records over unpredictable work." }
            ]
        }
    ];

    const handleOptionSelect = (qId, value) => {
        setAnswers(prev => ({
            ...prev,
            [qId]: value
        }));
    };

    const handleSubmit = async () => {
        const totalQuestions = 24;
        if (Object.keys(answers).length < totalQuestions) {
            alert('Please answer all questions before submitting.');
            return;
        }

        try {
            setSubmitting(true);
            setError(null);

            const payload = {
                answers: Object.entries(answers).map(([order, score]) => ({
                    order: parseInt(order),
                    score: parseInt(score)
                }))
            };

            const response = await api.post('/courses/quizzes/submit-psychometric-test', payload);

            if (response.success) {
                setResult(response.data);
                if (response.reportUrl) {
                    const fullUrl = `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:3001'}${response.reportUrl}`;
                    window.open(fullUrl, '_blank');
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                setError(response.message || 'Failed to submit test');
                alert(response.message || 'Failed to submit test');
            }
        } catch (err) {
            setError(err.message || 'An error occurred. Please try again.');
            alert(err.message || 'An error occurred. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (result) {
        return (
            <div className="min-h-screen bg-[#eaf4fc] flex justify-center py-10 px-4 font-sans">
                <div className="bg-white max-w-5xl w-full rounded-[40px] shadow-xl overflow-hidden flex min-h-[600px] flex-col items-center justify-center p-8 text-center space-y-10">

                    <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
                        We've analyzed your responses and generated your detailed career personality report.
                    </p>

                    {/* Holland Code Card */}
                    <div className="bg-[#f0f7ff] rounded-3xl p-10 border border-blue-100 w-full max-w-md shadow-sm">
                        <p className="text-sm text-[#1a237e] font-bold uppercase tracking-widest mb-4">YOUR HOLLAND CODE</p>
                        <div className="inline-block bg-[#bbdefb] px-6 py-2 rounded-lg">
                            <p className="text-6xl font-black text-[#0d47a1] tracking-widest leading-none">
                                {result.psychometricResult?.hollandCode || '---'}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-6 pt-4 w-full justify-center">
                        <a
                            href={result.reportUrl ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:3001'}${result.reportUrl}` : '#'}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#2e7d32] text-white px-10 py-4 rounded-full font-bold text-lg shadow-md hover:bg-green-700 transition-transform hover:scale-105 flex items-center gap-3"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            Download Report
                        </a>
                        <Button
                            onClick={() => router.push('/courses')}
                            className="bg-white text-black border border-gray-200 px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-50 transition-transform hover:scale-105 shadow-sm"
                        >
                            Go to Courses
                        </Button>
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
                        <span className="text-[#004880] font-bold text-xl tracking-widest uppercase writing-vertical-rl" style={{ writingMode: 'vertical-rl' }}>
                            Margdarshak
                        </span>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-6 md:p-12 relative">
                    {/* Mobile Logo */}
                    <div className="md:hidden flex flex-col items-center justify-center mb-8 gap-2">
                        <div className="relative w-32 h-10">
                            <Image
                                src="/Mbluelogo.png"
                                alt="Margdarshak"
                                fill
                                className="object-contain" // kept original styling
                                loading="lazy"
                            />
                        </div>
                        <span className="text-[#004880] font-bold text-xl tracking-widest uppercase">
                            Margdarshak
                        </span>
                    </div>

                    <h1 className="text-2xl md:text-4xl font-extrabold text-[#004880] mb-4 text-center uppercase tracking-wide">
                        Psychometric Assessment
                    </h1>
                    <p className="text-center text-gray-500 mb-10 max-w-2xl mx-auto text-sm md:text-base">
                        This test helps identify your personality type and career interests based on the RIASEC model.
                        Rate each statement honestly.
                    </p>

                    <div className="space-y-12">
                        {SECTIONS.map((section, sIdx) => (
                            <div key={sIdx} className="space-y-6">
                                <h3 className="text-lg md:text-xl font-bold text-[#004880] border-b pb-2">{section.title}</h3>
                                {section.questions.map((q) => (
                                    <div key={q.id} className="bg-white p-5 md:p-8 rounded-2xl border border-blue-50 hover:shadow-lg transition-all duration-300">
                                        <p className="text-[#1a1a1a] font-bold text-base md:text-lg mb-6">
                                            {q.id}. {q.text}
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
                                                            onClick={() => handleOptionSelect(q.id, val)}
                                                            className={`group relative w-10 h-10 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center transition-all duration-200
                                                                ${answers[q.id] === val
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
                        ))}
                    </div>

                    <div className="mt-12 flex justify-center sticky bottom-8">
                        <Button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="bg-[#007edb] text-white px-8 py-4 rounded-full font-bold text-xl shadow-lg hover:bg-[#0060a0] transition-transform hover:scale-105"
                        >
                            {submitting ? 'Analyzing...' : 'Submit Assessment'}
                        </Button>
                    </div>
                    {/* Bottom spacer */}
                    <div className="h-12" />
                </div>
            </div>
        </div>
    );
};

export default PsychometricTestPage;
