/**
 * Review Page
 *
 * Shows:
 * - Words due for review
 * - Review progress
 * - Performance feedback
 * - SRS statistics
 */

import { useState, useEffect } from "react";
import type { VocabularyItem } from "@/engines/vocabulary";
import { UNIQUE_BEGINNER_WORDS } from "@/engines/vocabulary/data/beginner-words";
import { ActivityGenerator, type Exercise } from "@/engines/learning";

// ============================================================
// Types
// ============================================================

interface ReviewState {
  currentIndex: number;
  totalItems: number;
  correctCount: number;
  incorrectCount: number;
  completed: boolean;
}

// ============================================================
// Review Page Component
// ============================================================

export default function ReviewPage() {
  const [reviewState, setReviewState] = useState<ReviewState>({
    currentIndex: 0,
    totalItems: 10, // Default review 10 items
    correctCount: 0,
    incorrectCount: 0,
    completed: false,
  });

  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [reviewItems, setReviewItems] = useState<VocabularyItem[]>([]);

  const activityGenerator = new ActivityGenerator(3);

  useEffect(() => {
    loadReviewItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (reviewItems.length > 0 && reviewState.currentIndex < reviewItems.length) {
      loadCurrentExercise();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reviewState.currentIndex, reviewItems]);

  const loadReviewItems = () => {
    // TODO: Load from SRS engine
    // For now, use random beginner words
    const shuffled = [...UNIQUE_BEGINNER_WORDS].sort(() => Math.random() - 0.5);
    setReviewItems(shuffled.slice(0, reviewState.totalItems));
  };

  const loadCurrentExercise = () => {
    const item = reviewItems[reviewState.currentIndex];
    if (item) {
      const exercise = activityGenerator.generateExercise(item, "recognition");
      setCurrentExercise(exercise);
    }
  };

  const handleNextItem = () => {
    if (reviewState.currentIndex < reviewItems.length - 1) {
      setReviewState({
        ...reviewState,
        currentIndex: reviewState.currentIndex + 1,
        correctCount: reviewState.correctCount + (isCorrect ? 1 : 0),
        incorrectCount: reviewState.incorrectCount + (isCorrect ? 0 : 1),
      });
      setShowFeedback(false);
      setSelectedAnswer(null);
    } else {
      setReviewState({
        ...reviewState,
        completed: true,
        correctCount: reviewState.correctCount + (isCorrect ? 1 : 0),
        incorrectCount: reviewState.incorrectCount + (isCorrect ? 0 : 1),
      });
    }
  };

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null || !currentExercise) return;

    const item = currentExercise.items[0];
    const result = activityGenerator.evaluateMultipleChoice(
      currentExercise,
      item.id,
      selectedAnswer
    );

    setIsCorrect(result.correct);
    setShowFeedback(true);
  };

  if (reviewState.completed) {
    const total = reviewState.correctCount + reviewState.incorrectCount;
    const accuracy = total > 0 ? reviewState.correctCount / total : 0;

    return (
      <div className="page-container">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold text-primary-800 mb-2">
            复习完成！
          </h1>
          <p className="text-gray-600 mb-6">
            你完成了 {reviewState.totalItems} 个单词的复习
          </p>

          <div className="card mb-6">
            <h2 className="text-lg font-semibold mb-4">复习结果</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {reviewState.correctCount}
                </div>
                <div className="text-sm text-gray-500">正确</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">
                  {reviewState.incorrectCount}
                </div>
                <div className="text-sm text-gray-500">错误</div>
              </div>
            </div>
            <div className="mt-4 border-t pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">
                  {Math.round(accuracy * 100)}%
                </div>
                <div className="text-sm text-gray-500">正确率</div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                setReviewState({
                  currentIndex: 0,
                  totalItems: 10,
                  correctCount: 0,
                  incorrectCount: 0,
                  completed: false,
                });
                loadReviewItems();
              }}
              className="w-full rounded-lg bg-primary-500 px-4 py-3 font-medium text-white"
            >
              再次复习
            </button>
            <button
              onClick={() => {
                setReviewState({
                  currentIndex: 0,
                  totalItems: 20,
                  correctCount: 0,
                  incorrectCount: 0,
                  completed: false,
                });
                loadReviewItems();
              }}
              className="w-full rounded-lg bg-gray-100 px-4 py-3 font-medium text-gray-700"
            >
              复习20个单词
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentItem = reviewItems[reviewState.currentIndex];

  return (
    <div className="page-container">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-500">
          <span>复习进度</span>
          <span>
            {reviewState.currentIndex + 1} / {reviewItems.length}
          </span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full bg-primary-500 transition-all"
            style={{
              width: `${((reviewState.currentIndex + 1) / reviewItems.length) * 100}%`,
            }}
          />
        </div>
        <div className="mt-2 flex justify-between text-xs text-gray-500">
          <span>正确：{reviewState.correctCount}</span>
          <span>错误：{reviewState.incorrectCount}</span>
        </div>
      </div>

      {/* Current Word */}
      {currentItem && (
        <div className="card mb-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">
              {currentItem.word}
            </div>
            <div className="text-lg text-gray-500 mb-1">{currentItem.ipa}</div>
            <div className="text-sm text-gray-400">
              {currentItem.partOfSpeech.join(", ")}
            </div>
          </div>
        </div>
      )}

      {/* Exercise */}
      {currentExercise && (
        <div className="card mb-6">
          <h2 className="text-lg font-semibold mb-4">
            选择正确的中文意思
          </h2>

          <div className="space-y-2">
            {currentExercise.items[0]?.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full rounded-lg border-2 p-3 text-left transition-colors ${
                  selectedAnswer === index
                    ? "border-primary-500 bg-primary-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          {showFeedback && (
            <div
              className={`mt-4 rounded-lg p-3 ${
                isCorrect
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {isCorrect
                ? "正确！"
                : "错误，正确答案是：" + currentExercise.items[0]?.correctAnswer}
            </div>
          )}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-3">
        {currentExercise && !showFeedback ? (
          <button
            onClick={handleSubmitAnswer}
            disabled={selectedAnswer === null}
            className="flex-1 rounded-lg bg-primary-500 px-4 py-3 font-medium text-white disabled:opacity-50"
          >
            提交答案
          </button>
        ) : (
          <button
            onClick={handleNextItem}
            className="flex-1 rounded-lg bg-primary-500 px-4 py-3 font-medium text-white"
          >
            {reviewState.currentIndex === reviewItems.length - 1
              ? "完成复习"
              : "下一个"}
          </button>
        )}
      </div>
    </div>
  );
}
