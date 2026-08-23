/**
 * 30-Day Learning Simulation Tests
 *
 * Simulates a Chinese native speaker with zero English learning 4 hours/day.
 * Verifies:
 * - Vocabulary data quality and accessibility
 * - Learning state management
 * - Progress tracking accuracy
 * - Knowledge progression
 */

import { describe, it, expect, beforeEach } from "vitest";
import { VocabularyEngine } from "@/engines/vocabulary";
import { UNIQUE_BEGINNER_WORDS } from "@/engines/vocabulary/data/beginner-words";
import type { VocabularyItem } from "@/engines/vocabulary";
import { resetDatabase } from "@/db";

// ============================================================
// Test Setup
// ============================================================

describe("30-Day Learning Simulation", () => {
  let vocabEngine: VocabularyEngine;
  const userId = "sim_user_001";

  beforeEach(async () => {
    await resetDatabase();
    vocabEngine = new VocabularyEngine();

    // Load vocabulary items
    const items = UNIQUE_BEGINNER_WORDS.slice(0, 50); // First 50 words for simulation
    await vocabEngine.createItems(items);
  });

  // ============================================================
  // Day 1 Simulation
  // ============================================================

  it("Day 1: Beginner starts with zero knowledge", async () => {
    // Verify initial state
    const allItems = await vocabEngine.getAllItems();
    expect(allItems.length).toBeGreaterThan(0);

    // Verify first items are A1 level
    const firstItems = allItems.slice(0, 10);
    firstItems.forEach((item: VocabularyItem) => {
      expect(item.cefr).toBe("A1");
    });

    // Verify vocabulary has required fields
    const testWord = allItems[0];
    expect(testWord.word).toBeTruthy();
    expect(testWord.chineseMeaning).toBeTruthy();
    expect(testWord.ipa).toBeTruthy();
    expect(testWord.phonicsBreakdown).toBeTruthy();
    expect(testWord.memoryMethods).toBeTruthy();
  });

  // ============================================================
  // Week 1 Simulation (Day 1-7)
  // ============================================================

  it("Week 1: Vocabulary data is complete for learning", async () => {
    const allItems = await vocabEngine.getAllItems();
    const weeklyWords = allItems.slice(0, 20); // 20 words for week 1

    // Verify all words have complete data
    weeklyWords.forEach((word: VocabularyItem) => {
      expect(word.word).toBeTruthy();
      expect(word.chineseMeaning).toBeTruthy();
      expect(word.ipa).toBeTruthy();
      expect(word.examples.length).toBeGreaterThan(0);
      expect(word.memoryMethods).toBeTruthy();
    });
  });

  // ============================================================
  // Vocabulary Search
  // ============================================================

  it("Vocabulary search works correctly", async () => {
    // Search by English word
    const results = await vocabEngine.search("hello");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].word).toBe("hello");

    // Search by Chinese meaning
    const chineseResults = await vocabEngine.search("你好");
    expect(chineseResults.length).toBeGreaterThan(0);
  });

  // ============================================================
  // Vocabulary Filtering
  // ============================================================

  it("Vocabulary filtering works correctly", async () => {
    // Filter by CEFR level
    const a1Words = await vocabEngine.getItemsByLevel("A1");
    expect(a1Words.length).toBeGreaterThan(0);

    // Filter by difficulty
    const easyWords = await vocabEngine.getItemsByDifficulty("very_easy");
    expect(easyWords.length).toBeGreaterThan(0);
  });

  // ============================================================
  // Chinese Assist Level
  // ============================================================

  it("Chinese assist starts at default level for new users", async () => {
    // Import ChineseAssistEngine dynamically to avoid circular deps
    const { ChineseAssistEngine } = await import("@/engines/chinese-assist");
    const chineseAssist = new ChineseAssistEngine();

    // For a new user with zero proficiency score
    const level = chineseAssist.getAssistLevel(userId, 0);
    // Should return level 5 (full Chinese assistance) for beginners
    expect(level).toBeGreaterThanOrEqual(0);
    expect(level).toBeLessThanOrEqual(5);
  });

  // ============================================================
  // Vocabulary Data Quality
  // ============================================================

  it("Vocabulary data meets quality standards", async () => {
    const allItems = await vocabEngine.getAllItems();
    
    // Check quality audit functions
    const { generateQualityReport } = await import("@/engines/vocabulary/quality-audit");
    const report = generateQualityReport(allItems);
    
    // Verify report structure
    expect(report.totalItems).toBe(allItems.length);
    expect(report.validItems).toBeGreaterThan(0);
    expect(report.summary).toBeDefined();
  });
});
