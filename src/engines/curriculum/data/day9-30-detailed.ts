/**
 * Day 9-30 Detailed Curriculum
 *
 * Stage 1: Foundation (Weeks 2-4)
 * 300+ high frequency words total across Day 1-30
 */

import type { Day1Curriculum } from "./day1-detailed";

// Helper to create a day curriculum
function d(
  day: number, title: string, titleCn: string,
  vocab: { id: string; word: string; ipa: string; chinese: string; chinesePronunciation: string; englishDefinition: string; example: string; exampleChinese: string; memoryMethod: string; difficulty: "easy" | "medium" | "hard" }[],
  listenTexts: { id: string; text: string; textChinese: string; transcript: string; transcriptChinese: string; questions: { question: string; questionChinese: string; options: string[]; correctAnswer: number }[] }[],
  speakSentences: { id: string; modelSentence: string; modelSentenceChinese: string; ipa: string; shadowingPoints: string[]; commonMistakes: string[]; chineseHint: string }[],
  readTitle: string, readContent: string, readChinese: string, readVocab: string[],
  writeTask: string, writeTaskCn: string, writeExample: string,
  assessmentQs: { question: string; questionChinese: string; type: "multiple_choice" | "fill_blank"; correctAnswer: string; explanation: string; explanationChinese: string; options?: string[] }[],
): Day1Curriculum {
  return {
    day, title, titleChinese: titleCn,
    objectives: [`Learn ${vocab.length} new words`, `Practice listening and speaking`],
    objectivesChinese: [`学习${vocab.length}个新单词`, `练习听力和口语`],
    totalMinutes: 240,
    vocabulary: vocab, phonics: [],
    listening: listenTexts.map(l => ({
      ...l, audioSpeed: "slow" as const, transcript: l.text, transcriptChinese: l.textChinese,
    })),
    speaking: speakSentences,
    reading: [{ id: `r${day}`, title: readTitle, titleChinese: readTitle, content: readContent, contentChinese: readChinese, vocabulary: readVocab, questions: [] }],
    writing: [{ id: `w${day}`, task: writeTask, taskChinese: writeTaskCn, hints: [], example: writeExample, exampleChinese: "" }],
    review: [{ type: "vocabulary" as const, duration: 30, description: "Review today's vocabulary", descriptionChinese: "复习今天学的词汇" }],
    assessment: { type: "quiz" as const, duration: 15, questions: assessmentQs },
  };
}

function v(id: string, word: string, ipa: string, cn: string, hint: string, def: string, ex: string, exCn: string, mem: string, diff: "easy" | "medium" | "hard" = "easy") {
  return { id, word, ipa, chinese: cn, chinesePronunciation: hint, englishDefinition: def, example: ex, exampleChinese: exCn, memoryMethod: mem, difficulty: diff };
}

function l(id: string, text: string, cn: string, qs: { question: string; questionChinese: string; options: string[]; correctAnswer: number }[]) {
  return { id, text, textChinese: cn, transcript: text, transcriptChinese: cn, questions: qs };
}

function s(id: string, sentence: string, cn: string, ipa: string, points: string[], mistakes: string[], hint: string) {
  return { id, modelSentence: sentence, modelSentenceChinese: cn, ipa, shadowingPoints: points, commonMistakes: mistakes, chineseHint: hint };
}

function q(question: string, cn: string, answer: string, options: string[], expl: string, explCn: string) {
  return { question, questionChinese: cn, type: "multiple_choice" as const, correctAnswer: answer, explanation: expl, explanationChinese: explCn, options };
}

// ============================================================
// Day 9: Common Nouns
// ============================================================
export const DAY_9 = d(9, "Common Nouns", "常见名词",
  [
    v("v9_1", "cat", "/kæt/", "猫", "凯特", "A small animal that says meow", "I have a cat.", "我有一只猫。", "谐音：凯特 → 猫咪凯特"),
    v("v9_2", "dog", "/dɒɡ/", "狗", "道格", "A pet that barks", "I have a dog.", "我有一只狗。", "谐音：道格 → 狗狗道格"),
    v("v9_3", "bird", "/bɜːrd/", "鸟", "伯的", "An animal that can fly", "The bird is singing.", "鸟在唱歌。", "联想：bird → 伯的 → 伯伯的鸟"),
    v("v9_4", "fish", "/fɪʃ/", "鱼", "费什", "An animal that lives in water", "I like fish.", "我喜欢鱼。", "谐音：费什 → 费事的鱼"),
    v("v9_5", "house", "/haʊs/", "房子", "浩斯", "A place where people live", "This is my house.", "这是我的房子。", "谐音：浩斯 → 好大的房子"),
    v("v9_6", "car", "/kɑːr/", "汽车", "卡", "A vehicle with four wheels", "I have a car.", "我有一辆车。", "谐音：卡 → 汽车"),
    v("v9_7", "book", "/bʊk/", "书", "不可", "Something you read", "I read a book.", "我读一本书。", "谐音：不可 → 书不可不读"),
    v("v9_8", "pen", "/pɛn/", "笔", "喷", "Something you write with", "I have a pen.", "我有一支笔。", "谐音：喷 → 笔喷墨水"),
  ],
  [
    l("l9_1", "This is a cat. It is small. I like cats.", "这是一只猫。它很小。我喜欢猫。", [
      { question: "What animal is it?", questionChinese: "这是什么动物？", options: ["cat", "dog", "bird"], correctAnswer: 0 },
    ]),
    l("l9_2", "I have a house. It is big. I love my house.", "我有一个房子。它很大。我爱我的房子。", [
      { question: "How is the house?", questionChinese: "房子怎么样？", options: ["small", "big", "old"], correctAnswer: 1 },
    ]),
  ],
  [
    s("s9_1", "This is a ___.", "这是一只___。", "/ðɪs ɪz ə/", ["This is", "a"], ["不要说 'This a'"], "介绍：This is a + 名词"),
    s("s9_2", "I have a ___.", "我有一只___。", "/aɪ hæv ə/", ["I have", "a"], ["不要省略 'a'"], "我有：I have a + 名词"),
  ],
  "My Pets", "I have a cat and a dog. The cat is small. The dog is big. I love my pets.", "我有一只猫和一只狗。猫很小。狗很大。我爱我的宠物。",
  ["cat", "dog", "big", "small", "love"],
  "Write 3 sentences about animals", "写3个关于动物的句子", "I have a cat. The cat is small. I like cats.",
  [q("What does 'cat' mean?", "'cat'是什么意思？", "猫", ["猫", "狗", "鸟"], "'Cat' is a small animal.", "'Cat'是一种小动物。")],
);

// ============================================================
// Day 10: Basic Verbs
// ============================================================
export const DAY_10 = d(10, "Basic Verbs", "基础动词",
  [
    v("v10_1", "go", "/ɡoʊ/", "去", "够", "To move to a place", "I go to school.", "我去学校。", "谐音：够 → 够了就去"),
    v("v10_2", "come", "/kʌm/", "来", "卡姆", "To move toward someone", "Come here, please.", "请过来。", "谐音：卡姆 → 卡车来了"),
    v("v10_3", "see", "/siː/", "看见", "西", "To look at something", "I see a bird.", "我看见一只鸟。", "谐音：西 → 看见夕阳"),
    v("v10_4", "eat", "/iːt/", "吃", "伊特", "To put food in your mouth", "I eat rice.", "我吃米饭。", "谐音：伊特 → 伊特吃了"),
    v("v10_5", "drink", "/drɪŋk/", "喝", "追恩克", "To take liquid", "I drink water.", "我喝水。", "谐音：追恩克 → 追着喝水"),
    v("v10_6", "sleep", "/sliːp/", "睡觉", "斯利普", "To rest at night", "I sleep at night.", "我晚上睡觉。", "联想：sleep → 斯利普 → 睡觉"),
    v("v10_7", "work", "/wɜːrk/", "工作", "沃克", "To do a job", "I go to work.", "我去上班。", "谐音：沃克 → 沃克工作"),
    v("v10_8", "play", "/pleɪ/", "玩", "普雷", "To have fun", "I play with friends.", "我和朋友玩。", "谐音：普雷 → 普雷在玩"),
  ],
  [
    l("l10_1", "I go to school. I eat lunch. I come home.", "我去学校。我吃午饭。我回家。", [
      { question: "What does the person do first?", questionChinese: "这个人先做什么？", options: ["eat", "go to school", "come home"], correctAnswer: 1 },
    ]),
    l("l10_2", "I work in the morning. I sleep at night.", "我早上工作。我晚上睡觉。", [
      { question: "When does the person sleep?", questionChinese: "这个人什么时候睡觉？", options: ["morning", "afternoon", "night"], correctAnswer: 2 },
    ]),
  ],
  [
    s("s10_1", "I ___ to school.", "我去学校。", "/aɪ tə/", ["I go", "to school"], ["不要说 'I go school'"], "去某地：go to + 地点"),
    s("s10_2", "I ___ water.", "我喝水。", "/aɪ drɪŋk/", ["I drink", "water"], ["drink 要发 /dr/"], "喝：drink + 饮料"),
  ],
  "My Day", "I wake up. I eat breakfast. I go to work. I come home. I sleep.", "我醒来。我吃早饭。我去上班。我回家。我睡觉。",
  ["go", "come", "eat", "drink", "sleep", "work"],
  "Write about your daily routine", "写你的日常", "I wake up. I eat breakfast. I go to work.",
  [q("What does 'eat' mean?", "'eat'是什么意思？", "吃", ["吃", "喝", "睡"], "'Eat' means to put food in your mouth.", "'Eat'意思是把食物放进嘴里。")],
);

