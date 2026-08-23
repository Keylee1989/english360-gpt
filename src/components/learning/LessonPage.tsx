/**
 * Lesson Page
 *
 * Shows:
 * - Lesson content
 * - Learning activities
 * - Progress through lesson
 * - Feedback
 */

import { useState, useEffect } from "react";
import { UNIQUE_BEGINNER_WORDS } from "@/engines/vocabulary/data/beginner-words";
import { ActivityGenerator, type Exercise } from "@/engines/learning";

// ============================================================
// Types
// ============================================================

interface LessonState {
  currentActivity: number;
  totalActivities: number;
  score: number;
  completed: boolean;
}

// ============================================================
// Day 1 Lesson Content
// ============================================================

const DAY_1_CONTENT = {
  title: "Day 1: 你好，英语！",
  titleEn: "Day 1: Hello, English!",
  description: "学习基本问候语和第一个单词",
  activities: [
    {
      type: "intro" as const,
      title: "欢迎来到第一天",
      content: "今天我们学习：\n1. 基本问候语\n2. 5个简单单词\n3. 简单句子",
      chineseContent: "欢迎！今天我们将学习：\n1. 基本问候语\n2. 5个简单单词\n3. 简单句子",
    },
    {
      type: "phonics" as const,
      title: "字母 A-E",
      letters: ["A", "B", "C", "D", "E"],
      descriptions: [
        { letter: "A", sound: "/eɪ/", word: "apple", chinese: "苹果" },
        { letter: "B", sound: "/biː/", word: "banana", chinese: "香蕉" },
        { letter: "C", sound: "/siː/", word: "cat", chinese: "猫" },
        { letter: "D", sound: "/diː/", word: "dog", chinese: "狗" },
        { letter: "E", sound: "/iː/", word: "egg", chinese: "鸡蛋" },
      ],
    },
    {
      type: "vocabulary" as const,
      title: "基本问候语",
      words: ["hello", "hi", "goodbye", "bye", "thank"],
    },
    {
      type: "vocabulary" as const,
      title: "第一个单词",
      words: ["I", "you", "am", "is", "good"],
    },
    {
      type: "exercise" as const,
      title: "练习时间",
      description: "测试你学到的内容",
    },
    {
      type: "sentence" as const,
      title: "简单句子",
      sentences: [
        { english: "Hello, I am good.", chinese: "你好，我很好。" },
        { english: "I am a student.", chinese: "我是学生。" },
      ],
    },
  ],
};

// ============================================================
// Lesson Page Component
// ============================================================

