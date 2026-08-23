/**
 * Progress Persistence Service
 *
 * Ensures user data persists across:
 * - Page refresh
 * - App close/reopen
 * - Browser restart
 *
 * Uses IndexedDB as primary storage
 * Falls back to localStorage if needed
 */

import { openDB, type IDBPDatabase } from "idb";

// ============================================================
// Types
// ============================================================

export interface UserProfile {
  userId: string;
  currentDay: number;
  level: "A1" | "A2" | "B1" | "B2";
  vocabularyLevel: number;
  listeningLevel: number;
  speakingLevel: number;
  grammarLevel: number;
  readingLevel: number;
  writingLevel: number;
  pronunciationLevel: number;
  weakAreas: string[];
  strongAreas: string[];
  wordsLearned: number;
  wordsMastered: number;
  retentionRate: number;
  studyStreak: number;
  bestStreak: number;
  dailyGoalMinutes: number;
  createdAt: number;
  updatedAt: number;
}

export interface DailyProgress {
  date: string;
  day: number;
  completedActivities: string[];
  score: number;
  studyMinutes: number;
  wordsLearned: number;
  wordsReviewed: number;
  listeningMinutes: number;
  speakingMinutes: number;
}

export interface VocabularyState {
  wordId: string;
  word: string;
  mastery: number; // 0-100
  nextReview: number; // timestamp
  reviewCount: number;
  lastReview: number;
  interval: number; // days
  easeFactor: number;
}

export interface ConversationRecord {
  id: string;
  date: string;
  topic: string;
  messageCount: number;
  corrections: number;
  score: number;
}

export interface LearningStats {
  totalStudyMinutes: number;
  totalWordsLearned: number;
  totalReviews: number;
  averageScore: number;
  currentStreak: number;
  bestStreak: number;
}

// ============================================================
// Database Schema
// ============================================================

const DB_NAME = "english360";
const DB_VERSION = 1;

const STORES = {
  PROFILE: "profile",
  DAILY_PROGRESS: "dailyProgress",
  VOCABULARY: "vocabulary",
  CONVERSATIONS: "conversations",
  STATS: "stats",
};

// ============================================================
// Progress Persistence Service
// ============================================================

class ProgressPersistenceService {
  private db: IDBPDatabase | null = null;
  private initialized = false;

  /**
   * Initialize IndexedDB
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      this.db = await openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
          // Profile store
          if (!db.objectStoreNames.contains(STORES.PROFILE)) {
            db.createObjectStore(STORES.PROFILE, { keyPath: "userId" });
          }

          // Daily progress store
          if (!db.objectStoreNames.contains(STORES.DAILY_PROGRESS)) {
            const progressStore = db.createObjectStore(STORES.DAILY_PROGRESS, {
              keyPath: ["userId", "date"],
            });
            progressStore.createIndex("byDate", "date");
          }

          // Vocabulary store
          if (!db.objectStoreNames.contains(STORES.VOCABULARY)) {
            const vocabStore = db.createObjectStore(STORES.VOCABULARY, {
              keyPath: "wordId",
            });
            vocabStore.createIndex("byNextReview", "nextReview");
          }

          // Conversations store
          if (!db.objectStoreNames.contains(STORES.CONVERSATIONS)) {
            db.createObjectStore(STORES.CONVERSATIONS, { keyPath: "id" });
          }

          // Stats store
          if (!db.objectStoreNames.contains(STORES.STATS)) {
            db.createObjectStore(STORES.STATS, { keyPath: "userId" });
          }
        },
      });

      this.initialized = true;
      console.log("IndexedDB initialized successfully");
    } catch (error) {
      console.error("Failed to initialize IndexedDB:", error);
      // Fallback to localStorage
      this.initialized = true;
    }
  }

  /**
   * Get user profile
   */
  async getProfile(userId: string): Promise<UserProfile | null> {
    await this.initialize();

    if (this.db) {
      try {
        const profile = await this.db.get(STORES.PROFILE, userId);
        return profile || null;
      } catch (error) {
        console.error("Failed to get profile from IndexedDB:", error);
      }
    }

    // Fallback to localStorage
    const stored = localStorage.getItem(`english360_profile_${userId}`);
    return stored ? JSON.parse(stored) : null;
  }

  /**
   * Save user profile
   */
  async saveProfile(profile: UserProfile): Promise<void> {
    await this.initialize();

    const now = Date.now();
    const updatedProfile = {
      ...profile,
      updatedAt: now,
    };

    if (this.db) {
      try {
        await this.db.put(STORES.PROFILE, updatedProfile);
      } catch (error) {
        console.error("Failed to save profile to IndexedDB:", error);
      }
    }

    // Also save to localStorage as backup
    localStorage.setItem(
      `english360_profile_${profile.userId}`,
      JSON.stringify(updatedProfile)
    );
  }

  /**
   * Get daily progress
   */
  async getDailyProgress(
    userId: string,
    date: string
  ): Promise<DailyProgress | null> {
    await this.initialize();

    if (this.db) {
      try {
        const progress = await this.db.get(
          STORES.DAILY_PROGRESS,
          [userId, date]
        );
        return progress || null;
      } catch (error) {
        console.error("Failed to get daily progress:", error);
      }
    }

    // Fallback to localStorage
    const stored = localStorage.getItem(
      `english360_progress_${userId}_${date}`
    );
    return stored ? JSON.parse(stored) : null;
  }