// ============================================================
// Day 11: Adjectives
// ============================================================
export const DAY_11 = d(11, "Adjectives", "形容词",
  [
    v("v11_1", "big", "/bɪɡ/", "大的", "比格", "Large in size", "The house is big.", "房子很大。", "谐音：比格 → 比较大"),
    v("v11_2", "small", "/smɔːl/", "小的", "斯莫", "Little in size", "The cat is small.", "猫很小。", "谐音：斯莫 → 斯莫小"),
    v("v11_3", "good", "/ɡʊd/", "好的", "古德", "Of high quality", "This is good.", "这个很好。", "谐音：古德 → 古德好"),
    v("v11_4", "bad", "/bæd/", "坏的", "败的", "Not good", "That is bad.", "那个不好。", "谐音：败的 → 败的坏"),
    v("v11_5", "happy", "/ˈhæpi/", "开心的", "嗨皮", "Feeling joy", "I am happy.", "我很开心。", "谐音：嗨皮 → 嗨皮开心"),
    v("v11_6", "sad", "/sæd/", "伤心的", "赛的", "Feeling sorrow", "She is sad.", "她很伤心。", "谐音：赛的 → 比赛输了伤心"),
    v("v11_7", "hot", "/hɒt/", "热的", "浩特", "High temperature", "It is hot today.", "今天很热。", "谐音：浩特 → 好特热"),
    v("v11_8", "cold", "/koʊld/", "冷的", "扣的", "Low temperature", "It is cold today.", "今天很冷。", "谐音：扣的 → 冷得发抖"),
  ],
  [
    l("l11_1", "The house is big. The cat is small. I am happy.", "房子很大。猫很小。我很开心。", [
      { question: "How is the house?", questionChinese: "房子怎么样？", options: ["big", "small", "bad"], correctAnswer: 0 },
    ]),
    l("l11_2", "It is hot today. I am sad because I cannot go out.", "今天很热。我不能出去，所以很伤心。", [
      { question: "How is the weather?", questionChinese: "天气怎么样？", options: ["hot", "cold", "good"], correctAnswer: 0 },
      { question: "How is the person feeling?", questionChinese: "这个人感觉怎么样？", options: ["happy", "sad", "tired"], correctAnswer: 1 },
    ]),
  ],
  [
    s("s11_1", "It is ___.", "天气很___。", "/ɪt ɪz/", ["It is"], ["不要省略 'is'"], "描述天气：It is + 形容词"),
    s("s11_2", "I am ___.", "我很___。", "/aɪ æm/", ["I am"], ["不要说 'I happy'"], "描述感受：I am + 形容词"),
  ],
  "Weather Today", "It is hot today. The sun is big. I am happy. I play outside.", "今天很热。太阳很大。我很开心。我出去玩。",
  ["big", "small", "hot", "cold", "happy", "sad"],
  "Write 4 sentences using adjectives", "写4个使用形容词的句子", "It is hot. The house is big. I am happy.",
  [q("What does 'happy' mean?", "'happy'是什么意思？", "开心的", ["开心的", "伤心的", "热的"], "'Happy' means feeling joy.", "'Happy'意思是感到快乐。")],
);

// ============================================================
// Day 12: Food Words
// ============================================================
export const DAY_12 = d(12, "Food & Drinks", "食物和饮料",
  [
    v("v12_1", "water", "/ˈwɔːtər/", "水", "沃特", "The drink we need every day", "I want water.", "我想要水。", "谐音：沃特 → 沃特水"),
    v("v12_2", "rice", "/raɪs/", "米饭", "入爱斯", "White grain food", "I eat rice.", "我吃米饭。", "谐音：入爱斯 → 入爱斯米饭"),
    v("v12_3", "bread", "/brɛd/", "面包", "不来的", "Baked food", "I eat bread.", "我吃面包。", "联想：bread → 不来的 → 面包"),
    v("v12_4", "egg", "/ɛɡ/", "鸡蛋", "爱格", "Comes from a chicken", "I eat an egg.", "我吃一个鸡蛋。", "谐音：爱格 → 爱吃鸡蛋"),
    v("v12_5", "milk", "/mɪlk/", "牛奶", "米欧克", "White drink from cows", "I drink milk.", "我喝牛奶。", "谐音：米欧克 → 米欧克牛奶"),
    v("v12_6", "tea", "/tiː/", "茶", "提", "Hot drink from leaves", "I like tea.", "我喜欢茶。", "谐音：提 → 提神的茶"),
    v("v12_7", "coffee", "/ˈkɒfi/", "咖啡", "靠飞", "Brown hot drink", "I drink coffee.", "我喝咖啡。", "谐音：靠飞 → 靠咖啡飞起来"),
    v("v12_8", "apple", "/ˈæpəl/", "苹果", "爱剖", "A round red fruit", "I eat an apple.", "我吃一个苹果。", "谐音：爱剖 → 爱吃苹果"),
    v("v12_9", "banana", "/bəˈnænə/", "香蕉", "巴拿拿", "A yellow curved fruit", "I like bananas.", "我喜欢香蕉。", "谐音：巴拿拿 → 巴拿拿香蕉"),
    v("v12_10", "orange", "/ˈɒrɪndʒ/", "橙子", "奥润吉", "An orange fruit", "The orange is sweet.", "橙子很甜。", "谐音：奥润吉 → 橙色"),
  ],
  [
    l("l12_1", "I want water. I eat bread. I drink milk.", "我想要水。我吃面包。我喝牛奶。", [
      { question: "What does the person want?", questionChinese: "这个人想要什么？", options: ["water", "tea", "coffee"], correctAnswer: 0 },
    ]),
    l("l12_2", "I like rice. I like apples. I like bananas.", "我喜欢米饭。我喜欢苹果。我喜欢香蕉。", [
      { question: "What fruit does the person like?", questionChinese: "这个人喜欢什么水果？", options: ["rice", "apples", "bread"], correctAnswer: 1 },
    ]),
  ],
  [
    s("s12_1", "I want ___.", "我想要___。", "/aɪ wɒnt/", ["I want"], ["want 要发 /t/"], "想要：I want + 名词"),
    s("s12_2", "I like ___.", "我喜欢___。", "/aɪ laɪk/", ["I like"], ["like 后加名词"], "喜欢：I like + 名词"),
  ],
  "My Food", "I eat rice and bread. I drink water and milk. I like apples.", "我吃米饭和面包。我喝水和牛奶。我喜欢苹果。",
  ["water", "rice", "bread", "milk", "apple", "banana"],
  "Write your favorite food and drinks", "写你最喜欢的食物和饮料", "I like rice. I drink water.",
  [q("What does 'rice' mean?", "'rice'是什么意思？", "米饭", ["米饭", "面包", "鸡蛋"], "'Rice' is white grain food.", "'Rice'是白色谷物。")],
);

// ============================================================
// Day 13: Body Parts
// ============================================================
export const DAY_13 = d(13, "Body Parts", "身体部位",
  [
    v("v13_1", "head", "/hɛd/", "头", "黑的", "The top of your body", "Touch your head.", "摸摸你的头。", "谐音：黑的 → 头发是黑的"),
    v("v13_2", "eye", "/aɪ/", "眼睛", "爱", "You see with your eyes", "I have two eyes.", "我有两只眼睛。", "谐音：爱 → 爱你的眼睛"),
    v("v13_3", "ear", "/ɪr/", "耳朵", "伊尔", "You hear with your ears", "I have two ears.", "我有两只耳朵。", "谐音：伊尔 → 耳朵"),
    v("v13_4", "nose", "/noʊz/", "鼻子", "诺兹", "You smell with your nose", "I have one nose.", "我有一个鼻子。", "谐音：诺兹 → 诺兹鼻子"),
    v("v13_5", "mouth", "/maʊθ/", "嘴巴", "毛斯", "You eat and talk with your mouth", "Open your mouth.", "张开你的嘴巴。", "谐音：毛斯 → 嘴巴"),
    v("v13_6", "hand", "/hænd/", "手", "汉的", "You wave with your hand", "Raise your hand.", "举手。", "谐音：汉的 → 汉子的手"),
    v("v13_7", "arm", "/ɑːrm/", "手臂", "阿姆", "Between shoulder and hand", "I have two arms.", "我有两只手臂。", "谐音：阿姆 → 手臂"),
    v("v13_8", "leg", "/lɛɡ/", "腿", "莱格", "You walk with your legs", "My leg hurts.", "我的腿疼。", "谐音：莱格 → 腿"),
    v("v13_9", "foot", "/fʊt/", "脚", "富特", "At the bottom of your leg", "I have two feet.", "我有两只脚。", "谐音：富特 → 富特球鞋"),
    v("v13_10", "face", "/feɪs/", "脸", "费斯", "The front of your head", "Wash your face.", "洗脸。", "谐音：费斯 → 费斯脸"),
  ],
  [
    l("l13_1", "I have two eyes and one nose. I have two ears.", "我有两只眼睛和一个鼻子。我有两只耳朵。", [
      { question: "How many eyes?", questionChinese: "几只眼睛？", options: ["one", "two", "three"], correctAnswer: 1 },
    ]),
    l("l13_2", "Touch your head. Open your mouth. Raise your hand.", "摸摸你的头。张开你的嘴巴。举手。", [
      { question: "What should you touch?", questionChinese: "你应该摸什么？", options: ["head", "leg", "foot"], correctAnswer: 0 },
    ]),
  ],
  [
    s("s13_1", "I have ___ ___.", "我有___个___。", "/aɪ hæv/", ["I have"], ["注意复数"], "我有：I have + 数量 + 名词"),
    s("s13_2", "Touch your ___.", "摸摸你的___。", "/tʌtʃ jɔːr/", ["Touch your"], ["不要省略 'your'"], "触摸：Touch your + 身体部位"),
  ],
  "My Body", "I have a head. I have two eyes and one nose. I have two hands.", "我有一个头。我有两只眼睛和一个鼻子。我有两只手。",
  ["head", "eye", "ear", "nose", "mouth", "hand"],
  "Write 5 sentences about your body", "写5个关于身体的句子", "I have two eyes. I have one nose.",
  [q("What does 'eye' mean?", "'eye'是什么意思？", "眼睛", ["眼睛", "耳朵", "鼻子"], "'Eye' is what you see with.", "'Eye'是你用来看东西的。")],
);

