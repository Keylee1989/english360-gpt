/**
 * Vocabulary Quality Audit System
 *
 * Validates vocabulary items for completeness and quality.
 * Generates reports on data quality issues.
 */

import type { VocabularyItem } from "./index";

// ============================================================
// Quality Issue Types
// ============================================================

export type IssueSeverity = "critical" | "warning" | "info";

export interface QualityIssue {
  severity: IssueSeverity;
  field: string;
  message: string;
  suggestion?: string;
}

export interface QualityReport {
  totalItems: number;
  validItems: number;
  issues: QualityIssue[];
  incompleteItems: { word: string; issues: QualityIssue[] }[];
  summary: {
    critical: number;
    warning: number;
    info: number;
  };
  duplicates: string[];
}

// ============================================================
// Validation Rules
// ============================================================

/**
 * Validate a single vocabulary item
 */
export function validateVocabularyItem(item: VocabularyItem): QualityIssue[] {
  const issues: QualityIssue[] = [];

  // Critical: Missing word
  if (!item.word || item.word.trim() === "") {
    issues.push({
      severity: "critical",
      field: "word",
      message: "Word is empty",
    });
  }

  // Critical: Missing Chinese meaning
  if (!item.chineseMeaning || item.chineseMeaning.trim() === "") {
    issues.push({
      severity: "critical",
      field: "chineseMeaning",
      message: "Chinese meaning is missing",
      suggestion: "Add Chinese translation for Chinese beginners",
    });
  }

  // Critical: Missing IPA
  if (!item.ipa || item.ipa.trim() === "") {
    issues.push({
      severity: "critical",
      field: "ipa",
      message: "IPA pronunciation is missing",
      suggestion: "Add IPA for pronunciation guidance",
    });
  }

  // Warning: Missing example sentences
  if (!item.examples || item.examples.length === 0) {
    issues.push({
      severity: "warning",
      field: "examples",
      message: "No example sentences",
      suggestion: "Add at least one example sentence with Chinese translation",
    });
  }

  // Warning: Example too short
  if (item.examples && item.examples.length > 0) {
    const shortExamples = item.examples.filter((e) => e.english.split(" ").length < 3);
    if (shortExamples.length > 0) {
      issues.push({
        severity: "warning",
        field: "examples",
        message: `Some examples are too short (< 3 words): "${shortExamples.map((e) => e.english).join('", "')}"`,
        suggestion: "Use more natural, complete sentences",
      });
    }
  }

  // Warning: Missing part of speech
  if (!item.partOfSpeech || item.partOfSpeech.length === 0) {
    issues.push({
      severity: "warning",
      field: "partOfSpeech",
      message: "Part of speech is missing",
    });
  }

  // Info: Missing collocations (only for intermediate+ words)
  if (
    (!item.collocations || item.collocations.length === 0) &&
    item.cefr !== "A1"
  ) {
    issues.push({
      severity: "info",
      field: "collocations",
      message: "No collocations defined",
      suggestion: "Add common collocations for better learning",
    });
  }

  // Info: Missing word family (only for intermediate+ words)
  if (
    (!item.wordFamily || item.wordFamily.forms.length === 0) &&
    item.cefr !== "A1"
  ) {
    issues.push({
      severity: "info",
      field: "wordFamily",
      message: "No word family forms defined",
      suggestion: "Add related word forms (e.g., happy → happiness, unhappy)",
    });
  }

  // Info: Missing synonyms/antonyms
  if (
    (!item.synonyms || item.synonyms.length === 0) &&
    item.partOfSpeech?.includes("adjective")
  ) {
    issues.push({
      severity: "info",
      field: "synonyms/antonyms",
      message: "No synonyms or antonyms for adjective",
      suggestion: "Add synonyms and antonyms for vocabulary building",
    });
  }

  // Check memory methods completeness
  const memory = (item as unknown as { memoryMethods?: Record<string, string> })
    .memoryMethods;
  if (!memory) {
    issues.push({
      severity: "info",
      field: "memoryMethods",
      message: "No memory methods defined",
      suggestion: "Add mnemonic, association, or Chinese pronunciation hint",
    });
  } else {
    const hasHint =
      memory.chinesePronHint || memory.mnemonic || memory.association;
    if (!hasHint) {
      issues.push({
        severity: "info",
        field: "memoryMethods",
        message: "No Chinese pronunciation hint or mnemonic",
        suggestion: "Add Chinese pronunciation hint (谐音) for easier memorization",
      });
    }
  }

  return issues;
}

/**
 * Find duplicate words in vocabulary list
 */
export function findDuplicates(items: VocabularyItem[]): string[] {
  const seen = new Map<string, number>();
  const duplicates: string[] = [];

  items.forEach((item) => {
    const lower = item.word.toLowerCase();
    if (seen.has(lower)) {
      duplicates.push(item.word);
    } else {
      seen.set(lower, 1);
    }
  });

  return duplicates;
}

/**
 * Generate a complete quality report
 */
export function generateQualityReport(
  items: VocabularyItem[],
): QualityReport {
  const issues: QualityIssue[] = [];
  const incompleteItems: { word: string; issues: QualityIssue[] }[] = [];
  const summary = { critical: 0, warning: 0, info: 0 };

  // Validate each item
  items.forEach((item) => {
    const itemIssues = validateVocabularyItem(item);
    if (itemIssues.length > 0) {
      incompleteItems.push({ word: item.word, issues: itemIssues });
      itemIssues.forEach((issue) => {
        issues.push(issue);
        summary[issue.severity]++;
      });
    }
  });

  // Find duplicates
  const duplicates = findDuplicates(items);

  return {
    totalItems: items.length,
    validItems: items.length - incompleteItems.length,
    issues,
    incompleteItems,
    summary,
    duplicates,
  };
}

/**
 * Get items that are incomplete (have critical or warning issues)
 */
export function getIncompleteItems(
  items: VocabularyItem[],
): { word: string; issues: QualityIssue[] }[] {
  const incomplete: { word: string; issues: QualityIssue[] }[] = [];

  items.forEach((item) => {
    const itemIssues = validateVocabularyItem(item).filter(
      (i) => i.severity === "critical" || i.severity === "warning",
    );
    if (itemIssues.length > 0) {
      incomplete.push({ word: item.word, issues: itemIssues });
    }
  });

  return incomplete;
}

/**
 * Calculate vocabulary quality score (0-100)
 */
export function calculateQualityScore(items: VocabularyItem[]): number {
  if (items.length === 0) return 0;

  let totalScore = 0;

  items.forEach((item) => {
    let itemScore = 100;
    const issues = validateVocabularyItem(item);

    // Deduct points for issues
    issues.forEach((issue) => {
      switch (issue.severity) {
        case "critical":
          itemScore -= 30;
          break;
        case "warning":
          itemScore -= 15;
          break;
        case "info":
          itemScore -= 5;
          break;
      }
    });

    totalScore += Math.max(0, itemScore);
  });

  return Math.round(totalScore / items.length);
}
