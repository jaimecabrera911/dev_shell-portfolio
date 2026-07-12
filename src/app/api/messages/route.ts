import { NextResponse } from 'next/server';
import { db, initDb } from '../../../db';
import { contactMessages } from '../../../db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    await initDb();
    const result = await db.select().from(contactMessages);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await initDb();
    const body = await request.json();
    
    await db.insert(contactMessages).values({
      id: body.id,
      name: body.name,
      email: body.email,
      subject: body.subject,
      message: body.message,
      timestamp: body.timestamp,
      status: body.status || 'delivered',
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error saving message:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await initDb();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Message ID is required' }, { status: 400 });
    }

    await db.delete(contactMessages).where(eq(contactMessages.id, id));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting message:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
