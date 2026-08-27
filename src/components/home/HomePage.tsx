/**
 * HomePage — Today's Mission
 *
 * Shows:
 * - Current day and streak
 * - Today's learning mission
 * - Activity list with progress
 * - Quick actions
 * - Progress summary
 */

import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DailyCoachEngineV2, type DailyMission, type LearnerProfile, type MissionActivityItem } from "@/engines/daily-coach/v2";
import { AudioEngine } from "@/engines/audio";

// ============================================================
// Storage Keys
// ============================================================

const STORAGE_KEYS = {
  USER_PROFILE: "english360_user_profile",
  CURRENT_DAY: "english360_current_day",
  MISSIONS: "english360_missions",
  COMPLETED_ACTIVITIES: "english360_completed_activities",
};

// ============================================================
// Default Profile
// ============================================================

const DEFAULT_PROFILE: LearnerProfile = {
  userId: "user_1",
  currentDay: 1,
  level: "A1",
  vocabularyLevel: 20,
  listeningLevel: 15,
  speakingLevel: 10,
  grammarLevel: 20,
  readingLevel: 15,
  writingLevel: 10,
  pronunciationLevel: 15,
  weakAreas: ["speaking", "listening"],
  strongAreas: [],
  wordsLearned: 0,
  wordsMastered: 0,
  retentionRate: 0.5,
  studyStreak: 0,
  dailyGoalMinutes: 240,
  yesterdayCompleted: [],
  yesterdayScore: 0,
};

// ============================================================
// Helper Functions
// ============================================================

function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveToStorage(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Storage save failed:", e);
  }
}

function getActivityIcon(type: string): string {
  const icons: Record<string, string> = {
    srs_review: "🔄",
    listening_input: "👂",
    shadowing: "🗣️",
    conversation: "💬",
    reading: "📖",
    writing: "✏️",
    grammar: "📝",
    pronunciation: "🔤",
    vocabulary_new: "📚",
    assessment: "📋",
  };
  return icons[type] || "📝";
}



// ============================================================
// HomePage Component
// ============================================================

