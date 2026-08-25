/**
 * CEFR Level Assessment Test
 * 
 * Quick test to determine user's current English level.
 * Tests: vocabulary, grammar, reading comprehension.
 * Result: recommended CEFR level + learning path.
 */

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

interface Question {
  id: number;
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  type: "vocab" | "grammar" | "reading";
  question: string;
  questionChinese: string;
  options: string[];
  correct: number;
  explanation: string;
  explanationChinese: string;
}

const QUESTIONS: Question[] = [
  // A1
  { id: 1, level: "A1", type: "vocab", question: "What does 'hello' mean?", questionChinese: "'hello'是什么意思？", options: ["再见", "你好", "谢谢", "对不起"], correct: 1, explanation: "Hello is a greeting.", explanationChinese: "Hello是问候语。" },
  { id: 2, level: "A1", type: "vocab", question: "Choose the correct meaning of 'water':", questionChinese: "选择'water'的正确含义：", options: ["食物", "水", "空气", "火"], correct: 1, explanation: "Water = 水", explanationChinese: "Water是水。" },
  { id: 3, level: "A1", type: "grammar", question: "I ___ a student.", questionChinese: "I ___ a student.", options: ["am", "is", "are", "be"], correct: 0, explanation: "I am = 我是", explanationChinese: "I后面用am。" },
  { id: 4, level: "A1", type: "grammar", question: "She ___ English every day.", questionChinese: "She ___ English every day.", options: ["study", "studies", "studying", "studied"], correct: 1, explanation: "Third person singular adds -s/-es.", explanationChinese: "第三人称单数加-s/-es。" },
  // A2
  { id: 5, level: "A2", type: "vocab", question: "What is the opposite of 'hot'?", questionChinese: "'hot'的反义词是什么？", options: ["warm", "cold", "cool", "mild"], correct: 1, explanation: "Hot ↔ Cold", explanationChinese: "Hot（热）的反义词是Cold（冷）。" },
  { id: 6, level: "A2", type: "grammar", question: "I have ___ to the store.", questionChinese: "I have ___ to the store.", options: ["go", "went", "gone", "going"], correct: 2, explanation: "Present perfect: have + past participle.", explanationChinese: "现在完成时：have + 过去分词。" },
  { id: 7, level: "A2", type: "reading", question: "'The cat is under the table.' Where is the cat?", questionChinese: "'The cat is under the table.' 猫在哪里？", options: ["在桌子上", "在桌子下", "在桌子旁边", "在房间里"], correct: 1, explanation: "Under = 在...下面", explanationChinese: "under表示在...下面。" },
  { id: 8, level: "A2", type: "grammar", question: "If it rains, I ___ stay home.", questionChinese: "如果下雨，我___待在家里。", options: ["will", "would", "can", "may"], correct: 0, explanation: "First conditional: if + present, will + base verb.", explanationChinese: "第一条件句：if + 现在时，will + 动词原形。" },
  // B1
  { id: 9, level: "B1", type: "vocab", question: "What does 'environment' mean?", questionChinese: "'environment'是什么意思？", options: ["环境", "发展", "政府", "教育"], correct: 0, explanation: "Environment = 环境", explanationChinese: "Environment是环境。" },
  { id: 10, level: "B1", type: "grammar", question: "She said she ___ tired.", questionChinese: "她说她___累了。", options: ["is", "was", "has been", "will be"], correct: 1, explanation: "Reported speech: tenses shift back.", explanationChinese: "间接引语：时态后退。" },
  { id: 11, level: "B1", type: "reading", question: "'Despite the rain, they went for a walk.' What happened?", questionChinese: "'Despite the rain, they went for a walk.' 发生了什么？", options: ["他们因为下雨没去", "他们下雨也去散步了", "他们等雨停了再去", "他们带伞去散步"], correct: 1, explanation: "Despite = 尽管", explanationChinese: "despite表示尽管，他们还是去了。" },
  { id: 12, level: "B1", type: "grammar", question: "I wish I ___ more money.", questionChinese: "我希望我___更多的钱。", options: ["have", "has", "had", "having"], correct: 2, explanation: "Wish + past tense for present wishes.", explanationChinese: "wish后用过去时表现在的愿望。" },
  // B2
  { id: 13, level: "B2", type: "vocab", question: "What does 'sustainable' mean?", questionChinese: "'sustainable'是什么意思？", options: ["可持续的", "敏感的", "合理的", "足够的"], correct: 0, explanation: "Sustainable = 可持续的", explanationChinese: "Sustainable是可持续的。" },
  { id: 14, level: "B2", type: "grammar", question: "The project ___ by next week.", questionChinese: "项目___在下周之前。", options: ["will complete", "will be completed", "is completing", "completes"], correct: 1, explanation: "Future passive: will be + past participle.", explanationChinese: "将来时被动语态：will be + 过去分词。" },
  { id: 15, level: "B2", type: "reading", question: "'Had I known about the meeting, I would have attended.' What does this mean?", questionChinese: "'Had I known about the meeting, I would have attended.' 这是什么意思？", options: ["我参加了会议", "如果我知道会议，我就会参加", "我不知道会议", "我后悔参加会议"], correct: 1, explanation: "Third conditional (inverted) = past unreal situation.", explanationChinese: "第三条件句（倒装）= 与过去事实相反。" },
  { id: 16, level: "B2", type: "grammar", question: "Not only ___ the exam, but she also got the highest score.", questionChinese: "她不仅___考试，还得了最高分。", options: ["she passed", "did she pass", "she did pass", "pass she"], correct: 1, explanation: "Negative inversion after 'not only'.", explanationChinese: "not only开头需要倒装。" },
  // C1
  { id: 17, level: "C1", type: "vocab", question: "What does 'ubiquitous' mean?", questionChinese: "'ubiquitous'是什么意思？", options: ["罕见的", "无处不在的", "独特的", "模糊的"], correct: 1, explanation: "Ubiquitous = present everywhere.", explanationChinese: "Ubiquitous是无处不在的。" },
  { id: 18, level: "C1", type: "grammar", question: "The report, ___ was published yesterday, reveals...", questionChinese: "这份报告，___昨天发布的，揭示了...", options: ["that", "which", "what", "it"], correct: 1, explanation: "Non-defining relative clause: use 'which' with commas.", explanationChinese: "非限定性关系从句用which，有逗号。" },
  // C2
  { id: 19, level: "C2", type: "vocab", question: "What does 'ephemeral' mean?", questionChinese: "'ephemeral'是什么意思？", options: ["永恒的", "短暂的", "神秘的", "优雅的"], correct: 1, explanation: "Ephemeral = lasting a very short time.", explanationChinese: "Ephemeral是短暂的。" },
  { id: 20, level: "C2", type: "grammar", question: "___ it not been for your help, I would have failed.", questionChinese: "___ not been for your help, I would have failed.", options: ["Has", "Had", "Have", "Having"], correct: 1, explanation: "Third conditional inversion: Had it not been for...", explanationChinese: "第三条件句倒装：Had it not been for...（要不是...）" },
];

