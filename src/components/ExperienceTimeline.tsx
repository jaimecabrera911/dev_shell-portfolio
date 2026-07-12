'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { getResumeData } from '../utils/storage';
import { Calendar, Building, Briefcase } from 'lucide-react';
import { ExperienceItem } from '../types';

export default function ExperienceTimeline() {
  const [description, setDescription] = useState('');
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);

  useEffect(() => {
    // Only call getResumeData once mounted on the client to avoid SSR/hydration mismatches
    getResumeData()
      .then((data) => {
        setExperiences(data.experience || []);
        setDescription(data.workstoryDescription || '');
      })
      .catch((err) => console.error('Error loading experience timeline:', err));

    const handleResumeChange = () => {
      getResumeData()
        .then((data) => {
          setExperiences(data.experience || []);
          setDescription(data.workstoryDescription || '');
        })
        .catch((err) => console.error('Error loading experience timeline on event:', err));
    };
    window.addEventListener('devshell_resume_updated', handleResumeChange);
    return () => {
      window.removeEventListener('devshell_resume_updated', handleResumeChange);
    };
  }, []);

  if (experiences.length === 0) return null;

  // Quadruple up the items to ensure there is enough horizontal width for a seamless loop on any screen resolution
  const duplicatedExperiences = [...experiences, ...experiences, ...experiences, ...experiences];

  return (
    <section className="py-20 bg-surface-container-low overflow-hidden" id="experience">
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div className="max-w-xl">
          <span className="font-mono text-xs uppercase tracking-widest text-primary block mb-2">Track Record</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-on-surface mb-3">Work History</h2>
          <p className="font-sans text-on-surface-variant text-sm md:text-base leading-relaxed">
            {description || 'Over 6 years of experience designing, developing, and optimizing high-throughput digital products and backend infrastructure for startups and enterprise clients worldwide.'}
          </p>
        </div>
      </div>

      {/* Infinite scrolling marquee wrapper */}
      <div className="relative py-4 select-none group" id="experience-marquee-container">
        {/* Gradients to fade edge scrolling */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-surface-container-low to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-surface-container-low to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee flex gap-8 items-stretch py-2">
          {duplicatedExperiences.map((exp, idx) => (
            <div
              key={`${exp.id}-${idx}`}
              className="w-[360px] md:w-[420px] shrink-0 glass-card p-6 rounded-2xl border border-outline-variant/15 hover:border-primary/40 bg-surface-container-lowest/80 backdrop-blur-sm transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(192,193,255,0.06)] flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start gap-4 mb-4 pb-3 border-b border-outline-variant/10">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Briefcase className="w-4 h-4 text-primary shrink-0" />
                      <h4 className="font-display text-sm md:text-base font-extrabold text-on-surface">
                        {exp.role}
                      </h4>
                    </div>
                    <div className="flex items-center gap-1.5 text-on-surface-variant font-mono text-[11px] font-semibold">
                      <Building className="w-3.5 h-3.5" />
                      {exp.company}
                    </div>
                  </div>
                  <span className="font-mono text-[9px] md:text-[10px] text-secondary bg-secondary/5 border border-secondary/15 px-2 py-0.5 rounded-lg flex items-center gap-1 shrink-0">
                    <Calendar className="w-3.5 h-3.5" />
                    {exp.period}
                  </span>
                </div>

                <ul className="space-y-2.5 list-none">
                  {exp.bulletPoints && exp.bulletPoints.map((point, ptIdx) => (
                    <li key={ptIdx} className="text-on-surface-variant text-[11px] md:text-xs leading-relaxed flex items-start gap-2">
                      <span className="text-primary font-bold mt-0.5 select-none">›</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
