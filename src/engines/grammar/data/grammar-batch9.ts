/**
 * Grammar Batch 9 — Collocations & Confusable Words (60 rules)
 */

import type { GrammarRule } from "./grammar-kb";

const C = (
  id: string, title: string, titleChinese: string, explanation: string, explanationChinese: string,
  ex: any[], tips: any, level: "A1"|"A2"|"B1"|"B2"|"C1"|"C2", cat: string
): GrammarRule => ({
  id, category: cat === "conf" ? "Confusable Words Extended" : "Collocations Extended",
  categoryChinese: cat === "conf" ? "易混淆词扩展" : "词语搭配扩展",
  title, titleChinese, explanation, explanationChinese,
  examples: (ex as any[]).map((e: any) => Array.isArray(e) ? { correct: String(e[0] ?? ""), chinese: String(e[1] ?? "") } : { correct: String(e), chinese: "" }),
  tips: (Array.isArray(tips) ? tips : [tips]).map((t: any) => Array.isArray(t) ? String(t[0]) : String(t)), level, tags: [cat],
});

export const BATCH9_GRAMMAR_RULES: GrammarRule[] = [
  C("col-heavy-rain","Heavy rain / Heavy traffic / Heavy smoker","大雨/堵车/老烟枪","heavy + things that come in large amount or intensity.","heavy用于量大或程度深的事物。",[["We had heavy rain last night.","昨晚下了大雨。"],["Sorry I'm late — heavy traffic.","抱歉迟到，路上太堵。"]],["heavy rain/snow/traffic","a heavy smoker/drinker","heavy meal=油腻难消化的饭"],"A2","coll"),
  C("col-strong-coffee","Strong coffee / Weak tea","浓咖啡/淡茶","strong = intense flavor; weak = light flavor.","strong=味道浓；weak=味道淡。",[["I'd like a strong coffee, please.","请给我来杯浓咖啡。"]],["strong/weak tea or coffee","opposite pair"],"A1","coll"),
  C("col-take-medicine","Take medicine / Take a test","吃药/参加考试","take goes with many fixed nouns.","take与许多名词固定搭配。",[["Take this medicine twice a day.","这药一天吃两次。"],["I'm taking the TOEFL next month.","我下个月考托福。"]],["take medicine/a break/a shower/an exam"],"A1","coll"),
  C("col-make-progress","Make progress / Make an effort","取得进步/努力","make + abstract achievements.","make与抽象成就搭配。",[["You're making great progress!","你进步很大！"]],["make progress/an effort/an appointment/a promise"],"A2","coll"),
  C("col-do-damage","Do damage / Do good / Do harm","造成损害/有益/有害","do with effects and harm/benefit.","do与效果、损害、好处搭配。",[["Smoking does a lot of harm.","吸烟危害很大。"]],["do damage/good/harm/a favor"],"B1","coll"),
  C("col-pay-attention","Pay attention / Pay a compliment","注意/称赞","pay with attention and social acts.","pay与注意力及社交行为搭配。",[["Pay attention to the road!","注意路况！"]],["pay attention/respect/a compliment/the bill"],"A2","coll"),
  C("col-save-time","Save time / Save money / Save a seat","省时/省钱/占座","save + resources.","save与资源类名词搭配。",[["Booking online saves time.","网上订票省时间。"]],["save time/money/lives/energy"],"A2","coll"),
  C("col-spend-fortune","Spend a fortune","花大钱","spend + large amounts.","spend与大额金钱搭配。",[["She spent a fortune on shoes.","她买鞋花了大价钱。"]],["spend a fortune/time/money on sth"],"B1","coll"),
  C("col-deep-sleep","Deep sleep / Sound sleep","深度睡眠","deep/sound = very deep sleep.","deep或sound表示睡得很沉。",[["The baby is in a deep sleep.","宝宝睡得很沉。"]],["fall into a deep sleep","a sound sleeper=睡得沉的人"],"A2","coll"),
  C("col-fast-asleep","Fast asleep / Wide awake","熟睡/完全清醒","fast asleep = sleeping deeply; wide awake = fully awake.","fast asleep=睡得香；wide awake=一点不困。",[["The kids are fast asleep.","孩子们睡熟了。"]],["fast asleep（不是quickly asleep）","wide awake"],"A2","coll"),
  C("col-run-business","Run a business / Run errands","经营生意/跑腿办事","run + management tasks.","run与管理事务搭配。",[["She runs a small bakery.","她开了家小面包店。"],["I have some errands to run.","我得去办点事。"]],[["学习要点","结合例句与中文对照记忆"]],"B1","coll"),
  C("col-break-habit","Break a habit / Break a record","改掉习惯/破纪录","break + habits and records.","break与习惯和纪录搭配。",[["It takes 21 days to break a habit.","改掉习惯需要21天。"]],["break a habit/promise/rule/record","kick a habit=戒掉习惯(口语)"],"B1","coll"),
  C("col-meet-deadline","Meet a deadline / Meet expectations","赶上截止期/达到期望","meet + targets and standards.","meet与目标和标准搭配。",[["We must meet Friday's deadline.","必须赶上周五的期限。"]],["meet a deadline/requirements/standards"],"B2","coll"),
  C("col-catch-flight","Catch a flight / Catch a cold","赶航班/感冒","catch + transport & illness.","catch与交通工具和疾病搭配。",[["Hurry, we'll miss our flight — no, we'll catch it!","快点，不然赶不上飞机了！"]],["catch a bus/train/flight","catch a cold/the flu"],"A2","coll"),
  C("col-close-call","A close call / A close game","千钧一发/势均力敌","close = narrow margin.","close表示差距很小。",[["That was a close call!","好险！"],["It was a close game, 89:87.","比赛很胶着，89比87。"]],[["学习要点","结合例句与中文对照记忆"]],"B2","coll"),
  C("col-common-sense","Common sense / Common knowledge","常识/众所周知","common sense = practical judgment; common knowledge = widely known fact.","common sense=生活常识判断；common knowledge=大家都知道的事。",[["Use your common sense!","用点常识吧！"],["It's common knowledge that the earth is round.","地球是圆的，这是常识。"]],[["学习要点","结合例句与中文对照记忆"]],"B2","coll"),
  C("col-vital-role","Play a role / Play a part / Play a vital role","起作用/扮演重要角色","play + roles in outcomes.","play与作用角色搭配。",[["Exercise plays a vital role in health.","锻炼对健康至关重要。"]],[["学习要点","结合例句与中文对照记忆"]],"B2","coll"),
  C("col-reach-goal","Reach a goal / Reach an agreement","达成目标/达成协议","reach + goals and agreements.","reach与目标协议搭配。",[["After long talks, both sides reached an agreement.","长谈之后双方达成协议。"]],[["学习要点","结合例句与中文对照记忆"]],"B2","coll"),
  C("col-sharp-pain","Sharp pain / Dull ache","刺痛/隐痛","sharp pain = sudden severe; dull ache = constant mild.","sharp pain=剧痛刺痛；dull ache=隐隐作痛。",[["I feel a sharp pain in my chest.","胸口一阵刺痛。"],["a dull ache in my back","背部隐隐作痛"]],[["学习要点","结合例句与中文对照记忆"]],"B1","coll"),
  C("col-warm-welcome","A warm welcome / A cold shoulder","热情欢迎/冷遇","warm/cold describe social treatment.","warm表热情，cold表冷漠。",[["They gave us a warm welcome.","他们热情地迎接我们。"],["He gave me the cold shoulder.","他对我不理不睬。"]],[["学习要点","结合例句与中文对照记忆"]],"B2","coll"),
  C("conf-lend-borrow","Lend vs Borrow","借出与借入","lend = give temporarily TO someone; borrow = take temporarily FROM someone.","lend=借给别人；borrow=向别人借。",[["Can you lend me $20? (= Can I borrow $20?)","能借我20美元吗？"]],["主语角度相反：You lend to me; I borrow from you"],"A2","conf"),
  C("conf-hear-listen","Hear vs Listen to","听到与倾听","hear = sound reaches ears; listen = pay attention deliberately.","hear=声音传进耳朵；listen=主动去听。",[["I heard a noise. → Let's listen carefully.","我听见有响声。→ 我们仔细听听。"]],["hear=被动接收","listen to=主动听"],"A1","conf"),
  C("conf-see-watch-look","See vs Watch vs Look at","看见/观看/看向","see = notice visually; watch = observe moving things; look at = direct eyes toward.","see=自然看见；watch=看动态的东西；look at=目光投向。",[["I saw him yesterday.","我昨天见到他了。"],["watch TV/a movie/a game","Look at that sunset!","快看那晚霞！"]],[["学习要点","结合例句与中文对照记忆"]],"A1","conf"),
  C("conf-say-tell","Say vs Tell","说与告诉","say + words; tell + person (+ story/truth).","say直接接话；tell接人再接内容。",[["She said (that) she was tired.","她说她累了。"],["She told me (that) she was tired.","她告诉我她累了。"]],["say hello/sorry/nothing","tell the truth/a story/a lie","tell sb vs say to sb"],"A1","conf"),
  C("conf-speak-talk","Speak vs Talk","正式说与闲聊","speak more formal/one-way; talk conversational/two-way.","speak更正式单向；talk偏聊天双向。",[["May I speak with the manager?","我能和经理谈谈吗？"],["We talked for hours.","我们聊了好几个小时。"]],[["学习要点","结合例句与中文对照记忆"]],"A2","conf"),
  C("conf-win-beat","Win vs Beat","赢(物)与击败(人)","win + game/prize/match; beat + opponent.","win后接比赛奖项；beat后接对手。",[["We won the game. / We beat them 3-0.","我们赢了比赛。/我们3比0击败了他们。"]],["win a prize/game/election","beat a team/person/record"],"A2","conf"),
  C("conf-rise-raise","Rise vs Raise","上升(自)与举起(他)","rise = go up by itself (rise-rose-risen); raise = lift something else (raise-raised).","rise自身上升；raise把某物抬高。",[["The sun rises in the east.","太阳从东方升起。"],["Raise your hand if you know.","知道的请举手。"]],["prices rise / people raise prices","salary raise(名词)"],"B1","conf"),
  C("conf-lie-lay","Lie vs Lay","躺与放置","lie (lie-lay-lain) = recline; lay (lay-laid-laid) = put something down.","lie躺卧（过去式lay）；lay放平某物（过去式laid）。",[["I lie down every afternoon.","我每天下午躺一会儿。"],["Lay the book on the table.","把书放桌上。"],["Yesterday he lay in bed all day.","昨天他躺了一整天。"]],[["学习要点","结合例句与中文对照记忆"]],"B2","conf"),
  C("conf-lose-loose","Lose vs Loose","丢失(动词)与松的(形容词)","lose = misplace/not win (verb); loose = not tight (adjective).","lose是动词：丢失输掉；loose是形容词：松的。",[["Don't lose your ticket.","别弄丢了票。"],["My tooth is loose.","我的牙松了。"]],["发音不同：/luːz/ vs /luːs/"],"A2","conf"),
  C("conf-advice-advise","Advice vs Advise","建议(名)与建议(动)","advice = noun (uncountable); advise = verb.","advice是不可数名词；advise是动词。",[["Let me give you some advice.","给你点建议。"],["I advise you to rest.","我劝你休息。"]],["advise sb to do","a piece of advice"],"B1","conf"),
  C("conf-stationary-stationery","Stationary vs Stationery","静止的与文具","stationary = not moving; stationery = paper & pens.","stationary=静止不动；stationery=文具信纸。",[["The car was stationary.","车停着没动。"],["office stationery","办公文具"]],[["学习要点","结合例句与中文对照记忆"]],"C1","conf"),
  C("conf-quite-quiet","Quite vs Quiet","相当与安静","quite = fairly; quiet = no noise.","quite=相当地；quiet=安静的。",[["It's quite warm today.","今天相当暖和。"],["Be quiet, please.","请安静。"]],[["学习要点","结合例句与中文对照记忆"]],"A2","conf"),
  C("conf-remember-remind","Remember vs Remind","记得与提醒","remember = keep in memory; remind = make someone remember.","remember=自己记得；remind=使别人想起。",[["I remember his face.","我记得他的脸。"],["Remind me to call Mom.","提醒我给妈妈打电话。"]],["remind sb of sth=使想起"],"A2","conf"),
  C("conf-bring-take","Bring vs Take","带来与带走","bring = toward speaker; take = away from speaker.","bring朝说话人方向来；take离开说话人方向去。",[["Bring your book here.","把书拿到这儿来。"],["Take an umbrella with you.","带上雨伞。"]],[["学习要点","结合例句与中文对照记忆"]],"A1","conf"),
  C("conf-wear-put-on","Wear vs Put on","穿着与穿上","wear = state of having on; put on = action of dressing.","wear表状态；put on表动作。",[["She wears glasses.","她戴眼镜。（状态）"],["Put on your coat.","穿上外套。（动作）"]],[["学习要点","结合例句与中文对照记忆"]],"A1","conf"),
  C("conf-fit-suit-match","Fit vs Suit vs Match","合身/适合/匹配","fit = size; suit = look good on; match = go well together.","fit指尺码合适；suit指风格合适好看；match指两物相配。",[["These shoes fit perfectly.","鞋很合脚。"],["Red suits you.","红色很衬你。"],["Your tie matches your shirt.","领带配衬衫。"]],[["学习要点","结合例句与中文对照记忆"]],"B1","conf"),
  C("conf-travel-trip-journey","Travel vs Trip vs Journey","旅行(泛)/短途/长途","travel = general activity (uncountable); trip = short return journey; journey = long one-way trip.","travel泛指旅行不可数；trip短途往返；journey单程长途。",[["Travel broadens the mind.","旅行开阔眼界。"],["How was your business trip?","出差怎么样？"],["a train journey across Asia","横跨亚洲的火车之旅"]],[["学习要点","结合例句与中文对照记忆"]],"B1","conf"),
  C("conf-job-work","Job vs Work","工作职位与工作活动","job = countable position; work = uncountable effort/place.","job可数指职位；work不可数指劳动或工作地点。",[["She has a good job.","她有份好工作。"],["I have a lot of work today.","我今天活儿很多。"]],[["学习要点","结合例句与中文对照记忆"]],"A1","conf"),
  C("conf-fun-funny","Fun vs Funny","有趣好玩与搞笑","fun = enjoyable; funny = makes you laugh.","fun=好玩愉快；funny=滑稽可笑。",[["The park was fun.","公园很好玩。"],["The clown was funny.","小丑很搞笑。"]],[["学习要点","结合例句与中文对照记忆"]],"A1","conf"),
  C("conf-hard-hardly","Hard vs Hardly","努力地与几乎不","hard = with effort; hardly = almost not.","hard=努力地；hardly=几乎不。",[["Work hard!","努力干活！"],["I hardly know him.","我几乎不认识他。"]],[["学习要点","结合例句与中文对照记忆"]],"A2","conf"),
  C("conf-especially-specially","Especially vs Specially","尤其与特意","especially = particularly; specially = for a specific purpose.","especially=特别是强调突出；specially=专门为了某目的。",[["I love fruit, especially mangoes.","我爱水果，尤其是芒果。"],["This cake was made specially for you.","这蛋糕是专门为你做的。"]],[["学习要点","结合例句与中文对照记忆"]],"B2","conf"),
  C("conf-so-such","So vs Such","如此(形)与如此(名)","so + adjective/adverb; such + (adj) + noun.","so修饰形容词副词；such修饰名词短语。",[["It's so hot! / It's such a hot day!","天太热了！/这么热的天！"]],["so beautiful / such beauty","such a + 单数可数名词"],"A2","conf"),
  C("conf-too-enough","Too vs Enough","太…而不足与足够","too + adj (negative); adj + enough (sufficient).","too+形容词=过于；形容词+enough=足够。",[["It's too expensive.","太贵了（买不起）。"],["Is it cheap enough?","够便宜吗？"]],[["学习要点","结合例句与中文对照记忆"]],"A1","conf"),
  C("conf-used-to-be-used","Used to vs Be used to","过去常常与习惯于","used to + verb = past habit; be used to + noun/-ing = accustomed.","used to do过去常做；be used to doing已习惯于。",[["I used to smoke.","我以前抽烟。"],["I'm used to getting up early.","我习惯早起了。"]],[["学习要点","结合例句与中文对照记忆"]],"B1","conf"),
  C("conf-alone-lonely","Alone vs Lonely","独自与孤独","alone = by yourself (fact); lonely = sad from isolation (feeling).","alone客观独自；lonely主观孤独感。",[["I live alone but never feel lonely.","我独居但从不孤独。"]],[["学习要点","结合例句与中文对照记忆"]],"B1","conf"),
  C("conf-borrow-book","Check out vs Check (a book)","图书馆语境辨析","In US libraries: check out = borrow.","美式图书馆用check out表示借书。",[["I checked out two books.","我借了两本书。"]],["renew=续借","return=归还","due date=到期日"],"B1","conf"),
];
