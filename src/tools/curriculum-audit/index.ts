/**
 * Curriculum Quality Audit Tool
 *
 * Validates curriculum content quality:
 * - Vocabulary completeness
 * - Grammar explanation quality
 * - Listening exercise quality
 * - Speaking exercise quality
 * - Overall lesson structure
 */

import type { DailyLesson } from "@/types/database";

// ============================================================
// Types
// ============================================================

export interface AuditResult {
  curriculumId: string;
  auditDate: string;
  overallScore: number;
  sectionScores: SectionScores;
  issues: AuditIssue[];
  recommendations: string[];
  summary: AuditSummary;
}

export interface SectionScores {
  vocabulary: number;
  grammar: number;
  listening: number;
  speaking: number;
  reading: number;
  writing: number;
  overall: number;
}

export interface AuditIssue {
  severity: "critical" | "major" | "minor";
  section: string;
  description: string;
  descriptionChinese: string;
  affectedItems: string[];
  recommendation: string;
}

export interface AuditSummary {
  totalLessons: number;
  passedLessons: number;
  failedLessons: number;
  averageScore: number;
  criticalIssues: number;
  majorIssues: number;
  minorIssues: number;
}

export interface VocabularyAudit {
  word: string;
  hasIPA: boolean;
  hasChineseMeaning: boolean;
  hasExamples: boolean;
  hasMemoryMethod: boolean;
  hasPhonicsBreakdown: boolean;
  score: number;
}

export interface GrammarAudit {
  hasExplanation: boolean;
  hasExamples: boolean;
  hasExercises: boolean;
  explanationQuality: "poor" | "acceptable" | "good" | "excellent";
  score: number;
}

export interface ListeningAudit {
  hasAudio: boolean;
  hasTranscript: boolean;
  hasQuestions: boolean;
  questionCount: number;
  score: number;
}

export interface SpeakingAudit {
  hasScenario: boolean;
  hasDialogue: boolean;
  hasPracticePrompts: boolean;
  dialogueLength: number;
  score: number;
}

// ============================================================
// Curriculum Quality Auditor
// ============================================================

export class CurriculumAuditor {
  /**
   * Audit a single lesson
   */
  auditLesson(lesson: DailyLesson): AuditResult {
    const issues: AuditIssue[] = [];
    const sectionScores: SectionScores = {
      vocabulary: 0,
      grammar: 0,
      listening: 0,
      speaking: 0,
      reading: 0,
      writing: 0,
      overall: 0,
    };

    // Audit vocabulary
    const vocabAudit = this.auditVocabulary(lesson);
    sectionScores.vocabulary = vocabAudit.score;
    if (vocabAudit.score < 0.7) {
      issues.push({
        severity: "major",
        section: "vocabulary",
        description: "Vocabulary section incomplete",
        descriptionChinese: "词汇部分不完整",
        affectedItems: vocabAudit.missingItems,
        recommendation: "Add missing vocabulary data",
      });
    }

    // Audit grammar
    const grammarAudit = this.auditGrammar(lesson);
    sectionScores.grammar = grammarAudit.score;
    if (grammarAudit.score < 0.7) {
      issues.push({
        severity: "major",
        section: "grammar",
        description: "Grammar section incomplete",
        descriptionChinese: "语法部分不完整",
        affectedItems: grammarAudit.missingItems,
        recommendation: "Add missing grammar data",
      });
    }

    // Audit listening
    const listeningAudit = this.auditListening(lesson);
    sectionScores.listening = listeningAudit.score;
    if (listeningAudit.score < 0.7) {
      issues.push({
        severity: "major",
        section: "listening",
        description: "Listening section incomplete",
        descriptionChinese: "听力部分不完整",
        affectedItems: listeningAudit.missingItems,
        recommendation: "Add missing listening data",
      });
    }

    // Audit speaking
    const speakingAudit = this.auditSpeaking(lesson);
    sectionScores.speaking = speakingAudit.score;
    if (speakingAudit.score < 0.7) {
      issues.push({
        severity: "major",
        section: "speaking",
        description: "Speaking section incomplete",
        descriptionChinese: "口语部分不完整",
        affectedItems: speakingAudit.missingItems,
        recommendation: "Add missing speaking data",
      });
    }

    // Calculate overall score
    sectionScores.overall =
      (sectionScores.vocabulary +
        sectionScores.grammar +
        sectionScores.listening +
        sectionScores.speaking) / 4;

    return {
      curriculumId: lesson.id,
      auditDate: new Date().toISOString(),
      overallScore: sectionScores.overall,
      sectionScores,
      issues,
      recommendations: this.generateRecommendations(issues),
      summary: {
        totalLessons: 1,
        passedLessons: sectionScores.overall >= 0.7 ? 1 : 0,
        failedLessons: sectionScores.overall < 0.7 ? 1 : 0,
        averageScore: sectionScores.overall,
        criticalIssues: issues.filter(i => i.severity === "critical").length,
        majorIssues: issues.filter(i => i.severity === "major").length,
        minorIssues: issues.filter(i => i.severity === "minor").length,
      },
    };
  }

