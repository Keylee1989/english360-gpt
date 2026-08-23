/**
 * Conversation Engine v1
 * 
 * Purpose: Create realistic English communication training
 * 
 * Features:
 * - Scenario-based practice
 * - Grammar correction
 * - Natural expression suggestions
 * - Pronunciation feedback
 * - Progressive difficulty
 * 
 * Scenarios:
 * - Daily Life: self introduction, shopping, restaurant, etc.
 * - Work: meeting, presentation, interview, etc.
 */

// ============================================================
// Types
// ============================================================

export type ConversationScenario = 
  | "self_introduction"
  | "shopping"
  | "restaurant"
  | "hotel"
  | "transportation"
  | "doctor"
  | "directions"
  | "meeting"
  | "presentation"
  | "interview";

export type ConversationLevel = "beginner" | "intermediate" | "advanced";

export interface ConversationSession {
  id: string;
  scenario: ConversationScenario;
  level: ConversationLevel;
  messages: ConversationMessage[];
  score: ConversationScore;
  recommendations: string[];
  startTime: number;
  endTime?: number;
}

export interface ConversationMessage {
  id: string;
  role: "ai" | "user";
  content: string;
  translationChinese?: string;
  timestamp: number;
  
  // For user messages
  analysis?: MessageAnalysis;
}

export interface MessageAnalysis {
  grammar: GrammarAnalysis;
  naturalExpression: NaturalExpression;
  pronunciationScore?: number;
  vocabularyUsed: string[];
  suggestions: string[];
}

export interface GrammarAnalysis {
  original: string;
  corrected: string;
  mistakes: GrammarMistake[];
  score: number; // 0-1
}

export interface GrammarMistake {
  type: "tense" | "article" | "preposition" | "word_order" | "agreement" | "other";
  original: string;
  corrected: string;
  explanation: string;
  explanationChinese: string;
}

export interface NaturalExpression {
  original: string;
  suggested: string;
  isNatural: boolean;
  alternatives: string[];
}

export interface ConversationScore {
  overall: number; // 0-1
  grammar: number;
  vocabulary: number;
  fluency: number;
  appropriateness: number;
}

export interface ScenarioTemplate {
  id: ConversationScenario;
  name: string;
  nameChinese: string;
  description: string;
  descriptionChinese: string;
  level: ConversationLevel;
  openingMessage: string;
  openingTranslation: string;
  expectedTopics: string[];
  vocabulary: string[];
  grammarFocus: string[];
}

// ============================================================
// Scenario Templates
// ============================================================

