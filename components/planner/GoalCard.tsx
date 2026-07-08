'use client';

import { useState } from 'react';
import { Activity, Goal } from '@/lib/planner/types';
import { WeekGoalStat } from '@/lib/planner/scheduling';
import { Flame, Pencil, Plus, Repeat, Archive, Sparkles } from 'lucide-react';

export default function GoalCard({
  goal,
  activities,
  weekStat,
  streaks,
  weekCounts,
  onEditGoal,
  onArchiveGoal,
  onAddActivity,
  onEditActivity,
  onArchiveActivity,
  onAutoFillActivity,
}: {
  goal: Goal;
  activities: Activity[];
  weekStat: WeekGoalStat | undefined;
  streaks: Map<string, number>;
  weekCounts: Map<string, number>;
  onEditGoal: () => void;
  onArchiveGoal: () => void;
  onAddActivity: () => void;
  onEditActivity: (activity: Activity) => void;
  onArchiveActivity: (id: string) => void;
  onAutoFillActivity: (id: string) => void;
}) {
  const planned = weekStat?.plannedMinutes ?? 0;
  const done = weekStat?.doneMinutes ?? 0;
  const pct = planned === 0 ? 0 : Math.min(100, Math.round((done / planned) * 100));
  const [confirmArchiveGoal, setConfirmArchiveGoal] = useState(false);
  const [confirmArchiveActivity, setConfirmArchiveActivity] = useState<string | null>(null);

  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, background: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <span style={{ width: 12, height: 12, borderRadius: '50%', background: goal.color, flexShrink: 0 }} />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{goal.title}</h3>
        </div>
        {!confirmArchiveGoal ? (
          <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
            <button onClick={onEditGoal} aria-label="Edit goal" title="Edit goal" style={iconBtn}><Pencil size={14} /></button>
            <button onClick={() => setConfirmArchiveGoal(true)} aria-label="Archive goal" title="Archive goal" style={iconBtn}><Archive size={14} /></button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
            <button onClick={onArchiveGoal} style={confirmBtn}>Archive?</button>
            <button onClick={() => setConfirmArchiveGoal(false)} aria-label="Cancel" style={cancelBtn}>Cancel</button>
          </div>
        )}
      </div>

      {goal.description && <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: 14, lineHeight: 1.5 }}>{goal.description}</p>}

      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 600 }}>This week</span>
          <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{Math.round(done / 60 * 10) / 10}h / {Math.round(planned / 60 * 10) / 10}h planned</span>
        </div>
        <div style={{ height: 6, background: '#f3f4f6', borderRadius: 3 }}>
          <div style={{ height: 6, width: `${pct}%`, background: goal.color, borderRadius: 3 }} />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
        {activities.map((a) => {
          const scheduled = weekCounts.get(a.id) ?? 0;
          const target = a.targetPerWeek ?? 0;
          const underTarget = a.isHabit && target > 0 && scheduled < target;
          return (
            <div key={a.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', background: '#f9fafb', borderRadius: 7, gap: 8 }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.title}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{a.durationMinutes} min</span>
                  {a.isHabit && (
                    <span
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: '0.72rem', fontWeight: 700,
                        color: underTarget ? '#d97706' : '#059669',
                      }}
                    >
                      <Repeat size={10} /> {scheduled}/{target} this week
                    </span>
                  )}
                  {(streaks.get(a.id) ?? 0) > 0 && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: '0.72rem', color: '#d97706', fontWeight: 600 }}>
                      <Flame size={10} /> {streaks.get(a.id)}
                    </span>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 4, flexShrink: 0, alignItems: 'center' }}>
                {underTarget && (
                  <button
                    onClick={() => onAutoFillActivity(a.id)}
                    aria-label={`Auto-fill remaining ${a.title} sessions this week`}
                    title="Auto-fill remaining sessions this week"
                    style={{ ...iconBtn, color: '#6366f1', background: '#eef2ff' }}
                  >
                    <Sparkles size={12} />
                  </button>
                )}
                {confirmArchiveActivity !== a.id ? (
                  <>
                    <button onClick={() => onEditActivity(a)} aria-label={`Edit ${a.title}`} title="Edit" style={iconBtn}><Pencil size={12} /></button>
                    <button onClick={() => setConfirmArchiveActivity(a.id)} aria-label={`Archive ${a.title}`} title="Archive" style={iconBtn}><Archive size={12} /></button>
                  </>
                ) : (
                  <>
                    <button onClick={() => onArchiveActivity(a.id)} style={{ ...confirmBtn, padding: '4px 8px', fontSize: '0.7rem' }}>Archive?</button>
                    <button onClick={() => setConfirmArchiveActivity(null)} aria-label="Cancel" style={{ ...cancelBtn, padding: '4px 8px', fontSize: '0.7rem' }}>Cancel</button>
                  </>
                )}
              </div>
            </div>
          );
        })}
        {activities.length === 0 && (
          <p style={{ fontSize: '0.8rem', color: '#9ca3af', fontStyle: 'italic' }}>No activities yet.</p>
        )}
      </div>

      <button
        onClick={onAddActivity}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', fontWeight: 600, color: goal.color, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
      >
        <Plus size={14} /> Add activity
      </button>
    </div>
  );
}

const iconBtn: React.CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  width: 26, height: 26, borderRadius: 6, border: 'none', background: 'transparent', color: '#9ca3af', cursor: 'pointer',
};

const confirmBtn: React.CSSProperties = {
  background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: 6,
  padding: '5px 10px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer',
};

const cancelBtn: React.CSSProperties = {
  background: '#f9fafb', color: '#6b7280', border: 'none', borderRadius: 6,
  padding: '5px 10px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
};
