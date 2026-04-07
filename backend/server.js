// // backend/server.js
// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import OpenAI from "openai";

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// app.post("/analyze", async (req, res) => {
//   try {
//     const { event } = req.body;
//     if (!event) {
//       return res.status(400).json({ error: "No event data provided" });
//     }

//     const prompt = `You are a strict AI moderation system for an event platform. Your job is to detect fraud, scams, and risky events.

// SCORING RULES — follow these STRICTLY:

// HIGH RISK (riskScore 70-100, riskLevel "high" or "critical"):
// - Suspicious or vague title/description (e.g. "quick money", "exclusive invite only", no real details)
// - Unusually high ticket price (above ₹5000 or $100) with no credible host
// - Payment requested in crypto, gift cards, or unusual methods
// - No verifiable location (just says "DM for location", "secret venue")
// - Host is unverified AND has no web presence
// - Offers that seem too good to be true
// - Events involving gambling, adult content hints, MLM/pyramid schemes
// - Extremely short or copy-pasted description

// MEDIUM RISK (riskScore 40-69, riskLevel "medium"):
// - Unverified host but reasonable description
// - Ticket price between ₹1000-₹5000 with some details missing
// - Location mentioned but vague (city only, no venue)
// - Description lacks specifics but not suspicious
// - New host with no history

// LOW RISK (riskScore 0-39, riskLevel "low"):
// - Clear, detailed description with specific venue
// - Reasonable ticket price (under ₹1000 or free)
// - Verified host OR well-known organization
// - Known venue/location
// - Event matches category well
// - Professional tone and complete information

// EVENT TO ANALYZE:
// Title: ${event.title || "N/A"}
// Host: ${event.host || "N/A"}
// Host Verified: ${event.hostVerified ? "Yes" : "No"}
// Category: ${event.category || "N/A"}
// Description: ${event.description || "N/A"}
// Price: ${event.ticketPrice || "N/A"}
// Location: ${event.location || "N/A"}
// Capacity: ${event.capacity || "N/A"}

// IMPORTANT:
// - Be specific and vary your scores based on actual content
// - Do NOT default to medium — evaluate properly
// - flags array should be EMPTY [] if event is clean/low risk
// - Return ONLY valid JSON, no extra text

// {
//   "riskScore": <number 0-100, be precise based on rules above>,
//   "riskLevel": "<low|medium|high|critical>",
//   "semanticIntegrity": <number 0-100, how coherent/professional is the description>,
//   "hostLegitimacy": <number 0-100, higher if verified or well-known>,
//   "engagementPattern": <number 0-100, how trustworthy the event structure looks>,
//   "flags": [{"type": "<short flag name>", "description": "<specific reason from THIS event>", "severity": "<low|medium|high>"}],
//   "summary": "<2-3 sentences specific to THIS event, mention actual details from it>",
//   "recommendation": "<one specific actionable sentence for the moderator>"
// }`;

//     const response = await openai.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages: [
//         {
//           role: "system",
//           content: "You are a fraud detection AI. Always return valid JSON only. Never return the same score for different events — evaluate each event uniquely based on its actual content.",
//         },
//         { role: "user", content: prompt },
//       ],
//       temperature: 0.7,  // Higher = more variation between events
//       response_format: { type: "json_object" }, // ✅ Forces JSON output, no markdown wrapping
//     });

//     const text = response.choices[0].message.content || "{}";
//     const parsed = JSON.parse(text);

//     // Validate and sanitize
//     res.json({
//       riskScore: Math.min(100, Math.max(0, parsed.riskScore ?? 50)),
//       riskLevel: parsed.riskLevel ?? "medium",
//       semanticIntegrity: Math.min(100, Math.max(0, parsed.semanticIntegrity ?? 80)),
//       hostLegitimacy: Math.min(100, Math.max(0, parsed.hostLegitimacy ?? 80)),
//       engagementPattern: Math.min(100, Math.max(0, parsed.engagementPattern ?? 80)),
//       flags: Array.isArray(parsed.flags) ? parsed.flags : [],
//       summary: parsed.summary ?? "No summary available.",
//       recommendation: parsed.recommendation ?? "Manual review recommended.",
//     });
// // server.js mein, parsed ke baad add karo:
// console.log("EVENT RECEIVED:", event.title);
// console.log("AI RESPONSE:", text);
// console.log("PARSED:", parsed);
//   } catch (err) {
//     console.error("OpenAI Error:", err);
//     res.status(500).json({
//       riskScore: 0,
//       riskLevel: "low",
//       semanticIntegrity: 100,
//       hostLegitimacy: 100,
//       engagementPattern: 100,
//       flags: [],
//       summary: "AI analysis failed — manual review required.",
//       recommendation: "Please review this event manually.",
//     });
//   }
// });

