import { NextResponse } from 'next/server';
import { readData, writeData, Workout } from '@/lib/data';

export async function GET() {
  try {
    const workouts = await readData<Workout[]>('workouts.json');
    return NextResponse.json(workouts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch workouts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const workouts = await readData<Workout[]>('workouts.json');

    const newWorkout: Workout = {
      id: String(Date.now()),
      date: body.date,
      type: body.type,
      duration: body.duration,
      note: body.note,
      source: 'manual',
    };

    workouts.unshift(newWorkout);
    await writeData('workouts.json', workouts);

    return NextResponse.json(newWorkout, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create workout' }, { status: 500 });
  }
}
