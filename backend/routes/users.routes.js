// // // backend/routes/users.routes.js
// // // User endpoints

// // import express from "express";
// // import { ObjectId } from "mongodb";
// // import { getDB } from "../config/database.js";
// // import { calculateReputation } from "../utils/reputation.js";
// // import { normalizeEvent } from "../models/event.normalizer.js";

// // // ✅ NEW: Import moderation service functions
// // import {
// //   suspendUser,
// //   banUser,
// //   unsuspendUser,
// //   unbanUser,
// // } from "../services/moderation.service.js";
// // const router = express.Router();

// // // GET /users - List all users
// // router.get("/", async (req, res) => {
// //   try {
// //     const db = getDB();
// //     const rawUsers = await db
// //       .collection("users")
// //       .find({})
// //       .sort({ createdAt: -1 })
// //       .limit(100)
// //       .toArray();
// //     const rawStats = await db.collection("user_stats").find({}).toArray();
// //     const statsMap = {};
// //     for (const s of rawStats) {
// //       if (s.clerkUserId) statsMap[s.clerkUserId] = s;
// //     }
// //     const eventsAgg = await db
// //       .collection("events")
// //       .aggregate([{ $group: { _id: "$creatorClerkId", count: { $sum: 1 } } }])
// //       .toArray();
// //     const eventsMap = {};
// //     for (const e of eventsAgg) {
// //       if (e._id) eventsMap[e._id] = e.count;
// //     }
// //     const attendedAgg = await db
// //       .collection("events")
// //       .aggregate([
// //         { $unwind: { path: "$attendees", preserveNullAndEmptyArrays: false } },
// //         {
// //           $group: {
// //             _id: {
// //               $cond: [
// //                 { $eq: [{ $type: "$attendees" }, "string"] },
// //                 "$attendees",
// //                 "$attendees.clerkId",
// //               ],
// //             },
// //             count: { $sum: 1 },
// //           },
// //         },
// //       ])
// //       .toArray();
// //     const attendedMap = {};
// //     for (const a of attendedAgg) {
// //       if (a._id) attendedMap[a._id] = a.count;
// //     }

// //     const users = rawUsers.map((u) => {
// //       const clerkId = u.clerkUserId || u._id?.toString();
// //       const stats = statsMap[clerkId] || {};
// //       const profile = u.profile || {};
// //       const moderation = u.moderation || {};
// //       const eventsHosted = stats.eventsHosted ?? eventsMap[clerkId] ?? 0;
// //       const eventsAttended = stats.totalAttendees ?? attendedMap[clerkId] ?? 0;
// //       const rating = stats.rating ?? 0;
// //       const isHost = eventsHosted > 0;
// //       const isAttendee = eventsAttended > 0;
// //       const userType = isHost && isAttendee ? "Both" : isHost ? "Host" : "User";
// //       const activity = isHost
// //         ? `${eventsHosted} Hosted`
// //         : eventsAttended > 0
// //         ? `${eventsAttended} Attended`
// //         : "New User";
// //       const reputation = calculateReputation({
// //         rating,
// //         reviewsCount: stats.reviewsCount ?? 0,
// //         eventsHosted,
// //         eventsAttended,
// //         isBanned: moderation.isBanned ?? false,
// //         isSuspended: moderation.isSuspended ?? false,
// //       });
// //       const status = u.isDeleted
// //         ? "Inactive"
// //         : moderation.isBanned
// //         ? "Banned"
// //         : moderation.isSuspended
// //         ? "Suspended"
// //         : "Active";
// //       const name =
// //         `${profile.firstName || ""} ${profile.lastName || ""}`.trim() ||
// //         profile.username ||
// //         "User";
// //       const updatedAt = u.updatedAt || u.createdAt;
// //       const diff = Date.now() - (updatedAt ? new Date(updatedAt).getTime() : 0);
// //       const mins = Math.floor(diff / 60000),
// //         hours = Math.floor(diff / 3600000),
// //         days = Math.floor(diff / 86400000);
// //       const lastActive =
// //         mins < 60 ? `${mins}m ago` : hours < 24 ? `${hours}h ago` : `${days}d ago`;
// //       return {
// //         id: u._id?.toString(),
// //         clerkUserId: clerkId,
// //         name,
// //         username: profile.username
// //           ? `@${profile.username}`
// //           : `@user_${u._id?.toString().slice(-4)}`,
// //         joined: new Date(u.createdAt || Date.now()).toLocaleDateString("en-US", {
// //           month: "short",
// //           year: "numeric",
// //         }),
// //         location: profile.location || profile.city || "India",
// //         type: userType,
// //         activity,
// //         lastActive,
// //         reputation,
// //         status,
// //         image:
// //           profile.imageUrl ||
// //           profile.avatar ||
// //           `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff&size=128`,
// //         eventsHosted,
// //         eventsAttended,
// //         rating: stats.rating ?? 0,
// //         reviewsCount: stats.reviewsCount ?? 0,
// //         totalEarnings: stats.overallEarning ?? 0,
// //         isBanned: moderation.isBanned ?? false,
// //         isSuspended: moderation.isSuspended ?? false,
// //       };
// //     });
// //     res.json(users);
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // });

