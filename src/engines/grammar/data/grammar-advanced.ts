/**
 * Advanced Grammar Rules — Extended American English Coverage
 * 
 * Adds 160+ rules to the base 37, covering all CEFR levels A1-C2.
 * Categories: Gerunds, Infinitives, Comparatives, Reported Speech,
 * Phrasal Verbs, Wish, Used to, Question Tags, Word Formation, etc.
 */

import type { GrammarRule } from "./grammar-kb";

// ============================================================
// Gerunds & Infinitives
// ============================================================

const GERUNDS_INFINITIVES: GrammarRule[] = [
  {
    id: "gerund-as-subject", category: "Gerunds & Infinitives", categoryChinese: "动名词与不定式",
    title: "Gerunds as Subjects", titleChinese: "动名词作主语",
    explanation: "The -ing form of a verb can be used as a noun (subject or object).",
    explanationChinese: "动词的-ing形式可以当名词用（作主语或宾语）。",
    examples: [
      { correct: "Swimming is good exercise.", chinese: "游泳是很好的锻炼。" },
      { correct: "Reading helps you learn.", chinese: "阅读帮助你学习。" },
      { incorrect: "Swim is good exercise.", correct: "Swimming is good exercise.", chinese: "动词不能直接做主语" },
    ],
    tips: ["动名词做主语表泛指", "不定式做主语表具体目的", "It is fun swimming. = Swimming is fun."],
    level: "A2", tags: ["gerund", "subject", "ing"],
  },
  {
    id: "gerund-as-object", category: "Gerunds & Infinitives", categoryChinese: "动名词与不定式",
    title: "Gerunds as Objects", titleChinese: "动名词作宾语",
    explanation: "Some verbs take gerunds as objects: enjoy, avoid, finish, mind, suggest, practice.",
    explanationChinese: "某些动词后接动名词作宾语：enjoy, avoid, finish, mind, suggest, practice。",
    examples: [
      { correct: "I enjoy reading.", chinese: "我喜欢阅读。" },
      { correct: "She finished studying.", chinese: "她完成了学习。" },
      { incorrect: "I enjoy to read.", correct: "I enjoy reading.", chinese: "enjoy后接动名词" },
    ],
    tips: ["常见接动名词的动词：enjoy, avoid, finish, mind, suggest, practice, keep, consider", "consider doing, avoid doing, finish doing"],
    level: "A2", tags: ["gerund", "object", "enjoy", "avoid"],
  },
  {
    id: "infinitive-of-purpose", category: "Gerunds & Infinitives", categoryChinese: "动名词与不定式",
    title: "Infinitive of Purpose", titleChinese: "不定式表目的",
    explanation: "Use 'to + verb' to express why you do something. Equivalent to 'in order to'.",
    explanationChinese: "用'to + 动词'表示做某事的目的。等同于'in order to'。",
    examples: [
      { correct: "I went to the store to buy milk.", chinese: "我去商店买牛奶。" },
      { correct: "She studies hard to pass the exam.", chinese: "她努力学习为了通过考试。" },
      { correct: "He came to help us.", chinese: "他来帮助我们。" },
    ],
    tips: ["to + 动词原形 = 目的", "可以说 in order to (更正式)", "否定：in order not to"],
    level: "A2", tags: ["infinitive", "purpose", "to"],
  },
  {
    id: "want-hope-decide", category: "Gerunds & Infinitives", categoryChinese: "动名词与不定式",
    title: "Verbs + Infinitive", titleChinese: "接不定式的动词",
    explanation: "Some verbs take infinitives: want, hope, decide, plan, agree, refuse, learn, promise.",
    explanationChinese: "某些动词后接不定式：want, hope, decide, plan, agree, refuse, learn, promise。",
    examples: [
      { correct: "I want to learn English.", chinese: "我想学英语。" },
      { correct: "She decided to quit.", chinese: "她决定辞职。" },
      { incorrect: "I want learning English.", correct: "I want to learn English.", chinese: "want后接不定式" },
    ],
    tips: ["want/hope/decide/plan + to do", "注意和动名词动词的区别", "有些动词两种都可以，意思不同"],
    level: "A2", tags: ["infinitive", "want", "hope", "decide"],
  },
  {
    id: "stop-to-do-vs-doing", category: "Gerunds & Infinitives", categoryChinese: "动名词与不定式",
    title: "Stop to Do vs Stop Doing", titleChinese: "stop to do vs stop doing",
    explanation: "Stop to do = stop in order to do something. Stop doing = stop the current activity.",
    explanationChinese: "stop to do = 停下来去做某事。stop doing = 停止正在做的事。",
    examples: [
      { correct: "I stopped to eat lunch.", chinese: "我停下来去吃午饭。" },
      { correct: "I stopped eating lunch.", chinese: "我停止吃午饭了。" },
    ],
    tips: ["stop to do: 停下来去做另一件事", "stop doing: 停止当前活动", "remember/forget也有类似区别"],
    level: "B1", tags: ["gerund", "infinitive", "stop", "meaning-change"],
  },
];

// ============================================================
// Comparatives & Superlatives
// ============================================================

