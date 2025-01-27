import { PrismaClient } from '@prisma/client';

const DEFAULT_DATABASE_URL = 'file:./dev.db';
const databaseUrl = process.env.DATABASE_URL || DEFAULT_DATABASE_URL;

if (!databaseUrl) {
  console.error('Error: DATABASE_URL is not set and no default was provided.');
  process.exit(1);
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
});

export const initializeDB = async () => {
  try {
    await prisma.$connect();
    console.log('Database connected successfully.');
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
};

export { prisma };