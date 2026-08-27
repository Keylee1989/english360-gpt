/**
 * 词汇记忆增强字典 — A1-B2 高频词专属记忆法
 *
 * 5种记忆法：
 * 1. 谐音联想：用中文近似音编故事
 * 2. 拆词联想：把单词拆成可理解的部分
 * 3. 词根词缀：拉丁/希腊词根解释
 * 4. 场景故事：绑定到具体画面
 * 5. 口诀记忆：朗朗上口的助记句
 */

export interface MemoryEntry {
  /** 谐音联想 — 用中文近似发音编一个画面 */
  homophonic?: string;
  /** 拆词联想 — 拆解成有意义的部分 */
  splitting?: string;
  /** 场景故事 — 绑定到一个具体场景 */
  scene?: string;
  /** 口诀/对比 — 朗朗上口的助记句或易混词对比 */
  rhyme?: string;
}

// ============================================================
// A1 入门级（最高频 150 词）
// ============================================================

export const A1_MEMORY: Record<string, MemoryEntry> = {
  // --- 问候/社交 ---
  hello: {
    homophonic: "哈喽！想象你在街上碰到老朋友，大喊一声'哈喽'(hello)，对方回头笑——打招呼就从这个词开始",
    splitting: "hell(地狱) + o(哦) → 地狱里的人也想说'哦，你好啊'→ 打招呼",
    scene: "飞机降落美国，海关人员对你说'Hello, welcome!' 你紧张地点点头——这是你在英语世界说的第一个词",
    rhyme: "hello = 哈 + 喂 → 哈喽！见面先哈喽",
  },
  hi: {
    homophonic: "嗨！像中文的'嗨'，但英文更短更快——Hi! 打招呼用最短的词",
    scene: "早上进办公室，对同事说 'Hi!' 就够了，不需要 always 说 Hello",
    rhyme: "Hi 比 Hello 更随意，朋友之间用 Hi",
  },
  goodbye: {
    homophonic: "哥德拜——跟哥(哥)说拜拜→告别",
    splitting: "good(好) + bye(再见) → 好好地说再见",
    scene: "放学时老师说 'Goodbye, see you tomorrow!' 你挥手说 Bye!",
    rhyme: "goodbye = 好 + 拜 → 好好拜拜",
  },
  please: {
    homophonic: "扑里兹——想象一个客气的人扑过来给你东西说'请'",
    scene: "在餐厅你说 'Water, please.' (请给我水)——加 please 就有礼貌",
    rhyme: "有 please 是礼貌，没 please 是命令",
  },
  thank: {
    homophonic: "三克油(Thank you) → 三克油不够，要真心感谢",
    scene: "陌生人帮你捡起掉落的东西，你微笑着说 'Thank you!'",
    rhyme: "Thank you 最常用，Thanks 更口语，Thank you very much 更正式",
  },
  sorry: {
    homophonic: "扫瑞——扫到了别人的脚说'对不起'",
    scene: "在拥挤的地铁踩到别人的脚：'Sorry!' 对方也会说 'That's OK.'",
    rhyme: "Sorry=对不起，Excuse me=打扰一下/借过",
  },
  yes: {
    homophonic: "耶斯！→ 耶！是的！",
    scene: "老师问 'Do you understand?' 你点头说 'Yes!'",
    rhyme: "Yes = 是的，No = 不是",
  },
  no: {
    homophonic: "诺！→ 诺，不行！",
    scene: "有人问你 'Do you smoke?' 你摇头说 'No, I don't.'",
    rhyme: "No 后面常跟 not：No, I don't / No, I can't",
  },

  // --- 自我介绍 ---
  name: {
    homophonic: "内姆——你的名字是不是叫'内姆'？",
    scene: "第一天上班，同事问 'What's your name?' 你回答 'My name is Li Ming.'",
    rhyme: "My name is... = 我的名字是...",
  },
  my: {
    homophonic: "买！→ 买的是'我的'",
    scene: "指着自己的书包说 'This is my bag.' (这是我的书包)",
    rhyme: "my=我的，your=你的，his=他的，her=她的",
  },
  your: {
    homophonic: "有儿→你'有儿'子吗？这是'你的'问题",
    scene: "老师指着你说 'What is your name?' (你的名字是什么)",
    rhyme: "my→your→his→her→our→their（我的→你的→他的→她的→我们的→他们的）",
  },
  I: {
    homophonic: "爱！→ 爱自己，所以'我'读'爱'",
    scene: "每个人说英语的第一个词就是 I (我)——永远大写！",
    rhyme: "I 永远大写，放在句首",
  },
  am: {
    homophonic: "爱母→我(I)爱(am)母亲→I am",
    scene: "'I am a student.' 我是一名学生——am 只和 I 搭配",
    rhyme: "I am, you are, he is, she is, it is, we are, they are",
  },
  is: {
    homophonic: "是！→ is 就是'是'的意思",
    scene: "'She is beautiful.' 她是漂亮的——is 搭配 he/she/it",
    rhyme: "am(我) / is(他她它) / are(你们他们)",
  },
  are: {
    homophonic: "啊！→ 你们啊(are)都很棒",
    scene: "'You are my friend.' 你是我的朋友——are 搭配 you/we/they",
    rhyme: "are 搭配复数和 you",
  },
  student: {
    homophonic: "死丢等特→一个学生(student)在等死(等)特(别)难的考试",
    splitting: "stud(y 学习) + ent(人) → 学习的人 = 学生",
    scene: "教室里坐满了 students，老师说 'Good morning, students!'",
    rhyme: "student 学生，teacher 老师，classmate 同学",
  },
  teacher: {
    splitting: "teach(教) + er(人) → 教书的人 = 老师",
    scene: "'My teacher is very kind.' 我的老师很善良",
    rhyme: "teach(教) → teacher(老师)，learn(学) → learner(学习者)",
  },
  from: {
    homophonic: "福容→从(FROM)中国来，带着福气和容颜",
    scene: "'I am from China.' 我来自中国——from 表示来源",
    rhyme: "be from + 地方 = 来自哪里",
  },
  China: {
    homophonic: "拆那！→ 中国(CHINA)不能拆",
    scene: "'I love China.' 我爱中国——China 首字母大写是国家",
    rhyme: "China=中国(大写)，china=瓷器(小写)",
  },
  English: {
    homophonic: "英搁利是→英国的语言(English)很有利是(好事)",
    scene: "'I am learning English.' 我在学英语",
    rhyme: "English=英语/英国的，Chinese=中文/中国的",
  },

  // --- 数字/时间 ---
  one: {
    homophonic: "旺！→ 一个(ONE)旺旺旺",
    scene: "'I have one brother.' 我有一个兄弟",
    rhyme: "one→two→three→four→five(一二三四五)",
  },
  two: {
    homophonic: "兔！→ 两只(TWO)兔子",
    scene: "'I have two cats.' 我有两只猫",
    rhyme: "two 里有个 w 不发音，拼写注意",
  },
  three: {
    homophonic: "撕蕊！→ 三朵(THREE)花蕊被撕了",
    scene: "'There are three apples.' 有三个苹果",
    rhyme: "three 的 th 要咬舌，不是 sree",
  },
  today: {
    splitting: "to(到) + day(天) → 到了这一天 = 今天",
    scene: "'What are you doing today?' 你今天在做什么？",
    rhyme: "today=今天，tomorrow=明天，yesterday=昨天",
  },
  tomorrow: {
    splitting: "to(到) + morrow(早晨) → 到了明天早晨 = 明天",
    scene: "'See you tomorrow!' 明天见！——最常用的告别语",
    rhyme: "today/tomorrow/yesterday 三个时间词一起记",
  },
  time: {
    homophonic: "太母→时间(TIME)太像母亲一样珍贵",
    scene: "'What time is it?' 现在几点了？",
    rhyme: "What time = 几点，on time = 准时，in time = 及时",
  },
  day: {
    homophonic: "对！→ 每天(DAY)都要对得起自己",
    scene: "'Have a nice day!' 祝你今天愉快！",
    rhyme: "day=天，week=周，month=月，year=年",
  },

  // --- 基础动词 ---
  have: {
    homophonic: "哈夫！→ 哈！我有(HAVE)！",
    scene: "'I have a dream.' 我有一个梦想——最经典的 have 句",
    rhyme: "have=有，has=有(第三人称)，had=有(过去式)",
  },
  do: {
    homophonic: "杜！→ 你做(DO)什么杜(度)？",
    scene: "'What do you do?' 你是做什么工作的？",
    rhyme: "do/does/did 是万能助动词",
  },
  go: {
    homophonic: "狗！→ 狗(GO)出去了→走/去",
    scene: "'Let's go!' 我们走吧！",
    rhyme: "go=去(现在)，went=去(过去)，gone=去了(过去分词)",
  },
  come: {
    homophonic: "卡姆！→ 卡车来了(COME)，快让开",
    scene: "'Come in, please.' 请进！",
    rhyme: "come=来，go=去，bring=带来，take=带走",
  },
  get: {
    homophonic: "盖特！→ 盖(GE)特(T)别想得到(GET)它",
    scene: "'Can I get a coffee?' 我能来杯咖啡吗？",
    rhyme: "get 是英语最万能的词之一：得到/到达/变得/理解",
  },
  make: {
    homophonic: "妹克！→ 妹妹能制(MAKE)作蛋糕",
    scene: "'Make yourself at home.' 请自便（把自己当在家一样）",
    rhyme: "make=做/制作/make sure=确保/make friends=交朋友",
  },
  take: {
    homophonic: "忒克！→ 忒(T太)快地拿(TAKE)走了",
    scene: "'Take a seat.' 请坐（拿一个座位）",
    rhyme: "take=拿走 vs bring=带来 vs carry=搬运",
  },
  give: {
    homophonic: "给吾！→ 给(GIVE)我！",
    scene: "'Give me a chance.' 给我一个机会",
    rhyme: "give=给(现在)，gave=给(过去)，given=给了(过去分词)",
  },
  know: {
    homophonic: "诺！→ 我知道(KNOW)了，诺！",
    splitting: "k不发音 → know 读 /noʊ/，和 no 同音",
    scene: "'I know the answer!' 我知道答案！",
    rhyme: "know 的 k 不发音！knee/knife/knight 的 k 也不发音",
  },
  think: {
    homophonic: "醒克！→ 你醒(K)了，想(THINK)一想",
    scene: "'I think so.' 我也这么认为",
    rhyme: "think=想，thought=想了(过去式)。I think that... 我认为...",
  },
  want: {
    homophonic: "旺特！→ 特别旺，特别想要(WANT)",
    scene: "'I want to learn English.' 我想学英语",
    rhyme: "want to + 动词原形 = 想要做某事",
  },
  like: {
    homophonic: "来客！→ 来了客人(LIKE)，好喜欢",
    scene: "'I like reading.' 我喜欢阅读",
    rhyme: "like + 名词 = 喜欢某物；like + V-ing = 喜欢做某事",
  },
  can: {
    homophonic: "砍！→ 能(CAN)砍树",
    scene: "'I can swim.' 我会游泳",
    rhyme: "can + 动词原形 = 能够做某事(没有to！)",
  },
  eat: {
    homophonic: "伊特！→ 伊人特别爱吃(EAT)",
    scene: "'Let's eat lunch.' 我们吃午饭吧",
    rhyme: "eat=吃(现在)，ate=吃了(过去)，eaten=吃了(过去分词)",
  },
  drink: {
    homophonic: "拽因克！→ 拽着饮料(DRINK)喝",
    scene: "'Can I have something to drink?' 我能要点喝的吗？",
    rhyme: "drink=喝(现在)，drank=喝了(过去)，drunk=喝了(过去分词)",
  },
  sleep: {
    homophonic: "死力扑！→ 累死了，扑倒就睡(SLEEP)",
    scene: "'I sleep at 11pm.' 我晚上11点睡觉",
    rhyme: "sleep=睡(现在)，slept=睡了(过去)，sleepy=困的",
  },
  read: {
    homophonic: "瑞的！→ 瑞士人喜欢读(READ)书",
    scene: "'I read books every night.' 我每晚读书",
    rhyme: "read(现在)/read(过去，同拼但发音变/riːd/)/read(过去分词)",
  },
  write: {
    homophonic: "入艾特！→ 用笔写(WRITE)入纸上",
    splitting: "wr- 开头 w 不发音，只读 /raɪt/",
    scene: "'Please write your name here.' 请在这里写上你的名字",
    rhyme: "write=写，writer=作家，writing=写作",
  },
  see: {
    homophonic: "西！→ 看到(SEE)大海(西)了！",
    scene: "'I can see the mountains.' 我能看到山",
    rhyme: "see=看到(被动) vs look=看(主动，look at) vs watch=观看(持续)",
  },
  look: {
    homophonic: "鹿客！→ 鹿(LOOK)是森林的客人，你要看(Look)它",
    scene: "'Look at this picture.' 看这张图片",
    rhyme: "look at=看向，look for=寻找，look after=照顾",
  },
  listen: {
    homophonic: "利森！→ 一个叫利(LI)的人在听(LISTEN)",
    scene: "'Listen to the music.' 听音乐",
    rhyme: "listen to=倾听(需加to)，hear=听到(自然听到)",
  },
  speak: {
    homophonic: "死比克！→ 比赛(SPEAK)中开口说话",
    scene: "'Can you speak English?' 你会说英语吗？",
    rhyme: "speak=说话(能力)，talk=交谈(互动)，say=说出内容",
  },
  say: {
    homophonic: "塞！→ 把话塞(SAY)进别人耳朵里",
    scene: "'What did you say?' 你说了什么？",
    rhyme: "say=说出内容，tell=告诉某人，talk=交谈",
  },
  tell: {
    homophonic: "泰偶！→ 泰坦尼克号的(T)故事告诉(TELL)了偶",
    scene: "'Tell me a story.' 给我讲个故事",
    rhyme: "tell sb sth=告诉某人某事(双宾语)",
  },
  help: {
    homophonic: "黑偶扑！→ 黑暗中扑过来求 HELP(帮助)",
    scene: "'Help! I need help!' 救命！我需要帮助！",
    rhyme: "help=帮助，helper=帮手，helpful=有帮助的",
  },
  find: {
    homophonic: "范的！→ 找到(FIND)了一个范(凡)的(东西)",
    scene: "'I can't find my keys.' 我找不到我的钥匙",
    rhyme: "find=找到(现在)，found=找到了(过去)，lost=丢失(反义)",
  },
  put: {
    homophonic: "扑特！→ 扑(PU)上去特别(T)用力→放(PUT)",
    scene: "'Put it on the table.' 把它放在桌子上",
    rhyme: "put/put/put 三态不变！特殊动词",
  },
  open: {
    homophonic: "欧喷！→ 打开(OPEN)瓶子，欧！喷出来了",
    scene: "'Open the door, please.' 请开门",
    rhyme: "open=打开，close=关闭，shut=关上",
  },
  close: {
    homophonic: "克楼兹！→ 关(CLOSE)窗户的声音'克楼兹'",
    scene: "'Close the window, please.' 请关窗",
    rhyme: "close(动词/klōz/)=关闭，close(形容词/klōs/) = 近的",
  },
  start: {
    homophonic: "死大特！→ 大特(T)别想开始(START)",
    scene: "'Let's start the class.' 我们开始上课吧",
    rhyme: "start=开始，finish=结束，end=结束",
  },
  stop: {
    homophonic: "死ktop！→ 停！别死(STOP)记硬背",
    scene: "'Stop talking!' 别说话了！",
    rhyme: "stop + V-ing = 停止做某事",
  },
  try: {
    homophonic: "踹！→ 用力踹(TRY)一下试试",
    scene: "'Try again!' 再试一次！",
    rhyme: "try to + V = 尽力做，try + V-ing = 试着做",
  },
  need: {
    homophonic: "你的！→ 你(NEED)的！需要你的！",
    scene: "'I need your help.' 我需要你的帮助",
    rhyme: "need to + V = 需要做某事",
  },
  ask: {
    homophonic: "啊四克！→ 啊！四个问题一起问(ASK)",
    scene: "'Can I ask you a question?' 我能问你一个问题吗？",
    rhyme: "ask=问，answer=回答",
  },
  use: {
    homophonic: "优子！→ 用(USE)一个优秀的方法",
    scene: "'Can I use your pen?' 我能用你的笔吗？",
    rhyme: "use=使用，useful=有用的，useless=没用的",
  },
  play: {
    homophonic: "扑雷！→ 扑过去打雷(PLAY)了一天",
    scene: "'The children are playing outside.' 孩子们在外面玩",
    rhyme: "play=玩/演奏，player=选手，playground=操场",
  },
  run: {
    homophonic: "软！→ 跑(RUN)到柔软的草地上",
    scene: "'I run every morning.' 我每天早上跑步",
    rhyme: "run=跑(现在)，ran=跑了(过去)，running(双写n)",
  },
  walk: {
    homophonic: "沃克！→ 沃(W)尔(W)克(K)喜欢走路(WALK)",
    splitting: "al 不发音，walk 读 /wɔːk/",
    scene: "'Let's walk to school.' 我们走路去学校吧",
    rhyme: "walk=走(慢)，run=跑(快)",
  },
  sit: {
    homophonic: "席特！→ 席(SI)地而坐(T)",
    scene: "'Sit down, please.' 请坐下",
    rhyme: "sit=坐(现在)，sat=坐了(过去)，sit down=坐下",
  },
  stand: {
    homophonic: "死蛋的！→ 站(STAND)着像个死蛋",
    scene: "'Please stand up.' 请起立",
    rhyme: "stand=站立，stand up=站起来，sit down=坐下",
  },
  work: {
    homophonic: "沃克！→ 沃尔克在工作(WORK)",
    scene: "'I go to work at 9am.' 我早上9点上班",
    rhyme: "work(不可数名词)=工作，job(可数)=工作/职位",
  },
  new: {
    homophonic: "牛！→ 新(NEW)东西真牛",
    scene: "'I bought a new phone.' 我买了新手机",
    rhyme: "new=新的，old=旧的",
  },
  old: {
    homophonic: "偶的！→ 偶(我)的书很旧(OLD)",
    scene: "'This is an old book.' 这是一本旧书",
    rhyme: "old=旧的/老的，young=年轻的",
  },
  big: {
    homophonic: "比格！→ 比(BI)一个格(G)子还大(BIG)",
    scene: "'The elephant is very big.' 大象很大",
    rhyme: "big=大的，small=小的",
  },
  small: {
    homophonic: "死猫！→ 一只小(SMALL)猫",
    scene: "'I have a small dog.' 我有一只小狗",
    rhyme: "small=小的，big=大的，little=小的(更可爱)",
  },
  good: {
    homophonic: "顾的！→ 顾(G)好自己的就是好的(GOOD)",
    scene: "'You did a good job!' 你做得好！",
    rhyme: "good=好的，better=更好的，best=最好的",
  },
  bad: {
    homophonic: "败的！→ 败(BA)了就(D)是坏的(BAD)",
    scene: "'The weather is bad today.' 今天天气不好",
    rhyme: "bad=坏的，worse=更坏的，worst=最坏的",
  },
  happy: {
    homophonic: "嗨皮！→ 嗨皮(HAPPY)就是开心",
    scene: "'I am so happy today!' 我今天好开心！",
    rhyme: "happy=开心的，sad=伤心的，happiness=幸福",
  },
  sad: {
    homophonic: "撒的！→ 撒了一地的泪水，好伤心(SAD)",
    scene: "'She looks sad.' 她看起来很伤心",
    rhyme: "sad=伤心的，happy=开心的",
  },
  love: {
    homophonic: "辣舞！→ 跳一支热辣的舞(LOVE)表达爱",
    scene: "'I love my family.' 我爱我的家人",
    rhyme: "love=爱(动词/名词)，lovely=可爱的",
  },
  water: {
    homophonic: "我特！→ 我特(WATER)别渴，要喝水",
    scene: "'Can I have some water?' 能给我些水吗？",
    rhyme: "water=水(不可数)，a glass of water=一杯水",
  },
  food: {
    homophonic: "富的！→ 食物(FOOD)丰富就是富的",
    scene: "'The food here is delicious.' 这里的食物很好吃",
    rhyme: "food=食物(不可数)，meal=一餐(可数)",
  },
  home: {
    homophonic: "吼姆！→ 回到家(HOME)吼一声'姆妈我回来了'",
    scene: "'I want to go home.' 我想回家",
    rhyme: "home=家(副词/名词)，at home=在家",
  },
  house: {
    homophonic: "好思！→ 好(H)房子(HOUSE)让人思(O)考人生",
    scene: "'There is a house on the hill.' 山上有一栋房子",
    rhyme: "house=房子(建筑)，home=家(感觉/抽象)",
  },
  school: {
    homophonic: "死顾！→ 死(S)盯着课本顾(CH)学业的学校(SCHOOL)",
    scene: "'I go to school every day.' 我每天上学",
    rhyme: "go to school=去上学(不加the)，at school=在学校",
  },
  book: {
    homophonic: "不可！→ 这本(BOOK)书不可(不)读吗？",
    scene: "'I like reading books.' 我喜欢读书",
    rhyme: "book=书，bookstore=书店，bookmark=书签",
  },
  car: {
    homophonic: "卡！→ 开车(CAR)卡住了",
    scene: "'I drive my car to work.' 我开车上班",
    rhyme: "car=小汽车，bus=公交车，train=火车",
  },
  friend: {
    homophonic: "芙润的！→ 芙蓉花一样润泽的朋友(FRIEND)",
    scene: "'She is my best friend.' 她是我最好的朋友",
    rhyme: "friend=朋友，friendship=友谊",
  },
  family: {
    homophonic: "发迷离！→ 家人(FAMILY)发了迷离的眼神",
    splitting: "fa(父) + m(母) + il(我) + y(你) → 父母我和你 = 一家",
    scene: "'I love my family.' 我爱我的家人",
    rhyme: "family = Father And Mother I Love You",
  },
  mother: {
    homophonic: "妈的！→ 妈(MOTHER)的……(口语中)→ 妈妈",
    scene: "'My mother is a teacher.' 我妈妈是老师",
    rhyme: "mother=妈妈，father=爸爸，parents=父母",
  },
  father: {
    homophonic: "法的！→ 父亲(FATHER)是家里的法(法律)",
    scene: "'My father works hard.' 我爸爸工作很努力",
    rhyme: "father=爸爸，dad=爸(口语)，daddy=爹地",
  },
  brother: {
    splitting: "broth(汤) + er(人) → 喝汤的人 = 兄弟",
    scene: "'I have one brother.' 我有一个兄弟",
    rhyme: "brother=兄弟，sister=姐妹",
  },
  sister: {
    homophonic: "四斯特！→ 姐妹(SISTER)四(S)个特别厉害",
    scene: "'My sister is younger than me.' 我妹妹比我小",
    rhyme: "sister=姐妹，brother=兄弟",
  },
  child: {
    homophonic: "拆偶的！→ 小孩(CHILD)拆了偶的东西",
    scene: "'The child is playing.' 那个小孩在玩",
    rhyme: "child=孩子(单数)，children=孩子们(复数，不规则)",
  },
  man: {
    homophonic: "蛮！→ 一个男人(MAN)蛮(M)厉害的",
    scene: "'The man is tall.' 那个男人很高",
    rhyme: "man=男人，men=男人(复数)，woman=女人，women=女人(复数)",
  },
  woman: {
    homophonic: "舞蔓！→ 一个女人(WOMAN)跳舞像藤蔓一样优美",
    scene: "'The woman is my teacher.' 那位女士是我的老师",
    rhyme: "woman/ˈwʊmən/ → women/ˈwɪmɪn/ 复数变音",
  },
  boy: {
    homophonic: "波伊！→ 一个男孩(BOY)在波浪里玩耍",
    scene: "'The boy is running.' 那个男孩在跑",
    rhyme: "boy=男孩，girl=女孩",
  },
  girl: {
    homophonic: "哥偶！→ 女孩(GIRL)的哥哥很疼她",
    scene: "'The girl is reading a book.' 那个女孩在读书",
    rhyme: "girl=女孩，boy=男孩",
  },
  people: {
    homophonic: "批偶扑！→ 一群人(PEOPLE)扑过来",
    scene: "'There are many people here.' 这里有很多人",
    rhyme: "people=人们(本身就是复数)，person=一个人",
  },
  world: {
    homophonic: "沃的！→ 世界(WORLD)是沃(W)尔(ORE)的",
    scene: "'I want to see the world.' 我想看看世界",
    rhyme: "world=世界，earth=地球",
  },
  thing: {
    homophonic: "醒！→ 醒来看到的东西(THING)",
    scene: "'What is this thing?' 这是什么东西？",
    rhyme: "thing=东西/事情，something=某事，nothing=没事",
  },
  way: {
    homophonic: "喂！→ 问路：喂(WAY)，怎么走？",
    scene: "'Which way to the station?' 去车站走哪条路？",
    rhyme: "way=路/方式，on the way=在路上，by the way=顺便说一下",
  },
  much: {
    homophonic: "骂奇！→ 骂了那么多(MUCH)，奇怪",
    scene: "'Thank you very much!' 非常感谢！",
    rhyme: "much+不可数名词，many+可数名词复数",
  },
  some: {
    homophonic: "撒母！→ 撒(SOME)了一些母亲(母)的种子",
    scene: "'Can I have some water?' 能给我些水吗？",
    rhyme: "some 用于肯定句和请求，any 用于疑问句和否定句",
  },
  very: {
    homophonic: "歪瑞！→ 歪(W)了但瑞(V)士人说'非常(VERY)好'",
    scene: "'I am very happy.' 我非常开心",
    rhyme: "very + 形容词/副词：very good, very fast",
  },
  also: {
    homophonic: "奥手！→ 奥(尔)手(ALSO)也来了",
    scene: "'I also like music.' 我也喜欢音乐",
    rhyme: "also=也(放句中)，too=也(放句末)，as well=也(口语)",
  },
  just: {
    homophonic: "扎斯特！→ 刚刚(JUST)扎了一下",
    scene: "'I just arrived.' 我刚到",
    rhyme: "just=刚才/仅仅/正好",
  },
  only: {
    homophonic: "鸥你！→ 只有(ONLY)你(鸥=你的昵称)",
    scene: "'I have only one chance.' 我只有一个机会",
    rhyme: "only=只有/仅仅",
  },
  well: {
    homophonic: "歪哦！→ 井(WELL)歪了",
    scene: "'I am doing well.' 我过得很好",
    rhyme: "well=好地/健康的/井",
  },
  first: {
    homophonic: "佛斯特！→ 佛(F)第一个(FIRST)斯特",
    scene: "'This is my first day.' 这是我第一天",
    rhyme: "first=第一/首先，last=最后",
  },
  last: {
    homophonic: "拉斯特！→ 拉(L)到最后(LAST)了",
    scene: "'I saw her last week.' 我上周见过她",
    rhyme: "last=最后的/上一个，first=第一个",
  },
  now: {
    homophonic: "闹！→ 现在(NOW)很闹",
    scene: "'I am studying now.' 我现在在学习",
    rhyme: "now=现在，then=那时",
  },
  back: {
    homophonic: "拜客！→ 回(BACK)来拜(B)访客人",
    scene: "'Come back soon!' 快回来！",
    rhyme: "back=回来/后面，go back=回去，look back=回头看",
  },
  here: {
    homophonic: "黑尔！→ 黑(H)暗中在这里(HERE)",
    scene: "'Come here!' 过来！",
    rhyme: "here=这里，there=那里",
  },
  there: {
    homophonic: "戴尔！→ 戴尔电脑在那里(THERE)",
    scene: "'There is a book on the table.' 桌上有一本书",
    rhyme: "there is=有(单数)，there are=有(复数)",
  },
  what: {
    homophonic: "我特！→ 我(W)特(T)别想知道'什么(WHAT)'",
    scene: "'What is your name?' 你叫什么名字？",
    rhyme: "What+名词=什么样的，What=什么",
  },
  where: {
    homophonic: "歪尔！→ 歪(W)了，在哪里(WHERE)？",
    scene: "'Where are you from?' 你来自哪里？",
    rhyme: "Where=哪里，When=什么时候，Why=为什么，Who=谁",
  },
  when: {
    homophonic: "稳！→ 什么时候(WHEN)才能稳(W)下来？",
    scene: "'When is your birthday?' 你的生日是什么时候？",
    rhyme: "when=什么时候，where=哪里，why=为什么",
  },
  why: {
    homophonic: "歪！→ 为什么(WHY)歪(W)了？",
    scene: "'Why are you late?' 你为什么迟到了？",
    rhyme: "Why=为什么，Because=因为",
  },
  who: {
    homophonic: "虎！→ 谁(WHO)是老虎(HU=虎)？",
    scene: "'Who is that man?' 那个男人是谁？",
    rhyme: "Who=谁(人)，What=什么(物)",
  },
  how: {
    homophonic: "好！→ 怎么样(HOW)？好(H)！",
    scene: "'How are you?' 你好吗？",
    rhyme: "How=怎样/多么，How old=多大，How much=多少(钱)",
  },
  not: {
    homophonic: "诺特！→ 诺(N)！特(NOT)别不行！",
    scene: "'I do not understand.' 我不明白",
    rhyme: "not=不，放在be动词/助动词后面",
  },
  but: {
    homophonic: "霸特！→ 霸(B)王特(BUT)别厉害",
    scene: "'I want to go, but I am busy.' 我想去，但我很忙",
    rhyme: "but=但是/表转折",
  },
  and: {
    homophonic: "安的！→ 安(AND)全的",
    scene: "'Tom and Jerry are friends.' 汤姆和杰瑞是朋友",
    rhyme: "and=和/并且",
  },
  or: {
    homophonic: "哦！→ 要(OR)这个哦？还是那个？",
    scene: "'Tea or coffee?' 茶还是咖啡？",
    rhyme: "or=或者/否则",
  },
  if: {
    homophonic: "衣夫！→ 如果(IF)衣服(衣夫)湿了",
    scene: "'If it rains, I will stay home.' 如果下雨，我就待在家",
    rhyme: "if=如果(条件句)",
  },
  because: {
    splitting: "be(是) + cause(原因) → 是有原因的 = 因为",
    scene: "'I am happy because it is sunny.' 我很开心因为天晴了",
    rhyme: "Because=因为(回答Why)，So=所以(放句首)",
  },
  about: {
    homophonic: "额抱特！→ 关于(ABOUT)额(我)拥抱特别多",
    scene: "'What is this book about?' 这本书是关于什么的？",
    rhyme: "about=关于/大约",
  },
  after: {
    homophonic: "阿福特！→ 阿(A)姨在(F)特(T)别晚以后(AFTER)才回来",
    scene: "'What do you do after work?' 你下班后做什么？",
    rhyme: "after=在……之后，before=在……之前",
  },
  before: {
    splitting: "be(是) + fore(前面) → 在前面 = 以前/在……之前",
    scene: "'Wash your hands before eating.' 吃饭前洗手",
    rhyme: "before=之前，after=之后",
  },
  another: {
    splitting: "an(一个) + other(另一个) → 另一个",
    scene: "'Can I have another one?' 我能再要一个吗？",
    rhyme: "another=另一个(三者以上)，the other=另一个(两者中)",
  },
  other: {
    homophonic: "阿泽！→ 阿(A)泽(OTHER)是另外一个人",
    scene: "'The other students are gone.' 其他学生走了",
    rhyme: "other=其他的，the other=另一个(两者)，others=其他人",
  },
  same: {
    homophonic: "赛姆！→ 他们赛(SAME)跑，同(SAME)一起起跑",
    scene: "'We are in the same class.' 我们在同一个班",
    rhyme: "the same=相同的，different=不同的",
  },
  enough: {
    splitting: "e(一) + nough(那夫) → 有那么多(那夫)= 足够了",
    scene: "'I have enough money.' 我有足够的钱",
    rhyme: "enough 放形容词后面：good enough 足够好",
  },
  many: {
    homophonic: "麦尼！→ 很多(MANY)麦子，尼(你)收不完",
    scene: "'There are many students in the class.' 班上有很多学生",
    rhyme: "many + 可数名词复数，much + 不可数名词",
  },
  more: {
    homophonic: "摸！→ 想要更多(MORE)就摸一摸",
    scene: "'I want more coffee.' 我想要更多咖啡",
    rhyme: "more=更多，less=更少",
  },
  most: {
    homophonic: "摸斯特！→ 大多数(MOST)都摸(M)到了斯特",
    scene: "'Most people like music.' 大多数人喜欢音乐",
    rhyme: "most=大多数/最多",
  },
  every: {
    splitting: "ever(曾经) + y → 曾经每一次 = 每一个",
    scene: "'I exercise every day.' 我每天锻炼",
    rhyme: "every=每一个(后接单数名词)，each=每一个(可接复数)",
  },
  always: {
    splitting: "all(全部) + ways(方式) → 所有方式都 = 总是",
    scene: "'I always wake up at 7am.' 我总是早上7点起床",
    rhyme: "always=总是，usually=通常，sometimes=有时候，never=从不",
  },
  never: {
    homophonic: "奈佛！→ 奈(N)何佛(NEVER)也帮不了，从不",
    scene: "'I never eat meat.' 我从不吃肉",
    rhyme: "never=从不(放行为动词前，be动词后)",
  },
  usually: {
    splitting: "usual(通常的) + ly(副词后缀) → 通常地",
    scene: "'I usually go to bed at 10pm.' 我通常10点睡",
    rhyme: "usually 比 always 弱一点，比 sometimes 强一点",
  },
  sometimes: {
    splitting: "some(一些) + times(次数) → 有一些次数 = 有时候",
    scene: "'I sometimes eat out.' 我有时候在外面吃",
    rhyme: "sometimes 位置灵活：句首/句中/句末都可以",
  },
  would: {
    homophonic: "伍的！→ 伍(WOULD)先生想要一杯咖啡",
    scene: "'I would like some tea, please.' 我想要些茶",
    rhyme: "would like = 想要(比want更礼貌)",
  },
  could: {
    splitting: "can 的过去式，但更礼貌",
    scene: "'Could you help me?' 你能帮我吗？(礼貌请求)",
    rhyme: "could = can 的委婉形式，用于礼貌请求",
  },
  should: {
    splitting: "shall 的过去式 → 应该",
    scene: "'You should exercise more.' 你应该多运动",
    rhyme: "should = 应该(建议/义务)",
  },
  will: {
    homophonic: "威偶！→ 威(W)力(I)够(L)了(L)就会(WILL)成功",
    scene: "'I will help you.' 我会帮你的",
    rhyme: "will = 将来时标志，won't = will not = 不会",
  },
  than: {
    homophonic: "赞！→ 比(THAN)一下，赞！",
    scene: "'She is taller than me.' 她比我高",
    rhyme: "than = 比(比较级标志)，然后=then",
  },
  then: {
    homophonic: "赞！→ 然后(THEN)就赞了",
    scene: "'First study, then play.' 先学习，然后玩",
    rhyme: "then = 然后/那时，than = 比",
  },
  being: {
    homophonic: "逼应！→ 被逼(BEING)应该的",
    scene: "'I am being careful.' 我正在小心(进行时态)",
    rhyme: "be动词 + being = 正在(强调暂时性)",
  },
  its: {
    homophonic: "一茨！→ 它的(ITS)第一次",
    scene: "'The cat licked its paw.' 猫舔了它的爪子",
    rhyme: "its=它的(所有格)，it's=it is 的缩写",
  },
  those: {
    homophonic: "奏兹！→ 那些(THOSE)奏(音乐)兹(滋)滋的",
    scene: "'Those books are mine.' 那些书是我的",
    rhyme: "those=那些(远指复数)，these=这些(近指复数)",
  },
  these: {
    homophonic: "地兹！→ 这些(WESE)地(方)兹(滋)滋的",
    scene: "'These are my friends.' 这些是我的朋友",
    rhyme: "these=这些(近)，those=那些(远)",
  },
  their: {
    homophonic: "戴尔！→ 他们的(THEIR)电脑是戴尔的",
    scene: "'Their house is big.' 他们的房子很大",
    rhyme: "their=他们的，there=那里，they're=they are",
  },
  them: {
    homophonic: "赞姆！→ 把它们(THEM)赞一下",
    scene: "'Give it to them.' 把它给他们",
    rhyme: "them=他们(宾格)，they=他们(主格)",
  },
  still: {
    homophonic: "死蒂偶！→ 死(ST)了还蒂(L)着，仍然(STILL)在",
    scene: "'Are you still working?' 你还在工作？",
    rhyme: "still = 仍然(放行为动词前，be动词后)",
  },
  already: {
    splitting: "all(全部) + ready(准备好的) → 全部准备好了 = 已经",
    scene: "'I have already finished.' 我已经完成了",
    rhyme: "already 用于肯定句，yet 用于疑问/否定句",
  },
  yet: {
    homophonic: " yet！→ 还(YET)没(yet)？",
    scene: "'Have you finished yet?' 你完成了吗？",
    rhyme: "yet = 还/已经(疑问/否定句)，already = 已经(肯定句)",
  },
  even: {
    homophonic: "伊纹！→ 伊(E)人纹(EVEN)丝不动",
    scene: "'Even a child can do it.' 甚至小孩都能做",
    rhyme: "even = 甚至(加强语气)",
  },
  again: {
    splitting: "a(一) + gain(获得) → 再获得一次 = 再次",
    scene: "'Try again!' 再试一次！",
    rhyme: "again = 再次/又",
  },
  may: {
    homophonic: "美！→ 可能(MAY)很美",
    scene: "'May I come in?' 我能进来吗？(礼貌请求)",
    rhyme: "may = 可能/可以(礼貌)，might = may的过去式/更不确定",
  },
  must: {
    homophonic: "马斯特！→ 必须(MUST)骑马(M)斯特",
    scene: "'You must study hard.' 你必须努力学习",
    rhyme: "must = 必须(义务)，have to = 不得不(外部要求)",
  },
};

