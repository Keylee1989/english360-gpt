/**
 * Speaking Engine Tests
 */

import { describe, it, expect, beforeEach } from "vitest";
import { SpeakingEngine } from "../index";

describe("SpeakingEngine", () => {
  let engine: SpeakingEngine;

  beforeEach(() => {
    engine = new SpeakingEngine();
  });

  describe("Exercise Generation", () => {
    it("should generate speaking exercises from sentences", () => {
      const sentences = [
        { english: "Hello, how are you?", chinese: "你好，你好吗？" },
        { english: "I am good.", chinese: "我很好。" },
      ];

      const exercises = engine.generateExercises(sentences, []);

      expect(exercises.length).toBe(2);
      expect(exercises[0].modelSentence).toBe("Hello, how are you?");
      expect(exercises[0].category).toBe("repeat");
    });

    it("should generate speaking exercises from vocabulary", () => {
      const vocabulary = [
        { word: "hello", chineseMeaning: "你好" },
        { word: "goodbye", chineseMeaning: "再见" },
      ];

      const exercises = engine.generateExercises([], vocabulary);

      expect(exercises.length).toBe(2);
      expect(exercises[0].modelSentence).toBe("hello");
    });
  });

  describe("Speaking Evaluation", () => {
    it("should evaluate perfect match", () => {
      const exercise = {
        id: "test",
        modelSentence: "Hello, I am good.",
        chineseMeaning: "你好，我很好。",
        level: "beginner" as const,
        category: "repeat" as const,
        keyWords: ["hello", "good"],
      };

      const result = engine.evaluateSpeaking(exercise, "Hello, I am good.");

      expect(result.accuracy).toBe(1);
      expect(result.score).toBeGreaterThan(0.8);
    });

    it("should evaluate partial match", () => {
      const exercise = {
        id: "test",
        modelSentence: "Hello, I am good.",
        chineseMeaning: "你好，我很好。",
        level: "beginner" as const,
        category: "repeat" as const,
        keyWords: ["hello", "good"],
      };

      const result = engine.evaluateSpeaking(exercise, "Hello, I am bad.");

      expect(result.accuracy).toBeGreaterThan(0.5);
      expect(result.accuracy).toBeLessThan(1);
    });

    it("should generate feedback", () => {
      const exercise = {
        id: "test",
        modelSentence: "Hello",
        chineseMeaning: "你好",
        level: "beginner" as const,
        category: "repeat" as const,
        keyWords: ["hello"],
      };

      const result = engine.evaluateSpeaking(exercise, "Hello");

      expect(result.feedback).toBeTruthy();
      expect(result.suggestions).toBeDefined();
    });
  });

  describe("Speech Recognition Support", () => {
    it("should detect speech recognition support", () => {
      // In test environment, speech recognition is not available
      const isSupported = engine.isSupported();
      expect(typeof isSupported).toBe("boolean");
    });
  });

  describe("Progress Calculation", () => {
    it("should calculate speaking progress", () => {
      const results = [
        {
          exerciseId: "1",
          userSpeech: "Hello",
          modelSentence: "Hello",
          score: 1,
          accuracy: 1,
          fluency: 0.8,
          pronunciation: 0.9,
          feedback: "Good",
          suggestions: [],
        },
        {
          exerciseId: "2",
          userSpeech: "Goodbye",
          modelSentence: "Goodbye",
          score: 0.9,
          accuracy: 0.9,
          fluency: 0.7,
          pronunciation: 0.8,
          feedback: "Good",
          suggestions: [],
        },
      ];

      const progress = engine.calculateProgress(results);

      expect(progress.totalAttempts).toBe(2);
      expect(progress.averageScore).toBeCloseTo(0.95, 1);
      expect(progress.averageAccuracy).toBeCloseTo(0.95, 1);
    });
  });
});
