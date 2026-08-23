/**
 * SRS Engine - Spaced Repetition System
 *
 * Implements the SM-2 algorithm for spaced repetition.
 * Supports vocabulary, grammar, collocations, phonics.
 *
 * Designed for future expansion:
 * - Words
 * - Sentences
 * - Grammar points
 * - Pronunciation items
 */

import { getDatabase } from "@/db";
import type { ISRSEngine, SRSCard, SRSDifficulty } from "@/types/srs";

// SM-2 Constants
const MIN_EASE_FACTOR = 1.3;
const DEFAULT_EASE_FACTOR = 2.5;
const EASE_BONUS = 0.1;
const EASE_PENALTY = 0.2;

// Interval thresholds (in days)
const GRADUATING_INTERVAL = 1;
const MAX_INTERVAL = 365; // Cap at 1 year

export class SRSEngine implements ISRSEngine {
  /**
   * Create a new SRS card for an entity
   * The card starts as a "new" card with no reviews
   */
  async createCard(
    entryId: string,
    entityType: SRSCard["entityType"],
  ): Promise<SRSCard> {
    const db = getDatabase();
    const now = Date.now();

    const card: SRSCard = {
      id: `${entityType}_${entryId}`,
      entryId,
      entityType,
      easeFactor: DEFAULT_EASE_FACTOR,
      interval: 0,
      repetitions: 0,
      dueDate: now, // Due immediately (new card)
      lastReview: 0,
      reviewCount: 0,
      correctCount: 0,
    };

    await db.srsCards.put(card);
    return card;
  }

  /**
   * Process a review result and update the card using SM-2 algorithm
   *
   * SM-2 Rating:
   * 0 - Complete blackout
   * 1 - Incorrect; remembered upon seeing the answer
   * 2 - Incorrect; easy to recall once shown the correct answer
   * 3 - Correct with serious difficulty
   * 4 - Correct with hesitation
   * 5 - Perfect response
   */
  async processReview(cardId: string, difficulty: SRSDifficulty): Promise<SRSCard> {
    const db = getDatabase();
    const card = await db.srsCards.get(cardId);
    if (!card) throw new Error(`SRS card not found: ${cardId}`);

    const c = card as SRSCard;
    const now = Date.now();
    c.reviewCount += 1;
    c.lastReview = now;

    if (difficulty >= 3) {
      // Correct answer (3, 4, or 5)
      c.correctCount += 1;
      c.repetitions += 1;

      if (c.repetitions === 1) {
        c.interval = GRADUATING_INTERVAL;
      } else if (c.repetitions === 2) {
        c.interval = 6;
      } else {
        c.interval = Math.round(c.interval * c.easeFactor);
      }

      // Apply ease factor adjustment
      c.easeFactor += EASE_BONUS - (5 - difficulty) * (0.08 + (5 - difficulty) * 0.02);
      c.easeFactor = Math.max(MIN_EASE_FACTOR, c.easeFactor);
    } else {
      // Incorrect answer (0, 1, or 2)
      c.repetitions = 0;
      c.interval = GRADUATING_INTERVAL;
      c.easeFactor -= EASE_PENALTY;
      c.easeFactor = Math.max(MIN_EASE_FACTOR, c.easeFactor);
    }

    // Cap interval
    c.interval = Math.min(c.interval, MAX_INTERVAL);

    // Calculate next due date
    const intervalMs = c.interval * 24 * 60 * 60 * 1000;
    c.dueDate = now + intervalMs;

    await db.srsCards.put(c);
    return c;
  }

  /**
   * Get all cards due for review
   */
  async getDueCards(limit: number = 100): Promise<SRSCard[]> {
    const db = getDatabase();
    const now = Date.now();
    return db.srsCards
      .where("dueDate")
      .belowOrEqual(now)
      .limit(limit)
      .toArray() as Promise<SRSCard[]>;
  }

  /**
   * Get cards due today
   */
  async getTodayCards(): Promise<SRSCard[]> {
    const db = getDatabase();
    const now = Date.now();
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    return db.srsCards
      .where("dueDate")
      .between(now, endOfDay.getTime())
      .toArray() as Promise<SRSCard[]>;
  }

  /**
   * Get a specific card by ID
   */
  async getCard(cardId: string): Promise<SRSCard | null> {
    const db = getDatabase();
    return (await db.srsCards.get(cardId)) ?? null;
  }

