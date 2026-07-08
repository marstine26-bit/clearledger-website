export type BlockStatus = 'planned' | 'done' | 'skipped' | 'rescheduled';

export interface Goal {
  id: string;
  title: string;
  description: string;
  color: string;
  createdAt: string;
  archived: boolean;
}

export interface Activity {
  id: string;
  goalId: string;
  title: string;
  durationMinutes: number;
  isHabit: boolean;
  targetPerWeek: number | null;
  createdAt: string;
  archived: boolean;
}

export interface TimeBlock {
  id: string;
  activityId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM (24h)
  durationMinutes: number;
  status: BlockStatus;
  rescheduledToId: string | null;
  remindedAt: string | null;
  createdAt: string;
}

export interface PlannerState {
  goals: Goal[];
  activities: Activity[];
  blocks: TimeBlock[];
}

export const GOAL_COLORS = [
  '#6366f1', // indigo
  '#059669', // emerald
  '#d97706', // amber
  '#dc2626', // red
  '#2563eb', // blue
  '#7c3aed', // violet
  '#0891b2', // cyan
  '#be185d', // pink
];
