/**
 * DailyCoachEngineV2 — Day-Aware Mission Generator
 *
 * Generates day-specific learning content:
 * - Each day gets different vocabulary (8-10 words from curriculum)
 * - Each day gets a different reading passage
 * - Each day gets a different writing task
 * - Each day focuses on different pronunciation sounds
 */

// ============================================================
// Types
// ============================================================

export type MissionActivity =
  | "srs_review"
  | "listening_input"
  | "shadowing"
  | "conversation"
  | "reading"
  | "writing"
  | "grammar"
  | "pronunciation"
  | "vocabulary_new"
  | "assessment";

export interface MissionActivityItem {
  id: string;
  type: MissionActivity;
  title: string;
  titleChinese: string;
  description: string;
  descriptionChinese: string;
  durationMinutes: number;
  priority: "high" | "medium" | "low";
  content: Record<string, unknown>;
  completed: boolean;
}

export interface DailyMission {
  id: string;
  userId: string;
  day: number;
  date: string;
  activities: MissionActivityItem[];
  totalTimeMinutes: number;
  focusAreas: string[];
  difficulty: "easy" | "normal" | "hard";
  audioSpeed: "slow" | "normal" | "fast";
  completed: boolean;
  completedActivities: string[];
  score: number;
  createdAt: number;
  updatedAt: number;
}

export interface LearnerProfile {
  userId: string;
  currentDay: number;
  level: string;
  vocabularyLevel: number;
  listeningLevel: number;
  speakingLevel: number;
  grammarLevel: number;
  readingLevel: number;
  writingLevel: number;
  pronunciationLevel: number;
  weakAreas: string[];
  strongAreas: string[];
  wordsLearned: number;
  wordsMastered: number;
  retentionRate: number;
  studyStreak: number;
  dailyGoalMinutes: number;
  yesterdayCompleted: string[];
  yesterdayScore: number;
}

// ============================================================
// Day-Specific Content Banks
// ============================================================

