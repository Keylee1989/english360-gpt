/**
 * Media Library & Learning Resources Page
 * 
 * One-stop page for all learning materials:
 * - 20,000+ vocabulary with IPA, Chinese, examples
 * - 200+ grammar rules with examples
 * - External learning resources by CEFR level
 * - Learning path visualization
 */

import { useState, useMemo } from "react";
import { DEDUPLICATED_VOCABULARY, VOCABULARY_STATS } from "@/engines/vocabulary/data/all-words";
import { ALL_GRAMMAR_RULES, GRAMMAR_STATS } from "@/engines/grammar/data/grammar-kb";
import type { VocabularyItem } from "@/engines/vocabulary";
import type { GrammarRule } from "@/engines/grammar/data/grammar-kb";

const CEFR_LEVELS = [
  { key: "all", label: "全部", color: "#6b7280" },
  { key: "A1", label: "A1", color: "#22c55e" },
  { key: "A2", label: "A2", color: "#84cc16" },
  { key: "B1", label: "B1", color: "#eab308" },
  { key: "B2", label: "B2", color: "#f97316" },
  { key: "C1", label: "C1", color: "#ef4444" },
  { key: "C2", label: "C2", color: "#9333ea" },
] as const;

function VocabCard({ word }: { word: VocabularyItem }) {
  const [expanded, setExpanded] = useState(false);
  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "en-US"; u.rate = 0.8;
      speechSynthesis.speak(u);
    }
  };
  return (
    <div className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setExpanded(!expanded)}>
      <div className="flex items-center justify-between">
        <div>
          <span className="font-bold text-lg">{word.word}</span>
          {word.ipa && <span className="text-gray-500 ml-2 text-sm">{word.ipa}</span>}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">{word.cefr}</span>
          <button className="text-blue-500 hover:text-blue-700 p-1" onClick={(e) => { e.stopPropagation(); speak(word.word); }}>🔊</button>
        </div>
      </div>
      <div className="text-gray-600 mt-1">{word.chineseMeaning}</div>
      {expanded && (
        <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
          {word.examples?.slice(0, 2).map((ex, i) => (
            <div key={i} className="text-sm">
              <div className="text-gray-800">{ex.english}</div>
              <div className="text-gray-500">{ex.chinese}</div>
            </div>
          ))}
          {word.memoryMethods?.association && (
            <div className="text-sm text-green-600">💡 记忆法：{word.memoryMethods.association}</div>
          )}
        </div>
      )}
    </div>
  );
}

