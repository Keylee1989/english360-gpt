/**
 * Grammar Engine v1
 *
 * Features:
 * - Grammar point explanations
 * - Examples with translations
 * - Practice exercises
 * - Error detection
 * - Progress tracking
 */

// ============================================================
// Types
// ============================================================

export type GrammarLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export type GrammarCategory = "tenses" | "articles" | "prepositions" | "pronouns" | "verbs" | "adjectives" | "adverbs" | "questions" | "negation" | "conditionals" | "passive" | "reported_speech";

export interface GrammarPoint {
  id: string;
  level: GrammarLevel;
  category: GrammarCategory;
  title: string;
  titleChinese: string;
  rule: string;
  ruleChinese: string;
  examples: GrammarExample[];
  exercises: GrammarExercise[];
  tips: string[];
  tipsChinese: string[];
  commonMistakes: string[];
  commonMistakesChinese: string[];
}

export interface GrammarExample {
  correct: string;
  incorrect?: string;
  chinese: string;
  explanation: string;
}

export interface GrammarExercise {
  id: string;
  type: "fill_blank" | "multiple_choice" | "correct_error" | "rearrange";
  prompt: string;
  promptChinese: string;
  correctAnswer: string;
  options?: string[];
  hints?: string[];
  explanation: string;
  explanationChinese: string;
}

export interface GrammarAnalysis {
  text: string;
  errors: GrammarError[];
  score: number; // 0-1
  suggestions: string[];
}

export interface GrammarError {
  type: string;
  original: string;
  corrected: string;
  rule: string;
  ruleChinese: string;
  explanation: string;
  explanationChinese: string;
}

export interface GrammarProgress {
  pointsStudied: number;
  pointsMastered: number;
  averageScore: number;
  weakCategories: string[];
}

// ============================================================
// Grammar Engine
// ============================================================

export class GrammarEngineV1 {
  private points: Map<string, GrammarPoint> = new Map();
  private progress: Map<string, { studied: boolean; score: number }> = new Map();

  constructor() {
    this.initializeGrammarPoints();
  }

