/**
 * Comprehensive American English Grammar Knowledge Base
 *
 * Covers all major grammar topics from basic to advanced:
 * - Parts of Speech
 * - Tenses
 * - Sentence Structure
 * - Subject-Verb Agreement
 * - Articles & Determiners
 * - Pronouns
 * - Adjectives & Adverbs
 * - Prepositions
 * - Conjunctions
 * - Conditionals
 * - Passive Voice
 * - Reported Speech
 * - Questions
 * - Negation
 * - Relative Clauses
 * - Gerunds & Infinitives
 * - Modal Verbs
 * - Phrasal Verbs
 * - Common Errors
 */

export interface GrammarRule {
  id: string;
  category: string;
  categoryChinese: string;
  title: string;
  titleChinese: string;
  explanation: string;
  explanationChinese: string;
  examples: { correct: string; incorrect?: string; chinese: string }[];
  tips: string[];
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  tags: string[];
}

// ============================================================
// Parts of Speech
// ============================================================

const PARTS_OF_SPEECH: GrammarRule[] = [
  {
    id: "pos-noun", category: "Parts of Speech", categoryChinese: "词性",
    title: "Nouns", titleChinese: "名词",
    explanation: "Nouns are words that name people, places, things, or ideas. They can be countable or uncountable.",
    explanationChinese: "名词是表示人、地方、事物或概念的词。可分为可数名词和不可数名词。",
    examples: [
      { correct: "I have a cat.", chinese: "我有一只猫。" },
      { correct: "Water is important.", chinese: "水很重要。" },
      { correct: "She bought three books.", chinese: "她买了三本书。" },
      { incorrect: "She bought three book.", correct: "She bought three books.", chinese: "可数名词复数加-s" },
    ],
    tips: ["可数名词有单复数变化", "不可数名词不加-s", "专有名词首字母大写"],
    level: "A1", tags: ["noun", "plural", "countable", "uncountable"],
  },
  {
    id: "pos-verb", category: "Parts of Speech", categoryChinese: "词性",
    title: "Verbs", titleChinese: "动词",
    explanation: "Verbs express actions, states, or occurrences. They are the core of English sentences.",
    explanationChinese: "动词表达动作、状态或发生。它们是英语句子的核心。",
    examples: [
      { correct: "She runs every morning.", chinese: "她每天早上跑步。" },
      { correct: "I am happy.", chinese: "我很开心。" },
      { correct: "They have finished.", chinese: "他们已经完成了。" },
    ],
    tips: ["动词要根据主语和时态变化", "be动词有am/is/are/was/were", "情态动词后接动词原形"],
    level: "A1", tags: ["verb", "action", "state"],
  },
  {
    id: "pos-adjective", category: "Parts of Speech", categoryChinese: "词性",
    title: "Adjectives", titleChinese: "形容词",
    explanation: "Adjectives describe or modify nouns. They usually come before nouns or after linking verbs.",
    explanationChinese: "形容词描述或修饰名词。通常放在名词前或系动词后。",
    examples: [
      { correct: "She is beautiful.", chinese: "她很美丽。" },
      { correct: "I have a big house.", chinese: "我有一所大房子。" },
      { incorrect: "She is very beauty.", correct: "She is very beautiful.", chinese: "very后接形容词，不接名词" },
    ],
    tips: ["形容词放在名词前：a big dog", "放在系动词后：The dog is big", "比较级加-er，最高级加-est"],
    level: "A1", tags: ["adjective", "comparison", "description"],
  },
  {
    id: "pos-adverb", category: "Parts of Speech", categoryChinese: "词性",
    title: "Adverbs", titleChinese: "副词",
    explanation: "Adverbs modify verbs, adjectives, or other adverbs. Many are formed by adding -ly to adjectives.",
    explanationChinese: "副词修饰动词、形容词或其他副词。许多副词由形容词加-ly构成。",
    examples: [
      { correct: "She speaks English fluently.", chinese: "她英语说得很流利。" },
      { correct: "He runs very fast.", chinese: "他跑得非常快。" },
      { incorrect: "She speaks English fluent.", correct: "She speaks English fluently.", chinese: "修饰动词用副词" },
    ],
    tips: ["形容词→副词：quick→quickly", "频率副词：always, usually, often, sometimes, never", "位置：通常在动词后或句末"],
    level: "A1", tags: ["adverb", "frequency", "manner"],
  },
  {
    id: "pos-preposition", category: "Parts of Speech", categoryChinese: "词性",
    title: "Prepositions", titleChinese: "介词",
    explanation: "Prepositions show relationships between nouns/pronouns and other words in a sentence.",
    explanationChinese: "介词表示名词/代词与句中其他词之间的关系。",
    examples: [
      { correct: "I am at home.", chinese: "我在家。" },
      { correct: "The book is on the table.", chinese: "书在桌子上。" },
      { correct: "She goes to school.", chinese: "她去上学。" },
    ],
    tips: ["时间介词：at(时间点), on(具体日期), in(月份/年份)", "地点介词：at(小地点), on(表面), in(内部)", "介词后接名词或动名词"],
    level: "A1", tags: ["preposition", "time", "place"],
  },
  {
    id: "pos-conjunction", category: "Parts of Speech", categoryChinese: "词性",
    title: "Conjunctions", titleChinese: "连词",
    explanation: "Conjunctions connect words, phrases, or clauses. Coordinating conjunctions: for, and, nor, but, or, yet, so (FANBOYS).",
    explanationChinese: "连词连接单词、短语或从句。并列连词：for, and, nor, but, or, yet, so (FANBOYS)。",
    examples: [
      { correct: "I like tea and coffee.", chinese: "我喜欢茶和咖啡。" },
      { correct: "She is smart but lazy.", chinese: "她聪明但懒惰。" },
      { correct: "I will go if it stops raining.", chinese: "如果雨停了我就去。" },
    ],
    tips: ["并列连词连接同等成分", "从属连词引导从句：because, although, when, if", "不要用and连接两个完整句子（需加分号或句号）"],
    level: "A1", tags: ["conjunction", "coordinating", "subordinating"],
  },
  {
    id: "pos-pronoun", category: "Parts of Speech", categoryChinese: "词性",
    title: "Pronouns", titleChinese: "代词",
    explanation: "Pronouns replace nouns to avoid repetition. Types: personal, possessive, reflexive, demonstrative, relative.",
    explanationChinese: "代词替代名词以避免重复。类型：人称代词、物主代词、反身代词、指示代词、关系代词。",
    examples: [
      { correct: "She is my friend.", chinese: "她是我的朋友。" },
      { correct: "This is mine.", chinese: "这是我的。" },
      { correct: "He hurt himself.", chinese: "他伤了自己。" },
    ],
    tips: ["主格：I, you, he, she, it, we, they", "宾格：me, you, him, her, it, us, them", "物主代词：my, your, his, her, its, our, their"],
    level: "A1", tags: ["pronoun", "personal", "possessive", "reflexive"],
  },
];

