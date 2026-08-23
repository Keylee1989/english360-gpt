# Data Layer Design

## Storage Strategy

English360 GPT uses a local-first data architecture:

1. **Primary**: IndexedDB via Dexie.js
2. **Secondary**: localStorage (for settings, preferences)
3. **Future**: Cloud sync via Sync Adapter

## IndexedDB Schema (v1)

### studentModels
- **Key**: `userId`
- **Indexes**: none
- **Purpose**: Core student model with all capability scores

### vocabularyStates
- **Key**: `id`
- **Indexes**: `entryId`, `userId`, `learningState`, `nextReview`
- **Purpose**: Per-user vocabulary learning state

### grammarStates
- **Key**: `id`
- **Indexes**: `pointId`, `userId`, `learningState`
- **Purpose**: Per-user grammar point mastery

### srsCards
- **Key**: `id`
- **Indexes**: `entryId`, `entityType`, `dueDate`, `easeFactor`
- **Purpose**: SRS scheduling data

### errorBank
- **Key**: `id`
- **Indexes**: `category`, `frequency`, `userId`
- **Purpose**: Error tracking and pattern analysis

### achievements
- **Key**: `id`
- **Indexes**: `userId`, `earnedAt`
- **Purpose**: Achievement and badge records

### progressHistory
- **Key**: `id`
- **Indexes**: `userId`, `date`, `domain`
- **Purpose**: Historical performance data

### settings
- **Key**: `key`
- **Purpose**: Application settings key-value store

### activities
- **Key**: `id`
- **Indexes**: `domain`, `type`
- **Purpose**: Learning activity definitions

## Data Export / Import

```typescript
interface DataExport {
  version: number;
  exportedAt: number;
  schemaVersion: number;
  data: {
    studentModel: StudentModel;
    vocabularyStates: VocabularyState[];
    grammarStates: GrammarState[];
    srsCards: SRSCard[];
    errorBank: ErrorRecord[];
    achievements: Achievement[];
    settings: UserSettings;
    progressHistory: PerformanceWindow[];
  };
}
```

## Schema Migration

- `DB_SCHEMA_VERSION` constant tracks current schema version
- Dexie handles migrations automatically
- Major changes bump version number
- Export format includes `schemaVersion` for import validation

## Data Security

- All data stays on user's device
- No data sent to servers without explicit consent
- API keys stored in localStorage (user-configured)
- Export file contains learning data only (no API keys)