// ============================================================
// A2 基础级（150 词）
// ============================================================

export const A2_MEMORY: Record<string, MemoryEntry> = {
  // --- 日常生活 ---
  breakfast: {
    splitting: "break(打破) + fast(禁食) → 打破一夜的禁食 = 早餐",
    scene: "'What do you eat for breakfast?' 你早餐吃什么？",
    rhyme: "breakfast=早餐，lunch=午餐，dinner=晚餐",
  },
  lunch: {
    homophonic: "狼吃！→ 中午(LUNCH)狼吞虎咽地吃",
    scene: "'Let's have lunch together.' 我们一起吃午饭吧",
    rhyme: "lunch=午餐(可数)，have lunch=吃午饭",
  },
  dinner: {
    homophonic: "弟呢！→ 弟(DINNER)弟呢？在吃晚饭",
    scene: "'Dinner is ready!' 晚饭好了！",
    rhyme: "dinner=正餐(通常指晚餐)",
  },
  restaurant: {
    splitting: "rest(休息) + au(法语'在') + rant(说) → 在吃饭时休息说话的地方 = 餐厅",
    homophonic: "瑞斯特若盎特！→ 在RESTAURANT休息吃饭",
    scene: "'Let's go to a restaurant.' 我们去餐厅吧",
    rhyme: "restaurant=餐厅，cafe=咖啡馆",
  },
  coffee: {
    homophonic: "靠飞！→ 喝了咖啡(COFFEE)靠(C)飞起来了",
    scene: "'I drink coffee every morning.' 我每天早上喝咖啡",
    rhyme: "coffee=咖啡(不可数)，a cup of coffee=一杯咖啡",
  },
  chicken: {
    homophonic: "鸡啃！→ 鸡(CHICKEN)被啃了",
    scene: "'I like fried chicken.' 我喜欢炸鸡",
    rhyme: "chicken=鸡/鸡肉，cock=公鸡(英式)",
  },
  bread: {
    homophonic: "不赖的！→ 面包(BREAD)不赖的",
    scene: "'I eat bread for breakfast.' 我早餐吃面包",
    rhyme: "bread=面包(不可数)，a piece of bread=一片面包",
  },
  apple: {
    homophonic: "爱泡！→ 苹果(APPLE)爱(A)泡(P)在水里洗",
    splitting: "a(一个) + pp + le → 一个苹果",
    scene: "'An apple a day keeps the doctor away.' 一天一个苹果，医生远离我",
    rhyme: "apple=苹果，pineapple=菠萝，apple juice=苹果汁",
  },
  banana: {
    homophonic: "拔呐呐！→ 从树上拔(BANANA)下一个呐呐(香蕉)",
    scene: "'I bought some bananas.' 我买了一些香蕉",
    rhyme: "banana=香蕉(可数)，a bunch of bananas=一把香蕉",
  },
  vegetable: {
    splitting: "veget(活力) + able(能) → 能给活力的 = 蔬菜",
    homophonic: "歪接特薄！→ 蔬菜(VEGETABLE)歪歪地接着薄薄的",
    scene: "'Eat more vegetables.' 多吃蔬菜",
    rhyme: "vegetable=蔬菜(可数)，复数加s",
  },
  sugar: {
    homophonic: "输格！→ 输(SUGAR)了格局因为糖吃太多",
    scene: "'Do you take sugar in your tea?' 你茶里加糖吗？",
    rhyme: "sugar=糖(不可数)，a spoon of sugar=一勺糖",
  },
  tea: {
    homophonic: "提议！→ 提议(TEA)喝杯茶",
    scene: "'Would you like some tea?' 你想喝茶吗？",
    rhyme: "tea=茶，green tea=绿茶，black tea=红茶",
  },
  meat: {
    homophonic: "密特！→ 肉(MEAT)特别密(M)实",
    scene: "'I don't eat meat.' 我不吃肉",
    rhyme: "meat=肉(不可数)，beef=牛肉，pork=猪肉，chicken=鸡肉",
  },
  cheese: {
    homophonic: "起子！→ 奶酪(CHEESE)就像起(C)子(芝士的音译)",
    scene: "'I love cheese pizza.' 我喜欢芝士披萨",
    rhyme: "cheese=奶酪(不可数)",
  },
  noodle: {
    homophonic: "怒都！→ 饿得发怒(NU)，面条(NOODLE)都(LE)来了",
    scene: "'I want to eat noodles.' 我想吃面条",
    rhyme: "noodle=面条(常用复数 noodles)",
  },
  rice: {
    homophonic: "入爱死！→ 入(R)口就爱(RICE)上了米饭",
    scene: "'We eat rice every day.' 我们每天吃米饭",
    rhyme: "rice=米饭(不可数)，a bowl of rice=一碗饭",
  },
  // --- 交通/出行 ---
  airport: {
    splitting: "air(空气/航空) + port(港口) → 航空港 = 机场",
    scene: "'We need to go to the airport.' 我们需要去机场",
    rhyme: "airport=机场，seaport=海港",
  },
  train: {
    homophonic: "吹恩！→ 火车(TRAIN)吹(TR)过来了",
    scene: "'The train arrives at 3pm.' 火车下午3点到",
    rhyme: "train=火车，by train=乘火车",
  },
  ticket: {
    homophonic: "提克特！→ 提(T)了提客(TICKET)的特(T)别入场券",
    scene: "'I need a ticket to Beijing.' 我需要一张去北京的票",
    rhyme: "ticket=票，a train ticket=火车票",
  },
  street: {
    splitting: "s(街) + tre(树) + et → 种了树的路 = 街道",
    scene: "'I live on this street.' 我住在这条街上",
    rhyme: "street=街道，road=公路，avenue=大道",
  },
  road: {
    homophonic: "肉的！→ 路(ROAD)面上肉(R)的痕迹",
    scene: "'Be careful on the road.' 路上小心",
    rhyme: "road=道路(较宽)，street=街道(城市内)",
  },
  left: {
    homophonic: "来福的！→ 来(L)了福(LEFT)气在左边",
    scene: "'Turn left at the corner.' 在拐角处左转",
    rhyme: "left=左边，right=右边",
  },
  right: {
    homophonic: "入爱特！→ 权利(RIGHT)入(R)了爱(I)的特(T)别通道",
    scene: "'Turn right here.' 在这里右转",
    rhyme: "right=右边/正确的/权利",
  },
  near: {
    homophonic: "尼尔！→ 就在NEAR(附近)尼尔家旁边",
    scene: "'The school is near my house.' 学校在我家附近",
    rhyme: "near=近的，far=远的",
  },
  // --- 购物 ---
  shop: {
    homophonic: "少扑！→ 商店(SHOP)老板少(S)扑(空)",
    scene: "'Let's go shopping!' 我们去购物吧",
    rhyme: "shop=商店(英式)，store=商店(美式)",
  },
  money: {
    homophonic: "蚂蚁！→ 钱(MONEY)像蚂蚁一样多",
    scene: "'I don't have enough money.' 我没有足够的钱",
    rhyme: "money=钱(不可数)，a lot of money=很多钱",
  },
  cheap: {
    homophonic: "七扑！→ 只要七(-chea-)扑(P)通就便宜(CHEAP)",
    scene: "'This bag is very cheap.' 这个包很便宜",
    rhyme: "cheap=便宜的，expensive=贵的",
  },
  expensive: {
    splitting: "ex(出) + pens(花费) + ive → 花出去很多 = 贵的",
    homophonic: "一克斯潘西乌！→ 太贵(EXPENSIVE)了，一克(C)钱都花出去了",
    scene: "'The phone is too expensive.' 这手机太贵了",
    rhyme: "expensive=贵的，cheap=便宜的",
  },
  price: {
    homophonic: "扑入爱刺！→ 价格(PRICE)像刺一样让人犹豫",
    scene: "'What is the price?' 多少钱？",
    rhyme: "price=价格(高低)，prize=奖品",
  },
  size: {
    homophonic: "赛子！→ 赛(SIZE)选合适尺码的衣服",
    scene: "'What size do you wear?' 你穿多大码？",
    rhyme: "size=尺码，small/medium/large size=小/中/大号",
  },
  // --- 情感/状态 ---
  afraid: {
    splitting: "a(一) + fraid(fraid→fright怕) → 害怕",
    homophonic: "额芙瑞的！→ 害怕(AFRAID)地颤抖",
    scene: "'I am afraid of dogs.' 我怕狗",
    rhyme: "be afraid of=害怕，be afraid to=不敢做",
  },
  angry: {
    homophonic: "安格瑞！→ 安(ANG)慰一下格(G)瑞(RY)，他很生气",
    scene: "'My mother is angry with me.' 我妈妈生我的气",
    rhyme: "angry=生气的，be angry with sb=生某人的气",
  },
  tired: {
    homophonic: "太儿的！→ 太(TIRE)累了，儿(ER)都不想动",
    scene: "'I am so tired.' 我好累",
    rhyme: "tired=累的(人感受)，tiring=累人的(事物特征)",
  },
  busy: {
    homophonic: "必是！→ 忙(BUSY)的时候必(B)然是这样的",
    scene: "'I am busy today.' 我今天很忙",
    rhyme: "busy=忙的，be busy with sth=忙于某事",
  },
  free: {
    homophonic: "芙瑞！→ 自由(FREE)的芙蓉花",
    scene: "'Are you free tomorrow?' 你明天有空吗？",
    rhyme: "free=自由的/免费的/空闲的",
  },
  ready: {
    homophonic: "瑞迪！→ 瑞(R)士人准备(READY)好了",
    scene: "'Are you ready?' 你准备好了吗？",
    rhyme: "be ready for=为……准备好，get ready=准备",
  },
  // --- 建筑/地点 ---
  hospital: {
    splitting: "host(主人) + i + pal(伙伴) → 主人照顾病人的地方 = 医院",
    homophonic: "哈斯提泡！→ 医院(HOSPITAL)里哈哈(H)地死(S)了TI(提)泡",
    scene: "'He is in the hospital.' 他住院了",
    rhyme: "hospital=医院，go to the hospital=去医院",
  },
  library: {
    splitting: "libr(书) + ary(地方) → 放书的地方 = 图书馆",
    homophonic: "来不瑞！→ 图书馆(LIBRARY)来(LI)不来(B)瑞(B)士？",
    scene: "'I study in the library.' 我在图书馆学习",
    rhyme: "library=图书馆，注意读 /ˈlaɪbreri/",
  },
  office: {
    splitting: "off(离开) + ice(冰) → 离开冰天雪地的地方 = 办公室",
    homophonic: "奥飞斯！→ 奥(O)运冠军飞(F)到了办公室(OFICE)",
    scene: "'I work in an office.' 我在办公室工作",
    rhyme: "office=办公室，officer=军官/官员",
  },
  // --- 自然 ---
  weather: {
    splitting: "weath(=weave编织) + er → 编织出来的天空状况 = 天气",
    homophonic: "歪泽！→ 天气(WEATHER)歪(W)了，泽(E)国一样",
    scene: "'What's the weather like?' 天气怎么样？",
    rhyme: "weather=天气(不可数)，whether=是否",
  },
  rain: {
    homophonic: "润！→ 下雨(RAIN)大地润(R)了",
    scene: "'It is raining now.' 现在正在下雨",
    rhyme: "rain=雨/下雨，rainy=多雨的，heavy rain=大雨",
  },
  snow: {
    homophonic: "丝诺！→ 雪(SNOW)像丝(S)一样落下，诺(NO)么白",
    scene: "'It snows in winter.' 冬天会下雪",
    rhyme: "snow=雪/下雪，snowy=多雪的",
  },
  wind: {
    homophonic: "温的！→ 风(WIND)是温暖的",
    scene: "'The wind is strong today.' 今天风很大",
    rhyme: "wind=风/wɪnd/，wind=缠绕/waɪnd/(注意发音不同)",
  },
  // --- 其他高频A2 ---
  always: {
    splitting: "all(全部) + ways(方式) → 每一种方式都 = 总是",
    scene: "'She always smiles.' 她总是微笑",
    rhyme: "always > usually > often > sometimes > rarely > never",
  },
  country: {
    homophonic: "坎垂！→ 乡下(COUNTRY)的坎(C)坷和垂(C)柳",
    scene: "'I love the countryside.' 我喜欢乡村",
    rhyme: "country=国家/乡村，countryside=乡下",
  },
  city: {
    homophonic: "希提！→ 城市(CITY)希望(CI)提(TY)升发展",
    scene: "'I live in a big city.' 我住在一个大城市",
    rhyme: "city=城市，town=城镇，village=村庄",
  },
  idea: {
    homophonic: "爱地啊！→ 有了好主意(IDEA)，爱(A)在地上(I)画(D)了啊(EA)",
    scene: "'That's a great idea!' 好主意！",
    rhyme: "idea=主意/想法，have an idea=有个主意",
  },
  problem: {
    splitting: "pro(向前) + blem(=blemish瑕疵) → 前面有瑕疵 = 问题",
    homophonic: "破不连！→ 问题(PROBLEM)破(P)了，不(B)连(LE)贯了",
    scene: "'No problem!' 没问题！",
    rhyme: "problem=问题(较严重)，question=问题(要回答的)",
  },
  question: {
    splitting: "quest(寻找) + ion(名词后缀) → 寻找答案的东西 = 问题",
    scene: "'May I ask a question?' 我能问个问题吗？",
    rhyme: "question=问题(需回答)，problem=难题",
  },
  important: {
    splitting: "im(进入) + port(港口) + ant → 进入港口的 = 重要的",
    homophonic: "因泡疼！→ 重要的(IMPORTANT)事因(Y)为泡(P)疼(T)了",
    scene: "'This is very important.' 这非常重要",
    rhyme: "important=重要的，unimportant=不重要的",
  },
  different: {
    splitting: "dif(=dis分开) + fer(带来) + ent → 带来分开的东西 = 不同的",
    homophonic: "地粉特！→ 不同的(DIFFERENT)地(DI)方粉(F)了特(F)别",
    scene: "'We are different from each other.' 我们彼此不同",
    rhyme: "different=不同的(形容词)，difference=差异(名词)",
  },
  beautiful: {
    splitting: "beauty(美丽) + ful(充满) → 充满美丽的 = 漂亮的",
    homophonic: "比优替否！→ 漂亮的(BEAUTIFUL)比(B)优(Y)质",
    scene: "'What a beautiful day!' 多么美好的一天！",
    rhyme: "beautiful=美丽的(多形容女性/景色)，pretty=漂亮的(更口语)",
  },
  dangerous: {
    splitting: "danger(危险) + ous(形容词后缀) → 有危险的",
    homophonic: "怎觉若斯！→ 危险的(DANGEROUS)怎么(Z)觉(D)得若(R)斯(S)严重",
    scene: "'Don't swim here. It's dangerous.' 别在这游泳，危险",
    rhyme: "dangerous=危险的，safety=安全",
  },
  exercise: {
    splitting: "ex(出) + erc(=arc弧) + ise → 做出弧形动作 = 锻炼",
    homophonic: "埃克瑟赛兹！→ 锻炼(EXERCISE)时埃(E)克(X)特别用力",
    scene: "'I exercise every day.' 我每天锻炼",
    rhyme: "exercise=锻炼/练习(可数)，do exercise=做运动",
  },
  language: {
    splitting: "langu(=lingual舌的) + age → 用舌头说的 = 语言",
    homophonic: "啷瓜橘！→ 语言(LANGUAGE)像啷(L)啷(L)地念瓜(G)橘(U)哇(A)GE",
    scene: "'English is a useful language.' 英语是一门有用的语言",
    rhyme: "language=语言，Chinese=中文，English=英语",
  },
  together: {
    splitting: "to(到) + gether(=gather聚集) → 聚到一起",
    homophonic: "特格泽！→ 一起(TOGETHER)特(T)别格(G)外泽(E)润",
    scene: "'Let's work together.' 我们一起工作吧",
    rhyme: "together=一起，alone=独自",
  },
  something: {
    splitting: "some(一些) + thing(东西) → 某些东西 = 某事",
    scene: "'Something is wrong.' 有些不对劲",
    rhyme: "something=某事，anything=任何事，nothing=没事",
  },
  nothing: {
    splitting: "no(不) + thing(东西) → 没有东西 = 没事",
    scene: "'Nothing is impossible.' 没有什么是不可能的",
    rhyme: "nothing=没什么(肯定形式表否定意思)",
  },
  everything: {
    splitting: "every(每个) + thing(东西) → 每个东西 = 一切",
    scene: "'Everything is fine.' 一切正常",
    rhyme: "everything=一切(用单数动词)",
  },
  someone: {
    splitting: "some(某个) + one(人) → 某人",
    scene: "'Someone is at the door.' 有人在门口",
    rhyme: "someone=某人，anyone=任何人，no one=没有人",
  },
  everyone: {
    splitting: "every(每个) + one(人) → 每个人",
    scene: "'Everyone likes music.' 每个人都喜欢音乐",
    rhyme: "everyone=每个人(用单数动词)",
  },
  outside: {
    splitting: "out(外面) + side(边) → 外面",
    scene: "'Let's play outside.' 我们去外面玩吧",
    rhyme: "outside=外面，inside=里面",
  },
  inside: {
    splitting: "in(里面) + side(边) → 里面",
    scene: "'Come inside, it's cold.' 进来吧，外面冷",
    rhyme: "inside=里面，outside=外面",
  },
  tomorrow: {
    splitting: "to(到) + morrow(早晨) → 到了明天早晨",
    scene: "'See you tomorrow!' 明天见！",
    rhyme: "today=今天，tomorrow=明天，yesterday=昨天",
  },
  already: {
    splitting: "all(全部) + ready(准备好的) → 全部好了 = 已经",
    scene: "'I have already eaten.' 我已经吃过了",
    rhyme: "already=已经(肯定句)，yet=还(疑问/否定句)",
  },
};