const LEVEL_ORDER: ("A1" | "A2" | "B1" | "B2" | "C1" | "C2")[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

function getLevelFromScore(correctByLevel: Record<string, number>): string {
  // User must get at least 70% correct at a level to pass
  for (const level of LEVEL_ORDER) {
    const correct = correctByLevel[level] || 0;
    const total = QUESTIONS.filter((q) => q.level === level).length;
    if (total === 0) continue;
    const rate = correct / total;
    if (rate < 0.7) {
      // This level is too hard, return previous
      const idx = LEVEL_ORDER.indexOf(level as "A1");
      return idx > 0 ? LEVEL_ORDER[idx - 1] : "A1";
    }
  }
  return "C2";
}

export default function LevelTestPage() {
  const navigate = useNavigate();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const question = QUESTIONS[currentQ];
  const totalQuestions = QUESTIONS.length;
  const progress = ((currentQ) / totalQuestions) * 100;

  const handleAnswer = (optionIndex: number) => {
    setSelectedOption(optionIndex);
    setShowExplanation(true);
    setAnswers((prev) => ({ ...prev, [question.id]: optionIndex }));
  };

  const handleNext = () => {
    if (currentQ < totalQuestions - 1) {
      setCurrentQ(currentQ + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setShowResult(true);
    }
  };

  const result = useMemo(() => {
    if (!showResult) return null;
    const correctByLevel: Record<string, number> = {};
    for (const q of QUESTIONS) {
      if (answers[q.id] === q.correct) {
        correctByLevel[q.level] = (correctByLevel[q.level] || 0) + 1;
      }
    }
    const level = getLevelFromScore(correctByLevel);
    const totalCorrect = Object.values(answers).filter((a, i) => a === QUESTIONS[i]?.correct).length;
    return { level, totalCorrect, total: totalQuestions, correctByLevel };
  }, [showResult, answers]);

  if (showResult && result) {
    const levelInfo: Record<string, { color: string; desc: string; next: string }> = {
      A1: { color: "#22c55e", desc: "零基础入门", next: "从字母和基本词汇开始" },
      A2: { color: "#84cc16", desc: "初级日常", next: "可以进行简单日常对话" },
      B1: { color: "#eab308", desc: "中级交流", next: "能够独立处理大部分日常场景" },
      B2: { color: "#f97316", desc: "中高级流利", next: "能够流利表达复杂观点" },
      C1: { color: "#ef4444", desc: "高级运用", next: "接近母语水平" },
      C2: { color: "#9333ea", desc: "精通", next: "接近或达到母语水平" },
    };
    const info = levelInfo[result.level] || levelInfo.A1;

    return (
      <div className="min-h-screen bg-gray-50 pb-20 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="rounded-2xl bg-white p-6 shadow-lg text-center">
            <div className="text-5xl mb-4">🎯</div>
            <h2 className="text-2xl font-bold mb-2">测试完成！</h2>
            <p className="text-gray-500 mb-4">你的英语水平是</p>

            <div
              className="inline-block rounded-xl px-8 py-4 text-white text-3xl font-bold mb-4"
              style={{ backgroundColor: info.color }}
            >
              {result.level}
            </div>
            <p className="text-lg font-medium mb-1">{info.desc}</p>
            <p className="text-sm text-gray-500 mb-4">{info.next}</p>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="text-sm text-gray-600">
                答对 <span className="font-bold text-green-600">{result.totalCorrect}</span> / {result.total} 题
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => navigate("/resources")}
                className="w-full rounded-lg bg-blue-500 px-4 py-3 text-white font-medium"
              >
                查看{result.level}学习资源
              </button>
              <button
                onClick={() => navigate("/learn")}
                className="w-full rounded-lg bg-gray-100 px-4 py-3 text-gray-700 font-medium"
              >
                开始今日学习
              </button>
              <button
                onClick={() => {
                  setShowResult(false);
                  setCurrentQ(0);
                  setAnswers({});
                  setSelectedOption(null);
                  setShowExplanation(false);
                }}
                className="w-full text-sm text-gray-500 py-2"
              >
                重新测试
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isCorrect = selectedOption !== null && selectedOption === question.correct;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Progress */}
      <div className="bg-white border-b px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">
            第 {currentQ + 1} / {totalQuestions} 题
          </span>
          <span className="text-sm text-gray-500">{question.level}</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Question */}
      <div className="p-4 max-w-lg mx-auto">
        <div className="rounded-xl bg-white p-6 shadow-sm mb-4">
          <div className="text-xs text-blue-500 mb-2 font-medium">
            {question.type === "vocab" ? "📖 词汇" : question.type === "grammar" ? "📝 语法" : "👀 阅读理解"}
          </div>
          <h2 className="text-lg font-medium text-gray-900 mb-1">{question.question}</h2>
          <p className="text-sm text-gray-500">{question.questionChinese}</p>
        </div>

        {/* Options */}
        <div className="space-y-2">
          {question.options.map((opt, i) => {
            let style = "bg-white border-gray-200 hover:border-blue-400";
            if (selectedOption !== null) {
              if (i === question.correct) style = "bg-green-50 border-green-400";
              else if (i === selectedOption && !isCorrect) style = "bg-red-50 border-red-400";
              else style = "bg-gray-50 border-gray-200 opacity-50";
            }
            return (
              <button
                key={i}
                className={`w-full rounded-xl border-2 p-4 text-left transition ${style}`}
                disabled={selectedOption !== null}
                onClick={() => handleAnswer(i)}
              >
                <span className="font-medium">{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div className={`mt-4 rounded-xl p-4 ${isCorrect ? "bg-green-50" : "bg-amber-50"}`}>
            <div className="font-medium mb-1">
              {isCorrect ? "✅ 正确！" : "❌ 不对"}
            </div>
            <div className="text-sm text-gray-600">{question.explanationChinese}</div>
          </div>
        )}

        {/* Next Button */}
        {showExplanation && (
          <button
            onClick={handleNext}
            className="mt-4 w-full rounded-xl bg-blue-500 px-4 py-3 text-white font-medium"
          >
            {currentQ < totalQuestions - 1 ? "下一题" : "查看结果"}
          </button>
        )}
      </div>
    </div>
  );
}
