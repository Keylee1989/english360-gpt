/**
 * Stage 1 Complete Curriculum - Day 1-30
 * 
 * Exports all lessons for the foundation stage.
 */

import type { DailyLesson } from "@/types/database";
import { DAY_1_LESSON } from "./stage1-days";
import { ALL_STAGE1_LESSONS, getLessonByDayNumber as getFromDay3_30 } from "./stage1-day3-30";

// Re-export Day 1 from the original file
export { DAY_1_LESSON };

// Combine all lessons
export const ALL_LESSONS: DailyLesson[] = [
  DAY_1_LESSON,
  ...ALL_STAGE1_LESSONS,
];

/**
 * Get lesson by day number (1-30)
 */
export const getLessonByDay = (dayNumber: number): DailyLesson | null => {
  // Try Day 3-30 first
  const day3_30 = getFromDay3_30(dayNumber);
  if (day3_30) return day3_30;
  
  // Try Day 1
  if (dayNumber === 1) return DAY_1_LESSON;
  
  return null;
};

/**
 * Get total number of available lessons
 */
export const getTotalLessons = (): number => {
  return ALL_LESSONS.length;
};

/**
 * Get all available day numbers
 */
export const getAvailableDays = (): number[] => {
  return ALL_LESSONS.map(l => {
    const match = l.dayId.match(/day_(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }).filter(d => d > 0).sort((a, b) => a - b);
};
