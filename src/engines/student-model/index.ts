/**
 * Student Model Engine
 *
 * Implements full CRUD operations for the user capability model.
 * Tracks all 9 skill domains, performance windows, and trends.
 */

import { getDatabase } from "@/db";
import type {
  StudentModel,
  SkillScores,
  SkillScore,
  VocabularyStats,
  GrammarStats,
  ListeningStats,
  SpeakingStats,
  ReadingStats,
  WritingStats,
  PronunciationStats,
  PerformanceWindow,
  UserSettings,
} from "@/types/student-model";
import type { SkillDomain } from "@/types";

const DEFAULT_SETTINGS: UserSettings = {
  adaptiveMode: "auto",
  intensity: "standard",
  strictness: "standard",
  dailyTargetMinutes: 60,
  chineseAssistLevel: "auto",
  soundEnabled: true,
  microphoneEnabled: false,
  targetAccent: "american",
  interfaceLanguage: "auto",
};

function createDefaultSkillScore(): SkillScore {
  return {
    score: 0,
    level: "beginner",
    lastUpdated: Date.now(),
    trend: "stable",
  };
}

function createDefaultSkillScores(): SkillScores {
  return {
    vocabulary: createDefaultSkillScore(),
    grammar: createDefaultSkillScore(),
    phonics: createDefaultSkillScore(),
    listening: createDefaultSkillScore(),
    speaking: createDefaultSkillScore(),
    reading: createDefaultSkillScore(),
    writing: createDefaultSkillScore(),
    pronunciation: createDefaultSkillScore(),
    fluency: createDefaultSkillScore(),
    naturalness: createDefaultSkillScore(),
  };
}

function scoreToLevel(score: number): StudentModel["competencyLevel"] {
  if (score >= 95) return "native_like_proficiency";
  if (score >= 85) return "very_advanced";
  if (score >= 75) return "advanced";
  if (score >= 60) return "upper_intermediate";
  if (score >= 45) return "intermediate";
  if (score >= 30) return "elementary";
  if (score >= 15) return "basic";
  return "beginner";
}

function updateSkillTrend(
  current: SkillScore,
  newScore: number,
): "improving" | "stable" | "declining" {
  const diff = newScore - current.score;
  if (diff > 2) return "improving";
  if (diff < -2) return "declining";
  return "stable";
}

function computeOverallScore(skills: SkillScores): number {
  const weights: Record<string, number> = {
    vocabulary: 0.15,
    grammar: 0.12,
    listening: 0.15,
    speaking: 0.15,
    reading: 0.15,
    writing: 0.12,
    pronunciation: 0.08,
    fluency: 0.05,
    naturalness: 0.03,
  };

  let total = 0;
  let weightSum = 0;
  for (const [key, weight] of Object.entries(weights)) {
    const skill = skills[key as keyof SkillScores];
    if (skill) {
      total += skill.score * weight;
      weightSum += weight;
    }
  }

  return weightSum > 0 ? total / weightSum : 0;
}

export class StudentModelEngine {
  /**
   * Create a new student model for a user
   */
  async createStudent(userId: string, settings?: Partial<UserSettings>): Promise<StudentModel> {
    const db = getDatabase();
    const now = Date.now();

    const student: StudentModel = {
      userId,
      createdAt: now,
      lastActive: now,
      dayNumber: 0,
      competencyLevel: "beginner",
      overallScore: 0,
      skills: createDefaultSkillScores(),
      vocabularyStats: createEmptyVocabularyStats(),
      grammarStats: createEmptyGrammarStats(),
      listeningStats: createEmptyListeningStats(),
      speakingStats: createEmptySpeakingStats(),
      readingStats: createEmptyReadingStats(),
      writingStats: createEmptyWritingStats(),
      pronunciationStats: createEmptyPronunciationStats(),
      recentPerformance: [],
      longTermTrend: { direction: "stable", rate: 0, volatility: 0 },
      settings: { ...DEFAULT_SETTINGS, ...settings },
      xp: 0,
      level: 1,
      streak: 0,
      lastStudyDate: "",
    };

    await db.studentModels.put(student);
    return student;
  }

  /**
   * Get student model by userId
   */
  async getStudent(userId: string): Promise<StudentModel | null> {
    const db = getDatabase();
    return (await db.studentModels.get(userId)) as StudentModel | null;
  }

  /**
   * Update student model fields
   */
  async updateStudent(
    userId: string,
    updates: Partial<Omit<StudentModel, "userId" | "createdAt">>,
  ): Promise<StudentModel> {
    const db = getDatabase();
    const existing = await this.getStudent(userId);
    if (!existing) {
      throw new Error(`Student not found: ${userId}`);
    }

    const updated: StudentModel = {
      ...existing,
      ...updates,
      lastActive: Date.now(),
    };

    // Recalculate overall score if skills changed
    if (updates.skills) {
      updated.overallScore = computeOverallScore(updated.skills);
      updated.competencyLevel = scoreToLevel(updated.overallScore);
    }

    await db.studentModels.put(updated);
    return updated;
  }

