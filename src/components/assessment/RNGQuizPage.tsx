import { useState, useEffect, useMemo, useCallback } from "react";
import { markActivityComplete, updateProfileAfterActivity } from "@/services/activity-completion";
import { useNavigate } from "react-router-dom";
import { DEDUPLICATED_VOCABULARY } from "../../engines/vocabulary/data/all-words";
import { ALL_GRAMMAR_RULES } from "../../engines/grammar/data/grammar-kb";

// ============================================================
// Quiz Types
// ============================================================

type QuizType = "vocab_en2zh" | "vocab_zh2en" | "vocab_ipa" | "vocab_spelling" |
  "grammar_choice" | "grammar_correction" | "grammar_match" | "grammar_fill";


interface QuizQuestion {
  type: QuizType;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  explanationZh: string;
  points: number;
}

// ============================================================
// Shuffled array helper
// ============================================================

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ============================================================
// Question Generators
// ============================================================

function genVocabEn2Zh(words: any[]): QuizQuestion {
  const target = words[Math.floor(Math.random() * words.length)];
  const wrongs = shuffle(words.filter(w => w.id !== target.id)).slice(0, 3);
  const options = shuffle([
    target.chineseMeaning,
    ...wrongs.map(w => w.chineseMeaning),
  ]);
  return {
    type: "vocab_en2zh",
    question: `"${target.word}" ${target.ipa || ""} 的中文意思是？`,
    options,
    correct: options.indexOf(target.chineseMeaning),
    explanation: `${target.word} → ${target.chineseMeaning}`,
    explanationZh: `词性: ${target.partOfSpeech.join(", ")} | CEFR: ${target.cefr}`,
    points: 10,
  };
}

function genVocabZh2En(words: any[]): QuizQuestion {
  const target = words[Math.floor(Math.random() * words.length)];
  const wrongs = shuffle(words.filter(w => w.id !== target.id)).slice(0, 3);
  const options = shuffle([target.word, ...wrongs.map(w => w.word)]);
  return {
    type: "vocab_zh2en",
    question: `"${target.chineseMeaning}" 对应的英文单词是？`,
    options,
    correct: options.indexOf(target.word),
    explanation: `${target.chineseMeaning} → ${target.word}`,
    explanationZh: `例句: ${target.examples?.[0]?.english || "N/A"}`,
    points: 10,
  };
}

function genVocabIPA(words: any[]): QuizQuestion {
  const withIpa = words.filter(w => w.ipa && w.ipa.length > 3);
  if (withIpa.length < 4) return genVocabEn2Zh(words);
  const target = withIpa[Math.floor(Math.random() * withIpa.length)];
  const wrongs = shuffle(withIpa.filter(w => w.id !== target.id)).slice(0, 3);
  const options = shuffle([
    `${target.word} ${target.ipa}`,
    ...wrongs.map(w => `${w.word} ${w.ipa}`),
  ]);
  return {
    type: "vocab_ipa",
    question: `哪个单词的发音是 ${target.ipa}？`,
    options,
    correct: options.indexOf(`${target.word} ${target.ipa}`),
    explanation: `${target.ipa} = ${target.word} (${target.chineseMeaning})`,
    explanationZh: `注意音标中的元音和辅音`,
    points: 15,
  };
}

function genVocabSpelling(words: any[]): QuizQuestion {
  const target = words[Math.floor(Math.random() * words.length)];
  const letters = target.word.split("");
  const hint = letters.map((l: string, i: number) => i % 3 === 0 ? l : "_").join("");
  const wrongs = shuffle(words.filter(w => w.id !== target.id && w.word.length > 2)).slice(0, 3);
  const options = shuffle([target.word, ...wrongs.map(w => w.word)]);
  return {
    type: "vocab_spelling",
    question: `拼写: ${hint} (${target.chineseMeaning})`,
    options,
    correct: options.indexOf(target.word),
    explanation: `${target.word} → ${target.chineseMeaning}`,
    explanationZh: `注意字母拼写`,
    points: 15,
  };
}

function genGrammarChoice(rules: any[]): QuizQuestion {
  const rule = rules[Math.floor(Math.random() * rules.length)];
  if (!rule.examples || rule.examples.length < 2) return genVocabEn2Zh(DEDUPLICATED_VOCABULARY.slice(0, 100));
  const correctExample = rule.examples.find((e: any) => !e.incorrect) || rule.examples[0];
  const wrongRules = shuffle(rules.filter(r => r.id !== rule.id)).slice(0, 3);
  const options = shuffle([
    rule.titleChinese || rule.title,
    ...wrongRules.map((r: any) => r.titleChinese || r.title),
  ]);
  return {
    type: "grammar_choice",
    question: `以下哪个是"${rule.categoryChinese}"的规则？`,
    options,
    correct: options.indexOf(rule.titleChinese || rule.title),
    explanation: `${rule.title}: ${correctExample.correct}`,
    explanationZh: rule.explanationChinese || rule.explanation,
    points: 20,
  };
}

