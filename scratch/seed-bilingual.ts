import dotenv from 'dotenv';
import { resolve } from 'path';
dotenv.config({ path: resolve(__dirname, '.env.local') });
import { db, initDb } from './src/db';
import { resumeData } from './src/db/schema';
import { eq } from 'drizzle-orm';
import { DEFAULT_RESUME_DATA } from './src/utils/storage';

async function seed() {
  await initDb();

  const result = await db.select().from(resumeData).where(eq(resumeData.id, 'main'));

  const values = {
    name: DEFAULT_RESUME_DATA.name,
    title: DEFAULT_RESUME_DATA.title,
    titleEn: DEFAULT_RESUME_DATA.titleEn || null,
    email: DEFAULT_RESUME_DATA.email,
    base: DEFAULT_RESUME_DATA.base,
    availability: DEFAULT_RESUME_DATA.availability,
    availabilityEn: DEFAULT_RESUME_DATA.availabilityEn || null,
    summaryStandard: DEFAULT_RESUME_DATA.summaryStandard,
    summaryStandardEn: DEFAULT_RESUME_DATA.summaryStandardEn || null,
    summaryArchitect: DEFAULT_RESUME_DATA.summaryArchitect,
    summaryArchitectEn: DEFAULT_RESUME_DATA.summaryArchitectEn || null,
    summaryFullstack: DEFAULT_RESUME_DATA.summaryFullstack,
    summaryFullstackEn: DEFAULT_RESUME_DATA.summaryFullstackEn || null,
    certifications: DEFAULT_RESUME_DATA.certifications || [],
    experience: DEFAULT_RESUME_DATA.experience || [],
    educationDegree: DEFAULT_RESUME_DATA.educationDegree || null,
    educationDegreeEn: DEFAULT_RESUME_DATA.educationDegreeEn || null,
    educationSchool: DEFAULT_RESUME_DATA.educationSchool || null,
    educationSchoolEn: DEFAULT_RESUME_DATA.educationSchoolEn || null,
    educationDetails: DEFAULT_RESUME_DATA.educationDetails || null,
    educationDetailsEn: DEFAULT_RESUME_DATA.educationDetailsEn || null,
    education: DEFAULT_RESUME_DATA.education || [],
    pdfBase64: DEFAULT_RESUME_DATA.pdfBase64 || null,
    pdfFileName: DEFAULT_RESUME_DATA.pdfFileName || null,
    heroSubtitle: DEFAULT_RESUME_DATA.heroSubtitle || null,
    heroSubtitleEn: DEFAULT_RESUME_DATA.heroSubtitleEn || null,
    workstoryDescription: DEFAULT_RESUME_DATA.workstoryDescription || null,
    workstoryDescriptionEn: DEFAULT_RESUME_DATA.workstoryDescriptionEn || null,
    contactDescription: DEFAULT_RESUME_DATA.contactDescription || null,
    contactDescriptionEn: DEFAULT_RESUME_DATA.contactDescriptionEn || null,
    telemetryStats: DEFAULT_RESUME_DATA.telemetryStats || [],
    skills: DEFAULT_RESUME_DATA.skills || [],
  };

  if (result.length === 0) {
    await db.insert(resumeData).values({ id: 'main', ...values });
    console.log('✅ Created resume data with bilingual fields');
  } else {
    await db.update(resumeData).set(values).where(eq(resumeData.id, 'main'));
    console.log('✅ Updated resume data with bilingual fields');
  }

  console.log('\nContent saved:');
  console.log('  ES - title:', values.title);
  console.log('  EN - title:', values.titleEn);
  console.log('  ES - availability:', values.availability);
  console.log('  EN - availability:', values.availabilityEn);
  console.log('  ES - heroSubtitle:', values.heroSubtitle?.substring(0, 60) + '...');
  console.log('  EN - heroSubtitle:', values.heroSubtitleEn?.substring(0, 60) + '...');
  console.log('  Experience items:', values.experience.length);
  console.log('  Education items:', values.education.length);
  console.log('  Telemetry stats:', values.telemetryStats.length);
}

seed().catch(console.error);
