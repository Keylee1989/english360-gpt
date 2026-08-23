import { describe, it, expect, beforeEach } from "vitest";
import { SettingsEngine, DEFAULT_SETTINGS } from "../index";
import { getDatabase } from "@/db";

describe("SettingsEngine", () => {
  let engine: SettingsEngine;

  beforeEach(async () => {
    engine = new SettingsEngine();
    const db = getDatabase();
    await db.settings.clear();
    // Clear session storage
    sessionStorage.clear();
    localStorage.clear();
  });

  describe("getSettings", () => {
    it("should return defaults when no settings exist", async () => {
      const settings = await engine.getSettings();
      expect(settings).toEqual(DEFAULT_SETTINGS);
    });

    it("should return stored settings", async () => {
      await engine.updateSettings({ intensity: "intensive" });
      const settings = await engine.getSettings();
      expect(settings.intensity).toBe("intensive");
    });
  });

  describe("updateSettings", () => {
    it("should update settings partially", async () => {
      const updated = await engine.updateSettings({
        intensity: "extreme",
        strictness: "strict",
      });

      expect(updated.intensity).toBe("extreme");
      expect(updated.strictness).toBe("strict");
      // Other settings should remain default
      expect(updated.adaptiveMode).toBe("auto");
    });

    it("should persist settings across calls", async () => {
      await engine.updateSettings({ dailyTargetMinutes: 120 });
      const settings = await engine.getSettings();
      expect(settings.dailyTargetMinutes).toBe(120);
    });
  });

  describe("get/set specific setting", () => {
    it("should get a specific setting", async () => {
      const intensity = await engine.get("intensity");
      expect(intensity).toBe("standard");
    });

    it("should set a specific setting", async () => {
      await engine.set("soundEnabled", false);
      const enabled = await engine.get("soundEnabled");
      expect(enabled).toBe(false);
    });
  });

  describe("validateSettings", () => {
    it("should warn about extreme intensity with low time", async () => {
      const warnings = engine.validateSettings({
        ...DEFAULT_SETTINGS,
        intensity: "extreme",
        dailyTargetMinutes: 30,
      });
      expect(warnings.length).toBeGreaterThan(0);
    });

    it("should warn about immersive mode with low time", async () => {
      const warnings = engine.validateSettings({
        ...DEFAULT_SETTINGS,
        chineseAssistLevel: "immersive",
        dailyTargetMinutes: 30,
      });
      expect(warnings.length).toBeGreaterThan(0);
    });

    it("should return no warnings for standard settings", async () => {
      const warnings = engine.validateSettings(DEFAULT_SETTINGS);
      expect(warnings.length).toBe(0);
    });
  });

  describe("resetSettings", () => {
    it("should reset to defaults", async () => {
      await engine.updateSettings({ intensity: "extreme" });
      await engine.resetSettings();
      const settings = await engine.getSettings();
      expect(settings.intensity).toBe("standard");
    });
  });

  describe("AI session config", () => {
    it("should store AI config in session storage", async () => {
      await engine.setAISessionConfig({
        baseUrl: "https://api.openai.com/v1",
        apiKey: "test-key",
        model: "gpt-4o-mini",
        rememberKey: false,
      });

      const config = engine.getAISessionConfig();
      expect(config).not.toBeNull();
      expect(config?.baseUrl).toBe("https://api.openai.com/v1");
      expect(config?.model).toBe("gpt-4o-mini");
    });

    it("should not persist to localStorage by default", async () => {
      await engine.setAISessionConfig({
        baseUrl: "https://api.openai.com/v1",
        apiKey: "test-key",
        model: "gpt-4o-mini",
        rememberKey: false,
      });

      const stored = localStorage.getItem("english360_ai_session");
      expect(stored).toBeNull();
    });

    it("should persist to localStorage when rememberKey is true", async () => {
      await engine.setAISessionConfig({
        baseUrl: "https://api.openai.com/v1",
        apiKey: "test-key",
        model: "gpt-4o-mini",
        rememberKey: true,
      });

      const stored = localStorage.getItem("english360_ai_session");
      expect(stored).not.toBeNull();
    });

    it("should clear AI config", async () => {
      await engine.setAISessionConfig({
        baseUrl: "https://api.openai.com/v1",
        apiKey: "test-key",
        model: "gpt-4o-mini",
        rememberKey: true,
      });

      await engine.clearAIConfig();
      const config = engine.getAISessionConfig();
      expect(config).toBeNull();
      expect(localStorage.getItem("english360_ai_session")).toBeNull();
    });
  });

  describe("getRecommendedSettings", () => {
    it("should recommend full Chinese assist for beginners", async () => {
      const recs = engine.getRecommendedSettings({
        overallScore: 5,
        dailyMinutes: 60,
        isBeginner: true,
      });

      expect(recs.chineseAssistLevel).toBe("full");
      expect(recs.intensity).toBe("standard");
      expect(recs.strictness).toBe("relaxed");
    });

    it("should recommend minimal Chinese assist for advanced", async () => {
      const recs = engine.getRecommendedSettings({
        overallScore: 60,
        dailyMinutes: 120,
        isBeginner: false,
      });

      expect(recs.chineseAssistLevel).toBe("minimal");
    });

    it("should recommend light intensity for short sessions", async () => {
      const recs = engine.getRecommendedSettings({
        overallScore: 30,
        dailyMinutes: 30,
        isBeginner: false,
      });

      expect(recs.intensity).toBe("light");
    });
  });
});
