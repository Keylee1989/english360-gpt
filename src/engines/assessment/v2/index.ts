/**
 * Assessment Engine v2
 * 
 * Periodic assessments:
 * - Day 7: Week 1 assessment
 * - Day 14: Week 2 assessment
 * - Day 30: Month 1 assessment
 * 
 * Measures:
 * - Vocabulary retention
 * - Listening comprehension
 * - Speaking ability
 * - Grammar understanding
 */

// ============================================================
// Types
// ============================================================

export interface AssessmentConfig {
  id: string;
  dayNumber: number;
  title: string;
  titleChinese: string;
  duration: number; // minutes
  sections: AssessmentSection[];
}

export interface AssessmentSection {
  id: string;
  type: "vocabulary" | "listening" | "speaking" | "grammar" | "reading";
  title: string;
  titleChinese: string;
  duration: number; // minutes
  questions: AssessmentQuestion[];
  passingScore: number; // 0-1
}

export interface AssessmentQuestion {
  id: string;
  type: "multiple_choice" | "text_input" | "true_false" | "fill_blank";
  prompt: string;
  chinesePrompt?: string;
  correctAnswer: string;
  alternatives?: string[];
  options?: string[];
  points: number;
}

export interface AssessmentResult {
  assessmentId: string;
  userId: string;
  startedAt: number;
  completedAt?: number;
  
  sectionResults: {
    sectionId: string;
    score: number; // 0-1
    correctAnswers: number;
    totalQuestions: number;
    timeSpent: number; // seconds
  }[];
  
