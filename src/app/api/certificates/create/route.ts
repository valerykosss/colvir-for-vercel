import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { fullName, courseName, hours, format } = await req.json();

    if (!fullName || !courseName || !hours) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const certificate = await db.certificate.create({
      data: {
        fullName,
        courseName,
        hours: parseFloat(hours),
        format: format || null,
      },
    });

    return NextResponse.json(certificate, { status: 201 });
  } catch (error) {
    console.error('Error creating certificate:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}