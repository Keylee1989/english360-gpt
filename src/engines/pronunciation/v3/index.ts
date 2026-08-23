/**
 * Pronunciation Engine v3
 * 
 * Features:
 * - Phoneme level analysis
 * - Pronunciation error detection
 * - Detailed feedback
 * - Scoring: accuracy, fluency, pronunciation
 */

// ============================================================
// Types
// ============================================================

export interface Phoneme {
  symbol: string;
  name: string;
  description: string;
  chineseHint: string;
  examples: string[];
  difficulty: "easy" | "medium" | "hard";
}

export interface PronunciationAttempt {
  id: string;
  targetWord: string;
  targetPhonemes: string[];
  userSpeech: string;
  timestamp: number;
}

export interface PronunciationResult {
  attemptId: string;
  targetWord: string;
  userSpeech: string;
  score: PronunciationScore;
  phonemeAnalysis: PhonemeAnalysis[];
  errors: PronunciationError[];
  feedback: PronunciationFeedback;
  suggestions: string[];
}

export interface PronunciationScore {
  overall: number;      // 0-1
  accuracy: number;     // 0-1
  fluency: number;      // 0-1
  pronunciation: number; // 0-1
}

export interface PhonemeAnalysis {
  phoneme: string;
  expected: string;
  detected: string;
  correct: boolean;
  confidence: number;
}

export interface PronunciationError {
  type: "substitution" | "deletion" | "insertion" | "distortion";
  position: number;
  expected: string;
  detected: string;
  severity: "minor" | "moderate" | "major";
}

export interface PronunciationFeedback {
  overall: string;
  strengths: string[];
  weaknesses: string[];
  tips: string[];
}

export interface PronunciationProgress {
  userId: string;
  totalAttempts: number;
  averageScore: PronunciationScore;
  phonemeAccuracy: Map<string, number>;
  commonErrors: PronunciationError[];
  lastPracticed: number;
}

// ============================================================
// Phoneme Database
// ============================================================

