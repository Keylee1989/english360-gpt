/**
 * Writing Engine v1
 *
 * Features:
 * - Sentence correction with error detection
 * - Paragraph writing with guidance
 * - Email writing templates
 * - Grammar feedback
 * - Vocabulary suggestions
 * - Progress tracking
 */

// ============================================================
// Types
// ============================================================

export type WritingLevel = "beginner" | "elementary" | "intermediate" | "advanced";
export type WritingTaskType = "sentence_correction" | "paragraph_writing" | "email_writing" | "free_writing";

export interface WritingTask {
  id: string;
  type: WritingTaskType;
  level: WritingLevel;
  title: string;
  titleChinese: string;
  prompt: string;
  promptChinese: string;
  wordBank?: string[];
  example?: string;
  exampleChinese?: string;
  timeLimit?: number; // minutes
}

export interface WritingSubmission {
  id: string;
  taskId: string;
  content: string;
  timestamp: number;
  timeSpent: number; // seconds
}

export interface WritingAnalysis {
  submissionId: string;
  taskId: string;

  // Overall scores (0-1)
  grammarScore: number;
  vocabularyScore: number;
  coherenceScore: number;
  overallScore: number;

  // Error detection
  errors: WritingError[];

  // Suggestions
  corrections: WritingCorrection[];
  vocabularySuggestions: VocabularySuggestion[];
  styleSuggestions: string[];

  // Feedback
  feedback: WritingFeedback;
}

export interface WritingError {
  type: "grammar" | "spelling" | "punctuation" | "word_order" | "article" | "tense" | "agreement";
  original: string;
  corrected: string;
  position: number;
  length: number;
  severity: "minor" | "moderate" | "major";
  explanation: string;
  explanationChinese: string;
  rule?: string;
}

export interface WritingCorrection {
  original: string;
  corrected: string;
  explanation: string;
  explanationChinese: string;
  alternatives?: string[];
}

export interface VocabularySuggestion {
  word: string;
  meaning: string;
  meaningChinese: string;
  example: string;
  level: WritingLevel;
}

export interface WritingFeedback {
  overall: string;
  overallChinese: string;
  strengths: string[];
  weaknesses: string[];
  nextSteps: string[];
}

export interface WritingProgress {
  totalTasks: number;
  completedTasks: number;
  averageScore: number;
  grammarImprovement: number;
  vocabularyImprovement: number;
  commonErrors: string[];
}

// ============================================================
// Writing Engine
// ============================================================

export class WritingEngineV1 {
  private tasks: Map<string, WritingTask> = new Map();
  private submissions: Map<string, WritingSubmission> = new Map();
  private analyses: Map<string, WritingAnalysis> = new Map();

  constructor() {
    this.initializeDefaultTasks();
  }

