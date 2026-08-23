/**
 * Learning Activity Framework v1
 *
 * Creates reusable activity system:
 * - recognition
 * - recall
 * - typing
 * - listening choice
 * - pronunciation preparation
 * - sentence building
 *
 * Each activity:
 * - receives knowledge item
 * - generates exercise
 * - evaluates answer
 * - updates knowledge state
 */

import type { SkillDomain } from "@/types";
import type { VocabularyItem } from "../vocabulary";

// ============================================================
// Activity Types
// ============================================================

export type ActivityType =
  | "recognition"      // Multiple choice - recognize correct answer
  | "recall"           // Free recall - type from memory
  | "typing"           // Type the word/sentence
  | "listening_choice" // Listen and choose
  | "pronunciation_prep" // Pronunciation preparation
  | "sentence_building"; // Arrange words into sentence

export interface ActivityConfig {
  type: ActivityType;
  domain: SkillDomain;
  itemCount: number;
  difficulty: number; // 0-1
  timeLimit?: number; // seconds
  chineseAssist: ChineseAssistLevel;
}

// ============================================================
// Chinese Assist Levels
// ============================================================

export type ChineseAssistLevel =
  | 5  // Full Chinese explanation
  | 4  // Chinese + simple English
  | 3  // Mixed
  | 2  // Mostly English
  | 1  // English with hints
  | 0; // Immersion

// ============================================================
// Exercise Interfaces
// ============================================================

export interface Exercise {
  id: string;
  type: ActivityType;
  domain: SkillDomain;
  instructions: string;
  chineseInstructions: string;
  items: ExerciseItem[];
  timeLimit?: number;
  chineseAssist: ChineseAssistLevel;
}

export interface ExerciseItem {
  id: string;
  type: "multiple_choice" | "text_input" | "audio_prompt" | "word_arrangement";
  prompt: string;
  chinesePrompt?: string;
  audioUrl?: string;
  correctAnswer: string;
  alternatives?: string[];
  hints?: string[];
  chineseHints?: string[];
  options?: string[];       // For multiple choice
  chineseOptions?: string[];
  wordBank?: string[];      // For sentence building
}

export interface ExerciseResult {
  exerciseId: string;
  itemId: string;
  correct: boolean;
  userAnswer: string;
  correctAnswer: string;
  score: number;        // 0-1
  feedback: string;
  chineseFeedback: string;
  timeSpent: number;    // ms
  hintsUsed: number;
}

// ============================================================
// Activity Generator
// ============================================================

export class ActivityGenerator {
  private assistLevel: ChineseAssistLevel;

  constructor(assistLevel: ChineseAssistLevel = 3) {
    this.assistLevel = assistLevel;
  }

  /**
   * Set Chinese assist level
   */
  setAssistLevel(level: ChineseAssistLevel): void {
    this.assistLevel = level;
  }

  /**
   * Generate an exercise for a vocabulary item
   */
  generateExercise(
    item: VocabularyItem,
    type: ActivityType,
    config?: Partial<ActivityConfig>
  ): Exercise {
    const chineseAssist = config?.chineseAssist ?? this.assistLevel;

    switch (type) {
      case "recognition":
        return this.generateRecognition(item, chineseAssist);
      case "recall":
        return this.generateRecall(item, chineseAssist);
      case "typing":
        return this.generateTyping(item, chineseAssist);
      case "listening_choice":
        return this.generateListeningChoice(item, chineseAssist);
      case "pronunciation_prep":
        return this.generatePronunciationPrep(item, chineseAssist);
      case "sentence_building":
        return this.generateSentenceBuilding(item, chineseAssist);
      default:
        return this.generateRecognition(item, chineseAssist);
    }
  }

  /**
   * Generate exercise from multiple items
   */
  generateExerciseSet(
    items: VocabularyItem[],
    type: ActivityType,
    config?: Partial<ActivityConfig>
  ): Exercise {
    return this.generateExercise(items[0], type, config);
  }

  // ============================================================
  // Exercise Generators
  // ============================================================