export const PHONEME_DATABASE: Phoneme[] = [
  // Vowels
  { symbol: "/iː/", name: "long e", description: "As in 'see'", chineseHint: "衣", examples: ["see", "tea", "me"], difficulty: "easy" },
  { symbol: "/ɪ/", name: "short i", description: "As in 'sit'", chineseHint: "一（短）", examples: ["sit", "big", "is"], difficulty: "easy" },
  { symbol: "/eɪ/", name: "long a", description: "As in 'day'", chineseHint: "诶", examples: ["day", "say", "make"], difficulty: "medium" },
  { symbol: "/ɛ/", name: "short e", description: "As in 'bed'", chineseHint: "诶（短）", examples: ["bed", "red", "get"], difficulty: "easy" },
  { symbol: "/æ/", name: "ash", description: "As in 'cat'", chineseHint: "爱（短）", examples: ["cat", "bad", "man"], difficulty: "medium" },
  { symbol: "/ɑː/", name: "open a", description: "As in 'car'", chineseHint: "阿", examples: ["car", "far", "star"], difficulty: "easy" },
  { symbol: "/ɔː/", name: "open o", description: "As in 'saw'", chineseHint: "奥", examples: ["saw", "call", "ball"], difficulty: "medium" },
  { symbol: "/oʊ/", name: "long o", description: "As in 'go'", chineseHint: "欧", examples: ["go", "no", "home"], difficulty: "medium" },
  { symbol: "/ʊ/", name: "short u", description: "As in 'put'", chineseHint: "乌（短）", examples: ["put", "book", "good"], difficulty: "medium" },
  { symbol: "/uː/", name: "long u", description: "As in 'too'", chineseHint: "乌", examples: ["too", "food", "blue"], difficulty: "easy" },
  { symbol: "/ʌ/", name: "strut", description: "As in 'cup'", chineseHint: "阿（短）", examples: ["cup", "but", "run"], difficulty: "medium" },
  { symbol: "/ɜːr/", name: "nurse", description: "As in 'her'", chineseHint: "厄", examples: ["her", "bird", "nurse"], difficulty: "hard" },
  { symbol: "/ə/", name: "schwa", description: "As in 'about'", chineseHint: "呃", examples: ["about", "sofa", "banana"], difficulty: "hard" },
  
  // Consonants
  { symbol: "/p/", name: "p", description: "As in 'pen'", chineseHint: "泼", examples: ["pen", "up", "stop"], difficulty: "easy" },
  { symbol: "/b/", name: "b", description: "As in 'bed'", chineseHint: "波", examples: ["bed", "cab", "job"], difficulty: "easy" },
  { symbol: "/t/", name: "t", description: "As in 'ten'", chineseHint: "特", examples: ["ten", "at", "cat"], difficulty: "easy" },
  { symbol: "/d/", name: "d", description: "As in 'dog'", chineseHint: "德", examples: ["dog", "add", "bed"], difficulty: "easy" },
  { symbol: "/k/", name: "k", description: "As in 'cat'", chineseHint: "克", examples: ["cat", "ask", "back"], difficulty: "easy" },
  { symbol: "/ɡ/", name: "g", description: "As in 'go'", chineseHint: "哥", examples: ["go", "big", "dog"], difficulty: "easy" },
  { symbol: "/f/", name: "f", description: "As in 'fun'", chineseHint: "夫", examples: ["fun", "off", "life"], difficulty: "easy" },
  { symbol: "/v/", name: "v", description: "As in 'van'", chineseHint: "维", examples: ["van", "have", "live"], difficulty: "medium" },
  { symbol: "/θ/", name: "th (voiceless)", description: "As in 'think'", chineseHint: "思（咬舌）", examples: ["think", "bath", "math"], difficulty: "hard" },
  { symbol: "/ð/", name: "th (voiced)", description: "As in 'this'", chineseHint: "兹（咬舌）", examples: ["this", "that", "the"], difficulty: "hard" },
  { symbol: "/s/", name: "s", description: "As in 'sun'", chineseHint: "斯", examples: ["sun", "yes", "bus"], difficulty: "easy" },
  { symbol: "/z/", name: "z", description: "As in 'zoo'", chineseHint: "兹", examples: ["zoo", "is", "buzz"], difficulty: "medium" },
  { symbol: "/ʃ/", name: "sh", description: "As in 'she'", chineseHint: "希", examples: ["she", "fish", "shop"], difficulty: "medium" },
  { symbol: "/ʒ/", name: "zh", description: "As in 'vision'", chineseHint: "日", examples: ["vision", "measure", "pleasure"], difficulty: "hard" },
  { symbol: "/h/", name: "h", description: "As in 'hat'", chineseHint: "喝", examples: ["hat", "ah", "hello"], difficulty: "easy" },
  { symbol: "/m/", name: "m", description: "As in 'man'", chineseHint: "姆", examples: ["man", "am", "mom"], difficulty: "easy" },
  { symbol: "/n/", name: "n", description: "As in 'no'", chineseHint: "恩", examples: ["no", "in", "fun"], difficulty: "easy" },
  { symbol: "/ŋ/", name: "ng", description: "As in 'sing'", chineseHint: "嗯（后鼻音）", examples: ["sing", "ring", "long"], difficulty: "medium" },
  { symbol: "/l/", name: "l", description: "As in 'let'", chineseHint: "了", examples: ["let", "all", "little"], difficulty: "easy" },
  { symbol: "/r/", name: "r", description: "As in 'red'", chineseHint: "日（卷舌）", examples: ["red", "car", "run"], difficulty: "medium" },
  { symbol: "/w/", name: "w", description: "As in 'win'", chineseHint: "我", examples: ["win", "away", "we"], difficulty: "easy" },
  { symbol: "/j/", name: "y", description: "As in 'yes'", chineseHint: "耶", examples: ["yes", "you", "boy"], difficulty: "easy" },
  { symbol: "/tʃ/", name: "ch", description: "As in 'check'", chineseHint: "切", examples: ["check", "church", "match"], difficulty: "medium" },
  { symbol: "/dʒ/", name: "j", description: "As in 'job'", chineseHint: "杰", examples: ["job", "judge", "bridge"], difficulty: "medium" },
];

// ============================================================
// Pronunciation Engine v3
// ============================================================

export class PronunciationEngineV3 {
  private phonemeDatabase: Map<string, Phoneme> = new Map();

  constructor() {
    // Initialize phoneme database
    PHONEME_DATABASE.forEach(p => {
      this.phonemeDatabase.set(p.symbol, p);
    });
  }

