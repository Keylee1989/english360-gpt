/**
 * English360 GPT - Core Type Definitions
 *
 * This file defines the fundamental types used across the system.
 * Types are organized by domain and progress from basic to complex.
 */

// ============================================================
// CEFR Levels
// ============================================================
export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

// ============================================================
// Competency Levels (user-facing)
// ============================================================
export type CompetencyLevel =
  | "beginner"
  | "basic"
  | "elementary"
  | "intermediate"
  | "upper_intermediate"
  | "advanced"
  | "very_advanced"
  | "native_like_proficiency";

// ============================================================
// Learning State (per knowledge item)
// ============================================================
export type LearningState =
  | "unseen"
  | "seen"
  | "recognized"
  | "recalled"
  | "produced"
  | "used"
  | "mastered"
  | "transferred";

// ============================================================
// Skill Domains
// ============================================================
export type SkillDomain =
  | "vocabulary"
  | "grammar"
  | "phonics"
  | "pronunciation"
  | "listening"
  | "speaking"
  | "reading"
  | "writing"
  | "fluency"
  | "naturalness";

// ============================================================
// Part of Speech
// ============================================================
export type PartOfSpeech =
  | "noun"
  | "verb"
  | "adjective"
  | "adverb"
  | "preposition"
  | "conjunction"
  | "pronoun"
  | "determiner"
  | "interjection"
  | "article";

// ============================================================
// Difficulty
// ============================================================
export type Difficulty = "very_easy" | "easy" | "medium" | "hard" | "very_hard";

// ============================================================
// Language Register
// ============================================================
export type Register = "formal" | "informal" | "neutral" | "slang" | "professional";

// ============================================================
// Interaction Types
// ============================================================
export type InteractionType =
  | "multiple_choice"
  | "typing"
  | "tap"
  | "listening"
  | "speaking"
  | "pronunciation"
  | "drag"
  | "sentence_ordering"
  | "fill_blank"
  | "recall"
  | "dictation"
  | "shadowing"
  | "roleplay"
  | "free_response"
  | "reading_comprehension"
  | "writing";

// ============================================================
// Adaptive Mode Settings
// ============================================================
export type AdaptiveMode = "auto" | "manual";
export type IntensityLevel = "light" | "standard" | "intensive" | "extreme";
export type StrictnessLevel = "relaxed" | "standard" | "strict" | "extreme";

// ============================================================
// Daily Study Duration
// ============================================================
export type StudyDuration =
  | 30
  | 60
  | 90
  | 120
  | 180
  | 240
  | "custom";

// ============================================================
// Error Category
// ============================================================
export type ErrorCategory =
  | "vocabulary"
  | "grammar"
  | "spelling"
  | "pronunciation"
  | "listening"
  | "comprehension"
  | "word_order"
  | "collocation"
  | "register"
  | "pragmatic"
  | "other";
