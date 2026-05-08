'use client';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    // Supabase auth will be wired here
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
          No account? <Link href="/auth/signup" style={{ color: 'var(--green-dark)', fontWeight: 600, textDecoration: 'none' }}>Start free trial</Link>
        </span>
      </nav>

      {/* Form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <div style={{ marginBottom: 32 }}>
            <h1 className="heading-md" style={{ color: 'var(--ink)', marginBottom: 6 }}>Welcome <em className="accent">back.</em></h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--ink-muted)' }}>Sign in to your ClearLedger account</p>
          </div>

          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e4e4e4', padding: '32px 28px', boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink)', marginBottom: 6 }}>
                  Email address
                </label>
                <input
                  type="email"
                  className="input-field"
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink)' }}>Password</label>
                  <a href="#" style={{ fontSize: '0.8rem', color: 'var(--green-dark)', textDecoration: 'none' }}>Forgot?</a>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPw ? 'text' : 'password'}
                    className="input-field"
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
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
                {loading ? 'Signing in…' : <>Sign in <ArrowRight size={15} /></>}
              </button>
            </form>

            <div className="divider-text" style={{ margin: '20px 0' }}>or</div>

            {/* Google OAuth placeholder */}
            <button
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                padding: '12px 20px', border: '1.5px solid #d0d0d0', borderRadius: 6,
                background: '#fff', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500,
                transition: 'border-color 0.2s',
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

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.82rem', color: 'var(--ink-muted)' }}>
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" style={{ color: 'var(--green-dark)', fontWeight: 600, textDecoration: 'none' }}>
              Start your 14-day free trial
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
