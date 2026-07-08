import { PlannerState } from './types';

const STORAGE_KEY = 'compass-planner-v1';

export const EMPTY_STATE: PlannerState = {
  goals: [],
  activities: [],
  blocks: [],
};

export function loadState(): PlannerState {
  if (typeof window === 'undefined') return EMPTY_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_STATE;
    const parsed = JSON.parse(raw);
    return {
      goals: parsed.goals ?? [],
      activities: parsed.activities ?? [],
      blocks: parsed.blocks ?? [],
    };
  } catch {
    return EMPTY_STATE;
  }
}

export function saveState(state: PlannerState) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage unavailable (private mode, quota) — fail silently, in-memory state still works
  }
}

export function newId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
