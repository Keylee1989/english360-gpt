/**
 * Beta Testing System v1
 *
 * Manages real user beta testing for English360.
 *
 * Features:
 * - User registration
 * - Daily tracking
 * - Analytics collection
 * - Dropout detection
 * - Effectiveness measurement
 */

// ============================================================
// Types
// ============================================================

export interface BetaUser {
  id: string;
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  currentLevel: "zero" | "basic" | "elementary" | "intermediate";
  goals: string[];
  dailyMinutes: number;
  reason: string;
  registeredAt: number;
  lastActiveAt: number;
  status: "active" | "inactive" | "dropped";
}

export interface DailyTracking {
  userId: string;
  date: string;
  loginTime: number;
  logoutTime?: number;
  studyMinutes: number;
  completedTasks: string[];
  wordsLearned: number;
  wordsReviewed: number;
  listeningMinutes: number;
  speakingMinutes: number;
  readingMinutes: number;
  writingMinutes: number;
  aiInteractions: number;
  listeningScore?: number;
  speakingScore?: number;
  readingScore?: number;
  writingScore?: number;
  retentionRate?: number;
  mood?: "great" | "good" | "okay" | "bad";
  feedback?: string;
}

export interface BetaTestReport {
  totalUsers: number;
  activeUsers: number;
  droppedUsers: number;
  averageStudyMinutes: number;
  averageWordsLearned: number;
  averageRetentionRate: number;
  dropoutRate: number;
  commonDropoutReasons: string[];
  effectivenessScore: number;
  recommendations: string[];
}

export interface UserProgress {
  userId: string;
  currentDay: number;
  totalStudyMinutes: number;
  totalWordsLearned: number;
  totalWordsMastered: number;
  averageScore: number;
  streak: number;
  bestStreak: number;
  skills: {
    vocabulary: number;
    listening: number;
    speaking: number;
    reading: number;
    writing: number;
  };
}

// ============================================================
// Beta Testing System
// ============================================================

export class BetaTestingSystemV1 {
  private users: Map<string, BetaUser> = new Map();
  private tracking: Map<string, DailyTracking[]> = new Map();
  private progress: Map<string, UserProgress> = new Map();

