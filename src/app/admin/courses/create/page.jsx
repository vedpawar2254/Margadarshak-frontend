'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/services/api';
import { validateDriveLink } from '@/utils/driveUtils';
import { drivePickerService } from '@/services/drivePicker.service';
import RichTextEditor from '@/components/admin/RichTextEditor';

export default function CreateCoursePage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Step 1: Course Info
    const [courseInfo, setCourseInfo] = useState({
        title: '',
        description: '',
        instructorName: '',
        coverImage: '',
        price: '',
        duration: '',
        level: 'Beginner',
        category: '',
        whatYouWillLearn: [''],
        requirements: [''],
        numberOfModules: 1
    });

    // Step 2: Modules
    const [modules, setModules] = useState([]);
    const [driveLoading, setDriveLoading] = useState(false);
    const [driveScriptsLoaded, setDriveScriptsLoaded] = useState(false);

    // Load Google Scripts on mount
    useEffect(() => {
        drivePickerService.loadGoogleScripts().then(() => {
            setDriveScriptsLoaded(true);
        }).catch(err => console.error('Failed to load Drive scripts:', err));
    }, []);

    // Initialize modules when moving to step 2
    const initializeModules = () => {
        const count = parseInt(courseInfo.numberOfModules) || 1;
        const newModules = [];
        for (let i = 0; i < count; i++) {
            newModules.push({
                title: '',
                description: '',
                theoryContent: '',
                coverImage: '',
                contentType: 'VIDEO', // New field
                videoUrl: '',
                videoType: 'URL',
                videoDuration: '',
                documentUrl: '',      // New field
                documentType: 'pdf',  // New field
                quiz: {
                    title: '',
                    description: '',
                    passingScore: 70,
                    questions: []
                }
            });
        }
        setModules(newModules);
    };

    const handleCourseInfoChange = (field, value) => {
        setCourseInfo(prev => ({ ...prev, [field]: value }));
    };

    const handleLearningPointChange = (index, value) => {
        const updated = [...courseInfo.whatYouWillLearn];
        updated[index] = value;
        setCourseInfo(prev => ({ ...prev, whatYouWillLearn: updated }));
    };

    const addLearningPoint = () => {
        setCourseInfo(prev => ({
            ...prev,
            whatYouWillLearn: [...prev.whatYouWillLearn, '']
        }));
    };

    const removeLearningPoint = (index) => {
        setCourseInfo(prev => ({
            ...prev,
            whatYouWillLearn: prev.whatYouWillLearn.filter((_, i) => i !== index)
        }));
    };

    const handleRequirementChange = (index, value) => {
        const updated = [...courseInfo.requirements];
        updated[index] = value;
        setCourseInfo(prev => ({ ...prev, requirements: updated }));
    };

    const addRequirement = () => {
        setCourseInfo(prev => ({
            ...prev,
            requirements: [...prev.requirements, '']
        }));
    };

    const removeRequirement = (index) => {
        setCourseInfo(prev => ({
            ...prev,
            requirements: prev.requirements.filter((_, i) => i !== index)
        }));
    };

    const handleModuleChange = (moduleIndex, field, value) => {
        const updated = [...modules];
        updated[moduleIndex] = { ...updated[moduleIndex], [field]: value };
        setModules(updated);
    };

    const handleQuizChange = (moduleIndex, field, value) => {
        const updated = [...modules];
        updated[moduleIndex].quiz = { ...updated[moduleIndex].quiz, [field]: value };
        setModules(updated);
    };

    const addQuestion = (moduleIndex) => {
        const updated = [...modules];
        updated[moduleIndex].quiz.questions.push({
            questionText: '',
            questionType: 'SINGLE_CORRECT',
            points: 1,
            options: [
                { optionText: '', isCorrect: false },
                { optionText: '', isCorrect: false },
                { optionText: '', isCorrect: false },
                { optionText: '', isCorrect: false }
            ]
        });
        setModules(updated);
    };

    const removeQuestion = (moduleIndex, questionIndex) => {
        const updated = [...modules];
        updated[moduleIndex].quiz.questions.splice(questionIndex, 1);
        setModules(updated);
    };

    const handleQuestionChange = (moduleIndex, questionIndex, field, value) => {
        const updated = [...modules];
        updated[moduleIndex].quiz.questions[questionIndex][field] = value;
        setModules(updated);
    };

    const handleOptionChange = (moduleIndex, questionIndex, optionIndex, field, value) => {
        const updated = [...modules];
        const question = updated[moduleIndex].quiz.questions[questionIndex];

        if (field === 'isCorrect') {
            // For single correct, uncheck others
            if (question.questionType === 'SINGLE_CORRECT' && value) {
                question.options.forEach((opt, idx) => {
                    opt.isCorrect = idx === optionIndex;
                });
            } else {
                question.options[optionIndex].isCorrect = value;
            }
        } else {
            question.options[optionIndex][field] = value;
        }

        setModules(updated);
    };

    const addOption = (moduleIndex, questionIndex) => {
        const updated = [...modules];
        updated[moduleIndex].quiz.questions[questionIndex].options.push({
            optionText: '',
            isCorrect: false
        });
        setModules(updated);
    };

    const removeOption = (moduleIndex, questionIndex, optionIndex) => {
        const updated = [...modules];
        updated[moduleIndex].quiz.questions[questionIndex].options.splice(optionIndex, 1);
        setModules(updated);
    };

    const handleNextStep = () => {
        if (step === 1) {
            if (!courseInfo.title || !courseInfo.description) {
                setError('Please fill in course title and description');
                return;
            }
            initializeModules();
            setStep(2);
            setError(null);
        }
    };

    const handlePrevStep = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const handleSaveDraft = async () => {
        try {
            setLoading(true);
            setError(null);

            const courseData = {
                ...courseInfo,
                whatYouWillLearn: courseInfo.whatYouWillLearn.filter(l => l.trim()),
                requirements: courseInfo.requirements.filter(r => r.trim()),
                status: 'DRAFT',
                modules: modules.map(m => ({
                    ...m,
                    quiz: {
                        ...m.quiz,
                        title: m.quiz.title || `${m.title} Quiz`,
                        questions: m.quiz.questions
                    }
                }))
            };

            const response = await api.post('/courses/bulk-create', courseData);

            if (response.success) {
                router.push('/admin/courses');
            } else {
                setError(response.message || 'Failed to create course');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePublish = async () => {
        try {
            setLoading(true);
            setError(null);

            // Validate modules
            for (let i = 0; i < modules.length; i++) {
                const m = modules[i];
                if (!m.title) {
                    setError(`Module ${i + 1}: Title is required`);
                    return;
                }
                // FIX: Video is NOT mandatory - allow modules without video
                // Validation based on Content Type
                if (m.contentType === 'VIDEO') {
                    if (!m.videoUrl) {
                        setError(`Module ${i + 1}: Video URL is required for Video modules`);
                        return;
                    }
                    // Validate Video URL
                    if (m.videoType === 'URL') {
                        if (m.videoUrl.includes('drive.google.com') || m.videoUrl.includes('docs.google.com')) {
                            // Drive logic
                            const driveValidation = validateDriveLink(m.videoUrl);
                            if (!driveValidation.isValid) {
                                setError(`Module ${i + 1}: ${driveValidation.errors[0]}`);
                                return;
                            }
                        } else {
                            try {
                                new URL(m.videoUrl);
                            } catch (e) {
                                setError(`Module ${i + 1}: Invalid video URL`);
                                return;
                            }
                        }
                    }
                } else if (m.contentType === 'DOCUMENT') {
                    if (!m.documentUrl) {
                        setError(`Module ${i + 1}: Document URL is required for Document modules`);
                        return;
                    }
                }

                if (m.quiz.questions.length === 0) {
                    setError(`Module ${i + 1}: At least one quiz question is required`);
                    return;
                }
            }

            const courseData = {
                ...courseInfo,
                whatYouWillLearn: courseInfo.whatYouWillLearn.filter(l => l.trim()),
                requirements: courseInfo.requirements.filter(r => r.trim()),
                status: 'PUBLISHED',
                modules: modules.map(m => ({
                    ...m,
                    // Map Sources
                    videoSource: m.videoType === 'UPLOAD' ? 'LOCAL' : (m.videoType === 'DRIVE' ? 'DRIVE' : 'URL'),
                    documentSource: m.documentType === 'URL' ? 'URL' : (m.documentType === 'DRIVE' ? 'DRIVE' : 'LOCAL'),
                    quiz: {
                        ...m.quiz,
                        title: m.quiz.title || `${m.title} Quiz`,
                        questions: m.quiz.questions
                    }
                }))
            };

            const response = await api.post('/courses/bulk-create', courseData);

            if (response.success) {
                router.push('/admin/courses');
            } else {
                setError(response.message || 'Failed to publish course');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1f2937' }}>
                    Create New Course
                </h1>
                <p style={{ color: '#6b7280', marginTop: '4px' }}>
                    Step {step} of 2: {step === 1 ? 'Course Information' : 'Modules & Quizzes'}
                </p>
            </div>

            {/* Progress Bar */}
            <div style={{
                display: 'flex',
                gap: '8px',
                marginBottom: '32px'
            }}>
                <div style={{
                    flex: 1,
                    height: '8px',
                    borderRadius: '4px',
                    background: '#3b82f6'
                }} />
                <div style={{
                    flex: 1,
                    height: '8px',
                    borderRadius: '4px',
                    background: step >= 2 ? '#3b82f6' : '#e5e7eb'
                }} />
            </div>

            {error && (
                <div style={{
                    background: '#fee2e2',
                    color: '#dc2626',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    marginBottom: '24px'
                }}>
                    {error}
                </div>
            )}

            {/* Step 1: Course Info */}
            {step === 1 && (
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '32px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                    <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px', color: '#1f2937' }}>
                        Course Information
                    </h2>

                    <div style={{ display: 'grid', gap: '20px' }}>
                        {/* Title */}
                        <FormField
                            label="Course Title *"
                            value={courseInfo.title}
                            onChange={(e) => handleCourseInfoChange('title', e.target.value)}
                            placeholder="e.g., Web Development Fundamentals"
                        />

                        {/* Description */}
                        <FormField
                            label="Course Description *"
                            value={courseInfo.description}
                            onChange={(e) => handleCourseInfoChange('description', e.target.value)}
                            placeholder="Describe what students will learn..."
                            multiline
                        />

                        {/* Instructor & Cover */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <FormField
                                label="Instructor Name"
                                value={courseInfo.instructorName}
                                onChange={(e) => handleCourseInfoChange('instructorName', e.target.value)}
                                placeholder="e.g., John Doe"
                            />
                            <FormField
                                label="Cover Image URL"
                                value={courseInfo.coverImage}
                                onChange={(e) => handleCourseInfoChange('coverImage', e.target.value)}
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>

                        {/* Price, Duration, Level */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                            <FormField
                                label="Price (₹)"
                                type="number"
                                value={courseInfo.price}
                                onChange={(e) => handleCourseInfoChange('price', e.target.value)}
                                placeholder="999"
                            />
                            <FormField
                                label="Duration (hours)"
                                type="number"
                                value={courseInfo.duration}
                                onChange={(e) => handleCourseInfoChange('duration', e.target.value)}
                                placeholder="10"
                            />
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                                    Level
                                </label>
                                <select
                                    value={courseInfo.level}
                                    onChange={(e) => handleCourseInfoChange('level', e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '8px',
                                        fontSize: '16px'
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
                            value={courseInfo.category}
                            onChange={(e) => handleCourseInfoChange('category', e.target.value)}
                            placeholder="e.g., Programming, Design, Business"
                        />

                        {/* What You'll Learn */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                                What You'll Learn
                            </label>
                            {courseInfo.whatYouWillLearn.map((point, index) => (
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
                                            color: 'black'
                                        }}
                                    />
                                    {courseInfo.whatYouWillLearn.length > 1 && (
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

                        {/* Requirements */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                                Requirements
                            </label>
                            {courseInfo.requirements.map((req, index) => (
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
                                            color: 'black'
                                        }}
                                    />
                                    {courseInfo.requirements.length > 1 && (
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

                        {/* Number of Modules */}
                        <div style={{
                            background: '#f0f9ff',
                            padding: '20px',
                            borderRadius: '12px',
                            border: '2px solid #3b82f6'
                        }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1e40af' }}>
                                Number of Modules *
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="20"
                                value={courseInfo.numberOfModules}
                                onChange={(e) => handleCourseInfoChange('numberOfModules', Math.max(1, parseInt(e.target.value) || 1))}
                                style={{
                                    width: '120px',
                                    padding: '12px',
                                    border: '2px solid #3b82f6',
                                    borderRadius: '8px',
                                    fontSize: '18px',
                                    fontWeight: '600',
                                    textAlign: 'center',
                                    color: 'black'
                                }}
                            />
                            <p style={{ color: '#3b82f6', marginTop: '8px', fontSize: '14px' }}>
                                Each module will have exactly one video and one quiz
                            </p>
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
                            style={{
                                padding: '12px 24px',
                                background: '#f3f4f6',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: '500'
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleNextStep}
                            style={{
                                padding: '12px 24px',
                                background: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: '600'
                            }}
                        >
                            Next: Add Modules →
                        </button>
                    </div>
                </div>
            )}

            {/* Step 2: Modules & Quizzes */}
            {step === 2 && (
                <div>
                    {modules.map((module, moduleIndex) => (
                        <div
                            key={moduleIndex}
                            style={{
                                background: 'white',
                                borderRadius: '12px',
                                padding: '32px',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                marginBottom: '24px'
                            }}
                        >
                            <h2 style={{
                                fontSize: '20px',
                                fontWeight: '600',
                                marginBottom: '24px',
                                color: '#1f2937',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px'
                            }}>
                                <span style={{
                                    width: '32px',
                                    height: '32px',
                                    background: '#3b82f6',
                                    color: 'white',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: '700'
                                }}>
                                    {moduleIndex + 1}
                                </span>
                                Module {moduleIndex + 1}
                            </h2>

                            <div style={{ display: 'grid', gap: '20px' }}>
                                {/* Module Title */}
                                <FormField
                                    label="Module Title *"
                                    value={module.title}
                                    onChange={(e) => handleModuleChange(moduleIndex, 'title', e.target.value)}
                                    placeholder="e.g., Introduction to HTML"
                                />

                                {/* Cover Image */}
                                <FormField
                                    label="Cover Image URL"
                                    value={module.coverImage}
                                    onChange={(e) => handleModuleChange(moduleIndex, 'coverImage', e.target.value)}
                                    placeholder="https://example.com/image.jpg"
                                />

                                {/* Content Type Selector */}
                                <div style={{ background: '#f0fdf4', padding: '20px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                                    <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600', color: '#166534' }}>
                                        Module Content Type
                                    </label>
                                    <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                            <input
                                                type="radio"
                                                name={`contentType-${moduleIndex}`}
                                                checked={module.contentType === 'VIDEO'}
                                                onChange={() => handleModuleChange(moduleIndex, 'contentType', 'VIDEO')}
                                                style={{ width: '18px', height: '18px' }}
                                            />
                                            <span style={{ fontSize: '16px', fontWeight: '500' }}>Video Lesson</span>
                                        </label>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                            <input
                                                type="radio"
                                                name={`contentType-${moduleIndex}`}
                                                checked={module.contentType === 'DOCUMENT'}
                                                onChange={() => handleModuleChange(moduleIndex, 'contentType', 'DOCUMENT')}
                                                style={{ width: '18px', height: '18px' }}
                                            />
                                            <span style={{ fontSize: '16px', fontWeight: '500' }}>Document / Reading</span>
                                        </label>
                                    </div>

                                    {/* Video Options */}
                                    {module.contentType === 'VIDEO' && (
                                        <div style={{ display: 'grid', gap: '16px', paddingLeft: '12px', borderLeft: '3px solid #3b82f6' }}>
                                            <div>
                                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                                                    Video Source
                                                </label>
                                                <select
                                                    value={module.videoType}
                                                    onChange={(e) => handleModuleChange(moduleIndex, 'videoType', e.target.value)}
                                                    style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', width: '200px' }}
                                                >
                                                    <option value="URL">External URL (YouTube/Vimeo)</option>
                                                    <option value="DRIVE">Google Drive</option>
                                                    <option value="UPLOAD">Upload Video (Local)</option>
                                                </select>
                                            </div>

                                            {module.videoType === 'URL' && (
                                                <FormField
                                                    label="Video URL *"
                                                    value={module.videoUrl}
                                                    onChange={(e) => handleModuleChange(moduleIndex, 'videoUrl', e.target.value)}
                                                    placeholder="https://youtube.com/watch?v=..."
                                                />
                                            )}

                                            {module.videoType === 'DRIVE' && (
                                                <div>
                                                    <button
                                                        type="button"
                                                        disabled={!driveScriptsLoaded || driveLoading}
                                                        onClick={async () => {
                                                            if (!driveScriptsLoaded) {
                                                                alert('Google Drive is loading. Please wait.');
                                                                return;
                                                            }
                                                            setDriveLoading(true);
                                                            try {
                                                                const result = await drivePickerService.openPicker();
                                                                // Send to backend for download
                                                                const res = await api.post('/upload/drive', {
                                                                    fileId: result.fileId,
                                                                    fileName: result.name,
                                                                    mimeType: result.mimeType,
                                                                    accessToken: result.accessToken
                                                                });
                                                                if (res.success) {
                                                                    handleModuleChange(moduleIndex, 'videoUrl', res.data.fileUrl);
                                                                    alert('Video from Drive uploaded successfully!');
                                                                } else {
                                                                    throw new Error(res.message || 'Upload failed');
                                                                }
                                                            } catch (err) {
                                                                console.error(err);
                                                                if (err.message !== 'Picker cancelled') {
                                                                    alert('Drive upload failed: ' + err.message);
                                                                }
                                                            } finally {
                                                                setDriveLoading(false);
                                                            }
                                                        }}
                                                        style={{
                                                            padding: '12px 20px',
                                                            background: driveLoading ? '#9ca3af' : '#4285f4',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '8px',
                                                            cursor: driveLoading ? 'not-allowed' : 'pointer',
                                                            fontWeight: '600',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '10px'
                                                        }}
                                                    >
                                                        {driveLoading ? 'Uploading...' : '📂 Pick from Google Drive'}
                                                    </button>
                                                    {module.videoUrl && module.videoUrl.includes('/uploads/') && (
                                                        <p style={{ marginTop: '8px', color: '#059669', fontSize: '14px' }}>
                                                            ✓ File attached: {module.videoUrl.split('/').pop()}
                                                        </p>
                                                    )}
                                                </div>
                                            )}

                                            {module.videoType === 'UPLOAD' && (
                                                <div>
                                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                                                        Upload Video File
                                                    </label>
                                                    <input
                                                        type="file"
                                                        accept="video/*"
                                                        onChange={async (e) => {
                                                            const file = e.target.files[0];
                                                            if (!file) return;

                                                            try {
                                                                const formData = new FormData();
                                                                formData.append('file', file);

                                                                // Use type=video strict validation
                                                                const res = await api.upload('/upload?type=video', formData);
                                                                if (res.success) {
                                                                    handleModuleChange(moduleIndex, 'videoUrl', res.data.fileUrl);
                                                                    alert('Video uploaded successfully!');
                                                                }
                                                            } catch (err) {
                                                                console.error(err);
                                                                alert('Upload failed: ' + err.message);
                                                            }
                                                        }}
                                                        style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', width: '100%' }}
                                                    />
                                                    {module.videoUrl && module.videoUrl.includes('/uploads/') && (
                                                        <p style={{ marginTop: '8px', color: '#059669', fontSize: '14px' }}>
                                                            ✓ File attached: {module.videoUrl.split('/').pop()}
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Document Options */}
                                    {module.contentType === 'DOCUMENT' && (
                                        <div style={{ display: 'grid', gap: '16px', paddingLeft: '12px', borderLeft: '3px solid #f59e0b' }}>
                                            <div>
                                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                                                    Document Source
                                                </label>
                                                <select
                                                    value={module.documentType === 'URL' ? 'URL' : (module.documentType === 'DRIVE' ? 'DRIVE' : 'UPLOAD')}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        if (val === 'URL') handleModuleChange(moduleIndex, 'documentType', 'URL');
                                                        else if (val === 'DRIVE') handleModuleChange(moduleIndex, 'documentType', 'DRIVE');
                                                        else handleModuleChange(moduleIndex, 'documentType', 'pdf');
                                                    }}
                                                    style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', width: '200px' }}
                                                >
                                                    <option value="URL">External URL</option>
                                                    <option value="UPLOAD">Upload Document (Local)</option>
                                                    <option value="DRIVE">Google Drive</option>
                                                </select>
                                            </div>

                                            {(module.documentType === 'URL' || (!module.documentType && module.documentType !== 'DRIVE')) && (
                                                <FormField
                                                    label="Document URL *"
                                                    value={module.documentUrl}
                                                    onChange={(e) => handleModuleChange(moduleIndex, 'documentUrl', e.target.value)}
                                                    placeholder="https://example.com/file.pdf"
                                                />
                                            )}

                                            {module.documentType === 'DRIVE' && (
                                                <div>
                                                    <button
                                                        type="button"
                                                        disabled={!driveScriptsLoaded || driveLoading}
                                                        onClick={async () => {
                                                            if (!driveScriptsLoaded) {
                                                                alert('Google Drive is loading. Please wait.');
                                                                return;
                                                            }
                                                            setDriveLoading(true);
                                                            try {
                                                                const result = await drivePickerService.openPicker();
                                                                // Send to backend for download
                                                                const res = await api.post('/upload/drive', {
                                                                    fileId: result.fileId,
                                                                    fileName: result.name,
                                                                    mimeType: result.mimeType,
                                                                    accessToken: result.accessToken
                                                                });
                                                                if (res.success) {
                                                                    handleModuleChange(moduleIndex, 'documentUrl', res.data.fileUrl);
                                                                    alert('Document from Drive uploaded successfully!');
                                                                } else {
                                                                    throw new Error(res.message || 'Upload failed');
                                                                }
                                                            } catch (err) {
                                                                console.error(err);
                                                                if (err.message !== 'Picker cancelled') {
                                                                    alert('Drive upload failed: ' + err.message);
                                                                }
                                                            } finally {
                                                                setDriveLoading(false);
                                                            }
                                                        }}
                                                        style={{
                                                            padding: '12px 20px',
                                                            background: driveLoading ? '#9ca3af' : '#4285f4',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '8px',
                                                            cursor: driveLoading ? 'not-allowed' : 'pointer',
                                                            fontWeight: '600',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '10px'
                                                        }}
                                                    >
                                                        {driveLoading ? 'Uploading...' : '📂 Pick from Google Drive'}
                                                    </button>
                                                    {module.documentUrl && module.documentUrl.includes('/uploads/') && (
                                                        <p style={{ marginTop: '8px', color: '#059669', fontSize: '14px' }}>
                                                            ✓ File attached: {module.documentUrl.split('/').pop()}
                                                        </p>
                                                    )}
                                                </div>
                                            )}

                                            {(module.documentType !== 'URL' && module.documentType !== 'DRIVE') && (
                                                <div>
                                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                                                        Upload Document (PDF, DOC, DOCX, PPT, PPTX)
                                                    </label>
                                                    <input
                                                        type="file"
                                                        accept=".pdf,.doc,.docx,.ppt,.pptx"
                                                        onChange={async (e) => {
                                                            const file = e.target.files[0];
                                                            if (!file) return;

                                                            try {
                                                                const formData = new FormData();
                                                                formData.append('file', file);

                                                                // Strict type doc
                                                                const res = await api.upload('/upload?type=document', formData);
                                                                if (res.success) {
                                                                    handleModuleChange(moduleIndex, 'documentUrl', res.data.fileUrl);
                                                                    const ext = res.data.originalName.split('.').pop();
                                                                    handleModuleChange(moduleIndex, 'documentType', ext);
                                                                    alert('Document uploaded successfully!');
                                                                }
                                                            } catch (err) {
                                                                console.error(err);
                                                                alert('Upload failed: ' + err.message);
                                                            }
                                                        }}
                                                        style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', width: '100%' }}
                                                    />
                                                    {module.documentUrl && module.documentUrl.includes('/uploads/') && (
                                                        <p style={{ marginTop: '8px', color: '#059669', fontSize: '14px' }}>
                                                            ✓ File attached: {module.documentUrl.split('/').pop()}
                                                        </p>
                                                    )}
                                                </div>
                                            )}

                                            <div style={{ fontSize: '14px', color: '#6b7280' }}>
                                                ✨ Supported: PDF, DOC, DOCX, PPT, PPTX. All files are automatically converted to PDF for secure viewing.
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Description */}
                                <FormField
                                    label="Module Description"
                                    value={module.description}
                                    onChange={(e) => handleModuleChange(moduleIndex, 'description', e.target.value)}
                                    placeholder="Brief description of this module"
                                    multiline
                                />

                                {/* Theory Content */}
                                <div style={{ marginBottom: '24px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                                        Theory / Learning Content
                                    </label>
                                    <RichTextEditor
                                        content={module.theoryContent}
                                        onChange={(html) => handleModuleChange(moduleIndex, 'theoryContent', html)}
                                        placeholder="Detailed theory and explanation for this module..."
                                    />
                                </div>

                                {/* Document Attachment for Theory */}
                                <div style={{ marginTop: '16px', padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <label style={{ fontWeight: '600', color: '#374151', fontSize: '14px', margin: 0 }}>
                                                📎 Attach Document Link
                                            </label>
                                            <span style={{ fontSize: '12px', color: '#6b7280' }}>(Optional)</span>
                                        </div>

                                        {/* On/Off Toggle */}
                                        <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px', cursor: 'pointer' }}>
                                            <input
                                                type="checkbox"
                                                checked={!!module.documentUrl}
                                                onChange={(e) => {
                                                    if (!e.target.checked) {
                                                        handleModuleChange(moduleIndex, 'documentUrl', '');
                                                    } else {
                                                        handleModuleChange(moduleIndex, 'documentUrl', ' ');
                                                    }
                                                }}
                                                style={{ opacity: 0, width: 0, height: 0 }}
                                            />
                                            <span style={{
                                                position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                                                backgroundColor: module.documentUrl || (typeof module.documentUrl === 'string' && module.documentUrl.length >= 0 && module.documentUrl !== '') ? '#3b82f6' : '#ccc',
                                                transition: '.4s', borderRadius: '24px'
                                            }}></span>
                                            <span style={{
                                                position: 'absolute', content: '""', height: '18px', width: '18px', left: '3px', bottom: '3px',
                                                backgroundColor: 'white', transition: '.4s', borderRadius: '50%',
                                                transform: (module.documentUrl && module.documentUrl !== '') ? 'translateX(20px)' : 'translateX(0)'
                                            }}></span>
                                        </label>
                                    </div>

                                    {/* Toggle Content */}
                                    {(module.documentUrl !== undefined && module.documentUrl !== null && module.documentUrl !== '') && (
                                        <div>
                                            <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '12px' }}>
                                                Paste a direct link (Google Drive, Dropbox, etc.) for students to download.
                                            </p>

                                            <input
                                                type="text"
                                                value={module.documentUrl === ' ' ? '' : module.documentUrl}
                                                onChange={(e) => handleModuleChange(moduleIndex, 'documentUrl', e.target.value)}
                                                placeholder="Paste document URL here..."
                                                style={{
                                                    width: '100%',
                                                    padding: '10px 12px',
                                                    border: '1px solid #d1d5db',
                                                    borderRadius: '6px',
                                                    fontSize: '14px',
                                                    color: 'black'
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Quiz Section */}
                                <div style={{
                                    background: '#f8fafc',
                                    padding: '24px',
                                    borderRadius: '12px',
                                    border: '1px solid #e2e8f0'
                                }}>
                                    <h3 style={{
                                        fontSize: '18px',
                                        fontWeight: '600',
                                        marginBottom: '20px',
                                        color: '#1e293b',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}>
                                        📝 Quiz Builder
                                    </h3>

                                    {/* Quiz Title */}
                                    <div style={{ marginBottom: '20px' }}>
                                        <FormField
                                            label="Quiz Title"
                                            value={module.quiz.title}
                                            onChange={(e) => handleQuizChange(moduleIndex, 'title', e.target.value)}
                                            placeholder={`${module.title || 'Module'} Quiz`}
                                        />
                                    </div>

                                    {/* Questions */}
                                    {module.quiz.questions.map((question, questionIndex) => (
                                        <div
                                            key={questionIndex}
                                            style={{
                                                background: 'white',
                                                padding: '20px',
                                                borderRadius: '8px',
                                                marginBottom: '16px',
                                                border: '1px solid #e5e7eb'
                                            }}
                                        >
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                marginBottom: '16px'
                                            }}>
                                                <span style={{ fontWeight: '600', color: '#374151' }}>
                                                    Question {questionIndex + 1}
                                                </span>
                                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                                    <select
                                                        value={question.questionType}
                                                        onChange={(e) => handleQuestionChange(moduleIndex, questionIndex, 'questionType', e.target.value)}
                                                        style={{
                                                            padding: '6px 12px',
                                                            border: '1px solid #d1d5db',
                                                            borderRadius: '6px',
                                                            fontSize: '14px',
                                                            color: 'black'
                                                        }}
                                                    >
                                                        <option value="SINGLE_CORRECT">Single Correct</option>
                                                        <option value="MULTIPLE_CORRECT">Multiple Correct</option>
                                                    </select>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeQuestion(moduleIndex, questionIndex)}
                                                        style={{
                                                            padding: '6px 12px',
                                                            background: '#fee2e2',
                                                            border: 'none',
                                                            borderRadius: '6px',
                                                            cursor: 'pointer',
                                                            color: '#dc2626',
                                                            fontSize: '14px'
                                                        }}
                                                    >
                                                        🗑️ Remove
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Question Text */}
                                            <textarea
                                                value={question.questionText}
                                                onChange={(e) => handleQuestionChange(moduleIndex, questionIndex, 'questionText', e.target.value)}
                                                placeholder="Enter your question here..."
                                                style={{
                                                    width: '100%',
                                                    padding: '12px',
                                                    border: '1px solid #d1d5db',
                                                    borderRadius: '8px',
                                                    fontSize: '16px',
                                                    minHeight: '60px',
                                                    resize: 'vertical',
                                                    marginBottom: '16px',
                                                    color: 'black'
                                                }}
                                            />

                                            {/* Options */}
                                            <div style={{ marginBottom: '8px' }}>
                                                <span style={{ fontSize: '14px', color: '#6b7280' }}>
                                                    Options (check the correct answer{question.questionType === 'MULTIPLE_CORRECT' ? 's' : ''}):
                                                </span>
                                            </div>
                                            {question.options.map((option, optionIndex) => (
                                                <div
                                                    key={optionIndex}
                                                    style={{
                                                        display: 'flex',
                                                        gap: '12px',
                                                        alignItems: 'center',
                                                        marginBottom: '8px'
                                                    }}
                                                >
                                                    <input
                                                        type={question.questionType === 'SINGLE_CORRECT' ? 'radio' : 'checkbox'}
                                                        name={`question-${moduleIndex}-${questionIndex}`}
                                                        checked={option.isCorrect}
                                                        onChange={(e) => handleOptionChange(moduleIndex, questionIndex, optionIndex, 'isCorrect', e.target.checked)}
                                                        style={{
                                                            width: '20px',
                                                            height: '20px',
                                                            cursor: 'pointer'
                                                        }}
                                                    />
                                                    <input
                                                        type="text"
                                                        value={option.optionText}
                                                        onChange={(e) => handleOptionChange(moduleIndex, questionIndex, optionIndex, 'optionText', e.target.value)}
                                                        placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                                                        style={{
                                                            flex: 1,
                                                            padding: '10px 12px',
                                                            border: '1px solid #d1d5db',
                                                            borderRadius: '6px',
                                                            background: option.isCorrect ? '#d1fae5' : 'white',
                                                            color: 'black'
                                                        }}
                                                    />
                                                    {question.options.length > 2 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeOption(moduleIndex, questionIndex, optionIndex)}
                                                            style={{
                                                                padding: '8px',
                                                                background: '#f3f4f6',
                                                                border: 'none',
                                                                borderRadius: '6px',
                                                                cursor: 'pointer',
                                                                color: '#6b7280'
                                                            }}
                                                        >
                                                            ✕
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={() => addOption(moduleIndex, questionIndex)}
                                                style={{
                                                    padding: '6px 12px',
                                                    background: '#f3f4f6',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    fontSize: '14px',
                                                    marginTop: '8px'
                                                }}
                                            >
                                                + Add Option
                                            </button>
                                        </div>
                                    ))}

                                    {/* Add Question Button */}
                                    <button
                                        type="button"
                                        onClick={() => addQuestion(moduleIndex)}
                                        style={{
                                            width: '100%',
                                            padding: '14px',
                                            background: 'white',
                                            border: '2px dashed #d1d5db',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontSize: '16px',
                                            fontWeight: '500',
                                            color: '#6b7280',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px'
                                        }}
                                    >
                                        ➕ Add Question
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Actions */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: '12px',
                        marginTop: '24px'
                    }}>
                        <button
                            onClick={handlePrevStep}
                            style={{
                                padding: '14px 28px',
                                background: '#f3f4f6',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: '500'
                            }}
                        >
                            ← Back
                        </button>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={handleSaveDraft}
                                disabled={loading}
                                style={{
                                    padding: '14px 28px',
                                    background: '#fef3c7',
                                    color: '#d97706',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    fontWeight: '600'
                                }}
                            >
                                {loading ? 'Saving...' : '💾 Save as Draft'}
                            </button>
                            <button
                                onClick={handlePublish}
                                disabled={loading}
                                style={{
                                    padding: '14px 28px',
                                    background: '#10b981',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    fontWeight: '600'
                                }}
                            >
                                {loading ? 'Publishing...' : '🚀 Publish Course'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Form Field Component
function FormField({ label, value, onChange, placeholder, type = 'text', multiline = false, rows = 3 }) {
    const inputStyles = {
        width: '100%',
        padding: '12px',
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        fontSize: '16px',
        outline: 'none',
        color: 'black'
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
                    style={{ ...inputStyles, resize: 'vertical', minHeight: '80px' }}
                />
            ) : (
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    style={inputStyles}
                />
            )}
        </div>
    );
}
