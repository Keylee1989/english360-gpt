/**
 * AI Tutor v2 Tests
 */

import { describe, it, expect, beforeEach } from "vitest";
import { AITutorV2, MockLLMProvider, type ConversationContext } from "../index";

describe("AITutorV2", () => {
  let tutor: AITutorV2;
  const userId = "test_user";

  beforeEach(() => {
    tutor = new AITutorV2();
    tutor.registerProvider(new MockLLMProvider());
  });

  const mockContext: ConversationContext = {
    userId,
    level: "A1",
    topic: "greetings",
    vocabularyLevel: 30,
    grammarLevel: 25,
    weakAreas: ["listening", "speaking"],
    learnedWords: ["hello", "hi", "goodbye", "thank", "please"],
    recentErrors: [],
    interests: ["travel", "food"],
  };

  // ============================================================
  // Conversation Management
  // ============================================================

  describe("Conversation Management", () => {
    it("should start conversation", () => {
      tutor.setContext(userId, mockContext);
      const conversation = tutor.startConversation(userId, "greetings");

      expect(conversation).toBeDefined();
      expect(conversation.id).toBeTruthy();
      expect(conversation.messages.length).toBe(1); // System message
      expect(conversation.messages[0].role).toBe("system");
    });

    it("should end conversation", () => {
      tutor.setContext(userId, mockContext);
      tutor.startConversation(userId, "greetings");
      const ended = tutor.endConversation(userId);

      expect(ended).toBeDefined();
      expect(ended?.endTime).toBeDefined();
    });

    it("should get conversation", () => {
      tutor.setContext(userId, mockContext);
      tutor.startConversation(userId, "greetings");
      const conversation = tutor.getConversation(userId);

      expect(conversation).toBeDefined();
    });
  });

  // ============================================================
  // Chat Functionality
  // ============================================================

  describe("Chat", () => {
    it("should chat with tutor", async () => {
      tutor.setContext(userId, mockContext);
      tutor.startConversation(userId, "greetings");

      const response = await tutor.chat(userId, "Hello!");

      expect(response).toBeDefined();
      expect(response.message).toBeTruthy();
      expect(response.encouragement).toBeDefined();
      expect(response.nextPrompts).toBeDefined();
    });

    it("should detect grammar errors", async () => {
      tutor.setContext(userId, mockContext);
      tutor.startConversation(userId, "greetings");

      const response = await tutor.chat(userId, "i go yesterday shop");

      expect(response.correction).toBeDefined();
      expect(response.correction?.rule).toBeTruthy();
    });

    it("should suggest vocabulary", async () => {
      tutor.setContext(userId, mockContext);
      tutor.startConversation(userId, "greetings");

      const response = await tutor.chat(userId, "I like good food");

      expect(response.vocabulary).toBeDefined();
      expect(response.vocabulary!.length).toBeGreaterThan(0);
    });

    it("should throw for no conversation", async () => {
      await expect(tutor.chat("no_conversation", "Hello")).rejects.toThrow("No conversation found");
    });
  });

  // ============================================================
  // Context Management
  // ============================================================

  describe("Context Management", () => {
    it("should set context", () => {
      tutor.setContext(userId, mockContext);
      const context = tutor.getContext(userId);

      expect(context).toBeDefined();
      expect(context?.level).toBe("A1");
    });

    it("should use context in system prompt", () => {
      tutor.setContext(userId, mockContext);
      const conversation = tutor.startConversation(userId, "greetings");

      expect(conversation.messages[0].content).toContain("A1");
      expect(conversation.messages[0].content).toContain("greetings");
    });
  });

  // ============================================================
  // Mock Provider
  // ============================================================

  describe("Mock Provider", () => {
    it("should be available", () => {
      const mock = new MockLLMProvider();
      expect(mock.isAvailable()).toBe(true);
    });

    it("should respond to greetings", async () => {
      const mock = new MockLLMProvider();
      const response = await mock.chat([{ role: "user", content: "Hello!" }]);

      expect(response).toContain("Hello");
    });

    it("should respond to questions", async () => {
      const mock = new MockLLMProvider();
      const response = await mock.chat([{ role: "user", content: "How are you?" }]);

      expect(response).toBeTruthy();
    });
  });
});
