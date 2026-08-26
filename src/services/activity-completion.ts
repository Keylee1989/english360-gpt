/**
 * Activity Completion Service
 *
 * Bridges learning activity pages (Review, Quiz, Practice) back to the
 * HomePage daily mission. When an activity page finishes, it calls
 * markActivityComplete() so the home progress bar updates and the
 * activity is marked ✅ for today.
 */

const BASE_KEY = "english360_completed_activities";
const PROFILE_KEY = "english360_user_profile";

/** Activity type → mission activity id mapping (must match daily-coach v2 ids) */
export const TYPE_TO_ACTIVITY_ID: Record<string, string> = {
  srs_review: "act_srs",
  listening_input: "act_listening",
  shadowing: "act_shadowing",
  conversation: "act_conversation",
  reading: "act_reading",
  writing: "act_writing",
  grammar: "act_grammar",
  pronunciation: "act_pronunciation",
  vocabulary_new: "act_vocabulary",
  assessment: "act_grammar", // fallback
};

function todayKey(): string {
  return `${BASE_KEY}_${new Date().toISOString().split("T")[0]}`;
}

export function getCompletedActivitiesToday(): string[] {
  try {
    const raw = localStorage.getItem(todayKey());
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Mark an activity as complete for today by its type (e.g. "srs_review").
 * Safe to call multiple times — duplicates are ignored.
 */
export function markActivityComplete(activityType: string): void {
  try {
    const activityId = TYPE_TO_ACTIVITY_ID[activityType] || activityType;
    const done = getCompletedActivitiesToday();
    if (!done.includes(activityId)) {
      localStorage.setItem(todayKey(), JSON.stringify([...done, activityId]));
    }
    // Notify same-tab listeners so HomePage refreshes when user returns
    window.dispatchEvent(new Event("english360_activity_complete"));
  } catch (e) {
    console.error("markActivityComplete failed:", e);
  }
}

/** Update the learner profile with score/word gains after an activity */
export function updateProfileAfterActivity(gains: {
  wordsLearned?: number;
  wordsMastered?: number;
}): void {
  try {
    let raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) {
      // First-run fallback: create a minimal profile so gains are never lost
      raw = JSON.stringify({ userId: "user_1", currentDay: 1, level: "A1", wordsLearned: 0, wordsMastered: 0, studyStreak: 0 });
      localStorage.setItem(PROFILE_KEY, raw);
    }
    const profile = JSON.parse(raw);
    if (!profile) return;
    profile.wordsLearned = (profile.wordsLearned || 0) + (gains.wordsLearned || 0);
    profile.wordsMastered = (profile.wordsMastered || 0) + (gains.wordsMastered || 0);
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    window.dispatchEvent(new Event("english360_activity_complete"));
  } catch (e) {
    console.error("updateProfileAfterActivity failed:", e);
  }
}