// ============================================================
// Tenses
// ============================================================

const TENSES: GrammarRule[] = [
  {
    id: "tense-present-simple", category: "Tenses", categoryChinese: "时态",
    title: "Present Simple", titleChinese: "一般现在时",
    explanation: "Used for habits, general truths, scheduled events, and permanent states.",
    explanationChinese: "用于习惯、一般真理、预定事件和永久状态。",
    examples: [
      { correct: "I walk to school every day.", chinese: "我每天走路去学校。" },
      { correct: "The sun rises in the east.", chinese: "太阳从东方升起。" },
      { correct: "She works at a bank.", chinese: "她在银行工作。" },
      { incorrect: "I am walk to school.", correct: "I walk to school.", chinese: "一般现在时不加be动词" },
    ],
    tips: ["第三人称单数加-s/es", "否定：don't/doesn't + 动词原形", "时间标志：every day, usually, always, often"],
    level: "A1", tags: ["present", "simple", "habit", "fact"],
  },
  {
    id: "tense-present-continuous", category: "Tenses", categoryChinese: "时态",
    title: "Present Continuous", titleChinese: "现在进行时",
    explanation: "Used for actions happening now, temporary situations, and future arrangements.",
    explanationChinese: "用于正在发生的动作、临时情况和将来安排。",
    examples: [
      { correct: "I am studying English.", chinese: "我正在学英语。" },
      { correct: "She is working temporarily.", chinese: "她临时在工作。" },
      { correct: "We are meeting tomorrow.", chinese: "我们明天见面。" },
    ],
    tips: ["结构：be + doing", "不能用于状态动词：know, like, want, belong", "时间标志：now, right now, at the moment"],
    level: "A1", tags: ["present", "continuous", "progressive", "now"],
  },
  {
    id: "tense-past-simple", category: "Tenses", categoryChinese: "时态",
    title: "Past Simple", titleChinese: "一般过去时",
    explanation: "Used for completed actions in the past with a specific time.",
    explanationChinese: "用于过去特定时间完成的动作。",
    examples: [
      { correct: "I visited Paris last year.", chinese: "我去年去了巴黎。" },
      { correct: "She studied English for 3 years.", chinese: "她学了3年英语。" },
      { incorrect: "I visited Paris yesterday.", correct: "I visited Paris yesterday.", chinese: "yesterday用过去式" },
    ],
    tips: ["规则动词加-ed", "不规则动词需要记忆", "时间标志：yesterday, last week, ago, in 2020"],
    level: "A1", tags: ["past", "simple", "completed"],
  },
  {
    id: "tense-past-continuous", category: "Tenses", categoryChinese: "时态",
    title: "Past Continuous", titleChinese: "过去进行时",
    explanation: "Used for ongoing actions at a specific past time, or interrupted actions.",
    explanationChinese: "用于过去特定时间正在进行的动作，或被中断的动作。",
    examples: [
      { correct: "I was reading when she called.", chinese: "她打电话时我正在看书。" },
      { correct: "They were playing soccer at 3 PM.", chinese: "他们下午3点在踢足球。" },
    ],
    tips: ["结构：was/were + doing", "常与when/while连用", "表示背景动作"],
    level: "A2", tags: ["past", "continuous", "interrupted"],
  },
  {
    id: "tense-present-perfect", category: "Tenses", categoryChinese: "时态",
    title: "Present Perfect", titleChinese: "现在完成时",
    explanation: "Used for actions that started in the past and continue to the present, or past actions with present relevance.",
    explanationChinese: "用于从过去开始持续到现在的动作，或与现在相关的过去动作。",
    examples: [
      { correct: "I have lived here for 5 years.", chinese: "我在这里住了5年了。" },
      { correct: "She has finished her homework.", chinese: "她已经完成了作业。" },
      { correct: "Have you ever been to Japan?", chinese: "你去过日本吗？" },
    ],
    tips: ["结构：have/has + 过去分词", "时间标志：since, for, already, yet, ever, never", "不能与具体过去时间连用"],
    level: "A2", tags: ["present", "perfect", "experience", "duration"],
  },
  {
    id: "tense-past-perfect", category: "Tenses", categoryChinese: "时态",
    title: "Past Perfect", titleChinese: "过去完成时",
    explanation: "Used for an action completed before another past action.",
    explanationChinese: "用于在另一个过去动作之前完成的动作。",
    examples: [
      { correct: "I had finished dinner before she arrived.", chinese: "她到之前我已经吃完饭了。" },
      { correct: "They had never seen snow.", chinese: "他们从没见过雪。" },
    ],
    tips: ["结构：had + 过去分词", "表示'过去的过去'", "常与before, after, when连用"],
    level: "B1", tags: ["past", "perfect", "sequence"],
  },
  {
    id: "tense-future-simple", category: "Tenses", categoryChinese: "时态",
    title: "Future Tenses", titleChinese: "将来时",
    explanation: "Will for predictions/promises, going to for plans/intentions, present continuous for arrangements.",
    explanationChinese: "will用于预测/承诺，be going to用于计划/意图，现在进行时用于安排。",
    examples: [
      { correct: "I will help you.", chinese: "我会帮你的。" },
      { correct: "I am going to study medicine.", chinese: "我打算学医。" },
      { correct: "We are meeting at 5.", chinese: "我们5点见面。" },
    ],
    tips: ["will：即时决定、预测、承诺", "be going to：已有计划、证据显示", "现在进行时：已确定的安排"],
    level: "A2", tags: ["future", "will", "going to", "arrangement"],
  },
];

