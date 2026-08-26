import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  LEVEL_REQUIREMENTS,
  LEVEL_ORDER,
  loadPathState,
  recordTestResult,
  recordPlacement,
  getLevelVocabulary,
  getLevelGrammar,
  checkRequirementStatus,
  type CEFRLevel,
  type UserPathState,
} from "../../engines/level-path";
import { DEDUPLICATED_VOCABULARY } from "../../engines/vocabulary/data/all-words";
import { markActivityComplete } from "@/services/activity-completion";

// ============================================================
// 测试题生成（按等级过滤词汇+语法）
// ============================================================

interface TestQuestion {
  q: string;
  options: string[];
  correct: number;
  explainZh: string;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildLevelTest(level: CEFRLevel, count: number): TestQuestion[] {
  const vocab = getLevelVocabulary(level).filter(w => w.cefr === level);
  const pool = vocab.length >= 10 ? vocab : DEDUPLICATED_VOCABULARY.filter(w => w.cefr === level);
  const grammar = getLevelGrammar(level);
  const questions: TestQuestion[] = [];

  // 60% 词汇题, 40% 语法题
  const vocabCount = Math.round(count * 0.6);
  const gramCount = count - vocabCount;

  for (let i = 0; i < vocabCount && pool.length > 4; i++) {
    if (i % 2 === 0) {
      const t = pool[Math.floor(Math.random() * pool.length)];
      const wrongs = shuffle(pool.filter(w => w.id !== t.id)).slice(0, 3);
      const options = shuffle([t.chineseMeaning, ...wrongs.map(w => w.chineseMeaning)]);
      questions.push({
        q: `"${t.word}" ${t.ipa || ""} 的意思是？`,
        options, correct: options.indexOf(t.chineseMeaning),
        explainZh: `${t.word} → ${t.chineseMeaning}`,
      });
    } else {
      const t = pool[Math.floor(Math.random() * pool.length)];
      const wrongs = shuffle(pool.filter(w => w.id !== t.id)).slice(0, 3);
      const options = shuffle([t.word, ...wrongs.map(w => w.word)]);
      questions.push({
        q: `"${t.chineseMeaning}" 的英文是？`,
        options, correct: options.indexOf(t.word),
        explainZh: `${t.chineseMeaning} → ${t.word}`,
      });
    }
  }

  for (let i = 0; i < gramCount && grammar.length > 3; i++) {
    const rule = grammar[Math.floor(Math.random() * grammar.length)];
    const ex = rule.examples?.find((e: any) => !e.incorrect) || rule.examples?.[0];
    if (!ex) continue;
    if (i % 2 === 0) {
      // 干扰项必须来自【不同类别】的规则，保证答案唯一
      const otherCategories = shuffle(grammar.filter(r => r.id !== rule.id && r.category !== rule.category));
      const wrongs = otherCategories.slice(0, 3);
      if (wrongs.length < 3) continue;
      const options = shuffle([rule.titleChinese || rule.title, ...wrongs.map((r: any) => r.titleChinese || r.title)]);
      questions.push({
        q: `哪个规则属于"${rule.categoryChinese}"？`,
        options, correct: options.indexOf(rule.titleChinese || rule.title),
        explainZh: `${rule.title}：${rule.explanationChinese || rule.explanation}`,
      });
    } else {
      const otherTips = shuffle(grammar.filter(r => r.id !== rule.id)).slice(0, 3)
        .map((r: any) => r.tips?.[0] || r.explanationChinese);
      const options = shuffle([(rule.tips?.[0] || rule.explanation), ...otherTips]);
      questions.push({
        q: `关于"${rule.titleChinese}"，正确的说法是？`,
        options, correct: options.indexOf(rule.tips?.[0] || rule.explanation),
        explainZh: ex.correct + " — " + rule.explanationChinese,
      });
    }
  }

  return shuffle(questions).slice(0, count);
}

// ============================================================
// 主组件
// ============================================================

export default function LevelPathPage() {
  const navigate = useNavigate();
  const [state, setState] = useState<UserPathState>(() => loadPathState());
  const [testingLevel, setTestingLevel] = useState<CEFRLevel | null>(null);
  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);

  const isPlacement = !state.placementDone;

  const startTest = useCallback((level: CEFRLevel) => {
    setQuestions(buildLevelTest(level, LEVEL_REQUIREMENTS[level].quizQuestionCount));
    setQIndex(0); setPicked(null); setCorrectCount(0);
    setTestingLevel(level);
  }, []);