  /**
   * Get phoneme by symbol
   */
  getPhoneme(symbol: string): Phoneme | undefined {
    return this.phonemeDatabase.get(symbol);
  }

  /**
   * Get all phonemes
   */
  getAllPhonemes(): Phoneme[] {
    return PHONEME_DATABASE;
  }

  /**
   * Get phonemes by difficulty
   */
  getPhonemesByDifficulty(difficulty: Phoneme["difficulty"]): Phoneme[] {
    return PHONEME_DATABASE.filter(p => p.difficulty === difficulty);
  }

  /**
   * Analyze pronunciation
   */
  analyzePronunciation(
    targetWord: string,
    userSpeech: string,
  ): PronunciationResult {
    const attemptId = `attempt_${Date.now()}`;
    const targetPhonemes = this.extractPhonemes(targetWord);
    
    // Compare speech
    const phonemeAnalysis = this.analyzePhonemes(targetPhonemes, userSpeech);
    const errors = this.detectErrors(targetWord, userSpeech, phonemeAnalysis);
    const score = this.calculateScore(targetWord, userSpeech, phonemeAnalysis, errors);
    const feedback = this.generateFeedback(score, errors, targetWord);
    const suggestions = this.generateSuggestions(errors, targetWord);

    return {
      attemptId,
      targetWord,
      userSpeech,
      score,
      phonemeAnalysis,
      errors,
      feedback,
      suggestions,
    };
  }

  /**
   * Extract phonemes from word (simplified)
   */
  private extractPhonemes(word: string): string[] {
    // Simplified phoneme extraction
    // In real implementation, would use CMU dictionary or similar
    const phonemes: string[] = [];
    
    // Basic mapping for common patterns
    const patterns: Record<string, string> = {
      "th": "/θ/",
      "sh": "/ʃ/",
      "ch": "/tʃ/",
      "ph": "/f/",
      "ck": "/k/",
      "ng": "/ŋ/",
    };

    let i = 0;
    while (i < word.length) {
      let found = false;
      
      // Check for two-letter patterns first
      if (i < word.length - 1) {
        const twoLetter = word.slice(i, i + 2).toLowerCase();
        if (patterns[twoLetter]) {
          phonemes.push(patterns[twoLetter]);
          i += 2;
          found = true;
        }
      }
      
      if (!found) {
        const letter = word[i].toLowerCase();
        // Simple single letter to phoneme mapping
        const singlePhonemes: Record<string, string> = {
          "a": "/æ/", "b": "/b/", "c": "/k/", "d": "/d/", "e": "/ɛ/",
          "f": "/f/", "g": "/ɡ/", "h": "/h/", "i": "/ɪ/", "j": "/dʒ/",
          "k": "/k/", "l": "/l/", "m": "/m/", "n": "/n/", "o": "/ɒ/",
          "p": "/p/", "q": "/k/", "r": "/r/", "s": "/s/", "t": "/t/",
          "u": "/ʌ/", "v": "/v/", "w": "/w/", "x": "/ks/", "y": "/j/",
          "z": "/z/",
        };
        
        phonemes.push(singlePhonemes[letter] || `/${letter}/`);
        i++;
      }
    }
    
    return phonemes;
  }

  /**
   * Analyze phonemes
   */
  private analyzePhonemes(
    targetPhonemes: string[],
    _userSpeech: string,
  ): PhonemeAnalysis[] {
    // Simplified analysis - would use speech recognition in real implementation
    return targetPhonemes.map(expected => ({
      phoneme: expected,
      expected,
      detected: expected, // Placeholder
      correct: true, // Placeholder
      confidence: 0.8, // Placeholder
    }));
  }

  /**
   * Detect pronunciation errors
   */
  private detectErrors(
    targetWord: string,
    userSpeech: string,
    _phonemeAnalysis: PhonemeAnalysis[],
  ): PronunciationError[] {
    const errors: PronunciationError[] = [];
    const target = targetWord.toLowerCase();
    const user = userSpeech.toLowerCase().trim();

    // Simple string comparison for error detection
    if (target !== user) {
      // Find differences
      const maxLen = Math.max(target.length, user.length);
      for (let i = 0; i < maxLen; i++) {
        if (target[i] !== user[i]) {
          if (!target[i]) {
            errors.push({
              type: "insertion",
              position: i,
              expected: "",
              detected: user[i] || "",
              severity: "minor",
            });
          } else if (!user[i]) {
            errors.push({
              type: "deletion",
              position: i,
              expected: target[i],
              detected: "",
              severity: "moderate",
            });
          } else {
            errors.push({
              type: "substitution",
              position: i,
              expected: target[i],
              detected: user[i],
              severity: "moderate",
            });
          }
        }
      }
    }

    return errors;
  }

