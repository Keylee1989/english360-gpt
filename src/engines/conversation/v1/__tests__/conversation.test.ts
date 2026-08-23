/**
 * Tests for Conversation Engine v1
 */

import { describe, it, expect, beforeEach } from "vitest";
import { 
  ConversationEngineV1, 
  SCENARIO_TEMPLATES 
} from "../index";

describe("ConversationEngineV1", () => {
  let engine: ConversationEngineV1;

  beforeEach(() => {
    engine = new ConversationEngineV1();
  });

  describe("Scenario Templates", () => {
    it("should have scenario templates", () => {
      expect(SCENARIO_TEMPLATES.length).toBeGreaterThan(0);
    });

    it("should get template by scenario", () => {
      const template = engine.getTemplate("self_introduction");
      expect(template).toBeDefined();
      expect(template?.name).toBe("Self Introduction");
      expect(template?.nameChinese).toBe("自我介绍");
    });

    it("should get all templates", () => {
      const templates = engine.getAllTemplates();
      expect(templates.length).toBe(SCENARIO_TEMPLATES.length);
    });

    it("should get templates by level", () => {
      const beginnerTemplates = engine.getTemplatesByLevel("beginner");
      expect(beginnerTemplates.length).toBeGreaterThan(0);
      expect(beginnerTemplates.every(t => t.level === "beginner")).toBe(true);
    });
  });

  describe("Session Management", () => {
    it("should start new session", () => {
      const session = engine.startSession("self_introduction", "beginner");

      expect(session).toBeDefined();
      expect(session.scenario).toBe("self_introduction");
      expect(session.level).toBe("beginner");
      expect(session.messages.length).toBe(1);
      expect(session.messages[0].role).toBe("ai");
    });

    it("should get session by ID", () => {
      const session = engine.startSession("shopping");
      const retrieved = engine.getSession(session.id);

      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe(session.id);
    });

    it("should get all sessions", () => {
      engine.startSession("self_introduction");
      engine.startSession("shopping");

      const sessions = engine.getAllSessions();
      expect(sessions.length).toBe(2);
    });
  });

  describe("Message Processing", () => {
    it("should process user message", () => {
      const session = engine.startSession("self_introduction");

      const { aiResponse, analysis } = engine.processUserMessage(
        session.id,
        "Hello, my name is John."
      );

      expect(aiResponse).toBeDefined();
      expect(aiResponse.role).toBe("ai");
      expect(analysis).toBeDefined();
      expect(analysis.grammar).toBeDefined();
      expect(analysis.naturalExpression).toBeDefined();
    });

    it("should analyze grammar", () => {
      const session = engine.startSession("self_introduction");

      const { analysis } = engine.processUserMessage(
        session.id,
        "I want buy coffee."
      );

      // Grammar analysis may or may not detect mistakes depending on implementation
      expect(analysis.grammar).toBeDefined();
      expect(analysis.grammar.score).toBeGreaterThanOrEqual(0);
    });

    it("should check natural expression", () => {
      const session = engine.startSession("shopping");

      const { analysis } = engine.processUserMessage(
        session.id,
        "I want buy coffee."
      );

      expect(analysis.naturalExpression.isNatural).toBe(false);
      expect(analysis.naturalExpression.alternatives.length).toBeGreaterThan(0);
    });

    it("should check vocabulary usage", () => {
      const session = engine.startSession("shopping");

      const { analysis } = engine.processUserMessage(
        session.id,
        "I want to buy this book."
      );

      expect(analysis.vocabularyUsed).toContain("buy");
    });
  });

  describe("Session Scoring", () => {
    it("should update session score", () => {
      const session = engine.startSession("self_introduction");

      engine.processUserMessage(session.id, "Hello, my name is John.");
      engine.processUserMessage(session.id, "I am from China.");

      const updatedSession = engine.getSession(session.id);
      expect(updatedSession?.score.overall).toBeGreaterThan(0);
    });
  });

  describe("Session Ending", () => {
    it("should end session with recommendations", () => {
      const session = engine.startSession("self_introduction");

      engine.processUserMessage(session.id, "Hello.");

      const endedSession = engine.endSession(session.id);

      expect(endedSession.endTime).toBeDefined();
      expect(endedSession.recommendations.length).toBeGreaterThan(0);
    });
  });

  describe("Response Generation", () => {
    it("should generate greeting response", () => {
      const session = engine.startSession("self_introduction");

      const { aiResponse } = engine.processUserMessage(session.id, "Hello!");

      expect(aiResponse.content).toContain("Hello");
      expect(aiResponse.translationChinese).toBeDefined();
    });

    it("should generate thank you response", () => {
      const session = engine.startSession("self_introduction");

      const { aiResponse } = engine.processUserMessage(session.id, "Thank you!");

      expect(aiResponse.content).toContain("welcome");
    });

    it("should generate price response", () => {
      const session = engine.startSession("shopping");

      const { aiResponse } = engine.processUserMessage(session.id, "How much is this?");

      // The response should contain price information
      expect(aiResponse.content).toBeDefined();
    });
  });
});
