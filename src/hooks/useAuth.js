"use client";

/**
 * useAuth hook - Re-export from AuthContext
 * 
 * This file exists for backward compatibility.
 * All auth logic now lives in AuthContext.js
 * 
 * Usage remains the same:
 * const { user, login, logout } = useAuth();
 */

export { useAuth } from '@/contexts/AuthContext';
