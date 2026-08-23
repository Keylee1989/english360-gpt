/**
 * Beta Test Framework v1
 *
 * Simulates multiple user models for testing:
 * - Zero beginner adults
 * - University English users
 * - Workplace English needs
 * - Different learning patterns
 */

// ============================================================
// Types
// ============================================================

export type UserPersona =
  | "zero_beginner"
  | "university_english"
  | "workplace_english"
  | "travel_english"
  | "exam_preparation";

export interface BetaUser {
  id: string;
  persona: UserPersona;
  age: number;
  nativeLanguage: string;
  currentLevel: string;
  goals: string[];
  dailyMinutes: number;
  interests: string[];
  learningStyle: "visual" | "auditory" | "kinesthetic" | "reading";
}

export interface BetaTestResult {
  userId: string;
  persona: UserPersona;
  daysCompleted: number;
  vocabularyLearned: number;
  listeningHours: number;
  speakingAttempts: number;
  writingPieces: number;
  averageScore: number;
  satisfactionScore: number; // 1-10
  improvementPercent: number;
  completedMilestones: string[];
  feedback: string[];
  issues: string[];
}

export interface BetaTestSummary {
  totalUsers: number;
  averageDaysCompleted: number;
  averageVocabularyLearned: number;
  averageScore: number;
  averageSatisfaction: number;
  personaBreakdown: Record<UserPersona, BetaTestResult>;
  recommendations: string[];
}

// ============================================================
// Beta Test Framework
// ============================================================

export class BetaTestFrameworkV1 {
  private users: Map<string, BetaUser> = new Map();
  private results: Map<string, BetaTestResult> = new Map();

  constructor() {
    this.initializeDefaultUsers();
  }

  /**
   * Initialize default beta users
   */
  private initializeDefaultUsers(): void {
    const defaultUsers: BetaUser[] = [
      {
        id: "beta_001",
        persona: "zero_beginner",
        age: 38,
        nativeLanguage: "Chinese",
        currentLevel: "A0",
        goals: ["Basic communication", "Travel English"],
        dailyMinutes: 240,
        interests: ["travel", "food", "technology"],
        learningStyle: "visual",
      },
      {
        id: "beta_002",
        persona: "zero_beginner",
        age: 45,
        nativeLanguage: "Chinese",
        currentLevel: "A0",
        goals: ["Help children with homework", "Read English signs"],
        dailyMinutes: 120,
        interests: ["family", "education", "health"],
        learningStyle: "reading",
      },
      {
        id: "beta_003",
        persona: "university_english",
        age: 22,
        nativeLanguage: "Chinese",
        currentLevel: "A2",
        goals: ["Pass CET-6", "Study abroad"],
        dailyMinutes: 180,
        interests: ["academic", "technology", "culture"],
        learningStyle: "reading",
      },
      {
        id: "beta_004",
        persona: "workplace_english",
        age: 35,
        nativeLanguage: "Chinese",
        currentLevel: "B1",
        goals: ["Business communication", "Email writing"],
        dailyMinutes: 60,
        interests: ["business", "technology", "management"],
        learningStyle: "auditory",
      },
      {
        id: "beta_005",
        persona: "travel_english",
        age: 28,
        nativeLanguage: "Chinese",
        currentLevel: "A1",
        goals: ["Travel communication", "Order food"],
        dailyMinutes: 90,
        interests: ["travel", "photography", "food"],
        learningStyle: "kinesthetic",
      },
      {
        id: "beta_006",
        persona: "zero_beginner",
        age: 50,
        nativeLanguage: "Chinese",
        currentLevel: "A0",
        goals: ["Watch English movies", "Talk to foreigners"],
        dailyMinutes: 60,
        interests: ["movies", "music", "cooking"],
        learningStyle: "auditory",
      },
      {
        id: "beta_007",
        persona: "workplace_english",
        age: 40,
        nativeLanguage: "Chinese",
        currentLevel: "A2",
        goals: ["International meetings", "Presentation"],
        dailyMinutes: 120,
        interests: ["business", "leadership", "innovation"],
        learningStyle: "visual",
      },
      {
        id: "beta_008",
        persona: "exam_preparation",
        age: 20,
        nativeLanguage: "Chinese",
        currentLevel: "B1",
        goals: ["IELTS 7.0", "Study abroad"],
        dailyMinutes: 240,
        interests: ["academic", "research", "science"],
        learningStyle: "reading",
      },
      {
        id: "beta_009",
        persona: "zero_beginner",
        age: 32,
        nativeLanguage: "Chinese",
        currentLevel: "A0",
        goals: ["Daily conversation", "Make foreign friends"],
        dailyMinutes: 90,
        interests: ["social", "sports", "music"],
        learningStyle: "kinesthetic",
      },
      {
        id: "beta_010",
        persona: "university_english",
        age: 24,
        nativeLanguage: "Chinese",
        currentLevel: "A1",
        goals: ["Academic writing", "Research papers"],
        dailyMinutes: 180,
        interests: ["academic", "literature", "philosophy"],
        learningStyle: "reading",
      },
    ];

    defaultUsers.forEach(user => {
      this.users.set(user.id, user);
    });
  }

  /**
   * Get all beta users
   */
  getBetaUsers(): BetaUser[] {
    return Array.from(this.users.values());
  }

