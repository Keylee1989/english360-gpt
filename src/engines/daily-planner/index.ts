/**
 * Daily Planner Engine v1
 *
 * Generates a daily learning plan based on:
 * - Available study time
 * - Intensity setting
 * - Current weaknesses
 * - Due review items (SRS)
 * - New content allocation
 *
 * Does NOT hardcode Day1-Day360 curriculum.
 * Adapts to the student's actual state.
 */

import type { DailyPlan, PlanSession } from "@/types/engines";
import type { SkillDomain, IntensityLevel } from "@/types";
import { StudentModelEngine } from "../student-model";
import { SRSEngine } from "../srs";

// ============================================================
// Time Allocation Templates (percentage-based)
// ============================================================

interface TimeAllocation {
  domain: SkillDomain;
  percentage: number;
  priority: PlanSession["priority"];
}

// Beginner allocation (score < 20)
const BEGINNER_ALLOCATION: TimeAllocation[] = [
  { domain: "phonics", percentage: 0.25, priority: "critical" },
  { domain: "vocabulary", percentage: 0.20, priority: "high" },
  { domain: "listening", percentage: 0.20, priority: "high" },
  { domain: "pronunciation", percentage: 0.15, priority: "medium" },
  { domain: "speaking", percentage: 0.10, priority: "medium" },
  { domain: "reading", percentage: 0.10, priority: "low" },
];

// Elementary allocation (score 20-45)
const ELEMENTARY_ALLOCATION: TimeAllocation[] = [
  { domain: "vocabulary", percentage: 0.20, priority: "high" },
  { domain: "grammar", percentage: 0.15, priority: "high" },
  { domain: "listening", percentage: 0.20, priority: "high" },
  { domain: "speaking", percentage: 0.15, priority: "medium" },
  { domain: "reading", percentage: 0.15, priority: "medium" },
  { domain: "pronunciation", percentage: 0.10, priority: "medium" },
  { domain: "writing", percentage: 0.05, priority: "low" },
];

// Intermediate allocation (score 45-70)
const INTERMEDIATE_ALLOCATION: TimeAllocation[] = [
  { domain: "vocabulary", percentage: 0.15, priority: "medium" },
  { domain: "grammar", percentage: 0.12, priority: "medium" },
  { domain: "listening", percentage: 0.18, priority: "high" },
  { domain: "speaking", percentage: 0.18, priority: "high" },
  { domain: "reading", percentage: 0.15, priority: "medium" },
  { domain: "writing", percentage: 0.12, priority: "medium" },
  { domain: "pronunciation", percentage: 0.10, priority: "low" },
];

// Advanced allocation (score > 70)
const ADVANCED_ALLOCATION: TimeAllocation[] = [
  { domain: "listening", percentage: 0.15, priority: "medium" },
  { domain: "speaking", percentage: 0.20, priority: "high" },
  { domain: "reading", percentage: 0.18, priority: "medium" },
  { domain: "writing", percentage: 0.18, priority: "medium" },
  { domain: "vocabulary", percentage: 0.10, priority: "low" },
  { domain: "grammar", percentage: 0.10, priority: "low" },
  { domain: "pronunciation", percentage: 0.09, priority: "low" },
];

// ============================================================
// Intensity Multipliers
// ============================================================

const INTENSITY_MULTIPLIER: Record<IntensityLevel, number> = {
  light: 0.6,
  standard: 1.0,
  intensive: 1.3,
  extreme: 1.6,
};

// Review vs new content ratio based on intensity
const REVIEW_RATIO: Record<IntensityLevel, number> = {
  light: 0.5,
  standard: 0.4,
  intensive: 0.3,
  extreme: 0.25,
};

// ============================================================
// Daily Planner Implementation
// ============================================================

export class DailyPlannerEngine {
  private studentEngine: StudentModelEngine;
  private srsEngine: SRSEngine;

  constructor() {
    this.studentEngine = new StudentModelEngine();
    this.srsEngine = new SRSEngine();
  }

