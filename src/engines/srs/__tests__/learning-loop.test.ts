/**
 * SRS Learning Loop v2 Tests
 */

import { describe, it, expect, beforeEach } from "vitest";
import { SearningLoopV2 } from "../learning-loop";

describe("SearningLoopV2", () => {
  let engine: SearningLoopV2;

  beforeEach(() => {
    engine = new SearningLoopV2();
  });

  describe("Daily Mission Generation", () => {
    it("should generate a daily mission", () => {
      const availableWords = [
        { word: "hello", chineseMeaning: "你好" },
        { word: "world", chineseMeaning: "世界" },
      ];
      const learnedWords: { wordId: string; easeFactor: number; interval: number; dueDate: number; correctCount: number; incorrectCount: number }[] = [];

      const mission = engine.generateDailyMission("user1", 1, availableWords, learnedWords);

      expect(mission).toBeTruthy();
      expect(mission.userId).toBe("user1");
      expect(mission.dayNumber).toBe(1);
      expect(mission.newWords.length).toBeGreaterThan(0);
    });

    it("should include new words in mission", () => {
      const availableWords = [
        { word: "hello", chineseMeaning: "你好" },
        { word: "world", chineseMeaning: "世界" },
        { word: "test", chineseMeaning: "测试" },
      ];
      const learnedWords: { wordId: string; easeFactor: number; interval: number; dueDate: number; correctCount: number; incorrectCount: number }[] = [];

      const mission = engine.generateDailyMission("user1", 1, availableWords, learnedWords);

      expect(mission.newWords.length).toBe(3);
    });

    it("should not include already learned words as new", () => {
      const availableWords = [
        { word: "hello", chineseMeaning: "你好" },
        { word: "world", chineseMeaning: "世界" },
      ];
      const learnedWords = [
        { wordId: "vocab_hello", easeFactor: 2.5, interval: 1, dueDate: Date.now(), correctCount: 1, incorrectCount: 0 },
      ];

      const mission = engine.generateDailyMission("user1", 1, availableWords, learnedWords);

      expect(mission.newWords.length).toBe(1);
      expect(mission.newWords[0].word).toBe("world");
    });

    it("should include review words when due", () => {
      const availableWords = [
        { word: "hello", chineseMeaning: "你好" },
      ];
      const learnedWords = [
        { wordId: "vocab_hello", easeFactor: 2.5, interval: 1, dueDate: Date.now() - 1000, correctCount: 1, incorrectCount: 0 },
      ];

      const mission = engine.generateDailyMission("user1", 1, availableWords, learnedWords);

      expect(mission.reviewWords.length).toBe(1);
    });

    it("should include weak words with low accuracy", () => {
      const availableWords = [
        { word: "hello", chineseMeaning: "你好" },
      ];
      const learnedWords = [
        { wordId: "vocab_hello", easeFactor: 2.5, interval: 1, dueDate: Date.now() + 100000, correctCount: 1, incorrectCount: 3 },
      ];

      const mission = engine.generateDailyMission("user1", 1, availableWords, learnedWords);

      expect(mission.weakWords.length).toBe(1);
    });
  });

  describe("Mission Progress", () => {
    it("should update mission progress", () => {
      const availableWords = [
        { word: "hello", chineseMeaning: "你好" },
      ];
      const learnedWords: { wordId: string; easeFactor: number; interval: number; dueDate: number; correctCount: number; incorrectCount: number }[] = [];

      const mission = engine.generateDailyMission("user1", 1, availableWords, learnedWords);
      const updatedMission = engine.updateMissionProgress(mission, "vocab_hello", true);

      expect(updatedMission.completed).toBe(true);
    });
  });

  describe("Mission Results", () => {
    it("should calculate mission results", () => {
      const availableWords = [
        { word: "hello", chineseMeaning: "你好" },
        { word: "world", chineseMeaning: "世界" },
      ];
      const learnedWords: { wordId: string; easeFactor: number; interval: number; dueDate: number; correctCount: number; incorrectCount: number }[] = [];

      const mission = engine.generateDailyMission("user1", 1, availableWords, learnedWords);
      const results = [
        { wordId: "vocab_hello", correct: true, timeSpent: 30 },
        { wordId: "vocab_world", correct: false, timeSpent: 20 },
      ];

      const missionResult = engine.calculateResults(mission, results);

      expect(missionResult.accuracy).toBe(0.5);
      expect(missionResult.wordsMastered.length).toBe(1);
    });
  });

  describe("Mission Summary", () => {
    it("should get mission summary", () => {
      const availableWords = [
        { word: "hello", chineseMeaning: "你好" },
        { word: "world", chineseMeaning: "世界" },
      ];
      const learnedWords: { wordId: string; easeFactor: number; interval: number; dueDate: number; correctCount: number; incorrectCount: number }[] = [];

      const mission = engine.generateDailyMission("user1", 1, availableWords, learnedWords);
      const summary = engine.getMissionSummary(mission);

      expect(summary.newWordsCount).toBe(2);
      expect(summary.progress).toBe(0);
    });
  });
});
