"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import { api } from '@/services/api';
import { useRouter } from 'next/navigation';

const QUESTIONS = [
    "You feel energized when you're around a group of people.",
    "I enjoy being the center of attention in a group.",
    "I prefer talking through my ideas with others rather than thinking alone.",
    "I seek out new people and experiences often.",
    "I get drained when I spend too much time alone.",
    "I find it easy to start conversations with strangers.",
    "I like working in teams rather than independently.",
    "I often express my thoughts out loud.",
    "I enjoy being in busy, active environments.",
    "I prefer quiet surroundings to focus deeply.",
    "I trust facts and real-world experience more than imagination.",
    "I focus on details rather than the big picture.",
    "I like step-by-step instructions over abstract theories.",
    "I enjoy experimenting and imagining new possibilities.",
    "I rely on my instincts more than evidence.",
    "I prefer practical solutions over creative ones.",
    "I notice small details others might miss.",
    "I often think about future possibilities rather than present realities.",
    "I like tasks with clear, measurable results.",
    "I often brainstorm multiple ideas before choosing one.",
    "I make decisions based on logic rather than emotion.",
    "I value fairness over personal relationships in the workplace.",
    "I try to maintain harmony even if I must compromise facts.",
    "I handle criticism objectively, not personally.",
    "I tend to analyze problems before reacting emotionally.",
    "I care deeply about others' feelings when making choices.",
    "I believe efficiency is more important than empathy at work.",
    "I prefer rational discussion to emotional debate.",
    "I make judgments quickly and decisively.",
    "I consider how my decisions affect others.",
    "I prefer to plan ahead rather than be spontaneous.",
    "I like keeping my workspace organized.",
    "I feel anxious when plans change suddenly.",
    "I enjoy flexible schedules with room for surprises.",
    "I make to-do lists regularly.",
    "I finish tasks before the deadline.",
    "I prefer knowing what's coming next.",
    "I like keeping options open until the last minute.",
    "I set clear goals and stick to them.",
    "I adapt easily when plans fall apart."
];

// Section labels for question groups
const SECTIONS = [
    { start: 0, end: 9, title: "Social Energy & Interaction" },
    { start: 10, end: 19, title: "Information Processing & Learning" },
    { start: 20, end: 29, title: "Decision Making Style" },
    { start: 30, end: 39, title: "Planning & Lifestyle" }
];

const PersonaTypeTest = () => {
    const router = useRouter();
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(false);
    const [reportUrl, setReportUrl] = useState(null);
    const [personaType, setPersonaType] = useState(null);

    const handleOptionChange = (questionIndex, value) => {
        setAnswers(prev => ({
            ...prev,
            [questionIndex]: value
        }));
    };

    const getProgress = () => {
        return Math.round((Object.keys(answers).length / QUESTIONS.length) * 100);
    };

    const handleSubmit = async () => {
        if (Object.keys(answers).length < QUESTIONS.length) {
            alert('Please answer all questions before submitting.');
            return;
        }

        setLoading(true);
        try {
            const response = await api.post('/courses/quizzes/submit-persona-type', {
                answers: Object.entries(answers).map(([idx, score]) => ({
                    order: parseInt(idx) + 1,
                    score: parseInt(score)
                }))
            });

            const url = response.reportUrl || response.data?.reportUrl;
            const type = response.personaType || response.data?.personaType;

            if (type) {
                setPersonaType(type);
            }

            if (url) {
                setReportUrl(url);
                // Auto-open the report
                const fullUrl = `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:3001'}${url}`;
                window.open(fullUrl, '_blank');
            } else {
                alert('Report generated successfully!');
            }
        } catch (error) {
            console.error("Submission failed:", error);
            alert(error.message || "Failed to submit test. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const getSectionForQuestion = (index) => {
        return SECTIONS.find(s => index >= s.start && index <= s.end);
    };

    if (reportUrl) {
        return (
            <div className="min-h-screen bg-[#eaf4fc] flex justify-center py-10 px-4 font-sans">
                <div className="bg-white max-w-5xl w-full rounded-[40px] shadow-xl overflow-hidden flex min-h-[600px] flex-col items-center justify-center p-8 text-center space-y-10">

                    <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
                        We've analyzed your responses and generated your detailed persona personality report.
                    </p>

                    {/* Result Card */}
                    <div className="bg-[#f0f7ff] rounded-3xl p-10 border border-blue-100 w-full max-w-md shadow-sm">
                        <p className="text-sm text-[#1a237e] font-bold uppercase tracking-widest mb-4">YOUR PERSONALITY TYPE</p>
                        <div className="inline-block bg-[#bbdefb] px-6 py-2 rounded-lg">
                            <p className="text-6xl font-black text-[#0d47a1] tracking-widest leading-none">
                                {personaType || '---'}
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

                    {/* Progress indicator */}
                    <div className="mb-0 flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full border-4 border-[#004880] flex items-center justify-center">
                            <span className="text-lg font-bold text-[#004880]">{getProgress()}%</span>
                        </div>
                        <span className="text-xs text-gray-500 mt-2">Progress</span>
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
                                className="object-contain"
                                loading="lazy"
                            />
                        </div>
                        <span className="text-[#004880] font-bold text-xl tracking-widest uppercase">
                            Margdarshak
                        </span>
                    </div>

                    <h1 className="text-2xl md:text-4xl font-extrabold text-[#004880] mb-4 text-center uppercase tracking-wide">
                        Persona Type Test
                    </h1>
                    <p className="text-center text-gray-600 mb-8 text-sm md:text-base">
                        Discover your MBTI personality type and ideal career paths
                    </p>

                    {/* Mobile Progress Bar */}
                    <div className="md:hidden mb-8">
                        <div className="flex justify-between text-xs text-gray-500 mb-2 font-medium">
                            <span>Progress</span>
                            <span>{Math.round((Object.keys(answers).length / QUESTIONS.length) * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                            <div
                                className="bg-[#004880] h-2 rounded-full transition-all duration-300"
                                style={{ width: `${getProgress()}%` }}
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        {QUESTIONS.map((question, index) => {
                            const section = getSectionForQuestion(index);
                            return (
                                <React.Fragment key={index}>
                                    <div className="bg-white p-5 md:p-8 rounded-2xl border border-blue-50 hover:shadow-lg transition-all duration-300">
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
                                </React.Fragment>
                            );
                        })}
                    </div>

                    <div className="mt-12 flex justify-center sticky bottom-8">
                        <Button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="bg-[#007edb] text-white px-8 py-4 rounded-full font-bold text-xl shadow-lg hover:bg-[#0060a0] transition-transform hover:scale-105"
                        >
                            {loading ? 'Analyzing Your Personality...' : 'Generate My Report'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PersonaTypeTest;
