import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true
    },
    email: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true
    },
    passwordHash: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    role: mongoose.Schema.Types.String,
    apiKey: mongoose.Schema.Types.String
})

export const User = mongoose.model("User", UserSchema)
