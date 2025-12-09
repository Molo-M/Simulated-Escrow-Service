import { Router } from "express";
import { Transaction } from "../models/Transaction.js";
import { authMiddleware } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";

const router = Router();

// Buyer creates transaction
router.post("/transactions", authMiddleware, requireRole("BUYER"), async (request, response) => {
    const { body } = request;
    body.state = "PENDING_PAYMENT";
    const newTransaction = new Transaction(body);
    try {
        const savedTransaction = await newTransaction.save();
        return response.status(200).json({
            savedTransaction,
        });
    } catch (error) {
        console.log(error);
        return response.sendStatus(400);
    }
});

export default router;