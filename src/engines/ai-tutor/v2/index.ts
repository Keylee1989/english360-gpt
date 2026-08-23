/**
 * AI Tutor v2
 *
 * Upgraded with LLM provider interface for real AI conversations:
 * - OpenAI compatible API
 * - Claude compatible API
 * - Local mock fallback
 *
 * Features:
 * - Conversation memory
 * - Real-time correction
 * - Context-aware responses
 * - Difficulty adjustment
 */

// ============================================================
// Types
// ============================================================

export type TutorLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export interface LLMProvider {
  name: string;
  chat(messages: LLMMessage[], options?: LLMOptions): Promise<string>;
  isAvailable(): boolean;
}

export interface LLMMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface LLMOptions {
  temperature?: number;
  maxTokens?: number;
  model?: string;
}

export interface ConversationContext {
  userId: string;
  level: TutorLevel;
  topic: string;
  vocabularyLevel: number;
  grammarLevel: number;
  weakAreas: string[];
  learnedWords: string[];
  recentErrors: string[];
  interests: string[];
}

export interface TutorResponse {
  message: string;
  correction?: GrammarCorrection;
  vocabulary?: VocabularySuggestion[];
  encouragement?: string;
  nextPrompts?: string[];
}

export interface GrammarCorrection {
  original: string;
  corrected: string;
  rule: string;
  ruleChinese: string;
  explanation: string;
  explanationChinese: string;
  practiceExercises: string[];
}

export interface VocabularySuggestion {
  word: string;
  meaning: string;
  meaningChinese: string;
  example: string;
  level: TutorLevel;
}

export interface ConversationHistory {
  id: string;
  messages: LLMMessage[];
  startTime: number;
  endTime?: number;
}

// ============================================================
// OpenAI Compatible Provider
// ============================================================

export class OpenAIProvider implements LLMProvider {
  name = "openai";
  private apiKey: string;
  private baseUrl: string;
  private model: string;

  constructor(apiKey: string, baseUrl = "https://api.openai.com/v1", model = "gpt-3.5-turbo") {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
    this.model = model;
  }

  isAvailable(): boolean {
    return !!this.apiKey;
  }

  async chat(messages: LLMMessage[], options?: LLMOptions): Promise<string> {
    if (!this.isAvailable()) {
      throw new Error("OpenAI API key not configured");
    }

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: options?.model || this.model,
        messages,
        temperature: options?.temperature || 0.7,
        max_tokens: options?.maxTokens || 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }
}

// ============================================================
// Claude Compatible Provider
// ============================================================

export class ClaudeProvider implements LLMProvider {
  name = "claude";
  private apiKey: string;
  private baseUrl: string;
  private model: string;

  constructor(apiKey: string, baseUrl = "https://api.anthropic.com", model = "claude-3-haiku-20240307") {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
    this.model = model;
  }

  isAvailable(): boolean {
    return !!this.apiKey;
  }

