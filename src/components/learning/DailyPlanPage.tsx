/**
 * Daily Plan Page
 *
 * Shows:
 * - Today's learning sessions from real curriculum data
 * - Progress through sessions
 * - Time estimates
 * - Priority items
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getLessonByDay } from "@/engines/curriculum/data/stage1-lessons";
import type { LessonActivity } from "@/types/database";

// ============================================================
// Types
// ============================================================

interface DailyPlan {
  date: string;
  dayNumber: number;
  totalMinutes: number;
  activities: LessonActivity[];
}

// ============================================================
// Helper: map activity type to route
// ============================================================

function getActivityRoute(activity: LessonActivity, dayNumber: number, index: number): string {
  switch (activity.type) {
    case "phonics":
    case "vocabulary_introduction":
    case "vocabulary_recognition":
    case "vocabulary_recall":
    case "grammar_explanation":
    case "grammar_practice":
    case "listening_comprehension":
    case "listening_dictation":
    case "speaking_repetition":
    case "speaking_conversation":
    case "review":
    case "assessment":
      return `/lesson/day_${dayNumber}?activity=${index}`;
    default:
      return `/lesson/day_${dayNumber}?activity=${index}`;
  }
}

// ============================================================
// Daily Plan Page Component
// ============================================================

export default function DailyPlanPage() {
  const navigate = useNavigate();
  const [plan, setPlan] = useState<DailyPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlan();
  }, []);

  const loadPlan = () => {
    // Load real curriculum data for Day 1
    const lesson = getLessonByDay(1);
    if (lesson && lesson.activities.length > 0) {
      setPlan({
        date: new Date().toLocaleDateString("zh-CN"),
        dayNumber: 1,
        totalMinutes: lesson.totalDuration || 240,
        activities: lesson.activities,
      });
    } else {
      // Fallback if no lesson found
      setPlan({
        date: new Date().toLocaleDateString("zh-CN"),
        dayNumber: 1,
        totalMinutes: 30,
        activities: [],
      });
    }
    setLoading(false);
  };

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
    return icons[type] || "📝";
  };

  const getActivityTitle = (activity: LessonActivity): string => {
    return activity.titleChinese || activity.title;
  };

  const getActivityDescription = (activity: LessonActivity): string => {
    return activity.descriptionChinese || activity.description;
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

  if (!plan || plan.activities.length === 0) {
    return (
      <div className="page-container">
        <div className="text-center py-12">
          <p className="text-gray-500">暂无学习计划</p>
          <button
            onClick={() => navigate("/onboarding")}
            className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg"
          >
            开始入门引导
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <header className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-primary-800">今日学习</h1>
        <p className="mt-1 text-sm text-gray-500">
          Day {plan.dayNumber} · {plan.date}
        </p>
        <p className="mt-1 text-xs text-gray-400">
          预计 {plan.totalMinutes} 分钟 · {plan.activities.length} 个活动
        </p>
      </header>

      {/* Activity List */}
      <div className="space-y-3">
        {plan.activities.map((activity, index) => {
          const route = getActivityRoute(activity, plan.dayNumber, index);
          return (
            <div
              key={activity.id}
              className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm border border-gray-100"
            >
              {/* Icon */}
              <div className="flex-shrink-0 text-2xl">
                {getActivityIcon(activity.type)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-800 text-sm">
                  {getActivityTitle(activity)}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5 truncate">
                  {getActivityDescription(activity)}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {activity.duration} 分钟
                </p>
              </div>

              {/* Action Button */}
              <button
                onClick={() => navigate(route)}
                className="flex-shrink-0 rounded-lg bg-primary-500 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-primary-600 active:bg-primary-700"
              >
                开始
              </button>
            </div>
          );
        })}
      </div>

      {/* Quick Start - First incomplete activity */}
      <div className="mt-6">
        <button
          onClick={() => {
            const firstIncomplete = plan.activities.findIndex((a) => !a.completed);
            const idx = firstIncomplete >= 0 ? firstIncomplete : 0;
            navigate(`/lesson/day_${plan.dayNumber}?activity=${idx}`);
          }}
          className="w-full rounded-xl bg-primary-500 px-4 py-3 font-medium text-white transition-colors hover:bg-primary-600 active:bg-primary-700 shadow-md"
        >
          开始今日学习
        </button>
      </div>
    </div>
  );
}
