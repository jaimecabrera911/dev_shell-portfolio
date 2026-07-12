'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Project } from '../types';
import { X, ExternalLink, Github } from 'lucide-react';
import { useLocale } from '../contexts/LocaleContext';

interface ProjectDetailModalProps {
  project: Project;
  onClose: () => void;
  initialTab?: 'architecture' | 'code';
}

export default function ProjectDetailModal({ project, onClose }: ProjectDetailModalProps) {
  const { locale } = useLocale();
  
  const displayTitle = locale === 'en' && project.titleEn ? project.titleEn : project.title;
  const displayDescription = locale === 'en' && project.descriptionEn ? project.descriptionEn : project.description;
  const displayChallenges = locale === 'en' && project.challengesEn ? project.challengesEn : project.challenges;
  const displaySolutions = locale === 'en' && project.solutionsEn ? project.solutionsEn : project.solutions;
  const displayImpact = locale === 'en' && project.businessImpactEn ? project.businessImpactEn : project.businessImpact;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md overflow-y-auto cursor-pointer" 
      id="project-modal"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-5xl glass-card rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col animate-scale-up cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Terminal Header Bar */}
        <div className="bg-surface-container-low px-4 py-3 flex justify-between items-center border-b border-outline-variant/30">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80 cursor-pointer" onClick={onClose} />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <span className="w-3 h-3 rounded-full bg-green-500/80" />
            <span className="font-mono text-xs text-on-surface-variant ml-2 hidden sm:inline-block">
              dev_shell://project/{project.id}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer p-1 rounded-lg hover:bg-surface-container"
            id="modal-close-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto flex-1 custom-scrollbar">
          {/* Hero Image & Overlay */}
          <div className="relative h-48 md:h-64 w-full">
            <img 
              src={project.image} 
              alt={project.title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/60 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex flex-wrap gap-2 mb-2">
                {project.tags.map(tag => (
                  <span key={tag} className="px-2.5 py-0.5 bg-primary/20 text-primary font-mono text-[10px] uppercase rounded tracking-wider border border-primary/20">
                    {tag}
                  </span>
                ))}
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-on-surface leading-tight">
                {displayTitle}
              </h2>
            </div>
          </div>

          <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left/Middle Column (Details, Challenges, Solutions) */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h3 className="font-mono text-xs uppercase tracking-wider text-primary mb-2">Overview</h3>
                <p className="font-sans text-on-surface-variant leading-relaxed text-sm md:text-base">
                  {displayDescription}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/20">
                  <h4 className="font-mono text-xs uppercase tracking-wider text-red-400 mb-2 font-semibold">The Technical Challenge</h4>
                  <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                    {displayChallenges}
                  </p>
                </div>
                <div className="bg-surface-container-low p-4 rounded-xl border border-primary/20">
                  <h4 className="font-mono text-xs uppercase tracking-wider text-green-400 mb-2 font-semibold">Architectural Solution</h4>
                  <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                    {displaySolutions}
                  </p>
                </div>
              </div>

              {displayImpact && (
                <div className="bg-surface-container-low p-4 rounded-xl border border-secondary/20">
                  <h4 className="font-mono text-xs uppercase tracking-wider text-secondary mb-2 font-semibold">Business & Operational Impact</h4>
                  <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                    {displayImpact}
                  </p>
                </div>
              )}
            </div>

            {/* Right Column (Metadata, Action CTAs) */}
            <div className="space-y-6">
              <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/20">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs text-on-surface-variant">Year Developed</span>
                  <span className="font-mono text-xs font-semibold text-on-surface">{project.year}</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col gap-3">
                <a
                  href={project.demoUrl}
                  onClick={(e) => {
                    if (project.demoUrl === '#') e.preventDefault();
                  }}
                  className="inline-flex justify-center items-center gap-2 bg-primary text-on-primary hover:bg-opacity-90 px-4 py-3 rounded-lg font-mono text-xs font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
                  id="project-demo-btn"
                >
                  <ExternalLink className="w-4 h-4" />
                  Launch Platform Live
                </a>
                <a
                  href={project.githubUrl}
                  onClick={(e) => {
                    if (project.githubUrl === '#') e.preventDefault();
                  }}
                  className="inline-flex justify-center items-center gap-2 border border-outline-variant hover:border-primary/60 hover:text-primary hover:bg-primary/5 px-4 py-3 rounded-lg font-mono text-xs font-semibold text-on-surface transition-all hover:scale-[1.02] active:scale-[0.98]"
                  id="project-github-btn"
                >
                  <Github className="w-4 h-4" />
                  Browse Architecture Source
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
