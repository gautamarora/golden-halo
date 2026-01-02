import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

export async function readData<T>(filename: string): Promise<T> {
  const filePath = path.join(DATA_DIR, filename);
  try {
    const fileContent = await fs.promises.readFile(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return [] as T;
  }
}

export async function writeData<T>(filename: string, data: T): Promise<void> {
  const filePath = path.join(DATA_DIR, filename);
  try {
    await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    throw error;
  }
}

// Type definitions
export interface Workout {
  id: string;
  date: string;
  type: string;
  duration: number;
  note?: string;
  source: string;
}

export interface BodyMetric {
  id: string;
  date: string;
  weight?: number;
  bodyFat?: number;
  source: string;
}

export interface Goal {
  id: string;
  title: string;
  type: 'training' | 'body' | 'health';
  target: number;
  current: number;
  unit: string;
  period: 'monthly' | 'annual';
  startDate: string;
  endDate: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  content: string;
  tags: string[];
}

export interface OuraData {
  id: string;
  date: string;
  sleepDuration: number;
  restingHeartRate: number;
  hrv: number;
  source: string;
}

export interface WhoopData {
  id: string;
  date: string;
  strain: number;
  recovery: number;
  source: string;
}

export interface TonalData {
  id: string;
  date: string;
  workoutType: string;
  duration: number;
  totalVolume: number;
  source: string;
}
