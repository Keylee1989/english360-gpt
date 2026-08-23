/**
 * AI Tutor v4 — Teacher Mode
 *
 * Upgrades AI from chatbot to English teacher.
 *
 * Features:
 * - Teacher Mode (proactive teaching)
 * - Error pattern detection
 * - Personalized practice generation
 * - Progress-aware responses
 * - Teaching methodology
 */

// ============================================================
// Types
// ============================================================

export interface TeacherContext {
  userId: string;
  level: "A1" | "A2" | "B1" | "B2";
  currentDay: number;
  currentLesson?: string;
  vocabularyLevel: number;
  grammarLevel: number;
  weakAreas: string[];
  errorPatterns: ErrorPattern[];
  recentErrors: GrammarError[];
  vocabularyState: VocabularyState[];
  conversationHistory: ConversationMessage[];
  learningGoals: string[];
}

export interface ErrorPattern {
  type: string;
  count: number;
  lastSeen: number;
  examples: string[];
}

export interface GrammarError {
  original: string;
  corrected: string;
  rule: string;
  ruleChinese: string;
  timestamp: number;
}

export interface VocabularyState {
  word: string;
  mastery: number;
  lastReview: number;
  nextReview: number;
}

export interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  corrections?: GrammarError[];
}

export interface TeacherResponse {
  message: string;
  corrections: GrammarError[];
  explanation: string;
  explanationChinese: string;
  practice: PracticeExercise[];
  followUpQuestion: string;
  nextRecommendation: string;
  encouragement: string;
}

export interface PracticeExercise {
  type: "repeat" | "transform" | "fill_blank" | "create";
  instruction: string;
  instructionChinese: string;
  example: string;
  expectedAnswer: string;
}

// ============================================================
// LLM Provider Interface
// ============================================================

export interface LLMProvider {
  name: string;
  chat(messages: { role: string; content: string }[]): Promise<string>;
}

// ============================================================
// Mock Provider (for testing)
// ============================================================

export class MockTeacherProvider implements LLMProvider {
  name = "mock_teacher";

  async chat(messages: { role: string; content: string }[]): Promise<string> {
    const lastMessage = messages[messages.length - 1]?.content || "";
    const lower = lastMessage.toLowerCase();

    // Grammar correction responses
    if (lower.includes("yesterday") && lower.includes("go")) {
      return `I see you said "I go yesterday." 

Let me help you with this:

Correction: "I went yesterday."
Explanation: When we talk about yesterday (past time), we use past tense verbs.
Practice: Can you say "I went to school yesterday."?`;
    }

    if (lower.includes("very like")) {
      return `Good try! But we say "I really like" not "I very like."

In English:
- "very" is used with adjectives (very good, very big)
- "really" is used with verbs (really like, really want)

Practice: Say "I really like English."`;
    }

    // Default teaching response
    return `That's a good sentence! 

Let me teach you something:
In English, we often add more details to make sentences interesting.

For example:
- "I like food." → "I really like Chinese food."
- "It is good." → "It is very delicious."

Can you try making your sentence more detailed?`;
  }
}

// ============================================================
// AI Tutor v4 — Teacher Mode
// ============================================================

export class AITutorV4 {
  private provider: LLMProvider;
  private contexts: Map<string, TeacherContext> = new Map();

  constructor(provider?: LLMProvider) {
    this.provider = provider || new MockTeacherProvider();
  }

  /**
   * Set the LLM provider
   */
  setProvider(provider: LLMProvider): void {
    this.provider = provider;
  }

  /**
   * Initialize or get teacher context
   */
  getContext(userId: string): TeacherContext {
    if (!this.contexts.has(userId)) {
      this.contexts.set(userId, {
        userId,
        level: "A1",
        currentDay: 1,
        vocabularyLevel: 30,
        grammarLevel: 30,
        weakAreas: [],
        errorPatterns: [],
        recentErrors: [],
        vocabularyState: [],
        conversationHistory: [],
        learningGoals: [],
      });
    }
    return this.contexts.get(userId)!;
  }

  /**
   * Update teacher context
   */
  updateContext(userId: string, updates: Partial<TeacherContext>): void {
    const context = this.getContext(userId);
    Object.assign(context, updates);
  }