// ============================================================
// Sentence Structure
// ============================================================

const SENTENCE_STRUCTURE: GrammarRule[] = [
  {
    id: "ss-word-order", category: "Sentence Structure", categoryChinese: "句子结构",
    title: "Word Order", titleChinese: "语序",
    explanation: "English follows SVO (Subject-Verb-Object) order. Adjectives come before nouns. Adverbs usually come after the verb.",
    explanationChinese: "英语遵循主语-动词-宾语(SVO)语序。形容词在名词前。副词通常在动词后。",
    examples: [
      { correct: "I eat an apple.", chinese: "我吃一个苹果。" },
      { correct: "She speaks English fluently.", chinese: "她英语说得很流利。" },
      { incorrect: "Apple an eat I.", correct: "I eat an apple.", chinese: "英语是SVO语序" },
    ],
    tips: ["基本语序：SVO", "形容词+名词：a red car", "频率副词在be动词后，实义动词前"],
    level: "A1", tags: ["word order", "SVO", "structure"],
  },
  {
    id: "ss-questions", category: "Sentence Structure", categoryChinese: "句子结构",
    title: "Questions", titleChinese: "疑问句",
    explanation: "Yes/No questions use auxiliary + subject + verb. Wh- questions use wh-word + auxiliary + subject + verb.",
    explanationChinese: "一般疑问句用助动词+主语+动词。特殊疑问句用疑问词+助动词+主语+动词。",
    examples: [
      { correct: "Do you like coffee?", chinese: "你喜欢咖啡吗？" },
      { correct: "Where do you live?", chinese: "你住在哪里？" },
      { correct: "What are you doing?", chinese: "你在做什么？" },
    ],
    tips: ["Do/Does + 主语 + 动词原形（一般现在时）", "Did + 主语 + 动词原形（一般过去时）", "Be动词提前：Are you ready?"],
    level: "A1", tags: ["question", "yes-no", "wh-question"],
  },
  {
    id: "ss-negation", category: "Sentence Structure", categoryChinese: "句子结构",
    title: "Negation", titleChinese: "否定句",
    explanation: "Add not after auxiliary verbs. With no auxiliary, use do/does/did + not + verb.",
    explanationChinese: "在助动词后加not。没有助动词时，用do/does/did + not + 动词。",
    examples: [
      { correct: "I do not like spiders.", chinese: "我不喜欢蜘蛛。" },
      { correct: "She cannot swim.", chinese: "她不会游泳。" },
      { correct: "They have not finished.", chinese: "他们还没完成。" },
    ],
    tips: ["缩写：don't, doesn't, didn't, can't, won't, isn't, aren't", "never = not ever", "nobody = not anybody"],
    level: "A1", tags: ["negation", "not", "negative"],
  },
  {
    id: "ss-imperative", category: "Sentence Structure", categoryChinese: "句子结构",
    title: "Imperatives", titleChinese: "祈使句",
    explanation: "Commands and requests. Use the base form of the verb. Subject 'you' is implied.",
    explanationChinese: "命令和请求。使用动词原形。主语'you'省略。",
    examples: [
      { correct: "Sit down.", chinese: "坐下。" },
      { correct: "Please help me.", chinese: "请帮帮我。" },
      { correct: "Don't be late.", chinese: "不要迟到。" },
    ],
    tips: ["肯定祈使句：动词原形开头", "否定祈使句：Don't + 动词原形", "加please更礼貌"],
    level: "A1", tags: ["imperative", "command", "request"],
  },
];

