/**
 * Error Patterns Database
 *
 * Common mistakes made by Chinese English learners
 * Used by AI Tutor for error detection and correction
 */

// ============================================================
// Types
// ============================================================

export interface ErrorPattern {
  id: string;
  type: ErrorType;
  description: string;
  descriptionChinese: string;
  examples: ErrorExample[];
  rule: string;
  ruleChinese: string;
  tips: string[];
  tipsChinese: string[];
  frequency: "high" | "medium" | "low";
  level: "beginner" | "intermediate" | "advanced";
}

export interface ErrorExample {
  incorrect: string;
  correct: string;
  explanation: string;
  explanationChinese: string;
}

export type ErrorType =
  | "article"
  | "past_tense"
  | "plural"
  | "preposition"
  | "word_order"
  | "pronunciation"
  | "verb_tense"
  | "subject_verb"
  | "word_choice"
  | "missing_word"
  | "extra_word"
  | "punctuation";

// ============================================================
// Error Patterns Data
// ============================================================

export const ERROR_PATTERNS: ErrorPattern[] = [
  // ============================================================
  // Article Errors
  // ============================================================
  {
    id: "err_article_001",
    type: "article",
    description: "Missing article before singular countable noun",
    descriptionChinese: "单数可数名词前缺少冠词",
    examples: [
      {
        incorrect: "I want book.",
        correct: "I want a book.",
        explanation: "Use 'a' before singular countable nouns",
        explanationChinese: "单数可数名词前需要加 'a'",
      },
      {
        incorrect: "She is teacher.",
        correct: "She is a teacher.",
        explanation: "Use 'a' before job titles",
        explanationChinese: "职业名词前需要加 'a'",
      },
    ],
    rule: "Use 'a/an' before singular countable nouns",
    ruleChinese: "单数可数名词前使用 'a/an'",
    tips: ["Think: one + noun = a + noun", "Every singular noun needs something before it"],
    tipsChinese: ["想想：一个 + 名词 = a + 名词", "每个单数名词前面都需要东西"],
    frequency: "high",
    level: "beginner",
  },
  {
    id: "err_article_002",
    type: "article",
    description: "Using 'the' when not specific",
    descriptionChinese: "在不具体的情况下使用 'the'",
    examples: [
      {
        incorrect: "I like the music.",
        correct: "I like music.",
        explanation: "Don't use 'the' for general things",
        explanationChinese: "泛指的事物不用 'the'",
      },
    ],
    rule: "Don't use 'the' for general/non-specific nouns",
    ruleChinese: "泛指/非具体名词不用 'the'",
    tips: ["Ask yourself: which one? If not specific, don't use 'the'"],
    tipsChinese: ["问自己：哪一个？如果不具体，就不需要用 'the'"],
    frequency: "medium",
    level: "beginner",
  },

  // ============================================================
  // Past Tense Errors
  // ============================================================
  {
    id: "err_past_001",
    type: "past_tense",
    description: "Using present tense with past time words",
    descriptionChinese: "过去时间词与现在时态混用",
    examples: [
      {
        incorrect: "I go to school yesterday.",
        correct: "I went to school yesterday.",
        explanation: "'Yesterday' requires past tense",
        explanationChinese: "'yesterday' 需要用过去式",
      },
      {
        incorrect: "She eat breakfast this morning.",
        correct: "She ate breakfast this morning.",
        explanation: "'This morning' (already passed) requires past tense",
        explanationChinese: "'this morning'（已过去）需要用过去式",
      },
    ],
    rule: "Use past tense verbs with past time words (yesterday, last week, ago)",
    ruleChinese: "过去时间词（yesterday, last week, ago）使用过去式",
    tips: ["Look for time clues: yesterday, last, ago, in 2020", "Change verb: go→went, eat→ate, see→saw"],
    tipsChinese: ["找时间线索：yesterday, last, ago, in 2020", "变换动词：go→went, eat→ate, see→saw"],
    frequency: "high",
    level: "beginner",
  },
  {
    id: "err_past_002",
    type: "past_tense",
    description: "Irregular past tense errors",
    descriptionChinese: "不规则过去式错误",
    examples: [
      {
        incorrect: "I buyed a book.",
        correct: "I bought a book.",
        explanation: "'Buy' is irregular: buy → bought",
        explanationChinese: "'buy' 是不规则动词：buy → bought",
      },
      {
        incorrect: "He writed a letter.",
        correct: "He wrote a letter.",
        explanation: "'Write' is irregular: write → wrote",
        explanationChinese: "'write' 是不规则动词：write → wrote",
      },
    ],
    rule: "Memorize common irregular verbs",
    ruleChinese: "记住常见的不规则动词",
    tips: ["Common irregulars: go→went, see→saw, come→came, take→took", "Practice with flashcards"],
    tipsChinese: ["常见不规则动词：go→went, see→saw, come→came, take→took", "用闪卡练习"],
    frequency: "high",
    level: "beginner",
  },

  // ============================================================
  // Plural Errors
  // ============================================================
  {
    id: "err_plural_001",
    type: "plural",
    description: "Missing plural 's' after numbers > 1",
    descriptionChinese: "数字大于1时缺少复数 's'",
    examples: [
      {
        incorrect: "I have two cat.",
        correct: "I have two cats.",
        explanation: "Use plural form after numbers greater than 1",
        explanationChinese: "数字大于1时使用复数形式",
      },
      {
        incorrect: "She has three book.",
        correct: "She has three books.",
        explanation: "Countable nouns need plural 's' after numbers",
        explanationChinese: "可数名词在数字后需要复数 's'",
      },
    ],
    rule: "Add 's' to countable nouns after numbers > 1",
    ruleChinese: "数字大于1时可数名词加 's'",
    tips: ["One cat, two cats", "One book, three books"],
    tipsChinese: ["一只猫 two cats", "一本书 three books"],
    frequency: "high",
    level: "beginner",
  },

  // ============================================================
  // Preposition Errors
  // ============================================================
  {
    id: "err_prep_001",
    type: "preposition",
    description: "Wrong preposition with time",
    descriptionChinese: "时间介词错误",
    examples: [
      {
        incorrect: "I wake up in 7 o'clock.",
        correct: "I wake up at 7 o'clock.",
        explanation: "Use 'at' for specific times",
        explanationChinese: "具体时间用 'at'",
      },
      {
        incorrect: "I was born on 1990.",
        correct: "I was born in 1990.",
        explanation: "Use 'in' for years",
        explanationChinese: "年份用 'in'",
      },
    ],
    rule: "at = specific time, in = year/month, on = day/date",
    ruleChinese: "at = 具体时间，in = 年/月，on = 日/日期",
    tips: ["At 3 o'clock, in January, on Monday"],
    tipsChinese: ["At 3点, in 一月, on 星期一"],
    frequency: "medium",
    level: "beginner",
  },
  {
    id: "err_prep_002",
    type: "preposition",
    description: "Missing preposition 'to' with 'go'",
    descriptionChinese: "'go' 后缺少介词 'to'",
    examples: [
      {
        incorrect: "I go school.",
        correct: "I go to school.",
        explanation: "'Go' requires 'to' before a place",
        explanationChinese: "'go' 后面需要 'to' 再接地点",
      },
      {
        incorrect: "She go home.",
        correct: "She goes home.",
        explanation: "'Home' doesn't need 'to', but verb needs conjugation",
        explanationChinese: "'home' 不需要 'to'，但动词需要变形",
      },
    ],
    rule: "Go + to + place (except home)",
    ruleChinese: "Go + to + 地点（home 除外）",
    tips: ["Go to school, go to work, go to the store", "Go home (no 'to')"],
    tipsChinese: ["Go to school, go to work, go to the store", "Go home（不用 'to'）"],
    frequency: "high",
    level: "beginner",
  },

  // ============================================================
  // Word Order Errors
  // ============================================================
  {
    id: "err_order_001",
    type: "word_order",
    description: "Question word order error",
    descriptionChinese: "疑问句语序错误",
    examples: [
      {
        incorrect: "What you want?",
        correct: "What do you want?",
        explanation: "Questions need auxiliary verb 'do'",
        explanationChinese: "疑问句需要助动词 'do'",
      },
      {
        incorrect: "Where you go?",
        correct: "Where do you go?",
        explanation: "Use 'do' in present tense questions",
        explanationChinese: "现在时疑问句用 'do'",
      },
    ],
    rule: "Question word + do/does + subject + verb",
    ruleChinese: "疑问词 + do/does + 主语 + 动词",
    tips: ["What do you...? Where does she...? How do I...?"],
    tipsChinese: ["What do you...? Where does she...? How do I...?"],
    frequency: "high",
    level: "beginner",
  },
  {
    id: "err_order_002",
    type: "word_order",
    description: "Adjective position error",
    descriptionChinese: "形容词位置错误",
    examples: [
      {
        incorrect: "I have a red big car.",
        correct: "I have a big red car.",
        explanation: "Size comes before color in English",
        explanationChinese: "英语中大小在颜色前面",
      },
    ],
    rule: "Order: opinion → size → age → shape → color → origin → material → purpose",
    ruleChinese: "顺序：观点 → 大小 → 年龄 → 形状 → 颜色 → 来源 → 材料 → 用途",
    tips: ["Think: a beautiful small old round red Italian wooden dining table"],
    tipsChinese: ["想想：一个漂亮的 小的 旧的 圆的 红色的 意大利的 木质的 餐桌"],
    frequency: "medium",
    level: "intermediate",
  },

  // ============================================================
  // Verb Tense Errors
  // ============================================================
  {
    id: "err_verb_001",
    type: "verb_tense",
    description: "Missing 'be' verb",
    descriptionChinese: "缺少 'be' 动词",
    examples: [
      {
        incorrect: "She happy.",
        correct: "She is happy.",
        explanation: "Sentences need a verb - use 'is' with adjectives",
        explanationChinese: "句子需要动词 - 形容词前用 'is'",
      },
      {
        incorrect: "They at home.",
        correct: "They are at home.",
        explanation: "Use 'are' with 'they'",
        explanationChinese: "'they' 用 'are'",
      },
    ],
    rule: "Every sentence needs a verb. Use am/is/are + adjective/preposition",
    ruleChinese: "每个句子都需要动词。用 am/is/are + 形容词/介词",
    tips: ["I am, He/She/It is, We/You/They are"],
    tipsChinese: ["I am, He/She/It is, We/You/They are"],
    frequency: "high",
    level: "beginner",
  },
  {
    id: "err_verb_002",
    type: "verb_tense",
    description: "Wrong verb form after 'can'",
    descriptionChinese: "'can' 后动词形式错误",
    examples: [
      {
        incorrect: "I can speaks English.",
        correct: "I can speak English.",
        explanation: "'Can' is always followed by base form verb",
        explanationChinese: "'can' 后面永远用动词原形",
      },
    ],
    rule: "can + base form (can speak, can eat, can go)",
    ruleChinese: "can + 动词原形（can speak, can eat, can go）",
    tips: ["Can + verb (no -s, no -ing, no -ed)"],
    tipsChinese: ["Can + 动词（不加 -s, -ing, -ed）"],
    frequency: "medium",
    level: "beginner",
  },

  // ============================================================
  // Subject-Verb Agreement
  // ============================================================
  {
    id: "err_sva_001",
    type: "subject_verb",
    description: "Third person singular -s missing",
    descriptionChinese: "第三人称单数 -s 缺失",
    examples: [
      {
        incorrect: "She like music.",
        correct: "She likes music.",
        explanation: "Add -s for he/she/it in present tense",
        explanationChinese: "he/she/it 在现在时加 -s",
      },
      {
        incorrect: "He go to school.",
        correct: "He goes to school.",
        explanation: "Use -es for verbs ending in -o, -s, -sh, -ch, -x",
        explanationChinese: "以 -o, -s, -sh, -ch, -x 结尾的动词加 -es",
      },
    ],
    rule: "He/She/It + verb-s (present tense)",
    ruleChinese: "He/She/It + 动词-s（现在时）",
    tips: ["I like, He likes", "I go, She goes"],
    tipsChinese: ["I like, He likes", "I go, She goes"],
    frequency: "high",
    level: "beginner",
  },

  // ============================================================
  // Word Choice Errors
  // ============================================================
  {
    id: "err_choice_001",
    type: "word_choice",
    description: "Confusing 'very like' (Chinese interference)",
    descriptionChinese: "混淆 'very like'（中文干扰）",
    examples: [
      {
        incorrect: "I very like apples.",
        correct: "I really like apples.",
        explanation: "In English, use 'really' not 'very' with verbs",
        explanationChinese: "英语中动词前用 'really' 不用 'very'",
      },
    ],
    rule: "Use 'really' with verbs, 'very' with adjectives",
    ruleChinese: "动词前用 'really'，形容词前用 'very'",
    tips: ["Very + adjective (very big, very good)", "Really + verb (really like, really want)"],
    tipsChinese: ["Very + 形容词（very big, very good）", "Really + 动词（really like, really want）"],
    frequency: "high",
    level: "beginner",
  },
  {
    id: "err_choice_002",
    type: "word_choice",
    description: "Confusing 'borrow' and 'lend'",
    descriptionChinese: "混淆 'borrow' 和 'lend'",
    examples: [
      {
        incorrect: "Can you borrow me your pen?",
        correct: "Can you lend me your pen?",
        explanation: "Lend = give temporarily, Borrow = take temporarily",
        explanationChinese: "Lend = 临时给别人，Borrow = 临时拿别人的",
      },
    ],
    rule: "Lend = give, Borrow = take",
    ruleChinese: "Lend = 给，Borrow = 拿",
    tips: ["I lend you = 我借给你", "I borrow from you = 我从你那借"],
    tipsChinese: ["I lend you = 我借给你", "I borrow from you = 我从你那借"],
    frequency: "medium",
    level: "beginner",
  },

  // ============================================================
  // Missing Word Errors
  // ============================================================
  {
    id: "err_missing_001",
    type: "missing_word",
    description: "Missing 'do' in questions",
    descriptionChinese: "疑问句中缺少 'do'",
    examples: [
      {
        incorrect: "You like coffee?",
        correct: "Do you like coffee?",
        explanation: "Present tense questions need 'do'",
        explanationChinese: "现在时疑问句需要 'do'",
      },
    ],
    rule: "Do + subject + verb...? (present tense)",
    ruleChinese: "Do + 主语 + 动词...?（现在时）",
    tips: ["Do you...? Does he...? Do they...?"],
    tipsChinese: ["Do you...? Does he...? Do they...?"],
    frequency: "high",
    level: "beginner",
  },

  // ============================================================
  // Extra Word Errors
  // ============================================================
  {
    id: "err_extra_001",
    type: "extra_word",
    description: "Extra 'to' with 'go'",
    descriptionChinese: "'go' 后多余的 'to'",
    examples: [
      {
        incorrect: "I go to home.",
        correct: "I go home.",
        explanation: "'Home' is an adverb - don't use 'to' with it",
        explanationChinese: "'home' 是副词，前面不用 'to'",
      },
    ],
    rule: "Go home (no 'to'), but go to school/work/store",
    ruleChinese: "Go home（不用 'to'），但 go to school/work/store",
    tips: ["Home is special - no preposition needed"],
    tipsChinese: ["Home 很特殊 - 不需要介词"],
    frequency: "medium",
    level: "beginner",
  },

  // ============================================================
  // Pronunciation Errors (for reference)
  // ============================================================
  {
    id: "err_pron_001",
    type: "pronunciation",
    description: "Confusing /l/ and /r/",
    descriptionChinese: "混淆 /l/ 和 /r/",
    examples: [
      {
        incorrect: "lice (想说 rice)",
        correct: "rice",
        explanation: "Chinese speakers often confuse /l/ and /r/",
        explanationChinese: "中文母语者常混淆 /l/ 和 /r/",
      },
    ],
    rule: "/l/ = tongue touches roof, /r/ = tongue doesn't touch",
    ruleChinese: "/l/ = 舌头碰上颚，/r/ = 舌头不碰",
    tips: ["Practice: light, right, lake, rake"],
    tipsChinese: ["练习：light, right, lake, rake"],
    frequency: "high",
    level: "beginner",
  },
  {
    id: "err_pron_002",
    type: "pronunciation",
    description: "Confusing /θ/ and /s/",
    descriptionChinese: "混淆 /θ/ 和 /s/",
    examples: [
      {
        incorrect: "sink (想说 think)",
        correct: "think",
        explanation: "/θ/ requires tongue between teeth",
        explanationChinese: "/θ/ 需要舌头放在牙齿之间",
      },
    ],
    rule: "/θ/ = tongue between teeth (think, three)",
    ruleChinese: "/θ/ = 舌头放在牙齿之间（think, three）",
    tips: ["Practice: think, three, thank, bath"],
    tipsChinese: ["练习：think, three, thank, bath"],
    frequency: "high",
    level: "beginner",
  },
];

