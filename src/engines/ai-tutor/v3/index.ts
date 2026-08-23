/**
 * AI Tutor v3 — Real LLM Integration Layer
 *
 * Supports multiple providers:
 * - OpenAI compatible API
 * - Claude compatible API
 * - Local mock (for testing)
 *
 * Features:
 * - Conversation memory
 * - Grammar correction
 * - Difficulty adjustment
 * - Context-aware responses
 */

// ============================================================
// Types
// ============================================================

export interface LearnerContext {
  userId: string;
  level: "A1" | "A2" | "B1" | "B2";
  vocabularyLevel: number;
  grammarLevel: number;
  weakAreas: string[];
  recentErrors: GrammarError[];
  conversationHistory: ConversationMessage[];
  interests: string[];
}

export interface GrammarError {
  original: string;
  corrected: string;
  rule: string;
  ruleChinese: string;
  timestamp: number;
}

export interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface TutorResponse {
  message: string;
  corrections: GrammarError[];
  suggestions: string[];
  vocabulary: VocabularySuggestion[];
  followUpQuestion: string;
}

export interface VocabularySuggestion {
  word: string;
  meaning: string;
  example: string;
}

// ============================================================
// LLM Provider Interface
// ============================================================

export interface LLMProvider {
  name: string;
  chat(messages: { role: string; content: string }[]): Promise<string>;
}

// ============================================================
// OpenAI Provider
// ============================================================

export class OpenAIProvider implements LLMProvider {
  name = "openai";
  private apiKey: string;
  private baseUrl: string;
  private model: string;

  constructor(apiKey: string, model = "gpt-4o-mini", baseUrl = "https://api.openai.com/v1") {
    this.apiKey = apiKey;
    this.model = model;
    this.baseUrl = baseUrl;
  }

  async chat(messages: { role: string; content: string }[]): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error("OpenAI API failed:", error);
      throw error;
    }
  }
}

// ============================================================
// Claude Provider
// ============================================================