// ============================================================
// B1 中级（100 词）
// ============================================================

export const B1_MEMORY: Record<string, MemoryEntry> = {
  experience: {
    splitting: "ex(出) + peri(尝试) + ence → 尝试过的事 = 经验",
    homophonic: "一克斯皮儿人刺！→ 经验(EXPERIENCE)是试出来的",
    scene: "'I have a lot of work experience.' 我有很多工作经验",
    rhyme: "experience=经验(不可数)/经历(可数)",
  },
  important: {
    splitting: "im(进入) + port(港口) + ant → 进入核心港口的 = 重要的",
    scene: "'Education is very important.' 教育非常重要",
    rhyme: "important → importance(名词) → importantly(副词)",
  },
  opportunity: {
    splitting: "op(朝向) + port(港口) + unity → 朝着港口的方向 = 机会",
    homophonic: "阿破抽内替！→ 机会(OPPORTUNITY)像阿(A)姨破(P)例抽(P)了你",
    scene: "'This is a great opportunity.' 这是个好机会",
    rhyme: "opportunity=机会(可数)，chance=机会(更通用)",
  },
  environment: {
    splitting: "environ(围绕) + ment(名词后缀) → 围绕我们的 = 环境",
    homophonic: "印歪若门特！→ 环境(ENVIRONMENT)印(E)在了歪(W)的门(I)特(T)上",
    scene: "'We must protect the environment.' 我们必须保护环境",
    rhyme: "environment=环境(不可数)",
  },
  necessary: {
    homophonic: "内瑟色瑞！→ 必要的(NECESSARY)内容(N)必须(C)有",
    scene: "'Sleep is necessary for health.' 睡眠对健康是必要的",
    rhyme: "necessary=必要的，unnecessary=不必要的",
  },
  different: {
    splitting: "dif(分开) + fer(带来) + ent → 带来区分的 = 不同的",
    scene: "'People are different from each other.' 人与人是不同的",
    rhyme: "different(形容词) → difference(名词) → differently(副词)",
  },
  develop: {
    splitting: "de(向下) + velop(包裹) → 打开包裹 = 发展",
    homophonic: "迪维勒普！→ 发展(DEVELOP)了迪(D)士尼维(E)尼(V)乐(OP)园",
    scene: "'China is developing fast.' 中国发展很快",
    rhyme: "develop=发展，development=发展(名词)，developer=开发者",
  },
  information: {
    splitting: "in(进入) + form(形状) + ation → 塑造成形的东西 = 信息",
    homophonic: "因佛没审！→ 信息(INFORMATION)因(Y)为佛(F)没(M)审(O)核",
    scene: "'I need more information.' 我需要更多信息",
    rhyme: "information=信息(不可数)，a piece of information=一条信息",
  },
  communication: {
    splitting: "com(共同) + muni(交流) + cation → 共同交流 = 沟通",
    homophonic: "卡缪尼凯审！→ 沟通(COMMUNICATION)卡(C)了，缪(MU)斯尼(NI)开(K)了审(ATION)",
    scene: "'Good communication is important.' 良好的沟通很重要",
    rhyme: "communication=沟通(名词)，communicate=沟通(动词)",
  },
  technology: {
    splitting: "techno(技术) + logy(学科) → 技术学科 = 科技",
    homophonic: "泰克诺楼基！→ 科技(TECHNOLOGY)泰(T)酷了",
    scene: "'Technology changes our lives.' 科技改变我们的生活",
    rhyme: "technology=科技(不可数)，technological=科技的(形容词)",
  },
  education: {
    splitting: "educ(引导) + ation → 引导人成长 = 教育",
    homophonic: "诶丢凯审！→ 教育(EDUCATION)是诶(E)个人的丢(DU)脸凯(C)审(ATION)",
    scene: "'Education is the key to success.' 教育是成功的关键",
    rhyme: "education=教育，educate=教育(动词)，educator=教育者",
  },
  government: {
    splitting: "govern(统治) + ment(名词后缀) → 统治的机构 = 政府",
    homophonic: "嘎吻门特！→ 政府(GOVERNMENT)嘎(G)地吻(V)了门特",
    scene: "'The government made a new law.' 政府制定了新法律",
    rhyme: "government=政府(可数，集合名词用单数动词)",
  },
  difference: {
    splitting: "dif(分开) + fer(带来) + ence → 带来区分的东西 = 差异",
    scene: "'What's the difference?' 有什么区别？",
    rhyme: "difference=差异(名词)，different=不同的(形容词)",
  },
  possible: {
    splitting: "pos(放置) + sible(能) → 能放置的 = 可能的",
    homophonic: "跑瑟薄！→ 可能的(POSSIBLE)跑(P)了瑟(SE)发薄(B)了一层",
    scene: "'Anything is possible.' 一切皆有可能",
    rhyme: "possible=可能的，impossible=不可能的",
  },
  comfortable: {
    splitting: "comfort(舒适) + able(能) → 能感到舒适的",
    homophonic: "卡姆福特薄！→ 舒适的(COMFORTABLE)像卡(K)在姆(M)妈的福(F)特(T)车里",
    scene: "'This chair is very comfortable.' 这把椅子很舒服",
    rhyme: "comfortable /ˈkʌmftəbl/ 注意不读 com-for-ta-ble",
  },
  beautiful: {
    splitting: "beauty(美丽) + ful(充满) → 充满美丽的 = 漂亮的",
    scene: "'The sunset is beautiful.' 日落很美",
    rhyme: "beautiful 常形容女性/景色/事物，gorgeous 更强烈",
  },
  interesting: {
    splitting: "inter(在中间) + est(最) + ing → 最吸引人在中间的 = 有趣的",
    homophonic: "因特瑞斯听！→ 有趣的(INTERESTING)故事因(Y)为特(T)别瑞(R)好听",
    scene: "'This book is very interesting.' 这本书很有趣",
    rhyme: "interesting=有趣的(事物)，interested=感兴趣的(人)",
  },
  surprised: {
    splitting: "sur(在上) + pris(抓住) + ed → 被抓住了 = 惊讶的",
    homophonic: "瑟普艾斯的！→ 惊讶的(SURPRISED)像瑟(SE)发被艾斯(A)拿走了",
    scene: "'I was surprised by the news.' 我被这个消息惊到了",
    rhyme: "surprised=惊讶的(人)，surprising=令人惊讶的(事)",
  },
  suggestion: {
    splitting: "sug(在下) + gest(带来) + ion → 从下面带来的想法 = 建议",
    scene: "'Do you have any suggestions?' 你有什么建议吗？",
    rhyme: "suggestion=建议(可数)，advice=建议(不可数)",
  },
  decision: {
    splitting: "de(离开) + cis(切) + ion → 切断犹豫 = 决定",
    homophonic: "迪森！→ 做决定(DECISION)迪(D)斯(SE)尼的森(SCION)",
    scene: "'I made a decision to study abroad.' 我决定出国留学",
    rhyme: "decision=决定(名词)，decide=决定(动词)",
  },
  solution: {
    splitting: "solu(松开) + tion → 松开问题 = 解决方案",
    homophonic: "瑟路审！→ 解决方案(SOLUTION)瑟(S)住了路(LU)要审(ATION)",
    scene: "'We need a solution.' 我们需要一个解决方案",
    rhyme: "solution=解决方案，solve=解决(动词)",
  },
  conversation: {
    splitting: "con(共同) + vers(转) + ation → 共同转换话题 = 对话",
    homophonic: "康沃凯审！→ 对话(CONVERSATION)康(C)哥沃(V)尔(E)斯(R)开(K)了审(ATION)",
    scene: "'We had a long conversation.' 我们进行了一次长谈",
    rhyme: "conversation=对话(可数)，talk=谈话",
  },
  condition: {
    splitting: "con(共同) + dit(给予) + ion → 共同给予的基础 = 条件",
    homophonic: "肯迪审！→ 条件(CONDITION)肯(KEN)定迪(DI)斯(S)审(ATION)查",
    scene: "'Under what condition?' 在什么条件下？",
    rhyme: "condition=条件/状况(可数)",
  },
  tradition: {
    splitting: "tra(横穿) + dit(给予) + ion → 代代传递的 = 传统",
    homophonic: "踹迪审！→ 传统(TRADITION)踹(TR)了迪(DI)斯(S)的审(ATION)",
    scene: "'Chinese traditions are important.' 中国传统很重要",
    rhyme: "tradition=传统(名词)，traditional=传统的(形容词)",
  },
  imagination: {
    splitting: "im(进入) + agin(=image形象) + ation → 进入形象世界 = 想象力",
    homophonic: "伊美吉内审！→ 想象力(IMAGINATION)是伊(I)人美(M)丽的(A)吉(G)祥物",
    scene: "'Use your imagination!' 用你的想象力！",
    rhyme: "imagination=想象力(名词)，imagine=想象(动词)，imaginary=虚构的",
  },
  beginning: {
    splitting: "begin(开始) + ning → 开始的状态 = 开端",
    homophonic: "比格林！→ 开始(BEGINNING)比(B)赛在格林威治开始",
    scene: "'The beginning of a new year.' 新年的开始",
    rhyme: "at the beginning=在开始，begin=开始(动词)",
  },
  achieve: {
    splitting: "a(一) + chieve(=chief首脑) → 成为首脑 = 达到/实现",
    homophonic: "额七屋！→ 实现(ACHIEVE)了额(A)的七(CHI)个屋(EVE)",
    scene: "'You can achieve your dreams.' 你能实现你的梦想",
    rhyme: "achieve=达到/实现，achievement=成就",
  },
  encourage: {
    splitting: "en(使) + courage(勇气) → 给予勇气 = 鼓励",
    homophonic: "因卡瑞橘！→ 鼓励(ENCOURAGE)因(Y)为有卡(K)路(A)瑞(R)橘(G)子的勇气",
    scene: "'My teacher encouraged me.' 我的老师鼓励了我",
    rhyme: "encourage=鼓励，discourage=使气馁",
  },
  knowledge: {
    splitting: "know(知道) + ledge(=ledge壁架) → 架子上的知道 = 知识",
    homophonic: "脑力之！→ 知识(KNOWLEDGE)是脑(N)子里智力(K)之(Z)力",
    scene: "'Knowledge is power.' 知识就是力量",
    rhyme: "knowledge=知识(不可数)",
  },
  confident: {
    splitting: "con(共同) + fid(信任) + ent → 共同信任自己的 = 自信的",
    homophonic: "康飞等特！→ 自信的(CONFIDENT)康(C)哥飞(F)了等特",
    scene: "'Be confident in yourself.' 对自己有信心",
    rhyme: "confident=自信的，confidence=信心(名词)",
  },
  independent: {
    splitting: "in(不) + de(向下) + pend(悬挂) + ent → 不依赖他人的 = 独立的",
    homophonic: "因迪潘等特！→ 独立的(INDEPENDENT)因(Y)为你迪(D)斯潘(P)了等特",
    scene: "'She is an independent woman.' 她是一个独立的女性",
    rhyme: "independent=独立的，independence=独立(名词)",
  },
  responsible: {
    splitting: "re(回应) + spons(承诺) + ible(能) → 能做出承诺的 = 负责的",
    homophonic: "瑞斯盘色薄！→ 负责的(RESPONSIBLE)瑞(R)士人盘(P)了色(S)薄(B)子",
    scene: "'Who is responsible for this?' 谁负责这个？",
    rhyme: "responsible=负责的，responsibility=责任",
  },
};

