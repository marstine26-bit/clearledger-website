'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav style={{ background: '#fff', borderBottom: '1px solid #ebebeb', position: 'sticky', top: 0, zIndex: 50 }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>

        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'baseline', gap: 2 }}>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', fontWeight: 400, color: 'var(--ink)' }}>
            Clear
          </span>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', fontWeight: 400, color: 'var(--green-dark)', fontStyle: 'italic' }}>
            Ledger
          </span>
          <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--ink-muted)', letterSpacing: '0.06em', marginLeft: 6, textTransform: 'uppercase' }}>
            Pro
          </span>
        </Link>

        {/* Desktop links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="desktop-nav">
          <a href="#features" className="nav-link">Features</a>
          <a href="#sa" className="nav-link">SA-First</a>
          <Link href="/pricing" className="nav-link">Pricing</Link>
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }} className="desktop-nav">
          <Link href="/auth/login" className="nav-link">Sign in</Link>
          <Link href="/auth/signup" className="btn-primary" style={{ padding: '9px 20px', fontSize: '0.88rem' }}>
            Start free trial
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
          className="mobile-menu-btn"
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div style={{ borderTop: '1px solid #ebebeb', background: '#fff', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <a href="#features" className="nav-link" onClick={() => setOpen(false)}>Features</a>
          <a href="#sa" className="nav-link" onClick={() => setOpen(false)}>SA-First</a>
          <Link href="/pricing" className="nav-link" onClick={() => setOpen(false)}>Pricing</Link>
          <hr style={{ border: 'none', borderTop: '1px solid #ebebeb' }} />
          <Link href="/auth/login" className="nav-link">Sign in</Link>
          <Link href="/auth/signup" className="btn-primary" style={{ textAlign: 'center', justifyContent: 'center' }}>
            Start free trial
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
