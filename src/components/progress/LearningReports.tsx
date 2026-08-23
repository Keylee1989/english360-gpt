/**
 * Learning Reports Component
 *
 * Displays:
 * - Progress reports at milestones (Day 7, 30, 90)
 * - Skill breakdown
 * - Recommendations
 * - Learning trends
 */

import { useState, useEffect } from "react";

// ============================================================
// Types
// ============================================================

interface LearningReport {
  day: number;
  date: string;
  vocabularyScore: number;
  listeningScore: number;
  speakingScore: number;
  readingScore: number;
  writingScore: number;
  grammarScore: number;
  overallScore: number;
  wordsLearned: number;
  wordsMastered: number;
  studyMinutes: number;
  streak: number;
  strength: string;
  weakness: string;
  recommendations: string[];
}

interface LearningReportsProps {
  currentDay: number;
}

// ============================================================
// Storage
// ============================================================

const STORAGE_KEY = "english360_learning_reports";

function loadReports(): LearningReport[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveReport(report: LearningReport): void {
  try {
    const reports = loadReports();
    reports.push(report);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  } catch (e) {
    console.error("Failed to save report:", e);
  }
}

// ============================================================
// Component
// ============================================================

export default function LearningReports({ currentDay }: LearningReportsProps) {
  const [reports, setReports] = useState<LearningReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<LearningReport | null>(null);

  useEffect(() => {
    setReports(loadReports());
  }, []);

  // Generate milestone reports
  const milestones = [7, 30, 90, 180, 360];
  const availableMilestones = milestones.filter((m) => m <= currentDay);

  const getScoreColor = (score: number): string => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-blue-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBar = (score: number): string => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-blue-500";
    if (score >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  const generateReport = (day: number): LearningReport => {
    // Generate simulated report based on day
    const baseScore = Math.min(90, 30 + day * 0.5);
    const variance = () => Math.random() * 20 - 10;

    const vocabularyScore = Math.min(100, Math.max(0, baseScore + variance()));
    const listeningScore = Math.min(100, Math.max(0, baseScore - 5 + variance()));
    const speakingScore = Math.min(100, Math.max(0, baseScore - 10 + variance()));
    const readingScore = Math.min(100, Math.max(0, baseScore + variance()));
    const writingScore = Math.min(100, Math.max(0, baseScore - 8 + variance()));
    const grammarScore = Math.min(100, Math.max(0, baseScore + variance()));

    const overallScore = Math.round(
      (vocabularyScore + listeningScore + speakingScore + readingScore + writingScore + grammarScore) / 6
    );

    const scores = {
      vocabulary: vocabularyScore,
      listening: listeningScore,
      speaking: speakingScore,
      reading: readingScore,
      writing: writingScore,
      grammar: grammarScore,
    };

    const strength = Object.entries(scores).reduce((a, b) => (a[1] > b[1] ? a : b))[0];
    const weakness = Object.entries(scores).reduce((a, b) => (a[1] < b[1] ? a : b))[0];

    const recommendations: string[] = [];
    if (listeningScore < 60) recommendations.push("增加听力练习时间，每天至少30分钟");
    if (speakingScore < 60) recommendations.push("增加口语练习，每天至少20分钟跟读");
    if (vocabularyScore < 60) recommendations.push("复习已学单词，使用SRS系统");
    if (writingScore < 60) recommendations.push("每天写3-5个句子练习写作");

    const report: LearningReport = {
      day,
      date: new Date().toISOString().split("T")[0],
      vocabularyScore: Math.round(vocabularyScore),
      listeningScore: Math.round(listeningScore),
      speakingScore: Math.round(speakingScore),
      readingScore: Math.round(readingScore),
      writingScore: Math.round(writingScore),
      grammarScore: Math.round(grammarScore),
      overallScore,
      wordsLearned: Math.min(day * 10, 300),
      wordsMastered: Math.min(day * 3, 100),
      studyMinutes: day * 240,
      streak: day,
      strength,
      weakness,
      recommendations,
    };

    saveReport(report);
    return report;
  };

  const handleGenerateReport = (day: number) => {
    const report = generateReport(day);
    setReports((prev) => [...prev, report]);
    setSelectedReport(report);
  };

  const getSkillName = (skill: string): string => {
    const names: Record<string, string> = {
      vocabulary: "词汇",
      listening: "听力",
      speaking: "口语",
      reading: "阅读",
      writing: "写作",
      grammar: "语法",
    };
    return names[skill] || skill;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-primary-800">学习报告</h2>
        <p className="text-gray-600">查看你的学习进度和效果</p>
      </div>

      {/* Milestone Reports */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">里程碑报告</h3>
        <div className="space-y-2">
          {availableMilestones.map((milestone) => (
            <button
              key={milestone}
              onClick={() => handleGenerateReport(milestone)}
              className="w-full flex items-center justify-between rounded-lg bg-gray-50 p-3 hover:bg-gray-100"
            >
              <div className="text-left">
                <div className="font-medium">Day {milestone} 报告</div>
                <div className="text-sm text-gray-500">
                  {milestone === 7 && "第一周总结"}
                  {milestone === 30 && "第一个月总结"}
                  {milestone === 90 && "第三个月总结"}
                  {milestone === 180 && "半年总结"}
                  {milestone === 360 && "全年总结"}
                </div>
              </div>
              <span className="text-primary-500">→</span>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Report */}
      {selectedReport && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">
            Day {selectedReport.day} 学习报告
          </h3>

          {/* Overall Score */}
          <div className="text-center mb-6">
            <div className={`text-5xl font-bold ${getScoreColor(selectedReport.overallScore)}`}>
              {selectedReport.overallScore}
            </div>
            <div className="text-gray-600">总分</div>
          </div>

          {/* Skill Breakdown */}
          <div className="space-y-3 mb-6">
            {[
              { key: "vocabulary", score: selectedReport.vocabularyScore },
              { key: "listening", score: selectedReport.listeningScore },
              { key: "speaking", score: selectedReport.speakingScore },
              { key: "reading", score: selectedReport.readingScore },
              { key: "writing", score: selectedReport.writingScore },
              { key: "grammar", score: selectedReport.grammarScore },
            ].map(({ key, score }) => (
              <div key={key}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{getSkillName(key)}</span>
                  <span className={getScoreColor(score)}>{score}/100</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getScoreBar(score)} transition-all`}
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-primary-600">
                {selectedReport.wordsLearned}
              </div>
              <div className="text-sm text-gray-500">已学单词</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-primary-600">
                {selectedReport.wordsMastered}
              </div>
              <div className="text-sm text-gray-500">已掌握</div>
            </div>
          </div>

          {/* Strength & Weakness */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-green-500">💪</span>
              <span className="font-medium">优势：{getSkillName(selectedReport.strength)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-yellow-500">📈</span>
              <span className="font-medium">待提升：{getSkillName(selectedReport.weakness)}</span>
            </div>
          </div>

          {/* Recommendations */}
          {selectedReport.recommendations.length > 0 && (
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">建议</h4>
              <ul className="space-y-2">
                {selectedReport.recommendations.map((rec, idx) => (
                  <li key={idx} className="text-sm text-blue-700 flex items-start gap-2">
                    <span>•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Report History */}
      {reports.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">历史报告</h3>
          <div className="space-y-2">
            {reports.slice(-5).reverse().map((report, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedReport(report)}
                className="w-full flex items-center justify-between rounded-lg bg-gray-50 p-3 hover:bg-gray-100"
              >
                <div className="text-left">
                  <div className="font-medium">Day {report.day}</div>
                  <div className="text-sm text-gray-500">{report.date}</div>
                </div>
                <div className={`text-lg font-bold ${getScoreColor(report.overallScore)}`}>
                  {report.overallScore}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
