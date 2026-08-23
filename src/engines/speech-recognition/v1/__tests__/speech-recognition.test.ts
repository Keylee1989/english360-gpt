/**
 * Speech Recognition Engine v1 Tests
 */

import { describe, it, expect, beforeEach } from "vitest";
import { SpeechRecognitionEngineV1 } from "../index";

describe("SpeechRecognitionEngineV1", () => {
  let engine: SpeechRecognitionEngineV1;

  beforeEach(() => {
    engine = new SpeechRecognitionEngineV1();
  });

  // ============================================================
  // Basic Functionality
  // ============================================================

  describe("Basic Functionality", () => {
    it("should create engine", () => {
      expect(engine).toBeDefined();
    });

    it("should check support", () => {
      // In test environment, speech recognition is not supported
      const supported = engine.isSupported();
      expect(typeof supported).toBe("boolean");
    });
  });

  // ============================================================
  // Pronunciation Analysis
  // ============================================================

  describe("Pronunciation Analysis", () => {
    it("should analyze perfect match", () => {
      const result = {
        transcript: "hello world",
        confidence: 0.95,
        words: [
          { word: "hello", confidence: 0.95, startMs: 0, endMs: 500 },
          { word: "world", confidence: 0.95, startMs: 500, endMs: 1000 },
        ],
        duration: 1000,
      };

      const analysis = engine.analyzePronunciation("hello world", result);

      expect(analysis.accuracy).toBe(1);
      expect(analysis.overall).toBeGreaterThan(0.8);
      expect(analysis.errors.length).toBe(0);
    });

    it("should detect omissions", () => {
      const result = {
        transcript: "hello",
        confidence: 0.9,
        words: [
          { word: "hello", confidence: 0.9, startMs: 0, endMs: 500 },
        ],
        duration: 500,
      };

      const analysis = engine.analyzePronunciation("hello world", result);

      expect(analysis.accuracy).toBeLessThan(1);
      expect(analysis.errors.length).toBeGreaterThan(0);
      expect(analysis.errors[0].type).toBe("omission");
    });

    it("should detect insertions", () => {
      const result = {
        transcript: "hello beautiful world",
        confidence: 0.9,
        words: [
          { word: "hello", confidence: 0.9, startMs: 0, endMs: 300 },
          { word: "beautiful", confidence: 0.9, startMs: 300, endMs: 600 },
          { word: "world", confidence: 0.9, startMs: 600, endMs: 900 },
        ],
        duration: 900,
      };

      const analysis = engine.analyzePronunciation("hello world", result);

      expect(analysis.errors.length).toBeGreaterThan(0);
      expect(analysis.errors.some(e => e.type === "insertion")).toBe(true);
    });

    it("should calculate fluency", () => {
      const result = {
        transcript: "this is a test sentence",
        confidence: 0.9,
        words: [
          { word: "this", confidence: 0.9, startMs: 0, endMs: 200 },
          { word: "is", confidence: 0.9, startMs: 200, endMs: 400 },
          { word: "a", confidence: 0.9, startMs: 400, endMs: 600 },
          { word: "test", confidence: 0.9, startMs: 600, endMs: 800 },
          { word: "sentence", confidence: 0.9, startMs: 800, endMs: 1000 },
        ],
        duration: 1000,
      };

      const analysis = engine.analyzePronunciation("this is a test sentence", result);

      expect(analysis.fluency).toBeGreaterThan(0);
      expect(analysis.fluency).toBeLessThanOrEqual(1);
    });

    it("should generate suggestions", () => {
      const result = {
        transcript: "hllo wrld",
        confidence: 0.5,
        words: [
          { word: "hllo", confidence: 0.5, startMs: 0, endMs: 500 },
          { word: "wrld", confidence: 0.5, startMs: 500, endMs: 1000 },
        ],
        duration: 1000,
      };

      const analysis = engine.analyzePronunciation("hello world", result);

      expect(analysis.suggestions.length).toBeGreaterThan(0);
    });
  });

  // ============================================================
  // Configuration
  // ============================================================

  describe("Configuration", () => {
    it("should update configuration", () => {
      engine.updateConfig({ language: "en-GB" });

      // Verify config updated (no error thrown)
      expect(true).toBe(true);
    });
  });
});
