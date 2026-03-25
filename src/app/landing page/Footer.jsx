import Link from 'next/link';

const footerLinks = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
  ],
  Contact: [
    { label: 'Email Us', href: 'mailto:forestynexus@gmail.com', external: true },
    { label: 'GitHub', href: 'https://github.com/FORESTY-NEXUS', external: true },
    { label: 'Instagram', href: 'https://www.instagram.com/kamal_.unfiltered?igsh=eWcydGZ2ZXlseXBl', external: true },
    { label: 'X', href: '#', disabled: true },
  ],
};

const socials = [
  {
    label: 'X',
    href: '#',
    disabled: true,
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
        <path d="M16.99 0H20l-6.89 7.87L21 20h-5.71l-4.64-6.07L5.12 20H2.09l7.37-8.42L1 0h5.86l4.21 5.5L16.99 0zm-1.06 17.98h1.64L5.13 1.67H3.37l12.56 16.31z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/kamal_.unfiltered?igsh=eWcydGZ2ZXlseXBl',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
        <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.8A3.95 3.95 0 0 0 3.8 7.75v8.5a3.95 3.95 0 0 0 3.95 3.95h8.5a3.95 3.95 0 0 0 3.95-3.95v-8.5a3.95 3.95 0 0 0-3.95-3.95h-8.5zm8.9 1.35a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.8A3.2 3.2 0 1 0 12 15.2 3.2 3.2 0 0 0 12 8.8z" />
      </svg>
    ),
  },
  {
    label: 'GitHub',
    href: 'https://github.com/FORESTY-NEXUS',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.836a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.137 18.163 20 14.418 20 10c0-5.523-4.477-10-10-10z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-gold-500/10 bg-forest-950">
      <div className="absolute top-0 left-0 right-0 h-px glow-line opacity-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="md:col-span-2 lg:col-span-8 space-y-5">
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

            <div className="flex items-center gap-3 ">
              {socials.map((social) =>
                social.disabled ? (
                  <span
                    key={social.label}
                    aria-label={`${social.label} coming soon`}
                    className="w-8 h-8 rounded-lg bg-forest-800/40 border border-gold-500/10 flex items-center justify-center text-ivory-100/20 cursor-not-allowed"
                  >
                    {social.icon}
                  </span>
                ) : (
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
                ),
              )}
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="md:col-span-1 lg:col-span-2 space-y-4">
              <h4 className="font-mono text-xs font-medium text-gold-400/70 tracking-widest uppercase">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.disabled ? (
                      <span className="font-body text-sm text-ivory-100/20 cursor-not-allowed">
                        {link.label}
                      </span>
                    ) : link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-body text-sm text-ivory-100/40 hover:text-ivory-100/80 transition-colors duration-200"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="font-body text-sm text-ivory-100/40 hover:text-ivory-100/80 transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="py-6 border-t border-gold-500/8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-ivory-100/30">
            &copy; {new Date().getFullYear()} Foresty Academics. All rights reserved.
          </p>
          <a
            href="mailto:forestynexus@gmail.com"
            className="font-body text-xs text-ivory-100/30 hover:text-ivory-100/60 transition-colors"
          >
            forestynexus@gmail.com
          </a>
        </div>
      </div>
    </footer>
  );
}
