/**
 * Grammar Engine v1 Tests
 */

import { describe, it, expect, beforeEach } from "vitest";
import { GrammarEngineV1 } from "../index";

describe("GrammarEngineV1", () => {
  let engine: GrammarEngineV1;

  beforeEach(() => {
    engine = new GrammarEngineV1();
  });

  // ============================================================
  // Grammar Points
  // ============================================================

  describe("Grammar Points", () => {
    it("should get default grammar points", () => {
      const points = engine.getAllPoints();
      expect(points.length).toBeGreaterThan(0);
    });

    it("should get points by level", () => {
      const a1Points = engine.getPointsByLevel("A1");
      expect(a1Points.length).toBeGreaterThan(0);
      a1Points.forEach(point => {
        expect(point.level).toBe("A1");
      });
    });

    it("should get points by category", () => {
      const tensePoints = engine.getPointsByCategory("tenses");
      expect(tensePoints.length).toBeGreaterThan(0);
      tensePoints.forEach(point => {
        expect(point.category).toBe("tenses");
      });
    });

    it("should add custom grammar point", () => {
      const customPoint = {
        id: "custom_gp_001",
        level: "B1" as const,
        category: "conditionals" as const,
        title: "First Conditional",
        titleChinese: "第一条件句",
        rule: "Use if + present, will + base verb for future possibilities.",
        ruleChinese: "用if + 现在时, will + 动词原形表示未来可能性。",
        examples: [
          { correct: "If it rains, I will stay home.", chinese: "如果下雨，我就待在家里。", explanation: "First conditional" },
        ],
        exercises: [],
        tips: ["If clause uses present tense", "Main clause uses will"],
        tipsChinese: ["if从句用现在时", "主句用will"],
        commonMistakes: [],
        commonMistakesChinese: [],
      };

      engine.addPoint(customPoint);
      const retrieved = engine.getPoint("custom_gp_001");
      expect(retrieved).toBeDefined();
      expect(retrieved?.title).toBe("First Conditional");
    });
  });

  // ============================================================
  // Text Analysis
  // ============================================================

  describe("Text Analysis", () => {
    it("should analyze correct text", () => {
      const analysis = engine.analyzeText("I went to school yesterday.");

      expect(analysis).toBeDefined();
      expect(analysis.score).toBeGreaterThan(0.5);
      expect(analysis.errors.length).toBe(0);
    });

    it("should detect tense errors", () => {
      const analysis = engine.analyzeText("I go to school yesterday.");

      expect(analysis.errors.length).toBeGreaterThan(0);
      expect(analysis.errors[0].type).toBe("tense");
    });

    it("should generate suggestions", () => {
      const analysis = engine.analyzeText("He go to school.");

      expect(analysis.suggestions.length).toBeGreaterThan(0);
    });
  });

  // ============================================================
  // Progress Tracking
  // ============================================================

  describe("Progress Tracking", () => {
    it("should record study progress", () => {
      engine.recordStudy("gp_001", 0.9);
      engine.recordStudy("gp_002", 0.7);

      const progress = engine.getProgress();
      expect(progress.pointsStudied).toBe(2);
      expect(progress.averageScore).toBeGreaterThan(0);
    });

    it("should identify weak categories", () => {
      engine.recordStudy("gp_001", 0.5);
      engine.recordStudy("gp_002", 0.4);

      const progress = engine.getProgress();
      expect(progress.weakCategories.length).toBeGreaterThan(0);
    });
  });
});
