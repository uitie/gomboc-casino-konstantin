"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = exports.initializeDB = void 0;
const client_1 = require("@prisma/client");
const DEFAULT_DATABASE_URL = 'file:./dev.db';
const databaseUrl = process.env.DATABASE_URL || DEFAULT_DATABASE_URL;
if (!databaseUrl) {
    console.error('Error: DATABASE_URL is not set and no default was provided.');
    process.exit(1);
}
const prisma = new client_1.PrismaClient({
    datasources: {
        db: {
            url: databaseUrl,
        },
    },
});
exports.prisma = prisma;
const initializeDB = async () => {
    try {
        await prisma.$connect();
        console.log('Database connected successfully.');
    }
    catch (error) {
        console.error('Database connection failed:', error);
        throw error;
    }
};
exports.initializeDB = initializeDB;
//# sourceMappingURL=database.js.map