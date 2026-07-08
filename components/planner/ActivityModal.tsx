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
    onSave({ title: title.trim(), durationMinutes: duration, isHabit, targetPerWeek: isHabit ? targetPerWeek : null });
  };

  return (
    <Modal title={initial ? 'Edit activity' : 'New activity'} onClose={onClose}>
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={labelStyle}>Activity</label>
          <input style={inputStyle} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Gym session" autoFocus required />
        </div>
        <div>
          <label style={labelStyle}>Duration per session (minutes)</label>
          <input
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
            <label style={labelStyle}>Target times per week</label>
            <input
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
