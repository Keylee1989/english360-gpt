/**
 * SRS (Spaced Repetition System) types
 */
export interface SRSCard {
  id: string;
  entryId: string; // reference to vocabulary/grammar/etc.
  entityType: "vocabulary" | "grammar" | "collocation" | "phonics";
  easeFactor: number; // SM-2: starts at 2.5
  interval: number; // days
  repetitions: number;
  dueDate: number; // timestamp
  lastReview: number; // timestamp
  reviewCount: number;
  correctCount: number;
}

export type SRSDifficulty = 0 | 1 | 2 | 3 | 4 | 5; // SM-2 rating

/**
 * SRS Engine Interface
 */
export interface ISRSEngine {
  /**
   * Create a new SRS card for an entity
   */
  createCard(entryId: string, entityType: SRSCard["entityType"]): Promise<SRSCard>;

  /**
   * Process a review result and update the card
   */
  processReview(cardId: string, difficulty: SRSDifficulty): Promise<SRSCard>;

  /**
   * Get all cards due for review
   */
  getDueCards(limit?: number): Promise<SRSCard[]>;

  /**
   * Get cards due today
   */
  getTodayCards(): Promise<SRSCard[]>;

  /**
   * Calculate next review date based on SM-2 algorithm
   */
  calculateNextReview(card: SRSCard, difficulty: SRSDifficulty): {
    nextDate: number;
    newInterval: number;
    newEaseFactor: number;
  };

  /**
   * Get retention statistics
   */
  getStats(): Promise<{
    totalCards: number;
    dueToday: number;
    matureCards: number;
    youngCards: number;
    newCards: number;
  }>;
}
