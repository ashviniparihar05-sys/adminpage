// backend/server.js
// ✅ REFACTORED - Clean main entry point
// All logic moved to separate files in config/, services/, routes/, models/, utils/

// backend/
// ├── server.js                    ← 100 lines (NEW!)
// ├── server.OLD.js                ← 1000+ lines (backup)
// ├── config/
// │   ├── database.js              ← MongoDB connection
// │   ├── openai.js                ← OpenAI client
// │   └── bot.config.js            ← Bot settings + stats
// ├── services/
// │   ├── image-analysis.service.js  ← GPT-4o Vision
// │   ├── ai-analysis.service.js     ← Combined text+image
// │   ├── notification.service.js    ← Notifications
// │   └── bot.service.js             ← Main bot logic
// ├── routes/
// │   ├── events.routes.js         ← /events endpoints
// │   ├── services.routes.js       ← /services endpoints
// │   ├── users.routes.js          ← /users endpoints
// │   ├── payments.routes.js       ← /payments endpoints
// │   └── bot.routes.js            ← /bot endpoints
// ├── models/
// │   ├── event.normalizer.js      ← Event data transform
// │   └── service.normalizer.js    ← Service data transform
// ├── utils/
// │   ├── constants.js             ← App constants
// │   └── reputation.js            ← Reputation calc
// ├── package.json
// └── .env

// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import dns from "dns";

// // Config
// import { connectDB } from "./config/database.js";
// import { BOT_CONFIG } from "./config/bot.config.js";

// // Routes
// import eventsRouter from "./routes/events.routes.js";
// import servicesRouter from "./routes/services.routes.js";
// import usersRouter from "./routes/users.routes.js";
// import paymentsRouter from "./routes/payments.routes.js";
// import botRouter from "./routes/bot.routes.js";

// // Services
// import { startBackgroundBot } from "./services/bot.service.js";

// // Initialize
// dns.setDefaultResultOrder("ipv4first");
// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// // ═══════════════════════════════════════════════════════════════════════════════
// // ROUTES
// // ═══════════════════════════════════════════════════════════════════════════════

// app.use("/events", eventsRouter);
// app.use("/services", servicesRouter);
// app.use("/users", usersRouter);
// app.use("/payments", paymentsRouter);
// app.use("/bot", botRouter);

// // Special analyze endpoints (backward compatibility)
// app.post("/analyze", (req, res, next) => {
//   req.url = "/events/analyze";
//   eventsRouter(req, res, next);
// });
// app.post("/analyze-service", (req, res, next) => {
//   req.url = "/services/analyze";
//   servicesRouter(req, res, next);
// });

// // ═══════════════════════════════════════════════════════════════════════════════
// // DEBUG & HEALTH
// // ═══════════════════════════════════════════════════════════════════════════════

// app.get("/collections", async (req, res) => {
//   try {
//     const { getDB } = await import("./config/database.js");
//     const db = getDB();
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

// app.get("/health", (req, res) => {
//   res.json({
//     status: "ok",
//     db: "connected",
//     bot: {
//       enabled: BOT_CONFIG.ENABLED,
//       approveThreshold: BOT_CONFIG.APPROVE_THRESHOLD,
//       rejectThreshold: BOT_CONFIG.REJECT_THRESHOLD,
//     },
//     features: {
//       imageAnalysis: true,
//       imageModel: "gpt-4o-vision",
//       textModel: "gpt-4o-mini",
//       scoreFormula: "Text 75% + Image 25%",
//     },
//     time: new Date().toISOString(),
//   });
// });

// // ═══════════════════════════════════════════════════════════════════════════════
// // START SERVER
// // ═══════════════════════════════════════════════════════════════════════════════

// connectDB().then(() => {
//   app.listen(5006, () => {
//     console.log("\n✅ Admin Dashboard Backend on http://localhost:5006");
//     console.log("📡 Endpoints:");
//     console.log("   GET  /health");
//     console.log("   GET  /bot/status");
//     console.log("   POST /bot/trigger");
//     console.log("   GET  /collections");
//     console.log("   GET  /events");
//     console.log("   GET  /events/since");
//     console.log("   GET  /events/:id");
//     console.log("   PATCH /events/:id/status");
//     console.log("   POST /analyze");
//     console.log("   GET  /services");
//     console.log("   GET  /services/since");
//     console.log("   GET  /services/:id");
//     console.log("   PATCH /services/:id/status");
//     console.log("   POST /analyze-service");
//     console.log("   GET  /users");
//     console.log("   GET  /payments");
//     console.log("\n🖼️  Image Analysis: GPT-4o Vision");
//     console.log("   Score = Text × 75% + Image × 25%");
//     console.log("   Detects: irrelevant, NSFW, placeholder, suspicious text\n");
//   });

//   startBackgroundBot();
// });

// // backend/server.js
// // ✅ All existing endpoints (events, services, users, payments, analyze)
// // ✅ Background AI Bot — 24/7 autonomous moderation
// // ✅ NEW: Image Analysis via GPT-4o Vision
// //    - Image relevant hai event/service ke hisab se?
// //    - NSFW / violent / inappropriate content?
// //    - Placeholder / stock / broken image?
// //    - Suspicious overlaid text?
// // ✅ Combined risk score: Text (75%) + Image (25%)
// // ✅ imageAnalysis field MongoDB mein cache hoti hai

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
// let db, client;

// // ─── Bot Configuration ────────────────────────────────────────────────────────
// const BOT_APPROVE_THRESHOLD = parseInt(process.env.BOT_APPROVE_THRESHOLD || "30");
// const BOT_REJECT_THRESHOLD  = parseInt(process.env.BOT_REJECT_THRESHOLD  || "70");
// const BOT_INTERVAL_MS       = parseInt(process.env.BOT_INTERVAL_MINUTES  || "5") * 60 * 1000;
// const BOT_ENABLED           = process.env.BOT_ENABLED !== "false";

// const botStats = {
//   totalRuns: 0,
//   lastRunAt: null,
//   totalAnalyzed: 0,
//   totalApproved: 0,
//   totalRejected: 0,
//   totalNeedsReview: 0,
//   totalErrors: 0,
//   isRunning: false,
// };

// // ─── DB Connect ───────────────────────────────────────────────────────────────
// async function connectDB() {
//   try {
//     const dns = await import("dns/promises");
//     dns.setServers(["8.8.8.8", "1.1.1.1"]);
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
//     db = client.db("assis_auth");
//     console.log("✅ CONNECTED:", db.databaseName);
//     const collections = await db.listCollections().toArray();
//     console.log("📦 Collections:", collections.map((c) => c.name));
//   } catch (err) {
//     console.error("❌ DB CONNECT FAILED:", err.message);
//     process.exit(1);
//   }
// }

// // ─── Normalizers ──────────────────────────────────────────────────────────────
// function normalizeEvent(doc) {
//   let locationStr = "Location TBD";
//   if (doc.location) {
//     if (typeof doc.location === "object" && doc.location.formattedAddress) {
//       locationStr = doc.location.formattedAddress;
//     } else if (typeof doc.location === "object") {
//       locationStr =
//         doc.location.city ||
//         doc.location.address ||
//         `${doc.location.lat || ""}, ${doc.location.lng || ""}`;
//     } else {
//       locationStr = doc.location;
//     }
//   }
//   return {
//     id: doc._id?.toString() || doc.id || `EV-${Date.now()}`,
//     title: doc.title || "Untitled Event",
//     host: doc.host || doc.creatorName || doc.creatorClerkId ,
//     //hostVerified: doc.hostVerified || doc.isVerified || false,
//     image:
//       doc.image || doc.banner || doc.bannerUri || doc.imageUrl ||
//       "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600",
//     category: doc.category || doc.kind || "Other",
//     dateSubmitted: doc.createdAt || doc.dateSubmitted || new Date().toISOString(),
//     eventDate: doc.date || doc.eventDate || doc.startDate || "",
//     location: locationStr,
//     ticketPrice:
//       doc.kind === "free" ? "Free"
//       : doc.priceCents ? `₹${Math.round(doc.priceCents / 100)}`
//       : doc.ticketPrice || "Free",
//     capacity: doc.capacity || doc.attendance || 100,
//     description: doc.description || "No description provided.",
//     status: doc.admin_status || doc.moderationStatus || "pending",
//     attendeesCount: Array.isArray(doc.attendees) ? doc.attendees.length : 0,
//     aiAnalysis: doc.aiAnalysis || null,
//     creatorClerkId: doc.creatorClerkId || null,
//     kind: "event",
//   };
// }

