/**
 * Daily Coach v2 Tests
 */

import { describe, it, expect, beforeEach } from "vitest";
import { DailyCoachEngineV2, type LearnerProfile } from "../index";

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

  describe("Mission Generation", () => {
    it("should generate daily mission with 9 activities", () => {
      const mission = engine.generateMission(mockProfile);
      expect(mission).toBeDefined();
      expect(mission.id).toBeTruthy();
      expect(mission.userId).toBe("test_user");
      expect(mission.activities.length).toBe(9);
      expect(mission.totalTimeMinutes).toBe(240);
      expect(mission.day).toBe(1);
    });

    it("should include day-specific vocabulary", () => {
      const mission = engine.generateMission(mockProfile);
      const vocabActivity = mission.activities.find(a => a.type === "vocabulary_new");
      expect(vocabActivity).toBeDefined();
      const words = (vocabActivity!.content as any).words;
      expect(words).toBeDefined();
      expect(words.length).toBe(10);
      expect(words[0].word).toBe("hello");
      expect(words[0].ipa).toBeTruthy();
      expect(words[0].chinese).toBeTruthy();
    });

    it("should include day-specific reading", () => {
      const mission = engine.generateMission(mockProfile);
      const readingActivity = mission.activities.find(a => a.type === "reading");
      expect(readingActivity).toBeDefined();
      const content = readingActivity!.content as any;
      expect(content.title).toBeTruthy();
      expect(content.text).toBeTruthy();
      expect(content.questions.length).toBe(3);
    });

    it("should include day-specific writing", () => {
      const mission = engine.generateMission(mockProfile);
      const writingActivity = mission.activities.find(a => a.type === "writing");
      expect(writingActivity).toBeDefined();
      const content = writingActivity!.content as any;
      expect(content.task).toBeTruthy();
      expect(content.template).toBeTruthy();
    });

    it("should include day-specific grammar", () => {
      const mission = engine.generateMission(mockProfile);
      const grammarActivity = mission.activities.find(a => a.type === "grammar");
      expect(grammarActivity).toBeDefined();
      const content = grammarActivity!.content as any;
      expect(content.rule).toBeTruthy();
      expect(content.ruleZh).toBeTruthy();
      expect(content.examples.length).toBeGreaterThan(0);
    });

    it("should include pronunciation with letters", () => {
      const mission = engine.generateMission(mockProfile);
      const pronActivity = mission.activities.find(a => a.type === "pronunciation");
      expect(pronActivity).toBeDefined();
      const content = pronActivity!.content as any;
      expect(content.letters.length).toBe(5);
      expect(content.examples.length).toBe(5);
    });

    it("should return cached mission for same day", () => {
      const m1 = engine.generateMission(mockProfile);
      const m2 = engine.generateMission(mockProfile);
      expect(m1.id).toBe(m2.id);
    });
  });

  describe("Activity Completion", () => {
    it("should complete an activity", () => {
      const mission = engine.generateMission(mockProfile);
      engine.completeActivity(mission.id, "act_srs", 0.9);
      expect(mission.completedActivities).toContain("act_srs");
    });

    it("should not duplicate activities", () => {
      const mission = engine.generateMission(mockProfile);
      engine.completeActivity(mission.id, "act_srs", 0.9);
      engine.completeActivity(mission.id, "act_srs", 0.8);
      expect(mission.completedActivities.filter(a => a === "act_srs").length).toBe(1);
    });

    it("should mark mission complete when all done", () => {
      const mission = engine.generateMission(mockProfile);
      for (const act of mission.activities) {
        engine.completeActivity(mission.id, act.id, 0.8);
      }
      expect(mission.completed).toBe(true);
    });
  });

  describe("Different Days", () => {
    it("should have different content for Day 1 vs Day 2", () => {
      const profile1 = { ...mockProfile, currentDay: 1 };
      const profile2 = { ...mockProfile, currentDay: 2 };

      // Need fresh engine instances since missions are cached by date
      const engine1 = new DailyCoachEngineV2();
      const engine2 = new DailyCoachEngineV2();

      const m1 = engine1.generateMission(profile1);
      const m2 = engine2.generateMission(profile2);

      // Different days should have different vocabulary
      const vocab1 = m1.activities.find(a => a.type === "vocabulary_new");
      const vocab2 = m2.activities.find(a => a.type === "vocabulary_new");
      const words1 = (vocab1!.content as any).words;
      const words2 = (vocab2!.content as any).words;
      expect(words1[0].word).not.toBe(words2[0].word);
    });
  });
});
