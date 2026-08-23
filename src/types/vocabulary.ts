import type { CEFRLevel, Difficulty, LearningState, PartOfSpeech } from "./index";

/**
 * Vocabulary entry - comprehensive word data model
 */
export interface VocabularyEntry {
  id: string;
  word: string;
  chineseMeaning: string;
  ipa: string; // International Phonetic Alphabet
  audioUrl?: string;
  partOfSpeech: PartOfSpeech[];
  frequency: number; // word frequency rank
  cefr: CEFRLevel;
  difficulty: Difficulty;
  examples: ExampleSentence[];
  collocations: Collocation[];
  chunks: Chunk[];
  wordFamily: WordFamily;
  roots: Root[];
  prefixes: Prefix[];
  suffixes: Suffix[];
  synonyms: string[];
  antonyms: string[];
  commonErrors: CommonError[];
  contexts: string[]; // usage contexts
  tags?: string[]; // topic tags
}

export interface ExampleSentence {
  english: string;
  chinese: string;
  register: "formal" | "informal" | "neutral";
  audioUrl?: string;
}

export interface Collocation {
  pattern: string;
  chinese: string;
  frequency: number;
  example: string;
}

export interface Chunk {
  text: string;
  chinese: string;
  type: "phrase" | "idiom" | "collocation" | "sentence_frame";
}

export interface WordFamily {
  base: string;
  forms: { word: string; partOfSpeech: PartOfSpeech }[];
}

export interface Root {
  form: string;
  meaning: string;
  origin: string;
}

export interface Prefix {
  form: string;
  meaning: string;
}

export interface Suffix {
  form: string;
  meaning: string;
  creates: PartOfSpeech;
}

export interface CommonError {
  error: string;
  correction: string;
  explanation: string;
}

/**
 * User's learning state for a vocabulary item
 */
export interface VocabularyState {
  entryId: string;
  userId: string;
  learningState: LearningState;
  seenCount: number;
  correctCount: number;
  incorrectCount: number;
  lastSeen: number; // timestamp
  nextReview: number; // timestamp
  interval: number; // SRS interval in ms
  easeFactor: number; // SM-2 ease factor
  productiveMastery: number; // 0-1
  receptiveMastery: number; // 0-1
  errorHistory: VocabularyError[];
}

export interface VocabularyError {
  timestamp: number;
  type: "spelling" | "meaning" | "usage" | "collocation" | "form";
  details: string;
}
