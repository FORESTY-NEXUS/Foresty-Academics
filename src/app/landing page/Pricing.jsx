'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const plans = [
  {
    name: 'Free',
    priceLabel: 'Free',
    subLabel: 'forever',
    description: 'Best for early testing and small institute workflows.',
    cta: 'Get Started Free',
    ctaHref: '/register',
    highlight: false,
    features: [
      { text: 'Student management', included: true },
      { text: 'Attendance tracking', included: true },
      { text: 'Marks and fee records', included: true },
      { text: 'Student report card view', included: true },
      { text: 'Custom institute name', included: false },
      { text: 'Custom logo', included: false },
      { text: 'Custom theme colors', included: false },
    ],
  },
  {
    name: 'Paid',
    priceLabel: '1,000',
    subLabel: 'PKR / month',
    description: 'Customization and premium controls for branded institutes.',
    cta: 'Coming Soon',
    ctaHref: '#',
    highlight: true,
    features: [
      { text: 'No Ads', included: true },
      { text: 'Custom institute name', included: true },
      { text: 'Custom logo upload', included: true },
      { text: 'Custom theme colors', included: true },
      { text: 'Priority support', included: true },
      { text: 'Early premium features', included: true },
    ],
  },
];

function CheckIcon({ included }) {
  if (included) {
    return (
      <svg className="w-4 h-4 text-green-300 flex-shrink-0" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="7" fill="rgba(34,197,94,0.2)" stroke="rgba(134,239,172,0.45)" />
        <path d="M5 8l2 2 4-4" stroke="#86efac" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg className="w-4 h-4 text-ivory-100/20 flex-shrink-0" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="7" stroke="rgba(253,251,245,0.1)" />
      <path d="M6 10l4-4M10 10L6 6" stroke="rgba(253,251,245,0.2)" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export default function Pricing() {
  const headerRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [showSoon, setShowSoon] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true);
    }, { threshold: 0.1 });
    if (headerRef.current) observer.observe(headerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="pricing" className="relative py-24 lg:py-32">
      <div className="absolute inset-0 bg-grid-forest opacity-40" />
      <div className="absolute top-0 left-0 right-0 h-px glow-line opacity-20" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={headerRef}
          className={`max-w-2xl mx-auto text-center mb-12 transition-all duration-700 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <span
            className="mb-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-xs font-medium tracking-widest uppercase text-green-400/90"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none">
              <path d="M7 1l1.5 3L12 5l-2.5 2.5.6 3.5L7 9.3l-3.1 1.7.6-3.5L2 5l3.5-1L7 1z" fill="currentColor" />
            </svg>
            Beta Pricing
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-semibold text-ivory-100 mb-5 text-balance">
            Simple Plans,{' '}
            <span className="italic text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #4ade80, #16a34a, #86efac)' }}>
              Green Growth
            </span>
          </h2>
          <p className="font-body text-base text-ivory-100/50 leading-relaxed">
            Start free today. Paid customization features are planned and currently marked as coming soon.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5 items-stretch">
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-7 flex flex-col transition-all duration-700 ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              } ${
                plan.highlight
                  ? 'bg-gradient-to-b from-green-700/30 to-forest-800/60 border border-green-500/35 shadow-2xl shadow-green-500/10'
                  : 'card-glass border border-green-500/15'
              }`}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              {plan.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-mono font-semibold tracking-wider bg-green-500 text-forest-950">
                  BETA - COMING SOON
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-display text-2xl font-semibold text-ivory-100 mb-1">{plan.name}</h3>
                <p className="font-body text-sm text-ivory-100/45">{plan.description}</p>
              </div>

              <div className="mb-7">
                {plan.name === 'Free' ? (
                  <div className="flex items-end gap-2">
                    <span className="font-display text-5xl font-semibold text-ivory-100">{plan.priceLabel}</span>
                    <span className="font-body text-sm text-ivory-100/40 mb-2">{plan.subLabel}</span>
                  </div>
                ) : (
                  <div className="flex items-end gap-2">
                    <span className="font-mono text-sm text-ivory-100/50 mb-3">PKR</span>
                    <span className="font-display text-5xl font-semibold text-ivory-100">{plan.priceLabel}</span>
                    <span className="font-body text-sm text-ivory-100/40 mb-2">/month</span>
                  </div>
                )}
              </div>

              <div className="w-full h-px bg-green-500/20 mb-6" />

              <ul className="space-y-3 flex-1 mb-7">
                {plan.features.map((feat) => (
                  <li key={feat.text} className="flex items-center gap-3">
                    <CheckIcon included={feat.included} />
                    <span className={`font-body text-sm ${feat.included ? 'text-ivory-100/75' : 'text-ivory-100/28'}`}>
                      {feat.text}
                    </span>
                  </li>
                ))}
              </ul>

              {plan.name === 'Free' ? (
                <Link
                  href={plan.ctaHref}
                  className="w-full py-3 rounded-[10px] text-sm font-semibold text-white text-center transition-all duration-300 hover:-translate-y-[1px] hover:shadow-[0_6px_24px_rgba(22,163,74,0.45)]"
                  style={{
                    background: 'linear-gradient(135deg,#16a34a,#15803d)',
                    boxShadow: '0 2px 14px rgba(22,163,74,0.3), 0 1px 3px rgba(0,0,0,0.2)',
                  }}
                >
                  {plan.cta}
                </Link>
              ) : (
                <div
                  className="group"
                  onMouseEnter={() => setShowSoon(true)}
                  onMouseLeave={() => setShowSoon(false)}
                >
                  <button
                    type="button"
                    onClick={() => setShowSoon(true)}
                    className="w-full py-3 rounded-[10px] text-sm font-semibold text-green-200 border border-green-500/35 bg-green-500/10 hover:bg-green-500/15 transition-all duration-300"
                  >
                    {plan.cta}
                  </button>
                  <p
                    className={`mt-2 text-center font-mono text-[11px] text-green-300/90 transition-opacity duration-200 ${
                      showSoon ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    We are in beta. Paid version is coming soon.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <p className={`text-center mt-10 font-body text-sm text-ivory-100/35 transition-all duration-700 delay-400 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}>
          Free plan is active now. Premium customization and branded experience will be released after beta.
        </p>
      </div>
    </section>
  );
}
