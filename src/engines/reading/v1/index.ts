/**
 * Reading Engine v1
 *
 * Features:
 * - Reading passages with levels
 * - Comprehension questions
 * - Vocabulary highlighting
 * - Translation support
 * - Progress tracking
 */

// ============================================================
// Types
// ============================================================

export type ReadingLevel = "beginner" | "elementary" | "intermediate" | "advanced";
export type PassageType = "narrative" | "informational" | "dialogue" | "practical" | "news";

export interface ReadingPassage {
  id: string;
  level: ReadingLevel;
  type: PassageType;
  title: string;
  titleChinese: string;
  content: string;
  chineseTranslation: string;
  vocabulary: PassageVocabulary[];
  questions: ComprehensionQuestion[];
  wordCount: number;
  estimatedTime: number; // minutes
}

export interface PassageVocabulary {
  word: string;
  ipa?: string;
  meaning: string;
  meaningChinese: string;
  example: string;
}

export interface ComprehensionQuestion {
  id: string;
  type: "multiple_choice" | "true_false" | "fill_blank" | "short_answer";
  question: string;
  questionChinese: string;
  correctAnswer: string;
  options?: string[];
  explanation: string;
  explanationChinese: string;
}

export interface ReadingAttempt {
  passageId: string;
  answers: Record<string, string>;
  score: number;
  timeSpent: number; // seconds
  timestamp: number;
}

export interface ReadingProgress {
  passagesRead: number;
  averageScore: number;
  totalWordsRead: number;
  levelProgress: Record<ReadingLevel, number>;
}

// ============================================================
// Reading Engine
// ============================================================

export class ReadingEngineV1 {
  private passages: Map<string, ReadingPassage> = new Map();
  private attempts: Map<string, ReadingAttempt[]> = new Map();

  constructor() {
    this.initializePassages();
  }

