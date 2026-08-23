/**
 * Settings Engine
 *
 * Manages all user preferences and application settings.
 * Persists to IndexedDB via Dexie.
 *
 * Supports:
 * - Adaptive Mode (Auto / Manual)
 * - Intensity (Light / Standard / Intensive / Extreme)
 * - Strictness (Relaxed / Standard / Strict / Extreme)
 * - Study time (preset or custom)
 * - Chinese assist level
 * - Sound / microphone
 * - Target accent
 * - Interface language
 * - AI provider configuration (session-only)
 */

import { getDatabase } from "@/db";
import type {
  AdaptiveMode,
  IntensityLevel,
  StrictnessLevel,
  StudyDuration,
} from "@/types";

// ============================================================
// Settings Types
// ============================================================

export interface AppSettings {
  // Learning settings
  adaptiveMode: AdaptiveMode;
  intensity: IntensityLevel;
  strictness: StrictnessLevel;
  dailyTargetMinutes: StudyDuration;
  customMinutes: number;

  // Language support
  chineseAssistLevel: "full" | "moderate" | "minimal" | "immersive" | "auto";
  interfaceLanguage: "chinese" | "english" | "auto";

  // Audio
  soundEnabled: boolean;
  microphoneEnabled: boolean;
  targetAccent: "american" | "british" | "australian";

  // AI provider (session-only, never persisted to DB by default)
  aiConfigured: boolean;

  // UI preferences
  darkMode: "light" | "dark" | "system";
  showPinyin: boolean;
  showIPA: boolean;

  // PWA
  installPromptDismissed: boolean;

  // Version
  settingsVersion: number;
}

export const DEFAULT_SETTINGS: AppSettings = {
  adaptiveMode: "auto",
  intensity: "standard",
  strictness: "standard",
  dailyTargetMinutes: 60,
  customMinutes: 60,
  chineseAssistLevel: "auto",
  interfaceLanguage: "auto",
  soundEnabled: true,
  microphoneEnabled: false,
  targetAccent: "american",
  aiConfigured: false,
  darkMode: "light",
  showPinyin: true,
  showIPA: false,
  installPromptDismissed: false,
  settingsVersion: 1,
};

// ============================================================
// AI Provider Session Config (never persisted to DB)
// ============================================================

export interface AISessionConfig {
  baseUrl: string;
  apiKey: string; // Session-only, cleared on page close unless user opts in
  model: string;
  rememberKey: boolean; // User explicitly chose to persist
}

const AI_SESSION_KEY = "english360_ai_session";

// ============================================================
// Settings Engine Implementation
// ============================================================

export class SettingsEngine {
  /**
   * Get all settings (with defaults)
   */
  async getSettings(): Promise<AppSettings> {
    const db = getDatabase();
    const stored = await db.settings.get("app_settings");
    if (!stored) return { ...DEFAULT_SETTINGS };

    // Merge with defaults (in case of schema upgrade)
    return {
      ...DEFAULT_SETTINGS,
      ...(stored as unknown as AppSettings),
      settingsVersion: DEFAULT_SETTINGS.settingsVersion,
    };
  }

  /**
   * Update settings (partial update)
   */
  async updateSettings(updates: Partial<AppSettings>): Promise<AppSettings> {
    const db = getDatabase();
    const current = await this.getSettings();
    const updated = { ...current, ...updates };
    await db.settings.put({ key: "app_settings", ...updated });
    return updated;
  }

  /**
   * Reset settings to defaults
   */
  async resetSettings(): Promise<AppSettings> {
    const db = getDatabase();
    await db.settings.delete("app_settings");
    return { ...DEFAULT_SETTINGS };
  }

  /**
   * Get a specific setting
   */
  async get<K extends keyof AppSettings>(key: K): Promise<AppSettings[K]> {
    const settings = await this.getSettings();
    return settings[key];
  }

