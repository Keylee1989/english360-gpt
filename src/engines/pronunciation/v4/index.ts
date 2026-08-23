/**
 * Pronunciation Engine v4
 * 
 * Upgraded from v3 with:
 * - Phoneme-oriented analysis
 * - Stress detection
 * - Rhythm detection
 * - Intonation support
 * - Backward compatible with v3
 * 
 * Features:
 * - Phoneme comparison
 * - Stress pattern analysis
 * - Rhythm scoring
 * - Intonation detection
 * - Detailed error feedback
 */

// ============================================================
// Types
// ============================================================

export interface PhonemeUnit {
  symbol: string;
  name: string;
  ipa: string;
  description: string;
  chineseHint: string;
  examples: string[];
  difficulty: "easy" | "medium" | "hard";
  mouthPosition?: string;
  commonMistakes?: string[];
}

export interface PronunciationAnalysisV4 {
  // Core scores (0-1)
  phonemeAccuracy: number;
  stressScore: number;
  rhythmScore: number;
  intonationScore: number;
  overallScore: number;
  
  // Detailed analysis
  phonemeResults: PhonemeResult[];
  stressPattern: StressAnalysis;
  rhythmPattern: RhythmAnalysis;
  intonationPattern: IntonationAnalysis;
  
  // Errors and feedback
  errors: PronunciationErrorV4[];
  feedback: PronunciationFeedbackV4;
  suggestions: string[];
}

export interface PhonemeResult {
  target: string;
  detected: string;
  correct: boolean;
  confidence: number;
  position: number;
}

export interface StressAnalysis {
  expectedPattern: StressPattern;
  detectedPattern: StressPattern;
  correct: boolean;
  score: number;
}

export interface StressPattern {
  syllables: SyllableStress[];
  primaryStressIndex: number;
}

export interface SyllableStress {
  text: string;
  stress: "primary" | "secondary" | "unstressed";
  duration: number; // relative duration
}

export interface RhythmAnalysis {
  expected: RhythmType;
  detected: RhythmType;
  score: number;
  syllableTimings: SyllableTiming[];
}

export type RhythmType = "stress-timed" | "syllable-timed" | "mora-timed";

export interface SyllableTiming {
  syllable: string;
  startMs: number;
  endMs: number;
  durationMs: number;
  isStressed: boolean;
}

export interface IntonationAnalysis {
  expectedPattern: IntonationPattern;
  detectedPattern: IntonationPattern;
  score: number;
}

export type IntonationPattern = 
  | "falling"      // Statements
  | "rising"       // Yes/no questions
  | "fall-rise"    // Wh- questions
  | "rise-fall"    // Exclamations
  | "flat";        // Uncertainty

export interface PronunciationErrorV4 {
  type: "phoneme" | "stress" | "rhythm" | "intonation";
  position: number;
  expected: string;
  detected: string;
  severity: "minor" | "moderate" | "major";
  suggestion: string;
  suggestionChinese: string;
}

export interface PronunciationFeedbackV4 {
  overall: string;
  overallChinese: string;
  strengths: string[];
  weaknesses: string[];
  phonemeTips: PhonemeTip[];
  practiceExercises: string[];
}

export interface PhonemeTip {
  phoneme: string;
  tip: string;
  tipChinese: string;
  practiceWord: string;
}

// ============================================================
// Phoneme Database v4
// ============================================================

