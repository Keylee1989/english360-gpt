/**
 * SRS Engine v3
 * 
 * Memory Strength Model:
 * - New: Never reviewed
 * - Learning: Just started, short intervals
 * - Familiar: Multiple correct reviews
 * - Strong: Consistent performance
 * - Mastered: Long intervals, high retention
 * - Forgotten: Failed review, needs relearning
 * 
 * Dynamic interval adjustment based on:
 * - Response time
 * - Confidence level
 * - Error patterns
 * - Time since last review
 */

// ============================================================
// Types
// ============================================================

export type MemoryStrength = 
  | "new"        // Never reviewed
  | "learning"   // Just started, interval < 1 day
  | "familiar"   // Multiple correct, interval 1-7 days
  | "strong"     // Consistent, interval 7-30 days
  | "mastered"   // Long retention, interval > 30 days
  | "forgotten"; // Failed review, needs relearning

export interface SRSCardV3 {
  id: string;
  entryId: string;
  entityType: "vocabulary" | "grammar" | "phonics";
  
  // Memory strength
  strength: MemoryStrength;
  strengthScore: number; // 0-100
  
  // SM-2 fields
  easeFactor: number;
  interval: number; // days
  repetitions: number;
  
  // Tracking
  dueDate: number;
  lastReview: number;
  reviewCount: number;
  correctCount: number;
  
  // Advanced metrics
  responseTime: number; // average ms
  confidence: number; // 0-1
  errorHistory: { timestamp: number; error: string }[];
  
  // Metadata
  createdAt: number;
  updatedAt: number;
}

export interface ReviewResult {
  cardId: string;
  correct: boolean;
  responseTime: number;
  confidence: number;
  difficulty: 0 | 1 | 2 | 3 | 4 | 5;
}

export interface SRSStatsV3 {
  totalCards: number;
  byStrength: Record<MemoryStrength, number>;
  dueToday: number;
  averageEaseFactor: number;
  retentionRate: number;
}

// ============================================================
// Memory Strength Model
// ============================================================

const STRENGTH_THRESHOLDS = {
  new: { minScore: 0, maxScore: 0 },
  learning: { minScore: 1, maxScore: 30 },
  familiar: { minScore: 31, maxScore: 60 },
  strong: { minScore: 61, maxScore: 85 },
  mastered: { minScore: 86, maxScore: 100 },
};



// ============================================================
// SRS Engine v3
// ============================================================

export class SRSEngineV3 {
  private cards: Map<string, SRSCardV3> = new Map();

  /**
   * Create a new card
   */
  createCard(
    entryId: string,
    entityType: SRSCardV3["entityType"],
  ): SRSCardV3 {
    const id = `${entityType}_${entryId}`;
    const now = Date.now();

    const card: SRSCardV3 = {
      id,
      entryId,
      entityType,
      strength: "new",
      strengthScore: 0,
      easeFactor: 2.5,
      interval: 0,
      repetitions: 0,
      dueDate: now,
      lastReview: 0,
      reviewCount: 0,
      correctCount: 0,
      responseTime: 0,
      confidence: 0,
      errorHistory: [],
      createdAt: now,
      updatedAt: now,
    };

    this.cards.set(id, card);
    return card;
  }

  /**
   * Process a review
   */
  processReview(
    cardId: string,
    result: ReviewResult,
  ): SRSCardV3 {
    const card = this.cards.get(cardId);
    if (!card) throw new Error(`Card not found: ${cardId}`);

    const now = Date.now();
    const updatedCard = { ...card };

    // Update basic stats
    updatedCard.reviewCount += 1;
    updatedCard.lastReview = now;
    updatedCard.updatedAt = now;

    if (result.correct) {
      updatedCard.correctCount += 1;
      updatedCard.repetitions += 1;
      
      // Update response time (rolling average)
      updatedCard.responseTime = updatedCard.reviewCount === 1
        ? result.responseTime
        : (updatedCard.responseTime * (updatedCard.reviewCount - 1) + result.responseTime) / updatedCard.reviewCount;
      
      // Update confidence
      updatedCard.confidence = updatedCard.reviewCount === 1
        ? result.confidence
        : (updatedCard.confidence * (updatedCard.reviewCount - 1) + result.confidence) / updatedCard.reviewCount;

      // Calculate new interval using SM-2
      if (updatedCard.repetitions === 1) {
        updatedCard.interval = 1;
      } else if (updatedCard.repetitions === 2) {
        updatedCard.interval = 6;
      } else {
        updatedCard.interval = Math.round(updatedCard.interval * updatedCard.easeFactor);
      }

      // Adjust ease factor based on difficulty
      updatedCard.easeFactor += 0.1 - (5 - result.difficulty) * (0.08 + (5 - result.difficulty) * 0.02);
      updatedCard.easeFactor = Math.max(1.3, updatedCard.easeFactor);
    } else {
      // Incorrect review
      updatedCard.repetitions = 0;
      updatedCard.interval = 1;
      updatedCard.easeFactor = Math.max(1.3, updatedCard.easeFactor - 0.2);
      
      // Add to error history
      updatedCard.errorHistory.push({
        timestamp: now,
        error: `Incorrect review at difficulty ${result.difficulty}`,
      });
    }

    // Cap interval at 365 days
    updatedCard.interval = Math.min(updatedCard.interval, 365);

    // Calculate next due date
    const intervalMs = updatedCard.interval * 24 * 60 * 60 * 1000;
    updatedCard.dueDate = now + intervalMs;

    // Update strength score
    updatedCard.strengthScore = this.calculateStrengthScore(updatedCard);
    updatedCard.strength = this.determineStrength(updatedCard.strengthScore);

    this.cards.set(cardId, updatedCard);
    return updatedCard;
  }

