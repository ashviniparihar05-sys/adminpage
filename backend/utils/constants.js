// // // backend/utils/constants.js
// // // App-wide constants

// // export const GENERIC_IMAGE_DOMAINS = [
// //   "unsplash.com",
// //   "placehold.co",
// //   "picsum.photos",
// //   "ui-avatars.com",
// //   "via.placeholder.com",
// //   "loremflickr.com",
// //   "dummyimage.com",
// //   "placeimg.com",
// // ];

// // export const VALID_STATUSES = [
// //   "approved",
// //   "rejected",
// //   "pending",
// //   "flagged",
// //   "under_review",
// // ];
// // // backend/utils/constants.js

// // export const GENERIC_IMAGE_DOMAINS = [
// //   "unsplash.com", "placehold.co", "picsum.photos",
// //   "ui-avatars.com", "via.placeholder.com", "loremflickr.com",
// //   "dummyimage.com", "placeimg.com",
// // ];

// // export const VALID_STATUSES = [
// //   "approved", "rejected", "pending", "flagged", "under_review",
// // ];

// // // ✅ NEW: User moderation action types (used in routes + bot)
// // export const MODERATION_ACTIONS = {
// //   SUSPEND_7D:   "suspend_7d",        // 7-day temporary suspension
// //   PERMANENT_BAN: "permanent_ban",    // Permanent ban, no auto-lift
// //   UNSUSPEND:    "unsuspend",         // Manually lift suspension early
// //   UNBAN:        "unban",             // Reverse a permanent ban
// // };

// // // ✅ NEW: How many bot-rejected listings trigger auto-suspension
// // export const AUTO_SUSPEND_THRESHOLD = 3;  // 3 rejections → 7-day suspend
// // export const AUTO_BAN_THRESHOLD     = 6;  // 6 total rejections → permanent ban
// // // (you can adjust these numbers any time)
// // backend/utils/constants.js
// // App-wide constants

// // ✅ FIXED: Pehle GENERIC_IMAGE_DOMAINS do baar thi — ek hi rakhi

// export const GENERIC_IMAGE_DOMAINS = [
//   "unsplash.com",
//   "placehold.co",
//   "picsum.photos",
//   "ui-avatars.com",
//   "via.placeholder.com",
//   "loremflickr.com",
//   "dummyimage.com",
//   "placeimg.com",
// ];

// export const VALID_STATUSES = [
//   "approved",
//   "rejected",
//   "pending",
//   "flagged",
//   "under_review",
// ];

// // ✅ NEW: Moderation action types — suspend/ban/lift ke liye
// export const MODERATION_ACTIONS = {
//   SUSPEND_7D:    "suspend_7d",
//   PERMANENT_BAN: "permanent_ban",
//   UNSUSPEND:     "unsuspend",
//   UNBAN:         "unban",
// };

// // ✅ NEW: Bot auto-action thresholds
// // Kitne rejections ke baad auto-suspend ya auto-ban hoga
// export const AUTO_SUSPEND_THRESHOLD = 3;  // 3 rejections → 7-day suspend
// export const AUTO_BAN_THRESHOLD     = 6;  // 6 rejections → permanent ban
// backend/utils/constants.js
// App-wide constants

export const GENERIC_IMAGE_DOMAINS = [
  "unsplash.com",
  "placehold.co",
  "picsum.photos",
  "ui-avatars.com",
  "via.placeholder.com",
  "loremflickr.com",
  "dummyimage.com",
  "placeimg.com",
];

export const VALID_STATUSES = [
  "approved",
  "rejected",
  "pending",
  "flagged",
  "under_review",
];