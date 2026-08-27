/**
 * Conversation Practice Page
 *
 * Provides a complete conversation practice experience with AI tutor
 * Shows AI/Local status indicator
 */

import { ConversationPractice } from "./ConversationPractice";
import { isAIConfigured } from "@/services/ai-settings";
import { useNavigate } from "react-router-dom";

export default function ConversationPracticePage() {
  const navigate = useNavigate();
  const aiReady = isAIConfigured();

  const handleComplete = (score: number) => {
    console.log("Conversation score:", score);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              对话练习
            </h1>
            <p className="text-sm text-gray-500">Conversation Practice</p>
          </div>
          <div className="flex items-center gap-2">
            {aiReady ? (
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                🤖 AI 模式
              </span>
            ) : (
              <span
                className="cursor-pointer rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500 hover:bg-gray-200"
                onClick={() => navigate("/ai-settings")}
              >
                📋 本地模式 · 点击配置AI
              </span>
            )}
          </div>
        </div>
        <ConversationPractice
          level="A1"
          topic="daily-life"
          topicChinese="日常生活"
          onComplete={handleComplete}
        />
      </div>
    </div>
  );
}
