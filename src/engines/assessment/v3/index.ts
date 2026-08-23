/**
 * Learning Effectiveness Assessment v3
 *
 * Measures real learning outcomes at key milestones.
 *
 * Milestones:
 * - Day 7: Basic words, simple listening, self-introduction
 * - Day 30: 300-500 words, daily conversation, simple reading
 * - Day 90: Functional English ability
 */

// ============================================================
// Types
// ============================================================

export interface AssessmentMilestone {
  day: number;
  title: string;
  titleChinese: string;
  description: string;
  descriptionChinese: string;
  requirements: AssessmentRequirement[];
  passingScore: number;
}

export interface AssessmentRequirement {
  skill: "vocabulary" | "listening" | "speaking" | "reading" | "writing";
  description: string;
  descriptionChinese: string;
  minScore: number;
  exercises: AssessmentExercise[];
}

export interface AssessmentExercise {
  type: "multiple_choice" | "fill_blank" | "audio_comprehension" | "speaking" | "writing";
  question: string;
  questionChinese: string;
  options?: string[];
  correctAnswer?: string;
  audioText?: string;
  rubric?: ScoringRubric;
}

export interface ScoringRubric {
  criteria: string[];
  maxScore: number;
}

export interface AssessmentResult {
  userId: string;
  milestone: number;
  date: string;
  scores: {
    vocabulary: number;
    listening: number;
    speaking: number;
    reading: number;
    writing: number;
  };
  overallScore: number;
  passed: boolean;
  feedback: string;
  feedbackChinese: string;
  nextSteps: string[];
  nextStepsChinese: string[];
}

export interface LearningProgress {
  userId: string;
  currentDay: number;
  totalStudyMinutes: number;
  wordsLearned: number;
  wordsMastered: number;
  retentionRate: number;
  streak: number;
  assessments: AssessmentResult[];
}

// ============================================================
// Assessment Milestones
// ============================================================