// // // GET /users/:id
// // router.get("/:id", async (req, res) => {
// //   try {
// //     const db = getDB();
// //     const { id } = req.params;
// //     let user = null;
// //     try {
// //       user = await db.collection("users").findOne({ _id: new ObjectId(id) });
// //     } catch (_) {}
// //     if (!user) user = await db.collection("users").findOne({ clerkUserId: id });
// //     if (!user) return res.status(404).json({ error: "User not found" });
// //     const stats =
// //       (await db.collection("user_stats").findOne({ clerkUserId: user.clerkUserId })) || {};
// //     const eventsCount = await db
// //       .collection("events")
// //       .countDocuments({ creatorClerkId: user.clerkUserId });
// //     const recentEvents = await db
// //       .collection("events")
// //       .find({ creatorClerkId: user.clerkUserId })
// //       .sort({ createdAt: -1 })
// //       .limit(5)
// //       .toArray();
// //     res.json({
// //       user,
// //       stats,
// //       eventsCount,
// //       recentEvents: recentEvents.map(normalizeEvent),
// //     });
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // });
// // // ─────────────────────────────────────────────────────────────────────────────
// // // ✅ NEW ENDPOINT: POST /users/:clerkId/suspend
// // // Manual 7-day suspension by admin
// // // Body: { reason: "string" }
// // // ─────────────────────────────────────────────────────────────────────────────
// // router.post("/:clerkId/suspend", async (req, res) => {
// //   try {
// //     const { clerkId } = req.params;
// //     const { reason = "Admin suspension" } = req.body;

// //     // Check user exists first
// //     const user = await getDB().collection("users").findOne({ clerkUserId: clerkId });
// //     if (!user) return res.status(404).json({ error: "User not found" });

// //     // Check not already banned (suspended is fine to override)
// //     if (user.moderation?.isBanned) {
// //       return res.status(400).json({ error: "User is already permanently banned" });
// //     }

// //     const { suspendedUntil } = await suspendUser(clerkId, reason, "admin");
// //     res.json({ success: true, clerkId, action: "suspended", suspendedUntil });
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // });

// // // ─────────────────────────────────────────────────────────────────────────────
// // // ✅ NEW ENDPOINT: POST /users/:clerkId/ban
// // // Manual permanent ban by admin
// // // Body: { reason: "string" }
// // // ─────────────────────────────────────────────────────────────────────────────
// // router.post("/:clerkId/ban", async (req, res) => {
// //   try {
// //     const { clerkId } = req.params;
// //     const { reason = "Admin ban" } = req.body;

// //     const user = await getDB().collection("users").findOne({ clerkUserId: clerkId });
// //     if (!user) return res.status(404).json({ error: "User not found" });

// //     if (user.moderation?.isBanned) {
// //       return res.status(400).json({ error: "User is already banned" });
// //     }

// //     await banUser(clerkId, reason, "admin");
// //     res.json({ success: true, clerkId, action: "banned" });
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // });

// // // ─────────────────────────────────────────────────────────────────────────────
// // // ✅ NEW ENDPOINT: POST /users/:clerkId/unsuspend
// // // Lift a suspension early (manually by admin)
// // // Body: { note: "string" } (optional)
// // // ─────────────────────────────────────────────────────────────────────────────
// // router.post("/:clerkId/unsuspend", async (req, res) => {
// //   try {
// //     const { clerkId } = req.params;
// //     const { note = "" } = req.body;

// //     const user = await getDB().collection("users").findOne({ clerkUserId: clerkId });
// //     if (!user) return res.status(404).json({ error: "User not found" });

// //     if (!user.moderation?.isSuspended) {
// //       return res.status(400).json({ error: "User is not currently suspended" });
// //     }

// //     await unsuspendUser(clerkId, note);
// //     res.json({ success: true, clerkId, action: "unsuspended" });
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // });

