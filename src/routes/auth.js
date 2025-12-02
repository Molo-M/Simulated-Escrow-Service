import { response, Router } from "express";
import { User } from "../models/User.js";

const router = Router();

// Authentication 

// Registering a user:
router.post("/auth/register", async (request, response) => {
    const { body } = request;
    const newUser = new User(body);
    try {
        const savedUser = await newUser.save();
        return response.status(201).send(savedUser);
    } catch (error) {
        console.log(error);
        return response.sendStatus(400);
    }
});
// Loggin in a user:
router.post("/auth/login", (req, res) => {
    res.status(200).send("Login, World!");
});

export default router;