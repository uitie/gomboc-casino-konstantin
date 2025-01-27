import { Resolvers, User, Bet } from '../types';
import { prisma } from '../config/database';
import { GraphQLError } from 'graphql';

export const resolvers: Resolvers = {
  Query: {
    // Fetches the first user and their bet history
    user: async () => {
      const user = await prisma.user.findFirst({
        include: { bets: true },
      });
      if (!user) return null;
      // Convert Date to string for each bet's timestamp
      return {
        ...user,
        bets: user.bets.map(bet => ({
          ...bet,
          timestamp: bet.timestamp.toISOString(),
        })),
      };
    },
    // Fetches all bets
    bets: async () => {
      const bets = await prisma.bet.findMany();
      // Convert Date to string for each bet's timestamp
      return bets.map(bet => ({
        ...bet,
        timestamp: bet.timestamp.toISOString(),
      }));
    },
  },
  Mutation: {
    // Places a bet and updates the user's balance
    placeBet: async (_, { amount, diceNumber }) => {
      if (amount <= 0) {
        throw new GraphQLError('Bet amount must be positive', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      if (diceNumber < 1 || diceNumber > 6) {
        throw new GraphQLError('Dice number must be between 1 and 6', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      const result = Math.floor(Math.random() * 6) + 1 === diceNumber ? 'win' : 'lose';
      const betResult = result === 'win' ? amount * 5 : -amount;

      // Update user balance and record the bet
      const user = await prisma.user.update({
        where: { id: 1 },
        data: {
          balance: { increment: betResult },
          bets: {
            create: {
              amount,
              diceNumber,
              result,
            },
          },
        },
        include: { bets: true },
      });

      const latestBet = user.bets[user.bets.length - 1];

      if (!latestBet) {
        throw new GraphQLError('Failed to create bet', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' },
        });
      }

      return {
        ...latestBet,
        timestamp: latestBet.timestamp.toISOString(),
      };
    },
    // Withdraws the user's balance if they have won at least once
    withdraw: async () => {
      const user = await prisma.user.findFirst({
        where: { bets: { some: { result: 'win' } } },
        include: { bets: true },
      });

      if (!user) {
        throw new GraphQLError('Cannot withdraw without winning at least once.', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      // Reset user balance and clear bet history
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          balance: 0,
          bets: { deleteMany: {} }, // Clear history
        },
        include: { bets: true },
      });

      return {
        ...updatedUser,
        bets: updatedUser.bets.map(bet => ({
          ...bet,
          timestamp: bet.timestamp.toISOString(),
        })),
      };
    },
  },
  // Field Resolvers
  User: {
    // Returns the bets associated with a user
    bets: async (parent: User) => {
      return parent.bets;
    },
  },
  Bet: {
    // Returns the timestamp of a bet
    timestamp: (parent: Bet) => parent.timestamp,
  },
};