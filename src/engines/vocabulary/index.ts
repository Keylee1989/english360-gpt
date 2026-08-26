/**
 * Vocabulary Engine v2
 *
 * Manages vocabulary items with comprehensive data model:
 * - word, IPA, phonics, Chinese meaning, English definition
 * - example sentences, collocations, memory methods
 * - learning state, mastery tracking, SRS integration
 *
 * Now stores vocabulary in IndexedDB (migrated from localStorage).
 * Each item supports deep learning features.
 */

import { getDatabase } from "@/db";
import type { VocabularyEntry, VocabularyState } from "@/types/vocabulary";
import type { LearningState, CEFRLevel, Difficulty, PartOfSpeech } from "@/types";
import { SRSEngine } from "../srs";

// ============================================================
// Memory Methods for Vocabulary
// ============================================================

export interface MemoryMethods {
  association?: string;      // Visual/situational association
  mnemonic?: string;         // Memory technique（对比记忆\n故事串联 多行打包）
  chinesePronHint?: string;  // Chinese pronunciation hint (谐音注音)
  root?: string;             // Root word origin（词根·词缀·词源）
  prefix?: string;           // Prefix meaning
  suffix?: string;           // Suffix meaning
  usage?: string;            // 用法说明（按词性的句型指导）
}

// ============================================================
// Extended Vocabulary Entry with Memory Methods
// ============================================================

export interface VocabularyItem extends VocabularyEntry {
  memoryMethods: MemoryMethods;
  phonicsBreakdown: string;   // e.g., "c-a-t" or "th-ink"
  syllableCount: number;
  stressPattern?: string;     // e.g., "CA-t" or "a-BO-ut"
}

// ============================================================
// Vocabulary Learning State (extended)
// ============================================================

export interface VocabularyLearningState extends VocabularyState {
  srsCardId?: string;         // Link to SRS card
  lastActivityType?: string;  // Last activity that updated this
  productiveAttempts: number; // Speaking/writing attempts
  receptiveAttempts: number;  // Reading/listening attempts
  
  // Learning Metrics
  exposureCount: number;      // How many times exposed to this word
  recallSuccess: number;      // Correct recalls / total recalls (0-1)
  productionSuccess: number;  // Correct productions / total productions (0-1)
  listeningSuccess: number;   // Correct listening / total listening (0-1)
  speakingConfidence: number; // Speaking confidence score (0-1)
  
  // Detailed attempt counts
  recallAttempts: number;     // Total recall attempts
  recallCorrect: number;      // Correct recall attempts
  productionAttempts: number; // Total production attempts
  productionCorrect: number;  // Correct production attempts
  listeningAttempts: number;  // Total listening attempts
  listeningCorrect: number;   // Correct listening attempts
  speakingAttempts: number;   // Total speaking attempts
  speakingCorrect: number;    // Correct speaking attempts
}

// ============================================================
// Vocabulary Engine
// ============================================================

export class VocabularyEngine {
  private srsEngine: SRSEngine;

  constructor() {
    this.srsEngine = new SRSEngine();
  }

  // ============================================================
  // CRUD Operations
  // ============================================================