// ============================================================
// Articles & Determiners
// ============================================================

const ARTICLES: GrammarRule[] = [
  {
    id: "art-a-an", category: "Articles", categoryChinese: "冠词",
    title: "A and An", titleChinese: "不定冠词 a/an",
    explanation: "Use 'a' before consonant sounds, 'an' before vowel sounds. Used with singular countable nouns.",
    explanationChinese: "辅音音素前用'a'，元音音素前用'an'。用于单数可数名词前。",
    examples: [
      { correct: "a book", chinese: "一本书" },
      { correct: "an apple", chinese: "一个苹果" },
      { correct: "a university", chinese: "一所大学（u发/juː/）" },
      { correct: "an hour", chinese: "一小时（h不发音）" },
    ],
    tips: ["看发音，不看字母", "u发/juː/时用a：a university", "h不发音时用an：an hour, an honest"],
    level: "A1", tags: ["article", "a", "an", "indefinite"],
  },
  {
    id: "art-the", category: "Articles", categoryChinese: "冠词",
    title: "The Definite Article", titleChinese: "定冠词 the",
    explanation: "Use 'the' when both speaker and listener know which thing is meant. Also for superlatives and unique things.",
    explanationChinese: "当说话者和听话者都知道指哪个事物时用'the'。也用于最高级和独一无二的事物。",
    examples: [
      { correct: "the sun", chinese: "太阳（独一无二）" },
      { correct: "the best student", chinese: "最好的学生（最高级）" },
      { correct: "I went to the store.", chinese: "我去了那家商店（双方都知道）" },
    ],
    tips: ["独一无二：the sun, the moon", "最高级：the biggest", "序数词：the first", "乐器：play the piano"],
    level: "A1", tags: ["article", "the", "definite"],
  },
  {
    id: "art-zero", category: "Articles", categoryChinese: "冠词",
    title: "Zero Article", titleChinese: "零冠词",
    explanation: "No article used with: plural nouns in general, uncountable nouns in general, proper nouns.",
    explanationChinese: "复数名词泛指、不可数名词泛指、专有名词前不用冠词。",
    examples: [
      { correct: "I like dogs.", chinese: "我喜欢狗（泛指）" },
      { correct: "Water is essential.", chinese: "水是必需的（泛指）" },
      { correct: "I live in Beijing.", chinese: "我住在北京" },
    ],
    tips: ["三餐前不用：have breakfast", "球类运动前不用：play soccer", "by + 交通方式：by bus"],
    level: "A2", tags: ["article", "zero", "general"],
  },
];

