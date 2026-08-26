/**
 * Level Path Engine — 零基础到C2的完整通关体系
 *
 * 6个等级（A1→C2），每个等级有明确的达标条件：
 * - 词汇量要求
 * - 必修语法点
 * - 阅读/听力/写作任务数
 * - 里程碑测试（≥80%通过才能解锁下一级）
 */

import { DEDUPLICATED_VOCABULARY } from "../vocabulary/data/all-words";
import { ALL_GRAMMAR_RULES } from "../grammar/data/grammar-kb";

export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export interface LevelRequirement {
  level: CEFRLevel;
  name: string;
  nameZh: string;
  description: string;
  descriptionZh: string;
  vocabTarget: number;        // 该级别需掌握的词汇量
  grammarIds: string[];       // 必修语法规则ID列表
  readingCount: number;       // 阅读任务数
  listeningCount: number;     // 听力任务数
  writingCount: number;       // 写作任务数
  speakingCount: number;      // 跟读/口语任务数
  quizPassRate: number;       // 里程碑测试通过线 (0-100)
  quizQuestionCount: number;  // 里程碑测试题数
  estimatedWeeks: [number, number]; // 预计学习周数范围（按每天2小时）
  canDo: string[];            // 达成后能做什么
}

// ============================================================
// 六个等级定义
// ============================================================

function grammarByLevels(levels: string[], count: number): string[] {
  return ALL_GRAMMAR_RULES.filter(r => levels.includes(r.level)).slice(0, count).map(r => r.id);
}

export const LEVEL_REQUIREMENTS: Record<CEFRLevel, LevelRequirement> = {
  A1: {
    level: "A1",
    name: "Beginner",
    nameZh: "入门",
    description: "Absolute beginner starting from zero.",
    descriptionZh: "零基础起步：字母、发音、问候、数字、基础日常词。",
    vocabTarget: 500,
    grammarIds: grammarByLevels(["A1"], 20),
    readingCount: 10,
    listeningCount: 10,
    writingCount: 5,
    speakingCount: 10,
    quizPassRate: 80,
    quizQuestionCount: 20,
    estimatedWeeks: [4, 8],
    canDo: [
      "听懂慢速的简单问候和自我介绍",
      "说出自己的名字、年龄、职业",
      "读懂简单的标识和短句",
      "写出简单自我介绍（3-5句）",
    ],
  },
  A2: {
    level: "A2",
    name: "Elementary",
    nameZh: "初级",
    description: "Everyday routines, shopping, travel basics.",
    descriptionZh: "日常生活：购物点餐、问路、家庭、过去的事。",
    vocabTarget: 1800,
    grammarIds: grammarByLevels(["A1", "A2"], 45),
    readingCount: 25,
    listeningCount: 25,
    writingCount: 15,
    speakingCount: 25,
    quizPassRate: 80,
    quizQuestionCount: 25,
    estimatedWeeks: [6, 12],
    canDo: [
      "完成购物、点餐、问路等基本对话",
      "描述昨天做了什么（过去时）",
      "读懂简短通知和便条",
      "写简短留言和日记",
    ],
  },
  B1: {
    level: "B1",
    name: "Intermediate",
    nameZh: "中级",
    description: "Opinions, plans, work and study contexts.",
    descriptionZh: "进阶表达：观点、计划、工作学习场景、经历叙述。",
    vocabTarget: 4000,
    grammarIds: grammarByLevels(["A1", "A2", "B1"], 90),
    readingCount: 50,
    listeningCount: 50,
    writingCount: 30,
    speakingCount: 50,
    quizPassRate: 80,
    quizQuestionCount: 30,
    estimatedWeeks: [8, 16],
    canDo: [
      "就熟悉话题表达观点并说明理由",
      "应对旅行中大部分突发情况",
      "看懂新闻大意和常见邮件",
      "写有连贯段落的小短文",
    ],
  },
  B2: {
    level: "B2",
    name: "Upper Intermediate",
    nameZh: "中高级",
    description: "Complex topics, debates, native-speed media.",
    descriptionZh: "复杂话题：辩论、职场沟通、原速影视新闻。",
    vocabTarget: 8000,
    grammarIds: grammarByLevels(["A1", "A2", "B1", "B2"], 150),
    readingCount: 90,
    listeningCount: 90,
    writingCount: 60,
    speakingCount: 90,
    quizPassRate: 80,
    quizQuestionCount: 35,
    estimatedWeeks: [12, 24],
    canDo: [
      "与英语母语者自然流利地交流",
      "看懂无字幕美剧大部分内容",
      "阅读英文报刊文章",
      "写结构完整的议论文和工作报告",
    ],
  },
  C1: {
    level: "C1",
    name: "Advanced",
    nameZh: "高级",
    description: "Professional, academic, nuanced expression.",
    descriptionZh: "专业与学术：精准表达、隐含含义、长篇写作。",
    vocabTarget: 14000,
    grammarIds: grammarByLevels(["A1", "A2", "B1", "B2", "C1"], 190),
    readingCount: 140,
    listeningCount: 140,
    writingCount: 100,
    speakingCount: 140,
    quizPassRate: 85,
    quizQuestionCount: 40,
    estimatedWeeks: [16, 32],
    canDo: [
      "在工作中主持会议、谈判、演讲",
      "理解幽默、讽刺等言外之意",
      "阅读学术文章和专业书籍",
      "写清晰流畅的长文和正式文书",
    ],
  },
  C2: {
    level: "C2",
    name: "Mastery",
    nameZh: "精通",
    description: "Near-native fluency in all contexts.",
    descriptionZh: "母语级精通：任意场合自如运用，文学欣赏。",
    vocabTarget: 20000,
    grammarIds: ALL_GRAMMAR_RULES.slice(0, 200).map(r => r.id),
    readingCount: 200,
    listeningCount: 200,
    writingCount: 150,
    speakingCount: 200,
    quizPassRate: 85,
    quizQuestionCount: 45,
    estimatedWeeks: [24, 48],
    canDo: [
      "像美国人一样生活、交流、娱乐",
      "发表英文文章和专业论述",
      "听懂任何语速的演讲和对话",
      "撰写出版级别的英文内容",
    ],
  },
};

