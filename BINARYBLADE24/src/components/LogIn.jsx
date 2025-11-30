import React, { useState, useContext } from 'react';
import { Link } from '../contexts/Routers';
import { AuthContext } from '../contexts/AuthContext';
import AuthLayout from './AuthLayout';

const LogIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Get loading and error states from the context
  const { login, loading, error } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // The context now handles navigation and user state
      await login({ email, password });
    } catch (err) {
      // The context will set the error state, so we just need to catch the rejection
      console.error("Caught login error in component:", err);
    }
  };

  return (
    <AuthLayout title="Log In">
      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
            required
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
            required
            disabled={loading}
          />
        </div>
        <div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-medium text-white bg-[var(--color-accent)] rounded-md hover:bg-[var(--color-accent-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-accent)] disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </div>
      </form>
      <p className="text-sm text-center text-gray-600">
        Don't have an account?{' '}
        <Link to="/signup" className="font-medium text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]">
          Sign Up
        </Link>
      </p>
    </AuthLayout>
  );
};

export default LogIn;