/**
 * Vocabulary Generator v2
 * 为每个词确定性地生成完整学习数据：
 * - 谐音注音（基于 IPA 音标逐符号映射）
 * - 自然拼读拆解（元音组合/魔法e/r控制/字母组合/哑音）
 * - 词根·前缀·后缀 + 词源解释（结构化 + 中文说明）
 * - 联想记忆 / 对比记忆（反义+易混）/ 故事串联（8种场景）
 * - 用法说明（按词性给出句型和变化规则）
 * - 搭配（高频词人工词典 ~260 条 + 词性通用模式）
 * - 例句（按词性模板池 + 词哈希选取，避免千篇一律）
 */

import type { VocabularyItem } from "../index";
import type { PartOfSpeech } from "@/types";

export interface CompactWord {
  w: string;
  ipa: string;
  zh: string;
  pos: string;
  dif: string;
  ex: string;
  exzh: string;
  mem?: string;
  syn?: string;
  ant?: string;
}

const POS_MAP: Record<string, PartOfSpeech[]> = {
  n: ["noun"], v: ["verb"], adj: ["adjective"], adv: ["adverb"],
  prep: ["preposition"], conj: ["conjunction"], pron: ["pronoun"],
  det: ["determiner"], interj: ["interjection"], num: ["noun"],
  aux: ["verb"], phr: ["noun"], vt: ["verb"], vi: ["verb"], vtvi: ["verb"],
};

const DIFF_MAP: Record<string, VocabularyItem["difficulty"]> = {
  ve: "very_easy", e: "easy", m: "medium", h: "hard", vh: "very_hard",
};

const CEFR_MAP: Record<string, VocabularyItem["cefr"]> = {
  ve: "A1", e: "A1", m: "A2", h: "B1", vh: "B2",
};

// ============================================================
// 确定性哈希（保证每次加载结果一致，不再随机）
// ============================================================