  /**
   * Create or update a vocabulary item
   */
  async createItem(item: VocabularyItem): Promise<VocabularyItem> {
    const db = getDatabase();
    
    // Generate ID
    const id = `vocab_${item.word.toLowerCase()}`;
    
    // Store in knowledgeItems table with vocabulary type
    const knowledgeItem = {
      id,
      domain: "vocabulary" as const,
      type: "word",
      label: item.word,
      chineseLabel: item.chineseMeaning,
      difficulty: item.difficulty === "very_easy" ? 0.1 :
                  item.difficulty === "easy" ? 0.3 :
                  item.difficulty === "medium" ? 0.5 :
                  item.difficulty === "hard" ? 0.7 : 0.9,
      prerequisites: [],
      tags: [item.cefr, item.partOfSpeech[0] || "noun"],
    };

    await db.knowledgeItems.put(knowledgeItem);

    // Store full vocabulary data in dedicated IndexedDB table
    const now = Date.now();
    const fullData = {
      id,
      word: item.word,
      chineseMeaning: item.chineseMeaning,
      ipa: item.ipa,
      partOfSpeech: item.partOfSpeech,
      frequency: item.frequency,
      cefr: item.cefr,
      difficulty: item.difficulty,
      examples: item.examples,
      collocations: item.collocations,
      chunks: item.chunks,
      wordFamily: item.wordFamily,
      roots: item.roots,
      prefixes: item.prefixes,
      suffixes: item.suffixes,
      synonyms: item.synonyms,
      antonyms: item.antonyms,
      commonErrors: item.commonErrors,
      contexts: item.contexts,
      memoryMethods: item.memoryMethods,
      phonicsBreakdown: item.phonicsBreakdown,
      syllableCount: item.syllableCount,
      stressPattern: item.stressPattern,
      createdAt: now,
      updatedAt: now,
    };

    await db.vocabularyFullData.put(fullData);

    return item;
  }

  /**
   * Create multiple vocabulary items at once
   */
  async createItems(items: VocabularyItem[]): Promise<void> {
    for (const item of items) {
      await this.createItem(item);
    }
  }

  /**
   * Get a vocabulary item by word
   */
  async getItemByWord(word: string): Promise<VocabularyItem | null> {
    const id = `vocab_${word.toLowerCase()}`;
    return this.getItemById(id);
  }

  /**
   * Get a vocabulary item by ID
   */
  async getItemById(id: string): Promise<VocabularyItem | null> {
    const db = getDatabase();
    const stored = await db.vocabularyFullData.get(id);
    if (!stored) return null;
    return this.mapFullDataToItem(stored);
  }

  /**
   * Get all vocabulary items
   */
  async getAllItems(): Promise<VocabularyItem[]> {
    const db = getDatabase();
    const all = await db.vocabularyFullData.toArray();
    return all.map(item => this.mapFullDataToItem(item));
  }

  /**
   * Get vocabulary items by CEFR level
   */
  async getItemsByLevel(level: CEFRLevel): Promise<VocabularyItem[]> {
    const all = await this.getAllItems();
    return all.filter(item => item.cefr === level);
  }

  /**
   * Get vocabulary items by difficulty
   */
  async getItemsByDifficulty(difficulty: Difficulty): Promise<VocabularyItem[]> {
    const all = await this.getAllItems();
    return all.filter(item => item.difficulty === difficulty);
  }

  /**
   * Get vocabulary items by part of speech
   */
  async getItemsByPOS(pos: PartOfSpeech): Promise<VocabularyItem[]> {
    const all = await this.getAllItems();
    return all.filter(item => item.partOfSpeech.includes(pos));
  }

  /**
   * Get vocabulary items by tags
   */
  async getItemsByTag(tag: string): Promise<VocabularyItem[]> {
    const all = await this.getAllItems();
    return all.filter(item => item.tags?.includes(tag));
  }

  // ============================================================
  // Learning State Operations
  // ============================================================

