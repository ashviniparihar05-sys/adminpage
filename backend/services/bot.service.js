// // // backend/services/bot.service.js
// // // Background AI Bot - Main logic

// // import { ObjectId } from "mongodb";
// // import { getDB } from "../config/database.js";
// // import { BOT_CONFIG, botStats } from "../config/bot.config.js";
// // import { runAIAnalysis } from "./ai-analysis.service.js";
// // import { saveNotification } from "./notification.service.js";
// // import { normalizeEvent } from "../models/event.normalizer.js";
// // import { liftExpiredSuspensions } from "./moderation.service.js";
// // import { normalizeService } from "../models/service.normalizer.js";
// // import {
// //   suspendUser,
// //   banUser,
// //   countRejections,
// // } from "./moderation.service.js";
// // import {
// //   AUTO_SUSPEND_THRESHOLD,
// //   AUTO_BAN_THRESHOLD,
// // } from "../utils/constants.js";

// // // Build improvement suggestions from flags + image analysis
// // function buildImprovementNote(flags, imageAnalysis) {
// //   const suggestions = [];
// //   if (imageAnalysis) {
// //     if (imageAnalysis.isPlaceholder) {
// //       suggestions.push(
// //         "📸 Replace the placeholder/stock image with an original photo of your actual event or service."
// //       );
// //     }
// //     if (imageAnalysis.checked && !imageAnalysis.isRelevant) {
// //       suggestions.push(
// //         `🖼️ Your image doesn't match the event — ${
// //           imageAnalysis.relevanceNote || "please upload a relevant photo."
// //         }`
// //       );
// //     }
// //     if (
// //       imageAnalysis.checked &&
// //       imageAnalysis.imageRiskScore > 20 &&
// //       imageAnalysis.placeholderNote
// //     ) {
// //       suggestions.push(`📷 Image tip: ${imageAnalysis.placeholderNote}`);
// //     }
// //   }
// //   for (const flag of flags || []) {
// //     if (flag.severity === "low" || flag.severity === "medium") {
// //       suggestions.push(`• ${flag.type}: ${flag.description}`);
// //     }
// //   }
// //   return suggestions.length > 0 ? suggestions.join("\n") : null;
// // }

// // // Apply decision based on risk score
// // async function applyDecision(analysis, mongoId, itemId, item, collectionName) {
// //   const db = getDB();
// //   const score = analysis.riskScore;
// //   const isService = collectionName === "services";
// //   let decision;

// //   // CASE 1: LOW RISK — AUTO APPROVE
// //   if (score <= BOT_CONFIG.APPROVE_THRESHOLD) {
// //     decision = "approved";
// //     await db.collection(collectionName).updateOne(
// //       { _id: mongoId },
// //       {
// //         $set: {
// //           admin_status: "approved",
// //           moderationStatus: "approved",
// //           updatedAt: new Date(),
// //           isApproved: true,
// //           isActive: true,
// //           ...(isService ? { status: "active" } : { isListed: true }),
// //           botDecision: { action: "approved", score, at: new Date() },
// //         },
// //       }
// //     );
// //     console.log(`  ✅ AUTO-APPROVED (score ${score} ≤ ${BOT_CONFIG.APPROVE_THRESHOLD})`);

// //     if (item.creatorClerkId) {
// //       const improvementNote = buildImprovementNote(
// //         analysis.flags,
// //         analysis.imageAnalysis
// //       );
// //       const warningFlags = (analysis.flags || []).filter(
// //         (f) => f.severity === "low" || f.severity === "medium"
// //       );
// //       await saveNotification(
// //         item.creatorClerkId,
// //         isService ? "service_approved" : "event_approved",
// //         itemId,
// //         item.title,
// //         `Your ${isService ? "service" : "event"} "${
// //           item.title
// //         }" has been approved and is now live on MyApp! 🎉`,
// //         improvementNote,
// //         warningFlags,
// //         "approved",
// //         score
// //       );
// //     }
// //   }
// //   // CASE 2: MEDIUM RISK — APPROVE WITH WARNINGS
// //   else if (score > BOT_CONFIG.APPROVE_THRESHOLD && score < BOT_CONFIG.REJECT_THRESHOLD) {
// //     decision = "needs_review";
// //     await db.collection(collectionName).updateOne(
// //       { _id: mongoId },
// //       {
// //         $set: {
// //           admin_status: "approved",
// //           moderationStatus: "approved",
// //           updatedAt: new Date(),
// //           isApproved: true,
// //           isActive: true,
// //           ...(isService ? { status: "active" } : { isListed: true }),
// //           botDecision: { action: "approved_with_warnings", score, at: new Date() },
// //           internalFlag: "needs_improvement",
// //         },
// //       }
// //     );
// //     console.log(`  🟡 APPROVED WITH WARNINGS (score ${score} — medium risk)`);

