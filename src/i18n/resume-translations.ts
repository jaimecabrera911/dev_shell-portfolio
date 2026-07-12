import { ResumeData } from '../types';

type ResumeDataEN = Partial<Pick<ResumeData,
  'title' | 'availability' | 'summaryStandard' | 'summaryArchitect' | 'summaryFullstack' |
  'heroSubtitle' | 'workstoryDescription' | 'contactDescription' |
  'educationDegree' | 'educationSchool' | 'educationDetails'
>> & {
  experience?: { role: string; bulletPoints: string[] }[];
  education?: { degree: string; school: string; details: string }[];
  telemetryStats?: { label: string; description: string }[];
};

export const resumeEN: ResumeDataEN = {
  title: 'Fullstack Developer & Solutions Architect',
  availability: 'Immediate',
  summaryStandard: 'High-performance developer with 6+ years of expertise spanning distributed caching architectures, robust serverless cloud infrastructures, and pixel-perfect reactive design. Proven track record of optimizing critical APIs down to single-digit millisecond latency.',
  summaryArchitect: 'Cloud Infrastructure Solutions Architect specializing in migrating high-traffic legacy monoliths to resilient AWS serverless microservices. Deep proficiency in infrastructure as code (Terraform), Docker orchestration, distributed cache consistency, and CI/CD stream automation.',
  summaryFullstack: 'Senior Fullstack Systems Engineer focused on designing low-latency API gateways, safe serializable database transaction retries, and high-fidelity React dashboard interfaces. Passionate about maintaining 100% type-safety and robust user experiences.',
  heroSubtitle: 'Crafting resilient, high-performance web applications and cloud architectures. Specialized in bridging sophisticated frontend aesthetics with robust distributed backends.',
  workstoryDescription: 'Over 6 years of experience designing, developing, and optimizing high-throughput digital products and backend infrastructure for startups and enterprise clients worldwide.',
  contactDescription: 'I am always open to discussing new engineering projects, robust cloud architectures, collaboration opportunities, or being part of your technical vision.',
  educationDegree: 'B.S. Computer Science & Engineering',
  educationSchool: 'University of California, Berkeley',
  educationDetails: 'Graduated with Honors • GPA: 3.82/4.00',
  experience: [
    {
      role: 'Senior Solutions Architect',
      bulletPoints: [
        'Led the complete migration of legacy microservices and transactional databases to highly scalable serverless architectures, supporting up to 15,000 requests per second.',
        'Configured AWS Kinesis Data Buffers and DynamoDB hot caching, decreasing read/write database locking down to 0.1% under flash traffic waves.',
        'Optimized automated continuous deployment pipelines using Github Actions and Kubernetes registries, speeding up cycle time from 15 minutes to 4 minutes.'
      ]
    },
    {
      role: 'Fullstack Developer',
      bulletPoints: [
        'Architected and launched premium core features for a React-based high-concurrency SaaS platform, with 100% test coverage using Jest.',
        'Implemented bi-directional low-overhead communication loops utilizing custom WebSockets to support secure real-time collaboration dashboards.',
        'Redesigned global relational database schemas with complex composite indexing, boosting search performance by 35%.'
      ]
    }
  ],
  education: [
    {
      degree: 'B.S. Computer Science & Engineering',
      school: 'University of California, Berkeley',
      details: 'Graduated with Honors • GPA: 3.82/4.00'
    }
  ],
  telemetryStats: [
    { label: 'Completed Projects', description: 'SaaS platforms, automations, and cloud architectures.' },
    { label: 'Years of Experience', description: 'Designing scalable and secure cloud solutions.' },
    { label: 'Companies & Clients', description: 'International collaborations in startups and corporate.' },
    { label: 'Max Traffic Load', description: 'Infrastructure optimized for high event concurrency.' }
  ]
};