export const LEVEL_ORDER: CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

// ============================================================
// 用户等级状态持久化
// ============================================================

const STORAGE_KEY = "english360_level_path";

export interface UserPathState {
  currentLevel: CEFRLevel;
  unlockedLevels: CEFRLevel[];
  passedTests: Partial<Record<CEFRLevel, { score: number; date: string }>>;
  completedTasks: {
    reading: number;
    listening: number;
    writing: number;
    speaking: number;
  };
  wordsMastered: number;
  placementDone: boolean;
}

export function loadPathState(): UserPathState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* ignore */ }
  return defaultPathState();
}

export function savePathState(state: UserPathState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) { /* ignore */ }
}

export function defaultPathState(): UserPathState {
  return {
    currentLevel: "A1",
    unlockedLevels: ["A1"],
    passedTests: {},
    completedTasks: { reading: 0, listening: 0, writing: 0, speaking: 0 },
    wordsMastered: 0,
    placementDone: false,
  };
}

/** 记录里程碑测试结果；≥通过线则解锁下一级 */
export function recordTestResult(level: CEFRLevel, scorePct: number): UserPathState {
  const state = loadPathState();
  const req = LEVEL_REQUIREMENTS[level];
  const passed = scorePct >= req.quizPassRate;

  if (passed) {
    const idx = LEVEL_ORDER.indexOf(level);
    const next = LEVEL_ORDER[idx + 1];
    state.passedTests[level] = { score: scorePct, date: new Date().toISOString() };
    if (next && !state.unlockedLevels.includes(next)) {
      state.unlockedLevels.push(next);
    }
    // 当前等级推进到最高已解锁等级
    const highestUnlocked = LEVEL_ORDER.filter(l => state.unlockedLevels.includes(l));
    state.currentLevel = highestUnlocked[highestUnlocked.length - 1];
  }
  state.placementDone = true;
  savePathState(state);
  return state;
}

/** 记录放置测试结果（首次水平定位） */
export function recordPlacement(level: CEFRLevel): UserPathState {
  const state = loadPathState();
  const idx = LEVEL_ORDER.indexOf(level);
  state.unlockedLevels = LEVEL_ORDER.slice(0, idx + 1);
  state.currentLevel = level;
  state.placementDone = true;
  savePathState(state);
  return state;
}

// ============================================================
// 每级学习材料获取
// ============================================================

export function getLevelVocabulary(level: CEFRLevel) {
  const prevIdx = LEVEL_ORDER.indexOf(level) - 1;
  const prevTarget = prevIdx >= 0 ? LEVEL_REQUIREMENTS[LEVEL_ORDER[prevIdx]].vocabTarget : 0;
  const target = LEVEL_REQUIREMENTS[level].vocabTarget;
  const pool = DEDUPLICATED_VOCABULARY.filter(w => w.cefr === level);
  const needed = target - prevTarget;
  return pool.length >= needed ? pool : DEDUPLICATED_VOCABULARY.slice(prevTarget, target);
}

export function getLevelGrammar(level: CEFRLevel) {
  const ids = new Set(LEVEL_REQUIREMENTS[level].grammarIds);
  return ALL_GRAMMAR_RULES.filter(r => ids.has(r.id));
}

/** 检查某等级是否所有达标条件满足 */
export function checkRequirementStatus(level: CEFRLevel, state: UserPathState) {
  const req = LEVEL_REQUIREMENTS[level];
  return {
    vocabOk: state.wordsMastered >= req.vocabTarget,
    tasksOk:
      state.completedTasks.reading >= req.readingCount &&
      state.completedTasks.listening >= req.listeningCount &&
      state.completedTasks.writing >= req.writingCount &&
      state.completedTasks.speaking >= req.speakingCount,
    testPassed: !!state.passedTests[level],
  };
}
