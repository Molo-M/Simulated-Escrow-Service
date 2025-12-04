import { response, Router } from "express";
import { User } from "../models/User.js";
import { comparePassword, generateToken, hashPassword } from "../utils/helpers.js";
import jwt from "jsonwebtoken";

const router = Router();

// Authentication 

// Registering a user:
router.post("/auth/register", async (request, response) => {
    const { body } = request;
    // Hash the password
    body.passwordHash = hashPassword(body.passwordHash);
    const newUser = new User(body);
    try {
        const savedUser = await newUser.save();
        const token = generateToken(savedUser._id);
        console.log(`Token: \n ${token}`);
        return response.status(201).send(savedUser);
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
        const token = generateToken(findUser._id);
        console.log(`Token: \n ${token}`);
        response.sendStatus(200);
    } catch (error) {
        console.log(error);
    }
});

export default router;