// ============================================================
// Conditionals
// ============================================================

const CONDITIONALS: GrammarRule[] = [
  {
    id: "cond-zero", category: "Conditionals", categoryChinese: "条件句",
    title: "Zero Conditional", titleChinese: "零条件句",
    explanation: "General truths and facts. If + present, present.",
    explanationChinese: "一般真理和事实。If + 现在时，现在时。",
    examples: [
      { correct: "If you heat water to 100°C, it boils.", chinese: "如果你把水加热到100°C，水会沸腾。" },
      { correct: "If it rains, the ground gets wet.", chinese: "如果下雨，地面会变湿。" },
    ],
    tips: ["用于科学事实和普遍真理", "两个分句都用一般现在时", "if可以换成when"],
    level: "A2", tags: ["conditional", "zero", "fact", "truth"],
  },
  {
    id: "cond-first", category: "Conditionals", categoryChinese: "条件句",
    title: "First Conditional", titleChinese: "第一条件句",
    explanation: "Real future possibilities. If + present, will + base verb.",
    explanationChinese: "真实的将来可能性。If + 现在时，will + 动词原形。",
    examples: [
      { correct: "If it rains, I will stay home.", chinese: "如果下雨，我会待在家里。" },
      { correct: "If you study hard, you will pass.", chinese: "如果你努力学习，你会通过的。" },
    ],
    tips: ["if从句用一般现在时（不用will）", "主句用will + 动词原形", "can/may/might可以替代will"],
    level: "A2", tags: ["conditional", "first", "future", "possibility"],
  },
  {
    id: "cond-second", category: "Conditionals", categoryChinese: "条件句",
    title: "Second Conditional", titleChinese: "第二条件句",
    explanation: "Unreal/hypothetical present situations. If + past, would + base verb.",
    explanationChinese: "不真实的/假设的现在情况。If + 过去时，would + 动词原形。",
    examples: [
      { correct: "If I were rich, I would travel the world.", chinese: "如果我有钱，我会环游世界。" },
      { correct: "If I had more time, I would learn Japanese.", chinese: "如果我有更多时间，我会学日语。" },
    ],
    tips: ["虚拟语气：if从句用过去式", "be动词统一用were（正式）", "表示与现在事实相反的假设"],
    level: "B1", tags: ["conditional", "second", "unreal", "hypothetical"],
  },
  {
    id: "cond-third", category: "Conditionals", categoryChinese: "条件句",
    title: "Third Conditional", titleChinese: "第三条件句",
    explanation: "Unreal past situations. If + past perfect, would have + past participle.",
    explanationChinese: "不真实的过去情况。If + 过去完成时，would have + 过去分词。",
    examples: [
      { correct: "If I had studied harder, I would have passed.", chinese: "如果我当时更努力学习，我就会通过了。" },
      { correct: "If she had come, we would have been happy.", chinese: "如果她来了，我们会很高兴。" },
    ],
    tips: ["表示与过去事实相反的假设", "表达遗憾或批评", "主句用would have + 过去分词"],
    level: "B1", tags: ["conditional", "third", "unreal-past", "regret"],
  },
];

