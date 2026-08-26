/**
 * HomePage — Today's Mission
 *
 * Shows:
 * - Current day and streak
 * - Today's learning mission
 * - Activity list with progress
 * - Quick actions
 * - Progress summary
 */

import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DailyCoachEngineV2, type DailyMission, type LearnerProfile } from "@/engines/daily-coach/v2";

// ============================================================
// Storage Keys
// ============================================================

const STORAGE_KEYS = {
  USER_PROFILE: "english360_user_profile",
  CURRENT_DAY: "english360_current_day",
  MISSIONS: "english360_missions",
  COMPLETED_ACTIVITIES: "english360_completed_activities",
};

// ============================================================
// Default Profile
// ============================================================

const DEFAULT_PROFILE: LearnerProfile = {
  userId: "user_1",
  currentDay: 1,
  level: "A1",
  vocabularyLevel: 20,
  listeningLevel: 15,
  speakingLevel: 10,
  grammarLevel: 20,
  readingLevel: 15,
  writingLevel: 10,
  pronunciationLevel: 15,
  weakAreas: ["speaking", "listening"],
  strongAreas: [],
  wordsLearned: 0,
  wordsMastered: 0,
  retentionRate: 0.5,
  studyStreak: 0,
  dailyGoalMinutes: 240,
  yesterdayCompleted: [],
  yesterdayScore: 0,
};

// ============================================================
// Helper Functions
// ============================================================

function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveToStorage(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Storage save failed:", e);
  }
}

function getActivityIcon(type: string): string {
  const icons: Record<string, string> = {
    srs_review: "🔄",
    listening_input: "👂",
    shadowing: "🗣️",
    conversation: "💬",
    reading: "📖",
    writing: "✏️",
    grammar: "📝",
    pronunciation: "🔤",
    vocabulary_new: "📚",
    assessment: "📋",
  };
  return icons[type] || "📝";
}

function getActivityRoute(type: string): string {
  const routes: Record<string, string> = {
    srs_review: "/review",
    listening_input: "/lesson",
    shadowing: "/practice/shadowing",
    conversation: "/practice/conversation",
    reading: "/lesson",
    writing: "/lesson",
    grammar: "/lesson",
    pronunciation: "/practice/pronunciation",
    vocabulary_new: "/lesson",
    assessment: "/lesson",
  };
  return routes[type] || "/lesson";
}

// ============================================================
// HomePage Component
// ============================================================

