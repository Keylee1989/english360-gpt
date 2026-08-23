/**
 * AI Tutor v1
 *
 * LLM-powered conversation engine for realistic English practice.
 *
 * Features:
 * - Free conversation with context awareness
 * - Grammar correction with explanations
 * - Vocabulary expansion suggestions
 * - Difficulty control based on learner level
 * - Pronunciation feedback integration
 *
 * Interface:
 * - Designed for future LLM integration
 * - Currently uses rule-based fallback
 * - Provider pattern for easy replacement
 */

// ============================================================
// Types
// ============================================================

export type TutorLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export interface TutorMessage {
  id: string;
  role: "tutor" | "learner";
  content: string;
  translationChinese?: string;
  timestamp: number;

  // For tutor messages
  corrections?: GrammarCorrection[];
  vocabularySuggestions?: VocabularySuggestion[];
  encouragement?: string;

  // For learner messages
  analysis?: MessageAnalysis;
}

export interface GrammarCorrection {
  original: string;
  corrected: string;
  rule: string;
  ruleChinese: string;
  explanation: string;
  explanationChinese: string;
}

export interface VocabularySuggestion {
  word: string;
  meaning: string;
  meaningChinese: string;
  example: string;
  exampleChinese: string;
  level: TutorLevel;
}

export interface MessageAnalysis {
  grammarScore: number; // 0-1
  vocabularyScore: number; // 0-1
  fluencyScore: number; // 0-1
  overallScore: number; // 0-1
  errors: MessageError[];
  suggestions: string[];
}

export interface MessageError {
  type: "grammar" | "vocabulary" | "spelling" | "punctuation";
  original: string;
  corrected: string;
  explanation: string;
  explanationChinese: string;
}

export interface TutorResponse {
  message: TutorMessage;
  analysis: MessageAnalysis;
  nextPrompts: string[];
  sessionAdvice: string[];
}

export interface TutorSession {
  id: string;
  level: TutorLevel;
  topic: string;
  topicChinese: string;
  messages: TutorMessage[];
  score: TutorScore;
  startTime: number;
  endTime?: number;
}

export interface TutorScore {
  overall: number;
  grammar: number;
  vocabulary: number;
  fluency: number;
  improvement: number;
}

export interface LearnerContext {
  userId: string;
  level: TutorLevel;
  recentTopics: string[];
  vocabularyLevel: number;
  grammarLevel: number;
  weakAreas: string[];
  strongAreas: string[];
}

// ============================================================
// AI Tutor Provider Interface
// ============================================================

export interface AITutorProvider {
  name: string;
  generateResponse(
    messages: TutorMessage[],
    context: LearnerContext
  ): Promise<string>;
  isAvailable(): boolean;
}

// ============================================================
// Rule-Based Fallback Provider
// ============================================================

export class RuleBasedTutorProvider implements AITutorProvider {
  name = "rule_based";

  isAvailable(): boolean {
    return true;
  }

  async generateResponse(
    messages: TutorMessage[],
    context: LearnerContext
  ): Promise<string> {
    const lastMessage = messages[messages.length - 1];
    const learnerMessage = lastMessage?.role === "learner" ? lastMessage.content.toLowerCase() : "";

    // Generate response based on patterns
    if (learnerMessage.includes("hello") || learnerMessage.includes("hi")) {
      return this.getGreetingResponse(context);
    }

    if (learnerMessage.includes("how are you")) {
      return this.getHowAreYouResponse(context);
    }

    if (learnerMessage.includes("thank")) {
      return this.getThankYouResponse(context);
    }

    if (learnerMessage.includes("bye") || learnerMessage.includes("goodbye")) {
      return this.getGoodbyeResponse(context);
    }

    if (learnerMessage.includes("what") || learnerMessage.includes("where") || learnerMessage.includes("when")) {
      return this.getQuestionResponse(context);
    }

    // Default response with encouragement
    return this.getDefaultResponse(context);
  }

