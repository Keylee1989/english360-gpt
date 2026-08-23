/**
 * Chinese Assistance System v1
 *
 * Manages Chinese/English balance based on:
 * - User proficiency level
 * - Learning context
 * - User preference
 * - Performance history
 *
 * Levels:
 * 5: Full Chinese explanation
 * 4: Chinese + simple English
 * 3: Mixed
 * 2: Mostly English
 * 1: English with hints
 * 0: Immersion
 */

// ============================================================
// Types
// ============================================================

export type AssistLevel = 0 | 1 | 2 | 3 | 4 | 5;

export interface AssistConfig {
  level: AssistLevel;
  autoAdjust: boolean;
  minLevel: AssistLevel;
  maxLevel: AssistLevel;
}

export interface AssistContent {
  level: AssistLevel;
  primary: string;           // Main content (Chinese or English based on level)
  secondary?: string;        // Secondary content (opposite language)
  hints?: string[];
  chineseHints?: string[];
  explanation?: string;
  chineseExplanation?: string;
}

export interface UserAssistState {
  currentLevel: AssistLevel;
  autoAdjust: boolean;
  minLevel: AssistLevel;
  maxLevel: AssistLevel;
  history: AssistAdjustment[];
  performanceByLevel: Record<AssistLevel, {
    correct: number;
    total: number;
    averageScore: number;
  }>;
}

export interface AssistAdjustment {
  timestamp: number;
  fromLevel: AssistLevel;
  toLevel: AssistLevel;
  reason: string;
}

// ============================================================
// Chinese Assist Engine
// ============================================================

export class ChineseAssistEngine {
  private userStates: Map<string, UserAssistState> = new Map();

  constructor() {
    // Initialize default states
  }

  // ============================================================
  // Level Management
  // ============================================================

  /**
   * Get the appropriate assist level for a user
   */
  getAssistLevel(userId: string, proficiencyScore: number): AssistLevel {
    const state = this.getUserState(userId);

    if (!state.autoAdjust) {
      return state.currentLevel;
    }

    // Auto-adjust based on proficiency
    return this.calculateOptimalLevel(proficiencyScore, state);
  }

  /**
   * Set assist level for a user
   */
  setAssistLevel(userId: string, level: AssistLevel): void {
    const state = this.getUserState(userId);
    const fromLevel = state.currentLevel;

    state.currentLevel = level;
    state.autoAdjust = false;

    state.history.push({
      timestamp: Date.now(),
      fromLevel,
      toLevel: level,
      reason: "User preference",
    });

    this.userStates.set(userId, state);
  }

  /**
   * Enable auto-adjustment
   */
  enableAutoAdjust(userId: string): void {
    const state = this.getUserState(userId);
    state.autoAdjust = true;
    this.userStates.set(userId, state);
  }

  /**
   * Get current level info
   */
  getLevelInfo(level: AssistLevel): {
    name: string;
    chineseName: string;
    description: string;
    chineseDescription: string;
    features: string[];
  } {
    const levels: Record<AssistLevel, {
      name: string;
      chineseName: string;
      description: string;
      chineseDescription: string;
      features: string[];
    }> = {
      0: {
        name: "Immersion",
        chineseName: "沉浸模式",
        description: "Full English, no Chinese",
        chineseDescription: "全英文，无中文",
        features: [
          "All instructions in English",
          "No Chinese translations",
          "No Chinese hints",
          "Full immersion experience",
        ],
      },
      1: {
        name: "English with Hints",
        chineseName: "英文+提示",
        description: "English with optional Chinese hints",
        chineseDescription: "英文为主，可选中文提示",
        features: [
          "Instructions in English",
          "Chinese available on request",
          "Minimal Chinese support",
        ],
      },
      2: {
        name: "Mostly English",
        chineseName: "主要英文",
        description: "English primary, some Chinese",
        chineseDescription: "英文为主，部分中文",
        features: [
          "English instructions",
          "Chinese translations for key terms",
          "Chinese explanations for difficult concepts",
        ],
      },
      3: {
        name: "Mixed",
        chineseName: "混合模式",
        description: "Balanced Chinese and English",
        chineseDescription: "中英平衡",
        features: [
          "Bilingual instructions",
          "Chinese translations provided",
          "English examples with Chinese support",
        ],
      },
      4: {
        name: "Chinese + Simple English",
        chineseName: "中文+简单英文",
        description: "Chinese primary, simple English",
        chineseDescription: "中文为主，简单英文",
        features: [
          "Chinese instructions",
          "Simple English examples",
          "Detailed Chinese explanations",
        ],
      },
      5: {
        name: "Full Chinese",
        chineseName: "全中文",
        description: "Full Chinese explanation",
        chineseDescription: "全中文解释",
        features: [
          "All instructions in Chinese",
          "Full Chinese explanations",
          "Chinese examples",
          "Maximum Chinese support",
        ],
      },
    };

    return levels[level];
  }