  async chat(messages: LLMMessage[], options?: LLMOptions): Promise<string> {
    if (!this.isAvailable()) {
      throw new Error("Claude API key not configured");
    }

    const systemMessage = messages.find(m => m.role === "system");
    const conversationMessages = messages.filter(m => m.role !== "system");

    const response = await fetch(`${this.baseUrl}/v1/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: options?.model || this.model,
        max_tokens: options?.maxTokens || 500,
        system: systemMessage?.content,
        messages: conversationMessages,
      }),
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data = await response.json();
    return data.content[0].text;
  }
}

// ============================================================
// Mock Provider (for testing)
// ============================================================

export class MockLLMProvider implements LLMProvider {
  name = "mock";

  isAvailable(): boolean {
    return true;
  }

  async chat(messages: LLMMessage[], _options?: LLMOptions): Promise<string> {
    const lastMessage = messages[messages.length - 1];
    const content = lastMessage?.content?.toLowerCase() || "";

    // Simple pattern matching for mock responses
    if (content.includes("hello") || content.includes("hi")) {
      return "Hello! How can I help you practice English today?";
    }
    if (content.includes("how are you")) {
      return "I'm doing great, thank you! How about you?";
    }
    if (content.includes("thank")) {
      return "You're welcome! Is there anything else you'd like to practice?";
    }
    if (content.includes("bye") || content.includes("goodbye")) {
      return "Goodbye! Great job practicing today!";
    }

    return "That's interesting! Could you tell me more? Try to use complete sentences.";
  }
}

// ============================================================
// AI Tutor v2 Engine
// ============================================================

export class AITutorV2 {
  private providers: LLMProvider[] = [];
  private conversations: Map<string, ConversationHistory> = new Map();
  private contextMap: Map<string, ConversationContext> = new Map();

  constructor() {
    // Add mock provider as fallback
    this.providers.push(new MockLLMProvider());
  }

  /**
   * Register LLM provider
   */
  registerProvider(provider: LLMProvider): void {
    this.providers.push(provider);
  }

  /**
   * Set conversation context
   */
  setContext(userId: string, context: ConversationContext): void {
    this.contextMap.set(userId, context);
  }

  /**
   * Get conversation context
   */
  getContext(userId: string): ConversationContext | undefined {
    return this.contextMap.get(userId);
  }

  /**
   * Start new conversation
   */
  startConversation(userId: string, topic: string): ConversationHistory {
    const context = this.contextMap.get(userId);
    const level = context?.level || "A1";

    const systemMessage = this.generateSystemPrompt(level, topic, context);
    const conversation: ConversationHistory = {
      id: `conv_${Date.now()}`,
      messages: [{ role: "system", content: systemMessage }],
      startTime: Date.now(),
    };

    this.conversations.set(userId, conversation);
    return conversation;
  }

  /**
   * Generate system prompt
   */
  private generateSystemPrompt(level: TutorLevel, topic: string, context?: ConversationContext): string {
    let prompt = `You are an English tutor helping a ${level} level Chinese learner.`;
    prompt += `\nTopic: ${topic}`;
    prompt += `\n\nRules:`;
    prompt += `\n- Use simple English appropriate for ${level} level`;
    prompt += `\n- If the student makes a mistake, correct it gently`;
    prompt += `\n- Explain corrections in Chinese`;
    prompt += `\n- Encourage the student`;
    prompt += `\n- Ask follow-up questions to continue the conversation`;

    if (context?.weakAreas.length) {
      prompt += `\n- Focus on: ${context.weakAreas.join(", ")}`;
    }

    if (context?.learnedWords.length) {
      prompt += `\n- Student knows: ${context.learnedWords.slice(0, 20).join(", ")}`;
    }

    return prompt;
  }

  /**
   * Chat with AI tutor
   */
  async chat(userId: string, message: string): Promise<TutorResponse> {
    const conversation = this.conversations.get(userId);
    if (!conversation) {
      throw new Error(`No conversation found for user: ${userId}`);
    }

    // Add user message
    conversation.messages.push({ role: "user", content: message });

    // Get AI response
    const response = await this.generateResponse(conversation.messages);

    // Add assistant message
    conversation.messages.push({ role: "assistant", content: response });

    // Analyze and correct
    const correction = this.analyzeAndCorrect(message, response);
    const vocabulary = this.suggestVocabulary(message);
    const encouragement = this.generateEncouragement(response);
    const nextPrompts = this.generateNextPrompts(userId);

    return {
      message: response,
      correction: correction || undefined,
      vocabulary,
      encouragement,
      nextPrompts,
    };
  }

  /**
   * Generate response using available provider
   */
  private async generateResponse(messages: LLMMessage[]): Promise<string> {
    for (const provider of this.providers) {
      if (provider.isAvailable()) {
        try {
          return await provider.chat(messages);
        } catch {
          continue;
        }
      }
    }

    // Fallback response
    return "I understand. Could you tell me more about that?";
  }

  /**
   * Analyze and correct grammar
   */
  private analyzeAndCorrect(userMessage: string, _aiResponse: string): GrammarCorrection | null {

    // Simple grammar checks
    const corrections: Array<{
      pattern: RegExp;
      correction: string;
      rule: string;
      ruleChinese: string;
      explanation: string;
      explanationChinese: string;
    }> = [
      {
        pattern: /\bi\b(?!\s+(?:am|was|have|do|can|will|like|want|need|went|saw|ate))/gi,
        correction: userMessage.replace(/\bi\b/g, "I"),
        rule: "Capital 'I'",
        ruleChinese: "大写'I'",
        explanation: "Always capitalize the pronoun 'I'",
        explanationChinese: "代词'I'永远大写",
      },
      {
        pattern: /\b(yesterday|last week|ago)\b.*\b(go|like|want|have|see|eat)\b/gi,
        correction: userMessage,
        rule: "Past tense",
        ruleChinese: "过去时",
        explanation: "Use past tense for past time expressions",
        explanationChinese: "过去时间用过去式",
      },
    ];

    for (const { pattern, correction, rule, ruleChinese, explanation, explanationChinese } of corrections) {
      if (pattern.test(userMessage)) {
        return {
          original: userMessage,
          corrected: correction,
          rule,
          ruleChinese,
          explanation,
          explanationChinese,
          practiceExercises: [
            `Try: ${correction}`,
            `Practice with similar sentences`,
          ],
        };
      }
    }

    return null;
  }

  /**
   * Suggest vocabulary
   */
  private suggestVocabulary(message: string): VocabularySuggestion[] {
    const suggestions: VocabularySuggestion[] = [];
    const lowerMessage = message.toLowerCase();

    // Suggest better words
    const vocabularyMap: Array<{
      simple: string;
      better: string;
      meaning: string;
      meaningChinese: string;
      example: string;
    }> = [
      { simple: "good", better: "excellent", meaning: "very good", meaningChinese: "优秀的", example: "The food was excellent." },
      { simple: "bad", better: "terrible", meaning: "very bad", meaningChinese: "糟糕的", example: "The weather was terrible." },
      { simple: "like", better: "enjoy", meaning: "to take pleasure in", meaningChinese: "享受", example: "I enjoy reading books." },
    ];

    for (const { simple, better, meaning, meaningChinese, example } of vocabularyMap) {
      if (lowerMessage.includes(simple) && !lowerMessage.includes(better)) {
        suggestions.push({
          word: better,
          meaning,
          meaningChinese,
          example,
          level: "A2",
        });
      }
    }

    return suggestions.slice(0, 2);
  }

  /**
   * Generate encouragement
   */
  private generateEncouragement(response: string): string {
    if (response.includes("great") || response.includes("excellent")) {
      return "Great job! 你做得很好！";
    }
    if (response.includes("good")) {
      return "Good effort! 继续加油！";
    }
    return "Keep practicing! 坚持就是胜利！";
  }

  /**
   * Generate next prompts
   */
  private generateNextPrompts(userId: string): string[] {
    const context = this.contextMap.get(userId);
    const level = context?.level || "A1";

    if (level === "A1") {
      return [
        "Can you introduce yourself?",
        "What is your name?",
        "Where are you from?",
      ];
    }
    if (level === "A2") {
      return [
        "What did you do yesterday?",
        "Tell me about your family.",
        "What is your favorite food?",
      ];
    }
    return [
      "What are your goals for learning English?",
      "Tell me about a recent experience.",
      "What challenges do you face when speaking English?",
    ];
  }

  /**
   * Get conversation history
   */
  getConversation(userId: string): ConversationHistory | undefined {
    return this.conversations.get(userId);
  }

  /**
   * End conversation
   */
  endConversation(userId: string): ConversationHistory | undefined {
    const conversation = this.conversations.get(userId);
    if (conversation) {
      conversation.endTime = Date.now();
    }
    return conversation;
  }
}
