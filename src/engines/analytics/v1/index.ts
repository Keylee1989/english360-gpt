/**
 * Analytics Engine v1
 *
 * Tracks and analyzes:
 * - Completion rates
 * - Drop-off points
 * - Most effective activities
 * - Learning time distribution
 * - User engagement patterns
 */

// ============================================================
// Types
// ============================================================

export interface AnalyticsEvent {
  id: string;
  userId: string;
  eventType: EventType;
  timestamp: number;
  data: Record<string, unknown>;
}

export type EventType =
  | "lesson_start"
  | "lesson_complete"
  | "activity_start"
  | "activity_complete"
  | "vocabulary_learn"
  | "vocabulary_review"
  | "listening_practice"
  | "speaking_practice"
  | "reading_practice"
  | "writing_practice"
  | "assessment_start"
  | "assessment_complete"
  | "session_start"
  | "session_end"
  | "app_open"
  | "app_close";

export interface UserAnalytics {
  userId: string;
  period: "day" | "week" | "month" | "total";

  // Engagement
  totalSessions: number;
  averageSessionMinutes: number;
  totalStudyMinutes: number;
  studyDays: number;
  streakDays: number;

  // Completion
  lessonsStarted: number;
  lessonsCompleted: number;
  completionRate: number;

  // Activities
  activitiesStarted: number;
  activitiesCompleted: number;
  activityCompletionRate: number;

  // Skills
  vocabularyLearned: number;
  vocabularyReviewed: number;
  listeningMinutes: number;
  speakingMinutes: number;
  readingMinutes: number;
  writingMinutes: number;

  // Performance
  averageScore: number;
  improvementRate: number;
  strongSkills: string[];
  weakSkills: string[];

  // Patterns
  mostActiveTime: string;
  mostEffectiveActivity: string;
  commonDropOffPoint: string;
}

export interface EngagementPattern {
  type: "consistent" | "sporadic" | "declining" | "intensive";
  description: string;
  descriptionChinese: string;
  recommendation: string;
}

export interface EffectivenessMetric {
  activity: string;
  averageScore: number;
  completionRate: number;
  timeSpent: number;
  effectiveness: number; // 0-1
}

// ============================================================
// Analytics Engine
// ============================================================

export class AnalyticsEngineV1 {
  private events: Map<string, AnalyticsEvent[]> = new Map();

  /**
   * Record event
   */
  recordEvent(event: AnalyticsEvent): void {
    const userEvents = this.events.get(event.userId) || [];
    userEvents.push(event);
    this.events.set(event.userId, userEvents);
  }

  /**
   * Get user analytics
   */
  getUserAnalytics(userId: string, period: "day" | "week" | "month" | "total" = "total"): UserAnalytics {
    const events = this.events.get(userId) || [];
    const filteredEvents = this.filterByPeriod(events, period);

    // Calculate engagement metrics
    const totalSessions = filteredEvents.filter(e => e.eventType === "session_start").length;
    const sessionDurations = this.calculateSessionDurations(filteredEvents);
    const averageSessionMinutes = sessionDurations.length > 0
      ? sessionDurations.reduce((a, b) => a + b, 0) / sessionDurations.length
      : 0;
    const totalStudyMinutes = sessionDurations.reduce((a, b) => a + b, 0);
    const studyDays = new Set(filteredEvents.map(e => new Date(e.timestamp).toDateString())).size;
    const streakDays = this.calculateStreak(filteredEvents);

    // Calculate completion metrics
    const lessonsStarted = filteredEvents.filter(e => e.eventType === "lesson_start").length;
    const lessonsCompleted = filteredEvents.filter(e => e.eventType === "lesson_complete").length;
    const completionRate = lessonsStarted > 0 ? lessonsCompleted / lessonsStarted : 0;

    const activitiesStarted = filteredEvents.filter(e => e.eventType === "activity_start").length;
    const activitiesCompleted = filteredEvents.filter(e => e.eventType === "activity_complete").length;
    const activityCompletionRate = activitiesStarted > 0 ? activitiesCompleted / activitiesStarted : 0;

    // Calculate skill metrics
    const vocabularyLearned = filteredEvents.filter(e => e.eventType === "vocabulary_learn").length;
    const vocabularyReviewed = filteredEvents.filter(e => e.eventType === "vocabulary_review").length;
    const listeningMinutes = this.calculateMinutesByType(filteredEvents, "listening_practice");
    const speakingMinutes = this.calculateMinutesByType(filteredEvents, "speaking_practice");
    const readingMinutes = this.calculateMinutesByType(filteredEvents, "reading_practice");
    const writingMinutes = this.calculateMinutesByType(filteredEvents, "writing_practice");

    // Calculate performance metrics
    const scores = filteredEvents
      .filter(e => e.eventType === "activity_complete" && typeof e.data.score === "number")
      .map(e => e.data.score as number);
    const averageScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

    // Identify patterns
    const strongSkills = this.identifyStrongSkills(filteredEvents);
    const weakSkills = this.identifyWeakSkills(filteredEvents);
    const mostActiveTime = this.identifyMostActiveTime(filteredEvents);
    const mostEffectiveActivity = this.identifyMostEffectiveActivity(filteredEvents);
    const commonDropOffPoint = this.identifyCommonDropOff(filteredEvents);

    return {
      userId,
      period,
      totalSessions,
      averageSessionMinutes,
      totalStudyMinutes,
      studyDays,
      streakDays,
      lessonsStarted,
      lessonsCompleted,
      completionRate,
      activitiesStarted,
      activitiesCompleted,
      activityCompletionRate,
      vocabularyLearned,
      vocabularyReviewed,
      listeningMinutes,
      speakingMinutes,
      readingMinutes,
      writingMinutes,
      averageScore,
      improvementRate: 0,
      strongSkills,
      weakSkills,
      mostActiveTime,
      mostEffectiveActivity,
      commonDropOffPoint,
    };
  }