  /**
   * Generate a daily learning plan
   */
  async generatePlan(userId: string, minutesAvailable: number): Promise<DailyPlan> {
    const student = await this.studentEngine.getStudent(userId);
    if (!student) throw new Error(`Student not found: ${userId}`);

    const intensity = student.settings.intensity;
    const multiplier = INTENSITY_MULTIPLIER[intensity];
    const effectiveMinutes = Math.round(minutesAvailable * multiplier);

    // Get due SRS cards count
    const srsStats = await this.srsEngine.getStats();
    const dueReviewCount = srsStats.dueToday;

    // Select allocation template based on overall score
    const allocation = this.getAllocation(student.overallScore);

    // Calculate review allocation
    const reviewPercentage = REVIEW_RATIO[intensity];
    const reviewMinutes = Math.round(effectiveMinutes * reviewPercentage);
    const newContentMinutes = effectiveMinutes - reviewMinutes;

    // Build sessions
    const sessions: PlanSession[] = [];

    // Session 1: SRS Review (if there are cards due)
    if (dueReviewCount > 0) {
      sessions.push({
        domain: "vocabulary", // Reviews can span multiple domains
        activityType: "multiple_choice",
        minutes: Math.min(reviewMinutes, Math.max(5, dueReviewCount * 2)),
        description: `Review ${dueReviewCount} due items`,
        priority: "critical",
      });
    }

    // Sessions 2+: New content by domain
    const remainingMinutes = newContentMinutes;
    for (const alloc of allocation) {
      if (remainingMinutes <= 0) break;

      const domainMinutes = Math.round(remainingMinutes * alloc.percentage);
      if (domainMinutes < 3) continue; // Skip if too little time

      // Adjust based on weakness
      const domainScore = student.skills[alloc.domain]?.score ?? 0;
      const adjustedMinutes = this.adjustForWeakness(domainMinutes, domainScore, intensity);

      sessions.push({
        domain: alloc.domain,
        activityType: this.getActivityType(alloc.domain),
        minutes: adjustedMinutes,
        description: this.getSessionDescription(alloc.domain, domainScore),
        priority: alloc.priority,
      });
    }

    // Sort by priority
    const priorityOrder: Record<string, number> = {
      critical: 0,
      high: 1,
      medium: 2,
      low: 3,
    };
    sessions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    // Calculate total
    const totalMinutes = sessions.reduce((sum, s) => sum + s.minutes, 0);

    // Generate priorities list
    const priorities: string[] = [];
    if (dueReviewCount > 0) {
      priorities.push(`Review ${dueReviewCount} due items`);
    }
    for (const weak of await this.studentEngine.getWeakDomains(userId, 2)) {
      priorities.push(`Focus on ${weak}`);
    }

    return {
      date: new Date().toISOString().split("T")[0],
      totalMinutes,
      sessions,
      priorities,
    };
  }

  /**
   * Get plan for a specific time slot
   */
  async getSessionPlan(
    userId: string,
    domain: SkillDomain,
    minutes: number,
  ): Promise<PlanSession> {
    const student = await this.studentEngine.getStudent(userId);
    const domainScore = student?.skills[domain]?.score ?? 0;

    return {
      domain,
      activityType: this.getActivityType(domain),
      minutes,
      description: this.getSessionDescription(domain, domainScore),
      priority: domainScore < 30 ? "high" : "medium",
    };
  }

  // ============================================================
  // Private Methods
  // ============================================================

  private getAllocation(overallScore: number): TimeAllocation[] {
    if (overallScore < 20) return BEGINNER_ALLOCATION;
    if (overallScore < 45) return ELEMENTARY_ALLOCATION;
    if (overallScore < 70) return INTERMEDIATE_ALLOCATION;
    return ADVANCED_ALLOCATION;
  }

  private adjustForWeakness(
    baseMinutes: number,
    score: number,
    _intensity: IntensityLevel,
  ): number {
    // Give more time to weak areas
    if (score < 15) return Math.round(baseMinutes * 1.4);
    if (score < 30) return Math.round(baseMinutes * 1.2);
    if (score > 70) return Math.round(baseMinutes * 0.8);
    return baseMinutes;
  }

  private getActivityType(domain: SkillDomain): PlanSession["activityType"] {
    const activityMap: Partial<Record<SkillDomain, PlanSession["activityType"]>> = {
      vocabulary: "multiple_choice",
      grammar: "fill_blank",
      phonics: "multiple_choice",
      pronunciation: "pronunciation",
      listening: "listening",
      speaking: "speaking",
      reading: "reading_comprehension",
      writing: "writing",
    };
    return activityMap[domain] ?? "multiple_choice";
  }

  private getSessionDescription(domain: SkillDomain, score: number): string {
    if (score < 15) {
      return `Learn new ${domain} fundamentals`;
    }
    if (score < 30) {
      return `Practice ${domain} basics`;
    }
    if (score < 60) {
      return `Build ${domain} skills`;
    }
    return `Strengthen ${domain}`;
  }
}