export const ASSESSMENT_MILESTONES: AssessmentMilestone[] = [
  {
    day: 7,
    title: "Week 1 Assessment",
    titleChinese: "第一周评估",
    description: "Test basic vocabulary, simple listening, and self-introduction",
    descriptionChinese: "测试基础词汇、简单听力和自我介绍",
    requirements: [
      {
        skill: "vocabulary",
        description: "Recognize 50 basic words",
        descriptionChinese: "认识50个基础单词",
        minScore: 60,
        exercises: [
          {
            type: "multiple_choice",
            question: "What does 'hello' mean?",
            questionChinese: "'hello'是什么意思？",
            options: ["再见", "你好", "谢谢", "对不起"],
            correctAnswer: "你好",
          },
          {
            type: "fill_blank",
            question: "Complete: My ___ is Li.",
            questionChinese: "完成句子：My ___ is Li.",
            correctAnswer: "name",
          },
        ],
      },
      {
        skill: "listening",
        description: "Understand slow simple sentences",
        descriptionChinese: "听懂慢速简单句子",
        minScore: 50,
        exercises: [
          {
            type: "audio_comprehension",
            question: "What is the person's name?",
            questionChinese: "这个人叫什么名字？",
            audioText: "Hello, my name is Wang.",
            options: ["Li", "Wang", "Zhang"],
            correctAnswer: "Wang",
          },
        ],
      },
      {
        skill: "speaking",
        description: "Introduce yourself in 3 sentences",
        descriptionChinese: "用3句话自我介绍",
        minScore: 50,
        exercises: [
          {
            type: "speaking",
            question: "Introduce yourself",
            questionChinese: "自我介绍",
            rubric: {
              criteria: ["Uses 'My name is...'", "Uses 'I am from...'", "Pronunciation is understandable"],
              maxScore: 100,
            },
          },
        ],
      },
    ],
    passingScore: 55,
  },
  {
    day: 30,
    title: "Month 1 Assessment",
    titleChinese: "第一个月评估",
    description: "Test 300-500 words, daily conversation, simple reading",
    descriptionChinese: "测试300-500词汇、日常对话、简单阅读",
    requirements: [
      {
        skill: "vocabulary",
        description: "Know 300+ high-frequency words",
        descriptionChinese: "掌握300+高频词",
        minScore: 70,
        exercises: [
          {
            type: "multiple_choice",
            question: "Which word means 'food'?",
            questionChinese: "哪个单词意思是'食物'？",
            options: ["water", "food", "house", "car"],
            correctAnswer: "food",
          },
        ],
      },
      {
        skill: "listening",
        description: "Understand daily conversations at slow speed",
        descriptionChinese: "听懂慢速日常对话",
        minScore: 60,
        exercises: [
          {
            type: "audio_comprehension",
            question: "What does the person want to order?",
            questionChinese: "这个人想点什么？",
            audioText: "I would like a coffee, please.",
            options: ["tea", "coffee", "water", "juice"],
            correctAnswer: "coffee",
          },
        ],
      },
      {
        skill: "speaking",
        description: "Have a 3-minute conversation about daily life",
        descriptionChinese: "进行3分钟日常对话",
        minScore: 60,
        exercises: [
          {
            type: "speaking",
            question: "Talk about your daily routine",
            questionChinese: "谈谈你的日常",
            rubric: {
              criteria: ["Uses past tense correctly", "Uses time expressions", "Speaks fluently", "Good pronunciation"],
              maxScore: 100,
            },
          },
        ],
      },
      {
        skill: "reading",
        description: "Read simple articles and answer questions",
        descriptionChinese: "阅读简单文章并回答问题",
        minScore: 60,
        exercises: [
          {
            type: "multiple_choice",
            question: "Read: 'Tom goes to school every day.' What does Tom do?",
            questionChinese: "阅读：'Tom goes to school every day.' Tom做什么？",
            options: ["works", "goes to school", "sleeps", "eats"],
            correctAnswer: "goes to school",
          },
        ],
      },
      {
        skill: "writing",
        description: "Write 5 sentences about your day",
        descriptionChinese: "写5个关于你一天的句子",
        minScore: 60,
        exercises: [
          {
            type: "writing",
            question: "Write about your yesterday",
            questionChinese: "写关于你的昨天",
            rubric: {
              criteria: ["Uses past tense", "Has 5 sentences", "Grammatically correct", "Clear meaning"],
              maxScore: 100,
            },
          },
        ],
      },
    ],
    passingScore: 62,
  },
  {
    day: 90,
    title: "Month 3 Assessment",
    titleChinese: "第三个月评估",
    description: "Test functional English ability",
    descriptionChinese: "测试功能性英语能力",
    requirements: [
      {
        skill: "vocabulary",
        description: "Know 1000+ words",
        descriptionChinese: "掌握1000+词汇",
        minScore: 75,
        exercises: [
          {
            type: "multiple_choice",
            question: "Which word means 'opportunity'?",
            questionChinese: "哪个单词意思是'机会'？",
            options: ["chance", "change", "check", "choice"],
            correctAnswer: "chance",
          },
        ],
      },
      {
        skill: "listening",
        description: "Understand normal speed conversations",
        descriptionChinese: "听懂正常语速对话",
        minScore: 70,
        exercises: [
          {
            type: "audio_comprehension",
            question: "What is the main topic?",
            questionChinese: "主要话题是什么？",
            audioText: "Let's meet at 3pm tomorrow at the coffee shop.",
            options: ["meeting time", "meeting place", "both"],
            correctAnswer: "both",
          },
        ],
      },
      {
        skill: "speaking",
        description: "Express opinions and tell stories",
        descriptionChinese: "表达观点和讲故事",
        minScore: 70,
        exercises: [
          {
            type: "speaking",
            question: "Tell a story about a past experience",
            questionChinese: "讲一个过去经历的故事",
            rubric: {
              criteria: ["Uses past tense", "Has sequence words", "Expresses feelings", "Good fluency"],
              maxScore: 100,
            },
          },
        ],
      },
      {
        skill: "reading",
        description: "Read news articles and understand main ideas",
        descriptionChinese: "阅读新闻文章并理解主旨",
        minScore: 70,
        exercises: [
          {
            type: "multiple_choice",
            question: "What is the article mainly about?",
            questionChinese: "文章主要讲什么？",
            options: ["technology", "health", "education", "sports"],
            correctAnswer: "technology",
          },
        ],
      },
      {
        skill: "writing",
        description: "Write emails and short essays",
        descriptionChinese: "写邮件和短文",
        minScore: 70,
        exercises: [
          {
            type: "writing",
            question: "Write an email to a friend",
            questionChinese: "给朋友写一封邮件",
            rubric: {
              criteria: ["Proper email format", "Clear message", "Good grammar", "Appropriate tone"],
              maxScore: 100,
            },
          },
        ],
      },
    ],
    passingScore: 71,
  },
];

