/**
 * Progress Persistence Engine
 *
 * Manages persistent storage of learning progress:
 * - User profiles
 * - Learning progress
 * - Lesson progress
 * - Vocabulary memory
 * - Speaking/pronunciation scores
 * - Conversation history
 * - Adaptive decisions
 *
 * Features:
 * - Export/Import (JSON backup)
 * - Cross-session persistence
 * - Data integrity checks
 */

import { getDatabase } from "@/db";
import { DB_SCHEMA_VERSION } from "@/types/database";
import type {
  UserProfile,
  LearningProgress,
  LessonProgress,
  VocabularyMemory,
  SpeakingScore,
  PronunciationScore,
  ConversationHistory,
  AdaptiveDecision,
  DataExport,
} from "@/types/database";

// ============================================================
// Progress Persistence Engine
// ============================================================

export class ProgressPersistenceEngine {
  /**
   * Get or create user profile
   */
  async getOrCreateUserProfile(
    userId: string,
    name: string,
    nameChinese: string
  ): Promise<UserProfile> {
    const db = getDatabase();
    let profile = await db.userProfiles.get(userId);

    if (!profile) {
      const now = Date.now();
      profile = {
        id: userId,
        name,
        nameChinese,
        level: "A1",
        dailyGoalMinutes: 240,
        preferredStudyTime: "morning",
        createdAt: now,
        updatedAt: now,
        lastActiveAt: now,
      };
      await db.userProfiles.put(profile);
    }

    return profile;
  }

  /**
   * Update user profile
   */
  async updateUserProfile(
    userId: string,
    updates: Partial<UserProfile>
  ): Promise<UserProfile> {
    const db = getDatabase();
    const profile = await db.userProfiles.get(userId);

    if (!profile) {
      throw new Error(`User profile not found: ${userId}`);
    }

    const updatedProfile: UserProfile = {
      ...profile,
      ...updates,
      updatedAt: Date.now(),
    };

    await db.userProfiles.put(updatedProfile);
    return updatedProfile;
  }

  /**
   * Save learning progress
   */
  async saveLearningProgress(progress: LearningProgress): Promise<void> {
    const db = getDatabase();
    await db.learningProgress.put(progress);
  }

  /**
   * Get learning progress for date
   */
  async getLearningProgress(
    userId: string,
    date: string
  ): Promise<LearningProgress | undefined> {
    const db = getDatabase();
    return db.learningProgress.get([userId, date]);
  }

  /**
   * Get learning progress range
   */
  async getLearningProgressRange(
    userId: string,
    startDate: string,
    endDate: string
  ): Promise<LearningProgress[]> {
    const db = getDatabase();
    return db.learningProgress
      .where("[userId+date]")
      .between([userId, startDate], [userId, endDate])
      .toArray();
  }

  /**
   * Save lesson progress
   */
  async saveLessonProgress(progress: LessonProgress): Promise<void> {
    const db = getDatabase();
    await db.lessonProgress.put(progress);
  }

  /**
   * Get lesson progress
   */
  async getLessonProgress(
    userId: string,
    lessonId: string
  ): Promise<LessonProgress | undefined> {
    const db = getDatabase();
    return db.lessonProgress.get([userId, lessonId]);
  }

  /**
   * Get all lesson progress for user
   */
  async getAllLessonProgress(userId: string): Promise<LessonProgress[]> {
    const db = getDatabase();
    return db.lessonProgress
      .where("userId")
      .equals(userId)
      .toArray();
  }

  /**
   * Save vocabulary memory
   */
  async saveVocabularyMemory(memory: VocabularyMemory): Promise<void> {
    const db = getDatabase();
    await db.vocabularyMemory.put(memory);
  }

  /**
   * Get vocabulary memory
   */
  async getVocabularyMemory(
    userId: string,
    wordId: string
  ): Promise<VocabularyMemory | undefined> {
    const db = getDatabase();
    return db.vocabularyMemory.get([userId, wordId]);
  }

  /**
   * Get all vocabulary memory for user
   */
  async getAllVocabularyMemory(userId: string): Promise<VocabularyMemory[]> {
    const db = getDatabase();
    return db.vocabularyMemory
      .where("userId")
      .equals(userId)
      .toArray();
  }

