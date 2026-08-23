/**
 * Learning Effectiveness Engine v1
 *
 * Analyzes learning effectiveness and provides health scores:
 * - Learning time analysis
 * - Input/output measurement
 * - Review effectiveness
 * - Forgetting rate
 * - Skill growth speed
 * - Learning Health Score
 */

// ============================================================
// Types
// ============================================================

export interface LearningMetrics {
  userId: string;
  period: "day" | "week" | "month" | "total";

  // Time metrics
  totalStudyMinutes: number;
  averageSessionMinutes: number;
  studyDays: number;
  streakDays: number;

  // Input metrics
  wordsExposed: number;
  wordsLearned: number;
  wordsMastered: number;
  listeningMinutes: number;
  readingMinutes: number;

  // Output metrics
  speakingAttempts: number;
  writingAttempts: number;
  conversationMinutes: number;

  // Review metrics
  reviewsCompleted: number;
  reviewAccuracy: number;
  srsEfficiency: number;

  // Retention metrics
  retentionRate: number;
  forgettingRate: number;
  reviewInterval: number;

  // Skill scores (0-100)
  vocabularyScore: number;
  listeningScore: number;
  speakingScore: number;
  grammarScore: number;
  readingScore: number;
  writingScore: number;
  pronunciationScore: number;
}

export interface LearningHealthScore {
  overall: number; // 0-100
  breakdown: {
    vocabulary: number;
    listening: number;
    speaking: number;
    grammar: number;
    reading: number;
    writing: number;
    pronunciation: number;
  };
  trend: "improving" | "stable" | "declining";
  insights: LearningInsight[];
  recommendations: string[];
}

export interface LearningInsight {
  type: "strength" | "weakness" | "plateau" | "breakthrough";
  skill: string;
  description: string;
  descriptionChinese: string;
  evidence: string;
  action: string;
}

export interface SkillGrowth {
  skill: string;
  currentScore: number;
  previousScore: number;
  growthRate: number; // percentage
  timeToMaster: number; // estimated days
  trajectory: "ahead" | "on_track" | "behind";
}

export interface LearningPattern {
  type: "consistent" | "sporadic" | "intensive" | "declining";
  description: string;
  descriptionChinese: string;
  impact: "positive" | "neutral" | "negative";
}

// ============================================================
// Learning Effectiveness Engine
// ============================================================

export class EffectivenessEngineV1 {
  private metricsHistory: Map<string, LearningMetrics[]> = new Map();

  /**
   * Calculate learning health score
   */
  calculateHealthScore(metrics: LearningMetrics): LearningHealthScore {
    // Calculate skill scores
    const vocabulary = this.calculateVocabularyHealth(metrics);
    const listening = this.calculateListeningHealth(metrics);
    const speaking = this.calculateSpeakingHealth(metrics);
    const grammar = this.calculateGrammarHealth(metrics);
    const reading = this.calculateReadingHealth(metrics);
    const writing = this.calculateWritingHealth(metrics);
    const pronunciation = this.calculatePronunciationHealth(metrics);

    // Calculate overall score
    const overall = Math.round(
      (vocabulary * 0.25 +
        listening * 0.2 +
        speaking * 0.2 +
        grammar * 0.15 +
        reading * 0.1 +
        writing * 0.05 +
        pronunciation * 0.05)
    );

    // Calculate trend
    const trend = this.calculateTrend(metrics.userId);

    // Generate insights
    const insights = this.generateInsights(metrics, {
      vocabulary,
      listening,
      speaking,
      grammar,
      reading,
      writing,
      pronunciation,
    });

    // Generate recommendations
    const recommendations = this.generateRecommendations(metrics, {
      vocabulary,
      listening,
      speaking,
      grammar,
      reading,
      writing,
      pronunciation,
    });

    return {
      overall,
      breakdown: {
        vocabulary,
        listening,
        speaking,
        grammar,
        reading,
        writing,
        pronunciation,
      },
      trend,
      insights,
      recommendations,
    };
  }

