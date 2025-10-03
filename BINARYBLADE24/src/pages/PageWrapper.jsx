import React from 'react';

const PageWrapper = ({ title, children }) => (
  <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
    <h1 className="text-3xl font-extrabold text-gray-900 mb-6 border-b pb-2">{title}</h1>
    {children}
  </div>
);

export default PageWrapper;