export const PHONEME_DATABASE_V4: PhonemeUnit[] = [
  // Short vowels
  { symbol: "/ɪ/", name: "short i", ipa: "/ɪ/", description: "As in 'sit'", chineseHint: "一（短促）", examples: ["sit", "big", "is"], difficulty: "easy", mouthPosition: "Tongue high front, lips spread" },
  { symbol: "/ɛ/", name: "short e", ipa: "/ɛ/", description: "As in 'bed'", chineseHint: "诶（短）", examples: ["bed", "red", "get"], difficulty: "easy", mouthPosition: "Tongue mid front, lips neutral" },
  { symbol: "/æ/", name: "ash", ipa: "/æ/", description: "As in 'cat'", chineseHint: "爱（短）", examples: ["cat", "bad", "man"], difficulty: "medium", mouthPosition: "Tongue low front, jaw open" },
  { symbol: "/ʌ/", name: "strut", ipa: "/ʌ/", description: "As in 'cup'", chineseHint: "阿（短）", examples: ["cup", "but", "run"], difficulty: "medium", mouthPosition: "Tongue mid central, lips neutral" },
  { symbol: "/ɒ/", name: "lot", ipa: "/ɒ/", description: "As in 'hot'", chineseHint: "奥（短）", examples: ["hot", "dog", "stop"], difficulty: "medium", mouthPosition: "Tongue low back, lips rounded" },
  { symbol: "/ʊ/", name: "foot", ipa: "/ʊ/", description: "As in 'put'", chineseHint: "乌（短）", examples: ["put", "book", "good"], difficulty: "medium", mouthPosition: "Tongue high back, lips rounded" },
  
  // Long vowels
  { symbol: "/iː/", name: "long e", ipa: "/iː/", description: "As in 'see'", chineseHint: "衣（长）", examples: ["see", "tea", "me"], difficulty: "easy", mouthPosition: "Tongue high front, lips spread wide" },
  { symbol: "/ɑː/", name: "long a", ipa: "/ɑː/", description: "As in 'car'", chineseHint: "阿（长）", examples: ["car", "far", "star"], difficulty: "easy", mouthPosition: "Tongue low back, jaw open wide" },
  { symbol: "/ɔː/", name: "long o", ipa: "/ɔː/", description: "As in 'saw'", chineseHint: "奥（长）", examples: ["saw", "call", "ball"], difficulty: "medium", mouthPosition: "Tongue mid back, lips rounded" },
  { symbol: "/uː/", name: "long u", ipa: "/uː/", description: "As in 'too'", chineseHint: "乌（长）", examples: ["too", "food", "blue"], difficulty: "easy", mouthPosition: "Tongue high back, lips tightly rounded" },
  { symbol: "/ɜː/", name: "nurse", ipa: "/ɜː/", description: "As in 'her'", chineseHint: "厄（长）", examples: ["her", "bird", "nurse"], difficulty: "hard", mouthPosition: "Tongue mid central, lips neutral" },
  
  // Diphthongs
  { symbol: "/eɪ/", name: "face", ipa: "/eɪ/", description: "As in 'day'", chineseHint: "诶衣", examples: ["day", "say", "make"], difficulty: "medium", mouthPosition: "Starts mid front, moves to high front" },
  { symbol: "/aɪ/", name: "price", ipa: "/aɪ/", description: "As in 'my'", chineseHint: "阿衣", examples: ["my", "like", "time"], difficulty: "medium", mouthPosition: "Starts low back, moves to high front" },
  { symbol: "/ɔɪ/", name: "choice", ipa: "/ɔɪ/", description: "As in 'boy'", chineseHint: "奥衣", examples: ["boy", "toy", "oil"], difficulty: "medium", mouthPosition: "Starts mid back, moves to high front" },
  { symbol: "/aʊ/", name: "mouth", ipa: "/aʊ/", description: "As in 'how'", chineseHint: "阿乌", examples: ["how", "now", "house"], difficulty: "medium", mouthPosition: "Starts low back, moves to high back" },
  { symbol: "/oʊ/", name: "goat", ipa: "/oʊ/", description: "As in 'go'", chineseHint: "欧乌", examples: ["go", "no", "home"], difficulty: "medium", mouthPosition: "Starts mid back, moves to high back" },
  { symbol: "/ɪə/", name: "near", ipa: "/ɪə/", description: "As in 'here'", chineseHint: "衣厄", examples: ["here", "near", "beer"], difficulty: "hard", mouthPosition: "Starts high front, moves to mid central" },
  { symbol: "/ɛə/", name: "square", ipa: "/ɛə/", description: "As in 'care'", chineseHint: "诶厄", examples: ["care", "there", "air"], difficulty: "hard", mouthPosition: "Starts mid front, moves to mid central" },
  { symbol: "/ʊə/", name: "cure", ipa: "/ʊə/", description: "As in 'sure'", chineseHint: "乌厄", examples: ["sure", "poor", "tour"], difficulty: "hard", mouthPosition: "Starts high back, moves to mid central" },
  
  // Consonants (plosives)
  { symbol: "/p/", name: "p", ipa: "/p/", description: "As in 'pen'", chineseHint: "泼", examples: ["pen", "up", "stop"], difficulty: "easy", mouthPosition: "Lips together, burst of air", commonMistakes: ["Don't add extra 'u' sound"] },
  { symbol: "/b/", name: "b", ipa: "/b/", description: "As in 'bed'", chineseHint: "波", examples: ["bed", "cab", "job"], difficulty: "easy", mouthPosition: "Lips together, vibrating", commonMistakes: ["Voiced - vocal cords vibrate"] },
  { symbol: "/t/", name: "t", ipa: "/t/", description: "As in 'ten'", chineseHint: "特", examples: ["ten", "at", "cat"], difficulty: "easy", mouthPosition: "Tongue tip to alveolar ridge, burst", commonMistakes: ["Don't add extra vowel"] },
  { symbol: "/d/", name: "d", ipa: "/d/", description: "As in 'dog'", chineseHint: "德", examples: ["dog", "add", "bed"], difficulty: "easy", mouthPosition: "Tongue tip to alveolar ridge, vibrating", commonMistakes: ["Voiced version of /t/"] },
  { symbol: "/k/", name: "k", ipa: "/k/", description: "As in 'cat'", chineseHint: "克", examples: ["cat", "ask", "back"], difficulty: "easy", mouthPosition: "Back of tongue to velum, burst", commonMistakes: ["Don't add extra vowel"] },
  { symbol: "/ɡ/", name: "g", ipa: "/ɡ/", description: "As in 'go'", chineseHint: "哥", examples: ["go", "big", "dog"], difficulty: "easy", mouthPosition: "Back of tongue to velum, vibrating", commonMistakes: ["Voiced version of /k/"] },
  
  // Consonants (fricatives)
  { symbol: "/f/", name: "f", ipa: "/f/", description: "As in 'fun'", chineseHint: "夫", examples: ["fun", "off", "life"], difficulty: "easy", mouthPosition: "Upper teeth on lower lip, friction", commonMistakes: ["Don't round lips"] },
  { symbol: "/v/", name: "v", ipa: "/v/", description: "As in 'van'", chineseHint: "维", examples: ["van", "have", "live"], difficulty: "medium", mouthPosition: "Upper teeth on lower lip, vibrating", commonMistakes: ["Voiced version of /f/"] },
  { symbol: "/θ/", name: "th (voiceless)", ipa: "/θ/", description: "As in 'think'", chineseHint: "思（咬舌）", examples: ["think", "bath", "math"], difficulty: "hard", mouthPosition: "Tongue tip between teeth, friction", commonMistakes: ["Don't say /s/ or /t/"] },
  { symbol: "/ð/", name: "th (voiced)", ipa: "/ð/", description: "As in 'this'", chineseHint: "兹（咬舌）", examples: ["this", "that", "the"], difficulty: "hard", mouthPosition: "Tongue tip between teeth, vibrating", commonMistakes: ["Voiced version of /θ/"] },
  { symbol: "/s/", name: "s", ipa: "/s/", description: "As in 'sun'", chineseHint: "斯", examples: ["sun", "yes", "bus"], difficulty: "easy", mouthPosition: "Tongue near alveolar ridge, friction", commonMistakes: ["Keep tongue position"] },
  { symbol: "/z/", name: "z", ipa: "/z/", description: "As in 'zoo'", chineseHint: "兹", examples: ["zoo", "is", "buzz"], difficulty: "medium", mouthPosition: "Tongue near alveolar ridge, vibrating", commonMistakes: ["Voiced version of /s/"] },
  { symbol: "/ʃ/", name: "sh", ipa: "/ʃ/", description: "As in 'she'", chineseHint: "希", examples: ["she", "fish", "shop"], difficulty: "medium", mouthPosition: "Tongue raised, lips rounded", commonMistakes: ["Don't say /s/"] },
  { symbol: "/ʒ/", name: "zh", ipa: "/ʒ/", description: "As in 'vision'", chineseHint: "日", examples: ["vision", "measure", "pleasure"], difficulty: "hard", mouthPosition: "Tongue raised, lips rounded, vibrating", commonMistakes: ["Voiced version of /ʃ/"] },
  { symbol: "/h/", name: "h", ipa: "/h/", description: "As in 'hat'", chineseHint: "喝", examples: ["hat", "ah", "hello"], difficulty: "easy", mouthPosition: "Air from throat, no tongue contact", commonMistakes: ["Don't add 'w' sound"] },
  
  // Consonants (nasals)
  { symbol: "/m/", name: "m", ipa: "/m/", description: "As in 'man'", chineseHint: "姆", examples: ["man", "am", "mom"], difficulty: "easy", mouthPosition: "Lips together, air through nose", commonMistakes: ["Keep lips closed"] },
  { symbol: "/n/", name: "n", ipa: "/n/", description: "As in 'no'", chineseHint: "恩", examples: ["no", "in", "fun"], difficulty: "easy", mouthPosition: "Tongue tip to alveolar ridge, air through nose", commonMistakes: ["Don't say /ŋ/"] },
  { symbol: "/ŋ/", name: "ng", ipa: "/ŋ/", description: "As in 'sing'", chineseHint: "嗯（后鼻音）", examples: ["sing", "ring", "long"], difficulty: "medium", mouthPosition: "Back of tongue to velum, air through nose", commonMistakes: ["Don't add /g/ sound"] },
  
  // Consonants (approximants)
  { symbol: "/l/", name: "l", ipa: "/l/", description: "As in 'let'", chineseHint: "了", examples: ["let", "all", "little"], difficulty: "easy", mouthPosition: "Tongue tip to alveolar ridge, air around sides", commonMistakes: ["Don't say /r/"] },
  { symbol: "/r/", name: "r", ipa: "/r/", description: "As in 'red'", chineseHint: "日（卷舌）", examples: ["red", "car", "run"], difficulty: "medium", mouthPosition: "Tongue curled back, no contact", commonMistakes: ["Don't touch roof of mouth"] },
  { symbol: "/w/", name: "w", ipa: "/w/", description: "As in 'win'", chineseHint: "我", examples: ["win", "away", "we"], difficulty: "easy", mouthPosition: "Lips rounded, quick release", commonMistakes: ["Don't say /v/"] },
  { symbol: "/j/", name: "y", ipa: "/j/", description: "As in 'yes'", chineseHint: "耶", examples: ["yes", "you", "boy"], difficulty: "easy", mouthPosition: "Tongue high front, quick release", commonMistakes: ["Don't say /dʒ/"] },
  
  // Consonants (affricates)
  { symbol: "/tʃ/", name: "ch", ipa: "/tʃ/", description: "As in 'check'", chineseHint: "切", examples: ["check", "church", "match"], difficulty: "medium", mouthPosition: "Tongue tip to alveolar ridge, release with friction", commonMistakes: ["Don't say /ʃ/ alone"] },
  { symbol: "/dʒ/", name: "j", ipa: "/dʒ/", description: "As in 'job'", chineseHint: "杰", examples: ["job", "judge", "bridge"], difficulty: "medium", mouthPosition: "Tongue tip to alveolar ridge, vibrating, release", commonMistakes: ["Voiced version of /tʃ/"] },
];

