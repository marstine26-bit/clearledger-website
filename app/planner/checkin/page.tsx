'use client';

import { usePlanner } from '@/lib/planner/store';
import { useFocusLock } from '@/components/planner/FocusLock';
import BlockRow from '@/components/planner/BlockRow';
import { computeStreak, todayStr } from '@/lib/planner/scheduling';
import { CheckCircle2 } from 'lucide-react';

export default function CheckinPage() {
  const { state, hydrated, setBlockStatus, deleteBlock } = usePlanner();
  const { startFocus } = useFocusLock();

  if (!hydrated) return null;

  const today = todayStr();
  const outstanding = state.blocks
    .filter((b) => b.status === 'planned' && b.date <= today)
    .sort((a, b) => (a.date === b.date ? (a.startTime < b.startTime ? -1 : 1) : a.date < b.date ? -1 : 1));

  const overdue = outstanding.filter((b) => b.date < today);
  const dueToday = outstanding.filter((b) => b.date === today);

  const recentlyResolved = state.blocks
    .filter((b) => (b.status === 'done' || b.status === 'skipped') && b.date === today)
    .sort((a, b) => (a.startTime < b.startTime ? -1 : 1));

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: 4 }}>Daily check-in</h1>
      <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: 28 }}>
        Close the loop on every scheduled activity &mdash; nothing sits unresolved.
      </p>

      {overdue.length > 0 && (
        <Section title={`Overdue (${overdue.length})`} tint="#fef2f2">
          {overdue.map((block) => (
            <Row key={block.id} block={block} state={state} setBlockStatus={setBlockStatus} deleteBlock={deleteBlock} startFocus={startFocus} showDate />
          ))}
        </Section>
      )}

      <Section title={`Today (${dueToday.length})`}>
        {dueToday.length === 0 ? (
          <EmptyNote />
        ) : (
          dueToday.map((block) => (
            <Row key={block.id} block={block} state={state} setBlockStatus={setBlockStatus} deleteBlock={deleteBlock} startFocus={startFocus} />
          ))
        )}
      </Section>

      {recentlyResolved.length > 0 && (
        <Section title="Resolved today">
          {recentlyResolved.map((block) => {
            const activity = state.activities.find((a) => a.id === block.activityId);
            const goal = activity ? state.goals.find((g) => g.id === activity.goalId) : undefined;
            return (
              <BlockRow
                key={block.id}
                block={block}
                activity={activity}
                goal={goal}
                streak={activity ? computeStreak(state.blocks, activity.id) : undefined}
                onStart={() => {}}
                onDone={() => {}}
                onSkip={() => {}}
              />
            );
          })}
        </Section>
      )}
    </div>
  );
}

function Row({
  block, state, setBlockStatus, deleteBlock, startFocus, showDate,
}: {
  block: import('@/lib/planner/types').TimeBlock;
  state: import('@/lib/planner/types').PlannerState;
  setBlockStatus: (id: string, status: import('@/lib/planner/types').BlockStatus) => void;
  deleteBlock: (id: string) => void;
  startFocus: (block: import('@/lib/planner/types').TimeBlock, activity: import('@/lib/planner/types').Activity, goal: import('@/lib/planner/types').Goal | undefined) => void;
  showDate?: boolean;
}) {
  const activity = state.activities.find((a) => a.id === block.activityId);
  const goal = activity ? state.goals.find((g) => g.id === activity.goalId) : undefined;
  return (
    <BlockRow
      block={block}
      activity={activity}
      goal={goal}
      streak={activity ? computeStreak(state.blocks, activity.id) : undefined}
      showDate={showDate}
      onStart={() => activity && startFocus(block, activity, goal)}
      onDone={() => setBlockStatus(block.id, 'done')}
      onSkip={() => setBlockStatus(block.id, 'skipped')}
      onDelete={() => deleteBlock(block.id)}
    />
  );
}

function Section({ title, tint, children }: { title: string; tint?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <h2 style={{ fontSize: '0.82rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>{title}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, background: tint, borderRadius: tint ? 10 : 0, padding: tint ? 4 : 0 }}>
        {children}
      </div>
    </div>
  );
}

function EmptyNote() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 18, border: '1px dashed #d1d5db', borderRadius: 10, color: '#9ca3af', fontSize: '0.85rem' }}>
      <CheckCircle2 size={16} /> Nothing left to check in today.
    </div>
  );
}