  private generateRecognition(item: VocabularyItem, assist: ChineseAssistLevel): Exercise {
    const exerciseId = `recognition_${item.word}_${Date.now()}`;

    // Generate 4 options including correct answer
    const options = this.generateMultipleChoiceOptions(item);

    const prompt = assist >= 3
      ? `选择正确的中文意思：${item.word}`
      : `What does "${item.word}" mean?`;

    const chinesePrompt = assist >= 3 ? `这个词是什么意思？` : undefined;

    const item_: ExerciseItem = {
      id: `${exerciseId}_1`,
      type: "multiple_choice",
      prompt: item.word,
      chinesePrompt,
      correctAnswer: item.chineseMeaning,
      options: options.map(o => o.english),
      chineseOptions: options.map(o => o.chinese),
      hints: [item.ipa, item.partOfSpeech[0]],
      chineseHints: assist >= 2 ? [item.phonicsBreakdown] : undefined,
    };

    return {
      id: exerciseId,
      type: "recognition",
      domain: "vocabulary",
      instructions: prompt,
      chineseInstructions: chinesePrompt || "",
      items: [item_],
      chineseAssist: assist,
    };
  }

  private generateRecall(item: VocabularyItem, assist: ChineseAssistLevel): Exercise {
    const exerciseId = `recall_${item.word}_${Date.now()}`;

    const prompt = assist >= 3
      ? `根据中文意思，写出英文单词：${item.chineseMeaning}`
      : `Write the English word for: ${item.chineseMeaning}`;

    const chinesePrompt = assist >= 3 ? `写出这个单词的英文` : undefined;

    const item_: ExerciseItem = {
      id: `${exerciseId}_1`,
      type: "text_input",
      prompt: item.chineseMeaning,
      chinesePrompt,
      correctAnswer: item.word.toLowerCase(),
      alternatives: [item.word],
      hints: [item.ipa, item.partOfSpeech[0], item.phonicsBreakdown],
      chineseHints: assist >= 2 ? [
        `第一个字母是 ${item.word[0].toUpperCase()}`,
        `有 ${item.word.length} 个字母`,
      ] : undefined,
    };

    return {
      id: exerciseId,
      type: "recall",
      domain: "vocabulary",
      instructions: prompt,
      chineseInstructions: chinesePrompt || "",
      items: [item_],
      chineseAssist: assist,
    };
  }

  private generateTyping(item: VocabularyItem, assist: ChineseAssistLevel): Exercise {
    const exerciseId = `typing_${item.word}_${Date.now()}`;

    const prompt = assist >= 3
      ? `听发音，打出单词：${item.word}`
      : `Type the word you hear:`;

    const chinesePrompt = assist >= 3 ? `打字练习` : undefined;

    const item_: ExerciseItem = {
      id: `${exerciseId}_1`,
      type: "text_input",
      prompt: item.word,
      chinesePrompt,
      audioUrl: item.audioUrl,
      correctAnswer: item.word.toLowerCase(),
      alternatives: [item.word],
      hints: [item.ipa, item.phonicsBreakdown],
      chineseHints: assist >= 2 ? [
        `这个词的发音是 ${item.ipa}`,
        `音节分解：${item.phonicsBreakdown}`,
      ] : undefined,
    };

    return {
      id: exerciseId,
      type: "typing",
      domain: "vocabulary",
      instructions: prompt,
      chineseInstructions: chinesePrompt || "",
      items: [item_],
      chineseAssist: assist,
    };
  }

  private generateListeningChoice(item: VocabularyItem, assist: ChineseAssistLevel): Exercise {
    const exerciseId = `listening_${item.word}_${Date.now()}`;

    const prompt = assist >= 3
      ? `听发音，选择正确的单词`
      : `Listen and choose the correct word`;

    const chinesePrompt = assist >= 3 ? `听力选择` : undefined;

    // Generate 4 options
    const options = this.generateMultipleChoiceOptions(item);

    const item_: ExerciseItem = {
      id: `${exerciseId}_1`,
      type: "audio_prompt",
      prompt: "Listen",
      chinesePrompt,
      audioUrl: item.audioUrl,
      correctAnswer: item.word.toLowerCase(),
      options: options.map(o => o.english),
      chineseOptions: assist >= 3 ? options.map(o => o.chinese) : undefined,
    };

    return {
      id: exerciseId,
      type: "listening_choice",
      domain: "listening",
      instructions: prompt,
      chineseInstructions: chinesePrompt || "",
      items: [item_],
      chineseAssist: assist,
    };
  }

