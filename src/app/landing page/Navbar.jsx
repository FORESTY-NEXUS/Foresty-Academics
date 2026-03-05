'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing',  href: '#pricing'  },
  { label: 'About',    href: '#how-it-works' },
];

const NavLink = ({ href, children, onClick }) => (
  <Link
    href={href}
    onClick={onClick}
    className="relative text-sm font-medium text-white/55 hover:text-white transition-colors duration-200 group py-1"
  >
    {children}
    <span className="absolute -bottom-0.5 left-0 w-0 h-[1.5px] bg-green-400 rounded-full transition-all duration-300 group-hover:w-full" />
  </Link>
);

export default function Navbar() {
  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-500
        ${scrolled
          ? 'bg-[#050f08]/90 backdrop-blur-xl border-b border-green-500/10 py-3'
          : 'bg-transparent py-5'}
      `}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

        {/* ── Logo ── */}
        <Link href="/" className="flex items-center gap-3 group">
          {/* conic-gradient ring */}
       
           
      

          {/* wordmark */}
          <div className="leading-none">
            <span
              className="block text-3xl font-bold tracking-tight text-white"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Foresty
            </span>
          
          </div>
        </Link>

        {/* ── Desktop nav links ── */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ label, href }) => (
            <NavLink key={label} href={href}>{label}</NavLink>
          ))}
        </div>

        {/* ── Desktop CTA ── */}
        <div className="hidden md:flex items-center gap-4">
          {/* live badge */}
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
                       bg-green-400/10 border border-green-400/20
                       text-[10px] font-medium tracking-widest uppercase text-green-400/90"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            <span className="w-[5px] h-[5px] rounded-full bg-green-400 animate-pulse" />
            Beta
          </span>

          <Link
            href="/login"
            className="text-[13.5px] font-medium text-white/40 hover:text-white/90 transition-colors duration-200"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="group relative inline-flex items-center gap-1.5 px-[18px] py-[9px]
                       rounded-[10px] text-[13.5px] font-semibold text-white overflow-hidden
                       transition-all duration-300
                       hover:-translate-y-[1.5px]
                       hover:shadow-[0_5px_22px_rgba(22,163,74,0.45)]"
            style={{
              background: 'linear-gradient(135deg,#16a34a,#15803d)',
              boxShadow:  '0 2px 12px rgba(22,163,74,0.28), 0 1px 3px rgba(0,0,0,0.2)',
            }}
          >
            {/* shimmer overlay on hover */}
            <span
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{ background: 'linear-gradient(135deg,rgba(255,255,255,0.12) 0%,transparent 60%)' }}
            />
            Create Your Institute
            <svg
              className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-[3px]"
              viewBox="0 0 16 16" fill="none" aria-hidden="true"
            >
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>

        {/* ── Mobile hamburger ── */}
        <button
          onClick={() => setMobileOpen(prev => !prev)}
          aria-label="Toggle menu"
          className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-[5px]
                     rounded-lg border border-green-500/15 bg-green-600
                     hover:border-green-500/35 hover:bg-green-500/[0.08]
                     transition-colors duration-200"
        >
          <span className={`w-4 h-[1.5px] bg-white/75 rounded-full transition-all duration-300
                            ${mobileOpen ? 'rotate-45 translate-y-[3.5px]' : ''}`} />
          <span className={`w-4 h-[1.5px] bg-white/75 rounded-full transition-all duration-300
                            ${mobileOpen ? 'opacity-0 scale-x-0' : ''}`} />
          <span className={`w-4 h-[1.5px] bg-white/75 rounded-full transition-all duration-300
                            ${mobileOpen ? '-rotate-45 -translate-y-[3.5px]' : ''}`} />
        </button>
      </nav>

      {/* ── Mobile menu ── */}
      <div
        className={`
          md:hidden overflow-hidden transition-all duration-300
          bg-[#030a05]/98 backdrop-blur-xl border-t border-green-500/[0.07]
          ${mobileOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}
        `}
      >
        <div className="px-4 pt-4 pb-6 flex flex-col gap-0.5">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center px-3 py-[11px] rounded-lg
                         text-sm font-medium text-white/50 hover:text-white
                         hover:bg-green-400/[0.07] transition-colors duration-200"
            >
              {label}
            </Link>
          ))}

          <div className="my-2.5 h-px bg-green-500/[0.08]" />

          <Link
            href="/login"
            onClick={() => setMobileOpen(false)}
            className="px-3 py-[11px] text-sm font-medium text-white/35
                       hover:text-white/80 transition-colors duration-200"
          >
            Login
          </Link>

          <Link
            href="/register"
            onClick={() => setMobileOpen(false)}
            className="group relative mt-1 flex items-center justify-center gap-1.5
                       px-4 py-[10px] rounded-[10px] text-sm font-semibold text-white
                       overflow-hidden transition-all duration-300
                       hover:shadow-[0_4px_18px_rgba(22,163,74,0.4)]"
            style={{ background: 'linear-gradient(135deg,#16a34a,#15803d)' }}
          >
            <span
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{ background: 'linear-gradient(135deg,rgba(255,255,255,0.1) 0%,transparent 60%)' }}
            />
            Create Your Institute
            <svg
              className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-[3px]"
              viewBox="0 0 16 16" fill="none" aria-hidden="true"
            >
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
}