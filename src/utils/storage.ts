import { ContactMessage, Project, ResumeData } from '../types';
import { TECH_STACK } from '../data';

export const DEFAULT_RESUME_DATA: ResumeData = {
  name: 'DEV_SHELL',
  title: 'Fullstack Developer & Solutions Architect',
  email: 'hello@devshell.io',
  base: 'San Francisco, CA',
  availability: 'Immediate',
  summaryStandard: 'High-performance developer with 6+ years of expertise spanning distributed caching architectures, robust serverless cloud infrastructures, and pixel-perfect reactive design. Proven track record of optimizing critical APIs down to single-digit millisecond latency.',
  summaryArchitect: 'Cloud Infrastructure Solutions Architect specializing in migrating high-traffic legacy monoliths to resilient AWS serverless microservices. Deep proficiency in infrastructure as code (Terraform), Docker orchestration, distributed cache consistency, and CI/CD stream automation.',
  summaryFullstack: 'Senior Fullstack Systems Engineer focused on designing low-latency API gateways, safe serializable database transaction retries, and high-fidelity React dashboard interfaces. Passionate about maintaining 100% type-safety and robust user experiences.',
  skills: TECH_STACK,
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
  educationDetails: 'Graduated with Honors • GPA: 3.82/4.00',
  education: [
    {
      id: 'edu-1',
      degree: 'B.S. Computer Science & Engineering',
      school: 'University of California, Berkeley',
      details: 'Graduated with Honors • GPA: 3.82/4.00'
    }
  ],
  heroSubtitle: 'Crafting resilient, high-performance web applications and cloud architectures. Specialized in bridging sophisticated frontend aesthetics with robust distributed backends.',
  workstoryDescription: 'Over 6 years of experience designing, developing, and optimizing high-throughput digital products and backend infrastructure for startups and enterprise clients worldwide.',
  contactDescription: 'I am always open to discussing new engineering projects, robust cloud architectures, collaboration opportunities, or being part of your technical vision.',
  telemetryStats: [
    {
      id: 'stat-projects',
      label: 'Proyectos Completados',
      target: 25,
      suffix: '+',
      description: 'Plataformas SaaS, automatizaciones y arquitecturas cloud.',
      iconName: 'Briefcase'
    },
    {
      id: 'stat-experience',
      label: 'Años de Experiencia',
      target: 6,
      suffix: '+',
      description: 'Diseñando soluciones escalables y seguras en la nube.',
      iconName: 'Code2'
    },
    {
      id: 'stat-clients',
      label: 'Empresas & Clientes',
      target: 12,
      suffix: '+',
      description: 'Colaboraciones internacionales en startups y corporativos.',
      iconName: 'Building'
    },
    {
      id: 'stat-throughput',
      label: 'Carga Máxima de Tráfico',
      target: 15,
      suffix: 'k+ req/seg',
      description: 'Infraestructura optimizada para alta concurrencia de eventos.',
      iconName: 'Rocket'
    }
  ]
};

// Async API wrapper helpers to replace localStorage
export async function getResumeData(): Promise<ResumeData> {
  const res = await fetch('/api/resume');
  if (!res.ok) throw new Error('Failed to fetch resume data');
  return res.json();
}

export async function saveResumeData(data: ResumeData): Promise<void> {
  const res = await fetch('/api/resume', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to save resume data');
  
  // Dispatch custom event to notify components
  window.dispatchEvent(new Event('devshell_resume_updated'));
}

export async function getProjects(): Promise<Project[]> {
  const res = await fetch('/api/projects');
  if (!res.ok) throw new Error('Failed to fetch projects');
  return res.json();
}

export async function saveProject(project: Project): Promise<void> {
  const res = await fetch('/api/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(project),
  });
  if (!res.ok) throw new Error('Failed to save project');
  
  window.dispatchEvent(new Event('devshell_projects_updated'));
}

export async function deleteProject(id: string): Promise<void> {
  const res = await fetch(`/api/projects?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete project');
  
  window.dispatchEvent(new Event('devshell_projects_updated'));
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  const res = await fetch('/api/messages');
  if (!res.ok) throw new Error('Failed to fetch messages');
  return res.json();
}

export async function saveContactMessage(message: ContactMessage): Promise<void> {
  const res = await fetch('/api/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message),
  });
  if (!res.ok) throw new Error('Failed to save message');
  
  window.dispatchEvent(new Event('devshell_messages_updated'));
}

export async function deleteContactMessage(id: string): Promise<void> {
  const res = await fetch(`/api/messages?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete message');
  
  window.dispatchEvent(new Event('devshell_messages_updated'));
}

export function setAdminAuthenticated(authenticated: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('devshell_admin_authenticated', authenticated ? 'true' : 'false');
}

export function isAdminAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('devshell_admin_authenticated') === 'true';
}
