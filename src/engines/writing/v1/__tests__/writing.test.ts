/**
 * Writing Engine v1 Tests
 */

import { describe, it, expect, beforeEach } from "vitest";
import { WritingEngineV1 } from "../index";

describe("WritingEngineV1", () => {
  let engine: WritingEngineV1;

  beforeEach(() => {
    engine = new WritingEngineV1();
  });

  // ============================================================
  // Task Management
  // ============================================================

  describe("Task Management", () => {
    it("should get default tasks", () => {
      const tasks = engine.getAllTasks();
      expect(tasks.length).toBeGreaterThan(0);
    });

    it("should get tasks by level", () => {
      const beginnerTasks = engine.getTasksByLevel("beginner");
      expect(beginnerTasks.length).toBeGreaterThan(0);
      beginnerTasks.forEach(task => {
        expect(task.level).toBe("beginner");
      });
    });

    it("should get tasks by type", () => {
      const correctionTasks = engine.getTasksByType("sentence_correction");
      expect(correctionTasks.length).toBeGreaterThan(0);
      correctionTasks.forEach(task => {
        expect(task.type).toBe("sentence_correction");
      });
    });

    it("should add custom task", () => {
      const customTask = {
        id: "custom_001",
        type: "free_writing" as const,
        level: "intermediate" as const,
        title: "Custom Task",
        titleChinese: "自定义任务",
        prompt: "Write about technology",
        promptChinese: "写关于科技",
      };

      engine.addTask(customTask);
      const retrieved = engine.getTask("custom_001");
      expect(retrieved).toBeDefined();
      expect(retrieved?.title).toBe("Custom Task");
    });
  });

  // ============================================================
  // Writing Submission
  // ============================================================

  describe("Writing Submission", () => {
    it("should submit writing", () => {
      const submission = engine.submitWriting("write_001", "I went to the shop yesterday.", 120);

      expect(submission).toBeDefined();
      expect(submission.id).toBeTruthy();
      expect(submission.taskId).toBe("write_001");
      expect(submission.content).toBe("I went to the shop yesterday.");
      expect(submission.timeSpent).toBe(120);
    });
  });

  // ============================================================
  // Writing Analysis
  // ============================================================

  describe("Writing Analysis", () => {
    it("should analyze good writing", () => {
      const submission = engine.submitWriting(
        "write_001",
        "I went to the shop yesterday. I bought some apples. They were delicious.",
        180
      );

      const analysis = engine.analyzeWriting(submission);

      expect(analysis).toBeDefined();
      expect(analysis.grammarScore).toBeGreaterThan(0.5);
      expect(analysis.vocabularyScore).toBeGreaterThan(0);
      expect(analysis.coherenceScore).toBeGreaterThan(0);
      expect(analysis.overallScore).toBeGreaterThan(0);
    });

    it("should detect grammar errors", () => {
      const submission = engine.submitWriting(
        "write_001",
        "i go yesterday shop",
        60
      );

      const analysis = engine.analyzeWriting(submission);

      expect(analysis.errors.length).toBeGreaterThan(0);
    });

    it("should generate corrections", () => {
      const submission = engine.submitWriting(
        "write_001",
        "i go yesterday shop",
        60
      );

      const analysis = engine.analyzeWriting(submission);

      expect(analysis.corrections.length).toBeGreaterThan(0);
    });

    it("should generate vocabulary suggestions", () => {
      const submission = engine.submitWriting(
        "write_001",
        "I like good food very much.",
        60
      );

      const analysis = engine.analyzeWriting(submission);

      expect(analysis.vocabularySuggestions.length).toBeGreaterThan(0);
    });

    it("should generate feedback", () => {
      const submission = engine.submitWriting(
        "write_001",
        "I went to the shop yesterday.",
        60
      );

      const analysis = engine.analyzeWriting(submission);

      expect(analysis.feedback).toBeDefined();
      expect(analysis.feedback.overall).toBeTruthy();
      expect(analysis.feedback.overallChinese).toBeTruthy();
    });

    it("should throw for invalid task", () => {
      const submission = engine.submitWriting("invalid_task", "Hello world", 60);

      expect(() => engine.analyzeWriting(submission)).toThrow("Task not found");
    });
  });

  // ============================================================
  // Progress Tracking
  // ============================================================

  describe("Progress Tracking", () => {
    it("should track progress", () => {
      // Submit some writings
      const sub1 = engine.submitWriting("write_001", "I went to the shop.", 60);
      const sub2 = engine.submitWriting("write_002", "My name is Li Wei. I am 30 years old.", 120);

      // Analyze them
      engine.analyzeWriting(sub1);
      engine.analyzeWriting(sub2);

      const progress = engine.getProgress();

      expect(progress).toBeDefined();
      expect(progress.totalTasks).toBeGreaterThan(0);
      expect(progress.completedTasks).toBeGreaterThanOrEqual(1);
      expect(progress.averageScore).toBeGreaterThanOrEqual(0);
    });
  });
});
