'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
 
import { useState, useEffect, FormEvent } from 'react';
import { 
  X, Printer, Download, Briefcase, GraduationCap, Award, 
  Terminal, ShieldCheck, ChevronRight, Zap, Target, HelpCircle, Send 
} from 'lucide-react';
import { getResumeData, DEFAULT_RESUME_DATA } from '../utils/storage';
import { ResumeData } from '../types';

interface ResumeDashboardProps {
  onClose: () => void;
}

export default function ResumeDashboard({ onClose }: ResumeDashboardProps) {
  // Resume Data loaded dynamically from local storage
  const [resumeData, setResumeData] = useState<ResumeData>(DEFAULT_RESUME_DATA);


  
  // Terminal CV Assistant state
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<Array<{ q: string; a: string }>>([
    {
      q: 'help',
      a: 'Welcome to the DEV_SHELL CV Query Interface. Try asking: "What is your stack?", "Are you certified?", "Tell me about TechNexus", or "Are you open to relocate?"'
    }
  ]);

  useEffect(() => {
    getResumeData()
      .then(setResumeData)
      .catch((err) => console.error('Error loading resume:', err));

    const handleUpdate = () => {
      getResumeData()
        .then(setResumeData)
        .catch((err) => console.error('Error loading resume on event:', err));
    };
    window.addEventListener('devshell_resume_updated', handleUpdate);
    return () => {
      window.removeEventListener('devshell_resume_updated', handleUpdate);
    };
  }, []);

  // Handle printer-friendly formatting
  const handlePrint = () => {
    window.print();
  };

  const handleTerminalSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    const query = terminalInput.toLowerCase().trim();
    let answer = '';

    if (query.includes('stack') || query.includes('technologies') || query.includes('skills')) {
      const skillsList = resumeData.skills && resumeData.skills.length > 0
        ? resumeData.skills.map(s => s.name).join(', ')
        : 'TypeScript, Go, React, Next.js, Node.js, PostgreSQL, Docker, AWS Cloud, and Redis';
      answer = `My core stack includes: ${skillsList}. I specialize in building distributed caching layers, serverless ingest pipelines, and row-level locked transaction storefronts.`;
    } else if (query.includes('certif') || query.includes('award') || query.includes('aws')) {
      answer = 'I hold two premium certifications: 1) AWS Certified Solutions Architect (Professional) - ID: AWS-SAP-9821; 2) CNCF Certified Kubernetes Administrator (CKA) - ID: CKA-88301.';
    } else if (query.includes('technexus') || query.includes('current job') || query.includes('architect')) {
      answer = 'At TechNexus Systems (2022-Present), I serve as Senior Solutions Architect. I migrated a legacy monolith to AWS microservices, optimized CI/CD pipelines reducing deployment times by 45%, and mentored a team of 12 full-stack engineers.';
    } else if (query.includes('reloc') || query.includes('remote') || query.includes('location')) {
      answer = 'I am currently based in San Francisco, CA. I am open to hybrid roles in the Bay Area, as well as full-remote positions globally.';
    } else if (query.includes('education') || query.includes('university') || query.includes('college')) {
      answer = 'I completed my Bachelor of Science in Computer Science & Engineering from University of California, Berkeley (2013-2017), graduating with Honors (GPA 3.82/4.00) and specializing in Distributed Systems.';
    } else if (query.includes('clear') || query === 'cls') {
      setTerminalHistory([]);
      setTerminalInput('');
      return;
    } else if (query.includes('help')) {
      answer = 'Supported queries: "stack", "certifications", "technexus", "location", "education", "clear".';
    } else {
      answer = `No direct match found for "${terminalInput}". Try asking about my "stack", "certifications", "education", or current role at "TechNexus".`;
    }

    setTerminalHistory((prev) => [...prev, { q: terminalInput, a: answer }]);
    setTerminalInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 bg-background/90 backdrop-blur-md overflow-y-auto print:bg-white print:p-0" id="resume-dashboard">
      <div 
        className="relative w-full max-w-5xl h-full md:h-[92vh] glass-card rounded-none md:rounded-2xl overflow-hidden shadow-2xl flex flex-col animate-scale-up print:border-none print:shadow-none print:rounded-none print:h-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Navigation Bar / Header Bar */}
        <div className="bg-surface-container-low px-6 py-4 flex justify-between items-center border-b border-outline-variant/30 print:hidden">
          <div className="flex items-center gap-3">
            <span className="w-3.5 h-3.5 rounded-full bg-red-500/80 cursor-pointer hover:scale-105 transition-transform" onClick={onClose} title="Close" />
            <span className="w-3.5 h-3.5 rounded-full bg-yellow-500/80" />
            <span className="w-3.5 h-3.5 rounded-full bg-green-500/80" />
            <span className="font-mono text-xs text-primary ml-2 font-semibold">
              dev_shell://resume.sh
            </span>
          </div>

          <div className="flex items-center gap-3">


            {/* Download Action */}
            {resumeData.pdfBase64 && (
              <a
                href={resumeData.pdfBase64}
                download={resumeData.pdfFileName || 'resume.pdf'}
                className="inline-flex items-center gap-1.5 bg-primary text-on-primary hover:bg-opacity-95 px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95"
                title="Download Attached PDF Resume"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Download PDF</span>
              </a>
            )}

            {/* Print Action */}
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-on-surface-variant hover:text-primary px-3 py-1.5 rounded-lg font-mono text-xs transition-all cursor-pointer shadow-sm"
              title="Print CV / Export PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print CV / PDF</span>
            </button>

            {/* Close Button */}
            <button 
              onClick={onClose}
              className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer p-1 rounded-lg hover:bg-surface-container"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Container with Custom Print Rules */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-background print:overflow-visible print:bg-white print:text-black">
          {/* Main CV Layout Grid */}
          <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-3 gap-8 print:block print:p-0">
            
            {/* LEFT SIDEBAR (General Info, Contact, Certifications) */}
            <div className="space-y-6 print:w-full print:block">
              {/* Profile Card */}
              <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20 relative overflow-hidden print:border-none print:p-0 print:mb-6">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-xl pointer-events-none" />
                <h2 className="font-display text-2xl font-bold text-on-surface print:text-black tracking-tight mb-1">
                  {resumeData.name}
                </h2>
                <p className="font-mono text-xs text-primary font-semibold uppercase tracking-wider mb-4">
                  {resumeData.title || "Fullstack Developer & Solutions Architect"}
                </p>

                <div className="space-y-2.5 font-sans text-xs text-on-surface-variant print:text-black">
                  <div className="flex justify-between border-b border-outline-variant/10 pb-2">
                    <span className="font-semibold">Email</span>
                    <span>{resumeData.email}</span>
                  </div>
                  <div className="flex justify-between border-b border-outline-variant/10 pb-2">
                    <span className="font-semibold">Base</span>
                    <span>{resumeData.base}</span>
                  </div>
                  <div className="flex justify-between border-b border-outline-variant/10 pb-2">
                    <span className="font-semibold">Availability</span>
                    <span className="text-primary font-bold">{resumeData.availability}</span>
                  </div>
                </div>
              </div>

              {/* Focus Summary Block */}
              <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20 print:border-none print:p-0 print:mb-6">
                <div className="flex items-center gap-2 mb-3 border-b border-outline-variant/10 pb-2">
                  <Target className="w-4 h-4 text-primary" />
                  <h3 className="font-display text-xs uppercase tracking-wider text-on-surface font-bold print:text-black">
                    Executive Summary
                  </h3>
                </div>
                <p className="font-sans text-xs text-on-surface-variant leading-relaxed print:text-black">
                  {resumeData.summaryStandard}
                </p>
              </div>

              {/* Certifications Block */}
              <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20 print:border-none print:p-0 print:mb-6">
                <div className="flex items-center gap-2 mb-4 border-b border-outline-variant/10 pb-2">
                  <Award className="w-4 h-4 text-secondary" />
                  <h3 className="font-display text-xs uppercase tracking-wider text-on-surface font-bold print:text-black">
                    Certifications
                  </h3>
                </div>
                <div className="space-y-3">
                  {resumeData.certifications && resumeData.certifications.length > 0 ? (
                    resumeData.certifications.map((cert) => (
                      <div key={cert.id} className="flex items-start gap-2.5">
                        <ShieldCheck className="w-4 h-4 text-primary mt-0.5" />
                        <div>
                          <h4 className="font-sans text-xs font-bold text-on-surface print:text-black leading-tight">
                            {cert.name}
                          </h4>
                          <p className="font-mono text-[9px] text-on-surface-variant print:text-black">
                            {cert.details}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="font-sans text-xs text-on-surface-variant">No certifications added.</p>
                  )}
                </div>
              </div>

              {/* Education Block */}
              <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20 print:border-none print:p-0 print:mb-6">
                <div className="flex items-center gap-2 mb-4 border-b border-outline-variant/10 pb-2">
                  <GraduationCap className="w-4 h-4 text-tertiary" />
                  <h3 className="font-display text-xs uppercase tracking-wider text-on-surface font-bold print:text-black">
                    Education
                  </h3>
                </div>
                <div className="space-y-4">
                  {(() => {
                    const displayEducation = Array.isArray(resumeData.education) && resumeData.education.length > 0
                      ? resumeData.education
                      : [
                          {
                            id: 'edu-default',
                            degree: resumeData.educationDegree || 'B.S. Computer Science & Engineering',
                            school: resumeData.educationSchool || 'University of California, Berkeley',
                            details: resumeData.educationDetails || 'Graduated with Honors • GPA: 3.82/4.00'
                          }
                        ];
                    return displayEducation.map((edu) => (
                      <div key={edu.id} className="border-l-2 border-outline-variant/30 pl-3">
                        <h4 className="font-sans text-xs font-bold text-on-surface print:text-black leading-tight">
                          {edu.degree}
                        </h4>
                        <p className="font-sans text-[11px] text-on-surface-variant print:text-black mt-0.5">
                          {edu.school}
                        </p>
                        <p className="font-mono text-[9px] text-primary print:text-black mt-0.5">
                          {edu.details}
                        </p>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            </div>

            {/* RIGHT WORK HISTORY & PROJECTS COLUMN */}
            <div className="lg:col-span-2 space-y-6 print:w-full print:block">
              {/* Chronological Work Timeline */}
              <div className="bg-surface-container-low p-6 md:p-8 rounded-2xl border border-outline-variant/20 print:border-none print:p-0">
                <div className="flex items-center gap-2 mb-6 border-b border-outline-variant/10 pb-3">
                  <Briefcase className="w-4.5 h-4.5 text-primary" />
                  <h3 className="font-display text-sm uppercase tracking-wider text-on-surface font-bold print:text-black">
                    Professional Experience
                  </h3>
                </div>

                {/* Timeline roles */}
                <div className="relative pl-6 space-y-8 border-l border-outline-variant/30 print:border-l-0 print:pl-0">
                  {resumeData.experience && resumeData.experience.length > 0 ? (
                    resumeData.experience.map((exp, index) => (
                      <div key={exp.id} className="relative print:mb-6">
                        <span className={`absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full -translate-x-[31px] print:hidden ${index === 0 ? 'bg-primary' : 'bg-outline-variant'}`} />
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1.5 mb-2.5">
                          <div>
                            <h4 className="font-display text-base font-bold text-on-surface print:text-black">
                              {exp.role}
                            </h4>
                            <p className={`font-sans text-xs font-semibold ${index === 0 ? 'text-primary' : 'text-secondary'}`}>
                              {exp.company}
                            </p>
                          </div>
                          <span className="font-mono text-[10px] text-on-surface-variant bg-surface-container px-2 py-0.5 rounded border border-outline-variant/10 self-start sm:self-auto print:border-none print:bg-transparent print:p-0 print:text-black">
                            {exp.period}
                          </span>
                        </div>
                        <ul className="space-y-1.5 list-none text-xs text-on-surface-variant print:text-black leading-relaxed">
                          {exp.bulletPoints.map((bp, bpIdx) => (
                            <li key={bpIdx} className="flex items-start gap-1.5">
                              <span className={`font-bold mt-0.5 select-none ${index === 0 ? 'text-primary' : 'text-secondary'}`}>›</span>
                              <span>{bp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))
                  ) : (
                    <p className="font-sans text-xs text-on-surface-variant">No professional experience added.</p>
                  )}
                </div>
              </div>

              {/* CV Terminal Assistant (Print hidden) */}
              <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 overflow-hidden shadow-md print:hidden" id="cv-interactive-assistant">
                <div className="bg-surface-container-low px-5 py-3 border-b border-outline-variant/20 flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2 text-primary font-bold">
                    <Terminal className="w-4 h-4 animate-pulse" />
                    <span className="font-mono text-xs uppercase tracking-wider">
                      Interactive CV Query shell
                    </span>
                  </div>
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                  </div>
                </div>

                {/* Shell log block */}
                <div className="p-4 bg-background/50 font-mono text-[11px] leading-relaxed max-h-56 overflow-y-auto custom-scrollbar space-y-2">
                  {terminalHistory.map((log, index) => (
                    <div key={index} className="space-y-1">
                      <div className="text-on-surface-variant flex gap-1.5">
                        <span className="text-primary font-bold select-none">recruiter@dev_shell:~$</span>
                        <span>{log.q}</span>
                      </div>
                      <div className="text-green-400 pl-4">
                        {log.a}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shell Input Form */}
                <form onSubmit={handleTerminalSubmit} className="flex border-t border-outline-variant/20" id="cv-terminal-form">
                  <div className="pl-4 flex items-center text-primary font-mono text-xs select-none bg-surface-container-low">
                    $
                  </div>
                  <input
                    type="text"
                    placeholder="Ask about skills, certified, TechNexus, or relocate..."
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    className="flex-1 bg-surface-container-low px-2 py-3 font-mono text-xs text-on-surface outline-none"
                    id="cv-terminal-input"
                  />
                  <button 
                    type="submit"
                    className="px-4 bg-primary text-on-primary font-mono text-xs font-bold hover:opacity-95 cursor-pointer active:scale-95 transition-all"
                  >
                    Run
                  </button>
                </form>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