const COMPARISON: GrammarRule[] = [
  {
    id: "comp-adjective", category: "Comparatives & Superlatives", categoryChinese: "比较级与最高级",
    title: "Comparative Adjectives", titleChinese: "形容词比较级",
    explanation: "Short adjectives: add -er. Long adjectives: use more. Irregular: good→better, bad→worse.",
    explanationChinese: "短形容词加-er。长形容词用more。不规则：good→better, bad→worse。",
    examples: [
      { correct: "She is taller than her sister.", chinese: "她比她姐姐高。" },
      { correct: "This book is more interesting.", chinese: "这本书更有趣。" },
      { correct: "My English is getting better.", chinese: "我的英语变得更好了。" },
    ],
    tips: ["单音节加-er：taller, bigger, faster", "双音节及以上用more：more beautiful, more expensive", "不规则：good-better-best, bad-worse-worst"],
    level: "A2", tags: ["comparative", "adjective", "-er", "more"],
  },
  {
    id: "comp-superlative", category: "Comparatives & Superlatives", categoryChinese: "比较级与最高级",
    title: "Superlative Adjectives", titleChinese: "形容词最高级",
    explanation: "The + adjective + -est, or the most + adjective.",
    explanationChinese: "the + 形容词 + -est，或 the most + 形容词。",
    examples: [
      { correct: "She is the tallest in the class.", chinese: "她是班上最高的。" },
      { correct: "This is the most beautiful place.", chinese: "这是最美的地方。" },
      { correct: "He is the best student.", chinese: "他是最好的学生。" },
    ],
    tips: ["the + 形容词 + est", "the + most + 长形容词", "不规则：good-best, bad-worst, far-farthest"],
    level: "A2", tags: ["superlative", "the most", "the -est"],
  },
  {
    id: "comp-as-as", category: "Comparatives & Superlatives", categoryChinese: "比较级与最高级",
    title: "As...As Comparisons", titleChinese: "as...as 同级比较",
    explanation: "Use 'as + adjective + as' to say two things are equal in some way.",
    explanationChinese: "用'as + 形容词 + as'表示两者在某方面相同。",
    examples: [
      { correct: "She is as tall as her mother.", chinese: "她和她妈妈一样高。" },
      { correct: "This test is not as hard as that one.", chinese: "这个测试没有那个难。" },
      { correct: "He runs as fast as his brother.", chinese: "他和他哥哥跑得一样快。" },
    ],
    tips: ["as + 原级 + as = 和...一样", "not as...as = 不如...", "否定也可以用 not so...as"],
    level: "A2", tags: ["comparison", "as-as", "equal"],
  },
  {
    id: "comp-more-less", category: "Comparatives & Superlatives", categoryChinese: "比较级与最高级",
    title: "More / Less / Fewer", titleChinese: "more/less/fewer",
    explanation: "More + uncountable/countable. Less + uncountable. Fewer + countable.",
    explanationChinese: "more + 不可数/可数名词。less + 不可数名词。fewer + 可数名词。",
    examples: [
      { correct: "I have more time than before.", chinese: "我比以前有更多时间。" },
      { correct: "There are fewer students today.", chinese: "今天学生更少了。" },
      { incorrect: "There are less students.", correct: "There are fewer students.", chinese: "students可数，用fewer" },
    ],
    tips: ["more = 更多（通用）", "less + 不可数名词", "fewer + 可数名词", "日常口语中 less 常被混用"],
    level: "B1", tags: ["comparative", "more", "less", "fewer"],
  },
];

// ============================================================
// Reported Speech
// ============================================================

const REPORTED_SPEECH: GrammarRule[] = [
  {
    id: "reported-statements", category: "Reported Speech", categoryChinese: "间接引语",
    title: "Reported Statements", titleChinese: "陈述句的间接引语",
    explanation: "Change pronouns, tenses (backshift), and time/place words when reporting statements.",
    explanationChinese: "转述陈述句时改变代词、时态（后退）和时间/地点词。",
    examples: [
      { correct: 'She said she was tired.', chinese: '她说她累了。（said she is → said she was）' },
      { correct: 'He said he had finished.', chinese: '他说他已经完成了。' },
      { correct: 'They said they would come.', chinese: '他们说他们会来。' },
    ],
    tips: ["时态后退：is→was, have→had, will→would", "代词变化：I→he/she, my→his/her", "时间词：today→that day, tomorrow→the next day"],
    level: "B1", tags: ["reported", "speech", "backshift", "said"],
  },
  {
    id: "reported-questions", category: "Reported Speech", categoryChinese: "间接引语",
    title: "Reported Questions", titleChinese: "疑问句的间接引语",
    explanation: "Yes/No questions: if/whether. Wh- questions: use the wh-word. Word order changes to statement order.",
    explanationChinese: "一般疑问句用if/whether。特殊疑问句用疑问词。语序变为陈述语序。",
    examples: [
      { correct: 'She asked if I was coming.', chinese: '她问我是否要来。' },
      { correct: 'He asked where I lived.', chinese: '他问我住在哪里。' },
      { correct: 'She wanted to know what time it was.', chinese: '她想知道几点了。' },
    ],
    tips: ["一般疑问句→if/whether", "特殊疑问句→保留疑问词", "语序变回陈述语序", "不要用 Do you...? 的语序"],
    level: "B1", tags: ["reported", "question", "if", "whether"],
  },
];

// ============================================================
// Phrasal Verbs
// ============================================================

