import { describe, it, expect, beforeEach } from "vitest";
import { StudentModelEngine } from "../index";
import { getDatabase } from "@/db";

describe("StudentModelEngine", () => {
  let engine: StudentModelEngine;
  const testUserId = "test_user_001";

  beforeEach(async () => {
    engine = new StudentModelEngine();
    const db = getDatabase();
    await db.studentModels.clear();
  });

  describe("createStudent", () => {
    it("should create a new student model with default values", async () => {
      const student = await engine.createStudent(testUserId);

      expect(student).toBeDefined();
      expect(student.userId).toBe(testUserId);
      expect(student.competencyLevel).toBe("beginner");
      expect(student.overallScore).toBe(0);
      expect(student.settings.intensity).toBe("standard");
      expect(student.settings.adaptiveMode).toBe("auto");
    });

    it("should create student with custom settings", async () => {
      const student = await engine.createStudent(testUserId, {
        intensity: "intensive",
        dailyTargetMinutes: 120,
      });

      expect(student.settings.intensity).toBe("intensive");
      expect(student.settings.dailyTargetMinutes).toBe(120);
    });

    it("should initialize all skill scores to 0", async () => {
      const student = await engine.createStudent(testUserId);

      expect(student.skills.vocabulary.score).toBe(0);
      expect(student.skills.grammar.score).toBe(0);
      expect(student.skills.listening.score).toBe(0);
      expect(student.skills.speaking.score).toBe(0);
      expect(student.skills.reading.score).toBe(0);
      expect(student.skills.writing.score).toBe(0);
      expect(student.skills.pronunciation.score).toBe(0);
      expect(student.skills.fluency.score).toBe(0);
      expect(student.skills.naturalness.score).toBe(0);
    });
  });

  describe("getStudent", () => {
    it("should retrieve an existing student", async () => {
      await engine.createStudent(testUserId);
      const student = await engine.getStudent(testUserId);

      expect(student).not.toBeNull();
      expect(student?.userId).toBe(testUserId);
    });

    it("should return null for non-existent student", async () => {
      const student = await engine.getStudent("nonexistent");
      expect(student).toBeFalsy();
    });
  });

  describe("updateSkillScore", () => {
    it("should update a skill score", async () => {
      await engine.createStudent(testUserId);
      const updated = await engine.updateSkillScore(testUserId, "vocabulary", 35);

      expect(updated.skills.vocabulary.score).toBe(35);
      expect(updated.skills.vocabulary.level).toBe("elementary");
    });

    it("should clamp scores to 0-100", async () => {
      await engine.createStudent(testUserId);
      const updated = await engine.updateSkillScore(testUserId, "vocabulary", 150);

      expect(updated.skills.vocabulary.score).toBe(100);

      const updated2 = await engine.updateSkillScore(testUserId, "vocabulary", -10);
      expect(updated2.skills.vocabulary.score).toBe(0);
    });

    it("should update overall score when skill changes", async () => {
      await engine.createStudent(testUserId);
      const updated = await engine.updateSkillScore(testUserId, "vocabulary", 50);

      expect(updated.overallScore).toBeGreaterThan(0);
    });

    it("should track trend as improving when score increases", async () => {
      await engine.createStudent(testUserId);
      await engine.updateSkillScore(testUserId, "vocabulary", 20);
      const updated = await engine.updateSkillScore(testUserId, "vocabulary", 30);

      expect(updated.skills.vocabulary.trend).toBe("improving");
    });

    it("should track trend as declining when score decreases", async () => {
      await engine.createStudent(testUserId);
      await engine.updateSkillScore(testUserId, "vocabulary", 50);
      const updated = await engine.updateSkillScore(testUserId, "vocabulary", 30);

      expect(updated.skills.vocabulary.trend).toBe("declining");
    });
  });

  describe("getWeakDomains", () => {
    it("should return domains sorted by score", async () => {
      await engine.createStudent(testUserId);
      await engine.updateSkillScore(testUserId, "vocabulary", 50);
      await engine.updateSkillScore(testUserId, "grammar", 20);
      await engine.updateSkillScore(testUserId, "listening", 10);

      const student = await engine.getStudent(testUserId);
      const weak = await engine.getWeakDomains(testUserId, 10);
      // Multiple domains at 0, then listening at 10, grammar at 20, vocabulary at 50
      // Results should be sorted by score (ascending)
      expect(weak[0]).toBe("phonics"); // 0 (weakest)
      expect(weak.length).toBe(10);
      // Verify sorted by checking scores are non-decreasing
      for (let i = 1; i < weak.length; i++) {
        expect(student!.skills[weak[i]].score).toBeGreaterThanOrEqual(
          student!.skills[weak[i - 1]].score,
        );
      }
    });
  });

  describe("updateStreak", () => {
    it("should set streak to 1 on first study", async () => {
      await engine.createStudent(testUserId);
      const updated = await engine.updateStreak(testUserId);

      expect(updated.streak).toBe(1);
      expect(updated.lastStudyDate).toBeTruthy();
    });
  });

  describe("deleteStudent", () => {
    it("should delete a student model", async () => {
      await engine.createStudent(testUserId);
      await engine.deleteStudent(testUserId);

      const student = await engine.getStudent(testUserId);
      expect(student).toBeFalsy();
    });
  });
});
