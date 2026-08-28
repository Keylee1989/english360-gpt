/**
 * PhonicsPage — 自然拼读知识大全
 *
 * Features:
 * - Learning path overview (7 stages)
 * - Interactive alphabet chart with click-to-hear
 * - Phonics rules with examples
 * - Chinese-specific pronunciation challenges
 * - Quiz/test section
 * - Bilibili video resources
 */

import { useState, useCallback } from "react";
import { PhonicsEngine } from "@/engines/phonics";

// ============================================================
// TTS Helper
// ============================================================

function speak(text: string, rate = 0.75) {
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US";
  u.rate = rate;
  window.speechSynthesis.speak(u);
}

// ============================================================
// Tab Types
// ============================================================

type Tab = "overview" | "alphabet" | "rules" | "chinese" | "quiz" | "resources";

// ============================================================
// Quiz Data
// ============================================================

interface QuizQuestion {
  question: string;
  questionZh: string;
  options: string[];
  answer: number;
  explanation: string;
  explanationZh: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    question: "Which letter makes the /ae/ sound in 'cat'?",
    questionZh: "cat 中哪个字母发 /ae/ 的音？",
    options: ["c", "a", "t", "none"],
    answer: 1,
    explanation: "The letter 'a' in CVC words like cat, hat, bat makes the short /ae/ sound.",
    explanationZh: "CVC 结构的单词中（如 cat、hat、bat），字母 a 发短元音 /ae/。",
  },
  {
    question: "What sound does 'sh' make in 'ship'?",
    questionZh: "ship 中 sh 发什么音？",
    options: ["/s/ + /h/", "/sh/", "/ch/", "/th/"],
    answer: 1,
    explanation: "sh is a digraph that makes the /sh/ sound, like Chinese xu.",
    explanationZh: "sh 是一个双字母组合，发 /sh/ 音，类似嘘声。",
  },
  {
    question: "In the word 'cake', what does the 'e' at the end do?",
    questionZh: "cake 中结尾的 e 有什么作用？",
    options: [
      "Makes no sound",
      "Makes the 'a' say its name (long A)",
      "Changes 'k' to /g/",
      "Makes the word plural",
    ],
    answer: 1,
    explanation: "The silent e rule: when a word ends in e, the vowel before it says its long sound.",
    explanationZh: "魔法 e 规则：单词结尾的 e 不发音，但它让前面的元音发字母音（长音）。a_e 读 /eɪ/。",
  },
  {
    question: "Which pair are minimal pairs (differ by only one sound)?",
    questionZh: "哪一对是最小对立体（只有一个音不同）？",
    options: ["cat / dog", "sheep / ship", "book / look", "run / ran"],
    answer: 1,
    explanation: "sheep and ship differ only in the vowel: /iː/ vs /ɪ/.",
    explanationZh: "sheep 和 ship 只有元音不同：长元音 vs 短元音。",
  },
  {
    question: "What is the correct phonics rule for 'ch'?",
    questionZh: "ch 的拼读规则是什么？",
    options: ["/k/", "/sh/", "/ch/", "/s/"],
    answer: 2,
    explanation: "ch makes the /ch/ sound, as in chair, cheese, child.",
    explanationZh: "ch 发 /ch/ 音，如 chair（椅子）、cheese（奶酪）、child（孩子）。",
  },
  {
    question: "How do you pronounce 'th' in 'think'?",
    questionZh: "think 中 th 怎么发音？",
    options: ["/t/ + /h/", "/th/ (voiceless)", "/dh/ (voiced)", "/s/"],
    answer: 1,
    explanation: "In think, three, thank, th is voiceless -- put your tongue between your teeth.",
    explanationZh: "在 think、three、thank 中，th 是清辅音——舌尖放在上下齿之间。",
  },
  {
    question: "What does 'ee' typically sound like?",
    questionZh: "ee 通常发什么音？",
    options: ["/e/", "/ee/", "/ei/", "/ai/"],
    answer: 1,
    explanation: "ee as in tree, bee, see, free makes the long /iː/ sound.",
    explanationZh: "ee 在 tree、bee、see、free 等词中发长元音 /iː/。",
  },
  {
    question: "Which word has a consonant blend at the beginning?",
    questionZh: "哪个单词开头有辅音连缀？",
    options: ["cat", "stop", "me", "egg"],
    answer: 1,
    explanation: "stop starts with the consonant blend 'st' -- both sounds are pronounced.",
    explanationZh: "stop 开头的 st 是辅音连缀——两个辅音都要发音。",
  },
  {
    question: "What is the pattern in the word 'happy'?",
    questionZh: "happy 这个词的音节结构是什么？",
    options: ["CVC", "CV-CVC", "CVC-CVC", "CV"],
    answer: 1,
    explanation: "happy = hap-py = CV-CVC (two syllables: CVC + CV).",
    explanationZh: "happy = hap-py = CV-CVC（两个音节：CVC + CV）。",
  },
  {
    question: "Chinese speakers often confuse /l/ and /r/. Which is correct for 'light'?",
    questionZh: "中文母语者常混淆 /l/ 和 /r/。light 中应该用哪个？",
    options: ["/raɪt/", "/laɪt/", "/naɪt/", "/laɪd/"],
    answer: 1,
    explanation: "light uses /l/ -- tongue tip touches the alveolar ridge (upper gum), not curled back.",
    explanationZh: "light 用 /l/——舌尖接触上齿龈（牙龈凸起处），不要卷舌。",
  },
];

