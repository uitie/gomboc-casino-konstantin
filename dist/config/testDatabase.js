"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = exports.initializeTestDB = void 0;
const client_1 = require("@prisma/client");
const child_process_1 = require("child_process");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const prisma = new client_1.PrismaClient({
    datasources: {
        db: {
            url: process.env.TEST_DATABASE_URL || 'file:./test.db',
        },
    },
});
exports.prisma = prisma;
const initializeTestDB = async () => {
    try {
        await prisma.$connect();
        console.log('Test database connected successfully.');
        // Automatically push the latest schema to the test database
        (0, child_process_1.execSync)('npx prisma db push --schema=prisma/schema.prisma', {
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
    }
    catch (error) {
        console.error('Test database connection failed:', error);
        throw error;
    }
};
exports.initializeTestDB = initializeTestDB;
//# sourceMappingURL=testDatabase.js.map