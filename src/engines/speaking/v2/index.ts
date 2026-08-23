/**
 * Speaking Engine v2
 * 
 * 3 Modes:
 * - Shadowing mode (跟读)
 * - Substitution training (替换训练)
 * - Free response (自由回答)
 * 
 * Scoring:
 * - Accuracy (准确性)
 * - Fluency (流利度)
 * - Pronunciation (发音)
 */

// ============================================================
// Types
// ============================================================

export type SpeakingMode = "shadowing" | "substitution" | "free_response";

export interface SpeakingExercise {
  id: string;
  mode: SpeakingMode;
  modelSentence: string;
  chineseMeaning: string;
  keyWords: string[];
  substitutionWords?: string[];
  prompts?: string[];
  level: "beginner" | "intermediate" | "advanced";
}

export interface SpeakingResult {
  exerciseId: string;
  mode: SpeakingMode;
  userSpeech: string;
  modelSentence: string;
  score: SpeakingScore;
  feedback: string;
  suggestions: string[];
  timeSpent: number;
}

export interface SpeakingScore {
  overall: number;      // 0-1
  accuracy: number;     // 0-1
  fluency: number;      // 0-1
  pronunciation: number; // 0-1
}

export interface SpeakingProgress {
  userId: string;
  totalAttempts: number;
  averageScore: SpeakingScore;
  modeStats: {
    shadowing: { attempts: number; averageScore: number };
    substitution: { attempts: number; averageScore: number };
    free_response: { attempts: number; averageScore: number };
  };
  lastPracticed: number;
}

// ============================================================
// Speaking Engine v2
// ============================================================

export class SpeakingEngineV2 {
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
  // Recording
  // ============================================================

  isSupported(): boolean {
    return this.recognition !== null;
  }

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

  stopRecording(): void {
    if (this.recognition && this.isRecording) {
      this.recognition.stop();
      this.isRecording = false;
    }
  }

  getIsRecording(): boolean {
    return this.isRecording;
  }

  // ============================================================
  // Exercise Generation
  // ============================================================

  generateShadowingExercise(
    sentence: string,
    chineseMeaning: string,
    keyWords: string[],
  ): SpeakingExercise {
    return {
      id: `shadow_${Date.now()}`,
      mode: "shadowing",
      modelSentence: sentence,
      chineseMeaning,
      keyWords,
      level: "beginner",
    };
  }

  generateSubstitutionExercise(
    modelSentence: string,
    chineseMeaning: string,
    substitutionWords: string[],
    keyWords: string[],
  ): SpeakingExercise {
    return {
      id: `sub_${Date.now()}`,
      mode: "substitution",
      modelSentence,
      chineseMeaning,
      keyWords,
      substitutionWords,
      level: "beginner",
    };
  }

  generateFreeResponseExercise(
    prompt: string,
    chinesePrompt: string,
    keyWords: string[],
  ): SpeakingExercise {
    return {
      id: `free_${Date.now()}`,
      mode: "free_response",
      modelSentence: "",
      chineseMeaning: chinesePrompt,
      keyWords,
      prompts: [prompt],
      level: "beginner",
    };
  }

  // ============================================================
  // Exercise Evaluation
  // ============================================================

  evaluateExercise(
    exercise: SpeakingExercise,
    userSpeech: string,
  ): SpeakingResult {
    let score: SpeakingScore;
    let feedback: string;
    let suggestions: string[] = [];

    switch (exercise.mode) {
      case "shadowing":
        ({ score, feedback, suggestions } = this.evaluateShadowing(exercise, userSpeech));
        break;
      case "substitution":
        ({ score, feedback, suggestions } = this.evaluateSubstitution(exercise, userSpeech));
        break;
      case "free_response":
        ({ score, feedback, suggestions } = this.evaluateFreeResponse(exercise, userSpeech));
        break;
      default:
        score = { overall: 0, accuracy: 0, fluency: 0, pronunciation: 0 };
        feedback = "Unknown mode";
    }

    return {
      exerciseId: exercise.id,
      mode: exercise.mode,
      userSpeech,
      modelSentence: exercise.modelSentence,
      score,
      feedback,
      suggestions,
      timeSpent: 0,
    };
  }

  private evaluateShadowing(
    exercise: SpeakingExercise,
    userSpeech: string,
  ): { score: SpeakingScore; feedback: string; suggestions: string[] } {
    const model = exercise.modelSentence.toLowerCase();
    const user = userSpeech.toLowerCase().trim();

    const accuracy = this.calculateAccuracy(model, user);
    const fluency = this.calculateFluency(userSpeech);
    const pronunciation = this.calculatePronunciation(exercise.keyWords, user);

    const overall = accuracy * 0.5 + fluency * 0.25 + pronunciation * 0.25;

    const feedback = overall >= 0.8
      ? "Excellent! 太棒了！"
      : overall >= 0.6
      ? "Good job! 很好！"
      : "Keep practicing! 继续练习！";

    const suggestions: string[] = [];
    if (accuracy < 0.7) {
      suggestions.push("Listen to the model again");
      suggestions.push("Try to match each word");
    }
    if (fluency < 0.7) {
      suggestions.push("Speak more smoothly");
      suggestions.push("Reduce pauses");
    }

    return { score: { overall, accuracy, fluency, pronunciation }, feedback, suggestions };
  }