  /**
   * Initialize grammar points
   */
  private initializeGrammarPoints(): void {
    const grammarPoints: GrammarPoint[] = [
      // A1 Level
      {
        id: "gp_001",
        level: "A1",
        category: "tenses",
        title: "Simple Present Tense",
        titleChinese: "一般现在时",
        rule: "Use the simple present for habits, routines, and general truths. Base form for I/you/we/they, add -s/-es for he/she/it.",
        ruleChinese: "一般现在时用于习惯、日常和普遍真理。I/you/we/they用原形，he/she/it加-s/-es。",
        examples: [
          { correct: "I walk to school every day.", chinese: "我每天走路去学校。", explanation: "Habitual action" },
          { correct: "She works at a bank.", incorrect: "She work at a bank.", chinese: "她在银行工作。", explanation: "Third person singular needs -s" },
          { correct: "Water boils at 100 degrees.", chinese: "水在100度沸腾。", explanation: "General truth" },
        ],
        exercises: [
          {
            id: "ex_001_1",
            type: "fill_blank",
            prompt: "She ___ (go) to school every day.",
            promptChinese: "她每天___(去)学校。",
            correctAnswer: "goes",
            explanation: "Third person singular: go → goes",
            explanationChinese: "第三人称单数：go → goes",
          },
          {
            id: "ex_001_2",
            type: "multiple_choice",
            prompt: "Which is correct?",
            promptChinese: "哪个是正确的？",
            correctAnswer: "He likes coffee.",
            options: ["He like coffee.", "He likes coffee.", "He liking coffee."],
            explanation: "Third person singular needs -s on verb",
            explanationChinese: "第三人称单数动词需要加-s",
          },
        ],
        tips: ["Remember -s for he/she/it", "Use do/does for questions"],
        tipsChinese: ["记住he/she/it加-s", "用do/does提问"],
        commonMistakes: ["She go (incorrect) → She goes (correct)"],
        commonMistakesChinese: ["She go（错误）→ She goes（正确）"],
      },
      {
        id: "gp_002",
        level: "A1",
        category: "tenses",
        title: "Simple Past Tense",
        titleChinese: "一般过去时",
        rule: "Use the simple past for completed actions in the past. Regular verbs add -ed, irregular verbs have special forms.",
        ruleChinese: "一般过去时用于过去完成的动作。规则动词加-ed，不规则动词有特殊形式。",
        examples: [
          { correct: "I walked to school yesterday.", chinese: "我昨天走路去学校。", explanation: "Regular verb: walk → walked" },
          { correct: "She went to the store.", incorrect: "She goed to the store.", chinese: "她去了商店。", explanation: "Irregular verb: go → went" },
          { correct: "They played football last week.", chinese: "他们上周踢了足球。", explanation: "Regular verb: play → played" },
        ],
        exercises: [
          {
            id: "ex_002_1",
            type: "fill_blank",
            prompt: "I ___ (go) to the movies yesterday.",
            promptChinese: "我昨天___(去)看电影。",
            correctAnswer: "went",
            explanation: "Irregular verb: go → went",
            explanationChinese: "不规则动词：go → went",
          },
          {
            id: "ex_002_2",
            type: "correct_error",
            prompt: "Correct: She goed to school yesterday.",
            promptChinese: "修正：She goed to school yesterday.",
            correctAnswer: "She went to school yesterday.",
            explanation: "go → went (irregular)",
            explanationChinese: "go → went（不规则动词）",
          },
        ],
        tips: ["Learn irregular verb forms", "Use 'did' for questions"],
        tipsChinese: ["学习不规则动词形式", "用'did'提问"],
        commonMistakes: ["goed (incorrect) → went (correct)"],
        commonMistakesChinese: ["goed（错误）→ went（正确）"],
      },
      {
        id: "gp_003",
        level: "A1",
        category: "articles",
        title: "Articles: a, an, the",
        titleChinese: "冠词：a, an, the",
        rule: "Use 'a' before consonant sounds, 'an' before vowel sounds. Use 'the' for specific items.",
        ruleChinese: "辅音前用'a'，元音前用'an'。特指用'the'。",
        examples: [
          { correct: "I have a book.", chinese: "我有一本书。", explanation: "'a' before consonant sound" },
          { correct: "She ate an apple.", incorrect: "She ate a apple.", chinese: "她吃了一个苹果。", explanation: "'an' before vowel sound" },
          { correct: "The book is on the table.", chinese: "书在桌子上。", explanation: "'the' for specific items" },
        ],
        exercises: [
          {
            id: "ex_003_1",
            type: "fill_blank",
            prompt: "I want ___ apple.",
            promptChinese: "我想要___苹果。",
            correctAnswer: "an",
            explanation: "Use 'an' before vowel sounds",
            explanationChinese: "元音前用'an'",
          },
        ],
        tips: ["Listen to the sound, not the letter", "'the' is for specific things"],
        tipsChinese: ["听发音，不是字母", "'the'用于特指"],
        commonMistakes: ["a apple (incorrect) → an apple (correct)"],
        commonMistakesChinese: ["a apple（错误）→ an apple（正确）"],
      },
      {
        id: "gp_004",
        level: "A1",
        category: "questions",
        title: "Yes/No Questions with Be",
        titleChinese: "用be动词的是非问句",
        rule: "Put 'be' (am/is/are) before the subject to form questions.",
        ruleChinese: "把be动词（am/is/are）放在主语前面构成问句。",
        examples: [
          { correct: "Are you a student?", chinese: "你是学生吗？", explanation: "Are + subject + complement?" },
          { correct: "Is she from China?", chinese: "她来自中国吗？", explanation: "Is + subject + complement?" },
          { correct: "Am I late?", chinese: "我迟到了吗？", explanation: "Am + subject + complement?" },
        ],
        exercises: [
          {
            id: "ex_004_1",
            type: "rearrange",
            prompt: "Arrange: you / are / a teacher?",
            promptChinese: "排列：you / are / a teacher?",
            correctAnswer: "Are you a teacher?",
            explanation: "Be verb goes before subject in questions",
            explanationChinese: "问句中be动词放在主语前面",
          },
        ],
        tips: ["Be verb comes first in questions", "Use 'yes' or 'no' to answer"],
        tipsChinese: ["问句中be动词在前", "用'yes'或'no'回答"],
        commonMistakes: ["You are a student? (statement) → Are you a student? (question)"],
        commonMistakesChinese: ["You are a student?（陈述句）→ Are you a student?（问句）"],
      },
      // A2 Level
      {
        id: "gp_005",
        level: "A2",
        category: "tenses",
        title: "Present Continuous",
        titleChinese: "现在进行时",
        rule: "Use am/is/are + verb-ing for actions happening now or temporary situations.",
        ruleChinese: "用am/is/are + verb-ing表示现在正在发生或暂时的情况。",
        examples: [
          { correct: "I am reading a book.", chinese: "我正在读书。", explanation: "Action happening now" },
          { correct: "She is working today.", chinese: "她今天在工作。", explanation: "Temporary situation" },
        ],
        exercises: [
          {
            id: "ex_005_1",
            type: "fill_blank",
            prompt: "She ___ (read) a book right now.",
            promptChinese: "她现在正在___(读)书。",
            correctAnswer: "is reading",
            explanation: "am/is/are + verb-ing",
            explanationChinese: "am/is/are + 动词-ing",
          },
        ],
        tips: ["Use for now/current actions", "Some verbs don't use -ing (know, like, want)"],
        tipsChinese: ["用于现在/当前的动作", "有些动词不用-ing（know, like, want）"],
        commonMistakes: ["She is read (incorrect) → She is reading (correct)"],
        commonMistakesChinese: ["She is read（错误）→ She is reading（正确）"],
      },
      {
        id: "gp_006",
        level: "A2",
        category: "prepositions",
        title: "Prepositions of Place",
        titleChinese: "地点介词",
        rule: "Use 'in' for enclosed spaces, 'on' for surfaces, 'at' for specific locations.",
        ruleChinese: "'in'用于封闭空间，'on'用于表面，'at'用于具体位置。",
        examples: [
          { correct: "The book is in the bag.", chinese: "书在包里。", explanation: "'in' for enclosed spaces" },
          { correct: "The cup is on the table.", chinese: "杯子在桌子上。", explanation: "'on' for surfaces" },
          { correct: "She is at school.", chinese: "她在学校。", explanation: "'at' for specific locations" },
        ],
        exercises: [
          {
            id: "ex_006_1",
            type: "multiple_choice",
            prompt: "The cat is ___ the box.",
            promptChinese: "猫在盒子___。",
            correctAnswer: "in",
            options: ["in", "on", "at"],
            explanation: "'in' for enclosed spaces",
            explanationChinese: "'in'用于封闭空间",
          },
        ],
        tips: ["in = inside something", "on = on top of something", "at = specific point"],
        tipsChinese: ["in = 在里面", "on = 在上面", "at = 在具体位置"],
        commonMistakes: ["in the table (incorrect) → on the table (correct)"],
        commonMistakesChinese: ["in the table（错误）→ on the table（正确）"],
      },
    ];

    grammarPoints.forEach(point => {
      this.points.set(point.id, point);
    });
  }