  /**
   * Audit vocabulary section
   */
  private auditVocabulary(lesson: DailyLesson): {
    score: number;
    missingItems: string[];
  } {
    const missingItems: string[] = [];
    let score = 0;
    const words = lesson.vocabulary.words || [];

    if (words.length === 0) {
      return { score: 0, missingItems: ["No vocabulary words defined"] };
    }

    // Check each word in activity content
    for (const activity of lesson.activities) {
      if (activity.content.words) {
        for (const word of activity.content.words) {
          let wordScore = 0;
          if (word.word) wordScore += 0.2;
          if (word.ipa) wordScore += 0.2;
          if (word.chineseMeaning) wordScore += 0.2;
          if (word.example) wordScore += 0.2;
          if (word.memoryHint) wordScore += 0.2;

          score += wordScore;

          if (wordScore < 0.8) {
            missingItems.push(`Incomplete word: ${word.word}`);
          }
        }
      }
    }

    score = words.length > 0 ? score / words.length : 0;
    return { score, missingItems };
  }

  /**
   * Audit grammar section
   */
  private auditGrammar(lesson: DailyLesson): {
    score: number;
    missingItems: string[];
  } {
    const missingItems: string[] = [];
    let score = 0;

    // Check grammar explanation
    if (lesson.grammar.explanation.english) score += 0.3;
    else missingItems.push("Missing English explanation");

    if (lesson.grammar.explanation.chinese) score += 0.3;
    else missingItems.push("Missing Chinese explanation");

    // Check examples
    if (lesson.grammar.examples.length > 0) score += 0.2;
    else missingItems.push("Missing grammar examples");

    // Check exercises
    if (lesson.grammar.exercises.length > 0) score += 0.2;
    else missingItems.push("Missing grammar exercises");

    return { score, missingItems };
  }

  /**
   * Audit listening section
   */
  private auditListening(lesson: DailyLesson): {
    score: number;
    missingItems: string[];
  } {
    const missingItems: string[] = [];
    let score = 0;

    // Check audio
    if (lesson.listening.audioUrl) score += 0.3;
    else missingItems.push("Missing audio URL");

    // Check transcript
    if (lesson.listening.transcript) score += 0.3;
    else missingItems.push("Missing transcript");

    // Check questions
    if (lesson.listening.questions.length > 0) score += 0.4;
    else missingItems.push("Missing listening questions");

    return { score, missingItems };
  }

