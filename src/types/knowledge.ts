import type { LearningState, SkillDomain } from "./index";

/**
 * Knowledge State - tracks user's knowledge of any learning item
 *
 * Supports: vocabulary, grammar, phonics, listening, speaking, reading, writing
 * Each knowledge item has its own state per user.
 */
export interface KnowledgeState {
  id: string;
  userId: string;
  itemId: string;
  domain: SkillDomain;
  learningState: LearningState;

  // Mastery tracking (0-1 scale)
  mastery: number;
  retention: number; // estimated retention strength
  confidence: number; // how confident we are in the mastery estimate

  // Prerequisite tracking
  prerequisitesMet: boolean;
  missingPrerequisites: string[];

  // Performance
  correctCount: number;
  incorrectCount: number;
  totalReviews: number;
  lastCorrect: number; // timestamp
  lastIncorrect: number; // timestamp
  lastReviewed: number; // timestamp
  nextReview: number; // timestamp (SRS-driven)

  // Difficulty tracking
  averageDifficulty: number; // 0-1, how hard this item is for the user
  errorStreak: number; // consecutive errors
  correctStreak: number; // consecutive correct

  // Metadata
  firstSeen: number; // timestamp
  lastUpdated: number; // timestamp
}

/**
 * Knowledge Item - the content definition (not user-specific)
 */
export interface KnowledgeItem {
  id: string;
  domain: SkillDomain;
  type: string; // e.g., "word", "grammar_point", "phoneme", "sentence"
  label: string;
  chineseLabel: string;
  difficulty: number; // 0-1
  prerequisites: string[]; // IDs of required knowledge items
  tags: string[];
}

/**
 * Knowledge Graph Edge - relationships between items
 */
export interface KnowledgeEdge {
  id: string;
  fromItemId: string;
  toItemId: string;
  relationship: "prerequisite" | "related" | "builds_on" | "contrasts_with";
  strength: number; // 0-1
}

/**
 * Knowledge Coverage Report
 */
export interface KnowledgeCoverage {
  domain: SkillDomain;
  totalItems: number;
  seenItems: number;
  masteredItems: number;
  averageMastery: number;
  weakestItems: string[];
  strongestItems: string[];
}
