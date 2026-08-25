/**
 * Vocabulary Generator
 * Generates full VocabularyItem entries with:
 * - Memory methods (谐音, 联想, 词根, 自然拼读, 对比记忆)
 * - Collocations
 * - Usage notes
 * - IPA pronunciation
 * - Example sentences
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

const EXAMPLE_TEMPLATES: Record<string, Array<{ en: string; zh: string }>> = {
  n: [
    { en: "I need a new {w}.", zh: "我需要一个新的{zh}。" },
    { en: "This {w} is very good.", zh: "这个{zh}非常好。" },
  ],
  v: [
    { en: "I {w} every day.", zh: "我每天{zh}。" },
    { en: "She likes to {w}.", zh: "她喜欢{zh}。" },
  ],
  adj: [
    { en: "It is very {w}.", zh: "它非常{zh}。" },
    { en: "The food tastes {w}.", zh: "食物尝起来很{zh}。" },
  ],
  adv: [
    { en: "He runs very {w}.", zh: "他跑得非常{zh}。" },
    { en: "She speaks {w}.", zh: "她说得很{zh}。" },
  ],
};

const HIGH_FREQ = new Set([
  "the","be","to","of","and","a","in","that","have","i","it","for","not","on",
  "with","he","as","you","do","at","this","but","his","by","from","they","we",
  "say","her","she","or","an","will","my","one","all","would","there","their",
  "what","so","up","out","if","about","who","get","which","go","me","when",
  "make","can","like","time","no","just","him","know","take","people","into",
  "year","your","good","some","could","them","see","other","than","then",
  "now","look","only","come","its","over","think","also","back","after","use",
  "two","how","our","work","first","well","way","even","new","want","because",
  "any","these","give","day","most","us",
]);

// ============================================================
// Memory Method Generators
// ============================================================

function generateMemoryAssociation(word: string, zh: string): string {
  const w = word.toLowerCase();
  const len = w.length;
  if (len <= 3) return `短词联想: ${w} → ${zh}，常见高频词，多读几遍自然记住`;
  if (len <= 5) return `词形联想: ${w} → 注意字母组合，${zh}`;
  return `词根联想: ${w}(${zh})，根据词根词缀理解含义`;
}

function generateChinesePronHint(word: string): string {
  const w = word.toLowerCase();
  const syllables: string[] = [];
  let i = 0;
  while (i < w.length && syllables.length < 4) {
    if ('aeiou'.includes(w[i])) {
      let syll = '';
      if (i > 0) syll += w[i - 1];
      syll += w[i];
      if (i + 1 < w.length && !'aeiou'.includes(w[i + 1]) && i + 2 < w.length && 'aeiou'.includes(w[i + 2])) {
        syll += w[i + 1];
        i += 2;
      } else if (i + 1 < w.length && !'aeiou'.includes(w[i + 1])) {
        syll += w[i + 1];
        i += 2;
      } else {
        i++;
      }
      syllables.push(syll);
    } else {
      i++;
    }
  }
  return syllables.join('-') || w;
}

function generateVisualHint(word: string, zh: string): string {
  const w = word.toLowerCase();
  if (w.startsWith('un') || w.startsWith('dis')) return `否定前缀 ${w.slice(0, 2)}- 表示"不/非" → ${zh}`;
  if (w.startsWith('pre')) return `前缀 pre- 表示"之前" → ${zh}`;
  if (w.startsWith('re')) return `前缀 re- 表示"再次" → ${zh}`;
  if (w.endsWith('tion') || w.endsWith('sion')) return `后缀 -tion/-sion → 名词 ${zh}`;
  if (w.endsWith('ly')) return `后缀 -ly → 副词 ${zh}`;
  if (w.endsWith('ful')) return `后缀 -ful → 充满...的 ${zh}`;
  if (w.endsWith('less')) return `后缀 -less → 没有...的 ${zh}`;
  if (w.endsWith('er') || w.endsWith('or')) return `后缀 -er/-or → 做...的人 ${zh}`;
  if (w.endsWith('ment')) return `后缀 -ment → 名词 ${zh}`;
  if (w.endsWith('ness')) return `后缀 -ness → 名词 ${zh}`;
  if (w.endsWith('ize') || w.endsWith('ise')) return `后缀 -ize → 动词化 ${zh}`;
  return `${w} → ${zh}，注意词形特征`;
}

function generateStoryHint(word: string, zh: string): string {
  const w = word.toLowerCase();
  if (w.length <= 3) return `短词故事: 想象每天都在说"${w}"，因为"${zh}"对你很重要`;
  return `故事记忆: 想象一个场景中反复使用"${w}"，场景中有"${zh}"`;
}

function generateRootHint(word: string): string {
  const w = word.toLowerCase();
  const roots: Record<string, string> = {
    'spect': '看(inspect, respect)', 'port': '携带(import, export)',
    'duct': '引导(conduct, produce)', 'struct': '建造(structure)',
    'vis': '看(visit, vision)', 'scrib': '写(describe)',
    'aud': '听(audience)', 'dict': '说(predict, dictionary)',
    'fact': '做(manufacture)', 'ject': '投射(reject, project)',
    'mit': '送(transmit, commit)', 'form': '形状(reform, information)',
    'graph': '写(biography)', 'log': '学(biology)',
    'phon': '声音(telephone)', 'scope': '看(telescope)',
    'vert': '转(convert)', 'voc': '声音(vocabulary)',
  };
  for (const [root, meaning] of Object.entries(roots)) {
    if (w.includes(root)) return `词根 ${root} = ${meaning}`;
  }
  return `${w} → 尝试拆分前缀+词根+后缀理解含义`;
}

function generateComparisonHint(word: string, zh: string): string {
  const pairs: Record<string, string> = {
    'big': 'big↔small(大↔小)', 'good': 'good↔bad(好↔坏)',
    'hot': 'hot↔cold(热↔冷)', 'fast': 'fast↔slow(快↔慢)',
    'happy': 'happy↔sad(开心↔难过)', 'new': 'new↔old(新↔旧)',
    'long': 'long↔short(长↔短)', 'high': 'high↔low(高↔低)',
    'easy': 'easy↔hard(容易↔困难)', 'rich': 'rich↔poor(富↔穷)',
  };
  return pairs[word.toLowerCase()] || `${word}(${zh}) → 找到反义词对比记忆`;
}

// ============================================================
// Collocations
// ============================================================

const COLLOCATIONS_RAW: Record<string, string[]> = {
  make: ['make a plan', 'make friends', 'make a mistake', 'make money'],
  do: ['do homework', 'do exercise', 'do the dishes', 'do business'],
  take: ['take a photo', 'take a break', 'take notes', 'take action'],
  have: ['have a look', 'have a rest', 'have fun', 'have trouble'],
  get: ['get ready', 'get along with', 'get used to', 'get over'],
  give: ['give a hand', 'give a try', 'give up', 'give advice'],
  break: ['break the ice', 'break the record', 'break a promise'],
  pay: ['pay attention', 'pay a visit', 'pay the bill'],
  catch: ['catch a cold', 'catch up with', 'catch a bus'],
  keep: ['keep a promise', 'keep in touch', 'keep calm'],
  hold: ['hold a meeting', 'hold hands', 'hold on'],
  run: ['run out of', 'run into', 'run a business'],
  turn: ['turn on/off', 'turn up/down', 'turn out'],
  set: ['set up', 'set off', 'set an example'],
  put: ['put on', 'put off', 'put up with'],
  work: ['work out', 'work on', 'work hard'],
  time: ['on time', 'in time', 'at the same time'],
  way: ['in a way', 'on the way', 'by the way'],
  hand: ['on the other hand', 'by hand', 'shake hands'],
  heart: ['by heart', 'lose heart'],
  eye: ['keep an eye on', 'see eye to eye'],
  life: ['in real life', 'come to life'],
  day: ['day by day', 'one day', 'day off'],
  world: ['around the world', 'in the world'],
  home: ['at home', 'feel at home'],
  money: ['save money', 'spend money', 'make money'],
  friend: ['make friends', 'best friend', 'true friend'],
  love: ['fall in love', 'love at first sight'],
  happy: ['happy birthday', 'happy new year'],
  bad: ['go bad', 'bad luck'],
  big: ['a big deal', 'big picture'],
  long: ['as long as', 'no longer'],
  hard: ['work hard', 'hard working'],
  free: ['for free', 'feel free'],
  open: ['open up', 'open minded'],
  early: ['early bird', 'early on'],
  fast: ['fast food', 'fast asleep'],
  slow: ['slow down', 'slowly but surely'],
  new: ['brand new', 'new generation'],
  good: ['good morning', 'do good'],
  great: ['great deal', 'great time'],
  true: ['come true', 'true story'],
  real: ['for real', 'real life'],
  clean: ['clean up', 'clean break'],
  dark: ['in the dark', 'dark side'],
  fresh: ['fresh air', 'fresh start'],
  sweet: ['sweet dreams', 'sweet home'],
  hot: ['hot dog', 'hot topic'],
  cold: ['catch a cold', 'cold shoulder'],
  fire: ['on fire', 'set fire'],
  rain: ['rain cats and dogs', 'heavy rain'],
  wind: ['strong wind', 'go with the wind'],
  bird: ['early bird', "bird's eye view"],
  cat: ['curiosity killed the cat'],
  dog: ['hot dog', 'dog tired'],
  horse: ['hold your horses', 'dark horse'],
  bear: ['bear in mind', 'bear with me'],
  water: ['cold water', 'hot water'],
  air: ['fresh air', 'by air'],
  book: ['read a book', 'book a ticket'],
  door: ['knock on the door', 'door to door'],
  car: ['drive a car', 'by car'],
  bus: ['take the bus', 'by bus'],
  train: ['take the train', 'by train'],
  food: ['junk food', 'fast food'],
  school: ['go to school', 'at school'],
  sun: ['in the sun', 'under the sun'],
  sky: ['on cloud nine', 'sky high'],
  earth: ['on earth', 'down to earth'],
  sea: ['by the sea', 'at sea'],
  tree: ['family tree'],
  flower: ['flower garden', 'late bloomer'],
  grass: ['on the grass', 'the grass is greener'],
  fish: ['fish for', 'bigger fish to fry'],
  wolf: ['cry wolf', 'lone wolf'],
  lion: ['lion heart', 'brave as a lion'],
  tiger: ['paper tiger'],
  snake: ['snake in the grass'],
  chicken: ['chicken out', 'chicken soup'],
  mouse: ['quiet as a mouse', 'mouse pad'],
  bee: ['busy as a bee', "the bee's knees"],
  ant: ['work like ants'],
  worm: ['bookworm', 'can of worms'],
  fox: ['crazy like a fox'],
  rabbit: ['rabbit hole'],
  duck: ['sitting duck', 'lame duck'],
  goose: ['silly goose', 'golden goose'],
  pig: ['pig out', 'piggy bank'],
  cow: ['cash cow', 'holy cow'],
  sheep: ['black sheep', 'count sheep'],
  whale: ['a whale of a time'],
  dolphin: ['dolphin friendly'],
  shark: ['loan shark'],
  turtle: ['turtle neck', 'turtle pace'],
  frog: ['frog in one\'s throat'],
  star: ['movie star', 'lucky star'],
  moon: ['moonlight', 'once in a blue moon'],
  cloud: ['on cloud nine', 'every cloud has a silver lining'],
  storm: ['weather the storm', 'storm in a teacup'],
  rock: ['on the rocks', 'rock solid'],
  sand: ['bury in the sand'],
  mountain: ['move mountains'],
  river: ['cross the river'],
  forest: ['in the forest', 'forest fire'],
  voice: ['raise your voice', 'lose your voice'],
  face: ['face to face', 'lose face'],
  word: ['word for word', 'in other words'],
  paper: ['on paper', 'newspaper'],
  table: ['at the table', 'on the table'],
  chair: ['sit in a chair', 'take a seat'],
  window: ['out the window', 'window shopping'],
};

// ============================================================
// Main Generator
// ============================================================

export function generateWord(
  compact: CompactWord,
  id: string,
  category: string,
  cefrOverride?: "A1" | "A2" | "B1" | "B2" | "C1" | "C2"
): VocabularyItem {
  const pos = POS_MAP[compact.pos] || ["noun"];
  const difficulty = DIFF_MAP[compact.dif] || "medium";
  const cefr = cefrOverride || CEFR_MAP[compact.dif] || "A2";

  const rawExamples = compact.ex
    ? [{ en: compact.ex, zh: compact.exzh }]
    : generateExamples(compact.w, compact.pos, compact.zh);
  const examples = rawExamples.map(e => ({
    english: e.en,
    chinese: e.zh,
    register: "informal" as const,
  }));

  return {
    id: `vocab_${id}`,
    word: compact.w,
    chineseMeaning: compact.zh,
    ipa: compact.ipa,
    phonicsBreakdown: generateChinesePronHint(compact.w),
    partOfSpeech: pos,
    cefr,
    difficulty,
    frequency: getFrequencyRank(compact.w),
    examples,
    memoryMethods: {
      association: compact.mem || generateMemoryAssociation(compact.w, compact.zh),
      chinesePronHint: generateChinesePronHint(compact.w),
      root: generateRootHint(compact.w),
      mnemonic: `${generateVisualHint(compact.w, compact.zh)} | ${generateStoryHint(compact.w, compact.zh)} | ${generateComparisonHint(compact.w, compact.zh)}`,
    },
    synonyms: compact.syn ? compact.syn.split(",").map(s => s.trim()) : [],
    antonyms: compact.ant ? compact.ant.split(",").map(s => s.trim()) : [],
    commonErrors: [],
    contexts: [category],
    tags: [category],
    collocations: (COLLOCATIONS_RAW[compact.w.toLowerCase()] || []).map(c => ({ pattern: c, chinese: '', frequency: 1, example: '' })),
    chunks: [],
    wordFamily: { base: compact.w, forms: [] },
    roots: [],
    prefixes: [],
    suffixes: [],
    syllableCount: 1,
  };
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

function generateExamples(word: string, pos: string, zh: string): { en: string; zh: string }[] {
  const templates = EXAMPLE_TEMPLATES[pos] || EXAMPLE_TEMPLATES.n;
  return templates.map(t => ({
    en: t.en.replace("{w}", word),
    zh: t.zh.replace("{zh}", zh),
  }));
}

function getFrequencyRank(word: string): number {
  if (HIGH_FREQ.has(word.toLowerCase())) {
    return Array.from(HIGH_FREQ).indexOf(word.toLowerCase()) + 1;
  }
  return 500 + Math.floor(Math.random() * 2000);
}