// app.listen(5000, () => {
//   console.log("✅ Server running on http://localhost:5000");
// });
// backend/server.js
// ✅ MyApp ke MongoDB se events fetch karta hai
// ✅ Admin dashboard se approve/reject status update karta hai
// ✅ OpenAI se AI analysis karta hai
//C:\Users\91934\Downloads\My-app-admin-dashboard-22\backend\server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import { MongoClient, ObjectId } from "mongodb";
import dns from "dns";
dns.setDefaultResultOrder("ipv4first");
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ─── MongoDB Connection ────────────────────────────────────────────────────────
let db;
let client;

// async function connectDB() {
//   try {
//    client = new MongoClient(process.env.MONGODB_URI, {
//   family: 4, // 🔥 FORCE IPv4 (MOST IMPORTANT)
// });
//     await client.connect();
//     db = client.db(); // assis_auth database (from URI)
//     console.log("✅ Connected to MyApp MongoDB:", db.databaseName);

//     // Check what collections exist
//     const collections = await db.listCollections().toArray();
//     console.log("📦 Collections found:", collections.map(c => c.name));
//   } catch (err) {
//     console.error("❌ MongoDB connection failed:", err.message);
//     process.exit(1);
//   }
// }
async function connectDB() {
  try {
    // Google DNS force
    const dns = await import('dns/promises');
    dns.setServers(['8.8.8.8', '1.1.1.1']);
    
    client = new MongoClient(process.env.MONGODB_URI, {
      family: 4,                    // IPv4 only
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 2,
      tls: true,
      retryWrites: true
      // dnsSeedlist HATAYA - not needed for latest driver
    });
    
    await client.connect();
    db = client.db('assis_auth');
    console.log("✅ CONNECTED:", db.databaseName);
    
    const collections = await db.listCollections().toArray();
    console.log("📦 Collections:", collections.map(c => c.name));
    
  } catch (err) {
    console.error("❌ FAILED:", err.message);
    process.exit(1);
  }
}
function normalizeEvent(doc) {
  // LOCATION OBJECT FIX 🔥
  let locationStr = "Location TBD";
  if (doc.location) {
    if (typeof doc.location === 'object' && doc.location.formattedAddress) {
      locationStr = doc.location.formattedAddress;
    } else if (typeof doc.location === 'object') {
      locationStr = doc.location.city || doc.location.address || 
                   `${doc.location.lat || ''}, ${doc.location.lng || ''}`;
    } else {
      locationStr = doc.location;
    }
  }

  return {
    id: doc._id?.toString() || doc.id || `EV-${Date.now()}`,
    title: doc.title || doc.eventTitle || doc.name || "Untitled Event",
    host: doc.host || doc.organizer || doc.organizerName || doc.createdBy || doc.userId || "Unknown Host",
    hostVerified: doc.hostVerified || doc.isVerified || false,
    image: doc.image || doc.banner || doc.thumbnail || doc.imageUrl ||
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600",
    category: doc.category || doc.eventCategory || doc.type || "Other",
    dateSubmitted: doc.createdAt || doc.dateSubmitted || doc.submittedAt || new Date().toISOString(),
    eventDate: doc.eventDate || doc.date || doc.startDate || doc.scheduledDate || "",
    location: locationStr,  // ✅ STRING ONLY
    ticketPrice: doc.ticketPrice || doc.price || doc.cost ||
      (doc.isFree ? "Free" : doc.amount ? `₹${doc.amount}` : "Free"),
    capacity: doc.capacity || doc.maxCapacity || doc.totalSeats || 100,
    description: doc.description || doc.about || doc.details || "No description provided.",
    status: doc.admin_status || doc.moderationStatus || doc.status || "pending",
  };
}

