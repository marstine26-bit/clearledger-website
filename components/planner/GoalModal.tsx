'use client';

import { useState } from 'react';
import { Goal, GOAL_COLORS } from '@/lib/planner/types';
import Modal, { inputStyle, labelStyle, primaryBtnStyle } from './Modal';

const COLOR_NAMES: Record<string, string> = {
  '#6366f1': 'Indigo',
  '#059669': 'Emerald',
  '#d97706': 'Amber',
  '#dc2626': 'Red',
  '#2563eb': 'Blue',
  '#7c3aed': 'Violet',
  '#0891b2': 'Cyan',
  '#be185d': 'Pink',
};

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
          <label style={labelStyle} htmlFor="goal-title">What do you want to achieve?</label>
          <input id="goal-title" style={inputStyle} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Get fit" autoFocus required />
        </div>
        <div>
          <label style={labelStyle} htmlFor="goal-description">Why it matters (optional)</label>
          <textarea
            id="goal-description"
            style={{ ...inputStyle, resize: 'vertical', minHeight: 64, fontFamily: 'inherit' }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A short reminder of why this goal matters to you"
          />
        </div>
        <div role="group" aria-labelledby="goal-color-label">
          <span id="goal-color-label" style={labelStyle}>Color</span>
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
                aria-label={COLOR_NAMES[c] ?? c}
                aria-pressed={color === c}
              />
            ))}
          </div>
        </div>
        <button type="submit" style={primaryBtnStyle}>{initial ? 'Save changes' : 'Create goal'}</button>
      </form>
    </Modal>
  );
}