  /**
   * Initialize default writing tasks
   */
  private initializeDefaultTasks(): void {
    const defaultTasks: WritingTask[] = [
      // Beginner tasks
      {
        id: "write_001",
        type: "sentence_correction",
        level: "beginner",
        title: "Correct the Sentence",
        titleChinese: "修正句子",
        prompt: "Correct the following sentence: 'I go yesterday shop.'",
        promptChinese: "修正以下句子：'I go yesterday shop.'",
        example: "I went to the shop yesterday.",
        exampleChinese: "我昨天去了商店。",
      },
      {
        id: "write_002",
        type: "paragraph_writing",
        level: "beginner",
        title: "Write About Yourself",
        titleChinese: "写关于你自己",
        prompt: "Write 3-5 sentences about yourself: name, age, job, and hobbies.",
        promptChinese: "写3-5个关于你自己的句子：名字、年龄、工作和爱好。",
        wordBank: ["name", "age", "job", "hobby", "like", "live", "work", "study"],
        example: "My name is Li Wei. I am 30 years old. I am a teacher. I like reading.",
        exampleChinese: "我叫李伟。我30岁。我是一名老师。我喜欢阅读。",
      },
      {
        id: "write_003",
        type: "email_writing",
        level: "beginner",
        title: "Write a Simple Email",
        titleChinese: "写一封简单邮件",
        prompt: "Write an email to your friend inviting them to dinner.",
        promptChinese: "写一封邮件给你的朋友，邀请他们吃晚餐。",
        wordBank: ["dear", "hello", "invite", "dinner", "restaurant", "time", "please", "reply"],
        example: "Dear Tom, Hello! I want to invite you to dinner. Please reply. Best, Li Wei",
        exampleChinese: "亲爱的Tom，你好！我想邀请你吃晚餐。请回复。此致，李伟",
      },
      // Elementary tasks
      {
        id: "write_004",
        type: "sentence_correction",
        level: "elementary",
        title: "Fix Grammar Mistakes",
        titleChinese: "修正语法错误",
        prompt: "Correct: 'She don't like apples and me is very happy yesterday.'",
        promptChinese: "修正：'She don't like apples and me is very happy yesterday.'",
        example: "She doesn't like apples and I was very happy yesterday.",
        exampleChinese: "她不喜欢苹果，我昨天很开心。",
      },
      {
        id: "write_005",
        type: "paragraph_writing",
        level: "elementary",
        title: "Describe Your Day",
        titleChinese: "描述你的一天",
        prompt: "Write about your typical day. Use at least 5 sentences.",
        promptChinese: "写关于你典型的一天。至少用5个句子。",
        wordBank: ["morning", "afternoon", "evening", "breakfast", "lunch", "dinner", "work", "relax"],
      },
      // Intermediate tasks
      {
        id: "write_006",
        type: "email_writing",
        level: "intermediate",
        title: "Business Email",
        titleChinese: "商务邮件",
        prompt: "Write a professional email requesting a meeting with your manager.",
        promptChinese: "写一封专业的邮件，请求与你的经理开会。",
        wordBank: ["schedule", "meeting", "discuss", "project", "available", "convenient", "regards"],
      },
      {
        id: "write_007",
        type: "paragraph_writing",
        level: "intermediate",
        title: "Express Your Opinion",
        titleChinese: "表达你的观点",
        prompt: "Write about the advantages and disadvantages of working from home.",
        promptChinese: "写关于在家工作的优点和缺点。",
        wordBank: ["advantage", "disadvantage", "productivity", "flexible", "isolation", "commute"],
      },
    ];

    defaultTasks.forEach(task => {
      this.tasks.set(task.id, task);
    });
  }

  /**
   * Get task by ID
   */
  getTask(id: string): WritingTask | undefined {
    return this.tasks.get(id);
  }

  /**
   * Get tasks by level
   */
  getTasksByLevel(level: WritingLevel): WritingTask[] {
    return Array.from(this.tasks.values()).filter(t => t.level === level);
  }

  /**
   * Get tasks by type
   */
  getTasksByType(type: WritingTaskType): WritingTask[] {
    return Array.from(this.tasks.values()).filter(t => t.type === type);
  }

  /**
   * Get all tasks
   */
  getAllTasks(): WritingTask[] {
    return Array.from(this.tasks.values());
  }

  /**
   * Add custom task
   */
  addTask(task: WritingTask): void {
    this.tasks.set(task.id, task);
  }

  /**
   * Submit writing
   */
  submitWriting(taskId: string, content: string, timeSpent: number): WritingSubmission {
    const submission: WritingSubmission = {
      id: `sub_${Date.now()}`,
      taskId,
      content,
      timestamp: Date.now(),
      timeSpent,
    };

    this.submissions.set(submission.id, submission);
    return submission;
  }

