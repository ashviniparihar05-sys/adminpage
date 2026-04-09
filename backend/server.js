// // // // backend/server.js
// // // import express from "express";
// // // import cors from "cors";
// // // import dotenv from "dotenv";
// // // import OpenAI from "openai";

// // // dotenv.config();

// // // const app = express();
// // // app.use(cors());
// // // app.use(express.json());

// // // const openai = new OpenAI({
// // //   apiKey: process.env.OPENAI_API_KEY,
// // // });

// // // app.post("/analyze", async (req, res) => {
// // //   try {
// // //     const { event } = req.body;
// // //     if (!event) {
// // //       return res.status(400).json({ error: "No event data provided" });
// // //     }

// // //     const prompt = `You are a strict AI moderation system for an event platform. Your job is to detect fraud, scams, and risky events.

// // // SCORING RULES — follow these STRICTLY:

// // // HIGH RISK (riskScore 70-100, riskLevel "high" or "critical"):
// // // - Suspicious or vague title/description (e.g. "quick money", "exclusive invite only", no real details)
// // // - Unusually high ticket price (above ₹5000 or $100) with no credible host
// // // - Payment requested in crypto, gift cards, or unusual methods
// // // - No verifiable location (just says "DM for location", "secret venue")
// // // - Host is unverified AND has no web presence
// // // - Offers that seem too good to be true
// // // - Events involving gambling, adult content hints, MLM/pyramid schemes
// // // - Extremely short or copy-pasted description

// // // MEDIUM RISK (riskScore 40-69, riskLevel "medium"):
// // // - Unverified host but reasonable description
// // // - Ticket price between ₹1000-₹5000 with some details missing
// // // - Location mentioned but vague (city only, no venue)
// // // - Description lacks specifics but not suspicious
// // // - New host with no history

// // // LOW RISK (riskScore 0-39, riskLevel "low"):
// // // - Clear, detailed description with specific venue
// // // - Reasonable ticket price (under ₹1000 or free)
// // // - Verified host OR well-known organization
// // // - Known venue/location
// // // - Event matches category well
// // // - Professional tone and complete information

// // // EVENT TO ANALYZE:
// // // Title: ${event.title || "N/A"}
// // // Host: ${event.host || "N/A"}
// // // Host Verified: ${event.hostVerified ? "Yes" : "No"}
// // // Category: ${event.category || "N/A"}
// // // Description: ${event.description || "N/A"}
// // // Price: ${event.ticketPrice || "N/A"}
// // // Location: ${event.location || "N/A"}
// // // Capacity: ${event.capacity || "N/A"}

// // // IMPORTANT:
// // // - Be specific and vary your scores based on actual content
// // // - Do NOT default to medium — evaluate properly
// // // - flags array should be EMPTY [] if event is clean/low risk
// // // - Return ONLY valid JSON, no extra text

// // // {
// // //   "riskScore": <number 0-100, be precise based on rules above>,
// // //   "riskLevel": "<low|medium|high|critical>",
// // //   "semanticIntegrity": <number 0-100, how coherent/professional is the description>,
// // //   "hostLegitimacy": <number 0-100, higher if verified or well-known>,
// // //   "engagementPattern": <number 0-100, how trustworthy the event structure looks>,
// // //   "flags": [{"type": "<short flag name>", "description": "<specific reason from THIS event>", "severity": "<low|medium|high>"}],
// // //   "summary": "<2-3 sentences specific to THIS event, mention actual details from it>",
// // //   "recommendation": "<one specific actionable sentence for the moderator>"
// // // }`;

// // //     const response = await openai.chat.completions.create({
// // //       model: "gpt-4o-mini",
// // //       messages: [
// // //         {
// // //           role: "system",
// // //           content: "You are a fraud detection AI. Always return valid JSON only. Never return the same score for different events — evaluate each event uniquely based on its actual content.",
// // //         },
// // //         { role: "user", content: prompt },
// // //       ],
// // //       temperature: 0.7,  // Higher = more variation between events
// // //       response_format: { type: "json_object" }, // ✅ Forces JSON output, no markdown wrapping
// // //     });

// // //     const text = response.choices[0].message.content || "{}";
// // //     const parsed = JSON.parse(text);

// // //     // Validate and sanitize
// // //     res.json({
// // //       riskScore: Math.min(100, Math.max(0, parsed.riskScore ?? 50)),
// // //       riskLevel: parsed.riskLevel ?? "medium",
// // //       semanticIntegrity: Math.min(100, Math.max(0, parsed.semanticIntegrity ?? 80)),
// // //       hostLegitimacy: Math.min(100, Math.max(0, parsed.hostLegitimacy ?? 80)),
// // //       engagementPattern: Math.min(100, Math.max(0, parsed.engagementPattern ?? 80)),
// // //       flags: Array.isArray(parsed.flags) ? parsed.flags : [],
// // //       summary: parsed.summary ?? "No summary available.",
// // //       recommendation: parsed.recommendation ?? "Manual review recommended.",
// // //     });
// // // // server.js mein, parsed ke baad add karo:
// // // console.log("EVENT RECEIVED:", event.title);
// // // console.log("AI RESPONSE:", text);
// // // console.log("PARSED:", parsed);
// // //   } catch (err) {
// // //     console.error("OpenAI Error:", err);
// // //     res.status(500).json({
// // //       riskScore: 0,
// // //       riskLevel: "low",
// // //       semanticIntegrity: 100,
// // //       hostLegitimacy: 100,
// // //       engagementPattern: 100,
// // //       flags: [],
// // //       summary: "AI analysis failed — manual review required.",
// // //       recommendation: "Please review this event manually.",
// // //     });
// // //   }
// // // });

// // // app.listen(5000, () => {
// // //   console.log("✅ Server running on http://localhost:5000");
// // // });
// // // backend/server.js
// // // ✅ MyApp ke MongoDB se events fetch karta hai
// // // ✅ Admin dashboard se approve/reject status update karta hai
// // // ✅ OpenAI se AI analysis karta hai
// // //C:\Users\91934\Downloads\My-app-admin-dashboard-22\backend\server.js
// // import express from "express";
// // import cors from "cors";
// // import dotenv from "dotenv";
// // import OpenAI from "openai";
// // import { MongoClient, ObjectId } from "mongodb";
// // import dns from "dns";
// // dns.setDefaultResultOrder("ipv4first");
// // dotenv.config();

// // const app = express();
// // app.use(cors());
// // app.use(express.json());

// // const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// // // ─── MongoDB Connection ────────────────────────────────────────────────────────
// // let db;
// // let client;

// // // async function connectDB() {
// // //   try {
// // //    client = new MongoClient(process.env.MONGODB_URI, {
// // //   family: 4, // 🔥 FORCE IPv4 (MOST IMPORTANT)
// // // });
// // //     await client.connect();
// // //     db = client.db(); // assis_auth database (from URI)
// // //     console.log("✅ Connected to MyApp MongoDB:", db.databaseName);

