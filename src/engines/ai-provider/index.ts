/**
 * AI Provider Layer
 *
 * Provider abstraction for AI services.
 * Supports OpenAI-compatible APIs.
 *
 * Security Design:
 * - API keys are NEVER stored in source code or Git
 * - By default, keys live in sessionStorage (cleared when browser closes)
 * - User can opt to remember key (stored in localStorage)
 * - For GitHub Pages: direct browser-to-API calls (user accepts risk)
 * - For production: optional backend proxy (future)
 *
 * Supported providers (via OpenAI-compatible API):
 * - OpenAI
 * - DeepSeek
 * - Qwen
 * - Doubao
 * - Any compatible endpoint
 */

import type {
  IAIProvider,
  AIChatRequest,
  AIChatResponse,
  AIProviderInfo,
} from "@/types/engines";

// ============================================================
// Provider Configuration
// ============================================================

export interface ProviderConfig {
  baseUrl: string;
  apiKey: string;
  model: string;
  provider?: string; // "openai" | "deepseek" | "qwen" | "doubao" | "custom"
  maxTokens?: number;
  temperature?: number;
}

// Pre-configured providers (API keys NOT included)
export const KNOWN_PROVIDERS: Record<
  string,
  { name: string; baseUrl: string; models: string[] }
> = {
  openai: {
    name: "OpenAI",
    baseUrl: "https://api.openai.com/v1",
    models: ["gpt-4o-mini", "gpt-4o", "gpt-4-turbo", "gpt-3.5-turbo"],
  },
  deepseek: {
    name: "DeepSeek",
    baseUrl: "https://api.deepseek.com/v1",
    models: ["deepseek-chat", "deepseek-coder"],
  },
  qwen: {
    name: "Qwen (通义千问)",
    baseUrl: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    models: ["qwen-turbo", "qwen-plus", "qwen-max"],
  },
  doubao: {
    name: "Doubao (豆包)",
    baseUrl: "https://ark.cn-beijing.volces.com/api/v3",
    models: ["doubao-pro", "doubao-lite"],
  },
};

// ============================================================
// Security: Session-only key management
// ============================================================

const SESSION_KEY = "english360_ai_session";

/**
 * Get AI config from session storage (secure, cleared on tab close)
 */
export function getSessionConfig(): ProviderConfig | null {
  try {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as ProviderConfig;
  } catch {
    return null;
  }
}

/**
 * Set AI config in session storage
 */
export function setSessionConfig(config: ProviderConfig): void {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(config));
}

/**
 * Clear AI session config
 */
export function clearSessionConfig(): void {
  sessionStorage.removeItem(SESSION_KEY);
}

/**
 * Check if AI is configured for this session
 */
export function isAIConfigured(): boolean {
  const config = getSessionConfig();
  return config !== null && config.apiKey.length > 0;
}

// ============================================================
// AI Provider Implementation
// ============================================================

export class AIProvider implements IAIProvider {
  private config: ProviderConfig;
  private abortController: AbortController | null = null;

  constructor(config: ProviderConfig) {
    this.config = config;
  }

  /**
   * Send a chat completion request
   */
  async chat(request: AIChatRequest): Promise<AIChatResponse> {
    if (!this.config.apiKey) {
      throw new Error("AI provider not configured: no API key");
    }

    // Abort any previous request
    this.abort();

    this.abortController = new AbortController();

    const body = {
      model: this.config.model,
      messages: request.messages,
      temperature: request.temperature ?? this.config.temperature ?? 0.7,
      max_tokens: request.maxTokens ?? this.config.maxTokens ?? 2048,
    };

    try {
      const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify(body),
        signal: this.abortController.signal,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`AI API error ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      return {
        content: data.choices?.[0]?.message?.content ?? "",
        model: data.model ?? this.config.model,
        usage: {
          promptTokens: data.usage?.prompt_tokens ?? 0,
          completionTokens: data.usage?.completion_tokens ?? 0,
          totalTokens: data.usage?.total_tokens ?? 0,
        },
      };
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new Error("AI request was cancelled");
      }
      throw error;
    } finally {
      this.abortController = null;
    }
  }

  /**
   * Check if the provider is available (can reach the API)
   */
  async isAvailable(): Promise<boolean> {
    if (!this.config.apiKey) return false;

    try {
      // Try a minimal request to check connectivity
      const response = await fetch(`${this.config.baseUrl}/models`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        signal: AbortSignal.timeout(5000),
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Get provider info
   */
  getInfo(): AIProviderInfo {
    return {
      name: this.config.provider ?? "Custom",
      baseUrl: this.config.baseUrl,
      models: [this.config.model],
    };
  }

  /**
   * Abort current request
   */
  abort(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<ProviderConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

// ============================================================
// Factory Functions
// ============================================================

/**
 * Create AI provider from session config
 */
export function createProviderFromSession(): AIProvider | null {
  const config = getSessionConfig();
  if (!config) return null;
  return new AIProvider(config);
}

/**
 * Create AI provider for a known provider (without API key)
 * User must provide the API key separately.
 */
export function createKnownProvider(
  providerName: string,
  apiKey: string,
): AIProvider | null {
  const known = KNOWN_PROVIDERS[providerName];
  if (!known) return null;

  return new AIProvider({
    baseUrl: known.baseUrl,
    apiKey,
    model: known.models[0],
    provider: providerName,
  });
}

/**
 * Create a custom provider
 */
export function createCustomProvider(
  baseUrl: string,
  apiKey: string,
  model: string,
): AIProvider {
  return new AIProvider({
    baseUrl,
    apiKey,
    model,
    provider: "custom",
  });
}
