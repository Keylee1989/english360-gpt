/**
 * AI Tutor v7 — Real Teacher Optimization
 *
 * Features:
 * - Vocabulary teaching
 * - Conversation difficulty control
 * - Error recovery with targeted exercises
 * - Chinese beginner mode
 */

// ============================================================
// Types
// ============================================================

export type ConversationLevel = "beginner" | "elementary" | "intermediate" | "advanced";

export interface VocabularyTeaching {
  word: string;
  meaning: string;
  meaningChinese: string;
  pronunciation: string;
  commonPhrases: string[];
  commonPhrasesChinese: string[];
  memoryTrick: string;
  practiceSentences: string[];
}

export interface ErrorPattern {
  type: string;
  original: string;
  corrected: string;
  count: number;
  lastOccurrence: number;
}

export interface TeacherResponse {
  message: string;
  correction?: {
    original: string;
    corrected: string;
    rule: string;
    ruleChinese: string;
  };
  teaching?: VocabularyTeaching;
  practice?: string[];
  encouragement: string;
}

// ============================================================
// AI Tutor v7
// ============================================================

export class AITutorV7 {
  private errorPatterns: Map<string, ErrorPattern> = new Map();
  private level: ConversationLevel = "beginner";

  /**
   * Set conversation level
   */
  setLevel(level: ConversationLevel): void {
    this.level = level;
  }

  /**
   * Teach vocabulary
   */
  teachVocabulary(word: string): VocabularyTeaching {
    const vocabularyData: Record<string, VocabularyTeaching> = {
      hello: {
        word: "hello",
        meaning: "A greeting",
        meaningChinese: "你好（问候语）",
        pronunciation: "/həˈloʊ/",
        commonPhrases: ["Hello, how are you?", "Say hello to..."],
        commonPhrasesChinese: ["你好，你好吗？", "向...问好"],
        memoryTrick: "Think of answering the phone: 'Hello!'",
        practiceSentences: ["Hello, my name is...", "Hello, nice to meet you."],
      },
      apple: {
        word: "apple",
        meaning: "A red or green fruit",
        meaningChinese: "苹果（一种红色或绿色的水果）",
        pronunciation: "/ˈæpəl/",
        commonPhrases: ["an apple", "apple juice", "apple pie"],
        commonPhrasesChinese: ["一个苹果", "苹果汁", "苹果派"],
        memoryTrick: "A is for Apple! The 'a' sound is like 'apple'.",
        practiceSentences: ["I eat an apple every day.", "Do you like apples?"],
      },
      cat: {
        word: "cat",
        meaning: "A small furry pet that says 'meow'",
        meaningChinese: "猫（一种会说'喵'的小毛宠物）",
        pronunciation: "/kæt/",
        commonPhrases: ["a cat", "my cat", "pet cat"],
        commonPhrasesChinese: ["一只猫", "我的猫", "宠物猫"],
        memoryTrick: "C-A-T: Cool And Tiny!",
        practiceSentences: ["I have a cat.", "The cat is sleeping."],
      },
    };

    return vocabularyData[word.toLowerCase()] || {
      word,
      meaning: `The word "${word}"`,
      meaningChinese: `"${word}"这个词`,
      pronunciation: "Pronunciation varies",
      commonPhrases: [`Use "${word}" in sentences`],
      commonPhrasesChinese: [`在句子中使用"${word}"`],
      memoryTrick: "Practice saying it 5 times!",
      practiceSentences: [`I know the word "${word}".`, `Can you use "${word}" in a sentence?`],
    };
  }

  /**
   * Get conversation response based on level
   */
  getConversationResponse(userMessage: string): TeacherResponse {
    // Check for errors
    const correction = this.detectError(userMessage);

    // Generate response based on level
    let response = "";

    switch (this.level) {
      case "beginner":
        response = this.getBeginnerResponse(userMessage, correction);
        break;
      case "elementary":
        response = this.getElementaryResponse(userMessage, correction);
        break;
      case "intermediate":
        response = this.getIntermediateResponse(userMessage, correction);
        break;
      case "advanced":
        response = this.getAdvancedResponse(userMessage, correction);
        break;
    }

    // Generate practice if there was an error
    const practice = correction
      ? this.generatePracticeExercises(correction.rule)
      : undefined;

    // Generate encouragement
    const encouragement = this.getEncouragement(correction === null);

    return {
      message: response,
      correction: correction || undefined,
      practice,
      encouragement,
    };
  }