  /**
   * Audit speaking section
   */
  private auditSpeaking(lesson: DailyLesson): {
    score: number;
    missingItems: string[];
  } {
    const missingItems: string[] = [];
    let score = 0;

    // Check scenario
    if (lesson.speaking.scenario) score += 0.3;
    else missingItems.push("Missing speaking scenario");

    // Check dialogue
    if (lesson.speaking.dialogue.length > 0) score += 0.4;
    else missingItems.push("Missing dialogue");

    // Check practice prompts
    if (lesson.speaking.practicePrompts.length > 0) score += 0.3;
    else missingItems.push("Missing practice prompts");

    return { score, missingItems };
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(issues: AuditIssue[]): string[] {
    const recommendations: string[] = [];

    for (const issue of issues) {
      if (issue.severity === "critical") {
        recommendations.push(`CRITICAL: ${issue.recommendation}`);
      } else if (issue.severity === "major") {
        recommendations.push(`MAJOR: ${issue.recommendation}`);
      } else {
        recommendations.push(`MINOR: ${issue.recommendation}`);
      }
    }

    if (recommendations.length === 0) {
      recommendations.push("Lesson meets quality standards");
    }

    return [...new Set(recommendations)];
  }

  /**
   * Audit multiple lessons
   */
  auditCurriculum(lessons: DailyLesson[]): AuditResult {
    const allIssues: AuditIssue[] = [];
    let totalScore = 0;

    for (const lesson of lessons) {
      const result = this.auditLesson(lesson);
      allIssues.push(...result.issues);
      totalScore += result.overallScore;
    }

    const averageScore = lessons.length > 0 ? totalScore / lessons.length : 0;

    return {
      curriculumId: "full_curriculum",
      auditDate: new Date().toISOString(),
      overallScore: averageScore,
      sectionScores: {
        vocabulary: 0,
        grammar: 0,
        listening: 0,
        speaking: 0,
        reading: 0,
        writing: 0,
        overall: averageScore,
      },
      issues: allIssues,
      recommendations: this.generateRecommendations(allIssues),
      summary: {
        totalLessons: lessons.length,
        passedLessons: lessons.filter((_, i) => {
          const result = this.auditLesson(lessons[i]);
          return result.overallScore >= 0.7;
        }).length,
        failedLessons: lessons.filter((_, i) => {
          const result = this.auditLesson(lessons[i]);
          return result.overallScore < 0.7;
        }).length,
        averageScore,
        criticalIssues: allIssues.filter(i => i.severity === "critical").length,
        majorIssues: allIssues.filter(i => i.severity === "major").length,
        minorIssues: allIssues.filter(i => i.severity === "minor").length,
      },
    };
  }
}

/**
 * Generate audit report in markdown
 */
export function generateAuditReportMarkdown(result: AuditResult): string {
  let md = "# Curriculum Quality Audit Report\n\n";

  md += "## Summary\n\n";
  md += `- **Audit Date:** ${result.auditDate}\n`;
  md += `- **Overall Score:** ${Math.round(result.overallScore * 100)}%\n`;
  md += `- **Total Lessons:** ${result.summary.totalLessons}\n`;
  md += `- **Passed Lessons:** ${result.summary.passedLessons}\n`;
  md += `- **Failed Lessons:** ${result.summary.failedLessons}\n\n`;

  md += "## Section Scores\n\n";
  md += `| Section | Score |\n`;
  md += `|---------|-------|\n`;
  md += `| Vocabulary | ${Math.round(result.sectionScores.vocabulary * 100)}% |\n`;
  md += `| Grammar | ${Math.round(result.sectionScores.grammar * 100)}% |\n`;
  md += `| Listening | ${Math.round(result.sectionScores.listening * 100)}% |\n`;
  md += `| Speaking | ${Math.round(result.sectionScores.speaking * 100)}% |\n`;
  md += `| **Overall** | **${Math.round(result.sectionScores.overall * 100)}%** |\n\n`;

  md += "## Issues\n\n";
  md += `| Severity | Section | Description |\n`;
  md += `|----------|---------|-------------|\n`;
  for (const issue of result.issues.slice(0, 10)) {
    md += `| ${issue.severity} | ${issue.section} | ${issue.description} |\n`;
  }
  if (result.issues.length > 10) {
    md += `| ... | ... | ... (${result.issues.length - 10} more issues) |\n`;
  }
  md += "\n";

  md += "## Recommendations\n\n";
  for (let i = 0; i < Math.min(5, result.recommendations.length); i++) {
    md += `${i + 1}. ${result.recommendations[i]}\n`;
  }
  md += "\n";

  return md;
}
