import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Pricing from '@/components/Pricing';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Features />

        {/* CTA band — dark green */}
        <section style={{ background: 'var(--green-dark)', padding: '64px 0' }}>
          <div className="container" style={{ textAlign: 'center' }}>
            <h2 className="heading-lg" style={{ color: '#fff', marginBottom: 16 }}>
              Ready to take control of your{' '}
              <em style={{ fontStyle: 'italic', color: 'var(--gold-light)' }}>financial future?</em>
            </h2>
            <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.7)', marginBottom: 32, maxWidth: 440, margin: '0 auto 32px' }}>
              14 days free. No credit card. Cancel anytime. Every feature from day one.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/auth/signup" className="btn-gold">
                Start free trial <ArrowRight size={16} />
              </Link>
              <Link href="/pricing" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                color: 'rgba(255,255,255,0.75)', fontSize: '0.95rem', fontWeight: 500,
                textDecoration: 'none', padding: '14px 20px',
                border: '1.5px solid rgba(255,255,255,0.25)', borderRadius: 6,
              }}>
                See pricing
              </Link>
            </div>
          </div>
        </section>

        <Pricing />
      </main>
      <Footer />
    </>
  );
}