  private generatePronunciationPrep(item: VocabularyItem, assist: ChineseAssistLevel): Exercise {
    const exerciseId = `pronunciation_${item.word}_${Date.now()}`;

    const prompt = assist >= 3
      ? `练习发音：${item.word}`
      : `Practice pronunciation: ${item.word}`;

    const chinesePrompt = assist >= 3 ? `发音练习` : undefined;

    const item_: ExerciseItem = {
      id: `${exerciseId}_1`,
      type: "text_input",
      prompt: item.word,
      chinesePrompt,
      correctAnswer: item.word.toLowerCase(),
      hints: [
        item.ipa,
        item.phonicsBreakdown,
        `音节数：${item.syllableCount}`,
      ],
      chineseHints: assist >= 2 ? [
        `发音：${item.ipa}`,
        `音节分解：${item.phonicsBreakdown}`,
        item.memoryMethods.chinesePronHint,
        `音节数：${item.syllableCount}`,
      ].filter((h): h is string => Boolean(h)) : undefined,
    };

    return {
      id: exerciseId,
      type: "pronunciation_prep",
      domain: "pronunciation",
      instructions: prompt,
      chineseInstructions: chinesePrompt || "",
      items: [item_],
      chineseAssist: assist,
    };
  }

  private generateSentenceBuilding(item: VocabularyItem, assist: ChineseAssistLevel): Exercise {
    const exerciseId = `sentence_${item.word}_${Date.now()}`;

    // Use example sentence if available
    const example = item.examples[0];
    const sentence = example?.english || `This is a ${item.word}.`;
    const words = sentence.split(" ");

    // Shuffle words for word bank
    const shuffled = [...words].sort(() => Math.random() - 0.5);

    const prompt = assist >= 3
      ? `用正确的顺序排列单词组成句子：${example?.chinese || item.chineseMeaning}`
      : `Arrange the words to form a sentence:`;

    const chinesePrompt = assist >= 3 ? `句子排列` : undefined;

    const item_: ExerciseItem = {
      id: `${exerciseId}_1`,
      type: "word_arrangement",
      prompt: example?.chinese || item.chineseMeaning,
      chinesePrompt,
      correctAnswer: sentence,
      wordBank: shuffled,
      hints: [sentence],
      chineseHints: assist >= 2 ? [example?.chinese] : undefined,
    };

    return {
      id: exerciseId,
      type: "sentence_building",
      domain: "vocabulary",
      instructions: prompt,
      chineseInstructions: chinesePrompt || "",
      items: [item_],
      chineseAssist: assist,
    };
  }

  // ============================================================
  // Answer Evaluation
  // ============================================================

  /**
   * Evaluate a user's answer
   */
  evaluateAnswer(
    exercise: Exercise,
    itemId: string,
    userAnswer: string
  ): ExerciseResult {
    const item = exercise.items.find(i => i.id === itemId);
    if (!item) {
      return {
        exerciseId: exercise.id,
        itemId,
        correct: false,
        userAnswer,
        correctAnswer: "",
        score: 0,
        feedback: "Item not found",
        chineseFeedback: "未找到题目",
        timeSpent: 0,
        hintsUsed: 0,
      };
    }

    const normalizedUser = userAnswer.trim().toLowerCase();
    const normalizedCorrect = item.correctAnswer.toLowerCase();

    // Check exact match
    const isExactMatch = normalizedUser === normalizedCorrect;

    // Check alternatives
    const isAlternative = item.alternatives?.some(
      alt => normalizedUser === alt.toLowerCase()
    ) ?? false;

    const correct = isExactMatch || isAlternative;

    // Calculate score based on similarity
    const score = correct ? 1 : this.calculateSimilarity(normalizedUser, normalizedCorrect);

    // Generate feedback
    const feedback = correct
      ? "Correct! Well done!"
      : `The correct answer is: ${item.correctAnswer}`;

    const chineseFeedback = exercise.chineseAssist >= 2
      ? (correct ? "正确！做得好！" : `正确答案是：${item.correctAnswer}`)
      : feedback;

    return {
      exerciseId: exercise.id,
      itemId,
      correct,
      userAnswer,
      correctAnswer: item.correctAnswer,
      score,
      feedback,
      chineseFeedback,
      timeSpent: 0,
      hintsUsed: 0,
    };
  }

