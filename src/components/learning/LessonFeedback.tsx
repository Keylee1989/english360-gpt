/**
 * Lesson Feedback Component
 *
 * Collects feedback after each lesson:
 * - Difficulty rating
 * - Problem areas
 * - Time spent
 * - User satisfaction
 */

import { useState } from "react";

// ============================================================
// Types
// ============================================================

export interface LessonFeedbackData {
  lessonId: string;
  day: number;
  difficulty: "easy" | "normal" | "hard";
  problemAreas: string[];
  timeSpent: number;
  satisfaction: number; // 1-5
  comments: string;
  completedAt: number;
}

interface LessonFeedbackProps {
  lessonId: string;
  day: number;
  timeSpent: number;
  onSubmit: (feedback: LessonFeedbackData) => void;
  onSkip: () => void;
}

// ============================================================
// Storage
// ============================================================

const STORAGE_KEY = "english360_lesson_feedback";

function saveFeedback(feedback: LessonFeedbackData): void {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const feedbacks: LessonFeedbackData[] = stored ? JSON.parse(stored) : [];
    feedbacks.push(feedback);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(feedbacks));
  } catch (e) {
    console.error("Failed to save feedback:", e);
  }
}

// ============================================================
// Component
// ============================================================

export default function LessonFeedback({
  lessonId,
  day,
  timeSpent,
  onSubmit,
  onSkip,
}: LessonFeedbackProps) {
  const [difficulty, setDifficulty] = useState<"easy" | "normal" | "hard">("normal");
  const [problemAreas, setProblemAreas] = useState<string[]>([]);
  const [satisfaction, setSatisfaction] = useState(3);
  const [comments, setComments] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const problemOptions = [
    { id: "vocabulary", label: "词汇", labelEn: "Vocabulary" },
    { id: "listening", label: "听力", labelEn: "Listening" },
    { id: "speaking", label: "口语", labelEn: "Speaking" },
    { id: "grammar", label: "语法", labelEn: "Grammar" },
    { id: "pronunciation", label: "发音", labelEn: "Pronunciation" },
    { id: "speed", label: "速度", labelEn: "Speed" },
    { id: "none", label: "没有问题", labelEn: "No problems" },
  ];

  const handleProblemToggle = (problemId: string) => {
    if (problemId === "none") {
      setProblemAreas([]);
      return;
    }

    setProblemAreas((prev) =>
      prev.includes(problemId)
        ? prev.filter((p) => p !== problemId)
        : [...prev.filter((p) => p !== "none"), problemId]
    );
  };

  const handleSubmit = () => {
    const feedback: LessonFeedbackData = {
      lessonId,
      day,
      difficulty,
      problemAreas,
      timeSpent,
      satisfaction,
      comments,
      completedAt: Date.now(),
    };

    saveFeedback(feedback);
    onSubmit(feedback);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="card text-center py-8">
        <div className="text-5xl mb-4">🎉</div>
        <h3 className="text-xl font-bold mb-2">感谢你的反馈！</h3>
        <p className="text-gray-600 mb-4">
          你的反馈将帮助我们改进课程
        </p>
        <p className="text-sm text-gray-500">
          继续加油！你今天学习了 {Math.round(timeSpent / 60)} 分钟
        </p>
      </div>
    );
  }

  return (
    <div className="card space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold mb-2">课程反馈</h3>
        <p className="text-gray-600">
          请告诉我们今天的课程体验
        </p>
      </div>

      {/* Difficulty */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          难度如何？
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

      {/* Problem Areas */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          遇到的问题（可多选）
        </label>
        <div className="grid grid-cols-2 gap-2">
          {problemOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => handleProblemToggle(option.id)}
              className={`rounded-lg py-2 px-3 text-sm text-left transition-colors ${
                problemAreas.includes(option.id)
                  ? "bg-primary-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Satisfaction */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          满意度
        </label>
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setSatisfaction(star)}
              className={`text-3xl transition-transform ${
                star <= satisfaction ? "scale-110" : "opacity-50"
              }`}
            >
              {star <= satisfaction ? "⭐" : "☆"}
            </button>
          ))}
        </div>
      </div>

      {/* Comments */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          其他反馈（可选）
        </label>
        <textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="今天学到了什么？有什么建议？"
          className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-primary-500 focus:outline-none"
          rows={3}
        />
      </div>

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
