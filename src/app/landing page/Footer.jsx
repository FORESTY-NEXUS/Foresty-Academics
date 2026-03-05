import Link from 'next/link';

const footerLinks = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Changelog', href: '/changelog' },
    { label: 'Roadmap', href: '/roadmap' },
    { label: 'Status', href: '/status' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' },
    { label: 'Contact', href: '/contact' },
  ],
  Resources: [
    { label: 'Documentation', href: '/docs' },
    { label: 'API Reference', href: '/api' },
    { label: 'Guides', href: '/guides' },
    { label: 'Help Center', href: '/help' },
    { label: 'Community', href: '/community' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'GDPR', href: '/gdpr' },
  ],
};

const socials = [
  {
    label: 'Twitter',
    href: 'https://twitter.com',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
        <path d="M16.99 0H20l-6.89 7.87L21 20h-5.71l-4.64-6.07L5.12 20H2.09l7.37-8.42L1 0h5.86l4.21 5.5L16.99 0zm-1.06 17.98h1.64L5.13 1.67H3.37l12.56 16.31z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
        <path d="M17.04 17.04h-2.96v-4.64c0-1.11-.02-2.53-1.54-2.53-1.54 0-1.78 1.2-1.78 2.44v4.73H7.8V7.5h2.84v1.3h.04c.4-.75 1.36-1.54 2.8-1.54 2.99 0 3.55 1.97 3.55 4.53v5.25zM4.45 6.2a1.72 1.72 0 110-3.44 1.72 1.72 0 010 3.44zM5.93 17.04H2.96V7.5h2.97v9.54zM18.52 0H1.47A1.46 1.46 0 000 1.44v17.12C0 19.35.66 20 1.47 20h17.05c.82 0 1.48-.65 1.48-1.44V1.44C20 .65 19.34 0 18.52 0z" />
      </svg>
    ),
  },
  {
    label: 'GitHub',
    href: 'https://github.com',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
        <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.836a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.137 18.163 20 14.418 20 10c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: 'https://youtube.com',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
        <path d="M19.6 5.2s-.2-1.4-.8-2c-.76-.8-1.62-.8-2-.85C14.4 2.2 10 2.2 10 2.2s-4.4 0-6.8.15c-.38.05-1.24.05-2 .85-.6.6-.8 2-.8 2S.2 6.77.2 8.33v1.46c0 1.56.2 3.12.2 3.12s.2 1.4.8 2c.76.8 1.76.77 2.2.85C4.8 15.96 10 16 10 16s4.4 0 6.8-.16c.38-.05 1.24-.05 2-.85.6-.6.8-2 .8-2s.2-1.56.2-3.12V8.33c0-1.56-.2-3.13-.2-3.13zM8 12.4V7.6l5.6 2.4L8 12.4z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-gold-500/10 bg-forest-950">
      {/* Top glow */}
      <div className="absolute top-0 left-0 right-0 h-px glow-line opacity-20" />
      <div className="absolute inset-0 z-20 bg-black/55 backdrop-blur-[1px] flex items-center justify-center">
        <div className="inline-flex items-center gap-2 rounded-full border  bg-black/40 px-4 py-2 text-white">
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
            <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.4" />
            <path d="M10 6.5v3.8l2.3 1.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <span className="font-bold text-xs tracking-wide uppercase text-4xl">Coming Soon</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer grid */}
        <div className="py-16 grid grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2 space-y-5">
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gold-400 to-gold-500 flex items-center justify-center shadow-lg shadow-gold-500/20">
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden="true">
                  <path d="M12 2L4 7v10l8 5 8-5V7L12 2z" fill="rgba(6,15,8,0.9)" />
                  <path d="M12 6l-4 2.5v5L12 16l4-2.5v-5L12 6z" fill="rgba(6,15,8,0.5)" />
                  <circle cx="12" cy="11" r="1.5" fill="rgba(6,15,8,0.9)" />
                </svg>
              </div>
              <div className="leading-none">
                <span className="block font-display text-lg font-semibold text-ivory-100 tracking-tight">Foresty</span>
                <span className="block font-mono text-[9px] text-gold-400 tracking-[0.2em] uppercase">Academics</span>
              </div>
            </Link>

            <p className="font-body text-sm text-ivory-100/40 leading-relaxed max-w-xs">
              The all-in-one institute management system built for educators who believe running a great school shouldn&apos;t require a full-time admin team.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-8 h-8 rounded-lg bg-forest-800/60 border border-gold-500/10 flex items-center justify-center text-ivory-100/40 hover:text-ivory-100/80 hover:border-gold-500/25 hover:bg-forest-700/60 transition-all duration-200"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="col-span-1 space-y-4">
              <h4 className="font-mono text-xs font-medium text-gold-400/70 tracking-widest uppercase">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="font-body text-sm text-ivory-100/40 hover:text-ivory-100/80 transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-gold-500/8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-ivory-100/30">
            © {new Date().getFullYear()} Foresty Academics. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="font-body text-xs text-ivory-100/30 hover:text-ivory-100/60 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="font-body text-xs text-ivory-100/30 hover:text-ivory-100/60 transition-colors">
              Terms
            </Link>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-forest-400 animate-pulse" />
              <span className="font-mono text-[10px] text-ivory-100/25">All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
