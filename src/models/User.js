import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true
    },
    email: mongoose.Schema.Types.String,
    passwordHash: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    role: mongoose.Schema.Types.String,
    apiKey: mongoose.Schema.Types.String
})

export const User = mongoose.model("User", UserSchema)
