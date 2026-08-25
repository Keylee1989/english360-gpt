/**
 * Media Library & Learning Resources Page
 * 
 * One-stop page for all learning materials:
 * - Vocabulary by CEFR level
 * - Grammar rules by topic
 * - Audio resources
 * - Learning paths
 */

import { useState, useMemo } from "react";
import { DEDUPLICATED_VOCABULARY, VOCABULARY_STATS } from "@/engines/vocabulary/data/all-words";
import { ALL_GRAMMAR_RULES, GRAMMAR_STATS } from "@/engines/grammar/data/grammar-kb";
import type { VocabularyItem } from "@/engines/vocabulary";
import type { GrammarRule } from "@/engines/grammar/data/grammar-kb";

// ============================================================
// CEFR Level Config
// ============================================================

const CEFR_LEVELS = [
  { key: "all", label: "全部", color: "#6b7280", desc: "所有级别" },
  { key: "A1", label: "A1", color: "#22c55e", desc: "入门 · 基础词汇和语法" },
  { key: "A2", label: "A2", color: "#84cc16", desc: "初级 · 日常生活表达" },
  { key: "B1", label: "B1", color: "#eab308", desc: "中级 · 独立交流能力" },
  { key: "B2", label: "B2", color: "#f97316", desc: "中高级 · 流利表达" },
  { key: "C1", label: "C1", color: "#ef4444", desc: "高级 · 灵活运用" },
  { key: "C2", label: "C2", color: "#9333ea", desc: "精通 · 接近母语水平" },
] as const;

const TABS = [
  { key: "vocab", label: "📚 词汇", count: VOCABULARY_STATS.TOTAL },
  { key: "grammar", label: "📖 语法", count: GRAMMAR_STATS.total },
  { key: "path", label: "🗺️ 学习路径", count: 0 },
] as const;



// ============================================================
// Components
// ============================================================