  private evaluateSubstitution(
    exercise: SpeakingExercise,
    userSpeech: string,
  ): { score: SpeakingScore; feedback: string; suggestions: string[] } {
    const user = userSpeech.toLowerCase().trim();

    // Check if user used a substitution word
    const usedSubstitution = exercise.substitutionWords?.some(
      sw => user.includes(sw.toLowerCase())
    ) ?? false;

    const accuracy = usedSubstitution ? 0.8 : 0.4;
    const fluency = this.calculateFluency(userSpeech);
    const pronunciation = this.calculatePronunciation(exercise.keyWords, user);

    const overall = accuracy * 0.4 + fluency * 0.3 + pronunciation * 0.3;

    const feedback = usedSubstitution
      ? "Great substitution! 替换得很好！"
      : "Try to use one of the substitution words";

    const suggestions: string[] = [];
    if (!usedSubstitution && exercise.substitutionWords) {
      suggestions.push(`Try using: ${exercise.substitutionWords.join(", ")}`);
    }

    return { score: { overall, accuracy, fluency, pronunciation }, feedback, suggestions };
  }

  private evaluateFreeResponse(
    exercise: SpeakingExercise,
    userSpeech: string,
  ): { score: SpeakingScore; feedback: string; suggestions: string[] } {
    const user = userSpeech.toLowerCase().trim();

    // Check if user used key words
    const usedKeyWords = exercise.keyWords.filter(
      kw => user.includes(kw.toLowerCase())
    );

    const accuracy = exercise.keyWords.length > 0
      ? usedKeyWords.length / exercise.keyWords.length
      : 0.5;

    const fluency = this.calculateFluency(userSpeech);
    const pronunciation = this.calculatePronunciation(exercise.keyWords, user);

    const overall = accuracy * 0.4 + fluency * 0.3 + pronunciation * 0.3;

    const feedback = overall >= 0.7
      ? "Good response! 回答得很好！"
      : "Try to include more key words";

    const suggestions: string[] = [];
    const missingWords = exercise.keyWords.filter(
      kw => !user.includes(kw.toLowerCase())
    );
    if (missingWords.length > 0) {
      suggestions.push(`Try including: ${missingWords.join(", ")}`);
    }

    return { score: { overall, accuracy, fluency, pronunciation }, feedback, suggestions };
  }

  // ============================================================
  // Scoring Helpers
  // ============================================================

  private calculateAccuracy(model: string, user: string): number {
    if (model === user) return 1;
    if (!model || !user) return 0;

    const distance = this.levenshteinDistance(model, user);
    const maxLength = Math.max(model.length, user.length);
    return maxLength > 0 ? 1 - distance / maxLength : 0;
  }

  private calculateFluency(userSpeech: string): number {
    // Placeholder - would analyze speech rate, pauses, etc.
    const words = userSpeech.split(/\s+/).length;
    if (words >= 5) return 0.8;
    if (words >= 3) return 0.6;
    return 0.4;
  }

  private calculatePronunciation(keyWords: string[], userSpeech: string): number {
    if (keyWords.length === 0) return 0.7;

    const matched = keyWords.filter(kw => 
      userSpeech.toLowerCase().includes(kw.toLowerCase())
    );

    return matched.length / keyWords.length;
  }

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
  // Progress
  // ============================================================

  calculateProgress(results: SpeakingResult[]): SpeakingProgress {
    const totalAttempts = results.length;
    
    const averageScore: SpeakingScore = {
      overall: totalAttempts > 0 ? results.reduce((sum, r) => sum + r.score.overall, 0) / totalAttempts : 0,
      accuracy: totalAttempts > 0 ? results.reduce((sum, r) => sum + r.score.accuracy, 0) / totalAttempts : 0,
      fluency: totalAttempts > 0 ? results.reduce((sum, r) => sum + r.score.fluency, 0) / totalAttempts : 0,
      pronunciation: totalAttempts > 0 ? results.reduce((sum, r) => sum + r.score.pronunciation, 0) / totalAttempts : 0,
    };

    const modeStats = {
      shadowing: this.getModeStats(results.filter(r => r.mode === "shadowing")),
      substitution: this.getModeStats(results.filter(r => r.mode === "substitution")),
      free_response: this.getModeStats(results.filter(r => r.mode === "free_response")),
    };

    return {
      userId: "current",
      totalAttempts,
      averageScore,
      modeStats,
      lastPracticed: Date.now(),
    };
  }

  private getModeStats(results: SpeakingResult[]): { attempts: number; averageScore: number } {
    return {
      attempts: results.length,
      averageScore: results.length > 0
        ? results.reduce((sum, r) => sum + r.score.overall, 0) / results.length
        : 0,
    };
  }
}
