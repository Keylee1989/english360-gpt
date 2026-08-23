/**
 * Learning Effectiveness Engine v3
 *
 * Measures learning effectiveness with:
 * - Learning Health Score (0-100)
 * - Factor-based analysis
 * - Weekly/Monthly reports
 * - Problem diagnosis
 * - Improvement suggestions
 */

// ============================================================
// Types
// ============================================================

export interface LearningEffectivenessData {
  userId: string;

  // Study consistency (25 points)
  studyDays: number;
  targetStudyDays: number;
  averageStudyMinutes: number;
  targetStudyMinutes: number;

  // Retention (25 points)
  totalWordsLearned: number;
  wordsMastered: number;
  reviewAccuracy: number;

  // Speaking improvement (20 points)
  speakingPracticeCount: number;
  speakingAccuracy: number;
  shadowingCompleted: number;

  // Listening improvement (15 points)
  listeningScore: number;
  listeningPracticeMinutes: number;

  // Vocabulary growth (15 points)
  wordsLearnedThisWeek: number;
  wordsLearnedLastWeek: number;
  vocabularyRetentionRate: number;
}

export interface LearningHealthScore {
  total: number; // 0-100
  factors: {
    consistency: number; // 0-25
    retention: number; // 0-25
    speaking: number; // 0-20
    listening: number; // 0-15
    vocabulary: number; // 0-15
  };
  grade: "A+" | "A" | "B+" | "B" | "C+" | "C" | "D" | "F";
  diagnosis: string[];
  recommendations: string[];
}

export interface WeeklyReport {
  weekNumber: number;
  startDate: string;
  endDate: string;
  vocabularyGrowth: number;
  listeningImprovement: number;
  speakingImprovement: number;
  studyMinutes: number;
  healthScore: LearningHealthScore;
  highlights: string[];
  problems: string[];
  recommendations: string[];
}

export interface MonthlyReport {
  monthNumber: number;
  startDate: string;
  endDate: string;
  totalVocabulary: number;
  vocabularyGrowth: number;
  listeningAbility: string;
  speakingAbility: string;
  grammarMastery: string;
  healthScore: LearningHealthScore;
  milestones: string[];
  recommendations: string[];
}

// ============================================================
// Learning Effectiveness Engine v3
// ============================================================

export class LearningEffectivenessEngineV3 {
  /**
   * Calculate learning health score
   */
  calculateHealthScore(data: LearningEffectivenessData): LearningHealthScore {
    // 1. Study consistency (25 points)
    const consistencyScore = this.calculateConsistencyScore(data);

    // 2. Retention (25 points)
    const retentionScore = this.calculateRetentionScore(data);

    // 3. Speaking improvement (20 points)
    const speakingScore = this.calculateSpeakingScore(data);

    // 4. Listening improvement (15 points)
    const listeningScore = this.calculateListeningScore(data);

    // 5. Vocabulary growth (15 points)
    const vocabularyScore = this.calculateVocabularyScore(data);

    // Total score
    const total = Math.round(
      consistencyScore + retentionScore + speakingScore + listeningScore + vocabularyScore
    );

    // Determine grade
    const grade = this.getGrade(total);

    // Generate diagnosis
    const diagnosis = this.generateDiagnosis(data, {
      consistency: consistencyScore,
      retention: retentionScore,
      speaking: speakingScore,
      listening: listeningScore,
      vocabulary: vocabularyScore,
    });

    // Generate recommendations
    const recommendations = this.generateRecommendations(data, {
      consistency: consistencyScore,
      retention: retentionScore,
      speaking: speakingScore,
      listening: listeningScore,
      vocabulary: vocabularyScore,
    });

    return {
      total,
      factors: {
        consistency: Math.round(consistencyScore),
        retention: Math.round(retentionScore),
        speaking: Math.round(speakingScore),
        listening: Math.round(listeningScore),
        vocabulary: Math.round(vocabularyScore),
      },
      grade,
      diagnosis,
      recommendations,
    };
  }

  /**
   * Calculate consistency score (0-25)
   */
  private calculateConsistencyScore(data: LearningEffectivenessData): number {
    // Study days ratio
    const dayRatio = Math.min(data.studyDays / data.targetStudyDays, 1);
    const dayScore = dayRatio * 15;

    // Study time ratio
    const timeRatio = Math.min(data.averageStudyMinutes / data.targetStudyMinutes, 1);
    const timeScore = timeRatio * 10;

    return dayScore + timeScore;
  }

