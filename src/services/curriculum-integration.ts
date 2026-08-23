/**
 * Curriculum Integration Service
 *
 * Bridges:
 * Daily Coach v2 → Detailed Curriculum Data → Lesson Viewer → Activities → Assessment → Progress
 *
 * Flow:
 * 1. Daily Coach generates mission based on user profile
 * 2. This service loads the correct day's detailed curriculum
 * 3. Maps curriculum activities to mission activities
 * 4. Connects to assessment and progress tracking
 */

import type { LearnerProfile } from "@/engines/daily-coach/v2";
import { getDetailedCurriculum } from "@/engines/curriculum/data/detailed-curriculum-index";
import type { Day1Curriculum } from "@/engines/curriculum/data/day1-detailed";
import { getLessonByDay } from "@/engines/curriculum/data/stage1-lessons";

// ============================================================
// Types
// ============================================================

export interface CurriculumActivity {
  id: string;
  type: "phonics" | "vocabulary" | "listening" | "speaking" | "reading" | "writing" | "grammar" | "review" | "assessment";
  title: string;
  titleChinese: string;
  duration: number;
  content: Day1Curriculum;
  completed: boolean;
  score?: number;
}

export interface DayPlan {
  day: number;
  date: string;
  curriculum: Day1Curriculum | null;
  activities: CurriculumActivity[];
  totalTimeMinutes: number;
  completedCount: number;
  totalCount: number;
  progressPercent: number;
}

export interface ActivityResult {
  activityId: string;
  score: number;
  timeSpent: number;
  completedAt: number;
}

// ============================================================
// Storage Keys
// ============================================================

const STORAGE_KEYS = {
  USER_PROFILE: "english360_user_profile",
  CURRENT_DAY: "english360_current_day",
  ACTIVITY_RESULTS: "english360_activity_results",
  COMPLETED_ACTIVITIES: "english360_completed_activities",
};

// ============================================================
// Helper Functions
// ============================================================

function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveToStorage(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Storage save failed:", e);
  }
}

// ============================================================
// Curriculum Integration Service
// ============================================================

export class CurriculumIntegrationService {
  constructor() {}

  /**
   * Get today's complete learning plan
   */
  getTodayPlan(profile: LearnerProfile): DayPlan {
    const today = new Date().toISOString().split("T")[0];
    const day = profile.currentDay;

    // Try to load detailed curriculum first (Day 1-30)
    let curriculum = getDetailedCurriculum(day);

    // Fallback to stage-based curriculum
    if (!curriculum) {
      const stageLesson = getLessonByDay(day);
      if (stageLesson) {
        // Convert stage lesson to Day1Curriculum format
        curriculum = this.convertStageLessonToCurriculum(stageLesson, day);
      }
    }

    // Generate activities based on curriculum
    const activities = this.generateActivities(curriculum, profile);

    // Load completed activities
    const completedActivities = loadFromStorage<string[]>(
      `${STORAGE_KEYS.COMPLETED_ACTIVITIES}_${today}`,
      []
    );

    // Mark completed activities
    activities.forEach((act) => {
      if (completedActivities.includes(act.id)) {
        act.completed = true;
      }
    });

    const completedCount = activities.filter((a) => a.completed).length;
    const totalCount = activities.length;

    return {
      day,
      date: today,
      curriculum,
      activities,
      totalTimeMinutes: curriculum?.totalMinutes || 240,
      completedCount,
      totalCount,
      progressPercent: totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0,
    };
  }

  /**
   * Generate curriculum-based activities
   */
  private generateActivities(
    curriculum: Day1Curriculum | null,
    profile: LearnerProfile
  ): CurriculumActivity[] {
    const activities: CurriculumActivity[] = [];

    if (curriculum) {
      // Use detailed curriculum data
      const phonicsAct = this.createPhonicsActivity(curriculum);
      const vocabAct = this.createVocabularyActivity(curriculum);
      const listeningAct = this.createListeningActivity(curriculum);
      const speakingAct = this.createSpeakingActivity(curriculum);
      const readingAct = this.createReadingActivity(curriculum);
      const writingAct = this.createWritingActivity(curriculum);
      const reviewAct = this.createReviewActivity(curriculum);
      const assessmentAct = this.createAssessmentActivity(curriculum);

      if (phonicsAct) activities.push(phonicsAct);
      if (vocabAct) activities.push(vocabAct);
      if (listeningAct) activities.push(listeningAct);
      if (speakingAct) activities.push(speakingAct);
      if (readingAct) activities.push(readingAct);
      if (writingAct) activities.push(writingAct);
      if (reviewAct) activities.push(reviewAct);
      if (assessmentAct) activities.push(assessmentAct);
    } else {
      // Fallback to basic activities
      activities.push(
        this.createBasicVocabularyActivity(profile),
        this.createBasicListeningActivity(profile),
        this.createBasicSpeakingActivity(profile),
        this.createBasicReviewActivity(profile)
      );
    }

    // Filter out null activities and type cast
    return activities.filter((a): a is CurriculumActivity => a !== null);
  }

