/**
 * Daily AI Coach v2 — Enhanced Learning Loop
 *
 * Generates personalized daily learning missions based on:
 * - SRS review schedule
 * - Previous day completion
 * - Skill weakness analysis
 * - Learning goals
 * - Time availability
 *
 * Flow:
 * Open App → Read User State → Analyze → Generate Mission → Learn → Feedback → Adjust
 */

// ============================================================
// Types
// ============================================================

export type MissionActivity =
  | "srs_review"
  | "listening_input"
  | "shadowing"
  | "conversation"
  | "reading"
  | "writing"
  | "grammar"
  | "pronunciation"
  | "vocabulary_new"
  | "assessment";

export interface DailyMission {
  id: string;
  userId: string;
  day: number;
  date: string;

  // Activities
  activities: MissionActivityItem[];

  // Time allocation
  totalTimeMinutes: number;

  // Focus areas
  focusAreas: string[];

  // Difficulty
  difficulty: "easy" | "normal" | "hard";

  // Audio speed
  audioSpeed: "slow" | "normal" | "fast";

  // Status
  completed: boolean;
  completedActivities: string[];
  score: number;

  // Metadata
  createdAt: number;
  updatedAt: number;
}

export interface MissionActivityItem {
  id: string;
  type: MissionActivity;
  title: string;
  titleChinese: string;
  description: string;
  descriptionChinese: string;
  durationMinutes: number;
  priority: "high" | "medium" | "low";
  content: ActivityContent;
  completed: boolean;
  score?: number;
}

export interface ActivityContent {
  // For SRS review
  reviewWords?: string[];
  reviewCount?: number;

  // For listening
  listeningContentId?: string;
  listeningDuration?: number;

  // For shadowing
  shadowingText?: string;
  shadowingDuration?: number;

  // For conversation
  conversationTopic?: string;
  conversationLevel?: string;

  // For reading
  readingContentId?: string;
  readingDuration?: number;

  // For writing
  writingTask?: string;
  writingDuration?: number;

  // For grammar
  grammarPointId?: string;
  grammarDuration?: number;

  // For pronunciation
  pronunciationWords?: string[];
  pronunciationDuration?: number;

  // For vocabulary
  newWords?: string[];
  newWordsCount?: number;
}

export interface LearnerProfile {
  userId: string;
  currentDay: number;
  level: "A1" | "A2" | "B1" | "B2";
  vocabularyLevel: number;
  listeningLevel: number;
  speakingLevel: number;
  grammarLevel: number;
  readingLevel: number;
  writingLevel: number;
  pronunciationLevel: number;
  weakAreas: string[];
  strongAreas: string[];
  wordsLearned: number;
  wordsMastered: number;
  retentionRate: number;
  studyStreak: number;
  dailyGoalMinutes: number;
  yesterdayCompleted: string[];
  yesterdayScore: number;
}

export interface DailyCoachStats {
  totalMissions: number;
  completedMissions: number;
  averageScore: number;
  totalStudyMinutes: number;
  currentStreak: number;
  bestStreak: number;
}

// ============================================================
// Daily AI Coach Engine v2
// ============================================================

export class DailyCoachEngineV2 {
  private missions: Map<string, DailyMission> = new Map();
  private missionCounter: Map<string, number> = new Map();

