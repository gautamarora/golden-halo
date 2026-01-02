import { NextResponse } from 'next/server';
import { readData, writeData, JournalEntry } from '@/lib/data';

export async function GET() {
  try {
    const entries = await readData<JournalEntry[]>('journal.json');
    return NextResponse.json(entries);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch journal entries' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const entries = await readData<JournalEntry[]>('journal.json');

    const newEntry: JournalEntry = {
      id: String(Date.now()),
      date: body.date,
      content: body.content,
      tags: body.tags || [],
    };

    entries.unshift(newEntry);
    await writeData('journal.json', entries);

    return NextResponse.json(newEntry, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create journal entry' }, { status: 500 });
  }
}