  /**
   * Calculate vocabulary health
   */
  private calculateVocabularyHealth(metrics: LearningMetrics): number {
    let score = 50; // Base score

    // Word learning rate
    if (metrics.wordsLearned > 100) score += 10;
    if (metrics.wordsLearned > 300) score += 10;
    if (metrics.wordsLearned > 500) score += 10;

    // Mastery rate
    if (metrics.wordsMastered > 0) {
      const masteryRate = metrics.wordsMastered / metrics.wordsLearned;
      if (masteryRate > 0.5) score += 10;
      if (masteryRate > 0.7) score += 10;
    }

    // Retention
    if (metrics.retentionRate > 0.7) score += 10;
    if (metrics.retentionRate > 0.85) score += 10;

    return Math.min(100, score);
  }

  /**
   * Calculate listening health
   */
  private calculateListeningHealth(metrics: LearningMetrics): number {
    let score = 30; // Base score

    // Listening time
    if (metrics.listeningMinutes > 60) score += 15;
    if (metrics.listeningMinutes > 200) score += 15;
    if (metrics.listeningMinutes > 500) score += 15;

    // Review accuracy for listening
    if (metrics.reviewAccuracy > 0.6) score += 10;
    if (metrics.reviewAccuracy > 0.8) score += 10;

    return Math.min(100, score);
  }

  /**
   * Calculate speaking health
   */
  private calculateSpeakingHealth(metrics: LearningMetrics): number {
    let score = 20; // Base score

    // Speaking attempts
    if (metrics.speakingAttempts > 50) score += 15;
    if (metrics.speakingAttempts > 200) score += 15;
    if (metrics.speakingAttempts > 500) score += 15;

    // Conversation time
    if (metrics.conversationMinutes > 30) score += 10;
    if (metrics.conversationMinutes > 100) score += 10;

    // Pronunciation score
    if (metrics.pronunciationScore > 60) score += 10;
    if (metrics.pronunciationScore > 80) score += 5;

    return Math.min(100, score);
  }

  /**
   * Calculate grammar health
   */
  private calculateGrammarHealth(metrics: LearningMetrics): number {
    let score = 40; // Base score

    // Grammar score from assessment
    if (metrics.grammarScore > 50) score += 15;
    if (metrics.grammarScore > 70) score += 15;
    if (metrics.grammarScore > 85) score += 10;

    // Writing accuracy indicates grammar
    if (metrics.writingAttempts > 20) score += 10;
    if (metrics.writingAttempts > 50) score += 10;

    return Math.min(100, score);
  }

  /**
   * Calculate reading health
   */
  private calculateReadingHealth(metrics: LearningMetrics): number {
    let score = 30; // Base score

    // Reading time
    if (metrics.readingMinutes > 60) score += 15;
    if (metrics.readingMinutes > 200) score += 15;
    if (metrics.readingMinutes > 500) score += 15;

    // Words exposed (reading input)
    if (metrics.wordsExposed > 1000) score += 10;
    if (metrics.wordsExposed > 5000) score += 10;

    return Math.min(100, score);
  }

  /**
   * Calculate writing health
   */
  private calculateWritingHealth(metrics: LearningMetrics): number {
    let score = 25; // Base score

    // Writing attempts
    if (metrics.writingAttempts > 10) score += 15;
    if (metrics.writingAttempts > 30) score += 15;
    if (metrics.writingAttempts > 100) score += 15;

    // Writing score
    if (metrics.writingScore > 50) score += 15;
    if (metrics.writingScore > 70) score += 15;

    return Math.min(100, score);
  }

