// // backend/models/service.normalizer.js
// // Service data normalizer

// export function normalizeService(doc) {
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
//   const scheduleSummary =
//     activeDays.length > 0 ? activeDays.join(", ") : "Schedule TBD";

//   return {
//     id: doc._id?.toString() || doc.id || `SV-${Date.now()}`,
//     title: doc.title || "Untitled Service",
//     host: doc.creatorName || doc.creatorClerkId || "Unknown Provider",
//     image:
//       doc.bannerUri ||
//       doc.image ||
//       doc.imageUrl ||
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
// backend/models/service.normalizer.js
// Service data normalizer

export function normalizeService(doc) {
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

  let ticketPrice = "Free";
  if (doc.priceCents && doc.priceCents > 0) {
    ticketPrice = `₹${Math.round(doc.priceCents / 100)}`;
    if (doc.rateType) ticketPrice += `/${doc.rateType}`;
  }

  const schedule = doc.serviceMetadata?.schedule || [];
  const activeDays = schedule.filter((d) => d.active).map((d) => d.day);
  const scheduleSummary =
    activeDays.length > 0 ? activeDays.join(", ") : "Schedule TBD";

  return {
    id: doc._id?.toString() || doc.id || `SV-${Date.now()}`,
    title: doc.title || "Untitled Service",
    host: doc.creatorName || doc.creatorClerkId || "Unknown Provider",
    image:
      doc.bannerUri ||
      doc.image ||
      doc.imageUrl ||
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600",
    category: doc.category || "Service",
    emoji: doc.emoji || "🛠️",
    dateSubmitted: doc.createdAt || new Date().toISOString(),
    location: locationStr,
    ticketPrice,
    rateType: doc.rateType || null,
    capacity: doc.capacity || null,
    description: doc.description || "No description provided.",
    status: doc.admin_status || doc.moderationStatus || doc.status || "pending",
    attendeesCount: Array.isArray(doc.attendees) ? doc.attendees.length : 0,
    joinPolicy: doc.joinPolicy || "open",
    scheduleSummary,
    meetupStyle: doc.serviceMetadata?.meetupStyle || null,
    minDuration: doc.serviceMetadata?.minDuration || null,
    aiAnalysis: doc.aiAnalysis || null,
    creatorClerkId: doc.creatorClerkId || null,
    kind: "service",
  };
}