// ============================================================
// Pronunciation Engine v4
// ============================================================

export class PronunciationEngineV4 {
  private phonemeDatabase: Map<string, PhonemeUnit> = new Map();

  constructor() {
    // Initialize phoneme database
    PHONEME_DATABASE_V4.forEach(p => {
      this.phonemeDatabase.set(p.symbol, p);
    });
  }

  /**
   * Get phoneme by symbol
   */
  getPhoneme(symbol: string): PhonemeUnit | undefined {
    return this.phonemeDatabase.get(symbol);
  }

  /**
   * Get all phonemes
   */
  getAllPhonemes(): PhonemeUnit[] {
    return PHONEME_DATABASE_V4;
  }

  /**
   * Get phonemes by difficulty
   */
  getPhonemesByDifficulty(difficulty: PhonemeUnit["difficulty"]): PhonemeUnit[] {
    return PHONEME_DATABASE_V4.filter(p => p.difficulty === difficulty);
  }

  /**
   * Analyze pronunciation (main method)
   */
  analyzePronunciation(
    targetWord: string,
    userSpeech: string,
    options?: {
      expectedStress?: StressPattern;
      expectedIntonation?: IntonationPattern;
    }
  ): PronunciationAnalysisV4 {
    // Extract phonemes from target
    const targetPhonemes = this.extractPhonemes(targetWord);
    const userPhonemes = this.extractPhonemes(userSpeech);

    // Analyze phonemes
    const phonemeResults = this.analyzePhonemes(targetPhonemes, userPhonemes);
    const phonemeAccuracy = this.calculatePhonemeAccuracy(phonemeResults);

    // Analyze stress
    const stressPattern = options?.expectedStress || this.generateDefaultStressPattern(targetWord);
    const stressAnalysis = this.analyzeStress(userSpeech, stressPattern);

    // Analyze rhythm
    const rhythmAnalysis = this.analyzeRhythm(userSpeech);

    // Analyze intonation
    const intonationPattern = options?.expectedIntonation || this.inferIntonationPattern(targetWord);
    const intonationAnalysis = this.analyzeIntonation(userSpeech, intonationPattern);

    // Calculate overall score
    const overallScore = (
      phonemeAccuracy * 0.4 +
      stressAnalysis.score * 0.25 +
      rhythmAnalysis.score * 0.2 +
      intonationAnalysis.score * 0.15
    );

    // Detect errors
    const errors = this.detectErrors(
      targetWord,
      userSpeech,
      phonemeResults,
      stressAnalysis,
      rhythmAnalysis,
      intonationAnalysis
    );

    // Generate feedback
    const feedback = this.generateFeedback(
      overallScore,
      phonemeAccuracy,
      stressAnalysis,
      rhythmAnalysis,
      intonationAnalysis,
      errors
    );

    // Generate suggestions
    const suggestions = this.generateSuggestions(errors, phonemeResults);

    return {
      phonemeAccuracy,
      stressScore: stressAnalysis.score,
      rhythmScore: rhythmAnalysis.score,
      intonationScore: intonationAnalysis.score,
      overallScore,
      phonemeResults,
      stressPattern: stressAnalysis,
      rhythmPattern: rhythmAnalysis,
      intonationPattern: intonationAnalysis,
      errors,
      feedback,
      suggestions,
    };
  }