// // //     // Check what collections exist
// // //     const collections = await db.listCollections().toArray();
// // //     console.log("📦 Collections found:", collections.map(c => c.name));
// // //   } catch (err) {
// // //     console.error("❌ MongoDB connection failed:", err.message);
// // //     process.exit(1);
// // //   }
// // // }
// // async function connectDB() {
// //   try {
// //     // Google DNS force
// //     const dns = await import('dns/promises');
// //     dns.setServers(['8.8.8.8', '1.1.1.1']);
    
// //     client = new MongoClient(process.env.MONGODB_URI, {
// //       family: 4,                    // IPv4 only
// //       serverSelectionTimeoutMS: 10000,
// //       socketTimeoutMS: 45000,
// //       maxPoolSize: 10,
// //       minPoolSize: 2,
// //       tls: true,
// //       retryWrites: true
// //       // dnsSeedlist HATAYA - not needed for latest driver
// //     });
    
// //     await client.connect();
// //     db = client.db('assis_auth');
// //     console.log("✅ CONNECTED:", db.databaseName);
    
// //     const collections = await db.listCollections().toArray();
// //     console.log("📦 Collections:", collections.map(c => c.name));
    
// //   } catch (err) {
// //     console.error("❌ FAILED:", err.message);
// //     process.exit(1);
// //   }
// // }
// // function normalizeEvent(doc) {
// //   // LOCATION OBJECT FIX 🔥
// //   let locationStr = "Location TBD";
// //   if (doc.location) {
// //     if (typeof doc.location === 'object' && doc.location.formattedAddress) {
// //       locationStr = doc.location.formattedAddress;
// //     } else if (typeof doc.location === 'object') {
// //       locationStr = doc.location.city || doc.location.address || 
// //                    `${doc.location.lat || ''}, ${doc.location.lng || ''}`;
// //     } else {
// //       locationStr = doc.location;
// //     }
// //   }

// //   return {
// //     id: doc._id?.toString() || doc.id || `EV-${Date.now()}`,
// //     title: doc.title || doc.eventTitle || doc.name || "Untitled Event",
// //     host: doc.host || doc.organizer || doc.organizerName || doc.createdBy || doc.userId || "Unknown Host",
// //     hostVerified: doc.hostVerified || doc.isVerified || false,
// //     image: doc.image || doc.banner || doc.thumbnail || doc.imageUrl ||
// //       "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600",
// //     category: doc.category || doc.eventCategory || doc.type || "Other",
// //     dateSubmitted: doc.createdAt || doc.dateSubmitted || doc.submittedAt || new Date().toISOString(),
// //     eventDate: doc.eventDate || doc.date || doc.startDate || doc.scheduledDate || "",
// //     location: locationStr,  // ✅ STRING ONLY
// //     ticketPrice: doc.ticketPrice || doc.price || doc.cost ||
// //       (doc.isFree ? "Free" : doc.amount ? `₹${doc.amount}` : "Free"),
// //     capacity: doc.capacity || doc.maxCapacity || doc.totalSeats || 100,
// //     description: doc.description || doc.about || doc.details || "No description provided.",
// //     status: doc.admin_status || doc.moderationStatus || doc.status || "pending",
// //   };
// // }

// // // ─── GET /events — fetch all events from MyApp MongoDB ────────────────────────
// // app.get("/events", async (req, res) => {
// //   try {
// //     if (!db) return res.status(500).json({ error: "DB not connected" });

// //     // Try common collection names for events in MyApp
// //     const possibleCollections = ["events", "event", "posts", "listings", "activities"];
// //     let eventsCollection = null;
// //     let rawEvents = [];

// //     for (const name of possibleCollections) {
// //       const coll = db.collection(name);
// //       const count = await coll.countDocuments();
// //       if (count > 0) {
// //         eventsCollection = name;
// //         rawEvents = await coll.find({}).sort({ createdAt: -1 }).limit(100).toArray();
// //         console.log(`✅ Found ${count} events in collection: ${name}`);
// //         break;
// //       }
// //     }

// //     if (rawEvents.length === 0) {
// //       console.log("⚠️ No events found in any collection. Returning empty array.");
// //       return res.json([]);
// //     }

// //     const normalized = rawEvents.map(normalizeEvent);
// //     res.json(normalized);

// //   } catch (err) {
// //     console.error("GET /events error:", err.message);
// //     res.status(500).json({ error: err.message });
// //   }
// // });

// // // ─── GET /events/:id — single event ───────────────────────────────────────────
// // app.get("/events/:id", async (req, res) => {
// //   try {
// //     if (!db) return res.status(500).json({ error: "DB not connected" });

// //     const { id } = req.params;
// //     const possibleCollections = ["events", "event", "posts", "listings", "activities"];

// //     for (const name of possibleCollections) {
// //       const coll = db.collection(name);
// //       let doc = null;

// //       // Try ObjectId first, then string id
// //       try {
// //         doc = await coll.findOne({ _id: new ObjectId(id) });
// //       } catch (_) {
// //         doc = await coll.findOne({ id });
// //       }

// //       if (doc) {
// //         return res.json(normalizeEvent(doc));
// //       }
// //     }

// //     res.status(404).json({ error: "Event not found" });
// //   } catch (err) {
// //     console.error("GET /events/:id error:", err.message);
// //     res.status(500).json({ error: err.message });
// //   }
// // });

// // // ─── PATCH /events/:id/status — approve or reject ─────────────────────────────
// // // This updates admin_status in MyApp's MongoDB
// // // When approved → event becomes visible on MyApp
// // app.patch("/events/:id/status", async (req, res) => {
// //   try {
// //     if (!db) return res.status(500).json({ error: "DB not connected" });

// //     const { id } = req.params;
// //     const { status, moderatorNote } = req.body; // status: 'approved' | 'rejected' | 'pending' | 'flagged'

// //     const validStatuses = ["approved", "rejected", "pending", "flagged", "under_review"];
// //     if (!validStatuses.includes(status)) {
// //       return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` });
// //     }

// //     const updateData = {
// //       admin_status: status,
// //       moderationStatus: status,
// //       updatedAt: new Date(),
// //       ...(moderatorNote ? { moderatorNote } : {}),
// //       // If approved, set isApproved flag too (in case MyApp checks this)
// //       ...(status === "approved" ? { isApproved: true, isActive: true, isListed: true } : {}),
// //       ...(status === "rejected" ? { isApproved: false, isActive: false, isListed: false } : {}),
// //     };

// //     const possibleCollections = ["events", "event", "posts", "listings", "activities"];
// //     let updated = false;

// //     for (const name of possibleCollections) {
// //       const coll = db.collection(name);
// //       let result;

