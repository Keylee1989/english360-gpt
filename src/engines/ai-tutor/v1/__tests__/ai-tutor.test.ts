/**
 * AI Tutor v1 Tests
 */

import { describe, it, expect, beforeEach } from "vitest";
import { AITutorV1, RuleBasedTutorProvider, type LearnerContext } from "../index";

describe("AITutorV1", () => {
  let tutor: AITutorV1;
  let mockContext: LearnerContext;

  beforeEach(() => {
    tutor = new AITutorV1();
    mockContext = {
      userId: "test_user",
      level: "A1",
      recentTopics: ["greetings"],
      vocabularyLevel: 30,
      grammarLevel: 25,
      weakAreas: ["listening", "speaking"],
      strongAreas: ["vocabulary"],
    };
  });

  // ============================================================
  // Session Management
  // ============================================================

  describe("Session Management", () => {
    it("should start a new tutoring session", () => {
      const session = tutor.startSession("A1", "greetings", "问候");

      expect(session).toBeDefined();
      expect(session.id).toBeTruthy();
      expect(session.level).toBe("A1");
      expect(session.topic).toBe("greetings");
      expect(session.topicChinese).toBe("问候");
      expect(session.messages.length).toBe(0);
    });

    it("should get session by ID", () => {
      const session = tutor.startSession("A1", "greetings", "问候");
      const retrieved = tutor.getSession(session.id);

      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe(session.id);
    });

    it("should get all sessions", () => {
      tutor.startSession("A1", "greetings", "问候");
      tutor.startSession("A2", "shopping", "购物");

      const sessions = tutor.getAllSessions();
      expect(sessions.length).toBeGreaterThanOrEqual(1);
    });

    it("should end session", () => {
      const session = tutor.startSession("A1", "greetings", "问候");
      const ended = tutor.endSession(session.id);

      expect(ended).toBeDefined();
      expect(ended?.endTime).toBeDefined();
    });
  });

  // ============================================================
  // Chat Functionality
  // ============================================================

  describe("Chat", () => {
    it("should chat with tutor", async () => {
      const session = tutor.startSession("A1", "greetings", "问候");

      const response = await tutor.chat(session.id, "Hello!", mockContext);

      expect(response).toBeDefined();
      expect(response.message).toBeDefined();
      expect(response.message.role).toBe("tutor");
      expect(response.message.content).toBeTruthy();
      expect(response.analysis).toBeDefined();
      expect(response.nextPrompts.length).toBeGreaterThan(0);
    });

    it("should handle multiple messages", async () => {
      const session = tutor.startSession("A1", "greetings", "问候");

      await tutor.chat(session.id, "Hello!", mockContext);
      await tutor.chat(session.id, "How are you?", mockContext);
      const response = await tutor.chat(session.id, "I am fine.", mockContext);

      expect(response).toBeDefined();
      const tutorSession = tutor.getSession(session.id);
      expect(tutorSession?.messages.length).toBe(6); // 3 learner + 3 tutor
    });

    it("should throw for non-existent session", async () => {
      await expect(
        tutor.chat("non_existent", "Hello!", mockContext)
      ).rejects.toThrow("Session not found");
    });
  });

  // ============================================================
  // Message Analysis
  // ============================================================

  describe("Message Analysis", () => {
    it("should analyze learner message", async () => {
      const session = tutor.startSession("A1", "greetings", "问候");

      const response = await tutor.chat(session.id, "I want to learn English.", mockContext);

      expect(response.analysis).toBeDefined();
      expect(response.analysis.grammarScore).toBeGreaterThanOrEqual(0);
      expect(response.analysis.grammarScore).toBeLessThanOrEqual(1);
      expect(response.analysis.vocabularyScore).toBeGreaterThanOrEqual(0);
      expect(response.analysis.vocabularyScore).toBeLessThanOrEqual(1);
      expect(response.analysis.fluencyScore).toBeGreaterThanOrEqual(0);
      expect(response.analysis.fluencyScore).toBeLessThanOrEqual(1);
    });

    it("should detect grammar errors", async () => {
      const session = tutor.startSession("A1", "greetings", "问候");

      const response = await tutor.chat(session.id, "I want book.", mockContext);

      expect(response.analysis.errors.length).toBeGreaterThan(0);
    });

    it("should provide suggestions", async () => {
      const session = tutor.startSession("A1", "greetings", "问候");

      const response = await tutor.chat(session.id, "Hi", mockContext);

      expect(response.analysis.suggestions.length).toBeGreaterThan(0);
    });
  });

  // ============================================================
  // Tutor Response Generation
  // ============================================================

  describe("Response Generation", () => {
    it("should generate greeting response", async () => {
      const session = tutor.startSession("A1", "greetings", "问候");

      const response = await tutor.chat(session.id, "Hello!", mockContext);

      expect(response.message.content).toBeTruthy();
    });

    it("should generate question response", async () => {
      const session = tutor.startSession("A1", "greetings", "问候");

      const response = await tutor.chat(session.id, "What is your name?", mockContext);

      expect(response.message.content).toBeTruthy();
    });

    it("should generate encouragement", async () => {
      const session = tutor.startSession("A1", "greetings", "问候");

      const response = await tutor.chat(session.id, "Hello!", mockContext);

      expect(response.message.encouragement).toBeDefined();
    });

    it("should generate vocabulary suggestions", async () => {
      const session = tutor.startSession("A1", "greetings", "问候");

      const response = await tutor.chat(session.id, "Hello!", mockContext);

      expect(response.message.vocabularySuggestions).toBeDefined();
    });
  });

  // ============================================================
  // Provider System
  // ============================================================

  describe("Provider System", () => {
    it("should use rule-based provider by default", async () => {
      const session = tutor.startSession("A1", "greetings", "问候");

      const response = await tutor.chat(session.id, "Hello!", mockContext);

      expect(response.message.content).toBeTruthy();
    });

    it("should register custom provider", async () => {
      const customProvider = new RuleBasedTutorProvider();
      tutor.registerProvider(customProvider);

      const session = tutor.startSession("A1", "greetings", "问候");
      const response = await tutor.chat(session.id, "Hello!", mockContext);

      expect(response.message.content).toBeTruthy();
    });
  });

  // ============================================================
  // Score Tracking
  // ============================================================

  describe("Score Tracking", () => {
    it("should track session score", async () => {
      const session = tutor.startSession("A1", "greetings", "问候");

      await tutor.chat(session.id, "Hello!", mockContext);
      await tutor.chat(session.id, "How are you?", mockContext);

      const tutorSession = tutor.getSession(session.id);
      expect(tutorSession?.score.overall).toBeGreaterThanOrEqual(0);
      expect(tutorSession?.score.overall).toBeLessThanOrEqual(1);
    });

    it("should calculate improvement", async () => {
      const session = tutor.startSession("A1", "greetings", "问候");

      await tutor.chat(session.id, "Hi", mockContext);
      await tutor.chat(session.id, "I am fine, thank you.", mockContext);

      const tutorSession = tutor.getSession(session.id);
      expect(tutorSession?.score.improvement).toBeDefined();
    });
  });

  // ============================================================
  // Context-Aware Responses
  // ============================================================

  describe("Context-Aware Responses", () => {
    it("should generate level-appropriate prompts", async () => {
      const session = tutor.startSession("A1", "greetings", "问候");

      const response = await tutor.chat(session.id, "Hello!", mockContext);

      // A1 level should have simple prompts
      expect(response.nextPrompts.some(p => p.includes("name") || p.includes("from"))).toBe(true);
    });

    it("should adapt to learner level", async () => {
      const advancedContext: LearnerContext = {
        ...mockContext,
        level: "B1",
      };

      const session = tutor.startSession("B1", "conversation", "对话");

      const response = await tutor.chat(session.id, "Hello!", advancedContext);

      expect(response.nextPrompts.length).toBeGreaterThan(0);
    });
  });
});

