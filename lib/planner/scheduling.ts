import { Activity, PlannerState, TimeBlock } from './types';

export function pad2(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

export function todayStr(d: Date = new Date()): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export function nowTimeStr(d: Date = new Date()): string {
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

export function addDays(dateStr: string, n: number): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + n);
  return todayStr(dt);
}

export function weekdayIndex(dateStr: string): number {
  // Monday = 0 ... Sunday = 6
  const [y, m, d] = dateStr.split('-').map(Number);
  const dow = new Date(y, m - 1, d).getDay(); // Sun=0..Sat=6
  return (dow + 6) % 7;
}

export function startOfWeek(dateStr: string): string {
  return addDays(dateStr, -weekdayIndex(dateStr));
}

export function getWeekDates(weekStart: string): string[] {
  return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
}

export function formatDateLabel(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

export function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${pad2(m)} ${period}`;
}

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

export function minutesToTime(mins: number): string {
  const h = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  return `${pad2(h)}:${pad2(m)}`;
}

function blocksOverlap(aStart: number, aDur: number, bStart: number, bDur: number): boolean {
  const aEnd = aStart + aDur;
  const bEnd = bStart + bDur;
  return aStart < bEnd && bStart < aEnd;
}

const DAY_START = timeToMinutes('06:00');
const DAY_END = timeToMinutes('22:30');
const STEP = 30;

/** Finds the next open slot for an activity, starting the day after `fromDate`, preferring `preferredStart`. */
export function findNextAvailableSlot(
  state: PlannerState,
  activity: Activity,
  fromDate: string,
  preferredStart: string,
  excludeBlockId?: string
): { date: string; startTime: string } | null {
  const dur = activity.durationMinutes;
  for (let dayOffset = 1; dayOffset <= 14; dayOffset++) {
    const date = addDays(fromDate, dayOffset);
    const dayBlocks = state.blocks.filter(
      (b) => b.date === date && b.status !== 'skipped' && b.status !== 'rescheduled' && b.id !== excludeBlockId
    );
    const candidates: number[] = [timeToMinutes(preferredStart)];
    for (let t = DAY_START; t <= DAY_END - dur; t += STEP) candidates.push(t);
    for (const startMins of candidates) {
      if (startMins < DAY_START || startMins + dur > DAY_END) continue;
      const conflict = dayBlocks.some((b) => blocksOverlap(startMins, dur, timeToMinutes(b.startTime), b.durationMinutes));
      if (!conflict) return { date, startTime: minutesToTime(startMins) };
    }
  }
  return null;
}

/** Current consecutive-day streak for an activity, counting only days whose scheduled time has already passed. */
export function computeStreak(blocks: TimeBlock[], activityId: string, now: Date = new Date()): number {
  const today = todayStr(now);
  const nowMins = timeToMinutes(nowTimeStr(now));
  const relevant = blocks.filter((b) => {
    if (b.activityId !== activityId) return false;
    if (b.status === 'rescheduled') return false;
    if (b.date > today) return false;
    if (b.date === today && timeToMinutes(b.startTime) > nowMins) return false;
    return true;
  });
  const byDate = new Map<string, TimeBlock[]>();
  for (const b of relevant) {
    const list = byDate.get(b.date) ?? [];
    list.push(b);
    byDate.set(b.date, list);
  }
  const dates = Array.from(byDate.keys()).sort((a, b) => (a < b ? 1 : -1));
  let streak = 0;
  for (const date of dates) {
    const dayBlocks = byDate.get(date)!;
    const allDone = dayBlocks.every((b) => b.status === 'done');
    if (allDone) streak++;
    else break;
  }
  return streak;
}

export function isDueNow(block: TimeBlock, now: Date = new Date()): boolean {
  if (block.status !== 'planned') return false;
  const today = todayStr(now);
  if (block.date !== today) return false;
  const nowMins = timeToMinutes(nowTimeStr(now));
  const startMins = timeToMinutes(block.startTime);
  return nowMins >= startMins - 1 && nowMins <= startMins + 5;
}

/** Blocks still "on the books" for an activity this week (excludes skipped/rescheduled). */
export function computeActivityWeekCount(blocks: TimeBlock[], activityId: string, weekDates: string[]): number {
  return blocks.filter(
    (b) => b.activityId === activityId && weekDates.includes(b.date) && b.status !== 'skipped' && b.status !== 'rescheduled'
  ).length;
}

function mostCommonStartTime(blocks: TimeBlock[], activityId: string): string | null {
  const counts = new Map<string, number>();
  for (const b of blocks) {
    if (b.activityId !== activityId) continue;
    counts.set(b.startTime, (counts.get(b.startTime) ?? 0) + 1);
  }
  let best: string | null = null;
  let bestCount = 0;
  for (const [time, count] of counts) {
    if (count > bestCount) {
      best = time;
      bestCount = count;
    }
  }
  return best;
}

/**
 * Finds up to `count` open slots within `weekDates` for a habit that hasn't hit its
 * weekly target yet — one slot per day, skipping days already scheduled and days in the past.
 */
export function findWeekFillSlots(
  state: PlannerState,
  activity: Activity,
  weekDates: string[],
  count: number
): { date: string; startTime: string }[] {
  const today = todayStr();
  const used = new Set(
    state.blocks
      .filter((b) => b.activityId === activity.id && weekDates.includes(b.date) && b.status !== 'skipped' && b.status !== 'rescheduled')
      .map((b) => b.date)
  );
  const preferred = mostCommonStartTime(state.blocks, activity.id) ?? '08:00';
  const dur = activity.durationMinutes;
  const results: { date: string; startTime: string }[] = [];

  for (const date of weekDates) {
    if (results.length >= count) break;
    if (date < today || used.has(date)) continue;
    const dayBlocks = state.blocks.filter((b) => b.date === date && b.status !== 'skipped' && b.status !== 'rescheduled');
    const candidates: number[] = [timeToMinutes(preferred)];
    for (let t = DAY_START; t <= DAY_END - dur; t += STEP) candidates.push(t);
    for (const startMins of candidates) {
      if (startMins < DAY_START || startMins + dur > DAY_END) continue;
      const conflict = dayBlocks.some((b) => blocksOverlap(startMins, dur, timeToMinutes(b.startTime), b.durationMinutes));
      if (!conflict) {
        results.push({ date, startTime: minutesToTime(startMins) });
        break;
      }
    }
  }
  return results;
}

export interface WeekGoalStat {
  goalId: string;
  plannedMinutes: number;
  doneMinutes: number;
  skippedCount: number;
  doneCount: number;
  totalCount: number;
}

export function computeWeekStats(state: PlannerState, weekDates: string[]): WeekGoalStat[] {
  const activityToGoal = new Map(state.activities.map((a) => [a.id, a.goalId]));
  const stats = new Map<string, WeekGoalStat>();
  for (const goal of state.goals) {
    stats.set(goal.id, { goalId: goal.id, plannedMinutes: 0, doneMinutes: 0, skippedCount: 0, doneCount: 0, totalCount: 0 });
  }
  for (const block of state.blocks) {
    if (!weekDates.includes(block.date)) continue;
    if (block.status === 'rescheduled') continue;
    const goalId = activityToGoal.get(block.activityId);
    if (!goalId) continue;
    const s = stats.get(goalId);
    if (!s) continue;
    s.plannedMinutes += block.durationMinutes;
    s.totalCount += 1;
    if (block.status === 'done') {
      s.doneMinutes += block.durationMinutes;
      s.doneCount += 1;
    } else if (block.status === 'skipped') {
      s.skippedCount += 1;
    }
  }
  return Array.from(stats.values());
}
