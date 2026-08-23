/**
 * Adaptive Learning Engine v2
 *
 * Upgrades from v1 with:
 * - Dynamic lesson adjustment
 * - Real-time difficulty modification
 * - Personalized curriculum adaptation
 * - Learning path optimization
 *
 * Input:
 * - Vocabulary accuracy
 * - Listening score
 * - Speaking score
 * - Grammar mistakes
 * - Retention rate
 * - Learning speed
 * - Error patterns
 *
 * Output:
 * - Dynamic lesson modifications
 * - Personalized daily plan
 * - Adaptive review scheduling
 * - Focus area recommendations
 */

import type { DailyLesson } from "@/types/database";

// ============================================================
// Types
// ============================================================

export interface AdaptiveProfileV2 {
  userId: string;

  // Core skill scores (0-100)
  vocabularyAccuracy: number;
  listeningScore: number;
  speakingScore: number;
  grammarAccuracy: number;
  pronunciationScore: number;
  retentionRate: number;

  // Advanced metrics
  learningSpeed: number; // words per day
  errorPatterns: ErrorPattern[];
  strengthAreas: string[];
  weaknessAreas: string[];

  // Learning history
  totalStudyTime: number; // minutes
  wordsLearned: number;
  wordsMastered: number;
  lessonsCompleted: number;
  currentStreak: number;

  // Adaptation state
  currentDifficulty: DifficultyLevel;
  lastAdaptation: number;
  adaptationHistory: AdaptationRecord[];
}

export type DifficultyLevel =
  | "absolute_beginner"
  | "beginner"
  | "elementary"
  | "intermediate"
  | "upper_intermediate";

export interface ErrorPattern {
  type: "vocabulary" | "grammar" | "listening" | "speaking" | "pronunciation";
  pattern: string;
  frequency: number;
  lastOccurrence: number;
  severity: "minor" | "moderate" | "major";
}

export interface AdaptationRecord {
  timestamp: number;
  type: "difficulty" | "pace" | "focus" | "review";
  previousValue: string;
  newValue: string;
  reason: string;
}

export interface DynamicLessonAdjustment {
  // Vocabulary adjustments
  vocabulary: {
    newWordsCount: number;
    reviewWordsCount: number;
    wordDifficulty: "basic" | "intermediate" | "advanced";
    focusWords: string[];
    skipWords: string[];
  };

  // Listening adjustments
  listening: {
    audioSpeed: "slow" | "normal" | "fast";
    showTranscript: boolean;
    repeatCount: number;
    exerciseDifficulty: "easy" | "normal" | "hard";
    focusPhonemes: string[];
  };

  // Speaking adjustments
  speaking: {
    shadowingIntensity: "low" | "medium" | "high";
    conversationLength: "short" | "medium" | "long";
    pronunciationFocus: string[];
    confidenceBuilding: boolean;
  };

  // Grammar adjustments
  grammar: {
    explanationLevel: "simple" | "detailed" | "advanced";
    exerciseCount: number;
    errorCorrection: "gentle" | "moderate" | "strict";
    focusRules: string[];
  };

  // Review adjustments
  review: {
    srsInterval: "short" | "medium" | "long";
    reviewType: "active" | "passive" | "mixed";
    prioritySkills: string[];
  };

  // Time allocation
  timeAllocation: {
    vocabulary: number; // minutes
    listening: number;
    speaking: number;
    grammar: number;
    reading: number;
    writing: number;
    review: number;
    total: number;
  };

  // Adaptation reasons
  reasons: string[];
  confidence: number; // 0-1
}

export interface LessonModification {
  activityId: string;
  type: "modify" | "skip" | "add" | "replace";
  modification: {
    difficulty?: "easy" | "normal" | "hard";
    duration?: number;
    content?: Record<string, unknown>;
    instructions?: string;
  };
  reason: string;
}

export interface PersonalizedCurriculum {
  userId: string;
  generatedAt: number;

  // Daily adjustments
  dailyPlan: DailyPlanAdjustment[];

  // Weekly focus
  weeklyFocus: WeeklyFocus[];

  // Skill priorities
  skillPriorities: SkillPriority[];

  // Milestone adjustments
  milestoneAdjustments: MilestoneAdjustment[];
}

export interface DailyPlanAdjustment {
  day: number;
  adjustments: DynamicLessonAdjustment;
  focusAreas: string[];
  estimatedCompletionTime: number;
}

