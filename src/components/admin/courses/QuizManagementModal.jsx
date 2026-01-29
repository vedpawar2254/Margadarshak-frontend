"use client";

import { useState, useEffect } from 'react';
import { api } from '@/services/api';

export default function QuizManagementModal({ moduleId, isOpen, onClose, moduleTitle }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Quiz State
    const [quiz, setQuiz] = useState(null);
    const [questions, setQuestions] = useState([]);

    // UI State
    const [activeTab, setActiveTab] = useState('settings'); // settings, questions
    const [editingQuestion, setEditingQuestion] = useState(null); // null = list mode, object = edit mode

    useEffect(() => {
        if (isOpen && moduleId) {
            fetchQuizData();
        }
    }, [isOpen, moduleId]);

    const fetchQuizData = async () => {
        try {
            setLoading(true);
            setError(null);

            // First check if quiz exists for this module
            // We can fetch all quizzes and filter, or if there's a direct endpoint
            // Based on API list: GET /quizzes/modules/:moduleId isn't explicit but GET /courses/:courseId/modules includes quizzes
            // Let's try to get module details first which usually includes quizzes

            const response = await api.get(`/courses/modules/${moduleId}`);
            const moduleData = response.data;

            if (moduleData.quizzes && moduleData.quizzes.length > 0) {
                setQuiz(moduleData.quizzes[0]);
                await fetchQuestions(moduleData.quizzes[0].id);
            } else {
                setQuiz(null); // No quiz exists yet
                setQuestions([]);
            }
        } catch (err) {
            console.error('Error fetching quiz:', err);
            setError('Failed to load quiz data');
        } finally {
            setLoading(false);
        }
    };

    const fetchQuestions = async (quizId) => {
        try {
            const res = await api.get(`/quizzes/${quizId}/questions`);
            const qs = res.data || [];
            // Sort by order
            qs.sort((a, b) => a.order - b.order);
            setQuestions(qs);
        } catch (err) {
            console.error('Failed to load questions:', err);
        }
    };

    const createQuiz = async () => {
        try {
            setLoading(true);
            const res = await api.post('/quizzes', {
                moduleId,
                title: `${moduleTitle} Quiz`,
                totalQuestions: 0,
                passingScore: 75
            });
            setQuiz(res.data);
            setSuccess('Quiz created! You can now add questions.');
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError(err.message || 'Failed to create quiz');
        } finally {
            setLoading(false);
        }
    };

    const updateQuizSettings = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const formData = new FormData(e.target);
            const data = {
                title: formData.get('title'),
                description: formData.get('description'),
                timeLimit: parseInt(formData.get('timeLimit')) || null,
                passingScore: parseFloat(formData.get('passingScore'))
            };

            await api.put(`/quizzes/${quiz.id}`, data);
            setSuccess('Quiz settings updated!');
            setTimeout(() => setSuccess(null), 3000);

            // Refresh quiz data
            const res = await api.get(`/quizzes/${quiz.id}`);
            setQuiz(res.data);
        } catch (err) {
            setError(err.message || 'Failed to update settings');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div style={{
                background: 'white',
                width: '90%',
                maxWidth: '800px',
                height: '85vh',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
            }}>
                {/* Header */}
                <div style={{
                    padding: '20px',
                    borderBottom: '1px solid #e5e7eb',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: '#f9fafb'
                }}>
                    <h2 style={{ margin: 0, fontSize: '20px', color: '#111827' }}>
                        Manage Quiz: <span style={{ color: '#6b7280', fontSize: '16px' }}>{moduleTitle}</span>
                    </h2>
                    <button onClick={onClose} style={{ border: 'none', background: 'none', fontSize: '24px', cursor: 'pointer' }}>×</button>
                </div>

                {/* Content */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
                    {loading && !quiz ? (
                        <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
                    ) : !quiz ? (
                        <div style={{ textAlign: 'center', padding: '60px' }}>
                            <p style={{ fontSize: '18px', marginBottom: '20px', color: '#4b5563' }}>
                                This module doesn't have a quiz yet.
                            </p>
                            <button
                                onClick={createQuiz}
                                disabled={loading}
                                style={{
                                    padding: '12px 24px',
                                    background: '#3b82f6',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}
                            >
                                {loading ? 'Creating...' : 'Create Quiz'}
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Tabs */}
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', borderBottom: '1px solid #e5e7eb' }}>
                                <button
                                    onClick={() => setActiveTab('settings')}
                                    style={{
                                        padding: '10px 20px',
                                        background: 'none',
                                        border: 'none',
                                        borderBottom: activeTab === 'settings' ? '2px solid #3b82f6' : '2px solid transparent',
                                        color: activeTab === 'settings' ? '#3b82f6' : '#6b7280',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Settings
                                </button>
                                <button
                                    onClick={() => setActiveTab('questions')}
                                    style={{
                                        padding: '10px 20px',
                                        background: 'none',
                                        border: 'none',
                                        borderBottom: activeTab === 'questions' ? '2px solid #3b82f6' : '2px solid transparent',
                                        color: activeTab === 'questions' ? '#3b82f6' : '#6b7280',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Questions ({questions.length})
                                </button>
                            </div>

                            {/* Notifications */}
                            {error && <div style={{ padding: '12px', background: '#fee2e2', color: '#dc2626', borderRadius: '8px', marginBottom: '20px' }}>{error}</div>}
                            {success && <div style={{ padding: '12px', background: '#d1fae5', color: '#059669', borderRadius: '8px', marginBottom: '20px' }}>{success}</div>}

                            {activeTab === 'settings' ? (
                                <form onSubmit={updateQuizSettings} style={{ display: 'grid', gap: '20px', maxWidth: '600px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Quiz Title</label>
                                        <input
                                            name="title"
                                            defaultValue={quiz.title}
                                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Description (Optional)</label>
                                        <textarea
                                            name="description"
                                            defaultValue={quiz.description}
                                            rows={3}
                                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }}
                                        />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Passing Score (%)</label>
                                            <input
                                                name="passingScore"
                                                type="number"
                                                defaultValue={quiz.passingScore}
                                                min="0"
                                                max="100"
                                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Time Limit (minutes)</label>
                                            <input
                                                name="timeLimit"
                                                type="number"
                                                defaultValue={quiz.timeLimit}
                                                placeholder="No limit"
                                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }}
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        style={{
                                            padding: '12px',
                                            background: '#3b82f6',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            opacity: loading ? 0.7 : 1
                                        }}
                                    >
                                        Save Settings
                                    </button>
                                </form>
                            ) : (
                                <QuestionsList
                                    quizId={quiz.id}
                                    questions={questions}
                                    setQuestions={setQuestions}
                                    activeQuestion={editingQuestion}
                                    setActiveQuestion={setEditingQuestion}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

function QuestionsList({ quizId, questions, setQuestions, activeQuestion, setActiveQuestion }) {
    const [loading, setLoading] = useState(false);

    const deleteQuestion = async (id) => {
        if (!confirm('Start deleting?')) return;
        try {
            await api.delete(`/questions/${id}`);
            setQuestions(prev => prev.filter(q => q.id !== id));
        } catch (err) {
            alert('Failed to delete question');
        }
    };

    if (activeQuestion) {
        return <QuestionEditor quizId={quizId} question={activeQuestion === 'new' ? null : activeQuestion} onCancel={() => setActiveQuestion(null)} onSave={() => { setActiveQuestion(null); /* trigger refresh? or pass updated question back */ }} refreshQuestions={async () => {
            const res = await api.get(`/quizzes/${quizId}/questions`);
            setQuestions(res.data.sort((a, b) => a.order - b.order));
        }} />;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                <button
                    onClick={() => setActiveQuestion('new')}
                    style={{
                        padding: '10px 20px',
                        background: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: '600',
                        cursor: 'pointer'
                    }}
                >
                    + Add Question
                </button>
            </div>

            <div style={{ display: 'grid', gap: '15px' }}>
                {questions.map((q, i) => (
                    <div key={q.id} style={{
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        padding: '16px',
                        background: 'white',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'start'
                    }}>
                        <div>
                            <span style={{ fontWeight: '600', color: '#6b7280', marginRight: '8px' }}>Q{i + 1}.</span>
                            <span style={{ fontWeight: '500' }}>{q.questionText}</span>
                            <div style={{ marginTop: '8px', fontSize: '14px', color: '#6b7280' }}>
                                {q.points} points • {q.questionType}
                            </div>
                            {/* Warning if no correct answer/options - Client side check visual only */}
                            {(!q.options || !q.options.some(o => o.isCorrect)) && (
                                <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>
                                    ⚠️ No correct answer set! Course publishing will fail.
                                </div>
                            )}
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                                onClick={() => setActiveQuestion(q)}
                                style={{ padding: '6px 12px', background: '#eff6ff', color: '#3b82f6', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => deleteQuestion(q.id)}
                                style={{ padding: '6px 12px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
                {questions.length === 0 && (
                    <div style={{ textAlign: 'center', color: '#9ca3af', padding: '20px' }}>No questions added yet.</div>
                )}
            </div>
        </div>
    );
}

function QuestionEditor({ quizId, question, onCancel, onSave, refreshQuestions }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        questionText: question?.questionText || '',
        points: question?.points || 1,
        questionType: question?.questionType || 'MULTIPLE_CHOICE'
    });

    // Manage options locally until saved (or if editing existing, fetch options)
    const [options, setOptions] = useState(question?.options || []);

    const saveQuestion = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let questionId = question?.id;

            if (questionId) {
                // Update
                await api.put(`/questions/${questionId}`, formData);
            } else {
                // Create
                const res = await api.post(`/quizzes/${quizId}/questions`, {
                    ...formData,
                    order: 999 // will be fixed by backend or db
                });
                questionId = res.data.id;
            }

            // Save options
            // Since API is separate for options, we might need to handle them here
            // But for simplicity, let's assume options are managed separately or we iterate save

            await refreshQuestions();
            onSave();
        } catch (err) {
            alert(err.message || 'Failed to save question');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button onClick={onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>←</button>
                <h3 style={{ margin: 0 }}>{question ? 'Edit Question' : 'New Question'}</h3>
            </div>

            <form onSubmit={saveQuestion}>
                <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px' }}>Question Text</label>
                    <textarea
                        value={formData.questionText}
                        onChange={e => setFormData({ ...formData, questionText: e.target.value })}
                        required
                        style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                    />
                </div>

                <div style={{ display: 'flex', gap: '20px', marginBottom: '24px' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '8px' }}>Points</label>
                        <input
                            type="number"
                            value={formData.points}
                            onChange={e => setFormData({ ...formData, points: parseInt(e.target.value) })}
                            min="1"
                            style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '8px' }}>Type</label>
                        <select
                            value={formData.questionType}
                            onChange={e => setFormData({ ...formData, questionType: e.target.value })}
                            style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                        >
                            <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                            <option value="TRUE_FALSE">True / False</option>
                        </select>
                    </div>
                </div>

                {/* Options Editor - Only show if question exists context */}
                {question && (
                    <div style={{ marginBottom: '24px', borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
                        <h4 style={{ margin: '0 0 16px 0' }}>Answer Options</h4>
                        <OptionsEditor questionId={question.id} options={options} refreshQuestions={refreshQuestions} />
                    </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    <button type="button" onClick={onCancel} disabled={loading} style={{ padding: '10px 20px', background: '#f3f4f6', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>Cancel</button>
                    <button type="submit" disabled={loading} style={{ padding: '10px 20px', background: '#3b82f6', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
                        {loading ? 'Saving...' : question ? 'Save Changes' : 'Create & Continue'}
                    </button>
                </div>
            </form>
        </div>
    );
}

function OptionsEditor({ questionId, options: initialOptions, refreshQuestions }) {
    // We need to fetch options if not passed fully, but they usually come with qustion
    const [options, setOptions] = useState(initialOptions || []);
    const [newOptionText, setNewOptionText] = useState('');

    // Sync options when prop updates
    useEffect(() => {
        setOptions(initialOptions || []);
    }, [initialOptions]);

    const addOption = async () => {
        if (!newOptionText.trim()) return;
        try {
            await api.post(`/questions/${questionId}/options`, {
                optionText: newOptionText,
                isCorrect: false,
                order: options.length + 1
            });
            setNewOptionText('');
            await refreshQuestions(); // Reload parent
        } catch (err) {
            alert('Failed to add option');
        }
    };

    const deleteOption = async (id) => {
        try {
            await api.delete(`/options/${id}`);
            await refreshQuestions();
        } catch (err) {
            alert('Failed delete option');
        }
    };

    const toggleCorrect = async (opt) => {
        try {
            await api.put(`/options/${opt.id}`, {
                isCorrect: !opt.isCorrect
            });
            await refreshQuestions();
        } catch (err) {
            alert('Failed update option');
        }
    };

    return (
        <div>
            <div style={{ display: 'grid', gap: '10px', marginBottom: '16px' }}>
                {options.map((opt, i) => (
                    <div key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '8px', background: opt.isCorrect ? '#ecfdf5' : 'white' }}>
                        <div
                            onClick={() => toggleCorrect(opt)}
                            style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                border: `2px solid ${opt.isCorrect ? '#10b981' : '#d1d5db'}`,
                                background: opt.isCorrect ? '#10b981' : 'transparent',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '12px'
                            }}
                        >
                            {opt.isCorrect && '✓'}
                        </div>
                        <span style={{ flex: 1 }}>{opt.optionText}</span>
                        <button onClick={() => deleteOption(opt.id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>🗑</button>
                    </div>
                ))}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
                <input
                    value={newOptionText}
                    onChange={e => setNewOptionText(e.target.value)}
                    placeholder="Add an option..."
                    style={{ flex: 1, padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addOption())}
                />
                <button
                    type="button"
                    onClick={addOption}
                    style={{ padding: '8px 16px', background: '#e5e7eb', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
                >
                    Add
                </button>
            </div>
        </div>
    );
}
