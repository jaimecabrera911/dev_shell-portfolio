/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Project {
  id: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  challenges: string;
  challengesEn?: string;
  solutions: string;
  solutionsEn?: string;
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
  businessImpactEn?: string;
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
  roleEn?: string;
  company: string;
  period: string;
  bulletPoints: string[];
  bulletPointsEn?: string[];
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
  nameEn?: string;
  details: string;
  detailsEn?: string;
}

export interface TelemetryStatItem {
  id: string;
  label: string;
  labelEn?: string;
  target: number;
  suffix: string;
  description: string;
  descriptionEn?: string;
  iconName: 'Briefcase' | 'Code2' | 'Building' | 'Rocket' | 'Trophy' | 'GraduationCap' | 'Cpu' | 'Globe' | 'Server' | 'Database' | 'Users' | 'Sparkles';
}

export interface EducationItem {
  id: string;
  degree: string;
  degreeEn?: string;
  school: string;
  schoolEn?: string;
  details: string;
  detailsEn?: string;
}

export interface ResumeData {
  name: string;
  title: string;
  titleEn?: string;
  email: string;
  base: string;
  availability: string;
  availabilityEn?: string;
  summaryStandard: string;
  summaryStandardEn?: string;
  summaryArchitect: string;
  summaryArchitectEn?: string;
  summaryFullstack: string;
  summaryFullstackEn?: string;
  certifications: CertificationItem[];
  experience: ExperienceItem[];
  educationDegree?: string;
  educationDegreeEn?: string;
  educationSchool?: string;
  educationSchoolEn?: string;
  educationDetails?: string;
  educationDetailsEn?: string;
  education?: EducationItem[];
  pdfBase64?: string;
  pdfFileName?: string;
  heroSubtitle?: string;
  heroSubtitleEn?: string;
  workstoryDescription?: string;
  workstoryDescriptionEn?: string;
  contactDescription?: string;
  contactDescriptionEn?: string;
  telemetryStats?: TelemetryStatItem[];
  skills?: TechItem[];
}
