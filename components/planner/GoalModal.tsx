'use client';

import { useState } from 'react';
import { Goal, GOAL_COLORS } from '@/lib/planner/types';
import Modal, { inputStyle, labelStyle, primaryBtnStyle } from './Modal';

export default function GoalModal({
  initial,
  onClose,
  onSave,
}: {
  initial?: Goal;
  onClose: () => void;
  onSave: (data: { title: string; description: string; color: string }) => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [color, setColor] = useState(initial?.color ?? GOAL_COLORS[0]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ title: title.trim(), description: description.trim(), color });
  };

  return (
    <Modal title={initial ? 'Edit goal' : 'New goal'} onClose={onClose}>
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={labelStyle}>What do you want to achieve?</label>
          <input style={inputStyle} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Get fit" autoFocus required />
        </div>
        <div>
          <label style={labelStyle}>Why it matters (optional)</label>
          <textarea
            style={{ ...inputStyle, resize: 'vertical', minHeight: 64, fontFamily: 'inherit' }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A short reminder of why this goal matters to you"
          />
        </div>
        <div>
          <label style={labelStyle}>Color</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {GOAL_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                style={{
                  width: 28, height: 28, borderRadius: '50%', background: c, cursor: 'pointer',
                  border: color === c ? '3px solid #111827' : '3px solid transparent',
                  outline: color === c ? `2px solid ${c}` : 'none', outlineOffset: 1,
                }}
                aria-label={c}
              />
            ))}
          </div>
        </div>
        <button type="submit" style={primaryBtnStyle}>{initial ? 'Save changes' : 'Create goal'}</button>
      </form>
    </Modal>
  );
}
