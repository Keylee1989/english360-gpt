/**
 * Learner Model v1
 * 
 * Purpose: Track learner profile and generate personalized recommendations
 * 
 * Features:
 * - Comprehensive skill tracking
 * - Weak area identification
 * - Daily recommendation generation
 * - Progress visualization
 * - Adaptive time allocation
 */

// ============================================================
// Types
// ============================================================

export interface LearnerProfileV1 {
  userId: string;
  
  // Skill levels (0-100)
  vocabularyLevel: number;
  listeningLevel: number;
  speakingLevel: number;
  pronunciationLevel: number;
  grammarLevel: number;
  readingLevel: number;
  writingLevel: number;
  
  // Overall metrics
  overallLevel: number;
  retentionRate: number; // 0-1
  studyStreak: number; // days
  totalStudyMinutes: number;
  
  // Learning history
  wordsLearned: number;
  wordsMastered: number;
  lessonsCompleted: number;
  assessmentsCompleted: number;
  
  // Weaknesses
  weakAreas: WeakArea[];
  
  // Preferences
  preferredStudyTime: "morning" | "afternoon" | "evening";
  dailyGoalMinutes: number;
  
  // Timestamps
  createdAt: number;
  lastActiveAt: number;
  lastAssessmentAt?: number;
}

export interface WeakArea {
  skill: SkillType;
  subskill?: string;
  severity: "critical" | "major" | "minor";
  score: number; // 0-100
  lastPracticed: number;
  practiceCount: number;
  recommendation: string;
}

export type SkillType = 
  | "vocabulary"
  | "listening"
  | "speaking"
  | "pronunciation"
  | "grammar"
  | "reading"
  | "writing";

export interface DailyRecommendation {
  date: string;
  
  // Time allocation (minutes)
  timeAllocation: TimeAllocation;
  
  // Focus areas
  focusAreas: FocusArea[];
  
  // Specific activities
  activities: RecommendedActivity[];
  
  // New words to learn
  newWordsCount: number;
  
  // Review words
  reviewWordsCount: number;
  
  // Difficulty adjustments
  difficulty: "easy" | "normal" | "hard";
  audioSpeed: "slow" | "normal" | "fast";
  
  // Reasoning
  reasons: string[];
}

export interface TimeAllocation {
  vocabulary: number;
  listening: number;
  speaking: number;
  pronunciation: number;
  grammar: number;
  reading: number;
  writing: number;
  total: number;
}

export interface FocusArea {
  skill: SkillType;
  priority: "high" | "medium" | "low";
  reason: string;
  targetScore: number;
}

export interface RecommendedActivity {
  type: "learn" | "practice" | "review" | "assessment";
  skill: SkillType;
  description: string;
  descriptionChinese: string;
  durationMinutes: number;
  difficulty: "easy" | "normal" | "hard";
}

export interface SkillProgress {
  skill: SkillType;
  currentScore: number;
  previousScore: number;
  change: number;
  trend: "improving" | "stable" | "declining";
  dataPoints: ProgressDataPoint[];
}

export interface ProgressDataPoint {
  date: string;
  score: number;
  activity?: string;
}

// ============================================================
// Learner Model
// ============================================================

export class LearnerModelV1 {
  private profiles: Map<string, LearnerProfileV1> = new Map();

  /**
   * Create or get learner profile
   */
  getOrCreateProfile(userId: string): LearnerProfileV1 {
    let profile = this.profiles.get(userId);
    
    if (!profile) {
      profile = this.createDefaultProfile(userId);
      this.profiles.set(userId, profile);
    }
    
    return profile;
  }

