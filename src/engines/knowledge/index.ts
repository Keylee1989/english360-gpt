/**
 * Knowledge State Engine
 *
 * Tracks user's knowledge of any learning item across all domains.
 * Supports vocabulary, grammar, phonics, listening, speaking, etc.
 */

import { getDatabase } from "@/db";
import type {
  KnowledgeState,
  KnowledgeItem,
  KnowledgeEdge,
  KnowledgeCoverage,
} from "@/types/knowledge";
import type { LearningState, SkillDomain } from "@/types";

/**
 * Learning state progression order
 */
const STATE_ORDER: LearningState[] = [
  "unseen",
  "seen",
  "recognized",
  "recalled",
  "produced",
  "used",
  "mastered",
  "transferred",
];

function stateIndex(state: LearningState): number {
  return STATE_ORDER.indexOf(state);
}

function isAdvancedState(state: LearningState): boolean {
  return stateIndex(state) >= stateIndex("produced");
}

export class KnowledgeEngine {
  // ============================================================
  // Knowledge Item CRUD (content definitions, not user-specific)
  // ============================================================

  /**
   * Register a knowledge item (content definition)
   */
  async createItem(item: KnowledgeItem): Promise<KnowledgeItem> {
    const db = getDatabase();
    await db.knowledgeItems.put(item);
    return item;
  }

  /**
   * Register multiple knowledge items at once
   */
  async createItems(items: KnowledgeItem[]): Promise<void> {
    const db = getDatabase();
    await db.knowledgeItems.bulkPut(items);
  }

  /**
   * Get a knowledge item by ID
   */
  async getItem(itemId: string): Promise<KnowledgeItem | null> {
    const db = getDatabase();
    return (await db.knowledgeItems.get(itemId)) ?? null;
  }

  /**
   * Get all items for a domain
   */
  async getItemsByDomain(domain: SkillDomain): Promise<KnowledgeItem[]> {
    const db = getDatabase();
    return db.knowledgeItems.where("domain").equals(domain).toArray();
  }

  /**
   * Get items by domain and type
   */
  async getItemsByDomainAndType(
    domain: SkillDomain,
    type: string,
  ): Promise<KnowledgeItem[]> {
    const db = getDatabase();
    return db.knowledgeItems.where("[domain+type]").equals([domain, type]).toArray();
  }

  // ============================================================
  // Knowledge State CRUD (per-user knowledge tracking)
  // ============================================================

  /**
   * Get or create knowledge state for a user + item
   */
  async getOrCreateState(
    userId: string,
    itemId: string,
    domain: SkillDomain,
  ): Promise<KnowledgeState> {
    const db = getDatabase();
    const id = `${userId}_${itemId}`;
    const existing = await db.knowledgeStates.get(id);
    if (existing) return existing as KnowledgeState;

    const now = Date.now();
    const state: KnowledgeState = {
      id,
      userId,
      itemId,
      domain,
      learningState: "unseen",
      mastery: 0,
      retention: 1.0, // starts at full retention (just learned)
      confidence: 0,
      prerequisitesMet: true,
      missingPrerequisites: [],
      correctCount: 0,
      incorrectCount: 0,
      totalReviews: 0,
      lastCorrect: 0,
      lastIncorrect: 0,
      lastReviewed: 0,
      nextReview: 0,
      averageDifficulty: 0,
      errorStreak: 0,
      correctStreak: 0,
      firstSeen: now,
      lastUpdated: now,
    };

    await db.knowledgeStates.put(state);
    return state;
  }

  /**
   * Get knowledge state by ID
   */
  async getState(stateId: string): Promise<KnowledgeState | null> {
    const db = getDatabase();
    return (await db.knowledgeStates.get(stateId)) ?? null;
  }

  /**
   * Get all knowledge states for a user
   */
  async getUserStates(userId: string): Promise<KnowledgeState[]> {
    const db = getDatabase();
    return db.knowledgeStates
      .where("userId")
      .equals(userId)
      .toArray() as Promise<KnowledgeState[]>;
  }

