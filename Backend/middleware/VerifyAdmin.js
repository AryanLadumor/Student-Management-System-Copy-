import jwt from "jsonwebtoken"

const verifyAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({ msg: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // CRITICAL: Check if the role is 'Admin'
        if (decoded.role !== 'Admin') {
            return res.status(403).json({ msg: "Access denied. User is not an admin." });
        }
        
        req.user = decoded; // attach user to request
        next();
    } catch (error) {
        return res.status(403).json({ msg: "Invalid or expired token." });
    }
};

export default verifyAdmin;