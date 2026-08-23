/**
 * Shadowing Practice Engine v1
 * 
 * Purpose: Train listen → imitate → compare
 * 
 * Practice Modes:
 * - Listen Only: Just listen to audio
 * - Listen + Repeat: Listen, then repeat
 * - Shadow Simultaneously: Speak along with audio
 * - Free Repeat: Repeat as many times as needed
 * 
 * Features:
 * - Timing comparison
 * - Fluency measurement
 * - Accuracy scoring
 * - Mistake detection
 * - Improvement suggestions
 */

// ============================================================
// Types
// ============================================================

export type ShadowingMode = 
  | "listen_only"        // Just listen
  | "listen_repeat"      // Listen, then repeat
  | "shadow_simultaneous" // Speak along
  | "free_repeat";       // Repeat as needed

export interface ShadowingExercise {
  id: string;
  text: string;
  translationChinese: string;
  audioUrl?: string;
  audioDurationMs: number;
  mode: ShadowingMode;
  targetPhonemes?: string[];
  shadowingPoints?: ShadowingPoint[];
}

export interface ShadowingPoint {
  startMs: number;
  endMs: number;
  text: string;
  stress?: "primary" | "secondary" | "none";
}

export interface ShadowingAttempt {
  exerciseId: string;
  mode: ShadowingMode;
  userSpeech: string;
  userAudioBlob?: Blob;
  startTimeMs: number;
  endTimeMs: number;
  timestamp: number;
}

export interface ShadowingResult {
  attemptId: string;
  exerciseId: string;
  mode: ShadowingMode;
  
  // Timing
  audioDurationMs: number;
  userDurationMs: number;
  timingDifferenceMs: number;
  
  // Scores (0-1)
  accuracy: number;
  timing: number;
  fluency: number;
  overall: number;
  
  // Analysis
  mistakes: ShadowingMistake[];
  suggestions: string[];
  
  // Detailed feedback
  feedback: ShadowingFeedback;
}

export interface ShadowingMistake {
  type: "timing" | "pronunciation" | "stress" | "missing" | "extra";
  position: number;
  expected: string;
  detected: string;
  severity: "minor" | "moderate" | "major";
  suggestion?: string;
}

export interface ShadowingFeedback {
  overall: string;
  strengths: string[];
  weaknesses: string[];
  nextSteps: string[];
}

export interface ShadowingProgress {
  totalAttempts: number;
  averageScore: {
    accuracy: number;
    timing: number;
    fluency: number;
    overall: number;
  };
  improvementTrend: "improving" | "stable" | "declining";
  commonMistakes: ShadowingMistake[];
  recommendedPractice: string[];
}

// ============================================================
// Shadowing Practice Engine
// ============================================================

export class ShadowingEngineV1 {
  private exercises: Map<string, ShadowingExercise> = new Map();
  private attempts: ShadowingAttempt[] = [];

  /**
   * Create shadowing exercise
   */
  createExercise(
    text: string,
    translationChinese: string,
    audioDurationMs: number,
    mode: ShadowingMode = "listen_repeat",
    options?: {
      targetPhonemes?: string[];
      shadowingPoints?: ShadowingPoint[];
    }
  ): ShadowingExercise {
    const id = `shadow_${Date.now()}_${text.slice(0, 20).replace(/\s/g, "_")}`;
    
    const exercise: ShadowingExercise = {
      id,
      text,
      translationChinese,
      audioDurationMs,
      mode,
      targetPhonemes: options?.targetPhonemes,
      shadowingPoints: options?.shadowingPoints,
    };

    this.exercises.set(id, exercise);
    return exercise;
  }

  /**
   * Get exercise by ID
   */
  getExercise(id: string): ShadowingExercise | undefined {
    return this.exercises.get(id);
  }

  /**
   * Record attempt
   */
  recordAttempt(
    exerciseId: string,
    mode: ShadowingMode,
    userSpeech: string,
    startTimeMs: number,
    endTimeMs: number,
    userAudioBlob?: Blob
  ): ShadowingAttempt {
    const attempt: ShadowingAttempt = {
      exerciseId,
      mode,
      userSpeech,
      userAudioBlob,
      startTimeMs,
      endTimeMs,
      timestamp: Date.now(),
    };

    this.attempts.push(attempt);
    return attempt;
  }