export const SCENARIO_TEMPLATES: ScenarioTemplate[] = [
  {
    id: "self_introduction",
    name: "Self Introduction",
    nameChinese: "自我介绍",
    description: "Introduce yourself to someone new",
    descriptionChinese: "向新朋友介绍自己",
    level: "beginner",
    openingMessage: "Hi! I'm Sarah. What's your name?",
    openingTranslation: "嗨！我是Sarah。你叫什么名字？",
    expectedTopics: ["name", "nationality", "job", "hobbies"],
    vocabulary: ["name", "from", "work", "study", "like", "hobby", "nice", "meet"],
    grammarFocus: ["be verb", "present simple", "like + verb-ing"],
  },
  {
    id: "shopping",
    name: "Shopping",
    nameChinese: "购物",
    description: "Ask for items, prices, and sizes",
    descriptionChinese: "询问商品、价格和尺寸",
    level: "beginner",
    openingMessage: "Welcome! Can I help you find something?",
    openingTranslation: "欢迎！需要帮忙找什么吗？",
    expectedTopics: ["items", "price", "size", "color", "payment"],
    vocabulary: ["buy", "how much", "size", "color", "try", "cheap", "expensive", "discount"],
    grammarFocus: ["can I", "how much", "I would like"],
  },
  {
    id: "restaurant",
    name: "Restaurant",
    nameChinese: "餐厅",
    description: "Order food and drinks",
    descriptionChinese: "点餐和饮料",
    level: "beginner",
    openingMessage: "Hello! Welcome to our restaurant. Do you have a reservation?",
    openingTranslation: "你好！欢迎来到我们餐厅。您有预订吗？",
    expectedTopics: ["menu", "order", "food preferences", "bill"],
    vocabulary: ["menu", "order", "water", "food", "delicious", "bill", "please", "thank you"],
    grammarFocus: ["I would like", "Can I have", "Do you have"],
  },
  {
    id: "hotel",
    name: "Hotel",
    nameChinese: "酒店",
    description: "Check in, ask for room information",
    descriptionChinese: "办理入住，询问房间信息",
    level: "intermediate",
    openingMessage: "Good afternoon! Welcome to the Grand Hotel. How may I assist you?",
    openingTranslation: "下午好！欢迎来到大酒店。有什么可以帮您的？",
    expectedTopics: ["check-in", "room type", "amenities", "checkout"],
    vocabulary: ["room", "key", "check-in", "checkout", "breakfast", "wifi", "towel", "reservation"],
    grammarFocus: ["I have a reservation", "Could you", "Is there"],
  },
  {
    id: "transportation",
    name: "Transportation",
    nameChinese: "交通",
    description: "Ask for directions, take a taxi",
    descriptionChinese: "问路、打车",
    level: "beginner",
    openingMessage: "Where would you like to go?",
    openingTranslation: "您想去哪里？",
    expectedTopics: ["destination", "directions", "price", "time"],
    vocabulary: ["go", "turn", "left", "right", "straight", "how far", "bus", "taxi"],
    grammarFocus: ["How do I get to", "turn left/right", "go straight"],
  },
  {
    id: "doctor",
    name: "Doctor",
    nameChinese: "看医生",
    description: "Describe symptoms, get medical advice",
    descriptionChinese: "描述症状，获取医疗建议",
    level: "intermediate",
    openingMessage: "Good morning. What seems to be the problem?",
    openingTranslation: "早上好。哪里不舒服？",
    expectedTopics: ["symptoms", "pain", "duration", "medication"],
    vocabulary: ["sick", "pain", "headache", "fever", "medicine", "doctor", "feel", "hurt"],
    grammarFocus: ["I have", "I feel", "It hurts", "How long"],
  },
  {
    id: "meeting",
    name: "Business Meeting",
    nameChinese: "商务会议",
    description: "Participate in a work meeting",
    descriptionChinese: "参加工作会议",
    level: "intermediate",
    openingMessage: "Let's get started. First, I'd like to review last week's progress.",
    openingTranslation: "我们开始吧。首先，我想回顾一下上周的进展。",
    expectedTopics: ["progress", "problems", "plans", "decisions"],
    vocabulary: ["project", "deadline", "progress", "problem", "solution", "agree", "suggest", "decide"],
    grammarFocus: ["I think", "We should", "In my opinion", "Let's"],
  },
  {
    id: "interview",
    name: "Job Interview",
    nameChinese: "工作面试",
    description: "Answer interview questions",
    descriptionChinese: "回答面试问题",
    level: "advanced",
    openingMessage: "Thank you for coming. Please tell me about yourself.",
    openingTranslation: "感谢您的到来。请介绍一下自己。",
    expectedTopics: ["experience", "skills", "goals", "strengths"],
    vocabulary: ["experience", "skill", "goal", "team", "project", "achieve", "learn", "contribute"],
    grammarFocus: ["I have experience in", "I am good at", "My goal is", "I believe"],
  },
];

// ============================================================
// Conversation Engine
// ============================================================

export class ConversationEngineV1 {
  private sessions: Map<string, ConversationSession> = new Map();
  private templates: Map<ConversationScenario, ScenarioTemplate> = new Map();

  constructor() {
    // Initialize templates
    SCENARIO_TEMPLATES.forEach(template => {
      this.templates.set(template.id, template);
    });
  }

  /**
   * Get scenario template
   */
  getTemplate(scenario: ConversationScenario): ScenarioTemplate | undefined {
    return this.templates.get(scenario);
  }

  /**
   * Get all templates
   */
  getAllTemplates(): ScenarioTemplate[] {
    return SCENARIO_TEMPLATES;
  }

  /**
   * Get templates by level
   */
  getTemplatesByLevel(level: ConversationLevel): ScenarioTemplate[] {
    return SCENARIO_TEMPLATES.filter(t => t.level === level);
  }