  /**
   * Get users by persona
   */
  getUsersByPersona(persona: UserPersona): BetaUser[] {
    return Array.from(this.users.values()).filter(u => u.persona === persona);
  }

  /**
   * Simulate beta test
   */
  simulateBetaTest(userId: string, days: number): BetaTestResult {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error(`User not found: ${userId}`);
    }

    // Simulate learning based on persona and time
    const vocabularyLearned = Math.round(days * this.getVocabularyRate(user));
    const listeningHours = Math.round(days * (user.dailyMinutes / 60) * 0.3);
    const speakingAttempts = Math.round(days * 10);
    const writingPieces = Math.round(days * 2);
    const averageScore = Math.min(0.9, 0.3 + (days / 360) * 0.6);
    const satisfactionScore = Math.min(10, 6 + Math.random() * 3);
    const improvementPercent = Math.min(200, days * 2);

    const completedMilestones = this.getCompletedMilestones(days);
    const feedback = this.generateFeedback(user, days);
    const issues = this.identifyIssues(user, days);

    const result: BetaTestResult = {
      userId,
      persona: user.persona,
      daysCompleted: days,
      vocabularyLearned,
      listeningHours,
      speakingAttempts,
      writingPieces,
      averageScore,
      satisfactionScore,
      improvementPercent,
      completedMilestones,
      feedback,
      issues,
    };

    this.results.set(userId, result);
    return result;
  }

  /**
   * Get vocabulary learning rate
   */
  private getVocabularyRate(user: BetaUser): number {
    const baseRate = 10;
    const timeFactor = user.dailyMinutes / 240;
    const levelFactor = user.currentLevel === "A0" ? 0.7 : 1;

    return Math.round(baseRate * timeFactor * levelFactor);
  }

  /**
   * Get completed milestones
   */
  private getCompletedMilestones(days: number): string[] {
    const milestones: string[] = [];

    if (days >= 7) milestones.push("Week 1 Complete");
    if (days >= 30) milestones.push("Month 1 Complete");
    if (days >= 90) milestones.push("Month 3 Complete");
    if (days >= 180) milestones.push("Month 6 Complete");
    if (days >= 360) milestones.push("Year Complete");

    return milestones;
  }

  /**
   * Generate feedback
   */
  private generateFeedback(user: BetaUser, days: number): string[] {
    const feedback: string[] = [];

    if (days >= 30) {
      feedback.push("Good progress on vocabulary");
    }
    if (user.dailyMinutes >= 180) {
      feedback.push("Excellent study time commitment");
    }
    if (user.learningStyle === "auditory") {
      feedback.push("Listening exercises are very effective");
    }

    return feedback;
  }

  /**
   * Identify issues
   */
  private identifyIssues(user: BetaUser, days: number): string[] {
    const issues: string[] = [];

    if (days < 7) {
      issues.push("Need more consistent study pattern");
    }
    if (user.dailyMinutes < 60) {
      issues.push("Study time may be insufficient");
    }

    return issues;
  }

  /**
   * Get test summary
   */
  getTestSummary(): BetaTestSummary {
    const allResults = Array.from(this.results.values());

    if (allResults.length === 0) {
      return {
        totalUsers: 0,
        averageDaysCompleted: 0,
        averageVocabularyLearned: 0,
        averageScore: 0,
        averageSatisfaction: 0,
        personaBreakdown: {} as Record<UserPersona, BetaTestResult>,
        recommendations: [],
      };
    }

    const averageDaysCompleted = allResults.reduce((sum, r) => sum + r.daysCompleted, 0) / allResults.length;
    const averageVocabularyLearned = allResults.reduce((sum, r) => sum + r.vocabularyLearned, 0) / allResults.length;
    const averageScore = allResults.reduce((sum, r) => sum + r.averageScore, 0) / allResults.length;
    const averageSatisfaction = allResults.reduce((sum, r) => sum + r.satisfactionScore, 0) / allResults.length;

    // Persona breakdown
    const personaBreakdown: Partial<Record<UserPersona, BetaTestResult>> = {};
    for (const persona of ["zero_beginner", "university_english", "workplace_english", "travel_english", "exam_preparation"] as UserPersona[]) {
      const personaResults = allResults.filter(r => r.persona === persona);
      if (personaResults.length > 0) {
        personaBreakdown[persona] = personaResults[0];
      }
    }

    // Generate recommendations
    const recommendations = this.generateRecommendations(allResults);

    return {
      totalUsers: allResults.length,
      averageDaysCompleted,
      averageVocabularyLearned,
      averageScore,
      averageSatisfaction,
      personaBreakdown: personaBreakdown as Record<UserPersona, BetaTestResult>,
      recommendations,
    };
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(results: BetaTestResult[]): string[] {
    const recommendations: string[] = [];

    const lowSatisfaction = results.filter(r => r.satisfactionScore < 7);
    if (lowSatisfaction.length > 0) {
      recommendations.push("Improve user satisfaction for some personas");
    }

    const lowCompletion = results.filter(r => r.daysCompleted < 30);
    if (lowCompletion.length > 0) {
      recommendations.push("Improve retention for short-term users");
    }

    const averageScore = results.reduce((sum, r) => sum + r.averageScore, 0) / results.length;
    if (averageScore < 0.6) {
      recommendations.push("Improve learning effectiveness");
    }

    return recommendations;
  }
}
