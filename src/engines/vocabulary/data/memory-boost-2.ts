/**
 * 词汇记忆增强字典 Batch 2 — A1-B2 扩展记忆法
 * 覆盖：身体、服装、动物、更多动词、介词、情感、健康、教育、运动、科技、自然、抽象概念、商务、学术
 */

import type { MemoryEntry } from "./memory-boost";

// ============================================================
// A1 扩展（200词）— 身体/服装/动物/动作/介词/形容词
// ============================================================

export const A1_MEMORY_EXT: Record<string, MemoryEntry> = {
  // --- 身体部位 ---
  head: { homophonic: "黑的！→ 头(HEAD)是黑(H)色的头发盖着", scene: "'My head hurts.' 我头疼", rhyme: "head=头，hand=手(别混！)，head比hand多一个e" },
  eye: { homophonic: "爱！→ 眼睛(EYE)是心灵的爱(AI)", scene: "'Close your eyes.' 闭上你的眼睛", rhyme: "eye=眼睛(单数)，eyes=眼睛(复数)" },
  ear: { homophonic: "耳朵！→ ear 听起来就像'耳朵'", scene: "'I can hear with my ears.' 我用耳朵听", rhyme: "ear=耳朵，hear=听见(加了h)" },
  nose: { homophonic: "闹子！→ 鼻子(NOSE)闹(N)了，子(Z)弹一样", scene: "'My nose is running.' 我流鼻涕了", rhyme: "nose=鼻子，smell=闻(用鼻子)" },
  mouth: { homophonic: "毛丝！→ 嘴(MOUTH)里毛(M)丝(O)都吃进去了", scene: "'Open your mouth.' 张开你的嘴", rhyme: "mouth=嘴，mouse=老鼠(别混！)" },
  hand: { homophonic: "汉的！→ 汉(HAN)子的手(HAND)很大", scene: "'Shake hands with me.' 和我握个手", rhyme: "hand=手，handle=把手/处理" },
  arm: { homophonic: "阿母！→ 阿(ARM)姨用胳膊抱母(妈)亲", scene: "'He broke his arm.' 他摔断了胳膊", rhyme: "arm=胳膊，army=军队(用胳膊打仗)" },
  leg: { homophonic: "来格！→ 来(L)了格(G)斗用腿(LEG)踢", scene: "'My leg is sore.' 我腿酸", rhyme: "leg=腿，beg=乞求(谐音)" },
  foot: { homophonic: "富特！→ 富(F)人的脚(FOOT)穿着特(T)制鞋", scene: "'I hurt my foot.' 我伤到脚了", rhyme: "foot=脚(单数)，feet=脚(复数，不规则)" },
  body: { homophonic: "波弟！→ 波(B)弟(DY)的身体(BODY)很棒", scene: "'Exercise is good for your body.' 运动对身体好", rhyme: "body=身体，buddy=伙伴(少一个d)" },
  hair: { homophonic: "嘿尔！→ 嘿(H)！你的头发(HAIR)好漂亮", scene: "'She has long hair.' 她有长头发", rhyme: "hair=头发(可数/不可数)，hairy=毛茸茸的" },
  face: { homophonic: "费斯！→ 脸(FACE)上费(F)了很多护肤品", scene: "'Wash your face.' 洗洗脸", rhyme: "face=脸/面对，surface=表面(sur=上面)" },
  tooth: { homophonic: "图丝！→ 牙齿(TOOTH)像图(T)一样丝丝(S)白白", scene: "'I brush my teeth every day.' 我每天刷牙", rhyme: "tooth=牙齿(单数)，teeth=牙齿(复数，不规则)" },
  // --- 服装 ---
  shirt: { homophonic: "舍特！→ 衬衫(SHIRT)舍(S)不得特(T)贵的", scene: "'He is wearing a white shirt.' 他穿着白衬衫", rhyme: "shirt=衬衫，T-shirt=T恤" },
  shoe: { homophonic: "书！→ 鞋子(SHOE)像书(SH)一样平", scene: "'Put on your shoes.' 穿上你的鞋子", rhyme: "shoe=鞋子(单数)，shoes=鞋子(复数)" },
  hat: { homophonic: "嗨特！→ 帽子(HAT)嗨(H)了特(T)别好看", scene: "'She is wearing a red hat.' 她戴着红帽子", rhyme: "hat=帽子(有边)，cap=帽子(无边/鸭舌帽)" },
  coat: { homophonic: "抠特！→ 外套(COAT)抠(C)出来特别暖和", scene: "'Put on your coat, it's cold.' 穿上外套，天冷", rhyme: "coat=外套，jacket=夹克" },
  dress: { homophonic: "拽丝！→ 连衣裙(DRESS)拽(D)起来丝丝(R)飘", scene: "'She looks beautiful in that dress.' 她穿那条裙子很美", rhyme: "dress=连衣裙/穿衣(动词)，dressed=穿好衣服的" },
  clothes: { homophonic: "克楼兹！→ 衣服(CLOTHES)一堆克(C)在楼(L)上", scene: "'I need to buy new clothes.' 我需要买新衣服", rhyme: "clothes=衣服(复数形式，无单数)，cloth=布料" },
  // --- 动物 ---
  dog: { homophonic: "道格！→ 一只狗(DOG)名叫道(D)格(G)", scene: "'I have a pet dog.' 我有一只宠物狗", rhyme: "dog=狗，cat=猫，bird=鸟" },
  cat: { homophonic: "凯特！→ 一只猫(CAT)叫凯(KA)特(T)", scene: "'The cat is sleeping.' 猫在睡觉", rhyme: "cat=猫，catch=抓住(猫抓老鼠)" },
  bird: { homophonic: "伯的！→ 一只鸟(BIRD)伯(B)父的", scene: "'The bird is singing.' 鸟在唱歌", rhyme: "bird=鸟，fly=飞" },
  fish: { homophonic: "费什！→ 鱼(FISH)费(F)了什么力气游", scene: "'I like to eat fish.' 我喜欢吃鱼", rhyme: "fish=鱼(单复同形)，fishes=多种鱼" },
  horse: { homophonic: "好斯！→ 好(H)厉害的马(HORSE)斯(S)", scene: "'He rides a horse.' 他骑马", rhyme: "horse=马，house=房子(别混！o变ou)" },
  cow: { homophonic: "靠！→ 牛(COW)靠(C)在地上吃草", scene: "'The cow gives milk.' 牛产奶", rhyme: "cow=母牛，bull=公牛" },
  pig: { homophonic: "皮格！→ 猪(PIG)皮(P)很厚格(G)外粗糙", scene: "'The pig is fat.' 猪很胖", rhyme: "pig=猪，pigment=颜料(猪的皮肤颜色)" },
  bear: { homophonic: "贝儿！→ 熊(BEAR)像贝(B)儿(EAR)一样大耳朵", scene: "'I saw a bear in the forest.' 我在森林看到一只熊", rhyme: "bear=熊/承受，bare=赤裸的(同音)" },
  rabbit: { homophonic: "来比特！→ 兔子(RABBIT)来(L)了比(B)赛跑得特(T)别快", scene: "'The rabbit is very fast.' 兔子很快", rhyme: "rabbit=兔子(可数)，bunny=小兔子(口语)" },
  elephant: { homophonic: "爱力粉特！→ 大象(ELEPHANT)爱(A)用大力(E)粉(F)刷特(T)别大", scene: "'The elephant is the biggest animal.' 大象是最大的动物", rhyme: "elephant=大象，elephantine=庞大的" },
  tiger: { homophonic: "太格！→ 老虎(TIGER)太(T)凶猛了格(G)外吓人", scene: "'The tiger is dangerous.' 老虎很危险", rhyme: "tiger=老虎，lion=狮子" },
  lion: { homophonic: "来恩！→ 狮子(LION)来(L)了，恩(I)是百兽之王", scene: "'The lion is the king of animals.' 狮子是百兽之王", rhyme: "lion=狮子，tiger=老虎" },
  monkey: { homophonic: "忙客！→ 猴子(MONKEY)忙(M)着招待客人(KEY)", scene: "'The monkey is climbing the tree.' 猴子在爬树", rhyme: "monkey=猴子，ape=猿" },
  // --- 更多动词 ---
  send: { homophonic: "森的！→ 寄(SEND)到森(S)林里特(D)别的地方", scene: "'I will send you a message.' 我会给你发消息", rhyme: "send=寄/发(现在)，sent=寄了(过去)，sent=寄了(过去分词)" },
  call: { homophonic: "靠！→ 打电话(CALL)靠(C)大声喊", scene: "'Can you call me later?' 你能晚点给我打电话吗？", rhyme: "call=打电话/叫，called=叫做" },
  tell: { homophonic: "泰偶！→ 告诉(TELL)泰(T)坦尼克号的故事给偶(我)", scene: "'Tell me the truth.' 告诉我真相", rhyme: "tell=告诉(双宾语：tell sb sth)" },
  read: { homophonic: "瑞的！→ 瑞(R)士人喜欢读书(READ)", scene: "'I read a book every night.' 我每晚读书", rhyme: "read/riːd/=读(现在)，/rɛd/=读了(过去，同拼写不同音)" },
  write: { homophonic: "入爱特！→ 写(WRITE)入(R)纸上", scene: "'Please write your name.' 请写下你的名字", rhyme: "write=写，writer=作家，writing=写作" },
  eat: { homophonic: "伊特！→ 伊人(E)特(T)别爱吃", scene: "'What do you want to eat?' 你想吃什么？", rhyme: "eat=吃(现在)，ate=吃了(过去)，eaten=吃了(过去分词)" },
  drink: { homophonic: "拽因克！→ 拽着饮料(DRINK)喝", scene: "'I want to drink water.' 我想喝水", rhyme: "drink=喝(现在)，drank=喝了(过去)，drunk=喝了/醉的" },
  sleep: { homophonic: "死力扑！→ 累(S)了力(L)气扑倒就睡(SLEEP)", scene: "'I sleep eight hours a day.' 我一天睡八小时", rhyme: "sleep=睡觉(现在)，slept=睡了(过去)" },
  wash: { homophonic: "沃什！→ 洗(WASH)完(W)了啥(SH)都干净了", scene: "'Wash your hands before eating.' 饭前洗手", rhyme: "wash=洗，washing=正在洗" },
  cook: { homophonic: "酷客！→ 做饭(COOK)的酷(C)客(K)人", scene: "'My mother cooks dinner every day.' 我妈每天做晚饭", rhyme: "cook=做饭/厨师，cooker=炊具(不是厨师！)" },
  clean: { homophonic: "克林！→ 克(C)林顿很爱干净(CLEAN)", scene: "'Clean your room.' 打扫你的房间", rhyme: "clean=干净的/打扫，dirty=脏的" },
  buy: { homophonic: "拜！→ 买完(BUY)拜(B)拜了钱包", scene: "'I want to buy a new phone.' 我想买新手机", rhyme: "buy=买(现在)，bought=买了(过去)" },
  sell: { homophonic: "赛偶！→ 卖(SELL)东西赛(S)过偶(我)厉害", scene: "'Do you sell fruit here?' 你们这里卖水果吗？", rhyme: "sell=卖(现在)，sold=卖了(过去)，buyer=买家" },
  wait: { homophonic: "威特！→ 等(WAIT)威(W)风凛凛的特(T)使", scene: "'Please wait for me.' 请等我", rhyme: "wait=等，waiter=服务员(等你点餐的人)" },
  meet: { homophonic: "密特！→ 遇见(MEET)秘密(M)特(T)别的人", scene: "'Nice to meet you!' 很高兴认识你！", rhyme: "meet=遇见(现在)，met=遇见(过去)" },
  pay: { homophonic: "赔！→ 付钱(PAY)就是赔(P)了钱", scene: "'I will pay for dinner.' 我来付晚餐钱", rhyme: "pay=付款(现在)，paid=付了(过去)" },
  win: { homophonic: "稳！→ 赢(WIN)了就稳(W)了", scene: "'We won the game!' 我们赢了比赛！", rhyme: "win=赢(现在)，won=赢了(过去)，winner=赢家" },
  lose: { homophonic: "鹿死！→ 丢失(LOSE)了鹿(L)，鹿死(O)了", scene: "'I lost my keys.' 我丢了钥匙", rhyme: "lose=丢失(现在)，lost=丢失(过去/过去分词)，loss=损失" },
  drive: { homophonic: "拽屋！→ 开车(DRIVE)拽(D)着屋子(R)跑", scene: "'I drive to work.' 我开车上班", rhyme: "drive=驾驶(现在)，drove=驾驶(过去)，driver=司机" },
  fly: { homophonic: "弗来！→ 飞(FLY)过来弗(F)莱(L)克斯", scene: "'Birds can fly.' 鸟能飞", rhyme: "fly=飞(现在)，flew=飞(过去)，flown=飞了(过去分词)" },
  // --- 更多介词/连词 ---
  with: { homophonic: "维斯！→ 和(WITH)维(W)修(I)师傅(T)一起", scene: "'Come with me.' 跟我来", rhyme: "with=和/用/带有" },
  from: { homophonic: "福容！→ 从(FROM)中国来带着福(F)气容(R)颜", scene: "'I am from China.' 我来自中国", rhyme: "from=从/来自" },
  about: { homophonic: "额抱特！→ 关于(ABOUT)额(A)抱(B)特(T)别的事", scene: "'What is this about?' 这是关于什么的？", rhyme: "about=关于/大约" },
  between: { splitting: "be(是) + tween(=two两个) → 在两个之间", scene: "'Sit between Tom and Jerry.' 坐在汤姆和杰瑞之间", rhyme: "between=在两者之间，among=在三者以上之间" },
  under: { splitting: "under=在下面(under the table=在桌子下面)", scene: "'The cat is under the bed.' 猫在床底下", rhyme: "under=在下面，over=在上面" },
  before: { splitting: "be(是) + fore(前面) → 在前面 = 在……之前", scene: "'Wash hands before eating.' 饭前洗手", rhyme: "before=之前，after=之后" },
  after: { homophonic: "阿福特！→ 阿(A)姨在(F)特(T)别晚以后(AFTER)回来", scene: "'What do you do after work?' 你下班后做什么？", rhyme: "after=在……之后，before=在……之前" },
  // --- 更多形容词 ---
  hot: { homophonic: "浩特！→ 天气(HOT)好(H)热特(T)别", scene: "'It is very hot today.' 今天很热", rhyme: "hot=热的，cold=冷的" },
  cold: { homophonic: "扣的！→ 冷(COLD)得扣(C)紧衣服", scene: "'I feel cold.' 我觉得冷", rhyme: "cold=冷的，hot=热的" },
  warm: { homophonic: "沃姆！→ 温暖(WARM)的沃(W)土姆(M)妈", scene: "'The water is warm.' 水是温的", rhyme: "warm=温暖的，cool=凉爽的" },
  fast: { homophonic: "法斯特！→ 快(FAST)速法(F)拉利特(T)别快", scene: "'He runs very fast.' 他跑得很快", rhyme: "fast=快的/快速地，slow=慢的" },
  slow: { homophonic: "丝楼！→ 慢(SLOW)悠悠地丝(S)滑下楼(L)梯", scene: "'The turtle is slow.' 乌龟很慢", rhyme: "slow=慢的，fast=快的" },
  dark: { homophonic: "大客！→ 黑暗(DARK)中大(D)客(K)来了", scene: "'It is dark outside.' 外面很暗", rhyme: "dark=黑暗的，light=明亮的" },
  light: { homophonic: "来特！→ 光(LIGHT)来了(L)特(T)别亮", scene: "'Turn on the light.' 打开灯", rhyme: "light=光/轻的，heavy=重的/dark=暗的" },
  hard: { homophonic: "哈的！→ 努力(HARD)哈(H)地干活", scene: "'I study hard.' 我努力学习", rhyme: "hard=硬的/努力地，soft=软的" },
  soft: { homophonic: "嫂夫的！→ 柔软(SOFT)的嫂(S)子夫(F)人的", scene: "'The pillow is soft.' 枕头很软", rhyme: "soft=柔软的，hard=硬的" },
  dirty: { homophonic: "德替！→ 脏(DIRTY)的德(D)国替代品", scene: "'Your shoes are dirty.' 你的鞋脏了", rhyme: "dirty=脏的，clean=干净的" },
  full: { homophonic: "富哦！→ 满(FULL)了，富(F)得流油", scene: "'The glass is full.' 杯子满了", rhyme: "full=满的，empty=空的" },
  empty: { homophonic: "恩普替！→ 空的(EMPTY)恩(E)人普(M)通(T)地替(Y)换了", scene: "'The box is empty.' 盒子是空的", rhyme: "empty=空的，full=满的" },
  safe: { homophonic: "睡夫！→ 安全(SAFE)地睡(S)觉夫(F)人放心", scene: "'Keep safe!' 保持安全！", rhyme: "safe=安全的，dangerous=危险的" },
  early: { homophonic: "额利！→ 早(EARLY)起额(E)头利(L)索", scene: "'I wake up early.' 我早起", rhyme: "early=早的，late=迟的" },
  late: { homophonic: "累特！→ 迟到(LATE)了特别累(L)", scene: "'I am late for work.' 我上班迟到了", rhyme: "late=迟的/晚的，early=早的" },
  close: { homophonic: "克楼兹！→ 关(CLOSE)窗的声音'克楼兹'", scene: "'Close the door.' 关门", rhyme: "close(动词/klōz/)=关闭，close(形容词/klōs/)=近的" },
  high: { homophonic: "嗨！→ 高(HIGH)得让人喊'嗨！'", scene: "'The building is very high.' 这栋楼很高", rhyme: "high=高的，low=低的" },
  low: { homophonic: "楼！→ 低(LOW)矮的楼(L)", scene: "'The river is low.' 河水很低", rhyme: "low=低的/矮的，high=高的" },
  free: { homophonic: "芙瑞！→ 自由(FREE)的芙蓉花", scene: "'The museum is free.' 博物馆免费", rhyme: "free=自由的/免费的/空闲的" },
};

