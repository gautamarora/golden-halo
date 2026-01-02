'use client';

import { useEffect, useState } from 'react';

interface DashboardData {
  training: {
    thisWeek: number;
    thisMonth: number;
    streak: number;
  };
  body: {
    weightTrend: number | null;
    bodyFatTrend: number | null;
  };
  health: {
    sleepAverage: number | null;
    rhrTrend: number | null;
  };
}

export default function Halo() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load dashboard:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400 dark:text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400 dark:text-gray-500">Failed to load dashboard</p>
      </div>
    );
  }

  return (
    <div className="px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Halo</h1>
        <p className="text-gray-500 dark:text-gray-400">Your fitness dashboard</p>
      </div>

      {/* Training Summary */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Training</h2>
        <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">This week</span>
            <span className="text-2xl font-semibold text-golden">
              {data.training.thisWeek}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">This month</span>
            <span className="text-2xl font-semibold text-gray-900 dark:text-white">
              {data.training.thisMonth}
            </span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">Streak</span>
            <span className="text-2xl font-semibold text-golden">
              {data.training.streak} {data.training.streak === 1 ? 'week' : 'weeks'}
            </span>
          </div>
        </div>
      </section>

      {/* Body Trends */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Body</h2>
        <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Weight (30d avg)</span>
            <span className="text-2xl font-semibold text-gray-900 dark:text-white">
              {data.body.weightTrend ? `${data.body.weightTrend} lbs` : '—'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Body fat % (30d avg)</span>
            <span className="text-2xl font-semibold text-gray-900 dark:text-white">
              {data.body.bodyFatTrend ? `${data.body.bodyFatTrend}%` : '—'}
            </span>
          </div>
        </div>
      </section>

      {/* Health Signals */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Health</h2>
        <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Sleep (7d avg)</span>
            <span className="text-2xl font-semibold text-gray-900 dark:text-white">
              {data.health.sleepAverage ? `${data.health.sleepAverage}h` : '—'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">RHR (7d avg)</span>
            <span className="text-2xl font-semibold text-gray-900 dark:text-white">
              {data.health.rhrTrend ? `${data.health.rhrTrend} bpm` : '—'}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
