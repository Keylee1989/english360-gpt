/**
 * Grammar Batch 12 — Everyday Functions & American Life Scenarios (58 rules)
 */

import type { GrammarRule } from "./grammar-kb";

const F = (
  id: string, title: string, titleChinese: string, explanation: string, explanationChinese: string,
  ex: any[], tips: any, level: "A1"|"A2"|"B1"|"B2"|"C1"|"C2", cat: string
): GrammarRule => ({
  id, category: "Everyday Functions", categoryChinese: "日常功能英语",
  title, titleChinese, explanation, explanationChinese,
  examples: (ex as any[]).map((e: any) => Array.isArray(e) ? { correct: String(e[0] ?? ""), chinese: String(e[1] ?? "") } : { correct: String(e), chinese: "" }),
  tips: (Array.isArray(tips) ? tips : [tips]).map((t: any) => Array.isArray(t) ? String(t[0]) : String(t)), level, tags: [cat],
});

export const BATCH12_GRAMMAR_RULES: GrammarRule[] = [
  F("fn-restaurant-order","Ordering at a Restaurant","餐厅点餐","I'll have... / Could I get... / For here or to go?","美式点餐标准句式。",[["I'll have the burger, please.","我要一个汉堡。"],["Could I get that to go?","这个能打包吗？"]],["For here or to go?=堂食还是带走","tip小费文化：15-20%"],"A2","restaurant"),
  F("fn-shopping","Shopping & Checkout","购物结账","Do you have this in medium? / Can I pay by card? / Receipt, please.","购物试穿付款句式。",[["Do you have this in a smaller size?","有小一号的吗？"],["Paper or plastic?","要纸袋还是塑料袋？"]],[["学习要点","结合例句与中文对照记忆"]],"A2","shopping"),
  F("fn-directions","Asking & Giving Directions","问路与指路","Excuse me, how do I get to...? / Go straight / Turn left at...","问路指路句型。",[["How do I get to the subway station?","地铁站在哪怎么走？"],["Go two blocks and turn right.","过两个路口右转。"]],["block=两个红绿灯之间的路段"],"A2","direction"),
  F("fn-doctor-visit","At the Doctor","看医生","I have a fever/sore throat. / How long have you had these symptoms?","就医描述症状。",[["I've had a headache for two days.","我头疼两天了。"],["Are you allergic to any medication?","你对什么药过敏吗？"]],[["学习要点","结合例句与中文对照记忆"]],"B1","health"),
  F("fn-airport-travel","Airport English","机场英语","Check-in counter / boarding pass / gate B12 / delayed flight.","机场全流程词汇。",[["Where is gate C5?","C5登机口在哪？"],["My flight was delayed.","我的航班延误了。"]],[["学习要点","结合例句与中文对照记忆"]],"A2","travel"),
  F("fn-hotel","Hotel English","酒店英语","I have a reservation under... / Check-out time? / The AC isn't working.","入住退房报修句式。",[["I have a reservation under Wang.","我用王姓订了房。"],["Could you send someone up? Room 302.","能派人来302房吗？"]],[["学习要点","结合例句与中文对照记忆"]],"A2","hotel"),
  F("fn-banking","Banking English","银行英语","Open an account / deposit / withdraw / exchange rate.","银行开户存取汇兑。",[["I'd like to open a checking account.","我想开个活期账户。"],["What's the exchange rate today?","今天汇率多少？"]],[["学习要点","结合例句与中文对照记忆"]],"B1","bank"),
  F("fn-emergency","Emergency English","紧急情况","Call 911! / There's been an accident. / Help! Fire!","美国报警急救911。",[["Call 911 — there's been an accident.","快打911，出事故了。"],["I need help. My friend collapsed.","救命，我朋友晕倒了。"]],["911=警察/火警/救护车统一号码"],"A2","emergency"),
  F("fn-apologize-levels","Apology Levels","道歉的层级","Sorry (casual) → I'm so sorry → I apologize (formal) → I owe you an apology.","道歉从随意到正式的表达梯度。",[["My bad! (very casual)","我的错！（很随意）"],["Please accept my sincere apologies.","请接受我诚挚的歉意。"]],[["学习要点","结合例句与中文对照记忆"]],"B1","apology"),
  F("fn-thanks-levels","Gratitude Levels","感谢的层级","Thanks → Thank you so much → I really appreciate it → I'm grateful.","感谢表达由轻到重。",[["I can't thank you enough.","感激不尽。"],["I really appreciate your help.","非常感谢你的帮助。"],["You're welcome. / No problem. / Anytime.","不客气的几种说法。"]],[["学习要点","结合例句与中文对照记忆"]],"A2","gratitude"),
  F("fn-invite-decline","Inviting & Declining","邀请与婉拒","Want to grab lunch? / I'd love to, but... / Rain check?","发出与拒绝邀请。",[["Wanna grab a coffee?","去喝杯咖啡吗？"],["I'd love to, but I'm swamped.","我很想去，但实在忙不过来。"]],[["学习要点","结合例句与中文对照记忆"]],"A2","social"),
  F("fn-compliment","Giving Compliments","称赞","Love your...! / You did a great job on... / That looks amazing.","自然地赞美他人。",[["Nice job on the presentation!","演示做得很棒！"],["That color looks great on you.","这颜色很衬你。"]],[["学习要点","结合例句与中文对照记忆"]],"A2","social"),
  F("fn-request-polite-scale","Request Politeness Scale","请求礼貌层级","Can you...? → Could you...? → Would you mind -ing? → I was wondering if you could...","请求从直接到委婉。",[["Would you mind closing the window?","麻烦关下窗好吗？"],["I was wondering if you could help me.","不知能否请您帮个忙？"]],["Would you mind + 动名词","Not at all = 不介意(回答)"],"B1","polite"),
  F("fn-interrupt","Interrupting Politely","礼貌插话","Sorry to interrupt... / Can I jump in? / Just to add...","插话缓冲语。",[["Sorry to cut in, but...","抱歉打断一下……"],["Before you move on, can I add something?","继续之前我能补充吗？"]],[["学习要点","结合例句与中文对照记忆"]],"B1","conversation"),
  F("fn-disagree-softly","Softening Disagreement","委婉反对","I see it differently / That's one way to look at it, but...","缓和不同意见。",[["I'm not sure I agree. Have you considered...?","我不太同意。你考虑过……吗？"]],[["学习要点","结合例句与中文对照记忆"]],"B2","debate"),
  F("fn-express-emotion","Expressing Emotions Gradation","情感表达的强度","I like it < I love it < I'm crazy about it < It's my obsession.","同一情感的强弱阶梯。",[["I adore this song!","这首歌我爱极了！"],["I'm thrilled about the news!","听到消息我激动坏了！"]],[["学习要点","结合例句与中文对照记忆"]],"B1","emotion"),
  F("fn-telling-time","Telling Time (American Style)","美式时间表达","It's quarter past five / half past noon / ten to nine / 5:15 AM vs PM.","美式时间口语读法。",[["7:45 = quarter to eight","7点45分=差一刻八点"],["9 PM ≠ 9 AM（晚上9点≠上午9点）","区分早晚九点"]],[["学习要点","结合例句与中文对照记忆"]],"A1","time"),
  F("fn-dates-us-format","US Date Format","美式日期格式","Month Day, Year = July 4th, 2026; written as 07/04/2026.","美式月日在前。",[["03/05 = March 5th in the US","美式中03/05是3月5日"],["The Fourth of July = Independence Day","7月4日=独立日"]],[["学习要点","结合例句与中文对照记忆"]],"A2","culture"),
  F("fn-measurements-us","US Measurements","美制单位","miles, feet/inches, pounds, Fahrenheit, gallons.","美国不用公制的常见换算概念。",[["Speed limit: 65 mph ≈ 105 km/h","限速65英里≈105公里"],["72°F ≈ 22°C 感觉舒适","温度对照示例"]],[["学习要点","结合例句与中文对照记忆"]],"A2","culture"),
  F("fn-tipping-culture","Tipping Culture","小费文化","Restaurants 15-20%, taxi ~15%, hotel staff $1-5.","哪些场合给多少小费。",[],["账单不含小费","外卖/咖啡店可选"],"B1","culture"),
  F("fn-small-talk-safe","Safe Small Talk Topics","安全闲聊话题","Weather, sports, weekend, food, shows. Avoid: salary, age, politics, weight.","美式闲聊安全区与雷区。",[["Crazy weather lately, huh?","最近天气真怪，是吧？"]],[["学习要点","结合例句与中文对照记忆"]],"A2","social"),
  F("fn-slang-common","Common American Slang","高频美式俚语","cool, awesome, hang out, no worries, what's up?","日常俚语入门包。",[["Let's hang out sometime.","改天一起玩啊。"],["What's up? = 你好/怎么了","万能打招呼"]],[["学习要点","结合例句与中文对照记忆"]],"A2","slang"),
  F("fn-texting-shorthand","Texting Language","短信用语","u=you, brb, omg, ttyl, k","短信聊天缩写速查。",[["brb = be right back 马上回来"],["ttyl = talk to you later 回头聊"]],[["学习要点","结合例句与中文对照记忆"]],"A2","texting"),
  F("fn-am-vs-bre-spell","American vs British Spelling","美式英式拼写","color/colour, center/centre, organize/organise, traveler/traveller.","美式拼写简化规律：-or/-er/-ize。",[["favorite (US) = favourite (UK)","最爱的两种拼法"]],[["学习要点","结合例句与中文对照记忆"]],"B1","spelling"),
  F("fn-am-vs-bre-vocab","AmE vs BrE Vocabulary","美英词汇差异","elevator/lift, apartment/flat, truck/lorry, fall/autumn, gas/petrol.","高频同义异词清单。",[["subway (US) = underground/tube (UK)","地铁的不同叫法"],["soccer (US) = football (UK)","足球的说法差异"]],[["学习要点","结合例句与中文对照记忆"]],"B1","vocabulary"),
  F("fn-address-formally","Addressing People","如何称呼别人","First name (friendly) / Mr./Ms.+姓 (formal) / sir/ma'am (service).","称呼的分寸感。",[["Dear Mr. Johnson (formal letter)","正式信件称呼"],["Just call me Mike. (informal invitation)","叫我迈克就行。（拉近距离）"]],[["学习要点","结合例句与中文对照记忆"]],"A2","culture"),
  F("fn-making-plans","Making Plans","约安排","Are you free on...? / How about Saturday? / Let's say 7? / Works for me.","约定时间地点流程句。",[["Does Saturday work for you?","周六你方便吗？"],["Let's play it by ear.","到时看情况吧。"]],[["学习要点","结合例句与中文对照记忆"]],"A2","plan"),
  F("fn-cancel-reschedule","Canceling & Rescheduling","取消与改期","Something came up / Can we reschedule? / Is next week OK?","临时变卦的标准话术。",[["Something urgent came up.","突然有急事。"],["Can we push our meeting to Thursday?","会议推到周四行吗？"]],[["学习要点","结合例句与中文对照记忆"]],"B1","plan"),
];