// // // ─────────────────────────────────────────────────────────────────────────────
// // // ✅ NEW ENDPOINT: POST /users/:clerkId/unban
// // // Reverse a permanent ban
// // // Body: { note: "string" } (optional)
// // // ─────────────────────────────────────────────────────────────────────────────
// // router.post("/:clerkId/unban", async (req, res) => {
// //   try {
// //     const { clerkId } = req.params;
// //     const { note = "" } = req.body;

// //     const user = await getDB().collection("users").findOne({ clerkUserId: clerkId });
// //     if (!user) return res.status(404).json({ error: "User not found" });

// //     if (!user.moderation?.isBanned) {
// //       return res.status(400).json({ error: "User is not currently banned" });
// //     }

// //     await unbanUser(clerkId, note);
// //     res.json({ success: true, clerkId, action: "unbanned" });
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // });

// // // ─────────────────────────────────────────────────────────────────────────────
// // // ✅ NEW ENDPOINT: GET /users/:clerkId/moderation-history
// // // Returns full moderation log for a user (for admin dashboard)
// // // ─────────────────────────────────────────────────────────────────────────────
// // router.get("/:clerkId/moderation-history", async (req, res) => {
// //   try {
// //     const { clerkId } = req.params;
// //     const user = await getDB().collection("users").findOne(
// //       { clerkUserId: clerkId },
// //       { projection: { "moderation": 1 } }
// //     );
// //     if (!user) return res.status(404).json({ error: "User not found" });

// //     res.json({
// //       clerkId,
// //       current: {
// //         isBanned:        user.moderation?.isBanned       ?? false,
// //         isSuspended:     user.moderation?.isSuspended    ?? false,
// //         suspendedUntil:  user.moderation?.suspendedUntil ?? null,
// //       },
// //       history: user.moderation?.history ?? [],
// //     });
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // });

// // export default router;
// // backend/routes/users.routes.js
// // User endpoints

// import express from "express";
// import { ObjectId } from "mongodb";
// import { getDB } from "../config/database.js";
// import { calculateReputation } from "../utils/reputation.js";
// import { normalizeEvent } from "../models/event.normalizer.js";
// import {
//   suspendUser,
//   banUser,
//   unsuspendUser,
//   unbanUser,
// } from "../services/moderation.service.js";

// const router = express.Router();

// // ─────────────────────────────────────────────────────────────────────────────
// // GET /users - List all users
// // ─────────────────────────────────────────────────────────────────────────────
// router.get("/", async (req, res) => {
//   try {
//     const db = getDB();
//     const rawUsers = await db
//       .collection("users")
//       .find({})
//       .sort({ createdAt: -1 })
//       .limit(100)
//       .toArray();
//     const rawStats = await db.collection("user_stats").find({}).toArray();
//     const statsMap = {};
//     for (const s of rawStats) {
//       if (s.clerkUserId) statsMap[s.clerkUserId] = s;
//     }
//     const eventsAgg = await db
//       .collection("events")
//       .aggregate([{ $group: { _id: "$creatorClerkId", count: { $sum: 1 } } }])
//       .toArray();
//     const eventsMap = {};
//     for (const e of eventsAgg) {
//       if (e._id) eventsMap[e._id] = e.count;
//     }
//     const attendedAgg = await db
//       .collection("events")
//       .aggregate([
//         { $unwind: { path: "$attendees", preserveNullAndEmptyArrays: false } },
//         {
//           $group: {
//             _id: {
//               $cond: [
//                 { $eq: [{ $type: "$attendees" }, "string"] },
//                 "$attendees",
//                 "$attendees.clerkId",
//               ],
//             },
//             count: { $sum: 1 },
//           },
//         },
//       ])
//       .toArray();
//     const attendedMap = {};
//     for (const a of attendedAgg) {
//       if (a._id) attendedMap[a._id] = a.count;
//     }