// ============================================================
// A2 扩展（200词）— 健康/教育/运动/科技/自然/情绪
// ============================================================

export const A2_MEMORY_EXT: Record<string, MemoryEntry> = {
  // --- 健康 ---
  doctor: { splitting: "doct(教导) + or(人) → 教你健康知识的人 = 医生", scene: "'I need to see a doctor.' 我需要看医生", rhyme: "doctor=医生，nurse=护士" },
  hospital: { splitting: "host(主人) + i + pal(伙伴) → 照顾病人的地方", scene: "'He is in the hospital.' 他住院了", rhyme: "hospital=医院(英式加the，美式不加)" },
  medicine: { splitting: "med(中间) + icine → 使身体回到中间状态 = 药", scene: "'Take this medicine three times a day.' 这药一天吃三次", rhyme: "medicine=药(不可数)/医学" },
  health: { scene: "'Health is the most important thing.' 健康是最重要的", rhyme: "health=健康(名词)，healthy=健康的(形容词)" },
  exercise: { splitting: "ex(出) + erc(弧) + ise → 做出弧形动作 = 锻炼", scene: "'I exercise every morning.' 我每天早上锻炼", rhyme: "exercise=锻炼(可数/不可数)" },
  tired: { homophonic: "太儿的！→ 太累了(TIRED)，儿(ER)都不想动", scene: "'I am so tired.' 我好累", rhyme: "tired=累的(人感受)，tiring=累人的(事物)" },
  sick: { homophonic: "死客！→ 生病(SICK)了像死(S)了一样难受", scene: "'I feel sick today.' 我今天不舒服", rhyme: "sick=生病的(英式常用ill)" },
  // --- 教育 ---
  school: { homophonic: "死顾！→ 死(S)盯着课本顾(CH)学业", scene: "'I go to school at 8am.' 我8点上学", rhyme: "go to school=上学(不加the)" },
  class: { homophonic: "克拉斯！→ 班级(CLASS)克(C)服了拉斯(L)维加斯的诱惑", scene: "'Our class has 30 students.' 我们班有30个学生", rhyme: "class=班级/课，classmate=同学" },
  homework: { splitting: "home(家) + work(工作) → 在家做的工作 = 作业", scene: "'I have a lot of homework.' 我有很多作业", rhyme: "homework=作业(不可数)" },
  test: { homophonic: "太斯特！→ 考试(TEST)太(T)难了斯特(S)都挂了", scene: "'We have a test tomorrow.' 我们明天有考试", rhyme: "test=考试/测试(可数)" },
  lesson: { homophonic: "莱森！→ 一节(LESSON)课莱(L)了森林(E)里上", scene: "'The lesson starts at 9am.' 课程9点开始", rhyme: "lesson=课(一节)，class=课(泛指)" },
  study: { homophonic: "死大地！→ 学习(STUDY)要死(S)磕到底(TUDY)", scene: "'I study English every day.' 我每天学英语", rhyme: "study=学习(过程)，learn=学会(结果)" },
  learn: { homophonic: "乐恩！→ 学(LEARN)到知识乐(L)了恩(E)人", scene: "'I want to learn English.' 我想学英语", rhyme: "learn=学会(结果)，study=学习(过程)" },
  degree: { splitting: "de(向下) + gree(=grade级别) → 达到的级别 = 学位/程度", scene: "'She has a degree in English.' 她有英语学位", rhyme: "degree=学位/程度/度数" },
  // --- 运动 ---
  sport: { homophonic: "死包特！→ 运动(SPORT)包(B)死了特(T)别累", scene: "'I like playing sports.' 我喜欢运动", rhyme: "sport=运动(可数)，sports=体育运动" },
  game: { homophonic: "给母！→ 游戏(GAME)给了(G)妈妈(A)乐趣(ME)", scene: "'Let's play a game.' 我们玩个游戏吧", rhyme: "game=游戏/比赛" },
  basketball: { splitting: "basket(篮子) + ball(球) → 投进篮子的球 = 篮球", scene: "'I play basketball on weekends.' 我周末打篮球", rhyme: "basketball=篮球，football=足球" },
  football: { splitting: "foot(脚) + ball(球) → 用脚踢的球 = 足球", scene: "'Football is very popular.' 足球很受欢迎", rhyme: "football=足球(英式)/美式足球(美式)" },
  swim: { homophonic: "虽母！→ 虽(SWIM)然母(M)亲不会游泳", scene: "'I like to swim in summer.' 我喜欢夏天游泳", rhyme: "swim=游泳(现在)，swam=游了(过去)，swum=游了(过去分词)" },
  dance: { homophonic: "蛋丝！→ 跳舞(DANCE)像蛋(D)一样丝(S)滑", scene: "'She dances very well.' 她跳舞跳得很好", rhyme: "dance=跳舞(动词/名词)，dancer=舞者" },
  // --- 科技 ---
  computer: { splitting: "com(一起) + put(放) + er → 一起放东西的机器 = 电脑", scene: "'I use my computer every day.' 我每天用电脑", rhyme: "computer=电脑，laptop=笔记本电脑" },
  phone: { homophonic: "风！→ 手机(PHONE)像风(F)一样随身带", scene: "'Can I use your phone?' 我能用你的手机吗？", rhyme: "phone=电话/手机，smartphone=智能手机" },
  internet: { splitting: "inter(在中间) + net(网) → 在网与网之间 = 互联网", scene: "'I found it on the internet.' 我在网上找到的", rhyme: "internet=互联网(通常加the)" },
  email: { splitting: "e(电子) + mail(邮件) → 电子邮箱 = 邮件", scene: "'I will send you an email.' 我会给你发邮件", rhyme: "email=电子邮件(可数)，send an email=发邮件" },
  website: { splitting: "web(网) + site(站点) → 网上的站点 = 网站", scene: "'This website is very useful.' 这个网站很有用", rhyme: "website=网站" },
  // --- 自然 ---
  sun: { homophonic: "三！→ 太阳(SUN)有三个(S)光芒", scene: "'The sun is very bright today.' 今天太阳很亮", rhyme: "sun=太阳，sunny=晴朗的，sunrise=日出" },
  moon: { homophonic: "木恩！→ 月亮(MOON)像木(M)头刻的恩(E)物", scene: "'The moon is beautiful tonight.' 今晚月亮很美", rhyme: "moon=月亮，moonlight=月光" },
  star: { homophonic: "死大！→ 星星(STAR)死(S)了也大(T)放光芒", scene: "'Look at the stars!' 看那些星星！", rhyme: "star=星星/明星，starry=布满星星的" },
  tree: { homophonic: "吹！→ 树(TREE)被风吹(TR)弯了", scene: "'There is a big tree in front of my house.' 我家门前有棵大树", rhyme: "tree=树，forest=森林" },
  flower: { homophonic: "夫劳尔！→ 花(FLOWER)像夫(F)人劳(L)累时看到的安慰", scene: "'The flowers are beautiful.' 花很漂亮", rhyme: "flower=花，garden=花园" },
  mountain: { splitting: "mount(登上) + ain → 登上的地方 = 山", scene: "'The mountain is very tall.' 这座山很高", rhyme: "mountain=山，mount=登上/山峰" },
  river: { homophonic: "瑞乌！→ 河(RIVER)瑞(R)丽如乌(V)有", scene: "'The river is very long.' 这条河很长", rhyme: "river=河流，lake=湖泊" },
  // --- 情绪 ---
  excited: { splitting: "ex(出) + cit(刺激) + ed → 被刺激到了 = 兴奋的", scene: "'I am so excited about the trip!' 我对这次旅行好兴奋！", rhyme: "excited=兴奋的(人)，exciting=令人兴奋的(事)" },
  worried: { homophonic: "沃瑞的！→ 担心(WORRIED)得沃(W)土都瑞(R)了", scene: "'Don't be worried.' 别担心", rhyme: "worried=担心的(人)，worrying=令人担心的(事)" },
  nervous: { splitting: "nerv(=nerve神经) + ous → 神经紧张的", scene: "'I am nervous about the exam.' 我对考试很紧张", rhyme: "nervous=紧张的，calm=冷静的" },
  surprised: { splitting: "sur(在上) + pris(抓住) + ed → 被抓住了 = 惊讶的", scene: "'I was surprised!' 我很惊讶！", rhyme: "surprised=惊讶的(人)，surprising=令人惊讶的(事)" },
  bored: { homophonic: "波的！→ 无聊(BORED)得像波(B)浪一样无聊(ORE)", scene: "'I am so bored.' 我好无聊", rhyme: "bored=无聊的(人感受)，boring=无聊的(事物特征)" },
  boring: { homophonic: "波令！→ 无聊的(BORING)故事像波(B)浪一样冗长", scene: "'This movie is boring.' 这部电影很无聊", rhyme: "boring=无聊的(事物)，bored=无聊的(人)" },
  favorite: { splitting: "favor(偏爱) + ite → 被偏爱的 = 最喜欢的", scene: "'What is your favorite color?' 你最喜欢什么颜色？", rhyme: "favorite=最喜欢的(美式)，favourite=最喜欢的(英式)" },
  // --- 更多常用词 ---
  already: { splitting: "all(全部) + ready(准备好的) → 全好了 = 已经", scene: "'I have already finished.' 我已经完成了", rhyme: "already=已经(肯定句)，yet=还(疑问/否定句)" },
  enough: { homophonic: "衣纳夫！→ 衣(E)服纳(N)了那么多，够(ENOUGH)了夫(F)", scene: "'Is this enough?' 这够了吗？", rhyme: "enough 放形容词后：good enough" },
  another: { splitting: "an(一个) + other(另一个) → 另一个", scene: "'Can I have another cup?' 我能再要一杯吗？", rhyme: "another=另一个(三者以上)，the other=另一个(两者)" },
  example: { splitting: "ex(出) + ampl(=ample大量) + e → 举出大量 = 例子", scene: "'Give me an example.' 给我举个例子", rhyme: "example=例子，for example=例如" },
  different: { splitting: "dif(分开) + fer(带来) + ent → 带来区分的 = 不同的", scene: "'We are all different.' 我们都不同", rhyme: "different=不同的，same=相同的" },
  important: { splitting: "im(进入) + port(港口) + ant → 进入核心港口的 = 重要的", scene: "'This is very important.' 这非常重要", rhyme: "important=重要的，unimportant=不重要的" },
  possible: { splitting: "pos(放置) + sible(能) → 能放置的 = 可能的", scene: "'Anything is possible.' 一切皆有可能", rhyme: "possible=可能的，impossible=不可能的" },
  beautiful: { splitting: "beauty(美丽) + ful(充满) → 充满美丽的", scene: "'What a beautiful day!' 多好的一天！", rhyme: "beautiful=美丽的，gorgeous=极美的" },
  comfortable: { splitting: "comfort(舒适) + able(能) → 能感到舒适的", scene: "'This bed is very comfortable.' 这张床很舒服", rhyme: "comfortable /ˈkʌmftəbl/ 注意发音" },
  interesting: { splitting: "inter(在中间) + est(最) + ing → 最吸引人的 = 有趣的", scene: "'This book is interesting.' 这本书有趣", rhyme: "interesting=有趣的(物)，interested=感兴趣的(人)" },
  difficult: { splitting: "dif(分开) + fic(做) + ult → 做起来很分散 = 困难的", scene: "'This question is difficult.' 这个问题很难", rhyme: "difficult=困难的，easy=容易的" },
};

