
import jwt from "jsonwebtoken";

const authenticate = (req, res, next) => {
    try {
        // 1. Read the Authorization header
        const authHeader = req.headers.authorization;

        // 2. Check whether a Bearer token was provided
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                status: "error",
                message: "Authentication required."
            });
        }

        // 3. Extract the token
        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                status: "error",
                message: "Authentication required."
            });
        }

        // 4. Verify the token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // 5. Attach authenticated user information to the request
        req.user = {
            id: decoded.sub,
            email: decoded.email
        };

        // 6. Allow the request to continue
        next();

    } catch (error) {
        return res.status(401).json({
            status: "error",
            message: "Invalid or expired authentication token."
        });
    }
};

export default authenticate;