/** 300+ beginner words organized by day (10 words per day, 30 days) */
const DAY_VOCABULARY: Record<number, Array<{ word: string; ipa: string; chinese: string; phonics: string; pos: string; example: string; exampleZh: string; memoryHint: string }>> = {
  1: [
    { word: "hello", ipa: "/həˈloʊ/", chinese: "你好", phonics: "hel-lo", pos: "interjection", example: "Hello, how are you?", exampleZh: "你好，你怎么样？", memoryHint: "哈喽！街上碰到朋友喊哈喽" },
    { word: "goodbye", ipa: "/ɡʊdˈbaɪ/", chinese: "再见", phonics: "good-bye", pos: "interjection", example: "Goodbye, see you tomorrow!", exampleZh: "再见，明天见！", memoryHint: "good(好)+bye(拜)=好好的拜拜" },
    { word: "thank", ipa: "/θæŋk/", chinese: "谢谢", phonics: "thank", pos: "verb", example: "Thank you very much!", exampleZh: "非常感谢你！", memoryHint: "咬舌音th+ank→谢谢" },
    { word: "please", ipa: "/pliːz/", chinese: "请", phonics: "please", pos: "adverb", example: "Please sit down.", exampleZh: "请坐下。", memoryHint: "please= ple(高兴)+ase→请让人高兴" },
    { word: "sorry", ipa: "/ˈsɒri/", chinese: "对不起", phonics: "sor-ry", pos: "adjective", example: "I am sorry.", exampleZh: "对不起。", memoryHint: "sorry=so(如此)+ry→如此抱歉" },
    { word: "yes", ipa: "/jɛs/", chinese: "是", phonics: "yes", pos: "adverb", example: "Yes, I understand.", exampleZh: "是的，我明白了。", memoryHint: "yes谐音'耶'是" },
    { word: "no", ipa: "/noʊ/", chinese: "不", phonics: "no", pos: "adverb", example: "No, thank you.", exampleZh: "不了，谢谢。", memoryHint: "no谐音'诺'=承诺不行" },
    { word: "water", ipa: "/ˈwɔːtər/", chinese: "水", phonics: "wa-ter", pos: "noun", example: "Can I have some water?", exampleZh: "我能喝点水吗？", memoryHint: "我特(what)+er=我特别渴要喝水" },
    { word: "food", ipa: "/fuːd/", chinese: "食物", phonics: "food", pos: "noun", example: "The food is delicious.", exampleZh: "食物很好吃。", memoryHint: "food=ful(满)+ood→嘴满满的=食物" },
    { word: "help", ipa: "/hɛlp/", chinese: "帮助", phonics: "help", pos: "verb", example: "Can you help me?", exampleZh: "你能帮助我吗？", memoryHint: "help=he(他)+lp→他来帮你" },
  ],
  2: [
    { word: "friend", ipa: "/frend/", chinese: "朋友", phonics: "friend", pos: "noun", example: "She is my friend.", exampleZh: "她是我的朋友。", memoryHint: "fri(免费)+end→朋友请客是免费的" },
    { word: "family", ipa: "/ˈfæməli/", chinese: "家庭", phonics: "fam-i-ly", pos: "noun", example: "I love my family.", exampleZh: "我爱我的家人。", memoryHint: "Father And Mother I Love You=家庭" },
    { word: "mother", ipa: "/ˈmʌðər/", chinese: "妈妈", phonics: "moth-er", pos: "noun", example: "My mother is a teacher.", exampleZh: "我妈妈是老师。", memoryHint: "mother=mo(摸)+ther→摸摸头" },
    { word: "father", ipa: "/ˈfɑːðər/", chinese: "爸爸", phonics: "fa-ther", pos: "noun", example: "My father works hard.", exampleZh: "我爸爸工作很努力。", memoryHint: "father=fa(发)+ther→发红包的那个人" },
    { word: "brother", ipa: "/ˈbrʌðər/", chinese: "兄弟", phonics: "broth-er", pos: "noun", example: "I have one brother.", exampleZh: "我有一个兄弟。", memoryHint: "brother=不辣的→兄弟不吃辣" },
    { word: "sister", ipa: "/ˈsɪstər/", chinese: "姐妹", phonics: "sis-ter", pos: "noun", example: "My sister is 10 years old.", exampleZh: "我姐姐10岁了。", memoryHint: "sister=撕(sis)+ter→撕纸的姐姐" },
    { word: "name", ipa: "/neɪm/", chinese: "名字", phonics: "name", pos: "noun", example: "What is your name?", exampleZh: "你叫什么名字？", memoryHint: "name=内姆→内涵的名字" },
    { word: "day", ipa: "/deɪ/", chinese: "天", phonics: "day", pos: "noun", example: "Have a good day!", exampleZh: "祝你今天愉快！", memoryHint: "day=day(对)→对，又是一天" },
    { word: "night", ipa: "/naɪt/", chinese: "夜晚", phonics: "night", pos: "noun", example: "Good night, sleep well.", exampleZh: "晚安，睡个好觉。", memoryHint: "night=ni(你)+ght→你晚上干嘛" },
    { word: "home", ipa: "/hoʊm/", chinese: "家", phonics: "home", pos: "noun", example: "I want to go home.", exampleZh: "我想回家。", memoryHint: "home=ho(吼)+me→回家吼一声" },
  ],
  3: [
    { word: "apple", ipa: "/ˈæpəl/", chinese: "苹果", phonics: "ap-ple", pos: "noun", example: "I eat an apple every day.", exampleZh: "我每天吃一个苹果。", memoryHint: "apple=阿婆+le→阿婆送苹果" },
    { word: "banana", ipa: "/bəˈnænə/", chinese: "香蕉", phonics: "ba-na-na", pos: "noun", example: "Bananas are yellow.", exampleZh: "香蕉是黄色的。", memoryHint: "banana=爸拿哪→爸爸拿哪个香蕉" },
    { word: "orange", ipa: "/ˈɒrɪndʒ/", chinese: "橙子", phonics: "or-ange", pos: "noun", example: "I like orange juice.", exampleZh: "我喜欢橙汁。", memoryHint: "orange=or(或者)+ange→或者吃橙子" },
    { word: "milk", ipa: "/mɪlk/", chinese: "牛奶", phonics: "milk", pos: "noun", example: "I drink milk in the morning.", exampleZh: "我早上喝牛奶。", memoryHint: "milk=迷离客→喝牛奶迷迷糊糊" },
    { word: "bread", ipa: "/brɛd/", chinese: "面包", phonics: "bread", pos: "noun", example: "I have bread for breakfast.", exampleZh: "我早餐吃面包。", memoryHint: "bread=b(不)+read(读)→面包不用读" },
    { word: "rice", ipa: "/raɪs/", chinese: "米饭", phonics: "rice", pos: "noun", example: "We eat rice every day.", exampleZh: "我们每天吃米饭。", memoryHint: "rice=来(r)+ice(冰)→来碗冰凉米饭" },
    { word: "egg", ipa: "/ɛɡ/", chinese: "鸡蛋", phonics: "egg", pos: "noun", example: "I had two eggs for breakfast.", exampleZh: "我早餐吃了两个鸡蛋。", memoryHint: "egg=一个(e)+个(g)→一个个鸡蛋" },
    { word: "tea", ipa: "/tiː/", chinese: "茶", phonics: "tea", pos: "noun", example: "Would you like some tea?", exampleZh: "你想喝点茶吗？", memoryHint: "tea谐音'提'→提神的茶" },
    { word: "cake", ipa: "/keɪk/", chinese: "蛋糕", phonics: "cake", pos: "noun", example: "The cake is very sweet.", exampleZh: "蛋糕很甜。", memoryHint: "cake=ke(可)+ake→可以ake蛋糕" },
    { word: "chicken", ipa: "/ˈtʃɪkɪn/", chinese: "鸡肉", phonics: "chick-en", pos: "noun", example: "I like fried chicken.", exampleZh: "我喜欢炸鸡。", memoryHint: "chicken=chic(时髦)+en→时髦的鸡" },
  ],
  4: [
    { word: "big", ipa: "/bɪɡ/", chinese: "大的", phonics: "big", pos: "adjective", example: "This is a big house.", exampleZh: "这是一栋大房子。", memoryHint: "big=笔(bi)+个(g)→笔那么大的个" },
    { word: "small", ipa: "/smɔːl/", chinese: "小的", phonics: "small", pos: "adjective", example: "I have a small dog.", exampleZh: "我有一只小狗。", memoryHint: "small=s(思)+mall(商场)→小商场" },
    { word: "happy", ipa: "/ˈhæpi/", chinese: "快乐的", phonics: "hap-py", pos: "adjective", example: "I am very happy today.", exampleZh: "我今天很开心。", memoryHint: "happy=哈(ha)+皮(py)→哈哈皮一下" },
    { word: "sad", ipa: "/sæd/", chinese: "伤心的", phonics: "sad", pos: "adjective", example: "She looks sad.", exampleZh: "她看起来很伤心。", memoryHint: "sad=三(s)+ad→三件伤心事" },
    { word: "hot", ipa: "/hɒt/", chinese: "热的", phonics: "hot", pos: "adjective", example: "It is very hot today.", exampleZh: "今天很热。", memoryHint: "hot=好(ho)+特(t)→好特别的热" },
    { word: "cold", ipa: "/koʊld/", chinese: "冷的", phonics: "cold", pos: "adjective", example: "The water is cold.", exampleZh: "水很冷。", memoryHint: "cold=可(ko)+ld→可以冷" },
    { word: "new", ipa: "/njuː/", chinese: "新的", phonics: "new", pos: "adjective", example: "I bought a new phone.", exampleZh: "我买了一部新手机。", memoryHint: "new=牛(n)+ew→新东西很牛" },
    { word: "old", ipa: "/oʊld/", chinese: "旧的/老的", phonics: "old", pos: "adjective", example: "My grandfather is old.", exampleZh: "我爷爷很老了。", memoryHint: "old=偶(ou)+ld→偶是老的" },
    { word: "good", ipa: "/ɡʊd/", chinese: "好的", phonics: "good", pos: "adjective", example: "This is very good.", exampleZh: "这个非常好。", memoryHint: "good=够(goo)+d→够好的" },
    { word: "bad", ipa: "/bæd/", chinese: "坏的", phonics: "bad", pos: "adjective", example: "The weather is bad.", exampleZh: "天气不好。", memoryHint: "bad=不(ba)+d→不好的" },
  ],
  5: [
    { word: "go", ipa: "/ɡoʊ/", chinese: "去", phonics: "go", pos: "verb", example: "I want to go home.", exampleZh: "我想回家。", memoryHint: "go=够(gou)→够了，走吧" },
    { word: "come", ipa: "/kʌm/", chinese: "来", phonics: "come", pos: "verb", example: "Come here, please.", exampleZh: "请过来。", memoryHint: "come=卡(k)+me→卡住了，来帮忙" },
    { word: "eat", ipa: "/iːt/", chinese: "吃", phonics: "eat", pos: "verb", example: "Let's eat dinner.", exampleZh: "我们吃晚饭吧。", memoryHint: "eat=一(ea)+特(t)→一顿特别的饭" },
    { word: "drink", ipa: "/drɪŋk/", chinese: "喝", phonics: "drink", pos: "verb", example: "I want to drink water.", exampleZh: "我想喝水。", memoryHint: "drink=准(dri)+nk→准喝" },
    { word: "sleep", ipa: "/sliːp/", chinese: "睡觉", phonics: "sleep", pos: "verb", example: "I sleep at 10 PM.", exampleZh: "我晚上10点睡觉。", memoryHint: "sleep=死(s)+利(l)+eep→死厉害的睡觉" },
    { word: "work", ipa: "/wɜːrk/", chinese: "工作", phonics: "work", pos: "verb", example: "My father goes to work.", exampleZh: "我爸爸去上班了。", memoryHint: "work=我(w)+ork→我在工作" },
    { word: "play", ipa: "/pleɪ/", chinese: "玩", phonics: "play", pos: "verb", example: "Children like to play.", exampleZh: "孩子们喜欢玩。", memoryHint: "play=扑(p)+lay→扑过去玩" },
    { word: "read", ipa: "/riːd/", chinese: "读", phonics: "read", pos: "verb", example: "I like to read books.", exampleZh: "我喜欢读书。", memoryHint: "read=瑞(r)+e→瑞瑞在读书" },
    { word: "write", ipa: "/raɪt/", chinese: "写", phonics: "write", pos: "verb", example: "Please write your name.", exampleZh: "请写下你的名字。", memoryHint: "write=来(w)+rite→来写仪式" },
    { word: "run", ipa: "/rʌn/", chinese: "跑", phonics: "run", pos: "verb", example: "I run every morning.", exampleZh: "我每天早上跑步。", memoryHint: "run=软(r)+un→跑软了" },
  ],
  6: [
    { word: "one", ipa: "/wʌn/", chinese: "一", phonics: "one", pos: "number", example: "I have one brother.", exampleZh: "我有一个兄弟。", memoryHint: "one=万(wan)→一万变一" },
    { word: "two", ipa: "/tuː/", chinese: "二", phonics: "two", pos: "number", example: "I have two sisters.", exampleZh: "我有两个姐姐。", memoryHint: "two=兔(tu)→两只兔子" },
    { word: "three", ipa: "/θriː/", chinese: "三", phonics: "three", pos: "number", example: "There are three cats.", exampleZh: "有三只猫。", memoryHint: "three=思(si)+瑞(rui)→思睿三" },
    { word: "four", ipa: "/fɔːr/", chinese: "四", phonics: "four", pos: "number", example: "I have four books.", exampleZh: "我有四本书。", memoryHint: "four=佛(fo)+r→佛有四" },
    { word: "five", ipa: "/faɪv/", chinese: "五", phonics: "five", pos: "number", example: "Give me five fingers.", exampleZh: "给我五个手指。", memoryHint: "five=飞(f)+ive→飞舞的五" },
    { word: "red", ipa: "/rɛd/", chinese: "红色", phonics: "red", pos: "noun", example: "I like the red one.", exampleZh: "我喜欢红色那个。", memoryHint: "red=热(re)+d→热的红色" },
    { word: "blue", ipa: "/bluː/", chinese: "蓝色", phonics: "blue", pos: "noun", example: "The sky is blue.", exampleZh: "天空是蓝色的。", memoryHint: "blue=不(b)+lu→不绿，是蓝" },
    { word: "green", ipa: "/ɡriːn/", chinese: "绿色", phonics: "green", pos: "noun", example: "The grass is green.", exampleZh: "草地是绿色的。", memoryHint: "green=哥(g)+reen→哥穿绿衣" },
    { word: "black", ipa: "/blæk/", chinese: "黑色", phonics: "black", pos: "noun", example: "I have black hair.", exampleZh: "我有黑色的头发。", memoryHint: "black=不(b)+lack→不缺黑色" },
    { word: "white", ipa: "/waɪt/", chinese: "白色", phonics: "white", pos: "noun", example: "Snow is white.", exampleZh: "雪是白色的。", memoryHint: "white=外(w)+hite→外面白白的" },
  ],
  7: [
    { word: "Monday", ipa: "/ˈmʌndeɪ/", chinese: "星期一", phonics: "Mon-day", pos: "noun", example: "Monday is the first day.", exampleZh: "星期一是第一天。", memoryHint: "Mon(猛)+day→猛的一天开始" },
    { word: "Tuesday", ipa: "/ˈtjuːzdeɪ/", chinese: "星期二", phonics: "Tues-day", pos: "noun", example: "See you on Tuesday.", exampleZh: "星期二见。", memoryHint: "Tues(突)+day→突然星期二" },
    { word: "today", ipa: "/təˈdeɪ/", chinese: "今天", phonics: "to-day", pos: "adverb", example: "Today is Monday.", exampleZh: "今天是星期一。", memoryHint: "to(到)+day(天)→到了这一天=今天" },
    { word: "tomorrow", ipa: "/təˈmɒroʊ/", chinese: "明天", phonics: "to-mor-row", pos: "adverb", example: "See you tomorrow.", exampleZh: "明天见。", memoryHint: "to(到)+mor(莫)+row(若)→莫若明天" },
    { word: "yesterday", ipa: "/ˈjɛstərdeɪ/", chinese: "昨天", phonics: "yes-ter-day", pos: "adverb", example: "I saw him yesterday.", exampleZh: "我昨天见到他了。", memoryHint: "yes(是)+ter+day→是前天的一天=昨天" },
    { word: "now", ipa: "/naʊ/", chinese: "现在", phonics: "now", pos: "adverb", example: "I am here now.", exampleZh: "我现在在这里。", memoryHint: "now=闹(n)+ow→现在很闹" },
    { word: "always", ipa: "/ˈɔːlweɪz/", chinese: "总是", phonics: "al-ways", pos: "adverb", example: "I always eat breakfast.", exampleZh: "我总是吃早餐。", memoryHint: "all(所有)+ways(路)→所有路都走=总是" },
    { word: "sometimes", ipa: "/ˈsʌmtaɪmz/", chinese: "有时", phonics: "some-times", pos: "adverb", example: "I sometimes go running.", exampleZh: "我有时去跑步。", memoryHint: "some(一些)+times(次数)→一些次数=有时" },
    { word: "never", ipa: "/ˈnɛvər/", chinese: "从不", phonics: "nev-er", pos: "adverb", example: "I never eat meat.", exampleZh: "我从不吃肉。", memoryHint: "never=呢(ne)+ver→呢，从不" },
    { word: "time", ipa: "/taɪm/", chinese: "时间", phonics: "time", pos: "noun", example: "What time is it?", exampleZh: "几点了？", memoryHint: "time=太(t)+ime→太没时间了" },
  ],
  8: [
    { word: "want", ipa: "/wɒnt/", chinese: "想要", phonics: "want", pos: "verb", example: "I want a new phone.", exampleZh: "我想要一部新手机。", memoryHint: "want=望(wang)+t→望到了想要" },
    { word: "need", ipa: "/niːd/", chinese: "需要", phonics: "need", pos: "verb", example: "I need your help.", exampleZh: "我需要你的帮助。", memoryHint: "need=你(ni)+ed→你需要的" },
    { word: "like", ipa: "/laɪk/", chinese: "喜欢", phonics: "like", pos: "verb", example: "I like English.", exampleZh: "我喜欢英语。", memoryHint: "like=赖(l)+ike→赖着喜欢" },
    { word: "can", ipa: "/kæn/", chinese: "能", phonics: "can", pos: "verb", example: "I can swim.", exampleZh: "我会游泳。", memoryHint: "can=看(kan)→看我能" },
    { word: "have", ipa: "/hæv/", chinese: "有", phonics: "have", pos: "verb", example: "I have a cat.", exampleZh: "我有一只猫。", memoryHint: "have=哈(ha)+ve→哈哈有了" },
    { word: "make", ipa: "/meɪk/", chinese: "制作", phonics: "make", pos: "verb", example: "I make dinner every day.", exampleZh: "我每天做晚饭。", memoryHint: "make=没(m)+ake→没做好制作" },
    { word: "give", ipa: "/ɡɪv/", chinese: "给", phonics: "give", pos: "verb", example: "Please give me the book.", exampleZh: "请把书给我。", memoryHint: "give=给(g)+ive→给就给" },
    { word: "take", ipa: "/teɪk/", chinese: "拿", phonics: "take", pos: "verb", example: "Take this book.", exampleZh: "拿这本书。", memoryHint: "take=特(t)+ake→特别要拿" },
    { word: "open", ipa: "/ˈoʊpən/", chinese: "打开", phonics: "o-pen", pos: "verb", example: "Open the door.", exampleZh: "打开门。", memoryHint: "open=欧(o)+pen→欧笔打开" },
    { word: "close", ipa: "/kloʊz/", chinese: "关闭", phonics: "close", pos: "verb", example: "Close the window.", exampleZh: "关上窗户。", memoryHint: "close=克(k)+lose→克丢了关闭" },
  ],
  9: [
    { word: "room", ipa: "/ruːm/", chinese: "房间", phonics: "room", pos: "noun", example: "My room is big.", exampleZh: "我的房间很大。", memoryHint: "room=入(ru)+om→进入房间" },
    { word: "door", ipa: "/dɔːr/", chinese: "门", phonics: "door", pos: "noun", example: "Please close the door.", exampleZh: "请关门。", memoryHint: "door=多(do)+or→多开门" },
    { word: "window", ipa: "/ˈwɪndoʊ/", chinese: "窗户", phonics: "win-dow", pos: "noun", example: "Open the window.", exampleZh: "打开窗户。", memoryHint: "win(赢)+dow→赢了开窗庆祝" },
    { word: "bed", ipa: "/bɛd/", chinese: "床", phonics: "bed", pos: "noun", example: "I go to bed at 10.", exampleZh: "我10点上床。", memoryHint: "bed=不(b)+ed→不困也要上床" },
    { word: "chair", ipa: "/tʃɛr/", chinese: "椅子", phonics: "chair", pos: "noun", example: "Please sit on the chair.", exampleZh: "请坐在椅子上。", memoryHint: "chair=柴(ch)+air→坐柴椅子" },
    { word: "table", ipa: "/ˈteɪbəl/", chinese: "桌子", phonics: "ta-ble", pos: "noun", example: "The food is on the table.", exampleZh: "食物在桌子上。", memoryHint: "table=太(ta)+ble→太能摆的桌子" },
    { word: "book", ipa: "/bʊk/", chinese: "书", phonics: "book", pos: "noun", example: "I read a book every day.", exampleZh: "我每天读一本书。", memoryHint: "book=不(b)+ook→不看不行的书" },
    { word: "pen", ipa: "/pɛn/", chinese: "笔", phonics: "pen", pos: "noun", example: "Give me a pen.", exampleZh: "给我一支笔。", memoryHint: "pen=喷(pen)→喷墨的笔" },
    { word: "phone", ipa: "/foʊn/", chinese: "电话", phonics: "phone", pos: "noun", example: "Where is my phone?", exampleZh: "我的手机在哪？", memoryHint: "phone=风(f)+one→有风声的电话" },
    { word: "car", ipa: "/kɑːr/", chinese: "汽车", phonics: "car", pos: "noun", example: "I drive a car.", exampleZh: "我开车。", memoryHint: "car=卡(ka)+r→卡在车里" },
  ],
  10: [
    { word: "store", ipa: "/stɔːr/", chinese: "商店", phonics: "store", pos: "noun", example: "I go to the store.", exampleZh: "我去商店。", memoryHint: "store=死(s)+to+re→死了也要去商店" },
    { word: "school", ipa: "/skuːl/", chinese: "学校", phonics: "school", pos: "noun", example: "I go to school every day.", exampleZh: "我每天去学校。", memoryHint: "school=死(s)+cool→死酷的学校" },
    { word: "hospital", ipa: "/ˈhɒspɪtəl/", chinese: "医院", phonics: "hos-pi-tal", pos: "noun", example: "The hospital is near here.", exampleZh: "医院在这附近。", memoryHint: "host(主人)+pi+tal→主人的医院" },
    { word: "bus", ipa: "/bʌs/", chinese: "公交车", phonics: "bus", pos: "noun", example: "I take the bus to work.", exampleZh: "我坐公交车上班。", memoryHint: "bus=巴(b)+us→巴士来了" },
    { word: "train", ipa: "/treɪn/", chinese: "火车", phonics: "train", pos: "noun", example: "The train is very fast.", exampleZh: "火车很快。", memoryHint: "train=踹(ch)+ain→踹上火车" },
    { word: "walk", ipa: "/wɔːk/", chinese: "走路", phonics: "walk", pos: "verb", example: "I walk to school.", exampleZh: "我走路去学校。", memoryHint: "walk=我(w)+alk→我走路" },
    { word: "shop", ipa: "/ʃɒp/", chinese: "购物", phonics: "shop", pos: "verb", example: "I like to shop online.", exampleZh: "我喜欢网购。", memoryHint: "shop=收(sh)+op→收东西购物" },
    { word: "doctor", ipa: "/ˈdɒktər/", chinese: "医生", phonics: "doc-tor", pos: "noun", example: "I need to see a doctor.", exampleZh: "我需要看医生。", memoryHint: "doctor=多克(duck)+tor→多克医生" },
    { word: "teacher", ipa: "/ˈtiːtʃər/", chinese: "老师", phonics: "teach-er", pos: "noun", example: "My teacher is very nice.", exampleZh: "我的老师很好。", memoryHint: "teach(教)+er→教你的人=老师" },
    { word: "student", ipa: "/ˈstjuːdənt/", chinese: "学生", phonics: "stu-dent", pos: "noun", example: "I am a student.", exampleZh: "我是一名学生。", memoryHint: "student=死(s)+t+u+dent→死读书的学生" },
  ],
  11: [
    { word: "beautiful", ipa: "/ˈbjuːtɪfəl/", chinese: "美丽的", phonics: "beau-ti-ful", pos: "adjective", example: "The flower is beautiful.", exampleZh: "这朵花很美。", memoryHint: "beau(美)+ti+ful→满满的美" },
    { word: "ugly", ipa: "/ˈʌɡli/", chinese: "丑陋的", phonics: "ug-ly", pos: "adjective", example: "That is an ugly hat.", exampleZh: "那是一顶丑帽子。", memoryHint: "ug(丑)+ly→丑的" },
    { word: "fast", ipa: "/fæst/", chinese: "快的", phonics: "fast", pos: "adjective", example: "He runs very fast.", exampleZh: "他跑得很快。", memoryHint: "fast=发(fa)+st→发了疯一样快" },
    { word: "slow", ipa: "/sloʊ/", chinese: "慢的", phonics: "slow", pos: "adjective", example: "The turtle is slow.", exampleZh: "乌龟很慢。", memoryHint: "slow=死(s)+low→死慢" },
    { word: "easy", ipa: "/ˈiːzi/", chinese: "容易的", phonics: "ea-sy", pos: "adjective", example: "This is very easy.", exampleZh: "这非常容易。", memoryHint: "easy=一(ea)+zi→一个字=容易" },
    { word: "hard", ipa: "/hɑːrd/", chinese: "困难的", phonics: "hard", pos: "adjective", example: "The test is hard.", exampleZh: "考试很难。", memoryHint: "hard=哈(ha)+rd→哈哈好难" },
    { word: "early", ipa: "/ˈɜːrli/", chinese: "早的", phonics: "ear-ly", pos: "adjective", example: "I wake up early.", exampleZh: "我早起。", memoryHint: "ear(耳朵)+ly→耳朵早听到" },
    { word: "late", ipa: "/leɪt/", chinese: "迟的", phonics: "late", pos: "adjective", example: "I am late for school.", exampleZh: "我上学迟到了。", memoryHint: "late=来(l)+ate→来了但迟了" },
    { word: "busy", ipa: "/ˈbɪzi/", chinese: "忙碌的", phonics: "bu-sy", pos: "adjective", example: "I am very busy today.", exampleZh: "我今天很忙。", memoryHint: "busy=必(bu)+sy→必须忙碌" },
    { word: "free", ipa: "/friː/", chinese: "空闲的/免费的", phonics: "free", pos: "adjective", example: "Are you free today?", exampleZh: "你今天有空吗？", memoryHint: "free=飞(f)+ree→飞出去就自由了" },
  ],
};