  /**
   * Save daily progress
   */
  async saveDailyProgress(progress: DailyProgress): Promise<void> {
    await this.initialize();

    if (this.db) {
      try {
        await this.db.put(STORES.DAILY_PROGRESS, progress);
      } catch (error) {
        console.error("Failed to save daily progress:", error);
      }
    }

    // Also save to localStorage as backup
    localStorage.setItem(
      `english360_progress_${progress.date}`,
      JSON.stringify(progress)
    );
  }

  /**
   * Get vocabulary state
   */
  async getVocabularyState(userId: string): Promise<VocabularyState[]> {
    await this.initialize();

    if (this.db) {
      try {
        const allWords = await this.db.getAll(STORES.VOCABULARY);
        return allWords.filter((w) => w.wordId.startsWith(userId));
      } catch (error) {
        console.error("Failed to get vocabulary state:", error);
      }
    }

    // Fallback to localStorage
    const stored = localStorage.getItem(`english360_vocabulary_${userId}`);
    return stored ? JSON.parse(stored) : [];
  }

  /**
   * Save vocabulary state
   */
  async saveVocabularyState(
    userId: string,
    words: VocabularyState[]
  ): Promise<void> {
    await this.initialize();

    if (this.db) {
      try {
        const tx = this.db.transaction(STORES.VOCABULARY, "readwrite");
        for (const word of words) {
          await tx.store.put({ ...word, wordId: `${userId}_${word.wordId}` });
        }
        await tx.done;
      } catch (error) {
        console.error("Failed to save vocabulary state:", error);
      }
    }

    // Also save to localStorage as backup
    localStorage.setItem(
      `english360_vocabulary_${userId}`,
      JSON.stringify(words)
    );
  }

  /**
   * Get conversation records
   */
  async getConversations(userId: string): Promise<ConversationRecord[]> {
    await this.initialize();

    if (this.db) {
      try {
        const allConversations = await this.db.getAll(STORES.CONVERSATIONS);
        return allConversations.filter((c) => c.id.startsWith(userId));
      } catch (error) {
        console.error("Failed to get conversations:", error);
      }
    }

    // Fallback to localStorage
    const stored = localStorage.getItem(
      `english360_conversations_${userId}`
    );
    return stored ? JSON.parse(stored) : [];
  }

  /**
   * Save conversation record
   */
  async saveConversation(record: ConversationRecord): Promise<void> {
    await this.initialize();

    if (this.db) {
      try {
        await this.db.put(STORES.CONVERSATIONS, record);
      } catch (error) {
        console.error("Failed to save conversation:", error);
      }
    }

    // Also save to localStorage as backup
    const conversations = await this.getConversations(record.id.split("_")[0]);
    conversations.push(record);
    localStorage.setItem(
      `english360_conversations_${record.id.split("_")[0]}`,
      JSON.stringify(conversations)
    );
  }

  /**
   * Get learning stats
   */
  async getStats(userId: string): Promise<LearningStats | null> {
    await this.initialize();

    if (this.db) {
      try {
        const stats = await this.db.get(STORES.STATS, userId);
        return stats || null;
      } catch (error) {
        console.error("Failed to get stats:", error);
      }
    }

    // Fallback to localStorage
    const stored = localStorage.getItem(`english360_stats_${userId}`);
    return stored ? JSON.parse(stored) : null;
  }

  /**
   * Save learning stats
   */
  async saveStats(stats: LearningStats & { userId: string }): Promise<void> {
    await this.initialize();

    if (this.db) {
      try {
        await this.db.put(STORES.STATS, stats);
      } catch (error) {
        console.error("Failed to save stats:", error);
      }
    }

    // Also save to localStorage as backup
    localStorage.setItem(
      `english360_stats_${stats.userId}`,
      JSON.stringify(stats)
    );
  }

  /**
   * Export all user data
   */
  async exportData(userId: string): Promise<string> {
    const profile = await this.getProfile(userId);
    const vocabulary = await this.getVocabularyState(userId);
    const conversations = await this.getConversations(userId);
    const stats = await this.getStats(userId);

    const exportData = {
      version: 1,
      exportDate: new Date().toISOString(),
      profile,
      vocabulary,
      conversations,
      stats,
    };

    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Import user data
   */
  async importData(userId: string, data: string): Promise<boolean> {
    try {
      const importData = JSON.parse(data);

      if (importData.profile) {
        await this.saveProfile({ ...importData.profile, userId });
      }

      if (importData.vocabulary) {
        await this.saveVocabularyState(userId, importData.vocabulary);
      }

      if (importData.stats) {
        await this.saveStats({ ...importData.stats, userId });
      }

      return true;
    } catch (error) {
      console.error("Failed to import data:", error);
      return false;
    }
  }

  /**
   * Clear all user data
   */
  async clearData(userId: string): Promise<void> {
    await this.initialize();

    if (this.db) {
      try {
        await this.db.delete(STORES.PROFILE, userId);
        // Note: This doesn't delete all related data, but clears the profile
      } catch (error) {
        console.error("Failed to clear data:", error);
      }
    }

    // Clear localStorage
    localStorage.removeItem(`english360_profile_${userId}`);
    localStorage.removeItem(`english360_vocabulary_${userId}`);
    localStorage.removeItem(`english360_conversations_${userId}`);
    localStorage.removeItem(`english360_stats_${userId}`);
  }
}

// ============================================================
// Singleton Export
// ============================================================

export const progressPersistence = new ProgressPersistenceService();