export default function HomePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<LearnerProfile>(DEFAULT_PROFILE);
  const [mission, setMission] = useState<DailyMission | null>(null);
  const [completedActivities, setCompletedActivities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const coach = useMemo(() => new DailyCoachEngineV2(), []);

  // Load profile and generate mission
  useEffect(() => {
    const loadAndGenerate = () => {
      // Load profile from storage (persist on first run so activity pages can update it)
      const savedProfile = loadFromStorage<LearnerProfile>(
        STORAGE_KEYS.USER_PROFILE,
        DEFAULT_PROFILE
      );
      saveToStorage(STORAGE_KEYS.USER_PROFILE, savedProfile);
      setProfile(savedProfile);

      // Load completed activities for today
      const today = new Date().toISOString().split("T")[0];
      const savedCompleted = loadFromStorage<string[]>(
        `${STORAGE_KEYS.COMPLETED_ACTIVITIES}_${today}`,
        []
      );
      setCompletedActivities(savedCompleted);

      // Generate today's mission
      const todayMission = coach.generateMission(savedProfile);
      setMission(todayMission);

      setLoading(false);
    };

    loadAndGenerate();

    // Refresh progress when an activity page reports completion (same-tab event)
    const onActivityComplete = () => {
      const today = new Date().toISOString().split("T")[0];
      setCompletedActivities(
        loadFromStorage<string[]>(`${STORAGE_KEYS.COMPLETED_ACTIVITIES}_${today}`, [])
      );
      setProfile(loadFromStorage<LearnerProfile>(STORAGE_KEYS.USER_PROFILE, DEFAULT_PROFILE));
    };
    window.addEventListener("english360_activity_complete", onActivityComplete);
    return () => window.removeEventListener("english360_activity_complete", onActivityComplete);
  }, [coach]);

  // Handle activity completion
  const handleActivityComplete = useCallback(
    (activityId: string) => {
      if (!mission) return;

      // Mark as completed
      const newCompleted = [...completedActivities, activityId];
      setCompletedActivities(newCompleted);

      // Save to storage
      const today = new Date().toISOString().split("T")[0];
      saveToStorage(
        `${STORAGE_KEYS.COMPLETED_ACTIVITIES}_${today}`,
        newCompleted
      );

      // Update mission in engine
      try {
        coach.completeActivity(mission.id, activityId, 0.8);
      } catch (e) {
        console.error("Failed to complete activity:", e);
      }

      // Update profile
      const updatedProfile = {
        ...profile,
        wordsLearned: profile.wordsLearned + 5,
        wordsMastered: profile.wordsMastered + 2,
      };
      setProfile(updatedProfile);
      saveToStorage(STORAGE_KEYS.USER_PROFILE, updatedProfile);
    },
    [mission, completedActivities, profile, coach]
  );

  // Navigate to activity
  const handleActivityClick = (activityId: string, type: string) => {
    if (completedActivities.includes(activityId)) {
      return; // Already completed
    }
    navigate(getActivityRoute(type));
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">加载中...</div>
        </div>
      </div>
    );
  }

  const completedCount = completedActivities.length;
  const totalCount = mission?.activities.length || 0;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="page-container">
      {/* Header */}
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-primary-800">English360</h1>
        <p className="mt-1 text-sm text-gray-500">你的AI英语教练</p>
      </header>

      {/* Today's Summary Card */}
      <div className="card mb-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Day {profile.currentDay}</h2>
            <p className="text-sm text-primary-100">
              连续学习 {profile.studyStreak} 天
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{progressPercent}%</div>
            <p className="text-xs text-primary-100">今日完成</p>
          </div>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-primary-400">
          <div
            className="h-full bg-white transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary-600">
            {profile.wordsLearned}
          </div>
          <div className="text-xs text-gray-500">已学单词</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary-600">
            {profile.studyStreak}
          </div>
          <div className="text-xs text-gray-500">连续天数</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary-600">
            {profile.level || 'A1'}
          </div>
          <div className="text-xs text-gray-500">当前等级</div>
        </div>
      </div>

      {/* Today's Mission */}
      {mission && (
        <div className="card mb-4">
          <h2 className="mb-3 text-lg font-semibold">今日学习任务</h2>
          <div className="space-y-2">
            {mission.activities.map((activity) => {
              const isCompleted = completedActivities.includes(activity.id);
              return (
                <div
                  key={activity.id}
                  className={`flex items-center gap-3 rounded-lg p-3 transition-colors ${
                    isCompleted
                      ? "bg-green-50 opacity-70"
                      : "bg-gray-50 hover:bg-gray-100 cursor-pointer"
                  }`}
                  onClick={() => handleActivityClick(activity.id, activity.type)}
                >
                  <div className="text-2xl">{getActivityIcon(activity.type)}</div>
                  <div className="flex-1">
                    <div className="font-medium">{activity.titleChinese}</div>
                  </div>
                  <div>
                    {isCompleted ? (
                      <span className="text-2xl">✅</span>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleActivityComplete(activity.id);
                        }}
                        className="rounded-lg bg-primary-500 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-primary-600"
                      >
                        完成
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Focus Areas */}
      {mission && mission.focusAreas.length > 0 && (
        <div className="card mb-4">
          <h2 className="mb-2 text-lg font-semibold">今日重点</h2>
          <div className="flex flex-wrap gap-2">
            {mission.focusAreas.map((area, index) => (
              <span
                key={index}
                className="rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-800"
              >
                {area === "listening"
                  ? "听力"
                  : area === "speaking"
                  ? "口语"
                  : area === "vocabulary"
                  ? "词汇"
                  : area === "grammar"
                  ? "语法"
                  : area === "pronunciation"
                  ? "发音"
                  : area}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="space-y-2 mb-4">
        <button
          onClick={() => navigate("/path")}
          className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-left text-white transition-colors hover:bg-indigo-700"
        >
          <div className="font-medium">🗺️ 我的英语之路（A1→C2通关）</div>
          <div className="text-xs text-indigo-100">查看学习地图 · 做测试解锁下一级</div>
        </button>
        <button
          onClick={() => navigate("/learn")}
          className="w-full rounded-lg bg-primary-500 px-4 py-3 text-left text-white transition-colors hover:bg-primary-600"
        >
          <div className="font-medium">开始今日学习</div>
          <div className="text-xs text-primary-100">
            {totalCount - completedCount} 个任务待完成
          </div>
        </button>
        <button
          onClick={() => navigate("/level-test")}
          className="w-full rounded-lg bg-amber-50 px-4 py-3 text-left text-amber-700 transition-colors hover:bg-amber-100"
        >
          <div className="font-medium">🎯 水平测试</div>
          <div className="text-xs text-amber-600">快速了解你的英语水平</div>
        </button>
        <button
          onClick={() => navigate("/resources/external")}
          className="w-full rounded-lg bg-green-50 px-4 py-3 text-left text-green-700 transition-colors hover:bg-green-100"
        >
          <div className="font-medium">📚 学习资源</div>
          <div className="text-xs text-green-600">按等级分级的外部学习资源</div>
        </button>
        <button
          onClick={() => navigate("/quiz")}
          className="w-full rounded-lg bg-purple-50 px-4 py-3 text-left text-purple-700 transition-colors hover:bg-purple-100"
        >
          <div className="font-medium">🎯 随机知识问答</div>
          <div className="text-xs text-purple-600">词汇+语法+音标混合测试</div>
        </button>
        <button
          onClick={() => navigate("/review")}
          className="w-full rounded-lg bg-gray-100 px-4 py-3 text-left text-gray-700 transition-colors hover:bg-gray-200"
        >
          <div className="font-medium">🔄 复习单词</div>
          <div className="text-xs text-gray-500">SRS智能复习</div>
        </button>
        <button
          onClick={() => navigate("/resources")}
          className="w-full rounded-lg bg-gray-100 px-4 py-3 text-left text-gray-700 transition-colors hover:bg-gray-200"
        >
          <div className="font-medium">📖 词典与语法</div>
          <div className="text-xs text-gray-500">搜索20,000+词汇和175+语法规则</div>
        </button>
      </div>

      {/* Difficulty & Audio Speed */}
      {mission && (
        <div className="card mb-4">
          <div className="flex items-center justify-between text-sm">
            <div>
              <span className="text-gray-500">难度：</span>
              <span className="font-medium">
                {mission.difficulty === "easy"
                  ? "简单"
                  : mission.difficulty === "normal"
                  ? "适中"
                  : "挑战"}
              </span>
            </div>
            <div>
              <span className="text-gray-500">音频速度：</span>
              <span className="font-medium">
                {mission.audioSpeed === "slow"
                  ? "慢速"
                  : mission.audioSpeed === "normal"
                  ? "正常"
                  : "快速"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Onboarding Link (if new user) */}
      {profile.currentDay === 1 && profile.wordsLearned === 0 && (
        <div className="card mb-4 bg-yellow-50">
          <div className="flex items-center gap-3">
            <div className="text-2xl">👋</div>
            <div className="flex-1">
              <div className="font-medium">新用户？</div>
              <div className="text-xs text-gray-500">
                完成个性化设置，获得更好的学习体验
              </div>
            </div>
            <button
              onClick={() => navigate("/onboarding")}
              className="rounded-lg bg-yellow-500 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-yellow-600"
            >
              设置
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <p className="text-center text-xs text-gray-400">
        Phase 10 · AI英语教练
      </p>
    </div>
  );
}
