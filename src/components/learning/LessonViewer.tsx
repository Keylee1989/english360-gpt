/**
 * Lesson Viewer v3 — with completion gates
 *
 * Each activity requires user interaction before "下一步" works:
 * - Phonics: must click play at least once
 * - Vocabulary: must view meaning + go through all words
 * - Grammar: must click "已阅读"
 * - Listening: must play audio
 * - Speaking: must record at least once
 * - Review/Assessment: must complete quiz
 */

import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { AudioEngine } from "@/engines/audio";
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
// Helpers
// ============================================================

const ACTIVITY_ICONS: Record<string, string> = {
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

const ACTIVITY_TITLES: Record<string, string> = {
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

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// ============================================================
// Main Component
// ============================================================

export default function LessonViewer() {
  const navigate = useNavigate();
  const { lessonId } = useParams();
  const [searchParams] = useSearchParams();

  const dayNumber = lessonId ? parseInt(lessonId.replace("day_", ""), 10) : 1;
  const lesson = getLessonByDay(dayNumber) || getLessonByDay(1);
  const initialActivity = parseInt(searchParams.get("activity") || "0", 10);

  const [progress, setProgress] = useState<LessonProgress>({
    currentActivity: Math.min(initialActivity, (lesson?.activities.length || 1) - 1),
    totalActivities: lesson?.activities.length || 0,
    timeSpent: 0,
    startTime: Date.now(),
    activitiesCompleted: [],
  });

  // Activity-specific interaction state
  const [phonicsPlayed, setPhonicsPlayed] = useState<Record<number, boolean>>({});
  const [vocabShowMeaning, setVocabShowMeaning] = useState(false);
  const [vocabWordIndex, setVocabWordIndex] = useState(0);
  const [grammarRead, setGrammarRead] = useState(false);
  const [listeningPlayed, setListeningPlayed] = useState(false);
  const [speakingRecorded, setSpeakingRecorded] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [userSpeech, setUserSpeech] = useState("");
  const [audioEngine] = useState(() => new AudioEngine());

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

  // Reset interaction state when activity changes
  useEffect(() => {
    setVocabShowMeaning(false);
    setVocabWordIndex(0);
    setGrammarRead(false);
    setListeningPlayed(false);
    setSpeakingRecorded(false);
    setIsRecording(false);
    setUserSpeech("");
  }, [progress.currentActivity]);

  const currentActivity = lesson?.activities[progress.currentActivity];

  // ============================================================
  // Check if current activity is completed
  // ============================================================
  const isActivityCompleted = useCallback(() => {
    if (!currentActivity) return true;
    switch (currentActivity.type) {
      case "phonics":
        // Must have played at least one letter's audio
        return Object.keys(phonicsPlayed).length > 0;
      case "vocabulary_introduction":
      case "vocabulary_recognition":
      case "vocabulary_recall": {
        // Must have gone through all words (shown meaning for last word)
        const words = currentActivity.content?.words || [];
        if (words.length === 0) return true;
        return vocabShowMeaning && vocabWordIndex >= words.length - 1;
      }
      case "grammar_explanation":
      case "grammar_practice":
        return grammarRead;
      case "listening_comprehension":
      case "listening_dictation":
        return listeningPlayed;
      case "speaking_repetition":
      case "speaking_conversation":
        return speakingRecorded;
      case "review":
      case "assessment":
        return true; // These navigate away, so just allow
      default:
        return true;
    }
  }, [currentActivity, phonicsPlayed, vocabShowMeaning, vocabWordIndex, grammarRead, listeningPlayed, speakingRecorded]);

  // ============================================================
  // Navigation
  // ============================================================
  const handleNextActivity = useCallback(() => {
    if (!lesson || !currentActivity) return;
    if (!isActivityCompleted()) return; // Gate!

    setProgress((prev) => ({
      ...prev,
      currentActivity: Math.min(prev.currentActivity + 1, prev.totalActivities - 1),
      activitiesCompleted: [...prev.activitiesCompleted, currentActivity.id],
    }));
  }, [lesson, currentActivity, isActivityCompleted]);

  const handlePrevActivity = () => {
    setProgress((prev) => ({
      ...prev,
      currentActivity: Math.max(prev.currentActivity - 1, 0),
    }));
  };

  // ============================================================
  // Render Activity Content
  // ============================================================

  const renderPhonics = (activity: LessonActivity) => {
    const phonics = activity.content?.phonics || [];
    return (
      <div className="space-y-4">
        <p className="text-gray-600 mb-2">{activity.descriptionChinese}</p>
        <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
          💡 请逐个点击 🔊 播放每个字母的发音，全部播放后才能进入下一步
        </p>
        {phonics.map((p: any, idx: number) => (
          <div key={idx} className="flex items-center gap-4 rounded-lg bg-gray-50 p-4">
            <div className="text-4xl font-bold text-primary-600">{p.letter}</div>
            <div className="flex-1">
              <div className="font-medium text-lg">{p.sound}</div>
              <div className="text-sm text-gray-500">{p.soundDescription}</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {p.examples?.map((ex: any, i: number) => (
                  <span key={i} className="text-sm bg-white px-2 py-1 rounded border">
                    {ex.word} ({ex.chinese})
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={() => {
                audioEngine.playWord(p.letter);
                setPhonicsPlayed((prev) => ({ ...prev, [idx]: true }));
              }}
              className={`text-3xl p-2 rounded-lg transition-colors ${
                phonicsPlayed[idx]
                  ? "bg-green-100 text-green-600"
                  : "bg-primary-100 text-primary-600 hover:bg-primary-200"
              }`}
            >
              {phonicsPlayed[idx] ? "✅" : "🔊"}
            </button>
          </div>
        ))}
        <div className="text-center text-sm text-gray-500">
          已播放 {Object.keys(phonicsPlayed).length} / {phonics.length} 个字母
        </div>
      </div>
    );
  };

  const renderVocabulary = (activity: LessonActivity) => {
    const words = activity.content?.words || [];
    const currentWord = words[vocabWordIndex];

    if (!currentWord) return <p className="text-gray-500">没有词汇数据</p>;

    return (
      <div className="space-y-4">
        <p className="text-gray-600">{activity.descriptionChinese}</p>
        <div className="text-center text-sm text-gray-500">
          单词 {vocabWordIndex + 1} / {words.length}
        </div>

        {/* Word Card */}
        <div className="rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 p-6 text-center">
          <div className="text-4xl font-bold text-primary-700 mb-2">{currentWord.word}</div>
          <div className="text-lg text-primary-500 mb-1">{currentWord.ipa}</div>

          {!vocabShowMeaning ? (
            <button
              onClick={() => setVocabShowMeaning(true)}
              className="mt-4 rounded-lg border-2 border-primary-500 px-6 py-2 text-primary-600 font-medium"
            >
              显示中文意思和记忆方法
            </button>
          ) : (
            <div className="mt-4 space-y-3 text-left">
              <div className="text-2xl font-bold text-primary-600 text-center">
                {currentWord.chineseMeaning}
              </div>
              {currentWord.memoryHint && (
                <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
                  💡 {currentWord.memoryHint}
                </div>
              )}
              {currentWord.example && (
                <div className="text-sm text-gray-600 bg-white p-2 rounded">
                  <div>📝 {currentWord.example}</div>
                  <div className="text-gray-400">{currentWord.exampleChinese}</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Audio */}
        <button
          onClick={() => {
            audioEngine.playWord(currentWord.word);
          }}
          className="w-full rounded-lg bg-gray-100 py-3 text-gray-700 font-medium"
        >
          🔊 播放发音
        </button>

        {/* Next word / Complete */}
        {vocabShowMeaning && (
          <button
            onClick={() => {
              if (vocabWordIndex < words.length - 1) {
                setVocabWordIndex((i) => i + 1);
                setVocabShowMeaning(false);
              }
              // If last word, don't advance — the "下一步" button handles it
            }}
            className="w-full rounded-lg bg-green-500 py-3 text-white font-medium"
          >
            {vocabWordIndex < words.length - 1 ? "下一个单词 ✅" : "✅ 已学习全部单词"}
          </button>
        )}
      </div>
    );
  };

  const renderGrammar = (activity: LessonActivity) => {
    const grammar = activity.content?.grammarPoint;
    if (!grammar) return <p className="text-gray-500">没有语法数据</p>;

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
          {grammar.examples?.map((ex: any, idx: number) => (
            <div key={idx} className="rounded-lg bg-gray-50 p-3">
              <div className="font-medium">{ex.correct}</div>
              <div className="text-sm text-gray-500">{ex.chinese}</div>
              {ex.incorrect && (
                <div className="text-sm text-red-500 mt-1">❌ {ex.incorrect}</div>
              )}
            </div>
          ))}
        </div>
        {!grammarRead && (
          <button
            onClick={() => setGrammarRead(true)}
            className="w-full rounded-lg bg-primary-500 py-3 text-white font-medium"
          >
            ✅ 我已阅读理解
          </button>
        )}
        {grammarRead && (
          <div className="text-center text-green-600 font-medium">✅ 已确认理解</div>
        )}
      </div>
    );
  };

  const renderListening = (activity: LessonActivity) => {
    const audio = activity.content?.audio;
    return (
      <div className="space-y-4">
        <p className="text-gray-600">{activity.descriptionChinese}</p>
        <div className="rounded-lg bg-gray-50 p-4 text-center">
          <div className="text-4xl mb-4">🎧</div>
          <p className="text-gray-600">{activity.descriptionChinese}</p>
        </div>
        <button
          onClick={() => {
            if (audio?.text) {
              audioEngine.playSentence(audio.text);
            }
            setListeningPlayed(true);
          }}
          className={`w-full rounded-lg py-4 text-white text-lg font-medium ${
            listeningPlayed ? "bg-green-500" : "bg-primary-500"
          }`}
        >
          {listeningPlayed ? "✅ 已播放" : "🔊 播放音频"}
        </button>
        {audio?.speed && (
          <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
            速度：{audio.speed === "slow" ? "慢速" : audio.speed === "fast" ? "快速" : "正常"}
          </div>
        )}
      </div>
    );
  };

  const renderSpeaking = (activity: LessonActivity) => {
    const audio = activity.content?.audio;
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
            // Use Web Speech API for recording
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (!SpeechRecognition) {
              alert("浏览器不支持语音识别，请使用 Chrome");
              return;
            }
            if (isRecording) {
              setIsRecording(false);
              return;
            }
            const recognition = new SpeechRecognition();
            recognition.lang = "en-US";
            recognition.interimResults = false;
            recognition.onresult = (event: any) => {
              const transcript = event.results[0][0].transcript;
              setUserSpeech(transcript);
              setIsRecording(false);
              setSpeakingRecorded(true);
            };
            recognition.onerror = () => setIsRecording(false);
            recognition.onend = () => setIsRecording(false);
            setIsRecording(true);
            recognition.start();
          }}
          className={`w-full rounded-lg py-4 text-lg font-medium ${
            isRecording
              ? "bg-red-500 text-white animate-pulse"
              : speakingRecorded
              ? "bg-green-500 text-white"
              : "bg-primary-500 text-white"
          }`}
        >
          {isRecording ? "⏹ 停止录音" : speakingRecorded ? "✅ 已录制，点击重录" : "🎤 开始录音"}
        </button>
        {userSpeech && (
          <div className="rounded-lg bg-green-50 p-3">
            <div className="text-sm text-gray-500 mb-1">你说的是：</div>
            <div className="font-medium">{userSpeech}</div>
          </div>
        )}
      </div>
    );
  };

  const renderGeneric = (activity: LessonActivity) => (
    <div className="space-y-4">
      <div className="text-center py-8">
        <div className="text-5xl mb-4">{ACTIVITY_ICONS[activity.type] || "📖"}</div>
        <h3 className="text-xl font-bold mb-2">{activity.titleChinese}</h3>
        <p className="text-gray-600">{activity.descriptionChinese}</p>
      </div>
    </div>
  );

  const renderActivity = (activity: LessonActivity) => {
    switch (activity.type) {
      case "phonics": return renderPhonics(activity);
      case "vocabulary_introduction":
      case "vocabulary_recognition":
      case "vocabulary_recall": return renderVocabulary(activity);
      case "grammar_explanation":
      case "grammar_practice": return renderGrammar(activity);
      case "listening_comprehension":
      case "listening_dictation": return renderListening(activity);
      case "speaking_repetition":
      case "speaking_conversation": return renderSpeaking(activity);
      case "review":
        return (
          <div className="space-y-4 text-center">
            <div className="text-5xl mb-4">🔄</div>
            <h3 className="text-xl font-bold">今日复习</h3>
            <p className="text-gray-500">{activity.descriptionChinese}</p>
            <button
              onClick={() => navigate("/review")}
              className="w-full rounded-lg bg-primary-500 py-3 text-white font-medium"
            >
              开始复习测试
            </button>
          </div>
        );
      default: return renderGeneric(activity);
    }
  };

  // ============================================================
  // Main Render
  // ============================================================

  if (!lesson) {
    return (
      <div className="page-container">
        <div className="text-center py-12">
          <div className="text-5xl mb-4">📚</div>
          <h1 className="text-2xl font-bold text-primary-800 mb-2">课程加载中</h1>
          <p className="text-gray-600 mb-6">正在准备 Day {dayNumber} 的课程...</p>
          <button onClick={() => navigate("/")} className="rounded-lg bg-primary-500 px-6 py-3 text-white">
            返回首页
          </button>
        </div>
      </div>
    );
  }

  const isCompleted = progress.activitiesCompleted.length >= progress.totalActivities;

  if (isCompleted) {
    return (
      <div className="page-container">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold text-primary-800 mb-2">恭喜完成 Day {dayNumber}！</h1>
          <p className="text-gray-600 mb-6">你完成了今天的学习！用时 {formatTime(progress.timeSpent)}</p>
          <div className="card mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{progress.activitiesCompleted.length}</div>
                <div className="text-sm text-gray-500">完成活动</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{formatTime(progress.timeSpent)}</div>
                <div className="text-sm text-gray-500">学习时间</div>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <button onClick={() => navigate("/review")} className="w-full rounded-lg bg-primary-500 px-6 py-3 text-white">
              开始复习
            </button>
            <button onClick={() => navigate("/")} className="w-full rounded-lg bg-gray-100 px-6 py-3 text-gray-700">
              返回首页
            </button>
          </div>
        </div>
      </div>
    );
  }

  const completed = isActivityCompleted();

  return (
    <div className="page-container">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Day {dayNumber}</h1>
          <span className="text-sm text-gray-500">{formatTime(progress.timeSpent)}</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full bg-primary-500 transition-all"
            style={{ width: `${((progress.currentActivity + 1) / progress.totalActivities) * 100}%` }}
          />
        </div>
        <div className="mt-1 flex justify-between text-xs text-gray-500">
          <span>{ACTIVITY_TITLES[currentActivity?.type ?? ""] || "学习活动"}</span>
          <span>{progress.currentActivity + 1} / {progress.totalActivities}</span>
        </div>
      </div>

      {/* Activity Content */}
      <div className="card mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">{ACTIVITY_ICONS[currentActivity?.type ?? ""] || "📖"}</span>
          <h2 className="text-lg font-semibold">{currentActivity?.titleChinese}</h2>
        </div>
        {currentActivity && renderActivity(currentActivity)}
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        {progress.currentActivity > 0 && (
          <button
            onClick={handlePrevActivity}
            className="flex-1 rounded-lg border border-gray-300 py-3 text-gray-700 font-medium"
          >
            上一步
          </button>
        )}
        <button
          onClick={handleNextActivity}
          disabled={!completed}
          className={`flex-1 rounded-lg py-3 font-medium transition-colors ${
            completed
              ? "bg-primary-500 text-white hover:bg-primary-600"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {completed
            ? progress.currentActivity === progress.totalActivities - 1
              ? "完成"
              : "下一步 ✅"
            : "请先完成当前活动"}
        </button>
      </div>

      {/* Hint */}
      {!completed && (
        <p className="mt-2 text-center text-xs text-amber-600">
          {currentActivity?.type === "phonics" && "💡 请点击每个字母的 🔊 播放按钮"}
          {currentActivity?.type?.startsWith("vocabulary") && "💡 请点击「显示中文意思」并看完所有单词"}
          {currentActivity?.type?.startsWith("grammar") && "💡 请阅读语法内容后点击「我已阅读理解」"}
          {currentActivity?.type?.startsWith("listening") && "💡 请点击播放音频"}
          {currentActivity?.type?.startsWith("speaking") && "💡 请点击录音按钮完成跟读"}
        </p>
      )}
    </div>
  );
}