// ============================================================
// Helper Functions
// ============================================================

/**
 * Find error patterns by type
 */
export function getErrorPatternsByType(type: ErrorType): ErrorPattern[] {
  return ERROR_PATTERNS.filter((p) => p.type === type);
}

/**
 * Find error patterns by level
 */
export function getErrorPatternsByLevel(level: ErrorPattern["level"]): ErrorPattern[] {
  return ERROR_PATTERNS.filter((p) => p.level === level);
}

/**
 * Find high-frequency error patterns
 */
export function getHighFrequencyErrors(): ErrorPattern[] {
  return ERROR_PATTERNS.filter((p) => p.frequency === "high");
}

/**
 * Find error pattern by ID
 */
export function getErrorPatternById(id: string): ErrorPattern | undefined {
  return ERROR_PATTERNS.find((p) => p.id === id);
}

/**
 * Get all error types
 */
export function getAllErrorTypes(): ErrorType[] {
  return [...new Set(ERROR_PATTERNS.map((p) => p.type))];
}

/**
 * Get error statistics
 */
export function getErrorStatistics(): Record<ErrorType, number> {
  const stats: Record<ErrorType, number> = {} as Record<ErrorType, number>;
  for (const pattern of ERROR_PATTERNS) {
    stats[pattern.type] = (stats[pattern.type] || 0) + 1;
  }
  return stats;
}

export default ERROR_PATTERNS;
