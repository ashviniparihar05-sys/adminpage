// // backend/models/event.normalizer.js
// // Event data normalizer

// export function normalizeEvent(doc) {
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
//     host: doc.host || doc.creatorName || doc.creatorClerkId,
//     image:
//       doc.image ||
//       doc.banner ||
//       doc.bannerUri ||
//       doc.imageUrl ||
//       "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600",
//     category: doc.category || doc.kind || "Other",
//     dateSubmitted: doc.createdAt || doc.dateSubmitted || new Date().toISOString(),
//     eventDate: doc.date || doc.eventDate || doc.startDate || "",
//     location: locationStr,
//     ticketPrice:
//       doc.kind === "free"
//         ? "Free"
//         : doc.priceCents
//         ? `₹${Math.round(doc.priceCents / 100)}`
//         : doc.ticketPrice || "Free",
//     capacity: doc.capacity || doc.attendance || 100,
//     description: doc.description || "No description provided.",
//     status: doc.admin_status || doc.moderationStatus || "pending",
//     attendeesCount: Array.isArray(doc.attendees) ? doc.attendees.length : 0,
//     aiAnalysis: doc.aiAnalysis || null,
//     creatorClerkId: doc.creatorClerkId || null,
//     kind: "event",
//   };
// }

// backend/models/event.normalizer.js
// Event data normalizer

export function normalizeEvent(doc) {
  let locationStr = "Location TBD";
  if (doc.location) {
    if (typeof doc.location === "object" && doc.location.formattedAddress) {
      locationStr = doc.location.formattedAddress;
    } else if (typeof doc.location === "object") {
      locationStr =
        doc.location.city ||
        doc.location.address ||
        `${doc.location.lat || ""}, ${doc.location.lng || ""}`;
    } else {
      locationStr = doc.location;
    }
  }

  return {
    id: doc._id?.toString() || doc.id || `EV-${Date.now()}`,
    title: doc.title || "Untitled Event",
    host: doc.host || doc.creatorName || doc.creatorClerkId,
    image:
      doc.image ||
      doc.banner ||
      doc.bannerUri ||
      doc.imageUrl ||
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600",
    category: doc.category || doc.kind || "Other",
    dateSubmitted: doc.createdAt || doc.dateSubmitted || new Date().toISOString(),
    eventDate: doc.date || doc.eventDate || doc.startDate || "",
    location: locationStr,
    ticketPrice:
      doc.kind === "free"
        ? "Free"
        : doc.priceCents
        ? `₹${Math.round(doc.priceCents / 100)}`
        : doc.ticketPrice || "Free",
    capacity: doc.capacity || doc.attendance || 100,
    description: doc.description || "No description provided.",
    status: doc.admin_status || doc.moderationStatus || "pending",
    attendeesCount: Array.isArray(doc.attendees) ? doc.attendees.length : 0,
    aiAnalysis: doc.aiAnalysis || null,
    creatorClerkId: doc.creatorClerkId || null,
    kind: "event",
  };
}