/** Day-specific reading passages */
const DAY_READING: Record<number, { title: string; titleZh: string; text: string; textZh: string; questions: Array<{ q: string; options: string[]; answer: number }> }> = {
  1: {
    title: "My Family",
    titleZh: "我的家庭",
    text: "Hello! My name is Li Ming. I am from China. I have a family of four. My father is a teacher. My mother is a nurse. I have a sister. Her name is Li Hua. She is 10 years old. We live in Beijing. I love my family.",
    textZh: "你好！我叫李明。我来自中国。我家有四口人。我爸爸是老师。我妈妈是护士。我有一个妹妹。她叫李华。她10岁了。我们住在北京。我爱我的家人。",
    questions: [
      { q: "Li Ming is from ___", options: ["China", "Japan"], answer: 0 },
      { q: "His father is a ___", options: ["teacher", "doctor"], answer: 0 },
      { q: "How old is Li Hua? ___", options: ["10", "12"], answer: 0 },
    ],
  },
  2: {
    title: "My Day",
    titleZh: "我的一天",
    text: "I wake up at 7 o'clock every morning. First, I brush my teeth and wash my face. Then I eat breakfast. I usually have bread and milk. I go to school at 8 o'clock. My school is big and beautiful. I have many friends at school. After school, I do my homework. In the evening, I watch TV with my family. I go to bed at 10 o'clock.",
    textZh: "我每天早上7点起床。首先，我刷牙洗脸。然后我吃早餐。我通常吃面包和牛奶。我8点去学校。我的学校又大又漂亮。我在学校有很多朋友。放学后，我做作业。晚上，我和家人一起看电视。我10点上床睡觉。",
    questions: [
      { q: "What time does he wake up?", options: ["7 o'clock", "8 o'clock"], answer: 0 },
      { q: "What does he eat for breakfast?", options: ["bread and milk", "rice and eggs"], answer: 0 },
      { q: "When does he go to bed?", options: ["10 o'clock", "11 o'clock"], answer: 0 },
    ],
  },
  3: {
    title: "Food I Like",
    titleZh: "我喜欢的食物",
    text: "I love food! My favorite food is rice and chicken. I eat rice every day because I am Chinese. I also like bread and eggs. For breakfast, I usually have milk and an apple. For lunch, I have rice with vegetables. For dinner, my mother cooks fish. She makes the best fish in the world! I don't like vegetables, but I try to eat them. Fruit is good for health. I eat an orange every day.",
    textZh: "我爱美食！我最喜欢的食物是米饭和鸡肉。我每天吃米饭因为我是中国人。我也喜欢面包和鸡蛋。早餐我通常喝牛奶吃一个苹果。午餐我吃米饭配蔬菜。晚餐我妈妈做鱼。她做的鱼是世界上最好的！我不喜欢蔬菜，但我尽量吃。水果对健康有益。我每天吃一个橙子。",
    questions: [
      { q: "What is his favorite food?", options: ["rice and chicken", "bread and milk"], answer: 0 },
      { q: "What does he have for lunch?", options: ["rice with vegetables", "fish"], answer: 0 },
      { q: "Does he like vegetables?", options: ["No, but he tries", "Yes, he loves them"], answer: 0 },
    ],
  },
  4: {
    title: "My Home",
    titleZh: "我的家",
    text: "I live in a small apartment in Beijing. My home has three rooms. My bedroom is small but clean. I have a big desk and a comfortable bed. The living room is where we watch TV and talk. My mother cooks in the kitchen. The kitchen is always warm. We have a small balcony with flowers. I love sitting on the balcony and reading books. My home is not big, but it is very cozy. I love my home.",
    textZh: "我住在北京的一个小公寓里。我的家有三个房间。我的卧室很小但很干净。我有一张大书桌和一张舒适的床。客厅是我们看电视和聊天的地方。我妈妈在厨房做饭。厨房总是暖暖的。我们有一个小阳台，上面有花。我喜欢坐在阳台上看书。我的家不大，但非常温馨。我爱我的家。",
    questions: [
      { q: "How many rooms does his home have?", options: ["3", "4"], answer: 0 },
      { q: "Where does his mother cook?", options: ["kitchen", "living room"], answer: 0 },
      { q: "What does he do on the balcony?", options: ["reads books", "watches TV"], answer: 0 },
    ],
  },
  5: {
    title: "My Friends",
    titleZh: "我的朋友",
    text: "I have many friends. My best friend is Wang Wei. He is 12 years old. He is tall and thin. He likes basketball and football. We play together after school every day. He is very funny and always makes me laugh. His favorite food is chicken. He wants to be a basketball player when he grows up. I also have a friend named Li Na. She is very quiet but very smart. She likes reading and painting. We are all good friends.",
    textZh: "我有很多朋友。我最好的朋友是王伟。他12岁了。他又高又瘦。他喜欢篮球和足球。我们每天放学后一起玩。他很有趣，总是让我笑。他最喜欢的食物是鸡肉。他长大后想当篮球运动员。我还有一个朋友叫李娜。她很安静但很聪明。她喜欢读书和画画。我们都是好朋友。",
    questions: [
      { q: "How old is Wang Wei?", options: ["12", "10"], answer: 0 },
      { q: "What does Wang Wei want to be?", options: ["basketball player", "teacher"], answer: 0 },
      { q: "What does Li Na like?", options: ["reading and painting", "basketball"], answer: 0 },
    ],
  },
  6: {
    title: "Shopping",
    titleZh: "购物",
    text: "Today is Saturday. My mother and I go to the store. We buy many things. We buy rice, bread, milk, and eggs. We also buy some fruit: apples, bananas, and oranges. I want to buy candy, but my mother says no. She says candy is bad for my teeth. Then we go to the clothes store. My mother buys me a new shirt. It is blue. I like it very much. We spend two hours shopping. After shopping, we eat lunch at a restaurant. I have chicken and rice. It is a good day!",
    textZh: "今天是星期六。我和妈妈去商店。我们买了很多东西。我们买了米饭、面包、牛奶和鸡蛋。我们也买了一些水果：苹果、香蕉和橙子。我想买糖果，但妈妈说不行。她说糖果对牙齿不好。然后我们去了服装店。妈妈给我买了一件新衬衫。是蓝色的。我非常喜欢。我们花了两个小时购物。购物后，我们在餐厅吃午饭。我吃了鸡肉和米饭。今天过得很好！",
    questions: [
      { q: "What day is it?", options: ["Saturday", "Sunday"], answer: 0 },
      { q: "Why can't he buy candy?", options: ["bad for teeth", "too expensive"], answer: 0 },
      { q: "What color is the new shirt?", options: ["blue", "red"], answer: 0 },
    ],
  },
  7: {
    title: "Weather",
    titleZh: "天气",
    text: "The weather changes every day. In spring, it is warm. I can see flowers and green trees. In summer, it is very hot. I like to eat ice cream and drink cold water. In autumn, the leaves turn red and yellow. It is cool and nice. In winter, it is very cold. Sometimes it snows! I can play with snow and make a snowman. My favorite season is summer because I can swim and eat ice cream. What is your favorite season?",
    textZh: "天气每天都在变。春天很温暖。我能看到花和绿树。夏天非常热。我喜欢吃冰淇淋和喝冷水。秋天树叶变红变黄。天气凉爽宜人。冬天非常冷。有时会下雪！我可以玩雪和堆雪人。我最喜欢的季节是夏天，因为我可以游泳和吃冰淇淋。你最喜欢的季节是什么？",
    questions: [
      { q: "What is his favorite season?", options: ["summer", "winter"], answer: 0 },
      { q: "What happens in autumn?", options: ["leaves turn red and yellow", "it snows"], answer: 0 },
      { q: "What does he do in summer?", options: ["swim and eat ice cream", "make snowman"], answer: 0 },
    ],
  },
  8: {
    title: "My School Day",
    titleZh: "我的学校生活",
    text: "I go to school from Monday to Friday. School starts at 8 o'clock. I have four classes in the morning: Chinese, Math, English, and Science. I like English class the most. My English teacher is very nice. She speaks English slowly so we can understand. After morning classes, I eat lunch at school. The food is OK. In the afternoon, I have two more classes: Art and PE. I love PE because I can run and play sports. School ends at 3 o'clock. After school, I go home and do my homework. I finish homework by 6 o'clock. Then I have dinner with my family.",
    textZh: "我周一到周五去上学。学校8点开始上课。我上午有四节课：语文、数学、英语和科学。我最喜欢英语课。我的英语老师很好。她说英语很慢，这样我们能听懂。上午课后，我在学校吃午饭。食物还可以。下午我还有两节课：美术和体育。我喜欢体育课，因为可以跑步和做运动。学校3点放学。放学后，我回家做作业。我6点前做完作业。然后和家人一起吃晚饭。",
    questions: [
      { q: "What class does he like most?", options: ["English", "Math"], answer: 0 },
      { q: "What time does school end?", options: ["3 o'clock", "4 o'clock"], answer: 0 },
      { q: "Why does he like PE?", options: ["can run and play sports", "it is easy"], answer: 0 },
    ],
  },
  9: {
    title: "My Neighborhood",
    titleZh: "我的社区",
    text: "I live in a nice neighborhood. There is a small park near my home. I go there every evening to walk and exercise. There is also a big supermarket where my mother buys food. Next to the supermarket, there is a bakery. They sell delicious bread and cakes. I sometimes buy bread there with my pocket money. There is a library two blocks away from my home. I go there every weekend to read books. The librarian is very kind. My neighborhood is quiet and clean. I like living here.",
    textZh: "我住在一个很好的社区。我家附近有一个小公园。我每天晚上去那里散步和锻炼。还有一个大超市，我妈妈在那里买食物。超市旁边有一家面包店。他们卖好吃的面包和蛋糕。我有时用零花钱在那里买面包。我家两个街区外有一个图书馆。我每个周末都去那里看书。图书管理员人很好。我的社区安静又干净。我喜欢住在这里。",
    questions: [
      { q: "What is near his home?", options: ["a small park", "a big school"], answer: 0 },
      { q: "Where does he go on weekends?", options: ["library", "supermarket"], answer: 0 },
      { q: "What does the bakery sell?", options: ["bread and cakes", "rice"], answer: 0 },
    ],
  },
  10: {
    title: "A Trip to the Zoo",
    titleZh: "去动物园",
    text: "Last Sunday, I went to the zoo with my family. We saw many animals. The lions were big and strong. They slept all day! The monkeys were very funny. They jumped from tree to tree. The elephants were huge. They used their long noses to drink water. My favorite animals were the pandas. They were so cute! They ate bamboo and rolled around. I took many pictures. After visiting the animals, we ate lunch at the zoo restaurant. I had a hamburger. Then we went to the gift shop. I bought a small teddy bear. It was the best day ever!",
    textZh: "上个星期天，我和家人去了动物园。我们看到了很多动物。狮子很大很强壮。它们整天都在睡觉！猴子们很有趣。它们从一棵树跳到另一棵树。大象非常大。它们用长鼻子喝水。我最喜欢的动物是熊猫。它们太可爱了！它们吃竹子还滚来滚去。我拍了很多照片。看完动物后，我们在动物园餐厅吃了午饭。我吃了汉堡。然后我们去了礼品店。我买了一个小泰迪熊。这是最棒的一天！",
    questions: [
      { q: "What did they see at the zoo?", options: ["many animals", "many fish"], answer: 0 },
      { q: "What were his favorite animals?", options: ["pandas", "lions"], answer: 0 },
      { q: "What did he buy at the gift shop?", options: ["teddy bear", "book"], answer: 0 },
    ],
  },
};

