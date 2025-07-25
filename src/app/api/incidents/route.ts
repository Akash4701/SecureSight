import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const resolved = searchParams.get('resolved');
    
    if (resolved === 'true') {
      const count = await prisma.incident.count({
        where: { resolved: true }
      });
      return NextResponse.json({ resolvedCount: count });
    }

    // Else return incidents (unresolved or all if param is not present)
    const whereClause = resolved !== null ? {
      resolved: resolved === 'true'
    } : {};

    const incidents = await prisma.incident.findMany({
      where: whereClause,
      include: {
        camera: {
          select: {
            id: true,
            name: true,
            location: true
          }
        }
      },
      orderBy: {
        tsStart: 'desc'
      }
    });

    return NextResponse.json(incidents);
  } catch (error) {
    console.error('Error fetching incidents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch incidents' },
      { status: 500 }
    );
  }
}
