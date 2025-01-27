"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const database_1 = require("../config/database");
const graphql_1 = require("graphql");
exports.resolvers = {
    Query: {
        // Fetches the first user and their bet history
        user: async () => {
            const user = await database_1.prisma.user.findFirst({
                include: { bets: true },
            });
            if (!user)
                return null;
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
            const bets = await database_1.prisma.bet.findMany();
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
                throw new graphql_1.GraphQLError('Bet amount must be positive', {
                    extensions: { code: 'BAD_USER_INPUT' },
                });
            }
            if (diceNumber < 1 || diceNumber > 6) {
                throw new graphql_1.GraphQLError('Dice number must be between 1 and 6', {
                    extensions: { code: 'BAD_USER_INPUT' },
                });
            }
            // Roll dice
            const result = Math.floor(Math.random() * 6) + 1 === diceNumber ? 'win' : 'lose';
            const betResult = result === 'win' ? amount * 5 : -amount;
            // Update user balance and record the bet
            const user = await database_1.prisma.user.update({
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
                throw new graphql_1.GraphQLError('Failed to create bet', {
                    extensions: { code: 'INTERNAL_SERVER_ERROR' },
                });
            }
            // Reset game if balance reached or dropped below 0
            if (user.balance <= 0) {
                console.log('Game Over! User balanced has reached, or dropped below, zero.');
                const resetMessage = 'Game Over! Resetting...';
                await database_1.prisma.user.update({
                    where: { id: 1 },
                    data: {
                        balance: 1000,
                        //  bets: { deleteMany: {} },
                    },
                });
                console.log('Game reset to initial state (balance = 1000)');
                return {
                    ...latestBet,
                    timestamp: latestBet.timestamp.toISOString(),
                    message: resetMessage,
                };
            }
            return {
                ...latestBet,
                timestamp: latestBet.timestamp.toISOString(),
            };
        },
        // Withdraws the user's balance if they have won at least once
        withdraw: async () => {
            const user = await database_1.prisma.user.findFirst({
                where: { bets: { some: { result: 'win' } } },
                include: { bets: true },
            });
            if (!user) {
                throw new graphql_1.GraphQLError('Cannot withdraw without winning at least once.', {
                    extensions: { code: 'BAD_USER_INPUT' },
                });
            }
            // Log before withdrawal
            console.log(`Withdrawing user with balance: ${user.balance}`);
            const withdrawalMessage = `Your current balance of ${user.balance} has been withdrawn. Resetting the game.`;
            // Reset user balance and clear bet history
            const updatedUser = await database_1.prisma.user.update({
                where: { id: user.id },
                data: {
                    balance: 0,
                    // bets: { deleteMany: {} }, // Clear history
                },
                include: { bets: true },
            });
            console.log('User balance after withdrawal:', updatedUser.balance);
            return {
                ...updatedUser,
                message: withdrawalMessage,
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
        bets: async (parent) => {
            return parent.bets;
        },
    },
    Bet: {
        // Returns the timestamp of a bet
        timestamp: (parent) => parent.timestamp,
    },
};
//# sourceMappingURL=index.js.map