// function normalizeService(doc) {
//   let locationStr = "Location TBD";
//   if (doc.location) {
//     if (typeof doc.location === "object" && doc.location.formattedAddress) {
//       locationStr = doc.location.formattedAddress;
//     } else if (typeof doc.location === "object") {
//       locationStr =
//         doc.location.city ||
//         doc.location.address ||
//         `${doc.location.lat || ""}, ${doc.location.lng || ""}`;
//     } else {
//       locationStr = doc.location;
//     }
//   }
//   let ticketPrice = "Free";
//   if (doc.priceCents && doc.priceCents > 0) {
//     ticketPrice = `₹${Math.round(doc.priceCents / 100)}`;
//     if (doc.rateType) ticketPrice += `/${doc.rateType}`;
//   }
//   const schedule = doc.serviceMetadata?.schedule || [];
//   const activeDays = schedule.filter((d) => d.active).map((d) => d.day);
//   const scheduleSummary = activeDays.length > 0 ? activeDays.join(", ") : "Schedule TBD";

//   return {
//     id: doc._id?.toString() || doc.id || `SV-${Date.now()}`,
//     title: doc.title || "Untitled Service",
//     host: doc.creatorName || doc.creatorClerkId || "Unknown Provider",
//     //hostVerified: doc.hostVerified || false,
//     image:
//       doc.bannerUri || doc.image || doc.imageUrl ||
//       "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600",
//     category: doc.category || "Service",
//     emoji: doc.emoji || "🛠️",
//     dateSubmitted: doc.createdAt || new Date().toISOString(),
//     location: locationStr,
//     ticketPrice,
//     rateType: doc.rateType || null,
//     capacity: doc.capacity || null,
//     description: doc.description || "No description provided.",
//     status: doc.admin_status || doc.moderationStatus || doc.status || "pending",
//     attendeesCount: Array.isArray(doc.attendees) ? doc.attendees.length : 0,
//     joinPolicy: doc.joinPolicy || "open",
//     scheduleSummary,
//     meetupStyle: doc.serviceMetadata?.meetupStyle || null,
//     minDuration: doc.serviceMetadata?.minDuration || null,
//     aiAnalysis: doc.aiAnalysis || null,
//     creatorClerkId: doc.creatorClerkId || null,
//     kind: "service",
//   };
// }

// // ═══════════════════════════════════════════════════════════════════════════════
// // 🖼️ IMAGE ANALYSIS — GPT-4o Vision
// // ═══════════════════════════════════════════════════════════════════════════════

// // Known generic/stock/placeholder image domains — vision call se skip karo
// const GENERIC_IMAGE_DOMAINS = [
//   "unsplash.com",
//   "placehold.co",
//   "picsum.photos",
//   "ui-avatars.com",
//   "via.placeholder.com",
//   "loremflickr.com",
//   "dummyimage.com",
//   "placeimg.com",
// ];

// // ─── analyzeImageWithAI ───────────────────────────────────────────────────────
// // GPT-4o Vision se image analyze karta hai
// // context = { title, category, description }
// // Returns: imageAnalysis object
// async function analyzeImageWithAI(imageUrl, context) {
//   // Case 1: No image URL
//   if (!imageUrl || !imageUrl.startsWith("http")) {
//     return {
//       checked: false,
//       reason: "No valid image URL provided",
//       flags: [{
//         type: "Missing Image",
//         description: "Event/service has no image uploaded. Original photos increase trust.",
//         severity: "medium",
//       }],
//       imageRiskScore: 30,
//       isRelevant: false,
//       isAppropriate: true,
//       isPlaceholder: true,
//     };
//   }

//   // Case 2: Known generic/stock/placeholder domain
//   const isGenericDomain = GENERIC_IMAGE_DOMAINS.some(domain => imageUrl.includes(domain));
//   if (isGenericDomain) {
//     const domainFound = GENERIC_IMAGE_DOMAINS.find(d => imageUrl.includes(d));
//     return {
//       checked: false,
//       reason: `Generic stock/placeholder image detected (${domainFound})`,
//       flags: [{
//         type: "Generic Placeholder Image",
//         description: `Image is from a stock/placeholder service (${domainFound}). Real events should have original photos specific to the event.`,
//         severity: "low",
//       }],
//       imageRiskScore: 15,
//       isRelevant: false,
//       isAppropriate: true,
//       isPlaceholder: true,
//     };
//   }

//   // Case 3: GPT-4o Vision analysis
//   try {
//     console.log(`  🖼️  Analyzing image: ${imageUrl.slice(0, 60)}...`);

//     const response = await openai.chat.completions.create({
//       model: "gpt-4o",
//       max_tokens: 500,
//       messages: [
//         {
//           role: "system",
//           content:
//             "You are a strict image moderation AI for an event platform. Analyze images objectively and return ONLY valid JSON. No preamble, no explanation — just JSON.",
//         },
//         {
//           role: "user",
//           content: [
//             {
//               type: "text",
//               text: `Analyze this image for event platform moderation.

// EVENT CONTEXT:
// Title: ${context.title || "N/A"}
// Category: ${context.category || "N/A"}
// Description: ${(context.description || "N/A").slice(0, 200)}

// Return ONLY this JSON (no backticks, no extra text):
// {
//   "isRelevant": <true if image matches event title/category, false if completely unrelated>,
//   "isAppropriate": <true if no NSFW/violent/drug/gore/explicit content, false otherwise>,
//   "isPlaceholder": <true if generic stock photo not specific to this event, false if original/specific>,
//   "imageRiskScore": <0-100, where 0=perfectly safe+relevant, 100=very risky>,
//   "relevanceNote": "<one sentence why relevant or not>",
//   "appropriatenessNote": "<describe any content concern, or write 'clean' if none>",
//   "placeholderNote": "<why it looks generic or original>",
//   "suspiciousText": "<any overlaid text like prices, phone numbers, links? describe exactly or write 'none'>",
//   "dominantContent": "<what is primarily shown in the image in 5-7 words>",
//   "flags": [{"type": "<short flag name>", "description": "<specific detail about this image>", "severity": "<low|medium|high>"}]
// }

// Scoring guide:
// 0-20   = Clean, relevant, original image
// 21-40  = Generic/stock but harmless
// 41-60  = Somewhat irrelevant or mildly concerning
// 61-80  = Clearly wrong image or moderately concerning content
// 81-100 = NSFW, violent, misleading, or highly suspicious`,
//             },
//             {
//               type: "image_url",
//               image_url: {
//                 url: imageUrl,
//                 detail: "low",
//               },
//             },
//           ],
//         },
//       ],
//     });

//     const raw = response.choices[0].message.content || "{}";
//     // Safe JSON parse — strip markdown code blocks if present
//     const cleaned = raw.replace(/```json|```/g, "").trim();
//     const parsed = JSON.parse(cleaned);

//     const imageRiskScore = Math.min(100, Math.max(0, parsed.imageRiskScore ?? 20));

//     console.log(
//       `  🖼️  Image result: score=${imageRiskScore} | relevant=${parsed.isRelevant} | appropriate=${parsed.isAppropriate} | placeholder=${parsed.isPlaceholder}`
//     );
//     if (parsed.dominantContent) {
//       console.log(`  🖼️  Dominant content: "${parsed.dominantContent}"`);
//     }

//     return {
//       checked: true,
//       imageRiskScore,
//       isRelevant: parsed.isRelevant ?? true,
//       isAppropriate: parsed.isAppropriate ?? true,
//       isPlaceholder: parsed.isPlaceholder ?? false,
//       relevanceNote: parsed.relevanceNote ?? "",
//       appropriatenessNote: parsed.appropriatenessNote ?? "clean",
//       placeholderNote: parsed.placeholderNote ?? "",
//       suspiciousText: parsed.suspiciousText ?? "none",
//       dominantContent: parsed.dominantContent ?? "",
//       flags: Array.isArray(parsed.flags) ? parsed.flags : [],
//     };
//   } catch (imgErr) {
//     // Image fetch fail, CORS, 404, etc.
//     console.warn(`  ⚠️  Image analysis failed: ${imgErr.message}`);
//     return {
//       checked: false,
//       reason: `Image could not be analyzed: ${imgErr.message}`,
//       flags: [{
//         type: "Image Load Failed",
//         description: `The image URL is inaccessible or returned an error. This may indicate a broken or fake image link.`,
//         severity: "medium",
//       }],
//       imageRiskScore: 25,
//       isRelevant: false,
//       isAppropriate: true,
//       isPlaceholder: false,
//     };
//   }
// }