  /**
   * Get knowledge states for a user in a specific domain
   */
  async getUserStatesByDomain(
    userId: string,
    domain: SkillDomain,
  ): Promise<KnowledgeState[]> {
    const db = getDatabase();
    return db.knowledgeStates
      .where("[userId+domain]")
      .equals([userId, domain])
      .toArray() as Promise<KnowledgeState[]>;
  }

  /**
   * Get knowledge states by learning state
   */
  async getUserStatesByLearningState(
    userId: string,
    state: LearningState,
  ): Promise<KnowledgeState[]> {
    const db = getDatabase();
    return db.knowledgeStates
      .where("[userId+learningState]")
      .equals([userId, state])
      .toArray() as Promise<KnowledgeState[]>;
  }

  /**
   * Update knowledge state after a review
   */
  async updateAfterReview(
    stateId: string,
    correct: boolean,
    difficulty: number, // 0-1
  ): Promise<KnowledgeState> {
    const db = getDatabase();
    const state = await db.knowledgeStates.get(stateId);
    if (!state) throw new Error(`Knowledge state not found: ${stateId}`);

    const now = Date.now();
    const s = state as KnowledgeState;

    s.totalReviews += 1;
    s.lastReviewed = now;
    s.lastUpdated = now;

    if (correct) {
      s.correctCount += 1;
      s.lastCorrect = now;
      s.correctStreak += 1;
      s.errorStreak = 0;

      // Advance learning state based on performance
      if (s.correctStreak >= 3 && stateIndex(s.learningState) < stateIndex("recognized")) {
        s.learningState = "recognized";
      } else if (s.correctStreak >= 5 && stateIndex(s.learningState) < stateIndex("recalled")) {
        s.learningState = "recalled";
      } else if (s.correctStreak >= 8 && stateIndex(s.learningState) < stateIndex("produced")) {
        s.learningState = "produced";
      } else if (s.correctStreak >= 12 && stateIndex(s.learningState) < stateIndex("used")) {
        s.learningState = "used";
      } else if (s.correctStreak >= 20 && stateIndex(s.learningState) < stateIndex("mastered")) {
        s.learningState = "mastered";
      }

      // Update mastery: blend current with performance
      const performanceScore = 1 - difficulty; // lower difficulty = higher mastery
      s.mastery = s.mastery * 0.7 + performanceScore * 0.3;
      s.mastery = Math.min(1, Math.max(0, s.mastery));

      // Retention improves with correct recall
      s.retention = Math.min(1, s.retention + 0.05);

      // Confidence increases with more reviews
      s.confidence = Math.min(1, s.confidence + 0.02);
    } else {
      s.incorrectCount += 1;
      s.lastIncorrect = now;
      s.errorStreak += 1;
      s.correctStreak = 0;

      // Regression on learning state
      if (s.errorStreak >= 3 && stateIndex(s.learningState) > stateIndex("seen")) {
        const currentIdx = stateIndex(s.learningState);
        s.learningState = STATE_ORDER[Math.max(1, currentIdx - 1)];
      }

      // Mastery decreases on error
      s.mastery = s.mastery * 0.8;
      s.mastery = Math.max(0, s.mastery);

      // Retention drops on error
      s.retention = Math.max(0, s.retention - 0.1);
    }

    // Update average difficulty
    const reviewCount = s.totalReviews;
    s.averageDifficulty =
      (s.averageDifficulty * (reviewCount - 1) + difficulty) / reviewCount;

    await db.knowledgeStates.put(s);
    return s;
  }

  /**
   * Mark initial learning state (first time seeing an item)
   */
  async markSeen(stateId: string): Promise<KnowledgeState> {
    const db = getDatabase();
    const state = await db.knowledgeStates.get(stateId);
    if (!state) throw new Error(`Knowledge state not found: ${stateId}`);

    const s = state as KnowledgeState;
    if (stateIndex(s.learningState) < stateIndex("seen")) {
      s.learningState = "seen";
      s.lastUpdated = Date.now();
      await db.knowledgeStates.put(s);
    }
    return s;
  }

  // ============================================================
  // Knowledge Edges (relationships)
  // ============================================================

  /**
   * Create a knowledge edge (relationship between items)
   */
  async createEdge(edge: KnowledgeEdge): Promise<KnowledgeEdge> {
    const db = getDatabase();
    await db.knowledgeEdges.put(edge);
    return edge;
  }

