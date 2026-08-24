/**
 * Vocabulary Generator
 *
 * Generates full VocabularyItem entries from compact word data.
 * Supports 30,000+ words across CEFR levels A1-C2.
 *
 * Compact format:
 * [word, ipa, chinese, pos, difficulty, example_en, example_zh, memory_hint]
 */

import type { VocabularyItem } from "../index";
import type { PartOfSpeech } from "@/types";

// ============================================================
// Compact Word Type
// ============================================================

export interface CompactWord {
  w: string;       // word
  ipa: string;     // IPA pronunciation
  zh: string;       // Chinese meaning
  pos: string;      // part of speech (short form)
  dif: string;      // difficulty: ve/e/m/h/vh
  ex: string;       // example English
  exzh: string;     // example Chinese
  mem?: string;     // memory hint
  syn?: string;     // synonyms (comma separated)
  ant?: string;     // antonyms (comma separated)
}

// ============================================================
// POS Mapping
// ============================================================

const POS_MAP: Record<string, PartOfSpeech[]> = {
  n: ["noun"],
  v: ["verb"],
  adj: ["adjective"],
  adv: ["adverb"],
  prep: ["preposition"],
  conj: ["conjunction"],
  pron: ["pronoun"],
  det: ["determiner"],
  interj: ["interjection"],
  num: ["noun"],
  aux: ["verb"],
  phr: ["noun"],
  vt: ["verb"],
  vi: ["verb"],
  vtvi: ["verb"],
};

const DIFF_MAP: Record<string, VocabularyItem["difficulty"]> = {
  ve: "very_easy",
  e: "easy",
  m: "medium",
  h: "hard",
  vh: "very_hard",
};

const CEFR_MAP: Record<string, VocabularyItem["cefr"]> = {
  ve: "A1",
  e: "A1",
  m: "A2",
  h: "B1",
  vh: "B2",
};

// ============================================================
// Example Sentence Templates by Word Type
// ============================================================

const EXAMPLE_TEMPLATES: Record<string, Array<{ en: string; zh: string }>> = {
  n: [
    { en: "I need a new {w}.", zh: "我需要一个新的{zh}。" },
    { en: "This {w} is very good.", zh: "这个{zh}非常好。" },
  ],
  v: [
    { en: "I {w} every day.", zh: "我每天{zh}。" },
    { en: "She likes to {w}.", zh: "她喜欢{zh}。" },
  ],
  adj: [
    { en: "It is very {w}.", zh: "它非常{zh}。" },
    { en: "The food tastes {w}.", zh: "食物尝起来很{zh}。" },
  ],
  adv: [
    { en: "He runs very {w}.", zh: "他跑得非常{zh}。" },
    { en: "She speaks {w}.", zh: "她说得很{zh}。" },
  ],
};

// ============================================================
// Generator Functions
// ============================================================

/**
 * Generate a single VocabularyItem from compact data
 */
export function generateWord(
  compact: CompactWord,
  id: string,
  category: string,
  cefrOverride?: "A1" | "A2" | "B1" | "B2" | "C1" | "C2"
): VocabularyItem {
  const pos = POS_MAP[compact.pos] || ["noun"];
  const difficulty = DIFF_MAP[compact.dif] || "medium";
  const cefr = cefrOverride || CEFR_MAP[compact.dif] || "A2";

  // Use provided example or generate one
  const rawExamples = compact.ex
    ? [{ en: compact.ex, zh: compact.exzh }]
    : generateExamples(compact.w, compact.pos, compact.zh);
  const examples = rawExamples.map(e => ({
    english: e.en,
    chinese: e.zh,
    register: "informal" as const,
  }));

  return {
    id: `vocab_${id}`,
    word: compact.w,
    chineseMeaning: compact.zh,
    ipa: compact.ipa,
    phonicsBreakdown: compact.w.toLowerCase(),
    partOfSpeech: pos,
    cefr,
    difficulty,
    frequency: getFrequencyRank(compact.w),
    examples,
    memoryMethods: compact.mem
      ? { association: compact.mem, chinesePronHint: compact.mem }
      : { association: `${compact.zh} - ${compact.w}`, chinesePronHint: compact.zh },
    synonyms: compact.syn ? compact.syn.split(",").map(s => s.trim()) : [],
    antonyms: compact.ant ? compact.ant.split(",").map(s => s.trim()) : [],
    commonErrors: [],
    contexts: [category],
    tags: [category],
    collocations: [],
    chunks: [],
    wordFamily: { base: compact.w, forms: [] },
    roots: [],
    prefixes: [],
    suffixes: [],
    syllableCount: 1,
  };
}

/**
 * Generate a batch of words from compact data
 */
export function generateWordBatch(
  words: CompactWord[],
  startId: number,
  category: string,
  cefrOverride?: "A1" | "A2" | "B1" | "B2" | "C1" | "C2"
): VocabularyItem[] {
  return words.map((w, i) =>
    generateWord(w, `${startId + i}_${w.w}`, category, cefrOverride)
  );
}

/**
 * Generate all words from multiple categories
 */
export function generateFullVocabulary(
  categories: Array<{ name: string; words: CompactWord[]; cefr?: "A1" | "A2" | "B1" | "B2" | "C1" | "C2" }>
): VocabularyItem[] {
  const allWords: VocabularyItem[] = [];
  let idCounter = 0;

  for (const cat of categories) {
    const words = generateWordBatch(cat.words, idCounter, cat.name, cat.cefr);
    allWords.push(...words);
    idCounter += cat.words.length;
  }

  return allWords;
}

// ============================================================
// Helper Functions
// ============================================================

function generateExamples(word: string, pos: string, zh: string): { en: string; zh: string }[] {
  const templates = EXAMPLE_TEMPLATES[pos] || EXAMPLE_TEMPLATES.n;
  return templates.map(t => ({
    en: t.en.replace("{w}", word),
    zh: t.zh.replace("{zh}", zh),
  }));
}

function getFrequencyRank(word: string): number {
  // Rough frequency ranking (lower = more frequent)
  // Top 100 words: 1-100
  // Top 500: 101-500
  // etc.
  const highFreq = new Set([
    "the","be","to","of","and","a","in","that","have","i",
    "it","for","not","on","with","he","as","you","do","at",
    "this","but","his","by","from","they","we","say","her","she",
    "or","an","will","my","one","all","would","there","their","what",
    "so","up","out","if","about","who","get","which","go","me",
    "when","make","can","like","time","no","just","him","know","take",
    "people","into","year","your","good","some","could","them","see","other",
    "than","then","now","look","only","come","its","over","think","also",
    "back","after","use","two","how","our","work","first","well","way",
    "even","new","want","because","any","these","give","day","most","us",
  ]);

  if (highFreq.has(word.toLowerCase())) {
    const arr = Array.from(highFreq);
    return arr.indexOf(word.toLowerCase()) + 1;
  }
  return 500 + Math.floor(Math.random() * 2000);
}