function genGrammarCorrection(rules: any[]): QuizQuestion {
  const withIncorrect = rules.filter(r =>
    r.examples?.some((e: any) => e.incorrect && e.correct)
  );
  if (withIncorrect.length < 1) return genGrammarChoice(rules);
  const rule = withIncorrect[Math.floor(Math.random() * withIncorrect.length)];
  const ex = rule.examples.find((e: any) => e.incorrect && e.correct);
  const wrongCorrections = shuffle([
    rule.examples.filter((e: any) => e.correct && !e.incorrect).map((e: any) => e.correct),
    ...shuffle(rules.filter(r => r.id !== rule.id)).slice(0, 2).map((r: any) =>
      r.examples?.find((e: any) => e.correct)?.correct || ""
    ),
  ].flat()).filter(Boolean).slice(0, 3);

  const options = shuffle([ex.correct, ...wrongCorrections]);
  return {
    type: "grammar_correction",
    question: `改正错误: "${ex.incorrect}"`,
    options,
    correct: options.indexOf(ex.correct),
    explanation: `${ex.incorrect} → ${ex.correct}`,
    explanationZh: ex.chinese || rule.explanationChinese,
    points: 25,
  };
}

function genGrammarFill(rules: any[]): QuizQuestion {
  const withExamples = rules.filter(r => r.examples?.length >= 2);
  if (withExamples.length < 1) return genGrammarChoice(rules);
  const rule = withExamples[Math.floor(Math.random() * withExamples.length)];
  const ex = rule.examples.find((e: any) => e.correct);
  if (!ex) return genGrammarChoice(rules);
  const words = ex.correct.split(" ");
  const blankIdx = Math.floor(Math.random() * words.length);
  const blankWord = words[blankIdx].replace(/[.,!?]/g, "");
  words[blankIdx] = "______";
  const sentence = words.join(" ");
  const wrongs = shuffle(rules.filter(r => r.id !== rule.id)).slice(0, 3).map((r: any) => {
    const re = r.examples?.find((e: any) => e.correct);
    return re?.correct.split(" ")[Math.floor(Math.random() * re.correct.split(" ").length)] || r.title;
  });
  const options = shuffle([blankWord, ...wrongs]);
  return {
    type: "grammar_fill",
    question: `填空: ${sentence}`,
    options,
    correct: options.indexOf(blankWord),
    explanation: `${ex.correct}`,
    explanationZh: `${rule.titleChinese}: ${rule.explanationChinese}`,
    points: 20,
  };
}

function genGrammarMatch(rules: any[]): QuizQuestion {
  const rule = rules[Math.floor(Math.random() * rules.length)];
  const correctTip = rule.tips?.[0] || rule.explanation;
  const wrongTips = shuffle(rules.filter(r => r.id !== rule.id)).slice(0, 3).map(r => r.tips?.[0] || r.explanation);
  const options = shuffle([correctTip, ...wrongTips]);
  return {
    type: "grammar_match",
    question: `"${rule.titleChinese}" 的正确描述是？`,
    options,
    correct: options.indexOf(correctTip),
    explanation: correctTip,
    explanationZh: rule.explanationChinese,
    points: 20,
  };
}

// ============================================================
// Main Component
// ============================================================

