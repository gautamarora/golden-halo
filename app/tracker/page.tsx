'use client';

import { useEffect, useState } from 'react';

interface Workout {
  id: string;
  date: string;
  type: string;
  duration: number;
  note?: string;
  source: string;
}

const APP_SOURCES = ['Oura', 'Whoop', 'Tonal', 'Pvolve', 'Other'];

export default function Tracker() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newWorkout, setNewWorkout] = useState({
    date: new Date().toISOString().split('T')[0],
    type: '',
    duration: 60,
    note: '',
    source: 'Other',
  });

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = () => {
    fetch('/api/workouts')
      .then(res => res.json())
      .then(data => {
        setWorkouts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load workouts:', err);
        setLoading(false);
      });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newWorkout),
      });

      if (response.ok) {
        setShowAddForm(false);
        setNewWorkout({
          date: new Date().toISOString().split('T')[0],
          type: '',
          duration: 60,
          note: '',
          source: 'Other',
        });
        loadWorkouts();
      }
    } catch (err) {
      console.error('Failed to add workout:', err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400 dark:text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="px-6 py-8">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Tracker</h1>
          <p className="text-gray-500 dark:text-gray-400">Log workouts and track consistency</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-golden text-white px-4 py-2 rounded-full font-medium hover:bg-golden-dark transition-colors"
        >
          {showAddForm ? 'Cancel' : '+ Add'}
        </button>
      </div>

      {/* Add Workout Form */}
      {showAddForm && (
        <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Log Workout</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date
              </label>
              <input
                type="date"
                value={newWorkout.date}
                onChange={(e) => setNewWorkout({ ...newWorkout, date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-golden"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Source
              </label>
              <div className="grid grid-cols-3 gap-2">
                {APP_SOURCES.map(source => (
                  <button
                    key={source}
                    type="button"
                    onClick={() => setNewWorkout({ ...newWorkout, source })}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      newWorkout.source === source
                        ? 'bg-golden text-white'
                        : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-golden'
                    }`}
                  >
                    {source}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type
              </label>
              <input
                type="text"
                value={newWorkout.type}
                onChange={(e) => setNewWorkout({ ...newWorkout, type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-golden"
                placeholder="e.g., Strength Training, Run, HIIT"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Duration (minutes)
              </label>
              <input
                type="number"
                value={newWorkout.duration}
                onChange={(e) => setNewWorkout({ ...newWorkout, duration: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-golden"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Note (optional)
              </label>
              <textarea
                value={newWorkout.note}
                onChange={(e) => setNewWorkout({ ...newWorkout, note: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-golden"
                rows={3}
                placeholder="How did it go?"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-golden text-white py-3 rounded-lg font-medium hover:bg-golden-dark transition-colors"
            >
              Save Workout
            </button>
          </form>
        </div>
      )}

      {/* Workouts List */}
      <div className="space-y-3">
        {workouts.map((workout) => (
          <div key={workout.id} className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {workout.type || 'Workout'}
                  </h3>
                  <span className="text-xs px-2 py-0.5 bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded">
                    {workout.source}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(workout.date)}</p>
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">{workout.duration} min</span>
            </div>
            {workout.note && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{workout.note}</p>
            )}
          </div>
        ))}

        {workouts.length === 0 && !showAddForm && (
          <div className="text-center py-12">
            <p className="text-gray-400 dark:text-gray-500">No workouts logged yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
