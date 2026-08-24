/**
 * Lesson Viewer Component (v2)
 * 
 * Activity-based lesson viewer:
 * - Loads lessons dynamically from curriculum data
 * - Supports all activity types
 * - 240-minute learning flow
 * - Progress tracking
 */

import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { AudioEngine } from "@/engines/audio";
import { ListeningEngine } from "@/engines/listening";
import { SpeakingEngine } from "@/engines/speaking";
import { getLessonByDay } from "@/engines/curriculum/data/stage1-lessons";
import type { LessonActivity } from "@/types/database";

// ============================================================
// Types
// ============================================================

interface LessonProgress {
  currentActivity: number;
  totalActivities: number;
  timeSpent: number;
  startTime: number;
  activitiesCompleted: string[];
}

// ============================================================
// Helper Functions
// ============================================================

const getActivityIcon = (type: LessonActivity["type"]): string => {
  const icons: Record<LessonActivity["type"], string> = {
    phonics: "🔤",
    vocabulary_introduction: "📚",
    vocabulary_recognition: "✅",
    vocabulary_recall: "🧠",
    grammar_explanation: "📝",
    grammar_practice: "✏️",
    listening_comprehension: "👂",
    listening_dictation: "✍️",
    speaking_repetition: "🗣️",
    speaking_conversation: "💬",
    reading_comprehension: "📖",
    writing_practice: "✍️",
    review: "🔄",
    assessment: "📊",
  };
  return icons[type] || "📖";
};

const getActivityTitle = (type: LessonActivity["type"]): string => {
  const titles: Record<LessonActivity["type"], string> = {
    phonics: "字母发音",
    vocabulary_introduction: "新词汇学习",
    vocabulary_recognition: "词汇识别",
    vocabulary_recall: "词汇回忆",
    grammar_explanation: "语法讲解",
    grammar_practice: "语法练习",
    listening_comprehension: "听力理解",
    listening_dictation: "听写练习",
    speaking_repetition: "口语跟读",
    speaking_conversation: "对话练习",
    reading_comprehension: "阅读理解",
    writing_practice: "写作练习",
    review: "复习",
    assessment: "测试",
  };
  return titles[type] || "学习活动";
};

// ============================================================
// Lesson Viewer Component
// ============================================================

