/**
 * PhonicsPage — 自然拼读知识大全 (Enhanced v2)
 *
 * Improvements over v1:
 * - Alphabet: shows both uppercase+lowercase (Aa), 3 buttons per letter
 *   (name / phoneme / example word)
 * - Rules: dedicated sound isolation buttons, richer example display
 * - Blending practice section in overview
 * - Dynamic quiz generated from engine data
 * - Chinese challenges with mouth diagram hints
 */

import { useState, useCallback, useMemo } from "react";
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

/**
 * English text approximations for each letter's phoneme sound.
 * Web Speech API cannot play isolated IPA phonemes, so we use
 * carefully chosen English text that the TTS engine pronounces
 * close to the target phoneme.
 */
const LETTER_PHONEME_SOUND: Record<string, string> = {
  A: "aa",      // /æ/ as in cat
  B: "buh",     // /b/
  C: "kuh",     // /k/
  D: "duh",     // /d/
  E: "eh",      // /ɛ/ as in bed
  F: "fuh",     // /f/
  G: "guh",     // /ɡ/
  H: "huh",     // /h/
  I: "ih",      // /ɪ/ as in sit
  J: "juh",     // /dʒ/
  K: "kuh",     // /k/
  L: "luh",     // /l/
  M: "muh",     // /m/
  N: "nuh",     // /n/
  O: "ah",      // /ɒ/ as in hot
  P: "puh",     // /p/
  Q: "kyoo",    // /kjuː/
  R: "ruh",     // /r/
  S: "suh",     // /s/
  T: "tuh",     // /t/
  U: "uh",      // /ʌ/ as in cup
  V: "vuh",     // /v/
  W: "wuh",     // /w/
  X: "ks",      // /ks/
  Y: "yuh",     // /j/
  Z: "zuh",     // /z/
};

/** English approximations for IPA symbols */
const IPA_SOUND_MAP: Record<string, string> = {
  "/æ/": "aa",      // as in cat
  "/ɛ/": "eh",      // as in bed
  "/ɪ/": "ih",      // as in sit
  "/ɒ/": "oh",      // as in hot
  "/ʌ/": "uh",      // as in cup
  "/eɪ/": "ay",     // as in cake
  "/iː/": "ee",     // as in tree
  "/aɪ/": "eye",    // as in bike
  "/oʊ/": "oh",     // as in home
  "/juː/": "you",   // as in cute
  "/tʃ/": "chuh",   // as in chair
  "/ʃ/": "shh",     // as in ship
  "/θ/": "th",      // as in think (voiceless)
  "/ð/": "thh",     // as in this (voiced)
  "/ŋ/": "ng",      // as in sing
  "/s/": "sss",     // as in sun
  "/z/": "zzz",     // as in zoo
  "/r/": "rrr",     // as in red
  "/l/": "lll",     // as in light
  "/dʒ/": "juh",    // as in juice
  "/b/": "buh",     // as in bus
  "/d/": "duh",     // as in dog
  "/f/": "fff",     // as in fish
  "/ɡ/": "guh",     // as in go
  "/h/": "huh",     // as in hat
  "/k/": "kuh",     // as in cat
  "/m/": "mmm",     // as in moon
  "/n/": "nnn",     // as in no
  "/p/": "puh",     // as in pen
  "/t/": "tuh",     // as in tree
  "/v/": "vvv",     // as in van
  "/w/": "wuh",     // as in water
  "/j/": "yuh",     // as in yellow
};

/** Play a phoneme using English text approximation */
function speakPhoneme(text: string, rate = 0.5) {
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US";
  u.rate = rate;
  u.pitch = 1.0;
  window.speechSynthesis.speak(u);
}

/** English approximations for rule patterns */
const RULE_PATTERN_SOUND: Record<string, string> = {
  "a": "aa",
  "e": "eh",
  "i": "ih",
  "o": "oh",
  "u": "uh",
  "a_e": "ay",
  "ee": "ee",
  "i_e": "eye",
  "o_e": "oh",
  "u_e": "you",
  "ch": "chuh",
  "sh": "shh",
  "th": "th",
  "ng": "ng",
};

