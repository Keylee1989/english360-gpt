/**
 * Stage 1 Curriculum Data - Day 3-30
 * 
 * Complete 30-day foundation stage with:
 * - Phonics progression
 * - Vocabulary building (500+ words)
 * - Grammar fundamentals
 * - Listening comprehension
 * - Speaking practice
 * - Reading introduction
 * - Writing basics
 * 
 * Each day: 240 minutes, activity-based structure
 */

import type { DailyLesson, LessonActivity } from "@/types/database";

// ============================================================
// Helper Function
// ============================================================

function act(
  id: string,
  type: LessonActivity["type"],
  title: string,
  titleChinese: string,
  duration: number,
  objective: string,
  objectiveChinese: string,
  content: LessonActivity["content"],
): LessonActivity {
  return {
    id,
    type,
    title,
    titleChinese,
    description: objective,
    descriptionChinese: objectiveChinese,
    duration,
    objective: { english: objective, chinese: objectiveChinese },
    content,
    userAction: { type: "listen", instruction: "Follow the activity", instructionChinese: "跟随活动" },
    evaluation: { type: "self_check" },
    completed: false,
  };
}

function vocabAct(
  id: string,
  title: string,
  titleChinese: string,
  duration: number,
  words: { word: string; ipa: string; chineseMeaning: string; example: string; exampleChinese: string; memoryHint?: string }[],
): LessonActivity {
  return act(id, "vocabulary_introduction", title, titleChinese, duration,
    `Learn ${words.length} new words`, `学习${words.length}个新单词`,
    { words });
}

function grammarAct(
  id: string,
  title: string,
  titleChinese: string,
  duration: number,
  rule: string,
  ruleChinese: string,
  examples: { correct: string; chinese: string; incorrect?: string }[],
): LessonActivity {
  return act(id, "grammar_explanation", title, titleChinese, duration,
    `Learn ${title}`, `学习${titleChinese}`,
    { grammarPoint: { rule, ruleChinese, examples } });
}

function phonicsAct(
  id: string,
  title: string,
  titleChinese: string,
  duration: number,
  phonics: { letter: string; sound: string; soundDescription: string; examples: { word: string; chinese: string }[] }[],
): LessonActivity {
  return act(id, "phonics", title, titleChinese, duration,
    `Learn letter sounds`, `学习字母发音`,
    { phonics });
}

function listeningAct(
  id: string,
  title: string,
  titleChinese: string,
  duration: number,
  text: string,
  chineseText: string,
): LessonActivity {
  return act(id, "listening_comprehension", title, titleChinese, duration,
    `Listen and understand`, `听力理解练习`,
    { audio: { text, chineseText, speed: "slow" } });
}

function speakingAct(
  id: string,
  title: string,
  titleChinese: string,
  duration: number,
  text: string,
  chineseText: string,
): LessonActivity {
  return act(id, "speaking_repetition", title, titleChinese, duration,
    `Practice speaking`, `口语练习`,
    { audio: { text, chineseText, speed: "slow" } });
}

function reviewAct(
  id: string,
  title: string,
  titleChinese: string,
  duration: number,
  items: { word: string; chineseMeaning: string }[],
): LessonActivity {
  return act(id, "review", title, titleChinese, duration,
    `Review today's content`, `复习今天的内容`,
    { reviewItems: items });
}

function readingAct(
  id: string,
  title: string,
  titleChinese: string,
  duration: number,
  text: string,
  chineseTranslation: string,
): LessonActivity {
  return act(id, "reading_comprehension", title, titleChinese, duration,
    `Read and understand`, `阅读理解`,
    { readingPassage: { text, chineseTranslation, level: "controlled" } });
}

function writingAct(
  id: string,
  title: string,
  titleChinese: string,
  duration: number,
  prompt: string,
  chinesePrompt: string,
  example: string,
  wordBank: string[],
): LessonActivity {
  return act(id, "writing_practice", title, titleChinese, duration,
    `Practice writing`, `写作练习`,
    { writingPrompt: { prompt, chinesePrompt, wordBank, example } });
}

// ============================================================
// Week 1: Day 3-7
// ============================================================

export const DAY_3: DailyLesson = {
  id: "lesson_day_3", dayId: "day_3",
  activities: [
    phonicsAct("a1", "Letter Sounds F-J", "字母发音 F-J", 25,
      [
        { letter: "F", sound: "/ɛf/", soundDescription: "F sound", examples: [{ word: "fish", chinese: "鱼" }, { word: "food", chinese: "食物" }] },
        { letter: "G", sound: "/dʒiː/", soundDescription: "G sound", examples: [{ word: "go", chinese: "去" }, { word: "good", chinese: "好" }] },
        { letter: "H", sound: "/eɪtʃ/", soundDescription: "H sound", examples: [{ word: "hat", chinese: "帽子" }, { word: "hand", chinese: "手" }] },
        { letter: "I", sound: "/aɪ/", soundDescription: "Long I", examples: [{ word: "ice", chinese: "冰" }, { word: "island", chinese: "岛" }] },
        { letter: "J", sound: "/dʒeɪ/", soundDescription: "J sound", examples: [{ word: "jump", chinese: "跳" }, { word: "juice", chinese: "果汁" }] },
      ]),
    vocabAct("a2", "Food Words", "食物词汇", 35,
      [
        { word: "water", ipa: "/ˈwɔːtər/", chineseMeaning: "水", example: "I want water.", exampleChinese: "我想要水。", memoryHint: "沃特" },
        { word: "food", ipa: "/fuːd/", chineseMeaning: "食物", example: "The food is good.", exampleChinese: "食物很好。", memoryHint: "富的" },
        { word: "bread", ipa: "/brɛd/", chineseMeaning: "面包", example: "I eat bread.", exampleChinese: "我吃面包。", memoryHint: "不来的" },
        { word: "rice", ipa: "/raɪs/", chineseMeaning: "米饭", example: "I like rice.", exampleChinese: "我喜欢米饭。", memoryHint: "入爱斯" },
        { word: "egg", ipa: "/ɛɡ/", chineseMeaning: "鸡蛋", example: "I want an egg.", exampleChinese: "我想要一个鸡蛋。", memoryHint: "爱格" },
        { word: "milk", ipa: "/mɪlk/", chineseMeaning: "牛奶", example: "I drink milk.", exampleChinese: "我喝牛奶。", memoryHint: "米欧克" },
        { word: "tea", ipa: "/tiː/", chineseMeaning: "茶", example: "I like tea.", exampleChinese: "我喜欢茶。", memoryHint: "提" },
        { word: "coffee", ipa: "/ˈkɒfi/", chineseMeaning: "咖啡", example: "I drink coffee.", exampleChinese: "我喝咖啡。", memoryHint: "靠飞" },
      ]),
    vocabAct("a3", "Drink Words", "饮料词汇", 25,
      [
        { word: "juice", ipa: "/dʒuːs/", chineseMeaning: "果汁", example: "I want juice.", exampleChinese: "我想要果汁。", memoryHint: "橘斯" },
        { word: "apple", ipa: "/ˈæpəl/", chineseMeaning: "苹果", example: "I eat an apple.", exampleChinese: "我吃一个苹果。", memoryHint: "爱剖" },
        { word: "banana", ipa: "/bəˈnænə/", chineseMeaning: "香蕉", example: "I like bananas.", exampleChinese: "我喜欢香蕉。", memoryHint: "巴拿拿" },
        { word: "orange", ipa: "/ˈɒrɪndʒ/", chineseMeaning: "橙子", example: "The orange is sweet.", exampleChinese: "橙子很甜。", memoryHint: "奥润吉" },
      ]),
    grammarAct("a4", "I like / I want", "I like / I want 句型", 25,
      "I like + noun (我喜欢...), I want + noun (我想要...)",
      "I like + 名词（我喜欢...），I want + 名词（我想要...）",
      [
        { correct: "I like water.", chinese: "我喜欢水。" },
        { correct: "I want bread.", chinese: "我想要面包。" },
        { correct: "I like tea.", chinese: "我喜欢茶。" },
        { correct: "I liking water.", incorrect: "I like water.", chinese: "我喜欢水。" },
      ]),
    listeningAct("a5", "Food Listening", "食物听力", 20, "I like bread. I want water. I drink milk.", "我喜欢面包。我想要水。我喝牛奶。"),
    speakingAct("a6", "Food Speaking", "食物口语", 25, "I like rice. I want eggs. I drink coffee.", "我喜欢米饭。我想要鸡蛋。我喝咖啡。"),
    readingAct("a7", "Food Reading", "食物阅读", 20, "I am Tom. I like bread and rice. I want water.", "我是Tom。我喜欢面包和米饭。我想要水。"),
    writingAct("a8", "Food Writing", "食物写作", 20, "Write: I like ___. I want ___.", "写：我喜欢___。我想要___。", "I like apples. I want milk.", ["apples", "milk", "bread", "water"]),
    reviewAct("a9", "Day 3 Review", "第三天复习", 25, [
      { word: "water", chineseMeaning: "水" }, { word: "food", chineseMeaning: "食物" }, { word: "bread", chineseMeaning: "面包" },
      { word: "rice", chineseMeaning: "米饭" }, { word: "like", chineseMeaning: "喜欢" }, { word: "want", chineseMeaning: "想要" },
    ]),
  ],
  vocabulary: { words: ["water", "food", "bread", "rice", "egg", "milk", "tea", "coffee", "juice", "apple", "banana", "orange"], exercises: [] },
  grammar: { pointId: "like_want", explanation: { english: "I like, I want", chinese: "我喜欢，我想要" }, examples: [{ correct: "I like water.", chinese: "我喜欢水。" }], exercises: [] },
  listening: { audioUrl: "", transcript: "I like bread. I want water.", chineseTranscript: "我喜欢面包。我想要水。", speed: "slow", questions: [] },
  speaking: { scenario: "Talking about food", chineseScenario: "谈论食物", dialogue: [{ speaker: "model", english: "I like rice.", chinese: "我喜欢米饭。" }], practicePrompts: ["Say what you like"] },
  reading: { text: "I like bread and rice.", chineseTranslation: "我喜欢面包和米饭。", level: "controlled", questions: [] },
  writing: { type: "controlled", prompt: "I like ___.", chinesePrompt: "我喜欢___。", example: "I like apples.", wordBank: ["apples", "milk", "bread"] },
  review: { srsReview: true, wordReview: ["water", "food", "bread", "rice"], grammarReview: ["like_want"] },
  totalDuration: 240, createdAt: Date.now(), updatedAt: Date.now(),
};

export const DAY_4: DailyLesson = {
  id: "lesson_day_4", dayId: "day_4",
  activities: [
    phonicsAct("a1", "Letter Sounds K-O", "字母发音 K-O", 25,
      [
        { letter: "K", sound: "/keɪ/", soundDescription: "K sound", examples: [{ word: "key", chinese: "钥匙" }, { word: "kid", chinese: "孩子" }] },
        { letter: "L", sound: "/ɛl/", soundDescription: "L sound", examples: [{ word: "leg", chinese: "腿" }, { word: "light", chinese: "灯" }] },
        { letter: "M", sound: "/ɛm/", soundDescription: "M sound", examples: [{ word: "man", chinese: "男人" }, { word: "milk", chinese: "牛奶" }] },
        { letter: "N", sound: "/ɛn/", soundDescription: "N sound", examples: [{ word: "nose", chinese: "鼻子" }, { word: "no", chinese: "不" }] },
        { letter: "O", sound: "/oʊ/", soundDescription: "Long O", examples: [{ word: "orange", chinese: "橙子" }, { word: "open", chinese: "打开" }] },
      ]),
    vocabAct("a2", "Body Parts", "身体部位", 40,
      [
        { word: "head", ipa: "/hɛd/", chineseMeaning: "头", example: "Touch your head.", exampleChinese: "摸摸你的头。", memoryHint: "黑的" },
        { word: "eye", ipa: "/aɪ/", chineseMeaning: "眼睛", example: "I have two eyes.", exampleChinese: "我有两只眼睛。", memoryHint: "爱" },
        { word: "ear", ipa: "/ɪr/", chineseMeaning: "耳朵", example: "I hear with my ears.", exampleChinese: "我用耳朵听。", memoryHint: "伊尔" },
        { word: "nose", ipa: "/noʊz/", chineseMeaning: "鼻子", example: "I smell with my nose.", exampleChinese: "我用鼻子闻。", memoryHint: "诺兹" },
        { word: "mouth", ipa: "/maʊθ/", chineseMeaning: "嘴巴", example: "Open your mouth.", exampleChinese: "张开你的嘴巴。", memoryHint: "毛斯" },
        { word: "hand", ipa: "/hænd/", chineseMeaning: "手", example: "Raise your hand.", exampleChinese: "举手。", memoryHint: "汉的" },
        { word: "arm", ipa: "/ɑːrm/", chineseMeaning: "手臂", example: "I have two arms.", exampleChinese: "我有两只手臂。", memoryHint: "阿姆" },
        { word: "leg", ipa: "/lɛɡ/", chineseMeaning: "腿", example: "My leg hurts.", exampleChinese: "我的腿疼。", memoryHint: "莱格" },
        { word: "foot", ipa: "/fʊt/", chineseMeaning: "脚", example: "I have two feet.", exampleChinese: "我有两只脚。", memoryHint: "富特" },
        { word: "face", ipa: "/feɪs/", chineseMeaning: "脸", example: "Wash your face.", exampleChinese: "洗脸。", memoryHint: "费斯" },
      ]),
    grammarAct("a3", "I have", "I have 句型", 25,
      "I have + noun (我有...)",
      "I have + 名词（我有...）",
      [
        { correct: "I have two eyes.", chinese: "我有两只眼睛。" },
        { correct: "I have a nose.", chinese: "我有一个鼻子。" },
        { correct: "I have one mouth.", chinese: "我有一张嘴巴。" },
      ]),
    listeningAct("a4", "Body Listening", "身体听力", 20, "I have two eyes. I have one nose. I have two hands.", "我有两只眼睛。我有一个鼻子。我有两只手。"),
    speakingAct("a5", "Body Speaking", "身体口语", 25, "Touch your head. Open your mouth. Raise your hand.", "摸摸你的头。张开你的嘴巴。举手。"),
    readingAct("a6", "Body Reading", "身体阅读", 20, "I am Lisa. I have two eyes and one nose. I have two hands.", "我是Lisa。我有两只眼睛和一个鼻子。我有两只手。"),
    writingAct("a7", "Body Writing", "身体写作", 20, "Write: I have ___.", "写：我有___。", "I have two eyes.", ["two eyes", "one nose", "two hands", "one mouth"]),
    reviewAct("a8", "Day 4 Review", "第四天复习", 45, [
      { word: "head", chineseMeaning: "头" }, { word: "eye", chineseMeaning: "眼睛" }, { word: "ear", chineseMeaning: "耳朵" },
      { word: "nose", chineseMeaning: "鼻子" }, { word: "mouth", chineseMeaning: "嘴巴" }, { word: "hand", chineseMeaning: "手" },
    ]),
  ],
  vocabulary: { words: ["head", "eye", "ear", "nose", "mouth", "hand", "arm", "leg", "foot", "face"], exercises: [] },
  grammar: { pointId: "have", explanation: { english: "I have", chinese: "我有" }, examples: [{ correct: "I have two eyes.", chinese: "我有两只眼睛。" }], exercises: [] },
  listening: { audioUrl: "", transcript: "I have two eyes.", chineseTranscript: "我有两只眼睛。", speed: "slow", questions: [] },
  speaking: { scenario: "Body parts", chineseScenario: "身体部位", dialogue: [{ speaker: "model", english: "I have two eyes.", chinese: "我有两只眼睛。" }], practicePrompts: ["Describe your body"] },
  reading: { text: "I have two eyes and one nose.", chineseTranslation: "我有两只眼睛和一个鼻子。", level: "controlled", questions: [] },
  writing: { type: "controlled", prompt: "I have ___.", chinesePrompt: "我有___。", example: "I have two eyes.", wordBank: ["two eyes", "one nose", "two hands"] },
  review: { srsReview: true, wordReview: ["head", "eye", "ear", "nose"], grammarReview: ["have"] },
  totalDuration: 240, createdAt: Date.now(), updatedAt: Date.now(),
};

