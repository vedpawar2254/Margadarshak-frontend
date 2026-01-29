'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';

export default function QuizPage() {
    const params = useParams();
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [result, setResult] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (params.moduleId && user) {
            fetchQuiz();
        }
    }, [params.moduleId, user]);

    const fetchQuiz = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.get(`/courses/quizzes?moduleId=${params.moduleId}`);

            let quizzes = [];
            if (Array.isArray(response)) {
                quizzes = response;
            } else if (Array.isArray(response.data)) {
                quizzes = response.data;
            } else if (response.data && Array.isArray(response.data.data)) {
                quizzes = response.data.data;
            }

            if (quizzes.length === 0) {
                setError('No quiz has been created for this module yet.');
                setLoading(false);
                return;
            }

            const quizWithQuestions = await api.get(`/courses/quizzes/${quizzes[0].id}`);
            const quizData = quizWithQuestions.data || quizWithQuestions;

            if (!quizData) {
                setError('Quiz data could not be loaded.');
                setLoading(false);
                return;
            }

            if (!quizData.quizQuestions || quizData.quizQuestions.length === 0) {
                setError('This quiz has no questions yet.');
                setLoading(false);
                return;
            }

            setQuiz(quizData);
        } catch (err) {
            console.error('Error fetching quiz:', err);
            if (err.message?.includes('404') || err.message?.includes('not found')) {
                setError('Quiz not found. Please ensure a quiz has been created for this module.');
            } else {
                setError(err.message || 'Failed to load quiz');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerChange = (questionId, optionId, isMultiple) => {
        if (isMultiple) {
            setAnswers(prev => {
                const current = prev[questionId] || [];
                if (current.includes(optionId)) {
                    return { ...prev, [questionId]: current.filter(id => id !== optionId) };
                } else {
                    return { ...prev, [questionId]: [...current, optionId] };
                }
            });
        } else {
            setAnswers(prev => ({ ...prev, [questionId]: [optionId] }));
        }
    };

    const handleSubmit = async () => {
        if (submitting) return;

        const unanswered = quiz.quizQuestions?.filter(q => !answers[q.id] || answers[q.id].length === 0);
        if (unanswered?.length > 0) {
            alert(`Please answer all questions. ${unanswered.length} question(s) remaining.`);
            return;
        }

        try {
            setSubmitting(true);

            // Send answers to backend for calculation
            const response = await api.post(`/courses/quizzes/${quiz.id}/results`, {
                answers: answers,
                score: 0, // Backend ignores this now
                totalPoints: 0,
                maxPoints: 0
            });

            // Update module progress
            await api.patch(`/courses/modules/${params.moduleId}/progress`, {
                isQuizCompleted: true,
                quizScore: response.data?.latestScore || 0
            });

            const responseData = response.data || response;

            setResult({
                score: Math.round(responseData.latestScore),
                correctCount: responseData.totalPoints, // Assuming backend sends this
                totalQuestions: responseData.maxPoints,
                passed: responseData.latestScore >= (quiz.passingScore || 70),
                reviewData: responseData.reviewData || []
            });
            setSubmitted(true);
        } catch (err) {
            alert('Error submitting quiz: ' + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleReattempt = async () => {
        if (!confirm('Are you sure you want to reattempt? Your previous attempt will be cleared.')) return;

        try {
            setSubmitting(true);
            await api.post(`/courses/quizzes/${quiz.id}/reattempt`);

            // Reset UI
            setSubmitted(false);
            setResult(null);
            setAnswers({}); // Clear selected answers
            window.scrollTo(0, 0); // Scroll to top
        } catch (err) {
            alert('Failed to start reattempt: ' + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading || authLoading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f3f4f6'
            }}>
                <div style={{
                    width: '48px',
                    height: '48px',
                    border: '4px solid #e5e7eb',
                    borderTop: '4px solid #3b82f6',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }} />
                <style jsx>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    if (error || !quiz) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f3f4f6'
            }}>
                <p style={{ fontSize: '48px', marginBottom: '16px' }}>📝</p>
                <h2 style={{ fontSize: '24px', color: '#1f2937', marginBottom: '8px' }}>
                    Quiz not found
                </h2>
                <p style={{ color: '#6b7280', marginBottom: '24px' }}>
                    {error || 'No quiz available for this module.'}
                </p>
                <Link
                    href={`/courses/${params.courseId}/learn`}
                    style={{
                        background: '#3b82f6',
                        color: 'white',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontWeight: '600'
                    }}
                >
                    Back to Course
                </Link>
            </div>
        );
    }

    // Submitted - Show Results & Review
    if (submitted && result) {
        return (
            <div style={{
                minHeight: '100vh',
                background: '#f3f4f6',
                padding: '40px 20px'
            }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>

                    {/* Score Card */}
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        padding: '48px',
                        textAlign: 'center',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        marginBottom: '32px'
                    }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            margin: '0 auto 24px',
                            borderRadius: '50%',
                            background: result.passed ? '#d1fae5' : '#fee2e2',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '40px'
                        }}>
                            {result.passed ? '🎉' : '😔'}
                        </div>

                        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1f2937', marginBottom: '8px' }}>
                            {result.passed ? 'Congratulations!' : 'Keep Trying!'}
                        </h1>
                        <p style={{ color: '#6b7280', marginBottom: '32px' }}>
                            {result.passed ? 'You have successfully completed this quiz.' : `You need ${quiz.passingScore || 70}% to pass.`}
                        </p>

                        <div style={{
                            width: '160px', height: '160px', margin: '0 auto 32px', borderRadius: '50%',
                            background: `conic-gradient(${result.passed ? '#10b981' : '#ef4444'} ${result.score * 3.6}deg, #e5e7eb ${result.score * 3.6}deg)`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <div style={{ width: '130px', height: '130px', borderRadius: '50%', background: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ fontSize: '36px', fontWeight: '700', color: result.passed ? '#10b981' : '#ef4444' }}>{result.score}%</span>
                                <span style={{ fontSize: '14px', color: '#6b7280' }}>Score</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '32px' }}>
                            <div>
                                <p style={{ fontSize: '24px', fontWeight: '700', color: '#10b981' }}>{result.correctCount}</p>
                                <p style={{ fontSize: '12px', color: '#6b7280' }}>Correct</p>
                            </div>
                            <div style={{ width: '1px', background: '#e5e7eb' }} />
                            <div>
                                <p style={{ fontSize: '24px', fontWeight: '700', color: '#ef4444' }}>{result.totalQuestions - result.correctCount}</p>
                                <p style={{ fontSize: '12px', color: '#6b7280' }}>Wrong</p>
                            </div>
                            <div style={{ width: '1px', background: '#e5e7eb' }} />
                            <div>
                                <p style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>{result.totalQuestions}</p>
                                <p style={{ fontSize: '12px', color: '#6b7280' }}>Total</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                            <Link href={`/courses/${params.courseId}/learn`} style={{ padding: '14px 28px', background: '#3b82f6', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: '600' }}>
                                Continue Course
                            </Link>
                            {!result.passed && (
                                <button onClick={handleReattempt} style={{ padding: '14px 28px', background: '#f3f4f6', color: '#1f2937', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
                                    Reattempt Quiz
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Answer Review Section */}
                    {result.reviewData && result.reviewData.length > 0 && (
                        <div>
                            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', marginBottom: '24px' }}>Answer Review</h2>
                            {quiz.quizQuestions?.map((question, qIndex) => {
                                const questionReview = result.reviewData.find(r => r.questionId === question.id);
                                const isCorrectAnswer = questionReview?.isCorrect;

                                return (
                                    <div key={question.id} style={{ background: 'white', borderRadius: '12px', padding: '24px', marginBottom: '16px', borderLeft: `6px solid ${isCorrectAnswer ? '#10b981' : '#ef4444'}` }}>
                                        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                                            <span style={{ width: '32px', height: '32px', background: isCorrectAnswer ? '#10b981' : '#ef4444', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', flexShrink: 0 }}>
                                                {qIndex + 1}
                                            </span>
                                            <div>
                                                <p style={{ fontSize: '16px', fontWeight: '500', color: '#1f2937', lineHeight: '1.5' }}>
                                                    {question.questionText}
                                                </p>
                                                {!isCorrectAnswer && <p style={{ color: '#ef4444', fontSize: '14px', marginTop: '4px', fontWeight: '600' }}>❌ Incorrect Answer</p>}
                                                {isCorrectAnswer && <p style={{ color: '#10b981', fontSize: '14px', marginTop: '4px', fontWeight: '600' }}>✅ Correct Answer</p>}
                                            </div>
                                        </div>

                                        <div style={{ display: 'grid', gap: '12px', marginLeft: '44px' }}>
                                            {question.options?.map((option, oIndex) => {
                                                const isSelected = questionReview?.selectedOptionIds?.includes(option.id);
                                                const isCorrectOption = questionReview?.correctOptionIds?.includes(option.id);

                                                let bg = 'white';
                                                let border = '#e5e7eb';

                                                if (isCorrectOption) {
                                                    bg = '#d1fae5'; // Green bg for correct option
                                                    border = '#10b981';
                                                } else if (isSelected && !isCorrectOption) {
                                                    bg = '#fee2e2'; // Red bg for wrong selection
                                                    border = '#ef4444';
                                                }

                                                return (
                                                    <div key={option.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', borderRadius: '8px', border: `2px solid ${border}`, background: bg }}>
                                                        <span style={{ width: '24px', height: '24px', background: 'white', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', fontSize: '12px', color: '#6b7280', border: '1px solid #e5e7eb' }}>
                                                            {String.fromCharCode(65 + oIndex)}
                                                        </span>
                                                        <span style={{ color: '#1f2937', flex: 1 }}>{option.optionText}</span>
                                                        {isCorrectOption && <span style={{ color: '#10b981', fontWeight: '600', fontSize: '14px' }}>Correct Answer</span>}
                                                        {isSelected && !isCorrectOption && <span style={{ color: '#ef4444', fontWeight: '600', fontSize: '14px' }}>Your Answer</span>}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                </div>
            </div>
        );
    }

    // Quiz Questions (Default View)
    return (
        <div style={{
            minHeight: '100vh',
            background: '#f3f4f6',
            padding: '40px 20px'
        }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ background: 'white', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div>
                            <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', marginBottom: '8px' }}>
                                {quiz.title || 'Module Quiz'}
                            </h1>
                            <p style={{ color: '#6b7280' }}>
                                {quiz.quizQuestions?.length || 0} questions • Passing score: {quiz.passingScore || 70}%
                            </p>
                        </div>
                        <Link href={`/courses/${params.courseId}/learn`} style={{ color: '#6b7280', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            ✕ Exit Quiz
                        </Link>
                    </div>
                </div>

                {quiz.quizQuestions?.map((question, qIndex) => {
                    const isMultiple = question.questionType === 'MULTIPLE_CORRECT';
                    const selectedOptions = answers[question.id] || [];

                    return (
                        <div key={question.id} style={{ background: 'white', borderRadius: '12px', padding: '24px', marginBottom: '16px' }}>
                            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                                <span style={{ width: '32px', height: '32px', background: '#3b82f6', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', flexShrink: 0 }}>
                                    {qIndex + 1}
                                </span>
                                <div>
                                    <p style={{ fontSize: '16px', fontWeight: '500', color: '#1f2937', lineHeight: '1.5' }}>
                                        {question.questionText}
                                    </p>
                                    {isMultiple && <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Select all that apply</p>}
                                </div>
                            </div>
                            <div style={{ display: 'grid', gap: '12px', marginLeft: '44px' }}>
                                {question.options?.map((option, oIndex) => {
                                    const isSelected = selectedOptions.includes(option.id);
                                    return (
                                        <label key={option.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', borderRadius: '8px', border: `2px solid ${isSelected ? '#3b82f6' : '#e5e7eb'}`, background: isSelected ? '#eff6ff' : 'white', cursor: 'pointer', transition: 'all 0.2s ease' }}>
                                            <input type={isMultiple ? 'checkbox' : 'radio'} name={`question-${question.id}`} checked={isSelected} onChange={() => handleAnswerChange(question.id, option.id, isMultiple)} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
                                            <span style={{ width: '24px', height: '24px', background: '#f3f4f6', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', fontSize: '12px', color: '#6b7280' }}>
                                                {String.fromCharCode(65 + oIndex)}
                                            </span>
                                            <span style={{ color: '#1f2937' }}>{option.optionText}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}

                <div style={{ background: 'white', borderRadius: '12px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ color: '#6b7280' }}>
                        {Object.keys(answers).length} of {quiz.quizQuestions?.length || 0} questions answered
                    </p>
                    <button onClick={handleSubmit} disabled={submitting} style={{ padding: '14px 48px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1 }}>
                        {submitting ? 'Submitting...' : 'Submit Quiz'}
                    </button>
                </div>
            </div>
        </div>
    );
}