  /**
   * Create default profile
   */
  private createDefaultProfile(userId: string): LearnerProfileV1 {
    const now = Date.now();
    return {
      userId,
      vocabularyLevel: 0,
      listeningLevel: 0,
      speakingLevel: 0,
      pronunciationLevel: 0,
      grammarLevel: 0,
      readingLevel: 0,
      writingLevel: 0,
      overallLevel: 0,
      retentionRate: 0,
      studyStreak: 0,
      totalStudyMinutes: 0,
      wordsLearned: 0,
      wordsMastered: 0,
      lessonsCompleted: 0,
      assessmentsCompleted: 0,
      weakAreas: [],
      preferredStudyTime: "morning",
      dailyGoalMinutes: 240,
      createdAt: now,
      lastActiveAt: now,
    };
  }

  /**
   * Update skill level
   */
  updateSkillLevel(
    userId: string,
    skill: SkillType,
    score: number
  ): LearnerProfileV1 {
    const profile = this.getOrCreateProfile(userId);
    
    // Update specific skill
    switch (skill) {
      case "vocabulary":
        profile.vocabularyLevel = score;
        break;
      case "listening":
        profile.listeningLevel = score;
        break;
      case "speaking":
        profile.speakingLevel = score;
        break;
      case "pronunciation":
        profile.pronunciationLevel = score;
        break;
      case "grammar":
        profile.grammarLevel = score;
        break;
      case "reading":
        profile.readingLevel = score;
        break;
      case "writing":
        profile.writingLevel = score;
        break;
    }
    
    // Recalculate overall level
    profile.overallLevel = this.calculateOverallLevel(profile);
    
    // Update weak areas
    profile.weakAreas = this.identifyWeakAreas(profile);
    
    // Update timestamp
    profile.lastActiveAt = Date.now();
    
    return profile;
  }

  /**
   * Calculate overall level
   */
  private calculateOverallLevel(profile: LearnerProfileV1): number {
    const scores = [
      profile.vocabularyLevel,
      profile.listeningLevel,
      profile.speakingLevel,
      profile.pronunciationLevel,
      profile.grammarLevel,
      profile.readingLevel,
      profile.writingLevel,
    ];
    
    // Filter out zeros (not yet assessed)
    const assessedScores = scores.filter(s => s > 0);
    
    if (assessedScores.length === 0) return 0;
    
    // Weighted average (speaking and listening weighted higher)
    const weights = [1, 1.2, 1.2, 1, 1, 0.8, 0.8];
    const weightedSum = scores.reduce((sum, score, i) => sum + score * weights[i], 0);
    const weightSum = weights.reduce((sum, w) => sum + w, 0);
    
    return Math.round(weightedSum / weightSum);
  }

  /**
   * Identify weak areas
   */
  private identifyWeakAreas(profile: LearnerProfileV1): WeakArea[] {
    const weakAreas: WeakArea[] = [];
    const threshold = 60; // Below this is considered weak
    
    const skills: Array<{ skill: SkillType; score: number }> = [
      { skill: "vocabulary", score: profile.vocabularyLevel },
      { skill: "listening", score: profile.listeningLevel },
      { skill: "speaking", score: profile.speakingLevel },
      { skill: "pronunciation", score: profile.pronunciationLevel },
      { skill: "grammar", score: profile.grammarLevel },
      { skill: "reading", score: profile.readingLevel },
      { skill: "writing", score: profile.writingLevel },
    ];
    
    for (const { skill, score } of skills) {
      if (score > 0 && score < threshold) {
        let severity: WeakArea["severity"];
        if (score < 30) severity = "critical";
        else if (score < 50) severity = "major";
        else severity = "minor";
        
        weakAreas.push({
          skill,
          severity,
          score,
          lastPracticed: profile.lastActiveAt,
          practiceCount: 0,
          recommendation: this.generateRecommendation(skill, score),
        });
      }
    }
    
    // Sort by severity and score
    weakAreas.sort((a, b) => {
      const severityOrder = { critical: 0, major: 1, minor: 2 };
      if (severityOrder[a.severity] !== severityOrder[b.severity]) {
        return severityOrder[a.severity] - severityOrder[b.severity];
      }
      return a.score - b.score;
    });
    
    return weakAreas;
  }