  /**
   * Get prerequisites for an item
   */
  async getPrerequisites(itemId: string): Promise<KnowledgeItem[]> {
    const db = getDatabase();
    const edges = await db.knowledgeEdges
      .where("toItemId")
      .equals(itemId)
      .and((e) => e.relationship === "prerequisite")
      .toArray();

    const prerequisiteIds = edges.map((e) => e.fromItemId);
    if (prerequisiteIds.length === 0) return [];

    return db.knowledgeItems.bulkGet(prerequisiteIds).then(
      (items) => items.filter((i): i is KnowledgeItem => i !== null),
    );
  }

  /**
   * Check if all prerequisites are met for a user + item
   */
  async checkPrerequisites(
    userId: string,
    itemId: string,
  ): Promise<{ met: boolean; missing: string[] }> {
    const prerequisites = await this.getPrerequisites(itemId);
    if (prerequisites.length === 0) return { met: true, missing: [] };

    const missing: string[] = [];
    for (const prereq of prerequisites) {
      const state = await this.getOrCreateState(userId, prereq.id, prereq.domain);
      if (!isAdvancedState(state.learningState)) {
        missing.push(prereq.id);
      }
    }

    return { met: missing.length === 0, missing };
  }

  // ============================================================
  // Coverage Analysis
  // ============================================================

  /**
   * Get knowledge coverage for a domain
   */
  async getCoverage(userId: string, domain: SkillDomain): Promise<KnowledgeCoverage> {
    const items = await this.getItemsByDomain(domain);
    const states = await this.getUserStatesByDomain(userId, domain);

    const stateMap = new Map(states.map((s) => [s.itemId, s]));

    let totalMastery = 0;
    let seenCount = 0;
    let masteredCount = 0;
    const masteryScores: { id: number; score: number }[] = [];

    for (const item of items) {
      const state = stateMap.get(item.id);
      if (state) {
        totalMastery += state.mastery;
        if (state.learningState !== "unseen") seenCount++;
        if (state.learningState === "mastered" || state.learningState === "transferred") {
          masteredCount++;
        }
        masteryScores.push({ id: item.id as unknown as number, score: state.mastery });
      }
    }

    // Sort by mastery to find weakest/strongest
    masteryScores.sort((a, b) => a.score - b.score);
    const weakestItems = masteryScores.slice(0, 5).map((m) => String(m.id));
    const strongestItems = masteryScores.slice(-5).map((m) => String(m.id));

    return {
      domain,
      totalItems: items.length,
      seenItems: seenCount,
      masteredItems: masteredCount,
      averageMastery: items.length > 0 ? totalMastery / items.length : 0,
      weakestItems,
      strongestItems,
    };
  }

  /**
   * Get items due for review (nextReview <= now)
   */
  async getDueItems(userId: string, limit: number = 50): Promise<KnowledgeState[]> {
    const db = getDatabase();
    const now = Date.now();
    return db.knowledgeStates
      .where("[userId+nextReview]")
      .between([userId, 0], [userId, now])
      .limit(limit)
      .toArray() as Promise<KnowledgeState[]>;
  }

  /**
   * Update next review time for a knowledge state
   */
  async setNextReview(stateId: string, nextReview: number): Promise<void> {
    const db = getDatabase();
    const state = await db.knowledgeStates.get(stateId);
    if (!state) throw new Error(`Knowledge state not found: ${stateId}`);

    const s = state as KnowledgeState;
    s.nextReview = nextReview;
    s.lastUpdated = Date.now();
    await db.knowledgeStates.put(s);
  }

  /**
   * Count items by learning state for a user
   */
  async countByState(userId: string): Promise<Record<LearningState, number>> {
    const states = await this.getUserStates(userId);
    const counts: Record<LearningState, number> = {
      unseen: 0,
      seen: 0,
      recognized: 0,
      recalled: 0,
      produced: 0,
      used: 0,
      mastered: 0,
      transferred: 0,
    };

    for (const state of states) {
      counts[state.learningState]++;
    }

    return counts;
  }
}
