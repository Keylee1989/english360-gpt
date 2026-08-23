/**
 * Stage 2 Curriculum: Day 91-180
 * 
 * Focus: Practical Communication
 * 
 * Topics:
 * - Workplace English
 * - Social conversations
 * - Expressing opinions
 * - Explaining experiences
 * - Storytelling
 * - Problem solving
 * 
 * Each day: 240 minutes
 * Includes: vocabulary, grammar, listening, speaking, shadowing, review, assessment
 */

import type { CurriculumDay } from "@/types/database";

// ============================================================
// Day 91-180 Data
// ============================================================

export const STAGE2_DAYS: CurriculumDay[] = [
  // ============================================================
  // Month 4: Workplace Basics (Day 91-120)
  // ============================================================
  {
    id: "day_91",
    dayNumber: 91,
    stage: 2,
    week: 13,
    title: "Starting a New Job",
    titleChinese: "开始新工作",
    goals: {
      vocabulary: ["colleague", "meeting", "deadline", "presentation", "schedule"],
      grammar: ["Present Perfect for Work Experience"],
      listening: "Understand workplace basics",
      speaking: "Introduce yourself professionally",
      reading: "Read workplace documents",
      writing: "Write professional emails",
    },
    vocabularyWordIds: ["colleague", "meeting", "deadline", "presentation", "schedule"],
    grammarPointIds: ["present_perfect_work"],
    listeningExerciseIds: ["listening_workplace_day91"],
    speakingExerciseIds: ["speaking_self_intro_day91"],
    estimatedMinutes: 240,
    prerequisites: ["day_90"],
    order: 91,
  },
  {
    id: "day_92",
    dayNumber: 92,
    stage: 2,
    week: 13,
    title: "Email Communication",
    titleChinese: "邮件沟通",
    goals: {
      vocabulary: ["attachment", "recipient", "urgent"],
      grammar: ["Formal Email Phrases"],
      listening: "Understand email etiquette",
      speaking: "Practice email reading",
      reading: "Read professional emails",
      writing: "Write formal emails",
    },
    vocabularyWordIds: ["attachment", "recipient", "urgent"],
    grammarPointIds: ["formal_email_phrases"],
    listeningExerciseIds: ["listening_email_day92"],
    speakingExerciseIds: ["speaking_email_day92"],
    estimatedMinutes: 240,
    prerequisites: ["day_91"],
    order: 92,
  },
  // ============================================================
  // Day 93-100: Social Conversations
  // ============================================================
  {
    id: "day_93",
    dayNumber: 93,
    stage: 2,
    week: 14,
    title: "Making Small Talk",
    titleChinese: "闲聊",
    goals: {
      vocabulary: ["weekend", "hobby", "relax"],
      grammar: ["Past Simple for Weekend Activities"],
      listening: "Understand casual conversations",
      speaking: "Start casual conversations",
      reading: "Read informal texts",
      writing: "Write about your weekend",
    },
    vocabularyWordIds: ["weekend", "hobby", "relax"],
    grammarPointIds: ["past_simple_weekend"],
    listeningExerciseIds: ["listening_smalltalk_day93"],
    speakingExerciseIds: ["speaking_smalltalk_day93"],
    estimatedMinutes: 240,
    prerequisites: ["day_92"],
    order: 93,
  },
  // ============================================================
  // Day 101-110: Expressing Opinions
  // ============================================================
  {
    id: "day_101",
    dayNumber: 101,
    stage: 2,
    week: 15,
    title: "Giving Opinions",
    titleChinese: "表达观点",
    goals: {
      vocabulary: ["opinion", "agree", "disagree", "suggest"],
      grammar: ["Expressing Opinions"],
      listening: "Understand opinion discussions",
      speaking: "Express opinions politely",
      reading: "Read opinion articles",
      writing: "Write opinion paragraphs",
    },
    vocabularyWordIds: ["opinion", "agree", "disagree", "suggest"],
    grammarPointIds: ["expressing_opinions"],
    listeningExerciseIds: ["listening_opinions_day101"],
    speakingExerciseIds: ["speaking_opinions_day101"],
    estimatedMinutes: 240,
    prerequisites: ["day_100"],
    order: 101,
  },
  // ============================================================
  // Day 120: Month 4 Assessment
  // ============================================================
  {
    id: "day_120",
    dayNumber: 120,
    stage: 2,
    week: 17,
    title: "Month 4 Assessment",
    titleChinese: "第四个月评估",
    goals: {
      vocabulary: ["workplace vocabulary assessment"],
      grammar: ["workplace grammar assessment"],
      listening: "Workplace listening assessment",
      speaking: "Workplace speaking assessment",
      reading: "Workplace reading assessment",
      writing: "Workplace writing assessment",
    },
    vocabularyWordIds: [],
    grammarPointIds: [],
    listeningExerciseIds: [],
    speakingExerciseIds: [],
    estimatedMinutes: 240,
    prerequisites: ["day_119"],
    order: 120,
  },
  // ============================================================
  // Day 121-150: Advanced Social Situations
  // ============================================================
  {
    id: "day_121",
    dayNumber: 121,
    stage: 2,
    week: 18,
    title: "Making Phone Calls",
    titleChinese: "打电话",
    goals: {
      vocabulary: ["voicemail", "available", "callback"],
      grammar: ["Polite Requests on the Phone"],
      listening: "Understand phone conversations",
      speaking: "Make and receive phone calls",
      reading: "Read phone scripts",
      writing: "Write voicemail messages",
    },
    vocabularyWordIds: ["voicemail", "available", "callback"],
    grammarPointIds: ["polite_phone_requests"],
    listeningExerciseIds: ["listening_phone_day121"],
    speakingExerciseIds: ["speaking_phone_day121"],
    estimatedMinutes: 240,
    prerequisites: ["day_120"],
    order: 121,
  },
  // ============================================================
  // Day 151-180: Problem Solving & Advanced Topics
  // ============================================================
  {
    id: "day_151",
    dayNumber: 151,
    stage: 2,
    week: 22,
    title: "Describing Problems",
    titleChinese: "描述问题",
    goals: {
      vocabulary: ["problem", "solution", "broken"],
      grammar: ["Can/Could for Requests"],
      listening: "Understand problem descriptions",
      speaking: "Describe problems clearly",
      reading: "Read problem reports",
      writing: "Write problem descriptions",
    },
    vocabularyWordIds: ["problem", "solution", "broken"],
    grammarPointIds: ["can_could_requests"],
    listeningExerciseIds: ["listening_problems_day151"],
    speakingExerciseIds: ["speaking_problems_day151"],
    estimatedMinutes: 240,
    prerequisites: ["day_150"],
    order: 151,
  },
  // ============================================================
  // Day 180: Stage 2 Final Assessment
  // ============================================================
  {
    id: "day_180",
    dayNumber: 180,
    stage: 2,
    week: 26,
    title: "Stage 2 Final Assessment",
    titleChinese: "第二阶段最终评估",
    goals: {
      vocabulary: ["comprehensive vocabulary assessment"],
      grammar: ["comprehensive grammar assessment"],
      listening: "comprehensive listening assessment",
      speaking: "comprehensive speaking assessment",
      reading: "comprehensive reading assessment",
      writing: "comprehensive writing assessment",
    },
    vocabularyWordIds: [],
    grammarPointIds: [],
    listeningExerciseIds: [],
    speakingExerciseIds: [],
    estimatedMinutes: 240,
    prerequisites: ["day_179"],
    order: 180,
  },
];

// ============================================================
// Helper Functions
// ============================================================

/**
 * Get days by week
 */
export function getDaysByWeek(week: number): CurriculumDay[] {
  return STAGE2_DAYS.filter(day => day.week === week);
}

/**
 * Get total vocabulary count
 */
export function getTotalVocabularyCount(): number {
  return STAGE2_DAYS.reduce((sum, day) => sum + day.vocabularyWordIds.length, 0);
}

/**
 * Get total grammar points
 */
export function getTotalGrammarPoints(): number {
  return STAGE2_DAYS.reduce((sum, day) => sum + day.grammarPointIds.length, 0);
}
