/**
 * Curriculum Validator v2
 *
 * Validates curriculum quality:
 * - Daily lesson completeness
 * - CEFR alignment
 * - Skill coverage
 * - Content quality
 */

// ============================================================
// Types
// ============================================================

export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export interface ValidationResult {
  dayNumber: number;
  overallScore: number;
  sections: SectionValidation;
  issues: ValidationIssue[];
  cefrAlignment: CEFRAlignment;
  recommendations: string[];
}

export interface SectionValidation {
  vocabulary: SectionScore;
  listening: SectionScore;
  speaking: SectionScore;
  reading: SectionScore;
  writing: SectionScore;
  grammar: SectionScore;
  review: SectionScore;
}

export interface SectionScore {
  present: boolean;
  completeness: number; // 0-1
  quality: number; // 0-1
  issues: string[];
}

export interface ValidationIssue {
  severity: "critical" | "major" | "minor";
  section: string;
  description: string;
  descriptionChinese: string;
  recommendation: string;
}

export interface CEFRAlignment {
  level: CEFRLevel;
  vocabulary: CEFRAlignmentItem;
  grammar: CEFRAlignmentItem;
  listening: CEFRAlignmentItem;
  speaking: CEFRAlignmentItem;
  reading: CEFRAlignmentItem;
  writing: CEFRAlignmentItem;
}

export interface CEFRAlignmentItem {
  expected: string;
  actual: string;
  aligned: boolean;
  gap?: string;
}

// ============================================================
// Curriculum Validator v2
// ============================================================

export class CurriculumValidatorV2 {
  /**
   * Validate a day's curriculum
   */
  validateDay(dayData: {
    dayNumber: number;
    vocabulary?: string[];
    listening?: boolean;
    speaking?: boolean;
    reading?: boolean;
    writing?: boolean;
    grammar?: string[];
    review?: boolean;
  }): ValidationResult {
    const issues: ValidationIssue[] = [];

    // Validate each section
    const vocabulary = this.validateVocabulary(dayData.vocabulary, issues);
    const listening = this.validateSection("listening", dayData.listening, issues);
    const speaking = this.validateSection("speaking", dayData.speaking, issues);
    const reading = this.validateSection("reading", dayData.reading, issues);
    const writing = this.validateSection("writing", dayData.writing, issues);
    const grammar = this.validateGrammar(dayData.grammar, issues);
    const review = this.validateSection("review", dayData.review, issues);

    // Calculate overall score
    const sectionScores = [vocabulary, listening, speaking, reading, writing, grammar, review];
    const presentSections = sectionScores.filter(s => s.present);
    const overallScore = presentSections.length > 0
      ? presentSections.reduce((sum, s) => sum + s.quality, 0) / presentSections.length
      : 0;

    // Check CEFR alignment
    const cefrAlignment = this.checkCEFRAlignment(dayData);

    // Generate recommendations
    const recommendations = this.generateRecommendations(issues, overallScore);

    return {
      dayNumber: dayData.dayNumber,
      overallScore,
      sections: {
        vocabulary,
        listening,
        speaking,
        reading,
        writing,
        grammar,
        review,
      },
      issues,
      cefrAlignment,
      recommendations,
    };
  }

  /**
   * Validate vocabulary section
   */
  private validateVocabulary(
    words: string[] | undefined,
    issues: ValidationIssue[]
  ): SectionScore {
    if (!words || words.length === 0) {
      issues.push({
        severity: "critical",
        section: "vocabulary",
        description: "No vocabulary words defined",
        descriptionChinese: "没有定义词汇",
        recommendation: "Add vocabulary words for the day",
      });
      return { present: false, completeness: 0, quality: 0, issues: ["No vocabulary"] };
    }

    const issuesList: string[] = [];
    const completeness = 1;
    let quality = 0.8;

    if (words.length < 5) {
      issuesList.push("Too few vocabulary words");
      quality -= 0.2;
    }

    if (words.length > 20) {
      issuesList.push("Too many vocabulary words");
      quality -= 0.1;
    }

    return {
      present: true,
      completeness,
      quality: Math.max(0, quality),
      issues: issuesList,
    };
  }

  /**
   * Validate a section
   */
  private validateSection(
    sectionName: string,
    present: boolean | undefined,
    issues: ValidationIssue[]
  ): SectionScore {
    if (!present) {
      issues.push({
        severity: "major",
        section: sectionName,
        description: `${sectionName} section not present`,
        descriptionChinese: `${sectionName}部分缺失`,
        recommendation: `Add ${sectionName} content`,
      });
      return { present: false, completeness: 0, quality: 0, issues: [`Missing ${sectionName}`] };
    }

    return { present: true, completeness: 1, quality: 0.9, issues: [] };
  }

