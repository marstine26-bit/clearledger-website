'use client';

import { useState } from 'react';
import { usePlanner } from '@/lib/planner/store';
import { useFocusLock } from '@/components/planner/FocusLock';
import WeekCalendar, { EnrichedBlock } from '@/components/planner/WeekCalendar';
import BlockModal from '@/components/planner/BlockModal';
import { addDays, formatDateLabel, getWeekDates, startOfWeek, todayStr } from '@/lib/planner/scheduling';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CalendarPage() {
  const { state, hydrated, addBlock, updateBlock, deleteBlock, setBlockStatus } = usePlanner();
  const { startFocus } = useFocusLock();
  const [weekStart, setWeekStart] = useState(() => startOfWeek(todayStr()));
  const [creating, setCreating] = useState<{ date: string; time: string } | null>(null);
  const [editing, setEditing] = useState<EnrichedBlock | null>(null);

  if (!hydrated) return null;

  const weekDates = getWeekDates(weekStart);

  const blocksByDate = new Map<string, EnrichedBlock[]>();
  for (const date of weekDates) blocksByDate.set(date, []);
  for (const block of state.blocks) {
    if (block.status === 'rescheduled') continue;
    if (!blocksByDate.has(block.date)) continue;
    const activity = state.activities.find((a) => a.id === block.activityId);
    const goal = activity ? state.goals.find((g) => g.id === activity.goalId) : undefined;
    blocksByDate.get(block.date)!.push({ ...block, activity, goal });
  }

  const hasActivities = state.activities.some((a) => !a.archived);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: 4 }}>Calendar</h1>
          <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>Click any slot to time-block an activity.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={() => setWeekStart(addDays(weekStart, -7))} style={navBtn}><ChevronLeft size={16} /></button>
          <button onClick={() => setWeekStart(startOfWeek(todayStr()))} style={{ ...navBtn, width: 'auto', padding: '0 14px', fontSize: '0.8rem', fontWeight: 700 }}>Today</button>
          <button onClick={() => setWeekStart(addDays(weekStart, 7))} style={navBtn}><ChevronRight size={16} /></button>
          <span style={{ fontSize: '0.85rem', color: '#6b7280', marginLeft: 6 }}>
            {formatDateLabel(weekDates[0])} &ndash; {formatDateLabel(weekDates[6])}
          </span>
        </div>
      </div>

      {!hasActivities && (
        <div style={{ marginBottom: 16, padding: '10px 16px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, fontSize: '0.85rem', color: '#92400e' }}>
          You don&apos;t have any activities yet &mdash; add one from the <a href="/planner/goals" style={{ color: '#92400e', fontWeight: 700 }}>Goals</a> page before scheduling.
        </div>
      )}

      <WeekCalendar
        weekDates={weekDates}
        blocksByDate={blocksByDate}
        onSlotClick={(date, time) => setCreating({ date, time })}
        onBlockClick={(block) => setEditing(block)}
      />

      {creating && (
        <BlockModal
          date={creating.date}
          startTime={creating.time}
          activities={state.activities}
          goals={state.goals.filter((g) => !g.archived)}
          onClose={() => setCreating(null)}
          onCreate={(data) => {
            addBlock(data);
            setCreating(null);
          }}
        />
      )}

      {editing && (
        <BlockModal
          date={editing.date}
          startTime={editing.startTime}
          existing={editing}
          existingActivity={editing.activity}
          existingGoal={editing.goal}
          activities={state.activities}
          goals={state.goals.filter((g) => !g.archived)}
          onClose={() => setEditing(null)}
          onCreate={() => {}}
          onUpdate={(id, patch) => { updateBlock(id, patch); setEditing(null); }}
          onDelete={(id) => { deleteBlock(id); setEditing(null); }}
          onStatusChange={(id, status) => { setBlockStatus(id, status); setEditing(null); }}
          onStartFocus={editing.activity ? () => { startFocus(editing, editing.activity!, editing.goal); setEditing(null); } : undefined}
        />
      )}
    </div>
  );
}

const navBtn: React.CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  width: 32, height: 32, borderRadius: 7, border: '1px solid #e5e7eb', background: '#fff', color: '#374151', cursor: 'pointer',
};
