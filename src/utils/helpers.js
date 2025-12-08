import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import crypto from "crypto";

// Encrypting Password
const saltRounds = 10;
export const hashPassword = (password) => {
    // We use "genSaltSync" instead of "genSalt" to make it synchronous
    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(password, salt);
};

export const comparePassword = (plain, hashed) => {
    return bcrypt.compareSync(plain, hashed);
};

// Generate JWT Access token
export const accessToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "20s"});
};

// Generate JWT Refresh token
export const refreshToken = (id) => {
    return jwt.sign({id}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: "30d"});
};

// Generate raw API key
export const rawApiKey = () => {
    return crypto.randomBytes(32).toString("hex");
};