  overallScore: number; // 0-100
  passed: boolean;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

// ============================================================
// Assessment Configurations
// ============================================================

export const ASSESSMENT_CONFIGS: AssessmentConfig[] = [
  // Day 7 Assessment
  {
    id: "assessment_day_7",
    dayNumber: 7,
    title: "Week 1 Assessment",
    titleChinese: "第一周测试",
    duration: 30,
    sections: [
      {
        id: "vocab_7",
        type: "vocabulary",
        title: "Vocabulary",
        titleChinese: "词汇测试",
        duration: 10,
        passingScore: 0.7,
        questions: [
          {
            id: "q1",
            type: "multiple_choice",
            prompt: "What does 'hello' mean?",
            chinesePrompt: "'hello' 是什么意思？",
            correctAnswer: "你好",
            options: ["你好", "再见", "谢谢", "请"],
            points: 1,
          },
          {
            id: "q2",
            type: "multiple_choice",
            prompt: "What does 'thank' mean?",
            chinesePrompt: "'thank' 是什么意思？",
            correctAnswer: "谢谢",
            options: ["对不起", "谢谢", "请", "你好"],
            points: 1,
          },
          {
            id: "q3",
            type: "text_input",
            prompt: "Write the English word for '再见'",
            chinesePrompt: "写出'再见'的英文单词",
            correctAnswer: "goodbye",
            alternatives: ["bye"],
            points: 1,
          },
          {
            id: "q4",
            type: "multiple_choice",
            prompt: "Which word means '我'?",
            chinesePrompt: "哪个单词意思是'我'？",
            correctAnswer: "I",
            options: ["you", "I", "he", "she"],
            points: 1,
          },
          {
            id: "q5",
            type: "multiple_choice",
            prompt: "Which word means '请'?",
            chinesePrompt: "哪个单词意思是'请'？",
            correctAnswer: "please",
            options: ["sorry", "thank", "please", "hello"],
            points: 1,
          },
        ],
      },
      {
        id: "grammar_7",
        type: "grammar",
        title: "Grammar",
        titleChinese: "语法测试",
        duration: 10,
        passingScore: 0.7,
        questions: [
          {
            id: "g1",
            type: "fill_blank",
            prompt: "I ___ a student.",
            chinesePrompt: "I ___ 一个学生。",
            correctAnswer: "am",
            points: 1,
          },
          {
            id: "g2",
            type: "fill_blank",
            prompt: "She ___ beautiful.",
            chinesePrompt: "她___漂亮。",
            correctAnswer: "is",
            points: 1,
          },
          {
            id: "g3",
            type: "fill_blank",
            prompt: "They ___ friends.",
            chinesePrompt: "他们___朋友。",
            correctAnswer: "are",
            points: 1,
          },
          {
            id: "g4",
            type: "multiple_choice",
            prompt: "Choose the correct: He ___ a teacher.",
            chinesePrompt: "选择正确的：He ___ 一个老师。",
            correctAnswer: "is",
            options: ["am", "is", "are", "be"],
            points: 1,
          },
        ],
      },
      {
        id: "listening_7",
        type: "listening",
        title: "Listening",
        titleChinese: "听力测试",
        duration: 10,
        passingScore: 0.7,
        questions: [
          {
            id: "l1",
            type: "multiple_choice",
            prompt: "Listen: 'Hello, how are you?' What does the person say?",
            chinesePrompt: "听：'Hello, how are you?' 这个人说了什么？",
            correctAnswer: "Hello, how are you?",
            options: ["Hello, how are you?", "Goodbye, see you.", "Thank you.", "I am good."],
            points: 1,
          },
        ],
      },
    ],
  },

  // Day 14 Assessment
  {
    id: "assessment_day_14",
    dayNumber: 14,
    title: "Week 2 Assessment",
    titleChinese: "第二周测试",
    duration: 35,
    sections: [
      {
        id: "vocab_14",
        type: "vocabulary",
        title: "Vocabulary",
        titleChinese: "词汇测试",
        duration: 15,
        passingScore: 0.7,
        questions: [
          {
            id: "q1",
            type: "multiple_choice",
            prompt: "What does 'red' mean?",
            chinesePrompt: "'red' 是什么意思？",
            correctAnswer: "红色",
            options: ["蓝色", "红色", "绿色", "黄色"],
            points: 1,
          },
          {
            id: "q2",
            type: "text_input",
            prompt: "Write the English word for '三'",
            chinesePrompt: "写出'三'的英文单词",
            correctAnswer: "three",
            points: 1,
          },
          {
            id: "q3",
            type: "multiple_choice",
            prompt: "Which number is '5'?",
            chinesePrompt: "哪个数字是'5'？",
            correctAnswer: "five",
            options: ["four", "five", "six", "seven"],
            points: 1,
          },
          {
            id: "q4",
            type: "multiple_choice",
            prompt: "What does 'this' mean?",
            chinesePrompt: "'this' 是什么意思？",
            correctAnswer: "这",
            options: ["那", "这", "他", "她"],
            points: 1,
          },
          {
            id: "q5",
            type: "text_input",
            prompt: "Write the English word for '蓝色'",
            chinesePrompt: "写出'蓝色'的英文单词",
            correctAnswer: "blue",
            points: 1,
          },
        ],
      },
      {
        id: "grammar_14",
        type: "grammar",
        title: "Grammar",
        titleChinese: "语法测试",
        duration: 10,
        passingScore: 0.7,
        questions: [
          {
            id: "g1",
            type: "fill_blank",
            prompt: "This ___ a book.",
            chinesePrompt: "这___一本书。",
            correctAnswer: "is",
            points: 1,
          },
          {
            id: "g2",
            type: "fill_blank",
            prompt: "That ___ a cat.",
            chinesePrompt: "那___一只猫。",
            correctAnswer: "is",
            points: 1,
          },
          {
            id: "g3",
            type: "multiple_choice",
            prompt: "Choose: ___ is my friend.",
            chinesePrompt: "选择：___是我的朋友。",
            correctAnswer: "This",
            options: ["This", "Am", "Are", "Do"],
            points: 1,
          },
        ],
      },
      {
        id: "speaking_14",
        type: "speaking",
        title: "Speaking",
        titleChinese: "口语测试",
        duration: 10,
        passingScore: 0.7,
        questions: [
          {
            id: "s1",
            type: "text_input",
            prompt: "Say: 'Hello, I am [your name]'",
            chinesePrompt: "说：'你好，我是[你的名字]'",
            correctAnswer: "hello",
            alternatives: ["hi"],
            points: 1,
          },
        ],
      },
    ],
  },

  // Day 30 Assessment
  {
    id: "assessment_day_30",
    dayNumber: 30,
    title: "Month 1 Assessment",
    titleChinese: "第一个月测试",
    duration: 45,
    sections: [
      {
        id: "vocab_30",
        type: "vocabulary",
        title: "Vocabulary",
        titleChinese: "词汇测试",
        duration: 15,
        passingScore: 0.7,
        questions: [
          {
            id: "q1",
            type: "multiple_choice",
            prompt: "What does 'mother' mean?",
            chinesePrompt: "'mother' 是什么意思？",
            correctAnswer: "母亲",
            options: ["父亲", "母亲", "兄弟", "姐妹"],
            points: 1,
          },
          {
            id: "q2",
            type: "text_input",
            prompt: "Write the English word for '水'",
            chinesePrompt: "写出'水'的英文单词",
            correctAnswer: "water",
            points: 1,
          },
          {
            id: "q3",
            type: "multiple_choice",
            prompt: "What is the opposite of 'big'?",
            chinesePrompt: "'big' 的反义词是什么？",
            correctAnswer: "small",
            options: ["big", "small", "tall", "long"],
            points: 1,
          },
          {
            id: "q4",
            type: "multiple_choice",
            prompt: "Which word means '学校'?",
            chinesePrompt: "哪个单词意思是'学校'？",
            correctAnswer: "school",
            options: ["house", "school", "hospital", "store"],
            points: 1,
          },
          {
            id: "q5",
            type: "text_input",
            prompt: "Write the English word for '食物'",
            chinesePrompt: "写出'食物'的英文单词",
            correctAnswer: "food",
            points: 1,
          },
        ],
      },
      {
        id: "grammar_30",
        type: "grammar",
        title: "Grammar",
        titleChinese: "语法测试",
        duration: 15,
        passingScore: 0.7,
        questions: [
          {
            id: "g1",
            type: "fill_blank",
            prompt: "I ___ a student.",
            chinesePrompt: "I ___ 一个学生。",
            correctAnswer: "am",
            points: 1,
          },
          {
            id: "g2",
            type: "fill_blank",
            prompt: "This ___ my book.",
            chinesePrompt: "这___我的书。",
            correctAnswer: "is",
            points: 1,
          },
          {
            id: "g3",
            type: "fill_blank",
            prompt: "They ___ at home.",
            chinesePrompt: "他们___在家。",
            correctAnswer: "are",
            points: 1,
          },
          {
            id: "g4",
            type: "multiple_choice",
            prompt: "Choose: She ___ a teacher.",
            chinesePrompt: "选择：She ___ 一个老师。",
            correctAnswer: "is",
            options: ["am", "is", "are", "be"],
            points: 1,
          },
          {
            id: "g5",
            type: "fill_blank",
            prompt: "We ___ happy.",
            chinesePrompt: "我们___开心。",
            correctAnswer: "are",
            points: 1,
          },
        ],
      },
      {
        id: "listening_30",
        type: "listening",
        title: "Listening",
        titleChinese: "听力测试",
        duration: 10,
        passingScore: 0.7,
        questions: [
          {
            id: "l1",
            type: "multiple_choice",
            prompt: "Listen: 'I am a student. I like English.' What does the person say?",
            chinesePrompt: "听：'I am a student. I like English.' 这个人说了什么？",
            correctAnswer: "I am a student. I like English.",
            options: [
              "I am a student. I like English.",
              "I am a teacher. I like Chinese.",
              "I am a student. I like math.",
              "I am a doctor. I like English.",
            ],
            points: 1,
          },
        ],
      },
      {
        id: "speaking_30",
        type: "speaking",
        title: "Speaking",
        titleChinese: "口语测试",
        duration: 5,
        passingScore: 0.7,
        questions: [
          {
            id: "s1",
            type: "text_input",
            prompt: "Say: 'Hello, my name is [your name]. I am a student.'",
            chinesePrompt: "说：'你好，我的名字是[你的名字]。我是一个学生。'",
            correctAnswer: "student",
            alternatives: ["hello", "name"],
            points: 1,
          },
        ],
      },
    ],
  },
];

// ============================================================
// Assessment Engine
// ============================================================

export class AssessmentEngineV2 {
  /**
   * Get assessment config by day number
   */
  getAssessmentByDay(dayNumber: number): AssessmentConfig | null {
    return ASSESSMENT_CONFIGS.find(a => a.dayNumber === dayNumber) || null;
  }

