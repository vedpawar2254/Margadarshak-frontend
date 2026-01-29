'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/services/api';
import QuizManagementModal from '@/components/admin/courses/QuizManagementModal';

// State machine states for predictable behavior
const STATUS = {
    IDLE: 'idle',
    LOADING: 'loading',
    SAVING: 'saving',
    SUCCESS: 'success',
    ERROR: 'error'
};

export default function EditCoursePage() {
    const params = useParams();
    const router = useRouter();
    const [status, setStatus] = useState(STATUS.LOADING);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [hasChanges, setHasChanges] = useState(false);

    // Course data state
    const [courseData, setCourseData] = useState({
        title: '',
        subtitle: '', // New
        description: '',
        instructorName: '',
        coverImage: '',
        price: '',
        duration: '',
        level: 'Beginner',
        category: '',
        whatYouWillLearn: [''],
        requirements: [''],
        whoIsThisFor: [''] // New
    });

    // Original data for comparison
    const [originalData, setOriginalData] = useState(null);

    // Fetch course data on mount
    useEffect(() => {
        if (params.courseId) {
            fetchCourse();
        }
    }, [params.courseId]);

    const fetchCourse = async () => {
        try {
            setStatus(STATUS.LOADING);
            setError(null);

            const response = await api.get(`/courses/${params.courseId}`);
            const course = response.data;

            if (!course) {
                throw new Error('Course not found');
            }

            const formData = {
                title: course.title || '',
                subtitle: course.subtitle || '', // New
                description: course.description || '',
                instructorName: course.instructorName || '',
                coverImage: course.coverImage || '',
                price: course.price?.toString() || '',
                duration: course.duration?.toString() || '',
                level: course.level || 'Beginner',
                category: course.category || '',
                whatYouWillLearn: Array.isArray(course.whatYouWillLearn) && course.whatYouWillLearn.length > 0
                    ? course.whatYouWillLearn
                    : [''],
                requirements: Array.isArray(course.requirements) && course.requirements.length > 0
                    ? course.requirements
                    : [''],
                whoIsThisFor: Array.isArray(course.whoIsThisFor) && course.whoIsThisFor.length > 0
                    ? course.whoIsThisFor
                    : [''] // New
            };

            setCourseData(formData);
            setOriginalData(formData);
            setStatus(STATUS.IDLE);
        } catch (err) {
            console.error('Error fetching course:', err);
            setError(err.message || 'Failed to load course');
            setStatus(STATUS.ERROR);
        }
    };

    // Track changes
    useEffect(() => {
        if (originalData) {
            const changed = JSON.stringify(courseData) !== JSON.stringify(originalData);
            setHasChanges(changed);
        }
    }, [courseData, originalData]);

    const handleChange = (field, value) => {
        setCourseData(prev => ({ ...prev, [field]: value }));
        setSuccessMessage(null);
        setError(null);
    };

    const handleLearningPointChange = (index, value) => {
        const updated = [...courseData.whatYouWillLearn];
        updated[index] = value;
        setCourseData(prev => ({ ...prev, whatYouWillLearn: updated }));
    };

    const addLearningPoint = () => {
        setCourseData(prev => ({
            ...prev,
            whatYouWillLearn: [...prev.whatYouWillLearn, '']
        }));
    };

    const removeLearningPoint = (index) => {
        setCourseData(prev => ({
            ...prev,
            whatYouWillLearn: prev.whatYouWillLearn.filter((_, i) => i !== index)
        }));
    };

    const handleRequirementChange = (index, value) => {
        const updated = [...courseData.requirements];
        updated[index] = value;
        setCourseData(prev => ({ ...prev, requirements: updated }));
    };

    const addRequirement = () => {
        setCourseData(prev => ({
            ...prev,
            requirements: [...prev.requirements, '']
        }));
    };

    const removeRequirement = (index) => {
        setCourseData(prev => ({
            ...prev,
            requirements: prev.requirements.filter((_, i) => i !== index)
        }));
    };

    const handleTargetAudienceChange = (index, value) => {
        const updated = [...courseData.whoIsThisFor];
        updated[index] = value;
        setCourseData(prev => ({ ...prev, whoIsThisFor: updated }));
    };

    const addTargetAudience = () => {
        setCourseData(prev => ({
            ...prev,
            whoIsThisFor: [...prev.whoIsThisFor, '']
        }));
    };

    const removeTargetAudience = (index) => {
        setCourseData(prev => ({
            ...prev,
            whoIsThisFor: prev.whoIsThisFor.filter((_, i) => i !== index)
        }));
    };

    // Save course with debounce protection
    const handleSave = useCallback(async () => {
        // Prevent double submission
        if (status === STATUS.SAVING) {
            return;
        }

        // Validate required fields
        if (!courseData.title?.trim()) {
            setError('Course title is required');
            return;
        }
        if (!courseData.description?.trim()) {
            setError('Course description is required');
            return;
        }

        try {
            setStatus(STATUS.SAVING);
            setError(null);
            setSuccessMessage(null);

            // Prepare data for API - filter empty values
            const updateData = {
                title: courseData.title.trim(),
                subtitle: courseData.subtitle?.trim() || undefined, // New
                description: courseData.description.trim(),
                instructorName: courseData.instructorName?.trim() || undefined,
                coverImage: courseData.coverImage?.trim() || undefined,
                price: courseData.price ? parseFloat(courseData.price) : undefined,
                duration: courseData.duration ? parseInt(courseData.duration) : undefined,
                level: courseData.level || undefined,
                category: courseData.category?.trim() || undefined,
                whatYouWillLearn: courseData.whatYouWillLearn.filter(l => l.trim()),
                requirements: courseData.requirements.filter(r => r.trim()),
                whoIsThisFor: courseData.whoIsThisFor.filter(w => w.trim()) // New
            };

            // Call PUT API - this is the critical fix
            const response = await api.put(`/courses/${params.courseId}`, updateData);

            if (response.success) {
                setSuccessMessage('Course updated successfully!');
                const formData = {
                    ...courseData,
                    subtitle: updateData.subtitle || '',
                    whoIsThisFor: updateData.whoIsThisFor.length > 0 ? updateData.whoIsThisFor : ['']
                };
                setCourseData(formData);
                setOriginalData(formData); // Reset change tracking
                setHasChanges(false);
                setStatus(STATUS.SUCCESS);

                // Clear success message after 3 seconds
                setTimeout(() => {
                    setSuccessMessage(null);
                    setStatus(STATUS.IDLE);
                }, 3000);
            } else {
                throw new Error(response.message || 'Failed to update course');
            }
        } catch (err) {
            console.error('Error updating course:', err);
            setError(err.message || 'Failed to update course');
            setStatus(STATUS.ERROR);
        }
    }, [courseData, params.courseId, status]);

    // Module Management State
    const [modules, setModules] = useState([]);
    const [modulesLoading, setModulesLoading] = useState(false);
    const [editingModuleId, setEditingModuleId] = useState(null);
    const [moduleFormData, setModuleFormData] = useState({});
    const [moduleError, setModuleError] = useState(null);
    const [moduleSuccess, setModuleSuccess] = useState(null);

    // Quiz Modal State
    const [quizModalOpen, setQuizModalOpen] = useState(false);
    const [currentQuizModule, setCurrentQuizModule] = useState(null);

    // Fetch modules when course loads
    useEffect(() => {
        if (params.courseId && originalData) {
            fetchModules();
        }
    }, [params.courseId, originalData]);

    const fetchModules = async () => {
        try {
            setModulesLoading(true);
            setModuleError(null);
            const response = await api.get(`/courses/${params.courseId}/modules`);
            // Handle response wrapper: { success: true, data: [...] }
            const moduleList = response.data || response || [];
            setModules(Array.isArray(moduleList) ? moduleList : []);
        } catch (err) {
            console.error('Error fetching modules:', err);
            setModuleError(err.message || 'Failed to load modules');
            setModules([]); // Set empty on error
        } finally {
            setModulesLoading(false);
        }
    };

    const startEditModule = (module) => {
        setEditingModuleId(module.id);
        setModuleFormData({
            title: module.title || '',
            description: module.description || '',
            theoryContent: module.theoryContent || '',
            contentType: module.contentType || 'VIDEO',
            videoUrl: module.videoUrl || '',
            videoSource: module.videoSource || 'URL',
            documentUrl: module.documentUrl || '',
            documentSource: module.documentSource || 'URL',
            coverImage: module.coverImage || '',
            order: module.order
        });
        setModuleError(null);
        setModuleSuccess(null);
    };

    const cancelEditModule = () => {
        setEditingModuleId(null);
        setModuleFormData({});
        setModuleError(null);
        setModuleSuccess(null);
    };

    const handleModuleFieldChange = (field, value) => {
        setModuleFormData(prev => ({ ...prev, [field]: value }));
    };

    const saveModule = async () => {
        if (!moduleFormData.title?.trim()) {
            setModuleError('Module title is required');
            return;
        }

        try {
            setModulesLoading(true);
            setModuleError(null);

            const updateData = {
                title: moduleFormData.title.trim(),
                description: moduleFormData.description?.trim() || '',
                theoryContent: moduleFormData.theoryContent?.trim() || '',
                contentType: moduleFormData.contentType,
                coverImage: moduleFormData.coverImage?.trim() || null,
                order: parseInt(moduleFormData.order)
            };

            // Include content-specific fields based on type
            if (moduleFormData.contentType === 'VIDEO') {
                updateData.videoUrl = moduleFormData.videoUrl?.trim() || null;
                updateData.videoSource = moduleFormData.videoSource;
                updateData.documentUrl = null;
                updateData.documentSource = null;
            } else {
                updateData.documentUrl = moduleFormData.documentUrl?.trim() || null;
                updateData.documentSource = moduleFormData.documentSource;
                updateData.videoUrl = null;
                updateData.videoSource = null;
            }

            await api.put(`/courses/modules/${editingModuleId}`, updateData);

            setModuleSuccess('Module updated successfully!');
            await fetchModules();

            setTimeout(() => {
                cancelEditModule();
            }, 1500);
        } catch (err) {
            console.error('Error updating module:', err);
            setModuleError(err.message || 'Failed to update module');
        } finally {
            setModulesLoading(false);
        }
    };

    const deleteModule = async (moduleId) => {
        if (!confirm('Are you sure you want to delete this module? This action cannot be undone.')) {
            return;
        }

        try {
            setModulesLoading(true);
            await api.delete(`/courses/modules/${moduleId}`);
            setModuleSuccess('Module deleted successfully!');
            await fetchModules();

            setTimeout(() => {
                setModuleSuccess(null);
            }, 3000);
        } catch (err) {
            console.error('Error deleting module:', err);
            setModuleError(err.message || 'Failed to delete module');
        } finally {
            setModulesLoading(false);
        }
    };

    const moveModule = async (moduleId, direction) => {
        const moduleIndex = modules.findIndex(m => m.id === moduleId);
        if (moduleIndex === -1) return;

        const newIndex = direction === 'up' ? moduleIndex - 1 : moduleIndex + 1;
        if (newIndex < 0 || newIndex >= modules.length) return;

        const updatedModules = [...modules];
        const [movedModule] = updatedModules.splice(moduleIndex, 1);
        updatedModules.splice(newIndex, 0, movedModule);

        // Update order values
        const reorderedModules = updatedModules.map((mod, idx) => ({
            ...mod,
            order: idx + 1
        }));

        setModules(reorderedModules);

        // Save new order to backend
        try {
            await api.put(`/courses/modules/${moduleId}`, { order: newIndex + 1 });
            await api.put(`/courses/modules/${modules[newIndex].id}`, { order: moduleIndex + 1 });
        } catch (err) {
            console.error('Error reordering modules:', err);
            // Revert on error
            await fetchModules();
        }
    };


    const openQuizModal = (module) => {
        setCurrentQuizModule(module);
        setQuizModalOpen(true);
    };

    const closeQuizModal = () => {
        setQuizModalOpen(false);
        setCurrentQuizModule(null);
    };

    // Loading state
    if (status === STATUS.LOADING) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '400px'
            }}>
                <div style={{
                    width: '40px',
                    height: '40px',
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

    // Error state for initial load failure
    if (status === STATUS.ERROR && !originalData) {
        return (
            <div style={{ textAlign: 'center', padding: '60px' }}>
                <p style={{ fontSize: '48px', marginBottom: '16px' }}>😕</p>
                <h2 style={{ fontSize: '24px', color: '#1f2937', marginBottom: '8px' }}>
                    Failed to load course
                </h2>
                <p style={{ color: '#ef4444', marginBottom: '24px' }}>{error}</p>
                <Link
                    href="/admin/courses"
                    style={{
                        background: '#3b82f6',
                        color: 'white',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontWeight: '600'
                    }}
                >
                    Back to Courses
                </Link>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px'
            }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1f2937' }}>
                        Edit Course
                    </h1>
                    <p style={{ color: '#6b7280', marginTop: '4px' }}>
                        Update course information
                    </p>
                </div>
                <Link
                    href="/admin/courses"
                    style={{
                        padding: '10px 20px',
                        background: '#f3f4f6',
                        borderRadius: '8px',
                        color: '#4b5563',
                        textDecoration: 'none',
                        fontWeight: '500'
                    }}
                >
                    ← Back to Courses
                </Link>
            </div>

            {/* Status Messages */}
            {error && (
                <div style={{
                    background: '#fee2e2',
                    color: '#dc2626',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    marginBottom: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <span>⚠️</span> {error}
                </div>
            )}

            {successMessage && (
                <div style={{
                    background: '#d1fae5',
                    color: '#059669',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    marginBottom: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <span>✓</span> {successMessage}
                </div>
            )}

            {/* Unsaved Changes Warning */}
            {hasChanges && (
                <div style={{
                    background: '#fef3c7',
                    color: '#d97706',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    marginBottom: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <span>⚡</span> You have unsaved changes
                </div>
            )}

            {/* Form */}
            <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '32px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
                <div style={{ display: 'grid', gap: '20px' }}>
                    {/* Title */}
                    <FormField
                        label="Course Title *"
                        value={courseData.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                        placeholder="e.g., Web Development Fundamentals"
                    />

                    <FormField
                        label="Course Subtitle"
                        value={courseData.subtitle}
                        onChange={(e) => handleChange('subtitle', e.target.value)}
                        placeholder="e.g., Learn React, Node.js, and MongoDB from scratch"
                    />

                    {/* Description */}
                    <FormField
                        label="Course Description *"
                        value={courseData.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        placeholder="Describe what students will learn..."
                        multiline
                    />

                    {/* Instructor & Cover */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <FormField
                            label="Instructor Name"
                            value={courseData.instructorName}
                            onChange={(e) => handleChange('instructorName', e.target.value)}
                            placeholder="e.g., John Doe"
                        />
                        <FormField
                            label="Cover Image URL"
                            value={courseData.coverImage}
                            onChange={(e) => handleChange('coverImage', e.target.value)}
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>

                    {/* Price, Duration, Level */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                        <FormField
                            label="Price (₹)"
                            type="number"
                            value={courseData.price}
                            onChange={(e) => handleChange('price', e.target.value)}
                            placeholder="999"
                        />
                        <FormField
                            label="Duration (hours)"
                            type="number"
                            value={courseData.duration}
                            onChange={(e) => handleChange('duration', e.target.value)}
                            placeholder="10"
                        />
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                                Level
                            </label>
                            <select
                                value={courseData.level}
                                onChange={(e) => handleChange('level', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    color: '#1f2937',
                                    background: 'white'
                                }}
                            >
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                        </div>
                    </div>

                    {/* Category */}
                    <FormField
                        label="Category"
                        value={courseData.category}
                        onChange={(e) => handleChange('category', e.target.value)}
                        placeholder="e.g., Programming, Design, Business"
                    />

                    {/* What You'll Learn */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                            What You'll Learn
                        </label>
                        {courseData.whatYouWillLearn.map((point, index) => (
                            <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                <input
                                    type="text"
                                    value={point}
                                    onChange={(e) => handleLearningPointChange(index, e.target.value)}
                                    placeholder={`Learning point ${index + 1}`}
                                    style={{
                                        flex: 1,
                                        padding: '10px 12px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '8px',
                                        color: '#1f2937'
                                    }}
                                />
                                {courseData.whatYouWillLearn.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeLearningPoint(index)}
                                        style={{
                                            padding: '10px 12px',
                                            background: '#fee2e2',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            color: '#dc2626'
                                        }}
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addLearningPoint}
                            style={{
                                padding: '8px 16px',
                                background: '#f3f4f6',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                color: '#4b5563',
                                marginTop: '8px'
                            }}
                        >
                            + Add Learning Point
                        </button>
                    </div>

                    {/* Who Is This For */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                            Who is this course for?
                        </label>
                        {courseData.whoIsThisFor.map((item, index) => (
                            <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                <input
                                    type="text"
                                    value={item}
                                    onChange={(e) => handleTargetAudienceChange(index, e.target.value)}
                                    placeholder={`Target audience ${index + 1}`}
                                    style={{
                                        flex: 1,
                                        padding: '10px 12px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '8px',
                                        color: '#1f2937'
                                    }}
                                />
                                {courseData.whoIsThisFor.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeTargetAudience(index)}
                                        style={{
                                            padding: '10px 12px',
                                            background: '#fee2e2',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            color: '#dc2626'
                                        }}
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addTargetAudience}
                            style={{
                                padding: '8px 16px',
                                background: '#f3f4f6',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                color: '#4b5563',
                                marginTop: '8px'
                            }}
                        >
                            + Add Target Audience
                        </button>
                    </div>

                    {/* Requirements */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                            Requirements
                        </label>
                        {courseData.requirements.map((req, index) => (
                            <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                <input
                                    type="text"
                                    value={req}
                                    onChange={(e) => handleRequirementChange(index, e.target.value)}
                                    placeholder={`Requirement ${index + 1}`}
                                    style={{
                                        flex: 1,
                                        padding: '10px 12px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '8px',
                                        color: '#1f2937'
                                    }}
                                />
                                {courseData.requirements.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeRequirement(index)}
                                        style={{
                                            padding: '10px 12px',
                                            background: '#fee2e2',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            color: '#dc2626'
                                        }}
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addRequirement}
                            style={{
                                padding: '8px 16px',
                                background: '#f3f4f6',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                color: '#4b5563',
                                marginTop: '8px'
                            }}
                        >
                            + Add Requirement
                        </button>
                    </div>
                </div>

                {/* Actions */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '12px',
                    marginTop: '32px',
                    paddingTop: '24px',
                    borderTop: '1px solid #e5e7eb'
                }}>
                    <button
                        onClick={() => router.push('/admin/courses')}
                        disabled={status === STATUS.SAVING}
                        style={{
                            padding: '12px 24px',
                            background: '#f3f4f6',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: status === STATUS.SAVING ? 'not-allowed' : 'pointer',
                            fontWeight: '500',
                            opacity: status === STATUS.SAVING ? 0.5 : 1
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={status === STATUS.SAVING || !hasChanges}
                        style={{
                            padding: '12px 24px',
                            background: hasChanges ? '#3b82f6' : '#9ca3af',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: (status === STATUS.SAVING || !hasChanges) ? 'not-allowed' : 'pointer',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        {status === STATUS.SAVING ? (
                            <>
                                <span style={{
                                    width: '16px',
                                    height: '16px',
                                    border: '2px solid white',
                                    borderTop: '2px solid transparent',
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite'
                                }} />
                                Saving...
                            </>
                        ) : (
                            '💾 Save Changes'
                        )}
                    </button>
                </div>
            </div>

            {/* Module Management Section */}
            <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '32px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                marginTop: '32px'
            }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', marginBottom: '16px' }}>
                    Course Modules
                </h2>
                <p style={{ color: '#6b7280', marginBottom: '24px' }}>
                    Manage the modules and lessons for this course
                </p>

                {/* Module Status Messages */}
                {moduleError && (
                    <div style={{
                        background: '#fee2e2',
                        color: '#dc2626',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        marginBottom: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <span>⚠️</span> {moduleError}
                    </div>
                )}

                {moduleSuccess && (
                    <div style={{
                        background: '#d1fae5',
                        color: '#059669',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        marginBottom: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <span>✓</span> {moduleSuccess}
                    </div>
                )}

                {modulesLoading && !editingModuleId ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            border: '3px solid #e5e7eb',
                            borderTop: '3px solid #3b82f6',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            margin: '0 auto'
                        }} />
                    </div>
                ) : modules.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '40px',
                        color: '#6b7280'
                    }}>
                        <p style={{ fontSize: '48px', marginBottom: '8px' }}>📚</p>
                        <p>No modules yet. Create modules from the course creation page.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '16px' }}>
                        {modules.map((module, index) => (
                            <div key={module.id} style={{
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                padding: editingModuleId === module.id ? '0' : '16px',
                                background: editingModuleId === module.id ? '#f9fafb' : 'white'
                            }}>
                                {editingModuleId === module.id ? (
                                    /* Edit Form */
                                    <div style={{ padding: '20px' }}>
                                        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>
                                            Edit Module
                                        </h3>

                                        <div style={{ display: 'grid', gap: '16px' }}>
                                            {/* Title */}
                                            <FormField
                                                label="Module Title *"
                                                value={moduleFormData.title}
                                                onChange={(e) => handleModuleFieldChange('title', e.target.value)}
                                                placeholder="e.g., Introduction to JavaScript"
                                            />

                                            {/* Description */}
                                            <FormField
                                                label="Description"
                                                value={moduleFormData.description}
                                                onChange={(e) => handleModuleFieldChange('description', e.target.value)}
                                                placeholder="Brief description of the module"
                                                multiline
                                                rows={3}
                                            />

                                            {/* Theory Content */}
                                            <FormField
                                                label="Theory Content"
                                                value={moduleFormData.theoryContent}
                                                onChange={(e) => handleModuleFieldChange('theoryContent', e.target.value)}
                                                placeholder="Detailed theory/explanation for this module"
                                                multiline
                                                rows={4}
                                            />

                                            {/* Content Type */}
                                            <div>
                                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                                                    Content Type
                                                </label>
                                                <select
                                                    value={moduleFormData.contentType}
                                                    onChange={(e) => handleModuleFieldChange('contentType', e.target.value)}
                                                    style={{
                                                        width: '100%',
                                                        padding: '12px',
                                                        border: '1px solid #d1d5db',
                                                        borderRadius: '8px',
                                                        fontSize: '16px',
                                                        color: '#1f2937'
                                                    }}
                                                >
                                                    <option value="VIDEO">Video</option>
                                                    <option value="DOCUMENT">Document</option>
                                                </select>
                                            </div>

                                            {/* Conditional Content Fields */}
                                            {moduleFormData.contentType === 'VIDEO' ? (
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '12px' }}>
                                                    <FormField
                                                        label="Video URL"
                                                        value={moduleFormData.videoUrl}
                                                        onChange={(e) => handleModuleFieldChange('videoUrl', e.target.value)}
                                                        placeholder="https://example.com/video.mp4 or uploaded file URL"
                                                    />
                                                    <div>
                                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                                                            Source
                                                        </label>
                                                        <select
                                                            value={moduleFormData.videoSource}
                                                            onChange={(e) => handleModuleFieldChange('videoSource', e.target.value)}
                                                            style={{
                                                                width: '140px',
                                                                padding: '12px',
                                                                border: '1px solid #d1d5db',
                                                                borderRadius: '8px',
                                                                fontSize: '16px'
                                                            }}
                                                        >
                                                            <option value="URL">URL</option>
                                                            <option value="LOCAL">Local</option>
                                                            <option value="DRIVE">Drive</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '12px' }}>
                                                    <FormField
                                                        label="Document URL"
                                                        value={moduleFormData.documentUrl}
                                                        onChange={(e) => handleModuleFieldChange('documentUrl', e.target.value)}
                                                        placeholder="https://example.com/doc.pdf or uploaded file URL"
                                                    />
                                                    <div>
                                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                                                            Source
                                                        </label>
                                                        <select
                                                            value={moduleFormData.documentSource}
                                                            onChange={(e) => handleModuleFieldChange('documentSource', e.target.value)}
                                                            style={{
                                                                width: '140px',
                                                                padding: '12px',
                                                                border: '1px solid #d1d5db',
                                                                borderRadius: '8px',
                                                                fontSize: '16px'
                                                            }}
                                                        >
                                                            <option value="URL">URL</option>
                                                            <option value="LOCAL">Local</option>
                                                            <option value="DRIVE">Drive</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Cover Image */}
                                            <FormField
                                                label="Cover Image URL"
                                                value={moduleFormData.coverImage}
                                                onChange={(e) => handleModuleFieldChange('coverImage', e.target.value)}
                                                placeholder="https://example.com/cover.jpg"
                                            />

                                            {/* Actions */}
                                            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                                                <button
                                                    onClick={saveModule}
                                                    disabled={modulesLoading}
                                                    style={{
                                                        padding: '10px 20px',
                                                        background: '#3b82f6',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '8px',
                                                        cursor: modulesLoading ? 'not-allowed' : 'pointer',
                                                        fontWeight: '600',
                                                        opacity: modulesLoading ? 0.6 : 1
                                                    }}
                                                >
                                                    {modulesLoading ? 'Saving...' : '💾 Save Changes'}
                                                </button>
                                                <button
                                                    onClick={cancelEditModule}
                                                    disabled={modulesLoading}
                                                    style={{
                                                        padding: '10px 20px',
                                                        background: '#f3f4f6',
                                                        border: 'none',
                                                        borderRadius: '8px',
                                                        cursor: modulesLoading ? 'not-allowed' : 'pointer',
                                                        fontWeight: '500'
                                                    }}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    /* Module Display */
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                                                <span style={{
                                                    background: '#eff6ff',
                                                    color: '#3b82f6',
                                                    padding: '4px 12px',
                                                    borderRadius: '16px',
                                                    fontSize: '14px',
                                                    fontWeight: '600'
                                                }}>
                                                    #{module.order}
                                                </span>
                                                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
                                                    {module.title}
                                                </h3>
                                                <span style={{
                                                    background: module.contentType === 'VIDEO' ? '#fef3c7' : '#e0e7ff',
                                                    color: module.contentType === 'VIDEO' ? '#d97706' : '#4f46e5',
                                                    padding: '2px 8px',
                                                    borderRadius: '4px',
                                                    fontSize: '12px',
                                                    fontWeight: '500'
                                                }}>
                                                    {module.contentType === 'VIDEO' ? '🎥 Video' : '📄 Document'}
                                                </span>
                                            </div>
                                            {module.description && (
                                                <p style={{ color: '#6b7280', fontSize: '14px' }}>
                                                    {module.description}
                                                </p>
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            {/* Reorder buttons */}
                                            <button
                                                onClick={() => moveModule(module.id, 'up')}
                                                disabled={index === 0}
                                                style={{
                                                    padding: '8px 12px',
                                                    background: index === 0 ? '#f3f4f6' : '#eff6ff',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    cursor: index === 0 ? 'not-allowed' : 'pointer',
                                                    opacity: index === 0 ? 0.5 : 1
                                                }}
                                                title="Move up"
                                            >
                                                ↑
                                            </button>
                                            <button
                                                onClick={() => moveModule(module.id, 'down')}
                                                disabled={index === modules.length - 1}
                                                style={{
                                                    padding: '8px 12px',
                                                    background: index === modules.length - 1 ? '#f3f4f6' : '#eff6ff',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    cursor: index === modules.length - 1 ? 'not-allowed' : 'pointer',
                                                    opacity: index === modules.length - 1 ? 0.5 : 1
                                                }}
                                                title="Move down"
                                            >
                                                ↓
                                            </button>
                                            <button
                                                onClick={() => openQuizModal(module)}
                                                style={{
                                                    padding: '8px 16px',
                                                    background: '#f0fdf4',
                                                    color: '#16a34a',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    fontWeight: '500'
                                                }}
                                            >
                                                📝 Quiz
                                            </button>
                                            <button
                                                onClick={() => startEditModule(module)}
                                                style={{
                                                    padding: '8px 16px',
                                                    background: '#eff6ff',
                                                    color: '#3b82f6',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    fontWeight: '500'
                                                }}
                                            >
                                                ✏️ Edit
                                            </button>
                                            <button
                                                onClick={() => deleteModule(module.id)}
                                                style={{
                                                    padding: '8px 16px',
                                                    background: '#fee2e2',
                                                    color: '#dc2626',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    fontWeight: '500'
                                                }}
                                            >
                                                🗑️ Delete
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Quiz Modal */}
            <QuizManagementModal
                isOpen={quizModalOpen}
                onClose={closeQuizModal}
                moduleId={currentQuizModule?.id}
                moduleTitle={currentQuizModule?.title}
            />
        </div>
    );
}

// Reusable Form Field Component (copied from create page to maintain consistency)
function FormField({ label, value, onChange, placeholder, type = 'text', multiline = false, rows = 4 }) {
    const inputStyle = {
        width: '100%',
        padding: '12px',
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        fontSize: '16px',
        color: '#1f2937',
        resize: multiline ? 'vertical' : 'none'
    };

    return (
        <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                {label}
            </label>
            {multiline ? (
                <textarea
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    rows={rows}
                    style={inputStyle}
                />
            ) : (
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    style={inputStyle}
                />
            )}
        </div>
    );
}