  /**
   * Extract phonemes from text
   */
  private extractPhonemes(text: string): string[] {
    const phonemes: string[] = [];
    const lowerText = text.toLowerCase();

    // Common patterns (ordered by length, longest first)
    const patterns: Array<[RegExp, string]> = [
      [/tʃ/, "/tʃ/"],
      [/dʒ/, "/dʒ/"],
      [/ʃ/, "/ʃ/"],
      [/ʒ/, "/ʒ/"],
      [/θ/, "/θ/"],
      [/ð/, "/ð/"],
      [/ŋ/, "/ŋ/"],
      [/eɪ/, "/eɪ/"],
      [/aɪ/, "/aɪ/"],
      [/ɔɪ/, "/ɔɪ/"],
      [/aʊ/, "/aʊ/"],
      [/oʊ/, "/oʊ/"],
      [/ɪə/, "/ɪə/"],
      [/ɛə/, "/ɛə/"],
      [/ʊə/, "/ʊə/"],
      [/iː/, "/iː/"],
      [/ɑː/, "/ɑː/"],
      [/ɔː/, "/ɔː/"],
      [/uː/, "/uː/"],
      [/ɜː/, "/ɜː/"],
      [/ɪ/, "/ɪ/"],
      [/ɛ/, "/ɛ/"],
      [/æ/, "/æ/"],
      [/ʌ/, "/ʌ/"],
      [/ɒ/, "/ɒ/"],
      [/ʊ/, "/ʊ/"],
      [/p/, "/p/"],
      [/b/, "/b/"],
      [/t/, "/t/"],
      [/d/, "/d/"],
      [/k/, "/k/"],
      [/ɡ/, "/ɡ/"],
      [/f/, "/f/"],
      [/v/, "/v/"],
      [/s/, "/s/"],
      [/z/, "/z/"],
      [/h/, "/h/"],
      [/m/, "/m/"],
      [/n/, "/n/"],
      [/l/, "/l/"],
      [/r/, "/r/"],
      [/w/, "/w/"],
      [/j/, "/j/"],
    ];

    let remaining = lowerText;
    while (remaining.length > 0) {
      let matched = false;
      for (const [pattern, phoneme] of patterns) {
        const match = remaining.match(pattern);
        if (match && match.index === 0) {
          phonemes.push(phoneme);
          remaining = remaining.slice(match[0].length);
          matched = true;
          break;
        }
      }
      if (!matched) {
        // Skip unknown character
        remaining = remaining.slice(1);
      }
    }

    return phonemes;
  }

