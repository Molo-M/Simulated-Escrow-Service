import express from 'express';
import authRouter from "./routes/auth.js";
import transactionsRouter from "./routes/transaction.js";
import ledgerRoutes from "./routes/ledger.js";
import mongoose from 'mongoose';
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

const app = express();

// Connect to MongoDB Database:
mongoose
    .connect("mongodb://localhost/escrow_service")
    .then(() => console.log("Connected to Database!"))
    .catch((err) => console.log(`Error: ${err}`))

const PORT = process.env.PORT || 3000;

// Allow Express to parse JSON and cookies
app.use(express.json());
app.use(cookieParser());

// Authentication Route
app.use(authRouter);
// Transactions Route
app.use(transactionsRouter);
// Ledger Route
app.use(ledgerRoutes);

app.get("/", (req, res) => {
    res.status(200).send("Hello, World!")
});

app.listen(PORT, () => {
    console.log(`Running on Port ${PORT}`)
});