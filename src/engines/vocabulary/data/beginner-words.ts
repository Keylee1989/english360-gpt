/**
 * Beginner Vocabulary Dataset - 300 Essential Words
 *
 * Quality > Quantity
 * Each word includes:
 * - IPA pronunciation
 * - Phonics breakdown
 * - Chinese meaning
 * - Part of speech
 * - CEFR level
 * - Difficulty
 * - Example sentences
 * - Memory methods
 *
 * Organized by frequency and learning progression.
 */

import type { VocabularyItem } from "../index";
import type { PartOfSpeech } from "@/types";

// ============================================================
// Helper to create vocabulary items
// ============================================================

function createWord(
  word: string,
  ipa: string,
  phonics: string,
  chinese: string,
  pos: PartOfSpeech[],
  cefr: "A1" | "A2" | "B1" | "B2" | "C1" | "C2",
  difficulty: "very_easy" | "easy" | "medium" | "hard" | "very_hard",
  examples: { en: string; zh: string }[],
  memory?: { association?: string; mnemonic?: string; chineseHint?: string; root?: string },
  relations?: { synonyms?: string[]; antonyms?: string[] }
): VocabularyItem {
  return {
    id: `vocab_${word.toLowerCase()}`,
    word,
    chineseMeaning: chinese,
    ipa,
    partOfSpeech: pos,
    frequency: 0,
    cefr,
    difficulty,
    examples: examples.map((e) => ({
      english: e.en,
      chinese: e.zh,
      register: "neutral" as const,
    })),
    collocations: [],
    chunks: [],
    wordFamily: { base: word, forms: [] },
    roots: memory?.root ? [{ form: memory.root, meaning: "", origin: "" }] : [],
    prefixes: [],
    suffixes: [],
    synonyms: relations?.synonyms || [],
    antonyms: relations?.antonyms || [],
    commonErrors: [],
    contexts: [],
    memoryMethods: {
      association: memory?.association,
      mnemonic: memory?.mnemonic,
      chinesePronHint: memory?.chineseHint,
      root: memory?.root,
    },
    phonicsBreakdown: phonics,
    syllableCount: word.split(/[^aeiou]/i).filter(Boolean).length || 1,
  };
}

// ============================================================
// Category 1: Greetings & Basics (1-20)
// ============================================================

const greetings: VocabularyItem[] = [
  createWord("hello", "/həˈloʊ/", "he-llo", "你好", ["interjection"], "A1", "very_easy",
    [{ en: "Hello, how are you?", zh: "你好，你好吗？" }],
    { chineseHint: "呵喽" }
  ),
  createWord("hi", "/haɪ/", "hi", "嗨", ["interjection"], "A1", "very_easy",
    [{ en: "Hi, nice to meet you.", zh: "嗨，很高兴认识你。" }],
    { chineseHint: "嗨" }
  ),
  createWord("goodbye", "/ɡʊdˈbaɪ/", "good-bye", "再见", ["interjection"], "A1", "very_easy",
    [{ en: "Goodbye, see you tomorrow.", zh: "再见，明天见。" }],
    { association: "Good + bye = 好的告别" }
  ),
  createWord("bye", "/baɪ/", "bye", "拜拜", ["interjection"], "A1", "very_easy",
    [{ en: "Bye, have a good day!", zh: "拜拜，祝你今天愉快！" }],
    { chineseHint: "拜拜" }
  ),
  createWord("yes", "/jɛs/", "yes", "是的", ["adverb"], "A1", "very_easy",
    [{ en: "Yes, I understand.", zh: "是的，我明白了。" }],
    { chineseHint: "耶斯" }
  ),
  createWord("no", "/noʊ/", "no", "不", ["adverb"], "A1", "very_easy",
    [{ en: "No, thank you.", zh: "不，谢谢。" }],
    { chineseHint: "诺" }
  ),
  createWord("please", "/pliːz/", "please", "请", ["adverb"], "A1", "very_easy",
    [{ en: "Please help me.", zh: "请帮帮我。" }],
    { chineseHint: "普利兹" }
  ),
  createWord("thank", "/θæŋk/", "thank", "谢谢", ["verb"], "A1", "very_easy",
    [{ en: "Thank you very much.", zh: "非常感谢你。" }],
    { chineseHint: "桑克" }
  ),
  createWord("sorry", "/ˈsɒri/", "sor-ry", "对不起", ["adjective"], "A1", "very_easy",
    [{ en: "I'm sorry, I'm late.", zh: "对不起，我迟到了。" }],
    { chineseHint: "扫瑞" }
  ),
  createWord("excuse", "/ɪkˈskjuːz/", "ex-cuse", "打扰一下", ["verb"], "A1", "easy",
    [{ en: "Excuse me, where is the bathroom?", zh: "打扰一下，厕所在哪里？" }],
    { root: "ex-" }
  ),
  createWord("good", "/ɡʊd/", "good", "好的", ["adjective"], "A1", "very_easy",
    [{ en: "This is good.", zh: "这个很好。" }],
    { chineseHint: "顾的" },
    { antonyms: ["bad"] }
  ),
  createWord("bad", "/bæd/", "bad", "坏的", ["adjective"], "A1", "very_easy",
    [{ en: "That's a bad idea.", zh: "那是个坏主意。" }],
    { chineseHint: "拜的" },
    { antonyms: ["good"] }
  ),
  createWord("ok", "/ˌoʊˈkeɪ/", "o-kay", "好的", ["adjective"], "A1", "very_easy",
    [{ en: "OK, let's go.", zh: "好的，我们走。" }],
    { chineseHint: "哦K" }
  ),
  createWord("right", "/raɪt/", "right", "对的", ["adjective"], "A1", "easy",
    [{ en: "You are right.", zh: "你是对的。" }],
    { association: "right = 右边 = 正确" },
    { antonyms: ["wrong"] }
  ),
  createWord("wrong", "/rɒŋ/", "wrong", "错的", ["adjective"], "A1", "easy",
    [{ en: "That's wrong.", zh: "那是错的。" }],
    { chineseHint: "容" },
    { antonyms: ["right"] }
  ),
  createWord("help", "/hɛlp/", "help", "帮助", ["verb", "noun"], "A1", "very_easy",
    [{ en: "Can you help me?", zh: "你能帮帮我吗？" }],
    { chineseHint: "黑了扑" }
  ),
  createWord("want", "/wɒnt/", "want", "想要", ["verb"], "A1", "very_easy",
    [{ en: "I want water.", zh: "我想要水。" }],
    { chineseHint: "旺特" }
  ),
  createWord("need", "/niːd/", "need", "需要", ["verb"], "A1", "very_easy",
    [{ en: "I need help.", zh: "我需要帮助。" }],
    { chineseHint: "你的" }
  ),
  createWord("like", "/laɪk/", "like", "喜欢", ["verb"], "A1", "very_easy",
    [{ en: "I like music.", zh: "我喜欢音乐。" }],
    { chineseHint: "赖克" }
  ),
  createWord("love", "/lʌv/", "love", "爱", ["verb", "noun"], "A1", "very_easy",
    [{ en: "I love you.", zh: "我爱你。" }],
    { chineseHint: "辣舞" }
  ),
];

// ============================================================
// Category 2: Pronouns (21-35)
// ============================================================

const pronouns: VocabularyItem[] = [
  createWord("I", "/aɪ/", "I", "我", ["pronoun"], "A1", "very_easy",
    [{ en: "I am a student.", zh: "我是学生。" }],
    { chineseHint: "艾" }
  ),
  createWord("you", "/juː/", "you", "你", ["pronoun"], "A1", "very_easy",
    [{ en: "You are my friend.", zh: "你是我的朋友。" }],
    { chineseHint: "优" }
  ),
  createWord("he", "/hiː/", "he", "他", ["pronoun"], "A1", "very_easy",
    [{ en: "He is tall.", zh: "他很高。" }],
    { chineseHint: "嘿" }
  ),
  createWord("she", "/ʃiː/", "she", "她", ["pronoun"], "A1", "very_easy",
    [{ en: "She is beautiful.", zh: "她很漂亮。" }],
    { chineseHint: "希" }
  ),
  createWord("it", "/ɪt/", "it", "它", ["pronoun"], "A1", "very_easy",
    [{ en: "It is a cat.", zh: "它是一只猫。" }],
    { chineseHint: "伊特" }
  ),
  createWord("we", "/wiː/", "we", "我们", ["pronoun"], "A1", "very_easy",
    [{ en: "We are friends.", zh: "我们是朋友。" }],
    { chineseHint: "维" }
  ),
  createWord("they", "/ðeɪ/", "they", "他们", ["pronoun"], "A1", "very_easy",
    [{ en: "They are happy.", zh: "他们很开心。" }],
    { chineseHint: "贼" }
  ),
  createWord("me", "/miː/", "me", "我（宾格）", ["pronoun"], "A1", "very_easy",
    [{ en: "Give it to me.", zh: "把它给我。" }],
    { chineseHint: "米" }
  ),
  createWord("him", "/hɪm/", "him", "他（宾格）", ["pronoun"], "A1", "easy",
    [{ en: "I saw him yesterday.", zh: "我昨天看到他了。" }],
    { chineseHint: "黑姆" }
  ),
  createWord("her", "/hɜːr/", "her", "她（宾格）", ["pronoun"], "A1", "easy",
    [{ en: "I like her.", zh: "我喜欢她。" }],
    { chineseHint: "赫" }
  ),
  createWord("my", "/maɪ/", "my", "我的", ["determiner"], "A1", "very_easy",
    [{ en: "This is my book.", zh: "这是我的书。" }],
    { chineseHint: "买" }
  ),
  createWord("your", "/jɔːr/", "your", "你的", ["determiner"], "A1", "very_easy",
    [{ en: "What is your name?", zh: "你叫什么名字？" }],
    { chineseHint: "优尔" }
  ),
  createWord("his", "/hɪz/", "his", "他的", ["determiner"], "A1", "very_easy",
    [{ en: "This is his car.", zh: "这是他的车。" }],
    { chineseHint: "黑兹" }
  ),
  createWord("this", "/ðɪs/", "this", "这个", ["determiner"], "A1", "very_easy",
    [{ en: "This is my phone.", zh: "这是我的手机。" }],
    { chineseHint: "贼斯" }
  ),
  createWord("that", "/ðæt/", "that", "那个", ["determiner"], "A1", "very_easy",
    [{ en: "That is a book.", zh: "那是一本书。" }],
    { chineseHint: "赛特" }
  ),
];

