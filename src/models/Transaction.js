import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
    buyerId: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    sellerId: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    amount: mongoose.Schema.Types.String,
    description: mongoose.Schema.Types.String,
    state: {
        type: mongoose.Schema.Types.String,
        required: true
    }
})

export const Transaction = mongoose.model("Transaction", TransactionSchema)