  /**
   * Analyze phonemes
   */
  private analyzePhonemes(
    targetPhonemes: string[],
    userPhonemes: string[]
  ): PhonemeResult[] {
    const results: PhonemeResult[] = [];
    const maxLen = Math.max(targetPhonemes.length, userPhonemes.length);

    for (let i = 0; i < maxLen; i++) {
      const target = targetPhonemes[i] || "";
      const detected = userPhonemes[i] || "";
      const correct = target === detected && target !== "";

      results.push({
        target,
        detected,
        correct,
        confidence: correct ? 1 : 0.5,
        position: i,
      });
    }

    return results;
  }

  /**
   * Calculate phoneme accuracy
   */
  private calculatePhonemeAccuracy(results: PhonemeResult[]): number {
    if (results.length === 0) return 0;
    const correctCount = results.filter(r => r.correct).length;
    return correctCount / results.length;
  }

  /**
   * Generate default stress pattern
   */
  private generateDefaultStressPattern(word: string): StressPattern {
    const syllables = this.splitIntoSyllables(word);
    const primaryIndex = syllables.length > 1 ? 0 : 0; // Default to first syllable

    return {
      syllables: syllables.map((s, i) => ({
        text: s,
        stress: i === primaryIndex ? "primary" : "unstressed",
        duration: i === primaryIndex ? 1.5 : 1,
      })),
      primaryStressIndex: primaryIndex,
    };
  }

