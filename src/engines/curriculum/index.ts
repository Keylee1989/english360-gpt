/**
 * Curriculum Engine
 *
 * Manages the 360-day learning curriculum:
 * - Stage/Week/Day hierarchy
 * - Learning goals for each day
 * - Prerequisites and dependencies
 * - Progress tracking
 *
 * Data-driven: loads from IndexedDB, not hardcoded.
 */

import { getDatabase } from "@/db";
import type { CurriculumDay } from "@/types/database";

// ============================================================
// Types
// ============================================================

export interface Stage {
  id: number;                    // 1-5
  name: string;
  nameChinese: string;
  description: string;
  descriptionChinese: string;
  startDay: number;
  endDay: number;
  goals: string[];
}

export interface Week {
  id: string;                    // "stage_1_week_1"
  stageId: number;
  weekNumber: number;
  startDay: number;
  endDay: number;
  theme: string;
  themeChinese: string;
}

export interface DayProgress {
  dayId: string;
  completed: boolean;
  score: number;
  timeSpent: number;
  startedAt?: number;
  completedAt?: number;
}

// ============================================================
// Stage Definitions
// ============================================================

export const STAGES: Stage[] = [
  {
    id: 1,
    name: "Foundation",
    nameChinese: "基础阶段",
    description: "Build pronunciation foundation, basic survival English, 500-800 words",
    descriptionChinese: "建立发音基础，基本生存英语，500-800词汇",
    startDay: 1,
    endDay: 30,
    goals: [
      "Master alphabet and phonics",
      "Learn 500-800 high-frequency words",
      "Basic sentence patterns",
      "Self-introduction and greetings",
      "Numbers, time, colors",
    ],
  },
  {
    id: 2,
    name: "Basic Communication",
    nameChinese: "基础交流",
    description: "Handle daily conversations, understand simple spoken English",
    descriptionChinese: "处理日常对话，理解简单英语口语",
    startDay: 31,
    endDay: 90,
    goals: [
      "1500-2000 word vocabulary",
      "Daily life conversations",
      "Shopping, food, transportation",
      "Past and future tenses",
      "Understand slow conversations",
    ],
  },
  {
    id: 3,
    name: "Intermediate Communication",
    nameChinese: "中级交流",
    description: "Real conversations with native speakers",
    descriptionChinese: "与母语者进行真实对话",
    startDay: 91,
    endDay: 180,
    goals: [
      "3000+ word vocabulary",
      "Express opinions and tell stories",
      "Understand movies with subtitles",
      "Read news articles",
      "Write organized paragraphs",
    ],
  },
  {
    id: 4,
    name: "Practical American English",
    nameChinese: "实用美式英语",
    description: "Live and work in English environment",
    descriptionChinese: "在英语环境中生活和工作",
    startDay: 181,
    endDay: 270,
    goals: [
      "4500+ word vocabulary",
      "Workplace communication",
      "Meetings and presentations",
      "Phone calls and emails",
      "Understand native speech",
    ],
  },
  {
    id: 5,
    name: "Fluency Development",
    nameChinese: "流利度发展",
    description: "Natural communication in all contexts",
    descriptionChinese: "在所有场景中自然交流",
    startDay: 271,
    endDay: 360,
    goals: [
      "6000+ word vocabulary",
      "Near-native fluency",
      "Advanced listening",
      "Complex conversations",
      "Professional communication",
    ],
  },
];

// ============================================================
// Curriculum Engine
// ============================================================

export class CurriculumEngine {
  /**
   * Get all stages
   */
  getStages(): Stage[] {
    return STAGES;
  }

  /**
   * Get a specific stage
   */
  getStage(stageId: number): Stage | undefined {
    return STAGES.find(s => s.id === stageId);
  }

  /**
   * Get stage by day number
   */
  getStageByDay(dayNumber: number): Stage | undefined {
    return STAGES.find(s => dayNumber >= s.startDay && dayNumber <= s.endDay);
  }

  /**
   * Create a curriculum day
   */
  async createDay(day: CurriculumDay): Promise<CurriculumDay> {
    const db = getDatabase();
    await db.curriculumDays.put(day);
    return day;
  }

  /**
   * Create multiple curriculum days
   */
  async createDays(days: CurriculumDay[]): Promise<void> {
    const db = getDatabase();
    await db.curriculumDays.bulkPut(days);
  }

  /**
   * Get a curriculum day by day number
   */
  async getDay(dayNumber: number): Promise<CurriculumDay | null> {
    const db = getDatabase();
    const id = `day_${dayNumber}`;
    return (await db.curriculumDays.get(id)) ?? null;
  }

  /**
   * Get a curriculum day by ID
   */
  async getDayById(id: string): Promise<CurriculumDay | null> {
    const db = getDatabase();
    return (await db.curriculumDays.get(id)) ?? null;
  }

  /**
   * Get all days for a stage
   */
  async getDaysByStage(stageId: number): Promise<CurriculumDay[]> {
    const db = getDatabase();
    return db.curriculumDays
      .where("stage")
      .equals(stageId)
      .sortBy("order");
  }