/** Day-specific writing tasks */
const DAY_WRITING: Record<number, { task: string; taskZh: string; template: string; hints: string[] }> = {
  1: { task: "Write 3 sentences introducing yourself", taskZh: "写3个句子介绍你自己", template: "My name is ___.\nI am from ___.\nI like ___.", hints: ["用 My name is... 开头", "用 I am from... 说你来自哪里", "用 I like... 说你喜欢什么"] },
  2: { task: "Write about your family", taskZh: "写关于你的家庭", template: "My family has ___ people.\nMy father is a ___.\nMy mother is a ___.\nI love my family.", hints: ["用 My family has... 说有几口人", "用 My father/mother is a... 说职业", "最后说 I love my family"] },
  3: { task: "Write 5 sentences about your favorite food", taskZh: "写5个关于你最喜欢食物的句子", template: "I like ___.\n___ is delicious.\nI eat ___ every day.\n___ is good for health.\nMy favorite food is ___.", hints: ["用 I like... 开头", "用 ... is delicious 说好吃", "用 ... is good for health 说健康"] },
  4: { task: "Write about your home", taskZh: "写关于你的家", template: "I live in ___.\nMy home has ___ rooms.\nMy bedroom is ___.\nI like my home because ___.", hints: ["用 I live in... 说住哪", "用 My home has... 说几个房间", "用 I like... because 说原因"] },
  5: { task: "Write about your best friend", taskZh: "写关于你最好的朋友", template: "My best friend is ___.\nHe/She is ___ years old.\nHe/She likes ___.\nWe often ___.\nHe/She is very ___.", hints: ["用 My best friend is... 开头", "用 He/She is... 描述年龄", "用 We often... 说一起做的事"] },
  6: { task: "Write a shopping list", taskZh: "写一个购物清单", template: "Shopping List:\n1. ___\n2. ___\n3. ___\n4. ___\n5. ___\nI need to buy ___.", hints: ["列5样你要买的东西", "用数字编号", "最后说 I need to buy..."] },
  7: { task: "Write about the weather", taskZh: "写关于天气", template: "Today is ___.\nThe weather is ___.\nIt is ___ outside.\nI like ___ weather.\nIn ___, I can ___.", hints: ["用 Today is... 说今天星期几", "用 The weather is... 说天气", "用 In... 说在什么天气能做什么"] },
  8: { task: "Write about your school day", taskZh: "写关于你的学校生活", template: "I go to school at ___.\nI have ___ classes today.\nI like ___ class.\nAfter school, I ___.\nSchool ends at ___.", hints: ["用 I go to school at... 说上学时间", "用 I like... class 说最喜欢的课", "用 After school... 说放学后做什么"] },
  9: { task: "Write about your neighborhood", taskZh: "写关于你的社区", template: "I live in ___.\nThere is a ___ near my home.\nI often go to ___.\nMy neighborhood is ___.\nI like it because ___.", hints: ["用 There is a... 说附近有什么", "用 I often go to... 说常去哪", "用 I like it because... 说原因"] },
  10: { task: "Write about a trip", taskZh: "写关于一次旅行", template: "Last ___, I went to ___.\nI saw ___.\nI ate ___.\nIt was very ___.\nI want to go again!", hints: ["用 Last... 说什么时候", "用 I went to... 说去了哪", "用 It was very... 说感受"] },
};

