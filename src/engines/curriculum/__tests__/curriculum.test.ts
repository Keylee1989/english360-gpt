/**
 * Curriculum Engine Tests
 */

import { describe, it, expect, beforeEach } from "vitest";
import { CurriculumEngine } from "../index";

describe("CurriculumEngine", () => {
  let engine: CurriculumEngine;

  beforeEach(() => {
    engine = new CurriculumEngine();
  });

  describe("getStages", () => {
    it("should return all 5 stages", () => {
      const stages = engine.getStages();
      expect(stages.length).toBe(5);
    });

    it("should have correct stage structure", () => {
      const stages = engine.getStages();
      expect(stages[0].id).toBe(1);
      expect(stages[0].name).toBe("Foundation");
      expect(stages[0].startDay).toBe(1);
      expect(stages[0].endDay).toBe(30);
    });
  });

  describe("getStage", () => {
    it("should return stage by ID", () => {
      const stage = engine.getStage(1);
      expect(stage).toBeDefined();
      expect(stage?.id).toBe(1);
    });

    it("should return undefined for invalid ID", () => {
      const stage = engine.getStage(6);
      expect(stage).toBeUndefined();
    });
  });

  describe("getStageByDay", () => {
    it("should return stage 1 for day 1", () => {
      const stage = engine.getStageByDay(1);
      expect(stage?.id).toBe(1);
    });

    it("should return stage 2 for day 45", () => {
      const stage = engine.getStageByDay(45);
      expect(stage?.id).toBe(2);
    });

    it("should return stage 5 for day 360", () => {
      const stage = engine.getStageByDay(360);
      expect(stage?.id).toBe(5);
    });
  });

  describe("getStats", () => {
    it("should return curriculum statistics", async () => {
      const stats = await engine.getStats();
      expect(stats.stages).toBe(5);
      expect(stats.totalDays).toBe(0); // No days created yet
    });
  });
});
