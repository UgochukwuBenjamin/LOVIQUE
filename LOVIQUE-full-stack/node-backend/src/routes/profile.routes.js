
import express from "express";
import pool from "../config/database.js";
import authenticate from "../middleware/auth.middleware.js";
import multer from "multer";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";
import "dotenv/config";

const router = express.Router();

// Supabase configuration
const BUCKET = "profile-pictures";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Diagnostic logs — never log your secret key
console.log("Supabase URL:", SUPABASE_URL);
console.log("Storage bucket:", BUCKET);

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error("Supabase URL or secret key is missing from backend environment variables.");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Multer configuration
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.mimetype)) {
      return callback(
        new Error("Only JPEG, PNG and WebP images are allowed.")
      );
    }

    callback(null, true);
  },
});

// GET /api/profiles/me
router.get("/me", authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
          user_id AS "userId",
          full_name AS "fullName",
          username,
          first_name AS "firstName",
          bio,
          avatar_url AS "avatarUrl",
          country,
          profile_visibility AS visibility,
          onboarding_completed AS "onboardingCompleted",
          created_at AS "createdAt",
          updated_at AS "updatedAt"
       FROM profiles
       WHERE user_id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Profile not found.",
      });
    }

    return res.json({
      status: "success",
      profile: result.rows[0],
    });
  } catch (error) {
    console.error("Profile retrieval error:", error.message);

    return res.status(500).json({
      status: "error",
      message: "Unable to retrieve profile.",
    });
  }
});