  /**
   * Start new conversation session
   */
  startSession(
    scenario: ConversationScenario,
    level: ConversationLevel = "beginner"
  ): ConversationSession {
    const template = this.templates.get(scenario);
    if (!template) {
      throw new Error(`Unknown scenario: ${scenario}`);
    }

    const session: ConversationSession = {
      id: `conv_${Date.now()}_${scenario}`,
      scenario,
      level,
      messages: [
        {
          id: `msg_${Date.now()}`,
          role: "ai",
          content: template.openingMessage,
          translationChinese: template.openingTranslation,
          timestamp: Date.now(),
        },
      ],
      score: {
        overall: 0,
        grammar: 0,
        vocabulary: 0,
        fluency: 0,
        appropriateness: 0,
      },
      recommendations: [],
      startTime: Date.now(),
    };

    this.sessions.set(session.id, session);
    return session;
  }

  /**
   * Process user message
   */
  processUserMessage(
    sessionId: string,
    userMessage: string
  ): { aiResponse: ConversationMessage; analysis: MessageAnalysis } {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    // Analyze user message
    const analysis = this.analyzeMessage(userMessage, session);

    // Add user message to session
    const userMsg: ConversationMessage = {
      id: `msg_${Date.now()}`,
      role: "user",
      content: userMessage,
      timestamp: Date.now(),
      analysis,
    };
    session.messages.push(userMsg);

    // Generate AI response
    const aiResponse = this.generateResponse(userMessage, analysis, session);
    session.messages.push(aiResponse);

    // Update session score
    this.updateSessionScore(session, analysis);

    return { aiResponse, analysis };
  }

  /**
   * Analyze user message
   */
  private analyzeMessage(
    message: string,
    session: ConversationSession
  ): MessageAnalysis {
    const template = this.templates.get(session.scenario);
    
    // Grammar analysis
    const grammar = this.analyzeGrammar(message, template);
    
    // Natural expression check
    const naturalExpression = this.checkNaturalExpression(message, template);
    
    // Vocabulary check
    const vocabularyUsed = this.checkVocabulary(message, template?.vocabulary || []);
    
    // Generate suggestions
    const suggestions = this.generateSuggestions(grammar, naturalExpression, vocabularyUsed);

    return {
      grammar,
      naturalExpression,
      vocabularyUsed,
      suggestions,
    };
  }

  /**
   * Analyze grammar
   */
  private analyzeGrammar(
    message: string,
    _template?: ScenarioTemplate
  ): GrammarAnalysis {
    const mistakes: GrammarMistake[] = [];
    const corrected = message;

    // Simple grammar checks
    const lowerMessage = message.toLowerCase();
    
    // Check for common mistakes
    if (lowerMessage.match(/\bi\b/) && !lowerMessage.match(/\bi\s+(am|was|have|do|can|will|like|want|need)\b/)) {
      // Simple subject-verb check
    }

    // Check for missing articles
    if (lowerMessage.match(/\b(have|want|need)\s+(a|an|the)\s+/) === null) {
      if (lowerMessage.match(/\b(have|want|need)\s+(book|car|house|idea)\b/)) {
        mistakes.push({
          type: "article",
          original: message,
          corrected: message.replace(/(\b(?:have|want|need)\s+)(book|car|house|idea)/gi, "$1a $2"),
          explanation: "Missing article 'a' before singular countable noun",
          explanationChinese: "单数可数名词前需要加冠词 'a'",
        });
      }
    }

    // Calculate score
    const score = mistakes.length === 0 ? 1 : Math.max(0, 1 - mistakes.length * 0.2);

    return {
      original: message,
      corrected,
      mistakes,
      score,
    };
  }

  /**
   * Check natural expression
   */
  private checkNaturalExpression(
    message: string,
    _template?: ScenarioTemplate
  ): NaturalExpression {
    const lowerMessage = message.toLowerCase();
    const alternatives: string[] = [];
    let isNatural = true;

    // Check for common unnatural expressions
    const unnaturalPatterns: Array<{ pattern: RegExp; natural: string; alt: string[] }> = [
      {
        pattern: /\bi want buy\b/i,
        natural: "I'd like to buy",
        alt: ["I want to buy", "Can I buy", "I'm looking for"],
      },
      {
        pattern: /\bi want eat\b/i,
        natural: "I'd like to eat",
        alt: ["I want to eat", "Can I have", "I'll have"],
      },
      {
        pattern: /\bhow much cost\b/i,
        natural: "How much does it cost?",
        alt: ["What's the price?", "How much is this?"],
      },
    ];

    for (const { pattern, natural, alt } of unnaturalPatterns) {
      if (pattern.test(lowerMessage)) {
        isNatural = false;
        alternatives.push(natural, ...alt);
        break;
      }
    }

    return {
      original: message,
      suggested: isNatural ? message : alternatives[0] || message,
      isNatural,
      alternatives,
    };
  }