// ============================================================
// Day 14: Week 2 Review
// ============================================================
export const DAY_14 = d(14, "Week 2 Review", "第二周复习",
  [
    v("v14_1", "want", "/wɒnt/", "想要", "旺特", "To desire something", "I want a book.", "我想要一本书。", "谐音：旺特 → 旺盛的想要"),
    v("v14_2", "need", "/niːd/", "需要", "尼的", "To require something", "I need water.", "我需要水。", "谐音：尼的 → 你的需要"),
    v("v14_3", "like", "/laɪk/", "喜欢", "莱克", "To enjoy something", "I like English.", "我喜欢英语。", "谐音：莱克 → 莱克喜欢"),
    v("v14_4", "have", "/hæv/", "有", "汉夫", "To possess", "I have a cat.", "我有一只猫。", "谐音：汉夫 → 汉夫有"),
    v("v14_5", "can", "/kæn/", "能", "肯", "To be able to", "I can swim.", "我会游泳。", "谐音：肯 → 肯定能"),
    v("v14_6", "make", "/meɪk/", "做", "美克", "To create", "I make food.", "我做饭。", "谐音：美克 → 美克做"),
    v("v14_7", "give", "/ɡɪv/", "给", "给吾", "To hand something to someone", "Give me water.", "给我水。", "谐音：给吾 → 给我"),
    v("v14_8", "take", "/teɪk/", "拿", "忒克", "To get something", "Take this book.", "拿这本书。", "谐音：忒克 → 忒克拿"),
  ],
  [
    l("l14_1", "I want water. I need food. I like rice.", "我想要水。我需要食物。我喜欢米饭。", [
      { question: "What does the person need?", questionChinese: "这个人需要什么？", options: ["water", "food", "rice"], correctAnswer: 1 },
    ]),
    l("l14_2", "I have a cat. I can see a bird. I give the cat food.", "我有一只猫。我能看见一只鸟。我给猫食物。", [
      { question: "What animal does the person have?", questionChinese: "这个人有什么动物？", options: ["cat", "dog", "bird"], correctAnswer: 0 },
    ]),
  ],
  [
    s("s14_1", "I want to ___.", "我想要___。", "/aɪ wɒnt tə/", ["I want to"], ["want + to + 动词原形"], "想要做某事：want to + 动词"),
    s("s14_2", "I can ___.", "我能___。", "/aɪ kæn/", ["I can"], ["can + 动词原形"], "能做某事：can + 动词"),
  ],
  "My Pets and Food", "I have a cat. The cat is small. I give the cat food. The cat likes fish.", "我有一只猫。猫很小。我给猫食物。猫喜欢鱼。",
  ["want", "need", "like", "have", "can", "give"],
  "Write about what you want and need", "写你想要和需要的东西", "I want water. I need food. I like rice.",
  [q("What does 'need' mean?", "'need'是什么意思？", "需要", ["需要", "想要", "喜欢"], "'Need' means to require something.", "'Need'意思是需要某物。")],
);

// ============================================================
// Day 15: Question Words
// ============================================================
export const DAY_15 = d(15, "Question Words", "疑问词",
  [
    v("v15_1", "what", "/wʌt/", "什么", "瓦特", "Used to ask about things", "What is this?", "这是什么？", "谐音：瓦特 → 瓦特发明了什么"),
    v("v15_2", "who", "/huː/", "谁", "呼", "Used to ask about people", "Who is she?", "她是谁？", "谐音：呼 → 谁在呼叫"),
    v("v15_3", "where", "/wɛr/", "哪里", "歪尔", "Used to ask about place", "Where is my book?", "我的书在哪里？", "联想：where → 歪尔 → 歪尔在哪里"),
    v("v15_4", "when", "/wɛn/", "什么时候", "问", "Used to ask about time", "When is the class?", "课什么时候？", "谐音：问 → 问什么时候"),
    v("v15_5", "why", "/waɪ/", "为什么", "歪", "Used to ask about reason", "Why are you happy?", "你为什么开心？", "谐音：歪 → 为什么是歪的"),
    v("v15_6", "how", "/haʊ/", "怎么", "浩", "Used to ask about way/manner", "How are you?", "你好吗？", "谐音：浩 → 怎么浩"),
    v("v15_7", "which", "/wɪtʃ/", "哪个", "维奇", "Used to ask about choice", "Which one do you want?", "你想要哪个？", "联想：which → 奇克 → 哪个奇怪"),
    v("v15_8", "much", "/mʌtʃ/", "多少", "麻吃", "Used to ask about amount", "How much is this?", "这个多少钱？", "联想：much → 麻吃 → 多少"),
  ],
  [
    l("l15_1", "What is this? It is a book. Who is she? She is my mother.", "这是什么？这是一本书。她是谁？她是我妈妈。", [
      { question: "What is 'this'?", questionChinese: "'this'是什么？", options: ["book", "pen", "cat"], correctAnswer: 0 },
      { question: "Who is 'she'?", questionChinese: "'she'是谁？", options: ["sister", "mother", "friend"], correctAnswer: 1 },
    ]),
    l("l15_2", "Where is my cat? It is under the table. How are you? I am fine.", "我的猫在哪里？在桌子下面。你好吗？我很好。", [
      { question: "Where is the cat?", questionChinese: "猫在哪里？", options: ["on the table", "under the table", "in the box"], correctAnswer: 1 },
    ]),
  ],
  [
    s("s15_1", "What is this?", "这是什么？", "/wʌt ɪz ðɪs/", ["What is", "this"], ["不要说 'What this is'"], "问什么：What is this?"),
    s("s15_2", "Where is my ___?", "我的___在哪里？", "/wɛr ɪz maɪ/", ["Where is", "my"], ["注意语序"], "问哪里：Where is + 东西?"),
  ],
  "Questions", "What is this? It is a pen. Where is my book? Who is she? She is my friend.", "这是什么？这是一支笔。我的书在哪里？她是谁？她是我的朋友。",
  ["what", "who", "where", "when", "why", "how"],
  "Write 5 questions", "写5个问题", "What is this? Where is my book? Who is she?",
  [q("What does 'where' mean?", "'where'是什么意思？", "哪里", ["哪里", "什么", "谁"], "'Where' asks about place.", "'Where'问地点。")],
);