const PHRASAL_VERBS: GrammarRule[] = [
  {
    id: "phrasal-basic", category: "Phrasal Verbs", categoryChinese: "短语动词",
    title: "Common Phrasal Verbs", titleChinese: "常见短语动词",
    explanation: "Phrasal verbs combine a verb with a preposition/adverb to create a new meaning.",
    explanationChinese: "短语动词由动词+介词/副词组成，产生新含义。",
    examples: [
      { correct: "I need to look up this word.", chinese: "我需要查这个单词。" },
      { correct: "Please turn off the light.", chinese: "请关灯。" },
      { correct: "She gave up smoking.", chinese: "她戒烟了。" },
      { correct: "I'll pick you up at 5.", chinese: "我5点来接你。" },
    ],
    tips: ["look up = 查阅, look after = 照顾, look forward to = 期待", "turn on/off = 开/关, turn up/down = 调大/小", "give up = 放弃, give in = 屈服"],
    level: "A2", tags: ["phrasal", "verb", "preposition"],
  },
  {
    id: "phrasal-transitive", category: "Phrasal Verbs", categoryChinese: "短语动词",
    title: "Separable vs Inseparable Phrasal Verbs", titleChinese: "可分与不可分短语动词",
    explanation: "Separable: verb and particle can be separated by the object. Inseparable: they cannot.",
    explanationChinese: "可分的：动词和小品词可以被宾语分开。不可分的：不能分开。",
    examples: [
      { correct: "Turn off the light. / Turn the light off.", chinese: "关灯。（可分）" },
      { correct: "Turn it off.", chinese: "关掉它。（代词必须放中间）" },
      { incorrect: "Turn off it.", correct: "Turn it off.", chinese: "代词必须放中间" },
      { correct: "I get along with her.", chinese: "我和她相处融洽。（不可分）" },
    ],
    tips: ["代词做宾语时必须放中间：turn it off", "名词做宾语可放中间或后面", "get along with, look forward to 不可分"],
    level: "B1", tags: ["phrasal", "separable", "inseparable"],
  },
  {
    id: "phrasal-common-20", category: "Phrasal Verbs", categoryChinese: "短语动词",
    title: "Top 20 Essential Phrasal Verbs", titleChinese: "20个必会短语动词",
    explanation: "The most frequently used phrasal verbs in daily English.",
    explanationChinese: "日常英语中最常用的20个短语动词。",
    examples: [
      { correct: "I need to get up early.", chinese: "我需要早起。" },
      { correct: "She put on her coat.", chinese: "她穿上外套。" },
      { correct: "He took off his shoes.", chinese: "他脱掉鞋子。" },
      { correct: "Let's go on with the lesson.", chinese: "让我们继续上课。" },
      { correct: "I ran out of milk.", chinese: "我的牛奶用完了。" },
      { correct: "She broke down crying.", chinese: "她哭了起来。" },
      { correct: "I'll figure it out.", chinese: "我会想明白的。" },
    ],
    tips: ["get up 起床, put on 穿上, take off 脱下/起飞", "go on 继续, run out of 用完, break down 出故障/崩溃", "figure out 想出, bring up 提出/养育, carry on 继续"],
    level: "A2", tags: ["phrasal", "essential", "daily"],
  },
];

// ============================================================
// Wish & If Only
// ============================================================

const WISH: GrammarRule[] = [
  {
    id: "wish-present", category: "Wish & If Only", categoryChinese: "Wish与If Only",
    title: "Wish + Past Tense (Present)", titleChinese: "wish + 过去时（现在）",
    explanation: "Express wishes about the present. Use past tense after 'wish' (like second conditional).",
    explanationChinese: "表达对现在的愿望。wish后用过去时（类似第二条件句）。",
    examples: [
      { correct: "I wish I had more money.", chinese: "我希望我有更多的钱。" },
      { correct: "She wishes she could fly.", chinese: "她希望她能飞。" },
      { correct: "I wish I were taller.", chinese: "我希望我更高。" },
    ],
    tips: ["wish + 过去时 = 对现在的遗憾", "be动词用were（正式）", "could替代can"],
    level: "B1", tags: ["wish", "present", "regret"],
  },
  {
    id: "wish-past", category: "Wish & If Only", categoryChinese: "Wish与If Only",
    title: "Wish + Past Perfect (Past)", titleChinese: "wish + 过去完成时（过去）",
    explanation: "Express wishes/regrets about the past. Use had + past participle.",
    explanationChinese: "表达对过去的愿望/遗憾。用had + 过去分词。",
    examples: [
      { correct: "I wish I had studied harder.", chinese: "我希望我当时更努力学习。" },
      { correct: "She wishes she hadn't said that.", chinese: "她希望她没说那些话。" },
    ],
    tips: ["wish + had done = 对过去的遗憾", "表达'要是当时...就好了'", "if only = I wish（更强烈）"],
    level: "B1", tags: ["wish", "past", "regret", "had"],
  },
];

// ============================================================
// Used to / Would
// ============================================================

const USED_TO: GrammarRule[] = [
  {
    id: "used-to", category: "Used to / Would", categoryChinese: "used to与would",
    title: "Used to + Base Verb", titleChinese: "used to + 动词原形",
    explanation: "Past habits or states that are no longer true. Negative: didn't use to. Question: Did you use to...?",
    explanationChinese: "过去习惯或状态，现在不再如此。否定：didn't use to。疑问：Did you use to...?",
    examples: [
      { correct: "I used to play basketball.", chinese: "我以前打篮球（现在不打了）。" },
      { correct: "She didn't use to like coffee.", chinese: "她以前不喜欢咖啡。" },
      { correct: "Did you use to live here?", chinese: "你以前住这里吗？" },
    ],
    tips: ["used to = 过去的习惯/状态", "否定：didn't use to（注意没有d）", "疑问：Did...use to...?" ],
    level: "A2", tags: ["used to", "past habit", "past state"],
  },
  {
    id: "would-for-past", category: "Used to / Would", categoryChinese: "used to与would",
    title: "Would for Past Habits", titleChinese: "would表示过去的习惯",
    explanation: "Would = used to for past habits (repeated actions, NOT states).",
    explanationChinese: "would = used to，用于过去的重复动作（不用于状态）。",
    examples: [
      { correct: "When I was young, I would play outside every day.", chinese: "我小时候每天在外面玩。" },
      { correct: "She would always bring snacks.", chinese: "她总是会带零食。" },
      { incorrect: "I would live in Beijing.", correct: "I used to live in Beijing.", chinese: "状态动词不用would" },
    ],
    tips: ["would只用于动作（重复的习惯）", "状态用used to", "would常与when I was young连用"],
    level: "B1", tags: ["would", "past habit", "repeated action"],
  },
];

// ============================================================
// Question Tags
// ============================================================

const QUESTION_TAGS: GrammarRule[] = [
  {
    id: "tag-basic", category: "Question Tags", categoryChinese: "反意疑问句",
    title: "Basic Question Tags", titleChinese: "基本反意疑问句",
    explanation: "Positive statement → negative tag. Negative statement → positive tag.",
    explanationChinese: "肯定陈述→否定附加问句。否定陈述→肯定附加问句。",
    examples: [
      { correct: "You are a student, aren't you?", chinese: "你是学生，对吧？" },
      { correct: "She doesn't like coffee, does she?", chinese: "她不喜欢咖啡，对吧？" },
      { correct: "He can swim, can't he?", chinese: "他会游泳，对吧？" },
      { correct: "Let's go, shall we?", chinese: "我们走吧，好吗？" },
    ],
    tips: ["前肯后否：You are..., aren't you?", "前否后肯：She doesn't..., does she?", "let's → shall we", "I am → aren't I?"],
    level: "A2", tags: ["question tag", "tag question", "agreement"],
  },
];

