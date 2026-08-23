/**
 * Data Storage Service
 *
 * Handles:
 * - User learning progress
 * - Vocabulary mastery
 * - SRS state
 * - Study time
 * - AI conversation history
 * - Assessments
 * - Feedback
 */

// ============================================================
// Types
// ============================================================

export interface LearningProgress {
  userId: string;
  currentDay: number;
  totalStudyMinutes: number;
  wordsLearned: number;
  wordsMastered: number;
  lessonsCompleted: number[];
  lastStudyDate: string;
  streak: number;
  longestStreak: number;
}

export interface VocabularyState {
  userId: string;
  word: string;
  mastery: number; // 0-100
  lastReview: string;
  nextReview: string;
  reviewCount: number;
  correctCount: number;
}

export interface SRSState {
  userId: string;
  cards: SRSCard[];
}

export interface SRSCard {
  word: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
  dueDate: string;
}

export interface StudySession {
  id: string;
  userId: string;
  date: string;
  startTime: string;
  endTime?: string;
  durationMinutes: number;
  activities: string[];
  wordsLearned: number;
  score: number;
}

export interface AIConversation {
  id: string;
  userId: string;
  date: string;
  messages: { role: "user" | "assistant"; content: string }[];
  corrections: { original: string; corrected: string }[];
}

export interface AssessmentResult {
  id: string;
  userId: string;
  day: number;
  type: "daily" | "weekly" | "milestone";
  score: number;
  details: Record<string, unknown>;
  completedAt: string;
}

export interface UserFeedback {
  id: string;
  userId: string;
  date: string;
  type: "daily" | "weekly";
  data: Record<string, unknown>;
}

// ============================================================
// Storage Keys
// ============================================================

const STORAGE_PREFIX = "english360_";

const STORAGE_KEYS = {
  PROGRESS: `${STORAGE_PREFIX}progress`,
  VOCABULARY: `${STORAGE_PREFIX}vocabulary`,
  SRS: `${STORAGE_PREFIX}srs`,
  SESSIONS: `${STORAGE_PREFIX}sessions`,
  CONVERSATIONS: `${STORAGE_PREFIX}conversations`,
  ASSESSMENTS: `${STORAGE_PREFIX}assessments`,
  FEEDBACK: `${STORAGE_PREFIX}feedback`,
};

// ============================================================
// Helper Functions
// ============================================================

function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveToStorage(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Storage save failed:", e);
  }
}

function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// ============================================================
// Data Storage Service
// ============================================================

export class DataStorageService {
  // ============================================================
  // Learning Progress
  // ============================================================

  getProgress(userId: string): LearningProgress | null {
    const allProgress = loadFromStorage<LearningProgress[]>(STORAGE_KEYS.PROGRESS, []);
    return allProgress.find(p => p.userId === userId) || null;
  }

  saveProgress(progress: LearningProgress): void {
    const allProgress = loadFromStorage<LearningProgress[]>(STORAGE_KEYS.PROGRESS, []);
    const index = allProgress.findIndex(p => p.userId === progress.userId);

    if (index >= 0) {
      allProgress[index] = progress;
    } else {
      allProgress.push(progress);
    }

    saveToStorage(STORAGE_KEYS.PROGRESS, allProgress);
  }

  updateProgress(userId: string, updates: Partial<LearningProgress>): LearningProgress {
    const existing = this.getProgress(userId) || {
      userId,
      currentDay: 1,
      totalStudyMinutes: 0,
      wordsLearned: 0,
      wordsMastered: 0,
      lessonsCompleted: [],
      lastStudyDate: "",
      streak: 0,
      longestStreak: 0,
    };

    const updated = { ...existing, ...updates };
    this.saveProgress(updated);
    return updated;
  }

  // ============================================================
  // Vocabulary State
  // ============================================================

  getVocabularyStates(userId: string): VocabularyState[] {
    const allStates = loadFromStorage<VocabularyState[]>(STORAGE_KEYS.VOCABULARY, []);
    return allStates.filter(s => s.userId === userId);
  }

