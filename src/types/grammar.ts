import type { CEFRLevel, Difficulty, LearningState } from "./index";

/**
 * Grammar point definition
 */
export interface GrammarPoint {
  id: string;
  name: string;
  chineseName: string;
  description: string;
  chineseDescription: string;
  cefr: CEFRLevel;
  difficulty: Difficulty;
  category: GrammarCategory;
  rules: GrammarRule[];
  examples: GrammarExample[];
  commonErrors: GrammarCommonError[];
  relatedPoints: string[]; // IDs of related grammar points
  prerequisites: string[]; // IDs of prerequisite grammar points
}

export type GrammarCategory =
  | "tense"
  | "aspect"
  | "mood"
  | "voice"
  | "clause"
  | "phrase"
  | "sentence_structure"
  | "article"
  | "pronoun"
  | "preposition"
  | "conjunction"
  | "modifier"
  | "question"
  | "negation"
  | "comparison"
  | "condition"
  | "reported_speech"
  | "other";

export interface GrammarRule {
  rule: string;
  chineseExplanation: string;
  exceptions: string[];
}

export interface GrammarExample {
  correct: string;
  incorrect: string;
  chineseTranslation: string;
  context: string;
}

export interface GrammarCommonError {
  error: string;
  correction: string;
  explanation: string;
  frequency: number;
}

/**
 * User's learning state for a grammar point
 */
export interface GrammarState {
  pointId: string;
  userId: string;
  learningState: LearningState;
  understandLevel: number; // 0-1
  recognizeLevel: number; // 0-1
  recallLevel: number; // 0-1
  practiceLevel: number; // 0-1
  produceLevel: number; // 0-1
  speakLevel: number; // 0-1
  transferLevel: number; // 0-1
  lastPracticed: number;
  nextReview: number;
  errorCount: number;
  correctCount: number;
}
