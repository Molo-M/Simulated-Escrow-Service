# Simulated Escrow Service

An escrow service that holds money until both parties agree the conditions of a deal are met.

Imagine:
* Buyer pays money → Money goes into escrow (held temporarily)
* Seller delivers item/service
* Buyer confirms delivery → Escrow releases money to seller
* If dispute → money is returned

The system simulates this logic with clean software architecture and a blockchain-style immutable ledger.


## Project Structure

```
escrow-service/
│
├── src/
│   ├── config/
│   │   └── db.js                # MongoDB connection setup
│   │
│   ├── controllers/             # Route handlers (business logic entrypoints)
│   │   ├── auth.controller.js
│   │   ├── transaction.controller.js
│   │   └── ledger.controller.js
│   │
│   ├── models/                  # Mongoose models/schemas
│   │   ├── User.js
│   │   ├── Transaction.js
│   │   └── LedgerEntry.js
│   │
│   ├── routes/                  # Express routes
│   │   ├── auth.routes.js
│   │   ├── transaction.routes.js
│   │   └── ledger.routes.js
│   │
│   ├── middleware/              # Security & validation layers
│   │   ├── auth.middleware.js   # JWT verification
│   │   ├── apiKey.middleware.js # API key verification
│   │   └── role.middleware.js   # Buyer/Seller/Admin restrictions
│   │
│   ├── services/                # Core application logic (reusable functions)
│   │   ├── auth.service.js
│   │   ├── transaction.service.js
│   │   └── ledger.service.js    # Hashing, chain verification
│   │
│   ├── utils/                   # Reusable helpers (crypto, validators, logger)
│   │   ├── generateHash.js
│   │   ├── response.js
│   │   └── constants.js
│   │
│   ├── app.js                   # Express app config (routes, middleware)
│   └── server.js                # Entry point: starts server
│
├── .env                         # Environment variables
├── .gitignore
├── package.json
└── README.md
```

---

**NB:** This project is still ongoing ......