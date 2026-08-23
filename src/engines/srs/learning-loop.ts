/**
 * SRS Learning Loop v2
 * 
 * Daily Mission generates:
 * - New Words (5-10 per day)
 * - Review Words (due for review)
 * - Weak Words (need extra practice)
 * 
 * Forms a complete daily learning mission
 */

// ============================================================
// Types
// ============================================================

export interface DailyMission {
  id: string;
  userId: string;
  dayNumber: number;
  date: string;
  
  // Word lists
  newWords: MissionWord[];
  reviewWords: MissionWord[];
  weakWords: MissionWord[];
  
  // Stats
  totalWords: number;
  estimatedMinutes: number;
  
  // Status
  started: boolean;
  completed: boolean;
  completedAt?: number;
}

export interface MissionWord {
  wordId: string;
  word: string;
  chineseMeaning: string;
  ipa?: string;
  priority: "new" | "review" | "weak";
  reason?: string;
  dueDate?: number;
  easeFactor?: number;
  interval?: number;
}

export interface MissionResult {
  missionId: string;
  wordsLearned: string[];
  wordsReviewed: string[];
  wordsMastered: string[];
  accuracy: number;
  timeSpent: number;
}

// ============================================================
// Learning Loop Engine
// ============================================================

export class SearningLoopV2 {
  private readonly NEW_WORDS_PER_DAY = 8;
  private readonly MAX_REVIEW_WORDS = 20;
  private readonly MAX_WEAK_WORDS = 10;

  /**
   * Generate daily mission for a user
   */
  generateDailyMission(
    userId: string,
    dayNumber: number,
    availableWords: { word: string; chineseMeaning: string; ipa?: string }[],
    learnedWords: { wordId: string; easeFactor: number; interval: number; dueDate: number; correctCount: number; incorrectCount: number }[],
  ): DailyMission {
    const date = new Date().toISOString().split("T")[0];
    const missionId = `mission_${userId}_${date}`;

    // Get new words (not yet learned)
    const newWords = this.selectNewWords(availableWords, learnedWords);

    // Get review words (due for review)
    const reviewWords = this.selectReviewWords(learnedWords);

    // Get weak words (high error rate)
    const weakWords = this.selectWeakWords(learnedWords);

    const totalWords = newWords.length + reviewWords.length + weakWords.length;
    const estimatedMinutes = totalWords * 2; // 2 minutes per word

    return {
      id: missionId,
      userId,
      dayNumber,
      date,
      newWords,
      reviewWords,
      weakWords,
      totalWords,
      estimatedMinutes,
      started: false,
      completed: false,
    };
  }

  /**
   * Select new words to learn
   */
  private selectNewWords(
    availableWords: { word: string; chineseMeaning: string; ipa?: string }[],
    learnedWords: { wordId: string }[],
  ): MissionWord[] {
    const learnedWordIds = new Set(learnedWords.map(w => w.wordId));
    
    const newWords = availableWords
      .filter(w => !learnedWordIds.has(`vocab_${w.word.toLowerCase()}`))
      .slice(0, this.NEW_WORDS_PER_DAY)
      .map(w => ({
        wordId: `vocab_${w.word.toLowerCase()}`,
        word: w.word,
        chineseMeaning: w.chineseMeaning,
        ipa: w.ipa,
        priority: "new" as const,
        reason: "New word to learn",
      }));

    return newWords;
  }

  /**
   * Select words due for review
   */
  private selectReviewWords(
    learnedWords: { wordId: string; easeFactor: number; interval: number; dueDate: number }[],
  ): MissionWord[] {
    const now = Date.now();
    
    return learnedWords
      .filter(w => w.dueDate <= now)
      .sort((a, b) => a.dueDate - b.dueDate)
      .slice(0, this.MAX_REVIEW_WORDS)
      .map(w => ({
        wordId: w.wordId,
        word: w.wordId.replace("vocab_", ""),
        chineseMeaning: "",
        priority: "review" as const,
        reason: "Due for review",
        dueDate: w.dueDate,
        easeFactor: w.easeFactor,
        interval: w.interval,
      }));
  }

