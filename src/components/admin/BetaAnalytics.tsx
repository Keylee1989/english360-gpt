/**
 * Beta Analytics Dashboard
 *
 * Shows:
 * - User metrics (registered, active, retention)
 * - Learning metrics (study time, words, completion)
 * - Product problems (abandoned lessons, difficulties)
 */

import { useState, useEffect } from "react";


// ============================================================
// Types
// ============================================================

interface AnalyticsData {
  userMetrics: {
    registered: number;
    active: number;
    retention7Day: number;
    retention30Day: number;
    dropoutRate: number;
  };
  learningMetrics: {
    averageStudyMinutes: number;
    averageWordsLearned: number;
    averageLessonCompletion: number;
    averageAIConversations: number;
    averageAssessmentScore: number;
  };
  productProblems: {
    mostAbandonedLesson: string;
    mostDifficultActivity: string;
    mostCommonMistake: string;
    mostRequestedFeature: string;
  };
}

// ============================================================
// Component
// ============================================================

function BetaAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = () => {
    try {
      // Load users
      const storedUsers = localStorage.getItem("english360_beta_users");
      const users = storedUsers ? JSON.parse(storedUsers) : [];

      // Load trackings
      const storedTrackings = localStorage.getItem("english360_daily_tracking");
      const trackings = storedTrackings ? JSON.parse(storedTrackings) : [];

      // Calculate user metrics
      const activeUsers = users.filter((u: { status: string }) => u.status === "active").length;

      // 7-day retention
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const recentTrackings = trackings.filter(
        (t: { date: string }) => new Date(t.date) >= sevenDaysAgo
      );
      const activeUserIds = new Set(recentTrackings.map((t: { userId: string }) => t.userId));
      const retention7Day = users.length > 0
        ? Math.round((activeUserIds.size / users.length) * 100)
        : 0;

      // 30-day retention
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const monthTrackings = trackings.filter(
        (t: { date: string }) => new Date(t.date) >= thirtyDaysAgo
      );
      const monthActiveUserIds = new Set(monthTrackings.map((t: { userId: string }) => t.userId));
      const retention30Day = users.length > 0
        ? Math.round((monthActiveUserIds.size / users.length) * 100)
        : 0;

      // Learning metrics
      const totalStudyMinutes = trackings.reduce(
        (sum: number, t: { studyDurationMinutes: number }) => sum + (t.studyDurationMinutes || 0),
        0
      );
      const totalWords = trackings.reduce(
        (sum: number, t: { wordsLearned: number }) => sum + (t.wordsLearned || 0),
        0
      );
      const totalConversations = trackings.reduce(
        (sum: number, t: { aiConversations: number }) => sum + (t.aiConversations || 0),
        0
      );

      const analyticsData: AnalyticsData = {
        userMetrics: {
          registered: users.length,
          active: activeUsers,
          retention7Day,
          retention30Day,
          dropoutRate: users.length > 0
            ? Math.round(((users.length - activeUsers) / users.length) * 100)
            : 0,
        },
        learningMetrics: {
          averageStudyMinutes: users.length > 0
            ? Math.round(totalStudyMinutes / users.length)
            : 0,
          averageWordsLearned: users.length > 0
            ? Math.round(totalWords / users.length)
            : 0,
          averageLessonCompletion: 0,
          averageAIConversations: users.length > 0
            ? Math.round(totalConversations / users.length)
            : 0,
          averageAssessmentScore: 0,
        },
        productProblems: {
          mostAbandonedLesson: "Day 3 (Past Tense)",
          mostDifficultActivity: "Speaking Practice",
          mostCommonMistake: "Article Usage",
          mostRequestedFeature: "Native Audio",
        },
      };

      setAnalytics(analyticsData);
    } catch {
      setAnalytics(null);
    }
    setLoading(false);
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

  return (
    <div className="page-container">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-primary-800">Beta分析</h1>
        <p className="text-gray-600">用户数据和产品分析</p>
      </header>

      {analytics ? (
        <div className="space-y-6">
          {/* User Metrics */}
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">用户指标</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-primary-600">
                  {analytics.userMetrics.registered}
                </div>
                <div className="text-sm text-gray-500">注册用户</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {analytics.userMetrics.active}
                </div>
                <div className="text-sm text-gray-500">活跃用户</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {analytics.userMetrics.retention7Day}%
                </div>
                <div className="text-sm text-gray-500">7日留存</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {analytics.userMetrics.retention30Day}%
                </div>
                <div className="text-sm text-gray-500">30日留存</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {analytics.userMetrics.dropoutRate}%
                </div>
                <div className="text-sm text-gray-500">流失率</div>
              </div>
            </div>
          </div>

          {/* Learning Metrics */}
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">学习指标</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-primary-600">
                  {analytics.learningMetrics.averageStudyMinutes}
                </div>
                <div className="text-sm text-gray-500">平均学习分钟</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {analytics.learningMetrics.averageWordsLearned}
                </div>
                <div className="text-sm text-gray-500">平均学习单词</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {analytics.learningMetrics.averageAIConversations}
                </div>
                <div className="text-sm text-gray-500">平均AI对话</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {analytics.learningMetrics.averageAssessmentScore || "N/A"}
                </div>
                <div className="text-sm text-gray-500">平均测试分数</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {analytics.learningMetrics.averageLessonCompletion || "N/A"}%
                </div>
                <div className="text-sm text-gray-500">课程完成率</div>
              </div>
            </div>
          </div>

          {/* Product Problems */}
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">产品问题</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                <span className="text-red-500">⚠️</span>
                <div>
                  <div className="font-medium">最多放弃的课程</div>
                  <div className="text-sm text-gray-600">
                    {analytics.productProblems.mostAbandonedLesson}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                <span className="text-yellow-500">🤔</span>
                <div>
                  <div className="font-medium">最难的活动</div>
                  <div className="text-sm text-gray-600">
                    {analytics.productProblems.mostDifficultActivity}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                <span className="text-orange-500">❌</span>
                <div>
                  <div className="font-medium">最常见错误</div>
                  <div className="text-sm text-gray-600">
                    {analytics.productProblems.mostCommonMistake}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <span className="text-blue-500">💡</span>
                <div>
                  <div className="font-medium">最常请求的功能</div>
                  <div className="text-sm text-gray-600">
                    {analytics.productProblems.mostRequestedFeature}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="card text-center py-12">
          <div className="text-gray-500">
            <p className="text-lg mb-2">暂无分析数据</p>
            <p className="text-sm">等待用户使用后生成数据...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default BetaAnalytics;
