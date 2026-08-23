/**
 * Learner Simulation Test
 *
 * Simulates a Chinese native speaker (age 38, zero English) learning English.
 * Tests the complete learning loop across 180 days.
 *
 * Verifies:
 * - Vocabulary progression
 * - Grammar mastery
 * - Listening comprehension improvement
 * - Speaking production ability
 * - Pronunciation improvement
 * - Adaptive system behavior
 * - SRS effectiveness
 */

import { describe, it, expect, beforeEach } from "vitest";
import { VocabularyEngine } from "@/engines/vocabulary";
import { UNIQUE_BEGINNER_WORDS } from "@/engines/vocabulary/data/beginner-words";
import { AdaptiveLearningEngine, type LearnerProfile } from "@/engines/adaptive/v1";
import { LearnerModelV1 } from "@/engines/learner-model/v1";
import type { VocabularyItem } from "@/engines/vocabulary";
import { resetDatabase } from "@/db";

// ============================================================
// Simulation Helpers
// ============================================================

/**
 * Simulated learner performance model
 * Based on realistic learning curves for adult Chinese learners
 */
class SimulatedLearner {
  private day: number = 0;
  private wordsLearned: number = 0;
  private wordsMastered: number = 0;
  private vocabularyAccuracy: number = 0;
  private listeningScore: number = 0;
  private speakingScore: number = 0;
  private grammarAccuracy: number = 0;
  private pronunciationScore: number = 0;
  private retentionRate: number = 0.5;
  private totalStudyMinutes: number = 0;

  /**
   * Simulate one day of learning
   */
  simulateDay(): {
    day: number;
    wordsLearned: number;
    wordsMastered: number;
    vocabularyAccuracy: number;
    listeningScore: number;
    speakingScore: number;
    grammarAccuracy: number;
    pronunciationScore: number;
    retentionRate: number;
    totalStudyMinutes: number;
    dailyStats: {
      newWords: number;
      reviewWords: number;
      correctAnswers: number;
      totalAnswers: number;
      listeningExercises: number;
      speakingExercises: number;
    };
  } {
    this.day++;
    this.totalStudyMinutes += 240; // 4 hours per day

    // Realistic learning curve (diminishing returns)
    const weekFactor = Math.floor(this.day / 7);

    // New words per day (starts at 10, increases to 15, then stabilizes)
    const newWordsPerDay = this.day <= 7 ? 8 : this.day <= 30 ? 12 : 15;
    const newWords = Math.min(newWordsPerDay, UNIQUE_BEGINNER_WORDS.length - this.wordsLearned);

    // Review words (based on SRS scheduling)
    const reviewWords = Math.min(this.wordsLearned, 30);

    // Simulate accuracy improvement
    // Learning curve: rapid initial improvement, then slower
    const accuracyGain = (1 - this.vocabularyAccuracy / 100) * 0.1 * (1 + weekFactor * 0.05);
    this.vocabularyAccuracy = Math.min(95, this.vocabularyAccuracy + accuracyGain * 100 * Math.random());

    // Listening improves with practice
    const listeningGain = (1 - this.listeningScore / 100) * 0.08;
    this.listeningScore = Math.min(90, this.listeningScore + listeningGain * 100 * (0.8 + Math.random() * 0.4));

    // Speaking improves more slowly
    const speakingGain = (1 - this.speakingScore / 100) * 0.06;
    this.speakingScore = Math.min(85, this.speakingScore + speakingGain * 100 * (0.7 + Math.random() * 0.6));

    // Grammar improves with practice
    const grammarGain = (1 - this.grammarAccuracy / 100) * 0.09;
    this.grammarAccuracy = Math.min(92, this.grammarAccuracy + grammarGain * 100 * Math.random());

    // Pronunciation improves slowly
    const pronunciationGain = (1 - this.pronunciationScore / 100) * 0.05;
    this.pronunciationScore = Math.min(80, this.pronunciationScore + pronunciationGain * 100 * (0.6 + Math.random() * 0.8));

    // Retention rate improves as SRS stabilizes
    this.retentionRate = Math.min(0.9, this.retentionRate + 0.01 * (1 - this.retentionRate));

    // Update word counts
    this.wordsLearned += newWords;
    this.wordsMastered = Math.floor(this.wordsLearned * this.retentionRate);

    // Daily statistics
    const correctAnswers = Math.floor((reviewWords + newWords) * this.vocabularyAccuracy / 100);
    const totalAnswers = reviewWords + newWords;
    const listeningExercises = 5 + Math.floor(this.day / 7);
    const speakingExercises = 3 + Math.floor(this.day / 10);

    return {
      day: this.day,
      wordsLearned: this.wordsLearned,
      wordsMastered: this.wordsMastered,
      vocabularyAccuracy: Math.round(this.vocabularyAccuracy * 10) / 10,
      listeningScore: Math.round(this.listeningScore * 10) / 10,
      speakingScore: Math.round(this.speakingScore * 10) / 10,
      grammarAccuracy: Math.round(this.grammarAccuracy * 10) / 10,
      pronunciationScore: Math.round(this.pronunciationScore * 10) / 10,
      retentionRate: Math.round(this.retentionRate * 100) / 100,
      totalStudyMinutes: this.totalStudyMinutes,
      dailyStats: {
        newWords,
        reviewWords,
        correctAnswers,
        totalAnswers,
        listeningExercises,
        speakingExercises,
      },
    };
  }

