import crypto from 'crypto';
import { User } from "../models/User.js";

export const apiKeyMiddleware = async (req, res, next) => {
    try {
        const apiKey = req.headers["x-api-key"];
        if (!apiKey) {
            return res.status(401).json({ message: "Missing API key" });
        }

        // Hash incoming API key
        const hash = crypto.createHash("sha256").update(apiKey).digest("hex");

        // Find user whose API key matches
        const user = await User.findOne({
            apiKey: hash
        }).select("-passwordHash");

        if (!user) {
            return res.status(403).json({ message: "Invalid API key" });
        }

        req.apiUser = user; // useful for auditing/logging

        next();
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error validating API key" });
    }
};