/**
 * Database schema version - increment when schema changes
 * Version 5: Added progress persistence tables
 */
export const DB_SCHEMA_VERSION = 5;

/**
 * Data export/import format
 */
export interface DataExport {
  version: number;
  exportedAt: number;
  schemaVersion: number;
  data: {
    studentModel: unknown;
    vocabularyStates: unknown[];
    grammarStates: unknown[];
    srsCards: unknown[];
    errorBank: unknown[];
    achievements: unknown[];
    settings: unknown;
    progressHistory: unknown[];
    curriculumDays: unknown[];
    dailyLessons: unknown[];
    lessonCompletions: unknown[];
    audioFiles: unknown[];
    vocabularyItems: unknown[];
    // New tables for Phase 6
    userProfile: unknown;
    learningProgress: unknown[];
    lessonProgress: unknown[];
    vocabularyMemory: unknown[];
    speakingScores: unknown[];
    pronunciationScores: unknown[];
    conversationHistory: unknown[];
    adaptiveDecisions: unknown[];
  };
}

/**
 * Sync status
 */
export interface SyncStatus {
  lastSync: number | null;
  pendingChanges: number;
  status: "idle" | "syncing" | "error" | "offline";
  error?: string;
}

/**
 * Curriculum Day - defines what to learn on a specific day
 */
export interface CurriculumDay {
  id: string;                    // "day_1", "day_45", etc.
  dayNumber: number;             // 1-360
  stage: 1 | 2 | 3 | 4 | 5;
  week: number;                  // Week within stage
  title: string;
  titleChinese: string;

  // Learning goals
  goals: {
    vocabulary: string[];
    grammar: string[];
    listening: string;
    speaking: string;
    reading: string;
    writing: string;
  };

  // Content references
  vocabularyWordIds: string[];
  grammarPointIds: string[];
  listeningExerciseIds: string[];
  speakingExerciseIds: string[];

  // Time
  estimatedMinutes: number;

  // Prerequisites
  prerequisites: string[];

  // Order within the curriculum
  order: number;
}

/**
 * Daily Lesson - the actual lesson content for a day
 */
export interface DailyLesson {
  id: string;                    // "lesson_day_1"
  dayId: string;                 // References CurriculumDay.id

  // Activity-based structure
  activities: LessonActivity[];

  // Legacy content blocks (for backward compatibility)
  vocabulary: LessonVocabularyBlock;
  grammar: LessonGrammarBlock;
  listening: LessonListeningBlock;
  speaking: LessonSpeakingBlock;
  reading: LessonReadingBlock;
  writing: LessonWritingBlock;
  review: LessonReviewBlock;

  // Metadata
  totalDuration: number;         // Total minutes
  createdAt: number;
  updatedAt: number;
}

/**
 * Lesson Activity - individual learning activity
 */
export interface LessonActivity {
  id: string;                    // "act_1", "act_2", etc.
  type: ActivityType;
  title: string;
  titleChinese: string;
  description: string;
  descriptionChinese: string;
  duration: number;              // minutes

  // Learning objective
  objective: {
    english: string;
    chinese: string;
  };

  // Content
  content: ActivityContent;

  // User action
  userAction: UserAction;

  // Evaluation
  evaluation: ActivityEvaluation;

  // Completion tracking
  completed: boolean;
  score?: number;                // 0-1
  timeSpent?: number;           // seconds
  attempts?: number;
}

export type ActivityType =
  | "phonics"
  | "vocabulary_introduction"
  | "vocabulary_recognition"
  | "vocabulary_recall"
  | "grammar_explanation"
  | "grammar_practice"
  | "listening_comprehension"
  | "listening_dictation"
  | "speaking_repetition"
  | "speaking_conversation"
  | "reading_comprehension"
  | "writing_practice"
  | "review"
  | "assessment";

export interface ActivityContent {
  // For vocabulary
  words?: {
    word: string;
    ipa: string;
    chineseMeaning: string;
    example: string;
    exampleChinese: string;
    memoryHint?: string;
  }[];

  // For grammar
  grammarPoint?: {
    rule: string;
    ruleChinese: string;
    examples: { correct: string; incorrect?: string; chinese: string }[];
  };

  // For listening/speaking
  audio?: {
    text: string;
    chineseText: string;
    speed: "slow" | "normal" | "fast";
  };

  // For reading
  readingPassage?: {
    text: string;
    chineseTranslation: string;
    level: "controlled" | "guided" | "free";
  };

  // For writing
  writingPrompt?: {
    prompt: string;
    chinesePrompt: string;
    wordBank: string[];
    example: string;
  };

  // For phonics
  phonics?: {
    letter: string;
    sound: string;
    soundDescription: string;
    examples: { word: string; chinese: string }[];
  }[];