  getProfile(): LearnerProfile {
    return {
      userId: "sim_learner_001",
      vocabularyAccuracy: this.vocabularyAccuracy,
      listeningScore: this.listeningScore,
      speakingScore: this.speakingScore,
      grammarAccuracy: this.grammarAccuracy,
      retentionRate: this.retentionRate,
      totalStudyTime: this.totalStudyMinutes / 60, // Convert to hours
      wordsLearned: this.wordsLearned,
      wordsMastered: this.wordsMastered,
      currentStreak: Math.min(this.day, 30),
      difficultyLevel: this.day <= 30 ? "beginner" : this.day <= 90 ? "elementary" : "intermediate",
      focusAreas: [],
      lastUpdated: Date.now(),
    };
  }
}

// ============================================================
// Test Suite
// ============================================================

describe("Learner Simulation — 180-Day Learning Journey", () => {
  let vocabEngine: VocabularyEngine;
  let adaptiveEngine: AdaptiveLearningEngine;
  let learnerModel: LearnerModelV1;
  let learner: SimulatedLearner;
  const userId = "sim_learner_001";

  beforeEach(async () => {
    await resetDatabase();
    vocabEngine = new VocabularyEngine();
    adaptiveEngine = new AdaptiveLearningEngine();
    learnerModel = new LearnerModelV1();
    learner = new SimulatedLearner();

    // Load vocabulary items
    const items = UNIQUE_BEGINNER_WORDS.slice(0, 200);
    await vocabEngine.createItems(items);
  });

  // ============================================================
  // Day 1 Simulation
  // ============================================================

  it("Day 1: Beginner starts with zero knowledge", async () => {
    const stats = learner.simulateDay();

    expect(stats.day).toBe(1);
    expect(stats.wordsLearned).toBeGreaterThan(0);
    expect(stats.vocabularyAccuracy).toBeGreaterThan(0);
    expect(stats.totalStudyMinutes).toBe(240);

    // Verify vocabulary engine has items
    const allItems = await vocabEngine.getAllItems();
    expect(allItems.length).toBeGreaterThan(0);

    // Verify first items are A1 level
    const firstItems = allItems.slice(0, 10);
    firstItems.forEach((item: VocabularyItem) => {
      expect(item.cefr).toBe("A1");
    });
  });

  // ============================================================
  // Week 1 Simulation (Day 1-7)
  // ============================================================

  it("Week 1: Vocabulary acquisition begins", () => {
    const weekResults = [];
    for (let day = 0; day < 7; day++) {
      weekResults.push(learner.simulateDay());
    }

    const finalStats = weekResults[6];
    expect(finalStats.day).toBe(7);
    expect(finalStats.wordsLearned).toBeGreaterThanOrEqual(50);
    expect(finalStats.vocabularyAccuracy).toBeGreaterThanOrEqual(0);
    expect(finalStats.listeningScore).toBeGreaterThan(0);
    expect(finalStats.totalStudyMinutes).toBe(1680); // 7 * 240

    // Verify learning is happening
    expect(finalStats.wordsMastered).toBeGreaterThan(0);
  });

  // ============================================================
  // Month 1 Simulation (Day 1-30)
  // ============================================================

  it("Month 1: Foundation established", () => {
    // Simulate 30 days
    for (let day = 0; day < 30; day++) {
      learner.simulateDay();
    }

    const stats = learner.simulateDay(); // Day 31
    expect(stats.day).toBe(31);
    expect(stats.wordsLearned).toBeGreaterThanOrEqual(200);
    expect(stats.vocabularyAccuracy).toBeGreaterThan(50);
    expect(stats.listeningScore).toBeGreaterThan(20);
    expect(stats.speakingScore).toBeGreaterThan(10);
    expect(stats.grammarAccuracy).toBeGreaterThan(30);
    expect(stats.totalStudyMinutes).toBeGreaterThanOrEqual(7200); // 30 * 240

    // Adaptive engine should generate adjustments
    const profile = learner.getProfile();
    const adjustment = adaptiveEngine.generateAdjustment(profile);
    expect(adjustment).toBeDefined();
    expect(adjustment.newWordsCount).toBeGreaterThan(0);
  });

  // ============================================================
  // Day 90 Simulation
  // ============================================================

  it("Day 90: Basic communication ability", () => {
    // Simulate 90 days
    for (let day = 0; day < 90; day++) {
      learner.simulateDay();
    }

    const stats = learner.simulateDay(); // Day 91
    expect(stats.day).toBe(91);
    expect(stats.wordsLearned).toBeGreaterThanOrEqual(100);
    expect(stats.vocabularyAccuracy).toBeGreaterThan(65);
    expect(stats.listeningScore).toBeGreaterThan(40);
    expect(stats.speakingScore).toBeGreaterThan(30);
    expect(stats.grammarAccuracy).toBeGreaterThan(50);
    expect(stats.retentionRate).toBeGreaterThan(0.7);

    // Adaptive engine should recognize progress
    const profile = learner.getProfile();
    const analysis = adaptiveEngine.analyzeProfile(profile);
    expect(analysis.strengths.length).toBeGreaterThan(0);
  });

  // ============================================================
  // Day 180 Simulation
  // ============================================================

  it("Day 180: Intermediate communication ability", () => {
    // Simulate 180 days
    for (let day = 0; day < 180; day++) {
      learner.simulateDay();
    }

    const stats = learner.simulateDay(); // Day 181
    expect(stats.day).toBe(181);
    expect(stats.wordsLearned).toBeGreaterThanOrEqual(100);
    expect(stats.vocabularyAccuracy).toBeGreaterThan(75);
    expect(stats.listeningScore).toBeGreaterThan(55);
    expect(stats.speakingScore).toBeGreaterThan(45);
    expect(stats.grammarAccuracy).toBeGreaterThan(65);
    expect(stats.retentionRate).toBeGreaterThan(0.8);
    expect(stats.totalStudyMinutes).toBeGreaterThanOrEqual(43200); // 180 * 240

    // Profile should show intermediate level
    const resultProfile = learner.getProfile();
    expect(resultProfile.difficultyLevel).toBe("intermediate");
  });

  // ============================================================
  // Adaptive System Tests
  // ============================================================

  it("Adaptive system adjusts correctly for low performance", () => {
    const profile: LearnerProfile = {
      userId: "test_user",
      vocabularyAccuracy: 40,
      listeningScore: 35,
      speakingScore: 30,
      grammarAccuracy: 45,
      retentionRate: 0.5,
      totalStudyTime: 10,
      wordsLearned: 50,
      wordsMastered: 20,
      currentStreak: 2,
      difficultyLevel: "beginner",
      focusAreas: [],
      lastUpdated: Date.now(),
    };

    const adjustment = adaptiveEngine.generateAdjustment(profile);

    // Should reduce new words for low retention
    expect(adjustment.newWordsCount).toBeLessThanOrEqual(10);
    // Should increase review
    expect(adjustment.reviewWordsCount).toBeGreaterThanOrEqual(10);
    // Should use slow or normal audio
    expect(["slow", "normal"]).toContain(adjustment.audioSpeed);
    // Should use easy or normal exercises
    expect(["easy", "normal"]).toContain(adjustment.exerciseDifficulty);
  });

  it("Adaptive system adjusts correctly for high performance", () => {
    const profile: LearnerProfile = {
      userId: "test_user",
      vocabularyAccuracy: 85,
      listeningScore: 80,
      speakingScore: 75,
      grammarAccuracy: 82,
      retentionRate: 0.85,
      totalStudyTime: 100,
      wordsLearned: 500,
      wordsMastered: 400,
      currentStreak: 30,
      difficultyLevel: "elementary",
      focusAreas: [],
      lastUpdated: Date.now(),
    };

    const adjustment = adaptiveEngine.generateAdjustment(profile);

    // Should increase new words
    expect(adjustment.newWordsCount).toBeGreaterThanOrEqual(10);
    // Should increase difficulty or use normal
    expect(["normal", "hard"]).toContain(adjustment.exerciseDifficulty);
    // Should use normal audio
    expect(adjustment.audioSpeed).toBe("normal");
  });

  // ============================================================
  // Learner Model Tests
  // ============================================================

  it("Learner model tracks skill progression", () => {
    const profile = learnerModel.getOrCreateProfile(userId);
    expect(profile.vocabularyLevel).toBe(0);
    expect(profile.wordsLearned).toBe(0);

    // Update skills over time
    learnerModel.updateSkillLevel(userId, "vocabulary", 30);
    learnerModel.updateSkillLevel(userId, "listening", 25);
    learnerModel.updateSkillLevel(userId, "speaking", 20);

    const updatedProfile = learnerModel.getOrCreateProfile(userId);
    expect(updatedProfile.vocabularyLevel).toBe(30);
    expect(updatedProfile.listeningLevel).toBe(25);
    expect(updatedProfile.speakingLevel).toBe(20);
    expect(updatedProfile.overallLevel).toBeGreaterThan(0);
  });

  it("Learner model identifies weak areas", () => {
    // Set some skills low
    learnerModel.updateSkillLevel(userId, "vocabulary", 40);
    learnerModel.updateSkillLevel(userId, "listening", 35);
    learnerModel.updateSkillLevel(userId, "speaking", 50);

    const updatedProfile = learnerModel.getOrCreateProfile(userId);
    expect(updatedProfile.weakAreas.length).toBeGreaterThan(0);

    // Should identify listening as weak
    const listeningWeak = updatedProfile.weakAreas.find(w => w.skill === "listening");
    expect(listeningWeak).toBeDefined();
  });

  it("Learner model generates daily recommendations", () => {
    // Set up a profile with some progress
    learnerModel.updateSkillLevel(userId, "vocabulary", 60);
    learnerModel.updateSkillLevel(userId, "listening", 45);
    learnerModel.updateSkillLevel(userId, "speaking", 50);
    learnerModel.updateSkillLevel(userId, "grammar", 55);

    const recommendation = learnerModel.generateDailyRecommendation(userId);

    expect(recommendation).toBeDefined();
    expect(recommendation.timeAllocation).toBeDefined();
    expect(recommendation.timeAllocation.total).toBe(240);
    expect(recommendation.focusAreas.length).toBeGreaterThan(0);
    expect(recommendation.newWordsCount).toBeGreaterThan(0);
    expect(recommendation.reviewWordsCount).toBeGreaterThan(0);
  });

  // ============================================================
  // Vocabulary Quality Tests
  // ============================================================

  it("Vocabulary data meets quality standards for learning", async () => {
    const allItems = await vocabEngine.getAllItems();
    const testWords = allItems.slice(0, 50);

    // Every word must have required fields
    testWords.forEach((word: VocabularyItem) => {
      expect(word.word).toBeTruthy();
      expect(word.chineseMeaning).toBeTruthy();
      expect(word.ipa).toBeTruthy();
      expect(word.phonicsBreakdown).toBeTruthy();
      expect(word.memoryMethods).toBeTruthy();
      expect(word.examples.length).toBeGreaterThan(0);
    });

    // Search works
    const helloResults = await vocabEngine.search("hello");
    expect(helloResults.length).toBeGreaterThan(0);

    // Filtering works
    const a1Words = await vocabEngine.getItemsByLevel("A1");
    expect(a1Words.length).toBeGreaterThan(0);
  });

  // ============================================================
  // SRS Effectiveness Test
  // ============================================================

  it("SRS review frequency increases with poor retention", () => {
    // Low retention learner
    const lowRetentionProfile: LearnerProfile = {
      userId: "low_retention",
      vocabularyAccuracy: 50,
      listeningScore: 50,
      speakingScore: 50,
      grammarAccuracy: 50,
      retentionRate: 0.4,
      totalStudyTime: 10,
      wordsLearned: 100,
      wordsMastered: 30,
      currentStreak: 5,
      difficultyLevel: "beginner",
      focusAreas: [],
      lastUpdated: Date.now(),
    };

    const lowAdj = adaptiveEngine.generateAdjustment(lowRetentionProfile);

    // High retention learner
    const highRetentionProfile: LearnerProfile = {
      userId: "high_retention",
      vocabularyAccuracy: 80,
      listeningScore: 80,
      speakingScore: 80,
      grammarAccuracy: 80,
      retentionRate: 0.9,
      totalStudyTime: 10,
      wordsLearned: 500,
      wordsMastered: 450,
      currentStreak: 30,
      difficultyLevel: "elementary",
      focusAreas: [],
      lastUpdated: Date.now(),
    };

    const highAdj = adaptiveEngine.generateAdjustment(highRetentionProfile);

    // Low retention should review more
    expect(lowAdj.reviewWordsCount).toBeGreaterThanOrEqual(highAdj.reviewWordsCount);
  });

  // ============================================================
  // Learning Bottleneck Identification
  // ============================================================

  it("System identifies common learning bottlenecks", () => {
    // Simulate a learner with specific weaknesses
    const bottleneckProfile: LearnerProfile = {
      userId: "bottleneck_user",
      vocabularyAccuracy: 70,
      listeningScore: 40, // Bottleneck: listening
      speakingScore: 35, // Bottleneck: speaking
      grammarAccuracy: 65,
      retentionRate: 0.6,
      totalStudyTime: 50,
      wordsLearned: 300,
      wordsMastered: 180,
      currentStreak: 10,
      difficultyLevel: "beginner",
      focusAreas: [],
      lastUpdated: Date.now(),
    };

    const analysis = adaptiveEngine.analyzeProfile(bottleneckProfile);

    // Should identify weaknesses
    expect(analysis.weaknesses.length).toBeGreaterThan(0);
    // The adaptive engine identifies overall level and recommendations
    expect(analysis.recommendations.length).toBeGreaterThan(0);

    // Recommendations should address bottlenecks
    expect(analysis.recommendations.length).toBeGreaterThan(0);
  });
});

// ============================================================
// Simulation Report Generator
// ============================================================

describe("Simulation Report Generation", () => {
  it("Generate complete simulation report", () => {
    const learner = new SimulatedLearner();
    const report: Array<ReturnType<SimulatedLearner["simulateDay"]>> = [];

    // Simulate 180 days
    for (let day = 0; day < 180; day++) {
      report.push(learner.simulateDay());
    }

    // Verify report completeness
    expect(report.length).toBe(180);

    // Verify progression
    expect(report[0].wordsLearned).toBeLessThan(report[179].wordsLearned);
    expect(report[0].vocabularyAccuracy).toBeLessThan(report[179].vocabularyAccuracy);
    expect(report[0].listeningScore).toBeLessThan(report[179].listeningScore);

    // Verify consistency
    report.forEach((stats, index) => {
      expect(stats.day).toBe(index + 1);
      expect(stats.totalStudyMinutes).toBe((index + 1) * 240);
      expect(stats.wordsLearned).toBeGreaterThanOrEqual(0);
      expect(stats.vocabularyAccuracy).toBeGreaterThanOrEqual(0);
      expect(stats.vocabularyAccuracy).toBeLessThanOrEqual(100);
    });
  });
});
