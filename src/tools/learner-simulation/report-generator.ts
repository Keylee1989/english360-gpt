/**
 * Learner Simulation Report Generator
 *
 * Generates comprehensive reports on learning effectiveness
 * based on simulated learner data.
 */

export interface SimulationDayStats {
  day: number;
  wordsLearned: number;
  wordsMastered: number;
  vocabularyAccuracy: number;
  listeningScore: number;
  speakingScore: number;
  grammarAccuracy: number;
  pronunciationScore: number;
  retentionRate: number;
  totalStudyMinutes: number;
  dailyStats: {
    newWords: number;
    reviewWords: number;
    correctAnswers: number;
    totalAnswers: number;
    listeningExercises: number;
    speakingExercises: number;
  };
}

export interface SimulationReport {
  metadata: {
    learnerProfile: string;
    totalDays: number;
    totalStudyHours: number;
    generatedAt: string;
  };
  summary: {
    finalVocabularyAccuracy: number;
    finalListeningScore: number;
    finalSpeakingScore: number;
    finalGrammarAccuracy: number;
    finalRetentionRate: number;
    totalWordsLearned: number;
    totalWordsMastered: number;
  };
  milestones: MilestoneResult[];
  strengths: string[];
  weaknesses: string[];
  bottlenecks: LearningBottleneck[];
  recommendations: string[];
  curriculumEffectiveness: CurriculumEffectiveness;
}

export interface MilestoneResult {
  day: number;
  name: string;
  nameChinese: string;
  achieved: boolean;
  actualMetrics: {
    wordsLearned: number;
    vocabularyAccuracy: number;
    listeningScore: number;
    speakingScore: number;
  };
  targetMetrics: {
    wordsLearned: number;
    vocabularyAccuracy: number;
    listeningScore: number;
    speakingScore: number;
  };
}

export interface LearningBottleneck {
  skill: string;
  severity: "critical" | "major" | "minor";
  description: string;
  descriptionChinese: string;
  affectedDays: number[];
  recommendedFix: string;
}

export interface CurriculumEffectiveness {
  stage1: StageEffectiveness;
  stage2: StageEffectiveness;
  overallScore: number;
}

export interface StageEffectiveness {
  stage: number;
  days: number;
  averageAccuracy: number;
  averageRetention: number;
  wordsLearned: number;
  effectivenessScore: number;
}

/**
 * Generate simulation report from daily stats
 */
export function generateSimulationReport(
  dailyStats: SimulationDayStats[]
): SimulationReport {
  if (dailyStats.length === 0) {
    throw new Error("No daily stats provided");
  }

  const finalStats = dailyStats[dailyStats.length - 1];

  // Calculate summary
  const summary = {
    finalVocabularyAccuracy: finalStats.vocabularyAccuracy,
    finalListeningScore: finalStats.listeningScore,
    finalSpeakingScore: finalStats.speakingScore,
    finalGrammarAccuracy: finalStats.grammarAccuracy,
    finalRetentionRate: finalStats.retentionRate,
    totalWordsLearned: finalStats.wordsLearned,
    totalWordsMastered: finalStats.wordsMastered,
  };

  // Check milestones
  const milestones = checkMilestones(dailyStats);

  // Identify strengths and weaknesses
  const strengths = identifyStrengths(finalStats);
  const weaknesses = identifyWeaknesses(finalStats);

  // Identify bottlenecks
  const bottlenecks = identifyBottlenecks(dailyStats);

  // Generate recommendations
  const recommendations = generateRecommendations(finalStats, bottlenecks);

  // Calculate curriculum effectiveness
  const curriculumEffectiveness = calculateCurriculumEffectiveness(dailyStats);

  return {
    metadata: {
      learnerProfile: "Chinese native, age 38, zero English foundation",
      totalDays: dailyStats.length,
      totalStudyHours: Math.round(finalStats.totalStudyMinutes / 60),
      generatedAt: new Date().toISOString(),
    },
    summary,
    milestones,
    strengths,
    weaknesses,
    bottlenecks,
    recommendations,
    curriculumEffectiveness,
  };
}

/**
 * Check learning milestones
 */
