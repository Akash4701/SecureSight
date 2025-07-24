import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.incident.deleteMany();
  await prisma.camera.deleteMany();
  
  // Create cameras
  const cameras = await prisma.camera.createMany({
    data: [
      {
        id: 'cam_001',
        name: 'Shop Floor A',
        location: 'Main Production Area'
      },
      {
        id: 'cam_002', 
        name: 'Vault',
        location: 'Secure Storage Room'
      },
      {
        id: 'cam_003',
        name: 'Entrance',
        location: 'Main Building Entrance'
      },
      {
        id: 'cam_004',
        name: 'Parking Lot',
        location: 'External Parking Area'
      }
    ]
  });

  // Generate incidents across 24 hours
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
  
  const incidentTypes = [
    'Unauthorised Access',
    'Gun Threat', 
    'Face Recognised',
    'Suspicious Activity',
    'Loitering',
    'Package Left Behind',
    'Violence Detected'
  ];

  const cameraIds = ['cam_001', 'cam_002', 'cam_003', 'cam_004'];

  const incidents = [];
  
  // Generate 15+ incidents throughout the day
  for (let i = 0; i < 16; i++) {
    const hourOffset = Math.floor(Math.random() * 24);
    const minuteOffset = Math.floor(Math.random() * 60);
    const secondOffset = Math.floor(Math.random() * 60);
    
    const tsStart = new Date(startOfDay);
    tsStart.setHours(hourOffset, minuteOffset, secondOffset);
    
    const tsEnd = new Date(tsStart);
    tsEnd.setMinutes(tsEnd.getMinutes() + Math.floor(Math.random() * 10) + 1); // 1-10 minutes duration
    
    const randomType = incidentTypes[Math.floor(Math.random() * incidentTypes.length)];
    const randomCamera = cameraIds[Math.floor(Math.random() * cameraIds.length)];
    
    incidents.push({
      cameraId: randomCamera,
      type: randomType,
      tsStart,
      tsEnd,
      thumbnailUrl: `/thumbnails/incident_${i + 1}.jpg`,
      resolved: Math.random() < 0.3 // 30% chance of being resolved
    });
  }
  
  // Sort incidents by start time
  incidents.sort((a, b) => a.tsStart.getTime() - b.tsStart.getTime());
  
  await prisma.incident.createMany({
    data: incidents
  });

  console.log('✅ Database seeded successfully!');
  console.log(`📹 Created ${cameraIds.length} cameras`);
  console.log(`🚨 Created ${incidents.length} incidents`);
  
  // Log some sample data
  const sampleIncidents = await prisma.incident.findMany({
    take: 3,
    include: {
      camera: true
    },
    orderBy: {
      tsStart: 'desc'
    }
  });
  
  console.log('\n📊 Sample incidents:');
  sampleIncidents.forEach((incident, index) => {
    console.log(`${index + 1}. ${incident.type} at ${incident.camera.name} (${incident.camera.location}) - ${incident.resolved ? 'Resolved' : 'Unresolved'}`);
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });