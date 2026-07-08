'use client';

import { PlannerProvider } from '@/lib/planner/store';
import { FocusLockProvider } from '@/components/planner/FocusLock';
import PlannerNav from '@/components/planner/PlannerNav';
import ReminderBanner from '@/components/planner/ReminderBanner';

export default function PlannerLayout({ children }: { children: React.ReactNode }) {
  return (
    <PlannerProvider>
      <FocusLockProvider>
        <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
          <PlannerNav />
          <ReminderBanner />
          <main style={{ maxWidth: 1160, margin: '0 auto', padding: '32px 20px 80px' }}>{children}</main>
        </div>
      </FocusLockProvider>
    </PlannerProvider>
  );
}
