'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Activity, BlockStatus, Goal, PlannerState, TimeBlock } from './types';
import { EMPTY_STATE, loadState, newId, saveState } from './storage';
import { findNextAvailableSlot, findWeekFillSlots } from './scheduling';

interface PlannerContextValue {
  state: PlannerState;
  hydrated: boolean;
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'archived'>) => Goal;
  updateGoal: (id: string, patch: Partial<Goal>) => void;
  archiveGoal: (id: string) => void;
  restoreGoal: (id: string) => void;
  addActivity: (activity: Omit<Activity, 'id' | 'createdAt' | 'archived'>) => Activity;
  updateActivity: (id: string, patch: Partial<Activity>) => void;
  archiveActivity: (id: string) => void;
  restoreActivity: (id: string) => void;
  addBlock: (block: Omit<TimeBlock, 'id' | 'createdAt' | 'status' | 'rescheduledToId' | 'remindedAt'>) => TimeBlock;
  updateBlock: (id: string, patch: Partial<TimeBlock>) => void;
  setBlockStatus: (id: string, status: BlockStatus) => void;
  deleteBlock: (id: string) => void;
  markReminded: (id: string) => void;
  autoFillWeek: (activityId: string, weekDates: string[]) => number;
  loadExampleData: () => void;
  resetAll: () => void;
  exportData: () => string;
  importData: (json: string) => boolean;
}

const PlannerContext = createContext<PlannerContextValue | null>(null);

