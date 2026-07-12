/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ContactMessage, Project, ResumeData } from '../types';
import { PROJECTS } from '../data';

const MESSAGES_KEY = 'devshell_contact_messages';
const AUTH_KEY = 'devshell_admin_authenticated';
const PROJECTS_KEY = 'devshell_portfolio_projects';
const RESUME_KEY = 'devshell_resume_data';

export const DEFAULT_RESUME_DATA: ResumeData = {
  name: 'DEV_SHELL',
  title: 'Fullstack Developer & Solutions Architect',
  email: 'hello@devshell.io',
  base: 'San Francisco, CA',
  availability: 'Immediate',
  summaryStandard: 'High-performance developer with 6+ years of expertise spanning distributed caching architectures, robust serverless cloud infrastructures, and pixel-perfect reactive design. Proven track record of optimizing critical APIs down to single-digit millisecond latency.',
  summaryArchitect: 'Cloud Infrastructure Solutions Architect specializing in migrating high-traffic legacy monoliths to resilient AWS serverless microservices. Deep proficiency in infrastructure as code (Terraform), Docker orchestration, distributed cache consistency, and CI/CD stream automation.',
  summaryFullstack: 'Senior Fullstack Systems Engineer focused on designing low-latency API gateways, safe serializable database transaction retries, and high-fidelity React dashboard interfaces. Passionate about maintaining 100% type-safety and robust user experiences.',
  certifications: [
    {
      id: 'cert-1',
      name: 'AWS Certified Solutions Architect',
      details: 'Professional (SAP-C02) • ID: AWS-SAP-9821'
    },
    {
      id: 'cert-2',
      name: 'Certified Kubernetes Administrator',
      details: 'CNCF / Linux Foundation • ID: CKA-88301'
    }
  ],
  experience: [
    {
      id: 'exp-1',
      role: 'Senior Solutions Architect',
      company: 'TechNexus Systems',
      period: '2022 - Present',
      bulletPoints: [
        'Led the complete migration of legacy microservices and transactional databases to highly scalable serverless architectures, supporting up to 15,000 requests per second.',
        'Configured AWS Kinesis Data Buffers and DynamoDB hot caching, decreasing read/write database locking down to 0.1% under flash traffic waves.',
        'Optimized automated continuous deployment pipelines using Github Actions and Kubernetes registries, speeding up cycle time from 15 minutes to 4 minutes.'
      ]
    },
    {
      id: 'exp-2',
      role: 'Fullstack Developer',
      company: 'CloudScale Labs',
      period: '2019 - 2022',
      bulletPoints: [
        'Architected and launched premium core features for a React-based high-concurrency SaaS platform, with 100% test coverage using Jest.',
        'Implemented bi-directional low-overhead communication loops utilizing custom WebSockets to support secure real-time collaboration dashboards.',
        'Redesigned global relational database schemas with complex composite indexing, boosting search performance by 35%.'
      ]
    }
  ],
  educationDegree: 'B.S. Computer Science & Engineering',
  educationSchool: 'University of California, Berkeley',
  educationDetails: 'Graduated with Honors • GPA: 3.82/4.00'
};

// Initial dummy messages for a more populated feel in the admin dashboard if empty
const INITIAL_MESSAGES: ContactMessage[] = [
  {
    id: 'msg-1',
    name: 'Sarah Jenkins',
    email: 'sarah.j@technexus.io',
    subject: 'New Project Inquiry',
    message: 'We are looking for a solutions architect to migrate our client portal from a monolithic Node service to an AWS serverless API. Your distributed system simulator looks exactly like what we need to model our data pipeline. Are you available for a 30-minute introductory call next Tuesday?',
    timestamp: '07/09/2026, 11:24 AM',
    status: 'delivered'
  },
  {
    id: 'msg-2',
    name: 'David Chen',
    email: 'dchen@cloudscale.net',
    subject: 'Collaboration Opportunity',
    message: 'Awesome work on the row-lock concurrency simulations! We have a high-throughput relational database issue in our e-commerce checkout flow. Would love to collaborate or consult on solving some of our lock-contention issues.',
    timestamp: '07/08/2026, 04:15 PM',
    status: 'delivered'
  }
];

export function getContactMessages(): ContactMessage[] {
  if (typeof window === 'undefined') {
    return INITIAL_MESSAGES;
  }
  const stored = localStorage.getItem(MESSAGES_KEY);
  if (!stored) {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(INITIAL_MESSAGES));
    return INITIAL_MESSAGES;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return INITIAL_MESSAGES;
  }
}

export function saveContactMessage(message: ContactMessage) {
  if (typeof window === 'undefined') return;
  const messages = getContactMessages();
  const updated = [message, ...messages];
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(updated));
  
  // Dispatch a custom event so other components know storage updated
  window.dispatchEvent(new Event('devshell_messages_updated'));
}

export function deleteContactMessage(id: string) {
  if (typeof window === 'undefined') return;
  const messages = getContactMessages();
  const updated = messages.filter((m) => m.id !== id);
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('devshell_messages_updated'));
}

export function getProjects(): Project[] {
  if (typeof window === 'undefined') {
    return PROJECTS;
  }
  const stored = localStorage.getItem(PROJECTS_KEY);
  if (!stored) {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(PROJECTS));
    return PROJECTS;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return PROJECTS;
  }
}

export function saveProject(project: Project) {
  if (typeof window === 'undefined') return;
  const projects = getProjects();
  const index = projects.findIndex((p) => p.id === project.id);
  let updated: Project[];
  if (index >= 0) {
    updated = [...projects];
    updated[index] = project;
  } else {
    updated = [...projects, project];
  }
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('devshell_projects_updated'));
}

export function deleteProject(id: string) {
  if (typeof window === 'undefined') return;
  const projects = getProjects();
  const updated = projects.filter((p) => p.id !== id);
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('devshell_projects_updated'));
}

export function setAdminAuthenticated(authenticated: boolean) {
  if (typeof window === 'undefined') return;
  if (authenticated) {
    localStorage.setItem(AUTH_KEY, 'true');
  } else {
    localStorage.removeItem(AUTH_KEY);
  }
  window.dispatchEvent(new Event('devshell_auth_updated'));
}

export function isAdminAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(AUTH_KEY) === 'true';
}

export function getResumeData(): ResumeData {
  if (typeof window === 'undefined') {
    return DEFAULT_RESUME_DATA;
  }
  const stored = localStorage.getItem(RESUME_KEY);
  if (!stored) {
    localStorage.setItem(RESUME_KEY, JSON.stringify(DEFAULT_RESUME_DATA));
    return DEFAULT_RESUME_DATA;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return DEFAULT_RESUME_DATA;
  }
}

export function saveResumeData(data: ResumeData) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(RESUME_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event('devshell_resume_updated'));
}

