'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { getResumeData } from '../utils/storage';
import { GraduationCap, BookOpen } from 'lucide-react';
import { EducationItem } from '../types';
import { useLocale } from '../contexts/LocaleContext';

export default function EducationSection() {
  const { t } = useLocale();
  const [education, setEducation] = useState<EducationItem[]>([]);
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

  const toggleAutoPlay = () => {
    if (isAutoPlay) {
      convertTransformToScroll();
    } else {
      setIsAutoPlay(true);
    }
  };

  useEffect(() => {
    // Fetch custom education data once mounted
    getResumeData()
      .then((data) => {
        setEducation(data.education || []);
      })
      .catch((err) => console.error('Error loading education section:', err));

    const handleResumeChange = () => {
      getResumeData()
        .then((data) => {
          setEducation(data.education || []);
        })
        .catch((err) => console.error('Error loading education section on event:', err));
    };
    window.addEventListener('devshell_resume_updated', handleResumeChange);
    return () => {
      window.removeEventListener('devshell_resume_updated', handleResumeChange);
    };
  }, []);

  // Standard fallback if education registry is empty
  const defaultEducation = [
    {
      id: 'edu-default-1',
      degree: t('education.degree.fallback'),
      school: t('education.school.fallback'),
      details: t('education.details.fallback')
    }
  ];

  const currentEducation = education.length > 0 ? education : defaultEducation;
  
  // Quadruple up the items to ensure there is enough horizontal width for a seamless loop on any screen resolution
  const duplicatedEducation = [...currentEducation, ...currentEducation, ...currentEducation, ...currentEducation];
  const displayEducation = isAutoPlay ? duplicatedEducation : currentEducation;

  return (
    <section className="py-20 bg-surface-container-low border-t border-outline-variant/15 relative overflow-hidden" id="education-section">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 mb-12">
        <div className="max-w-xl">
          <span className="font-mono text-xs uppercase tracking-widest text-primary block mb-2">{t('education.eyebrow')}</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-on-surface mb-3">{t('education.title')}</h2>
          <p className="font-sans text-on-surface-variant text-sm md:text-base leading-relaxed">
            {t('education.description')}
          </p>
          <span className="text-[10px] font-mono text-primary/80 mt-2.5 block uppercase tracking-wider">
            ⚡ {t('education.hint')}
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
        id="education-marquee-container"
      >
        {/* Gradients to fade edge scrolling */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-surface-container-low to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-surface-container-low to-transparent z-10 pointer-events-none" />

        <div 
          ref={innerRef}
          className={`flex gap-8 items-stretch py-2 ${isAutoPlay ? 'animate-marquee' : 'px-6'}`}
        >
          {displayEducation.map((edu, idx) => (
            <div
              key={`${edu.id}-${idx}`}
              className="w-[360px] md:w-[420px] shrink-0 glass-card p-6 rounded-2xl border border-outline-variant/15 hover:border-primary/40 bg-surface-container-lowest/80 backdrop-blur-sm transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_0_35px_rgba(192,193,255,0.06)] flex gap-4"
            >
              <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/10 text-primary shrink-0 h-fit self-start">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="space-y-2 min-w-0">
                <h4 className="font-display text-base md:text-lg font-extrabold text-on-surface leading-snug">
                  {edu.degree}
                </h4>
                <div className="flex items-center gap-1.5 text-on-surface-variant font-mono text-[11px] font-semibold">
                  <BookOpen className="w-3.5 h-3.5 text-secondary" />
                  <span>{edu.school}</span>
                </div>
                <p className="font-sans text-xs text-on-surface-variant/90 leading-relaxed border-l-2 border-primary/20 pl-3 mt-2">
                  {edu.details}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
