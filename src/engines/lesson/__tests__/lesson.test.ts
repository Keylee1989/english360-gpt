/**
 * Lesson Engine Tests
 */

import { describe, it, expect, beforeEach } from "vitest";
import { LessonEngine } from "../index";

describe("LessonEngine", () => {
  let engine: LessonEngine;

  beforeEach(() => {
    engine = new LessonEngine();
  });

  describe("evaluateExercise", () => {
    it("should evaluate correct answer", () => {
      const exercise = {
        id: "test_1",
        type: "multiple_choice" as const,
        prompt: "What does 'hello' mean?",
        correctAnswer: "你好",
        options: ["你好", "再见", "谢谢", "对不起"],
      };

      const result = engine.evaluateExercise(exercise, "你好");
      expect(result.correct).toBe(true);
      expect(result.score).toBe(1);
    });

    it("should evaluate incorrect answer", () => {
      const exercise = {
        id: "test_1",
        type: "multiple_choice" as const,
        prompt: "What does 'hello' mean?",
        correctAnswer: "你好",
        options: ["你好", "再见", "谢谢", "对不起"],
      };

      const result = engine.evaluateExercise(exercise, "再见");
      expect(result.correct).toBe(false);
      expect(result.score).toBeLessThan(1);
    });

    it("should handle case insensitive answers", () => {
      const exercise = {
        id: "test_1",
        type: "text_input" as const,
        prompt: "Write 'hello' in English",
        correctAnswer: "hello",
      };

      const result = engine.evaluateExercise(exercise, "Hello");
      expect(result.correct).toBe(true);
    });

    it("should handle answers with extra whitespace", () => {
      const exercise = {
        id: "test_1",
        type: "text_input" as const,
        prompt: "Write 'hello' in English",
        correctAnswer: "hello",
      };

      const result = engine.evaluateExercise(exercise, "  hello  ");
      expect(result.correct).toBe(true);
    });
  });

  describe("getUserLessonProgress", () => {
    it("should return zero progress for new user", async () => {
      const progress = await engine.getUserLessonProgress("new_user");
      expect(progress.started).toBe(0);
      expect(progress.completed).toBe(0);
      expect(progress.passed).toBe(0);
    });
  });
});
