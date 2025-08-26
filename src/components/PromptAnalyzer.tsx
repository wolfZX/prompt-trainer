'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { PromptScorer } from '@/lib/prompt-scorer';
import { AchievementSystem } from '@/lib/achievements';
import { useAuth } from '@/contexts/AuthContext';
import { PromptAnalysis, PromptAnalysisResult, Achievement, GuestUser } from '@/types';

interface PromptAnalyzerProps {
  onAnalysisComplete?: (analysis: PromptAnalysisResult) => void;
  initialPrompt?: string;
}

export default function PromptAnalyzer({ onAnalysisComplete, initialPrompt }: PromptAnalyzerProps) {
  const { user, updateUser, updateGuestUser } = useAuth();
  const [prompt, setPrompt] = useState(initialPrompt || '');
  const [analysis, setAnalysis] = useState<PromptAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);

  const analyzePrompt = useCallback(async () => {
    if (!prompt.trim()) return;

    setIsAnalyzing(true);
    
    // Simulate slight delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      const promptAnalysis = PromptScorer.analyzePrompt(prompt);
      setAnalysis(promptAnalysis);

      // Create analysis result
      const analysisResult: PromptAnalysisResult = {
        id: Date.now().toString(),
        prompt: prompt.trim(),
        analysis: promptAnalysis,
        timestamp: new Date(),
        xpEarned: 0,
        achievementsUnlocked: []
      };

      if (user) {
        if ('isGuest' in user) {
          // Handle guest user
          const achievements = AchievementSystem.checkAchievements(user, analysisResult);
          const xpEarned = AchievementSystem.calculateXP(analysisResult, achievements);
          
          const updatedResult = {
            ...analysisResult,
            xpEarned,
            achievementsUnlocked: achievements
          };

          const updatedGuestUser: GuestUser = {
            ...user,
            tempPromptHistory: [...user.tempPromptHistory, updatedResult]
          };

          updateGuestUser(updatedGuestUser);
          setNewAchievements(achievements);
        } else {
          // Handle registered user
          const updatedUser = AchievementSystem.updateUserProgress(user, analysisResult);
          updateUser(updatedUser);
          
          const lastAnalysis = updatedUser.promptHistory[updatedUser.promptHistory.length - 1];
          setNewAchievements(lastAnalysis.achievementsUnlocked);
        }
      }

      onAnalysisComplete?.(analysisResult);
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [prompt, user, updateUser, updateGuestUser, onAnalysisComplete]);

  // Auto-analyze on Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      analyzePrompt();
    }
  };

  // Show achievement notifications
  useEffect(() => {
    if (newAchievements.length > 0) {
      const timer = setTimeout(() => {
        setNewAchievements([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [newAchievements]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400';
    if (score >= 80) return 'text-blue-400';
    if (score >= 65) return 'text-yellow-400';
    if (score >= 45) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 90) return 'from-emerald-500 to-green-400';
    if (score >= 80) return 'from-blue-500 to-cyan-400';
    if (score >= 65) return 'from-yellow-500 to-amber-400';
    if (score >= 45) return 'from-orange-500 to-yellow-400';
    return 'from-red-500 to-orange-400';
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Achievement Notifications */}
      {newAchievements.length > 0 && (
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {newAchievements.map((achievement) => (
            <div
              key={achievement.id}
              className="achievement-badge glass-dark rounded-lg p-4 max-w-sm toast"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{achievement.icon}</span>
                <div>
                  <h4 className="font-semibold text-white">{achievement.title}</h4>
                  <p className="text-sm text-gray-300">{achievement.description}</p>
                  <span className="text-xs text-orange-400">+{achievement.xpReward} XP</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Prompt Input */}
      <div className="glass rounded-xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Analyze Your Prompt</h2>
          <div className="text-sm text-gray-400">
            Press Ctrl/Cmd + Enter to analyze
          </div>
        </div>
        
        <div className="space-y-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Enter your AI prompt here... Be specific about what you want the AI to do!"
            className="w-full min-h-32 p-4 bg-input border border-border rounded-lg 
                     text-white placeholder-gray-400 focus:ring-2 focus:ring-primary 
                     focus:border-transparent resize-y transition-all duration-200"
          />
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Characters: {prompt.length} | Words: {prompt.trim().split(/\s+/).filter(w => w.length > 0).length}
            </div>
            
            <button
              onClick={analyzePrompt}
              disabled={!prompt.trim() || isAnalyzing}
              className="btn-hover px-6 py-2 bg-gradient-to-r from-primary to-secondary 
                       text-white font-semibold rounded-lg disabled:opacity-50 
                       disabled:cursor-not-allowed disabled:transform-none"
            >
              {isAnalyzing ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full spinner"></div>
                  <span>Analyzing...</span>
                </div>
              ) : (
                'Analyze Prompt'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6">
          {/* Overall Score */}
          <div className="glass rounded-xl ">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold text-white">Overall Score</h3>
              
              <div className="relative">
                <div className={`text-6xl font-bold ${getScoreColor(analysis.score)} text-glow`}>
                  {analysis.score}
                </div>
                <div className="text-lg text-gray-400 mt-2">
                  {analysis.quality.charAt(0).toUpperCase() + analysis.quality.slice(1)} Quality
                </div>
              </div>

              {/* Progress Ring */}
              <div className="relative w-32 h-32 mx-auto">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-gray-700"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    stroke="url(#scoreGradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={314}
                    strokeDashoffset={314 - (314 * analysis.score) / 100}
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" className={`stop-color-${getScoreGradient(analysis.score).split(' ')[0].replace('from-', '')}`} />
                      <stop offset="100%" className={`stop-color-${getScoreGradient(analysis.score).split(' ')[1].replace('to-', '')}`} />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-2xl font-bold ${getScoreColor(analysis.score)}`}>
                    {analysis.score}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Feedback */}
          <div className="grid md:grid-cols-2 ga">
            {/* Feedback Scores */}
            <div className="glass rounded-xl  space-y-4">
              <h4 className="text-lg font-semibold text-white mb-4">Detailed Breakdown</h4>
              
              {Object.entries(analysis.feedback).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="capitalize text-gray-300">{key}</span>
                    <span className={`font-semibold ${getScoreColor(value)}`}>{value}%</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${getScoreGradient(value)} transition-all duration-1000 ease-out progress-bar`}
                      style={{ '--progress-value': `${value}%` } as React.CSSProperties}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Token Information */}
            <div className="glass rounded-xl  space-y-4">
              <h4 className="text-lg font-semibold text-white mb-4">Token Analysis</h4>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Estimated Tokens</span>
                  <span className="font-semibold text-white">{analysis.tokenCount}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Category</span>
                  <span className="capitalize font-semibold text-secondary">
                    {analysis.category.replace('_', ' ')}
                  </span>
                </div>
                
                {analysis.isNearLimit && (
                  <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <span className="text-yellow-400">⚠️</span>
                      <span className="text-sm text-yellow-200">Approaching token limit</span>
                    </div>
                  </div>
                )}
                
                {analysis.isAtLimit && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <span className="text-red-400">🚨</span>
                      <span className="text-sm text-red-200">Token limit exceeded</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Suggestions */}
          {analysis.suggestions.length > 0 && (
            <div className="glass rounded-xl ">
              <h4 className="text-lg font-semibold text-white mb-4">💡 Suggestions for Improvement</h4>
              
              <div className="space-y-3">
                {analysis.suggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">{index + 1}</span>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">{suggestion}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}