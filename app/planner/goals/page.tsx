'use client';

import { useState } from 'react';
import { usePlanner } from '@/lib/planner/store';
import { Activity, Goal } from '@/lib/planner/types';
import { computeStreak, computeWeekStats, getWeekDates, startOfWeek, todayStr } from '@/lib/planner/scheduling';
import GoalCard from '@/components/planner/GoalCard';
import GoalModal from '@/components/planner/GoalModal';
import ActivityModal from '@/components/planner/ActivityModal';
import { Plus } from 'lucide-react';

export default function GoalsPage() {
  const { state, hydrated, addGoal, updateGoal, archiveGoal, addActivity, updateActivity, archiveActivity } = usePlanner();
  const [editingGoal, setEditingGoal] = useState<Goal | 'new' | null>(null);
  const [activityFor, setActivityFor] = useState<{ goalId: string; activity?: Activity } | null>(null);

  if (!hydrated) return null;

  const weekDates = getWeekDates(startOfWeek(todayStr()));
  const weekStats = computeWeekStats(state, weekDates);
  const streaks = new Map(state.activities.map((a) => [a.id, computeStreak(state.blocks, a.id)]));
  const activeGoals = state.goals.filter((g) => !g.archived);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: 4 }}>Goals</h1>
          <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>Break each goal into activities you can actually schedule.</p>
        </div>
        <button
          onClick={() => setEditingGoal('new')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#6366f1', color: '#fff', padding: '10px 18px', borderRadius: 8, fontSize: '0.88rem', fontWeight: 700, border: 'none', cursor: 'pointer' }}
        >
          <Plus size={16} /> New goal
        </button>
      </div>

      {activeGoals.length === 0 ? (
        <div style={{ padding: 40, border: '1px dashed #d1d5db', borderRadius: 10, textAlign: 'center', color: '#9ca3af' }}>
          No goals yet. Create one to get started.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 18 }}>
          {activeGoals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              activities={state.activities.filter((a) => a.goalId === goal.id && !a.archived)}
              weekStat={weekStats.find((s) => s.goalId === goal.id)}
              streaks={streaks}
              onEditGoal={() => setEditingGoal(goal)}
              onArchiveGoal={() => archiveGoal(goal.id)}
              onAddActivity={() => setActivityFor({ goalId: goal.id })}
              onEditActivity={(activity) => setActivityFor({ goalId: goal.id, activity })}
              onArchiveActivity={(id) => archiveActivity(id)}
            />
          ))}
        </div>
      )}

      {editingGoal && (
        <GoalModal
          initial={editingGoal === 'new' ? undefined : editingGoal}
          onClose={() => setEditingGoal(null)}
          onSave={(data) => {
            if (editingGoal === 'new') addGoal(data);
            else updateGoal(editingGoal.id, data);
            setEditingGoal(null);
          }}
        />
      )}

      {activityFor && (
        <ActivityModal
          initial={activityFor.activity}
          onClose={() => setActivityFor(null)}
          onSave={(data) => {
            if (activityFor.activity) updateActivity(activityFor.activity.id, data);
            else addActivity({ ...data, goalId: activityFor.goalId });
            setActivityFor(null);
          }}
        />
      )}
    </div>
  );
}
