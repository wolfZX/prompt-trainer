import { Achievement, AchievementCategory, AchievementRarity, User, GuestUser, PromptAnalysisResult, XP_REWARDS, LEVEL_THRESHOLDS, PromptQuality } from '@/types';

export class AchievementSystem {
  private static readonly ACHIEVEMENT_DEFINITIONS: Omit<Achievement, 'unlockedAt'>[] = [
    // Quality Achievements
    {
      id: 'first_perfect',
      title: 'Perfect Debut',
      description: 'Score a perfect 100 on your first try!',
      icon: '🎯',
      category: AchievementCategory.QUALITY,
      rarity: AchievementRarity.RARE,
      xpReward: 50
    },
    {
      id: 'perfectionist',
      title: 'Perfectionist',
      description: 'Score 100 points on 5 different prompts',
      icon: '💎',
      category: AchievementCategory.QUALITY,
      rarity: AchievementRarity.EPIC,
      xpReward: 100
    },
    {
      id: 'excellence_seeker',
      title: 'Excellence Seeker',
      description: 'Score above 90 on 10 prompts',
      icon: '⭐',
      category: AchievementCategory.QUALITY,
      rarity: AchievementRarity.COMMON,
      xpReward: 25
    },

    // Consistency Achievements
    {
      id: 'daily_habit',
      title: 'Daily Habit',
      description: 'Analyze prompts for 7 days in a row',
      icon: '📅',
      category: AchievementCategory.CONSISTENCY,
      rarity: AchievementRarity.COMMON,
      xpReward: 75
    },
    {
      id: 'week_warrior',
      title: 'Week Warrior',
      description: 'Maintain a 14-day streak',
      icon: '🔥',
      category: AchievementCategory.CONSISTENCY,
      rarity: AchievementRarity.RARE,
      xpReward: 150
    },
    {
      id: 'month_master',
      title: 'Month Master',
      description: 'Keep your streak alive for 30 days!',
      icon: '👑',
      category: AchievementCategory.CONSISTENCY,
      rarity: AchievementRarity.LEGENDARY,
      xpReward: 500
    },

    // Improvement Achievements
    {
      id: 'getting_better',
      title: 'Getting Better',
      description: 'Improve your prompt score by 20+ points',
      icon: '📈',
      category: AchievementCategory.IMPROVEMENT,
      rarity: AchievementRarity.COMMON,
      xpReward: 30
    },
    {
      id: 'comeback_king',
      title: 'Comeback King',
      description: 'Turn a Poor prompt into an Excellent one',
      icon: '🚀',
      category: AchievementCategory.IMPROVEMENT,
      rarity: AchievementRarity.RARE,
      xpReward: 75
    },
    {
      id: 'learning_curve',
      title: 'Learning Curve',
      description: 'Show consistent improvement over 5 prompts',
      icon: '🎓',
      category: AchievementCategory.IMPROVEMENT,
      rarity: AchievementRarity.RARE,
      xpReward: 100
    },

    // Exploration Achievements
    {
      id: 'category_explorer',
      title: 'Category Explorer',
      description: 'Try all 6 prompt categories',
      icon: '🗺️',
      category: AchievementCategory.EXPLORATION,
      rarity: AchievementRarity.COMMON,
      xpReward: 50
    },
    {
      id: 'versatile_prompter',
      title: 'Versatile Prompter',
      description: 'Score above 80 in 4 different categories',
      icon: '🎭',
      category: AchievementCategory.EXPLORATION,
      rarity: AchievementRarity.EPIC,
      xpReward: 125
    },
    {
      id: 'token_economist',
      title: 'Token Economist',
      description: 'Create a high-scoring prompt under 20 tokens',
      icon: '💰',
      category: AchievementCategory.EXPLORATION,
      rarity: AchievementRarity.RARE,
      xpReward: 60
    },

    // Mastery Achievements
    {
      id: 'prompt_master',
      title: 'Prompt Master',
      description: 'Analyze 100 prompts',
      icon: '🎖️',
      category: AchievementCategory.MASTERY,
      rarity: AchievementRarity.EPIC,
      xpReward: 200
    },
    {
      id: 'grandmaster',
      title: 'Grandmaster',
      description: 'Reach level 10',
      icon: '🏆',
      category: AchievementCategory.MASTERY,
      rarity: AchievementRarity.LEGENDARY,
      xpReward: 1000
    },
    {
      id: 'ai_whisperer',
      title: 'AI Whisperer',
      description: 'Maintain 90+ average score over 25 prompts',
      icon: '🤖',
      category: AchievementCategory.MASTERY,
      rarity: AchievementRarity.LEGENDARY,
      xpReward: 300
    }
  ];

