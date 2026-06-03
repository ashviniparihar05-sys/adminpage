// // backend/routes/bot.routes.js
// // Bot status and trigger endpoints

// import express from "express";
// import { getDB } from "../config/database.js";
// import { BOT_CONFIG, botStats } from "../config/bot.config.js";
// import { runBotCycle } from "../services/bot.service.js";
// import { botTriggerLimiter } from "../middleware/rateLimiter.js";
// const router = express.Router();
// // remove this
// import { botLimiter } from "../middleware/rateLimiter.js";
// // GET /bot/status
// router.get("/status", async (req, res) => {
//   try {
//     const db = getDB();
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
//       enabled: BOT_CONFIG.ENABLED,
//       isRunning: botStats.isRunning,
//       config: {
//         approveThreshold: BOT_CONFIG.APPROVE_THRESHOLD,
//         rejectThreshold: BOT_CONFIG.REJECT_THRESHOLD,
//         intervalMinutes: BOT_CONFIG.INTERVAL_MS / 60000,
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

// // POST /bot/trigger
// router.post("/trigger", botTriggerLimiter, async (req, res) => {
//   if (!BOT_CONFIG.ENABLED) return res.status(400).json({ error: "Bot is disabled" });
//   if (botStats.isRunning) return res.status(400).json({ error: "Bot already running" });
//   res.json({ message: "Bot cycle triggered" });
//   runBotCycle();
// });

// export default router;
// backend/routes/bot.routes.js
// Bot status and trigger endpoints

import express from "express";
import { getDB } from "../config/database.js";
import { BOT_CONFIG, botStats } from "../config/bot.config.js";
import { runBotCycle } from "../services/bot.service.js";
import { botTriggerLimiter } from "../middleware/rateLimiter.js";
const router = express.Router();
// remove this
import { botLimiter } from "../middleware/rateLimiter.js";
// GET /bot/status
router.get("/status", async (req, res) => {
  try {
    const db = getDB();
    let recentLogs = [];
    if (db) {
      recentLogs = await db
        .collection("bot_logs")
        .find({})
        .sort({ ranAt: -1 })
        .limit(10)
        .toArray();
    }
    res.json({
      enabled: BOT_CONFIG.ENABLED,
      isRunning: botStats.isRunning,
      config: {
        approveThreshold: BOT_CONFIG.APPROVE_THRESHOLD,
        rejectThreshold: BOT_CONFIG.REJECT_THRESHOLD,
        intervalMinutes: BOT_CONFIG.INTERVAL_MS / 60000,
      },
      stats: botStats,
      recentLogs: recentLogs.map((l) => ({
        runNumber: l.runNumber,
        ranAt: l.ranAt,
        durationSec: l.durationSec,
        analyzed: l.analyzed,
        approved: l.approved,
        rejected: l.rejected,
        needsReview: l.needsReview,
        errors: l.errors,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /bot/trigger
router.post("/trigger", botTriggerLimiter, async (req, res) => {
  if (!BOT_CONFIG.ENABLED) return res.status(400).json({ error: "Bot is disabled" });
  if (botStats.isRunning) return res.status(400).json({ error: "Bot already running" });
  res.json({ message: "Bot cycle triggered" });
  runBotCycle();
});

export default router;