import type { SkillDomain, InteractionType } from "./index";

/**
 * Curriculum Engine Interface
 */
export interface ICurriculumEngine {
  /**
   * Get the learning path for a user based on their student model
   */
  getLearningPath(userId: string): Promise<LearningPath>;

  /**
   * Get the next lesson/activity
   */
  getNextActivity(userId: string): Promise<LearningActivity | null>;

  /**
   * Generate daily priority plan based on time available
   */
  generateDailyPlan(userId: string, minutesAvailable: number): Promise<DailyPlan>;
}

export interface LearningPath {
  id: string;
  modules: LearningModule[];
  currentModuleIndex: number;
  estimatedCompletion: number; // days
}

export interface LearningModule {
  id: string;
  name: string;
  chineseName: string;
  domain: SkillDomain;
  prerequisites: string[];
  activities: LearningActivity[];
  estimatedMinutes: number;
}

export interface LearningActivity {
  id: string;
  type: InteractionType;
  domain: SkillDomain;
  title: string;
  chineseTitle: string;
  description: string;
  difficulty: number; // 0-1
  estimatedMinutes: number;
  content: ActivityContent;
}

export interface ActivityContent {
  instructions: string;
  chineseInstructions: string;
  items: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  prompt: string;
  correctAnswer: string;
  alternatives: string[];
  hints: string[];
  chineseTranslation?: string;
  audioUrl?: string;
}

export interface DailyPlan {
  date: string;
  totalMinutes: number;
  sessions: PlanSession[];
  priorities: string[];
}

export interface PlanSession {
  domain: SkillDomain;
  activityType: InteractionType;
  minutes: number;
  description: string;
  priority: "critical" | "high" | "medium" | "low";
}

/**
 * Adaptive Learning Engine Interface
 */
export interface IAdaptiveEngine {
  /**
   * Determine what the user should study next
   */
  getNextRecommendation(userId: string): Promise<LearningRecommendation>;

  /**
   * Adjust difficulty based on performance
   */
  adjustDifficulty(userId: string, domain: SkillDomain): Promise<number>;

  /**
   * Analyze if user needs foundation补课
   */
  checkFoundationGaps(userId: string): Promise<FoundationGap[]>;

  /**
   * Calculate optimal new-to-review ratio
   */
  getOptimalRatio(userId: string): Promise<{ newRatio: number; reviewRatio: number }>;
}

export interface LearningRecommendation {
  domain: SkillDomain;
  activityType: InteractionType;
  reason: string;
  difficulty: number;
  estimatedMinutes: number;
}

export interface FoundationGap {
  domain: SkillDomain;
  description: string;
  severity: "critical" | "high" | "medium" | "low";
  suggestedActivities: string[];
}

/**
 * Memory Engine Interface
 */
export interface IMemoryEngine {
  /**
   * Select optimal memory method for a specific item and user
   */
  selectMethod(itemId: string, userId: string): Promise<MemoryMethod>;

  /**
   * Track memory strength over time
   */
  updateStrength(itemId: string, userId: string, success: boolean): Promise<void>;

  /**
   * Get items that need memory reinforcement
   */
  getWeakItems(userId: string, limit?: number): Promise<string[]>;
}

export type MemoryMethod =
  | "active_recall"
  | "spaced_repetition"
  | "context"
  | "example_sentence"
  | "sentence_production"
  | "imagery"
  | "association"
  | "mnemonic"
  | "chinese_homophone"
  | "roots"
  | "word_family"
  | "collocations"
  | "listening"
  | "speaking"
  | "retrieval_practice";

/**
 * Assessment Engine Interface
 */
export interface IAssessmentEngine {
  /**
   * Run a comprehensive skill assessment
   */
  runAssessment(userId: string, type: AssessmentType): Promise<AssessmentResult>;

  /**
   * Evaluate a single answer
   */
  evaluateAnswer(
    questionId: string,
    userAnswer: string,
  ): Promise<{ correct: boolean; feedback: string; score: number }>;
}

export type AssessmentType =
  | "daily_check"
  | "milestone_30"
  | "milestone_90"
  | "milestone_180"
  | "milestone_270"
  | "milestone_360"
  | "skill_specific"
  | "unseen_material";

export interface AssessmentResult {
  id: string;
  timestamp: number;
  type: AssessmentType;
  scores: Record<SkillDomain, number>;
  overallScore: number;
  competencyLevel: string;
  details: AssessmentDetail[];
  recommendations: string[];
}

export interface AssessmentDetail {
  domain: SkillDomain;
  score: number;
  strengths: string[];
  weaknesses: string[];
  transferScore: number; // how well knowledge transfers to new contexts
}

/**
 * AI Provider Layer Interface
 */
export interface IAIProvider {
  /**
   * Send a chat completion request
   */
  chat(request: AIChatRequest): Promise<AIChatResponse>;

  /**
   * Check if the provider is available
   */
  isAvailable(): Promise<boolean>;

  /**
   * Get provider info
   */
  getInfo(): AIProviderInfo;
}

export interface AIChatRequest {
  messages: AIMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AIChatResponse {
  content: string;
  model: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface AIProviderInfo {
  name: string;
  baseUrl: string;
  models: string[];
}

/**
 * Knowledge Graph Interface
 */
export interface IKnowledgeGraph {
  /**
   * Get related knowledge items
   */
  getRelated(itemId: string, type: string): Promise<KnowledgeNode[]>;

  /**
   * Find prerequisite knowledge
   */
  getPrerequisites(itemId: string): Promise<KnowledgeNode[]>;

  /**
   * Get knowledge coverage for a domain
   */
  getCoverage(domain: SkillDomain): Promise<CoverageReport>;
}

export interface KnowledgeNode {
  id: string;
  type: string;
  label: string;
  strength: number; // 0-1
  connections: string[];
}

export interface CoverageReport {
  domain: SkillDomain;
  totalItems: number;
  coveredItems: number;
  masteryLevel: number; // 0-1
  gaps: string[];
}
