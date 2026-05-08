import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const proof = [
  'SARS ITR12 tax estimate in seconds',
  'FNB · Capitec · ABSA · Nedbank CSV import',
  'TFSA, UIF, stokvel — all SA-native',
];

export default function Hero() {
  return (
    <section style={{ background: 'var(--off-white)', paddingTop: 72, paddingBottom: 80 }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>

          {/* Left — copy */}
          <div>
            <div style={{ marginBottom: 20 }}>
              <span className="sa-badge">
                <span>🇿🇦</span>
                <span>South Africa · ZAR-native</span>
              </span>
            </div>

            <h1 className="heading-xl" style={{ marginBottom: 20, color: 'var(--ink)' }}>
              Know exactly where every rand goes —{' '}
              <em className="accent">and where it should.</em>
            </h1>

            <p style={{ fontSize: '1.1rem', lineHeight: 1.7, color: 'var(--ink-soft)', marginBottom: 32, maxWidth: 480 }}>
              Budget, invest, pay tax, and track your net worth — all built for South African salaries.
              No generic templates. No USD assumptions. Just your rands, working harder.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 36 }}>
              {proof.map(p => (
                <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <CheckCircle2 size={16} style={{ color: 'var(--green-light)', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.92rem', color: 'var(--ink-soft)' }}>{p}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href="/auth/signup" className="btn-primary">
                Start 14-day free trial <ArrowRight size={16} />
              </Link>
              <a href="#features" className="btn-ghost">
                See features
              </a>
            </div>

            <p style={{ marginTop: 16, fontSize: '0.82rem', color: 'var(--ink-muted)' }}>
              No credit card required · Cancel anytime
            </p>
          </div>

          {/* Right — app mockup */}
          <div style={{ position: 'relative' }}>
            <div className="mockup-shadow" style={{ background: '#0d1117', borderRadius: 12, overflow: 'hidden' }}>
              {/* Simulated app chrome */}
              <div style={{ background: '#161d27', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid #2a3441' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
                <span style={{ marginLeft: 8, fontSize: '0.75rem', color: '#666', fontFamily: 'monospace' }}>ClearLedger Pro</span>
              </div>

              {/* Mock dashboard */}
              <div style={{ padding: '20px 18px', background: '#0d1117' }}>
                {/* Net worth bar */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: '0.7rem', color: '#888', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Net Worth</div>
                  <div style={{ fontFamily: 'monospace', fontSize: '1.8rem', color: '#d4a94a', fontWeight: 700 }}>R 1,247,500</div>
                  <div style={{ fontSize: '0.75rem', color: '#5a9c6e', marginTop: 2 }}>▲ R 18,200 this month</div>
                </div>

                {/* Mini stat grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
                  {[
                    { label: 'Budget left', value: 'R 4,820', color: '#5a9c6e' },
                    { label: 'Tax estimate', value: 'R 2,100 refund', color: '#d4a94a' },
                    { label: 'TFSA room', value: 'R 312,000', color: '#8da8ff' },
                    { label: 'Savings rate', value: '24%', color: '#5a9c6e' },
                  ].map(s => (
                    <div key={s.label} style={{ background: '#161d27', borderRadius: 8, padding: '10px 12px', border: '1px solid #2a3441' }}>
                      <div style={{ fontSize: '0.65rem', color: '#888', marginBottom: 3 }}>{s.label}</div>
                      <div style={{ fontFamily: 'monospace', fontSize: '0.82rem', color: s.color, fontWeight: 700 }}>{s.value}</div>
                    </div>
                  ))}
                </div>

                {/* Progress bars */}
                {[
                  { label: 'Groceries', used: 68, color: '#5a9c6e' },
                  { label: 'Transport', used: 45, color: '#d4a94a' },
                  { label: 'Entertainment', used: 92, color: '#e05555' },
                ].map(b => (
                  <div key={b.label} style={{ marginBottom: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                      <span style={{ fontSize: '0.7rem', color: '#aaa' }}>{b.label}</span>
                      <span style={{ fontSize: '0.7rem', color: '#aaa', fontFamily: 'monospace' }}>{b.used}%</span>
                    </div>
                    <div style={{ height: 4, background: '#2a3441', borderRadius: 2 }}>
                      <div style={{ height: 4, width: `${b.used}%`, background: b.color, borderRadius: 2 }} />
                    </div>
                  </div>
                ))}

                {/* Health score */}
                <div style={{ marginTop: 14, padding: '10px 12px', background: '#161d27', borderRadius: 8, border: '1px solid #2a3441', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.7rem', color: '#888' }}>Financial Health Score</span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
                    <span style={{ fontFamily: 'monospace', fontSize: '1.2rem', color: '#d4a94a', fontWeight: 700 }}>78</span>
                    <span style={{ fontSize: '0.65rem', color: '#888' }}>/100</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div style={{
              position: 'absolute', bottom: -16, left: -16,
              background: '#fff', borderRadius: 10, padding: '10px 14px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              display: 'flex', alignItems: 'center', gap: 8,
              border: '1px solid #ebebeb'
            }}>
              <span style={{ fontSize: '1.1rem' }}>🇿🇦</span>
              <div>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--green-dark)' }}>SARS 2025/26</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--ink-muted)' }}>Tax brackets updated</div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-mockup { display: none; }
        }
      `}</style>
    </section>
  );
}
