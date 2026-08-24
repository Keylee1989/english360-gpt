# English360 Product Test Report

**日期：** 2026-08-24  
**测试员：** Codebuff Agent  
**版本：** Phase 14 (v0.1.0)

---

## 第一部分：代码级功能审计

### 1. 首页 (HomePage)

| 项目 | 状态 |
|------|------|
| 文件位置 | `src/components/home/HomePage.tsx` |
| 是否真实实现 | ✅ 是 |
| 是否Mock | ⚠️ 部分 — DailyCoachEngineV2 生成任务，但默认 Profile 数据是硬编码的 |
| Bug | ❌ 无严重Bug |
| 问题 | 使用 `localStorage` 而非 `IndexedDB`，数据持久性有限 |

### 2. Onboarding

| 项目 | 状态 |
|------|------|
| 文件位置 | `src/components/learning/OnboardingPage.tsx` |
| 是否真实实现 | ✅ 是 — 7步引导流程完整 |
| 是否Mock | ❌ 否 — 真实保存到 IndexedDB |
| Bug | ❌ 无 |
| 问题 | 完成后跳转首页，但首页不读取 Onboarding 保存的 profile 数据（首页仍用 DEFAULT_PROFILE） |

### 3. 今日学习 (DailyPlanPage)

| 项目 | 状态 |
|------|------|
| 文件位置 | `src/components/learning/DailyPlanPage.tsx` |
| 是否真实实现 | ⚠️ 部分 — 硬编码了3个活动，未连接 DailyCoachEngineV2 |
| 是否Mock | ⚠️ 硬编码 placeholder 数据 |
| Bug | ✅ 已修复 — "开始"按钮原无 onClick handler，已添加导航到 `/lesson/day_1` |
| 问题 | 与首页(HHomePage)显示不同的任务列表，存在数据不一致 |

### 4. 课程查看器 (LessonViewer)

| 项目 | 状态 |
|------|------|
| 文件位置 | `src/components/learning/LessonViewer.tsx` |
| 是否真实实现 | ✅ 是 — 完整的 activity-based 课程查看器 |
| 是否Mock | ❌ 否 — 真实加载 Day 1 课程数据 |
| Bug | ❌ 无严重Bug |
| 问题 | 仅 Day 1 有完整课程数据，Day 2+ 使用简化框架 |

### 5. 单词学习 (Vocabulary)

| 项目 | 状态 |
|------|------|
| 文件位置 | `src/components/learning/LessonViewer.tsx` (renderVocabulary) |
| 是否真实实现 | ✅ 是 — 翻卡式学习，显示 IPA、中文、例句、记忆法 |
| 是否Mock | ❌ 否 — 使用 300 个真实词汇数据 |
| Bug | ❌ 无 |
| 亮点 | 支持 TTS 发音播放、记忆提示、例句翻译 |

### 6. 发音 (Pronunciation)

| 项目 | 状态 |
|------|------|
| 文件位置 | `src/components/practice/PronunciationPractice.tsx` + `PronunciationPracticePage.tsx` |
| 是否真实实现 | ⚠️ 部分 — UI 完整，但录音按钮仅设置 `isRecording` 状态，未实际调用 Web Speech API |
| 是否Mock | ⚠️ 录音功能为 placeholder |
| Bug | ❌ 无（因为功能未实际执行） |

### 7. 听力 (Listening)

| 项目 | 状态 |
|------|------|
| 文件位置 | `src/components/learning/LessonViewer.tsx` (renderListening) + `src/engines/listening/index.ts` |
| 是否真实实现 | ✅ 是 — TTS 播放 + 理解问答 |
| 是否Mock | ⚠️ 音频为 TTS，非真人录音 |
| Bug | ✅ 已修复 — "错误选项1/2/3" 已替换为真实中文干扰项 |
| 问题 | 听力练习缺少 transcript 显示和速度切换功能 |

### 8. 跟读 (Shadowing)

| 项目 | 状态 |
|------|------|
| 文件位置 | `src/components/practice/ShadowingPractice.tsx` + `ShadowingPracticePage.tsx` |
| 是否真实实现 | ⚠️ 部分 — UI 完整支持4种模式，但录音仅 `setTimeout` 模拟 |
| 是否Mock | ⚠️ 录音和评分均为 placeholder |
| Bug | ❌ 无（因为功能未实际执行） |

