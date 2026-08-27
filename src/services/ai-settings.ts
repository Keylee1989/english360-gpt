/**
 * AI Settings Service
 *
 * Stores user's AI configuration in localStorage:
 * - Provider type (openai / custom)
 * - API Key
 * - Base URL (supports OpenAI, Claude, DeepSeek, local models, etc.)
 * - Selected model
 * - Auto-fetched model list
 *
 * If no config → defaults to local mock mode.
 */

const STORAGE_KEY = "english360_ai_settings";

export type AIProviderType = "openai" | "custom" | "local";

export interface AISettings {
  enabled: boolean;           // false = local mock mode
  provider: AIProviderType;
  apiKey: string;
  baseUrl: string;            // e.g. "https://api.openai.com/v1"
  model: string;              // selected model id
  availableModels: ModelInfo[];
  temperature: number;
  maxTokens: number;
}

export interface ModelInfo {
  id: string;
  name: string;
}

const DEFAULT_SETTINGS: AISettings = {
  enabled: false,
  provider: "local",
  apiKey: "",
  baseUrl: "https://api.openai.com/v1",
  model: "",
  availableModels: [],
  temperature: 0.7,
  maxTokens: 1024,
};

// ============================================================
// Load / Save
// ============================================================

export function loadAISettings(): AISettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveAISettings(settings: AISettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error("Failed to save AI settings:", e);
  }
}

export function isAIConfigured(): boolean {
  const s = loadAISettings();
  return s.enabled && !!s.apiKey && !!s.model;
}

// ============================================================
// Fetch Models from any OpenAI-compatible API
// ============================================================

export async function fetchModels(
  baseUrl: string,
  apiKey: string
): Promise<ModelInfo[]> {
  try {
    const url = `${baseUrl.replace(/\/+$/, "")}/models`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      // Some APIs return 405 for GET /models — try POST
      return await fetchModelsPost(baseUrl, apiKey);
    }

    const data = await response.json();
    const models: ModelInfo[] = [];

    // OpenAI format: { data: [{ id, ... }] }
    if (Array.isArray(data.data)) {
      for (const m of data.data) {
        if (m.id) {
          models.push({ id: m.id, name: m.id });
        }
      }
    }
    // Some APIs return plain array
    else if (Array.isArray(data)) {
      for (const m of data) {
        const id = m.id || m.name || m;
        models.push({ id: String(id), name: String(id) });
      }
    }

    // Sort: chat models first, then alphabetical
    models.sort((a, b) => {
      const aChat = a.id.includes("gpt") || a.id.includes("claude") || a.id.includes("chat");
      const bChat = b.id.includes("gpt") || b.id.includes("claude") || b.id.includes("chat");
      if (aChat !== bChat) return aChat ? -1 : 1;
      return a.id.localeCompare(b.id);
    });

    return models;
  } catch (error) {
    console.error("Fetch models failed:", error);
    return [];
  }
}

async function fetchModelsPost(
  baseUrl: string,
  apiKey: string
): Promise<ModelInfo[]> {
  try {
    const url = `${baseUrl.replace(/\/+$/, "")}/models`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) return [];

    const data = await response.json();
    const models: ModelInfo[] = [];

    if (Array.isArray(data.data)) {
      for (const m of data.data) {
        if (m.id) models.push({ id: m.id, name: m.id });
      }
    } else if (Array.isArray(data)) {
      for (const m of data) {
        const id = m.id || m.name || m;
        models.push({ id: String(id), name: String(id) });
      }
    }

    return models;
  } catch {
    return [];
  }
}

// ============================================================
// Chat Completion (OpenAI-compatible)
// ============================================================

export async function chatWithAI(
  messages: { role: string; content: string }[],
  settings?: AISettings
): Promise<string> {
  const s = settings || loadAISettings();

  // If not configured, use local mock
  if (!s.enabled || !s.apiKey || !s.model) {
    return localMockChat(messages);
  }

  try {
    const url = `${s.baseUrl.replace(/\/+$/, "")}/chat/completions`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${s.apiKey}`,
      },
      body: JSON.stringify({
        model: s.model,
        messages,
        max_tokens: s.maxTokens,
        temperature: s.temperature,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || `API error ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "";
  } catch (error) {
    console.error("AI chat error, falling back to local:", error);
    return localMockChat(messages);
  }
}