  /**
   * Create phonics activity from curriculum
   */
  private createPhonicsActivity(curriculum: Day1Curriculum): CurriculumActivity | null {
    if (!curriculum.phonics || curriculum.phonics.length === 0) {
      return null;
    }

    return {
      id: "act_phonics",
      type: "phonics",
      title: "Phonics Practice",
      titleChinese: "发音练习",
      duration: 25,
      content: curriculum,
      completed: false,
    };
  }

  /**
   * Create vocabulary activity from curriculum
   */
  private createVocabularyActivity(curriculum: Day1Curriculum): CurriculumActivity | null {
    if (!curriculum.vocabulary || curriculum.vocabulary.length === 0) {
      return null;
    }

    return {
      id: "act_vocabulary",
      type: "vocabulary",
      title: "New Vocabulary",
      titleChinese: "新词汇学习",
      duration: 35,
      content: curriculum,
      completed: false,
    };
  }

  /**
   * Create listening activity from curriculum
   */
  private createListeningActivity(curriculum: Day1Curriculum): CurriculumActivity | null {
    if (!curriculum.listening || curriculum.listening.length === 0) {
      return null;
    }

    return {
      id: "act_listening",
      type: "listening",
      title: "Listening Practice",
      titleChinese: "听力练习",
      duration: 40,
      content: curriculum,
      completed: false,
    };
  }

  /**
   * Create speaking activity from curriculum
   */
  private createSpeakingActivity(curriculum: Day1Curriculum): CurriculumActivity | null {
    if (!curriculum.speaking || curriculum.speaking.length === 0) {
      return null;
    }

    return {
      id: "act_speaking",
      type: "speaking",
      title: "Speaking Practice",
      titleChinese: "口语练习",
      duration: 40,
      content: curriculum,
      completed: false,
    };
  }

  /**
   * Create reading activity from curriculum
   */
  private createReadingActivity(curriculum: Day1Curriculum): CurriculumActivity | null {
    if (!curriculum.reading || curriculum.reading.length === 0) {
      return null;
    }

    return {
      id: "act_reading",
      type: "reading",
      title: "Reading Practice",
      titleChinese: "阅读练习",
      duration: 30,
      content: curriculum,
      completed: false,
    };
  }

  /**
   * Create writing activity from curriculum
   */
  private createWritingActivity(curriculum: Day1Curriculum): CurriculumActivity | null {
    if (!curriculum.writing || curriculum.writing.length === 0) {
      return null;
    }

    return {
      id: "act_writing",
      type: "writing",
      title: "Writing Practice",
      titleChinese: "写作练习",
      duration: 20,
      content: curriculum,
      completed: false,
    };
  }

  /**
   * Create review activity from curriculum
   */
  private createReviewActivity(curriculum: Day1Curriculum): CurriculumActivity | null {
    if (!curriculum.review || curriculum.review.length === 0) {
      return null;
    }

    return {
      id: "act_review",
      type: "review",
      title: "Review",
      titleChinese: "复习",
      duration: 30,
      content: curriculum,
      completed: false,
    };
  }

  /**
   * Create assessment activity from curriculum
   */
  private createAssessmentActivity(curriculum: Day1Curriculum): CurriculumActivity | null {
    if (!curriculum.assessment) {
      return null;
    }

    return {
      id: "act_assessment",
      type: "assessment",
      title: "Daily Assessment",
      titleChinese: "每日测试",
      duration: 15,
      content: curriculum,
      completed: false,
    };
  }

  /**
   * Create basic vocabulary activity (fallback)
   */
  private createBasicVocabularyActivity(profile: LearnerProfile): CurriculumActivity {
    return {
      id: "act_vocabulary_basic",
      type: "vocabulary",
      title: "Vocabulary Practice",
      titleChinese: "词汇练习",
      duration: 30,
      content: {
        day: profile.currentDay,
        title: "Vocabulary",
        titleChinese: "词汇",
        objectives: [],
        objectivesChinese: [],
        totalMinutes: 30,
        vocabulary: [],
        phonics: [],
        listening: [],
        speaking: [],
        reading: [],
        writing: [],
        review: [],
        assessment: { type: "quiz", duration: 0, questions: [] },
      },
      completed: false,
    };
  }

