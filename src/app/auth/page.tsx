'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, signup } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      let success = false;
      
      if (mode === 'login') {
        success = await login(formData.username, formData.password);
        if (!success) {
          setError('Invalid username or password');
        }
      } else {
        if (!formData.email) {
          setError('Email is required');
          return;
        }
        success = await signup(formData.username, formData.email, formData.password);
        if (!success) {
          setError('Username or email already exists');
        }
      }

      if (success) {
        router.push('/');
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-8">
      <div className="content-container">
        <div className="max-w-md w-full mx-auto element-spacing">
        {/* Header */}
        <div className="text-center">
          <div className="text-4xl mb-4">🎯</div>
          <h2 className="text-3xl font-bold text-white">
            {mode === 'login' ? 'Welcome Back' : 'Join AI Prompt Trainer'}
          </h2>
          <p className="mt-2 text-gray-400">
            {mode === 'login' 
              ? 'Sign in to continue your learning journey' 
              : 'Create your account to unlock achievements and track progress'
            }
          </p>
        </div>

        {/* Auth Form */}
        <div className="glass rounded-xl ">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <span className="text-red-400">❌</span>
                  <span className="text-sm text-red-200">{error}</span>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-input border border-border rounded-lg 
                         text-white placeholder-gray-400 focus:ring-2 focus:ring-primary 
                         focus:border-transparent transition-all"
                placeholder="Enter your username"
              />
            </div>

            {mode === 'signup' && (
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg 
                           text-white placeholder-gray-400 focus:ring-2 focus:ring-primary 
                           focus:border-transparent transition-all"
                  placeholder="Enter your email"
                />
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-input border border-border rounded-lg 
                         text-white placeholder-gray-400 focus:ring-2 focus:ring-primary 
                         focus:border-transparent transition-all"
                placeholder="Enter your password"
                minLength={6}
              />
              {mode === 'signup' && (
                <p className="mt-1 text-xs text-gray-400">
                  Password must be at least 6 characters long
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-hover btn bg-gradient-to-r from-primary to-secondary 
                       text-white font-semibold rounded-lg disabled:opacity-50 
                       disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 rounded-full spinner"></div>
                  <span>{mode === 'login' ? 'Signing in...' : 'Creating account...'}</span>
                </div>
              ) : (
                mode === 'login' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          {/* Mode Toggle */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
              {' '}
              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'login' ? 'signup' : 'login');
                  setError('');
                  setFormData({ username: '', email: '', password: '' });
                }}
                className="text-primary hover:text-secondary transition-colors font-medium"
              >
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>

          {/* Guest Option */}
          <div className="mt-4 pt-4 border-t border-border/50 text-center">
            <button
              onClick={() => router.push('/')}
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              ← Continue as Guest
            </button>
          </div>
        </div>

        {/* Features Reminder */}
        <div className="glass rounded-xl ">
          <h3 className="text-lg font-semibold text-white mb-4 text-center">
            🚀 Unlock with Account
          </h3>
          <div className="grid gap-3 text-sm">
            <div className="flex items-center space-x-3 text-gray-300">
              <span className="text-primary">🏆</span>
              <span>Earn achievements and unlock badges</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-300">
              <span className="text-primary">📊</span>
              <span>Track your progress over time</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-300">
              <span className="text-primary">⚡</span>
              <span>Gain XP and level up your skills</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-300">
              <span className="text-primary">💾</span>
              <span>Save your prompt history</span>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}