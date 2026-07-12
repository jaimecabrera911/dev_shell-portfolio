/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Project {
  id: string;
  title: string;
  description: string;
  challenges: string;
  solutions: string;
  image: string;
  tags: string[];
  year: string;
  demoUrl?: string;
  githubUrl?: string;
  architectureNodes: ArchitectureNode[];
  architectureLinks: ArchitectureLink[];
  codeSnippet: string;
  codeLanguage: string;
  businessImpact?: string;
}

export interface ArchitectureNode {
  id: string;
  label: string;
  type: 'client' | 'gateway' | 'service' | 'cache' | 'database' | 'queue';
  status: 'active' | 'idle' | 'loading';
}

export interface ArchitectureLink {
  source: string;
  target: string;
  label?: string;
  animated?: boolean;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  bulletPoints: string[];
}

export interface TechItem {
  name: string;
  icon: string;
  category: 'frontend' | 'backend' | 'devops' | 'database';
  isCore: boolean;
  color?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
  status: 'sending' | 'delivered' | 'error';
}

export interface CertificationItem {
  id: string;
  name: string;
  details: string;
}

export interface TelemetryStatItem {
  id: string;
  label: string;
  target: number;
  suffix: string;
  description: string;
  iconName: 'Briefcase' | 'Code2' | 'Building' | 'Rocket' | 'Trophy' | 'GraduationCap' | 'Cpu' | 'Globe' | 'Server' | 'Database' | 'Users' | 'Sparkles';
}

export interface EducationItem {
  id: string;
  degree: string;
  school: string;
  details: string;
}

export interface ResumeData {
  name: string;
  title: string;
  email: string;
  base: string;
  availability: string;
  summaryStandard: string;
  summaryArchitect: string;
  summaryFullstack: string;
  certifications: CertificationItem[];
  experience: ExperienceItem[];
  educationDegree?: string;
  educationSchool?: string;
  educationDetails?: string;
  education?: EducationItem[];
  pdfBase64?: string;
  pdfFileName?: string;
  heroSubtitle?: string;
  workstoryDescription?: string;
  contactDescription?: string;
  telemetryStats?: TelemetryStatItem[];
  skills?: TechItem[];
}