export const DAY_5: DailyLesson = {
  id: "lesson_day_5", dayId: "day_5",
  activities: [
    phonicsAct("a1", "Letter Sounds P-T", "字母发音 P-T", 25,
      [
        { letter: "P", sound: "/piː/", soundDescription: "P sound", examples: [{ word: "pen", chinese: "笔" }, { word: "park", chinese: "公园" }] },
        { letter: "Q", sound: "/kjuː/", soundDescription: "Q sound", examples: [{ word: "queen", chinese: "女王" }, { word: "quiet", chinese: "安静" }] },
        { letter: "R", sound: "/ɑːr/", soundDescription: "R sound", examples: [{ word: "rain", chinese: "雨" }, { word: "red", chinese: "红色" }] },
        { letter: "S", sound: "/ɛs/", soundDescription: "S sound", examples: [{ word: "sun", chinese: "太阳" }, { word: "six", chinese: "六" }] },
        { letter: "T", sound: "/tiː/", soundDescription: "T sound", examples: [{ word: "two", chinese: "二" }, { word: "tea", chinese: "茶" }] },
      ]),
    vocabAct("a2", "Clothing", "服装", 35,
      [
        { word: "clothes", ipa: "/kloʊðz/", chineseMeaning: "衣服", example: "I like these clothes.", exampleChinese: "我喜欢这些衣服。", memoryHint: "克楼兹" },
        { word: "shirt", ipa: "/ʃɜːrt/", chineseMeaning: "衬衫", example: "This shirt is nice.", exampleChinese: "这件衬衫很好看。", memoryHint: "舍特" },
        { word: "pants", ipa: "/pænts/", chineseMeaning: "裤子", example: "I wear blue pants.", exampleChinese: "我穿蓝色裤子。", memoryHint: "盼茨" },
        { word: "shoes", ipa: "/ʃuːz/", chineseMeaning: "鞋子", example: "These shoes are comfortable.", exampleChinese: "这双鞋很舒服。", memoryHint: "输子" },
        { word: "hat", ipa: "/hæt/", chineseMeaning: "帽子", example: "I wear a hat.", exampleChinese: "我戴帽子。", memoryHint: "害特" },
        { word: "dress", ipa: "/drɛs/", chineseMeaning: "连衣裙", example: "She wears a red dress.", exampleChinese: "她穿红色连衣裙。", memoryHint: "拽斯" },
      ]),
    vocabAct("a3", "Colors Extended", "扩展颜色", 25,
      [
        { word: "brown", ipa: "/braʊn/", chineseMeaning: "棕色", example: "The dog is brown.", exampleChinese: "狗是棕色的。", memoryHint: "不饶恩" },
        { word: "pink", ipa: "/pɪŋk/", chineseMeaning: "粉色", example: "I like pink.", exampleChinese: "我喜欢粉色。", memoryHint: "拼克" },
        { word: "purple", ipa: "/ˈpɜːrpəl/", chineseMeaning: "紫色", example: "The flower is purple.", exampleChinese: "花是紫色的。", memoryHint: "泼剖" },
      ]),
    grammarAct("a4", "I wear", "I wear 句型", 25,
      "I wear + clothing (我穿...)",
      "I wear + 服装（我穿...）",
      [
        { correct: "I wear a shirt.", chinese: "我穿衬衫。" },
        { correct: "I wear blue pants.", chinese: "我穿蓝色裤子。" },
        { correct: "She wears a red dress.", chinese: "她穿红色连衣裙。" },
      ]),
    listeningAct("a5", "Clothing Listening", "服装听力", 20, "I wear a shirt. I wear pants. I wear shoes.", "我穿衬衫。我穿裤子。我穿鞋子。"),
    speakingAct("a6", "Clothing Speaking", "服装口语", 25, "I wear a hat. She wears a dress. He wears shoes.", "我戴帽子。她穿裙子。他穿鞋子。"),
    readingAct("a7", "Clothing Reading", "服装阅读", 20, "Tom wears a blue shirt. Lisa wears a red dress.", "Tom穿蓝色衬衫。Lisa穿红色裙子。"),
    writingAct("a8", "Clothing Writing", "服装写作", 20, "Write: I wear ___.", "写：我穿___。", "I wear a shirt.", ["a shirt", "blue pants", "a hat", "shoes"]),
    reviewAct("a9", "Day 5 Review", "第五天复习", 45, [
      { word: "shirt", chineseMeaning: "衬衫" }, { word: "pants", chineseMeaning: "裤子" }, { word: "shoes", chineseMeaning: "鞋子" },
      { word: "hat", chineseMeaning: "帽子" }, { word: "brown", chineseMeaning: "棕色" }, { word: "pink", chineseMeaning: "粉色" },
    ]),
  ],
  vocabulary: { words: ["shirt", "pants", "shoes", "hat", "dress", "brown", "pink", "purple"], exercises: [] },
  grammar: { pointId: "wear", explanation: { english: "I wear", chinese: "我穿" }, examples: [{ correct: "I wear a shirt.", chinese: "我穿衬衫。" }], exercises: [] },
  listening: { audioUrl: "", transcript: "I wear a shirt.", chineseTranscript: "我穿衬衫。", speed: "slow", questions: [] },
  speaking: { scenario: "Clothing", chineseScenario: "服装", dialogue: [{ speaker: "model", english: "I wear a shirt.", chinese: "我穿衬衫。" }], practicePrompts: ["Describe what you wear"] },
  reading: { text: "Tom wears a blue shirt.", chineseTranslation: "Tom穿蓝色衬衫。", level: "controlled", questions: [] },
  writing: { type: "controlled", prompt: "I wear ___.", chinesePrompt: "我穿___。", example: "I wear a shirt.", wordBank: ["a shirt", "blue pants", "a hat"] },
  review: { srsReview: true, wordReview: ["shirt", "pants", "shoes", "hat"], grammarReview: ["wear"] },
  totalDuration: 240, createdAt: Date.now(), updatedAt: Date.now(),
};

export const DAY_6: DailyLesson = {
  id: "lesson_day_6", dayId: "day_6",
  activities: [
    phonicsAct("a1", "Letter Sounds U-Z", "字母发音 U-Z", 25,
      [
        { letter: "U", sound: "/juː/", soundDescription: "Long U", examples: [{ word: "use", chinese: "使用" }, { word: "under", chinese: "在下面" }] },
        { letter: "V", sound: "/viː/", soundDescription: "V sound", examples: [{ word: "very", chinese: "非常" }, { word: "van", chinese: "面包车" }] },
        { letter: "W", sound: "/ˈdʌbljuː/", soundDescription: "W sound", examples: [{ word: "water", chinese: "水" }, { word: "white", chinese: "白色" }] },
        { letter: "X", sound: "/ɛks/", soundDescription: "X sound", examples: [{ word: "six", chinese: "六" }, { word: "box", chinese: "盒子" }] },
        { letter: "Y", sound: "/waɪ/", soundDescription: "Y sound", examples: [{ word: "you", chinese: "你" }, { word: "yes", chinese: "是" }] },
        { letter: "Z", sound: "/ziː/", soundDescription: "Z sound", examples: [{ word: "zero", chinese: "零" }, { word: "zoo", chinese: "动物园" }] },
      ]),
    vocabAct("a2", "Family Members", "家庭成员", 35,
      [
        { word: "mother", ipa: "/ˈmʌðər/", chineseMeaning: "母亲", example: "My mother is a teacher.", exampleChinese: "我妈妈是老师。", memoryHint: "马泽" },
        { word: "father", ipa: "/ˈfɑːðər/", chineseMeaning: "父亲", example: "My father works hard.", exampleChinese: "我爸爸工作很努力。", memoryHint: "法泽" },
        { word: "brother", ipa: "/ˈbrʌðər/", chineseMeaning: "兄弟", example: "I have one brother.", exampleChinese: "我有一个兄弟。", memoryHint: "布拉的" },
        { word: "sister", ipa: "/ˈsɪstər/", chineseMeaning: "姐妹", example: "My sister is tall.", exampleChinese: "我姐姐很高。", memoryHint: "西斯特" },
        { word: "son", ipa: "/sʌn/", chineseMeaning: "儿子", example: "My son is five.", exampleChinese: "我儿子五岁了。", memoryHint: "桑" },
        { word: "daughter", ipa: "/ˈdɔːtər/", chineseMeaning: "女儿", example: "My daughter is a student.", exampleChinese: "我女儿是学生。", memoryHint: "稻特" },
        { word: "family", ipa: "/ˈfæməli/", chineseMeaning: "家庭", example: "I love my family.", exampleChinese: "我爱我的家人。", memoryHint: "发美丽" },
        { word: "friend", ipa: "/frɛnd/", chineseMeaning: "朋友", example: "She is my friend.", exampleChinese: "她是我的朋友。", memoryHint: "弗兰的" },
      ]),
    grammarAct("a3", "This is / That is", "This is / That is 句型", 25,
      "This is + person (这是...), That is + person (那是...)",
      "This is + 人（这是...），That is + 人（那是...）",
      [
        { correct: "This is my mother.", chinese: "这是我妈妈。" },
        { correct: "That is my father.", chinese: "那是我爸爸。" },
        { correct: "This is my friend.", chinese: "这是我的朋友。" },
      ]),
    listeningAct("a4", "Family Listening", "家庭听力", 20, "This is my mother. That is my father. I have one brother.", "这是我妈妈。那是我爸爸。我有一个兄弟。"),
    speakingAct("a5", "Family Speaking", "家庭口语", 25, "This is my family. I have a brother. She is my sister.", "这是我的家庭。我有一个兄弟。她是我的姐妹。"),
    readingAct("a6", "Family Reading", "家庭阅读", 20, "This is my family. I have a mother, a father, and one sister.", "这是我的家庭。我有妈妈、爸爸和一个姐妹。"),
    writingAct("a7", "Family Writing", "家庭写作", 20, "Write: This is my ___.", "写：这是我的___。", "This is my mother.", ["mother", "father", "brother", "sister"]),
    reviewAct("a8", "Day 6 Review", "第六天复习", 45, [
      { word: "mother", chineseMeaning: "母亲" }, { word: "father", chineseMeaning: "父亲" }, { word: "brother", chineseMeaning: "兄弟" },
      { word: "sister", chineseMeaning: "姐妹" }, { word: "family", chineseMeaning: "家庭" }, { word: "friend", chineseMeaning: "朋友" },
    ]),
  ],
  vocabulary: { words: ["mother", "father", "brother", "sister", "son", "daughter", "family", "friend"], exercises: [] },
  grammar: { pointId: "this_that_is", explanation: { english: "This is, That is", chinese: "这是，那是" }, examples: [{ correct: "This is my mother.", chinese: "这是我妈妈。" }], exercises: [] },
  listening: { audioUrl: "", transcript: "This is my mother.", chineseTranscript: "这是我妈妈。", speed: "slow", questions: [] },
  speaking: { scenario: "Family", chineseScenario: "家庭", dialogue: [{ speaker: "model", english: "This is my family.", chinese: "这是我的家庭。" }], practicePrompts: ["Introduce your family"] },
  reading: { text: "This is my family.", chineseTranslation: "这是我的家庭。", level: "controlled", questions: [] },
  writing: { type: "controlled", prompt: "This is my ___.", chinesePrompt: "这是我的___。", example: "This is my mother.", wordBank: ["mother", "father", "brother", "sister"] },
  review: { srsReview: true, wordReview: ["mother", "father", "brother", "sister"], grammarReview: ["this_that_is"] },
  totalDuration: 240, createdAt: Date.now(), updatedAt: Date.now(),
};

