import mongoose from "mongoose";

const LedgerEntrySchema = new mongoose.Schema({
    transactionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction",
        required: true
    },

    previousState: {
        type: String,
        default: null
    },

    newState: {
        type: String,
        required: true
    },

    actionByUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    timestamp: {
        type: Date,
        default: Date.now,
        immutable: true
    },

    hash: {
        type: String,
        required: true,
        immutable: true
    },

    prevHash: {
        type: String,
        default: null,
        immutable: true
    }
}, {
    versionKey: false
});

export const LedgerEntry = mongoose.model("LedgerEntry", LedgerEntrySchema);
