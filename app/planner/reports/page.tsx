'use client';

import { useState } from 'react';
import { usePlanner } from '@/lib/planner/store';
import { addDays, computeStreak, computeWeekStats, formatDateLabel, getWeekDates, startOfWeek, todayStr } from '@/lib/planner/scheduling';
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react';

export default function ReportsPage() {
  const { state, hydrated } = usePlanner();
  const [weekStart, setWeekStart] = useState(() => startOfWeek(todayStr()));

  if (!hydrated) return null;

  const weekDates = getWeekDates(weekStart);
  const stats = computeWeekStats(state, weekDates).filter((s) => state.goals.some((g) => g.id === s.goalId));

  const totalPlanned = stats.reduce((sum, s) => sum + s.plannedMinutes, 0);
  const totalDone = stats.reduce((sum, s) => sum + s.doneMinutes, 0);
  const totalBlocks = stats.reduce((sum, s) => sum + s.totalCount, 0);
  const totalDoneCount = stats.reduce((sum, s) => sum + s.doneCount, 0);
  const completionRate = totalBlocks === 0 ? 0 : Math.round((totalDoneCount / totalBlocks) * 100);
  const maxPlanned = Math.max(1, ...stats.map((s) => s.plannedMinutes));

  const unscheduledGoals = state.goals.filter((g) => !g.archived && (stats.find((s) => s.goalId === g.id)?.plannedMinutes ?? 0) === 0);

  const leaderboard = state.activities
    .filter((a) => !a.archived && a.isHabit)
    .map((a) => ({ activity: a, goal: state.goals.find((g) => g.id === a.goalId), streak: computeStreak(state.blocks, a.id) }))
    .sort((a, b) => b.streak - a.streak);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: 4 }}>Reports</h1>
          <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>Planned vs. actual time, per goal.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={() => setWeekStart(addDays(weekStart, -7))} style={navBtn}><ChevronLeft size={16} /></button>
          <button onClick={() => setWeekStart(startOfWeek(todayStr()))} style={{ ...navBtn, width: 'auto', padding: '0 14px', fontSize: '0.8rem', fontWeight: 700 }}>This week</button>
          <button onClick={() => setWeekStart(addDays(weekStart, 7))} style={navBtn}><ChevronRight size={16} /></button>
          <span style={{ fontSize: '0.85rem', color: '#6b7280', marginLeft: 6 }}>
            {formatDateLabel(weekDates[0])} &ndash; {formatDateLabel(weekDates[6])}
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 28 }}>
        <StatTile label="Planned time" value={`${Math.round(totalPlanned / 6) / 10}h`} />
        <StatTile label="Actual time" value={`${Math.round(totalDone / 6) / 10}h`} />
        <StatTile label="Completion rate" value={`${completionRate}%`} />
        <StatTile label="Blocks scheduled" value={`${totalBlocks}`} />
      </div>

      <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, marginBottom: 24 }}>
        <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#111827', marginBottom: 18 }}>Planned vs. actual by goal</h2>
        {stats.length === 0 || totalPlanned === 0 ? (
          <p style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Nothing scheduled this week.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {stats.map((s) => {
              const goal = state.goals.find((g) => g.id === s.goalId);
              if (!goal || s.plannedMinutes === 0) return null;
              const donePct = Math.round((s.doneMinutes / maxPlanned) * 100);
              const plannedPct = Math.round((s.plannedMinutes / maxPlanned) * 100);
              return (
                <div key={s.goalId}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#111827' }}>{goal.title}</span>
                    <span style={{ fontSize: '0.78rem', color: '#9ca3af' }}>
                      {Math.round(s.doneMinutes / 6) / 10}h done / {Math.round(s.plannedMinutes / 6) / 10}h planned
                      {s.skippedCount > 0 && <> &middot; {s.skippedCount} skipped</>}
                    </span>
                  </div>
                  <div style={{ position: 'relative', height: 14, background: '#f3f4f6', borderRadius: 4 }}>
                    <div style={{ position: 'absolute', inset: 0, width: `${plannedPct}%`, borderRadius: 4, border: `1.5px dashed ${goal.color}88` }} />
                    <div style={{ height: 14, width: `${donePct}%`, background: goal.color, borderRadius: 4 }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {stats.length > 0 && totalPlanned > 0 && unscheduledGoals.length > 0 && (
          <p style={{ fontSize: '0.78rem', color: '#9ca3af', marginTop: 16, paddingTop: 14, borderTop: '1px solid #f3f4f6' }}>
            Nothing scheduled this week for {unscheduledGoals.map((g) => g.title).join(', ')}.
          </p>
        )}
      </div>

      <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 20 }}>
        <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#111827', marginBottom: 16 }}>Streaks</h2>
        {leaderboard.length === 0 ? (
          <p style={{ fontSize: '0.85rem', color: '#9ca3af' }}>No recurring habits yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {leaderboard.map(({ activity, goal, streak }) => (
              <div key={activity.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#f9fafb', borderRadius: 7 }}>
                <div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#111827' }}>{activity.title}</span>
                  {goal && <span style={{ fontSize: '0.75rem', color: goal.color, marginLeft: 8, fontWeight: 600 }}>{goal.title}</span>}
                </div>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.85rem', fontWeight: 700, color: streak > 0 ? '#d97706' : '#9ca3af' }}>
                  <Flame size={13} /> {streak}d
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: '16px 18px' }}>
      <div style={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>{value}</div>
    </div>
  );
}

const navBtn: React.CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  width: 32, height: 32, borderRadius: 7, border: '1px solid #e5e7eb', background: '#fff', color: '#374151', cursor: 'pointer',
};