  /**
   * Get grammar point by ID
   */
  getPoint(id: string): GrammarPoint | undefined {
    return this.points.get(id);
  }

  /**
   * Get grammar points by level
   */
  getPointsByLevel(level: GrammarLevel): GrammarPoint[] {
    return Array.from(this.points.values()).filter(p => p.level === level);
  }

  /**
   * Get grammar points by category
   */
  getPointsByCategory(category: GrammarCategory): GrammarPoint[] {
    return Array.from(this.points.values()).filter(p => p.category === category);
  }

  /**
   * Get all grammar points
   */
  getAllPoints(): GrammarPoint[] {
    return Array.from(this.points.values());
  }

  /**
   * Add custom grammar point
   */
  addPoint(point: GrammarPoint): void {
    this.points.set(point.id, point);
  }

  /**
   * Analyze text for grammar errors
   */
  analyzeText(text: string): GrammarAnalysis {
    const errors = this.detectErrors(text);
    const score = this.calculateScore(errors);
    const suggestions = this.generateSuggestions(errors);

    return {
      text,
      errors,
      score,
      suggestions,
    };
  }

  /**
   * Detect grammar errors
   */
  private detectErrors(text: string): GrammarError[] {
    const errors: GrammarError[] = [];
    const lowerText = text.toLowerCase();

    // Check for common tense errors
    if (lowerText.match(/\b(yesterday|last week|ago)\b/) && lowerText.match(/\b(go|like|want|have|see|eat)\b/)) {
      errors.push({
        type: "tense",
        original: text,
        corrected: text,
        rule: "Simple Past Tense",
        ruleChinese: "一般过去时",
        explanation: "Use past tense for past time expressions",
        explanationChinese: "过去时间用过去式",
      });
    }

    // Check for article errors
    if (lowerText.match(/\b(have|want|need|like)\s+(a|an)\s+(apple|egg|idea|book)/)) {
      // This is actually correct, so no error
    } else if (lowerText.match(/\b(have|want|need|like)\s+(apple|egg|idea|book)/)) {
      errors.push({
        type: "article",
        original: text,
        corrected: text,
        rule: "Articles",
        ruleChinese: "冠词",
        explanation: "Add article before singular countable noun",
        explanationChinese: "单数可数名词前加冠词",
      });
    }

    // Check for subject-verb agreement
    if (lowerText.match(/\b(he|she|it)\s+(go|like|want|have|see|eat)\b/)) {
      errors.push({
        type: "agreement",
        original: text,
        corrected: text,
        rule: "Subject-Verb Agreement",
        ruleChinese: "主谓一致",
        explanation: "Third person singular needs -s on verb",
        explanationChinese: "第三人称单数动词需要加-s",
      });
    }

    return errors;
  }

