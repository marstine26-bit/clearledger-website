import {
  BarChart3, Calculator, PiggyBank, Building2, Shield,
  TrendingUp, Users, Bell, Download, HeartPulse
} from 'lucide-react';

const mainFeatures = [
  {
    icon: Calculator,
    title: 'ITR12 Tax Estimator',
    desc: 'See your SARS refund or shortfall before you file. Uses 2025/26 brackets, PAYE, medical credits, and RA deductions — automatically filled from your transactions.',
    badge: 'SA-specific',
  },
  {
    icon: BarChart3,
    title: 'Smart Budget Planner',
    desc: 'Set limits per category, get rollover bonuses for underspending, and see exactly where your salary went before month-end.',
  },
  {
    icon: TrendingUp,
    title: 'Net Worth Tracker',
    desc: 'Every asset and liability in one number — including your bond equity, investment portfolio, and stokvel contributions.',
  },
  {
    icon: PiggyBank,
    title: 'TFSA Tracker',
    desc: 'Know your annual room (R36,000) and lifetime limit (R500,000) at a glance. Never accidentally over-contribute.',
    badge: 'SA-specific',
  },
  {
    icon: Building2,
    title: 'Property & Bond Tracker',
    desc: 'Track market value, outstanding bond, and equity growth. Flows directly into your net worth calculation.',
  },
  {
    icon: Shield,
    title: 'Insurance Manager',
    desc: 'Log all your policies in one place. Renewal reminders auto-set 30 days ahead so you never lapse on cover.',
  },
  {
    icon: Users,
    title: 'Split Bills & Stokvel',
    desc: 'Track shared expenses with friends or family. Minimize settlement transactions with smart greedy pairing. Full stokvel pot management included.',
    badge: 'SA-specific',
  },
  {
    icon: Calculator,
    title: 'UIF Calculator',
    desc: 'Instantly calculate your UIF benefit, income replacement ratio, and credit day entitlement using the current SARS ceiling of R17,712.',
    badge: 'SA-specific',
  },
  {
    icon: Bell,
    title: 'Reminders & Alerts',
    desc: 'Due dates, policy renewals, and tax deadlines surface in the dashboard. Red bell = overdue. Amber = due soon.',
  },
  {
    icon: HeartPulse,
    title: 'Financial Health Score',
    desc: 'A live 0–100 score across 10 dimensions: savings rate, debt ratio, emergency fund, investments, TFSA, property, insurance, and more.',
  },
];

const saStrip = [
  { label: 'SARS 2025/26 brackets', icon: '🏛️' },
  { label: 'FNB · Capitec · ABSA · Nedbank CSV', icon: '🏦' },
  { label: 'NCA debt ratio', icon: '📊' },
  { label: 'ZAR-native (no USD conversion)', icon: '💵' },
  { label: 'Stokvel pot management', icon: '🤝' },
  { label: 'Load-shedding aware reminders', icon: '⚡' },
];

export default function Features() {
  return (
    <>
      {/* SA strip — light */}
      <section id="sa" style={{ background: '#f0faf4', borderTop: '1px solid #c9e8d4', borderBottom: '1px solid #c9e8d4', padding: '18px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
            {saStrip.map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 7, background: '#fff', border: '1px solid #c0dfc9', borderRadius: 100, padding: '6px 14px' }}>
                <span>{s.icon}</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--green-dark)' }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main features — dark */}
      <section id="features" style={{ background: 'var(--dark-bg)', padding: '80px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 12 }}>
              Everything in one app
            </p>
            <h2 className="heading-lg" style={{ color: '#f0f0f0', marginBottom: 16 }}>
              Not just a budget app.{' '}
              <em className="accent">A complete financial OS.</em>
            </h2>
            <p style={{ fontSize: '1rem', color: '#a0a0a0', maxWidth: 520, margin: '0 auto' }}>
              Every feature is built for South African tax law, banking, and financial products — not adapted from a US template.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {mainFeatures.map(f => (
              <div key={f.title} className="feat-card">
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 12 }}>
                  <div style={{ background: 'rgba(90,156,110,0.15)', borderRadius: 8, padding: 10, flexShrink: 0 }}>
                    <f.icon size={18} style={{ color: 'var(--green-light)' }} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f0f0f0' }}>{f.title}</h3>
                      {f.badge && (
                        <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--gold)', background: 'rgba(212,169,74,0.12)', padding: '2px 7px', borderRadius: 4 }}>
                          {f.badge}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: '0.875rem', lineHeight: 1.65, color: '#888' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CSV import section — dark variant */}
      <section style={{ background: 'var(--dark-surface)', padding: '72px 0', borderTop: '1px solid var(--dark-border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>

            {/* Copy */}
            <div>
              <p style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 12 }}>
                Bank import
              </p>
              <h2 className="heading-lg" style={{ color: '#f0f0f0', marginBottom: 20 }}>
                Import your bank statement in{' '}
                <em className="accent">seconds.</em>
              </h2>
              <p style={{ fontSize: '1rem', color: '#a0a0a0', lineHeight: 1.7, marginBottom: 28 }}>
                Download your CSV from online banking, drag it in, and ClearLedger auto-categorises every transaction. No manual entry.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {['FNB', 'Capitec', 'ABSA', 'Nedbank', 'Standard Bank'].map(bank => (
                  <div key={bank} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green-light)', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.9rem', color: '#c0c0c0' }}>{bank}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mock import UI */}
            <div>
              <div style={{ background: '#0d1117', borderRadius: 12, border: '1px solid #2a3441', overflow: 'hidden' }}>
                <div style={{ padding: '14px 18px', borderBottom: '1px solid #2a3441', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Download size={14} style={{ color: 'var(--green-light)' }} />
                  <span style={{ fontSize: '0.8rem', color: '#888', fontFamily: 'monospace' }}>Import Transactions</span>
                </div>
                <div style={{ padding: '18px' }}>
                  <div style={{
                    border: '2px dashed #2a3441', borderRadius: 8, padding: '28px 20px',
                    textAlign: 'center', marginBottom: 16,
                    background: 'rgba(90,156,110,0.05)'
                  }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>📂</div>
                    <div style={{ fontSize: '0.8rem', color: '#888' }}>Drop your bank CSV here</div>
                    <div style={{ fontSize: '0.7rem', color: '#555', marginTop: 4 }}>FNB · Capitec · ABSA · Nedbank</div>
                  </div>
                  {[
                    { desc: 'Woolworths Food', amt: '-R 1,240', cat: 'Groceries', color: '#5a9c6e' },
                    { desc: 'Uber', amt: '-R 89', cat: 'Transport', color: '#d4a94a' },
                    { desc: 'Discovery Health', amt: '-R 3,200', cat: 'Medical', color: '#8da8ff' },
                  ].map(t => (
                    <div key={t.desc} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #2a3441' }}>
                      <div>
                        <div style={{ fontSize: '0.78rem', color: '#d0d0d0' }}>{t.desc}</div>
                        <div style={{ fontSize: '0.65rem', color: t.color, marginTop: 2 }}>{t.cat}</div>
                      </div>
                      <div style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#e05555' }}>{t.amt}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