  /**
   * Filter events by period
   */
  private filterByPeriod(events: AnalyticsEvent[], period: string): AnalyticsEvent[] {
    const now = Date.now();
    let cutoff: number;

    switch (period) {
      case "day":
        cutoff = now - 24 * 60 * 60 * 1000;
        break;
      case "week":
        cutoff = now - 7 * 24 * 60 * 60 * 1000;
        break;
      case "month":
        cutoff = now - 30 * 24 * 60 * 60 * 1000;
        break;
      default:
        return events;
    }

    return events.filter(e => e.timestamp >= cutoff);
  }

  /**
   * Calculate session durations
   */
  private calculateSessionDurations(events: AnalyticsEvent[]): number[] {
    const durations: number[] = [];
    let sessionStart: number | null = null;

    for (const event of events.sort((a, b) => a.timestamp - b.timestamp)) {
      if (event.eventType === "session_start") {
        sessionStart = event.timestamp;
      } else if (event.eventType === "session_end" && sessionStart) {
        durations.push((event.timestamp - sessionStart) / 60000);
        sessionStart = null;
      }
    }

    return durations;
  }

  /**
   * Calculate streak
   */
  private calculateStreak(events: AnalyticsEvent[]): number {
    const dates = [...new Set(events.map(e => new Date(e.timestamp).toDateString()))].sort();
    let streak = 0;
    let currentDate = new Date();

    for (let i = dates.length - 1; i >= 0; i--) {
      const eventDate = new Date(dates[i]);
      const diffDays = Math.floor((currentDate.getTime() - eventDate.getTime()) / (24 * 60 * 60 * 1000));

      if (diffDays <= 1) {
        streak++;
        currentDate = eventDate;
      } else {
        break;
      }
    }

    return streak;
  }

  /**
   * Calculate minutes by type
   */
  private calculateMinutesByType(events: AnalyticsEvent[], type: EventType): number {
    return events
      .filter(e => e.eventType === type && typeof e.data.duration === "number")
      .reduce((sum, e) => sum + (e.data.duration as number), 0);
  }

  /**
   * Identify strong skills
   */
  private identifyStrongSkills(events: AnalyticsEvent[]): string[] {
    const skillScores: Record<string, number[]> = {};

    for (const event of events) {
      if (event.eventType === "activity_complete" && typeof event.data.skill === "string") {
        const skill = event.data.skill as string;
        const score = event.data.score as number;
        if (!skillScores[skill]) skillScores[skill] = [];
        skillScores[skill].push(score);
      }
    }

    return Object.entries(skillScores)
      .filter(([, scores]) => {
        const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
        return avg >= 0.8;
      })
      .map(([skill]) => skill);
  }

  /**
   * Identify weak skills
   */
  private identifyWeakSkills(events: AnalyticsEvent[]): string[] {
    const skillScores: Record<string, number[]> = {};

    for (const event of events) {
      if (event.eventType === "activity_complete" && typeof event.data.skill === "string") {
        const skill = event.data.skill as string;
        const score = event.data.score as number;
        if (!skillScores[skill]) skillScores[skill] = [];
        skillScores[skill].push(score);
      }
    }

    return Object.entries(skillScores)
      .filter(([, scores]) => {
        const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
        return avg < 0.6;
      })
      .map(([skill]) => skill);
  }

