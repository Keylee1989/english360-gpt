/**
 * AI Settings Service
 *
 * Stores user's AI configuration in localStorage:
 * - Provider type (openai / custom)
 * - API Key
 * - Base URL (supports OpenAI, Claude, DeepSeek, local models, etc.)
 * - Selected model
 * - Auto-fetched model list
 *
 * If no config → defaults to local mock mode.
 */

const STORAGE_KEY = "english360_ai_settings";

export type AIProviderType = "openai" | "custom" | "local";

export interface AISettings {
  enabled: boolean;           // false = local mock mode
  provider: AIProviderType;
  apiKey: string;
  baseUrl: string;            // e.g. "https://api.openai.com/v1"
  model: string;              // selected model id
  availableModels: ModelInfo[];
  temperature: number;
  maxTokens: number;
}

export interface ModelInfo {
  id: string;
  name: string;
}

const DEFAULT_SETTINGS: AISettings = {
  enabled: false,
  provider: "local",
  apiKey: "",
  baseUrl: "https://api.openai.com/v1",
  model: "",
  availableModels: [],
  temperature: 0.7,
  maxTokens: 1024,
};

// ============================================================
// Load / Save
// ============================================================

export function loadAISettings(): AISettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveAISettings(settings: AISettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error("Failed to save AI settings:", e);
  }
}

export function isAIConfigured(): boolean {
  const s = loadAISettings();
  return s.enabled && !!s.apiKey && !!s.model;
}

// ============================================================
// Fetch Models from any OpenAI-compatible API
// ============================================================

export async function fetchModels(
  baseUrl: string,
  apiKey: string
): Promise<ModelInfo[]> {
  try {
    const url = `${baseUrl.replace(/\/+$/, "")}/models`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      // Some APIs return 405 for GET /models — try POST
      return await fetchModelsPost(baseUrl, apiKey);
    }

    const data = await response.json();
    const models: ModelInfo[] = [];

    // OpenAI format: { data: [{ id, ... }] }
    if (Array.isArray(data.data)) {
      for (const m of data.data) {
        if (m.id) {
          models.push({ id: m.id, name: m.id });
        }
      }
    }
    // Some APIs return plain array
    else if (Array.isArray(data)) {
      for (const m of data) {
        const id = m.id || m.name || m;
        models.push({ id: String(id), name: String(id) });
      }
    }

    // Sort: chat models first, then alphabetical
    models.sort((a, b) => {
      const aChat = a.id.includes("gpt") || a.id.includes("claude") || a.id.includes("chat");
      const bChat = b.id.includes("gpt") || b.id.includes("claude") || b.id.includes("chat");
      if (aChat !== bChat) return aChat ? -1 : 1;
      return a.id.localeCompare(b.id);
    });

    return models;
  } catch (error) {
    console.error("Fetch models failed:", error);
    return [];
  }
}

async function fetchModelsPost(
  baseUrl: string,
  apiKey: string
): Promise<ModelInfo[]> {
  try {
    const url = `${baseUrl.replace(/\/+$/, "")}/models`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) return [];

    const data = await response.json();
    const models: ModelInfo[] = [];

    if (Array.isArray(data.data)) {
      for (const m of data.data) {
        if (m.id) models.push({ id: m.id, name: m.id });
      }
    } else if (Array.isArray(data)) {
      for (const m of data) {
        const id = m.id || m.name || m;
        models.push({ id: String(id), name: String(id) });
      }
    }

    return models;
  } catch {
    return [];
  }
}

// ============================================================
// Chat Completion (OpenAI-compatible)
// ============================================================

export async function chatWithAI(
  messages: { role: string; content: string }[],
  settings?: AISettings
): Promise<string> {
  const s = settings || loadAISettings();

  // If not configured, use local mock
  if (!s.enabled || !s.apiKey || !s.model) {
    return localMockChat(messages);
  }

  try {
    const url = `${s.baseUrl.replace(/\/+$/, "")}/chat/completions`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${s.apiKey}`,
      },
      body: JSON.stringify({
        model: s.model,
        messages,
        max_tokens: s.maxTokens,
        temperature: s.temperature,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || `API error ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "";
  } catch (error) {
    console.error("AI chat error, falling back to local:", error);
    return localMockChat(messages);
  }
}

// ============================================================
// Local Mock Chat (rule-based, no API needed)
// ============================================================

function localMockChat(messages: { role: string; content: string }[]): string {
  const lastMsg = messages[messages.length - 1]?.content || "";
  const lower = lastMsg.toLowerCase();

  // Grammar corrections
  if (lower.includes("yesterday") && (lower.includes("go ") || lower.includes("eat") || lower.includes("see"))) {
    return `Let me help you with past tense!\n\n✅ Correct: "I went yesterday."\n📖 中文解释: 昨天发生的事用过去式。\n🔍 发音: /aɪ wɛnt jɛstərdeɪ/\n💡 Practice: 试试说 "I went to school yesterday."`;
  }

  if (lower.includes("very like")) {
    return `Good try! We say "really like" not "very like."\n\n✅ "I really like English."\n📖 中文解释: really + 动词, very + 形容词\n💡 Practice: Say "I really like learning English."`;
  }

  if (lower.includes("hello") || lower.includes("hi")) {
    return `Hello! Great to see you practicing! 👋\n\nHow are you today? 你今天怎么样？\n\nTry: "I am fine, thank you." 或 "I am happy today."`;
  }

  if (lower.includes("apple") || lower.includes("banana") || lower.includes("food")) {
    return `Great vocabulary! Let's practice:\n\n🍎 "I like apples." (我喜欢苹果)\n🍌 "Bananas are sweet." (香蕉很甜)\n💡 注意: 可数名词复数要加 s\n📖 Practice: Say "I want to eat an apple."`;
  }

  if (lower.includes("what") || lower.includes("where") || lower.includes("how")) {
    return `Good question! Here's how to answer:\n\n❓ "${lastMsg}"\n\nLet me help you practice:\n- "I think..." (我认为...)\n- "In my opinion..." (在我看来...)\n\nTry answering in English! 试试用英语回答！`;
  }

  // Default teaching response
  return `That's a good attempt! 👏\n\nLet me help:\n📖 English sentence structure: Subject + Verb + Object\nExample: "I study English every day."\n\n💡 Practice tips:\n- 用简单的句子开始\n- 每天练习 3-5 个句子\n- 不怕犯错，犯错是学习的一部分\n\nTry: "I am learning English." (我在学英语)`;
}
