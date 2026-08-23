/**
 * Native Audio Engine v1
 * 
 * Architecture for real language input:
 * - Word audio
 * - Sentence audio
 * - Dialogue audio
 * - Support for multiple accents (American/British)
 * - Speed control (slow/normal/fast)
 * - Future support for:
 *   - Local audio files
 *   - Cloud audio
 *   - AI-generated audio
 */

// ============================================================
// Types
// ============================================================

export type Accent = "american" | "british";
export type AudioSpeed = "slow" | "normal" | "fast";
export type AudioDifficulty = "beginner" | "intermediate" | "advanced";
export type AudioType = "word" | "sentence" | "dialogue" | "phrase";

/**
 * Core audio unit interface
 */
export interface AudioUnit {
  id: string;
  text: string;
  translationChinese: string;
  ipa?: string;
  phonemes?: string[];
  accent: Accent;
  speed: AudioSpeed;
  difficulty: AudioDifficulty;
  type: AudioType;
  
  // Shadowing support
  shadowingPoints?: ShadowingPoint[];
  
  // Metadata
  tags?: string[];
  relatedWords?: string[];
  exampleContext?: string;
}

/**
 * Shadowing point for practice
 */
export interface ShadowingPoint {
  startMs: number;
  endMs: number;
  text: string;
  phonemes?: string[];
  stress?: "primary" | "secondary" | "none";
}

/**
 * Audio request
 */
export interface NativeAudioRequest {
  text: string;
  type: AudioType;
  accent?: Accent;
  speed?: AudioSpeed;
  difficulty?: AudioDifficulty;
}

/**
 * Audio result
 */
export interface NativeAudioResult {
  id: string;
  text: string;
  type: AudioType;
  accent: Accent;
  speed: AudioSpeed;
  durationMs: number;
  audioUrl?: string;
  audioBlob?: Blob;
  fromCache: boolean;
  provider: string;
}

/**
 * Audio provider interface
 */
export interface NativeAudioProvider {
  name: string;
  priority: number;
  generate(request: NativeAudioRequest): Promise<NativeAudioResult>;
  isAvailable(): boolean;
  supportsAccent(accent: Accent): boolean;
  supportsOffline(): boolean;
}

/**
 * Audio metadata for curriculum
 */
export interface AudioMetadata {
  unitId: string;
  word?: string;
  sentence?: string;
  dialogue?: string;
  chineseTranslation: string;
  ipa?: string;
  phonemes?: string[];
  difficulty: AudioDifficulty;
  tags: string[];
}

// ============================================================
// Audio Content Database
// ============================================================

/**
 * Pre-defined audio units for curriculum
 */
