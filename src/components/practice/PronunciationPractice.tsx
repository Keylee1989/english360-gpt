/**
 * Pronunciation Practice Component
 *
 * Features:
 * - Phoneme visualization
 * - Weak sounds identification
 * - Practice examples
 * - Progress tracking
 */

import { useState, useCallback } from "react";
import {
  PronunciationEngineV4,
  type PronunciationAnalysisV4,
  type PhonemeUnit,
} from "@/engines/pronunciation/v4";

interface PronunciationPracticeProps {
  targetWord: string;
  targetIPA: string;
  chineseMeaning: string;
  onComplete: (analysis: PronunciationAnalysisV4) => void;
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
  const [analysis, setAnalysis] = useState<PronunciationAnalysisV4 | null>(null);
  const [attemptCount] = useState(0);
  const [showPhonemes, setShowPhonemes] = useState(false);

  const engine = new PronunciationEngineV4();

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
    setAnalysis(null);
  }, []);

  /**
   * Handle complete
   */
  const handleComplete = useCallback(() => {
    if (analysis) {
      onComplete(analysis);
    }
  }, [analysis, onComplete]);

  /**
   * Get phoneme database
   */
  const phonemes = engine.getAllPhonemes();

  return (
    <div className="pronunciation-practice">
      {/* Target Word */}
      <div className="target-word text-center mb-6">
        <h3 className="text-3xl font-bold mb-2">{targetWord}</h3>
        <p className="text-xl text-gray-600 mb-1">{targetIPA}</p>
        <p className="text-lg text-gray-500">{chineseMeaning}</p>
      </div>

      {/* Controls */}
      <div className="controls flex justify-center gap-4 mb-6">
        <button
          onClick={handleStartRecording}
          disabled={isRecording}
          className="px-6 py-3 bg-red-500 text-white rounded-lg disabled:bg-gray-300"
        >
          {isRecording ? "录音中..." : "开始录音"}
        </button>
        <button
          onClick={() => setShowPhonemes(!showPhonemes)}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg"
        >
          {showPhonemes ? "隐藏音素" : "显示音素"}
        </button>
      </div>

      {/* Phoneme Visualization */}
      {showPhonemes && (
        <div className="phoneme-visualization bg-gray-50 p-4 rounded-lg mb-6">
          <h4 className="font-semibold mb-3">音素分解:</h4>
          <div className="flex flex-wrap gap-2">
            {phonemes.slice(0, 10).map((phoneme: PhonemeUnit) => (
              <div
                key={phoneme.symbol}
                className="phoneme-card bg-white p-2 rounded border"
              >
                <div className="text-lg font-mono">{phoneme.symbol}</div>
                <div className="text-xs text-gray-600">{phoneme.name}</div>
                <div className="text-xs text-blue-600">{phoneme.chineseHint}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analysis Results */}
      {analysis && (
        <div className="analysis-results bg-white p-4 rounded-lg border mb-6">
          <h4 className="font-semibold mb-3">发音分析:</h4>

          {/* Overall Score */}
          <div className="overall-score text-center mb-4">
            <div className="text-4xl font-bold text-blue-500">
              {Math.round(analysis.overallScore * 100)}%
            </div>
            <div className="text-gray-600">总体得分</div>
          </div>

          {/* Detailed Scores */}
          <div className="detailed-scores grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-semibold text-green-500">
                {Math.round(analysis.phonemeAccuracy * 100)}%
              </div>
              <div className="text-sm text-gray-600">音素准确率</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-purple-500">
                {Math.round(analysis.stressScore * 100)}%
              </div>
              <div className="text-sm text-gray-600">重音</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-blue-500">
                {Math.round(analysis.rhythmScore * 100)}%
              </div>
              <div className="text-sm text-gray-600">节奏</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-yellow-500">
                {Math.round(analysis.intonationScore * 100)}%
              </div>
              <div className="text-sm text-gray-600">语调</div>
            </div>
          </div>

          {/* Errors */}
          {analysis.errors.length > 0 && (
            <div className="errors mb-4">
              <h5 className="font-medium mb-2">需要改进:</h5>
              <ul className="list-disc list-inside text-sm">
                {analysis.errors.map((error, index) => (
                  <li key={index} className="text-red-600">
                    {error.suggestionChinese}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Feedback */}
          <div className="feedback bg-gray-50 p-3 rounded">
            <p className="font-medium">{analysis.feedback.overall}</p>
            <p className="text-sm text-gray-600 mt-1">
              {analysis.feedback.overallChinese}
            </p>
            {analysis.feedback.phonemeTips.length > 0 && (
              <div className="phoneme-tips mt-2">
                <p className="text-sm font-medium">发音技巧:</p>
                {analysis.feedback.phonemeTips.map((tip, index) => (
                  <p key={index} className="text-sm text-blue-600">
                    {tip.phoneme}: {tip.tipChinese}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="action-buttons flex justify-center gap-4">
        {analysis ? (
          <>
            <button
              onClick={handleTryAgain}
              className="px-6 py-3 bg-yellow-500 text-white rounded-lg"
            >
              再试一次
            </button>
            <button
              onClick={handleComplete}
              className="px-6 py-3 bg-green-500 text-white rounded-lg"
            >
              完成
            </button>
          </>
        ) : (
          <button
            onClick={onSkip}
            className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg"
          >
            跳过
          </button>
        )}
      </div>

      {/* Attempt Count */}
      <div className="attempt-count text-center text-sm text-gray-500 mt-4">
        已尝试 {attemptCount} 次
      </div>
    </div>
  );
}