// //     if (item.creatorClerkId) {
// //       const improvementNote = buildImprovementNote(
// //         analysis.flags,
// //         analysis.imageAnalysis
// //       );
// //       const mediumFlags = (analysis.flags || []).filter((f) => f.severity !== "high");
// //       await saveNotification(
// //         item.creatorClerkId,
// //         isService ? "service_approved" : "event_approved",
// //         itemId,
// //         item.title,
// //         `Your ${isService ? "service" : "event"} "${
// //           item.title
// //         }" is live! But please fix these issues to avoid rejection in future.`,
// //         improvementNote,
// //         mediumFlags,
// //         "approved_with_warnings",
// //         score
// //       );
// //     }
// //   }
// //   // CASE 3: HIGH RISK — REJECT
// //   else {
// //     decision = "rejected";
// //     const moderatorNote = `AI Risk Score: ${score}/100 — ${analysis.summary} ${analysis.recommendation}`;
// //     await db.collection(collectionName).updateOne(
// //       { _id: mongoId },
// //       {
// //         $set: {
// //           admin_status: "rejected",
// //           moderationStatus: "rejected",
// //           updatedAt: new Date(),
// //           isApproved: false,
// //           isActive: false,
// //           ...(isService ? { status: "paused" } : { isListed: false }),
// //           botDecision: { action: "rejected", score, at: new Date() },
// //           moderatorNote,
// //         },
// //       }
// //     );
// //     console.log(`  ❌ AUTO-REJECTED (score ${score} ≥ ${BOT_CONFIG.REJECT_THRESHOLD})`);

// //     if (item.creatorClerkId) {
// //       await saveNotification(
// //         item.creatorClerkId,
// //         isService ? "service_rejected" : "event_rejected",
// //         itemId,
// //         item.title,
// //         `Your ${isService ? "service" : "event"} "${item.title}" was rejected.`,
// //         moderatorNote,
// //         analysis.flags || [],
// //         "rejected",
// //         score
// //       );
// //       // ✅ NEW: After rejection, check if user has hit the suspension/ban threshold
// //       try {
// //         const totalRejections = await countRejections(item.creatorClerkId);
// //         console.log(`  📊 User ${item.creatorClerkId} total rejections: ${totalRejections}`);

// //         // ✅ NEW: 6+ rejections → permanent ban (checked first, higher priority)
// //         if (totalRejections >= AUTO_BAN_THRESHOLD) {
// //           const userDoc = await db.collection("users").findOne(
// //             { clerkUserId: item.creatorClerkId },
// //             { projection: { "moderation.isBanned": 1 } }
// //           );
// //           if (!userDoc?.moderation?.isBanned) {  // don't double-ban
// //             await banUser(
// //               item.creatorClerkId,
// //               `Auto-banned: ${totalRejections} listings rejected by AI moderation`,
// //               "bot"
// //             );
// //           }
// //         }
// //         // ✅ NEW: 3+ rejections → 7-day suspension (only if not already banned)
// //         else if (totalRejections >= AUTO_SUSPEND_THRESHOLD) {
// //           const userDoc = await db.collection("users").findOne(
// //             { clerkUserId: item.creatorClerkId },
// //             { projection: { "moderation.isSuspended": 1, "moderation.isBanned": 1 } }
// //           );
// //           if (!userDoc?.moderation?.isSuspended && !userDoc?.moderation?.isBanned) {
// //             await suspendUser(
// //               item.creatorClerkId,
// //               `Auto-suspended: ${totalRejections} listings rejected by AI moderation`,
// //               "bot"
// //             );
// //           }
// //         }
// //       } catch (moderationErr) {
// //         // ✅ NEW: Don't crash the whole bot cycle if moderation check fails
// //         console.warn(`  ⚠️ Auto-moderation check failed: ${moderationErr.message}`);
// //       }
    
// //     }
// //   }

// //   return decision;
// // }

// // // Process single item (event or service)
// // async function processItem(rawDoc, collectionName) {
// //   const db = getDB();
// //   const isService = collectionName === "services";
// //   const item = isService ? normalizeService(rawDoc) : normalizeEvent(rawDoc);
// //   const itemId = item.id;
// //   const mongoId = rawDoc._id;

// //   console.log(`  📋 [${collectionName.toUpperCase()}] "${item.title}" (${itemId})`);

// //   // Cache check
// //   if (rawDoc.aiAnalysis?.riskScore !== undefined) {
// //     console.log(`  📦 Cache found (score: ${rawDoc.aiAnalysis.riskScore}) — skipping OpenAI`);
// //     const currentStatus =
// //       rawDoc.admin_status || rawDoc.moderationStatus || rawDoc.status || "pending";
// //     if (currentStatus === "pending" || currentStatus === "flagged") {
// //       await applyDecision(rawDoc.aiAnalysis, mongoId, itemId, item, collectionName);
// //       return rawDoc.aiAnalysis.riskScore >= BOT_CONFIG.REJECT_THRESHOLD
// //         ? "rejected"
// //         : rawDoc.aiAnalysis.riskScore <= BOT_CONFIG.APPROVE_THRESHOLD
// //         ? "approved"
// //         : "needs_review";
// //     }
// //     return "cached";
// //   }

// //   // Fresh AI analysis (text + image)
// //   console.log(`  🤖 Calling OpenAI (text + image)...`);
// //   const analysis = await runAIAnalysis(item, collectionName);
// //   console.log(`  📊 Score: ${analysis.riskScore}/100 (${analysis.riskLevel.toUpperCase()})`);

// //   // Save to MongoDB
// //   try {
// //     await db
// //       .collection(collectionName)
// //       .updateOne({ _id: mongoId }, { $set: { aiAnalysis: analysis, updatedAt: new Date() } });
// //     console.log(`  💾 Cached in MongoDB (with image analysis)`);
// //   } catch (saveErr) {
// //     console.warn(`  ⚠️ Cache save failed: ${saveErr.message}`);
// //   }

// //   return await applyDecision(analysis, mongoId, itemId, item, collectionName);
// // }
// // // ─── Main Bot Cycle ─────────────────────────────────────────────────────────────
// // // ✅ SAHI ORDER — runBotCycle() mein yeh changes karo

// // export async function runBotCycle() {

