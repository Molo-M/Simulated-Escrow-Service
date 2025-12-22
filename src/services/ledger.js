import { LedgerEntry } from "../models/LedgerEntry.js";
import generateHash from "../utils/generateHash.js";

// 1. Get the Last Ledger Entry
export async function getLastLedgerEntry(transactionId) {
    return LedgerEntry.findOne({ transactionId })
        .sort({ timestamp: -1 })
        .lean();
}

// 2. Add a Ledger Entry (Core Function)
export async function addLedgerEntry(transactionId, previousState, newState, actionByUser) {
    // Get last ledger entry
    const lastEntry = await getLastLedgerEntry(transactionId);
    const prevHash = lastEntry ? lastEntry.hash : null;

    // Create timestamp once (important)
    const timestamp = new Date();

    // Generate hash
    const hash = generateHash({
        transactionId,
        previousState,
        newState,
        actionByUser,
        timestamp,
        prevHash
    });

    // Save ledger entry
    const entry = await LedgerEntry.create({
        transactionId,
        previousState,
        newState,
        actionByUser,
        timestamp,
        hash,
        prevHash
    });

    return entry;
}

// 3. Verify Ledger Integrity (Tamper Detection)
export async function verifyLedgerChain(transactionId) {
    const entries = await LedgerEntry.find({ transactionId })
        .sort({ timestamp: 1 })
        .lean();

    for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        const expectedPrevHash = i === 0 ? null : entries[i - 1].hash;

        // a) Check prevHash link
        if (entry.prevHash !== expectedPrevHash) {
            return {
                valid: false,
                error: `Broken chain at index ${i}`
            };
        }

        // b) Recompute hash
        const recalculatedHash = generateHash({
            transactionId: entry.transactionId,
            previousState: entry.previousState,
            newState: entry.newState,
            actionByUser: entry.actionByUser,
            timestamp: entry.timestamp,
            prevHash: entry.prevHash
        });

        // c) Check if recomputed hash matches stored hash (to make sure nothing was changed)
        if (recalculatedHash !== entry.hash) {
            return {
                valid: false,
                error: `Hash mismatch at index ${i}`
            };
        }
    }

    return {
        valid: true,
        message: "Ledger integrity verified"
    };
}



