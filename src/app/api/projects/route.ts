import { NextResponse } from 'next/server';
import { db, initDb } from '../../../db';
import { projects } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import { PROJECTS } from '../../../data';

export async function GET() {
  try {
    await initDb();
    const result = await db.select().from(projects);
    if (result.length === 0) {
      // Seed default projects
      for (const proj of PROJECTS) {
        await db.insert(projects).values({
          id: proj.id,
          title: proj.title,
          titleEn: proj.titleEn || null,
          description: proj.description,
          descriptionEn: proj.descriptionEn || null,
          challenges: proj.challenges,
          challengesEn: proj.challengesEn || null,
          solutions: proj.solutions,
          solutionsEn: proj.solutionsEn || null,
          image: proj.image,
          tags: proj.tags,
          year: proj.year,
          demoUrl: proj.demoUrl || '#',
          githubUrl: proj.githubUrl || '#',
          architectureNodes: proj.architectureNodes || [],
          architectureLinks: proj.architectureLinks || [],
          codeSnippet: proj.codeSnippet,
          codeLanguage: proj.codeLanguage,
          businessImpact: proj.businessImpact || null,
          businessImpactEn: proj.businessImpactEn || null,
        });
      }
      return NextResponse.json(PROJECTS);
    }
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await initDb();
    const body = await request.json();
    
    // Check if project exists
    const result = await db.select().from(projects).where(eq(projects.id, body.id));
    
    const values = {
      title: body.title,
      titleEn: body.titleEn || null,
      description: body.description,
      descriptionEn: body.descriptionEn || null,
      challenges: body.challenges,
      challengesEn: body.challengesEn || null,
      solutions: body.solutions,
      solutionsEn: body.solutionsEn || null,
      image: body.image,
      tags: body.tags || [],
      year: body.year,
      demoUrl: body.demoUrl || '#',
      githubUrl: body.githubUrl || '#',
      architectureNodes: body.architectureNodes || [],
      architectureLinks: body.architectureLinks || [],
      codeSnippet: body.codeSnippet,
      codeLanguage: body.codeLanguage,
      businessImpact: body.businessImpact || null,
      businessImpactEn: body.businessImpactEn || null,
    };

    if (result.length === 0) {
      await db.insert(projects).values({
        id: body.id,
        ...values
      });
    } else {
      await db.update(projects).set(values).where(eq(projects.id, body.id));
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error saving project:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await initDb();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    await db.delete(projects).where(eq(projects.id, id));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
