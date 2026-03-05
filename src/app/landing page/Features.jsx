'use client';

import { useEffect, useRef, useState } from 'react';

const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" aria-hidden="true">
        <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M3 9h18" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="8" cy="14" r="1.5" fill="currentColor" />
        <circle cx="12" cy="14" r="1.5" fill="currentColor" />
        <circle cx="16" cy="14" r="1.5" fill="currentColor" />
      </svg>
    ),
    title: 'Smart Attendance Tracking',
    description:
      'Mark, review, and export attendance in seconds. Get real-time insights on student presence with beautiful visual reports and instant alerts for chronic absences.',
    accent: 'from-forest-400/20 to-forest-600/10',
    border: 'border-forest-400/20',
    iconBg: 'bg-forest-500/20 text-forest-300',
    tag: 'Core Feature',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" aria-hidden="true">
        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: 'Student Management',
    description:
      'Maintain comprehensive student profiles  enrollment data, guardians, academic history, and documents  all searchable and organized in one place.',
    accent: 'from-gold-500/15 to-gold-400/5',
    border: 'border-gold-500/20',
    iconBg: 'bg-gold-500/15 text-gold-400',
    tag: 'Popular',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" aria-hidden="true">
        <rect x="2" y="6" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 12v4M10 14h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: 'Fee Records & Billing',
    description:
      'Track fee payments, generate receipts, set installment plans, and send automatic reminders for dues. Never miss a payment again.',
    accent: 'from-sky-500/15 to-sky-400/5',
    border: 'border-sky-500/20',
    iconBg: 'bg-sky-500/15 text-sky-400',
    tag: 'Finance',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" aria-hidden="true">
        <path d="M3 20h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M7 20V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M12 20V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M17 20V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="7" cy="8" r="2" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="12" cy="4" r="2" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="17" cy="11" r="2" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
    title: 'Reports & Analytics',
    description:
      'Generate detailed PDF and Excel reports. Visualize trends across attendance, fees, and academic performance. Make data-driven decisions effortlessly.',
    accent: 'from-violet-500/15 to-violet-400/5',
    border: 'border-violet-500/20',
    iconBg: 'bg-violet-500/15 text-violet-400',
    tag: 'Analytics',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" aria-hidden="true">
        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="17" cy="11" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M1 20c0-3.3 3.6-6 8-6s8 2.7 8 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M17 14c2.2.2 4 1.8 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: 'Multi-Teacher Access',
    description:
      'Assign role-based access for teachers, coordinators, and admins. Each person sees exactly what they need — no more, no less.',
    accent: 'from-amber-500/15 to-amber-400/5',
    border: 'border-amber-500/20',
    iconBg: 'bg-amber-500/15 text-amber-400',
    tag: 'Collaboration',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" aria-hidden="true">
        <path d="M4 4l16 16M4 20L20 4" stroke="currentColor" strokeWidth="0" />
        <rect x="2" y="3" width="20" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 12h2l2-5 2 10 2-5h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Timetable & Scheduling',
    description:
      'Build class schedules, assign teachers to batches, and sync with the attendance module. Avoid clashes and keep every class on track.',
    accent: 'from-rose-500/15 to-rose-400/5',
    border: 'border-rose-500/20',
    iconBg: 'bg-rose-500/15 text-rose-400',
    tag: 'Scheduling',
  },
];

function FeatureCard({ feature, index }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`card-glass rounded-2xl p-6 transition-all duration-700 cursor-default group ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-5">
        <div className={`w-12 h-12 rounded-xl ${feature.iconBg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
          {feature.icon}
        </div>
        <span className="font-mono text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full bg-forest-800/60 text-ivory-100/40 border border-forest-600/30">
          {feature.tag}
        </span>
      </div>

      <h3 className="font-display text-xl font-semibold text-ivory-100 mb-3 group-hover:text-gold-300 transition-colors duration-200">
        {feature.title}
      </h3>
      <p className="font-body text-sm text-ivory-100/50 leading-relaxed">
        {feature.description}
      </p>

      {/* Arrow on hover */}
      <div className="mt-5 flex items-center gap-1.5 text-gold-400/0 group-hover:text-gold-400/80 transition-all duration-300 translate-x-0 group-hover:translate-x-1">
     
      
      </div>
    </div>
  );
}

export default function Features() {
  return (
    <section id="features" className="relative py-24 lg:py-32">
      {/* Background */}
      <div className="absolute inset-0 bg-grid-forest opacity-50" />
      <div className="absolute top-0 left-0 right-0 h-px glow-line opacity-20" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <span
            className="mb-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-xs font-medium tracking-widest uppercase text-green-400/90"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none"><path d="M7 1l1.8 3.7L13 5.4l-3 2.9.7 4.1L7 10.3l-3.7 2.1.7-4.1-3-2.9 4.2-.7z" fill="currentColor" /></svg>
            Everything You Need
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-semibold text-ivory-100 mb-5 text-balance">
            Built for How Institutes{' '}
            <span className="italic" style={{ color: '#16A34A' }}>Actually Work</span>
          </h2>
          <p className="font-body text-base text-ivory-100/50 leading-relaxed">
            Every feature was designed after talking to real institute owners. No bloat, no fluff — just the tools that matter, refined to perfection.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