  /**
   * Calculate strength score (0-100)
   */
  private calculateStrengthScore(card: SRSCardV3): number {
    if (card.reviewCount === 0) return 0;

    const accuracy = card.correctCount / card.reviewCount;
    const reviewBonus = Math.min(card.reviewCount * 2, 20);
    const intervalBonus = Math.min(card.interval, 30);
    const confidenceBonus = card.confidence * 20;

    const score = (accuracy * 30) + reviewBonus + intervalBonus + confidenceBonus;
    return Math.min(100, Math.max(0, score));
  }

  /**
   * Determine strength level from score
   */
  private determineStrength(score: number): MemoryStrength {
    if (score <= STRENGTH_THRESHOLDS.new.maxScore) return "new";
    if (score <= STRENGTH_THRESHOLDS.learning.maxScore) return "learning";
    if (score <= STRENGTH_THRESHOLDS.familiar.maxScore) return "familiar";
    if (score <= STRENGTH_THRESHOLDS.strong.maxScore) return "strong";
    if (score <= STRENGTH_THRESHOLDS.mastered.maxScore) return "mastered";
    return "new";
  }

  /**
   * Get cards due for review
   */
  getDueCards(limit: number = 50): SRSCardV3[] {
    const now = Date.now();
    return Array.from(this.cards.values())
      .filter(card => card.dueDate <= now)
      .sort((a, b) => a.dueDate - b.dueDate)
      .slice(0, limit);
  }

  /**
   * Get cards by strength
   */
  getCardsByStrength(strength: MemoryStrength): SRSCardV3[] {
    return Array.from(this.cards.values())
      .filter(card => card.strength === strength);
  }

  /**
   * Get card by ID
   */
  getCard(cardId: string): SRSCardV3 | null {
    return this.cards.get(cardId) || null;
  }

  /**
   * Get statistics
   */
  getStats(): SRSStatsV3 {
    const allCards = Array.from(this.cards.values());
    const now = Date.now();

    const byStrength: Record<MemoryStrength, number> = {
      new: 0,
      learning: 0,
      familiar: 0,
      strong: 0,
      mastered: 0,
      forgotten: 0,
    };

    allCards.forEach(card => {
      byStrength[card.strength] += 1;
    });

    const dueToday = allCards.filter(card => card.dueDate <= now).length;
    const totalReviews = allCards.reduce((sum, card) => sum + card.reviewCount, 0);
    const totalCorrect = allCards.reduce((sum, card) => sum + card.correctCount, 0);
    const averageEase = allCards.length > 0
      ? allCards.reduce((sum, card) => sum + card.easeFactor, 0) / allCards.length
      : 2.5;

    return {
      totalCards: allCards.length,
      byStrength,
      dueToday,
      averageEaseFactor: averageEase,
      retentionRate: totalReviews > 0 ? totalCorrect / totalReviews : 0,
    };
  }

  /**
   * Reset a card (for relearning)
   */
  resetCard(cardId: string): SRSCardV3 {
    const card = this.cards.get(cardId);
    if (!card) throw new Error(`Card not found: ${cardId}`);

    const updatedCard = {
      ...card,
      strength: "forgotten" as MemoryStrength,
      strengthScore: 10,
      easeFactor: 2.5,
      interval: 0,
      repetitions: 0,
      dueDate: Date.now(),
      updatedAt: Date.now(),
    };

    this.cards.set(cardId, updatedCard);
    return updatedCard;
  }

  /**
   * Delete a card
   */
  deleteCard(cardId: string): void {
    this.cards.delete(cardId);
  }

  /**
   * Export cards (for persistence)
   */
  exportCards(): SRSCardV3[] {
    return Array.from(this.cards.values());
  }

  /**
   * Import cards (from persistence)
   */
  importCards(cards: SRSCardV3[]): void {
    cards.forEach(card => {
      this.cards.set(card.id, card);
    });
  }
}