// //       try {
// //         result = await coll.updateOne(
// //           { _id: new ObjectId(id) },
// //           { $set: updateData }
// //         );
// //       } catch (_) {
// //         result = await coll.updateOne({ id }, { $set: updateData });
// //       }

// //       if (result.matchedCount > 0) {
// //         updated = true;
// //         console.log(`✅ Status updated: ${id} → ${status} (collection: ${name})`);
// //         break;
// //       }
// //     }

// //     if (!updated) {
// //       return res.status(404).json({ error: "Event not found in any collection" });
// //     }

// //     res.json({ success: true, id, status, message: `Event ${status} successfully` });

// //   } catch (err) {
// //     console.error("PATCH /events/:id/status error:", err.message);
// //     res.status(500).json({ error: err.message });
// //   }
// // });

// // // ─── POST /analyze — AI analysis via OpenAI ───────────────────────────────────
// // app.post("/analyze", async (req, res) => {
// //   try {
// //     const { event } = req.body;
// //     if (!event) return res.status(400).json({ error: "No event data provided" });

// //     console.log("🤖 Analyzing event:", event.title);

// //     const prompt = `You are a strict AI moderation system for an event platform. Analyze this event and detect fraud, scams, or risky content.

// // SCORING RULES:
// // - HIGH RISK (70-100): Vague details, suspicious payment, hidden location, unrealistic claims, drug references
// // - MEDIUM RISK (40-69): Unverified host, missing details, high price with few details  
// // - LOW RISK (0-39): Clear description, reasonable price, known venue, professional tone

// // EVENT:
// // Title: ${event.title || "N/A"}
// // Host: ${event.host || "N/A"}
// // Host Verified: ${event.hostVerified ? "Yes" : "No"}
// // Category: ${event.category || "N/A"}
// // Description: ${event.description || "N/A"}
// // Price: ${event.ticketPrice || "N/A"}
// // Location: ${event.location || "N/A"}
// // Capacity: ${event.capacity || "N/A"}

// // Return ONLY valid JSON:
// // {
// //   "riskScore": <0-100>,
// //   "riskLevel": "<low|medium|high|critical>",
// //   "semanticIntegrity": <0-100>,
// //   "hostLegitimacy": <0-100>,
// //   "engagementPattern": <0-100>,
// //   "flags": [{"type": "<name>", "description": "<specific reason>", "severity": "<low|medium|high>"}],
// //   "summary": "<2-3 sentences about THIS event>",
// //   "recommendation": "<one actionable sentence>"
// // }`;

// //     const response = await openai.chat.completions.create({
// //       model: "gpt-4o-mini",
// //       messages: [
// //         { role: "system", content: "You are a fraud detection AI. Return valid JSON only. Vary scores based on actual event content." },
// //         { role: "user", content: prompt },
// //       ],
// //       temperature: 0.7,
// //       response_format: { type: "json_object" },
// //     });

// //     const parsed = JSON.parse(response.choices[0].message.content || "{}");
// //     console.log("✅ AI Result:", parsed.riskScore, parsed.riskLevel);

// //     res.json({
// //       riskScore: Math.min(100, Math.max(0, parsed.riskScore ?? 50)),
// //       riskLevel: parsed.riskLevel ?? "medium",
// //       semanticIntegrity: Math.min(100, Math.max(0, parsed.semanticIntegrity ?? 80)),
// //       hostLegitimacy: Math.min(100, Math.max(0, parsed.hostLegitimacy ?? 80)),
// //       engagementPattern: Math.min(100, Math.max(0, parsed.engagementPattern ?? 80)),
// //       flags: Array.isArray(parsed.flags) ? parsed.flags : [],
// //       summary: parsed.summary ?? "Analysis complete.",
// //       recommendation: parsed.recommendation ?? "Manual review recommended.",
// //     });

// //   } catch (err) {
// //     console.error("❌ OpenAI Error:", err.message);
// //     res.status(500).json({
// //       riskScore: 0, riskLevel: "low",
// //       semanticIntegrity: 100, hostLegitimacy: 100, engagementPattern: 100,
// //       flags: [],
// //       summary: "AI analysis failed — manual review required.",
// //       recommendation: "Please review this event manually.",
// //     });
// //   }
// // });

// // // ─── GET /collections — debug: see what's in MongoDB ─────────────────────────
// // app.get("/collections", async (req, res) => {
// //   try {
// //     if (!db) return res.status(500).json({ error: "DB not connected" });
// //     const collections = await db.listCollections().toArray();
// //     const info = {};
// //     for (const c of collections) {
// //       const count = await db.collection(c.name).countDocuments();
// //       const sample = await db.collection(c.name).findOne({});
// //       info[c.name] = { count, sampleKeys: sample ? Object.keys(sample) : [] };
// //     }
// //     res.json(info);
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // });


// // // ─── GET /users ─────────────────────────────
// // const users = data.map(u => ({
// //   id: u._id?.toString(),

// //   name:
// //     u.profile?.firstName && u.profile?.lastName
// //       ? `${u.profile.firstName} ${u.profile.lastName}`
// //       : u.profile?.firstName || "User",

// //   username: u.profile?.username
// //     ? `@${u.profile.username}`
// //     : "@user",

// //   joined: new Date(u.createdAt || Date.now()).getFullYear(),

// //   location: u.profile?.location || "India",

// //   type: u.role || "User",

// //   activity: `${Math.floor(Math.random() * 5)} Events`,

// //   lastActive: "Recently",

// //   reputation: Math.floor(Math.random() * 100),

// //   status: u.isDeleted ? "Inactive" : "Active",

// //   image:
// //     u.profile?.imageUrl ||
// //     `https://ui-avatars.com/api/?name=${u.profile?.firstName || "User"}`
// // }));




// // // ─── Health check ──────────────────────────────────────────────────────────────
// // app.get("/health", (req, res) => {
// //   res.json({ status: "ok", db: db ? "connected" : "disconnected", time: new Date().toISOString() });
// // });

// // // ─── Start ─────────────────────────────────────────────────────────────────────
// // connectDB().then(() => {
// //   app.listen(5006, () => {
// //     console.log("✅ Admin Dashboard Backend running on http://localhost:5006");
// //     console.log("📡 Endpoints:");
// //     console.log("   GET  /health");
// //     console.log("   GET  /collections  ← debug: see MongoDB collections");
// //     console.log("   GET  /events       ← fetch all MyApp events");
// //     console.log("   GET  /events/:id   ← single event");
// //     console.log("   PATCH /events/:id/status  ← approve/reject");
// //     console.log("   POST /analyze      ← AI analysis");
// //   });
// // });
// // backend/server.js
// // ✅ Full server with MongoDB users + events + AI analysis

// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import OpenAI from "openai";
// import { MongoClient, ObjectId } from "mongodb";
// import dns from "dns";
// dns.setDefaultResultOrder("ipv4first");
// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// let db;
// let client;

// async function connectDB() {
//   try {
//     const dns = await import('dns/promises');
//     dns.setServers(['8.8.8.8', '1.1.1.1']);
//     client = new MongoClient(process.env.MONGODB_URI, {
//       family: 4,
//       serverSelectionTimeoutMS: 10000,
//       socketTimeoutMS: 45000,
//       maxPoolSize: 10,
//       minPoolSize: 2,
//       tls: true,
//       retryWrites: true,
//     });
//     await client.connect();
//     db = client.db('assis_auth');
//     console.log("✅ CONNECTED:", db.databaseName);
//     const collections = await db.listCollections().toArray();
//     console.log("📦 Collections:", collections.map(c => c.name));
//   } catch (err) {
//     console.error("❌ FAILED:", err.message);
//     process.exit(1);
//   }
// }

// // ─── normalizeEvent ────────────────────────────────────────────────────────────
// function normalizeEvent(doc) {
//   let locationStr = "Location TBD";
//   if (doc.location) {
//     if (typeof doc.location === 'object' && doc.location.formattedAddress) {
//       locationStr = doc.location.formattedAddress;
//     } else if (typeof doc.location === 'object') {
//       locationStr = doc.location.city || doc.location.address || `${doc.location.lat || ''}, ${doc.location.lng || ''}`;
//     } else {
//       locationStr = doc.location;
//     }
//   }
//   return {
//     id: doc._id?.toString() || doc.id || `EV-${Date.now()}`,
//     title: doc.title || doc.eventTitle || doc.name || "Untitled Event",
//     host: doc.host || doc.organizer || doc.organizerName || doc.createdBy || doc.creatorClerkId || "Unknown Host",
//     hostVerified: doc.hostVerified || doc.isVerified || false,
//     image: doc.image || doc.banner || doc.bannerUri || doc.thumbnail || doc.imageUrl ||
//       "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600",
//     category: doc.category || doc.eventCategory || doc.kind || doc.type || "Other",
//     dateSubmitted: doc.createdAt || doc.dateSubmitted || doc.submittedAt || new Date().toISOString(),
//     eventDate: doc.eventDate || doc.date || doc.startDate || doc.scheduledDate || "",
//     location: locationStr,
//     ticketPrice: doc.ticketPrice || doc.price || doc.cost ||
//       (doc.kind === 'free' ? "Free" : doc.priceCents ? `₹${Math.round(doc.priceCents / 100)}` : "Free"),
//     capacity: doc.capacity || doc.maxCapacity || doc.attendance || doc.totalSeats || 100,
//     description: doc.description || doc.about || doc.details || "No description provided.",
//     status: doc.admin_status || doc.moderationStatus || "pending",
//     attendeesCount: Array.isArray(doc.attendees) ? doc.attendees.length : 0,
//   };
// }

// // ─── GET /events ───────────────────────────────────────────────────────────────
// app.get("/events", async (req, res) => {
//   try {
//     if (!db) return res.status(500).json({ error: "DB not connected" });
//     const rawEvents = await db.collection("events").find({}).sort({ createdAt: -1 }).limit(100).toArray();
//     res.json(rawEvents.map(normalizeEvent));
//   } catch (err) {
//     console.error("GET /events error:", err.message);
//     res.status(500).json({ error: err.message });
//   }
// });

// // ─── GET /events/:id ──────────────────────────────────────────────────────────
// app.get("/events/:id", async (req, res) => {
//   try {
//     if (!db) return res.status(500).json({ error: "DB not connected" });
//     const { id } = req.params;
//     let doc = null;
//     try { doc = await db.collection("events").findOne({ _id: new ObjectId(id) }); } catch (_) {}
//     if (!doc) doc = await db.collection("events").findOne({ id });
//     if (!doc) return res.status(404).json({ error: "Event not found" });
//     res.json(normalizeEvent(doc));
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // ─── PATCH /events/:id/status ─────────────────────────────────────────────────
// app.patch("/events/:id/status", async (req, res) => {
//   try {
//     if (!db) return res.status(500).json({ error: "DB not connected" });
//     const { id } = req.params;
//     const { status, moderatorNote } = req.body;
//     const validStatuses = ["approved", "rejected", "pending", "flagged", "under_review"];
//     if (!validStatuses.includes(status)) return res.status(400).json({ error: "Invalid status" });

//     const updateData = {
//       admin_status: status,
//       moderationStatus: status,
//       updatedAt: new Date(),
//       ...(moderatorNote ? { moderatorNote } : {}),
//       ...(status === "approved" ? { isApproved: true, isActive: true, isListed: true } : {}),
//       ...(status === "rejected" ? { isApproved: false, isActive: false, isListed: false } : {}),
//     };

//     let result;
//     try { result = await db.collection("events").updateOne({ _id: new ObjectId(id) }, { $set: updateData }); }
//     catch (_) { result = await db.collection("events").updateOne({ id }, { $set: updateData }); }

//     if (result.matchedCount === 0) return res.status(404).json({ error: "Event not found" });
//     console.log(`✅ Status updated: ${id} → ${status}`);
//     res.json({ success: true, id, status });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });
// ////////////
// // 🎯 ADVANCED REPUTATION CALCULATOR
// function calculateReputation({
//   rating = 0,
//   reviewsCount = 0,
//   eventsHosted = 0,
//   eventsAttended = 0,
//   isBanned = false,
//   isSuspended = false,
// }) {
//   let score = 0;

//   // ⭐ Rating (max 40)
//   if (rating > 0) {
//     const ratingScore = (rating / 5) * 40;
//     const reviewBoost = Math.min(10, reviewsCount * 0.5);
//     score += ratingScore + reviewBoost;
//   }

//   // 🎉 Hosting (max 25)
//   score += Math.min(25, eventsHosted * 2.5);

//   // 🙋 Attendance (max 15)
//   score += Math.min(15, eventsAttended * 1.5);

//   // ⚡ Activity bonus (max 10)
//   const totalActivity = eventsHosted + eventsAttended;
//   if (totalActivity > 20) score += 10;
//   else if (totalActivity > 10) score += 5;

//   // ❌ Penalty
//   if (isSuspended) score -= 20;
//   if (isBanned) score -= 50;

//   return Math.max(0, Math.min(100, Math.round(score)));
// }
// // ─── GET /users ── ✅ REAL DATA from MongoDB ──────────────────────────────────
// // users collection: _id, clerkUserId, profile, createdAt, isDeleted, moderation
// // user_stats collection: clerkUserId, eventsHosted, totalAttendees, rating, etc.
// // events collection: creatorClerkId → count events per user
// app.get("/users", async (req, res) => {
//   try {
//     if (!db) return res.status(500).json({ error: "DB not connected" });