// ============================================================
// Day 16: Prepositions
// ============================================================
export const DAY_16 = d(16, "Prepositions", "介词",
  [
    v("v16_1", "in", "/ɪn/", "在...里面", "因", "Inside something", "The cat is in the box.", "猫在盒子里面。", "谐音：因 → 在里面"),
    v("v16_2", "on", "/ɒn/", "在...上面", "昂", "On top of something", "The book is on the table.", "书在桌子上。", "谐音：昂 → 在上面昂"),
    v("v16_3", "under", "/ˈʌndər/", "在...下面", "安德", "Below something", "The cat is under the table.", "猫在桌子下面。", "联想：under → 安德 → 在下面"),
    v("v16_4", "with", "/wɪð/", "和...一起", "威兹", "Together with someone", "I play with friends.", "我和朋友一起玩。", "谐音：威兹 → 和朋友一起"),
    v("v16_5", "for", "/fɔːr/", "为了", "佛", "For the benefit of", "This is for you.", "这是给你的。", "谐音：佛 → 为了你"),
    v("v16_6", "to", "/tuː/", "到", "图", "Toward a place", "I go to school.", "我去学校。", "谐音：图 → 到达"),
    v("v16_7", "from", "/frɒm/", "从", "弗洛姆", "Starting point", "I am from China.", "我来自中国。", "谐音：弗洛姆 → 从"),
    v("v16_8", "at", "/æt/", "在", "艾特", "At a specific point", "I am at home.", "我在家里。", "谐音：艾特 → 在"),
  ],
  [
    l("l16_1", "The cat is in the box. The book is on the table.", "猫在盒子里面。书在桌子上。", [
      { question: "Where is the cat?", questionChinese: "猫在哪里？", options: ["in the box", "on the table", "under the chair"], correctAnswer: 0 },
    ]),
    l("l16_2", "I go to school. I am from China. This is for you.", "我去学校。我来自中国。这是给你的。", [
      { question: "Where does the person go?", questionChinese: "这个人去哪里？", options: ["home", "school", "store"], correctAnswer: 1 },
    ]),
  ],
  [
    s("s16_1", "The ___ is ___ the ___.", "___在___的___。", "/ðə ɪz/", ["The", "is"], ["注意介词位置"], "位置：The + 名词 + is + 介词 + 地点"),
    s("s16_2", "I go ___ school.", "我去学校。", "/aɪ ɡoʊ tə/", ["go to"], ["go to + 地点"], "去某地：go to + 地点"),
  ],
  "My Room", "The book is on the table. The cat is under the table. I am in my room.", "书在桌子上。猫在桌子下面。我在我的房间里。",
  ["in", "on", "under", "with", "to", "from"],
  "Write 5 sentences with prepositions", "写5个使用介词的句子", "The cat is in the box. I go to school.",
  [q("What does 'under' mean?", "'under'是什么意思？", "在...下面", ["在...下面", "在...上面", "在...里面"], "'Under' means below something.", "'Under'意思是某物下面。")],
);

// ============================================================
// Day 17: Time Words
// ============================================================
export const DAY_17 = d(17, "Time Words", "时间词汇",
  [
    v("v17_1", "time", "/taɪm/", "时间", "太姆", "The measurement of hours", "What time is it?", "现在几点？", "谐音：太姆 → 时间"),
    v("v17_2", "day", "/deɪ/", "一天", "对", "24 hours", "Today is a good day.", "今天是美好的一天。", "谐音：对 → 对的一天"),
    v("v17_3", "night", "/naɪt/", "晚上", "乃特", "When it is dark", "I sleep at night.", "我晚上睡觉。", "谐音：乃特 → 夜晚"),
    v("v17_4", "morning", "/ˈmɔːrnɪŋ/", "早上", "毛宁", "The early part of the day", "Good morning!", "早上好！", "谐音：毛宁 → 早上好"),
    v("v17_5", "afternoon", "/ˌæftərˈnuːn/", "下午", "阿福特农", "After morning", "Good afternoon!", "下午好！", "联想：after(之后) + noon(中午) = 下午"),
    v("v17_6", "evening", "/ˈiːvnɪŋ/", "晚上", "伊文宁", "Before night", "Good evening!", "晚上好！", "谐音：伊文宁 → 傍晚"),
    v("v17_7", "today", "/təˈdeɪ/", "今天", "特对", "This day", "Today is Monday.", "今天是星期一。", "联想：to(到) + day(天) = 到这一天 = 今天"),
    v("v17_8", "now", "/naʊ/", "现在", "闹", "At this moment", "I am here now.", "我现在在这里。", "谐音：闹 → 现在很闹"),
  ],
  [
    l("l17_1", "Good morning! What time is it? It is nine o'clock.", "早上好！现在几点？现在九点。", [
      { question: "What time is it?", questionChinese: "现在几点？", options: ["8:00", "9:00", "10:00"], correctAnswer: 1 },
    ]),
    l("l17_2", "I wake up in the morning. I work in the afternoon. I sleep at night.", "我早上醒来。我下午工作。我晚上睡觉。", [
      { question: "When does the person sleep?", questionChinese: "这个人什么时候睡觉？", options: ["morning", "afternoon", "night"], correctAnswer: 2 },
    ]),
  ],
  [
    s("s17_1", "Good ___!", "___好！", "/ɡʊd/", ["Good"], ["注意问候语"], "问候：Good + 时间"),
    s("s17_2", "What time is it?", "现在几点？", "/wʌt taɪm ɪz ɪt/", ["What time", "is it"], ["不要说 'What time it is'"], "问时间：What time is it?"),
  ],
  "My Day", "I wake up in the morning. I eat breakfast. I go to work. I come home at night.", "我早上醒来。我吃早饭。我去上班。我晚上回家。",
  ["morning", "afternoon", "night", "today", "now", "time"],
  "Write about your daily schedule", "写你的日常时间表", "I wake up in the morning. I work in the afternoon.",
  [q("What does 'morning' mean?", "'morning'是什么意思？", "早上", ["早上", "下午", "晚上"], "'Morning' is the early part of the day.", "'Morning'是一天的早些时候。")],
);

// ============================================================
// Day 18: Family Words
// ============================================================
export const DAY_18 = d(18, "Family Words", "家庭词汇",
  [
    v("v18_1", "mother", "/ˈmʌðər/", "母亲", "马泽", "Your mom", "My mother is a teacher.", "我妈妈是老师。", "谐音：马泽 → 妈妈"),
    v("v18_2", "father", "/ˈfɑːðər/", "父亲", "法泽", "Your dad", "My father works hard.", "我爸爸工作很努力。", "谐音：法泽 → 爸爸"),
    v("v18_3", "brother", "/ˈbrʌðər/", "兄弟", "布拉的", "Male sibling", "I have one brother.", "我有一个兄弟。", "联想：brother → 布拉的 → 兄弟"),
    v("v18_4", "sister", "/ˈsɪstər/", "姐妹", "西斯特", "Female sibling", "My sister is tall.", "我姐姐很高。", "联想：sister → 西斯特 → 姐妹"),
    v("v18_5", "son", "/sʌn/", "儿子", "桑", "Male child", "My son is five.", "我儿子五岁了。", "谐音：桑 → 儿子"),
    v("v18_6", "daughter", "/ˈdɔːtər/", "女儿", "稻特", "Female child", "My daughter is a student.", "我女儿是学生。", "联想：daughter → 稻特 → 女儿"),
    v("v18_7", "family", "/ˈfæməli/", "家庭", "发美丽", "All your relatives", "I love my family.", "我爱我的家人。", "联想：family → 发美丽 → 家庭"),
    v("v18_8", "friend", "/frɛnd/", "朋友", "弗兰的", "Someone you like", "She is my friend.", "她是我的朋友。", "联想：friend → 弗兰的 → 朋友"),
  ],
  [
    l("l18_1", "This is my mother. That is my father. I love my family.", "这是我妈妈。那是我爸爸。我爱我的家人。", [
      { question: "Who is 'this'?", questionChinese: "'this'是谁？", options: ["mother", "father", "sister"], correctAnswer: 0 },
    ]),
    l("l18_2", "I have a brother and a sister. My brother is tall. My sister is small.", "我有一个兄弟和一个姐妹。我哥哥很高。我妹妹很小。", [
      { question: "How many siblings does the person have?", questionChinese: "这个人有几个兄弟姐妹？", options: ["one", "two", "three"], correctAnswer: 1 },
    ]),
  ],
  [
    s("s18_1", "This is my ___.", "这是我的___。", "/ðɪs ɪz maɪ/", ["This is", "my"], ["注意 'my' 的使用"], "介绍家人：This is my + 家人"),
    s("s18_2", "I have a ___.", "我有一个___。", "/aɪ hæv ə/", ["I have", "a"], ["注意冠词"], "我有：I have a + 家人"),
  ],
  "My Family", "This is my family. I have a mother and a father. I have one brother. I love my family.", "这是我的家庭。我有妈妈和爸爸。我有一个兄弟。我爱我的家人。",
  ["mother", "father", "brother", "sister", "family", "friend"],
  "Write about your family", "写关于你的家庭", "This is my mother. She is a teacher.",
  [q("What does 'family' mean?", "'family'是什么意思？", "家庭", ["家庭", "朋友", "学校"], "'Family' means all your relatives.", "'Family'意思是所有亲戚。")],
);

