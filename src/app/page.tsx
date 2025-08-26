'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import PromptAnalyzer from '@/components/PromptAnalyzer';
import ExamplesShowcase from '@/components/ExamplesShowcase';

export default function Home() {
  const { user, startGuestSession, logout } = useAuth();
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [activeTab, setActiveTab] = useState<'analyzer' | 'examples' | 'dashboard'>('analyzer');

  const handleExampleSelect = (prompt: string) => {
    setCurrentPrompt(prompt);
    setActiveTab('analyzer');
  };

  const handleGetStarted = () => {
    if (!user) {
      startGuestSession();
    }
    setActiveTab('analyzer');
  };

  const getUserDisplayName = () => {
    if (!user) return null;
    if ('isGuest' in user) return 'Guest';
    return user.username;
  };

  const getUserStats = () => {
    if (!user) return null;
    if ('isGuest' in user) {
      return {
        level: 1,
        xp: 0,
        promptsAnalyzed: user.tempPromptHistory.length,
        achievements: 0
      };
    }
    return {
      level: user.level,
      xp: user.totalXP,
      promptsAnalyzed: user.promptHistory.length,
      achievements: user.achievements.length
    };
  };

  const stats = getUserStats();

  if (!user) {
    // Landing/Welcome Screen
    return (
      <div className="min-h-screen flex flex-col">
        {/* Hero Section */}
        <header className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Main Title */}
            <div className="space-y-4">
              <div className="text-6xl md:text-8xl mb-4">🎯</div>
              <h1 className="text-4xl md:text-6xl font-bold text-white text-glow">
                AI Prompt Trainer
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
                Master the art of AI communication through gamified learning
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="glass rounded-xl p-6 card-hover">
                <div className="text-3xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-white mb-2">Real-time Analysis</h3>
                <p className="text-gray-400">Get instant feedback on your prompts with detailed scoring and suggestions</p>
              </div>
              
              <div className="glass rounded-xl p-6 card-hover">
                <div className="text-3xl mb-4">🏆</div>
                <h3 className="text-xl font-semibold text-white mb-2">Gamification</h3>
                <p className="text-gray-400">Unlock achievements, track progress, and level up your AI skills</p>
              </div>
              
              <div className="glass rounded-xl p-6 card-hover">
                <div className="text-3xl mb-4">📚</div>
                <h3 className="text-xl font-semibold text-white mb-2">Learn by Example</h3>
                <p className="text-gray-400">Study before/after examples to understand what makes great prompts</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
              <button
                onClick={handleGetStarted}
                className="btn-hover px-8 py-4 bg-gradient-to-r from-primary to-secondary 
                         text-white font-bold rounded-xl text-lg warm-glow-strong"
              >
                🚀 Start Training (Guest)
              </button>
              
              <a 
                href="/auth"
                className="btn-hover px-8 py-4 glass border border-primary/30 
                         text-primary font-semibold rounded-xl text-lg"
              >
                Sign Up for Full Experience
              </a>
            </div>

            {/* Quick Preview */}
            <div className="mt-16 glass rounded-xl p-6 text-left max-w-2xl mx-auto">
              <h4 className="text-lg font-semibold text-white mb-4">Try a sample analysis:</h4>
              <div className="bg-muted/50 rounded-lg p-4 mb-4 font-mono text-sm text-gray-300">
                &ldquo;Write something about AI&rdquo;
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-red-400 font-bold">25%</div>
                  <div className="text-xs text-gray-400">Score</div>
                </div>
                <div>
                  <div className="text-orange-400 font-bold">4</div>
                  <div className="text-xs text-gray-400">Tokens</div>
                </div>
                <div>
                  <div className="text-red-400 font-bold">Poor</div>
                  <div className="text-xs text-gray-400">Quality</div>
                </div>
                <div>
                  <div className="text-yellow-400 font-bold">5</div>
                  <div className="text-xs text-gray-400">Tips</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Footer */}
        <footer className="border-t border-border/50 py-6 px-4">
          <div className="max-w-4xl mx-auto text-center text-gray-400 text-sm">
            <p>Built with Next.js, TypeScript, and Tailwind CSS • Zero cost hosting on Vercel</p>
          </div>
        </footer>
      </div>
    );
  }

  // Main Application Interface
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Header */}
      <header className="glass border-b border-border/50 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-white">🎯 AI Prompt Trainer</h1>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex space-x-1">
            <button
              onClick={() => setActiveTab('analyzer')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'analyzer'
                  ? 'bg-primary text-white'
                  : 'text-gray-300 hover:text-white hover:bg-muted/50'
              }`}
            >
              🎯 Analyzer
            </button>
            <button
              onClick={() => setActiveTab('examples')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'examples'
                  ? 'bg-primary text-white'
                  : 'text-gray-300 hover:text-white hover:bg-muted/50'
              }`}
            >
              📖 Examples
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-primary text-white'
                  : 'text-gray-300 hover:text-white hover:bg-muted/50'
              }`}
            >
              📊 Progress
            </button>
          </nav>

          {/* User Info */}
          <div className="flex items-center space-x-4">
            {stats && (
              <div className="hidden sm:flex items-center space-x-4 text-sm">
                <div className="text-gray-300">
                  <span className="text-secondary font-semibold">Lv.{stats.level}</span>
                </div>
                <div className="text-gray-300">
                  <span className="text-primary font-semibold">{stats.xp} XP</span>
                </div>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <span className="text-gray-300">
                {getUserDisplayName()}
              </span>
              <button
                onClick={logout}
                className="text-gray-400 hover:text-white transition-colors p-1"
                title="Logout"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'analyzer' && (
            <div className="space-y-8">
              <PromptAnalyzer 
                key={currentPrompt} 
                initialPrompt={currentPrompt}
              />
            </div>
          )}

          {activeTab === 'examples' && (
            <ExamplesShowcase onExampleSelect={handleExampleSelect} />
          )}

          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white text-center">📊 Your Progress</h2>
              
              {stats && (
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="glass rounded-xl p-6 text-center">
                    <div className="text-3xl mb-2">🏆</div>
                    <div className="text-2xl font-bold text-secondary">{stats.level}</div>
                    <div className="text-gray-400">Level</div>
                  </div>
                  
                  <div className="glass rounded-xl p-6 text-center">
                    <div className="text-3xl mb-2">⚡</div>
                    <div className="text-2xl font-bold text-primary">{stats.xp}</div>
                    <div className="text-gray-400">Total XP</div>
                  </div>
                  
                  <div className="glass rounded-xl p-6 text-center">
                    <div className="text-3xl mb-2">📝</div>
                    <div className="text-2xl font-bold text-blue-400">{stats.promptsAnalyzed}</div>
                    <div className="text-gray-400">Prompts Analyzed</div>
                  </div>
                  
                  <div className="glass rounded-xl p-6 text-center">
                    <div className="text-3xl mb-2">🎖️</div>
                    <div className="text-2xl font-bold text-yellow-400">{stats.achievements}</div>
                    <div className="text-gray-400">Achievements</div>
                  </div>
                </div>
              )}

              {'isGuest' in user && (
                <div className="glass rounded-xl p-6 text-center">
                  <h3 className="text-xl font-semibold text-white mb-4">Unlock Your Full Potential</h3>
                  <p className="text-gray-400 mb-6">
                    Create an account to save your progress, unlock achievements, and track your improvement over time.
                  </p>
                  <a
                    href="/auth"
                    className="btn-hover px-6 py-3 bg-gradient-to-r from-primary to-secondary 
                             text-white font-semibold rounded-lg"
                  >
                    Create Account
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