  /**
   * Update a specific skill score
   */
  async updateSkillScore(
    userId: string,
    domain: SkillDomain,
    newScore: number,
  ): Promise<StudentModel> {
    const student = await this.getStudent(userId);
    if (!student) throw new Error(`Student not found: ${userId}`);

    const current = student.skills[domain];
    const trend = updateSkillTrend(current, newScore);

    const updatedSkill: SkillScore = {
      score: Math.max(0, Math.min(100, newScore)),
      level: scoreToLevel(newScore),
      lastUpdated: Date.now(),
      trend,
    };

    const updatedSkills = { ...student.skills, [domain]: updatedSkill };
    const updatedOverall = computeOverallScore(updatedSkills);

    return this.updateStudent(userId, {
      skills: updatedSkills,
      overallScore: updatedOverall,
      competencyLevel: scoreToLevel(updatedOverall),
    });
  }

  /**
   * Record a performance window (a study session result)
   */
  async recordPerformance(userId: string, window: PerformanceWindow): Promise<StudentModel> {
    const student = await this.getStudent(userId);
    if (!student) throw new Error(`Student not found: ${userId}`);

    const recentPerformance = [...student.recentPerformance, window];

    // Keep only last 30 days of performance data
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const filtered = recentPerformance.filter((w) => {
      const date = new Date(w.date).getTime();
      return date > thirtyDaysAgo;
    });

    return this.updateStudent(userId, { recentPerformance: filtered });
  }

  /**
   * Get performance for a specific domain over recent days
   */
  async getDomainPerformance(
    userId: string,
    domain: SkillDomain,
    days: number = 7,
  ): Promise<PerformanceWindow[]> {
    const student = await this.getStudent(userId);
    if (!student) return [];

    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    return student.recentPerformance.filter((w) => {
      const date = new Date(w.date).getTime();
      return w.domain === domain && date > cutoff;
    });
  }

  /**
   * Get the weakest skill domains
   */
  async getWeakDomains(userId: string, count: number = 3): Promise<SkillDomain[]> {
    const student = await this.getStudent(userId);
    if (!student) return [];

    const domains: SkillDomain[] = [
      "vocabulary",
      "grammar",
      "phonics",
      "listening",
      "speaking",
      "reading",
      "writing",
      "pronunciation",
      "fluency",
      "naturalness",
    ];

    return domains
      .sort((a, b) => student.skills[a].score - student.skills[b].score)
      .slice(0, count);
  }

  /**
   * Get the strongest skill domains
   */
  async getStrongDomains(userId: string, count: number = 3): Promise<SkillDomain[]> {
    const student = await this.getStudent(userId);
    if (!student) return [];

    const domains: SkillDomain[] = [
      "vocabulary",
      "grammar",
      "phonics",
      "listening",
      "speaking",
      "reading",
      "writing",
      "pronunciation",
      "fluency",
      "naturalness",
    ];

    return domains
      .sort((a, b) => student.skills[b].score - student.skills[a].score)
      .slice(0, count);
  }

  /**
   * Update study streak
   */
  async updateStreak(userId: string): Promise<StudentModel> {
    const student = await this.getStudent(userId);
    if (!student) throw new Error(`Student not found: ${userId}`);

    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

    let newStreak = student.streak;
    if (student.lastStudyDate === today) {
      // Already studied today, no change
    } else if (student.lastStudyDate === yesterday) {
      newStreak = student.streak + 1;
    } else if (student.lastStudyDate === "") {
      newStreak = 1;
    } else {
      // Streak broken
      newStreak = 1;
    }

    return this.updateStudent(userId, {
      streak: newStreak,
      lastStudyDate: today,
    });
  }

  /**
   * Delete student model
   */
  async deleteStudent(userId: string): Promise<void> {
    const db = getDatabase();
    await db.studentModels.delete(userId);
  }

  /**
   * Get all students (for future multi-user support)
   */
  async getAllStudents(): Promise<StudentModel[]> {
    const db = getDatabase();
    return (await db.studentModels.toArray()) as StudentModel[];
  }
}

// ============================================================
// Helper functions for empty stats
// ============================================================

function createEmptyVocabularyStats(): VocabularyStats {
  return {
    totalSeen: 0,
    recognized: 0,
    recalled: 0,
    produced: 0,
    mastered: 0,
    transferred: 0,
    currentStreak: 0,
    averageEaseFactor: 2.5,
  };
}

function createEmptyGrammarStats(): GrammarStats {
  return {
    totalPoints: 0,
    understood: 0,
    practiced: 0,
    mastered: 0,
    transferred: 0,
  };
}

function createEmptyListeningStats(): ListeningStats {
  return {
    comprehensionScore: 0,
    phonemeDiscrimination: 0,
    wordRecognition: 0,
    sentenceRecognition: 0,
    connectedSpeechScore: 0,
    realWorldComprehension: 0,
  };
}

function createEmptySpeakingStats(): SpeakingStats {
  return {
    pronunciationScore: 0,
    fluencyScore: 0,
    spontaneityScore: 0,
    accuracyScore: 0,
    naturalnessScore: 0,
  };
}

function createEmptyReadingStats(): ReadingStats {
  return {
    comprehensionScore: 0,
    readingSpeed: 0,
    inferenceScore: 0,
    contextClueScore: 0,
    level: "beginner",
  };
}

function createEmptyWritingStats(): WritingStats {
  return {
    grammarAccuracy: 0,
    spellingAccuracy: 0,
    vocabularyRange: 0,
    sentenceStructure: 0,
    coherence: 0,
    naturalness: 0,
  };
}

function createEmptyPronunciationStats(): PronunciationStats {
  return {
    phonemeAccuracy: 0,
    wordStress: 0,
    sentenceStress: 0,
    intonation: 0,
    connectedSpeech: 0,
    overallScore: 0,
  };
}