  /**
   * Generate recommendation for weak area
   */
  private generateRecommendation(skill: SkillType, score: number): string {
    const recommendations: Record<SkillType, string[]> = {
      vocabulary: [
        "Review basic vocabulary with flashcards",
        "Learn new words with example sentences",
        "Practice using words in context",
      ],
      listening: [
        "Listen to slow English audio daily",
        "Practice with listening comprehension exercises",
        "Shadow native speakers",
      ],
      speaking: [
        "Practice speaking aloud every day",
        "Record yourself and compare with native audio",
        "Have conversations in English",
      ],
      pronunciation: [
        "Focus on individual phoneme practice",
        "Use pronunciation comparison tools",
        "Practice minimal pairs",
      ],
      grammar: [
        "Review basic grammar rules",
        "Complete grammar exercises",
        "Write sentences using new grammar",
      ],
      reading: [
        "Read simple English texts daily",
        "Look up unfamiliar words",
        "Practice reading aloud",
      ],
      writing: [
        "Write short paragraphs daily",
        "Keep a diary in English",
        "Practice writing common phrases",
      ],
    };
    
    const skillRecs = recommendations[skill];
    const index = Math.min(Math.floor(score / 20), skillRecs.length - 1);
    return skillRecs[index];
  }

  /**
   * Generate daily recommendation
   */
  generateDailyRecommendation(userId: string): DailyRecommendation {
    const profile = this.getOrCreateProfile(userId);
    const today = new Date().toISOString().split("T")[0];
    
    // Calculate time allocation based on weaknesses
    const timeAllocation = this.calculateTimeAllocation(profile);
    
    // Identify focus areas
    const focusAreas = this.identifyFocusAreas(profile);
    
    // Generate activities
    const activities = this.generateActivities(profile, focusAreas);
    
    // Determine word counts
    const newWordsCount = this.calculateNewWordsCount(profile);
    const reviewWordsCount = this.calculateReviewWordsCount(profile);
    
    // Determine difficulty
    const difficulty = this.determineDifficulty(profile);
    const audioSpeed = this.determineAudioSpeed(profile);
    
    // Generate reasons
    const reasons = this.generateReasons(profile, focusAreas);
    
    return {
      date: today,
      timeAllocation,
      focusAreas,
      activities,
      newWordsCount,
      reviewWordsCount,
      difficulty,
      audioSpeed,
      reasons,
    };
  }

  /**
   * Calculate time allocation
   */
  private calculateTimeAllocation(profile: LearnerProfileV1): TimeAllocation {
    const totalMinutes = profile.dailyGoalMinutes;
    
    // Base allocation (percentages)
    let allocation = {
      vocabulary: 0.2,
      listening: 0.2,
      speaking: 0.2,
      pronunciation: 0.1,
      grammar: 0.15,
      reading: 0.1,
      writing: 0.05,
    };
    
    // Adjust based on weak areas
    for (const weakArea of profile.weakAreas.slice(0, 3)) {
      const boost = weakArea.severity === "critical" ? 0.1 : 
                    weakArea.severity === "major" ? 0.05 : 0.02;
      
      switch (weakArea.skill) {
        case "vocabulary":
          allocation.vocabulary += boost;
          break;
        case "listening":
          allocation.listening += boost;
          break;
        case "speaking":
          allocation.speaking += boost;
          break;
        case "pronunciation":
          allocation.pronunciation += boost;
          break;
        case "grammar":
          allocation.grammar += boost;
          break;
        case "reading":
          allocation.reading += boost;
          break;
        case "writing":
          allocation.writing += boost;
          break;
      }
    }
    
    // Normalize to sum to 1
    const sum = Object.values(allocation).reduce((a, b) => a + b, 0);
    Object.keys(allocation).forEach(key => {
      allocation = { ...allocation, [key]: allocation[key as keyof typeof allocation] / sum };
    });
    
    // Convert to minutes
    return {
      vocabulary: Math.round(allocation.vocabulary * totalMinutes),
      listening: Math.round(allocation.listening * totalMinutes),
      speaking: Math.round(allocation.speaking * totalMinutes),
      pronunciation: Math.round(allocation.pronunciation * totalMinutes),
      grammar: Math.round(allocation.grammar * totalMinutes),
      reading: Math.round(allocation.reading * totalMinutes),
      writing: Math.round(allocation.writing * totalMinutes),
      total: totalMinutes,
    };
  }

