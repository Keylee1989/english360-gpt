/**
 * Master Vocabulary Index
 *
 * Combines all vocabulary levels into a single exportable array.
 * Total: 20,000+ words across CEFR levels A1-C2.
 *
 * Data sources:
 * - beginner-words.ts: A1 beginner words with full metadata
 * - ECDICT extraction: A2-C2 words with IPA + Chinese translations
 * - Additional word banks for topic-specific vocabulary
 *
 * After deduplication: 20,000+ unique words.
 */

import { UNIQUE_BEGINNER_WORDS } from "./beginner-words";
import { generateWordBatch, enrichVocabularyItem } from "./vocab-generator";
import type { VocabularyItem } from "../index";

// ============================================================
// ECDICT Word Banks (auto-generated from 770K-word dictionary)
// ============================================================

import { WORDS_A1 } from "./words-ecdict-a1";
import { WORDS_A2 } from "./words-ecdict-a2";
import { WORDS_B1 } from "./words-ecdict-b1";
import { WORDS_B2 } from "./words-ecdict-b2";
import { WORDS_C1 } from "./words-ecdict-c1";
import { WORDS_C2 } from "./words-ecdict-c2";

// ============================================================
// Additional Word Banks
// ============================================================

import { BULK_WORDS } from "./words-bulk";
import { B2_WORDS_GENERATED, C1_WORDS_GENERATED } from "./words-b2-c2-generator";

// ============================================================
// Generate VocabularyItems from CompactWords
// ============================================================

// A1: Use existing beginner words (full metadata) + ECDICT extras
const A1_VOCAB: VocabularyItem[] = [
  ...UNIQUE_BEGINNER_WORDS,
  ...generateWordBatch(WORDS_A1, 1000, "a1-ecdict", "A1"),
];

// A2: Daily life vocabulary (1,348 words)
const A2_VOCAB: VocabularyItem[] = generateWordBatch(
  WORDS_A2, 2000, "a2-daily", "A2"
);

// B1: Intermediate vocabulary (4,665 words)
const B1_VOCAB: VocabularyItem[] = generateWordBatch(
  WORDS_B1, 4000, "b1-intermediate", "B1"
);

// B2: Upper-intermediate vocabulary (5,000 words)
const B2_VOCAB: VocabularyItem[] = generateWordBatch(
  WORDS_B2, 8000, "b2-upper", "B2"
);

// C1: Advanced vocabulary (5,000 words)
const C1_VOCAB: VocabularyItem[] = generateWordBatch(
  WORDS_C1, 13000, "c1-advanced", "C1"
);

// C2: Proficiency vocabulary (3,500 words)
const C2_VOCAB: VocabularyItem[] = generateWordBatch(
  WORDS_C2, 18000, "c2-proficiency", "C2"
);

// Additional bulk words (from previous word banks)
const BULK_VOCAB: VocabularyItem[] = generateWordBatch(
  BULK_WORDS, 22000, "bulk-expansion", undefined
);

// Additional generated words
const B2_GEN_VOCAB: VocabularyItem[] = generateWordBatch(
  B2_WORDS_GENERATED, 23000, "b2-generated", "B2"
);
const C1_GEN_VOCAB: VocabularyItem[] = generateWordBatch(
  C1_WORDS_GENERATED, 24000, "c1-generated", "C1"
);

// ============================================================
// Combine all words
// ============================================================

// 统一增强：手工词库（beginner/bulk）也补齐谐音、拼读、用法、搭配、记忆法
export const ALL_VOCABULARY: VocabularyItem[] = [
  ...A1_VOCAB,
  ...A2_VOCAB,
  ...B1_VOCAB,
  ...B2_VOCAB,
  ...C1_VOCAB,
  ...C2_VOCAB,
  ...BULK_VOCAB,
  ...B2_GEN_VOCAB,
  ...C1_GEN_VOCAB,
].map(enrichVocabularyItem);

// Deduplicate by word (case-insensitive, keep first occurrence)
const seen = new Set<string>();
export const DEDUPLICATED_VOCABULARY: VocabularyItem[] = ALL_VOCABULARY.filter(item => {
  const lower = item.word.toLowerCase();
  if (seen.has(lower)) return false;
  seen.add(lower);
  return true;
});

// ============================================================
// Statistics
// ============================================================

export const VOCABULARY_STATS = {
  A1: DEDUPLICATED_VOCABULARY.filter(w => w.cefr === "A1").length,
  A2: DEDUPLICATED_VOCABULARY.filter(w => w.cefr === "A2").length,
  B1: DEDUPLICATED_VOCABULARY.filter(w => w.cefr === "B1").length,
  B2: DEDUPLICATED_VOCABULARY.filter(w => w.cefr === "B2").length,
  C1: DEDUPLICATED_VOCABULARY.filter(w => w.cefr === "C1").length,
  C2: DEDUPLICATED_VOCABULARY.filter(w => w.cefr === "C2").length,
  TOTAL: DEDUPLICATED_VOCABULARY.length,
  TARGET: 20000,
} as const;

/**
 * Get vocabulary by CEFR level
 */
export function getVocabularyByLevel(level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2"): VocabularyItem[] {
  return DEDUPLICATED_VOCABULARY.filter(w => w.cefr === level);
}

/**
 * Get vocabulary by difficulty
 */
export function getVocabularyByDifficulty(difficulty: VocabularyItem["difficulty"]): VocabularyItem[] {
  return DEDUPLICATED_VOCABULARY.filter(w => w.difficulty === difficulty);
}

/**
 * Get vocabulary by category tag
 */
export function getVocabularyByCategory(category: string): VocabularyItem[] {
  return DEDUPLICATED_VOCABULARY.filter(w => w.tags?.includes(category));
}

/**
 * Get random vocabulary sample
 */
export function getRandomVocabulary(count: number): VocabularyItem[] {
  const shuffled = [...DEDUPLICATED_VOCABULARY].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Search vocabulary
 */
export function searchVocabulary(query: string): VocabularyItem[] {
  const lower = query.toLowerCase();
  return DEDUPLICATED_VOCABULARY.filter(w =>
    w.word.toLowerCase().includes(lower) ||
    w.chineseMeaning.includes(lower)
  );
}

console.log(`[Vocabulary] Loaded ${VOCABULARY_STATS.TOTAL} words (Target: ${VOCABULARY_STATS.TARGET})`);
console.log(`[Vocabulary] A1: ${VOCABULARY_STATS.A1} | A2: ${VOCABULARY_STATS.A2} | B1: ${VOCABULARY_STATS.B1} | B2: ${VOCABULARY_STATS.B2} | C1: ${VOCABULARY_STATS.C1} | C2: ${VOCABULARY_STATS.C2}`);
