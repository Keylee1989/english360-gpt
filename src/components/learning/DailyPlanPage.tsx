/**
 * Daily Plan Page
 *
 * Shows:
 * - Today's learning sessions
 * - Progress through sessions
 * - Time estimates
 * - Priority items
 */

import { useState, useEffect } from "react";

// ============================================================
// Types
// ============================================================

interface DailyPlan {
  date: string;
  totalMinutes: number;
  sessions: LearningSession[];
  priorities: string[];
}

interface LearningSession {
  id: string;
  domain: string;
  activityType: string;
  minutes: number;
  description: string;
  priority: "critical" | "high" | "medium" | "low";
  completed: boolean;
}

// ============================================================
// Daily Plan Page Component
// ============================================================

export default function DailyPlanPage() {
  const [plan, setPlan] = useState<DailyPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlan();
  }, []);

  const loadPlan = async () => {
    // TODO: Load real plan from DailyPlannerEngine
    // For now, show placeholder data
    setPlan({
      date: new Date().toISOString().split("T")[0],
      totalMinutes: 30,
      sessions: [
        {
          id: "1",
          domain: "vocabulary",
          activityType: "multiple_choice",
          minutes: 10,
          description: "学习5个新单词",
          priority: "critical",
          completed: false,
        },
        {
          id: "2",
          domain: "phonics",
          activityType: "multiple_choice",
          minutes: 10,
          description: "学习字母A-D的发音",
          priority: "high",
          completed: false,
        },
        {
          id: "3",
          domain: "listening",
          activityType: "listening",
          minutes: 10,
          description: "听力练习",
          priority: "medium",
          completed: false,
        },
      ],
      priorities: ["学习新单词", "练习发音"],
    });
    setLoading(false);
  };

  const getPriorityColor = (priority: LearningSession["priority"]) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-blue-100 text-blue-800";
      case "low":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDomainIcon = (domain: string) => {
    switch (domain) {
      case "vocabulary":
        return "📚";
      case "phonics":
        return "🔤";
      case "listening":
        return "👂";
      case "speaking":
        return "🗣️";
      case "reading":
        return "📖";
      case "writing":
        return "✏️";
      default:
        return "📝";
    }
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

  if (!plan) {
    return (
      <div className="page-container">
        <div className="text-center py-12">
          <p className="text-gray-500">暂无学习计划</p>
        </div>
      </div>
    );
  }

  const completedCount = plan.sessions.filter((s) => s.completed).length;
  const totalCount = plan.sessions.length;

  return (
    <div className="page-container">
      <header className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-primary-800">今日学习</h1>
        <p className="mt-1 text-sm text-gray-500">{plan.date}</p>
      </header>

      {/* Progress Summary */}
      <div className="card mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">学习进度</h2>
            <p className="text-sm text-gray-500">
              {completedCount} / {totalCount} 个任务完成
            </p>
          </div>
          <div className="text-2xl font-bold text-primary-600">
            {Math.round((completedCount / totalCount) * 100)}%
          </div>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full bg-primary-500 transition-all"
            style={{
              width: `${(completedCount / totalCount) * 100}%`,
            }}
          />
        </div>
        <p className="mt-2 text-xs text-gray-500">
          预计总时间：{plan.totalMinutes} 分钟
        </p>
      </div>

      {/* Priorities */}
      {plan.priorities.length > 0 && (
        <div className="card mb-4">
          <h2 className="mb-2 text-lg font-semibold">今日重点</h2>
          <div className="flex flex-wrap gap-2">
            {plan.priorities.map((priority, index) => (
              <span
                key={index}
                className="rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-800"
              >
                {priority}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Sessions List */}
      <div className="space-y-3">
        {plan.sessions.map((session) => (
          <div
            key={session.id}
            className={`card ${session.completed ? "opacity-60" : ""}`}
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl">{getDomainIcon(session.domain)}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{session.description}</h3>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${getPriorityColor(
                      session.priority
                    )}`}
                  >
                    {session.priority === "critical"
                      ? "必须"
                      : session.priority === "high"
                      ? "重要"
                      : session.priority === "medium"
                      ? "推荐"
                      : "可选"}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  {session.minutes} 分钟 · {session.activityType}
                </p>
              </div>
              <div>
                {session.completed ? (
                  <span className="text-2xl">✅</span>
                ) : (
                  <button className="rounded-lg bg-primary-500 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-primary-600">
                    开始
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Start */}
      {!plan.sessions.every((s) => s.completed) && (
        <div className="mt-6">
          <button className="w-full rounded-lg bg-primary-500 px-4 py-3 font-medium text-white transition-colors hover:bg-primary-600">
            开始今日学习
          </button>
        </div>
      )}
    </div>
  );
}