/** Day-specific pronunciation focus */
const DAY_PHONICS: Record<number, { sound: string; soundZh: string; letters: string[]; examples: string[]; chinese: string[] }> = {
  1: { sound: "A-E", soundZh: "元音A的字母名和发音", letters: ["A", "B", "C", "D", "E"], examples: ["apple", "book", "cat", "dog", "egg"], chinese: ["苹果", "书", "猫", "狗", "鸡蛋"] },
  2: { sound: "F-J", soundZh: "字母F到J的发音", letters: ["F", "G", "H", "I", "J"], examples: ["fish", "go", "hat", "ice", "juice"], chinese: ["鱼", "去", "帽子", "冰", "果汁"] },
  3: { sound: "K-O", soundZh: "字母K到O的发音", letters: ["K", "L", "M", "N", "O"], examples: ["kite", "leg", "moon", "nose", "orange"], chinese: ["风筝", "腿", "月亮", "鼻子", "橙子"] },
  4: { sound: "P-T", soundZh: "字母P到T的发音", letters: ["P", "Q", "R", "S", "T"], examples: ["pen", "queen", "rain", "sun", "tree"], chinese: ["笔", "女王", "雨", "太阳", "树"] },
  5: { sound: "U-Z", soundZh: "字母U到Z的发音", letters: ["U", "V", "W", "X", "Y", "Z"], examples: ["umbrella", "van", "water", "box", "yellow", "zoo"], chinese: ["雨伞", "货车", "水", "盒子", "黄色", "动物园"] },
  6: { sound: "短元音 a/e", soundZh: "cat和bed中的元音", letters: ["a", "e"], examples: ["cat", "hat", "bed", "red"], chinese: ["猫", "帽子", "床", "红色"] },
  7: { sound: "短元音 i/o/u", soundZh: "sit/pot/cup中的元音", letters: ["i", "o", "u"], examples: ["sit", "hot", "cup", "dog"], chinese: ["坐", "热", "杯子", "狗"] },
  8: { sound: "长元音 ee/ea", soundZh: "see和eat中的元音", letters: ["ee", "ea"], examples: ["see", "tree", "eat", "read"], chinese: ["看", "树", "吃", "读"] },
  9: { sound: "辅音组合 sh/ch/th", soundZh: "嘴唇舌头配合的辅音", letters: ["sh", "ch", "th"], examples: ["ship", "she", "chip", "this"], chinese: ["船", "她", "芯片", "这个"] },
  10: { sound: "辅音组合 tr/dr/st", soundZh: "辅音连读组合", letters: ["tr", "dr", "st"], examples: ["tree", "train", "drive", "stop"], chinese: ["树", "火车", "开", "停"] },
};