// ============================================================
// Category 3: Numbers (36-55)
// ============================================================

const numbers: VocabularyItem[] = [
  createWord("one", "/wʌn/", "one", "一", ["noun"], "A1", "very_easy",
    [{ en: "I have one cat.", zh: "我有一只猫。" }],
    { chineseHint: "万" }
  ),
  createWord("two", "/tuː/", "two", "二", ["noun"], "A1", "very_easy",
    [{ en: "There are two books.", zh: "有两本书。" }],
    { chineseHint: "兔" }
  ),
  createWord("three", "/θriː/", "three", "三", ["noun"], "A1", "very_easy",
    [{ en: "Three people are here.", zh: "三个人在这里。" }],
    { chineseHint: "斯瑞" }
  ),
  createWord("four", "/fɔːr/", "four", "四", ["noun"], "A1", "very_easy",
    [{ en: "I have four apples.", zh: "我有四个苹果。" }],
    { chineseHint: "佛" }
  ),
  createWord("five", "/faɪv/", "five", "五", ["noun"], "A1", "very_easy",
    [{ en: "There are five stars.", zh: "有五颗星。" }],
    { chineseHint: "夫爱舞" }
  ),
  createWord("six", "/sɪks/", "six", "六", ["noun"], "A1", "very_easy",
    [{ en: "Six o'clock.", zh: "六点钟。" }],
    { chineseHint: "赛克斯" }
  ),
  createWord("seven", "/ˈsɛvən/", "sev-en", "七", ["noun"], "A1", "very_easy",
    [{ en: "Seven days a week.", zh: "一周七天。" }],
    { chineseHint: "塞文" }
  ),
  createWord("eight", "/eɪt/", "eight", "八", ["noun"], "A1", "very_easy",
    [{ en: "I am eight years old.", zh: "我八岁了。" }],
    { chineseHint: "诶特" }
  ),
  createWord("nine", "/naɪn/", "nine", "九", ["noun"], "A1", "very_easy",
    [{ en: "There are nine cats.", zh: "有九只猫。" }],
    { chineseHint: "耐恩" }
  ),
  createWord("ten", "/tɛn/", "ten", "十", ["noun"], "A1", "very_easy",
    [{ en: "I have ten fingers.", zh: "我有十根手指。" }],
    { chineseHint: "疼" }
  ),
  createWord("hundred", "/ˈhʌndrəd/", "hun-dred", "一百", ["noun"], "A1", "easy",
    [{ en: "One hundred dollars.", zh: "一百美元。" }],
    { chineseHint: "汉德瑞的" }
  ),
  createWord("thousand", "/ˈθaʊzənd/", "thou-sand", "一千", ["noun"], "A1", "easy",
    [{ en: "One thousand people.", zh: "一千人。" }],
    { chineseHint: "骚赞的" }
  ),
  createWord("first", "/fɜːrst/", "first", "第一", ["adjective"], "A1", "easy",
    [{ en: "This is my first day.", zh: "这是我的第一天。" }],
    { association: "1st = first" }
  ),
  createWord("second", "/ˈsɛkənd/", "sec-ond", "第二", ["adjective"], "A1", "easy",
    [{ en: "This is the second time.", zh: "这是第二次。" }],
    { association: "2nd = second" }
  ),
  createWord("third", "/θɜːrd/", "third", "第三", ["adjective"], "A1", "easy",
    [{ en: "Turn left at the third street.", zh: "在第三条街左转。" }],
    { association: "3rd = third" }
  ),
  createWord("zero", "/ˈzɪəroʊ/", "ze-ro", "零", ["noun"], "A1", "easy",
    [{ en: "The temperature is zero.", zh: "温度是零度。" }],
    { chineseHint: "贼肉" }
  ),
  createWord("half", "/hæf/", "half", "一半", ["noun"], "A1", "easy",
    [{ en: "Half an hour.", zh: "半小时。" }],
    { chineseHint: "哈夫" }
  ),
  createWord("quarter", "/ˈkwɔːrtər/", "quar-ter", "四分之一", ["noun"], "A1", "medium",
    [{ en: "A quarter of an hour.", zh: "一刻钟。" }],
    { chineseHint: "阔特" }
  ),
  createWord("dozen", "/ˈdʌzən/", "doz-en", "一打（12个）", ["noun"], "A2", "medium",
    [{ en: "A dozen eggs.", zh: "一打鸡蛋。" }],
    { chineseHint: "大曾" }
  ),
  createWord("pair", "/pɛr/", "pair", "一对", ["noun"], "A1", "easy",
    [{ en: "A pair of shoes.", zh: "一双鞋。" }],
    { chineseHint: "配尔" }
  ),
];

// ============================================================
// Category 4: Common Nouns - People (56-80)
// ============================================================

const peopleNouns: VocabularyItem[] = [
  createWord("person", "/ˈpɜːrsən/", "per-son", "人", ["noun"], "A1", "very_easy",
    [{ en: "She is a nice person.", zh: "她是个好人。" }],
    { chineseHint: "泼森" }
  ),
  createWord("man", "/mæn/", "man", "男人", ["noun"], "A1", "very_easy",
    [{ en: "The man is tall.", zh: "这个男人很高。" }],
    { chineseHint: "曼" }
  ),
  createWord("woman", "/ˈwʊmən/", "wo-man", "女人", ["noun"], "A1", "very_easy",
    [{ en: "The woman is happy.", zh: "这个女人很开心。" }],
    { chineseHint: "乌门" }
  ),
  createWord("child", "/tʃaɪld/", "child", "孩子", ["noun"], "A1", "easy",
    [{ en: "The child is playing.", zh: "孩子在玩耍。" }],
    { chineseHint: "柴尔的" }
  ),
  createWord("baby", "/ˈbeɪbi/", "ba-by", "婴儿", ["noun"], "A1", "very_easy",
    [{ en: "The baby is sleeping.", zh: "婴儿在睡觉。" }],
    { chineseHint: "贝比" }
  ),
  createWord("friend", "/frɛnd/", "friend", "朋友", ["noun"], "A1", "very_easy",
    [{ en: "She is my best friend.", zh: "她是我最好的朋友。" }],
    { chineseHint: "弗兰的" }
  ),
  createWord("family", "/ˈfæməli/", "fam-i-ly", "家庭", ["noun"], "A1", "very_easy",
    [{ en: "I love my family.", zh: "我爱我的家人。" }],
    { chineseHint: "发美丽" }
  ),
  createWord("mother", "/ˈmʌðər/", "moth-er", "母亲", ["noun"], "A1", "very_easy",
    [{ en: "My mother is a teacher.", zh: "我妈妈是老师。" }],
    { chineseHint: "马泽" }
  ),
  createWord("father", "/ˈfɑːðər/", "fath-er", "父亲", ["noun"], "A1", "very_easy",
    [{ en: "My father works hard.", zh: "我爸爸工作很努力。" }],
    { chineseHint: "法泽" }
  ),
  createWord("brother", "/ˈbrʌðər/", "broth-er", "兄弟", ["noun"], "A1", "very_easy",
    [{ en: "I have one brother.", zh: "我有一个兄弟。" }],
    { chineseHint: "布拉的" }
  ),
  createWord("sister", "/ˈsɪstər/", "sis-ter", "姐妹", ["noun"], "A1", "very_easy",
    [{ en: "My sister is tall.", zh: "我姐姐很高。" }],
    { chineseHint: "西斯特" }
  ),
  createWord("son", "/sʌn/", "son", "儿子", ["noun"], "A1", "very_easy",
    [{ en: "My son is five years old.", zh: "我儿子五岁了。" }],
    { chineseHint: "桑" }
  ),
  createWord("daughter", "/ˈdɔːtər/", "daugh-ter", "女儿", ["noun"], "A1", "very_easy",
    [{ en: "My daughter is a student.", zh: "我女儿是学生。" }],
    { chineseHint: "稻特" }
  ),
  createWord("teacher", "/ˈtiːtʃər/", "teach-er", "老师", ["noun"], "A1", "very_easy",
    [{ en: "The teacher is kind.", zh: "老师很善良。" }],
    { association: "teach(教) + er(人) = 教的人" }
  ),
  createWord("student", "/ˈstjuːdənt/", "stu-dent", "学生", ["noun"], "A1", "very_easy",
    [{ en: "I am a student.", zh: "我是学生。" }],
    { chineseHint: "斯丢登特" }
  ),
  createWord("doctor", "/ˈdɒktər/", "doc-tor", "医生", ["noun"], "A1", "very_easy",
    [{ en: "The doctor helps people.", zh: "医生帮助病人。" }],
    { chineseHint: "道克特" }
  ),
  createWord("nurse", "/nɜːrs/", "nurse", "护士", ["noun"], "A1", "easy",
    [{ en: "The nurse is helpful.", zh: "护士很乐于助人。" }],
    { chineseHint: "纳斯" }
  ),
  createWord("driver", "/ˈdraɪvər/", "driv-er", "司机", ["noun"], "A1", "easy",
    [{ en: "The driver is careful.", zh: "司机很小心。" }],
    { association: "drive(驾驶) + er(人) = 驾驶的人" }
  ),
  createWord("cook", "/kʊk/", "cook", "厨师", ["noun", "verb"], "A1", "easy",
    [{ en: "My father is a good cook.", zh: "我爸爸是个好厨师。" }],
    { chineseHint: "酷客" }
  ),
  createWord("neighbor", "/ˈneɪbər/", "neigh-bor", "邻居", ["noun"], "A1", "medium",
    [{ en: "Our neighbor is friendly.", zh: "我们的邻居很友好。" }],
    { chineseHint: "内波" }
  ),
  createWord("people", "/ˈpiːpəl/", "peo-ple", "人们", ["noun"], "A1", "very_easy",
    [{ en: "Many people live here.", zh: "很多人住在这里。" }],
    { chineseHint: "皮剖" }
  ),
];