// //   // ✅ PEHLE: DB check karo
// //   const db = getDB();
// //   if (!db) {
// //     console.log("⏳ Bot: DB not ready, retrying...");
// //     setTimeout(runBotCycle, 10000);
// //     return;
// //   }

// //   // ✅ BAAD MEIN: Ab safely lift karo (DB ready hai)
// //   const lifted = await liftExpiredSuspensions();
// //   if (lifted > 0) {
// //     console.log(`⏰ Lifted ${lifted} expired suspension(s) this cycle`);
// //   }

// //   if (botStats.isRunning) {
// //     console.log("⏳ Bot: Previous cycle still running, skipping...");
// //     setTimeout(runBotCycle, BOT_CONFIG.INTERVAL_MS);
// //     return;
// //   }

// //   // ... baaki sab same rehta hai
// //   botStats.isRunning = true;
// //   botStats.totalRuns++;
// //   botStats.lastRunAt = new Date().toISOString();
// //   const runStart = Date.now();

// //   console.log("\n" + "═".repeat(60));
// //   console.log(`🤖 BOT CYCLE #${botStats.totalRuns} — ${new Date().toLocaleString("en-IN")}`);
// //   console.log(
// //     `   Settings: approve≤${BOT_CONFIG.APPROVE_THRESHOLD}% | reject≥${BOT_CONFIG.REJECT_THRESHOLD}% | interval=${BOT_CONFIG.INTERVAL_MS / 60000}min`
// //   );
// //   console.log("═".repeat(60));

// //   let cycleAnalyzed = 0,
// //     cycleApproved = 0,
// //     cycleRejected = 0,
// //     cycleNeedsReview = 0,
// //     cycleErrors = 0;

// //   try {
// //     const pendingEvents = await db
// //       .collection("events")
// //       .find({
// //         $or: [
// //           { admin_status: "pending" },
// //           {
// //             admin_status: { $exists: false },
// //             moderationStatus: { $exists: false },
// //           },
// //         ],
// //       })
// //       .limit(50)
// //       .toArray();

// //     const pendingServices = await db
// //       .collection("services")
// //       .find({
// //         $or: [
// //           { admin_status: "pending" },
// //           {
// //             admin_status: { $exists: false },
// //             moderationStatus: { $exists: false },
// //           },
// //           { status: "pending" },
// //         ],
// //       })
// //       .limit(50)
// //       .toArray();

// //     const totalToProcess = pendingEvents.length + pendingServices.length;
// //     console.log(
// //       `📋 Found: ${pendingEvents.length} events + ${pendingServices.length} services to process`
// //     );

// //     if (totalToProcess === 0) {
// //       console.log("✨ Nothing to process — all items are up to date!");
// //       botStats.isRunning = false;
// //       setTimeout(runBotCycle, BOT_CONFIG.INTERVAL_MS);
// //       return;
// //     }

// //     if (pendingEvents.length > 0) {
// //       console.log(`\n📅 Processing ${pendingEvents.length} EVENTS...`);
// //       for (const eventDoc of pendingEvents) {
// //         try {
// //           const result = await processItem(eventDoc, "events");
// //           cycleAnalyzed++;
// //           if (result === "approved") cycleApproved++;
// //           else if (result === "rejected") cycleRejected++;
// //           else if (result === "needs_review") cycleNeedsReview++;
// //           await new Promise((r) => setTimeout(r, 1500));
// //         } catch (err) {
// //           cycleErrors++;
// //           console.error(`  ❌ Error: ${err.message}`);
// //         }
// //       }
// //     }

// //     if (pendingServices.length > 0) {
// //       console.log(`\n🔧 Processing ${pendingServices.length} SERVICES...`);
// //       for (const serviceDoc of pendingServices) {
// //         try {
// //           const result = await processItem(serviceDoc, "services");
// //           cycleAnalyzed++;
// //           if (result === "approved") cycleApproved++;
// //           else if (result === "rejected") cycleRejected++;
// //           else if (result === "needs_review") cycleNeedsReview++;
// //           await new Promise((r) => setTimeout(r, 1500));
// //         } catch (err) {
// //           cycleErrors++;
// //           console.error(`  ❌ Error: ${err.message}`);
// //         }
// //       }
// //     }

// //     botStats.totalAnalyzed += cycleAnalyzed;
// //     botStats.totalApproved += cycleApproved;
// //     botStats.totalRejected += cycleRejected;
// //     botStats.totalNeedsReview += cycleNeedsReview;
// //     botStats.totalErrors += cycleErrors;

// //     const elapsed = Math.round((Date.now() - runStart) / 1000);

// //     try {
// //       await db.collection("bot_logs").insertOne({
// //         runNumber: botStats.totalRuns,
// //         ranAt: new Date(),
// //         durationSec: elapsed,
// //         analyzed: cycleAnalyzed,
// //         approved: cycleApproved,
// //         rejected: cycleRejected,
// //         needsReview: cycleNeedsReview,
// //         errors: cycleErrors,
// //       });
// //     } catch (_) {}

// //     console.log("\n" + "─".repeat(60));
// //     console.log(`📊 CYCLE #${botStats.totalRuns} COMPLETE (${elapsed}s)`);
// //     console.log(
// //       `   ✅ Approved: ${cycleApproved} | ❌ Rejected: ${cycleRejected} | 🟡 Review: ${cycleNeedsReview} | ⚠️ Errors: ${cycleErrors}`
// //     );
// //     console.log(
// //       `   📈 All-time: Approved=${botStats.totalApproved} | Rejected=${botStats.totalRejected} | Total=${botStats.totalAnalyzed}`
// //     );
// //     console.log(`   ⏰ Next run in ${BOT_CONFIG.INTERVAL_MS / 60000} minutes...`);
// //     console.log("─".repeat(60) + "\n");
// //   } catch (err) {
// //     console.error(`❌ BOT CYCLE ERROR: ${err.message}`);
// //     botStats.totalErrors++;
// //   } finally {
// //     botStats.isRunning = false;
// //     setTimeout(runBotCycle, BOT_CONFIG.INTERVAL_MS);
// //   }
// // }

