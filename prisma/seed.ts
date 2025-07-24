import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data

  // Create cameras
  await prisma.camera.createMany({
    data: [
      {
        id: 'Camera-01',
        name: 'Shop Floor A',
        location: 'Main Production Area',
      },
      {
        id: 'Camera-02',
        name: 'Vault',
        location: 'Secure Storage Room',
      },
      {
        id: 'Camera-03',
        name: 'Entrance',
        location: 'Main Building Entrance',
      },
      {
        id: 'Camera-04',
        name: 'Parking Lot',
        location: 'External Parking Area',
      },
    ],
  });

  // Define constants
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);

  const incidentTypes = [
    'Unauthorised Access',
    'Gun Threat',
    'Face Recognised',
    'Suspicious Activity',
    'Loitering',
    'Package Left Behind',
    'Violence Detected',
  ];

  const cameraIds = ['Camera-01', 'Camera-02', 'Camera-03', 'Camera-04'];

  const thumbnails: Record<string, string> = {
    'Gun Threat': 'https://visionplatform.eu-1.slashinfra.nl/wp-content/uploads/2024/06/weapen-detection-labeling-visionplatform-ai-1024x529.png',
    'Face Recognised': 'https://www.shutterstock.com/shutterstock/videos/1109664939/thumb/8.jpg?ip=x480',
    'Unauthorised Access': 'https://www.clearway.co.uk/wp-content/uploads/2024/02/can-you-monitor-CCTV-remotely-scaled-800x566.webp',
    'Suspicious Activity': 'https://i.ytimg.com/vi/ttsOZ-TuvsA/maxresdefault.jpg',
    'Loitering': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRWrE-sgEWn9b70hyAo9QdVcloyOu96303OQ&s',
    'Violence Detected': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7B4L7PQqHEnq0O297SFKoPr6NO5NZFQme_w&s',
    'Package Left Behind': 'https://www.shutterstock.com/shutterstock/videos/1020248074/thumb/8.jpg?ip=x480',
  };

  const incidents = [];

  for (let i = 0; i < 16; i++) {
    const hourOffset = Math.floor(Math.random() * 24);
    const minuteOffset = Math.floor(Math.random() * 60);
    const secondOffset = Math.floor(Math.random() * 60);

    const tsStart = new Date(startOfDay);
    tsStart.setHours(hourOffset, minuteOffset, secondOffset);

    const tsEnd = new Date(tsStart);
    tsEnd.setMinutes(tsEnd.getMinutes() + Math.floor(Math.random() * 10) + 1);

    const type = incidentTypes[Math.floor(Math.random() * incidentTypes.length)];
    const cameraId = cameraIds[Math.floor(Math.random() * cameraIds.length)];
    const thumbnailUrl = thumbnails[type] || '/thumbnails/default.jpg';

    incidents.push({
      cameraId,
      type,
      tsStart,
      tsEnd,
      thumbnailUrl,
      resolved: Math.random() < 0.3,
    });
  }

  incidents.sort((a, b) => a.tsStart.getTime() - b.tsStart.getTime());

  await prisma.incident.createMany({ data: incidents });

  console.log('✅ Database seeded successfully!');
  console.log(`📹 Created ${cameraIds.length} cameras`);
  console.log(`🚨 Created ${incidents.length} incidents`);

  const sampleIncidents = await prisma.incident.findMany({
    take: 3,
    include: { camera: true },
    orderBy: { tsStart: 'desc' },
  });

  console.log('\n📊 Sample incidents:');
  sampleIncidents.forEach((incident, index) => {
    console.log(
      `${index + 1}. ${incident.type} at ${incident.camera.name} (${incident.camera.location}) - ${incident.resolved ? 'Resolved' : 'Unresolved'}`
    );
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
