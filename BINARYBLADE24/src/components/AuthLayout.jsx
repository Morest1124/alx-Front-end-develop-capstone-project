import React from "react";

const AuthLayout = ({ title, children }) => {
  return (
    <div className="relative flex justify-center items-center min-h-screen overflow-hidden bg-gradient-to-br from-[var(--color-primary-bg)] via-[var(--color-accent-light)] to-[var(--color-secondary-light)]">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Orb 1 - Cyan */}
        <div className="absolute top-0 -left-20 w-96 h-96 bg-[var(--color-accent)] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>

        {/* Orb 2 - Blue */}
        <div className="absolute top-0 -right-20 w-96 h-96 bg-[var(--color-secondary)] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

        {/* Orb 3 - Purple */}
        <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Glassmorphism Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Decorative Elements */}
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-[var(--color-accent)] rounded-full filter blur-2xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[var(--color-secondary)] rounded-full filter blur-2xl opacity-20 animate-pulse animation-delay-1000"></div>

        {/* Main Card */}
        <div className="relative backdrop-blur-xl bg-white/80 rounded-3xl shadow-2xl border border-white/20 p-8 space-y-6 transform transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl">
          {/* Logo/Icon Area */}
          <div className="flex justify-center mb-2">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-secondary)] rounded-2xl blur-lg opacity-50 animate-pulse"></div>
              <div className="relative w-16 h-16 bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-secondary)] rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-secondary)] bg-clip-text text-transparent mb-2">
              {title}
            </h2>
            <p className="text-gray-600 text-sm">Welcome back! Please enter your details.</p>
          </div>

          {/* Form Content */}
          {children}
        </div>

        {/* Bottom Glow */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-3/4 h-8 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-secondary)] rounded-full filter blur-2xl opacity-20"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[var(--color-accent)] rounded-full animate-float"></div>
        <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-[var(--color-secondary)] rounded-full animate-float animation-delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-purple-400 rounded-full animate-float animation-delay-2000"></div>
        <div className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-[var(--color-accent)] rounded-full animate-float animation-delay-3000"></div>
      </div>
    </div>
  );
};

export default AuthLayout;
