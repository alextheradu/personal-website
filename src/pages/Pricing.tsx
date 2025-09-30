import { useEffect } from 'react';
import PricingPlans from '../components/Pricing/Pricing';
import Footer from '../components/Footer/Footer';

export default function PricingPage() {
  // Reuse fade-in intersection effect like main App sections
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.2 });
    document.querySelectorAll('.fade-in-section').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="content-wrapper">
      <PricingPlans />
      <Footer />
    </div>
  );
}