  static checkAchievements(user: User | GuestUser, newAnalysis: PromptAnalysisResult): Achievement[] {
    if ('isGuest' in user) {
      return []; // Guests don't get achievements
    }

    const unlockedAchievements: Achievement[] = [];
    const userAchievementIds = user.achievements.map(a => a.id);

    for (const achievementDef of this.ACHIEVEMENT_DEFINITIONS) {
      if (userAchievementIds.includes(achievementDef.id)) {
        continue; // Already unlocked
      }

      if (this.checkAchievementCondition(achievementDef.id, user, newAnalysis)) {
        const achievement: Achievement = {
          ...achievementDef,
          unlockedAt: new Date()
        };
        unlockedAchievements.push(achievement);
      }
    }

    return unlockedAchievements;
  }

  private static checkAchievementCondition(achievementId: string, user: User, newAnalysis: PromptAnalysisResult): boolean {
    const allPrompts = [...user.promptHistory, newAnalysis];
    const lastPrompt = newAnalysis;
    
    switch (achievementId) {
      case 'first_perfect':
        return lastPrompt.analysis.score === 100 && allPrompts.length === 1;

      case 'perfectionist':
        return allPrompts.filter(p => p.analysis.score === 100).length >= 5;

      case 'excellence_seeker':
        return allPrompts.filter(p => p.analysis.score >= 90).length >= 10;

      case 'daily_habit':
        return this.checkStreak(allPrompts, 7);

      case 'week_warrior':
        return this.checkStreak(allPrompts, 14);

      case 'month_master':
        return this.checkStreak(allPrompts, 30);

      case 'getting_better':
        return this.checkImprovement(allPrompts, 20);

      case 'comeback_king':
        return this.checkQualityJump(allPrompts, PromptQuality.POOR, PromptQuality.EXCELLENT);

      case 'learning_curve':
        return this.checkConsistentImprovement(allPrompts, 5);

      case 'category_explorer':
        const categories = new Set(allPrompts.map(p => p.analysis.category));
        return categories.size >= 6;

      case 'versatile_prompter':
        return this.checkCategoryMastery(allPrompts, 4, 80);

      case 'token_economist':
        return allPrompts.some(p => p.analysis.tokenCount <= 20 && p.analysis.score >= 85);

      case 'prompt_master':
        return allPrompts.length >= 100;

      case 'grandmaster':
        return user.level >= 10;

      case 'ai_whisperer':
        return this.checkAverageScore(allPrompts, 25, 90);

      default:
        return false;
    }
  }

  private static checkStreak(prompts: PromptAnalysisResult[], requiredDays: number): boolean {
    if (prompts.length < requiredDays) return false;

    const sortedPrompts = prompts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    let streak = 0;
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < requiredDays; i++) {
      const targetDate = new Date(currentDate);
      targetDate.setDate(targetDate.getDate() - i);
      
      const hasPromptOnDate = sortedPrompts.some(prompt => {
        const promptDate = new Date(prompt.timestamp);
        promptDate.setHours(0, 0, 0, 0);
        return promptDate.getTime() === targetDate.getTime();
      });

      if (hasPromptOnDate) {
        streak++;
      } else {
        break;
      }
    }

