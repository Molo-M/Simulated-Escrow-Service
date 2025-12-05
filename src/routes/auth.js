import { response, Router } from "express";
import { User } from "../models/User.js";
import { comparePassword, accessToken, hashPassword, refreshToken } from "../utils/helpers.js";
import { authMiddleware } from "../middleware/auth.js";
import jwt from "jsonwebtoken";

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
        const findUser = await User.findOne({ name: request.body.name});
        if (!findUser) throw new Error("User not found!");
        if (!comparePassword(request.body.passwordHash, findUser.passwordHash)) throw new Error("Bad Credentials!");
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
// Getting user details route:
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