// ============================================================
// Category 5: Body Parts (81-100)
// ============================================================

const bodyParts: VocabularyItem[] = [
  createWord("head", "/hɛd/", "head", "头", ["noun"], "A1", "very_easy",
    [{ en: "Touch your head.", zh: "摸摸你的头。" }],
    { chineseHint: "黑的" }
  ),
  createWord("eye", "/aɪ/", "eye", "眼睛", ["noun"], "A1", "very_easy",
    [{ en: "I have two eyes.", zh: "我有两只眼睛。" }],
    { chineseHint: "爱" }
  ),
  createWord("ear", "/ɪr/", "ear", "耳朵", ["noun"], "A1", "very_easy",
    [{ en: "I hear with my ears.", zh: "我用耳朵听。" }],
    { chineseHint: "伊尔" }
  ),
  createWord("nose", "/noʊz/", "nose", "鼻子", ["noun"], "A1", "very_easy",
    [{ en: "I smell with my nose.", zh: "我用鼻子闻。" }],
    { chineseHint: "诺兹" }
  ),
  createWord("mouth", "/maʊθ/", "mouth", "嘴巴", ["noun"], "A1", "very_easy",
    [{ en: "Open your mouth.", zh: "张开你的嘴巴。" }],
    { chineseHint: "毛斯" }
  ),
  createWord("tooth", "/tuːθ/", "tooth", "牙齿", ["noun"], "A1", "easy",
    [{ en: "Brush your teeth.", zh: "刷牙。" }],
    { chineseHint: "图斯" }
  ),
  createWord("hand", "/hænd/", "hand", "手", ["noun"], "A1", "very_easy",
    [{ en: "Raise your hand.", zh: "举手。" }],
    { chineseHint: "汉的" }
  ),
  createWord("finger", "/ˈfɪŋɡər/", "fin-ger", "手指", ["noun"], "A1", "easy",
    [{ en: "I have ten fingers.", zh: "我有十根手指。" }],
    { chineseHint: " fing 哥" }
  ),
  createWord("arm", "/ɑːrm/", "arm", "手臂", ["noun"], "A1", "very_easy",
    [{ en: "I have two arms.", zh: "我有两只手臂。" }],
    { chineseHint: "阿姆" }
  ),
  createWord("leg", "/lɛɡ/", "leg", "腿", ["noun"], "A1", "very_easy",
    [{ en: "My leg hurts.", zh: "我的腿疼。" }],
    { chineseHint: "莱格" }
  ),
  createWord("foot", "/fʊt/", "foot", "脚", ["noun"], "A1", "very_easy",
    [{ en: "I have two feet.", zh: "我有两只脚。" }],
    { chineseHint: "富特" }
  ),
  createWord("hair", "/hɛr/", "hair", "头发", ["noun"], "A1", "very_easy",
    [{ en: "She has long hair.", zh: "她有长头发。" }],
    { chineseHint: "黑尔" }
  ),
  createWord("face", "/feɪs/", "face", "脸", ["noun"], "A1", "very_easy",
    [{ en: "Wash your face.", zh: "洗脸。" }],
    { chineseHint: "费斯" }
  ),
  createWord("body", "/ˈbɒdi/", "bo-dy", "身体", ["noun"], "A1", "very_easy",
    [{ en: "My body is healthy.", zh: "我的身体很健康。" }],
    { chineseHint: "波迪" }
  ),
  createWord("back", "/bæk/", "back", "背", ["noun"], "A1", "easy",
    [{ en: "My back hurts.", zh: "我的背疼。" }],
    { chineseHint: "拜客" }
  ),
  createWord("stomach", "/ˈstʌmək/", "stom-ach", "胃", ["noun"], "A1", "easy",
    [{ en: "My stomach is full.", zh: "我的胃饱了。" }],
    { chineseHint: "斯塔马克" }
  ),
  createWord("neck", "/nɛk/", "neck", "脖子", ["noun"], "A1", "easy",
    [{ en: "I have a long neck.", zh: "我的脖子很长。" }],
    { chineseHint: "耐客" }
  ),
  createWord("knee", "/niː/", "knee", "膝盖", ["noun"], "A1", "easy",
    [{ en: "I hurt my knee.", zh: "我伤到了膝盖。" }],
    { chineseHint: "尼" }
  ),
  createWord("shoulder", "/ˈʃoʊldər/", "shoul-der", "肩膀", ["noun"], "A1", "medium",
    [{ en: "He has broad shoulders.", zh: "他的肩膀很宽。" }],
    { chineseHint: "收的" }
  ),
  createWord("chest", "/tʃɛst/", "chest", "胸", ["noun"], "A1", "easy",
    [{ en: "He has a strong chest.", zh: "他的胸很强壮。" }],
    { chineseHint: "切斯特" }
  ),
];

// ============================================================
// Category 6: Food & Drink (101-130)
// ============================================================

