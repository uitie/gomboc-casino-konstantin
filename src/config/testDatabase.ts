import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.TEST_DATABASE_URL || 'file:./test.db',
    },
  },
});

export const initializeTestDB = async () => {
  try {
    await prisma.$connect();
    console.log('Test database connected successfully.');

    // Automatically push the latest schema to the test database
    execSync('npx prisma db push --schema=prisma/schema.prisma', {
        env: {
          ...process.env,
          DATABASE_URL: process.env.TEST_DATABASE_URL || 'file:./test.db',
        },
        stdio: 'inherit',
      });
    // Reset DB before testing
    await prisma.bet.deleteMany();
    await prisma.user.deleteMany();
    console.log('Test database reset.');
  } catch (error) {
    console.error('Test database connection failed:', error);
    throw error;
  }
};

export { prisma };