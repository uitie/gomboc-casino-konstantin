import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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