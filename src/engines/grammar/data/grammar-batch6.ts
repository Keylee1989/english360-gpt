/**
 * Grammar Rules Batch 6 — Final 15 rules to reach 200+
 */

import type { GrammarRule } from "./grammar-kb";

const PHRASAL_VERBS_FINAL: GrammarRule[] = [
  { id: "phrasal-give", category: "Phrasal Verbs", categoryChinese: "短语动词", title: "Give Phrasal Verbs", titleChinese: "Give短语动词", explanation: "Give up = quit. Give in = surrender. Give away = reveal/free. Give out = distribute/exhaust.", explanationChinese: "give up=放弃。give in=屈服。give away=泄露/白送。give out=分发/耗尽。", examples: [{ correct: "Don't give up! You're almost there.", chinese: "不要放弃！你快到了。" }, { correct: "She gave away all her old clothes.", chinese: "她把所有旧衣服都送人了。" }], tips: ["give up = 放弃", "give in = 屈服/让步", "give away = 泄露/赠送", "give out = 分发/耗尽"], level: "B1", tags: ["phrasal verb", "give"] },
  { id: "phrasal-hold", category: "Phrasal Verbs", categoryChinese: "短语动词", title: "Hold Phrasal Verbs", titleChinese: "Hold短语动词", explanation: "Hold on = wait. Hold up = delay/rob. Hold out = last. Hold back = restrain.", explanationChinese: "hold on=等一下。hold up=延迟/抢劫。hold out=坚持。hold back=抑制。", examples: [{ correct: "Hold on, I'm coming!", chinese: "等一下，我马上来！" }, { correct: "The project was held up by bad weather.", chinese: "项目因恶劣天气而延迟。" }], tips: ["hold on = 等一下", "hold up = 延迟/抢劫", "hold out = 坚持/伸出", "hold back = 抑制/隐瞒"], level: "B1", tags: ["phrasal verb", "hold"] },
  { id: "phrasal-work", category: "Phrasal Verbs", categoryChinese: "短语动词", title: "Work Phrasal Verbs", titleChinese: "Work短语动词", explanation: "Work out = exercise/solve. Work on = improve. Work toward = aim for.", explanationChinese: "work out=锻炼/解决。work on=改进。work toward=朝...努力。", examples: [{ correct: "I work out three times a week.", chinese: "我每周锻炼三次。" }, { correct: "We need to work on our communication.", chinese: "我们需要改善沟通。" }], tips: ["work out = 锻炼/解决/计算", "work on = 从事/改进", "work toward = 朝着...努力"], level: "A2", tags: ["phrasal verb", "work"] },
];

const VERB_PATTERNS: GrammarRule[] = [
  { id: "verb-gerund-infinitive", category: "Verb Patterns", categoryChinese: "动词模式", title: "Gerund vs Infinitive after Verbs", titleChinese: "动词后接动名词vs不定式", explanation: "Some verbs take -ing (enjoy, avoid, finish), some take to (want, decide, hope), some both with different meanings (stop, remember).", explanationChinese: "一些动词后接-ing(enjoy, avoid)，一些接to(want, decide)，一些两者都可但含义不同(stop, remember)。", examples: [{ correct: "I enjoy reading.", chinese: "我喜欢阅读。(后接-ing)" }, { correct: "I want to learn.", chinese: "我想学习。(后接to do)" }, { correct: "I stopped smoking.", chinese: "我戒烟了。(stop doing=停止)" }, { correct: "I stopped to smoke.", chinese: "我停下来去抽烟。(stop to do=停下来去做)" }], tips: ["enjoy, finish, avoid, mind, suggest + 动名词", "want, decide, hope, plan, agree + 不定式", "stop/remember/forget + 两者都可，含义不同"], level: "A2", tags: ["verb pattern", "gerund", "infinitive"] },
  { id: "verb-transitive-intransitive", category: "Verb Patterns", categoryChinese: "动词模式", title: "Transitive vs Intransitive Verbs", titleChinese: "及物动词vs不及物动词", explanation: "Transitive = needs object (I like coffee). Intransitive = no object needed (She arrived).", explanationChinese: "及物动词需要宾语(I like coffee)。不及物动词不需要(She arrived)。", examples: [{ correct: "She arrived (intransitive).", chinese: "她到了。(不需要宾语)" }, { correct: "He bought a car (transitive).", chinese: "他买了一辆车。(需要宾语)" }], tips: ["不及物动词不能直接接宾语", "需要介词连接：arrive at/in, listen to", "许多动词两种用法都有：eat(吃) / eat lunch(吃午饭)"], level: "A2", tags: ["verb", "transitive", "intransitive"] },
];

const SENTENCE_TYPES: GrammarRule[] = [
  { id: "type-simple", category: "Sentence Types", categoryChinese: "句子类型", title: "Simple vs Compound vs Complex", titleChinese: "简单句/并列句/复合句", explanation: "Simple: one clause. Compound: two independent clauses joined by FANBOYS. Complex: independent + dependent clause.", explanationChinese: "简单句：一个分句。并列句：两个独立分句用FANBOYS连接。复合句：独立+从属分句。", examples: [{ correct: "She sings. (Simple)", chinese: "她唱歌。(简单句)" }, { correct: "She sings and dances. (Compound)", chinese: "她唱歌和跳舞。(并列句)" }, { correct: "When she sings, everyone smiles. (Complex)", chinese: "当她唱歌时，大家都笑了。(复合句)" }], tips: ["简单句：一个主谓结构", "并列句：FANBOYS连接两个完整句子", "复合句：主句+从句(when/if/because等引导)"], level: "B1", tags: ["sentence", "simple", "compound", "complex"] },
];