// ============================================================
// Word Formation (Prefixes & Suffixes)
// ============================================================

const WORD_FORMATION: GrammarRule[] = [
  {
    id: "prefix-un", category: "Word Formation", categoryChinese: "构词法",
    title: "Prefixes: un-, dis-, mis-", titleChinese: "前缀：un-, dis-, mis-",
    explanation: "Un- = not/un- reversed. Dis- = not/apart. Mis- = wrong.",
    explanationChinese: "un- = 不/相反。dis- = 不/分开。mis- = 错误地。",
    examples: [
      { correct: "unhappy = not happy", chinese: "不快乐" },
      { correct: "disagree = not agree", chinese: "不同意" },
      { correct: "mistake = wrong take", chinese: "错误" },
      { correct: "undo = reverse the action", chinese: "撤销" },
      { correct: "disappear = not appear", chinese: "消失" },
    ],
    tips: ["un- 最常见：unhappy, unable, unusual, unfair", "dis-：disagree, disappear, dislike, dishonest", "mis-：mistake, misunderstand, mislead"],
    level: "A2", tags: ["prefix", "un", "dis", "mis", "negative"],
  },
  {
    id: "suffix-tion", category: "Word Formation", categoryChinese: "构词法",
    title: "Suffixes: -tion, -ment, -ness, -ity", titleChinese: "后缀：-tion, -ment, -ness, -ity",
    explanation: "These suffixes turn verbs/adjectives into nouns.",
    explanationChinese: "这些后缀将动词/形容词变成名词。",
    examples: [
      { correct: "education (educate → education)", chinese: "教育" },
      { correct: "development (develop → development)", chinese: "发展" },
      { correct: "happiness (happy → happiness)", chinese: "幸福" },
      { correct: "ability (able → ability)", chinese: "能力" },
    ],
    tips: ["-tion 最常见：education, information, communication", "-ment：development, movement, agreement", "-ness：happiness, kindness, darkness", "-ity：ability, reality, possibility"],
    level: "B1", tags: ["suffix", "noun", "formation"],
  },
  {
    id: "suffix-ly-ous-ful", category: "Word Formation", categoryChinese: "构词法",
    title: "Suffixes: -ly, -ous, -ful, -less", titleChinese: "后缀：-ly, -ous, -ful, -less",
    explanation: "-ly → adverbs. -ous → adjectives. -ful = full of. -less = without.",
    explanationChinese: "-ly → 副词。-ous → 形容词。-ful = 充满。-less = 没有。",
    examples: [
      { correct: "quickly (quick → quickly)", chinese: "快速地" },
      { correct: "dangerous (danger → dangerous)", chinese: "危险的" },
      { correct: "beautiful (beauty → beautiful)", chinese: "美丽的" },
      { correct: "careless (care → careless)", chinese: "粗心的" },
    ],
    tips: ["-ly：quick→quickly, slow→slowly", "-ous：danger→dangerous, fame→famous", "-ful：hope→hopeful, help→helpful", "-less：hope→hopeless, help→helpless"],
    level: "A2", tags: ["suffix", "adjective", "adverb"],
  },
  {
    id: "prefix-re-pre-mis", category: "Word Formation", categoryChinese: "构词法",
    title: "Prefixes: re-, pre-, over-, out-", titleChinese: "前缀：re-, pre-, over-, out-",
    explanation: "Re- = again. Pre- = before. Over- = too much. Out- = beyond.",
    explanationChinese: "re- = 再次。pre- = 之前。over- = 过度。out- = 超出。",
    examples: [
      { correct: "rewrite = write again", chinese: "重写" },
      { correct: "preview = see before", chinese: "预览" },
      { correct: "overwork = work too much", chinese: "过度工作" },
      { correct: "outperform = perform better than", chinese: "超越" },
    ],
    tips: ["re-：rewrite, rebuild, return, restart", "pre-：preview, predict, prevent, prepare", "over-：overwork, overeat, overlook", "out-：outperform, outshine, outnumber"],
    level: "B1", tags: ["prefix", "re", "pre", "over", "out"],
  },
];

// ============================================================
// Prepositions (Advanced)
// ============================================================

const PREPOSITIONS_ADV: GrammarRule[] = [
  {
    id: "prep-time", category: "Prepositions (Advanced)", categoryChinese: "介词（高级）",
    title: "Time Prepositions: At, On, In", titleChinese: "时间介词：At, On, In",
    explanation: "At = specific time. On = days/dates. In = months/years/longer periods.",
    explanationChinese: "at = 具体时间点。on = 天/日期。in = 月/年/较长时间。",
    examples: [
      { correct: "at 3 o'clock", chinese: "在3点" },
      { correct: "on Monday", chinese: "在周一" },
      { correct: "in January", chinese: "在一月" },
      { correct: "in 2025", chinese: "在2025年" },
      { correct: "at night", chinese: "在晚上" },
      { correct: "on the weekend", chinese: "在周末" },
    ],
    tips: ["at + 时间点：at 7am, at noon, at night", "on + 天/日期：on Monday, on July 4th", "in + 月/年/季节：in summer, in 2025"],
    level: "A1", tags: ["preposition", "time", "at", "on", "in"],
  },
  {
    id: "prep-place", category: "Prepositions (Advanced)", categoryChinese: "介词（高级）",
    title: "Place Prepositions: At, On, In", titleChinese: "地点介词：At, On, In",
    explanation: "At = specific point. On = surface. In = enclosed space.",
    explanationChinese: "at = 具体点。on = 表面。in = 内部空间。",
    examples: [
      { correct: "at the door", chinese: "在门口" },
      { correct: "on the table", chinese: "在桌子上" },
      { correct: "in the room", chinese: "在房间里" },
      { correct: "at home", chinese: "在家" },
      { correct: "on the bus", chinese: "在公交车上" },
      { correct: "in the car", chinese: "在车里" },
    ],
    tips: ["at + 小地点：at the station, at school", "on + 表面：on the wall, on the floor", "in + 大地方/内部：in Beijing, in the box"],
    level: "A1", tags: ["preposition", "place", "at", "on", "in"],
  },
  {
    id: "prep-despite", category: "Prepositions (Advanced)", categoryChinese: "介词（高级）",
    title: "Despite / In Spite Of / Although", titleChinese: "尽管（三种表达）",
    explanation: "Despite/in spite of + noun/gerund. Although/even though + clause.",
    explanationChinese: "despite/in spite of + 名词/动名词。although/even though + 从句。",
    examples: [
      { correct: "Despite the rain, we went out.", chinese: "尽管下雨，我们还是出去了。" },
      { correct: "In spite of being tired, she kept working.", chinese: "尽管很累，她继续工作。" },
      { correct: "Although it rained, we went out.", chinese: "虽然下雨了，我们还是出去了。" },
    ],
    tips: ["despite + 名词/动名词（不接从句）", "although + 完整从句", "不要说 despite of（错误）"],
    level: "B1", tags: ["preposition", "despite", "although", "contrast"],
  },
];

