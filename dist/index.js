"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@apollo/server");
const standalone_1 = require("@apollo/server/standalone");
const typeDefs_1 = require("./schema/typeDefs");
const resolvers_1 = require("./resolvers");
const database_1 = require("./config/database");
const userService_1 = require("./services/userService");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const startServer = async () => {
    try {
        // Initialize the database and seed initial data
        await (0, database_1.initializeDB)();
        await (0, userService_1.initializeUser)();
        // Create an instance of ApolloServer
        const server = new server_1.ApolloServer({
            typeDefs: typeDefs_1.typeDefs,
            resolvers: resolvers_1.resolvers,
        });
        // Start the standalone server
        const { url } = await (0, standalone_1.startStandaloneServer)(server, {
            context: async () => ({
                prisma: database_1.prisma,
            }),
            listen: { port: Number(process.env.PORT) || 4000 },
        });
        console.log(`🚀 Server ready at ${url}`);
    }
    catch (error) { // Typed as 'any' to handle various error types
        console.error('Failed to initialize the application:', error);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=index.js.map