  const finishTest = useCallback((finalCorrect: number, total: number) => {
    const pct = Math.round((finalCorrect / total) * 100);
    if (isPlacement) {
      // 放置测试：按正确率定位等级
      let target: CEFRLevel = "A1";
      if (pct >= 90) target = "C1";
      else if (pct >= 75) target = "B2";
      else if (pct >= 60) target = "B1";
      else if (pct >= 40) target = "A2";
      setState(recordPlacement(target));
    } else {
      setState(recordTestResult(testingLevel!, pct));
    }
    setTestingLevel(null);
    markActivityComplete("assessment");
  }, [isPlacement, testingLevel]);

  const pickAnswer = useCallback((idx: number) => {
    if (picked !== null) return;
    setPicked(idx);
    if (idx === questions[qIndex].correct) setCorrectCount(c => c + 1);
  }, [picked, questions, qIndex]);

  const nextQuestion = useCallback(() => {
    if (qIndex + 1 >= questions.length) {
      const newCorrect = picked !== null && picked === questions[qIndex].correct ? correctCount : correctCount;
      finishTest(newCorrect, questions.length);
    } else {
      setQIndex(i => i + 1);
      setPicked(null);
    }
  }, [qIndex, questions, correctCount, picked, finishTest]);

  // ================= 测试界面 =================
  if (testingLevel) {
    const q = questions[qIndex];
    const pct = Math.round(((qIndex) / questions.length) * 100);
    return (
      <div className="min-h-dvh bg-gradient-to-b from-indigo-50 to-purple-50 px-4 py-6">
        <div className="mx-auto max-w-lg">
          <div className="mb-4 flex items-center justify-between">
            <button onClick={() => setTestingLevel(null)} className="text-2xl">←</button>
            <h1 className="text-lg font-bold">
              {isPlacement ? "🎯 水平定位测试" : `🏅 ${testingLevel} 通关测试`}
            </h1>
            <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-700">
              {qIndex + 1}/{questions.length}
            </span>
          </div>
          <div className="mb-6 h-2 overflow-hidden rounded-full bg-gray-200">
            <div className="h-full rounded-full bg-indigo-500 transition-all" style={{ width: `${pct}%` }} />
          </div>
          <div className="mb-6 rounded-2xl bg-white p-6 shadow-lg">
            <p className="mb-6 text-lg font-semibold text-gray-900">{q.q}</p>
            <div className="space-y-3">
              {q.options.map((opt, idx) => {
                let cls = "bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-800";
                if (picked !== null) {
                  if (idx === q.correct) cls = "bg-green-50 border-green-300 ring-2 ring-green-200 text-green-800";
                  else if (idx === picked) cls = "bg-red-50 border-red-300 text-red-800";
                }
                return (
                  <button key={idx} onClick={() => pickAnswer(idx)} disabled={picked !== null}
                    className={`w-full rounded-xl border-2 px-4 py-3 text-left text-sm transition-all ${cls}`}>
                    <span className="mr-2 inline-block w-5 font-bold text-gray-400">{String.fromCharCode(65 + idx)}</span>
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
          {picked !== null && (
            <>
              <div className="mb-4 rounded-xl bg-white p-4 shadow">
                <span className={picked === q.correct ? "text-green-600" : "text-red-600"}>
                  {picked === q.correct ? "✅ 正确" : "❌ 错误"}
                </span>
                <p className="mt-2 text-sm text-gray-600">{q.explainZh}</p>
              </div>
              <button onClick={nextQuestion}
                className="w-full rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700">
                {qIndex + 1 >= questions.length ? "查看结果" : "下一题 →"}
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  // ================= 路径总览 =================
  return (
    <div className="min-h-dvh bg-gradient-to-b from-slate-50 to-blue-50 px-4 py-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-2 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="text-2xl">←</button>
          <h1 className="text-xl font-bold text-gray-900">🗺️ 我的英语之路</h1>
          <span className="w-8" />
        </div>
        <p className="mb-6 text-center text-sm text-gray-500">
          零基础 → C2精通 · 按顺序通关每一级
        </p>

        {/* 未做放置测试提示 */}
        {!state.placementDone && (
          <div className="mb-6 rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50 p-5 text-center">
            <div className="mb-2 text-3xl">🎯</div>
            <h2 className="mb-2 font-bold text-blue-900">第一步：先测出你的起点</h2>
            <p className="mb-4 text-sm text-blue-700">
              做20道题，系统会自动定位你从哪一级开始学。
            </p>
            <button onClick={() => startTest("A1")}
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">
              开始水平定位测试
            </button>
          </div>
        )}

        {/* 等级卡片 */}
        <div className="space-y-4">
          {LEVEL_ORDER.map((lv, idx) => {
            const req = LEVEL_REQUIREMENTS[lv];
            const unlocked = state.unlockedLevels.includes(lv);
            const isCurrent = state.currentLevel === lv;
            const passed = !!state.passedTests[lv];
            const status = checkRequirementStatus(lv, state);
            const prevPassed = idx === 0 || !!state.passedTests[LEVEL_ORDER[idx - 1]];

            return (
              <div key={lv}
                className={`rounded-2xl border-2 p-5 transition-all ${
                  passed ? "border-green-300 bg-green-50"
                  : isCurrent && unlocked ? "border-blue-400 bg-white shadow-lg"
                  : unlocked ? "border-gray-200 bg-white"
                  : "border-gray-200 bg-gray-100 opacity-70"
                }`}>
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl text-lg font-bold ${
                      passed ? "bg-green-500 text-white"
                      : isCurrent && unlocked ? "bg-blue-500 text-white"
                      : unlocked ? "bg-gray-300 text-gray-600"
                      : "bg-gray-200 text-gray-400"
                    }`}>
                      {passed ? "✓" : unlocked ? lv : "🔒"}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">
                        {lv} {req.nameZh} <span className="text-xs font-normal text-gray-400">{req.name}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {passed ? `已通关 (${state.passedTests[lv]?.score}分)`
                        : isCurrent && unlocked ? "📍 当前学习等级"
                        : unlocked ? "已解锁" : "完成上一级后解锁"}
                      </div>
                    </div>
                  </div>
                  <span className="text-right text-xs text-gray-400">
                    约{req.estimatedWeeks[0]}-{req.estimatedWeeks[1]}周
                  </span>
                </div>

                <p className="mb-3 text-sm text-gray-600">{req.descriptionZh}</p>

                {/* 达成能力 */}
                <details className="mb-3" open={isCurrent}>
                  <summary className="cursor-pointer text-xs font-semibold text-blue-600">
                    达成后你能做什么 ▾
                  </summary>
                  <ul className="mt-2 space-y-1">
                    {req.canDo.map((c, i) => (
                      <li key={i} className="flex gap-2 text-xs text-gray-600">
                        <span>✅</span>{c}
                      </li>
                    ))}
                  </ul>
                </details>

                {/* 达标条件清单 */}
                {unlocked && (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className={status.vocabOk ? "text-green-600" : "text-gray-500"}>
                      📚 词汇 {Math.min(state.wordsMastered, req.vocabTarget)}/{req.vocabTarget} 词
                    </div>
                    <div className={status.tasksOk ? "text-green-600" : "text-gray-500"}>
                      📝 任务 阅读{req.readingCount}/听力{req.listeningCount}/写作{req.writingCount}
                    </div>
                    <div className={status.testPassed ? "text-green-600" : "text-orange-500"}>
                      🏅 通关测试 ≥{req.quizPassRate}%（{req.quizQuestionCount}题）
                    </div>
                    <div className="text-gray-500">
                      📖 语法 {req.grammarIds.length} 条必修
                    </div>
                  </div>
                )}

                {/* 操作按钮 */}
                <div className="mt-4 flex gap-2">
                  {unlocked ? (
                    <>
                      <button onClick={() => startTest(lv)}
                        disabled={!prevPassed && idx > 0}
                        className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold ${
                          status.testPassed ? "bg-gray-100 text-gray-500"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                        } disabled:cursor-not-allowed disabled:opacity-40`}>
                        {status.testPassed ? `✓ 已通过(${state.passedTests[lv]?.score}分)` : "🏅 做通关测试"}
                      </button>
                      {isCurrent && (
                        <button onClick={() => navigate("/learn")}
                          className="flex-1 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700">
                          📖 继续学习
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="w-full rounded-lg bg-gray-100 px-4 py-2.5 text-center text-sm text-gray-400">
                      🔒 先通过 {LEVEL_ORDER[idx - 1]} 级测试解锁
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 总时间预估 */}
        <div className="mt-6 mb-16 rounded-2xl bg-white p-5 text-center shadow">
          <h3 className="mb-2 font-bold text-gray-900">⏱️ 总时间预估</h3>
          <p className="text-sm text-gray-600">
            零基础到C2全程：约 <b className="text-primary-600">1.5 ~ 3 年</b>
            （每天坚持2小时）
          </p>
          <p className="mt-1 text-xs text-gray-400">
            每天4小时高强度学习可缩短至约1年。关键是每天不断线。
          </p>
        </div>
      </div>
    </div>
  );
}