  // For review/assessment
  reviewItems?: {
    word: string;
    chineseMeaning: string;
  }[];
}

export interface UserAction {
  type: "listen" | "speak" | "type" | "select" | "arrange" | "read" | "write" | "repeat";
  instruction: string;
  instructionChinese: string;
}

export interface ActivityEvaluation {
  type: "automatic" | "self_check" | "peer" | "ai";
  criteria?: string[];
  passingScore?: number;         // 0-1
}

export interface LessonVocabularyBlock {
  words: string[];               // Word IDs
  exercises: LessonExercise[];
}

export interface LessonGrammarBlock {
  pointId: string;
  explanation: {
    english: string;
    chinese: string;
  };
  examples: {
    correct: string;
    incorrect?: string;
    chinese: string;
  }[];
  exercises: LessonExercise[];
}

export interface LessonListeningBlock {
  audioUrl: string;
  transcript: string;
  chineseTranscript: string;
  speed: "slow" | "normal" | "fast";
  questions: LessonQuestion[];
}

export interface LessonSpeakingBlock {
  scenario: string;
  chineseScenario: string;
  dialogue: {
    speaker: "model" | "user";
    english: string;
    chinese: string;
  }[];
  practicePrompts: string[];
}

export interface LessonReadingBlock {
  text: string;
  chineseTranslation: string;
  level: "controlled" | "guided" | "free";
  questions: LessonQuestion[];
}

export interface LessonWritingBlock {
  type: "controlled" | "guided" | "free";
  prompt: string;
  chinesePrompt: string;
  example?: string;
  wordBank?: string[];
}

export interface LessonReviewBlock {
  srsReview: boolean;
  wordReview: string[];
  grammarReview: string[];
}

export interface LessonExercise {
  id: string;
  type: "multiple_choice" | "text_input" | "audio_prompt" | "word_arrangement";
  prompt: string;
  chinesePrompt?: string;
  correctAnswer: string;
  alternatives?: string[];
  options?: string[];
  hints?: string[];
  chineseHints?: string[];
}

export interface LessonQuestion {
  id: string;
  question: string;
  chineseQuestion?: string;
  type: "multiple_choice" | "text_input" | "true_false";
  correctAnswer: string;
  options?: string[];
}

/**
 * Lesson Completion - tracks user progress through lessons
 */
export interface LessonCompletion {
  id: string;                    // "user_day_1"
  userId: string;
  dayId: string;
  startedAt: number;
  completedAt?: number;

  // Results
  vocabularyResults: {
    wordId: string;
    correct: boolean;
    attempts: number;
  }[];

  grammarResults: {
    exerciseId: string;
    correct: boolean;
  }[];

  listeningScore: number;        // 0-1
  speakingScore: number;         // 0-1
  readingScore: number;          // 0-1
  writingScore: number;          // 0-1

  // Overall
  passed: boolean;               // Met minimum requirements
  score: number;                 // 0-100

  // Time
  timeSpent: number;             // seconds
}

/**
 * Audio File - cached audio for offline use
 */
export interface AudioFile {
  id: string;                    // Hash of text + speed
  text: string;
  speed: number;
  blob: Blob;
  createdAt: number;
}

/**
 * Full Vocabulary Item - complete vocabulary data stored in IndexedDB
 */
export interface VocabularyFullData {
  id: string;                    // "vocab_hello"
  word: string;
  chineseMeaning: string;
  ipa: string;
  partOfSpeech: string[];
  frequency: number;
  cefr: string;
  difficulty: string;
  examples: { english: string; chinese: string; register: string }[];
  collocations: { pattern: string; chinese: string; frequency: number; example: string }[];
  chunks: { text: string; chinese: string; type: string }[];
  wordFamily: { base: string; forms: { word: string; partOfSpeech: string }[] };
  roots: { form: string; meaning: string; origin: string }[];
  prefixes: { form: string; meaning: string }[];
  suffixes: { form: string; meaning: string; creates: string }[];
  synonyms: string[];
  antonyms: string[];
  commonErrors: { error: string; correction: string; explanation: string }[];
  contexts: string[];
  memoryMethods: {
    association?: string;
    mnemonic?: string;
    chinesePronHint?: string;
    root?: string;
  };
  phonicsBreakdown: string;
  syllableCount: number;
  stressPattern?: string;
  createdAt: number;
  updatedAt: number;
}

// ============================================================
// Phase 6: Progress Persistence Tables
// ============================================================

/**
 * User Profile - persistent user data
 */
export interface UserProfile {
  id: string;                    // "user_001"
  name: string;
  nameChinese: string;
  level: string;                 // "A1", "A2", etc.
  dailyGoalMinutes: number;
  preferredStudyTime: "morning" | "afternoon" | "evening";
  createdAt: number;
  updatedAt: number;
  lastActiveAt: number;
}

