'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export default function CTA() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [showDemoSoon, setShowDemoSoon] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true);
    }, { threshold: 0.2 });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const trustItems = [
    {
      text: 'Security',
      icon: (
        <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" aria-hidden="true">
          <path d="M10 2.5 4 5v4.5c0 3.2 2.2 6.2 6 8 3.8-1.8 6-4.8 6-8V5l-6-2.5Z" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      ),
    },
    {
      text: 'Quick Setup ',
      icon: (
        <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" aria-hidden="true">
          <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.4" />
          <path d="M10 6v4l2.5 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      text: 'Cancel anytime',
      icon: (
        <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" aria-hidden="true">
          <path d="M4 10h12M10 4v12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      ),
    },
    {
      text: 'Easy management',
      icon: (
        <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" aria-hidden="true">
          <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.4" />
          <path d="M3.5 15c.7-2.1 2.5-3.5 4.5-3.5s3.8 1.4 4.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M13.5 8.5h3M15 7v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      ),
    },
  ];

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(15,41,18,0.6) 100%)' }} />
      <div className="absolute top-0 left-0 right-0 h-px glow-line opacity-20" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full blur-[100px] opacity-20" style={{ background: 'radial-gradient(ellipse, #276b2f 0%, transparent 70%)' }} />
      <div className="absolute bottom-0 right-1/4 w-[300px] h-[200px] rounded-full blur-[80px] opacity-15" style={{ background: 'radial-gradient(ellipse, #22c55e 0%, transparent 70%)' }} />

      <div className="absolute top-12 left-12 w-24 h-24 rounded-full border border-green-500/15 animate-float" style={{ animationDelay: '0s' }} />
      <div className="absolute bottom-16 right-16 w-16 h-16 rounded-full border border-forest-400/15 animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-8 w-2 h-2 rounded-full bg-green-400/50 animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/3 right-12 w-2 h-2 rounded-full bg-forest-300/40 animate-float" style={{ animationDelay: '3s' }} />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center" ref={ref}>
        <div className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <span
            className="mb-8 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-xs font-medium tracking-widest uppercase text-green-400/90"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Start Today
          </span>
        </div>

        <div className={`transition-all duration-700 delay-100 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl font-semibold text-ivory-100 leading-[1.05] mb-6 text-balance">
            Launch Your Institute{' '}
            <span
              className="block italic"
              style={{
                background: 'linear-gradient(135deg, #86efac 0%, #22c55e 45%, #16a34a 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Today
            </span>
          </h2>
        </div>

        <div className={`transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <p className="font-body text-lg text-ivory-100/50 max-w-xl mx-auto leading-relaxed mb-10">
            Join 500+ institute owners who&apos;ve taken control of their management. Free plan available. No credit card required.
          </p>
        </div>

        <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 transition-all duration-700 delay-300 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}>
          <Link
            href="/register"
            className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-[12px] text-base font-semibold text-white overflow-hidden transition-all duration-300 hover:-translate-y-[1.5px] hover:shadow-[0_6px_24px_rgba(22,163,74,0.45)]"
            style={{
              background: 'linear-gradient(135deg,#16a34a,#15803d)',
              boxShadow: '0 2px 14px rgba(22,163,74,0.3), 0 1px 3px rgba(0,0,0,0.2)',
            }}
          >
            <span
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{ background: 'linear-gradient(135deg,rgba(255,255,255,0.12) 0%,transparent 60%)' }}
            />
            Create Your Institute - Free
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>

          <div className="group" onMouseEnter={() => setShowDemoSoon(true)} onMouseLeave={() => setShowDemoSoon(false)}>
            <button
              type="button"
              onClick={() => setShowDemoSoon(true)}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-[12px] text-base font-medium text-white/70 border border-white/10 bg-white/[0.04] hover:text-white hover:border-green-500/30 hover:bg-green-500/[0.07] transition-all duration-200"
            >
              Watch a Demo
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.3" />
                <path d="M8 7.5l5 2.5-5 2.5V7.5z" fill="currentColor" />
              </svg>
            </button>
            <p className={`mt-2 text-center font-mono text-[11px] text-green-300/90 transition-opacity duration-200 ${showDemoSoon ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
              Demo is coming soon. We are in beta.
            </p>
          </div>
        </div>

        <div className={`flex flex-wrap items-center justify-center gap-6 transition-all duration-700 delay-400 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}>
          {trustItems.map((item) => (
            <div key={item.text} className="flex items-center gap-2">
              <span className="text-green-300">{item.icon}</span>
              <span className="font-body text-sm text-ivory-100/40">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
