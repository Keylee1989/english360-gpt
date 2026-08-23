/**
 * Beta Testing Mode Component
 *
 * Features:
 * - Beta user identification
 * - Feedback collection
 * - Bug reporting
 * - Daily experience survey
 */

import { useState } from "react";

// ============================================================
// Types
// ============================================================

interface BetaTestConfig {
  userId: string;
  startDate: string;
  currentDay: number;
}

interface DailySurvey {
  studyDuration: number;
  completedTasks: string[];
  difficultyRating: number;
  confusingPoints: string;
  satisfaction: number;
  wantToContinue: boolean;
}

interface BugReport {
  type: "bug" | "suggestion" | "question";
  description: string;
  screenshot?: string;
}

// ============================================================
// Storage
// ============================================================

const STORAGE_KEY = "english360_beta_config";
const SURVEY_KEY = "english360_beta_surveys";
const BUGS_KEY = "english360_beta_bugs";

function loadConfig(): BetaTestConfig | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function saveConfig(config: BetaTestConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.error("Failed to save beta config:", e);
  }
}

function loadSurveys(): DailySurvey[] {
  try {
    const stored = localStorage.getItem(SURVEY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveSurvey(survey: DailySurvey): void {
  try {
    const surveys = loadSurveys();
    surveys.push(survey);
    localStorage.setItem(SURVEY_KEY, JSON.stringify(surveys));
  } catch (e) {
    console.error("Failed to save survey:", e);
  }
}

function saveBugReport(report: BugReport): void {
  try {
    const stored = localStorage.getItem(BUGS_KEY);
    const bugs = stored ? JSON.parse(stored) : [];
    bugs.push({ ...report, timestamp: Date.now() });
    localStorage.setItem(BUGS_KEY, JSON.stringify(bugs));
  } catch (e) {
    console.error("Failed to save bug report:", e);
  }
}

// ============================================================
// Component
// ============================================================

function BetaTestingMode({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<BetaTestConfig | null>(loadConfig);
  const [showSurvey, setShowSurvey] = useState(false);
  const [showBugReport, setShowBugReport] = useState(false);
  const [surveySubmitted, setSurveySubmitted] = useState(false);

  // Survey state
  const [studyDuration, setStudyDuration] = useState(0);
  const [completedTasks] = useState<string[]>([]);
  const [difficultyRating, setDifficultyRating] = useState(3);
  const [confusingPoints, setConfusingPoints] = useState("");
  const [satisfaction, setSatisfaction] = useState(3);
  const [wantToContinue, setWantToContinue] = useState(true);

  // Bug report state
  const [bugType, setBugType] = useState<"bug" | "suggestion" | "question">("bug");
  const [bugDescription, setBugDescription] = useState("");

  // Initialize beta config if not exists
  const initBetaConfig = () => {
    const newConfig: BetaTestConfig = {
      userId: `beta_${Date.now()}`,
      startDate: new Date().toISOString().split("T")[0],
      currentDay: 1,
    };
    saveConfig(newConfig);
    setConfig(newConfig);
  };

  // Handle survey submit
  const handleSurveySubmit = () => {
    const survey: DailySurvey = {
      studyDuration,
      completedTasks,
      difficultyRating,
      confusingPoints,
      satisfaction,
      wantToContinue,
    };

    saveSurvey(survey);
    setSurveySubmitted(true);

    // Update day count
    if (config) {
      const updatedConfig = { ...config, currentDay: config.currentDay + 1 };
      saveConfig(updatedConfig);
      setConfig(updatedConfig);
    }

    setTimeout(() => {
      setShowSurvey(false);
      setSurveySubmitted(false);
    }, 2000);
  };

  // Handle bug report submit
  const handleBugReportSubmit = () => {
    const report: BugReport = {
      type: bugType,
      description: bugDescription,
    };

    saveBugReport(report);
    setShowBugReport(false);
    setBugDescription("");
  };

  return (
    <div className="relative">
      {children}

      {/* Beta Testing Header */}
      {config && (
        <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-white text-center py-1 text-xs z-50">
          🧪 Beta测试模式 · Day {config.currentDay} · 
          <button
            onClick={() => setShowSurvey(true)}
            className="underline ml-2"
          >
            提交反馈
          </button>
          <button
            onClick={() => setShowBugReport(true)}
            className="underline ml-2"
          >
            报告问题
          </button>
        </div>
      )}

      {/* No Config - Show Setup */}
      {!config && (
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={initBetaConfig}
            className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm"
          >
            🧪 加入Beta测试
          </button>
        </div>
      )}

      {/* Daily Survey Modal */}
      {showSurvey && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {surveySubmitted ? (
              <div className="p-8 text-center">
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-xl font-bold mb-2">感谢反馈！</h3>
                <p className="text-gray-600">你的反馈对我们非常重要</p>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold">每日反馈</h3>

                {/* Study Duration */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    今天学习了多少分钟？
                  </label>
                  <input
                    type="number"
                    value={studyDuration}
                    onChange={(e) => setStudyDuration(Number(e.target.value))}
                    className="w-full border rounded-lg px-3 py-2"
                    min={0}
                  />
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    今天的学习难度如何？
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setDifficultyRating(rating)}
                        className={`flex-1 py-2 rounded ${
                          difficultyRating === rating
                            ? "bg-primary-500 text-white"
                            : "bg-gray-100"
                        }`}
                      >
                        {rating}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>很简单</span>
                    <span>很难</span>
                  </div>
                </div>

                {/* Confusing Points */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    有什么让你困惑的吗？
                  </label>
                  <textarea
                    value={confusingPoints}
                    onChange={(e) => setConfusingPoints(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2"
                    rows={2}
                    placeholder="例如：某个单词的发音、语法规则..."
                  />
                </div>

                {/* Satisfaction */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    今天的满意度？
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setSatisfaction(rating)}
                        className={`flex-1 py-2 rounded ${
                          satisfaction === rating
                            ? "bg-primary-500 text-white"
                            : "bg-gray-100"
                        }`}
                      >
                        {rating === 1 ? "😞" : rating === 2 ? "😐" : rating === 3 ? "🙂" : rating === 4 ? "😊" : "🤩"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Want to Continue */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    明天想继续学习吗？
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setWantToContinue(true)}
                      className={`flex-1 py-2 rounded ${
                        wantToContinue ? "bg-green-500 text-white" : "bg-gray-100"
                      }`}
                    >
                      想继续 👍
                    </button>
                    <button
                      onClick={() => setWantToContinue(false)}
                      className={`flex-1 py-2 rounded ${
                        !wantToContinue ? "bg-red-500 text-white" : "bg-gray-100"
                      }`}
                    >
                      不想 😔
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4">
                  <button
                    onClick={() => setShowSurvey(false)}
                    className="flex-1 py-2 border rounded-lg"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleSurveySubmit}
                    className="flex-1 py-2 bg-primary-500 text-white rounded-lg"
                  >
                    提交
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bug Report Modal */}
      {showBugReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 space-y-4">
              <h3 className="text-xl font-bold">报告问题</h3>

              {/* Bug Type */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  问题类型
                </label>
                <div className="flex gap-2">
                  {(["bug", "suggestion", "question"] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setBugType(type)}
                      className={`flex-1 py-2 rounded ${
                        bugType === type
                          ? "bg-primary-500 text-white"
                          : "bg-gray-100"
                      }`}
                    >
                      {type === "bug" ? "🐛 Bug" : type === "suggestion" ? "💡 建议" : "❓ 问题"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  详细描述
                </label>
                <textarea
                  value={bugDescription}
                  onChange={(e) => setBugDescription(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                  rows={4}
                  placeholder="请详细描述你遇到的问题..."
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => setShowBugReport(false)}
                  className="flex-1 py-2 border rounded-lg"
                >
                  取消
                </button>
                <button
                  onClick={handleBugReportSubmit}
                  className="flex-1 py-2 bg-primary-500 text-white rounded-lg"
                  disabled={!bugDescription.trim()}
                >
                  提交
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BetaTestingMode;
