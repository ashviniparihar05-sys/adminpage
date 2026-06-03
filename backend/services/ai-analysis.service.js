// // backend/services/ai-analysis.service.js
// // Combined text + image AI analysis

// import { openai } from "../config/openai.js";
// import { analyzeImageWithAI } from "./image-analysis.service.js";

// export async function runAIAnalysis(item, collectionName) {
//   const isService = collectionName === "services";

//   // Build text prompt
//   const textPrompt = isService
//     ? `You are a strict AI moderation system for a service marketplace. Analyze this service listing and detect fraud, fake profiles, or risky content.

// SCORING RULES:
// - HIGH RISK (70-100): Vague description, suspicious pricing, fake-sounding profile, requests for advance payment outside platform, unrealistic claims, adult/illegal service hints
// - MEDIUM RISK (40-69): minimal description, unusually high/low pricing, limited availability
// - LOW RISK (0-39): Clear description, reasonable pricing, professional tone, verifiable location, realistic schedule

// SERVICE LISTING:
// Title: ${item.title || "N/A"}
// Provider: ${item.host || "N/A"}
// Description: ${item.description || "N/A"}
// Price: ${item.ticketPrice || "N/A"}
// Rate Type: ${item.rateType || "N/A"}
// Location: ${item.location || "N/A"}
// Join Policy: ${item.joinPolicy || "N/A"}
// Availability: ${item.scheduleSummary || "N/A"}
// Meeting Style: ${item.meetupStyle || "N/A"}
// Min Duration: ${item.minDuration || "N/A"}

// Return ONLY valid JSON:
// {
//   "riskScore": <0-100>,
//   "riskLevel": "<low|medium|high|critical>",
//   "semanticIntegrity": <0-100>,
//   "hostLegitimacy": <0-100>,
//   "engagementPattern": <0-100>,
//   "flags": [{"type": "<name>", "description": "<specific reason>", "severity": "<low|medium|high>"}],
//   "summary": "<2-3 sentences about THIS service>",
//   "recommendation": "<one actionable sentence>"
// }`
//     : `You are a strict AI moderation system for an event platform. Analyze this event and detect fraud, scams, or risky content.

// SCORING RULES:
// - HIGH RISK (70-100): Vague details, suspicious payment, hidden location, unrealistic claims, drug references
// - MEDIUM RISK (40-69): missing details, high price with few details
// - LOW RISK (0-39): Clear description, reasonable price, known venue, professional tone

// EVENT:
// Title: ${item.title || "N/A"}
// Host: ${item.host || "N/A"}
// Category: ${item.category || "N/A"}
// Description: ${item.description || "N/A"}
// Price: ${item.ticketPrice || "N/A"}
// Location: ${item.location || "N/A"}
// Capacity: ${item.capacity || "N/A"}

// Return ONLY valid JSON:
// {
//   "riskScore": <0-100>,
//   "riskLevel": "<low|medium|high|critical>",
//   "semanticIntegrity": <0-100>,
//   "hostLegitimacy": <0-100>,
//   "engagementPattern": <0-100>,
//   "flags": [{"type": "<name>", "description": "<specific reason>", "severity": "<low|medium|high>"}],
//   "summary": "<2-3 sentences about THIS event>",
//   "recommendation": "<one actionable sentence>"
// }`;

//   // Run text + image analysis in PARALLEL
//   const imageContext = {
//     title: item.title,
//     category: item.category,
//     description: item.description,
//   };

//   const [textResponse, imageAnalysis] = await Promise.all([
//     openai.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages: [
//         {
//           role: "system",
//           content:
//             "You are a fraud detection AI. Return valid JSON only. Vary scores based on actual content.",
//         },
//         { role: "user", content: textPrompt },
//       ],
//       temperature: 0.7,
//       response_format: { type: "json_object" },
//     }),
//     analyzeImageWithAI(item.image, imageContext),
//   ]);

//   // Parse text result
//   const parsed = JSON.parse(textResponse.choices[0].message.content || "{}");
//   const textRiskScore = Math.min(100, Math.max(0, parsed.riskScore ?? 50));
//   const imageRiskScore = imageAnalysis?.imageRiskScore ?? 0;

//   // Combined score: Text 75% + Image 25%
//   let combinedRiskScore = Math.round(textRiskScore * 0.75 + imageRiskScore * 0.25);

