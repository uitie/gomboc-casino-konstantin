"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeUser = void 0;
const database_1 = require("../config/database");
// Initializes a user with a starting balance if no users exist
const initializeUser = async () => {
    try {
        const userCount = await database_1.prisma.user.count();
        if (userCount === 0) {
            await database_1.prisma.user.create({
                data: {
                    balance: 1000,
                },
            });
            console.log('Initialized user with a starting balance of 1000.');
        }
        else {
            console.log('User already initialized.');
        }
    }
    catch (error) {
        console.error('Error initializing user:', error);
        throw error;
    }
};
exports.initializeUser = initializeUser;
//# sourceMappingURL=userService.js.map