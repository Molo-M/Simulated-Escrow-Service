import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";
import { LedgerEntry } from "../models/LedgerEntry.js";
import { verifyLedgerChain } from "../services/ledger.js";

const router = Router();

// GET /ledger — Admin only
router.get("/ledger", authMiddleware, requireRole("ADMIN"), async (req, res) => {
    try {
      const ledgerEntries = await LedgerEntry.find()
        .sort({ timestamp: -1 }) // newest first
        .lean();

      return res.json({
        count: ledgerEntries.length,
        ledger: ledgerEntries,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

/**
 * GET /ledger/:transactionId
 * Admin-only: View full ledger for a transaction
 */
router.get("/ledger/:transactionId", authMiddleware, requireRole("ADMIN"), async (req, res) => {
    try {
      const { transactionId } = req.params;

      const ledger = await LedgerEntry.find({ transactionId })
        .sort({ timestamp: 1 })
        .lean();

      if (!ledger.length) {
        return res.status(404).json({ message: "No ledger entries found" });
      }

      return res.json({
        transactionId,
        ledger,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

/**
 * POST /ledger/verify
 * Admin-only: Verify ledger integrity
 */
router.post("/ledger/verify", authMiddleware, requireRole("ADMIN"), async (req, res) => {
    try {
      // 1. Get all unique transaction IDs
      const transactionIds = await LedgerEntry.distinct("transactionId");

      const results = [];
      let tamperedCount = 0;

      for (const transactionId of transactionIds) {
        const result = await verifyLedgerChain(transactionId);

        if (!result.valid) {
          tamperedCount++;
          results.push({
            transactionId,
            error: result.error
          });
        }
      }

      return res.json({
        status: tamperedCount > 0 ? "tampered" : "clean",
        summary: {
          totalTransactions: transactionIds.length,
          valid: transactionIds.length - tamperedCount,
          tampered: tamperedCount
        },
        details: results
      });
    } catch (error) {
      console.error("Ledger verification failed:", error);
      res.status(500).json({ message: "Ledger verification failed" });
    }
  }
);

export default router;