/** Day-specific grammar focus */
const DAY_GRAMMAR: Record<number, { rule: string; ruleZh: string; examples: Array<{ en: string; zh: string }>; exercise: { q: string; options: string[]; answer: number } }> = {
  1: {
    rule: "be动词 (am/is/are)",
    ruleZh: "我am你are，他她它是is，复数全部都用are",
    examples: [
      { en: "I am a student.", zh: "我是学生。" },
      { en: "You are my friend.", zh: "你是我的朋友。" },
      { en: "He is a teacher.", zh: "他是老师。" },
      { en: "She is beautiful.", zh: "她很漂亮。" },
      { en: "It is a cat.", zh: "它是一只猫。" },
      { en: "We are students.", zh: "我们是学生。" },
    ],
    exercise: { q: "I ___ a student.", options: ["am", "is", "are"], answer: 0 },
  },
  2: {
    rule: "人称代词 (I/you/he/she/it/we/they)",
    ruleZh: "记住每个代词对应的be动词",
    examples: [
      { en: "I → am", zh: "我→am" },
      { en: "You → are", zh: "你→are" },
      { en: "He/She/It → is", zh: "他/她/它→is" },
      { en: "We/They → are", zh: "我们/他们→are" },
    ],
    exercise: { q: "___ is my brother. (He/Him)", options: ["He", "Him", "His"], answer: 0 },
  },
  3: {
    rule: "可数名词复数 (-s/-es)",
    ruleZh: "一般加s，以s/sh/ch/x结尾加es",
    examples: [
      { en: "cat → cats", zh: "猫→猫们" },
      { en: "box → boxes", zh: "箱子→箱子们" },
      { en: "child → children", zh: "孩子→孩子们（不规则）" },
    ],
    exercise: { q: "I have two ___. (book/books)", options: ["books", "book", "bookes"], answer: 0 },
  },
  4: {
    rule: "形容词用法",
    ruleZh: "形容词放在名词前面或be动词后面",
    examples: [
      { en: "a big house", zh: "一栋大房子（形容词在名词前）" },
      { en: "The food is delicious.", zh: "食物很好吃。（形容词在be动词后）" },
    ],
    exercise: { q: "This is a ___ house. (big)", options: ["big", "bigger", "biggest"], answer: 0 },
  },
  5: {
    rule: "一般现在时 (Simple Present)",
    ruleZh: "表示习惯和事实，第三人称单数加s",
    examples: [
      { en: "I eat breakfast every day.", zh: "我每天吃早餐。" },
      { en: "She eats breakfast at 7.", zh: "她7点吃早餐。（第三人称加s）" },
      { en: "He goes to school.", zh: "他去上学。（go→goes）" },
    ],
    exercise: { q: "She ___ to school every day. (go/goes)", options: ["goes", "go", "going"], answer: 0 },
  },
  6: {
    rule: "there is / there are",
    ruleZh: "there is + 单数，there are + 复数",
    examples: [
      { en: "There is a cat on the table.", zh: "桌子上有一只猫。" },
      { en: "There are three books.", zh: "有三本书。" },
    ],
    exercise: { q: "There ___ two cats. (is/are)", options: ["are", "is", "am"], answer: 0 },
  },
  7: {
    rule: "一般疑问句",
    ruleZh: "be动词提前，动词用do/does开头",
    examples: [
      { en: "Are you a student?", zh: "你是学生吗？" },
      { en: "Do you like apples?", zh: "你喜欢苹果吗？" },
      { en: "Does she speak English?", zh: "她说英语吗？" },
    ],
    exercise: { q: "___ you like English? (Do/Does)", options: ["Do", "Does", "Are"], answer: 0 },
  },
  8: {
    rule: "现在进行时 (be + doing)",
    ruleZh: "be动词 + 动词ing，表示正在进行",
    examples: [
      { en: "I am eating lunch.", zh: "我正在吃午饭。" },
      { en: "She is reading a book.", zh: "她正在读书。" },
      { en: "They are playing football.", zh: "他们正在踢足球。" },
    ],
    exercise: { q: "She ___ reading a book. (is/are/am)", options: ["is", "are", "am"], answer: 0 },
  },
  9: {
    rule: "方位介词 (in/on/under/behind/near)",
    ruleZh: "表示位置关系的词",
    examples: [
      { en: "The cat is on the table.", zh: "猫在桌子上。" },
      { en: "The book is in the bag.", zh: "书在书包里。" },
      { en: "The ball is under the chair.", zh: "球在椅子下面。" },
    ],
    exercise: { q: "The cat is ___ the table. (on/in)", options: ["on", "in", "at"], answer: 0 },
  },
  10: {
    rule: "情态动词 can",
    ruleZh: "can + 动词原形，表示能力",
    examples: [
      { en: "I can swim.", zh: "我会游泳。" },
      { en: "She can speak English.", zh: "她会说英语。" },
      { en: "Can you help me?", zh: "你能帮助我吗？" },
    ],
    exercise: { q: "I ___ swim very fast. (can/can's)", options: ["can", "cans", "canning"], answer: 0 },
  },
};