  /**
   * Identify focus areas
   */
  private identifyFocusAreas(profile: LearnerProfileV1): FocusArea[] {
    const focusAreas: FocusArea[] = [];
    
    // Add weak areas as focus
    for (const weakArea of profile.weakAreas.slice(0, 3)) {
      focusAreas.push({
        skill: weakArea.skill,
        priority: weakArea.severity === "critical" ? "high" : 
                  weakArea.severity === "major" ? "medium" : "low",
        reason: weakArea.recommendation,
        targetScore: Math.min(weakArea.score + 20, 100),
      });
    }
    
    // If no weak areas, focus on maintenance
    if (focusAreas.length === 0) {
      const skills: SkillType[] = ["vocabulary", "listening", "speaking", "grammar"];
      for (const skill of skills.slice(0, 2)) {
        focusAreas.push({
          skill,
          priority: "low",
          reason: "Maintain current level",
          targetScore: 80,
        });
      }
    }
    
    return focusAreas;
  }

  /**
   * Generate activities
   */
  private generateActivities(
    profile: LearnerProfileV1,
    focusAreas: FocusArea[]
  ): RecommendedActivity[] {
    const activities: RecommendedActivity[] = [];
    
    // Generate activities based on focus areas
    for (const focus of focusAreas) {
      const duration = focus.priority === "high" ? 30 : 
                      focus.priority === "medium" ? 20 : 15;
      
      activities.push({
        type: "practice",
        skill: focus.skill,
        description: `Practice ${focus.skill}`,
        descriptionChinese: `练习${this.getSkillNameChinese(focus.skill)}`,
        durationMinutes: duration,
        difficulty: profile.overallLevel < 40 ? "easy" : "normal",
      });
    }
    
    // Add review activity
    activities.push({
      type: "review",
      skill: "vocabulary",
      description: "Review vocabulary with SRS",
      descriptionChinese: "用SRS复习词汇",
      durationMinutes: 20,
      difficulty: "normal",
    });
    
    return activities;
  }

  /**
   * Get Chinese name for skill
   */
  private getSkillNameChinese(skill: SkillType): string {
    const names: Record<SkillType, string> = {
      vocabulary: "词汇",
      listening: "听力",
      speaking: "口语",
      pronunciation: "发音",
      grammar: "语法",
      reading: "阅读",
      writing: "写作",
    };
    return names[skill];
  }

  /**
   * Calculate new words count
   */
  private calculateNewWordsCount(profile: LearnerProfileV1): number {
    // Base count
    let count = 10;
    
    // Adjust based on retention rate
    if (profile.retentionRate < 0.6) {
      count = 5; // Reduce if retention is low
    } else if (profile.retentionRate > 0.8) {
      count = 15; // Increase if retention is high
    }
    
    // Adjust based on study time
    if (profile.dailyGoalMinutes < 120) {
      count = Math.max(5, count - 3);
    } else if (profile.dailyGoalMinutes > 300) {
      count = Math.min(20, count + 3);
    }
    
    return count;
  }

  /**
   * Calculate review words count
   */
  private calculateReviewWordsCount(profile: LearnerProfileV1): number {
    // Base count
    let count = 20;
    
    // Adjust based on words learned
    if (profile.wordsLearned > 500) {
      count = 30;
    } else if (profile.wordsLearned > 200) {
      count = 25;
    }
    
    // Adjust based on retention
    if (profile.retentionRate < 0.6) {
      count = Math.min(40, count + 10);
    }
    
    return count;
  }