// ============================================================
// Learning Effectiveness Assessment
// ============================================================

export class LearningEffectivenessAssessmentV3 {
  private progress: Map<string, LearningProgress> = new Map();

  /**
   * Get milestone by day
   */
  getMilestone(day: number): AssessmentMilestone | null {
    return ASSESSMENT_MILESTONES.find((m) => m.day === day) || null;
  }

  /**
   * Get all milestones
   */
  getAllMilestones(): AssessmentMilestone[] {
    return ASSESSMENT_MILESTONES;
  }

  /**
   * Get next milestone for user
   */
  getNextMilestone(currentDay: number): AssessmentMilestone | null {
    const future = ASSESSMENT_MILESTONES.filter((m) => m.day > currentDay);
    return future.length > 0 ? future[0] : null;
  }

  /**
   * Assess user at milestone
   */
  assessUser(userId: string, milestoneDay: number, answers: Record<string, string>): AssessmentResult {
    const milestone = this.getMilestone(milestoneDay);
    if (!milestone) {
      throw new Error(`Milestone not found for day ${milestoneDay}`);
    }

    // Calculate scores for each skill
    const scores = {
      vocabulary: 0,
      listening: 0,
      speaking: 0,
      reading: 0,
      writing: 0,
    };

    for (const req of milestone.requirements) {
      const reqAnswers = Object.entries(answers)
        .filter(([key]) => key.startsWith(req.skill))
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

      scores[req.skill] = this.calculateSkillScore(req, reqAnswers);
    }

    // Calculate overall score
    const overallScore = this.calculateOverallScore(scores, milestone);

    // Check if passed
    const passed = overallScore >= milestone.passingScore;

    // Generate feedback
    const feedback = this.generateFeedback(scores, milestone, passed);
    const nextSteps = this.generateNextSteps(scores, milestone);

    const result: AssessmentResult = {
      userId,
      milestone: milestoneDay,
      date: new Date().toISOString(),
      scores,
      overallScore,
      passed,
      feedback,
      feedbackChinese: this.translateFeedback(feedback),
      nextSteps,
      nextStepsChinese: this.translateNextSteps(nextSteps),
    };

    // Store result
    const progress = this.progress.get(userId) || {
      userId,
      currentDay: milestoneDay,
      totalStudyMinutes: 0,
      wordsLearned: 0,
      wordsMastered: 0,
      retentionRate: 0,
      streak: 0,
      assessments: [],
    };
    progress.assessments.push(result);
    this.progress.set(userId, progress);

    return result;
  }

  /**
   * Calculate skill score
   */
  private calculateSkillScore(requirement: AssessmentRequirement, answers: Record<string, string>): number {
    let correct = 0;
    const total = requirement.exercises.length;

    for (let i = 0; i < requirement.exercises.length; i++) {
      const exercise = requirement.exercises[i];
      const answer = answers[`${requirement.skill}_${i}`];
      
      if (exercise.type === "multiple_choice" || exercise.type === "fill_blank") {
        if (answer && answer.toLowerCase() === exercise.correctAnswer?.toLowerCase()) {
          correct++;
        }
      } else {
        // Speaking/writing - give partial credit for attempting
        if (answer && answer.length > 10) {
          correct += 0.5;
        }
      }
    }

    return total > 0 ? Math.round((correct / total) * 100) : 0;
  }

  /**
   * Calculate overall score
   */
  private calculateOverallScore(scores: Record<string, number>, milestone: AssessmentMilestone): number {
    const weights: Record<string, number> = {
      vocabulary: 0.25,
      listening: 0.25,
      speaking: 0.25,
      reading: 0.15,
      writing: 0.1,
    };

    let totalWeight = 0;
    let weightedSum = 0;

    for (const req of milestone.requirements) {
      const weight = weights[req.skill] || 0.2;
      weightedSum += scores[req.skill] * weight;
      totalWeight += weight;
    }

    return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
  }

