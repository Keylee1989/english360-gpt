/**
 * Grammar Batch 13 — More Idioms, Confusables & Collocations (64 rules)
 */

import type { GrammarRule } from "./grammar-kb";

const R = (
  id: string, title: string, titleChinese: string, explanation: string, explanationChinese: string,
  ex: any[], ...rest: any[]
): GrammarRule => {
  // tolerant: (tips, level, cat) | (level, cat) | (level) — detect by value type
  let tips: any = [];
  let level: string = "B1";
  let cat: string = "idiom";
  if (rest.length >= 3) { tips = rest[0]; level = String(rest[1]); cat = String(rest[2]); }
  else if (rest.length === 2) {
    // could be (level, cat) or (tips, level)
    if (typeof rest[0] === "string" && /^(A1|A2|B1|B2|C1|C2)$/.test(rest[0])) { level = rest[0]; cat = String(rest[1]); }
    else { tips = rest[0]; level = String(rest[1]); }
  } else if (rest.length === 1) {
    if (typeof rest[0] === "string" && /^(A1|A2|B1|B2|C1|C2)$/.test(rest[0])) { level = rest[0]; }
    else { tips = rest[0]; }
  }
  return {
  id,
  category: cat === "conf" ? "Confusable Words Extended" : cat === "colloc" ? "Collocations Extended" : "Idioms & Expressions Extended",
  categoryChinese: cat === "conf" ? "易混淆词扩展" : cat === "colloc" ? "词语搭配扩展" : "习语表达扩展",
  title, titleChinese, explanation, explanationChinese,
  examples: (ex as any[]).map((e: any) => Array.isArray(e) ? { correct: String(e[0] ?? ""), chinese: String(e[1] ?? "") } : { correct: String(e), chinese: "" }),
  tips: (Array.isArray(tips) ? tips : tips ? [tips] : []).map((t: any) => Array.isArray(t) ? String(t[0]) : String(t)),
  level: (level as any), tags: [cat],
  };
};

