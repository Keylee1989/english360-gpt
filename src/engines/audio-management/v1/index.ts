/**
 * Audio Content Management System v1
 *
 * Manages audio content for English360:
 * - Audio Registry (track all audio files)
 * - Audio Validation (check file existence)
 * - Audio Loader (load audio files)
 * - Audio Quality Checker
 */

// ============================================================
// Types
// ============================================================

export type AudioContentType = "word" | "sentence" | "dialogue" | "shadowing";
export type AudioStatus = "ready" | "missing" | "error" | "testing";
export type AudioLevel = "A1" | "A2" | "B1" | "B2";

export interface AudioRegistryItem {
  id: string;
  type: AudioContentType;
  text: string;
  level: AudioLevel;
  normalAudio: string;
  slowAudio?: string;
  status: AudioStatus;
  duration?: number;
  createdAt: number;
  updatedAt: number;
}

export interface AudioValidationResult {
  id: string;
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface AudioStats {
  total: number;
  ready: number;
  missing: number;
  error: number;
  byType: Record<AudioContentType, number>;
  byLevel: Record<AudioLevel, number>;
}

// ============================================================
// Storage
// ============================================================

const STORAGE_KEY = "english360_audio_registry";

function loadRegistry(): AudioRegistryItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveRegistry(items: AudioRegistryItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error("Failed to save audio registry:", e);
  }
}

// ============================================================
// Audio Registry
// ============================================================

export class AudioRegistry {
  private items: Map<string, AudioRegistryItem> = new Map();

  constructor() {
    this.load();
  }

  private load(): void {
    const items = loadRegistry();
    for (const item of items) {
      this.items.set(item.id, item);
    }
  }

  private save(): void {
    saveRegistry(Array.from(this.items.values()));
  }

  /**
   * Register a new audio item
   */
  register(item: Omit<AudioRegistryItem, "createdAt" | "updatedAt">): AudioRegistryItem {
    const now = Date.now();
    const newItem: AudioRegistryItem = {
      ...item,
      createdAt: now,
      updatedAt: now,
    };

    this.items.set(item.id, newItem);
    this.save();
    return newItem;
  }

  /**
   * Update audio item
   */
  update(id: string, updates: Partial<AudioRegistryItem>): AudioRegistryItem | null {
    const item = this.items.get(id);
    if (!item) return null;

    const updated: AudioRegistryItem = {
      ...item,
      ...updates,
      updatedAt: Date.now(),
    };

    this.items.set(id, updated);
    this.save();
    return updated;
  }

  /**
   * Get audio item by ID
   */
  get(id: string): AudioRegistryItem | undefined {
    return this.items.get(id);
  }

  /**
   * Get all audio items
   */
  getAll(): AudioRegistryItem[] {
    return Array.from(this.items.values());
  }

  /**
   * Get audio items by type
   */
  getByType(type: AudioContentType): AudioRegistryItem[] {
    return this.getAll().filter(item => item.type === type);
  }

  /**
   * Get audio items by level
   */
  getByLevel(level: AudioLevel): AudioRegistryItem[] {
    return this.getAll().filter(item => item.level === level);
  }

  /**
   * Get audio items by status
   */
  getByStatus(status: AudioStatus): AudioRegistryItem[] {
    return this.getAll().filter(item => item.status === status);
  }

  /**
   * Get stats
   */
  getStats(): AudioStats {
    const items = this.getAll();

    const byType: Record<AudioContentType, number> = {
      word: 0, sentence: 0, dialogue: 0, shadowing: 0,
    };
    const byLevel: Record<AudioLevel, number> = {
      A1: 0, A2: 0, B1: 0, B2: 0,
    };

    let ready = 0;
    let missing = 0;
    let error = 0;

    for (const item of items) {
      byType[item.type]++;
      byLevel[item.level]++;

      if (item.status === "ready") ready++;
      else if (item.status === "missing") missing++;
      else if (item.status === "error") error++;
    }

    return {
      total: items.length,
      ready,
      missing,
      error,
      byType,
      byLevel,
    };
  }

  /**
   * Delete audio item
   */
  delete(id: string): boolean {
    const deleted = this.items.delete(id);
    if (deleted) this.save();
    return deleted;
  }

  /**
   * Clear all items
   */
  clear(): void {
    this.items.clear();
    this.save();
  }
}

