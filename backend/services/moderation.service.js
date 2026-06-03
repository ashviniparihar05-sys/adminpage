// backend/services/moderation.service.js
// ✅ NEW FILE: Central logic for suspend / ban / lift actions
// Called by: bot.service.js (auto) and users.routes.js (manual admin)

import { getDB } from "../config/database.js";
import { MODERATION_ACTIONS } from "../utils/constants.js";

// ─────────────────────────────────────────────────────────────────────────────
// ✅ NEW: Suspend a user for 7 days
// Sets isSuspended = true and records suspendedUntil timestamp
// ─────────────────────────────────────────────────────────────────────────────
export async function suspendUser(clerkUserId, reason = "Policy violation", triggeredBy = "admin") {
  const db = getDB();

  // ✅ NEW: Calculate expiry = now + 7 days
  const suspendedUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await db.collection("users").updateOne(
    { clerkUserId },
    {
      $set: {
        "moderation.isSuspended":   true,
        "moderation.suspendedAt":   new Date(),
        "moderation.suspendedUntil": suspendedUntil,   // ✅ NEW: expiry date stored
        "moderation.suspensionReason": reason,
        "moderation.suspendedBy":   triggeredBy,       // "admin" or "bot"
        updatedAt: new Date(),
      },
      // ✅ NEW: Keep a history array so you can see all past actions
      $push: {
        "moderation.history": {
          action: MODERATION_ACTIONS.SUSPEND_7D,
          reason,
          triggeredBy,
          at: new Date(),
          expiresAt: suspendedUntil,
        },
      },
    }
  );

  // ✅ NEW: Send notification to user
  await db.collection("notifications").insertOne({
    recipientClerkId: clerkUserId,
    type:             "account_suspended",
    message:          `Your account has been suspended for 7 days. Reason: ${reason}`,
    suspendedUntil,
    read:             false,
    createdAt:        new Date(),
    sentByBot:        triggeredBy === "bot",
  });

  console.log(`🔴 SUSPENDED: ${clerkUserId} until ${suspendedUntil.toISOString()} [by ${triggeredBy}]`);
  return { suspendedUntil };
}

// ─────────────────────────────────────────────────────────────────────────────
// ✅ NEW: Permanently ban a user
// isSuspended stays false, isBanned = true — no auto-lift
// ─────────────────────────────────────────────────────────────────────────────
export async function banUser(clerkUserId, reason = "Repeated policy violations", triggeredBy = "admin") {
  const db = getDB();

  await db.collection("users").updateOne(
    { clerkUserId },
    {
      $set: {
        "moderation.isBanned":      true,
        "moderation.isSuspended":   false,  // clear any active suspension
        "moderation.bannedAt":      new Date(),
        "moderation.banReason":     reason,
        "moderation.bannedBy":      triggeredBy,
        updatedAt: new Date(),
      },
      $push: {
        "moderation.history": {
          action:      MODERATION_ACTIONS.PERMANENT_BAN,
          reason,
          triggeredBy,
          at:          new Date(),
        },
      },
    }
  );

  await db.collection("notifications").insertOne({
    recipientClerkId: clerkUserId,
    type:             "account_banned",
    message:          `Your account has been permanently banned. Reason: ${reason}`,
    read:             false,
    createdAt:        new Date(),
    sentByBot:        triggeredBy === "bot",
  });

  console.log(`⛔ BANNED: ${clerkUserId} permanently [by ${triggeredBy}]`);
}

// ─────────────────────────────────────────────────────────────────────────────
// ✅ NEW: Lift a suspension early (manual admin action)
// ─────────────────────────────────────────────────────────────────────────────
export async function unsuspendUser(clerkUserId, adminNote = "") {
  const db = getDB();

  await db.collection("users").updateOne(
    { clerkUserId },
    {
      $set: {
        "moderation.isSuspended":    false,
        "moderation.suspendedUntil": null,
        "moderation.unsuspendedAt":  new Date(),
        updatedAt: new Date(),
      },
      $push: {
        "moderation.history": {
          action:      MODERATION_ACTIONS.UNSUSPEND,
          reason:      adminNote || "Manually lifted by admin",
          triggeredBy: "admin",
          at:          new Date(),
        },
      },
    }
  );

  await db.collection("notifications").insertOne({
    recipientClerkId: clerkUserId,
    type:             "account_unsuspended",
    message:          "Your account suspension has been lifted. Welcome back!",
    read:             false,
    createdAt:        new Date(),
    sentByBot:        false,
  });

  console.log(`✅ UNSUSPENDED: ${clerkUserId}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// ✅ NEW: Reverse a permanent ban
// ─────────────────────────────────────────────────────────────────────────────
export async function unbanUser(clerkUserId, adminNote = "") {
  const db = getDB();

  await db.collection("users").updateOne(
    { clerkUserId },
    {
      $set: {
        "moderation.isBanned":   false,
        "moderation.unbannedAt": new Date(),
        updatedAt: new Date(),
      },
      $push: {
        "moderation.history": {
          action:      MODERATION_ACTIONS.UNBAN,
          reason:      adminNote || "Manually unbanned by admin",
          triggeredBy: "admin",
          at:          new Date(),
        },
      },
    }
  );

  await db.collection("notifications").insertOne({
    recipientClerkId: clerkUserId,
    type:             "account_unbanned",
    message:          "Your account ban has been reversed. Welcome back!",
    read:             false,
    createdAt:        new Date(),
    sentByBot:        false,
  });

  console.log(`✅ UNBANNED: ${clerkUserId}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// ✅ NEW: Auto-lift expired suspensions (call this in bot cycle or a cron)
// Finds all users whose suspendedUntil is in the past and lifts them
// ─────────────────────────────────────────────────────────────────────────────
export async function liftExpiredSuspensions() {
  const db = getDB();
  const now = new Date();

  const result = await db.collection("users").updateMany(
    {
      "moderation.isSuspended":    true,
      "moderation.suspendedUntil": { $lte: now },  // expiry has passed
    },
    {
      $set: {
        "moderation.isSuspended":    false,
        "moderation.autoLiftedAt":   now,
        updatedAt: now,
      },
      $push: {
        "moderation.history": {
          action:      "auto_unsuspend",
          reason:      "7-day suspension period expired",
          triggeredBy: "bot",
          at:          now,
        },
      },
    }
  );

  if (result.modifiedCount > 0) {
    console.log(`⏰ AUTO-LIFTED ${result.modifiedCount} expired suspension(s)`);
  }
  return result.modifiedCount;
}

// ─────────────────────────────────────────────────────────────────────────────
// ✅ NEW: Count how many bot-rejections a user has had (for auto-trigger logic)
// Used by bot.service.js after each rejection to decide if threshold is hit
// ─────────────────────────────────────────────────────────────────────────────
export async function countRejections(clerkUserId) {
  const db = getDB();

  // Count events + services that were bot-rejected for this user
  const [eventRejections, serviceRejections] = await Promise.all([
    db.collection("events").countDocuments({
      creatorClerkId: clerkUserId,
      "botDecision.action": "rejected",
    }),
    db.collection("services").countDocuments({
      creatorClerkId: clerkUserId,
      "botDecision.action": "rejected",
    }),
  ]);

  return eventRejections + serviceRejections;
}