// POST /api/profiles/complete
router.post(
  "/complete",
  authenticate,
  (req, res, next) => {
    upload.single("picture")(req, res, (error) => {
      if (error) {
        return res.status(400).json({
          status: "error",
          message: error.message,
        });
      }

      next();
    });
  },
  async (req, res) => {
    const userId = req.user.id;

    let client;
    let uploadedImagePath = null;

    try {
      const {
        fullName,
        username,
        country,
        bio,
        visibility,
        allowMessages,
        showInterests,
      } = req.body;

      // Validate basic profile information
      const cleanFullName = fullName?.trim();
      const cleanUsername = username?.trim().toLowerCase();
      const cleanCountry = country?.trim();
      const cleanBio = bio?.trim() || "";

      if (!cleanFullName || cleanFullName.length > 150) {
        return res.status(400).json({
          status: "error",
          message: "Enter a valid full name.",
        });
      }

      if (!cleanUsername || !/^[a-z0-9_]{3,30}$/.test(cleanUsername)) {
        return res.status(400).json({
          status: "error",
          message:
            "Username must be 3–30 characters and contain only letters, numbers and underscores.",
        });
      }

      if (!cleanCountry || cleanCountry.length > 100) {
        return res.status(400).json({
          status: "error",
          message: "Enter a valid country.",
        });
      }

      if (cleanBio.length > 250) {
        return res.status(400).json({
          status: "error",
          message: "Your bio cannot exceed 250 characters.",
        });
      }

      if (!["public", "private"].includes(visibility)) {
        return res.status(400).json({
          status: "error",
          message: "Invalid profile visibility.",
        });
      }

      if (!["everyone", "matches", "nobody"].includes(allowMessages)) {
        return res.status(400).json({
          status: "error",
          message: "Invalid messaging preference.",
        });
      }

      if (!["true", "false", true, false].includes(showInterests)) {
        return res.status(400).json({
          status: "error",
          message: "Invalid show interests preference.",
        });
      }

      const shouldShowInterests =
        showInterests === true || showInterests === "true";

      // Parse and validate interests
      let interests;

      try {
        interests = JSON.parse(req.body.interests);
      } catch {
        return res.status(400).json({
          status: "error",
          message: "Interests must be a valid JSON array.",
        });
      }

      if (
        !Array.isArray(interests) ||
        interests.length === 0 ||
        interests.length > 19 ||
        !interests.every(
          (item) => typeof item === "string" && item.trim().length > 0
        )
      ) {
        return res.status(400).json({
          status: "error",
          message: "Select between 1 and 19 valid interests.",
        });
      }

      interests = [...new Set(interests.map((item) => item.trim()))];

      // Upload optional profile picture
      let avatarUrl = null;

      if (req.file) {
        const extensionByType = {
          "image/jpeg": "jpg",
          "image/png": "png",
          "image/webp": "webp",
        };

        const extension = extensionByType[req.file.mimetype];

        uploadedImagePath = `${userId}/${randomUUID()}.${extension}`;

        // Diagnostic information
        console.log("----- PROFILE IMAGE UPLOAD DEBUG -----");
        console.log("Supabase URL:", SUPABASE_URL);
        console.log("Storage bucket:", BUCKET);
        console.log("Image upload path:", uploadedImagePath);
        console.log("Image MIME type:", req.file.mimetype);
        console.log("Image size:", req.file.size, "bytes");
        console.log("--------------------------------------");

        const { data: uploadData, error: uploadError } =
          await supabase.storage
            .from(BUCKET)
            .upload(uploadedImagePath, req.file.buffer, {
              contentType: req.file.mimetype,
              upsert: false,
            });

        if (uploadError) {
          console.error("Supabase Storage upload failed:", uploadError);
          throw uploadError;
        }

        console.log("Image uploaded successfully:", uploadData?.path);

        const { data } = supabase.storage
          .from(BUCKET)
          .getPublicUrl(uploadedImagePath);

        avatarUrl = data.publicUrl;
      }

      // Begin database transaction
      client = await pool.connect();

      await client.query("BEGIN");

      // Save profile
      await client.query(
        `INSERT INTO profiles (
            user_id,
            full_name,
            first_name,
            username,
            country,
            bio,
            avatar_url,
            profile_visibility,
            onboarding_completed,
            updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, TRUE, NOW())
        ON CONFLICT (user_id)
        DO UPDATE SET
            full_name = EXCLUDED.full_name,
            first_name = EXCLUDED.first_name,
            username = EXCLUDED.username,
            country = EXCLUDED.country,
            bio = EXCLUDED.bio,
            avatar_url = COALESCE(
                EXCLUDED.avatar_url,
                profiles.avatar_url
            ),
            profile_visibility = EXCLUDED.profile_visibility,
            onboarding_completed = TRUE,
            updated_at = NOW()`,
        [
          userId,
          cleanFullName,
          cleanFullName.split(/\s+/)[0],
          cleanUsername,
          cleanCountry,
          cleanBio,
          avatarUrl,
          visibility,
        ]
      );

      // Save selected interests
      const interestIds = [];

      for (const interest of interests) {
        const result = await client.query(
          `INSERT INTO interests (name)
           VALUES ($1)
           ON CONFLICT (name)
           DO UPDATE SET name = EXCLUDED.name
           RETURNING id`,
          [interest]
        );

        interestIds.push(result.rows[0].id);
      }

      await client.query(
        `DELETE FROM user_interests
         WHERE user_id = $1`,
        [userId]
      );

      for (const interestId of interestIds) {
        await client.query(
          `INSERT INTO user_interests (user_id, interest_id)
           VALUES ($1, $2)`,
          [userId, interestId]
        );
      }

      // Save onboarding preferences
      await client.query(
        `INSERT INTO user_settings (
            user_id,
            show_interests,
            allow_messages,
            updated_at
        )
        VALUES ($1, $2, $3, NOW())
        ON CONFLICT (user_id)
        DO UPDATE SET
            show_interests = EXCLUDED.show_interests,
            allow_messages = EXCLUDED.allow_messages,
            updated_at = NOW()`,
        [userId, shouldShowInterests, allowMessages]
      );

      await client.query("COMMIT");

      return res.status(200).json({
        status: "success",
        message: "Your LOVIQUE profile has been created.",
        profile: {
          fullName: cleanFullName,
          username: cleanUsername,
          country: cleanCountry,
          bio: cleanBio,
          avatarUrl,
          visibility,
          interests,
          allowMessages,
          showInterests: shouldShowInterests,
          onboardingCompleted: true,
        },
      });
    } catch (error) {
      if (client) {
        await client.query("ROLLBACK").catch(() => {});
      }

      // Remove newly uploaded image if database save fails
      if (uploadedImagePath) {
        await supabase.storage
          .from(BUCKET)
          .remove([uploadedImagePath])
          .catch((cleanupError) => {
            console.error("Image cleanup failed:", cleanupError);
          });
      }

      console.error("Onboarding error:", error);

      if (error.code === "23505") {
        return res.status(409).json({
          status: "error",
          message: "That username is already taken.",
        });
      }

      return res.status(500).json({
        status: "error",
        message: "Unable to complete your profile. Please try again.",
      });
    } finally {
      if (client) {
        client.release();
      }
    }
  }
);

export default router;