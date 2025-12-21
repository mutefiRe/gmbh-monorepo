// permissions.js
// Middleware for explicit role-based access control
module.exports = function requireRole(...roles) {
    return function (req, res, next) {
        // User info should be available on req.decoded (from JWT middleware)
        const user = req.decoded;
        if (!user || !user.role) {
            return res.status(401).json({ errors: { msg: 'Unauthorized: No user info' } });
        }
        if (!roles.includes(user.role)) {
            return res.status(403).json({ errors: { msg: 'Forbidden: Insufficient permissions' } });
        }
        next();
    };
};
