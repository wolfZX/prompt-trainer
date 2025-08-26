import {
  PromptAnalysis,
  PromptFeedback,
  PromptCategory,
  PromptQuality,
  TOKEN_LIMITS,
} from "@/types";

export class PromptScorer {
  private static readonly KEYWORDS = {
    technical: [
      "code",
      "function",
      "algorithm",
      "debug",
      "implement",
      "optimize",
      "refactor",
      "api",
      "database",
      "framework",
    ],
    creative: [
      "story",
      "creative",
      "imagine",
      "design",
      "artistic",
      "innovative",
      "brainstorm",
      "concept",
      "vision",
    ],
    analytical: [
      "analyze",
      "compare",
      "evaluate",
      "research",
      "study",
      "examine",
      "investigate",
      "assess",
    ],
    conversational: [
      "explain",
      "discuss",
      "tell",
      "chat",
      "talk",
      "conversation",
      "dialogue",
    ],
    instructional: [
      "how",
      "step",
      "guide",
      "tutorial",
      "teach",
      "learn",
      "instructions",
      "process",
    ],
    coding: [
      "javascript",
      "python",
      "react",
      "html",
      "css",
      "programming",
      "syntax",
      "variable",
      "class",
      "method",
    ],
  };

  private static readonly QUALITY_INDICATORS = {
    positive: [
      "specific",
      "detailed",
      "clear",
      "precise",
      "context",
      "example",
      "format",
      "tone",
      "audience",
      "goal",
      "constraint",
      "requirement",
      "criteria",
    ],
    negative: [
      "anything",
      "something",
      "stuff",
      "things",
      "whatever",
      "maybe",
      "possibly",
      "kinda",
      "sorta",
      "idk",
      "dunno",
      "just",
      "simply",
    ],
  };

  static analyzePrompt(prompt: string): PromptAnalysis {
    const cleanPrompt = prompt.trim();

    if (cleanPrompt.length === 0) {
      return this.createEmptyAnalysis();
    }

    const tokenCount = this.estimateTokens(cleanPrompt);
    const feedback = this.analyzeFeedback(cleanPrompt);
    const category = this.categorizePrompt(cleanPrompt);
    const suggestions = this.generateSuggestions(cleanPrompt, feedback);
    const overallScore = this.calculateOverallScore(feedback);
    const quality = this.determineQuality(overallScore);

    return {
      score: overallScore,
      tokenCount,
      isNearLimit:
        tokenCount > TOKEN_LIMITS.GPT3_5 * TOKEN_LIMITS.WARNING_THRESHOLD,
      isAtLimit:
        tokenCount > TOKEN_LIMITS.GPT3_5 * TOKEN_LIMITS.ERROR_THRESHOLD,
      feedback,
      suggestions,
      category,
      quality,
    };
  }

  private static createEmptyAnalysis(): PromptAnalysis {
    return {
      score: 0,
      tokenCount: 0,
      isNearLimit: false,
      isAtLimit: false,
      feedback: {
        clarity: 0,
        specificity: 0,
        context: 0,
        structure: 0,
        length: 0,
      },
      suggestions: ["Please enter a prompt to analyze"],
      category: PromptCategory.CONVERSATIONAL,
      quality: PromptQuality.POOR,
    };
  }

  private static estimateTokens(prompt: string): number {
    // Rough approximation: 1 token ≈ 4 characters for English text
    // More accurate for actual use case, but this works for demo
    const words = prompt.split(/\s+/).length;
    const characters = prompt.length;
    return Math.ceil(words * 1.3 + characters * 0.25);
  }

  private static analyzeFeedback(prompt: string): PromptFeedback {
    const words = prompt.split(/\s+/);
    const sentences = prompt.split(/[.!?]+/).filter((s) => s.trim().length > 0);

    return {
      clarity: this.assessClarity(prompt),
      specificity: this.assessSpecificity(prompt),
      context: this.assessContext(prompt),
      structure: this.assessStructure(prompt, sentences),
      length: this.assessLength(words.length),
    };
  }

  private static assessClarity(prompt: string): number {
    let score = 50; // Base score
    const lowerPrompt = prompt.toLowerCase();

    // Positive indicators
    this.QUALITY_INDICATORS.positive.forEach((indicator) => {
      if (lowerPrompt.includes(indicator)) score += 5;
    });

    // Negative indicators
    this.QUALITY_INDICATORS.negative.forEach((indicator) => {
      if (lowerPrompt.includes(indicator)) score -= 10;
    });

    // Question words (good for clarity)
    if (/\b(what|how|why|when|where|which|who)\b/i.test(prompt)) score += 10;

    // Too many filler words
    const fillerWords = (
      prompt.match(/\b(um|uh|like|you know|basically|actually)\b/gi) || []
    ).length;
    score -= fillerWords * 5;

    return Math.max(0, Math.min(100, score));
  }

  private static assessSpecificity(prompt: string): number {
    let score = 30; // Lower base score for specificity

    // Numbers indicate specificity
    const numbers = (prompt.match(/\d+/g) || []).length;
    score += Math.min(numbers * 8, 25);

    // Specific examples or formats mentioned
    if (/example|format|template|style/i.test(prompt)) score += 15;

    // Technical terms indicate specificity
    if (
      /\b(json|csv|html|markdown|bullet points|numbered list)\b/i.test(prompt)
    )
      score += 10;

    // Constraints and requirements
    if (/\b(must|should|need|require|limit|maximum|minimum)\b/i.test(prompt))
      score += 10;

    // Vague words reduce specificity
    const vagueWords = (
      prompt.match(/\b(some|many|few|several|various|different|general)\b/gi) ||
      []
    ).length;
    score -= vagueWords * 3;

    return Math.max(0, Math.min(100, score));
  }