// ============================================================
// Day 19: Clothing
// ============================================================
export const DAY_19 = d(19, "Clothing", "服装",
  [
    v("v19_1", "shirt", "/ʃɜːrt/", "衬衫", "舍特", "Top clothing", "This shirt is nice.", "这件衬衫很好看。", "谐音：舍特 → 衬衫"),
    v("v19_2", "pants", "/pænts/", "裤子", "盼茨", "Bottom clothing", "I wear blue pants.", "我穿蓝色裤子。", "谐音：盼茨 → 裤子"),
    v("v19_3", "shoes", "/ʃuːz/", "鞋子", "输子", "Footwear", "These shoes are comfortable.", "这双鞋很舒服。", "谐音：输子 → 鞋子"),
    v("v19_4", "hat", "/hæt/", "帽子", "害特", "Headwear", "I wear a hat.", "我戴帽子。", "谐音：害特 → 帽子"),
    v("v19_5", "dress", "/drɛs/", "连衣裙", "拽斯", "One-piece clothing for women", "She wears a red dress.", "她穿红色连衣裙。", "联想：dress → 拽斯 → 拽拽的裙子"),
    v("v19_6", "coat", "/koʊt/", "外套", "扣特", "Outer clothing for cold", "I wear a coat.", "我穿外套。", "谐音：扣特 → 外套"),
    v("v19_7", "sock", "/sɒk/", "袜子", "萨克", "Foot covering", "I wear white socks.", "我穿白色袜子。", "谐音：萨克 → 袜子"),
    v("v19_8", "skirt", "/skɜːrt/", "裙子", "斯格特", "Bottom clothing for women", "She wears a blue skirt.", "她穿蓝色裙子。", "联想：skirt → 斯格特 → 裙子"),
  ],
  [
    l("l19_1", "I wear a shirt and pants. I wear a hat.", "我穿衬衫和裤子。我戴帽子。", [
      { question: "What does the person wear on top?", questionChinese: "这个人上身穿什么？", options: ["pants", "shirt", "shoes"], correctAnswer: 1 },
    ]),
    l("l19_2", "She wears a red dress. He wears a blue coat.", "她穿红色连衣裙。他穿蓝色外套。", [
      { question: "What color is the dress?", questionChinese: "连衣裙是什么颜色？", options: ["blue", "red", "green"], correctAnswer: 1 },
    ]),
  ],
  [
    s("s19_1", "I wear ___.", "我穿___。", "/aɪ wɛr/", ["I wear"], ["注意 'wear' 的发音"], "穿衣：I wear + 衣服"),
    s("s19_2", "She wears a ___.", "她穿一件___。", "/ʃiː wɛrz ə/", ["She wears", "a"], ["第三人称加 's'"], "她穿：She wears a + 衣服"),
  ],
  "Getting Dressed", "I wear a shirt. I wear pants. I wear shoes. I wear a hat. I am ready.", "我穿衬衫。我穿裤子。我穿鞋子。我戴帽子。我准备好了。",
  ["shirt", "pants", "shoes", "hat", "dress", "coat"],
  "Write about what you wear", "写你穿什么", "I wear a shirt. I wear pants.",
  [q("What does 'shirt' mean?", "'shirt'是什么意思？", "衬衫", ["衬衫", "裤子", "鞋子"], "'Shirt' is top clothing.", "'Shirt'是上衣。")],
);

// ============================================================
// Day 20: Weather
// ============================================================
export const DAY_20 = d(20, "Weather", "天气",
  [
    v("v20_1", "weather", "/ˈwɛðər/", "天气", "歪泽", "The condition outside", "How is the weather?", "天气怎么样？", "谐音：歪泽 → 天气"),
    v("v20_2", "sun", "/sʌn/", "太阳", "森", "The bright thing in sky", "The sun is hot.", "太阳很热。", "谐音：森 → 森林里的太阳"),
    v("v20_3", "rain", "/reɪn/", "雨", "瑞恩", "Water falling from sky", "It is raining.", "正在下雨。", "谐音：瑞恩 → 下雨"),
    v("v20_4", "snow", "/snoʊ/", "雪", "斯诺", "White frozen water", "It is snowing.", "正在下雪。", "谐音：斯诺 → 雪"),
    v("v20_5", "wind", "/wɪnd/", "风", "温的", "Moving air", "The wind is strong.", "风很大。", "谐音：温的 → 风"),
    v("v20_6", "cloud", "/klaʊd/", "云", "克劳德", "White thing in sky", "There are many clouds.", "有很多云。", "联想：cloud → 克劳德 → 云"),
    v("v20_7", "warm", "/wɔːrm/", "温暖的", "沃姆", "Not too hot or cold", "It is warm today.", "今天很温暖。", "谐音：沃姆 → 温暖"),
    v("v20_8", "cool", "/kuːl/", "凉爽的", "酷", "Not too hot", "It is cool in autumn.", "秋天很凉爽。", "谐音：酷 → 凉爽"),
  ],
  [
    l("l20_1", "How is the weather today? It is sunny and warm.", "今天天气怎么样？晴天很温暖。", [
      { question: "How is the weather?", questionChinese: "天气怎么样？", options: ["rainy", "sunny", "snowy"], correctAnswer: 1 },
    ]),
    l("l20_2", "It is cold and windy. I wear a coat.", "天很冷有风。我穿外套。", [
      { question: "What does the person wear?", questionChinese: "这个人穿什么？", options: ["shirt", "coat", "dress"], correctAnswer: 1 },
    ]),
  ],
  [
    s("s20_1", "How is the weather?", "天气怎么样？", "/haʊ ɪz ðə ˈwɛðər/", ["How is", "the weather"], ["注意 'weather' 的发音"], "问天气：How is the weather?"),
    s("s20_2", "It is ___.", "天气很___。", "/ɪt ɪz/", ["It is"], ["描述天气用 'It is'"], "描述天气：It is + 形容词"),
  ],
  "Weather Report", "Today is sunny and warm. Tomorrow will be rainy. I like sunny weather.", "今天晴天很温暖。明天会下雨。我喜欢晴天。",
  ["weather", "sun", "rain", "snow", "wind", "warm", "cool"],
  "Write about the weather", "写关于天气", "It is sunny today. It is warm.",
  [q("What does 'weather' mean?", "'weather'是什么意思？", "天气", ["天气", "时间", "地方"], "'Weather' is the condition outside.", "'Weather'是外面的状况。")],
);

// ============================================================
// Day 21-30: Weeks 3-4 (condensed but complete)
// ============================================================
export const DAY_21 = d(21, "Week 3 Review", "第三周复习",
  [
    v("v21_1", "open", "/ˈoʊpən/", "打开", "欧盆", "To not be closed", "Open the door.", "打开门。", "谐音：欧盆 → 打开"),
    v("v21_2", "close", "/kloʊz/", "关闭", "克楼兹", "To not be open", "Close the window.", "关窗户。", "谐音：克楼兹 → 关闭"),
    v("v21_3", "stop", "/stɒp/", "停止", "死到普", "To not move", "Stop the car.", "停车。", "谐音：死到普 → 停止"),
    v("v21_4", "start", "/stɑːrt/", "开始", "死达特", "To begin", "Start the class.", "开始上课。", "谐音：死达特 → 开始"),
    v("v21_5", "run", "/rʌn/", "跑", "然", "To move fast", "I run every day.", "我每天跑步。", "谐音：然 → 跑"),
    v("v21_6", "walk", "/wɔːk/", "走路", "沃克", "To move on foot", "I walk to school.", "我走路去学校。", "谐音：沃克 → 走路"),
    v("v21_7", "swim", "/swɪm/", "游泳", "斯维姆", "To move in water", "I like to swim.", "我喜欢游泳。", "谐音：斯维姆 → 游泳"),
    v("v21_8", "read", "/riːd/", "阅读", "瑞德", "To look at words", "I read books.", "我读书。", "谐音：瑞德 → 阅读"),
  ],
  [
    l("l21_1", "I open the door. I start the class. I stop the car.", "我打开门。我开始上课。我停车。", [
      { question: "What does the person open?", questionChinese: "这个人打开什么？", options: ["window", "door", "book"], correctAnswer: 1 },
    ]),
    l("l21_2", "I walk to school. I run in the park. I swim in the pool.", "我走路去学校。我在公园跑步。我在泳池游泳。", [
      { question: "Where does the person swim?", questionChinese: "这个人在哪里游泳？", options: ["park", "school", "pool"], correctAnswer: 2 },
    ]),
  ],
  [
    s("s21_1", "I ___ to school.", "我去学校。", "/aɪ/", ["I walk", "to school"], ["注意 'walk' 的发音"], "走路去：walk to + 地点"),
    s("s21_2", "I like to ___.", "我喜欢___。", "/aɪ laɪk tə/", ["I like to"], ["like to + 动词原形"], "喜欢做某事：like to + 动词"),
  ],
  "My Hobbies", "I like to read. I like to swim. I like to walk. I like to run.", "我喜欢阅读。我喜欢游泳。我喜欢走路。我喜欢跑步。",
  ["open", "close", "stop", "start", "run", "walk", "swim", "read"],
  "Write about your hobbies", "写关于你的爱好", "I like to read. I like to swim.",
  [q("What does 'swim' mean?", "'swim'是什么意思？", "游泳", ["游泳", "跑步", "走路"], "'Swim' means to move in water.", "'Swim'意思是水里移动。")],
);

