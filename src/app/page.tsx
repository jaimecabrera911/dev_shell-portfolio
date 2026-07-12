"use client";

import { useState, useEffect } from 'react';
import TopNavBar from '../components/TopNavBar';
import Hero from '../components/Hero';
import TechMarquee from '../components/TechMarquee';
import StatsCounter from '../components/StatsCounter';
import FeaturedWorks from '../components/FeaturedWorks';
import ExperienceTimeline from '../components/ExperienceTimeline';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';
import ResumeDashboard from '../components/ResumeDashboard';
import { getResumeData, DEFAULT_RESUME_DATA } from '../utils/storage';

export default function Home() {
  const [showResume, setShowResume] = useState(false);
  const [resumeData, setResumeData] = useState(DEFAULT_RESUME_DATA);

  useEffect(() => {
    // Only call getResumeData once mounted on client
    getResumeData()
      .then(setResumeData)
      .catch((err) => console.error('Error loading resume:', err));

    const handleResumeChange = () => {
      getResumeData()
        .then(setResumeData)
        .catch((err) => console.error('Error loading resume on event:', err));
    };
    window.addEventListener('devshell_resume_updated', handleResumeChange);
    return () => {
      window.removeEventListener('devshell_resume_updated', handleResumeChange);
    };
  }, []);

  return (
    <div className="bg-background text-on-surface font-sans selection:bg-primary-container selection:text-on-primary-container min-h-screen relative overflow-x-hidden flex flex-col justify-between">
      {/* Dynamic Background Noise/Mesh decoration */}
      <div className="absolute top-0 left-0 right-0 h-[1000px] bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none -z-10" />

      {/* Navigation Header */}
      <TopNavBar onResumeClick={() => setShowResume(true)} />

      {/* Main Sections */}
      <main className="flex-1">
        <Hero 
          onResumeClick={() => setShowResume(true)} 
          pdfBase64={resumeData.pdfBase64} 
          pdfFileName={resumeData.pdfFileName} 
          title={resumeData.title}
          availability={resumeData.availability}
          certifications={resumeData.certifications}
          subtitle={resumeData.heroSubtitle}
        />
        <TechMarquee skills={resumeData.skills} />
        <StatsCounter stats={resumeData.telemetryStats} />
        <FeaturedWorks />
        <ExperienceTimeline />
        <ContactForm />
      </main>

      {/* Footer */}
      <Footer />

      {/* CV / Hoja de Vida Dashboard Overlay */}
      {showResume && (
        <ResumeDashboard onClose={() => setShowResume(false)} />
      )}
    </div>
  );
}