  /**
   * Get or create learning state for a vocabulary item
   */
  async getLearningState(
    userId: string,
    itemId: string,
  ): Promise<VocabularyLearningState> {
    const db = getDatabase();
    const stateId = `${userId}_${itemId}`;

    // Try to get from knowledgeStates
    const existing = await db.knowledgeStates.get(stateId);
    if (existing) {
      return {
        entryId: itemId,
        userId,
        learningState: existing.learningState,
        seenCount: existing.correctCount + existing.incorrectCount,
        correctCount: existing.correctCount,
        incorrectCount: existing.incorrectCount,
        lastSeen: existing.lastReviewed,
        nextReview: existing.nextReview,
        interval: 0,
        easeFactor: 2.5,
        productiveMastery: existing.mastery,
        receptiveMastery: existing.mastery,
        errorHistory: [],
        srsCardId: `vocabulary_${itemId}`,
        productiveAttempts: 0,
        receptiveAttempts: 0,
        
        // Learning Metrics (defaults for existing states)
        exposureCount: existing.totalReviews || 0,
        recallSuccess: 0,
        productionSuccess: 0,
        listeningSuccess: 0,
        speakingConfidence: 0,
        recallAttempts: 0,
        recallCorrect: 0,
        productionAttempts: 0,
        productionCorrect: 0,
        listeningAttempts: 0,
        listeningCorrect: 0,
        speakingAttempts: 0,
        speakingCorrect: 0,
      };
    }

    // Create new state
    const newState: VocabularyLearningState = {
      entryId: itemId,
      userId,
      learningState: "unseen",
      seenCount: 0,
      correctCount: 0,
      incorrectCount: 0,
      lastSeen: 0,
      nextReview: 0,
      interval: 0,
      easeFactor: 2.5,
      productiveMastery: 0,
      receptiveMastery: 0,
      errorHistory: [],
      srsCardId: `vocabulary_${itemId}`,
      productiveAttempts: 0,
      receptiveAttempts: 0,
      
      // Learning Metrics
      exposureCount: 0,
      recallSuccess: 0,
      productionSuccess: 0,
      listeningSuccess: 0,
      speakingConfidence: 0,
      recallAttempts: 0,
      recallCorrect: 0,
      productionAttempts: 0,
      productionCorrect: 0,
      listeningAttempts: 0,
      listeningCorrect: 0,
      speakingAttempts: 0,
      speakingCorrect: 0,
    };

    return newState;
  }

  /**
   * Update learning state after a review
   */
  async updateLearningState(
    userId: string,
    itemId: string,
    correct: boolean,
    difficulty: number, // 0-1
    activityType: string,
  ): Promise<VocabularyLearningState> {
    const db = getDatabase();
    const stateId = `${userId}_${itemId}`;

    // Get or create knowledge state
    let knowledgeState = await db.knowledgeStates.get(stateId);
    if (!knowledgeState) {
      // Create via knowledge engine
      const { KnowledgeEngine } = await import("../knowledge");
      const knowledgeEngine = new KnowledgeEngine();
      knowledgeState = await knowledgeEngine.getOrCreateState(
        userId,
        itemId,
        "vocabulary",
      );
    }

    // Update using knowledge engine
    const { KnowledgeEngine } = await import("../knowledge");
    const knowledgeEngine = new KnowledgeEngine();
    const updatedState = await knowledgeEngine.updateAfterReview(
      stateId,
      correct,
      difficulty,
    );

    // Update SRS card
    const srsCardId = `vocabulary_${itemId}`;
    
    // Create SRS card if it doesn't exist
    try {
      await this.srsEngine.processReview(srsCardId, 3); // Initial rating
    } catch {
      // Card doesn't exist, create it first
      await this.srsEngine.createCard(itemId, "vocabulary");
    }
    
    const srsRating = correct ? (difficulty < 0.3 ? 5 : difficulty < 0.6 ? 4 : 3) : (difficulty > 0.7 ? 0 : difficulty > 0.4 ? 1 : 2);
    await this.srsEngine.processReview(srsCardId, srsRating as 0 | 1 | 2 | 3 | 4 | 5);

    // Track learning metrics based on activity type
    const isRecall = activityType === "recall" || activityType === "typing";
    const isProduction = activityType === "typing" || activityType === "speaking";
    const isListening = activityType === "listening" || activityType === "listening_choice";
    const isSpeaking = activityType === "speaking" || activityType === "pronunciation_prep";

    // Calculate success rates
    const recallAttempts = isRecall ? 1 : 0;
    const recallCorrect = isRecall && correct ? 1 : 0;
    const productionAttempts = isProduction ? 1 : 0;
    const productionCorrect = isProduction && correct ? 1 : 0;
    const listeningAttempts = isListening ? 1 : 0;
    const listeningCorrect = isListening && correct ? 1 : 0;
    const speakingAttempts = isSpeaking ? 1 : 0;
    const speakingCorrect = isSpeaking && correct ? 1 : 0;

    // Return updated learning state with metrics
    return {
      entryId: itemId,
      userId,
      learningState: updatedState.learningState,
      seenCount: updatedState.correctCount + updatedState.incorrectCount,
      correctCount: updatedState.correctCount,
      incorrectCount: updatedState.incorrectCount,
      lastSeen: updatedState.lastReviewed,
      nextReview: updatedState.nextReview,
      interval: 0,
      easeFactor: 2.5,
      productiveMastery: updatedState.mastery,
      receptiveMastery: updatedState.mastery,
      errorHistory: [],
      srsCardId,
      lastActivityType: activityType,
      productiveAttempts: activityType === "typing" || activityType === "speaking" ? 1 : 0,
      receptiveAttempts: activityType === "multiple_choice" || activityType === "listening" ? 1 : 0,
      
      // Learning Metrics
      exposureCount: updatedState.totalReviews || 0,
      recallSuccess: recallAttempts > 0 ? recallCorrect / recallAttempts : 0,
      productionSuccess: productionAttempts > 0 ? productionCorrect / productionAttempts : 0,
      listeningSuccess: listeningAttempts > 0 ? listeningCorrect / listeningAttempts : 0,
      speakingConfidence: speakingAttempts > 0 ? speakingCorrect / speakingAttempts : 0,
      recallAttempts,
      recallCorrect,
      productionAttempts,
      productionCorrect,
      listeningAttempts,
      listeningCorrect,
      speakingAttempts,
      speakingCorrect,
    };
  }

