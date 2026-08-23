# PHASE 0 Report — Project Initialization & Architecture

**Date**: August 21, 2026
**Status**: ✅ COMPLETE — All verification checks pass

---

## 1. What Was Created

### Project Structure
- `english360-gpt/` — New independent project (does NOT touch old english360)
- Git repository initialized
- Full directory structure with 29 engine modules, 7 component groups, and supporting modules

### Configuration Files
| File | Purpose |
|------|---------|
| `package.json` | Dependencies and scripts |
| `tsconfig.json` | TypeScript strict configuration with path aliases |
| `vite.config.ts` | Vite + React + PWA + test config |
| `tailwind.config.js` | Tailwind CSS with custom primary colors |
| `postcss.config.js` | PostCSS for Tailwind |
| `.eslintrc.cjs` | ESLint for React + TypeScript |
| `.prettierrc` | Prettier formatting rules |
| `.gitignore` | Standard ignores + env files |
| `.env.example` | Environment variable template |
| `index.html` | Entry HTML with iOS meta tags |

### Source Code
| File | Purpose |
|------|---------|
| `src/main.tsx` | React entry point with BrowserRouter |
| `src/App.tsx` | Root component with routing |
| `src/index.css` | Global CSS with Tailwind + iOS safe area support |
| `src/types/index.ts` | Core type definitions (CEFR, skills, difficulty, etc.) |
| `src/types/vocabulary.ts` | Comprehensive vocabulary data model |
| `src/types/grammar.ts` | Grammar point data model |
| `src/types/student-model.ts` | Student model with all skill scores |
| `src/types/srs.ts` | SRS card types + ISRSEngine interface |
| `src/types/engines.ts` | All engine interfaces (29 engines) |
| `src/types/database.ts` | Database schema version + export format |
| `src/types/navigator.d.ts` | iOS Safari `standalone` type declaration |
| `src/db/index.ts` | Dexie database with schema definition |
| `src/engines/srs/index.ts` | SRS engine stub (NOT IMPLEMENTED) |
| `src/engines/adaptive/index.ts` | Adaptive engine stub (NOT IMPLEMENTED) |
| `src/engines/curriculum/index.ts` | Curriculum engine stub (NOT IMPLEMENTED) |
| `src/engines/assessment/index.ts` | Assessment engine stub (NOT IMPLEMENTED) |
| `src/engines/memory/index.ts` | Memory engine stub (NOT IMPLEMENTED) |
| `src/engines/error-analysis/index.ts` | Error analysis stub (NOT IMPLEMENTED) |
| `src/engines/knowledge-graph/index.ts` | Knowledge graph stub (NOT IMPLEMENTED) |
| `src/engines/ai-provider/index.ts` | AI provider abstraction stub (NOT IMPLEMENTED) |
| `src/components/layout/MainLayout.tsx` | Main layout with bottom navigation |
| `src/components/home/HomePage.tsx` | Home page with project status |
| `src/components/common/NotFoundPage.tsx` | 404 page |
| `src/test/setup.ts` | Vitest setup with matchMedia mock |
| `src/test/App.test.tsx` | Smoke tests (3 tests) |

### PWA Assets
| File | Purpose |
|------|---------|
| `public/favicon.svg` | SVG favicon |
| `public/icons/icon-192.png` | PWA icon (placeholder) |
| `public/icons/icon-512.png` | PWA icon (placeholder) |

### CI/CD
| File | Purpose |
|------|---------|
| `.github/workflows/deploy.yml` | GitHub Pages deployment with typecheck + lint + test + build |

### Documentation
| File | Purpose |
|------|---------|
| `README.md` | Project overview, setup, structure |
| `docs/ARCHITECTURE.md` | System architecture with diagram |
| `docs/DEVELOPMENT_PHASES.md` | Phase 0-9 roadmap |
| `docs/IOS_COMPATIBILITY.md` | iOS Safari limitations and mitigations |
| `docs/DATA_LAYER.md` | IndexedDB schema and data strategy |

---

## 2. Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React | 18.3.x |
| Language | TypeScript | 5.5.x (strict mode) |
| Build Tool | Vite | 5.3.x |
| Styling | Tailwind CSS | 3.4.x |
| PWA | vite-plugin-pwa + Workbox | 0.20.x |
| Database | Dexie (IndexedDB) | 4.0.x |
| Routing | React Router | 6.x |
| Testing | Vitest + React Testing Library | 2.0.x |
| Linting | ESLint + Prettier | 8.x / 3.x |

---

## 3. Project Structure