function checkMilestones(dailyStats: SimulationDayStats[]): MilestoneResult[] {
  const milestones: MilestoneResult[] = [
    {
      day: 30,
      name: "Foundation Complete",
      nameChinese: "基础完成",
      achieved: false,
      actualMetrics: { wordsLearned: 0, vocabularyAccuracy: 0, listeningScore: 0, speakingScore: 0 },
      targetMetrics: { wordsLearned: 200, vocabularyAccuracy: 50, listeningScore: 25, speakingScore: 15 },
    },
    {
      day: 60,
      name: "Basic Communication",
      nameChinese: "基本交流",
      achieved: false,
      actualMetrics: { wordsLearned: 0, vocabularyAccuracy: 0, listeningScore: 0, speakingScore: 0 },
      targetMetrics: { wordsLearned: 500, vocabularyAccuracy: 60, listeningScore: 40, speakingScore: 30 },
    },
    {
      day: 90,
      name: "Daily Conversation",
      nameChinese: "日常对话",
      achieved: false,
      actualMetrics: { wordsLearned: 0, vocabularyAccuracy: 0, listeningScore: 0, speakingScore: 0 },
      targetMetrics: { wordsLearned: 800, vocabularyAccuracy: 70, listeningScore: 50, speakingScore: 40 },
    },
    {
      day: 180,
      name: "Intermediate Communication",
      nameChinese: "中级交流",
      achieved: false,
      actualMetrics: { wordsLearned: 0, vocabularyAccuracy: 0, listeningScore: 0, speakingScore: 0 },
      targetMetrics: { wordsLearned: 1500, vocabularyAccuracy: 80, listeningScore: 60, speakingScore: 50 },
    },
  ];

  for (const milestone of milestones) {
    const dayStats = dailyStats.find(s => s.day === milestone.day);
    if (dayStats) {
      milestone.actualMetrics = {
        wordsLearned: dayStats.wordsLearned,
        vocabularyAccuracy: dayStats.vocabularyAccuracy,
        listeningScore: dayStats.listeningScore,
        speakingScore: dayStats.speakingScore,
      };

      // Check if milestone achieved
      milestone.achieved =
        dayStats.wordsLearned >= milestone.targetMetrics.wordsLearned &&
        dayStats.vocabularyAccuracy >= milestone.targetMetrics.vocabularyAccuracy &&
        dayStats.listeningScore >= milestone.targetMetrics.listeningScore &&
        dayStats.speakingScore >= milestone.targetMetrics.speakingScore;
    }
  }

  return milestones;
}

/**
 * Identify learning strengths
 */
function identifyStrengths(stats: SimulationDayStats): string[] {
  const strengths: string[] = [];

  if (stats.vocabularyAccuracy >= 80) {
    strengths.push("Vocabulary acquisition is excellent");
  }
  if (stats.listeningScore >= 70) {
    strengths.push("Listening comprehension is strong");
  }
  if (stats.speakingScore >= 60) {
    strengths.push("Speaking ability is developing well");
  }
  if (stats.grammarAccuracy >= 75) {
    strengths.push("Grammar understanding is solid");
  }
  if (stats.retentionRate >= 0.85) {
    strengths.push("Memory retention is excellent");
  }

  return strengths;
}

/**
 * Identify learning weaknesses
 */
function identifyWeaknesses(stats: SimulationDayStats): string[] {
  const weaknesses: string[] = [];

  if (stats.vocabularyAccuracy < 60) {
    weaknesses.push("Vocabulary retention needs improvement");
  }
  if (stats.listeningScore < 40) {
    weaknesses.push("Listening comprehension is a significant weakness");
  }
  if (stats.speakingScore < 35) {
    weaknesses.push("Speaking production needs more practice");
  }
  if (stats.grammarAccuracy < 55) {
    weaknesses.push("Grammar accuracy needs attention");
  }
  if (stats.retentionRate < 0.7) {
    weaknesses.push("Overall retention rate is below target");
  }

  return weaknesses;
}

/**
 * Identify learning bottlenecks
 */
function identifyBottlenecks(dailyStats: SimulationDayStats[]): LearningBottleneck[] {
  const bottlenecks: LearningBottleneck[] = [];

  // Check for listening bottleneck (common for Chinese learners)
  const listeningGrowth = calculateGrowthRate(dailyStats, "listeningScore");
  if (listeningGrowth < 0.3) {
    bottlenecks.push({
      skill: "listening",
      severity: "major",
      description: "Listening comprehension is not improving at expected rate",
      descriptionChinese: "听力理解没有以预期速度提高",
      affectedDays: findPlateauDays(dailyStats, "listeningScore"),
      recommendedFix: "Increase listening practice with varied audio speeds and accents",
    });
  }

  // Check for speaking bottleneck
  const speakingGrowth = calculateGrowthRate(dailyStats, "speakingScore");
  if (speakingGrowth < 0.25) {
    bottlenecks.push({
      skill: "speaking",
      severity: "major",
      description: "Speaking production is developing slowly",
      descriptionChinese: "口语产出发展缓慢",
      affectedDays: findPlateauDays(dailyStats, "speakingScore"),
      recommendedFix: "Add more shadowing and conversation practice",
    });
  }

  // Check for retention bottleneck
  const retentionStats = dailyStats.filter(s => s.day > 30);
  const avgRetention = retentionStats.reduce((sum, s) => sum + s.retentionRate, 0) / retentionStats.length;
  if (avgRetention < 0.7) {
    bottlenecks.push({
      skill: "retention",
      severity: "critical",
      description: "Overall retention rate is consistently low",
      descriptionChinese: "整体记忆率持续偏低",
      affectedDays: dailyStats.filter(s => s.retentionRate < 0.7).map(s => s.day),
      recommendedFix: "Review SRS intervals and increase review frequency",
    });
  }

  return bottlenecks;
}

