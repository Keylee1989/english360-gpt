/**
 * Assessment Engine v4 — Day 30 Learning Outcome Validation
 *
 * Verifies if user reaches expected learning outcomes:
 * - Vocabulary: 300 words
 * - Listening: Understand slow daily conversation
 * - Speaking: 3-minute self introduction
 * - Reading: Simple daily article
 * - Writing: 5-10 sentences daily diary
 */

// ============================================================
// Types
// ============================================================

export interface AssessmentResult {
  userId: string;
  day: number;
  vocabulary: VocabularyAssessment;
  listening: ListeningAssessment;
  speaking: SpeakingAssessment;
  reading: ReadingAssessment;
  writing: WritingAssessment;
  overallScore: number;
  cefrLevel: string;
  achievements: string[];
  recommendations: string[];
  completedAt: number;
}

export interface VocabularyAssessment {
  wordsTested: number;
  wordsRecognized: number;
  wordsRecalled: number;
  wordsUsedCorrectly: number;
  score: number;
}

export interface ListeningAssessment {
  dialoguesPlayed: number;
  questionsAnswered: number;
  correctAnswers: number;
  score: number;
}

export interface SpeakingAssessment {
  selfIntroduction: boolean;
  duration: number;
  sentencesSpoken: number;
  pronunciationScore: number;
  score: number;
}

export interface ReadingAssessment {
  passagesRead: number;
  comprehensionQuestions: number;
  correctAnswers: number;
  score: number;
}

export interface WritingAssessment {
  sentencesWritten: number;
  grammarAccuracy: number;
  vocabularyUse: number;
  score: number;
}

export interface AchievementReport {
  title: string;
  titleChinese: string;
  vocabulary: {
    learned: number;
    target: number;
    percentage: number;
  };
  listening: {
    level: string;
    score: number;
  };
  speaking: {
    canDo: string[];
    score: number;
  };
  cefrLevel: string;
  nextGoal: string;
  nextGoalChinese: string;
}

// ============================================================
// Assessment Engine v4
// ============================================================

export class AssessmentEngineV4 {
  /**
   * Assess vocabulary
   */
  assessVocabulary(
    wordsTested: number,
    wordsRecognized: number,
    wordsRecalled: number,
    wordsUsedCorrectly: number
  ): VocabularyAssessment {
    const recognitionRate = wordsTested > 0 ? wordsRecognized / wordsTested : 0;
    const recallRate = wordsTested > 0 ? wordsRecalled / wordsTested : 0;
    const usageRate = wordsTested > 0 ? wordsUsedCorrectly / wordsTested : 0;

    const score = Math.round(
      (recognitionRate * 30 + recallRate * 40 + usageRate * 30) * 100
    );

    return {
      wordsTested,
      wordsRecognized,
      wordsRecalled,
      wordsUsedCorrectly,
      score,
    };
  }

  /**
   * Assess listening
   */
  assessListening(
    dialoguesPlayed: number,
    questionsAnswered: number,
    correctAnswers: number
  ): ListeningAssessment {
    const accuracy = questionsAnswered > 0 ? correctAnswers / questionsAnswered : 0;
    const score = Math.round(accuracy * 100);

    return {
      dialoguesPlayed,
      questionsAnswered,
      correctAnswers,
      score,
    };
  }

  /**
   * Assess speaking
   */
  assessSpeaking(
    selfIntroduction: boolean,
    duration: number,
    sentencesSpoken: number,
    pronunciationScore: number
  ): SpeakingAssessment {
    let score = 0;

    if (selfIntroduction) score += 30;
    if (duration >= 60) score += 20;
    if (duration >= 180) score += 10;
    if (sentencesSpoken >= 5) score += 20;
    score += Math.round(pronunciationScore * 0.2);

    score = Math.min(score, 100);

    return {
      selfIntroduction,
      duration,
      sentencesSpoken,
      pronunciationScore,
      score,
    };
  }

  /**
   * Assess reading
   */
  assessReading(
    passagesRead: number,
    comprehensionQuestions: number,
    correctAnswers: number
  ): ReadingAssessment {
    const accuracy = comprehensionQuestions > 0 ? correctAnswers / comprehensionQuestions : 0;
    const score = Math.round(accuracy * 100);

    return {
      passagesRead,
      comprehensionQuestions,
      correctAnswers,
      score,
    };
  }

  /**
   * Assess writing
   */
  assessWriting(
    sentencesWritten: number,
    grammarAccuracy: number,
    vocabularyUse: number
  ): WritingAssessment {
    let score = 0;

    if (sentencesWritten >= 5) score += 30;
    if (sentencesWritten >= 10) score += 10;
    score += Math.round(grammarAccuracy * 0.3);
    score += Math.round(vocabularyUse * 0.3);

    score = Math.min(score, 100);

    return {
      sentencesWritten,
      grammarAccuracy,
      vocabularyUse,
      score,
    };
  }

  /**
   * Calculate overall score
   */
  calculateOverallScore(
    vocabulary: VocabularyAssessment,
    listening: ListeningAssessment,
    speaking: SpeakingAssessment,
    reading: ReadingAssessment,
    writing: WritingAssessment
  ): number {
    return Math.round(
      vocabulary.score * 0.25 +
      listening.score * 0.2 +
      speaking.score * 0.25 +
      reading.score * 0.15 +
      writing.score * 0.15
    );
  }

