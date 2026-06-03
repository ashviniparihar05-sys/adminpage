// // backend/routes/services.routes.js
// // Service endpoints

// import express from "express";
// import { ObjectId } from "mongodb";
// import { getDB } from "../config/database.js";
// import { normalizeService } from "../models/service.normalizer.js";
// import { runAIAnalysis } from "../services/ai-analysis.service.js";
// import { VALID_STATUSES } from "../utils/constants.js";
// import { analyzeLimiter } from "../middleware/rateLimiter.js";
// const router = express.Router();

// // GET /services - List all services
// router.get("/", async (req, res) => {
//   try {
//     const db = getDB();
//     const raw = await db
//       .collection("services")
//       .find({})
//       .sort({ createdAt: -1 })
//       .limit(100)
//       .toArray();
//     res.json(raw.map(normalizeService));
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // GET /services/since
// router.get("/since", async (req, res) => {
//   try {
//     const db = getDB();
//     const { ts } = req.query;
//     const since = ts ? new Date(parseInt(ts)) : new Date(Date.now() - 60000);
//     const raw = await db
//       .collection("services")
//       .find({ createdAt: { $gt: since } })
//       .sort({ createdAt: -1 })
//       .limit(50)
//       .toArray();
//     res.json({ newCount: raw.length, services: raw.map(normalizeService) });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // GET /services/:id
// router.get("/:id", async (req, res) => {
//   try {
//     const db = getDB();
//     const { id } = req.params;
//     let doc = null;
//     try {
//       doc = await db.collection("services").findOne({ _id: new ObjectId(id) });
//     } catch (_) {}
//     if (!doc) doc = await db.collection("services").findOne({ id });
//     if (!doc) return res.status(404).json({ error: "Service not found" });
//     res.json(normalizeService(doc));
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // GET /services/:id/creator-email
// router.get("/:id/creator-email", async (req, res) => {
//   try {
//     const db = getDB();
//     const { id } = req.params;
//     let serviceDoc = null;
//     try {
//       serviceDoc = await db
//         .collection("services")
//         .findOne({ _id: new ObjectId(id) }, { projection: { creatorClerkId: 1, title: 1 } });
//     } catch (_) {}
//     if (!serviceDoc)
//       serviceDoc = await db
//         .collection("services")
//         .findOne({ id }, { projection: { creatorClerkId: 1, title: 1 } });
//     if (!serviceDoc) return res.status(404).json({ error: "Service not found" });
//     if (!serviceDoc.creatorClerkId)
//       return res.status(404).json({ error: "No creatorClerkId" });

//     const userDoc = await db.collection("users").findOne(
//       { clerkUserId: serviceDoc.creatorClerkId },
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
//       }`.trim() || "Provider";
//     res.json({
//       email,
//       name,
//       eventTitle: serviceDoc.title || "Your Service",
//       creatorClerkId: serviceDoc.creatorClerkId,
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // PATCH /services/:id/status
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
//         ? { isApproved: true, isActive: true, status: "active" }
//         : {}),
//       ...(status === "rejected"
//         ? { isApproved: false, isActive: false, status: "paused" }
//         : {}),
//     };

//     let result;
//     try {
//       result = await db
//         .collection("services")
//         .updateOne({ _id: new ObjectId(id) }, { $set: updateData });
//     } catch (_) {
//       result = await db.collection("services").updateOne({ id }, { $set: updateData });
//     }
//     if (result.matchedCount === 0)
//       return res.status(404).json({ error: "Service not found" });