export const BATCH13_GRAMMAR_RULES: GrammarRule[] = [
  R("idm2-beat-around","Beat around the bush","拐弯抹角","Avoid saying something directly.","不直接说重点。",[["Stop beating around the bush and tell me.","别绕弯子，直说吧。"]],["=speak indirectly"],"B1","idiom"),
  R("idm2-bite-tongue","Bite your tongue","忍住不说","Stop yourself from saying something.","强忍着不说出口。",[["I had to bite my tongue.","我只能咽下这句话。"]],"C1","idiom"),
  R("idm2-blow-off-steam","Blow off steam","发泄放松","Release stress or energy.","释放压力。",[["I play basketball to blow off steam.","我打篮球解压。"]],"B1","idiom"),
  R("idm2-break-even","Break even","收支平衡","Neither profit nor lose.","不赚不亏。",[["We finally broke even this year.","今年终于保本了。"]],"B2","idiom"),
  R("idm2-butterflies","Butterflies in my stomach","紧张得心里打鼓","Nervous feeling in stomach.","紧张感。",[["I had butterflies before the interview.","面试前我紧张极了。"]],"B1","idiom"),
  R("idm2-change-mind","Change your mind","改变主意","Decide differently.","改主意。",[["She changed her mind about moving.","她改变搬家的主意了。"]],"A2","idiom"),
  R("idm2-come-clean","Come clean","坦白交代","Confess the truth.","坦白说真话。",[["He came clean about the accident.","他坦白了事故真相。"]],"B2","idiom"),
  R("idm2-cross-mind","Cross your mind","闪过脑海","Think of briefly briefly.","突然想到。",[["It never crossed my mind.","我从没想过。"]],"B1","idiom"),
  R("idm2-down-to-earth","Down to earth","接地气","Practical and realistic.","务实不做作。",[["She's famous but very down to earth.","她有名但很接地气。"]],"B1","idiom"),
  R("idm2-drive-crazy","Drive someone crazy","把人逼疯","Annoy someone greatly.","让人受不了。",[["The noise is driving me crazy!","吵死我了！"]],"A2","idiom"),
  R("idm2-eagle-eye","Eagle eye","敏锐眼光","Very sharp eyesight/attention.","目光锐利。",[["My teacher has an eagle eye for errors.","老师挑错特别准。"]],"B1","idiom"),
  R("idm2-feel-blue","Feel blue","心情低落","Feel sad.","难过忧郁。",[["Rainy days make me feel blue.","雨天让我心情低落。"]],"B1","idiom"),
  R("idm2-figure-of-speech","Figure of speech","修辞说法","Words not meant literally.","不是字面意思的表达。",[["Break a leg is a figure of speech.","break a leg是比喻。"]],"B2","idiom"),
  R("idm2-get-along","Get along (with)","相处融洽","Have a good relationship.","合得来。",[["I get along well with my coworkers.","我和同事相处很好。"]],"A2","idiom"),
  R("idm2-get-rid-of","Get rid of","处理掉","Remove or discard.","扔掉摆脱。",[["Get rid of old clothes you never wear.","把从不穿的旧衣服清掉。"]],"A2","idiom"),
  R("idm2-give-up","Give up on someone","对某人失望放弃","Stop believing in someone.","不再抱希望。",[["Never give up on yourself.","永远别放弃自己。"]],"A2","idiom"),
  R("idm2-go-with-flow","Go with the flow","随遇而安","Accept things as they happen.","顺其自然。",[["No plan tonight—just go with the flow.","今晚没计划，走一步看一步。"]],"B1","idiom"),
  R("idm2-hang-in-there","Hang in there","坚持住","Don't give up.","撑下去。",[["Hang in there—the weekend is coming!","坚持住，周末快到了！"]],"B1","idiom"),
  R("idm2-hit-snooze","Hit the snooze button","按贪睡键","Delay the alarm briefly.","赖床再睡一会。",[["I hit the snooze button three times.","我按了三次闹钟贪睡键。"]],"B1","idiom"),
  R("idm2-in-long-run","In the long run","长远来看","Over a long period.","长期角度。",[["Exercise pays off in the long run.","锻炼从长远看是划算的。"]],"B1","idiom"),
  R("idm2-joint-decision","A joint decision","共同决定","Decision made together.","一起做的决定。",[["Buying a house was a joint decision.","买房是我们共同的决定。"]],"B2","idiom"),
  R("idm2-keep-track","Keep track of","掌握动态","Stay informed about.","持续跟进记录。",[["App helps you keep track of expenses.","App帮你记账追踪开支。"]],"B1","idiom"),
  R("idm2-learn-rope","Learn the ropes","熟悉门道","Learn how a job works.","学会基本门道。",[["It takes a month to learn the ropes.","上手得一个月。"]],"B2","idiom"),
  R("idm2-make-up","Make up (reconcile)","和好","Become friends again after fight.","吵架后和好。",[["They argued but made up quickly.","他们吵了但很快和好。"]],"B1","idiom"),
  R("idm2-miss-boat","Miss the boat","错失良机","Lose an opportunity.","错过了时机。",[["Buy now or miss the boat.","现在不买就没机会了。"]],"B2","idiom"),
  R("idm2-on-purpose","On purpose","故意地","Intentionally.","有意为之。",[["Did you do that on purpose?","你是故意的吗？"]],"A2","idiom"),
  R("idm2-out-of-blue","Out of the blue","突如其来","Unexpectedly.","毫无预兆。",[["He called me out of the blue.","他突然来电。"]],"B1","idiom"),
  R("idm2-read-between-lines","Read between the lines","读出言外之意","Understand hidden meaning.","体会隐含含义。",[["Read between the lines—he's not happy.","弦外之音是：他不高兴。"]],"B2","idiom"),
  R("idm2-right-away","Right away","立刻马上","Immediately.","马上。",[["I'll do it right away.","我马上去做。"]],"A2","idiom"),
  R("idm2-rule-thumb","Rule of thumb","经验法则","General practical principle.","粗略的经验规则。",[["Rule of thumb: save 10% of income.","经验法则：存下收入的10%。"]],"B2","idiom"),
  R("idm2-second-nature","Second nature","习以为常","So practiced it feels automatic.","熟练成自然。",[["Driving became second nature.","开车已成本能。"]],"B2","idiom"),
  R("idm2-sit-tight","Sit tight","静待不动","Wait patiently without action.","原地等待别动。",[["Sit tight; help is coming.","别动，救援马上到。"]],"B2","idiom"),
  R("idm2-sleep-like-log","Sleep like a log","睡得很沉","Sleep deeply.","酣睡如泥。",[["I slept like a log last night.","昨晚睡得死沉。"]],"B1","idiom"),
  R("idm2-sooner-later","Sooner or later","迟早","Eventually.","早晚有一天。",[["Sooner or later, the truth comes out.","纸包不住火。"]],"A2","idiom"),
  R("idm2-stab-back","Stab someone in the back","背后捅刀","Betray secretly.","背叛暗算。",[["He stabbed me in the back at work.","他在职场上阴了我一把。"]],"B2","idiom"),
  R("idm2-take-it-easy","Take it easy","放轻松","Relax / don't stress.","放松点。",[["Take it easy—you did your best.","放轻松，你已尽力了。"],["Take care! Take it easy!(告别)","再见，保重！"]],"A2","idiom"),
  R("idm2-under-pressure","Under pressure","承受压力","In a stressful situation.","压力之下。",[["Diamonds form under pressure.","钻石在高压下形成。"],["Work under pressure is common here.","这里高压工作很常见。"]],"B1","idiom"),
  R("idm2-water-under-bridge","Water under the bridge","往事随风","Past events now forgiven.","过去的事不必再提。",[["Our argument? Water under the bridge.","那场争吵？翻篇了。"]],"B2","idiom"),
  R("idm2-wear-many-hats","Wear many hats","身兼数职","Have many roles.","一人多角色。",[["At a startup, you wear many hats.","创业公司里你什么都干。"]],"B2","idiom"),
  R("idm2-white-lie","White lie","善意的谎言","Harmless lie to be kind.","为不伤人的小谎。",[["Telling her the cake was great was a white lie.","说蛋糕好吃是善意的谎言。"]],"B2","idiom"),
  R("idm2-wrap-up","Wrap up","收尾结束","Finish/conclude.","完成收尾。",[["Let's wrap up the meeting.","我们收个尾散会。"]],"A2","idiom"),
  R("col2-heavily-rely","Rely heavily on","严重依赖","depend strongly.","高度依赖某物。",[["We rely heavily on customer feedback.","我们非常依赖客户反馈。"]],"B2","coll"),
  R("col2-fully-aware","Fully aware","充分意识到","completely conscious of.","完全清楚。",[["I'm fully aware of the risks.","我完全清楚风险。"]],"B2","coll"),
  R("col2-bitterly-disappointed","Bitterly disappointed","大失所望","very disappointed.","极其失望。",[["Fans were bitterly disappointed.","粉丝们都心碎了。"]],"B2","coll"),
  R("col2-widely-known","Widely known / Widely used","广为人知/广泛使用","known by many.","广为人知或普及。",[["English is widely used online.","英语在网络中被广泛使用。"]],"B2","coll"),
  R("col2-strictly-forbidden","Strictly forbidden","严令禁止","absolutely not allowed.","绝对禁止。",[["Smoking is strictly forbidden here.","此处严禁吸烟。"]],"B2","coll"),
  R("col2-highly-recommend","Highly recommend","强烈推荐","recommend strongly.","极力推荐。",[["I highly recommend this book.","我强烈推荐这本书。"]],"B1","coll"),
  R("col2-raise-awareness","Raise awareness","提高意识","make people know an issue.","提升公众认知。",[["The campaign raises awareness of recycling.","活动旨在提升回收意识。"]],"B2","coll"),
  R("col2-meet-standard","Meet standards / Set standards","达到标准/制定标准","reach/define quality levels.","达标与定标。",[["The product meets international standards.","产品符合国际标准。"]],"B2","coll"),
  R("col2-take-responsibility","Take responsibility","承担责任","accept duty for something.","担责。",[["Own your mistakes—take responsibility.","犯错就要担责。"]],"B1","coll"),
  R("col2-play-role","Play a role in","在其中起作用","have influence on.","产生影响。",[["Diet plays a role in sleep quality.","饮食影响睡眠质量。"]],"B1","coll"),
  R("col2-pay-dividend","Pay dividends","带来回报","bring long-term benefits.","终有回报。",[["Learning code pays dividends later.","学编程日后必有回报。"]],"C1","coll"),
  R("col2-run-risk","Run the risk of","冒…的风险","be exposed to danger.","冒风险。",[["You run the risk of losing money.","你有亏钱的风险。"]],"B2","coll"),
  R("col2-draw-conclusion","Draw a conclusion","得出结论","decide based on facts.","下结论。",[["Don't draw conclusions too fast.","别急着下结论。"]],"B2","coll"),
  R("col2-make-assumption","Make an assumption","作出假设","suppose without proof.","想当然假设。",[["Don't make assumptions—ask.","别猜，直接问。"]],"B2","coll"),
  R("col2-come-to-realize","Come to realize","逐渐意识到","gradually understand.","慢慢明白。",[["I came to realize he was right.","我渐渐意识到他是对的。"]],"B2","coll"),
  R("conf2-remind-vs-remember","Remind vs Remember","提醒与记得（扩展）","remind sb TO do vs remember TO do.","remind是让别人记；remember是自己记。",[["Please remind me to lock up.","请提醒我锁门。"],["I must remember to lock up.","我得记得锁门。"]],"A2","conf"),
  R("conf2-worth-worthy","Worth vs Worthy","值得的两种形","worth + noun/-ing; worthy of + noun.","worth接名词或动名词；worthy of接名词。",[["This book is worth reading.","这书值得一读。"],["a cause worthy of support","值得支持的事业"]],"B2","conf"),
  R("conf2-argue-discuss","Argue vs Discuss","争执与商讨","argue often = quarrel; discuss = talk over calmly.","argue常指争吵；discuss平和讨论。",[["They argued about money.","他们为钱吵架。"],["We discussed the budget calmly.","我们冷静讨论预算。"]],"B1","conf"),
  R("conf2-deny-refuse-reject","Deny vs Refuse vs Reject","否认/拒绝(做)/否决","deny a claim; refuse to do; reject an offer.","deny否认指控；refuse不肯做；reject驳回提案。",[["He denied stealing.","他否认偷窃。"],["She refused to sign.","她拒签。"],["The court rejected the appeal.","法院驳回了上诉。"]],"B2","conf"),
  R("conf2-cost-effective","Cost vs Effective Use","cost搭配辨析","cost sb sth / It cost... / cost of living.","cost用法清单。",[["It cost me $50.","花了我50刀。"],["the cost of living","生活成本"]],"B1","conf"),
];
