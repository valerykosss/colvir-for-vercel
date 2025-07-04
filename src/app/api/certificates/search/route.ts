import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import type { Prisma } from '@prisma/client';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name') || '';
  const id = searchParams.get('id') || '';

  try {
    
    const whereConditions: Prisma.CertificateWhereInput = {
      AND: [
        { 
          fullName: { 
            contains: name, 
            mode: 'insensitive' as Prisma.QueryMode 
          } 
        },
        {
          OR: [
            {
              AND: [
                { id: { equals: id } },
                { oldId: { equals: null } },
                { code: { equals: null } }
              ]
            },
            {
              AND: [
                { oldId: { equals: Number(id) } },
                { code: { not: null } }
              ]
            }
          ]
        }
      ]
    };

    const certificates = await db.certificate.findMany({
      where: whereConditions,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(certificates);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to search certificates' },
      { status: 500 }
    );
  }
}