  /**
   * Calculate pronunciation health
   */
  private calculatePronunciationHealth(metrics: LearningMetrics): number {
    let score = 30; // Base score

    // Pronunciation score
    if (metrics.pronunciationScore > 50) score += 20;
    if (metrics.pronunciationScore > 70) score += 20;
    if (metrics.pronunciationScore > 85) score += 15;

    // Speaking attempts indicate practice
    if (metrics.speakingAttempts > 100) score += 15;

    return Math.min(100, score);
  }

  /**
   * Calculate trend
   */
  private calculateTrend(userId: string): "improving" | "stable" | "declining" {
    const history = this.metricsHistory.get(userId) || [];
    if (history.length < 2) return "stable";

    const recent = history.slice(-3);
    const older = history.slice(0, 3);

    const recentAvg = recent.reduce((sum, m) => sum + this.calculateOverallScore(m), 0) / recent.length;
    const olderAvg = older.reduce((sum, m) => sum + this.calculateOverallScore(m), 0) / older.length;

    if (recentAvg > olderAvg + 5) return "improving";
    if (recentAvg < olderAvg - 5) return "declining";
    return "stable";
  }

  /**
   * Calculate overall score from metrics
   */
  private calculateOverallScore(metrics: LearningMetrics): number {
    return (
      metrics.vocabularyScore * 0.25 +
      metrics.listeningScore * 0.2 +
      metrics.speakingScore * 0.2 +
      metrics.grammarScore * 0.15 +
      metrics.readingScore * 0.1 +
      metrics.writingScore * 0.05 +
      metrics.pronunciationScore * 0.05
    );
  }