const foodDrink: VocabularyItem[] = [
  createWord("water", "/ˈwɔːtər/", "wa-ter", "水", ["noun"], "A1", "very_easy",
    [{ en: "I want water.", zh: "我想要水。" }],
    { chineseHint: "沃特" }
  ),
  createWord("food", "/fuːd/", "food", "食物", ["noun"], "A1", "very_easy",
    [{ en: "The food is delicious.", zh: "食物很好吃。" }],
    { chineseHint: "富的" }
  ),
  createWord("bread", "/brɛd/", "bread", "面包", ["noun"], "A1", "very_easy",
    [{ en: "I eat bread for breakfast.", zh: "我早餐吃面包。" }],
    { chineseHint: "不来的" }
  ),
  createWord("rice", "/raɪs/", "rice", "米饭", ["noun"], "A1", "very_easy",
    [{ en: "I like rice.", zh: "我喜欢米饭。" }],
    { chineseHint: "入爱斯" }
  ),
  createWord("egg", "/ɛɡ/", "egg", "鸡蛋", ["noun"], "A1", "very_easy",
    [{ en: "I want an egg.", zh: "我想要一个鸡蛋。" }],
    { chineseHint: "爱格" }
  ),
  createWord("milk", "/mɪlk/", "milk", "牛奶", ["noun"], "A1", "very_easy",
    [{ en: "I drink milk.", zh: "我喝牛奶。" }],
    { chineseHint: "米欧克" }
  ),
  createWord("tea", "/tiː/", "tea", "茶", ["noun"], "A1", "very_easy",
    [{ en: "I like green tea.", zh: "我喜欢绿茶。" }],
    { chineseHint: "提" }
  ),
  createWord("coffee", "/ˈkɒfi/", "cof-fee", "咖啡", ["noun"], "A1", "very_easy",
    [{ en: "I drink coffee.", zh: "我喝咖啡。" }],
    { chineseHint: "靠飞" }
  ),
  createWord("juice", "/dʒuːs/", "juice", "果汁", ["noun"], "A1", "very_easy",
    [{ en: "I want orange juice.", zh: "我想要橙汁。" }],
    { chineseHint: "橘斯" }
  ),
  createWord("apple", "/ˈæpəl/", "ap-ple", "苹果", ["noun"], "A1", "very_easy",
    [{ en: "I eat an apple.", zh: "我吃一个苹果。" }],
    { chineseHint: "爱剖" }
  ),
  createWord("banana", "/bəˈnænə/", "ba-na-na", "香蕉", ["noun"], "A1", "very_easy",
    [{ en: "I like bananas.", zh: "我喜欢香蕉。" }],
    { chineseHint: "巴拿拿" }
  ),
  createWord("orange", "/ˈɒrɪndʒ/", "or-ange", "橙子", ["noun", "adjective"], "A1", "very_easy",
    [{ en: "The orange is sweet.", zh: "橙子很甜。" }],
    { chineseHint: "奥润吉" }
  ),
  createWord("meat", "/miːt/", "meat", "肉", ["noun"], "A1", "very_easy",
    [{ en: "I like meat.", zh: "我喜欢肉。" }],
    { chineseHint: "米特" }
  ),
  createWord("chicken", "/ˈtʃɪkɪn/", "chick-en", "鸡肉", ["noun"], "A1", "very_easy",
    [{ en: "I eat chicken.", zh: "我吃鸡肉。" }],
    { chineseHint: "去肯" }
  ),
  createWord("fish", "/fɪʃ/", "fish", "鱼", ["noun"], "A1", "very_easy",
    [{ en: "I like fish.", zh: "我喜欢鱼。" }],
    { chineseHint: "费什" }
  ),
  createWord("vegetable", "/ˈvɛdʒtəbəl/", "veg-e-table", "蔬菜", ["noun"], "A1", "easy",
    [{ en: "Eat your vegetables.", zh: "吃蔬菜。" }],
    { chineseHint: "歪者剖" }
  ),
  createWord("fruit", "/fruːt/", "fruit", "水果", ["noun"], "A1", "easy",
    [{ en: "I like fruit.", zh: "我喜欢水果。" }],
    { chineseHint: "弗入特" }
  ),
  createWord("sugar", "/ˈʃʊɡər/", "su-gar", "糖", ["noun"], "A1", "easy",
    [{ en: "No sugar, please.", zh: "请不要糖。" }],
    { chineseHint: "舒格" }
  ),
  createWord("salt", "/sɒlt/", "salt", "盐", ["noun"], "A1", "easy",
    [{ en: "Pass the salt.", zh: "把盐递给我。" }],
    { chineseHint: "扫特" }
  ),
  createWord("cake", "/keɪk/", "cake", "蛋糕", ["noun"], "A1", "very_easy",
    [{ en: "I like chocolate cake.", zh: "我喜欢巧克力蛋糕。" }],
    { chineseHint: "克一克" }
  ),
  createWord("noodle", "/ˈnuːdəl/", "noo-dle", "面条", ["noun"], "A1", "easy",
    [{ en: "I like noodle soup.", zh: "我喜欢面条汤。" }],
    { chineseHint: "怒的" }
  ),
  createWord("soup", "/suːp/", "soup", "汤", ["noun"], "A1", "easy",
    [{ en: "The soup is hot.", zh: "汤很热。" }],
    { chineseHint: "苏普" }
  ),
  createWord("cheese", "/tʃiːz/", "cheese", "奶酪", ["noun"], "A1", "easy",
    [{ en: "I like cheese.", zh: "我喜欢奶酪。" }],
    { chineseHint: "起子" }
  ),
  createWord("chocolate", "/ˈtʃɒklət/", "choc-o-late", "巧克力", ["noun"], "A1", "easy",
    [{ en: "I love chocolate.", zh: "我爱巧克力。" }],
    { chineseHint: "巧可雷特" }
  ),
  createWord("ice cream", "/ˌaɪs ˈkriːm/", "ice cream", "冰淇淋", ["noun"], "A1", "easy",
    [{ en: "I want ice cream.", zh: "我想要冰淇淋。" }],
    { association: "ice(冰) + cream(奶油) = 冰淇淋" }
  ),
  createWord("breakfast", "/ˈbrɛkfəst/", "break-fast", "早餐", ["noun"], "A1", "very_easy",
    [{ en: "I eat breakfast at 7.", zh: "我7点吃早餐。" }],
    { association: "break(打破) + fast(禁食) = 打破禁食" }
  ),
  createWord("lunch", "/lʌntʃ/", "lunch", "午餐", ["noun"], "A1", "very_easy",
    [{ en: "I eat lunch at noon.", zh: "我中午吃午餐。" }],
    { chineseHint: "兰去" }
  ),
  createWord("dinner", "/ˈdɪnər/", "din-ner", "晚餐", ["noun"], "A1", "very_easy",
    [{ en: "Dinner is ready.", zh: "晚餐准备好了。" }],
    { chineseHint: "迪呢" }
  ),
];

// ============================================================
// Category 7: Clothing (131-145)
// ============================================================

const clothing: VocabularyItem[] = [
  createWord("clothes", "/kloʊðz/", "clothes", "衣服", ["noun"], "A1", "very_easy",
    [{ en: "I like these clothes.", zh: "我喜欢这些衣服。" }],
    { chineseHint: "克楼兹" }
  ),
  createWord("shirt", "/ʃɜːrt/", "shirt", "衬衫", ["noun"], "A1", "very_easy",
    [{ en: "This shirt is nice.", zh: "这件衬衫很好看。" }],
    { chineseHint: "舍特" }
  ),
  createWord("pants", "/pænts/", "pants", "裤子", ["noun"], "A1", "very_easy",
    [{ en: "I wear blue pants.", zh: "我穿蓝色裤子。" }],
    { chineseHint: "盼茨" }
  ),
  createWord("shoes", "/ʃuːz/", "shoes", "鞋子", ["noun"], "A1", "very_easy",
    [{ en: "These shoes are comfortable.", zh: "这双鞋很舒服。" }],
    { chineseHint: "输子" }
  ),
  createWord("hat", "/hæt/", "hat", "帽子", ["noun"], "A1", "very_easy",
    [{ en: "I wear a hat.", zh: "我戴帽子。" }],
    { chineseHint: "害特" }
  ),
  createWord("jacket", "/ˈdʒækɪt/", "jack-et", "夹克", ["noun"], "A1", "easy",
    [{ en: "It's cold, wear your jacket.", zh: "很冷，穿上你的夹克。" }],
    { chineseHint: "杰克特" }
  ),
  createWord("dress", "/drɛs/", "dress", "连衣裙", ["noun"], "A1", "easy",
    [{ en: "She wears a red dress.", zh: "她穿红色连衣裙。" }],
    { chineseHint: "拽斯" }
  ),
  createWord("skirt", "/skɜːrt/", "skirt", "裙子", ["noun"], "A1", "easy",
    [{ en: "The skirt is pretty.", zh: "这条裙子很漂亮。" }],
    { chineseHint: "斯克特" }
  ),
  createWord("socks", "/sɒks/", "socks", "袜子", ["noun"], "A1", "easy",
    [{ en: "I wear white socks.", zh: "我穿白色袜子。" }],
    { chineseHint: "扫克斯" }
  ),
  createWord("coat", "/koʊt/", "coat", "外套", ["noun"], "A1", "easy",
    [{ en: "Put on your coat.", zh: "穿上你的外套。" }],
    { chineseHint: "扣特" }
  ),
  createWord("sweater", "/ˈswɛtər/", "sweat-er", "毛衣", ["noun"], "A1", "easy",
    [{ en: "I wear a sweater.", zh: "我穿毛衣。" }],
    { association: "sweat(汗) + er = 汗衫 → 毛衣" }
  ),
  createWord("jeans", "/dʒiːnz/", "jeans", "牛仔裤", ["noun"], "A1", "easy",
    [{ en: "I like blue jeans.", zh: "我喜欢蓝色牛仔裤。" }],
    { chineseHint: "金子" }
  ),
  createWord("uniform", "/ˈjuːnɪfɔːrm/", "u-ni-form", "制服", ["noun"], "A1", "medium",
    [{ en: "I wear a uniform to school.", zh: "我穿制服上学。" }],
    { association: "uni(统一) + form(形式) = 统一的形式" }
  ),
  createWord("pocket", "/ˈpɒkɪt/", "pock-et", "口袋", ["noun"], "A1", "easy",
    [{ en: "My keys are in my pocket.", zh: "我的钥匙在口袋里。" }],
    { chineseHint: "帕克特" }
  ),
  createWord("button", "/ˈbʌtən/", "but-ton", "纽扣", ["noun"], "A1", "medium",
    [{ en: "Button your shirt.", zh: "扣上你的衬衫。" }],
    { chineseHint: "巴疼" }
  ),
];

// ============================================================
// Category 8: House & Home (146-170)
// ============================================================

