import { describe, it, expect, beforeEach } from "vitest";
import { KnowledgeEngine } from "../index";
import { getDatabase } from "@/db";
import type { KnowledgeItem } from "@/types/knowledge";

describe("KnowledgeEngine", () => {
  let engine: KnowledgeEngine;
  const testUserId = "test_user_001";

  beforeEach(async () => {
    engine = new KnowledgeEngine();
    const db = getDatabase();
    await db.knowledgeStates.clear();
    await db.knowledgeItems.clear();
    await db.knowledgeEdges.clear();
  });

  describe("createItem", () => {
    it("should create a knowledge item", async () => {
      const item: KnowledgeItem = {
        id: "word_hello",
        domain: "vocabulary",
        type: "word",
        label: "hello",
        chineseLabel: "你好",
        difficulty: 0.1,
        prerequisites: [],
        tags: ["greeting", "basic"],
      };

      const created = await engine.createItem(item);
      expect(created.id).toBe("word_hello");
      expect(created.domain).toBe("vocabulary");
    });

    it("should create multiple items at once", async () => {
      const items: KnowledgeItem[] = [
        {
          id: "phoneme_a",
          domain: "phonics",
          type: "phoneme",
          label: "/æ/",
          chineseLabel: "短元音a",
          difficulty: 0.2,
          prerequisites: [],
          tags: ["phoneme", "vowel"],
        },
        {
          id: "phoneme_b",
          domain: "phonics",
          type: "phoneme",
          label: "/b/",
          chineseLabel: "辅音b",
          difficulty: 0.15,
          prerequisites: [],
          tags: ["phoneme", "consonant"],
        },
      ];

      await engine.createItems(items);

      const aItems = await engine.getItemsByDomainAndType("phonics", "phoneme");
      expect(aItems.length).toBe(2);
    });
  });

  describe("getOrCreateState", () => {
    it("should create a new knowledge state", async () => {
      const state = await engine.getOrCreateState(
        testUserId,
        "word_hello",
        "vocabulary",
      );

      expect(state).toBeDefined();
      expect(state.userId).toBe(testUserId);
      expect(state.itemId).toBe("word_hello");
      expect(state.learningState).toBe("unseen");
      expect(state.mastery).toBe(0);
      expect(state.retention).toBe(1.0);
    });

    it("should return existing state on second call", async () => {
      const first = await engine.getOrCreateState(
        testUserId,
        "word_hello",
        "vocabulary",
      );
      const second = await engine.getOrCreateState(
        testUserId,
        "word_hello",
        "vocabulary",
      );

      expect(first.id).toBe(second.id);
    });
  });

  describe("updateAfterReview", () => {
    it("should increase mastery on correct answer", async () => {
      const state = await engine.getOrCreateState(
        testUserId,
        "word_hello",
        "vocabulary",
      );
      const updated = await engine.updateAfterReview(state.id, true, 0.3);

      expect(updated.mastery).toBeGreaterThan(0);
      expect(updated.correctCount).toBe(1);
      expect(updated.correctStreak).toBe(1);
    });

    it("should decrease mastery on incorrect answer", async () => {
      const state = await engine.getOrCreateState(
        testUserId,
        "word_hello",
        "vocabulary",
      );
      // First set some mastery
      await engine.updateAfterReview(state.id, true, 0.3);
      await engine.updateAfterReview(state.id, true, 0.3);

      // Then get incorrect
      const updated = await engine.updateAfterReview(state.id, false, 0.8);

      expect(updated.mastery).toBeLessThan(1.0);
      expect(updated.errorStreak).toBe(1);
      expect(updated.correctStreak).toBe(0);
    });

    it("should advance learning state after multiple correct answers", async () => {
      const state = await engine.getOrCreateState(
        testUserId,
        "word_hello",
        "vocabulary",
      );

      let current = state;
      for (let i = 0; i < 5; i++) {
        current = await engine.updateAfterReview(current.id, true, 0.2);
      }

      // After 5 correct: streak 3→recognized, streak 5→recalled
      expect(current.learningState).toBe("recalled");
    });

    it("should regress learning state on error streak", async () => {
      const state = await engine.getOrCreateState(
        testUserId,
        "word_hello",
        "vocabulary",
      );

      // Build up to "recognized" (streak 3→recognized)
      let current = state;
      for (let i = 0; i < 3; i++) {
        current = await engine.updateAfterReview(current.id, true, 0.2);
      }
      expect(current.learningState).toBe("recognized");

      // Now fail 3 times
      for (let i = 0; i < 3; i++) {
        current = await engine.updateAfterReview(current.id, false, 0.8);
      }

      expect(stateIndex(current.learningState)).toBeLessThanOrEqual(stateIndex("seen"));
    });
  });

  describe("getUserStatesByDomain", () => {
    it("should return states for a specific domain", async () => {
      await engine.getOrCreateState(testUserId, "word_hello", "vocabulary");
      await engine.getOrCreateState(testUserId, "word_world", "vocabulary");
      await engine.getOrCreateState(testUserId, "grammar_1", "grammar");

      const vocabStates = await engine.getUserStatesByDomain(
        testUserId,
        "vocabulary",
      );
      expect(vocabStates.length).toBe(2);
    });
  });

  describe("getCoverage", () => {
    it("should calculate coverage for a domain", async () => {
      const item1: KnowledgeItem = {
        id: "word_hello",
        domain: "vocabulary",
        type: "word",
        label: "hello",
        chineseLabel: "你好",
        difficulty: 0.1,
        prerequisites: [],
        tags: [],
      };
      const item2: KnowledgeItem = {
        id: "word_world",
        domain: "vocabulary",
        type: "word",
        label: "world",
        chineseLabel: "世界",
        difficulty: 0.2,
        prerequisites: [],
        tags: [],
      };

      await engine.createItems([item1, item2]);
      const state = await engine.getOrCreateState(testUserId, "word_hello", "vocabulary");
      // Do enough reviews to advance past "unseen"
      await engine.updateAfterReview(state.id, true, 0.2);
      await engine.updateAfterReview(state.id, true, 0.2);
      await engine.updateAfterReview(state.id, true, 0.2);

      const coverage = await engine.getCoverage(testUserId, "vocabulary");
      expect(coverage.totalItems).toBe(2);
      // The state should now be recognized (streak >= 3)
      expect(coverage.seenItems).toBeGreaterThanOrEqual(1);
    });
  });

  describe("countByState", () => {
    it("should count items by learning state", async () => {
      await engine.getOrCreateState(testUserId, "item_1", "vocabulary");
      await engine.getOrCreateState(testUserId, "item_2", "vocabulary");
      await engine.getOrCreateState(testUserId, "item_3", "vocabulary");

      const counts = await engine.countByState(testUserId);
      expect(counts.unseen).toBe(3);
      expect(counts.seen).toBe(0);
    });
  });
});

// Helper function (same as in the engine)
const STATE_ORDER = [
  "unseen",
  "seen",
  "recognized",
  "recalled",
  "produced",
  "used",
  "mastered",
  "transferred",
] as const;

function stateIndex(state: string): number {
  return STATE_ORDER.indexOf(state as (typeof STATE_ORDER)[number]);
}
