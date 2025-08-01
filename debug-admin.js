const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function debugAdmin() {
  try {
    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        clerkUserId: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    });

    console.log('All users:');
    users.forEach(user => {
      console.log(`- ${user.name} (${user.email}): ${user.role}`);
    });

    // Check if there are any admin users
    const adminUsers = users.filter(user => user.role === 'ADMIN');
    console.log(`\nAdmin users found: ${adminUsers.length}`);

    if (adminUsers.length === 0) {
      console.log('No admin users found. You may need to manually set a user as admin.');
      console.log('To set a user as admin, run:');
      console.log('UPDATE "User" SET role = \'ADMIN\' WHERE email = \'your-email@example.com\';');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugAdmin(); 