'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!email.trim()) {
      setError('Please enter your email address');
      setLoading(false);
      return;
    }

    if (!password.trim()) {
      setError('Please enter your password');
      setLoading(false);
      return;
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const token = await userCredential.user.getIdToken();
      
      // Store token in localStorage
      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminEmail', email.trim());
      
      router.push('/admin/dashboard');
    } catch (err: any) {
      // Handle specific Firebase errors with clear, user-friendly messages
      let errorMessage = 'Unable to sign in. Please check your credentials and try again.';
      
      // Authentication errors
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect email or password. Please check your credentials and try again.';
      } else if (err.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address. Please check your email and try again.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address format. Please enter a valid email address.';
      } else if (err.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled. Please contact support for assistance.';
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed login attempts. Please wait a few minutes and try again.';
      } else if (err.code === 'auth/network-request-failed') {
        errorMessage = 'Network connection error. Please check your internet connection and try again.';
      } else if (err.code === 'auth/operation-not-allowed') {
        errorMessage = 'Email/password sign-in is not enabled. Please contact support.';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please use a stronger password.';
      } else if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please use a different email or sign in.';
      } else if (err.code === 'auth/invalid-verification-code') {
        errorMessage = 'Invalid verification code. Please try again.';
      } else if (err.code === 'auth/invalid-verification-id') {
        errorMessage = 'Verification session expired. Please try again.';
      } else if (err.code === 'auth/missing-password') {
        errorMessage = 'Password is required. Please enter your password.';
      } else if (err.code === 'auth/quota-exceeded') {
        errorMessage = 'Service temporarily unavailable. Please try again later.';
      } else if (err.code === 'auth/app-deleted') {
        errorMessage = 'Application configuration error. Please contact support.';
      } else if (err.code === 'auth/app-not-authorized') {
        errorMessage = 'Application not authorized. Please contact support.';
      } else if (err.code === 'auth/argument-error') {
        errorMessage = 'Invalid input. Please check your email and password format.';
      } else if (err.code === 'auth/invalid-api-key') {
        errorMessage = 'Configuration error. Please contact support.';
      } else if (err.code === 'auth/invalid-user-token') {
        errorMessage = 'Session expired. Please sign in again.';
      } else if (err.code === 'auth/requires-recent-login') {
        errorMessage = 'Security verification required. Please sign in again.';
      } else if (err.message && err.message.includes('auth/')) {
        // Catch any other Firebase auth errors
        errorMessage = 'Authentication error. Please check your credentials and try again.';
      } else if (err.message) {
        // Generic error message for non-Firebase errors
        errorMessage = 'Unable to sign in. Please try again.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-md border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            ← Home
          </Link>
        </div>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Admin Login</h1>
          <p className="text-gray-600 dark:text-gray-300">Sign in to access the admin dashboard</p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 caret-teal-600"
              placeholder="admin@purity.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 caret-teal-600"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}



