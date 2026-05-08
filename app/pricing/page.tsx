import Nav from '@/components/Nav';
import Pricing from '@/components/Pricing';
import Footer from '@/components/Footer';

export default function PricingPage() {
  return (
    <>
      <Nav />
      <main>
        <div style={{ background: 'var(--off-white)', padding: '48px 0 0', textAlign: 'center' }}>
          <div className="container">
            <p style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--green-dark)', marginBottom: 10 }}>
              Pricing
            </p>
            <h1 className="heading-xl" style={{ marginBottom: 16 }}>
              Simple, <em className="accent">transparent</em> pricing.
            </h1>
            <p style={{ fontSize: '1.05rem', color: 'var(--ink-soft)', maxWidth: 480, margin: '0 auto' }}>
              One plan. Every feature. Built for South African salaries.
            </p>
          </div>
        </div>
        <Pricing />
      </main>
      <Footer />
    </>
  );
}