/**
 * Calculate growth rate for a metric
 */
function calculateGrowthRate(
  dailyStats: SimulationDayStats[],
  metric: keyof SimulationDayStats
): number {
  if (dailyStats.length < 30) return 0;

  const firstMonth = dailyStats.slice(0, 30);
  const lastMonth = dailyStats.slice(-30);

  const firstAvg = firstMonth.reduce((sum, s) => sum + (s[metric] as number), 0) / firstMonth.length;
  const lastAvg = lastMonth.reduce((sum, s) => sum + (s[metric] as number), 0) / lastMonth.length;

  return firstAvg > 0 ? (lastAvg - firstAvg) / firstAvg : 0;
}

/**
 * Find plateau days for a metric
 */
function findPlateauDays(
  dailyStats: SimulationDayStats[],
  metric: keyof SimulationDayStats
): number[] {
  const plateauDays: number[] = [];
  const windowSize = 7;

  for (let i = windowSize; i < dailyStats.length; i++) {
    const window = dailyStats.slice(i - windowSize, i);
    const values = window.map(s => s[metric] as number);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / values.length;

    // If variance is very low, it's a plateau
    if (variance < 1) {
      plateauDays.push(dailyStats[i].day);
    }
  }

  return plateauDays;
}

/**
 * Generate recommendations
 */
function generateRecommendations(
  stats: SimulationDayStats,
  bottlenecks: LearningBottleneck[]
): string[] {
  const recommendations: string[] = [];

  // Base recommendations
  if (stats.retentionRate < 0.8) {
    recommendations.push("Increase daily review sessions to improve retention");
  }
  if (stats.listeningScore < 50) {
    recommendations.push("Add 30 minutes of daily listening practice with transcripts");
  }
  if (stats.speakingScore < 40) {
    recommendations.push("Practice shadowing exercises for 20 minutes daily");
  }

  // Bottleneck-specific recommendations
  for (const bottleneck of bottlenecks) {
    recommendations.push(bottleneck.recommendedFix);
  }

  // General recommendations
  recommendations.push("Maintain consistent study schedule (4 hours/day)");
  recommendations.push("Focus on active recall rather than passive review");

  return [...new Set(recommendations)]; // Remove duplicates
}

/**
 * Calculate curriculum effectiveness
 */
function calculateCurriculumEffectiveness(
  dailyStats: SimulationDayStats[]
): CurriculumEffectiveness {
  // Stage 1: Day 1-30
  const stage1Stats = dailyStats.filter(s => s.day <= 30);
  const stage1: StageEffectiveness = {
    stage: 1,
    days: stage1Stats.length,
    averageAccuracy: stage1Stats.reduce((sum, s) => sum + s.vocabularyAccuracy, 0) / stage1Stats.length,
    averageRetention: stage1Stats.reduce((sum, s) => sum + s.retentionRate, 0) / stage1Stats.length,
    wordsLearned: stage1Stats.length > 0 ? stage1Stats[stage1Stats.length - 1].wordsLearned : 0,
    effectivenessScore: 0,
  };
  stage1.effectivenessScore = (stage1.averageAccuracy + stage1.averageRetention * 100) / 2;

  // Stage 2: Day 31-90
  const stage2Stats = dailyStats.filter(s => s.day > 30 && s.day <= 90);
  const stage2: StageEffectiveness = {
    stage: 2,
    days: stage2Stats.length,
    averageAccuracy: stage2Stats.reduce((sum, s) => sum + s.vocabularyAccuracy, 0) / stage2Stats.length,
    averageRetention: stage2Stats.reduce((sum, s) => sum + s.retentionRate, 0) / stage2Stats.length,
    wordsLearned: stage2Stats.length > 0 ? stage2Stats[stage2Stats.length - 1].wordsLearned - (stage1Stats.length > 0 ? stage1Stats[stage1Stats.length - 1].wordsLearned : 0) : 0,
    effectivenessScore: 0,
  };
  stage2.effectivenessScore = (stage2.averageAccuracy + stage2.averageRetention * 100) / 2;

  // Overall score
  const overallScore = (stage1.effectivenessScore + stage2.effectivenessScore) / 2;

  return {
    stage1,
    stage2,
    overallScore,
  };
}