// ─── GET /events — fetch all events from MyApp MongoDB ────────────────────────
app.get("/events", async (req, res) => {
  try {
    if (!db) return res.status(500).json({ error: "DB not connected" });

    // Try common collection names for events in MyApp
    const possibleCollections = ["events", "event", "posts", "listings", "activities"];
    let eventsCollection = null;
    let rawEvents = [];

    for (const name of possibleCollections) {
      const coll = db.collection(name);
      const count = await coll.countDocuments();
      if (count > 0) {
        eventsCollection = name;
        rawEvents = await coll.find({}).sort({ createdAt: -1 }).limit(100).toArray();
        console.log(`✅ Found ${count} events in collection: ${name}`);
        break;
      }
    }

    if (rawEvents.length === 0) {
      console.log("⚠️ No events found in any collection. Returning empty array.");
      return res.json([]);
    }

    const normalized = rawEvents.map(normalizeEvent);
    res.json(normalized);

  } catch (err) {
    console.error("GET /events error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── GET /events/:id — single event ───────────────────────────────────────────
app.get("/events/:id", async (req, res) => {
  try {
    if (!db) return res.status(500).json({ error: "DB not connected" });

    const { id } = req.params;
    const possibleCollections = ["events", "event", "posts", "listings", "activities"];

    for (const name of possibleCollections) {
      const coll = db.collection(name);
      let doc = null;

      // Try ObjectId first, then string id
      try {
        doc = await coll.findOne({ _id: new ObjectId(id) });
      } catch (_) {
        doc = await coll.findOne({ id });
      }

      if (doc) {
        return res.json(normalizeEvent(doc));
      }
    }

    res.status(404).json({ error: "Event not found" });
  } catch (err) {
    console.error("GET /events/:id error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── PATCH /events/:id/status — approve or reject ─────────────────────────────
// This updates admin_status in MyApp's MongoDB
// When approved → event becomes visible on MyApp
app.patch("/events/:id/status", async (req, res) => {
  try {
    if (!db) return res.status(500).json({ error: "DB not connected" });

    const { id } = req.params;
    const { status, moderatorNote } = req.body; // status: 'approved' | 'rejected' | 'pending' | 'flagged'

    const validStatuses = ["approved", "rejected", "pending", "flagged", "under_review"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` });
    }

    const updateData = {
      admin_status: status,
      moderationStatus: status,
      updatedAt: new Date(),
      ...(moderatorNote ? { moderatorNote } : {}),
      // If approved, set isApproved flag too (in case MyApp checks this)
      ...(status === "approved" ? { isApproved: true, isActive: true, isListed: true } : {}),
      ...(status === "rejected" ? { isApproved: false, isActive: false, isListed: false } : {}),
    };

    const possibleCollections = ["events", "event", "posts", "listings", "activities"];
    let updated = false;

    for (const name of possibleCollections) {
      const coll = db.collection(name);
      let result;

      try {
        result = await coll.updateOne(
          { _id: new ObjectId(id) },
          { $set: updateData }
        );
      } catch (_) {
        result = await coll.updateOne({ id }, { $set: updateData });
      }

      if (result.matchedCount > 0) {
        updated = true;
        console.log(`✅ Status updated: ${id} → ${status} (collection: ${name})`);
        break;
      }
    }

    if (!updated) {
      return res.status(404).json({ error: "Event not found in any collection" });
    }

    res.json({ success: true, id, status, message: `Event ${status} successfully` });

  } catch (err) {
    console.error("PATCH /events/:id/status error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── POST /analyze — AI analysis via OpenAI ───────────────────────────────────
app.post("/analyze", async (req, res) => {
  try {
    const { event } = req.body;
    if (!event) return res.status(400).json({ error: "No event data provided" });

    console.log("🤖 Analyzing event:", event.title);

    const prompt = `You are a strict AI moderation system for an event platform. Analyze this event and detect fraud, scams, or risky content.

SCORING RULES:
- HIGH RISK (70-100): Vague details, suspicious payment, hidden location, unrealistic claims, drug references
- MEDIUM RISK (40-69): Unverified host, missing details, high price with few details  
- LOW RISK (0-39): Clear description, reasonable price, known venue, professional tone

EVENT:
Title: ${event.title || "N/A"}
Host: ${event.host || "N/A"}
Host Verified: ${event.hostVerified ? "Yes" : "No"}
Category: ${event.category || "N/A"}
Description: ${event.description || "N/A"}
Price: ${event.ticketPrice || "N/A"}
Location: ${event.location || "N/A"}
Capacity: ${event.capacity || "N/A"}

Return ONLY valid JSON:
{
  "riskScore": <0-100>,
  "riskLevel": "<low|medium|high|critical>",
  "semanticIntegrity": <0-100>,
  "hostLegitimacy": <0-100>,
  "engagementPattern": <0-100>,
  "flags": [{"type": "<name>", "description": "<specific reason>", "severity": "<low|medium|high>"}],
  "summary": "<2-3 sentences about THIS event>",
  "recommendation": "<one actionable sentence>"
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a fraud detection AI. Return valid JSON only. Vary scores based on actual event content." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const parsed = JSON.parse(response.choices[0].message.content || "{}");
    console.log("✅ AI Result:", parsed.riskScore, parsed.riskLevel);

    res.json({
      riskScore: Math.min(100, Math.max(0, parsed.riskScore ?? 50)),
      riskLevel: parsed.riskLevel ?? "medium",
      semanticIntegrity: Math.min(100, Math.max(0, parsed.semanticIntegrity ?? 80)),
      hostLegitimacy: Math.min(100, Math.max(0, parsed.hostLegitimacy ?? 80)),
      engagementPattern: Math.min(100, Math.max(0, parsed.engagementPattern ?? 80)),
      flags: Array.isArray(parsed.flags) ? parsed.flags : [],
      summary: parsed.summary ?? "Analysis complete.",
      recommendation: parsed.recommendation ?? "Manual review recommended.",
    });

  } catch (err) {
    console.error("❌ OpenAI Error:", err.message);
    res.status(500).json({
      riskScore: 0, riskLevel: "low",
      semanticIntegrity: 100, hostLegitimacy: 100, engagementPattern: 100,
      flags: [],
      summary: "AI analysis failed — manual review required.",
      recommendation: "Please review this event manually.",
    });
  }
});

// ─── GET /collections — debug: see what's in MongoDB ─────────────────────────
app.get("/collections", async (req, res) => {
  try {
    if (!db) return res.status(500).json({ error: "DB not connected" });
    const collections = await db.listCollections().toArray();
    const info = {};
    for (const c of collections) {
      const count = await db.collection(c.name).countDocuments();
      const sample = await db.collection(c.name).findOne({});
      info[c.name] = { count, sampleKeys: sample ? Object.keys(sample) : [] };
    }
    res.json(info);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ─── GET /users ─────────────────────────────
const users = data.map(u => ({
  id: u._id?.toString(),

  name:
    u.profile?.firstName && u.profile?.lastName
      ? `${u.profile.firstName} ${u.profile.lastName}`
      : u.profile?.firstName || "User",

  username: u.profile?.username
    ? `@${u.profile.username}`
    : "@user",

  joined: new Date(u.createdAt || Date.now()).getFullYear(),

  location: u.profile?.location || "India",

  type: u.role || "User",

  activity: `${Math.floor(Math.random() * 5)} Events`,

  lastActive: "Recently",

  reputation: Math.floor(Math.random() * 100),

  status: u.isDeleted ? "Inactive" : "Active",

  image:
    u.profile?.imageUrl ||
    `https://ui-avatars.com/api/?name=${u.profile?.firstName || "User"}`
}));




// ─── Health check ──────────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({ status: "ok", db: db ? "connected" : "disconnected", time: new Date().toISOString() });
});

// ─── Start ─────────────────────────────────────────────────────────────────────
connectDB().then(() => {
  app.listen(5006, () => {
    console.log("✅ Admin Dashboard Backend running on http://localhost:5006");
    console.log("📡 Endpoints:");
    console.log("   GET  /health");
    console.log("   GET  /collections  ← debug: see MongoDB collections");
    console.log("   GET  /events       ← fetch all MyApp events");
    console.log("   GET  /events/:id   ← single event");
    console.log("   PATCH /events/:id/status  ← approve/reject");
    console.log("   POST /analyze      ← AI analysis");
  });
});