  /**
   * Analyze writing
   */
  analyzeWriting(submission: WritingSubmission): WritingAnalysis {
    const task = this.tasks.get(submission.taskId);
    if (!task) {
      throw new Error(`Task not found: ${submission.taskId}`);
    }

    // Analyze content
    const errors = this.detectErrors(submission.content, task);
    const corrections = this.generateCorrections(errors);
    const vocabularySuggestions = this.generateVocabularySuggestions(submission.content, task);
    const styleSuggestions = this.generateStyleSuggestions(submission.content, task);

    // Calculate scores
    const grammarScore = this.calculateGrammarScore(errors);
    const vocabularyScore = this.calculateVocabularyScore(submission.content, task);
    const coherenceScore = this.calculateCoherenceScore(submission.content);
    const overallScore = (grammarScore + vocabularyScore + coherenceScore) / 3;

    // Generate feedback
    const feedback = this.generateFeedback(errors, grammarScore, vocabularyScore, coherenceScore);

    const analysis: WritingAnalysis = {
      submissionId: submission.id,
      taskId: submission.taskId,
      grammarScore,
      vocabularyScore,
      coherenceScore,
      overallScore,
      errors,
      corrections,
      vocabularySuggestions,
      styleSuggestions,
      feedback,
    };

    this.analyses.set(submission.id, analysis);
    return analysis;
  }

  /**
   * Detect errors in text
   */
  private detectErrors(text: string, _task: WritingTask): WritingError[] {
    const errors: WritingError[] = [];

    // Common grammar patterns
    const grammarPatterns: Array<{
      pattern: RegExp;
      correction: string;
      explanation: string;
      explanationChinese: string;
      type: WritingError["type"];
    }> = [
      {
        pattern: /\bi\b(?!\s+(?:am|was|have|do|can|will|like|want|need|went|saw|ate))/gi,
        correction: text.replace(/\bi\b/g, "I"),
        explanation: "Use capital 'I' for first person singular",
        explanationChinese: "第一人称单数用大写'I'",
        type: "grammar",
      },
      {
        pattern: /\b(don't|doesn't)\s+(?:go|like|want|have|know|think|see|eat|drink)/gi,
        correction: text,
        explanation: "Check verb agreement with subject",
        explanationChinese: "检查主语和动词的一致性",
        type: "agreement",
      },
      {
        pattern: /\b(yesterday|last week|ago)\b.*\b(go|like|want|have|see|eat)\b/gi,
        correction: text,
        explanation: "Use past tense for past time expressions",
        explanationChinese: "过去时间用过去式",
        type: "tense",
      },
    ];

    // Check each pattern
    for (const { pattern, correction, explanation, explanationChinese, type } of grammarPatterns) {
      if (pattern.test(text)) {
        errors.push({
          type,
          original: text.match(pattern)?.[0] || "",
          corrected: correction,
          position: text.toLowerCase().indexOf(text.match(pattern)?.[0]?.toLowerCase() || ""),
          length: text.match(pattern)?.[0]?.length || 0,
          severity: "moderate",
          explanation,
          explanationChinese,
        });
      }
    }

    // Check for missing articles
    const articlePatterns = [
      /\b(have|want|need|like)\s+(book|car|house|idea|cat|dog|apple)/gi,
    ];

    for (const pattern of articlePatterns) {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        errors.push({
          type: "article",
          original: match[0],
          corrected: `${match[1]} a ${match[2]}`,
          position: match.index || 0,
          length: match[0].length,
          severity: "minor",
          explanation: "Add article 'a' before singular countable noun",
          explanationChinese: "单数可数名词前加冠词'a'",
        });
      }
    }

    // Check for very short sentences
    const words = text.split(/\s+/).filter(w => w.length > 0);
    if (words.length < 3) {
      errors.push({
        type: "grammar",
        original: text,
        corrected: text,
        position: 0,
        length: text.length,
        severity: "minor",
        explanation: "Sentence is too short. Try to write more complete sentences.",
        explanationChinese: "句子太短。尝试写更完整的句子。",
      });
    }

