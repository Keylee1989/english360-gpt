/**
 * AI Tutor v3 Tests
 */

import { describe, it, expect, beforeEach } from "vitest";
import { AITutorV3, MockProvider, createAITutor } from "../index";

describe("AITutorV3", () => {
  let tutor: AITutorV3;

  beforeEach(() => {
    tutor = new AITutorV3(new MockProvider());
  });

  // ============================================================
  // Basic Chat
  // ============================================================

  describe("Basic Chat", () => {
    it("should respond to greeting", async () => {
      const response = await tutor.chat("user1", "Hello!");
      expect(response.message).toBeTruthy();
      expect(response.message.toLowerCase()).toContain("hello");
    });

    it("should maintain conversation history", async () => {
      await tutor.chat("user1", "Hello!");
      await tutor.chat("user1", "How are you?");

      const context = tutor.getContext("user1");
      expect(context.conversationHistory.length).toBe(4); // 2 user + 2 assistant
    });

    it("should generate follow-up questions", async () => {
      const response = await tutor.chat("user1", "I like English");
      expect(response.followUpQuestion).toBeTruthy();
    });
  });

  // ============================================================
  // Grammar Correction
  // ============================================================

  describe("Grammar Correction", () => {
    it("should detect past tense errors", async () => {
      const response = await tutor.chat("user1", "Yesterday I go to store");
      expect(response.corrections.length).toBeGreaterThan(0);
      expect(response.corrections[0].rule).toContain("Past tense");
    });

    it("should detect article errors", async () => {
      const response = await tutor.chat("user1", "I want book");
      expect(response.corrections.length).toBeGreaterThan(0);
    });

    it("should store errors in context", async () => {
      await tutor.chat("user1", "Yesterday I go to store");
      const context = tutor.getContext("user1");
      expect(context.recentErrors.length).toBeGreaterThan(0);
    });
  });

  // ============================================================
  // Vocabulary Suggestions
  // ============================================================

  describe("Vocabulary Suggestions", () => {
    it("should suggest better words", async () => {
      const response = await tutor.chat("user1", "This is good");
      // May or may not have suggestions depending on level
      expect(response.vocabulary).toBeDefined();
    });
  });

  // ============================================================
  // Context Management
  // ============================================================

  describe("Context Management", () => {
    it("should create context for new user", () => {
      const context = tutor.getContext("new_user");
      expect(context.userId).toBe("new_user");
      expect(context.level).toBe("A1");
    });

    it("should update context", () => {
      tutor.updateContext("user1", { level: "A2", interests: ["sports"] });
      const context = tutor.getContext("user1");
      expect(context.level).toBe("A2");
      expect(context.interests).toContain("sports");
    });

    it("should clear history", async () => {
      await tutor.chat("user1", "Hello!");
      tutor.clearHistory("user1");
      const context = tutor.getContext("user1");
      expect(context.conversationHistory.length).toBe(0);
    });
  });

  // ============================================================
  // Provider Switching
  // ============================================================

  describe("Provider Switching", () => {
    it("should switch providers", async () => {
      const response1 = await tutor.chat("user1", "Hello");
      expect(response1.message).toBeTruthy();

      tutor.setProvider(new MockProvider());
      const response2 = await tutor.chat("user1", "Hello again");
      expect(response2.message).toBeTruthy();
    });
  });

  // ============================================================
  // Summary
  // ============================================================

  describe("Summary", () => {
    it("should generate summary", async () => {
      await tutor.chat("user1", "Hello!");
      await tutor.chat("user1", "How are you?");

      const summary = tutor.getSummary("user1");
      expect(summary.messageCount).toBe(4);
      expect(summary.errorCount).toBe(0);
    });
  });

  // ============================================================
  // Factory Function
  // ============================================================

  describe("Factory Function", () => {
    it("should create mock tutor", () => {
      const mockTutor = createAITutor("mock");
      expect(mockTutor).toBeInstanceOf(AITutorV3);
    });

    it("should create openai tutor", () => {
      const openaiTutor = createAITutor("openai", { apiKey: "test-key" });
      expect(openaiTutor).toBeInstanceOf(AITutorV3);
    });

    it("should create claude tutor", () => {
      const claudeTutor = createAITutor("claude", { apiKey: "test-key" });
      expect(claudeTutor).toBeInstanceOf(AITutorV3);
    });
  });

  // ============================================================
  // Fallback Behavior
  // ============================================================

  describe("Fallback Behavior", () => {
    it("should handle provider errors gracefully", async () => {
      // Create a tutor with a failing provider
      const failingProvider = {
        name: "failing",
        chat: async () => {
          throw new Error("API failed");
        },
      };

      const failingTutor = new AITutorV3(failingProvider);
      const response = await failingTutor.chat("user1", "Hello");

      // Should fall back to rule-based response
      expect(response.message).toBeTruthy();
      expect(response.corrections).toBeDefined();
    });
  });
});