### 9. AI对话 (Conversation)

| 项目 | 状态 |
|------|------|
| 文件位置 | `src/components/practice/ConversationPractice.tsx` + `ConversationPracticePage.tsx` |
| 是否真实实现 | ✅ 是 — 完整聊天界面，支持发送消息、显示修正、词汇建议 |
| 是否Mock | ⚠️ AI Tutor v1 使用规则匹配，非 LLM API |
| Bug | ❌ 无 |
| 问题 | 初始 prompt 始终为英文，对零基础用户不友好 |

### 10. 复习 (Review)

| 项目 | 状态 |
|------|------|
| 文件位置 | `src/components/learning/ReviewPage.tsx` |
| 是否真实实现 | ✅ 是 — SRS 概念的复习流程，随机选择词汇 |
| 是否Mock | ⚠️ 未连接真实 SRS Engine，随机选择词汇 |
| Bug | ✅ 已修复 — ActivityGenerator 的 "错误选项1/2/3" 已替换为真实词汇干扰项 |
| 问题 | 复习未记录到 SRS 状态，每次复习都是全新的 |

### 11. 学习进度 (ProgressDashboard)

| 项目 | 状态 |
|------|------|
| 文件位置 | `src/components/progress/ProgressDashboard.tsx` |
| 是否真实实现 | ✅ 是 — 显示词汇统计、SRS 统计、课程进度、正确率 |
| 是否Mock | ⚠️ 部分 — 读取 IndexedDB，但 fallback 数据为硬编码 |
| Bug | ❌ 无 |
| 问题 | 错误处理时显示默认数据（300词），可能误导用户 |

---

## 第二部分：模拟用户测试

### 用户画像
- **年龄：** 38岁
- **国籍：** 中国
- **英语基础：** 零基础
- **目标：** 360天英语交流

### Day 1 完整流程测试

| 步骤 | 操作 | 结果 | 是否可继续 |
|------|------|------|-----------|
| 1. 打开应用 | 访问 URL | ✅ 首页加载正常 | ✅ |
| 2. Onboarding | 点击"设置" → 完成7步引导 | ✅ 流程完整 | ✅ |
| 3. 返回首页 | 点击"开始今日学习" | ✅ 导航到 /learn | ✅ |
| 4. 查看今日学习 | 显示3个任务 | ✅ 显示正常 | ✅ |
| 5. 点击"开始"按钮 | 导航到课程 | ✅ 修复后可导航 | ✅ |
| 6. 词汇学习 | 显示 "hello" 卡片 | ✅ IPA + 中文 + 例句 | ✅ |
| 7. 显示中文意思 | 点击按钮 | ✅ 蛤 + 记忆法 | ✅ |
| 8. 播放发音 | 点击喇叭 | ✅ TTS 播放 | ✅ |
| 9. 下一个单词 | 点击"下一个" | ✅ 继续学习 | ✅ |
| 10. 完成词汇 | 点击"完成" | ✅ 进入下一个活动 | ✅ |
| 11. 发音活动 | 字母发音 | ✅ 显示字母+示例 | ✅ |
| 12. 听力活动 | 播放 + 问答 | ✅ TTS + 选择题 | ✅ |
| 13. 课程完成 | 显示完成界面 | ✅ 显示成果 | ✅ |

### 第一个无法继续的位置

**无** — Day 1 完整流程可以顺利走完。

### 占位内容清单

| 位置 | 类型 | 描述 |
|------|------|------|
| DailyPlanPage 数据 | 硬编码 | 3个活动固定为 vocabulary/phonics/listening |
| Shadowing 录音 | placeholder | `setTimeout` 模拟，无实际录音 |
| Pronunciation 录音 | placeholder | 仅设置状态，无实际录音 |
| Conversation AI | 规则匹配 | AITutorV1 使用关键词匹配，非 LLM |
| Review SRS | 随机 | 未连接真实 SRS，每次随机选词 |
| 听力 transcript | 缺失 | 仅显示"播放音频"，无文本显示 |

### 影响学习的问题

| 严重度 | 问题 | 影响 |
|--------|------|------|
| **P0** | ~~学习按钮点击无响应~~ | ✅ 已修复 |
| **P0** | ~~复习显示"错误选项1/2/3"~~ | ✅ 已修复 |
| **P1** | 跟读/发音录音功能不工作 | 无法练习口语 |
| **P1** | AI对话使用 Mock，无法真正纠正语法 | 对话练习效果有限 |
| **P1** | 复习不记录 SRS 状态 | 无法实现间隔复习 |
| **P2** | 首页与今日学习数据不一致 | 用户体验混乱 |
| **P2** | Onboarding 数据不传到首页 | 个性化设置无效 |

