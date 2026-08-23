/**
 * Audio Engine v1
 *
 * Handles text-to-speech and audio playback:
 * - Word playback
 * - Sentence playback
 * - Speed control
 * - Audio caching for offline use
 *
 * Uses Web Speech API for TTS (free, built-in).
 */

// ============================================================
// Types
// ============================================================

export interface AudioConfig {
  rate: number;                 // 0.1 - 10 (speed)
  pitch: number;                // 0 - 2
  volume: number;               // 0 - 1
  voice: string;                // Voice name
  accent: "american" | "british" | "australian";
}

export interface AudioCacheEntry {
  id: string;                   // Hash of text + config
  text: string;
  config: AudioConfig;
  blob?: Blob;
  url?: string;
  createdAt: number;
}

// ============================================================
// Audio Engine
// ============================================================

export class AudioEngine {
  private synth: SpeechSynthesis;
  private audioCache: Map<string, AudioCacheEntry> = new Map();
  private isPlaying: boolean = false;
  
  // Default configuration
  private defaultConfig: AudioConfig = {
    rate: 0.8,                  // Slightly slow for learners
    pitch: 1,
    volume: 1,
    voice: "",
    accent: "american",
  };

  constructor() {
    this.synth = window.speechSynthesis;
    this.loadCache();
  }

  // ============================================================
  // Playback Methods
  // ============================================================

  /**
   * Play a single word
   */
  async playWord(
    word: string,
    config?: Partial<AudioConfig>
  ): Promise<void> {
    const fullConfig = { ...this.defaultConfig, ...config };
    await this.speak(word, fullConfig);
  }

  /**
   * Play a sentence
   */
  async playSentence(
    sentence: string,
    config?: Partial<AudioConfig>
  ): Promise<void> {
    const fullConfig = { ...this.defaultConfig, ...config };
    await this.speak(sentence, fullConfig);
  }

  /**
   * Play a dialogue (multiple lines)
   */
  async playDialogue(
    lines: { speaker: string; text: string }[],
    config?: Partial<AudioConfig>
  ): Promise<void> {
    for (const line of lines) {
      await this.speak(line.text, { ...this.defaultConfig, ...config });
      // Small pause between speakers
      await this.delay(300);
    }
  }

  /**
   * Play text at slow speed (for learners)
   */
  async playSlow(
    text: string,
    speed: number = 0.6
  ): Promise<void> {
    await this.speak(text, { ...this.defaultConfig, rate: speed });
  }

  /**
   * Play text at normal speed
   */
  async playNormal(text: string): Promise<void> {
    await this.speak(text, { ...this.defaultConfig, rate: 1.0 });
  }

  /**
   * Play text at fast speed
   */
  async playFast(text: string): Promise<void> {
    await this.speak(text, { ...this.defaultConfig, rate: 1.5 });
  }

  // ============================================================
  // Control Methods
  // ============================================================

  /**
   * Pause playback
   */
  pause(): void {
    if (this.synth.speaking) {
      this.synth.pause();
    }
  }

  /**
   * Resume playback
   */
  resume(): void {
    if (this.synth.paused) {
      this.synth.resume();
    }
  }

  /**
   * Stop playback
   */
  stop(): void {
    this.synth.cancel();
    this.isPlaying = false;
  }

  /**
   * Check if audio is playing
   */
  isAudioPlaying(): boolean {
    return this.isPlaying;
  }

  // ============================================================
  // Configuration Methods
  // ============================================================

  /**
   * Set default configuration
   */
  setDefaultConfig(config: Partial<AudioConfig>): void {
    this.defaultConfig = { ...this.defaultConfig, ...config };
  }

  /**
   * Get default configuration
   */
  getDefaultConfig(): AudioConfig {
    return { ...this.defaultConfig };
  }

  /**
   * Set speed (rate)
   */
  setSpeed(rate: number): void {
    this.defaultConfig.rate = Math.max(0.1, Math.min(10, rate));
  }

  /**
   * Get available voices
   */
  getVoices(): SpeechSynthesisVoice[] {
    return this.synth.getVoices();
  }

  /**
   * Get voices for a specific accent
   */
  getVoicesForAccent(accent: "american" | "british" | "australian"): SpeechSynthesisVoice[] {
    const voices = this.getVoices();
    const langCodes: Record<string, string[]> = {
      american: ["en-US", "en"],
      british: ["en-GB", "en-UK"],
      australian: ["en-AU"],
    };

    const codes = langCodes[accent] || ["en-US"];
    return voices.filter(v => 
      codes.some(code => v.lang.startsWith(code))
    );
  }

  /**
   * Set voice by name
   */
  setVoice(voiceName: string): void {
    this.defaultConfig.voice = voiceName;
  }