export interface WeeklyFocus {
  week: number;
  primaryFocus: string;
  secondaryFocus: string;
  targetImprovements: string[];
}

export interface SkillPriority {
  skill: string;
  priority: "high" | "medium" | "low";
  targetScore: number;
  currentScore: number;
  expectedImprovement: number;
}

export interface MilestoneAdjustment {
  milestone: string;
  originalTarget: Record<string, number>;
  adjustedTarget: Record<string, number>;
  reason: string;
}

// ============================================================
// Adaptive Learning Engine v2
// ============================================================

export class AdaptiveLearningEngineV2 {
  private profiles: Map<string, AdaptiveProfileV2> = new Map();

  /**
   * Create or get adaptive profile
   */
  getOrCreateProfile(userId: string): AdaptiveProfileV2 {
    let profile = this.profiles.get(userId);

    if (!profile) {
      profile = this.createDefaultProfile(userId);
      this.profiles.set(userId, profile);
    }

    return profile;
  }

  /**
   * Create default adaptive profile
   */
  private createDefaultProfile(userId: string): AdaptiveProfileV2 {
    return {
      userId,
      vocabularyAccuracy: 0,
      listeningScore: 0,
      speakingScore: 0,
      grammarAccuracy: 0,
      pronunciationScore: 0,
      retentionRate: 0.5,
      learningSpeed: 10,
      errorPatterns: [],
      strengthAreas: [],
      weaknessAreas: [],
      totalStudyTime: 0,
      wordsLearned: 0,
      wordsMastered: 0,
      lessonsCompleted: 0,
      currentStreak: 0,
      currentDifficulty: "absolute_beginner",
      lastAdaptation: Date.now(),
      adaptationHistory: [],
    };
  }

  /**
   * Generate dynamic lesson adjustment
   */
  generateLessonAdjustment(
    profile: AdaptiveProfileV2,
    _currentLesson: DailyLesson
  ): DynamicLessonAdjustment {
    // Analyze current performance
    const analysis = this.analyzePerformance(profile);

    // Generate adjustments for each skill area
    const vocabulary = this.adjustVocabulary(profile, analysis);
    const listening = this.adjustListening(profile, analysis);
    const speaking = this.adjustSpeaking(profile, analysis);
    const grammar = this.adjustGrammar(profile, analysis);
    const review = this.adjustReview(profile, analysis);

    // Calculate time allocation
    const timeAllocation = this.calculateTimeAllocation(profile, analysis);

    // Generate reasons
    const reasons = this.generateAdjustmentReasons(profile, analysis);

    // Calculate confidence
    const confidence = this.calculateAdjustmentConfidence(profile);

    return {
      vocabulary,
      listening,
      speaking,
      grammar,
      review,
      timeAllocation,
      reasons,
      confidence,
    };
  }

  /**
   * Analyze learner performance
   */
  private analyzePerformance(profile: AdaptiveProfileV2): {
    overallLevel: DifficultyLevel;
    skillGaps: string[];
    learningPatterns: string[];
    adaptationNeeds: string[];
  } {
    // Determine overall level
    const avgScore = (
      profile.vocabularyAccuracy +
      profile.listeningScore +
      profile.speakingScore +
      profile.grammarAccuracy
    ) / 4;

    let overallLevel: DifficultyLevel;
    if (avgScore < 20) overallLevel = "absolute_beginner";
    else if (avgScore < 40) overallLevel = "beginner";
    else if (avgScore < 60) overallLevel = "elementary";
    else if (avgScore < 80) overallLevel = "intermediate";
    else overallLevel = "upper_intermediate";

    // Identify skill gaps
    const skillGaps: string[] = [];
    if (profile.vocabularyAccuracy < avgScore - 10) skillGaps.push("vocabulary");
    if (profile.listeningScore < avgScore - 10) skillGaps.push("listening");
    if (profile.speakingScore < avgScore - 10) skillGaps.push("speaking");
    if (profile.grammarAccuracy < avgScore - 10) skillGaps.push("grammar");

    // Identify learning patterns
    const learningPatterns: string[] = [];
    if (profile.retentionRate < 0.6) learningPatterns.push("low_retention");
    if (profile.learningSpeed < 8) learningPatterns.push("slow_learner");
    if (profile.errorPatterns.length > 5) learningPatterns.push("frequent_errors");

    // Identify adaptation needs
    const adaptationNeeds: string[] = [];
    if (profile.currentDifficulty !== overallLevel) adaptationNeeds.push("difficulty_adjustment");
    if (skillGaps.length > 2) adaptationNeeds.push("skill_focus");
    if (profile.retentionRate < 0.7) adaptationNeeds.push("review_optimization");

    return {
      overallLevel,
      skillGaps,
      learningPatterns,
      adaptationNeeds,
    };
  }

