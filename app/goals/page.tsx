'use client';

import { useEffect, useState } from 'react';

interface Goal {
  id: string;
  title: string;
  type: 'training' | 'body' | 'health';
  target: number;
  current: number;
  unit: string;
  period: 'monthly' | 'annual';
  startDate: string;
  endDate: string;
  progress?: number;
  status?: string;
}

export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(data => {
        setGoals(data.goals || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load goals:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'on-track':
        return 'text-golden';
      case 'off-track':
        return 'text-gray-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'on-track':
        return 'On track';
      case 'off-track':
        return 'Off track';
      default:
        return 'Tracking';
    }
  };

  return (
    <div className="px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Goals</h1>
        <p className="text-gray-500">Track your fitness objectives</p>
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        {goals.map((goal) => (
          <div key={goal.id} className="bg-gray-50 rounded-2xl p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {goal.title}
                </h3>
                <p className="text-sm text-gray-500 capitalize">
                  {goal.period} • {goal.type}
                </p>
              </div>
              <span className={`text-sm font-medium ${getStatusColor(goal.status)}`}>
                {getStatusText(goal.status)}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Progress</span>
                <span className="text-sm font-medium text-gray-900">
                  {goal.progress || 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-golden rounded-full h-2 transition-all"
                  style={{ width: `${Math.min(goal.progress || 0, 100)}%` }}
                />
              </div>
            </div>

            {/* Current vs Target */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <div>
                <p className="text-xs text-gray-500 mb-1">Current</p>
                <p className="text-lg font-semibold text-gray-900">
                  {goal.current} {goal.unit}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 mb-1">Target</p>
                <p className="text-lg font-semibold text-gray-900">
                  {goal.target} {goal.unit}
                </p>
              </div>
            </div>
          </div>
        ))}

        {goals.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No goals set yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