// // ═══════════════════════════════════════════════════════════════════════════════
// // 🤖 AI ANALYSIS — Text + Image Combined
// // ═══════════════════════════════════════════════════════════════════════════════

// async function runAIAnalysis(item, collectionName) {
//   const isService = collectionName === "services";

//   // ── Build text prompt ──
//   const textPrompt = isService
//     ? `You are a strict AI moderation system for a service marketplace. Analyze this service listing and detect fraud, fake profiles, or risky content.

// SCORING RULES:
// - HIGH RISK (70-100): Vague description, suspicious pricing, fake-sounding profile, requests for advance payment outside platform, unrealistic claims, adult/illegal service hints
// - MEDIUM RISK (40-69):  minimal description, unusually high/low pricing, limited availability
// - LOW RISK (0-39): Clear description, reasonable pricing, professional tone, verifiable location, realistic schedule

// SERVICE LISTING:
// Title: ${item.title || "N/A"}
// Provider: ${item.host || "N/A"}
// Description: ${item.description || "N/A"}
// Price: ${item.ticketPrice || "N/A"}
// Rate Type: ${item.rateType || "N/A"}
// Location: ${item.location || "N/A"}
// Join Policy: ${item.joinPolicy || "N/A"}
// Availability: ${item.scheduleSummary || "N/A"}
// Meeting Style: ${item.meetupStyle || "N/A"}
// Min Duration: ${item.minDuration || "N/A"}

// Return ONLY valid JSON:
// {
//   "riskScore": <0-100>,
//   "riskLevel": "<low|medium|high|critical>",
//   "semanticIntegrity": <0-100>,
//   "hostLegitimacy": <0-100>,
//   "engagementPattern": <0-100>,
//   "flags": [{"type": "<name>", "description": "<specific reason>", "severity": "<low|medium|high>"}],
//   "summary": "<2-3 sentences about THIS service>",
//   "recommendation": "<one actionable sentence>"
// }`
//     : `You are a strict AI moderation system for an event platform. Analyze this event and detect fraud, scams, or risky content.

// SCORING RULES:
// - HIGH RISK (70-100): Vague details, suspicious payment, hidden location, unrealistic claims, drug references
// - MEDIUM RISK (40-69):  missing details, high price with few details
// - LOW RISK (0-39): Clear description, reasonable price, known venue, professional tone

// EVENT:
// Title: ${item.title || "N/A"}
// Host: ${item.host || "N/A"}
// Category: ${item.category || "N/A"}
// Description: ${item.description || "N/A"}
// Price: ${item.ticketPrice || "N/A"}
// Location: ${item.location || "N/A"}
// Capacity: ${item.capacity || "N/A"}

// Return ONLY valid JSON:
// {
//   "riskScore": <0-100>,
//   "riskLevel": "<low|medium|high|critical>",
//   "semanticIntegrity": <0-100>,
//   "hostLegitimacy": <0-100>,
//   "engagementPattern": <0-100>,
//   "flags": [{"type": "<name>", "description": "<specific reason>", "severity": "<low|medium|high>"}],
//   "summary": "<2-3 sentences about THIS event>",
//   "recommendation": "<one actionable sentence>"
// }`;

//   // ── Run text analysis + image analysis in PARALLEL ──
//   // Dono ek saath chalao — time bachega
//   const imageContext = {
//     title: item.title,
//     category: item.category,
//     description: item.description,
//   };

//   const [textResponse, imageAnalysis] = await Promise.all([
//     openai.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages: [
//         {
//           role: "system",
//           content:
//             "You are a fraud detection AI. Return valid JSON only. Vary scores based on actual content.",
//         },
//         { role: "user", content: textPrompt },
//       ],
//       temperature: 0.7,
//       response_format: { type: "json_object" },
//     }),
//     analyzeImageWithAI(item.image, imageContext),
//   ]);

//   // ── Parse text result ──
//   const parsed = JSON.parse(textResponse.choices[0].message.content || "{}");
//   const textRiskScore = Math.min(100, Math.max(0, parsed.riskScore ?? 50));
//   const imageRiskScore = imageAnalysis?.imageRiskScore ?? 0;

//   // ── Combined score: Text 75% + Image 25% ──
//   let combinedRiskScore = Math.round(textRiskScore * 0.75 + imageRiskScore * 0.25);

//   // Hard overrides:
//   // 1. NSFW / inappropriate image → minimum 75
//   if (imageAnalysis && imageAnalysis.isAppropriate === false) {
//     combinedRiskScore = Math.max(combinedRiskScore, 75);
//   }
//   // 2. Irrelevant image + medium-high text risk → +10
//   if (imageAnalysis && imageAnalysis.isRelevant === false && textRiskScore >= 50) {
//     combinedRiskScore = Math.min(100, combinedRiskScore + 10);
//   }
//   // 3. Suspicious text in image (phone numbers, external links, etc.) → +15
//   if (
//     imageAnalysis?.suspiciousText &&
//     imageAnalysis.suspiciousText !== "none" &&
//     imageAnalysis.suspiciousText.length > 4
//   ) {
//     combinedRiskScore = Math.min(100, combinedRiskScore + 15);
//   }

//   combinedRiskScore = Math.min(100, Math.max(0, combinedRiskScore));

//   // ── Risk level from combined score ──
//   let combinedRiskLevel;
//   if (combinedRiskScore >= 75) combinedRiskLevel = "critical";
//   else if (combinedRiskScore >= 55) combinedRiskLevel = "high";
//   else if (combinedRiskScore >= 35) combinedRiskLevel = "medium";
//   else combinedRiskLevel = "low";

//   // ── Merge flags: text + image ──
//   const textFlags = Array.isArray(parsed.flags) ? parsed.flags : [];
//   const imageFlags = (imageAnalysis?.flags || []).map((f) => ({
//     ...f,
//     type: `[Image] ${f.type}`,
//     source: "image",
//   }));
//   const allFlags = [...textFlags, ...imageFlags];

//   // ── Image summary note to append to main summary ──
//   let imageSummaryNote = "";
//   if (imageAnalysis) {
//     if (!imageAnalysis.isAppropriate) {
//       imageSummaryNote = ` ⚠️ Image contains inappropriate/NSFW content: ${imageAnalysis.appropriatenessNote}.`;
//     } else if (
//       imageAnalysis.suspiciousText &&
//       imageAnalysis.suspiciousText !== "none" &&
//       imageAnalysis.suspiciousText.length > 4
//     ) {
//       imageSummaryNote = ` Suspicious text detected in image: "${imageAnalysis.suspiciousText}".`;
//     } else if (!imageAnalysis.isRelevant && imageAnalysis.checked) {
//       imageSummaryNote = ` The uploaded image does not match the event — ${imageAnalysis.relevanceNote}`;
//     } else if (imageAnalysis.isPlaceholder && !imageAnalysis.checked) {
//       imageSummaryNote = " Event uses a generic stock/placeholder image.";
//     } else if (!imageAnalysis.checked && imageAnalysis.reason) {
//       imageSummaryNote = ` Image issue: ${imageAnalysis.reason}.`;
//     }
//   }

//   console.log(
//     `  📊 Text: ${textRiskScore} | Image: ${imageRiskScore} | Combined: ${combinedRiskScore} (${combinedRiskLevel.toUpperCase()})`
//   );
//   if (imageSummaryNote) {
//     console.log(`  🖼️  ${imageSummaryNote.trim()}`);
//   }

//   return {
//     // ── Core fields (same as before — frontend compatible) ──
//     riskScore: combinedRiskScore,
//     riskLevel: combinedRiskLevel,
//     semanticIntegrity: Math.min(100, Math.max(0, parsed.semanticIntegrity ?? 80)),
//     hostLegitimacy: Math.min(100, Math.max(0, parsed.hostLegitimacy ?? 80)),
//     engagementPattern: Math.min(100, Math.max(0, parsed.engagementPattern ?? 80)),
//     flags: allFlags,
//     summary: (parsed.summary ?? "Analysis complete.") + imageSummaryNote,
//     recommendation: parsed.recommendation ?? "Manual review recommended.",
//     scannedAt: new Date().toISOString(),