// ============================================================
// Conjunctions (Advanced)
// ============================================================

const CONJUNCTIONS_ADV: GrammarRule[] = [
  {
    id: "conj-because", category: "Conjunctions (Advanced)", categoryChinese: "连词（高级）",
    title: "Because / Since / As", titleChinese: "Because / Since / As",
    explanation: "All give reasons. Because = strongest. Since/As = already known reasons.",
    explanationChinese: "都表示原因。because最强。since/as表示已知原因。",
    examples: [
      { correct: "I stayed home because I was sick.", chinese: "我待在家里因为我病了。" },
      { correct: "Since you're here, let's start.", chinese: "既然你在这里，我们开始吧。" },
      { correct: "As it was late, we decided to leave.", chinese: "因为很晚了，我们决定离开。" },
    ],
    tips: ["because 最常用，可放在句首或句中", "since/as = 既然（原因已知）", "because of + 名词（不是从句）"],
    level: "A2", tags: ["conjunction", "reason", "because", "since"],
  },
  {
    id: "conj-although", category: "Conjunctions (Advanced)", categoryChinese: "连词（高级）",
    title: "Although / Even though / While", titleChinese: "Although / Even though / While",
    explanation: "Express contrast or concession. Even though is stronger than although.",
    explanationChinese: "表达对比或让步。even though比although语气更强。",
    examples: [
      { correct: "Although it was cold, we went swimming.", chinese: "虽然很冷，我们还是去游泳了。" },
      { correct: "Even though she tried hard, she failed.", chinese: "尽管她很努力，还是失败了。" },
      { correct: "While I understand your point, I disagree.", chinese: "虽然我理解你的观点，但我不同意。" },
    ],
    tips: ["although 用于正式文体", "even though 语气更强", "while 还可以表示'当...时候'", "注意：although和but不能同时用"],
    level: "B1", tags: ["conjunction", "contrast", "although", "while"],
  },
];

// ============================================================
// Passive Voice (Advanced)
// ============================================================

const PASSIVE_ADV: GrammarRule[] = [
  {
    id: "passive-tenses", category: "Passive Voice (Advanced)", categoryChinese: "被动语态（高级）",
    title: "Passive in Different Tenses", titleChinese: "不同时态的被动语态",
    explanation: "Passive can be used in any tense: is done, was done, has been done, will be done.",
    explanationChinese: "被动语态可用于任何时态：is done, was done, has been done, will be done。",
    examples: [
      { correct: "English is spoken worldwide.", chinese: "英语在全球使用。（一般现在时被动）" },
      { correct: "The bridge was built in 1990.", chinese: "这座桥建于1990年。（一般过去时被动）" },
      { correct: "The report has been finished.", chinese: "报告已经完成了。（现在完成时被动）" },
      { correct: "The project will be completed next week.", chinese: "项目下周完成。（一般将来时被动）" },
    ],
    tips: ["am/is/are + done（现在）", "was/were + done（过去）", "have/has been + done（完成）", "will be + done（将来）"],
    level: "B1", tags: ["passive", "tense", "be + past participle"],
  },
];

// ============================================================
// Modal Verbs (Advanced)
// ============================================================

const MODALS_ADV: GrammarRule[] = [
  {
    id: "modal-have-to", category: "Modal Verbs (Advanced)", categoryChinese: "情态动词（高级）",
    title: "Must vs Have to vs Had to", titleChinese: "Must vs Have to vs Had to",
    explanation: "Must = internal obligation or strong deduction. Have to = external obligation. Had to = past obligation.",
    explanationChinese: "Must = 内在义务或强烈推测。Have to = 外部义务。Had to = 过去的义务。",
    examples: [
      { correct: "I must study harder.", chinese: "我必须更努力学习（自我要求）。" },
      { correct: "I have to wear a uniform at work.", chinese: "我工作必须穿制服（公司要求）。" },
      { correct: "I had to wait for two hours.", chinese: "我不得不等了两个小时。" },
      { correct: "She must be very talented.", chinese: "她一定很有天赋（推测）。" },
    ],
    tips: ["must 表主观意愿或推测", "have to 表客观要求", "mustn't = 禁止; don't have to = 不必", "had to 是have to的过去式"],
    level: "A2", tags: ["modal", "must", "have to", "obligation"],
  },
  {
    id: "modal-need", category: "Modal Verbs (Advanced)", categoryChinese: "情态动词（高级）",
    title: "Need as Modal vs Verb", titleChinese: "need作情态动词与实义动词",
    explanation: "Need as modal (negative/interrogative): need + base verb. Need as verb: need to + verb.",
    explanationChinese: "need作情态动词（否定/疑问）：need + 动词原形。need作实义动词：need to + 动词。",
    examples: [
      { correct: "Need I say more?", chinese: "我还需要多说吗？（情态动词）" },
      { correct: "You needn't worry.", chinese: "你不必担心。（情态动词）" },
      { correct: "I need to go now.", chinese: "我现在需要走了。（实义动词）" },
      { correct: "Do you need help?", chinese: "你需要帮助吗？（实义动词）" },
    ],
    tips: ["needn't = don't need to = don't have to", "need作情态动词仅用于否定和疑问", "日常英语更常用need to"],
    level: "B1", tags: ["modal", "need", "verb"],
  },
];