// ============================================================
// Passive Voice
// ============================================================

const PASSIVE: GrammarRule[] = [
  {
    id: "passive-basic", category: "Passive Voice", categoryChinese: "被动语态",
    title: "Passive Voice", titleChinese: "被动语态",
    explanation: "When the action is more important than the doer. Structure: be + past participle.",
    explanationChinese: "当动作比执行者更重要时使用。结构：be + 过去分词。",
    examples: [
      { correct: "The book was written by Shakespeare.", chinese: "这本书是莎士比亚写的。" },
      { correct: "English is spoken in many countries.", chinese: "英语在许多国家使用。" },
      { correct: "The window was broken.", chinese: "窗户被打破了。" },
    ],
    tips: ["不知道或不重要谁做的时用被动", "正式写作中常用被动", "by + 施动者（可省略）"],
    level: "A2", tags: ["passive", "voice", "be + past participle"],
  },
];

// ============================================================
// Modal Verbs
// ============================================================

const MODALS: GrammarRule[] = [
  {
    id: "modal-can", category: "Modal Verbs", categoryChinese: "情态动词",
    title: "Can / Could", titleChinese: "Can / Could",
    explanation: "Can: ability, permission, possibility (present). Could: past ability, polite requests, possibility.",
    explanationChinese: "Can：能力、许可、可能性（现在）。Could：过去能力、礼貌请求、可能性。",
    examples: [
      { correct: "I can swim.", chinese: "我会游泳。" },
      { correct: "Could you help me?", chinese: "你能帮我吗？" },
      { correct: "I could run fast when I was young.", chinese: "我年轻时跑得很快。" },
    ],
    tips: ["can + 动词原形", "否定：cannot (can't)", "could比can更礼貌"],
    level: "A1", tags: ["modal", "can", "could", "ability", "permission"],
  },
  {
    id: "modal-must", category: "Modal Verbs", categoryChinese: "情态动词",
    title: "Must / Have to", titleChinese: "Must / Have to",
    explanation: "Must: strong obligation (internal), deduction. Have to: external obligation.",
    explanationChinese: "Must：强烈义务（内部），推测。Have to：外部义务。",
    examples: [
      { correct: "I must study harder.", chinese: "我必须更努力学习（自我要求）。" },
      { correct: "I have to wear a uniform.", chinese: "我必须穿制服（公司要求）。" },
      { correct: "She must be tired.", chinese: "她一定很累了（推测）。" },
    ],
    tips: ["must表示主观义务", "have to表示客观义务", "否定：mustn't(禁止) vs don't have to(不必)"],
    level: "A2", tags: ["modal", "must", "have to", "obligation"],
  },
  {
    id: "modal-should", category: "Modal Verbs", categoryChinese: "情态动词",
    title: "Should / Ought to", titleChinese: "Should / Ought to",
    explanation: "Advice, recommendations, expectations. Should is more common in modern English.",
    explanationChinese: "建议、推荐、期望。should在现代英语中更常用。",
    examples: [
      { correct: "You should exercise regularly.", chinese: "你应该定期锻炼。" },
      { correct: "You ought to apologize.", chinese: "你应该道歉。" },
      { correct: "Should I bring anything?", chinese: "我需要带什么吗？" },
    ],
    tips: ["should + 动词原形", "表示建议或应该做的事", "ought to意思相同但更正式"],
    level: "A2", tags: ["modal", "should", "ought to", "advice"],
  },
  {
    id: "modal-might", category: "Modal Verbs", categoryChinese: "情态动词",
    title: "May / Might", titleChinese: "May / Might",
    explanation: "Permission (formal), possibility. Might is less certain than may.",
    explanationChinese: "许可（正式）、可能性。might的确定性比may低。",
    examples: [
      { correct: "May I use your phone?", chinese: "我可以用你的手机吗？" },
      { correct: "It might rain tomorrow.", chinese: "明天可能会下雨。" },
      { correct: "She may not come.", chinese: "她可能不会来。" },
    ],
    tips: ["may用于正式请求许可", "may/might表示可能性", "might更不确定"],
    level: "A2", tags: ["modal", "may", "might", "possibility", "permission"],
  },
];

