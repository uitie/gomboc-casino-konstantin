import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from '../schema/typeDefs';
import { resolvers } from '../resolvers';
import { initializeTestDB, prisma } from '../config/testDatabase';

let server: ApolloServer;
let url: string;

beforeAll(async () => {
  await initializeTestDB();
  server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  const { url: serverUrl } = await startStandaloneServer(server, { listen: { port: 0 } });
  url = serverUrl;
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('Resolvers', () => {
  it('fetches the first user and their bet history', async () => {
    const GET_USER = `
      query {
        user {
          id
          name
          balance
          bets {
            id
            amount
            diceNumber
            result
            timestamp
          }
        }
      }
    `;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: GET_USER }),
    });
    const res = await response.json();

    expect(res.errors).toBeUndefined();
    expect(res.data.user).toBeDefined();
    expect(res.data.user.bets).toBeInstanceOf(Array);
  });

  it('places a bet and updates the user\'s balance', async () => {
    const PLACE_BET = `
      mutation PlaceBet($amount: Float!, $diceNumber: Int!) {
        placeBet(amount: $amount, diceNumber: $diceNumber) {
          id
          amount
          diceNumber
          result
          timestamp
        }
      }
    `;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: PLACE_BET,
        variables: { amount: 10, diceNumber: 3 },
      }),
    });
    const res = await response.json();

    expect(res.errors).toBeUndefined();
    expect(res.data.placeBet).toBeDefined();
    expect(res.data.placeBet.amount).toBe(10);
  });

  it('withdraws the user\'s balance if they have won at least once', async () => {
    const WITHDRAW = `
      mutation {
        withdraw {
          id
          balance
          bets {
            id
            amount
            diceNumber
            result
            timestamp
          }
        }
      }
    `;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: WITHDRAW }),
    });
    const res = await response.json();

    expect(res.errors).toBeUndefined();
    expect(res.data.withdraw).toBeDefined();
    expect(res.data.withdraw.balance).toBe(0);
    expect(res.data.withdraw.bets).toHaveLength(0);
  });
});