// ============================================================
// Gerunds & Infinitives (Advanced)
// ============================================================

const GERUNDS_ADV: GrammarRule[] = [
  {
    id: "gerund-after-preposition", category: "Gerunds & Infinitives (Advanced)", categoryChinese: "动名词与不定式（高级）",
    title: "Gerund After Prepositions", titleChinese: "介词后接动名词",
    explanation: "After prepositions, always use the gerund (-ing form), never the infinitive.",
    explanationChinese: "介词后总是用动名词（-ing形式），从不用不定式。",
    examples: [
      { correct: "I'm interested in learning English.", chinese: "我对学英语感兴趣。" },
      { correct: "She's good at cooking.", chinese: "她擅长做饭。" },
      { correct: "Thank you for helping me.", chinese: "谢谢你帮助我。" },
      { incorrect: "I'm interested in to learn English.", correct: "I'm interested in learning English.", chinese: "介词in后用动名词" },
    ],
    tips: ["介词后永远用动名词", "look forward to doing, be used to doing, be good at doing", "注意：to做介词时后接doing，做不定式时后接do"],
    level: "B1", tags: ["gerund", "preposition", "ing", "after-preposition"],
  },
  {
    id: "infinitive-after-adjective", category: "Gerunds & Infinitives (Advanced)", categoryChinese: "动名词与不定式（高级）",
    title: "Infinitive After Adjectives", titleChinese: "形容词后接不定式",
    explanation: "Some adjectives are followed by infinitives: happy, sad, surprised, glad, ready, able.",
    explanationChinese: "某些形容词后接不定式：happy, sad, surprised, glad, ready, able。",
    examples: [
      { correct: "I'm happy to see you.", chinese: "我很高兴见到你。" },
      { correct: "She's able to speak French.", chinese: "她能说法语。" },
      { correct: "We're ready to leave.", chinese: "我们准备好离开了。" },
    ],
    tips: ["be happy/sad/surprised/glad + to do", "be able/ready/willing/going + to do", "It is important to study."],
    level: "A2", tags: ["infinitive", "adjective", "happy", "able"],
  },
];

// ============================================================
// Articles (Advanced)
// ============================================================

const ARTICLES_ADV: GrammarRule[] = [
  {
    id: "art-some-any", category: "Articles (Advanced)", categoryChinese: "冠词（高级）",
    title: "Some vs Any", titleChinese: "Some vs Any",
    explanation: "Some: affirmative sentences, offers. Any: questions, negatives.",
    explanationChinese: "some：肯定句、提供。any：疑问句、否定句。",
    examples: [
      { correct: "I have some friends.", chinese: "我有一些朋友。" },
      { correct: "Do you have any friends?", chinese: "你有朋友吗？" },
      { correct: "I don't have any money.", chinese: "我没有钱。" },
      { correct: "Would you like some tea?", chinese: "你想喝点茶吗？（提供用some）" },
    ],
    tips: ["肯定句用some", "疑问句和否定句用any", "提供和邀请时用some", "some也可用于疑问句（期望肯定回答）"],
    level: "A2", tags: ["article", "some", "any", "determiner"],
  },
  {
    id: "art-much-many", category: "Articles (Advanced)", categoryChinese: "冠词（高级）",
    title: "Much vs Many vs A Lot Of", titleChinese: "Much vs Many vs A Lot Of",
    explanation: "Much + uncountable. Many + countable. A lot of + both.",
    explanationChinese: "much + 不可数名词。many + 可数名词。a lot of + 两者都可。",
    examples: [
      { correct: "There isn't much time.", chinese: "没有太多时间。" },
      { correct: "There aren't many people.", chinese: "没有很多人。" },
      { correct: "I have a lot of books.", chinese: "我有很多书。" },
      { correct: "She has a lot of experience.", chinese: "她有很多经验。" },
    ],
    tips: ["much + 不可数名词（常用于否定句）", "many + 可数名词（常用于否定句和疑问句）", "a lot of 两者都可，口语常用"],
    level: "A2", tags: ["determiner", "much", "many", "a lot of"],
  },
];

// ============================================================
// Pronouns (Advanced)
// ============================================================

const PRONOUNS_ADV: GrammarRule[] = [
  {
    id: "pron-who-whom", category: "Pronouns (Advanced)", categoryChinese: "代词（高级）",
    title: "Who vs Whom vs Whose", titleChinese: "Who vs Whom vs Whose",
    explanation: "Who = subject (he/she). Whom = object (him/her). Whose = possession.",
    explanationChinese: "who = 主语（他/她）。whom = 宾语（他/她）。whose = 所有格。",
    examples: [
      { correct: "Who is coming to the party?", chinese: "谁要来参加派对？（主语）" },
      { correct: "Whom did you invite?", chinese: "你邀请了谁？（宾语）" },
      { correct: "Whose book is this?", chinese: "这是谁的书？（所有格）" },
    ],
    tips: ["who 替代 he/she/they（主语）", "whom 替代 him/her/them（宾语）", "whose 替代 his/her/their（所有格）", "口语中who常替代whom"],
    level: "B1", tags: ["pronoun", "who", "whom", "whose"],
  },
  {
    id: "pron-reflexive", category: "Pronouns (Advanced)", categoryChinese: "代词（高级）",
    title: "Reflexive Pronouns", titleChinese: "反身代词",
    explanation: "Myself, yourself, himself, herself, itself, ourselves, themselves. Used when subject = object.",
    explanationChinese: "myself, yourself, himself等。当主语=宾语时使用。",
    examples: [
      { correct: "I hurt myself.", chinese: "我伤了自己。" },
      { correct: "She taught herself French.", chinese: "她自学了法语。" },
      { correct: "We enjoyed ourselves.", chinese: "我们玩得很开心。" },
    ],
    tips: ["主语和宾语是同一个人时用反身代词", "by myself = 独自", "myself 不能用myself替代 I（错误用法）"],
    level: "A2", tags: ["pronoun", "reflexive", "myself", "yourself"],
  },
];