  /**
   * Calculate score
   */
  private calculateScore(errors: GrammarError[]): number {
    if (errors.length === 0) return 1;
    return Math.max(0, 1 - errors.length * 0.2);
  }

  /**
   * Generate suggestions
   */
  private generateSuggestions(errors: GrammarError[]): string[] {
    return errors.map(error => `${error.rule}: ${error.explanation}`);
  }

  /**
   * Record study progress
   */
  recordStudy(pointId: string, score: number): void {
    this.progress.set(pointId, { studied: true, score });
  }

  /**
   * Get progress
   */
  getProgress(): GrammarProgress {
    const studied = Array.from(this.progress.entries()).filter(([, p]) => p.studied);
    const mastered = studied.filter(([, p]) => p.score >= 0.8);

    const averageScore = studied.length > 0
      ? studied.reduce((sum, [, p]) => sum + p.score, 0) / studied.length
      : 0;

    // Find weak categories
    const categoryScores: Record<string, number[]> = {};
    for (const [pointId, progress] of this.progress) {
      const point = this.points.get(pointId);
      if (point) {
        if (!categoryScores[point.category]) categoryScores[point.category] = [];
        categoryScores[point.category].push(progress.score);
      }
    }

    const weakCategories = Object.entries(categoryScores)
      .filter(([, scores]) => {
        const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
        return avg < 0.7;
      })
      .map(([category]) => category);

    return {
      pointsStudied: studied.length,
      pointsMastered: mastered.length,
      averageScore,
      weakCategories,
    };
  }
}
