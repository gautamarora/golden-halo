import { NextResponse } from 'next/server';
import { readData, Workout, BodyMetric, OuraData, Goal } from '@/lib/data';
import {
  calculateStreak,
  getWorkoutsInPeriod,
  calculateTrend,
  calculateSleepAverage,
  calculateRHRTrend
} from '@/lib/calculations';

export async function GET() {
  try {
    const workouts = await readData<Workout[]>('workouts.json');
    const bodyMetrics = await readData<BodyMetric[]>('bodyMetrics.json');
    const ouraData = await readData<OuraData[]>('integrations/oura.json');
    const goals = await readData<Goal[]>('goals.json');

    const dashboard = {
      training: {
        thisWeek: getWorkoutsInPeriod(workouts, 7),
        thisMonth: getWorkoutsInPeriod(workouts, 30),
        streak: calculateStreak(workouts),
      },
      body: {
        weightTrend: calculateTrend(bodyMetrics, 'weight'),
        bodyFatTrend: calculateTrend(bodyMetrics, 'bodyFat'),
      },
      health: {
        sleepAverage: calculateSleepAverage(ouraData),
        rhrTrend: calculateRHRTrend(ouraData),
      },
      goals: goals.map(goal => {
        const progress = goal.target > 0
          ? Math.round((goal.current / goal.target) * 100)
          : 0;

        return {
          ...goal,
          progress,
          status: progress >= 100 ? 'completed' : progress >= 75 ? 'on-track' : 'off-track',
        };
      }),
    };

    return NextResponse.json(dashboard);
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
