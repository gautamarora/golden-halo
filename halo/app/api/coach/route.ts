import { NextResponse } from 'next/server';
import { readData, Workout, BodyMetric, JournalEntry, OuraData } from '@/lib/data';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Load all relevant data for context
    const workouts = await readData<Workout[]>('workouts.json');
    const bodyMetrics = await readData<BodyMetric[]>('bodyMetrics.json');
    const journalEntries = await readData<JournalEntry[]>('journal.json');
    const ouraData = await readData<OuraData[]>('integrations/oura.json');

    // Build context for the AI
    const context = buildContext(workouts, bodyMetrics, journalEntries, ouraData);

    // Check if API key is configured
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        response: "I'm not configured yet. Please add your ANTHROPIC_API_KEY to the .env.local file to enable AI coaching features.",
      });
    }

    // Call Anthropic API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        system: getSystemPrompt(context),
        messages: [
          {
            role: 'user',
            content: message,
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Anthropic API error:', error);
      return NextResponse.json(
        { error: 'Failed to get AI response' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const aiResponse = data.content[0].text;

    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error('Coach API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function buildContext(
  workouts: Workout[],
  bodyMetrics: BodyMetric[],
  journalEntries: JournalEntry[],
  ouraData: OuraData[]
): string {
  const recentWorkouts = workouts.slice(0, 10);
  const recentMetrics = bodyMetrics.slice(0, 5);
  const recentJournal = journalEntries.slice(0, 5);
  const recentOura = ouraData.slice(0, 7);

  return `
Recent Workouts (last 10):
${recentWorkouts.map(w => `- ${w.date}: ${w.type}, ${w.duration}min${w.note ? ` (${w.note})` : ''}`).join('\n')}

Recent Body Metrics (last 5):
${recentMetrics.map(m => `- ${m.date}: Weight: ${m.weight}lbs, Body Fat: ${m.bodyFat}%`).join('\n')}

Recent Sleep Data (last 7 days):
${recentOura.map(o => `- ${o.date}: Sleep: ${o.sleepDuration}h, RHR: ${o.restingHeartRate}bpm, HRV: ${o.hrv}`).join('\n')}

Recent Journal Entries (last 5):
${recentJournal.map(j => `- ${j.date} [${j.tags.join(', ')}]: ${j.content}`).join('\n')}
  `.trim();
}

function getSystemPrompt(context: string): string {
  return `You are a fitness analyst for Golden Halo, an AI-powered fitness dashboard. Your role is to provide calm, factual, analytical insights about the user's fitness data.

Core principles:
- Be an analyst, not a cheerleader
- Provide factual observations and trends
- Use calm, non-judgmental language
- Never provide unsolicited advice or motivational language
- Focus on patterns and correlations in the data
- Reference specific data points when relevant

User's recent data:
${context}

When answering questions:
1. Look for patterns in the data
2. Provide specific, data-driven insights
3. Avoid speculation beyond what the data shows
4. Keep responses concise and focused
5. Use a professional, measured tone

Remember: You are helping the user understand their data, not coaching them on what to do.`;
}
