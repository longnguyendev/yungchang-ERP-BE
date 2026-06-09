import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

import { SALT_OR_ROUNDS } from '../src/constants/config';
import { PrismaClient } from '../src/generated/prisma/client';

async function seed() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('DATABASE_URL is not set in environment variables.');
    process.exit(1);
  }

  const adapter = new PrismaPg({ connectionString });
  const prisma = new PrismaClient({ adapter });

  console.log('Starting seed...');

  // --- Master Employee ---
  const masterEmployeeId = 'MASTER';
  const existingEmployee = await prisma.employee.findUnique({
    where: { id: masterEmployeeId },
  });

  if (existingEmployee) {
    console.log(`Employee "${masterEmployeeId}" already exists, skipping...`);
  } else {
    await prisma.employee.create({
      data: {
        id: masterEmployeeId,
        firstName: 'Master',
        lastName: 'Admin',
        isActive: true,
      },
    });
    console.log(`✅ Employee "${masterEmployeeId}" created.`);
  }

  // --- Master User Account ---
  const masterUsername = 'master';
  const existingAccount = await prisma.userAccount.findUnique({
    where: { username: masterUsername },
  });

  if (existingAccount) {
    console.log(`UserAccount "${masterUsername}" already exists, skipping...`);
  } else {
    const hashedPassword = await bcrypt.hash('123456', SALT_OR_ROUNDS);
    await prisma.userAccount.create({
      data: {
        employeeId: masterEmployeeId,
        username: masterUsername,
        password: hashedPassword,
        verified: true,
      },
    });
    console.log(
      `✅ UserAccount "${masterUsername}" created (password: 123456).`,
    );
  }

  console.log('🎉 Seed completed.');
  await prisma.$disconnect();
}

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
