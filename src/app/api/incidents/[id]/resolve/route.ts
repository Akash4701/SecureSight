import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(
  request: NextRequest,
  { params }: { params: Record<string, string> }
) {
  try {
    const incidentId = params.id;
    
    
    const currentIncident = await prisma.incident.findUnique({
      where: { id: incidentId }
    });
    
    if (!currentIncident) {
      return NextResponse.json(
        { error: 'Incident not found' },
        { status: 404 }
      );
    }
    
    // Flip the resolved status
    const updatedIncident = await prisma.incident.update({
      where: { id: incidentId },
      data: {
        resolved: !currentIncident.resolved
      },
      include: {
        camera: {
          select: {
            id: true,
            name: true,
            location: true
          }
        }
      }
    });
    
    return NextResponse.json(updatedIncident);
  } catch (error) {
    console.error('Error updating incident:', error);
    return NextResponse.json(
      { error: 'Failed to update incident' },
      { status: 500 }
    );
  }
}