//     // 1. Fetch all users
//     const rawUsers = await db.collection("users").find({}).sort({ createdAt: -1 }).limit(100).toArray();

//     // 2. Fetch all user_stats (indexed by clerkUserId)
//     const rawStats = await db.collection("user_stats").find({}).toArray();
//     const statsMap = {};
//     for (const s of rawStats) {
//       if (s.clerkUserId) statsMap[s.clerkUserId] = s;
//     }

//     // 3. Count events per user (hosted events)
//     const eventsAgg = await db.collection("events").aggregate([
//       { $group: { _id: "$creatorClerkId", count: { $sum: 1 } } }
//     ]).toArray();
//     const eventsMap = {};
//     for (const e of eventsAgg) {
//       if (e._id) eventsMap[e._id] = e.count;
//     }

//     // 4. Count events attended (attendees array contains clerkUserId)
//     // events.attendees is an array — we count per clerkUserId
//     const attendedAgg = await db.collection("events").aggregate([
//       { $unwind: { path: "$attendees", preserveNullAndEmptyArrays: false } },
//       {
//         $group: {
//           _id: {
//             $cond: [
//               { $eq: [{ $type: "$attendees" }, "string"] },
//               "$attendees",
//               "$attendees.clerkId"
//             ]
//           },
//           count: { $sum: 1 }
//         }
//       }
//     ]).toArray();
//     const attendedMap = {};
//     for (const a of attendedAgg) {
//       if (a._id) attendedMap[a._id] = a.count;
//     }

//     // 5. Normalize users
//     const users = rawUsers.map(u => {
//       const clerkId = u.clerkUserId || u._id?.toString();
//       const stats = statsMap[clerkId] || {};
//       const profile = u.profile || {};

//       const eventsHosted = stats.eventsHosted ?? eventsMap[clerkId] ?? 0;
//       const eventsAttended = stats.totalAttendees ?? attendedMap[clerkId] ?? 0;

//       // Determine user type
//       const isHost = eventsHosted > 0;
//       const isAttendee = eventsAttended > 0;
//       const userType = isHost && isAttendee ? "Both" : isHost ? "Host" : "User";

//       // Activity string
//       const activity = isHost
//         ? `${eventsHosted} Hosted`
//         : eventsAttended > 0
//         ? `${eventsAttended} Attended`
//         : "New User";

//       // Reputation from stats or moderation
//       const reputation = calculateReputation({
//   rating,
//   reviewsCount: stats.reviewsCount ?? 0,
//   eventsHosted,
//   eventsAttended,
//   isBanned: moderation.isBanned ?? false,
//   isSuspended: moderation.isSuspended ?? false,
// });

//       // Status from moderation
//       const moderation = u.moderation || {};
//       const status = u.isDeleted
//         ? "Inactive"
//         : moderation.isBanned
//         ? "Banned"
//         : moderation.isSuspended
//         ? "Suspended"
//         : "Active";

//       // Name
//       const firstName = profile.firstName || profile.name || "";
//       const lastName = profile.lastName || "";
//       const name = `${firstName} ${lastName}`.trim() || profile.username || "User";

//       // Last active
//       const updatedAt = u.updatedAt || u.createdAt;
//       const lastActiveDate = updatedAt ? new Date(updatedAt) : null;
//       const now = Date.now();
//       let lastActive = "Long ago";
//       if (lastActiveDate) {
//         const diff = now - lastActiveDate.getTime();
//         const mins = Math.floor(diff / 60000);
//         const hours = Math.floor(diff / 3600000);
//         const days = Math.floor(diff / 86400000);
//         if (mins < 60) lastActive = `${mins}m ago`;
//         else if (hours < 24) lastActive = `${hours}h ago`;
//         else lastActive = `${days}d ago`;
//       }

//       return {
//         id: u._id?.toString(),
//         clerkUserId: clerkId,
//         name,
//         username: profile.username ? `@${profile.username}` : `@user_${u._id?.toString().slice(-4)}`,
//         joined: new Date(u.createdAt || Date.now()).toLocaleDateString("en-US", { month: "short", year: "numeric" }),
//         location: profile.location || profile.city || "India",
//         type: userType,
//         activity,
//         lastActive,
//         reputation,
//         status,
//         image: profile.imageUrl || profile.avatar || profile.photo ||
//           `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff&size=128`,
//         // Extra stats for detail panel
//         eventsHosted,
//         eventsAttended,
//         rating: stats.rating ?? 0,
//         reviewsCount: stats.reviewsCount ?? 0,
//         totalEarnings: stats.overallEarning ?? 0,
//         isBanned: moderation.isBanned ?? false,
//         isSuspended: moderation.isSuspended ?? false,
//       };
//     });

//     res.json(users);
//   } catch (err) {
//     console.error("GET /users error:", err.message);
//     res.status(500).json({ error: err.message });
//   }
// });

// // ─── GET /users/:id ───────────────────────────────────────────────────────────
// app.get("/users/:id", async (req, res) => {
//   try {
//     if (!db) return res.status(500).json({ error: "DB not connected" });
//     const { id } = req.params;
//     let user = null;
//     try { user = await db.collection("users").findOne({ _id: new ObjectId(id) }); } catch (_) {}
//     if (!user) user = await db.collection("users").findOne({ clerkUserId: id });
//     if (!user) return res.status(404).json({ error: "User not found" });

//     const stats = await db.collection("user_stats").findOne({ clerkUserId: user.clerkUserId }) || {};
//     const eventsCount = await db.collection("events").countDocuments({ creatorClerkId: user.clerkUserId });
//     const recentEvents = await db.collection("events")
//       .find({ creatorClerkId: user.clerkUserId })
//       .sort({ createdAt: -1 }).limit(5).toArray();

//     res.json({ user, stats, eventsCount, recentEvents: recentEvents.map(normalizeEvent) });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // ─── POST /analyze ────────────────────────────────────────────────────────────
// app.post("/analyze", async (req, res) => {
//   try {
//     const { event } = req.body;

// // 🔥 Remove hostVerified completely before sending to AI
// const safeEvent = { ...event };
// delete safeEvent.hostVerified;
//     if (!event) return res.status(400).json({ error: "No event data provided" });
//     console.log("🤖 Analyzing:", event.title);
// const prompt = `
// You are an advanced fraud detection AI for an event platform.

// Your job is to STRICTLY evaluate risk based on realistic fraud patterns.
// DO NOT give similar scores. Spread scores across full range (0–100).

// 🚨 IMPORTANT RULE:
// - You MUST justify score internally and vary it based on input quality
// - DO NOT give default scores like 70 or 75 unless truly justified

// ──────────── SCORING LOGIC ────────────

// Start from BASE SCORE = 50

// Then adjust:

// ➕ ADD RISK:
// +20 → Missing or vague description
// +15 → Suspicious wording (e.g. "guaranteed profit", "secret", "limited hack")
// +15 → Very high price with poor explanation
// +10 → Unknown or unclear location
// +10 → No clear event structure
// +10 → Very low capacity but high price
// +5  → Poor grammar or spammy tone

// ➖ REDUCE RISK:
// -20 → Clear professional description
// -15 → Well-known or specific venue
// -10 → Structured details (agenda, timing, speakers)
// -10 → Reasonable pricing
// -5  → Normal tone

// ──────────── OUTPUT RULES ────────────

// Final Score:
// 0–30   → LOW
// 31–60  → MEDIUM
// 61–80  → HIGH
// 81–100 → CRITICAL

// You MUST:
// - Use full score range (avoid clustering)
// - Be strict but realistic
// - Detect scams, fake events, misleading info

// ──────────── EVENT DATA ────────────

// Title: ${safeEvent.title || "N/A"}
// Host: ${safeEvent.host || "N/A"}
// Category: ${safeEvent.category || "N/A"}
// Description: ${safeEvent.description || "N/A"}
// Price: ${safeEvent.ticketPrice || "N/A"}
// Location: ${safeEvent.location || "N/A"}
// Capacity: ${safeEvent.capacity || "N/A"}

// ──────────── RESPONSE FORMAT (STRICT JSON) ────────────

// {
//   "riskScore": number,
//   "riskLevel": "low|medium|high|critical",
//   "semanticIntegrity": number,
//   "hostLegitimacy": number,
//   "engagementPattern": number,
//   "flags": [
//     {
//       "type": "string",
//       "description": "specific reason",
//       "severity": "low|medium|high"
//     }
//   ],
//   "summary": "2-3 sentence explanation based on THIS event",
//   "recommendation": "1 actionable step"
// }
// `;

//     const response = await openai.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages: [
//         { role: "system", content: "You are a fraud detection AI. Return valid JSON only." },
//         { role: "user", content: prompt },
//       ],
//       temperature: 0.7,
//       response_format: { type: "json_object" },
//     });

//     const parsed = JSON.parse(response.choices[0].message.content || "{}");
//     res.json({
//       riskScore: Math.min(100, Math.max(0, parsed.riskScore ?? 50)),
//       riskLevel: parsed.riskLevel ?? "medium",
//       semanticIntegrity: Math.min(100, Math.max(0, parsed.semanticIntegrity ?? 80)),
//       hostLegitimacy: Math.min(100, Math.max(0, parsed.hostLegitimacy ?? 80)),
//       engagementPattern: Math.min(100, Math.max(0, parsed.engagementPattern ?? 80)),
//       flags: Array.isArray(parsed.flags) ? parsed.flags : [],
//       summary: parsed.summary ?? "Analysis complete.",
//       recommendation: parsed.recommendation ?? "Manual review recommended.",
//     });
//   } catch (err) {
//     console.error("❌ OpenAI Error:", err.message);
//     res.status(500).json({ riskScore: 0, riskLevel: "low", semanticIntegrity: 100, hostLegitimacy: 100, engagementPattern: 100, flags: [], summary: "AI analysis failed.", recommendation: "Review manually." });
//   }
// });

// // ─── GET /collections ─────────────────────────────────────────────────────────
// app.get("/collections", async (req, res) => {
//   try {
//     if (!db) return res.status(500).json({ error: "DB not connected" });
//     const collections = await db.listCollections().toArray();
//     const info = {};
//     for (const c of collections) {
//       const count = await db.collection(c.name).countDocuments();
//       const sample = await db.collection(c.name).findOne({});
//       info[c.name] = { count, sampleKeys: sample ? Object.keys(sample) : [] };
//     }
//     res.json(info);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // ─── Health check ─────────────────────────────────────────────────────────────
// app.get("/health", (req, res) => {
//   res.json({ status: "ok", db: db ? "connected" : "disconnected", time: new Date().toISOString() });
// });

// connectDB().then(() => {
//   app.listen(5006, () => {
//     console.log("✅ Admin Dashboard Backend running on http://localhost:5006");
//     console.log("📡 Endpoints:");
//     console.log("   GET  /health");
//     console.log("   GET  /collections");
//     console.log("   GET  /events");
//     console.log("   GET  /events/:id");
//     console.log("   PATCH /events/:id/status");
//     console.log("   POST /analyze");
//     console.log("   GET  /users        ← NEW: real users from MongoDB");
//     console.log("   GET  /users/:id    ← NEW: single user detail");
//   });
// });
// backend/server.js
// ✅ AI Analysis MongoDB mein CACHE hoti hai
//    - Pehli baar: OpenAI se analyze karo → MongoDB mein aiAnalysis field save karo
//    - Agli baar: MongoDB se cached result return karo (no OpenAI call)
//    - Re-analyze button: force=true → fresh analysis + MongoDB update
// ✅ GET /events → har event mein aiAnalysis field bhi return hoti hai
// ✅ GET /users → real data from MongoDB users + user_stats + events collections

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
let db, client;