  /**
   * Generate insights
   */
  private generateInsights(
    metrics: LearningMetrics,
    scores: Record<string, number>
  ): LearningInsight[] {
    const insights: LearningInsight[] = [];

    // Find strengths
    for (const [skill, score] of Object.entries(scores)) {
      if (score >= 80) {
        insights.push({
          type: "strength",
          skill,
          description: `${skill} is a strong area`,
          descriptionChinese: `${skill}是你的强项`,
          evidence: `Score: ${score}%`,
          action: "Maintain with regular practice",
        });
      }
    }

    // Find weaknesses
    for (const [skill, score] of Object.entries(scores)) {
      if (score < 50) {
        insights.push({
          type: "weakness",
          skill,
          description: `${skill} needs improvement`,
          descriptionChinese: `${skill}需要提高`,
          evidence: `Score: ${score}%`,
          action: `Focus on ${skill} practice`,
        });
      }
    }

    // Check for plateaus
    if (metrics.retentionRate < 0.6) {
      insights.push({
        type: "plateau",
        skill: "retention",
        description: "Retention rate is low",
        descriptionChinese: "记忆率偏低",
        evidence: `Retention: ${Math.round(metrics.retentionRate * 100)}%`,
        action: "Review more frequently, use active recall",
      });
    }

    // Check for breakthroughs
    if (metrics.wordsMastered > 100 && metrics.retentionRate > 0.8) {
      insights.push({
        type: "breakthrough",
        skill: "vocabulary",
        description: "Excellent vocabulary retention",
        descriptionChinese: "词汇记忆非常好",
        evidence: `${metrics.wordsMastered} words mastered`,
        action: "Increase new vocabulary rate",
      });
    }

    return insights;
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(
    metrics: LearningMetrics,
    scores: Record<string, number>
  ): string[] {
    const recommendations: string[] = [];

    // Time-based recommendations
    if (metrics.totalStudyMinutes < 100) {
      recommendations.push("Increase daily study time to at least 30 minutes");
    }

    // Skill-based recommendations
    if (scores.listening < 50) {
      recommendations.push("Add 15 minutes of daily listening practice");
    }
    if (scores.speaking < 50) {
      recommendations.push("Practice speaking for 10 minutes daily");
    }
    if (scores.vocabulary < 60) {
      recommendations.push("Review vocabulary with SRS daily");
    }

    // Retention recommendations
    if (metrics.retentionRate < 0.7) {
      recommendations.push("Review words more frequently to improve retention");
    }

    // Balance recommendations
    const skillScores = Object.values(scores);
    const maxScore = Math.max(...skillScores);
    const minScore = Math.min(...skillScores);
    if (maxScore - minScore > 30) {
      recommendations.push("Balance your practice across all skills");
    }

    return recommendations;
  }

  /**
   * Record metrics
   */
  recordMetrics(userId: string, metrics: LearningMetrics): void {
    const history = this.metricsHistory.get(userId) || [];
    history.push(metrics);
    this.metricsHistory.set(userId, history);
  }

  /**
   * Get skill growth analysis
   */
  getSkillGrowth(userId: string, skill: string): SkillGrowth | null {
    const history = this.metricsHistory.get(userId) || [];
    if (history.length < 2) return null;

    const recent = history[history.length - 1];
    const previous = history[history.length - 2];

    const getSkillScore = (m: LearningMetrics, s: string): number => {
      switch (s) {
        case "vocabulary": return m.vocabularyScore;
        case "listening": return m.listeningScore;
        case "speaking": return m.speakingScore;
        case "grammar": return m.grammarScore;
        case "reading": return m.readingScore;
        case "writing": return m.writingScore;
        case "pronunciation": return m.pronunciationScore;
        default: return 0;
      }
    };

    const currentScore = getSkillScore(recent, skill);
    const previousScore = getSkillScore(previous, skill);
    const growthRate = previousScore > 0
      ? ((currentScore - previousScore) / previousScore) * 100
      : 0;

    const timeToMaster = currentScore > 0
      ? Math.round(((100 - currentScore) / Math.max(growthRate, 1)) * 30)
      : 365;

    let trajectory: "ahead" | "on_track" | "behind" = "on_track";
    if (growthRate > 10) trajectory = "ahead";
    else if (growthRate < 0) trajectory = "behind";

    return {
      skill,
      currentScore,
      previousScore,
      growthRate,
      timeToMaster,
      trajectory,
    };
  }

  /**
   * Get learning patterns
   */
  getLearningPatterns(userId: string): LearningPattern[] {
    const history = this.metricsHistory.get(userId) || [];
    const patterns: LearningPattern[] = [];

    if (history.length < 3) {
      return patterns;
    }

    // Check consistency
    const studyDays = history.map(m => m.studyDays);
    const avgStudyDays = studyDays.reduce((a, b) => a + b, 0) / studyDays.length;
    if (avgStudyDays > 20) {
      patterns.push({
        type: "consistent",
        description: "Regular study pattern",
        descriptionChinese: "规律的学习模式",
        impact: "positive",
      });
    } else if (avgStudyDays < 10) {
      patterns.push({
        type: "sporadic",
        description: "Irregular study pattern",
        descriptionChinese: "不规律的学习模式",
        impact: "negative",
      });
    }

    // Check for intensive periods
    const recentMinutes = history.slice(-7).map(m => m.totalStudyMinutes);
    const avgRecentMinutes = recentMinutes.reduce((a, b) => a + b, 0) / recentMinutes.length;
    if (avgRecentMinutes > 300) {
      patterns.push({
        type: "intensive",
        description: "Intensive study period",
        descriptionChinese: "高强度学习期",
        impact: "positive",
      });
    }

    // Check for decline
    if (history.length >= 5) {
      const recent = history.slice(-3);
      const older = history.slice(0, 3);
      const recentAvg = recent.reduce((sum, m) => sum + m.totalStudyMinutes, 0) / recent.length;
      const olderAvg = older.reduce((sum, m) => sum + m.totalStudyMinutes, 0) / older.length;
      if (recentAvg < olderAvg * 0.7) {
        patterns.push({
          type: "declining",
          description: "Study time decreasing",
          descriptionChinese: "学习时间减少",
          impact: "negative",
        });
      }
    }

    return patterns;
  }
}
