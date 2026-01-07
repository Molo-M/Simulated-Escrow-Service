# Simulated Escrow Service

## Overview

The Simulated Escrow Service is a backend-focused fintech project that models the core mechanics of a real-world escrow system. It demonstrates how secure financial transactions can be orchestrated between buyers and sellers using modern backend architecture, strong authentication, strict state management, and an immutable ledger inspired by blockchain principles.

The project focuses on correctness, security, and auditability rather than UI polish. It is designed as a learning and portfolio project that mirrors how escrow, custody, and settlement systems are implemented in production fintech environments.

The implementation covers project setup, authentication, escrow transaction logic, immutable ledger design, and role-based authorization.

---

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

## Core Features Implemented

### User Authentication and Authorization

• Secure user registration and login

• Password hashing using bcrypt

• JWT-based authentication for user sessions

• API key generation and validation for machine-to-machine access

• Role-based authorization for buyer, seller, and admin actions

### Escrow Transaction Engine

• Buyers can create escrow transactions

• Buyers simulate payment into escrow

• Sellers mark transactions as delivered

• Buyers approve or reject delivery

• Strict enforcement of valid state transitions

• Clear separation of buyer and seller permissions

### Immutable Ledger System

• Every transaction state change is permanently recorded

• Ledger entries are chained using cryptographic hashes

• Each entry references the previous entry to prevent tampering

• Ledger integrity can be verified programmatically

• Ledger data is read-only and audit-friendly

### Security Design Principles

• Stateless authentication using JWTs

• API keys stored hashed and never returned after creation

• Middleware-based access control

• Separation between user actions and system actions

• Defensive error handling and validation

---

## Project Scope and Completion Status

Completed phases:

1. Project setup and fundamentals
2. User authentication system using JWT and API keys
3. Core escrow transaction system
4. Immutable ledger system
5. Role-based authorization middleware

Not implemented:
• Frontend application

• Rate limiting and logging

• Automated testing

• Deployment

The project intentionally stops at a backend-complete state to focus on fintech-relevant backend architecture.

---

## Technology Stack

Backend:

• Node.js

• Express.js

• MongoDB

• Mongoose


Security and Authentication:

• JSON Web Tokens

• bcrypt

• crypto

Utilities:

• dotenv

• cors

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
  apiKey,
  createdAt
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

---

## Transaction State Machine

The escrow system enforces a strict state machine to prevent invalid transitions.

Valid transitions:

• PENDING_PAYMENT to HOLDING

• HOLDING to DELIVERED

• DELIVERED to RELEASED

• HOLDING or DELIVERED to CANCELED

Invalid transitions are rejected at the API level.

This ensures that escrow funds cannot be released, canceled, or modified out of order.

---

## Immutable Ledger Design

Every transaction state change creates a ledger entry containing:

• Transaction ID

• Previous state

• New state

• Timestamp

• Acting user

• Cryptographic hash

• Hash of the previous ledger entry

Each entry is cryptographically linked to the previous one, forming a chain.
If any historical entry is altered, all subsequent hashes become invalid.

A ledger verification service recalculates hashes from the beginning of the chain to confirm integrity.

This design demonstrates core concepts used in financial auditing and blockchain-inspired systems.

---

## Authentication Model

### JWT Authentication

Used for user-driven actions:

• Login

• Creating transactions

• Approving or delivering escrow actions

JWTs identify users and enforce session-based permissions.

### API Key Authentication

Used for system and machine-to-machine access:

• Ledger verification

• Admin and audit endpoints

• Future integrations or background services

API keys are hashed before storage and compared securely on each request.

---

## Role-Based Authorization

Roles are enforced using middleware:

• Buyers can create and approve transactions

• Sellers can deliver transactions assigned to them

• Admins can access ledger data

This ensures that even authenticated users cannot perform unauthorized actions.

---

## Project Folder Structure

```
Simulated-Escrow-Service/
│
├── src/
│   ├── config/
│   │   └── db.js                # MongoDB connection setup
│   │
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

## Environment Variables

Required environment variables:

• JWT_SECRET

• REFRESH_TOKEN_SECRET

• PORT

---

## What This Project Demonstrates

This project demonstrates practical fintech backend skills including:

• Secure authentication design

• Role-based access control

• Transaction state machines

• Immutable audit logs

• API security patterns

• Clean backend architecture

• Separation of concerns

• Real-world escrow logic

---

## Disclaimer

This project is a simulation intended for learning and portfolio purposes only.
It does not handle real payments and should not be used in production environments.

---

## Author

Built as a learning-focused fintech backend project to demonstrate secure transaction processing and auditability concepts commonly used in financial systems.

---
