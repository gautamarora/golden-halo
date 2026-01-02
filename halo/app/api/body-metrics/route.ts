import { NextResponse } from 'next/server';
import { readData, writeData, BodyMetric } from '@/lib/data';

export async function GET() {
  try {
    const metrics = await readData<BodyMetric[]>('bodyMetrics.json');
    return NextResponse.json(metrics);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch body metrics' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const metrics = await readData<BodyMetric[]>('bodyMetrics.json');

    const newMetric: BodyMetric = {
      id: String(Date.now()),
      date: body.date,
      weight: body.weight,
      bodyFat: body.bodyFat,
      source: 'manual',
    };

    metrics.unshift(newMetric);
    await writeData('bodyMetrics.json', metrics);

    return NextResponse.json(newMetric, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create body metric' }, { status: 500 });
  }
}
