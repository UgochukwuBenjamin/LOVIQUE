import express from "express";
import pool from "./config/database.js";

import authRoutes from "./routes/auth.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import settingsRoutes from "./routes/settings.routes.js";
import cors from "cors";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://lovique-oemi.vercel.app"
];

app.use(cors({
  origin: allowedOrigins
}));

// Middleware
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/settings", settingsRoutes);

// Welcome Route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to LOVIQUE API",
  });
});

// Database Health Check
app.get("/api/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      status: "success",
      database: "connected",
      time: result.rows[0].now,
    });
  } catch (error) {
    console.error("Database error:", error.message);

    res.status(500).json({
      status: "error",
      database: "disconnected",
    });
  }
});

// Database Tables
app.get("/api/tables", async (req, res) => {
  try {
    const result = await pool.query(`
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
            ORDER BY table_name;
        `);

    res.json({
      status: "success",
      tables: result.rows,
    });
  } catch (error) {
    console.error("Tables error:", error.message);

    res.status(500).json({
      status: "error",
    });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`LOVIQUE API running on port ${PORT}`);
});