/**
 * Input Library System v1
 *
 * Provides structured listening input for language learning:
 * - Level-appropriate content
 * - Audio with transcripts
 * - Vocabulary highlighting
 * - Comprehension questions
 * - Shadowing support
 *
 * Target: 500+ hours of comprehensible input over 360 days
 */

// ============================================================
// Types
// ============================================================

export type InputLevel = "A1" | "A2" | "B1" | "B2";
export type InputType = "slow_daily" | "conversation" | "news_simple" | "interview" | "story" | "lecture";

export interface InputContent {
  id: string;
  level: InputLevel;
  type: InputType;
  title: string;
  titleChinese: string;

  // Audio
  audioUrl?: string;
  audioDuration: number; // seconds
  speed: "slow" | "normal" | "fast";

  // Transcript
  transcript: string;
  chineseTranslation: string;

  // Vocabulary
  vocabulary: InputVocabulary[];

  // Questions
  questions: InputQuestion[];

  // Shadowing
  shadowingPoints: ShadowingPoint[];

  // Metadata
  wordCount: number;
  estimatedMinutes: number;
  tags: string[];
}

export interface InputVocabulary {
  word: string;
  ipa?: string;
  meaning: string;
  meaningChinese: string;
  example: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface InputQuestion {
  id: string;
  type: "comprehension" | "vocabulary" | "inference" | "detail";
  question: string;
  questionChinese: string;
  correctAnswer: string;
  options?: string[];
  explanation: string;
  explanationChinese: string;
}

export interface ShadowingPoint {
  startMs: number;
  endMs: number;
  text: string;
  chineseText: string;
  stress?: "primary" | "secondary" | "none";
}

export interface InputProgress {
  contentId: string;
  userId: string;
  completed: boolean;
  score: number;
  timeSpent: number; // seconds
  timestamp: number;
}

export interface ListeningStats {
  totalMinutes: number;
  totalContent: number;
  averageScore: number;
  levelProgress: Record<InputLevel, number>;
}

// ============================================================
// Input Library Engine
// ============================================================

export class InputLibraryEngineV1 {
  private content: Map<string, InputContent> = new Map();
  private progress: Map<string, InputProgress[]> = new Map();

  constructor() {
    this.initializeContent();
  }