// // // ─── Start Background Bot ──────────────────────────────────────────────────────
// // export function startBackgroundBot() {
// //   if (!BOT_CONFIG.ENABLED) {
// //     console.log("⏸ Background bot is DISABLED (BOT_ENABLED=false in .env)");
// //     return;
// //   }
// //   console.log("\n" + "🤖".repeat(20));
// //   console.log("🤖 BACKGROUND BOT STARTING (with Image Analysis)...");
// //   console.log(`   ✅ Auto-approve if risk ≤ ${BOT_CONFIG.APPROVE_THRESHOLD}%`);
// //   console.log(`   ❌ Auto-reject if risk ≥ ${BOT_CONFIG.REJECT_THRESHOLD}%`);
// //   console.log(
// //     `   🟡 Needs review: ${BOT_CONFIG.APPROVE_THRESHOLD}% - ${BOT_CONFIG.REJECT_THRESHOLD}%`
// //   );
// //   console.log(`   ⏱  Runs every ${BOT_CONFIG.INTERVAL_MS / 60000} minutes`);
// //   console.log(`   🖼️  Image analysis: GPT-4o Vision (text 75% + image 25%)`);
// //   console.log(`   💾 Results cached in MongoDB`);
// //   console.log("🤖".repeat(20) + "\n");
// //   setTimeout(runBotCycle, 10000);
// // }
// // backend/services/bot.service.js
// // Background AI Bot - Main logic

// import { ObjectId } from "mongodb";
// import { getDB } from "../config/database.js";
// import { BOT_CONFIG, botStats } from "../config/bot.config.js";
// import { runAIAnalysis } from "./ai-analysis.service.js";
// import { saveNotification } from "./notification.service.js";
// import { normalizeEvent } from "../models/event.normalizer.js";
// import { normalizeService } from "../models/service.normalizer.js";

// // ✅ FIXED: Pehle duplicate import tha — moderation.service.js do baar import ho rahi thi
// // Ab ek hi jagah se sab import karo
// import {
//   suspendUser,
//   banUser,
//   countRejections,
//   liftExpiredSuspensions,
// } from "./moderation.service.js";

// import {
//   AUTO_SUSPEND_THRESHOLD,
//   AUTO_BAN_THRESHOLD,
// } from "../utils/constants.js";

// // ─────────────────────────────────────────────────────────────────────────────
// // Build improvement suggestions from flags + image analysis
// // ─────────────────────────────────────────────────────────────────────────────
// function buildImprovementNote(flags, imageAnalysis) {
//   const suggestions = [];
//   if (imageAnalysis) {
//     if (imageAnalysis.isPlaceholder) {
//       suggestions.push(
//         "📸 Replace the placeholder/stock image with an original photo of your actual event or service."
//       );
//     }
//     if (imageAnalysis.checked && !imageAnalysis.isRelevant) {
//       suggestions.push(
//         `🖼️ Your image doesn't match the event — ${
//           imageAnalysis.relevanceNote || "please upload a relevant photo."
//         }`
//       );
//     }
//     if (
//       imageAnalysis.checked &&
//       imageAnalysis.imageRiskScore > 20 &&
//       imageAnalysis.placeholderNote
//     ) {
//       suggestions.push(`📷 Image tip: ${imageAnalysis.placeholderNote}`);
//     }
//   }
//   for (const flag of flags || []) {
//     if (flag.severity === "low" || flag.severity === "medium") {
//       suggestions.push(`• ${flag.type}: ${flag.description}`);
//     }
//   }
//   return suggestions.length > 0 ? suggestions.join("\n") : null;
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // Apply decision based on risk score
// // ─────────────────────────────────────────────────────────────────────────────
// async function applyDecision(analysis, mongoId, itemId, item, collectionName) {
//   const db = getDB();
//   const score = analysis.riskScore;
//   const isService = collectionName === "services";
//   let decision;

//   // CASE 1: LOW RISK — AUTO APPROVE
//   if (score <= BOT_CONFIG.APPROVE_THRESHOLD) {
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
//     console.log(`  ✅ AUTO-APPROVED (score ${score} ≤ ${BOT_CONFIG.APPROVE_THRESHOLD})`);

//     if (item.creatorClerkId) {
//       const improvementNote = buildImprovementNote(analysis.flags, analysis.imageAnalysis);
//       const warningFlags = (analysis.flags || []).filter(
//         (f) => f.severity === "low" || f.severity === "medium"
//       );
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

//   // CASE 2: MEDIUM RISK — APPROVE WITH WARNINGS
//   else if (score > BOT_CONFIG.APPROVE_THRESHOLD && score < BOT_CONFIG.REJECT_THRESHOLD) {
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
//       const mediumFlags = (analysis.flags || []).filter((f) => f.severity !== "high");
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

//   // CASE 3: HIGH RISK — REJECT
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
//     console.log(`  ❌ AUTO-REJECTED (score ${score} ≥ ${BOT_CONFIG.REJECT_THRESHOLD})`);

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