  /**
   * Generate feedback
   */
  private generateFeedback(scores: Record<string, number>, milestone: AssessmentMilestone, passed: boolean): string {
    const strengths: string[] = [];
    const weaknesses: string[] = [];

    for (const [skill, score] of Object.entries(scores)) {
      if (score >= 70) {
        strengths.push(skill);
      } else if (score < 60) {
        weaknesses.push(skill);
      }
    }

    let feedback = passed
      ? `Congratulations! You passed the ${milestone.title}!`
      : `You didn't pass the ${milestone.title} yet.`;

    if (strengths.length > 0) {
      feedback += ` Your strengths are: ${strengths.join(", ")}.`;
    }

    if (weaknesses.length > 0) {
      feedback += ` Focus on improving: ${weaknesses.join(", ")}.`;
    }

    return feedback;
  }

  /**
   * Generate next steps
   */
  private generateNextSteps(scores: Record<string, number>, milestone: AssessmentMilestone): string[] {
    const nextSteps: string[] = [];

    for (const req of milestone.requirements) {
      if (scores[req.skill] < req.minScore) {
        nextSteps.push(`Practice ${req.skill} more to reach ${req.minScore}%`);
      }
    }

    if (nextSteps.length === 0) {
      nextSteps.push("Continue to the next milestone");
      nextSteps.push("Review any weak areas");
    }

    return nextSteps;
  }

  /**
   * Translate feedback to Chinese
   */
  private translateFeedback(feedback: string): string {
    const translations: Record<string, string> = {
      "Congratulations! You passed": "恭喜！你通过了",
      "Your strengths are": "你的优势是",
      "Focus on improving": "专注于提高",
    };

    let translated = feedback;
    for (const [eng, chn] of Object.entries(translations)) {
      translated = translated.replace(eng, chn);
    }

    return translated;
  }

  /**
   * Translate next steps to Chinese
   */
  private translateNextSteps(steps: string[]): string[] {
    return steps.map((step) => {
      if (step.includes("Practice")) {
        return step.replace("Practice", "练习").replace("more to reach", "以达到");
      }
      if (step.includes("Continue")) {
        return "继续下一个里程碑";
      }
      if (step.includes("Review")) {
        return "复习任何薄弱领域";
      }
      return step;
    });
  }

  /**
   * Get user progress
   */
  getUserProgress(userId: string): LearningProgress | null {
    return this.progress.get(userId) || null;
  }

  /**
   * Get user assessment history
   */
  getUserAssessments(userId: string): AssessmentResult[] {
    const progress = this.progress.get(userId);
    return progress ? progress.assessments : [];
  }

  /**
   * Get effectiveness report
   */
  getEffectivenessReport(userId: string): {
    totalAssessments: number;
    passedAssessments: number;
    averageScore: number;
    skillTrend: Record<string, number[]>;
    recommendations: string[];
  } {
    const assessments = this.getUserAssessments(userId);
    
    if (assessments.length === 0) {
      return {
        totalAssessments: 0,
        passedAssessments: 0,
        averageScore: 0,
        skillTrend: {},
        recommendations: ["Start with Day 7 assessment"],
      };
    }

    const passed = assessments.filter((a) => a.passed).length;
    const avgScore = assessments.reduce((sum, a) => sum + a.overallScore, 0) / assessments.length;

    const skillTrend: Record<string, number[]> = {};
    for (const assessment of assessments) {
      for (const [skill, score] of Object.entries(assessment.scores)) {
        if (!skillTrend[skill]) {
          skillTrend[skill] = [];
        }
        skillTrend[skill].push(score);
      }
    }

    const recommendations: string[] = [];
    if (passed < assessments.length * 0.5) {
      recommendations.push("Focus on basic skills before advancing");
    }
    if (avgScore < 70) {
      recommendations.push("Increase daily study time");
    }

    return {
      totalAssessments: assessments.length,
      passedAssessments: passed,
      averageScore: Math.round(avgScore),
      skillTrend,
      recommendations,
    };
  }
}

// ============================================================
// Singleton Export
// ============================================================

export const learningAssessment = new LearningEffectivenessAssessmentV3();