/** Play a letter's phoneme sound */
function speakLetterPhoneme(letter: string) {
  const sound = LETTER_PHONEME_SOUND[letter.toUpperCase()];
  if (sound) speakPhoneme(sound, 0.5);
}

/** Play a rule pattern's sound */
function speakRulePattern(pattern: string) {
  const sound = RULE_PATTERN_SOUND[pattern];
  if (sound) {
    speakPhoneme(sound, 0.5);
  } else {
    // Fallback: speak the first example word
    speak(pattern, 0.6);
  }
}

/** Play an IPA symbol's sound */
function speakIPASound(ipa: string) {
  const sound = IPA_SOUND_MAP[ipa] || ipa;
  speakPhoneme(sound, 0.5);
}

// ============================================================
// Tab Types
// ============================================================

type Tab = "overview" | "alphabet" | "rules" | "blending" | "chinese" | "quiz" | "resources";

// ============================================================
// Dynamic Quiz Generation
// ============================================================

interface QuizQuestion {
  question: string;
  questionZh: string;
  options: string[];
  answer: number;
  explanation: string;
  explanationZh: string;
  type: "letter" | "rule" | "challenge" | "blend";
}

function generateQuizQuestions(engine: PhonicsEngine): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  const alphabet = engine.getAlphabet();
  const rules = engine.getRulesByOrder();
  const challenges = engine.getChineseChallenges();

  // Type 1: Letter sound questions (pick 5 random letters)
  const shuffledAlpha = [...alphabet].sort(() => Math.random() - 0.5);
  for (const letter of shuffledAlpha.slice(0, 5)) {
    const wrongLetters = alphabet
      .filter((l) => l.uppercase !== letter.uppercase)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    const options = [letter.uppercase, ...wrongLetters.map((l) => l.uppercase)].sort(
      () => Math.random() - 0.5
    );
    questions.push({
      question: `Which letter makes the ${letter.soundIPA} sound?`,
      questionZh: `哪个字母发 ${letter.soundIPA} 的音？`,
      options,
      answer: options.indexOf(letter.uppercase),
      explanation: `The letter ${letter.uppercase} (${letter.name}) makes the ${letter.soundIPA} sound, as in "${letter.example}".`,
      explanationZh: `字母 ${letter.uppercase}（名称 ${letter.name}）发 ${letter.soundIPA} 的音，如 "${letter.example}"（${letter.exampleMeaning}）。`,
      type: "letter",
    });
  }

  // Type 2: Rule identification questions (pick 4 random rules)
  const shuffledRules = [...rules].sort(() => Math.random() - 0.5);
  for (const rule of shuffledRules.slice(0, 4)) {
    const correctExample = rule.examples[Math.floor(Math.random() * rule.examples.length)];
    const wrongRules = rules
      .filter((r) => r.id !== rule.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    const options = [rule.chineseName, ...wrongRules.map((r) => r.chineseName)].sort(
      () => Math.random() - 0.5
    );
    questions.push({
      question: `In the word "${correctExample.word}" (${correctExample.ipa}), which phonics rule applies?`,
      questionZh: `单词 "${correctExample.word}"（${correctExample.ipa}）用了哪个拼读规则？`,
      options,
      answer: options.indexOf(rule.chineseName),
      explanation: `"${correctExample.word}" uses the ${rule.name} rule (${rule.pattern} = ${rule.soundIPA}). ${rule.chineseDescription}`,
      explanationZh: `"${correctExample.word}"（${correctExample.chineseMeaning}）使用了${rule.chineseName}规则（${rule.pattern} = ${rule.soundIPA}）。`,
      type: "rule",
    });
  }

  // Type 3: Chinese challenge questions (pick 3)
  const chalArr = challenges.challenges;
  const shuffledChal = [...chalArr].sort(() => Math.random() - 0.5);
  for (const ch of shuffledChal.slice(0, 3)) {
    const wrongChal = chalArr
      .filter((c) => c.sound !== ch.sound)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    const options = [ch.chineseHint, ...wrongChal.map((c) => c.chineseHint)].sort(
      () => Math.random() - 0.5
    );
    questions.push({
      question: `The sound ${ch.ipa} is described as:`,
      questionZh: `音标 ${ch.ipa} 的发音方法是：`,
      options,
      answer: options.indexOf(ch.chineseHint),
      explanation: `${ch.ipa} — ${ch.chineseHint}. Tips: ${ch.tips.join("; ")}`,
      explanationZh: `${ch.ipa} — ${ch.chineseHint}。要点：${ch.tips.join("；")}`,
      type: "challenge",
    });
  }

  // Type 4: Blending questions
  const blendPairs = [
    { word: "cat", parts: ["c", "a", "t"], meaning: "猫" },
    { word: "ship", parts: ["sh", "i", "p"], meaning: "船" },
    { word: "think", parts: ["th", "i", "nk"], meaning: "想" },
    { word: "cake", parts: ["c", "a_ke"], meaning: "蛋糕" },
    { word: "tree", parts: ["tr", "ee"], meaning: "树" },
    { word: "fish", parts: ["f", "i", "sh"], meaning: "鱼" },
    { word: "book", parts: ["b", "oo", "k"], meaning: "书" },
    { word: "chair", parts: ["ch", "air"], meaning: "椅子" },
  ];
  const shuffledBlend = [...blendPairs].sort(() => Math.random() - 0.5);
  for (const bp of shuffledBlend.slice(0, 3)) {
    const wrongBlend = blendPairs
      .filter((b) => b.word !== bp.word)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    const options = [bp.word, ...wrongBlend.map((b) => b.word)].sort(
      () => Math.random() - 0.5
    );
    questions.push({
      question: `Blend these sounds: ${bp.parts.join(" + ")} = ?`,
      questionZh: `拼读这些音：${bp.parts.join(" + ")} = ？`,
      options,
      answer: options.indexOf(bp.word),
      explanation: `${bp.parts.join(" + ")} = ${bp.word} (${bp.meaning})`,
      explanationZh: `${bp.parts.join(" + ")} = ${bp.word}（${bp.meaning}）`,
      type: "blend",
    });
  }

  return questions.sort(() => Math.random() - 0.5);
}