//       // ✅ NEW: Rejection ke baad check karo kya user threshold hit kar chuka hai
//       try {
//         const totalRejections = await countRejections(item.creatorClerkId);
//         console.log(`  📊 User ${item.creatorClerkId} total rejections: ${totalRejections}`);

//         // ✅ NEW: 6+ rejections → permanent ban (pehle check karo — higher priority)
//         if (totalRejections >= AUTO_BAN_THRESHOLD) {
//           const userDoc = await db.collection("users").findOne(
//             { clerkUserId: item.creatorClerkId },
//             { projection: { "moderation.isBanned": 1 } }
//           );
//           if (!userDoc?.moderation?.isBanned) {
//             // ✅ Double-ban nahi karna — sirf agar already banned nahi hai
//             await banUser(
//               item.creatorClerkId,
//               `Auto-banned: ${totalRejections} listings rejected by AI moderation`,
//               "bot"
//             );
//           }
//         }
//         // ✅ NEW: 3+ rejections → 7-day suspension (sirf agar already banned/suspended nahi)
//         else if (totalRejections >= AUTO_SUSPEND_THRESHOLD) {
//           const userDoc = await db.collection("users").findOne(
//             { clerkUserId: item.creatorClerkId },
//             { projection: { "moderation.isSuspended": 1, "moderation.isBanned": 1 } }
//           );
//           if (!userDoc?.moderation?.isSuspended && !userDoc?.moderation?.isBanned) {
//             await suspendUser(
//               item.creatorClerkId,
//               `Auto-suspended: ${totalRejections} listings rejected by AI moderation`,
//               "bot"
//             );
//           }
//         }
//       } catch (moderationErr) {
//         // ✅ NEW: Moderation fail hone se poora bot cycle crash nahi hoga
//         console.warn(`  ⚠️ Auto-moderation check failed: ${moderationErr.message}`);
//       }
//     }
//   }

//   return decision;
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // Process single item (event or service)
// // ─────────────────────────────────────────────────────────────────────────────
// async function processItem(rawDoc, collectionName) {
//   const db = getDB();
//   const isService = collectionName === "services";
//   const item = isService ? normalizeService(rawDoc) : normalizeEvent(rawDoc);
//   const itemId = item.id;
//   const mongoId = rawDoc._id;

//   console.log(`  📋 [${collectionName.toUpperCase()}] "${item.title}" (${itemId})`);

//   // Cache check
//   if (rawDoc.aiAnalysis?.riskScore !== undefined) {
//     console.log(`  📦 Cache found (score: ${rawDoc.aiAnalysis.riskScore}) — skipping OpenAI`);
//     const currentStatus =
//       rawDoc.admin_status || rawDoc.moderationStatus || rawDoc.status || "pending";
//     if (currentStatus === "pending" || currentStatus === "flagged") {
//       await applyDecision(rawDoc.aiAnalysis, mongoId, itemId, item, collectionName);
//       return rawDoc.aiAnalysis.riskScore >= BOT_CONFIG.REJECT_THRESHOLD
//         ? "rejected"
//         : rawDoc.aiAnalysis.riskScore <= BOT_CONFIG.APPROVE_THRESHOLD
//         ? "approved"
//         : "needs_review";
//     }
//     return "cached";
//   }

//   // Fresh AI analysis (text + image)
//   console.log(`  🤖 Calling OpenAI (text + image)...`);
//   const analysis = await runAIAnalysis(item, collectionName);
//   console.log(`  📊 Score: ${analysis.riskScore}/100 (${analysis.riskLevel.toUpperCase()})`);

//   // Save to MongoDB
//   try {
//     await db
//       .collection(collectionName)
//       .updateOne({ _id: mongoId }, { $set: { aiAnalysis: analysis, updatedAt: new Date() } });
//     console.log(`  💾 Cached in MongoDB (with image analysis)`);
//   } catch (saveErr) {
//     console.warn(`  ⚠️ Cache save failed: ${saveErr.message}`);
//   }

//   return await applyDecision(analysis, mongoId, itemId, item, collectionName);
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // Main Bot Cycle
// // ─────────────────────────────────────────────────────────────────────────────
// export async function runBotCycle() {

//   // ✅ STEP 1: Pehle DB check karo
//   // getDB() throw karta hai agar DB ready nahi — isliye try/catch mein hai
//   let db;
//   try {
//     db = getDB();
//   } catch (_) {
//     console.log("⏳ Bot: DB not ready, retrying...");
//     setTimeout(runBotCycle, 10000);
//     return;
//   }

//   // ✅ STEP 2: DB ready hai — ab expired suspensions lift karo
//   // Yeh har cycle mein chalta hai aur 7-din poore ho chuke users ko automatically unsuspend karta hai
//   try {
//     const lifted = await liftExpiredSuspensions();
//     if (lifted > 0) {
//       console.log(`⏰ Auto-lifted ${lifted} expired suspension(s) this cycle`);
//     }
//   } catch (liftErr) {
//     // ✅ Lift fail hone se cycle cancel nahi hoga
//     console.warn(`⚠️ liftExpiredSuspensions failed: ${liftErr.message}`);
//   }

//   // ✅ STEP 3: Check karo kya previous cycle abhi chal rahi hai
//   if (botStats.isRunning) {
//     console.log("⏳ Bot: Previous cycle still running, skipping...");
//     setTimeout(runBotCycle, BOT_CONFIG.INTERVAL_MS);
//     return;
//   }

//   botStats.isRunning = true;
//   botStats.totalRuns++;
//   botStats.lastRunAt = new Date().toISOString();
//   const runStart = Date.now();