  /**
   * Register a new beta user
   */
  registerUser(userData: Omit<BetaUser, "id" | "registeredAt" | "lastActiveAt" | "status">): BetaUser {
    const user: BetaUser = {
      ...userData,
      id: `beta_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      registeredAt: Date.now(),
      lastActiveAt: Date.now(),
      status: "active",
    };

    this.users.set(user.id, user);

    // Initialize progress
    this.progress.set(user.id, {
      userId: user.id,
      currentDay: 1,
      totalStudyMinutes: 0,
      totalWordsLearned: 0,
      totalWordsMastered: 0,
      averageScore: 0,
      streak: 0,
      bestStreak: 0,
      skills: {
        vocabulary: 10,
        listening: 10,
        speaking: 5,
        reading: 10,
        writing: 5,
      },
    });

    return user;
  }

  /**
   * Track daily activity
   */
  trackDaily(userId: string, tracking: Omit<DailyTracking, "userId" | "date" | "loginTime">): DailyTracking {
    const today = new Date().toISOString().split("T")[0];
    const existing = this.tracking.get(userId) || [];
    
    const dailyTracking: DailyTracking = {
      userId,
      date: today,
      loginTime: Date.now(),
      ...tracking,
    };

    existing.push(dailyTracking);
    this.tracking.set(userId, existing);

    // Update user last active
    const user = this.users.get(userId);
    if (user) {
      user.lastActiveAt = Date.now();
    }

    // Update progress
    this.updateProgress(userId, dailyTracking);

    return dailyTracking;
  }

  /**
   * Update user progress
   */
  private updateProgress(userId: string, tracking: DailyTracking): void {
    const progress = this.progress.get(userId);
    if (!progress) return;

    // Update totals
    progress.totalStudyMinutes += tracking.studyMinutes;
    progress.totalWordsLearned += tracking.wordsLearned;

    // Update daily
    const lastTracked = this.tracking.get(userId) || [];
    if (lastTracked.length > 1) {
      const prevDay = lastTracked[lastTracked.length - 2];
      const prevDate = new Date(prevDay.date);
      const today = new Date(tracking.date);
      const diffDays = Math.floor((today.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        // Consecutive day
        progress.streak++;
        progress.bestStreak = Math.max(progress.bestStreak, progress.streak);
      } else if (diffDays > 1) {
        // Streak broken
        progress.streak = 1;
      }
    }

    // Update skills
    if (tracking.listeningScore) {
      progress.skills.listening = tracking.listeningScore;
    }
    if (tracking.speakingScore) {
      progress.skills.speaking = tracking.speakingScore;
    }
    if (tracking.readingScore) {
      progress.skills.reading = tracking.readingScore;
    }
    if (tracking.writingScore) {
      progress.skills.writing = tracking.writingScore;
    }
  }

  /**
   * Get user progress
   */
  getUserProgress(userId: string): UserProgress | null {
    return this.progress.get(userId) || null;
  }

  /**
   * Get all beta users
   */
  getAllUsers(): BetaUser[] {
    return Array.from(this.users.values());
  }

  /**
   * Get active users
   */
  getActiveUsers(): BetaUser[] {
    return this.getAllUsers().filter((u) => u.status === "active");
  }

  /**
   * Get user tracking history
   */
  getUserTracking(userId: string): DailyTracking[] {
    return this.tracking.get(userId) || [];
  }

  /**
   * Check for dropout
   */
  checkDropout(userId: string, daysInactive: number = 3): boolean {
    const user = this.users.get(userId);
    if (!user) return false;

    const lastActive = new Date(user.lastActiveAt);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays >= daysInactive) {
      user.status = "dropped";
      return true;
    }

    return false;
  }

  /**
   * Generate test report
   */
  generateReport(): BetaTestReport {
    const users = this.getAllUsers();
    const activeUsers = this.getActiveUsers();
    const droppedUsers = users.filter((u) => u.status === "dropped");

    // Calculate averages
    let totalStudyMinutes = 0;
    let totalWordsLearned = 0;
    let totalRetentionRate = 0;
    let countWithScores = 0;

    for (const userId of Array.from(this.tracking.keys())) {
      const tracking = this.tracking.get(userId) || [];
      for (const day of tracking) {
        totalStudyMinutes += day.studyMinutes;
        totalWordsLearned += day.wordsLearned;
        if (day.retentionRate) {
          totalRetentionRate += day.retentionRate;
          countWithScores++;
        }
      }
    }

    const averageStudyMinutes = users.length > 0 ? totalStudyMinutes / users.length : 0;
    const averageWordsLearned = users.length > 0 ? totalWordsLearned / users.length : 0;
    const averageRetentionRate = countWithScores > 0 ? totalRetentionRate / countWithScores : 0;
    const dropoutRate = users.length > 0 ? droppedUsers.length / users.length : 0;

    // Calculate effectiveness score
    const effectivenessScore = this.calculateEffectivenessScore();

    return {
      totalUsers: users.length,
      activeUsers: activeUsers.length,
      droppedUsers: droppedUsers.length,
      averageStudyMinutes,
      averageWordsLearned,
      averageRetentionRate,
      dropoutRate,
      commonDropoutReasons: ["too difficult", "no time", "not useful"],
      effectivenessScore,
      recommendations: this.generateRecommendations(),
    };
  }

  /**
   * Calculate effectiveness score
   */
  private calculateEffectivenessScore(): number {
    const users = this.getAllUsers();
    if (users.length === 0) return 0;

    let score = 0;

    // Factor 1: Retention rate (30%)
    let avgRetention = 0;
    let retentionCount = 0;
    for (const userId of Array.from(this.tracking.keys())) {
      const tracking = this.tracking.get(userId) || [];
      for (const day of tracking) {
        if (day.retentionRate) {
          avgRetention += day.retentionRate;
          retentionCount++;
        }
      }
    }
    if (retentionCount > 0) {
      score += (avgRetention / retentionCount) * 30;
    }

    // Factor 2: Study consistency (30%)
    const activeUsers = this.getActiveUsers();
    const consistencyRate = users.length > 0 ? activeUsers.length / users.length : 0;
    score += consistencyRate * 30;

    // Factor 3: Word learning (20%)
    let avgWords = 0;
    for (const progress of Array.from(this.progress.values())) {
      avgWords += progress.totalWordsLearned;
    }
    avgWords = users.length > 0 ? avgWords / users.length : 0;
    const wordScore = Math.min(avgWords / 300, 1); // 300 words in 30 days
    score += wordScore * 20;

    // Factor 4: Skill improvement (20%)
    let skillImprovement = 0;
    for (const progress of Array.from(this.progress.values())) {
      const skills = Object.values(progress.skills);
      const avgSkill = skills.reduce((a, b) => a + b, 0) / skills.length;
      skillImprovement += avgSkill;
    }
    skillImprovement = users.length > 0 ? skillImprovement / users.length : 0;
    score += (skillImprovement / 100) * 20;

    return Math.round(score);
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(): string[] {
    const recommendations: string[] = [];
    const users = this.getAllUsers();

    if (users.length < 10) {
      recommendations.push("Need more beta users for reliable data");
    }

    const dropoutRate = users.filter((u) => u.status === "dropped").length / users.length;
    if (dropoutRate > 0.3) {
      recommendations.push("High dropout rate - review onboarding and difficulty");
    }

    recommendations.push("Collect more user feedback on learning effectiveness");
    recommendations.push("Test audio quality on different devices");

    return recommendations;
  }

  /**
   * Export user data
   */
  exportUserData(userId: string): string {
    const user = this.users.get(userId);
    const tracking = this.tracking.get(userId) || [];
    const progress = this.progress.get(userId);

    return JSON.stringify({
      user,
      tracking,
      progress,
      exportDate: new Date().toISOString(),
    }, null, 2);
  }

  /**
   * Get daily summary
   */
  getDailySummary(date: string): {
    logins: number;
    totalStudyMinutes: number;
    wordsLearned: number;
    aiInteractions: number;
  } {
    let logins = 0;
    let totalStudyMinutes = 0;
    let wordsLearned = 0;
    let aiInteractions = 0;

    for (const tracking of Array.from(this.tracking.values())) {
      const dayTracking = tracking.find((t) => t.date === date);
      if (dayTracking) {
        logins++;
        totalStudyMinutes += dayTracking.studyMinutes;
        wordsLearned += dayTracking.wordsLearned;
        aiInteractions += dayTracking.aiInteractions;
      }
    }

    return { logins, totalStudyMinutes, wordsLearned, aiInteractions };
  }
}

// ============================================================
// Singleton Export
// ============================================================

export const betaTesting = new BetaTestingSystemV1();