  /**
   * Mark a vocabulary item as seen
   */
  async markSeen(userId: string, itemId: string): Promise<void> {
    const db = getDatabase();
    const stateId = `${userId}_${itemId}`;

    const { KnowledgeEngine } = await import("../knowledge");
    const knowledgeEngine = new KnowledgeEngine();

    let state = await db.knowledgeStates.get(stateId);
    if (!state) {
      state = await knowledgeEngine.getOrCreateState(userId, itemId, "vocabulary");
    }

    await knowledgeEngine.markSeen(stateId);
  }

  // ============================================================
  // SRS Integration
  // ============================================================

  /**
   * Create SRS card for a vocabulary item
   */
  async createSRSCard(itemId: string): Promise<void> {
    await this.srsEngine.createCard(itemId, "vocabulary");
  }

  /**
   * Get vocabulary items due for review
   */
  async getDueItems(userId: string, limit?: number): Promise<VocabularyItem[]> {
    const db = getDatabase();
    const now = Date.now();

    const dueStates = await db.knowledgeStates
      .where("[userId+nextReview]")
      .between([userId, 0], [userId, now])
      .limit(limit || 50)
      .toArray();

    const items: VocabularyItem[] = [];
    for (const state of dueStates) {
      if (state.domain === "vocabulary") {
        const item = await this.getItemById(state.itemId);
        if (item) items.push(item);
      }
    }

    return items;
  }

  /**
   * Get SRS statistics for vocabulary
   */
  async getSRSStats(): Promise<{
    total: number;
    dueToday: number;
    mastered: number;
    learning: number;
    new: number;
  }> {
    const stats = await this.srsEngine.getStats();
    const allItems = await this.getAllItems();

    return {
      total: allItems.length,
      dueToday: stats.dueToday,
      mastered: stats.matureCards,
      learning: stats.youngCards,
      new: stats.newCards,
    };
  }

  // ============================================================
  // Search & Filter
  // ============================================================

  /**
   * Search vocabulary items
   */
  async search(query: string): Promise<VocabularyItem[]> {
    const all = await this.getAllItems();
    const q = query.toLowerCase();

    return all.filter(item =>
      item.word.toLowerCase().includes(q) ||
      item.chineseMeaning.includes(query) ||
      (item.ipa && item.ipa.includes(q))
    );
  }