//     const users = rawUsers.map((u) => {
//       const clerkId = u.clerkUserId || u._id?.toString();
//       const stats = statsMap[clerkId] || {};
//       const profile = u.profile || {};
//       const moderation = u.moderation || {};
//       const eventsHosted = stats.eventsHosted ?? eventsMap[clerkId] ?? 0;
//       const eventsAttended = stats.totalAttendees ?? attendedMap[clerkId] ?? 0;
//       const rating = stats.rating ?? 0;
//       const isHost = eventsHosted > 0;
//       const isAttendee = eventsAttended > 0;
//       const userType = isHost && isAttendee ? "Both" : isHost ? "Host" : "User";
//       const activity = isHost
//         ? `${eventsHosted} Hosted`
//         : eventsAttended > 0
//         ? `${eventsAttended} Attended`
//         : "New User";
//       const reputation = calculateReputation({
//         rating,
//         reviewsCount: stats.reviewsCount ?? 0,
//         eventsHosted,
//         eventsAttended,
//         isBanned: moderation.isBanned ?? false,
//         isSuspended: moderation.isSuspended ?? false,
//       });
//       const status = u.isDeleted
//         ? "Inactive"
//         : moderation.isBanned
//         ? "Banned"
//         : moderation.isSuspended
//         ? "Suspended"
//         : "Active";
//       const name =
//         `${profile.firstName || ""} ${profile.lastName || ""}`.trim() ||
//         profile.username ||
//         "User";
//       const updatedAt = u.updatedAt || u.createdAt;
//       const diff = Date.now() - (updatedAt ? new Date(updatedAt).getTime() : 0);
//       const mins = Math.floor(diff / 60000),
//         hours = Math.floor(diff / 3600000),
//         days = Math.floor(diff / 86400000);
//       const lastActive =
//         mins < 60 ? `${mins}m ago` : hours < 24 ? `${hours}h ago` : `${days}d ago`;
//       return {
//         id: u._id?.toString(),
//         clerkUserId: clerkId,
//         name,
//         username: profile.username
//           ? `@${profile.username}`
//           : `@user_${u._id?.toString().slice(-4)}`,
//         joined: new Date(u.createdAt || Date.now()).toLocaleDateString("en-US", {
//           month: "short",
//           year: "numeric",
//         }),
//         location: profile.location || profile.city || "India",
//         type: userType,
//         activity,
//         lastActive,
//         reputation,
//         status,
//         image:
//           profile.imageUrl ||
//           profile.avatar ||
//           `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff&size=128`,
//         eventsHosted,
//         eventsAttended,
//         rating: stats.rating ?? 0,
//         reviewsCount: stats.reviewsCount ?? 0,
//         totalEarnings: stats.overallEarning ?? 0,
//         isBanned: moderation.isBanned ?? false,
//         isSuspended: moderation.isSuspended ?? false,
//         // ✅ NEW: suspendedUntil bhi return karo frontend ke liye
//         suspendedUntil: moderation.suspendedUntil ?? null,
//       };
//     });
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // ─────────────────────────────────────────────────────────────────────────────
// // ✅ IMPORTANT: Yeh saare SPECIFIC routes GET /:id se PEHLE hain
// // Rule: Express routes upar se neeche match hote hain
// // /:id ek wildcard hai — woh "suspend", "ban" sab kuch pakad leta hai
// // Isliye specific routes HAMESHA /:id se upar likhne chahiye
// // ─────────────────────────────────────────────────────────────────────────────

// // ─────────────────────────────────────────────────────────────────────────────
// // ✅ NEW: GET /users/:clerkId/moderation-history
// // Admin dashboard ke liye full moderation audit log
// // ─────────────────────────────────────────────────────────────────────────────
// router.get("/:clerkId/moderation-history", async (req, res) => {
//   try {
//     const { clerkId } = req.params;
//     const user = await getDB().collection("users").findOne(
//       { clerkUserId: clerkId },
//       { projection: { moderation: 1 } }
//     );
//     if (!user) return res.status(404).json({ error: "User not found" });

//     res.json({
//       clerkId,
//       current: {
//         isBanned:       user.moderation?.isBanned       ?? false,
//         isSuspended:    user.moderation?.isSuspended    ?? false,
//         suspendedUntil: user.moderation?.suspendedUntil ?? null,
//       },
//       // ✅ NEW: Puri history — har action record hoti hai yahan
//       history: user.moderation?.history ?? [],
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // ─────────────────────────────────────────────────────────────────────────────
// // ✅ NEW: POST /users/:clerkId/suspend
// // Manual 7-day suspension by admin
// // Body: { reason: "string" }
// // ─────────────────────────────────────────────────────────────────────────────
// router.post("/:clerkId/suspend", async (req, res) => {
//   try {
//     const { clerkId } = req.params;
//     const { reason = "Admin suspension" } = req.body;

//     const user = await getDB().collection("users").findOne({ clerkUserId: clerkId });
//     if (!user) return res.status(404).json({ error: "User not found" });

//     // ✅ Already banned hai toh suspend nahi kar sakte
//     if (user.moderation?.isBanned) {
//       return res.status(400).json({ error: "User is already permanently banned" });
//     }

