/**
 * Beta Dashboard Component
 *
 * Shows:
 * - User list with status
 * - User details
 * - Learning progress
 * - Risk status
 */

import { useState, useEffect } from "react";
import { BetaProductionSystem } from "@/engines/beta-production/v1";

// ============================================================
// Types
// ============================================================

interface BetaUser {
  id: string;
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  location: string;
  englishLevel: "zero" | "beginner" | "elementary" | "intermediate";
  goal: string;
  dailyAvailableMinutes: number;
  registeredAt: number;
  lastActiveAt: number;
  status: "active" | "inactive" | "completed";
}

interface UserProgress {
  totalStudyMinutes: number;
  totalWordsLearned: number;
  averageAccuracy: number;
  currentStreak: number;
  daysActive: number;
}

// ============================================================
// Component
// ============================================================

function BetaDashboard() {
  const [users, setUsers] = useState<BetaUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<BetaUser | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  const betaSystem = new BetaProductionSystem();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    try {
      const stored = localStorage.getItem("english360_beta_users");
      const loadedUsers = stored ? JSON.parse(stored) : [];
      setUsers(loadedUsers);
    } catch {
      setUsers([]);
    }
    setLoading(false);
  };

  const handleSelectUser = (user: BetaUser) => {
    setSelectedUser(user);
    const progress = betaSystem.getUserProgress(user.id);
    setUserProgress(progress);
  };

  const getRiskStatus = (user: BetaUser): "low" | "medium" | "high" => {
    const daysSinceActive = Math.floor(
      (Date.now() - user.lastActiveAt) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceActive <= 1) return "low";
    if (daysSinceActive <= 3) return "medium";
    return "high";
  };

  const getRiskColor = (risk: string): string => {
    switch (risk) {
      case "low": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "high": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "inactive": return "bg-gray-100 text-gray-800";
      case "completed": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString("zh-CN");
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
        <h1 className="text-2xl font-bold text-primary-800">Beta用户管理</h1>
        <p className="text-gray-600">管理测试用户和查看学习数据</p>
      </header>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary-600">{users.length}</div>
          <div className="text-xs text-gray-500">总用户</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600">
            {users.filter(u => u.status === "active").length}
          </div>
          <div className="text-xs text-gray-500">活跃用户</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {users.filter(u => getRiskStatus(u) === "medium").length}
          </div>
          <div className="text-xs text-gray-500">风险用户</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-red-600">
            {users.filter(u => getRiskStatus(u) === "high").length}
          </div>
          <div className="text-xs text-gray-500">流失风险</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User List */}
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">用户列表</h2>

            {users.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>暂无测试用户</p>
                <p className="text-sm">等待用户注册...</p>
              </div>
            ) : (
              <div className="space-y-3">
                {users.map((user) => {
                  const risk = getRiskStatus(user);
                  return (
                    <div
                      key={user.id}
                      onClick={() => handleSelectUser(user)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedUser?.id === user.id
                          ? "bg-primary-50 border-2 border-primary-500"
                          : "bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-gray-500">
                            {user.age}岁 · {user.englishLevel} · {user.location}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-xs ${getStatusColor(user.status)}`}>
                            {user.status === "active" ? "活跃" : user.status === "inactive" ? "不活跃" : "完成"}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs ${getRiskColor(risk)}`}>
                            {risk === "low" ? "低风险" : risk === "medium" ? "中风险" : "高风险"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* User Detail */}
        <div className="lg:col-span-1">
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">用户详情</h2>

            {selectedUser ? (
              <div className="space-y-4">
                {/* Basic Info */}
                <div>
                  <h3 className="font-medium mb-2">{selectedUser.name}</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>年龄：{selectedUser.age}岁</p>
                    <p>性别：{selectedUser.gender === "male" ? "男" : "女"}</p>
                    <p>地区：{selectedUser.location}</p>
                    <p>英语水平：{selectedUser.englishLevel}</p>
                    <p>学习目标：{selectedUser.goal}</p>
                    <p>每日可用时间：{selectedUser.dailyAvailableMinutes}分钟</p>
                  </div>
                </div>

                {/* Progress */}
                {userProgress && (
                  <div>
                    <h3 className="font-medium mb-2">学习进度</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-gray-50 p-2 rounded">
                        <div className="text-lg font-bold text-primary-600">
                          {userProgress.totalWordsLearned}
                        </div>
                        <div className="text-gray-500">已学单词</div>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <div className="text-lg font-bold text-primary-600">
                          {userProgress.currentStreak}
                        </div>
                        <div className="text-gray-500">连续天数</div>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <div className="text-lg font-bold text-primary-600">
                          {userProgress.daysActive}
                        </div>
                        <div className="text-gray-500">学习天数</div>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <div className="text-lg font-bold text-primary-600">
                          {userProgress.averageAccuracy}%
                        </div>
                        <div className="text-gray-500">平均正确率</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Dates */}
                <div>
                  <h3 className="font-medium mb-2">时间信息</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>注册时间：{formatDate(selectedUser.registeredAt)}</p>
                    <p>最后活跃：{formatDate(selectedUser.lastActiveAt)}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>选择用户查看详情</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BetaDashboard;
