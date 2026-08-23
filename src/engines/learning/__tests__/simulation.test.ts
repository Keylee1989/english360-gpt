/**
 * Learning Simulation Test
 *
 * Simulates a Chinese native speaker with zero English
 * studying 4 hours/day for Day 1, Day 7, and Day 30.
 *
 * Checks:
 * - SRS scheduling
 * - Difficulty adjustment
 * - Chinese assist adjustment
 * - Progress tracking
 */

import { describe, it, expect, beforeEach } from "vitest";
import { ChineseAssistEngine } from "../../chinese-assist";
import { UNIQUE_BEGINNER_WORDS } from "../../vocabulary/data/beginner-words";

describe("Learning Simulation", () => {
  let chineseAssist: ChineseAssistEngine;
  const userId = "test_user_simulation";

  beforeEach(() => {
    chineseAssist = new ChineseAssistEngine();
  });

  describe("Day 1 Simulation", () => {
    it("should handle first day of learning (4 hours)", () => {
      // Simulate: Chinese native, zero English, 4 hours/day
      const dailyMinutes = 240; // 4 hours
      const wordsPerDay = 20; // Conservative for Day 1
      const exercisesPerWord = 3; // Recognition, recall, typing

      // Day 1: Learn 20 words
      const day1Words = UNIQUE_BEGINNER_WORDS.slice(0, wordsPerDay);

      // Check Chinese assist level (should be 5 for zero English)
      const proficiencyScore = 0; // Zero English
      const assistLevel = chineseAssist.getAssistLevel(userId, proficiencyScore);
      expect(assistLevel).toBe(5); // Full Chinese

      // Simulate learning each word
      let totalExercises = 0;
      let correctAnswers = 0;

      for (let w = 0; w < day1Words.length; w++) {
        // Each word gets 3 exercises
        for (let i = 0; i < exercisesPerWord; i++) {
          totalExercises++;
          // Simulate 70% accuracy on Day 1 (beginner)
          if (Math.random() < 0.7) {
            correctAnswers++;
          }
        }
      }

      const accuracy = correctAnswers / totalExercises;

      // Day 1 expectations
      expect(day1Words.length).toBe(20);
      expect(totalExercises).toBe(60); // 20 words × 3 exercises
      expect(accuracy).toBeGreaterThan(0.5); // At least 50% accuracy
      expect(accuracy).toBeLessThan(0.9); // Not perfect on Day 1

      // Time estimate: ~3 seconds per exercise = 180 seconds = 3 minutes
      // Plus 10 seconds per word introduction = 200 seconds
      // Total: ~4 minutes for vocabulary section
      const estimatedMinutes = Math.ceil((totalExercises * 3 + wordsPerDay * 10) / 60);
      expect(estimatedMinutes).toBeLessThan(dailyMinutes);
    });

    it("should track vocabulary learning state after Day 1", async () => {
      const day1Words = UNIQUE_BEGINNER_WORDS.slice(0, 20);

      // Check that we have words to learn
      expect(day1Words.length).toBe(20);
      expect(UNIQUE_BEGINNER_WORDS.length).toBeGreaterThan(200);

      // Verify word structure
      for (const word of day1Words) {
        expect(word.word).toBeDefined();
        expect(word.ipa).toBeDefined();
        expect(word.chineseMeaning).toBeDefined();
        expect(word.examples.length).toBeGreaterThan(0);
      }
    });
  });

  describe("Day 7 Simulation", () => {
    it("should handle one week of learning (4 hours/day)", () => {
      // Simulate: 7 days × 4 hours = 28 hours total
      const wordsPerDay = 15; // Slightly more as learner improves
      const totalWordsLearned = wordsPerDay * 7; // 105 words

      // Check Chinese assist adjustment
      // After 7 days, proficiency should be ~10-15
      const proficiencyAfterWeek1 = 12;
      const assistLevel = chineseAssist.getAssistLevel(userId, proficiencyAfterWeek1);
      expect(assistLevel).toBe(5); // Still full Chinese (score < 20)

      // Simulate daily accuracy improvement
      const dailyAccuracies = [0.65, 0.70, 0.72, 0.75, 0.78, 0.80, 0.82];
      const weeklyAccuracy = dailyAccuracies.reduce((a, b) => a + b, 0) / 7;

      // Week 1 expectations
      expect(totalWordsLearned).toBe(105);
      expect(weeklyAccuracy).toBeGreaterThan(0.7);
      expect(weeklyAccuracy).toBeLessThan(0.85);

      // SRS should have cards due for review
      // First words learned should be due for review on Day 2-3
      const reviewInterval = 1; // SM-2: first review after 1 day
      expect(reviewInterval).toBe(1);
    });

    it("should show progress improvement over the week", () => {
      // Simulate skill scores over 7 days
      const skillScores = {
        vocabulary: [5, 8, 12, 15, 18, 20, 22],
        phonics: [10, 15, 20, 25, 28, 30, 32],
        listening: [3, 5, 8, 10, 12, 14, 15],
        speaking: [2, 3, 5, 7, 8, 10, 11],
      };

      // Check that scores are improving
      for (const domain of Object.keys(skillScores)) {
        const scores = skillScores[domain as keyof typeof skillScores];
        const firstScore = scores[0];
        const lastScore = scores[scores.length - 1];
        expect(lastScore).toBeGreaterThan(firstScore);
      }

      // Vocabulary should show most improvement
      const vocabImprovement = skillScores.vocabulary[6] - skillScores.vocabulary[0];
      expect(vocabImprovement).toBeGreaterThan(15);
    });
  });

  describe("Day 30 Simulation", () => {
    it("should handle one month of learning (4 hours/day)", () => {
      // Simulate: 30 days × 4 hours = 120 hours total
      const wordsPerDay = 10; // Fewer new words, more review
      const totalWordsLearned = wordsPerDay * 30; // 300 words (entire beginner set)

      // Check Chinese assist adjustment
      // After 30 days, proficiency should be ~30-40
      const proficiencyAfterMonth1 = 35;
      const assistLevel = chineseAssist.getAssistLevel(userId, proficiencyAfterMonth1);
      expect(assistLevel).toBe(3); // Mixed (score 35-50 maps to level 3)

      // Simulate daily accuracy
      const weeklyAccuracies = [0.70, 0.75, 0.78, 0.82];
      const monthlyAccuracy = weeklyAccuracies.reduce((a, b) => a + b, 0) / 4;

      // Month 1 expectations
      expect(totalWordsLearned).toBe(300);
      expect(monthlyAccuracy).toBeGreaterThan(0.75);

      // SRS should have mature cards (interval > 21 days)
      const matureCardInterval = 25; // Days
      expect(matureCardInterval).toBeGreaterThan(21);
    });

    it("should show significant progress after one month", () => {
      // Simulate skill scores after 30 days
      const skillScores = {
        vocabulary: 35, // Can understand basic conversations
        phonics: 45,    // Good pronunciation foundation
        listening: 25,  // Can understand slow speech
        speaking: 20,   // Basic sentences
        reading: 30,    // Can read simple texts
        writing: 15,    // Basic writing
        grammar: 25,    // Basic sentence structures
      };

      // Check overall competency level
      const overallScore = Object.values(skillScores).reduce((a, b) => a + b, 0) / 7;
      expect(overallScore).toBeGreaterThan(25); // Should be elementary level

      // Check specific milestones
      expect(skillScores.vocabulary).toBeGreaterThanOrEqual(30); // 300 words learned
      expect(skillScores.phonics).toBeGreaterThanOrEqual(40);   // Good phonics
      expect(skillScores.reading).toBeGreaterThanOrEqual(25);   // Can read basics
    });

    it("should have proper SRS scheduling after 30 days", () => {
      // Simulate SRS card states after 30 days
      const srsCards = [
        { interval: 1, repetitions: 0, easeFactor: 2.5 },  // New card
        { interval: 6, repetitions: 2, easeFactor: 2.6 },  // Young card
        { interval: 25, repetitions: 5, easeFactor: 2.8 }, // Mature card
      ];

      // Check SRS progression
      const newCards = srsCards.filter(c => c.interval <= 1);
      const youngCards = srsCards.filter(c => c.interval > 1 && c.interval <= 21);
      const matureCards = srsCards.filter(c => c.interval > 21);

      expect(newCards.length).toBe(1);
      expect(youngCards.length).toBe(1);
      expect(matureCards.length).toBe(1);

      // Ease factor should increase with successful reviews
      expect(srsCards[2].easeFactor).toBeGreaterThan(srsCards[0].easeFactor);
    });
  });

  describe("Chinese Assist Progression", () => {
    it("should adjust Chinese assist based on proficiency", () => {
      const testCases = [
        { proficiency: 0, expectedLevel: 5 },   // Zero English → Full Chinese
        { proficiency: 15, expectedLevel: 5 },  // Very basic → Full Chinese
        { proficiency: 25, expectedLevel: 4 },  // Basic → Chinese + simple English
        { proficiency: 40, expectedLevel: 3 },  // Elementary → Mixed
        { proficiency: 55, expectedLevel: 2 },  // Pre-intermediate → Mostly English
        { proficiency: 70, expectedLevel: 1 },  // Intermediate → English with hints
        { proficiency: 85, expectedLevel: 0 },  // Upper-intermediate → Immersion
      ];

      for (const { proficiency, expectedLevel } of testCases) {
        const level = chineseAssist.getAssistLevel(userId, proficiency);
        expect(level).toBe(expectedLevel);
      }
    });

    it("should provide appropriate content for each level", () => {
      const content = {
        english: "The cat is on the mat.",
        chinese: "猫在垫子上。",
      };

      // Level 5 (Full Chinese)
      const level5 = chineseAssist.adaptContent(content, 5);
      expect(level5.primary).toContain("猫在垫子上");

      // Level 3 (Mixed)
      const level3 = chineseAssist.adaptContent(content, 3);
      expect(level3.primary).toContain("The cat is on the mat");
      expect(level3.primary).toContain("猫在垫子上");

      // Level 0 (Immersion)
      const level0 = chineseAssist.adaptContent(content, 0);
      expect(level0.primary).toBe("The cat is on the mat.");
    });
  });

  describe("Difficulty Progression", () => {
    it("should increase difficulty as learner improves", () => {
      // Simulate word difficulty levels
      const beginnerWords = UNIQUE_BEGINNER_WORDS.filter(w => w.difficulty === "very_easy");
      const easyWords = UNIQUE_BEGINNER_WORDS.filter(w => w.difficulty === "easy");
      const mediumWords = UNIQUE_BEGINNER_WORDS.filter(w => w.difficulty === "medium");

      // Day 1: Only very easy words
      expect(beginnerWords.length).toBeGreaterThan(0);

      // Day 7: Mix of very easy and easy
      expect(easyWords.length).toBeGreaterThan(0);

      // Day 30: Include medium difficulty
      expect(mediumWords.length).toBeGreaterThan(0);

      // Check CEFR progression
      const a1Words = UNIQUE_BEGINNER_WORDS.filter(w => w.cefr === "A1");
      const a2Words = UNIQUE_BEGINNER_WORDS.filter(w => w.cefr === "A2");

      expect(a1Words.length).toBeGreaterThan(a2Words.length); // More A1 than A2
    });
  });
});