  /**
   * Initialize reading passages
   */
  private initializePassages(): void {
    const passages: ReadingPassage[] = [
      {
        id: "read_001",
        level: "beginner",
        type: "narrative",
        title: "My Family",
        titleChinese: "我的家庭",
        content: `Hello! My name is Li Wei. I am 30 years old. I have a family. My wife is named Mei. She is 28 years old. We have a son. His name is Xiao Ming. He is 5 years old. We live in Beijing. I work at a school. I am a teacher. My wife works at a hospital. She is a doctor. We are a happy family.`,
        chineseTranslation: `你好！我叫李伟。我30岁。我有一个家庭。我的妻子叫小美。她28岁。我们有一个儿子。他叫小明。他5岁。我们住在北京。我在学校工作。我是一名老师。我妻子在医院工作。她是一名医生。我们是一个幸福的家庭。`,
        vocabulary: [
          { word: "family", meaning: "a group of related people", meaningChinese: "家庭", example: "I have a happy family." },
          { word: "wife", meaning: "a married woman", meaningChinese: "妻子", example: "My wife is a doctor." },
          { word: "son", meaning: "a male child", meaningChinese: "儿子", example: "My son is 5 years old." },
          { word: "teacher", meaning: "a person who teaches", meaningChinese: "老师", example: "I am a teacher." },
          { word: "doctor", meaning: "a person who treats sick people", meaningChinese: "医生", example: "She is a doctor." },
        ],
        questions: [
          {
            id: "q_001_1",
            type: "multiple_choice",
            question: "How old is Li Wei?",
            questionChinese: "李伟多大了？",
            correctAnswer: "30",
            options: ["28", "30", "35", "40"],
            explanation: "The passage says 'I am 30 years old'",
            explanationChinese: "文章说'我30岁'",
          },
          {
            id: "q_001_2",
            type: "true_false",
            question: "Li Wei's wife is a teacher.",
            questionChinese: "李伟的妻子是老师。",
            correctAnswer: "false",
            explanation: "The passage says 'She is a doctor'",
            explanationChinese: "文章说'她是一名医生'",
          },
          {
            id: "q_001_3",
            type: "multiple_choice",
            question: "Where does Li Wei work?",
            questionChinese: "李伟在哪里工作？",
            correctAnswer: "at a school",
            options: ["at a hospital", "at a school", "at a bank", "at a store"],
            explanation: "The passage says 'I work at a school'",
            explanationChinese: "文章说'我在学校工作'",
          },
        ],
        wordCount: 95,
        estimatedTime: 5,
      },
      {
        id: "read_002",
        level: "beginner",
        type: "practical",
        title: "At the Restaurant",
        titleChinese: "在餐厅",
        content: `Welcome to our restaurant! Please sit down. Here is the menu. What would you like to eat? I would like some rice and vegetables, please. Would you like anything to drink? Yes, I would like some water, please. Here you are. Thank you! You're welcome. Enjoy your meal!`,
        chineseTranslation: `欢迎来到我们餐厅！请坐。这是菜单。你想吃什么？我想要一些米饭和蔬菜。你想要喝点什么吗？是的，我想要一些水。给你。谢谢！不客气。请享用！`,
        vocabulary: [
          { word: "restaurant", meaning: "a place to eat", meaningChinese: "餐厅", example: "Let's go to a restaurant." },
          { word: "menu", meaning: "a list of food", meaningChinese: "菜单", example: "Can I see the menu?" },
          { word: "rice", meaning: "a type of food", meaningChinese: "米饭", example: "I like rice." },
          { word: "vegetables", meaning: "healthy food from plants", meaningChinese: "蔬菜", example: "Eat more vegetables." },
          { word: "drink", meaning: "liquid to consume", meaningChinese: "饮料", example: "What drink would you like?" },
        ],
        questions: [
          {
            id: "q_002_1",
            type: "multiple_choice",
            question: "What does the customer want to eat?",
            questionChinese: "顾客想吃什么？",
            correctAnswer: "rice and vegetables",
            options: ["rice and meat", "rice and vegetables", "noodles and vegetables", "bread and vegetables"],
            explanation: "The passage says 'I would like some rice and vegetables'",
            explanationChinese: "文章说'我想要一些米饭和蔬菜'",
          },
          {
            id: "q_002_2",
            type: "true_false",
            question: "The customer wants tea.",
            questionChinese: "顾客想要茶。",
            correctAnswer: "false",
            explanation: "The passage says 'I would like some water'",
            explanationChinese: "文章说'我想要一些水'",
          },
        ],
        wordCount: 75,
        estimatedTime: 4,
      },
      {
        id: "read_003",
        level: "elementary",
        type: "informational",
        title: "Healthy Eating",
        titleChinese: "健康饮食",
        content: `Eating healthy food is very important for our body. We should eat different kinds of food every day. Fruits and vegetables are very good for us. We should eat at least five servings of fruits and vegetables every day. We should also eat whole grains like rice and bread. Protein is important too. We can get protein from meat, fish, eggs, and beans. We should drink plenty of water every day. We should eat less sugar and salt. Eating healthy helps us stay strong and feel good.`,
        chineseTranslation: `吃健康的食物对我们的身体非常重要。我们应该每天吃不同种类的食物。水果和蔬菜对我们很好。我们应该每天吃至少五份水果和蔬菜。我们也应该吃全谷物，如米饭和面包。蛋白质也很重要。我们可以从肉、鱼、鸡蛋和豆类中获取蛋白质。我们应该每天喝足够的水。我们应该少吃糖和盐。健康饮食帮助我们保持强壮和感觉良好。`,
        vocabulary: [
          { word: "healthy", meaning: "good for health", meaningChinese: "健康的", example: "Eat healthy food." },
          { word: "servings", meaning: "amounts of food", meaningChinese: "份", example: "Eat five servings of vegetables." },
          { word: "grains", meaning: "types of food like rice", meaningChinese: "谷物", example: "Whole grains are healthy." },
          { word: "protein", meaning: "food for building body", meaningChinese: "蛋白质", example: "Meat has protein." },
          { word: "sugar", meaning: "sweet food", meaningChinese: "糖", example: "Eat less sugar." },
        ],
        questions: [
          {
            id: "q_003_1",
            type: "multiple_choice",
            question: "How many servings of fruits and vegetables should we eat?",
            questionChinese: "我们应该吃多少份水果和蔬菜？",
            correctAnswer: "at least five",
            options: ["at least three", "at least five", "at least ten", "at least two"],
            explanation: "The passage says 'at least five servings'",
            explanationChinese: "文章说'至少五份'",
          },
          {
            id: "q_003_2",
            type: "true_false",
            question: "We should eat more sugar.",
            questionChinese: "我们应该多吃糖。",
            correctAnswer: "false",
            explanation: "The passage says 'We should eat less sugar'",
            explanationChinese: "文章说'我们应该少吃糖'",
          },
          {
            id: "q_003_3",
            type: "multiple_choice",
            question: "Where can we get protein?",
            questionChinese: "我们可以从哪里获取蛋白质？",
            correctAnswer: "meat, fish, eggs, and beans",
            options: ["only from meat", "meat, fish, eggs, and beans", "only from vegetables", "only from fruits"],
            explanation: "The passage lists these protein sources",
            explanationChinese: "文章列出了这些蛋白质来源",
          },
        ],
        wordCount: 130,
        estimatedTime: 6,
      },
    ];

    passages.forEach(passage => {
      this.passages.set(passage.id, passage);
    });
  }