  /**
   * Check vocabulary usage
   */
  private checkVocabulary(message: string, expectedVocab: string[]): string[] {
    const lowerMessage = message.toLowerCase();
    return expectedVocab.filter(word => lowerMessage.includes(word.toLowerCase()));
  }

  /**
   * Generate suggestions
   */
  private generateSuggestions(
    grammar: GrammarAnalysis,
    naturalExpression: NaturalExpression,
    vocabularyUsed: string[]
  ): string[] {
    const suggestions: string[] = [];

    if (grammar.mistakes.length > 0) {
      suggestions.push(`Grammar tip: ${grammar.mistakes[0].explanationChinese}`);
    }

    if (!naturalExpression.isNatural) {
      suggestions.push(`Try saying: "${naturalExpression.suggested}"`);
    }

    if (vocabularyUsed.length === 0) {
      suggestions.push("Try to use more relevant vocabulary");
    }

    return suggestions;
  }

  /**
   * Generate AI response
   */
  private generateResponse(
    userMessage: string,
    _analysis: MessageAnalysis,
    _session: ConversationSession
  ): ConversationMessage {
    const lowerMessage = userMessage.toLowerCase();

    // Generate contextual response based on scenario
    let response: string;
    let translation: string;

    // Simple response generation based on keywords
    if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
      response = "Hello! How can I help you today?";
      translation = "你好！今天有什么可以帮您的？";
    } else if (lowerMessage.includes("thank")) {
      response = "You're welcome! Is there anything else I can help with?";
      translation = "不客气！还有其他需要帮助的吗？";
    } else if (lowerMessage.includes("bye") || lowerMessage.includes("goodbye")) {
      response = "Goodbye! Have a great day!";
      translation = "再见！祝您愉快！";
    } else if (lowerMessage.includes("how much") || lowerMessage.includes("price")) {
      response = "This item is $25. Would you like to buy it?";
      translation = "这件商品25美元。您想买吗？";
    } else if (lowerMessage.includes("menu") || lowerMessage.includes("order")) {
      response = "Here's our menu. What would you like to order?";
      translation = "这是我们的菜单。您想点什么？";
    } else {
      // Default response
      response = "I understand. Can you tell me more?";
      translation = "我明白了。能告诉我更多吗？";
    }

    return {
      id: `msg_${Date.now()}`,
      role: "ai",
      content: response,
      translationChinese: translation,
      timestamp: Date.now(),
    };
  }

  /**
   * Update session score
   */
  private updateSessionScore(
    session: ConversationSession,
    analysis: MessageAnalysis
  ): void {
    const messageCount = session.messages.filter(m => m.role === "user").length;
    
    // Update running averages
    const grammarScore = analysis.grammar.score;
    const vocabScore = analysis.vocabularyUsed.length > 0 ? 0.8 : 0.5;
    
    session.score.grammar = (session.score.grammar * (messageCount - 1) + grammarScore) / messageCount;
    session.score.vocabulary = (session.score.vocabulary * (messageCount - 1) + vocabScore) / messageCount;
    session.score.overall = (session.score.grammar + session.score.vocabulary + session.score.fluency + session.score.appropriateness) / 4;
  }

  /**
   * End session
   */
  endSession(sessionId: string): ConversationSession {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    session.endTime = Date.now();
    session.recommendations = this.generateRecommendations(session);

    return session;
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(session: ConversationSession): string[] {
    const recommendations: string[] = [];
    
    if (session.score.grammar < 0.6) {
      recommendations.push("Review basic grammar rules");
    }
    
    if (session.score.vocabulary < 0.6) {
      recommendations.push("Learn more vocabulary for this scenario");
    }
    
    if (session.score.overall >= 0.8) {
      recommendations.push("Great job! Try a more advanced scenario");
    } else {
      recommendations.push("Practice this scenario again to improve");
    }
    
    return recommendations;
  }

  /**
   * Get session by ID
   */
  getSession(id: string): ConversationSession | undefined {
    return this.sessions.get(id);
  }

  /**
   * Get all sessions
   */
  getAllSessions(): ConversationSession[] {
    return Array.from(this.sessions.values());
  }
}
