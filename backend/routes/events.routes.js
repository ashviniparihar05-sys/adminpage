// // backend/routes/events.routes.js
// // Event endpoints

// import express from "express";
// import { ObjectId } from "mongodb";
// import { getDB } from "../config/database.js";
// import { normalizeEvent } from "../models/event.normalizer.js";
// import { runAIAnalysis } from "../services/ai-analysis.service.js";
// import { VALID_STATUSES } from "../utils/constants.js";
// import { analyzeLimiter } from "../middleware/rateLimiter.js";

// const router = express.Router();

// // GET /events - List all events
// router.get("/", async (req, res) => {
//   try {
//     const db = getDB();
//     const raw = await db
//       .collection("events")
//       .find({})
//       .sort({ createdAt: -1 })
//       .limit(100)
//       .toArray();
//     res.json(raw.map(normalizeEvent));
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // GET /events/since - Auto-refresh polling
// router.get("/since", async (req, res) => {
//   try {
//     const db = getDB();
//     const { ts } = req.query;
//     const since = ts ? new Date(parseInt(ts)) : new Date(Date.now() - 60000);
//     const raw = await db
//       .collection("events")
//       .find({ createdAt: { $gt: since } })
//       .sort({ createdAt: -1 })
//       .limit(50)
//       .toArray();
//     res.json({ newCount: raw.length, events: raw.map(normalizeEvent) });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // GET /events/:id - Get single event
// router.get("/:id", async (req, res) => {
//   try {
//     const db = getDB();
//     const { id } = req.params;
//     let doc = null;
//     try {
//       doc = await db.collection("events").findOne({ _id: new ObjectId(id) });
//     } catch (_) {}
//     if (!doc) doc = await db.collection("events").findOne({ id });
//     if (!doc) return res.status(404).json({ error: "Event not found" });
//     res.json(normalizeEvent(doc));
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // GET /events/:id/creator-email - Get creator email
// router.get("/:id/creator-email", async (req, res) => {
//   try {
//     const db = getDB();
//     const { id } = req.params;
//     let eventDoc = null;
//     try {
//       eventDoc = await db
//         .collection("events")
//         .findOne({ _id: new ObjectId(id) }, { projection: { creatorClerkId: 1, title: 1 } });
//     } catch (_) {}
//     if (!eventDoc)
//       eventDoc = await db
//         .collection("events")
//         .findOne({ id }, { projection: { creatorClerkId: 1, title: 1 } });
//     if (!eventDoc) return res.status(404).json({ error: "Event not found" });
//     if (!eventDoc.creatorClerkId)
//       return res.status(404).json({ error: "No creatorClerkId" });

//     const userDoc = await db.collection("users").findOne(
//       { clerkUserId: eventDoc.creatorClerkId },
//       {
//         projection: {
//           "clerk.email": 1,
//           "profile.email": 1,
//           "profile.firstName": 1,
//           "profile.lastName": 1,
//           "clerk.firstName": 1,
//           "clerk.lastName": 1,
//         },
//       }
//     );
//     if (!userDoc) return res.status(404).json({ error: "User not found" });
//     const email = userDoc.clerk?.email || userDoc.profile?.email || null;
//     if (!email) return res.status(404).json({ error: "No email found" });
//     const name =
//       `${userDoc.clerk?.firstName || userDoc.profile?.firstName || ""} ${
//         userDoc.clerk?.lastName || userDoc.profile?.lastName || ""
//       }`.trim() || "Organizer";
//     res.json({
//       email,
//       name,
//       eventTitle: eventDoc.title || "Your Event",
//       creatorClerkId: eventDoc.creatorClerkId,
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // PATCH /events/:id/status - Update event status
// router.patch("/:id/status", async (req, res) => {
//   try {
//     const db = getDB();
//     const { id } = req.params;
//     const { status, moderatorNote } = req.body;

//     if (!VALID_STATUSES.includes(status))
//       return res.status(400).json({ error: "Invalid status" });

//     const updateData = {
//       admin_status: status,
//       moderationStatus: status,
//       updatedAt: new Date(),
//       ...(moderatorNote ? { moderatorNote } : {}),
//       ...(status === "approved"
//         ? { isApproved: true, isActive: true, isListed: true }
//         : {}),
//       ...(status === "rejected"
//         ? { isApproved: false, isActive: false, isListed: false }
//         : {}),
//     };

//     let result;
//     try {
//       result = await db
//         .collection("events")
//         .updateOne({ _id: new ObjectId(id) }, { $set: updateData });
//     } catch (_) {
//       result = await db.collection("events").updateOne({ id }, { $set: updateData });
//     }
//     if (result.matchedCount === 0)
//       return res.status(404).json({ error: "Event not found" });