//     // ── NEW: Image analysis (frontend pe separately show karo) ──
//     imageAnalysis: {
//       imageUrl: item.image || null,
//       checked: imageAnalysis?.checked ?? false,
//       imageRiskScore,
//       isRelevant: imageAnalysis?.isRelevant ?? null,
//       isAppropriate: imageAnalysis?.isAppropriate ?? null,
//       isPlaceholder: imageAnalysis?.isPlaceholder ?? null,
//       relevanceNote: imageAnalysis?.relevanceNote ?? "",
//       appropriatenessNote: imageAnalysis?.appropriatenessNote ?? "",
//       placeholderNote: imageAnalysis?.placeholderNote ?? "",
//       suspiciousText: imageAnalysis?.suspiciousText ?? "none",
//       dominantContent: imageAnalysis?.dominantContent ?? "",
//       reason: imageAnalysis?.reason ?? null,
//     },

//     // ── Score breakdown ──
//     scoreBreakdown: {
//       textRiskScore,
//       imageRiskScore,
//       combinedNote: `Text: ${textRiskScore} × 75% + Image: ${imageRiskScore} × 25% = ${combinedRiskScore}`,
//     },
//   };
// }

// // ─── Save notification helper ──────────────────────────────────────────────────
// // async function saveNotification(
// //   creatorClerkId,
// //   type,
// //   itemId,
// //   itemTitle,
// //   message,
// //   moderatorNote = null
// //   , flags = []           // ← NEW
// // ) {

// // REPLACE karo with:
// async function saveNotification(
//   creatorClerkId,
//   type,
//   itemId,
//   itemTitle,
//   message,
//   moderatorNote = null,
//   flags = [],
//   approvalStatus = null,
//   riskScore = null,
// ) {
//   try {
//     await db.collection("notifications").insertOne({
//       recipientClerkId: creatorClerkId,
//       type,
//       eventId: type.startsWith("event") ? itemId : null,
//       serviceId: type.startsWith("service") ? itemId : null,
//       eventTitle: itemTitle,
//       message,
//       moderatorNote,
//       flags,
//       approvalStatus,
//       riskScore,
//       read: false,
//       createdAt: new Date(),
//       sentByBot: true,
//     });
//     console.log(`  🔔 Notification → ${creatorClerkId}`);
//   } catch (err) {
//     console.warn(`  ⚠️ Notification failed: ${err.message}`);
//   }
// }

// // ─── Process single item (event or service) ────────────────────────────────────
// async function processItem(rawDoc, collectionName) {
//   const isService = collectionName === "services";
//   const item = isService ? normalizeService(rawDoc) : normalizeEvent(rawDoc);
//   const itemId = item.id;
//   const mongoId = rawDoc._id;

//   console.log(`  📋 [${collectionName.toUpperCase()}] "${item.title}" (${itemId})`);

//   // Cache check — agar already analyzed hai toh skip (OpenAI call nahi)
//   if (rawDoc.aiAnalysis?.riskScore !== undefined) {
//     console.log(
//       `  📦 Cache found (score: ${rawDoc.aiAnalysis.riskScore}) — skipping OpenAI`
//     );
//     const currentStatus =
//       rawDoc.admin_status || rawDoc.moderationStatus || rawDoc.status || "pending";
//     if (currentStatus === "pending" || currentStatus === "flagged") {
//       await applyDecision(rawDoc.aiAnalysis, mongoId, itemId, item, collectionName);
//       return rawDoc.aiAnalysis.riskScore >= BOT_REJECT_THRESHOLD
//         ? "rejected"
//         : rawDoc.aiAnalysis.riskScore <= BOT_APPROVE_THRESHOLD
//         ? "approved"
//         : "needs_review";
//     }
//     return "cached";
//   }

//   // Fresh AI analysis (text + image)
//   console.log(`  🤖 Calling OpenAI (text + image)...`);
//   const analysis = await runAIAnalysis(item, collectionName);
//   console.log(
//     `  📊 Score: ${analysis.riskScore}/100 (${analysis.riskLevel.toUpperCase()})`
//   );

//   // Save to MongoDB
//   try {
//     await db
//       .collection(collectionName)
//       .updateOne(
//         { _id: mongoId },
//         { $set: { aiAnalysis: analysis, updatedAt: new Date() } }
//       );
//     console.log(`  💾 Cached in MongoDB (with image analysis)`);
//   } catch (saveErr) {
//     console.warn(`  ⚠️ Cache save failed: ${saveErr.message}`);
//   }

//   return await applyDecision(analysis, mongoId, itemId, item, collectionName);
// }

// // ─── Apply decision ────────────────────────────────────────────────────────────
// // ─── Apply decision ────────────────────────────────────────────────────────────
// async function applyDecision(analysis, mongoId, itemId, item, collectionName) {
//   const score = analysis.riskScore;
//   const isService = collectionName === "services";
//   let decision;

//   // ── Improvement suggestions banao image + flags se ──
//   function buildImprovementNote(flags, imageAnalysis) {
//     const suggestions = [];
//     if (imageAnalysis) {
//       if (imageAnalysis.isPlaceholder) {
//         suggestions.push("📸 Replace the placeholder/stock image with an original photo of your actual event or service.");
//       }
//       if (imageAnalysis.checked && !imageAnalysis.isRelevant) {
//         suggestions.push(`🖼️ Your image doesn't match the event — ${imageAnalysis.relevanceNote || "please upload a relevant photo."}`);
//       }
//       if (imageAnalysis.checked && imageAnalysis.imageRiskScore > 20 && imageAnalysis.placeholderNote) {
//         suggestions.push(`📷 Image tip: ${imageAnalysis.placeholderNote}`);
//       }
//     }
//     for (const flag of (flags || [])) {
//       if (flag.severity === "low" || flag.severity === "medium") {
//         suggestions.push(`• ${flag.type}: ${flag.description}`);
//       }
//     }
//     return suggestions.length > 0 ? suggestions.join("\n") : null;
//   }

//   // ══════════════════════════════════════
//   // CASE 1: LOW RISK — AUTO APPROVE
//   // ══════════════════════════════════════
//   if (score <= BOT_APPROVE_THRESHOLD) {
//     decision = "approved";
//     await db.collection(collectionName).updateOne(
//       { _id: mongoId },
//       {
//         $set: {
//           admin_status: "approved",
//           moderationStatus: "approved",
//           updatedAt: new Date(),
//           isApproved: true,
//           isActive: true,
//           ...(isService ? { status: "active" } : { isListed: true }),
//           botDecision: { action: "approved", score, at: new Date() },
//         },
//       }
//     );
//     console.log(`  ✅ AUTO-APPROVED (score ${score} ≤ ${BOT_APPROVE_THRESHOLD})`);

//     if (item.creatorClerkId) {
//       const improvementNote = buildImprovementNote(analysis.flags, analysis.imageAnalysis);
//       const warningFlags = (analysis.flags || []).filter(f => f.severity === "low" || f.severity === "medium");
//       await saveNotification(
//         item.creatorClerkId,
//         isService ? "service_approved" : "event_approved",
//         itemId,
//         item.title,
//         `Your ${isService ? "service" : "event"} "${item.title}" has been approved and is now live on MyApp! 🎉`,
//         improvementNote,
//         warningFlags,
//         "approved",
//         score
//       );
//     }
//   }

//   // ══════════════════════════════════════
//   // CASE 2: MEDIUM RISK — APPROVE WITH WARNINGS
//   // ══════════════════════════════════════
//   else if (score > BOT_APPROVE_THRESHOLD && score < BOT_REJECT_THRESHOLD) {
//     decision = "needs_review";
//     await db.collection(collectionName).updateOne(
//       { _id: mongoId },
//       {
//         $set: {
//           admin_status: "approved",
//           moderationStatus: "approved",
//           updatedAt: new Date(),
//           isApproved: true,
//           isActive: true,
//           ...(isService ? { status: "active" } : { isListed: true }),
//           botDecision: { action: "approved_with_warnings", score, at: new Date() },
//           internalFlag: "needs_improvement",
//         },
//       }
//     );
//     console.log(`  🟡 APPROVED WITH WARNINGS (score ${score} — medium risk)`);