const houseHome: VocabularyItem[] = [
  createWord("home", "/hoʊm/", "home", "家", ["noun"], "A1", "very_easy",
    [{ en: "I am at home.", zh: "我在家。" }],
    { chineseHint: "厚姆" }
  ),
  createWord("house", "/haʊs/", "house", "房子", ["noun"], "A1", "very_easy",
    [{ en: "This is my house.", zh: "这是我的房子。" }],
    { chineseHint: "豪斯" }
  ),
  createWord("room", "/ruːm/", "room", "房间", ["noun"], "A1", "very_easy",
    [{ en: "My room is clean.", zh: "我的房间很干净。" }],
    { chineseHint: "入姆" }
  ),
  createWord("door", "/dɔːr/", "door", "门", ["noun"], "A1", "very_easy",
    [{ en: "Close the door.", zh: "关门。" }],
    { chineseHint: "多" }
  ),
  createWord("window", "/ˈwɪndoʊ/", "win-dow", "窗户", ["noun"], "A1", "very_easy",
    [{ en: "Open the window.", zh: "打开窗户。" }],
    { chineseHint: "温度" }
  ),
  createWord("bed", "/bɛd/", "bed", "床", ["noun"], "A1", "very_easy",
    [{ en: "I sleep in my bed.", zh: "我在床上睡觉。" }],
    { chineseHint: "败的" }
  ),
  createWord("table", "/ˈteɪbəl/", "ta-ble", "桌子", ["noun"], "A1", "very_easy",
    [{ en: "The food is on the table.", zh: "食物在桌子上。" }],
    { chineseHint: "特宝" }
  ),
  createWord("chair", "/tʃɛr/", "chair", "椅子", ["noun"], "A1", "very_easy",
    [{ en: "Sit on the chair.", zh: "坐在椅子上。" }],
    { chineseHint: "切尔" }
  ),
  createWord("kitchen", "/ˈkɪtʃɪn/", "kitch-en", "厨房", ["noun"], "A1", "very_easy",
    [{ en: "I cook in the kitchen.", zh: "我在厨房做饭。" }],
    { chineseHint: "去陈" }
  ),
  createWord("bathroom", "/ˈbæθruːm/", "bath-room", "浴室", ["noun"], "A1", "very_easy",
    [{ en: "The bathroom is clean.", zh: "浴室很干净。" }],
    { association: "bath(洗澡) + room(房间) = 浴室" }
  ),
  createWord("bedroom", "/ˈbɛdruːm/", "bed-room", "卧室", ["noun"], "A1", "very_easy",
    [{ en: "My bedroom is small.", zh: "我的卧室很小。" }],
    { association: "bed(床) + room(房间) = 卧室" }
  ),
  createWord("living room", "/ˈlɪvɪŋ ruːm/", "liv-ing room", "客厅", ["noun"], "A1", "easy",
    [{ en: "We watch TV in the living room.", zh: "我们在客厅看电视。" }],
    { association: "living(生活) + room(房间) = 客厅" }
  ),
  createWord("garden", "/ˈɡɑːrdən/", "gar-den", "花园", ["noun"], "A1", "easy",
    [{ en: "I have a beautiful garden.", zh: "我有一个漂亮的花园。" }],
    { chineseHint: "嘎登" }
  ),
  createWord("floor", "/flɔːr/", "floor", "地板", ["noun"], "A1", "easy",
    [{ en: "The floor is clean.", zh: "地板很干净。" }],
    { chineseHint: "弗洛" }
  ),
  createWord("wall", "/wɔːl/", "wall", "墙", ["noun"], "A1", "easy",
    [{ en: "The wall is white.", zh: "墙是白色的。" }],
    { chineseHint: "沃" }
  ),
  createWord("ceiling", "/ˈsiːlɪŋ/", "ceil-ing", "天花板", ["noun"], "A1", "medium",
    [{ en: "The ceiling is high.", zh: "天花板很高。" }],
    { chineseHint: "西令" }
  ),
  createWord("roof", "/ruːf/", "roof", "屋顶", ["noun"], "A1", "easy",
    [{ en: "The roof is red.", zh: "屋顶是红色的。" }],
    { chineseHint: "入弗" }
  ),
  createWord("key", "/kiː/", "key", "钥匙", ["noun"], "A1", "very_easy",
    [{ en: "Where is my key?", zh: "我的钥匙在哪里？" }],
    { chineseHint: "克一" }
  ),
  createWord("light", "/laɪt/", "light", "灯", ["noun", "adjective"], "A1", "easy",
    [{ en: "Turn on the light.", zh: "打开灯。" }],
    { chineseHint: "莱特" }
  ),
  createWord("lamp", "/læmp/", "lamp", "台灯", ["noun"], "A1", "easy",
    [{ en: "The lamp is bright.", zh: "台灯很亮。" }],
    { chineseHint: "蓝普" }
  ),
  createWord("clock", "/klɒk/", "clock", "钟", ["noun"], "A1", "easy",
    [{ en: "The clock shows 10.", zh: "钟显示10点。" }],
    { chineseHint: "克劳克" }
  ),
  createWord("picture", "/ˈpɪktʃər/", "pic-ture", "图片", ["noun"], "A1", "easy",
    [{ en: "There is a picture on the wall.", zh: "墙上有一幅画。" }],
    { chineseHint: "皮克彻" }
  ),
  createWord("cupboard", "/ˈkʌbərd/", "cup-board", "橱柜", ["noun"], "A1", "medium",
    [{ en: "The dishes are in the cupboard.", zh: "盘子在橱柜里。" }],
    { association: "cup(杯子) + board(板) = 杯子板 → 橱柜" }
  ),
  createWord("bottle", "/ˈbɒtəl/", "bot-tle", "瓶子", ["noun"], "A1", "easy",
    [{ en: "I drink from a bottle.", zh: "我从瓶子里喝。" }],
    { chineseHint: "波头" }
  ),
  createWord("cup", "/kʌp/", "cup", "杯子", ["noun"], "A1", "very_easy",
    [{ en: "I drink from a cup.", zh: "我用杯子喝。" }],
    { chineseHint: "卡普" }
  ),
];

// ============================================================
// Category 9: Places (171-190)
// ============================================================

const places: VocabularyItem[] = [
  createWord("school", "/skuːl/", "school", "学校", ["noun"], "A1", "very_easy",
    [{ en: "I go to school.", zh: "我去上学。" }],
    { chineseHint: "斯酷" }
  ),
  createWord("hospital", "/ˈhɒspɪtəl/", "hos-pi-tal", "医院", ["noun"], "A1", "very_easy",
    [{ en: "He is at the hospital.", zh: "他在医院。" }],
    { chineseHint: "好斯皮头" }
  ),
  createWord("store", "/stɔːr/", "store", "商店", ["noun"], "A1", "very_easy",
    [{ en: "I buy food at the store.", zh: "我在商店买食物。" }],
    { chineseHint: "斯多" }
  ),
  createWord("bank", "/bæŋk/", "bank", "银行", ["noun"], "A1", "easy",
    [{ en: "I go to the bank.", zh: "我去银行。" }],
    { chineseHint: "办客" }
  ),
  createWord("restaurant", "/ˈrɛstərɒnt/", "restau-rant", "餐厅", ["noun"], "A1", "easy",
    [{ en: "We eat at a restaurant.", zh: "我们在餐厅吃饭。" }],
    { chineseHint: "来斯特容特" }
  ),
  createWord("park", "/pɑːrk/", "park", "公园", ["noun"], "A1", "very_easy",
    [{ en: "I walk in the park.", zh: "我在公园散步。" }],
    { chineseHint: "帕克" }
  ),
  createWord("market", "/ˈmɑːrkɪt/", "mar-ket", "市场", ["noun"], "A1", "easy",
    [{ en: "I buy vegetables at the market.", zh: "我在市场买菜。" }],
    { chineseHint: "马克特" }
  ),
  createWord("street", "/striːt/", "street", "街道", ["noun"], "A1", "easy",
    [{ en: "I walk on the street.", zh: "我在街上走。" }],
    { chineseHint: "斯追特" }
  ),
  createWord("city", "/ˈsɪti/", "ci-ty", "城市", ["noun"], "A1", "very_easy",
    [{ en: "I live in a big city.", zh: "我住在一个大城市。" }],
    { chineseHint: "斯提" }
  ),
  createWord("country", "/ˈkʌntri/", "coun-try", "国家", ["noun"], "A1", "easy",
    [{ en: "China is a big country.", zh: "中国是一个大国。" }],
    { chineseHint: "康吹" }
  ),
  createWord("world", "/wɜːrld/", "world", "世界", ["noun"], "A1", "easy",
    [{ en: "The world is beautiful.", zh: "世界很美。" }],
    { chineseHint: "沃的" }
  ),
  createWord("office", "/ˈɒfɪs/", "of-fice", "办公室", ["noun"], "A1", "easy",
    [{ en: "I work in an office.", zh: "我在办公室工作。" }],
    { chineseHint: "奥非斯" }
  ),
  createWord("church", "/tʃɜːrtʃ/", "church", "教堂", ["noun"], "A1", "easy",
    [{ en: "We go to church.", zh: "我们去教堂。" }],
    { chineseHint: "切去" }
  ),
  createWord("hotel", "/hoʊˈtɛl/", "ho-tel", "酒店", ["noun"], "A1", "easy",
    [{ en: "We stay at a hotel.", zh: "我们住在酒店。" }],
    { chineseHint: "厚太欧" }
  ),
  createWord("airport", "/ˈɛrpɔːrt/", "air-port", "机场", ["noun"], "A1", "easy",
    [{ en: "I go to the airport.", zh: "我去机场。" }],
    { association: "air(空气) + port(港口) = 机场" }
  ),
  createWord("station", "/ˈsteɪʃən/", "sta-tion", "站", ["noun"], "A1", "easy",
    [{ en: "I go to the train station.", zh: "我去火车站。" }],
    { chineseHint: "斯忒神" }
  ),
  createWord("library", "/ˈlaɪbrɛri/", "li-brary", "图书馆", ["noun"], "A1", "easy",
    [{ en: "I study at the library.", zh: "我在图书馆学习。" }],
    { chineseHint: "赖布瑞" }
  ),
  createWord("post office", "/poʊst ˈɒfɪs/", "post office", "邮局", ["noun"], "A1", "easy",
    [{ en: "I go to the post office.", zh: "我去邮局。" }],
    { association: "post(邮寄) + office(办公室) = 邮局" }
  ),
];

// ============================================================
// Category 10: Time & Weather (191-210)
// ============================================================

