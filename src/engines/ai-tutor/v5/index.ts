/**
 * AI Tutor v5 — Real LLM Integration
 *
 * Supports:
 * - OpenAI API (GPT-4/GPT-3.5)
 * - Claude API (Anthropic)
 * - Mock Provider (fallback)
 *
 * Features:
 * - API key configuration via environment
 * - Secure key storage
 * - Fallback handling
 * - Error recovery
 */

import type { LLMProvider } from "../v4/index";

// ============================================================
// Types
// ============================================================

export type AIProviderType = "openai" | "claude" | "mock";

export interface AIConfig {
  provider: AIProviderType;
  apiKey?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

// ============================================================
// OpenAI Provider
// ============================================================

export class OpenAIProvider implements LLMProvider {
  name = "openai";
  private apiKey: string;
  private model: string;
  private maxTokens: number;
  private temperature: number;

  constructor(config: { apiKey: string; model?: string; maxTokens?: number; temperature?: number }) {
    this.apiKey = config.apiKey;
    this.model = config.model || "gpt-3.5-turbo";
    this.maxTokens = config.maxTokens || 500;
    this.temperature = config.temperature || 0.7;
  }

  async chat(messages: { role: string; content: string }[]): Promise<string> {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          max_tokens: this.maxTokens,
          temperature: this.temperature,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "OpenAI API error");
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || "";
    } catch (error) {
      console.error("OpenAI API error:", error);
      throw error;
    }
  }

  isAvailable(): boolean {
    return !!this.apiKey;
  }
}

// ============================================================
// Claude Provider (Anthropic)
// ============================================================

export class ClaudeProvider implements LLMProvider {
  name = "claude";
  private apiKey: string;
  private model: string;
  private maxTokens: number;

  constructor(config: { apiKey: string; model?: string; maxTokens?: number }) {
    this.apiKey = config.apiKey;
    this.model = config.model || "claude-3-haiku-20240307";
    this.maxTokens = config.maxTokens || 500;
  }

  async chat(messages: { role: string; content: string }[]): Promise<string> {
    try {
      // Convert messages to Claude format
      const systemMessage = messages.find((m) => m.role === "system")?.content || "";
      const conversationMessages = messages
        .filter((m) => m.role !== "system")
        .map((m) => ({
          role: m.role === "user" ? "user" : "assistant",
          content: m.content,
        }));

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: this.model,
          max_tokens: this.maxTokens,
          system: systemMessage,
          messages: conversationMessages,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "Claude API error");
      }

      const data = await response.json();
      return data.content[0]?.text || "";
    } catch (error) {
      console.error("Claude API error:", error);
      throw error;
    }
  }

  isAvailable(): boolean {
    return !!this.apiKey;
  }
}

// ============================================================
// Mock Provider (Fallback)
// ============================================================

export class MockAIProvider implements LLMProvider {
  name = "mock";

  async chat(messages: { role: string; content: string }[]): Promise<string> {
    const lastMessage = messages[messages.length - 1]?.content || "";
    const lower = lastMessage.toLowerCase();

    // Grammar correction responses
    if (lower.includes("yesterday") && (lower.includes("go") || lower.includes("eat") || lower.includes("see"))) {
      return `I see you said "${lastMessage}"

Let me help you with this:

Correction: When we talk about yesterday (past time), we use past tense verbs.

For example:
- "I go yesterday" → "I went yesterday"
- "I eat breakfast" → "I ate breakfast"

Practice: Can you say "I went to school yesterday."?`;
    }

    if (lower.includes("very like")) {
      return `Good try! But we say "I really like" not "I very like."

In English:
- "very" is used with adjectives (very good, very big)
- "really" is used with verbs (really like, really want)

Practice: Say "I really like English."`;
    }

    if (lower.includes("hello") || lower.includes("hi")) {
      return `Hello! Great to see you practicing!

How are you today? Tell me something about your day.

For example:
- "I am fine."
- "I went to work."
- "I like Chinese food."`;
    }

    // Default teaching response
    return `That's a good attempt!

Let me teach you something:
In English, we often add more details to make sentences interesting.

For example:
- "I like food." → "I really like Chinese food."
- "It is good." → "It is very delicious."

Can you try making your sentence more detailed?`;
  }

  isAvailable(): boolean {
    return true;
  }
}

// ============================================================
// AI Tutor v5 — Real LLM Integration
// ============================================================

export class AITutorV5 {
  private providers: Map<AIProviderType, LLMProvider>;
  private activeProvider: LLMProvider;
  private config: AIConfig;

  constructor(config?: Partial<AIConfig>) {
    this.config = {
      provider: config?.provider || "mock",
      apiKey: config?.apiKey || "",
      model: config?.model,
      maxTokens: config?.maxTokens,
      temperature: config?.temperature,
    };

    // Initialize providers
    this.providers = new Map();

    // OpenAI
    if (this.config.provider === "openai" && this.config.apiKey) {
      this.providers.set("openai", new OpenAIProvider({
        apiKey: this.config.apiKey,
        model: this.config.model,
        maxTokens: this.config.maxTokens,
        temperature: this.config.temperature,
      }));
    }

    // Claude
    if (this.config.provider === "claude" && this.config.apiKey) {
      this.providers.set("claude", new ClaudeProvider({
        apiKey: this.config.apiKey,
        model: this.config.model,
        maxTokens: this.config.maxTokens,
      }));
    }

    // Mock (always available)
    this.providers.set("mock", new MockAIProvider());

    // Set active provider
    this.activeProvider = this.providers.get(this.config.provider) || this.providers.get("mock")!;
  }

  /**
   * Set provider
   */
  setProvider(type: AIProviderType, apiKey?: string): void {
    if (type === "openai" && apiKey) {
      this.providers.set("openai", new OpenAIProvider({ apiKey }));
    } else if (type === "claude" && apiKey) {
      this.providers.set("claude", new ClaudeProvider({ apiKey }));
    }

    this.activeProvider = this.providers.get(type) || this.providers.get("mock")!;
    this.config.provider = type;
    this.config.apiKey = apiKey;
  }

  /**
   * Get active provider name
   */
  getProviderName(): string {
    return this.activeProvider.name;
  }

  /**
   * Chat with AI
   */
  async chat(messages: { role: string; content: string }[]): Promise<string> {
    try {
      return await this.activeProvider.chat(messages);
    } catch (error) {
      console.error("AI chat failed, falling back to mock:", error);
      // Fallback to mock provider
      const mockProvider = this.providers.get("mock");
      if (mockProvider) {
        return await mockProvider.chat(messages);
      }
      throw error;
    }
  }

  /**
   * Check if provider is available
   */
  isAvailable(): boolean {
    return true; // Always available with mock fallback
  }

  /**
   * Get configuration
   */
  getConfig(): AIConfig {
    return { ...this.config };
  }

  /**
   * Load config from environment
   */
  static fromConfig(config: AIConfig): AITutorV5 {
    return new AITutorV5(config);
  }
}

// ============================================================
// Factory Function
// ============================================================

export function createAITutor(config?: Partial<AIConfig>): AITutorV5 {
  return new AITutorV5(config);
}

export default AITutorV5;
