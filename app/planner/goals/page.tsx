'use client';

import { useState } from 'react';
import { usePlanner } from '@/lib/planner/store';
import { Activity, Goal } from '@/lib/planner/types';
import { computeActivityWeekCount, computeStreak, computeWeekStats, getWeekDates, startOfWeek, todayStr } from '@/lib/planner/scheduling';
import GoalCard from '@/components/planner/GoalCard';
import GoalModal from '@/components/planner/GoalModal';
import ActivityModal from '@/components/planner/ActivityModal';
import { Plus, Archive, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';

export default function GoalsPage() {
  const {
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
    autoFillWeek,
  } = usePlanner();
  const [editingGoal, setEditingGoal] = useState<Goal | 'new' | null>(null);
  const [activityFor, setActivityFor] = useState<{ goalId: string; activity?: Activity } | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [fillNotice, setFillNotice] = useState<string | null>(null);

  if (!hydrated) return null;

  const weekDates = getWeekDates(startOfWeek(todayStr()));
  const weekStats = computeWeekStats(state, weekDates);
  const streaks = new Map(state.activities.map((a) => [a.id, computeStreak(state.blocks, a.id)]));
  const weekCounts = new Map(state.activities.map((a) => [a.id, computeActivityWeekCount(state.blocks, a.id, weekDates)]));
  const activeGoals = state.goals.filter((g) => !g.archived);

  const archivedGoals = state.goals.filter((g) => g.archived);
  const archivedActivities = state.activities.filter((a) => a.archived && !state.goals.find((g) => g.id === a.goalId)?.archived);
  const archivedCount = archivedGoals.length + archivedActivities.length;

  const handleAutoFill = (activityId: string) => {
    const activity = state.activities.find((a) => a.id === activityId);
    const added = autoFillWeek(activityId, weekDates);
    if (added > 0) {
      setFillNotice(`Scheduled ${added} more ${activity?.title ?? 'session'}${added > 1 ? 's' : ''} this week.`);
    } else {
      setFillNotice(`Couldn't find an open slot this week for ${activity?.title ?? 'that activity'} — try the calendar directly.`);
    }
    setTimeout(() => setFillNotice(null), 4000);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, gap: 12, flexWrap: 'wrap' }}>
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

      {fillNotice && (
        <div style={{ marginBottom: 18, padding: '10px 16px', background: '#eef2ff', border: '1px solid #c7d2fe', borderRadius: 8, fontSize: '0.85rem', color: '#4338ca' }}>
          {fillNotice}
        </div>
      )}

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
              weekCounts={weekCounts}
              onEditGoal={() => setEditingGoal(goal)}
              onArchiveGoal={() => archiveGoal(goal.id)}
              onAddActivity={() => setActivityFor({ goalId: goal.id })}
              onEditActivity={(activity) => setActivityFor({ goalId: goal.id, activity })}
              onArchiveActivity={(id) => archiveActivity(id)}
              onAutoFillActivity={handleAutoFill}
            />
          ))}
        </div>
      )}

      {archivedCount > 0 && (
        <div style={{ marginTop: 32 }}>
          <button
            onClick={() => setShowArchived((v) => !v)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '0.82rem', fontWeight: 700, color: '#6b7280', padding: 0,
            }}
          >
            <Archive size={14} /> Archived ({archivedCount}) {showArchived ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {showArchived && (
            <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {archivedGoals.map((goal) => (
                <div key={goal.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#f9fafb', borderRadius: 8, border: '1px solid #f0f0f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                    <span style={{ width: 9, height: 9, borderRadius: '50%', background: goal.color, flexShrink: 0, opacity: 0.6 }} />
                    <span style={{ fontSize: '0.85rem', color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{goal.title}</span>
                    <span style={{ fontSize: '0.72rem', color: '#9ca3af', flexShrink: 0 }}>goal</span>
                  </div>
                  <button
                    onClick={() => restoreGoal(goal.id)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '0.78rem', fontWeight: 700, color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}
                  >
                    <RotateCcw size={13} /> Restore
                  </button>
                </div>
              ))}
              {archivedActivities.map((activity) => {
                const goal = state.goals.find((g) => g.id === activity.goalId);
                return (
                  <div key={activity.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#f9fafb', borderRadius: 8, border: '1px solid #f0f0f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                      <span style={{ fontSize: '0.85rem', color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{activity.title}</span>
                      <span style={{ fontSize: '0.72rem', color: '#9ca3af', flexShrink: 0 }}>{goal ? `activity · ${goal.title}` : 'activity'}</span>
                    </div>
                    <button
                      onClick={() => restoreActivity(activity.id)}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '0.78rem', fontWeight: 700, color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}
                    >
                      <RotateCcw size={13} /> Restore
                    </button>
                  </div>
                );
              })}
            </div>
          )}
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
