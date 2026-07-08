'use client';

import { Activity, Goal, TimeBlock } from '@/lib/planner/types';
import { formatDateLabel, formatTime } from '@/lib/planner/scheduling';
import { CheckCircle2, Play, SkipForward, Trash2, Flame } from 'lucide-react';

export default function BlockRow({
  block,
  activity,
  goal,
  streak,
  showDate = false,
  onStart,
  onDone,
  onSkip,
  onDelete,
}: {
  block: TimeBlock;
  activity: Activity | undefined;
  goal: Goal | undefined;
  streak?: number;
  showDate?: boolean;
  onStart: () => void;
  onDone: () => void;
  onSkip: () => void;
  onDelete?: () => void;
}) {
  if (!activity) return null;
  const color = goal?.color ?? '#6b7280';
  const isPlanned = block.status === 'planned';

  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '14px 16px', borderRadius: 10, border: '1px solid #e5e7eb',
        background: block.status === 'done' ? '#f0fdf4' : block.status === 'skipped' ? '#fef2f2' : '#fff',
        opacity: block.status === 'skipped' ? 0.7 : 1,
      }}
    >
      <div style={{ width: 4, alignSelf: 'stretch', borderRadius: 4, background: color, flexShrink: 0 }} />

      <div style={{ minWidth: 90, flexShrink: 0 }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#111827', fontVariantNumeric: 'tabular-nums' }}>
          {formatTime(block.startTime)}
        </div>
        {showDate && <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{formatDateLabel(block.date)}</div>}
        <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{block.durationMinutes} min</div>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: '0.92rem', fontWeight: 600, color: '#111827',
          textDecoration: block.status === 'skipped' ? 'line-through' : 'none',
        }}>
          {activity.title}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
          {goal && <span style={{ fontSize: '0.75rem', color, fontWeight: 600 }}>{goal.title}</span>}
          {typeof streak === 'number' && streak > 0 && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: '0.72rem', color: '#d97706', fontWeight: 600 }}>
              <Flame size={11} /> {streak}
            </span>
          )}
        </div>
      </div>

      {block.status === 'done' && (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.78rem', color: '#059669', fontWeight: 700 }}>
          <CheckCircle2 size={15} /> Done
        </span>
      )}
      {block.status === 'skipped' && (
        <span style={{ fontSize: '0.78rem', color: '#dc2626', fontWeight: 700 }}>Skipped</span>
      )}

      {isPlanned && (
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          <button onClick={onStart} title="Start focus" style={iconBtnStyle('#eef2ff', '#4338ca')}>
            <Play size={14} />
          </button>
          <button onClick={onDone} title="Mark done" style={iconBtnStyle('#f0fdf4', '#059669')}>
            <CheckCircle2 size={14} />
          </button>
          <button onClick={onSkip} title="Skip (auto-reschedules)" style={iconBtnStyle('#fef2f2', '#dc2626')}>
            <SkipForward size={14} />
          </button>
          {onDelete && (
            <button onClick={onDelete} title="Delete" style={iconBtnStyle('#f9fafb', '#6b7280')}>
              <Trash2 size={14} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function iconBtnStyle(bg: string, color: string): React.CSSProperties {
  return {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: 30, height: 30, borderRadius: 6, border: 'none',
    background: bg, color, cursor: 'pointer',
  };
}
