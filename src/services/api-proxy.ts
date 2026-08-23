/**
 * API Proxy Service
 *
 * Handles secure communication with backend:
 * - AI API proxy (OpenAI/Claude)
 * - Usage limits
 * - Error fallback
 * - Rate limiting
 */

// ============================================================
// Types
// ============================================================

export type AIProvider = "openai" | "claude" | "mock";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatResponse {
  content: string;
  provider: AIProvider;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface APIError {
  message: string;
  code: string;
  status: number;
}

// ============================================================
// Configuration
// ============================================================

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";
const AI_PROVIDER = (import.meta.env.VITE_AI_PROVIDER as AIProvider) || "mock";

// ============================================================
// Rate Limiting
// ============================================================

class RateLimiter {
  private requests: number[] = [];
  private limit: number;
  private windowMs: number;

  constructor(limit: number, windowMs: number) {
    this.limit = limit;
    this.windowMs = windowMs;
  }

  canMakeRequest(): boolean {
    const now = Date.now();
    this.requests = this.requests.filter(t => now - t < this.windowMs);
    return this.requests.length < this.limit;
  }

  recordRequest(): void {
    this.requests.push(Date.now());
  }

  getRemainingRequests(): number {
    const now = Date.now();
    this.requests = this.requests.filter(t => now - t < this.windowMs);
    return Math.max(0, this.limit - this.requests.length);
  }
}

// ============================================================
// API Proxy Service
// ============================================================

export class APIProxyService {
  private rateLimiter: RateLimiter;
  private provider: AIProvider;

  constructor() {
    this.rateLimiter = new RateLimiter(60, 60 * 1000); // 60 requests per minute
    this.provider = AI_PROVIDER;
  }

  /**
   * Chat with AI
   */
  async chat(
    messages: ChatMessage[],
    options: {
      provider?: AIProvider;
      maxTokens?: number;
      temperature?: number;
    } = {}
  ): Promise<ChatResponse> {
    // Check rate limit
    if (!this.rateLimiter.canMakeRequest()) {
      throw {
        message: "Rate limit exceeded. Please try again later.",
        code: "RATE_LIMIT_EXCEEDED",
        status: 429,
      };
    }

    const provider = options.provider || this.provider;

    // Try backend API first
    try {
      const response = await this.callBackendAPI("/ai/chat", {
        messages,
        provider,
        maxTokens: options.maxTokens || 500,
        temperature: options.temperature || 0.7,
      });

      this.rateLimiter.recordRequest();
      return response;
    } catch (error) {
      // Fallback to mock if backend unavailable
      if (provider !== "mock") {
        console.warn("Backend API unavailable, falling back to mock provider");
        return this.mockChat(messages);
      }
      throw error;
    }
  }

  /**
   * Call backend API
   */
  private async callBackendAPI(
    endpoint: string,
    data: Record<string, unknown>
  ): Promise<ChatResponse> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.getAuthToken()}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw {
        message: error.message || "API request failed",
        code: error.code || "API_ERROR",
        status: response.status,
      };
    }

    return response.json();
  }

  /**
   * Mock chat for development/fallback
   */
  private async mockChat(messages: ChatMessage[]): Promise<ChatResponse> {
    const lastMessage = messages[messages.length - 1]?.content || "";
    const lower = lastMessage.toLowerCase();

    let content = "";

    if (lower.includes("yesterday") && lower.includes("go")) {
      content = `Let me help you with that.\n\nCorrection: I went yesterday.\n\n中文解释: 表示过去时间的词需要使用过去式。\n\nPractice: Can you say "I went to school yesterday."?`;
    } else if (lower.includes("very like")) {
      content = `Good try! But we say "I really like" not "I very like."\n\nIn English:\n- "very" is used with adjectives (very good)\n- "really" is used with verbs (really like)\n\nPractice: Say "I really like English."`;
    } else if (lower.includes("hello") || lower.includes("hi")) {
      content = `Hello! Great to see you practicing!\n\nHow are you today? Tell me something about your day.`;
    } else {
      content = `That's a good sentence!\n\nLet me teach you something:\nIn English, we often add more details to make sentences interesting.\n\nCan you try making your sentence more detailed?`;
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      content,
      provider: "mock",
      usage: {
        promptTokens: 100,
        completionTokens: 150,
        totalTokens: 250,
      },
    };
  }

  /**
   * Get auth token
   */
  private getAuthToken(): string {
    return localStorage.getItem("english360_auth_token") || "";
  }

  /**
   * Get rate limit status
   */
  getRateLimitStatus(): { remaining: number; limit: number } {
    return {
      remaining: this.rateLimiter.getRemainingRequests(),
      limit: 60,
    };
  }

  /**
   * Set provider
   */
  setProvider(provider: AIProvider): void {
    this.provider = provider;
  }

  /**
   * Get current provider
   */
  getProvider(): AIProvider {
    return this.provider;
  }
}

// ============================================================
// Singleton
// ============================================================

export const apiProxy = new APIProxyService();
export default apiProxy;
