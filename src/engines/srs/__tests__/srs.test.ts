import { describe, it, expect, beforeEach } from "vitest";
import { SRSEngine } from "../index";
import { getDatabase } from "@/db";
import type { SRSCard } from "@/types/srs";

describe("SRSEngine", () => {
  let engine: SRSEngine;

  beforeEach(async () => {
    engine = new SRSEngine();
    const db = getDatabase();
    await db.srsCards.clear();
  });

  describe("createCard", () => {
    it("should create a new card with default values", async () => {
      const card = await engine.createCard("word_hello", "vocabulary");

      expect(card).toBeDefined();
      expect(card.id).toBe("vocabulary_word_hello");
      expect(card.entryId).toBe("word_hello");
      expect(card.entityType).toBe("vocabulary");
      expect(card.easeFactor).toBe(2.5);
      expect(card.interval).toBe(0);
      expect(card.repetitions).toBe(0);
      expect(card.reviewCount).toBe(0);
    });

    it("should create cards for different entity types", async () => {
      const vocab = await engine.createCard("word_1", "vocabulary");
      const grammar = await engine.createCard("grammar_1", "grammar");

      expect(vocab.entityType).toBe("vocabulary");
      expect(grammar.entityType).toBe("grammar");
    });
  });

  describe("processReview", () => {
    it("should process a correct review (difficulty 3)", async () => {
      const card = await engine.createCard("word_test", "vocabulary");
      const updated = await engine.processReview(card.id, 3);

      expect(updated.correctCount).toBe(1);
      expect(updated.repetitions).toBe(1);
      expect(updated.interval).toBe(1); // First correct: 1 day
    });

    it("should process a perfect review (difficulty 5)", async () => {
      const card = await engine.createCard("word_test", "vocabulary");
      const updated = await engine.processReview(card.id, 5);

      expect(updated.correctCount).toBe(1);
      expect(updated.easeFactor).toBeGreaterThan(2.5);
    });

    it("should process an incorrect review (difficulty 0)", async () => {
      const card = await engine.createCard("word_test", "vocabulary");
      const updated = await engine.processReview(card.id, 0);

      expect(updated.correctCount).toBe(0);
      expect(updated.repetitions).toBe(0);
      expect(updated.interval).toBe(1); // Reset to 1 day
      expect(updated.easeFactor).toBeLessThan(2.5);
    });

    it("should increase interval on consecutive correct reviews", async () => {
      const card = await engine.createCard("word_test", "vocabulary");
      await engine.processReview(card.id, 3); // rep 1, interval 1
      const after2 = await engine.processReview(card.id, 3); // rep 2, interval 6
      const after3 = await engine.processReview(card.id, 3); // rep 3, interval = 6 * easeFactor

      expect(after2.interval).toBe(6);
      expect(after3.interval).toBeGreaterThan(6);
    });

    it("should cap ease factor at minimum 1.3", async () => {
      const card = await engine.createCard("word_test", "vocabulary");
      let updated = card;
      // Fail multiple times to reduce ease factor
      for (let i = 0; i < 10; i++) {
        updated = await engine.processReview(updated.id, 0);
      }
      expect(updated.easeFactor).toBeGreaterThanOrEqual(1.3);
    });

    it("should cap interval at 365 days", async () => {
      const card = await engine.createCard("word_test", "vocabulary");
      // Simulate many correct reviews
      let updated = card;
      for (let i = 0; i < 30; i++) {
        updated = await engine.processReview(updated.id, 5);
      }
      expect(updated.interval).toBeLessThanOrEqual(365);
    });

    it("should throw for non-existent card", async () => {
      await expect(engine.processReview("nonexistent", 3)).rejects.toThrow(
        "SRS card not found",
      );
    });
  });

  describe("calculateNextReview", () => {
    it("should calculate correct next review for first correct answer", () => {
      const card: SRSCard = {
        id: "test",
        entryId: "test",
        entityType: "vocabulary",
        easeFactor: 2.5,
        interval: 0,
        repetitions: 0,
        dueDate: Date.now(),
        lastReview: 0,
        reviewCount: 0,
        correctCount: 0,
      };

      const result = engine.calculateNextReview(card, 3);
      expect(result.newInterval).toBe(1);
      // Difficulty 3 (correct with difficulty) slightly decreases ease
      expect(result.newEaseFactor).toBeLessThanOrEqual(2.5);
    });

    it("should calculate correct next review for incorrect answer", () => {
      const card: SRSCard = {
        id: "test",
        entryId: "test",
        entityType: "vocabulary",
        easeFactor: 2.5,
        interval: 10,
        repetitions: 3,
        dueDate: Date.now(),
        lastReview: Date.now(),
        reviewCount: 5,
        correctCount: 4,
      };

      const result = engine.calculateNextReview(card, 0);
      expect(result.newInterval).toBe(1); // Reset
    });
  });

  describe("getDueCards", () => {
    it("should return cards due now", async () => {
      await engine.createCard("word_1", "vocabulary");
      await engine.createCard("word_2", "vocabulary");

      const due = await engine.getDueCards();
      // Both new cards should be due immediately
      expect(due.length).toBe(2);
    });

    it("should respect limit parameter", async () => {
      for (let i = 0; i < 10; i++) {
        await engine.createCard(`word_${i}`, "vocabulary");
      }

      const due = await engine.getDueCards(5);
      expect(due.length).toBe(5);
    });
  });

  describe("getStats", () => {
    it("should return correct statistics", async () => {
      await engine.createCard("word_1", "vocabulary");
      await engine.createCard("word_2", "vocabulary");

      const stats = await engine.getStats();
      expect(stats.totalCards).toBe(2);
      expect(stats.dueToday).toBe(2); // Both new
      expect(stats.newCards).toBe(2);
    });

    it("should count mature cards correctly", async () => {
      const card = await engine.createCard("word_1", "vocabulary");
      // Make card mature (interval > 21 days)
      for (let i = 0; i < 10; i++) {
        await engine.processReview(card.id, 5);
      }

      const stats = await engine.getStats();
      expect(stats.matureCards).toBe(1);
    });
  });

  describe("getRetentionRate", () => {
    it("should calculate retention rate", async () => {
      const card = await engine.createCard("word_1", "vocabulary");
      await engine.processReview(card.id, 4);
      await engine.processReview(card.id, 4);
      await engine.processReview(card.id, 2);

      const rate = await engine.getRetentionRate();
      expect(rate).toBeCloseTo(2 / 3, 1); // 2 correct out of 3
    });

    it("should return 0 for no reviews", async () => {
      const rate = await engine.getRetentionRate();
      expect(rate).toBe(0);
    });
  });

  describe("resetCard", () => {
    it("should reset card to initial state", async () => {
      const card = await engine.createCard("word_1", "vocabulary");
      await engine.processReview(card.id, 5);
      await engine.processReview(card.id, 5);

      const reset = await engine.resetCard(card.id);
      expect(reset.repetitions).toBe(0);
      expect(reset.interval).toBe(0);
      expect(reset.easeFactor).toBe(2.5);
    });
  });
});
