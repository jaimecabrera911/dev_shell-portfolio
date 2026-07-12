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
      // Seed default data
      await db.insert(resumeData).values({
        id: 'main',
        name: DEFAULT_RESUME_DATA.name,
        title: DEFAULT_RESUME_DATA.title,
        email: DEFAULT_RESUME_DATA.email,
        base: DEFAULT_RESUME_DATA.base,
        availability: DEFAULT_RESUME_DATA.availability,
        summaryStandard: DEFAULT_RESUME_DATA.summaryStandard,
        summaryArchitect: DEFAULT_RESUME_DATA.summaryArchitect,
        summaryFullstack: DEFAULT_RESUME_DATA.summaryFullstack,
        certifications: DEFAULT_RESUME_DATA.certifications || [],
        experience: DEFAULT_RESUME_DATA.experience || [],
        educationDegree: DEFAULT_RESUME_DATA.educationDegree || null,
        educationSchool: DEFAULT_RESUME_DATA.educationSchool || null,
        educationDetails: DEFAULT_RESUME_DATA.educationDetails || null,
        education: DEFAULT_RESUME_DATA.education || [],
        pdfBase64: DEFAULT_RESUME_DATA.pdfBase64 || null,
        pdfFileName: DEFAULT_RESUME_DATA.pdfFileName || null,
        heroSubtitle: DEFAULT_RESUME_DATA.heroSubtitle || null,
        workstoryDescription: DEFAULT_RESUME_DATA.workstoryDescription || null,
        contactDescription: DEFAULT_RESUME_DATA.contactDescription || null,
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
    
    // Check if main row exists
    const result = await db.select().from(resumeData).where(eq(resumeData.id, 'main'));
    
    const values = {
      name: body.name || 'JaiCab',
      title: body.title,
      email: body.email,
      base: body.base,
      availability: body.availability,
      summaryStandard: body.summaryStandard,
      summaryArchitect: body.summaryArchitect,
      summaryFullstack: body.summaryFullstack,
      certifications: body.certifications || [],
      experience: body.experience || [],
      educationDegree: body.educationDegree || null,
      educationSchool: body.educationSchool || null,
      educationDetails: body.educationDetails || null,
      education: body.education || [],
      pdfBase64: body.pdfBase64 || null,
      pdfFileName: body.pdfFileName || null,
      heroSubtitle: body.heroSubtitle || null,
      workstoryDescription: body.workstoryDescription || null,
      contactDescription: body.contactDescription || null,
      telemetryStats: body.telemetryStats || [],
      skills: body.skills || [],
    };

    if (result.length === 0) {
      await db.insert(resumeData).values({
        id: 'main',
        ...values
      });
    } else {
      await db.update(resumeData).set(values).where(eq(resumeData.id, 'main'));
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating resume data:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
