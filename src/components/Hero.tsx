/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ArrowRight, MessageSquareCode, Download } from 'lucide-react';
import { CertificationItem } from '../types';

interface HeroProps {
  onResumeClick: () => void;
  pdfBase64?: string;
  pdfFileName?: string;
  title?: string;
  availability?: string;
  certifications?: CertificationItem[];
  subtitle?: string;
}

export default function Hero({ onResumeClick, pdfBase64, pdfFileName, title, availability, certifications, subtitle }: HeroProps) {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
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
    <section className="relative min-h-screen flex items-center pt-20 bg-grid overflow-hidden" id="hero-section">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-background pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 w-full relative z-10 pt-16 md:pt-24 pb-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Column 1: Hero Text Content */}
          <div className="lg:col-span-7 flex flex-col justify-center pb-8 lg:pb-0">
            {/* Status badge */}
            <div 
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-8 animate-fade-in self-start"
              id="hero-status-badge"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="font-mono text-[10px] md:text-xs font-semibold uppercase tracking-widest text-primary">
                {availability ? `Availability: ${availability}` : 'Available for new projects'}
              </span>
            </div>

            {/* Heading */}
            <h1 
              className="font-display text-4xl md:text-6xl font-bold tracking-tighter text-on-surface mb-6 leading-tight"
              id="hero-headline"
            >
              {(() => {
                const displayTitle = title || 'Fullstack Developer & Solutions Architect';
                if (displayTitle.includes('&')) {
                  const parts = displayTitle.split('&');
                  const part1 = parts[0]?.trim();
                  const part2 = parts[1]?.trim();
                  return (
                    <>
                      {part1} <br />
                      <span className="text-primary relative inline-block">
                        {part2}
                        <span className="absolute bottom-1 left-0 w-full h-[6px] bg-primary/20 -z-10 rounded-full" />
                      </span>
                    </>
                  );
                } else if (displayTitle.toLowerCase().includes(' and ')) {
                  const parts = displayTitle.split(/ and /i);
                  const part1 = parts[0]?.trim();
                  const part2 = parts[1]?.trim();
                  return (
                    <>
                      {part1} <br />
                      <span className="text-primary relative inline-block">
                        {part2}
                        <span className="absolute bottom-1 left-0 w-full h-[6px] bg-primary/20 -z-10 rounded-full" />
                      </span>
                    </>
                  );
                }
                return displayTitle;
              })()}
            </h1>

            {/* Subtitle description */}
            <p 
              className="font-sans text-base md:text-lg text-on-surface-variant leading-relaxed max-w-2xl mb-10"
              id="hero-subtitle"
            >
              {subtitle || 'Crafting resilient, high-performance web applications and cloud architectures. Specialized in bridging sophisticated frontend aesthetics with robust distributed backends.'}
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 items-center" id="hero-cta-group">
              {/* Primary CTA: Interactive CV / Resume */}
              <button
                onClick={onResumeClick}
                className="inline-flex items-center justify-center gap-2 bg-primary text-on-primary hover:bg-opacity-95 px-6 py-3.5 rounded-lg font-mono text-xs font-bold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-md shadow-primary/10"
                id="hero-cv-btn"
              >
                Interactive CV / Resume
                <MessageSquareCode className="w-3.5 h-3.5 animate-pulse" />
              </button>

              {/* Secondary CTA: View Projects */}
              <button
                onClick={() => scrollToSection('projects')}
                className="inline-flex items-center justify-center gap-2 border border-primary/50 text-primary hover:border-primary hover:bg-primary/5 px-6 py-3.5 rounded-lg font-mono text-xs font-bold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                id="hero-projects-btn"
              >
                View Projects
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* Optional CTA: Download PDF (Subtle border button) */}
              {pdfBase64 && (
                <a
                  href={pdfBase64}
                  download={pdfFileName || 'resume.pdf'}
                  className="inline-flex items-center justify-center gap-2 border border-outline-variant/40 text-on-surface-variant hover:text-primary hover:border-primary/40 hover:bg-primary/5 px-5 py-3.5 rounded-lg font-mono text-xs font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  id="hero-pdf-btn"
                  title="Download Attached PDF Resume"
                >
                  Download PDF
                  <Download className="w-3.5 h-3.5" />
                </a>
              )}

              {/* Text link: Let's Talk */}
              <button
                onClick={() => scrollToSection('contact')}
                className="font-mono text-xs font-bold text-on-surface-variant hover:text-primary transition-colors cursor-pointer ml-2 py-2"
                id="hero-contact-btn"
              >
                Let's Talk →
              </button>
            </div>

            {/* Certifications Row */}
            {certifications && certifications.length > 0 && (
              <div className="mt-8 pt-6 border-t border-outline-variant/10 flex flex-wrap items-center gap-4 animate-fade-in">
                <span className="font-mono text-[9px] uppercase tracking-wider text-on-surface-variant font-bold opacity-60">
                  Credentials Node:
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {certifications.map((cert) => (
                    <div 
                      key={cert.id}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container-low rounded-xl border border-outline-variant/15 text-on-surface-variant font-mono text-[10px] hover:border-primary/30 transition-colors"
                      title={cert.details}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                      {cert.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Column 2: Developer Portrait Image */}
          <div className="lg:col-span-5 w-full flex justify-center items-end self-end">
            <div className="relative group w-full max-w-[440px] lg:max-w-full">
              {/* Decorative back glow */}
              <div className="absolute inset-0 bg-primary/20 rounded-t-2xl rounded-b-none blur-xl group-hover:bg-primary/30 transition-all duration-300 pointer-events-none" />
              {/* Styled Image Wrapper */}
              <div className="relative glass-card p-2 rounded-t-2xl rounded-b-none border-b-0 overflow-hidden border border-outline-variant/30 shadow-2xl transition-all duration-500 hover:scale-[1.01] hover:border-primary/40 flex items-end">
                <img 
                  src="/developer.png" 
                  alt="Developer Portrait" 
                  className="w-full h-auto rounded-t-xl rounded-b-none object-cover grayscale hover:grayscale-0 transition-all duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Futuristic Background Ambient Glows */}
      <div className="absolute right-[-10%] top-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px] pointer-events-none hidden lg:block" />
      <div className="absolute left-[5%] bottom-[10%] w-[300px] h-[300px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none hidden lg:block" />
    </section>
  );
}
