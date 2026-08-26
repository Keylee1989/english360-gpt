/**
 * Grammar Batch 11 — Writing, Punctuation, Academic & Business English (55 rules)
 */

import type { GrammarRule } from "./grammar-kb";

const W = (
  id: string, title: string, titleChinese: string, explanation: string, explanationChinese: string,
  ex: any[], tips: any, level: "A1"|"A2"|"B1"|"B2"|"C1"|"C2", cat: string
): GrammarRule => ({
  id, category: cat === "punc" ? "Punctuation & Mechanics" : cat === "biz" ? "Business English" : "Academic & Writing",
  categoryChinese: cat === "punc" ? "标点与规范" : cat === "biz" ? "商务英语" : "学术与写作",
  title, titleChinese, explanation, explanationChinese,
  examples: (ex as any[]).map((e: any) => Array.isArray(e) ? { correct: String(e[0] ?? ""), chinese: String(e[1] ?? "") } : { correct: String(e), chinese: "" }),
  tips: (Array.isArray(tips) ? tips : [tips]).map((t: any) => Array.isArray(t) ? String(t[0]) : String(t)), level, tags: [cat],
});

export const BATCH11_GRAMMAR_RULES: GrammarRule[] = [
  W("punc-comma-basic","Comma Basics","逗号基本用法","Use commas to separate items, after intro phrases, and around non-essential info.","逗号用于并列项、句首状语后、插入成分两侧。",[["I bought apples, bananas, and oranges.","我买了苹果、香蕉和橙子。"],["After the meeting, we had lunch.","会后我们吃了午饭。"]],["牛津逗号(Oxford comma)美式推荐","句首状语后加逗号"],"A2","punc"),
  W("punc-semicolon","Semicolon Usage","分号用法","Join two related independent clauses or separate complex lists.","连接两个紧密相关的完整句，或分隔复杂列表。",[["I studied hard; I passed easily.","我努力学习；轻松通过了。"],["We visited Paris, France; Rome, Italy; and Madrid, Spain.","我们去了法国巴黎、意大利罗马和西班牙马德里。"]],[["学习要点","结合例句与中文对照记忆"]],"B2","punc"),
  W("punc-colon","Colon Usage","冒号用法","Introduce lists, explanations, or quotations after complete sentence.","用于完整句后引出列表、解释或引用。",[["You need three things: patience, time, and practice.","你需要三样东西：耐心、时间和练习。"]],[["学习要点","结合例句与中文对照记忆"]],"B2","punc"),
  W("punc-apostrophe","Apostrophes: Possession & Contraction","撇号：所有格与缩写","'s = possessive/contraction; s' for plural possessive; its vs it's.","'s表所有或缩写；复数所有格s'；its无撇号。",[["the dog's bone / the dogs' bones","狗的骨头/多只狗的骨头"],["James's car 或 James' car（两种都可）","James的车"]],[["学习要点","结合例句与中文对照记忆"]],"A2","punc"),
  W("punc-quotation","Quotation Marks (American Style)","引号美式规范","Periods and commas go INSIDE quotation marks in American English.","美式英语中句号逗号放引号内。",[["He said, \"I'll be late,\" and left.","他说：“我会迟到”，然后离开了。"],["\"Stop!\" she shouted.","“住手！”她喊道。"]],["英式相反（外置）","引语+said位置灵活"],"B1","punc"),
  W("punc-capitalization","Capitalization Rules","大写规则","Capitalize: sentence starts, proper nouns, days/months, 'I', titles with names.","句首、专有名词、星期月份、I、头衔要大写。",[["Monday is different from monday.","Monday必须大写"],["President Lincoln spoke to Congress.","林肯总统对国会讲话。"]],["季节不大写：summer","语言国籍大写：Chinese"],"A1","punc"),
  W("punc-hyphen-dash","Hyphen vs Dash","连字符与破折号","hyphen (-) joins words; em dash (—) marks interruption/emphasis.","hyphen连复合词；em dash表中断或强调。",[["a well-known author","知名作者"],["She was late — very late.","她迟到了——迟得离谱。"]],[["学习要点","结合例句与中文对照记忆"]],"B2","punc"),
  W("punc-question-exclamation","Question & Exclamation Marks","问号与感叹号","? ends direct questions; ! shows strong emotion (use sparingly in writing).","?结束疑问句；!表强烈情感，正式写作少用。",[],["间接疑问用句号：He asked where I lived."],"A1","punc"),
  W("wr-paragraph-topic-sentence","Paragraph Structure","段落结构","Topic sentence → supporting sentences → concluding sentence.","段落=主题句+支撑句+结论句。",[["(Topic) Dogs make great pets. (Support) They are loyal...","主题句+展开的写法示范。"]],[["学习要点","结合例句与中文对照记忆"]],"B1","writing"),
  W("wr-linking-devices","Cohesive Devices","衔接手段","pronouns (this/that/these/those), synonyms, repetition of key terms.","代词回指、近义词替换、关键词重复让文章连贯。",[["Pollution harms health. This problem requires action.","污染危害健康。这一问题需要行动。"]],[["学习要点","结合例句与中文对照记忆"]],"B2","writing"),
  W("wr-formal-email","Formal Email Format","正式邮件格式","Dear Mr./Ms. X → opening purpose → details → closing (Yours sincerely).","正式邮件结构：称呼→目的→详情→落款。",[["Dear Ms. Chen,\n\nI am writing to inquire about...\n\nYours sincerely,","正式邮件模板"]],["Yours faithfully=不知姓名时","Best regards=半正式通用"],"B1","writing"),
  W("wr-informal-message","Informal Messages & Texting","非正式消息与短信缩写","btw, asap, thx, lol, gonna, wanna.","常见口语缩略与网络用语。",[["Gonna = going to; wanna = want to; gotta = got to","gonna/wanna/gotta含义"],["ASAP = as soon as possible","尽快"],["BTW = by the way","顺便说一下"]],[["学习要点","结合例句与中文对照记忆"]],"A2","writing"),
  W("wr-narrative-tense","Narrative Tenses","叙事时态组合","Past simple for events, past continuous for background, past perfect for earlier events.","一般过去时推进情节；过去进行时铺垫背景；过去完成时倒叙。",[["The sun was setting. We had finished work, so we went home.","夕阳西下。我们干完了活，便回家了。"]],[["学习要点","结合例句与中文对照记忆"]],"B1","writing"),
  W("wr-descriptive-order","Descriptive Writing Order","描写顺序","General → specific; outside → inside; top → bottom.","由总到分、由外到内、由上到下组织描写。",[],["空间顺序词：next to / above / beyond"],"B1","writing"),
  W("wr-opinion-essay","Opinion Essay Structure","观点文结构","Introduction + thesis → body paragraphs (reason + example) → conclusion.","观点文=引言论点+论证段+结论。",[],["每段一个中心思想","Firstly / Moreover / In conclusion"],"B2","writing"),
  W("wr-for-and-against","For and Against Essay","正反论证文","Present both sides then your balanced view.","先列双方观点再给平衡结论。",[["On the one hand... On the other hand...","一方面……另一方面……"]],[["学习要点","结合例句与中文对照记忆"]],"B2","writing"),
  W("wr-hedging","Hedging Language (Academic)","学术模糊限制语","may, might, tend to, it appears that, arguably soften claims.","学术写作用模糊词避免绝对化。",[["Results suggest that exercise may improve mood.","结果表明锻炼或有助改善情绪。"]],[["学习要点","结合例句与中文对照记忆"]],"C1","academic"),
  W("wr-nominalization","Nominalization","名词化表达","Turn verbs into nouns for formal writing: decide → decision.","动词转名词使行文正式凝练。",[["They decided quickly → The quick decision...","他们很快决定 → 快速的决定"]],[["学习要点","结合例句与中文对照记忆"]],"C1","academic"),
  W("wr-passive-academic","Passive Voice in Academic Writing","学术被动语态","Passive emphasizes process over person: The samples were analyzed.","被动突出研究过程而非研究者。",[["The data were collected over six months.","数据在六个月内收集完成。"]],[["学习要点","结合例句与中文对照记忆"]],"C1","academic"),
  W("wr-paraphrase-cite","Paraphrasing & Avoiding Plagiarism","改写与引用","Change words AND structure; cite sources even when paraphrased.","改写需换词换序且注明出处。",[["Original: Fast food causes obesity.\nParaphrase: Obesity has been linked to fast-food consumption.","改写示例"]],[["学习要点","结合例句与中文对照记忆"]],"C1","academic"),
  W("wr-summary-skills","Summarizing","摘要技巧","Main idea only; no examples/opinions; much shorter than original.","只留主旨删细节，篇幅远小于原文。",[],["1/3以内长度","用自己的话"],"B2","academic"),
  W("biz-meeting-language","Meeting Phrases","会议用语","Let's get started / moving on / to sum up / does anyone have any questions?","高频会议流程用语。",[["Let's get started.","我们开始吧。"],["Moving on to the next item.","进入下一项。"],["To sum up, ...","总结一下……"]],[["学习要点","结合例句与中文对照记忆"]],"B1","biz"),
  W("biz-phone-call","Phone Call English","电话英语","This is X speaking / Could you hold on? / Sorry, could you repeat that?","电话沟通标准句式。",[["Hello, this is John speaking.","你好，我是约翰。"],["Could you hold on a moment, please?","请稍等一下好吗？"]],["电话中用this is而非I am"],"A2","biz"),
  W("biz-application-letter","Cover Letter Language","求职信语言","I am writing to apply for... / My experience includes... / I look forward to hearing from you.","求职信三段式标准句。",[["I am writing to apply for the position of...","我写信应聘……职位。"]],[["学习要点","结合例句与中文对照记忆"]],"B2","biz"),
  W("biz-interview-star","Interview STAR Method","面试STAR法","Situation, Task, Action, Result — structure behavioral answers.","行为面试题按情境任务行动结果作答。",[],["量化结果最有说服力"],"B2","biz"),
  W("biz-negotiation","Negotiation Language","谈判用语","Would you consider...? / That's a bit steep / Let's meet halfway.","商务谈判委婉表达。",[["That's slightly above our budget.","这略超我们的预算了。"],["Let's meet halfway at $50.","各让一步，50美元成交。"]],[["学习要点","结合例句与中文对照记忆"]],"C1","biz"),
  W("biz-presentation-signposts","Presentation Signposting","演讲路标语","Today I'll cover... / Let's move on / To conclude...","演讲结构提示语。",[["My talk is in three parts. First,... Second,... Finally,...","演讲分三部分的路标句"]],[["学习要点","结合例句与中文对照记忆"]],"B2","biz"),
  W("biz-small-talk-office","Office Small Talk","办公室闲聊","How was your weekend? / Did you see the game? / Busy day?","职场破冰闲聊话题与句式。",[["Morning! How was your weekend?","早！周末过得怎么样？"]],[["学习要点","结合例句与中文对照记忆"]],"A2","biz"),
  W("biz-resume-action-verbs","Resume Action Verbs","简历动作动词","led, managed, developed, increased, launched + numbers.","简历用强动词+数字成果。",[["Increased sales by 30%","销售额提升30%"],["Led a team of 10","带领10人团队"]],[["学习要点","结合例句与中文对照记忆"]],"B2","biz"),
];