export const DAY_7: DailyLesson = {
  id: "lesson_day_7", dayId: "day_7",
  activities: [
    reviewAct("a1", "Week 1 Vocabulary Review", "第一周词汇复习", 40, [
      { word: "hello", chineseMeaning: "你好" }, { word: "goodbye", chineseMeaning: "再见" }, { word: "thank", chineseMeaning: "谢谢" },
      { word: "water", chineseMeaning: "水" }, { word: "food", chineseMeaning: "食物" }, { word: "bread", chineseMeaning: "面包" },
      { word: "head", chineseMeaning: "头" }, { word: "eye", chineseMeaning: "眼睛" }, { word: "hand", chineseMeaning: "手" },
      { word: "shirt", chineseMeaning: "衬衫" }, { word: "pants", chineseMeaning: "裤子" }, { word: "mother", chineseMeaning: "母亲" },
    ]),
    reviewAct("a2", "Week 1 Grammar Review", "第一周语法复习", 30, [
      { word: "am", chineseMeaning: "是（I）" }, { word: "is", chineseMeaning: "是（he/she/it）" }, { word: "are", chineseMeaning: "是（you/we/they）" },
      { word: "like", chineseMeaning: "喜欢" }, { word: "want", chineseMeaning: "想要" }, { word: "have", chineseMeaning: "有" },
    ]),
    vocabAct("a3", "Review: Numbers", "复习：数字", 25,
      [
        { word: "one", ipa: "/wʌn/", chineseMeaning: "一", example: "I have one cat.", exampleChinese: "我有一只猫。" },
        { word: "two", ipa: "/tuː/", chineseMeaning: "二", example: "Two books.", exampleChinese: "两本书。" },
        { word: "three", ipa: "/θriː/", chineseMeaning: "三", example: "Three people.", exampleChinese: "三个人。" },
        { word: "four", ipa: "/fɔːr/", chineseMeaning: "四", example: "Four apples.", exampleChinese: "四个苹果。" },
        { word: "five", ipa: "/faɪv/", chineseMeaning: "五", example: "Five stars.", exampleChinese: "五颗星。" },
      ]),
    vocabAct("a4", "Review: Colors", "复习：颜色", 25,
      [
        { word: "red", ipa: "/rɛd/", chineseMeaning: "红色", example: "The apple is red.", exampleChinese: "苹果是红色的。" },
        { word: "blue", ipa: "/bluː/", chineseMeaning: "蓝色", example: "The sky is blue.", exampleChinese: "天空是蓝色的。" },
        { word: "green", ipa: "/ɡriːn/", chineseMeaning: "绿色", example: "The grass is green.", exampleChinese: "草是绿色的。" },
      ]),
    grammarAct("a5", "Grammar Review", "语法复习", 30,
      "I am, You are, He/She/It is, I like, I want, I have, I wear, This is, That is",
      "我是，你是，他/她/它是，我喜欢，我想要，我有，我穿，这是，那是",
      [
        { correct: "I am a student.", chinese: "我是学生。" },
        { correct: "I like water.", chinese: "我喜欢水。" },
        { correct: "I have two eyes.", chinese: "我有两只眼睛。" },
        { correct: "This is my mother.", chinese: "这是我妈妈。" },
      ]),
    listeningAct("a6", "Week 1 Listening Review", "第一周听力复习", 25, "Hello, I am Tom. I like bread. I have two eyes. This is my family.", "你好，我是Tom。我喜欢面包。我有两只眼睛。这是我的家庭。"),
    speakingAct("a7", "Week 1 Speaking Review", "第一周口语复习", 30, "Hello, I am Tom. I like water. I have a brother. This is my mother.", "你好，我是Tom。我喜欢水。我有一个兄弟。这是我妈妈。"),
    reviewAct("a8", "Day 7 Final Review", "第七天最终复习", 35, [
      { word: "hello", chineseMeaning: "你好" }, { word: "water", chineseMeaning: "水" }, { word: "head", chineseMeaning: "头" },
      { word: "shirt", chineseMeaning: "衬衫" }, { word: "mother", chineseMeaning: "母亲" }, { word: "family", chineseMeaning: "家庭" },
    ]),
  ],
  vocabulary: { words: ["hello", "water", "head", "shirt", "mother", "family", "one", "two", "three", "red", "blue", "green"], exercises: [] },
  grammar: { pointId: "week1_review", explanation: { english: "Week 1 Grammar Review", chinese: "第一周语法复习" }, examples: [{ correct: "I am a student.", chinese: "我是学生。" }], exercises: [] },
  listening: { audioUrl: "", transcript: "Hello, I am Tom.", chineseTranscript: "你好，我是Tom。", speed: "slow", questions: [] },
  speaking: { scenario: "Week 1 Review", chineseScenario: "第一周复习", dialogue: [{ speaker: "model", english: "Hello, I am Tom.", chinese: "你好，我是Tom。" }], practicePrompts: ["Introduce yourself"] },
  reading: { text: "I am Tom. I like water. I have two eyes.", chineseTranslation: "我是Tom。我喜欢水。我有两只眼睛。", level: "controlled", questions: [] },
  writing: { type: "guided", prompt: "Write about yourself.", chinesePrompt: "写关于你自己。", example: "I am Tom. I like water.", wordBank: ["I am", "I like", "I have"] },
  review: { srsReview: true, wordReview: ["hello", "water", "head", "shirt", "mother"], grammarReview: ["week1_review"] },
  totalDuration: 240, createdAt: Date.now(), updatedAt: Date.now(),
};

// ============================================================
// Week 2: Day 8-14
// ============================================================

export const DAY_8: DailyLesson = {
  id: "lesson_day_8", dayId: "day_8",
  activities: [
    vocabAct("a1", "Places", "地点", 40,
      [
        { word: "home", ipa: "/hoʊm/", chineseMeaning: "家", example: "I am at home.", exampleChinese: "我在家。", memoryHint: "厚姆" },
        { word: "school", ipa: "/skuːl/", chineseMeaning: "学校", example: "I go to school.", exampleChinese: "我去上学。", memoryHint: "斯酷" },
        { word: "hospital", ipa: "/ˈhɒspɪtəl/", chineseMeaning: "医院", example: "He is at the hospital.", exampleChinese: "他在医院。", memoryHint: "好斯皮头" },
        { word: "store", ipa: "/stɔːr/", chineseMeaning: "商店", example: "I buy food at the store.", exampleChinese: "我在商店买食物。", memoryHint: "斯多" },
        { word: "park", ipa: "/pɑːrk/", chineseMeaning: "公园", example: "I walk in the park.", exampleChinese: "我在公园散步。", memoryHint: "帕克" },
        { word: "bank", ipa: "/bæŋk/", chineseMeaning: "银行", example: "I go to the bank.", exampleChinese: "我去银行。", memoryHint: "办客" },
      ]),
    vocabAct("a2", "House Parts", "房子部分", 35,
      [
        { word: "room", ipa: "/ruːm/", chineseMeaning: "房间", example: "My room is clean.", exampleChinese: "我的房间很干净。", memoryHint: "入姆" },
        { word: "door", ipa: "/dɔːr/", chineseMeaning: "门", example: "Close the door.", exampleChinese: "关门。", memoryHint: "多" },
        { word: "window", ipa: "/ˈwɪndoʊ/", chineseMeaning: "窗户", example: "Open the window.", exampleChinese: "打开窗户。", memoryHint: "温度" },
        { word: "bed", ipa: "/bɛd/", chineseMeaning: "床", example: "I sleep in my bed.", exampleChinese: "我在床上睡觉。", memoryHint: "败的" },
        { word: "table", ipa: "/ˈteɪbəl/", chineseMeaning: "桌子", example: "The food is on the table.", exampleChinese: "食物在桌子上。", memoryHint: "特宝" },
        { word: "chair", ipa: "/tʃɛr/", chineseMeaning: "椅子", example: "Sit on the chair.", exampleChinese: "坐在椅子上。", memoryHint: "切尔" },
        { word: "kitchen", ipa: "/ˈkɪtʃɪn/", chineseMeaning: "厨房", example: "I cook in the kitchen.", exampleChinese: "我在厨房做饭。", memoryHint: "去陈" },
        { word: "bathroom", ipa: "/ˈbæθruːm/", chineseMeaning: "浴室", example: "The bathroom is clean.", exampleChinese: "浴室很干净。", memoryHint: "bath+room" },
      ]),
    grammarAct("a3", "at / on / in", "at / on / in 介词", 25,
      "at + place (在某地), on + surface (在...上面), in + container (在...里面)",
      "at + 地点（在某地），on + 表面（在...上面），in + 容器（在...里面）",
      [
        { correct: "I am at home.", chinese: "我在家。" },
        { correct: "The book is on the table.", chinese: "书在桌子上。" },
        { correct: "I sleep in my bed.", chinese: "我在床上睡觉。" },
      ]),
    listeningAct("a4", "Places Listening", "地点听力", 20, "I am at home. The book is on the table. I sleep in my bed.", "我在家。书在桌子上。我在床上睡觉。"),
    speakingAct("a5", "Places Speaking", "地点口语", 25, "I am at school. The food is on the table. I cook in the kitchen.", "我在学校。食物在桌子上。我在厨房做饭。"),
    readingAct("a6", "Places Reading", "地点阅读", 20, "I am at home. My room is clean. The table is in the kitchen.", "我在家。我的房间很干净。桌子在厨房。"),
    writingAct("a7", "Places Writing", "地点写作", 20, "Write: I am at ___.", "写：我在___。", "I am at home.", ["home", "school", "park", "store"]),
    reviewAct("a8", "Day 8 Review", "第八天复习", 55, [
      { word: "home", chineseMeaning: "家" }, { word: "school", chineseMeaning: "学校" }, { word: "room", chineseMeaning: "房间" },
      { word: "door", chineseMeaning: "门" }, { word: "table", chineseMeaning: "桌子" }, { word: "kitchen", chineseMeaning: "厨房" },
    ]),
  ],
  vocabulary: { words: ["home", "school", "hospital", "store", "park", "room", "door", "window", "bed", "table", "chair", "kitchen"], exercises: [] },
  grammar: { pointId: "prepositions", explanation: { english: "at, on, in", chinese: "在...，在...上面，在...里面" }, examples: [{ correct: "I am at home.", chinese: "我在家。" }], exercises: [] },
  listening: { audioUrl: "", transcript: "I am at home.", chineseTranscript: "我在家。", speed: "slow", questions: [] },
  speaking: { scenario: "Places", chineseScenario: "地点", dialogue: [{ speaker: "model", english: "I am at home.", chinese: "我在家。" }], practicePrompts: ["Describe where you are"] },
  reading: { text: "I am at home. My room is clean.", chineseTranslation: "我在家。我的房间很干净。", level: "controlled", questions: [] },
  writing: { type: "controlled", prompt: "I am at ___.", chinesePrompt: "我在___。", example: "I am at home.", wordBank: ["home", "school", "park"] },
  review: { srsReview: true, wordReview: ["home", "school", "room", "door"], grammarReview: ["prepositions"] },
  totalDuration: 240, createdAt: Date.now(), updatedAt: Date.now(),
};

