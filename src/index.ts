import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './schema/typeDefs';
import { resolvers } from './resolvers';
import { initializeDB, prisma } from './config/database';
import { initializeUser } from './services/userService';
import dotenv from 'dotenv';

dotenv.config();

const startServer = async () => {
  try {
    // Initialize the database and seed initial data
    await initializeDB();
    await initializeUser();

    // Create an instance of ApolloServer
    const server = new ApolloServer({
      typeDefs,
      resolvers,
    });

    // Start the standalone server
    const { url } = await startStandaloneServer(server, {
      context: async () => ({
        prisma,
      }),
      listen: { port: Number(process.env.PORT) || 4000 },
    });

    console.log(`🚀 Server ready at ${url}`);
  } catch (error: any) {    // Typed as 'any' to handle various error types
    console.error('Failed to initialize the application:', error);
    process.exit(1);
  }
};

startServer();