// ============================================================
// Main Component
// ============================================================

export default function PhonicsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [expandedRule, setExpandedRule] = useState<string | null>(null);
  const [challengePlaying, setChallengePlaying] = useState<string | null>(null);
  const [blendResult, setBlendResult] = useState<string | null>(null);

  const engine = useMemo(() => new PhonicsEngine(), []);
  const alphabet = engine.getAlphabet();
  const rules = engine.getRulesByOrder();
  const challenges = engine.getChineseChallenges();
  const learningPath = engine.getLearningPath();
  const exercises = engine.getPronunciationExercises();

  // Generate quiz questions once (memoized)
  const quizQuestions = useMemo(() => generateQuizQuestions(engine), [engine]);

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
    ? quizQuestions.filter((q, i) => quizAnswers[i] === q.answer).length
    : 0;

  // Play challenge sound
  const playChallenge = useCallback((sound: string, words: string[]) => {
    setChallengePlaying(sound);
    words.forEach((w, i) => {
      setTimeout(() => speak(w, 0.7), i * 800);
    });
    setTimeout(() => setChallengePlaying(null), words.length * 800 + 500);
  }, []);

  // Blending practice handler
  const handleBlend = useCallback((word: string, partsStr: string) => {
    setBlendResult(null);
    // Parse hyphen-separated parts: "f-i-sh" -> ["f", "i", "sh"]
    const parts = partsStr.split("-").map(p => p.trim());
    // Speak each part slowly using letter phoneme sounds
    parts.forEach((p, i) => {
      setTimeout(() => {
        // If it's a single letter, use the phoneme map
        if (p.length === 1 && LETTER_PHONEME_SOUND[p.toUpperCase()]) {
          speakPhoneme(LETTER_PHONEME_SOUND[p.toUpperCase()], 0.4);
        } else {
          // Multi-char blend like "sh", "ch", "th" — speak as approximation
          const blendSounds: Record<string, string> = {
            sh: "shh", ch: "chuh", th: "th", ng: "ng",
            tr: "truh", dr: "duh", st: "stuh",
            "a_ke": "ay", "oo": "oo", "air": "air",
          };
          speakPhoneme(blendSounds[p.toLowerCase()] || p, 0.4);
        }
      }, i * 700);
    });
    // Then speak the whole word
    setTimeout(() => {
      speak(word, 0.6);
      setBlendResult(`${parts.join(" + ")} = ${word}`);
    }, parts.length * 700 + 400);
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
                👆 <strong>点击大写字母</strong>听字母名称读音，点击 <strong>🔊</strong> 听字母在单词中的发音，点击 <strong>例词</strong> 听完整单词
              </p>
            </div>
            {/* Vowels */}
            <div className="card">
              <h3 className="font-bold mb-1 text-red-700">🔴 元音 Vowels（5个）</h3>
              <p className="text-xs text-gray-500 mb-3">每个音节必须有元音，元音发音时间较长</p>
              <div className="grid grid-cols-5 gap-3">
                {alphabet
                  .filter((l) => ["A", "E", "I", "O", "U"].includes(l.uppercase))
                  .map((letter) => (
                    <div
                      key={letter.uppercase}
                      className="flex flex-col items-center rounded-xl border-2 border-red-200 bg-red-50 p-3"
                    >
                      {/* Clickable big letter — reads letter name */}
                      <button
                        onClick={() => speak(letter.uppercase, 0.6)}
                        className="text-4xl font-bold text-red-600 hover:text-red-800 active:scale-90 transition-all cursor-pointer mb-1"
                        title={`点击听字母名称: ${letter.name} (${letter.nameIPA})`}
                      >
                        {letter.uppercase}
                        <span className="text-2xl text-red-400">{letter.lowercase}</span>
                      </button>
                      <div className="text-[10px] text-gray-500 mb-1">{letter.nameIPA}</div>
                      {/* Phoneme sound button */}
                      <button
                        onClick={() => speakLetterPhoneme(letter.uppercase)}
                        className="w-full rounded-lg bg-white border border-red-200 px-1 py-1 text-[10px] font-medium text-red-600 hover:bg-red-100 active:scale-95 transition-all mb-1"
                        title="听字母在单词中的发音"
                      >
                        🔊 {letter.soundIPA}
                      </button>
                      {/* Example word button */}
                      <button
                        onClick={() => speak(letter.example, 0.7)}
                        className="w-full rounded-lg bg-red-100 border border-red-200 px-1 py-1 text-[10px] font-medium text-red-700 hover:bg-red-200 active:scale-95 transition-all"
                        title={`听例词: ${letter.example} (${letter.exampleMeaning})`}
                      >
                        {letter.example} 🔊
                      </button>
                    </div>
                  ))}
              </div>
            </div>
            {/* Consonants */}
            <div className="card">
              <h3 className="font-bold mb-1 text-blue-700">🔵 辅音 Consonants（21个）</h3>
              <p className="text-xs text-gray-500 mb-3">辅音发音较短促，气流受阻碍</p>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {alphabet
                  .filter((l) => !["A", "E", "I", "O", "U"].includes(l.uppercase))
                  .map((letter) => (
                    <div
                      key={letter.uppercase}
                      className="flex flex-col items-center rounded-xl border-2 border-blue-200 bg-blue-50 p-2"
                    >
                      {/* Clickable big letter — reads letter name */}
                      <button
                        onClick={() => speak(letter.uppercase, 0.6)}
                        className="text-2xl font-bold text-blue-600 hover:text-blue-800 active:scale-90 transition-all cursor-pointer"
                        title={`点击听字母名称: ${letter.name} (${letter.nameIPA})`}
                      >
                        {letter.uppercase}
                        <span className="text-lg text-blue-400">{letter.lowercase}</span>
                      </button>
                      {/* Phoneme sound button */}
                      <button
                        onClick={() => speakLetterPhoneme(letter.uppercase)}
                        className="w-full rounded bg-white border border-blue-200 px-1 py-0.5 text-[9px] text-blue-600 hover:bg-blue-100 active:scale-95 transition-all mt-1"
                        title="听字母在单词中的发音"
                      >
                        🔊 {letter.soundIPA}
                      </button>
                      {/* Example word button */}
                      <button
                        onClick={() => speak(letter.example, 0.7)}
                        className="w-full rounded bg-blue-100 border border-blue-200 px-1 py-0.5 text-[9px] text-blue-600 hover:bg-blue-200 active:scale-95 transition-all mt-0.5"
                        title={`听例词: ${letter.example} (${letter.exampleMeaning})`}
                      >
                        {letter.example} 🔊
                      </button>
                    </div>
                  ))}
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
                📚 以下是核心拼读规则。点击 <strong>🔊</strong> 按钮听发音示范。每个规则展开后有多个例词可点击听。
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
                    <span className="rounded-lg bg-primary-100 px-2 py-0.5 text-lg font-bold text-primary-700">
                      {rule.pattern}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        speak(rule.examples[0]?.word || rule.pattern, 0.7);
                      }}
                      className="rounded-full bg-primary-500 text-white w-7 h-7 flex items-center justify-center text-xs hover:bg-primary-600 transition"
                      title="听发音示范"
                    >
                      🔊
                    </button>
                    <span className="text-sm font-medium">{rule.chineseName}</span>
                  </div>
                  <span className="text-gray-400">
                    {expandedRule === rule.id ? "▲" : "▼"}
                  </span>
                </button>
                {expandedRule === rule.id && (
                  <div className="mt-3 space-y-3">
                    <p className="text-sm text-gray-600">{rule.chineseDescription}</p>

                    {/* Sound isolation row */}
                    <div className="rounded-lg bg-gray-50 p-3 space-y-2">
                      <div className="text-xs font-medium text-gray-500 mb-1">🔊 发音示范</div>
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => speakRulePattern(rule.pattern)}
                          className="rounded-lg bg-primary-100 px-3 py-1.5 text-sm font-bold text-primary-700 hover:bg-primary-200 transition"
                        >
                          模式: {rule.pattern} 🔊
                        </button>
                        <span className="text-gray-300">→</span>
                        <button
                          onClick={() => speakIPASound(rule.soundIPA)}
                          className="rounded-lg bg-green-100 px-3 py-1.5 text-sm font-mono font-bold text-green-700 hover:bg-green-200 transition"
                        >
                          {rule.soundIPA} 🔊
                        </button>
                        <span className="text-sm text-gray-500">{rule.chineseHint}</span>
                      </div>
                    </div>

                    {/* Example words grid */}
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

                    {/* Play all button */}
                    <button
                      onClick={() =>
                        speak(rule.examples.map((e) => e.word).join(", "), 0.7)
                      }
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

      // ---- Blending Practice ----
      case "blending":
        return (
          <div className="space-y-4">
            <div className="card bg-indigo-50">
              <h2 className="text-lg font-bold text-indigo-800 mb-2">
                🧩 拼读练习 Blending
              </h2>
              <p className="text-sm text-indigo-600">
                把分开的音拼在一起读出来。先慢速逐个音，再快速连读整个单词。
              </p>
            </div>

            {/* Interactive blending */}
            <div className="card">
              <h3 className="font-bold mb-3">🎯 互动拼读</h3>
              <p className="text-xs text-gray-500 mb-3">点击下方按钮，听系统逐音拼读然后连读整个单词：</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { word: "cat", parts: "c-a-t", meaning: "猫" },
                  { word: "dog", parts: "d-o-g", meaning: "狗" },
                  { word: "fish", parts: "f-i-sh", meaning: "鱼" },
                  { word: "ship", parts: "sh-i-p", meaning: "船" },
                  { word: "cake", parts: "c-a_ke", meaning: "蛋糕" },
                  { word: "tree", parts: "tr-ee", meaning: "树" },
                  { word: "book", parts: "b-oo-k", meaning: "书" },
                  { word: "think", parts: "th-i-nk", meaning: "想" },
                  { word: "chair", parts: "ch-air", meaning: "椅子" },
                  { word: "sun", parts: "s-u-n", meaning: "太阳" },
                  { word: "home", parts: "h-o_me", meaning: "家" },
                  { word: "milk", parts: "m-i-lk", meaning: "牛奶" },
                ].map((item) => (
                  <button
                    key={item.word}
                    onClick={() => handleBlend(item.word, item.parts)}
                    className="rounded-xl border-2 border-indigo-200 bg-white p-3 text-left hover:border-indigo-400 hover:bg-indigo-50 transition active:scale-95"
                  >
                    <div className="font-bold text-indigo-700">{item.word}</div>
                    <div className="text-xs text-gray-500">{item.parts}</div>
                    <div className="text-xs text-gray-400">{item.meaning}</div>
                  </button>
                ))}
              </div>
              {blendResult && (
                <div className="mt-3 rounded-lg bg-green-50 p-2 text-center text-sm text-green-700">
                  {blendResult}
                </div>
              )}
            </div>

            {/* Blending rules */}
            <div className="card">
              <h3 className="font-bold mb-3">📐 拼读技巧</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="rounded-lg bg-gray-50 p-3">
                  <div className="font-medium text-gray-800">1. 逐音慢读</div>
                  <p>先把每个音素单独发出来：/k/ - /æ/ - /t/</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <div className="font-medium text-gray-800">2. 加速连读</div>
                  <p>逐渐加快速度，把音连在一起：k-æ-t → cat</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <div className="font-medium text-gray-800">3. 重音标记</div>
                  <p>多音节词要注意重音位置，如 TEA-cher（重音在前）</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <div className="font-medium text-gray-800">4. 魔法 e 规则</div>
                  <p>词尾加 e，前面元音变长音：cap → cape, kit → kite</p>
                </div>
              </div>
            </div>
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
                共 {quizQuestions.length} 题，涵盖字母发音、拼读规则、发音难点和拼读练习。
              </p>
              {quizSubmitted && (
                <div className="mt-3 rounded-lg bg-white p-3 text-center">
                  <div className="text-3xl font-bold text-purple-700">
                    {quizScore}/{quizQuestions.length}
                  </div>
                  <div className="text-sm text-gray-500">
                    正确率 {Math.round((quizScore / quizQuestions.length) * 100)}%
                  </div>
                  <div className="mt-2 text-sm">
                    {quizScore === quizQuestions.length
                      ? "🎉 满分！太厉害了！"
                      : quizScore >= quizQuestions.length * 0.8
                      ? "👍 很棒！掌握得不错！"
                      : quizScore >= quizQuestions.length * 0.6
                      ? "📚 还不错，继续加油！"
                      : "💪 需要再复习一下哦！"}
                  </div>
                </div>
              )}
            </div>

            {quizQuestions.map((q, qIdx) => (
              <div key={qIdx} className="card">
                <div className="flex items-start gap-2 mb-3">
                  <span className="flex-shrink-0 rounded-full bg-primary-100 px-2 py-0.5 text-xs font-bold text-primary-700">
                    {qIdx + 1}
                  </span>
                  <div>
                    <div className="font-medium text-sm">{q.question}</div>
                    <div className="text-xs text-gray-500">{q.questionZh}</div>
                    <div className="mt-1">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          q.type === "letter"
                            ? "bg-blue-100 text-blue-700"
                            : q.type === "rule"
                            ? "bg-green-100 text-green-700"
                            : q.type === "challenge"
                            ? "bg-red-100 text-red-700"
                            : "bg-indigo-100 text-indigo-700"
                        }`}
                      >
                        {q.type === "letter"
                          ? "🔤 字母"
                          : q.type === "rule"
                          ? "📐 规则"
                          : q.type === "challenge"
                          ? "🇨🇳 发音"
                          : "🧩 拼读"}
                      </span>
                    </div>
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
                  disabled={quizAnswers.filter((a) => a !== undefined).length < quizQuestions.length}
                  className="flex-1 rounded-xl bg-primary-500 py-3 font-bold text-white disabled:opacity-50"
                >
                  提交答案 ({quizAnswers.filter((a) => a !== undefined).length}/{quizQuestions.length})
                </button>
              ) : (
                <button
                  onClick={handleQuizReset}
                  className="flex-1 rounded-xl bg-primary-500 py-3 font-bold text-white"
                >
                  🔄 重新测试（题目会随机更新）
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
    { key: "blending", label: "拼读", icon: "🧩" },
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