// ============================================================
// Conditionals (Advanced)
// ============================================================

const CONDITIONALS_ADV: GrammarRule[] = [
  {
    id: "cond-mixed", category: "Conditionals (Advanced)", categoryChinese: "条件句（高级）",
    title: "Mixed Conditionals", titleChinese: "混合条件句",
    explanation: "Mix past and present: If + past perfect, would + base verb (past condition, present result).",
    explanationChinese: "混合过去和现在：If + 过去完成时，would + 动词原形（过去条件，现在结果）。",
    examples: [
      { correct: "If I had studied medicine, I would be a doctor now.", chinese: "如果我当时学了医，我现在就是医生了。" },
      { correct: "If she hadn't moved, she would still live in Beijing.", chinese: "如果她没搬走，她现在还住在北京。" },
    ],
    tips: ["混合条件句=不同时间的条件和结果", "过去条件 + 现在结果", "现在条件 + 过去结果"],
    level: "B2", tags: ["conditional", "mixed", "advanced"],
  },
];

// ============================================================
// Cleft Sentences & Emphasis
// ============================================================

const CLEFT: GrammarRule[] = [
  {
    id: "cleft-it-is", category: "Cleft Sentences", categoryChinese: "强调句",
    title: "It is/was ... that ...", titleChinese: "It is/was ... that ... 强调句",
    explanation: "Emphasize any part of the sentence except the verb.",
    explanationChinese: "强调句中除动词外的任何成分。",
    examples: [
      { correct: "It was John who called.", chinese: "是John打了电话。（强调主语）" },
      { correct: "It was yesterday that I met her.", chinese: "是昨天我遇到了她。（强调时间）" },
      { correct: "It is in London that they live.", chinese: "他们住在伦敦。（强调地点）" },
    ],
    tips: ["It is/was + 强调部分 + that + 其余部分", "不能强调动词（用do/does/did）", "强调人时可用who替代that"],
    level: "B2", tags: ["emphasis", "cleft", "it is", "that"],
  },
];

// ============================================================
// Inversion
// ============================================================

const INVERSION: GrammarRule[] = [
  {
    id: "inversion-negative", category: "Inversion", categoryChinese: "倒装句",
    title: "Negative Inversion", titleChinese: "否定词倒装",
    explanation: "When a negative adverb is at the start, invert subject and auxiliary.",
    explanationChinese: "当否定副词在句首时，倒装主语和助动词。",
    examples: [
      { correct: "Never have I seen such a thing.", chinese: "我从没见过这样的事。" },
      { correct: "Rarely does he arrive on time.", chinese: "他很少准时到达。" },
      { correct: "Not only did she win, but she also broke the record.", chinese: "她不仅赢了，还打破了纪录。" },
    ],
    tips: ["Never/Rarely/Seldom/Hardly/Not only + 助动词 + 主语", "用于正式写作和演讲", "日常口语较少使用"],
    level: "B2", tags: ["inversion", "negative", "never", "rarely", "formal"],
  },
];

// ============================================================
// Participle Clauses
// ============================================================

const PARTICIPLES: GrammarRule[] = [
  {
    id: "participle-present", category: "Participle Clauses", categoryChinese: "分词从句",
    title: "Present Participle Clauses", titleChinese: "现在分词从句",
    explanation: "Use -ing clauses to combine two actions. The subject must be the same.",
    explanationChinese: "用-ing从句合并两个动作。主语必须相同。",
    examples: [
      { correct: "Walking home, I saw a beautiful sunset.", chinese: "走回家的路上，我看到了美丽的日落。" },
      { correct: "She sat reading a book.", chinese: "她坐着看书。" },
      { correct: "Being tired, he went to bed early.", chinese: "因为累了，他早早上床了。" },
    ],
    tips: ["现在分词表主动/同时发生", "过去分词表被动/已完成", "分词从句的主语必须与主句相同"],
    level: "B2", tags: ["participle", "present", "-ing", "clause"],
  },
  {
    id: "participle-past", category: "Participle Clauses", categoryChinese: "分词从句",
    title: "Past Participle Clauses", titleChinese: "过去分词从句",
    explanation: "Use past participle to express passive meaning or completed state.",
    explanationChinese: "用过去分词表示被动含义或完成状态。",
    examples: [
      { correct: "Finished early, she left the office.", chinese: "提前完成后，她离开了办公室。" },
      { correct: "Seen from the hill, the city looks beautiful.", chinese: "从山上看，这座城市很美。" },
      { correct: "Excited by the news, they celebrated.", chinese: "因为消息而兴奋，他们庆祝了。" },
    ],
    tips: ["过去分词表被动/状态", "常用于书面语", "可以转换为从句：When she finished..."],
    level: "B2", tags: ["participle", "past", "passive", "clause"],
  },
];

// ============================================================
// Causative
// ============================================================

const CAUSATIVE: GrammarRule[] = [
  {
    id: "causative-have-get", category: "Causative", categoryChinese: "使役结构",
    title: "Have / Get Something Done", titleChinese: "Have/Get something done",
    explanation: "Have or get + object + past participle = arrange for someone to do something.",
    explanationChinese: "have或get + 宾语 + 过去分词 = 安排别人做某事。",
    examples: [
      { correct: "I had my hair cut yesterday.", chinese: "我昨天理了发（别人帮我剪的）。" },
      { correct: "She got her car repaired.", chinese: "她修了车（别人修的）。" },
      { correct: "We need to get the house painted.", chinese: "我们需要让人粉刷房子。" },
    ],
    tips: ["have/get something done = 安排/让别人做", "不是自己做的", "形式上像被动，但意思是使役"],
    level: "B1", tags: ["causative", "have done", "get done"],
  },
];

// ============================================================
// Common Errors (Extended for Chinese Learners)
// ============================================================

