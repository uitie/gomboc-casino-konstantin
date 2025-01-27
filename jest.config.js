/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  preset: 'ts-jest',
  testEnvironment: "node",
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  setupFiles: ['<rootDir>/jest.setup.ts'],
  transformIgnorePatterns: ['/node_modules/'],
  testMatch: ['**/src/tests/**/*.test.ts'],
};