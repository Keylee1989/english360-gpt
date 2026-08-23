/**
 * Speech Recognition Engine v1
 *
 * Provides pronunciation analysis without direct Web Speech API dependency.
 * Can be connected to Web Speech API or other speech recognition services.
 */

// ============================================================
// Types
// ============================================================

export interface SpeechRecognitionOutput {
  transcript: string;
  confidence: number;
  words: RecognizedWord[];
  duration: number; // ms
}

export interface RecognizedWord {
  word: string;
  confidence: number;
  startMs: number;
  endMs: number;
}

export interface PronunciationAnalysis {
  accuracy: number; // 0-1
  fluency: number; // 0-1
  completeness: number; // 0-1
  overall: number; // 0-1
  errors: PronunciationError[];
  suggestions: string[];
}

export interface PronunciationError {
  type: "mispronunciation" | "omission" | "insertion" | "substitution";
  expected: string;
  detected: string;
  position: number;
  severity: "minor" | "moderate" | "major";
}

export interface SpeechConfig {
  language: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
}

// ============================================================
// Speech Recognition Engine
// ============================================================

export class SpeechRecognitionEngineV1 {
  private config: SpeechConfig = {
    language: "en-US",
    continuous: false,
    interimResults: false,
    maxAlternatives: 1,
  };

  /**
   * Check if speech recognition is supported
   */
  isSupported(): boolean {
    if (typeof window === "undefined") return false;
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  /**
   * Start listening
   */
  async startListening(): Promise<SpeechRecognitionOutput> {
    if (typeof window === "undefined") {
      throw new Error("Speech recognition not available in this environment");
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      throw new Error("Speech recognition not supported in this browser");
    }

    return new Promise((resolve, reject) => {
      const recognition = new SpeechRecognition();
      recognition.lang = this.config.language;
      recognition.continuous = this.config.continuous;
      recognition.interimResults = this.config.interimResults;
      recognition.maxAlternatives = this.config.maxAlternatives;

      const startTime = Date.now();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        const result = event.results[0];
        if (result.isFinal) {
          const transcript = result[0].transcript;
          const confidence = result[0].confidence;

          const words = transcript.split(/\s+/).map((word: string, index: number, arr: string[]) => ({
            word,
            confidence,
            startMs: (index / arr.length) * (Date.now() - startTime),
            endMs: ((index + 1) / arr.length) * (Date.now() - startTime),
          }));

          resolve({
            transcript,
            confidence,
            words,
            duration: Date.now() - startTime,
          });
        }
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onerror = (event: any) => {
        reject(new Error(`Speech recognition error: ${event.error}`));
      };

      recognition.onend = () => {
        // Recognition ended without result
      };

      try {
        recognition.start();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Stop listening
   */
  stopListening(): void {
    // Handled by recognition.onend
  }

  /**
   * Analyze pronunciation
   */
  analyzePronunciation(
    target: string,
    recognized: SpeechRecognitionOutput
  ): PronunciationAnalysis {
    const targetWords = target.toLowerCase().split(/\s+/);
    const recognizedWords = recognized.words.map(w => w.word.toLowerCase());

    // Calculate accuracy
    const accuracy = this.calculateAccuracy(targetWords, recognizedWords);

    // Calculate fluency
    const fluency = this.calculateFluency(recognized);

    // Calculate completeness
    const completeness = this.calculateCompleteness(targetWords, recognizedWords);

    // Overall score
    const overall = (accuracy * 0.5 + fluency * 0.25 + completeness * 0.25);

    // Detect errors
    const errors = this.detectErrors(targetWords, recognizedWords);

    // Generate suggestions
    const suggestions = this.generateSuggestions(accuracy, fluency, completeness, errors);

    return {
      accuracy,
      fluency,
      completeness,
      overall,
      errors,
      suggestions,
    };
  }

  /**
   * Calculate accuracy
   */
  private calculateAccuracy(target: string[], recognized: string[]): number {
    if (target.length === 0) return 0;

    let matches = 0;
    const usedIndices = new Set<number>();

    for (const targetWord of target) {
      for (let i = 0; i < recognized.length; i++) {
        if (!usedIndices.has(i) && recognized[i] === targetWord) {
          matches++;
          usedIndices.add(i);
          break;
        }
      }
    }

    return matches / target.length;
  }

  /**
   * Calculate fluency
   */
  private calculateFluency(recognized: SpeechRecognitionOutput): number {
    if (recognized.duration === 0 || recognized.words.length === 0) return 0;

    // Words per minute
    const wpm = (recognized.words.length / (recognized.duration / 1000)) * 60;

    // Normal speaking rate is 120-150 wpm
    if (wpm >= 100 && wpm <= 180) return 1;
    if (wpm >= 80 && wpm <= 200) return 0.8;
    if (wpm >= 60 && wpm <= 220) return 0.6;
    return 0.4;
  }

  /**
   * Calculate completeness
   */
  private calculateCompleteness(target: string[], recognized: string[]): number {
    if (target.length === 0) return 0;

    const recognizedSet = new Set(recognized);
    const matched = target.filter(w => recognizedSet.has(w));

    return matched.length / target.length;
  }

  /**
   * Detect errors
   */
  private detectErrors(target: string[], recognized: string[]): PronunciationError[] {
    const errors: PronunciationError[] = [];

    // Check for omissions
    for (const word of target) {
      if (!recognized.includes(word)) {
        errors.push({
          type: "omission",
          expected: word,
          detected: "",
          position: target.indexOf(word),
          severity: "moderate",
        });
      }
    }

    // Check for insertions
    for (const word of recognized) {
      if (!target.includes(word)) {
        errors.push({
          type: "insertion",
          expected: "",
          detected: word,
          position: recognized.indexOf(word),
          severity: "minor",
        });
      }
    }

    return errors;
  }

  /**
   * Generate suggestions
   */
  private generateSuggestions(
    accuracy: number,
    fluency: number,
    completeness: number,
    errors: PronunciationError[]
  ): string[] {
    const suggestions: string[] = [];

    if (accuracy < 0.7) {
      suggestions.push("Focus on pronouncing each word clearly");
      suggestions.push("Listen to the model and repeat");
    }

    if (fluency < 0.7) {
      suggestions.push("Try to speak more smoothly");
      suggestions.push("Practice with slower audio first");
    }

    if (completeness < 0.8) {
      suggestions.push("Don't skip any words");
      suggestions.push("Practice the full sentence");
    }

    const omissions = errors.filter(e => e.type === "omission");
    if (omissions.length > 0) {
      suggestions.push(`Pay attention to: ${omissions.map(e => e.expected).join(", ")}`);
    }

    return suggestions;
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<SpeechConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

// ============================================================
// Type declarations for Web Speech API
// ============================================================

interface ISpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onresult: ((event: any) => void) | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => ISpeechRecognition;
    webkitSpeechRecognition: new () => ISpeechRecognition;
  }
}