  /**
   * Initialize input content
   */
  private initializeContent(): void {
    const contents: InputContent[] = [
      // A1 Level: Slow Daily English
      {
        id: "input_001",
        level: "A1",
        type: "slow_daily",
        title: "Morning Routine",
        titleChinese: "早晨日常",
        audioDuration: 120,
        speed: "slow",
        transcript: "I wake up at 7 o'clock. I brush my teeth. I take a shower. I eat breakfast. I drink coffee. I go to work. I start work at 9 o'clock.",
        chineseTranslation: "我7点起床。我刷牙。我洗澡。我吃早餐。我喝咖啡。我去上班。我9点开始工作。",
        vocabulary: [
          { word: "wake up", meaning: "stop sleeping", meaningChinese: "醒来", example: "I wake up at 7.", difficulty: "easy" },
          { word: "brush", meaning: "clean with a brush", meaningChinese: "刷", example: "I brush my teeth.", difficulty: "easy" },
          { word: "shower", meaning: "wash body with water", meaningChinese: "洗澡", example: "I take a shower.", difficulty: "easy" },
          { word: "breakfast", meaning: "first meal of day", meaningChinese: "早餐", example: "I eat breakfast.", difficulty: "easy" },
        ],
        questions: [
          {
            id: "q_001_1",
            type: "comprehension",
            question: "What time does the person wake up?",
            questionChinese: "这个人几点起床？",
            correctAnswer: "7 o'clock",
            options: ["6 o'clock", "7 o'clock", "8 o'clock", "9 o'clock"],
            explanation: "The text says 'I wake up at 7 o'clock'",
            explanationChinese: "文章说'我7点起床'",
          },
          {
            id: "q_001_2",
            type: "detail",
            question: "What does the person drink?",
            questionChinese: "这个人喝什么？",
            correctAnswer: "coffee",
            options: ["tea", "coffee", "water", "juice"],
            explanation: "The text says 'I drink coffee'",
            explanationChinese: "文章说'我喝咖啡'",
          },
        ],
        shadowingPoints: [
          { startMs: 0, endMs: 2000, text: "I wake up at 7 o'clock.", chineseText: "我7点起床。", stress: "primary" },
          { startMs: 2000, endMs: 4000, text: "I brush my teeth.", chineseText: "我刷牙。", stress: "primary" },
          { startMs: 4000, endMs: 6000, text: "I take a shower.", chineseText: "我洗澡。", stress: "primary" },
        ],
        wordCount: 70,
        estimatedMinutes: 5,
        tags: ["daily", "routine", "basic"],
      },
      {
        id: "input_002",
        level: "A1",
        type: "slow_daily",
        title: "At the Store",
        titleChinese: "在商店",
        audioDuration: 150,
        speed: "slow",
        transcript: "Hello! Can I help you? Yes, I want to buy a shirt. What color? Blue, please. Here you are. How much? It's 20 dollars. Here is the money. Thank you! Goodbye!",
        chineseTranslation: "你好！需要帮忙吗？是的，我想买一件衬衫。什么颜色？蓝色的。给你。多少钱？20美元。给你钱。谢谢！再见！",
        vocabulary: [
          { word: "buy", meaning: "get something with money", meaningChinese: "买", example: "I want to buy a shirt.", difficulty: "easy" },
          { word: "shirt", meaning: "a type of clothing", meaningChinese: "衬衫", example: "This shirt is nice.", difficulty: "easy" },
          { word: "color", meaning: "red, blue, green, etc.", meaningChinese: "颜色", example: "What color do you want?", difficulty: "easy" },
          { word: "money", meaning: "coins and bills", meaningChinese: "钱", example: "Here is the money.", difficulty: "easy" },
        ],
        questions: [
          {
            id: "q_002_1",
            type: "comprehension",
            question: "What does the person want to buy?",
            questionChinese: "这个人想买什么？",
            correctAnswer: "a shirt",
            options: ["a shirt", "a hat", "shoes", "a coat"],
            explanation: "The text says 'I want to buy a shirt'",
            explanationChinese: "文章说'我想买一件衬衫'",
          },
          {
            id: "q_002_2",
            type: "detail",
            question: "How much does the shirt cost?",
            questionChinese: "这件衬衫多少钱？",
            correctAnswer: "20 dollars",
            options: ["10 dollars", "20 dollars", "30 dollars", "40 dollars"],
            explanation: "The text says 'It's 20 dollars'",
            explanationChinese: "文章说'20美元'",
          },
        ],
        shadowingPoints: [
          { startMs: 0, endMs: 2000, text: "Hello! Can I help you?", chineseText: "你好！需要帮忙吗？", stress: "primary" },
          { startMs: 2000, endMs: 4000, text: "Yes, I want to buy a shirt.", chineseText: "是的，我想买一件衬衫。", stress: "primary" },
          { startMs: 4000, endMs: 6000, text: "What color?", chineseText: "什么颜色？", stress: "primary" },
        ],
        wordCount: 65,
        estimatedMinutes: 6,
        tags: ["shopping", "dialogue", "basic"],
      },
      // A2 Level: Daily Conversations
      {
        id: "input_003",
        level: "A2",
        type: "conversation",
        title: "Making Plans",
        titleChinese: "制定计划",
        audioDuration: 180,
        speed: "normal",
        transcript: "Hey, what are you doing this weekend? I'm thinking about going to the movies. Do you want to come? Sure! What movie do you want to see? How about the new action movie? That sounds great! What time should we meet? Let's meet at 2 o'clock at the cinema. Perfect! See you then!",
        chineseTranslation: "嘿，你这个周末做什么？我在想去看电影。你想来吗？当然！你想看什么电影？那部新的动作片怎么样？听起来很好！我们应该几点见面？我们2点在电影院见。完美！到时候见！",
        vocabulary: [
          { word: "weekend", meaning: "Saturday and Sunday", meaningChinese: "周末", example: "What are you doing this weekend?", difficulty: "easy" },
          { word: "movie", meaning: "a film", meaningChinese: "电影", example: "Let's watch a movie.", difficulty: "easy" },
          { word: "action", meaning: "exciting, fast", meaningChinese: "动作", example: "An action movie.", difficulty: "medium" },
          { word: "cinema", meaning: "movie theater", meaningChinese: "电影院", example: "Meet me at the cinema.", difficulty: "medium" },
        ],
        questions: [
          {
            id: "q_003_1",
            type: "comprehension",
            question: "What are they planning to do?",
            questionChinese: "他们计划做什么？",
            correctAnswer: "go to the movies",
            options: ["go to the movies", "go to the park", "go to the restaurant", "go shopping"],
            explanation: "The text says 'going to the movies'",
            explanationChinese: "文章说'去看电影'",
          },
          {
            id: "q_003_2",
            type: "detail",
            question: "What time will they meet?",
            questionChinese: "他们几点见面？",
            correctAnswer: "2 o'clock",
            options: ["1 o'clock", "2 o'clock", "3 o'clock", "4 o'clock"],
            explanation: "The text says 'Let's meet at 2 o'clock'",
            explanationChinese: "文章说'我们2点见面'",
          },
        ],
        shadowingPoints: [
          { startMs: 0, endMs: 3000, text: "Hey, what are you doing this weekend?", chineseText: "嘿，你这个周末做什么？", stress: "primary" },
          { startMs: 3000, endMs: 6000, text: "I'm thinking about going to the movies.", chineseText: "我在想去看电影。", stress: "primary" },
          { startMs: 6000, endMs: 9000, text: "Do you want to come?", chineseText: "你想来吗？", stress: "primary" },
        ],
        wordCount: 95,
        estimatedMinutes: 8,
        tags: ["planning", "conversation", "social"],
      },
    ];

    contents.forEach(content => {
      this.content.set(content.id, content);
    });
  }

