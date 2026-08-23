/**
 * Onboarding Page — Real Onboarding Flow
 *
 * Collects:
 * - Age
 * - Current English level
 * - Learning goals
 * - Daily study time
 * - Why learning English
 *
 * Then generates:
 * - Personalized learning plan
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { progressPersistence, type UserProfile } from "@/services/progress-persistence";

// ============================================================
// Types
// ============================================================

interface OnboardingData {
  age: number;
  currentLevel: "zero" | "basic" | "elementary" | "intermediate";
  goals: string[];
  dailyMinutes: number;
  reason: string;
  name: string;
}

// ============================================================
// Steps
// ============================================================

const STEPS = [
  "welcome",
  "personal",
  "level",
  "goals",
  "time",
  "reason",
  "complete",
];

// ============================================================
// OnboardingPage Component
// ============================================================

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    age: 30,
    currentLevel: "zero",
    goals: [],
    dailyMinutes: 240,
    reason: "",
    name: "",
  });

  // Handle next step
  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    }
  };

  // Handle previous step
  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  // Handle complete onboarding
  const handleComplete = async () => {
    // Create user profile based on onboarding data
    const profile: UserProfile = {
      userId: "user_1",
      currentDay: 1,
      level: "A1",
      vocabularyLevel: data.currentLevel === "zero" ? 10 : 30,
      listeningLevel: data.currentLevel === "zero" ? 10 : 25,
      speakingLevel: data.currentLevel === "zero" ? 5 : 20,
      grammarLevel: data.currentLevel === "zero" ? 10 : 30,
      readingLevel: data.currentLevel === "zero" ? 10 : 25,
      writingLevel: data.currentLevel === "zero" ? 5 : 15,
      pronunciationLevel: data.currentLevel === "zero" ? 10 : 20,
      weakAreas: ["speaking", "listening"],
      strongAreas: [],
      wordsLearned: 0,
      wordsMastered: 0,
      retentionRate: 0.5,
      studyStreak: 0,
      bestStreak: 0,
      dailyGoalMinutes: data.dailyMinutes,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    // Save to IndexedDB
    await progressPersistence.saveProfile(profile);

    // Navigate to home
    navigate("/");
  };

  // Update data
  const updateData = (updates: Partial<OnboardingData>) => {
    setData({ ...data, ...updates });
  };

  // Toggle goal
  const toggleGoal = (goal: string) => {
    const goals = data.goals.includes(goal)
      ? data.goals.filter((g) => g !== goal)
      : [...data.goals, goal];
    updateData({ goals });
  };

  // ============================================================
  // Render Steps
  // ============================================================

  const renderStep = () => {
    switch (STEPS[step]) {
      case "welcome":
        return (
          <div className="text-center">
            <div className="text-6xl mb-4">👋</div>
            <h2 className="text-2xl font-bold mb-2">欢迎来到 English360</h2>
            <p className="text-gray-600 mb-4">
              你的AI英语教练，专为中国零基础学习者设计
            </p>
            <p className="text-sm text-gray-500">
              完成以下设置，获得个性化学习体验
            </p>
          </div>
        );

      case "personal":
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">基本信息</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  你的名字（可选）
                </label>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => updateData({ name: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none"
                  placeholder="输入你的名字"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  你的年龄
                </label>
                <input
                  type="number"
                  value={data.age}
                  onChange={(e) => updateData({ age: parseInt(e.target.value) || 30 })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none"
                  min="18"
                  max="80"
                />
              </div>
            </div>
          </div>
        );

      case "level":
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">你目前的英语水平</h2>
            <div className="space-y-2">
              {[
                {
                  value: "zero",
                  label: "完全零基础",
                  desc: "几乎不认识任何英语单词",
                },
                {
                  value: "basic",
                  label: "认识一些单词",
                  desc: "认识26个字母，会说hello、thank you等",
                },
                {
                  value: "elementary",
                  label: "初中水平",
                  desc: "能读懂简单句子，但不会说",
                },
                {
                  value: "intermediate",
                  label: "高中/大学水平",
                  desc: "能读懂文章，但口语不流利",
                },
              ].map((level) => (
                <button
                  key={level.value}
                  onClick={() =>
                    updateData({
                      currentLevel: level.value as OnboardingData["currentLevel"],
                    })
                  }
                  className={`w-full rounded-lg p-3 text-left transition-colors ${
                    data.currentLevel === level.value
                      ? "bg-primary-100 border-2 border-primary-500"
                      : "bg-gray-50 border-2 border-transparent hover:bg-gray-100"
                  }`}
                >
                  <div className="font-medium">{level.label}</div>
                  <div className="text-sm text-gray-500">{level.desc}</div>
                </button>
              ))}
            </div>
          </div>
        );

      case "goals":
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">你的学习目标</h2>
            <p className="text-sm text-gray-500 mb-3">选择所有适用的（可多选）</p>
            <div className="space-y-2">
              {[
                "日常交流",
                "工作需要",
                "旅游出行",
                "考试准备",
                "看懂英文内容",
                "陪孩子学习",
                "个人兴趣",
              ].map((goal) => (
                <button
                  key={goal}
                  onClick={() => toggleGoal(goal)}
                  className={`w-full rounded-lg p-3 text-left transition-colors ${
                    data.goals.includes(goal)
                      ? "bg-primary-100 border-2 border-primary-500"
                      : "bg-gray-50 border-2 border-transparent hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        data.goals.includes(goal)
                          ? "bg-primary-500 border-primary-500"
                          : "border-gray-300"
                      }`}
                    >
                      {data.goals.includes(goal) && (
                        <span className="text-white text-xs">✓</span>
                      )}
                    </div>
                    <span>{goal}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case "time":
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">每天学习时间</h2>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-600">
                  {data.dailyMinutes}
                </div>
                <div className="text-sm text-gray-500">分钟/天</div>
              </div>
              <input
                type="range"
                min="30"
                max="480"
                step="30"
                value={data.dailyMinutes}
                onChange={(e) =>
                  updateData({ dailyMinutes: parseInt(e.target.value) })
                }
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>30分钟</span>
                <span>8小时</span>
              </div>
              <div className="text-center text-sm text-gray-600">
                {data.dailyMinutes <= 60
                  ? "每天30-60分钟：保持基础学习"
                  : data.dailyMinutes <= 120
                  ? "每天1-2小时：稳步进步"
                  : data.dailyMinutes <= 240
                  ? "每天2-4小时：快速提升"
                  : "每天4小时以上：高强度学习"}
              </div>
            </div>
          </div>
        );

      case "reason":
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">为什么学习英语？</h2>
            <p className="text-sm text-gray-500 mb-3">
              告诉我们你的动机，帮助我们更好地指导你
            </p>
            <textarea
              value={data.reason}
              onChange={(e) => updateData({ reason: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none"
              rows={4}
              placeholder="例如：我想和外国客户交流，或者想看懂英文电影..."
            />
          </div>
        );

      case "complete":
        return (
          <div className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold mb-2">设置完成！</h2>
            <p className="text-gray-600 mb-4">
              我们已经为你创建了个性化学习计划
            </p>
            <div className="card text-left mb-4">
              <h3 className="font-medium mb-2">你的学习计划：</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• 每日学习时间：{data.dailyMinutes} 分钟</li>
                <li>• 当前水平：{data.currentLevel === "zero" ? "零基础" : "初级"}</li>
                <li>• 学习目标：{data.goals.join("、") || "待定"}</li>
                <li>• 第一天：从字母和发音开始</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="page-container">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="h-2 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full bg-primary-500 transition-all"
            style={{
              width: `${((step + 1) / STEPS.length) * 100}%`,
            }}
          />
        </div>
        <div className="mt-1 text-right text-xs text-gray-500">
          {step + 1} / {STEPS.length}
        </div>
      </div>

      {/* Step Content */}
      <div className="mb-8">{renderStep()}</div>

      {/* Navigation Buttons */}
      <div className="flex gap-3">
        {step > 0 && (
          <button
            onClick={handlePrev}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            上一步
          </button>
        )}
        {step < STEPS.length - 1 ? (
          <button
            onClick={handleNext}
            className="flex-1 rounded-lg bg-primary-500 px-4 py-3 font-medium text-white transition-colors hover:bg-primary-600"
          >
            下一步
          </button>
        ) : (
          <button
            onClick={handleComplete}
            className="flex-1 rounded-lg bg-primary-500 px-4 py-3 font-medium text-white transition-colors hover:bg-primary-600"
          >
            开始学习
          </button>
        )}
      </div>

      {/* Skip */}
      {step < STEPS.length - 1 && (
        <button
          onClick={() => navigate("/")}
          className="mt-4 w-full text-center text-sm text-gray-500 hover:text-gray-700"
        >
          跳过，直接开始
        </button>
      )}
    </div>
  );
}
