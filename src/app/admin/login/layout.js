import React from 'react';

const AdminLoginLayout = ({ children }) => {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
};

export default AdminLoginLayout;