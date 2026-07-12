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

const getTechIcon = (iconName: string) => {
  switch (iconName) {
    case 'Javascript': return Code;
    case 'Typescript': return Shield;
    case 'React':
    case 'ReactNative': return Cpu;
    case 'Node': return Server;
    case 'Postgres': return Database;
    case 'Docker': return Box;
    case 'Aws': return Cloud;
    case 'Next': return Globe;
    case 'Go': return Terminal;
    case 'Redis': return HardDrive;
    case 'Graphql': return Network;
    case 'Kubernetes': return Layers;
    case 'Github': return Github;
    default: return Layers;
  }
};

const getTechIconColor = (iconName: string) => {
  switch (iconName) {
    case 'Javascript': return 'text-yellow-400/90';
    case 'Typescript': return 'text-blue-400/90';
    case 'React':
    case 'ReactNative': return 'text-cyan-400/90';
    case 'Node': return 'text-green-400/90';
    case 'Postgres': return 'text-indigo-400/90';
    case 'Docker': return 'text-blue-500/90';
    case 'Aws': return 'text-orange-400/90';
    case 'Next': return 'text-white';
    case 'Go': return 'text-sky-400/90';
    case 'Redis': return 'text-red-400/90';
    case 'Graphql': return 'text-pink-400/90';
    case 'Kubernetes': return 'text-blue-600/90';
    case 'Github': return 'text-gray-300/90';
    default: return 'text-primary';
  }
};

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
          {[...filteredStack, ...filteredStack, ...filteredStack].map((tech, idx) => {
            const TechIcon = getTechIcon(tech.icon);
            return (
              <div
                key={`${tech.name}-${idx}`}
                className="flex items-center gap-3 glass-card px-5 py-3 rounded-xl hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-0.5 whitespace-nowrap group-hover:scale-95 hover:!scale-105"
              >
                <TechIcon className={`w-4 h-4 ${getTechIconColor(tech.icon)}`} />
                <span className="font-mono text-sm text-on-surface font-medium">{tech.name}</span>
                {tech.isCore && (
                  <span className="text-[9px] font-mono bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.5 rounded uppercase font-semibold">
                    Core
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
