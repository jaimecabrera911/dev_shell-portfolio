'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { getResumeData } from '../utils/storage';
import { Calendar, Building, Briefcase, Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';
import { ExperienceItem } from '../types';
import { useLocale } from '../contexts/LocaleContext';

export default function ExperienceTimeline() {
  const { t } = useLocale();
  const [description, setDescription] = useState('');
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  // Mouse Drag States
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const dragDistance = useRef(0);
  const mouseDownTime = useRef(0);

  // Touch Swipe States
  const touchStartX = useRef(0);
  const touchScrollLeft = useRef(0);
  const touchDragDistance = useRef(0);
  const touchStartTime = useRef(0);

  const convertTransformToScroll = () => {
    if (!containerRef.current || !innerRef.current) return;
    try {
      const style = window.getComputedStyle(innerRef.current);
      const transform = style.transform;
      if (transform && transform !== 'none') {
        let translateX = 0;
        if (typeof window.DOMMatrixReadOnly !== 'undefined') {
          const matrix = new window.DOMMatrixReadOnly(transform);
          translateX = matrix.m41;
        } else {
          const values = transform.split('(')[1].split(')')[0].split(',');
          translateX = parseFloat(values[4]) || 0;
        }
        setIsAutoPlay(false);
        containerRef.current.scrollLeft = -translateX;
      } else {
        setIsAutoPlay(false);
      }
    } catch (err) {
      setIsAutoPlay(false);
      console.error('Error converting transform to scroll:', err);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    // Pause animation and convert transform to scrollLeft dynamically
    if (isAutoPlay) {
      convertTransformToScroll();
    }
    
    setIsDragging(true);
    startX.current = e.pageX - containerRef.current.offsetLeft;
    scrollLeft.current = containerRef.current.scrollLeft;
    dragDistance.current = 0;
    mouseDownTime.current = Date.now();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5; // scroll speed multiplier
    containerRef.current.scrollLeft = scrollLeft.current - walk;
    dragDistance.current = Math.abs(x - startX.current);
  };

  const handleMouseUpOrLeave = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const clickDuration = Date.now() - mouseDownTime.current;
    if (dragDistance.current < 8 && clickDuration < 300) {
      // Simple click -> Toggle Play/Pause
      toggleAutoPlay();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!containerRef.current) return;
    
    if (isAutoPlay) {
      convertTransformToScroll();
    }
    
    touchStartX.current = e.touches[0].pageX - containerRef.current.offsetLeft;
    touchScrollLeft.current = containerRef.current.scrollLeft;
    touchDragDistance.current = 0;
    touchStartTime.current = Date.now();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!containerRef.current) return;
    const x = e.touches[0].pageX - containerRef.current.offsetLeft;
    const walk = (x - touchStartX.current) * 1.5;
    containerRef.current.scrollLeft = touchScrollLeft.current - walk;
    touchDragDistance.current = Math.abs(x - touchStartX.current);
  };

  const handleTouchEnd = () => {
    const clickDuration = Date.now() - touchStartTime.current;
    if (touchDragDistance.current < 8 && clickDuration < 300) {
      toggleAutoPlay();
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (isAutoPlay) {
      convertTransformToScroll();
    }
    setTimeout(() => {
      if (containerRef.current) {
        const scrollAmount = 400;
        containerRef.current.scrollBy({
          left: direction === 'left' ? -scrollAmount : scrollAmount,
          behavior: 'smooth'
        });
      }
    }, 10);
  };

  const toggleAutoPlay = () => {
    if (isAutoPlay) {
      convertTransformToScroll();
    } else {
      setIsAutoPlay(true);
    }
  };

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
  const displayExperiences = isAutoPlay ? duplicatedExperiences : experiences;

  return (
    <section className="py-20 bg-surface-container-low overflow-hidden" id="experience">
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div className="max-w-xl">
          <span className="font-mono text-xs uppercase tracking-widest text-primary block mb-2">{t('experience.eyebrow')}</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-on-surface mb-3">{t('experience.title')}</h2>
          <p className="font-sans text-on-surface-variant text-sm md:text-base leading-relaxed">
            {description || t('experience.description.fallback')}
          </p>
          <span className="text-[10px] font-mono text-primary/80 mt-2.5 block uppercase tracking-wider">
            {t('experience.hint')}
          </span>
        </div>
      </div>

      {/* Infinite scrolling marquee wrapper */}
      <div 
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`relative py-4 select-none group cursor-grab active:cursor-grabbing ${isAutoPlay ? 'overflow-hidden' : 'overflow-x-auto scroll-smooth custom-scrollbar-hide'}`} 
        id="experience-marquee-container"
      >
        {/* Gradients to fade edge scrolling */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-surface-container-low to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-surface-container-low to-transparent z-10 pointer-events-none" />

        <div 
          ref={innerRef}
          className={`flex gap-8 items-stretch py-2 ${isAutoPlay ? 'animate-marquee' : 'px-6'}`}
        >
          {displayExperiences.map((exp, idx) => (
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
