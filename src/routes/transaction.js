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
// Simulate buyer paying
router.post("/transactions/:id/pay", authMiddleware, requireRole("BUYER"), async (req, res) => {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) return res.status(404).json({ message: "Transaction not found" });

    // Ensure buyer calling this endpoint owns this transaction
    if (transaction.buyerId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your transaction" });
    }

    // Ensure state = PENDING_PAYMENT
    if (transaction.state !== "PENDING_PAYMENT") {
      return res.status(400).json({ message: "Payment already made" });
    }

    // Change to HOLDING
    transaction.state = "HOLDING";
    await transaction.save();

    return res.json({ message: "Payment successful", transaction });
});

export default router;