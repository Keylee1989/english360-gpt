/**
 * Assessment Engine
 *
 * Handles:
 * - Beginner onboarding (zero English, Chinese only)
 * - Ability detection
 * - Initial student model generation
 * - Daily checks
 * - Milestone assessments
 * - Skill-specific tests
 * - Unseen material tests
 */

import type {
  IAssessmentEngine,
  AssessmentType,
  AssessmentResult,
} from "@/types/engines";
import type { SkillDomain } from "@/types";
import type { StudentModel } from "@/types/student-model";
import { StudentModelEngine } from "../student-model";

// ============================================================
// Onboarding Types
// ============================================================

export interface OnboardingStep {
  id: string;
  type: "question" | "info" | "input";
  question: string;
  chineseQuestion: string;
  options?: OnboardingOption[];
  required: boolean;
}

export interface OnboardingOption {
  id: string;
  label: string;
  chineseLabel: string;
  value: string | number;
}

export interface OnboardingResult {
  englishLevel: "zero" | "basic" | "intermediate" | "advanced";
  dailyMinutes: number;
  intensity: "light" | "standard" | "intensive" | "extreme";
  strictness: "relaxed" | "standard" | "strict" | "extreme";
  goals: string[];
  chineseAssist: "full" | "moderate" | "minimal" | "immersive" | "auto";
}

// ============================================================
// Onboarding Questions
// ============================================================

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: "welcome",
    type: "info",
    question: "Welcome to English360 GPT! Let's set up your learning profile.",
    chineseQuestion: "欢迎来到 English360 GPT！让我们设置你的学习档案。",
    required: false,
  },
  {
    id: "english_level",
    type: "question",
    question: "How would you describe your current English ability?",
    chineseQuestion: "你目前的英语水平如何？",
    options: [
      { id: "zero", label: "I don't know any English", chineseLabel: "完全不会英语", value: "zero" },
      { id: "basic", label: "I know some words", chineseLabel: "认识一些单词", value: "basic" },
      {
        id: "intermediate",
        label: "I can read simple sentences",
        chineseLabel: "能读懂简单句子",
        value: "intermediate",
      },
      {
        id: "advanced",
        label: "I can have basic conversations",
        chineseLabel: "能进行基本对话",
        value: "advanced",
      },
    ],
    required: true,
  },
  {
    id: "daily_time",
    type: "question",
    question: "How much time can you study English each day?",
    chineseQuestion: "你每天能花多少时间学英语？",
    options: [
      { id: "30", label: "30 minutes", chineseLabel: "30分钟", value: 30 },
      { id: "60", label: "1 hour", chineseLabel: "1小时", value: 60 },
      { id: "90", label: "1.5 hours", chineseLabel: "1.5小时", value: 90 },
      { id: "120", label: "2 hours", chineseLabel: "2小时", value: 120 },
      { id: "240", label: "4 hours", chineseLabel: "4小时", value: 240 },
    ],
    required: true,
  },
  {
    id: "intensity",
    type: "question",
    question: "How intense do you want your learning to be?",
    chineseQuestion: "你想要多高强度的学习？",
    options: [
      { id: "light", label: "Light - no pressure", chineseLabel: "轻松 - 不施加压力", value: "light" },
      {
        id: "standard",
        label: "Standard - balanced",
        chineseLabel: "标准 - 均衡",
        value: "standard",
      },
      {
        id: "intensive",
        label: "Intensive - push me",
        chineseLabel: "强化 - 推我一把",
        value: "intensive",
      },
      {
        id: "extreme",
        label: "Extreme - maximum progress",
        chineseLabel: "极限 - 最大进度",
        value: "extreme",
      },
    ],
    required: true,
  },
  {
    id: "goals",
    type: "question",
    question: "What are your main learning goals? (Select all that apply)",
    chineseQuestion: "你的主要学习目标是什么？（可多选）",
    options: [
      {
        id: "daily_conversation",
        label: "Daily conversation",
        chineseLabel: "日常交流",
        value: "daily_conversation",
      },
      { id: "work_english", label: "Work English", chineseLabel: "工作英语", value: "work_english" },
      { id: "travel", label: "Travel", chineseLabel: "旅行", value: "travel" },
      { id: "reading", label: "Reading news/articles", chineseLabel: "阅读新闻/文章", value: "reading" },
      { id: "social_media", label: "Social media", chineseLabel: "社交媒体", value: "social_media" },
      { id: "full_proficiency", label: "Full proficiency", chineseLabel: "完全精通", value: "full_proficiency" },
    ],
    required: true,
  },
  {
    id: "chinese_assist",
    type: "question",
    question: "How much Chinese support do you want?",
    chineseQuestion: "你想要多少中文辅助？",
    options: [
      {
        id: "full",
        label: "Full Chinese support",
        chineseLabel: "全中文支持",
        value: "full",
      },
      {
        id: "auto",
        label: "Auto - reduce as I improve",
        chineseLabel: "自动 - 随能力减少",
        value: "auto",
      },
      {
        id: "minimal",
        label: "Minimal - push me to use English",
        chineseLabel: "最少 - 逼我用英语",
        value: "minimal",
      },
    ],
    required: true,
  },
];

// ============================================================
// Assessment Engine Implementation
// ============================================================

export class AssessmentEngine implements IAssessmentEngine {
  private studentEngine: StudentModelEngine;

  constructor() {
    this.studentEngine = new StudentModelEngine();
  }