  // ============================================================
  // Content Adaptation
  // ============================================================

  /**
   * Adapt content based on assist level
   */
  adaptContent(
    content: {
      english: string;
      chinese: string;
      explanation?: string;
      chineseExplanation?: string;
    },
    level: AssistLevel
  ): AssistContent {
    switch (level) {
      case 0:
        return {
          level,
          primary: content.english,
          secondary: content.chinese,
        };

      case 1:
        return {
          level,
          primary: content.english,
          secondary: content.chinese,
          hints: [content.chinese],
        };

      case 2:
        return {
          level,
          primary: content.english,
          secondary: content.chinese,
          hints: content.chineseExplanation ? [content.chineseExplanation] : [],
          explanation: content.explanation,
          chineseExplanation: content.chineseExplanation,
        };

      case 3:
        return {
          level,
          primary: `${content.english}\n${content.chinese}`,
          secondary: content.chinese,
          hints: [content.english, content.chinese],
          explanation: content.explanation,
          chineseExplanation: content.chineseExplanation,
        };

      case 4:
        return {
          level,
          primary: content.chinese,
          secondary: content.english,
          hints: [content.english],
          explanation: content.chineseExplanation || content.explanation,
          chineseExplanation: content.chineseExplanation,
        };

      case 5:
        return {
          level,
          primary: content.chineseExplanation || content.chinese,
          secondary: content.english,
          hints: [content.english],
          explanation: content.chineseExplanation || content.chinese,
          chineseExplanation: content.chineseExplanation,
        };

      default:
        return {
          level: 3,
          primary: `${content.english}\n${content.chinese}`,
          secondary: content.chinese,
        };
    }
  }

  /**
   * Adapt instructions based on level
   */
  adaptInstructions(
    englishInstructions: string,
    chineseInstructions: string,
    level: AssistLevel
  ): AssistContent {
    return this.adaptContent(
      {
        english: englishInstructions,
        chinese: chineseInstructions,
      },
      level
    );
  }

  /**
   * Adapt feedback based on level
   */
  adaptFeedback(
    isCorrect: boolean,
    correctAnswer: string,
    chineseAnswer: string,
    level: AssistLevel
  ): AssistContent {
    const englishFeedback = isCorrect
      ? "Correct! Well done!"
      : `The correct answer is: ${correctAnswer}`;

    const chineseFeedback = isCorrect
      ? "正确！做得好！"
      : `正确答案是：${chineseAnswer}`;

    return this.adaptContent(
      {
        english: englishFeedback,
        chinese: chineseFeedback,
        explanation: isCorrect ? undefined : `Answer: ${correctAnswer}`,
        chineseExplanation: isCorrect ? undefined : `答案：${chineseAnswer}`,
      },
      level
    );
  }

  /**
   * Adapt hints based on level
   */
  adaptHints(
    hints: string[],
    chineseHints: string[],
    level: AssistLevel
  ): string[] {
    switch (level) {
      case 0:
        return []; // No hints
      case 1:
        return hints.slice(0, 1); // Minimal hints
      case 2:
        return [...hints.slice(0, 2), ...chineseHints.slice(0, 1)];
      case 3:
        return [...hints, ...chineseHints.slice(0, 2)];
      case 4:
        return [...chineseHints, ...hints.slice(0, 1)];
      case 5:
        return chineseHints; // All Chinese hints
      default:
        return [...hints, ...chineseHints];
    }
  }