// ============================================================
// Relative Clauses
// ============================================================

const RELATIVE: GrammarRule[] = [
  {
    id: "rel-defining", category: "Relative Clauses", categoryChinese: "关系从句",
    title: "Defining Relative Clauses", titleChinese: "限定性关系从句",
    explanation: "Essential information that identifies the noun. Use that/which/who/whom/whose.",
    explanationChinese: "确定名词身份的必要信息。用that/which/who/whom/whose。",
    examples: [
      { correct: "The man who called is my father.", chinese: "打电话的那个人是我父亲。" },
      { correct: "The book that I read was interesting.", chinese: "我读的那本书很有趣。" },
      { correct: "The house which is red is mine.", chinese: "红色的那栋房子是我的。" },
    ],
    tips: ["who指人，which指物，that两者都可", "限定性从句不用逗号", "可省略关系代词（作宾语时）"],
    level: "B1", tags: ["relative", "defining", "who", "which", "that"],
  },
  {
    id: "rel-nondefining", category: "Relative Clauses", categoryChinese: "关系从句",
    title: "Non-defining Relative Clauses", titleChinese: "非限定性关系从句",
    explanation: "Extra information. Use commas. Cannot use 'that'.",
    explanationChinese: "补充信息。用逗号隔开。不能用'that'。",
    examples: [
      { correct: "My mother, who is 60, loves gardening.", chinese: "我妈妈60岁了，喜欢园艺。" },
      { correct: "Beijing, which is the capital, is very large.", chinese: "北京是首都，非常大。" },
    ],
    tips: ["必须用逗号隔开", "不能用that", "which指物，who指人", "删掉从句句子仍完整"],
    level: "B1", tags: ["relative", "non-defining", "extra-info"],
  },
];

// ============================================================
// Common Errors
// ============================================================