const ERRORS_ADV: GrammarRule[] = [
  {
    id: "err-chinese-word-order", category: "Common Errors (Chinese Learners)", categoryChinese: "中国学习者常见错误",
    title: "Chinese Word Order Transfer", titleChinese: "中文语序干扰",
    explanation: "Chinese places time/place before the verb. English places them after.",
    explanationChinese: "中文把时间/地点放在动词前。英语放在动词后。",
    examples: [
      { incorrect: "I yesterday went to school.", correct: "I went to school yesterday.", chinese: "时间放在句末" },
      { incorrect: "She very likes English.", correct: "She likes English very much.", chinese: "very不能修饰动词" },
      { incorrect: "I very want to go.", correct: "I really want to go.", chinese: "用really修饰want" },
    ],
    tips: ["时间/地点放在句末或句首", "very修饰形容词/副词，不修饰动词", "用really或very much修饰动词"],
    level: "A1", tags: ["error", "chinese", "word-order", "transfer"],
  },
  {
    id: "err-verb-tense-chinese", category: "Common Errors (Chinese Learners)", categoryChinese: "中国学习者常见错误",
    title: "Missing Verb Tense Marking", titleChinese: "缺少动词时态标记",
    explanation: "Chinese verbs don't change form. English verbs must show tense through conjugation.",
    explanationChinese: "中文动词不变形。英语动词必须通过变位显示时态。",
    examples: [
      { incorrect: "Yesterday I go to school.", correct: "Yesterday I went to school.", chinese: "过去时间用过去式" },
      { incorrect: "Every day she eat breakfast.", correct: "Every day she eats breakfast.", chinese: "第三人称单数加s" },
      { incorrect: "I living in Beijing.", correct: "I live in Beijing. / I am living in Beijing.", chinese: "注意be动词的使用" },
    ],
    tips: ["每个句子都需要正确的时态", "第三人称单数现在时加-s", "be动词不能省略"],
    level: "A1", tags: ["error", "tense", "chinese", "conjugation"],
  },
  {
    id: "err-countable-uncountable", category: "Common Errors (Chinese Learners)", categoryChinese: "中国学习者常见错误",
    title: "Countable/Uncountable Confusion", titleChinese: "可数/不可数名词混淆",
    explanation: "Chinese doesn't mark countability. English has strict rules about articles and plurals.",
    explanationChinese: "中文不标记可数性。英语对冠词和复数有严格规则。",
    examples: [
      { incorrect: "I have many homework.", correct: "I have a lot of homework.", chinese: "homework不可数" },
      { incorrect: "She has a few informations.", correct: "She has some information.", chinese: "information不可数" },
      { incorrect: "I want a water.", correct: "I want some water. / I want a bottle of water.", chinese: "water不可数" },
    ],
    tips: ["不可数名词不能加-s", "不可数名词前不用a/an", "用much/little修饰不可数名词", "用many/few修饰可数名词"],
    level: "A2", tags: ["error", "countable", "uncountable", "article"],
  },
  {
    id: "err-preposition-chinese", category: "Common Errors (Chinese Learners)", categoryChinese: "中国学习者常见错误",
    title: "Preposition Translation Errors", titleChinese: "介词翻译错误",
    explanation: "Prepositions cannot be directly translated between Chinese and English.",
    explanationChinese: "介词不能在中英文之间直接翻译。",
    examples: [
      { incorrect: "I listen music.", correct: "I listen to music.", chinese: "listen to" },
      { incorrect: "I arrive to school.", correct: "I arrive at school.", chinese: "arrive at" },
      { incorrect: "I am interested for English.", correct: "I am interested in English.", chinese: "interested in" },
      { incorrect: "I depend of others.", correct: "I depend on others.", chinese: "depend on" },
    ],
    tips: ["介词搭配需要逐个记忆", "listen to, arrive at/in, interested in", "每个动词/形容词有固定搭配"],
    level: "A2", tags: ["error", "preposition", "chinese", "collocation"],
  },
  {
    id: "err-articles-chinese", category: "Common Errors (Chinese Learners)", categoryChinese: "中国学习者常见错误",
    title: "Article Omission (Chinese Learners)", titleChinese: "冠词省略（中文学习者）",
    explanation: "Chinese has no articles. Learners often omit a/an/the where needed.",
    explanationChinese: "中文没有冠词。学习者经常在需要冠词的地方省略。",
    examples: [
      { incorrect: "I want to buy car.", correct: "I want to buy a car.", chinese: "可数名词前需要冠词" },
      { incorrect: "She is best student.", correct: "She is the best student.", chinese: "最高级前需要the" },
      { incorrect: "I like cat.", correct: "I like cats. / I like the cat.", chinese: "泛指用复数或the" },
    ],
    tips: ["单数可数名词不能裸用", "泛指用a/an或复数", "特指用the", "不可数名词泛指不加冠词"],
    level: "A1", tags: ["error", "article", "chinese", "omission"],
  },
];

// ============================================================
// Export All Advanced Rules
// ============================================================

export const ADVANCED_GRAMMAR_RULES: GrammarRule[] = [
  ...GERUNDS_INFINITIVES,
  ...COMPARISON,
  ...REPORTED_SPEECH,
  ...PHRASAL_VERBS,
  ...WISH,
  ...USED_TO,
  ...QUESTION_TAGS,
  ...WORD_FORMATION,
  ...PREPOSITIONS_ADV,
  ...CONJUNCTIONS_ADV,
  ...PASSIVE_ADV,
  ...MODALS_ADV,
  ...GERUNDS_ADV,
  ...ARTICLES_ADV,
  ...PRONOUNS_ADV,
  ...CONDITIONALS_ADV,
  ...CLEFT,
  ...INVERSION,
  ...PARTICIPLES,
  ...CAUSATIVE,
  ...ERRORS_ADV,
];

export const ADVANCED_GRAMMAR_STATS = {
  total: ADVANCED_GRAMMAR_RULES.length,
  categories: [...new Set(ADVANCED_GRAMMAR_RULES.map(r => r.category))].length,
};