  /**
   * Analyze shadowing attempt
   */
  analyzeAttempt(
    attempt: ShadowingAttempt,
    exercise: ShadowingExercise
  ): ShadowingResult {
    const attemptId = `result_${Date.now()}`;
    
    // Calculate timing
    const audioDurationMs = exercise.audioDurationMs;
    const userDurationMs = attempt.endTimeMs - attempt.startTimeMs;
    const timingDifferenceMs = Math.abs(userDurationMs - audioDurationMs);
    
    // Calculate scores
    const accuracy = this.calculateAccuracy(exercise.text, attempt.userSpeech);
    const timing = this.calculateTimingScore(audioDurationMs, userDurationMs);
    const fluency = this.calculateFluencyScore(attempt);
    const overall = (accuracy * 0.4) + (timing * 0.3) + (fluency * 0.3);
    
    // Detect mistakes
    const mistakes = this.detectMistakes(exercise, attempt);
    
    // Generate suggestions
    const suggestions = this.generateSuggestions(mistakes, accuracy, timing, fluency);
    
    // Generate feedback
    const feedback = this.generateFeedback(accuracy, timing, fluency, overall, mistakes);

    return {
      attemptId,
      exerciseId: exercise.id,
      mode: attempt.mode,
      audioDurationMs,
      userDurationMs,
      timingDifferenceMs,
      accuracy,
      timing,
      fluency,
      overall,
      mistakes,
      suggestions,
      feedback,
    };
  }

  /**
   * Calculate text accuracy
   */
  private calculateAccuracy(target: string, user: string): number {
    const targetWords = target.toLowerCase().split(/\s+/);
    const userWords = user.toLowerCase().split(/\s+/);
    
    if (targetWords.length === 0) return 0;
    
    let matches = 0;
    const usedIndices = new Set<number>();
    
    for (const targetWord of targetWords) {
      for (let i = 0; i < userWords.length; i++) {
        if (!usedIndices.has(i) && userWords[i] === targetWord) {
          matches++;
          usedIndices.add(i);
          break;
        }
      }
    }
    
    return matches / targetWords.length;
  }

  /**
   * Calculate timing score
   */
  private calculateTimingScore(audioDurationMs: number, userDurationMs: number): number {
    if (audioDurationMs === 0) return 0;
    
    const difference = Math.abs(userDurationMs - audioDurationMs);
    const percentageDiff = difference / audioDurationMs;
    
    // Perfect timing = 1, worse as difference increases
    if (percentageDiff <= 0.1) return 1; // Within 10%
    if (percentageDiff <= 0.2) return 0.8; // Within 20%
    if (percentageDiff <= 0.3) return 0.6; // Within 30%
    if (percentageDiff <= 0.5) return 0.4; // Within 50%
    return 0.2; // More than 50% off
  }

  /**
   * Calculate fluency score
   */
  private calculateFluencyScore(attempt: ShadowingAttempt): number {
    // Simplified fluency calculation
    // In real implementation, would analyze speech patterns, pauses, etc.
    
    const durationMs = attempt.endTimeMs - attempt.startTimeMs;
    const wordCount = attempt.userSpeech.split(/\s+/).length;
    
    if (durationMs === 0 || wordCount === 0) return 0;
    
    // Words per minute
    const wpm = (wordCount / (durationMs / 1000)) * 60;
    
    // Normal speaking rate is 120-150 wpm
    if (wpm >= 100 && wpm <= 180) return 1;
    if (wpm >= 80 && wpm <= 200) return 0.8;
    if (wpm >= 60 && wpm <= 220) return 0.6;
    return 0.4;
  }

  /**
   * Detect mistakes
   */
  private detectMistakes(
    exercise: ShadowingExercise,
    attempt: ShadowingAttempt
  ): ShadowingMistake[] {
    const mistakes: ShadowingMistake[] = [];
    
    // Simple word comparison
    const targetWords = exercise.text.toLowerCase().split(/\s+/);
    const userWords = attempt.userSpeech.toLowerCase().split(/\s+/);
    
    // Check for missing words
    for (const word of targetWords) {
      if (!userWords.includes(word)) {
        mistakes.push({
          type: "missing",
          position: targetWords.indexOf(word),
          expected: word,
          detected: "",
          severity: "moderate",
          suggestion: `Try to include the word "${word}"`,
        });
      }
    }
    
    // Check for extra words
    for (const word of userWords) {
      if (!targetWords.includes(word)) {
        mistakes.push({
          type: "extra",
          position: userWords.indexOf(word),
          expected: "",
          detected: word,
          severity: "minor",
          suggestion: `The word "${word}" is extra`,
        });
      }
    }
    
    return mistakes;
  }

  /**
   * Generate suggestions
   */
  private generateSuggestions(
    mistakes: ShadowingMistake[],
    accuracy: number,
    timing: number,
    fluency: number
  ): string[] {
    const suggestions: string[] = [];
    
    if (accuracy < 0.7) {
      suggestions.push("Focus on pronouncing each word clearly");
      suggestions.push("Listen to the audio multiple times before repeating");
    }
    
    if (timing < 0.6) {
      suggestions.push("Try to match the speed of the audio");
      if (timing < 0.4) {
        suggestions.push("Practice with slower audio first");
      }
    }
    
    if (fluency < 0.7) {
      suggestions.push("Try to speak more smoothly without long pauses");
      suggestions.push("Practice the sentence in smaller chunks first");
    }
    
    // Specific mistake suggestions
    const missingWords = mistakes.filter(m => m.type === "missing");
    if (missingWords.length > 0) {
      suggestions.push(`Pay attention to these words: ${missingWords.map(m => m.expected).join(", ")}`);
    }
    
    if (suggestions.length === 0) {
      suggestions.push("Great job! Try a more challenging exercise");
    }
    
    return suggestions;
  }