const COMMON_ERRORS: GrammarRule[] = [
  {
    id: "err-subject-verb", category: "Common Errors", categoryChinese: "常见错误",
    title: "Subject-Verb Agreement", titleChinese: "主谓一致",
    explanation: "The verb must agree with the subject in number and person.",
    explanationChinese: "动词必须在数和人称上与主语一致。",
    examples: [
      { correct: "He plays tennis.", chinese: "他打网球。" },
      { incorrect: "He play tennis.", correct: "He plays tennis.", chinese: "第三人称单数加-s" },
      { correct: "The dogs are barking.", chinese: "狗在叫。" },
      { incorrect: "The dogs is barking.", correct: "The dogs are barking.", chinese: "复数主语用are" },
    ],
    tips: ["第三人称单数加-s/es", "be动词：I am, you are, he/she/it is", "注意主语和动词之间的修饰语"],
    level: "A1", tags: ["agreement", "subject-verb", "number"],
  },
  {
    id: "err-double-negative", category: "Common Errors", categoryChinese: "常见错误",
    title: "Double Negatives", titleChinese: "双重否定",
    explanation: "Avoid using two negatives in the same clause. Use 'any' instead of 'no' in negative sentences.",
    explanationChinese: "避免在同一从句中使用两个否定。否定句中用'any'代替'no'。",
    examples: [
      { incorrect: "I don't have no money.", correct: "I don't have any money.", chinese: "不要用双重否定" },
      { incorrect: "She can't hardly wait.", correct: "She can hardly wait.", chinese: "hardly本身是否定词" },
    ],
    tips: ["标准英语中避免双重否定", "hardly, scarcely, barely本身就是否定词", "用any替代no"],
    level: "A2", tags: ["error", "double-negative", "negation"],
  },
  {
    id: "err-missing-article", category: "Common Errors", categoryChinese: "常见错误",
    title: "Missing Articles", titleChinese: "缺少冠词",
    explanation: "Chinese speakers often omit articles. Remember: a/an with singular countable nouns, the when specific.",
    explanationChinese: "中文使用者经常省略冠词。记住：单数可数名词前用a/an，特指用the。",
    examples: [
      { incorrect: "I want buy car.", correct: "I want to buy a car.", chinese: "单数可数名词前需要冠词" },
      { incorrect: "She is teacher.", correct: "She is a teacher.", chinese: "职业前需要冠词" },
    ],
    tips: ["单数可数名词不能裸用", "泛指用a/an，特指用the", "不可数名词泛指不用冠词"],
    level: "A1", tags: ["error", "article", "missing"],
  },
  {
    id: "err-wrong-tense", category: "Common Errors", categoryChinese: "常见错误",
    title: "Wrong Tense Usage", titleChinese: "时态错误",
    explanation: "Chinese has no verb conjugation. English requires correct tense marking.",
    explanationChinese: "中文没有动词变位。英语需要正确的时态标记。",
    examples: [
      { incorrect: "I go to school yesterday.", correct: "I went to school yesterday.", chinese: "过去时间用过去式" },
      { incorrect: "She is work here.", correct: "She works here.", chinese: "一般现在时不用be" },
      { incorrect: "I am know the answer.", correct: "I know the answer.", chinese: "know是状态动词，不用进行时" },
    ],
    tips: ["注意时间标志词决定时态", "状态动词不用进行时：know, like, want", "过去时间一定用过去式"],
    level: "A1", tags: ["error", "tense", "wrong-form"],
  },
  {
    id: "err-preposition", category: "Common Errors", categoryChinese: "常见错误",
    title: "Wrong Prepositions", titleChinese: "介词错误",
    explanation: "Prepositions don't translate directly from Chinese. Each language has its own patterns.",
    explanationChinese: "介词不能从中文直译。每种语言有自己的搭配习惯。",
    examples: [
      { incorrect: "I am good in English.", correct: "I am good at English.", chinese: "good at表示擅长" },
      { incorrect: "Depend of others.", correct: "Depend on others.", chinese: "depend on表示依赖" },
      { incorrect: "Listen music.", correct: "Listen to music.", chinese: "listen to表示听" },
    ],
    tips: ["常见搭配需要记忆", "at: good at, angry at", "on: depend on, insist on", "in: interested in, succeed in"],
    level: "A2", tags: ["error", "preposition", "collocation"],
  },
];

// ============================================================
// Export All Grammar Rules
// ============================================================

import { ADVANCED_GRAMMAR_RULES } from "./grammar-advanced";

export const ALL_GRAMMAR_RULES: GrammarRule[] = [
  ...PARTS_OF_SPEECH,
  ...TENSES,
  ...SENTENCE_STRUCTURE,
  ...ARTICLES,
  ...CONDITIONALS,
  ...PASSIVE,
  ...MODALS,
  ...RELATIVE,
  ...COMMON_ERRORS,
  ...ADVANCED_GRAMMAR_RULES,
];

export const GRAMMAR_STATS = {
  total: ALL_GRAMMAR_RULES.length,
  categories: [...new Set(ALL_GRAMMAR_RULES.map(r => r.category))].length,
  byLevel: {
    A1: ALL_GRAMMAR_RULES.filter(r => r.level === "A1").length,
    A2: ALL_GRAMMAR_RULES.filter(r => r.level === "A2").length,
    B1: ALL_GRAMMAR_RULES.filter(r => r.level === "B1").length,
    B2: ALL_GRAMMAR_RULES.filter(r => r.level === "B2").length,
    C1: ALL_GRAMMAR_RULES.filter(r => r.level === "C1").length,
    C2: ALL_GRAMMAR_RULES.filter(r => r.level === "C2").length,
  },
};