  // ============================================================
  // Performance Tracking
  // ============================================================

  /**
   * Record performance at a specific level
   */
  recordPerformance(
    userId: string,
    level: AssistLevel,
    correct: boolean,
    score: number
  ): void {
    const state = this.getUserState(userId);

    if (!state.performanceByLevel[level]) {
      state.performanceByLevel[level] = {
        correct: 0,
        total: 0,
        averageScore: 0,
      };
    }

    const perf = state.performanceByLevel[level];
    perf.total += 1;
    if (correct) perf.correct += 1;
    perf.averageScore = (perf.averageScore * (perf.total - 1) + score) / perf.total;

    this.userStates.set(userId, state);

    // Auto-adjust if enabled
    if (state.autoAdjust) {
      this.maybeAdjustLevel(userId, state);
    }
  }

  /**
   * Get performance statistics
   */
  getPerformanceStats(userId: string): UserAssistState["performanceByLevel"] {
    const state = this.getUserState(userId);
    return state.performanceByLevel;
  }

  // ============================================================
  // Private Methods
  // ============================================================

  private getUserState(userId: string): UserAssistState {
    if (!this.userStates.has(userId)) {
      this.userStates.set(userId, {
        currentLevel: 3, // Default to mixed
        autoAdjust: true,
        minLevel: 0,
        maxLevel: 5,
        history: [],
        performanceByLevel: {} as UserAssistState["performanceByLevel"],
      });
    }
    return this.userStates.get(userId)!;
  }

  private calculateOptimalLevel(
    proficiencyScore: number,
    state: UserAssistState
  ): AssistLevel {
    // Score 0-100
    // 0-20: Level 5 (full Chinese)
    // 20-35: Level 4 (Chinese + simple English)
    // 35-50: Level 3 (mixed)
    // 50-65: Level 2 (mostly English)
    // 65-80: Level 1 (English with hints)
    // 80-100: Level 0 (immersion)

    let level: AssistLevel;

    if (proficiencyScore < 20) level = 5;
    else if (proficiencyScore < 35) level = 4;
    else if (proficiencyScore < 50) level = 3;
    else if (proficiencyScore < 65) level = 2;
    else if (proficiencyScore < 80) level = 1;
    else level = 0;

    // Clamp to min/max
    level = Math.max(state.minLevel || 0, Math.min(state.maxLevel || 5, level)) as AssistLevel;

    return level;
  }

  private maybeAdjustLevel(userId: string, state: UserAssistState): void {
    const currentLevel = state.currentLevel;
    const perf = state.performanceByLevel[currentLevel];

    if (!perf || perf.total < 10) return; // Need enough data

    const accuracy = perf.correct / perf.total;

    // Adjust based on performance
    let newLevel = currentLevel;

    if (accuracy > 0.9 && currentLevel > 0) {
      // Performing well, reduce Chinese assistance
      newLevel = (currentLevel - 1) as AssistLevel;
    } else if (accuracy < 0.5 && currentLevel < 5) {
      // Struggling, increase Chinese assistance
      newLevel = (currentLevel + 1) as AssistLevel;
    }

    if (newLevel !== currentLevel) {
      const fromLevel = currentLevel;
      state.currentLevel = newLevel;
      state.history.push({
        timestamp: Date.now(),
        fromLevel,
        toLevel: newLevel,
        reason: accuracy > 0.9 ? "High accuracy - reducing assistance" : "Low accuracy - increasing assistance",
      });

      // Reset performance for new level
      state.performanceByLevel[newLevel] = {
        correct: 0,
        total: 0,
        averageScore: 0,
      };

      this.userStates.set(userId, state);
    }
  }
}

// ============================================================
// Singleton export
// ============================================================

let instance: ChineseAssistEngine | null = null;

export function getChineseAssistEngine(): ChineseAssistEngine {
  if (!instance) {
    instance = new ChineseAssistEngine();
  }
  return instance;
}
