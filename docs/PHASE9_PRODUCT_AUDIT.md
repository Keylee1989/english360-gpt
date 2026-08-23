# Phase 9 Product Audit — English360

## Executive Summary

English360 has 35+ engines but only **8 are actively used** in the UI. Most engines exist as isolated code without real integration. This audit identifies what works, what's broken, and what needs fixing for production.

---

## Engine Usage Status

### ✅ ACTIVELY USED (8 engines)

| Engine | Used By | Status |
|--------|---------|--------|
| VocabularyEngine | LessonPage, ReviewPage, ProgressDashboard | ✅ Working |
| SRSEngine | ReviewPage, ProgressDashboard | ✅ Working |
| CurriculumEngine | ProgressDashboard | ✅ Working |
| AudioEngine | LessonViewer | ✅ Working |
| ListeningEngine | LessonViewer | ✅ Working |
| SpeakingEngine | LessonViewer | ✅ Working |
| ActivityGenerator | LessonPage, ReviewPage | ✅ Working |
| AdaptiveLearningEngineV2 | AdaptiveDashboard | ✅ Working |

### ⚠️ PARTIALLY USED (4 engines)

| Engine | Used By | Status |
|--------|---------|--------|
| AI Tutor v1 | ConversationPractice | ⚠️ Mock only |
| Pronunciation v4 | PronunciationPractice | ⚠️ Mock only |
| Shadowing v1 | ShadowingPractice | ⚠️ Mock only |
| ChineseAssist | (imported but unclear) | ⚠️ Needs verification |

### ❌ NOT USED IN UI (23+ engines)

| Engine | Status |
|--------|--------|
| AI Tutor v2 | ❌ Not connected to UI |
| Audio v3 | ❌ Not connected |
| Pronunciation v3 | ❌ Superseded by v4 |
| Speaking v2 | ❌ Not connected |
| Native Audio v1 | ❌ No audio files |
| Daily Coach v1 | ❌ Not connected to UI |
| Daily Coach v2 | ❌ Doesn't exist yet |
| Learner Model v1 | ❌ Not connected |
| Effectiveness v1 | ❌ Not connected |
| Input Library v1 | ❌ Not connected |
| Speech Recognition v1 | ❌ Not connected |
| Analytics v1 | ❌ Not connected |
| Curriculum Validator v2 | ❌ Not connected |
| Beta Test v1 | ❌ Not connected |
| Writing v1 | ❌ Not connected |
| Grammar v1 | ❌ Not connected |
| Reading v1 | ❌ Not connected |
| Progress Persistence | ❌ Not connected |
| Knowledge Graph | ❌ Not connected |
| Memory | ❌ Not connected |
| Error Analysis | ❌ Not connected |
| Student Model | ❌ Not connected |
| Settings | ❌ Not connected |

---

## Critical Issues Found

### 1. No Real Learning Loop

**Current flow:**
```
Home → DailyPlan → LessonViewer → Review → Progress
```

**Missing:**
- No practice routing (shadowing, conversation, pronunciation exist as components but no routes)
- No daily mission generation
- No SRS integration in daily flow
- No real adaptive behavior

### 2. AI Tutor is Mock Only

**Current state:**
- ConversationPractice uses AI Tutor v1
- AI Tutor v1 has rule-based responses
- No real LLM connection
- No conversation memory

### 3. No Audio Files

**Current state:**
- Uses Web Speech API TTS only
- No native speaker audio
- No slow/normal speed options
- Pronunciation feedback is text-based only

### 4. No Error Handling

**Current state:**
- No error boundaries
- No graceful degradation
- No offline support
- No data backup

### 5. No iOS Optimization

**Current state:**
- Basic responsive CSS
- No touch optimization
- No keyboard handling
- No PWA manifest properly configured

---

## What Actually Works

### ✅ Vocabulary Learning
- 300 beginner words with IPA, Chinese, examples
- SRS scheduling
- Review system

### ✅ Basic Lesson Flow
- Day 1-30 curriculum exists
- LessonViewer renders activities
- Activity completion tracking

### ✅ Progress Tracking
- Words learned count
- Study streak
- Basic statistics

---

## Priority Fixes for Production

### MUST FIX (P0)

1. **Connect Daily Coach to UI** — Users need to know what to study today
2. **Add practice routes** — /practice/shadowing, /practice/conversation, etc.
3. **Error boundaries** — App shouldn't crash on errors
4. **IndexedDB persistence** — Data must survive refresh

### SHOULD FIX (P1)

5. **AI Tutor real integration** — At least mock provider that works
6. **Touch optimization** — Mobile-first interaction
7. **Loading states** — Users need feedback

### NICE TO HAVE (P2)

8. **Native audio** — Requires recording
9. **Advanced analytics** — Post-beta
10. **Offline mode** — Post-beta

---

## Conclusion

**Current state:** Technical demo with isolated engines

**Target state:** Functional learning app for Day 1-30

**Gap:** ~40% of critical features not connected to UI

**Recommendation:** Focus on connecting existing engines, not building new ones.

---

Generated: Phase 9 Product Audit
Status: Ready for Implementation
