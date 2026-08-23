/**
 * Audio Engine v3 — Native Audio with Fallback
 *
 * Supports:
 * - Native Audio (mp3 files)
 * - TTS Provider (Web Speech API)
 * - Hybrid Provider (tries native, falls back to TTS)
 *
 * Features:
 * - Word/Sentence/Dialogue playback
 * - Speed control (slow/normal)
 * - Audio caching
 * - Preloading
 * - Graceful fallback
 */

// ============================================================
// Types
// ============================================================

export type AudioSpeed = "slow" | "normal";
export type AudioType = "vocabulary" | "sentences" | "dialogues" | "pronunciation";

export interface AudioManifestItem {
  word: string;
  audio: string;
  slowAudio?: string;
  type: AudioType;
}

export interface AudioProvider {
  name: string;
  isAvailable(): boolean;
  play(text: string, speed?: AudioSpeed): Promise<void>;
  stop(): void;
  preload?(items: string[]): Promise<void>;
}

// ============================================================
// Native Audio Provider
// ============================================================

export class NativeAudioProvider implements AudioProvider {
  name = "native";
  private audio: HTMLAudioElement | null = null;
  private cache: Map<string, HTMLAudioElement> = new Map();
  private basePath: string;

  constructor(basePath: string = "/audio") {
    this.basePath = basePath;
  }

  isAvailable(): boolean {
    return typeof window !== "undefined" && "Audio" in window;
  }

  private getAudioPath(text: string, speed: AudioSpeed): string {
    const normalizedText = text.toLowerCase().replace(/[^a-z0-9]/g, "_");
    const suffix = speed === "slow" ? "_slow" : "";
    return `${this.basePath}/vocabulary/${normalizedText}${suffix}.mp3`;
  }

  async play(text: string, speed: AudioSpeed = "normal"): Promise<void> {
    if (!this.isAvailable()) {
      throw new Error("Audio not available");
    }

    const path = this.getAudioPath(text, speed);

    // Check cache first
    let audio = this.cache.get(path);

    if (!audio) {
      audio = new Audio(path);
      this.cache.set(path, audio);
    }

    return new Promise((resolve, reject) => {
      audio!.onended = () => resolve();
      audio!.onerror = () => reject(new Error(`Failed to load audio: ${path}`));
      audio!.play().catch(reject);
    });
  }

  stop(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
  }

  async preload(items: string[]): Promise<void> {
    for (const item of items) {
      const path = this.getAudioPath(item, "normal");
      if (!this.cache.has(path)) {
        const audio = new Audio(path);
        this.cache.set(path, audio);
      }
    }
  }

  isAudioAvailable(text: string): boolean {
    const path = this.getAudioPath(text, "normal");
    // Check if we can create an audio element
    const audio = new Audio(path);
    return audio.canPlayType("audio/mpeg") !== "";
  }
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

  async play(text: string, speed: AudioSpeed = "normal"): Promise<void> {
    if (!this.synth) {
      throw new Error("Speech synthesis not available");
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
// Hybrid Audio Provider
// ============================================================

export class HybridAudioProvider implements AudioProvider {
  name = "hybrid";
  private nativeProvider: NativeAudioProvider;
  private ttsProvider: TTSProvider;
  private audioAvailabilityCache: Map<string, boolean> = new Map();

  constructor(basePath: string = "/audio") {
    this.nativeProvider = new NativeAudioProvider(basePath);
    this.ttsProvider = new TTSProvider();
  }

  isAvailable(): boolean {
    return this.nativeProvider.isAvailable() || this.ttsProvider.isAvailable();
  }

  async play(text: string, speed: AudioSpeed = "normal"): Promise<void> {
    // Try native audio first
    const cacheKey = `${text}_${speed}`;
    const isNativeAvailable = this.audioAvailabilityCache.get(cacheKey);

    if (isNativeAvailable !== false) {
      try {
        await this.nativeProvider.play(text, speed);
        this.audioAvailabilityCache.set(cacheKey, true);
        return;
      } catch {
        this.audioAvailabilityCache.set(cacheKey, false);
        // Fall through to TTS
      }
    }

    // Fallback to TTS
    if (this.ttsProvider.isAvailable()) {
      await this.ttsProvider.play(text, speed);
      return;
    }

    throw new Error("No audio provider available");
  }

  stop(): void {
    this.nativeProvider.stop();
    this.ttsProvider.stop();
  }

  async preload(items: string[]): Promise<void> {
    await this.nativeProvider.preload(items);
  }
}

// ============================================================
// Audio Engine v3
// ============================================================

export class AudioEngineV3 {
  private providers: Map<string, AudioProvider>;
  private activeProvider: AudioProvider;
  private manifest: Map<string, AudioManifestItem> = new Map();

  constructor(basePath: string = "/audio") {
    // Initialize providers
    this.providers = new Map();
    this.providers.set("native", new NativeAudioProvider(basePath));
    this.providers.set("tts", new TTSProvider());
    this.providers.set("hybrid", new HybridAudioProvider(basePath));

    // Default to hybrid provider
    this.activeProvider = this.providers.get("hybrid")!;
  }

  /**
   * Set active provider
   */
  setProvider(name: string): void {
    const provider = this.providers.get(name);
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
   * Load audio manifest
   */
  loadManifest(items: AudioManifestItem[]): void {
    for (const item of items) {
      this.manifest.set(item.word, item);
    }
  }

  /**
   * Play word audio
   */
  async playWord(word: string, speed: AudioSpeed = "normal"): Promise<void> {
    await this.activeProvider.play(word, speed);
  }

  /**
   * Play sentence audio
   */
  async playSentence(sentence: string, speed: AudioSpeed = "normal"): Promise<void> {
    await this.activeProvider.play(sentence, speed);
  }

  /**
   * Play dialogue audio (multiple lines)
   */
  async playDialogue(lines: string[], speed: AudioSpeed = "normal"): Promise<void> {
    for (const line of lines) {
      await this.activeProvider.play(line, speed);
      // Small delay between lines
      await new Promise((resolve) => setTimeout(resolve, 300));
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
   * Preload audio for a list of words
   */
  async preload(words: string[]): Promise<void> {
    if (this.activeProvider.preload) {
      await this.activeProvider.preload(words);
    }
  }

  /**
   * Get manifest item for a word
   */
  getManifestItem(word: string): AudioManifestItem | undefined {
    return this.manifest.get(word);
  }
}

// ============================================================
// Factory Function
// ============================================================

export function createAudioEngine(basePath?: string): AudioEngineV3 {
  return new AudioEngineV3(basePath);
}

export default AudioEngineV3;