//   console.log("\n" + "═".repeat(60));
//   console.log(`🤖 BOT CYCLE #${botStats.totalRuns} — ${new Date().toLocaleString("en-IN")}`);
//   console.log(
//     `   Settings: approve≤${BOT_CONFIG.APPROVE_THRESHOLD}% | reject≥${BOT_CONFIG.REJECT_THRESHOLD}% | interval=${BOT_CONFIG.INTERVAL_MS / 60000}min`
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
//       setTimeout(runBotCycle, BOT_CONFIG.INTERVAL_MS);
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
//           await new Promise((r) => setTimeout(r, 1500));
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
//     console.log(`   ⏰ Next run in ${BOT_CONFIG.INTERVAL_MS / 60000} minutes...`);
//     console.log("─".repeat(60) + "\n");
//   } catch (err) {
//     console.error(`❌ BOT CYCLE ERROR: ${err.message}`);
//     botStats.totalErrors++;
//   } finally {
//     botStats.isRunning = false;
//     setTimeout(runBotCycle, BOT_CONFIG.INTERVAL_MS);
//   }
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // Start Background Bot
// // ─────────────────────────────────────────────────────────────────────────────
// export function startBackgroundBot() {
//   if (!BOT_CONFIG.ENABLED) {
//     console.log("⏸ Background bot is DISABLED (BOT_ENABLED=false in .env)");
//     return;
//   }
//   console.log("\n" + "🤖".repeat(20));
//   console.log("🤖 BACKGROUND BOT STARTING (with Image Analysis)...");
//   console.log(`   ✅ Auto-approve if risk ≤ ${BOT_CONFIG.APPROVE_THRESHOLD}%`);
//   console.log(`   ❌ Auto-reject if risk ≥ ${BOT_CONFIG.REJECT_THRESHOLD}%`);
//   console.log(
//     `   🟡 Needs review: ${BOT_CONFIG.APPROVE_THRESHOLD}% - ${BOT_CONFIG.REJECT_THRESHOLD}%`
//   );
//   console.log(`   ⏱  Runs every ${BOT_CONFIG.INTERVAL_MS / 60000} minutes`);
//   console.log(`   🖼️  Image analysis: GPT-4o Vision (text 75% + image 25%)`);
//   console.log(`   💾 Results cached in MongoDB`);
//   console.log(`   🔴 Auto-suspend after ${AUTO_SUSPEND_THRESHOLD} rejections`);
//   console.log(`   ⛔ Auto-ban after ${AUTO_BAN_THRESHOLD} rejections`);
//   console.log(`   ⏰ Expired suspensions auto-lifted every cycle`);
//   console.log("🤖".repeat(20) + "\n");
//   setTimeout(runBotCycle, 10000);
// }
// backend/services/bot.service.js
// Background AI Bot - Main logic

import { ObjectId } from "mongodb";
import { getDB } from "../config/database.js";
import { BOT_CONFIG, botStats } from "../config/bot.config.js";
import { runAIAnalysis } from "./ai-analysis.service.js";
import { saveNotification } from "./notification.service.js";
import { normalizeEvent } from "../models/event.normalizer.js";
import { normalizeService } from "../models/service.normalizer.js";

// Build improvement suggestions from flags + image analysis
function buildImprovementNote(flags, imageAnalysis) {
  const suggestions = [];
  if (imageAnalysis) {
    if (imageAnalysis.isPlaceholder) {
      suggestions.push(
        "📸 Replace the placeholder/stock image with an original photo of your actual event or service."
      );
    }
    if (imageAnalysis.checked && !imageAnalysis.isRelevant) {
      suggestions.push(
        `🖼️ Your image doesn't match the event — ${
          imageAnalysis.relevanceNote || "please upload a relevant photo."
        }`
      );
    }
    if (
      imageAnalysis.checked &&
      imageAnalysis.imageRiskScore > 20 &&
      imageAnalysis.placeholderNote
    ) {
      suggestions.push(`📷 Image tip: ${imageAnalysis.placeholderNote}`);
    }
  }
  for (const flag of flags || []) {
    if (flag.severity === "low" || flag.severity === "medium") {
      suggestions.push(`• ${flag.type}: ${flag.description}`);
    }
  }
  return suggestions.length > 0 ? suggestions.join("\n") : null;
}