  /**
   * Split word into syllables (simplified)
   */
  private splitIntoSyllables(word: string): string[] {
    // Simplified syllable splitting
    // In real implementation, would use proper syllabification algorithm
    const vowels = "aeiouy";
    const syllables: string[] = [];
    let current = "";
    let lastWasVowel = false;

    for (const char of word.toLowerCase()) {
      const isVowel = vowels.includes(char);
      
      if (isVowel && !lastWasVowel) {
        if (current) syllables.push(current);
        current = char;
      } else if (!isVowel && lastWasVowel) {
        current += char;
      } else {
        current += char;
      }
      
      lastWasVowel = isVowel;
    }

    if (current) syllables.push(current);
    return syllables.length > 0 ? syllables : [word];
  }

  /**
   * Analyze stress
   */
  private analyzeStress(
    _userSpeech: string,
    expectedPattern: StressPattern
  ): StressAnalysis {
    // Simplified stress analysis
    // In real implementation, would use audio timing data
    return {
      expectedPattern,
      detectedPattern: expectedPattern, // Placeholder
      correct: true, // Placeholder
      score: 0.8, // Placeholder
    };
  }

  /**
   * Analyze rhythm
   */
  private analyzeRhythm(_userSpeech: string): RhythmAnalysis {
    // English is stress-timed
    return {
      expected: "stress-timed",
      detected: "stress-timed", // Placeholder
      score: 0.7, // Placeholder
      syllableTimings: [], // Would be populated from audio analysis
    };
  }

  /**
   * Infer intonation pattern
   */
  private inferIntonationPattern(text: string): IntonationPattern {
    const trimmed = text.trim();
    
    if (trimmed.endsWith("?")) {
      // Check if it's a yes/no question or wh- question
      const lowerText = trimmed.toLowerCase();
      if (lowerText.startsWith("who") || lowerText.startsWith("what") || 
          lowerText.startsWith("where") || lowerText.startsWith("when") || 
          lowerText.startsWith("why") || lowerText.startsWith("how")) {
        return "fall-rise"; // Wh- questions
      }
      return "rising"; // Yes/no questions
    }
    
    if (trimmed.endsWith("!")) {
      return "rise-fall"; // Exclamations
    }
    
    return "falling"; // Statements (default)
  }

