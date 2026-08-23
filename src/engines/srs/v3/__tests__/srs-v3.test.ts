/**
 * SRS Engine v3 Tests
 */

import { describe, it, expect, beforeEach } from "vitest";
import { SRSEngineV3 } from "../index";

describe("SRSEngineV3", () => {
  let engine: SRSEngineV3;

  beforeEach(() => {
    engine = new SRSEngineV3();
  });

  describe("Card Creation", () => {
    it("should create a new card", () => {
      const card = engine.createCard("hello", "vocabulary");

      expect(card).toBeTruthy();
      expect(card.id).toBe("vocabulary_hello");
      expect(card.strength).toBe("new");
      expect(card.strengthScore).toBe(0);
    });

    it("should initialize card with correct defaults", () => {
      const card = engine.createCard("hello", "vocabulary");

      expect(card.easeFactor).toBe(2.5);
      expect(card.interval).toBe(0);
      expect(card.repetitions).toBe(0);
      expect(card.reviewCount).toBe(0);
      expect(card.correctCount).toBe(0);
    });
  });

  describe("Review Processing", () => {
    it("should process correct review", () => {
      const card = engine.createCard("hello", "vocabulary");
      const result = engine.processReview(card.id, {
        cardId: card.id,
        correct: true,
        responseTime: 1000,
        confidence: 0.9,
        difficulty: 4,
      });

      expect(result.reviewCount).toBe(1);
      expect(result.correctCount).toBe(1);
      expect(result.repetitions).toBe(1);
      expect(result.interval).toBe(1);
    });

    it("should process incorrect review", () => {
      const card = engine.createCard("hello", "vocabulary");
      const result = engine.processReview(card.id, {
        cardId: card.id,
        correct: false,
        responseTime: 2000,
        confidence: 0.3,
        difficulty: 1,
      });

      expect(result.reviewCount).toBe(1);
      expect(result.correctCount).toBe(0);
      expect(result.repetitions).toBe(0);
      expect(result.interval).toBe(1);
    });

    it("should increase interval after multiple correct reviews", () => {
      const card = engine.createCard("hello", "vocabulary");

      // First correct review
      engine.processReview(card.id, {
        cardId: card.id,
        correct: true,
        responseTime: 1000,
        confidence: 0.9,
        difficulty: 4,
      });

      // Second correct review
      const result2 = engine.processReview(card.id, {
        cardId: card.id,
        correct: true,
        responseTime: 800,
        confidence: 0.95,
        difficulty: 5,
      });

      expect(result2.repetitions).toBe(2);
      expect(result2.interval).toBe(6);
    });
  });

  describe("Memory Strength", () => {
    it("should update strength after reviews", () => {
      const card = engine.createCard("hello", "vocabulary");

      // Multiple correct reviews
      for (let i = 0; i < 5; i++) {
        engine.processReview(card.id, {
          cardId: card.id,
          correct: true,
          responseTime: 1000,
          confidence: 0.9,
          difficulty: 4,
        });
      }

      const updatedCard = engine.getCard(card.id);
      expect(updatedCard?.strength).not.toBe("new");
    });

    it("should get cards by strength", () => {
      engine.createCard("hello", "vocabulary");
      engine.createCard("world", "vocabulary");

      const newCards = engine.getCardsByStrength("new");
      expect(newCards.length).toBe(2);
    });
  });

  describe("Due Cards", () => {
    it("should get due cards", () => {
      const card = engine.createCard("hello", "vocabulary");
      const dueCards = engine.getDueCards();

      expect(dueCards.length).toBe(1);
      expect(dueCards[0].id).toBe(card.id);
    });
  });

  describe("Statistics", () => {
    it("should calculate statistics", () => {
      engine.createCard("hello", "vocabulary");
      engine.createCard("world", "vocabulary");

      const stats = engine.getStats();

      expect(stats.totalCards).toBe(2);
      expect(stats.dueToday).toBe(2);
    });
  });

  describe("Card Management", () => {
    it("should reset a card", () => {
      const card = engine.createCard("hello", "vocabulary");
      engine.processReview(card.id, {
        cardId: card.id,
        correct: true,
        responseTime: 1000,
        confidence: 0.9,
        difficulty: 4,
      });

      const resetCard = engine.resetCard(card.id);
      expect(resetCard.strength).toBe("forgotten");
      expect(resetCard.repetitions).toBe(0);
    });

    it("should delete a card", () => {
      engine.createCard("hello", "vocabulary");
      engine.deleteCard("vocabulary_hello");

      const card = engine.getCard("vocabulary_hello");
      expect(card).toBeNull();
    });
  });

  describe("Import/Export", () => {
    it("should export and import cards", () => {
      engine.createCard("hello", "vocabulary");
      engine.createCard("world", "vocabulary");

      const exported = engine.exportCards();
      expect(exported.length).toBe(2);

      const newEngine = new SRSEngineV3();
      newEngine.importCards(exported);

      const stats = newEngine.getStats();
      expect(stats.totalCards).toBe(2);
    });
  });
});
