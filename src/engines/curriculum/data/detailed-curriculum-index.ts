/**
 * Detailed Curriculum Index
 *
 * Exports all Day 1-30 detailed curricula
 */

import { DAY_1_CURRICULUM } from "./day1-detailed";
import { DAY_2_CURRICULUM } from "./day2-detailed";
import { DAY_7_TO_14_CURRICULA } from "./day7-14-detailed";
import { DAY_9_TO_30_CURRICULA } from "./day9-30-detailed";

// ============================================================
// Curriculum Registry
// ============================================================

export const DETAILED_CURRICULA: Record<number, typeof DAY_1_CURRICULUM> = {
  1: DAY_1_CURRICULUM,
  2: DAY_2_CURRICULUM,
  ...DAY_7_TO_14_CURRICULA,
  ...DAY_9_TO_30_CURRICULA,
};

// ============================================================
// Helper Functions
// ============================================================

/**
 * Get detailed curriculum for a specific day
 */
export function getDetailedCurriculum(day: number) {
  return DETAILED_CURRICULA[day] || null;
}

/**
 * Check if detailed curriculum exists for a day
 */
export function hasDetailedCurriculum(day: number): boolean {
  return day in DETAILED_CURRICULA;
}

/**
 * Get all available detailed curriculum days
 */
export function getAvailableDays(): number[] {
  return Object.keys(DETAILED_CURRICULA).map(Number).sort((a, b) => a - b);
}

/**
 * Get total vocabulary count for Day 1-30
 */
export function getTotalVocabularyCount(): number {
  let count = 0;
  for (const curriculum of Object.values(DETAILED_CURRICULA)) {
    count += curriculum.vocabulary.length;
  }
  return count;
}

/**
 * Get total listening exercises count
 */
export function getTotalListeningCount(): number {
  let count = 0;
  for (const curriculum of Object.values(DETAILED_CURRICULA)) {
    count += curriculum.listening.length;
  }
  return count;
}

/**
 * Get total speaking exercises count
 */
export function getTotalSpeakingCount(): number {
  let count = 0;
  for (const curriculum of Object.values(DETAILED_CURRICULA)) {
    count += curriculum.speaking.length;
  }
  return count;
}

// ============================================================
// Export
// ============================================================

export default DETAILED_CURRICULA;
