/**
 * Conversation Practice Page
 *
 * Provides a complete conversation practice experience with AI tutor
 */

import { ConversationPractice } from "./ConversationPractice";
import type { LearnerContext } from "@/engines/ai-tutor/v1";

// Default context for demonstration
const defaultContext: LearnerContext = {
  userId: "demo_user",
  level: "A1",
  vocabularyLevel: 30,
  grammarLevel: 30,
  weakAreas: ["speaking"],
  strongAreas: [],
  recentTopics: [],
};

export default function ConversationPracticePage() {
  const handleComplete = (score: number) => {
    console.log("Conversation score:", score);
    // In production, this would save to IndexedDB
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          对话练习 / Conversation Practice
        </h1>
        <ConversationPractice
          level="A1"
          topic="daily-life"
          topicChinese="日常生活"
          context={defaultContext}
          onComplete={handleComplete}
        />
      </div>
    </div>
  );
}