export const DAY_22 = d(22, "Places", "地点",
  [
    v("v22_1", "school", "/skuːl/", "学校", "思故", "Where you study", "I go to school.", "我去学校。", "谐音：思故 → 学校"),
    v("v22_2", "store", "/stɔːr/", "商店", "死到", "Where you buy things", "I go to the store.", "我去商店。", "谐音：死到 → 商店"),
    v("v22_3", "park", "/pɑːrk/", "公园", "帕克", "Where you play outside", "I play in the park.", "我在公园玩。", "谐音：帕克 → 公园"),
    v("v22_4", "hospital", "/ˈhɒspɪtl/", "医院", "豪斯匹头", "Where you go when sick", "My mother works at a hospital.", "我妈妈在医院工作。", "联想：hospit(客人) + al = 医院"),
    v("v22_5", "restaurant", "/ˈrɛstərɒnt/", "餐厅", "瑞斯特荣特", "Where you eat", "I eat at a restaurant.", "我在餐厅吃饭。", "联想：rest(休息) + aurant = 餐厅"),
    v("v22_6", "office", "/ˈɒfɪs/", "办公室", "奥菲斯", "Where people work", "My father works in an office.", "我爸爸在办公室工作。", "谐音：奥菲斯 → 办公室"),
    v("v22_7", "home", "/hoʊm/", "家", "厚姆", "Where you live", "I go home.", "我回家。", "谐音：厚姆 → 家"),
    v("v22_8", "market", "/ˈmɑːrkɪt/", "市场", "马基特", "Where you buy food", "I buy food at the market.", "我在市场买食物。", "联想：mark(标记) + et = 市场"),
  ],
  [
    l("l22_1", "I go to school. I go to the store. I go home.", "我去学校。我去商店。我回家。", [
      { question: "How many places does the person go?", questionChinese: "这个人去几个地方？", options: ["one", "two", "three"], correctAnswer: 2 },
    ]),
    l("l22_2", "I eat at a restaurant. I buy food at the market.", "我在餐厅吃饭。我在市场买食物。", [
      { question: "Where does the person eat?", questionChinese: "这个人在哪里吃饭？", options: ["market", "restaurant", "school"], correctAnswer: 1 },
    ]),
  ],
  [
    s("s22_1", "I go to ___.", "我去___。", "/aɪ ɡoʊ tə/", ["I go to"], ["home 前不加 to"], "去某地：go to + 地点"),
    s("s22_2", "I am at ___.", "我在___。", "/aɪ æm æt/", ["I am at"], ["at + 地点"], "在某地：I am at + 地点"),
  ],
  "My Neighborhood", "I live near a park. I go to school every day. I buy food at the market.", "我住在公园附近。我每天去学校。我在市场买食物。",
  ["school", "store", "park", "hospital", "restaurant", "home"],
  "Write about places you go", "写你去的地方", "I go to school. I go to the store.",
  [q("What does 'school' mean?", "'school'是什么意思？", "学校", ["学校", "商店", "公园"], "'School' is where you study.", "'School'是你学习的地方。")],
);

export const DAY_23 = d(23, "Possessives", "所有格",
  [
    v("v23_1", "my", "/maɪ/", "我的", "买", "Belonging to me", "This is my book.", "这是我的书。", "谐音：买 → 买我的"),
    v("v23_2", "your", "/jʊr/", "你的", "优", "Belonging to you", "This is your pen.", "这是你的笔。", "谐音：优 → 你的"),
    v("v23_3", "his", "/hɪz/", "他的", "黑兹", "Belonging to him", "This is his car.", "这是他的车。", "谐音：黑兹 → 他的"),
    v("v23_4", "her", "/hɜːr/", "她的", "合", "Belonging to her", "This is her dress.", "这是她的裙子。", "谐音：合 → 她的"),
    v("v23_5", "its", "/ɪts/", "它的", "伊茨", "Belonging to it", "The cat likes its food.", "猫喜欢它的食物。", "谐音：伊茨 → 它的"),
    v("v23_6", "our", "/aʊr/", "我们的", "奥", "Belonging to us", "This is our house.", "这是我们的房子。", "谐音：奥 → 我们的"),
    v("v23_7", "their", "/ðɛr/", "他们的", "在尔", "Belonging to them", "This is their car.", "这是他们的车。", "谐音：在尔 → 他们的"),
    v("v23_8", "mine", "/maɪn/", "我的(名词性)", "买恩", "The one that is mine", "This book is mine.", "这本书是我的。", "联想：my + ne = mine = 我的"),
  ],
  [
    l("l23_1", "This is my book. That is your pen. This is his car.", "这是我的书。那是你的笔。这是他的车。", [
      { question: "Whose book is this?", questionChinese: "这是谁的书？", options: ["my", "your", "his"], correctAnswer: 0 },
    ]),
    l("l23_2", "This is her dress. This is our house. This is their car.", "这是她的裙子。这是我们的房子。这是他们的车。", [
      { question: "Whose house is this?", questionChinese: "这是谁的房子？", options: ["her", "our", "their"], correctAnswer: 1 },
    ]),
  ],
  [
    s("s23_1", "This is my ___.", "这是我的___。", "/ðɪs ɪz maɪ/", ["This is", "my"], ["所有格放在名词前"], "我的东西：my + 名词"),
    s("s23_2", "This ___ is mine.", "这个___是我的。", "/ðɪs ɪz maɪn/", ["This", "is mine"], ["mine 后不加名词"], "是我的：This + 名词 + is mine"),
  ],
  "My Things", "This is my book. That is your pen. This is his car. This is her dress.", "这是我的书。那是你的笔。这是他的车。这是她的裙子。",
  ["my", "your", "his", "her", "our", "their"],
  "Write 5 sentences with possessives", "写5个使用所有格的句子", "This is my book. That is your pen.",
  [q("What does 'his' mean?", "'his'是什么意思？", "他的", ["他的", "她的", "我的"], "'His' means belonging to him.", "'His'意思是他所属的。")],
);

export const DAY_24 = d(24, "Opposites", "反义词",
  [
    v("v24_1", "big", "/bɪɡ/", "大的", "比格", "Large", "The elephant is big.", "大象很大。", "谐音：比格 → 大"),
    v("v24_2", "small", "/smɔːl/", "小的", "斯莫", "Little", "The mouse is small.", "老鼠很小。", "谐音：斯莫 → 小"),
    v("v24_3", "hot", "/hɒt/", "热的", "浩特", "High temperature", "The sun is hot.", "太阳很热。", "谐音：浩特 → 热"),
    v("v24_4", "cold", "/koʊld/", "冷的", "扣的", "Low temperature", "Winter is cold.", "冬天很冷。", "谐音：扣的 → 冷"),
    v("v24_5", "good", "/ɡʊd/", "好的", "古德", "Positive", "This food is good.", "这食物很好。", "谐音：古德 → 好"),
    v("v24_6", "bad", "/bæd/", "坏的", "败的", "Negative", "That movie is bad.", "那电影很坏。", "谐音：败的 → 坏"),
    v("v24_7", "new", "/njuː/", "新的", "牛", "Not old", "I have a new book.", "我有一本新书。", "谐音：牛 → 新的"),
    v("v24_8", "old", "/oʊld/", "旧的/老的", "欧的", "Not new / aged", "My car is old.", "我的车很旧。", "谐音：欧的 → 旧的"),
  ],
  [
    l("l24_1", "The elephant is big. The mouse is small.", "大象很大。老鼠很小。", [
      { question: "Which is big?", questionChinese: "哪个是大的？", options: ["mouse", "elephant", "cat"], correctAnswer: 1 },
    ]),
    l("l24_2", "Summer is hot. Winter is cold.", "夏天很热。冬天很冷。", [
      { question: "Which season is hot?", questionChinese: "哪个季节热？", options: ["summer", "winter", "autumn"], correctAnswer: 0 },
    ]),
  ],
  [
    s("s24_1", "X is the opposite of Y.", "X是Y的反义词。", "/ɪz ðə ˈɒpəzɪt ɒv/", ["is the opposite", "of"], ["opposite 发音较长"], "反义：X is the opposite of Y"),
    s("s24_2", "Big is the opposite of small.", "大是小的反义词。", "/bɪɡ ɪz/", ["Big is", "small"], ["注意发音"], "反义句：Big is the opposite of small"),
  ],
  "Opposites", "Big and small. Hot and cold. Good and bad. New and old.", "大和小。热和冷。好和坏。新和旧。",
  ["big", "small", "hot", "cold", "good", "bad", "new", "old"],
  "Write 4 pairs of opposites", "写4对反义词", "Big and small. Hot and cold.",
  [q("What is the opposite of 'big'?", "'big'的反义词是什么？", "small", ["small", "good", "new"], "'Small' is the opposite of 'big'.", "'Small'是'big'的反义词。")],
);

export const DAY_25 = d(25, "More Verbs", "更多动词",
  [
    v("v25_1", "think", "/θɪŋk/", "想", "斯令克", "To use your mind", "I think so.", "我也这么想。", "谐音：斯令克 → 想"),
    v("v25_2", "feel", "/fiːl/", "感觉", "费欧", "To have a feeling", "I feel happy.", "我感觉很开心。", "谐音：费欧 → 感觉"),
    v("v25_3", "tell", "/tɛl/", "告诉", "太欧", "To give information", "Tell me the answer.", "告诉我答案。", "谐音：太欧 → 告诉"),
    v("v25_4", "ask", "/æsk/", "问", "阿斯克", "To request information", "I want to ask a question.", "我想问一个问题。", "谐音：阿斯克 → 问"),
    v("v25_5", "wait", "/weɪt/", "等待", "威特", "To stay in place", "Wait for me.", "等我。", "谐音：威特 → 等待"),
    v("v25_6", "try", "/traɪ/", "尝试", "踹", "To make an effort", "I try my best.", "我尽力了。", "谐音：踹 → 用力踹 = 尝试"),
    v("v25_7", "use", "/juːz/", "使用", "优兹", "To employ something", "I use a pen.", "我用笔。", "谐音：优兹 → 使用"),
    v("v25_8", "keep", "/kiːp/", "保持", "K普", "To continue to have", "Keep trying.", "继续尝试。", "谐音：K普 → 保持"),
  ],
  [
    l("l25_1", "I think so. I feel happy. I try my best.", "我这么想。我感觉很开心。我尽力了。", [
      { question: "How does the person feel?", questionChinese: "这个人感觉怎么样？", options: ["sad", "happy", "tired"], correctAnswer: 1 },
    ]),
    l("l25_2", "Wait for me. Tell me the answer. I use a pen.", "等我。告诉我答案。我用笔。", [
      { question: "What does the person use?", questionChinese: "这个人用什么？", options: ["pen", "book", "car"], correctAnswer: 0 },
    ]),
  ],
  [
    s("s25_1", "I think ___.", "我想___。", "/aɪ θɪŋk/", ["I think"], ["think 发 /θ/"], "我想：I think + 从句"),
    s("s25_2", "I feel ___.", "我感觉___。", "/aɪ fiːl/", ["I feel"], ["feel + 形容词"], "感觉：I feel + 形容词"),
  ],
  "My Thoughts", "I think English is important. I feel happy when I learn. I try every day.", "我认为英语很重要。我学习时感觉很开心。我每天都努力。",
  ["think", "feel", "tell", "ask", "wait", "try", "use", "keep"],
  "Write about what you think and feel", "写你想的和感觉的", "I think English is fun. I feel happy.",
  [q("What does 'think' mean?", "'think'是什么意思？", "想", ["想", "感觉", "看"], "'Think' means to use your mind.", "'Think'意思是用脑子想。")],
);

