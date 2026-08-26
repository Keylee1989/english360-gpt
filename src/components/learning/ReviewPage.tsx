/**
 * Review Page
 *
 * Shows:
 * - Words from current day's curriculum (not random words)
 * - Review progress
 * - Performance feedback
 * - SRS statistics
 */

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { DAY_1_CURRICULUM } from "@/engines/curriculum/data/day1-detailed";
import type { VocabularyWord } from "@/engines/curriculum/data/day1-detailed";
import { markActivityComplete, updateProfileAfterActivity } from "@/services/activity-completion";

// ============================================================
// Types
// ============================================================

interface ReviewItem {
  id: string;
  word: string;
  ipa: string;
  chineseMeaning: string;
  example: string;
  exampleChinese: string;
  memoryMethod: string;
}

interface ReviewState {
  currentIndex: number;
  totalItems: number;
  correctCount: number;
  incorrectCount: number;
  completed: boolean;
}

interface QuizOption {
  text: string;
  isCorrect: boolean;
}

// ============================================================
// Helper: Convert curriculum word to review item
// ============================================================

function curriculumWordToReviewItem(word: VocabularyWord): ReviewItem {
  return {
    id: word.id,
    word: word.word,
    ipa: word.ipa,
    chineseMeaning: word.chinese,
    example: word.example,
    exampleChinese: word.exampleChinese,
    memoryMethod: word.memoryMethod,
  };
}

// ============================================================
// Helper: Generate quiz options for a word
// ============================================================

function generateQuizOptions(
  correctWord: ReviewItem,
  allWords: ReviewItem[]
): QuizOption[] {
  // Get 3 random wrong options from the same day's words
  const wrongPool = allWords.filter((w) => w.id !== correctWord.id);
  const shuffled = [...wrongPool].sort(() => Math.random() - 0.5);
  const wrongOptions = shuffled.slice(0, 3);

  // If not enough words in the pool, add common fallbacks
  const fallbacks = ["你好", "谢谢", "再见", "对不起", "请"];
  while (wrongOptions.length < 3) {
    const fallback = fallbacks[wrongOptions.length];
    if (fallback && !wrongOptions.some((w) => w.chineseMeaning === fallback)) {
      wrongOptions.push({
        id: `fallback_${wrongOptions.length}`,
        word: "",
        ipa: "",
        chineseMeaning: fallback,
        example: "",
        exampleChinese: "",
        memoryMethod: "",
      });
    }
    break;
  }

  // Build options: 1 correct + 3 wrong
  const options: QuizOption[] = [
    { text: correctWord.chineseMeaning, isCorrect: true },
    ...wrongOptions.map((w) => ({ text: w.chineseMeaning, isCorrect: false })),
  ];

  // Shuffle
  return options.sort(() => Math.random() - 0.5);
}

// ============================================================
// Review Page Component
// ============================================================