```
english360-gpt/
├── .github/workflows/deploy.yml    # CI/CD
├── docs/                           # Documentation
├── public/                         # Static assets (icons, favicon)
├── src/
│   ├── components/                 # React UI components
│   │   ├── layout/                 # MainLayout (nav, shell)
│   │   ├── common/                 # NotFoundPage
│   │   ├── home/                   # HomePage
│   │   ├── learning/               # (empty — Phase 1+)
│   │   ├── settings/               # (empty — Phase 1+)
│   │   ├── assessment/             # (empty — Phase 6+)
│   │   └── progress/               # (empty — Phase 2+)
│   ├── engines/                    # 29 learning engines
│   │   ├── srs/                    # Spaced Repetition (stub)
│   │   ├── adaptive/               # Adaptive Learning (stub)
│   │   ├── curriculum/             # Curriculum Path (stub)
│   │   ├── assessment/             # Assessment (stub)
│   │   ├── memory/                 # Memory Methods (stub)
│   │   ├── error-analysis/         # Error Analysis (stub)
│   │   ├── knowledge-graph/        # Knowledge Graph (stub)
│   │   ├── ai-provider/            # AI Provider Abstraction (stub)
│   │   ├── vocabulary/             # (empty — Phase 2)
│   │   ├── grammar/                # (empty — Phase 3)
│   │   ├── phonics/                # (empty — Phase 3)
│   │   ├── pronunciation/          # (empty — Phase 4)
│   │   ├── listening/              # (empty — Phase 4)
│   │   ├── speaking/               # (empty — Phase 4)
│   │   ├── reading/                # (empty — Phase 5)
│   │   ├── writing/                # (empty — Phase 5)
│   │   ├── real-world/             # (empty — Phase 7)
│   │   ├── ai-tutor/               # (empty — Phase 6)
│   │   ├── ai-conversation/        # (empty — Phase 6)
│   │   ├── student-model/          # (empty — Phase 1)
│   │   ├── knowledge/              # (empty — Phase 1)
│   │   ├── daily-planner/          # (empty — Phase 1)
│   │   ├── progress/               # (empty — Phase 2)
│   │   ├── gamification/           # (empty — Phase 2)
│   │   └── achievement/            # (empty — Phase 2)
│   ├── db/                         # Dexie IndexedDB layer
│   ├── types/                      # TypeScript type definitions
│   ├── hooks/                      # React hooks (empty)
│   ├── stores/                     # State management (empty)
│   ├── utils/                      # Utilities (empty)
│   ├── i18n/                       # Internationalization (empty)
│   ├── assets/                     # Static assets
│   └── test/                       # Tests
└── index.html                      # Entry HTML
```

---

## 4. Architecture Design

### Core Principles
1. **Local-first**: All data in IndexedDB. No server dependency for core features.
2. **AI as enhancement**: Core learning works without any AI API.
3. **Mobile-first**: iPhone Safari is the primary target.
4. **No fake features**: All stubs are marked NOT IMPLEMENTED.
5. **Engine pattern**: Each learning domain has its own engine with TypeScript interfaces.

### Engine Interfaces Defined
All 29 engines from the project spec have interfaces:
- CurriculumEngine, StudentModel, KnowledgeModel, KnowledgeGraph
- MemoryEngine, SRSEngine, AdaptiveEngine, AssessmentEngine
- DailyPlanner, VocabularyEngine, GrammarEngine, PhonicsEngine
- PronunciationEngine, ListeningEngine, SpeakingEngine, ReadingEngine, WritingEngine
- RealWorldEngine, AITutorEngine, AIConversationEngine
- ErrorAnalysisEngine, ProgressEngine, GamificationEngine, AchievementEngine
- LocalPersistence (Dexie), Import/Export, SyncAdapter (future), AIProviderLayer

### Student Model
Comprehensive type definitions tracking:
- 9 skill scores (vocabulary, grammar, listening, speaking, reading, writing, pronunciation, fluency, naturalness)
- Per-domain detailed stats
- Performance windows and trends
- User settings (adaptive mode, intensity, strictness, study duration, Chinese assist level)

---

## 5. PWA Design

| Feature | Implementation |
|---------|---------------|
| Manifest | ✅ `manifest.webmanifest` with icons, standalone, portrait |
| Service Worker | ✅ Generated by Workbox via vite-plugin-pwa |
| Icons | ⚠️ Placeholder 1x1 PNG (need real icons) |
| Installability | ✅ `apple-mobile-web-app-capable` meta tag |
| Offline Caching | ✅ Precache 11 entries (169 KiB) |
| iOS Safe Areas | ✅ CSS `env(safe-area-inset-*)` variables |
| Viewport | ✅ `viewport-fit=cover` for notch/Dynamic Island |
| Standalone Mode | ✅ `navigator.standalone` detection |

---

## 6. Data Layer Design

### IndexedDB Schema (v1)
| Store | Key | Indexes | Purpose |
|-------|-----|---------|---------|
| `studentModels` | userId | — | User capability data |
| `vocabularyStates` | id | entryId, userId, learningState, nextReview | Vocabulary learning state |
| `grammarStates` | id | pointId, userId, learningState | Grammar mastery |
| `srsCards` | id | entryId, entityType, dueDate, easeFactor | SRS scheduling |
| `errorBank` | id | category, frequency, userId | Error tracking |
| `achievements` | id | userId, earnedAt | Badges/milestones |
| `progressHistory` | id | userId, date, domain | Historical data |
| `settings` | key | — | App settings |
| `activities` | id | domain, type | Learning activities |

### Export/Import
- `DataExport` interface defined with `schemaVersion`
- Ready for implementation in Phase 1