  /**
   * Set a specific setting
   */
  async set<K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K],
  ): Promise<void> {
    await this.updateSettings({ [key]: value } as Partial<AppSettings>);
  }

  /**
   * Validate settings combination and return warnings
   */
  validateSettings(settings: AppSettings): string[] {
    const warnings: string[] = [];

    if (settings.intensity === "extreme" && settings.dailyTargetMinutes === 30) {
      warnings.push("Extreme intensity with only 30 minutes may not be effective.");
    }

    if (settings.chineseAssistLevel === "immersive" && Number(settings.dailyTargetMinutes) < 60) {
      warnings.push("Immersive mode with less than 60 minutes may be too challenging.");
    }

    if (settings.strictness === "extreme" && settings.intensity === "light") {
      warnings.push("Extreme strictness with light intensity is unusual. Consider standard strictness.");
    }

    return warnings;
  }

  /**
   * Get recommended settings based on student profile
   */
  getRecommendedSettings(profile: {
    overallScore: number;
    dailyMinutes: number;
    isBeginner: boolean;
  }): Partial<AppSettings> {
    const recommendations: Partial<AppSettings> = {};

    if (profile.isBeginner) {
      recommendations.chineseAssistLevel = "full";
      recommendations.intensity = "standard";
      recommendations.strictness = "relaxed";
    } else if (profile.overallScore > 50) {
      recommendations.chineseAssistLevel = "minimal";
      recommendations.intensity = "intensive";
    }

    if (profile.dailyMinutes < 60) {
      recommendations.intensity = "light";
    } else if (profile.dailyMinutes > 180) {
      recommendations.intensity = "intensive";
    }

    return recommendations;
  }

  // ============================================================
  // AI Provider Session Management
  // ============================================================

  /**
   * Get AI session config (from sessionStorage, NOT IndexedDB)
   * This is the secure approach: keys live in sessionStorage by default.
   */
  getAISessionConfig(): AISessionConfig | null {
    try {
      const stored = sessionStorage.getItem(AI_SESSION_KEY);
      if (!stored) return null;
      return JSON.parse(stored) as AISessionConfig;
    } catch {
      return null;
    }
  }

  /**
   * Set AI session config
   * Stores in sessionStorage (cleared when browser closes).
   * If user opts to remember, also stores a flag in IndexedDB.
   */
  async setAISessionConfig(config: AISessionConfig): Promise<void> {
    // Always store in sessionStorage
    sessionStorage.setItem(AI_SESSION_KEY, JSON.stringify(config));

    // Update the flag in IndexedDB
    await this.updateSettings({ aiConfigured: true });

    // If user wants to remember, store in localStorage (persists across sessions)
    if (config.rememberKey) {
      localStorage.setItem(AI_SESSION_KEY, JSON.stringify(config));
    } else {
      localStorage.removeItem(AI_SESSION_KEY);
    }
  }

  /**
   * Clear AI session config
   */
  async clearAIConfig(): Promise<void> {
    sessionStorage.removeItem(AI_SESSION_KEY);
    localStorage.removeItem(AI_SESSION_KEY);
    await this.updateSettings({ aiConfigured: false });
  }

  /**
   * Restore AI config from localStorage if available
   * Called on app startup
   */
  restoreAIConfigFromStorage(): AISessionConfig | null {
    try {
      const stored = localStorage.getItem(AI_SESSION_KEY);
      if (!stored) return null;
      const config = JSON.parse(stored) as AISessionConfig;
      // Restore to sessionStorage for this session
      sessionStorage.setItem(AI_SESSION_KEY, stored);
      return config;
    } catch {
      return null;
    }
  }

  // ============================================================
  // Export / Import
  // ============================================================

  /**
   * Export settings (for data export)
   */
  async exportSettings(): Promise<AppSettings> {
    return this.getSettings();
  }

  /**
   * Import settings (from data import)
   */
  async importSettings(settings: AppSettings): Promise<AppSettings> {
    return this.updateSettings(settings);
  }
}
