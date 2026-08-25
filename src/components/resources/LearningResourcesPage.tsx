/**
 * Learning Resources Page — External Resources by CEFR Level
 * 
 * Curated links to real English learning materials:
 * - YouTube channels
 * - Podcasts
 * - Reading materials
 * - Listening exercises
 * - Speaking practice
 */

import { useState } from "react";

type Level = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

interface Resource {
  title: string;
  titleChinese: string;
  url: string;
  type: "youtube" | "podcast" | "reading" | "listening" | "app" | "exercise";
  description: string;
  descriptionChinese: string;
}

const RESOURCES: Record<Level, Resource[]> = {
  A1: [
    // YouTube
    { title: "English Singsing - Kids English", titleChinese: "儿童英语动画（简单对话）", url: "https://www.youtube.com/@EnglishSingsing", type: "youtube", description: "Animated stories for absolute beginners", descriptionChinese: "动画故事，适合零基础，有中文字幕" },
    { title: "Learn English with EnglishClass101", titleChinese: "英语教室101 - 零基础课程", url: "https://www.youtube.com/@EnglishClass101", type: "youtube", description: "Structured lessons from ABC to basic conversation", descriptionChinese: "从字母到基础对话的系统课程" },
    { title: "BBC Learning English - Beginners", titleChinese: "BBC英语教学 - 入门", url: "https://www.youtube.com/@bbclearningenglish", type: "youtube", description: "BBC's official English learning channel", descriptionChinese: "BBC官方英语教学频道" },
    // Podcast
    { title: "6 Minute English (BBC)", titleChinese: "6分钟英语（BBC）", url: "https://www.bbc.co.uk/learningenglish/english/features/6-minute-english", type: "podcast", description: "Short episodes on everyday topics", descriptionChinese: "日常话题的短节目，适合初学者" },
    { title: "Voice of America - Learning English", titleChinese: "美国之音学英语", url: "https://learningenglish.voanews.com/", type: "podcast", description: "Slow-speed news in simple English", descriptionChinese: "慢速新闻，简单英语" },
    // Reading
    { title: "Graded Readers (Oxford)", titleChinese: "牛津分级读物", url: "https://www.oxfordlearnersbookshelf.com/", type: "reading", description: "Books graded by CEFR level", descriptionChinese: "按CEFR等级分级的英语读物" },
    { title: "News in Levels", titleChinese: "分级新闻", url: "https://www.news-in-levels.com/", type: "reading", description: "Same news story at 3 difficulty levels", descriptionChinese: "同一条新闻三个难度等级" },
    // App
    { title: "Duolingo", titleChinese: "多邻国", url: "https://www.duolingo.com/", type: "app", description: "Gamified language learning basics", descriptionChinese: "游戏化语言学习基础" },
    { title: "ABCmouse English", titleChinese: "ABCmouse英语", url: "https://www.abcmouse.com/", type: "app", description: "Interactive lessons for beginners", descriptionChinese: "互动课程，适合初学者" },
    // Exercise
    { title: "British Council - A1 Grammar", titleChinese: "英国文化协会 - A1语法练习", url: "https://learnenglish.britishcouncil.org/grammar/a1-level-grammar", type: "exercise", description: "Free grammar exercises from British Council", descriptionChinese: "英国文化协会免费语法练习" },
  ],
  A2: [
    { title: "EngVid - Basic English Lessons", titleChinese: "EngVid基础英语课", url: "https://www.engvid.com/english-level-2-beginner/", type: "youtube", description: "Teacher-led lessons on basic grammar", descriptionChinese: "老师讲解基础语法" },
    { title: "Rachel's English - Pronunciation", titleChinese: "Rachel的英语发音", url: "https://www.youtube.com/@rachelsenglish", type: "youtube", description: "American English pronunciation for beginners", descriptionChinese: "美式英语发音教学" },
    { title: "All Ears English", titleChinese: "全耳朵英语", url: "https://www.allearsenglish.com/", type: "podcast", description: "Conversational English for daily life", descriptionChinese: "日常生活对话英语" },
    { title: "Simple English Wikipedia", titleChinese: "简单英语维基百科", url: "https://simple.wikipedia.org/", type: "reading", description: "Wikipedia articles in simple English", descriptionChinese: "简单英语版维基百科" },
    { title: "British Council - A2 Grammar", titleChinese: "英国文化协会 - A2语法练习", url: "https://learnenglish.britishcouncil.org/grammar/a2-level-grammar", type: "exercise", description: "Free grammar exercises", descriptionChinese: "免费语法练习" },
    { title: "Elllo - Listening Lessons", titleChinese: "Elllo听力课", url: "https://www.elllo.org/", type: "listening", description: "3000+ free English listening lessons", descriptionChinese: "3000+免费英语听力课" },
  ],
  B1: [
    { title: "TED-Ed - Educational Videos", titleChinese: "TED-Ed教育视频", url: "https://www.youtube.com/@teaborghetti", type: "youtube", description: "Animated educational content", descriptionChinese: "动画教育内容" },
    { title: "English with Lucy", titleChinese: "跟Lucy学英语", url: "https://www.youtube.com/@englishwithlucy", type: "youtube", description: "British English vocabulary and grammar", descriptionChinese: "英式英语词汇和语法" },
    { title: "Luke's English Podcast", titleChinese: "Luke的英语播客", url: "https://lukeenglishpodcast.com/", type: "podcast", description: "Comedy and culture in English", descriptionChinese: "英语喜剧和文化" },
    { title: "The Guardian - Simplified", titleChinese: "卫报简化版", url: "https://www.theguardian.com/", type: "reading", description: "News articles for intermediate readers", descriptionChinese: "中级阅读新闻" },
    { title: "British Council - B1 Grammar", titleChinese: "英国文化协会 - B1语法", url: "https://learnenglish.britishcouncil.org/grammar/b1-level-grammar", type: "exercise", description: "Intermediate grammar exercises", descriptionChinese: "中级语法练习" },
    { title: "BBC Learning English - Intermediate", titleChinese: "BBC中级英语", url: "https://www.bbc.co.uk/learningenglish", type: "listening", description: "Intermediate listening and vocabulary", descriptionChinese: "中级听力和词汇" },
  ],
  B2: [
    { title: "TED Talks", titleChinese: "TED演讲", url: "https://www.ted.com/", type: "youtube", description: "Expert talks on various topics", descriptionChinese: "各领域专家演讲" },
    { title: "English with Greg", titleChinese: "跟Greg学英语", url: "https://www.youtube.com/@englishwithgreg", type: "youtube", description: "Advanced vocabulary and expressions", descriptionChinese: "高级词汇和表达" },
    { title: "This American Life", titleChinese: "美国生活", url: "https://www.thisamericanlife.org/", type: "podcast", description: "Storytelling journalism", descriptionChinese: "叙事新闻" },
    { title: "The New York Times", titleChinese: "纽约时报", url: "https://www.nytimes.com/", type: "reading", description: "Quality journalism for advanced readers", descriptionChinese: "高质量新闻阅读" },
    { title: "British Council - B2 Grammar", titleChinese: "英国文化协会 - B2语法", url: "https://learnenglish.britishcouncil.org/grammar/b2-level-grammar", type: "exercise", description: "Upper-intermediate grammar", descriptionChinese: "中高级语法练习" },
    { title: "Forvo - Pronunciation Dictionary", titleChinese: "Forvo发音词典", url: "https://forvo.com/", type: "listening", description: "Word pronunciation by native speakers", descriptionChinese: "母语者单词发音" },
  ],
  C1: [
    { title: "NPR Podcasts", titleChinese: "NPR播客", url: "https://www.npr.org/podcasts", type: "podcast", description: "National Public Radio stories", descriptionChinese: "美国国家公共广播" },
    { title: "The Economist", titleChinese: "经济学人", url: "https://www.economist.com/", type: "reading", description: "Advanced English analysis", descriptionChinese: "高级英语分析" },
    { title: "FluentU", titleChinese: "FluentU", url: "https://www.fluentu.com/", type: "app", description: "Real-world video content with subtitles", descriptionChinese: "真实视频内容配字幕" },
    { title: "British Council - C1 Grammar", titleChinese: "英国文化协会 - C1语法", url: "https://learnenglish.britishcouncil.org/grammar/c1-level-grammar", type: "exercise", description: "Advanced grammar", descriptionChinese: "高级语法练习" },
  ],
  C2: [
    { title: "The Atlantic", titleChinese: "大西洋月刊", url: "https://www.theatlantic.com/", type: "reading", description: "In-depth journalism and analysis", descriptionChinese: "深度新闻分析" },
    { title: "Academic English Now", titleChinese: "学术英语", url: "https://www.youtube.com/@academicenglishnow", type: "youtube", description: "Academic writing and speaking", descriptionChinese: "学术写作和口语" },
    { title: "Cambridge C2 Proficiency", titleChinese: "剑桥C2精通考试", url: "https://www.cambridgeenglish.org/exams-and-tests/proficiency/", type: "exercise", description: "Official C2 exam preparation", descriptionChinese: "官方C2考试备考" },
  ],
};