// ============================================================
// B2 中高级（50 词）
// ============================================================

export const B2_MEMORY: Record<string, MemoryEntry> = {
 analyze: {
    splitting: "ana(向上) + lyze(松开) → 向上拆开分析 = 分析",
    scene: "'We need to analyze the data.' 我们需要分析数据",
    rhyme: "analyze=分析(美式)，analyse=分析(英式)",
  },
  controversy: {
    splitting: "contra(反对) + vers(转) + y → 反着转 = 争议",
    homophonic: "康特若未西！→ 争议(CONTROVERSY)康(K)了特(T)别",
    scene: "'This topic is very controversial.' 这个话题很有争议",
    rhyme: "controversy=争议(名词)，controversial=有争议的(形容词)",
  },
  significant: {
    splitting: "sign(标记) + ific + ant → 有标记的 = 重要的/显著的",
    homophonic: "思格尼飞肯特！→ 显著的(SIGNIFICANT)思(S)想格(G)外尼(N)非(F)常肯(K)定",
    scene: "'This is a significant discovery.' 这是一个重大发现",
    rhyme: "significant=显著的，significance=重要性",
  },
  deteriorate: {
    splitting: "de(向下) + terior(更差) + ate → 变得更差 = 恶化",
    homophonic: "迪提瑞尔瑞特！→ 恶化(DETERIORATE)迪(D)斯的状况特(T)别差",
    scene: "'The weather is deteriorating.' 天气在恶化",
    rhyme: "deteriorate=恶化(动词)，deterioration=恶化(名词)",
  },
  phenomenon: {
    splitting: "phen(出现) + omen(预兆) + on → 出现的预兆 = 现象",
    homophonic: "费诺米弄！→ 现象(PHENOMENON)费(F)了很(E)多诺(N)米弄",
    scene: "'This is a natural phenomenon.' 这是一个自然现象",
    rhyme: "phenomenon(单数) → phenomena(复数)",
  },
  sophisticated: {
    splitting: "soph(智慧) + isticated → 充满智慧的 = 复杂的/精密的",
    homophonic: "瑟菲斯踢凯提的！→ 精密的(SOPHISTICATED)瑟(S)发斯(S)踢(T)了凯(C)提(T)的",
    scene: "'This is a sophisticated system.' 这是一个精密的系统",
    rhyme: "sophisticated=精密的/世故的，simple=简单的",
  },
  inevitable: {
    splitting: "in(不) + evit(避免) + able(能) → 不能避免的 = 不可避免的",
    homophonic: "伊内歪特薄！→ 不可避免的(INEVITABLE)伊(I)人内(NE)心歪(VI)了特(T)薄(B)了",
    scene: "'Change is inevitable.' 变化是不可避免的",
    rhyme: "inevitable=不可避免的，avoidable=可避免的",
  },
  comprehensive: {
    splitting: "com(一起) + prehens(抓住) + ive → 全部抓住的 = 全面的",
    homophonic: "康普瑞汉西乌！→ 全面的(COMPREHENSIVE)康(C)哥普(P)及(R)了所有",
    scene: "'We need a comprehensive plan.' 我们需要一个全面的计划",
    rhyme: "comprehensive=全面的，comprehension=理解力",
  },
  endeavor: {
    splitting: "en(使) + deavor(=debt债务) → 使自己付出 = 努力",
    homophonic: "因戴沃！→ 努力(ENDEAVOR)因(Y)为戴(D)了沃(V)尔(ORE)的帽子",
    scene: "'We must endeavor to improve.' 我们必须努力改进",
    rhyme: "endeavor=努力/尝试(动词/名词)",
  },
  persistence: {
    splitting: "per(贯穿) + sist(站立) + ence → 一直站着 = 坚持",
    homophonic: "珀西斯坦斯！→ 坚持(PERSISTENCE)珀(P)拉(E)斯(S)一直站(S)着",
    scene: "'Success requires persistence.' 成功需要坚持",
    rhyme: "persistence=坚持(名词)，persistent=坚持不懈的(形容词)",
  },
};

// ============================================================
// 合并所有层级的记忆字典
// ============================================================

import { ALL_MEMORY_EXT } from "./memory-boost-2";

export const ALL_MEMORY: Record<string, MemoryEntry> = {
  ...A1_MEMORY,
  ...A2_MEMORY,
  ...B1_MEMORY,
  ...B2_MEMORY,
  ...ALL_MEMORY_EXT,
};

/**
 * 获取某个词的记忆增强内容
 * 如果有专属记忆，返回具体的；否则返回 null 让生成器用通用方法
 */
export function getMemoryBoost(word: string): MemoryEntry | null {
  const entry = ALL_MEMORY[word.toLowerCase()];
  return entry || null;
}
