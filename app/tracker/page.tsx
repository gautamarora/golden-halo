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

const WORKOUT_TYPES = ['Lift', 'Run', 'Conditioning', 'Yoga', 'Cardio', 'Sport'];

export default function Tracker() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newWorkout, setNewWorkout] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'Lift',
    duration: 60,
    note: '',
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
          type: 'Lift',
          duration: 60,
          note: '',
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
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="px-6 py-8">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Tracker</h1>
          <p className="text-gray-500">Log workouts and track consistency</p>
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
        <div className="bg-gray-50 rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Log Workout</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                value={newWorkout.date}
                onChange={(e) => setNewWorkout({ ...newWorkout, date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {WORKOUT_TYPES.map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setNewWorkout({ ...newWorkout, type })}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      newWorkout.type === type
                        ? 'bg-golden text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:border-golden'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (minutes)
              </label>
              <input
                type="number"
                value={newWorkout.duration}
                onChange={(e) => setNewWorkout({ ...newWorkout, duration: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Note (optional)
              </label>
              <textarea
                value={newWorkout.note}
                onChange={(e) => setNewWorkout({ ...newWorkout, note: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden"
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
          <div key={workout.id} className="bg-gray-50 rounded-xl p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-gray-900">{workout.type}</h3>
                <p className="text-sm text-gray-500">{formatDate(workout.date)}</p>
              </div>
              <span className="text-sm text-gray-600">{workout.duration} min</span>
            </div>
            {workout.note && (
              <p className="text-sm text-gray-600 mt-2">{workout.note}</p>
            )}
          </div>
        ))}

        {workouts.length === 0 && !showAddForm && (
          <div className="text-center py-12">
            <p className="text-gray-400">No workouts logged yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
