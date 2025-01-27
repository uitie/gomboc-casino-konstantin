import gql from 'graphql-tag';

export const typeDefs = gql`
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