// Apply decision based on risk score
async function applyDecision(analysis, mongoId, itemId, item, collectionName) {
  const db = getDB();
  const score = analysis.riskScore;
  const isService = collectionName === "services";
  let decision;

  // CASE 1: LOW RISK — AUTO APPROVE
  if (score <= BOT_CONFIG.APPROVE_THRESHOLD) {
    decision = "approved";
    await db.collection(collectionName).updateOne(
      { _id: mongoId },
      {
        $set: {
          admin_status: "approved",
          moderationStatus: "approved",
          updatedAt: new Date(),
          isApproved: true,
          isActive: true,
          status: "active",
          isListed: true,
          botDecision: { action: "approved", score, at: new Date() },
        },
      }
    );
    console.log(`  ✅ AUTO-APPROVED (score ${score} ≤ ${BOT_CONFIG.APPROVE_THRESHOLD})`);

    if (item.creatorClerkId) {
      const improvementNote = buildImprovementNote(
        analysis.flags,
        analysis.imageAnalysis
      );
      const warningFlags = (analysis.flags || []).filter(
        (f) => f.severity === "low" || f.severity === "medium"
      );
      await saveNotification(
        item.creatorClerkId,
        isService ? "service_approved" : "event_approved",
        itemId,
        item.title,
        `Your ${isService ? "service" : "event"} "${
          item.title
        }" has been approved and is now live on MyApp! 🎉`,
        improvementNote,
        warningFlags,
        "approved",
        score
      );
    }
  }
  // CASE 2: MEDIUM RISK — APPROVE WITH WARNINGS
  else if (score > BOT_CONFIG.APPROVE_THRESHOLD && score < BOT_CONFIG.REJECT_THRESHOLD) {
    decision = "needs_review";
    await db.collection(collectionName).updateOne(
      { _id: mongoId },
      {
        $set: {
          admin_status: "approved",
          moderationStatus: "approved",
          updatedAt: new Date(),
          isApproved: true,
          isActive: true,
          status: "active",
          isListed: true,
          botDecision: { action: "approved_with_warnings", score, at: new Date() },
          internalFlag: "needs_improvement",
        },
      }
    );
    console.log(`  🟡 APPROVED WITH WARNINGS (score ${score} — medium risk)`);

    if (item.creatorClerkId) {
      const improvementNote = buildImprovementNote(
        analysis.flags,
        analysis.imageAnalysis
      );
      const mediumFlags = (analysis.flags || []).filter((f) => f.severity !== "high");
      await saveNotification(
        item.creatorClerkId,
        isService ? "service_approved" : "event_approved",
        itemId,
        item.title,
        `Your ${isService ? "service" : "event"} "${
          item.title
        }" is live! But please fix these issues to avoid rejection in future.`,
        improvementNote,
        mediumFlags,
        "approved_with_warnings",
        score
      );
    }
  }
  // CASE 3: HIGH RISK — REJECT
  else {
    decision = "rejected";
    const moderatorNote = `AI Risk Score: ${score}/100 — ${analysis.summary} ${analysis.recommendation}`;
    await db.collection(collectionName).updateOne(
      { _id: mongoId },
      {
        $set: {
          admin_status: "rejected",
          moderationStatus: "rejected",
          updatedAt: new Date(),
          isApproved: false,
          isActive: false,
          status: "rejected",
          isListed: false,
          botDecision: { action: "rejected", score, at: new Date() },
          moderatorNote,
        },
      }
    );
    console.log(`  ❌ AUTO-REJECTED (score ${score} ≥ ${BOT_CONFIG.REJECT_THRESHOLD})`);

    if (item.creatorClerkId) {
      await saveNotification(
        item.creatorClerkId,
        isService ? "service_rejected" : "event_rejected",
        itemId,
        item.title,
        `Your ${isService ? "service" : "event"} "${item.title}" was rejected.`,
        moderatorNote,
        analysis.flags || [],
        "rejected",
        score
      );
    }
  }

  return decision;
}