//     if (status === "approved" || status === "rejected") {
//       try {
//         let serviceDoc = null;
//         try {
//           serviceDoc = await db
//             .collection("services")
//             .findOne({ _id: new ObjectId(id) }, { projection: { creatorClerkId: 1, title: 1 } });
//         } catch (_) {}
//         if (!serviceDoc)
//           serviceDoc = await db
//             .collection("services")
//             .findOne({ id }, { projection: { creatorClerkId: 1, title: 1 } });
//         if (serviceDoc?.creatorClerkId) {
//           await db.collection("notifications").insertOne({
//             recipientClerkId: serviceDoc.creatorClerkId,
//             type: status === "approved" ? "service_approved" : "service_rejected",
//             serviceId: id,
//             eventTitle: serviceDoc.title || "Your service",
//             message:
//               status === "approved"
//                 ? `Your service "${serviceDoc.title}" is approved and live on MyApp!`
//                 : `Your service "${serviceDoc.title}" was rejected.`,
//             moderatorNote: moderatorNote || null,
//             read: false,
//             createdAt: new Date(),
//           });
//         }
//       } catch (e) {
//         console.warn("⚠️ Service notification failed:", e.message);
//       }
//     }

//     console.log(`✅ Service ${id} → ${status} (manual)`);
//     res.json({ success: true, id, status });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // POST /analyze-service
// router.post("/analyze", analyzeLimiter, async (req, res) => {
//   try {
//     const db = getDB();
//     const { service, force } = req.body;
//     if (!service) return res.status(400).json({ error: "No service data provided" });

//     if (!force && service.id) {
//       let existingDoc = null;
//       try {
//         existingDoc = await db.collection("services").findOne({ _id: new ObjectId(service.id) });
//       } catch (_) {
//         existingDoc = await db.collection("services").findOne({ id: service.id });
//       }
//       if (existingDoc?.aiAnalysis?.riskScore !== undefined) {
//         console.log(`📦 SERVICE CACHE HIT: "${service.title}"`);
//         return res.json({ ...existingDoc.aiAnalysis, fromCache: true });
//       }
//     }

//     console.log(`🤖 Analyzing SERVICE (text + image): "${service.title}"`);
//     const result = await runAIAnalysis(service, "services");

//     if (service.id) {
//       try {
//         let sr;
//         try {
//           sr = await db
//             .collection("services")
//             .updateOne(
//               { _id: new ObjectId(service.id) },
//               { $set: { aiAnalysis: result, updatedAt: new Date() } }
//             );
//         } catch (_) {
//           sr = await db
//             .collection("services")
//             .updateOne(
//               { id: service.id },
//               { $set: { aiAnalysis: result, updatedAt: new Date() } }
//             );
//         }
//         if (sr.matchedCount > 0) console.log(`💾 Service AI cached: "${service.title}"`);
//       } catch (e) {
//         console.warn("⚠️ Cache save failed:", e.message);
//       }
//     }

//     res.json({ ...result, fromCache: false });
//   } catch (err) {
//     console.error("❌ /analyze-service error:", err.message);
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
// backend/routes/services.routes.js
// Service endpoints

import express from "express";
import { ObjectId } from "mongodb";
import { getDB } from "../config/database.js";
import { normalizeService } from "../models/service.normalizer.js";
import { runAIAnalysis } from "../services/ai-analysis.service.js";
import { VALID_STATUSES } from "../utils/constants.js";
import { analyzeLimiter } from "../middleware/rateLimiter.js";
const router = express.Router();