  /**
   * Select weak words (need extra practice)
   */
  private selectWeakWords(
    learnedWords: { wordId: string; correctCount: number; incorrectCount: number }[],
  ): MissionWord[] {
    return learnedWords
      .filter(w => {
        const total = w.correctCount + w.incorrectCount;
        if (total === 0) return false;
        const accuracy = w.correctCount / total;
        return accuracy < 0.7; // Less than 70% accuracy
      })
      .sort((a, b) => {
        const accA = a.correctCount / (a.correctCount + a.incorrectCount);
        const accB = b.correctCount / (b.correctCount + b.incorrectCount);
        return accA - accB; // Sort by accuracy (lowest first)
      })
      .slice(0, this.MAX_WEAK_WORDS)
      .map(w => ({
        wordId: w.wordId,
        word: w.wordId.replace("vocab_", ""),
        chineseMeaning: "",
        priority: "weak" as const,
        reason: `Accuracy: ${Math.round((w.correctCount / (w.correctCount + w.incorrectCount)) * 100)}%`,
      }));
  }

  /**
   * Update mission after completing a word
   */
  updateMissionProgress(
    mission: DailyMission,
    wordId: string,
    _correct: boolean,
  ): DailyMission {
    const updatedMission = { ...mission };
    
    // Update new words
    updatedMission.newWords = mission.newWords.map(w => {
      if (w.wordId === wordId) {
        return { ...w, completed: true };
      }
      return w;
    });

    // Update review words
    updatedMission.reviewWords = mission.reviewWords.map(w => {
      if (w.wordId === wordId) {
        return { ...w, completed: true };
      }
      return w;
    });

    // Update weak words
    updatedMission.weakWords = mission.weakWords.map(w => {
      if (w.wordId === wordId) {
        return { ...w, completed: true };
      }
      return w;
    });

    // Check if mission is complete
    const allCompleted = [
      ...updatedMission.newWords,
      ...updatedMission.reviewWords,
      ...updatedMission.weakWords,
    ].every(w => (w as MissionWord & { completed?: boolean }).completed);

    if (allCompleted) {
      updatedMission.completed = true;
      updatedMission.completedAt = Date.now();
    }

    return updatedMission;
  }

  /**
   * Calculate mission results
   */
  calculateResults(
    mission: DailyMission,
    results: { wordId: string; correct: boolean; timeSpent: number }[],
  ): MissionResult {
    const wordsLearned = results
      .filter(r => mission.newWords.some(w => w.wordId === r.wordId))
      .map(r => r.wordId);

    const wordsReviewed = results
      .filter(r => mission.reviewWords.some(w => w.wordId === r.wordId))
      .map(r => r.wordId);

    const wordsMastered = results
      .filter(r => r.correct)
      .map(r => r.wordId);

    const correctCount = results.filter(r => r.correct).length;
    const accuracy = results.length > 0 ? correctCount / results.length : 0;

    const timeSpent = results.reduce((sum, r) => sum + r.timeSpent, 0);

    return {
      missionId: mission.id,
      wordsLearned,
      wordsReviewed,
      wordsMastered,
      accuracy,
      timeSpent,
    };
  }

  /**
   * Get mission summary
   */
  getMissionSummary(mission: DailyMission): {
    newWordsCount: number;
    reviewWordsCount: number;
    weakWordsCount: number;
    progress: number;
    estimatedMinutes: number;
  } {
    const completedWords = [
      ...mission.newWords,
      ...mission.reviewWords,
      ...mission.weakWords,
    ].filter(w => (w as MissionWord & { completed?: boolean }).completed).length;

    return {
      newWordsCount: mission.newWords.length,
      reviewWordsCount: mission.reviewWords.length,
      weakWordsCount: mission.weakWords.length,
      progress: mission.totalWords > 0 ? completedWords / mission.totalWords : 0,
      estimatedMinutes: mission.estimatedMinutes,
    };
  }
}

// ============================================================
// Export singleton
// ============================================================

export const learningLoop = new SearningLoopV2();