  /**
   * Generate feedback
   */
  private generateFeedback(
    accuracy: number,
    timing: number,
    fluency: number,
    overall: number,
    mistakes: ShadowingMistake[]
  ): ShadowingFeedback {
    let overallText: string;
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const nextSteps: string[] = [];
    
    if (overall >= 0.8) {
      overallText = "Excellent shadowing! 发音很棒！";
      strengths.push("Good overall accuracy");
    } else if (overall >= 0.6) {
      overallText = "Good progress! 继续加油！";
      strengths.push("Decent pronunciation");
    } else {
      overallText = "Keep practicing! 多练习！";
      weaknesses.push("Needs more practice");
    }
    
    if (accuracy >= 0.8) strengths.push("Word accuracy is good");
    else weaknesses.push("Word accuracy needs improvement");
    
    if (timing >= 0.8) strengths.push("Timing is good");
    else weaknesses.push("Timing needs work");
    
    if (fluency >= 0.8) strengths.push("Fluency is good");
    else weaknesses.push("Fluency needs improvement");
    
    // Next steps
    if (mistakes.length > 0) {
      nextSteps.push("Focus on the words you missed");
    }
    if (accuracy < 0.7) {
      nextSteps.push("Practice with slower audio");
    }
    if (timing < 0.6) {
      nextSteps.push("Work on matching the audio speed");
    }
    
    return {
      overall: overallText,
      strengths,
      weaknesses,
      nextSteps,
    };
  }

  /**
   * Get progress
   */
  getProgress(): ShadowingProgress {
    if (this.attempts.length === 0) {
      return {
        totalAttempts: 0,
        averageScore: { accuracy: 0, timing: 0, fluency: 0, overall: 0 },
        improvementTrend: "stable",
        commonMistakes: [],
        recommendedPractice: ["Start with basic shadowing exercises"],
      };
    }

    // Calculate averages (simplified)
    const totalAttempts = this.attempts.length;
    const averageScore = {
      accuracy: 0.7, // Placeholder
      timing: 0.7,
      fluency: 0.7,
      overall: 0.7,
    };

    return {
      totalAttempts,
      averageScore,
      improvementTrend: "stable",
      commonMistakes: [],
      recommendedPractice: ["Continue practicing shadowing"],
    };
  }

  /**
   * Get exercises by mode
   */
  getExercisesByMode(mode: ShadowingMode): ShadowingExercise[] {
    return Array.from(this.exercises.values())
      .filter(exercise => exercise.mode === mode);
  }
}

// ============================================================
// Shadowing Exercise Generator
// ============================================================

export class ShadowingExerciseGenerator {
  /**
   * Generate exercise from text
   */
  static generateExercise(
    text: string,
    translationChinese: string,
    mode: ShadowingMode = "listen_repeat"
  ): ShadowingExercise {
    // Estimate audio duration based on text length
    const wordCount = text.split(/\s+/).length;
    const estimatedDurationMs = wordCount * 400; // ~400ms per word

    return {
      id: `shadow_gen_${Date.now()}`,
      text,
      translationChinese,
      audioDurationMs: estimatedDurationMs,
      mode,
    };
  }

  /**
   * Generate exercises from audio unit
   */
  static generateFromAudioUnit(
    audioUnit: {
      id: string;
      text: string;
      translationChinese: string;
      shadowingPoints?: ShadowingPoint[];
    },
    modes: ShadowingMode[] = ["listen_only", "listen_repeat"]
  ): ShadowingExercise[] {
    return modes.map(mode => ({
      id: `${audioUnit.id}_${mode}`,
      text: audioUnit.text,
      translationChinese: audioUnit.translationChinese,
      audioDurationMs: audioUnit.shadowingPoints
        ? audioUnit.shadowingPoints[audioUnit.shadowingPoints.length - 1].endMs
        : audioUnit.text.split(/\s+/).length * 400,
      mode,
      shadowingPoints: audioUnit.shadowingPoints,
    }));
  }

  /**
   * Generate progression exercises
   */
  static generateProgression(
    baseText: string,
    translationChinese: string
  ): ShadowingExercise[] {
    return [
      // Step 1: Listen only
      {
        id: `progression_listen_${Date.now()}`,
        text: baseText,
        translationChinese,
        audioDurationMs: baseText.split(/\s+/).length * 400,
        mode: "listen_only",
      },
      // Step 2: Listen and repeat
      {
        id: `progression_repeat_${Date.now()}`,
        text: baseText,
        translationChinese,
        audioDurationMs: baseText.split(/\s+/).length * 400,
        mode: "listen_repeat",
      },
      // Step 3: Shadow simultaneously
      {
        id: `progression_shadow_${Date.now()}`,
        text: baseText,
        translationChinese,
        audioDurationMs: baseText.split(/\s+/).length * 400,
        mode: "shadow_simultaneous",
      },
    ];
  }
}
