/**
 * Shadowing Practice Component
 *
 * Features:
 * - Play audio
 * - Record voice
 * - Compare with model
 * - Show score and mistakes
 * - Progress tracking
 */

import { useState, useCallback } from "react";
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
  const [attemptCount] = useState(0);

  /**
   * Handle play audio
   */
  const handlePlayAudio = useCallback(() => {
    setIsPlaying(true);
    // Simulate audio playback
    setTimeout(() => {
      setIsPlaying(false);
    }, exercise.audioDurationMs);
  }, [exercise.audioDurationMs]);

  /**
   * Handle start recording
   */
  const handleStartRecording = useCallback(() => {
    setIsRecording(true);
    // In real implementation, would start speech recognition
  }, []);



  /**
   * Handle try again
   */
  const handleTryAgain = useCallback(() => {
    setResult(null);
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
      <div className="exercise-header">
        <h3 className="text-lg font-semibold mb-2">{exercise.text}</h3>
        <p className="text-gray-600 text-sm">{exercise.translationChinese}</p>
      </div>

      <div className="mode-selector mb-4">
        <label className="block text-sm font-medium mb-2">练习模式:</label>
        <div className="flex gap-2">
          <button
            onClick={() => setMode("listen_only")}
            className={`px-3 py-1 rounded text-sm ${
              mode === "listen_only"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            只听
          </button>
          <button
            onClick={() => setMode("listen_repeat")}
            className={`px-3 py-1 rounded text-sm ${
              mode === "listen_repeat"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            听后重复
          </button>
          <button
            onClick={() => setMode("shadow_simultaneous")}
            className={`px-3 py-1 rounded text-sm ${
              mode === "shadow_simultaneous"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            同步跟读
          </button>
          <button
            onClick={() => setMode("free_repeat")}
            className={`px-3 py-1 rounded text-sm ${
              mode === "free_repeat"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            自由重复
          </button>
        </div>
      </div>

      <div className="controls mb-4">
        <button
          onClick={handlePlayAudio}
          disabled={isPlaying}
          className="px-4 py-2 bg-green-500 text-white rounded mr-2 disabled:bg-gray-300"
        >
          {isPlaying ? "播放中..." : "播放音频"}
        </button>

        {!result && (
          <button
            onClick={handleStartRecording}
            disabled={isRecording}
            className="px-4 py-2 bg-red-500 text-white rounded disabled:bg-gray-300"
          >
            {isRecording ? "录音中..." : "开始录音"}
          </button>
        )}
      </div>

      {result && (
        <div className="result-panel bg-gray-50 p-4 rounded mb-4">
          <h4 className="font-semibold mb-2">练习结果:</h4>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">
                {Math.round(result.accuracy * 100)}%
              </div>
              <div className="text-sm text-gray-600">准确率</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">
                {Math.round(result.timing * 100)}%
              </div>
              <div className="text-sm text-gray-600">节奏</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">
                {Math.round(result.fluency * 100)}%
              </div>
              <div className="text-sm text-gray-600">流利度</div>
            </div>
          </div>

          {result.mistakes.length > 0 && (
            <div className="mistakes mb-4">
              <h5 className="font-medium mb-1">需要改进:</h5>
              <ul className="list-disc list-inside text-sm text-red-600">
                {result.mistakes.map((mistake, index) => (
                  <li key={index}>
                    {mistake.expected && `缺少: "${mistake.expected}"`}
                    {mistake.detected && `多余: "${mistake.detected}"`}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="suggestions mb-4">
            <h5 className="font-medium mb-1">建议:</h5>
            <ul className="list-disc list-inside text-sm text-blue-600">
              {result.suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>

          <div className="feedback bg-white p-3 rounded">
            <p className="font-medium">{result.feedback.overall}</p>
            {result.feedback.strengths.length > 0 && (
              <p className="text-green-600 text-sm mt-1">
                优点: {result.feedback.strengths.join(", ")}
              </p>
            )}
            {result.feedback.weaknesses.length > 0 && (
              <p className="text-red-600 text-sm mt-1">
                需改进: {result.feedback.weaknesses.join(", ")}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="action-buttons flex gap-2">
        {result ? (
          <>
            <button
              onClick={handleTryAgain}
              className="px-4 py-2 bg-yellow-500 text-white rounded"
            >
              再试一次
            </button>
            <button
              onClick={handleComplete}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              完成
            </button>
          </>
        ) : (
          <button
            onClick={onSkip}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
          >
            跳过
          </button>
        )}
      </div>

      <div className="attempt-count text-sm text-gray-500 mt-2">
        已尝试 {attemptCount} 次
      </div>
    </div>
  );
}
