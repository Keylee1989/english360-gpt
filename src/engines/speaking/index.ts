/**
 * Speaking Engine v1
 *
 * Manages speaking practice:
 * - Browser speech recognition
 * - Text comparison
 * - Basic pronunciation feedback
 * - Progress tracking
 */

// ============================================================
// Types
// ============================================================

export interface SpeakingExercise {
  id: string;
  modelSentence: string;
  chineseMeaning: string;
  phoneticHint?: string;
  level: "beginner" | "intermediate" | "advanced";
  category: "repeat" | "describe" | "conversation";
  keyWords: string[];
}

export interface SpeakingResult {
  exerciseId: string;
  userSpeech: string;
  modelSentence: string;
  score: number; // 0-1
  accuracy: number; // 0-1
  fluency: number; // 0-1
  pronunciation: number; // 0-1
  feedback: string;
  suggestions: string[];
}

export interface SpeakingProgress {
  userId: string;
  totalAttempts: number;
  averageScore: number;
  averageAccuracy: number;
  averageFluency: number;
  totalTime: number;
  lastPracticed: number;
}

// ============================================================
// Speaking Engine
// ============================================================

export class SpeakingEngine {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private recognition: any = null;
  private isRecording: boolean = false;
  private onResultCallback: ((result: string) => void) | null = null;
  private onErrorCallback: ((error: string) => void) | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognitionAPI) {
        this.recognition = new SpeechRecognitionAPI();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = "en-US";

        this.recognition.onresult = (event: { results: { transcript: string }[][] }) => {
          const result = event.results[0][0].transcript;
          if (this.onResultCallback) {
            this.onResultCallback(result);
          }
        };

        this.recognition.onerror = (event: { error: string }) => {
          if (this.onErrorCallback) {
            this.onErrorCallback(event.error);
          }
        };

        this.recognition.onend = () => {
          this.isRecording = false;
        };
      }
    }
  }

  // ============================================================
  // Speech Recognition
  // ============================================================

  /**
   * Check if speech recognition is supported
   */
  isSupported(): boolean {
    return this.recognition !== null;
  }

  /**
   * Start recording
   */
  startRecording(
    onResult: (result: string) => void,
    onError: (error: string) => void,
  ): void {
    if (!this.recognition) {
      onError("Speech recognition not supported");
      return;
    }

    this.onResultCallback = onResult;
    this.onErrorCallback = onError;

    try {
      this.recognition.start();
      this.isRecording = true;
    } catch {
      onError("Failed to start recording");
    }
  }

  /**
   * Stop recording
   */
  stopRecording(): void {
    if (this.recognition && this.isRecording) {
      this.recognition.stop();
      this.isRecording = false;
    }
  }

  /**
   * Check if currently recording
   */
  getIsRecording(): boolean {
    return this.isRecording;
  }

  // ============================================================
  // Exercise Generation
  // ============================================================

  /**
   * Generate speaking exercises for a lesson
   */
  generateExercises(
    sentences: { english: string; chinese: string }[],
    vocabulary: { word: string; chineseMeaning: string }[],
  ): SpeakingExercise[] {
    const exercises: SpeakingExercise[] = [];

    // Generate sentence repetition exercises
    sentences.forEach((sentence, index) => {
      exercises.push({
        id: `speak_sentence_${index}`,
        modelSentence: sentence.english,
        chineseMeaning: sentence.chinese,
        level: "beginner",
        category: "repeat",
        keyWords: sentence.english.split(" ").slice(0, 3),
      });
    });

    // Generate word pronunciation exercises
    vocabulary.forEach((word, index) => {
      exercises.push({
        id: `speak_word_${index}`,
        modelSentence: word.word,
        chineseMeaning: word.chineseMeaning,
        level: "beginner",
        category: "repeat",
        keyWords: [word.word],
      });
    });

    return exercises;
  }

  // ============================================================
  // Exercise Evaluation
  // ============================================================

  /**
   * Evaluate user's speaking attempt
   */
  evaluateSpeaking(
    exercise: SpeakingExercise,
    userSpeech: string,
  ): SpeakingResult {
    const modelSentence = exercise.modelSentence.toLowerCase();
    const userSpeechLower = userSpeech.toLowerCase().trim();

    // Calculate accuracy (how close to model)
    const accuracy = this.calculateAccuracy(modelSentence, userSpeechLower);

    // Calculate fluency (based on speech characteristics)
    const fluency = this.calculateFluency(userSpeech);

    // Calculate pronunciation (based on key words)
    const pronunciation = this.calculatePronunciation(
      exercise.keyWords,
      userSpeechLower,
    );

    // Overall score (weighted average)
    const score = accuracy * 0.5 + fluency * 0.25 + pronunciation * 0.25;

    // Generate feedback
    const feedback = this.generateFeedback(score, accuracy, fluency, pronunciation);

    // Generate suggestions
    const suggestions = this.generateSuggestions(
      exercise,
      userSpeechLower,
      accuracy,
    );

    return {
      exerciseId: exercise.id,
      userSpeech,
      modelSentence: exercise.modelSentence,
      score,
      accuracy,
      fluency,
      pronunciation,
      feedback,
      suggestions,
    };
  }

  /**
   * Calculate accuracy score
   */
  private calculateAccuracy(model: string, user: string): number {
    if (model === user) return 1;

    // Use Levenshtein distance
    const distance = this.levenshteinDistance(model, user);
    const maxLength = Math.max(model.length, user.length);
    return maxLength > 0 ? 1 - distance / maxLength : 0;
  }

  /**
   * Calculate fluency score (placeholder - would need audio analysis)
   */
  private calculateFluency(_userSpeech: string): number {
    // In a real implementation, this would analyze:
    // - Speech rate
    // - Pauses
    // - Hesitations
    // For now, return a default value
    return 0.7;
  }

  /**
   * Calculate pronunciation score based on key words
   */
  private calculatePronunciation(keyWords: string[], userSpeech: string): number {
    if (keyWords.length === 0) return 0.5;

    let correctWords = 0;
    for (const word of keyWords) {
      if (userSpeech.includes(word.toLowerCase())) {
        correctWords++;
      }
    }

    return correctWords / keyWords.length;
  }

  /**
   * Generate feedback based on scores
   */
  private generateFeedback(
    score: number,
    _accuracy: number,
    _fluency: number,
    _pronunciation: number,
  ): string {
    if (score >= 0.9) {
      return "太棒了！发音非常准确！";
    } else if (score >= 0.7) {
      return "很好！继续练习会更好！";
    } else if (score >= 0.5) {
      return "不错，但还有提升空间。";
    } else {
      return "再试一次，注意发音。";
    }
  }

  /**
   * Generate improvement suggestions
   */
  private generateSuggestions(
    exercise: SpeakingExercise,
    userSpeech: string,
    _accuracy: number,
  ): string[] {
    const suggestions: string[] = [];

    if (_accuracy < 0.7) {
      suggestions.push("尝试更慢地说话");
      suggestions.push("注意每个单词的发音");
    }

    if (_accuracy < 0.5) {
      suggestions.push("先听几遍模型句子");
      suggestions.push("注意重音和语调");
    }

    // Check for missing key words
    for (const word of exercise.keyWords) {
      if (!userSpeech.includes(word.toLowerCase())) {
        suggestions.push(`注意单词 "${word}" 的发音`);
      }
    }

    return suggestions;
  }

  /**
   * Calculate Levenshtein distance
   */
  private levenshteinDistance(a: string, b: string): number {
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
            matrix[i - 1][j] + 1,
          );
        }
      }
    }

    return matrix[b.length][a.length];
  }

  // ============================================================
  // Progress Tracking
  // ============================================================

  /**
   * Calculate speaking progress
   */
  calculateProgress(results: SpeakingResult[]): SpeakingProgress {
    const totalAttempts = results.length;
    const averageScore =
      totalAttempts > 0
        ? results.reduce((sum, r) => sum + r.score, 0) / totalAttempts
        : 0;
    const averageAccuracy =
      totalAttempts > 0
        ? results.reduce((sum, r) => sum + r.accuracy, 0) / totalAttempts
        : 0;
    const averageFluency =
      totalAttempts > 0
        ? results.reduce((sum, r) => sum + r.fluency, 0) / totalAttempts
        : 0;

    return {
      userId: "current",
      totalAttempts,
      averageScore,
      averageAccuracy,
      averageFluency,
      totalTime: 0,
      lastPracticed: Date.now(),
    };
  }
}