  /**
   * Evaluate multiple choice answer
   */
  evaluateMultipleChoice(
    exercise: Exercise,
    itemId: string,
    selectedIndex: number
  ): ExerciseResult {
    const item = exercise.items.find(i => i.id === itemId);
    if (!item) {
      return {
        exerciseId: exercise.id,
        itemId,
        correct: false,
        userAnswer: "",
        correctAnswer: "",
        score: 0,
        feedback: "Item not found",
        chineseFeedback: "未找到题目",
        timeSpent: 0,
        hintsUsed: 0,
      };
    }

    const selectedAnswer = item.options?.[selectedIndex] || "";
    const correct = selectedAnswer.toLowerCase() === item.correctAnswer.toLowerCase();

    return {
      exerciseId: exercise.id,
      itemId,
      correct,
      userAnswer: selectedAnswer,
      correctAnswer: item.correctAnswer,
      score: correct ? 1 : 0,
      feedback: correct ? "Correct!" : `The correct answer is: ${item.correctAnswer}`,
      chineseFeedback: exercise.chineseAssist >= 2
        ? (correct ? "正确！" : `正确答案是：${item.correctAnswer}`)
        : "",
      timeSpent: 0,
      hintsUsed: 0,
    };
  }

  // ============================================================
  // Helper Methods
  // ============================================================

  private generateMultipleChoiceOptions(item: VocabularyItem): { english: string; chinese: string }[] {
    const correct = { english: item.chineseMeaning, chinese: item.chineseMeaning };

    // Generate 3 wrong options (simplified - in production, use word relationships)
    const wrongOptions = [
      { english: "错误选项1", chinese: "错误1" },
      { english: "错误选项2", chinese: "错误2" },
      { english: "错误选项3", chinese: "错误3" },
    ];

    // Shuffle and insert correct answer
    const options = [...wrongOptions, correct];
    return options.sort(() => Math.random() - 0.5);
  }

  private calculateSimilarity(a: string, b: string): number {
    if (a === b) return 1;
    if (a.length === 0 || b.length === 0) return 0;

    // Simple Levenshtein distance ratio
    const matrix: number[][] = [];

    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    const distance = matrix[b.length][a.length];
    const maxLength = Math.max(a.length, b.length);

    return 1 - distance / maxLength;
  }
}

// ============================================================
// Activity Runner (for UI integration)
// ============================================================

export class ActivityRunner {
  private generator: ActivityGenerator;
  private results: ExerciseResult[] = [];

  constructor(assistLevel: ChineseAssistLevel = 3) {
    this.generator = new ActivityGenerator(assistLevel);
  }

  /**
   * Start a new activity session
   */
  startSession(items: VocabularyItem[], type: ActivityType): Exercise {
    return this.generator.generateExercise(items[0], type);
  }

  /**
   * Submit an answer
   */
  submitAnswer(
    exercise: Exercise,
    itemId: string,
    answer: string | number
  ): ExerciseResult {
    let result: ExerciseResult;

    if (typeof answer === "number") {
      result = this.generator.evaluateMultipleChoice(exercise, itemId, answer);
    } else {
      result = this.generator.evaluateAnswer(exercise, itemId, answer);
    }

    this.results.push(result);
    return result;
  }

  /**
   * Get session statistics
   */
  getSessionStats(): {
    total: number;
    correct: number;
    incorrect: number;
    accuracy: number;
    averageScore: number;
  } {
    const total = this.results.length;
    const correct = this.results.filter(r => r.correct).length;
    const incorrect = total - correct;

    return {
      total,
      correct,
      incorrect,
      accuracy: total > 0 ? correct / total : 0,
      averageScore: total > 0
        ? this.results.reduce((sum, r) => sum + r.score, 0) / total
        : 0,
    };
  }

  /**
   * Reset session
   */
  resetSession(): void {
    this.results = [];
  }
}