//     // Send notification
//     if (status === "approved" || status === "rejected") {
//       try {
//         let eventDoc = null;
//         try {
//           eventDoc = await db
//             .collection("events")
//             .findOne({ _id: new ObjectId(id) }, { projection: { creatorClerkId: 1, title: 1 } });
//         } catch (_) {}
//         if (!eventDoc)
//           eventDoc = await db
//             .collection("events")
//             .findOne({ id }, { projection: { creatorClerkId: 1, title: 1 } });

//         if (eventDoc?.creatorClerkId) {
//           let fullEventDoc = null;
//           try {
//             fullEventDoc = await db.collection("events").findOne(
//               { _id: new ObjectId(id) },
//               { projection: { aiAnalysis: 1, title: 1, creatorClerkId: 1 } }
//             );
//           } catch (_) {}

//           const aiAnalysis = fullEventDoc?.aiAnalysis || null;
//           const riskScore = aiAnalysis?.riskScore ?? null;
//           const flags = aiAnalysis?.flags || [];

//           const suggestions = [];
//           if (aiAnalysis?.imageAnalysis) {
//             if (aiAnalysis.imageAnalysis.isPlaceholder) {
//               suggestions.push("📸 Replace placeholder image with original photo.");
//             }
//             if (aiAnalysis.imageAnalysis.checked && !aiAnalysis.imageAnalysis.isRelevant) {
//               suggestions.push(
//                 `🖼️ Image doesn't match event — ${
//                   aiAnalysis.imageAnalysis.relevanceNote || "upload relevant photo."
//                 }`
//               );
//             }
//           }
//           for (const flag of flags) {
//             if (flag.severity === "low" || flag.severity === "medium") {
//               suggestions.push(`• ${flag.type}: ${flag.description}`);
//             }
//           }
//           const improvementNote =
//             suggestions.length > 0 ? suggestions.join("\n") : moderatorNote || null;

//           const approvalStatus =
//             riskScore !== null && riskScore > 30 && status === "approved"
//               ? "approved_with_warnings"
//               : status === "approved"
//               ? "approved"
//               : "rejected";

//           const warningFlags = flags.filter((f) => f.severity !== "high");

//           await db.collection("notifications").insertOne({
//             recipientClerkId: eventDoc.creatorClerkId,
//             type: status === "approved" ? "event_approved" : "event_rejected",
//             eventId: id,
//             eventTitle: eventDoc.title || "Your event",
//             message:
//               status === "approved"
//                 ? `Your event "${eventDoc.title}" is approved and live on MyApp!`
//                 : `Your event "${eventDoc.title}" was rejected.`,
//             moderatorNote: improvementNote,
//             flags: approvalStatus === "approved_with_warnings" ? warningFlags : flags,
//             approvalStatus,
//             riskScore,
//             read: false,
//             createdAt: new Date(),
//             sentByBot: false,
//           });
//         }
//       } catch (e) {
//         console.warn("⚠️ Notification failed:", e.message);
//       }
//     }

//     console.log(`✅ Event ${id} → ${status} (manual)`);
//     res.json({ success: true, id, status });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // POST /analyze - Manual event analysis
// router.post("/analyze", analyzeLimiter, async (req, res) => {
//   try {
//         const db = getDB();
//     const { event, force } = req.body;
//     if (!event) return res.status(400).json({ error: "No event data provided" });

//     // Cache check
//     if (!force && event.id) {
//       let existingDoc = null;
//       try {
//         existingDoc = await db.collection("events").findOne({ _id: new ObjectId(event.id) });
//       } catch (_) {
//         existingDoc = await db.collection("events").findOne({ id: event.id });
//       }
//       if (existingDoc?.aiAnalysis?.riskScore !== undefined) {
//         console.log(`📦 EVENT CACHE HIT: "${event.title}"`);
//         return res.json({ ...existingDoc.aiAnalysis, fromCache: true });
//       }
//     }

//     console.log(`🤖 Analyzing EVENT (text + image): "${event.title}"`);
//     const result = await runAIAnalysis(event, "events");

//     // Save to cache
//     if (event.id) {
//       try {
//         let sr;
//         try {
//           sr = await db
//             .collection("events")
//             .updateOne(
//               { _id: new ObjectId(event.id) },
//               { $set: { aiAnalysis: result, updatedAt: new Date() } }
//             );
//         } catch (_) {
//           sr = await db
//             .collection("events")
//             .updateOne({ id: event.id }, { $set: { aiAnalysis: result, updatedAt: new Date() } });
//         }
//         if (sr.matchedCount > 0) console.log(`💾 Event AI cached: "${event.title}"`);
//       } catch (e) {
//         console.warn("⚠️ Cache save failed:", e.message);
//       }
//     }