    return streak >= requiredDays;
  }

  private static checkImprovement(prompts: PromptAnalysisResult[], minImprovement: number): boolean {
    if (prompts.length < 2) return false;

    for (let i = 1; i < prompts.length; i++) {
      const improvement = prompts[i].analysis.score - prompts[i - 1].analysis.score;
      if (improvement >= minImprovement) return true;
    }
    return false;
  }

  private static checkQualityJump(prompts: PromptAnalysisResult[], fromQuality: PromptQuality, toQuality: PromptQuality): boolean {
    for (let i = 1; i < prompts.length; i++) {
      if (prompts[i - 1].analysis.quality === fromQuality && prompts[i].analysis.quality === toQuality) {
        return true;
      }
    }
    return false;
  }

  private static checkConsistentImprovement(prompts: PromptAnalysisResult[], windowSize: number): boolean {
    if (prompts.length < windowSize) return false;

    const recentPrompts = prompts.slice(-windowSize);
    for (let i = 1; i < recentPrompts.length; i++) {
      if (recentPrompts[i].analysis.score <= recentPrompts[i - 1].analysis.score) {
        return false;
      }
    }
    return true;
  }

  private static checkCategoryMastery(prompts: PromptAnalysisResult[], requiredCategories: number, minScore: number): boolean {
    const categoryScores: Record<string, number[]> = {};

    prompts.forEach(prompt => {
      const category = prompt.analysis.category;
      if (!categoryScores[category]) {
        categoryScores[category] = [];
      }
      categoryScores[category].push(prompt.analysis.score);
    });

    let masteredCategories = 0;
    Object.values(categoryScores).forEach(scores => {
      const hasHighScore = scores.some(score => score >= minScore);
      if (hasHighScore) masteredCategories++;
    });

    return masteredCategories >= requiredCategories;
  }

  private static checkAverageScore(prompts: PromptAnalysisResult[], minCount: number, minAverage: number): boolean {
    if (prompts.length < minCount) return false;

    const recentPrompts = prompts.slice(-minCount);
    const average = recentPrompts.reduce((sum, p) => sum + p.analysis.score, 0) / recentPrompts.length;
    return average >= minAverage;
  }

  static calculateXP(analysis: PromptAnalysisResult, achievements: Achievement[]): number {
    let xp = XP_REWARDS.PROMPT_ANALYSIS;

    // Bonus XP for quality
    if (analysis.analysis.score === 100) {
      xp += XP_REWARDS.PERFECT_SCORE;
    } else if (analysis.analysis.score >= 90) {
      xp += 25;
    } else if (analysis.analysis.score >= 80) {
      xp += 15;
    }

    // Achievement XP
    achievements.forEach(achievement => {
      xp += achievement.xpReward;
    });

    return xp;
  }

  static calculateLevel(totalXP: number): number {
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
      if (totalXP >= LEVEL_THRESHOLDS[i]) {
        return i + 1;
      }
    }
    return 1;
  }

  static getXPForNextLevel(currentLevel: number, currentXP: number): number {
    if (currentLevel >= LEVEL_THRESHOLDS.length) {
      return 0; // Max level reached
    }
    return LEVEL_THRESHOLDS[currentLevel] - currentXP;
  }

  static getAllAchievements(): Omit<Achievement, 'unlockedAt'>[] {
    return this.ACHIEVEMENT_DEFINITIONS;
  }

  static getAchievementsByCategory(category: AchievementCategory): Omit<Achievement, 'unlockedAt'>[] {
    return this.ACHIEVEMENT_DEFINITIONS.filter(a => a.category === category);
  }

  static getAchievementsByRarity(rarity: AchievementRarity): Omit<Achievement, 'unlockedAt'>[] {
    return this.ACHIEVEMENT_DEFINITIONS.filter(a => a.rarity === rarity);
  }

  static updateUserProgress(user: User, newAnalysis: PromptAnalysisResult): User {
    // Check for new achievements
    const newAchievements = this.checkAchievements(user, newAnalysis);
    
    // Calculate XP
    const xpEarned = this.calculateXP(newAnalysis, newAchievements);
    const newTotalXP = user.totalXP + xpEarned;
    const newLevel = this.calculateLevel(newTotalXP);

    // Update streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const lastPromptDate = user.promptHistory.length > 0 
      ? new Date(user.promptHistory[user.promptHistory.length - 1].timestamp)
      : null;
    
    let newStreak = user.currentStreak;
    if (lastPromptDate) {
      lastPromptDate.setHours(0, 0, 0, 0);
      const daysDiff = Math.floor((today.getTime() - lastPromptDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 1) {
        newStreak++; // Consecutive day
      } else if (daysDiff > 1) {
        newStreak = 1; // Reset streak
      }
      // Same day doesn't change streak
    } else {
      newStreak = 1; // First prompt
    }

    return {
      ...user,
      totalXP: newTotalXP,
      level: newLevel,
      currentStreak: newStreak,
      bestStreak: Math.max(user.bestStreak, newStreak),
      achievements: [...user.achievements, ...newAchievements],
      promptHistory: [...user.promptHistory, { ...newAnalysis, xpEarned, achievementsUnlocked: newAchievements }]
    };
  }
}