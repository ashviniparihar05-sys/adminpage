// // backend/config/bot.config.js
// // Bot configuration and stats
// import dotenv from "dotenv";
// dotenv.config();

// export const BOT_CONFIG = {
//   APPROVE_THRESHOLD: parseInt(process.env.BOT_APPROVE_THRESHOLD || "30"),
//   REJECT_THRESHOLD: parseInt(process.env.BOT_REJECT_THRESHOLD || "70"),
//   INTERVAL_MS: parseInt(process.env.BOT_INTERVAL_MINUTES || "5") * 60 * 1000,
//   ENABLED: process.env.BOT_ENABLED !== "false",
  
//   // ✅ NEW: Off-peak hours mein zyada run karo
//   PEAK_HOURS: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18], // 9 AM - 6 PM
//   OFF_PEAK_INTERVAL_MS: 2 * 60 * 1000, // 2 minutes (faster processing)
// };

// export const botStats = {
//   totalRuns: 0,
//   lastRunAt: null,
//   totalAnalyzed: 0,
//   totalApproved: 0,
//   totalRejected: 0,
//   totalNeedsReview: 0,
//   totalErrors: 0,
//   isRunning: false,
// };

// backend/config/bot.config.js
// Bot configuration and stats
import dotenv from "dotenv";
dotenv.config();

export const BOT_CONFIG = {
  APPROVE_THRESHOLD: parseInt(process.env.BOT_APPROVE_THRESHOLD || "30"),
  REJECT_THRESHOLD: parseInt(process.env.BOT_REJECT_THRESHOLD || "70"),
  INTERVAL_MS: parseInt(process.env.BOT_INTERVAL_MINUTES || "5") * 60 * 1000,
  ENABLED: process.env.BOT_ENABLED !== "false",
  
  // ✅ NEW: Off-peak hours mein zyada run karo
  PEAK_HOURS: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18], // 9 AM - 6 PM
  OFF_PEAK_INTERVAL_MS: 2 * 60 * 1000, // 2 minutes (faster processing)
};

export const botStats = {
  totalRuns: 0,
  lastRunAt: null,
  totalAnalyzed: 0,
  totalApproved: 0,
  totalRejected: 0,
  totalNeedsReview: 0,
  totalErrors: 0,
  isRunning: false,
};