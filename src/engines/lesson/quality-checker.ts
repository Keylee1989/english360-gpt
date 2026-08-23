/**
 * Lesson Quality Checker
 *
 * Validates lesson data for completeness and educational quality.
 */

import type { DailyLesson, LessonVocabularyBlock, LessonGrammarBlock, LessonListeningBlock, LessonSpeakingBlock } from "@/types/database";

// ============================================================
// Quality Issue Types
// ============================================================

export type LessonIssueSeverity = "critical" | "warning" | "info";

export interface LessonQualityIssue {
  severity: LessonIssueSeverity;
  block: string;
  message: string;
  suggestion?: string;
}

export interface LessonQualityReport {
  dayId: string;
  isComplete: boolean;
  issues: LessonQualityIssue[];
  scores: {
    vocabulary: number;
    grammar: number;
    listening: number;
    speaking: number;
    reading: number;
    writing: number;
    exercises: number;
    overall: number;
  };
}

// ============================================================
// Validation Functions
// ============================================================

/**
 * Validate vocabulary coverage in a lesson
 */
function validateVocabulary(
  vocabulary: LessonVocabularyBlock,
): LessonQualityIssue[] {
  const issues: LessonQualityIssue[] = [];

  if (!vocabulary || !vocabulary.words || vocabulary.words.length === 0) {
    issues.push({
      severity: "critical",
      block: "vocabulary",
      message: "No vocabulary items in lesson",
      suggestion: "Add 5-15 vocabulary items per lesson",
    });
  } else if (vocabulary.words.length < 3) {
    issues.push({
      severity: "warning",
      block: "vocabulary",
      message: `Only ${vocabulary.words.length} vocabulary items (recommended: 5-15)`,
    });
  } else if (vocabulary.words.length > 20) {
    issues.push({
      severity: "warning",
      block: "vocabulary",
      message: `Too many vocabulary items: ${vocabulary.words.length} (recommended: 5-15)`,
    });
  }

  // Check if vocabulary has exercises
  if (!vocabulary.exercises || vocabulary.exercises.length === 0) {
    issues.push({
      severity: "warning",
      block: "vocabulary",
      message: "No vocabulary exercises",
      suggestion: "Add exercises to practice new vocabulary",
    });
  }

  return issues;
}

/**
 * Validate grammar coverage
 */
function validateGrammar(
  grammar: LessonGrammarBlock,
): LessonQualityIssue[] {
  const issues: LessonQualityIssue[] = [];

  if (!grammar || !grammar.pointId) {
    issues.push({
      severity: "warning",
      block: "grammar",
      message: "No grammar points in lesson",
      suggestion: "Add at least 1-2 grammar points for structured learning",
    });
    return issues;
  }

  // Check grammar explanations
  if (!grammar.explanation || grammar.explanation.english.trim() === "") {
    issues.push({
      severity: "critical",
      block: "grammar",
      message: "Grammar point missing explanation",
    });
  }

  if (!grammar.examples || grammar.examples.length === 0) {
    issues.push({
      severity: "warning",
      block: "grammar",
      message: "Grammar point has no examples",
    });
  }

  return issues;
}

/**
 * Validate listening exercises
 */
function validateListening(
  listening: LessonListeningBlock,
): LessonQualityIssue[] {
  const issues: LessonQualityIssue[] = [];

  if (!listening || !listening.transcript || listening.transcript.trim() === "") {
    issues.push({
      severity: "warning",
      block: "listening",
      message: "No listening content",
      suggestion: "Add listening practice for comprehensive learning",
    });
    return issues;
  }

  if (!listening.questions || listening.questions.length === 0) {
    issues.push({
      severity: "info",
      block: "listening",
      message: "No comprehension questions for listening",
    });
  }

  return issues;
}

/**
 * Validate speaking exercises
 */
function validateSpeaking(
  speaking: LessonSpeakingBlock,
): LessonQualityIssue[] {
  const issues: LessonQualityIssue[] = [];

  if (!speaking || !speaking.scenario || speaking.scenario.trim() === "") {
    issues.push({
      severity: "warning",
      block: "speaking",
      message: "No speaking content",
      suggestion: "Add speaking practice for complete language learning",
    });
    return issues;
  }

  if (!speaking.dialogue || speaking.dialogue.length === 0) {
    issues.push({
      severity: "warning",
      block: "speaking",
      message: "No dialogue for speaking practice",
    });
  }

  return issues;
}

/**
 * Calculate total exercises from lesson blocks
 */
function countTotalExercises(lesson: DailyLesson): number {
  let count = 0;
  count += lesson.vocabulary?.exercises?.length || 0;
  count += lesson.grammar?.exercises?.length || 0;
  count += lesson.review?.wordReview?.length || 0;
  return count;
}

/**
 * Generate lesson quality report
 */
export function generateLessonQualityReport(
  lesson: DailyLesson,
): LessonQualityReport {
  const allIssues: LessonQualityIssue[] = [];

  // Validate each section
  allIssues.push(...validateVocabulary(lesson.vocabulary));
  allIssues.push(...validateGrammar(lesson.grammar));
  allIssues.push(...validateListening(lesson.listening));
  allIssues.push(...validateSpeaking(lesson.speaking));

  // Count total exercises
  const totalExercises = countTotalExercises(lesson);
  if (totalExercises < 3) {
    allIssues.push({
      severity: "info",
      block: "exercises",
      message: `Only ${totalExercises} exercises (recommended: 5-10)`,
    });
  }

  // Calculate scores
  const scores = {
    vocabulary: lesson.vocabulary?.words?.length ? calculateBlockScore(lesson.vocabulary.words.length, 10) : 0,
    grammar: lesson.grammar?.pointId ? 100 : 0,
    listening: lesson.listening?.transcript ? 100 : 0,
    speaking: lesson.speaking?.scenario ? 100 : 0,
    reading: lesson.reading?.text ? 100 : 0,
    writing: lesson.writing?.prompt ? 100 : 0,
    exercises: calculateBlockScore(totalExercises, 8),
    overall: 0,
  };

  // Calculate overall score
  const scoreValues = Object.values(scores).filter((s) => s > 0);
  scores.overall =
    scoreValues.length > 0
      ? Math.round(scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length)
      : 0;

  const criticalCount = allIssues.filter(
    (i) => i.severity === "critical",
  ).length;

  return {
    dayId: lesson.dayId,
    isComplete: criticalCount === 0,
    issues: allIssues,
    scores,
  };
}

/**
 * Calculate score for a block based on content count vs target
 */
function calculateBlockScore(count: number, target: number): number {
  if (count === 0) return 0;
  if (count >= target) return 100;
  return Math.round((count / target) * 100);
}
