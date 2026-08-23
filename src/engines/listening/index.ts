/**
 * Listening Engine v1
 *
 * Manages listening practice:
 * - Audio playback with Web Speech API
 * - Transcript hiding/revealing
 * - Comprehension questions
 * - Shadowing mode
 * - Progress tracking
 */

// ============================================================
// Types
// ============================================================

export interface ListeningExercise {
  id: string;
  text: string;
  chineseText: string;
  speed: "slow" | "normal" | "fast";
  level: "beginner" | "intermediate" | "advanced";
  category: "word" | "sentence" | "dialogue" | "story";
  comprehensionQuestions: ComprehensionQuestion[];
  keywords: string[];
}

export interface ComprehensionQuestion {
  id: string;
  question: string;
  chineseQuestion: string;
  type: "multiple_choice" | "true_false" | "fill_blank";
  correctAnswer: string;
  options?: string[];
}

export interface ListeningResult {
  exerciseId: string;
  userAnswer: string;
  correct: boolean;
  score: number; // 0-1
  timeSpent: number; // seconds
  playbackCount: number;
}

export interface ListeningProgress {
  userId: string;
  totalExercises: number;
  completedExercises: number;
  averageScore: number;
  totalTime: number; // seconds
  lastPracticed: number;
}

// ============================================================
// Listening Engine
// ============================================================

export class ListeningEngine {
  private speechSynthesis: SpeechSynthesis | null = null;
  private isPlaying: boolean = false;

  constructor() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      this.speechSynthesis = window.speechSynthesis;
    }
  }

  // ============================================================
  // Audio Playback
  // ============================================================

  /**
   * Play text using Web Speech API
   */
  async playText(
    text: string,
    speed: "slow" | "normal" | "fast" = "normal",
  ): Promise<void> {
    if (!this.speechSynthesis) {
      console.warn("Speech synthesis not supported");
      return;
    }

    // Stop any current playback
    this.stop();

    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set speed
      switch (speed) {
        case "slow":
          utterance.rate = 0.7;
          break;
        case "fast":
          utterance.rate = 1.3;
          break;
        default:
          utterance.rate = 1.0;
      }

      // Set voice (prefer English)
      const voices = this.speechSynthesis!.getVoices();
      const englishVoice = voices.find(
        (v) => v.lang.startsWith("en") && v.name.includes("Google")
      ) || voices.find((v) => v.lang.startsWith("en"));
      
      if (englishVoice) {
        utterance.voice = englishVoice;
      }

      utterance.onend = () => {
        this.isPlaying = false;
        resolve();
      };

      utterance.onerror = () => {
        this.isPlaying = false;
        resolve();
      };

      this.isPlaying = true;
      this.speechSynthesis!.speak(utterance);
    });
  }

  /**
   * Play word with IPA pronunciation
   */
  async playWord(word: string): Promise<void> {
    await this.playText(word, "slow");
  }

  /**
   * Play sentence at normal speed
   */
  async playSentence(sentence: string): Promise<void> {
    await this.playText(sentence, "normal");
  }

  /**
   * Play sentence slowly for beginners
   */
  async playSentenceSlow(sentence: string): Promise<void> {
    await this.playText(sentence, "slow");
  }

  /**
   * Stop current playback
   */
  stop(): void {
    if (this.speechSynthesis) {
      this.speechSynthesis.cancel();
    }
    this.isPlaying = false;
  }

  /**
   * Check if currently playing
   */
  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  // ============================================================
  // Exercise Generation
  // ============================================================

  /**
   * Generate listening exercises for a lesson
   */
  generateExercises(
    words: { word: string; chineseMeaning: string; ipa: string }[],
    sentences: { english: string; chinese: string }[],
  ): ListeningExercise[] {
    const exercises: ListeningExercise[] = [];

    // Generate word listening exercises
    words.forEach((word, index) => {
      exercises.push({
        id: `listen_word_${index}`,
        text: word.word,
        chineseText: word.chineseMeaning,
        speed: "slow",
        level: "beginner",
        category: "word",
        comprehensionQuestions: [
          {
            id: `q_word_${index}_1`,
            question: `What word did you hear?`,
            chineseQuestion: `你听到了哪个单词？`,
            type: "multiple_choice",
            correctAnswer: word.word,
            options: this.generateOptions(word.word, words.map((w) => w.word)),
          },
        ],
        keywords: [word.word],
      });
    });

    // Generate sentence listening exercises
    sentences.forEach((sentence, index) => {
      exercises.push({
        id: `listen_sentence_${index}`,
        text: sentence.english,
        chineseText: sentence.chinese,
        speed: "normal",
        level: "beginner",
        category: "sentence",
        comprehensionQuestions: [
          {
            id: `q_sentence_${index}_1`,
            question: `What does this sentence mean?`,
            chineseQuestion: `这句话是什么意思？`,
            type: "multiple_choice",
            correctAnswer: sentence.chinese,
            options: [
              sentence.chinese,
              "错误选项1",
              "错误选项2",
              "错误选项3",
            ],
          },
        ],
        keywords: sentence.english.split(" ").slice(0, 3),
      });
    });

    return exercises;
  }

  /**
   * Generate options for multiple choice
   */
  private generateOptions(correct: string, allWords: string[]): string[] {
    const options = [correct];
    const otherWords = allWords.filter((w) => w !== correct);
    
    // Add 3 random wrong options
    for (let i = 0; i < 3 && i < otherWords.length; i++) {
      const randomIndex = Math.floor(Math.random() * otherWords.length);
      const word = otherWords.splice(randomIndex, 1)[0];
      if (word) options.push(word);
    }

    // Shuffle options
    return options.sort(() => Math.random() - 0.5);
  }

  // ============================================================
  // Exercise Evaluation
  // ============================================================

  /**
   * Evaluate a listening comprehension answer
   */
  evaluateAnswer(
    exercise: ListeningExercise,
    questionId: string,
    userAnswer: string,
  ): ListeningResult {
    const question = exercise.comprehensionQuestions.find(
      (q) => q.id === questionId,
    );

    if (!question) {
      return {
        exerciseId: exercise.id,
        userAnswer,
        correct: false,
        score: 0,
        timeSpent: 0,
        playbackCount: 0,
      };
    }

    const normalizedUser = userAnswer.trim().toLowerCase();
    const normalizedCorrect = question.correctAnswer.toLowerCase();

    const correct = normalizedUser === normalizedCorrect;
    const score = correct ? 1 : this.calculateSimilarity(normalizedUser, normalizedCorrect);

    return {
      exerciseId: exercise.id,
      userAnswer,
      correct,
      score,
      timeSpent: 0,
      playbackCount: 0,
    };
  }

  /**
   * Calculate string similarity
   */
  private calculateSimilarity(a: string, b: string): number {
    if (a === b) return 1;
    if (a.length === 0 || b.length === 0) return 0;

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

    const distance = matrix[b.length][a.length];
    const maxLength = Math.max(a.length, b.length);
    return 1 - distance / maxLength;
  }

  // ============================================================
  // Progress Tracking
  // ============================================================

  /**
   * Calculate listening progress
   */
  calculateProgress(results: ListeningResult[]): ListeningProgress {
    const totalExercises = results.length;
    const completedExercises = results.filter((r) => r.correct).length;
    const averageScore =
      totalExercises > 0
        ? results.reduce((sum, r) => sum + r.score, 0) / totalExercises
        : 0;
    const totalTime = results.reduce((sum, r) => sum + r.timeSpent, 0);

    return {
      userId: "current",
      totalExercises,
      completedExercises,
      averageScore,
      totalTime,
      lastPracticed: Date.now(),
    };
  }
}
