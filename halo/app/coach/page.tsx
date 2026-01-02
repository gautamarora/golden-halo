'use client';

import { useState } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Coach() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || loading) {
      return;
    }

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages(prev => [
          ...prev,
          { role: 'assistant', content: data.response },
        ]);
      } else {
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: 'Sorry, I encountered an error. Please try again.',
          },
        ]);
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const suggestedQuestions = [
    'Why did my weight stall this month?',
    'How has my training changed recently?',
    'What patterns do you see in my sleep data?',
    'How does my recovery correlate with training volume?',
  ];

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="px-6 py-8 border-b border-gray-200 bg-white">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Coach</h1>
        <p className="text-gray-500">Analyze your fitness data</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Ask me about your training
              </h2>
              <p className="text-gray-500">
                I can help you understand patterns and trends in your fitness data
              </p>
            </div>

            <div className="w-full max-w-md space-y-2">
              <p className="text-sm font-medium text-gray-600 mb-3">
                Suggested questions:
              </p>
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedQuestion(question)}
                  className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl text-sm text-gray-700 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                message.role === 'user'
                  ? 'bg-golden text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="whitespace-pre-wrap leading-relaxed">
                {message.content}
              </p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-900 px-4 py-3 rounded-2xl">
              <p className="text-gray-500">Analyzing...</p>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 bg-white px-6 py-4 pb-8">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your training data..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-golden"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-golden text-white px-6 py-3 rounded-full font-medium hover:bg-golden-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
