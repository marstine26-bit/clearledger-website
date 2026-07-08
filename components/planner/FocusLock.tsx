'use client';

import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Activity, Goal, TimeBlock } from '@/lib/planner/types';
import { usePlanner } from '@/lib/planner/store';
import { Lock, CheckCircle2, X } from 'lucide-react';

interface FocusSession {
  block: TimeBlock;
  activity: Activity;
  goal: Goal | undefined;
  secondsLeft: number;
  totalSeconds: number;
}

interface FocusLockContextValue {
  session: FocusSession | null;
  startFocus: (block: TimeBlock, activity: Activity, goal: Goal | undefined) => void;
}

const FocusLockContext = createContext<FocusLockContextValue | null>(null);

export function FocusLockProvider({ children }: { children: React.ReactNode }) {
  const { setBlockStatus } = usePlanner();
  const [session, setSession] = useState<FocusSession | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startFocus = (block: TimeBlock, activity: Activity, goal: Goal | undefined) => {
    const totalSeconds = activity.durationMinutes * 60;
    setSession({ block, activity, goal, secondsLeft: totalSeconds, totalSeconds });
  };

  useEffect(() => {
    if (!session) return;
    document.body.style.overflow = 'hidden';
    intervalRef.current = setInterval(() => {
      setSession((s) => (s ? { ...s, secondsLeft: Math.max(0, s.secondsLeft - 1) } : s));
    }, 1000);
    return () => {
      document.body.style.overflow = '';
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [session?.block.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const complete = () => {
    if (!session) return;
    setBlockStatus(session.block.id, 'done');
    setSession(null);
  };

  const stop = () => {
    if (!session) return;
    setBlockStatus(session.block.id, 'skipped');
    setSession(null);
  };

  const value = useMemo(() => ({ session, startFocus }), [session]);

  return (
    <FocusLockContext.Provider value={value}>
      {children}
      {session && <FocusOverlay session={session} onComplete={complete} onStop={stop} />}
    </FocusLockContext.Provider>
  );
}

function FocusOverlay({ session, onComplete, onStop }: { session: FocusSession; onComplete: () => void; onStop: () => void }) {
  const { activity, goal, secondsLeft, totalSeconds } = session;
  const pct = totalSeconds === 0 ? 100 : Math.round(((totalSeconds - secondsLeft) / totalSeconds) * 100);
  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const [confirmStop, setConfirmStop] = useState(false);
  const color = goal?.color ?? '#6366f1';

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: '#0b0d12', color: '#fff',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: 24, textAlign: 'center',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 24 }}>
        <Lock size={14} />
        Focus lock &mdash; stay on task
      </div>

      {goal && (
        <div style={{ fontSize: '0.85rem', fontWeight: 600, color, marginBottom: 8 }}>{goal.title}</div>
      )}
      <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 700, marginBottom: 32, maxWidth: 560 }}>{activity.title}</h1>

      <div style={{ position: 'relative', width: 220, height: 220, marginBottom: 36 }}>
        <svg width="220" height="220" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="110" cy="110" r="98" fill="none" stroke="#1c2029" strokeWidth="12" />
          <circle
            cx="110" cy="110" r="98" fill="none" stroke={color} strokeWidth="12" strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 98}
            strokeDashoffset={2 * Math.PI * 98 * (1 - pct / 100)}
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '2.4rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
            {mins}:{secs.toString().padStart(2, '0')}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>remaining</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button
          onClick={onComplete}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: '#059669', color: '#fff', border: 'none', borderRadius: 8,
            padding: '14px 28px', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer',
          }}
        >
          <CheckCircle2 size={18} /> Mark complete
        </button>
        {!confirmStop ? (
          <button
            onClick={() => setConfirmStop(true)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'transparent', color: 'rgba(255,255,255,0.6)', border: '1.5px solid rgba(255,255,255,0.2)', borderRadius: 8,
              padding: '14px 24px', fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer',
            }}
          >
            <X size={16} /> I need to stop
          </button>
        ) : (
          <button
            onClick={onStop}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: '#dc2626', color: '#fff', border: 'none', borderRadius: 8,
              padding: '14px 24px', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer',
            }}
          >
            Confirm &amp; skip (auto-reschedules)
          </button>
        )}
      </div>
      <p style={{ marginTop: 28, fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', maxWidth: 420 }}>
        This locks the Compass app to this activity only. A browser can&apos;t block your whole device &mdash;
        for real device-level lockout, pair this with your OS&apos;s screen-time / app-blocking tools.
      </p>
    </div>
  );
}

export function useFocusLock(): FocusLockContextValue {
  const ctx = useContext(FocusLockContext);
  if (!ctx) throw new Error('useFocusLock must be used within a FocusLockProvider');
  return ctx;
}