//   // Hard overrides
//   if (imageAnalysis && imageAnalysis.isAppropriate === false) {
//     combinedRiskScore = Math.max(combinedRiskScore, 75);
//   }
//   if (imageAnalysis && imageAnalysis.isRelevant === false && textRiskScore >= 50) {
//     combinedRiskScore = Math.min(100, combinedRiskScore + 10);
//   }
//   if (
//     imageAnalysis?.suspiciousText &&
//     imageAnalysis.suspiciousText !== "none" &&
//     imageAnalysis.suspiciousText.length > 4
//   ) {
//     combinedRiskScore = Math.min(100, combinedRiskScore + 15);
//   }

//   combinedRiskScore = Math.min(100, Math.max(0, combinedRiskScore));

//   // Risk level from combined score
//   let combinedRiskLevel;
//   if (combinedRiskScore >= 75) combinedRiskLevel = "critical";
//   else if (combinedRiskScore >= 55) combinedRiskLevel = "high";
//   else if (combinedRiskScore >= 35) combinedRiskLevel = "medium";
//   else combinedRiskLevel = "low";

//   // Merge flags: text + image
//   const textFlags = Array.isArray(parsed.flags) ? parsed.flags : [];
//   const imageFlags = (imageAnalysis?.flags || []).map((f) => ({
//     ...f,
//     type: `[Image] ${f.type}`,
//     source: "image",
//   }));
//   const allFlags = [...textFlags, ...imageFlags];

//   // Image summary note
//   let imageSummaryNote = "";
//   if (imageAnalysis) {
//     if (!imageAnalysis.isAppropriate) {
//       imageSummaryNote = ` ⚠️ Image contains inappropriate/NSFW content: ${imageAnalysis.appropriatenessNote}.`;
//     } else if (
//       imageAnalysis.suspiciousText &&
//       imageAnalysis.suspiciousText !== "none" &&
//       imageAnalysis.suspiciousText.length > 4
//     ) {
//       imageSummaryNote = ` Suspicious text detected in image: "${imageAnalysis.suspiciousText}".`;
//     } else if (!imageAnalysis.isRelevant && imageAnalysis.checked) {
//       imageSummaryNote = ` The uploaded image does not match the event — ${imageAnalysis.relevanceNote}`;
//     } else if (imageAnalysis.isPlaceholder && !imageAnalysis.checked) {
//       imageSummaryNote = " Event uses a generic stock/placeholder image.";
//     } else if (!imageAnalysis.checked && imageAnalysis.reason) {
//       imageSummaryNote = ` Image issue: ${imageAnalysis.reason}.`;
//     }
//   }

//   console.log(
//     `  📊 Text: ${textRiskScore} | Image: ${imageRiskScore} | Combined: ${combinedRiskScore} (${combinedRiskLevel.toUpperCase()})`
//   );
//   if (imageSummaryNote) {
//     console.log(`  🖼️  ${imageSummaryNote.trim()}`);
//   }

//   return {
//     riskScore: combinedRiskScore,
//     riskLevel: combinedRiskLevel,
//     semanticIntegrity: Math.min(100, Math.max(0, parsed.semanticIntegrity ?? 80)),
//     hostLegitimacy: Math.min(100, Math.max(0, parsed.hostLegitimacy ?? 80)),
//     engagementPattern: Math.min(100, Math.max(0, parsed.engagementPattern ?? 80)),
//     flags: allFlags,
//     summary: (parsed.summary ?? "Analysis complete.") + imageSummaryNote,
//     recommendation: parsed.recommendation ?? "Manual review recommended.",
//     scannedAt: new Date().toISOString(),
//     imageAnalysis: {
//       imageUrl: item.image || null,
//       checked: imageAnalysis?.checked ?? false,
//       imageRiskScore,
//       isRelevant: imageAnalysis?.isRelevant ?? null,
//       isAppropriate: imageAnalysis?.isAppropriate ?? null,
//       isPlaceholder: imageAnalysis?.isPlaceholder ?? null,
//       relevanceNote: imageAnalysis?.relevanceNote ?? "",
//       appropriatenessNote: imageAnalysis?.appropriatenessNote ?? "",
//       placeholderNote: imageAnalysis?.placeholderNote ?? "",
//       suspiciousText: imageAnalysis?.suspiciousText ?? "none",
//       dominantContent: imageAnalysis?.dominantContent ?? "",
//       reason: imageAnalysis?.reason ?? null,
//     },
//     scoreBreakdown: {
//       textRiskScore,
//       imageRiskScore,
//       combinedNote: `Text: ${textRiskScore} × 75% + Image: ${imageRiskScore} × 25% = ${combinedRiskScore}`,
//     },
//   };
// }
// backend/services/ai-analysis.service.js
// Combined text + image AI analysis

