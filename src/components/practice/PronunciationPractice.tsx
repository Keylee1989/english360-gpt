/**
 * Pronunciation Practice Component (v2)
 *
 * Features:
 * - Play target word audio (TTS)
 * - Record user voice (Web Speech API)
 * - Compare pronunciation
 * - Show accuracy score
 * - Practice tips
 */

import { useState, useCallback, useRef } from "react";
import { SpeakingEngine } from "@/engines/speaking";

interface PronunciationPracticeProps {
  targetWord: string;
  targetIPA: string;
  chineseMeaning: string;
  onComplete: (score: number) => void;
  onSkip?: () => void;
}

export function PronunciationPractice({
  targetWord,
  targetIPA,
  chineseMeaning,
  onComplete,
  onSkip,
}: PronunciationPracticeProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [userSpeech, setUserSpeech] = useState("");
  const [accuracy, setAccuracy] = useState(0);
  const [attemptCount, setAttemptCount] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [bestScore, setBestScore] = useState(0);

  const engineRef = useRef<SpeakingEngine | null>(null);

  const getEngine = useCallback(() => {
    if (!engineRef.current) {
      engineRef.current = new SpeakingEngine();
    }
    return engineRef.current;
  }, []);

  /**
   * Calculate word similarity
   */
  const calculateSimilarity = useCallback((spoken: string, target: string): number => {
    const normalize = (s: string) => s.toLowerCase().replace(/[^a-z]/g, "").trim();
    const ns = normalize(spoken);
    const nt = normalize(target);

    if (ns === nt) return 1;
    if (!ns || !nt) return 0;

    // Check if target is contained in spoken or vice versa
    if (ns.includes(nt) || nt.includes(ns)) return 0.8;

    // Levenshtein distance
    const matrix: number[][] = [];
    for (let i = 0; i <= nt.length; i++) matrix[i] = [i];
    for (let j = 0; j <= ns.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= nt.length; i++) {
      for (let j = 1; j <= ns.length; j++) {
        const cost = nt.charAt(i - 1) === ns.charAt(j - 1) ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost,
        );
      }
    }

    const distance = matrix[nt.length][ns.length];
    return Math.max(0, 1 - distance / Math.max(ns.length, nt.length));
  }, []);

  /**
   * Play target word audio
   */
  const handlePlayWord = useCallback(() => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(targetWord);
      utterance.lang = "en-US";
      utterance.rate = 0.7; // Slow for pronunciation practice
      window.speechSynthesis.speak(utterance);
    }
  }, [targetWord]);

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
    setShowResult(false);

    engine.startRecording(
      (result: string) => {
        setUserSpeech(result);
        setIsRecording(false);

        const sim = calculateSimilarity(result, targetWord);
        setAccuracy(sim);
        setShowResult(true);
        setAttemptCount((c) => c + 1);

        if (sim > bestScore) {
          setBestScore(sim);
        }
      },
      (error: string) => {
        console.error("Recording error:", error);
        setIsRecording(false);
        if (error === "not-allowed") {
          alert("请允许麦克风权限后重试。");
        }
      },
    );
  }, [getEngine, targetWord, calculateSimilarity, bestScore]);

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
    setShowResult(false);
    setUserSpeech("");
    setAccuracy(0);
  }, []);

  /**
   * Handle complete
   */
  const handleComplete = useCallback(() => {
    onComplete(bestScore);
  }, [bestScore, onComplete]);

  /**
   * Get pronunciation tips based on the word
   */
  const getPronunciationTips = (): string[] => {
    const tips: string[] = [];
    const lower = targetWord.toLowerCase();

    if (lower.includes("th")) {
      tips.push("th 发音：舌尖轻触上齿，气流从舌齿间通过");
    }
    if (lower.includes("r") || lower.includes("R")) {
      tips.push("r 发音：舌尖卷起，不触碰任何部位");
    }
    if (lower.includes("v")) {
      tips.push("v 发音：上齿轻触下唇，声带振动");
    }
    if (lower.includes("w")) {
      tips.push("w 发音：嘴唇圆拢，像吹蜡烛");
    }
    if (lower.includes("l") && !lower.includes("le")) {
      tips.push("l 发音：舌尖抵住上齿龈");
    }
    if (lower.endsWith("ed")) {
      tips.push("ed 结尾：根据前一个音决定读 /t/ /d/ 或 /ɪd/");
    }
    if (lower.endsWith("s") || lower.endsWith("es")) {
      tips.push("s/es 结尾：根据前一个音决定读 /s/ /z/ 或 /ɪz/");
    }

    if (tips.length === 0) {
      tips.push("注意元音饱满，辅音清晰");
      tips.push("重音在正确的音节上");
    }

    return tips;
  };

  return (
    <div className="pronunciation-practice">
      {/* Target Word */}
      <div className="target-word text-center mb-6">
        <h3 className="text-4xl font-bold text-primary-700 mb-2">{targetWord}</h3>
        <p className="text-xl text-primary-500 mb-1">{targetIPA}</p>
        <p className="text-lg text-gray-500">{chineseMeaning}</p>
      </div>

      {/* Play Button */}
      <div className="flex justify-center mb-6">
        <button
          onClick={handlePlayWord}
          className="px-6 py-3 bg-green-500 text-white rounded-lg font-medium flex items-center gap-2"
        >
          🔊 播放标准发音
        </button>
      </div>

      {/* Recording Controls */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={isRecording ? handleStopRecording : handleStartRecording}
          disabled={!getEngine().isSupported()}
          className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 ${
            isRecording
              ? "bg-red-500 text-white animate-pulse"
              : "bg-blue-500 text-white disabled:bg-gray-300"
          }`}
        >
          {isRecording ? "⏹ 停止录音" : "🎤 开始录音"}
        </button>
      </div>

      {/* Browser support warning */}
      {!getEngine().isSupported() && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 text-sm text-amber-800 text-center">
          ⚠️ 你的浏览器不支持语音识别。请使用 Chrome 或 Edge 浏览器。
        </div>
      )}

      {/* Accuracy Display */}
      {showResult && (
        <div className="accuracy-display text-center mb-6">
          <div
            className="text-6xl font-bold mb-2"
            style={{
              color: accuracy >= 0.8 ? "#16a34a" : accuracy >= 0.5 ? "#d97706" : "#dc2626",
            }}
          >
            {Math.round(accuracy * 100)}%
          </div>
          <div className="text-gray-500">发音准确率</div>
          <div className="mt-2 text-sm">
            {accuracy >= 0.8
              ? "🎉 发音非常标准！"
              : accuracy >= 0.5
              ? "💪 接近标准了，再练习一下！"
              : "🔄 再听一遍标准发音，然后模仿。"}
          </div>
        </div>
      )}

      {/* User's speech */}
      {userSpeech && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 text-center">
          <div className="text-sm text-gray-500 mb-1">你说的是：</div>
          <div className="text-lg font-medium text-blue-800">"{userSpeech}"</div>
        </div>
      )}

      {/* Best Score */}
      {bestScore > 0 && (
        <div className="text-center text-sm text-gray-500 mb-4">
          🏆 最佳成绩：{Math.round(bestScore * 100)}%
        </div>
      )}

      {/* Pronunciation Tips */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
        <h4 className="font-medium text-amber-800 mb-2">💡 发音技巧：</h4>
        <ul className="text-sm text-amber-700 space-y-1">
          {getPronunciationTips().map((tip, i) => (
            <li key={i}>• {tip}</li>
          ))}
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
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
      <div className="text-center text-sm text-gray-500 mt-3">
        已尝试 {attemptCount} 次
      </div>
    </div>
  );
}