  /**
   * Determine difficulty
   */
  private determineDifficulty(profile: LearnerProfileV1): "easy" | "normal" | "hard" {
    if (profile.overallLevel < 30) return "easy";
    if (profile.overallLevel < 60) return "normal";
    return "hard";
  }

  /**
   * Determine audio speed
   */
  private determineAudioSpeed(profile: LearnerProfileV1): "slow" | "normal" | "fast" {
    if (profile.listeningLevel < 30) return "slow";
    if (profile.listeningLevel < 60) return "normal";
    return "fast";
  }

  /**
   * Generate reasons
   */
  private generateReasons(
    profile: LearnerProfileV1,
    focusAreas: FocusArea[]
  ): string[] {
    const reasons: string[] = [];
    
    // Weak area reasons
    for (const focus of focusAreas.slice(0, 2)) {
      reasons.push(`${focus.skill} needs improvement (current: ${Math.round(profile[`vocabularyLevel`])}%)`);
    }
    
    // Retention reason
    if (profile.retentionRate < 0.6) {
      reasons.push("Low retention rate - increasing review");
    }
    
    // Streak reason
    if (profile.studyStreak > 7) {
      reasons.push(`Great streak! ${profile.studyStreak} days in a row`);
    } else if (profile.studyStreak === 0) {
      reasons.push("Start a new streak today!");
    }
    
    return reasons;
  }

  /**
   * Get skill progress
   */
  getSkillProgress(
    userId: string,
    skill: SkillType,
    history: Array<{ date: string; score: number }>
  ): SkillProgress {
    const profile = this.getOrCreateProfile(userId);
    
    let currentScore = 0;
    switch (skill) {
      case "vocabulary": currentScore = profile.vocabularyLevel; break;
      case "listening": currentScore = profile.listeningLevel; break;
      case "speaking": currentScore = profile.speakingLevel; break;
      case "pronunciation": currentScore = profile.pronunciationLevel; break;
      case "grammar": currentScore = profile.grammarLevel; break;
      case "reading": currentScore = profile.readingLevel; break;
      case "writing": currentScore = profile.writingLevel; break;
    }
    
    const previousScore = history.length > 0 ? history[history.length - 1].score : 0;
    const change = currentScore - previousScore;
    
    let trend: "improving" | "stable" | "declining" = "stable";
    if (change > 5) trend = "improving";
    else if (change < -5) trend = "declining";
    
    return {
      skill,
      currentScore,
      previousScore,
      change,
      trend,
      dataPoints: history.map(h => ({ date: h.date, score: h.score })),
    };
  }

  /**
   * Update study streak
   */
  updateStudyStreak(userId: string, studiedToday: boolean): LearnerProfileV1 {
    const profile = this.getOrCreateProfile(userId);
    
    if (studiedToday) {
      const lastActive = new Date(profile.lastActiveAt);
      const today = new Date();
      const isConsecutive = this.isConsecutiveDay(lastActive, today);
      
      if (isConsecutive || profile.studyStreak === 0) {
        profile.studyStreak += 1;
      } else {
        profile.studyStreak = 1;
      }
    } else {
      profile.studyStreak = 0;
    }
    
    profile.lastActiveAt = Date.now();
    return profile;
  }

  /**
   * Check if days are consecutive
   */
  private isConsecutiveDay(date1: Date, date2: Date): boolean {
    const oneDayMs = 24 * 60 * 60 * 1000;
    const diffMs = Math.abs(date2.getTime() - date1.getTime());
    return diffMs < oneDayMs * 1.5; // Allow some flexibility
  }

  /**
   * Export profile
   */
  exportProfile(userId: string): LearnerProfileV1 | undefined {
    return this.profiles.get(userId);
  }

  /**
   * Import profile
   */
  importProfile(profile: LearnerProfileV1): void {
    this.profiles.set(profile.userId, profile);
  }
}
