/**
 * Beta Production System v1
 *
 * Real user testing system for English360
 *
 * Features:
 * - User registration and profile
 * - Daily tracking
 * - Feedback collection
 * - Analytics
 * - Dropout detection
 */

// ============================================================
// Types
// ============================================================

export interface BetaUser {
  id: string;
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  location: string;
  englishLevel: "zero" | "beginner" | "elementary" | "intermediate";
  goal: string;
  dailyAvailableMinutes: number;
  registeredAt: number;
  lastActiveAt: number;
  status: "active" | "inactive" | "completed";
}

export interface DailyTracking {
  id: string;
  userId: string;
  date: string;
  loginTime: number;
  logoutTime?: number;
  studyDurationMinutes: number;
  completedLessons: number[];
  wordsLearned: number;
  reviewAccuracy: number;
  listeningScore: number;
  speakingPracticeCount: number;
  aiConversations: number;
  feedback?: DailyFeedback;
}

export interface DailyFeedback {
  difficulty: "easy" | "normal" | "hard";
  confused: string;
  useful: string;
  wantToContinue: boolean;
  rating: number; // 1-5
}

export interface WeeklyFeedback {
  userId: string;
  weekNumber: number;
  progressFeeling: "better" | "same" | "worse";
  motivation: "high" | "medium" | "low";
  mostUsefulFeature: string;
  biggestProblem: string;
  suggestions: string;
}

export interface BetaAnalytics {
  totalUsers: number;
  activeUsers: number;
  averageStudyMinutes: number;
  averageWordsLearned: number;
  retentionRate: number;
  completionRate: number;
  dropoutReasons: string[];
  topFeedback: string[];
}

// ============================================================
// Storage
// ============================================================

const STORAGE_KEYS = {
  USERS: "english360_beta_users",
  DAILY_TRACKING: "english360_daily_tracking",
  WEEKLY_FEEDBACK: "english360_weekly_feedback",
};

function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveToStorage(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Storage save failed:", e);
  }
}

// ============================================================
// Beta Production System
// ============================================================