// Fill days 11-30 with cycling content
for (let d = 11; d <= 30; d++) {
  const refDay = ((d - 1) % 10) + 1;
  if (!DAY_VOCABULARY[d]) DAY_VOCABULARY[d] = DAY_VOCABULARY[refDay] || DAY_VOCABULARY[1];
  if (!DAY_READING[d]) DAY_READING[d] = DAY_READING[refDay] || DAY_READING[1];
  if (!DAY_WRITING[d]) DAY_WRITING[d] = DAY_WRITING[refDay] || DAY_WRITING[1];
  if (!DAY_PHONICS[d]) DAY_PHONICS[d] = DAY_PHONICS[refDay] || DAY_PHONICS[1];
  if (!DAY_GRAMMAR[d]) DAY_GRAMMAR[d] = DAY_GRAMMAR[refDay] || DAY_GRAMMAR[1];
}

// ============================================================
// DailyCoachEngineV2
// ============================================================

export class DailyCoachEngineV2 {
  private missions: Map<string, DailyMission> = new Map();

  generateMission(profile: LearnerProfile): DailyMission {
    const day = Math.max(1, Math.min(360, profile.currentDay || 1));
    const today = new Date().toISOString().split("T")[0];
    const missionId = `mission_${profile.userId}_${today}`;

    // Check if mission already generated today
    const existing = this.missions.get(missionId);
    if (existing) return existing;

    const dayVocab = DAY_VOCABULARY[day] || DAY_VOCABULARY[1];
    const dayReading = DAY_READING[day] || DAY_READING[1];
    const dayWriting = DAY_WRITING[day] || DAY_WRITING[1];
    const dayPhonics = DAY_PHONICS[day] || DAY_PHONICS[1];
    const dayGrammar = DAY_GRAMMAR[day] || DAY_GRAMMAR[1];

    const activities: MissionActivityItem[] = [
      {
        id: "act_srs",
        type: "srs_review",
        title: "SRS Review",
        titleChinese: "🔄 SRS复习",
        description: "Review vocabulary due for repetition",
        descriptionChinese: "复习需要重复的词汇",
        durationMinutes: 30,
        priority: "high",
        content: { reviewCount: Math.max(5, day * 2) },
        completed: false,
      },
      {
        id: "act_pronunciation",
        type: "pronunciation",
        title: "Pronunciation",
        titleChinese: `🔤 发音：${dayPhonics.sound}`,
        description: `Practice ${dayPhonics.soundZh}`,
        descriptionChinese: dayPhonics.soundZh,
        durationMinutes: 20,
        priority: "high",
        content: dayPhonics,
        completed: false,
      },
      {
        id: "act_vocabulary",
        type: "vocabulary_new",
        title: "New Vocabulary",
        titleChinese: `📚 Day ${day} 新词汇`,
        description: `Learn ${dayVocab.length} new words`,
        descriptionChinese: `学习第${day}天的${dayVocab.length}个新词汇`,
        durationMinutes: 30,
        priority: "high",
        content: { words: dayVocab },
        completed: false,
      },
      {
        id: "act_listening",
        type: "listening_input",
        title: "Listening",
        titleChinese: "👂 听力练习",
        description: "Listen and understand",
        descriptionChinese: "听对话，理解内容",
        durationMinutes: 40,
        priority: "high",
        content: { listeningDuration: 40, day },
        completed: false,
      },
      {
        id: "act_shadowing",
        type: "shadowing",
        title: "Shadowing",
        titleChinese: "🗣️ 跟读练习",
        description: "Listen and repeat",
        descriptionChinese: "听一句，跟读一句",
        durationMinutes: 30,
        priority: "high",
        content: { shadowingDuration: 30, day },
        completed: false,
      },
      {
        id: "act_conversation",
        type: "conversation",
        title: "AI Conversation",
        titleChinese: "💬 对话练习",
        description: "Practice speaking with AI tutor",
        descriptionChinese: "与AI导师练习口语",
        durationMinutes: 30,
        priority: "high",
        content: { conversationTopic: `Day ${day} topic`, conversationLevel: profile.level },
        completed: false,
      },
      {
        id: "act_reading",
        type: "reading",
        title: "Reading",
        titleChinese: `📖 阅读：${dayReading.titleZh}`,
        description: `Read "${dayReading.title}"`,
        descriptionChinese: `阅读「${dayReading.titleZh}」`,
        durationMinutes: 20,
        priority: "medium",
        content: dayReading,
        completed: false,
      },
      {
        id: "act_writing",
        type: "writing",
        title: "Writing",
        titleChinese: `✏️ 写作：${dayWriting.taskZh}`,
        description: dayWriting.task,
        descriptionChinese: dayWriting.taskZh,
        durationMinutes: 15,
        priority: "medium",
        content: dayWriting,
        completed: false,
      },
      {
        id: "act_grammar",
        type: "grammar",
        title: "Grammar",
        titleChinese: `📝 语法：${dayGrammar.ruleZh}`,
        description: dayGrammar.rule,
        descriptionChinese: dayGrammar.ruleZh,
        durationMinutes: 20,
        priority: "medium",
        content: dayGrammar,
        completed: false,
      },
    ];

    const mission: DailyMission = {
      id: missionId,
      userId: profile.userId,
      day,
      date: today,
      activities,
      totalTimeMinutes: profile.dailyGoalMinutes,
      focusAreas: this.determineFocusAreas(profile),
      difficulty: this.determineDifficulty(profile),
      audioSpeed: this.determineAudioSpeed(profile),
      completed: false,
      completedActivities: [],
      score: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.missions.set(missionId, mission);
    return mission;
  }

  completeActivity(missionId: string, activityId: string, score: number): void {
    const mission = this.missions.get(missionId);
    if (!mission) return;
    if (!mission.completedActivities.includes(activityId)) {
      mission.completedActivities.push(activityId);
    }
    mission.score = (mission.score + score) / 2;
    mission.updatedAt = Date.now();
    if (mission.completedActivities.length === mission.activities.length) {
      mission.completed = true;
    }
  }

  private determineFocusAreas(profile: LearnerProfile): string[] {
    const areas: string[] = [];
    const weak = profile.weakAreas || [];
    areas.push(...weak.slice(0, 3));
    if (areas.length < 3) areas.push("pronunciation", "listening");
    return areas.slice(0, 5);
  }

  private determineDifficulty(profile: LearnerProfile): "easy" | "normal" | "hard" {
    const avg = (profile.vocabularyLevel + profile.listeningLevel + profile.speakingLevel + profile.grammarLevel) / 4;
    if (avg < 40) return "easy";
    if (avg < 70) return "normal";
    return "hard";
  }

  private determineAudioSpeed(profile: LearnerProfile): "slow" | "normal" | "fast" {
    if (profile.listeningLevel < 40) return "slow";
    if (profile.listeningLevel < 70) return "normal";
    return "fast";
  }
}
