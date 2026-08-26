/**
 * Grammar Batch 14 — Academic Writing, Business & Advanced American Usage (61 rules)
 */

import type { GrammarRule } from "./grammar-kb";

const W = (
  id: string, title: string, titleChinese: string, explanation: string, explanationChinese: string,
  ex: any[], ...rest: any[]
): GrammarRule => {
  let tips: any = [];
  let level: string = "C1";
  let cat: string = "acad";
  if (rest.length >= 3) { tips = rest[0]; level = String(rest[1]); cat = String(rest[2]); }
  else if (rest.length === 2) { level = String(rest[0]); cat = String(rest[1]); }
  return {
  id,
  category: cat === "biz" ? "Business English" : cat === "usage" ? "Advanced American Usage" : "Academic Writing",
  categoryChinese: cat === "biz" ? "商务英语" : cat === "usage" ? "高级美式用法" : "学术写作",
  title, titleChinese, explanation, explanationChinese,
  examples: (ex as any[]).map((e: any) => Array.isArray(e) ? { correct: String(e[0] ?? ""), chinese: String(e[1] ?? "") } : { correct: String(e), chinese: "" }),
  tips: (Array.isArray(tips) ? tips : tips ? [tips] : []).map((t: any) => Array.isArray(t) ? String(t[0]) : String(t)),
  level: (level as any), tags: [cat],
  };
};

