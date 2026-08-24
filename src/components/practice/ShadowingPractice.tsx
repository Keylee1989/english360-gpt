/**
 * Shadowing Practice Component (v2)
 *
 * Features:
 * - Play audio (TTS)
 * - Record voice (Web Speech API)
 * - Compare with model sentence
 * - Show score and mistakes
 * - Progress tracking
 */

import { useState, useCallback, useRef } from "react";
import { SpeakingEngine } from "@/engines/speaking";
import type {
  ShadowingExercise,
  ShadowingResult,
  ShadowingMode,
} from "@/engines/shadowing/v1";

interface ShadowingPracticeProps {
  exercise: ShadowingExercise;
  onComplete: (result: ShadowingResult) => void;
  onSkip?: () => void;
}

export function ShadowingPractice({
  exercise,
  onComplete,
  onSkip,
}: ShadowingPracticeProps) {
  const [mode, setMode] = useState<ShadowingMode>("listen_repeat");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [result, setResult] = useState<ShadowingResult | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);
  const [userSpeech, setUserSpeech] = useState("");
  const [accuracy, setAccuracy] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const engineRef = useRef<SpeakingEngine | null>(null);

  // Get or create engine
  const getEngine = useCallback(() => {
    if (!engineRef.current) {
      engineRef.current = new SpeakingEngine();
    }
    return engineRef.current;
  }, []);

  /**
   * Handle play audio (TTS)
   */
  const handlePlayAudio = useCallback(() => {
    if ("speechSynthesis" in window) {
      setIsPlaying(true);
      const utterance = new SpeechSynthesisUtterance(exercise.text);
      utterance.lang = "en-US";
      utterance.rate = mode === "listen_repeat" ? 0.8 : 1;
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
    }
  }, [exercise.text, mode]);

  /**
   * Calculate similarity between two strings
   */
  const calculateSimilarity = useCallback((a: string, b: string): number => {
    const normalize = (s: string) => s.toLowerCase().replace(/[^a-z\s]/g, "").trim();
    const na = normalize(a);
    const nb = normalize(b);

    if (na === nb) return 1;
    if (!na || !nb) return 0;

    // Simple word-level comparison
    const wordsA = na.split(/\s+/);
    const wordsB = nb.split(/\s+/);
    let matches = 0;

    for (const word of wordsA) {
      if (wordsB.includes(word)) matches++;
    }

    return matches / Math.max(wordsA.length, wordsB.length);
  }, []);

  /**
   * Handle start recording
   */
  const handleStartRecording = useCallback(() => {
    const engine = getEngine();

    if (!engine.isSupported()) {
      alert("你的浏览器不支持语音识别。请使用Chrome或Safari浏览器。");
      return;
    }

    setIsRecording(true);
    setUserSpeech("");

    engine.startRecording(
      (result: string) => {
        // Got recognition result
        setUserSpeech(result);
        setIsRecording(false);

        // Calculate accuracy
        const sim = calculateSimilarity(result, exercise.text);
        setAccuracy(sim);
        setShowResult(true);
        setAttemptCount((c) => c + 1);

        // Build result object
        const shadowResult: ShadowingResult = {
          attemptId: `attempt_${Date.now()}`,
          exerciseId: exercise.id,
          mode: exercise.mode,
          audioDurationMs: exercise.audioDurationMs,
          userDurationMs: 0,
          timingDifferenceMs: 0,
          accuracy: sim,
          timing: 0.8,
          fluency: sim * 0.9,
          overall: sim,
          mistakes: sim < 0.7
            ? [{ type: "pronunciation" as const, position: 0, expected: exercise.text, detected: result, severity: "moderate" as const }]
            : [],
          suggestions: sim < 0.5
            ? ["再听一遍音频，然后慢慢跟读"]
            : sim < 0.8
            ? ["不错！注意个别单词的发音"]
            : ["很好！发音很准确！"],
          feedback: {
            overall: sim >= 0.8
              ? "非常好！你的发音很接近标准。"
              : sim >= 0.5
              ? "不错！还有一些需要改进的地方。"
              : "继续加油！多听几遍音频再试。",
            strengths: sim >= 0.6 ? ["整体发音清晰"] : [],
            weaknesses: sim < 0.6 ? ["发音需要更多练习"] : [],
            nextSteps: sim < 0.5
              ? ["多听几遍标准音频", "放慢速度跟读"]
              : ["尝试加快速度", "注意连读"],
          },
        };

        setResult(shadowResult);
      },
      (error: string) => {
        console.error("Recording error:", error);
        setIsRecording(false);
        if (error === "not-allowed") {
          alert("请允许麦克风权限后重试。");
        }
      },
    );
  }, [getEngine, exercise, calculateSimilarity]);

  /**
   * Handle stop recording
   */
  const handleStopRecording = useCallback(() => {
    const engine = getEngine();
    engine.stopRecording();
    setIsRecording(false);
  }, [getEngine]);

  /**
   * Handle try again
   */
  const handleTryAgain = useCallback(() => {
    setResult(null);
    setShowResult(false);
    setUserSpeech("");
    setAccuracy(0);
  }, []);

  /**
   * Handle complete
   */
  const handleComplete = useCallback(() => {
    if (result) {
      onComplete(result);
    }
  }, [result, onComplete]);

  return (
    <div className="shadowing-practice">
      {/* Header */}
      <div className="exercise-header mb-4">
        <h3 className="text-lg font-semibold mb-1">{exercise.text}</h3>
        <p className="text-gray-600 text-sm">{exercise.translationChinese}</p>
      </div>

      {/* Mode Selector */}
      <div className="mode-selector mb-4">
        <label className="block text-sm font-medium mb-2">练习模式:</label>
        <div className="flex flex-wrap gap-2">
          {([
            { key: "listen_only", label: "只听" },
            { key: "listen_repeat", label: "听后重复" },
            { key: "shadow_simultaneous", label: "同步跟读" },
            { key: "free_repeat", label: "自由重复" },
          ] as const).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setMode(key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                mode === key
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Audio Controls */}
      <div className="controls mb-4 flex flex-wrap gap-3">
        <button
          onClick={handlePlayAudio}
          disabled={isPlaying}
          className="px-5 py-2.5 bg-green-500 text-white rounded-lg font-medium disabled:bg-gray-300 flex items-center gap-2"
        >
          {isPlaying ? "🔊 播放中..." : "🔊 播放音频"}
        </button>

        {!showResult && (
          <button
            onClick={isRecording ? handleStopRecording : handleStartRecording}
            disabled={!getEngine().isSupported()}
            className={`px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 ${
              isRecording
                ? "bg-red-500 text-white animate-pulse"
                : "bg-blue-500 text-white disabled:bg-gray-300"
            }`}
          >
            {isRecording ? "⏹ 停止录音" : "🎤 开始录音"}
          </button>
        )}
      </div>

      {/* Browser support warning */}
      {!getEngine().isSupported() && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 text-sm text-amber-800">
          ⚠️ 你的浏览器不支持语音识别。请使用 Chrome 或 Edge 浏览器。
        </div>
      )}

      {/* User's speech */}
      {userSpeech && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="text-sm text-gray-500 mb-1">你说的是：</div>
          <div className="text-lg font-medium text-blue-800">{userSpeech}</div>
        </div>
      )}

      {/* Accuracy Score */}
      {showResult && (
        <div className="accuracy-display bg-gray-50 p-4 rounded-lg mb-4 text-center">
          <div className="text-4xl font-bold mb-1" style={{
            color: accuracy >= 0.8 ? "#16a34a" : accuracy >= 0.5 ? "#d97706" : "#dc2626"
          }}>
            {Math.round(accuracy * 100)}%
          </div>
          <div className="text-sm text-gray-500">准确率</div>
          <div className="mt-2 text-sm">
            {accuracy >= 0.8
              ? "🎉 非常好！发音很标准！"
              : accuracy >= 0.5
              ? "💪 不错！继续练习会更好！"
              : "🔄 再听一遍音频，慢慢跟读。"}
          </div>
        </div>
      )}

      {/* Result Panel */}
      {result && (
        <div className="result-panel bg-white border rounded-lg p-4 mb-4">
          <h4 className="font-semibold mb-3">详细分析:</h4>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center">
              <div className="text-xl font-bold text-blue-500">
                {Math.round(result.accuracy * 100)}%
              </div>
              <div className="text-xs text-gray-600">准确率</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-500">
                {Math.round(result.timing * 100)}%
              </div>
              <div className="text-xs text-gray-600">节奏</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-purple-500">
                {Math.round(result.fluency * 100)}%
              </div>
              <div className="text-xs text-gray-600">流利度</div>
            </div>
          </div>

          {/* Suggestions */}
          {result.suggestions.length > 0 && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-blue-800 mb-1">💡 建议：</p>
              <ul className="text-sm text-blue-700 space-y-1">
                {result.suggestions.map((s, i) => (
                  <li key={i}>• {s}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Target comparison */}
      {showResult && userSpeech && (
        <div className="comparison bg-gray-50 p-3 rounded-lg mb-4">
          <div className="text-xs text-gray-500 mb-1">标准发音：</div>
          <div className="font-medium">{exercise.text}</div>
          <div className="text-xs text-gray-500 mt-2 mb-1">你说的：</div>
          <div className="font-medium">{userSpeech}</div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="action-buttons flex gap-3">
        {showResult ? (
          <>
            <button
              onClick={handleTryAgain}
              className="flex-1 px-4 py-2.5 bg-yellow-500 text-white rounded-lg font-medium"
            >
              🔄 再试一次
            </button>
            <button
              onClick={handleComplete}
              className="flex-1 px-4 py-2.5 bg-green-500 text-white rounded-lg font-medium"
            >
              ✅ 完成
            </button>
          </>
        ) : (
          <button
            onClick={onSkip}
            className="px-4 py-2.5 bg-gray-200 text-gray-600 rounded-lg"
          >
            跳过
          </button>
        )}
      </div>

      {/* Attempt count */}
      <div className="attempt-count text-center text-sm text-gray-500 mt-3">
        已尝试 {attemptCount} 次
      </div>
    </div>
  );
}