//     if (item.creatorClerkId) {
//       const improvementNote = buildImprovementNote(analysis.flags, analysis.imageAnalysis);
//       const mediumFlags = (analysis.flags || []).filter(f => f.severity !== "high");
//       await saveNotification(
//         item.creatorClerkId,
//         isService ? "service_approved" : "event_approved",
//         itemId,
//         item.title,
//         `Your ${isService ? "service" : "event"} "${item.title}" is live! But please fix these issues to avoid rejection in future.`,
//         improvementNote,
//         mediumFlags,
//         "approved_with_warnings",
//         score
//       );
//     }
//   }

//   // ══════════════════════════════════════
//   // CASE 3: HIGH RISK — REJECT
//   // ══════════════════════════════════════
//   else {
//     decision = "rejected";
//     const moderatorNote = `AI Risk Score: ${score}/100 — ${analysis.summary} ${analysis.recommendation}`;
//     await db.collection(collectionName).updateOne(
//       { _id: mongoId },
//       {
//         $set: {
//           admin_status: "rejected",
//           moderationStatus: "rejected",
//           updatedAt: new Date(),
//           isApproved: false,
//           isActive: false,
//           ...(isService ? { status: "paused" } : { isListed: false }),
//           botDecision: { action: "rejected", score, at: new Date() },
//           moderatorNote,
//         },
//       }
//     );
//     console.log(`  ❌ AUTO-REJECTED (score ${score} ≥ ${BOT_REJECT_THRESHOLD})`);

//     if (item.creatorClerkId) {
//       await saveNotification(
//         item.creatorClerkId,
//         isService ? "service_rejected" : "event_rejected",
//         itemId,
//         item.title,
//         `Your ${isService ? "service" : "event"} "${item.title}" was rejected.`,
//         moderatorNote,
//         analysis.flags || [],
//         "rejected",
//         score
//       );
//     }
//   }

//   return decision;
// }
// // ─── Main Bot Loop ─────────────────────────────────────────────────────────────
// // ─── Main Bot Loop ─────────────────────────────────────────────────────────────
// async function runBotCycle() {
//   if (!db) {
//     console.log("⏳ Bot: DB not ready, retrying...");
//     setTimeout(runBotCycle, 10000);
//     return;
//   }
//   if (botStats.isRunning) {
//     console.log("⏳ Bot: Previous cycle still running, skipping...");
//     setTimeout(runBotCycle, BOT_INTERVAL_MS);
//     return;
//   }

//   botStats.isRunning = true;
//   botStats.totalRuns++;
//   botStats.lastRunAt = new Date().toISOString();
//   const runStart = Date.now();

//   console.log("\n" + "═".repeat(60));
//   console.log(
//     `🤖 BOT CYCLE #${botStats.totalRuns} — ${new Date().toLocaleString("en-IN")}`
//   );
//   console.log(
//     `   Settings: approve≤${BOT_APPROVE_THRESHOLD}% | reject≥${BOT_REJECT_THRESHOLD}% | interval=${BOT_INTERVAL_MS / 60000}min`
//   );
//   console.log("═".repeat(60));

//   let cycleAnalyzed = 0,
//     cycleApproved = 0,
//     cycleRejected = 0,
//     cycleNeedsReview = 0,
//     cycleErrors = 0;

//   try {
//     const pendingEvents = await db
//       .collection("events")
//       .find({
//         $or: [
//           { admin_status: "pending" },
//           {
//             admin_status: { $exists: false },
//             moderationStatus: { $exists: false },
//           },
//         ],
//       })
//       .limit(50)
//       .toArray();

//     const pendingServices = await db
//       .collection("services")
//       .find({
//         $or: [
//           { admin_status: "pending" },
//           {
//             admin_status: { $exists: false },
//             moderationStatus: { $exists: false },
//           },
//           { status: "pending" },
//         ],
//       })
//       .limit(50)
//       .toArray();

//     const totalToProcess = pendingEvents.length + pendingServices.length;
//     console.log(
//       `📋 Found: ${pendingEvents.length} events + ${pendingServices.length} services to process`
//     );

//     if (totalToProcess === 0) {
//       console.log("✨ Nothing to process — all items are up to date!");
//       botStats.isRunning = false;
//       setTimeout(runBotCycle, BOT_INTERVAL_MS);
//       return;
//     }

//     if (pendingEvents.length > 0) {
//       console.log(`\n📅 Processing ${pendingEvents.length} EVENTS...`);
//       for (const eventDoc of pendingEvents) {
//         try {
//           const result = await processItem(eventDoc, "events");
//           cycleAnalyzed++;
//           if (result === "approved") cycleApproved++;
//           else if (result === "rejected") cycleRejected++;
//           else if (result === "needs_review") cycleNeedsReview++;
//           await new Promise((r) => setTimeout(r, 1500)); // slightly longer delay for vision calls
//         } catch (err) {
//           cycleErrors++;
//           console.error(`  ❌ Error: ${err.message}`);
//         }
//       }
//     }

//     if (pendingServices.length > 0) {
//       console.log(`\n🔧 Processing ${pendingServices.length} SERVICES...`);
//       for (const serviceDoc of pendingServices) {
//         try {
//           const result = await processItem(serviceDoc, "services");
//           cycleAnalyzed++;
//           if (result === "approved") cycleApproved++;
//           else if (result === "rejected") cycleRejected++;
//           else if (result === "needs_review") cycleNeedsReview++;
//           await new Promise((r) => setTimeout(r, 1500));
//         } catch (err) {
//           cycleErrors++;
//           console.error(`  ❌ Error: ${err.message}`);
//         }
//       }
//     }

//     botStats.totalAnalyzed += cycleAnalyzed;
//     botStats.totalApproved += cycleApproved;
//     botStats.totalRejected += cycleRejected;
//     botStats.totalNeedsReview += cycleNeedsReview;
//     botStats.totalErrors += cycleErrors;

//     const elapsed = Math.round((Date.now() - runStart) / 1000);

//     try {
//       await db.collection("bot_logs").insertOne({
//         runNumber: botStats.totalRuns,
//         ranAt: new Date(),
//         durationSec: elapsed,
//         analyzed: cycleAnalyzed,
//         approved: cycleApproved,
//         rejected: cycleRejected,
//         needsReview: cycleNeedsReview,
//         errors: cycleErrors,
//       });
//     } catch (_) {}

//     console.log("\n" + "─".repeat(60));
//     console.log(`📊 CYCLE #${botStats.totalRuns} COMPLETE (${elapsed}s)`);
//     console.log(
//       `   ✅ Approved: ${cycleApproved} | ❌ Rejected: ${cycleRejected} | 🟡 Review: ${cycleNeedsReview} | ⚠️ Errors: ${cycleErrors}`
//     );
//     console.log(
//       `   📈 All-time: Approved=${botStats.totalApproved} | Rejected=${botStats.totalRejected} | Total=${botStats.totalAnalyzed}`
//     );
//     console.log(`   ⏰ Next run in ${BOT_INTERVAL_MS / 60000} minutes...`);
//     console.log("─".repeat(60) + "\n");
//   } catch (err) {
//     console.error(`❌ BOT CYCLE ERROR: ${err.message}`);
//     botStats.totalErrors++;
//   } finally {
//     botStats.isRunning = false;
//     setTimeout(runBotCycle, BOT_INTERVAL_MS);
//   }
// }

// // ─── Start Background Bot ──────────────────────────────────────────────────────
// function startBackgroundBot() {
//   if (!BOT_ENABLED) {
//     console.log("⏸ Background bot is DISABLED (BOT_ENABLED=false in .env)");
//     return;
//   }
//   console.log("\n" + "🤖".repeat(20));
//   console.log("🤖 BACKGROUND BOT STARTING (with Image Analysis)...");
//   console.log(`   ✅ Auto-approve if risk ≤ ${BOT_APPROVE_THRESHOLD}%`);
//   console.log(`   ❌ Auto-reject if risk ≥ ${BOT_REJECT_THRESHOLD}%`);
//   console.log(`   🟡 Needs review: ${BOT_APPROVE_THRESHOLD}% - ${BOT_REJECT_THRESHOLD}%`);
//   console.log(`   ⏱  Runs every ${BOT_INTERVAL_MS / 60000} minutes`);
//   console.log(`   🖼️  Image analysis: GPT-4o Vision (text 75% + image 25%)`);
//   console.log(`   💾 Results cached in MongoDB`);
//   console.log("🤖".repeat(20) + "\n");
//   setTimeout(runBotCycle, 10000);
// }

// // ═══════════════════════════════════════════════════════════════════════════════
// // EVENT ENDPOINTS
// // ═══════════════════════════════════════════════════════════════════════════════