const timeWeather: VocabularyItem[] = [
  createWord("time", "/taɪm/", "time", "时间", ["noun"], "A1", "very_easy",
    [{ en: "What time is it?", zh: "现在几点了？" }],
    { chineseHint: "太姆" }
  ),
  createWord("day", "/deɪ/", "day", "天", ["noun"], "A1", "very_easy",
    [{ en: "Today is a good day.", zh: "今天是个好日子。" }],
    { chineseHint: "得" }
  ),
  createWord("night", "/naɪt/", "night", "夜晚", ["noun"], "A1", "very_easy",
    [{ en: "Good night!", zh: "晚安！" }],
    { chineseHint: "耐特" }
  ),
  createWord("morning", "/ˈmɔːrnɪŋ/", "morn-ing", "早上", ["noun"], "A1", "very_easy",
    [{ en: "Good morning!", zh: "早上好！" }],
    { chineseHint: "莫宁" }
  ),
  createWord("afternoon", "/ˌæftərˈnuːn/", "af-ter-noon", "下午", ["noun"], "A1", "very_easy",
    [{ en: "Good afternoon!", zh: "下午好！" }],
    { association: "after(之后) + noon(中午) = 下午" }
  ),
  createWord("evening", "/ˈiːvnɪŋ/", "eve-ning", "晚上", ["noun"], "A1", "very_easy",
    [{ en: "Good evening!", zh: "晚上好！" }],
    { chineseHint: "伊文宁" }
  ),
  createWord("week", "/wiːk/", "week", "周", ["noun"], "A1", "very_easy",
    [{ en: "I work five days a week.", zh: "我每周工作五天。" }],
    { chineseHint: "维克" }
  ),
  createWord("month", "/mʌnθ/", "month", "月", ["noun"], "A1", "very_easy",
    [{ en: "There are twelve months.", zh: "有十二个月。" }],
    { chineseHint: "曼斯" }
  ),
  createWord("year", "/jɪr/", "year", "年", ["noun"], "A1", "very_easy",
    [{ en: "Happy New Year!", zh: "新年快乐！" }],
    { chineseHint: "伊尔" }
  ),
  createWord("today", "/təˈdeɪ/", "to-day", "今天", ["noun", "adverb"], "A1", "very_easy",
    [{ en: "Today is Monday.", zh: "今天是周一。" }],
    { association: "to(到) + day(天) = 今天" }
  ),
  createWord("tomorrow", "/təˈmɒroʊ/", "to-mor-row", "明天", ["noun", "adverb"], "A1", "very_easy",
    [{ en: "See you tomorrow.", zh: "明天见。" }],
    { chineseHint: "特莫肉" }
  ),
  createWord("yesterday", "/ˈjɛstərdeɪ/", "yes-ter-day", "昨天", ["noun", "adverb"], "A1", "very_easy",
    [{ en: "Yesterday was Sunday.", zh: "昨天是周日。" }],
    { chineseHint: "耶斯特得" }
  ),
  createWord("now", "/naʊ/", "now", "现在", ["adverb"], "A1", "very_easy",
    [{ en: "I am busy now.", zh: "我现在很忙。" }],
    { chineseHint: "闹" }
  ),
  createWord("sun", "/sʌn/", "sun", "太阳", ["noun"], "A1", "very_easy",
    [{ en: "The sun is bright.", zh: "太阳很亮。" }],
    { chineseHint: "桑" }
  ),
  createWord("rain", "/reɪn/", "rain", "雨", ["noun", "verb"], "A1", "easy",
    [{ en: "It is raining.", zh: "在下雨。" }],
    { chineseHint: "瑞恩" }
  ),
  createWord("snow", "/snoʊ/", "snow", "雪", ["noun", "verb"], "A1", "easy",
    [{ en: "It is snowing.", zh: "在下雪。" }],
    { chineseHint: "斯诺" }
  ),
  createWord("wind", "/wɪnd/", "wind", "风", ["noun"], "A1", "easy",
    [{ en: "The wind is strong.", zh: "风很大。" }],
    { chineseHint: "温的" }
  ),
  createWord("cloud", "/klaʊd/", "cloud", "云", ["noun"], "A1", "easy",
    [{ en: "The clouds are white.", zh: "云是白色的。" }],
    { chineseHint: "克劳的" }
  ),
  createWord("hot", "/hɒt/", "hot", "热的", ["adjective"], "A1", "very_easy",
    [{ en: "It is hot today.", zh: "今天很热。" }],
    { chineseHint: "好的" },
    { antonyms: ["cold"] }
  ),
  createWord("cold", "/koʊld/", "cold", "冷的", ["adjective"], "A1", "very_easy",
    [{ en: "It is cold outside.", zh: "外面很冷。" }],
    { chineseHint: "扣的" },
    { antonyms: ["hot", "warm"] }
  ),
  createWord("warm", "/wɔːrm/", "warm", "温暖的", ["adjective"], "A1", "easy",
    [{ en: "The weather is warm.", zh: "天气很暖和。" }],
    { chineseHint: "沃姆" },
    { antonyms: ["cool"] }
  ),
  createWord("cool", "/kuːl/", "cool", "凉爽的", ["adjective"], "A1", "easy",
    [{ en: "The weather is cool.", zh: "天气很凉爽。" }],
    { chineseHint: "酷" },
    { antonyms: ["warm"] }
  ),
  createWord("weather", "/ˈwɛðər/", "weath-er", "天气", ["noun"], "A1", "easy",
    [{ en: "The weather is nice.", zh: "天气很好。" }],
    { chineseHint: "温度" }
  ),
];

// ============================================================
// Category 11: Basic Verbs (211-250)
// ============================================================

