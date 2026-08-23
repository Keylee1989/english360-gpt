/**
 * Adaptive Dashboard Component
 *
 * Features:
 * - Current level display
 * - Strengths and weaknesses
 * - Today's focus areas
 * - Progress visualization
 * - Recommendations
 */

import { useMemo } from "react";
import { AdaptiveLearningEngineV2, type AdaptiveProfileV2 } from "@/engines/adaptive/v2";
import type { DailyLesson } from "@/types/database";

interface AdaptiveDashboardProps {
  profile: AdaptiveProfileV2;
  onNavigateToPractice?: (skill: string) => void;
}

export function AdaptiveDashboard({
  profile,
  onNavigateToPractice,
}: AdaptiveDashboardProps) {
  const engine = new AdaptiveLearningEngineV2();

  // Calculate analytics
  const analytics = useMemo(() => {
    const adjustment = engine.generateLessonAdjustment(profile, {} as DailyLesson);
    return {
      timeAllocation: adjustment.timeAllocation,
      focusAreas: profile.weaknessAreas,
      strengths: profile.strengthAreas,
      recommendations: adjustment.reasons,
      difficulty: profile.currentDifficulty,
      confidence: adjustment.confidence,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  /**
   * Get level display name
   */
  function getLevelDisplayName(level: string): string {
    const names: Record<string, string> = {
      absolute_beginner: "零基础",
      beginner: "初级",
      elementary: "基础",
      intermediate: "中级",
      upper_intermediate: "中高级",
    };
    return names[level] || level;
  }

  /**
   * Get skill display name
   */
  function getSkillDisplayName(skill: string): string {
    const names: Record<string, string> = {
      vocabulary: "词汇",
      listening: "听力",
      speaking: "口语",
      grammar: "语法",
      pronunciation: "发音",
      reading: "阅读",
      writing: "写作",
    };
    return names[skill] || skill;
  }

  /**
   * Get priority color
   */
  function getPriorityColor(score: number): string {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    if (score >= 40) return "text-orange-500";
    return "text-red-500";
  }

  return (
    <div className="adaptive-dashboard p-4">
      {/* Header */}
      <div className="header bg-blue-500 text-white p-4 rounded-lg mb-6">
        <h2 className="text-2xl font-bold">学习仪表盘</h2>
        <p className="opacity-90">个性化学习体验</p>
      </div>

      {/* Current Level */}
      <div className="current-level bg-white p-4 rounded-lg border mb-6">
        <h3 className="font-semibold mb-2">当前级别</h3>
        <div className="text-3xl font-bold text-blue-500 mb-2">
          {getLevelDisplayName(analytics.difficulty)}
        </div>
        <div className="text-sm text-gray-600">
          置信度: {Math.round(analytics.confidence * 100)}%
        </div>
      </div>

      {/* Skills Overview */}
      <div className="skills-overview bg-white p-4 rounded-lg border mb-6">
        <h3 className="font-semibold mb-3">技能概览</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="skill-item">
            <div className="flex justify-between mb-1">
              <span className="text-sm">词汇</span>
              <span className={`text-sm font-medium ${getPriorityColor(profile.vocabularyAccuracy)}`}>
                {Math.round(profile.vocabularyAccuracy)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${profile.vocabularyAccuracy}%` }}
              />
            </div>
          </div>

          <div className="skill-item">
            <div className="flex justify-between mb-1">
              <span className="text-sm">听力</span>
              <span className={`text-sm font-medium ${getPriorityColor(profile.listeningScore)}`}>
                {Math.round(profile.listeningScore)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${profile.listeningScore}%` }}
              />
            </div>
          </div>

          <div className="skill-item">
            <div className="flex justify-between mb-1">
              <span className="text-sm">口语</span>
              <span className={`text-sm font-medium ${getPriorityColor(profile.speakingScore)}`}>
                {Math.round(profile.speakingScore)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-500 h-2 rounded-full"
                style={{ width: `${profile.speakingScore}%` }}
              />
            </div>
          </div>

          <div className="skill-item">
            <div className="flex justify-between mb-1">
              <span className="text-sm">语法</span>
              <span className={`text-sm font-medium ${getPriorityColor(profile.grammarAccuracy)}`}>
                {Math.round(profile.grammarAccuracy)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-500 h-2 rounded-full"
                style={{ width: `${profile.grammarAccuracy}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="strengths-weaknesses grid grid-cols-2 gap-4 mb-6">
        <div className="strengths bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="font-semibold text-green-800 mb-2"> strengths</h3>
          {analytics.strengths.length > 0 ? (
            <ul className="list-disc list-inside text-sm text-green-700">
              {analytics.strengths.map((strength, index) => (
                <li key={index}>{getSkillDisplayName(strength)}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-green-600">继续努力，发现你的优势！</p>
          )}
        </div>

        <div className="weaknesses bg-red-50 p-4 rounded-lg border border-red-200">
          <h3 className="font-semibold text-red-800 mb-2">需要改进</h3>
          {analytics.focusAreas.length > 0 ? (
            <ul className="list-disc list-inside text-sm text-red-700">
              {analytics.focusAreas.map((weakness, index) => (
                <li key={index}>{getSkillDisplayName(weakness)}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-red-600">表现很好！继续保持！</p>
          )}
        </div>
      </div>

      {/* Today's Focus */}
      <div className="todays-focus bg-white p-4 rounded-lg border mb-6">
        <h3 className="font-semibold mb-3">今日重点</h3>
        <div className="time-allocation">
          <div className="flex justify-between mb-2">
            <span className="text-sm">词汇练习</span>
            <span className="text-sm font-medium">{analytics.timeAllocation.vocabulary} 分钟</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-sm">听力练习</span>
            <span className="text-sm font-medium">{analytics.timeAllocation.listening} 分钟</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-sm">口语练习</span>
            <span className="text-sm font-medium">{analytics.timeAllocation.speaking} 分钟</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-sm">语法练习</span>
            <span className="text-sm font-medium">{analytics.timeAllocation.grammar} 分钟</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-sm">复习</span>
            <span className="text-sm font-medium">{analytics.timeAllocation.review} 分钟</span>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="recommendations bg-white p-4 rounded-lg border mb-6">
        <h3 className="font-semibold mb-3">学习建议</h3>
        <ul className="list-disc list-inside text-sm text-gray-700">
          {analytics.recommendations.slice(0, 3).map((recommendation, index) => (
            <li key={index} className="mb-1">
              {recommendation}
            </li>
          ))}
        </ul>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3 className="font-semibold mb-3">快速开始</h3>
        <div className="grid grid-cols-2 gap-3">
          {analytics.focusAreas.slice(0, 2).map((skill, index) => (
            <button
              key={index}
              onClick={() => onNavigateToPractice?.(skill)}
              className="p-3 bg-blue-500 text-white rounded-lg text-sm font-medium"
            >
              练习{getSkillDisplayName(skill)}
            </button>
          ))}
          <button
            onClick={() => onNavigateToPractice?.("vocabulary")}
            className="p-3 bg-green-500 text-white rounded-lg text-sm font-medium"
          >
            开始新词汇
          </button>
          <button
            onClick={() => onNavigateToPractice?.("review")}
            className="p-3 bg-purple-500 text-white rounded-lg text-sm font-medium"
          >
            复习旧词汇
          </button>
        </div>
      </div>

      {/* Learning Stats */}
      <div className="learning-stats bg-gray-50 p-4 rounded-lg mt-6">
        <h3 className="font-semibold mb-3">学习统计</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">已学单词:</span>
            <span className="font-medium ml-2">{profile.wordsLearned}</span>
          </div>
          <div>
            <span className="text-gray-600">已掌握:</span>
            <span className="font-medium ml-2">{profile.wordsMastered}</span>
          </div>
          <div>
            <span className="text-gray-600">学习时间:</span>
            <span className="font-medium ml-2">
              {Math.round(profile.totalStudyTime / 60)} 小时
            </span>
          </div>
          <div>
            <span className="text-gray-600">连续学习:</span>
            <span className="font-medium ml-2">{profile.currentStreak} 天</span>
          </div>
        </div>
      </div>
    </div>
  );
}
