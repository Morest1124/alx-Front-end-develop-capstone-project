import React, { useState, useContext } from 'react';
import { Link } from '../contexts/Routers';
import { AuthContext } from '../contexts/AuthContext';
import AuthLayout from './AuthLayout';
import Loader from './Loader';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

const LogIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focusedField, setFocusedField] = useState(null);
  const { login, loading, error } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });
    } catch (err) {
      console.error("Caught login error in component:", err);
    }
  };

  return (
    <AuthLayout title="Log In">
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 animate-shake">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Email Field */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Email Address
          </label>
          <div className="relative group">
            <div className={`absolute inset-0 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-secondary)] rounded-xl blur-sm opacity-0 group-hover:opacity-20 transition-opacity duration-300 ${focusedField === 'email' ? 'opacity-30' : ''}`}></div>
            <div className="relative flex items-center">
              <Mail className={`absolute left-4 w-5 h-5 transition-colors duration-300 ${focusedField === 'email' ? 'text-[var(--color-accent)]' : 'text-gray-400'}`} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                placeholder="you@example.com"
                className="w-full pl-12 pr-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:border-[var(--color-accent)] focus:bg-white transition-all duration-300 placeholder:text-gray-400"
                required
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Password
          </label>
          <div className="relative group">
            <div className={`absolute inset-0 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-secondary)] rounded-xl blur-sm opacity-0 group-hover:opacity-20 transition-opacity duration-300 ${focusedField === 'password' ? 'opacity-30' : ''}`}></div>
            <div className="relative flex items-center">
              <Lock className={`absolute left-4 w-5 h-5 transition-colors duration-300 ${focusedField === 'password' ? 'text-[var(--color-accent)]' : 'text-gray-400'}`} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:border-[var(--color-accent)] focus:bg-white transition-all duration-300 placeholder:text-gray-400"
                required
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* Forgot Password Link */}
        <div className="flex justify-end">
          <Link
            to="/forgot-password"
            className="text-sm font-medium text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-secondary)] rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
          <button
            type="submit"
            className="relative w-full px-6 py-3.5 font-semibold text-white bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-secondary)] rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader size="small" color="white" />
                <span>Logging in...</span>
              </>
            ) : (
              <>
                <span>Log In</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Sign Up Link */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white/80 text-gray-500">or</span>
        </div>
      </div>

      <p className="text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Link
          to="/signup"
          className="font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors inline-flex items-center gap-1 group"
        >
          Sign Up
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        </Link>
      </p>
    </AuthLayout>
  );
};

export default LogIn;