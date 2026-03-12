import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protectRoute = async(req, res, next) => {
    try {
        // get token
                const authHeader = req.header("Authorization");

        if (!authHeader) {
            return res.status(401).json({
                message: "Authentication token missing"
            });
        }

        const token = authHeader.replace("Bearer ", "");

        // verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // find user
        const user = await User.findById(decoded.userId).select("-password");

        if(!user) return res.status(401).json({ message: "Invalid or expired token" });

        req.user = user;
        next();

    } catch (error) {
        console.error("JWT authentication error:", error.message);
        res.status(401).json( {message: "Invalid or expired token" });
    }
};

export default protectRoute;