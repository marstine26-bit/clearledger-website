'use client';

import { useEffect, useState } from 'react';
import { usePlanner } from '@/lib/planner/store';
import { useFocusLock } from './FocusLock';
import { isDueNow, minutesToTime, timeToMinutes } from '@/lib/planner/scheduling';
import { Bell, Play, Clock, SkipForward } from 'lucide-react';

export default function ReminderBanner() {
  const { state, hydrated, updateBlock, setBlockStatus, markReminded } = usePlanner();
  const { startFocus } = useFocusLock();
  const [dueBlockId, setDueBlockId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    if (Notification.permission === 'default') Notification.requestPermission();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const check = () => {
      const due = state.blocks.find((b) => isDueNow(b));
      setDueBlockId(due ? due.id : null);
      if (due && !due.remindedAt) {
        markReminded(due.id);
        const activity = state.activities.find((a) => a.id === due.activityId);
        if (activity && typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
          new Notification('Compass — time to start', { body: activity.title });
        }
      }
    };
    check();
    const interval = setInterval(check, 20000);
    return () => clearInterval(interval);
  }, [hydrated, state.blocks, state.activities, markReminded]);

  if (!dueBlockId) return null;
  const block = state.blocks.find((b) => b.id === dueBlockId);
  if (!block) return null;
  const activity = state.activities.find((a) => a.id === block.activityId);
  if (!activity) return null;
  const goal = state.goals.find((g) => g.id === activity.goalId);

  return (
    <div
      style={{
        position: 'sticky', top: 0, zIndex: 60,
        background: '#111827', color: '#fff',
        padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap',
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.88rem' }}>
        <Bell size={15} style={{ color: '#fbbf24' }} />
        It&apos;s time for <strong>{activity.title}</strong>{goal ? ` (${goal.title})` : ''}
      </span>
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={() => startFocus(block, activity, goal)}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#6366f1', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
        >
          <Play size={13} /> Start focus
        </button>
        <button
          onClick={() => updateBlock(block.id, { startTime: minutesToTime(timeToMinutes(block.startTime) + 10), remindedAt: null })}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
        >
          <Clock size={13} /> Snooze 10m
        </button>
        <button
          onClick={() => setBlockStatus(block.id, 'skipped')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'transparent', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 6, padding: '6px 12px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
        >
          <SkipForward size={13} /> Skip
        </button>
      </div>
    </div>
  );
}
