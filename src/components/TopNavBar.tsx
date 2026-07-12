'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
 
import { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import TypewriterLogo from './TypewriterLogo';

interface TopNavBarProps {
  onResumeClick: () => void;
}

export default function TopNavBar({ onResumeClick }: TopNavBarProps) {
  const [activeSection, setActiveSection] = useState('projects');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['projects', 'stack', 'experience', 'contact'];
      let current = '';

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          // If the section top is close to or above the screen center
          if (rect.top <= window.innerHeight / 2) {
            current = section;
          }
        }
      }
      if (current) {
        setActiveSection(current);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      const offset = 80; // height of fixed navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-outline-variant/30 shadow-sm transition-all duration-300">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-6 h-16">
        {/* Logo */}
        <div 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          id="nav-logo"
        >
          <img src="/logo.png" alt="JaiCabDev Logo" className="w-16 h-16 object-contain rounded-md" />
          <TypewriterLogo className="text-xl font-black tracking-tight text-on-surface" />
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { id: 'projects', label: 'Projects' },
            { id: 'stack', label: 'Stack' },
            { id: 'experience', label: 'Experience' },
            { id: 'contact', label: 'Contact' }
          ].map((item) => (
            <button
              key={item.id}
              id={`nav-link-${item.id}`}
              onClick={() => scrollToSection(item.id)}
              className={`font-mono text-sm tracking-wide transition-all duration-200 cursor-pointer pb-1 border-b-2 ${
                activeSection === item.id
                  ? 'text-primary font-bold border-primary'
                  : 'text-on-surface-variant border-transparent hover:text-primary hover:border-primary/40'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Resume Button */}
        <div className="hidden md:block">
          <button
            onClick={onResumeClick}
            className="inline-flex items-center gap-1.5 bg-primary text-on-primary px-5 py-2 rounded-lg font-mono text-xs font-bold active:scale-95 transition-all hover:opacity-90 duration-150 cursor-pointer"
            id="nav-resume-btn"
          >
            Resume
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-on-surface hover:text-primary focus:outline-none p-1.5"
            aria-label="Toggle Menu"
            id="mobile-menu-toggle"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-outline-variant/40 bg-background/95 backdrop-blur-xl px-6 py-4 space-y-4" id="mobile-menu-drawer">
          <div className="flex flex-col gap-3">
            {[
              { id: 'projects', label: 'Projects' },
              { id: 'stack', label: 'Stack' },
              { id: 'experience', label: 'Experience' },
              { id: 'contact', label: 'Contact' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`text-left font-mono py-2 text-sm border-b border-outline-variant/10 ${
                  activeSection === item.id
                    ? 'text-primary font-bold'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                onResumeClick();
              }}
              className="inline-flex justify-center items-center gap-1.5 bg-primary text-on-primary py-2.5 rounded-lg font-mono text-sm font-bold mt-2 cursor-pointer"
            >
              Resume
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
