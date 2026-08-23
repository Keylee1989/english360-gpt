/**
 * Lesson Engine
 *
 * Manages daily lessons:
 * - Load lesson data
 * - Track completion
 * - Generate activities
 * - Connect with SRS
 *
 * Each lesson contains vocabulary, grammar, listening, speaking, reading, writing blocks.
 */

import { getDatabase } from "@/db";
import type { DailyLesson, LessonCompletion, LessonExercise } from "@/types/database";
import { SRSEngine } from "../srs";

// ============================================================
// Types
// ============================================================

export interface LessonResult {
  dayId: string;
  userId: string;
  vocabulary: {
    wordId: string;
    correct: boolean;
    attempts: number;
  }[];
  grammar: {
    exerciseId: string;
    correct: boolean;
  }[];
  listening: number;            // 0-1 score
  speaking: number;             // 0-1 score
  reading: number;              // 0-1 score
  writing: number;              // 0-1 score
  overallScore: number;         // 0-100
  passed: boolean;
  timeSpent: number;            // seconds
}

export interface ExerciseResult {
  exerciseId: string;
  correct: boolean;
  userAnswer: string;
  correctAnswer: string;
  score: number;                // 0-1
  feedback: string;
}

// ============================================================
// Lesson Engine
// ============================================================

export class LessonEngine {
  private srsEngine: SRSEngine;

  constructor() {
    this.srsEngine = new SRSEngine();
  }

  /**
   * Create a daily lesson
   */
  async createLesson(lesson: DailyLesson): Promise<DailyLesson> {
    const db = getDatabase();
    await db.dailyLessons.put(lesson);
    return lesson;
  }

  /**
   * Get a lesson by day ID
   */
  async getLesson(dayId: string): Promise<DailyLesson | null> {
    const db = getDatabase();
    const id = `lesson_${dayId}`;
    return (await db.dailyLessons.get(id)) ?? null;
  }

  /**
   * Get a lesson by ID
   */
  async getLessonById(id: string): Promise<DailyLesson | null> {
    const db = getDatabase();
    return (await db.dailyLessons.get(id)) ?? null;
  }

  /**
   * Update a lesson
   */
  async updateLesson(lesson: DailyLesson): Promise<DailyLesson> {
    const db = getDatabase();
    await db.dailyLessons.put(lesson);
    return lesson;
  }

  /**
   * Start a lesson (record start time)
   */
  async startLesson(userId: string, dayId: string): Promise<LessonCompletion> {
    const db = getDatabase();
    const id = `${userId}_${dayId}`;
    
    // Check if already started
    const existing = await db.lessonCompletions.get(id);
    if (existing) {
      return existing as LessonCompletion;
    }

    const completion: LessonCompletion = {
      id,
      userId,
      dayId,
      startedAt: Date.now(),
      vocabularyResults: [],
      grammarResults: [],
      listeningScore: 0,
      speakingScore: 0,
      readingScore: 0,
      writingScore: 0,
      passed: false,
      score: 0,
      timeSpent: 0,
    };

    await db.lessonCompletions.put(completion);
    return completion;
  }

  /**
   * Record vocabulary result
   */
  async recordVocabularyResult(
    userId: string,
    dayId: string,
    wordId: string,
    correct: boolean
  ): Promise<void> {
    const db = getDatabase();
    const id = `${userId}_${dayId}`;
    
    const completion = await db.lessonCompletions.get(id) as LessonCompletion;
    if (!completion) {
      throw new Error("Lesson not started");
    }

    // Find existing result for this word
    const existingIndex = completion.vocabularyResults.findIndex(
      r => r.wordId === wordId
    );

    if (existingIndex >= 0) {
      // Update existing result
      completion.vocabularyResults[existingIndex].correct = 
        completion.vocabularyResults[existingIndex].correct || correct;
      completion.vocabularyResults[existingIndex].attempts += 1;
    } else {
      // Add new result
      completion.vocabularyResults.push({
        wordId,
        correct,
        attempts: 1,
      });
    }

    await db.lessonCompletions.put(completion);
  }

  /**
   * Record grammar result
   */
  async recordGrammarResult(
    userId: string,
    dayId: string,
    exerciseId: string,
    correct: boolean
  ): Promise<void> {
    const db = getDatabase();
    const id = `${userId}_${dayId}`;
    
    const completion = await db.lessonCompletions.get(id) as LessonCompletion;
    if (!completion) {
      throw new Error("Lesson not started");
    }

    completion.grammarResults.push({
      exerciseId,
      correct,
    });

    await db.lessonCompletions.put(completion);
  }

  /**
   * Record listening score
   */
  async recordListeningScore(
    userId: string,
    dayId: string,
    score: number
  ): Promise<void> {
    const db = getDatabase();
    const id = `${userId}_${dayId}`;
    
    const completion = await db.lessonCompletions.get(id) as LessonCompletion;
    if (!completion) {
      throw new Error("Lesson not started");
    }

    completion.listeningScore = score;
    await db.lessonCompletions.put(completion);
  }

  /**
   * Record speaking score
   */
  async recordSpeakingScore(
    userId: string,
    dayId: string,
    score: number
  ): Promise<void> {
    const db = getDatabase();
    const id = `${userId}_${dayId}`;
    
    const completion = await db.lessonCompletions.get(id) as LessonCompletion;
    if (!completion) {
      throw new Error("Lesson not started");
    }

    completion.speakingScore = score;
    await db.lessonCompletions.put(completion);
  }

