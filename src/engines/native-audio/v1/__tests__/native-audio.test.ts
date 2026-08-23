/**
 * Tests for Native Audio Engine v1
 */

import { describe, it, expect, beforeEach } from "vitest";
import { 
  NativeAudioEngineV1, 
  MockNativeAudioProvider,
  NATIVE_AUDIO_DATABASE 
} from "../index";

describe("NativeAudioEngineV1", () => {
  let engine: NativeAudioEngineV1;

  beforeEach(() => {
    engine = new NativeAudioEngineV1();
    engine.registerProvider(new MockNativeAudioProvider());
  });

  describe("Audio Database", () => {
    it("should have audio units in database", () => {
      expect(NATIVE_AUDIO_DATABASE.length).toBeGreaterThan(0);
    });

    it("should get audio unit by ID", () => {
      const unit = engine.getAudioUnit("greet_hello");
      expect(unit).toBeDefined();
      expect(unit?.text).toBe("Hello");
      expect(unit?.translationChinese).toBe("你好");
    });

    it("should get audio units by tag", () => {
      const greetingUnits = engine.getAudioUnitsByTag("greeting");
      expect(greetingUnits.length).toBeGreaterThan(0);
      expect(greetingUnits.every(u => u.tags?.includes("greeting"))).toBe(true);
    });

    it("should get audio units by difficulty", () => {
      const beginnerUnits = engine.getAudioUnitsByDifficulty("beginner");
      expect(beginnerUnits.length).toBeGreaterThan(0);
      expect(beginnerUnits.every(u => u.difficulty === "beginner")).toBe(true);
    });
  });

  describe("Search", () => {
    it("should search audio units by text", () => {
      const results = engine.searchAudioUnits("Hello");
      expect(results.length).toBeGreaterThan(0);
      expect(results.some(r => r.text === "Hello")).toBe(true);
    });

    it("should search audio units by Chinese", () => {
      const results = engine.searchAudioUnits("你好");
      expect(results.length).toBeGreaterThan(0);
    });
  });

  describe("Audio Generation", () => {
    it("should generate audio for word", async () => {
      const result = await engine.generateAudio("Hello", "word", "american", "slow");
      expect(result).toBeDefined();
      expect(result.text).toBe("Hello");
      expect(result.type).toBe("word");
      expect(result.accent).toBe("american");
      expect(result.speed).toBe("slow");
      expect(result.provider).toBe("mock_native");
    });

    it("should generate audio for sentence", async () => {
      const result = await engine.generateAudio("How are you?", "sentence", "american", "normal");
      expect(result).toBeDefined();
      expect(result.text).toBe("How are you?");
      expect(result.type).toBe("sentence");
    });

    it("should cache audio results", async () => {
      const result1 = await engine.generateAudio("Hello", "word", "american", "slow");
      const result2 = await engine.generateAudio("Hello", "word", "american", "slow");
      expect(result1.id).toBe(result2.id);
      expect(result2.fromCache).toBe(true);
    });
  });

  describe("Shadowing Points", () => {
    it("should get shadowing points for text", () => {
      const points = engine.getShadowingPoints("Hello");
      expect(points).toBeDefined();
      expect(Array.isArray(points)).toBe(true);
    });
  });

  describe("Custom Audio Units", () => {
    it("should add custom audio unit", () => {
      const customUnit = {
        id: "custom_test",
        text: "Custom",
        translationChinese: "自定义",
        accent: "american" as const,
        speed: "slow" as const,
        difficulty: "beginner" as const,
        type: "word" as const,
      };

      engine.addAudioUnit(customUnit);
      const retrieved = engine.getAudioUnit("custom_test");
      expect(retrieved).toBeDefined();
      expect(retrieved?.text).toBe("Custom");
    });
  });

  describe("Cache Management", () => {
    it("should track cache size", async () => {
      const initialSize = engine.getCacheSize();
      await engine.generateAudio("Hello", "word");
      expect(engine.getCacheSize()).toBe(initialSize + 1);
    });

    it("should clear cache", async () => {
      await engine.generateAudio("Hello", "word");
      engine.clearCache();
      expect(engine.getCacheSize()).toBe(0);
    });
  });

  describe("Mock Provider", () => {
    it("should be available", () => {
      const provider = new MockNativeAudioProvider();
      expect(provider.isAvailable()).toBe(true);
    });

    it("should support all accents", () => {
      const provider = new MockNativeAudioProvider();
      expect(provider.supportsAccent("american")).toBe(true);
      expect(provider.supportsAccent("british")).toBe(true);
    });

    it("should support offline", () => {
      const provider = new MockNativeAudioProvider();
      expect(provider.supportsOffline()).toBe(true);
    });
  });
});
