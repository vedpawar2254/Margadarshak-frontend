"use client";

import React from 'react';
import AdminRouteGuard from '@/components/admin/AdminRouteGuard';

const AdminLayout = ({ children }) => {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <AdminRouteGuard>
          <div className="min-h-screen">
            {children}
          </div>
        </AdminRouteGuard>
      </body>
    </html>
  );
};

export default AdminLayout;