const basicVerbs: VocabularyItem[] = [
  createWord("be", "/biː/", "be", "是", ["verb"], "A1", "very_easy",
    [{ en: "I want to be a teacher.", zh: "我想成为老师。" }],
    { chineseHint: "比" }
  ),
  createWord("have", "/hæv/", "have", "有", ["verb"], "A1", "very_easy",
    [{ en: "I have a cat.", zh: "我有一只猫。" }],
    { chineseHint: "嗨舞" }
  ),
  createWord("do", "/duː/", "do", "做", ["verb"], "A1", "very_easy",
    [{ en: "What do you do?", zh: "你是做什么的？" }],
    { chineseHint: "度" }
  ),
  createWord("say", "/seɪ/", "say", "说", ["verb"], "A1", "very_easy",
    [{ en: "What did you say?", zh: "你说什么？" }],
    { chineseHint: "赛" }
  ),
  createWord("go", "/ɡoʊ/", "go", "去", ["verb"], "A1", "very_easy",
    [{ en: "I go to school.", zh: "我去上学。" }],
    { chineseHint: "够" }
  ),
  createWord("come", "/kʌm/", "come", "来", ["verb"], "A1", "very_easy",
    [{ en: "Come here, please.", zh: "请过来。" }],
    { chineseHint: "卡姆" }
  ),
  createWord("see", "/siː/", "see", "看", ["verb"], "A1", "very_easy",
    [{ en: "I see a bird.", zh: "我看到一只鸟。" }],
    { chineseHint: "西" }
  ),
  createWord("get", "/ɡɛt/", "get", "得到", ["verb"], "A1", "very_easy",
    [{ en: "I get a book.", zh: "我拿到一本书。" }],
    { chineseHint: "盖特" }
  ),
  createWord("make", "/meɪk/", "make", "制作", ["verb"], "A1", "very_easy",
    [{ en: "I make dinner.", zh: "我做晚饭。" }],
    { chineseHint: "妹客" }
  ),
  createWord("know", "/noʊ/", "know", "知道", ["verb"], "A1", "very_easy",
    [{ en: "I know the answer.", zh: "我知道答案。" }],
    { chineseHint: "诺" }
  ),
  createWord("take", "/teɪk/", "take", "拿", ["verb"], "A1", "very_easy",
    [{ en: "Take this book.", zh: "拿这本书。" }],
    { chineseHint: "忒客" }
  ),
  createWord("give", "/ɡɪv/", "give", "给", ["verb"], "A1", "very_easy",
    [{ en: "Give me the pen.", zh: "把笔给我。" }],
    { chineseHint: "给舞" }
  ),
  createWord("find", "/faɪnd/", "find", "找到", ["verb"], "A1", "very_easy",
    [{ en: "I find my keys.", zh: "我找到钥匙了。" }],
    { chineseHint: "泛的" }
  ),
  createWord("think", "/θɪŋk/", "think", "想", ["verb"], "A1", "very_easy",
    [{ en: "I think so.", zh: "我也这么想。" }],
    { chineseHint: "斯印克" }
  ),
  createWord("eat", "/iːt/", "eat", "吃", ["verb"], "A1", "very_easy",
    [{ en: "I eat breakfast.", zh: "我吃早餐。" }],
    { chineseHint: "伊特" }
  ),
  createWord("drink", "/drɪŋk/", "drink", "喝", ["verb"], "A1", "very_easy",
    [{ en: "I drink water.", zh: "我喝水。" }],
    { chineseHint: "准克" }
  ),
  createWord("sleep", "/sliːp/", "sleep", "睡觉", ["verb"], "A1", "very_easy",
    [{ en: "I sleep at night.", zh: "我晚上睡觉。" }],
    { chineseHint: "斯力普" }
  ),
  createWord("run", "/rʌn/", "run", "跑", ["verb"], "A1", "very_easy",
    [{ en: "I run every morning.", zh: "我每天早上跑步。" }],
    { chineseHint: "然" }
  ),
  createWord("walk", "/wɔːk/", "walk", "走路", ["verb"], "A1", "very_easy",
    [{ en: "I walk to school.", zh: "我走路去学校。" }],
    { chineseHint: "沃克" }
  ),
  createWord("sit", "/sɪt/", "sit", "坐", ["verb"], "A1", "very_easy",
    [{ en: "Please sit down.", zh: "请坐下。" }],
    { chineseHint: "西特" }
  ),
  createWord("stand", "/stænd/", "stand", "站", ["verb"], "A1", "very_easy",
    [{ en: "Please stand up.", zh: "请站起来。" }],
    { chineseHint: "斯坦的" }
  ),
  createWord("open", "/ˈoʊpən/", "o-pen", "打开", ["verb"], "A1", "very_easy",
    [{ en: "Open the door.", zh: "打开门。" }],
    { chineseHint: "欧喷" }
  ),
  createWord("close", "/kloʊz/", "close", "关闭", ["verb"], "A1", "very_easy",
    [{ en: "Close the window.", zh: "关上窗户。" }],
    { chineseHint: "克楼兹" }
  ),
  createWord("read", "/riːd/", "read", "读", ["verb"], "A1", "very_easy",
    [{ en: "I read a book.", zh: "我读一本书。" }],
    { chineseHint: "瑞的" }
  ),
  createWord("write", "/raɪt/", "write", "写", ["verb"], "A1", "very_easy",
    [{ en: "I write a letter.", zh: "我写一封信。" }],
    { chineseHint: "入爱特" }
  ),
  createWord("speak", "/spiːk/", "speak", "说话", ["verb"], "A1", "very_easy",
    [{ en: "I speak English.", zh: "我说英语。" }],
    { chineseHint: "斯比克" }
  ),
  createWord("listen", "/ˈlɪsən/", "lis-ten", "听", ["verb"], "A1", "very_easy",
    [{ en: "I listen to music.", zh: "我听音乐。" }],
    { chineseHint: "里斯恩" }
  ),
  createWord("play", "/pleɪ/", "play", "玩", ["verb"], "A1", "very_easy",
    [{ en: "I play with my friends.", zh: "我和朋友玩。" }],
    { chineseHint: "普累" }
  ),
  createWord("work", "/wɜːrk/", "work", "工作", ["verb", "noun"], "A1", "very_easy",
    [{ en: "I work every day.", zh: "我每天工作。" }],
    { chineseHint: "沃克" }
  ),
  createWord("buy", "/baɪ/", "buy", "买", ["verb"], "A1", "very_easy",
    [{ en: "I buy a book.", zh: "我买一本书。" }],
    { chineseHint: "拜" }
  ),
  createWord("sell", "/sɛl/", "sell", "卖", ["verb"], "A1", "very_easy",
    [{ en: "I sell clothes.", zh: "我卖衣服。" }],
    { chineseHint: "赛欧" }
  ),
  createWord("pay", "/peɪ/", "pay", "支付", ["verb"], "A1", "easy",
    [{ en: "I pay for the food.", zh: "我付餐费。" }],
    { chineseHint: "配" }
  ),
  createWord("send", "/sɛnd/", "send", "发送", ["verb"], "A1", "easy",
    [{ en: "I send an email.", zh: "我发邮件。" }],
    { chineseHint: "森的" }
  ),
  createWord("receive", "/rɪˈsiːv/", "re-ceive", "收到", ["verb"], "A1", "medium",
    [{ en: "I receive a gift.", zh: "我收到一份礼物。" }],
    { chineseHint: "瑞西舞" }
  ),
  createWord("call", "/kɔːl/", "call", "打电话", ["verb"], "A1", "easy",
    [{ en: "I call my mother.", zh: "我给妈妈打电话。" }],
    { chineseHint: "靠" }
  ),
  createWord("talk", "/tɔːk/", "talk", "谈话", ["verb"], "A1", "easy",
    [{ en: "We talk every day.", zh: "我们每天聊天。" }],
    { chineseHint: "涛克" }
  ),
  createWord("ask", "/æsk/", "ask", "问", ["verb"], "A1", "easy",
    [{ en: "I ask a question.", zh: "我问一个问题。" }],
    { chineseHint: "阿斯克" }
  ),
  createWord("answer", "/ˈænsər/", "an-swer", "回答", ["verb", "noun"], "A1", "easy",
    [{ en: "Please answer the question.", zh: "请回答问题。" }],
    { chineseHint: "安斯" }
  ),
  createWord("try", "/traɪ/", "try", "尝试", ["verb"], "A1", "easy",
    [{ en: "I try my best.", zh: "我尽力而为。" }],
    { chineseHint: "踹" }
  ),
  createWord("learn", "/lɜːrn/", "learn", "学习", ["verb"], "A1", "very_easy",
    [{ en: "I learn English.", zh: "我学英语。" }],
    { chineseHint: "乐恩" }
  ),
  createWord("teach", "/tiːtʃ/", "teach", "教", ["verb"], "A1", "easy",
    [{ en: "She teaches English.", zh: "她教英语。" }],
    { chineseHint: "提去" }
  ),
  createWord("study", "/ˈstʌdi/", "stu-dy", "学习", ["verb"], "A1", "easy",
    [{ en: "I study at night.", zh: "我晚上学习。" }],
    { chineseHint: "斯达迪" }
  ),
];

// ============================================================
// Category 12: Adjectives (251-280)
// ============================================================

const adjectives: VocabularyItem[] = [
  createWord("big", "/bɪɡ/", "big", "大的", ["adjective"], "A1", "very_easy",
    [{ en: "This is a big house.", zh: "这是一个大房子。" }],
    { chineseHint: "比格" },
    { antonyms: ["small"] }
  ),
  createWord("small", "/smɔːl/", "small", "小的", ["adjective"], "A1", "very_easy",
    [{ en: "This is a small cat.", zh: "这是一只小猫。" }],
    { chineseHint: "斯莫" },
    { antonyms: ["big"] }
  ),
  createWord("long", "/lɒŋ/", "long", "长的", ["adjective"], "A1", "very_easy",
    [{ en: "The road is long.", zh: "路很长。" }],
    { chineseHint: "龙" },
    { antonyms: ["short"] }
  ),
  createWord("short", "/ʃɔːrt/", "short", "短的", ["adjective"], "A1", "very_easy",
    [{ en: "The hair is short.", zh: "头发很短。" }],
    { chineseHint: "烧特" },
    { antonyms: ["long", "tall"] }
  ),
  createWord("tall", "/tɔːl/", "tall", "高的", ["adjective"], "A1", "very_easy",
    [{ en: "He is very tall.", zh: "他很高。" }],
    { chineseHint: "涛" },
    { antonyms: ["short"] }
  ),
  createWord("new", "/njuː/", "new", "新的", ["adjective"], "A1", "very_easy",
    [{ en: "I have a new book.", zh: "我有一本新书。" }],
    { chineseHint: "牛" },
    { antonyms: ["old"] }
  ),
  createWord("old", "/oʊld/", "old", "旧的", ["adjective"], "A1", "very_easy",
    [{ en: "This is an old house.", zh: "这是一座旧房子。" }],
    { chineseHint: "欧的" },
    { antonyms: ["new", "young"] }
  ),
  createWord("young", "/jʌŋ/", "young", "年轻的", ["adjective"], "A1", "very_easy",
    [{ en: "She is very young.", zh: "她很年轻。" }],
    { chineseHint: "样" },
    { antonyms: ["old"] }
  ),
  createWord("happy", "/ˈhæpi/", "hap-py", "快乐的", ["adjective"], "A1", "very_easy",
    [{ en: "I am happy.", zh: "我很开心。" }],
    { chineseHint: "嗨皮" },
    { antonyms: ["sad"], synonyms: ["glad", "joyful"] }
  ),
  createWord("sad", "/sæd/", "sad", "悲伤的", ["adjective"], "A1", "very_easy",
    [{ en: "He is sad.", zh: "他很伤心。" }],
    { chineseHint: "赛的" },
    { antonyms: ["happy"], synonyms: ["unhappy", "upset"] }
  ),
  createWord("beautiful", "/ˈbjuːtɪfəl/", "beau-ti-ful", "美丽的", ["adjective"], "A1", "easy",
    [{ en: "She is beautiful.", zh: "她很漂亮。" }],
    { chineseHint: "比优提否" },
    { antonyms: ["ugly"], synonyms: ["pretty", "lovely"] }
  ),
  createWord("ugly", "/ˈʌɡli/", "ug-ly", "丑陋的", ["adjective"], "A1", "easy",
    [{ en: "That is an ugly picture.", zh: "那是一幅丑陋的画。" }],
    { chineseHint: "阿格利" },
    { antonyms: ["beautiful"] }
  ),
  createWord("fast", "/fæst/", "fast", "快的", ["adjective", "adverb"], "A1", "very_easy",
    [{ en: "The car is fast.", zh: "这辆车很快。" }],
    { chineseHint: "法斯特" },
    { antonyms: ["slow"], synonyms: ["quick"] }
  ),
  createWord("slow", "/sloʊ/", "slow", "慢的", ["adjective"], "A1", "very_easy",
    [{ en: "The turtle is slow.", zh: "乌龟很慢。" }],
    { chineseHint: "斯楼" },
    { antonyms: ["fast"] }
  ),
  createWord("easy", "/ˈiːzi/", "ea-sy", "容易的", ["adjective"], "A1", "very_easy",
    [{ en: "This is easy.", zh: "这很容易。" }],
    { chineseHint: "伊兹" },
    { antonyms: ["hard", "difficult"] }
  ),
  createWord("hard", "/hɑːrd/", "hard", "难的", ["adjective", "adverb"], "A1", "very_easy",
    [{ en: "This is hard.", zh: "这很难。" }],
    { chineseHint: "哈的" },
    { antonyms: ["easy"], synonyms: ["difficult"] }
  ),
  createWord("clean", "/kliːn/", "clean", "干净的", ["adjective", "verb"], "A1", "easy",
    [{ en: "The room is clean.", zh: "房间很干净。" }],
    { chineseHint: "克林" },
    { antonyms: ["dirty"] }
  ),
  createWord("dirty", "/ˈdɜːrti/", "dir-ty", "脏的", ["adjective"], "A1", "easy",
    [{ en: "My shoes are dirty.", zh: "我的鞋子脏了。" }],
    { chineseHint: "德提" },
    { antonyms: ["clean"] }
  ),
  createWord("full", "/fʊl/", "full", "满的", ["adjective"], "A1", "easy",
    [{ en: "The glass is full.", zh: "杯子是满的。" }],
    { chineseHint: "富" },
    { antonyms: ["empty"] }
  ),
  createWord("empty", "/ˈɛmpti/", "emp-ty", "空的", ["adjective"], "A1", "easy",
    [{ en: "The box is empty.", zh: "盒子是空的。" }],
    { chineseHint: "艾姆提" },
    { antonyms: ["full"] }
  ),
  createWord("heavy", "/ˈhɛvi/", "hea-vy", "重的", ["adjective"], "A1", "easy",
    [{ en: "This bag is heavy.", zh: "这个包很重。" }],
    { chineseHint: "黑维" }
  ),
  createWord("light", "/laɪt/", "light", "轻的", ["adjective"], "A1", "easy",
    [{ en: "This bag is light.", zh: "这个包很轻。" }],
    { chineseHint: "莱特" }
  ),
  createWord("safe", "/seɪf/", "safe", "安全的", ["adjective"], "A1", "easy",
    [{ en: "You are safe here.", zh: "你在这里很安全。" }],
    { chineseHint: "赛夫" }
  ),
  createWord("dangerous", "/ˈdeɪndʒərəs/", "dan-ger-ous", "危险的", ["adjective"], "A1", "medium",
    [{ en: "This is dangerous.", zh: "这是危险的。" }],
    { chineseHint: "丹杰若斯" }
  ),
  createWord("busy", "/ˈbɪzi/", "bus-y", "忙的", ["adjective"], "A1", "easy",
    [{ en: "I am busy today.", zh: "我今天很忙。" }],
    { chineseHint: "比兹" }
  ),
  createWord("free", "/friː/", "free", "免费的", ["adjective"], "A1", "easy",
    [{ en: "The parking is free.", zh: "停车是免费的。" }],
    { chineseHint: "弗瑞" }
  ),
  createWord("cheap", "/tʃiːp/", "cheap", "便宜的", ["adjective"], "A1", "easy",
    [{ en: "This is cheap.", zh: "这个很便宜。" }],
    { chineseHint: "起普" },
    { antonyms: ["expensive"] }
  ),
  createWord("expensive", "/ɪkˈspɛnsɪv/", "ex-pen-sive", "贵的", ["adjective"], "A1", "easy",
    [{ en: "This is expensive.", zh: "这个很贵。" }],
    { chineseHint: "伊克斯喷西舞" },
    { antonyms: ["cheap"] }
  ),
  createWord("same", "/seɪm/", "same", "相同的", ["adjective"], "A1", "easy",
    [{ en: "We have the same bag.", zh: "我们有相同的包。" }],
    { chineseHint: "塞姆" },
    { antonyms: ["different"] }
  ),
  createWord("different", "/ˈdɪfərənt/", "dif-fer-ent", "不同的", ["adjective"], "A1", "easy",
    [{ en: "They are different.", zh: "它们是不同的。" }],
    { chineseHint: "迪弗润特" },
    { antonyms: ["same"] }
  ),
  createWord("wrong", "/rɒŋ/", "wrong", "错误的", ["adjective"], "A1", "easy",
    [{ en: "That's wrong.", zh: "那是错的。" }],
    { chineseHint: "容" }
  ),
];