export const DAY_26 = d(26, "Emotions", "情感",
  [
    v("v26_1", "happy", "/ˈhæpi/", "开心的", "嗨皮", "Feeling joy", "I am happy today.", "我今天很开心。", "谐音：嗨皮 → 开心"),
    v("v26_2", "sad", "/sæd/", "伤心的", "赛的", "Feeling sorrow", "She is sad.", "她很伤心。", "谐音：赛的 → 伤心"),
    v("v26_3", "angry", "/ˈæŋɡri/", "生气的", "安格瑞", "Feeling mad", "He is angry.", "他很生气。", "谐音：安格瑞 → 生气"),
    v("v26_4", "tired", "/taɪərd/", "累的", "太尔的", "Need rest", "I am tired.", "我很累。", "联想：tired → 太尔的 → 太累了"),
    v("v26_5", "excited", "/ɪkˈsaɪtɪd/", "兴奋的", "伊克塞提的", "Very happy", "I am excited!", "我很兴奋！", "联想：excited → 伊克塞提的"),
    v("v26_6", "scared", "/skɛrd/", "害怕的", "斯凯的", "Feeling fear", "I am scared.", "我很害怕。", "谐音：斯凯的 → 害怕"),
    v("v26_7", "proud", "/praʊd/", "骄傲的", "普绕的", "Feeling satisfaction", "I am proud of you.", "我为你骄傲。", "谐音：普绕的 → 骄傲"),
    v("v26_8", "nervous", "/ˈnɜːrvəs/", "紧张的", "纳沃斯", "Feeling anxious", "I am nervous.", "我很紧张。", "谐音：纳沃斯 → 紧张"),
  ],
  [
    l("l26_1", "I am happy today. I am excited about the test.", "我今天很开心。我对考试很兴奋。", [
      { question: "How is the person feeling?", questionChinese: "这个人感觉怎么样？", options: ["sad", "happy", "angry"], correctAnswer: 1 },
    ]),
    l("l26_2", "I am tired. I am nervous about the exam.", "我很累。我对考试很紧张。", [
      { question: "Why is the person nervous?", questionChinese: "这个人为什么紧张？", options: ["tired", "exam", "angry"], correctAnswer: 1 },
    ]),
  ],
  [
    s("s26_1", "I am ___.", "我很___。", "/aɪ æm/", ["I am"], ["I am + 形容词"], "描述感受：I am + 形容词"),
    s("s26_2", "I feel ___.", "我感觉___。", "/aɪ fiːl/", ["I feel"], ["feel + 形容词"], "感觉：I feel + 形容词"),
  ],
  "My Feelings", "I am happy today. I feel excited. I am proud of my English.", "我今天很开心。我感觉很兴奋。我为我的英语感到骄傲。",
  ["happy", "sad", "angry", "tired", "excited", "scared"],
  "Write about your feelings", "写你的感受", "I am happy. I feel excited.",
  [q("What does 'excited' mean?", "'excited'是什么意思？", "兴奋的", ["兴奋的", "伤心的", "累的"], "'Excited' means very happy.", "'Excited'意思是非常开心。")],
);

export const DAY_27 = d(27, "Numbers 21-100", "数字21-100",
  [
    v("v27_1", "twenty-one", "/ˌtwɛnti wʌn/", "二十一", "特文提万", "The number 21", "I am twenty-one.", "我二十一岁。", "联想：twenty(20) + one(1) = 21"),
    v("v27_2", "thirty", "/ˈθɜːrti/", "三十", "瑟提", "The number 30", "I have thirty books.", "我有三十本书。", "联想：three(3) + ty(十) = 30"),
    v("v27_3", "forty", "/ˈfɔːrti/", "四十", "福提", "The number 40", "He is forty years old.", "他四十岁了。", "联想：four(4) + ty(十) = 40"),
    v("v27_4", "fifty", "/ˈfɪfti/", "五十", "菲夫提", "The number 50", "I have fifty dollars.", "我有五十美元。", "联想：five(5) + ty(十) = 50"),
    v("v27_5", "sixty", "/ˈsɪksti/", "六十", "西克斯提", "The number 60", "She is sixty.", "她六十岁了。", "联想：six(6) + ty(十) = 60"),
    v("v27_6", "seventy", "/ˈsɛvənti/", "七十", "塞文提", "The number 70", "There are seventy students.", "有七十个学生。", "联想：seven(7) + ty(十) = 70"),
    v("v27_7", "eighty", "/ˈeɪti/", "八十", "诶提", "The number 80", "My grandfather is eighty.", "我爷爷八十岁了。", "联想：eight(8) + ty(十) = 80"),
    v("v27_8", "ninety", "/ˈnaɪnti/", "九十", "乃恩提", "The number 90", "The store closes at ninety.", "商店九十关门。", "联想：nine(9) + ty(十) = 90"),
    v("v27_9", "hundred", "/ˈhʌndrəd/", "一百", "汉准的", "The number 100", "I have one hundred books.", "我有一百本书。", "谐音：汉准的 → 一百"),
    v("v27_10", "zero", "/ˈzɪroʊ/", "零", "字柔", "The number 0", "I have zero money.", "我没钱了。", "谐音：字柔 → 零"),
  ],
  [
    l("l27_1", "I am thirty years old. I have fifty books.", "我三十岁了。我有五十本书。", [
      { question: "How old is the person?", questionChinese: "这个人多大？", options: ["20", "30", "40"], correctAnswer: 1 },
    ]),
    l("l27_2", "There are one hundred students. The room has zero chairs.", "有一百个学生。房间里零把椅子。", [
      { question: "How many students?", questionChinese: "多少学生？", options: ["50", "100", "200"], correctAnswer: 1 },
    ]),
  ],
  [
    s("s27_1", "I am ___ years old.", "我___岁了。", "/aɪ æm/", ["I am", "years old"], ["注意复数"], "年龄：I am + 数字 + years old"),
    s("s27_2", "I have ___ ___.", "我有___个___。", "/aɪ hæv/", ["I have"], ["注意复数"], "数量：I have + 数字 + 名词复数"),
  ],
  "Numbers", "I have one hundred books. I am thirty years old. The room has zero chairs.", "我有一百本书。我三十岁了。房间零把椅子。",
  ["thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety", "hundred", "zero"],
  "Write sentences with numbers 21-100", "写包含21-100数字的句子", "I am thirty. I have fifty books.",
  [q("What does 'hundred' mean?", "'hundred'是什么意思？", "一百", ["一百", "一千", "一万"], "'Hundred' means the number 100.", "'Hundred'意思是数字100。")],
);