export default function LessonViewer() {
  const navigate = useNavigate();
  const { lessonId } = useParams();
  const [searchParams] = useSearchParams();
  
  // Determine which day to load (default to day 1)
  const dayNumber = lessonId ? parseInt(lessonId.replace("day_", ""), 10) : 1;
  const lesson = getLessonByDay(dayNumber) || getLessonByDay(1);

  // Read activity index from query param (?activity=N)
  const initialActivity = parseInt(searchParams.get("activity") || "0", 10);

  const [progress, setProgress] = useState<LessonProgress>({
    currentActivity: Math.min(initialActivity, (lesson?.activities.length || 1) - 1),
    totalActivities: lesson?.activities.length || 0,
    timeSpent: 0,
    startTime: Date.now(),
    activitiesCompleted: [],
  });

  const [activityState, setActivityState] = useState<Record<string, unknown>>({});

  // Engines
  const [audioEngine] = useState(() => new AudioEngine());
  const [listeningEngine] = useState(() => new ListeningEngine());
  const [speakingEngine] = useState(() => new SpeakingEngine());

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => ({
        ...prev,
        timeSpent: Math.floor((Date.now() - prev.startTime) / 1000),
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, [progress.startTime]);

  // ============================================================
  // Navigation
  // ============================================================

  const handleNextActivity = useCallback(() => {
    if (!lesson) return;
    
    const currentAct = lesson.activities[progress.currentActivity];
    if (currentAct) {
      setProgress((prev) => ({
        ...prev,
        currentActivity: Math.min(prev.currentActivity + 1, prev.totalActivities - 1),
        activitiesCompleted: [...prev.activitiesCompleted, currentAct.id],
      }));
      setActivityState({});
    }
  }, [progress.currentActivity, lesson]);

  const handlePrevActivity = () => {
    setProgress((prev) => ({
      ...prev,
      currentActivity: Math.max(prev.currentActivity - 1, 0),
    }));
    setActivityState({});
  };

  // ============================================================
  // Format Time
  // ============================================================

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // ============================================================
  // Render Activity Content
  // ============================================================

  const renderActivity = (activity: LessonActivity) => {
    switch (activity.type) {
      case "phonics":
        return renderPhonics(activity);
      case "vocabulary_introduction":
      case "vocabulary_recognition":
      case "vocabulary_recall":
        return renderVocabulary(activity);
      case "grammar_explanation":
      case "grammar_practice":
        return renderGrammar(activity);
      case "listening_comprehension":
      case "listening_dictation":
        return renderListening(activity);
      case "speaking_repetition":
      case "speaking_conversation":
        return renderSpeaking(activity);
      case "review":
        return renderReview(activity);
      default:
        return renderGeneric(activity);
    }
  };

  const renderPhonics = (activity: LessonActivity) => {
    const phonics = activity.content.phonics || [];
    return (
      <div className="space-y-4">
        <p className="text-gray-600 mb-4">{activity.descriptionChinese}</p>
        {phonics.map((p, idx) => (
          <div key={idx} className="flex items-center gap-4 rounded-lg bg-gray-50 p-4">
            <div className="text-4xl font-bold text-primary-600">{p.letter}</div>
            <div className="flex-1">
              <div className="font-medium text-lg">{p.sound}</div>
              <div className="text-sm text-gray-500">{p.soundDescription}</div>
              <div className="mt-2 flex gap-2">
                {p.examples.map((ex, i) => (
                  <span key={i} className="text-sm bg-white px-2 py-1 rounded">
                    {ex.word} ({ex.chinese})
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={() => audioEngine.playWord(p.letter)}
              className="text-2xl"
            >
              🔊
            </button>
          </div>
        ))}
      </div>
    );
  };

  const renderVocabulary = (activity: LessonActivity) => {
    const words = activity.content.words || [];
    const currentIndex = (activityState.currentIndex as number) || 0;
    const showMeaning = (activityState.showMeaning as boolean) || false;
    const currentWord = words[currentIndex];

    if (!currentWord) return <p>没有词汇数据</p>;

    return (
      <div className="space-y-4">
        <p className="text-gray-600">{activity.descriptionChinese}</p>
        
        {/* Progress */}
        <div className="text-center text-sm text-gray-500">
          单词 {currentIndex + 1} / {words.length}
        </div>

        {/* Word Card */}
        <div className="rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 p-6 text-center">
          <div className="text-4xl font-bold text-primary-700 mb-2">
            {currentWord.word}
          </div>
          <div className="text-lg text-primary-500 mb-1">{currentWord.ipa}</div>
          
          {!showMeaning ? (
            <button
              onClick={() => setActivityState({ ...activityState, showMeaning: true })}
              className="mt-4 rounded-lg border-2 border-primary-500 px-6 py-2 text-primary-600"
            >
              显示中文意思
            </button>
          ) : (
            <div className="mt-4 space-y-3">
              <div className="text-2xl font-bold text-primary-600">
                {currentWord.chineseMeaning}
              </div>
              {currentWord.example && (
                <div className="text-sm text-gray-600">
                  <div>📝 {currentWord.example}</div>
                  <div className="text-gray-400">{currentWord.exampleChinese}</div>
                </div>
              )}
              {currentWord.memoryHint && (
                <div className="rounded-lg bg-amber-50 p-2 text-sm text-amber-700">
                  💡 {currentWord.memoryHint}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Audio */}
        <button
          onClick={() => audioEngine.playWord(currentWord.word)}
          className="w-full rounded-lg bg-gray-100 py-3 text-gray-700"
        >
          🔊 播放发音
        </button>

        {/* Navigation */}
        {showMeaning && (
          <div className="flex gap-3">
            <button
              onClick={() => {
                if (currentIndex < words.length - 1) {
                  setActivityState({ currentIndex: currentIndex + 1, showMeaning: false });
                } else {
                  handleNextActivity();
                }
              }}
              className="flex-1 rounded-lg bg-green-500 py-3 text-white"
            >
              {currentIndex < words.length - 1 ? "下一个" : "完成"}
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderGrammar = (activity: LessonActivity) => {
    const grammar = activity.content.grammarPoint;
    if (!grammar) return <p>没有语法数据</p>;

    return (
      <div className="space-y-4">
        <p className="text-gray-600">{activity.descriptionChinese}</p>
        
        <div className="rounded-lg bg-blue-50 p-4">
          <h3 className="font-bold text-blue-800 mb-2">语法规则</h3>
          <p className="text-blue-700">{grammar.rule}</p>
          <p className="text-sm text-blue-600 mt-1">{grammar.ruleChinese}</p>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">例句：</h4>
          {grammar.examples.map((ex, idx) => (
            <div key={idx} className="rounded-lg bg-gray-50 p-3">
              <div className="font-medium">{ex.correct}</div>
              <div className="text-sm text-gray-500">{ex.chinese}</div>
              {ex.incorrect && (
                <div className="text-sm text-red-500 mt-1">
                  ❌ {ex.incorrect}
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={handleNextActivity}
          className="w-full rounded-lg bg-primary-500 py-3 text-white"
        >
          继续
        </button>
      </div>
    );
  };

  const renderListening = (activity: LessonActivity) => {
    const audio = activity.content.audio;
    if (!audio) return <p>没有听力数据</p>;

    return (
      <div className="space-y-4">
        <p className="text-gray-600">{activity.descriptionChinese}</p>
        
        <div className="rounded-lg bg-gray-50 p-4 text-center">
          <div className="text-4xl mb-4">🎧</div>
          <p className="text-gray-600">{activity.descriptionChinese}</p>
        </div>

        <button
          onClick={() => listeningEngine.playText(audio.text, audio.speed)}
          className="w-full rounded-lg bg-primary-500 py-4 text-white text-lg"
        >
          🔊 播放音频
        </button>

        <div className="rounded-lg bg-amber-50 p-3">
          <div className="text-sm text-amber-800 mb-1">速度：{audio.speed === "slow" ? "慢速" : audio.speed === "fast" ? "快速" : "正常"}</div>
        </div>

        <button
          onClick={handleNextActivity}
          className="w-full rounded-lg bg-primary-500 py-3 text-white"
        >
          继续
        </button>
      </div>
    );
  };

  const renderSpeaking = (activity: LessonActivity) => {
    const audio = activity.content.audio;
    const isRecording = (activityState.isRecording as boolean) || false;
    const userSpeech = (activityState.userSpeech as string) || "";

    return (
      <div className="space-y-4">
        <p className="text-gray-600">{activity.descriptionChinese}</p>
        
        {audio && (
          <div className="rounded-lg bg-gray-50 p-4 text-center">
            <div className="text-lg font-medium mb-2">{audio.text}</div>
            <div className="text-sm text-gray-500">{audio.chineseText}</div>
          </div>
        )}

        <button
          onClick={() => {
            if (!speakingEngine.isSupported()) {
              alert("浏览器不支持语音识别");
              return;
            }
            if (isRecording) {
              speakingEngine.stopRecording();
              setActivityState({ ...activityState, isRecording: false });
            } else {
              setActivityState({ ...activityState, isRecording: true, userSpeech: "" });
              speakingEngine.startRecording(
                (result) => {
                  setActivityState({ isRecording: false, userSpeech: result });
                },
                (error) => {
                  console.error("Recording error:", error);
                  setActivityState({ isRecording: false });
                },
              );
            }
          }}
          className={`w-full rounded-lg py-4 text-lg ${
            isRecording
              ? "bg-red-500 text-white animate-pulse"
              : "bg-primary-500 text-white"
          }`}
        >
          {isRecording ? "⏹ 停止录音" : "🎤 开始录音"}
        </button>

        {userSpeech && (
          <div className="rounded-lg bg-green-50 p-3">
            <div className="text-sm text-gray-500 mb-1">你说的是：</div>
            <div className="font-medium">{userSpeech}</div>
          </div>
        )}

        <button
          onClick={handleNextActivity}
          className="w-full rounded-lg bg-primary-500 py-3 text-white"
        >
          继续
        </button>
      </div>
    );
  };

  const renderReview = (activity: LessonActivity) => {
    const items = activity.content.reviewItems || [];
    return (
      <div className="space-y-4">
        <div className="text-center mb-4">
          <div className="text-5xl mb-4">🔄</div>
          <h3 className="text-xl font-bold">今日复习</h3>
          <p className="text-gray-500">{activity.descriptionChinese}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {items.map((item, idx) => (
            <div key={idx} className="rounded-lg bg-gray-50 p-3 text-center">
              <div className="font-medium">{item.word}</div>
              <div className="text-sm text-gray-500">{item.chineseMeaning}</div>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate("/review")}
          className="w-full rounded-lg bg-primary-500 py-3 text-white"
        >
          开始复习测试
        </button>
      </div>
    );
  };

  const renderGeneric = (activity: LessonActivity) => {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <div className="text-5xl mb-4">{getActivityIcon(activity.type)}</div>
          <h3 className="text-xl font-bold mb-2">{activity.titleChinese}</h3>
          <p className="text-gray-600">{activity.descriptionChinese}</p>
        </div>
        
        <button
          onClick={handleNextActivity}
          className="w-full rounded-lg bg-primary-500 py-3 text-white"
        >
          继续
        </button>
      </div>
    );
  };

  // ============================================================
  // Main Render
  // ============================================================

  if (!lesson) {
    return (
      <div className="page-container">
        <div className="text-center py-12">
          <div className="text-5xl mb-4">📚</div>
          <h1 className="text-2xl font-bold text-primary-800 mb-2">
            课程加载中
          </h1>
          <p className="text-gray-600 mb-6">
            正在准备 Day {dayNumber} 的课程...
          </p>
          <button
            onClick={() => navigate("/")}
            className="rounded-lg bg-primary-500 px-6 py-3 text-white"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  const currentActivity = lesson.activities[progress.currentActivity];
  const isCompleted = progress.activitiesCompleted.length === progress.totalActivities;

  if (isCompleted) {
    return (
      <div className="page-container">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold text-primary-800 mb-2">
            恭喜完成 Day {dayNumber}！
          </h1>
          <p className="text-gray-600 mb-6">
            你完成了今天的学习！用时 {formatTime(progress.timeSpent)}
          </p>
          <div className="card mb-6">
            <h2 className="text-lg font-semibold mb-4">学习成果</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {progress.activitiesCompleted.length}
                </div>
                <div className="text-sm text-gray-500">完成活动</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {formatTime(progress.timeSpent)}
                </div>
                <div className="text-sm text-gray-500">学习时间</div>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => navigate("/review")}
              className="w-full rounded-lg bg-primary-500 px-6 py-3 text-white"
            >
              开始复习
            </button>
            <button
              onClick={() => navigate("/progress")}
              className="w-full rounded-lg bg-gray-100 px-6 py-3 text-gray-700"
            >
              查看进度
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Day {dayNumber}</h1>
          <span className="text-sm text-gray-500">
            {formatTime(progress.timeSpent)}
          </span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full bg-primary-500 transition-all"
            style={{
              width: `${((progress.currentActivity + 1) / progress.totalActivities) * 100}%`,
            }}
          />
        </div>
        <div className="mt-1 flex justify-between text-xs text-gray-500">
          <span>{getActivityTitle(currentActivity?.type)}</span>
          <span>
            {progress.currentActivity + 1} / {progress.totalActivities}
          </span>
        </div>
      </div>

      {/* Activity Content */}
      <div className="card mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">{getActivityIcon(currentActivity?.type)}</span>
          <h2 className="text-lg font-semibold">{currentActivity?.titleChinese}</h2>
        </div>
        
        {currentActivity && renderActivity(currentActivity)}
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        {progress.currentActivity > 0 && (
          <button
            onClick={handlePrevActivity}
            className="flex-1 rounded-lg border border-gray-300 py-3 text-gray-700"
          >
            上一步
          </button>
        )}
        <button
          onClick={handleNextActivity}
          className="flex-1 rounded-lg bg-primary-500 py-3 text-white"
        >
          {progress.currentActivity === progress.totalActivities - 1 ? "完成" : "下一步"}
        </button>
      </div>
    </div>
  );
}
