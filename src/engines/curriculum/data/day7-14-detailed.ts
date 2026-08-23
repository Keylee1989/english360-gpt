/**
 * Day 7-14 Detailed Curriculum
 *
 * Stage 1: Foundation (Week 2)
 *
 * Goals:
 * - Review Week 1
 * - Learn new vocabulary (body, family, food)
 * - Practice basic conversations
 * - Introduction to past tense
 * - Daily routine vocabulary
 */

import type { Day1Curriculum } from "./day1-detailed";

// ============================================================
// Day 7: Week 1 Review
// ============================================================

export const DAY_7_CURRICULUM: Day1Curriculum = {
  day: 7,
  title: "Week 1 Review",
  titleChinese: "第一周复习",
  objectives: [
    "Review all Week 1 vocabulary",
    "Practice greetings and introductions",
    "Review numbers and colors",
    "Self-assessment",
  ],
  objectivesChinese: [
    "复习第一周所有词汇",
    "练习问候和介绍",
    "复习数字和颜色",
    "自我评估",
  ],
  totalMinutes: 240,

  vocabulary: [
    { id: "v7_1", word: "review", ipa: "/rɪˈvjuː/", chinese: "复习", chinesePronunciation: "瑞维尤", englishDefinition: "To look at something again", example: "Let's review the words.", exampleChinese: "让我们复习单词。", memoryMethod: "re(重新) + view(看) = 重新看 = 复习", difficulty: "easy" },
    { id: "v7_2", word: "test", ipa: "/tɛst/", chinese: "测试", chinesePronunciation: "泰斯特", englishDefinition: "An exam to check knowledge", example: "I have a test today.", exampleChinese: "我今天有测试。", memoryMethod: "谐音：泰斯特 → 考试", difficulty: "easy" },
    { id: "v7_3", word: "know", ipa: "/noʊ/", chinese: "知道", chinesePronunciation: "诺", englishDefinition: "To have information in your mind", example: "I know the answer.", exampleChinese: "我知道答案。", memoryMethod: "谐音：诺 → 承诺知道", difficulty: "easy" },
    { id: "v7_4", word: "learn", ipa: "/lɜːrn/", chinese: "学习", chinesePronunciation: "勒恩", englishDefinition: "To gain knowledge", example: "I want to learn English.", exampleChinese: "我想学英语。", memoryMethod: "联想：learn → 勒恩 → 勒紧裤带学习", difficulty: "easy" },
    { id: "v7_5", word: "help", ipa: "/hɛlp/", chinese: "帮助", chinesePronunciation: "黑欧普", englishDefinition: "To assist someone", example: "Can you help me?", exampleChinese: "你能帮我吗？", memoryMethod: "谐音：黑欧普 → 黑暗中的希望 = 帮助", difficulty: "easy" },
    { id: "v7_6", word: "understand", ipa: "/ˌʌndərˈstænd/", chinese: "理解", chinesePronunciation: "安德斯坦的", englishDefinition: "To know the meaning", example: "I understand.", exampleChinese: "我明白了。", memoryMethod: "under(下面) + stand(站) = 站在下面看懂了", difficulty: "medium" },
    { id: "v7_7", word: "please", ipa: "/pliːz/", chinese: "请", chinesePronunciation: "普利兹", englishDefinition: "Used to make a request polite", example: "Please sit down.", exampleChinese: "请坐。", memoryMethod: "谐音：普利兹 → 请", difficulty: "easy" },
    { id: "v7_8", word: "sorry", ipa: "/ˈsɒri/", chinese: "对不起", chinesePronunciation: "索瑞", englishDefinition: "Used to apologize", example: "I'm sorry.", exampleChinese: "对不起。", memoryMethod: "谐音：索瑞 → 所以说对不起", difficulty: "easy" },
  ],

  phonics: [],

  listening: [
    {
      id: "l7_1",
      text: "Hello! My name is Tom. I am from America. I am a student. I like English.",
      textChinese: "你好！我叫汤姆。我来自美国。我是学生。我喜欢英语。",
      audioSpeed: "slow",
      transcript: "Hello! My name is Tom. I am from America. I am a student. I like English.",
      transcriptChinese: "你好！我叫汤姆。我来自美国。我是学生。我喜欢英语。",
      questions: [
        { question: "What is the person's name?", questionChinese: "这个人叫什么名字？", options: ["Tom", "Jack", "Mike"], correctAnswer: 0 },
        { question: "Where is he from?", questionChinese: "他来自哪里？", options: ["China", "America", "England"], correctAnswer: 1 },
      ],
    },
    {
      id: "l7_2",
      text: "Good morning! How are you? I am fine, thank you. And you?",
      textChinese: "早上好！你好吗？我很好，谢谢。你呢？",
      audioSpeed: "slow",
      transcript: "Good morning! How are you? I am fine, thank you. And you?",
      transcriptChinese: "早上好！你好吗？我很好，谢谢。你呢？",
      questions: [
        { question: "What time is it?", questionChinese: "现在是什么时间？", options: ["Morning", "Afternoon", "Evening"], correctAnswer: 0 },
        { question: "How is the person feeling?", questionChinese: "这个人感觉怎么样？", options: ["Bad", "Fine", "Tired"], correctAnswer: 1 },
      ],
    },
  ],

  speaking: [
    { id: "s7_1", modelSentence: "My name is ___. I am from ___.", modelSentenceChinese: "我叫___。我来自___。", ipa: "/maɪ neɪm ɪz aɪ æm frɒm/", shadowingPoints: ["My name is", "I am from"], commonMistakes: ["不要说 'I name is'", "要说 'My name is'"], chineseHint: "自我介绍：My name is + 名字" },
    { id: "s7_2", modelSentence: "Nice to meet you. How are you?", modelSentenceChinese: "很高兴认识你。你好吗？", ipa: "/naɪs tə miːt juː haʊ ɑːr juː/", shadowingPoints: ["Nice to", "meet you", "How are you"], commonMistakes: ["meet 发音像 '米特'", "you 发音像 '优'"], chineseHint: "见面时说：Nice to meet you" },
  ],

  reading: [
    {
      id: "r7_1",
      title: "My Family",
      titleChinese: "我的家庭",
      content: `This is my family. I have a mother and a father. 
I have one brother and one sister. 
My brother is tall. My sister is small.
I love my family.`,
      contentChinese: `这是我的家庭。我有妈妈和爸爸。
我有一个兄弟和一个姐妹。
我哥哥很高。我妹妹很小。
我爱我的家人。`,
      vocabulary: ["family", "mother", "father", "brother", "sister", "tall", "small", "love"],
      questions: [
        { question: "How many brothers does the person have?", questionChinese: "这个人有几个兄弟？", options: ["One", "Two", "Three"], correctAnswer: 0 },
        { question: "Is the brother tall or small?", questionChinese: "哥哥是高还是矮？", options: ["Tall", "Small", "Medium"], correctAnswer: 0 },
      ],
    },
  ],

  writing: [
    { id: "w7_1", task: "Write about yourself: name, country, and one thing you like", taskChinese: "写关于你自己：名字、国家和你喜欢的一件事", hints: ["My name is...", "I am from...", "I like..."], example: "My name is Li. I am from China. I like music.", exampleChinese: "我叫李。我来自中国。我喜欢音乐。" },
  ],

  review: [
    { type: "vocabulary", duration: 30, description: "Review all Week 1 vocabulary", descriptionChinese: "复习第一周所有词汇" },
    { type: "listening", duration: 20, description: "Listen to dialogues again", descriptionChinese: "再次听对话" },
  ],

  assessment: {
    type: "quiz",
    duration: 15,
    questions: [
      { question: "What does 'hello' mean?", questionChinese: "'hello'是什么意思？", type: "multiple_choice", options: ["再见", "你好", "谢谢"], correctAnswer: "你好", explanation: "'Hello' is a greeting.", explanationChinese: "'Hello'是问候语。" },
      { question: "Complete: My ___ is Li.", questionChinese: "完成句子：My ___ is Li.", type: "fill_blank", correctAnswer: "name", explanation: "'My name is' introduces yourself.", explanationChinese: "'My name is'用来介绍自己。" },
    ],
  },
};