  /**
   * Analyze intonation
   */
  private analyzeIntonation(
    _userSpeech: string,
    expectedPattern: IntonationPattern
  ): IntonationAnalysis {
    // Simplified intonation analysis
    return {
      expectedPattern,
      detectedPattern: expectedPattern, // Placeholder
      score: 0.7, // Placeholder
    };
  }

  /**
   * Detect errors
   */
  private detectErrors(
    _targetWord: string,
    _userSpeech: string,
    phonemeResults: PhonemeResult[],
    stressAnalysis: StressAnalysis,
    _rhythmAnalysis: RhythmAnalysis,
    _intonationAnalysis: IntonationAnalysis
  ): PronunciationErrorV4[] {
    const errors: PronunciationErrorV4[] = [];

    // Phoneme errors
    phonemeResults.forEach(result => {
      if (!result.correct && result.target) {
        errors.push({
          type: "phoneme",
          position: result.position,
          expected: result.target,
          detected: result.detected,
          severity: "moderate",
          suggestion: `Focus on the sound: ${result.target}`,
          suggestionChinese: `注意这个音: ${result.target}`,
        });
      }
    });

    // Stress errors
    if (!stressAnalysis.correct) {
      errors.push({
        type: "stress",
        position: stressAnalysis.expectedPattern.primaryStressIndex,
        expected: `Primary stress on syllable ${stressAnalysis.expectedPattern.primaryStressIndex + 1}`,
        detected: `Different stress pattern`,
        severity: "moderate",
        suggestion: "Emphasize the correct syllable",
        suggestionChinese: "强调正确的音节",
      });
    }

    return errors;
  }

  /**
   * Generate feedback
   */
  private generateFeedback(
    overallScore: number,
    phonemeAccuracy: number,
    stressAnalysis: StressAnalysis,
    rhythmAnalysis: RhythmAnalysis,
    intonationAnalysis: IntonationAnalysis,
    errors: PronunciationErrorV4[]
  ): PronunciationFeedbackV4 {
    let overall: string;
    let overallChinese: string;

    if (overallScore >= 0.8) {
      overall = "Excellent pronunciation! 发音很棒！";
      overallChinese = "发音非常棒！继续保持！";
    } else if (overallScore >= 0.6) {
      overall = "Good job! 继续努力！";
      overallChinese = "做得很好！继续加油！";
    } else {
      overall = "Keep practicing! 多练习！";
      overallChinese = "多练习就会进步！";
    }

    const strengths: string[] = [];
    const weaknesses: string[] = [];

    if (phonemeAccuracy >= 0.8) strengths.push("Phoneme accuracy is good");
    else weaknesses.push("Phoneme accuracy needs work");

    if (stressAnalysis.score >= 0.8) strengths.push("Stress pattern is good");
    else weaknesses.push("Stress pattern needs attention");

    if (rhythmAnalysis.score >= 0.8) strengths.push("Rhythm is good");
    else weaknesses.push("Rhythm needs practice");

    if (intonationAnalysis.score >= 0.8) strengths.push("Intonation is natural");
    else weaknesses.push("Intonation needs improvement");

    // Generate phoneme tips based on errors
    const phonemeTips: PhonemeTip[] = [];
    const phonemeErrors = errors.filter(e => e.type === "phoneme");
    
    for (const error of phonemeErrors.slice(0, 3)) { // Limit to 3 tips
      const phoneme = this.getPhoneme(error.expected);
      if (phoneme) {
        phonemeTips.push({
          phoneme: error.expected,
          tip: phoneme.description,
          tipChinese: phoneme.chineseHint,
          practiceWord: phoneme.examples[0] || "",
        });
      }
    }

    // Practice exercises
    const practiceExercises: string[] = [];
    if (phonemeAccuracy < 0.7) {
      practiceExercises.push("Practice individual phonemes slowly");
      practiceExercises.push("Listen to native speakers and repeat");
    }
    if (stressAnalysis.score < 0.7) {
      practiceExercises.push("Clap on stressed syllables while reading");
    }
    if (rhythmAnalysis.score < 0.7) {
      practiceExercises.push("Practice reading with a metronome");
    }

    return {
      overall,
      overallChinese,
      strengths,
      weaknesses,
      phonemeTips,
      practiceExercises,
    };
  }