function VocabCard({ word }: { word: VocabularyItem }) {
  const [expanded, setExpanded] = useState(false);
  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "en-US";
      u.rate = 0.8;
      speechSynthesis.speak(u);
    }
  };

  return (
    <div
      className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center justify-between">
        <div>
          <span className="font-bold text-lg">{word.word}</span>
          {word.ipa && <span className="text-gray-500 ml-2 text-sm">{word.ipa}</span>}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
            {word.cefr}
          </span>
          <button
            className="text-blue-500 hover:text-blue-700 p-1"
            onClick={(e) => { e.stopPropagation(); speak(word.word); }}
          >
            🔊
          </button>
        </div>
      </div>
      <div className="text-gray-600 mt-1">{word.chineseMeaning}</div>
      {word.partOfSpeech?.[0] && (
        <span className="text-xs text-gray-400 mt-1 inline-block">
          {word.partOfSpeech.join("/")}
        </span>
      )}
      {expanded && (
        <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
          {word.examples?.slice(0, 2).map((ex, i) => (
            <div key={i} className="text-sm">
              <div className="text-gray-800">{ex.english}</div>
              <div className="text-gray-500">{ex.chinese}</div>
            </div>
          ))}
          {word.memoryMethods?.association && (
            <div className="text-sm text-green-600">
              💡 记忆法：{word.memoryMethods.association}
            </div>
          )}
          {word.synonyms && word.synonyms.length > 0 && (
            <div className="text-sm text-gray-500">
              同义词：{word.synonyms.join(", ")}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function GrammarCard({ rule }: { rule: GrammarRule }) {
  const [expanded, setExpanded] = useState(false);
  const levelColor: Record<string, string> = {
    A1: "bg-green-100 text-green-700",
    A2: "bg-lime-100 text-lime-700",
    B1: "bg-yellow-100 text-yellow-700",
    B2: "bg-orange-100 text-orange-700",
    C1: "bg-red-100 text-red-700",
    C2: "bg-purple-100 text-purple-700",
  };

  return (
    <div
      className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center justify-between">
        <div>
          <span className="font-bold">{rule.titleChinese}</span>
          <span className="text-gray-500 text-sm ml-2">{rule.title}</span>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full ${levelColor[rule.level] || "bg-gray-100"}`}>
          {rule.level}
        </span>
      </div>
      <div className="text-gray-600 text-sm mt-1 line-clamp-2">
        {rule.explanationChinese}
      </div>
      {expanded && (
        <div className="mt-3 pt-3 border-t border-gray-100 space-y-3">
          <div className="text-sm text-gray-700">{rule.explanation}</div>
          {rule.examples.map((ex, i) => (
            <div key={i} className="text-sm bg-gray-50 rounded p-2">
              {ex.incorrect && (
                <div className="text-red-500">❌ {ex.incorrect}</div>
              )}
              <div className="text-green-600">✅ {ex.correct}</div>
              <div className="text-gray-500">{ex.chinese}</div>
            </div>
          ))}
          {rule.tips.length > 0 && (
            <div className="text-sm">
              <span className="font-medium">💡 要点：</span>
              <ul className="list-disc list-inside text-gray-600 mt-1">
                {rule.tips.map((tip, i) => <li key={i}>{tip}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function LearningPathTab() {
  const paths = [
    {
      level: "A1", weeks: "1-8", words: "500", desc: "基础入门",
      topics: ["字母和发音", "数字和时间", "问候和自我介绍", "家庭成员", "食物和饮料", "简单句型", "现在时态", "基础问句"],
    },
    {
      level: "A2", weeks: "9-20", words: "2000", desc: "初级日常",
      topics: ["日常生活", "购物和消费", "餐厅和食物", "交通和旅行", "工作和职业", "情感表达", "过去和将来时态", "简单对话"],
    },
    {
      level: "B1", weeks: "21-36", words: "5000", desc: "中级交流",
      topics: ["工作沟通", "社会话题", "表达观点", "讲述经历", "故事叙述", "问题解决", "复杂时态", "间接引语"],
    },
    {
      level: "B2", weeks: "37-52", words: "10000", desc: "中高级流利",
      topics: ["商务英语", "新闻理解", "辩论表达", "学术讨论", "文化话题", "高级语法", "正式写作", "演讲表达"],
    },
    {
      level: "C1", weeks: "53-72", words: "15000", desc: "高级运用",
      topics: ["专业英语", "文学欣赏", "哲学思辨", "法律科技", "媒体分析", "学术写作", "高级修辞", "抽象表达"],
    },
    {
      level: "C2", weeks: "73-108", words: "20000+", desc: "精通水平",
      topics: ["母语级交流", "专业领域", "文化深度", "批判思维", "创意写作", "幽默双关", "习语谚语", "学术研究"],
    },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="font-bold text-blue-800">🎯 学习目标</h3>
        <p className="text-sm text-blue-700 mt-1">
          从零基础到接近母语水平，系统覆盖 A1-C2 全部 CEFR 等级。
          每天2-4小时，预计2年完成全部课程。
        </p>
      </div>
      {paths.map((p) => (
        <div key={p.level} className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className={`text-lg font-bold px-3 py-1 rounded-full ${
                p.level === "A1" ? "bg-green-100 text-green-700" :
                p.level === "A2" ? "bg-lime-100 text-lime-700" :
                p.level === "B1" ? "bg-yellow-100 text-yellow-700" :
                p.level === "B2" ? "bg-orange-100 text-orange-700" :
                p.level === "C1" ? "bg-red-100 text-red-700" :
                "bg-purple-100 text-purple-700"
              }`}>{p.level}</span>
              <span className="font-medium">{p.desc}</span>
            </div>
            <div className="text-sm text-gray-500">
              第{p.weeks}周 · {p.words}词
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {p.topics.map((t) => (
              <span key={t} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                {t}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// Main Page
// ============================================================

export default function MediaLibraryPage() {
  const [activeTab, setActiveTab] = useState<"vocab" | "grammar" | "path">("vocab");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [grammarCategory, setGrammarCategory] = useState("all");

  // Filter vocabulary
  const filteredVocab = useMemo(() => {
    let words = DEDUPLICATED_VOCABULARY;
    if (selectedLevel !== "all") {
      words = words.filter((w) => w.cefr === selectedLevel);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      words = words.filter(
        (w) =>
          w.word.toLowerCase().includes(q) ||
          w.chineseMeaning.includes(q) ||
          w.ipa?.includes(q)
      );
    }
    return words.slice(0, 200); // Limit for performance
  }, [selectedLevel, searchQuery]);

  // Filter grammar
  const filteredGrammar = useMemo(() => {
    let rules = ALL_GRAMMAR_RULES;
    if (grammarCategory !== "all") {
      rules = rules.filter((r) => r.category === grammarCategory);
    }
    if (selectedLevel !== "all") {
      rules = rules.filter((r) => r.level === selectedLevel);
    }
    return rules;
  }, [grammarCategory, selectedLevel]);

  const grammarCategories = [...new Set(ALL_GRAMMAR_RULES.map((r) => r.category))];

  // Get vocab count by level
  const getLevelCount = (level: string) => {
    if (level === "all") return VOCABULARY_STATS.TOTAL;
    return DEDUPLICATED_VOCABULARY.filter((w) => w.cefr === level).length;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3">
        <h1 className="text-xl font-bold">📚 学习资源库</h1>
        <p className="text-sm text-gray-500 mt-1">
          {VOCABULARY_STATS.TOTAL.toLocaleString()} 词汇 · {GRAMMAR_STATS.total} 语法规则 · 覆盖 A1-C2
        </p>
      </div>

      {/* Tabs */}
      <div className="flex bg-white border-b">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`flex-1 py-3 text-center font-medium transition-colors ${
              activeTab === tab.key
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className="ml-1 text-xs bg-gray-100 px-1.5 py-0.5 rounded-full">
                {tab.count.toLocaleString()}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="p-4">
        {/* CEFR Level Filter */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-4">
          {CEFR_LEVELS.map((l) => (
            <button
              key={l.key}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedLevel === l.key
                  ? "text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              style={selectedLevel === l.key ? { backgroundColor: l.color } : {}}
              onClick={() => setSelectedLevel(l.key)}
            >
              {l.label}
              {getLevelCount(l.key) > 0 && (
                <span className="ml-1 text-xs opacity-80">
                  {getLevelCount(l.key).toLocaleString()}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Vocabulary Tab */}
        {activeTab === "vocab" && (
          <div className="space-y-3">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="搜索词汇（英文/中文/IPA）..."
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  className="absolute right-3 top-3 text-gray-400"
                  onClick={() => setSearchQuery("")}
                >
                  ✕
                </button>
              )}
            </div>
            <div className="text-sm text-gray-500">
              显示 {filteredVocab.length} 个词汇
              {searchQuery && ` (搜索: "${searchQuery}")`}
              {selectedLevel !== "all" && ` (${selectedLevel})`}
            </div>
            <div className="space-y-2">
              {filteredVocab.map((word) => (
                <VocabCard key={word.id} word={word} />
              ))}
            </div>
            {filteredVocab.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                没有找到匹配的词汇
              </div>
            )}
          </div>
        )}

        {/* Grammar Tab */}
        {activeTab === "grammar" && (
          <div className="space-y-3">
            {/* Category filter */}
            <select
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              value={grammarCategory}
              onChange={(e) => setGrammarCategory(e.target.value)}
            >
              <option value="all">全部语法类别 ({ALL_GRAMMAR_RULES.length})</option>
              {grammarCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat} ({ALL_GRAMMAR_RULES.filter((r) => r.category === cat).length})
                </option>
              ))}
            </select>
            <div className="text-sm text-gray-500">
              显示 {filteredGrammar.length} 条语法规则
            </div>
            <div className="space-y-2">
              {filteredGrammar.map((rule) => (
                <GrammarCard key={rule.id} rule={rule} />
              ))}
            </div>
          </div>
        )}

        {/* Learning Path Tab */}
        {activeTab === "path" && <LearningPathTab />}
      </div>
    </div>
  );
}
