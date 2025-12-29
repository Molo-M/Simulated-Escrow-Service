import { Router } from "express";
import { User } from "../models/User.js";
import { comparePassword, accessToken, hashPassword, refreshToken, rawApiKey } from "../utils/helpers.js";
import { authMiddleware } from "../middleware/auth.js";
import { apiKeyMiddleware } from "../middleware/apiKey.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const router = Router();

// User Authentication 

// Registering a user:
router.post("/auth/register", async (request, response) => {
    const { body } = request;
    // Hash the password
    body.passwordHash = hashPassword(body.passwordHash);
    const newUser = new User(body);
    try {
        const savedUser = await newUser.save();
        // Create JWT Refresh and Access tokens:
        const createRefreshToken = refreshToken(savedUser.id);
        const createAccessToken = accessToken(savedUser.id);
        // Add the Refresh token to the cookie
        response.cookie("refreshToken", createRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        });
        return response.status(200).json({
            savedUser,
            accessToken: createAccessToken
        });
    } catch (error) {
        console.log(error);
        return response.sendStatus(400);
    }
});
// Logging in a user:
router.post("/auth/login", async (request, response) => {
    try {
        const findUser = await User.findOne({ email: request.body.email});
        if (!findUser) throw new Error("User not found!");
        if (!comparePassword(request.body.password, findUser.passwordHash)) throw new Error("Bad Credentials!");
        // Create JWT Refresh and Access tokens:
        const createRefreshToken = refreshToken(findUser.id);
        const createAccessToken = accessToken(findUser.id);
        // Add the Refresh token to the cookie
        response.cookie("refreshToken", createRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        });
        return response.status(200).json({
            accessToken: createAccessToken
        });
    } catch (error) {
        console.log(error);
    }
});
// Creating API authentication key
router.post("/auth/create-api-key", authMiddleware, async (req, res) => {
    try {
        // 1. generate key
        const rawKey = rawApiKey();

        // 2. hash it before saving
        const hash = crypto.createHash("sha256").update(rawKey).digest("hex");

        // 3. store in user record
        await User.findByIdAndUpdate(
            req.user._id,
            {
                apiKey: hash
            }
        );

        // 4. return key ONCE (never store raw key)
        return res.json({
            message: "API key created",
            apiKey: rawKey
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Could not create API key" });
    }
});
// Getting user details route:
// REMEMBER TO ADD apiKeyMiddleware
router.get("/auth/me", authMiddleware, (req, res) => {
    res.status(200).json({ user: req.user });
});
// Creating refresh route:
router.post("/auth/refresh", (req, res) => {
    // Getting the refresh token
    const token = req.cookies.refreshToken;
    // If no refresh token:
    if (!token) return res.status(401).json({ message: "No refresh token" });
    
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid refresh token" });

    const newAccessToken = accessToken(user.id);

    return res.json({ accessToken: newAccessToken });
  });
});


export default router;