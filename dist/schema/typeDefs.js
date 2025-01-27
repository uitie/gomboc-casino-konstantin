"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
const graphql_tag_1 = __importDefault(require("graphql-tag"));
exports.typeDefs = (0, graphql_tag_1.default) `
  type User {
    id: ID!
    balance: Int!
    bets: [Bet!]!
    message: String
  }

  type Bet {
    id: ID!
    amount: Int!
    diceNumber: Int!
    result: String!
    timestamp: String!
    message: String
  }

  type Query {
    user: User!
    bets: [Bet!]!
  }

  type Mutation {
    placeBet(amount: Int!, diceNumber: Int!): Bet!
    withdraw: User!
  }
`;
//# sourceMappingURL=typeDefs.js.map