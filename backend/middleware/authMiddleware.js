import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).send({ message: "Access Denied. No token provided." });

    try {
        const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
        req.user = decoded; // Attach user info (e.g., `_id`) to the request
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        res.status(400).send({ message: "Invalid token." });
    }
};

export default authMiddleware;
