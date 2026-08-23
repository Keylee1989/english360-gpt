import Dexie, { type EntityTable } from "dexie";
import { DB_SCHEMA_VERSION } from "@/types/database";
import type { StudentModel } from "@/types/student-model";
import type { SRSCard } from "@/types/srs";
import type { KnowledgeState, KnowledgeItem, KnowledgeEdge } from "@/types/knowledge";
import type { VocabularyState } from "@/types/vocabulary";
import type { GrammarState } from "@/types/grammar";
import type {
  CurriculumDay,
  DailyLesson,
  LessonCompletion,
  AudioFile,
  VocabularyFullData,
  UserProfile,
  LearningProgress,
  LessonProgress,
  VocabularyMemory,
  SpeakingScore,
  PronunciationScore,
  ConversationHistory,
  AdaptiveDecision,
} from "@/types/database";

/**
 * English360 GPT Database
 *
 * Uses Dexie (IndexedDB wrapper) for local persistence.
 * All core learning data is stored locally first.
 * Future: Sync Adapter can sync to remote backend.
 */
class English360DB extends Dexie {
  // Existing tables
  studentModels!: EntityTable<StudentModel, "userId">;
  knowledgeStates!: EntityTable<KnowledgeState, "id">;
  knowledgeItems!: EntityTable<KnowledgeItem, "id">;
  knowledgeEdges!: EntityTable<KnowledgeEdge, "id">;
  vocabularyStates!: EntityTable<VocabularyState, "entryId">;
  grammarStates!: EntityTable<GrammarState, "pointId">;
  srsCards!: EntityTable<SRSCard, "id">;
  errorBank!: EntityTable<Record<string, unknown>, "id">;
  achievements!: EntityTable<Record<string, unknown>, "id">;
  progressHistory!: EntityTable<Record<string, unknown>, "id">;
  settings!: EntityTable<Record<string, unknown>, "key">;

  // New tables for Phase 3B
  curriculumDays!: EntityTable<CurriculumDay, "id">;
  dailyLessons!: EntityTable<DailyLesson, "id">;
  lessonCompletions!: EntityTable<LessonCompletion, "id">;
  audioFiles!: EntityTable<AudioFile, "id">;
  vocabularyFullData!: EntityTable<VocabularyFullData, "id">;

  // New tables for Phase 6: Progress Persistence
  userProfiles!: EntityTable<UserProfile, "id">;
  learningProgress!: EntityTable<LearningProgress, "id">;
  lessonProgress!: EntityTable<LessonProgress, "id">;
  vocabularyMemory!: EntityTable<VocabularyMemory, "id">;
  speakingScores!: EntityTable<SpeakingScore, "id">;
  pronunciationScores!: EntityTable<PronunciationScore, "id">;
  conversationHistory!: EntityTable<ConversationHistory, "id">;
  adaptiveDecisions!: EntityTable<AdaptiveDecision, "id">;

  constructor() {
    super(`English360DB_v${DB_SCHEMA_VERSION}`);

    this.version(DB_SCHEMA_VERSION).stores({
      // Existing tables
      studentModels: "userId, competencyLevel, lastActive",
      knowledgeStates: "id, [userId+itemId], [userId+domain], [userId+learningState], [userId+nextReview], domain",
      knowledgeItems: "id, domain, type, [domain+type]",
      knowledgeEdges: "id, fromItemId, toItemId, relationship",
      vocabularyStates: "entryId, [entryId+userId], learningState, nextReview",
      grammarStates: "pointId, [pointId+userId], learningState",
      srsCards: "id, entryId, entityType, [entityType+dueDate], dueDate, [dueDate+entityType]",
      errorBank: "id, category, frequency, userId",
      achievements: "id, userId, earnedAt",
      progressHistory: "id, userId, date, domain",
      settings: "key",

      // New tables for Phase 3B
      curriculumDays: "id, dayNumber, stage, week, order",
      dailyLessons: "id, dayId",
      lessonCompletions: "id, [userId+dayId], userId, dayId, passed",
      audioFiles: "id, text, speed",
      vocabularyFullData: "id, word, cefr, difficulty, [cefr+difficulty]",

      // New tables for Phase 6: Progress Persistence
      userProfiles: "id, level, lastActiveAt",
      learningProgress: "id, [userId+date], userId, date",
      lessonProgress: "id, [userId+lessonId], userId, lessonId, dayNumber, status",
      vocabularyMemory: "id, [userId+wordId], userId, wordId, learningState, nextReview",
      speakingScores: "id, [userId+timestamp], userId, timestamp, exerciseType",
      pronunciationScores: "id, [userId+timestamp], userId, timestamp, targetWord",
      conversationHistory: "id, [userId+timestamp], userId, sessionId, scenario, level",
      adaptiveDecisions: "id, [userId+timestamp], userId, timestamp, type",
    });
  }
}

let db: English360DB;

export function getDatabase(): English360DB {
  if (!db) {
    db = new English360DB();
  }
  return db;
}

/**
 * Reset database (for testing only)
 */
export async function resetDatabase(): Promise<void> {
  if (db) {
    await db.delete();
    db = new English360DB();
  }
}

export { English360DB };
