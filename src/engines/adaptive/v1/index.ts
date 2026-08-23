/**
 * Adaptive Learning Engine v1
 * 
 * Input:
 * - Vocabulary accuracy
 * - Listening score
 * - Speaking score
 * - Grammar mistakes
 * - Retention rate
 * 
 * Output:
 * - Daily Mission adjustment
 * - Difficulty level
 * - Focus areas
 * - Time allocation
 */

// ============================================================
// Types
// ============================================================

export interface LearnerProfile {
  userId: string;
  
  // Skill scores (0-100)
  vocabularyAccuracy: number;
  listeningScore: number;
  speakingScore: number;
  grammarAccuracy: number;
  retentionRate: number;
  
  // Learning metrics
  totalStudyTime: number; // minutes
  wordsLearned: number;
  wordsMastered: number;
  currentStreak: number;
  
  // Adaptation state
  difficultyLevel: DifficultyLevel;
  focusAreas: FocusArea[];
  lastUpdated: number;
}

export type DifficultyLevel = "beginner" | "elementary" | "intermediate" | "upper_intermediate";

export interface FocusArea {
  skill: string;
  priority: "high" | "medium" | "low";
  reason: string;
}

export interface DailyMissionAdjustment {
  // Word count adjustment
  newWordsCount: number;
  reviewWordsCount: number;
  
  // Time allocation (minutes)
  vocabularyTime: number;
  grammarTime: number;
  listeningTime: number;
  speakingTime: number;
  readingTime: number;
  writingTime: number;
  
  // Difficulty adjustments
  exerciseDifficulty: "easy" | "normal" | "hard";
  audioSpeed: "slow" | "normal" | "fast";
  
  // Focus recommendations
  focusRecommendations: string[];
  
  // Adaptation reasons
  reasons: string[];
}

export interface AdaptationRule {
  id: string;
  condition: (profile: LearnerProfile) => boolean;
  adjustment: Partial<DailyMissionAdjustment>;
  priority: number;
}

// ============================================================
// Adaptive Learning Engine
// ============================================================

export class AdaptiveLearningEngine {
  private rules: AdaptationRule[] = [];

  constructor() {
    this.initializeRules();
  }

  /**
   * Initialize adaptation rules
   */
  private initializeRules(): void {
    // Rule 1: Low vocabulary accuracy → reduce new words, increase review
    this.rules.push({
      id: "low_vocab_accuracy",
      condition: (profile) => profile.vocabularyAccuracy < 60,
      adjustment: {
        newWordsCount: 5,
        reviewWordsCount: 15,
        exerciseDifficulty: "easy",
        focusRecommendations: ["Focus on vocabulary review", "Use simpler words"],
      },
      priority: 10,
    });

    // Rule 2: Low listening score → increase listening time
    this.rules.push({
      id: "low_listening",
      condition: (profile) => profile.listeningScore < 60,
      adjustment: {
        listeningTime: 40,
        audioSpeed: "slow",
        focusRecommendations: ["Practice listening more", "Use slow audio"],
      },
      priority: 9,
    });

    // Rule 3: Low speaking score → increase speaking time
    this.rules.push({
      id: "low_speaking",
      condition: (profile) => profile.speakingScore < 60,
      adjustment: {
        speakingTime: 40,
        focusRecommendations: ["Practice speaking more", "Shadow native speakers"],
      },
      priority: 8,
    });

    // Rule 4: Low grammar accuracy → increase grammar time
    this.rules.push({
      id: "low_grammar",
      condition: (profile) => profile.grammarAccuracy < 60,
      adjustment: {
        grammarTime: 35,
        focusRecommendations: ["Review grammar rules", "Practice grammar exercises"],
      },
      priority: 7,
    });

    // Rule 5: Low retention rate → reduce new words, increase review
    this.rules.push({
      id: "low_retention",
      condition: (profile) => profile.retentionRate < 0.7,
      adjustment: {
        newWordsCount: 5,
        reviewWordsCount: 20,
        focusRecommendations: ["Review old words", "Use spaced repetition"],
      },
      priority: 6,
    });

    // Rule 6: High performance → increase difficulty
    this.rules.push({
      id: "high_performance",
      condition: (profile) => 
        profile.vocabularyAccuracy >= 80 &&
        profile.listeningScore >= 80 &&
        profile.speakingScore >= 80 &&
        profile.grammarAccuracy >= 80,
      adjustment: {
        newWordsCount: 12,
        exerciseDifficulty: "hard",
        audioSpeed: "normal",
        focusRecommendations: ["Challenge yourself", "Try harder exercises"],
      },
      priority: 5,
    });

    // Rule 7: Beginner level → slow audio, simple exercises
    this.rules.push({
      id: "beginner_level",
      condition: (profile) => profile.difficultyLevel === "beginner",
      adjustment: {
        newWordsCount: 8,
        audioSpeed: "slow",
        exerciseDifficulty: "easy",
      },
      priority: 4,
    });

    // Rule 8: Long study time → reduce new words
    this.rules.push({
      id: "long_study_time",
      condition: (profile) => profile.totalStudyTime > 120,
      adjustment: {
        newWordsCount: 6,
        focusRecommendations: ["Take breaks", "Focus on quality over quantity"],
      },
      priority: 3,
    });

    // Rule 9: Short streak → encourage consistency
    this.rules.push({
      id: "short_streak",
      condition: (profile) => profile.currentStreak < 3,
      adjustment: {
        focusRecommendations: ["Study every day", "Build a habit"],
      },
      priority: 2,
    });

    // Rule 10: Default adjustments
    this.rules.push({
      id: "default",
      condition: () => true,
      adjustment: {
        newWordsCount: 10,
        reviewWordsCount: 10,
        vocabularyTime: 30,
        grammarTime: 25,
        listeningTime: 25,
        speakingTime: 25,
        readingTime: 20,
        writingTime: 20,
        exerciseDifficulty: "normal",
        audioSpeed: "normal",
      },
      priority: 1,
    });
  }