// ============================================================
// Day 8: Numbers 11-20
// ============================================================

export const DAY_8_CURRICULUM: Day1Curriculum = {
  day: 8,
  title: "Numbers 11-20",
  titleChinese: "数字11-20",
  objectives: [
    "Learn numbers 11-20",
    "Practice counting",
    "Use numbers in sentences",
  ],
  objectivesChinese: [
    "学习数字11-20",
    "练习数数",
    "在句子中使用数字",
  ],
  totalMinutes: 240,

  vocabulary: [
    { id: "v8_1", word: "eleven", ipa: "/ɪˈlɛvən/", chinese: "十一", chinesePronunciation: "伊莱文", englishDefinition: "The number 11", example: "I have eleven books.", exampleChinese: "我有十一本书。", memoryMethod: "谐音：伊莱文 → 十一", difficulty: "easy" },
    { id: "v8_2", word: "twelve", ipa: "/twɛlv/", chinese: "十二", chinesePronunciation: "特沃尔夫", englishDefinition: "The number 12", example: "There are twelve months.", exampleChinese: "一年有十二个月。", memoryMethod: "谐音：特沃尔夫 → 十二", difficulty: "easy" },
    { id: "v8_3", word: "thirteen", ipa: "/ˌθɜːrˈtiːn/", chinese: "十三", chinesePronunciation: "瑟汀", englishDefinition: "The number 13", example: "I am thirteen years old.", exampleChinese: "我十三岁了。", memoryMethod: "three(三) + teen(十几) = 十三", difficulty: "easy" },
    { id: "v8_4", word: "fourteen", ipa: "/ˌfɔːrˈtiːn/", chinese: "十四", chinesePronunciation: "福汀", englishDefinition: "The number 14", example: "Fourteen days in two weeks.", exampleChinese: "两周有十四天。", memoryMethod: "four(四) + teen(十几) = 十四", difficulty: "easy" },
    { id: "v8_5", word: "fifteen", ipa: "/ˌfɪfˈtiːn/", chinese: "十五", chinesePronunciation: "菲夫汀", englishDefinition: "The number 15", example: "I have fifteen minutes.", exampleChinese: "我有十五分钟。", memoryMethod: "five(五) + teen(十几) = 十五", difficulty: "easy" },
    { id: "v8_6", word: "sixteen", ipa: "/ˌsɪksˈtiːn/", chinese: "十六", chinesePronunciation: "西克斯汀", englishDefinition: "The number 16", example: "Sixteen candles on the cake.", exampleChinese: "蛋糕上有十六根蜡烛。", memoryMethod: "six(六) + teen(十几) = 十六", difficulty: "easy" },
    { id: "v8_7", word: "seventeen", ipa: "/ˌsɛvənˈtiːn/", chinese: "十七", chinesePronunciation: "塞文汀", englishDefinition: "The number 17", example: "Seventeen students in class.", exampleChinese: "班上有十七个学生。", memoryMethod: "seven(七) + teen(十几) = 十七", difficulty: "easy" },
    { id: "v8_8", word: "eighteen", ipa: "/ˌeɪˈtiːn/", chinese: "十八", chinesePronunciation: "伊汀", englishDefinition: "The number 18", example: "I am eighteen years old.", exampleChinese: "我十八岁了。", memoryMethod: "eight(八) + teen(十几) = 十八", difficulty: "easy" },
    { id: "v8_9", word: "nineteen", ipa: "/ˌnaɪnˈtiːn/", chinese: "十九", chinesePronunciation: "乃恩汀", englishDefinition: "The number 19", example: "Nineteen plus one is twenty.", exampleChinese: "十九加一等于二十。", memoryMethod: "nine(九) + teen(十几) = 十九", difficulty: "easy" },
    { id: "v8_10", word: "twenty", ipa: "/ˈtwɛnti/", chinese: "二十", chinesePronunciation: "特文提", englishDefinition: "The number 20", example: "I have twenty dollars.", exampleChinese: "我有二十美元。", memoryMethod: "谐音：特文提 → 二十", difficulty: "easy" },
  ],

  phonics: [],

  listening: [
    {
      id: "l8_1",
      text: "How many books do you have? I have fifteen books.",
      textChinese: "你有几本书？我有十五本书。",
      audioSpeed: "slow",
      transcript: "How many books do you have? I have fifteen books.",
      transcriptChinese: "你有几本书？我有十五本书。",
      questions: [
        { question: "How many books?", questionChinese: "几本书？", options: ["13", "14", "15"], correctAnswer: 2 },
      ],
    },
    {
      id: "l8_2",
      text: "There are twelve months in a year.",
      textChinese: "一年有十二个月。",
      audioSpeed: "slow",
      transcript: "There are twelve months in a year.",
      transcriptChinese: "一年有十二个月。",
      questions: [
        { question: "How many months in a year?", questionChinese: "一年有几个月？", options: ["10", "11", "12"], correctAnswer: 2 },
      ],
    },
  ],

  speaking: [
    { id: "s8_1", modelSentence: "I have ___.", modelSentenceChinese: "我有___。", ipa: "/aɪ hæv/", shadowingPoints: ["I have"], commonMistakes: ["不要省略 'have'"], chineseHint: "我有...：I have + 数量" },
    { id: "s8_2", modelSentence: "There are ___ in a ___.", modelSentenceChinese: "一个___有___个。", ipa: "/ðɛr ɑːr ɪn ə/", shadowingPoints: ["There are", "in a"], commonMistakes: ["注意 'there are' 复数"], chineseHint: "有...：There are + 数量 + in + 地点" },
  ],

  reading: [
    {
      id: "r8_1",
      title: "My Classroom",
      titleChinese: "我的教室",
      content: `This is my classroom. 
There are fifteen desks. 
There are fifteen chairs. 
There are twenty students. 
I like my classroom.`,
      contentChinese: `这是我的教室。
有十五张桌子。
有十五把椅子。
有二十个学生。
我喜欢我的教室。`,
      vocabulary: ["classroom", "desks", "chairs", "students"],
      questions: [
        { question: "How many desks?", questionChinese: "几张桌子？", options: ["13", "14", "15"], correctAnswer: 2 },
        { question: "How many students?", questionChinese: "几个学生？", options: ["18", "19", "20"], correctAnswer: 2 },
      ],
    },
  ],

  writing: [
    { id: "w8_1", task: "Write the numbers 11-20 in English words", taskChinese: "用英语写出数字11-20", hints: ["eleven, twelve, thirteen..."], example: "11-eleven, 12-twelve, 13-thirteen", exampleChinese: "11-eleven, 12-twelve, 13-thirteen" },
  ],

  review: [
    { type: "vocabulary", duration: 30, description: "Review numbers 11-20", descriptionChinese: "复习数字11-20" },
  ],

  assessment: {
    type: "quiz",
    duration: 15,
    questions: [
      { question: "What does 'eleven' mean?", questionChinese: "'eleven'是什么意思？", type: "multiple_choice", options: ["十", "十一", "十二"], correctAnswer: "十一", explanation: "'Eleven' is the number 11.", explanationChinese: "'Eleven'是数字11。" },
      { question: "Complete: There are ___ months.", questionChinese: "完成句子：There are ___ months.", type: "fill_blank", correctAnswer: "twelve", explanation: "There are twelve months in a year.", explanationChinese: "一年有十二个月。" },
    ],
  },
};

// ============================================================
// Export all Day 7-14 curricula
// ============================================================

export const DAY_7_TO_14_CURRICULA: Record<number, Day1Curriculum> = {
  7: DAY_7_CURRICULUM,
  8: DAY_8_CURRICULUM,
  // Days 9-14 will be added similarly
};

export default DAY_7_TO_14_CURRICULA;