  /**
   * Create basic listening activity (fallback)
   */
  private createBasicListeningActivity(profile: LearnerProfile): CurriculumActivity {
    return {
      id: "act_listening_basic",
      type: "listening",
      title: "Listening Practice",
      titleChinese: "听力练习",
      duration: 40,
      content: {
        day: profile.currentDay,
        title: "Listening",
        titleChinese: "听力",
        objectives: [],
        objectivesChinese: [],
        totalMinutes: 40,
        vocabulary: [],
        phonics: [],
        listening: [],
        speaking: [],
        reading: [],
        writing: [],
        review: [],
        assessment: { type: "quiz", duration: 0, questions: [] },
      },
      completed: false,
    };
  }

  /**
   * Create basic speaking activity (fallback)
   */
  private createBasicSpeakingActivity(profile: LearnerProfile): CurriculumActivity {
    return {
      id: "act_speaking_basic",
      type: "speaking",
      title: "Speaking Practice",
      titleChinese: "口语练习",
      duration: 40,
      content: {
        day: profile.currentDay,
        title: "Speaking",
        titleChinese: "口语",
        objectives: [],
        objectivesChinese: [],
        totalMinutes: 40,
        vocabulary: [],
        phonics: [],
        listening: [],
        speaking: [],
        reading: [],
        writing: [],
        review: [],
        assessment: { type: "quiz", duration: 0, questions: [] },
      },
      completed: false,
    };
  }

  /**
   * Create basic review activity (fallback)
   */
  private createBasicReviewActivity(profile: LearnerProfile): CurriculumActivity {
    return {
      id: "act_review_basic",
      type: "review",
      title: "Review",
      titleChinese: "复习",
      duration: 30,
      content: {
        day: profile.currentDay,
        title: "Review",
        titleChinese: "复习",
        objectives: [],
        objectivesChinese: [],
        totalMinutes: 30,
        vocabulary: [],
        phonics: [],
        listening: [],
        speaking: [],
        reading: [],
        writing: [],
        review: [],
        assessment: { type: "quiz", duration: 0, questions: [] },
      },
      completed: false,
    };
  }

  /**
   * Convert stage lesson to Day1Curriculum format
   */
  private convertStageLessonToCurriculum(lesson: ReturnType<typeof getLessonByDay>, day: number): Day1Curriculum {
    if (!lesson) {
      return {
        day,
        title: `Day ${day}`,
        titleChinese: `第${day}天`,
        objectives: [],
        objectivesChinese: [],
        totalMinutes: 240,
        vocabulary: [],
        phonics: [],
        listening: [],
        speaking: [],
        reading: [],
        writing: [],
        review: [],
        assessment: { type: "quiz", duration: 0, questions: [] },
      };
    }

    return {
      day,
      title: lesson.vocabulary?.words?.[0] || `Day ${day}`,
      titleChinese: `第${day}天`,
      objectives: [],
      objectivesChinese: [],
      totalMinutes: lesson.totalDuration || 240,
      vocabulary: (lesson.vocabulary?.words || []).map((word: string, idx: number) => ({
        id: `v_${day}_${idx}`,
        word,
        ipa: "",
        chinese: "",
        chinesePronunciation: "",
        englishDefinition: "",
        example: "",
        exampleChinese: "",
        memoryMethod: "",
        difficulty: "easy" as const,
      })),
      phonics: [],
      listening: lesson.listening?.transcript
        ? [
            {
              id: `l_${day}`,
              text: lesson.listening.transcript,
              textChinese: lesson.listening.chineseTranscript || "",
              audioSpeed: (lesson.listening.speed || "slow") as "slow" | "normal",
              transcript: lesson.listening.transcript,
              transcriptChinese: lesson.listening.chineseTranscript || "",
              questions: (lesson.listening.questions || []).map((q: { question?: string; chineseQuestion?: string; options?: string[]; correctAnswer?: string | number }) => ({
                question: q.question || "",
                questionChinese: q.chineseQuestion || "",
                options: q.options || [],
                correctAnswer: typeof q.correctAnswer === "number" ? q.correctAnswer : 0,
              })),
            },
          ]
        : [],
      speaking: lesson.speaking?.dialogue
        ? lesson.speaking.dialogue.map((d: { english: string; chinese: string }, idx: number) => ({
            id: `s_${day}_${idx}`,
            modelSentence: d.english,
            modelSentenceChinese: d.chinese,
            ipa: "",
            shadowingPoints: [],
            commonMistakes: [],
            chineseHint: "",
          }))
        : [],
      reading: lesson.reading?.text
        ? [
            {
              id: `r_${day}`,
              title: `Day ${day} Reading`,
              titleChinese: `第${day}天阅读`,
              content: lesson.reading.text,
              contentChinese: lesson.reading.chineseTranslation || "",
              vocabulary: [],
              questions: [],
            },
          ]
        : [],
      writing: lesson.writing?.prompt
        ? [
            {
              id: `w_${day}`,
              task: lesson.writing.prompt,
              taskChinese: lesson.writing.chinesePrompt || "",
              hints: lesson.writing.wordBank || [],
              example: lesson.writing.example || "",
              exampleChinese: "",
            },
          ]
        : [],
      review: [
        {
          type: "vocabulary",
          duration: 30,
          description: "Review today's vocabulary",
          descriptionChinese: "复习今天学的词汇",
        },
      ],
      assessment: {
        type: "quiz",
        duration: 15,
        questions: [],
      },
    };
  }