// Process single item (event or service)
async function processItem(rawDoc, collectionName) {
  const db = getDB();
  const isService = collectionName === "services";
  const item = isService ? normalizeService(rawDoc) : normalizeEvent(rawDoc);
  const itemId = item.id;
  const mongoId = rawDoc._id;

  console.log(`  📋 [${collectionName.toUpperCase()}] "${item.title}" (${itemId})`);

  // Cache check
  if (rawDoc.aiAnalysis?.riskScore !== undefined) {
    console.log(`  📦 Cache found (score: ${rawDoc.aiAnalysis.riskScore}) — skipping OpenAI`);
    const currentStatus =
      rawDoc.admin_status || rawDoc.moderationStatus || rawDoc.status || "pending";
    if (currentStatus === "pending" || currentStatus === "flagged") {
      await applyDecision(rawDoc.aiAnalysis, mongoId, itemId, item, collectionName);
      return rawDoc.aiAnalysis.riskScore >= BOT_CONFIG.REJECT_THRESHOLD
        ? "rejected"
        : rawDoc.aiAnalysis.riskScore <= BOT_CONFIG.APPROVE_THRESHOLD
        ? "approved"
        : "needs_review";
    }
    return "cached";
  }

  // Fresh AI analysis (text + image)
  console.log(`  🤖 Calling OpenAI (text + image)...`);
  const analysis = await runAIAnalysis(item, collectionName);
  console.log(`  📊 Score: ${analysis.riskScore}/100 (${analysis.riskLevel.toUpperCase()})`);

  // Save to MongoDB
  try {
    await db
      .collection(collectionName)
      .updateOne({ _id: mongoId }, { $set: { aiAnalysis: analysis, updatedAt: new Date() } });
    console.log(`  💾 Cached in MongoDB (with image analysis)`);
  } catch (saveErr) {
    console.warn(`  ⚠️ Cache save failed: ${saveErr.message}`);
  }

  return await applyDecision(analysis, mongoId, itemId, item, collectionName);
}
// ─── Main Bot Cycle ─────────────────────────────────────────────────────────────
export async function runBotCycle() {
  const db = getDB();
  if (!db) {
    console.log("⏳ Bot: DB not ready, retrying...");
    setTimeout(runBotCycle, 10000);
    return;
  }
  if (botStats.isRunning) {
    console.log("⏳ Bot: Previous cycle still running, skipping...");
    setTimeout(runBotCycle, BOT_CONFIG.INTERVAL_MS);
    return;
  }

  botStats.isRunning = true;
  botStats.totalRuns++;
  botStats.lastRunAt = new Date().toISOString();
  const runStart = Date.now();

  console.log("\n" + "═".repeat(60));
  console.log(`🤖 BOT CYCLE #${botStats.totalRuns} — ${new Date().toLocaleString("en-IN")}`);
  console.log(
    `   Settings: approve≤${BOT_CONFIG.APPROVE_THRESHOLD}% | reject≥${BOT_CONFIG.REJECT_THRESHOLD}% | interval=${BOT_CONFIG.INTERVAL_MS / 60000}min`
  );
  console.log("═".repeat(60));

  let cycleAnalyzed = 0,
    cycleApproved = 0,
    cycleRejected = 0,
    cycleNeedsReview = 0,
    cycleErrors = 0;

  try {
    const pendingEvents = await db
      .collection("events")
      .find({
        $or: [
          { admin_status: "pending" },
          {
            admin_status: { $exists: false },
            moderationStatus: { $exists: false },
          },
        ],
      })
      .limit(50)
      .toArray();

    const pendingServices = await db
      .collection("services")
      .find({
        $or: [
          { admin_status: "pending" },
          {
            admin_status: { $exists: false },
            moderationStatus: { $exists: false },
          },
          { status: "pending" },
        ],
      })
      .limit(50)
      .toArray();

    const totalToProcess = pendingEvents.length + pendingServices.length;
    console.log(
      `📋 Found: ${pendingEvents.length} events + ${pendingServices.length} services to process`
    );

    if (totalToProcess === 0) {
      console.log("✨ Nothing to process — all items are up to date!");
      botStats.isRunning = false;
      setTimeout(runBotCycle, BOT_CONFIG.INTERVAL_MS);
      return;
    }

    if (pendingEvents.length > 0) {
      console.log(`\n📅 Processing ${pendingEvents.length} EVENTS...`);
      for (const eventDoc of pendingEvents) {
        try {
          const result = await processItem(eventDoc, "events");
          cycleAnalyzed++;
          if (result === "approved") cycleApproved++;
          else if (result === "rejected") cycleRejected++;
          else if (result === "needs_review") cycleNeedsReview++;
          await new Promise((r) => setTimeout(r, 1500));
        } catch (err) {
          cycleErrors++;
          console.error(`  ❌ Error: ${err.message}`);
        }
      }
    }

    if (pendingServices.length > 0) {
      console.log(`\n🔧 Processing ${pendingServices.length} SERVICES...`);
      for (const serviceDoc of pendingServices) {
        try {
          const result = await processItem(serviceDoc, "services");
          cycleAnalyzed++;
          if (result === "approved") cycleApproved++;
          else if (result === "rejected") cycleRejected++;
          else if (result === "needs_review") cycleNeedsReview++;
          await new Promise((r) => setTimeout(r, 1500));
        } catch (err) {
          cycleErrors++;
          console.error(`  ❌ Error: ${err.message}`);
        }
      }
    }

    botStats.totalAnalyzed += cycleAnalyzed;
    botStats.totalApproved += cycleApproved;
    botStats.totalRejected += cycleRejected;
    botStats.totalNeedsReview += cycleNeedsReview;
    botStats.totalErrors += cycleErrors;

    const elapsed = Math.round((Date.now() - runStart) / 1000);

    try {
      await db.collection("bot_logs").insertOne({
        runNumber: botStats.totalRuns,
        ranAt: new Date(),
        durationSec: elapsed,
        analyzed: cycleAnalyzed,
        approved: cycleApproved,
        rejected: cycleRejected,
        needsReview: cycleNeedsReview,
        errors: cycleErrors,
      });
    } catch (_) {}

    console.log("\n" + "─".repeat(60));
    console.log(`📊 CYCLE #${botStats.totalRuns} COMPLETE (${elapsed}s)`);
    console.log(
      `   ✅ Approved: ${cycleApproved} | ❌ Rejected: ${cycleRejected} | 🟡 Review: ${cycleNeedsReview} | ⚠️ Errors: ${cycleErrors}`
    );
    console.log(
      `   📈 All-time: Approved=${botStats.totalApproved} | Rejected=${botStats.totalRejected} | Total=${botStats.totalAnalyzed}`
    );
    console.log(`   ⏰ Next run in ${BOT_CONFIG.INTERVAL_MS / 60000} minutes...`);
    console.log("─".repeat(60) + "\n");
  } catch (err) {
    console.error(`❌ BOT CYCLE ERROR: ${err.message}`);
    botStats.totalErrors++;
  } finally {
    botStats.isRunning = false;
    setTimeout(runBotCycle, BOT_CONFIG.INTERVAL_MS);
  }
}

// ─── Start Background Bot ──────────────────────────────────────────────────────
export function startBackgroundBot() {
  if (!BOT_CONFIG.ENABLED) {
    console.log("⏸ Background bot is DISABLED (BOT_ENABLED=false in .env)");
    return;
  }
  console.log("\n" + "🤖".repeat(20));
  console.log("🤖 BACKGROUND BOT STARTING (with Image Analysis)...");
  console.log(`   ✅ Auto-approve if risk ≤ ${BOT_CONFIG.APPROVE_THRESHOLD}%`);
  console.log(`   ❌ Auto-reject if risk ≥ ${BOT_CONFIG.REJECT_THRESHOLD}%`);
  console.log(
    `   🟡 Needs review: ${BOT_CONFIG.APPROVE_THRESHOLD}% - ${BOT_CONFIG.REJECT_THRESHOLD}%`
  );
  console.log(`   ⏱  Runs every ${BOT_CONFIG.INTERVAL_MS / 60000} minutes`);
  console.log(`   🖼️  Image analysis: GPT-4o Vision (text 75% + image 25%)`);
  console.log(`   💾 Results cached in MongoDB`);
  console.log("🤖".repeat(20) + "\n");
  setTimeout(runBotCycle, 10000);
}