// // backend/utils/reputation.js
// // User reputation calculation

// export function calculateReputation({
//   rating = 0,
//   reviewsCount = 0,
//   eventsHosted = 0,
//   eventsAttended = 0,
//   isBanned = false,
//   isSuspended = false,
// }) {
//   let score = 0;

//   if (rating > 0) {
//     score += (rating / 5) * 40 + Math.min(10, reviewsCount * 0.5);
//   }

//   score += Math.min(25, eventsHosted * 2.5);
//   score += Math.min(15, eventsAttended * 1.5);

//   const total = eventsHosted + eventsAttended;
//   if (total > 20) score += 10;
//   else if (total > 10) score += 5;

//   if (isSuspended) score -= 20;
//   if (isBanned) score -= 50;

//   return Math.max(0, Math.min(100, Math.round(score)));
// }
// backend/utils/reputation.js
// User reputation calculation

export function calculateReputation({
  rating = 0,
  reviewsCount = 0,
  eventsHosted = 0,
  eventsAttended = 0,
  isBanned = false,
  isSuspended = false,
}) {
  let score = 0;

  if (rating > 0) {
    score += (rating / 5) * 40 + Math.min(10, reviewsCount * 0.5);
  }

  score += Math.min(25, eventsHosted * 2.5);
  score += Math.min(15, eventsAttended * 1.5);

  const total = eventsHosted + eventsAttended;
  if (total > 20) score += 10;
  else if (total > 10) score += 5;

  if (isSuspended) score -= 20;
  if (isBanned) score -= 50;

  return Math.max(0, Math.min(100, Math.round(score)));
} 