export const BATCH14_GRAMMAR_RULES: GrammarRule[] = [
  W("ac-thesis","Thesis statement","主题句","One clear sentence stating the main point, usually at the end of the first paragraph.","一句话概括全文观点，通常在第一段末尾。",[["This paper argues that remote work increases productivity.","本文论证远程办公提高效率。"]],"B2","acad"),
  W("ac-topic-sentence","Topic sentence","段落主旨句","The first sentence of a paragraph states its main idea.","段落第一句说明该段中心思想。",[["First, cost is the biggest advantage.","第一，成本是最大优势。"]],["每段只讲一个要点"],"B1","acad"),
  W("ac-transitions","Academic transitions","学术衔接词","Use However, Therefore, Moreover, In contrast to connect ideas logically.","用However/Therefore/Moreover等词连接逻辑。",[["The data are limited. However, the trend is clear.","数据有限，但趋势明显。"]],["不要用but开头写正式文章"],"B1","acad"),
  W("ac-formal-tone","Avoid contractions in formal writing","正式写作避免缩写","Write do not instead of don't in essays and reports.","正式文章用do not而非don't。",[["The results do not support the hypothesis.","结果不支持该假设。"]],"B1","acad"),
  W("ac-passive-academic","Passive for objectivity","被动语态表客观","Passive voice emphasizes the action, not the actor, in academic prose.","学术论文用被动强调行为本身。",[["The samples were analyzed twice.","样本被分析了两次。"]],"B2","acad"),
  W("ac-cite","Reporting verbs","引述动词","Use argue, claim, suggest, demonstrate to introduce others' ideas.","用argue/claim/suggest等词引述他人观点。",[["Smith (2020) argues that costs will fall.","Smith（2020）认为成本会下降。"]],"B2","acad"),
  W("ac-hedging","Hedging language","谨慎表达","Use may, might, tend to, it appears to avoid overclaiming.","用may/tend to等避免绝对化表述。",[["The findings suggest that sleep may affect memory.","发现表明睡眠或影响记忆。"]],"B2","acad"),
  W("ac-conclusion","Conclusion structure","结论结构","Restate the thesis, summarize key points, end with implication or recommendation.","重申论点、总结要点、以启示结尾。",[["In conclusion, the benefits outweigh the risks.","总之，利大于弊。"]],"B2","acad"),
  W("ac-compare-essay","Compare and contrast signals","对比文章信号词","Use similarly, likewise, on the other hand, whereas for comparisons.","用similarly/on the other hand/whereas做对比。",[["City life is fast; rural life, whereas, is slow. → City life is fast, whereas rural life is slow.","对比句式示例。"]],["whereas引导对比从句"],"B2","acad"),
  W("ac-cause-effect","Cause and effect structure","因果结构","Use due to, as a result, consequently, lead to for causes and effects.","用due to/as a result/consequently表达因果。",[["Prices rose; as a result, demand fell.","价格上涨，因此需求下降。"]],"B2","acad"),
  W("ac-para-unity","Paragraph unity","段落统一性","Every sentence in a paragraph must support its topic sentence.","段落中每句都要支撑主旨句。",[["Cut sentences that go off topic.","删掉离题的句子。"]],"B2","acad"),
  W("ac-cohesion","Cohesive devices","语篇衔接","Repeat key nouns and use pronouns/reference words to link sentences across a text.","重复关键词+代词指代实现全篇衔接。",[["This approach... Such methods...","这种做法……这些方法……"]],"C1","acad"),
  W("ac-nominalization","Nominalization","名词化","Turning verbs into nouns (decide→decision) makes writing denser and more formal.","动词转名词使文体更正式。",[["They decided quickly. → Their quick decision...","快速决定（名词化）。"]],"C1","acad"),
  W("ac-appositive","Appositives in writing","同位语用法","A noun phrase renaming another noun adds information compactly.","同位语紧凑补充信息。",[["My boss, a former teacher, speaks four languages.","我老板曾是老师，会说四种语言。"]],"B2","usage"),
  W("ac-parallel-lists","Parallel structure in lists","列举平行结构","All items in a list must use the same grammatical form.","列表各项语法形式一致。",[["reading, writing, and speaking ✓ (reading, to write, speak ✗)","动名词保持一致。"]],"B1","usage"),
  W("bz-email-open","Business email openings","商务邮件开头","Dear Mr./Ms. + surname is formal; Hi + first name is standard internal tone.","Dear+姓最正式；Hi+名用于内部。",[["Dear Ms. Chen, / Hi John,","两种开头示例。"]],["不确定称呼时用Dear"],"A2","biz"),
  W("bz-email-close","Business email closings","商务邮件结尾","Best regards is neutral; Sincerely is formal; Thanks works internally.","Best regards通用；Sincerely正式；Thanks内部。",[["Best regards, Li Ming","落款示例。"]],"A2","biz"),
  W("bz-request","Polite requests in business","商务礼貌请求","Use Could you..., Would you mind..., I was wondering if... to soften requests.","Could you/Would you mind让请求更委婉。",[["Could you send me the report by Friday?","周五前能发我报告吗？"]],"B1","biz"),
  W("bz-follow-up","Follow-up phrases","跟进表达","I'm following up on... reintroduces a pending matter politely.","I'm following up on礼貌重提待办事项。",[["I'm following up on my email from Monday.","跟进周一的邮件。"]],"B1","biz"),
  W("bz-meeting","Meeting language","会议用语","Use move on, wrap up, table this, circle back in meetings.","会议常用move on/wrap up/circle back。",[["Let's circle back to this next week.","下周再回到这个话题。"]],"B2","biz"),
  W("bz-deadline","Deadline expressions","截止期表达","by Friday = not later than; on Friday = that day; until Friday = up to that day.","by=不晚于；on=当天；until=持续到。",[["Please reply by Friday.","请不晚于周五回复。"]],"A2","biz"),
  W("bz-apology","Business apologies","商务道歉","Apologize, state cause briefly, offer fix — never over-explain.","道歉+简述原因+给方案，不过度解释。",[["We apologize for the delay. Here is the corrected file.","对延迟致歉并附上修正文件。"]],"B1","biz"),
  W("bz-small-talk","Workplace small talk","职场寒暄","Safe topics: weather, weekend, commute, sports. Avoid politics, salary, age.","安全话题：天气、周末、通勤、体育；避开政治薪资年龄。",[["Did you have a good weekend?","周末过得好吗？"]],"A2","biz"),
  W("bz-interview","Interview answers","面试回答","Use STAR: Situation, Task, Action, Result when describing experience.","描述经历用STAR法则：情境任务行动结果。",[["In my last role, I led... As a result, sales rose 20%.","STAR回答示例。"]],"B2","biz"),
  W("bz-negotiate","Negotiation phrases","谈判用语","Use from our side, would that work, meet in the middle to negotiate smoothly.","from our side/meet in the middle让谈判顺畅。",[["Would that work for your team?","你们团队可行吗？"]],"B2","biz"),
  W("bz-report","Report structure","报告结构","Executive summary → background → findings → recommendations.","摘要→背景→发现→建议。",[["The summary appears before the details.","摘要在细节之前。"]],"C1","biz"),
  W("us-gonna","Spoken reductions: gonna/wanna/gotta","口语缩读","gonna=going to, wanna=want to, gotta=got to — speech only, never formal writing.","gonna/wanna/gotta仅用于口语。",[["I'm gonna call her. (=going to)","我要给她打电话。"]],["写作中禁用"],"B1","usage"),
  W("us-like-filler","Like as a filler","口语填充词like","Young Americans use like as a filler: He was like, no way!","美式口语He was like表示'他说'。",[["She was like, let's go!","她就说：走吧！"]],["非正式场合专用"],"B2","usage"),
  W("us-tag-isnt","Negative tag isn't it? misuse","中文式反问纠错","Chinese speakers overuse 'isn't it?' — match the tag to the verb: doesn't he? won't she?","反问尾句要匹配动词：doesn't he?不是isn't it?",[["He likes it, doesn't he? ✓ (isn't it? ✗)","正确反问示例。"]],"B1","usage"),
  W("us-one-of","One of the + plural","one of后接复数","After one of the, use a plural noun but singular verb: one of the books is...","one of the+复数名词+单数动词。",[["One of my friends lives in Texas.","我的一个朋友住在德州。"]],"A2","usage"),
  W("us-every","Everyone/everybody + singular","everyone配单数","Everyone, everybody, everything take singular verbs.","everyone是单数，动词加s。",[["Everyone is here. ✓ (are ✗)","大家都到了。"]],"A1","usage"),
  W("us-information","Uncountable: information/advice/furniture","不可数名词","information, advice, furniture, news never take -s or a/an; use a piece of.","information/advice/news不可数，用a piece of量化。",[["She gave me useful advice. ✓ (advices ✗)","她给了我有用的建议。"]],"A1","usage"),
  W("us-discuss","Discuss + object directly","discuss直接接宾语","Discuss takes no preposition: discuss the plan ✓ (discuss about ✗).","discuss直接接宾语，不加about。",[["We discussed the contract.","我们讨论了合同。"]],"B1","usage"),
  W("us-marry","Marry + object directly","marry不加with","marry someone ✓ (marry with ✗); married to someone for state.","marry直接接人；状态用be married to。",[["She married a doctor. / She is married to a doctor.","两个正确用法。"]],"A2","usage"),
  W("us-agree","Agree with/to/on","agree介词搭配","agree with a person, agree to a proposal, agree on terms.","agree with人对事on条款to提议。",[["I agree with you on this point.","这点我同意你。"]],"B1","usage"),
  W("us-depend","Depend on always","depend必须加on","depend always needs on: it depends on the weather.","depend永远要带on。",[["It depends on you.","这取决于你。"]],"A1","usage"),
  W("us-succeed","Succeed in + gerund","succeed搭配","succeed in doing something, success in something.","succeed in doing成功做成某事。",[["He succeeded in passing the exam.","他成功通过了考试。"]],"B1","usage"),
  W("us-capable","Capable of + gerund","capable搭配","capable of doing, ability to do.","capable of doing有能力做。",[["She is capable of leading the team.","她有能力带队。"]],"B1","usage"),
  W("us-look-forward","Look forward to + gerund","look forward to接动名词","to is a preposition here: look forward to seeing you.","这里to是介词，后面接doing。",[["I look forward to hearing from you.","期待您的回复。"]],"A2","usage"),
  W("us-be-used-to","Be used to vs used to","used to辨析","used to do = past habit; be used to doing = accustomed to.","used to do过去习惯；be used to doing现在适应。",[["I used to smoke. / I'm used to getting up early.","过去吸烟/习惯早起。"]],"B1","usage"),
  W("us-hardly","Hardly = almost not","hardly是否定含义","hardly means almost not, so never pair with not.","hardly本身含否定，不再加not。",[["I hardly know him. (=almost not)","我几乎不认识他。"]],"B2","usage"),
  W("us-double-negative","No double negatives","禁止双重否定","ain't nobody / don't know nothing is dialect; standard English allows one negative only.","标准英语一个句子只用一个否定词。",[["I don't know anything. ✓","我什么都不知道。"]],"A2","usage"),
  W("us-literally","Literally misuse","literally别滥用","literally means actually/in fact, not very.","literally意为字面上地，不是'非常'。",[["The word literally means word by word.","literally本义是逐字地。"]],"C1","usage"),
  W("us-ironic","Ironic vs coincidence","ironic与巧合区分","Irony involves contrast between expectation and reality; bad luck alone is not ironic.","irony需要期望与现实反差，倒霉≠讽刺。",[["Rain on the day of a weather conference — ironic.","气象大会当天下雨才是讽刺。"]],"C1","usage"),
  W("us-lay-lie","Lay vs lie","lay与lie区别","lay = put something (needs object); lie = recline (no object).","lay放东西需宾语；lie躺下无宾语。",[["Lay the book down. / I lie down every afternoon.","放下书/我下午躺着。"]],"B2","usage"),
  W("us-raise-rise","Raise vs rise","raise与rise区别","raise needs an object (raise prices); rise does not (prices rise).","raise及物提价；rise不及物上升。",[["The sun rises. They raised salaries.","太阳升起/他们加了薪。"]],"B1","usage"),
  W("us-borrow-lend","Borrow vs lend","borrow与lend方向","You borrow FROM someone; someone lends TO you.","borrow from借入；lend to借出。",[["Can I borrow your pen? / She lent me money.","借你的笔/她借钱给我。"]],"A1","usage"),
  W("us-say-tell","Say vs tell","say与tell区别","say something (to someone); tell someone something.","say接内容；tell先接人再接内容。",[["He said hello. He told me a story.","他说了你好/给我讲故事。"]],"A1","usage"),
  W("us-win-beat","Win vs beat","win与beat对象","win a game/prize; beat a person/team.","win赢比赛奖品；beat打败对手。",[["We won the game and beat them 3-0.","我们赢了比赛3比0击败他们。"]],"A2","usage"),
  W("us-price-cost","Price vs cost","price与cost","A thing has a price; it costs money; a person pays.","商品有price；花费用cost；人用pay。",[["The price is high. It costs $50. I paid $50.","价格高/花费50/付了50。"]],"A1","usage"),
  W("us-hear-listen","Hear vs listen","hear与listen区别","hear = sound reaches you; listen = pay attention deliberately.","hear听见（被动）；listen听（主动）。",[["I heard a noise. Listen to this song.","听到响声/听这首歌。"]],"A1","usage"),
  W("us-see-watch","See vs watch","see与watch区别","watch moving/action things (TV, games); see static ones (photos).","watch看动态（电视比赛）；see看静态（照片）。",[["Watch the game. See the photo.","看比赛/看照片。"]],"A1","usage"),
  W("us-travel-trip","Travel vs trip","travel与trip","travel is the general activity (uncountable verb); trip is one journey (countable noun).","travel泛指旅行活动；trip指一次行程可数。",[["I love travel. How was your trip?","我爱旅行/旅途如何？"]],"A2","usage"),
  W("us-fun-funny","Fun vs funny","fun与funny区别","fun = enjoyable; funny = makes you laugh.","fun开心好玩；funny滑稽好笑。",[["The party was fun. The comedian was funny.","派对好玩/喜剧演员好笑。"]],"A1","usage"),
  W("us-bored-boring","-ed vs -ing adjectives","-ed与-ing形容词","-ed describes feelings (bored person); -ing describes causes (boring movie).","-ed修饰人的感受；-ing修饰事物性质。",[["I am bored. The movie is boring.","我感到无聊/电影很无聊。"]],"A1","usage"),
  W("us-so-such","So vs such","so与such区别","so + adjective; such + adjective + noun.","so加形容词；such加形容词+名词。",[["So beautiful! Such a beautiful city!","如此美丽！这么美的城市！"]],"A2","usage"),
  W("us-enough","Enough position","enough位置","enough follows adjectives (good enough) but precedes nouns (enough time).","enough跟在形容词后、放在名词前。",[["Is it warm enough? We have enough time.","够暖和吗？时间够吗？"]],"A2","usage"),
  W("us-too-very","Too vs very","too与very感情色彩","very is neutral emphasis; too implies excess and problems.","very中性强调；too过度含负面。",[["Very hot today. Too hot to run.","今天很热/热得没法跑步。"]],"A1","usage"),
  W("us-still-yet-already","Still/yet/already","still/yet/already辨析","still = continuing; yet = expected (negatives/questions); already = sooner than expected.","still仍在；yet尚未；already已经。",[["Still waiting. Not yet. Already done?","还在等/还没/已经好了？"]],"B1","usage"),
  W("us-actually","Actually ≠ 现在实际上的语气","actually真实含义","actually corrects or adds real information, often contrasting expectation.","actually用于纠正或补充真实信息。",[["Actually, the meeting is tomorrow.","其实会是明天。"]],"B1","usage"),
  W("us-eventually","Eventually ≠ 最终的误译","eventually真实含义","eventually = in the end after a long time, not possibly.","eventually最终（经过长时间），不是也许。",[["He studied hard and eventually passed.","他努力学习终于通过了。"]],"B1","usage"),
  W("us-opportunity","Opportunity vs chance","opportunity与chance","opportunity = favorable situation to do something; chance = probability or random possibility.","opportunity良机；chance概率或偶然可能。",[["A great opportunity. What's the chance of rain?","好机会/下雨概率多少？"]],"B1","usage"),
];