  /**
   * Get all days for a week
   */
  async getDaysByWeek(stageId: number, weekNumber: number): Promise<CurriculumDay[]> {
    const db = getDatabase();
    return db.curriculumDays
      .where("[stage+week]")
      .equals([stageId, weekNumber])
      .sortBy("order");
  }

  /**
   * Get next day for a user
   */
  async getNextDay(userId: string): Promise<CurriculumDay | null> {
    const db = getDatabase();
    
    // Get user's completed days
    const completions = await db.lessonCompletions
      .where("userId")
      .equals(userId)
      .toArray();
    
    const completedDayIds = new Set(completions.filter(c => c.passed).map(c => c.dayId));
    
    // Find first uncompleted day
    const allDays = await db.curriculumDays
      .orderBy("order")
      .toArray();
    
    for (const day of allDays) {
      if (!completedDayIds.has(day.id)) {
        // Check prerequisites
        const prereqsMet = await this.checkPrerequisites(userId, day);
        if (prereqsMet) {
          return day;
        }
      }
    }
    
    return null; // All days completed
  }

  /**
   * Check if prerequisites are met for a day
   */
  async checkPrerequisites(userId: string, day: CurriculumDay): Promise<boolean> {
    if (!day.prerequisites || day.prerequisites.length === 0) {
      return true;
    }

    const db = getDatabase();
    
    for (const prereqId of day.prerequisites) {
      const completion = await db.lessonCompletions
        .where("[userId+dayId]")
        .equals([userId, prereqId])
        .first();
      
      if (!completion || !completion.passed) {
        return false;
      }
    }

    return true;
  }

  /**
   * Get user's progress through the curriculum
   */
  async getUserProgress(userId: string): Promise<{
    currentDay: number;
    totalDays: number;
    completedDays: number;
    currentStage: number;
    stagesCompleted: number[];
    overallProgress: number;
  }> {
    const db = getDatabase();
    
    // Get all completions
    const completions = await db.lessonCompletions
      .where("userId")
      .equals(userId)
      .toArray();
    
    const passedDays = completions.filter(c => c.passed);
    const completedDayIds = new Set(passedDays.map(c => c.dayId));
    
    // Find current day (first uncompleted)
    const allDays = await db.curriculumDays
      .orderBy("order")
      .toArray();
    
    let currentDay = 1;
    for (const day of allDays) {
      if (!completedDayIds.has(day.id)) {
        currentDay = day.dayNumber;
        break;
      }
    }
    
    // Get current stage
    const currentStage = this.getStageByDay(currentDay);
    
    // Calculate stages completed
    const stagesCompleted: number[] = [];
    for (const stage of STAGES) {
      const stageDays = allDays.filter(d => d.stage === stage.id);
      const allStageCompleted = stageDays.every(d => completedDayIds.has(d.id));
      if (allStageCompleted) {
        stagesCompleted.push(stage.id);
      }
    }

    return {
      currentDay,
      totalDays: 360,
      completedDays: completedDayIds.size,
      currentStage: currentStage?.id || 1,
      stagesCompleted,
      overallProgress: completedDayIds.size / 360,
    };
  }

  /**
   * Get curriculum statistics
   */
  async getStats(): Promise<{
    totalDays: number;
    daysWithLessons: number;
    stages: number;
    weeks: number;
  }> {
    const db = getDatabase();
    const days = await db.curriculumDays.toArray();
    const lessons = await db.dailyLessons.toArray();
    
    return {
      totalDays: days.length,
      daysWithLessons: lessons.length,
      stages: STAGES.length,
      weeks: Math.ceil(days.length / 7),
    };
  }

  /**
   * Generate a week plan
   */
  async getWeekPlan(stageId: number, weekNumber: number): Promise<{
    week: Week;
    days: CurriculumDay[];
  }> {
    const days = await this.getDaysByWeek(stageId, weekNumber);
    const firstDay = days[0];
    const lastDay = days[days.length - 1];

    const week: Week = {
      id: `stage_${stageId}_week_${weekNumber}`,
      stageId,
      weekNumber,
      startDay: firstDay?.dayNumber || 1,
      endDay: lastDay?.dayNumber || 7,
      theme: `Week ${weekNumber}`,
      themeChinese: `第${weekNumber}周`,
    };

    return { week, days };
  }

  /**
   * Get stage plan
   */
  async getStagePlan(stageId: number): Promise<{
    stage: Stage;
    weeks: Week[];
    totalDays: number;
    completedDays: number;
  }> {
    const stage = this.getStage(stageId);
    if (!stage) {
      throw new Error(`Stage ${stageId} not found`);
    }

    const days = await this.getDaysByStage(stageId);
    const weekNumbers = [...new Set(days.map(d => d.week))];
    
    const weeks: Week[] = weekNumbers.map(weekNum => {
      const weekDays = days.filter(d => d.week === weekNum);
      return {
        id: `stage_${stageId}_week_${weekNum}`,
        stageId,
        weekNumber: weekNum,
        startDay: weekDays[0]?.dayNumber || 1,
        endDay: weekDays[weekDays.length - 1]?.dayNumber || 7,
        theme: `Week ${weekNum}`,
        themeChinese: `第${weekNum}周`,
      };
    });

    return {
      stage,
      weeks,
      totalDays: stage.endDay - stage.startDay + 1,
      completedDays: 0, // Would need user progress
    };
  }
}
