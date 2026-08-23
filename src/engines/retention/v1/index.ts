/**
 * Learning Retention System v1
 *
 * Features:
 * - Streak tracking
 * - Motivation system
 * - Dropout prevention
 */

// ============================================================
// Types
// ============================================================

export interface RetentionData {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string;
  totalStudyDays: number;
  recoveryCount: number;
  remindersSent: number;
}

export interface StreakInfo {
  current: number;
  longest: number;
  isOnStreak: boolean;
  daysSinceLastStudy: number;
  message: string;
  messageChinese: string;
}

export interface MotivationMessage {
  day: number;
  title: string;
  titleChinese: string;
  message: string;
  messageChinese: string;
  achievements: string[];
  achievementsChinese: string[];
}

// ============================================================
// Storage
// ============================================================

const STORAGE_KEY = "english360_retention_data";

function loadRetentionData(): RetentionData | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function saveRetentionData(data: RetentionData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save retention data:", e);
  }
}

// ============================================================
// Learning Retention System
// ============================================================

export class LearningRetentionSystem {
  private data: RetentionData;

  constructor() {
    this.data = loadRetentionData() || this.getDefaultData();
  }

  private getDefaultData(): RetentionData {
    return {
      userId: "default",
      currentStreak: 0,
      longestStreak: 0,
      lastStudyDate: "",
      totalStudyDays: 0,
      recoveryCount: 0,
      remindersSent: 0,
    };
  }

  /**
   * Record study activity
   */
  recordStudyActivity(date: string): void {
    const today = new Date(date).toISOString().split("T")[0];
    const lastDate = this.data.lastStudyDate;

    if (lastDate === today) {
      // Already studied today
      return;
    }

    const lastStudyDate = new Date(lastDate);
    const todayDate = new Date(today);
    const diffDays = Math.round(
      (todayDate.getTime() - lastStudyDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 1) {
      // Consecutive day
      this.data.currentStreak++;
    } else if (diffDays > 1) {
      // Missed days
      this.data.currentStreak = 1;
      this.data.recoveryCount++;
    } else {
      // First day or same day
      this.data.currentStreak = 1;
    }

    this.data.lastStudyDate = today;
    this.data.totalStudyDays++;
    this.data.longestStreak = Math.max(this.data.longestStreak, this.data.currentStreak);

    this.save();
  }

  /**
   * Get streak info
   */
  getStreakInfo(): StreakInfo {
    const today = new Date().toISOString().split("T")[0];
    const lastDate = this.data.lastStudyDate;

    let daysSinceLastStudy = 0;
    if (lastDate) {
      const lastStudyDate = new Date(lastDate);
      const todayDate = new Date(today);
      daysSinceLastStudy = Math.round(
        (todayDate.getTime() - lastStudyDate.getTime()) / (1000 * 60 * 60 * 24)
      );
    }

    const isOnStreak = daysSinceLastStudy <= 1;

    let message = "";
    let messageChinese = "";

    if (this.data.currentStreak === 0) {
      message = "Start your learning journey today!";
      messageChinese = "今天开始你的学习之旅！";
    } else if (daysSinceLastStudy === 0) {
      message = `Great! You've studied ${this.data.currentStreak} days in a row!`;
      messageChinese = `太棒了！你已经连续学习${this.data.currentStreak}天！`;
    } else if (daysSinceLastStudy === 1) {
      message = "Keep it up! Study today to maintain your streak!";
      messageChinese = "继续加油！今天学习保持连续记录！";
    } else {
      message = `You missed ${daysSinceLastStudy - 1} day(s). Start fresh today!`;
      messageChinese = `你已经${daysSinceLastStudy - 1}天没学习了。今天重新开始吧！`;
    }

    return {
      current: this.data.currentStreak,
      longest: this.data.longestStreak,
      isOnStreak,
      daysSinceLastStudy,
      message,
      messageChinese,
    };
  }

  /**
   * Generate motivation message
   */
  getMotivationMessage(day: number, wordsLearned: number, _studyMinutes: number): MotivationMessage {
    const messages: Record<number, MotivationMessage> = {
      1: {
        day: 1,
        title: "Welcome!",
        titleChinese: "欢迎！",
        message: "Today is the first step of your English journey.",
        messageChinese: "今天是你英语之旅的第一步。",
        achievements: ["Started learning"],
        achievementsChinese: ["开始学习"],
      },
      7: {
        day: 7,
        title: "One Week!",
        titleChinese: "一周了！",
        message: "You've been learning for a week!",
        messageChinese: "你已经学习一周了！",
        achievements: ["7-day streak", "Foundation complete"],
        achievementsChinese: ["7天连续学习", "基础阶段完成"],
      },
      14: {
        day: 14,
        title: "Two Weeks!",
        titleChinese: "两周了！",
        message: "Your dedication is showing results!",
        messageChinese: "你的努力正在显现成果！",
        achievements: ["14-day streak", "Basic conversation"],
        achievementsChinese: ["14天连续学习", "基础对话能力"],
      },
      30: {
        day: 30,
        title: "One Month!",
        titleChinese: "一个月了！",
        message: "Amazing! You've completed the first month!",
        messageChinese: "太棒了！你已经完成第一个月！",
        achievements: ["30-day streak", "300+ words", "CEFR A1"],
        achievementsChinese: ["30天连续学习", "300+单词", "CEFR A1水平"],
      },
    };

    return messages[day] || {
      day,
      title: `Day ${day}`,
      titleChinese: `第${day}天`,
      message: `Keep learning! You've learned ${wordsLearned} words.`,
      messageChinese: `继续学习！你已经学了${wordsLearned}个单词。`,
      achievements: [`${wordsLearned} words learned`],
      achievementsChinese: [`学习了${wordsLearned}个单词`],
    };
  }

  /**
   * Check if user needs reminder
   */
  needsReminder(): boolean {
    const daysSinceLastStudy = this.getStreakInfo().daysSinceLastStudy;
    return daysSinceLastStudy >= 2;
  }

  /**
   * Get dropout risk level
   */
  getDropoutRisk(): "low" | "medium" | "high" {
    const daysSinceLastStudy = this.getStreakInfo().daysSinceLastStudy;

    if (daysSinceLastStudy <= 1) return "low";
    if (daysSinceLastStudy <= 3) return "medium";
    return "high";
  }

  /**
   * Get recovery message
   */
  getRecoveryMessage(): { message: string; messageChinese: string } {
    const risk = this.getDropoutRisk();

    if (risk === "high") {
      return {
        message: "We miss you! Come back and continue your English journey.",
        messageChinese: "我们想念你！回来继续你的英语学习之旅吧。",
      };
    }

    return {
      message: "Take a short break, but don't forget to study today!",
      messageChinese: "休息一下，但别忘了今天学习！",
    };
  }

  /**
   * Save data
   */
  private save(): void {
    saveRetentionData(this.data);
  }

  /**
   * Reset data
   */
  reset(): void {
    this.data = this.getDefaultData();
    this.save();
  }
}

// ============================================================
// Factory Function
// ============================================================

export function createRetentionSystem(): LearningRetentionSystem {
  return new LearningRetentionSystem();
}

export default LearningRetentionSystem;