  /**
   * Complete an activity and update progress
   */
  completeActivity(dayPlan: DayPlan, activityId: string, score: number, timeSpent: number): void {
    const today = dayPlan.date;

    // Mark activity as completed
    const activity = dayPlan.activities.find((a) => a.id === activityId);
    if (activity) {
      activity.completed = true;
      activity.score = score;
    }

    // Save to storage
    const completedActivities = loadFromStorage<string[]>(
      `${STORAGE_KEYS.COMPLETED_ACTIVITIES}_${today}`,
      []
    );

    if (!completedActivities.includes(activityId)) {
      completedActivities.push(activityId);
      saveToStorage(`${STORAGE_KEYS.COMPLETED_ACTIVITIES}_${today}`, completedActivities);
    }

    // Save activity result
    const results = loadFromStorage<Record<string, ActivityResult>>(
      STORAGE_KEYS.ACTIVITY_RESULTS,
      {}
    );

    results[activityId] = {
      activityId,
      score,
      timeSpent,
      completedAt: Date.now(),
    };

    saveToStorage(STORAGE_KEYS.ACTIVITY_RESULTS, results);
  }

  /**
   * Get activity results for a day
   */
  getDayResults(_date: string): Record<string, ActivityResult> {
    const results = loadFromStorage<Record<string, ActivityResult>>(
      STORAGE_KEYS.ACTIVITY_RESULTS,
      {}
    );

    // Filter results for the specified date
    const dayResults: Record<string, ActivityResult> = {};
    for (const [key, value] of Object.entries(results)) {
      if (key.startsWith("act_")) {
        dayResults[key] = value;
      }
    }

    return dayResults;
  }

  /**
   * Check if a day is complete
   */
  isDayComplete(dayPlan: DayPlan): boolean {
    return dayPlan.activities.every((a) => a.completed);
  }

  /**
   * Get day summary
   */
  getDaySummary(dayPlan: DayPlan): {
    totalScore: number;
    averageScore: number;
    timeSpent: number;
    weakAreas: string[];
    strongAreas: string[];
  } {
    const completedActivities = dayPlan.activities.filter((a) => a.completed && a.score !== undefined);
    const totalScore = completedActivities.reduce((sum, a) => sum + (a.score || 0), 0);
    const averageScore = completedActivities.length > 0 ? totalScore / completedActivities.length : 0;

    // Determine weak and strong areas
    const weakAreas: string[] = [];
    const strongAreas: string[] = [];

    completedActivities.forEach((a) => {
      if (a.score !== undefined) {
        if (a.score < 60) {
          weakAreas.push(a.type);
        } else if (a.score > 80) {
          strongAreas.push(a.type);
        }
      }
    });

    return {
      totalScore,
      averageScore,
      timeSpent: dayPlan.totalTimeMinutes,
      weakAreas,
      strongAreas,
    };
  }
}

// ============================================================
// Factory Function
// ============================================================

export function createCurriculumIntegration(): CurriculumIntegrationService {
  return new CurriculumIntegrationService();
}

export default CurriculumIntegrationService;
