'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
 
import { useState } from 'react';
import { TECH_STACK } from '../data';
import { TechItem } from '../types';
import { 
  Layers, Database, Cpu, HardDrive, Code, Shield, 
  Server, Box, Cloud, Globe, Terminal, Network, Github 
} from 'lucide-react';

export const getDeviconClass = (iconName: string) => {
  const normalized = iconName.trim().toLowerCase();
  
  // Custom manual mappings
  if (normalized === 'reactnative' || normalized === 'react native') {
    return 'devicon-react-original colored';
  }
  if (normalized === 'aws' || normalized === 'amazon web services') {
    return 'devicon-amazonwebservices-plain-wordmark colored';
  }
  if (normalized === 'next' || normalized === 'next.js' || normalized === 'nextjs') {
    return 'devicon-nextjs-plain';
  }
  if (normalized === 'go' || normalized === 'golang') {
    return 'devicon-go-original-wordmark colored';
  }
  if (normalized === 'cplusplus' || normalized === 'c++') {
    return 'devicon-cplusplus-plain colored';
  }
  if (normalized === 'node' || normalized === 'nodejs') {
    return 'devicon-nodejs-plain colored';
  }
  if (normalized === 'postgres' || normalized === 'postgresql') {
    return 'devicon-postgresql-plain colored';
  }
  if (normalized === 'mysql') {
    return 'devicon-mysql-plain colored';
  }
  if (normalized === 'mongodb') {
    return 'devicon-mongodb-plain colored';
  }
  if (normalized === 'firebase') {
    return 'devicon-firebase-plain colored';
  }
  if (normalized === 'sqlite') {
    return 'devicon-sqlite-plain colored';
  }
  if (normalized === 'express') {
    return 'devicon-express-original';
  }
  if (normalized === 'vue' || normalized === 'vuejs') {
    return 'devicon-vuejs-plain colored';
  }
  if (normalized === 'angular') {
    return 'devicon-angularjs-plain colored';
  }
  if (normalized === 'tailwind' || normalized === 'tailwindcss') {
    return 'devicon-tailwindcss-plain colored';
  }
  if (normalized === 'bootstrap') {
    return 'devicon-bootstrap-plain colored';
  }
  if (normalized === 'sass') {
    return 'devicon-sass-original colored';
  }
  
  // If it already has a Devicon style suffix (plain, original, line, wordmark, etc.)
  if (
    normalized.includes('-plain') || 
    normalized.includes('-original') || 
    normalized.includes('-line') || 
    normalized.includes('-wordmark')
  ) {
    const baseClass = normalized.startsWith('devicon-') ? normalized : `devicon-${normalized}`;
    const needsColored = !normalized.includes('github') && !normalized.includes('nextjs');
    return needsColored ? `${baseClass} colored` : baseClass;
  }
  
  // Default fallback
  return `devicon-${normalized}-plain colored`;
};

interface TechCardProps {
  tech: TechItem;
  idx: number;
}

function TechCard({ tech, idx }: TechCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isCustomColor = tech.color && tech.color.trim() !== '';
  const deviconClass = getDeviconClass(tech.icon);
  const finalClass = isCustomColor ? deviconClass.replace('colored', '') : deviconClass;

  const cardStyle = isHovered && isCustomColor 
    ? { borderColor: `${tech.color}80`, boxShadow: `0 0 20px ${tech.color}15` } 
    : undefined;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={cardStyle}
      className="flex items-center gap-3 glass-card px-5 py-3 rounded-xl hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-0.5 whitespace-nowrap group-hover:scale-95 hover:!scale-105"
    >
      <i 
        className={`${finalClass} text-lg shrink-0`} 
        style={isCustomColor ? { color: tech.color } : undefined}
      />
      <span className="font-mono text-sm text-on-surface font-medium">{tech.name}</span>
      {tech.isCore && (
        <span className="text-[9px] font-mono bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.5 rounded uppercase font-semibold">
          Core
        </span>
      )}
    </div>
  );
}

export interface TechMarqueeProps {
  skills?: TechItem[];
}

export default function TechMarquee({ skills }: TechMarqueeProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'frontend' | 'backend' | 'database' | 'devops'>('all');

  const stackSource = skills && skills.length > 0 ? skills : TECH_STACK;

  const filteredStack = stackSource.filter(
    (item) => activeTab === 'all' || item.category === activeTab
  );

  return (
    <section className="py-16 bg-surface-container-lowest border-y border-outline-variant/20 overflow-hidden" id="stack">
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-primary block mb-2">Core Technologies</span>
            <h3 className="font-display text-2xl md:text-3xl font-bold text-on-surface">Skill Ecosystem</h3>
          </div>

          {/* Interactive filter tabs */}
          <div className="flex flex-wrap gap-2" id="tech-filters">
            {[
              { id: 'all', label: 'All Stack', icon: Layers },
              { id: 'frontend', label: 'Frontend', icon: Cpu },
              { id: 'backend', label: 'Backend', icon: Database },
              { id: 'database', label: 'Databases', icon: HardDrive },
              { id: 'devops', label: 'Cloud / DevOps', icon: Layers }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  id={`tech-filter-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-primary text-on-primary font-semibold shadow-sm'
                      : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scrolling marquee */}
      <div className="relative py-4 select-none group" id="stack-marquee-container">
        {/* Gradients to fade edge scrolling */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-surface-container-lowest to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-surface-container-lowest to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee flex gap-8 items-center py-2">
          {/* Double up elements to make marquee seamless */}
          {[...filteredStack, ...filteredStack, ...filteredStack].map((tech, idx) => (
            <TechCard key={`${tech.name}-${idx}`} tech={tech} idx={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
