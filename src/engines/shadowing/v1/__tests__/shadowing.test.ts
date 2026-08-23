/**
 * Tests for Shadowing Practice Engine v1
 */

import { describe, it, expect, beforeEach } from "vitest";
import { 
  ShadowingEngineV1, 
  ShadowingExerciseGenerator 
} from "../index";

describe("ShadowingEngineV1", () => {
  let engine: ShadowingEngineV1;

  beforeEach(() => {
    engine = new ShadowingEngineV1();
  });

  describe("Exercise Creation", () => {
    it("should create shadowing exercise", () => {
      const exercise = engine.createExercise(
        "Hello, how are you?",
        "你好，你好吗？",
        2000,
        "listen_repeat"
      );

      expect(exercise).toBeDefined();
      expect(exercise.text).toBe("Hello, how are you?");
      expect(exercise.translationChinese).toBe("你好，你好吗？");
      expect(exercise.audioDurationMs).toBe(2000);
      expect(exercise.mode).toBe("listen_repeat");
    });

    it("should get exercise by ID", () => {
      const exercise = engine.createExercise(
        "Hello",
        "你好",
        1000,
        "listen_only"
      );

      const retrieved = engine.getExercise(exercise.id);
      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe(exercise.id);
    });
  });

  describe("Attempt Recording", () => {
    it("should record attempt", () => {
      const exercise = engine.createExercise(
        "Hello",
        "你好",
        1000,
        "listen_repeat"
      );

      const attempt = engine.recordAttempt(
        exercise.id,
        "listen_repeat",
        "Hello",
        0,
        1200
      );

      expect(attempt).toBeDefined();
      expect(attempt.exerciseId).toBe(exercise.id);
      expect(attempt.userSpeech).toBe("Hello");
    });
  });

  describe("Analysis", () => {
    it("should analyze attempt", () => {
      const exercise = engine.createExercise(
        "Hello, how are you?",
        "你好，你好吗？",
        2000,
        "listen_repeat"
      );

      const attempt = engine.recordAttempt(
        exercise.id,
        "listen_repeat",
        "Hello, how are you?",
        0,
        2100
      );

      const result = engine.analyzeAttempt(attempt, exercise);

      expect(result).toBeDefined();
      expect(result.accuracy).toBeGreaterThan(0);
      expect(result.timing).toBeGreaterThan(0);
      expect(result.fluency).toBeGreaterThan(0);
      expect(result.overall).toBeGreaterThan(0);
      expect(result.feedback).toBeDefined();
    });

    it("should detect missing words", () => {
      const exercise = engine.createExercise(
        "Hello, how are you?",
        "你好，你好吗？",
        2000,
        "listen_repeat"
      );

      const attempt = engine.recordAttempt(
        exercise.id,
        "listen_repeat",
        "Hello",
        0,
        1000
      );

      const result = engine.analyzeAttempt(attempt, exercise);

      expect(result.mistakes.length).toBeGreaterThan(0);
      expect(result.mistakes.some(m => m.type === "missing")).toBe(true);
    });

    it("should calculate timing score", () => {
      const exercise = engine.createExercise(
        "Hello",
        "你好",
        1000,
        "listen_repeat"
      );

      // Perfect timing
      const attempt1 = engine.recordAttempt(
        exercise.id,
        "listen_repeat",
        "Hello",
        0,
        1050
      );
      const result1 = engine.analyzeAttempt(attempt1, exercise);
      expect(result1.timing).toBeGreaterThanOrEqual(0.8);

      // Bad timing
      const attempt2 = engine.recordAttempt(
        exercise.id,
        "listen_repeat",
        "Hello",
        0,
        3000
      );
      const result2 = engine.analyzeAttempt(attempt2, exercise);
      expect(result2.timing).toBeLessThan(result1.timing);
    });
  });

  describe("Progress", () => {
    it("should track progress", () => {
      const progress = engine.getProgress();
      expect(progress).toBeDefined();
      expect(progress.totalAttempts).toBe(0);
    });
  });

  describe("Mode Filtering", () => {
    it("should get exercises by mode", () => {
      engine.createExercise("Hello", "你好", 1000, "listen_only");
      engine.createExercise("Hi", "嗨", 800, "listen_repeat");
      engine.createExercise("Goodbye", "再见", 1200, "listen_only");

      const listenOnlyExercises = engine.getExercisesByMode("listen_only");
      expect(listenOnlyExercises.length).toBe(2);
      expect(listenOnlyExercises.every(e => e.mode === "listen_only")).toBe(true);
    });
  });
});

describe("ShadowingExerciseGenerator", () => {
  it("should generate exercise from text", () => {
    const exercise = ShadowingExerciseGenerator.generateExercise(
      "Hello world",
      "你好世界",
      "listen_repeat"
    );

    expect(exercise).toBeDefined();
    expect(exercise.text).toBe("Hello world");
    expect(exercise.translationChinese).toBe("你好世界");
    expect(exercise.audioDurationMs).toBeGreaterThan(0);
  });

  it("should generate exercises from audio unit", () => {
    const audioUnit = {
      id: "test_unit",
      text: "Hello",
      translationChinese: "你好",
      shadowingPoints: [
        { startMs: 0, endMs: 500, text: "Hello" }
      ],
    };

    const exercises = ShadowingExerciseGenerator.generateFromAudioUnit(
      audioUnit,
      ["listen_only", "listen_repeat"]
    );

    expect(exercises.length).toBe(2);
    expect(exercises[0].mode).toBe("listen_only");
    expect(exercises[1].mode).toBe("listen_repeat");
  });

  it("should generate progression exercises", () => {
    const exercises = ShadowingExerciseGenerator.generateProgression(
      "Hello",
      "你好"
    );

    expect(exercises.length).toBe(3);
    expect(exercises[0].mode).toBe("listen_only");
    expect(exercises[1].mode).toBe("listen_repeat");
    expect(exercises[2].mode).toBe("shadow_simultaneous");
  });
});
