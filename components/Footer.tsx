import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--dark-bg)', borderTop: '1px solid var(--dark-border)', padding: '48px 0 28px' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, marginBottom: 40 }}>

          {/* Brand col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, marginBottom: 12 }}>
              <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#e0e0e0' }}>Clear</span>
              <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: 'var(--green-light)', fontStyle: 'italic' }}>Ledger</span>
              <span style={{ fontSize: '0.65rem', fontWeight: 600, color: '#666', letterSpacing: '0.06em', marginLeft: 5, textTransform: 'uppercase' }}>Pro</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#666', lineHeight: 1.6, maxWidth: 240 }}>
              The complete financial OS for South African professionals. Built for ZAR, SARS, and real SA life.
            </p>
            <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: '1rem' }}>🇿🇦</span>
              <span style={{ fontSize: '0.75rem', color: '#555', fontWeight: 600 }}>Made in South Africa</span>
            </div>
          </div>

          {/* Product */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#555', marginBottom: 14 }}>
              Product
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Features', href: '/#features' },
                { label: 'Pricing', href: '/pricing' },
                { label: 'SA-First', href: '/#sa' },
              ].map(l => (
                <Link key={l.label} href={l.href} style={{ fontSize: '0.87rem', color: '#666', textDecoration: 'none', transition: 'color 0.15s' }}
                  className="footer-link">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Account */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#555', marginBottom: 14 }}>
              Account
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Sign in', href: '/auth/login' },
                { label: 'Start free trial', href: '/auth/signup' },
              ].map(l => (
                <Link key={l.label} href={l.href} style={{ fontSize: '0.87rem', color: '#666', textDecoration: 'none' }} className="footer-link">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#555', marginBottom: 14 }}>
              Legal
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Privacy policy', href: '/privacy' },
                { label: 'Terms of service', href: '/terms' },
              ].map(l => (
                <Link key={l.label} href={l.href} style={{ fontSize: '0.87rem', color: '#666', textDecoration: 'none' }} className="footer-link">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

        </div>

        <div style={{ borderTop: '1px solid var(--dark-border)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: '0.78rem', color: '#444' }}>
            © {new Date().getFullYear()} ClearLedger Pro · South Africa
          </p>
          <p style={{ fontSize: '0.75rem', color: '#444', maxWidth: 380, textAlign: 'right' }}>
            ClearLedger is a personal finance tool. It does not provide financial advice. Tax estimates are indicative only — consult a registered tax practitioner for formal filings.
          </p>
        </div>
      </div>

      <style>{`
        .footer-link:hover { color: var(--green-light) !important; }
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