const REGISTER_STYLE: GrammarRule[] = [
  { id: "register-formal", category: "Register & Style", categoryChinese: "语域与语体", title: "Formal vs Informal English", titleChinese: "正式vs非正式英语", explanation: "Formal: use, therefore, moreover. Informal: use, so, also. Contractions informal only.", explanationChinese: "正式：use, therefore, moreover。非正式：use, so, also。缩写只用于非正式。", examples: [{ correct: "I would like to inquire about... (formal)", chinese: "我想询问关于...(正式)" }, { correct: "I want to ask about... (informal)", chinese: "我想问问关于...(非正式)" }, { correct: "Furthermore, we must consider... (formal)", chinese: "此外，我们必须考虑...(正式)" }], tips: ["正式：Furthermore, Moreover, Therefore, Hence", "非正式：Also, So, And, But", "缩写只在口语和非正式写作中使用"], level: "B2", tags: ["register", "formal", "informal", "style"] },
];

const EXTRA_RULES: GrammarRule[] = [
  { id: "phrasal-set", category: "Phrasal Verbs", categoryChinese: "短语动词", title: "Set Phrasal Verbs", titleChinese: "Set短语动词", explanation: "Set up = establish. Set off = begin journey. Set back = delay. Set aside = reserve.", explanationChinese: "set up=建立。set off=出发。set back=推迟。set aside=留出。", examples: [{ correct: "We set off early in the morning.", chinese: "我们一大早就出发了。" }, { correct: "Set aside some money for emergencies.", chinese: "留些钱以备不时之需。" }], tips: ["set up = 建立/设置", "set off = 出发/引爆", "set back = 推迟", "set aside = 留出/储存"], level: "B1", tags: ["phrasal verb", "set"] },
  { id: "verb-wish-ifonly", category: "Verb Patterns", categoryChinese: "动词模式", title: "Wish / If Only", titleChinese: "Wish与If Only", explanation: "Wish + past tense = present regret. Wish + past perfect = past regret. Wish + would = future complaint.", explanationChinese: "wish+过去时=对现在的遗憾。wish+过去完成时=对过去的遗憾。wish+would=对未来的抱怨。", examples: [{ correct: "I wish I had more time.", chinese: "我希望我有更多时间（现在没有）。" }, { correct: "I wish I had studied harder.", chinese: "我希望我当时更努力学习（过去遗憾）。" }, { correct: "I wish it would stop raining.", chinese: "我希望雨能停下来（将来愿望）。" }], tips: ["wish + 过去时 = 对现在的遗憾", "wish + had done = 对过去的遗憾", "wish + would = 对未来的愿望/抱怨", "if only = 更强烈的wish"], level: "B2", tags: ["verb pattern", "wish", "if only", "subjunctive"] },
  { id: "comm-refusing", category: "Communication Advanced", categoryChinese: "高级交际", title: "Refusing Politely", titleChinese: "礼貌拒绝", explanation: "How to say no without being rude.", explanationChinese: "如何不粗鲁地说不。", examples: [{ correct: "I appreciate the offer, but I can't.", chinese: "感谢提议，但我不能。" }, { correct: "That sounds great, but I'm afraid I'm busy.", chinese: "听起来不错，但恐怕我很忙。" }, { correct: "I'd love to, but unfortunately...", chinese: "我很想去，但不幸的是..." }], tips: ["I appreciate..., but... (感谢+拒绝)", "I'd love to, but... (委婉拒绝)", "I'm afraid I can't... (正式拒绝)"], level: "B1", tags: ["communication", "refuse", "polite", "no"] },
  { id: "type-cleft-sentences", category: "Sentence Types", categoryChinese: "句子类型", title: "Existential Sentences (There be)", titleChinese: "存在句型", explanation: "There + be + noun + place. Be agrees with the noun after it.", explanationChinese: "There + be + 名词 + 地点。be动词与后面的名词一致。", examples: [{ correct: "There is a book on the table.", chinese: "桌子上有一本书。" }, { correct: "There are many people here.", chinese: "这里有很多人。" }, { correct: "There was an accident yesterday.", chinese: "昨天发生了一起事故。" }], tips: ["There is + 单数/不可数名词", "There are + 复数名词", "There was/were + 过去式", "疑问句：Is/Are there...?"], level: "A1", tags: ["sentence", "there be", "existence"] },
];

export const BATCH6_GRAMMAR_RULES: GrammarRule[] = [
  ...PHRASAL_VERBS_FINAL,
  ...VERB_PATTERNS,
  ...SENTENCE_TYPES,
  ...REGISTER_STYLE,
  ...EXTRA_RULES,
];

export const BATCH6_STATS = {
  total: BATCH6_GRAMMAR_RULES.length,
};
