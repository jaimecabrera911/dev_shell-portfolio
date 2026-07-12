"use client";

import { useState, useEffect } from 'react';
import TopNavBar from '../components/TopNavBar';
import Hero from '../components/Hero';
import TechMarquee from '../components/TechMarquee';
import StatsCounter from '../components/StatsCounter';
import FeaturedWorks from '../components/FeaturedWorks';
import ExperienceTimeline from '../components/ExperienceTimeline';
import EducationSection from '../components/EducationSection';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';
import ResumeDashboard from '../components/ResumeDashboard';
import WhatsAppWidget from '../components/WhatsAppWidget';
import { getResumeData, DEFAULT_RESUME_DATA } from '../utils/storage';
import { useLocale } from '../contexts/LocaleContext';

export default function Home() {
  const [showResume, setShowResume] = useState(false);
  const [resumeData, setResumeData] = useState(DEFAULT_RESUME_DATA);
  const { locale } = useLocale();

  useEffect(() => {
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

  const localizedResume = { ...resumeData };
  if (locale === 'en') {
    localizedResume.title = resumeData.titleEn || resumeData.title;
    localizedResume.availability = resumeData.availabilityEn || resumeData.availability;
    localizedResume.heroSubtitle = resumeData.heroSubtitleEn || resumeData.heroSubtitle;
    localizedResume.workstoryDescription = resumeData.workstoryDescriptionEn || resumeData.workstoryDescription;
    localizedResume.contactDescription = resumeData.contactDescriptionEn || resumeData.contactDescription;
    localizedResume.summaryStandard = resumeData.summaryStandardEn || resumeData.summaryStandard;
    localizedResume.summaryArchitect = resumeData.summaryArchitectEn || resumeData.summaryArchitect;
    localizedResume.summaryFullstack = resumeData.summaryFullstackEn || resumeData.summaryFullstack;
    localizedResume.educationDegree = resumeData.educationDegreeEn || resumeData.educationDegree;
    localizedResume.educationSchool = resumeData.educationSchoolEn || resumeData.educationSchool;
    localizedResume.educationDetails = resumeData.educationDetailsEn || resumeData.educationDetails;
    if (resumeData.experience) {
      localizedResume.experience = resumeData.experience.map((exp) => ({
        ...exp,
        role: exp.roleEn || exp.role,
        bulletPoints: exp.bulletPointsEn || exp.bulletPoints,
      }));
    }
    if (resumeData.education) {
      localizedResume.education = resumeData.education.map((edu) => ({
        ...edu,
        degree: edu.degreeEn || edu.degree,
        school: edu.schoolEn || edu.school,
        details: edu.detailsEn || edu.details,
      }));
    }
    if (resumeData.telemetryStats) {
      localizedResume.telemetryStats = resumeData.telemetryStats.map((stat) => ({
        ...stat,
        label: stat.labelEn || stat.label,
        description: stat.descriptionEn || stat.description,
      }));
    }
  }

  return (
    <div className="bg-background text-on-surface font-sans selection:bg-primary-container selection:text-on-primary-container min-h-screen relative overflow-x-hidden flex flex-col justify-between">
      <div className="absolute top-0 left-0 right-0 h-[1000px] bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none -z-10" />

      <TopNavBar onResumeClick={() => setShowResume(true)} />

      <main className="flex-1">
        <Hero 
          onResumeClick={() => setShowResume(true)} 
          pdfBase64={localizedResume.pdfBase64} 
          pdfFileName={localizedResume.pdfFileName} 
          name={localizedResume.name}
          title={localizedResume.title}
          availability={localizedResume.availability}
          certifications={localizedResume.certifications}
          subtitle={localizedResume.heroSubtitle}
        />
        <TechMarquee skills={localizedResume.skills} />
        <StatsCounter stats={localizedResume.telemetryStats} />
        <FeaturedWorks />
        <ExperienceTimeline />
        <EducationSection />
        <ContactForm />
      </main>

      <Footer />

      {showResume && (
        <ResumeDashboard onClose={() => setShowResume(false)} />
      )}

      <WhatsAppWidget phoneNumber="5491100000000" />
    </div>
  );
}