//     res.json({ ...result, fromCache: false });
//   } catch (err) {
//     console.error("❌ /analyze error:", err.message);
//     res.status(500).json({
//       riskScore: 0,
//       riskLevel: "low",
//       semanticIntegrity: 100,
//       hostLegitimacy: 100,
//       engagementPattern: 100,
//       flags: [],
//       summary: "AI analysis failed.",
//       recommendation: "Review manually.",
//       fromCache: false,
//     });
//   }
// });

// export default router;
// backend/routes/events.routes.js
// Event endpoints

import express from "express";
import { ObjectId } from "mongodb";
import { getDB } from "../config/database.js";
import { normalizeEvent } from "../models/event.normalizer.js";
import { runAIAnalysis } from "../services/ai-analysis.service.js";
import { VALID_STATUSES } from "../utils/constants.js";
import { analyzeLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// GET /events - List all events
router.get("/", async (req, res) => {
  try {
    const db = getDB();
    const raw = await db
      .collection("events")
      .find({})
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray();
    res.json(raw.map(normalizeEvent));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /events/since - Auto-refresh polling
router.get("/since", async (req, res) => {
  try {
    const db = getDB();
    const { ts } = req.query;
    const since = ts ? new Date(parseInt(ts)) : new Date(Date.now() - 60000);
    const raw = await db
      .collection("events")
      .find({ createdAt: { $gt: since } })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();
    res.json({ newCount: raw.length, events: raw.map(normalizeEvent) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /events/:id - Get single event
router.get("/:id", async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    let doc = null;
    try {
      doc = await db.collection("events").findOne({ _id: new ObjectId(id) });
    } catch (_) {}
    if (!doc) doc = await db.collection("events").findOne({ id });
    if (!doc) return res.status(404).json({ error: "Event not found" });
    res.json(normalizeEvent(doc));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /events/:id/creator-email - Get creator email
router.get("/:id/creator-email", async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    let eventDoc = null;
    try {
      eventDoc = await db
        .collection("events")
        .findOne({ _id: new ObjectId(id) }, { projection: { creatorClerkId: 1, title: 1 } });
    } catch (_) {}
    if (!eventDoc)
      eventDoc = await db
        .collection("events")
        .findOne({ id }, { projection: { creatorClerkId: 1, title: 1 } });
    if (!eventDoc) return res.status(404).json({ error: "Event not found" });
    if (!eventDoc.creatorClerkId)
      return res.status(404).json({ error: "No creatorClerkId" });

    const userDoc = await db.collection("users").findOne(
      { clerkUserId: eventDoc.creatorClerkId },
      {
        projection: {
          "clerk.email": 1,
          "profile.email": 1,
          "profile.firstName": 1,
          "profile.lastName": 1,
          "clerk.firstName": 1,
          "clerk.lastName": 1,
        },
      }
    );
    if (!userDoc) return res.status(404).json({ error: "User not found" });
    const email = userDoc.clerk?.email || userDoc.profile?.email || null;
    if (!email) return res.status(404).json({ error: "No email found" });
    const name =
      `${userDoc.clerk?.firstName || userDoc.profile?.firstName || ""} ${
        userDoc.clerk?.lastName || userDoc.profile?.lastName || ""
      }`.trim() || "Organizer";
    res.json({
      email,
      name,
      eventTitle: eventDoc.title || "Your Event",
      creatorClerkId: eventDoc.creatorClerkId,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /events/:id/status - Update event status
router.patch("/:id/status", async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    const { status, moderatorNote } = req.body;

    if (!VALID_STATUSES.includes(status))
      return res.status(400).json({ error: "Invalid status" });

    const updateData = {
      admin_status: status,
      moderationStatus: status,
      updatedAt: new Date(),
      ...(moderatorNote ? { moderatorNote } : {}),
      ...(status === "approved"
        ? { isApproved: true, isActive: true, isListed: true }
        : {}),
      ...(status === "rejected"
        ? { isApproved: false, isActive: false, isListed: false }
        : {}),
    };

    let result;
    try {
      result = await db
        .collection("events")
        .updateOne({ _id: new ObjectId(id) }, { $set: updateData });
    } catch (_) {
      result = await db.collection("events").updateOne({ id }, { $set: updateData });
    }
    if (result.matchedCount === 0)
      return res.status(404).json({ error: "Event not found" });

    // Send notification
    if (status === "approved" || status === "rejected") {
      try {
        let eventDoc = null;
        try {
          eventDoc = await db
            .collection("events")
            .findOne({ _id: new ObjectId(id) }, { projection: { creatorClerkId: 1, title: 1 } });
        } catch (_) {}
        if (!eventDoc)
          eventDoc = await db
            .collection("events")
            .findOne({ id }, { projection: { creatorClerkId: 1, title: 1 } });

        if (eventDoc?.creatorClerkId) {
          let fullEventDoc = null;
          try {
            fullEventDoc = await db.collection("events").findOne(
              { _id: new ObjectId(id) },
              { projection: { aiAnalysis: 1, title: 1, creatorClerkId: 1 } }
            );
          } catch (_) {}

          const aiAnalysis = fullEventDoc?.aiAnalysis || null;
          const riskScore = aiAnalysis?.riskScore ?? null;
          const flags = aiAnalysis?.flags || [];

          const suggestions = [];
          if (aiAnalysis?.imageAnalysis) {
            if (aiAnalysis.imageAnalysis.isPlaceholder) {
              suggestions.push("📸 Replace placeholder image with original photo.");
            }
            if (aiAnalysis.imageAnalysis.checked && !aiAnalysis.imageAnalysis.isRelevant) {
              suggestions.push(
                `🖼️ Image doesn't match event — ${
                  aiAnalysis.imageAnalysis.relevanceNote || "upload relevant photo."
                }`
              );
            }
          }
          for (const flag of flags) {
            if (flag.severity === "low" || flag.severity === "medium") {
              suggestions.push(`• ${flag.type}: ${flag.description}`);
            }
          }
          const improvementNote =
            suggestions.length > 0 ? suggestions.join("\n") : moderatorNote || null;

          const approvalStatus =
            riskScore !== null && riskScore > 30 && status === "approved"
              ? "approved_with_warnings"
              : status === "approved"
              ? "approved"
              : "rejected";

          const warningFlags = flags.filter((f) => f.severity !== "high");

          await db.collection("notifications").insertOne({
            recipientClerkId: eventDoc.creatorClerkId,
            type: status === "approved" ? "event_approved" : "event_rejected",
            eventId: id,
            eventTitle: eventDoc.title || "Your event",
            message:
              status === "approved"
                ? `Your event "${eventDoc.title}" is approved and live on MyApp!`
                : `Your event "${eventDoc.title}" was rejected.`,
            moderatorNote: improvementNote,
            flags: approvalStatus === "approved_with_warnings" ? warningFlags : flags,
            approvalStatus,
            riskScore,
            read: false,
            createdAt: new Date(),
            sentByBot: false,
          });
        }
      } catch (e) {
        console.warn("⚠️ Notification failed:", e.message);
      }
    }

    console.log(`✅ Event ${id} → ${status} (manual)`);
    res.json({ success: true, id, status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /analyze - Manual event analysis
router.post("/analyze", analyzeLimiter, async (req, res) => {
  try {
        const db = getDB();
    const { event, force } = req.body;
    if (!event) return res.status(400).json({ error: "No event data provided" });

    // Cache check
    if (!force && event.id) {
      let existingDoc = null;
      try {
        existingDoc = await db.collection("events").findOne({ _id: new ObjectId(event.id) });
      } catch (_) {
        existingDoc = await db.collection("events").findOne({ id: event.id });
      }
      if (existingDoc?.aiAnalysis?.riskScore !== undefined) {
        console.log(`📦 EVENT CACHE HIT: "${event.title}"`);
        return res.json({ ...existingDoc.aiAnalysis, fromCache: true });
      }
    }

    console.log(`🤖 Analyzing EVENT (text + image): "${event.title}"`);
    const result = await runAIAnalysis(event, "events");

    // Save to cache
    if (event.id) {
      try {
        let sr;
        try {
          sr = await db
            .collection("events")
            .updateOne(
              { _id: new ObjectId(event.id) },
              { $set: { aiAnalysis: result, updatedAt: new Date() } }
            );
        } catch (_) {
          sr = await db
            .collection("events")
            .updateOne({ id: event.id }, { $set: { aiAnalysis: result, updatedAt: new Date() } });
        }
        if (sr.matchedCount > 0) console.log(`💾 Event AI cached: "${event.title}"`);
      } catch (e) {
        console.warn("⚠️ Cache save failed:", e.message);
      }
    }

    res.json({ ...result, fromCache: false });
  } catch (err) {
    console.error("❌ /analyze error:", err.message);
    res.status(500).json({
      riskScore: 0,
      riskLevel: "low",
      semanticIntegrity: 100,
      hostLegitimacy: 100,
      engagementPattern: 100,
      flags: [],
      summary: "AI analysis failed.",
      recommendation: "Review manually.",
      fromCache: false,
    });
  }
});

export default router;