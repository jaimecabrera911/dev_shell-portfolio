'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { Briefcase, Building, Code2, Rocket, Trophy, GraduationCap, Cpu, Globe, Server, Database, Users, Sparkles } from 'lucide-react';
import { useLocale } from '../contexts/LocaleContext';

interface AnimatedNumberProps {
  value: number;
  suffix?: string;
  duration?: number;
}

function AnimatedNumber({ value, suffix = '', duration = 1800 }: AnimatedNumberProps) {
  const [current, setCurrent] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let startTimestamp: number | null = null;
          const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            // Easing function: easeOutExpo
            const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            setCurrent(Math.floor(easeProgress * value));
            if (progress < 1) {
              window.requestAnimationFrame(step);
            }
          };
          window.requestAnimationFrame(step);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [value, duration]);

  return (
    <span ref={elementRef} className="tabular-nums">
      {current.toLocaleString()}{suffix}
    </span>
  );
}

import { TelemetryStatItem } from '../types';
import { HelpCircle } from 'lucide-react';

interface StatsCounterProps {
  stats?: TelemetryStatItem[];
}

const ICON_MAP = {
  Briefcase: Briefcase,
  Code2: Code2,
  Building: Building,
  Rocket: Rocket,
  Trophy: Trophy,
  GraduationCap: GraduationCap,
  Cpu: Cpu,
  Globe: Globe,
  Server: Server,
  Database: Database,
  Users: Users,
  Sparkles: Sparkles
};

const COLOR_MAP = {
  Briefcase: 'text-primary',
  Code2: 'text-secondary',
  Building: 'text-tertiary',
  Rocket: 'text-green-400',
  Trophy: 'text-yellow-400',
  GraduationCap: 'text-blue-400',
  Cpu: 'text-purple-400',
  Globe: 'text-sky-400',
  Server: 'text-indigo-400',
  Database: 'text-cyan-400',
  Users: 'text-pink-400',
  Sparkles: 'text-amber-400'
};

const fallbackStats = [
  {
    id: 'stat-projects',
    label: 'Proyectos Completados',
    target: 25,
    suffix: '+',
    description: 'Plataformas SaaS, automatizaciones y arquitecturas cloud.',
    iconName: 'Briefcase' as const,
  },
  {
    id: 'stat-experience',
    label: 'Años de Experiencia',
    target: 6,
    suffix: '+',
    description: 'Diseñando soluciones escalables y seguras en la nube.',
    iconName: 'Code2' as const,
  },
  {
    id: 'stat-clients',
    label: 'Empresas & Clientes',
    target: 12,
    suffix: '+',
    description: 'Colaboraciones internacionales en startups y corporativos.',
    iconName: 'Building' as const,
  },
  {
    id: 'stat-throughput',
    label: 'Carga Máxima de Tráfico',
    target: 15,
    suffix: 'k+ req/seg',
    description: 'Infraestructura optimizada para alta concurrencia de eventos.',
    iconName: 'Rocket' as const,
  },
];

export default function StatsCounter({ stats }: StatsCounterProps) {
  const { t } = useLocale();
  // Use custom stats from database if available, otherwise fall back to default stats
  const displayStats = (Array.isArray(stats) && stats.length > 0) ? stats : fallbackStats;

  return (
    <section className="py-16 bg-surface-container-lowest border-y border-outline-variant/20 relative overflow-hidden" id="stats-section">
      {/* Background decorations */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-72 h-72 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-72 h-72 bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayStats.map((stat) => {
            const IconComponent = ICON_MAP[stat.iconName as keyof typeof ICON_MAP] || HelpCircle;
            const colorClass = COLOR_MAP[stat.iconName as keyof typeof COLOR_MAP] || 'text-primary';
            return (
              <div
                key={stat.id}
                id={stat.id}
                className="glass-card p-6 rounded-2xl border border-outline-variant/15 flex flex-col justify-between transition-all duration-300 hover:border-primary/30 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(192,193,255,0.06)] group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 bg-surface-container-low rounded-xl border border-outline-variant/10 ${colorClass} group-hover:text-primary transition-colors`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-on-surface-variant font-bold opacity-60">
                    {t('stats.telemetry')}
                  </span>
                </div>

                <div>
                  <h3 className="font-display text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight mb-2">
                    <AnimatedNumber value={stat.target} suffix={stat.suffix} />
                  </h3>
                  <h4 className="font-mono text-xs font-bold text-primary mb-2 uppercase tracking-wide">
                    {stat.label}
                  </h4>
                  <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                    {stat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