//     const { suspendedUntil } = await suspendUser(clerkId, reason, "admin");
//     res.json({ success: true, clerkId, action: "suspended", suspendedUntil });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // ─────────────────────────────────────────────────────────────────────────────
// // ✅ NEW: POST /users/:clerkId/ban
// // Manual permanent ban by admin
// // Body: { reason: "string" }
// // ─────────────────────────────────────────────────────────────────────────────
// router.post("/:clerkId/ban", async (req, res) => {
//   try {
//     const { clerkId } = req.params;
//     const { reason = "Admin ban" } = req.body;

//     const user = await getDB().collection("users").findOne({ clerkUserId: clerkId });
//     if (!user) return res.status(404).json({ error: "User not found" });

//     // ✅ Already banned hai toh dobara ban nahi karo
//     if (user.moderation?.isBanned) {
//       return res.status(400).json({ error: "User is already banned" });
//     }

//     await banUser(clerkId, reason, "admin");
//     res.json({ success: true, clerkId, action: "banned" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // ─────────────────────────────────────────────────────────────────────────────
// // ✅ NEW: POST /users/:clerkId/unsuspend
// // Suspension early lift karo (admin manually)
// // Body: { note: "string" } optional
// // ─────────────────────────────────────────────────────────────────────────────
// router.post("/:clerkId/unsuspend", async (req, res) => {
//   try {
//     const { clerkId } = req.params;
//     const { note = "" } = req.body;

//     const user = await getDB().collection("users").findOne({ clerkUserId: clerkId });
//     if (!user) return res.status(404).json({ error: "User not found" });

//     // ✅ Suspended nahi hai toh unsuspend ka koi matlab nahi
//     if (!user.moderation?.isSuspended) {
//       return res.status(400).json({ error: "User is not currently suspended" });
//     }

//     await unsuspendUser(clerkId, note);
//     res.json({ success: true, clerkId, action: "unsuspended" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // ─────────────────────────────────────────────────────────────────────────────
// // ✅ NEW: POST /users/:clerkId/unban
// // Permanent ban reverse karo
// // Body: { note: "string" } optional
// // ─────────────────────────────────────────────────────────────────────────────
// router.post("/:clerkId/unban", async (req, res) => {
//   try {
//     const { clerkId } = req.params;
//     const { note = "" } = req.body;

//     const user = await getDB().collection("users").findOne({ clerkUserId: clerkId });
//     if (!user) return res.status(404).json({ error: "User not found" });

//     // ✅ Banned nahi hai toh unban ka koi matlab nahi
//     if (!user.moderation?.isBanned) {
//       return res.status(400).json({ error: "User is not currently banned" });
//     }

//     await unbanUser(clerkId, note);
//     res.json({ success: true, clerkId, action: "unbanned" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // ─────────────────────────────────────────────────────────────────────────────
// // GET /users/:id  ← ✅ SABSE NEECHE — wildcard route hamesha last mein
// // Yeh "user_abc123", MongoDB ObjectId, ya clerkUserId — sab accept karta hai
// // ─────────────────────────────────────────────────────────────────────────────
// router.get("/:id", async (req, res) => {
//   try {
//     const db = getDB();
//     const { id } = req.params;
//     let user = null;
//     try {
//       user = await db.collection("users").findOne({ _id: new ObjectId(id) });
//     } catch (_) {}
//     if (!user) user = await db.collection("users").findOne({ clerkUserId: id });
//     if (!user) return res.status(404).json({ error: "User not found" });
//     const stats =
//       (await db.collection("user_stats").findOne({ clerkUserId: user.clerkUserId })) || {};
//     const eventsCount = await db
//       .collection("events")
//       .countDocuments({ creatorClerkId: user.clerkUserId });
//     const recentEvents = await db
//       .collection("events")
//       .find({ creatorClerkId: user.clerkUserId })
//       .sort({ createdAt: -1 })
//       .limit(5)
//       .toArray();
//     res.json({
//       user,
//       stats,
//       eventsCount,
//       recentEvents: recentEvents.map(normalizeEvent),
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// export default router;
// backend/routes/users.routes.js
// User endpoints

import express from "express";
import { ObjectId } from "mongodb";
import { getDB } from "../config/database.js";
import { calculateReputation } from "../utils/reputation.js";
import { normalizeEvent } from "../models/event.normalizer.js";

const router = express.Router();

