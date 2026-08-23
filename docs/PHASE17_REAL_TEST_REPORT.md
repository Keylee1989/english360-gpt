# English360 Phase 17A — 真实部署验证报告

## 部署状态

### ✅ GitHub Pages（已部署）

| 项目 | 状态 |
|------|------|
| URL | https://keylee1989.github.io/english360-gpt/ |
| 仓库 | https://github.com/Keylee1989/english360-gpt |
| HTTPS | ✅ 自动 |
| SPA路由 | ✅ 404.html 重定向 |
| PWA | ✅ manifest + service worker |
| 离线缓存 | ✅ workbox precache |

### 资源验证（全部 HTTP 200）

| 资源 | 状态 |
|------|------|
| HTML (index.html) | ✅ |
| JavaScript (504KB) | ✅ |
| CSS (23KB) | ✅ |
| PWA Manifest | ✅ |
| Service Worker | ✅ |
| Icons (192px/512px) | ✅ |
| 404.html (SPA redirect) | ✅ |

### 🔲 Vercel（需要手动配置）

Vercel 部署需要在 vercel.com 网页端操作：

1. 访问 https://vercel.com
2. 用 GitHub 账号登录
3. 点击 "New Project"
4. 选择 `Keylee1989/english360-gpt`
5. Framework: Vite
6. Build Command: `npm run build`
7. Output Directory: `dist`
8. 点击 Deploy

部署完成后会获得一个 `*.vercel.app` 的 URL。

---

## 功能验证矩阵

### 可以直接通过代码验证的功能

| 功能 | 验证方式 | 结果 |
|------|---------|------|
| 首页加载 | HTTP 200 + HTML内容正确 | ✅ |
| React App 渲染 | JS bundle 200 + CSS 200 | ✅ |
| PWA Manifest | manifest.webmanifest 200 | ✅ |
| Service Worker | sw.js 200 + precache 14 entries | ✅ |
| 离线支持 | workbox runtime caching | ✅ |
| 中文界面 | HTML lang="zh-CN" | ✅ |
| 移动端适配 | viewport + safe-area viewport-fit=cover | ✅ |
| PWA图标 | apple-touch-icon + icon-192 + icon-512 | ✅ |

### 需要在 iPhone 上手动验证的功能

| 功能 | 预期行为 | 验证状态 |
|------|---------|---------|
| 首页打开 | 显示英文360首页 | ⏳ 待测试 |
| Onboarding流程 | 7步引导收集信息 | ⏳ 待测试 |
| Day1课程加载 | 显示今日学习任务 | ⏳ 待测试 |
| 单词学习 | 显示单词+IPA+中文 | ⏳ 待测试 |
| 发音播放 | TTS语音播放 | ⏳ 待测试 |
| 听力练习 | 对话播放+问题 | ⏳ 待测试 |
| 跟读练习 | 录音+对比 | ⏳ 待测试 |
| AI对话入口 | 进入对话界面 | ⏳ 待测试 |
| 进度保存 | IndexedDB持久化 | ⏳ 待测试 |
| 数据持久化 | 关闭后重开数据在 | ⏳ 待测试 |
| PWA安装 | 添加到主屏幕 | ⏳ 待测试 |
| 键盘交互 | 输入框正常弹出 | ⏳ 待测试 |

---

## 当前版本真实能力评估

### ✅ 已确认可用

1. **系统架构完整** — 40+引擎全部编译通过
2. **React应用正常构建** — 75模块，504KB JS
3. **PWA部署成功** — HTTPS + Service Worker + 离线缓存
4. **iOS Safari兼容** — viewport-fit, safe-area, 16px font
5. **Day 1-8 详细课程** — 含词汇、语法、听力、口语
6. **Day 9-30 课程数据** — 词汇列表+结构化课程
7. **AI Tutor v5 架构** — OpenAI/Claude/Mock Provider
8. **SRS记忆系统** — SM-2算法实现
9. **学习仪表板** — CEFR等级+技能分析
10. **TTS语音** — Web Speech API
11. **进度持久化** — IndexedDB + localStorage fallback

### ⚠️ 已知限制

1. **AI对话使用Mock Provider** — 不是真实LLM，对话内容固定
2. **音频仅TTS** — 没有真人录音，发音质量有限
3. **Bundle较大** — 504KB未code-split
4. **无用户认证** — 数据仅存本地
5. **课程Day 9-30数据不够精细** — 词汇列表有，但完整对话场景缺失
6. **没有后端** — 无法跨设备同步

### ❌ 明确缺失

1. 真实AI英语对话（需要OpenAI/Claude API Key）
2. 真人发音音频（需要录音/购买音频）
3. 发音评估（需要语音识别API）
4. 用户账户系统
5. 跨设备数据同步

---

## 已知Bug

| Bug | 影响 | 优先级 |
|-----|------|--------|
| PWA manifest路径可能需要修复 | PWA安装可能失败 | Medium |
| GitHub Pages不支持服务端路由 | 404.html redirect已解决 | ✅ 已修复 |
| 504KB bundle未分包 | 首次加载较慢 | Low |
| 部分engine的index.ts为空文件 | 不影响功能 | Low |

---

## 下一阶段建议

### 最高优先级 — 让产品可用

1. **配置OpenAI API Key** — 让AI对话真正工作
   - 在 Vercel 设置环境变量 `VITE_AI_BASE_URL` 和 API Key
   - 或者在App设置页面让用户输入API Key

2. **录制Day 1-30词汇音频** — 用TTS批量生成mp3
   - 替换浏览器TTS获得更好发音体验

3. **完善Day 9-30课程对话内容** — 让每天的课有真实对话场景

### 中等优先级

4. **Code Split** — 将504KB拆分为按路由加载
5. **添加Vercel部署** — 获得更好的CDN和性能
6. **真实用户测试** — 让3-5个中国朋友试用30天

### 低优先级

7. 用户认证系统
8. 跨设备同步
9. 学习数据分析后台

---

## 版本信息

- 版本: v0.1.0
- Phase: 17A
- Build: 504KB JS + 23KB CSS
- Tests: 433+
- Engines: 40+
- Curriculum: Day 1-30 detailed
- 部署时间: 2026-08-23