// app.get("/events", async (req, res) => {
//   try {
//     if (!db) return res.status(500).json({ error: "DB not connected" });
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

// // ✅ NEW: Only events created after a given timestamp — for auto-refresh polling
// app.get("/events/since", async (req, res) => {
//   try {
//     if (!db) return res.status(500).json({ error: "DB not connected" });
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

// app.get("/events/:id", async (req, res) => {
//   try {
//     if (!db) return res.status(500).json({ error: "DB not connected" });
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

// app.get("/events/:id/creator-email", async (req, res) => {
//   try {
//     if (!db) return res.status(500).json({ error: "DB not connected" });
//     const { id } = req.params;
//     let eventDoc = null;
//     try {
//       eventDoc = await db
//         .collection("events")
//         .findOne(
//           { _id: new ObjectId(id) },
//           { projection: { creatorClerkId: 1, title: 1 } }
//         );
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

// app.patch("/events/:id/status", async (req, res) => {
//   try {
//     if (!db) return res.status(500).json({ error: "DB not connected" });
//     const { id } = req.params;
//     const { status, moderatorNote } = req.body;
//     const validStatuses = [
//       "approved",
//       "rejected",
//       "pending",
//       "flagged",
//       "under_review",
//     ];
//     if (!validStatuses.includes(status))
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
//       result = await db
//         .collection("events")
//         .updateOne({ id }, { $set: updateData });
//     }
//     if (result.matchedCount === 0)
//       return res.status(404).json({ error: "Event not found" });

//     if (status === "approved" || status === "rejected") {
//       try {
//         let eventDoc = null;
//         try {
//           eventDoc = await db
//             .collection("events")
//             .findOne(
//               { _id: new ObjectId(id) },
//               { projection: { creatorClerkId: 1, title: 1 } }
//             );
//         } catch (_) {}
//         if (!eventDoc)
//           eventDoc = await db
//             .collection("events")
//             .findOne({ id }, { projection: { creatorClerkId: 1, title: 1 } });
//        if (eventDoc?.creatorClerkId) {
//           // Event ka aiAnalysis fetch karo warnings ke liye
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

//           // Improvement suggestions banao
//           const suggestions = [];
//           if (aiAnalysis?.imageAnalysis) {
//             if (aiAnalysis.imageAnalysis.isPlaceholder) {
//               suggestions.push("📸 Replace placeholder image with original photo.");
//             }
//             if (aiAnalysis.imageAnalysis.checked && !aiAnalysis.imageAnalysis.isRelevant) {
//               suggestions.push(`🖼️ Image doesn't match event — ${aiAnalysis.imageAnalysis.relevanceNote || "upload relevant photo."}`);
//             }
//           }
//           for (const flag of flags) {
//             if (flag.severity === "low" || flag.severity === "medium") {
//               suggestions.push(`• ${flag.type}: ${flag.description}`);
//             }
//           }
//           const improvementNote = suggestions.length > 0 ? suggestions.join("\n") : (moderatorNote || null);

//           // approvalStatus decide karo
//           const approvalStatus = (riskScore !== null && riskScore > 30 && status === "approved")
//             ? "approved_with_warnings"
//             : status === "approved" ? "approved" : "rejected";

//           const warningFlags = flags.filter(f => f.severity !== "high");

//           await db.collection("notifications").insertOne({
//             recipientClerkId: eventDoc.creatorClerkId,
//             type: status === "approved" ? "event_approved" : "event_rejected",
//             eventId: id,
//             eventTitle: eventDoc.title || "Your event",
//             message: status === "approved"
//               ? `Your event "${eventDoc.title}" is approved and live on MyApp!`
//               : `Your event "${eventDoc.title}" was rejected.`,
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

// // ─── POST /analyze — Manual event analysis (with image) ───────────────────────
// app.post("/analyze", async (req, res) => {
//   try {
//     const { event, force } = req.body;
//     if (!event) return res.status(400).json({ error: "No event data provided" });

//     // Cache check
//     if (!force && event.id && db) {
//       let existingDoc = null;
//       try {
//         existingDoc = await db
//           .collection("events")
//           .findOne({ _id: new ObjectId(event.id) });
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
//     if (event.id && db) {
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
//             .updateOne(
//               { id: event.id },
//               { $set: { aiAnalysis: result, updatedAt: new Date() } }
//             );
//         }
//         if (sr.matchedCount > 0)
//           console.log(`💾 Event AI cached: "${event.title}"`);
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

// // ═══════════════════════════════════════════════════════════════════════════════
// // SERVICE ENDPOINTS
// // ═══════════════════════════════════════════════════════════════════════════════

// app.get("/services", async (req, res) => {
//   try {
//     if (!db) return res.status(500).json({ error: "DB not connected" });
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

// // ✅ NEW: Services since timestamp
// app.get("/services/since", async (req, res) => {
//   try {
//     if (!db) return res.status(500).json({ error: "DB not connected" });
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

// app.get("/services/:id", async (req, res) => {
//   try {
//     if (!db) return res.status(500).json({ error: "DB not connected" });
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

// app.get("/services/:id/creator-email", async (req, res) => {
//   try {
//     if (!db) return res.status(500).json({ error: "DB not connected" });
//     const { id } = req.params;
//     let serviceDoc = null;
//     try {
//       serviceDoc = await db
//         .collection("services")
//         .findOne(
//           { _id: new ObjectId(id) },
//           { projection: { creatorClerkId: 1, title: 1 } }
//         );
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

// app.patch("/services/:id/status", async (req, res) => {
//   try {
//     if (!db) return res.status(500).json({ error: "DB not connected" });
//     const { id } = req.params;
//     const { status, moderatorNote } = req.body;
//     const validStatuses = [
//       "approved",
//       "rejected",
//       "pending",
//       "flagged",
//       "under_review",
//     ];
//     if (!validStatuses.includes(status))
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
//       result = await db
//         .collection("services")
//         .updateOne({ id }, { $set: updateData });
//     }
//     if (result.matchedCount === 0)
//       return res.status(404).json({ error: "Service not found" });

//     if (status === "approved" || status === "rejected") {
//       try {
//         let serviceDoc = null;
//         try {
//           serviceDoc = await db
//             .collection("services")
//             .findOne(
//               { _id: new ObjectId(id) },
//               { projection: { creatorClerkId: 1, title: 1 } }
//             );
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

// // ─── POST /analyze-service — Manual service analysis (with image) ──────────────
// app.post("/analyze-service", async (req, res) => {
//   try {
//     const { service, force } = req.body;
//     if (!service)
//       return res.status(400).json({ error: "No service data provided" });

//     if (!force && service.id && db) {
//       let existingDoc = null;
//       try {
//         existingDoc = await db
//           .collection("services")
//           .findOne({ _id: new ObjectId(service.id) });
//       } catch (_) {
//         existingDoc = await db
//           .collection("services")
//           .findOne({ id: service.id });
//       }
//       if (existingDoc?.aiAnalysis?.riskScore !== undefined) {
//         console.log(`📦 SERVICE CACHE HIT: "${service.title}"`);
//         return res.json({ ...existingDoc.aiAnalysis, fromCache: true });
//       }
//     }

//     console.log(`🤖 Analyzing SERVICE (text + image): "${service.title}"`);
//     const result = await runAIAnalysis(service, "services");

//     if (service.id && db) {
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
//         if (sr.matchedCount > 0)
//           console.log(`💾 Service AI cached: "${service.title}"`);
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

// // ═══════════════════════════════════════════════════════════════════════════════
// // USER ENDPOINTS
// // ═══════════════════════════════════════════════════════════════════════════════

// function calculateReputation({
//   rating = 0,
//   reviewsCount = 0,
//   eventsHosted = 0,
//   eventsAttended = 0,
//   isBanned = false,
//   isSuspended = false,
// }) {
//   let score = 0;
//   if (rating > 0)
//     score += (rating / 5) * 40 + Math.min(10, reviewsCount * 0.5);
//   score += Math.min(25, eventsHosted * 2.5);
//   score += Math.min(15, eventsAttended * 1.5);
//   const total = eventsHosted + eventsAttended;
//   if (total > 20) score += 10;
//   else if (total > 10) score += 5;
//   if (isSuspended) score -= 20;
//   if (isBanned) score -= 50;
//   return Math.max(0, Math.min(100, Math.round(score)));
// }

