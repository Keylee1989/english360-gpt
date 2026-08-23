/**
 * Listening Engine Tests
 */

import { describe, it, expect, beforeEach } from "vitest";
import { ListeningEngine } from "../index";

describe("ListeningEngine", () => {
  let engine: ListeningEngine;

  beforeEach(() => {
    engine = new ListeningEngine();
  });

  describe("Exercise Generation", () => {
    it("should generate listening exercises from vocabulary", () => {
      const words = [
        { word: "hello", chineseMeaning: "你好", ipa: "/həˈloʊ/" },
        { word: "goodbye", chineseMeaning: "再见", ipa: "/ɡʊdˈbaɪ/" },
      ];

      const exercises = engine.generateExercises(words, []);

      expect(exercises.length).toBe(2);
      expect(exercises[0].text).toBe("hello");
      expect(exercises[0].category).toBe("word");
    });

    it("should generate listening exercises from sentences", () => {
      const sentences = [
        { english: "Hello, how are you?", chinese: "你好，你好吗？" },
      ];

      const exercises = engine.generateExercises([], sentences);

      expect(exercises.length).toBe(1);
      expect(exercises[0].text).toBe("Hello, how are you?");
      expect(exercises[0].category).toBe("sentence");
    });

    it("should generate comprehension questions", () => {
      const words = [{ word: "hello", chineseMeaning: "你好", ipa: "/həˈloʊ/" }];

      const exercises = engine.generateExercises(words, []);

      expect(exercises[0].comprehensionQuestions.length).toBeGreaterThan(0);
      expect(exercises[0].comprehensionQuestions[0].correctAnswer).toBe("hello");
    });
  });

  describe("Exercise Evaluation", () => {
    it("should evaluate correct answers", () => {
      const exercise = {
        id: "test",
        text: "hello",
        chineseText: "你好",
        speed: "slow" as const,
        level: "beginner" as const,
        category: "word" as const,
        comprehensionQuestions: [
          {
            id: "q1",
            question: "What word did you hear?",
            chineseQuestion: "你听到了哪个单词？",
            type: "multiple_choice" as const,
            correctAnswer: "hello",
            options: ["hello", "goodbye", "thank", "please"],
          },
        ],
        keywords: ["hello"],
      };

      const result = engine.evaluateAnswer(exercise, "q1", "hello");

      expect(result.correct).toBe(true);
      expect(result.score).toBe(1);
    });

    it("should evaluate incorrect answers", () => {
      const exercise = {
        id: "test",
        text: "hello",
        chineseText: "你好",
        speed: "slow" as const,
        level: "beginner" as const,
        category: "word" as const,
        comprehensionQuestions: [
          {
            id: "q1",
            question: "What word did you hear?",
            chineseQuestion: "你听到了哪个单词？",
            type: "multiple_choice" as const,
            correctAnswer: "hello",
            options: ["hello", "goodbye", "thank", "please"],
          },
        ],
        keywords: ["hello"],
      };

      const result = engine.evaluateAnswer(exercise, "q1", "goodbye");

      expect(result.correct).toBe(false);
      expect(result.score).toBeLessThan(1);
    });
  });

  describe("Progress Calculation", () => {
    it("should calculate progress correctly", () => {
      const results = [
        { exerciseId: "1", userAnswer: "hello", correct: true, score: 1, timeSpent: 10, playbackCount: 1 },
        { exerciseId: "2", userAnswer: "goodbye", correct: true, score: 1, timeSpent: 15, playbackCount: 2 },
        { exerciseId: "3", userAnswer: "wrong", correct: false, score: 0.5, timeSpent: 20, playbackCount: 3 },
      ];

      const progress = engine.calculateProgress(results);

      expect(progress.totalExercises).toBe(3);
      expect(progress.completedExercises).toBe(2);
      expect(progress.averageScore).toBeCloseTo(0.833, 2);
      expect(progress.totalTime).toBe(45);
    });
  });
});
