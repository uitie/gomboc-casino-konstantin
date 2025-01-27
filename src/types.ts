export interface User {
  id: number;
  balance: number;
  bets: Bet[];
  message?: string;
}
  
export interface Bet {
  id: number;
  amount: number;
  diceNumber: number;
  result: string;
  timestamp: string;
  message?: string;
}

export interface Resolvers {
  Query: {
    user: () => Promise<User | null>;
    bets: () => Promise<Bet[]>;
  };
  Mutation: {
    placeBet: (_: any, args: { amount: number; diceNumber: number }) => Promise<Bet>;
    withdraw: () => Promise<User>;
  };
  // Add field resolvers for User and Bet to handle nested fields
  User?: {
    bets: (parent: User) => Promise<Bet[]>;
  };
  Bet?: {
    timestamp: (parent: Bet) => string; // Convert Date to string if necessary
  };
  // Allow additional resolver types
  [key: string]: any;
}