export default function ReviewPage() {
  const navigate = useNavigate();
  const [reviewState, setReviewState] = useState<ReviewState>({
    currentIndex: 0,
    totalItems: 0,
    correctCount: 0,
    incorrectCount: 0,
    completed: false,
  });

  const [reviewItems, setReviewItems] = useState<ReviewItem[]>([]);
  const [quizOptions, setQuizOptions] = useState<QuizOption[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Load review items from today's curriculum
  useEffect(() => {
    const loadReviewItems = () => {
      // Use Day 1 curriculum words (in production, would use current day)
      const curriculum = DAY_1_CURRICULUM;
      const items = curriculum.vocabulary.map(curriculumWordToReviewItem);

      // Shuffle
      const shuffled = [...items].sort(() => Math.random() - 0.5);

      setReviewItems(shuffled);
      setReviewState((prev) => ({
        ...prev,
        totalItems: shuffled.length,
      }));
    };

    loadReviewItems();
  }, []);

  // Generate quiz options when current item changes
  useEffect(() => {
    if (reviewItems.length > 0 && reviewState.currentIndex < reviewItems.length) {
      const currentItem = reviewItems[reviewState.currentIndex];
      const options = generateQuizOptions(currentItem, reviewItems);
      setQuizOptions(options);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setIsCorrect(false);
      setShowDetails(false);
    }
  }, [reviewState.currentIndex, reviewItems]);

  const handleAnswerSelect = useCallback((index: number) => {
    if (showFeedback) return; // Already submitted
    setSelectedAnswer(index);
  }, [showFeedback]);

  const handleSubmitAnswer = useCallback(() => {
    if (selectedAnswer === null) return;

    const selected = quizOptions[selectedAnswer];
    const correct = selected?.isCorrect || false;

    setIsCorrect(correct);
    setShowFeedback(true);
  }, [selectedAnswer, quizOptions]);

  const handleNextItem = useCallback(() => {
    if (reviewState.currentIndex < reviewItems.length - 1) {
      setReviewState((prev) => ({
        ...prev,
        currentIndex: prev.currentIndex + 1,
        correctCount: prev.correctCount + (isCorrect ? 1 : 0),
        incorrectCount: prev.incorrectCount + (isCorrect ? 0 : 1),
      }));
    } else {
      setReviewState((prev) => ({
        ...prev,
        completed: true,
        correctCount: prev.correctCount + (isCorrect ? 1 : 0),
        incorrectCount: prev.incorrectCount + (isCorrect ? 0 : 1),
      }));
    }
  }, [reviewState.currentIndex, reviewItems.length, isCorrect]);

  const handleRestart = useCallback(() => {
    const shuffled = [...reviewItems].sort(() => Math.random() - 0.5);
    setReviewItems(shuffled);
    setReviewState({
      currentIndex: 0,
      totalItems: shuffled.length,
      correctCount: 0,
      incorrectCount: 0,
      completed: false,
    });
  }, [reviewItems]);

  // When review completes: report completion to home progress + update profile
  useEffect(() => {
    if (!reviewState.completed) return;
    const total = reviewState.correctCount + reviewState.incorrectCount;
    const accuracy = total > 0 ? reviewState.correctCount / total : 0;
    // Mastered words: correct answers count as learned; ≥80% overall counts them mastered
    updateProfileAfterActivity({
      wordsLearned: reviewState.correctCount,
      wordsMastered: accuracy >= 0.8 ? reviewState.correctCount : Math.floor(reviewState.correctCount / 2),
    });
    markActivityComplete("srs_review");
  }, [reviewState.completed]); // eslint-disable-line react-hooks/exhaustive-deps

  // ============================================================
  // Empty state: no words to review
  // ============================================================

  if (reviewItems.length === 0) {
    return (
      <div className="page-container">
        <div className="text-center py-12">
          <div className="text-5xl mb-4">📚</div>
          <h1 className="text-2xl font-bold text-primary-800 mb-2">
            暂无复习内容
          </h1>
          <p className="text-gray-600 mb-4">
            请先完成今天的学习课程，然后再来复习
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // Completed state
  // ============================================================

  if (reviewState.completed) {
    const total = reviewState.correctCount + reviewState.incorrectCount;
    const accuracy = total > 0 ? reviewState.correctCount / total : 0;

    return (
      <div className="page-container">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">
            {accuracy >= 0.8 ? "🎉" : accuracy >= 0.5 ? "💪" : "📖"}
          </div>
          <h1 className="text-2xl font-bold text-primary-800 mb-2">
            复习完成！
          </h1>
          <p className="text-gray-600 mb-6">
            你复习了 {reviewState.totalItems} 个单词
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

          {/* Show which words were wrong */}
          {reviewState.incorrectCount > 0 && (
            <div className="card mb-6 text-left">
              <h3 className="text-lg font-semibold mb-3">❌ 需要再复习的单词</h3>
              <div className="space-y-2">
                {reviewItems.slice(0, reviewState.correctCount + reviewState.incorrectCount).map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-2 rounded bg-red-50">
                    <span className="font-medium text-red-700">{item.word}</span>
                    <span className="text-gray-400">→</span>
                    <span className="text-primary-600">{item.chineseMeaning}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            {reviewState.incorrectCount > 0 && (
              <button
                onClick={handleRestart}
                className="w-full rounded-lg bg-primary-500 px-4 py-3 font-medium text-white"
              >
                复习错题 ({reviewState.incorrectCount}个)
              </button>
            )}
            <button
              onClick={() => navigate("/")}
              className="w-full rounded-lg border-2 border-primary-500 px-4 py-3 font-medium text-primary-600"
            >
              ✅ 完成，返回首页（进度已保存）
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // Current word being reviewed
  // ============================================================

  const currentItem = reviewItems[reviewState.currentIndex];

  return (
    <div className="page-container">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl font-bold text-primary-800">今日单词复习</h1>
        <p className="text-sm text-gray-500">
          Day 1 · {reviewState.totalItems} 个单词
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>复习进度</span>
          <span>
            {reviewState.currentIndex + 1} / {reviewItems.length}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full bg-primary-500 transition-all"
            style={{
              width: `${((reviewState.currentIndex + 1) / reviewItems.length) * 100}%`,
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>✅ 正确 {reviewState.correctCount}</span>
          <span>❌ 错误 {reviewState.incorrectCount}</span>
        </div>
      </div>

      {/* Word Card */}
      <div className="card mb-6 text-center">
        <div className="text-4xl font-bold text-primary-700 mb-2">
          {currentItem.word}
        </div>
        <div className="text-lg text-primary-500 mb-1">{currentItem.ipa}</div>
      </div>

      {/* Quiz: Choose the correct Chinese meaning */}
      <div className="card mb-6">
        <h2 className="text-lg font-semibold mb-4">
          这个单词的中文意思是什么？
        </h2>

        <div className="space-y-2">
          {quizOptions.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={showFeedback}
              className={`w-full rounded-lg border-2 p-4 text-left text-lg transition-colors ${
                showFeedback
                  ? option.isCorrect
                    ? "border-green-500 bg-green-50 text-green-800"
                    : selectedAnswer === index
                    ? "border-red-500 bg-red-50 text-red-800"
                    : "border-gray-200 opacity-50"
                  : selectedAnswer === index
                  ? "border-primary-500 bg-primary-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <span className="font-medium">{option.text}</span>
              {showFeedback && option.isCorrect && (
                <span className="ml-2 text-green-600">✓ 正确答案</span>
              )}
              {showFeedback && selectedAnswer === index && !option.isCorrect && (
                <span className="ml-2 text-red-600">✗ 你选的</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Submit / Feedback */}
      {!showFeedback ? (
        <button
          onClick={handleSubmitAnswer}
          disabled={selectedAnswer === null}
          className="w-full rounded-lg bg-primary-500 px-4 py-3 font-medium text-white disabled:opacity-50"
        >
          提交答案
        </button>
      ) : (
        <div className="space-y-3">
          {/* Feedback */}
          <div
            className={`rounded-lg p-4 text-center ${
              isCorrect
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            <div className="text-2xl mb-1">{isCorrect ? "🎉 正确！" : "😅 不对"}</div>
            {!isCorrect && (
              <div className="text-sm">
                正确答案是：<strong>{currentItem.chineseMeaning}</strong>
              </div>
            )}
          </div>

          {/* Details toggle */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full text-sm text-gray-500 hover:text-gray-700"
          >
            {showDetails ? "收起详情 ▲" : "查看详情 ▼"}
          </button>

          {/* Details */}
          {showDetails && (
            <div className="card text-left space-y-3">
              <div>
                <span className="text-sm text-gray-500">例句：</span>
                <div className="font-medium">{currentItem.example}</div>
                <div className="text-sm text-gray-500">{currentItem.exampleChinese}</div>
              </div>
              <div>
                <span className="text-sm text-gray-500">记忆方法：</span>
                <div className="text-sm text-amber-700 bg-amber-50 p-2 rounded">
                  💡 {currentItem.memoryMethod}
                </div>
              </div>
            </div>
          )}

          {/* Next button */}
          <button
            onClick={handleNextItem}
            className="w-full rounded-lg bg-primary-500 px-4 py-3 font-medium text-white"
          >
            {reviewState.currentIndex === reviewItems.length - 1
              ? "完成复习"
              : "下一个单词 →"}
          </button>
        </div>
      )}
    </div>
  );
}