  /**
   * Get content by ID
   */
  getContent(id: string): InputContent | undefined {
    return this.content.get(id);
  }

  /**
   * Get content by level
   */
  getContentByLevel(level: InputLevel): InputContent[] {
    return Array.from(this.content.values()).filter(c => c.level === level);
  }

  /**
   * Get content by type
   */
  getContentByType(type: InputType): InputContent[] {
    return Array.from(this.content.values()).filter(c => c.type === type);
  }

  /**
   * Get all content
   */
  getAllContent(): InputContent[] {
    return Array.from(this.content.values());
  }

  /**
   * Add custom content
   */
  addContent(content: InputContent): void {
    this.content.set(content.id, content);
  }

  /**
   * Record progress
   */
  recordProgress(progress: InputProgress): void {
    const userProgress = this.progress.get(progress.userId) || [];
    userProgress.push(progress);
    this.progress.set(progress.userId, userProgress);
  }

  /**
   * Get user progress
   */
  getUserProgress(userId: string): InputProgress[] {
    return this.progress.get(userId) || [];
  }

  /**
   * Get listening stats
   */
  getListeningStats(userId: string): ListeningStats {
    const userProgress = this.getUserProgress(userId);
    const completedProgress = userProgress.filter(p => p.completed);

    const totalMinutes = completedProgress.reduce((sum, p) => {
      const content = this.content.get(p.contentId);
      return sum + (content?.estimatedMinutes || 0);
    }, 0);

    const totalContent = completedProgress.length;

    const averageScore = completedProgress.length > 0
      ? completedProgress.reduce((sum, p) => sum + p.score, 0) / completedProgress.length
      : 0;

    const levelProgress: Record<InputLevel, number> = {
      A1: 0,
      A2: 0,
      B1: 0,
      B2: 0,
    };

    const allContent = Array.from(this.content.values());
    for (const level of Object.keys(levelProgress) as InputLevel[]) {
      const levelContent = allContent.filter(c => c.level === level);
      const completedLevel = levelContent.filter(c =>
        completedProgress.some(p => p.contentId === c.id)
      );
      levelProgress[level] = levelContent.length > 0
        ? completedLevel.length / levelContent.length
        : 0;
    }

    return {
      totalMinutes,
      totalContent,
      averageScore,
      levelProgress,
    };
  }

  /**
   * Get recommended content
   */
  getRecommendedContent(userId: string, level: InputLevel): InputContent[] {
    const userProgress = this.getUserProgress(userId);
    const completedIds = new Set(userProgress.filter(p => p.completed).map(p => p.contentId));

    return Array.from(this.content.values())
      .filter(c => c.level === level && !completedIds.has(c.id))
      .sort((a, b) => a.estimatedMinutes - b.estimatedMinutes)
      .slice(0, 5);
  }
}
