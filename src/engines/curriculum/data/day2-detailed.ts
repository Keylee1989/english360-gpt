/**
 * Day 2 Detailed Curriculum — Numbers & Colors
 *
 * Target: Complete beginner
 * Duration: 240 minutes
 *
 * Learning Objectives:
 * 1. Learn numbers 1-10
 * 2. Learn 5 basic colors
 * 3. Practice "What is this?"
 * 4. Practice "It is..."
 * 5. Basic counting
 */

import type { Day1Curriculum } from "./day1-detailed";

export const DAY_2_CURRICULUM: Day1Curriculum = {
  day: 2,
  title: "Numbers & Colors",
  titleChinese: "数字与颜色",
  objectives: [
    "Learn numbers 1-10",
    "Learn 5 basic colors",
    "Ask 'What is this?'",
    "Answer 'It is...'",
    "Practice counting",
  ],
  objectivesChinese: [
    "学习数字1-10",
    "学习5种基本颜色",
    "问'这是什么？'",
    "回答'它是...'",
    "练习数数",
  ],
  totalMinutes: 240,

  vocabulary: [
    {
      id: "v2_1",
      word: "one",
      ipa: "/wʌn/",
      chinese: "一",
      chinesePronunciation: "万",
      englishDefinition: "The number 1",
      example: "I have one book.",
      exampleChinese: "我有一本书。",
      memoryMethod: "谐音：万 → 一万的一",
      difficulty: "easy",
    },
    {
      id: "v2_2",
      word: "two",
      ipa: "/tuː/",
      chinese: "二",
      chinesePronunciation: "兔",
      englishDefinition: "The number 2",
      example: "I have two cats.",
      exampleChinese: "我有两只猫。",
      memoryMethod: "谐音：兔 → 两只兔子",
      difficulty: "easy",
    },
    {
      id: "v2_3",
      word: "three",
      ipa: "/θriː/",
      chinese: "三",
      chinesePronunciation: "思瑞",
      englishDefinition: "The number 3",
      example: "I have three friends.",
      exampleChinese: "我有三个朋友。",
      memoryMethod: "谐音：思瑞 → 思考瑞雪",
      difficulty: "easy",
    },
    {
      id: "v2_4",
      word: "red",
      ipa: "/rɛd/",
      chinese: "红色",
      chinesePronunciation: "瑞德",
      englishDefinition: "The color of an apple",
      example: "The apple is red.",
      exampleChinese: "苹果是红色的。",
      memoryMethod: "联想：red → 瑞德 → 红色的瑞德",
      difficulty: "easy",
    },
    {
      id: "v2_5",
      word: "blue",
      ipa: "/bluː/",
      chinese: "蓝色",
      chinesePronunciation: "布鲁",
      englishDefinition: "The color of the sky",
      example: "The sky is blue.",
      exampleChinese: "天空是蓝色的。",
      memoryMethod: "谐音：布鲁 → 布鲁斯（蓝色）",
      difficulty: "easy",
    },
    {
      id: "v2_6",
      word: "green",
      ipa: "/ɡriːn/",
      chinese: "绿色",
      chinesePronunciation: "格林",
      englishDefinition: "The color of grass",
      example: "The grass is green.",
      exampleChinese: "草是绿色的。",
      memoryMethod: "联想：green → 格林 → 格林童话里的绿色森林",
      difficulty: "easy",
    },
    {
      id: "v2_7",
      word: "what",
      ipa: "/wʌt/",
      chinese: "什么",
      chinesePronunciation: "瓦特",
      englishDefinition: "Used to ask a question",
      example: "What is this?",
      exampleChinese: "这是什么？",
      memoryMethod: "联想：what → 瓦特 → 瓦特发明了什么？",
      difficulty: "easy",
    },
    {
      id: "v2_8",
      word: "this",
      ipa: "/ðɪs/",
      chinese: "这个",
      chinesePronunciation: "迪斯",
      englishDefinition: "Used to point at something near",
      example: "This is a book.",
      exampleChinese: "这是一本书。",
      memoryMethod: "联想：this → 迪斯 → 迪斯尼这个乐园",
      difficulty: "easy",
    },
  ],

  phonics: [
    {
      letter: "F",
      sound: "/f/",
      soundChinese: "佛（上齿咬下唇）",
      example: "fish",
      exampleChinese: "鱼",
      practiceWords: ["fish", "food", "face"],
    },
    {
      letter: "G",
      sound: "/ɡ/",
      soundChinese: "哥（舌根抬起）",
      example: "girl",
      exampleChinese: "女孩",
      practiceWords: ["girl", "go", "good"],
    },
    {
      letter: "H",
      sound: "/h/",
      soundChinese: "喝（气流从喉咙出）",
      example: "hat",
      exampleChinese: "帽子",
      practiceWords: ["hat", "hot", "house"],
    },
    {
      letter: "I",
      sound: "/ɪ/",
      soundChinese: "衣（短音）",
      example: "is",
      exampleChinese: "是",
      practiceWords: ["is", "it", "in"],
    },
    {
      letter: "J",
      sound: "/dʒ/",
      soundChinese: "知（舌前端抬起）",
      example: "jump",
      exampleChinese: "跳",
      practiceWords: ["jump", "job", "juice"],
    },
  ],

  listening: [
    {
      id: "l2_1",
      text: "What color is the apple? It is red.",
      textChinese: "苹果是什么颜色？它是红色的。",
      audioSpeed: "slow",
      transcript: "What color is the apple? It is red.",
      transcriptChinese: "苹果是什么颜色？它是红色的。",
      questions: [
        {
          question: "What color is the apple?",
          questionChinese: "苹果是什么颜色？",
          options: ["blue", "red", "green"],
          correctAnswer: 1,
        },
      ],
    },
    {
      id: "l2_2",
      text: "How many books do you have? I have three books.",
      textChinese: "你有几本书？我有三本书。",
      audioSpeed: "slow",
      transcript: "How many books do you have? I have three books.",
      transcriptChinese: "你有几本书？我有三本书。",
      questions: [
        {
          question: "How many books?",
          questionChinese: "几本书？",
          options: ["one", "two", "three"],
          correctAnswer: 2,
        },
      ],
    },
  ],

  speaking: [
    {
      id: "s2_1",
      modelSentence: "What is this?",
      modelSentenceChinese: "这是什么？",
      ipa: "/wʌt ɪz ðɪs/",
      shadowingPoints: ["What is", "this"],
      commonMistakes: [
        "不要说 'What this is?'（错误语序）",
        "要说 'What is this?'（正确语序）",
      ],
      chineseHint: "英语问句：What + is + this?",
    },
    {
      id: "s2_2",
      modelSentence: "It is red.",
      modelSentenceChinese: "它是红色的。",
      ipa: "/ɪt ɪz rɛd/",
      shadowingPoints: ["It is", "red"],
      commonMistakes: [
        "不要省略 'is'",
        "完整说 'It is red.'",
      ],
      chineseHint: "回答：It is + 颜色",
    },
    {
      id: "s2_3",
      modelSentence: "I have two cats.",
      modelSentenceChinese: "我有两只猫。",
      ipa: "/aɪ hæv tuː kæts/",
      shadowingPoints: ["I have", "two cats"],
      commonMistakes: [
        "cats 要加 s（复数）",
        "two 后面用复数名词",
      ],
      chineseHint: "我有...：I have + 数量 + 名词",
    },
  ],

  reading: [
    {
      id: "r2_1",
      title: "My Room",
      titleChinese: "我的房间",
      content: `This is my room. 
It is small but nice. 
I have one bed. 
The bed is blue. 
I have two books. 
The books are red. 
I have three pens. 
The pens are green.`,
      contentChinese: `这是我的房间。
它小但很好。
我有一张床。
床是蓝色的。
我有两本书。
书是红色的。
我有三支笔。
笔是绿色的。`,
      vocabulary: ["room", "small", "nice", "bed", "books", "pens"],
      questions: [
        {
          question: "What color is the bed?",
          questionChinese: "床是什么颜色？",
          options: ["red", "blue", "green"],
          correctAnswer: 1,
        },
        {
          question: "How many books?",
          questionChinese: "几本书？",
          options: ["one", "two", "three"],
          correctAnswer: 1,
        },
      ],
    },
  ],

  writing: [
    {
      id: "w2_1",
      task: "Write numbers 1-5 in English",
      taskChinese: "用英语写数字1-5",
      hints: [
        "one, two, three, four, five",
        "注意拼写",
      ],
      example: "1-one, 2-two, 3-three, 4-four, 5-five",
      exampleChinese: "1-one, 2-two, 3-three, 4-four, 5-five",
    },
    {
      id: "w2_2",
      task: "Write 3 sentences about colors",
      taskChinese: "写3个关于颜色的句子",
      hints: [
        "The ___ is ___.",
        "例如：The sky is blue.",
      ],
      example: "The apple is red.\nThe sky is blue.\nThe grass is green.",
      exampleChinese: "苹果是红色的。\n天空是蓝色的。\n草是绿色的。",
    },
  ],

  review: [
    {
      type: "vocabulary",
      duration: 30,
      description: "Review numbers and colors",
      descriptionChinese: "复习数字和颜色",
    },
    {
      type: "listening",
      duration: 20,
      description: "Listen to color questions",
      descriptionChinese: "听颜色问题",
    },
    {
      type: "speaking",
      duration: 20,
      description: "Practice asking about colors",
      descriptionChinese: "练习问颜色",
    },
  ],

  assessment: {
    type: "quiz",
    duration: 15,
    questions: [
      {
        question: "What does 'three' mean?",
        questionChinese: "'three'是什么意思？",
        type: "multiple_choice",
        options: ["一", "二", "三"],
        correctAnswer: "三",
        explanation: "'Three' means the number 3.",
        explanationChinese: "'Three'意思是数字3。",
      },
      {
        question: "Complete: The sky is ___.",
        questionChinese: "完成句子：The sky is ___.",
        type: "fill_blank",
        correctAnswer: "blue",
        explanation: "The sky is blue. 天空是蓝色的。",
        explanationChinese: "The sky is blue. 天空是蓝色的。",
      },
      {
        question: "What color is an apple usually?",
        questionChinese: "苹果通常是什么颜色？",
        type: "multiple_choice",
        options: ["blue", "red", "green"],
        correctAnswer: "red",
        explanation: "Apples are usually red.",
        explanationChinese: "苹果通常是红色的。",
      },
    ],
  },
};

export default DAY_2_CURRICULUM;