  /**
   * Get vocabulary due for review
   */
  async getVocabularyForReview(
    userId: string,
    limit: number = 20
  ): Promise<VocabularyMemory[]> {
    const db = getDatabase();
    const now = Date.now();

    return db.vocabularyMemory
      .where("userId")
      .equals(userId)
      .filter(mem => mem.nextReview <= now)
      .limit(limit)
      .toArray();
  }

  /**
   * Save speaking score
   */
  async saveSpeakingScore(score: SpeakingScore): Promise<void> {
    const db = getDatabase();
    await db.speakingScores.put(score);
  }

  /**
   * Get speaking scores for user
   */
  async getSpeakingScores(
    userId: string,
    limit: number = 50
  ): Promise<SpeakingScore[]> {
    const db = getDatabase();
    return db.speakingScores
      .where("userId")
      .equals(userId)
      .reverse()
      .limit(limit)
      .toArray();
  }

  /**
   * Save pronunciation score
   */
  async savePronunciationScore(score: PronunciationScore): Promise<void> {
    const db = getDatabase();
    await db.pronunciationScores.put(score);
  }

  /**
   * Get pronunciation scores for user
   */
  async getPronunciationScores(
    userId: string,
    limit: number = 50
  ): Promise<PronunciationScore[]> {
    const db = getDatabase();
    return db.pronunciationScores
      .where("userId")
      .equals(userId)
      .reverse()
      .limit(limit)
      .toArray();
  }

  /**
   * Save conversation history
   */
  async saveConversationHistory(history: ConversationHistory): Promise<void> {
    const db = getDatabase();
    await db.conversationHistory.put(history);
  }

  /**
   * Get conversation history for user
   */
  async getConversationHistory(
    userId: string,
    limit: number = 20
  ): Promise<ConversationHistory[]> {
    const db = getDatabase();
    return db.conversationHistory
      .where("userId")
      .equals(userId)
      .reverse()
      .limit(limit)
      .toArray();
  }

  /**
   * Save adaptive decision
   */
  async saveAdaptiveDecision(decision: AdaptiveDecision): Promise<void> {
    const db = getDatabase();
    await db.adaptiveDecisions.put(decision);
  }

  /**
   * Get adaptive decisions for user
   */
  async getAdaptiveDecisions(
    userId: string,
    limit: number = 20
  ): Promise<AdaptiveDecision[]> {
    const db = getDatabase();
    return db.adaptiveDecisions
      .where("userId")
      .equals(userId)
      .reverse()
      .limit(limit)
      .toArray();
  }

  /**
   * Export all user data as JSON
   */
  async exportUserData(userId: string): Promise<DataExport> {
    const db = getDatabase();

    const userProfile = await db.userProfiles.get(userId);
    const learningProgress = await db.learningProgress
      .where("userId")
      .equals(userId)
      .toArray();
    const lessonProgress = await db.lessonProgress
      .where("userId")
      .equals(userId)
      .toArray();
    const vocabularyMemory = await db.vocabularyMemory
      .where("userId")
      .equals(userId)
      .toArray();
    const speakingScores = await db.speakingScores
      .where("userId")
      .equals(userId)
      .toArray();
    const pronunciationScores = await db.pronunciationScores
      .where("userId")
      .equals(userId)
      .toArray();
    const conversationHistory = await db.conversationHistory
      .where("userId")
      .equals(userId)
      .toArray();
    const adaptiveDecisions = await db.adaptiveDecisions
      .where("userId")
      .equals(userId)
      .toArray();

    return {
      version: 1,
      exportedAt: Date.now(),
      schemaVersion: DB_SCHEMA_VERSION,
      data: {
        studentModel: null,
        vocabularyStates: [],
        grammarStates: [],
        srsCards: [],
        errorBank: [],
        achievements: [],
        settings: null,
        progressHistory: [],
        curriculumDays: [],
        dailyLessons: [],
        lessonCompletions: [],
        audioFiles: [],
        vocabularyItems: [],
        userProfile,
        learningProgress,
        lessonProgress,
        vocabularyMemory,
        speakingScores,
        pronunciationScores,
        conversationHistory,
        adaptiveDecisions,
      },
    };
  }

