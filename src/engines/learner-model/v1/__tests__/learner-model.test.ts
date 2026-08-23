/**
 * Tests for Learner Model v1
 */

import { describe, it, expect, beforeEach } from "vitest";
import { LearnerModelV1 } from "../index";

describe("LearnerModelV1", () => {
  let model: LearnerModelV1;

  beforeEach(() => {
    model = new LearnerModelV1();
  });

  describe("Profile Management", () => {
    it("should create default profile", () => {
      const profile = model.getOrCreateProfile("user1");

      expect(profile).toBeDefined();
      expect(profile.userId).toBe("user1");
      expect(profile.vocabularyLevel).toBe(0);
      expect(profile.listeningLevel).toBe(0);
      expect(profile.speakingLevel).toBe(0);
      expect(profile.overallLevel).toBe(0);
      expect(profile.wordsLearned).toBe(0);
      expect(profile.studyStreak).toBe(0);
    });

    it("should return existing profile", () => {
      const profile1 = model.getOrCreateProfile("user1");
      const profile2 = model.getOrCreateProfile("user1");

      expect(profile1.userId).toBe(profile2.userId);
    });

    it("should create different profiles for different users", () => {
      const profile1 = model.getOrCreateProfile("user1");
      const profile2 = model.getOrCreateProfile("user2");

      expect(profile1.userId).not.toBe(profile2.userId);
    });
  });

  describe("Skill Level Updates", () => {
    it("should update vocabulary level", () => {
      const profile = model.updateSkillLevel("user1", "vocabulary", 75);

      expect(profile.vocabularyLevel).toBe(75);
      expect(profile.overallLevel).toBeGreaterThan(0);
    });

    it("should update multiple skill levels", () => {
      model.updateSkillLevel("user1", "vocabulary", 70);
      model.updateSkillLevel("user1", "listening", 80);
      model.updateSkillLevel("user1", "speaking", 60);

      const profile = model.getOrCreateProfile("user1");
      expect(profile.vocabularyLevel).toBe(70);
      expect(profile.listeningLevel).toBe(80);
      expect(profile.speakingLevel).toBe(60);
      expect(profile.overallLevel).toBeGreaterThan(0);
    });

    it("should calculate weighted overall level", () => {
      model.updateSkillLevel("user1", "vocabulary", 80);
      model.updateSkillLevel("user1", "listening", 80);
      model.updateSkillLevel("user1", "speaking", 80);

      const profile = model.getOrCreateProfile("user1");
      expect(profile.overallLevel).toBeGreaterThan(0);
    });
  });

  describe("Weak Area Identification", () => {
    it("should identify weak areas", () => {
      model.updateSkillLevel("user1", "vocabulary", 40);
      model.updateSkillLevel("user1", "listening", 80);

      const profile = model.getOrCreateProfile("user1");
      expect(profile.weakAreas.length).toBeGreaterThan(0);
      expect(profile.weakAreas.some(w => w.skill === "vocabulary")).toBe(true);
    });

    it("should sort weak areas by severity", () => {
      model.updateSkillLevel("user1", "vocabulary", 20);
      model.updateSkillLevel("user1", "listening", 50);
      model.updateSkillLevel("user1", "speaking", 45);

      const profile = model.getOrCreateProfile("user1");
      expect(profile.weakAreas.length).toBeGreaterThan(0);
      
      // Critical should come first
      const criticalAreas = profile.weakAreas.filter(w => w.severity === "critical");
      const majorAreas = profile.weakAreas.filter(w => w.severity === "major");
      
      if (criticalAreas.length > 0 && majorAreas.length > 0) {
        expect(profile.weakAreas.indexOf(criticalAreas[0])).toBeLessThan(
          profile.weakAreas.indexOf(majorAreas[0])
        );
      }
    });
  });

  describe("Daily Recommendations", () => {
    it("should generate daily recommendation", () => {
      const recommendation = model.generateDailyRecommendation("user1");

      expect(recommendation).toBeDefined();
      expect(recommendation.date).toBeDefined();
      expect(recommendation.timeAllocation).toBeDefined();
      expect(recommendation.timeAllocation.total).toBe(240);
      expect(recommendation.focusAreas).toBeDefined();
      expect(recommendation.activities).toBeDefined();
      expect(recommendation.newWordsCount).toBeGreaterThan(0);
      expect(recommendation.reviewWordsCount).toBeGreaterThan(0);
      expect(recommendation.reasons).toBeDefined();
    });

    it("should adjust allocation based on weak areas", () => {
      model.updateSkillLevel("user1", "vocabulary", 30);
      
      const recommendation = model.generateDailyRecommendation("user1");
      
      // Should allocate more time to vocabulary
      expect(recommendation.timeAllocation.vocabulary).toBeGreaterThan(0);
    });

    it("should adjust new words count based on retention", () => {
      const profile = model.getOrCreateProfile("user1");
      profile.retentionRate = 0.5; // Low retention
      
      const recommendation = model.generateDailyRecommendation("user1");
      
      // Should reduce new words
      expect(recommendation.newWordsCount).toBeLessThanOrEqual(10);
    });
  });

  describe("Study Streak", () => {
    it("should update study streak", () => {
      const profile = model.updateStudyStreak("user1", true);
      expect(profile.studyStreak).toBe(1);

      const profile2 = model.updateStudyStreak("user1", true);
      expect(profile2.studyStreak).toBe(2);
    });

    it("should reset streak when not studying", () => {
      model.updateStudyStreak("user1", true);
      model.updateStudyStreak("user1", true);
      
      const profile = model.updateStudyStreak("user1", false);
      expect(profile.studyStreak).toBe(0);
    });
  });

  describe("Skill Progress", () => {
    it("should get skill progress", () => {
      model.updateSkillLevel("user1", "vocabulary", 70);

      const history = [
        { date: "2024-01-01", score: 50 },
        { date: "2024-01-15", score: 60 },
      ];

      const progress = model.getSkillProgress("user1", "vocabulary", history);

      expect(progress).toBeDefined();
      expect(progress.skill).toBe("vocabulary");
      expect(progress.currentScore).toBe(70);
      expect(progress.previousScore).toBe(60);
      expect(progress.change).toBe(10);
      expect(progress.trend).toBe("improving");
    });

    it("should detect declining trend", () => {
      model.updateSkillLevel("user1", "vocabulary", 40);

      const history = [
        { date: "2024-01-01", score: 60 },
        { date: "2024-01-15", score: 55 },
      ];

      const progress = model.getSkillProgress("user1", "vocabulary", history);

      expect(progress.trend).toBe("declining");
    });
  });

  describe("Export/Import", () => {
    it("should export profile", () => {
      model.updateSkillLevel("user1", "vocabulary", 75);
      
      const exported = model.exportProfile("user1");
      expect(exported).toBeDefined();
      expect(exported?.vocabularyLevel).toBe(75);
    });

    it("should import profile", () => {
      const profile = {
        userId: "user2",
        vocabularyLevel: 80,
        listeningLevel: 70,
        speakingLevel: 60,
        pronunciationLevel: 0,
        grammarLevel: 0,
        readingLevel: 0,
        writingLevel: 0,
        overallLevel: 70,
        retentionRate: 0.8,
        studyStreak: 5,
        totalStudyMinutes: 1000,
        wordsLearned: 100,
        wordsMastered: 50,
        lessonsCompleted: 10,
        assessmentsCompleted: 2,
        weakAreas: [],
        preferredStudyTime: "morning" as const,
        dailyGoalMinutes: 240,
        createdAt: Date.now(),
        lastActiveAt: Date.now(),
      };

      model.importProfile(profile);
      const retrieved = model.exportProfile("user2");
      
      expect(retrieved).toBeDefined();
      expect(retrieved?.vocabularyLevel).toBe(80);
    });
  });
});
