'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';

export default function CreateWellbeingTopicPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [formData, setFormData] = useState({
        title: '',
        shortDescription: '',
        icon: '',
        order: '0',
        isActive: true,
        subtopics: []
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setError('');
    };

    const addSubtopic = () => {
        setFormData(prev => ({
            ...prev,
            subtopics: [...prev.subtopics, { title: '', order: prev.subtopics.length, points: [] }]
        }));
    };

    const removeSubtopic = (index) => {
        setFormData(prev => ({
            ...prev,
            subtopics: prev.subtopics.filter((_, i) => i !== index)
        }));
    };

    const updateSubtopic = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            subtopics: prev.subtopics.map((st, i) =>
                i === index ? { ...st, [field]: value } : st
            )
        }));
    };

    const addPoint = (subtopicIndex) => {
        setFormData(prev => ({
            ...prev,
            subtopics: prev.subtopics.map((st, i) =>
                i === subtopicIndex
                    ? { ...st, points: [...st.points, { text: '', order: st.points.length }] }
                    : st
            )
        }));
    };

    const removePoint = (subtopicIndex, pointIndex) => {
        setFormData(prev => ({
            ...prev,
            subtopics: prev.subtopics.map((st, i) =>
                i === subtopicIndex
                    ? { ...st, points: st.points.filter((_, pi) => pi !== pointIndex) }
                    : st
            )
        }));
    };

    const updatePoint = (subtopicIndex, pointIndex, value) => {
        setFormData(prev => ({
            ...prev,
            subtopics: prev.subtopics.map((st, i) =>
                i === subtopicIndex
                    ? {
                        ...st,
                        points: st.points.map((pt, pi) =>
                            pi === pointIndex ? { ...pt, text: value } : pt
                        )
                    }
                    : st
            )
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim()) {
            setError('Title is required');
            return;
        }

        setSaving(true);
        setError('');
        try {
            await api.post('/wellbeing/admin', {
                ...formData,
                order: parseInt(formData.order) || 0
            });
            router.push('/admin/wellbeing');
        } catch (err) {
            setError(err.message || 'Failed to create topic');
        } finally {
            setSaving(false);
        }
    };

    if (authLoading) {
        return <div style={{ padding: '60px', textAlign: 'center' }}>Loading...</div>;
    }

    const inputStyle = {
        width: '100%',
        padding: '10px 14px',
        border: '1px solid #e5e7eb',
        borderRadius: '6px',
        fontSize: '14px',
        color: '#000000',
        backgroundColor: '#ffffff'
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '6px',
        fontWeight: '500',
        fontSize: '14px',
        color: '#374151'
    };

    return (
        <div style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
            <Link href="/admin/wellbeing" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '14px', marginBottom: '24px', display: 'inline-block' }}>
                ← Back to Topics
            </Link>

            <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
                Create Wellness Topic
            </h1>
            <p style={{ color: '#6b7280', marginBottom: '32px' }}>
                Add a new wellness dimension with subtopics and bullet points
            </p>

            {error && (
                <div style={{ padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#dc2626', marginBottom: '24px', fontSize: '14px' }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Basic Fields */}
                <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Basic Information</h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label style={labelStyle}>Title <span style={{ color: '#dc2626' }}>*</span></label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => handleChange('title', e.target.value)}
                                placeholder="e.g., Mental Wellness"
                                style={inputStyle}
                            />
                        </div>

                        <div>
                            <label style={labelStyle}>Short Description</label>
                            <textarea
                                value={formData.shortDescription}
                                onChange={(e) => handleChange('shortDescription', e.target.value)}
                                placeholder="Brief description (1 line)"
                                rows={2}
                                style={{ ...inputStyle, resize: 'vertical' }}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                            <div>
                                <label style={labelStyle}>Icon</label>
                                <select
                                    value={formData.icon}
                                    onChange={(e) => handleChange('icon', e.target.value)}
                                    style={inputStyle}
                                >
                                    <option value="">None</option>
                                    <option value="brain">🧠 Brain</option>
                                    <option value="leaf">🍃 Leaf</option>
                                    <option value="palette">🎨 Palette</option>
                                    <option value="meditation">🧘 Meditation</option>
                                    <option value="lightbulb">💡 Lightbulb</option>
                                    <option value="heart">❤️ Heart</option>
                                    <option value="star">⭐ Star</option>
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Display Order</label>
                                <input
                                    type="number"
                                    value={formData.order}
                                    onChange={(e) => handleChange('order', e.target.value)}
                                    style={inputStyle}
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>Status</label>
                                <select
                                    value={formData.isActive}
                                    onChange={(e) => handleChange('isActive', e.target.value === 'true')}
                                    style={inputStyle}
                                >
                                    <option value="true">Active</option>
                                    <option value="false">Inactive</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Subtopics */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '600' }}>Subtopics</h3>
                        <button
                            type="button"
                            onClick={addSubtopic}
                            style={{
                                padding: '8px 16px',
                                background: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '14px',
                                cursor: 'pointer'
                            }}
                        >
                            + Add Subtopic
                        </button>
                    </div>

                    {formData.subtopics.map((subtopic, subIdx) => (
                        <div key={subIdx} style={{
                            background: '#f9fafb',
                            padding: '20px',
                            borderRadius: '12px',
                            marginBottom: '16px',
                            border: '1px solid #e5e7eb'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                <h4 style={{ fontSize: '15px', fontWeight: '600' }}>Subtopic {subIdx + 1}</h4>
                                <button
                                    type="button"
                                    onClick={() => removeSubtopic(subIdx)}
                                    style={{
                                        padding: '4px 12px',
                                        background: '#fee2e2',
                                        color: '#dc2626',
                                        border: 'none',
                                        borderRadius: '6px',
                                        fontSize: '13px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Remove
                                </button>
                            </div>

                            <input
                                type="text"
                                value={subtopic.title}
                                onChange={(e) => updateSubtopic(subIdx, 'title', e.target.value)}
                                placeholder="Subtopic title (e.g., Energy & Focus Boosters)"
                                style={{ ...inputStyle, marginBottom: '12px' }}
                            />

                            {/* Points */}
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <label style={{ ...labelStyle, marginBottom: 0 }}>Bullet Points</label>
                                    <button
                                        type="button"
                                        onClick={() => addPoint(subIdx)}
                                        style={{
                                            padding: '4px 12px',
                                            background: '#dbeafe',
                                            color: '#1d4ed8',
                                            border: 'none',
                                            borderRadius: '6px',
                                            fontSize: '13px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        + Add Point
                                    </button>
                                </div>

                                {subtopic.points.map((point, pIdx) => (
                                    <div key={pIdx} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                        <input
                                            type="text"
                                            value={point.text}
                                            onChange={(e) => updatePoint(subIdx, pIdx, e.target.value)}
                                            placeholder="Bullet point text"
                                            style={{ ...inputStyle, flex: 1 }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removePoint(subIdx, pIdx)}
                                            style={{
                                                padding: '8px 12px',
                                                background: '#fee2e2',
                                                color: '#dc2626',
                                                border: 'none',
                                                borderRadius: '6px',
                                                fontSize: '13px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Submit */}
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        type="button"
                        onClick={() => router.push('/admin/wellbeing')}
                        style={{
                            padding: '12px 24px',
                            borderRadius: '8px',
                            border: '1px solid #e5e7eb',
                            background: 'white',
                            cursor: 'pointer'
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        style={{
                            padding: '12px 24px',
                            borderRadius: '8px',
                            border: 'none',
                            background: '#3b82f6',
                            color: 'white',
                            cursor: saving ? 'not-allowed' : 'pointer',
                            opacity: saving ? 0.7 : 1
                        }}
                    >
                        {saving ? 'Creating...' : 'Create Topic'}
                    </button>
                </div>
            </form>
        </div>
    );
}
