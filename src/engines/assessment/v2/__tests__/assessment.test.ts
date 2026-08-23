/**
 * Assessment Engine v2 Tests
 */

import { describe, it, expect, beforeEach } from "vitest";
import { AssessmentEngineV2, ASSESSMENT_CONFIGS } from "../index";

describe("AssessmentEngineV2", () => {
  let engine: AssessmentEngineV2;

  beforeEach(() => {
    engine = new AssessmentEngineV2();
  });

  describe("Assessment Configs", () => {
    it("should have assessments for Day 7, 14, and 30", () => {
      const assessments = engine.getAllAssessments();
      
      expect(assessments.length).toBe(3);
      expect(assessments.map(a => a.dayNumber)).toEqual([7, 14, 30]);
    });

    it("should get assessment by day number", () => {
      const day7 = engine.getAssessmentByDay(7);
      const day14 = engine.getAssessmentByDay(14);
      const day30 = engine.getAssessmentByDay(30);
      
      expect(day7).toBeTruthy();
      expect(day14).toBeTruthy();
      expect(day30).toBeTruthy();
      expect(day7?.title).toBe("Week 1 Assessment");
    });

    it("should return null for non-assessment day", () => {
      const day1 = engine.getAssessmentByDay(1);
      expect(day1).toBeNull();
    });
  });

  describe("Answer Evaluation", () => {
    it("should evaluate correct answers", () => {
      const question = {
        id: "q1",
        type: "multiple_choice" as const,
        prompt: "What does 'hello' mean?",
        correctAnswer: "你好",
        options: ["你好", "再见", "谢谢", "请"],
        points: 1,
      };

      const result = engine.evaluateAnswer(question, "你好");
      
      expect(result.correct).toBe(true);
      expect(result.score).toBe(1);
    });

    it("should evaluate incorrect answers", () => {
      const question = {
        id: "q1",
        type: "multiple_choice" as const,
        prompt: "What does 'hello' mean?",
        correctAnswer: "你好",
        options: ["你好", "再见", "谢谢", "请"],
        points: 1,
      };

      const result = engine.evaluateAnswer(question, "再见");
      
      expect(result.correct).toBe(false);
      expect(result.score).toBeLessThan(1);
    });

    it("should handle alternatives", () => {
      const question = {
        id: "q1",
        type: "text_input" as const,
        prompt: "Write the English word for '再见'",
        correctAnswer: "goodbye",
        alternatives: ["bye"],
        points: 1,
      };

      const result = engine.evaluateAnswer(question, "bye");
      
      expect(result.correct).toBe(true);
    });
  });

  describe("Section Evaluation", () => {
    it("should evaluate a complete section", () => {
      const section = {
        id: "vocab_7",
        type: "vocabulary" as const,
        title: "Vocabulary",
        titleChinese: "词汇测试",
        duration: 10,
        passingScore: 0.7,
        questions: [
          {
            id: "q1",
            type: "multiple_choice" as const,
            prompt: "What does 'hello' mean?",
            correctAnswer: "你好",
            options: ["你好", "再见"],
            points: 1,
          },
          {
            id: "q2",
            type: "multiple_choice" as const,
            prompt: "What does 'thank' mean?",
            correctAnswer: "谢谢",
            options: ["对不起", "谢谢"],
            points: 1,
          },
        ],
      };

      const answers = {
        q1: "你好",
        q2: "谢谢",
      };

      const result = engine.evaluateSection(section, answers);
      
      expect(result.correctAnswers).toBe(2);
      expect(result.totalQuestions).toBe(2);
      expect(result.score).toBe(1);
    });
  });

  describe("Result Generation", () => {
    it("should generate assessment result", () => {
      const assessment = ASSESSMENT_CONFIGS[0]; // Day 7
      
      const sectionResults = [
        { sectionId: "vocab_7", score: 0.8, correctAnswers: 4, totalQuestions: 5, timeSpent: 600 },
        { sectionId: "grammar_7", score: 0.75, correctAnswers: 3, totalQuestions: 4, timeSpent: 600 },
        { sectionId: "listening_7", score: 1, correctAnswers: 1, totalQuestions: 1, timeSpent: 600 },
      ];

      const result = engine.generateResult(assessment, sectionResults);
      
      expect(result.overallScore).toBeGreaterThan(70);
      expect(result.passed).toBe(true);
      expect(result.strengths.length).toBeGreaterThan(0);
    });

    it("should identify weaknesses", () => {
      const assessment = ASSESSMENT_CONFIGS[0];
      
      const sectionResults = [
        { sectionId: "vocab_7", score: 0.5, correctAnswers: 2, totalQuestions: 5, timeSpent: 600 },
        { sectionId: "grammar_7", score: 0.5, correctAnswers: 2, totalQuestions: 4, timeSpent: 600 },
      ];

      const result = engine.generateResult(assessment, sectionResults);
      
      expect(result.weaknesses.length).toBeGreaterThan(0);
      expect(result.recommendations.length).toBeGreaterThan(0);
    });
  });
});
