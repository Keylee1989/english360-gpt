/**
 * Adaptive Learning Engine v2 Tests
 */

import { describe, it, expect, beforeEach } from "vitest";
import { AdaptiveLearningEngineV2 } from "../index";
import type { DailyLesson } from "@/types/database";

describe("AdaptiveLearningEngineV2", () => {
  let engine: AdaptiveLearningEngineV2;

  beforeEach(() => {
    engine = new AdaptiveLearningEngineV2();
  });

  // ============================================================
  // Profile Management
  // ============================================================

  describe("Profile Management", () => {
    it("should create default profile", () => {
      const profile = engine.getOrCreateProfile("user_001");
      expect(profile).toBeDefined();
      expect(profile.userId).toBe("user_001");
      expect(profile.vocabularyAccuracy).toBe(0);
      expect(profile.currentDifficulty).toBe("absolute_beginner");
    });

    it("should return existing profile", () => {
      const profile1 = engine.getOrCreateProfile("user_001");
      const profile2 = engine.getOrCreateProfile("user_001");
      expect(profile1).toBe(profile2);
    });

    it("should create different profiles for different users", () => {
      const profile1 = engine.getOrCreateProfile("user_001");
      const profile2 = engine.getOrCreateProfile("user_002");
      expect(profile1).not.toBe(profile2);
      expect(profile1.userId).not.toBe(profile2.userId);
    });
  });

  // ============================================================
  // Lesson Adjustment
  // ============================================================

  describe("Lesson Adjustment", () => {
    it("should generate lesson adjustment for beginner", () => {
      const profile = engine.getOrCreateProfile("user_001");
      profile.vocabularyAccuracy = 30;
      profile.listeningScore = 25;
      profile.speakingScore = 20;
      profile.grammarAccuracy = 35;

      const adjustment = engine.generateLessonAdjustment(profile, {} as DailyLesson);

      expect(adjustment).toBeDefined();
      expect(adjustment.vocabulary.newWordsCount).toBeLessThanOrEqual(8);
      expect(adjustment.vocabulary.reviewWordsCount).toBeGreaterThanOrEqual(15);
      expect(adjustment.listening.audioSpeed).toBe("slow");
      expect(adjustment.listening.showTranscript).toBe(true);
      expect(adjustment.speaking.shadowingIntensity).toBe("low");
      expect(adjustment.grammar.explanationLevel).toBe("simple");
    });

    it("should generate lesson adjustment for intermediate learner", () => {
      const profile = engine.getOrCreateProfile("user_001");
      profile.vocabularyAccuracy = 70;
      profile.listeningScore = 65;
      profile.speakingScore = 60;
      profile.grammarAccuracy = 75;
      profile.retentionRate = 0.8;

      const adjustment = engine.generateLessonAdjustment(profile, {} as DailyLesson);

      expect(adjustment.vocabulary.newWordsCount).toBeGreaterThanOrEqual(10);
      expect(adjustment.listening.audioSpeed).toBe("normal");
      expect(adjustment.listening.showTranscript).toBe(false);
      expect(adjustment.speaking.shadowingIntensity).toBe("medium");
      expect(adjustment.grammar.explanationLevel).toBe("detailed");
    });

    it("should adjust vocabulary based on retention rate", () => {
      const profile = engine.getOrCreateProfile("user_001");
      profile.vocabularyAccuracy = 60;
      profile.retentionRate = 0.4; // Low retention

      const adjustment = engine.generateLessonAdjustment(profile, {} as DailyLesson);

      // Should reduce new words and increase review
      expect(adjustment.vocabulary.newWordsCount).toBeLessThanOrEqual(7);
      expect(adjustment.vocabulary.reviewWordsCount).toBeGreaterThanOrEqual(25);
    });

    it("should calculate time allocation correctly", () => {
      const profile = engine.getOrCreateProfile("user_001");
      profile.vocabularyAccuracy = 50;
      profile.listeningScore = 40;
      profile.speakingScore = 45;

      const adjustment = engine.generateLessonAdjustment(profile, {} as DailyLesson);

      expect(adjustment.timeAllocation.total).toBe(240);
      expect(adjustment.timeAllocation.vocabulary).toBeGreaterThan(0);
      expect(adjustment.timeAllocation.listening).toBeGreaterThan(0);
      expect(adjustment.timeAllocation.speaking).toBeGreaterThan(0);
    });
  });

  // ============================================================
  // Lesson Modifications
  // ============================================================

  describe("Lesson Modifications", () => {
    it("should generate lesson modifications", () => {
      const profile = engine.getOrCreateProfile("user_001");
      profile.vocabularyAccuracy = 30;
      profile.listeningScore = 25;

      const mockLesson = {
        activities: [
          { id: "act_1", type: "vocabulary_introduction", duration: 30 },
          { id: "act_2", type: "listening_comprehension", duration: 25 },
          { id: "act_3", type: "speaking_repetition", duration: 20 },
        ],
      };

      const modifications = engine.generateLessonModifications(profile, mockLesson as unknown as DailyLesson);

      expect(modifications).toBeDefined();
      expect(modifications.length).toBeGreaterThan(0);
    });
  });

  // ============================================================
  // Personalized Curriculum
  // ============================================================

  describe("Personalized Curriculum", () => {
    it("should generate personalized curriculum", () => {
      const profile = engine.getOrCreateProfile("user_001");
      profile.vocabularyAccuracy = 50;
      profile.listeningScore = 40;
      profile.speakingScore = 45;
      profile.grammarAccuracy = 55;

      const curriculum = engine.generatePersonalizedCurriculum(profile);

      expect(curriculum).toBeDefined();
      expect(curriculum.userId).toBe("user_001");
      expect(curriculum.dailyPlan.length).toBe(30);
      expect(curriculum.weeklyFocus.length).toBe(4);
      expect(curriculum.skillPriorities.length).toBe(4);
    });
  });

  // ============================================================
  // Profile Updates
  // ============================================================

  describe("Profile Updates", () => {
    it("should update profile with learning data", () => {
      const profile = engine.updateProfile("user_001", {
        vocabularyAccuracy: 60,
        listeningScore: 55,
        speakingScore: 50,
        grammarAccuracy: 65,
        retentionRate: 0.75,
        wordsLearned: 150,
        wordsMastered: 100,
      });

      expect(profile.vocabularyAccuracy).toBe(60);
      expect(profile.listeningScore).toBe(55);
      expect(profile.speakingScore).toBe(50);
      expect(profile.grammarAccuracy).toBe(65);
      expect(profile.retentionRate).toBe(0.75);
      expect(profile.wordsLearned).toBe(150);
      expect(profile.wordsMastered).toBe(100);
    });

    it("should record adaptation when difficulty changes", () => {
      const profile = engine.getOrCreateProfile("user_001");
      expect(profile.currentDifficulty).toBe("absolute_beginner");

      // Update to trigger difficulty change
      engine.updateProfile("user_001", {
        vocabularyAccuracy: 50,
        listeningScore: 50,
        speakingScore: 50,
        grammarAccuracy: 50,
      });

      const updatedProfile = engine.getOrCreateProfile("user_001");
      expect(updatedProfile.adaptationHistory.length).toBeGreaterThan(0);
    });
  });

  // ============================================================
  // Performance Analysis
  // ============================================================

  describe("Performance Analysis", () => {
    it("should identify skill gaps", () => {
      const profile = engine.getOrCreateProfile("user_001");
      profile.vocabularyAccuracy = 80;
      profile.listeningScore = 40; // Weak
      profile.speakingScore = 45; // Weak
      profile.grammarAccuracy = 75;

      const curriculum = engine.generatePersonalizedCurriculum(profile);
      const priorities = curriculum.skillPriorities.filter(p => p.priority === "high");

      expect(priorities.length).toBeGreaterThan(0);
      expect(priorities.some(p => p.skill === "listening")).toBe(true);
    });

    it("should identify strengths", () => {
      const profile = engine.getOrCreateProfile("user_001");
      profile.vocabularyAccuracy = 85;
      profile.listeningScore = 60;
      profile.speakingScore = 55;
      profile.grammarAccuracy = 70;

      const curriculum = engine.generatePersonalizedCurriculum(profile);
      const priorities = curriculum.skillPriorities.filter(p => p.priority === "medium");

      expect(priorities.some(p => p.skill === "vocabulary")).toBe(true);
    });
  });
});
