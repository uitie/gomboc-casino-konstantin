# Gomboc Gambling Casino

This is the backend for the Gomboc Casino application, built using Node.js, Apollo Server, and Prisma with a SQLite database. It handles user balance, bet placement, and withdrawal logic.

## Prerequisites

Make sure you have the following installed:
- **Node.js** (LTS version recommended)
- **npm** (comes with Node.js) or **yarn**
- **Prisma** CLI (`npx prisma`)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/uitie/gomboc-casino-konstantin.git
   cd gomboc-casino-konstantin
   ```
2. Install dependencies: 
   ```bash
    npm install
    ```
    or
    yarn install

3. Set up the database:
   - Create a .env file in the root directory and add the following configuration:
   DATABASE_URL="file:./dev.db"
   PORT=4000

4. Apply the database migrations to set up the necessary tables for the user and bets:
   npx prisma migrate dev --name init

5. Generate the Prisma client:
   npx prisma generate

## Running the Development Server
    ```bash
    npm run dev
    ```
## Running the Production Server
    ```bash
    npm run start
    ```
This will start the Apollo Server on http://localhost:4000.
Replace 'npm' with 'yarn' if using yarn.


### **Objectives & Logical Flow**

**Objectives:**
- **Core Functionality:** Develop a full-stack application that enables users to participate in a dice-based gambling game, managing user balances, recording bet history, and facilitating withdrawals under specific conditions.
- **Backend Excellence:** Implement a robust GraphQL backend using TypeScript and SQLite, adhering to best practices to ensure code quality, maintainability, and scalability.
- **User Experience:** Provide a seamless and intuitive user interface that allows users to place bets, view their balance and bet history, and withdraw winnings when eligible.

**Logical Flow:**
1. **User Interaction:**
   - Users view their current balance and place bets by selecting a dice number and entering a bet amount.
   - Upon submitting a bet, the application processes the wager and displays the outcome.
2. **Backend Processing:**
   - Validates user inputs for bet amount and dice number.
   - Simulates a random dice roll to determine the outcome.
   - Updates the user's balance based on the result and records the bet history.
3. **Result Presentation & Continuation:**
   - Displays a pop-up message indicating a win or loss.
   - Allows users to continue playing by placing additional bets or withdraw their balance if they have won at least once.
   - Resets the game if the user's balance reaches zero or upon withdrawal.

---

### **Technologies Used**

| **Category**           | **Technologies**                                           |
|------------------------|------------------------------------------------------------|
| **Language & Runtime** | TypeScript, Node.js                                        |
| **Frameworks & Libraries** | Apollo Server, Prisma ORM, dotenv, GraphQL             |
| **Database**           | SQLite                                                     |
| **Development Tools**  | npm, ts-node, TypeScript                                   |
| **Testing**            | Jest                                                       |

Testing the Application

    Place Bet: Use the placeBet mutation to place a bet on a dice roll.
    Withdraw: Use the withdraw mutation to withdraw the balance and reset the game (only available if the user has won at least once).
    Get User Info: Use the user query to check the user's balance and bet history.
    Get All Bets: Use the bets query to view all bets placed in the game.

Queries and mutations:
1. Get the User's Information
query {
  user {
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

2. Place bet:
mutation {
  placeBet(amount: 100, diceNumber: 3) {
    id
    amount
    diceNumber
    result
    timestamp
  }
}

3. Get all bets:
query {
  bets {
    id
    amount
    diceNumber
    result
    timestamp
  }
}

4. Withdraw
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
    message
  }
}

