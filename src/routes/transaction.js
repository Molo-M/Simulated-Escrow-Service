import { Router } from "express";
import { Transaction } from "../models/Transaction.js";
import { authMiddleware } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";
import { addLedgerEntry } from "../services/ledger.js";

const router = Router();

// 1. Buyer creates transaction
router.post("/transactions", authMiddleware, requireRole("BUYER"), async (request, response) => {
    const { body } = request;
    body.buyerId = request.user.id;
    body.state = "PENDING_PAYMENT";
    const newTransaction = new Transaction(body);
    try {
        const savedTransaction = await newTransaction.save();

        // Ledger Genesis Entry
        await addLedgerEntry(
            savedTransaction._id,
            null,
            "PENDING_PAYMENT",
            request.user.id
        );

        return response.status(200).json({
            savedTransaction,
        });
    } catch (error) {
        console.log(error);
        return response.sendStatus(400);
    }
});
// 2. Simulate buyer paying
router.post("/transactions/:id/pay", authMiddleware, requireRole("BUYER"), async (req, res) => {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) return res.status(404).json({ message: "Transaction not found" });

    // Ensure buyer calling this endpoint owns this transaction
    if (transaction.buyerId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your transaction" });
    }

    // Ensure state = PENDING_PAYMENT
    if (transaction.state !== "PENDING_PAYMENT") {
      return res.status(400).json({ message: "ERROR: Transaction state has to be PENDING_PAYMENT" });
    }

    const previousState = transaction.state;

    // Change to HOLDING
    transaction.state = "HOLDING";
    await transaction.save();

    // Update Ledger
    await addLedgerEntry(
        transaction._id,
        previousState,
        "HOLDING",
        req.user.id
    );

    return res.json({ message: "Payment successful", transaction });
});
// 3. Simulate seller delivering
router.post("/transactions/:id/deliver", authMiddleware, requireRole("SELLER"), async (req, res) => {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) return res.status(404).json({ message: "Transaction not found" });

    // Ensure seller calling this endpoint owns this transaction
    if (transaction.sellerId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your transaction" });
    }

    // Ensure state = HOLDING
    if (transaction.state !== "HOLDING") {
      return res.status(400).json({ message: "ERROR: Transaction state has to be HOLDING" });
    }

    const previousState = transaction.state;

    // Change to DELIVERED
    transaction.state = "DELIVERED";
    await transaction.save();

    // Update Ledger
    await addLedgerEntry(
        transaction._id,
        previousState,
        "DELIVERED",
        req.user.id
    );

    return res.json({ message: "Delivery successful", transaction });
});
// 4. Simulate buyer approving delivery
router.post("/transactions/:id/approve", authMiddleware, requireRole("BUYER"), async (req, res) => {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) return res.status(404).json({ message: "Transaction not found" });

    // Ensure buyer calling this endpoint owns this transaction
    if (transaction.buyerId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your transaction" });
    }

    // Ensure state = DELIVERED
    if (transaction.state !== "DELIVERED") {
      return res.status(400).json({ message: "ERROR: Transaction state has to be DELIVERED" });
    }

    const previousState = transaction.state;

    // Change to APPROVED
    transaction.state = "APPROVED";
    await transaction.save();

    // Update Ledger
    await addLedgerEntry(
        transaction._id,
        previousState,
        "APPROVED",
        req.user.id
    );

    return res.json({ message: "Delivery has been approved successfully!", transaction });
});
// 5. Simulate Buyer rejecting delivery
router.post("/transactions/:id/reject", authMiddleware, requireRole("BUYER"), async (req, res) => {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) return res.status(404).json({ message: "Transaction not found" });

    // Ensure buyer calling this endpoint owns this transaction
    if (transaction.buyerId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your transaction" });
    }

    // Ensure state = DELIVERED
    if (transaction.state !== "DELIVERED") {
      return res.status(400).json({ message: "ERROR: Transaction state has to be DELIVERED" });
    }

    const previousState = transaction.state;

    // Change to REJECTED
    transaction.state = "REJECTED";
    await transaction.save();

    // Update Ledger
    await addLedgerEntry(
        transaction._id,
        previousState,
        "REJECTED",
        req.user.id
    );

    return res.json({ message: "Delivery has been rejected!", transaction });
});

export default router;