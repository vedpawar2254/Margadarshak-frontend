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
          router.push('/admin/login');
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (data.success) {
          const userEmail = data.data?.email;
          if (userEmail === 'namanjainpy@gmail.com') {
            setIsAdmin(true);
          } else {
            router.push('/admin/login');
          }
        } else {
          router.push('/admin/login');
        }
      } catch (error) {
        console.error('Error checking admin access:', error);
        router.push('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };

    // Skip check if on login page
    if (pathname === '/admin/login') {
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

  if (!isAdmin && pathname !== '/admin/login') {
    return null; // Will redirect in useEffect
  }

  return children;
};

export default AdminRouteGuard;