  /**
   * Complete a lesson
   */
  async completeLesson(
    userId: string,
    dayId: string,
    results: Partial<LessonResult>
  ): Promise<LessonCompletion> {
    const db = getDatabase();
    const id = `${userId}_${dayId}`;
    
    const completion = await db.lessonCompletions.get(id) as LessonCompletion;
    if (!completion) {
      throw new Error("Lesson not started");
    }

    // Calculate scores
    const vocabCorrect = completion.vocabularyResults.filter(r => r.correct).length;
    const vocabTotal = completion.vocabularyResults.length;
    const vocabScore = vocabTotal > 0 ? vocabCorrect / vocabTotal : 0;

    const grammarCorrect = completion.grammarResults.filter(r => r.correct).length;
    const grammarTotal = completion.grammarResults.length;
    const grammarScore = grammarTotal > 0 ? grammarCorrect / grammarTotal : 0;

    // Weighted overall score
    const overallScore = (
      vocabScore * 0.3 +
      grammarScore * 0.2 +
      completion.listeningScore * 0.2 +
      completion.speakingScore * 0.15 +
      completion.readingScore * 0.1 +
      completion.writingScore * 0.05
    ) * 100;

    // Update completion
    completion.completedAt = Date.now();
    completion.score = overallScore;
    completion.passed = overallScore >= 70; // 70% to pass
    completion.timeSpent = results.timeSpent || 
      ((completion.completedAt - completion.startedAt) / 1000);

    await db.lessonCompletions.put(completion);

    // Create SRS cards for new vocabulary
    if (completion.passed) {
      await this.createSRSCardsForLesson(dayId);
    }

    return completion;
  }

  /**
   * Get lesson completion for a user and day
   */
  async getCompletion(userId: string, dayId: string): Promise<LessonCompletion | null> {
    const db = getDatabase();
    const id = `${userId}_${dayId}`;
    return (await db.lessonCompletions.get(id)) ?? null;
  }

  /**
   * Get all completions for a user
   */
  async getUserCompletions(userId: string): Promise<LessonCompletion[]> {
    const db = getDatabase();
    return db.lessonCompletions
      .where("userId")
      .equals(userId)
      .toArray();
  }

  /**
   * Get user's lesson progress
   */
  async getUserLessonProgress(userId: string): Promise<{
    started: number;
    completed: number;
    passed: number;
    averageScore: number;
    totalTime: number;
  }> {
    const completions = await this.getUserCompletions(userId);
    
    const started = completions.length;
    const completed = completions.filter(c => c.completedAt).length;
    const passed = completions.filter(c => c.passed).length;
    
    const scores = completions
      .filter(c => c.completedAt)
      .map(c => c.score);
    
    const averageScore = scores.length > 0
      ? scores.reduce((a, b) => a + b, 0) / scores.length
      : 0;
    
    const totalTime = completions.reduce((sum, c) => sum + c.timeSpent, 0);

    return {
      started,
      completed,
      passed,
      averageScore,
      totalTime,
    };
  }

  /**
   * Get exercises for a lesson
   */
  async getExercises(dayId: string): Promise<{
    vocabulary: LessonExercise[];
    grammar: LessonExercise[];
  }> {
    const lesson = await this.getLesson(dayId);
    if (!lesson) {
      return { vocabulary: [], grammar: [] };
    }

    return {
      vocabulary: lesson.vocabulary.exercises,
      grammar: lesson.grammar.exercises,
    };
  }

  /**
   * Evaluate an exercise answer
   */
  evaluateExercise(
    exercise: LessonExercise,
    userAnswer: string
  ): ExerciseResult {
    const normalizedUser = userAnswer.trim().toLowerCase();
    const normalizedCorrect = exercise.correctAnswer.toLowerCase();

    // Check exact match
    const isExactMatch = normalizedUser === normalizedCorrect;

    // Check alternatives
    const isAlternative = exercise.alternatives?.some(
      alt => normalizedUser === alt.toLowerCase()
    ) ?? false;

    const correct = isExactMatch || isAlternative;

    // Calculate similarity score
    const score = correct ? 1 : this.calculateSimilarity(normalizedUser, normalizedCorrect);

    // Generate feedback
    const feedback = correct
      ? "Correct! Well done!"
      : `The correct answer is: ${exercise.correctAnswer}`;

    return {
      exerciseId: exercise.id,
      correct,
      userAnswer,
      correctAnswer: exercise.correctAnswer,
      score,
      feedback,
    };
  }

  /**
   * Create SRS cards for lesson vocabulary
   */
  private async createSRSCardsForLesson(dayId: string): Promise<void> {
    const lesson = await this.getLesson(dayId);
    if (!lesson) return;

    for (const wordId of lesson.vocabulary.words) {
      await this.srsEngine.createCard(wordId, "vocabulary");
    }
  }

  /**
   * Calculate string similarity (Levenshtein distance)
   */
  private calculateSimilarity(a: string, b: string): number {
    if (a === b) return 1;
    if (a.length === 0 || b.length === 0) return 0;

    const matrix: number[][] = [];

    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    const distance = matrix[b.length][a.length];
    const maxLength = Math.max(a.length, b.length);

    return 1 - distance / maxLength;
  }
}