import { openai } from "../config/openai.js";
import { analyzeImageWithAI } from "./image-analysis.service.js";

export async function runAIAnalysis(item, collectionName) {
  const isService = collectionName === "services";

  // Build text prompt
  const textPrompt = isService
    ? `You are a strict AI moderation system for a service marketplace. Analyze this service listing and detect fraud, fake profiles, or risky content.

SCORING RULES:
- HIGH RISK (70-100): Vague description, suspicious pricing, fake-sounding profile, requests for advance payment outside platform, unrealistic claims, adult/illegal service hints
- MEDIUM RISK (40-69): minimal description, unusually high/low pricing, limited availability
- LOW RISK (0-39): Clear description, reasonable pricing, professional tone, verifiable location, realistic schedule

SERVICE LISTING:
Title: ${item.title || "N/A"}
Provider: ${item.host || "N/A"}
Description: ${item.description || "N/A"}
Price: ${item.ticketPrice || "N/A"}
Rate Type: ${item.rateType || "N/A"}
Location: ${item.location || "N/A"}
Join Policy: ${item.joinPolicy || "N/A"}
Availability: ${item.scheduleSummary || "N/A"}
Meeting Style: ${item.meetupStyle || "N/A"}
Min Duration: ${item.minDuration || "N/A"}

Return ONLY valid JSON:
{
  "riskScore": <0-100>,
  "riskLevel": "<low|medium|high|critical>",
  "semanticIntegrity": <0-100>,
  "hostLegitimacy": <0-100>,
  "engagementPattern": <0-100>,
  "flags": [{"type": "<name>", "description": "<specific reason>", "severity": "<low|medium|high>"}],
  "summary": "<2-3 sentences about THIS service>",
  "recommendation": "<one actionable sentence>"
}`
    : `You are a strict AI moderation system for an event platform. Analyze this event and detect fraud, scams, or risky content.

SCORING RULES:
- HIGH RISK (70-100): Vague details, suspicious payment, hidden location, unrealistic claims, drug references
- MEDIUM RISK (40-69): missing details, high price with few details
- LOW RISK (0-39): Clear description, reasonable price, known venue, professional tone

EVENT:
Title: ${item.title || "N/A"}
Host: ${item.host || "N/A"}
Category: ${item.category || "N/A"}
Description: ${item.description || "N/A"}
Price: ${item.ticketPrice || "N/A"}
Location: ${item.location || "N/A"}
Capacity: ${item.capacity || "N/A"}

Return ONLY valid JSON:
{
  "riskScore": <0-100>,
  "riskLevel": "<low|medium|high|critical>",
  "semanticIntegrity": <0-100>,
  "hostLegitimacy": <0-100>,
  "engagementPattern": <0-100>,
  "flags": [{"type": "<name>", "description": "<specific reason>", "severity": "<low|medium|high>"}],
  "summary": "<2-3 sentences about THIS event>",
  "recommendation": "<one actionable sentence>"
}`;

  // Run text + image analysis in PARALLEL
  const imageContext = {
    title: item.title,
    category: item.category,
    description: item.description,
  };

  const [textResponse, imageAnalysis] = await Promise.all([
    openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a fraud detection AI. Return valid JSON only. Vary scores based on actual content.",
        },
        { role: "user", content: textPrompt },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    }),
    analyzeImageWithAI(item.image, imageContext),
  ]);

  // Parse text result
  const parsed = JSON.parse(textResponse.choices[0].message.content || "{}");
  const textRiskScore = Math.min(100, Math.max(0, parsed.riskScore ?? 50));
  const imageRiskScore = imageAnalysis?.imageRiskScore ?? 0;

  // Combined score: Text 75% + Image 25%
  let combinedRiskScore = Math.round(textRiskScore * 0.75 + imageRiskScore * 0.25);

  // Hard overrides
  if (imageAnalysis && imageAnalysis.isAppropriate === false) {
    combinedRiskScore = Math.max(combinedRiskScore, 75);
  }
  if (imageAnalysis && imageAnalysis.isRelevant === false && textRiskScore >= 50) {
    combinedRiskScore = Math.min(100, combinedRiskScore + 10);
  }
  if (
    imageAnalysis?.suspiciousText &&
    imageAnalysis.suspiciousText !== "none" &&
    imageAnalysis.suspiciousText.length > 4
  ) {
    combinedRiskScore = Math.min(100, combinedRiskScore + 15);
  }

  combinedRiskScore = Math.min(100, Math.max(0, combinedRiskScore));

  // Risk level from combined score
  let combinedRiskLevel;
  if (combinedRiskScore >= 75) combinedRiskLevel = "critical";
  else if (combinedRiskScore >= 55) combinedRiskLevel = "high";
  else if (combinedRiskScore >= 35) combinedRiskLevel = "medium";
  else combinedRiskLevel = "low";

  // Merge flags: text + image
  const textFlags = Array.isArray(parsed.flags) ? parsed.flags : [];
  const imageFlags = (imageAnalysis?.flags || []).map((f) => ({
    ...f,
    type: `[Image] ${f.type}`,
    source: "image",
  }));
  const allFlags = [...textFlags, ...imageFlags];

  // Image summary note
  let imageSummaryNote = "";
  if (imageAnalysis) {
    if (!imageAnalysis.isAppropriate) {
      imageSummaryNote = ` ⚠️ Image contains inappropriate/NSFW content: ${imageAnalysis.appropriatenessNote}.`;
    } else if (
      imageAnalysis.suspiciousText &&
      imageAnalysis.suspiciousText !== "none" &&
      imageAnalysis.suspiciousText.length > 4
    ) {
      imageSummaryNote = ` Suspicious text detected in image: "${imageAnalysis.suspiciousText}".`;
    } else if (!imageAnalysis.isRelevant && imageAnalysis.checked) {
      imageSummaryNote = ` The uploaded image does not match the event — ${imageAnalysis.relevanceNote}`;
    } else if (imageAnalysis.isPlaceholder && !imageAnalysis.checked) {
      imageSummaryNote = " Event uses a generic stock/placeholder image.";
    } else if (!imageAnalysis.checked && imageAnalysis.reason) {
      imageSummaryNote = ` Image issue: ${imageAnalysis.reason}.`;
    }
  }

  console.log(
    `  📊 Text: ${textRiskScore} | Image: ${imageRiskScore} | Combined: ${combinedRiskScore} (${combinedRiskLevel.toUpperCase()})`
  );
  if (imageSummaryNote) {
    console.log(`  🖼️  ${imageSummaryNote.trim()}`);
  }

  return {
    riskScore: combinedRiskScore,
    riskLevel: combinedRiskLevel,
    semanticIntegrity: Math.min(100, Math.max(0, parsed.semanticIntegrity ?? 80)),
    hostLegitimacy: Math.min(100, Math.max(0, parsed.hostLegitimacy ?? 80)),
    engagementPattern: Math.min(100, Math.max(0, parsed.engagementPattern ?? 80)),
    flags: allFlags,
    summary: (parsed.summary ?? "Analysis complete.") + imageSummaryNote,
    recommendation: parsed.recommendation ?? "Manual review recommended.",
    scannedAt: new Date().toISOString(),
    imageAnalysis: {
      imageUrl: item.image || null,
      checked: imageAnalysis?.checked ?? false,
      imageRiskScore,
      isRelevant: imageAnalysis?.isRelevant ?? null,
      isAppropriate: imageAnalysis?.isAppropriate ?? null,
      isPlaceholder: imageAnalysis?.isPlaceholder ?? null,
      relevanceNote: imageAnalysis?.relevanceNote ?? "",
      appropriatenessNote: imageAnalysis?.appropriatenessNote ?? "",
      placeholderNote: imageAnalysis?.placeholderNote ?? "",
      suspiciousText: imageAnalysis?.suspiciousText ?? "none",
      dominantContent: imageAnalysis?.dominantContent ?? "",
      reason: imageAnalysis?.reason ?? null,
    },
    scoreBreakdown: {
      textRiskScore,
      imageRiskScore,
      combinedNote: `Text: ${textRiskScore} × 75% + Image: ${imageRiskScore} × 25% = ${combinedRiskScore}`,
    },
  };
}