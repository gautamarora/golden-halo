'use client';

import { useEffect, useState } from 'react';

interface JournalEntry {
  id: string;
  date: string;
  content: string;
  tags: string[];
}

const AVAILABLE_TAGS = ['Food', 'Training', 'Mood', 'Recovery'];

export default function Journal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    content: '',
    tags: [] as string[],
  });

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = () => {
    fetch('/api/journal')
      .then(res => res.json())
      .then(data => {
        setEntries(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load journal entries:', err);
        setLoading(false);
      });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newEntry.content.trim()) {
      return;
    }

    try {
      const response = await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEntry),
      });

      if (response.ok) {
        setShowAddForm(false);
        setNewEntry({
          date: new Date().toISOString().split('T')[0],
          content: '',
          tags: [],
        });
        loadEntries();
      }
    } catch (err) {
      console.error('Failed to add journal entry:', err);
    }
  };

  const toggleTag = (tag: string) => {
    setNewEntry(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
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
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Journal</h1>
          <p className="text-gray-500">Capture context for your training</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-golden text-white px-4 py-2 rounded-full font-medium hover:bg-golden-dark transition-colors"
        >
          {showAddForm ? 'Cancel' : '+ Add'}
        </button>
      </div>

      {/* Add Entry Form */}
      {showAddForm && (
        <div className="bg-gray-50 rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">New Entry</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                value={newEntry.date}
                onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Entry
              </label>
              <textarea
                value={newEntry.content}
                onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden"
                rows={5}
                placeholder="How are you feeling? What happened today?"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (optional)
              </label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_TAGS.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      newEntry.tags.includes(tag)
                        ? 'bg-golden text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:border-golden'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-golden text-white py-3 rounded-lg font-medium hover:bg-golden-dark transition-colors"
            >
              Save Entry
            </button>
          </form>
        </div>
      )}

      {/* Entries List */}
      <div className="space-y-4">
        {entries.map((entry) => (
          <div key={entry.id} className="bg-gray-50 rounded-xl p-5">
            <div className="flex justify-between items-start mb-3">
              <p className="text-sm font-medium text-gray-500">
                {formatDate(entry.date)}
              </p>
              {entry.tags.length > 0 && (
                <div className="flex gap-2">
                  {entry.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 bg-white rounded-full text-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
              {entry.content}
            </p>
          </div>
        ))}

        {entries.length === 0 && !showAddForm && (
          <div className="text-center py-12">
            <p className="text-gray-400">No journal entries yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