// ============================================================
// Local Mock Chat (rule-based, no API needed)
// ============================================================

function localMockChat(messages: { role: string; content: string }[]): string {
  const lastMsg = messages[messages.length - 1]?.content || "";
  const lower = lastMsg.toLowerCase().trim();

  // Count how many user messages (to gauge conversation depth)
  const userMsgCount = messages.filter(m => m.role === "user").length;

  // ---- Pattern matching for common beginner inputs ----

  // Greetings
  if (/^(hello|hi|hey|good\s*(morning|afternoon|evening)|嗨|你好)/.test(lower)) {
    if (userMsgCount <= 1) {
      return `Hello! 👋 Welcome to English practice!\n\nI'm your English teacher. Let's start simple:\n\n🗣️ Try saying: "My name is [your name]."\n📖 中文: 我的名字是...\n\nWhat's your name? (你叫什么名字？)`;
    }
    return `Hey there! 👋 Great to see you again!\n\nLet's keep going. What would you like to talk about?\n💡 You can say: "I want to talk about [topic]."`;
  }

  // Self introduction
  if (lower.includes("my name") || lower.includes("i am") || lower.includes("i'm") || lower.includes("我是")) {
    const isGoodIntro = /i('m| am) \w+/.test(lower) && (lower.includes("name") || lower.includes("from") || lower.includes("student") || lower.includes("teacher"));
    if (isGoodIntro || lower.includes("name")) {
      return `Great introduction! 👏\n\nLet me help you expand it:\n\n✅ Good: "My name is Tom. I am a student."\n✅ Better: "My name is Tom. I am from China. I am learning English."\n\n📖 中文: 很好的自我介绍！让我帮你扩展：\n- "I am from China." 我来自中国\n- "I am a student/teacher/worker." 我是学生/老师/工人\n- "I like English." 我喜欢英语\n\n💡 Practice: Try saying where you are from!\n"I am from [city/country]."`;
    }
    return `Good start! 👏\n\nHere's a simple self-introduction template:\n\n"My name is ___. I am from ___. I am a ___."\n\n📖 中文翻译:\n我的名字是___。我来自___。我是___。\n\nTry filling in the blanks with your info!\nExample: "My name is Li Ming. I am from Beijing. I am a student."`;
  }

  // Past tense patterns
  if (lower.includes("yesterday") || lower.includes("last week") || lower.includes("ago") || lower.includes("went") || lower.includes("昨天")) {
    if (/\b(go|eat|see|come|have|take|play|watch|buy|meet|think)\b/.test(lower) && !lower.includes("went") && !lower.includes("ate") && !lower.includes("saw")) {
      return `📝 Grammar Lesson: Past Tense 过去式\n\nYou wrote some verbs in present tense with "yesterday." Let's fix:\n\n❌ I go yesterday → ✅ I went yesterday\n❌ I eat lunch → ✅ I ate lunch\n❌ I see a movie → ✅ I saw a movie\n\n📖 中文: 昨天/上周/以前发生的事用过去式\n\nCommon irregular verbs 不规则动词:\ngo → went (去)\neat → ate (吃)\nsee → saw (看)\ncome → came (来)\nhave → had (有)\n\n💡 Practice: Change these to past tense:\n1. I __ (go) to school yesterday.\n2. She __ (eat) breakfast this morning.\n3. We __ (watch) TV last night.`;
    }
    return `📝 Past tense practice!\n\n\"Yesterday\" signals past tense. Good job using it!\n\nSome common past tense sentences:\n- "I went to the store yesterday." (我昨天去了商店)\n- "I ate dinner at 7pm." (我7点吃了晚饭)\n- "I watched a movie last night." (我昨晚看了一部电影)\n\n💡 Try making your own past tense sentence!`;
  }

  // Very like → really like
  if (lower.includes("very like") || lower.includes("very love")) {
    return `📝 Good try! Here's the correction:\n\n❌ "very like" → ✅ "really like"\n❌ "very love" → ✅ "really love"\n\n📖 中文解释:\n- really + 动词 (really like, really want)\n- very + 形容词 (very good, very big)\n\nExamples:\n- I really like English. 我真的很喜欢英语\n- It's very interesting. 它非常有趣\n\n💡 Practice: Rewrite with "really":\n"I very like music." → ?`;
  }

  // Food & drink
  if (/\b(eat|drink|food|hungry|thirsty|apple|banana|rice|water|coffee|tea|milk|bread|apple|breakfast|lunch|dinner|meal|snack|fruit|vegetable|chicken|fish|meat|noodle|pizza|hamburger)\b/.test(lower)) {
    return `Great topic — food! 🍽️\n\nUseful sentence patterns:\n\n🍎 "I want to eat an apple." 我想吃一个苹果\n🍚 "I like rice." 我喜欢米饭\n🥤 "Can I have some water?" 能给我一些水吗？\n👨‍🍳 "What do you want for dinner?" 你晚饭想吃什么？\n\n📖 Key grammar:\n- "want to + verb" = 想要做某事\n- "Can I have...?" = 我能要...吗？（礼貌用法）\n\n💡 Try: "I want to eat [food]." or "I like [food]."`;
  }

  // Numbers
  if (/\b(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\b/.test(lower) && lower.length < 30) {
    return `Numbers! 🔢 Let's practice:\n\n1 one /wʌn/ 一\n2 two /tuː/ 二\n3 three /θriː/ 三\n4 four /fɔːr/ 四\n5 five /faɪv/ 五\n\n📖 Useful phrases:\n- "I have three books." 我有三本书\n- "There are five apples." 有五个苹果\n- "My phone number is..." 我的电话号码是...\n\n💡 Try: "I have [number] [things]."`;
  }

  // Family
  if (/\b(mother|father|mom|dad|brother|sister|family|son|daughter|wife|husband|grandma|grandpa|uncle|aunt|cousin|父母|妈妈|爸爸|兄弟|姐妹|家人)/.test(lower)) {
    return `Family! 👨‍👩‍👧‍👦 Important topic!\n\nKey vocabulary:\n- mother/mom 妈妈\n- father/dad 爸爸\n- brother 兄弟\n- sister 姐妹\n- family 家庭\n\nUseful sentences:\n- "This is my family." 这是我的家人\n- "I have a brother and a sister." 我有一个兄弟和一个姐妹\n- "My mother is a teacher." 我妈妈是老师\n\n📖 Grammar: Possessive pronouns (所有格)\nmy/your/his/her/its/our/their\n\n💡 Try: "My [family member] is a [job]."`;
  }

  // Weather
  if (/\b(weather|rain|sunny|cold|hot|warm|cool|snow|wind|cloud|天气|下雨|晴|冷|热)/.test(lower)) {
    return `Weather! 🌤️\n\nKey words:\n- sunny 晴天 ☀️\n- rainy 下雨 🌧️\n- cold 冷 ❄️\n- hot 热 🔥\n\nPatterns:\n- "It is sunny today." 今天是晴天\n- "It's very hot in summer." 夏天很热\n- "I don't like rainy days." 我不喜欢雨天\n\n📖 Grammar: "It is + adjective" for weather\n\n💡 Try: "It is [weather] today."`;
  }

  // Questions (what/where/how/when/why/who)
  if (/^(what|where|how|when|why|who|which)/.test(lower)) {
    return `Great question! Asking questions is an important skill! ❓\n\nQuestion patterns:\n- What is this? 这是什么？\n- Where are you? 你在哪里？\n- How are you? 你好吗？\n- When is the meeting? 会议什么时候？\n- Why do you study English? 你为什么学英语？\n\n📖 Grammar: Question words + auxiliary verb + subject + verb\n\n💡 Let's practice: Try answering your own question in English!\n\nOr tell me: What do you want to learn about? (你想学什么？)`;
  }

  // Time expressions
  if (/\b(today|tomorrow|now|morning|afternoon|evening|night|week|month|year|time|clock|hour|minute|今天|明天|昨天|早上|下午|晚上)/.test(lower)) {
    return `Time expressions! 🕐\n\nKey words:\n- today 今天\n- tomorrow 明天\n- yesterday 昨天\n- morning 早上\n- afternoon 下午\n- evening 晚上\n\nUseful sentences:\n- "What time is it?" 现在几点？\n- "I wake up at 7am." 我早上7点起床\n- "See you tomorrow." 明天见\n- "Good morning!" 早上好！\n\n💡 Try: "I [activity] in the [time]."\nExample: "I study English in the morning."`;
  }

  // Colors
  if (/\b(red|blue|green|yellow|black|white|orange|purple|pink|brown|color|colour|颜色|红|蓝|绿|黄)/.test(lower)) {
    return `Colors! 🎨\n\n- red 红色 ❤️\n- blue 蓝色 💙\n- green 绿色 💚\n- yellow 黄色 💛\n- black 黑色 🖤\n- white 白色 🤍\n\nSentences:\n- "The sky is blue." 天空是蓝色的\n- "I like the red one." 我喜欢红色的那个\n- "What color is this?" 这是什么颜色？\n\n💡 Try: "My favorite color is [color]."`;
  }

  // Thank you / please
  if (/\b(thank|thanks|please|sorry|excuse|thank you|please|对不起|谢谢)/.test(lower)) {
    return `Polite expressions! Very important! 🤝\n\n- Thank you. / Thanks! 谢谢\n- You're welcome. 不客气\n- Please. 请\n- Sorry. / I'm sorry. 对不起\n- Excuse me. 打扰一下\n\n📖 In English, being polite makes a big difference:\n- "Can I have... please?" 请给我...\n- "Thank you very much." 非常感谢\n- "I'm sorry, I don't understand." 抱歉，我没听懂\n\n💡 Practice: "Thank you for [something]."`;
  }

  // Work / job
  if (/\b(work|job|office|boss|colleague|salary|meeting|project|computer|work|上班|工作|老板|同事|工资|会议|项目)/.test(lower)) {
    return `Work & office vocabulary! 💼\n\nKey words:\n- work 工作\n- job 工作\n- boss 老板\n- colleague 同事\n- meeting 会议\n\nUseful sentences:\n- "I go to work at 9am." 我早上9点上班\n- "My boss is very nice." 我老板人很好\n- "I have a meeting today." 我今天有个会议\n\n📖 Business phrases:\n- "Nice to meet you." 很高兴认识你\n- "Could you help me?" 你能帮我吗？\n- "I have a question." 我有一个问题\n\n💡 Try: "I [verb] at work."`;
  }

  // Travel
  if (/\b(travel|trip|airport|plane|train|hotel|ticket|passport|taxi|bus|subway|station|map|旅行|飞机|火车|酒店|机票|护照|地图)/.test(lower)) {
    return `Travel vocabulary! ✈️\n\nEssential phrases:\n- "Where is the airport?" 机场在哪里？\n- "I need a ticket to [place]." 我需要去[地方]的票\n- "How much is this?" 这个多少钱？\n- "Can you help me?" 你能帮我吗？\n- "I'd like to check in, please." 我想办理入住\n\n📖 Airport:\n- boarding gate 登机口\n- luggage / baggage 行李\n- flight 航班\n- take off 起飞\n- land 降落\n\n💡 Try: "I want to go to [place]."`;
  }

  // Shopping
  if (/\b(buy|shop|store|price|cheap|expensive|sale|size|color|how much|dollar|money|pay|买|商店|价格|便宜|贵|打折|尺码|钱)/.test(lower)) {
    return `Shopping! 🛒\n\nEssential phrases:\n- "How much is this?" 这个多少钱？\n- "It's too expensive." 太贵了\n- "Do you have a smaller size?" 有小一号的吗？\n- "I'll take this one." 我要这个\n- "Can I pay by card?" 可以刷卡吗？\n\n📖 Numbers for prices:\n- $5 = five dollars (五美元)\n- ¥50 = fifty yuan (五十元)\n\n💡 Try: "I want to buy [item]. How much?"`;
  }

  // Countries / languages
  if (/\b(china|chinese|english|america|american|britain|british|japan|japanese|korea|korean|france|french|germany|german|language|speak|country|中国|美国|英国|日本|法国|德国|语言|说)/.test(lower)) {
    return `Languages & countries! 🌍\n\nKey pairs:\n- China 🇨🇳 / Chinese 中文\n- America 🇺🇸 / English 英语\n- Japan 🇯🇵 / Japanese 日语\n- France 🇫🇷 / French 法语\n\nSentences:\n- "I am Chinese." 我是中国人\n- "I speak a little English." 我会说一点英语\n- "I am learning English." 我在学英语\n- "English is not easy, but I like it." 英语不容易，但我喜欢\n\n📖 Grammar: "I speak + language"\n\n💡 Try: "I can speak [language]."`;
  }

  // Likes / dislikes
  if (/\b(i like|i love|i enjoy|i hate|favorite|prefer|喜欢|爱好)/.test(lower)) {
    return `Expressing likes! 😊\n\nPatterns:\n- "I like + noun/verb-ing" 我喜欢...\n- "I love + noun/verb-ing" 我热爱...\n- "I don't like + noun/verb-ing" 我不喜欢...\n- "My favorite is..." 我最喜欢...\n\nExamples:\n- "I like reading books." 我喜欢看书\n- "I love learning English." 我爱学英语\n- "My favorite food is noodles." 我最喜欢的食物是面条\n\n📖 Grammar: like + 动名词(V-ing) 或名词\n\n💡 Try: "I like + [what you enjoy]."`;
  }

  // Can / ability
  if (/\bcan\s+(i|you|he|she|we|they)?\s*\w+|i can|cannot|会|不能/.test(lower)) {
    return `Great use of "can"! 💪\n\n"Can" expresses ability:\n- "I can swim." 我会游泳\n- "I can speak English." 我会说英语\n- "I can't drive." 我不会开车\n\nNegatives:\n- "I can't understand." 我听不懂\n- "I cannot remember." 我记不住\n\nQuestions:\n- "Can you help me?" 你能帮我吗？\n- "Can I sit here?" 我能坐这里吗？\n\n📖 Grammar: can + 动词原形 (没有to)\n\n💡 Try: "I can [skill]. I can't [skill]."`;
  }

  // Grammar correction patterns (Chinese learners)
  if (lower.includes("very good") && (lower.includes("i") || lower.includes("it"))) {
    return `📝 Let's check grammar:\n\nIf you mean "I am very good": ✅\nIf you mean "It is very good": ✅\n\nCommon mistake:\n❌ "It very good" → ✅ "It is very good"\n\n📖 中文: 形容词前需要 be 动词(am/is/are)\n\n💡 Practice: "[Subject] is very [adjective]."\n- The food is very delicious. 这食物很好吃\n- The teacher is very kind. 这老师很友善`;
  }

  // I don't understand
  if (lower.includes("don't understand") || lower.includes("不懂") || lower.includes("不明白") || lower.includes("什么意思")) {
    return `That's OK! 不懂没关系！😊\n\nHere are useful phrases for when you're confused:\n\n- "Can you say that again?" 你能再说一遍吗？\n- "What does [word] mean?" [单词]是什么意思？\n- "Can you speak slowly?" 你能说慢一点吗？\n- "I don't understand." 我不明白\n- "Please write it down." 请写下来\n\n📖 These phrases are VERY useful in real conversations!\n\n💡 Try: "What does '___' mean in Chinese?"`;
  }

  // Default teaching response (context-aware)
  if (userMsgCount <= 2) {
    return `That's a good attempt! 👏\n\nLet me help you practice. Here are some easy topics:\n\n1️⃣ "My name is ___." 自我介绍\n2️⃣ "I like ___." 喜好\n3️⃣ "I want to ___." 想做某事\n4️⃣ "It is ___." 描述天气/事物\n\n📖 Sentence structure: Subject + Verb + Object\nExample: "I study English every day." 我每天学英语\n\n💡 Pick a topic and try! 选一个话题试试！`;
  }

  // Later in conversation — encourage and guide
  return `Good practice! 👏\n\n💡 Tips for today:\n- Try using past tense: "I went / I ate / I saw..."\n- Try asking a question: "What is this?"\n- Try expressing opinion: "I think..."\n\n📖 Remember:\n- Subject + Verb + Object\n- "I am / You are / He is"\n- "I like + noun/verb-ing"\n\nKeep going! 你做得很好，继续练习！💪\nTry typing another sentence!`;
}