// GET /services - List all services
router.get("/", async (req, res) => {
  try {
    const db = getDB();
    const raw = await db
      .collection("services")
      .find({})
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray();
    res.json(raw.map(normalizeService));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /services/since
router.get("/since", async (req, res) => {
  try {
    const db = getDB();
    const { ts } = req.query;
    const since = ts ? new Date(parseInt(ts)) : new Date(Date.now() - 60000);
    const raw = await db
      .collection("services")
      .find({ createdAt: { $gt: since } })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();
    res.json({ newCount: raw.length, services: raw.map(normalizeService) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /services/:id
router.get("/:id", async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    let doc = null;
    try {
      doc = await db.collection("services").findOne({ _id: new ObjectId(id) });
    } catch (_) {}
    if (!doc) doc = await db.collection("services").findOne({ id });
    if (!doc) return res.status(404).json({ error: "Service not found" });
    res.json(normalizeService(doc));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /services/:id/creator-email
router.get("/:id/creator-email", async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    let serviceDoc = null;
    try {
      serviceDoc = await db
        .collection("services")
        .findOne({ _id: new ObjectId(id) }, { projection: { creatorClerkId: 1, title: 1 } });
    } catch (_) {}
    if (!serviceDoc)
      serviceDoc = await db
        .collection("services")
        .findOne({ id }, { projection: { creatorClerkId: 1, title: 1 } });
    if (!serviceDoc) return res.status(404).json({ error: "Service not found" });
    if (!serviceDoc.creatorClerkId)
      return res.status(404).json({ error: "No creatorClerkId" });

    const userDoc = await db.collection("users").findOne(
      { clerkUserId: serviceDoc.creatorClerkId },
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
      }`.trim() || "Provider";
    res.json({
      email,
      name,
      eventTitle: serviceDoc.title || "Your Service",
      creatorClerkId: serviceDoc.creatorClerkId,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /services/:id/status
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
        ? { isApproved: true, isActive: true, status: "active" }
        : {}),
      ...(status === "rejected"
        ? { isApproved: false, isActive: false, status: "paused" }
        : {}),
    };

    let result;
    try {
      result = await db
        .collection("services")
        .updateOne({ _id: new ObjectId(id) }, { $set: updateData });
    } catch (_) {
      result = await db.collection("services").updateOne({ id }, { $set: updateData });
    }
    if (result.matchedCount === 0)
      return res.status(404).json({ error: "Service not found" });

    if (status === "approved" || status === "rejected") {
      try {
        let serviceDoc = null;
        try {
          serviceDoc = await db
            .collection("services")
            .findOne({ _id: new ObjectId(id) }, { projection: { creatorClerkId: 1, title: 1 } });
        } catch (_) {}
        if (!serviceDoc)
          serviceDoc = await db
            .collection("services")
            .findOne({ id }, { projection: { creatorClerkId: 1, title: 1 } });
        if (serviceDoc?.creatorClerkId) {
          await db.collection("notifications").insertOne({
            recipientClerkId: serviceDoc.creatorClerkId,
            type: status === "approved" ? "service_approved" : "service_rejected",
            serviceId: id,
            eventTitle: serviceDoc.title || "Your service",
            message:
              status === "approved"
                ? `Your service "${serviceDoc.title}" is approved and live on MyApp!`
                : `Your service "${serviceDoc.title}" was rejected.`,
            moderatorNote: moderatorNote || null,
            read: false,
            createdAt: new Date(),
          });
        }
      } catch (e) {
        console.warn("⚠️ Service notification failed:", e.message);
      }
    }

    console.log(`✅ Service ${id} → ${status} (manual)`);
    res.json({ success: true, id, status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /analyze-service
router.post("/analyze", analyzeLimiter, async (req, res) => {
  try {
    const db = getDB();
    const { service, force } = req.body;
    if (!service) return res.status(400).json({ error: "No service data provided" });

    if (!force && service.id) {
      let existingDoc = null;
      try {
        existingDoc = await db.collection("services").findOne({ _id: new ObjectId(service.id) });
      } catch (_) {
        existingDoc = await db.collection("services").findOne({ id: service.id });
      }
      if (existingDoc?.aiAnalysis?.riskScore !== undefined) {
        console.log(`📦 SERVICE CACHE HIT: "${service.title}"`);
        return res.json({ ...existingDoc.aiAnalysis, fromCache: true });
      }
    }

    console.log(`🤖 Analyzing SERVICE (text + image): "${service.title}"`);
    const result = await runAIAnalysis(service, "services");

    if (service.id) {
      try {
        let sr;
        try {
          sr = await db
            .collection("services")
            .updateOne(
              { _id: new ObjectId(service.id) },
              { $set: { aiAnalysis: result, updatedAt: new Date() } }
            );
        } catch (_) {
          sr = await db
            .collection("services")
            .updateOne(
              { id: service.id },
              { $set: { aiAnalysis: result, updatedAt: new Date() } }
            );
        }
        if (sr.matchedCount > 0) console.log(`💾 Service AI cached: "${service.title}"`);
      } catch (e) {
        console.warn("⚠️ Cache save failed:", e.message);
      }
    }

    res.json({ ...result, fromCache: false });
  } catch (err) {
    console.error("❌ /analyze-service error:", err.message);
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