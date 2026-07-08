'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, LayoutDashboard, Target, CalendarDays, ListChecks, BarChart3 } from 'lucide-react';

const links = [
  { href: '/planner', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/planner/goals', label: 'Goals', icon: Target },
  { href: '/planner/calendar', label: 'Calendar', icon: CalendarDays },
  { href: '/planner/checkin', label: 'Check-in', icon: ListChecks },
  { href: '/planner/reports', label: 'Reports', icon: BarChart3 },
];

export default function PlannerNav() {
  const pathname = usePathname();

  return (
    <nav style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 20px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
        <Link href="/planner" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: '#111827', fontWeight: 700, fontSize: '1.05rem', flexShrink: 0 }}>
          <Compass size={20} style={{ color: '#6366f1' }} />
          Compass
        </Link>
        <div style={{ display: 'flex', gap: 4, overflowX: 'auto' }}>
          {links.map(({ href, label, icon: Icon }) => {
            const active = href === '/planner' ? pathname === '/planner' : pathname?.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '8px 12px', borderRadius: 6, whiteSpace: 'nowrap',
                  fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none',
                  color: active ? '#4338ca' : '#6b7280',
                  background: active ? '#eef2ff' : 'transparent',
                }}
              >
                <Icon size={15} /> {label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
