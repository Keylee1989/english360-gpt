/**
 * Audio Resource System v1
 *
 * Manages audio playback for vocabulary, sentences, and dialogues.
 * Supports:
 * - TTS (Web Speech API)
 * - Future: Native audio files
 * - Speed control (slow/normal)
 * - American accent
 */

// ============================================================
// Types
// ============================================================

export interface AudioResource {
  id: string;
  type: "word" | "sentence" | "dialogue";
  text: string;
  speaker: string;
  accent: "american" | "british";
  speed: "slow" | "normal" | "fast";
  url?: string; // For native audio files
  transcript?: string;
  transcriptChinese?: string;
}

export interface AudioPlaybackOptions {
  speed?: "slow" | "normal" | "fast";
  accent?: "american" | "british";
  onEnd?: () => void;
  onError?: (error: Error) => void;
}

// ============================================================
// Audio Resource System
// ============================================================

export class AudioSystemV1 {
  private audioCache: Map<string, AudioResource> = new Map();
  private currentAudio: HTMLAudioElement | null = null;
  private ttsAvailable: boolean;

  constructor() {
    this.ttsAvailable = "speechSynthesis" in window;
  }

  /**
   * Play text using TTS
   */
  async playText(
    text: string,
    options: AudioPlaybackOptions = {}
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.ttsAvailable) {
        reject(new Error("Speech synthesis not available"));
        return;
      }

      // Stop any current playback
      this.stop();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";

      // Set speed
      const speedMap = { slow: 0.7, normal: 1.0, fast: 1.3 };
      utterance.rate = speedMap[options.speed || "normal"];

      // Set voice (prefer American English)
      const voices = speechSynthesis.getVoices();
      const americanVoice = voices.find(
        (v) => v.lang === "en-US" && v.name.includes("Google")
      );
      if (americanVoice) {
        utterance.voice = americanVoice;
      }

      utterance.onend = () => {
        options.onEnd?.();
        resolve();
      };

      utterance.onerror = (event) => {
        const error = new Error(`TTS error: ${event.error}`);
        options.onError?.(error);
        reject(error);
      };

      speechSynthesis.speak(utterance);
    });
  }

  /**
   * Play vocabulary word
   */
  async playWord(
    word: string,
    options: AudioPlaybackOptions = {}
  ): Promise<void> {
    const resource: AudioResource = {
      id: `word_${word}`,
      type: "word",
      text: word,
      speaker: "system",
      accent: "american",
      speed: options.speed || "normal",
    };

    this.audioCache.set(resource.id, resource);

    return this.playText(word, { ...options, speed: options.speed });
  }

  /**
   * Play sentence
   */
  async playSentence(
    sentence: string,
    options: AudioPlaybackOptions = {}
  ): Promise<void> {
    const resource: AudioResource = {
      id: `sentence_${sentence.substring(0, 20)}`,
      type: "sentence",
      text: sentence,
      speaker: "system",
      accent: "american",
      speed: options.speed || "normal",
    };

    this.audioCache.set(resource.id, resource);
    return this.playText(sentence, options);
  }

  /**
   * Play dialogue (multiple sentences with pauses)
   */
  async playDialogue(
    sentences: string[],
    options: AudioPlaybackOptions = {},
    pauseMs: number = 500
  ): Promise<void> {
    for (let i = 0; i < sentences.length; i++) {
      await this.playSentence(sentences[i], options);

      // Pause between sentences
      if (i < sentences.length - 1) {
        await this.delay(pauseMs);
      }
    }
  }

  /**
   * Play slow version then normal version
   */
  async playSlowThenNormal(text: string): Promise<void> {
    await this.playText(text, { speed: "slow" });
    await this.delay(1000);
    await this.playText(text, { speed: "normal" });
  }

  /**
   * Stop current playback
   */
  stop(): void {
    if (this.ttsAvailable) {
      speechSynthesis.cancel();
    }
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
  }

  /**
   * Check if audio is playing
   */
  isPlaying(): boolean {
    return this.ttsAvailable && speechSynthesis.speaking;
  }

  /**
   * Get available voices
   */
  getVoices(): SpeechSynthesisVoice[] {
    return speechSynthesis.getVoices();
  }

  /**
   * Get American English voices
   */
  getAmericanVoices(): SpeechSynthesisVoice[] {
    return this.getVoices().filter((v) => v.lang === "en-US");
  }

  /**
   * Helper: delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.audioCache.clear();
  }
}

// ============================================================
// Singleton Export
// ============================================================

export const audioSystem = new AudioSystemV1();
