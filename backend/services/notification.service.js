// // backend/services/notification.service.js
// // Notification helper

// import { getDB } from "../config/database.js";

// export async function saveNotification(
//   creatorClerkId,
//   type,
//   itemId,
//   itemTitle,
//   message,
//   moderatorNote = null,
//   flags = [],
//   approvalStatus = null,
//   riskScore = null
// ) {
//   try {
//     const db = getDB();
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
// backend/services/notification.service.js
// Notification helper

import { getDB } from "../config/database.js";

export async function saveNotification(
  creatorClerkId,
  type,
  itemId,
  itemTitle,
  message,
  moderatorNote = null,
  flags = [],
  approvalStatus = null,
  riskScore = null
) {
  try {
    const db = getDB();
    await db.collection("notifications").insertOne({
      recipientClerkId: creatorClerkId,
      type,
      eventId: type.startsWith("event") ? itemId : null,
      serviceId: type.startsWith("service") ? itemId : null,
      eventTitle: itemTitle,
      message,
      moderatorNote,
      flags,
      approvalStatus,
      riskScore,
      read: false,
      createdAt: new Date(),
      sentByBot: true,
    });
    console.log(`  🔔 Notification → ${creatorClerkId}`);
  } catch (err) {
    console.warn(`  ⚠️ Notification failed: ${err.message}`);
  }
}