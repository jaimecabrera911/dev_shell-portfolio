import { NextResponse } from 'next/server';
import { db, initDb } from '../../../db';
import { resumeData } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import { DEFAULT_RESUME_DATA } from '../../../utils/storage';

export async function GET() {
  try {
    await initDb();
    const result = await db.select().from(resumeData).where(eq(resumeData.id, 'main'));
    if (result.length === 0) {
      await db.insert(resumeData).values({
        id: 'main',
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
      });
      return NextResponse.json(DEFAULT_RESUME_DATA);
    }
    return NextResponse.json(result[0]);
  } catch (error: any) {
    console.error('Error fetching resume data:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await initDb();
    const body = await request.json();

    const result = await db.select().from(resumeData).where(eq(resumeData.id, 'main'));

    const values = {
      name: body.name || 'JaiCab',
      title: body.title,
      titleEn: body.titleEn || null,
      email: body.email,
      base: body.base,
      availability: body.availability,
      availabilityEn: body.availabilityEn || null,
      summaryStandard: body.summaryStandard,
      summaryStandardEn: body.summaryStandardEn || null,
      summaryArchitect: body.summaryArchitect,
      summaryArchitectEn: body.summaryArchitectEn || null,
      summaryFullstack: body.summaryFullstack,
      summaryFullstackEn: body.summaryFullstackEn || null,
      certifications: body.certifications || [],
      experience: body.experience || [],
      educationDegree: body.educationDegree || null,
      educationDegreeEn: body.educationDegreeEn || null,
      educationSchool: body.educationSchool || null,
      educationSchoolEn: body.educationSchoolEn || null,
      educationDetails: body.educationDetails || null,
      educationDetailsEn: body.educationDetailsEn || null,
      education: body.education || [],
      pdfBase64: body.pdfBase64 || null,
      pdfFileName: body.pdfFileName || null,
      heroSubtitle: body.heroSubtitle || null,
      heroSubtitleEn: body.heroSubtitleEn || null,
      workstoryDescription: body.workstoryDescription || null,
      workstoryDescriptionEn: body.workstoryDescriptionEn || null,
      contactDescription: body.contactDescription || null,
      contactDescriptionEn: body.contactDescriptionEn || null,
      telemetryStats: body.telemetryStats || [],
      skills: body.skills || [],
    };

    if (result.length === 0) {
      await db.insert(resumeData).values({ id: 'main', ...values });
    } else {
      await db.update(resumeData).set(values).where(eq(resumeData.id, 'main'));
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating resume data:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
