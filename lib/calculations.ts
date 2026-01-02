import { Workout, BodyMetric, OuraData } from './data';

// Calculate training streak (weeks)
export function calculateStreak(workouts: Workout[]): number {
  if (workouts.length === 0) return 0;

  const MIN_WORKOUTS_PER_WEEK = 3;
  const sortedWorkouts = [...workouts].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const today = new Date();
  const weeks: Map<string, number> = new Map();

  // Group workouts by week
  sortedWorkouts.forEach(workout => {
    const workoutDate = new Date(workout.date);
    const weekStart = getWeekStart(workoutDate);
    const weekKey = weekStart.toISOString().split('T')[0];
    weeks.set(weekKey, (weeks.get(weekKey) || 0) + 1);
  });

  // Check streak from current week backwards
  let streak = 0;
  let checkDate = getWeekStart(today);

  while (true) {
    const weekKey = checkDate.toISOString().split('T')[0];
    const workoutsInWeek = weeks.get(weekKey) || 0;

    if (workoutsInWeek >= MIN_WORKOUTS_PER_WEEK) {
      streak++;
      // Move to previous week
      checkDate = new Date(checkDate.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else {
      break;
    }
  }

  return streak;
}

// Get the start of the week (Monday)
function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(d.setDate(diff));
}

// Calculate workouts in current period
export function getWorkoutsInPeriod(workouts: Workout[], days: number): number {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  return workouts.filter(w => new Date(w.date) >= cutoffDate).length;
}

// Calculate 30-day trend for body metrics
export function calculateTrend(metrics: BodyMetric[], field: 'weight' | 'bodyFat'): number | null {
  const days = 30;
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const recentMetrics = metrics
    .filter(m => new Date(m.date) >= cutoffDate && m[field] !== undefined)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (recentMetrics.length === 0) return null;

  // Calculate simple moving average
  const sum = recentMetrics.reduce((acc, m) => acc + (m[field] || 0), 0);
  return Number((sum / recentMetrics.length).toFixed(1));
}

// Calculate 7-day average for sleep
export function calculateSleepAverage(ouraData: OuraData[]): number | null {
  const days = 7;
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const recentData = ouraData
    .filter(d => new Date(d.date) >= cutoffDate)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (recentData.length === 0) return null;

  const sum = recentData.reduce((acc, d) => acc + d.sleepDuration, 0);
  return Number((sum / recentData.length).toFixed(1));
}

// Calculate resting heart rate trend (7-day average)
export function calculateRHRTrend(ouraData: OuraData[]): number | null {
  const days = 7;
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const recentData = ouraData
    .filter(d => new Date(d.date) >= cutoffDate)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (recentData.length === 0) return null;

  const sum = recentData.reduce((acc, d) => acc + d.restingHeartRate, 0);
  return Math.round(sum / recentData.length);
}
