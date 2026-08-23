/**
 * Shadowing Practice Page
 *
 * Provides a complete shadowing practice experience
 */

import { ShadowingPractice } from "./ShadowingPractice";
import type { ShadowingExercise, ShadowingResult, ShadowingPoint } from "@/engines/shadowing/v1";

// Default exercise for demonstration
const defaultExercise: ShadowingExercise = {
  id: "shadow_1",
  text: "Hello, how are you today?",
  translationChinese: "你好，你今天怎么样？",
  audioDurationMs: 2000,
  mode: "listen_repeat",
  shadowingPoints: [
    { startMs: 0, endMs: 500, text: "Hello" },
    { startMs: 600, endMs: 1200, text: "how are you" },
    { startMs: 1300, endMs: 1800, text: "today" },
  ] as ShadowingPoint[],
};

export default function ShadowingPracticePage() {
  const handleComplete = (result: ShadowingResult) => {
    console.log("Shadowing result:", result);
    // In production, this would save to IndexedDB
  };

  const handleSkip = () => {
    console.log("Exercise skipped");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          跟读练习 / Shadowing Practice
        </h1>
        <ShadowingPractice
          exercise={defaultExercise}
          onComplete={handleComplete}
          onSkip={handleSkip}
        />
      </div>
    </div>
  );
}
