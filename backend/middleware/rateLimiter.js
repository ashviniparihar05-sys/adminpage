// // backend/middleware/rateLimiter.js

// import rateLimit from "express-rate-limit";

// // General API limiter
// export const apiLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 min
//   max: 300, // max requests
//   message: {
//     error: "Too many requests, please try again later.",
//   },
//   standardHeaders: true,
//   legacyHeaders: false,
// });

// // AI analyze endpoints limiter
// export const analyzeLimiter = rateLimit({
//   windowMs: 5 * 60 * 1000, // 5 min
//   max: 20,
//   message: {
//     error: "Too many AI analysis requests.",
//   },
// });

// // Bot trigger limiter
// export const botTriggerLimiter = rateLimit({
//   windowMs: 10 * 60 * 1000,
//   max: 5,
//   message: {
//     error: "Too many bot trigger requests.",
//   },
// });

// // Optional bot limiter
// export const botLimiter = rateLimit({
//   windowMs: 1 * 60 * 1000,
//   max: 30,
//   message: {
//     error: "Bot rate limit exceeded.",
//   },
// });

// backend/middleware/rateLimiter.js

import rateLimit from "express-rate-limit";

// General API limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 300, // max requests
  message: {
    error: "Too many requests, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// AI analyze endpoints limiter
export const analyzeLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 min
  max: 20,
  message: {
    error: "Too many AI analysis requests.",
  },
});

// Bot trigger limiter
export const botTriggerLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: {
    error: "Too many bot trigger requests.",
  },
});

// Optional bot limiter
export const botLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
  message: {
    error: "Bot rate limit exceeded.",
  },
});