  private getGreetingResponse(_context: LearnerContext): string {
    const responses = [
      "Hello! How can I help you practice English today?",
      "Hi there! What would you like to talk about?",
      "Hello! Nice to see you. Let's practice some English!",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private getHowAreYouResponse(_context: LearnerContext): string {
    return "I'm doing great, thank you for asking! How about you? How are you today?";
  }

  private getThankYouResponse(_context: LearnerContext): string {
    return "You're welcome! Is there anything else you'd like to practice?";
  }

  private getGoodbyeResponse(_context: LearnerContext): string {
    return "Goodbye! Great job practicing today. See you next time!";
  }

  private getQuestionResponse(_context: LearnerContext): string {
    return "That's a good question! Let me help you with that. Could you tell me more about what you're looking for?";
  }

  private getDefaultResponse(_context: LearnerContext): string {
    return "That's interesting! Could you tell me more? Try to use complete sentences.";
  }
}

// ============================================================
// AI Tutor Engine
// ============================================================

export class AITutorV1 {
  private providers: AITutorProvider[] = [];
  private sessions: Map<string, TutorSession> = new Map();

  constructor() {
    // Add default rule-based provider
    this.providers.push(new RuleBasedTutorProvider());
  }

  /**
   * Register a tutor provider
   */
  registerProvider(provider: AITutorProvider): void {
    this.providers.push(provider);
  }

  /**
   * Start a new tutoring session
   */
  startSession(
    level: TutorLevel,
    topic: string,
    topicChinese: string
  ): TutorSession {
    const session: TutorSession = {
      id: `tutor_${Date.now()}`,
      level,
      topic,
      topicChinese,
      messages: [],
      score: {
        overall: 0,
        grammar: 0,
        vocabulary: 0,
        fluency: 0,
        improvement: 0,
      },
      startTime: Date.now(),
    };

    this.sessions.set(session.id, session);
    return session;
  }

  /**
   * Chat with the AI tutor
   */
  async chat(
    sessionId: string,
    message: string,
    context: LearnerContext
  ): Promise<TutorResponse> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    // Analyze learner message
    const analysis = this.analyzeMessage(message, context);

    // Create learner message
    const learnerMessage: TutorMessage = {
      id: `msg_${Date.now()}`,
      role: "learner",
      content: message,
      timestamp: Date.now(),
      analysis,
    };
    session.messages.push(learnerMessage);

    // Generate tutor response
    const tutorResponse = await this.generateTutorResponse(session, context);

    // Create tutor message
    const tutorMessage: TutorMessage = {
      id: `msg_${Date.now() + 1}`,
      role: "tutor",
      content: tutorResponse.content,
      translationChinese: tutorResponse.translationChinese,
      timestamp: Date.now(),
      corrections: tutorResponse.corrections,
      vocabularySuggestions: tutorResponse.vocabularySuggestions,
      encouragement: tutorResponse.encouragement,
    };
    session.messages.push(tutorMessage);

    // Update session score
    this.updateSessionScore(session, analysis);

    // Generate next prompts
    const nextPrompts = this.generateNextPrompts(session, context);

    // Generate session advice
    const sessionAdvice = this.generateSessionAdvice(session, context);

    return {
      message: tutorMessage,
      analysis,
      nextPrompts,
      sessionAdvice,
    };
  }

  /**
   * Analyze learner message
   */
  private analyzeMessage(message: string, context: LearnerContext): MessageAnalysis {
    const errors: MessageError[] = [];
    const suggestions: string[] = [];

    // Simple grammar checks
    const grammarScore = this.checkGrammar(message, errors);
    const vocabularyScore = this.checkVocabulary(message, context);
    const fluencyScore = this.checkFluency(message);

    // Overall score
    const overallScore = (grammarScore + vocabularyScore + fluencyScore) / 3;

    // Generate suggestions
    if (grammarScore < 0.7) {
      suggestions.push("Try to use correct grammar structures");
    }
    if (vocabularyScore < 0.7) {
      suggestions.push("Try to use more varied vocabulary");
    }
    if (fluencyScore < 0.7) {
      suggestions.push("Try to use complete sentences");
    }

    return {
      grammarScore,
      vocabularyScore,
      fluencyScore,
      overallScore,
      errors,
      suggestions,
    };
  }

  /**
   * Check grammar
   */
  private checkGrammar(message: string, errors: MessageError[]): number {
    let score = 1;
    const lowerMessage = message.toLowerCase();

    // Check for common mistakes
    if (lowerMessage.match(/\bi\b/) && !lowerMessage.match(/\bi\s+(am|was|have|do|can|will|like|want|need)\b/)) {
      // Simple subject-verb check
    }

    // Check for missing articles
    if (lowerMessage.match(/\b(have|want|need)\s+(book|car|house|idea)\b/)) {
      errors.push({
        type: "grammar",
        original: message,
        corrected: message.replace(/(have|want|need)\s+(book|car|house|idea)/gi, "$1 a $2"),
        explanation: "Use 'a' before singular countable nouns",
        explanationChinese: "在单数可数名词前使用 'a'",
      });
      score -= 0.2;
    }

    return Math.max(0, score);
  }

  /**
   * Check vocabulary
   */
  private checkVocabulary(message: string, _context: LearnerContext): number {
    // Simple vocabulary check
    const words = message.split(/\s+/).length;
    if (words < 3) return 0.5;
    return 0.8;
  }

  /**
   * Check fluency
   */
  private checkFluency(message: string): number {
    const words = message.split(/\s+/).length;
    if (words < 3) return 0.4;
    if (words < 5) return 0.6;
    if (words < 10) return 0.8;
    return 1;
  }

  /**
   * Generate tutor response
   */
  private async generateTutorResponse(
    session: TutorSession,
    context: LearnerContext
  ): Promise<{
    content: string;
    translationChinese?: string;
    corrections?: GrammarCorrection[];
    vocabularySuggestions?: VocabularySuggestion[];
    encouragement?: string;
  }> {
    // Try providers in order
    for (const provider of this.providers) {
      if (provider.isAvailable()) {
        try {
          const response = await provider.generateResponse(session.messages, context);
          return {
            content: response,
            translationChinese: this.generateTranslation(response),
            corrections: this.extractCorrections(session.messages),
            vocabularySuggestions: this.generateVocabularySuggestions(session, context),
            encouragement: this.generateEncouragement(session),
          };
        } catch {
          continue;
        }
      }
    }

    // Fallback response
    return {
      content: "That's good! Keep practicing. Could you tell me more?",
      translationChinese: "很好！继续练习。能告诉我更多吗？",
      encouragement: "Great effort! 你做得很好！",
    };
  }

  /**
   * Generate translation
   */
  private generateTranslation(_text: string): string {
    // Simple translation placeholder
    return "[翻译]";
  }

  /**
   * Extract corrections from messages
   */
  private extractCorrections(messages: TutorMessage[]): GrammarCorrection[] {
    const corrections: GrammarCorrection[] = [];
    for (const msg of messages) {
      if (msg.analysis?.errors) {
        for (const error of msg.analysis.errors) {
          corrections.push({
            original: error.original,
            corrected: error.corrected,
            rule: error.explanation,
            ruleChinese: error.explanationChinese,
            explanation: error.explanation,
            explanationChinese: error.explanationChinese,
          });
        }
      }
    }
    return corrections;
  }

  /**
   * Generate vocabulary suggestions
   */
  private generateVocabularySuggestions(
    _session: TutorSession,
    context: LearnerContext
  ): VocabularySuggestion[] {
    const suggestions: VocabularySuggestion[] = [];

    // Add level-appropriate vocabulary
    if (context.level === "A1" || context.level === "A2") {
      suggestions.push({
        word: "enjoy",
        meaning: "to like something",
        meaningChinese: "享受，喜欢",
        example: "I enjoy reading books.",
        exampleChinese: "我喜欢读书。",
        level: "A1",
      });
    }

    return suggestions;
  }

  /**
   * Generate encouragement
   */
  private generateEncouragement(_session: TutorSession): string {
    return "Great start! 你开始得很好！";
  }

  /**
   * Generate next prompts
   */
  private generateNextPrompts(
    _session: TutorSession,
    context: LearnerContext
  ): string[] {
    const prompts: string[] = [];

    if (context.level === "A1") {
      prompts.push("Can you introduce yourself?");
      prompts.push("What is your name?");
      prompts.push("Where are you from?");
    } else if (context.level === "A2") {
      prompts.push("What did you do yesterday?");
      prompts.push("Tell me about your family.");
      prompts.push("What is your favorite food?");
    } else {
      prompts.push("What are your goals for learning English?");
      prompts.push("Tell me about a recent experience.");
      prompts.push("What challenges do you face when speaking English?");
    }

    return prompts;
  }

  /**
   * Generate session advice
   */
  private generateSessionAdvice(
    session: TutorSession,
    _context: LearnerContext
  ): string[] {
    const advice: string[] = [];

    if (session.score.grammar < 0.6) {
      advice.push("Focus on basic grammar structures");
    }
    if (session.score.vocabulary < 0.6) {
      advice.push("Try to use more varied vocabulary");
    }
    if (session.score.fluency < 0.6) {
      advice.push("Practice speaking in complete sentences");
    }

    if (advice.length === 0) {
      advice.push("Great job! Keep practicing regularly");
    }

    return advice;
  }

  /**
   * Update session score
   */
  private updateSessionScore(session: TutorSession, analysis: MessageAnalysis): void {
    const messageCount = session.messages.filter(m => m.role === "learner").length;

    // Update running averages
    session.score.grammar = (session.score.grammar * (messageCount - 1) + analysis.grammarScore) / messageCount;
    session.score.vocabulary = (session.score.vocabulary * (messageCount - 1) + analysis.vocabularyScore) / messageCount;
    session.score.fluency = (session.score.fluency * (messageCount - 1) + analysis.fluencyScore) / messageCount;
    session.score.overall = (session.score.grammar + session.score.vocabulary + session.score.fluency) / 3;

    // Calculate improvement
    if (messageCount > 1) {
      const previousScore = session.score.overall;
      session.score.improvement = analysis.overallScore - previousScore;
    }
  }

  /**
   * End session
   */
  endSession(sessionId: string): TutorSession | undefined {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.endTime = Date.now();
    }
    return session;
  }

  /**
   * Get session by ID
   */
  getSession(id: string): TutorSession | undefined {
    return this.sessions.get(id);
  }

  /**
   * Get all sessions
   */
  getAllSessions(): TutorSession[] {
    return Array.from(this.sessions.values());
  }
}