  saveVocabularyState(state: VocabularyState): void {
    const allStates = loadFromStorage<VocabularyState[]>(STORAGE_KEYS.VOCABULARY, []);
    const index = allStates.findIndex(
      s => s.userId === state.userId && s.word === state.word
    );

    if (index >= 0) {
      allStates[index] = state;
    } else {
      allStates.push(state);
    }

    saveToStorage(STORAGE_KEYS.VOCABULARY, allStates);
  }

  getVocabularyState(userId: string, word: string): VocabularyState | null {
    const allStates = loadFromStorage<VocabularyState[]>(STORAGE_KEYS.VOCABULARY, []);
    return allStates.find(s => s.userId === userId && s.word === word) || null;
  }

  // ============================================================
  // SRS State
  // ============================================================

  getSRSState(userId: string): SRSState {
    const allStates = loadFromStorage<SRSState[]>(STORAGE_KEYS.SRS, []);
    return allStates.find(s => s.userId === userId) || { userId, cards: [] };
  }

  saveSRSState(state: SRSState): void {
    const allStates = loadFromStorage<SRSState[]>(STORAGE_KEYS.SRS, []);
    const index = allStates.findIndex(s => s.userId === state.userId);

    if (index >= 0) {
      allStates[index] = state;
    } else {
      allStates.push(state);
    }

    saveToStorage(STORAGE_KEYS.SRS, allStates);
  }

  // ============================================================
  // Study Sessions
  // ============================================================

  getStudySessions(userId: string, limit: number = 30): StudySession[] {
    const allSessions = loadFromStorage<StudySession[]>(STORAGE_KEYS.SESSIONS, []);
    return allSessions
      .filter(s => s.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  }

  saveStudySession(session: Omit<StudySession, "id">): StudySession {
    const allSessions = loadFromStorage<StudySession[]>(STORAGE_KEYS.SESSIONS, []);
    const newSession: StudySession = { ...session, id: generateId() };
    allSessions.push(newSession);
    saveToStorage(STORAGE_KEYS.SESSIONS, allSessions);
    return newSession;
  }

  // ============================================================
  // AI Conversations
  // ============================================================

  getAIConversations(userId: string, limit: number = 10): AIConversation[] {
    const allConversations = loadFromStorage<AIConversation[]>(STORAGE_KEYS.CONVERSATIONS, []);
    return allConversations
      .filter(c => c.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  }

  saveAIConversation(conversation: Omit<AIConversation, "id">): AIConversation {
    const allConversations = loadFromStorage<AIConversation[]>(STORAGE_KEYS.CONVERSATIONS, []);
    const newConversation: AIConversation = { ...conversation, id: generateId() };
    allConversations.push(newConversation);
    saveToStorage(STORAGE_KEYS.CONVERSATIONS, allConversations);
    return newConversation;
  }

  // ============================================================
  // Assessments
  // ============================================================

  getAssessments(userId: string): AssessmentResult[] {
    const allAssessments = loadFromStorage<AssessmentResult[]>(STORAGE_KEYS.ASSESSMENTS, []);
    return allAssessments.filter(a => a.userId === userId);
  }

  saveAssessment(assessment: Omit<AssessmentResult, "id">): AssessmentResult {
    const allAssessments = loadFromStorage<AssessmentResult[]>(STORAGE_KEYS.ASSESSMENTS, []);
    const newAssessment: AssessmentResult = { ...assessment, id: generateId() };
    allAssessments.push(newAssessment);
    saveToStorage(STORAGE_KEYS.ASSESSMENTS, allAssessments);
    return newAssessment;
  }

  // ============================================================
  // Feedback
  // ============================================================

  getFeedback(userId: string): UserFeedback[] {
    const allFeedback = loadFromStorage<UserFeedback[]>(STORAGE_KEYS.FEEDBACK, []);
    return allFeedback.filter(f => f.userId === userId);
  }

  saveFeedback(feedback: Omit<UserFeedback, "id">): UserFeedback {
    const allFeedback = loadFromStorage<UserFeedback[]>(STORAGE_KEYS.FEEDBACK, []);
    const newFeedback: UserFeedback = { ...feedback, id: generateId() };
    allFeedback.push(newFeedback);
    saveToStorage(STORAGE_KEYS.FEEDBACK, allFeedback);
    return newFeedback;
  }

  // ============================================================
  // Export/Import
  // ============================================================

  exportUserData(_userId: string): string {
    const data = {
      progress: this.getProgress(_userId),
      vocabulary: this.getVocabularyStates(_userId),
      srs: this.getSRSState(_userId),
      sessions: this.getStudySessions(_userId, 1000),
      conversations: this.getAIConversations(_userId, 100),
      assessments: this.getAssessments(_userId),
      feedback: this.getFeedback(_userId),
    };

    return JSON.stringify(data, null, 2);
  }

  importUserData(_userId: string, jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);

      if (data.progress) this.saveProgress(data.progress);
      if (data.vocabulary) {
        for (const v of data.vocabulary) {
          this.saveVocabularyState(v);
        }
      }
      if (data.srs) this.saveSRSState(data.srs);
      if (data.sessions) {
        for (const s of data.sessions) {
          this.saveStudySession(s);
        }
      }
      if (data.conversations) {
        for (const c of data.conversations) {
          this.saveAIConversation(c);
        }
      }
      if (data.assessments) {
        for (const a of data.assessments) {
          this.saveAssessment(a);
        }
      }
      if (data.feedback) {
        for (const f of data.feedback) {
          this.saveFeedback(f);
        }
      }

      return true;
    } catch {
      return false;
    }
  }