  /**
   * Calculate retention score (0-25)
   */
  private calculateRetentionScore(data: LearningEffectivenessData): number {
    // Mastered words ratio
    const masteryRatio = data.totalWordsLearned > 0
      ? data.wordsMastered / data.totalWordsLearned
      : 0;
    const masteryScore = masteryRatio * 15;

    // Review accuracy
    const accuracyScore = (data.reviewAccuracy / 100) * 10;

    return masteryScore + accuracyScore;
  }

  /**
   * Calculate speaking score (0-20)
   */
  private calculateSpeakingScore(data: LearningEffectivenessData): number {
    // Practice count (max 10 points)
    const practiceScore = Math.min(data.speakingPracticeCount / 10, 1) * 10;

    // Speaking accuracy (max 10 points)
    const accuracyScore = (data.speakingAccuracy / 100) * 10;

    return practiceScore + accuracyScore;
  }

  /**
   * Calculate listening score (0-15)
   */
  private calculateListeningScore(data: LearningEffectivenessData): number {
    // Listening score (max 10 points)
    const scorePoints = (data.listeningScore / 100) * 10;

    // Practice minutes (max 5 points)
    const practicePoints = Math.min(data.listeningPracticeMinutes / 60, 1) * 5;

    return scorePoints + practicePoints;
  }

  /**
   * Calculate vocabulary score (0-15)
   */
  private calculateVocabularyScore(data: LearningEffectivenessData): number {
    // Growth comparison
    const growthRatio = data.wordsLearnedLastWeek > 0
      ? data.wordsLearnedThisWeek / data.wordsLearnedLastWeek
      : data.wordsLearnedThisWeek > 0 ? 1 : 0;
    const growthScore = Math.min(growthRatio, 1.5) * 8;

    // Retention rate
    const retentionScore = (data.vocabularyRetentionRate / 100) * 7;

    return growthScore + retentionScore;
  }

  /**
   * Get grade from score
   */
  private getGrade(score: number): LearningHealthScore["grade"] {
    if (score >= 95) return "A+";
    if (score >= 90) return "A";
    if (score >= 85) return "B+";
    if (score >= 80) return "B";
    if (score >= 70) return "C+";
    if (score >= 60) return "C";
    if (score >= 50) return "D";
    return "F";
  }

