/**
 * Reading Engine v1 Tests
 */

import { describe, it, expect, beforeEach } from "vitest";
import { ReadingEngineV1 } from "../index";

describe("ReadingEngineV1", () => {
  let engine: ReadingEngineV1;

  beforeEach(() => {
    engine = new ReadingEngineV1();
  });

  // ============================================================
  // Passage Management
  // ============================================================

  describe("Passage Management", () => {
    it("should get default passages", () => {
      const passages = engine.getAllPassages();
      expect(passages.length).toBeGreaterThan(0);
    });

    it("should get passages by level", () => {
      const beginnerPassages = engine.getPassagesByLevel("beginner");
      expect(beginnerPassages.length).toBeGreaterThan(0);
      beginnerPassages.forEach(passage => {
        expect(passage.level).toBe("beginner");
      });
    });

    it("should get passages by type", () => {
      const narrativePassages = engine.getPassagesByType("narrative");
      expect(narrativePassages.length).toBeGreaterThan(0);
      narrativePassages.forEach(passage => {
        expect(passage.type).toBe("narrative");
      });
    });

    it("should add custom passage", () => {
      const customPassage = {
        id: "custom_read_001",
        level: "intermediate" as const,
        type: "news" as const,
        title: "Custom Article",
        titleChinese: "自定义文章",
        content: "This is a custom article about technology.",
        chineseTranslation: "这是一篇关于科技的自定义文章。",
        vocabulary: [],
        questions: [],
        wordCount: 10,
        estimatedTime: 2,
      };

      engine.addPassage(customPassage);
      const retrieved = engine.getPassage("custom_read_001");
      expect(retrieved).toBeDefined();
      expect(retrieved?.title).toBe("Custom Article");
    });
  });

  // ============================================================
  // Reading Attempt
  // ============================================================

  describe("Reading Attempt", () => {
    it("should submit reading attempt", () => {
      const attempt = engine.submitAttempt(
        "read_001",
        {
          q_001_1: "30",
          q_001_2: "false",
          q_001_3: "at a school",
        },
        120
      );

      expect(attempt).toBeDefined();
      expect(attempt.passageId).toBe("read_001");
      expect(attempt.score).toBe(1);
      expect(attempt.timeSpent).toBe(120);
    });

    it("should calculate score correctly", () => {
      const attempt = engine.submitAttempt(
        "read_001",
        {
          q_001_1: "30",
          q_001_2: "true", // Wrong
          q_001_3: "at a school",
        },
        120
      );

      expect(attempt.score).toBeCloseTo(2 / 3);
    });

    it("should get attempts for passage", () => {
      engine.submitAttempt("read_001", { q_001_1: "30" }, 60);
      engine.submitAttempt("read_001", { q_001_1: "28" }, 90);

      const attempts = engine.getAttempts("read_001");
      expect(attempts.length).toBe(2);
    });

    it("should get best attempt", () => {
      engine.submitAttempt("read_001", { q_001_1: "28" }, 60); // Wrong
      engine.submitAttempt("read_001", { q_001_1: "30", q_001_2: "false", q_001_3: "at a school" }, 90); // All correct

      const best = engine.getBestAttempt("read_001");
      expect(best).toBeDefined();
      expect(best?.score).toBe(1);
    });

    it("should throw for invalid passage", () => {
      expect(() => {
        engine.submitAttempt("invalid_passage", {}, 60);
      }).toThrow("Passage not found");
    });
  });

  // ============================================================
  // Progress Tracking
  // ============================================================

  describe("Progress Tracking", () => {
    it("should track progress", () => {
      engine.submitAttempt("read_001", { q_001_1: "30", q_001_2: "false" }, 120);
      engine.submitAttempt("read_002", { q_002_1: "rice and vegetables" }, 90);

      const progress = engine.getProgress();

      expect(progress).toBeDefined();
      expect(progress.passagesRead).toBe(2);
      expect(progress.averageScore).toBeGreaterThan(0);
      expect(progress.totalWordsRead).toBeGreaterThan(0);
    });

    it("should track level progress", () => {
      engine.submitAttempt("read_001", {}, 60);
      engine.submitAttempt("read_002", {}, 60);

      const progress = engine.getProgress();

      expect(progress.levelProgress.beginner).toBeGreaterThan(0);
    });
  });
});