export default function HomePage() {
  const navigate = useNavigate();
  const [activeActivity, setActiveActivity] = useState<MissionActivityItem | null>(null);
  const [audioEngine] = useState(() => new AudioEngine());
  // Activity-specific state
  const [vocabIndex, setVocabIndex] = useState(0);
  const [vocabShowMeaning, setVocabShowMeaning] = useState(false);
  
  const [grammarRead, setGrammarRead] = useState(false);
  const [listeningPlayed, setListeningPlayed] = useState(false);
  const [replayDay, setReplayDay] = useState(1);
  // Conversation state
  const [chatMessages, setChatMessages] = useState<Array<{role: string; content: string}>>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  // Direct TTS (no prefix)
  const speakDirect = (text: string, rate = 0.8) => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US"; u.rate = rate;
    window.speechSynthesis.speak(u);
  };

  // Local mock chat response
  const getLocalReply = (msg: string): string => {
    const m = msg.toLowerCase().trim();
    if (/^(hello|hi|hey)/.test(m)) return "Hello! 👋 How are you today? (你好！今天怎么样？)";
    if (/my name|i am|i'm/.test(m)) return "Nice to meet you! 👏 试着说：My name is ___. I am from ___. (很高兴认识你！)";
    if (/good|fine|well|great/.test(m)) return "That's great! 😊 What do you like to do? (太好了！你喜欢做什么？)";
    if (/like|love|enjoy/.test(m)) return "Cool! I like English too. What else? (太酷了！你还喜欢什么？)";
    if (/go|want|need/.test(m)) return "Good sentence! 👍 Try: I want to ___. (好句子！试试说我想___)";
    if (/eat|food|drink/.test(m)) return "Yummy! 🍎 I like apples. Do you like Chinese food? (好吃！我喜欢苹果，你喜欢中国菜吗？)";
    if (/yes|no|ok/.test(m)) return "OK! Let's keep practicing. Try to say a full sentence. (好的！继续练习，试着说完整句子)";
    return "Good try! 👏 Try to use: I + verb. Example: I like English. (说得好！试试用 I + 动词)";
  };

  // Send chat message
  const sendChat = useCallback(async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    setChatMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setChatLoading(true);
    // Simulate AI thinking delay
    await new Promise(r => setTimeout(r, 500));
    const reply = getLocalReply(userMsg);
    setChatMessages(prev => [...prev, { role: "tutor", content: reply }]);
    setChatLoading(false);
  }, [chatInput, chatLoading]);
  const [profile, setProfile] = useState<LearnerProfile>(DEFAULT_PROFILE);
  const [mission, setMission] = useState<DailyMission | null>(null);
  const [completedActivities, setCompletedActivities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const coach = useMemo(() => new DailyCoachEngineV2(), []);

  // Load profile and generate mission
  useEffect(() => {
    const loadAndGenerate = () => {
      // Load profile from storage (persist on first run so activity pages can update it)
      const savedProfile = loadFromStorage<LearnerProfile>(
        STORAGE_KEYS.USER_PROFILE,
        DEFAULT_PROFILE
      );
      saveToStorage(STORAGE_KEYS.USER_PROFILE, savedProfile);
      setProfile(savedProfile);

      // Load completed activities for today
      const today = new Date().toISOString().split("T")[0];
      const savedCompleted = loadFromStorage<string[]>(
        `${STORAGE_KEYS.COMPLETED_ACTIVITIES}_${today}`,
        []
      );
      setCompletedActivities(savedCompleted);

      // Generate today's mission
      const todayMission = coach.generateMission(savedProfile);
      setMission(todayMission);

      setLoading(false);
    };

    loadAndGenerate();

    // Refresh progress when an activity page reports completion (same-tab event)
    const onActivityComplete = () => {
      const today = new Date().toISOString().split("T")[0];
      setCompletedActivities(
        loadFromStorage<string[]>(`${STORAGE_KEYS.COMPLETED_ACTIVITIES}_${today}`, [])
      );
      setProfile(loadFromStorage<LearnerProfile>(STORAGE_KEYS.USER_PROFILE, DEFAULT_PROFILE));
    };
    window.addEventListener("english360_activity_complete", onActivityComplete);
    return () => window.removeEventListener("english360_activity_complete", onActivityComplete);
  }, [coach]);

  // Handle activity completion
  const handleActivityComplete = useCallback(
    (activityId: string) => {
      if (!mission) return;

      // Mark as completed
      const newCompleted = [...completedActivities, activityId];
      setCompletedActivities(newCompleted);

      // Save to storage
      const today = new Date().toISOString().split("T")[0];
      saveToStorage(
        `${STORAGE_KEYS.COMPLETED_ACTIVITIES}_${today}`,
        newCompleted
      );

      // Update mission in engine
      try {
        coach.completeActivity(mission.id, activityId, 0.8);
      } catch (e) {
        console.error("Failed to complete activity:", e);
      }

      // Update profile
      const updatedProfile = {
        ...profile,
        wordsLearned: profile.wordsLearned + 5,
        wordsMastered: profile.wordsMastered + 2,
      };
      setProfile(updatedProfile);
      saveToStorage(STORAGE_KEYS.USER_PROFILE, updatedProfile);
    },
    [mission, completedActivities, profile, coach]
  );

  // Open activity inline (no navigation)
  const handleActivityClick = (activity: MissionActivityItem) => {
    const completed = completedActivities || [];
    if (completed.includes(activity.id)) return;
    setActiveActivity(activity);
    setVocabIndex(0);
    setVocabShowMeaning(false);
    
    setGrammarRead(false);
    setListeningPlayed(false);
  };

  // Complete activity and return to task list
  const handleActivityDone = useCallback(() => {
    if (!activeActivity) return;
    handleActivityComplete(activeActivity.id);
    setActiveActivity(null);
  }, [activeActivity, handleActivityComplete]);

  if (loading) {
    return (
      <div className="page-container">
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">加载中...</div>
        </div>
      </div>
    );
  }

  const completedCount = completedActivities.length;
  const totalCount = mission?.activities.length || 0;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // ============================================================
  // Inline Activity View (when a task is active)
  // ============================================================
  if (activeActivity) {
    return (
      <div className="page-container">
        {/* Back button */}
        <button
          onClick={() => setActiveActivity(null)}
          className="mb-4 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
        >
          ← 返回任务列表
        </button>

        {/* Activity header */}
        <div className="card mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getActivityIcon(activeActivity.type)}</span>
            <div>
              <h2 className="font-bold text-lg">{activeActivity.titleChinese}</h2>
              <p className="text-sm text-gray-500">{activeActivity.descriptionChinese}</p>
            </div>
          </div>
        </div>

        {/* Activity content by type */}
        <div className="card mb-4">
          {activeActivity.type === "vocabulary_new" && (
            <div className="space-y-4">
              <div className="text-center text-sm text-gray-500">
                单词 {(activeActivity.content as any)?.words?.length ? vocabIndex + 1 : 1} / {(activeActivity.content as any)?.words?.length || 5}
              </div>
              {(() => {
                const words = (activeActivity.content as any)?.words || [];
                const w = words[vocabIndex];
                if (!w) return <p className="text-gray-500">没有词汇数据，请点击完成</p>;
                return (
                  <div className="rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 p-6 text-center">
                    <div className="text-4xl font-bold text-primary-700 mb-2">{w.word}</div>
                    <div className="text-lg text-primary-500 mb-1">{w.ipa}</div>
                    {!vocabShowMeaning ? (
                      <button
                        onClick={() => setVocabShowMeaning(true)}
                        className="mt-4 rounded-lg border-2 border-primary-500 px-6 py-2 text-primary-600 font-medium"
                      >
                        显示中文意思
                      </button>
                    ) : (
                      <div className="mt-4 space-y-2">
                        <div className="text-2xl font-bold text-primary-600">{w.chineseMeaning}</div>
                        {w.memoryHint && <div className="rounded-lg bg-amber-50 p-2 text-sm text-amber-700">💡 {w.memoryHint}</div>}
                        {w.example && <div className="text-sm text-gray-600">📝 {w.example}</div>}
                      </div>
                    )}
                  </div>
                );
              })()}
              <button
                onClick={() => audioEngine.playWord(((activeActivity.content as any)?.words || [])[vocabIndex]?.word || "hello")}
                className="w-full rounded-lg bg-gray-100 py-3 text-gray-700 font-medium"
              >
                🔊 播放发音
              </button>
              {vocabShowMeaning && (
                <button
                  onClick={() => {
                    const words = (activeActivity.content as any)?.words || [];
                    if (vocabIndex < words.length - 1) {
                      setVocabIndex((i) => i + 1);
                      setVocabShowMeaning(false);
                    }
                  }}
                  className="w-full rounded-lg bg-green-500 py-3 text-white font-medium"
                >
                  {vocabIndex < ((activeActivity.content as any)?.words?.length || 1) - 1 ? "下一个单词 ✅" : "✅ 已学完全部单词"}
                </button>
              )}
            </div>
          )}

          {activeActivity.type === "srs_review" && (
            <div className="space-y-4 text-center">
              <div className="text-5xl">🔄</div>
              <h3 className="text-xl font-bold">SRS 复习</h3>
              <p className="text-gray-500">复习之前学过的单词，防止遗忘</p>
              <button
                onClick={() => navigate("/review")}
                className="w-full rounded-lg bg-primary-500 py-3 text-white font-medium"
              >
                开始复习测试 →
              </button>
            </div>
          )}

          {activeActivity.type === "pronunciation" && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-5xl mb-2">🔤</div>
                <h3 className="text-xl font-bold">发音练习</h3>
                <p className="text-gray-500">点击每个字母听发音，然后跟读</p>
              </div>
              {(() => {
                const letters = ["A", "B", "C", "D", "E"];
                const sounds = ["ay", "bee", "see", "dee", "ee"];
                const words = ["apple", "book", "cat", "dog", "egg"];
                const chinas = ["苹果", "书", "猫", "狗", "鸡蛋"];
                return (
                  <div className="space-y-2">
                    {letters.map((l, i) => (
                      <div key={l} className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                        <div className="text-3xl font-bold text-primary-600 w-10">{l}</div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{sounds[i]}</div>
                          <div className="text-xs text-gray-500">{words[i]} ({chinas[i]})</div>
                        </div>
                        <button onClick={() => speakDirect(l, 0.6)} className="rounded-lg bg-primary-100 px-3 py-2 text-primary-600 hover:bg-primary-200">
                          🔊
                        </button>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          )}

          {activeActivity.type === "listening_input" && (
            <div className="space-y-4 text-center">
              <div className="text-5xl">👂</div>
              <h3 className="text-xl font-bold">听力练习</h3>
              <p className="text-gray-500">仔细听，理解内容</p>
              <button
                onClick={() => {
                  audioEngine.playSentence("Hello, how are you today? I am fine, thank you.");
                  setListeningPlayed(true);
                }}
                className={`w-full rounded-lg py-4 text-lg text-white font-medium ${listeningPlayed ? "bg-green-500" : "bg-primary-500"}`}
              >
                {listeningPlayed ? "✅ 已播放" : "🔊 播放音频"}
              </button>
            </div>
          )}

          {activeActivity.type === "shadowing" && (
            <div className="space-y-4 text-center">
              <div className="text-5xl">🗣️</div>
              <h3 className="text-xl font-bold">跟读练习</h3>
              <p className="text-gray-500">听一句，跟读一句</p>
              <button
                onClick={() => {
                  audioEngine.playSentence("Nice to meet you.");
                  setListeningPlayed(true);
                }}
                className="w-full rounded-lg bg-primary-500 py-4 text-lg text-white font-medium"
              >
                🔊 播放句子
              </button>
              <button
                onClick={() => {
                  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
                  if (!SpeechRecognition) { alert("浏览器不支持语音识别"); return; }
                  const r = new SpeechRecognition();
                  r.lang = "en-US"; r.interimResults = false;
                  r.onresult = () => setListeningPlayed(true);
                  r.start();
                }}
                className="w-full rounded-lg bg-green-500 py-4 text-lg text-white font-medium"
              >
                🎤 开始跟读
              </button>
            </div>
          )}

          {activeActivity.type === "conversation" && (
            <div className="space-y-3">
              <div className="text-center">
                <div className="text-4xl mb-2">💬</div>
                <h3 className="text-xl font-bold">对话练习</h3>
                <p className="text-sm text-gray-500">用英语和老师对话，练习口语</p>
              </div>
              {/* Chat messages */}
              <div className="max-h-64 overflow-y-auto space-y-2 bg-gray-50 rounded-lg p-3">
                {chatMessages.length === 0 && (
                  <div className="text-center text-gray-400 text-sm py-4">
                    👋 Hello! 试着用英语和我打招呼吧！
                  </div>
                )}
                {chatMessages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                      m.role === "user" ? "bg-primary-500 text-white" : "bg-white border text-gray-800"
                    }`}>
                      {m.content}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border rounded-lg px-3 py-2 text-sm text-gray-400">思考中...</div>
                  </div>
                )}
              </div>
              {/* Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && chatInput.trim()) sendChat(); }}
                  placeholder="Type in English..."
                  className="flex-1 rounded-lg border px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
                />
                <button
                  onClick={sendChat}
                  disabled={!chatInput.trim() || chatLoading}
                  className="rounded-lg bg-primary-500 px-4 py-2 text-sm text-white font-medium disabled:opacity-50"
                >发送</button>
              </div>
            </div>
          )}

          {activeActivity.type === "reading" && (
            <div className="space-y-4">
              <div className="text-center mb-2">
                <div className="text-4xl mb-2">📖</div>
                <h3 className="text-xl font-bold">阅读练习</h3>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-lg font-medium mb-2">My Family</p>
                <p className="text-gray-700 leading-relaxed">
                  Hello! My name is Li Ming. I am from China. I have a family of four. My father is a teacher. My mother is a nurse. I have a sister. Her name is Li Hua. She is 10 years old. We live in Beijing. I love my family.
                </p>
                <p className="text-sm text-gray-500 mt-3 border-t pt-3">
                  🇨🇳 你好！我叫李明。我来自中国。我家有四口人。我爸爸是老师。我妈妈是护士。我有一个妹妹。她叫李华。她10岁了。我们住在北京。我爱我的家人。
                </p>
              </div>
              <div className="rounded-lg bg-blue-50 p-3 text-sm">
                <p className="font-medium text-blue-800 mb-1">❓ 阅读理解：</p>
                <p className="text-blue-700">1. Li Ming is from ___ (China/Japan)</p>
                <p className="text-blue-700">2. His father is a ___ (teacher/doctor)</p>
                <p className="text-blue-700">3. How old is Li Hua? ___ (10/12)</p>
              </div>
              <button onClick={() => setGrammarRead(true)} className={`w-full rounded-lg py-3 font-medium ${grammarRead ? "bg-green-500 text-white" : "bg-primary-500 text-white"}`}>
                {grammarRead ? "✅ 已阅读" : "✅ 我已阅读"}
              </button>
            </div>
          )}

          {activeActivity.type === "writing" && (
            <div className="space-y-4">
              <div className="text-center mb-2">
                <div className="text-4xl mb-2">✏️</div>
                <h3 className="text-xl font-bold">写作练习</h3>
              </div>
              <div className="rounded-lg bg-amber-50 p-4">
                <p className="font-medium text-amber-800 mb-2">📝 写作任务：</p>
                <p className="text-amber-700">用英语写3个句子介绍你自己：</p>
                <ul className="text-sm text-amber-600 mt-2 space-y-1">
                  <li>• My name is ___.</li>
                  <li>• I am from ___.</li>
                  <li>• I like ___.</li>
                </ul>
              </div>
              <textarea
                placeholder="在这里写你的英语句子..."
                className="w-full rounded-lg border p-3 text-sm focus:border-primary-500 focus:outline-none"
                rows={4}
              />
              <button onClick={() => setGrammarRead(true)} className={`w-full rounded-lg py-3 font-medium ${grammarRead ? "bg-green-500 text-white" : "bg-primary-500 text-white"}`}>
                {grammarRead ? "✅ 已完成" : "✅ 我已完成"}
              </button>
            </div>
          )}

          {activeActivity.type === "grammar" && (
            <div className="space-y-4">
              <div className="text-center mb-2">
                <div className="text-4xl mb-2">📝</div>
                <h3 className="text-xl font-bold">语法练习</h3>
              </div>
              <div className="rounded-lg bg-blue-50 p-4">
                <p className="font-medium text-blue-800 mb-2">📖 今日语法：be动词</p>
                <div className="text-sm text-blue-700 space-y-1">
                  <p>I <strong>am</strong> a student. (我是学生)</p>
                  <p>You <strong>are</strong> my friend. (你是我的朋友)</p>
                  <p>He <strong>is</strong> a teacher. (他是老师)</p>
                  <p>She <strong>is</strong> beautiful. (她很漂亮)</p>
                  <p>It <strong>is</strong> a cat. (它是一只猫)</p>
                </div>
                <div className="mt-3 p-2 bg-white rounded text-sm">
                  <p className="font-medium text-amber-700">💡 记忆口诀：我am你are，他她它是is，复数全部都用are</p>
                </div>
              </div>
              <div className="rounded-lg bg-gray-50 p-3 text-sm">
                <p className="font-medium mb-1">✏️ 选词填空：</p>
                <p>1. I ___ a student. (am/is/are)</p>
                <p>2. She ___ my mother. (am/is/are)</p>
                <p>3. They ___ friends. (am/is/are)</p>
              </div>
              <button onClick={() => setGrammarRead(true)} className={`w-full rounded-lg py-3 font-medium ${grammarRead ? "bg-green-500 text-white" : "bg-primary-500 text-white"}`}>
                {grammarRead ? "✅ 已学习" : "✅ 我已学习"}
              </button>
            </div>
          )}

        </div>

        {/* Complete button */}
        <button
          onClick={handleActivityDone}
          className="w-full rounded-xl bg-green-500 px-6 py-4 text-lg font-bold text-white shadow-md hover:bg-green-600"
        >
          ✅ 完成此任务
        </button>
      </div>
    );
  }

  // ============================================================
  // Main Task List View
  // ============================================================
  return (
    <div className="page-container">
      {/* Header */}
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-primary-800">English360</h1>
        <p className="mt-1 text-sm text-gray-500">你的AI英语教练</p>
      </header>

      {/* Today's Summary Card */}
      <div className="card mb-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Day {profile.currentDay}</h2>
            <p className="text-sm text-primary-100">
              连续学习 {profile.studyStreak} 天
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{progressPercent}%</div>
            <p className="text-xs text-primary-100">今日完成</p>
          </div>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-primary-400">
          <div
            className="h-full bg-white transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* All Complete — Next Day */}
      {completedCount >= totalCount && totalCount > 0 && (
        <div className="card mb-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white">
          <div className="text-center py-4">
            <div className="text-4xl mb-2">🎉</div>
            <h3 className="text-xl font-bold">恭喜完成今日全部任务！</h3>
            <p className="text-sm text-green-100 mt-1">坚持学习，每天进步一点点</p>
            <button
              onClick={() => {
                const updatedProfile = { ...profile, currentDay: profile.currentDay + 1, studyStreak: profile.studyStreak + 1 };
                setProfile(updatedProfile);
                saveToStorage(STORAGE_KEYS.USER_PROFILE, updatedProfile);
                window.location.reload();
              }}
              className="mt-4 rounded-lg bg-white px-6 py-3 font-bold text-green-600 shadow-lg hover:bg-green-50"
            >
              🚀 进入 Day {profile.currentDay + 1}
            </button>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary-600">
            {profile.wordsLearned}
          </div>
          <div className="text-xs text-gray-500">已学单词</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary-600">
            {profile.studyStreak}
          </div>
          <div className="text-xs text-gray-500">连续天数</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary-600">
            {profile.level || 'A1'}
          </div>
          <div className="text-xs text-gray-500">当前等级</div>
        </div>
      </div>

      {/* Today's Mission */}
      {mission && (
        <div className="card mb-4">
          <h2 className="mb-3 text-lg font-semibold">今日学习任务</h2>
          <div className="space-y-2">
            {mission.activities.map((activity) => {
              const isCompleted = completedActivities.includes(activity.id);
              return (
                <div
                  key={activity.id}
                  className={`flex items-center gap-3 rounded-lg p-3 transition-colors ${
                    isCompleted
                      ? "bg-green-50 opacity-70"
                      : "bg-gray-50 hover:bg-gray-100 cursor-pointer"
                  }`}
                  onClick={() => handleActivityClick(activity)}
                >
                  <div className="text-2xl">{getActivityIcon(activity.type)}</div>
                  <div className="flex-1">
                    <div className="font-medium">{activity.titleChinese}</div>
                  </div>
                  <div>
                    {isCompleted ? (
                      <span className="text-2xl">✅</span>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleActivityComplete(activity.id);
                        }}
                        className="rounded-lg bg-primary-500 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-primary-600"
                      >
                        完成
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Focus Areas */}
      {mission && mission.focusAreas.length > 0 && (
        <div className="card mb-4">
          <h2 className="mb-2 text-lg font-semibold">今日重点</h2>
          <div className="flex flex-wrap gap-2">
            {mission.focusAreas.map((area, index) => (
              <span
                key={index}
                className="rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-800"
              >
                {area === "listening"
                  ? "听力"
                  : area === "speaking"
                  ? "口语"
                  : area === "vocabulary"
                  ? "词汇"
                  : area === "grammar"
                  ? "语法"
                  : area === "pronunciation"
                  ? "发音"
                  : area}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Day Control */}
      <div className="card mb-4">
        <h2 className="mb-3 text-lg font-semibold">📅 日程控制</h2>
        <div className="space-y-2">
          {/* Reset today */}
          <button
            onClick={() => {
              if (!confirm("确定要重置今日所有进度吗？已完成的任务将全部取消。")) return;
              const today = new Date().toISOString().split("T")[0];
              saveToStorage(`${STORAGE_KEYS.COMPLETED_ACTIVITIES}_${today}`, []);
              setCompletedActivities([]);
            }}
            className="w-full rounded-lg bg-red-50 px-4 py-3 text-left text-red-700 transition-colors hover:bg-red-100"
          >
            <div className="font-medium">🔄 重置今日进度</div>
            <div className="text-xs text-red-500">清除今天所有已完成的任务，从头开始</div>
          </button>

          {/* Replay a specific day */}
          <div className="rounded-lg bg-gray-50 p-3">
            <div className="text-sm font-medium text-gray-700 mb-2">重学某一天</div>
            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                max="360"
                value={replayDay}
                onChange={(e) => setReplayDay(parseInt(e.target.value) || 1)}
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
                placeholder="输入天数"
              />
              <button
                onClick={() => {
                  // Clear that day's completed activities
                  const dayDate = new Date();
                  dayDate.setDate(dayDate.getDate() - (profile.currentDay - replayDay));
                  const dayStr = dayDate.toISOString().split("T")[0];
                  saveToStorage(`${STORAGE_KEYS.COMPLETED_ACTIVITIES}_${dayStr}`, []);
                  // Also update current day
                  const updatedProfile = { ...profile, currentDay: replayDay };
                  setProfile(updatedProfile);
                  saveToStorage(STORAGE_KEYS.USER_PROFILE, updatedProfile);
                  // Reload mission for that day
                  window.location.reload();
                }}
                className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600"
              >
                重学
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-2 mb-4">
        <button
          onClick={() => navigate("/path")}
          className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-left text-white transition-colors hover:bg-indigo-700"
        >
          <div className="font-medium">🗺️ 我的英语之路（A1→C2通关）</div>
          <div className="text-xs text-indigo-100">查看学习地图 · 做测试解锁下一级</div>
        </button>
        <button
          onClick={() => {
            const first = mission?.activities.find(a => !completedActivities.includes(a.id));
            if (first) handleActivityClick(first);
          }}
          className="w-full rounded-lg bg-primary-500 px-4 py-3 text-left text-white transition-colors hover:bg-primary-600"
        >
          <div className="font-medium">开始今日学习</div>
          <div className="text-xs text-primary-100">
            {totalCount - completedCount} 个任务待完成
          </div>
        </button>
        <button
          onClick={() => navigate("/level-test")}
          className="w-full rounded-lg bg-amber-50 px-4 py-3 text-left text-amber-700 transition-colors hover:bg-amber-100"
        >
          <div className="font-medium">🎯 水平测试</div>
          <div className="text-xs text-amber-600">快速了解你的英语水平</div>
        </button>
        <button
          onClick={() => navigate("/resources/external")}
          className="w-full rounded-lg bg-green-50 px-4 py-3 text-left text-green-700 transition-colors hover:bg-green-100"
        >
          <div className="font-medium">📚 学习资源</div>
          <div className="text-xs text-green-600">按等级分级的外部学习资源</div>
        </button>
        <button
          onClick={() => navigate("/quiz")}
          className="w-full rounded-lg bg-purple-50 px-4 py-3 text-left text-purple-700 transition-colors hover:bg-purple-100"
        >
          <div className="font-medium">🎯 随机知识问答</div>
          <div className="text-xs text-purple-600">词汇+语法+音标混合测试</div>
        </button>
        <button
          onClick={() => navigate("/review")}
          className="w-full rounded-lg bg-gray-100 px-4 py-3 text-left text-gray-700 transition-colors hover:bg-gray-200"
        >
          <div className="font-medium">🔄 复习单词</div>
          <div className="text-xs text-gray-500">SRS智能复习</div>
        </button>
        <button
          onClick={() => navigate("/resources")}
          className="w-full rounded-lg bg-gray-100 px-4 py-3 text-left text-gray-700 transition-colors hover:bg-gray-200"
        >
          <div className="font-medium">📖 词典与语法</div>
          <div className="text-xs text-gray-500">搜索20,000+词汇和544+语法规则</div>
        </button>
        <button
          onClick={() => navigate("/ai-settings")}
          className="w-full rounded-lg bg-gray-100 px-4 py-3 text-left text-gray-700 transition-colors hover:bg-gray-200"
        >
          <div className="font-medium">🤖 AI 设置</div>
          <div className="text-xs text-gray-500">配置AI模型让问答和对话更智能</div>
        </button>
      </div>

      {/* Difficulty & Audio Speed */}
      {mission && (
        <div className="card mb-4">
          <div className="flex items-center justify-between text-sm">
            <div>
              <span className="text-gray-500">难度：</span>
              <span className="font-medium">
                {mission.difficulty === "easy"
                  ? "简单"
                  : mission.difficulty === "normal"
                  ? "适中"
                  : "挑战"}
              </span>
            </div>
            <div>
              <span className="text-gray-500">音频速度：</span>
              <span className="font-medium">
                {mission.audioSpeed === "slow"
                  ? "慢速"
                  : mission.audioSpeed === "normal"
                  ? "正常"
                  : "快速"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Onboarding Link (if new user) */}
      {profile.currentDay === 1 && profile.wordsLearned === 0 && (
        <div className="card mb-4 bg-yellow-50">
          <div className="flex items-center gap-3">
            <div className="text-2xl">👋</div>
            <div className="flex-1">
              <div className="font-medium">新用户？</div>
              <div className="text-xs text-gray-500">
                完成个性化设置，获得更好的学习体验
              </div>
            </div>
            <button
              onClick={() => navigate("/onboarding")}
              className="rounded-lg bg-yellow-500 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-yellow-600"
            >
              设置
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <p className="text-center text-xs text-gray-400">
        Phase 10 · AI英语教练
      </p>
    </div>
  );
}
