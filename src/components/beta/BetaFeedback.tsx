/**
 * Beta Feedback Component
 *
 * Collects daily and weekly feedback from beta users
 *
 * Daily Questions:
 * 1. Today's difficulty?
 * 2. What confused you?
 * 3. What was useful?
 * 4. Did you want to continue tomorrow?
 *
 * Weekly Questions:
 * 1. Progress feeling
 * 2. Motivation
 * 3. Most useful feature
 * 4. Biggest problem
 */

import { useState } from "react";

// ============================================================
// Types
// ============================================================

interface DailyFeedbackData {
  difficulty: "easy" | "normal" | "hard";
  confused: string;
  useful: string;
  wantToContinue: boolean;
  rating: number;
}

interface WeeklyFeedbackData {
  progressFeeling: "better" | "same" | "worse";
  motivation: "high" | "medium" | "low";
  mostUsefulFeature: string;
  biggestProblem: string;
  suggestions: string;
}

interface BetaFeedbackProps {
  type: "daily" | "weekly";
  userId: string;
  date?: string;
  weekNumber?: number;
  onSubmit: (data: DailyFeedbackData | WeeklyFeedbackData) => void;
  onSkip: () => void;
}

// ============================================================
// Storage
// ============================================================

const STORAGE_KEY = "english360_beta_feedback";

function saveFeedback(data: unknown): void {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const feedbacks = stored ? JSON.parse(stored) : [];
    feedbacks.push(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(feedbacks));
  } catch (e) {
    console.error("Failed to save feedback:", e);
  }
}

// ============================================================
// Component
// ============================================================

