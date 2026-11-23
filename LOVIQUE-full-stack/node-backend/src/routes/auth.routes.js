import express from "express";
import bcrypt from "bcryptjs";
import pool from "../config/database.js";
import jwt from "jsonwebtoken";
import authenticate from "../middleware/auth.middleware.js";

const router = express.Router();

// POST /api/auth/register
router.post("/register", async (req, res) => {
    try {
        // 1. Get data from the request
        const { email, password } = req.body;

        // 2. Validate the input
        if (!email || !password) {
            return res.status(400).json({
                status: "error",
                message: "Email and password are required."
            });
        }

        if (
            typeof email !== "string" ||
            typeof password !== "string"
        ) {
            return res.status(400).json({
                status: "error",
                message: "Invalid input."
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(normalizedEmail)) {
            return res.status(400).json({
                status: "error",
                message: "Please provide a valid email address."
            });
        }

        if (normalizedEmail.length > 254) {
            return res.status(400).json({
                status: "error",
                message: "Email address is too long."
            });
        }

        if (password.length < 8 || Buffer.byteLength(password, "utf8") > 72) {
            return res.status(400).json({
                status: "error",
                message: "Password must be at least 8 characters and no more than 72 bytes."
            });
        }

        // 3. Hash the password
        const passwordHash = await bcrypt.hash(password, 12);

        // 4. Save the new user in PostgreSQL
        const result = await pool.query(
            `INSERT INTO users (email, password_hash)
             VALUES ($1, $2)
             RETURNING id, email, account_status, email_verified, created_at`,
            [normalizedEmail, passwordHash]
        );

        // 5. Return the created account
        return res.status(201).json({
            status: "success",
            message: "Account created successfully.",
            user: result.rows[0]
        });

    } catch (error) {
        // PostgreSQL error code 23505 means unique constraint violation
        if (error.code === "23505") {
            return res.status(409).json({
                status: "error",
                message: "An account with this email already exists."
            });
        }

        console.error("Registration error:", error.message);

        return res.status(500).json({
            status: "error",
            message: "Something went wrong while creating your account."
        });
    }
});

export default router;


// GET /api/auth/me
router.get("/me", authenticate, (req, res) => {
    res.json({
        status: "success",
        message: "You are authenticated.",
        user: {
            id: req.user.id,
            email: req.user.email
        }
    });
});


// POST /api/auth/login
router.post("/login", async (req, res) => {
    try {
        // 1. Get login credentials
        const { email, password } = req.body;

        // 2. Validate input
        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                status: "error",
                message: "Email and password are required."
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        if (
            normalizedEmail.length > 254 ||
            Buffer.byteLength(password, "utf8") > 72
        ) {
            return res.status(401).json({
                status: "error",
                message: "Invalid email or password."
            });
        }

        // 3. Find the user in PostgreSQL
        const result = await pool.query(
            `SELECT id, email, password_hash,
                    account_status, email_verified
             FROM users
             WHERE email = $1`,
            [normalizedEmail]
        );

        // 4. Check whether the account exists
        if (result.rows.length === 0) {
            return res.status(401).json({
                status: "error",
                message: "Invalid email or password."
            });
        }

        const user = result.rows[0];

        // 5. Verify the password against its stored hash
        const passwordMatches = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!passwordMatches) {
            return res.status(401).json({
                status: "error",
                message: "Invalid email or password."
            });
        }

        // 6. Check account status
        if (user.account_status !== "active") {
            return res.status(403).json({
                status: "error",
                message: "This account is not currently available."
            });
        }

        // 7. Generate a JWT access token
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not configured.");
        }

        const token = jwt.sign(
            { email: user.email },
            process.env.JWT_SECRET,
            {
                subject: String(user.id),
                expiresIn: "15m"
            }
        );

        // 8. Return the token and safe user information
        return res.status(200).json({
            status: "success",
            message: "Login successful.",
            token,
            token_type: "Bearer",
            user: {
                id: user.id,
                email: user.email,
                email_verified: user.email_verified
            }
        });

    } catch (error) {
        console.error("Login error:", error.message);

        return res.status(500).json({
            status: "error",
            message: "Something went wrong while logging in."
        });
    }
});