  /**
   * Get a card by entry ID and type
   */
  async getCardByEntry(
    entryId: string,
    entityType: SRSCard["entityType"],
  ): Promise<SRSCard | null> {
    const db = getDatabase();
    const id = `${entityType}_${entryId}`;
    return (await db.srsCards.get(id)) ?? null;
  }

  /**
   * Calculate next review date based on SM-2 algorithm
   * (Pure function, does not modify the card)
   */
  calculateNextReview(
    card: SRSCard,
    difficulty: SRSDifficulty,
  ): { nextDate: number; newInterval: number; newEaseFactor: number } {
    const now = Date.now();
    let newInterval = card.interval;
    let newEaseFactor = card.easeFactor;
    let newRepetitions = card.repetitions;

    if (difficulty >= 3) {
      // Correct
      newRepetitions += 1;
      if (newRepetitions === 1) {
        newInterval = GRADUATING_INTERVAL;
      } else if (newRepetitions === 2) {
        newInterval = 6;
      } else {
        newInterval = Math.round(card.interval * card.easeFactor);
      }
      newEaseFactor += EASE_BONUS - (5 - difficulty) * (0.08 + (5 - difficulty) * 0.02);
      newEaseFactor = Math.max(MIN_EASE_FACTOR, newEaseFactor);
    } else {
      // Incorrect
      newRepetitions = 0;
      newInterval = GRADUATING_INTERVAL;
      newEaseFactor -= EASE_PENALTY;
      newEaseFactor = Math.max(MIN_EASE_FACTOR, newEaseFactor);
    }

    newInterval = Math.min(newInterval, MAX_INTERVAL);
    const intervalMs = newInterval * 24 * 60 * 60 * 1000;

    return {
      nextDate: now + intervalMs,
      newInterval,
      newEaseFactor,
    };
  }

  /**
   * Get SRS statistics
   */
  async getStats(): Promise<{
    totalCards: number;
    dueToday: number;
    matureCards: number;
    youngCards: number;
    newCards: number;
  }> {
    const db = getDatabase();
    const now = Date.now();
    const allCards = await db.srsCards.toArray();

    const totalCards = allCards.length;
    const dueToday = allCards.filter((c) => (c as SRSCard).dueDate <= now).length;

    // Mature: interval > 21 days
    const matureCards = allCards.filter(
      (c) => (c as SRSCard).interval > 21,
    ).length;

    // Young: interval 1-21 days
    const youngCards = allCards.filter(
      (c) => (c as SRSCard).interval > 0 && (c as SRSCard).interval <= 21,
    ).length;

    // New: never reviewed
    const newCards = allCards.filter(
      (c) => (c as SRSCard).reviewCount === 0,
    ).length;

    return {
      totalCards,
      dueToday,
      matureCards,
      youngCards,
      newCards,
    };
  }

  /**
   * Delete a card
   */
  async deleteCard(cardId: string): Promise<void> {
    const db = getDatabase();
    await db.srsCards.delete(cardId);
  }

  /**
   * Delete all cards for an entity type
   */
  async deleteByEntityType(entityType: SRSCard["entityType"]): Promise<void> {
    const db = getDatabase();
    await db.srsCards.where("entityType").equals(entityType).delete();
  }

  /**
   * Get retention rate (correctCount / reviewCount) for all cards
   */
  async getRetentionRate(): Promise<number> {
    const db = getDatabase();
    const allCards = await db.srsCards.toArray();

    const totalReviews = allCards.reduce((sum, c) => sum + (c as SRSCard).reviewCount, 0);
    const totalCorrect = allCards.reduce((sum, c) => sum + (c as SRSCard).correctCount, 0);

    return totalReviews > 0 ? totalCorrect / totalReviews : 0;
  }

  /**
   * Reset a card (for relearning)
   */
  async resetCard(cardId: string): Promise<SRSCard> {
    const db = getDatabase();
    const card = await db.srsCards.get(cardId);
    if (!card) throw new Error(`SRS card not found: ${cardId}`);

    const c = card as SRSCard;
    c.repetitions = 0;
    c.interval = 0;
    c.easeFactor = DEFAULT_EASE_FACTOR;
    c.dueDate = Date.now(); // Due immediately
    c.reviewCount = 0;
    c.correctCount = 0;

    await db.srsCards.put(c);
    return c;
  }
}
