'use client';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, Check, Eye, EyeOff } from 'lucide-react';

const trialPerks = [
  '14 days free — no credit card',
  'All features unlocked from day one',
  'SARS 2025/26 tax brackets included',
  'Cancel anytime, no questions asked',
];

export default function SignupPage() {
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1200);
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--off-white)', display: 'flex', flexDirection: 'column' }}>
      {/* Minimal nav */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #ebebeb', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'baseline', gap: 2 }}>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: 'var(--ink)' }}>Clear</span>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: 'var(--green-dark)', fontStyle: 'italic' }}>Ledger</span>
          <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--ink-muted)', letterSpacing: '0.06em', marginLeft: 5, textTransform: 'uppercase' }}>Pro</span>
        </Link>
        <span style={{ fontSize: '0.85rem', color: 'var(--ink-muted)' }}>
          Have an account? <Link href="/auth/login" style={{ color: 'var(--green-dark)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
        </span>
      </nav>

      {/* Two-column layout */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ width: '100%', maxWidth: 860, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>

          {/* Left — social proof */}
          <div>
            <div style={{ marginBottom: 8 }}>
              <span className="sa-badge"><span>🇿🇦</span><span>South Africa · ZAR-native</span></span>
            </div>
            <h1 className="heading-lg" style={{ color: 'var(--ink)', margin: '16px 0 12px' }}>
              Start your free <em className="accent">14-day trial.</em>
            </h1>
            <p style={{ fontSize: '0.95rem', color: 'var(--ink-soft)', lineHeight: 1.7, marginBottom: 28 }}>
              ClearLedger gives South African professionals a complete view of their finances — budget, tax, net worth, and more.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {trialPerks.map(p => (
                <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--green-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Check size={11} style={{ color: '#fff' }} />
                  </div>
                  <span style={{ fontSize: '0.9rem', color: 'var(--ink-soft)' }}>{p}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 36, padding: '16px 18px', background: '#f0faf4', border: '1px solid #c0dfc9', borderRadius: 10 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>💬</span>
                <div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: 8, fontStyle: 'italic' }}>
                    &ldquo;Finally found something that actually understands SA tax. The ITR12 estimate saved me hours.&rdquo;
                  </p>
                  <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--green-dark)' }}>— Beta user, Johannesburg</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right — form */}
          <div>
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e4e4e4', padding: '32px 28px', boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink)', marginBottom: 6 }}>First name</label>
                    <input type="text" className="input-field" placeholder="Thabo" required autoComplete="given-name" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink)', marginBottom: 6 }}>Last name</label>
                    <input type="text" className="input-field" placeholder="Mokoena" required autoComplete="family-name" />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink)', marginBottom: 6 }}>Email address</label>
                  <input type="email" className="input-field" placeholder="you@example.com" required autoComplete="email" />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink)', marginBottom: 6 }}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPw ? 'text' : 'password'}
                      className="input-field"
                      placeholder="At least 8 characters"
                      required
                      minLength={8}
                      autoComplete="new-password"
                      style={{ paddingRight: 42 }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-muted)', display: 'flex', alignItems: 'center' }}
                    >
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  style={{ justifyContent: 'center', marginTop: 4, opacity: loading ? 0.7 : 1 }}
                  disabled={loading}
                >
                  {loading ? 'Creating account…' : <>Start free trial <ArrowRight size={15} /></>}
                </button>

                <p style={{ fontSize: '0.75rem', color: 'var(--ink-muted)', textAlign: 'center', lineHeight: 1.5 }}>
                  By signing up you agree to our{' '}
                  <Link href="/terms" style={{ color: 'var(--green-dark)', textDecoration: 'none' }}>Terms</Link>
                  {' '}and{' '}
                  <Link href="/privacy" style={{ color: 'var(--green-dark)', textDecoration: 'none' }}>Privacy Policy</Link>.
                </p>
              </form>

              <div className="divider-text" style={{ margin: '20px 0' }}>or</div>

              <button
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  padding: '12px 20px', border: '1.5px solid #d0d0d0', borderRadius: 6,
                  background: '#fff', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500,
                }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18">
                  <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 002.38-5.88c0-.57-.05-.66-.15-1.18z"/>
                  <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 01-7.18-2.54H1.83v2.07A8 8 0 008.98 17z"/>
                  <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 010-3.04V5.41H1.83a8 8 0 000 7.18l2.67-2.07z"/>
                  <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 001.83 5.4L4.5 7.49a4.77 4.77 0 014.48-3.3z"/>
                </svg>
                Continue with Google
              </button>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 700px) {
          .signup-grid { grid-template-columns: 1fr !important; }
          .signup-left { display: none; }
        }
      `}</style>
    </div>
  );
}