  private static assessContext(prompt: string): number {
    let score = 40; // Base score

    // Context indicators
    if (
      /\b(for|to|in order to|because|since|given that|assuming)\b/i.test(prompt)
    )
      score += 15;

    // Audience mentioned
    if (
      /\b(audience|reader|user|student|beginner|expert|professional)\b/i.test(
        prompt
      )
    )
      score += 10;

    // Purpose or goal mentioned
    if (/\b(goal|purpose|objective|aim|target|result|outcome)\b/i.test(prompt))
      score += 10;

    // Background information
    if (
      /\b(background|context|situation|scenario|case|project)\b/i.test(prompt)
    )
      score += 8;

    // Domain knowledge
    Object.values(this.KEYWORDS)
      .flat()
      .forEach((keyword) => {
        if (prompt.toLowerCase().includes(keyword)) score += 2;
      });

    return Math.max(0, Math.min(100, score));
  }

  private static assessStructure(prompt: string, sentences: string[]): number {
    let score = 50; // Base score

    // Multiple sentences generally indicate better structure
    if (sentences.length > 1) score += 10;
    if (sentences.length > 3) score += 5;

    // Proper punctuation
    const punctuation = (prompt.match(/[.!?;:,]/g) || []).length;
    score += Math.min(punctuation * 2, 15);

    // Proper capitalization
    const properCapitalization = sentences.filter(
      (s) => s.trim().length > 0 && s.trim()[0] === s.trim()[0].toUpperCase()
    ).length;
    score += (properCapitalization / sentences.length) * 10;

    // Lists or numbered points
    if (/^\d+\.|^-|^\*|^•/m.test(prompt)) score += 10;

    // Logical flow words
    if (
      /\b(first|second|then|next|finally|however|therefore|additionally)\b/i.test(
        prompt
      )
    )
      score += 8;

    return Math.max(0, Math.min(100, score));
  }

  private static assessLength(wordCount: number): number {
    // Optimal range: 10-50 words
    if (wordCount >= 10 && wordCount <= 50) return 100;
    if (wordCount >= 5 && wordCount <= 80) return 80;
    if (wordCount >= 3 && wordCount <= 100) return 60;
    if (wordCount >= 1 && wordCount <= 150) return 40;
    if (wordCount > 150) return Math.max(20, 100 - (wordCount - 150) * 2);
    return 20; // Too short
  }

  private static categorizePrompt(prompt: string): PromptCategory {
    const lowerPrompt = prompt.toLowerCase();
    const scores: Record<PromptCategory, number> = {
      [PromptCategory.TECHNICAL]: 0,
      [PromptCategory.CREATIVE]: 0,
      [PromptCategory.ANALYTICAL]: 0,
      [PromptCategory.CONVERSATIONAL]: 0,
      [PromptCategory.INSTRUCTIONAL]: 0,
      [PromptCategory.CODING]: 0,
    };

    // Score each category based on keyword presence
    Object.entries(this.KEYWORDS).forEach(([category, keywords]) => {
      keywords.forEach((keyword) => {
        if (lowerPrompt.includes(keyword)) {
          scores[category as PromptCategory] += 1;
        }
      });
    });

    // Return category with highest score, default to conversational
    const maxScore = Math.max(...Object.values(scores));
    if (maxScore === 0) return PromptCategory.CONVERSATIONAL;

    return (
      (Object.entries(scores).find(
        ([, score]) => score === maxScore
      )?.[0] as PromptCategory) || PromptCategory.CONVERSATIONAL
    );
  }

  private static generateSuggestions(
    prompt: string,
    feedback: PromptFeedback
  ): string[] {
    const suggestions: string[] = [];

    if (feedback.clarity < 70) {
      suggestions.push("Be more specific about what you want");
      suggestions.push("Avoid vague words like 'something' or 'anything'");
    }

    if (feedback.specificity < 60) {
      suggestions.push("Include specific examples or formats you prefer");
      suggestions.push("Add constraints or requirements (length, style, etc.)");
    }

    if (feedback.context < 60) {
      suggestions.push("Provide background information or context");
      suggestions.push("Mention your target audience or use case");
    }

    if (feedback.structure < 60) {
      suggestions.push("Use proper punctuation and capitalization");
      suggestions.push("Break complex requests into multiple sentences");
    }

    if (feedback.length < 50) {
      if (prompt.split(/\s+/).length < 5) {
        suggestions.push("Add more details to your prompt");
      } else {
        suggestions.push(
          "Consider breaking this into shorter, focused requests"
        );
      }
    }

    // Add positive reinforcement for good scores
    const avgScore = Object.values(feedback).reduce((a, b) => a + b, 0) / 5;
    if (avgScore > 80) {
      suggestions.push("Great prompt! This is clear and well-structured.");
    }

    return suggestions.slice(0, 4); // Limit to 4 suggestions
  }

  private static calculateOverallScore(feedback: PromptFeedback): number {
    const weights = {
      clarity: 0.3,
      specificity: 0.25,
      context: 0.2,
      structure: 0.15,
      length: 0.1,
    };

    return Math.round(
      feedback.clarity * weights.clarity +
        feedback.specificity * weights.specificity +
        feedback.context * weights.context +
        feedback.structure * weights.structure +
        feedback.length * weights.length
    );
  }

  private static determineQuality(score: number): PromptQuality {
    if (score >= 90) return PromptQuality.PERFECT;
    if (score >= 80) return PromptQuality.EXCELLENT;
    if (score >= 65) return PromptQuality.GOOD;
    if (score >= 45) return PromptQuality.FAIR;
    return PromptQuality.POOR;
  }
}