export const DAY_28 = d(28, "Days & Months", "星期和月份",
  [
    v("v28_1", "Monday", "/ˈmʌndeɪ/", "星期一", "曼对", "The first day of work week", "Monday is busy.", "星期一很忙。", "联想：Mon(月) + day(天) = 月之日"),
    v("v28_2", "Tuesday", "/ˈtjuːzdeɪ/", "星期二", "丘子对", "The second day", "Tuesday is good.", "星期二很好。", "联想：Tues(战神) + day = 战神之日"),
    v("v28_3", "Wednesday", "/ˈwɛnzdeɪ/", "星期三", "温子对", "The third day", "Wednesday is okay.", "星期三还好。", "联想：Wednes(水星) + day"),
    v("v28_4", "Thursday", "/ˈθɜːrzdeɪ/", "星期四", "瑟子对", "The fourth day", "Thursday is fun.", "星期四有趣。", "联想：Thurs(雷神) + day"),
    v("v28_5", "Friday", "/ˈfraɪdeɪ/", "星期五", "弗莱对", "The fifth day", "Friday is happy!", "星期五很开心！", "联想：Fri(爱神) + day = 爱神之日"),
    v("v28_6", "Saturday", "/ˈsætərdeɪ/", "星期六", "塞特对", "First day of weekend", "Saturday is relaxing.", "星期六很放松。", "联想：Satur(土星) + day"),
    v("v28_7", "Sunday", "/ˈsʌndeɪ/", "星期日", "森对", "Last day of week", "Sunday is rest day.", "星期日是休息日。", "联想：Sun(太阳) + day = 太阳日"),
    v("v28_8", "January", "/ˈdʒænjuˌɛri/", "一月", "杰纽额瑞", "The first month", "January is cold.", "一月很冷。", "联想：Janu(门神) + ary"),
  ],
  [
    l("l28_1", "Monday is busy. Tuesday is good. Friday is happy!", "星期一很忙。星期二很好。星期五很开心！", [
      { question: "Which day is happy?", questionChinese: "哪天很开心？", options: ["Monday", "Tuesday", "Friday"], correctAnswer: 2 },
    ]),
    l("l28_2", "Today is Wednesday. I go to school. Tomorrow is Thursday.", "今天是星期三。我去学校。明天是星期四。", [
      { question: "What day is today?", questionChinese: "今天星期几？", options: ["Monday", "Wednesday", "Friday"], correctAnswer: 1 },
    ]),
  ],
  [
    s("s28_1", "Today is ___.", "今天是星期___。", "/təˈdeɪ ɪz/", ["Today is"], ["注意大写"], "今天星期几：Today is + 星期"),
    s("s28_2", "I like ___day.", "我喜欢星期___。", "/aɪ laɪk/", ["I like"], ["like + 星期"], "喜欢星期几：I like + 星期"),
  ],
  "My Week", "Monday I go to school. Friday is happy. Saturday I rest. Sunday I play.", "星期一我去学校。星期五很开心。星期六我休息。星期日我玩。",
  ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  "Write about your week", "写关于你的星期", "Monday I go to school. Friday is happy.",
  [q("What day comes after Monday?", "星期一之后是哪天？", "Tuesday", ["Tuesday", "Wednesday", "Friday"], "'Tuesday' comes after Monday.", "'Tuesday'在星期一之后。")],
);

export const DAY_29 = d(29, "Hobbies", "爱好",
  [
    v("v29_1", "hobby", "/ˈhɒbi/", "爱好", "浩比", "Something you enjoy doing", "My hobby is reading.", "我的爱好是阅读。", "谐音：浩比 → 爱好"),
    v("v29_2", "music", "/ˈmjuːzɪk/", "音乐", "缪贼克", "Sounds you listen to", "I like music.", "我喜欢音乐。", "谐音：缪贼克 → 音乐"),
    v("v29_3", "dance", "/dæns/", "跳舞", "但斯", "Moving to music", "I like to dance.", "我喜欢跳舞。", "谐音：但斯 → 跳舞"),
    v("v29_4", "sing", "/sɪŋ/", "唱歌", "星", "To make music with voice", "I like to sing.", "我喜欢唱歌。", "谐音：星 → 唱歌"),
    v("v29_5", "draw", "/drɔː/", "画画", "抓", "To make pictures", "I like to draw.", "我喜欢画画。", "谐音：抓 → 抓笔画画"),
    v("v29_6", "cook", "/kʊk/", "做饭", "酷克", "To make food", "I like to cook.", "我喜欢做饭。", "谐音：酷克 → 酷克做饭"),
    v("v29_7", "travel", "/ˈtrævl/", "旅行", "踹我", "To go to new places", "I like to travel.", "我喜欢旅行。", "谐音：踹我 → 踹我去旅行"),
    v("v29_8", "game", "/ɡeɪm/", "游戏", "给姆", "Something you play", "I like video games.", "我喜欢电子游戏。", "谐音：给姆 → 游戏"),
  ],
  [
    l("l29_1", "My hobby is reading. I like music. I like to draw.", "我的爱好是阅读。我喜欢音乐。我喜欢画画。", [
      { question: "What is the person's hobby?", questionChinese: "这个人的爱好是什么？", options: ["reading", "cooking", "travel"], correctAnswer: 0 },
    ]),
    l("l29_2", "I like to dance. I like to sing. I like to cook.", "我喜欢跳舞。我喜欢唱歌。我喜欢做饭。", [
      { question: "How many hobbies does the person have?", questionChinese: "这个人有几个爱好？", options: ["one", "two", "three"], correctAnswer: 2 },
    ]),
  ],
  [
    s("s29_1", "My hobby is ___.", "我的爱好是___。", "/maɪ ˈhɒbi ɪz/", ["My hobby is"], ["注意所有格"], "爱好：My hobby is + 动名词"),
    s("s29_2", "I like to ___.", "我喜欢___。", "/aɪ laɪk tə/", ["I like to"], ["like to + 动词原形"], "喜欢做：I like to + 动词"),
  ],
  "My Hobbies", "My hobby is reading. I like music. I like to draw and cook. I like to travel.", "我的爱好是阅读。我喜欢音乐。我喜欢画画和做饭。我喜欢旅行。",
  ["hobby", "music", "dance", "sing", "draw", "cook", "travel", "game"],
  "Write about your hobbies", "写关于你的爱好", "My hobby is reading. I like to draw.",
  [q("What does 'hobby' mean?", "'hobby'是什么意思？", "爱好", ["爱好", "工作", "学校"], "'Hobby' means something you enjoy.", "'Hobby'意思是你喜欢做的事。")],
);

export const DAY_30 = d(30, "Stage 1 Final Review", "第一阶段总复习",
  [
    v("v30_1", "important", "/ɪmˈpɔːrtənt/", "重要的", "伊姆泡腾特", "Having great value", "English is important.", "英语很重要。", "联想：im + port + ant = 重要"),
    v("v30_2", "interesting", "/ˈɪntrəstɪŋ/", "有趣的", "因翠斯特婷", "Making you curious", "This book is interesting.", "这本书很有趣。", "联想：interest(兴趣) + ing = 有趣的"),
    v("v30_3", "beautiful", "/ˈbjuːtɪfl/", "美丽的", "优特否", "Very pretty", "The flower is beautiful.", "花很美丽。", "联想：beauty(美丽) + ful = 美丽的"),
    v("v30_4", "wonderful", "/ˈwʌndərfl/", "精彩的", "万德否", "Very good", "Today is wonderful!", "今天很精彩！", "联想：wonder(奇迹) + ful = 精彩的"),
    v("v30_5", "problem", "/ˈprɒbləm/", "问题", "普绕不乐姆", "Something difficult", "I have a problem.", "我有一个问题。", "谐音：普绕不乐姆 → 问题"),
    v("v30_6", "answer", "/ˈænsər/", "答案", "安色", "A reply to a question", "What is the answer?", "答案是什么？", "谐音：安色 → 答案"),
    v("v30_7", "question", "/ˈkwɛstʃən/", "问题", "快斯特晨", "Something you ask", "I have a question.", "我有一个问题。", "谐音：快斯特晨 → 问题"),
    v("v30_8", "example", "/ɪɡˈzæmpl/", "例子", "伊格暂剖", "Something that shows", "Give me an example.", "给我一个例子。", "联想：ex + ample = 例子"),
  ],
  [
    l("l30_1", "English is important. Learning is interesting. Today is wonderful.", "英语很重要。学习很有趣。今天很精彩。", [
      { question: "What is important?", questionChinese: "什么很重要？", options: ["English", "Chinese", "Math"], correctAnswer: 0 },
    ]),
    l("l30_2", "I have a question. What is the answer? Give me an example.", "我有一个问题。答案是什么？给我一个例子。", [
      { question: "What does the person have?", questionChinese: "这个人有什么？", options: ["question", "answer", "example"], correctAnswer: 0 },
    ]),
  ],
  [
    s("s30_1", "English is ___.", "英语很___。", "/ˈɪŋɡlɪʃ ɪz/", ["English is"], ["注意专有名词大写"], "描述：English is + 形容词"),
    s("s30_2", "I have a ___.", "我有一个___。", "/aɪ hæv ə/", ["I have", "a"], ["注意冠词"], "我有：I have a + 名词"),
  ],
  "My Learning", "English is important. Learning is interesting. I have a question. I know the answer.", "英语很重要。学习很有趣。我有一个问题。我知道答案。",
  ["important", "interesting", "beautiful", "wonderful", "problem", "answer", "question", "example"],
  "Write what you learned in 30 days", "写你30天学到了什么", "I learned English. It is important. I am happy.",
  [q("What does 'important' mean?", "'important'是什么意思？", "重要的", ["重要的", "有趣的", "美丽的"], "'Important' means having great value.", "'important'意思是有很大价值。")],
);

// ============================================================
// Export all Day 9-30 curricula
// ============================================================
export const DAY_9_TO_30_CURRICULA: Record<number, Day1Curriculum> = {
  9: DAY_9, 10: DAY_10, 11: DAY_11, 12: DAY_12, 13: DAY_13, 14: DAY_14,
  15: DAY_15, 16: DAY_16, 17: DAY_17, 18: DAY_18, 19: DAY_19, 20: DAY_20,
  21: DAY_21, 22: DAY_22, 23: DAY_23, 24: DAY_24, 25: DAY_25, 26: DAY_26,
  27: DAY_27, 28: DAY_28, 29: DAY_29, 30: DAY_30,
};

export default DAY_9_TO_30_CURRICULA;