/**
 * Learning Progress - tracks overall progress
 */
export interface LearningProgress {
  id: string;                    // "progress_user_001"
  userId: string;
  date: string;                  // "2024-01-15"

  // Daily metrics
  wordsLearned: number;
  wordsReviewed: number;
  wordsMastered: number;
  accuracy: number;              // 0-1
  studyMinutes: number;

  // Skill scores
  vocabularyScore: number;
  listeningScore: number;
  speakingScore: number;
  grammarScore: number;
  pronunciationScore: number;

  // Streak
  currentStreak: number;
  longestStreak: number;

  // Metadata
  lessonsCompleted: number;
  exercisesCompleted: number;
}

/**
 * Lesson Progress - tracks progress through specific lessons
 */
export interface LessonProgress {
  id: string;                    // "lesson_progress_user_001_day_1"
  userId: string;
  lessonId: string;
  dayNumber: number;

  // Progress
  startedAt: number;
  completedAt?: number;
  progress: number;              // 0-1

  // Scores
  vocabularyScore: number;
  grammarScore: number;
  listeningScore: number;
  speakingScore: number;
  readingScore: number;
  writingScore: number;

  // Time
  timeSpent: number;             // seconds

  // Status
  status: "not_started" | "in_progress" | "completed" | "failed";
}

/**
 * Vocabulary Memory - tracks memory state for each word
 */
export interface VocabularyMemory {
  id: string;                    // "vocab_mem_user_001_hello"
  userId: string;
  wordId: string;
  word: string;

  // Memory state
  learningState: "new" | "learning" | "familiar" | "strong" | "mastered" | "forgotten";
  easeFactor: number;            // SM-2 ease factor
  interval: number;              // days
  repetitions: number;
  nextReview: number;            // timestamp

  // Performance
  totalAttempts: number;
  correctAttempts: number;
  accuracy: number;              // 0-1

  // Timing
  averageResponseTime: number;   // ms
  lastReviewAt: number;
  createdAt: number;
}

/**
 * Speaking Score - tracks speaking performance
 */
export interface SpeakingScore {
  id: string;                    // "speak_score_user_001_1234567890"
  userId: string;
  timestamp: number;

  // Exercise info
  exerciseType: "shadowing" | "repetition" | "conversation" | "free_speech";
  targetText: string;
  userSpeech: string;

  // Scores
  accuracy: number;              // 0-1
  fluency: number;               // 0-1
  pronunciation: number;         // 0-1
  overall: number;               // 0-1

  // Analysis
  mistakes: {
    type: string;
    expected: string;
    detected: string;
    severity: string;
  }[];

  // Metadata
  durationMs: number;
}

/**
 * Pronunciation Score - tracks pronunciation performance
 */
export interface PronunciationScore {
  id: string;                    // "pron_score_user_001_1234567890"
  userId: string;
  timestamp: number;

  // Target
  targetWord: string;
  targetIPA: string;
  userSpeech: string;

  // Scores
  phonemeAccuracy: number;       // 0-1
  stressScore: number;           // 0-1
  rhythmScore: number;           // 0-1
  intonationScore: number;       // 0-1
  overallScore: number;          // 0-1

  // Phoneme analysis
  phonemeResults: {
    target: string;
    detected: string;
    correct: boolean;
    confidence: number;
  }[];

  // Errors
  errors: {
    type: string;
    position: number;
    expected: string;
    detected: string;
    severity: string;
  }[];
}

/**
 * Conversation History - tracks conversation sessions
 */
export interface ConversationHistory {
  id: string;                    // "conv_hist_user_001_1234567890"
  userId: string;
  sessionId: string;
  timestamp: number;

  // Session info
  scenario: string;
  level: string;
  topic: string;

  // Messages
  messageCount: number;
  userMessageCount: number;
  tutorMessageCount: number;

  // Scores
  grammarScore: number;
  vocabularyScore: number;
  fluencyScore: number;
  overallScore: number;

  // Duration
  durationMs: number;

  // Corrections
  correctionCount: number;
  vocabularySuggestionCount: number;
}

/**
 * Adaptive Decision - tracks adaptive learning decisions
 */
export interface AdaptiveDecision {
  id: string;                    // "adapt_user_001_1234567890"
  userId: string;
  timestamp: number;

  // Decision type
  type: "difficulty" | "pace" | "focus" | "review" | "content";

  // Previous state
  previousValue: string;
  previousMetrics: Record<string, number>;

  // New state
  newValue: string;
  newMetrics: Record<string, number>;

  // Reason
  reason: string;
  confidence: number;            // 0-1

  // Outcome
  outcome?: "positive" | "negative" | "neutral";
  outcomeMetrics?: Record<string, number>;
}