const TYPE_ICONS: Record<string, string> = {
  youtube: "🎬",
  podcast: "🎧",
  reading: "📖",
  listening: "👂",
  app: "📱",
  exercise: "✏️",
};

const LEVEL_INFO: Record<Level, { label: string; color: string; desc: string; timeline: string; goals: string[] }> = {
  A1: { label: "A1 入门", color: "#22c55e", desc: "零基础入门", timeline: "1-3个月", goals: ["认识200个核心词", "打招呼和自我介绍", "理解简单指令", "读懂简单标识"] },
  A2: { label: "A2 基础", color: "#84cc16", desc: "日常生活", timeline: "3-6个月", goals: ["掌握1000词", "日常购物和点餐", "简单问路和交通", "写简单邮件"] },
  B1: { label: "B1 中级", color: "#eab308", desc: "独立交流", timeline: "6-12个月", goals: ["掌握2500词", "表达观点和感受", "工作场景沟通", "理解简单新闻"] },
  B2: { label: "B2 中高级", color: "#f97316", desc: "流利表达", timeline: "12-18个月", goals: ["掌握5000词", "参与讨论和辩论", "理解原版视频", "商务邮件写作"] },
  C1: { label: "C1 高级", color: "#ef4444", desc: "灵活运用", timeline: "18-24个月", goals: ["掌握10000词", "理解抽象话题", "流利即兴演讲", "学术写作"] },
  C2: { label: "C2 精通", color: "#9333ea", desc: "接近母语", timeline: "24-36个月", goals: ["掌握20000词", "理解幽默双关", "专业领域交流", "文化深度理解"] },
};