---

## 7. AI Layer Design

### Provider Abstraction
```typescript
interface IAIProvider {
  chat(request: AIChatRequest): Promise<AIChatResponse>;
  isAvailable(): Promise<boolean>;
  getInfo(): AIProviderInfo;
}
```

### Security Model
- API keys stored in localStorage (user-configured in Settings)
- Never in source code, never in Git
- For GitHub Pages: direct browser-to-API calls
- For production: optional backend proxy

### Supported Providers (via OpenAI-compatible API)
- OpenAI, DeepSeek, Qwen, Doubao, any compatible endpoint

---

## 8. Learning Engine Design

All engine interfaces are defined in `src/types/engines.ts` and `src/types/srs.ts`. Engines are organized as:
- Each engine has an `index.ts` with a class implementing the interface
- All implementations currently throw `NOT IMPLEMENTED`
- No fake logic, no fake data, no fake progress

### Key Interfaces
| Engine | Methods |
|--------|---------|
| ICurriculumEngine | getLearningPath, getNextActivity, generateDailyPlan |
| IAdaptiveEngine | getNextRecommendation, adjustDifficulty, checkFoundationGaps, getOptimalRatio |
| ISRSEngine | createCard, processReview, getDueCards, getTodayCards, calculateNextReview, getStats |
| IMemoryEngine | selectMethod, updateStrength, getWeakItems |
| IAssessmentEngine | runAssessment, evaluateAnswer |
| IAIProvider | chat, isAvailable, getInfo |
| IKnowledgeGraph | getRelated, getPrerequisites, getCoverage |

---

## 9. iOS Compatibility Risks

| Risk | Impact | Likelihood | Status |
|------|--------|------------|--------|
| Service Worker lifecycle | Low | High | ✅ Mitigated |
| IndexedDB quota | Low | Medium | ✅ Mitigated |
| Audio autoplay | Medium | High | ✅ Mitigated (user gesture required) |
| Microphone access | Medium | Medium | ✅ HTTPS + graceful degradation |
| PWA install UX | Low | High | ✅ Manual instructions |
| Safe areas (notch) | Low | High | ✅ CSS env() variables |
| Viewport height | Low | High | ✅ `100dvh` |
| **Web Speech API** | **High** | **High** | ⚠️ Partially mitigated (text fallback) |
| Background processing | Low | Medium | ✅ Local-first handles this |
| Fixed positioning | Low | Medium | ✅ Sticky preferred |

**Critical Risk**: Web Speech API is not available on iOS Safari. Speaking exercises will need a text-based fallback or server-side speech recognition via AI provider. This is documented and will be addressed in Phase 4.

---

## 10. Current Test Results

```
✅ Typecheck: passed (0 errors)
✅ Lint: passed (0 warnings, 0 errors)
✅ Test: 1 file, 3 tests passed
✅ Build: built successfully (39 modules, PWA with 11 precached entries)
```

### Build Output
- `dist/index.html` — 1.27 KB
- `dist/assets/index.css` — 8.96 KB (2.47 KB gzip)
- `dist/assets/index.js` — 162.59 KB (53.09 KB gzip)
- `dist/sw.js` — Service worker (Workbox)
- `dist/manifest.webmanifest` — PWA manifest

---

## 11. Current Build Results

| Metric | Value |
|--------|-------|
| Modules transformed | 39 |
| Build time | ~4s |
| Total JS (gzip) | ~53 KB |
| Total CSS (gzip) | ~2.5 KB |
| Precached entries | 11 (170 KB) |
| TypeScript errors | 0 |
| ESLint warnings | 0 |
| Test failures | 0 |

---

## 12. Current Known Issues

1. **PWA Icons**: Currently placeholder 1x1 pixel PNGs. Need real 192x192 and 512x512 icons before production.
2. **Web Speech API**: Not available on iOS Safari. Will need alternative approach for speaking exercises.
3. **npm audit**: 8 vulnerabilities (6 moderate, 1 high, 1 critical) from dependencies. Should be addressed before production.
4. **React Router warnings**: Future flag warnings for v7 migration. Not urgent but should be addressed before RR v7 upgrade.
5. **Empty module directories**: Most engine directories are empty (only stubs created for key engines). Remaining engines need stubs in Phase 1+.

---

## 13. Next Phase Suggestions

### Phase 1: Core Data Layer & Basic Curriculum

**Recommended next steps:**

1. **Student Model implementation** — Create the StudentModel engine with full CRUD operations via Dexie
2. **Basic curriculum data** — Define the first module (alphabet/phonics for Day 1-7)
3. **Simple learning flow** — Activity → Answer → Feedback → Next
4. **Settings page** — User preferences (study duration, intensity, Chinese assist level)
5. **Daily planner** — Generate a study plan based on time available
6. **Data export/import** — Allow users to backup their data

**Before starting Phase 1, consider:**
- Creating real PWA icons (192x192 and 512x512)
- Resolving npm audit vulnerabilities
- Deciding on initial vocabulary set size and source

---

**PHASE 0 is complete. Awaiting human review and Phase 1 instructions.**