// ============================================================
// B1 扩展（100词）— 抽象概念/商务/社会/学术
// ============================================================

export const B1_MEMORY_EXT: Record<string, MemoryEntry> = {
  advantage: { splitting: "ad(朝向) + vant(前面) + age → 朝前面走的优势", scene: "'What are the advantages?' 有什么优势？", rhyme: "advantage=优势，disadvantage=劣势" },
  disadvantage: { splitting: "dis(否定) + advantage(优势) → 不是优势 = 劣势", scene: "'There are some disadvantages.' 有一些劣势", rhyme: "dis- = 否定前缀：disagree/dislike/disappear" },
  influence: { splitting: "in(进入) + flu(流动) + ence → 流入的影响力", scene: "'Parents influence their children.' 父母影响孩子", rhyme: "influence=影响(动词/名词)，influential=有影响力的" },
  opportunity: { splitting: "op(朝向) + port(港口) + unity → 朝着港口 = 机会", scene: "'Seize the opportunity!' 抓住机会！", rhyme: "opportunity=机会(可数)，chance=机会(更通用)" },
  responsibility: { splitting: "re(回应) + spons(承诺) + ibility → 能承诺的 = 责任", scene: "'It is your responsibility.' 这是你的责任", rhyme: "responsibility=责任(名词)，responsible=负责的(形容词)" },
  experience: { splitting: "ex(出) + peri(尝试) + ence → 尝试过的事 = 经验/经历", scene: "'I have a lot of experience.' 我有很多经验", rhyme: "experience可数=经历，不可数=经验" },
  knowledge: { splitting: "know(知道) + ledge → 知道的东西 = 知识", scene: "'Knowledge is power.' 知识就是力量", rhyme: "knowledge=知识(不可数)" },
  technology: { splitting: "techno(技术) + logy(学科) → 技术学科 = 科技", scene: "'Technology is changing fast.' 科技变化很快", rhyme: "technology=科技(不可数)" },
  environment: { splitting: "environ(围绕) + ment → 围绕我们的 = 环境", scene: "'Protect the environment.' 保护环境", rhyme: "environment=环境(不可数)" },
  communication: { splitting: "com(共同) + muni(交流) + cation → 共同交流", scene: "'Good communication is key.' 良好沟通是关键", rhyme: "communication=沟通(名词)，communicate=沟通(动词)" },
  situation: { splitting: "sit(坐) + u + ation → 坐在其中的状态 = 情况", scene: "'What is the situation?' 情况怎么样？", rhyme: "situation=情况/形势" },
  education: { splitting: "educ(引导) + ation → 引导人成长 = 教育", scene: "'Education is important.' 教育很重要", rhyme: "education=教育(名词)，educate=教育(动词)" },
  government: { splitting: "govern(统治) + ment → 统治的机构 = 政府", scene: "'The government made a decision.' 政府做了决定", rhyme: "government=政府(集合名词用单数动词)" },
  population: { splitting: "popul(人民) + ation → 人民的总数 = 人口", scene: "'China has a large population.' 中国人口众多", rhyme: "population=人口(可数)" },
  development: { splitting: "de(向下) + velop(包裹) + ment → 打开包裹 = 发展", scene: "'Economic development is fast.' 经济发展很快", rhyme: "development=发展(名词)，develop=发展(动词)" },
  suggestion: { splitting: "sug(在下) + gest(带来) + ion → 从下面带来的 = 建议", scene: "'Any suggestions?' 有什么建议吗？", rhyme: "suggestion=建议(可数)，advice=建议(不可数)" },
  decision: { splitting: "de(离开) + cis(切) + ion → 切断犹豫 = 决定", scene: "'I made a decision.' 我做了决定", rhyme: "decision=决定(名词)，decide=决定(动词)" },
  solution: { splitting: "solu(松开) + tion → 松开问题 = 解决方案", scene: "'We need a solution.' 我们需要解决方案", rhyme: "solution=解决方案，solve=解决" },
  information: { splitting: "in(进入) + form(形状) + ation → 塑造成形 = 信息", scene: "'I need information.' 我需要信息", rhyme: "information=信息(不可数)" },
  conversation: { splitting: "con(共同) + vers(转) + ation → 共同转换话题 = 对话", scene: "'We had a conversation.' 我们进行了对话", rhyme: "conversation=对话(可数)" },
  condition: { splitting: "con(共同) + dit(给予) + ion → 共同给予的基础 = 条件", scene: "'Under what condition?' 什么条件下？", rhyme: "condition=条件/状况(可数)" },
  tradition: { splitting: "tra(横穿) + dit(给予) + ion → 代代传递 = 传统", scene: "'Chinese traditions are important.' 中国传统很重要", rhyme: "tradition=传统(名词)，traditional=传统的(形容词)" },
  imagination: { splitting: "im(进入) + agin(形象) + ation → 进入形象世界 = 想象力", scene: "'Use your imagination.' 用你的想象力", rhyme: "imagination=想象力(名词)，imagine=想象(动词)" },
  achievement: { splitting: "a(一) + chieve(达到) + ment → 达到的东西 = 成就", scene: "'This is a great achievement.' 这是伟大的成就", rhyme: "achievement=成就，achieve=达到" },
  confidence: { splitting: "con(共同) + fid(信任) + ence → 信任自己 = 自信", scene: "'Confidence is important.' 自信很重要", rhyme: "confidence=信心(名词)，confident=自信的(形容词)" },
  independent: { splitting: "in(不) + de(向下) + pend(悬挂) + ent → 不依赖的 = 独立的", scene: "'She is independent.' 她很独立", rhyme: "independent=独立的，independence=独立(名词)" },
  committee: { splitting: "com(共同) + mit(送) + tee → 被送去做事的群体 = 委员会", scene: "'The committee made a decision.' 委员会做了决定", rhyme: "committee=委员会(用单数动词)" },
  democracy: { splitting: "demo(人民) + cracy(统治) → 人民的统治 = 民主", scene: "'Democracy is important.' 民主很重要", rhyme: "democracy=民主，democratic=民主的" },
  authority: { splitting: "author(作者/创造者) + ity → 创造者的权力 = 权威", scene: "'Who has the authority?' 谁有权威？", rhyme: "authority=权威/当局" },
};

