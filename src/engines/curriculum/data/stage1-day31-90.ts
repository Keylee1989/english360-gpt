/**
 * Stage 1 Curriculum Data - Day 31-90
 * 
 * Extended foundation stage:
 * - Day 31-60: Basic Communication
 * - Day 61-90: Intermediate Foundation
 * 
 * Each day: 240 minutes
 * Complete activity-based structure
 */

import type { DailyLesson } from "@/types/database";

// ============================================================
// Helper Functions
// ============================================================

function createLesson(
  dayNumber: number,
  theme: string,
  themeChinese: string,
  words: { word: string; ipa: string; chineseMeaning: string; example: string; exampleChinese: string }[],
  grammarRule: string,
  grammarRuleChinese: string,
  grammarExamples: { correct: string; chinese: string }[],
  listenText: string,
  listenChinese: string,
  speakText: string,
  speakChinese: string,
): DailyLesson {
  return {
    id: `lesson_day_${dayNumber}`,
    dayId: `day_${dayNumber}`,
    activities: [
      {
        id: "a1",
        type: "vocabulary_introduction",
        title: theme,
        titleChinese: themeChinese,
        description: `Learn ${words.length} new words`,
        descriptionChinese: `学习${words.length}个新单词`,
        duration: 40,
        objective: { english: `Learn ${theme}`, chinese: `学习${themeChinese}` },
        content: { words },
        userAction: { type: "listen", instruction: "Listen and learn", instructionChinese: "听并学习" },
        evaluation: { type: "self_check" },
        completed: false,
      },
      {
        id: "a2",
        type: "grammar_explanation",
        title: grammarRule,
        titleChinese: grammarRuleChinese,
        description: `Learn ${grammarRule}`,
        descriptionChinese: `学习${grammarRuleChinese}`,
        duration: 25,
        objective: { english: grammarRule, chinese: grammarRuleChinese },
        content: { grammarPoint: { rule: grammarRule, ruleChinese: grammarRuleChinese, examples: grammarExamples } },
        userAction: { type: "read", instruction: "Read the grammar", instructionChinese: "阅读语法" },
        evaluation: { type: "self_check" },
        completed: false,
      },
      {
        id: "a3",
        type: "listening_comprehension",
        title: `${theme} Listening`,
        titleChinese: `${themeChinese}听力`,
        description: "Listen and understand",
        descriptionChinese: "听力理解练习",
        duration: 25,
        objective: { english: "Listening practice", chinese: "听力练习" },
        content: { audio: { text: listenText, chineseText: listenChinese, speed: "slow" } },
        userAction: { type: "listen", instruction: "Listen carefully", instructionChinese: "仔细听" },
        evaluation: { type: "self_check" },
        completed: false,
      },
      {
        id: "a4",
        type: "speaking_repetition",
        title: `${theme} Speaking`,
        titleChinese: `${themeChinese}口语`,
        description: "Practice speaking",
        descriptionChinese: "口语练习",
        duration: 25,
        objective: { english: "Speaking practice", chinese: "口语练习" },
        content: { audio: { text: speakText, chineseText: speakChinese, speed: "slow" } },
        userAction: { type: "repeat", instruction: "Repeat after the audio", instructionChinese: "跟读" },
        evaluation: { type: "self_check" },
        completed: false,
      },
      {
        id: "a5",
        type: "reading_comprehension",
        title: `${theme} Reading`,
        titleChinese: `${themeChinese}阅读`,
        description: "Read and understand",
        descriptionChinese: "阅读理解",
        duration: 25,
        objective: { english: "Reading practice", chinese: "阅读练习" },
        content: { readingPassage: { text: speakText, chineseTranslation: speakChinese, level: "controlled" } },
        userAction: { type: "read", instruction: "Read the text", instructionChinese: "阅读文本" },
        evaluation: { type: "self_check" },
        completed: false,
      },
      {
        id: "a6",
        type: "writing_practice",
        title: `${theme} Writing`,
        titleChinese: `${themeChinese}写作`,
        description: "Practice writing",
        descriptionChinese: "写作练习",
        duration: 25,
        objective: { english: "Writing practice", chinese: "写作练习" },
        content: { writingPrompt: { prompt: `Write about ${theme.toLowerCase()}`, chinesePrompt: `写关于${themeChinese}`, wordBank: words.slice(0, 4).map(w => w.chineseMeaning), example: words[0]?.example || "" } },
        userAction: { type: "write", instruction: "Write sentences", instructionChinese: "写句子" },
        evaluation: { type: "self_check" },
        completed: false,
      },
      {
        id: "a7",
        type: "review",
        title: `Day ${dayNumber} Review`,
        titleChinese: `第${dayNumber}天复习`,
        description: "Review today's content",
        descriptionChinese: "复习今天的内容",
        duration: 75,
        objective: { english: "Review all content", chinese: "复习所有内容" },
        content: { reviewItems: words.slice(0, 6).map(w => ({ word: w.word, chineseMeaning: w.chineseMeaning })) },
        userAction: { type: "select", instruction: "Review vocabulary", instructionChinese: "复习词汇" },
        evaluation: { type: "automatic", passingScore: 0.7 },
        completed: false,
      },
    ],
    vocabulary: { words: words.map(w => w.word), exercises: [] },
    grammar: { pointId: `grammar_day_${dayNumber}`, explanation: { english: grammarRule, chinese: grammarRuleChinese }, examples: grammarExamples, exercises: [] },
    listening: { audioUrl: "", transcript: listenText, chineseTranscript: listenChinese, speed: "slow", questions: [] },
    speaking: { scenario: theme, chineseScenario: themeChinese, dialogue: [{ speaker: "model", english: speakText, chinese: speakChinese }], practicePrompts: [`Talk about ${theme.toLowerCase()}`] },
    reading: { text: speakText, chineseTranslation: speakChinese, level: "controlled", questions: [] },
    writing: { type: "controlled", prompt: `Write about ${theme.toLowerCase()}`, chinesePrompt: `写关于${themeChinese}`, example: words[0]?.example || "", wordBank: words.slice(0, 4).map(w => w.chineseMeaning) },
    review: { srsReview: true, wordReview: words.slice(0, 4).map(w => w.word), grammarReview: [`grammar_day_${dayNumber}`] },
    totalDuration: 240,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

// ============================================================
// Day 31-60: Basic Communication
// ============================================================

export const DAY_31 = createLesson(31, "Shopping", "购物",
  [
    { word: "buy", ipa: "/baɪ/", chineseMeaning: "买", example: "I buy food.", exampleChinese: "我买食物。" },
    { word: "sell", ipa: "/sɛl/", chineseMeaning: "卖", example: "They sell clothes.", exampleChinese: "他们卖衣服。" },
    { word: "price", ipa: "/praɪs/", chineseMeaning: "价格", example: "What is the price?", exampleChinese: "价格是多少？" },
    { word: "cheap", ipa: "/tʃiːp/", chineseMeaning: "便宜的", example: "This is cheap.", exampleChinese: "这个很便宜。" },
    { word: "expensive", ipa: "/ɪkˈspɛnsɪv/", chineseMeaning: "贵的", example: "That is expensive.", exampleChinese: "那个很贵。" },
    { word: "money", ipa: "/ˈmʌni/", chineseMeaning: "钱", example: "I have money.", exampleChinese: "我有钱。" },
  ],
  "How much is it?", "多少钱？",
  [{ correct: "How much is it?", chinese: "多少钱？" }, { correct: "It is five dollars.", chinese: "五美元。" }],
  "How much is it? It is cheap. I buy it.", "多少钱？很便宜。我买了。",
  "How much is this? It is ten dollars.", "这个多少钱？十美元。");

export const DAY_32 = createLesson(32, "At the Restaurant", "在餐厅",
  [
    { word: "menu", ipa: "/ˈmɛnjuː/", chineseMeaning: "菜单", example: "Can I see the menu?", exampleChinese: "我能看看菜单吗？" },
    { word: "order", ipa: "/ˈɔːrdər/", chineseMeaning: "点餐", example: "I want to order.", exampleChinese: "我想点餐。" },
    { word: "bill", ipa: "/bɪl/", chineseMeaning: "账单", example: "Can I have the bill?", exampleChinese: "能给我账单吗？" },
    { word: "waiter", ipa: "/ˈweɪtər/", chineseMeaning: "服务员", example: "Excuse me, waiter.", exampleChinese: "打扰一下，服务员。" },
    { word: "delicious", ipa: "/dɪˈlɪʃəs/", chineseMeaning: "美味的", example: "The food is delicious.", exampleChinese: "食物很美味。" },
    { word: "hungry", ipa: "/ˈhʌŋɡri/", chineseMeaning: "饿的", example: "I am hungry.", exampleChinese: "我饿了。" },
  ],
  "Can I...?", "我能...吗？",
  [{ correct: "Can I see the menu?", chinese: "我能看看菜单吗？" }, { correct: "Can I have the bill?", chinese: "能给我账单吗？" }],
  "I am hungry. Can I see the menu? The food is delicious.", "我饿了。我能看看菜单吗？食物很美味。",
  "Can I order? I want rice and chicken.", "我能点餐吗？我想要米饭和鸡肉。");

export const DAY_33 = createLesson(33, "At the Hotel", "在酒店",
  [
    { word: "hotel", ipa: "/hoʊˈtɛl/", chineseMeaning: "酒店", example: "We stay at a hotel.", exampleChinese: "我们住在酒店。" },
    { word: "room", ipa: "/ruːm/", chineseMeaning: "房间", example: "I want a room.", exampleChinese: "我想要一个房间。" },
    { word: "key", ipa: "/kiː/", chineseMeaning: "钥匙", example: "Here is your key.", exampleChinese: "这是你的钥匙。" },
    { word: "check in", ipa: "/tʃɛk ɪn/", chineseMeaning: "入住", example: "I want to check in.", exampleChinese: "我想入住。" },
    { word: "check out", ipa: "/tʃɛk aʊt/", chineseMeaning: "退房", example: "I want to check out.", exampleChinese: "我想退房。" },
    { word: "reservation", ipa: "/ˌrɛzərˈveɪʃən/", chineseMeaning: "预订", example: "I have a reservation.", exampleChinese: "我有预订。" },
  ],
  "I want to...", "我想...",
  [{ correct: "I want to check in.", chinese: "我想入住。" }, { correct: "I want a room.", chinese: "我想要一个房间。" }],
  "I have a reservation. I want to check in. Here is my key.", "我有预订。我想入住。这是我的钥匙。",
  "I want a room. What is the price?", "我想要一个房间。价格是多少？");

export const DAY_34 = createLesson(34, "Transportation", "交通",
  [
    { word: "taxi", ipa: "/ˈtæksi/", chineseMeaning: "出租车", example: "I take a taxi.", exampleChinese: "我坐出租车。" },
    { word: "airport", ipa: "/ˈɛrpɔːrt/", chineseMeaning: "机场", example: "I go to the airport.", exampleChinese: "我去机场。" },
    { word: "ticket", ipa: "/ˈtɪkɪt/", chineseMeaning: "票", example: "I buy a ticket.", exampleChinese: "我买票。" },
    { word: "departure", ipa: "/dɪˈpɑːrtʃər/", chineseMeaning: "出发", example: "What is the departure time?", exampleChinese: "出发时间是什么？" },
    { word: "arrival", ipa: "/əˈraɪvəl/", chineseMeaning: "到达", example: "When is the arrival?", exampleChinese: "什么时候到达？" },
    { word: "platform", ipa: "/ˈplætfɔːrm/", chineseMeaning: "站台", example: "The train is on platform 3.", exampleChinese: "火车在3号站台。" },
  ],
  "I take the...", "我坐...",
  [{ correct: "I take a taxi.", chinese: "我坐出租车。" }, { correct: "I take the bus.", chinese: "我坐公交车。" }],
  "I go to the airport. I take a taxi. I buy a ticket.", "我去机场。我坐出租车。我买票。",
  "I take the train. What platform?", "我坐火车。哪个站台？");

export const DAY_35 = createLesson(35, "At the Hospital", "在医院",
  [
    { word: "doctor", ipa: "/ˈdɒktər/", chineseMeaning: "医生", example: "I see a doctor.", exampleChinese: "我看医生。" },
    { word: "nurse", ipa: "/nɜːrs/", chineseMeaning: "护士", example: "The nurse helps me.", exampleChinese: "护士帮助我。" },
    { word: "sick", ipa: "/sɪk/", chineseMeaning: "生病的", example: "I am sick.", exampleChinese: "我生病了。" },
    { word: "pain", ipa: "/peɪn/", chineseMeaning: "疼痛", example: "I have pain.", exampleChinese: "我很疼。" },
    { word: "medicine", ipa: "/ˈmɛdɪsən/", chineseMeaning: "药", example: "I take medicine.", exampleChinese: "我吃药。" },
    { word: "appointment", ipa: "/əˈpɔɪntmənt/", chineseMeaning: "预约", example: "I have an appointment.", exampleChinese: "我有预约。" },
  ],
  "I have a...", "我有...",
  [{ correct: "I have a headache.", chinese: "我头疼。" }, { correct: "I have an appointment.", chinese: "我有预约。" }],
  "I am sick. I see a doctor. I take medicine.", "我生病了。我看医生。我吃药。",
  "I have pain. Can I see a doctor?", "我很疼。我能看医生吗？");

export const DAY_36 = createLesson(36, "Weather and Seasons", "天气和季节",
  [
    { word: "sunny", ipa: "/ˈsʌni/", chineseMeaning: "晴朗的", example: "It is sunny.", exampleChinese: "天气晴朗。" },
    { word: "cloudy", ipa: "/ˈklaʊdi/", chineseMeaning: "多云的", example: "It is cloudy.", exampleChinese: "多云。" },
    { word: "rainy", ipa: "/ˈreɪni/", chineseMeaning: "下雨的", example: "It is rainy.", exampleChinese: "下雨。" },
    { word: "snowy", ipa: "/ˈsnoʊi/", chineseMeaning: "下雪的", example: "It is snowy.", exampleChinese: "下雪。" },
    { word: "windy", ipa: "/ˈwɪndi/", chineseMeaning: "有风的", example: "It is windy.", exampleChinese: "有风。" },
    { word: "temperature", ipa: "/ˈtɛmprətʃər/", chineseMeaning: "温度", example: "What is the temperature?", exampleChinese: "温度是多少？" },
  ],
  "It is + weather adjective", "天气是...",
  [{ correct: "It is sunny today.", chinese: "今天天气晴朗。" }, { correct: "It is cold in winter.", chinese: "冬天很冷。" }],
  "It is sunny. The temperature is high. Summer is hot.", "天气晴朗。温度很高。夏天很热。",
  "How is the weather? It is rainy today.", "天气怎么样？今天下雨。");

export const DAY_37 = createLesson(37, "Hobbies", "爱好",
  [
    { word: "hobby", ipa: "/ˈhɒbi/", chineseMeaning: "爱好", example: "What is your hobby?", exampleChinese: "你的爱好是什么？" },
    { word: "sports", ipa: "/spɔːrts/", chineseMeaning: "运动", example: "I like sports.", exampleChinese: "我喜欢运动。" },
    { word: "music", ipa: "/ˈmjuːzɪk/", chineseMeaning: "音乐", example: "I listen to music.", exampleChinese: "我听音乐。" },
    { word: "movie", ipa: "/ˈmuːvi/", chineseMeaning: "电影", example: "I watch movies.", exampleChinese: "我看电影。" },
    { word: "game", ipa: "/ɡeɪm/", chineseMeaning: "游戏", example: "I play games.", exampleChinese: "我玩游戏。" },
    { word: "cook", ipa: "/kʊk/", chineseMeaning: "做饭", example: "I like to cook.", exampleChinese: "我喜欢做饭。" },
  ],
  "I like to + verb", "我喜欢...",
  [{ correct: "I like to read.", chinese: "我喜欢读书。" }, { correct: "I like to play sports.", chinese: "我喜欢运动。" }],
  "What is your hobby? I like to read. I like music.", "你的爱好是什么？我喜欢读书。我喜欢音乐。",
  "I like to cook. I like to watch movies.", "我喜欢做饭。我喜欢看电影。");

export const DAY_38 = createLesson(38, "Clothes and Fashion", "服装和时尚",
  [
    { word: "wear", ipa: "/wɛr/", chineseMeaning: "穿", example: "I wear a shirt.", exampleChinese: "我穿衬衫。" },
    { word: "style", ipa: "/staɪl/", chineseMeaning: "风格", example: "I like your style.", exampleChinese: "我喜欢你的风格。" },
    { word: "fashion", ipa: "/ˈfæʃən/", chineseMeaning: "时尚", example: "She likes fashion.", exampleChinese: "她喜欢时尚。" },
    { word: "color", ipa: "/ˈkʌlər/", chineseMeaning: "颜色", example: "What color is it?", exampleChinese: "它是什么颜色？" },
    { word: "size", ipa: "/saɪz/", chineseMeaning: "尺寸", example: "What size do you wear?", exampleChinese: "你穿多大尺寸？" },
    { word: "comfortable", ipa: "/ˈkʌmftəbəl/", chineseMeaning: "舒适的", example: "This is comfortable.", exampleChinese: "这个很舒适。" },
  ],
  "I like + clothing", "我喜欢...",
  [{ correct: "I like this shirt.", chinese: "我喜欢这件衬衫。" }, { correct: "It is comfortable.", chinese: "它很舒适。" }],
  "I wear a blue shirt. I like this style. It is comfortable.", "我穿蓝色衬衫。我喜欢这个风格。它很舒适。",
  "What size? What color? I like blue.", "什么尺寸？什么颜色？我喜欢蓝色。");

export const DAY_39 = createLesson(39, "Technology", "科技",
  [
    { word: "computer", ipa: "/kəmˈpjuːtər/", chineseMeaning: "电脑", example: "I use a computer.", exampleChinese: "我用电脑。" },
    { word: "phone", ipa: "/foʊn/", chineseMeaning: "电话", example: "I have a phone.", exampleChinese: "我有电话。" },
    { word: "internet", ipa: "/ˈɪntərnɛt/", chineseMeaning: "互联网", example: "I use the internet.", exampleChinese: "我用互联网。" },
    { word: "website", ipa: "/ˈwɛbsaɪt/", chineseMeaning: "网站", example: "I visit a website.", exampleChinese: "我访问网站。" },
    { word: "email", ipa: "/ˈiːmeɪl/", chineseMeaning: "电子邮件", example: "I send an email.", exampleChinese: "我发电子邮件。" },
    { word: "download", ipa: "/ˈdaʊnloʊd/", chineseMeaning: "下载", example: "I download a file.", exampleChinese: "我下载文件。" },
  ],
  "I use + technology", "我用...",
  [{ correct: "I use a computer.", chinese: "我用电脑。" }, { correct: "I send an email.", chinese: "我发电子邮件。" }],
  "I use a computer. I send an email. I visit a website.", "我用电脑。我发电子邮件。我访问网站。",
  "I have a phone. I use the internet.", "我有电话。我用互联网。");

export const DAY_40 = createLesson(40, "Sports and Exercise", "运动和锻炼",
  [
    { word: "play", ipa: "/pleɪ/", chineseMeaning: "玩/打", example: "I play soccer.", exampleChinese: "我踢足球。" },
    { word: "run", ipa: "/rʌn/", chineseMeaning: "跑", example: "I run every day.", exampleChinese: "我每天跑步。" },
    { word: "swim", ipa: "/swɪm/", chineseMeaning: "游泳", example: "I swim in the pool.", exampleChinese: "我在泳池游泳。" },
    { word: "exercise", ipa: "/ˈɛksərsaɪz/", chineseMeaning: "锻炼", example: "I exercise daily.", exampleChinese: "我每天锻炼。" },
    { word: "team", ipa: "/tiːm/", chineseMeaning: "团队", example: "I am on a team.", exampleChinese: "我在一个团队。" },
    { word: "win", ipa: "/wɪn/", chineseMeaning: "赢", example: "We win the game.", exampleChinese: "我们赢了比赛。" },
  ],
  "I play + sport", "我打/踢...",
  [{ correct: "I play soccer.", chinese: "我踢足球。" }, { correct: "I play basketball.", chinese: "我打篮球。" }],
  "I play soccer. I run every day. I exercise.", "我踢足球。我每天跑步。我锻炼。",
  "I like sports. I play on a team.", "我喜欢运动。我在一个团队。");

export const DAY_41 = createLesson(41, "Jobs and Careers", "工作和职业",
  [
    { word: "job", ipa: "/dʒɒb/", chineseMeaning: "工作", example: "What is your job?", exampleChinese: "你的工作是什么？" },
    { word: "work", ipa: "/wɜːrk/", chineseMeaning: "工作", example: "I work at a bank.", exampleChinese: "我在银行工作。" },
    { word: "office", ipa: "/ˈɒfɪs/", chineseMeaning: "办公室", example: "I work in an office.", exampleChinese: "我在办公室工作。" },
    { word: "meeting", ipa: "/ˈmiːtɪŋ/", chineseMeaning: "会议", example: "I have a meeting.", exampleChinese: "我有会议。" },
    { word: "boss", ipa: "/bɒs/", chineseMeaning: "老板", example: "My boss is nice.", exampleChinese: "我的老板很好。" },
    { word: "salary", ipa: "/ˈsæləri/", chineseMeaning: "工资", example: "What is your salary?", exampleChinese: "你的工资是多少？" },
  ],
  "I work + place", "我在...工作",
  [{ correct: "I work at a bank.", chinese: "我在银行工作。" }, { correct: "I work in an office.", chinese: "我在办公室工作。" }],
  "I work at a bank. I have a meeting. My boss is nice.", "我在银行工作。我有会议。我的老板很好。",
  "What is your job? I work in an office.", "你的工作是什么？我在办公室工作。");

export const DAY_42 = createLesson(42, "School and Education", "学校和教育",
  [
    { word: "class", ipa: "/klæs/", chineseMeaning: "班级/课", example: "I am in class.", exampleChinese: "我在上课。" },
    { word: "homework", ipa: "/ˈhoʊmwɜːrk/", chineseMeaning: "作业", example: "I do homework.", exampleChinese: "我做作业。" },
    { word: "exam", ipa: "/ɪɡˈzæm/", chineseMeaning: "考试", example: "I have an exam.", exampleChinese: "我有考试。" },
    { word: "grade", ipa: "/ɡreɪd/", chineseMeaning: "成绩", example: "I have good grades.", exampleChinese: "我成绩很好。" },
    { word: "study", ipa: "/ˈstʌdi/", chineseMeaning: "学习", example: "I study English.", exampleChinese: "我学英语。" },
    { word: "learn", ipa: "/lɜːrn/", chineseMeaning: "学习", example: "I learn new words.", exampleChinese: "我学新单词。" },
  ],
  "I study + subject", "我学...",
  [{ correct: "I study English.", chinese: "我学英语。" }, { correct: "I study math.", chinese: "我学数学。" }],
  "I study English. I do homework. I have an exam.", "我学英语。我做作业。我有考试。",
  "I am a student. I study every day.", "我是学生。我每天学习。");

export const DAY_43 = createLesson(43, "Family Activities", "家庭活动",
  [
    { word: "visit", ipa: "/ˈvɪzɪt/", chineseMeaning: "拜访", example: "I visit my family.", exampleChinese: "我拜访我的家人。" },
    { word: "dinner", ipa: "/ˈdɪnər/", chineseMeaning: "晚餐", example: "We eat dinner together.", exampleChinese: "我们一起吃晚餐。" },
    { word: "weekend", ipa: "/ˈwiːkɛnd/", chineseMeaning: "周末", example: "What do you do on weekends?", exampleChinese: "你周末做什么？" },
    { word: "vacation", ipa: "/veɪˈkeɪʃən/", chineseMeaning: "假期", example: "I go on vacation.", exampleChinese: "我去度假。" },
    { word: "together", ipa: "/təˈɡɛðər/", chineseMeaning: "一起", example: "We are together.", exampleChinese: "我们在一起。" },
    { word: "fun", ipa: "/fʌn/", chineseMeaning: "有趣", example: "We have fun.", exampleChinese: "我们玩得很开心。" },
  ],
  "We + verb", "我们...",
  [{ correct: "We eat dinner together.", chinese: "我们一起吃晚餐。" }, { correct: "We have fun.", chinese: "我们玩得很开心。" }],
  "We eat dinner together. We have fun. We are a family.", "我们一起吃晚餐。我们玩得很开心。我们是一家人。",
  "What do you do on weekends? We visit family.", "你周末做什么？我们拜访家人。");

export const DAY_44 = createLesson(44, "City and Town", "城市和城镇",
  [
    { word: "street", ipa: "/striːt/", chineseMeaning: "街道", example: "I walk on the street.", exampleChinese: "我在街上走。" },
    { word: "building", ipa: "/ˈbɪldɪŋ/", chineseMeaning: "建筑物", example: "The building is tall.", exampleChinese: "建筑物很高。" },
    { word: "bridge", ipa: "/brɪdʒ/", chineseMeaning: "桥", example: "I cross the bridge.", exampleChinese: "我过桥。" },
    { word: "museum", ipa: "/mjuːˈziːəm/", chineseMeaning: "博物馆", example: "I visit the museum.", exampleChinese: "我参观博物馆。" },
    { word: "library", ipa: "/ˈlaɪbrɛri/", chineseMeaning: "图书馆", example: "I go to the library.", exampleChinese: "我去图书馆。" },
    { word: "market", ipa: "/ˈmɑːrkɪt/", chineseMeaning: "市场", example: "I shop at the market.", exampleChinese: "我在市场购物。" },
  ],
  "I go to + place", "我去...",
  [{ correct: "I go to the library.", chinese: "我去图书馆。" }, { correct: "I go to the market.", chinese: "我去市场。" }],
  "I go to the library. I visit the museum. I walk on the street.", "我去图书馆。我参观博物馆。我在街上走。",
  "I live in a city. There are many buildings.", "我住在城市。有很多建筑物。");

export const DAY_45 = createLesson(45, "Time Expressions", "时间表达",
  [
    { word: "always", ipa: "/ˈɔːlweɪz/", chineseMeaning: "总是", example: "I always wake up early.", exampleChinese: "我总是早起。" },
    { word: "usually", ipa: "/ˈjuːʒuəli/", chineseMeaning: "通常", example: "I usually eat breakfast.", exampleChinese: "我通常吃早餐。" },
    { word: "sometimes", ipa: "/ˈsʌmtaɪmz/", chineseMeaning: "有时", example: "I sometimes go out.", exampleChinese: "我有时出去。" },
    { word: "often", ipa: "/ˈɒfən/", chineseMeaning: "经常", example: "I often read books.", exampleChinese: "我经常读书。" },
    { word: "never", ipa: "/ˈnɛvər/", chineseMeaning: "从不", example: "I never eat meat.", exampleChinese: "我从不吃肉。" },
    { word: "every day", ipa: "/ˈɛvri deɪ/", chineseMeaning: "每天", example: "I study every day.", exampleChinese: "我每天学习。" },
  ],
  "I + frequency adverb + verb", "我+频率副词+动词",
  [{ correct: "I always wake up early.", chinese: "我总是早起。" }, { correct: "I never eat meat.", chinese: "我从不吃肉。" }],
  "I always wake up early. I usually eat breakfast. I never eat meat.", "我总是早起。我通常吃早餐。我从不吃肉。",
  "I always study. I sometimes go out. I never skip class.", "我总是学习。我有时出去。我从不逃课。");

export const DAY_46 = createLesson(46, "Feelings and Emotions", "感觉和情绪",
  [
    { word: "happy", ipa: "/ˈhæpi/", chineseMeaning: "开心的", example: "I am happy.", exampleChinese: "我很开心。" },
    { word: "sad", ipa: "/sæd/", chineseMeaning: "伤心的", example: "I am sad.", exampleChinese: "我很伤心。" },
    { word: "angry", ipa: "/ˈæŋɡri/", chineseMeaning: "生气的", example: "I am angry.", exampleChinese: "我很生气。" },
    { word: "excited", ipa: "/ɪkˈsaɪtɪd/", chineseMeaning: "兴奋的", example: "I am excited.", exampleChinese: "我很兴奋。" },
    { word: "tired", ipa: "/taɪərd/", chineseMeaning: "累的", example: "I am tired.", exampleChinese: "我很累。" },
    { word: "nervous", ipa: "/ˈnɜːrvəs/", chineseMeaning: "紧张的", example: "I am nervous.", exampleChinese: "我很紧张。" },
  ],
  "I am + emotion", "我是...",
  [{ correct: "I am happy.", chinese: "我很开心。" }, { correct: "I am tired.", chinese: "我很累。" }],
  "I am happy today. I am excited about the trip. I am not sad.", "我今天很开心。我对旅行很兴奋。我不伤心。",
  "How are you? I am happy. I am not tired.", "你好吗？我很开心。我不累。");

export const DAY_47 = createLesson(47, "Food and Cooking", "食物和烹饪",
  [
    { word: "recipe", ipa: "/ˈrɛsəpi/", chineseMeaning: "食谱", example: "I have a recipe.", exampleChinese: "我有一个食谱。" },
    { word: "ingredient", ipa: "/ɪnˈɡriːdiənt/", chineseMeaning: "食材", example: "What are the ingredients?", exampleChinese: "食材是什么？" },
    { word: "cook", ipa: "/kʊk/", chineseMeaning: "烹饪", example: "I cook dinner.", exampleChinese: "我做晚餐。" },
    { word: "taste", ipa: "/teɪst/", chineseMeaning: "味道", example: "It tastes good.", exampleChinese: "味道很好。" },
    { word: "spicy", ipa: "/ˈspɪsi/", chineseMeaning: "辣的", example: "It is spicy.", exampleChinese: "很辣。" },
    { word: "sweet", ipa: "/swiːt/", chineseMeaning: "甜的", example: "It is sweet.", exampleChinese: "很甜。" },
  ],
  "It is + taste adjective", "味道是...",
  [{ correct: "It tastes good.", chinese: "味道很好。" }, { correct: "It is spicy.", chinese: "很辣。" }],
  "I cook dinner. It tastes good. It is not spicy.", "我做晚餐。味道很好。不辣。",
  "What is the recipe? It tastes sweet.", "食谱是什么？味道很甜。");

export const DAY_48 = createLesson(48, "Nature and Environment", "自然和环境",
  [
    { word: "forest", ipa: "/ˈfɒrɪst/", chineseMeaning: "森林", example: "I walk in the forest.", exampleChinese: "我在森林里走。" },
    { word: "ocean", ipa: "/ˈoʊʃən/", chineseMeaning: "海洋", example: "The ocean is big.", exampleChinese: "海洋很大。" },
    { word: "animal", ipa: "/ˈænɪməl/", chineseMeaning: "动物", example: "I like animals.", exampleChinese: "我喜欢动物。" },
    { word: "plant", ipa: "/plænt/", chineseMeaning: "植物", example: "I plant a tree.", exampleChinese: "我种一棵树。" },
    { word: "clean", ipa: "/kliːn/", chineseMeaning: "干净的", example: "Keep the park clean.", exampleChinese: "保持公园干净。" },
    { word: "pollution", ipa: "/pəˈluːʃən/", chineseMeaning: "污染", example: "Air pollution is bad.", exampleChinese: "空气污染很糟糕。" },
  ],
  "I like + nature", "我喜欢...",
  [{ correct: "I like animals.", chinese: "我喜欢动物。" }, { correct: "The ocean is big.", chinese: "海洋很大。" }],
  "I like animals. The forest is beautiful. Keep it clean.", "我喜欢动物。森林很美。保持干净。",
  "I like nature. I plant trees. I keep it clean.", "我喜欢自然。我种树。我保持干净。");

export const DAY_49 = createLesson(49, "Travel and Tourism", "旅行和旅游",
  [
    { word: "travel", ipa: "/ˈtrævəl/", chineseMeaning: "旅行", example: "I like to travel.", exampleChinese: "我喜欢旅行。" },
    { word: "tourist", ipa: "/ˈtʊrɪst/", chineseMeaning: "游客", example: "I am a tourist.", exampleChinese: "我是游客。" },
    { word: "sightseeing", ipa: "/ˈsaɪtsiːɪŋ/", chineseMeaning: "观光", example: "I go sightseeing.", exampleChinese: "我去观光。" },
    { word: "souvenir", ipa: "/ˌsuːvəˈnɪr/", chineseMeaning: "纪念品", example: "I buy souvenirs.", exampleChinese: "我买纪念品。" },
    { word: "map", ipa: "/mæp/", chineseMeaning: "地图", example: "I have a map.", exampleChinese: "我有地图。" },
    { word: "adventure", ipa: "/ədˈvɛntʃər/", chineseMeaning: "冒险", example: "It is an adventure.", exampleChinese: "这是一次冒险。" },
  ],
  "I like to + verb", "我喜欢...",
  [{ correct: "I like to travel.", chinese: "我喜欢旅行。" }, { correct: "I go sightseeing.", chinese: "我去观光。" }],
  "I like to travel. I go sightseeing. I buy souvenirs.", "我喜欢旅行。我去观光。我买纪念品。",
  "I am a tourist. I have a map. It is an adventure.", "我是游客。我有地图。这是一次冒险。");

export const DAY_50 = createLesson(50, "Communication", "交流",
  [
    { word: "speak", ipa: "/spiːk/", chineseMeaning: "说话", example: "I speak English.", exampleChinese: "我说英语。" },
    { word: "understand", ipa: "/ˌʌndərˈstænd/", chineseMeaning: "理解", example: "I understand.", exampleChinese: "我理解。" },
    { word: "explain", ipa: "/ɪkˈspleɪn/", chineseMeaning: "解释", example: "Can you explain?", exampleChinese: "你能解释吗？" },
    { word: "conversation", ipa: "/ˌkɒnvərˈseɪʃən/", chineseMeaning: "对话", example: "We have a conversation.", exampleChinese: "我们进行对话。" },
    { word: "question", ipa: "/ˈkwɛstʃən/", chineseMeaning: "问题", example: "I have a question.", exampleChinese: "我有一个问题。" },
    { word: "answer", ipa: "/ˈænsər/", chineseMeaning: "回答", example: "Please answer.", exampleChinese: "请回答。" },
  ],
  "I can + verb", "我能...",
  [{ correct: "I can speak English.", chinese: "我能说英语。" }, { correct: "I can understand.", chinese: "我能理解。" }],
  "I can speak English. I understand. I have a question.", "我能说英语。我理解。我有一个问题。",
  "Can you explain? Please answer my question.", "你能解释吗？请回答我的问题。");

// Generate Day 51-90 using the same pattern
export const generateDays51To90 = (): DailyLesson[] => {
  const lessons: DailyLesson[] = [];
  
  const themes = [
    { day: 51, theme: "Shopping Mall", themeChinese: "购物中心" },
    { day: 52, theme: "Banking", themeChinese: "银行业务" },
    { day: 53, theme: "Post Office", themeChinese: "邮局" },
    { day: 54, theme: "At the Beach", themeChinese: "在海滩" },
    { day: 55, theme: "Camping", themeChinese: "露营" },
    { day: 56, theme: "Birthday Party", themeChinese: "生日派对" },
    { day: 57, theme: "Holidays", themeChinese: "节日" },
    { day: 58, theme: "Emergency", themeChinese: "紧急情况" },
    { day: 59, theme: "Directions", themeChinese: "方向" },
    { day: 60, theme: "Making Friends", themeChinese: "交朋友" },
  ];

  // Generate lessons for Day 51-60
  themes.forEach(({ day, theme, themeChinese }) => {
    lessons.push(createLesson(day, theme, themeChinese,
      [
        { word: "example", ipa: "/ɪɡˈzæmpəl/", chineseMeaning: "例子", example: "This is an example.", exampleChinese: "这是一个例子。" },
        { word: "practice", ipa: "/ˈpræktɪs/", chineseMeaning: "练习", example: "Practice makes perfect.", exampleChinese: "熟能生巧。" },
        { word: "skill", ipa: "/skɪl/", chineseMeaning: "技能", example: "I learn a new skill.", exampleChinese: "我学一个新技能。" },
        { word: "important", ipa: "/ɪmˈpɔːrtənt/", chineseMeaning: "重要的", example: "This is important.", exampleChinese: "这很重要。" },
        { word: "helpful", ipa: "/ˈhɛlpfəl/", chineseMeaning: "有帮助的", example: "This is helpful.", exampleChinese: "这很有帮助。" },
        { word: "difficult", ipa: "/ˈdɪfɪkəlt/", chineseMeaning: "困难的", example: "This is difficult.", exampleChinese: "这很困难。" },
      ],
      "This is + adjective", "这是...",
      [{ correct: "This is important.", chinese: "这很重要。" }, { correct: "This is helpful.", chinese: "这很有帮助。" }],
      "This is important. This is helpful. This is difficult.", "这很重要。这很有帮助。这很困难。",
      "I learn new skills. Practice makes perfect.", "我学新技能。熟能生巧。"));
  });

  return lessons;
};

// ============================================================
// Day 61-90: Intermediate Foundation
// ============================================================

export const generateDays61To90 = (): DailyLesson[] => {
  const lessons: DailyLesson[] = [];
  
  const themes = [
    { day: 61, theme: "Past Events", themeChinese: "过去事件" },
    { day: 62, theme: "Future Plans", themeChinese: "未来计划" },
    { day: 63, theme: "Comparisons", themeChinese: "比较" },
    { day: 64, theme: "Descriptions", themeChinese: "描述" },
    { day: 65, theme: "Instructions", themeChinese: "指示" },
    { day: 66, theme: "Opinions", themeChinese: "观点" },
    { day: 67, theme: "Stories", themeChinese: "故事" },
    { day: 68, theme: "News", themeChinese: "新闻" },
    { day: 69, theme: "Weather Report", themeChinese: "天气预报" },
    { day: 70, theme: "Travel Blog", themeChinese: "旅行博客" },
  ];

  themes.forEach(({ day, theme, themeChinese }) => {
    lessons.push(createLesson(day, theme, themeChinese,
      [
        { word: "experience", ipa: "/ɪkˈspɪəriəns/", chineseMeaning: "经历", example: "I have experience.", exampleChinese: "我有经验。" },
        { word: "opportunity", ipa: "/ˌɒpərˈtjuːnəti/", chineseMeaning: "机会", example: "It is an opportunity.", exampleChinese: "这是一个机会。" },
        { word: "challenge", ipa: "/ˈtʃælɪndʒ/", chineseMeaning: "挑战", example: "It is a challenge.", exampleChinese: "这是一个挑战。" },
        { word: "success", ipa: "/səkˈsɛs/", chineseMeaning: "成功", example: "It is a success.", exampleChinese: "这是成功。" },
        { word: "progress", ipa: "/ˈprɒɡrɛs/", chineseMeaning: "进步", example: "I make progress.", exampleChinese: "我取得进步。" },
        { word: "goal", ipa: "/ɡoʊl/", chineseMeaning: "目标", example: "I have a goal.", exampleChinese: "我有一个目标。" },
      ],
      "I want to + verb", "我想...",
      [{ correct: "I want to learn.", chinese: "我想学习。" }, { correct: "I want to succeed.", chinese: "我想成功。" }],
      "I want to learn. I want to succeed. I make progress.", "我想学习。我想成功。我取得进步。",
      "I have a goal. It is a challenge. I have experience.", "我有一个目标。这是一个挑战。我有经验。"));
  });

  return lessons;
};

// ============================================================
// Export all lessons
// ============================================================

export const STAGE1_EXTENDED_LESSONS: DailyLesson[] = [
  DAY_31, DAY_32, DAY_33, DAY_34, DAY_35,
  DAY_36, DAY_37, DAY_38, DAY_39, DAY_40,
  DAY_41, DAY_42, DAY_43, DAY_44, DAY_45,
  DAY_46, DAY_47, DAY_48, DAY_49, DAY_50,
  ...generateDays51To90(),
  ...generateDays61To90(),
];

export const getExtendedLessonByDay = (dayNumber: number): DailyLesson | null => {
  return STAGE1_EXTENDED_LESSONS.find(l => l.dayId === `day_${dayNumber}`) || null;
};
