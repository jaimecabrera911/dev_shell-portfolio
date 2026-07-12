import { ContactMessage, Project, ResumeData } from '../types';
import { TECH_STACK } from '../data';

export const DEFAULT_RESUME_DATA: ResumeData = {
  name: 'JaiCab',
  title: 'Desarrollador Fullstack & Arquitecto de Soluciones',
  titleEn: 'Fullstack Developer & Solutions Architect',
  email: 'hello@jaicab.dev',
  base: 'San Francisco, CA',
  availability: 'Inmediata',
  availabilityEn: 'Immediate',
  summaryStandard: 'Desarrollador de alto rendimiento con más de 6 años de experiencia en arquitecturas de caché distribuidas, infraestructuras serverless en la nube y diseño reactivo de alta fidelidad. Historial comprobado de optimización de APIs críticas hasta latencias de un solo milisegundo.',
  summaryStandardEn: 'High-performance developer with 6+ years of expertise spanning distributed caching architectures, robust serverless cloud infrastructures, and pixel-perfect reactive design. Proven track record of optimizing critical APIs down to single-digit millisecond latency.',
  summaryArchitect: 'Arquitecto de Soluciones de Infraestructura Cloud especializado en migrar monolitos legacy de alto tráfico a microservicios serverless resilientes en AWS. Dominio profundo de infraestructura como código (Terraform), orquestación Docker, consistencia de caché distribuida y automatización de CI/CD.',
  summaryArchitectEn: 'Cloud Infrastructure Solutions Architect specializing in migrating high-traffic legacy monoliths to resilient AWS serverless microservices. Deep proficiency in infrastructure as code (Terraform), Docker orchestration, distributed cache consistency, and CI/CD stream automation.',
  summaryFullstack: 'Ingeniero Fullstack Senior enfocado en diseñar gateways API de baja latencia, reintentos de transacciones de base de datos serializables de forma segura e interfaces de dashboard React de alta fidelidad. Apasionado por mantener seguridad de tipos al 100% y experiencias de usuario robustas.',
  summaryFullstackEn: 'Senior Fullstack Systems Engineer focused on designing low-latency API gateways, safe serializable database transaction retries, and high-fidelity React dashboard interfaces. Passionate about maintaining 100% type-safety and robust user experiences.',
  skills: TECH_STACK,
  certifications: [
    {
      id: 'cert-1',
      name: 'AWS Certified Solutions Architect',
      nameEn: 'AWS Certified Solutions Architect',
      details: 'Professional (SAP-C02) • ID: AWS-SAP-9821',
      detailsEn: 'Professional (SAP-C02) • ID: AWS-SAP-9821'
    },
    {
      id: 'cert-2',
      name: 'Certified Kubernetes Administrator',
      nameEn: 'Certified Kubernetes Administrator',
      details: 'CNCF / Linux Foundation • ID: CKA-88301',
      detailsEn: 'CNCF / Linux Foundation • ID: CKA-88301'
    }
  ],
  experience: [
    {
      id: 'exp-1',
      role: 'Arquitecto Senior de Soluciones',
      roleEn: 'Senior Solutions Architect',
      company: 'TechNexus Systems',
      period: '2022 - Presente',
      bulletPoints: [
        'Lideré la migración completa de microservicios legacy y bases de datos transaccionales a arquitecturas serverless altamente escalables, soportando hasta 15,000 peticiones por segundo.',
        'Configuré buffers de datos AWS Kinesis y caché hot de DynamoDB, reduciendo el bloqueo de lectura/escritura de bases de datos al 0.1% bajo oleadas de tráfico flash.',
        'Optimicé pipelines de despliegue continuo automatizados usando GitHub Actions y registros de Kubernetes, reduciendo el tiempo de ciclo de 15 minutos a 4 minutos.'
      ],
      bulletPointsEn: [
        'Led the complete migration of legacy microservices and transactional databases to highly scalable serverless architectures, supporting up to 15,000 requests per second.',
        'Configured AWS Kinesis Data Buffers and DynamoDB hot caching, decreasing read/write database locking down to 0.1% under flash traffic waves.',
        'Optimized automated continuous deployment pipelines using Github Actions and Kubernetes registries, speeding up cycle time from 15 minutes to 4 minutes.'
      ]
    },
    {
      id: 'exp-2',
      role: 'Desarrollador Fullstack',
      roleEn: 'Fullstack Developer',
      company: 'CloudScale Labs',
      period: '2019 - 2022',
      bulletPoints: [
        'Diseñé e implementé funcionalidades premium core para una plataforma SaaS de alta concurrencia basada en React, con 100% de cobertura de tests usando Jest.',
        'Implementé bucles de comunicación bidireccionales de bajo sobrenutilizando WebSockets personalizados para soportar dashboards de colaboración en tiempo real seguros.',
        'Rediseñé esquemas globales de bases de datos relacionales con indexación compuesta compleja, mejorando el rendimiento de búsqueda en un 35%.'
      ],
      bulletPointsEn: [
        'Architected and launched premium core features for a React-based high-concurrency SaaS platform, with 100% test coverage using Jest.',
        'Implemented bi-directional low-overhead communication loops utilizing custom WebSockets to support secure real-time collaboration dashboards.',
        'Redesigned global relational database schemas with complex composite indexing, boosting search performance by 35%.'
      ]
    }
  ],
  educationDegree: 'Lic. en Ciencias de la Computación & Ingeniería',
  educationDegreeEn: 'B.S. Computer Science & Engineering',
  educationSchool: 'Universidad de California, Berkeley',
  educationSchoolEn: 'University of California, Berkeley',
  educationDetails: 'Graduado con Honores • GPA: 3.82/4.00',
  educationDetailsEn: 'Graduated with Honors • GPA: 3.82/4.00',
  education: [
    {
      id: 'edu-1',
      degree: 'Lic. en Ciencias de la Computación & Ingeniería',
      degreeEn: 'B.S. Computer Science & Engineering',
      school: 'Universidad de California, Berkeley',
      schoolEn: 'University of California, Berkeley',
      details: 'Graduado con Honores • GPA: 3.82/4.00',
      detailsEn: 'Graduated with Honors • GPA: 3.82/4.00'
    }
  ],
  heroSubtitle: 'Creando aplicaciones web resilientes y de alto rendimiento, y arquitecturas en la nube. Especializado en conectar estéticas frontend sofisticadas con backends distribuidos robustos.',
  heroSubtitleEn: 'Crafting resilient, high-performance web applications and cloud architectures. Specialized in bridging sophisticated frontend aesthetics with robust distributed backends.',
  workstoryDescription: 'Más de 6 años de experiencia diseñando, desarrollando e optimizando productos digitales de alto rendimiento e infraestructura backend para startups y clientes empresariales a nivel mundial.',
  workstoryDescriptionEn: 'Over 6 years of experience designing, developing, and optimizing high-throughput digital products and backend infrastructure for startups and enterprise clients worldwide.',
  contactDescription: 'Siempre estoy abierto a discutir nuevos proyectos de ingeniería, arquitecturas cloud robustas, oportunidades de colaboración o ser parte de tu visión técnica.',
  contactDescriptionEn: 'I am always open to discussing new engineering projects, robust cloud architectures, collaboration opportunities, or being part of your technical vision.',
  telemetryStats: [
    {
      id: 'stat-projects',
      label: 'Proyectos Completados',
      labelEn: 'Completed Projects',
      target: 25,
      suffix: '+',
      description: 'Plataformas SaaS, automatizaciones y arquitecturas cloud.',
      descriptionEn: 'SaaS platforms, automations, and cloud architectures.',
      iconName: 'Briefcase'
    },
    {
      id: 'stat-experience',
      label: 'Años de Experiencia',
      labelEn: 'Years of Experience',
      target: 6,
      suffix: '+',
      description: 'Diseñando soluciones escalables y seguras en la nube.',
      descriptionEn: 'Designing scalable and secure cloud solutions.',
      iconName: 'Code2'
    },
    {
      id: 'stat-clients',
      label: 'Empresas & Clientes',
      labelEn: 'Companies & Clients',
      target: 12,
      suffix: '+',
      description: 'Colaboraciones internacionales en startups y corporativos.',
      descriptionEn: 'International collaborations in startups and corporate.',
      iconName: 'Building'
    },
    {
      id: 'stat-throughput',
      label: 'Carga Máxima de Tráfico',
      labelEn: 'Max Traffic Load',
      target: 15,
      suffix: 'k+ req/seg',
      description: 'Infraestructura optimizada para alta concurrencia de eventos.',
      descriptionEn: 'Infrastructure optimized for high event concurrency.',
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
