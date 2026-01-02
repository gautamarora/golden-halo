# Golden Halo

A single AI health dashboard for fitness goals and tracking.

## Features

- **Halo Dashboard**: Executive summary of training, body metrics, and health signals
- **Goals**: Track monthly and annual fitness objectives
- **Tracker**: Log workouts and monitor training consistency with weekly streaks
- **Journal**: Capture context around training and recovery
- **Coach**: AI-powered fitness analyst (powered by Claude)

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.local.example .env.local
```

3. (Optional) Add your Anthropic API key to `.env.local` to enable the Coach feature:
```
ANTHROPIC_API_KEY=your_api_key_here
```

Get your API key from: https://console.anthropic.com/

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Data Management

All data is stored in JSON files in the `/data` directory:

- `workouts.json` - Training logs
- `bodyMetrics.json` - Weight and body composition data
- `goals.json` - Fitness goals
- `journal.json` - Journal entries
- `integrations/` - Data from connected devices (Oura, Whoop, Tonal)

You can manually edit these files to add, modify, or remove data.

## Tech Stack

- **Frontend**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS with custom California golden theme
- **Backend**: Next.js API routes
- **Database**: JSON files (PostgreSQL migration planned)
- **AI**: Anthropic Claude API

## Design Principles

- Signal over noise — trends > raw data
- Serious by default — no step counting, no wellness fluff
- Consistency > intensity — streaks are weekly and earned
- AI on demand — no unsolicited coaching or alerts
- Minimal surfaces — five tabs, no feature sprawl

## Project Structure

```
halo/
├── app/
│   ├── api/          # API routes
│   ├── coach/        # Coach screen
│   ├── goals/        # Goals screen
│   ├── journal/      # Journal screen
│   ├── tracker/      # Tracker screen
│   ├── layout.tsx    # Root layout with navigation
│   └── page.tsx      # Halo dashboard
├── components/       # React components
├── data/            # JSON data files
├── lib/             # Utilities and calculations
└── public/          # Static assets
```

## Business Logic

- **Streak Calculation**: Requires 3+ workouts per week to maintain streak
- **Weight/Body Fat Trends**: 30-day rolling average
- **Sleep Average**: 7-day rolling average
- **Resting Heart Rate**: 7-day rolling average

## Future Enhancements

- PostgreSQL database migration
- Real API integrations (Oura, Whoop, Tonal)
- User authentication
- Data visualization charts
- Goal auto-suggestions
- Export/import functionality
- iOS companion app

## Deployment

### Deploy to Vercel

This project is configured for easy deployment to Vercel:

1. **Install Vercel CLI** (if not already installed):
```bash
npm install -g vercel
```

2. **Deploy**:
```bash
vercel
```

Or simply push to GitHub and import the repository at [vercel.com](https://vercel.com).

3. **Set Environment Variables**:
   - In Vercel dashboard, go to Project Settings → Environment Variables
   - Add `ANTHROPIC_API_KEY` with your API key from [console.anthropic.com](https://console.anthropic.com/)
   - This enables the Coach feature

4. **Production deployment**:
```bash
vercel --prod
```

The app will be automatically deployed with each push to your main branch.

## License

Proprietary