  /**
   * Get all assessment configs
   */
  getAllAssessments(): AssessmentConfig[] {
    return ASSESSMENT_CONFIGS;
  }

  /**
   * Evaluate a single answer
   */
  evaluateAnswer(
    question: AssessmentQuestion,
    userAnswer: string,
  ): { correct: boolean; score: number; feedback: string } {
    const normalizedUser = userAnswer.trim().toLowerCase();
    const normalizedCorrect = question.correctAnswer.toLowerCase();

    // Check exact match
    const isExactMatch = normalizedUser === normalizedCorrect;

    // Check alternatives
    const isAlternative = question.alternatives?.some(
      alt => normalizedUser === alt.toLowerCase()
    ) ?? false;

    const correct = isExactMatch || isAlternative;
    const score = correct ? 1 : this.calculateSimilarity(normalizedUser, normalizedCorrect);

    const feedback = correct
      ? "Correct! 正确！"
      : `The correct answer is: ${question.correctAnswer} 正确答案是：${question.correctAnswer}`;

    return { correct, score, feedback };
  }

  /**
   * Evaluate a complete section
   */
  evaluateSection(
    section: AssessmentSection,
    answers: Record<string, string>,
  ): {
    score: number;
    correctAnswers: number;
    totalQuestions: number;
    questionResults: { questionId: string; correct: boolean; score: number }[];
  } {
    let totalScore = 0;
    let correctAnswers = 0;
    const questionResults: { questionId: string; correct: boolean; score: number }[] = [];

    for (const question of section.questions) {
      const userAnswer = answers[question.id] || "";
      const result = this.evaluateAnswer(question, userAnswer);
      
      totalScore += result.score * question.points;
      if (result.correct) correctAnswers++;
      
      questionResults.push({
        questionId: question.id,
        correct: result.correct,
        score: result.score,
      });
    }

    const maxScore = section.questions.reduce((sum, q) => sum + q.points, 0);
    const score = maxScore > 0 ? totalScore / maxScore : 0;

    return {
      score,
      correctAnswers,
      totalQuestions: section.questions.length,
      questionResults,
    };
  }