  /**
   * Adjust vocabulary settings
   */
  private  adjustVocabulary(
    profile: AdaptiveProfileV2,
    analysis: ReturnType<typeof this.analyzePerformance>
  ): DynamicLessonAdjustment["vocabulary"] {
    // Base settings
    let newWordsCount = 10;
    let reviewWordsCount = 15;
    let wordDifficulty: "basic" | "intermediate" | "advanced" = "basic";
    const focusWords: string[] = [];
    const skipWords: string[] = [];

    // Adjust based on accuracy
    if (profile.vocabularyAccuracy < 50) {
      newWordsCount = 5;
      reviewWordsCount = 25;
      wordDifficulty = "basic";
    } else if (profile.vocabularyAccuracy < 70) {
      newWordsCount = 8;
      reviewWordsCount = 20;
      wordDifficulty = "basic";
    } else if (profile.vocabularyAccuracy < 85) {
      newWordsCount = 12;
      reviewWordsCount = 15;
      wordDifficulty = "intermediate";
    } else {
      newWordsCount = 15;
      reviewWordsCount = 10;
      wordDifficulty = "advanced";
    }

    // Adjust based on retention
    if (profile.retentionRate < 0.6) {
      newWordsCount = Math.max(3, newWordsCount - 3);
      reviewWordsCount = Math.min(35, reviewWordsCount + 10);
    }

    // Focus on weak areas
    if (analysis.skillGaps.includes("vocabulary")) {
      newWordsCount = Math.max(5, newWordsCount - 2);
      reviewWordsCount = Math.min(30, reviewWordsCount + 5);
    }

    return {
      newWordsCount,
      reviewWordsCount,
      wordDifficulty,
      focusWords,
      skipWords,
    };
  }

  /**
   * Adjust listening settings
   */
  private  adjustListening(
    profile: AdaptiveProfileV2,
    _analysis: ReturnType<typeof this.analyzePerformance>
  ): DynamicLessonAdjustment["listening"] {
    // Base settings
    let audioSpeed: "slow" | "normal" | "fast" = "slow";
    let showTranscript = true;
    let repeatCount = 2;
    let exerciseDifficulty: "easy" | "normal" | "hard" = "easy";
    const focusPhonemes: string[] = [];

    // Adjust based on listening score
    if (profile.listeningScore < 30) {
      audioSpeed = "slow";
      showTranscript = true;
      repeatCount = 3;
      exerciseDifficulty = "easy";
    } else if (profile.listeningScore < 50) {
      audioSpeed = "slow";
      showTranscript = true;
      repeatCount = 2;
      exerciseDifficulty = "easy";
    } else if (profile.listeningScore < 70) {
      audioSpeed = "normal";
      showTranscript = false;
      repeatCount = 1;
      exerciseDifficulty = "normal";
    } else {
      audioSpeed = "normal";
      showTranscript = false;
      repeatCount = 1;
      exerciseDifficulty = "hard";
    }

    // Focus on weak phonemes
    const weakPhonemes = profile.errorPatterns
      .filter(e => e.type === "listening" || e.type === "pronunciation")
      .map(e => e.pattern);
    focusPhonemes.push(...weakPhonemes.slice(0, 3));

    return {
      audioSpeed,
      showTranscript,
      repeatCount,
      exerciseDifficulty,
      focusPhonemes,
    };
  }

  /**
   * Adjust speaking settings
   */
  private  adjustSpeaking(
    profile: AdaptiveProfileV2,
    _analysis: ReturnType<typeof this.analyzePerformance>
  ): DynamicLessonAdjustment["speaking"] {
    // Base settings
    let shadowingIntensity: "low" | "medium" | "high" = "low";
    let conversationLength: "short" | "medium" | "long" = "short";
    const pronunciationFocus: string[] = [];
    let confidenceBuilding = true;

    // Adjust based on speaking score
    if (profile.speakingScore < 30) {
      shadowingIntensity = "low";
      conversationLength = "short";
      confidenceBuilding = true;
    } else if (profile.speakingScore < 50) {
      shadowingIntensity = "medium";
      conversationLength = "short";
      confidenceBuilding = true;
    } else if (profile.speakingScore < 70) {
      shadowingIntensity = "medium";
      conversationLength = "medium";
      confidenceBuilding = false;
    } else {
      shadowingIntensity = "high";
      conversationLength = "long";
      confidenceBuilding = false;
    }

    // Focus on pronunciation weaknesses
    const pronunciationErrors = profile.errorPatterns
      .filter(e => e.type === "pronunciation")
      .map(e => e.pattern);
    pronunciationFocus.push(...pronunciationErrors.slice(0, 3));

    return {
      shadowingIntensity,
      conversationLength,
      pronunciationFocus,
      confidenceBuilding,
    };
  }

