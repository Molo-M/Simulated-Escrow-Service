import { User } from "../models/User.js";
import jwt from "jsonwebtoken";
import crypto from 'crypto';

export const authMiddleware = async (req, res, next) => {
    let token;
    // Check if our request header has the following header:
    // Authorization: Bearer <token>
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            req.user = await User.findById(decoded.id).select("-passwordHash");
            
            return next();
        } catch (error) {
            console.error(`Token verification failed: ${error.message}`);
            return res.status(401).json({message: "Not authorized, token failed!"})
        }
    }
    return res.status(401).json({message: "Not authorized, token failed!"});
};

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