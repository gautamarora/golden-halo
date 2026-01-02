import { NextResponse } from 'next/server';
import { readData, writeData, Goal } from '@/lib/data';

export async function GET() {
  try {
    const goals = await readData<Goal[]>('goals.json');
    return NextResponse.json(goals);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch goals' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const goals = await readData<Goal[]>('goals.json');

    const newGoal: Goal = {
      id: String(Date.now()),
      title: body.title,
      type: body.type,
      target: body.target,
      current: body.current,
      unit: body.unit,
      period: body.period,
      startDate: body.startDate,
      endDate: body.endDate,
    };

    goals.push(newGoal);
    await writeData('goals.json', goals);

    return NextResponse.json(newGoal, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create goal' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const goals = await readData<Goal[]>('goals.json');

    const index = goals.findIndex(g => g.id === body.id);
    if (index === -1) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
    }

    goals[index] = { ...goals[index], ...body };
    await writeData('goals.json', goals);

    return NextResponse.json(goals[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update goal' }, { status: 500 });
  }
}
