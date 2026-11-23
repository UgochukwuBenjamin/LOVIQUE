import express from "express";
import pool from "../config/database.js";
import authenticate from "../middleware/auth.middleware.js";

const router = express.Router();

// Map frontend setting names to database columns.
// Only these fields can be updated through this API.
const settingColumns = {
  showInterests: "show_interests",
  showOnlineStatus: "show_online_status",
  showDistance: "show_distance",
  showAge: "show_age",
  appearInDiscovery: "appear_in_discovery",
  readReceipts: "read_receipts",
  allowMessages: "allow_messages",
  allowLikes: "allow_likes",
  allowConnectionRequests: "allow_connection_requests",
  notifications: "notifications",
  messageNotifications: "message_notifications",
  matchNotifications: "match_notifications",
  likeNotifications: "like_notifications",
  connectionNotifications: "connection_notifications",
  emailNotifications: "email_notifications",
  promotionalNotifications: "promotional_notifications",
  incognitoMode: "incognito_mode",
  hideFromContacts: "hide_from_contacts",
  pauseAccount: "pause_account",
};

const booleanSettings = new Set(
  Object.keys(settingColumns).filter((key) => key !== "allowMessages")
);

const allowedMessageSettings = ["everyone", "matches", "nobody"];

// Create default settings if this user does not have a record yet.
async function ensureSettings(userId, db = pool) {
  await db.query(
    `INSERT INTO user_settings (user_id)
         VALUES ($1)
         ON CONFLICT (user_id) DO NOTHING`,
    [userId]
  );
}

// Retrieve settings in the format expected by the React frontend.
async function getSettings(userId, db = pool) {
  const result = await db.query(
    `SELECT
            COALESCE(p.profile_visibility, 'public') AS "profileVisibility",
            s.show_interests AS "showInterests",
            s.show_online_status AS "showOnlineStatus",
            s.show_distance AS "showDistance",
            s.show_age AS "showAge",
            s.appear_in_discovery AS "appearInDiscovery",
            s.read_receipts AS "readReceipts",
            s.allow_messages AS "allowMessages",
            s.allow_likes AS "allowLikes",
            s.allow_connection_requests AS "allowConnectionRequests",
            s.notifications AS "notifications",
            s.message_notifications AS "messageNotifications",
            s.match_notifications AS "matchNotifications",
            s.like_notifications AS "likeNotifications",
            s.connection_notifications AS "connectionNotifications",
            s.email_notifications AS "emailNotifications",
            s.promotional_notifications AS "promotionalNotifications",
            s.incognito_mode AS "incognitoMode",
            s.hide_from_contacts AS "hideFromContacts",
            s.pause_account AS "pauseAccount",
            s.updated_at AS "updatedAt"
         FROM user_settings s
         LEFT JOIN profiles p ON p.user_id = s.user_id
         WHERE s.user_id = $1`,
    [userId]
  );

  return result.rows[0];
}

// GET /api/settings/me
// Retrieve the authenticated user's settings.
router.get("/me", authenticate, async (req, res) => {
  try {
    await ensureSettings(req.user.id);

    const settings = await getSettings(req.user.id);

    return res.status(200).json({
      status: "success",
      settings,
    });
  } catch (error) {
    console.error("Settings retrieval error:", error.message);

    return res.status(500).json({
      status: "error",
      message: "Unable to retrieve your settings.",
    });
  }
});

// PATCH /api/settings/me
// Update only the settings supplied by the authenticated user.
router.patch("/me", authenticate, async (req, res) => {
  const client = await pool.connect();

  try {
    const updates = req.body;

    if (!updates || typeof updates !== "object" || Array.isArray(updates)) {
      return res.status(400).json({
        status: "error",
        message: "Please provide valid settings.",
      });
    }

    const fields = Object.keys(updates);

    if (fields.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "No settings were provided for updating.",
      });
    }

    // Reject fields that this endpoint does not support.
    const allowedFields = [...Object.keys(settingColumns), "profileVisibility"];

    const unknownFields = fields.filter((field) => !allowedFields.includes(field));

    if (unknownFields.length > 0) {
      return res.status(400).json({
        status: "error",
        message: `Unsupported setting: ${unknownFields.join(", ")}`,
      });
    }

    // Validate every supplied value before touching the database.
    for (const [field, value] of Object.entries(updates)) {
      if (booleanSettings.has(field) && typeof value !== "boolean") {
        return res.status(400).json({
          status: "error",
          message: `${field} must be true or false.`,
        });
      }

      if (field === "allowMessages" && !allowedMessageSettings.includes(value)) {
        return res.status(400).json({
          status: "error",
          message: "allowMessages must be everyone, matches or nobody.",
        });
      }

      if (field === "profileVisibility" && !["public", "private"].includes(value)) {
        return res.status(400).json({
          status: "error",
          message: "Profile visibility must be public or private.",
        });
      }
    }

    await client.query("BEGIN");

    // Ensure the user has a settings record.
    await ensureSettings(req.user.id, client);

    // Profile visibility belongs to the profiles table.
    if (Object.hasOwn(updates, "profileVisibility")) {
      const profileResult = await client.query(
        `UPDATE profiles
     SET profile_visibility = $1,
         updated_at = NOW()
     WHERE user_id = $2`,
        [updates.profileVisibility, req.user.id]
      );

      if (profileResult.rowCount === 0) {
        await client.query("ROLLBACK");

        return res.status(404).json({
          status: "error",
          message: "Create your profile before changing profile visibility.",
        });
      }
    }

    // Update only the supplied settings.
    const settingUpdates = Object.entries(updates).filter(
      ([field]) => field !== "profileVisibility"
    );

    if (settingUpdates.length > 0) {
      const values = [];
      const assignments = [];

      for (const [field, value] of settingUpdates) {
        values.push(value);

        // Column names come only from our fixed allowlist.
        assignments.push(`${settingColumns[field]} = $${values.length}`);
      }

      values.push(req.user.id);

      await client.query(
        `UPDATE user_settings
                 SET ${assignments.join(", ")},
                     updated_at = NOW()
                 WHERE user_id = $${values.length}`,
        values
      );
    }

    await client.query("COMMIT");

    const settings = await getSettings(req.user.id);

    return res.status(200).json({
      status: "success",
      message: "Settings updated successfully.",
      settings,
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Settings update error:", error.message);

    return res.status(500).json({
      status: "error",
      message: "Unable to update your settings.",
    });
  } finally {
    client.release();
  }
});

export default router;