  /**
   * Generate daily mission
   */
  generateMission(profile: LearnerProfile): DailyMission {
    const today = new Date().toISOString().split("T")[0];
    const counter = this.missionCounter.get(profile.userId) || 0;
    this.missionCounter.set(profile.userId, counter + 1);
    const missionId = `mission_${profile.userId}_${today}_${counter}`;

    // Calculate time allocation based on profile
    const timeAllocation = this.calculateTimeAllocation(profile);

    // Generate activities
    const activities = this.generateActivities(profile, timeAllocation);

    // Determine focus areas
    const focusAreas = this.determineFocusAreas(profile);

    // Determine difficulty
    const difficulty = this.determineDifficulty(profile);

    // Determine audio speed
    const audioSpeed = this.determineAudioSpeed(profile);

    const mission: DailyMission = {
      id: missionId,
      userId: profile.userId,
      day: profile.currentDay,
      date: today,
      activities,
      totalTimeMinutes: profile.dailyGoalMinutes,
      focusAreas,
      difficulty,
      audioSpeed,
      completed: false,
      completedActivities: [],
      score: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.missions.set(missionId, mission);
    return mission;
  }

  /**
   * Calculate time allocation based on learner profile
   */
  private calculateTimeAllocation(profile: LearnerProfile): Record<MissionActivity, number> {
    const totalMinutes = profile.dailyGoalMinutes;

    // Base allocation (240 minutes total)
    const allocation: Record<MissionActivity, number> = {
      srs_review: 30,
      listening_input: 45,
      shadowing: 30,
      conversation: 30,
      reading: 30,
      writing: 15,
      grammar: 20,
      pronunciation: 15,
      vocabulary_new: 20,
      assessment: 5,
    };

    // Adjust based on weak areas (safe for undefined)
    const weak = profile.weakAreas || [];
    if (weak.includes("listening")) {
      allocation.listening_input += 15;
      allocation.shadowing += 10;
    }
    if (weak.includes("speaking")) {
      allocation.conversation += 15;
      allocation.pronunciation += 10;
    }
    if (weak.includes("vocabulary")) {
      allocation.vocabulary_new += 10;
      allocation.srs_review += 10;
    }
    if (weak.includes("grammar")) {
      allocation.grammar += 10;
    }

    // Adjust based on yesterday's performance
    if (profile.yesterdayScore < 60) {
      // Reduce new content, increase review
      allocation.vocabulary_new -= 5;
      allocation.srs_review += 5;
      allocation.listening_input += 5;
    } else if (profile.yesterdayScore > 85) {
      // Increase challenge
      allocation.vocabulary_new += 5;
      allocation.conversation += 5;
    }

    // Normalize to total time
    const currentTotal = Object.values(allocation).reduce((a, b) => a + b, 0);
    const factor = totalMinutes / currentTotal;
    for (const key of Object.keys(allocation) as MissionActivity[]) {
      allocation[key] = Math.round(allocation[key] * factor);
    }

    return allocation;
  }

  /**
   * Generate activities based on time allocation
   */
  private generateActivities(
    profile: LearnerProfile,
    timeAllocation: Record<MissionActivity, number>
  ): MissionActivityItem[] {
    const activities: MissionActivityItem[] = [];

    // SRS Review
    activities.push({
      id: "act_srs",
      type: "srs_review",
      title: "SRS Review",
      titleChinese: "SRS复习",
      description: "Review vocabulary due for repetition",
      descriptionChinese: "复习需要重复的词汇",
      durationMinutes: timeAllocation.srs_review,
      priority: "high",
      content: {
        reviewCount: Math.max(10, 20 - profile.wordsMastered / 10),
      },
      completed: false,
    });

    // Listening Input
    activities.push({
      id: "act_listening",
      type: "listening_input",
      title: "Listening Practice",
      titleChinese: "听力练习",
      description: "Listen to level-appropriate content",
      descriptionChinese: "听适合你水平的内容",
      durationMinutes: timeAllocation.listening_input,
      priority: "high",
      content: {
        listeningDuration: timeAllocation.listening_input,
      },
      completed: false,
    });

    // Shadowing
    activities.push({
      id: "act_shadowing",
      type: "shadowing",
      title: "Shadowing Practice",
      titleChinese: "跟读练习",
      description: "Listen and repeat after native speaker",
      descriptionChinese: "听母语者说话并跟读",
      durationMinutes: timeAllocation.shadowing,
      priority: "high",
      content: {
        shadowingDuration: timeAllocation.shadowing,
      },
      completed: false,
    });

    // Conversation
    activities.push({
      id: "act_conversation",
      type: "conversation",
      title: "Conversation Practice",
      titleChinese: "对话练习",
      description: "Practice speaking with AI tutor",
      descriptionChinese: "与AI导师练习口语",
      durationMinutes: timeAllocation.conversation,
      priority: "high",
      content: {
        conversationTopic: this.getConversationTopic(profile),
        conversationLevel: profile.level,
      },
      completed: false,
    });

    // Reading
    activities.push({
      id: "act_reading",
      type: "reading",
      title: "Reading Practice",
      titleChinese: "阅读练习",
      description: "Read level-appropriate passages",
      descriptionChinese: "阅读适合你水平的文章",
      durationMinutes: timeAllocation.reading,
      priority: "medium",
      content: {
        readingDuration: timeAllocation.reading,
      },
      completed: false,
    });

    // Writing
    activities.push({
      id: "act_writing",
      type: "writing",
      title: "Writing Practice",
      titleChinese: "写作练习",
      description: "Write sentences or short paragraphs",
      descriptionChinese: "写句子或短段落",
      durationMinutes: timeAllocation.writing,
      priority: "medium",
      content: {
        writingTask: this.getWritingTask(profile),
        writingDuration: timeAllocation.writing,
      },
      completed: false,
    });

    // Grammar
    activities.push({
      id: "act_grammar",
      type: "grammar",
      title: "Grammar Practice",
      titleChinese: "语法练习",
      description: "Learn and practice grammar points",
      descriptionChinese: "学习和练习语法点",
      durationMinutes: timeAllocation.grammar,
      priority: "medium",
      content: {
        grammarDuration: timeAllocation.grammar,
      },
      completed: false,
    });

    // Pronunciation
    activities.push({
      id: "act_pronunciation",
      type: "pronunciation",
      title: "Pronunciation Practice",
      titleChinese: "发音练习",
      description: "Practice pronunciation of difficult sounds",
      descriptionChinese: "练习难发的音",
      durationMinutes: timeAllocation.pronunciation,
      priority: "medium",
      content: {
        pronunciationDuration: timeAllocation.pronunciation,
      },
      completed: false,
    });

    // Vocabulary New
    activities.push({
      id: "act_vocabulary",
      type: "vocabulary_new",
      title: "New Vocabulary",
      titleChinese: "新词汇",
      description: "Learn new vocabulary words",
      descriptionChinese: "学习新词汇",
      durationMinutes: timeAllocation.vocabulary_new,
      priority: "high",
      content: {
        newWordsCount: this.calculateNewWordsCount(profile),
      },
      completed: false,
    });

    return activities;
  }

  /**
   * Get conversation topic based on level and progress
   */
  private getConversationTopic(profile: LearnerProfile): string {
    const topics: Record<string, string[]> = {
      A1: ["greetings", "self-introduction", "family", "daily-routine"],
      A2: ["shopping", "food", "transportation", "weather"],
      B1: ["work", "hobbies", "travel", "opinions"],
      B2: ["current-events", "culture", "abstract-topics"],
    };

    const levelTopics = topics[profile.level] || topics.A1;
    return levelTopics[Math.floor(Math.random() * levelTopics.length)];
  }

  /**
   * Get writing task based on level
   */
  private getWritingTask(profile: LearnerProfile): string {
    const tasks: Record<string, string[]> = {
      A1: ["Write 3 sentences about your day", "Write your name and age", "Write 5 food words"],
      A2: ["Write a short paragraph about your family", "Write a shopping list", "Write about your hobby"],
      B1: ["Write an email to a friend", "Write about a past event", "Write your opinion on a topic"],
      B2: ["Write a formal letter", "Write a news summary", "Write a story"],
    };

    const levelTasks = tasks[profile.level] || tasks.A1;
    return levelTasks[Math.floor(Math.random() * levelTasks.length)];
  }

  /**
   * Calculate new words count based on retention and level
   */
  private calculateNewWordsCount(profile: LearnerProfile): number {
    let count = 10;

    // Adjust based on retention
    if (profile.retentionRate < 0.6) {
      count = 5;
    } else if (profile.retentionRate > 0.8) {
      count = 15;
    }

    // Adjust based on study time
    if (profile.dailyGoalMinutes < 120) {
      count = Math.max(5, count - 3);
    } else if (profile.dailyGoalMinutes > 300) {
      count = Math.min(20, count + 3);
    }

    // Adjust based on level
    if (profile.level === "A1") {
      count = Math.min(count, 8); // Beginners learn fewer words
    }

    return count;
  }

  /**
   * Determine focus areas
   */
  private determineFocusAreas(profile: LearnerProfile): string[] {
    const focusAreas: string[] = [];

    // Add weak areas (safe for undefined)
    const weakAreas = profile.weakAreas || [];
    const strongAreas = profile.strongAreas || [];
    focusAreas.push(...weakAreas.slice(0, 3));

    // Add maintenance for strong areas
    if (focusAreas.length < 3) {
      focusAreas.push(...strongAreas.slice(0, 3 - focusAreas.length));
    }

    // Add level-specific focus
    if (profile.level === "A1") {
      focusAreas.push("pronunciation");
    }

    return focusAreas.slice(0, 5);
  }

  /**
   * Determine difficulty
   */
  private determineDifficulty(profile: LearnerProfile): "easy" | "normal" | "hard" {
    const avgScore =
      (profile.vocabularyLevel +
        profile.listeningLevel +
        profile.speakingLevel +
        profile.grammarLevel) /
      4;

    if (avgScore < 40) return "easy";
    if (avgScore < 70) return "normal";
    return "hard";
  }

  /**
   * Determine audio speed
   */
  private determineAudioSpeed(profile: LearnerProfile): "slow" | "normal" | "fast" {
    if (profile.listeningLevel < 40) return "slow";
    if (profile.listeningLevel < 70) return "normal";
    return "fast";
  }

  /**
   * Complete activity
   */
  completeActivity(missionId: string, activityId: string, score: number): void {
    const mission = this.missions.get(missionId);
    if (!mission) {
      throw new Error(`Mission not found: ${missionId}`);
    }

    const activity = mission.activities.find((a) => a.id === activityId);
    if (!activity) {
      throw new Error(`Activity not found: ${activityId}`);
    }

    activity.completed = true;
    activity.score = score;
    mission.completedActivities.push(activityId);

    // Update mission score
    const completedActivities = mission.activities.filter((a) => a.completed);
    mission.score =
      completedActivities.reduce((sum, a) => sum + (a.score || 0), 0) /
      completedActivities.length;

    // Check if mission is complete
    if (completedActivities.length === mission.activities.length) {
      mission.completed = true;
    }

    mission.updatedAt = Date.now();
  }

  /**
   * Get mission
   */
  getMission(missionId: string): DailyMission | undefined {
    return this.missions.get(missionId);
  }

  /**
   * Get user missions
   */
  getUserMissions(userId: string): DailyMission[] {
    return Array.from(this.missions.values())
      .filter((m) => m.userId === userId)
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  /**
   * Get mission stats
   */
  getMissionStats(userId: string): DailyCoachStats {
    const missions = this.getUserMissions(userId);
    const completed = missions.filter((m) => m.completed);

    return {
      totalMissions: missions.length,
      completedMissions: completed.length,
      averageScore:
        completed.length > 0
          ? completed.reduce((sum, m) => sum + m.score, 0) / completed.length
          : 0,
      totalStudyMinutes: missions.reduce((sum, m) => sum + m.totalTimeMinutes, 0),
      currentStreak: this.calculateStreak(missions),
      bestStreak: this.calculateBestStreak(missions),
    };
  }

  /**
   * Calculate current streak
   */
  private calculateStreak(missions: DailyMission[]): number {
    if (missions.length === 0) return 0;

    let streak = 0;
    const today = new Date().toISOString().split("T")[0];
    const checkDate = new Date(today);

    for (const mission of missions) {
      const missionDate = mission.date;
      const expectedDate = checkDate.toISOString().split("T")[0];

      if (missionDate === expectedDate && mission.completed) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else if (missionDate < expectedDate) {
        break;
      }
    }

    return streak;
  }

  /**
   * Calculate best streak
   */
  private calculateBestStreak(missions: DailyMission[]): number {
    if (missions.length === 0) return 0;

    const completedMissions = missions
      .filter((m) => m.completed)
      .sort((a, b) => a.date.localeCompare(b.date));

    let bestStreak = 0;
    let currentStreak = 0;
    let lastDate = "";

    for (const mission of completedMissions) {
      if (lastDate === "" || mission.date === lastDate) {
        currentStreak++;
      } else {
        const prevDate = new Date(lastDate);
        prevDate.setDate(prevDate.getDate() + 1);
        if (mission.date === prevDate.toISOString().split("T")[0]) {
          currentStreak++;
        } else {
          currentStreak = 1;
        }
      }

      bestStreak = Math.max(bestStreak, currentStreak);
      lastDate = mission.date;
    }

    return bestStreak;
  }
}

// ============================================================
// Factory function
// ============================================================

export function createDailyCoach(): DailyCoachEngineV2 {
  return new DailyCoachEngineV2();
}