  /**
   * Generate diagnosis
   */
  private generateDiagnosis(
    data: LearningEffectivenessData,
    factors: LearningHealthScore["factors"]
  ): string[] {
    const diagnosis: string[] = [];

    // Consistency issues
    if (factors.consistency < 15) {
      diagnosis.push("学习时间不够稳定，建议每天固定时间学习");
    }

    // Retention issues
    if (factors.retention < 15) {
      diagnosis.push("单词记忆效果需要提高，建议增加复习频率");
    }

    // Speaking issues
    if (factors.speaking < 12) {
      diagnosis.push("口语练习不足，建议每天至少练习15分钟");
    }

    // Listening issues
    if (factors.listening < 9) {
      diagnosis.push("听力练习需要加强，建议多听慢速英语");
    }

    // Vocabulary issues
    if (factors.vocabulary < 9) {
      diagnosis.push("词汇增长较慢，建议每天学习8-10个新单词");
    }

    // Specific problems
    if (data.reviewAccuracy < 60) {
      diagnosis.push("复习正确率较低，建议重点复习错误单词");
    }

    if (data.wordsMastered < data.totalWordsLearned * 0.3) {
      diagnosis.push("已掌握单词比例较低，建议放慢学习速度，加强巩固");
    }

    return diagnosis;
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(
    _data: LearningEffectivenessData,
    factors: LearningHealthScore["factors"]
  ): string[] {
    const recommendations: string[] = [];

    // Consistency recommendations
    if (factors.consistency < 15) {
      recommendations.push("每天固定学习时间，至少30分钟");
    }

    // Retention recommendations
    if (factors.retention < 15) {
      recommendations.push("使用SRS复习系统，每天复习20个单词");
    }

    // Speaking recommendations
    if (factors.speaking < 12) {
      recommendations.push("每天进行15分钟跟读练习");
      recommendations.push("尝试用英语描述身边的事物");
    }

    // Listening recommendations
    if (factors.listening < 9) {
      recommendations.push("每天听30分钟慢速英语");
      recommendations.push("先听慢速，再听正常速度");
    }

    // Vocabulary recommendations
    if (factors.vocabulary < 9) {
      recommendations.push("每天学习8-10个新单词");
      recommendations.push("使用联想法记忆单词");
    }

    return recommendations;
  }

  /**
   * Generate weekly report
   */
  generateWeeklyReport(
    data: LearningEffectivenessData,
    weekNumber: number
  ): WeeklyReport {
    const healthScore = this.calculateHealthScore(data);

    const highlights: string[] = [];
    const problems: string[] = [];

    // Highlights
    if (data.wordsLearnedThisWeek > 50) {
      highlights.push(`本周学习了${data.wordsLearnedThisWeek}个新单词`);
    }
    if (data.speakingPracticeCount > 20) {
      highlights.push("口语练习非常积极");
    }
    if (data.reviewAccuracy > 80) {
      highlights.push("复习正确率很高");
    }

    // Problems
    if (data.studyDays < 5) {
      problems.push("学习天数不足");
    }
    if (data.speakingPracticeCount < 10) {
      problems.push("口语练习较少");
    }
    if (data.listeningPracticeMinutes < 120) {
      problems.push("听力练习时间不足");
    }

    return {
      weekNumber,
      startDate: `Week ${weekNumber} Start`,
      endDate: `Week ${weekNumber} End`,
      vocabularyGrowth: data.wordsLearnedThisWeek,
      listeningImprovement: Math.round(data.listeningScore * 0.1),
      speakingImprovement: Math.round(data.speakingAccuracy * 0.1),
      studyMinutes: data.averageStudyMinutes * 7,
      healthScore,
      highlights,
      problems,
      recommendations: healthScore.recommendations,
    };
  }

  /**
   * Generate monthly report
   */
  generateMonthlyReport(
    data: LearningEffectivenessData,
    monthNumber: number
  ): MonthlyReport {
    const healthScore = this.calculateHealthScore(data);

    const getListeningAbility = (score: number): string => {
      if (score >= 80) return "能听懂日常对话";
      if (score >= 60) return "能听懂慢速英语";
      if (score >= 40) return "能听懂简单句子";
      return "刚开始学习听力";
    };

    const getSpeakingAbility = (score: number): string => {
      if (score >= 80) return "能进行简单对话";
      if (score >= 60) return "能说基本句子";
      if (score >= 40) return "能说单词和短语";
      return "刚开始学习口语";
    };

    const getGrammarMastery = (score: number): string => {
      if (score >= 80) return "掌握基础语法";
      if (score >= 60) return "语法基本正确";
      if (score >= 40) return "需要加强语法练习";
      return "语法初学阶段";
    };

    const milestones: string[] = [];
    if (data.totalWordsLearned >= 100) milestones.push("掌握100个单词");
    if (data.totalWordsLearned >= 200) milestones.push("掌握200个单词");
    if (data.totalWordsLearned >= 300) milestones.push("掌握300个单词");
    if (data.wordsMastered >= 50) milestones.push("50个单词达到掌握");
    if (data.speakingPracticeCount >= 50) milestones.push("完成50次口语练习");

    return {
      monthNumber,
      startDate: `Month ${monthNumber} Start`,
      endDate: `Month ${monthNumber} End`,
      totalVocabulary: data.totalWordsLearned,
      vocabularyGrowth: data.wordsLearnedThisWeek * 4,
      listeningAbility: getListeningAbility(data.listeningScore),
      speakingAbility: getSpeakingAbility(data.speakingAccuracy),
      grammarMastery: getGrammarMastery(data.reviewAccuracy),
      healthScore,
      milestones,
      recommendations: healthScore.recommendations,
    };
  }
}

// ============================================================
// Factory Function
// ============================================================

export function createEffectivenessEngine(): LearningEffectivenessEngineV3 {
  return new LearningEffectivenessEngineV3();
}

export default LearningEffectivenessEngineV3;
