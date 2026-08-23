import type {
  AdaptiveMode,
  CompetencyLevel,
  IntensityLevel,
  SkillDomain,
  StrictnessLevel,
  StudyDuration,
} from "./index";

/**
 * Student Model - the core user capability tracking system
 */
export interface StudentModel {
  userId: string;
  createdAt: number;
  lastActive: number;
  dayNumber: number;
  competencyLevel: CompetencyLevel;
  overallScore: number; // continuous 0-100

  // Skill-level scores
  skills: SkillScores;

  // Detailed tracking
  vocabularyStats: VocabularyStats;
  grammarStats: GrammarStats;
  listeningStats: ListeningStats;
  speakingStats: SpeakingStats;
  readingStats: ReadingStats;
  writingStats: WritingStats;
  pronunciationStats: PronunciationStats;

  // Performance metrics
  recentPerformance: PerformanceWindow[];
  longTermTrend: TrendData;

  // Study settings
  settings: UserSettings;

  // XP and gamification
  xp: number;
  level: number;
  streak: number;
  lastStudyDate: string; // YYYY-MM-DD
}

export interface SkillScores {
  vocabulary: SkillScore;
  grammar: SkillScore;
  phonics: SkillScore;
  listening: SkillScore;
  speaking: SkillScore;
  reading: SkillScore;
  writing: SkillScore;
  pronunciation: SkillScore;
  fluency: SkillScore;
  naturalness: SkillScore;
}

export interface SkillScore {
  score: number; // 0-100
  level: CompetencyLevel;
  lastUpdated: number;
  trend: "improving" | "stable" | "declining";
}

export interface VocabularyStats {
  totalSeen: number;
  recognized: number;
  recalled: number;
  produced: number;
  mastered: number;
  transferred: number;
  currentStreak: number;
  averageEaseFactor: number;
}

export interface GrammarStats {
  totalPoints: number;
  understood: number;
  practiced: number;
  mastered: number;
  transferred: number;
}

export interface ListeningStats {
  comprehensionScore: number;
  phonemeDiscrimination: number;
  wordRecognition: number;
  sentenceRecognition: number;
  connectedSpeechScore: number;
  realWorldComprehension: number;
}

export interface SpeakingStats {
  pronunciationScore: number;
  fluencyScore: number;
  spontaneityScore: number;
  accuracyScore: number;
  naturalnessScore: number;
}

export interface ReadingStats {
  comprehensionScore: number;
  readingSpeed: number; // words per minute
  inferenceScore: number;
  contextClueScore: number;
  level: CompetencyLevel;
}

export interface WritingStats {
  grammarAccuracy: number;
  spellingAccuracy: number;
  vocabularyRange: number;
  sentenceStructure: number;
  coherence: number;
  naturalness: number;
}

export interface PronunciationStats {
  phonemeAccuracy: number;
  wordStress: number;
  sentenceStress: number;
  intonation: number;
  connectedSpeech: number;
  overallScore: number;
}

export interface PerformanceWindow {
  date: string; // YYYY-MM-DD
  domain: SkillDomain;
  accuracy: number;
  responseTime: number; // ms average
  itemsReviewed: number;
  newItems: number;
  errors: number;
}

export interface TrendData {
  direction: "improving" | "stable" | "declining";
  rate: number; // score change per week
  volatility: number;
}

export interface UserSettings {
  adaptiveMode: AdaptiveMode;
  intensity: IntensityLevel;
  strictness: StrictnessLevel;
  dailyTargetMinutes: StudyDuration;
  customMinutes?: number;
  chineseAssistLevel: "full" | "moderate" | "minimal" | "immersive" | "auto";
  soundEnabled: boolean;
  microphoneEnabled: boolean;
  targetAccent: "american" | "british" | "australian";
  interfaceLanguage: "chinese" | "english" | "auto";
}