export class BetaProductionSystem {
  /**
   * Register a new beta user
   */
  registerUser(userData: Omit<BetaUser, "id" | "registeredAt" | "lastActiveAt" | "status">): BetaUser {
    const users = loadFromStorage<BetaUser[]>(STORAGE_KEYS.USERS, []);

    const newUser: BetaUser = {
      ...userData,
      id: `beta_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      registeredAt: Date.now(),
      lastActiveAt: Date.now(),
      status: "active",
    };

    users.push(newUser);
    saveToStorage(STORAGE_KEYS.USERS, users);

    return newUser;
  }

  /**
   * Get user by ID
   */
  getUser(userId: string): BetaUser | undefined {
    const users = loadFromStorage<BetaUser[]>(STORAGE_KEYS.USERS, []);
    return users.find(u => u.id === userId);
  }

  /**
   * Update user status
   */
  updateUserStatus(userId: string, status: BetaUser["status"]): void {
    const users = loadFromStorage<BetaUser[]>(STORAGE_KEYS.USERS, []);
    const user = users.find(u => u.id === userId);
    if (user) {
      user.status = status;
      user.lastActiveAt = Date.now();
      saveToStorage(STORAGE_KEYS.USERS, users);
    }
  }

  /**
   * Track daily activity
   */
  trackDailyActivity(tracking: Omit<DailyTracking, "id">): DailyTracking {
    const trackings = loadFromStorage<DailyTracking[]>(STORAGE_KEYS.DAILY_TRACKING, []);

    const newTracking: DailyTracking = {
      ...tracking,
      id: `track_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

    trackings.push(newTracking);
    saveToStorage(STORAGE_KEYS.DAILY_TRACKING, trackings);

    // Update user's last active time
    this.updateUserStatus(tracking.userId, "active");

    return newTracking;
  }

  /**
   * Get daily tracking for a user
   */
  getDailyTrackings(userId: string, days: number = 30): DailyTracking[] {
    const trackings = loadFromStorage<DailyTracking[]>(STORAGE_KEYS.DAILY_TRACKING, []);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return trackings
      .filter(t => t.userId === userId && new Date(t.date) >= cutoffDate)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  /**
   * Submit daily feedback
   */
  submitDailyFeedback(userId: string, date: string, feedback: DailyFeedback): void {
    const trackings = loadFromStorage<DailyTracking[]>(STORAGE_KEYS.DAILY_TRACKING, []);
    const tracking = trackings.find(t => t.userId === userId && t.date === date);

    if (tracking) {
      tracking.feedback = feedback;
      saveToStorage(STORAGE_KEYS.DAILY_TRACKING, trackings);
    }
  }

  /**
   * Submit weekly feedback
   */
  submitWeeklyFeedback(feedback: WeeklyFeedback): void {
    const feedbacks = loadFromStorage<WeeklyFeedback[]>(STORAGE_KEYS.WEEKLY_FEEDBACK, []);
    feedbacks.push(feedback);
    saveToStorage(STORAGE_KEYS.WEEKLY_FEEDBACK, feedbacks);
  }

  /**
   * Get analytics
   */
  getAnalytics(): BetaAnalytics {
    const users = loadFromStorage<BetaUser[]>(STORAGE_KEYS.USERS, []);
    const trackings = loadFromStorage<DailyTracking[]>(STORAGE_KEYS.DAILY_TRACKING, []);

    const activeUsers = users.filter(u => u.status === "active").length;
    const totalStudyMinutes = trackings.reduce((sum, t) => sum + t.studyDurationMinutes, 0);
    const totalWords = trackings.reduce((sum, t) => sum + t.wordsLearned, 0);
    const usersWithFeedback = trackings.filter(t => t.feedback).length;

    // Calculate retention (users active in last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentTrackings = trackings.filter(t => new Date(t.date) >= sevenDaysAgo);
    const activeUserIds = new Set(recentTrackings.map(t => t.userId));
    const retentionRate = users.length > 0 ? (activeUserIds.size / users.length) * 100 : 0;

    // Dropout reasons from feedback
    const dropoutReasons: string[] = [];
    const feedbacks = loadFromStorage<WeeklyFeedback[]>(STORAGE_KEYS.WEEKLY_FEEDBACK, []);
    feedbacks.forEach(f => {
      if (f.biggestProblem) {
        dropoutReasons.push(f.biggestProblem);
      }
    });

    return {
      totalUsers: users.length,
      activeUsers,
      averageStudyMinutes: users.length > 0 ? Math.round(totalStudyMinutes / users.length) : 0,
      averageWordsLearned: users.length > 0 ? Math.round(totalWords / users.length) : 0,
      retentionRate: Math.round(retentionRate),
      completionRate: Math.round((usersWithFeedback / Math.max(trackings.length, 1)) * 100),
      dropoutReasons: [...new Set(dropoutReasons)].slice(0, 5),
      topFeedback: [],
    };
  }

  /**
   * Detect at-risk users (potential dropouts)
   */
  detectAtRiskUsers(): BetaUser[] {
    const users = loadFromStorage<BetaUser[]>(STORAGE_KEYS.USERS, []);
    const trackings = loadFromStorage<DailyTracking[]>(STORAGE_KEYS.DAILY_TRACKING, []);

    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const atRiskUsers: BetaUser[] = [];

    for (const user of users) {
      if (user.status !== "active") continue;

      const userTrackings = trackings.filter(t => t.userId === user.id);
      const recentTrackings = userTrackings.filter(t => new Date(t.date) >= threeDaysAgo);

      // At risk if no activity in 3 days
      if (recentTrackings.length === 0) {
        atRiskUsers.push(user);
      }
    }

    return atRiskUsers;
  }

  /**
   * Get user progress summary
   */
  getUserProgress(userId: string): {
    totalStudyMinutes: number;
    totalWordsLearned: number;
    averageAccuracy: number;
    currentStreak: number;
    daysActive: number;
  } {
    const trackings = this.getDailyTrackings(userId, 365);

    let totalStudyMinutes = 0;
    let totalWordsLearned = 0;
    let totalAccuracy = 0;
    let accuracyCount = 0;
    let currentStreak = 0;
    let lastDate: string | null = null;

    // Sort by date ascending for streak calculation
    const sortedTrackings = [...trackings].sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    for (const tracking of sortedTrackings) {
      totalStudyMinutes += tracking.studyDurationMinutes;
      totalWordsLearned += tracking.wordsLearned;
      totalAccuracy += tracking.reviewAccuracy;
      accuracyCount++;

      // Streak calculation
      if (lastDate) {
        const prevDate = new Date(lastDate);
        const currDate = new Date(tracking.date);
        const diffDays = Math.round((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          currentStreak++;
        } else if (diffDays > 1) {
          currentStreak = 1;
        }
      } else {
        currentStreak = 1;
      }
      lastDate = tracking.date;
    }

    return {
      totalStudyMinutes,
      totalWordsLearned,
      averageAccuracy: accuracyCount > 0 ? Math.round(totalAccuracy / accuracyCount) : 0,
      currentStreak,
      daysActive: trackings.length,
    };
  }
}

// ============================================================
// Factory Function
// ============================================================

export function createBetaProductionSystem(): BetaProductionSystem {
  return new BetaProductionSystem();
}

export default BetaProductionSystem;