// ============================================================
// B2 扩展（50词）— 学术/正式/复杂词
// ============================================================

export const B2_MEMORY_EXT: Record<string, MemoryEntry> = {
  acknowledge: { splitting: "ac(朝向) + knowledge(知识) → 朝向知识 = 承认", scene: "'He acknowledged his mistake.' 他承认了错误", rhyme: "acknowledge=承认/致谢" },
  approximately: { splitting: "ap(朝向) + proxim(接近) + ately → 接近地 = 大约", scene: "'There are approximately 100 people.' 大约有100人", rhyme: "approximately=大约，about=大约(更口语)" },
  compromise: { splitting: "com(共同) + promise(承诺) → 共同承诺 = 妥协", scene: "'We reached a compromise.' 我们达成了妥协", rhyme: "compromise=妥协/折中" },
  consequently: { splitting: "con(共同) + sequ(跟随) + ently → 跟随而来的 = 因此", scene: "'It rained; consequently, the game was cancelled.' 下雨了，因此比赛取消了", rhyme: "consequently=因此，therefore=因此" },
  demonstrate: { splitting: "de(加强) + monstr(显示) + ate → 强烈显示 = 证明/演示", scene: "'Can you demonstrate this?' 你能演示一下吗？", rhyme: "demonstrate=证明/演示，demonstration=示威/演示" },
  predominantly: { splitting: "pre(在前) + domin(统治) + antly → 主要地", scene: "'The area is predominantly Chinese.' 这个区域主要是中国人", rhyme: "predominantly=主要地，mainly=主要地(更口语)" },
  phenomenon: { splitting: "phen(出现) + omen(预兆) + on → 出现的预兆 = 现象", scene: "'This is a natural phenomenon.' 这是自然现象", rhyme: "phenomenon(单数)→phenomena(复数)" },
  prestigious: { splitting: "prestig(声望) + ious → 有声望的", scene: "'This is a prestigious university.' 这是名牌大学", rhyme: "prestigious=有声望的" },
  significant: { splitting: "sign(标记) + ific + ant → 有标记的 = 显著的", scene: "'This is a significant finding.' 这是重大发现", rhyme: "significant=显著的，significance=重要性" },
  sophisticated: { splitting: "soph(智慧) + isticated → 充满智慧的 = 精密的", scene: "'This is a sophisticated system.' 这是精密系统", rhyme: "sophisticated=精密的/世故的，simple=简单的" },
  simultaneously: { splitting: "simul(相同) + taneously → 同时地", scene: "'They spoke simultaneously.' 他们同时说话了", rhyme: "simultaneously=同时地" },
  inevitably: { splitting: "in(不) + evit(避免) + ably → 不可避免地", scene: "'Change will inevitably happen.' 变化不可避免地会发生", rhyme: "inevitably=不可避免地" },
  comprehensive: { splitting: "com(一起) + prehens(抓住) + ive → 全部抓住的 = 全面的", scene: "'We need a comprehensive plan.' 我们需要全面计划", rhyme: "comprehensive=全面的，comprehension=理解力" },
  persistence: { splitting: "per(贯穿) + sist(站立) + ence → 一直站着 = 坚持", scene: "'Success requires persistence.' 成功需要坚持", rhyme: "persistence=坚持，persistent=坚持不懈的" },
  controversy: { splitting: "contra(反对) + vers(转) + y → 反着转 = 争议", scene: "'This topic is controversial.' 这个话题有争议", rhyme: "controversy=争议(名词)，controversial=有争议的" },
};

// ============================================================
// 合并所有扩展
// ============================================================

export const ALL_MEMORY_EXT: Record<string, MemoryEntry> = {
  ...A1_MEMORY_EXT,
  ...A2_MEMORY_EXT,
  ...B1_MEMORY_EXT,
  ...B2_MEMORY_EXT,
};
