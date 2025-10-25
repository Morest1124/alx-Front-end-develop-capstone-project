import React from "react";

const AuthLayout = ({ title, children }) => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 py-12">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">{title}</h2>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
