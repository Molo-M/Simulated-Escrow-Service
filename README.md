# Simulated Escrow Service

A backend-focused fintech project modeling the core mechanics of a secure escrow system. This service demonstrates strict state management, role-based authorization, and an immutable ledger system inspired by blockchain principles.

## What Is an Escrow Service

An escrow service acts as a trusted intermediary that temporarily holds funds during a transaction between two parties.

The typical flow is:

1. A buyer initiates a transaction and commits funds to escrow
2. The seller delivers the agreed product or service
3. The buyer confirms delivery
4. Funds are released to the seller
5. If a dispute occurs, funds can be canceled or refunded

This project simulates that workflow using secure APIs and a controlled transaction state machine.

---

## 📋 Table of Contents

* [Overview](#overview)
* [Core Features](#core-features)
* [Technology Stack](#technology-stack)
* [Installation & Setup](#installation--setup)
* [Backend Architecture Overview](#backend-architecture-overview)
* [API Documentation](#api-documentation)
* [Transaction Logic](#transction-logic)
* [Immutable Ledger Design](#immutable-ledger-design)
* [Project Scope](#project-scope)

---

## Overview

An escrow service acts as a trusted intermediary that temporarily holds funds during a transaction. This project focuses on the **correctness, security, and auditability** of the backend logic rather than the UI.

---

## Core Features

* **Secure Authentication:** JWT-based sessions for users and hashed API keys for machine-to-machine access.
* **Role-Based Access Control (RBAC):** Distinct permissions for Buyers, Sellers, and Admins.
* **State Machine Enforcement:** Transactions follow a strict lifecycle to prevent fraudulent state changes.
* **Immutable Ledger:** Every state change is cryptographically linked to the previous entry, ensuring a tamper-proof audit trail.

---

## Technology Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB via Mongoose
* **Security:** Bcrypt (hashing), JWT (auth), Crypto (ledger hashing)

---

## Installation & Setup

### Prerequisites

* Node.js (v16.x or higher)
* MongoDB (Local instance or Atlas URI)

### Steps

1. **Clone the repository:**
```bash
git clone https://github.com/Molo-M/Simulated-Escrow-Service.git
cd Simulated-Escrow-Service

```


2. **Install dependencies:**
```bash
npm install

```


3. **Configure environment variables:**
Create a `.env` file in the root directory:
```env
PORT=3000
JWT_SECRET=your_super_secret_key
API_KEY_SECRET=your_api_key_secret

```


4. **Start the server:**
```bash
npm start

```



---

## Backend Architecture Overview

### Models

User

```
{
  _id,
  username,
  email,
  passwordHash,
  role: "buyer" | "seller" | "admin",
  apiKey
}
```

Transaction

```
{
  _id,
  buyerId,
  sellerId,
  amount,
  description,
  state
}
```

LedgerEntry

```
{
  _id,
  transactionId,
  previousState,
  newState,
  actionByUser,
  timestamp,
  hash,
  prevHash
}
```
### Project Folder Structure

```
Simulated-Escrow-Service/
│
├── src/
│   ├── models/                  # Mongoose models/schemas
│   │   ├── User.js
│   │   ├── Transaction.js
│   │   └── LedgerEntry.js
│   │
│   ├── routes/                  # Express routes
│   │   ├── auth.js
│   │   ├── transaction.js
│   │   └── ledger.js
│   │
│   ├── middleware/              # Security & validation layers
│   │   ├── auth.js              # JWT verification
│   │   ├── apiKey.js            # API key verification
│   │   └── role.js              # Buyer/Seller/Admin restrictions
│   │
│   ├── services/                # Core application logic (reusable functions)
│   │   └── ledger.service.js    # Hashing, chain verification
│   │
│   ├── utils/                   # Reusable helpers (crypto, validators, logger)
│   │   ├── generateHash.js
│   │   ├── helpers.js
│   │
│   └── server.js                # Server and Express app config (routes, middleware)
│
├── .env                         # Environment variables
├── .gitignore
├── package-lock.json
├── package.json
└── README.md
```

---

## API Documentation

### Authentication

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Public | Create new user account |
| `POST` | `/api/auth/login` | Public | Returns JWT and user info |

### Transactions

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/transactions` | Buyer | Initiate a new escrow |
| `PATCH` | `/api/transactions/:id/pay` | Buyer | Transition from PENDING to HOLDING |
| `PATCH` | `/api/transactions/:id/deliver` | Seller | Mark item as delivered |
| `PATCH` | `/api/transactions/:id/release` | Buyer | Release funds to Seller |

### Ledger (Audit)

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/api/ledger` | Admin | View all ledger entries |
| `GET` | `/api/ledger/verify` | API Key | Run cryptographic chain verification |

---

## Transction Logic
* Buyers can create escrow transactions
* Buyers simulate payment into escrow
* Sellers mark transactions as delivered
* Buyers approve or reject delivery
* Strict enforcement of valid state transitions
* Clear separation of buyer and seller permissions

---

## Immutable Ledger Design

To ensure auditability, the system uses a chained hashing mechanism. Each `LedgerEntry` calculates its hash based on:

* Each entry includes a timestamp, transaction ID, previous state, new state, and the user who performed the action.
* Entries contain a unique hash and a prevHash (the hash of the preceding entry).
* If any past entry is modified, the entire chain of hashes breaks, allowing for easy auditing.
* A verification function recalculates all hashes to ensure the consistency of the chain

If a record is altered, the chain breaks, and the `/api/ledger/verify` endpoint will return a failure status.

---

## Project Scope

**Completed:**

* Core Escrow State Machine
* JWT & API Key authentication systems
* Cryptographic Ledger implementation
* Mongoose Schema Design

**Not Implemented (Roadmap):**

* Frontend Dashboard
* Automated Unit & Integration Testing
* Rate Limiting (Helmet/Express-rate-limit)
* Deployment (Docker/AWS)

---

## License

This project is licensed under the MIT License

---

## Author

Built as a portfolio project to demonstrate secure fintech architecture and state-managed financial workflows.

---
