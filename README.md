# Gomboc Gambling Casino

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

## Author: Konstantin Hamilton

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

