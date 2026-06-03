// // backend/config/openai.js
// import OpenAI from "openai";
// import dotenv from "dotenv";
// dotenv.config();

// if (!process.env.OPENAI_API_KEY) {
//   console.error("❌ OPENAI_API_KEY missing in .env file!");
//   process.exit(1);
// }

// // ✅ Rate limiting - max 100 calls per hour per IP
// const apiCallLimits = new Map();

// export function checkRateLimit(ip) {
//   const now = Date.now();
//   const userCalls = apiCallLimits.get(ip) || { count: 0, resetTime: now + 3600000 };
  
//   if (now > userCalls.resetTime) {
//     userCalls.count = 0;
//     userCalls.resetTime = now + 3600000;
//   }
  
//   if (userCalls.count >= 100) {
//     throw new Error("Rate limit exceeded. Try again in 1 hour.");
//   }
  
//   userCalls.count++;
//   apiCallLimits.set(ip, userCalls);
// }

// export const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
//   maxRetries: 2,
//   timeout: 30000, // 30 seconds
// });
// backend/config/openai.js
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.OPENAI_API_KEY) {
  console.error("❌ OPENAI_API_KEY missing in .env file!");
  process.exit(1);
}

// ✅ Rate limiting - max 100 calls per hour per IP
const apiCallLimits = new Map();

export function checkRateLimit(ip) {
  const now = Date.now();
  const userCalls = apiCallLimits.get(ip) || { count: 0, resetTime: now + 3600000 };
  
  if (now > userCalls.resetTime) {
    userCalls.count = 0;
    userCalls.resetTime = now + 3600000;
  }
  
  if (userCalls.count >= 100) {
    throw new Error("Rate limit exceeded. Try again in 1 hour.");
  }
  
  userCalls.count++;
  apiCallLimits.set(ip, userCalls);
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  maxRetries: 2,
  timeout: 30000, // 30 seconds
});