  /**
   * Get onboarding steps
   */
  getOnboardingSteps(): OnboardingStep[] {
    return ONBOARDING_STEPS;
  }

  /**
   * Process onboarding answers and generate initial Student Model
   */
  async processOnboarding(
    userId: string,
    answers: Record<string, string | string[] | number>,
  ): Promise<StudentModel> {
    const result = this.parseOnboardingAnswers(answers);

    // Create student with appropriate settings
    await this.studentEngine.createStudent(userId, {
      adaptiveMode: "auto",
      intensity: result.intensity,
      strictness: result.strictness,
      dailyTargetMinutes: result.dailyMinutes as 30 | 60 | 90 | 120 | 180 | 240,
      chineseAssistLevel: result.chineseAssist,
      soundEnabled: true,
      microphoneEnabled: false,
      targetAccent: "american",
      interfaceLanguage: result.chineseAssist === "full" ? "chinese" : "auto",
    });

    // Set initial scores based on self-reported level
    const levelScores: Record<string, Partial<Record<SkillDomain, number>>> = {
      zero: {
        vocabulary: 0,
        grammar: 0,
        listening: 0,
        speaking: 0,
        reading: 0,
        writing: 0,
        pronunciation: 0,
        fluency: 0,
        naturalness: 0,
      },
      basic: {
        vocabulary: 10,
        grammar: 5,
        listening: 8,
        speaking: 3,
        reading: 12,
        writing: 2,
        pronunciation: 5,
        fluency: 3,
        naturalness: 2,
      },
      intermediate: {
        vocabulary: 35,
        grammar: 30,
        listening: 28,
        speaking: 22,
        reading: 38,
        writing: 20,
        pronunciation: 25,
        fluency: 20,
        naturalness: 18,
      },
      advanced: {
        vocabulary: 60,
        grammar: 55,
        listening: 52,
        speaking: 48,
        reading: 65,
        writing: 45,
        pronunciation: 50,
        fluency: 45,
        naturalness: 40,
      },
    };

    const scores = levelScores[result.englishLevel] ?? levelScores.zero;

    // Apply scores to all domains
    for (const [domain, score] of Object.entries(scores)) {
      await this.studentEngine.updateSkillScore(
        userId,
        domain as SkillDomain,
        score ?? 0,
      );
    }

    // Return updated student
    const updatedStudent = await this.studentEngine.getStudent(userId);
    if (!updatedStudent) throw new Error("Failed to create student model");
    return updatedStudent;
  }

  /**
   * Run a comprehensive skill assessment
   */
  async runAssessment(
    userId: string,
    type: AssessmentType,
  ): Promise<AssessmentResult> {
    const student = await this.studentEngine.getStudent(userId);
    if (!student) throw new Error(`Student not found: ${userId}`);

    // For now, return a structured result based on current student model
    // Full assessment will be implemented when content engine is built
    const domains: SkillDomain[] = [
      "vocabulary",
      "grammar",
      "listening",
      "speaking",
      "reading",
      "writing",
      "pronunciation",
    ];

    const scores: Record<SkillDomain, number> = {} as Record<SkillDomain, number>;
    const details: AssessmentResult["details"] = [];

    for (const domain of domains) {
      const score = student.skills[domain].score;
      scores[domain] = score;
      details.push({
        domain,
        score,
        strengths: score >= 50 ? ["Demonstrated competency"] : [],
        weaknesses: score < 30 ? ["Needs improvement"] : [],
        transferScore: score * 0.8, // Estimated transfer
      });
    }

    return {
      id: `assessment_${Date.now()}`,
      timestamp: Date.now(),
      type,
      scores,
      overallScore: student.overallScore,
      competencyLevel: student.competencyLevel,
      details,
      recommendations: this.generateRecommendations(student),
    };
  }

  /**
   * Evaluate a single answer
   */
  async evaluateAnswer(
    _questionId: string,
    _userAnswer: string,
  ): Promise<{ correct: boolean; feedback: string; score: number }> {
    // Placeholder for answer evaluation logic
    // Will be implemented when question bank is built
    return {
      correct: false,
      feedback: "NOT IMPLEMENTED: Answer evaluation requires question bank",
      score: 0,
    };
  }

  // ============================================================
  // Private Methods
  // ============================================================

  private parseOnboardingAnswers(
    answers: Record<string, string | string[] | number>,
  ): OnboardingResult {
    return {
      englishLevel: (answers.english_level as OnboardingResult["englishLevel"]) || "zero",
      dailyMinutes: Number(answers.daily_time) || 60,
      intensity: (answers.intensity as OnboardingResult["intensity"]) || "standard",
      strictness: "standard",
      goals: Array.isArray(answers.goals)
        ? answers.goals.map(String)
        : [String(answers.goals)].filter(Boolean),
      chineseAssist: (answers.chinese_assist as OnboardingResult["chineseAssist"]) || "auto",
    };
  }

  private generateRecommendations(student: StudentModel): string[] {
    const recs: string[] = [];

    if (student.overallScore < 10) {
      recs.push("从字母和发音开始学习");
      recs.push("Focus on alphabet and phonics first");
    }

    if (student.skills.speaking.score < student.skills.reading.score - 15) {
      recs.push("Speaking is behind reading. Add more speaking practice.");
    }

    if (student.skills.listening.score < 20) {
      recs.push("Listening needs foundation work. Start with slow, clear audio.");
    }

    if (student.streak === 0) {
      recs.push("Start your learning streak today!");
    }

    return recs;
  }
}