// GET /users - List all users
router.get("/", async (req, res) => {
  try {
    const db = getDB();
    const rawUsers = await db
      .collection("users")
      .find({})
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray();
    const rawStats = await db.collection("user_stats").find({}).toArray();
    const statsMap = {};
    for (const s of rawStats) {
      if (s.clerkUserId) statsMap[s.clerkUserId] = s;
    }
    const eventsAgg = await db
      .collection("events")
      .aggregate([{ $group: { _id: "$creatorClerkId", count: { $sum: 1 } } }])
      .toArray();
    const eventsMap = {};
    for (const e of eventsAgg) {
      if (e._id) eventsMap[e._id] = e.count;
    }
    const attendedAgg = await db
      .collection("events")
      .aggregate([
        { $unwind: { path: "$attendees", preserveNullAndEmptyArrays: false } },
        {
          $group: {
            _id: {
              $cond: [
                { $eq: [{ $type: "$attendees" }, "string"] },
                "$attendees",
                "$attendees.clerkId",
              ],
            },
            count: { $sum: 1 },
          },
        },
      ])
      .toArray();
    const attendedMap = {};
    for (const a of attendedAgg) {
      if (a._id) attendedMap[a._id] = a.count;
    }

    const users = rawUsers.map((u) => {
      const clerkId = u.clerkUserId || u._id?.toString();
      const stats = statsMap[clerkId] || {};
      const profile = u.profile || {};
      const moderation = u.moderation || {};
      const eventsHosted = stats.eventsHosted ?? eventsMap[clerkId] ?? 0;
      const eventsAttended = stats.totalAttendees ?? attendedMap[clerkId] ?? 0;
      const rating = stats.rating ?? 0;
      const isHost = eventsHosted > 0;
      const isAttendee = eventsAttended > 0;
      const userType = isHost && isAttendee ? "Both" : isHost ? "Host" : "User";
      const activity = isHost
        ? `${eventsHosted} Hosted`
        : eventsAttended > 0
        ? `${eventsAttended} Attended`
        : "New User";
      const reputation = calculateReputation({
        rating,
        reviewsCount: stats.reviewsCount ?? 0,
        eventsHosted,
        eventsAttended,
        isBanned: moderation.isBanned ?? false,
        isSuspended: moderation.isSuspended ?? false,
      });
      const status = u.isDeleted
        ? "Inactive"
        : moderation.isBanned
        ? "Banned"
        : moderation.isSuspended
        ? "Suspended"
        : "Active";
      const name =
        `${profile.firstName || ""} ${profile.lastName || ""}`.trim() ||
        profile.username ||
        "User";
      const updatedAt = u.updatedAt || u.createdAt;
      const diff = Date.now() - (updatedAt ? new Date(updatedAt).getTime() : 0);
      const mins = Math.floor(diff / 60000),
        hours = Math.floor(diff / 3600000),
        days = Math.floor(diff / 86400000);
      const lastActive =
        mins < 60 ? `${mins}m ago` : hours < 24 ? `${hours}h ago` : `${days}d ago`;
      return {
        id: u._id?.toString(),
        clerkUserId: clerkId,
        name,
        username: profile.username
          ? `@${profile.username}`
          : `@user_${u._id?.toString().slice(-4)}`,
        joined: new Date(u.createdAt || Date.now()).toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
        location: profile.location || profile.city || "India",
        type: userType,
        activity,
        lastActive,
        reputation,
        status,
        image:
          profile.imageUrl ||
          profile.avatar ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff&size=128`,
        eventsHosted,
        eventsAttended,
        rating: stats.rating ?? 0,
        reviewsCount: stats.reviewsCount ?? 0,
        totalEarnings: stats.overallEarning ?? 0,
        isBanned: moderation.isBanned ?? false,
        isSuspended: moderation.isSuspended ?? false,
      };
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /users/:id
router.get("/:id", async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    let user = null;
    try {
      user = await db.collection("users").findOne({ _id: new ObjectId(id) });
    } catch (_) {}
    if (!user) user = await db.collection("users").findOne({ clerkUserId: id });
    if (!user) return res.status(404).json({ error: "User not found" });
    const stats =
      (await db.collection("user_stats").findOne({ clerkUserId: user.clerkUserId })) || {};
    const eventsCount = await db
      .collection("events")
      .countDocuments({ creatorClerkId: user.clerkUserId });
    const recentEvents = await db
      .collection("events")
      .find({ creatorClerkId: user.clerkUserId })
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();
    res.json({
      user,
      stats,
      eventsCount,
      recentEvents: recentEvents.map(normalizeEvent),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;