  // ============================================================
  // Cache Methods
  // ============================================================

  /**
   * Generate cache key
   */
  private getCacheKey(text: string, config: AudioConfig): string {
    return `${text}_${config.rate}_${config.pitch}_${config.voice}`;
  }

  /**
   * Check if audio is cached
   */
  isCached(text: string, config?: Partial<AudioConfig>): boolean {
    const fullConfig = { ...this.defaultConfig, ...config };
    const key = this.getCacheKey(text, fullConfig);
    return this.audioCache.has(key);
  }

  /**
   * Get cached audio URL
   */
  getCachedUrl(text: string, config?: Partial<AudioConfig>): string | null {
    const fullConfig = { ...this.defaultConfig, ...config };
    const key = this.getCacheKey(text, fullConfig);
    const entry = this.audioCache.get(key);
    return entry?.url || null;
  }

  /**
   * Clear audio cache
   */
  clearCache(): void {
    this.audioCache.clear();
    localStorage.removeItem("audio_cache");
  }

  /**
   * Load cache from localStorage
   */
  private loadCache(): void {
    try {
      const stored = localStorage.getItem("audio_cache");
      if (stored) {
        const entries = JSON.parse(stored);
        for (const entry of entries) {
          this.audioCache.set(entry.id, entry);
        }
      }
    } catch {
      // Ignore errors
    }
  }

  /**
   * Save cache to localStorage
   */
  private saveCache(): void {
    try {
      const entries = Array.from(this.audioCache.values());
      localStorage.setItem("audio_cache", JSON.stringify(entries));
    } catch {
      // Ignore errors
    }
  }

  // ============================================================
  // Private Methods
  // ============================================================

  /**
   * Speak text using Web Speech API
   */
  private async speak(
    text: string,
    config: AudioConfig
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      // Cancel any ongoing speech
      this.synth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Apply configuration
      utterance.rate = config.rate;
      utterance.pitch = config.pitch;
      utterance.volume = config.volume;

      // Find and set voice
      const voices = this.synth.getVoices();
      let selectedVoice: SpeechSynthesisVoice | undefined;

      if (config.voice) {
        selectedVoice = voices.find(v => v.name === config.voice);
      }

      if (!selectedVoice) {
        // Find voice for accent
        const langCodes: Record<string, string[]> = {
          american: ["en-US", "en"],
          british: ["en-GB", "en-UK"],
          australian: ["en-AU"],
        };
        const codes = langCodes[config.accent] || ["en-US"];
        selectedVoice = voices.find(v => 
          codes.some(code => v.lang.startsWith(code))
        );
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      // Event handlers
      utterance.onstart = () => {
        this.isPlaying = true;
      };

      utterance.onend = () => {
        this.isPlaying = false;
        
        // Cache the audio (store metadata)
        const key = this.getCacheKey(text, config);
        if (!this.audioCache.has(key)) {
          this.audioCache.set(key, {
            id: key,
            text,
            config,
            createdAt: Date.now(),
          });
          this.saveCache();
        }
        
        resolve();
      };

      utterance.onerror = (event) => {
        this.isPlaying = false;
        reject(new Error(`Speech error: ${event.error}`));
      };

      utterance.onpause = () => {
        // Handle pause
      };

      utterance.onresume = () => {
        // Handle resume
      };

      // Start speaking
      this.synth.speak(utterance);
    });
  }

  /**
   * Delay helper
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ============================================================
  // Utility Methods
  // ============================================================

  /**
   * Check if Web Speech API is available
   */
  isAvailable(): boolean {
    return "speechSynthesis" in window;
  }

  /**
   * Get supported features
   */
  getSupportedFeatures(): {
    tts: boolean;
    voices: boolean;
    pause: boolean;
    resume: boolean;
  } {
    return {
      tts: this.isAvailable(),
      voices: this.isAvailable() && this.getVoices().length > 0,
      pause: this.isAvailable(),
      resume: this.isAvailable(),
    };
  }

  /**
   * Pronounce IPA symbols (simplified)
   */
  async pronounceIPA(ipa: string): Promise<void> {
    // For IPA, we need to map to actual pronunciation
    // This is a simplified version - real implementation would need a mapping
    await this.speak(ipa, { ...this.defaultConfig, rate: 0.5 });
  }

  /**
   * Compare pronunciation (for speaking exercises)
   */
  async comparePronunciation(
    _target: string,
    _userRecording?: Blob
  ): Promise<{
    score: number;
    feedback: string;
  }> {
    // This would require speech recognition API
    // For now, return a placeholder
    return {
      score: 0.8,
      feedback: "Pronunciation evaluation requires speech recognition API",
    };
  }
}