  /**
   * Analyze learner profile
   */
  analyzeProfile(profile: LearnerProfile): {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  } {
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const recommendations: string[] = [];

    // Analyze vocabulary
    if (profile.vocabularyAccuracy >= 80) {
      strengths.push("Vocabulary accuracy is excellent");
    } else if (profile.vocabularyAccuracy < 60) {
      weaknesses.push("Vocabulary accuracy needs improvement");
      recommendations.push("Review vocabulary more frequently");
    }

    // Analyze listening
    if (profile.listeningScore >= 80) {
      strengths.push("Listening skills are strong");
    } else if (profile.listeningScore < 60) {
      weaknesses.push("Listening skills need work");
      recommendations.push("Practice listening with slow audio");
    }

    // Analyze speaking
    if (profile.speakingScore >= 80) {
      strengths.push("Speaking skills are good");
    } else if (profile.speakingScore < 60) {
      weaknesses.push("Speaking skills need practice");
      recommendations.push("Practice shadowing native speakers");
    }

    // Analyze grammar
    if (profile.grammarAccuracy >= 80) {
      strengths.push("Grammar understanding is solid");
    } else if (profile.grammarAccuracy < 60) {
      weaknesses.push("Grammar needs review");
      recommendations.push("Review grammar rules and examples");
    }

    // Analyze retention
    if (profile.retentionRate >= 0.8) {
      strengths.push("Retention rate is high");
    } else if (profile.retentionRate < 0.7) {
      weaknesses.push("Retention rate is low");
      recommendations.push("Use spaced repetition more effectively");
    }

    return { strengths, weaknesses, recommendations };
  }

  /**
   * Generate daily mission adjustment
   */
  generateAdjustment(profile: LearnerProfile): DailyMissionAdjustment {
    // Sort rules by priority
    const sortedRules = [...this.rules].sort((a, b) => b.priority - a.priority);

    // Find matching rules
    const matchingRules = sortedRules.filter(rule => rule.condition(profile));

    // Merge adjustments (higher priority first)
    const mergedAdjustment: DailyMissionAdjustment = {
      newWordsCount: 10,
      reviewWordsCount: 10,
      vocabularyTime: 30,
      grammarTime: 25,
      listeningTime: 25,
      speakingTime: 25,
      readingTime: 20,
      writingTime: 20,
      exerciseDifficulty: "normal",
      audioSpeed: "normal",
      focusRecommendations: [],
      reasons: [],
    };

    matchingRules.forEach(rule => {
      Object.assign(mergedAdjustment, rule.adjustment);
      if (rule.adjustment.focusRecommendations) {
        mergedAdjustment.focusRecommendations.push(...rule.adjustment.focusRecommendations);
      }
      mergedAdjustment.reasons.push(`Rule: ${rule.id}`);
    });

    // Remove duplicate recommendations
    mergedAdjustment.focusRecommendations = [...new Set(mergedAdjustment.focusRecommendations)];

    return mergedAdjustment;
  }

  /**
   * Update difficulty level based on performance
   */
  updateDifficultyLevel(profile: LearnerProfile): DifficultyLevel {
    const avgScore = (
      profile.vocabularyAccuracy +
      profile.listeningScore +
      profile.speakingScore +
      profile.grammarAccuracy
    ) / 4;

    if (avgScore >= 80) return "intermediate";
    if (avgScore >= 60) return "elementary";
    return "beginner";
  }

  /**
   * Identify focus areas
   */
  identifyFocusAreas(profile: LearnerProfile): FocusArea[] {
    const areas: FocusArea[] = [];

    if (profile.vocabularyAccuracy < 70) {
      areas.push({
        skill: "vocabulary",
        priority: "high",
        reason: `Accuracy is ${profile.vocabularyAccuracy}%`,
      });
    }

    if (profile.listeningScore < 70) {
      areas.push({
        skill: "listening",
        priority: "high",
        reason: `Score is ${profile.listeningScore}%`,
      });
    }

    if (profile.speakingScore < 70) {
      areas.push({
        skill: "speaking",
        priority: "high",
        reason: `Score is ${profile.speakingScore}%`,
      });
    }

    if (profile.grammarAccuracy < 70) {
      areas.push({
        skill: "grammar",
        priority: "medium",
        reason: `Accuracy is ${profile.grammarAccuracy}%`,
      });
    }

    if (profile.retentionRate < 0.7) {
      areas.push({
        skill: "retention",
        priority: "high",
        reason: `Retention rate is ${Math.round(profile.retentionRate * 100)}%`,
      });
    }

    return areas;
  }

  /**
   * Generate profile summary
   */
  generateProfileSummary(profile: LearnerProfile): {
    overallLevel: string;
    skillBreakdown: Record<string, number>;
    recommendations: string[];
  } {
    const skillBreakdown = {
      vocabulary: profile.vocabularyAccuracy,
      listening: profile.listeningScore,
      speaking: profile.speakingScore,
      grammar: profile.grammarAccuracy,
      retention: profile.retentionRate * 100,
    };

    const avgScore = Object.values(skillBreakdown).reduce((a, b) => a + b, 0) / 5;

    let overallLevel: string;
    if (avgScore >= 80) overallLevel = "Intermediate";
    else if (avgScore >= 60) overallLevel = "Elementary";
    else if (avgScore >= 40) overallLevel = "Beginner";
    else overallLevel = "Absolute Beginner";

    const analysis = this.analyzeProfile(profile);

    return {
      overallLevel,
      skillBreakdown,
      recommendations: analysis.recommendations,
    };
  }
}
