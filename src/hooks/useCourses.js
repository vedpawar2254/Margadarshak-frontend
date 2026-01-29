'use client';

import { useState, useCallback } from 'react';
import { api } from '@/services/api';

/**
 * Custom hook for course-related API interactions
 */
export function useCourses() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Fetch all published courses (for students)
     */
    const getPublishedCourses = useCallback(async (filters = {}) => {
        try {
            setLoading(true);
            setError(null);

            const { page = 1, limit = 12, search, category, level } = filters;
            let url = `/courses/published?page=${page}&limit=${limit}`;

            if (search) url += `&search=${encodeURIComponent(search)}`;
            if (category) url += `&category=${encodeURIComponent(category)}`;
            if (level) url += `&level=${encodeURIComponent(level)}`;

            const response = await api.get(url);
            return response.data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Fetch all courses (for admin)
     */
    const getAllCourses = useCallback(async (filters = {}) => {
        try {
            setLoading(true);
            setError(null);

            const { page = 1, limit = 10, search } = filters;
            let url = `/courses?page=${page}&limit=${limit}`;

            if (search) url += `&search=${encodeURIComponent(search)}`;

            const response = await api.get(url);
            return response.data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Fetch a single course by ID
     */
    const getCourse = useCallback(async (courseId) => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.get(`/courses/${courseId}`);
            return response.data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Create a bulk course with modules and quizzes
     */
    const createBulkCourse = useCallback(async (courseData) => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.post('/courses/bulk-create', courseData);
            return response.data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Publish a course
     */
    const publishCourse = useCallback(async (courseId) => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.patch(`/courses/${courseId}/publish`);
            return response.data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Unpublish a course
     */
    const unpublishCourse = useCallback(async (courseId) => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.patch(`/courses/${courseId}/unpublish`);
            return response.data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Delete a course
     */
    const deleteCourse = useCallback(async (courseId) => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.delete(`/courses/${courseId}`);
            return response.data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Validate a course for publishing
     */
    const validateCourse = useCallback(async (courseId) => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.get(`/courses/${courseId}/validation`);
            return response.data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Enroll in a course
     */
    const enrollInCourse = useCallback(async (courseId) => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.post(`/courses/courses/${courseId}/enroll`);
            return response.data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Get student's course progress
     */
    const getCourseProgress = useCallback(async (courseId) => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.get(`/courses/${courseId}/my-progress`);
            return response.data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Update module progress
     */
    const updateModuleProgress = useCallback(async (moduleId, progressData) => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.patch(`/courses/modules/${moduleId}/progress`, progressData);
            return response.data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Get module quizzes
     */
    const getModuleQuizzes = useCallback(async (moduleId) => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.get(`/courses/modules/${moduleId}/quizzes`);
            return response.data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Get quiz with questions
     */
    const getQuiz = useCallback(async (quizId) => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.get(`/courses/quizzes/${quizId}`);
            return response.data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Submit quiz results
     */
    const submitQuizResult = useCallback(async (quizId, resultData) => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.post(`/courses/quizzes/${quizId}/results`, resultData);
            return response.data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Get student's enrollments
     */
    const getMyEnrollments = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.get('/courses/enrollments/my-courses');
            return response.data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Check certificate eligibility for a course
     */
    const checkCertificateEligibility = useCallback(async (courseId) => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.get(`/courses/courses/${courseId}/certificate-eligibility`);
            return response.data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Generate certificate for a course
     */
    const generateCertificate = useCallback(async (courseId) => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.post(`/courses/courses/${courseId}/certificates`);
            return response.data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Get certificate for a course
     */
    const getCertificate = useCallback(async (courseId) => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.get(`/courses/courses/${courseId}/certificates`);
            return response.data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Get all student's certificates
     */
    const getMyCertificates = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.get('/courses/certificates');
            return response.data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        getPublishedCourses,
        getAllCourses,
        getCourse,
        createBulkCourse,
        publishCourse,
        unpublishCourse,
        deleteCourse,
        validateCourse,
        enrollInCourse,
        getCourseProgress,
        updateModuleProgress,
        getModuleQuizzes,
        getQuiz,
        submitQuizResult,
        getMyEnrollments,
        checkCertificateEligibility,
        generateCertificate,
        getCertificate,
        getMyCertificates
    };
}

export default useCourses;