// ─── DB Connect ───────────────────────────────────────────────────────────────
async function connectDB() {
  try {
    const dns = await import('dns/promises');
    dns.setServers(['8.8.8.8', '1.1.1.1']);
    client = new MongoClient(process.env.MONGODB_URI, {
      family: 4,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 2,
      tls: true,
      retryWrites: true,
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

// ─── Event normalizer ─────────────────────────────────────────────────────────
// Ye function MongoDB document ko frontend-friendly format mein convert karta hai
// Alag-alag field names handle karta hai (MyApp ke different versions ke liye)
function normalizeEvent(doc) {
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
    title: doc.title || "Untitled Event",
    host: doc.host || doc.creatorClerkId || "Unknown Host",
    hostVerified: doc.hostVerified || doc.isVerified || false,
    image: doc.image || doc.banner || doc.bannerUri || doc.imageUrl ||
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600",
    category: doc.category || doc.kind || "Other",
    // dateSubmitted = event kab submit hua (admin queue ke liye)
    dateSubmitted: doc.createdAt || doc.dateSubmitted || new Date().toISOString(),
    // eventDate = event kab hoga (actual event ka date)
    eventDate: doc.date || doc.eventDate || doc.startDate || "",
    location: locationStr,
    ticketPrice: doc.kind === 'free' ? "Free"
      : doc.priceCents ? `₹${Math.round(doc.priceCents / 100)}`
      : doc.ticketPrice || "Free",
    capacity: doc.capacity || doc.attendance || 100,
    description: doc.description || "No description provided.",
    status: doc.admin_status || doc.moderationStatus || "pending",
    attendeesCount: Array.isArray(doc.attendees) ? doc.attendees.length : 0,
    // ✅ Cached AI analysis return karo agar available hai
    // Frontend is field ko check karta hai: agar aiAnalysis hai toh OpenAI call nahi karega
    aiAnalysis: doc.aiAnalysis || null,
  };
}

// ─── GET /events ──────────────────────────────────────────────────────────────
app.get("/events", async (req, res) => {
  try {
    if (!db) return res.status(500).json({ error: "DB not connected" });
    const raw = await db.collection("events").find({}).sort({ createdAt: -1 }).limit(100).toArray();
    res.json(raw.map(normalizeEvent));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GET /events/:id ─────────────────────────────────────────────────────────
app.get("/events/:id", async (req, res) => {
  try {
    if (!db) return res.status(500).json({ error: "DB not connected" });
    const { id } = req.params;
    let doc = null;
    try { doc = await db.collection("events").findOne({ _id: new ObjectId(id) }); } catch (_) {}
    if (!doc) doc = await db.collection("events").findOne({ id });
    if (!doc) return res.status(404).json({ error: "Event not found" });
    res.json(normalizeEvent(doc));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── PATCH /events/:id/status ────────────────────────────────────────────────
// Admin dashboard se approve/reject karne pe ye call hoti hai
// MongoDB mein admin_status update hoti hai
// get-events route check karta hai admin_status === "approved" → tab hi MyApp pe dikhta hai
app.patch("/events/:id/status", async (req, res) => {
  try {
    if (!db) return res.status(500).json({ error: "DB not connected" });
    const { id } = req.params;
    const { status, moderatorNote } = req.body;
    const validStatuses = ["approved", "rejected", "pending", "flagged", "under_review"];
    if (!validStatuses.includes(status)) return res.status(400).json({ error: "Invalid status" });

    const updateData = {
      admin_status: status,
      moderationStatus: status,
      updatedAt: new Date(),
      ...(moderatorNote ? { moderatorNote } : {}),
      // approve → sab flags true, MyApp pe dikhe
      ...(status === "approved" ? { isApproved: true, isActive: true, isListed: true } : {}),
      // reject → sab flags false, MyApp pe nahi dikhe
      ...(status === "rejected" ? { isApproved: false, isActive: false, isListed: false } : {}),
    };

    let result;
    try {
      result = await db.collection("events").updateOne({ _id: new ObjectId(id) }, { $set: updateData });
    } catch (_) {
      result = await db.collection("events").updateOne({ id }, { $set: updateData });
    }

    if (result.matchedCount === 0) return res.status(404).json({ error: "Event not found" });
    console.log(`✅ Status: ${id} → ${status}`);
    res.json({ success: true, id, status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── POST /analyze — AI Analysis with MongoDB Caching ────────────────────────
//
// CACHING LOGIC (samjho carefully):
//
// 1. Frontend event bhejta hai: { event: {...}, force: false }
//
// 2. force=false (default har baar):
//    → Backend MongoDB mein check karta hai: kya is event ka aiAnalysis already saved hai?
//    → Agar HAI: seedha return karo (fromCache: true) — OpenAI call NAHI hogi
//    → Agar NAHI: OpenAI se analyze karo → result MongoDB mein save karo → return karo
//
// 3. force=true (Re-analyze button press karo):
//    → Cache ignore karo
//    → OpenAI se fresh analysis karo
//    → MongoDB mein update karo
//    → Return karo
//
// BENEFIT: Har page reload pe AI call nahi hogi → paise bachenge, speed badhe

app.post("/analyze", async (req, res) => {
  try {
    const { event, force } = req.body;
    if (!event) return res.status(400).json({ error: "No event data provided" });

    // ✅ STEP 1: Cache check (sirf jab force=false ho)
    // Har baar analyze click nahi karna padega — ek baar analyze hua to save ho jaata hai
    if (!force && event.id && db) {
      let existingDoc = null;
      try {
        existingDoc = await db.collection("events").findOne({ _id: new ObjectId(event.id) });
      } catch (_) {
        existingDoc = await db.collection("events").findOne({ id: event.id });
      }

      // Cache mila! Wapas bhejo bina OpenAI call ke
      if (existingDoc?.aiAnalysis?.riskScore !== undefined) {
        console.log(`📦 CACHE HIT: "${event.title}" — returning saved analysis (no OpenAI call)`);
        return res.json({ ...existingDoc.aiAnalysis, fromCache: true });
      }
    }

    // ✅ STEP 2: Fresh AI analysis (pehli baar ya force=true)
    console.log(`🤖 ${force ? 'FORCE re-analyzing' : 'First-time analyzing'}: "${event.title}"`);

    // hostVerified hata do — AI ko ye bias kar sakta hai
    const safeEvent = { ...event };
    delete safeEvent.hostVerified;

    const prompt = `You are a strict AI moderation system for an event platform. Analyze this event and detect fraud, scams, or risky content.

SCORING RULES:
- HIGH RISK (70-100): Vague details, suspicious payment, hidden location, unrealistic claims, drug references
- MEDIUM RISK (40-69): Unverified host, missing details, high price with few details  
- LOW RISK (0-39): Clear description, reasonable price, known venue, professional tone

EVENT:
Title: ${safeEvent.title || "N/A"}
Host: ${safeEvent.host || "N/A"}
Category: ${safeEvent.category || "N/A"}
Description: ${safeEvent.description || "N/A"}
Price: ${safeEvent.ticketPrice || "N/A"}
Location: ${safeEvent.location || "N/A"}
Capacity: ${safeEvent.capacity || "N/A"}

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
    const result = {
      riskScore: Math.min(100, Math.max(0, parsed.riskScore ?? 50)),
      riskLevel: parsed.riskLevel ?? "medium",
      semanticIntegrity: Math.min(100, Math.max(0, parsed.semanticIntegrity ?? 80)),
      hostLegitimacy: Math.min(100, Math.max(0, parsed.hostLegitimacy ?? 80)),
      engagementPattern: Math.min(100, Math.max(0, parsed.engagementPattern ?? 80)),
      flags: Array.isArray(parsed.flags) ? parsed.flags : [],
      summary: parsed.summary ?? "Analysis complete.",
      recommendation: parsed.recommendation ?? "Manual review recommended.",
      scannedAt: new Date().toISOString(),
    };

    // ✅ STEP 3: MongoDB mein save karo (cache ke liye)
    // Agli baar same event analyze karo → yahan se milega, OpenAI call nahi hogi
    if (event.id && db) {
      try {
        let saveResult;
        try {
          saveResult = await db.collection("events").updateOne(
            { _id: new ObjectId(event.id) },
            { $set: { aiAnalysis: result, updatedAt: new Date() } }
          );
        } catch (_) {
          saveResult = await db.collection("events").updateOne(
            { id: event.id },
            { $set: { aiAnalysis: result, updatedAt: new Date() } }
          );
        }
        if (saveResult.matchedCount > 0) {
          console.log(`💾 AI CACHED in MongoDB: "${event.title}"`);
        }
      } catch (saveErr) {
        // Cache save fail hua to bhi analysis return karo — critical nahi hai
        console.warn("⚠️ Cache save failed (non-critical):", saveErr.message);
      }
    }

    res.json({ ...result, fromCache: false });
  } catch (err) {
    console.error("❌ OpenAI Error:", err.message);
    res.status(500).json({
      riskScore: 0, riskLevel: "low",
      semanticIntegrity: 100, hostLegitimacy: 100, engagementPattern: 100,
      flags: [], summary: "AI analysis failed.", recommendation: "Review manually.",
      fromCache: false,
    });
  }
});

// ─── GET /users ───────────────────────────────────────────────────────────────
// 3 MongoDB collections se data combine karta hai:
// 1. users → profile info (name, image, location etc.)
// 2. user_stats → hosting stats (eventsHosted, rating, earnings)
// 3. events → count karo kitne events banaye (creatorClerkId se)
function calculateReputation({ rating = 0, reviewsCount = 0, eventsHosted = 0, eventsAttended = 0, isBanned = false, isSuspended = false }) {
  let score = 0;
  if (rating > 0) score += (rating / 5) * 40 + Math.min(10, reviewsCount * 0.5);
  score += Math.min(25, eventsHosted * 2.5);
  score += Math.min(15, eventsAttended * 1.5);
  const total = eventsHosted + eventsAttended;
  if (total > 20) score += 10;
  else if (total > 10) score += 5;
  if (isSuspended) score -= 20;
  if (isBanned) score -= 50;
  return Math.max(0, Math.min(100, Math.round(score)));
}

app.get("/users", async (req, res) => {
  try {
    if (!db) return res.status(500).json({ error: "DB not connected" });

    const rawUsers = await db.collection("users").find({}).sort({ createdAt: -1 }).limit(100).toArray();

    // user_stats collection se stats lo (rating, earnings etc.)
    const rawStats = await db.collection("user_stats").find({}).toArray();
    const statsMap = {};
    for (const s of rawStats) { if (s.clerkUserId) statsMap[s.clerkUserId] = s; }

    // events collection se count karo kitne events banaye (host ke liye)
    const eventsAgg = await db.collection("events").aggregate([
      { $group: { _id: "$creatorClerkId", count: { $sum: 1 } } }
    ]).toArray();
    const eventsMap = {};
    for (const e of eventsAgg) { if (e._id) eventsMap[e._id] = e.count; }

    // events.attendees array se count karo kitne events attend kiye
    const attendedAgg = await db.collection("events").aggregate([
      { $unwind: { path: "$attendees", preserveNullAndEmptyArrays: false } },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: [{ $type: "$attendees" }, "string"] },
              "$attendees",
              "$attendees.clerkId"
            ]
          },
          count: { $sum: 1 }
        }
      }
    ]).toArray();
    const attendedMap = {};
    for (const a of attendedAgg) { if (a._id) attendedMap[a._id] = a.count; }

    const users = rawUsers.map(u => {
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
      const activity = isHost ? `${eventsHosted} Hosted` : eventsAttended > 0 ? `${eventsAttended} Attended` : "New User";

      const reputation = calculateReputation({
        rating,
        reviewsCount: stats.reviewsCount ?? 0,
        eventsHosted,
        eventsAttended,
        isBanned: moderation.isBanned ?? false,
        isSuspended: moderation.isSuspended ?? false,
      });

      const status = u.isDeleted ? "Inactive"
        : moderation.isBanned ? "Banned"
        : moderation.isSuspended ? "Suspended"
        : "Active";

      const name = `${profile.firstName || ''} ${profile.lastName || ''}`.trim()
        || profile.username || "User";

      const updatedAt = u.updatedAt || u.createdAt;
      const diff = Date.now() - (updatedAt ? new Date(updatedAt).getTime() : 0);
      const mins = Math.floor(diff / 60000), hours = Math.floor(diff / 3600000), days = Math.floor(diff / 86400000);
      const lastActive = mins < 60 ? `${mins}m ago` : hours < 24 ? `${hours}h ago` : `${days}d ago`;

      return {
        id: u._id?.toString(), clerkUserId: clerkId, name,
        username: profile.username ? `@${profile.username}` : `@user_${u._id?.toString().slice(-4)}`,
        joined: new Date(u.createdAt || Date.now()).toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        location: profile.location || profile.city || "India",
        type: userType, activity, lastActive, reputation, status,
        image: profile.imageUrl || profile.avatar ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff&size=128`,
        eventsHosted, eventsAttended,
        rating: stats.rating ?? 0,
        reviewsCount: stats.reviewsCount ?? 0,
        totalEarnings: stats.overallEarning ?? 0,
        isBanned: moderation.isBanned ?? false,
        isSuspended: moderation.isSuspended ?? false,
      };
    });

    res.json(users);
  } catch (err) {
    console.error("GET /users error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── GET /users/:id ──────────────────────────────────────────────────────────
app.get("/users/:id", async (req, res) => {
  try {
    if (!db) return res.status(500).json({ error: "DB not connected" });
    const { id } = req.params;
    let user = null;
    try { user = await db.collection("users").findOne({ _id: new ObjectId(id) }); } catch (_) {}
    if (!user) user = await db.collection("users").findOne({ clerkUserId: id });
    if (!user) return res.status(404).json({ error: "User not found" });
    const stats = await db.collection("user_stats").findOne({ clerkUserId: user.clerkUserId }) || {};
    const eventsCount = await db.collection("events").countDocuments({ creatorClerkId: user.clerkUserId });
    const recentEvents = await db.collection("events")
      .find({ creatorClerkId: user.clerkUserId })
      .sort({ createdAt: -1 }).limit(5).toArray();
    res.json({ user, stats, eventsCount, recentEvents: recentEvents.map(normalizeEvent) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GET /collections (debug) ────────────────────────────────────────────────
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

// ─── Health check ─────────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({ status: "ok", db: db ? "connected" : "disconnected", time: new Date().toISOString() });
});

connectDB().then(() => {
  app.listen(5006, () => {
    console.log("✅ Admin Dashboard Backend on http://localhost:5006");
    console.log("📡 Endpoints:");
    console.log("   GET  /health");
    console.log("   GET  /collections      ← debug: collections info");
    console.log("   GET  /events           ← all events (with aiAnalysis cache)");
    console.log("   GET  /events/:id       ← single event");
    console.log("   PATCH /events/:id/status ← approve/reject");
    console.log("   POST /analyze          ← AI (caches in MongoDB, force:true to re-analyze)");
    console.log("   GET  /users            ← real users from MongoDB");
    console.log("   GET  /users/:id        ← single user");
  });
});