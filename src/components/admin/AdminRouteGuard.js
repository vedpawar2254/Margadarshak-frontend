"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

const AdminRouteGuard = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        // Debug logging
        console.log('🔍 Profile response:', JSON.stringify(data, null, 2));
        console.log('📋 Data structure:', JSON.stringify(data, null, 2));
        console.log('✅ Success:', data.success);
        console.log('📧 Data type:', typeof data.data);

        if (data.success) {
          const userEmail = data.data?.email;
          const studentEmail = data.data?.student?.email || data.data?.email;

          console.log('📧 Extracted email:', userEmail);
          console.log('📧 Student email:', studentEmail);
          console.log('✅ Admin check:', studentEmail === 'namanjainpy@gmail.com');

          if (studentEmail === 'namanjainpy@gmail.com') {
            console.log('✅ Admin confirmed');
            setIsAdmin(true);
          } else {
            console.log('❌ Not admin, redirecting to login');
            router.push('/login');
          }
        } else {
          console.log('❌ API failed, redirecting to login');
          router.push('/login');
        }
      } catch (error) {
        console.error('Error checking admin access:', error);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    // Skip check if on login page
    if (pathname === '/login') {
      setIsLoading(false);
      return;
    }

    checkAdminAccess();
  }, [router, pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  if (!isAdmin && pathname !== '/login') {
    return null; // Will redirect in useEffect
  }

  return children;
};

export default AdminRouteGuard;