import { User } from "../models/User.js";
import jwt from "jsonwebtoken";

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