function BetaFeedback({
  type,
  userId,
  date,
  weekNumber,
  onSubmit,
  onSkip,
}: BetaFeedbackProps) {
  // Daily feedback state
  const [difficulty, setDifficulty] = useState<"easy" | "normal" | "hard">("normal");
  const [confused, setConfused] = useState("");
  const [useful, setUseful] = useState("");
  const [wantToContinue, setWantToContinue] = useState(true);
  const [rating, setRating] = useState(3);

  // Weekly feedback state
  const [progressFeeling, setProgressFeeling] = useState<"better" | "same" | "worse">("same");
  const [motivation, setMotivation] = useState<"high" | "medium" | "low">("medium");
  const [mostUsefulFeature, setMostUsefulFeature] = useState("");
  const [biggestProblem, setBiggestProblem] = useState("");
  const [suggestions, setSuggestions] = useState("");

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (type === "daily") {
      const data: DailyFeedbackData = {
        difficulty,
        confused,
        useful,
        wantToContinue,
        rating,
      };
      saveFeedback({ type: "daily", userId, date, ...data });
      onSubmit(data);
    } else {
      const data: WeeklyFeedbackData = {
        progressFeeling,
        motivation,
        mostUsefulFeature,
        biggestProblem,
        suggestions,
      };
      saveFeedback({ type: "weekly", userId, weekNumber, ...data });
      onSubmit(data);
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="card text-center py-8">
        <div className="text-5xl mb-4">🎉</div>
        <h3 className="text-xl font-bold mb-2">感谢你的反馈！</h3>
        <p className="text-gray-600">
          你的反馈将帮助我们改进英语学习体验
        </p>
      </div>
    );
  }

  return (
    <div className="card space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold mb-2">
          {type === "daily" ? "每日反馈" : "每周反馈"}
        </h3>
        <p className="text-gray-600">
          {type === "daily"
            ? "告诉我们今天的学习体验"
            : "总结这一周的学习情况"}
        </p>
      </div>

      {type === "daily" ? (
        <>
          {/* Difficulty */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              今天的难度如何？
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["easy", "normal", "hard"] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`rounded-lg py-3 text-sm font-medium transition-colors ${
                    difficulty === d
                      ? d === "easy"
                        ? "bg-green-500 text-white"
                        : d === "normal"
                        ? "bg-blue-500 text-white"
                        : "bg-red-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {d === "easy" ? "简单 😊" : d === "normal" ? "适中 😐" : "困难 😅"}
                </button>
              ))}
            </div>
          </div>

          {/* Confused */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              今天有什么让你困惑的吗？
            </label>
            <textarea
              value={confused}
              onChange={(e) => setConfused(e.target.value)}
              placeholder="例如：某个单词的发音、语法规则..."
              className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-primary-500 focus:outline-none"
              rows={2}
            />
          </div>

          {/* Useful */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              今天什么内容对你最有用？
            </label>
            <textarea
              value={useful}
              onChange={(e) => setUseful(e.target.value)}
              placeholder="例如：词汇学习、听力练习、AI对话..."
              className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-primary-500 focus:outline-none"
              rows={2}
            />
          </div>

          {/* Want to continue */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              你想明天继续学习吗？
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setWantToContinue(true)}
                className={`flex-1 rounded-lg py-3 text-sm font-medium transition-colors ${
                  wantToContinue
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                想继续 👍
              </button>
              <button
                onClick={() => setWantToContinue(false)}
                className={`flex-1 rounded-lg py-3 text-sm font-medium transition-colors ${
                  !wantToContinue
                    ? "bg-red-500 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                不想 😔
              </button>
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              今天的学习体验评分
            </label>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-3xl transition-transform ${
                    star <= rating ? "scale-110" : "opacity-50"
                  }`}
                >
                  {star <= rating ? "⭐" : "☆"}
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Progress feeling */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              这周你的英语进步了吗？
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["better", "same", "worse"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setProgressFeeling(f)}
                  className={`rounded-lg py-3 text-sm font-medium transition-colors ${
                    progressFeeling === f
                      ? f === "better"
                        ? "bg-green-500 text-white"
                        : f === "same"
                        ? "bg-yellow-500 text-white"
                        : "bg-red-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {f === "better" ? "进步了 😊" : f === "same" ? "差不多 😐" : "退步了 😢"}
                </button>
              ))}
            </div>
          </div>

          {/* Motivation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              你的学习动力如何？
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["high", "medium", "low"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMotivation(m)}
                  className={`rounded-lg py-3 text-sm font-medium transition-colors ${
                    motivation === m
                      ? m === "high"
                        ? "bg-green-500 text-white"
                        : m === "medium"
                        ? "bg-yellow-500 text-white"
                        : "bg-red-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {m === "high" ? "很高 🔥" : m === "medium" ? "一般 😐" : "很低 😔"}
                </button>
              ))}
            </div>
          </div>

          {/* Most useful feature */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              这周最有用的功能是什么？
            </label>
            <select
              value={mostUsefulFeature}
              onChange={(e) => setMostUsefulFeature(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-primary-500 focus:outline-none"
            >
              <option value="">请选择</option>
              <option value="vocabulary">词汇学习</option>
              <option value="listening">听力练习</option>
              <option value="speaking">口语练习</option>
              <option value="ai_chat">AI对话</option>
              <option value="review">复习系统</option>
              <option value="progress">进度追踪</option>
            </select>
          </div>

          {/* Biggest problem */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              这周最大的问题是什么？
            </label>
            <textarea
              value={biggestProblem}
              onChange={(e) => setBiggestProblem(e.target.value)}
              placeholder="例如：时间不够、内容太难、发音不准..."
              className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-primary-500 focus:outline-none"
              rows={2}
            />
          </div>

          {/* Suggestions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              你有什么建议？
            </label>
            <textarea
              value={suggestions}
              onChange={(e) => setSuggestions(e.target.value)}
              placeholder="告诉我们如何改进..."
              className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-primary-500 focus:outline-none"
              rows={2}
            />
          </div>
        </>
      )}

      {/* Submit */}
      <div className="flex gap-3">
        <button
          onClick={onSkip}
          className="flex-1 rounded-lg border border-gray-300 py-3 text-gray-700"
        >
          跳过
        </button>
        <button
          onClick={handleSubmit}
          className="flex-1 rounded-lg bg-primary-500 py-3 text-white"
        >
          提交反馈
        </button>
      </div>
    </div>
  );
}

export default BetaFeedback;