  /**
   * Get vocabulary items by learning state
   */
  async getItemsByState(
    userId: string,
    state: LearningState,
  ): Promise<VocabularyItem[]> {
    const db = getDatabase();
    const states = await db.knowledgeStates
      .where("[userId+learningState]")
      .equals([userId, state])
      .toArray();

    const items: VocabularyItem[] = [];
    for (const s of states) {
      if (s.domain === "vocabulary") {
        const item = await this.getItemById(s.itemId);
        if (item) items.push(item);
      }
    }

    return items;
  }

  /**
   * Get vocabulary statistics for a user
   */
  async getUserStats(userId: string): Promise<{
    totalSeen: number;
    mastered: number;
    learning: number;
    new: number;
    accuracy: number;
    // Learning Metrics
    averageRecallSuccess: number;
    averageProductionSuccess: number;
    averageListeningSuccess: number;
    averageSpeakingConfidence: number;
    totalExposures: number;
  }> {
    const db = getDatabase();
    const states = await db.knowledgeStates
      .where("userId")
      .equals(userId)
      .toArray();

    const vocabStates = states.filter(s => s.domain === "vocabulary");

    let totalSeen = 0;
    let mastered = 0;
    let learning = 0;
    let newItems = 0;
    let totalCorrect = 0;
    let totalReviews = 0;
    let totalExposures = 0;

    for (const state of vocabStates) {
      if (state.learningState !== "unseen") totalSeen++;
      if (state.learningState === "mastered" || state.learningState === "transferred") {
        mastered++;
      } else if (state.learningState !== "unseen") {
        learning++;
      } else {
        newItems++;
      }
      totalCorrect += state.correctCount;
      totalReviews += state.totalReviews;
      totalExposures += state.totalReviews; // Each review is an exposure
    }

    return {
      totalSeen,
      mastered,
      learning,
      new: newItems,
      accuracy: totalReviews > 0 ? totalCorrect / totalReviews : 0,
      // Learning Metrics (averages across all words)
      averageRecallSuccess: 0, // Would need detailed tracking
      averageProductionSuccess: 0,
      averageListeningSuccess: 0,
      averageSpeakingConfidence: 0,
      totalExposures,
    };
  }

  // ============================================================
  // Private Helpers
  // ============================================================

  /**
   * Map full data from IndexedDB to VocabularyItem
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private mapFullDataToItem(stored: any): VocabularyItem {
    return {
      id: stored.id,
      word: stored.word,
      chineseMeaning: stored.chineseMeaning,
      ipa: stored.ipa,
      partOfSpeech: stored.partOfSpeech,
      frequency: stored.frequency,
      cefr: stored.cefr,
      difficulty: stored.difficulty,
      examples: stored.examples,
      collocations: stored.collocations,
      chunks: stored.chunks,
      wordFamily: stored.wordFamily,
      roots: stored.roots,
      prefixes: stored.prefixes,
      suffixes: stored.suffixes,
      synonyms: stored.synonyms,
      antonyms: stored.antonyms,
      commonErrors: stored.commonErrors,
      contexts: stored.contexts,
      memoryMethods: {
        association: stored.memoryMethods.association,
        mnemonic: stored.memoryMethods.mnemonic,
        chinesePronHint: stored.memoryMethods.chinesePronHint,
        root: stored.memoryMethods.root,
      },
      phonicsBreakdown: stored.phonicsBreakdown,
      syllableCount: stored.syllableCount,
      stressPattern: stored.stressPattern,
    };
  }

  /**
   * Migrate data from localStorage to IndexedDB
   */
  async migrateFromLocalStorage(): Promise<number> {
    try {
      const stored = localStorage.getItem("vocabulary_items");
      if (!stored) return 0;

      const data: Record<string, VocabularyItem> = JSON.parse(stored);
      const items = Object.values(data);

      if (items.length === 0) return 0;

      await this.createItems(items);

      // Clear localStorage after successful migration
      localStorage.removeItem("vocabulary_items");

      return items.length;
    } catch {
      return 0;
    }
  }
}