  /**
   * Adjust grammar settings
   */
  private  adjustGrammar(
    _profile: AdaptiveProfileV2,
    _analysis: ReturnType<typeof this.analyzePerformance>
  ): DynamicLessonAdjustment["grammar"] {
    // Base settings
    let explanationLevel: "simple" | "detailed" | "advanced" = "simple";
    let exerciseCount = 5;
    let errorCorrection: "gentle" | "moderate" | "strict" = "gentle";
    const focusRules: string[] = [];

    // Adjust based on grammar accuracy
    if (_profile.grammarAccuracy < 40) {
      explanationLevel = "simple";
      exerciseCount = 8;
      errorCorrection = "gentle";
    } else if (_profile.grammarAccuracy < 60) {
      explanationLevel = "detailed";
      exerciseCount = 6;
      errorCorrection = "moderate";
    } else if (_profile.grammarAccuracy < 80) {
      explanationLevel = "detailed";
      exerciseCount = 5;
      errorCorrection = "moderate";
    } else {
      explanationLevel = "advanced";
      exerciseCount = 4;
      errorCorrection = "strict";
    }

    // Focus on grammar error patterns
    const grammarErrors = _profile.errorPatterns
      .filter(e => e.type === "grammar")
      .map(e => e.pattern);
    focusRules.push(...grammarErrors.slice(0, 3));

    return {
      explanationLevel,
      exerciseCount,
      errorCorrection,
      focusRules,
    };
  }

  /**
   * Adjust review settings
   */
  private  adjustReview(
    profile: AdaptiveProfileV2,
    analysis: ReturnType<typeof this.analyzePerformance>
  ): DynamicLessonAdjustment["review"] {
    // Base settings
    let srsInterval: "short" | "medium" | "long" = "medium";
    let reviewType: "active" | "passive" | "mixed" = "mixed";
    const prioritySkills: string[] = [];

    // Adjust based on retention
    if (profile.retentionRate < 0.6) {
      srsInterval = "short";
      reviewType = "active";
    } else if (profile.retentionRate < 0.8) {
      srsInterval = "medium";
      reviewType = "mixed";
    } else {
      srsInterval = "long";
      reviewType = "passive";
    }

    // Prioritize weak skills
    prioritySkills.push(...analysis.skillGaps);

    return {
      srsInterval,
      reviewType,
      prioritySkills,
    };
  }