  /**
   * Get passage by ID
   */
  getPassage(id: string): ReadingPassage | undefined {
    return this.passages.get(id);
  }

  /**
   * Get passages by level
   */
  getPassagesByLevel(level: ReadingLevel): ReadingPassage[] {
    return Array.from(this.passages.values()).filter(p => p.level === level);
  }

  /**
   * Get passages by type
   */
  getPassagesByType(type: PassageType): ReadingPassage[] {
    return Array.from(this.passages.values()).filter(p => p.type === type);
  }

  /**
   * Get all passages
   */
  getAllPassages(): ReadingPassage[] {
    return Array.from(this.passages.values());
  }

  /**
   * Add custom passage
   */
  addPassage(passage: ReadingPassage): void {
    this.passages.set(passage.id, passage);
  }

  /**
   * Submit reading attempt
   */
  submitAttempt(
    passageId: string,
    answers: Record<string, string>,
    timeSpent: number
  ): ReadingAttempt {
    const passage = this.passages.get(passageId);
    if (!passage) {
      throw new Error(`Passage not found: ${passageId}`);
    }

    // Calculate score
    let correct = 0;
    for (const question of passage.questions) {
      if (answers[question.id] === question.correctAnswer) {
        correct++;
      }
    }

    const score = passage.questions.length > 0 ? correct / passage.questions.length : 0;

    const attempt: ReadingAttempt = {
      passageId,
      answers,
      score,
      timeSpent,
      timestamp: Date.now(),
    };

    const attempts = this.attempts.get(passageId) || [];
    attempts.push(attempt);
    this.attempts.set(passageId, attempts);

    return attempt;
  }

  /**
   * Get attempts for passage
   */
  getAttempts(passageId: string): ReadingAttempt[] {
    return this.attempts.get(passageId) || [];
  }

  /**
   * Get best attempt for passage
   */
  getBestAttempt(passageId: string): ReadingAttempt | undefined {
    const attempts = this.attempts.get(passageId) || [];
    return attempts.sort((a, b) => b.score - a.score)[0];
  }

  /**
   * Get progress
   */
  getProgress(): ReadingProgress {
    const allPassages = Array.from(this.passages.values());
    const allAttempts = Array.from(this.attempts.values()).flat();

    const passagesRead = new Set(allAttempts.map(a => a.passageId)).size;
    const averageScore = allAttempts.length > 0
      ? allAttempts.reduce((sum, a) => sum + a.score, 0) / allAttempts.length
      : 0;

    const totalWordsRead = allAttempts.reduce((sum, a) => {
      const passage = this.passages.get(a.passageId);
      return sum + (passage?.wordCount || 0);
    }, 0);

    const levelProgress: Record<ReadingLevel, number> = {
      beginner: 0,
      elementary: 0,
      intermediate: 0,
      advanced: 0,
    };

    for (const level of Object.keys(levelProgress) as ReadingLevel[]) {
      const levelPassages = allPassages.filter(p => p.level === level);
      const readPassages = levelPassages.filter(p =>
        this.attempts.has(p.id)
      );
      levelProgress[level] = levelPassages.length > 0
        ? readPassages.length / levelPassages.length
        : 0;
    }

    return {
      passagesRead,
      averageScore,
      totalWordsRead,
      levelProgress,
    };
  }
}
