/**
 * Learning Effectiveness Engine v1 Tests
 */

import { describe, it, expect, beforeEach } from "vitest";
import { EffectivenessEngineV1, type LearningMetrics } from "../index";

describe("EffectivenessEngineV1", () => {
  let engine: EffectivenessEngineV1;

  beforeEach(() => {
    engine = new EffectivenessEngineV1();
  });

  const createMockMetrics = (overrides: Partial<LearningMetrics> = {}): LearningMetrics => ({
    userId: "test_user",
    period: "month",
    totalStudyMinutes: 2000,
    averageSessionMinutes: 60,
    studyDays: 25,
    streakDays: 10,
    wordsExposed: 1000,
    wordsLearned: 300,
    wordsMastered: 150,
    listeningMinutes: 500,
    readingMinutes: 300,
    speakingAttempts: 200,
    writingAttempts: 50,
    conversationMinutes: 100,
    reviewsCompleted: 500,
    reviewAccuracy: 0.75,
    srsEfficiency: 0.8,
    retentionRate: 0.75,
    forgettingRate: 0.25,
    reviewInterval: 3,
    vocabularyScore: 70,
    listeningScore: 55,
    speakingScore: 45,
    grammarScore: 65,
    readingScore: 60,
    writingScore: 40,
    pronunciationScore: 50,
    ...overrides,
  });

  // ============================================================
  // Health Score Calculation
  // ============================================================

  describe("Health Score Calculation", () => {
    it("should calculate health score for average learner", () => {
      const metrics = createMockMetrics();
      const health = engine.calculateHealthScore(metrics);

      expect(health).toBeDefined();
      expect(health.overall).toBeGreaterThanOrEqual(0);
      expect(health.overall).toBeLessThanOrEqual(100);
      expect(health.breakdown).toBeDefined();
      expect(health.trend).toBeDefined();
      expect(health.insights.length).toBeGreaterThan(0);
      expect(health.recommendations.length).toBeGreaterThan(0);
    });

    it("should calculate high score for advanced learner", () => {
      const metrics = createMockMetrics({
        wordsLearned: 800,
        wordsMastered: 600,
        listeningMinutes: 1000,
        speakingAttempts: 500,
        retentionRate: 0.9,
        vocabularyScore: 90,
        listeningScore: 85,
        speakingScore: 80,
        grammarScore: 85,
        readingScore: 80,
        writingScore: 75,
        pronunciationScore: 85,
      });

      const health = engine.calculateHealthScore(metrics);
      expect(health.overall).toBeGreaterThanOrEqual(70);
    });

    it("should calculate low score for beginner", () => {
      const metrics = createMockMetrics({
        wordsLearned: 50,
        wordsMastered: 10,
        listeningMinutes: 50,
        speakingAttempts: 10,
        retentionRate: 0.5,
        vocabularyScore: 30,
        listeningScore: 25,
        speakingScore: 20,
        grammarScore: 35,
        readingScore: 30,
        writingScore: 15,
        pronunciationScore: 25,
      });

      const health = engine.calculateHealthScore(metrics);
      expect(health.overall).toBeLessThanOrEqual(50);
    });
  });

  // ============================================================
  // Insights Generation
  // ============================================================

  describe("Insights Generation", () => {
    it("should identify strengths", () => {
      const metrics = createMockMetrics({
        wordsLearned: 800,
        wordsMastered: 600,
        listeningMinutes: 800,
        reviewAccuracy: 0.9,
        retentionRate: 0.9,
      });

      const health = engine.calculateHealthScore(metrics);
      const strengths = health.insights.filter(i => i.type === "strength");
      expect(strengths.length).toBeGreaterThan(0);
    });

    it("should identify weaknesses", () => {
      const metrics = createMockMetrics({
        speakingScore: 30,
        writingScore: 25,
      });

      const health = engine.calculateHealthScore(metrics);
      const weaknesses = health.insights.filter(i => i.type === "weakness");
      expect(weaknesses.length).toBeGreaterThan(0);
    });

    it("should identify retention issues", () => {
      const metrics = createMockMetrics({
        retentionRate: 0.5,
      });

      const health = engine.calculateHealthScore(metrics);
      const retentionIssues = health.insights.filter(i => i.skill === "retention");
      expect(retentionIssues.length).toBeGreaterThan(0);
    });
  });

  // ============================================================
  // Recommendations
  // ============================================================

  describe("Recommendations", () => {
    it("should recommend increased study time", () => {
      const metrics = createMockMetrics({
        totalStudyMinutes: 50,
      });

      const health = engine.calculateHealthScore(metrics);
      const timeRec = health.recommendations.find(r => r.includes("study time"));
      expect(timeRec).toBeDefined();
    });

    it("should recommend listening practice", () => {
      const metrics = createMockMetrics({
        listeningMinutes: 20,
        reviewAccuracy: 0.4,
      });

      const health = engine.calculateHealthScore(metrics);
      const listeningRec = health.recommendations.find(r => r.includes("listening"));
      expect(listeningRec).toBeDefined();
    });

    it("should recommend speaking practice", () => {
      const metrics = createMockMetrics({
        speakingAttempts: 5,
        conversationMinutes: 5,
        pronunciationScore: 20,
      });

      const health = engine.calculateHealthScore(metrics);
      const speakingRec = health.recommendations.find(r => r.includes("speaking"));
      expect(speakingRec).toBeDefined();
    });
  });

  // ============================================================
  // Skill Growth
  // ============================================================

  describe("Skill Growth", () => {
    it("should track skill growth", () => {
      // Record multiple metrics
      engine.recordMetrics("test_user", createMockMetrics({ vocabularyScore: 60 }));
      engine.recordMetrics("test_user", createMockMetrics({ vocabularyScore: 70 }));

      const growth = engine.getSkillGrowth("test_user", "vocabulary");
      expect(growth).toBeDefined();
      expect(growth?.currentScore).toBe(70);
      expect(growth?.previousScore).toBe(60);
      expect(growth?.growthRate).toBeGreaterThan(0);
    });

    it("should return null for insufficient data", () => {
      const growth = engine.getSkillGrowth("new_user", "vocabulary");
      expect(growth).toBeNull();
    });
  });

  // ============================================================
  // Learning Patterns
  // ============================================================

  describe("Learning Patterns", () => {
    it("should detect consistent pattern", () => {
      for (let i = 0; i < 5; i++) {
        engine.recordMetrics("test_user", createMockMetrics({ studyDays: 25 }));
      }

      const patterns = engine.getLearningPatterns("test_user");
      const consistent = patterns.find(p => p.type === "consistent");
      expect(consistent).toBeDefined();
    });

    it("should detect sporadic pattern", () => {
      for (let i = 0; i < 5; i++) {
        engine.recordMetrics("test_user", createMockMetrics({ studyDays: 5 }));
      }

      const patterns = engine.getLearningPatterns("test_user");
      const sporadic = patterns.find(p => p.type === "sporadic");
      expect(sporadic).toBeDefined();
    });

    it("should return empty for insufficient data", () => {
      const patterns = engine.getLearningPatterns("new_user");
      expect(patterns.length).toBe(0);
    });
  });
});
