/**
 * Audio Engine v2 — Provider Abstraction Layer
 *
 * Supports:
 * - TTS Provider (Web Speech API)
 * - Native Audio Provider (future)
 * - Audio caching
 * - Speed control
 * - Word/sentence/dialogue playback
 */

// ============================================================
// Types
// ============================================================

export type AudioSpeed = "slow" | "normal" | "fast";
export type AudioAccent = "american" | "british";
export type AudioType = "word" | "sentence" | "dialogue";

export interface AudioUnit {
  id: string;
  text: string;
  translationChinese: string;
  ipa?: string;
  phonemes?: string[];
  accent: AudioAccent;
  speed: AudioSpeed;
  difficulty: "beginner" | "intermediate" | "advanced";
  audioUrl?: string;
}

export interface AudioProvider {
  name: string;
  isAvailable(): boolean;
  play(text: string, speed: AudioSpeed): Promise<void>;
  stop(): void;
}

export interface AudioCacheEntry {
  id: string;
  text: string;
  speed: AudioSpeed;
  audioBlob?: Blob;
  createdAt: number;
}

// ============================================================
// TTS Provider (Web Speech API)
// ============================================================

export class TTSProvider implements AudioProvider {
  name = "tts";
  private synth: SpeechSynthesis | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.synth = window.speechSynthesis;
    }
  }

  isAvailable(): boolean {
    return this.synth !== null;
  }

  async play(text: string, speed: AudioSpeed): Promise<void> {
    if (!this.synth) {
      console.warn("TTS not available");
      return;
    }

    // Cancel any ongoing speech
    this.synth.cancel();

    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);

      // Set speed
      switch (speed) {
        case "slow":
          utterance.rate = 0.7;
          break;
        case "normal":
          utterance.rate = 0.9;
          break;
        case "fast":
          utterance.rate = 1.1;
          break;
      }

      // Set voice (prefer American English)
      const voices = this.synth!.getVoices();
      const americanVoice = voices.find(
        (v) => v.lang.startsWith("en-US") && v.name.includes("Google")
      );
      if (americanVoice) {
        utterance.voice = americanVoice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      this.synth!.speak(utterance);
    });
  }

  stop(): void {
    this.synth?.cancel();
  }
}

// ============================================================
// Native Audio Provider (placeholder for future)
// ============================================================

export class NativeAudioProvider implements AudioProvider {
  name = "native";
  private audio: HTMLAudioElement | null = null;

  isAvailable(): boolean {
    return typeof window !== "undefined" && "Audio" in window;
  }

  async play(text: string, _speed: AudioSpeed): Promise<void> {
    // Placeholder: In production, this would fetch from audio URL
    console.log(`NativeAudio: Would play "${text}"`);
    return Promise.resolve();
  }

  stop(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }
  }
}

// ============================================================
// Audio Engine v2
// ============================================================

export class AudioEngineV2 {
  private providers: AudioProvider[];
  private cache: Map<string, AudioCacheEntry> = new Map();
  private activeProvider: AudioProvider;

  constructor() {
    // Initialize providers in priority order
    this.providers = [new TTSProvider(), new NativeAudioProvider()];

    // Use first available provider
    this.activeProvider =
      this.providers.find((p) => p.isAvailable()) || this.providers[0];
  }

  /**
   * Set active provider
   */
  setProvider(name: string): void {
    const provider = this.providers.find((p) => p.name === name);
    if (provider && provider.isAvailable()) {
      this.activeProvider = provider;
    }
  }

  /**
   * Get active provider name
   */
  getProviderName(): string {
    return this.activeProvider.name;
  }

  /**
   * Play word audio
   */
  async playWord(word: string, speed: AudioSpeed = "normal"): Promise<void> {
    const cacheKey = `word_${word}_${speed}`;
    const cached = this.cache.get(cacheKey);

    if (cached?.audioBlob) {
      // Play from cache (future)
      console.log(`Playing from cache: ${word}`);
    }

    await this.activeProvider.play(word, speed);
  }

  /**
   * Play sentence audio
   */
  async playSentence(
    sentence: string,
    speed: AudioSpeed = "normal"
  ): Promise<void> {
    await this.activeProvider.play(sentence, speed);
  }

  /**
   * Play dialogue audio
   */
  async playDialogue(
    lines: { speaker: string; text: string }[],
    speed: AudioSpeed = "normal"
  ): Promise<void> {
    for (const line of lines) {
      await this.activeProvider.play(line.text, speed);
      // Small delay between lines
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  /**
   * Play with word-by-word highlighting
   */
  async playWithHighlight(
    text: string,
    onWordHighlight: (word: string, index: number) => void,
    speed: AudioSpeed = "normal"
  ): Promise<void> {
    const words = text.split(" ");

    for (let i = 0; i < words.length; i++) {
      onWordHighlight(words[i], i);
      await this.activeProvider.play(words[i], speed);
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  }

  /**
   * Stop playback
   */
  stop(): void {
    this.activeProvider.stop();
  }

  /**
   * Check if audio is available
   */
  isAvailable(): boolean {
    return this.activeProvider.isAvailable();
  }

  /**
   * Cache audio (for future native audio)
   */
  cacheAudio(id: string, text: string, speed: AudioSpeed, blob?: Blob): void {
    this.cache.set(id, {
      id,
      text,
      speed,
      audioBlob: blob,
      createdAt: Date.now(),
    });
  }

  /**
   * Get cached audio
   */
  getCachedAudio(id: string): AudioCacheEntry | undefined {
    return this.cache.get(id);
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache size
   */
  getCacheSize(): number {
    return this.cache.size;
  }
}

// ============================================================
// Factory Function
// ============================================================

export function createAudioEngine(): AudioEngineV2 {
  return new AudioEngineV2();
}

export default AudioEngineV2;
