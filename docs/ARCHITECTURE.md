# English360 GPT - Architecture Document

## Overview

English360 GPT is a local-first, progressive web application designed for systematic English learning. The architecture prioritizes:

1. **Offline capability** - Core learning works without internet
2. **Mobile-first** - iPhone Safari is the primary target
3. **Modular engines** - Clear separation of concerns
4. **AI as enhancement** - Core system works without AI APIs
5. **Local persistence** - All data in IndexedDB

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     PWA Layer                            │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐  │
│  │ Manifest │ │ Service  │ │ Offline  │ │ Install   │  │
│  │          │ │ Worker   │ │ Cache    │ │ Prompt    │  │
│  └──────────┘ └──────────┘ └──────────┘ └───────────┘  │
├─────────────────────────────────────────────────────────┤
│                    UI Layer (React)                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐  │
│  │ Layout   │ │ Learning │ │ Progress │ │ Settings  │  │
│  │ Nav      │ │ Activities│ │ Dashboard│ │ Profile   │  │
│  └──────────┘ └──────────┘ └──────────┘ └───────────┘  │
├─────────────────────────────────────────────────────────┤
│                 Learning Engine Layer                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐  │
│  │Curriculum│ │ Adaptive │ │   SRS    │ │  Memory   │  │
│  │ Engine   │ │ Engine   │ │  Engine  │ │  Engine   │  │
│  └──────────┘ └──────────┘ └──────────┘ └───────────┘  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐  │
│  │Vocabulary│ │ Grammar  │ │ Phonics  │ │Pronunciation│ │
│  │ Engine   │ │ Engine   │ │  Engine  │ │  Engine   │  │
│  └──────────┘ └──────────┘ └──────────┘ └───────────┘  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐  │
│  │Listening │ │ Speaking │ │ Reading  │ │ Writing   │  │
│  │ Engine   │ │ Engine   │ │  Engine  │ │  Engine   │  │
│  └──────────┘ └──────────┘ └──────────┘ └───────────┘  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐  │
│  │Assessment│ │  Error   │ │Progress  │ │Gamification│  │
│  │ Engine   │ │ Analysis │ │  Engine  │ │  Engine   │  │
│  └──────────┘ └──────────┘ └──────────┘ └───────────┘  │
├─────────────────────────────────────────────────────────┤
│                   Student Model Layer                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐  │
│  │ Student  │ │Knowledge │ │Knowledge │ │  Daily    │  │
│  │  Model   │ │  Model   │ │  Graph   │ │  Planner  │  │
│  └──────────┘ └──────────┘ └──────────┘ └───────────┘  │
├─────────────────────────────────────────────────────────┤
│                    AI Provider Layer                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐  │
│  │ Provider │ │  AI      │ │   AI     │ │  AI       │  │
│  │ Abstract │ │  Tutor   │ │Convers.  │ │ Provider  │  │
│  └──────────┘ └──────────┘ └──────────┘ └───────────┘  │
├─────────────────────────────────────────────────────────┤
│                  Data Persistence Layer                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐  │
│  │  Dexie   │ │  Export/ │ │   Sync   │ │ Local     │  │
│  │(IndexedDB)│ │  Import  │ │ Adapter  │ │ Storage   │  │
│  └──────────┘ └──────────┘ └──────────┘ └───────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Key Design Decisions

### 1. Local-First Architecture

All learning data is stored in IndexedDB via Dexie. This ensures:
- Offline learning capability
- No server dependency for core features
- Fast read/write performance
- Data stays on user's device

### 2. Engine Pattern

Each learning domain is encapsulated in an engine with:
- A TypeScript interface defining the contract
- A concrete implementation (currently stubs)
- Clear dependency boundaries
- Testable in isolation

### 3. AI as Enhancement Layer

The system is designed so AI is optional:
- **Without AI**: Core learning (SRS, curriculum, assessment, progress) works
- **With AI**: Enhanced conversation, tutoring, writing feedback

### 4. PWA for iOS

iOS Safari limitations addressed:
- `viewport-fit=cover` for notch support
- `apple-mobile-web-app-capable` for standalone
- Safe area CSS variables
- Touch target minimum 44px
- Overscroll prevention

### 5. Adaptive System Design

The adaptive engine uses the Student Model to make decisions:
- What to study next
- When to review
- Difficulty adjustment
- Skill balance (listening/speaking/reading/writing ratio)
- Foundation gap detection

### 6. Chinese Scaffold Progression

Language support decreases as proficiency increases:
1. Full Chinese interface → Chinese + English → English with support → Immersive
2. User can override via settings
3. System tracks `chineseAssistLevel`

## Data Flow

```
User Action
    ↓
UI Component
    ↓
Learning Engine (processes action)
    ↓
Student Model (updates capability)
    ↓
Knowledge Model (updates knowledge state)
    ↓
SRS Engine (schedules next review)
    ↓
Adaptive Engine (adjusts future recommendations)
    ↓
Data Persistence Layer (saves to IndexedDB)
    ↓
Progress Engine (updates display)
```

## Future Considerations

### Sync Adapter (Phase 9+)
- Supabase / Firebase / custom backend
- Sync local data to cloud
- Multi-device support
- Conflict resolution

### Backend Proxy (Security)
- For API key protection in production
- Rate limiting
- Cost monitoring

### Content Pipeline
- Structured curriculum data
- Curated knowledge base
- Question banks
- Real-world material integration
