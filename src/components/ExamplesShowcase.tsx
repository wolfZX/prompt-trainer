'use client';

import React, { useState } from 'react';
import { PROMPT_EXAMPLES, getExamplesByCategory } from '@/lib/examples';
import { PromptExample, PromptCategory } from '@/types';

interface ExamplesShowcaseProps {
  onExampleSelect?: (prompt: string) => void;
}

export default function ExamplesShowcase({ onExampleSelect }: ExamplesShowcaseProps) {
  const [selectedCategory, setSelectedCategory] = useState<PromptCategory | 'all'>('all');
  const [selectedExample, setSelectedExample] = useState<PromptExample | null>(null);

  const categories = [
    { key: 'all', label: 'All Categories', icon: '🎯' },
    { key: PromptCategory.CREATIVE, label: 'Creative', icon: '🎨' },
    { key: PromptCategory.TECHNICAL, label: 'Technical', icon: '⚙️' },
    { key: PromptCategory.CODING, label: 'Coding', icon: '💻' },
    { key: PromptCategory.ANALYTICAL, label: 'Analytical', icon: '📊' },
    { key: PromptCategory.INSTRUCTIONAL, label: 'Instructional', icon: '📚' },
    { key: PromptCategory.CONVERSATIONAL, label: 'Conversational', icon: '💬' },
  ];

  const filteredExamples = selectedCategory === 'all' 
    ? PROMPT_EXAMPLES 
    : getExamplesByCategory(selectedCategory);

  const handleExampleSelect = (prompt: string) => {
    onExampleSelect?.(prompt);
  };


  const getScoreBadgeColor = (score: number) => {
    if (score >= 90) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    if (score >= 80) return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    if (score >= 65) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    if (score >= 45) return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    return 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-white text-glow">
          📖 Before & After Examples
        </h2>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Learn from real examples showing the difference between poor and excellent prompts. 
          See exactly what makes a prompt effective.
        </p>
      </div>

      {/* Category Filter */}
      <div className="glass rounded-xl p-6">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((category) => (
            <button
              key={category.key}
              onClick={() => setSelectedCategory(category.key as PromptCategory | 'all')}
              className={`btn-hover px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedCategory === category.key
                  ? 'bg-gradient-to-r from-primary to-secondary text-white warm-glow'
                  : 'glass text-gray-300 hover:text-white'
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Examples Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {filteredExamples.map((example) => (
          <div key={example.id} className="glass rounded-xl p-6 space-y-6 card-hover">
            {/* Example Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">{example.title}</h3>
              <span className="text-2xl">
                {categories.find(c => c.key === example.category)?.icon}
              </span>
            </div>

            {/* Before/After Comparison */}
            <div className="grid gap-4">
              {/* Poor Example */}
              <div className="border border-red-500/30 rounded-lg overflow-hidden">
                <div className="bg-red-500/10 px-4 py-2 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-red-400">❌</span>
                    <span className="font-medium text-red-300">Poor Example</span>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs border ${getScoreBadgeColor(example.poorExample.score)}`}>
                    {example.poorExample.score}%
                  </span>
                </div>
                <div className="p-4">
                  <div className="bg-muted/30 rounded p-3 mb-3 font-mono text-sm text-gray-300">
                    &ldquo;{example.poorExample.prompt}&rdquo;
                  </div>
                  <div className="space-y-2">
                    <h5 className="font-medium text-red-300 text-sm">Issues:</h5>
                    <ul className="space-y-1">
                      {example.poorExample.issues.map((issue, index) => (
                        <li key={index} className="text-xs text-gray-400 flex items-start">
                          <span className="text-red-400 mr-2 flex-shrink-0">•</span>
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Good Example */}
              <div className="border border-emerald-500/30 rounded-lg overflow-hidden">
                <div className="bg-emerald-500/10 px-4 py-2 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-emerald-400">✅</span>
                    <span className="font-medium text-emerald-300">Improved Example</span>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs border ${getScoreBadgeColor(example.goodExample.score)}`}>
                    {example.goodExample.score}%
                  </span>
                </div>
                <div className="p-4">
                  <div className="bg-muted/30 rounded p-3 mb-3 font-mono text-sm text-gray-300">
                    &ldquo;{example.goodExample.prompt}&rdquo;
                  </div>
                  <div className="space-y-2">
                    <h5 className="font-medium text-emerald-300 text-sm">Improvements:</h5>
                    <ul className="space-y-1">
                      {example.goodExample.improvements.map((improvement, index) => (
                        <li key={index} className="text-xs text-gray-400 flex items-start">
                          <span className="text-emerald-400 mr-2 flex-shrink-0">•</span>
                          {improvement}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Try This Button */}
                  <button
                    onClick={() => handleExampleSelect(example.goodExample.prompt)}
                    className="mt-3 w-full btn-hover px-4 py-2 bg-gradient-to-r from-primary to-secondary 
                             text-white font-medium rounded-lg text-sm"
                  >
                    Try This Prompt
                  </button>
                </div>
              </div>
            </div>

            {/* Explanation */}
            <div className="glass-dark rounded-lg p-4 space-y-3">
              <h5 className="font-medium text-white">💡 Why This Works</h5>
              <p className="text-sm text-gray-300 leading-relaxed">
                {example.explanation}
              </p>
              
              {/* Tips */}
              {example.tips.length > 0 && (
                <div className="space-y-2">
                  <h6 className="font-medium text-secondary text-sm">Key Tips:</h6>
                  <ul className="space-y-1">
                    {example.tips.map((tip, index) => (
                      <li key={index} className="text-xs text-gray-400 flex items-start">
                        <span className="text-secondary mr-2 flex-shrink-0">→</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Action Button */}
            <button
              onClick={() => setSelectedExample(example)}
              className="w-full btn-hover px-4 py-2 glass border border-primary/30 
                       text-primary hover:bg-primary/10 font-medium rounded-lg"
            >
              View Detailed Analysis
            </button>
          </div>
        ))}
      </div>

      {/* No Examples Message */}
      {filteredExamples.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-white mb-2">No Examples Found</h3>
          <p className="text-gray-400">
            No examples available for the selected category. Try selecting a different category.
          </p>
        </div>
      )}

      {/* Detailed Example Modal */}
      {selectedExample && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-dark rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">{selectedExample.title}</h3>
              <button
                onClick={() => setSelectedExample(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Same content as card but with more space */}
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Poor Example Detail */}
                <div className="border border-red-500/30 rounded-lg overflow-hidden">
                  <div className="bg-red-500/10 px-4 py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-red-400">❌</span>
                        <span className="font-medium text-red-300">Poor Example</span>
                      </div>
                      <span className={`px-3 py-1 rounded ${getScoreBadgeColor(selectedExample.poorExample.score)}`}>
                        Score: {selectedExample.poorExample.score}%
                      </span>
                    </div>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="bg-muted/30 rounded p-4">
                      <p className="font-mono text-gray-300">&ldquo;{selectedExample.poorExample.prompt}&rdquo;</p>
                    </div>
                    <div>
                      <h5 className="font-medium text-red-300 mb-2">Issues:</h5>
                      <ul className="space-y-2">
                        {selectedExample.poorExample.issues.map((issue, index) => (
                          <li key={index} className="text-sm text-gray-400 flex items-start">
                            <span className="text-red-400 mr-2 flex-shrink-0">•</span>
                            {issue}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Good Example Detail */}
                <div className="border border-emerald-500/30 rounded-lg overflow-hidden">
                  <div className="bg-emerald-500/10 px-4 py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-emerald-400">✅</span>
                        <span className="font-medium text-emerald-300">Improved Example</span>
                      </div>
                      <span className={`px-3 py-1 rounded ${getScoreBadgeColor(selectedExample.goodExample.score)}`}>
                        Score: {selectedExample.goodExample.score}%
                      </span>
                    </div>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="bg-muted/30 rounded p-4">
                      <p className="font-mono text-gray-300">&ldquo;{selectedExample.goodExample.prompt}&rdquo;</p>
                    </div>
                    <div>
                      <h5 className="font-medium text-emerald-300 mb-2">Improvements:</h5>
                      <ul className="space-y-2">
                        {selectedExample.goodExample.improvements.map((improvement, index) => (
                          <li key={index} className="text-sm text-gray-400 flex items-start">
                            <span className="text-emerald-400 mr-2 flex-shrink-0">•</span>
                            {improvement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Full Explanation */}
              <div className="glass rounded-lg p-6 space-y-4">
                <h5 className="text-xl font-semibold text-white">💡 Detailed Explanation</h5>
                <p className="text-gray-300 leading-relaxed">
                  {selectedExample.explanation}
                </p>
                
                {selectedExample.tips.length > 0 && (
                  <div>
                    <h6 className="font-semibold text-secondary mb-3">Key Takeaways:</h6>
                    <ul className="grid md:grid-cols-2 gap-2">
                      {selectedExample.tips.map((tip, index) => (
                        <li key={index} className="text-sm text-gray-400 flex items-start">
                          <span className="text-secondary mr-2 flex-shrink-0">✓</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => {
                    handleExampleSelect(selectedExample.poorExample.prompt);
                    setSelectedExample(null);
                  }}
                  className="flex-1 btn-hover px-6 py-3 border border-red-500/30 text-red-400 
                           hover:bg-red-500/10 font-medium rounded-lg"
                >
                  Try Poor Example
                </button>
                <button
                  onClick={() => {
                    handleExampleSelect(selectedExample.goodExample.prompt);
                    setSelectedExample(null);
                  }}
                  className="flex-1 btn-hover px-6 py-3 bg-gradient-to-r from-primary to-secondary 
                           text-white font-medium rounded-lg"
                >
                  Try Good Example
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}