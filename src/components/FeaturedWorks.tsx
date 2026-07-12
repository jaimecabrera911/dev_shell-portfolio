'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
 
import { useState, useEffect } from 'react';
import { getProjects } from '../utils/storage';
import { PROJECTS } from '../data';
import { Project } from '../types';
import { ExternalLink, Github, Eye } from 'lucide-react';
import ProjectDetailModal from './ProjectDetailModal';

export default function FeaturedWorks() {
  const [projects, setProjects] = useState<Project[]>(PROJECTS);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filter, setFilter] = useState<'all' | 'cloud' | 'frontend'>('all');

  useEffect(() => {
    // Sync with client-side db after component mounts
    getProjects()
      .then(setProjects)
      .catch((err) => console.error('Error loading projects:', err));

    const handleProjectsUpdate = () => {
      getProjects()
        .then(setProjects)
        .catch((err) => console.error('Error loading projects on event:', err));
    };
    window.addEventListener('devshell_projects_updated', handleProjectsUpdate);
    return () => {
      window.removeEventListener('devshell_projects_updated', handleProjectsUpdate);
    };
  }, []);

  const filteredProjects = projects.filter((project) => {
    if (filter === 'all') return true;
    const backendTags = ['go', 'aws', 'node', 'docker', 'postgres', 'redis', 'kubernetes'];
    const frontendTags = ['next', 'react', 'vue', 'js', 'ts', 'javascript', 'typescript'];
    
    if (filter === 'cloud') {
      return project.tags.some(tag => backendTags.some(bt => tag.toLowerCase().includes(bt)));
    }
    if (filter === 'frontend') {
      return project.tags.some(tag => frontendTags.some(ft => tag.toLowerCase().includes(ft)));
    }
    return true;
  });

  return (
    <section className="py-20 max-w-7xl mx-auto px-6" id="projects">
      {/* Section Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div className="max-w-xl">
          <span className="font-mono text-xs uppercase tracking-widest text-primary block mb-2">Featured Works</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-on-surface mb-3">
            System Solutions & Platforms
          </h2>
          <p className="font-sans text-on-surface-variant text-sm md:text-base leading-relaxed">
            A curated selection of architectural solutions and specialized technical implementations.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex bg-surface-container-low p-1 rounded-xl border border-outline-variant/15 font-mono text-xs font-semibold self-start md:self-end">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${filter === 'all' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            All Systems
          </button>
          <button
            onClick={() => setFilter('cloud')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${filter === 'cloud' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            Cloud & Backend
          </button>
          <button
            onClick={() => setFilter('frontend')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${filter === 'frontend' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            Frontend / Mobile
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8" id="projects-grid">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            id={`project-card-${project.id}`}
            onClick={() => {
              setSelectedProject(project);
            }}
            className="glass-card rounded-2xl overflow-hidden group cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_0_30px_rgba(192,193,255,0.08)] flex flex-col h-full"
          >
            {/* Project Image & Link Overlay */}
            <div className="relative h-56 bg-surface-container-high overflow-hidden">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button 
                  className="p-3.5 bg-background/90 text-primary rounded-full shadow-lg active:scale-90 transition-transform cursor-pointer hover:text-white hover:bg-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedProject(project);
                  }}
                  title="View Details"
                >
                  <Eye className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Project Info */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                {/* Tech Chips */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-surface-container text-primary font-mono text-[9px] rounded-md uppercase tracking-wider font-semibold border border-outline-variant/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h4 className="font-display text-lg md:text-xl font-bold mb-2 text-on-surface group-hover:text-primary transition-colors">
                  {project.title}
                </h4>
                <p className="text-on-surface-variant text-xs md:text-sm mb-4 line-clamp-2 leading-relaxed">
                  {project.description}
                </p>

                {project.businessImpact && (
                  <div className="mb-6 text-[10px] md:text-[11px] font-mono font-bold text-secondary bg-secondary/5 border border-secondary/15 px-2.5 py-1.5 rounded-lg flex items-start gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse mt-1 shrink-0" />
                    <span>Impact: {project.businessImpact}</span>
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="flex items-center justify-between text-on-surface-variant border-t border-outline-variant/10 pt-4 mt-auto">
                <div className="flex gap-4">
                  <ExternalLink className="w-4 h-4 cursor-pointer hover:text-primary transition-colors" />
                  <Github className="w-4 h-4 cursor-pointer hover:text-primary transition-colors" />
                </div>
                <span className="font-mono text-xs">{project.year}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Details Modal */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
}