export function PlannerProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PlannerState>(EMPTY_STATE);
  const [hydrated, setHydrated] = useState(false);

  // Loading persisted state must happen client-side only (localStorage isn't available
  // during SSR), so the initial render always matches the server's empty state and this
  // effect syncs in the real, persisted state right after mount.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(loadState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveState(state);
  }, [state, hydrated]);

  const addGoal = useCallback((goal: Omit<Goal, 'id' | 'createdAt' | 'archived'>) => {
    const newGoal: Goal = { ...goal, id: newId(), createdAt: new Date().toISOString(), archived: false };
    setState((s) => ({ ...s, goals: [...s.goals, newGoal] }));
    return newGoal;
  }, []);

  const updateGoal = useCallback((id: string, patch: Partial<Goal>) => {
    setState((s) => ({ ...s, goals: s.goals.map((g) => (g.id === id ? { ...g, ...patch } : g)) }));
  }, []);

  const archiveGoal = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      goals: s.goals.map((g) => (g.id === id ? { ...g, archived: true } : g)),
      activities: s.activities.map((a) => (a.goalId === id ? { ...a, archived: true } : a)),
    }));
  }, []);

  const restoreGoal = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      goals: s.goals.map((g) => (g.id === id ? { ...g, archived: false } : g)),
      activities: s.activities.map((a) => (a.goalId === id ? { ...a, archived: false } : a)),
    }));
  }, []);

  const addActivity = useCallback((activity: Omit<Activity, 'id' | 'createdAt' | 'archived'>) => {
    const newActivity: Activity = { ...activity, id: newId(), createdAt: new Date().toISOString(), archived: false };
    setState((s) => ({ ...s, activities: [...s.activities, newActivity] }));
    return newActivity;
  }, []);

  const updateActivity = useCallback((id: string, patch: Partial<Activity>) => {
    setState((s) => ({ ...s, activities: s.activities.map((a) => (a.id === id ? { ...a, ...patch } : a)) }));
  }, []);

  const archiveActivity = useCallback((id: string) => {
    setState((s) => ({ ...s, activities: s.activities.map((a) => (a.id === id ? { ...a, archived: true } : a)) }));
  }, []);

  const restoreActivity = useCallback((id: string) => {
    setState((s) => ({ ...s, activities: s.activities.map((a) => (a.id === id ? { ...a, archived: false } : a)) }));
  }, []);

  const addBlock = useCallback((block: Omit<TimeBlock, 'id' | 'createdAt' | 'status' | 'rescheduledToId' | 'remindedAt'>) => {
    const newBlock: TimeBlock = {
      ...block,
      id: newId(),
      status: 'planned',
      rescheduledToId: null,
      remindedAt: null,
      createdAt: new Date().toISOString(),
    };
    setState((s) => ({ ...s, blocks: [...s.blocks, newBlock] }));
    return newBlock;
  }, []);

  const updateBlock = useCallback((id: string, patch: Partial<TimeBlock>) => {
    setState((s) => ({ ...s, blocks: s.blocks.map((b) => (b.id === id ? { ...b, ...patch } : b)) }));
  }, []);

  const deleteBlock = useCallback((id: string) => {
    setState((s) => ({ ...s, blocks: s.blocks.filter((b) => b.id !== id) }));
  }, []);

  const markReminded = useCallback((id: string) => {
    setState((s) => ({ ...s, blocks: s.blocks.map((b) => (b.id === id ? { ...b, remindedAt: new Date().toISOString() } : b)) }));
  }, []);

  const setBlockStatus = useCallback((id: string, status: BlockStatus) => {
    setState((s) => {
      const block = s.blocks.find((b) => b.id === id);
      if (!block) return s;
      let blocks = s.blocks.map((b) => (b.id === id ? { ...b, status } : b));

      if (status === 'skipped') {
        const activity = s.activities.find((a) => a.id === block.activityId);
        if (activity && activity.isHabit) {
          const slot = findNextAvailableSlot({ ...s, blocks }, activity, block.date, block.startTime, block.id);
          if (slot) {
            const rescheduled: TimeBlock = {
              id: newId(),
              activityId: block.activityId,
              date: slot.date,
              startTime: slot.startTime,
              durationMinutes: block.durationMinutes,
              status: 'planned',
              rescheduledToId: null,
              remindedAt: null,
              createdAt: new Date().toISOString(),
            };
            blocks = blocks.map((b) => (b.id === id ? { ...b, rescheduledToId: rescheduled.id } : b));
            blocks = [...blocks, rescheduled];
          }
        }
      }
      return { ...s, blocks };
    });
  }, []);

  // Reads `state` directly (rather than the functional setState form) because it needs to
  // return the number of blocks it placed synchronously — the functional updater form only
  // runs during React's next render, too late for a return value the caller can use immediately.
  const autoFillWeek = useCallback(
    (activityId: string, weekDates: string[]): number => {
      const activity = state.activities.find((a) => a.id === activityId);
      if (!activity || !activity.isHabit || !activity.targetPerWeek) return 0;
      const current = state.blocks.filter(
        (b) => b.activityId === activityId && weekDates.includes(b.date) && b.status !== 'skipped' && b.status !== 'rescheduled'
      ).length;
      const remaining = activity.targetPerWeek - current;
      if (remaining <= 0) return 0;
      const slots = findWeekFillSlots(state, activity, weekDates, remaining);
      if (slots.length === 0) return 0;
      const newBlocks: TimeBlock[] = slots.map((slot) => ({
        id: newId(),
        activityId,
        date: slot.date,
        startTime: slot.startTime,
        durationMinutes: activity.durationMinutes,
        status: 'planned',
        rescheduledToId: null,
        remindedAt: null,
        createdAt: new Date().toISOString(),
      }));
      setState((s) => ({ ...s, blocks: [...s.blocks, ...newBlocks] }));
      return slots.length;
    },
    [state]
  );

  const loadExampleData = useCallback(() => {
    const today = new Date();
    const iso = (offset: number, base: Date = today) => {
      const d = new Date(base);
      d.setDate(d.getDate() + offset);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));

    const g1: Goal = { id: newId(), title: 'Get fit', description: 'Build a sustainable exercise habit.', color: '#059669', createdAt: new Date().toISOString(), archived: false };
    const g2: Goal = { id: newId(), title: 'Learn Spanish', description: 'Conversational by end of year.', color: '#6366f1', createdAt: new Date().toISOString(), archived: false };
    const g3: Goal = { id: newId(), title: 'Write a book', description: 'First draft of the novel.', color: '#d97706', createdAt: new Date().toISOString(), archived: false };

    const a1: Activity = { id: newId(), goalId: g1.id, title: 'Gym session', durationMinutes: 60, isHabit: true, targetPerWeek: 3, createdAt: new Date().toISOString(), archived: false };
    const a2: Activity = { id: newId(), goalId: g2.id, title: 'Duolingo + flashcards', durationMinutes: 30, isHabit: true, targetPerWeek: 5, createdAt: new Date().toISOString(), archived: false };
    const a3: Activity = { id: newId(), goalId: g3.id, title: 'Writing session', durationMinutes: 45, isHabit: true, targetPerWeek: 4, createdAt: new Date().toISOString(), archived: false };

    const blocks: TimeBlock[] = [];
    const addBlk = (activityId: string, date: string, startTime: string, durationMinutes: number, status: BlockStatus = 'planned') => {
      blocks.push({ id: newId(), activityId, date, startTime, durationMinutes, status, rescheduledToId: null, remindedAt: null, createdAt: new Date().toISOString() });
    };

    addBlk(a1.id, iso(0, monday), '07:00', 60, 'done');
    addBlk(a1.id, iso(2, monday), '07:00', 60, 'done');
    addBlk(a1.id, iso(4, monday), '07:00', 60, 'planned');
    addBlk(a2.id, iso(0, monday), '19:00', 30, 'done');
    addBlk(a2.id, iso(1, monday), '19:00', 30, 'done');
    addBlk(a2.id, iso(2, monday), '19:00', 30, 'skipped');
    addBlk(a2.id, iso(3, monday), '19:00', 30, 'planned');
    addBlk(a2.id, iso(4, monday), '19:00', 30, 'planned');
    addBlk(a3.id, iso(1, monday), '20:00', 45, 'done');
    addBlk(a3.id, iso(3, monday), '20:00', 45, 'planned');
    addBlk(a3.id, iso(5, monday), '10:00', 45, 'planned');

    setState({ goals: [g1, g2, g3], activities: [a1, a2, a3], blocks });
  }, []);

  const resetAll = useCallback(() => setState(EMPTY_STATE), []);

  const exportData = useCallback(() => JSON.stringify(state, null, 2), [state]);

  const importData = useCallback((json: string): boolean => {
    let parsed: unknown;
    try {
      parsed = JSON.parse(json);
    } catch {
      return false;
    }
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      !Array.isArray((parsed as PlannerState).goals) ||
      !Array.isArray((parsed as PlannerState).activities) ||
      !Array.isArray((parsed as PlannerState).blocks)
    ) {
      return false;
    }
    const next = parsed as PlannerState;
    setState({ goals: next.goals, activities: next.activities, blocks: next.blocks });
    return true;
  }, []);

  const value = useMemo<PlannerContextValue>(
    () => ({
      state,
      hydrated,
      addGoal,
      updateGoal,
      archiveGoal,
      restoreGoal,
      addActivity,
      updateActivity,
      archiveActivity,
      restoreActivity,
      addBlock,
      updateBlock,
      setBlockStatus,
      deleteBlock,
      markReminded,
      autoFillWeek,
      loadExampleData,
      resetAll,
      exportData,
      importData,
    }),
    [
      state,
      hydrated,
      addGoal,
      updateGoal,
      archiveGoal,
      restoreGoal,
      addActivity,
      updateActivity,
      archiveActivity,
      restoreActivity,
      addBlock,
      updateBlock,
      setBlockStatus,
      deleteBlock,
      markReminded,
      autoFillWeek,
      loadExampleData,
      resetAll,
      exportData,
      importData,
    ]
  );

  return <PlannerContext.Provider value={value}>{children}</PlannerContext.Provider>;
}

export function usePlanner(): PlannerContextValue {
  const ctx = useContext(PlannerContext);
  if (!ctx) throw new Error('usePlanner must be used within a PlannerProvider');
  return ctx;
}
