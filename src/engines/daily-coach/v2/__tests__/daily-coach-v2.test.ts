/**
 * Daily Coach v2 Tests
 */

import { describe, it, expect, beforeEach } from "vitest";
import { DailyCoachEngineV2, createDailyCoach, type LearnerProfile } from "../index";

describe("DailyCoachEngineV2", () => {
  let engine: DailyCoachEngineV2;

  beforeEach(() => {
    engine = new DailyCoachEngineV2();
  });

  const mockProfile: LearnerProfile = {
    userId: "test_user",
    currentDay: 1,
    level: "A1",
    vocabularyLevel: 40,
    listeningLevel: 35,
    speakingLevel: 30,
    grammarLevel: 45,
    readingLevel: 40,
    writingLevel: 25,
    pronunciationLevel: 35,
    weakAreas: ["speaking", "listening"],
    strongAreas: ["vocabulary", "grammar"],
    wordsLearned: 150,
    wordsMastered: 80,
    retentionRate: 0.7,
    studyStreak: 7,
    dailyGoalMinutes: 240,
    yesterdayCompleted: ["act_srs", "act_listening"],
    yesterdayScore: 75,
  };

  // ============================================================
  // Mission Generation
  // ============================================================

  describe("Mission Generation", () => {
    it("should generate daily mission", () => {
      const mission = engine.generateMission(mockProfile);

      expect(mission).toBeDefined();
      expect(mission.id).toBeTruthy();
      expect(mission.userId).toBe("test_user");
      expect(mission.activities.length).toBeGreaterThan(0);
      expect(mission.totalTimeMinutes).toBe(240);
      expect(mission.focusAreas.length).toBeGreaterThan(0);
    });

    it("should generate activities for all skills", () => {
      const mission = engine.generateMission(mockProfile);
      const activityTypes = mission.activities.map((a) => a.type);

      expect(activityTypes).toContain("srs_review");
      expect(activityTypes).toContain("listening_input");
      expect(activityTypes).toContain("shadowing");
      expect(activityTypes).toContain("conversation");
      expect(activityTypes).toContain("reading");
      expect(activityTypes).toContain("writing");
      expect(activityTypes).toContain("grammar");
      expect(activityTypes).toContain("pronunciation");
      expect(activityTypes).toContain("vocabulary_new");
    });

    it("should adjust time based on weak areas", () => {
      const weakProfile = {
        ...mockProfile,
        weakAreas: ["listening", "speaking"],
      };

      const mission = engine.generateMission(weakProfile);
      const listeningActivity = mission.activities.find((a) => a.type === "listening_input");
      const conversationActivity = mission.activities.find((a) => a.type === "conversation");

      expect(listeningActivity?.durationMinutes).toBeGreaterThan(45);
      expect(conversationActivity?.durationMinutes).toBeGreaterThan(30);
    });

    it("should adjust based on yesterday performance", () => {
      const lowScoreProfile = {
        ...mockProfile,
        yesterdayScore: 50,
      };

      const mission = engine.generateMission(lowScoreProfile);
      const vocabularyActivity = mission.activities.find((a) => a.type === "vocabulary_new");
      const srsActivity = mission.activities.find((a) => a.type === "srs_review");

      // Low score: fewer new words, more review (after normalization)
      expect(vocabularyActivity?.durationMinutes).toBeLessThanOrEqual(25);
      expect(srsActivity?.durationMinutes).toBeGreaterThanOrEqual(25);
    });

    it("should set unique IDs for multiple missions", () => {
      const mission1 = engine.generateMission(mockProfile);
      const mission2 = engine.generateMission(mockProfile);

      expect(mission1.id).not.toBe(mission2.id);
    });
  });

  // ============================================================
  // Activity Completion
  // ============================================================

  describe("Activity Completion", () => {
    it("should complete activity", () => {
      const mission = engine.generateMission(mockProfile);

      engine.completeActivity(mission.id, "act_srs", 0.85);

      const updatedMission = engine.getMission(mission.id);
      expect(updatedMission?.completedActivities).toContain("act_srs");
      expect(updatedMission?.activities.find((a) => a.id === "act_srs")?.completed).toBe(true);
    });

    it("should update mission score", () => {
      const mission = engine.generateMission(mockProfile);

      engine.completeActivity(mission.id, "act_srs", 0.85);
      engine.completeActivity(mission.id, "act_listening", 0.9);

      const updatedMission = engine.getMission(mission.id);
      expect(updatedMission?.score).toBeGreaterThan(0);
    });

    it("should mark mission complete when all activities done", () => {
      const mission = engine.generateMission(mockProfile);

      for (const activity of mission.activities) {
        engine.completeActivity(mission.id, activity.id, 0.8);
      }

      const updatedMission = engine.getMission(mission.id);
      expect(updatedMission?.completed).toBe(true);
    });

    it("should throw for invalid mission", () => {
      expect(() => {
        engine.completeActivity("invalid_mission", "act_srs", 0.8);
      }).toThrow("Mission not found");
    });

    it("should throw for invalid activity", () => {
      const mission = engine.generateMission(mockProfile);

      expect(() => {
        engine.completeActivity(mission.id, "invalid_activity", 0.8);
      }).toThrow("Activity not found");
    });
  });

  // ============================================================
  // Mission Stats
  // ============================================================

  describe("Mission Stats", () => {
    it("should get user missions", () => {
      engine.generateMission(mockProfile);
      engine.generateMission(mockProfile);

      const missions = engine.getUserMissions("test_user");
      expect(missions.length).toBe(2);
    });

    it("should get mission stats", () => {
      const mission = engine.generateMission(mockProfile);
      engine.completeActivity(mission.id, "act_srs", 0.85);

      const stats = engine.getMissionStats("test_user");
      expect(stats.totalMissions).toBe(1);
      expect(stats.completedMissions).toBe(0); // Mission not fully complete
      expect(stats.totalStudyMinutes).toBe(240);
    });
  });

  // ============================================================
  // Difficulty and Speed
  // ============================================================

  describe("Difficulty and Speed", () => {
    it("should set easy difficulty for beginners", () => {
      const beginnerProfile = {
        ...mockProfile,
        vocabularyLevel: 20,
        listeningLevel: 15,
        speakingLevel: 10,
        grammarLevel: 25,
      };

      const mission = engine.generateMission(beginnerProfile);
      expect(mission.difficulty).toBe("easy");
    });

    it("should set slow audio for beginners", () => {
      const beginnerProfile = {
        ...mockProfile,
        listeningLevel: 20,
      };

      const mission = engine.generateMission(beginnerProfile);
      expect(mission.audioSpeed).toBe("slow");
    });

    it("should set normal difficulty for intermediate", () => {
      const intermediateProfile = {
        ...mockProfile,
        vocabularyLevel: 60,
        listeningLevel: 55,
        speakingLevel: 50,
        grammarLevel: 65,
      };

      const mission = engine.generateMission(intermediateProfile);
      expect(mission.difficulty).toBe("normal");
    });
  });

  // ============================================================
  // Focus Areas
  // ============================================================

  describe("Focus Areas", () => {
    it("should include weak areas in focus", () => {
      const mission = engine.generateMission(mockProfile);
      expect(mission.focusAreas).toContain("speaking");
      expect(mission.focusAreas).toContain("listening");
    });

    it("should include pronunciation for A1", () => {
      const mission = engine.generateMission(mockProfile);
      expect(mission.focusAreas).toContain("pronunciation");
    });
  });

  // ============================================================
  // Factory Function
  // ============================================================

  describe("Factory Function", () => {
    it("should create daily coach", () => {
      const coach = createDailyCoach();
      expect(coach).toBeInstanceOf(DailyCoachEngineV2);
    });
  });
});