export class ClaudeProvider implements LLMProvider {
  name = "claude";
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model = "claude-3-haiku-20240307") {
    this.apiKey = apiKey;
    this.model = model;
  }

  async chat(messages: { role: string; content: string }[]): Promise<string> {
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: this.model,
          max_tokens: 500,
          messages: messages.map((m) => ({
            role: m.role === "assistant" ? "assistant" : "user",
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Claude API error: ${response.status}`);
      }

      const data = await response.json();
      return data.content[0].text;
    } catch (error) {
      console.error("Claude API failed:", error);
      throw error;
    }
  }
}

// ============================================================
// Mock Provider (for testing/offline)
// ============================================================

export class MockProvider implements LLMProvider {
  name = "mock";

  async chat(messages: { role: string; content: string }[]): Promise<string> {
    const lastMessage = messages[messages.length - 1]?.content || "";

    // Simple rule-based responses for testing
    const lower = lastMessage.toLowerCase();

    if (lower.includes("hello") || lower.includes("hi")) {
      return "Hello! How are you today? I'm here to help you practice English.";
    }
    if (lower.includes("how are you")) {
      return "I'm doing well, thank you! How about you? How is your English study going?";
    }
    if (lower.includes("shopping")) {
      return "Shopping is a great topic! What did you buy? Can you tell me in English?";
    }
    if (lower.includes("yesterday")) {
      return "Good! When talking about yesterday, we use past tense. For example: 'I went shopping yesterday.' What else did you do?";
    }

    // Default response
    return "That's interesting! Can you tell me more? Try to use complete sentences.";
  }
}

// ============================================================
// AI Tutor v3
// ============================================================

export class AITutorV3 {
  private provider: LLMProvider;
  private contexts: Map<string, LearnerContext> = new Map();

  constructor(provider?: LLMProvider) {
    this.provider = provider || new MockProvider();
  }

  /**
   * Set the LLM provider
   */
  setProvider(provider: LLMProvider): void {
    this.provider = provider;
  }

  /**
   * Initialize or get learner context
   */
  getContext(userId: string): LearnerContext {
    if (!this.contexts.has(userId)) {
      this.contexts.set(userId, {
        userId,
        level: "A1",
        vocabularyLevel: 30,
        grammarLevel: 30,
        weakAreas: [],
        recentErrors: [],
        conversationHistory: [],
        interests: [],
      });
    }
    return this.contexts.get(userId)!;
  }

  /**
   * Update learner context
   */
  updateContext(userId: string, updates: Partial<LearnerContext>): void {
    const context = this.getContext(userId);
    Object.assign(context, updates);
  }

  /**
   * Chat with the AI tutor
   */
  async chat(userId: string, message: string): Promise<TutorResponse> {
    const context = this.getContext(userId);

    // Add user message to history
    context.conversationHistory.push({
      role: "user",
      content: message,
      timestamp: Date.now(),
    });

    // Build system prompt based on learner level
    const systemPrompt = this.buildSystemPrompt(context);

    // Build messages for LLM
    const messages = [
      { role: "system", content: systemPrompt },
      ...context.conversationHistory.slice(-10).map((m) => ({
        role: m.role,
        content: m.content,
      })),
    ];

    try {
      // Get response from LLM
      const response = await this.provider.chat(messages);

      // Add assistant message to history
      context.conversationHistory.push({
        role: "assistant",
        content: response,
        timestamp: Date.now(),
      });

      // Analyze for grammar errors
      const corrections = this.detectErrors(message, context);

      // Generate vocabulary suggestions
      const vocabulary = this.suggestVocabulary(message, context);

      // Generate follow-up question
      const followUp = this.generateFollowUp(response, context);

      return {
        message: response,
        corrections,
        suggestions: this.generateSuggestions(context),
        vocabulary,
        followUpQuestion: followUp,
      };
    } catch (error) {
      console.error("AI Tutor chat failed:", error);

      // Fallback to rule-based response
      return this.fallbackResponse(message, context);
    }
  }

  /**
   * Build system prompt based on learner level
   */
  private buildSystemPrompt(context: LearnerContext): string {
    const levelDescriptions: Record<string, string> = {
      A1: "a complete beginner who knows only basic words and simple phrases",
      A2: "a elementary learner who can handle simple daily conversations",
      B1: "an intermediate learner who can communicate in most situations",
      B2: "an upper-intermediate learner who can use English fluently",
    };

    const levelDesc = levelDescriptions[context.level] || levelDescriptions.A1;

    return `You are a friendly English tutor helping a Chinese native speaker learning English.

The student is ${levelDesc}.

Rules:
1. Use simple, clear English appropriate for their level
2. If they make grammar mistakes, gently correct them
3. Explain corrections in both English and Chinese
4. Encourage them to practice
5. Ask follow-up questions to keep the conversation going
6. Introduce 1-2 new vocabulary words naturally when appropriate
7. Be patient and supportive

Their weak areas: ${context.weakAreas.join(", ") || "none identified yet"}
Their interests: ${context.interests.join(", ") || "general topics"}

Respond in a way that helps them learn while keeping the conversation natural.`;
  }

  /**
   * Detect grammar errors in user message
   */
  private detectErrors(message: string, context: LearnerContext): GrammarError[] {
    const errors: GrammarError[] = [];

    // Past tense errors
    const pastPatterns = [
      { pattern: /\b(yesterday|last|ago)\b.*\b(go|come|eat|see|buy|take|make|have|do|run|play|want|like|need)\b/gi,
        rule: "Past tense required",
        ruleChinese: "需要使用过去式",
        fix: (match: string) => match.replace(/\b(go)\b/g, "went").replace(/\b(eat)\b/g, "ate").replace(/\b(see)\b/g, "saw").replace(/\b(buy)\b/g, "bought").replace(/\b(take)\b/g, "took").replace(/\b(make)\b/g, "made").replace(/\b(have)\b/g, "had").replace(/\b(do)\b/g, "did").replace(/\b(run)\b/g, "ran").replace(/\b(play)\b/g, "played").replace(/\b(want)\b/g, "wanted").replace(/\b(like)\b/g, "liked").replace(/\b(need)\b/g, "needed").replace(/\b(come)\b/g, "came")
      }
    ];

    for (const { pattern, rule, ruleChinese, fix } of pastPatterns) {
      const matches = message.match(pattern);
      if (matches) {
        for (const match of matches) {
          const corrected = fix(match);
          if (corrected !== match) {
            errors.push({
              original: match,
              corrected,
              rule,
              ruleChinese,
              timestamp: Date.now(),
            });
          }
        }
      }
    }

    // Article errors (a/an before singular countable nouns)
    const articlePattern = /\b(have|want|need|like|see|buy)\s+(book|car|house|idea|apple|orange|cat|dog|phone)\b/gi;
    const articleMatches = message.match(articlePattern);
    if (articleMatches) {
      for (const match of articleMatches) {
        const words = match.split(/\s+/);
        const noun = words[words.length - 1];
        const needsAn = /^[aeiou]/.test(noun);
        const article = needsAn ? "an" : "a";
        errors.push({
          original: match,
          corrected: `${words.slice(0, -1).join(" ")} ${article} ${noun}`,
          rule: `Missing article '${article}' before singular countable noun`,
          ruleChinese: `单数可数名词前需要加冠词 '${article}'`,
          timestamp: Date.now(),
        });
      }
    }

    // Store errors in context
    context.recentErrors.push(...errors);
    if (context.recentErrors.length > 20) {
      context.recentErrors = context.recentErrors.slice(-20);
    }

    return errors;
  }

  /**
   * Suggest vocabulary based on message
   */
  private suggestVocabulary(message: string, context: LearnerContext): VocabularySuggestion[] {
    const suggestions: VocabularySuggestion[] = [];
    const lower = message.toLowerCase();

    // Suggest better words based on simple words used
    const wordSuggestions: Record<string, VocabularySuggestion> = {
      good: { word: "excellent", meaning: "优秀的", example: "That's an excellent idea!" },
      bad: { word: "terrible", meaning: "糟糕的", example: "The weather is terrible today." },
      happy: { word: "delighted", meaning: "高兴的", example: "I'm delighted to meet you!" },
      sad: { word: "disappointed", meaning: "失望的", example: "I'm disappointed with the result." },
      big: { word: "enormous", meaning: "巨大的", example: "The building is enormous." },
      small: { word: "tiny", meaning: "微小的", example: "The cat is tiny." },
      want: { word: "would like", meaning: "想要", example: "I would like some water." },
      like: { word: "enjoy", meaning: "享受", example: "I enjoy reading books." },
    };

    for (const [simple, suggestion] of Object.entries(wordSuggestions)) {
      if (lower.includes(simple) && context.vocabularyLevel < 50) {
        suggestions.push(suggestion);
      }
    }

    return suggestions.slice(0, 2); // Max 2 suggestions per message
  }

  /**
   * Generate follow-up question
   */
  private generateFollowUp(_response: string, context: LearnerContext): string {
    // Simple follow-up generation based on context
    const followUps: Record<string, string[]> = {
      A1: [
        "Can you say that again in a complete sentence?",
        "What else can you tell me?",
        "Do you have any questions?",
        "Can you try using the new word I taught you?",
      ],
      A2: [
        "Can you give me an example?",
        "How would you say that differently?",
        "What do you think about that?",
        "Can you tell me more details?",
      ],
      B1: [
        "That's interesting! Can you elaborate?",
        "How would you express that more naturally?",
        "What's your opinion on this?",
        "Can you think of any synonyms?",
      ],
    };

    const levelFollowUps = followUps[context.level] || followUps.A1;
    return levelFollowUps[Math.floor(Math.random() * levelFollowUps.length)];
  }

  /**
   * Generate suggestions based on context
   */
  private generateSuggestions(context: LearnerContext): string[] {
    const suggestions: string[] = [];

    if (context.recentErrors.length > 3) {
      suggestions.push("Practice past tense sentences");
    }
    if (context.weakAreas.includes("listening")) {
      suggestions.push("Try listening to slow English podcasts");
    }
    if (context.weakAreas.includes("speaking")) {
      suggestions.push("Practice speaking with shadowing exercises");
    }

    return suggestions.slice(0, 3);
  }

  /**
   * Fallback response when LLM fails
   */
  private fallbackResponse(message: string, _context: LearnerContext): TutorResponse {
    const lower = message.toLowerCase();

    let response = "";
    if (lower.includes("hello") || lower.includes("hi")) {
      response = "Hello! How are you today?";
    } else if (lower.includes("how are you")) {
      response = "I'm doing well! How about you?";
    } else {
      response = "That's interesting! Can you tell me more?";
    }

    return {
      message: response,
      corrections: [],
      suggestions: [],
      vocabulary: [],
      followUpQuestion: "Can you try saying that in a different way?",
    };
  }

  /**
   * Clear conversation history
   */
  clearHistory(userId: string): void {
    const context = this.getContext(userId);
    context.conversationHistory = [];
  }

  /**
   * Get conversation summary
   */
  getSummary(userId: string): {
    messageCount: number;
    errorCount: number;
    vocabularyLearned: number;
  } {
    const context = this.getContext(userId);
    return {
      messageCount: context.conversationHistory.length,
      errorCount: context.recentErrors.length,
      vocabularyLearned: context.conversationHistory.length * 0.5, // Approximate
    };
  }
}

// ============================================================
// Factory function
// ============================================================

export function createAITutor(providerType: "openai" | "claude" | "mock" = "mock", config?: { apiKey?: string; model?: string }): AITutorV3 {
  let provider: LLMProvider;

  switch (providerType) {
    case "openai":
      provider = new OpenAIProvider(config?.apiKey || "", config?.model);
      break;
    case "claude":
      provider = new ClaudeProvider(config?.apiKey || "", config?.model);
      break;
    default:
      provider = new MockProvider();
  }

  return new AITutorV3(provider);
}
