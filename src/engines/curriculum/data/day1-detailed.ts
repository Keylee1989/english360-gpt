/**
 * Day 1 Detailed Curriculum — Hello, English!
 *
 * Target: Complete beginner (zero English)
 * Duration: 240 minutes (4 hours)
 *
 * Learning Objectives:
 * 1. Learn alphabet sounds (A-E)
 * 2. First 8 basic words
 * 3. Simple greeting: "Hello", "Hi"
 * 4. Self introduction: "My name is..."
 * 5. Basic pronunciation practice
 */

// ============================================================
// Types
// ============================================================

export interface VocabularyWord {
  id: string;
  word: string;
  ipa: string;
  chinese: string;
  chinesePronunciation: string; // 谐音辅助
  englishDefinition: string;
  example: string;
  exampleChinese: string;
  memoryMethod: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface ListeningExercise {
  id: string;
  text: string;
  textChinese: string;
  audioSpeed: "slow" | "normal";
  transcript: string;
  transcriptChinese: string;
  questions: ListeningQuestion[];
}

export interface ListeningQuestion {
  question: string;
  questionChinese: string;
  options: string[];
  correctAnswer: number;
}

export interface SpeakingExercise {
  id: string;
  modelSentence: string;
  modelSentenceChinese: string;
  ipa: string;
  shadowingPoints: string[];
  commonMistakes: string[];
  chineseHint: string;
}

export interface ReadingPassage {
  id: string;
  title: string;
  titleChinese: string;
  content: string;
  contentChinese: string;
  vocabulary: string[];
  questions: ReadingQuestion[];
}

export interface ReadingQuestion {
  question: string;
  questionChinese: string;
  options: string[];
  correctAnswer: number;
}

export interface WritingTask {
  id: string;
  task: string;
  taskChinese: string;
  hints: string[];
  example: string;
  exampleChinese: string;
}

export interface Day1Curriculum {
  day: number;
  title: string;
  titleChinese: string;
  objectives: string[];
  objectivesChinese: string[];
  totalMinutes: number;
  vocabulary: VocabularyWord[];
  phonics: PhonicsContent[];
  listening: ListeningExercise[];
  speaking: SpeakingExercise[];
  reading: ReadingPassage[];
  writing: WritingTask[];
  review: ReviewActivity[];
  assessment: AssessmentActivity;
}

export interface PhonicsContent {
  letter: string;
  sound: string;
  soundChinese: string;
  example: string;
  exampleChinese: string;
  practiceWords: string[];
}

export interface ReviewActivity {
  type: "vocabulary" | "listening" | "speaking";
  duration: number;
  description: string;
  descriptionChinese: string;
}

export interface AssessmentActivity {
  type: "quiz";
  duration: number;
  questions: AssessmentQuestion[];
}

export interface AssessmentQuestion {
  question: string;
  questionChinese: string;
  type: "multiple_choice" | "fill_blank" | "matching";
  options?: string[];
  correctAnswer: string;
  explanation: string;
  explanationChinese: string;
}

// ============================================================
// Day 1 Curriculum Data
// ============================================================

export const DAY_1_CURRICULUM: Day1Curriculum = {
  day: 1,
  title: "Hello, English!",
  titleChinese: "你好，英语！",
  objectives: [
    "Learn alphabet sounds A-E",
    "Master 8 basic words",
    "Say hello and goodbye",
    "Introduce yourself",
    "Practice basic pronunciation",
  ],
  objectivesChinese: [
    "学习字母A-E的发音",
    "掌握8个基础单词",
    "说你好和再见",
    "自我介绍",
    "练习基本发音",
  ],
  totalMinutes: 240,

  // ============================================================
  // Vocabulary
  // ============================================================

  vocabulary: [
    {
      id: "v1",
      word: "hello",
      ipa: "/həˈloʊ/",
      chinese: "你好",
      chinesePronunciation: "哈喽",
      englishDefinition: "A greeting used when meeting someone",
      example: "Hello! How are you?",
      exampleChinese: "你好！你好吗？",
      memoryMethod: "谐音：哈喽 → 见面说哈喽",
      difficulty: "easy",
    },
    {
      id: "v2",
      word: "hi",
      ipa: "/haɪ/",
      chinese: "嗨/你好",
      chinesePronunciation: "嗨",
      englishDefinition: "An informal greeting",
      example: "Hi, my name is Li.",
      exampleChinese: "嗨，我叫李。",
      memoryMethod: "谐音：嗨 → 打招呼说嗨",
      difficulty: "easy",
    },
    {
      id: "v3",
      word: "yes",
      ipa: "/jɛs/",
      chinese: "是的",
      chinesePronunciation: "耶斯",
      englishDefinition: "Used to give a positive answer",
      example: "Yes, I understand.",
      exampleChinese: "是的，我明白。",
      memoryMethod: "谐音：耶斯 → 耶！是的！",
      difficulty: "easy",
    },
    {
      id: "v4",
      word: "no",
      ipa: "/noʊ/",
      chinese: "不/不是",
      chinesePronunciation: "诺",
      englishDefinition: "Used to give a negative answer",
      example: "No, thank you.",
      exampleChinese: "不，谢谢。",
      memoryMethod: "谐音：诺 → 承诺说不",
      difficulty: "easy",
    },
    {
      id: "v5",
      word: "name",
      ipa: "/neɪm/",
      chinese: "名字",
      chinesePronunciation: "内姆",
      englishDefinition: "What someone is called",
      example: "My name is Wang.",
      exampleChinese: "我叫王。",
      memoryMethod: "联想：name → 内姆 → 内心的名字",
      difficulty: "easy",
    },
    {
      id: "v6",
      word: "my",
      ipa: "/maɪ/",
      chinese: "我的",
      chinesePronunciation: "买",
      englishDefinition: "Belonging to me",
      example: "My book is red.",
      exampleChinese: "我的书是红色的。",
      memoryMethod: "谐音：买 → 买我的东西",
      difficulty: "easy",
    },
    {
      id: "v7",
      word: "is",
      ipa: "/ɪz/",
      chinese: "是",
      chinesePronunciation: "伊斯",
      englishDefinition: "Used with he/she/it",
      example: "She is a teacher.",
      exampleChinese: "她是老师。",
      memoryMethod: "联想：is → 他是 → 他是...",
      difficulty: "easy",
    },
    {
      id: "v8",
      word: "goodbye",
      ipa: "/ɡʊdˈbaɪ/",
      chinese: "再见",
      chinesePronunciation: "古德拜",
      englishDefinition: "A farewell expression",
      example: "Goodbye! See you tomorrow.",
      exampleChinese: "再见！明天见。",
      memoryMethod: "谐音：古德拜 → 古德拜拜",
      difficulty: "easy",
    },
  ],

  // ============================================================
  // Phonics
  // ============================================================

  phonics: [
    {
      letter: "A",
      sound: "/æ/",
      soundChinese: "啊（嘴巴张大）",
      example: "apple",
      exampleChinese: "苹果",
      practiceWords: ["apple", "ant", "cat"],
    },
    {
      letter: "B",
      sound: "/b/",
      soundChinese: "波（双唇紧闭后张开）",
      example: "book",
      exampleChinese: "书",
      practiceWords: ["book", "bag", "boy"],
    },
    {
      letter: "C",
      sound: "/k/",
      soundChinese: "科（舌根抬起）",
      example: "cat",
      exampleChinese: "猫",
      practiceWords: ["cat", "car", "cup"],
    },
    {
      letter: "D",
      sound: "/d/",
      soundChinese: "得（舌尖抵上齿龈）",
      example: "dog",
      exampleChinese: "狗",
      practiceWords: ["dog", "day", "door"],
    },
    {
      letter: "E",
      sound: "/ɛ/",
      soundChinese: "诶（嘴巴半开）",
      example: "egg",
      exampleChinese: "鸡蛋",
      practiceWords: ["egg", "elephant", "bed"],
    },
  ],

  // ============================================================
  // Listening
  // ============================================================

  listening: [
    {
      id: "l1",
      text: "Hello! My name is Li. Nice to meet you.",
      textChinese: "你好！我叫李。很高兴认识你。",
      audioSpeed: "slow",
      transcript: "Hello! My name is Li. Nice to meet you.",
      transcriptChinese: "你好！我叫李。很高兴认识你。",
      questions: [
        {
          question: "What is the person's name?",
          questionChinese: "这个人叫什么名字？",
          options: ["Li", "Wang", "Zhang"],
          correctAnswer: 0,
        },
        {
          question: "What does 'Nice to meet you' mean?",
          questionChinese: "'Nice to meet you'是什么意思？",
          options: ["再见", "很高兴认识你", "你好吗"],
          correctAnswer: 1,
        },
      ],
    },
    {
      id: "l2",
      text: "Hi! How are you? I am fine, thank you.",
      textChinese: "嗨！你好吗？我很好，谢谢。",
      audioSpeed: "slow",
      transcript: "Hi! How are you? I am fine, thank you.",
      transcriptChinese: "嗨！你好吗？我很好，谢谢。",
      questions: [
        {
          question: "How is the person feeling?",
          questionChinese: "这个人感觉怎么样？",
          options: ["不好", "很好", "一般"],
          correctAnswer: 1,
        },
      ],
    },
  ],

  // ============================================================
  // Speaking
  // ============================================================

  speaking: [
    {
      id: "s1",
      modelSentence: "Hello! My name is ___.",
      modelSentenceChinese: "你好！我叫___。",
      ipa: "/həˈloʊ maɪ neɪm ɪz/",
      shadowingPoints: ["Hello", "My name is"],
      commonMistakes: [
        "不要说 'I name is'（错误）",
        "要说 'My name is'（正确）",
      ],
      chineseHint: "记住：我的名字是 → My name is",
    },
    {
      id: "s2",
      modelSentence: "Nice to meet you.",
      modelSentenceChinese: "很高兴认识你。",
      ipa: "/naɪs tə miːt juː/",
      shadowingPoints: ["Nice to", "meet you"],
      commonMistakes: [
        "meet 发音像 '米特'",
        "you 发音像 '优'",
      ],
      chineseHint: "见面时说：Nice to meet you",
    },
    {
      id: "s3",
      modelSentence: "How are you?",
      modelSentenceChinese: "你好吗？",
      ipa: "/haʊ ɑːr juː/",
      shadowingPoints: ["How are", "you"],
      commonMistakes: [
        "are 不要发成 '啊'",
        "完整的 'How are you?'",
      ],
      chineseHint: "问别人怎么样：How are you?",
    },
  ],

  // ============================================================
  // Reading
  // ============================================================

  reading: [
    {
      id: "r1",
      title: "My First Day",
      titleChinese: "我的第一天",
      content: `Hello! My name is Li Wei. I am from China. 
Today is my first day learning English. 
I want to say "Hello" to everyone. 
Nice to meet you!`,
      contentChinese: `你好！我叫李伟。我来自中国。
今天是我学习英语的第一天。
我想对大家说"你好"。
很高兴认识你！`,
      vocabulary: ["name", "from", "today", "first", "learning", "everyone"],
      questions: [
        {
          question: "Where is Li Wei from?",
          questionChinese: "李伟来自哪里？",
          options: ["America", "China", "England"],
          correctAnswer: 1,
        },
        {
          question: "What does Li Wei want to say?",
          questionChinese: "李伟想说什么？",
          options: ["Goodbye", "Hello", "Sorry"],
          correctAnswer: 1,
        },
      ],
    },
  ],

  // ============================================================
  // Writing
  // ============================================================

  writing: [
    {
      id: "w1",
      task: "Write your name in English",
      taskChinese: "用英语写你的名字",
      hints: [
        "使用拼音写你的名字",
        "例如：李伟 → Li Wei",
        "名字首字母大写",
      ],
      example: "My name is Li Wei.",
      exampleChinese: "我叫李伟。",
    },
    {
      id: "w2",
      task: "Write 3 words you learned today",
      taskChinese: "写出今天学的3个单词",
      hints: [
        "可以从词汇表中选择",
        "写出单词和中文意思",
        "例如：hello - 你好",
      ],
      example: "hello - 你好\nname - 名字\nyes - 是的",
      exampleChinese: "hello - 你好\nname - 名字\nyes - 是的",
    },
  ],

  // ============================================================
  // Review
  // ============================================================

  review: [
    {
      type: "vocabulary",
      duration: 30,
      description: "Review all 8 vocabulary words",
      descriptionChinese: "复习全部8个单词",
    },
    {
      type: "listening",
      duration: 20,
      description: "Listen to dialogues again",
      descriptionChinese: "再次听对话",
    },
    {
      type: "speaking",
      duration: 20,
      description: "Practice saying all sentences",
      descriptionChinese: "练习说所有句子",
    },
  ],

  // ============================================================
  // Assessment
  // ============================================================

  assessment: {
    type: "quiz",
    duration: 15,
    questions: [
      {
        question: "What does 'hello' mean?",
        questionChinese: "'hello'是什么意思？",
        type: "multiple_choice",
        options: ["再见", "你好", "谢谢"],
        correctAnswer: "你好",
        explanation: "'Hello' is a greeting used when meeting someone.",
        explanationChinese: "'Hello'是见面时用的问候语。",
      },
      {
        question: "Complete: My ___ is Li.",
        questionChinese: "完成句子：My ___ is Li.",
        type: "fill_blank",
        correctAnswer: "name",
        explanation: "'My name is' is used to introduce yourself.",
        explanationChinese: "'My name is'用来介绍自己。",
      },
      {
        question: "Match: goodbye = ?",
        questionChinese: "匹配：goodbye = ?",
        type: "matching",
        options: ["你好", "再见", "谢谢"],
        correctAnswer: "再见",
        explanation: "'Goodbye' means farewell.",
        explanationChinese: "'Goodbye'意思是再见。",
      },
    ],
  },
};

// ============================================================
// Export
// ============================================================

export default DAY_1_CURRICULUM;