  /**
   * Calculate time allocation
   */
  private calculateTimeAllocation(
    _profile: AdaptiveProfileV2,
    analysis: ReturnType<typeof this.analyzePerformance>
  ): DynamicLessonAdjustment["timeAllocation"] {
    const totalMinutes = 240; // 4 hours

    // Base allocation (percentages)
    let allocation = {
      vocabulary: 0.2,
      listening: 0.2,
      speaking: 0.2,
      grammar: 0.15,
      reading: 0.1,
      writing: 0.05,
      review: 0.1,
    };

    // Adjust based on skill gaps
    for (const gap of analysis.skillGaps) {
      switch (gap) {
        case "vocabulary":
          allocation.vocabulary += 0.05;
          break;
        case "listening":
          allocation.listening += 0.05;
          break;
        case "speaking":
          allocation.speaking += 0.05;
          break;
        case "grammar":
          allocation.grammar += 0.05;
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
      grammar: Math.round(allocation.grammar * totalMinutes),
      reading: Math.round(allocation.reading * totalMinutes),
      writing: Math.round(allocation.writing * totalMinutes),
      review: Math.round(allocation.review * totalMinutes),
      total: totalMinutes,
    };
  }

  /**
   * Generate adjustment reasons
   */
  private generateAdjustmentReasons(
    profile: AdaptiveProfileV2,
    analysis: ReturnType<typeof this.analyzePerformance>
  ): string[] {
    const reasons: string[] = [];

    // Difficulty level
    if (profile.currentDifficulty !== analysis.overallLevel) {
      reasons.push(`Adjusting difficulty from ${profile.currentDifficulty} to ${analysis.overallLevel}`);
    }

    // Skill gaps
    if (analysis.skillGaps.length > 0) {
      reasons.push(`Focusing on weak areas: ${analysis.skillGaps.join(", ")}`);
    }

    // Retention
    if (profile.retentionRate < 0.7) {
      reasons.push("Low retention rate - increasing review frequency");
    }

    // Learning patterns
    if (analysis.learningPatterns.includes("slow_learner")) {
      reasons.push("Slowing pace to ensure comprehension");
    }

    // Error patterns
    if (profile.errorPatterns.length > 5) {
      reasons.push("Addressing frequent error patterns");
    }

    return reasons;
  }

  /**
   * Calculate adjustment confidence
   */
  private calculateAdjustmentConfidence(profile: AdaptiveProfileV2): number {
    let confidence = 0.5; // Base confidence

    // Increase confidence with more data
    if (profile.lessonsCompleted > 10) confidence += 0.1;
    if (profile.lessonsCompleted > 30) confidence += 0.1;
    if (profile.lessonsCompleted > 60) confidence += 0.1;

    // Decrease confidence with instability
    if (profile.errorPatterns.length > 10) confidence -= 0.1;
    if (profile.retentionRate < 0.5) confidence -= 0.1;

    return Math.max(0, Math.min(1, confidence));
  }

  /**
   * Generate lesson modifications
   */
  generateLessonModifications(
    profile: AdaptiveProfileV2,
    lesson: DailyLesson
  ): LessonModification[] {
    const modifications: LessonModification[] = [];
    const adjustment = this.generateLessonAdjustment(profile, lesson);

    // Modify vocabulary activities
    for (const activity of lesson.activities) {
      if (activity.type === "vocabulary_introduction" || activity.type === "vocabulary_recall") {
        if (adjustment.vocabulary.newWordsCount < 8) {
          modifications.push({
            activityId: activity.id,
            type: "modify",
            modification: {
              difficulty: "easy",
              duration: Math.round(activity.duration * 0.8),
            },
            reason: "Reducing vocabulary load due to low accuracy",
          });
        }
      }

      // Modify listening activities
      if (activity.type === "listening_comprehension") {
        if (adjustment.listening.audioSpeed === "slow") {
          modifications.push({
            activityId: activity.id,
            type: "modify",
            modification: {
              difficulty: "easy",
              instructions: "Listen slowly with transcript",
            },
            reason: "Using slow audio for better comprehension",
          });
        }
      }

      // Modify speaking activities
      if (activity.type === "speaking_repetition" || activity.type === "speaking_conversation") {
        if (adjustment.speaking.shadowingIntensity === "low") {
          modifications.push({
            activityId: activity.id,
            type: "modify",
            modification: {
              difficulty: "easy",
              duration: Math.round(activity.duration * 0.7),
            },
            reason: "Reducing speaking intensity for confidence building",
          });
        }
      }
    }

    return modifications;
  }

  /**
   * Generate personalized curriculum
   */
  generatePersonalizedCurriculum(profile: AdaptiveProfileV2): PersonalizedCurriculum {
    const analysis = this.analyzePerformance(profile);

    // Generate daily plan adjustments
    const dailyPlan: DailyPlanAdjustment[] = [];
    for (let day = 1; day <= 30; day++) {
      const adjustment = this.generateLessonAdjustment(profile, {} as DailyLesson);
      dailyPlan.push({
        day,
        adjustments: adjustment,
        focusAreas: analysis.skillGaps,
        estimatedCompletionTime: 240,
      });
    }

    // Generate weekly focus
    const weeklyFocus: WeeklyFocus[] = [];
    for (let week = 1; week <= 4; week++) {
      weeklyFocus.push({
        week,
        primaryFocus: analysis.skillGaps[0] || "vocabulary",
        secondaryFocus: analysis.skillGaps[1] || "listening",
        targetImprovements: [`Improve ${analysis.skillGaps[0] || "vocabulary"} by 10%`],
      });
    }

    // Generate skill priorities
    const skillPriorities: SkillPriority[] = [
      {
        skill: "vocabulary",
        priority: analysis.skillGaps.includes("vocabulary") ? "high" : "medium",
        targetScore: Math.min(100, profile.vocabularyAccuracy + 20),
        currentScore: profile.vocabularyAccuracy,
        expectedImprovement: 15,
      },
      {
        skill: "listening",
        priority: analysis.skillGaps.includes("listening") ? "high" : "medium",
        targetScore: Math.min(100, profile.listeningScore + 20),
        currentScore: profile.listeningScore,
        expectedImprovement: 12,
      },
      {
        skill: "speaking",
        priority: analysis.skillGaps.includes("speaking") ? "high" : "medium",
        targetScore: Math.min(100, profile.speakingScore + 15),
        currentScore: profile.speakingScore,
        expectedImprovement: 10,
      },
      {
        skill: "grammar",
        priority: analysis.skillGaps.includes("grammar") ? "high" : "medium",
        targetScore: Math.min(100, profile.grammarAccuracy + 15),
        currentScore: profile.grammarAccuracy,
        expectedImprovement: 12,
      },
    ];

    // Generate milestone adjustments
    const milestoneAdjustments: MilestoneAdjustment[] = [
      {
        milestone: "Day 30",
        originalTarget: { words: 200, accuracy: 50, listening: 25, speaking: 15 },
        adjustedTarget: {
          words: Math.round(200 * (profile.retentionRate < 0.7 ? 0.8 : 1)),
          accuracy: Math.round(50 * (profile.vocabularyAccuracy < 40 ? 0.9 : 1)),
          listening: Math.round(25 * (profile.listeningScore < 20 ? 0.8 : 1)),
          speaking: Math.round(15 * (profile.speakingScore < 10 ? 0.8 : 1)),
        },
        reason: "Adjusted based on learner's retention rate and current performance",
      },
    ];

    return {
      userId: profile.userId,
      generatedAt: Date.now(),
      dailyPlan,
      weeklyFocus,
      skillPriorities,
      milestoneAdjustments,
    };
  }

  /**
   * Update profile based on learning data
   */
  updateProfile(
    userId: string,
    data: {
      vocabularyAccuracy?: number;
      listeningScore?: number;
      speakingScore?: number;
      grammarAccuracy?: number;
      pronunciationScore?: number;
      retentionRate?: number;
      wordsLearned?: number;
      wordsMastered?: number;
      lessonsCompleted?: number;
    }
  ): AdaptiveProfileV2 {
    const profile = this.getOrCreateProfile(userId);

    // Update values
    if (data.vocabularyAccuracy !== undefined) profile.vocabularyAccuracy = data.vocabularyAccuracy;
    if (data.listeningScore !== undefined) profile.listeningScore = data.listeningScore;
    if (data.speakingScore !== undefined) profile.speakingScore = data.speakingScore;
    if (data.grammarAccuracy !== undefined) profile.grammarAccuracy = data.grammarAccuracy;
    if (data.pronunciationScore !== undefined) profile.pronunciationScore = data.pronunciationScore;
    if (data.retentionRate !== undefined) profile.retentionRate = data.retentionRate;
    if (data.wordsLearned !== undefined) profile.wordsLearned = data.wordsLearned;
    if (data.wordsMastered !== undefined) profile.wordsMastered = data.wordsMastered;
    if (data.lessonsCompleted !== undefined) profile.lessonsCompleted = data.lessonsCompleted;

    // Analyze performance
    const analysis = this.analyzePerformance(profile);

    // Update difficulty level
    const previousDifficulty = profile.currentDifficulty;
    profile.currentDifficulty = analysis.overallLevel;

    // Record adaptation if difficulty changed
    if (previousDifficulty !== analysis.overallLevel) {
      profile.adaptationHistory.push({
        timestamp: Date.now(),
        type: "difficulty",
        previousValue: previousDifficulty,
        newValue: analysis.overallLevel,
        reason: `Performance level changed`,
      });
    }

    // Update weakness/strength areas
    profile.weaknessAreas = analysis.skillGaps;
    profile.strengthAreas = this.identifyStrengths(profile);

    return profile;
  }

  /**
   * Identify strengths
   */
  private identifyStrengths(profile: AdaptiveProfileV2): string[] {
    const strengths: string[] = [];
    const avgScore = (
      profile.vocabularyAccuracy +
      profile.listeningScore +
      profile.speakingScore +
      profile.grammarAccuracy
    ) / 4;

    if (profile.vocabularyAccuracy > avgScore + 10) strengths.push("vocabulary");
    if (profile.listeningScore > avgScore + 10) strengths.push("listening");
    if (profile.speakingScore > avgScore + 10) strengths.push("speaking");
    if (profile.grammarAccuracy > avgScore + 10) strengths.push("grammar");

    return strengths;
  }
}
