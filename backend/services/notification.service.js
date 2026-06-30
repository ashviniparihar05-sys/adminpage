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
import { Expo } from "expo-server-sdk";

const expo = new Expo();

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

    // Push Notification Logic
    if (type === "event_rejected" || type === "service_rejected" || type === "event_approved" || type === "service_approved") {
      const user = await db.collection("users").findOne({ clerkUserId: creatorClerkId });
      const pushToken = user?.profile?.expoPushToken;

      if (pushToken && Expo.isExpoPushToken(pushToken)) {
        try {
          const isApproval = type.includes("approved");
          const pushTitle = isApproval ? "Event Live! 🎉" : "Action Required ⚠️";
          const pushBody = isApproval 
            ? `Your listing "${itemTitle}" has been approved and is now live!` 
            : `Your listing "${itemTitle}" was rejected. Tap to fix issues.`;

          await expo.sendPushNotificationsAsync([{
            to: pushToken,
            sound: "default",
            title: pushTitle,
            body: pushBody,
            data: { eventId: itemId, type: isApproval ? "approved" : "bot_alert" }
          }]);
          console.log(`  📱 Push Notification sent to ${creatorClerkId}`);
        } catch (pushErr) {
          console.warn(`  ⚠️ Push failed for ${creatorClerkId}: ${pushErr.message}`);
        }
      }
    }
  } catch (err) {
    console.warn(`  ⚠️ Notification failed: ${err.message}`);
  }
}