export default function LearningResourcesPage() {
  const [selectedLevel, setSelectedLevel] = useState<Level>("A1");
  const [selectedType, setSelectedType] = useState<string>("all");

  const levelResources = RESOURCES[selectedLevel] || [];
  const filtered = selectedType === "all"
    ? levelResources
    : levelResources.filter((r) => r.type === selectedType);

  const info = LEVEL_INFO[selectedLevel];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3">
        <h1 className="text-xl font-bold">🎯 学习资源</h1>
        <p className="text-sm text-gray-500 mt-1">按CEFR等级分级的外部学习资源</p>
      </div>

      {/* Level Selector */}
      <div className="flex gap-2 overflow-x-auto p-4 pb-2">
        {(Object.keys(LEVEL_INFO) as Level[]).map((lev) => (
          <button
            key={lev}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedLevel === lev
                ? "text-white shadow-lg scale-105"
                : "bg-gray-100 text-gray-600"
            }`}
            style={selectedLevel === lev ? { backgroundColor: info.color } : {}}
            onClick={() => setSelectedLevel(lev)}
          >
            {LEVEL_INFO[lev].label}
          </button>
        ))}
      </div>

      {/* Level Info Card */}
      <div className="mx-4 mb-4 rounded-xl p-4 text-white" style={{ backgroundColor: info.color }}>
        <h2 className="text-lg font-bold">{info.desc}</h2>
        <p className="text-sm opacity-90 mt-1">预计时间：{info.timeline}</p>
        <div className="mt-3 space-y-1">
          {info.goals.map((goal, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <span>✓</span>
              <span>{goal}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Type Filter */}
      <div className="flex gap-2 overflow-x-auto px-4 pb-3">
        {["all", "youtube", "podcast", "reading", "listening", "app", "exercise"].map((type) => (
          <button
            key={type}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition ${
              selectedType === type
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
            onClick={() => setSelectedType(type)}
          >
            {type === "all" ? "全部" : `${TYPE_ICONS[type] || ""} ${
              type === "youtube" ? "视频" :
              type === "podcast" ? "播客" :
              type === "reading" ? "阅读" :
              type === "listening" ? "听力" :
              type === "app" ? "应用" : "练习"
            }`}
          </button>
        ))}
      </div>

      {/* Resources List */}
      <div className="px-4 space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            该级别暂无此类型资源
          </div>
        ) : (
          filtered.map((resource, i) => (
            <a
              key={i}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl border border-gray-200 bg-white p-4 transition hover:shadow-md"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{TYPE_ICONS[resource.type]}</span>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{resource.titleChinese}</div>
                  <div className="text-sm text-gray-500">{resource.title}</div>
                  <div className="text-sm text-gray-600 mt-1">{resource.descriptionChinese}</div>
                </div>
                <span className="text-gray-300 text-lg">→</span>
              </div>
            </a>
          ))
        )}
      </div>

      {/* Tips */}
      <div className="mx-4 mt-6 rounded-xl bg-blue-50 p-4">
        <h3 className="font-bold text-blue-800 mb-2">💡 学习建议</h3>
        <div className="text-sm text-blue-700 space-y-1">
          <p>• 每天至少30分钟听力输入（听播客/看视频）</p>
          <p>• 跟读练习：听到一句暂停，模仿发音</p>
          <p>• 遇到生词先猜意思，再查词典</p>
          <p>• 不要只看不练，开口说最重要</p>
          <p>• 同一材料反复听3遍以上效果更好</p>
        </div>
      </div>
    </div>
  );
}