// ============================================================
// Main Component
// ============================================================

export default function PhonicsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [expandedRule, setExpandedRule] = useState<string | null>(null);
  const [challengePlaying, setChallengePlaying] = useState<string | null>(null);

  const engine = new PhonicsEngine();
  const alphabet = engine.getAlphabet();
  const rules = engine.getRulesByOrder();
  const challenges = engine.getChineseChallenges();
  const learningPath = engine.getLearningPath();
  const exercises = engine.getPronunciationExercises();

  // Quiz handlers
  const handleQuizAnswer = useCallback((qIdx: number, oIdx: number) => {
    setQuizAnswers((prev) => {
      const next = [...prev];
      next[qIdx] = oIdx;
      return next;
    });
  }, []);

  const handleQuizSubmit = useCallback(() => {
    setQuizSubmitted(true);
  }, []);

  const handleQuizReset = useCallback(() => {
    setQuizAnswers([]);
    setQuizSubmitted(false);
  }, []);

  const quizScore = quizSubmitted
    ? QUIZ_QUESTIONS.filter((q, i) => quizAnswers[i] === q.answer).length
    : 0;

  // Play challenge sound
  const playChallenge = useCallback((sound: string, words: string[]) => {
    setChallengePlaying(sound);
    words.forEach((w, i) => {
      setTimeout(() => speak(w, 0.7), i * 800);
    });
    setTimeout(() => setChallengePlaying(null), words.length * 800 + 500);
  }, []);

  // ============================================================
  // Tab Content
  // ============================================================

  const renderTab = () => {
    switch (activeTab) {
      // ---- Overview ----
      case "overview":
        return (
          <div className="space-y-4">
            <div className="card">
              <h2 className="text-lg font-bold mb-2">📖 什么是自然拼读（Phonics）？</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                自然拼读是英语母语国家儿童学习阅读的方法。它教你<strong>字母和字母组合</strong>与<strong>发音</strong>之间的对应规律，让你做到：
              </p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-green-50 p-3 text-center">
                  <div className="text-2xl mb-1">👁️</div>
                  <div className="text-sm font-bold text-green-700">见词能读</div>
                  <div className="text-xs text-green-600">See it, read it</div>
                </div>
                <div className="rounded-lg bg-blue-50 p-3 text-center">
                  <div className="text-2xl mb-1">👂</div>
                  <div className="text-sm font-bold text-blue-700">听音能写</div>
                  <div className="text-xs text-blue-600">Hear it, spell it</div>
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="text-lg font-bold mb-2">🇨🇳 为什么中国人要学自然拼读？</h2>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex gap-2">
                  <span className="text-green-500">✓</span>
                  <span>不需要每次都查音标，看到生词就能尝试发音</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-green-500">✓</span>
                  <span>帮助记忆单词拼写（知道发音就能拼出单词）</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-green-500">✓</span>
                  <span>和音标互补：自然拼读覆盖约84%的英语单词发音规律</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-green-500">✓</span>
                  <span>提高阅读速度和流利度</span>
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="text-lg font-bold mb-3">🗺️ 学习路线图（7个阶段）</h2>
              <div className="space-y-3">
                {learningPath.map((stage, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white"
                        style={{
                          backgroundColor: `hsl(${210 + i * 20}, 70%, ${50 - i * 3}%)`,
                        }}
                      >
                        {i + 1}
                      </div>
                      {i < learningPath.length - 1 && (
                        <div className="h-4 w-0.5 bg-gray-200" />
                      )}
                    </div>
                    <div className="flex-1 pb-2">
                      <div className="font-medium text-sm">{stage.chineseStage}</div>
                      <div className="text-xs text-gray-500">{stage.chineseDescription}</div>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {stage.items.slice(0, 8).map((item, j) => (
                          <span
                            key={j}
                            className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600"
                          >
                            {item}
                          </span>
                        ))}
                        {stage.items.length > 8 && (
                          <span className="text-xs text-gray-400">
                            +{stage.items.length - 8}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card bg-amber-50">
              <h2 className="text-lg font-bold mb-2 text-amber-800">💡 学习建议</h2>
              <div className="space-y-2 text-sm text-amber-700">
                <p>1. <strong>每天10-15分钟</strong>，不要一次学太久</p>
                <p>2. <strong>先听再读</strong>：点击每个字母/规则听发音，模仿跟读</p>
                <p>3. <strong>每天学3-5个字母</strong>，一周学完26个字母发音</p>
                <p>4. <strong>结合单词记忆</strong>：每个字母搭配2-3个例词</p>
                <p>5. <strong>做测试检验</strong>：完成每个阶段后做对应的测验</p>
                <p>6. <strong>不要急于求成</strong>：自然拼读需要反复练习才能内化</p>
              </div>
            </div>
          </div>
        );

      // ---- Alphabet Chart ----
      case "alphabet":
        return (
          <div className="space-y-4">
            <div className="card bg-blue-50">
              <p className="text-sm text-blue-700">
                👆 点击任意字母听发音和例词。注意区分<strong>字母名称</strong>和<strong>字母发音</strong>。
              </p>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {alphabet.map((letter) => (
                <button
                  key={letter.uppercase}
                  onClick={() => {
                    speak(`${letter.uppercase}. ${letter.uppercase} as in ${letter.example}. ${letter.exampleMeaning}.`, 0.65);
                  }}
                  className="flex flex-col items-center rounded-xl border-2 border-gray-200 bg-white p-3 transition-all hover:border-blue-400 hover:shadow-md active:scale-95"
                >
                  <span className="text-2xl font-bold text-primary-600">
                    {letter.uppercase}
                  </span>
                  <span className="text-xs text-gray-500">{letter.chineseHint}</span>
                  <span className="text-xs text-gray-400">{letter.example}</span>
                </button>
              ))}
            </div>
            <div className="card">
              <h3 className="font-bold mb-2">元音 vs 辅音</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-red-50 p-3">
                  <div className="font-bold text-red-700 text-sm mb-1">元音 Vowels</div>
                  <div className="flex gap-2">
                    {["A", "E", "I", "O", "U"].map((v) => (
                      <span key={v} className="text-xl font-bold text-red-600">{v}</span>
                    ))}
                  </div>
                  <p className="text-xs text-red-500 mt-1">每个音节必须有元音</p>
                </div>
                <div className="rounded-lg bg-blue-50 p-3">
                  <div className="font-bold text-blue-700 text-sm mb-1">辅音 Consonants</div>
                  <div className="flex flex-wrap gap-1">
                    {"BCDFGHJKLMNPQRSTVWXYZ".split("").map((c) => (
                      <span key={c} className="text-sm font-medium text-blue-600">{c}</span>
                    ))}
                  </div>
                  <p className="text-xs text-blue-500 mt-1">21个辅音字母</p>
                </div>
              </div>
            </div>
          </div>
        );

      // ---- Rules ----
      case "rules":
        return (
          <div className="space-y-3">
            <div className="card bg-green-50">
              <p className="text-sm text-green-700">
                📚 以下是核心拼读规则。点击规则展开详情，点击单词听发音。
              </p>
            </div>
            {rules.map((rule) => (
              <div key={rule.id} className="card">
                <button
                  onClick={() =>
                    setExpandedRule(expandedRule === rule.id ? null : rule.id)
                  }
                  className="w-full flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-primary-600">
                      {rule.pattern}
                    </span>
                    <span className="text-sm font-medium">{rule.chineseName}</span>
                  </div>
                  <span className="text-gray-400">
                    {expandedRule === rule.id ? "▲" : "▼"}
                  </span>
                </button>
                {expandedRule === rule.id && (
                  <div className="mt-3 space-y-3">
                    <p className="text-sm text-gray-600">{rule.chineseDescription}</p>
                    <p className="text-sm text-gray-500">
                      发音：<span className="font-mono font-bold">{rule.soundIPA}</span> — {rule.chineseHint}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {rule.examples.map((ex) => (
                        <button
                          key={ex.word}
                          onClick={() => speak(ex.word, 0.7)}
                          className="flex items-center justify-between rounded-lg bg-gray-50 p-2 text-left hover:bg-blue-50 transition-colors"
                        >
                          <div>
                            <div className="font-medium text-sm">{ex.word}</div>
                            <div className="text-xs text-gray-500">{ex.ipa}</div>
                            <div className="text-xs text-gray-400">{ex.chineseMeaning}</div>
                          </div>
                          <span className="text-blue-500">🔊</span>
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => speak(rule.examples.map((e) => e.word).join(", "), 0.7)}
                      className="w-full rounded-lg bg-primary-500 py-2 text-sm font-medium text-white"
                    >
                      🔊 连续播放所有例词
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      // ---- Chinese Challenges ----
      case "chinese":
        return (
          <div className="space-y-4">
            <div className="card bg-red-50">
              <h2 className="text-lg font-bold text-red-800 mb-2">
                🇨🇳 中文母语者发音难点
              </h2>
              <p className="text-sm text-red-600">
                以下是中文母语者最容易出错的发音。点击播放听示范，然后跟读练习。
              </p>
            </div>
            {challenges.challenges.map((ch) => (
              <div key={ch.sound} className="card">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-xl font-bold text-primary-600 font-mono">
                      {ch.ipa}
                    </span>
                    <span className="ml-2 text-sm text-gray-600">{ch.chineseHint}</span>
                  </div>
                  <button
                    onClick={() => playChallenge(ch.sound, ch.practice)}
                    disabled={challengePlaying === ch.sound}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                      challengePlaying === ch.sound
                        ? "bg-green-500 text-white"
                        : "bg-primary-100 text-primary-700 hover:bg-primary-200"
                    }`}
                  >
                    {challengePlaying === ch.sound ? "▶ 播放中..." : "🔊 听示范"}
                  </button>
                </div>
                <div className="space-y-1 mb-3">
                  {ch.tips.map((tip, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-green-500">•</span>
                      {tip}
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {ch.practice.map((word) => (
                    <button
                      key={word}
                      onClick={() => speak(word, 0.7)}
                      className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm hover:bg-blue-50 hover:border-blue-300 transition"
                    >
                      {word} 🔊
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Minimal Pairs */}
            <div className="card">
              <h3 className="font-bold mb-3">🎯 最小对立体练习</h3>
              <p className="text-sm text-gray-500 mb-3">
                最小对立体是只差一个音的单词对。练习区分它们能提高听力敏感度。
              </p>
              {exercises.map((ex) => (
                <div key={ex.id} className="mb-4">
                  <div className="font-medium text-sm mb-2">{ex.chineseDescription}</div>
                  <div className="space-y-2">
                    {ex.items.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 rounded-lg bg-gray-50 p-2"
                      >
                        <button
                          onClick={() => speak(item.word1, 0.7)}
                          className="flex-1 text-left rounded-lg bg-white p-2 border hover:bg-blue-50 transition"
                        >
                          <div className="font-medium text-sm">{item.word1}</div>
                          <div className="text-xs text-gray-500">{item.ipa1}</div>
                        </button>
                        <span className="text-gray-400 text-xs px-1">{item.chineseDifference}</span>
                        <button
                          onClick={() => speak(item.word2, 0.7)}
                          className="flex-1 text-left rounded-lg bg-white p-2 border hover:bg-blue-50 transition"
                        >
                          <div className="font-medium text-sm">{item.word2}</div>
                          <div className="text-xs text-gray-500">{item.ipa2}</div>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      // ---- Quiz ----
      case "quiz":
        return (
          <div className="space-y-4">
            <div className="card bg-purple-50">
              <h2 className="text-lg font-bold text-purple-800 mb-1">
                🎯 自然拼读测验
              </h2>
              <p className="text-sm text-purple-600">
                共 {QUIZ_QUESTIONS.length} 题，测试你的拼读知识掌握程度。
              </p>
              {quizSubmitted && (
                <div className="mt-3 rounded-lg bg-white p-3 text-center">
                  <div className="text-3xl font-bold text-purple-700">
                    {quizScore}/{QUIZ_QUESTIONS.length}
                  </div>
                  <div className="text-sm text-gray-500">
                    正确率 {Math.round((quizScore / QUIZ_QUESTIONS.length) * 100)}%
                  </div>
                  <div className="mt-2 text-sm">
                    {quizScore === QUIZ_QUESTIONS.length
                      ? "🎉 满分！太厉害了！"
                      : quizScore >= QUIZ_QUESTIONS.length * 0.8
                      ? "👍 很棒！掌握得不错！"
                      : quizScore >= QUIZ_QUESTIONS.length * 0.6
                      ? "📚 还不错，继续加油！"
                      : "💪 需要再复习一下哦！"}
                  </div>
                </div>
              )}
            </div>

            {QUIZ_QUESTIONS.map((q, qIdx) => (
              <div key={qIdx} className="card">
                <div className="flex items-start gap-2 mb-3">
                  <span className="flex-shrink-0 rounded-full bg-primary-100 px-2 py-0.5 text-xs font-bold text-primary-700">
                    {qIdx + 1}
                  </span>
                  <div>
                    <div className="font-medium text-sm">{q.question}</div>
                    <div className="text-xs text-gray-500">{q.questionZh}</div>
                  </div>
                </div>
                <div className="space-y-2">
                  {q.options.map((opt, oIdx) => {
                    const isSelected = quizAnswers[qIdx] === oIdx;
                    const isCorrect = q.answer === oIdx;
                    let optClass = "border-gray-200 bg-white hover:bg-gray-50";
                    if (quizSubmitted) {
                      if (isCorrect) optClass = "border-green-400 bg-green-50";
                      else if (isSelected && !isCorrect) optClass = "border-red-400 bg-red-50";
                    } else if (isSelected) {
                      optClass = "border-primary-400 bg-primary-50";
                    }
                    return (
                      <button
                        key={oIdx}
                        onClick={() => !quizSubmitted && handleQuizAnswer(qIdx, oIdx)}
                        disabled={quizSubmitted}
                        className={`w-full rounded-lg border-2 p-2 text-left text-sm transition ${optClass}`}
                      >
                        <span className="font-medium">{String.fromCharCode(65 + oIdx)}.</span>{" "}
                        {opt}
                        {quizSubmitted && isCorrect && (
                          <span className="ml-2 text-green-600">✓</span>
                        )}
                        {quizSubmitted && isSelected && !isCorrect && (
                          <span className="ml-2 text-red-600">✗</span>
                        )}
                      </button>
                    );
                  })}
                </div>
                {quizSubmitted && (
                  <div className="mt-2 rounded-lg bg-blue-50 p-2">
                    <div className="text-xs text-blue-700">
                      💡 {q.explanationZh}
                    </div>
                  </div>
                )}
              </div>
            ))}

            <div className="flex gap-3">
              {!quizSubmitted ? (
                <button
                  onClick={handleQuizSubmit}
                  disabled={quizAnswers.filter((a) => a !== undefined).length < QUIZ_QUESTIONS.length}
                  className="flex-1 rounded-xl bg-primary-500 py-3 font-bold text-white disabled:opacity-50"
                >
                  提交答案
                </button>
              ) : (
                <button
                  onClick={handleQuizReset}
                  className="flex-1 rounded-xl bg-primary-500 py-3 font-bold text-white"
                >
                  🔄 重新测试
                </button>
              )}
            </div>
          </div>
        );

      // ---- Resources ----
      case "resources":
        return (
          <div className="space-y-4">
            <div className="card bg-pink-50">
              <h2 className="text-lg font-bold text-pink-800 mb-1">
                📺 推荐视频资源
              </h2>
              <p className="text-sm text-pink-600">
                精选 Bilibili 自然拼读视频课程，点击直达。
              </p>
            </div>

            {/* Bilibili Resources */}
            <div className="space-y-3">
              {[
                {
                  title: "English Phonics 英语自然拼读课程（合辑）",
                  url: "https://www.bilibili.com/video/BV1hb41167ki/",
                  desc: "系统课程，从字母到拼读规则，适合零基础",
                  tag: "系统课程",
                  tagColor: "bg-blue-100 text-blue-700",
                },
                {
                  title: "最全自然拼读课程（21集）",
                  url: "https://www.bilibili.com/video/BV1sR4y1F7xA/",
                  desc: "最全的自然拼读视频教程，涵盖所有规则",
                  tag: "全面覆盖",
                  tagColor: "bg-green-100 text-green-700",
                },
                {
                  title: "Fun Phonics 自然拼读动画（60集）",
                  url: "https://www.bilibili.com/video/BV1t11TYsEMz/",
                  desc: "有趣好玩的自然拼读动画，寓教于乐",
                  tag: "趣味动画",
                  tagColor: "bg-purple-100 text-purple-700",
                },
                {
                  title: "牛津自然拼读 Oxford Phonics World L1-L5",
                  url: "https://www.bilibili.com/video/BV1hb41167ki/",
                  desc: "牛津出版社全套330集，从入门到精通",
                  tag: "牛津教材",
                  tagColor: "bg-amber-100 text-amber-700",
                },
                {
                  title: "蒲公英英语拼读王 Phonics Kids（全6册）",
                  url: "https://search.bilibili.com/all?keyword=%E8%92%99%E5%85%AC%E8%8B%B1%E8%AF%AD%E6%8B%BC%E8%AF%BB%E7%8E%8B",
                  desc: "经典拼读教材，PDF教材+视频配套",
                  tag: "经典教材",
                  tagColor: "bg-red-100 text-red-700",
                },
              ].map((resource, i) => (
                <a
                  key={i}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-xl border border-gray-200 bg-white p-4 transition hover:shadow-md"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">📺</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 text-sm">{resource.title}</span>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${resource.tagColor}`}>
                          {resource.tag}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{resource.desc}</div>
                    </div>
                    <span className="text-gray-300">→</span>
                  </div>
                </a>
              ))}
            </div>

            {/* YouTube Resources */}
            <div className="card">
              <h3 className="font-bold mb-3">🎬 YouTube 推荐</h3>
              <div className="space-y-2">
                {[
                  {
                    title: "Rachel's English — 美式发音",
                    url: "https://www.youtube.com/@rachelsenglish",
                    desc: "详细的美式英语发音教学，口型示范",
                  },
                  {
                    title: "English with Lucy — 英式发音",
                    url: "https://www.youtube.com/@englishwithlucy",
                    desc: "英式英语发音和语法教学",
                  },
                  {
                    title: "ABC Phonics Song",
                    url: "https://www.youtube.com/watch?v=PUMCE0HmVQo",
                    desc: "字母发音歌曲，适合入门跟唱",
                  },
                ].map((yt, i) => (
                  <a
                    key={i}
                    href={yt.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-lg bg-gray-50 p-2 hover:bg-red-50 transition"
                  >
                    <span className="text-xl">▶️</span>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{yt.title}</div>
                      <div className="text-xs text-gray-500">{yt.desc}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Practice Tools */}
            <div className="card">
              <h3 className="font-bold mb-3">🛠️ 在线练习工具</h3>
              <div className="space-y-2">
                {[
                  {
                    title: "Phonics Hero",
                    url: "https://www.phonicshero.com/",
                    desc: "互动拼读练习游戏",
                  },
                  {
                    title: "Starfall — Learn to Read",
                    url: "https://www.starfall.com/h/ltr-classic/",
                    desc: "免费的自然拼读学习网站",
                  },
                  {
                    title: "Forvo — 发音词典",
                    url: "https://forvo.com/",
                    desc: "母语者真人发音，遇到不确定的词可以查",
                  },
                ].map((tool, i) => (
                  <a
                    key={i}
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-lg bg-gray-50 p-2 hover:bg-blue-50 transition"
                  >
                    <span className="text-xl">🔗</span>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{tool.title}</div>
                      <div className="text-xs text-gray-500">{tool.desc}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // ============================================================
  // Tabs
  // ============================================================

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: "overview", label: "总览", icon: "📖" },
    { key: "alphabet", label: "字母", icon: "🔤" },
    { key: "rules", label: "规则", icon: "📐" },
    { key: "chinese", label: "发音难点", icon: "🇨🇳" },
    { key: "quiz", label: "测验", icon: "🎯" },
    { key: "resources", label: "资源", icon: "📺" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3">
        <h1 className="text-xl font-bold">🔤 自然拼读 Phonics</h1>
        <p className="text-sm text-gray-500 mt-1">见词能读，听音能写</p>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-1 overflow-x-auto bg-white border-b px-2 py-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              activeTab === tab.key
                ? "bg-primary-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4">{renderTab()}</div>
    </div>
  );
}