  // ============================================================
  // Clear Data
  // ============================================================

  clearUserData(userId: string): void {
    // Clear progress
    const allProgress = loadFromStorage<LearningProgress[]>(STORAGE_KEYS.PROGRESS, []);
    saveToStorage(
      STORAGE_KEYS.PROGRESS,
      allProgress.filter(p => p.userId !== userId)
    );

    // Clear vocabulary
    const allVocab = loadFromStorage<VocabularyState[]>(STORAGE_KEYS.VOCABULARY, []);
    saveToStorage(
      STORAGE_KEYS.VOCABULARY,
      allVocab.filter(v => v.userId !== userId)
    );

    // Clear SRS
    const allSRS = loadFromStorage<SRSState[]>(STORAGE_KEYS.SRS, []);
    saveToStorage(
      STORAGE_KEYS.SRS,
      allSRS.filter(s => s.userId !== userId)
    );

    // Clear sessions
    const allSessions = loadFromStorage<StudySession[]>(STORAGE_KEYS.SESSIONS, []);
    saveToStorage(
      STORAGE_KEYS.SESSIONS,
      allSessions.filter(s => s.userId !== userId)
    );

    // Clear conversations
    const allConvos = loadFromStorage<AIConversation[]>(STORAGE_KEYS.CONVERSATIONS, []);
    saveToStorage(
      STORAGE_KEYS.CONVERSATIONS,
      allConvos.filter(c => c.userId !== userId)
    );

    // Clear assessments
    const allAssess = loadFromStorage<AssessmentResult[]>(STORAGE_KEYS.ASSESSMENTS, []);
    saveToStorage(
      STORAGE_KEYS.ASSESSMENTS,
      allAssess.filter(a => a.userId !== userId)
    );

    // Clear feedback
    const allFeedback = loadFromStorage<UserFeedback[]>(STORAGE_KEYS.FEEDBACK, []);
    saveToStorage(
      STORAGE_KEYS.FEEDBACK,
      allFeedback.filter(f => f.userId !== userId)
    );
  }
}

// ============================================================
// Singleton
// ============================================================

export const dataStorage = new DataStorageService();
export default dataStorage;