  /**
   * Teacher response (main teaching method)
   */
  async teach(userId: string, message: string): Promise<TeacherResponse> {
    const context = this.getContext(userId);

    // Add user message to history
    context.conversationHistory.push({
      role: "user",
      content: message,
      timestamp: Date.now(),
    });

    // Detect errors
    const corrections = this.detectErrors(message, context);

    // Update error patterns
    this.updateErrorPatterns(corrections, context);

    // Build teaching system prompt
    const systemPrompt = this.buildTeachingPrompt(context);

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
        corrections,
      });

      // Generate teaching components
      const explanation = this.generateExplanation(response, context);
      const practice = this.generatePractice(message, corrections, context);
      const followUp = this.generateFollowUp(context);
      const recommendation = this.generateRecommendation(context);
      const encouragement = this.generateEncouragement(context);

      return {
        message: response,
        corrections,
        explanation,
        explanationChinese: this.translateToChinese(explanation),
        practice,
        followUpQuestion: followUp,
        nextRecommendation: recommendation,
        encouragement,
      };
    } catch (error) {
      console.error("AI Tutor teach failed:", error);
      return this.fallbackTeaching(message, corrections, context);
    }
  }

  /**
   * Build teaching system prompt
   */
  private buildTeachingPrompt(context: TeacherContext): string {
    const levelDescriptions: Record<string, string> = {
      A1: "a complete beginner who knows only basic words",
      A2: "an elementary learner who can handle simple conversations",
      B1: "an intermediate learner who can communicate in most situations",
      B2: "an upper-intermediate learner who can use English fluently",
    };

    const errorSummary = context.errorPatterns
      .slice(0, 5)
      .map((e) => `${e.type}: ${e.count} times`)
      .join(", ");

    return `You are an expert English teacher for Chinese native speakers.

The student is ${levelDescriptions[context.level] || levelDescriptions.A1}.
They are on Day ${context.currentDay} of learning.
Their weak areas: ${context.weakAreas.join(", ") || "not identified yet"}
Their common errors: ${errorSummary || "none yet"}

Teaching Rules:
1. Always correct mistakes gently
2. Explain WHY the correction is needed
3. Give the rule in both English and Chinese
4. Provide practice exercises
5. Encourage the student
6. Build on what they already know
7. Use simple language appropriate for their level
8. Be patient and supportive

When the student makes a mistake:
- Show the original sentence
- Show the corrected sentence
- Explain the grammar rule
- Give 1-2 similar practice sentences

When the student is correct:
- Praise them
- Suggest a more natural expression
- Introduce a related vocabulary word

Always end with either:
- A practice exercise
- A follow-up question
- A recommendation for what to study next`;
  }

  /**
   * Detect grammar errors
   */
  private detectErrors(message: string, context: TeacherContext): GrammarError[] {
    const errors: GrammarError[] = [];

    // Past tense errors
    const pastIndicators = ["yesterday", "last", "ago", "before"];
    const hasPastIndicator = pastIndicators.some((word) =>
      message.toLowerCase().includes(word)
    );

    if (hasPastIndicator) {
      const presentVerbs = ["go", "come", "eat", "see", "buy", "take", "make", "have", "do", "run", "play", "want", "like", "need"];
      for (const verb of presentVerbs) {
        const regex = new RegExp(`\\b${verb}\\b`, "i");
        if (regex.test(message)) {
          const pastForm = this.getPastForm(verb);
          errors.push({
            original: message,
            corrected: message.replace(regex, pastForm),
            rule: "Past tense required with past time indicators",
            ruleChinese: "表示过去时间的词需要使用过去式",
            timestamp: Date.now(),
          });
          break;
        }
      }
    }

    // Article errors
    const articlePattern = /\b(have|want|need|like|see|buy)\s+(book|car|house|idea|apple|cat|dog|phone)\b/gi;
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

    // "Very like" error
    if (message.toLowerCase().includes("very like")) {
      errors.push({
        original: message,
        corrected: message.replace(/very like/gi, "really like"),
        rule: "Use 'really' with verbs, 'very' with adjectives",
        ruleChinese: "动词用really，形容词用very",
        timestamp: Date.now(),
      });
    }

    // Store errors in context
    context.recentErrors.push(...errors);
    if (context.recentErrors.length > 20) {
      context.recentErrors = context.recentErrors.slice(-20);
    }

    return errors;
  }

  /**
   * Get past tense form
   */
  private getPastForm(verb: string): string {
    const pastForms: Record<string, string> = {
      go: "went",
      come: "came",
      eat: "ate",
      see: "saw",
      buy: "bought",
      take: "took",
      make: "made",
      have: "had",
      do: "did",
      run: "ran",
      play: "played",
      want: "wanted",
      like: "liked",
      need: "needed",
    };
    return pastForms[verb.toLowerCase()] || verb + "ed";
  }

  /**
   * Update error patterns
   */
  private updateErrorPatterns(errors: GrammarError[], context: TeacherContext): void {
    for (const error of errors) {
      const existing = context.errorPatterns.find((p) => p.type === error.rule);
      if (existing) {
        existing.count++;
        existing.lastSeen = Date.now();
        if (!existing.examples.includes(error.original)) {
          existing.examples.push(error.original);
        }
      } else {
        context.errorPatterns.push({
          type: error.rule,
          count: 1,
          lastSeen: Date.now(),
          examples: [error.original],
        });
      }
    }

    // Sort by count (most common first)
    context.errorPatterns.sort((a, b) => b.count - a.count);
  }

  /**
   * Generate explanation
   */
  private generateExplanation(_response: string, context: TeacherContext): string {
    if (context.errorPatterns.length > 0) {
      const topError = context.errorPatterns[0];
      return `Based on your recent errors, focus on: ${topError.type}. You've made this mistake ${topError.count} times.`;
    }
    return "Keep practicing! You're doing well.";
  }

  /**
   * Generate practice exercises
   */
  private generatePractice(
    message: string,
    errors: GrammarError[],
    _context: TeacherContext
  ): PracticeExercise[] {
    const exercises: PracticeExercise[] = [];

    if (errors.length > 0) {
      // Generate practice for the error
      exercises.push({
        type: "repeat",
        instruction: "Repeat the corrected sentence",
        instructionChinese: "重复正确的句子",
        example: errors[0].corrected,
        expectedAnswer: errors[0].corrected,
      });

      exercises.push({
        type: "create",
        instruction: "Create a similar sentence using past tense",
        instructionChinese: "用过去式造一个类似的句子",
        example: "I went to school yesterday.",
        expectedAnswer: "I went to [place] yesterday.",
      });
    } else {
      // General practice
      exercises.push({
        type: "transform",
        instruction: "Make your sentence more detailed",
        instructionChinese: "让你的句子更详细",
        example: message,
        expectedAnswer: `${message} (with more details)`,
      });
    }

    return exercises;
  }

  /**
   * Generate follow-up question
   */
  private generateFollowUp(context: TeacherContext): string {
    const followUps: Record<string, string[]> = {
      A1: [
        "Can you say that again in a complete sentence?",
        "What else can you tell me?",
        "Can you use a new word I taught you?",
      ],
      A2: [
        "Can you give me an example?",
        "How would you say that differently?",
        "What do you think about that?",
      ],
      B1: [
        "That's interesting! Can you elaborate?",
        "How would you express that more naturally?",
        "What's your opinion on this?",
      ],
    };

    const levelFollowUps = followUps[context.level] || followUps.A1;
    return levelFollowUps[Math.floor(Math.random() * levelFollowUps.length)];
  }

  /**
   * Generate next recommendation
   */
  private generateRecommendation(context: TeacherContext): string {
    if (context.errorPatterns.length > 0) {
      const topError = context.errorPatterns[0];
      return `Practice focus: ${topError.type}. Review this grammar rule.`;
    }

    if (context.weakAreas.includes("listening")) {
      return "Try listening to slow English podcasts for 15 minutes.";
    }

    if (context.weakAreas.includes("speaking")) {
      return "Practice shadowing for 10 minutes today.";
    }

    return "Keep up the good work! Continue with today's lesson.";
  }

  /**
   * Generate encouragement
   */
  private generateEncouragement(context: TeacherContext): string {
    const encouragements = [
      "Great job! You're making progress!",
      "Keep going! Every sentence helps you improve!",
      "Excellent effort! Your English is getting better!",
      "Well done! You're learning fast!",
      "Nice work! Keep practicing!",
    ];

    // Add streak-based encouragement
    if (context.currentDay > 7) {
      return `Amazing! You've been learning for ${context.currentDay} days! ${encouragements[Math.floor(Math.random() * encouragements.length)]}`;
    }

    return encouragements[Math.floor(Math.random() * encouragements.length)];
  }

  /**
   * Translate to Chinese
   */
  private translateToChinese(text: string): string {
    // Simple translation for common phrases
    const translations: Record<string, string> = {
      "Keep practicing!": "继续练习！",
      "You're doing well.": "你做得很好。",
      "Focus on": "专注于",
      "Review this grammar rule.": "复习这个语法规则。",
    };

    for (const [eng, chn] of Object.entries(translations)) {
      if (text.includes(eng)) {
        return text.replace(eng, chn);
      }
    }

    return text; // Return original if no translation found
  }

  /**
   * Fallback teaching response
   */
  private fallbackTeaching(
    _message: string,
    corrections: GrammarError[],
    _context: TeacherContext
  ): TeacherResponse {
    let response = "";
    if (corrections.length > 0) {
      response = `Good try! I noticed a small mistake. Let me help you correct it.`;
    } else {
      response = `That's a good sentence! Keep practicing.`;
    }

    return {
      message: response,
      corrections,
      explanation: "Keep practicing to improve your English.",
      explanationChinese: "继续练习以提高你的英语。",
      practice: [],
      followUpQuestion: "Can you try saying that again?",
      nextRecommendation: "Practice today's vocabulary.",
      encouragement: "You're doing great!",
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
   * Get teaching summary
   */
  getTeachingSummary(userId: string): {
    messageCount: number;
    errorCount: number;
    topErrors: string[];
    vocabularyLearned: number;
  } {
    const context = this.getContext(userId);
    return {
      messageCount: context.conversationHistory.length,
      errorCount: context.recentErrors.length,
      topErrors: context.errorPatterns.slice(0, 3).map((p) => p.type),
      vocabularyLearned: Math.floor(context.conversationHistory.length * 0.5),
    };
  }
}

// ============================================================
// Factory function
// ============================================================

export function createTeacherTutor(provider?: LLMProvider): AITutorV4 {
  return new AITutorV4(provider || new MockTeacherProvider());
}
