import { describe, it, expect, beforeEach } from "vitest";
import { DailyPlannerEngine } from "../index";
import { StudentModelEngine } from "../../student-model";
import { getDatabase } from "@/db";

describe("DailyPlannerEngine", () => {
  let planner: DailyPlannerEngine;
  let studentEngine: StudentModelEngine;
  const testUserId = "test_planner_001";

  beforeEach(async () => {
    planner = new DailyPlannerEngine();
    studentEngine = new StudentModelEngine();
    const db = getDatabase();
    await db.studentModels.clear();
    await db.srsCards.clear();
  });

  describe("generatePlan", () => {
    it("should generate a plan for 60 minutes", async () => {
      await studentEngine.createStudent(testUserId);
      const plan = await planner.generatePlan(testUserId, 60);

      expect(plan).toBeDefined();
      expect(plan.date).toBeTruthy();
      expect(plan.totalMinutes).toBeGreaterThan(0);
      expect(plan.sessions.length).toBeGreaterThan(0);
      expect(plan.priorities.length).toBeGreaterThan(0);
    });

    it("should generate a plan for 30 minutes", async () => {
      await studentEngine.createStudent(testUserId);
      const plan = await planner.generatePlan(testUserId, 30);

      expect(plan.totalMinutes).toBeGreaterThan(0);
      expect(plan.totalMinutes).toBeLessThanOrEqual(35);
    });

    it("should generate a longer plan for 4 hours", async () => {
      await studentEngine.createStudent(testUserId);
      const plan = await planner.generatePlan(testUserId, 240);

      expect(plan.totalMinutes).toBeGreaterThan(100);
    });

    it("should include all sessions sorted by priority", async () => {
      await studentEngine.createStudent(testUserId);
      const plan = await planner.generatePlan(testUserId, 120);

      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      for (let i = 1; i < plan.sessions.length; i++) {
        const prev = priorityOrder[plan.sessions[i - 1].priority];
        const curr = priorityOrder[plan.sessions[i].priority];
        expect(curr).toBeGreaterThanOrEqual(prev);
      }
    });

    it("should throw for non-existent student", async () => {
      await expect(planner.generatePlan("nonexistent", 60)).rejects.toThrow(
        "Student not found",
      );
    });
  });

  describe("getSessionPlan", () => {
    it("should generate a session plan for a domain", async () => {
      await studentEngine.createStudent(testUserId);
      const session = await planner.getSessionPlan(testUserId, "vocabulary", 15);

      expect(session.domain).toBe("vocabulary");
      expect(session.minutes).toBe(15);
      expect(session.activityType).toBe("multiple_choice");
    });
  });
});