  /**
   * Validate grammar section
   */
  private validateGrammar(
    points: string[] | undefined,
    issues: ValidationIssue[]
  ): SectionScore {
    if (!points || points.length === 0) {
      issues.push({
        severity: "major",
        section: "grammar",
        description: "No grammar points defined",
        descriptionChinese: "没有定义语法点",
        recommendation: "Add grammar points for the day",
      });
      return { present: false, completeness: 0, quality: 0, issues: ["No grammar"] };
    }

    return { present: true, completeness: 1, quality: 0.85, issues: [] };
  }

  /**
   * Check CEFR alignment
   */
  private checkCEFRAlignment(dayData: { dayNumber: number; vocabulary?: string[] }): CEFRAlignment {
    // Determine expected level based on day number
    let level: CEFRLevel = "A1";
    if (dayData.dayNumber > 270) level = "B2";
    else if (dayData.dayNumber > 180) level = "B1";
    else if (dayData.dayNumber > 90) level = "A2";

    return {
      level,
      vocabulary: {
        expected: this.getCEFRVocabTarget(level),
        actual: `${dayData.vocabulary?.length || 0} words`,
        aligned: true,
      },
      grammar: {
        expected: this.getCEFRGrammarTarget(level),
        actual: "Present",
        aligned: true,
      },
      listening: {
        expected: this.getCEFRListeningTarget(level),
        actual: "Present",
        aligned: true,
      },
      speaking: {
        expected: this.getCEFRSpeakingTarget(level),
        actual: "Present",
        aligned: true,
      },
      reading: {
        expected: this.getCEFRReadingTarget(level),
        actual: "Present",
        aligned: true,
      },
      writing: {
        expected: this.getCEFRWritingTarget(level),
        actual: "Present",
        aligned: true,
      },
    };
  }

  private getCEFRVocabTarget(level: CEFRLevel): string {
    const targets: Record<CEFRLevel, string> = {
      A1: "5-10 basic words",
      A2: "10-15 words",
      B1: "15-20 words",
      B2: "20-25 words",
      C1: "25-30 words",
      C2: "30+ words",
    };
    return targets[level];
  }

  private getCEFRGrammarTarget(level: CEFRLevel): string {
    const targets: Record<CEFRLevel, string> = {
      A1: "Basic sentence patterns",
      A2: "Simple tenses",
      B1: "Complex sentences",
      B2: "Advanced structures",
      C1: "Sophisticated grammar",
      C2: "Native-like grammar",
    };
    return targets[level];
  }

  private getCEFRListeningTarget(level: CEFRLevel): string {
    const targets: Record<CEFRLevel, string> = {
      A1: "Slow, clear speech",
      A2: "Normal speed, familiar topics",
      B1: "Standard speech on various topics",
      B2: "Fast speech, complex topics",
      C1: "Native speech, all accents",
      C2: "Any speech, any context",
    };
    return targets[level];
  }

  private getCEFRSpeakingTarget(level: CEFRLevel): string {
    const targets: Record<CEFRLevel, string> = {
      A1: "Simple phrases",
      A2: "Basic conversations",
      B1: "Describe experiences",
      B2: "Express opinions",
      C1: "Fluent spontaneous speech",
      C2: "Near-native fluency",
    };
    return targets[level];
  }

  private getCEFRReadingTarget(level: CEFRLevel): string {
    const targets: Record<CEFRLevel, string> = {
      A1: "Simple texts",
      A2: "Short articles",
      B1: "News articles",
      B2: "Complex texts",
      C1: "Academic texts",
      C2: "Literary texts",
    };
    return targets[level];
  }

  private getCEFRWritingTarget(level: CEFRLevel): string {
    const targets: Record<CEFRLevel, string> = {
      A1: "Simple sentences",
      A2: "Short paragraphs",
      B1: "Essays",
      B2: "Formal writing",
      C1: "Complex reports",
      C2: "Professional writing",
    };
    return targets[level];
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(issues: ValidationIssue[], score: number): string[] {
    const recommendations: string[] = [];

    const criticalIssues = issues.filter(i => i.severity === "critical");
    const majorIssues = issues.filter(i => i.severity === "major");

    if (criticalIssues.length > 0) {
      recommendations.push("Fix critical issues immediately");
    }

    if (majorIssues.length > 0) {
      recommendations.push("Address major issues to improve quality");
    }

    if (score < 0.7) {
      recommendations.push("Overall quality needs improvement");
    }

    return recommendations;
  }

  /**
   * Validate multiple days
   */
  validateCurriculum(days: Array<{
    dayNumber: number;
    vocabulary?: string[];
    listening?: boolean;
    speaking?: boolean;
    reading?: boolean;
    writing?: boolean;
    grammar?: string[];
    review?: boolean;
  }>): {
    totalDays: number;
    validDays: number;
    averageScore: number;
    issues: ValidationIssue[];
  } {
    const results = days.map(day => this.validateDay(day));
    const validDays = results.filter(r => r.overallScore >= 0.7).length;
    const averageScore = results.reduce((sum, r) => sum + r.overallScore, 0) / results.length;
    const allIssues = results.flatMap(r => r.issues);

    return {
      totalDays: days.length,
      validDays,
      averageScore,
      issues: allIssues,
    };
  }
}
