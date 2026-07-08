'use client';

import { useState } from 'react';
import { Activity, Goal, TimeBlock } from '@/lib/planner/types';
import Modal, { inputStyle, labelStyle, primaryBtnStyle } from './Modal';
import { formatDateLabel } from '@/lib/planner/scheduling';
import { CheckCircle2, Play, SkipForward, Trash2 } from 'lucide-react';

export default function BlockModal({
  date,
  startTime,
  existing,
  existingActivity,
  existingGoal,
  activities,
  goals,
  onClose,
  onCreate,
  onDelete,
  onStatusChange,
  onStartFocus,
}: {
  date: string;
  startTime: string;
  existing?: TimeBlock;
  existingActivity?: Activity;
  existingGoal?: Goal;
  activities: Activity[];
  goals: Goal[];
  onClose: () => void;
  onCreate: (data: { activityId: string; date: string; startTime: string; durationMinutes: number }) => void;
  onDelete?: (id: string) => void;
  onStatusChange?: (id: string, status: TimeBlock['status']) => void;
  onStartFocus?: () => void;
}) {
  const eligibleActivities = activities.filter((a) => !a.archived);
  const [activityId, setActivityId] = useState(existing?.activityId ?? eligibleActivities[0]?.id ?? '');
  const [time, setTime] = useState(existing?.startTime ?? startTime);
  const [duration, setDuration] = useState(
    existing?.durationMinutes ?? eligibleActivities.find((a) => a.id === activityId)?.durationMinutes ?? 30
  );

  if (existing) {
    return (
      <Modal title={existingActivity?.title ?? 'Time block'} onClose={onClose}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {existingGoal && <span style={{ fontSize: '0.8rem', fontWeight: 600, color: existingGoal.color }}>{existingGoal.title}</span>}
          <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
            {formatDateLabel(existing.date)} at {existing.startTime} &middot; {existing.durationMinutes} min &middot; status: <strong>{existing.status}</strong>
          </p>

          {existing.status === 'planned' && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {onStartFocus && (
                <button onClick={onStartFocus} style={smallBtn('#eef2ff', '#4338ca')}><Play size={14} /> Start focus</button>
              )}
              {onStatusChange && (
                <>
                  <button onClick={() => onStatusChange(existing.id, 'done')} style={smallBtn('#f0fdf4', '#059669')}><CheckCircle2 size={14} /> Mark done</button>
                  <button onClick={() => onStatusChange(existing.id, 'skipped')} style={smallBtn('#fef2f2', '#dc2626')}><SkipForward size={14} /> Skip</button>
                </>
              )}
            </div>
          )}

          {onDelete && (
            <button onClick={() => onDelete(existing.id)} style={{ ...smallBtn('#f9fafb', '#6b7280'), justifyContent: 'center' }}>
              <Trash2 size={14} /> Delete block
            </button>
          )}
        </div>
      </Modal>
    );
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activityId) return;
    onCreate({ activityId, date, startTime: time, durationMinutes: duration });
  };

  return (
    <Modal title={`Schedule for ${formatDateLabel(date)}`} onClose={onClose}>
      {eligibleActivities.length === 0 ? (
        <p style={{ fontSize: '0.88rem', color: '#6b7280' }}>Create a goal and an activity first, then come back to schedule it.</p>
      ) : (
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={labelStyle}>Activity</label>
            <select
              style={inputStyle}
              value={activityId}
              onChange={(e) => {
                const id = e.target.value;
                setActivityId(id);
                const act = eligibleActivities.find((a) => a.id === id);
                if (act) setDuration(act.durationMinutes);
              }}
            >
              {goals.map((goal) => {
                const acts = eligibleActivities.filter((a) => a.goalId === goal.id);
                if (acts.length === 0) return null;
                return (
                  <optgroup key={goal.id} label={goal.title}>
                    {acts.map((a) => (
                      <option key={a.id} value={a.id}>{a.title}</option>
                    ))}
                  </optgroup>
                );
              })}
            </select>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Start time</label>
              <input style={inputStyle} type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Duration (min)</label>
              <input style={inputStyle} type="number" min={5} step={5} value={duration} onChange={(e) => setDuration(Number(e.target.value))} />
            </div>
          </div>
          <button type="submit" style={primaryBtnStyle}>Add to calendar</button>
        </form>
      )}
    </Modal>
  );
}

function smallBtn(bg: string, color: string): React.CSSProperties {
  return {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    background: bg, color, border: 'none', borderRadius: 7, padding: '9px 14px',
    fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer',
  };
}
