'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ArrowUp, Terminal } from 'lucide-react';
import Link from 'next/link';
import TypewriterLogo from './TypewriterLogo';
import { useLocale } from '../contexts/LocaleContext';

export default function Footer() {
  const { t, locale } = useLocale();
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="bg-surface-container-lowest py-10 border-t border-outline-variant/20">
      <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto px-6 w-full gap-6">
        {/* Left Column Logo */}
        <div 
          onClick={scrollToTop}
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          id="footer-logo"
        >
          <img src="/logo.png" alt="JaiCabDev Logo" className="w-12 h-12 object-contain rounded-md" />
          <TypewriterLogo className="text-lg font-black tracking-tight text-on-surface" />
        </div>

        {/* Middle/Right Column Links */}
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex gap-6" id="footer-links-group">
            {[
              { href: '#', label: t('contact.github') },
              { href: '#', label: t('contact.linkedin') },
              { href: '#', label: t('contact.twitter') },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  if (link.href === '#') e.preventDefault();
                }}
                className="font-mono text-xs text-on-surface-variant hover:text-secondary hover:translate-y-[-2px] transition-all duration-300"
              >
                {link.label}
              </a>
            ))}
            {/* Admin Console Link */}
            <Link
              href="/admin/login"
              className="font-mono text-xs text-primary hover:text-secondary hover:translate-y-[-2px] transition-all duration-300 cursor-pointer flex items-center gap-1"
            >
              <Terminal className="w-3 h-3" />
              Admin
            </Link>
          </div>

          <p className="font-mono text-[10px] text-on-surface-variant">
            © 2026 JaiCab. {locale === 'es' ? 'Construido para el rendimiento.' : 'Built for performance.'}
          </p>

          <button
            onClick={scrollToTop}
            className="p-2 rounded-lg bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-on-surface-variant hover:text-primary transition-all cursor-pointer shadow-sm active:scale-95"
            title="Back to Top"
            id="footer-back-to-top-btn"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
