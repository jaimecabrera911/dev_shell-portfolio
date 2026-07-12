import { pgSchema, text, jsonb } from 'drizzle-orm/pg-core';

export const devShellSchema = pgSchema('dev_shell_portfolio');

export const projects = devShellSchema.table('projects', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  challenges: text('challenges').notNull(),
  solutions: text('solutions').notNull(),
  image: text('image').notNull(),
  tags: jsonb('tags').$type<string[]>().notNull(),
  year: text('year').notNull(),
  demoUrl: text('demo_url'),
  githubUrl: text('github_url'),
  architectureNodes: jsonb('architecture_nodes').$type<any[]>().notNull(),
  architectureLinks: jsonb('architecture_links').$type<any[]>().notNull(),
  codeSnippet: text('code_snippet').notNull(),
  codeLanguage: text('code_language').notNull(),
  businessImpact: text('business_impact'),
});

export const contactMessages = devShellSchema.table('contact_messages', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  timestamp: text('timestamp').notNull(),
  status: text('status').notNull(),
});

export const resumeData = devShellSchema.table('resume_data', {
  id: text('id').primaryKey(), // 'main'
  name: text('name').notNull(),
  title: text('title').notNull(),
  email: text('email').notNull(),
  base: text('base').notNull(),
  availability: text('availability').notNull(),
  summaryStandard: text('summary_standard').notNull(),
  summaryArchitect: text('summary_architect').notNull(),
  summaryFullstack: text('summary_fullstack').notNull(),
  certifications: jsonb('certifications').$type<any[]>().notNull(),
  experience: jsonb('experience').$type<any[]>().notNull(),
  educationDegree: text('education_degree'),
  educationSchool: text('education_school'),
  educationDetails: text('education_details'),
  education: jsonb('education').$type<any[]>(),
  pdfBase64: text('pdf_base64'),
  pdfFileName: text('pdf_file_name'),
  heroSubtitle: text('hero_subtitle'),
  workstoryDescription: text('workstory_description'),
  contactDescription: text('contact_description'),
  telemetryStats: jsonb('telemetry_stats').$type<any[]>(),
  skills: jsonb('skills').$type<any[]>(),
});
