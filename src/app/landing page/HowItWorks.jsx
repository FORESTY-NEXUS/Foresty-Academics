'use client';

import { useEffect, useRef, useState } from 'react';

const steps = [
  {
    number: '01',
    title: 'Admin Sets Up Institute',
    description:
      'Create classes, register teachers, and assign teachers to classes from the admin panel. This sets up the full academic structure before daily operations begin.',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8" aria-hidden="true">
        <rect x="4" y="6" width="24" height="20" rx="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M16 13v6M13 16h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M4 11h24" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="8" cy="8.5" r="1" fill="currentColor" />
        <circle cx="11.5" cy="8.5" r="1" fill="currentColor" />
        <circle cx="15" cy="8.5" r="1" fill="currentColor" />
      </svg>
    ),
    visual: {
      label: 'Classes + Teachers Ready',
      sublabel: 'Class assignments completed',
      icon: (
        <svg viewBox="0 0 20 20" className="w-5 h-5" fill="none" aria-hidden="true">
          <path d="M2.5 8.5 10 4l7.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 8.5v6.5h12V8.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8 15V11h4v4" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      ),
      color: 'text-forest-300',
      bg: 'bg-forest-500/15',
    },
  },
  {
    number: '02',
    title: 'Teacher Manages Daily Work',
    description:
      'Teachers add students, upload profile photos, mark attendance, enter marks, and update fee status. Everything stays class-wise and organized in one place.',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8" aria-hidden="true">
        <circle cx="13" cy="11" r="5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M4 26c0-5 4-9 9-9s9 4 9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="24" cy="15" r="3" stroke="currentColor" strokeWidth="1.3" />
        <path d="M21 26c0-3 1.3-5.5 4-6.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M28 11v4M26 13h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
    visual: {
      label: 'Attendance, Marks, Fees Updated',
      sublabel: 'Per class and per student records',
      icon: (
        <svg viewBox="0 0 20 20" className="w-5 h-5" fill="none" aria-hidden="true">
          <circle cx="10" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M4 16c0-2.8 2.7-5 6-5s6 2.2 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M2.5 10h3M14.5 10h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
      color: 'text-gold-400',
      bg: 'bg-gold-500/15',
    },
  },
  {
    number: '03',
    title: 'Students Track Progress',
    description:
      'Students log in to view attendance, marks, fee status, and report card. This gives families a clear academic view without manual follow-up.',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8" aria-hidden="true">
        <rect x="3" y="3" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <rect x="17" y="3" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <rect x="3" y="17" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <rect x="17" y="17" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9 9.5l1.5 1.5 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M23 9.5l1.5 1.5 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 23.5l1.5 1.5 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M23 23.5l1.5 1.5 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    visual: {
      label: 'Live Student Portal',
      sublabel: 'Dashboard, fee status, report card',
      icon: (
        <svg viewBox="0 0 20 20" className="w-5 h-5" fill="none" aria-hidden="true">
          <path d="M4 4.5h8a2 2 0 0 1 2 2V15H6a2 2 0 0 0-2 2V4.5Z" stroke="currentColor" strokeWidth="1.5" />
          <path d="M6 7.5h6M6 10h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M4 17h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
      color: 'text-sky-400',
      bg: 'bg-sky-500/15',
    },
  },
];

function StepCard({ step, index }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true);
    }, { threshold: 0.2 });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`relative transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      {index < steps.length - 1 && (
        <div
          className="hidden lg:block absolute top-16 left-[calc(100%-1px)] w-full h-px z-0"
          style={{ background: 'linear-gradient(90deg, rgba(201,168,76,0.3), rgba(201,168,76,0.05))' }}
        />
      )}

      <div className="card-glass rounded-2xl p-7 relative z-10 group hover:border-gold-500/25 transition-all duration-300">
        <div className="flex items-start justify-between mb-6">
          <div className="w-14 h-14 rounded-2xl bg-forest-800/80 border border-gold-500/15 flex items-center justify-center text-gold-400 group-hover:border-gold-500/30 group-hover:bg-forest-700/60 transition-all duration-300">
            {step.icon}
          </div>
          <span className="font-display text-5xl font-bold text-forest-700/60 group-hover:text-forest-600/80 transition-colors duration-300 leading-none">
            {step.number}
          </span>
        </div>

        <h3 className="font-display text-2xl font-semibold text-ivory-100 mb-3">{step.title}</h3>
        <p className="font-body text-sm text-ivory-100/50 leading-relaxed mb-6">{step.description}</p>

        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl ${step.visual.bg} border border-current/10`}>
          <span className="text-xl">{step.visual.icon}</span>
          <div>
            <div className={`font-body text-sm font-medium ${step.visual.color}`}>{step.visual.label}</div>
            <div className="font-mono text-[10px] text-ivory-100/35">{step.visual.sublabel}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HowItWorks() {
  const headerRef = useRef(null);
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setHeaderVisible(true);
    }, { threshold: 0.3 });

    if (headerRef.current) observer.observe(headerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="how-it-works" className="relative py-24 lg:py-32">
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(15,41,18,0.4) 50%, transparent 100%)' }}
      />
      <div className="absolute top-0 left-0 right-0 h-px glow-line opacity-15" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={headerRef}
          className={`max-w-2xl mx-auto text-center mb-16 transition-all duration-700 ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <span
            className="mb-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-xs font-medium tracking-widest uppercase text-white"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
              <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Real Workflow
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-semibold text-ivory-100 mb-5 text-balance">
            What Foresty Academics Offers in{' '}
            <span className="italic" style={{ color: '#16A34A' }}>Three Steps</span>
          </h2>
          <p className="font-body text-base text-ivory-100/50 leading-relaxed">
            A complete operational loop: admin structure, teacher execution, and student visibility.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-5 lg:gap-6">
          {steps.map((step, i) => (
            <StepCard key={step.number} step={step} index={i} />
          ))}
        </div>

        <div
          className={`mt-14 text-center transition-all duration-700 delay-500 ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <p className="font-body text-sm text-ivory-100/35">
            Covers attendance, marks, fees, classes, teachers, and student report cards from one platform.
          </p>
        </div>
      </div>
    </section>
  );
}