  /**
   * Generate assessment result
   */
  generateResult(
    assessment: AssessmentConfig,
    sectionResults: {
      sectionId: string;
      score: number;
      correctAnswers: number;
      totalQuestions: number;
      timeSpent: number;
    }[],
  ): AssessmentResult {
    // Calculate overall score
    const totalWeightedScore = sectionResults.reduce((sum, r) => sum + r.score, 0);
    const overallScore = sectionResults.length > 0
      ? (totalWeightedScore / sectionResults.length) * 100
      : 0;

    // Determine pass/fail
    const passed = overallScore >= 70;

    // Analyze strengths and weaknesses
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const recommendations: string[] = [];

    for (const result of sectionResults) {
      const section = assessment.sections.find(s => s.id === result.sectionId);
      if (!section) continue;

      if (result.score >= 0.8) {
        strengths.push(section.titleChinese);
      } else if (result.score < 0.7) {
        weaknesses.push(section.titleChinese);
        recommendations.push(`多练习${section.titleChinese}`);
      }
    }

    return {
      assessmentId: assessment.id,
      userId: "current",
      startedAt: Date.now(),
      completedAt: Date.now(),
      sectionResults,
      overallScore,
      passed,
      strengths,
      weaknesses,
      recommendations,
    };
  }

  /**
   * Calculate string similarity (Levenshtein)
   */
  private calculateSimilarity(a: string, b: string): number {
    if (a === b) return 1;
    if (a.length === 0 || b.length === 0) return 0;

    const matrix: number[][] = [];
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1,
          );
        }
      }
    }

    const distance = matrix[b.length][a.length];
    const maxLength = Math.max(a.length, b.length);
    return 1 - distance / maxLength;
  }
}