/**
 * Export report to markdown
 */
export function exportReportToMarkdown(report: SimulationReport): string {
  let md = "# Learner Simulation Report\n\n";

  md += "## Metadata\n\n";
  md += `- **Learner Profile:** ${report.metadata.learnerProfile}\n`;
  md += `- **Total Days:** ${report.metadata.totalDays}\n`;
  md += `- **Total Study Hours:** ${report.metadata.totalStudyHours}\n`;
  md += `- **Generated:** ${report.metadata.generatedAt}\n\n`;

  md += "## Summary\n\n";
  md += `| Metric | Final Value |\n`;
  md += `|--------|-------------|\n`;
  md += `| Vocabulary Accuracy | ${report.summary.finalVocabularyAccuracy}% |\n`;
  md += `| Listening Score | ${report.summary.finalListeningScore}% |\n`;
  md += `| Speaking Score | ${report.summary.finalSpeakingScore}% |\n`;
  md += `| Grammar Accuracy | ${report.summary.finalGrammarAccuracy}% |\n`;
  md += `| Retention Rate | ${Math.round(report.summary.finalRetentionRate * 100)}% |\n`;
  md += `| Words Learned | ${report.summary.totalWordsLearned} |\n`;
  md += `| Words Mastered | ${report.summary.totalWordsMastered} |\n\n`;

  md += "## Milestones\n\n";
  for (const milestone of report.milestones) {
    const status = milestone.achieved ? "✅" : "❌";
    md += `### ${status} Day ${milestone.day}: ${milestone.name} (${milestone.nameChinese})\n\n`;
    md += `**Target:** ${milestone.targetMetrics.wordsLearned} words, ${milestone.targetMetrics.vocabularyAccuracy}% accuracy\n`;
    md += `**Actual:** ${milestone.actualMetrics.wordsLearned} words, ${milestone.actualMetrics.vocabularyAccuracy}% accuracy\n\n`;
  }

  md += "## Strengths\n\n";
  for (const strength of report.strengths) {
    md += `- ${strength}\n`;
  }
  md += "\n";

  md += "## Weaknesses\n\n";
  for (const weakness of report.weaknesses) {
    md += `- ${weakness}\n`;
  }
  md += "\n";

  md += "## Learning Bottlenecks\n\n";
  for (const bottleneck of report.bottlenecks) {
    md += `### ${bottleneck.skill} (${bottleneck.severity})\n`;
    md += `- **Description:** ${bottleneck.description}\n`;
    md += `- **Chinese:** ${bottleneck.descriptionChinese}\n`;
    md += `- **Fix:** ${bottleneck.recommendedFix}\n\n`;
  }

  md += "## Recommendations\n\n";
  for (let i = 0; i < report.recommendations.length; i++) {
    md += `${i + 1}. ${report.recommendations[i]}\n`;
  }
  md += "\n";

  md += "## Curriculum Effectiveness\n\n";
  md += `| Stage | Days | Avg Accuracy | Avg Retention | Words Learned | Score |\n`;
  md += `|-------|------|--------------|---------------|---------------|-------|\n`;
  md += `| Stage 1 (Day 1-30) | ${report.curriculumEffectiveness.stage1.days} | ${Math.round(report.curriculumEffectiveness.stage1.averageAccuracy)}% | ${Math.round(report.curriculumEffectiveness.stage1.averageRetention * 100)}% | ${report.curriculumEffectiveness.stage1.wordsLearned} | ${Math.round(report.curriculumEffectiveness.stage1.effectivenessScore)} |\n`;
  md += `| Stage 2 (Day 31-90) | ${report.curriculumEffectiveness.stage2.days} | ${Math.round(report.curriculumEffectiveness.stage2.averageAccuracy)}% | ${Math.round(report.curriculumEffectiveness.stage2.averageRetention * 100)}% | ${report.curriculumEffectiveness.stage2.wordsLearned} | ${Math.round(report.curriculumEffectiveness.stage2.effectivenessScore)} |\n`;
  md += `| **Overall** | ${report.metadata.totalDays} | - | - | - | **${Math.round(report.curriculumEffectiveness.overallScore)}** |\n\n`;

  return md;
}
