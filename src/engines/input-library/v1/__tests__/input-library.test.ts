/**
 * Input Library Engine v1 Tests
 */

import { describe, it, expect, beforeEach } from "vitest";
import { InputLibraryEngineV1 } from "../index";

describe("InputLibraryEngineV1", () => {
  let engine: InputLibraryEngineV1;

  beforeEach(() => {
    engine = new InputLibraryEngineV1();
  });

  // ============================================================
  // Content Management
  // ============================================================

  describe("Content Management", () => {
    it("should get default content", () => {
      const content = engine.getAllContent();
      expect(content.length).toBeGreaterThan(0);
    });

    it("should get content by level", () => {
      const a1Content = engine.getContentByLevel("A1");
      expect(a1Content.length).toBeGreaterThan(0);
      a1Content.forEach(c => {
        expect(c.level).toBe("A1");
      });
    });

    it("should get content by type", () => {
      const dailyContent = engine.getContentByType("slow_daily");
      expect(dailyContent.length).toBeGreaterThan(0);
      dailyContent.forEach(c => {
        expect(c.type).toBe("slow_daily");
      });
    });

    it("should add custom content", () => {
      const customContent = {
        id: "custom_001",
        level: "B1" as const,
        type: "news_simple" as const,
        title: "Custom News",
        titleChinese: "自定义新闻",
        audioDuration: 180,
        speed: "normal" as const,
        transcript: "This is custom news content.",
        chineseTranslation: "这是自定义新闻内容。",
        vocabulary: [],
        questions: [],
        shadowingPoints: [],
        wordCount: 10,
        estimatedMinutes: 8,
        tags: ["news"],
      };

      engine.addContent(customContent);
      const retrieved = engine.getContent("custom_001");
      expect(retrieved).toBeDefined();
      expect(retrieved?.title).toBe("Custom News");
    });
  });

  // ============================================================
  // Progress Tracking
  // ============================================================

  describe("Progress Tracking", () => {
    it("should record progress", () => {
      engine.recordProgress({
        contentId: "input_001",
        userId: "test_user",
        completed: true,
        score: 0.85,
        timeSpent: 300,
        timestamp: Date.now(),
      });

      const progress = engine.getUserProgress("test_user");
      expect(progress.length).toBe(1);
      expect(progress[0].completed).toBe(true);
    });

    it("should get listening stats", () => {
      engine.recordProgress({
        contentId: "input_001",
        userId: "test_user",
        completed: true,
        score: 0.85,
        timeSpent: 300,
        timestamp: Date.now(),
      });

      const stats = engine.getListeningStats("test_user");
      expect(stats.totalMinutes).toBeGreaterThan(0);
      expect(stats.totalContent).toBe(1);
      expect(stats.averageScore).toBeGreaterThan(0);
    });

    it("should get recommended content", () => {
      const recommended = engine.getRecommendedContent("new_user", "A1");
      expect(recommended.length).toBeGreaterThan(0);
      expect(recommended.length).toBeLessThanOrEqual(5);
    });
  });

  // ============================================================
  // Content Quality
  // ============================================================

  describe("Content Quality", () => {
    it("should have vocabulary for each content", () => {
      const content = engine.getAllContent();
      content.forEach(c => {
        expect(c.vocabulary.length).toBeGreaterThan(0);
      });
    });

    it("should have questions for each content", () => {
      const content = engine.getAllContent();
      content.forEach(c => {
        expect(c.questions.length).toBeGreaterThan(0);
      });
    });

    it("should have shadowing points", () => {
      const content = engine.getAllContent();
      content.forEach(c => {
        expect(c.shadowingPoints.length).toBeGreaterThan(0);
      });
    });

    it("should have translations", () => {
      const content = engine.getAllContent();
      content.forEach(c => {
        expect(c.chineseTranslation).toBeTruthy();
      });
    });
  });
});