export default function RNGQuizPage() {
  const navigate = useNavigate();
  const totalQuestions = 20;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);


  const words = useMemo(() => DEDUPLICATED_VOCABULARY, []);
  const grammarRules = useMemo(() => ALL_GRAMMAR_RULES, []);

  const question = useMemo((): QuizQuestion => {
    const generators = [
      genVocabEn2Zh, genVocabZh2En, genVocabIPA, genVocabSpelling,
      genGrammarChoice, genGrammarCorrection, genGrammarFill, genGrammarMatch,
    ];
    const gen = generators[Math.floor(Math.random() * generators.length)];
    return gen(words.length > 50 ? words : grammarRules);
  }, [words, grammarRules, currentIndex]);

  const handleAnswer = useCallback((idx: number) => {
    if (answered !== null) return;
    setAnswered(idx);
    if (idx === question.correct) setScore(s => s + question.points);
    setShowExplanation(true);
  }, [answered, question]);

  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= totalQuestions) {
      setQuizComplete(true);
    } else {
      setCurrentIndex(i => i + 1);
      setAnswered(null);
      setShowExplanation(false);
    }
  }, [currentIndex, totalQuestions]);

  // Report quiz completion to home progress
  useEffect(() => {
    if (!quizComplete) return;
    updateProfileAfterActivity({ wordsLearned: Math.round(score / 25) });
    markActivityComplete("assessment");
  }, [quizComplete]); // eslint-disable-line react-hooks/exhaustive-deps

  const getGrade = (score: number, total: number) => {
    const pct = (score / (total * 25)) * 100;
    if (pct >= 90) return { grade: "S", label: "优秀", color: "text-yellow-500" };
    if (pct >= 80) return { grade: "A", label: "很好", color: "text-green-500" };
    if (pct >= 60) return { grade: "B", label: "良好", color: "text-blue-500" };
    if (pct >= 40) return { grade: "C", label: "及格", color: "text-orange-500" };
    return { grade: "D", label: "需加强", color: "text-red-500" };
  };

  if (quizComplete) {
    const maxScore = totalQuestions * 25;
    const pct = Math.round((score / maxScore) * 100);
    const { grade, label, color } = getGrade(score, totalQuestions);
    return (
      <div className="min-h-dvh bg-gradient-to-b from-purple-50 to-indigo-50 px-4 py-8">
        <div className="mx-auto max-w-lg text-center">
          <div className="mb-6 text-6xl">🎯</div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900">知识测验完成！</h1>
          <div className={`mb-4 text-7xl font-bold ${color}`}>{grade}</div>
          <p className={`mb-6 text-xl font-semibold ${color}`}>{label}</p>
          <div className="mb-8 rounded-2xl bg-white p-6 shadow-lg">
            <div className="mb-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary-600">{score}</div>
                <div className="text-sm text-gray-500">得分</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{maxScore}</div>
                <div className="text-sm text-gray-500">满分</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{pct}%</div>
                <div className="text-sm text-gray-500">正确率</div>
              </div>
            </div>
            <div className="h-4 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary-500 to-indigo-500 transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => { setCurrentIndex(0); setScore(0); setAnswered(null); setShowExplanation(false); setQuizComplete(false); }}
              className="rounded-xl bg-primary-600 px-6 py-3 font-semibold text-white shadow hover:bg-primary-700"
            >
              🔄 再测一次
            </button>
            <button
              onClick={() => navigate("/")}
              className="rounded-xl bg-gray-100 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-200"
            >
              🏠 返回首页
            </button>
          </div>
        </div>
      </div>
    );
  }

  const typeLabels: Record<string, string> = {
    vocab_en2zh: "🔤 词汇: 英→中",
    vocab_zh2en: "🔤 词汇: 中→英",
    vocab_ipa: "🔊 词汇: 音标",
    vocab_spelling: "✏️ 词汇: 拼写",
    grammar_choice: "📖 语法: 选择",
    grammar_correction: "✏️ 语法: 改错",
    grammar_fill: "📝 语法: 填空",
    grammar_match: "🔗 语法: 匹配",
  };

  return (
    <div className="min-h-dvh bg-gradient-to-b from-blue-50 to-indigo-50 px-4 py-6">
      <div className="mx-auto max-w-lg">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="text-2xl">←</button>
          <h1 className="text-lg font-bold text-gray-900">🎯 知识问答</h1>
          <span className="rounded-full bg-primary-100 px-3 py-1 text-sm font-semibold text-primary-700">
            {currentIndex + 1}/{totalQuestions}
          </span>
        </div>

        {/* Progress */}
        <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-primary-500 transition-all"
            style={{ width: `${((currentIndex) / totalQuestions) * 100}%` }}
          />
        </div>

        {/* Score */}
        <div className="mb-4 text-center text-sm text-gray-500">
          当前得分: <span className="font-bold text-primary-600">{score}</span> 分
        </div>

        {/* Question Type */}
        <div className="mb-4 rounded-full bg-white px-4 py-2 text-center text-sm font-medium text-gray-600 shadow-sm">
          {typeLabels[question.type] || "综合"}
        </div>

        {/* Question */}
        <div className="mb-6 rounded-2xl bg-white p-6 shadow-lg">
          <p className="mb-6 text-lg font-semibold text-gray-900">{question.question}</p>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((opt, idx) => {
              let bgColor = "bg-gray-50 hover:bg-gray-100 border-gray-200";
              let textColor = "text-gray-800";
              if (answered !== null) {
                if (idx === question.correct) {
                  bgColor = "bg-green-50 border-green-300 ring-2 ring-green-200";
                  textColor = "text-green-800";
                } else if (idx === answered && answered !== question.correct) {
                  bgColor = "bg-red-50 border-red-300";
                  textColor = "text-red-800";
                }
              }
              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={answered !== null}
                  className={`w-full rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition-all ${bgColor} ${textColor}`}
                >
                  <span className="mr-2 inline-block w-6 text-center font-bold text-gray-400">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div className="mb-6 rounded-2xl bg-white p-5 shadow-lg">
            <div className="mb-2 flex items-center gap-2">
              {answered === question.correct ? (
                <span className="text-xl">✅</span>
              ) : (
                <span className="text-xl">❌</span>
              )}
              <span className="font-semibold text-gray-900">
                {answered === question.correct ? `正确! +${question.points}分` : "答错了"}
              </span>
            </div>
            <p className="mb-2 text-sm text-gray-700">{question.explanation}</p>
            <p className="text-sm text-gray-500">{question.explanationZh}</p>
          </div>
        )}

        {/* Next Button */}
        {answered !== null && (
          <button
            onClick={handleNext}
            className="w-full rounded-xl bg-primary-600 px-6 py-3 font-semibold text-white shadow hover:bg-primary-700"
          >
            {currentIndex + 1 >= totalQuestions ? "查看结果" : "下一题 →"}
          </button>
        )}

        {/* Type Legend */}
        <div className="mt-6 rounded-xl bg-white/50 p-4">
          <h3 className="mb-2 text-xs font-semibold text-gray-500">题目类型</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(typeLabels).map(([key, label]) => (
              <span key={key} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