  /**
   * Identify most active time
   */
  private identifyMostActiveTime(events: AnalyticsEvent[]): string {
    const hourCounts: Record<number, number> = {};

    for (const event of events) {
      const hour = new Date(event.timestamp).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    }

    const maxHour = Object.entries(hourCounts).sort(([, a], [, b]) => b - a)[0];
    return maxHour ? `${maxHour[0]}:00` : "Unknown";
  }

  /**
   * Identify most effective activity
   */
  private identifyMostEffectiveActivity(events: AnalyticsEvent[]): string {
    const activityScores: Record<string, number[]> = {};

    for (const event of events) {
      if (event.eventType === "activity_complete") {
        const activity = (event.data.activity as string) || "unknown";
        const score = (event.data.score as number) || 0;
        if (!activityScores[activity]) activityScores[activity] = [];
        activityScores[activity].push(score);
      }
    }

    const sorted = Object.entries(activityScores)
      .map(([activity, scores]) => ({
        activity,
        avg: scores.reduce((a, b) => a + b, 0) / scores.length,
      }))
      .sort((a, b) => b.avg - a.avg);

    return sorted[0]?.activity || "Unknown";
  }

  /**
   * Identify common drop-off point
   */
  private identifyCommonDropOff(events: AnalyticsEvent[]): string {
    const dropOffs: Record<string, number> = {};

    for (let i = 0; i < events.length - 1; i++) {
      const current = events[i];
      const next = events[i + 1];

      if (current.eventType === "activity_start" && next.eventType === "session_end") {
        const activity = (current.data.activity as string) || "unknown";
        dropOffs[activity] = (dropOffs[activity] || 0) + 1;
      }
    }

    const sorted = Object.entries(dropOffs).sort(([, a], [, b]) => b - a);
    return sorted[0]?.[0] || "Unknown";
  }

  /**
   * Get engagement patterns
   */
  getEngagementPatterns(userId: string): EngagementPattern[] {
    const events = this.events.get(userId) || [];
    const patterns: EngagementPattern[] = [];

    if (events.length < 10) {
      return patterns;
    }

    // Check consistency
    const dates = [...new Set(events.map(e => new Date(e.timestamp).toDateString()))];
    if (dates.length > 20) {
      patterns.push({
        type: "consistent",
        description: "Regular study pattern",
        descriptionChinese: "规律的学习模式",
        recommendation: "Continue your great habit!",
      });
    }

    // Check for decline
    const recentEvents = events.filter(e => e.timestamp > Date.now() - 7 * 24 * 60 * 60 * 1000);
    const olderEvents = events.filter(e => e.timestamp <= Date.now() - 7 * 24 * 60 * 60 * 1000);

    if (recentEvents.length < olderEvents.length * 0.5) {
      patterns.push({
        type: "declining",
        description: "Study time decreasing",
        descriptionChinese: "学习时间减少",
        recommendation: "Try to maintain your study schedule",
      });
    }

    return patterns;
  }

  /**
   * Get effectiveness metrics
   */
  getEffectivenessMetrics(userId: string): EffectivenessMetric[] {
    const events = this.events.get(userId) || [];
    const activityData: Record<string, { scores: number[]; time: number; completions: number }> = {};

    for (const event of events) {
      if (event.eventType === "activity_complete") {
        const activity = (event.data.activity as string) || "unknown";
        if (!activityData[activity]) {
          activityData[activity] = { scores: [], time: 0, completions: 0 };
        }
        activityData[activity].completions++;
        if (typeof event.data.score === "number") {
          activityData[activity].scores.push(event.data.score);
        }
        if (typeof event.data.duration === "number") {
          activityData[activity].time += event.data.duration;
        }
      }
    }

    return Object.entries(activityData).map(([activity, data]) => ({
      activity,
      averageScore: data.scores.length > 0
        ? data.scores.reduce((a, b) => a + b, 0) / data.scores.length
        : 0,
      completionRate: data.completions > 0 ? data.completions / data.completions : 1,
      timeSpent: data.time,
      effectiveness: data.scores.length > 0
        ? data.scores.reduce((a, b) => a + b, 0) / data.scores.length
        : 0,
    }));
  }
}