// ============================================================
// RuleBasedTutorProvider Tests
// ============================================================

describe("RuleBasedTutorProvider", () => {
  let provider: RuleBasedTutorProvider;
  let mockContext: LearnerContext;

  beforeEach(() => {
    provider = new RuleBasedTutorProvider();
    mockContext = {
      userId: "test_user",
      level: "A1",
      recentTopics: [],
      vocabularyLevel: 30,
      grammarLevel: 25,
      weakAreas: [],
      strongAreas: [],
    };
  });

  it("should be available", () => {
    expect(provider.isAvailable()).toBe(true);
  });

  it("should generate greeting response", async () => {
    const response = await provider.generateResponse(
      [{ id: "1", role: "learner", content: "Hello!", timestamp: Date.now() }],
      mockContext
    );

    expect(response).toBeTruthy();
  });

  it("should generate how are you response", async () => {
    const response = await provider.generateResponse(
      [{ id: "1", role: "learner", content: "How are you?", timestamp: Date.now() }],
      mockContext
    );

    expect(response).toBeTruthy();
  });

  it("should generate thank you response", async () => {
    const response = await provider.generateResponse(
      [{ id: "1", role: "learner", content: "Thank you!", timestamp: Date.now() }],
      mockContext
    );

    expect(response).toBeTruthy();
  });

  it("should generate goodbye response", async () => {
    const response = await provider.generateResponse(
      [{ id: "1", role: "learner", content: "Goodbye!", timestamp: Date.now() }],
      mockContext
    );

    expect(response).toBeTruthy();
  });
});