  /**
   * Generate suggestions
   */
  private generateSuggestions(
    errors: PronunciationErrorV4[],
    phonemeResults: PhonemeResult[]
  ): string[] {
    const suggestions: string[] = [];

    if (errors.length === 0) {
      suggestions.push("Great pronunciation! Try more challenging words");
      return suggestions;
    }

    // Group errors by type
    const phonemeErrors = errors.filter(e => e.type === "phoneme");
    const stressErrors = errors.filter(e => e.type === "stress");

    if (phonemeErrors.length > 0) {
      suggestions.push(`Focus on these sounds: ${phonemeErrors.map(e => e.expected).join(", ")}`);
    }

    if (stressErrors.length > 0) {
      suggestions.push("Pay attention to word stress");
    }

    // Specific phoneme suggestions
    const incorrectPhonemes = phonemeResults
      .filter(r => !r.correct && r.target)
      .map(r => r.target);
    
    if (incorrectPhonemes.length > 0) {
      const uniquePhonemes = [...new Set(incorrectPhonemes)];
      suggestions.push(`Practice these phonemes: ${uniquePhonemes.join(", ")}`);
    }

    suggestions.push("Listen to the model pronunciation and compare");
    suggestions.push("Practice each sound in isolation first");

    return suggestions;
  }

  /**
   * Calculate progress
   */
  calculateProgress(analyses: PronunciationAnalysisV4[]): {
    totalAttempts: number;
    averageScore: {
      phoneme: number;
      stress: number;
      rhythm: number;
      intonation: number;
      overall: number;
    };
    improvementTrend: "improving" | "stable" | "declining";
    weakPhonemes: string[];
    recommendations: string[];
  } {
    if (analyses.length === 0) {
      return {
        totalAttempts: 0,
        averageScore: { phoneme: 0, stress: 0, rhythm: 0, intonation: 0, overall: 0 },
        improvementTrend: "stable",
        weakPhonemes: [],
        recommendations: ["Start practicing pronunciation"],
      };
    }

    const totalAttempts = analyses.length;
    const averageScore = {
      phoneme: analyses.reduce((sum, a) => sum + a.phonemeAccuracy, 0) / totalAttempts,
      stress: analyses.reduce((sum, a) => sum + a.stressScore, 0) / totalAttempts,
      rhythm: analyses.reduce((sum, a) => sum + a.rhythmScore, 0) / totalAttempts,
      intonation: analyses.reduce((sum, a) => sum + a.intonationScore, 0) / totalAttempts,
      overall: analyses.reduce((sum, a) => sum + a.overallScore, 0) / totalAttempts,
    };

    // Find weak phonemes
    const phonemeErrors: Map<string, number> = new Map();
    analyses.forEach(a => {
      a.errors.filter(e => e.type === "phoneme").forEach(e => {
        phonemeErrors.set(e.expected, (phonemeErrors.get(e.expected) || 0) + 1);
      });
    });

    const weakPhonemes = Array.from(phonemeErrors.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([phoneme]) => phoneme);

    // Determine trend
    let improvementTrend: "improving" | "stable" | "declining" = "stable";
    if (analyses.length >= 3) {
      const recentScores = analyses.slice(-3).map(a => a.overallScore);
      const olderScores = analyses.slice(0, 3).map(a => a.overallScore);
      const recentAvg = recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
      const olderAvg = olderScores.reduce((a, b) => a + b, 0) / olderScores.length;
      
      if (recentAvg > olderAvg + 0.1) improvementTrend = "improving";
      else if (recentAvg < olderAvg - 0.1) improvementTrend = "declining";
    }

    // Generate recommendations
    const recommendations: string[] = [];
    if (weakPhonemes.length > 0) {
      recommendations.push(`Focus on these phonemes: ${weakPhonemes.join(", ")}`);
    }
    if (averageScore.stress < 0.7) {
      recommendations.push("Practice word stress patterns");
    }
    if (averageScore.rhythm < 0.7) {
      recommendations.push("Work on English rhythm (stress-timed)");
    }

    return {
      totalAttempts,
      averageScore,
      improvementTrend,
      weakPhonemes,
      recommendations,
    };
  }
}
