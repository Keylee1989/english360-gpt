import { describe, it, expect, beforeEach } from "vitest";
import { AssessmentEngine } from "../index";
import { getDatabase } from "@/db";

describe("AssessmentEngine", () => {
  let engine: AssessmentEngine;
  const testUserId = "test_assessment_001";

  beforeEach(async () => {
    engine = new AssessmentEngine();
    const db = getDatabase();
    await db.studentModels.clear();
  });

  describe("getOnboardingSteps", () => {
    it("should return onboarding steps", () => {
      const steps = engine.getOnboardingSteps();
      expect(steps.length).toBeGreaterThan(0);
      expect(steps[0].id).toBe("welcome");
    });

    it("should include required questions", () => {
      const steps = engine.getOnboardingSteps();
      const requiredSteps = steps.filter((s) => s.required);
      expect(requiredSteps.length).toBeGreaterThan(0);
    });
  });

  describe("processOnboarding", () => {
    it("should create a student model from onboarding", async () => {
      const answers = {
        english_level: "zero",
        daily_time: 60,
        intensity: "standard",
        goals: ["daily_conversation"],
        chinese_assist: "auto",
      };

      const student = await engine.processOnboarding(testUserId, answers);

      expect(student).toBeDefined();
      expect(student.userId).toBe(testUserId);
      expect(student.settings.intensity).toBe("standard");
      expect(student.settings.dailyTargetMinutes).toBe(60);
    });

    it("should set initial scores based on level", async () => {
      const answers = {
        english_level: "basic",
        daily_time: 90,
        intensity: "intensive",
        goals: ["work_english", "daily_conversation"],
        chinese_assist: "full",
      };

      const student = await engine.processOnboarding(testUserId, answers);

      expect(student.skills.vocabulary.score).toBe(10);
      expect(student.settings.chineseAssistLevel).toBe("full");
      expect(student.settings.intensity).toBe("intensive");
    });

    it("should set zero scores for zero English level", async () => {
      const answers = {
        english_level: "zero",
        daily_time: 60,
        intensity: "standard",
        goals: ["daily_conversation"],
        chinese_assist: "auto",
      };

      const student = await engine.processOnboarding(testUserId, answers);

      expect(student.skills.vocabulary.score).toBe(0);
      expect(student.skills.grammar.score).toBe(0);
    });
  });

  describe("runAssessment", () => {
    it("should run an assessment for existing student", async () => {
      // Create student first
      await engine.processOnboarding(testUserId, {
        english_level: "zero",
        daily_time: 60,
        intensity: "standard",
        goals: ["daily_conversation"],
        chinese_assist: "auto",
      });

      const result = await engine.runAssessment(testUserId, "daily_check");

      expect(result).toBeDefined();
      expect(result.type).toBe("daily_check");
      expect(result.scores).toBeDefined();
      expect(result.overallScore).toBeDefined();
      expect(result.competencyLevel).toBe("beginner");
    });

    it("should throw for non-existent student", async () => {
      await expect(
        engine.runAssessment("nonexistent", "daily_check"),
      ).rejects.toThrow("Student not found");
    });
  });
});
