# Halo - Claude Code Documentation

## Project Overview

Halo is a single AI health dashboard for fitness goals and tracking. It's a Next.js application that provides a minimalist, signal-focused approach to fitness tracking with AI-powered coaching.

**Core Philosophy:**
- Signal over noise — trends > raw data
- Serious by default — no step counting, no wellness fluff
- Consistency > intensity — streaks are weekly and earned
- AI on demand — no unsolicited coaching or alerts
- Minimal surfaces — five tabs, no feature sprawl

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (California golden theme)
- **Data Storage**: JSON files in `/data` directory (PostgreSQL migration planned)
- **AI**: Anthropic Claude API for Coach feature
- **Runtime**: Node.js 18+

## Architecture

### App Structure (Next.js App Router)

```
app/
├── api/                    # API routes
│   ├── dashboard/         # Dashboard data aggregation
│   ├── workouts/          # Workout CRUD operations
│   ├── body-metrics/      # Body metrics CRUD
│   ├── goals/             # Goals CRUD
│   ├── journal/           # Journal CRUD
│   └── coach/             # AI coach endpoint (Claude API)
├── page.tsx               # Halo Dashboard (home)
├── tracker/page.tsx       # Workout tracker
├── goals/page.tsx         # Goals management
├── journal/page.tsx       # Journal entries
├── coach/page.tsx         # AI Coach
└── layout.tsx             # Root layout with bottom navigation
```

### Shared Code

- **lib/data.ts**: Data access layer, type definitions
- **lib/calculations.ts**: Business logic for streaks, trends, averages
- **components/**: React components (primarily BottomNav.tsx)

## Data Models

All data is stored as JSON files in `/data/`:

### Workout
```typescript
interface Workout {
  id: string;           // UUID
  date: string;         // ISO date
  type: string;         // Workout type (e.g., "Strength", "Cardio")
  duration: number;     // Minutes
  note?: string;        // Optional notes
  source: string;       // Where logged (e.g., "halo", "tonal", "whoop")
}
```

### BodyMetric
```typescript
interface BodyMetric {
  id: string;
  date: string;
  weight?: number;      // lbs
  bodyFat?: number;     // percentage
  source: string;       // "halo", "oura", "manual"
}
```

### Goal
```typescript
interface Goal {
  id: string;
  title: string;
  type: 'training' | 'body' | 'health';
  target: number;
  current: number;
  unit: string;         // "workouts", "lbs", "bpm", etc.
  period: 'monthly' | 'annual';
  startDate: string;
  endDate: string;
}
```

### JournalEntry
```typescript
interface JournalEntry {
  id: string;
  date: string;
  content: string;
  tags: string[];       // e.g., ["recovery", "injury"]
}
```

### Integration Data Types
Located in `/data/integrations/`:

- **OuraData**: Sleep duration, resting heart rate, HRV
- **WhoopData**: Strain, recovery scores
- **TonalData**: Workout type, duration, total volume

## Key Business Logic

### Streak Calculation (`lib/calculations.ts:4`)
- **Rule**: Requires 3+ workouts per week to maintain streak
- Weeks start on Monday
- Counts consecutive weeks from current week backwards
- Used in dashboard and tracker

### Trend Calculations
- **Weight/Body Fat**: 30-day rolling average (`calculateTrend`)
- **Sleep**: 7-day average (`calculateSleepAverage`)
- **Resting Heart Rate**: 7-day average (`calculateRHRTrend`)

### Period Calculations
- `getWorkoutsInPeriod(workouts, days)`: Count workouts in last N days
- Used for monthly/weekly summaries

## API Routes

All routes follow RESTful conventions:

- **GET** `/api/dashboard` - Aggregated dashboard data
- **GET/POST/DELETE** `/api/workouts` - Workout operations
- **GET/POST/DELETE** `/api/body-metrics` - Body metric operations
- **GET/POST/PUT/DELETE** `/api/goals` - Goal operations
- **GET/POST/DELETE** `/api/journal` - Journal operations
- **POST** `/api/coach` - AI coach analysis (requires ANTHROPIC_API_KEY)

## Environment Setup

### Required Files
- `.env.local` - Environment variables (copy from `.env.local.example`)

### Environment Variables
- `ANTHROPIC_API_KEY` - (Optional) Required for Coach feature

### Installation
```bash
npm install
npm run dev  # Starts on http://localhost:3000
```

## Development Guidelines

### File Modifications
- **Always read existing JSON files** before modifying to preserve data
- Use `readData<T>()` and `writeData<T>()` from `lib/data.ts`
- Never hardcode file paths; use `DATA_DIR` constant

### Adding Features
- Keep UI minimal and signal-focused
- Follow the five-tab structure (Dashboard, Tracker, Goals, Journal, Coach)
- Use California golden theme colors (defined in Tailwind config)
- Avoid adding notifications, alerts, or proactive features

### Code Style
- TypeScript strict mode enabled
- Use async/await for file operations
- Handle errors gracefully (don't crash on missing data files)
- Keep calculations pure and testable in `lib/calculations.ts`

## Common Tasks

### Adding a New Workout Type
1. No code changes needed - `type` field is free-form string
2. Simply add workouts with the new type via tracker UI or API

### Modifying Streak Logic
- Edit `calculateStreak()` in `lib/calculations.ts:4`
- Current rule: 3+ workouts/week
- To change: modify `MIN_WORKOUTS_PER_WEEK` constant

### Adding New Body Metrics
1. Update `BodyMetric` interface in `lib/data.ts:37`
2. Add trend calculation in `lib/calculations.ts` if needed
3. Update UI in tracker and dashboard

### Integrating New Device
1. Create interface in `lib/data.ts` (e.g., `GarminData`)
2. Add JSON file in `data/integrations/`
3. Update dashboard API to read and display data
4. Add trend calculations if needed

### Customizing AI Coach
- Coach uses Claude API via `/api/coach/route.ts`
- Modify system prompt to change coaching style
- Context includes recent workouts, goals, journal entries, and metrics

## Data File Locations

```
data/
├── workouts.json          # All workout logs
├── bodyMetrics.json       # Weight and body fat data
├── goals.json             # Fitness goals
├── journal.json           # Journal entries
└── integrations/
    ├── oura.json         # Oura ring data (sleep, RHR, HRV)
    ├── whoop.json        # Whoop data (strain, recovery)
    └── tonal.json        # Tonal workout data
```

## Known Limitations

- **No authentication**: Single-user application
- **JSON storage**: File-based data (PostgreSQL migration planned)
- **Mock integrations**: Oura/Whoop/Tonal data is currently sample data
- **No real-time sync**: Manual refresh required for updates
- **Client-side only charts**: No charting library yet

## Future Roadmap

- PostgreSQL database migration
- Real API integrations (Oura, Whoop, Tonal)
- User authentication and multi-user support
- Data visualization charts
- Export/import functionality
- iOS companion app

## Deployment

Configured for Vercel deployment:
```bash
vercel                 # Deploy preview
vercel --prod          # Deploy to production
```

Set `ANTHROPIC_API_KEY` in Vercel environment variables to enable Coach.

## Support

- Primary repo: https://github.com/gautamarora/golden-halo
- Issues and feature requests via GitHub Issues
- License: Proprietary
