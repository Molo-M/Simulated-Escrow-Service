// Middleware to check the role of the user (BUYER or SELLER)
export const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                error: "Access denied. Insufficient role permissions."
            });
        }
        next();
    };
};