// app.get("/users", async (req, res) => {
//   try {
//     if (!db) return res.status(500).json({ error: "DB not connected" });
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
//       const userType =
//         isHost && isAttendee ? "Both" : isHost ? "Host" : "User";
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
//         mins < 60
//           ? `${mins}m ago`
//           : hours < 24
//           ? `${hours}h ago`
//           : `${days}d ago`;
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
//       };
//     });
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.get("/users/:id", async (req, res) => {
//   try {
//     if (!db) return res.status(500).json({ error: "DB not connected" });
//     const { id } = req.params;
//     let user = null;
//     try {
//       user = await db.collection("users").findOne({ _id: new ObjectId(id) });
//     } catch (_) {}
//     if (!user)
//       user = await db.collection("users").findOne({ clerkUserId: id });
//     if (!user) return res.status(404).json({ error: "User not found" });
//     const stats =
//       (await db
//         .collection("user_stats")
//         .findOne({ clerkUserId: user.clerkUserId })) || {};
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

// // ═══════════════════════════════════════════════════════════════════════════════
// // PAYMENT ENDPOINTS
// // ═══════════════════════════════════════════════════════════════════════════════

// app.get("/payments", async (req, res) => {
//   try {
//     if (!db) return res.status(500).json({ error: "DB not connected" });
//     const rawPayments = await db
//       .collection("payments")
//       .find({})
//       .sort({ createdAt: -1 })
//       .limit(200)
//       .toArray();
//     const bookingIds = rawPayments.map((p) => p.bookingId).filter(Boolean);
//     const bookingsMap = new Map();
//     if (bookingIds.length > 0) {
//       const bookings = await db
//         .collection("bookings")
//         .find({
//           _id: {
//             $in: bookingIds.map((id) => {
//               try {
//                 return new ObjectId(id);
//               } catch {
//                 return id;
//               }
//             }),
//           },
//         })
//         .toArray();
//       for (const b of bookings) {
//         bookingsMap.set(b._id.toString(), {
//           eventTitle: b.eventTitle || b.serviceTitle || null,
//         });
//       }
//     }
//     res.json(
//       rawPayments.map((p) => ({
//         id: p._id.toString(),
//         bookingId: p.bookingId || null,
//         razorpayOrderId: p.razorpayOrderId || null,
//         razorpayPaymentId: p.razorpayPaymentId || null,
//         amount: p.amount || 0,
//         currency: p.currency || "INR",
//         type: p.type || "booking",
//         status: p.status || "pending",
//         // verifiedAt: p.verifiedAt || null,
//         createdAt: p.createdAt
//           ? new Date(p.createdAt).toISOString()
//           : new Date().toISOString(),
//         eventTitle:
//           bookingsMap.get(String(p.bookingId || ""))?.eventTitle || null,
//       }))
//     );
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.get("/payments/:id", async (req, res) => {
//   try {
//     if (!db) return res.status(500).json({ error: "DB not connected" });
//     const { id } = req.params;
//     let payment = null;
//     try {
//       payment = await db
//         .collection("payments")
//         .findOne({ _id: new ObjectId(id) });
//     } catch (_) {}
//     if (!payment)
//       payment = await db
//         .collection("payments")
//         .findOne({ razorpayPaymentId: id });
//     if (!payment) return res.status(404).json({ error: "Payment not found" });
//     res.json({ ...payment, id: payment._id.toString() });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // ═══════════════════════════════════════════════════════════════════════════════
// // BOT STATUS ENDPOINTS
// // ═══════════════════════════════════════════════════════════════════════════════

// app.get("/bot/status", async (req, res) => {
//   try {
//     let recentLogs = [];
//     if (db) {
//       recentLogs = await db
//         .collection("bot_logs")
//         .find({})
//         .sort({ ranAt: -1 })
//         .limit(10)
//         .toArray();
//     }
//     res.json({
//       enabled: BOT_ENABLED,
//       isRunning: botStats.isRunning,
//       config: {
//         approveThreshold: BOT_APPROVE_THRESHOLD,
//         rejectThreshold: BOT_REJECT_THRESHOLD,
//         intervalMinutes: BOT_INTERVAL_MS / 60000,
//       },
//       stats: botStats,
//       recentLogs: recentLogs.map((l) => ({
//         runNumber: l.runNumber,
//         ranAt: l.ranAt,
//         durationSec: l.durationSec,
//         analyzed: l.analyzed,
//         approved: l.approved,
//         rejected: l.rejected,
//         needsReview: l.needsReview,
//         errors: l.errors,
//       })),
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.post("/bot/trigger", async (req, res) => {
//   if (!BOT_ENABLED) return res.status(400).json({ error: "Bot is disabled" });
//   if (botStats.isRunning)
//     return res.status(400).json({ error: "Bot already running" });
//   res.json({ message: "Bot cycle triggered" });
//   runBotCycle();
// });

// // ─── Debug + Health ───────────────────────────────────────────────────────────
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

// app.get("/health", (req, res) => {
//   res.json({
//     status: "ok",
//     db: db ? "connected" : "disconnected",
//     bot: {
//       enabled: BOT_ENABLED,
//       running: botStats.isRunning,
//       totalRuns: botStats.totalRuns,
//       lastRunAt: botStats.lastRunAt,
//     },
//     features: {
//       imageAnalysis: true,
//       imageModel: "gpt-4o-vision",
//       textModel: "gpt-4o-mini",
//       scoreFormula: "Text 75% + Image 25%",
//     },
//     time: new Date().toISOString(),
//   });
// });

// // ═══════════════════════════════════════════════════════════════════════════════
// // START SERVER + BOT
// // ═══════════════════════════════════════════════════════════════════════════════
// connectDB().then(() => {
//   app.listen(5006, () => {
//     console.log("\n✅ Admin Dashboard Backend on http://localhost:5006");
//     console.log("📡 Endpoints:");
//     console.log("   GET  /health");
//     console.log("   GET  /bot/status");
//     console.log("   POST /bot/trigger");
//     console.log("   GET  /collections");
//     console.log("   GET  /events");
//     console.log("   GET  /events/since          ← auto-refresh polling");
//     console.log("   GET  /events/:id");
//     console.log("   GET  /events/:id/creator-email");
//     console.log("   PATCH /events/:id/status");
//     console.log("   POST /analyze               ← text + image analysis");
//     console.log("   GET  /services");
//     console.log("   GET  /services/since        ← auto-refresh polling");
//     console.log("   GET  /services/:id");
//     console.log("   GET  /services/:id/creator-email");
//     console.log("   PATCH /services/:id/status");
//     console.log("   POST /analyze-service       ← text + image analysis");
//     console.log("   GET  /payments");
//     console.log("   GET  /payments/:id");
//     console.log("   GET  /users");
//     console.log("   GET  /users/:id");
//     console.log("\n🖼️  Image Analysis: GPT-4o Vision");
//     console.log("   Score = Text × 75% + Image × 25%");
//     console.log("   Detects: irrelevant, NSFW, placeholder, suspicious text");
//   });

//   startBackgroundBot();
// });

// backend/server.js
// ✅ PRODUCTION-READY - Secure & Optimized
// All logic in separate files: config/, services/, routes/, models/, utils/

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dns from "dns";

// Config
import { connectDB } from "./config/database.js";
import { BOT_CONFIG } from "./config/bot.config.js";

// Routes
import eventsRouter from "./routes/events.routes.js";
import servicesRouter from "./routes/services.routes.js";
import usersRouter from "./routes/users.routes.js";
import paymentsRouter from "./routes/payments.routes.js";
import botRouter from "./routes/bot.routes.js";
import { apiLimiter, analyzeLimiter } from "./middleware/rateLimiter.js";
// Services
import { startBackgroundBot } from "./services/bot.service.js";

// Initialize
dns.setDefaultResultOrder("ipv4first");
dotenv.config();

const app = express();
app.use(apiLimiter);
// ═══════════════════════════════════════════════════════════════════════════════
// 🔒 SECURITY - CORS Configuration
// ═══════════════════════════════════════════════════════════════════════════════

const ALLOWED_ORIGINS = [
  "http://localhost:3006",              // Local development
  "http://localhost:5173",              // Vite dev server
  "https://yourapp.com",                // ✅ REPLACE with your production domain
  "https://www.yourapp.com",            // ✅ REPLACE with your www domain
  "https://yourapp.vercel.app",         // ✅ If using Vercel
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, Postman, curl)
      if (!origin) return callback(null, true);

      if (ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`❌ CORS blocked: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "10mb" })); // Limit request size

// ═══════════════════════════════════════════════════════════════════════════════
// 🔒 SECURITY - Request Logging (Production)
// ═══════════════════════════════════════════════════════════════════════════════

app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `${req.method} ${req.path} ${res.statusCode} - ${duration}ms - ${req.ip}`
    );
  });
  next();
});

// ═══════════════════════════════════════════════════════════════════════════════
// ROUTES
// ═══════════════════════════════════════════════════════════════════════════════

app.use("/events", eventsRouter);
app.use("/services", servicesRouter);
app.use("/users", usersRouter);
app.use("/payments", paymentsRouter);
app.use("/bot", botRouter);

// Special analyze endpoints (backward compatibility)
// Direct routes — properly handle karo
app.post("/analyze", analyzeLimiter, async (req, res) => {
  const { runAIAnalysis } = await import("./services/ai-analysis.service.js");
  const { getDB } = await import("./config/database.js");
  const { ObjectId } = await import("mongodb");
  try {
    const db = getDB();
    const { event, force } = req.body;
    if (!event) return res.status(400).json({ error: "No event data provided" });
    if (!force && event.id) {
      let existing = null;
      try { existing = await db.collection("events").findOne({ _id: new ObjectId(event.id) }); } catch (_) {}
      if (!existing) existing = await db.collection("events").findOne({ id: event.id });
      if (existing?.aiAnalysis?.riskScore !== undefined)
        return res.json({ ...existing.aiAnalysis, fromCache: true });
    }
    const result = await runAIAnalysis(event, "events");
    res.json({ ...result, fromCache: false });
  } catch (err) {
    console.error("❌ /analyze error:", err.message);
    res.status(500).json({ riskScore: 0, riskLevel: "low", flags: [], summary: "Analysis failed.", recommendation: "Review manually.", fromCache: false });
  }
});

app.post("/analyze-service", analyzeLimiter, async (req, res) => {
  const { runAIAnalysis } = await import("./services/ai-analysis.service.js");
  const { getDB } = await import("./config/database.js");
  const { ObjectId } = await import("mongodb");
  try {
    const db = getDB();
    const { service, force } = req.body;
    if (!service) return res.status(400).json({ error: "No service data provided" });
    if (!force && service.id) {
      let existing = null;
      try { existing = await db.collection("services").findOne({ _id: new ObjectId(service.id) }); } catch (_) {}
      if (!existing) existing = await db.collection("services").findOne({ id: service.id });
      if (existing?.aiAnalysis?.riskScore !== undefined)
        return res.json({ ...existing.aiAnalysis, fromCache: true });
    }
    const result = await runAIAnalysis(service, "services");
    res.json({ ...result, fromCache: false });
  } catch (err) {
    console.error("❌ /analyze-service error:", err.message);
    res.status(500).json({ riskScore: 0, riskLevel: "low", flags: [], summary: "Analysis failed.", recommendation: "Review manually.", fromCache: false });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// DEBUG & HEALTH
// ═══════════════════════════════════════════════════════════════════════════════

app.get("/collections", async (req, res) => {
  try {
    const { getDB } = await import("./config/database.js");
    const db = getDB();
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

app.get("/health", async (req, res) => {
  const { getDB } = await import("./config/database.js");
  const { botStats } = await import("./config/bot.config.js");

  let dbStatus = "connected";
  let dbLatency = 0;

  try {
    const start = Date.now();
    const db = getDB();
    await db.admin().ping();
    dbLatency = Date.now() - start;
  } catch (err) {
    dbStatus = "disconnected";
  }

  res.json({
    status: dbStatus === "connected" ? "ok" : "degraded",
    db: dbStatus,
    dbLatency: `${dbLatency}ms`,
    bot: {
      enabled: BOT_CONFIG.ENABLED,
      isRunning: botStats.isRunning,
      totalRuns: botStats.totalRuns,
      lastRunAt: botStats.lastRunAt,
      approveThreshold: BOT_CONFIG.APPROVE_THRESHOLD,
      rejectThreshold: BOT_CONFIG.REJECT_THRESHOLD,
    },
    features: {
      imageAnalysis: true,
      imageModel: "gpt-4o-vision",
      textModel: "gpt-4o-mini",
      scoreFormula: "Text 75% + Image 25%",
    },
    uptime: Math.floor(process.uptime()),
    memory: {
      used: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
      total: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`,
    },
    environment: process.env.NODE_ENV || "development",
    time: new Date().toISOString(),
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 🔒 ERROR HANDLERS (Production-safe)
// ═══════════════════════════════════════════════════════════════════════════════

// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ ERROR:", {
    time: new Date().toISOString(),
    method: req.method,
    url: req.url,
    error: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    ip: req.ip,
  });

  res.status(err.status || 500).json({
    error:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Endpoint not found",
    path: req.path,
    method: req.method,
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// START SERVER
// ═══════════════════════════════════════════════════════════════════════════════

const PORT = process.env.PORT || 5006;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("\n" + "═".repeat(70));
    console.log(`✅ Admin Dashboard Backend (PRODUCTION-READY)`);
    console.log(`   Server: http://localhost:${PORT}`);
    console.log(`   Environment: ${process.env.NODE_ENV || "development"}`);
    console.log("═".repeat(70));
    console.log("\n📡 API Endpoints:");
    console.log("   GET  /health                     - Health check");
    console.log("   GET  /bot/status                 - Bot status");
    console.log("   POST /bot/trigger                - Trigger bot manually");
    console.log("   GET  /collections                - Debug: DB collections");
    console.log("\n   📅 Events:");
    console.log("   GET  /events                     - List all events");
    console.log("   GET  /events/since?ts=...        - Auto-refresh polling");
    console.log("   GET  /events/:id                 - Get single event");
    console.log("   PATCH /events/:id/status         - Update event status");
    console.log("   POST /analyze                    - AI analysis (text+image)");
    console.log("\n   🔧 Services:");
    console.log("   GET  /services                   - List all services");
    console.log("   GET  /services/since?ts=...      - Auto-refresh polling");
    console.log("   GET  /services/:id               - Get single service");
    console.log("   PATCH /services/:id/status       - Update service status");
    console.log("   POST /analyze-service            - AI analysis (text+image)");
    console.log("\n   👥 Users:");
    console.log("   GET  /users                      - List all users");
    console.log("   GET  /users/:id                  - Get single user");
    console.log("\n   💰 Payments:");
    console.log("   GET  /payments                   - List all payments");
    console.log("   GET  /payments/:id               - Get single payment");
    console.log("\n🖼️  Image Analysis: GPT-4o Vision");
    console.log("   Formula: Text × 75% + Image × 25%");
    console.log("   Detects: Relevance, NSFW, Placeholder, Suspicious Text");
    console.log("\n🔒 Security Features:");
    console.log("   ✅ CORS restricted to allowed origins");
    console.log("   ✅ Request logging enabled");
    console.log("   ✅ Error handling (production-safe)");
    console.log("   ✅ Rate limiting ready");
    console.log("═".repeat(70) + "\n");
    // In server.js — add these lines to the startup log (inside app.listen callback)
// 🔧 MODIFIED: Add new endpoint docs to the startup printout

console.log("\n   👥 Users + Moderation:");                          // ✅ NEW label
console.log("   GET  /users                     - List all users");
console.log("   GET  /users/:id                 - Get single user");
console.log("   POST /users/:clerkId/suspend    - 7-day suspension");  // ✅ NEW
console.log("   POST /users/:clerkId/ban        - Permanent ban");     // ✅ NEW
console.log("   POST /users/:clerkId/unsuspend  - Lift suspension");   // ✅ NEW
console.log("   POST /users/:clerkId/unban      - Reverse ban");       // ✅ NEW
console.log("   GET  /users/:clerkId/moderation-history - Audit log"); // ✅ NEW
  });

  startBackgroundBot();
});

// ═══════════════════════════════════════════════════════════════════════════════
// 🔒 GRACEFUL SHUTDOWN
// ═══════════════════════════════════════════════════════════════════════════════

process.on("SIGTERM", async () => {
  console.log("\n⏸️  SIGTERM received, shutting down gracefully...");
  const { client } = await import("./config/database.js");
  await client.close();
  console.log("✅ Database connection closed");
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("\n⏸️  SIGINT received, shutting down gracefully...");
  const { client } = await import("./config/database.js");
  await client.close();
  console.log("✅ Database connection closed");
  process.exit(0);
});