// ============================================================
// Audio Validator
// ============================================================

export class AudioValidator {
  /**
   * Validate audio item
   */
  validate(item: AudioRegistryItem): AudioValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check ID
    if (!item.id) {
      errors.push("Missing audio ID");
    }

    // Check text
    if (!item.text || item.text.trim() === "") {
      errors.push("Missing audio text");
    }

    // Check audio paths
    if (!item.normalAudio) {
      errors.push("Missing normal audio path");
    }

    if (!item.slowAudio) {
      warnings.push("Missing slow audio path");
    }

    // Check status
    if (item.status === "error") {
      errors.push("Audio has error status");
    }

    return {
      id: item.id,
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Validate all items
   */
  validateAll(items: AudioRegistryItem[]): AudioValidationResult[] {
    return items.map(item => this.validate(item));
  }
}

// ============================================================
// Audio Loader
// ============================================================

export class AudioLoader {
  private cache: Map<string, HTMLAudioElement> = new Map();

  /**
   * Load audio file
   */
  async load(path: string): Promise<HTMLAudioElement> {
    // Check cache
    if (this.cache.has(path)) {
      return this.cache.get(path)!;
    }

    return new Promise((resolve, reject) => {
      const audio = new Audio(path);

      audio.onloadeddata = () => {
        this.cache.set(path, audio);
        resolve(audio);
      };

      audio.onerror = () => {
        reject(new Error(`Failed to load audio: ${path}`));
      };

      audio.load();
    });
  }

  /**
   * Preload multiple audio files
   */
  async preload(paths: string[]): Promise<void> {
    const promises = paths.map(path => this.load(path).catch(() => {}));
    await Promise.all(promises);
  }

  /**
   * Check if audio is available
   */
  isAvailable(path: string): boolean {
    return this.cache.has(path);
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }
}

// ============================================================
// Audio Quality Checker
// ============================================================

export class AudioQualityChecker {
  /**
   * Check audio quality
   */
  async checkQuality(audio: HTMLAudioElement): Promise<{
    valid: boolean;
    duration: number;
    issues: string[];
  }> {
    const issues: string[] = [];
    let duration = 0;

    try {
      duration = audio.duration;

      // Check duration (words should be 0.5-3 seconds)
      if (duration < 0.3) {
        issues.push("Audio too short");
      }
      if (duration > 5) {
        issues.push("Audio too long");
      }
    } catch {
      issues.push("Cannot read audio duration");
    }

    return {
      valid: issues.length === 0,
      duration,
      issues,
    };
  }
}

// ============================================================
// Audio Management System
// ============================================================

export class AudioManagementSystem {
  registry: AudioRegistry;
  validator: AudioValidator;
  loader: AudioLoader;
  qualityChecker: AudioQualityChecker;

  constructor() {
    this.registry = new AudioRegistry();
    this.validator = new AudioValidator();
    this.loader = new AudioLoader();
    this.qualityChecker = new AudioQualityChecker();
  }

  /**
   * Get completion percentage by type
   */
  getCompletionByType(type: AudioContentType): { total: number; ready: number; percentage: number } {
    const items = this.registry.getByType(type);
    const ready = items.filter(i => i.status === "ready").length;
    return {
      total: items.length,
      ready,
      percentage: items.length > 0 ? Math.round((ready / items.length) * 100) : 0,
    };
  }

  /**
   * Get overall stats
   */
  getStats(): AudioStats & {
    completionPercentage: number;
    wordCompletion: number;
    sentenceCompletion: number;
    dialogueCompletion: number;
  } {
    const stats = this.registry.getStats();
    const wordStats = this.getCompletionByType("word");
    const sentenceStats = this.getCompletionByType("sentence");
    const dialogueStats = this.getCompletionByType("dialogue");

    return {
      ...stats,
      completionPercentage: stats.total > 0 ? Math.round((stats.ready / stats.total) * 100) : 0,
      wordCompletion: wordStats.percentage,
      sentenceCompletion: sentenceStats.percentage,
      dialogueCompletion: dialogueStats.percentage,
    };
  }
}

// ============================================================
// Factory Function
// ============================================================

export function createAudioManagementSystem(): AudioManagementSystem {
  return new AudioManagementSystem();
}

export default AudioManagementSystem;
