/**
 * Pronunciation Practice Page
 *
 * Provides a complete pronunciation practice experience
 */

import { PronunciationPractice } from "./PronunciationPractice";
import type { PronunciationAnalysisV4 } from "@/engines/pronunciation/v4";

// Default word for demonstration
const defaultWord = {
  targetWord: "hello",
  targetIPA: "/həˈloʊ/",
  chineseMeaning: "你好",
};

export default function PronunciationPracticePage() {
  const handleComplete = (analysis: PronunciationAnalysisV4) => {
    console.log("Pronunciation analysis:", analysis);
    // In production, this would save to IndexedDB
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          发音练习 / Pronunciation Practice
        </h1>
        <PronunciationPractice
          targetWord={defaultWord.targetWord}
          targetIPA={defaultWord.targetIPA}
          chineseMeaning={defaultWord.chineseMeaning}
          onComplete={handleComplete}
        />
      </div>
    </div>
  );
}
