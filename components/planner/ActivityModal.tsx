'use client';

import { useState } from 'react';
import { Activity } from '@/lib/planner/types';
import Modal, { inputStyle, labelStyle, primaryBtnStyle } from './Modal';

export default function ActivityModal({
  initial,
  onClose,
  onSave,
}: {
  initial?: Activity;
  onClose: () => void;
  onSave: (data: { title: string; durationMinutes: number; isHabit: boolean; targetPerWeek: number | null }) => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [duration, setDuration] = useState(initial?.durationMinutes ?? 30);
  const [isHabit, setIsHabit] = useState(initial?.isHabit ?? true);
  const [targetPerWeek, setTargetPerWeek] = useState(initial?.targetPerWeek ?? 3);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const safeDuration = Math.min(480, Math.max(5, Math.round(duration) || 30));
    const safeTarget = Math.min(7, Math.max(1, Math.round(targetPerWeek) || 1));
    onSave({ title: title.trim(), durationMinutes: safeDuration, isHabit, targetPerWeek: isHabit ? safeTarget : null });
  };

  return (
    <Modal title={initial ? 'Edit activity' : 'New activity'} onClose={onClose}>
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={labelStyle} htmlFor="activity-title">Activity</label>
          <input id="activity-title" style={inputStyle} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Gym session" autoFocus required />
        </div>
        <div>
          <label style={labelStyle} htmlFor="activity-duration">Duration per session (minutes)</label>
          <input
            id="activity-duration"
            style={inputStyle} type="number" min={5} max={480} step={5}
            value={duration} onChange={(e) => setDuration(Number(e.target.value))}
          />
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
          <input type="checkbox" checked={isHabit} onChange={(e) => setIsHabit(e.target.checked)} style={{ width: 16, height: 16 }} />
          <span style={{ fontSize: '0.88rem', color: '#374151' }}>
            This is a recurring habit <span style={{ color: '#9ca3af' }}>(tracked for streaks &amp; auto-reschedule)</span>
          </span>
        </label>
        {isHabit && (
          <div>
            <label style={labelStyle} htmlFor="activity-target">Target times per week</label>
            <input
              id="activity-target"
              style={inputStyle} type="number" min={1} max={7}
              value={targetPerWeek} onChange={(e) => setTargetPerWeek(Number(e.target.value))}
            />
          </div>
        )}
        <button type="submit" style={primaryBtnStyle}>{initial ? 'Save changes' : 'Add activity'}</button>
      </form>
    </Modal>
  );
}
