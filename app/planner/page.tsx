'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePlanner } from '@/lib/planner/store';
import { useFocusLock } from '@/components/planner/FocusLock';
import BlockRow from '@/components/planner/BlockRow';
import { computeActivityWeekCount, computeStreak, computeWeekStats, formatDateLabel, getWeekDates, startOfWeek, todayStr } from '@/lib/planner/scheduling';
import { Compass, Plus, Sparkles, Target, AlertCircle } from 'lucide-react';

export default function DashboardPage() {
  const { state, hydrated, setBlockStatus, deleteBlock, loadExampleData, autoFillWeek } = usePlanner();
  const { startFocus } = useFocusLock();
  const [fillNotice, setFillNotice] = useState<string | null>(null);

  if (!hydrated) return null;

  if (state.goals.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px', maxWidth: 520, margin: '0 auto' }}>
        <div style={{ width: 56, height: 56, borderRadius: 14, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <Compass size={26} style={{ color: '#6366f1' }} />
        </div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#111827', marginBottom: 10 }}>Welcome to Compass</h1>
        <p style={{ fontSize: '0.95rem', color: '#6b7280', lineHeight: 1.6, marginBottom: 28 }}>
          Turn your goals into scheduled, time-blocked activities &mdash; and a system that won&apos;t let you quietly ignore them.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/planner/goals" style={primaryBtn}>
            <Plus size={16} /> Create your first goal
          </Link>
          <button onClick={loadExampleData} style={ghostBtn}>
            <Sparkles size={16} /> Load an example week
          </button>
        </div>
      </div>
    );
  }

  const today = todayStr();
  const weekStart = startOfWeek(today);
  const weekDates = getWeekDates(weekStart);
  const weekStats = computeWeekStats(state, weekDates);

  const todaysBlocks = state.blocks
    .filter((b) => b.date === today && b.status !== 'rescheduled')
    .sort((a, b) => (a.startTime < b.startTime ? -1 : 1));

  const activeGoals = state.goals.filter((g) => !g.archived);
  const streakLeaders = state.activities
    .filter((a) => !a.archived && a.isHabit)
    .map((a) => ({ activity: a, streak: computeStreak(state.blocks, a.id) }))
    .filter((s) => s.streak > 0)
    .sort((a, b) => b.streak - a.streak)
    .slice(0, 4);

  const behindHabits = state.activities
    .filter((a) => !a.archived && a.isHabit && (a.targetPerWeek ?? 0) > 0)
    .map((a) => ({ activity: a, goal: state.goals.find((g) => g.id === a.goalId), scheduled: computeActivityWeekCount(state.blocks, a.id, weekDates) }))
    .filter((x) => x.scheduled < (x.activity.targetPerWeek ?? 0));

  const handleAutoFill = (activityId: string, title: string) => {
    const added = autoFillWeek(activityId, weekDates);
    setFillNotice(added > 0 ? `Scheduled ${added} more ${title} session${added > 1 ? 's' : ''} this week.` : `Couldn't find an open slot this week for ${title}.`);
    setTimeout(() => setFillNotice(null), 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: 4 }}>Today</h1>
        <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>{formatDateLabel(today)}</p>
      </div>

      {behindHabits.length > 0 && (
        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: '14px 18px' }}>
          <h2 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#92400e', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
            <AlertCircle size={15} /> Falling behind this week
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {behindHabits.map(({ activity, goal, scheduled }) => (
              <div key={activity.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.85rem', color: '#78350f' }}>
                  <strong>{activity.title}</strong>{goal ? ` (${goal.title})` : ''} &mdash; {scheduled}/{activity.targetPerWeek} scheduled
                </span>
                <button
                  onClick={() => handleAutoFill(activity.id, activity.title)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#92400e', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}
                >
                  <Sparkles size={12} /> Auto-fill
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {fillNotice && (
        <div style={{ padding: '10px 16px', background: '#eef2ff', border: '1px solid #c7d2fe', borderRadius: 8, fontSize: '0.85rem', color: '#4338ca' }}>
          {fillNotice}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: 24 }} className="dash-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {todaysBlocks.length === 0 ? (
            <div style={{ padding: 24, border: '1px dashed #d1d5db', borderRadius: 10, textAlign: 'center', color: '#9ca3af', fontSize: '0.88rem' }}>
              Nothing time-blocked for today.{' '}
              <Link href="/planner/calendar" style={{ color: '#6366f1', fontWeight: 600, textDecoration: 'none' }}>
                Schedule something on the calendar →
              </Link>
            </div>
          ) : (
            todaysBlocks.map((block) => {
              const activity = state.activities.find((a) => a.id === block.activityId);
              const goal = activity ? state.goals.find((g) => g.id === activity.goalId) : undefined;
              return (
                <BlockRow
                  key={block.id}
                  block={block}
                  activity={activity}
                  goal={goal}
                  streak={activity ? computeStreak(state.blocks, activity.id) : undefined}
                  onStart={() => activity && startFocus(block, activity, goal)}
                  onDone={() => setBlockStatus(block.id, 'done')}
                  onSkip={() => setBlockStatus(block.id, 'skipped')}
                  onDelete={() => deleteBlock(block.id)}
                />
              );
            })
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 18 }}>
            <h2 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#111827', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Target size={14} style={{ color: '#6366f1' }} /> This week&apos;s goals
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {activeGoals.map((goal) => {
                const stat = weekStats.find((s) => s.goalId === goal.id);
                const planned = stat?.plannedMinutes ?? 0;
                const done = stat?.doneMinutes ?? 0;
                const pct = planned === 0 ? 0 : Math.round((done / planned) * 100);
                return (
                  <div key={goal.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#111827' }}>{goal.title}</span>
                      <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{Math.round(done / 60 * 10) / 10}h / {Math.round(planned / 60 * 10) / 10}h</span>
                    </div>
                    <div style={{ height: 6, background: '#f3f4f6', borderRadius: 3 }}>
                      <div style={{ height: 6, width: `${Math.min(100, pct)}%`, background: goal.color, borderRadius: 3 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {streakLeaders.length > 0 && (
            <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 18 }}>
              <h2 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#111827', marginBottom: 14 }}>🔥 Active streaks</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {streakLeaders.map(({ activity, streak }) => (
                  <div key={activity.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: '#374151' }}>{activity.title}</span>
                    <span style={{ fontWeight: 700, color: '#d97706' }}>{streak}d</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 800px) {
          .dash-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

const primaryBtn: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 8,
  background: '#6366f1', color: '#fff', padding: '12px 22px', borderRadius: 8,
  fontSize: '0.9rem', fontWeight: 700, textDecoration: 'none', border: 'none', cursor: 'pointer',
};

const ghostBtn: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 8,
  background: '#fff', color: '#374151', padding: '12px 22px', borderRadius: 8,
  fontSize: '0.9rem', fontWeight: 600, border: '1.5px solid #d1d5db', cursor: 'pointer',
};