// ============================================================
// Category 13: Basic Grammar Words (281-300)
// ============================================================

const grammarWords: VocabularyItem[] = [
  createWord("the", "/ðə/", "the", "（定冠词）", ["article"], "A1", "very_easy",
    [{ en: "The cat is on the table.", zh: "猫在桌子上。" }],
    { chineseHint: "则" }
  ),
  createWord("a", "/ə/", "a", "一个", ["article"], "A1", "very_easy",
    [{ en: "I have a cat.", zh: "我有一只猫。" }],
    { chineseHint: "呃" }
  ),
  createWord("an", "/æn/", "an", "一个（元音前）", ["article"], "A1", "very_easy",
    [{ en: "I eat an apple.", zh: "我吃一个苹果。" }],
    { chineseHint: "安" }
  ),
  createWord("is", "/ɪz/", "is", "是（第三人称）", ["verb"], "A1", "very_easy",
    [{ en: "He is a student.", zh: "他是学生。" }],
    { chineseHint: "伊兹" }
  ),
  createWord("am", "/æm/", "am", "是（第一人称）", ["verb"], "A1", "very_easy",
    [{ en: "I am a teacher.", zh: "我是老师。" }],
    { chineseHint: "安姆" }
  ),
  createWord("are", "/ɑːr/", "are", "是（复数）", ["verb"], "A1", "very_easy",
    [{ en: "We are friends.", zh: "我们是朋友。" }],
    { chineseHint: "阿" }
  ),
  createWord("was", "/wɒz/", "was", "是（过去式）", ["verb"], "A1", "easy",
    [{ en: "I was at home.", zh: "我在家里。" }],
    { chineseHint: "沃兹" }
  ),
  createWord("were", "/wɜːr/", "were", "是（过去式复数）", ["verb"], "A1", "easy",
    [{ en: "They were happy.", zh: "他们很开心。" }],
    { chineseHint: "沃" }
  ),
  createWord("can", "/kæn/", "can", "能", ["verb"], "A1", "very_easy",
    [{ en: "I can swim.", zh: "我会游泳。" }],
    { chineseHint: "看" }
  ),
  createWord("will", "/wɪl/", "will", "将要", ["verb"], "A1", "easy",
    [{ en: "I will help you.", zh: "我会帮助你。" }],
    { chineseHint: "威" }
  ),
  createWord("not", "/nɒt/", "not", "不", ["adverb"], "A1", "very_easy",
    [{ en: "I am not tired.", zh: "我不累。" }],
    { chineseHint: "闹特" }
  ),
  createWord("and", "/ænd/", "and", "和", ["conjunction"], "A1", "very_easy",
    [{ en: "I like cats and dogs.", zh: "我喜欢猫和狗。" }],
    { chineseHint: "安的" }
  ),
  createWord("or", "/ɔːr/", "or", "或者", ["conjunction"], "A1", "very_easy",
    [{ en: "Tea or coffee?", zh: "茶还是咖啡？" }],
    { chineseHint: "奥" }
  ),
  createWord("but", "/bʌt/", "but", "但是", ["conjunction"], "A1", "very_easy",
    [{ en: "I like it, but it's expensive.", zh: "我喜欢，但是太贵了。" }],
    { chineseHint: "巴特" }
  ),
  createWord("because", "/bɪˈkɒz/", "be-cause", "因为", ["conjunction"], "A1", "easy",
    [{ en: "I am happy because it's sunny.", zh: "我很开心因为天晴了。" }],
    { chineseHint: "比靠兹" }
  ),
  createWord("in", "/ɪn/", "in", "在...里面", ["preposition"], "A1", "very_easy",
    [{ en: "The cat is in the box.", zh: "猫在盒子里。" }],
    { chineseHint: "因" }
  ),
  createWord("on", "/ɒn/", "on", "在...上面", ["preposition"], "A1", "very_easy",
    [{ en: "The book is on the table.", zh: "书在桌子上。" }],
    { chineseHint: "昂" }
  ),
  createWord("at", "/æt/", "at", "在...（点）", ["preposition"], "A1", "very_easy",
    [{ en: "I am at home.", zh: "我在家。" }],
    { chineseHint: "艾特" }
  ),
  createWord("to", "/tuː/", "to", "到", ["preposition"], "A1", "very_easy",
    [{ en: "I go to school.", zh: "我去学校。" }],
    { chineseHint: "图" }
  ),
  createWord("from", "/frɒm/", "from", "从", ["preposition"], "A1", "very_easy",
    [{ en: "I come from China.", zh: "我来自中国。" }],
    { chineseHint: "弗洛姆" }
  ),
];

// ============================================================
// Export All Words
// ============================================================

export const BEGINNER_WORDS: VocabularyItem[] = [
  ...greetings,
  ...pronouns,
  ...numbers,
  ...peopleNouns,
  ...bodyParts,
  ...foodDrink,
  ...clothing,
  ...houseHome,
  ...places,
  ...timeWeather,
  ...basicVerbs,
  ...adjectives,
  ...grammarWords,
];

// Deduplicate by word
const seen = new Set<string>();
export const UNIQUE_BEGINNER_WORDS = BEGINNER_WORDS.filter(item => {
  const lower = item.word.toLowerCase();
  if (seen.has(lower)) return false;
  seen.add(lower);
  return true;
});

export const WORD_COUNT = UNIQUE_BEGINNER_WORDS.length;
