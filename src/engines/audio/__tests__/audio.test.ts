/**
 * Audio Engine Tests
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { AudioEngine } from "../index";

// Mock Web Speech API
const mockSpeechSynthesis = {
  speak: vi.fn(),
  cancel: vi.fn(),
  pause: vi.fn(),
  resume: vi.fn(),
  getVoices: vi.fn(() => []),
  speaking: false,
  paused: false,
};

Object.defineProperty(window, "speechSynthesis", {
  value: mockSpeechSynthesis,
  writable: true,
});

describe("AudioEngine", () => {
  let engine: AudioEngine;

  beforeEach(() => {
    vi.clearAllMocks();
    engine = new AudioEngine();
  });

  describe("isAvailable", () => {
    it("should return true when Web Speech API is available", () => {
      expect(engine.isAvailable()).toBe(true);
    });
  });

  describe("getSupportedFeatures", () => {
    it("should return supported features", () => {
      const features = engine.getSupportedFeatures();
      expect(features.tts).toBe(true);
    });
  });

  describe("setSpeed", () => {
    it("should update default speed", () => {
      engine.setSpeed(1.2);
      const config = engine.getDefaultConfig();
      expect(config.rate).toBe(1.2);
    });

    it("should clamp speed to valid range", () => {
      engine.setSpeed(15); // Too fast
      const config = engine.getDefaultConfig();
      expect(config.rate).toBe(10); // Max

      engine.setSpeed(0.01); // Too slow
      const config2 = engine.getDefaultConfig();
      expect(config2.rate).toBe(0.1); // Min
    });
  });

  describe("getVoicesForAccent", () => {
    it("should return empty array when no voices available", () => {
      const voices = engine.getVoicesForAccent("american");
      expect(voices).toEqual([]);
    });
  });

  describe("clearCache", () => {
    it("should clear audio cache", () => {
      engine.clearCache();
      expect(engine.isCached("test")).toBe(false);
    });
  });

  describe("isCached", () => {
    it("should return false for non-cached text", () => {
      expect(engine.isCached("hello")).toBe(false);
    });
  });
});