export const NATIVE_AUDIO_DATABASE: AudioUnit[] = [
  // Day 1: Greetings
  {
    id: "greet_hello",
    text: "Hello",
    translationChinese: "你好",
    ipa: "/həˈloʊ/",
    phonemes: ["/h/", "/ə/", "/l/", "/oʊ/"],
    accent: "american",
    speed: "slow",
    difficulty: "beginner",
    type: "word",
    shadowingPoints: [
      { startMs: 0, endMs: 500, text: "Hello", stress: "primary" }
    ],
    tags: ["greeting", "basic"],
  },
  {
    id: "greet_hi",
    text: "Hi",
    translationChinese: "嗨",
    ipa: "/haɪ/",
    phonemes: ["/h/", "/aɪ/"],
    accent: "american",
    speed: "slow",
    difficulty: "beginner",
    type: "word",
    shadowingPoints: [
      { startMs: 0, endMs: 300, text: "Hi", stress: "primary" }
    ],
    tags: ["greeting", "basic"],
  },
  {
    id: "greet_goodbye",
    text: "Goodbye",
    translationChinese: "再见",
    ipa: "/ɡʊdˈbaɪ/",
    phonemes: ["/ɡ/", "/ʊ/", "/d/", "/b/", "/aɪ/"],
    accent: "american",
    speed: "slow",
    difficulty: "beginner",
    type: "word",
    shadowingPoints: [
      { startMs: 0, endMs: 700, text: "Goodbye", stress: "secondary" }
    ],
    tags: ["greeting", "basic"],
  },
  {
    id: "greet_morning",
    text: "Good morning",
    translationChinese: "早上好",
    ipa: "/ɡʊd ˈmɔːrnɪŋ/",
    phonemes: ["/ɡ/", "/ʊ/", "/d/", "/m/", "/ɔː/", "/r/", "/n/", "/ɪ/", "/ŋ/"],
    accent: "american",
    speed: "slow",
    difficulty: "beginner",
    type: "phrase",
    shadowingPoints: [
      { startMs: 0, endMs: 400, text: "Good", stress: "none" },
      { startMs: 400, endMs: 1000, text: "morning", stress: "primary" }
    ],
    tags: ["greeting", "time"],
  },
  
  // Day 1: Introductions
  {
    id: "intro_my_name",
    text: "My name is",
    translationChinese: "我的名字是",
    ipa: "/maɪ neɪm ɪz/",
    accent: "american",
    speed: "slow",
    difficulty: "beginner",
    type: "phrase",
    shadowingPoints: [
      { startMs: 0, endMs: 300, text: "My", stress: "none" },
      { startMs: 300, endMs: 600, text: "name", stress: "primary" },
      { startMs: 600, endMs: 900, text: "is", stress: "none" }
    ],
    tags: ["introduction", "basic"],
  },
  {
    id: "intro_nice_to_meet",
    text: "Nice to meet you",
    translationChinese: "很高兴认识你",
    ipa: "/naɪs tə miːt juː/",
    accent: "american",
    speed: "slow",
    difficulty: "beginner",
    type: "sentence",
    shadowingPoints: [
      { startMs: 0, endMs: 400, text: "Nice", stress: "primary" },
      { startMs: 400, endMs: 500, text: "to", stress: "none" },
      { startMs: 500, endMs: 800, text: "meet", stress: "primary" },
      { startMs: 800, endMs: 1100, text: "you", stress: "none" }
    ],
    tags: ["introduction", "polite"],
  },
  
  // Day 2: Numbers
  {
    id: "num_one",
    text: "One",
    translationChinese: "一",
    ipa: "/wʌn/",
    phonemes: ["/w/", "/ʌ/", "/n/"],
    accent: "american",
    speed: "slow",
    difficulty: "beginner",
    type: "word",
    tags: ["number", "basic"],
  },
  {
    id: "num_two",
    text: "Two",
    translationChinese: "二",
    ipa: "/tuː/",
    phonemes: ["/t/", "/uː/"],
    accent: "american",
    speed: "slow",
    difficulty: "beginner",
    type: "word",
    tags: ["number", "basic"],
  },
  {
    id: "num_three",
    text: "Three",
    translationChinese: "三",
    ipa: "/θriː/",
    phonemes: ["/θ/", "/r/", "/iː/"],
    accent: "american",
    speed: "slow",
    difficulty: "beginner",
    type: "word",
    tags: ["number", "basic"],
  },
  
  // Day 3: Colors
  {
    id: "color_red",
    text: "Red",
    translationChinese: "红色",
    ipa: "/rɛd/",
    phonemes: ["/r/", "/ɛ/", "/d/"],
    accent: "american",
    speed: "slow",
    difficulty: "beginner",
    type: "word",
    tags: ["color", "basic"],
  },
  {
    id: "color_blue",
    text: "Blue",
    translationChinese: "蓝色",
    ipa: "/bluː/",
    phonemes: ["/b/", "/l/", "/uː/"],
    accent: "american",
    speed: "slow",
    difficulty: "beginner",
    type: "word",
    tags: ["color", "basic"],
  },
  
  // Common sentences
  {
    id: "sent_how_are_you",
    text: "How are you?",
    translationChinese: "你好吗？",
    ipa: "/haʊ ɑːr juː/",
    accent: "american",
    speed: "slow",
    difficulty: "beginner",
    type: "sentence",
    shadowingPoints: [
      { startMs: 0, endMs: 400, text: "How", stress: "primary" },
      { startMs: 400, endMs: 600, text: "are", stress: "none" },
      { startMs: 600, endMs: 900, text: "you?", stress: "primary" }
    ],
    tags: ["question", "greeting"],
  },
  {
    id: "sent_thank_you",
    text: "Thank you",
    translationChinese: "谢谢",
    ipa: "/θæŋk juː/",
    accent: "american",
    speed: "slow",
    difficulty: "beginner",
    type: "sentence",
    shadowingPoints: [
      { startMs: 0, endMs: 500, text: "Thank", stress: "primary" },
      { startMs: 500, endMs: 800, text: "you", stress: "none" }
    ],
    tags: ["polite", "basic"],
  },
  {
    id: "sent_please",
    text: "Please",
    translationChinese: "请",
    ipa: "/pliːz/",
    phonemes: ["/p/", "/l/", "/iː/", "/z/"],
    accent: "american",
    speed: "slow",
    difficulty: "beginner",
    type: "word",
    tags: ["polite", "basic"],
  },
  {
    id: "sent_yes",
    text: "Yes",
    translationChinese: "是的",
    ipa: "/jɛs/",
    phonemes: ["/j/", "/ɛ/", "/s/"],
    accent: "american",
    speed: "slow",
    difficulty: "beginner",
    type: "word",
    tags: ["basic", "response"],
  },
  {
    id: "sent_no",
    text: "No",
    translationChinese: "不",
    ipa: "/noʊ/",
    phonemes: ["/n/", "/oʊ/"],
    accent: "american",
    speed: "slow",
    difficulty: "beginner",
    type: "word",
    tags: ["basic", "response"],
  },
  
  // Dialogue examples
  {
    id: "dialog_greeting",
    text: "A: Hello! B: Hi! How are you? A: I'm fine, thank you.",
    translationChinese: "A: 你好！ B: 嗨！你好吗？ A: 我很好，谢谢。",
    accent: "american",
    speed: "slow",
    difficulty: "beginner",
    type: "dialogue",
    shadowingPoints: [
      { startMs: 0, endMs: 500, text: "A: Hello!", stress: "primary" },
      { startMs: 600, endMs: 900, text: "B: Hi!", stress: "primary" },
      { startMs: 1000, endMs: 1600, text: "How are you?", stress: "primary" },
      { startMs: 1700, endMs: 2400, text: "A: I'm fine, thank you.", stress: "primary" }
    ],
    tags: ["dialogue", "greeting"],
  },
];

