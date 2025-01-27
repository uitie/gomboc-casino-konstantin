import { prisma } from '../config/database';

// Initializes a user with a starting balance if no users exist
export const initializeUser = async () => {
  try {
    const userCount = await prisma.user.count();
    if (userCount === 0) {
      await prisma.user.create({
        data: {
          balance: 1000,
        },
      });
      console.log('Initialized user with a starting balance of 1000.');
    } else {
      console.log('User already initialized.');
    }
  } catch (error) {
    console.error('Error initializing user:', error);
    throw error;
  }
};