    return errors;
  }

  /**
   * Generate corrections from errors
   */
  private generateCorrections(errors: WritingError[]): WritingCorrection[] {
    return errors.map(error => ({
      original: error.original,
      corrected: error.corrected,
      explanation: error.explanation,
      explanationChinese: error.explanationChinese,
      alternatives: [],
    }));
  }

  /**
   * Generate vocabulary suggestions
   */
  private generateVocabularySuggestions(text: string, _task: WritingTask): VocabularySuggestion[] {
    const suggestions: VocabularySuggestion[] = [];
    const lowerText = text.toLowerCase();

    // Suggest better vocabulary
    const vocabularyMap: Array<{
      simple: string;
      better: string;
      meaning: string;
      meaningChinese: string;
      example: string;
    }> = [
      { simple: "good", better: "excellent", meaning: "very good", meaningChinese: "优秀的", example: "The food was excellent." },
      { simple: "bad", better: "terrible", meaning: "very bad", meaningChinese: "糟糕的", example: "The weather was terrible." },
      { simple: "big", better: "enormous", meaning: "very large", meaningChinese: "巨大的", example: "The building is enormous." },
      { simple: "small", better: "tiny", meaning: "very small", meaningChinese: "微小的", example: "The room was tiny." },
      { simple: "like", better: "enjoy", meaning: "to take pleasure in", meaningChinese: "享受", example: "I enjoy reading books." },
      { simple: "want", better: "desire", meaning: "to want strongly", meaningChinese: "渴望", example: "I desire to learn English." },
    ];

    for (const { simple, better, meaning, meaningChinese, example } of vocabularyMap) {
      if (lowerText.includes(simple) && !lowerText.includes(better)) {
        suggestions.push({
          word: better,
          meaning,
          meaningChinese,
          example,
          level: "elementary",
        });
      }
    }

    return suggestions.slice(0, 3);
  }

  /**
   * Generate style suggestions
   */
  private generateStyleSuggestions(text: string, _task: WritingTask): string[] {
    const suggestions: string[] = [];
    const words = text.split(/\s+/).filter(w => w.length > 0);

    // Check sentence length
    if (words.length < 10) {
      suggestions.push("Try to write longer sentences with more detail");
    }

    // Check for repetition
    const wordCount: Record<string, number> = {};
    for (const word of words) {
      const lower = word.toLowerCase();
      wordCount[lower] = (wordCount[lower] || 0) + 1;
    }

    for (const [word, count] of Object.entries(wordCount)) {
      if (count > 3 && word.length > 3) {
        suggestions.push(`Try using synonyms for "${word}" to avoid repetition`);
      }
    }

    // Check for variety
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (sentences.length < 2) {
      suggestions.push("Try to write multiple sentences");
    }

    return suggestions;
  }

  /**
   * Calculate grammar score
   */
  private calculateGrammarScore(errors: WritingError[]): number {
    if (errors.length === 0) return 1;

    let penalty = 0;
    for (const error of errors) {
      if (error.severity === "major") penalty += 0.3;
      else if (error.severity === "moderate") penalty += 0.2;
      else penalty += 0.1;
    }

    return Math.max(0, 1 - penalty);
  }

  /**
   * Calculate vocabulary score
   */
  private calculateVocabularyScore(text: string, _task: WritingTask): number {
    const words = text.split(/\s+/).filter(w => w.length > 0);
    if (words.length === 0) return 0;

    // Basic vocabulary richness
    const uniqueWords = new Set(words.map(w => w.toLowerCase()));
    const richness = uniqueWords.size / words.length;

    // Simple vocabulary level check
    let score = 0.5; // Base score
    if (richness > 0.7) score += 0.2;
    if (words.length > 10) score += 0.1;
    if (words.length > 20) score += 0.1;
    if (uniqueWords.size > 15) score += 0.1;

    return Math.min(1, score);
  }

  /**
   * Calculate coherence score
   */
  private calculateCoherenceScore(text: string): number {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (sentences.length === 0) return 0;

    let score = 0.5; // Base score

    // Check for multiple sentences
    if (sentences.length >= 3) score += 0.2;
    if (sentences.length >= 5) score += 0.1;

    // Check for transition words
    const transitions = ["however", "therefore", "also", "moreover", "furthermore", "in addition"];
    const lowerText = text.toLowerCase();
    for (const transition of transitions) {
      if (lowerText.includes(transition)) {
        score += 0.1;
        break;
      }
    }

    return Math.min(1, score);
  }

  /**
   * Generate feedback
   */
  private generateFeedback(
    errors: WritingError[],
    grammarScore: number,
    vocabularyScore: number,
    coherenceScore: number
  ): WritingFeedback {
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const nextSteps: string[] = [];

    // Analyze strengths
    if (grammarScore >= 0.8) strengths.push("Grammar is strong");
    if (vocabularyScore >= 0.8) strengths.push("Vocabulary is varied");
    if (coherenceScore >= 0.8) strengths.push("Writing is well-organized");

    // Analyze weaknesses
    if (grammarScore < 0.6) weaknesses.push("Grammar needs improvement");
    if (vocabularyScore < 0.6) weaknesses.push("Vocabulary could be more varied");
    if (coherenceScore < 0.6) weaknesses.push("Writing could be better organized");

    // Common errors
    const errorTypes = errors.map(e => e.type);
    if (errorTypes.includes("tense")) weaknesses.push("Watch out for tense errors");
    if (errorTypes.includes("article")) weaknesses.push("Remember to use articles correctly");

    // Next steps
    if (grammarScore < 0.7) nextSteps.push("Review basic grammar rules");
    if (vocabularyScore < 0.7) nextSteps.push("Learn more vocabulary");
    if (errors.length > 3) nextSteps.push("Focus on reducing errors");

    // Overall feedback
    const overallScore = (grammarScore + vocabularyScore + coherenceScore) / 3;
    let overall: string;
    let overallChinese: string;

    if (overallScore >= 0.8) {
      overall = "Excellent writing! Keep up the great work.";
      overallChinese = "写得很好！继续保持！";
    } else if (overallScore >= 0.6) {
      overall = "Good effort! A few areas to improve.";
      overallChinese = "做得不错！有几个地方可以改进。";
    } else {
      overall = "Keep practicing! You're making progress.";
      overallChinese = "继续练习！你在进步。";
    }

    return {
      overall,
      overallChinese,
      strengths,
      weaknesses,
      nextSteps,
    };
  }

  /**
   * Get progress
   */
  getProgress(): WritingProgress {
    const allSubmissions = Array.from(this.submissions.values());
    const allAnalyses = Array.from(this.analyses.values());

    const totalTasks = this.tasks.size;
    const completedTasks = allSubmissions.length;

    const averageScore = allAnalyses.length > 0
      ? allAnalyses.reduce((sum, a) => sum + a.overallScore, 0) / allAnalyses.length
      : 0;

    const grammarImprovement = this.calculateImprovement("grammarScore");
    const vocabularyImprovement = this.calculateImprovement("vocabularyScore");

    const commonErrors = this.getCommonErrors();

    return {
      totalTasks,
      completedTasks,
      averageScore,
      grammarImprovement,
      vocabularyImprovement,
      commonErrors,
    };
  }

  /**
   * Calculate improvement over time
   */
  private calculateImprovement(metric: "grammarScore" | "vocabularyScore"): number {
    const analyses = Array.from(this.analyses.values())
      .sort((a, b) => a.submissionId.localeCompare(b.submissionId));

    if (analyses.length < 2) return 0;

    const firstHalf = analyses.slice(0, Math.floor(analyses.length / 2));
    const secondHalf = analyses.slice(Math.floor(analyses.length / 2));

    const firstAvg = firstHalf.reduce((sum, a) => sum + a[metric], 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, a) => sum + a[metric], 0) / secondHalf.length;

    return secondAvg - firstAvg;
  }

  /**
   * Get common errors
   */
  private getCommonErrors(): string[] {
    const errorCounts: Record<string, number> = {};

    for (const analysis of this.analyses.values()) {
      for (const error of analysis.errors) {
        errorCounts[error.type] = (errorCounts[error.type] || 0) + 1;
      }
    }

    return Object.entries(errorCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([type]) => type);
  }
}