  /**
   * Detect errors in user message
   */
  private detectError(message: string): TeacherResponse["correction"] | null {
    const lower = message.toLowerCase();

    // Past tense errors
    if (lower.includes("yesterday") || lower.includes("last") || lower.includes("ago")) {
      const presentVerbs = ["go", "come", "eat", "see", "buy", "take", "make", "have"];
      for (const verb of presentVerbs) {
        if (lower.includes(verb) && !lower.includes(this.getPastForm(verb))) {
          this.recordError("past_tense", message);
          return {
            original: message,
            corrected: message.replace(verb, this.getPastForm(verb)),
            rule: "Past tense required with past time indicators",
            ruleChinese: "表示过去时间的词需要使用过去式",
          };
        }
      }
    }

    // Article errors
    if (lower.match(/\b(have|want|need|like)\s+(book|car|house|apple|cat|dog)\b/)) {
      this.recordError("article", message);
      return {
        original: message,
        corrected: message.replace(
          /\b(have|want|need|like)\s+(book|car|house|apple|cat|dog)\b/g,
          "$1 a $2"
        ),
        rule: "Missing article 'a' before singular countable noun",
        ruleChinese: "单数可数名词前需要加冠词 'a'",
      };
    }

    // "Very like" error
    if (lower.includes("very like")) {
      this.recordError("very_like", message);
      return {
        original: message,
        corrected: message.replace("very like", "really like"),
        rule: "Use 'really' with verbs, 'very' with adjectives",
        ruleChinese: "动词用really，形容词用very",
      };
    }

    return null;
  }

  /**
   * Get past tense form
   */
  private getPastForm(verb: string): string {
    const pastForms: Record<string, string> = {
      go: "went", come: "came", eat: "ate", see: "saw",
      buy: "bought", take: "took", make: "made", have: "had",
    };
    return pastForms[verb] || verb + "ed";
  }

  /**
   * Record error pattern
   */
  private recordError(type: string, example: string): void {
    const existing = this.errorPatterns.get(type);
    if (existing) {
      existing.count++;
      existing.lastOccurrence = Date.now();
    } else {
      this.errorPatterns.set(type, {
        type,
        original: example,
        corrected: "",
        count: 1,
        lastOccurrence: Date.now(),
      });
    }
  }

  /**
   * Get beginner response
   */
  private getBeginnerResponse(_message: string, correction: TeacherResponse["correction"] | null): string {
    if (correction) {
      return `Let me help you with that.\n\nCorrection: ${correction.corrected}\n\n中文解释: ${correction.ruleChinese}`;
    }

    const responses = [
      "That's good! Keep practicing.",
      "Nice sentence! Try adding more details.",
      "Good try! Let me teach you something new.",
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  }

  /**
   * Get elementary response
   */
  private getElementaryResponse(_message: string, correction: TeacherResponse["correction"] | null): string {
    if (correction) {
      return `I noticed a small mistake.\n\nOriginal: ${correction.original}\nCorrected: ${correction.corrected}\n\nRule: ${correction.rule}`;
    }

    return "Good! Now try to make your sentence more interesting.";
  }

  /**
   * Get intermediate response
   */
  private getIntermediateResponse(_message: string, _correction: TeacherResponse["correction"] | null): string {
    return "That's a good sentence. Can you tell me more about that?";
  }

  /**
   * Get advanced response
   */
  private getAdvancedResponse(_message: string, _correction: TeacherResponse["correction"] | null): string {
    return "Interesting point. What do you think about the opposite view?";
  }

  /**
   * Generate practice exercises based on error
   */
  private generatePracticeExercises(rule: string): string[] {
    const exercises: Record<string, string[]> = {
      past_tense: [
        "I ___ (go) to school yesterday.",
        "She ___ (eat) breakfast this morning.",
        "We ___ (see) a movie last night.",
      ],
      article: [
        "I want ___ book.",
        "She has ___ cat.",
        "He needs ___ car.",
      ],
      very_like: [
        "I ___ like English.",
        "She ___ likes music.",
        "We ___ like pizza.",
      ],
    };

    return exercises[rule] || ["Practice making sentences with the correct form."];
  }

  /**
   * Get encouragement
   */
  private getEncouragement(noError: boolean): string {
    if (noError) {
      const encouragements = [
        "Excellent! Keep up the great work!",
        "Perfect! You're making progress!",
        "Well done! Your English is improving!",
      ];
      return encouragements[Math.floor(Math.random() * encouragements.length)];
    }

    return "Don't worry! Mistakes help you learn. Keep practicing!";
  }

  /**
   * Get error summary
   */
  getErrorSummary(): { type: string; count: number }[] {
    return Array.from(this.errorPatterns.values())
      .map(p => ({ type: p.type, count: p.count }))
      .sort((a, b) => b.count - a.count);
  }
}

// ============================================================
// Factory Function
// ============================================================

export function createAITutorV7(): AITutorV7 {
  return new AITutorV7();
}

export default AITutorV7;