  /**
   * Import user data from JSON
   */
  async importUserData(data: DataExport): Promise<void> {
    const db = getDatabase();

    // Import user profile
    if (data.data.userProfile) {
      await db.userProfiles.put(data.data.userProfile as UserProfile);
    }

    // Import learning progress
    if (data.data.learningProgress) {
      await db.learningProgress.bulkPut(data.data.learningProgress as LearningProgress[]);
    }

    // Import lesson progress
    if (data.data.lessonProgress) {
      await db.lessonProgress.bulkPut(data.data.lessonProgress as LessonProgress[]);
    }

    // Import vocabulary memory
    if (data.data.vocabularyMemory) {
      await db.vocabularyMemory.bulkPut(data.data.vocabularyMemory as VocabularyMemory[]);
    }

    // Import speaking scores
    if (data.data.speakingScores) {
      await db.speakingScores.bulkPut(data.data.speakingScores as SpeakingScore[]);
    }

    // Import pronunciation scores
    if (data.data.pronunciationScores) {
      await db.pronunciationScores.bulkPut(data.data.pronunciationScores as PronunciationScore[]);
    }

    // Import conversation history
    if (data.data.conversationHistory) {
      await db.conversationHistory.bulkPut(data.data.conversationHistory as ConversationHistory[]);
    }

    // Import adaptive decisions
    if (data.data.adaptiveDecisions) {
      await db.adaptiveDecisions.bulkPut(data.data.adaptiveDecisions as AdaptiveDecision[]);
    }
  }

  /**
   * Delete all user data
   */
  async deleteUserData(userId: string): Promise<void> {
    const db = getDatabase();

    await db.userProfiles.delete(userId);
    await db.learningProgress.where("userId").equals(userId).delete();
    await db.lessonProgress.where("userId").equals(userId).delete();
    await db.vocabularyMemory.where("userId").equals(userId).delete();
    await db.speakingScores.where("userId").equals(userId).delete();
    await db.pronunciationScores.where("userId").equals(userId).delete();
    await db.conversationHistory.where("userId").equals(userId).delete();
    await db.adaptiveDecisions.where("userId").equals(userId).delete();
  }

  /**
   * Get user statistics
   */
  async getUserStats(userId: string): Promise<{
    totalStudyMinutes: number;
    totalWordsLearned: number;
    totalLessonsCompleted: number;
    totalSpeakingAttempts: number;
    averageAccuracy: number;
    currentStreak: number;
  }> {
    const db = getDatabase();

    const learningProgress = await db.learningProgress
      .where("userId")
      .equals(userId)
      .toArray();

    const lessonProgress = await db.lessonProgress
      .where("userId")
      .equals(userId)
      .toArray();

    const vocabularyMemory = await db.vocabularyMemory
      .where("userId")
      .equals(userId)
      .toArray();

    const speakingScores = await db.speakingScores
      .where("userId")
      .equals(userId)
      .toArray();

    const totalStudyMinutes = learningProgress.reduce(
      (sum, p) => sum + p.studyMinutes,
      0
    );

    const totalWordsLearned = vocabularyMemory.length;

    const totalLessonsCompleted = lessonProgress.filter(
      p => p.status === "completed"
    ).length;

    const totalSpeakingAttempts = speakingScores.length;

    const averageAccuracy =
      speakingScores.length > 0
        ? speakingScores.reduce((sum, s) => sum + s.overall, 0) /
          speakingScores.length
        : 0;

    // Calculate streak
    let currentStreak = 0;
    const sortedProgress = learningProgress.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    for (const progress of sortedProgress) {
      if (progress.wordsLearned > 0) {
        currentStreak++;
      } else {
        break;
      }
    }

    return {
      totalStudyMinutes,
      totalWordsLearned,
      totalLessonsCompleted,
      totalSpeakingAttempts,
      averageAccuracy,
      currentStreak,
    };
  }
}
