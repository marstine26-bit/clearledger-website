import Link from 'next/link';
import { Check, ArrowRight } from 'lucide-react';

const features = [
  'Unlimited accounts & transactions',
  'ITR12 tax estimator (SARS 2025/26)',
  'Bank CSV import — FNB, Capitec, ABSA, Nedbank',
  'Budget planner with rollover',
  'Net worth tracker + NW history',
  'TFSA tracker & contribution limits',
  'UIF benefit calculator',
  'Property & bond equity tracker',
  'Insurance policy manager + auto-reminders',
  'Split bills & stokvel management',
  'Cashflow forecasting (12 months)',
  'Savings rate dashboard',
  'Financial health score (10 dimensions)',
  'Investment & portfolio tracker',
  'What-if scenario planner',
  'Retirement projector',
  'AI financial assistant (ask anything)',
  'Reminders & due-date alerts',
  'CSV / PDF data export',
];

export default function Pricing() {
  return (
    <section style={{ background: 'var(--off-white)', padding: '80px 0' }}>
      <div className="container" style={{ maxWidth: 680 }}>

        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--green-dark)', marginBottom: 12 }}>
            Simple pricing
          </p>
          <h2 className="heading-lg" style={{ marginBottom: 16 }}>
            One plan. <em className="accent">Everything included.</em>
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--ink-soft)', lineHeight: 1.6 }}>
            No feature tiers. No upsells. Every tool available from day one.
          </p>
        </div>

        {/* Pricing card */}
        <div style={{
          background: '#fff',
          border: '2px solid var(--green-dark)',
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0 12px 40px rgba(15,81,50,0.1)',
        }}>
          {/* Header */}
          <div style={{ background: 'var(--green-dark)', padding: '32px 36px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>
                  ClearLedger Pro
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontFamily: 'monospace', fontSize: '3rem', fontWeight: 700, color: '#fff', lineHeight: 1 }}>R99</span>
                  <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>/month</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ background: 'var(--gold)', color: 'var(--ink)', padding: '6px 14px', borderRadius: 100, fontSize: '0.8rem', fontWeight: 700, marginBottom: 6 }}>
                  Save 25%
                </div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem' }}>
                  R890/year billed annually
                </div>
              </div>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem', marginTop: 16 }}>
              14-day free trial · No credit card required · Cancel anytime
            </p>
          </div>

          {/* Features list */}
          <div style={{ padding: '28px 36px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 16px', marginBottom: 28 }}>
              {features.map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <Check size={14} style={{ color: 'var(--green-light)', flexShrink: 0, marginTop: 3 }} />
                  <span style={{ fontSize: '0.84rem', color: 'var(--ink-soft)', lineHeight: 1.5 }}>{f}</span>
                </div>
              ))}
            </div>

            <Link href="/auth/signup" className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '1rem', padding: '16px 28px' }}>
              Start 14-day free trial <ArrowRight size={16} />
            </Link>

            <p style={{ textAlign: 'center', marginTop: 14, fontSize: '0.8rem', color: 'var(--ink-muted)' }}>
              Already have an account? <Link href="/auth/login" style={{ color: 'var(--green-dark)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
            </p>
          </div>
        </div>

        {/* FAQ strip */}
        <div style={{ marginTop: 48, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <h3 className="heading-md" style={{ color: 'var(--ink)', marginBottom: 8 }}>Common questions</h3>
          {[
            {
              q: 'Is my data stored securely?',
              a: 'Yes. Your data is encrypted at rest and in transit, stored in Supabase (EU region). We never sell or share it.',
            },
            {
              q: 'Does it connect to my bank directly?',
              a: 'Not yet — you import your transactions via CSV (supported by all major SA banks). Direct bank feeds are on our roadmap.',
            },
            {
              q: 'Can I cancel at any time?',
              a: 'Absolutely. Cancel from settings with one click. Your data export is always available, even after cancellation.',
            },
            {
              q: 'Are the tax brackets kept up to date?',
              a: 'Yes. We update brackets, rebates, and medical credit rates with each SARS budget announcement.',
            },
          ].map(faq => (
            <div key={faq.q} style={{ padding: '18px 20px', background: '#fff', borderRadius: 8, border: '1px solid #e4e4e4' }}>
              <div style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--ink)', marginBottom: 6 }}>{faq.q}</div>
              <div style={{ fontSize: '0.87rem', color: 'var(--ink-soft)', lineHeight: 1.6 }}>{faq.a}</div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