function GrammarCard({ rule }: { rule: GrammarRule }) {
  const [expanded, setExpanded] = useState(false);
  const lc: Record<string, string> = { A1:"bg-green-100 text-green-700", A2:"bg-lime-100 text-lime-700", B1:"bg-yellow-100 text-yellow-700", B2:"bg-orange-100 text-orange-700", C1:"bg-red-100 text-red-700", C2:"bg-purple-100 text-purple-700" };
  return (
    <div className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setExpanded(!expanded)}>
      <div className="flex items-center justify-between">
        <div>
          <span className="font-bold">{rule.titleChinese}</span>
          <span className="text-gray-500 text-sm ml-2">{rule.title}</span>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full ${lc[rule.level] || "bg-gray-100"}`}>{rule.level}</span>
      </div>
      <div className="text-gray-600 text-sm mt-1 line-clamp-2">{rule.explanationChinese}</div>
      {expanded && (
        <div className="mt-3 pt-3 border-t border-gray-100 space-y-3">
          <div className="text-sm text-gray-700">{rule.explanation}</div>
          {rule.examples.map((ex, i) => (
            <div key={i} className="text-sm bg-gray-50 rounded p-2">
              {ex.incorrect && <div className="text-red-500">❌ {ex.incorrect}</div>}
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

export default function MediaLibraryPage() {
  const [activeTab, setActiveTab] = useState<"vocab" | "grammar" | "path">("vocab");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [grammarCategory, setGrammarCategory] = useState("all");

  const filteredVocab = useMemo(() => {
    let words = DEDUPLICATED_VOCABULARY;
    if (selectedLevel !== "all") words = words.filter(w => w.cefr === selectedLevel);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      words = words.filter(w => w.word.toLowerCase().includes(q) || w.chineseMeaning.includes(q) || w.ipa?.includes(q));
    }
    return words.slice(0, 200);
  }, [selectedLevel, searchQuery]);

  const filteredGrammar = useMemo(() => {
    let rules = ALL_GRAMMAR_RULES;
    if (grammarCategory !== "all") rules = rules.filter(r => r.category === grammarCategory);
    if (selectedLevel !== "all") rules = rules.filter(r => r.level === selectedLevel);
    return rules;
  }, [grammarCategory, selectedLevel]);

  const grammarCategories = [...new Set(ALL_GRAMMAR_RULES.map(r => r.category))];

  const getLevelCount = (level: string) => {
    if (level === "all") return VOCABULARY_STATS.TOTAL;
    return DEDUPLICATED_VOCABULARY.filter(w => w.cefr === level).length;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b px-4 py-3">
        <h1 className="text-xl font-bold">📚 学习资源库</h1>
        <p className="text-sm text-gray-500 mt-1">
          {VOCABULARY_STATS.TOTAL.toLocaleString()} 词汇 · {GRAMMAR_STATS.total} 语法规则 · 覆盖 A1-C2
        </p>
      </div>

      <div className="flex bg-white border-b">
        {[
          { key: "vocab" as const, label: "📚 词汇", count: VOCABULARY_STATS.TOTAL },
          { key: "grammar" as const, label: "📖 语法", count: GRAMMAR_STATS.total },
          { key: "path" as const, label: "🗺️ 学习路径", count: 0 },
        ].map(tab => (
          <button key={tab.key} className={`flex-1 py-3 text-center font-medium transition-colors ${activeTab === tab.key ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`} onClick={() => setActiveTab(tab.key)}>
            {tab.label}
            {tab.count > 0 && <span className="ml-1 text-xs bg-gray-100 px-1.5 py-0.5 rounded-full">{tab.count.toLocaleString()}</span>}
          </button>
        ))}
      </div>

      <div className="p-4">
        <div className="flex gap-2 overflow-x-auto pb-3 mb-4">
          {CEFR_LEVELS.map(l => (
            <button key={l.key} className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedLevel === l.key ? "text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`} style={selectedLevel === l.key ? { backgroundColor: l.color } : {}} onClick={() => setSelectedLevel(l.key)}>
              {l.label} {getLevelCount(l.key) > 0 && <span className="text-xs opacity-80">{getLevelCount(l.key).toLocaleString()}</span>}
            </button>
          ))}
        </div>

        {activeTab === "vocab" && (
          <div className="space-y-3">
            <div className="relative">
              <input type="text" placeholder="搜索词汇（英文/中文/IPA）..." className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              {searchQuery && <button className="absolute right-3 top-3 text-gray-400" onClick={() => setSearchQuery("")}>✕</button>}
            </div>
            <div className="text-sm text-gray-500">显示 {filteredVocab.length} 个词汇</div>
            <div className="space-y-2">
              {filteredVocab.map(word => <VocabCard key={word.id} word={word} />)}
            </div>
            {filteredVocab.length === 0 && <div className="text-center py-8 text-gray-400">没有找到匹配的词汇</div>}
          </div>
        )}

        {activeTab === "grammar" && (
          <div className="space-y-3">
            <select className="w-full px-3 py-2 border border-gray-200 rounded-lg" value={grammarCategory} onChange={e => setGrammarCategory(e.target.value)}>
              <option value="all">全部语法类别 ({ALL_GRAMMAR_RULES.length})</option>
              {grammarCategories.map(cat => (
                <option key={cat} value={cat}>{cat} ({ALL_GRAMMAR_RULES.filter(r => r.category === cat).length})</option>
              ))}
            </select>
            <div className="text-sm text-gray-500">显示 {filteredGrammar.length} 条语法规则</div>
            <div className="space-y-2">
              {filteredGrammar.map(rule => <GrammarCard key={rule.id} rule={rule} />)}
            </div>
          </div>
        )}

        {activeTab === "path" && (
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-bold text-blue-800">🎯 学习目标</h3>
              <p className="text-sm text-blue-700 mt-1">从零基础到接近母语水平，覆盖A1-C2全部CEFR等级。</p>
            </div>
            {["A1","A2","B1","B2","C1","C2"].map(level => (
              <div key={level} className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold">{level}</span>
                  <span className="text-sm text-gray-500">{getLevelCount(level).toLocaleString()} 词汇</span>
                </div>
                <div className="text-sm text-gray-600">
                  {level === "A1" && "基础入门：字母、数字、问候、家庭、食物"}
                  {level === "A2" && "日常生活：购物、餐厅、交通、工作、情感"}
                  {level === "B1" && "独立交流：观点表达、故事叙述、问题解决"}
                  {level === "B2" && "流利表达：商务、新闻、辩论、学术讨论"}
                  {level === "C1" && "灵活运用：抽象话题、文学欣赏、专业英语"}
                  {level === "C2" && "精通水平：母语级交流、文化深度、批判思维"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