export default function LessonPage() {
  const [lessonState, setLessonState] = useState<LessonState>({
    currentActivity: 0,
    totalActivities: DAY_1_CONTENT.activities.length,
    score: 0,
    completed: false,
  });

  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const activityGenerator = new ActivityGenerator(3); // Mixed mode

  useEffect(() => {
    loadExercise();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonState.currentActivity]);

  const loadExercise = () => {
    const activity = DAY_1_CONTENT.activities[lessonState.currentActivity];
    if (activity?.type === "exercise") {
      // Get first vocabulary word for exercise
      const word = UNIQUE_BEGINNER_WORDS.find(w => w.word === "hello");
      if (word) {
        const exercise = activityGenerator.generateExercise(word, "recognition");
        setCurrentExercise(exercise);
      }
    }
  };

  const handleNextActivity = () => {
    if (lessonState.currentActivity < lessonState.totalActivities - 1) {
      setLessonState({
        ...lessonState,
        currentActivity: lessonState.currentActivity + 1,
        score: lessonState.score + (isCorrect ? 1 : 0),
      });
      setShowFeedback(false);
      setSelectedAnswer(null);
    } else {
      setLessonState({
        ...lessonState,
        completed: true,
        score: lessonState.score + (isCorrect ? 1 : 0),
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

  const currentActivity = DAY_1_CONTENT.activities[lessonState.currentActivity];

  if (lessonState.completed) {
    return (
      <div className="page-container">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold text-primary-800 mb-2">
            恭喜完成！
          </h1>
          <p className="text-gray-600 mb-6">
            你完成了第一天的学习！
          </p>
          <div className="card mb-6">
            <h2 className="text-lg font-semibold mb-2">学习成果</h2>
            <p className="text-3xl font-bold text-primary-600">
              {lessonState.score} / {lessonState.totalActivities}
            </p>
            <p className="text-sm text-gray-500">正确率</p>
          </div>
          <button
            onClick={() => {
              setLessonState({
                currentActivity: 0,
                totalActivities: DAY_1_CONTENT.activities.length,
                score: 0,
                completed: false,
              });
            }}
            className="w-full rounded-lg bg-primary-500 px-4 py-3 font-medium text-white"
          >
            再学一次
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Day 1</span>
          <span>
            {lessonState.currentActivity + 1} / {lessonState.totalActivities}
          </span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full bg-primary-500 transition-all"
            style={{
              width: `${((lessonState.currentActivity + 1) / lessonState.totalActivities) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Activity Content */}
      <div className="card mb-6">
        {currentActivity?.type === "intro" && (
          <div>
            <h2 className="text-xl font-bold mb-4">{currentActivity.title}</h2>
            <div className="whitespace-pre-line text-gray-600">
              {currentActivity.chineseContent}
            </div>
          </div>
        )}

        {currentActivity?.type === "phonics" && (
          <div>
            <h2 className="text-xl font-bold mb-4">{currentActivity.title}</h2>
            <div className="space-y-3">
              {currentActivity.letters.map((letter, index) => {
                const desc = currentActivity.descriptions[index];
                return (
                  <div
                    key={letter}
                    className="flex items-center gap-4 rounded-lg bg-gray-50 p-3"
                  >
                    <div className="text-3xl font-bold text-primary-600">
                      {letter}
                    </div>
                    <div>
                      <div className="font-medium">{desc.sound}</div>
                      <div className="text-sm text-gray-500">
                        {desc.word} - {desc.chinese}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {currentActivity?.type === "vocabulary" && (
          <div>
            <h2 className="text-xl font-bold mb-4">{currentActivity.title}</h2>
            <div className="space-y-3">
              {currentActivity.words.map((word) => {
                const item = UNIQUE_BEGINNER_WORDS.find(
                  (w) => w.word.toLowerCase() === word.toLowerCase()
                );
                if (!item) return null;

                return (
                  <div
                    key={word}
                    className="rounded-lg bg-gray-50 p-3"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-lg font-bold">{item.word}</div>
                        <div className="text-sm text-gray-500">{item.ipa}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-primary-600">
                          {item.chineseMeaning}
                        </div>
                        <div className="text-xs text-gray-400">
                          {item.partOfSpeech.join(", ")}
                        </div>
                      </div>
                    </div>
                    {item.examples[0] && (
                      <div className="mt-2 border-t border-gray-200 pt-2 text-sm text-gray-600">
                        <div>{item.examples[0].english}</div>
                        <div className="text-gray-400">
                          {item.examples[0].chinese}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {currentActivity?.type === "exercise" && currentExercise && (
          <div>
            <h2 className="text-xl font-bold mb-4">{currentActivity.title}</h2>
            <p className="text-gray-600 mb-4">{currentActivity.description}</p>

            <div className="mb-4">
              <div className="text-lg font-bold text-center mb-2">
                {currentExercise.items[0]?.prompt}
              </div>
              <div className="text-sm text-gray-500 text-center">
                {currentExercise.items[0]?.chinesePrompt}
              </div>
            </div>

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
                  isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {isCorrect ? "正确！" : "错误，正确答案是：" + currentExercise.items[0]?.correctAnswer}
              </div>
            )}
          </div>
        )}

        {currentActivity?.type === "sentence" && (
          <div>
            <h2 className="text-xl font-bold mb-4">{currentActivity.title}</h2>
            <div className="space-y-4">
              {currentActivity.sentences.map((sentence, index) => (
                <div
                  key={index}
                  className="rounded-lg bg-gray-50 p-4"
                >
                  <div className="text-lg font-medium">{sentence.english}</div>
                  <div className="text-sm text-gray-500">{sentence.chinese}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-3">
        {lessonState.currentActivity > 0 && (
          <button
            onClick={() =>
              setLessonState({
                ...lessonState,
                currentActivity: lessonState.currentActivity - 1,
              })
            }
            className="flex-1 rounded-lg border border-gray-300 px-4 py-3 font-medium text-gray-700"
          >
            上一步
          </button>
        )}
        {currentActivity?.type === "exercise" && !showFeedback ? (
          <button
            onClick={handleSubmitAnswer}
            disabled={selectedAnswer === null}
            className="flex-1 rounded-lg bg-primary-500 px-4 py-3 font-medium text-white disabled:opacity-50"
          >
            提交答案
          </button>
        ) : (
          <button
            onClick={handleNextActivity}
            className="flex-1 rounded-lg bg-primary-500 px-4 py-3 font-medium text-white"
          >
            {lessonState.currentActivity === lessonState.totalActivities - 1
              ? "完成"
              : "下一步"}
          </button>
        )}
      </div>
    </div>
  );
}
