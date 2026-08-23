# English360 GPT

A systematic, adaptive English learning system for Chinese-speaking adults.

## Vision

English360 GPT is not a course website — it is a long-term English proficiency building system. It takes a complete beginner (Chinese-speaking adult with zero English) and systematically develops real American English functional proficiency through adaptive, memory-optimized, multi-skill training.

**Target**: Native-like Functional Proficiency — not just course completion.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build | Vite 5 |
| Styling | Tailwind CSS (mobile-first) |
| PWA | vite-plugin-pwa + Workbox |
| Database | IndexedDB via Dexie |
| Testing | Vitest + React Testing Library |
| Linting | ESLint + Prettier |
| Routing | React Router v6 |

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Run tests
npm test

# Type check
npm run typecheck

# Lint
npm run lint

# Format
npm run format

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
english360-gpt/
├── src/
│   ├── components/       # UI components
│   │   ├── layout/       # Main layout, navigation
│   │   ├── common/       # Shared components
│   │   ├── home/         # Home page
│   │   ├── learning/     # Learning activity components
│   │   ├── settings/     # Settings page
│   │   ├── assessment/   # Assessment components
│   │   └── progress/     # Progress display components
│   ├── engines/          # Core learning engines (interfaces + stubs)
│   │   ├── curriculum/   # Curriculum path management
│   │   ├── student-model/ # User capability tracking
│   │   ├── knowledge/    # Knowledge base
│   │   ├── knowledge-graph/ # Knowledge relationships
│   │   ├── memory/       # Memory method selection
│   │   ├── srs/          # Spaced Repetition System
│   │   ├── adaptive/     # Adaptive learning decisions
│   │   ├── assessment/   # Skill assessment
│   │   ├── daily-planner/ # Daily session planning
│   │   ├── vocabulary/   # Vocabulary engine
│   │   ├── grammar/      # Grammar engine
│   │   ├── phonics/      # Phonics engine
│   │   ├── pronunciation/ # Pronunciation engine
│   │   ├── listening/    # Listening comprehension engine
│   │   ├── speaking/     # Speaking production engine
│   │   ├── reading/      # Reading comprehension engine
│   │   ├── writing/      # Writing production engine
│   │   ├── real-world/   # Real-world English scenarios
│   │   ├── ai-tutor/     # AI tutoring engine
│   │   ├── ai-conversation/ # AI conversation engine
│   │   ├── error-analysis/ # Error tracking and analysis
│   │   ├── progress/     # Progress tracking
│   │   ├── gamification/ # XP, streaks, badges
│   │   └── achievement/  # Achievement system
│   ├── db/               # Database layer (Dexie/IndexedDB)
│   ├── types/            # TypeScript type definitions
│   ├── hooks/            # React hooks
│   ├── stores/           # State management
│   ├── utils/            # Utility functions
│   ├── i18n/             # Internationalization (Chinese/English)
│   └── assets/           # Static assets
├── public/               # Public static files
│   ├── icons/            # PWA icons
│   └── favicon.svg       # Favicon
├── docs/                 # Documentation
└── index.html            # Entry HTML
```

## Architecture Principles

1. **Local-first**: All core data stored in IndexedDB. Works offline.
2. **AI as enhancement layer**: Core learning works without AI API.
3. **Mobile-first**: iPhone Safari is the primary target.
4. **No fake features**: Every feature is either implemented or marked NOT IMPLEMENTED.
5. **Modular engines**: Each learning domain has its own engine with clear interfaces.

## PWA Features

- ✅ Installable to home screen
- ✅ Standalone display mode
- ✅ Offline basic learning
- ✅ Service worker caching
- ✅ iOS safe area support
- ✅ Mobile-optimized viewport

## Security

- API keys are NEVER stored in source code
- API keys are user-configured and stored in localStorage
- For production, a backend proxy is recommended for API key security

## Development Phases

- **Phase 0**: Project initialization & architecture ← CURRENT
- **Phase 1**: Core data layer and basic curriculum
- **Phase 2**: SRS engine and vocabulary system
- **Phase 3**: Grammar and phonics systems
- **Phase 4**: Listening and speaking engines
- **Phase 5**: Reading and writing engines
- **Phase 6**: AI integration
- **Phase 7**: Real-world scenarios
- **Phase 8**: Advanced adaptive learning
- **Phase 9**: Sync and cross-device

## License

Private - All rights reserved.
