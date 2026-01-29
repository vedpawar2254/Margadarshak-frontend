'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function GoogleCallbackPage() {
  const { handleGoogleCallback } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Handle the Google OAuth callback
    handleGoogleCallback();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#02599C] mx-auto mb-4"></div>
        <p className="text-gray-600">Processing Google login...</p>
      </div>
    </div>
  );
}