  /**
   * Determine CEFR level
   */
  determineCEFRLevel(overallScore: number): string {
    if (overallScore >= 80) return "A2";
    if (overallScore >= 60) return "A1+";
    if (overallScore >= 40) return "A1";
    return "Pre-A1";
  }

  /**
   * Generate achievements
   */
  generateAchievements(
    vocabulary: VocabularyAssessment,
    speaking: SpeakingAssessment,
    overallScore: number
  ): string[] {
    const achievements: string[] = [];

    if (vocabulary.wordsRecognized >= 100) {
      achievements.push("100词识别");
    }
    if (vocabulary.wordsRecalled >= 50) {
      achievements.push("50词回忆");
    }
    if (speaking.selfIntroduction) {
      achievements.push("完成自我介绍");
    }
    if (speaking.duration >= 60) {
      achievements.push("口语1分钟");
    }
    if (overallScore >= 60) {
      achievements.push("总分及格");
    }

    return achievements;
  }

  /**
   * Generate recommendations
   */
  generateRecommendations(
    vocabulary: VocabularyAssessment,
    listening: ListeningAssessment,
    speaking: SpeakingAssessment
  ): string[] {
    const recommendations: string[] = [];

    if (vocabulary.score < 60) {
      recommendations.push("增加词汇复习频率，每天复习20个单词");
    }
    if (listening.score < 60) {
      recommendations.push("每天听30分钟慢速英语");
    }
    if (speaking.score < 60) {
      recommendations.push("每天练习15分钟口语跟读");
    }

    return recommendations;
  }

  /**
   * Generate full Day 30 assessment
   */
  generateDay30Assessment(
    userId: string,
    vocabularyData: { tested: number; recognized: number; recalled: number; used: number },
    listeningData: { dialogues: number; questions: number; correct: number },
    speakingData: { selfIntro: boolean; duration: number; sentences: number; pronunciation: number },
    readingData: { passages: number; questions: number; correct: number },
    writingData: { sentences: number; grammar: number; vocabulary: number }
  ): AssessmentResult {
    const vocabulary = this.assessVocabulary(
      vocabularyData.tested, vocabularyData.recognized,
      vocabularyData.recalled, vocabularyData.used
    );
    const listening = this.assessListening(
      listeningData.dialogues, listeningData.questions, listeningData.correct
    );
    const speaking = this.assessSpeaking(
      speakingData.selfIntro, speakingData.duration,
      speakingData.sentences, speakingData.pronunciation
    );
    const reading = this.assessReading(
      readingData.passages, readingData.questions, readingData.correct
    );
    const writing = this.assessWriting(
      writingData.sentences, writingData.grammar, writingData.vocabulary
    );

    const overallScore = this.calculateOverallScore(vocabulary, listening, speaking, reading, writing);
    const cefrLevel = this.determineCEFRLevel(overallScore);
    const achievements = this.generateAchievements(vocabulary, speaking, overallScore);
    const recommendations = this.generateRecommendations(vocabulary, listening, speaking);

    return {
      userId,
      day: 30,
      vocabulary,
      listening,
      speaking,
      reading,
      writing,
      overallScore,
      cefrLevel,
      achievements,
      recommendations,
      completedAt: Date.now(),
    };
  }

  /**
   * Generate achievement report
   */
  generateAchievementReport(result: AssessmentResult): AchievementReport {
    const getListeningLevel = (score: number): string => {
      if (score >= 80) return "能听懂日常对话";
      if (score >= 60) return "能听懂慢速英语";
      if (score >= 40) return "能听懂简单句子";
      return "刚开始学习听力";
    };

    const getSpeakingCanDo = (score: number): string[] => {
      const canDo: string[] = [];
      if (score >= 30) canDo.push("自我介绍");
      if (score >= 50) canDo.push("简单对话");
      if (score >= 70) canDo.push("描述日常活动");
      return canDo;
    };

    const getNextGoal = (cefrLevel: string): { goal: string; goalChinese: string } => {
      switch (cefrLevel) {
        case "A1":
          return { goal: "A2 Conversation", goalChinese: "A2级日常对话" };
        case "A1+":
          return { goal: "A2 Fluency", goalChinese: "A2级流利表达" };
        case "A2":
          return { goal: "B1 Intermediate", goalChinese: "B1中级水平" };
        default:
          return { goal: "A1 Foundation", goalChinese: "A1基础巩固" };
      }
    };

    const nextGoal = getNextGoal(result.cefrLevel);

    return {
      title: "Day 30 Achievement Report",
      titleChinese: "第30天学习成果报告",
      vocabulary: {
        learned: result.vocabulary.wordsRecognized,
        target: 300,
        percentage: Math.round((result.vocabulary.wordsRecognized / 300) * 100),
      },
      listening: {
        level: getListeningLevel(result.listening.score),
        score: result.listening.score,
      },
      speaking: {
        canDo: getSpeakingCanDo(result.speaking.score),
        score: result.speaking.score,
      },
      cefrLevel: result.cefrLevel,
      nextGoal: nextGoal.goal,
      nextGoalChinese: nextGoal.goalChinese,
    };
  }
}

// ============================================================
// Factory Function
// ============================================================

export function createAssessmentEngineV4(): AssessmentEngineV4 {
  return new AssessmentEngineV4();
}

export default AssessmentEngineV4;
