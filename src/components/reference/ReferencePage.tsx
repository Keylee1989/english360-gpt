import { useState, useMemo, useCallback, useEffect } from "react";
import { ALL_GRAMMAR_RULES, type GrammarRule } from "../../engines/grammar/data/grammar-kb";
import { ALL_VOCABULARY, VOCABULARY_STATS } from "../../engines/vocabulary/data/all-words";
import type { VocabularyItem } from "../../engines/vocabulary/index";

// ============================================================
// IndexedDB Cache
// ============================================================

const DB_NAME = "english360-reference";
const DB_VERSION = 1;
const VOCAB_STORE = "vocabulary";
const GRAMMAR_STORE = "grammar";

async function openDB(): Promise<IDBDatabase | null> {
  try {
    return await new Promise((resolve) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(VOCAB_STORE)) {
          db.createObjectStore(VOCAB_STORE, { keyPath: "word" });
        }
        if (!db.objectStoreNames.contains(GRAMMAR_STORE)) {
          db.createObjectStore(GRAMMAR_STORE, { keyPath: "id" });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

async function cacheVocabulary(words: VocabularyItem[]) {
  const db = await openDB();
  if (!db) return;
  const tx = db.transaction(VOCAB_STORE, "readwrite");
  const store = tx.objectStore(VOCAB_STORE);
  for (const w of words) {
    store.put(w);
  }
}

async function cacheGrammar(rules: GrammarRule[]) {
  const db = await openDB();
  if (!db) return;
  const tx = db.transaction(GRAMMAR_STORE, "readwrite");
  const store = tx.objectStore(GRAMMAR_STORE);
  for (const r of rules) {
    store.put(r);
  }
}

// ============================================================
// Component
// ============================================================

type TabType = "vocabulary" | "grammar";
type LevelFilter = "all" | "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

const DIFF_FILTER_OPTIONS = [
  { value: "all", label: "全部" },
  { value: "very_easy", label: "非常简单" },
  { value: "easy", label: "简单" },
  { value: "medium", label: "中等" },
  { value: "hard", label: "困难" },
  { value: "very_hard", label: "非常困难" },
];

const LEVEL_LABELS: Record<string, string> = {
  all: "全部",
  A1: "A1 入门",
  A2: "A2 基础",
  B1: "B1 中级",
  B2: "B2 中高级",
  C1: "C1 高级",
  C2: "C2 精通",
};

export default function ReferencePage() {
  const [activeTab, setActiveTab] = useState<TabType>("vocabulary");
  const [query, setQuery] = useState("");
  const [diffFilter, setDiffFilter] = useState<string>("all");
  const [levelFilter, setLevelFilter] = useState<LevelFilter>("all");
  const [selectedGrammar, setSelectedGrammar] = useState<GrammarRule | null>(null);
  const [expandedWord, setExpandedWord] = useState<string | null>(null);
  const [cached, setCached] = useState(false);
  const [gramPage, setGramPage] = useState(0);
  const PAGE_SIZE = 50;

  // Cache data to IndexedDB on mount
  useEffect(() => {
    if (!cached) {
      cacheVocabulary(ALL_VOCABULARY);
      cacheGrammar(ALL_GRAMMAR_RULES);
      setCached(true);
    }
  }, [cached]);

  // ---- Vocabulary search ----
  const vocabResults = useMemo(() => {
    let results = ALL_VOCABULARY;
    if (query) {
      const lower = query.toLowerCase();
      results = results.filter(
        (w) =>
          w.word.toLowerCase().includes(lower) ||
          w.chineseMeaning.includes(lower) ||
          w.ipa.includes(lower)
      );
    }
    if (diffFilter !== "all") {
      results = results.filter((w) => w.difficulty === diffFilter);
    }
    return results;
  }, [query, diffFilter]);

  // ---- Grammar search ----
  const grammarResults = useMemo(() => {
    let results = ALL_GRAMMAR_RULES;
    if (query) {
      const lower = query.toLowerCase();
      results = results.filter(
        (r) =>
          r.title.toLowerCase().includes(lower) ||
          r.titleChinese.includes(lower) ||
          r.explanation.toLowerCase().includes(lower) ||
          r.explanationChinese.includes(lower) ||
          r.tags.some((t) => t.includes(lower)) ||
          r.category.toLowerCase().includes(lower) ||
          r.categoryChinese.includes(lower)
      );
    }
    if (levelFilter !== "all") {
      results = results.filter((r) => r.level === levelFilter);
    }
    return results;
  }, [query, levelFilter]);

  const grammarPageResults = useMemo(() => {
    return grammarResults.slice(gramPage * PAGE_SIZE, (gramPage + 1) * PAGE_SIZE);
  }, [grammarResults, gramPage]);
  const gramTotalPages = Math.ceil(grammarResults.length / PAGE_SIZE);

  const handleTab = useCallback((tab: TabType) => {
    setActiveTab(tab);
    setQuery("");
    setSelectedGrammar(null);
    setExpandedWord(null);
    setGramPage(0);
  }, []);

  // ---- Render ----
  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">📚 词典与语法</h1>
        <p className="mt-1 text-sm text-gray-500">
          搜索 {VOCABULARY_STATS.TOTAL.toLocaleString()} 个词汇 + {ALL_GRAMMAR_RULES.length} 条语法规则
          {cached && <span className="ml-1 text-green-600">✓ 离线可用</span>}
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-4 flex gap-1 rounded-lg bg-gray-100 p-1">
        <button
          onClick={() => handleTab("vocabulary")}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition ${
            activeTab === "vocabulary"
              ? "bg-white text-blue-600 shadow"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          📖 词汇 ({VOCABULARY_STATS.TOTAL.toLocaleString()})
        </button>
        <button
          onClick={() => handleTab("grammar")}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition ${
            activeTab === "grammar"
              ? "bg-white text-blue-600 shadow"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          📝 语法 ({ALL_GRAMMAR_RULES.length})
        </button>
      </div>

      {/* Search bar */}
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setGramPage(0);
            }}
            placeholder={
              activeTab === "vocabulary"
                ? "搜索单词或中文..."
                : "搜索语法规则..."
            }
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                setGramPage(0);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      {activeTab === "vocabulary" ? (
        <div className="mb-4 flex flex-wrap gap-2">
          <select
            value={diffFilter}
            onChange={(e) => setDiffFilter(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm"
          >
            {DIFF_FILTER_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      ) : (
        <div className="mb-4 flex flex-wrap gap-2">
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value as LevelFilter)}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm"
          >
            {Object.entries(LEVEL_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
      )}

      {/* Vocabulary Stats Bar */}
      {activeTab === "vocabulary" && (
        <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
          {(["A1", "A2", "B1", "B2", "C1", "C2"] as const).map((lev) => {
            const count =
              lev === "A1"
                ? VOCABULARY_STATS.A1
                : lev === "A2"
                ? VOCABULARY_STATS.A2
                : lev === "B1"
                ? VOCABULARY_STATS.B1
                : lev === "B2"
                ? VOCABULARY_STATS.B2
                : lev === "C1"
                ? VOCABULARY_STATS.C1
                : VOCABULARY_STATS.C2;
            return (
              <span
                key={lev}
                className="whitespace-nowrap rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
              >
                {lev}: {count.toLocaleString()}
              </span>
            );
          })}
        </div>
      )}

      {/* Results count */}
      <div className="mb-3 text-sm text-gray-500">
        {activeTab === "vocabulary"
          ? `找到 ${vocabResults.length.toLocaleString()} 个单词`
          : `找到 ${grammarResults.length} 条语法规则`}
        {query && ` · "${query}"`}
      </div>

      {/* ============ VOCABULARY RESULTS ============ */}
      {activeTab === "vocabulary" && (
        <div className="space-y-2">
          {vocabResults.length === 0 && (
            <div className="py-12 text-center text-gray-400">
              没有找到匹配的单词
            </div>
          )}
          {vocabResults.slice(0, 200).map((w) => (
            <div
              key={w.word + w.ipa}
              className="rounded-lg border border-gray-200 bg-white p-3 transition hover:shadow-sm"
            >
              <button
                onClick={() =>
                  setExpandedWord(expandedWord === w.word ? null : w.word)
                }
                className="w-full text-left"
              >
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-semibold text-gray-900">
                    {w.word}
                  </span>
                  <span className="font-mono text-sm text-gray-400">
                    {w.ipa}
                  </span>
                  <span className="ml-auto rounded bg-blue-100 px-1.5 py-0.5 text-xs text-blue-700">
                    {w.difficulty}
                  </span>
                </div>
                <div className="mt-1 text-sm text-gray-600">
                  {w.chineseMeaning}
                  {w.partOfSpeech && w.partOfSpeech.length > 0 && (
                    <span className="ml-2 text-xs text-gray-400">({w.partOfSpeech.join(", ")})</span>
                  )}
                  {w.cefr && (
                    <span className="ml-2 rounded bg-green-50 px-1 py-0.5 text-xs text-green-600">{w.cefr}</span>
                  )}
                </div>
              </button>

              {/* Expanded details */}
              {expandedWord === w.word && (
                <div className="mt-3 border-t border-gray-100 pt-3 text-sm">
                  {w.memoryMethods?.chinesePronHint && (
                    <div className="mb-1">
                      <span className="font-medium text-gray-700">发音提示：</span>
                      <span className="text-gray-600">{w.memoryMethods.chinesePronHint}</span>
                    </div>
                  )}
                  {w.memoryMethods?.association && (
                    <div className="mb-1">
                      <span className="font-medium text-gray-700">记忆法：</span>
                      <span className="text-gray-600">{w.memoryMethods.association}</span>
                    </div>
                  )}
                  {w.examples && w.examples.length > 0 && (
                    <div className="mb-1">
                      <span className="font-medium text-gray-700">例句：</span>
                      {w.examples.slice(0, 2).map((ex, i) => (
                        <div key={i} className="mt-0.5">
                          <span className="italic text-gray-600">{ex.english}</span>
                          <span className="ml-1 text-gray-500">— {ex.chinese}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {w.commonErrors && w.commonErrors.length > 0 && (
                    <div className="mb-1">
                      <span className="font-medium text-gray-700">常见错误：</span>
                      {w.commonErrors.map((err, i) => (
                        <span key={i} className="ml-1 text-red-500">{err.error}</span>
                      ))}
                    </div>
                  )}
                  {w.synonyms && w.synonyms.length > 0 && (
                    <div className="mb-1">
                      <span className="font-medium text-gray-700">同义词：</span>
                      <span className="text-gray-600">{w.synonyms.join(", ")}</span>
                    </div>
                  )}
                  {w.antonyms && w.antonyms.length > 0 && (
                    <div className="mb-1">
                      <span className="font-medium text-gray-700">反义词：</span>
                      <span className="text-gray-600">{w.antonyms.join(", ")}</span>
                    </div>
                  )}
                  <div className="mt-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const utt = new SpeechSynthesisUtterance(w.word);
                        utt.lang = "en-US";
                        utt.rate = 0.8;
                        speechSynthesis.speak(utt);
                      }}
                      className="rounded bg-blue-50 px-2 py-1 text-xs text-blue-600 hover:bg-blue-100"
                    >
                      🔊 发音
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {vocabResults.length > 200 && (
            <div className="py-4 text-center text-sm text-gray-400">
              显示前 200 条，共 {vocabResults.length.toLocaleString()} 条。
              请缩小搜索范围查看更多。
            </div>
          )}
        </div>
      )}

      {/* ============ GRAMMAR RESULTS ============ */}
      {activeTab === "grammar" && (
        <div className="space-y-3">
          {/* Category chips */}
          <div className="mb-4 flex flex-wrap gap-1.5">
            {[
              ...new Set(ALL_GRAMMAR_RULES.map((r) => r.category)),
            ].map((cat) => {
              const count = ALL_GRAMMAR_RULES.filter(
                (r) => r.category === cat
              ).length;
              return (
                <button
                  key={cat}
                  onClick={() => setQuery(cat)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                    query === cat
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>

          {grammarResults.length === 0 && (
            <div className="py-12 text-center text-gray-400">
              没有找到匹配的语法规则
            </div>
          )}

          {grammarPageResults.map((rule) => (
            <div
              key={rule.id}
              className="rounded-lg border border-gray-200 bg-white transition hover:shadow-sm"
            >
              <button
                onClick={() =>
                  setSelectedGrammar(
                    selectedGrammar?.id === rule.id ? null : rule
                  )
                }
                className="w-full p-4 text-left"
              >
                <div className="flex items-start gap-2">
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-base font-semibold text-gray-900">
                        {rule.titleChinese}
                      </span>
                      <span className="text-sm text-gray-400">{rule.title}</span>
                      <span
                        className={`ml-auto rounded px-1.5 py-0.5 text-xs font-medium ${
                          rule.level === "A1"
                            ? "bg-green-100 text-green-700"
                            : rule.level === "A2"
                            ? "bg-blue-100 text-blue-700"
                            : rule.level === "B1"
                            ? "bg-yellow-100 text-yellow-700"
                            : rule.level === "B2"
                            ? "bg-orange-100 text-orange-700"
                            : rule.level === "C1"
                            ? "bg-red-100 text-red-700"
                            : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        {rule.level}
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-gray-500">
                      {rule.categoryChinese} · {rule.category}
                    </div>
                  </div>
                  <span className="mt-1 text-gray-300">
                    {selectedGrammar?.id === rule.id ? "▲" : "▼"}
                  </span>
                </div>
              </button>

              {/* Expanded grammar detail */}
              {selectedGrammar?.id === rule.id && (
                <div className="border-t border-gray-100 px-4 pb-4 pt-3">
                  <div className="mb-3 text-sm text-gray-700">
                    <div className="font-medium text-gray-800">英文解释：</div>
                    <div>{rule.explanation}</div>
                  </div>
                  <div className="mb-3 text-sm text-gray-700">
                    <div className="font-medium text-gray-800">中文解释：</div>
                    <div>{rule.explanationChinese}</div>
                  </div>

                  {/* Examples */}
                  <div className="mb-3">
                    <div className="mb-1 text-sm font-medium text-gray-800">例句：</div>
                    {rule.examples.map((ex, i) => (
                      <div key={i} className="mb-2 rounded bg-gray-50 p-2 text-sm">
                        {ex.incorrect && (
                          <div className="text-red-500 line-through">
                            ❌ {ex.incorrect}
                          </div>
                        )}
                        <div className="text-green-700">✅ {ex.correct}</div>
                        <div className="mt-0.5 text-xs text-gray-500">
                          {ex.chinese}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tips */}
                  {rule.tips.length > 0 && (
                    <div>
                      <div className="mb-1 text-sm font-medium text-gray-800">
                        💡 学习提示：
                      </div>
                      <ul className="list-inside list-disc space-y-1 text-sm text-gray-600">
                        {rule.tips.map((tip, i) => (
                          <li key={i}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Tags */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {rule.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-500"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Pagination */}
          {gramTotalPages > 1 && (
            <div className="flex items-center justify-center gap-2 py-4">
              <button
                onClick={() => setGramPage(Math.max(0, gramPage - 1))}
                disabled={gramPage === 0}
                className="rounded bg-gray-200 px-3 py-1 text-sm disabled:opacity-40"
              >
                ← 上一页
              </button>
              <span className="text-sm text-gray-500">
                {gramPage + 1} / {gramTotalPages}
              </span>
              <button
                onClick={() =>
                  setGramPage(Math.min(gramTotalPages - 1, gramPage + 1))
                }
                disabled={gramPage >= gramTotalPages - 1}
                className="rounded bg-gray-200 px-3 py-1 text-sm disabled:opacity-40"
              >
                下一页 →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