// ============================================================
// Native Audio Engine
// ============================================================

export class NativeAudioEngineV1 {
  private providers: NativeAudioProvider[] = [];
  private audioDatabase: Map<string, AudioUnit> = new Map();
  private cache: Map<string, NativeAudioResult> = new Map();

  constructor() {
    // Initialize database
    NATIVE_AUDIO_DATABASE.forEach(unit => {
      this.audioDatabase.set(unit.id, unit);
    });
  }

  /**
   * Register audio provider
   */
  registerProvider(provider: NativeAudioProvider): void {
    this.providers.push(provider);
    this.providers.sort((a, b) => a.priority - b.priority);
  }

  /**
   * Get audio unit by ID
   */
  getAudioUnit(id: string): AudioUnit | undefined {
    return this.audioDatabase.get(id);
  }

  /**
   * Get audio units by tag
   */
  getAudioUnitsByTag(tag: string): AudioUnit[] {
    return Array.from(this.audioDatabase.values())
      .filter(unit => unit.tags?.includes(tag));
  }

  /**
   * Get audio units by difficulty
   */
  getAudioUnitsByDifficulty(difficulty: AudioDifficulty): AudioUnit[] {
    return Array.from(this.audioDatabase.values())
      .filter(unit => unit.difficulty === difficulty);
  }

  /**
   * Search audio units
   */
  searchAudioUnits(query: string): AudioUnit[] {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.audioDatabase.values())
      .filter(unit => 
        unit.text.toLowerCase().includes(lowerQuery) ||
        unit.translationChinese.includes(query) ||
        unit.tags?.some(tag => tag.includes(lowerQuery))
      );
  }

  /**
   * Generate audio for text
   */
  async generateAudio(
    text: string,
    type: AudioType = "word",
    accent: Accent = "american",
    speed: AudioSpeed = "slow"
  ): Promise<NativeAudioResult> {
    // Check cache first
    const cacheKey = `${text}_${type}_${accent}_${speed}`;
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return { ...cached, fromCache: true };
    }

    // Try providers in priority order
    for (const provider of this.providers) {
      if (!provider.isAvailable()) continue;
      if (!provider.supportsAccent(accent)) continue;

      try {
        const result = await provider.generate({
          text,
          type,
          accent,
          speed,
          difficulty: "beginner",
        });

        // Cache the result
        this.cache.set(cacheKey, result);

        return result;
      } catch {
        continue;
      }
    }

    // Fallback to mock if no provider available
    return this.generateMockAudio(text, type, accent, speed);
  }

  /**
   * Generate mock audio (for testing/fallback)
   */
  private generateMockAudio(
    text: string,
    type: AudioType,
    accent: Accent,
    speed: AudioSpeed
  ): NativeAudioResult {
    const durationMultiplier = speed === "slow" ? 1.5 : speed === "fast" ? 0.7 : 1;
    const baseDuration = type === "word" ? 500 : type === "sentence" ? 1500 : 3000;
    
    return {
      id: `mock_${Date.now()}_${text.slice(0, 20).replace(/\s/g, "_")}`,
      text,
      type,
      accent,
      speed,
      durationMs: Math.round(baseDuration * durationMultiplier),
      fromCache: false,
      provider: "mock",
    };
  }

  /**
   * Get shadowing points for text
   */
  getShadowingPoints(text: string): ShadowingPoint[] {
    // Find matching audio unit
    const unit = Array.from(this.audioDatabase.values())
      .find(u => u.text === text);
    
    return unit?.shadowingPoints || [];
  }

  /**
   * Add custom audio unit
   */
  addAudioUnit(unit: AudioUnit): void {
    this.audioDatabase.set(unit.id, unit);
  }

  /**
   * Get all audio units
   */
  getAllAudioUnits(): AudioUnit[] {
    return Array.from(this.audioDatabase.values());
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
// Default Provider: Mock (for testing)
// ============================================================

export class MockNativeAudioProvider implements NativeAudioProvider {
  name = "mock_native";
  priority = 100;

  isAvailable(): boolean {
    return true;
  }

  supportsAccent(_accent: Accent): boolean {
    return true;
  }

  supportsOffline(): boolean {
    return true;
  }

  async generate(request: NativeAudioRequest): Promise<NativeAudioResult> {
    return {
      id: `mock_${Date.now()}_${request.text.slice(0, 20).replace(/\s/g, "_")}`,
      text: request.text,
      type: request.type,
      accent: request.accent || "american",
      speed: request.speed || "slow",
      durationMs: 1000,
      fromCache: false,
      provider: this.name,
    };
  }
}