export const DAY_9: DailyLesson = {
  id: "lesson_day_9", dayId: "day_9",
  activities: [
    vocabAct("a1", "Time Words", "时间词汇", 40,
      [
        { word: "time", ipa: "/taɪm/", chineseMeaning: "时间", example: "What time is it?", exampleChinese: "现在几点了？", memoryHint: "太姆" },
        { word: "day", ipa: "/deɪ/", chineseMeaning: "天", example: "Today is a good day.", exampleChinese: "今天是个好日子。", memoryHint: "得" },
        { word: "night", ipa: "/naɪt/", chineseMeaning: "夜晚", example: "Good night!", exampleChinese: "晚安！", memoryHint: "耐特" },
        { word: "morning", ipa: "/ˈmɔːrnɪŋ/", chineseMeaning: "早上", example: "Good morning!", exampleChinese: "早上好！", memoryHint: "莫宁" },
        { word: "afternoon", ipa: "/ˌæftərˈnuːn/", chineseMeaning: "下午", example: "Good afternoon!", exampleChinese: "下午好！", memoryHint: "after+noon" },
        { word: "evening", ipa: "/ˈiːvnɪŋ/", chineseMeaning: "晚上", example: "Good evening!", exampleChinese: "晚上好！", memoryHint: "伊文宁" },
        { word: "today", ipa: "/təˈdeɪ/", chineseMeaning: "今天", example: "Today is Monday.", exampleChinese: "今天是周一。", memoryHint: "to+day" },
        { word: "tomorrow", ipa: "/təˈmɒroʊ/", chineseMeaning: "明天", example: "See you tomorrow.", exampleChinese: "明天见。", memoryHint: "特莫肉" },
        { word: "yesterday", ipa: "/ˈjɛstərdeɪ/", chineseMeaning: "昨天", example: "Yesterday was Sunday.", exampleChinese: "昨天是周日。", memoryHint: "耶斯特得" },
      ]),
    vocabAct("a2", "Days of the Week", "星期", 25,
      [
        { word: "Monday", ipa: "/ˈmʌndeɪ/", chineseMeaning: "周一", example: "Monday is the first day.", exampleChinese: "周一是第一天。", memoryHint: "芒得" },
        { word: "Tuesday", ipa: "/ˈtjuːzdeɪ/", chineseMeaning: "周二", example: "Tuesday is the second day.", exampleChinese: "周二是第二天。", memoryHint: "秋兹得" },
        { word: "Wednesday", ipa: "/ˈwɛnzdeɪ/", chineseMeaning: "周三", example: "Wednesday is the third day.", exampleChinese: "周三是第三天。", memoryHint: "温兹得" },
        { word: "Thursday", ipa: "/ˈθɜːrzdeɪ/", chineseMeaning: "周四", example: "Thursday is the fourth day.", exampleChinese: "周四是第四天。", memoryHint: "瑟兹得" },
        { word: "Friday", ipa: "/ˈfraɪdeɪ/", chineseMeaning: "周五", example: "Friday is the fifth day.", exampleChinese: "周五是第五天。", memoryHint: "弗莱得" },
        { word: "Saturday", ipa: "/ˈsætərdeɪ/", chineseMeaning: "周六", example: "Saturday is the sixth day.", exampleChinese: "周六是第六天。", memoryHint: "赛特得" },
        { word: "Sunday", ipa: "/ˈsʌndeɪ/", chineseMeaning: "周日", example: "Sunday is the seventh day.", exampleChinese: "周日是第七天。", memoryHint: "桑得" },
      ]),
    grammarAct("a3", "What time is it?", "询问时间", 25,
      "What time is it? (现在几点了？) It is + time (现在是...点)",
      "What time is it?（现在几点了？）It is + 时间（现在是...点）",
      [
        { correct: "What time is it?", chinese: "现在几点了？" },
        { correct: "It is eight o'clock.", chinese: "现在是八点。" },
        { correct: "It is three thirty.", chinese: "现在是三点半。" },
      ]),
    listeningAct("a4", "Time Listening", "时间听力", 20, "Good morning. What time is it? It is eight o'clock.", "早上好。现在几点了？现在是八点。"),
    speakingAct("a5", "Time Speaking", "时间口语", 25, "Good morning. What time is it? It is nine o'clock. Good night.", "早上好。现在几点了？现在是九点。晚安。"),
    readingAct("a6", "Time Reading", "时间阅读", 20, "Good morning. Today is Monday. What time is it? It is eight.", "早上好。今天是周一。现在几点了？现在是八点。"),
    writingAct("a7", "Time Writing", "时间写作", 20, "Write: It is ___.", "写：现在是___。", "It is eight o'clock.", ["eight o'clock", "nine o'clock", "three thirty"]),
    reviewAct("a8", "Day 9 Review", "第九天复习", 65, [
      { word: "morning", chineseMeaning: "早上" }, { word: "afternoon", chineseMeaning: "下午" }, { word: "evening", chineseMeaning: "晚上" },
      { word: "Monday", chineseMeaning: "周一" }, { word: "today", chineseMeaning: "今天" }, { word: "tomorrow", chineseMeaning: "明天" },
    ]),
  ],
  vocabulary: { words: ["time", "day", "night", "morning", "afternoon", "evening", "today", "tomorrow", "yesterday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], exercises: [] },
  grammar: { pointId: "what_time", explanation: { english: "What time is it?", chinese: "现在几点了？" }, examples: [{ correct: "It is eight o'clock.", chinese: "现在是八点。" }], exercises: [] },
  listening: { audioUrl: "", transcript: "Good morning. What time is it?", chineseTranscript: "早上好。现在几点了？", speed: "slow", questions: [] },
  speaking: { scenario: "Time", chineseScenario: "时间", dialogue: [{ speaker: "model", english: "What time is it?", chinese: "现在几点了？" }], practicePrompts: ["Ask and tell time"] },
  reading: { text: "Good morning. Today is Monday.", chineseTranslation: "早上好。今天是周一。", level: "controlled", questions: [] },
  writing: { type: "controlled", prompt: "It is ___.", chinesePrompt: "现在是___。", example: "It is eight o'clock.", wordBank: ["eight o'clock", "nine o'clock"] },
  review: { srsReview: true, wordReview: ["morning", "Monday", "today"], grammarReview: ["what_time"] },
  totalDuration: 240, createdAt: Date.now(), updatedAt: Date.now(),
};

export const DAY_10: DailyLesson = {
  id: "lesson_day_10", dayId: "day_10",
  activities: [
    vocabAct("a1", "Weather", "天气", 40,
      [
        { word: "weather", ipa: "/ˈwɛðər/", chineseMeaning: "天气", example: "The weather is nice.", exampleChinese: "天气很好。", memoryHint: "温度" },
        { word: "hot", ipa: "/hɒt/", chineseMeaning: "热的", example: "It is hot today.", exampleChinese: "今天很热。", memoryHint: "好的" },
        { word: "cold", ipa: "/koʊld/", chineseMeaning: "冷的", example: "It is cold outside.", exampleChinese: "外面很冷。", memoryHint: "扣的" },
        { word: "warm", ipa: "/wɔːrm/", chineseMeaning: "温暖的", example: "The weather is warm.", exampleChinese: "天气很暖和。", memoryHint: "沃姆" },
        { word: "cool", ipa: "/kuːl/", chineseMeaning: "凉爽的", example: "The weather is cool.", exampleChinese: "天气很凉爽。", memoryHint: "酷" },
        { word: "rain", ipa: "/reɪn/", chineseMeaning: "雨", example: "It is raining.", exampleChinese: "在下雨。", memoryHint: "瑞恩" },
        { word: "snow", ipa: "/snoʊ/", chineseMeaning: "雪", example: "It is snowing.", exampleChinese: "在下雪。", memoryHint: "斯诺" },
        { word: "sun", ipa: "/sʌn/", chineseMeaning: "太阳", example: "The sun is bright.", exampleChinese: "太阳很亮。", memoryHint: "桑" },
        { word: "wind", ipa: "/wɪnd/", chineseMeaning: "风", example: "The wind is strong.", exampleChinese: "风很大。", memoryHint: "温的" },
        { word: "cloud", ipa: "/klaʊd/", chineseMeaning: "云", example: "The clouds are white.", exampleChinese: "云是白色的。", memoryHint: "克劳的" },
      ]),
    vocabAct("a2", "Seasons", "季节", 20,
      [
        { word: "spring", ipa: "/sprɪŋ/", chineseMeaning: "春天", example: "Spring is warm.", exampleChinese: "春天很暖和。", memoryHint: "斯普润" },
        { word: "summer", ipa: "/ˈsʌmər/", chineseMeaning: "夏天", example: "Summer is hot.", exampleChinese: "夏天很热。", memoryHint: "萨默" },
        { word: "autumn", ipa: "/ˈɔːtəm/", chineseMeaning: "秋天", example: "Autumn is cool.", exampleChinese: "秋天很凉爽。", memoryHint: "奥特姆" },
        { word: "winter", ipa: "/ˈwɪntər/", chineseMeaning: "冬天", example: "Winter is cold.", exampleChinese: "冬天很冷。", memoryHint: "温特" },
      ]),
    grammarAct("a3", "It is + adjective", "It is + 形容词", 25,
      "It is + weather adjective (天气是...)",
      "It is + 天气形容词（天气是...）",
      [
        { correct: "It is hot today.", chinese: "今天很热。" },
        { correct: "It is cold outside.", chinese: "外面很冷。" },
        { correct: "The weather is nice.", chinese: "天气很好。" },
      ]),
    listeningAct("a4", "Weather Listening", "天气听力", 20, "Good morning. How is the weather? It is hot and sunny.", "早上好。天气怎么样？天气很热很晴朗。"),
    speakingAct("a5", "Weather Speaking", "天气口语", 25, "How is the weather? It is cold. It is winter. I like winter.", "天气怎么样？很冷。是冬天。我喜欢冬天。"),
    readingAct("a6", "Weather Reading", "天气阅读", 20, "Today is Monday. The weather is hot. Summer is hot.", "今天是周一。天气很热。夏天很热。"),
    writingAct("a7", "Weather Writing", "天气写作", 20, "Write: It is ___.", "写：天气是___。", "It is hot today.", ["hot", "cold", "warm", "cool"]),
    reviewAct("a8", "Day 10 Review", "第十天复习", 70, [
      { word: "weather", chineseMeaning: "天气" }, { word: "hot", chineseMeaning: "热的" }, { word: "cold", chineseMeaning: "冷的" },
      { word: "spring", chineseMeaning: "春天" }, { word: "summer", chineseMeaning: "夏天" }, { word: "winter", chineseMeaning: "冬天" },
    ]),
  ],
  vocabulary: { words: ["weather", "hot", "cold", "warm", "cool", "rain", "snow", "sun", "wind", "cloud", "spring", "summer", "autumn", "winter"], exercises: [] },
  grammar: { pointId: "it_is_adj", explanation: { english: "It is + adjective", chinese: "天气是..." }, examples: [{ correct: "It is hot.", chinese: "天气很热。" }], exercises: [] },
  listening: { audioUrl: "", transcript: "How is the weather?", chineseTranscript: "天气怎么样？", speed: "slow", questions: [] },
  speaking: { scenario: "Weather", chineseScenario: "天气", dialogue: [{ speaker: "model", english: "How is the weather?", chinese: "天气怎么样？" }], practicePrompts: ["Talk about weather"] },
  reading: { text: "Today is hot. Summer is hot.", chineseTranslation: "今天很热。夏天很热。", level: "controlled", questions: [] },
  writing: { type: "controlled", prompt: "It is ___.", chinesePrompt: "天气是___。", example: "It is hot.", wordBank: ["hot", "cold", "warm", "cool"] },
  review: { srsReview: true, wordReview: ["weather", "hot", "cold", "spring"], grammarReview: ["it_is_adj"] },
  totalDuration: 240, createdAt: Date.now(), updatedAt: Date.now(),
};

export const DAY_11: DailyLesson = {
  id: "lesson_day_11", dayId: "day_11",
  activities: [
    vocabAct("a1", "Jobs", "职业", 40,
      [
        { word: "teacher", ipa: "/ˈtiːtʃər/", chineseMeaning: "老师", example: "The teacher is kind.", exampleChinese: "老师很善良。", memoryHint: "teach+er" },
        { word: "doctor", ipa: "/ˈdɒktər/", chineseMeaning: "医生", example: "The doctor helps people.", exampleChinese: "医生帮助病人。", memoryHint: "道克特" },
        { word: "nurse", ipa: "/nɜːrs/", chineseMeaning: "护士", example: "The nurse is helpful.", exampleChinese: "护士很乐于助人。", memoryHint: "纳斯" },
        { word: "driver", ipa: "/ˈdraɪvər/", chineseMeaning: "司机", example: "The driver is careful.", exampleChinese: "司机很小心。", memoryHint: "drive+er" },
        { word: "cook", ipa: "/kʊk/", chineseMeaning: "厨师", example: "My father is a good cook.", exampleChinese: "我爸爸是个好厨师。", memoryHint: "酷客" },
        { word: "student", ipa: "/ˈstjuːdənt/", chineseMeaning: "学生", example: "I am a student.", exampleChinese: "我是学生。", memoryHint: "斯丢登特" },
      ]),
    vocabAct("a2", "Actions", "动作", 35,
      [
        { word: "go", ipa: "/ɡoʊ/", chineseMeaning: "去", example: "I go to school.", exampleChinese: "我去上学。", memoryHint: "够" },
        { word: "come", ipa: "/kʌm/", chineseMeaning: "来", example: "Come here.", exampleChinese: "过来。", memoryHint: "卡姆" },
        { word: "eat", ipa: "/iːt/", chineseMeaning: "吃", example: "I eat breakfast.", exampleChinese: "我吃早餐。", memoryHint: "伊特" },
        { word: "drink", ipa: "/drɪŋk/", chineseMeaning: "喝", example: "I drink water.", exampleChinese: "我喝水。", memoryHint: "准克" },
        { word: "sleep", ipa: "/sliːp/", chineseMeaning: "睡觉", example: "I sleep at night.", exampleChinese: "我在晚上睡觉。", memoryHint: "斯利普" },
        { word: "work", ipa: "/wɜːrk/", chineseMeaning: "工作", example: "My father works hard.", exampleChinese: "我爸爸工作很努力。", memoryHint: "沃克" },
        { word: "play", ipa: "/pleɪ/", chineseMeaning: "玩", example: "I play with friends.", exampleChinese: "我和朋友玩。", memoryHint: "普雷" },
        { word: "read", ipa: "/riːd/", chineseMeaning: "读", example: "I read books.", exampleChinese: "我读书。", memoryHint: "瑞德" },
      ]),
    grammarAct("a3", "I + verb", "I + 动词", 25,
      "I + base verb (我+动词原形)",
      "I + 动词原形（我+动作）",
      [
        { correct: "I go to school.", chinese: "我去上学。" },
        { correct: "I eat breakfast.", chinese: "我吃早餐。" },
        { correct: "I sleep at night.", chinese: "我在晚上睡觉。" },
      ]),
    listeningAct("a4", "Actions Listening", "动作听力", 20, "I go to school. I eat breakfast. I drink water. I sleep at night.", "我去上学。我吃早餐。我喝水。我在晚上睡觉。"),
    speakingAct("a5", "Actions Speaking", "动作口语", 25, "I go to school. I eat lunch. I play with friends. I read books.", "我去上学。我吃午餐。我和朋友玩。我读书。"),
    readingAct("a6", "Actions Reading", "动作阅读", 20, "I am a student. I go to school. I eat breakfast. I read books.", "我是学生。我去上学。我吃早餐。我读书。"),
    writingAct("a7", "Actions Writing", "动作写作", 20, "Write: I ___.", "写：我___。", "I go to school.", ["go to school", "eat breakfast", "drink water", "read books"]),
    reviewAct("a8", "Day 11 Review", "第十一天复习", 55, [
      { word: "teacher", chineseMeaning: "老师" }, { word: "doctor", chineseMeaning: "医生" }, { word: "student", chineseMeaning: "学生" },
      { word: "go", chineseMeaning: "去" }, { word: "eat", chineseMeaning: "吃" }, { word: "drink", chineseMeaning: "喝" },
    ]),
  ],
  vocabulary: { words: ["teacher", "doctor", "nurse", "driver", "cook", "student", "go", "come", "eat", "drink", "sleep", "work", "play", "read"], exercises: [] },
  grammar: { pointId: "i_verb", explanation: { english: "I + verb", chinese: "我+动词" }, examples: [{ correct: "I go to school.", chinese: "我去上学。" }], exercises: [] },
  listening: { audioUrl: "", transcript: "I go to school.", chineseTranscript: "我去上学。", speed: "slow", questions: [] },
  speaking: { scenario: "Actions", chineseScenario: "动作", dialogue: [{ speaker: "model", english: "I go to school.", chinese: "我去上学。" }], practicePrompts: ["Talk about your day"] },
  reading: { text: "I am a student. I go to school.", chineseTranslation: "我是学生。我去上学。", level: "controlled", questions: [] },
  writing: { type: "controlled", prompt: "I ___.", chinesePrompt: "我___。", example: "I go to school.", wordBank: ["go to school", "eat breakfast", "read books"] },
  review: { srsReview: true, wordReview: ["teacher", "go", "eat", "drink"], grammarReview: ["i_verb"] },
  totalDuration: 240, createdAt: Date.now(), updatedAt: Date.now(),
};

export const DAY_12: DailyLesson = {
  id: "lesson_day_12", dayId: "day_12",
  activities: [
    vocabAct("a1", "Common Objects", "常见物品", 40,
      [
        { word: "book", ipa: "/bʊk/", chineseMeaning: "书", example: "I read a book.", exampleChinese: "我读一本书。", memoryHint: "布克" },
        { word: "pen", ipa: "/pɛn/", chineseMeaning: "笔", example: "I write with a pen.", exampleChinese: "我用笔写。", memoryHint: "喷" },
        { word: "paper", ipa: "/ˈpeɪpər/", chineseMeaning: "纸", example: "I write on paper.", exampleChinese: "我在纸上写。", memoryHint: "佩坡" },
        { word: "phone", ipa: "/foʊn/", chineseMeaning: "电话", example: "I use my phone.", exampleChinese: "我用我的电话。", memoryHint: "佛恩" },
        { word: "key", ipa: "/kiː/", chineseMeaning: "钥匙", example: "Where is my key?", exampleChinese: "我的钥匙在哪里？", memoryHint: "克一" },
        { word: "bag", ipa: "/bæɡ/", chineseMeaning: "包", example: "I carry my bag.", exampleChinese: "我背着我的包。", memoryHint: "拜格" },
        { word: "cup", ipa: "/kʌp/", chineseMeaning: "杯子", example: "I drink from a cup.", exampleChinese: "我用杯子喝。", memoryHint: "卡普" },
        { word: "clock", ipa: "/klɒk/", chineseMeaning: "钟", example: "The clock shows ten.", exampleChinese: "钟显示十点。", memoryHint: "克劳克" },
      ]),
    vocabAct("a2", "Verbs Extended", "扩展动词", 30,
      [
        { word: "write", ipa: "/raɪt/", chineseMeaning: "写", example: "I write a letter.", exampleChinese: "我写一封信。", memoryHint: "入爱特" },
        { word: "run", ipa: "/rʌn/", chineseMeaning: "跑", example: "I run every day.", exampleChinese: "我每天跑步。", memoryHint: "然" },
        { word: "walk", ipa: "/wɔːk/", chineseMeaning: "走", example: "I walk to school.", exampleChinese: "我走路去学校。", memoryHint: "沃克" },
        { word: "swim", ipa: "/swɪm/", chineseMeaning: "游泳", example: "I swim in the pool.", exampleChinese: "我在泳池游泳。", memoryHint: "斯威姆" },
        { word: "sing", ipa: "/sɪŋ/", chineseMeaning: "唱歌", example: "I sing a song.", exampleChinese: "我唱一首歌。", memoryHint: "星" },
        { word: "dance", ipa: "/dæns/", chineseMeaning: "跳舞", example: "I dance with friends.", exampleChinese: "我和朋友跳舞。", memoryHint: "丹斯" },
      ]),
    grammarAct("a3", "I can", "I can 句型", 25,
      "I can + verb (我能/会...)",
      "I can + 动词（我能/会...）",
      [
        { correct: "I can run.", chinese: "我会跑步。" },
        { correct: "I can swim.", chinese: "我会游泳。" },
        { correct: "I can sing.", chinese: "我会唱歌。" },
      ]),
    listeningAct("a4", "Abilities Listening", "能力听力", 20, "I can run. I can swim. I can sing. I can dance.", "我会跑步。我会游泳。我会唱歌。我会跳舞。"),
    speakingAct("a5", "Abilities Speaking", "能力口语", 25, "I can read. I can write. I can play. I can run.", "我会读书。我会写字。我会玩。我会跑步。"),
    readingAct("a6", "Abilities Reading", "能力阅读", 20, "I am Tom. I can run and swim. I can sing and dance.", "我是Tom。我会跑步和游泳。我会唱歌和跳舞。"),
    writingAct("a7", "Abilities Writing", "能力写作", 20, "Write: I can ___.", "写：我会___。", "I can run.", ["run", "swim", "sing", "dance"]),
    reviewAct("a8", "Day 12 Review", "第十二天复习", 50, [
      { word: "book", chineseMeaning: "书" }, { word: "pen", chineseMeaning: "笔" }, { word: "phone", chineseMeaning: "电话" },
      { word: "run", chineseMeaning: "跑" }, { word: "swim", chineseMeaning: "游泳" }, { word: "sing", chineseMeaning: "唱歌" },
    ]),
  ],
  vocabulary: { words: ["book", "pen", "paper", "phone", "key", "bag", "cup", "clock", "write", "run", "walk", "swim", "sing", "dance"], exercises: [] },
  grammar: { pointId: "can", explanation: { english: "I can", chinese: "我会" }, examples: [{ correct: "I can run.", chinese: "我会跑步。" }], exercises: [] },
  listening: { audioUrl: "", transcript: "I can run.", chineseTranscript: "我会跑步。", speed: "slow", questions: [] },
  speaking: { scenario: "Abilities", chineseScenario: "能力", dialogue: [{ speaker: "model", english: "I can run.", chinese: "我会跑步。" }], practicePrompts: ["Talk about what you can do"] },
  reading: { text: "I can run and swim.", chineseTranslation: "我会跑步和游泳。", level: "controlled", questions: [] },
  writing: { type: "controlled", prompt: "I can ___.", chinesePrompt: "我会___。", example: "I can run.", wordBank: ["run", "swim", "sing", "dance"] },
  review: { srsReview: true, wordReview: ["book", "run", "swim", "sing"], grammarReview: ["can"] },
  totalDuration: 240, createdAt: Date.now(), updatedAt: Date.now(),
};

export const DAY_13: DailyLesson = {
  id: "lesson_day_13", dayId: "day_13",
  activities: [
    vocabAct("a1", "Adjectives", "形容词", 40,
      [
        { word: "big", ipa: "/bɪɡ/", chineseMeaning: "大的", example: "The house is big.", exampleChinese: "房子很大。", memoryHint: "比格" },
        { word: "small", ipa: "/smɔːl/", chineseMeaning: "小的", example: "The cat is small.", exampleChinese: "猫很小。", memoryHint: "斯莫" },
        { word: "good", ipa: "/ɡʊd/", chineseMeaning: "好的", example: "This is good.", exampleChinese: "这个很好。", memoryHint: "顾的" },
        { word: "bad", ipa: "/bæd/", chineseMeaning: "坏的", example: "That is bad.", exampleChinese: "那个很坏。", memoryHint: "拜的" },
        { word: "happy", ipa: "/ˈhæpi/", chineseMeaning: "开心的", example: "I am happy.", exampleChinese: "我很开心。", memoryHint: "嗨皮" },
        { word: "sad", ipa: "/sæd/", chineseMeaning: "伤心的", example: "She is sad.", exampleChinese: "她很伤心。", memoryHint: "赛的" },
        { word: "new", ipa: "/njuː/", chineseMeaning: "新的", example: "I have a new book.", exampleChinese: "我有一本新书。", memoryHint: "牛" },
        { word: "old", ipa: "/oʊld/", chineseMeaning: "旧的", example: "This is my old bag.", exampleChinese: "这是我的旧包。", memoryHint: "欧的" },
        { word: "fast", ipa: "/fæst/", chineseMeaning: "快的", example: "The car is fast.", exampleChinese: "车很快。", memoryHint: "法斯特" },
        { word: "slow", ipa: "/sloʊ/", chineseMeaning: "慢的", example: "The turtle is slow.", exampleChinese: "乌龟很慢。", memoryHint: "斯楼" },
      ]),
    vocabAct("a2", "Opposites", "反义词", 25,
      [
        { word: "tall", ipa: "/tɔːl/", chineseMeaning: "高的", example: "He is tall.", exampleChinese: "他很高。", memoryHint: "涛" },
        { word: "short", ipa: "/ʃɔːrt/", chineseMeaning: "矮的", example: "She is short.", exampleChinese: "她很矮。", memoryHint: "烧特" },
        { word: "long", ipa: "/lɒŋ/", chineseMeaning: "长的", example: "The snake is long.", exampleChinese: "蛇很长。", memoryHint: "龙" },
        { word: "cheap", ipa: "/tʃiːp/", chineseMeaning: "便宜的", example: "This is cheap.", exampleChinese: "这个很便宜。", memoryHint: "齐普" },
        { word: "expensive", ipa: "/ɪkˈspɛnsɪv/", chineseMeaning: "贵的", example: "That is expensive.", exampleChinese: "那个很贵。", memoryHint: "一克斯喷西夫" },
      ]),
    grammarAct("a3", "Subject + be + adjective", "主语 + be + 形容词", 25,
      "Subject + is/are + adjective",
      "主语 + is/are + 形容词",
      [
        { correct: "The house is big.", chinese: "房子很大。" },
        { correct: "I am happy.", chinese: "我很开心。" },
        { correct: "They are tall.", chinese: "他们很高。" },
      ]),
    listeningAct("a4", "Adjectives Listening", "形容词听力", 20, "The house is big. The cat is small. I am happy.", "房子很大。猫很小。我很开心。"),
    speakingAct("a5", "Adjectives Speaking", "形容词口语", 25, "I am happy. The car is fast. The book is new. She is tall.", "我很开心。车很快。书是新的。她很高。"),
    readingAct("a6", "Adjectives Reading", "形容词阅读", 20, "I have a new book. It is big. I am happy.", "我有一本新书。它很大。我很开心。"),
    writingAct("a7", "Adjectives Writing", "形容词写作", 20, "Write: ___ is ___.", "写：___是___。", "The cat is small.", ["The cat is small", "I am happy", "The car is fast"]),
    reviewAct("a8", "Day 13 Review", "第十三天复习", 45, [
      { word: "big", chineseMeaning: "大的" }, { word: "small", chineseMeaning: "小的" }, { word: "happy", chineseMeaning: "开心的" },
      { word: "tall", chineseMeaning: "高的" }, { word: "new", chineseMeaning: "新的" }, { word: "fast", chineseMeaning: "快的" },
    ]),
  ],
  vocabulary: { words: ["big", "small", "good", "bad", "happy", "sad", "new", "old", "fast", "slow", "tall", "short", "long", "cheap", "expensive"], exercises: [] },
  grammar: { pointId: "subject_be_adj", explanation: { english: "Subject + be + adjective", chinese: "主语 + be + 形容词" }, examples: [{ correct: "The house is big.", chinese: "房子很大。" }], exercises: [] },
  listening: { audioUrl: "", transcript: "The house is big.", chineseTranscript: "房子很大。", speed: "slow", questions: [] },
  speaking: { scenario: "Adjectives", chineseScenario: "形容词", dialogue: [{ speaker: "model", english: "The house is big.", chinese: "房子很大。" }], practicePrompts: ["Describe things"] },
  reading: { text: "I have a new book. It is big.", chineseTranslation: "我有一本新书。它很大。", level: "controlled", questions: [] },
  writing: { type: "controlled", prompt: "___ is ___.", chinesePrompt: "___是___。", example: "The cat is small.", wordBank: ["big", "small", "happy", "tall"] },
  review: { srsReview: true, wordReview: ["big", "small", "happy", "tall"], grammarReview: ["subject_be_adj"] },
  totalDuration: 240, createdAt: Date.now(), updatedAt: Date.now(),
};

export const DAY_14: DailyLesson = {
  id: "lesson_day_14", dayId: "day_14",
  activities: [
    reviewAct("a1", "Week 2 Vocabulary Review", "第二周词汇复习", 40, [
      { word: "home", chineseMeaning: "家" }, { word: "school", chineseMeaning: "学校" }, { word: "morning", chineseMeaning: "早上" },
      { word: "Monday", chineseMeaning: "周一" }, { word: "weather", chineseMeaning: "天气" }, { word: "hot", chineseMeaning: "热的" },
      { word: "teacher", chineseMeaning: "老师" }, { word: "go", chineseMeaning: "去" }, { word: "book", chineseMeaning: "书" },
      { word: "big", chineseMeaning: "大的" }, { word: "happy", chineseMeaning: "开心的" }, { word: "new", chineseMeaning: "新的" },
    ]),
    reviewAct("a2", "Week 2 Grammar Review", "第二周语法复习", 30, [
      { word: "at", chineseMeaning: "在..." }, { word: "on", chineseMeaning: "在...上面" }, { word: "in", chineseMeaning: "在...里面" },
      { word: "can", chineseMeaning: "会" }, { word: "is", chineseMeaning: "是" }, { word: "are", chineseMeaning: "是" },
    ]),
    vocabAct("a3", "Review: Numbers 6-10", "复习：数字 6-10", 25,
      [
        { word: "six", ipa: "/sɪks/", chineseMeaning: "六", example: "Six o'clock.", exampleChinese: "六点钟。" },
        { word: "seven", ipa: "/ˈsɛvən/", chineseMeaning: "七", example: "Seven days.", exampleChinese: "七天。" },
        { word: "eight", ipa: "/eɪt/", chineseMeaning: "八", example: "I am eight.", exampleChinese: "我八岁了。" },
        { word: "nine", ipa: "/naɪn/", chineseMeaning: "九", example: "Nine cats.", exampleChinese: "九只猫。" },
        { word: "ten", ipa: "/tɛn/", chineseMeaning: "十", example: "Ten fingers.", exampleChinese: "十根手指。" },
      ]),
    grammarAct("a4", "Grammar Review", "语法复习", 30,
      "I am, You are, He/She/It is, I like, I want, I have, I can, This is, That is",
      "我是，你是，他/她/它是，我喜欢，我想要，我有，我会，这是，那是",
      [
        { correct: "I am a student.", chinese: "我是学生。" },
        { correct: "I like water.", chinese: "我喜欢水。" },
        { correct: "I can run.", chinese: "我会跑步。" },
        { correct: "This is my mother.", chinese: "这是我妈妈。" },
      ]),
    listeningAct("a5", "Week 2 Listening Review", "第二周听力复习", 25, "I am at home. The weather is hot. I can run. This is my book.", "我在家。天气很热。我会跑步。这是我的书。"),
    speakingAct("a6", "Week 2 Speaking Review", "第二周口语复习", 30, "I am at school. I like my teacher. I can read. This is my friend.", "我在学校。我喜欢我的老师。我会读书。这是我的朋友。"),
    reviewAct("a7", "Day 14 Final Review", "第十四天最终复习", 30, [
      { word: "home", chineseMeaning: "家" }, { word: "morning", chineseMeaning: "早上" }, { word: "teacher", chineseMeaning: "老师" },
      { word: "book", chineseMeaning: "书" }, { word: "big", chineseMeaning: "大的" }, { word: "happy", chineseMeaning: "开心的" },
    ]),
  ],
  vocabulary: { words: ["home", "school", "morning", "weather", "teacher", "go", "book", "big", "happy", "six", "seven", "eight", "nine", "ten"], exercises: [] },
  grammar: { pointId: "week2_review", explanation: { english: "Week 2 Grammar Review", chinese: "第二周语法复习" }, examples: [{ correct: "I am a student.", chinese: "我是学生。" }], exercises: [] },
  listening: { audioUrl: "", transcript: "I am at home.", chineseTranscript: "我在家。", speed: "slow", questions: [] },
  speaking: { scenario: "Week 2 Review", chineseScenario: "第二周复习", dialogue: [{ speaker: "model", english: "I am at school.", chinese: "我在学校。" }], practicePrompts: ["Review everything"] },
  reading: { text: "I am at home. I like my teacher.", chineseTranslation: "我在家。我喜欢我的老师。", level: "controlled", questions: [] },
  writing: { type: "guided", prompt: "Write about your day.", chinesePrompt: "写关于你的一天。", example: "I go to school. I like my teacher.", wordBank: ["I go", "I like", "I can"] },
  review: { srsReview: true, wordReview: ["home", "morning", "teacher", "book"], grammarReview: ["week2_review"] },
  totalDuration: 240, createdAt: Date.now(), updatedAt: Date.now(),
};

// ============================================================
// Week 3-5: Day 15-30 (condensed but complete)
// ============================================================

// Helper to create standard daily lessons for Week 3-5
function createWeekLesson(
  dayNumber: number,
  theme: string,
  themeChinese: string,
  words: { word: string; ipa: string; chineseMeaning: string; example: string; exampleChinese: string; memoryHint?: string }[],
  grammarRule: string,
  grammarRuleChinese: string,
  grammarExamples: { correct: string; chinese: string }[],
  listenText: string,
  listenChinese: string,
  speakText: string,
  speakChinese: string,
  readText: string,
  readChinese: string,
): DailyLesson {
  return {
    id: `lesson_day_${dayNumber}`,
    dayId: `day_${dayNumber}`,
    activities: [
      vocabAct("a1", theme, themeChinese, 40, words.slice(0, Math.ceil(words.length / 2))),
      vocabAct("a2", `${theme} Part 2`, `${themeChinese}第二部分`, 30, words.slice(Math.ceil(words.length / 2))),
      grammarAct("a3", grammarRule, grammarRuleChinese, 25, grammarRule, grammarRuleChinese, grammarExamples),
      listeningAct("a4", `${theme} Listening`, `${themeChinese}听力`, 20, listenText, listenChinese),
      speakingAct("a5", `${theme} Speaking`, `${themeChinese}口语`, 25, speakText, speakChinese),
      readingAct("a6", `${theme} Reading`, `${themeChinese}阅读`, 20, readText, readChinese),
      writingAct("a7", `${theme} Writing`, `${themeChinese}写作`, 20, `Write about ${theme.toLowerCase()}.`, `写关于${themeChinese}。`, words[0]?.example || "", words.slice(0, 4).map(w => w.chineseMeaning)),
      reviewAct("a8", `Day ${dayNumber} Review`, `第${dayNumber}天复习`, 60, words.slice(0, 6).map(w => ({ word: w.word, chineseMeaning: w.chineseMeaning }))),
    ],
    vocabulary: { words: words.map(w => w.word), exercises: [] },
    grammar: { pointId: `grammar_day_${dayNumber}`, explanation: { english: grammarRule, chinese: grammarRuleChinese }, examples: grammarExamples, exercises: [] },
    listening: { audioUrl: "", transcript: listenText, chineseTranscript: listenChinese, speed: "slow", questions: [] },
    speaking: { scenario: theme, chineseScenario: themeChinese, dialogue: [{ speaker: "model", english: speakText, chinese: speakChinese }], practicePrompts: [`Talk about ${theme.toLowerCase()}`] },
    reading: { text: readText, chineseTranslation: readChinese, level: "controlled", questions: [] },
    writing: { type: "controlled", prompt: `Write about ${theme.toLowerCase()}.`, chinesePrompt: `写关于${themeChinese}。`, example: words[0]?.example || "", wordBank: words.slice(0, 4).map(w => w.chineseMeaning) },
    review: { srsReview: true, wordReview: words.slice(0, 4).map(w => w.word), grammarReview: [`grammar_day_${dayNumber}`] },
    totalDuration: 240, createdAt: Date.now(), updatedAt: Date.now(),
  };
}

export const DAY_15 = createWeekLesson(15, "Daily Routines", "日常活动",
  [
    { word: "wake", ipa: "/weɪk/", chineseMeaning: "醒来", example: "I wake up at 7.", exampleChinese: "我7点醒来。", memoryHint: "维克" },
    { word: "wash", ipa: "/wɒʃ/", chineseMeaning: "洗", example: "I wash my face.", exampleChinese: "我洗脸。", memoryHint: "沃什" },
    { word: "brush", ipa: "/brʌʃ/", chineseMeaning: "刷", example: "I brush my teeth.", exampleChinese: "我刷牙。", memoryHint: "不拉什" },
    { word: "dress", ipa: "/drɛs/", chineseMeaning: "穿衣服", example: "I dress myself.", exampleChinese: "我自己穿衣服。", memoryHint: "拽斯" },
    { word: "breakfast", ipa: "/ˈbrɛkfəst/", chineseMeaning: "早餐", example: "I eat breakfast.", exampleChinese: "我吃早餐。", memoryHint: "break+fast" },
    { word: "lunch", ipa: "/lʌntʃ/", chineseMeaning: "午餐", example: "I eat lunch at noon.", exampleChinese: "我中午吃午餐。", memoryHint: "兰去" },
    { word: "dinner", ipa: "/ˈdɪnər/", chineseMeaning: "晚餐", example: "Dinner is ready.", exampleChinese: "晚餐准备好了。", memoryHint: "迪呢" },
    { word: "bed", ipa: "/bɛd/", chineseMeaning: "床", example: "I go to bed.", exampleChinese: "我去睡觉。", memoryHint: "败的" },
  ],
  "I + daily routine verb",
  "I + 日常活动动词",
  [{ correct: "I wake up at 7.", chinese: "我7点醒来。" }, { correct: "I eat breakfast.", chinese: "我吃早餐。" }],
  "I wake up. I wash my face. I eat breakfast. I go to school.",
  "我醒来。我洗脸。我吃早餐。我去上学。",
  "I wake up at 7. I eat breakfast. I go to school. I eat dinner.",
  "我7点醒来。我吃早餐。我去上学。我吃晚餐。",
  "I wake up at 7. I wash my face. I eat breakfast. I go to school.",
  "我7点醒来。我洗脸。我吃早餐。我去上学。");

export const DAY_16 = createWeekLesson(16, "Transportation", "交通",
  [
    { word: "car", ipa: "/kɑːr/", chineseMeaning: "车", example: "I drive a car.", exampleChinese: "我开车。", memoryHint: "卡" },
    { word: "bus", ipa: "/bʌs/", chineseMeaning: "公交车", example: "I take the bus.", exampleChinese: "我坐公交车。", memoryHint: "巴斯" },
    { word: "train", ipa: "/treɪn/", chineseMeaning: "火车", example: "I take the train.", exampleChinese: "我坐火车。", memoryHint: "春" },
    { word: "bike", ipa: "/baɪk/", chineseMeaning: "自行车", example: "I ride a bike.", exampleChinese: "我骑自行车。", memoryHint: "拜克" },
    { word: "walk", ipa: "/wɔːk/", chineseMeaning: "走路", example: "I walk to school.", exampleChinese: "我走路去学校。", memoryHint: "沃克" },
    { word: "plane", ipa: "/pleɪn/", chineseMeaning: "飞机", example: "I take a plane.", exampleChinese: "我坐飞机。", memoryHint: "普雷恩" },
  ],
  "I take / I ride / I drive",
  "I take / I ride / I drive",
  [{ correct: "I take the bus.", chinese: "我坐公交车。" }, { correct: "I ride a bike.", chinese: "我骑自行车。" }],
  "I take the bus. I ride a bike. I walk to school.",
  "我坐公交车。我骑自行车。我走路去学校。",
  "I take the bus to school. I ride a bike on Sunday.",
  "我坐公交车去学校。我周日骑自行车。",
  "I take the bus. I ride a bike. I walk. I drive a car.",
  "我坐公交车。我骑自行车。我走路。我开车。");

export const DAY_17 = createWeekLesson(17, "At the Store", "在商店",
  [
    { word: "buy", ipa: "/baɪ/", chineseMeaning: "买", example: "I buy food.", exampleChinese: "我买食物。", memoryHint: "拜" },
    { word: "sell", ipa: "/sɛl/", chineseMeaning: "卖", example: "They sell clothes.", exampleChinese: "他们卖衣服。", memoryHint: "赛欧" },
    { word: "price", ipa: "/praɪs/", chineseMeaning: "价格", example: "What is the price?", exampleChinese: "价格是多少？", memoryHint: "普莱斯" },
    { word: "cheap", ipa: "/tʃiːp/", chineseMeaning: "便宜的", example: "This is cheap.", exampleChinese: "这个很便宜。", memoryHint: "齐普" },
    { word: "expensive", ipa: "/ɪkˈspɛnsɪv/", chineseMeaning: "贵的", example: "That is expensive.", exampleChinese: "那个很贵。", memoryHint: "一克斯喷西夫" },
    { word: "money", ipa: "/ˈmʌni/", chineseMeaning: "钱", example: "I have money.", exampleChinese: "我有钱。", memoryHint: "马尼" },
  ],
  "How much is it?",
  "How much is it?（多少钱？）",
  [{ correct: "How much is it?", chinese: "多少钱？" }, { correct: "It is five dollars.", chinese: "五美元。" }],
  "How much is it? It is cheap. I want to buy it.",
  "多少钱？很便宜。我想买。",
  "How much is this? It is ten dollars. I buy it.",
  "这个多少钱？十美元。我买了。",
  "How much is it? It is cheap. I buy it. I have money.",
  "多少钱？很便宜。我买了。我有钱。");

export const DAY_18 = createWeekLesson(18, "Health", "健康",
  [
    { word: "sick", ipa: "/sɪk/", chineseMeaning: "生病的", example: "I am sick.", exampleChinese: "我生病了。", memoryHint: "赛克" },
    { word: "healthy", ipa: "/ˈhɛlθi/", chineseMeaning: "健康的", example: "I am healthy.", exampleChinese: "我很健康。", memoryHint: "黑欧斯" },
    { word: "pain", ipa: "/peɪn/", chineseMeaning: "疼痛", example: "I have pain.", exampleChinese: "我很疼。", memoryHint: "喷" },
    { word: "headache", ipa: "/ˈhɛdeɪk/", chineseMeaning: "头疼", example: "I have a headache.", exampleChinese: "我头疼。", memoryHint: "head+ache" },
    { word: "cold", ipa: "/koʊld/", chineseMeaning: "感冒", example: "I have a cold.", exampleChinese: "我感冒了。", memoryHint: "扣的" },
    { word: "medicine", ipa: "/ˈmɛdɪsən/", chineseMeaning: "药", example: "I take medicine.", exampleChinese: "我吃药。", memoryHint: "麦迪森" },
  ],
  "I have + illness",
  "I have + 疾病",
  [{ correct: "I have a cold.", chinese: "我感冒了。" }, { correct: "I have a headache.", chinese: "我头疼。" }],
  "I am sick. I have a cold. I take medicine.",
  "我生病了。我感冒了。我吃药。",
  "I am not healthy. I have a headache. I go to the doctor.",
  "我不健康。我头疼。我去看医生。",
  "I am sick. I have a cold. I take medicine. I am healthy.",
  "我生病了。我感冒了。我吃药。我很健康。");

export const DAY_19 = createWeekLesson(19, "Animals", "动物",
  [
    { word: "cat", ipa: "/kæt/", chineseMeaning: "猫", example: "The cat is cute.", exampleChinese: "猫很可爱。", memoryHint: "凯特" },
    { word: "dog", ipa: "/dɒɡ/", chineseMeaning: "狗", example: "The dog is friendly.", exampleChinese: "狗很友好。", memoryHint: "道格" },
    { word: "bird", ipa: "/bɜːrd/", chineseMeaning: "鸟", example: "The bird can fly.", exampleChinese: "鸟能飞。", memoryHint: "伯德" },
    { word: "fish", ipa: "/fɪʃ/", chineseMeaning: "鱼", example: "The fish can swim.", exampleChinese: "鱼能游。", memoryHint: "费什" },
    { word: "rabbit", ipa: "/ˈræbɪt/", chineseMeaning: "兔子", example: "The rabbit is fast.", exampleChinese: "兔子很快。", memoryHint: "瑞比特" },
    { word: "horse", ipa: "/hɔːrs/", chineseMeaning: "马", example: "The horse is strong.", exampleChinese: "马很强壮。", memoryHint: "好斯" },
  ],
  "The + animal + is + adjective",
  "The + 动物 + is + 形容词",
  [{ correct: "The cat is cute.", chinese: "猫很可爱。" }, { correct: "The dog is big.", chinese: "狗很大。" }],
  "The cat is cute. The dog is big. The bird can fly.",
  "猫很可爱。狗很大。鸟能飞。",
  "I have a cat. The cat is cute. I like my cat.",
  "我有一只猫。猫很可爱。我喜欢我的猫。",
  "The cat is cute. The dog is big. The bird is small.",
  "猫很可爱。狗很大。鸟很小。");

export const DAY_20 = createWeekLesson(20, "Nature", "自然",
  [
    { word: "tree", ipa: "/triː/", chineseMeaning: "树", example: "The tree is tall.", exampleChinese: "树很高。", memoryHint: "吹" },
    { word: "flower", ipa: "/ˈflaʊər/", chineseMeaning: "花", example: "The flower is beautiful.", exampleChinese: "花很漂亮。", memoryHint: "弗拉沃" },
    { word: "river", ipa: "/ˈrɪvər/", chineseMeaning: "河", example: "The river is long.", exampleChinese: "河很长。", memoryHint: "瑞沃" },
    { word: "mountain", ipa: "/ˈmaʊntən/", chineseMeaning: "山", example: "The mountain is high.", exampleChinese: "山很高。", memoryHint: "忙腾" },
    { word: "sea", ipa: "/siː/", chineseMeaning: "海", example: "The sea is big.", exampleChinese: "海很大。", memoryHint: "西" },
    { word: "sky", ipa: "/skaɪ/", chineseMeaning: "天空", example: "The sky is blue.", exampleChinese: "天空是蓝色的。", memoryHint: "斯开" },
  ],
  "The + nature noun + is + adjective",
  "The + 自然名词 + is + 形容词",
  [{ correct: "The tree is tall.", chinese: "树很高。" }, { correct: "The sky is blue.", chinese: "天空是蓝色的。" }],
  "The tree is tall. The flower is beautiful. The sky is blue.",
  "树很高。花很漂亮。天空是蓝色的。",
  "I see a tree. The tree is tall. I see a flower.",
  "我看到一棵树。树很高。我看到一朵花。",
  "The tree is tall. The flower is beautiful. The river is long.",
  "树很高。花很漂亮。河很长。");

export const DAY_21 = createWeekLesson(21, "Questions", "疑问句",
  [
    { word: "what", ipa: "/wɒt/", chineseMeaning: "什么", example: "What is this?", exampleChinese: "这是什么？", memoryHint: "沃特" },
    { word: "where", ipa: "/wɛr/", chineseMeaning: "哪里", example: "Where is my book?", exampleChinese: "我的书在哪里？", memoryHint: "威尔" },
    { word: "who", ipa: "/huː/", chineseMeaning: "谁", example: "Who is she?", exampleChinese: "她是谁？", memoryHint: "呼" },
    { word: "when", ipa: "/wɛn/", chineseMeaning: "什么时候", example: "When is the party?", exampleChinese: "派对什么时候？", memoryHint: "温" },
    { word: "why", ipa: "/waɪ/", chineseMeaning: "为什么", example: "Why are you sad?", exampleChinese: "你为什么伤心？", memoryHint: "歪" },
    { word: "how", ipa: "/haʊ/", chineseMeaning: "怎么", example: "How are you?", exampleChinese: "你好吗？", memoryHint: "好" },
  ],
  "Question word + is/are + subject?",
  "疑问词 + is/are + 主语？",
  [{ correct: "What is this?", chinese: "这是什么？" }, { correct: "Where is my book?", chinese: "我的书在哪里？" }],
  "What is this? Where is my book? Who is she?",
  "这是什么？我的书在哪里？她是谁？",
  "What is your name? Where are you? How are you?",
  "你叫什么名字？你在哪里？你好吗？",
  "What is this? It is a book. Where is the book?",
  "这是什么？是一本书。书在哪里？");

export const DAY_22 = createWeekLesson(22, "Numbers 11-20", "数字 11-20",
  [
    { word: "eleven", ipa: "/ɪˈlɛvən/", chineseMeaning: "十一", example: "I have eleven books.", exampleChinese: "我有十一本书。", memoryHint: "一来文" },
    { word: "twelve", ipa: "/twɛlv/", chineseMeaning: "十二", example: "There are twelve months.", exampleChinese: "有十二个月。", memoryHint: "推欧" },
    { word: "thirteen", ipa: "/ˌθɜːrˈtiːn/", chineseMeaning: "十三", example: "I am thirteen.", exampleChinese: "我十三岁了。", memoryHint: "瑟汀" },
    { word: "fourteen", ipa: "/ˌfɔːrˈtiːn/", chineseMeaning: "十四", example: "Fourteen days.", exampleChinese: "十四天。", memoryHint: "佛汀" },
    { word: "fifteen", ipa: "/ˌfɪfˈtiːn/", chineseMeaning: "十五", example: "Fifteen minutes.", exampleChinese: "十五分钟。", memoryHint: "费夫汀" },
    { word: "twenty", ipa: "/ˈtwɛnti/", chineseMeaning: "二十", example: "I have twenty.", exampleChinese: "我有二十。", memoryHint: "吞提" },
  ],
  "Numbers 11-20",
  "数字 11-20",
  [{ correct: "I have eleven.", chinese: "我有十一。" }, { correct: "There are twelve.", chinese: "有十二。" }],
  "Eleven, twelve, thirteen, fourteen, fifteen.",
  "十一，十二，十三，十四，十五。",
  "I have eleven books. I am thirteen years old.",
  "我有十一本书。我十三岁了。",
  "Eleven, twelve, thirteen, fourteen, fifteen, twenty.",
  "十一，十二，十三，十四，十五，二十。");

export const DAY_23 = createWeekLesson(23, "Negatives", "否定句",
  [
    { word: "not", ipa: "/nɒt/", chineseMeaning: "不", example: "I am not tired.", exampleChinese: "我不累。", memoryHint: "闹特" },
    { word: "no", ipa: "/noʊ/", chineseMeaning: "不", example: "No, thank you.", exampleChinese: "不，谢谢。", memoryHint: "诺" },
    { word: "don't", ipa: "/doʊnt/", chineseMeaning: "不要", example: "I don't know.", exampleChinese: "我不知道。", memoryHint: "栋特" },
    { word: "can't", ipa: "/kænt/", chineseMeaning: "不能", example: "I can't swim.", exampleChinese: "我不会游泳。", memoryHint: "坎特" },
    { word: "isn't", ipa: "/ˈɪzənt/", chineseMeaning: "不是", example: "It isn't big.", exampleChinese: "它不大。", memoryHint: "伊曾特" },
    { word: "aren't", ipa: "/ɑːrnt/", chineseMeaning: "不是", example: "They aren't here.", exampleChinese: "他们不在这里。", memoryHint: "阿恩特" },
  ],
  "Subject + be + not + adjective",
  "主语 + be + not + 形容词",
  [{ correct: "I am not tired.", chinese: "我不累。" }, { correct: "It isn't big.", chinese: "它不大。" }],
  "I am not tired. It isn't big. They aren't here.",
  "我不累。它不大。他们不在这里。",
  "I am not sick. I can't swim. I don't like rain.",
  "我没生病。我不会游泳。我不喜欢下雨。",
  "I am not tired. I can't swim. It isn't cold.",
  "我不累。我不会游泳。天气不冷。");

export const DAY_24 = createWeekLesson(24, "Comparatives", "比较级",
  [
    { word: "bigger", ipa: "/ˈbɪɡər/", chineseMeaning: "更大的", example: "This is bigger.", exampleChinese: "这个更大。", memoryHint: "比格" },
    { word: "smaller", ipa: "/ˈsmɔːlər/", chineseMeaning: "更小的", example: "That is smaller.", exampleChinese: "那个更小。", memoryHint: "斯莫" },
    { word: "taller", ipa: "/ˈtɔːlər/", chineseMeaning: "更高的", example: "He is taller.", exampleChinese: "他更高。", memoryHint: "涛" },
    { word: "shorter", ipa: "/ˈʃɔːrtər/", chineseMeaning: "更矮的", example: "She is shorter.", exampleChinese: "她更矮。", memoryHint: "烧特" },
    { word: "faster", ipa: "/ˈfæstər/", chineseMeaning: "更快的", example: "This is faster.", exampleChinese: "这个更快。", memoryHint: "法斯特" },
    { word: "slower", ipa: "/ˈsloʊər/", chineseMeaning: "更慢的", example: "That is slower.", exampleChinese: "那个更慢。", memoryHint: "斯楼" },
  ],
  "A is + comparative + than B",
  "A is + 比较级 + than B",
  [{ correct: "He is taller than me.", chinese: "他比我高。" }, { correct: "This is faster than that.", chinese: "这个比那个快。" }],
  "He is taller than me. This is bigger than that.",
  "他比我高。这个比那个大。",
  "I am taller than my brother. This car is faster.",
  "我比我兄弟高。这辆车更快。",
  "He is taller. This is bigger. That is faster.",
  "他更高。这个更大。那个更快。");

export const DAY_25 = createWeekLesson(25, "Past Tense", "过去时",
  [
    { word: "went", ipa: "/wɛnt/", chineseMeaning: "去了", example: "I went to school.", exampleChinese: "我去上学了。", memoryHint: "温特" },
    { word: "ate", ipa: "/eɪt/", chineseMeaning: "吃了", example: "I ate breakfast.", exampleChinese: "我吃早餐了。", memoryHint: "诶特" },
    { word: "drank", ipa: "/dræŋk/", chineseMeaning: "喝了", example: "I drank water.", exampleChinese: "我喝水了。", memoryHint: "准克" },
    { word: "saw", ipa: "/sɔː/", chineseMeaning: "看到了", example: "I saw a bird.", exampleChinese: "我看到了一只鸟。", memoryHint: "索" },
    { word: "had", ipa: "/hæd/", chineseMeaning: "有了", example: "I had fun.", exampleChinese: "我玩得很开心。", memoryHint: "嗨的" },
    { word: "was", ipa: "/wɒz/", chineseMeaning: "是（过去）", example: "I was happy.", exampleChinese: "我很开心。", memoryHint: "沃兹" },
  ],
  "Subject + past tense verb",
  "主语 + 过去式动词",
  [{ correct: "I went to school.", chinese: "我去上学了。" }, { correct: "I ate breakfast.", chinese: "我吃早餐了。" }],
  "I went to school. I ate breakfast. I saw a bird.",
  "我去上学了。我吃早餐了。我看到了一只鸟。",
  "I went to the park. I saw a dog. I had fun.",
  "我去了公园。我看到了一只狗。我玩得很开心。",
  "I went to school. I ate lunch. I saw my friend.",
  "我去上学了。我吃了午餐。我看到了我的朋友。");

export const DAY_26 = createWeekLesson(26, "Future Tense", "将来时",
  [
    { word: "will", ipa: "/wɪl/", chineseMeaning: "将要", example: "I will go.", exampleChinese: "我将要去。", memoryHint: "威" },
    { word: "tomorrow", ipa: "/təˈmɒroʊ/", chineseMeaning: "明天", example: "I will go tomorrow.", exampleChinese: "我明天去。", memoryHint: "特莫肉" },
    { word: "soon", ipa: "/suːn/", chineseMeaning: "很快", example: "I will come soon.", exampleChinese: "我很快就来。", memoryHint: "孙" },
    { word: "later", ipa: "/ˈleɪtər/", chineseMeaning: "稍后", example: "I will do it later.", exampleChinese: "我稍后做。", memoryHint: "累特" },
    { word: "next", ipa: "/nɛkst/", chineseMeaning: "下一个", example: "I will go next week.", exampleChinese: "我下周去。", memoryHint: "耐克斯特" },
    { word: "party", ipa: "/ˈpɑːrti/", chineseMeaning: "派对", example: "I will go to the party.", exampleChinese: "我去派对。", memoryHint: "帕提" },
  ],
  "Subject + will + verb",
  "主语 + will + 动词",
  [{ correct: "I will go tomorrow.", chinese: "我明天去。" }, { correct: "I will come soon.", chinese: "我很快就来。" }],
  "I will go tomorrow. I will come soon. I will see you.",
  "我明天去。我很快就来。我会见到你。",
  "I will go to school. I will see my friend. I will have fun.",
  "我去上学。我会见到我的朋友。我会玩得很开心。",
  "I will go tomorrow. I will eat lunch. I will read a book.",
  "我明天去。我会吃午餐。我会读一本书。");

export const DAY_27 = createWeekLesson(27, "Prepositions Extended", "扩展介词",
  [
    { word: "under", ipa: "/ˈʌndər/", chineseMeaning: "在...下面", example: "The cat is under the table.", exampleChinese: "猫在桌子下面。", memoryHint: "安的" },
    { word: "over", ipa: "/ˈoʊvər/", chineseMeaning: "在...上面", example: "The bird is over the tree.", exampleChinese: "鸟在树上面。", memoryHint: "欧沃" },
    { word: "between", ipa: "/bɪˈtwiːn/", chineseMeaning: "在...之间", example: "The book is between two boxes.", exampleChinese: "书在两个盒子之间。", memoryHint: "比特温" },
    { word: "behind", ipa: "/bɪˈhaɪnd/", chineseMeaning: "在...后面", example: "The dog is behind the door.", exampleChinese: "狗在门后面。", memoryHint: "比特海恩的" },
    { word: "next to", ipa: "/nɛkst tuː/", chineseMeaning: "在...旁边", example: "I sit next to Tom.", exampleChinese: "我坐在Tom旁边。", memoryHint: "耐克斯特 图" },
    { word: "near", ipa: "/nɪr/", chineseMeaning: "在...附近", example: "I live near the school.", exampleChinese: "我住在学校附近。", memoryHint: "尼尔" },
  ],
  "Noun + preposition + noun",
  "名词 + 介词 + 名词",
  [{ correct: "The cat is under the table.", chinese: "猫在桌子下面。" }, { correct: "I sit next to Tom.", chinese: "我坐在Tom旁边。" }],
  "The cat is under the table. I sit next to Tom.",
  "猫在桌子下面。我坐在Tom旁边。",
  "The book is on the table. The cat is under the table.",
  "书在桌子上。猫在桌子下面。",
  "The cat is under the table. The book is on the table.",
  "猫在桌子下面。书在桌子上。");

export const DAY_28 = createWeekLesson(28, "Possessives", "所有格",
  [
    { word: "my", ipa: "/maɪ/", chineseMeaning: "我的", example: "This is my book.", exampleChinese: "这是我的书。", memoryHint: "买" },
    { word: "your", ipa: "/jɔːr/", chineseMeaning: "你的", example: "This is your book.", exampleChinese: "这是你的书。", memoryHint: "优尔" },
    { word: "his", ipa: "/hɪz/", chineseMeaning: "他的", example: "This is his book.", exampleChinese: "这是他的书。", memoryHint: "黑兹" },
    { word: "her", ipa: "/hɜːr/", chineseMeaning: "她的", example: "This is her book.", exampleChinese: "这是她的书。", memoryHint: "赫" },
    { word: "our", ipa: "/aʊər/", chineseMeaning: "我们的", example: "This is our school.", exampleChinese: "这是我们的学校。", memoryHint: "奥尔" },
    { word: "their", ipa: "/ðɛr/", chineseMeaning: "他们的", example: "This is their house.", exampleChinese: "这是他们的房子。", memoryHint: "贼尔" },
  ],
  "possessive + noun",
  "所有格 + 名词",
  [{ correct: "This is my book.", chinese: "这是我的书。" }, { correct: "This is her cat.", chinese: "这是她的猫。" }],
  "This is my book. This is your cat. This is his car.",
  "这是我的书。这是你的猫。这是他的车。",
  "My name is Tom. Your name is Lisa. His name is Jack.",
  "我的名字是Tom。你的名字是Lisa。他的名字是Jack。",
  "This is my book. That is your cat. This is his dog.",
  "这是我的书。那是你的猫。这是他的狗。");

export const DAY_29: DailyLesson = {
  id: "lesson_day_29", dayId: "day_29",
  activities: [
    reviewAct("a1", "Month Review: Vocabulary", "月度复习：词汇", 40, [
      { word: "hello", chineseMeaning: "你好" }, { word: "water", chineseMeaning: "水" }, { word: "head", chineseMeaning: "头" },
      { word: "mother", chineseMeaning: "母亲" }, { word: "school", chineseMeaning: "学校" }, { word: "morning", chineseMeaning: "早上" },
      { word: "teacher", chineseMeaning: "老师" }, { word: "book", chineseMeaning: "书" }, { word: "big", chineseMeaning: "大的" },
      { word: "cat", chineseMeaning: "猫" }, { word: "run", chineseMeaning: "跑" }, { word: "happy", chineseMeaning: "开心的" },
    ]),
    reviewAct("a2", "Month Review: Grammar", "月度复习：语法", 40, [
      { word: "am", chineseMeaning: "是（I）" }, { word: "is", chineseMeaning: "是（he/she/it）" }, { word: "are", chineseMeaning: "是（you/we/they）" },
      { word: "like", chineseMeaning: "喜欢" }, { word: "want", chineseMeaning: "想要" }, { word: "have", chineseMeaning: "有" },
      { word: "can", chineseMeaning: "会" }, { word: "will", chineseMeaning: "将要" }, { word: "not", chineseMeaning: "不" },
    ]),
    vocabAct("a3", "Review: Numbers", "复习：数字", 25,
      [
        { word: "one", ipa: "/wʌn/", chineseMeaning: "一", example: "One cat.", exampleChinese: "一只猫。" },
        { word: "five", ipa: "/faɪv/", chineseMeaning: "五", example: "Five stars.", exampleChinese: "五颗星。" },
        { word: "ten", ipa: "/tɛn/", chineseMeaning: "十", example: "Ten fingers.", exampleChinese: "十根手指。" },
        { word: "twenty", ipa: "/ˈtwɛnti/", chineseMeaning: "二十", example: "Twenty days.", exampleChinese: "二十天。" },
      ]),
    vocabAct("a4", "Review: Colors", "复习：颜色", 20,
      [
        { word: "red", ipa: "/rɛd/", chineseMeaning: "红色", example: "Red apple.", exampleChinese: "红色的苹果。" },
        { word: "blue", ipa: "/bluː/", chineseMeaning: "蓝色", example: "Blue sky.", exampleChinese: "蓝色的天空。" },
        { word: "green", ipa: "/ɡriːn/", chineseMeaning: "绿色", example: "Green grass.", exampleChinese: "绿色的草。" },
        { word: "yellow", ipa: "/ˈjɛloʊ/", chineseMeaning: "黄色", example: "Yellow sun.", exampleChinese: "黄色的太阳。" },
      ]),
    listeningAct("a5", "Month Review Listening", "月度听力复习", 30, "I am Tom. I like water. I have two eyes. I can run. This is my family.", "我是Tom。我喜欢水。我有两只眼睛。我会跑步。这是我的家庭。"),
    speakingAct("a6", "Month Review Speaking", "月度口语复习", 35, "Hello, I am Tom. I am a student. I like English. I can read and write.", "你好，我是Tom。我是学生。我喜欢英语。我会读和写。"),
    reviewAct("a7", "Day 29 Final Review", "第二十九天最终复习", 30, [
      { word: "hello", chineseMeaning: "你好" }, { word: "water", chineseMeaning: "水" }, { word: "mother", chineseMeaning: "母亲" },
      { word: "school", chineseMeaning: "学校" }, { word: "happy", chineseMeaning: "开心的" }, { word: "cat", chineseMeaning: "猫" },
    ]),
  ],
  vocabulary: { words: ["hello", "water", "mother", "school", "teacher", "book", "big", "happy", "cat", "run"], exercises: [] },
  grammar: { pointId: "month_review", explanation: { english: "Month Review", chinese: "月度复习" }, examples: [{ correct: "I am a student.", chinese: "我是学生。" }], exercises: [] },
  listening: { audioUrl: "", transcript: "I am Tom.", chineseTranscript: "我是Tom。", speed: "slow", questions: [] },
  speaking: { scenario: "Month Review", chineseScenario: "月度复习", dialogue: [{ speaker: "model", english: "I am Tom.", chinese: "我是Tom。" }], practicePrompts: ["Introduce yourself"] },
  reading: { text: "I am Tom. I am a student.", chineseTranslation: "我是Tom。我是学生。", level: "controlled", questions: [] },
  writing: { type: "guided", prompt: "Write about yourself.", chinesePrompt: "写关于你自己。", example: "I am Tom. I am a student.", wordBank: ["I am", "I like", "I have", "I can"] },
  review: { srsReview: true, wordReview: ["hello", "water", "mother", "school"], grammarReview: ["month_review"] },
  totalDuration: 240, createdAt: Date.now(), updatedAt: Date.now(),
};

export const DAY_30: DailyLesson = {
  id: "lesson_day_30", dayId: "day_30",
  activities: [
    reviewAct("a1", "Final Review", "最终复习", 40, [
      { word: "hello", chineseMeaning: "你好" }, { word: "water", chineseMeaning: "水" }, { word: "head", chineseMeaning: "头" },
      { word: "mother", chineseMeaning: "母亲" }, { word: "school", chineseMeaning: "学校" }, { word: "morning", chineseMeaning: "早上" },
    ]),
    reviewAct("a2", "Grammar Final Review", "语法最终复习", 30, [
      { word: "I am", chineseMeaning: "我是" }, { word: "I like", chineseMeaning: "我喜欢" }, { word: "I have", chineseMeaning: "我有" },
      { word: "I can", chineseMeaning: "我会" }, { word: "I will", chineseMeaning: "我将要" }, { word: "This is", chineseMeaning: "这是" },
    ]),
    act("a3", "assessment", "CEFR A1 Assessment", "CEFR A1 测试", 100,
      "Final assessment for Month 1", "第一个月最终测试",
      { reviewItems: [] }),
    listeningAct("a4", "Final Listening", "最终听力", 25, "I am Tom. I am a student. I like English. I have a family. I can read and write.", "我是Tom。我是学生。我喜欢英语。我有一个家庭。我会读和写。"),
    speakingAct("a5", "Final Speaking", "最终口语", 25, "Hello, my name is Tom. I am a student. I like English. I can speak a little English.", "你好，我的名字是Tom。我是学生。我喜欢英语。我会说一点英语。"),
    reviewAct("a6", "Congratulations", "恭喜完成", 20, [
      { word: "congratulations", chineseMeaning: "恭喜" }, { word: "achievement", chineseMeaning: "成就" }, { word: "progress", chineseMeaning: "进步" },
    ]),
  ],
  vocabulary: { words: ["hello", "water", "mother", "school", "morning", "teacher", "book", "big", "happy", "cat", "run", "can", "will", "not"], exercises: [] },
  grammar: { pointId: "final_review", explanation: { english: "Final Review", chinese: "最终复习" }, examples: [{ correct: "I am a student.", chinese: "我是学生。" }], exercises: [] },
  listening: { audioUrl: "", transcript: "I am Tom.", chineseTranscript: "我是Tom。", speed: "slow", questions: [] },
  speaking: { scenario: "Final Assessment", chineseScenario: "最终测试", dialogue: [{ speaker: "model", english: "I am Tom.", chinese: "我是Tom。" }], practicePrompts: ["Introduce yourself"] },
  reading: { text: "I am Tom. I am a student. I like English.", chineseTranslation: "我是Tom。我是学生。我喜欢英语。", level: "controlled", questions: [] },
  writing: { type: "free", prompt: "Write about yourself and your English learning.", chinesePrompt: "写关于你自己和你的英语学习。", example: "I am Tom. I like English. I can read and write.", wordBank: ["I am", "I like", "I have", "I can", "I will"] },
  review: { srsReview: true, wordReview: ["hello", "water", "mother", "school"], grammarReview: ["final_review"] },
  totalDuration: 240, createdAt: Date.now(), updatedAt: Date.now(),
};

// ============================================================
// Export all lessons
// ============================================================

export const ALL_STAGE1_LESSONS: DailyLesson[] = [
  DAY_3, DAY_4, DAY_5, DAY_6, DAY_7,
  DAY_8, DAY_9, DAY_10, DAY_11, DAY_12, DAY_13, DAY_14,
  DAY_15, DAY_16, DAY_17, DAY_18, DAY_19, DAY_20, DAY_21,
  DAY_22, DAY_23, DAY_24, DAY_25, DAY_26, DAY_27, DAY_28,
  DAY_29, DAY_30,
];

export const getLessonByDayNumber = (dayNumber: number): DailyLesson | null => {
  return ALL_STAGE1_LESSONS.find(l => l.dayId === `day_${dayNumber}`) || null;
};