  /**
   * Calculate score
   */
  private calculateScore(
    targetWord: string,
    userSpeech: string,
    _phonemeAnalysis: PhonemeAnalysis[],
    errors: PronunciationError[],
  ): PronunciationScore {
    const target = targetWord.toLowerCase();
    const user = userSpeech.toLowerCase().trim();

    // Accuracy based on string similarity
    const accuracy = this.calculateSimilarity(target, user);

    // Fluency (simplified - would use timing data)
    const fluency = 0.7; // Placeholder

    // Pronunciation based on error count
    const pronunciation = Math.max(0, 1 - errors.length * 0.1);

    const overall = accuracy * 0.4 + fluency * 0.3 + pronunciation * 0.3;

    return { overall, accuracy, fluency, pronunciation };
  }

  /**
   * Calculate string similarity
   */
  private calculateSimilarity(a: string, b: string): number {
    if (a === b) return 1;
    if (!a || !b) return 0;

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

  /**
   * Generate feedback
   */
  private generateFeedback(
    score: PronunciationScore,
    errors: PronunciationError[],
    targetWord: string,
  ): PronunciationFeedback {
    const overall = score.overall >= 0.8
      ? "Excellent pronunciation! 发音很棒！"
      : score.overall >= 0.6
      ? "Good job! 继续努力！"
      : "Keep practicing! 多练习！";

    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const tips: string[] = [];

    if (score.accuracy >= 0.8) {
      strengths.push("Word recognition is good");
    } else {
      weaknesses.push("Word accuracy needs improvement");
    }

    if (errors.length === 0) {
      strengths.push("No pronunciation errors detected");
    } else {
      weaknesses.push(`${errors.length} pronunciation errors detected`);
      tips.push(`Focus on the sound: ${targetWord}`);
    }

    return { overall, strengths, weaknesses, tips };
  }

  /**
   * Generate suggestions
   */
  private generateSuggestions(
    errors: PronunciationError[],
    targetWord: string,
  ): string[] {
    const suggestions: string[] = [];

    if (errors.length === 0) {
      suggestions.push("Great pronunciation! Try a harder word.");
      return suggestions;
    }

    // Group errors by type
    const substitutionErrors = errors.filter(e => e.type === "substitution");
    const deletionErrors = errors.filter(e => e.type === "deletion");

    if (substitutionErrors.length > 0) {
      suggestions.push(`Focus on the sound differences in "${targetWord}"`);
    }

    if (deletionErrors.length > 0) {
      suggestions.push(`Don't skip any sounds in "${targetWord}"`);
    }

    suggestions.push("Listen to the model and repeat slowly");
    suggestions.push("Practice each sound separately");

    return suggestions;
  }

  /**
   * Calculate progress
   */
  calculateProgress(results: PronunciationResult[]): PronunciationProgress {
    const totalAttempts = results.length;
    
    const averageScore: PronunciationScore = {
      overall: totalAttempts > 0 ? results.reduce((sum, r) => sum + r.score.overall, 0) / totalAttempts : 0,
      accuracy: totalAttempts > 0 ? results.reduce((sum, r) => sum + r.score.accuracy, 0) / totalAttempts : 0,
      fluency: totalAttempts > 0 ? results.reduce((sum, r) => sum + r.score.fluency, 0) / totalAttempts : 0,
      pronunciation: totalAttempts > 0 ? results.reduce((sum, r) => sum + r.score.pronunciation, 0) / totalAttempts : 0,
    };

    const phonemeAccuracy = new Map<string, number>();
    const commonErrors: PronunciationError[] = [];

    // Collect all errors
    results.forEach(r => {
      r.errors.forEach(e => {
        commonErrors.push(e);
      });
    });

    return {
      userId: "current",
      totalAttempts,
      averageScore,
      phonemeAccuracy,
      commonErrors,
      lastPracticed: Date.now(),
    };
  }
}