---

## 第三部分：Bug 修复记录

### Bug P0-1: 学习按钮点击无响应 ✅ 已修复

**位置：** `src/components/learning/DailyPlanPage.tsx`  
**根因：** "开始"按钮没有 `onClick` handler  
**修复：** 添加 `onClick` 导航到 `/lesson/day_1`；"开始今日学习"按钮也添加了导航

### Bug P0-2: 复习显示"错误选项1/2/3" ✅ 已修复

**位置：** `src/engines/learning/index.ts` + `src/engines/listening/index.ts`  
**根因：** 选择题错误选项为硬编码占位符  
**修复：** 
- ActivityGenerator: 从 `UNIQUE_BEGINNER_WORDS` 中随机选取3个真实词汇作为干扰项
- Listening Engine: 新增 `generateListeningOptions` 方法，从同一组句子的中文翻译 + 常用中文短语中选取干扰项

---

## 第四部分：完整修复清单

### 已修复文件

| 文件 | 修改内容 |
|------|---------|
| `src/components/learning/DailyPlanPage.tsx` | 添加 `useNavigate` + 3处 onClick handler |
| `src/engines/learning/index.ts` | 导入 UNIQUE_BEGINNER_WORDS，替换硬编码干扰项 |
| `src/engines/listening/index.ts` | 新增 `generateListeningOptions` 方法，替换硬编码干扰项 |

### 修复后验证

```
✅ Typecheck: 0 errors
✅ Learning Engine Tests: 10 passed
✅ Listening Engine Tests: 6 passed
```

---

## 第五部分：当前真实完成度评估

### 功能完成度

| 功能 | 状态 | 完成度 |
|------|------|--------|
| 首页 | 可用 | 90% |
| Onboarding | 可用 | 95% |
| 今日学习 | 可用 | 60% (硬编码数据) |
| 课程查看器 | 可用 | 85% (仅Day 1完整) |
| 单词学习 | 可用 | 80% |
| 发音 | UI可用 | 40% (录音未实现) |
| 听力 | 可用 | 75% |
| 跟读 | UI可用 | 30% (录音+评分未实现) |
| AI对话 | 可用 | 50% (Mock AI) |
| 复习 | 可用 | 55% (无SRS) |
| 进度追踪 | 可用 | 70% |

### 整体产品评估

**当前版本可以作为一个 Day 1 学习体验 Demo 使用。**

一个零基础中国成人可以：
- ✅ 打开应用
- ✅ 完成 Onboarding
- ✅ 学习 Day 1 词汇（8个单词）
- ✅ 听到 TTS 发音
- ✅ 看到中文解释和记忆法
- ✅ 完成听力选择题
- ✅ 进入 AI 对话界面
- ✅ 查看学习进度
- ✅ 数据保存到 IndexedDB（刷新不丢失）

**还不能：**
- ❌ 练习口语（录音功能不工作）
- ❌ 获得真正的 AI 纠正
- ❌ 进行间隔复习（SRS 未连接）
- ❌ 学习 Day 2-30 完整课程
- ❌ 获得真人发音音频

---

## 第六部分：修复优先级建议

| 优先级 | 任务 | 工作量 |
|--------|------|--------|
| **P0** | ✅ 修复学习按钮无响应 | 已完成 |
| **P0** | ✅ 修复错误选项显示 | 已完成 |
| **P1** | 实现 Web Speech API 录音功能 | 1-2天 |
| **P1** | 接入 OpenAI/Claude API 到 AI Tutor | 1天 |
| **P1** | 连接 SRS Engine 到复习页面 | 1天 |
| **P2** | 统一首页和今日学习数据源 | 0.5天 |
| **P2** | Onboarding 数据传递到首页 | 0.5天 |
| **P3** | 补充 Day 2-30 课程数据 | 持续 |

---

**结论：** English360 当前是一个**功能框架 + Day 1 Demo**。核心架构完整，但多个关键功能（口语、AI、SRS）仍为 placeholder。修复两个 P0 Bug 后，Day 1 流程可以完整运行。