function hashStr(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function pick<T>(arr: T[], seed: string): T {
  return arr[hashStr(seed) % arr.length];
}

/** 取第一个中文释义（去掉分号/逗号后的次要义项） */
function primaryZh(zh: string): string {
  return zh.split(/[；;，,]/)[0].trim() || zh;
}

// ============================================================
// 高频词表（用于频率排序）
// ============================================================

const HIGH_FREQ: string[] = [
  "the","be","to","of","and","a","in","that","have","i","it","for","not","on",
  "with","he","as","you","do","at","this","but","his","by","from","they","we",
  "say","her","she","or","an","will","my","one","all","would","there","their",
  "what","so","up","out","if","about","who","get","which","go","me","when",
  "make","can","like","time","no","just","him","know","take","people","into",
  "year","your","good","some","could","them","see","other","than","then",
  "now","look","only","come","its","over","think","also","back","after","use",
  "two","how","our","work","first","well","way","even","new","want","because",
  "any","these","give","day","most","us",
];

function getFrequencyRank(word: string, difficulty: VocabularyItem["difficulty"]): number {
  const idx = HIGH_FREQ.indexOf(word.toLowerCase());
  if (idx >= 0) return idx + 1;
  const base: Record<VocabularyItem["difficulty"], number> = {
    very_easy: 500, easy: 1500, medium: 3500, hard: 8000, very_hard: 15000,
  };
  return base[difficulty] + (hashStr(word) % 3000);
}

// ============================================================
// 1. 谐音注音 —— 基于 IPA 音标逐符号映射
// ============================================================

const IPA_HOMOPHONES: Array<[string, string]> = [
  // 双字符优先
  ["iː", "伊"], ["uː", "乌"], ["ɑː", "阿"], ["ɔː", "哦"], ["ɜː", "呃儿"],
  ["eɪ", "诶"], ["aɪ", "爱"], ["ɔɪ", "欧伊"], ["aʊ", "傲"], ["əʊ", "欧"], ["oʊ", "欧"],
  ["ɪə", "伊尔"], ["eə", "艾尔"], ["ʊə", "乌尔"],
  ["tʃ", "奇"], ["dʒ", "吉"], ["tr", "戳"], ["dr", "捉"], ["ts", "茨"], ["dz", "兹"],
  // 单字符
  ["ɪ", "衣"], ["e", "艾"], ["æ", "哎"], ["ɑ", "阿"], ["ɒ", "奥"], ["ɔ", "奥"],
  ["ʊ", "乌"], ["u", "乌"], ["ʌ", "阿"], ["ə", "呃"], ["ɜ", "呃"], ["i", "衣"], ["u", "乌"],
  ["p", "普"], ["b", "布"], ["t", "特"], ["d", "德"], ["k", "克"], ["g", "格"],
  ["f", "弗"], ["v", "维"], ["s", "斯"], ["z", "兹"], ["ʃ", "什"], ["ʒ", "日"],
  ["θ", "斯咬舌"], ["ð", "德咬舌"], ["h", "赫"], ["m", "姆"], ["n", "恩"], ["ŋ", "恩"],
  ["l", "勒"], ["r", "若"], ["j", "耶"], ["w", "沃"], ["æ", "哎"],
];

function ipaToHomophone(ipa: string): string | null {
  let s = ipa.replace(/[/\[\]ˈˌˌ.·]/g, "").trim();
  if (!s || !/[a-zæʃʒθðŋɔʊɪʌə]/i.test(s)) return null;
  const out: string[] = [];
  let i = 0;
  while (i < s.length && out.length < 7) {
    const two = s.slice(i, i + 2);
    const hit2 = IPA_HOMOPHONES.find(([sym]) => sym === two);
    if (hit2) { out.push(hit2[1]); i += 2; continue; }
    const one = s.slice(i, i + 1);
    const hit1 = IPA_HOMOPHONES.find(([sym]) => sym === one);
    if (hit1) { out.push(hit1[1]); i += 1; continue; }
    i += 1; // 未知符号（如 ː 已清除）跳过
  }
  const joined = out.join("");
  return joined.length >= 1 ? joined : null;
}

/** 字母近似注音（无 IPA 时兜底） */
function letterHomophone(w: string): string {
  const map: Record<string, string> = {
    a: "诶", e: "衣", i: "爱", o: "欧", u: "尤", y: "依",
    b: "布", c: "克", d: "德", f: "弗", g: "格", h: "赫", j: "杰", k: "克",
    l: "勒", m: "姆", n: "恩", p: "普", q: "奎", r: "若", s: "斯", t: "特",
    v: "维", w: "沃", x: "克斯", z: "兹",
  };
  return w.slice(0, 8).split("").map((c) => map[c] ?? "").join("") || w;
}

// ============================================================
// 2. 自然拼读拆解
// ============================================================

interface PhonicsRule { re: RegExp; note: (m: RegExpMatchArray) => string }

const PHONICS_RULES: PhonicsRule[] = [
  { re: /tion$/, note: () => "-tion 组合固定发 /ʃən/（“什”）" },
  { re: /sion$/, note: () => "-sion 组合发 /ʃən/ 或 /ʒən/" },
  { re: /ture$/, note: () => "-ture 组合发 /tʃər/（“彻”）" },
  { re: /ough/, note: () => "-ough 组合发音多变，需整体记（如 though/through/throughout 各不同）" },
  { re: /augh|eigh/, note: () => "-augh/-eigh 组合常发长音（如 laugh /æ/、eight /eɪ/）" },
  { re: /^kn/, note: () => "词首 k 不发音，kn- 只读 /n/" },
  { re: /^wr/, note: () => "词首 w 不发音，wr- 只读 /r/" },
  { re: /^gn/, note: () => "词首 g 不发音，gn- 只读 /n/" },
  { re: /mb$/, note: () => "词尾 b 不发音（climb、thumb）" },
  { re: /lk$/, note: () => "许多词中 l 不发音（walk、talk）" },
  { re: /(ee)/, note: () => "ee 组合发长音 /iː/（像“伊”）" },
  { re: /(ea)(?!r)/, note: () => "ea 组合多发 /iː/（eat）或 /e/（bread），需记单词" },
  { re: /(oo)(?!k|r)/, note: () => "oo 组合多发 /uː/（food）或短音 /ʊ/（book）" },
  { re: /(ai)|(ay)$/, note: () => "ai/ay 组合发 /eɪ/（字母 a 的名字音）" },
  { re: /(oa)/, note: () => "oa 组合发 /əʊ/（“欧”）" },
  { re: /(ow)/, note: () => "ow 组合发 /aʊ/（now）或 /əʊ/（know）两种读音" },
  { re: /(ou)/, note: () => "ou 组合多发 /aʊ/（house）" },
  { re: /(ie)/, note: () => "ie 组合发 /aɪ/（lie）或 /iː/（field）" },
  { re: /(igh)/, note: () => "igh 组合发 /aɪ/，gh 不发音（light、high）" },
  { re: /(oi)|(oy)$/, note: () => "oi/oy 组合发 /ɔɪ/（“欧伊”）" },
  { re: /([aeiou])r/, note: (m) => `r 控制元音：${m[1]}r 组合发卷舌音（美式特征，如 car /kɑːr/）` },
  { re: /(th)/, note: () => "th 组合咬舌发 /θ/ 或 /ð/，不要读成 s/z" },
  { re: /(sh)/, note: () => "sh 组合发 /ʃ/（像“什”）" },
  { re: /(ch)/, note: () => "ch 组合多发 /tʃ/（像“奇”）" },
  { re: /(ph)/, note: () => "ph 组合发 /f/ 音" },
  { re: /(wh)/, note: () => "wh 组合多发 /w/（what 有时读 /h/）" },
  { re: /(ck)/, note: () => "ck 组合只发一个 /k/ 音" },
  { re: /(ng)$/ , note: () => "词尾 ng 发鼻音 /ŋ/" },
  { re: /(qu)/, note: () => "qu 组合发 /kw/" },
  { re: /([aeiou])[^aeiou]e$/, note: (m) => `魔法 e 规则：词尾 e 不发音，让前面的 ${m[1]} 发字母本音（如 cake /eɪ/）` },
  { re: /(.)\1/, note: (m) => `双写辅音 ${m[1]}${m[1]} 只发一个音，但提示前面元音读短音` },
  { re: /^[bcdfgpt][aeiou][bcdfgptkmsn]$/, note: () => "CVC 结构：元音发短音（cat、bed、sit 型）" },
];

function generatePhonics(word: string): string {
  const w = word.toLowerCase();
  const notes: string[] = [];
  for (const rule of PHONICS_RULES) {
    const m = w.match(rule.re);
    if (m) {
      notes.push(rule.note(m));
      if (notes.length >= 2) break;
    }
  }
  if (/[^aeiou]y$/.test(w)) notes.push("词尾 y 读短促的 /i/（像“衣”)");
  if (notes.length === 0) notes.push("按字母常规发音逐个拼读即可");
  return notes.join("；");
}

function countSyllables(word: string, ipa: string): number {
  const ipaClean = ipa.replace(/[/\[\]ˈˌˌ.·ː]/g, "");
  const ipaVowels = (ipaClean.match(/[aeiouæɑɒɔʊɪʌəɜ]/gi) || []).length;
  if (ipaVowels > 0) return ipaVowels;
  const groups = word.toLowerCase().match(/[aeiouy]+/g);
  return Math.max(1, groups ? groups.length : 1);
}

// ============================================================
// 3. 词根 · 前缀 · 后缀 + 词源
// ============================================================

const PREFIX_DICT: Record<string, { zh: string; origin: string }> = {
  un: { zh: "不、相反", origin: "古英语" }, re: { zh: "再次、返回", origin: "拉丁语" },
  pre: { zh: "在……之前", origin: "拉丁语" }, post: { zh: "在……之后", origin: "拉丁语" },
  dis: { zh: "否定、分离", origin: "拉丁语" }, im: { zh: "不 / 进入", origin: "拉丁语" },
  in: { zh: "不 / 向内", origin: "拉丁语" }, il: { zh: "不（l 前）", origin: "拉丁语" },
  ir: { zh: "不（r 前）", origin: "拉丁语" }, mis: { zh: "错误地", origin: "古英语" },
  over: { zh: "过度、在上", origin: "古英语" }, under: { zh: "不足、在下", origin: "古英语" },
  sub: { zh: "在下面、次级", origin: "拉丁语" }, super: { zh: "超过、上级", origin: "拉丁语" },
  trans: { zh: "横穿、转移", origin: "拉丁语" }, inter: { zh: "在……之间、相互", origin: "拉丁语" },
  ex: { zh: "前任、向外", origin: "拉丁语" }, en: { zh: "使……", origin: "法语/拉丁语" },
  em: { zh: "使……", origin: "法语/拉丁语" }, de: { zh: "去除、向下、加强", origin: "拉丁语" },
  anti: { zh: "反对、抗", origin: "希腊语" }, auto: { zh: "自动、自己", origin: "希腊语" },
  bi: { zh: "双、二", origin: "拉丁语" }, tri: { zh: "三", origin: "拉丁语/希腊语" },
  mono: { zh: "单一", origin: "希腊语" }, multi: { zh: "多", origin: "拉丁语" },
  semi: { zh: "半", origin: "拉丁语" }, micro: { zh: "微小", origin: "希腊语" },
  macro: { zh: "宏大", origin: "希腊语" }, tele: { zh: "远程", origin: "希腊语" },
  fore: { zh: "预先、前面", origin: "古英语" }, co: { zh: "共同", origin: "拉丁语" },
  mal: { zh: "坏、不良", origin: "拉丁语" }, bene: { zh: "好、善", origin: "拉丁语" },
  counter: { zh: "反、对应", origin: "拉丁语" }, hyper: { zh: "过度、超高", origin: "希腊语" },
  para: { zh: "旁边、辅助", origin: "希腊语" }, poly: { zh: "多", origin: "希腊语" },
  proto: { zh: "原始、最初", origin: "希腊语" }, syn: { zh: "共同、相同", origin: "希腊语" },
  sym: { zh: "共同、相同", origin: "希腊语" }, ultra: { zh: "极端、超", origin: "拉丁语" },
  uni: { zh: "单一", origin: "拉丁语" }, out: { zh: "超过、外面", origin: "古英语" },
  self: { zh: "自我", origin: "古英语" }, neo: { zh: "新", origin: "希腊语" },
};

const SUFFIX_DICT: Record<string, { zh: string; pos: PartOfSpeech }> = {
  tion: { zh: "行为/结果（名词）", pos: "noun" }, sion: { zh: "行为/状态（名词）", pos: "noun" },
  ment: { zh: "行为/结果（名词）", pos: "noun" }, ness: { zh: "性质/状态（名词）", pos: "noun" },
  ity: { zh: "性质（名词）", pos: "noun" }, ty: { zh: "性质（名词）", pos: "noun" },
  ance: { zh: "状态/行为（名词）", pos: "noun" }, ence: { zh: "状态/行为（名词）", pos: "noun" },
  ancy: { zh: "状态（名词）", pos: "noun" }, ency: { zh: "状态（名词）", pos: "noun" },
  ship: { zh: "身份/关系（名词）", pos: "noun" }, hood: { zh: "身份/时期（名词）", pos: "noun" },
  ism: { zh: "主义/学说（名词）", pos: "noun" }, ist: { zh: "从事者（名词）", pos: "noun" },
  er: { zh: "做……的人/物（名词）", pos: "noun" }, or: { zh: "做……的人/物（名词）", pos: "noun" },
  ar: { zh: "做……的人（名词）", pos: "noun" }, ee: { zh: "被……的人（名词）", pos: "noun" },
  ian: { zh: "某种人（名词）", pos: "noun" }, cian: { zh: "技术人员（名词）", pos: "noun" },
  age: { zh: "集合/行为（名词）", pos: "noun" }, dom: { zh: "状态/领域（名词）", pos: "noun" },
  th: { zh: "状态/序数（名词）", pos: "noun" }, ure: { zh: "行为/结果（名词）", pos: "noun" },
  ful: { zh: "充满……的（形容）", pos: "adjective" }, less: { zh: "没有……的（形容）", pos: "adjective" },
  ous: { zh: "多……的（形容）", pos: "adjective" }, ious: { zh: "多……的（形容）", pos: "adjective" },
  able: { zh: "可……的（形容）", pos: "adjective" }, ible: { zh: "可……的（形容）", pos: "adjective" },
  al: { zh: "……的（形容）", pos: "adjective" }, ic: { zh: "……的（形容）", pos: "adjective" },
  ive: { zh: "有……性质的（形容）", pos: "adjective" }, ant: { zh: "处于……状态的", pos: "adjective" },
  ent: { zh: "处于……状态的", pos: "adjective" }, ary: { zh: "与……有关的", pos: "adjective" },
  ish: { zh: "略带……的", pos: "adjective" }, like: { zh: "像……的", pos: "adjective" },
  ly: { zh: "以……方式（副词）", pos: "adverb" },
  ize: { zh: "使……化（动词）", pos: "verb" }, ise: { zh: "使……化（动词）", pos: "verb" },
  ify: { zh: "使……（动词）", pos: "verb" }, ate: { zh: "使/做（动词）", pos: "verb" },
  en: { zh: "使变得（动词）", pos: "verb" },
  ward: { zh: "朝……方向", pos: "adverb" }, wise: { zh: "以……方式", pos: "adverb" },
  let: { zh: "小的（名词）", pos: "noun" }, ess: { zh: "女性（名词）", pos: "noun" },
  ology: { zh: "……学（名词）", pos: "noun" }, graphy: { zh: "书写/学科（名词）", pos: "noun" },
  phobia: { zh: "……恐惧症（名词）", pos: "noun" }, cracy: { zh: "统治/政体（名词）", pos: "noun" },
};

const ROOT_DICT: Record<string, { zh: string; origin: string }> = {
  spect: { zh: "看", origin: "拉丁语 specere" }, port: { zh: "搬运、携带", origin: "拉丁语 portare" },
  duct: { zh: "引导", origin: "拉丁语 ducere" }, struct: { zh: "建造", origin: "拉丁语 struere" },
  vis: { zh: "看", origin: "拉丁语 videre" }, vid: { zh: "看", origin: "拉丁语 videre" },
  scrib: { zh: "写", origin: "拉丁语 scribere" }, script: { zh: "写", origin: "拉丁语 scribere" },
  aud: { zh: "听", origin: "拉丁语 audire" }, dict: { zh: "说、宣称", origin: "拉丁语 dicere" },
  fact: { zh: "做", origin: "拉丁语 facere" }, fect: { zh: "做", origin: "拉丁语 facere" },
  ject: { zh: "投掷", origin: "拉丁语 jacere" }, mit: { zh: "送、放出", origin: "拉丁语 mittere" },
  miss: { zh: "送、放出", origin: "拉丁语 mittere" }, form: { zh: "形状、形成", origin: "拉丁语 forma" },
  graph: { zh: "写、画", origin: "希腊语 graphein" }, log: { zh: "言语、学科", origin: "希腊语 logos" },
  phon: { zh: "声音", origin: "希腊语 phone" }, scope: { zh: "观察的工具", origin: "希腊语 skopein" },
  vert: { zh: "转", origin: "拉丁语 vertere" }, vers: { zh: "转", origin: "拉丁语 vertere" },
  voc: { zh: "声音、呼唤", origin: "拉丁语 vox" }, ceed: { zh: "走、前进", origin: "拉丁语 cedere" },
  cede: { zh: "走、让步", origin: "拉丁语 cedere" }, cess: { zh: "行走、前进", origin: "拉丁语 cedere" },
  cur: { zh: "跑", origin: "拉丁语 currere" }, curr: { zh: "跑", origin: "拉丁语 currere" },
  fer: { zh: "带来、承载", origin: "拉丁语 ferre" }, gress: { zh: "迈步", origin: "拉丁语 gradi" },
  grad: { zh: "级、步", origin: "拉丁语 gradi" }, loc: { zh: "地方", origin: "拉丁语 locus" },
  lum: { zh: "光", origin: "拉丁语 lumen" }, luc: { zh: "光", origin: "拉丁语 lux" },
  manu: { zh: "手", origin: "拉丁语 manus" }, mot: { zh: "移动", origin: "拉丁语 movere" },
  mob: { zh: "移动", origin: "拉丁语 movere" }, mov: { zh: "移动", origin: "拉丁语 movere" },
  ped: { zh: "脚", origin: "拉丁语 pes" }, pel: { zh: "推、驱", origin: "拉丁语 pellere" },
  puls: { zh: "推、驱", origin: "拉丁语 pellere" }, pos: { zh: "放置", origin: "拉丁语 ponere" },
  rupt: { zh: "打破", origin: "拉丁语 rumpere" }, sect: { zh: "切割", origin: "拉丁语 secare" },
  sens: { zh: "感觉", origin: "拉丁语 sentire" }, sent: { zh: "感觉", origin: "拉丁语 sentire" },
  tang: { zh: "接触", origin: "拉丁语 tangere" }, tact: { zh: "接触", origin: "拉丁语 tangere" },
  ten: { zh: "握持", origin: "拉丁语 tenere" }, therm: { zh: "热", origin: "希腊语 therme" },
  tract: { zh: "拉、拖", origin: "拉丁语 trahere" }, ven: { zh: "来", origin: "拉丁语 venire" },
  vent: { zh: "来", origin: "拉丁语 venire" }, cap: { zh: "抓取", origin: "拉丁语 capere" },
  cept: { zh: "拿取", origin: "拉丁语 capere" }, cid: { zh: "落下/切割", origin: "拉丁语 cadere/caedere" },
  cis: { zh: "切", origin: "拉丁语 caedere" }, clud: { zh: "关闭", origin: "拉丁语 claudere" },
  clus: { zh: "关闭", origin: "拉丁语 claudere" }, cred: { zh: "相信", origin: "拉丁语 credere" },
  demo: { zh: "人民", origin: "希腊语 demos" }, equ: { zh: "相等", origin: "拉丁语 aequus" },
  flu: { zh: "流", origin: "拉丁语 fluere" }, gen: { zh: "产生、出生", origin: "拉丁语 genus" },
  geo: { zh: "地球", origin: "希腊语 gaia" }, hydro: { zh: "水", origin: "希腊语 hydor" },
  jur: { zh: "法律、宣誓", origin: "拉丁语 jus" }, liber: { zh: "自由", origin: "拉丁语 liber" },
  magn: { zh: "大", origin: "拉丁语 magnus" }, medi: { zh: "中间", origin: "拉丁语 medius" },
  mem: { zh: "记忆", origin: "拉丁语 memoria" }, min: { zh: "小", origin: "拉丁语 minor" },
  mort: { zh: "死", origin: "拉丁语 mors" }, nat: { zh: "出生", origin: "拉丁语 natus" },
  nav: { zh: "船", origin: "拉丁语 navis" }, nov: { zh: "新", origin: "拉丁语 novus" },
  path: { zh: "感受、病", origin: "希腊语 pathos" }, pend: { zh: "悬挂、支付", origin: "拉丁语 pendere" },
  pens: { zh: "悬挂、衡量", origin: "拉丁语 pendere" }, pet: { zh: "寻求", origin: "拉丁语 petere" },
  pop: { zh: "人民", origin: "拉丁语 populus" }, prim: { zh: "第一、首要", origin: "拉丁语 primus" },
  reg: { zh: "统治、王", origin: "拉丁语 rex" }, sci: { zh: "知道", origin: "拉丁语 scire" },
  son: { zh: "声音", origin: "拉丁语 sonus" }, temp: { zh: "时间", origin: "拉丁语 tempus" },
  terr: { zh: "土地", origin: "拉丁语 terra" }, urb: { zh: "城市", origin: "拉丁语 urbs" },
  vac: { zh: "空", origin: "拉丁语 vacare" }, val: { zh: "价值", origin: "拉丁语 valere" },
  ver: { zh: "真实", origin: "拉丁语 verus" }, vit: { zh: "生命", origin: "拉丁语 vita" },
  viv: { zh: "活", origin: "拉丁语 vivere" }, vol: { zh: "意愿、飞", origin: "拉丁语 voluntas" },
};

interface Morphology {
  prefix?: { form: string; meaning: string };
  suffix?: { form: string; meaning: string; creates: PartOfSpeech };
  root?: { form: string; meaning: string; origin: string };
  note: string;
}

function analyzeMorphology(word: string): Morphology {
  const w = word.toLowerCase();
  const result: Morphology = { note: "" };
  const parts: string[] = [];

  // 最长匹配前缀（≥3 字符才认为真的是前缀，避免误判）
  for (const form of Object.keys(PREFIX_DICT).sort((a, b) => b.length - a.length)) {
    if (w.startsWith(form) && w.length > form.length + 1) {
      result.prefix = { form, meaning: PREFIX_DICT[form].zh };
      parts.push(`前缀 ${form}-（${PREFIX_DICT[form].origin}：「${PREFIX_DICT[form].zh}」）`);
      break;
    }
  }
  // 后缀
  for (const form of Object.keys(SUFFIX_DICT).sort((a, b) => b.length - a.length)) {
    if (w.endsWith(form) && w.length > form.length + 1) {
      result.suffix = { form, meaning: SUFFIX_DICT[form].zh, creates: SUFFIX_DICT[form].pos };
      parts.push(`后缀 -${form}（表示「${SUFFIX_DICT[form].zh}」）`);
      break;
    }
  }
  // 词根
  for (const form of Object.keys(ROOT_DICT).sort((a, b) => b.length - a.length)) {
    if (w.includes(form) && form.length >= 3) {
      result.root = { form, meaning: ROOT_DICT[form].zh, origin: ROOT_DICT[form].origin };
      parts.push(`词根 ${form} = 「${ROOT_DICT[form].zh}」（源自${ROOT_DICT[form].origin}）`);
      break;
    }
  }

  result.note = parts.length > 0
    ? parts.join(" + ") + ` → 拆开看就懂了`
    : "";
  return result;
}

// ============================================================
// 4. 用法说明（按词性）
// ============================================================

const IRREGULAR_VERBS: Record<string, string> = {
  go: "went", eat: "ate", see: "saw", come: "came", take: "took", make: "made",
  get: "got", give: "gave", have: "had", do: "did", say: "said", tell: "told",
  find: "found", know: "knew", think: "thought", buy: "bought", bring: "brought",
  begin: "began", drink: "drank", drive: "drove", run: "ran", write: "wrote",
  read: "read", speak: "spoke", sleep: "slept", feel: "felt", leave: "left",
  keep: "kept", meet: "met", pay: "paid", put: "put", send: "sent", sit: "sat",
  stand: "stood", lose: "lost", learn: "learnt", hold: "held", hear: "heard",
  grow: "grew", fly: "flew", fall: "fell", cut: "cut", become: "became",
  build: "built", catch: "caught", choose: "chose", cost: "cost", break: "broke",
  wear: "wore", win: "won", understand: "understood", teach: "taught",
  swim: "swam", spend: "spent", sell: "sold", ride: "rode",
};

function pastTenseOf(w: string): string {
  const irr = IRREGULAR_VERBS[w];
  if (irr) return irr;
  if (/(e)$/.test(w)) return w + "d";
  if (/([^aeiou])y$/.test(w)) return w.slice(0, -1) + "ied";
  return w + "ed";
}

function generateUsage(word: string, pos: PartOfSpeech[], zh: string): string {
  const w = word.toLowerCase();
  const z = primaryZh(zh);
  switch (pos[0]) {
    case "noun":
      if (UNCOUNTABLE_NOUNS.has(w)) {
        return `名词（不可数）用法：① 不加 a/an，没有复数：some ${w} / the ${w}；② 常用搭配 much ${w}（很多）、a lot of ${w}；③ 例：I need some ${w}.（我需要一些${z}。）`;
      }
      return `名词用法：① 可说 a/an ${w}（一个）、the ${w}（那个）；② 复数多加 -s/-es；③ 常作主语或宾语：This ${w} is good.（这个${z}很好。）`;
    case "verb": {
      const past = pastTenseOf(w);
      return `动词用法：① 句型「主语 + ${w} + 宾语」；② 一般现在时第三人称单数加 -s；③ 过去式：${past}${IRREGULAR_VERBS[w] ? "（不规则，要单独背）" : "（规则变化）"}；④ 进行时 be ${w}ing。例：I ${w} it every day.`;
    }
    case "adjective":
      return `形容词用法：① 放名词前：a ${w} thing（一件很${z}的事）；② 放系动词后：It is / looks / seems ${w}.；③ 比较级多加 more 或 -er，最高级 most 或 -est。`;
    case "adverb":
      return `副词用法：① 修饰动词：He runs ${w}.；② 位置灵活：句尾最常见，也可放句首强调；③ 修饰形容词时放其前。`;
    case "preposition":
      return `介词用法：后面必须接名词或动名词（${w} doing something），不能单独成句；常出现在固定搭配里，遇到一个记一个。`;
    case "conjunction":
      return `连词用法：用来连接两个句子或并列成分，前后结构通常对称；注意它表达的逻辑关系（转折/因果/并列/条件）。`;
    case "pronoun":
      return `代词用法：代替名词避免重复，有人称、数、格的变化；作主语用主格，作宾语用宾格。`;
    case "determiner":
      return `限定词用法：放在名词前面帮助确定范围（哪个/多少），后面紧跟名词使用。`;
    case "interjection":
      return `感叹词用法：独立表达情绪，常单独成句或放句首，后面多用逗号或感叹号：${w}! 太棒了！`;
    default:
      return `用法：先掌握基本含义「${z}」，再通过例句记住它在句中的位置和搭配。`;
  }
}

// ============================================================
// 5. 搭配（人工词典 + 词性通用模式）
// ============================================================

type Coll = [pattern: string, chinese: string];

const COLLOCATIONS_RAW: Record<string, Coll[]> = {
  make: [["make a plan", "制定计划"], ["make friends", "交朋友"], ["make a mistake", "犯错误"], ["make money", "赚钱"]],
  do: [["do homework", "做作业"], ["do exercise", "锻炼"], ["do the dishes", "洗碗"], ["do business", "做生意"]],
  take: [["take a photo", "拍照"], ["take a break", "休息一下"], ["take notes", "记笔记"], ["take action", "采取行动"]],
  have: [["have a look", "看一看"], ["have a rest", "休息"], ["have fun", "玩得开心"], ["have trouble", "遇到麻烦"]],
  get: [["get ready", "准备好"], ["get along with", "与……相处"], ["get used to", "习惯于"], ["get over", "克服"]],
  give: [["give a hand", "帮忙"], ["give a try", "试一试"], ["give up", "放弃"], ["give advice", "给建议"]],
  break: [["break the ice", "打破僵局"], ["break the record", "打破纪录"], ["break a promise", "失信"]],
  pay: [["pay attention", "注意"], ["pay a visit", "拜访"], ["pay the bill", "买单"]],
  catch: [["catch a cold", "感冒"], ["catch up with", "赶上"], ["catch a bus", "赶公交"]],
  keep: [["keep a promise", "守承诺"], ["keep in touch", "保持联系"], ["keep calm", "保持冷静"]],
  hold: [["hold a meeting", "开会"], ["hold hands", "牵手"], ["hold on", "稍等"]],
  run: [["run out of", "用完"], ["run into", "偶遇"], ["run a business", "经营生意"]],
  turn: [["turn on/off", "打开/关闭"], ["turn up/down", "调大/调小"], ["turn out", "结果是"]],
  set: [["set up", "建立"], ["set off", "出发"], ["set an example", "树立榜样"]],
  put: [["put on", "穿上"], ["put off", "推迟"], ["put up with", "忍受"]],
  work: [["work out", "解决/健身"], ["work on", "致力于"], ["work hard", "努力工作"]],
  time: [["on time", "准时"], ["in time", "及时"], ["at the same time", "同时"]],
  way: [["by the way", "顺便说"], ["on the way", "在路上"], ["in a way", "某种程度上"]],
  hand: [["on the other hand", "另一方面"], ["shake hands", "握手"], ["by hand", "手工"]],
  heart: [["by heart", "熟记"], ["lose heart", "灰心"]],
  eye: [["keep an eye on", "照看"], ["see eye to eye", "看法一致"]],
  life: [["in real life", "在现实生活中"], ["come to life", "栩栩如生"]],
  day: [["day by day", "一天天"], ["one day", "有一天"], ["day off", "休息日"]],
  world: [["around the world", "全世界"], ["in the world", "世界上"]],
  home: [["at home", "在家"], ["feel at home", "感到自在"]],
  money: [["save money", "存钱"], ["spend money", "花钱"], ["make money", "赚钱"]],
  friend: [["make friends", "交朋友"], ["best friend", "最好的朋友"]],
  love: [["fall in love", "坠入爱河"], ["love at first sight", "一见钟情"]],
  bad: [["go bad", "变质"], ["bad luck", "倒霉"]],
  big: [["a big deal", "大事"], ["big picture", "大局"]],
  long: [["as long as", "只要"], ["no longer", "不再"]],
  free: [["for free", "免费"], ["feel free", "请随意"]],
  early: [["early bird", "早起的人"], ["early on", "早期"]],
  fast: [["fast food", "快餐"], ["fast asleep", "熟睡"]],
  slow: [["slow down", "减速"]],
  new: [["brand new", "全新"], ["new year", "新年"]],
  good: [["good morning", "早上好"], ["good at", "擅长"]],
  great: [["great deal", "大量"], ["great time", "美好时光"]],
  true: [["come true", "实现"], ["true story", "真实故事"]],
  real: [["for real", "真的"], ["real life", "现实生活"]],
  clean: [["clean up", "清理干净"]],
  dark: [["in the dark", "蒙在鼓里"], ["dark side", "阴暗面"]],
  fresh: [["fresh air", "新鲜空气"], ["fresh start", "新开始"]],
  sweet: [["sweet dreams", "做个好梦"]],
  hot: [["hot dog", "热狗"], ["hot topic", "热门话题"]],
  cold: [["catch a cold", "感冒"], ["cold shoulder", "冷落"]],
  fire: [["on fire", "着火/火爆"], ["set fire", "纵火"]],
  rain: [["heavy rain", "大雨"]],
  water: [["hot water", "热水"], ["by water", "由水路"]],
  air: [["fresh air", "新鲜空气"], ["by air", "坐飞机"]],
  book: [["read a book", "读书"], ["book a ticket", "订票"]],
  door: [["knock on the door", "敲门"], ["door to door", "挨家挨户"]],
  car: [["drive a car", "开车"], ["by car", "开车去"]],
  bus: [["take the bus", "坐公交"], ["by bus", "乘公交"]],
  train: [["take the train", "坐火车"]],
  food: [["junk food", "垃圾食品"], ["fast food", "快餐"]],
  school: [["go to school", "上学"], ["after school", "放学后"]],
  sun: [["in the sun", "在阳光下"]],
  moon: [["once in a blue moon", "千载难逢"]],
  star: [["movie star", "电影明星"], ["lucky star", "福星"]],
  face: [["face to face", "面对面"], ["lose face", "丢面子"]],
  word: [["in other words", "换句话说"], ["word for word", "逐字地"]],
  paper: [["on paper", "理论上"], ["piece of paper", "一张纸"]],
  table: [["on the table", "在桌上/待讨论"]],
  window: [["window shopping", "只逛不买"]],
  family: [["family tree", "家谱"], ["start a family", "成家"]],
  job: [["find a job", "找工作"], ["apply for a job", "求职"]],
  help: [["ask for help", "求助"], ["help yourself", "请自便"]],
  idea: [["good idea", "好主意"], ["come up with an idea", "想出主意"]],
  problem: [["solve a problem", "解决问题"], ["no problem", "没问题"]],
  question: [["ask a question", "提问"], ["out of the question", "不可能"]],
  chance: [["by chance", "偶然"], ["take a chance", "冒险一试"]],
  change: [["make a change", "做出改变"], ["small change", "零钱"]],
  news: [["a piece of news", "一条新闻"], ["good news", "好消息"]],
  rest: [["take a rest", "休息"], ["the rest of", "剩下的"]],
  care: [["take care", "保重"], ["care about", "在乎"]],
  control: [["out of control", "失控"], ["take control", "掌控"]],
  decision: [["make a decision", "做决定"]],
  difference: [["make a difference", "产生影响"]],
  effort: [["make an effort", "努力"], ["spare no effort", "不遗余力"]],
  excuse: [["make an excuse", "找借口"], ["no excuse", "没有借口"]],
  experience: [["work experience", "工作经验"], ["rich experience", "丰富经验"]],
  feeling: [["have a feeling", "有种感觉"], ["hurt feelings", "伤害感情"]],
  fun: [["have fun", "玩得开心"], ["make fun of", "取笑"]],
  guess: [["take a guess", "猜一猜"], ["wild guess", "瞎猜"]],
  habit: [["break a habit", "改掉习惯"], ["good habits", "好习惯"]],
  interest: [["be interested in", "对……感兴趣"], ["take an interest in", "对……产生兴趣"]],
  lesson: [["teach a lesson", "上课/教训"], ["learn a lesson", "吸取教训"]],
  living: [["make a living", "谋生"], ["cost of living", "生活成本"]],
  look: [["have a look", "看一下"], ["look for", "寻找"]],
  luck: [["good luck", "好运"], ["bad luck", "倒霉"]],
  mind: [["make up your mind", "下决心"], ["keep in mind", "牢记"]],
  mistake: [["make a mistake", "犯错"], ["by mistake", "误以为"]],
  moment: [["at the moment", "此刻"], ["for a moment", "一会儿"]],
  need: [["in need", "需要"], ["there is no need", "没必要"]],
  noise: [["make a noise", "吵闹"]],
  note: [["take notes", "记笔记"], ["leave a note", "留便条"]],
  order: [["in order to", "为了"], ["place an order", "下单"]],
  part: [["take part in", "参加"], ["play a part", "起作用"]],
  place: [["take place", "发生"], ["out of place", "格格不入"]],
  plan: [["make a plan", "制定计划"], ["plan ahead", "提前规划"]],
  point: [["to the point", "切题"], ["point of view", "观点"]],
  practice: [["practice makes perfect", "熟能生巧"]],
  promise: [["keep a promise", "守信"], ["make a promise", "许诺"]],
  reason: [["for this reason", "因此"], ["no reason", "没理由"]],
  risk: [["take a risk", "冒险"], ["at risk", "处于危险"]],
  room: [["make room", "腾出空间"], ["meeting room", "会议室"]],
  sense: [["make sense", "讲得通"], ["common sense", "常识"]],
  service: [["customer service", "客服"], ["room service", "客房服务"]],
  shower: [["take a shower", "洗澡"]],
  sleep: [["go to sleep", "入睡"], ["fall asleep", "睡着"]],
  speech: [["give a speech", "演讲"]],
  story: [["tell a story", "讲故事"], ["true story", "真事"]],
  study: [["study hard", "努力学习"], ["case study", "案例分析"]],
  talk: [["give a talk", "做报告"], ["talk about", "谈论"]],
  thing: [["all things considered", "综合考虑"]],
  trip: [["take a trip", "旅行"], ["business trip", "出差"]],
  walk: [["take a walk", "散步"], ["go for a walk", "去散步"]],
  wish: [["make a wish", "许愿"], ["best wishes", "美好祝福"]],
  happy: [["happy birthday", "生日快乐"], ["happy ending", "圆满结局"]],
  sad: [["feel sad", "感到难过"]],
  angry: [["get angry", "生气"], ["angry with", "对……生气"]],
  tired: [["tired of", "厌倦"], ["dead tired", "累极了"]],
  afraid: [["be afraid of", "害怕"], ["I'm afraid", "恐怕"]],
  sure: [["make sure", "确保"], ["for sure", "肯定"]],
  right: [["all right", "好吧"], ["right away", "立刻"]],
  wrong: [["go wrong", "出错"], ["in the wrong", "理亏"]],
  ready: [["get ready", "准备"], ["ready for", "为……准备好"]],
  busy: [["busy doing", "忙于"], ["as busy as a bee", "忙得团团转"]],
  late: [["be late for", "迟到"]],
  easy: [["take it easy", "放轻松"], ["easy going", "随和"]],
  hard: [["work hard", "努力"], ["hard times", "艰难时期"]],
  important: [["play an important role", "起重要作用"]],
  interesting: [["find it interesting", "觉得有趣"]],
  kind: [["kind of", "有点"], ["be kind to", "对……友善"]],
  sorry: [["feel sorry", "感到抱歉"], ["so sorry", "非常抱歉"]],
  welcome: [["you're welcome", "不客气"], ["welcome aboard", "欢迎加入"]],
  hungry: [["be hungry for", "渴望"]],
  thirsty: [["thirsty for knowledge", "求知若渴"]],
  strong: [["strong point", "强项"], ["strong will", "坚强意志"]],
  weak: [["weak point", "弱点"], ["weakness", "弱点"]],
  young: [["young people", "年轻人"]],
  old: [["old friend", "老朋友"], ["the old days", "从前"]],
  beautiful: [["beautiful scenery", "美景"]],
  cheap: [["cheap price", "便宜的价格"]],
  expensive: [["an expensive watch", "昂贵的手表"]],
  dangerous: [["dangerous situation", "危险处境"]],
  safe: [["safe and sound", "安然无恙"]],
  quiet: [["keep quiet", "保持安静"]],
  loud: [["loud music", "响亮的音乐"]],
  open: [["open up", "打开"], ["open minded", "思想开明"]],
  close: [["close down", "关闭"], ["close friend", "密友"]],
  light: [["light meal", "简餐"], ["in light of", "鉴于"]],
  heavy: [["heavy traffic", "拥堵的交通"], ["heavy rain", "大雨"]],
  soft: [["soft drink", "软饮料"], ["soft voice", "轻声"]],
  deep: [["deep breath", "深呼吸"], ["deep sleep", "深度睡眠"]],
  wide: [["wide range", "广泛的范围"]],
  high: [["high school", "高中"], ["high time", "正是时候"]],
  low: [["low price", "低价"], ["feel low", "情绪低落"]],
  warm: [["warm up", "热身"], ["warm heart", "热心肠"]],
  cool: [["cool down", "冷静下来"]],
  dry: [["dry land", "旱地"]],
  wet: [["wet weather", "潮湿天气"]],
  full: [["be full of", "装满"], ["full name", "全名"]],
  empty: [["empty bottle", "空瓶子"]],
  rich: [["rich in", "富含"], ["get rich", "致富"]],
  poor: [["poor health", "身体差"]],
  first: [["at first", "起初"], ["first of all", "首先"]],
  last: [["at last", "最终"], ["last week", "上周"]],
  next: [["next to", "紧邻"], ["next week", "下周"]],
  same: [["the same as", "与……相同"]],
  different: [["different from", "与……不同"]],
  best: [["do one's best", "尽全力"], ["best seller", "畅销书"]],
  worse: [["even worse", "更糟的是"]],
  better: [["had better", "最好"], ["feel better", "感觉更好"]],
  more: [["more or less", "或多或少"], ["once more", "再一次"]],
  less: [["less than", "少于"]],
  much: [["much better", "好得多"]],
  many: [["many kinds of", "多种多样的"]],
  few: [["a few", "几个"], ["quite a few", "相当多"]],
  little: [["a little", "一点"], ["little by little", "逐渐"]],
  enough: [["old enough", "够大了"], ["enough sleep", "充足睡眠"]],
};

const GENERIC_COLL_BY_POS: Record<string, (w: string, z: string) => Coll[]> = {
  noun: (w, z) => [
    [`a / the ${w}`, `一个 / 这个${z}`],
    [UNCOUNTABLE_NOUNS.has(w) ? `much ${w}` : /s$|x$|ch$|sh$/.test(w) ? `many ${w}es` : `many ${w}s`, UNCOUNTABLE_NOUNS.has(w) ? `很多${z}` : `很多${z}`],
    [`this ${w} is great`, `这个${z}很棒`],
  ],
  verb: (w, z) => [
    [`want to ${w}`, `想要${z}`],
    [`${w} it every day`, `每天${z}`],
    [`can ${w}`, `会${z}`],
  ],
  adjective: (w, z) => [
    [`very ${w}`, `非常${z}`],
    [`too ${w}`, `太${z}`],
    [`quite ${w}`, `相当${z}`],
  ],
  adverb: (w, z) => [
    [`do it ${w}`, `${z}地去做`],
    [`speak more ${w}`, `说得更加${z}`],
  ],
  preposition: (w, z) => [
    [`${w} the table`, `在桌子${z.includes("上") ? "上" : "附近"}`],
    [`${w} 2024`, `自/到 2024 年`],
  ],
  conjunction: (w, z) => [
    [`I stayed, ${w} it rained`, `我留下来了，${z}`],
  ],
};

function buildCollocations(word: string, pos: PartOfSpeech[], zh: string) {
  const key = word.toLowerCase();
  const curated = COLLOCATIONS_RAW[key];
  const z = primaryZh(zh);
  if (curated && curated.length > 0) {
    return curated.map(([pattern, chinese], i) => ({
      pattern, chinese, frequency: 5 - Math.min(i, 3),
      example: pattern,
    }));
  }
  const gen = GENERIC_COLL_BY_POS[pos[0]] ?? GENERIC_COLL_BY_POS.noun;
  return gen(word, z).map(([pattern, chinese], i) => ({
    pattern, chinese, frequency: 2 - Math.min(i, 1), example: "",
  }));
}

// ============================================================
// 6. 对比记忆（反义词 + 易混淆词）
// ============================================================

const ANTONYM_PAIRS: Record<string, string> = {
  big: "small", small: "big", good: "bad", bad: "good", hot: "cold", cold: "hot",
  fast: "slow", slow: "fast", happy: "sad", sad: "happy", new: "old", old: "new",
  long: "short", short: "long", high: "low", low: "high", easy: "hard", hard: "easy",
  rich: "poor", poor: "rich", open: "close", close: "open", start: "end", end: "start",
  buy: "sell", sell: "buy", give: "take", take: "give", ask: "answer", answer: "ask",
  win: "lose", lose: "win", love: "hate", hate: "love", clean: "dirty", dirty: "clean",
  full: "empty", empty: "full", strong: "weak", weak: "strong", young: "old",
  early: "late", late: "early", quick: "slow", loud: "quiet", quiet: "loud",
  wet: "dry", dry: "wet", warm: "cool", cool: "warm", light: "heavy", heavy: "light",
  cheap: "expensive", expensive: "cheap", safe: "dangerous", dangerous: "safe",
  best: "worst", worst: "best", more: "less", less: "more", always: "never", never: "always",
  remember: "forget", forget: "remember", find: "lose", arrive: "leave", leave: "arrive",
  push: "pull", pull: "push", laugh: "cry", cry: "laugh", smile: "frown",
  success: "failure", failure: "success", strength: "weakness", weakness: "strength",
  future: "past", past: "future", day: "night", night: "day", summer: "winter", winter: "summer",
};

const CONFUSABLE_PAIRS: Record<string, string> = {
  affect: "affect=动词「影响」；effect=名词「效果」。别混！",
  effect: "effect=名词「影响/效果」；affect=动词「影响」。",
  advice: "advice=名词（不可数）；advise=动词「建议」。",
  advise: "advise=动词；advice=名词。",
  accept: "accept=接受；except=除了。",
  except: "except=除……之外；accept=接受。",
  adapt: "adapt=适应；adopt=采纳/收养。",
  adopt: "adopt=采用/收养；adapt=适应。",
  beside: "beside=在旁边；besides=除此之外还。",
  besides: "besides=此外；beside=在……旁边。",
  through: "through=穿过；thorough=彻底的；though=虽然；thought=想法。",
  thorough: "thorough=彻底的；through=穿过。",
  though: "though=虽然/不过；thought=think 的过去式。",
  thought: "thought=想法；though=虽然。",
  quite: "quite=相当；quiet=安静。",
  quiet: "quiet=安静的；quite=相当。",
  loose: "loose=松的（读 /luːs/）；lose=丢失（读 /luːz/）。",
  lose: "lose=丢失/输；loose=松的。",
  desert: "desert=沙漠（名）/抛弃（动）；dessert=甜点（双 s 因为想吃两份）。",
  dessert: "dessert=甜点；desert=沙漠。",
  principal: "principal=校长/主要的；principle=原则。",
  principle: "principle=原则；principal=校长。",
  stationary: "stationary=静止的；stationery=文具。",
  stationery: "stationery=文具（paper 在里面所以是 er）；stationary=静止的。",
  compliment: "compliment=赞美；complement=补充。",
  complement: "complement=补充；compliment=赞美。",
  assure: "assure=向某人保证；ensure=确保；insure=投保。",
  ensure: "ensure=确保（=make sure）；insure=保险。",
  insure: "insure=投保；ensure=确保。",
  rise: "rise=自己升起（不及物）；raise=举起他物（及物）。",
  raise: "raise=举起/提高（及物）；rise=上升（不及物）。",
  arise: "arise=问题出现（不及物）；rise=上升。",
  lie: "lie=躺/撒谎（lay-lain）；lay=放置/下蛋（laid-laid）。",
  lay: "lay=平放（及物）；lie=躺（不及物）。",
  borrow: "borrow=借入（borrow from）；lend=借出（lend to）。",
  lend: "lend=借出给别人；borrow=从别人那里借入。",
  say: "say=说出内容；tell=告诉某人；speak=讲话（正式）；talk=交谈。",
  tell: "tell sb sth=告诉；say sth=说出。",
  speak: "speak 强调开口说话的能力；talk 强调双向交流。",
  watch: "watch=观看动态（比赛/电影）；look=看（加 at）；see=看见（结果）。",
  look: "look at=看向；see=看到；watch=观赏。",
  see: "see=看见（自然映入眼帘）；watch=有意观看。",
  hear: "hear=听见（结果）；listen=听（动作，listen to）。",
  listen: "listen to=倾听（主动动作）；hear=听到（被动感知）。",
  travel: "travel=旅行动作统称；trip=一次行程；journey=较长旅程。",
  trip: "trip=短途一次出行；journey=长途旅程。",
  journey: "journey=长途旅程；trip=短途出行。",
  cost: "cost=花费（物作主语）；spend=花（人作主语）；pay=付款；take=花时间。",
  spend: "sb spends money/time on sth；sth costs money。",
  win: "win+比赛/奖项；beat+对手。「赢了他」是 beat him 不是 win him。",
  beat: "beat sb=打败某人；win sth=赢得某物。",
  reach: "reach+地点（及物）；arrive in/at+地点；get to+地点。",
  arrive: "arrive in+大地方；arrive at+小地方；reach 直接加地点。",
  join: "join+组织（入党）；join in+活动。",
  agree: "agree with sb=同意某人；agree on sth=在某事上达成一致。",
  discuss: "discuss 是及物动词，直接加宾语，不加 about。",
  marry: "marry 是及物动词：marry sb=娶/嫁某人，不说 marry with。",
  clothes: "clothes=衣服总称（无单数）；cloth=布料；clothing=服装（集合）。",
  cloth: "cloth=布料；clothes=衣服。",
  weather: "weather=天气（不可数）；whether=是否（连词）。",
  whether: "whether=是否；weather=天气。",
  price: "price=价格（高低）；prize=奖品。",
  prize: "prize=奖；price=价。",
  job: "job=具体工作（可数）；work=工作（不可数）。",
  work: "work 不可数：a piece of work；job 可数。",
  fun: "fun=乐趣（不可数名词）；funny=滑稽可笑的（形容词）。",
  funny: "funny=好笑的；fun=有趣（名词）。",
  alone: "alone=独自一人（客观）；lonely=孤独（主观感受）。",
  lonely: "lonely=内心孤独；alone=独自一人。",
  hard: "hard=努力的/困难的；hardly=几乎不（意思完全不同！）。",
  hardly: "hardly=几乎不；hard=努力地。",
  late: "late=迟的；lately=近来。",
  lately: "lately=最近；late=迟到。",
  near: "near=附近的；nearly=几乎。",
  nearly: "nearly=差不多；near=靠近。",
  alive: "alive=活着的（表语）；living=活的（定语）；lively=活泼的。",
  living: "living things=生物；lively=生机勃勃。",
  lively: "lively=活泼的；alive=活着的。",
  historic: "historic=有历史意义的；historical=与历史相关的。",
  historical: "historical=历史学的；historic=载入史册的。",
  economic: "economic=经济的（学科）；economical=省钱的。",
  economical: "economical=节约划算的；economic=经济层面的。",
  sensible: "sensible=明智的；sensitive=敏感的。",
  sensitive: "sensitive=敏感的；sensible=明理的。",
  successful: "successful=成功的；successive=连续的。",
  successive: "successive=接连的；successful=成功的。",
  considerable: "considerable=相当大的；considerate=体贴的。",
  considerate: "considerate=考虑周到的；considerable=数量可观的。",
  imaginary: "imaginary=想象中的；imaginative=富有想象力的。",
  imaginative: "imaginative=有创意的；imaginary=虚构的。",
};

function generateComparison(word: string, zh: string): string {
  const w = word.toLowerCase();
  if (CONFUSABLE_PAIRS[w]) return CONFUSABLE_PAIRS[w];
  if (ANTONYM_PAIRS[w]) return `${w} ↔ ${ANTONYM_PAIRS[w]}（一对反义词，一起记效率翻倍）`;
  // un-/dis- 反义构词提示
  const negMatch = w.match(/^(un|dis|im|in|ir|il)([a-z]{3,})$/);
  if (negMatch) return `去掉前缀 ${negMatch[1]}- 就是它的反面：${negMatch[2]} ↔ ${w}，正反一起记`;
  return `把「${primaryZh(zh)}」和你已会的近义词放在一起比较着记，注意它们能搭配的词不同`;
}

// ============================================================
// 7. 故事串联（8 种场景）
// ============================================================

const STORY_SCENES: Array<(w: string, z: string) => string> = [
  (w, z) => `想象你在纽约餐厅点餐，服务员问你要什么，你脱口而出 "${w}"（${z}），对方笑着点头——场景绑定成功。`,
  (w, z) => `想象你在中国城超市购物，拿起商品想起 "${w}" = ${z}，边逛边念，购物车装满了单词。`,
  (w, z) => `想象早高峰的地铁里，你戴着耳机听到 "${w}"，立刻想到 ${z}，通勤变成了复习课。`,
  (w, z) => `想象美国办公室开会，同事说了 "${w}"（${z}），你马上理解并点头回应，老板对你刮目相看。`,
  (w, z) => `想象周末朋友聚会上，你想表达 "${z}"，自然地说出 "${w}"，朋友们都听懂了。`,
  (w, z) => `想象家庭晚餐桌上，你教孩子说 "${w}"（${z}），教一遍自己就永远记住了。`,
  (w, z) => `想象你在中央公园散步，看到的一切让你想起 "${w}" = ${z}，风景成了单词卡。`,
  (w, z) => `想象网购开箱那一刻，包裹上的英文写着 "${w}"，你秒懂是 ${z}，成就感满满。`,
];

function generateStory(word: string, zh: string): string {
  return pick(STORY_SCENES, word)(word.toLowerCase(), primaryZh(zh));
}

// ============================================================
// 8. 联想记忆（升级版）
// ============================================================

function generateAssociation(word: string, zh: string, morph: Morphology): string {
  const w = word.toLowerCase();
  const z = primaryZh(zh);
  if (morph.root && morph.prefix) {
    return `「${morph.prefix.form}-${morph.root.form}」= ${morph.prefix.meaning} + ${morph.root.meaning} → 整体就是"${z}"`;
  }
  if (morph.root) {
    return `核心词根 ${morph.root.form} 表示「${morph.root.meaning}」，所以整个词的意思是"${z}"`;
  }
  if (/^(un|dis|im|in|ir|il)/.test(w) && w.length > 4) {
    return `前缀表示否定 → 与词干意思相反，即"${z}"`;
  }
  if (/(.)\1/.test(w)) {
    const dbl = w.match(/(.)\1/)![1];
    return `${w} 中间有双写 ${dbl}${dbl}，像两只一样的${z}站在一起`;
  }
  if (w.length <= 4) {
    return `只有 ${w.length} 个字母的短词，大声读 3 遍 "${w}"，嘴里念着${z}`;
  }
  return `闭眼想画面：一个巨大的"${z}"标签贴在 ${w} 上，越夸张越好记`;
}

// ============================================================
// 9. 例句模板池（按词性 + 词哈希选，避免千篇一律）
// ============================================================

const EXAMPLE_TEMPLATES: Record<string, Array<{ en: string; zh: string }>> = {
  n: [
    { en: "I bought a {w} yesterday.", zh: "我昨天买了一个{zh}。" },
    { en: "This {w} looks really nice.", zh: "这个{zh}看起来真不错。" },
    { en: "Do you know where my {w} is?", zh: "你知道我的{zh}在哪吗？" },
    { en: "There are many kinds of {w} here.", zh: "这里有很多种{zh}。" },
    { en: "He talked about his {w} all night.", zh: "他整晚都在聊他的{zh}。" },
  ],
  v: [
    { en: "I usually {w} in the morning.", zh: "我通常在早上{zh}。" },
    { en: "She wants to {w} with us.", zh: "她想和我们一起去{zh}。" },
    { en: "We should {w} more often.", zh: "我们应该多{zh}。" },
    { en: "Did you {w} it yet?", zh: "你已经{zh}了吗？" },
    { en: "They never {w} on weekends.", zh: "他们周末从不{zh}。" },
  ],
  adj: [
    { en: "The weather is really {w} today.", zh: "今天天气真{zh}。" },
    { en: "That was a {w} experience.", zh: "那是一次很{zh}的经历。" },
    { en: "Everyone says the food here is {w}.", zh: "大家都说这里的食物很{zh}。" },
    { en: "I feel {w} about the future.", zh: "我对未来感到{zh}。" },
  ],
  adv: [
    { en: "He finished the work {w}.", zh: "他{zh}完成了工作。" },
    { en: "Please speak {w} so everyone can hear.", zh: "请{zh}地说，让每个人都能听见。" },
    { en: "Things changed {w} last year.", zh: "去年情况变化得很{zh}。" },
  ],
  prep: [
    { en: "The keys are {w} the table.", zh: "钥匙在桌子{zh}。" },
    { en: "We will meet {w} Friday.", zh: "我们会在周五{zh}见面。" },
  ],
  conj: [
    { en: "I stayed home {w} I was tired.", zh: "我待在家里，{zh}我很累。" },
    { en: "Bring an umbrella {w} it rains.", zh: "带上伞，以防下雨。" },
  ],
  pron: [
    { en: "{W} is my best friend.", zh: "{Z}是我最好的朋友。" },
    { en: "Give it to {w}, please.", zh: "请把它给{zh}。" },
  ],
};

function generateExamples(word: string, posKey: string, zh: string, providedEx?: { en: string; zh: string }): Array<{ english: string; chinese: string; register: "neutral" }> {
  const z = primaryZh(zh);
  const out: Array<{ english: string; chinese: string; register: "neutral" }> = [];
  if (providedEx && providedEx.en) {
    out.push({ english: providedEx.en, chinese: providedEx.zh || z, register: "neutral" });
  }
  const pool = EXAMPLE_TEMPLATES[posKey] ?? EXAMPLE_TEMPLATES.n;
  const t = pick(pool, word);
  out.push({
    english: t.en.replace(/\{w\}/g, word).replace("{W}", word.charAt(0).toUpperCase() + word.slice(1)).replace("{Z}", z),
    chinese: t.zh.replace(/\{zh\}/g, z),
    register: "neutral",
  });
  // 第二句换一个模板（同池不同索引）
  if (pool.length > 1) {
    const t2 = pool[(hashStr(word) + 1) % pool.length];
    if (t2 !== t) {
      out.push({
        english: t2.en.replace(/\{w\}/g, word).replace("{W}", word.charAt(0).toUpperCase() + word.slice(1)),
        chinese: t2.zh.replace(/\{zh\}/g, z),
        register: "neutral",
      });
    }
  }
  return out.slice(0, 3);
}

/** 解析 ECDICT 复合词性字符串（如 "adj/n"、"n."、"vt/vi"） */
function parsePos(posStr: string): PartOfSpeech[] {
  const tokens = posStr.toLowerCase().split(/[\/\s,.]+/).filter(Boolean);
  const out = new Set<PartOfSpeech>();
  for (const t of tokens) {
    const mapped = POS_MAP[t];
    if (mapped) mapped.forEach((p) => out.add(p));
    else if (t === "adjective") out.add("adjective");
    else if (t === "adverb") out.add("adverb");
    else if (t === "preposition") out.add("preposition");
    else if (t === "conjunction") out.add("conjunction");
    else if (t === "pronoun") out.add("pronoun");
    else if (t === "determiner") out.add("determiner");
    else if (t === "interjection") out.add("interjection");
  }
  return out.size > 0 ? Array.from(out) : ["noun"];
}

/** 常见不可数名词（避免给出错误的复数/many 搭配建议） */
const UNCOUNTABLE_NOUNS = new Set([
  "water","milk","bread","rice","meat","food","money","time","work","information",
  "advice","knowledge","news","weather","traffic","furniture","luggage","baggage",
  "equipment","homework","housework","progress","research","education","music",
  "art","love","happiness","health","peace","beauty","truth","faith","hope",
  "courage","confidence","experience","practice","training","study","travel",
  "coffee","tea","sugar","salt","flour","oil","butter","cheese","chocolate",
  "fruit","grass","hair","air","smoke","steam","dust","rain","snow","ice",
  "blood","skin","bone","muscle","energy","power","strength","electricity",
  "heat","light","space","room","paper","glass","wood","plastic","cloth",
  "clothing","software","hardware","machinery","traffic","transportation",
  "population","environment","nature","society","culture","history","science",
  "mathematics","physics","chemistry","economics","politics","law","business",
  "industry","technology","development","growth","change","success","failure",
  "luck","fun","help","support","protection","safety","danger","trouble",
  "silence","noise","sound","sleep","dream","thought","thinking","memory",
]);

// ============================================================
// 主生成器
// ============================================================

export function generateWord(
  compact: CompactWord,
  id: string,
  category: string,
  cefrOverride?: "A1" | "A2" | "B1" | "B2" | "C1" | "C2"
): VocabularyItem {
  const w = compact.w.toLowerCase();
  const pos = parsePos(compact.pos || "n");
  const difficulty = DIFF_MAP[compact.dif] || "medium";
  const cefr = cefrOverride || CEFR_MAP[compact.dif] || "A2";

  const homophone = ipaToHomophone(compact.ipa) || letterHomophone(w);
  const morph = analyzeMorphology(w);
  const phonicsNote = generatePhonics(w);
  const syllables = countSyllables(w, compact.ipa);
  const usage = generateUsage(compact.w, pos, compact.zh);
  const collocations = buildCollocations(compact.w, pos, compact.zh);
  const comparison = generateComparison(compact.w, compact.zh);
  const story = generateStory(compact.w, compact.zh);
  const association = compact.mem || generateAssociation(compact.w, compact.zh, morph);

  // 记忆方法打包进 mnemonic：对比 ｜ 故事（展示端按「｜」拆分渲染）
  const mnemonic = `⚖️ 对比记忆：${comparison}\n🎬 故事串联：${story}`;

  // 词根字段：优先词根，其次词源说明
  const rootText = morph.note ||
    `${compact.ipa || "/无音标/"}｜共 ${syllables} 个音节｜谐音读作「${homophone}」`;

  const examples = compact.ex
    ? [{ english: compact.ex, chinese: compact.exzh, register: "neutral" as const }]
    : generateExamples(compact.w, compact.pos, compact.zh);

  return {
    id: `vocab_${id}`,
    word: compact.w,
    chineseMeaning: compact.zh,
    ipa: compact.ipa || "/-/",
    phonicsBreakdown: `${syllables >= 2 ? w.split(/(?=[aeiou])/).slice(0, 5).join("-") : w} ｜ ${phonicsNote}`,
    partOfSpeech: pos,
    cefr,
    difficulty,
    frequency: getFrequencyRank(compact.w, difficulty),
    examples,
    memoryMethods: {
      association,
      chinesePronHint: homophone,
      root: rootText,
      mnemonic,
      usage,
      prefix: morph.prefix?.meaning,
      suffix: morph.suffix?.meaning,
    },
    synonyms: compact.syn ? compact.syn.split(",").map(s => s.trim()).filter(Boolean) : [],
    antonyms: (compact.ant ? compact.ant.split(",").map(s => s.trim()).filter(Boolean) : [])
      .concat(!compact.ant && ANTONYM_PAIRS[w] ? [ANTONYM_PAIRS[w]] : []),
    commonErrors: [],
    contexts: [category],
    tags: [category, cefr],
    collocations,
    chunks: [],
    wordFamily: {
      base: compact.w,
      forms: morph.suffix ? [{ word: w, partOfSpeech: morph.suffix.creates }] : [],
    },
    roots: morph.root ? [{ form: morph.root.form, meaning: morph.root.meaning, origin: morph.root.origin }] : [],
    prefixes: morph.prefix ? [{ form: morph.prefix.form, meaning: morph.prefix.meaning }] : [],
    suffixes: morph.suffix ? [{ form: morph.suffix.form, meaning: morph.suffix.meaning, creates: morph.suffix.creates }] : [],
    syllableCount: syllables,
  };
}

/**
 * 增强已有词条：为手工词库（beginner-words 等）补齐生成字段。
 * 只填空缺，不覆盖已有的人工数据。
 */
export function enrichVocabularyItem(item: VocabularyItem): VocabularyItem {
  const w = item.word.toLowerCase();
  const pos = item.partOfSpeech?.length ? item.partOfSpeech : parsePos("n");
  const mm = { ...(item.memoryMethods || {}) } as VocabularyItem["memoryMethods"];

  // 谐音注音
  if (!mm.chinesePronHint) mm.chinesePronHint = ipaToHomophone(item.ipa || "") || letterHomophone(w);
  // 自然拼读
  if (!item.phonicsBreakdown || item.phonicsBreakdown === w) {
    const syl = countSyllables(w, item.ipa || "");
    item.phonicsBreakdown = `${syl >= 2 ? w.split(/(?=[aeiou])/).slice(0, 5).join("-") : w} ｜ ${generatePhonics(w)}`;
  }
  if (!item.syllableCount) item.syllableCount = countSyllables(w, item.ipa || "");
  // 词根·词源
  const morph = analyzeMorphology(w);
  if (!mm.root) mm.root = morph.note || undefined;
  if (morph.prefix && !mm.prefix) mm.prefix = morph.prefix.meaning;
  if (morph.suffix && !mm.suffix) mm.suffix = morph.suffix.meaning;
  if (item.roots?.length === 0 && morph.root) item.roots = [{ form: morph.root.form, meaning: morph.root.meaning, origin: morph.root.origin }];
  if (item.prefixes?.length === 0 && morph.prefix) item.prefixes = [{ form: morph.prefix.form, meaning: morph.prefix.meaning }];
  if (item.suffixes?.length === 0 && morph.suffix) item.suffixes = [{ form: morph.suffix.form, meaning: morph.suffix.meaning, creates: morph.suffix.creates }];
  // 联想
  if (!mm.association) mm.association = generateAssociation(w, item.chineseMeaning, morph);
  // 对比 + 故事
  if (!mm.mnemonic) {
    mm.mnemonic = `⚖️ 对比记忆：${generateComparison(item.word, item.chineseMeaning)}\n🎬 故事串联：${generateStory(item.word, item.chineseMeaning)}`;
  }
  // 用法
  if (!(mm as any).usage) (mm as any).usage = generateUsage(item.word, pos, item.chineseMeaning);
  // 搭配
  if (!item.collocations || item.collocations.length === 0) {
    item.collocations = buildCollocations(item.word, pos, item.chineseMeaning);
  }
  // 反义词兜底
  if ((!item.antonyms || item.antonyms.length === 0) && ANTONYM_PAIRS[w]) {
    item.antonyms = [ANTONYM_PAIRS[w]];
  }
  item.memoryMethods = mm;
  return item;
}

export function generateWordBatch(
  words: CompactWord[],
  startId: number,
  category: string,
  cefrOverride?: "A1" | "A2" | "B1" | "B2" | "C1" | "C2"
): VocabularyItem[] {
  return words.map((w, i) =>
    generateWord(w, `${startId + i}_${w.w}`, category, cefrOverride)
  );
}

export function generateFullVocabulary(
  categories: Array<{ name: string; words: CompactWord[]; cefr?: "A1" | "A2" | "B1" | "B2" | "C1" | "C2" }>
): VocabularyItem[] {
  const allWords: VocabularyItem[] = [];
  let idCounter = 0;
  for (const cat of categories) {
    const words = generateWordBatch(cat.words, idCounter, cat.name, cat.cefr);
    allWords.push(...words);
    idCounter += cat.words.length;
  }
  return allWords;
}
